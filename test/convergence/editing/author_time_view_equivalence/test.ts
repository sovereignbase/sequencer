import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Sequence } from '../../../../src/types/type.ts'
import { deliver } from '../../../.helpers/replica.ts'

describe('author-time view equivalence', () => {
  /**
   * Verifies that same-actor insertions preserve the exact anchor points visible
   * in the author's Projection when each operation was created.
   *
   * Every insertion in this scenario resolves to a distinct anchor coordinate.
   * No two operations compete for the same anchor, so convergence must not
   * depend on any tie-break rule.
   *
   * The authoring sequence evolves as follows:
   *
   *   root
   *   first, root
   *   second, first, root
   *   second, middle, first, root
   *   fourth, second, middle, first, root
   *   fifth, fourth, second, middle, first, root
   *
   * The corresponding anchors are:
   *
   * - `root`   -> virtual root anchor
   * - `first`  -> `(root, 0)`, before the `root` Frame
   * - `second` -> `(first, 0)`, before the `first` Frame
   * - `middle` -> `(second, 1)`, after the `second` Frame
   * - `fourth` -> `(second, 0)`, before the `second` Frame
   * - `fifth`  -> `(fourth, 0)`, before the `fourth` Frame
   *
   * The important case is `middle`. It is authored at visible Projection
   * position 1 while the view is:
   *
   *   second | first, root
   *          ↑
   *        insert
   *
   * Its anchor must therefore remain `(second, 1)`, even if the operation is
   * later delivered into a replica whose current structural view has already
   * been fragmented differently by other insertions.
   *
   * Two replicas are reconstructed from the same empty Sequence:
   *
   * 1. `ordered` receives mutations in authoring order.
   * 2. `unordered` receives the same mutations in a deliberately reordered
   *    delivery sequence, including delivery of `middle` before `second`.
   *
   * Because each mutation carries the stable anchor coordinate resolved from
   * its authoring view, both delivery orders must reconstruct exactly the same
   * final Projection:
   *
   *   fifth, fourth, second, middle, first, root
   */
  it('orders same-actor insertions by the view in which they were authored', () => {
    const source = new Projection<string>(100)

    /**
     * Author all mutations sequentially on one replica so every operation is
     * created against the exact Projection produced by the preceding edits.
     */
    const mutations = [
      // root
      source.insert(['root'], 0),

      // first, root
      // `first` anchors before `root`: (root, 0).
      source.insert(['first'], 0),

      // second, first, root
      // `second` anchors before `first`: (first, 0).
      source.insert(['second'], 0),

      // second, middle, first, root
      // `middle` anchors after `second`: (second, 1).
      source.insert(['middle'], 1),

      // fourth, second, middle, first, root
      // `fourth` anchors before `second`: (second, 0).
      source.insert(['fourth'], 0),

      // fifth, fourth, second, middle, first, root
      // `fifth` anchors before `fourth`: (fourth, 0).
      source.insert(['fifth'], 0),
    ]

    const empty: Sequence<string> = [[], []]

    /**
     * Baseline reconstruction using the same order in which the operations were
     * originally authored.
     */
    const ordered = deliver(empty, mutations)

    /**
     * Reconstruct the same operation set in a unordered delivery order.
     *
     * In particular, `middle`, whose authored anchor is `(second, 1)`, is
     * delivered before `second`. The receiver must still eventually place it
     * after `second` once all dependencies are present.
     *
     * No tie-break is involved: every insertion has a distinct anchor point.
     */
    const unordered = deliver(empty, [
      mutations[0],
      mutations[1],
      mutations[3],
      mutations[4],
      mutations[2],
      mutations[5],
    ])

    const expected = ['fifth', 'fourth', 'second', 'middle', 'first', 'root']

    // Both delivery orders must reconstruct the exact authored Projection.
    expect(ordered.values()).toEqual(expected)
    expect(unordered.values()).toEqual(expected)
  })
})
