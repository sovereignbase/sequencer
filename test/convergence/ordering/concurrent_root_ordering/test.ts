/** Virtual-root competitors must converge while keeping each root's descendants contiguous. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
import { deliver, expect_converged } from '../../../.helpers/replica.ts'
describe('concurrent root ordering', () => {
  /**
   * Verifies that concurrent root insertions and their causal subtrees are ordered
   * deterministically and remain structurally contiguous regardless of Gossip
   * delivery order.
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
