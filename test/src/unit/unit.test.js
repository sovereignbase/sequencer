import test from 'node:test'
import * as api from '../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../e2e/shared/suite.mjs'

/**
 * Runs the full CRList semantic invariant suite against the built ESM bundle and
 * prints it as a grouped correctness report. The suite name is intentionally a
 * plain-language guarantee so the node:test summary line reads as a statement of
 * what CRList guarantees rather than as an implementation label.
 */
test('CRList upholds every documented invariant', async () => {
  // Run the grouped invariant suite against the public API surface.
  const results = runCRListSuite(api, { label: 'unit' })

  // Print the per-group correctness report to the console.
  void printResults(results)

  // Fail the node:test case if any invariant did not hold.
  void ensurePassing(results)
})
