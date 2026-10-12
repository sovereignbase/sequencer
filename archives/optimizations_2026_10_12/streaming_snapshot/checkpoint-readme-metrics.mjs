import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { gzipSync } from 'node:zlib'
import { minify } from 'terser'
import { Projection } from '../../../dist/index.js'

const bundles = []
for (const file of ['dist/index.js', 'dist/index.cjs']) {
  const source = readFileSync(file, 'utf8')
  const { code } = await minify(source, {
    module: file.endsWith('.js'),
    compress: { passes: 3 },
    mangle: true,
  })
  bundles.push({
    file,
    raw: Buffer.byteLength(source),
    minified: Buffer.byteLength(code),
    gzip: gzipSync(code).length,
  })
}

const memory = []
for (let run = 0; run < 5; run++) {
  const child = spawnSync(
    process.execPath,
    [
      '--expose-gc',
      'archives/optimizations_2026_10_12/flat_sequence/retained-memory.mjs',
      'dist/index.js',
    ],
    { encoding: 'utf8' }
  )
  if (child.status !== 0) throw Error(child.stderr)
  memory.push(JSON.parse(child.stdout))
}
crypto.getRandomValues = (values) => {
  values.fill(0x12345678)
  return values
}
const p = new Projection(1)
const inserts = []
const removes = []
for (let i = 0; i < 1000; i++) inserts.push(p.insert(['x'], p.length()))
const snapshot = p.sequence()
for (let i = 0; i < 1000; i++) removes.push(p.remove(0, 0))
p.destroy()
const transport = [inserts, removes, snapshot].map((value, i) => {
  const json = JSON.stringify(value)
  return {
    json: Buffer.byteLength(json),
    gzip: gzipSync(json).length,
    average:
      i === 2
        ? Buffer.byteLength(json) / 1000
        : value.reduce(
            (total, entry) => total + Buffer.byteLength(JSON.stringify(entry)),
            0
          ) / 1000,
  }
})
const results = { bundles, memory, transport }
writeFileSync(
  'archives/optimizations_2026_10_12/streaming_snapshot/checkpoint-readme-metrics.json',
  JSON.stringify(results, null, 2) + '\n'
)
console.log(JSON.stringify(results, null, 2))
