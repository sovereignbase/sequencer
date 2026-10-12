import { build } from 'esbuild'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
await build({
  entryPoints: ['benchmark/throughput/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'es2024',
  packages: 'external',
  outfile: 'temp/performance/repro-harness.mjs',
  plugins: [
    {
      name: 'public-workload',
      setup(build) {
        build.onResolve({ filter: /\/dist\/index\.js$/ }, () => ({
          path: pathToFileURL(resolve('dist/index.js')).href,
          external: true,
        }))
        build.onLoad(
          { filter: /benchmark[\\/]throughput[\\/]index\.ts$/ },
          ({ path }) => ({
            contents:
              readFileSync(path, 'utf8') +
              '\nexport {initialSequence,prepare};',
            loader: 'ts',
          })
        )
      },
    },
  ],
})
const { initialSequence, prepare } = await import('./repro-harness.mjs')
const { Random, deriveSeed, seedFromString } =
  await import('../../benchmark/.shared/support.ts')
const { parseConfig } = await import('../../benchmark/index.ts')
const config = parseConfig([
  '--suite',
  'throughput',
  '--max-strips',
  '10000',
  '--max-calls',
  '10000',
])
const seed = seedFromString(config.baseSeed),
  size = 10000,
  run = 3
const sequence = initialSequence(
  size,
  new Random(deriveSeed(seed, `run:${run}:size:${size}`)),
  config
)
const frames = sequence[1].reduce((n, e) => n + e[1].length, 0),
  middle = Math.floor(frames / 2)
let prefix = 0
for (let i = 0; i < sequence[1].length; i++) {
  const length = sequence[1][i][1].length
  if (prefix <= middle && middle < prefix + length)
    console.log(
      'middle',
      frames,
      middle,
      i,
      prefix,
      length,
      sequence[1].slice(i - 2, i + 3).map((e) => [...e[0]])
    )
  prefix += length
}
for (const operation of ['replace.head', 'replace.middle', 'replace.tail']) {
  const work = prepare(
    operation,
    sequence,
    new Random(deriveSeed(seed, `run:${run}:size:${size}:${operation}`)),
    config
  )
  let index = 0
  try {
    for (; index < 10000; index++) work.call(index)
    console.log(operation, 'passed')
  } catch (error) {
    console.log(operation, index, work.state.length(), error.message)
    break
  }
  work.state.destroy()
}
