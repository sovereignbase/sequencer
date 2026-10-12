import { writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { serialize } from 'node:v8'
import { gzipSync, brotliCompressSync } from 'node:zlib'

let memory
const Instance = WebAssembly.Instance
WebAssembly.Instance = class extends Instance {
  constructor(...args) {
    super(...args)
    memory = Object.values(this.exports).find(
      (value) => value instanceof WebAssembly.Memory
    )
  }
}
crypto.getRandomValues = (words) => {
  words[0] = 0x12345678
  return words
}
const { Projection } = await import(pathToFileURL(process.argv[2]).href)
const count = Number(process.argv[4] ?? 6000)
const modes = process.argv[5]
  ? [process.argv[5]]
  : [
      'append',
      'prepend',
      'random',
      'random.words',
      'random.edits',
      'random.edits.compact',
      'concurrent',
    ]
const median = (values) => values.toSorted((a, b) => a - b)[values.length >> 1]
let sink
const rows = []
for (const mode of modes) {
  let seed = 0x12345678
  const random = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return (seed >>> 0) / 0x100000000
  }
  const p = new Projection(1),
    q = mode === 'concurrent' ? new Projection(2) : undefined
  if (mode === 'random.edits') p.apply([[2]])
  const start = performance.now()
  for (let i = 0; i < count; ++i) {
    const owner = q && i & 1 ? q : p
    const at =
      mode === 'append'
        ? owner.length()
        : mode === 'prepend'
          ? 0
          : Math.floor(random() * (owner.length() + 1))
    let gossip
    if (mode.startsWith('random.edits') && owner.length() && i % 5 === 3)
      gossip = owner.remove(
        Math.min(at, owner.length() - 1),
        Math.min(at, owner.length() - 1)
      )
    else if (mode.startsWith('random.edits') && owner.length() && i % 5 === 4)
      gossip = owner.replace(
        ['y'],
        Math.min(at, owner.length() - 1),
        Math.min(at, owner.length() - 1)
      )
    else
      gossip = owner.insert(
        mode === 'random.words' ? Array.from('sequence') : ['x'],
        at
      )
    if (q) (owner === p ? q : p).apply(gossip)
  }
  const mutationMs = performance.now() - start
  sink = undefined
  globalThis.gc?.()
  globalThis.gc?.()
  const before = {
    heapBytes: process.memoryUsage().heapUsed,
    wasmCapacityBytes: memory.buffer.byteLength,
  }
  const snapshot = p.sequence()
  globalThis.gc?.()
  globalThis.gc?.()
  const after = {
    heapBytes: process.memoryUsage().heapUsed,
    wasmCapacityBytes: memory.buffer.byteLength,
  }
  const json = Buffer.from(JSON.stringify(snapshot))
  const timings = {}
  const size = p.length()
  const cases = {
    length: { calls: 10000, call: () => p.length() },
    value: { calls: 10000, call: (i) => p.value((i * 7919) % size) },
    values: { calls: 100, call: () => p.values() },
    sequence: { calls: 20, call: () => p.sequence() },
    create: {
      calls: 20,
      call: () => {
        const fresh = new Projection(3, snapshot)
        fresh.destroy()
      },
    },
    merge: { calls: 20, call: () => p.merge(snapshot) },
  }
  for (const [method, work] of Object.entries(cases)) {
    const samples = []
    for (let run = 0; run < 6; ++run) {
      globalThis.gc?.()
      const begin = performance.now()
      for (let i = 0; i < work.calls; ++i) sink = work.call(i)
      if (run) samples.push((performance.now() - begin) / work.calls)
      sink = undefined
    }
    timings[method] = { medianMs: median(samples), samples }
  }
  // Generic Footage, JSON and typed metadata; no optimized operation bypass.
  for (const copy of [
    snapshot,
    JSON.parse(json),
    [new Uint32Array(snapshot[0]), snapshot[1]],
  ]) {
    const restored = new Projection(3, copy)
    if (JSON.stringify(restored.values()) !== JSON.stringify(p.values()))
      throw new Error(`${mode}: snapshot mismatch`)
    const future = restored.insert(['future'], restored.length() >> 1)
    const peer = new Projection(4, copy)
    peer.apply(future)
    if (JSON.stringify(peer.values()) !== JSON.stringify(restored.values()))
      throw new Error(`${mode}: future replay mismatch`)
    restored.destroy()
    peer.destroy()
  }
  rows.push({
    mode,
    count,
    frames: p.length(),
    mutationMs,
    before,
    after,
    retainedSnapshotHeapBytes: after.heapBytes - before.heapBytes,
    metadataWords: snapshot[0].length,
    jsonBytes: json.length,
    v8Bytes: serialize(snapshot).length,
    gzipBytes: gzipSync(json).length,
    brotliBytes: brotliCompressSync(json).length,
    timings,
  })
  p.destroy()
  q?.destroy()
}
writeFileSync(process.argv[3], JSON.stringify(rows, null, 2))
console.log(
  JSON.stringify(
    rows.map(({ timings, ...row }) => ({
      ...row,
      timings: Object.fromEntries(
        Object.entries(timings).map(([key, value]) => [key, value.medianMs])
      ),
    })),
    null,
    2
  )
)
