import { build } from 'esbuild'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const native = resolve(root, 'temp/snapshot-bridge.cjs')
const result = await build({
  absWorkingDir: root,
  entryPoints: ['test/wasm/snapshot.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'temp/snapshot-roundtrip.cjs',
  plugins: [
    {
      name: 'fresh-snapshot-wasm',
      setup(builder) {
        builder.onResolve({ filter: /\/raw\/sequencer_wasm\.mjs$/ }, () => ({
          path: native,
        }))
        builder.onLoad({ filter: /snapshot-bridge\.cjs$/ }, async () => ({
          contents: (await readFile(native, 'utf8')).replace(
            /^async function Module/,
            'function Module'
          ),
          loader: 'js',
        }))
      },
    },
  ],
})
if (result.errors.length === 0)
  await import(pathToFileURL(resolve(root, 'temp/snapshot-roundtrip.cjs')).href)
