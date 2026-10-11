import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'

describe('concurrent root restart', () => {
  /**
   * Verifies that a concurrent root and the complete causal subtree of another
   * root survive restart and stale redelivery without becoming interleaved,
   * duplicated, or lost.
   *
   * `primary` creates a two-Frame root and then repeatedly inserts descendants
   * at its head:
   *
   *   fifth
   *   fourth
   *   third
   *   first
   *   root-0
   *   root-1
   *
   * `concurrent` independently creates another root from the same empty
   * Sequence. It therefore competes with the complete primary root subtree
   * rather than becoming one of its descendants.
   *
   * The same Gossip history is reconstructed once continuously and once with
   * a restart after the concurrent root has been delivered. Both paths must
   * converge to the same seven Frames and preserve every authored value exactly
   * once.
   */
  it('preserves complete root subtrees through restart and redelivery', () => {
    const primary = new Projection<string>(1)
    const concurrent = new Projection<string>(2)

    const mutations: Array<Gossip<string>> = [
      // Establish the primary root with two Frames.
      primary.insert(['root-0', 'root-1'], 0),

      // Extend the primary root subtree at its head.
      primary.insert(['first'], 0),

      // Create an independent concurrent root.
      concurrent.insert(['concurrent'], 0),

      // Continue extending the primary subtree without observing the
      // concurrent root.
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
    expect(ordered.projectionFrameCount).toBe(7)

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
