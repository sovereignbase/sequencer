import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip } from '../../../../src/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'

describe('overlapping remove gate', () => {
  /**
   * Verifies that remote overlapping reducing operations keep the receiver's
   * gate on surviving content with the correct visible index.
   *
   * Three replicas begin from the same retained two-Frame Sequence. They then
   * independently author overlapping removals, a replacement, and additional
   * insertions around the same original region.
   *
   * The resulting Structural Order contains positive insertions together with
   * multiple removals covering overlapping historical Frames.
   *
   * The complete operation set is reconstructed twice:
   *
   * - `ordered` receives the mutations in their authored collection order;
   * - `unordered` receives exactly the same mutations in a deliberately reordered
   *   sequence beginning with later removals.
   *
   * Both receivers must converge to the same Projection. If a removal consumes
   * the unordered receiver's gate, it follows neighbouring surviving content.
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
      // Remove the complete original base from replica 2.
      replicas[2].remove(0, 1),

      // Concurrently insert through the original middle boundary.
      replicas[0].insert(['middle-0', 'middle-1'], 1),

      // Extend replica 2 again from its now-empty visible head.
      replicas[2].insert(['tail-0', 'tail-1', 'tail-2'], 0),

      // Concurrently replace the complete original base on replica 1.
      replicas[1].replace(['replacement-0', 'replacement-1'], 0, 1),

      // Remove that replacement locally, adding another reducing operation over
      // the same historical region.
      replicas[1].remove(0, 1),

      // Remove one Frame from replica 2's newly inserted Footage.
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

    // Check the retained cursor before convergence lookups move the local gate.
    let position = 0
    let strip = unordered.structuralHead
    while (strip && strip !== unordered.gate) {
      position += Math.max(0, strip.fragmentDiff ?? strip.insertionDiff)
      strip = strip.rightStep
    }
    expect(strip).toBeDefined()
    expect(strip!.fragmentDiff ?? strip!.insertionDiff).toBeGreaterThan(0)
    expect(unordered.gatePosition).toBe(position)

    // Delivery order must not change the visible Projection.
    expect_converged(ordered, unordered)
  })
})
