/**
 * Group 10 — Structural invariants (`unit/structural`).
 *
 * These tests assert the low-level health of the internal block graph that every
 * higher-level guarantee rests on: it stays acyclic, traversal terminates from
 * both ends, every visible value is reachable exactly once, the id indexes match
 * the stored blocks, the deleted ranges stay normalized, and a full projection
 * rebuild keeps the graph consistent — including for large graphs that must be
 * walked iteratively rather than recursively.
 */

import {
  assert,
  assertEqual,
  assertStructuralIntegrity,
  assertTombstonesNormalized,
  liveProjection,
} from '../lib/assertions.mjs'
import {
  applyDelete,
  applyUpdate,
  applyUpdateValues,
  seededReplica,
} from '../lib/fixtures.mjs'
import { shuffle } from '../lib/random.mjs'

/**
 * Builds a replica exercised by inserts, overwrites, and deletes.
 *
 * Used by several structural tests that only need a non-trivial, well-formed
 * graph to inspect.
 *
 * @param {object} api - The CRList primitive API.
 * @returns {object} The exercised replica.
 */
function exercisedReplica(api) {
  // Seed a base list and apply a representative spread of operations.
  const replica = seededReplica(api, 5)
  void applyUpdateValues(api, replica, 2, ['x', 'y'], 'before')
  void applyUpdate(api, replica, 0, 'new-head', 'overwrite')
  void applyDelete(api, replica, 3, 5)
  void applyUpdate(api, replica, replica.size, 'tail', 'after')
  return replica
}

/**
 * Registers the structural invariant tests.
 *
 * @param {{ api: object, report: object }} context - The suite context.
 */
export function register({ api, report }) {
  // Begin the structural group.
  void report.beginGroup('unit/structural')

  // The internal block graph must remain acyclic after mixed operations.
  void report.test('the internal block graph remains acyclic', () => {
    // A non-trivial replica must pass the cycle-detecting integrity check.
    assertStructuralIntegrity(api, exercisedReplica(api), 'acyclic graph')
  })

  // Forward traversal must terminate.
  void report.test('forward traversal terminates', () => {
    // The bounded forward walk inside the projection helper must complete.
    const replica = exercisedReplica(api)
    assert(
      liveProjection(replica).length === replica.size,
      'forward traversal did not terminate at the reported size'
    )
  })

  // Backward traversal must terminate.
  void report.test('backward traversal terminates', () => {
    // The integrity check walks backward from the tail and must complete.
    assertStructuralIntegrity(api, exercisedReplica(api), 'backward traversal')
  })

  // Head discovery must terminate.
  void report.test('head discovery terminates', () => {
    // The head must be reachable and free of a predecessor.
    const replica = exercisedReplica(api)
    assertEqual(replica.firstBlock.previousBlock, undefined, 'head had a predecessor')
    assertStructuralIntegrity(api, replica, 'head discovery')
  })

  // Tail discovery must terminate.
  void report.test('tail discovery terminates', () => {
    // The tail must be reachable and free of a successor.
    const replica = exercisedReplica(api)
    assertEqual(replica.lastBlock.nextBlock, undefined, 'tail had a successor')
    assertStructuralIntegrity(api, replica, 'tail discovery')
  })

  // Every visible value must be reachable from the live block graph.
  void report.test('every visible value is reachable from the live block graph', () => {
    // The projection length equals the size only if every value is reachable.
    const replica = exercisedReplica(api)
    assertEqual(
      liveProjection(replica).length,
      replica.size,
      'a visible value was unreachable'
    )
  })

  // Every reachable visible value must appear exactly once.
  void report.test(
    'every reachable visible value appears exactly once in the live projection',
    () => {
      // Collect the projected ids and prove there are no duplicates.
      const replica = exercisedReplica(api)
      const ids = liveProjection(replica).map((entry) => entry.id)
      assertEqual(
        new Set(ids).size,
        ids.length,
        'a visible value appeared more than once'
      )
    }
  )

  // Replica size must match the number of reachable visible values.
  void report.test('replica size matches reachable visible values', () => {
    // The integrity check cross-checks size against reachable item count.
    assertStructuralIntegrity(api, exercisedReplica(api), 'size matches reachable')
  })

  // The id indexes must match the stored blocks.
  void report.test('ID indexes match stored blocks', () => {
    // The integrity check verifies every item id resolves to its block and
    // that the id index size equals the live size.
    assertStructuralIntegrity(api, exercisedReplica(api), 'id indexes match')
  })

  // Deleted ranges must remain normalized after many deletes.
  void report.test('deleted ranges remain normalized', () => {
    // Delete several disjoint and adjacent ranges to stress normalization.
    const replica = seededReplica(api, 10)
    void applyDelete(api, replica, 0, 2)
    void applyDelete(api, replica, 3, 4)
    void applyDelete(api, replica, 3, 5)
    assertTombstonesNormalized(replica, 'normalized deleted ranges')
  })

  // Deleted ranges must not overlap incorrectly.
  void report.test('deleted ranges do not overlap incorrectly', () => {
    // Repeated overlapping deletes must collapse rather than overlap.
    const replica = seededReplica(api, 8)
    void applyDelete(api, replica, 1, 4)
    void applyDelete(api, replica, 1, 3)
    assertTombstonesNormalized(replica, 'non-overlapping deleted ranges')
    assertStructuralIntegrity(api, replica, 'after overlapping deletes')
  })

  // Rebuilding the live projection (via shuffled hydration) preserves consistency.
  void report.test(
    'rebuilding the live projection preserves graph consistency',
    () => {
      // Build a replica, then force a full rebuild via shuffled hydration.
      const replica = exercisedReplica(api)
      const snapshot = api.__snapshot(replica)
      const rebuilt = api.__create({
        blocks: shuffle(snapshot.blocks, 4242),
        deletedRuns: shuffle(snapshot.deletedRuns, 2424),
      })

      // The rebuilt graph must be fully consistent.
      assertStructuralIntegrity(api, rebuilt, 'after projection rebuild')
    }
  )

  // Large block graphs must not require recursive traversal.
  void report.test('large block graphs do not require recursive traversal', () => {
    // Build a large linear graph through batch appends.
    const replica = api.__create()
    const batch = Array.from({ length: 5_000 }, (_, index) => `n-${index}`)
    void applyUpdateValues(api, replica, 0, batch, 'after')

    // Walking the whole graph (forward and backward) must complete iteratively.
    assertEqual(replica.size, 5_000, 'large graph lost values')
    assertStructuralIntegrity(api, replica, 'after large graph build')
  })
}
