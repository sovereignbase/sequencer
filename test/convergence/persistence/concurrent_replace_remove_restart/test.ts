import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'

describe('concurrent replace remove restart', () => {
  /**
   * Verifies that a concurrent root insertion remains outside a causally
   * authored replacement, including when the receiving replica is restarted
   * partway through delivery.
   *
   * `primary` builds its own causal history:
   *
   *   root
   *   branch-0, branch-1, branch-2, branch-3, root
   *   replaced-head, branch-0, branch-1, branch-2, branch-3, root
   *
   * It then replaces Projection range [0, 1], removing `replaced-head` and
   * `branch-0` and inserting:
   *
   *   replacement-0, replacement-1
   *
   * Meanwhile, `concurrent` independently inserts its own root-level operation
   * without observing any of that causal replacement history.
   *
   * The replacement Mask must therefore remain scoped to the operations visible
   * to `primary` when the replacement was authored. It must not absorb the
   * concurrent root merely because later reconstruction places that operation
   * beside or inside the same structural region.
   *
   * The same Gossip sequence is reconstructed both continuously and with a
   * restart during delivery. Both paths must converge and preserve the same
   * visible operation set.
   */
  it('keeps a concurrent root outside the causal replace remove', () => {
    const primary = new Projection<string>(1)
    const concurrent = new Projection<string>(2)

    const mutations: Array<Gossip<string>> = [
      // Establish the primary causal root.
      primary.insert(['root'], 0),

      // Insert a multi-Frame branch before the root.
      primary.insert(['branch-0', 'branch-1', 'branch-2', 'branch-3'], 0),

      // Author an independent root-level insertion from another replica.
      // `primary` has not observed this operation when its later replacement
      // is created.
      concurrent.insert(['concurrent'], 0),

      // Extend the primary causal history before the replacement.
      primary.insert(['replaced-head'], 0),

      // Replace `replaced-head` and `branch-0`. The resulting Mask may only
      // remove operations belonging to the replacement's causal origin.
      primary.replace(['replacement-0', 'replacement-1'], 0, 1),

      // Add one final primary insertion after the replacement.
      primary.insert(['final-head'], 0),
    ]

    const empty: Sequence<string> = [[], []]

    // Reconstruct the complete Gossip history without interruption.
    const ordered = deliver(empty, mutations)

    // Reconstruct the same history while restarting during delivery.
    const restarted = deliver(empty, mutations, 3)

    // Restarting must not alter causal ownership or the resulting Projection.
    expect_converged(ordered, restarted)

    // The replaced primary values are gone, while the independently authored
    // concurrent root survives outside the replacement Mask.
    expect(new Set(ordered.values())).toEqual(
      new Set([
        'concurrent',
        'final-head',
        'replacement-0',
        'replacement-1',
        'branch-1',
        'branch-2',
        'branch-3',
        'root',
      ])
    )
  })
})
