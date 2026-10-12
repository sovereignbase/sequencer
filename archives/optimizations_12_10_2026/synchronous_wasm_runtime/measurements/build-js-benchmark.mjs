import { build } from 'esbuild'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { readFile } from 'node:fs/promises'
await build({
  entryPoints: ['C:/Users/jorts/sequencertemp/src/class.ts'],
  bundle: true,
  platform: 'neutral',
  format: 'esm',
  target: 'es2024',
  outfile: 'temp/performance/js-model.js',
})
await build({
  entryPoints: ['benchmark/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'es2024',
  packages: 'external',
  outfile: 'temp/performance/bench-js.mjs',
  plugins: [
    {
      name: 'javascript-model',
      setup(build) {
        build.onResolve({ filter: /\/dist\/index\.js$/ }, () => ({
          path: pathToFileURL(resolve('temp/performance/js-model.js')).href,
          external: true,
        }))
        // The TS model is GC-owned. These three cleanup sites are outside timers.
        build.onLoad(
          { filter: /benchmark[\\/]lifecycle[\\/]index\.ts$/ },
          async ({ path }) => ({
            contents: (await readFile(path, 'utf8')).replaceAll(
              '.destroy()',
              '.destroy?.()'
            ),
            loader: 'ts',
          })
        )
      },
    },
  ],
})
