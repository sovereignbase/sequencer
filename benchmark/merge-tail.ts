import { performance } from 'node:perf_hooks'
import { create, destroy, find, length, merge } from '../dist/index.js'
import type { Delta } from '../dist/index.js'

const strips = Number(process.argv[2] ?? 256000)
const samples = 32768
const warmup = 8192
const absent = 0xffff_ffff
const projection = new Array<number>(strips * 12)
for (let strip = 0; strip < strips; ++strip) {
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
  for (let word = 0; word < 12; ++word)
    projection[strip * 12 + word] = row[word]
}
const state = create<number>([projection, new Array<number>(strips).fill(0)])
const delta: Delta<number> = [
  [1, 1, 30, 40, 0, 10, 20, strips * 2 - 1, absent, absent, 1, 1],
  [42],
]
const times = new Array<number>(samples)
for (let sample = 0; sample < samples + warmup; ++sample) {
  delta[0][4] = sample * 2
  if (sample !== 0) {
    delta[0][5] = 30
    delta[0][6] = 40
    delta[0][7] = sample * 2 - 1
  }
  const start = performance.now()
  const change = merge(state, delta)
  const elapsed = (performance.now() - start) * 1000
  if (!change || change[strips + sample] !== 42)
    throw new Error('Tail merge returned an incorrect Change')
  for (const index in change)
    if (Number(index) !== strips + sample)
      throw new Error('Tail merge returned an unexpected changed index')
  if (sample >= warmup) times[sample - warmup] = elapsed
}
if (
  length(state) !== strips + samples + warmup ||
  find(state, length(state) - 1) !== 42
)
  throw new Error('Tail merge produced incorrect Footage')
times.sort((left, right) => left - right)
console.log(
  JSON.stringify({
    operation: 'public-merge-new-tail-chain',
    strips,
    samples,
    mean_us: times.reduce((sum, value) => sum + value, 0) / samples,
    median_us: times[Math.floor(samples / 2)],
    p95_us: times[Math.floor(samples * 0.95)],
    max_us: times[samples - 1],
  })
)
destroy(state)
