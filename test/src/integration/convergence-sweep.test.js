import test from 'node:test'
import assert from 'node:assert/strict'
import * as api from '../../dist/index.js'
import {
  runConvergenceScenario,
  formatStressFailure,
} from '../e2e/shared/lib/stress.mjs'

/**
 * Wide deterministic convergence sweep.
 *
 * This sweep exercises the headline CRDT guarantee far more aggressively than
 * the fast in-suite stress: it runs many seeded concurrent-edit scenarios and
 * requires every delivery mode (ordered, shuffled, duplicate, delayed, restart)
 * to converge to the same live projection.
 *
 * KNOWN OPEN BUG (to be fixed in the library, not the test): for a minority of
 * delivery orders a re-anchored successor's position depends on the order in
 * which concurrent insert/delete deltas arrive, so a small fraction of seeds
 * diverge. The first such seed in this band is 500025. This test is therefore
 * EXPECTED TO FAIL today; it stays red on purpose so the regression is visible
 * and reproducible until the merge-ordering bug is fixed. When the library is
 * fixed this test will pass with no changes.
 *
 * The failure prints the seed, scenario, operation count, replica count, failed
 * invariant, expected and actual projections, the exact replay command, and the
 * full operation trace, so the divergence can be reproduced with:
 *
 *   npm run stress -- --seed <seed>
 */
test('replicas converge across a wide deterministic seed sweep', () => {
  // Sweep a deterministic band of seeds known to contain the divergence.
  const firstSeed = 500_000
  const seedCount = 100

  // Collect the first diverging scenario, if any.
  let firstFailure

  // Run every seed in the band until a divergence is found.
  for (let offset = 0; offset < seedCount; offset++) {
    // Derive a varied but fully seed-determined scenario shape.
    const seed = firstSeed + offset
    const result = runConvergenceScenario(api, {
      name: `sweep-${seed}`,
      seed,
      replicaCount: 3 + (seed % 4),
      rounds: 5 + (seed % 8),
      baseSize: seed % 7,
    })

    // Capture the first failing scenario and stop sweeping.
    if (!result.ok) {
      firstFailure = result
      break
    }
  }

  // No divergence means the library has been fixed; the test passes.
  if (!firstFailure) return

  // Print the complete, reproducible failure report for the diverging seed.
  console.error(formatStressFailure(firstFailure))

  // Fail explicitly, naming this as the known open convergence bug.
  assert.fail(
    `KNOWN OPEN CONVERGENCE BUG: scenario ${firstFailure.name} (seed ` +
      `${firstFailure.seed}) diverged under ${firstFailure.failure.mode} ` +
      `delivery. Reproduce with: npm run stress -- --seed ${firstFailure.seed}`
  )
})
