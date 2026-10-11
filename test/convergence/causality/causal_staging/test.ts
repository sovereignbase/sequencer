import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import { expect_converged } from '../../../.helpers/replica.ts'

describe('causal staging', () => {
  /**
   * Verifies that an operation whose causal parent has not arrived yet is
   * retained instead of discarded, and becomes visible once that dependency
   * is later delivered.
   *
   * The source authors:
   *
   *   parent
   *   parent, child
   *
   * The target receives `child` first. Because its anchor depends on `parent`,
   * the operation cannot yet be placed into the visible Projection and must be
   * staged internally:
   *
   *   apply(child)
   *   Projection: []
   *
   * When `parent` arrives, the staged child can be resolved against its missing
   * anchor and both operations become visible in their authored order:
   *
   *   apply(parent)
   *   Projection: [parent, child]
   *
   * The target must then converge exactly with the source.
   */
  it('retains a child and resolves it when its missing parent arrives', () => {
    const source = new Projection<string>(21)

    // Author the parent first.
    const parent = source.insert(['parent'], 0)

    // Author the child after it, making the child causally dependent on parent.
    const child = source.insert(['child'], 1)

    const target = new Projection<string>(22)

    // Deliver the child before its parent. The update is accepted and retained,
    // but cannot yet produce visible Footage.
    expect(target.apply(child)).toBeDefined()
    expect(target.values()).toEqual([])

    // Once the missing parent arrives, the staged child can resolve against its
    // authored anchor and the complete causal chain becomes visible.
    expect(target.apply(parent)).toBeDefined()

    expect_converged(source, target)
  })
})
