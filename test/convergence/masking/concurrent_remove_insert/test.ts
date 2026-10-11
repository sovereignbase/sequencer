import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import {
  create_seed,
  deliver,
  expect_converged,
} from '../../../.helpers/replica.ts'

describe('concurrent remove and insert', () => {
  /**
   * Verifies that a remove only removes the Insertion it was authored against
   * and does not consume a concurrent Insertion anchored beside that content.
   *
   * Both replicas begin from:
   *
   *   a, b, c
   *
   * One replica removes `b` while the other concurrently inserts `beside`
   * immediately after `b`:
   *
   *   deleting:  a, [b], c
   *                  ↓ remove
   *
   *   inserting: a, b | c
   *                    ↑
   *                 beside
   *
   * Because neither operation has observed the other, the insertion is not
   * part of the remove's origin. The remove must therefore remove only `b` and
   * retain the concurrent insertion:
   *
   *   a, beside, c
   *
   * The same operation set is delivered in both possible orders to verify that
   * remove ownership is independent of delivery order.
   */
  it('keeps the concurrent insertion outside the origin remove', () => {
    const base = create_seed(['a', 'b', 'c'])
    const retained = base.sequence()

    // Fork two replicas from the same acknowledged Sequence so the removal and
    // insertion are authored concurrently.
    const deleting = new Projection<string>(31, retained)
    const inserting = new Projection<string>(32, retained)

    // Remove only the original `b`.
    const deletion = deleting.remove(1, 1)

    // Concurrently insert at the boundary immediately after `b`.
    const insertion = inserting.insert(['beside'], 2)

    // Reconstruct the same concurrent operation set in opposite delivery orders.
    const remove_first = deliver(retained, [deletion, insertion])
    const insert_first = deliver(retained, [insertion, deletion])

    // Delivery order must not change the resulting Projection.
    expect_converged(remove_first, insert_first)

    // The remove owns the original `b`, not the concurrent insertion beside it.
    expect(remove_first.values()).toEqual(['a', 'beside', 'c'])
  })
})
