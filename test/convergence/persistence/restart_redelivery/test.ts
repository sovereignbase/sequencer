import { describe, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'
import {
  deliver,
  expect_converged,
  shuffle_mutations,
} from '../../../.helpers/replica.ts'

describe('restart and redelivery', () => {
  /**
   * Verifies that convergence survives hostile delivery order, reconstruction
   * from a retained Sequence, and later redelivery of already integrated Gossip.
   *
   * Five independent actors each create one concurrent root insertion against
   * an empty Sequence.
   *
   * The same operation set is then reconstructed through two paths:
   *
   * - `ordered` receives all five mutations in their original collection order;
   * - `restarted` receives the same mutations in a deterministic shuffled order
   *   and is recreated partway through delivery from its retained Sequence.
   *
   * After reconstruction, every original mutation is deliberately delivered
   * again. Those stale Gossip packets must be idempotent and must not duplicate
   * visible Footage or alter deterministic root ordering.
   *
   * Finally, a fresh Projection is created directly from the fully integrated
   * restarted Sequence. Creation may compact or normalize local structural
   * state, but its visible Projection must remain identical to both live
   * receivers.
   *
   * This therefore checks that:
   *
   * - concurrent root ordering is independent of arrival order;
   * - retained Sequence state is sufficient to survive a restart;
   * - stale Gossip redelivery is idempotent;
   * - creating a fresh Projection from retained state preserves the result.
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
