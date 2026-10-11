import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'

describe('concurrent root ordering', () => {
  /**
   * Verifies that concurrent root insertions and their causal subtrees are
   * ordered deterministically and remain structurally contiguous regardless of
   * Gossip delivery order.
   *
   * Four actors begin from an empty Sequence. Each independently creates its
   * own root insertion and then extends that root on both sides:
   *
   *   left <- root -> right
   *
   * For each actor:
   *
   *   insert(root, 0)
   *   insert(left, 0)
   *   insert(right, 2)
   *
   * produces the local Projection:
   *
   *   left, root, right
   *
   * The four root operations are concurrent with one another, while each
   * actor's left and right insertions are causally attached to its own root.
   *
   * When all operations are merged, Sequencer must choose one deterministic
   * order for the competing roots. Their descendant trees must move with those
   * roots as complete subtrees rather than becoming interleaved with descendants
   * belonging to another concurrent root.
   *
   * Forward and reverse delivery must therefore reconstruct the same Projection,
   * and every actor's:
   *
   *   left, root, right
   *
   * range must remain contiguous in that Projection.
   */
  it('keeps concurrent root subtrees deterministic and separate', () => {
    const mutations: Array<Gossip<string>> = []

    const trees = [
      { actor: 11, root: 'first', left: 'first-left', right: 'first-right' },
      { actor: 12, root: 'second', left: 'second-left', right: 'second-right' },
      { actor: 13, root: 'third', left: 'third-left', right: 'third-right' },
      { actor: 14, root: 'fourth', left: 'fourth-left', right: 'fourth-right' },
    ] as const

    for (const tree of trees) {
      const state = new Projection<string>(tree.actor)

      // Establish one concurrent root.
      mutations.push(state.insert([tree.root], 0))

      // Extend the root's local tree on its left side.
      mutations.push(state.insert([tree.left], 0))

      // Extend the same root's local tree on its right side.
      mutations.push(state.insert([tree.right], 2))

      expect(state.values()).toEqual([tree.left, tree.root, tree.right])
    }

    const empty: Sequence<string> = [[], []]

    // Reconstruct the same operation set in opposite delivery orders.
    const forward = deliver<string>(empty, mutations)
    const reverse = deliver<string>(empty, [...mutations].reverse())

    expect_converged(forward, reverse)

    const values = forward.values()

    // Every authored Frame must survive exactly once.
    expect(new Set(values)).toEqual(
      new Set(trees.flatMap(({ left, root, right }) => [left, root, right]))
    )

    // Each concurrent root must retain its complete causal subtree. Root
    // competition may reorder these groups, but their contents may not interleave.
    for (const { left, root, right } of trees) {
      const start = values.indexOf(left)

      expect(values.slice(start, start + 3)).toEqual([left, root, right])
    }
  })
})
