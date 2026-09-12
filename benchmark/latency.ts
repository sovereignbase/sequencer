import { performance } from 'node:perf_hooks'
import {
  create,
  find,
  insert,
  length,
  merge,
  remove,
  replace,
} from '../dist/index.js'
import type { Delta } from '../dist/index.js'

const absent = 0xffff_ffff
const sizes = process.argv.slice(2).map(Number)
if (sizes.length === 0) sizes.push(100, 1000, 10000, 100000)
let resultSink: unknown

function measure(
  name: string,
  count: number,
  operation: (sample: number) => unknown
) {
  const times = new Array<number>(count)
  for (let sample = 0; sample < count; ++sample) {
    const start = performance.now()
    const result = operation(sample)
    times[sample] = (performance.now() - start) * 1000
    if (result === false) throw new Error(name + ' rejected the operation')
    resultSink = result
  }
  times.sort((left, right) => left - right)
  return {
    operation: name,
    calls: count,
    mean_us: times.reduce((total, value) => total + value, 0) / count,
    median_us: times[Math.floor(count / 2)],
    p95_us: times[Math.floor(count * 0.95)],
    max_us: times[count - 1],
  }
}

for (const stripCount of sizes) {
  if (!Number.isSafeInteger(stripCount) || stripCount < 1)
    throw new RangeError('Strip counts must be positive integers')
  const projection = new Array<number>(stripCount * 12)
  const footage = new Array<number>(stripCount)
  for (let strip = 0; strip < stripCount; ++strip) {
    const start = strip * 12
    const row = [
      1,
      1,
      10,
      20,
      strip * 2,
      strip === 0 ? 0 : 10,
      strip === 0 ? 0 : 20,
      strip === 0 ? 0 : strip * 2 - 1,
      absent,
      absent,
      1,
      strip === 0 ? 0 : 1,
    ]
    for (let word = 0; word < 12; ++word) projection[start + word] = row[word]
    footage[strip] = strip
  }
  const state = create<number>([projection, footage])
  const payload = [42]
  let seed = 123456789
  const randomIndex = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return (seed >>> 0) % length(state)
  }
  for (let warmup = 0; warmup < 512; ++warmup) {
    const index = randomIndex()
    find(state, index)
    insert(state, index, payload)
    remove(state, index, index + 1)
  }
  const count = 1024
  const indices = Array.from({ length: count }, randomIndex)
  const metrics = [
    measure('find', count, (sample) => find(state, indices[sample])),
    measure('insert', count, (sample) =>
      insert(state, indices[sample], payload)
    ),
    measure('remove', count, (sample) =>
      remove(state, indices[sample], indices[sample] + 1)
    ),
    measure('replace', count, (sample) =>
      replace(state, indices[sample], payload)
    ),
  ]
  const tail: Delta<number> = [
    [1, 1, 30, 40, 0, 10, 20, stripCount * 2 - 1, absent, absent, 1, 1],
    payload,
  ]
  metrics.push(
    measure('merge-new-tail', 128, (sample) => {
      tail[0][4] = sample * 2
      return merge(state, tail)
    })
  )
  const head: Delta<number> = [
    [0, 1, 50, 60, 0, 10, 20, 0, absent, absent, 1, 0],
    payload,
  ]
  metrics.push(
    measure('merge-new-head', 16, (sample) => {
      head[0][4] = sample * 2
      return merge(state, head)
    })
  )
  metrics.push(
    measure('merge-duplicate', count, () => {
      merge(state, head)
    })
  )
  console.log(JSON.stringify({ stripCount, metrics }))
}

if (resultSink === null) throw new Error('Unexpected benchmark result')
