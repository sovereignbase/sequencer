/**
 * Deterministic convergence invariants for ordering, hostile Reel delivery,
 * pending dependencies, Masks, snapshot restarts, and garbage collection.
 */
import { assert, describe, expect, it } from 'vitest'
import {
  __acknowledge,
  __create,
  __delete,
  __garbageCollect,
  __length,
  __merge,
  __snapshot,
  __update,
} from '../../src/typescript/index.js'
import type { Frontier, Reel, Strip } from '../../src/typescript/index.js'
import {
  compare_points,
  create_seed,
  deliver,
  expect_converged,
  projection_values,
  shuffle_strips,
  visible_strip,
} from '../.helpers/replica.js'

// Exact concurrent sibling tie-breaking.
describe('concurrent Strip ordering', () => {
  it('orders Root successors by descending point in either delivery order', () => {
    const left_strip = visible_strip(
      __update(__create<string>(), 0, ['left'], 'before')
    )
    const right_strip = visible_strip(
      __update(__create<string>(), 0, ['right'], 'before')
    )
    const expected = [left_strip, right_strip]
      .sort((left, right) => compare_points(right[2][1], left[2][1]))
      .flatMap((strip) => strip[3] ?? [])

    const forward = deliver([], [left_strip, right_strip])
    const reverse = deliver([], [right_strip, left_strip])

    expect(projection_values(forward)).toEqual(expected)
    expect_converged(forward, reverse)
  })

  it('orders non-Root successors by ascending point in either delivery order', () => {
    const base = create_seed(['base'])
    const base_reel = __snapshot(base)
    const left = __create<string>(base_reel)
    const right = __create<string>(base_reel)
    const left_strip = visible_strip(__update(left, 0, ['left'], 'after'))
    const right_strip = visible_strip(__update(right, 0, ['right'], 'after'))
    const expected = [left_strip, right_strip]
      .sort((left, right) => compare_points(left[2][1], right[2][1]))
      .flatMap((strip) => strip[3] ?? [])

    const forward = deliver(base_reel, [left_strip, right_strip])
    const reverse = deliver(base_reel, [right_strip, left_strip])

    expect(projection_values(forward)).toEqual(['base', ...expected])
    expect_converged(forward, reverse)
  })
})

// Dependency and Mask delivery independent of arrival order.
describe('hostile Reel delivery', () => {
  it('materializes a child received before its predecessor', () => {
    const source = __create<string>()
    const parent_result = __update(source, 0, ['parent'], 'after')
    assert(parent_result !== false)
    const child_result = __update(source, 0, ['child'], 'after')
    assert(child_result !== false)

    const target = __create<string>()
    expect(__merge(target, child_result.reel)).toBe(false)
    void __merge(target, parent_result.reel)

    expect(projection_values(target)).toEqual(['parent', 'child'])
    expect_converged(source, target)
  })

  it('converges after reverse, shuffled, duplicate, and restart delivery', () => {
    const base = create_seed(['base-0', 'base-1', 'base-2'])
    const base_reel = __snapshot(base)
    const left = __create<string>(base_reel)
    const right = __create<string>(base_reel)
    const reels: Array<Reel<string>> = []

    const left_parent = __update(left, 0, ['left-0', 'left-1'], 'after')
    assert(left_parent !== false)
    reels.push(left_parent.reel)
    const left_child = __update(left, 1, ['left-child'], 'after')
    assert(left_child !== false)
    reels.push(left_child.reel)
    const left_mask = __delete(left, 2, 4)
    assert(left_mask !== false)
    reels.push(left_mask.reel)

    const right_overwrite = __update(right, 1, ['right'], 'overwrite')
    assert(right_overwrite !== false)
    reels.push(right_overwrite.reel)
    const right_root = __update(right, 0, ['right-root'], 'before')
    assert(right_root !== false)
    reels.push(right_root.reel)

    const strips = reels.flat()
    const ordered = deliver(base_reel, strips)
    const reversed = deliver(base_reel, [...strips].reverse())
    const shuffled = deliver(base_reel, shuffle_strips(strips, 0xc0ffee))
    const duplicated = deliver(
      base_reel,
      strips.flatMap((strip, index) =>
        index % 2 === 0 ? [strip, strip] : [strip]
      )
    )
    const restart_order = shuffle_strips(strips, 0x51a7e)
    const restarted = deliver(
      base_reel,
      restart_order,
      Math.ceil(restart_order.length / 2)
    )

    for (const target of [reversed, shuffled, duplicated, restarted])
      expect_converged(ordered, target)
  })

  it('converges for a concurrent Mask and successor insertion', () => {
    const base = create_seed(['a', 'b', 'c'])
    const base_reel = __snapshot(base)
    const deleting = __create<string>(base_reel)
    const inserting = __create<string>(base_reel)
    const deletion = __delete(deleting, 1, 2)
    const insertion = __update(inserting, 1, ['beside'], 'after')
    assert(deletion !== false)
    assert(insertion !== false)

    const mask_first = deliver(base_reel, [...deletion.reel, ...insertion.reel])
    const insert_first = deliver(base_reel, [
      ...insertion.reel,
      ...deletion.reel,
    ])

    expect_converged(mask_first, insert_first)
  })
})

// Retained-state lifecycle must not change later convergence.
describe('restart and collection continuity', () => {
  it('converges after snapshot recovery and stale Reel redelivery', () => {
    const source = create_seed(['a', 'b', 'c'])
    const shared_reel = __snapshot(source)
    const first_result = __update(source, 1, ['first'], 'after')
    assert(first_result !== false)
    const deletion_result = __delete(source, 0, 1)
    assert(deletion_result !== false)

    let recovered = __create<string>(__snapshot(source))
    const later_result = __update(source, __length(source), ['later'], 'after')
    assert(later_result !== false)
    void __merge(recovered, later_result.reel)
    void __merge(recovered, first_result.reel)
    void __merge(recovered, deletion_result.reel)
    void __merge(recovered, shared_reel)
    recovered = __create<string>(__snapshot(recovered))

    expect_converged(source, recovered)
  })

  it('continues converging after acknowledged Masks are collected', () => {
    const source = create_seed(['a', 'b', 'c'])
    const peer = __create<string>(__snapshot(source))
    const deletion = __delete(source, 1, 2)
    assert(deletion !== false)
    void __merge(peer, deletion.reel)

    const source_frontier = __acknowledge(source)
    const peer_frontier = __acknowledge(peer)
    assert(source_frontier !== false)
    assert(peer_frontier !== false)

    const clone_frontier = (frontier: Frontier): Frontier =>
      frontier.map((point) => [point[0], point[1], point[2]])
    __garbageCollect(
      [clone_frontier(source_frontier), clone_frontier(peer_frontier)],
      source
    )
    __garbageCollect(
      [clone_frontier(source_frontier), clone_frontier(peer_frontier)],
      peer
    )

    const later = __update(source, __length(source), ['later'], 'after')
    assert(later !== false)
    void __merge(peer, later.reel)

    expect_converged(source, peer)
  })
})
