import * as api from '../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../e2e/shared/suite.mjs'

/**
 * Bounded integration stress runner.
 *
 * Runs the full invariant suite with a widened convergence-stress sweep in an
 * isolated process guarded by a watchdog, so a regression that turns a bounded
 * traversal into a hang is reported as a timeout rather than stalling CI. The
 * sweep width is configurable through `CRLIST_STRESS_SCENARIOS`; the heavy,
 * open-ended sweep lives in `test/stress/run.mjs` behind `npm run stress`.
 */

// Abort the process if the bounded sweep has not finished in time.
setTimeout(() => {
  console.error('integration stress watchdog timeout')
  process.exit(124)
}, 30_000).unref()

// Resolve the in-suite stress sweep width from the environment.
const stressScenarios = Number.parseInt(
  process.env.CRLIST_STRESS_SCENARIOS ?? '40',
  10
)

// Run the grouped invariant suite with the configured stress sweep width.
const results = runCRListSuite(api, {
  label: 'integration stress',
  stressScenarios,
})

// Print the per-group correctness report and fail on any failing invariant.
void printResults(results)
void ensurePassing(results)
