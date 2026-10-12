import { build } from 'esbuild'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
for (const name of ['before', 'after'])
  await build({
    entryPoints: ['benchmark/throughput/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'es2024',
    packages: 'external',
    outfile: `temp/performance/paired-${name}.mjs`,
    plugins: [
      {
        name: 'same-public-harness',
        setup(build) {
          build.onResolve({ filter: /\/dist\/index\.js$/ }, () => ({
            path: pathToFileURL(
              resolve(
                name === 'before'
                  ? 'temp/performance/sync-map-dist/index.js'
                  : 'dist/index.js'
              )
            ).href,
            external: true,
          }))
          build.onLoad(
            { filter: /benchmark[\\/]throughput[\\/]index\.ts$/ },
            ({ path }) => ({
              contents:
                readFileSync(path, 'utf8') +
                '\nexport {initialSequence, prepare, burst};',
              loader: 'ts',
            })
          )
        },
      },
    ],
  })
const before = await import('./paired-before.mjs'),
  after = await import('./paired-after.mjs')
const { Random, seedFromString, deriveSeed } =
  await import('../../benchmark/.shared/support.ts')
const { parseConfig } = await import('../../benchmark/index.ts')
const config = parseConfig([
  '--suite',
  'throughput',
  '--runs',
  '5',
  '--max-strips',
  '10000',
  '--burst-ms',
  '100',
  '--max-calls',
  '10000',
  '--warmup-cycles',
  '64',
])
const seed = seedFromString(config.baseSeed),
  rows = []
for (const size of config.checkpoints) {
  const sequence = before.initialSequence(
    size,
    new Random(deriveSeed(seed, `run:0:size:${size}`)),
    config
  )
  for (const operation of before.throughputCases) {
    const caseSeed = deriveSeed(seed, `run:0:size:${size}:${operation}`)
    for (const implementation of [before, after])
      implementation.burst(
        implementation.prepare(operation, sequence, new Random(caseSeed), {
          ...config,
          maximumCalls: 64,
        }),
        operation,
        { ...config, maximumCalls: 64 }
      )
    for (let run = 0; run < 5; run++)
      for (const variant of run % 2
        ? ['after', 'before']
        : ['before', 'after']) {
        const implementation = variant === 'before' ? before : after
        const work = implementation.prepare(
          operation,
          sequence,
          new Random(caseSeed),
          config
        )
        globalThis.gc?.()
        await new Promise((resolve) => setImmediate(resolve))
        globalThis.gc?.()
        const metric = implementation.burst(work, operation, config)
        work.state.destroy()
        rows.push({ size, operation, run, variant, metric })
      }
    writeFileSync(
      'temp/performance/final-paired-suite.json',
      JSON.stringify({ config, rows }, null, 2)
    )
  }
  console.log(size, 'complete')
}
