/** Restart must not let a replacement mask consume an unobserved independent root. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'
describe('concurrent replace remove restart', () => {
  /**
   * Verifies that a concurrent root insertion remains outside a causally authored
   * replacement, including when the receiving replica is restarted partway through
   * delivery.
   */
  it('keeps a concurrent root outside the causal replace remove', () => {
    const primary = new Projection<string>(1)
    const concurrent = new Projection<string>(2)
    const mutations: Array<Gossip<string>> = [
      primary.insert(['root'], 0), // Primary virtual-root competitor.
      primary.insert(['branch-0', 'branch-1', 'branch-2', 'branch-3'], 0),
      concurrent.insert(['concurrent'], 0), // Unobserved by the replacement author.
      primary.insert(['replaced-head'], 0),
      // The mask names original Frames, so it cannot target the unobserved concurrent root.
      primary.replace(['replacement-0', 'replacement-1'], 0, 1),
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
