import { writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { serialize } from 'node:v8'
import { gzipSync, brotliCompressSync } from 'node:zlib'

crypto.getRandomValues = (words) => {
  words[0] = 0x12345678
  return words
}
const { Projection } = await import(pathToFileURL(process.argv[2]).href)
const count = Number(process.argv[4] ?? 6000)
const median = (values) => values.toSorted((a, b) => a - b)[values.length >> 1]
const samples = []
let sink
for (const layout of ['linear', 'random']) {
  let seed = 0x12345678
  const random = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return (seed >>> 0) / 0x100000000
  }
  const source = new Projection(1)
  for (let i = 0; i < count; ++i)
    source.insert(
      ['x'],
      layout === 'linear'
        ? source.length()
        : Math.floor(random() * (source.length() + 1))
    )
  const snapshot = source.sequence()
  const json = Buffer.from(JSON.stringify(snapshot))
  samples.push({
    layout,
    method: 'storage',
    words: snapshot[0].length,
    jsonBytes: json.length,
    v8Bytes: serialize(snapshot).length,
    gzipBytes: gzipSync(json).length,
    brotliBytes: brotliCompressSync(json).length,
  })
  source.destroy()
  for (const method of ['insert', 'remove', 'replace']) {
    const author = new Projection(2, snapshot)
    const updates = []
    for (let i = 0; i < count; ++i) {
      const at =
        layout === 'linear'
          ? author.length() - 1
          : Math.floor(random() * author.length())
      updates.push(
        method === 'insert'
          ? author.insert([i], at + 1)
          : method === 'remove'
            ? author.remove(at, at)
            : author.replace([i], at, at)
      )
    }
    const expected = author.values()
    author.destroy()
    for (const batch of [1, 64]) {
      const inputs =
        batch === 1
          ? updates
          : Array.from({ length: Math.ceil(count / batch) }, (_, i) =>
              updates.slice(i * batch, (i + 1) * batch).flat()
            )
      const timings = []
      for (let run = 0; run < 6; ++run) {
        const receiver = new Projection(3, snapshot)
        globalThis.gc?.()
        const start = performance.now()
        for (const gossip of inputs) sink = receiver.apply(gossip)
        const elapsed = performance.now() - start
        if (run) timings.push(elapsed)
        if (JSON.stringify(receiver.values()) !== JSON.stringify(expected))
          throw new Error(`${layout}/${method}/${batch}: replay mismatch`)
        receiver.destroy()
      }
      samples.push({
        layout,
        method: `apply.${method}`,
        batch,
        count,
        timings,
        medianMs: median(timings),
      })
    }
    const duplicate = new Projection(3, snapshot)
    duplicate.apply(updates[0])
    const timings = []
    for (let run = 0; run < 6; ++run) {
      const start = performance.now()
      for (let i = 0; i < 100000; ++i) sink = duplicate.apply(updates[0])
      if (run) timings.push(performance.now() - start)
    }
    samples.push({
      layout,
      method: `apply.duplicate.${method}`,
      count: 100000,
      timings,
      medianMs: median(timings),
    })
    duplicate.destroy()
  }
}
sink = undefined
writeFileSync(process.argv[3], JSON.stringify(samples, null, 2))
console.log(
  JSON.stringify(
    samples.map(({ timings, ...row }) => row),
    null,
    2
  )
)
