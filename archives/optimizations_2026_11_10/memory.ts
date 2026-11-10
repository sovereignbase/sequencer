/** Measures live Projection allocation in one Wasm instance; run with --expose-gc. */
import { build } from 'tsdown'
import { dirname, resolve } from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { gzipSync, brotliCompressSync } from 'node:zlib'
import { minify } from 'terser'
import { strict as assert } from 'node:assert'
const [
  sourceRoot = 'src',
  output = 'temp/projection-memory.json',
  distributionRoot = 'dist',
] = process.argv.slice(2)
const root = resolve(sourceRoot).replaceAll('\\', '/')
await mkdir(dirname(resolve(output)), { recursive: true })
const entry = resolve(output.replace(/\.json$/, '') + '-library.ts')
await writeFile(
  entry,
  `export { Projection } from '${root}/typescript/class.ts';\nexport { runtime } from '${root}/typescript/runtime/client.ts';\nexport { default as module } from '${root}/typescript/wasm/index.ts';\n`
)
const bundle = await build({
  config: false,
  entry,
  format: 'iife',
  globalName: 'MeasuredLibrary',
  target: 'es2024',
  platform: 'neutral',
  dts: false,
  sourcemap: false,
  write: false,
  clean: false,
  logLevel: 'silent',
})
const code = bundle.bundles[0].chunks.find(
  (chunk) => chunk.type === 'chunk' && chunk.isEntry
).code
const factory = new Function(code + '\nreturn MeasuredLibrary;')
const samples = []
for (let run = 1; run <= 3; ++run) {
  for (const count of [1000, 10000]) {
    for (const shape of ['empty', 'single', 'sequence8', 'tuple8', 'edited8']) {
      const library = factory()
      const instances = new Array(count)
      globalThis.gc?.()
      const heapBefore = process.memoryUsage().heapUsed
      const nativeBefore = library.module._runtime_allocated()
      const start = performance.now()
      for (let i = 0; i < count; ++i) {
        const projection = new library.Projection(
          1,
          undefined,
          shape === 'tuple8' ? { enabled: 1, maxLength: 8 } : undefined
        )
        instances[i] = projection
        if (shape === 'single') projection.insert([i], 0)
        else if (shape !== 'empty') {
          projection.insert([0, 1, 2, 3, 4, 5, 6, 7], 0)
          if (shape === 'edited8')
            for (const at of [3, 0, 7, 2, 5, 1, 6, 4])
              projection.replace([i], at, at)
        }
      }
      const milliseconds = performance.now() - start
      globalThis.gc?.()
      const heapBytes = process.memoryUsage().heapUsed - heapBefore
      const nativeBytes = library.module._runtime_allocated() - nativeBefore
      samples.push({
        run,
        count,
        shape,
        nativeBytes,
        heapBytes,
        wasmCapacityBytes: library.module.HEAPU32.buffer.byteLength,
        milliseconds,
      })
      assert.equal(
        instances[0].length(),
        shape === 'empty' ? 0 : shape === 'single' ? 1 : 8
      )
      for (const projection of instances) projection.destroy()
    }
  }
}
const artifacts = {}
for (const filename of ['index.js', 'index.cjs']) {
  const source = await readFile(resolve(distributionRoot, filename), 'utf8')
  const { code } = await minify(source, {
    module: filename.endsWith('.js'),
    compress: { passes: 3 },
    mangle: true,
    format: { comments: false },
  })
  artifacts[filename] = {
    rawBytes: Buffer.byteLength(source),
    minBytes: Buffer.byteLength(code),
    gzipBytes: gzipSync(code, { level: 9 }).byteLength,
    brotliBytes: brotliCompressSync(code).byteLength,
  }
}
const raw = await readFile(
  resolve(root, 'typescript/wasm/raw/sequencer_wasm.mjs'),
  'utf8'
)
const begin = raw.indexOf('function findWasmBinary(){return binaryDecode(')
const end = raw.indexOf(')}function getBinarySync', begin)
const literal = raw.slice(
  begin + 'function findWasmBinary(){return binaryDecode('.length,
  end
)
const wasm = Uint8Array.from(new Function('return ' + literal)(), (char) => {
  const c = char.charCodeAt(0)
  return (~c >> 8) & c
})
assert.ok(WebAssembly.validate(wasm))
await writeFile(output.replace(/\.json$/, '.wasm'), wasm)
artifacts.wasm = {
  rawBytes: wasm.byteLength,
  gzipBytes: gzipSync(wasm, { level: 9 }).byteLength,
  brotliBytes: brotliCompressSync(wasm).byteLength,
}
const median = (values) => values.toSorted((a, b) => a - b)[values.length >> 1]
const summary = ['empty', 'single', 'sequence8', 'tuple8', 'edited8'].map(
  (shape) => {
    const rows = samples.filter(
      (sample) => sample.shape === shape && sample.count === 10000
    )
    return {
      shape,
      nativeBytesPerInstance: median(
        rows.map((row) => row.nativeBytes / row.count)
      ),
      heapBytesPerInstance: median(
        rows.map((row) => row.heapBytes / row.count)
      ),
      createAndPopulateOpsPerSecond: median(
        rows.map((row) => (row.count * 1000) / row.milliseconds)
      ),
    }
  }
)
await writeFile(
  output,
  JSON.stringify({ sourceRoot, samples, summary, artifacts }, null, 2) + '\n'
)
console.log(JSON.stringify({ summary, artifacts }, null, 2))
