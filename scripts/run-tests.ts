/** Runs verification and refreshes README and HTML results even when checks fail. */
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { paths, update_reports } from './.shared/test-report.ts'

/** Repository directory used by both runners and their report destinations. */
const root = fileURLToPath(new URL('../', import.meta.url))
const [suite = 'all', ...arguments_] = process.argv.slice(2)
if (!['all', 'vitest', 'compatibility'].includes(suite))
  throw new Error(`Unknown test suite: ${suite}`)

mkdirSync(dirname(paths.vitest), { recursive: true })
// Remove only reports being regenerated so disabled coverage cannot reuse old totals.
if (suite !== 'compatibility') {
  rmSync(paths.vitest, { force: true })
  rmSync(paths.vitestHtml, { force: true })
  rmSync(paths.coverage, { force: true })
}
if (suite !== 'vitest') rmSync(paths.compatibility, { force: true })

let status = 0
/**
 * Executes a runner with visible output and retains any failure for the final exit status.
 * @param args Arguments passed directly to the current Node executable.
 */
function run(args: readonly string[]): void {
  const result = spawnSync(process.execPath, args, {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true,
  })
  if (result.error) console.error(result.error)
  if (result.status !== 0) status ||= result.status ?? 1
}

try {
  if (suite !== 'compatibility')
    run(['node_modules/vitest/vitest.mjs', 'run', ...arguments_])
  // Coverage failures must not prevent the independent compatibility verification.
  if (suite !== 'vitest')
    run([
      '--test',
      '--test-reporter=spec',
      '--test-reporter-destination=stdout',
      '--test-reporter=./scripts/compatibility-report.ts',
      `--test-reporter-destination=${paths.compatibility}`,
      ...(suite === 'compatibility' ? arguments_ : []),
      'test/compatibility/index.ts',
    ])
} finally {
  update_reports()
}
process.exitCode = status
