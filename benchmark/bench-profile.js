import { __create, __update, __merge, __read } from '../dist/index.js'
import { crlistAdapter as adapter } from './adapters/crlist.js'

const LIST_SIZE = 5_000

function value(id) {
  return { id, payload: { text: `value:${id}`, number: id } }
}

// Setup: create list, take snapshot, create remote
function setup() {
  const source = __create()
  for (let i = 0; i < LIST_SIZE; i++)
    __update(source.size, [value(i)], source, 'after')
  return source
}

const source = setup()
const snapshot = adapter.snapshot(source)
let remote = adapter.hydrate(snapshot)

// Warmup
for (let i = 0; i < 10; i++) {
  const r = __update(source.size, [value(`w${i}`)], source, 'after')
  __merge(remote, r.delta)
}

// Reset
Object.assign(source, adapter.hydrate(snapshot))
Object.assign(remote, adapter.hydrate(snapshot))

const SCAN_OPS = 100

// Profile: pure sequential scan
{
  const start = process.hrtime.bigint()
  for (let op = 0; op < SCAN_OPS; op++) {
    const r = __update(source.size, [value(`op${op}`)], source, 'after')
    __merge(remote, r.delta)
    // Scan remote
    for (let i = 0; i < remote.size; i++) __read(i, remote)
  }
  const ms = Number(process.hrtime.bigint() - start) / 1e6
  const totalReads = SCAN_OPS * (LIST_SIZE + SCAN_OPS / 2)
  console.log(
    `Sequential scan: ${ms.toFixed(2)}ms total, ${(ms / SCAN_OPS).toFixed(3)}ms/op`
  )
  console.log(
    `  ~${Math.round(totalReads / SCAN_OPS)} reads/op, ${((ms * 1e6) / totalReads).toFixed(1)}ns/read`
  )
}

// Reset
const source2 = adapter.hydrate(snapshot)
const remote2 = adapter.hydrate(snapshot)

// Profile: just merge without scan
{
  const start = process.hrtime.bigint()
  for (let op = 0; op < SCAN_OPS; op++) {
    const r = __update(source2.size, [value(`op2${op}`)], source2, 'after')
    __merge(remote2, r.delta)
  }
  const ms = Number(process.hrtime.bigint() - start) / 1e6
  console.log(
    `Merge only: ${ms.toFixed(2)}ms total, ${(ms / SCAN_OPS).toFixed(3)}ms/op`
  )
}

// Profile: cache hit reads only (pre-scan then measure)
const remote3 = adapter.hydrate(snapshot)
for (let i = 0; i < remote3.size; i++) __read(i, remote3) // warm cache
{
  const start = process.hrtime.bigint()
  const N = 10
  for (let n = 0; n < N; n++)
    for (let i = 0; i < remote3.size; i++) __read(i, remote3)
  const ms = Number(process.hrtime.bigint() - start) / 1e6
  const reads = N * remote3.size
  console.log(
    `Cache hit reads: ${ms.toFixed(2)}ms for ${reads} reads = ${((ms * 1e6) / reads).toFixed(1)}ns/read`
  )
}

// Profile: cache miss reads (fresh cursor walk)
const remote4 = adapter.hydrate(snapshot)
{
  const start = process.hrtime.bigint()
  const N = 5
  for (let n = 0; n < N; n++) {
    remote4.cache.clear() // force misses
    remote4.cursor = remote4.cache.get(0) ?? remote4.cursor
    for (let i = 0; i < remote4.size; i++) __read(i, remote4)
  }
  const ms = Number(process.hrtime.bigint() - start) / 1e6
  const reads = N * remote4.size
  console.log(
    `Cache miss reads: ${ms.toFixed(2)}ms for ${reads} reads = ${((ms * 1e6) / reads).toFixed(1)}ns/read`
  )
}
