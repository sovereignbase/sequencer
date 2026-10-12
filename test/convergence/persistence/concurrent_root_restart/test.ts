/** Hydration and stale redelivery must retain complete causal subtrees of independent roots. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'
describe('concurrent root restart', () => {
  /**
   * Verifies that a concurrent root and the complete causal subtree of another
   * root survive restart and stale redelivery without becoming interleaved,
   * duplicated, or lost.
   */
  it('preserves complete root subtrees through restart and redelivery', () => {
    const primary = new Projection<string>(1)
    const concurrent = new Projection<string>(2)
    const mutations: Array<Gossip<string>> = [
      primary.insert(['root-0', 'root-1'], 0), // First virtual-root competitor.
      primary.insert(['first'], 0), // Child anchored to the primary root's zero boundary.
      concurrent.insert(['concurrent'], 0), // Independent virtual-root competitor.
      // Primary descendants remain causal children without observing the competing root.
      primary.insert(['third'], 0),
      primary.insert(['fourth'], 0),
      primary.insert(['fifth'], 0),
    ]
    const empty: Sequence<string> = [[], []]
    // Reconstruct the complete history without interruption.
    const ordered = deliver(empty, mutations)
    // Reconstruct the same history with a restart after the third delivery,
    // exercising retained state and subsequent redelivery.
    const restarted = deliver(empty, mutations, 3)
    // Restart and redelivery must not change subtree ownership or ordering.
    expect_converged(ordered, restarted)
    // Every authored Frame must remain present exactly once.
    expect(ordered.length()).toBe(7)
    expect(new Set(ordered.values())).toEqual(
      new Set([
        'concurrent',
        'fifth',
        'fourth',
        'third',
        'first',
        'root-0',
        'root-1',
      ])
    )
  })
})
