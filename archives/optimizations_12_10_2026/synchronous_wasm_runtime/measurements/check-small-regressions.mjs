import { build } from 'esbuild'
import { readFileSync, writeFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
const variant = process.argv[2]
if (!variant) {
  for (let repeat = 0; repeat < 5; repeat++)
    for (const name of repeat % 2 ? ['after', 'before'] : ['before', 'after']) {
      const r = spawnSync(
        process.execPath,
        ['--expose-gc', import.meta.filename, name, String(repeat)],
        { encoding: 'utf8', maxBuffer: 2000000 }
      )
      writeFileSync(
        `temp/performance/small-${name}-${repeat}.log`,
        r.stdout + r.stderr
      )
      if (r.status) throw new Error(r.stderr)
      console.log(name, repeat, 'complete')
    }
} else {
  await build({
    entryPoints: ['benchmark/throughput/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'es2024',
    packages: 'external',
    outfile: `temp/performance/small-${variant}.mjs`,
    plugins: [
      {
        name: 'public-runtime',
        setup(b) {
          b.onResolve({ filter: /\/dist\/index\.js$/ }, () => ({
            path: pathToFileURL(
              resolve(
                variant === 'before'
                  ? 'temp/performance/sync-map-dist/index.js'
                  : 'dist/index.js'
              )
            ).href,
            external: true,
          }))
          b.onLoad(
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
  const api = await import(`./small-${variant}.mjs`)
  const { Random, seedFromString, deriveSeed } =
    await import('../../benchmark/.shared/support.ts')
  const config = {
    maximumCalls: 10000,
    burstMilliseconds: 100,
    minimumStripFrameLength: 1,
    maximumStripFrameLength: 100,
    warmupCycles: 64,
    baseSeed: 'sequencer-lifecycle-v1',
  }
  const seed = seedFromString(config.baseSeed),
    rows = []
  const cases = [
    [100, 'replace.head'],
    [100, 'value.sameIndex'],
    [1000, 'value.head'],
    [1000, 'value.tail'],
    [10000, 'value.middle'],
    [10000, 'value.sameIndex'],
    [10000, 'value.tail'],
    [10000, 'length'],
  ]
  for (const [size, operation] of cases) {
    const sequence = api.initialSequence(
      size,
      new Random(deriveSeed(seed, `run:0:size:${size}`)),
      config
    )
    const caseSeed = deriveSeed(seed, `run:0:size:${size}:${operation}`)
    const warm = api.prepare(operation, sequence, new Random(caseSeed), {
      ...config,
      maximumCalls: 64,
    })
    api.burst(warm, operation, { ...config, maximumCalls: 64 })
    warm.state.destroy()
    const work = api.prepare(operation, sequence, new Random(caseSeed), config)
    globalThis.gc()
    await new Promise((resolve) => setImmediate(resolve))
    globalThis.gc()
    const metric = api.burst(work, operation, config)
    work.state.destroy()
    rows.push({ size, operation, metric })
  }
  writeFileSync(
    `temp/performance/small-${variant}-${process.argv[3]}.json`,
    JSON.stringify(rows, null, 2)
  )
}
