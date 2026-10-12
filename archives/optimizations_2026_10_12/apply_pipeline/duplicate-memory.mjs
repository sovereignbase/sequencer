import { pathToFileURL } from 'node:url'
import { writeFileSync } from 'node:fs'
crypto.getRandomValues = (x) => {
  x[0] = 0x12345678
  return x
}
const { Projection } = await import(pathToFileURL(process.argv[2]).href)
const source = new Projection(1),
  receiver = new Projection(2)
const batch = []
for (let i = 0; i < 64; ++i) batch.push(...source.insert([i], 0))
receiver.apply(batch)
globalThis.gc()
globalThis.gc()
const before = process.memoryUsage().heapUsed
const begin = performance.now()
for (let i = 0; i < 10000; ++i) receiver.apply(batch)
const ms = performance.now() - begin
globalThis.gc()
globalThis.gc()
const after = process.memoryUsage().heapUsed
if (receiver.length() !== 64) throw Error('duplicate changed length')
const bad = [null, ...batch]
for (let i = 0; i < 1000; ++i) receiver.apply(bad)
globalThis.gc()
globalThis.gc()
const rejectedHeap = process.memoryUsage().heapUsed
writeFileSync(
  process.argv[3],
  JSON.stringify(
    {
      before,
      after,
      retainedHeapGrowth: after - before,
      rejectedHeapGrowth: rejectedHeap - after,
      ms,
    },
    null,
    2
  )
)
source.destroy()
receiver.destroy()
