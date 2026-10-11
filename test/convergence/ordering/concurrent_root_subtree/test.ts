import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'

describe('concurrent root subtree', () => {
  /**
   * Verifies that a complete concurrent root subtree retains its deterministic
   * position even when that subtree is delivered before the competing root.
   *
   * Two replicas begin from the same empty Sequence and independently build
   * their own root subtrees:
   *
   *   primary-5
   *   primary-3
   *   primary-2
   *   primary-root
   *
   *   concurrent-4
   *   concurrent-root
   *
   * The two roots are concurrent, while the descendants within each subtree
   * are causally ordered by their authoring replica.
   *
   * The hostile delivery sends the complete concurrent subtree first:
   *
   *   concurrent-root
   *   concurrent-4
   *
   * before delivering the competing primary root and its descendants.
   *
   * Once both receivers contain the complete operation set, the two root
   * subtrees must occupy the same deterministic Structural Order regardless of
   * delivery order. Descendants belonging to one root must remain with that
   * root rather than becoming interleaved with the competing subtree.
   */
  it('orders a complete concurrent subtree delivered before the other root', () => {
    const primary = new Projection<string>(1)
    const concurrent = new Projection<string>(2)

    const mutations: Array<Gossip<string>> = [
      // Establish the primary root.
      primary.insert(['primary-root'], 0),

      // Establish an independent concurrent root.
      concurrent.insert(['concurrent-root'], 0),

      // Extend the primary subtree at its head.
      primary.insert(['primary-2'], 0),
      primary.insert(['primary-3'], 0),

      // Extend the concurrent subtree at its head.
      concurrent.insert(['concurrent-4'], 0),

      // Extend the primary subtree once more.
      primary.insert(['primary-5'], 0),
    ]

    const empty: Sequence<string> = [[], []]

    // Deliver operations in their original creation order.
    const ordered = deliver(empty, mutations)

    // Deliver the complete concurrent subtree before the competing primary root.
    const hostile = deliver(empty, [
      mutations[1],
      mutations[4],
      mutations[0],
      mutations[2],
      mutations[3],
      mutations[5],
    ])

    // Delivery order must not change the resulting Projection.
    expect_converged(ordered, hostile)

    // Every authored Frame must survive exactly once.
    expect(new Set(ordered.values())).toEqual(
      new Set([
        'concurrent-4',
        'concurrent-root',
        'primary-5',
        'primary-3',
        'primary-2',
        'primary-root',
      ])
    )
  })
})
