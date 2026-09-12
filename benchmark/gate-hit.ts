import { performance } from 'node:perf_hooks'
import { create, destroy, find, insert } from '../dist/index.js'

const strips = Number(process.argv[2] ?? 100000)
const samples = 1_000_000
const state = create<number>()
for (let strip = 0; strip < strips; ++strip) insert(state, strip, [1])
for (let warmup = 0; warmup < 10000; ++warmup) find(state, strips - 1)

let checksum = 0
const start = performance.now()
for (let sample = 0; sample < samples; ++sample)
  checksum += find(state, strips - 1) as number
const elapsed = performance.now() - start
if (checksum !== samples)
  throw new Error('Gate-hit lookup returned wrong Footage')
console.log(
  JSON.stringify({
    operation: 'public-find-gate-hit-batch',
    strips,
    samples,
    ns_per_call: (elapsed * 1e6) / samples,
    calls_per_second: (samples * 1000) / elapsed,
  })
)
destroy(state)
