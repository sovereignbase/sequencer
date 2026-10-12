/** Overlapping masks must shift the gate only by newly consumed original Frames. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip } from '../../../../src/typescript/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'
describe('overlapping remove gate', () => {
  /**
   * Verifies that remote overlapping reducing operations keep the receiver's gate
   * on surviving content with the correct visible index.
   */
  it('keeps the gate index correct across overlapping removals', () => {
    // Establish the retained two-Frame origin shared by all replicas.
    const seed = new Projection<string>(1)
    seed.insert(['base-0', 'base-1'], 0)
    const sequence = seed.sequence()
    // Fork three independent authors from the same retained Sequence.
    const replicas = [0, 1, 2].map(
      (index) => new Projection<string>(100 + index, sequence)
    )
    const mutations: Array<Gossip<string>> = [
      replicas[2].remove(0, 1), // Mask owns the original base Frames.
      replicas[0].insert(['middle-0', 'middle-1'], 1), // Concurrent content survives that mask.
      replicas[2].insert(['tail-0', 'tail-1', 'tail-2'], 0),
      replicas[1].replace(['replacement-0', 'replacement-1'], 0, 1),
      replicas[1].remove(0, 1), // A later mask owns replacement content, not the earlier base.
      replicas[2].remove(2, 2),
    ]
    // Baseline reconstruction in collection order.
    const ordered = deliver(sequence, mutations)
    // Reconstruct the same operation set in a unordered order where later
    // reducing operations arrive before the historical edits they depend on.
    const unordered = deliver(sequence, [
      mutations[5],
      mutations[4],
      mutations[2],
      mutations[0],
      mutations[3],
      mutations[1],
    ])
    // Delivery order must not change the visible Projection.
    expect_converged(ordered, unordered)
  })
})
