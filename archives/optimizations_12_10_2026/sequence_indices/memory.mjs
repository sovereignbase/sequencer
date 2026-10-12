import { pathToFileURL } from 'node:url'
import { writeFileSync } from 'node:fs'
import { serialize } from 'node:v8'
let memory
const Instance = WebAssembly.Instance
WebAssembly.Instance = class extends Instance {
  constructor(...args) {
    super(...args)
    memory = Object.values(this.exports).find(value => value instanceof WebAssembly.Memory)
  }
}
const { Projection } = await import(pathToFileURL(process.argv[2]).href)
crypto.getRandomValues = (values) => { values[0] = 0x12345678; return values }
let seed = 0x12345678
const random = () => {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5
  return (seed >>> 0) / 0x100000000
}
const p = new Projection(1)
for (let i = 0; i < 6000; ++i) p.insert(['x'], Math.floor(random() * (p.length() + 1)))
globalThis.gc(); globalThis.gc()
const before = { heap: process.memoryUsage().heapUsed, wasmCapacity: memory.buffer.byteLength }
const snapshot = p.sequence()
globalThis.gc(); globalThis.gc()
const after = { heap: process.memoryUsage().heapUsed, wasmCapacity: memory.buffer.byteLength }
writeFileSync(process.argv[3], JSON.stringify({ before, after,
  retainedSnapshotHeap: after.heap - before.heap, words: snapshot[0].length,
  json: JSON.stringify(snapshot).length, v8: serialize(snapshot).length }, null, 2))
p.destroy()
