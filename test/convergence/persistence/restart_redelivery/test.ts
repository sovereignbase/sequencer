/** Arrival reordering, hydration and duplicate prefix replay must preserve the same visible Projection. */
import { describe, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
import {
  deliver,
  expect_converged,
  shuffle_mutations,
} from '../../../.helpers/replica.ts'
describe('restart and redelivery', () => {
  /**
   * Verifies that convergence survives hostile delivery order, reconstruction from
   * a retained Sequence, and later redelivery of already integrated Gossip.
   */
  it('converges through hostile delivery, create, and stale redelivery', () => {
    // Begin from an empty retained Sequence.
    const retained: Sequence<string> = [[], []]
    // Five independent actors each create one concurrent root insertion.
    const mutations: Array<Gossip<string>> = [41, 42, 43, 44, 45].map((actor) =>
      new Projection<string>(actor).insert([`actor-${actor}`], 0)
    )
    // Reference reconstruction in collection order.
    const ordered = deliver(retained, mutations)
    /**
     * Reconstruct the same operation set in a deterministic hostile order and
     * restart the receiver halfway through delivery.
     */
    const restarted = deliver(
      retained,
      shuffle_mutations(mutations, 0xc0ffee),
      Math.ceil(mutations.length / 2)
    )
    /**
     * Redeliver every original mutation after the restarted receiver has
     * already integrated the complete operation set.
     *
     * Duplicate Gossip must be ignored semantically.
     */
    for (const mutation of mutations) restarted.apply(mutation)
    // Recreate one actor directly from the final retained Sequence.
    const compacted_on_create = new Projection<string>(43, restarted.sequence())
    // Arrival order, restart, redelivery, and create-time normalization must all
    // preserve the exact same visible Projection.
    expect_converged(ordered, restarted)
    expect_converged(ordered, compacted_on_create)
  })
})
