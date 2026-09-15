/** Deterministic convergence coverage for the current automatic runtime. */
import { assert, describe, expect, it } from 'vitest'
import {
  create,
  ingest,
  insert,
  remove,
  replace,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import type { Mutation } from '../../src/typescript/index.js'
import {
  create_seed,
  deliver,
  expect_converged,
  shuffle_mutations,
} from '../.helpers/replica.js'

describe('convergence', () => {
  it('orders concurrent root insertions independently of delivery order', () => {
    const mutations: Array<Mutation<string>> = []
    for (const [actor, value] of [
      [11, 'first'],
      [12, 'second'],
      [13, 'third'],
      [14, 'fourth'],
    ] as const) {
      const state = create<string>(actor)
      const mutation = insert(state, 0, [value])
      assert(mutation !== false)
      mutations.push(mutation)
    }
    const forward = deliver<string>([[], []], mutations)
    const reverse = deliver<string>([[], []], [...mutations].reverse())
    expect_converged(forward, reverse)
    expect(new Set(values(forward))).toEqual(
      new Set(['first', 'second', 'third', 'fourth'])
    )
  })

  it('accepts a causal child after its missing parent is delivered', () => {
    const source = create<string>(21)
    const parent = insert(source, 0, ['parent'])
    const child = insert(source, 1, ['child'])
    assert(parent !== false && child !== false)
    const target = create<string>(22)
    expect(ingest(target, child)).toBe(false)
    expect(ingest(target, parent)).not.toBe(false)
    expect(ingest(target, child)).not.toBe(false)
    expect_converged(source, target)
  })

  it('keeps a concurrent insertion outside an origin Mask', () => {
    const base = create_seed(['a', 'b', 'c'])
    const retained = snapshot(base)
    const deleting = create<string>(31, retained)
    const inserting = create<string>(32, retained)
    const deletion = remove(deleting, 1, 2)
    const insertion = insert(inserting, 2, ['beside'])
    assert(deletion !== false && insertion !== false)
    const mask_first = deliver(retained, [deletion, insertion])
    const insert_first = deliver(retained, [insertion, deletion])
    expect_converged(mask_first, insert_first)
    expect(values(mask_first)).toEqual(['a', 'beside', 'c'])
  })

  it('survives hostile delivery, a restart, and stale redelivery', () => {
    const base = create_seed(['base-0', 'base-1', 'base-2'])
    const retained = snapshot(base)
    const left = create<string>(41, retained)
    const right = create<string>(42, retained)
    const mutations: Array<Mutation<string>> = []
    for (const mutation of [
      insert(left, 1, ['left-0', 'left-1']),
      insert(left, 2, ['left-child']),
      remove(left, 2, 4),
      replace(right, 1, ['right']),
      insert(right, 0, ['right-initial']),
    ]) {
      assert(mutation !== false)
      mutations.push(mutation)
    }
    const ordered = deliver(retained, mutations)
    const hostile = shuffle_mutations(mutations, 0xc0ffee)
    const restarted = deliver(
      retained,
      hostile,
      Math.ceil(mutations.length / 2)
    )
    for (const mutation of mutations) void ingest(restarted, mutation)
    const compacted_on_create = create<string>(43, snapshot(restarted))
    expect_converged(ordered, restarted)
    expect_converged(ordered, compacted_on_create)
  })
})
