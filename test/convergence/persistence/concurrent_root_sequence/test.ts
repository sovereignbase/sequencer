/** Snapshot reconstruction must preserve the resolved order of several concurrent root subtrees. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'
describe('concurrent root sequence', () => {
  /**
   * Verifies that three independently authored root subtrees retain one
   * deterministic Structural Order and that the same Projection is reconstructed
   * from a retained Sequence.
   */
  it('recreates three concurrent root subtrees in deterministic order', () => {
    const primary = new Projection<string>(0)
    const second = new Projection<string>(1)
    const third = new Projection<string>(2)
    const mutations: Array<Gossip<string>> = [
      primary.insert(['primary-root'], 0), // Primary virtual-root competitor.
      primary.insert(['primary-1'], 0), // Child belongs to the primary root's subtree.
      second.insert(['second-root'], 0),
      third.insert(['third-root'], 0), // Third independent virtual-root competitor.
      // Further primary edits do not depend on either independently authored root.
      primary.insert(['primary-4'], 0),
      primary.insert(['primary-5'], 0),
    ]
    const empty: Sequence<string> = [[], []]
    // Materialize the complete concurrent operation set.
    const ordered = deliver(empty, mutations)
    // Recreate a fresh live Projection directly from the retained Sequence.
    const recreated = new Projection<string>(3, ordered.sequence())
    // Recreation must preserve the complete visible Projection exactly.
    expect_converged(ordered, recreated)
    // Every authored Frame must survive exactly once.
    expect(new Set(ordered.values())).toEqual(
      new Set([
        'third-root',
        'second-root',
        'primary-5',
        'primary-4',
        'primary-1',
        'primary-root',
      ])
    )
  })
})
