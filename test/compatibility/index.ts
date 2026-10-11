import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build } from 'tsdown'
import { run as bun } from './bun/index.ts'
import { run as deno } from './deno/index.ts'
import { run as edge } from './edge/index.ts'
import { esm, cjs } from './node/index.ts'
import { browsers, run as browser } from './browsers/index.ts'
import { run as workerd } from './workered/index.ts'
import type { Outcome } from './.shared/suite.ts'

// Bundle once without Node APIs or polyfills for the sandboxed runtimes.
const built = await build({
  config: false,
  entry: fileURLToPath(new URL('./.shared/suite.ts', import.meta.url)),
  format: 'iife',
  globalName: 'Compatibility',
  platform: 'neutral',
  target: 'es2024',
  dts: false,
  write: false,
  clean: false,
  logLevel: 'silent',
})
const chunk = built.bundles[0].chunks.find(
  (chunk) => chunk.type === 'chunk' && chunk.isEntry
)
assert(chunk?.type === 'chunk', 'Missing compatibility bundle')
const source = chunk.code

const runtimes: Array<[string, () => Outcome[] | Promise<Outcome[]>]> = [
  ['node.esm', esm],
  ['node.cjs', cjs],
  ['bun', bun],
  ['deno', deno],
  ['edge', () => edge(source)],
  ['workerd', () => workerd(source)],
  ...Object.keys(browsers).map(
    (name) =>
      [name, () => browser(name as keyof typeof browsers, source)] as [
        string,
        () => Promise<Outcome[]>,
      ]
  ),
]

for (const [name, run] of runtimes) {
  test(name, { timeout: 60_000 }, async (context) => {
    const outcomes = await run()
    assert(outcomes.length > 0, 'Runtime returned no test results')
    for (const { name, error } of outcomes)
      await context.test(name, () => assert.equal(error, null, error ?? name))
  })
}
