/** Distinct historical anchors must reproduce author-time relationships without requiring same-anchor competition. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Sequence } from '../../../../src/typescript/types/type.ts'
import { deliver } from '../../../.helpers/replica.ts'
describe('author-time view equivalence', () => {
  /**
   * Verifies that same-actor insertions preserve the exact anchor points visible
   * in the author's Projection when each operation was created.
   */
  it('orders same-actor insertions by the view in which they were authored', () => {
    const source = new Projection<string>(100)
    /**
     * Author all mutations sequentially on one replica so every operation is
     * created against the exact Projection produced by the preceding edits.
     */
    const mutations = [
      source.insert(['root'], 0),
      // `first` anchors before `root`: (root, 0).
      source.insert(['first'], 0),
      // `second` anchors before `first`: (first, 0).
      source.insert(['second'], 0),
      // `middle` anchors after `second`: (second, 1).
      source.insert(['middle'], 1),
      // `fourth` anchors before `second`: (second, 0).
      source.insert(['fourth'], 0),
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
