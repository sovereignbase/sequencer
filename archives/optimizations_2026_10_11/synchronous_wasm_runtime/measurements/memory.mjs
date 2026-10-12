import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'
const variant = process.argv[2] ?? 'wasm'
const stage = process.argv[3] ?? 'cold'
const { Projection } = await import(
  pathToFileURL(
    resolve(variant === 'js' ? 'temp/performance/js-model.js' : 'dist/index.js')
  ).href
)
if (stage === 'steady') {
  const warm = new Projection(99)
  warm.destroy?.()
}
const gc = async () => {
  globalThis.gc()
  await new Promise((resolve) => setImmediate(resolve))
  globalThis.gc()
}
await gc()
const before = process.memoryUsage()
function create(count) {
  const rows = Array.from({ length: count }, (_, i) => {
    const words = [
        i ? 0xabcdef01 : 0,
        i ? (i - 1) * 51 : 0,
        i ? 50 : 0,
        0xabcdef01,
        i * 51,
        50,
      ],
      footage = new Array(50).fill(i)
    return variant === 'js' ? [...words, footage] : [words, footage]
  })
  return new Projection(1, [[], rows])
}
const projection = create(10000)
await gc()
const after = process.memoryUsage()
const result = {
  variant,
  stage,
  count: 10000,
  frames: projection.length(),
  before,
  after,
  heapDelta: after.heapUsed - before.heapUsed,
  externalDelta: after.external - before.external,
  retainedDelta:
    after.heapUsed - before.heapUsed + after.external - before.external,
}
console.log(result)
await writeFile(
  `temp/performance/memory-${variant}${stage === 'steady' ? '-steady' : ''}.json`,
  JSON.stringify(result, null, 2)
)
projection.destroy?.()
