import { readFile } from 'node:fs/promises'
import { gzipSync as gzip } from 'node:zlib'
import { resolve } from 'node:path'
import { minify } from 'terser'

/** Measures raw, minified, and minified-plus-gzip public bundles. */
export async function measure_bundle_sizes() {
  const repository_directory = resolve(import.meta.dirname, '..', '..')
  const formats = [
    { name: 'ESM', file_name: 'index.js', module: true },
    { name: 'CommonJS', file_name: 'index.cjs', module: false },
  ]

  return Promise.all(
    formats.map(async (format) => {
      const source = await readFile(
        resolve(repository_directory, 'dist', format.file_name),
        'utf8'
      )
      const minified = await minify(source, {
        module: format.module,
        compress: true,
        mangle: true,
      })
      if (!minified.code)
        throw new TypeError(`Terser returned no ${format.name} bundle.`)
      return {
        format: format.name,
        raw_bytes: Buffer.byteLength(source),
        minified_bytes: Buffer.byteLength(minified.code),
        minified_gzip_bytes: gzip(minified.code, { level: 9 }).byteLength,
      }
    })
  )
}
