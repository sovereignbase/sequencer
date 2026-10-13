import { readFile } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'
import type { BundleSizes } from './types.ts'

/** Measures emitted bundles after API benchmarking, keeping minification outside measurements. */
export async function measureBundles(): Promise<BundleSizes> {
  const { minify } = await import('terser')
  const sizes = {} as BundleSizes
  for (const [format, file] of [
    ['ESM', 'index.js'],
    ['CommonJS', 'index.cjs'],
  ] as const) {
    const source = await readFile(
      new URL(`../../dist/${file}`, import.meta.url),
      'utf8'
    )
    const result = await minify(source, {
      module: format === 'ESM',
      compress: { passes: 3 },
      mangle: true,
      format: { comments: false },
    })
    if (!result.code) throw new Error(`Empty minified ${format} bundle`)
    sizes[format] = {
      rawBytes: Buffer.byteLength(source),
      minifiedBytes: Buffer.byteLength(result.code),
      gzipBytes: gzipSync(result.code, { level: 9 }).byteLength,
    }
  }
  return sizes
}
