import { readFileSync, writeFileSync } from 'node:fs'
import { gzipSync, brotliCompressSync } from 'node:zlib'
import { createHash } from 'node:crypto'
const variants = {
  initial: 'temp/performance/sync-map-dist',
  beforeLto: 'temp/performance/pre-lto-dist',
  final: 'dist',
}
const result = {}
for (const [name, directory] of Object.entries(variants)) {
  const source = readFileSync(directory + '/index.js', 'utf8')
  const token = 'binaryDecode('
  const start =
    source.indexOf(token, source.indexOf(token) + token.length) + token.length
  let end = start + 1
  while (end < source.length) {
    if (source[end] === '\\') {
      end += 2
      continue
    }
    if (source[end] === source[start]) break
    end++
  }
  const embedded = Function('return ' + source.slice(start, end + 1))()
  const wasm = Uint8Array.from(embedded, (c) => {
    const code = c.charCodeAt(0)
    return (~code >> 8) & code
  })
  writeFileSync(`temp/performance/${name}-sync.wasm`, wasm)
  const size = (data) => ({
    bytes: data.length,
    gzip: gzipSync(data).length,
    brotli: brotliCompressSync(data).length,
    sha256: createHash('sha256').update(data).digest('hex'),
  })
  result[name] = {
    wasm: size(wasm),
    esm: size(readFileSync(directory + '/index.js')),
    cjs: size(readFileSync(directory + '/index.cjs')),
  }
}
writeFileSync(
  'temp/performance/sizes-sync.json',
  JSON.stringify(result, null, 2)
)
console.log(result)
