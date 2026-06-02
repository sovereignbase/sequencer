import test from 'node:test'
import * as api from '../../dist/index.js'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../e2e/shared/suite.mjs'

const STRESS_RUNNER_TIMEOUT_MS = 120_000

/**
 * Runs the full invariant suite with a widened convergence-stress sweep, then
 * runs the dedicated bounded integration stress runner in a separate process so
 * a hang there cannot stall the in-process suite. This is the CI-fast layer; the
 * heavy long-running sweep lives behind `npm run stress`.
 */
test('CRList replicas converge under the integration invariant suite', async () => {
  // Run the grouped invariant suite with a wider in-suite stress sweep.
  const results = runCRListSuite(api, {
    label: 'integration',
    includeStress: true,
  })

  // Print the per-group correctness report to the console.
  void printResults(results)

  // Fail if any invariant did not hold.
  void ensurePassing(results)

  // Resolve the bounded integration stress runner script.
  const stressRunner = resolve(
    process.cwd(),
    'test',
    'integration',
    'convergence-stress-runner.mjs'
  )

  // Run the bounded stress runner in a separate process with its own watchdog.
  const result = spawnSync(process.execPath, [stressRunner], {
    stdio: 'inherit',
    timeout: STRESS_RUNNER_TIMEOUT_MS,
  })

  // Surface a spawn error directly.
  if (result.error) throw result.error

  // Fail the test if the stress runner exited non-zero.
  if (result.status !== 0)
    throw new Error(`integration stress exited with ${result.status ?? 1}`)
})
