import { performance } from 'node:perf_hooks'
import { gzipSync, brotliCompressSync } from 'node:zlib'
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
const [artifact, output] = process.argv.slice(2)
const { Projection } = await import(pathToFileURL(artifact).href)
const samples = []
for (let run = 0; run < 5; run++) {
  const p = new Projection(1),
    r = new Projection(2),
    g = []
  let t = performance.now()
  for (let i = 0; i < 6000; i++) g.push(p.insert(['x'], p.length()))
  const insert = performance.now() - t
  t = performance.now()
  for (const packet of g) r.apply(structuredClone(packet))
  const apply = performance.now() - t
  t = performance.now()
  const s = p.sequence()
  const sequence = performance.now() - t
  t = performance.now()
  const restored = new Projection(3, s)
  const create = performance.now() - t
  t = performance.now()
  for (let i = 0; i < 6000; i++) p.value((i * 37) % 6000)
  const read = performance.now() - t
  t = performance.now()
  for (let i = 0; i < 100; i++) p.values()
  const values = performance.now() - t
  const bytes = Buffer.from(JSON.stringify(s))
  samples.push({
    insert,
    apply,
    sequence,
    create,
    read,
    values,
    strips: s[1].length,
    json: bytes.length,
    gzip: gzipSync(bytes).length,
    brotli: brotliCompressSync(bytes).length,
  })
  p.destroy()
  r.destroy()
  restored.destroy()
  g.length = 0
  global.gc?.()
}
const source = readFileSync(artifact)
const result = {
  node: process.version,
  samples,
  bundle: {
    raw: source.length,
    gzip: gzipSync(source).length,
    brotli: brotliCompressSync(source).length,
  },
}
writeFileSync(output, JSON.stringify(result, null, 2))
console.log(JSON.stringify(result))
