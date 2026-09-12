import { performance } from 'node:perf_hooks'
import { create, destroy, find, insert, length } from '../dist/index.js'

const stripCount = Number(process.argv[2] ?? 100000)
const samples = Number(process.argv[3] ?? 8192)
const payload = [42]

for (const mode of ['head', 'tail', 'alternating']) {
  const state = create<number>()
  for (let strip = 0; strip < stripCount; ++strip) {
    if (!insert(state, strip, payload)) throw new Error('Seed insertion failed')
  }
  const times = new Array<number>(samples)
  let count = stripCount
  const headInsert = () => insert(state, 0, payload)
  const tailInsert = () => insert(state, count, payload)
  for (let warmup = 0; warmup < 1024; ++warmup) {
    if (!(mode === 'head' ? headInsert() : tailInsert()))
      throw new Error('Warmup insertion failed')
    ++count
  }
  function measure() {
    for (let sample = 0; sample < samples; ++sample) {
      const operation =
        mode === 'head' || (mode === 'alternating' && sample % 2 === 0)
          ? headInsert
          : tailInsert
      const start = performance.now()
      const delta = operation()
      times[sample] = (performance.now() - start) * 1000
      if (!delta) throw new Error('Measured insertion failed')
      ++count
    }
  }
  measure()
  if (
    length(state) !== count ||
    find(state, 0) !== 42 ||
    find(state, count - 1) !== 42
  )
    throw new Error('Projection verification failed')
  times.sort((left, right) => left - right)
  console.log(
    JSON.stringify({
      mode,
      stripCount,
      samples,
      mean_us: times.reduce((total, value) => total + value, 0) / samples,
      median_us: times[Math.floor(samples / 2)],
      p95_us: times[Math.floor(samples * 0.95)],
      max_us: times[samples - 1],
    })
  )
  destroy(state)
}
