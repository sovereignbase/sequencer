/**
 * Deterministic convergence invariants for sibling ordering, hostile Delta
 * staging, dependencies, Masks, Snapshot restarts, and garbage collection.
 */
import { assert, describe, expect, it } from 'vitest'
import {
  acknowledge,
  create,
  garbageCollect,
  insert,
  length,
  merge,
  remove,
  replace,
  snapshot,
} from '../../src/typescript/index.js'
import type { Acknowledgement, Delta } from '../../src/typescript/index.js'
import {
  compare_points,
  create_seed,
  deliver,
  expect_converged,
  projection_values,
  shuffle_strips,
  strip_start,
  visible_strip,
} from '../.helpers/replica.js'

describe('concurrent Strip ordering', () => {
  it('orders initial inverse siblings by descending point', () => {
    const root_strips = ['first', 'second', 'third', 'fourth'].map((value) =>
      visible_strip(insert(create<string>(), 0, [value]))
    )
    const expected = [...root_strips]
      .sort((left, right) =>
        compare_points(strip_start(right), strip_start(left))
      )
      .flatMap((strip) => strip[1] ?? [])

    const forward = deliver([], root_strips)
    const reverse = deliver([], [...root_strips].reverse())

    expect(projection_values(forward)).toEqual(expected)
    expect_converged(forward, reverse)
  })

  it('orders forward siblings by ascending point', () => {
    const base = create_seed(['base'])
    const base_delta = snapshot(base)
    const left = create<string>(base_delta)
    const right = create<string>(base_delta)
    const left_strip = visible_strip(insert(left, 1, ['left']))
    const right_strip = visible_strip(insert(right, 1, ['right']))
    const expected = [left_strip, right_strip]
      .sort((left, right) =>
        compare_points(strip_start(left), strip_start(right))
      )
      .flatMap((strip) => strip[1] ?? [])

    const forward = deliver(base_delta, [left_strip, right_strip])
    const reverse = deliver(base_delta, [right_strip, left_strip])

    expect(projection_values(forward)).toEqual(['base', ...expected])
    expect_converged(forward, reverse)
  })
})

describe('hostile Delta staging', () => {
  it('materializes a child staged before its predecessor during create', () => {
    const source = create<string>()
    const parent_result = insert(source, 0, ['parent'])
    assert(parent_result !== false)
    const child_result = insert(source, 1, ['child'])
    assert(child_result !== false)

    const target = create<string>([
      ...child_result.delta,
      ...parent_result.delta,
    ])

    expect(projection_values(target)).toEqual(['parent', 'child'])
    expect_converged(source, target)
  })

  it('converges after reverse, shuffled, duplicate, and restart staging', () => {
    const base = create_seed(['base-0', 'base-1', 'base-2'])
    const base_delta = snapshot(base)
    const left = create<string>(base_delta)
    const right = create<string>(base_delta)
    const deltas: Array<Delta<string>> = []

    const left_parent = insert(left, 1, ['left-0', 'left-1'])
    assert(left_parent !== false)
    deltas.push(left_parent.delta)
    const left_child = insert(left, 2, ['left-child'])
    assert(left_child !== false)
    deltas.push(left_child.delta)
    const left_mask = remove(left, 2, 4)
    assert(left_mask !== false)
    deltas.push(left_mask.delta)

    const right_replacement = replace(right, 1, ['right'])
    assert(right_replacement !== false)
    deltas.push(right_replacement.delta)
    const right_initial = insert(right, 0, ['right-initial'])
    assert(right_initial !== false)
    deltas.push(right_initial.delta)

    const strips = deltas.flat()
    const ordered = deliver(base_delta, strips)
    const reversed = deliver(base_delta, [...strips].reverse())
    const shuffled = deliver(base_delta, shuffle_strips(strips, 0xc0ffee))
    const duplicated = deliver(
      base_delta,
      strips.flatMap((strip, index) =>
        index % 2 === 0 ? [strip, strip] : [strip]
      )
    )
    const restart_order = shuffle_strips(strips, 0x51a7e)
    const restarted = deliver(
      base_delta,
      restart_order,
      Math.ceil(restart_order.length / 2)
    )

    for (const target of [reversed, shuffled, duplicated, restarted])
      expect_converged(ordered, target)
  })

  it('converges for a concurrent Mask and sibling insertion', () => {
    const base = create_seed(['a', 'b', 'c'])
    const base_delta = snapshot(base)
    const deleting = create<string>(base_delta)
    const inserting = create<string>(base_delta)
    const deletion = remove(deleting, 1, 2)
    const insertion = insert(inserting, 2, ['beside'])
    assert(deletion !== false)
    assert(insertion !== false)

    const mask_first = deliver(base_delta, [
      ...deletion.delta,
      ...insertion.delta,
    ])
    const insert_first = deliver(base_delta, [
      ...insertion.delta,
      ...deletion.delta,
    ])

    expect_converged(mask_first, insert_first)
  })
})

describe('restart and collection continuity', () => {
  it('converges after Snapshot recovery and stale Delta redelivery', () => {
    const source = create_seed(['a', 'b', 'c'])
    const shared_delta = snapshot(source)
    const first_result = insert(source, 2, ['first'])
    assert(first_result !== false)
    const deletion_result = remove(source, 0, 1)
    assert(deletion_result !== false)

    let recovered = create<string>(snapshot(source))
    const later_result = insert(source, length(source), ['later'])
    assert(later_result !== false)
    void merge(recovered, later_result.delta)
    void merge(recovered, first_result.delta)
    void merge(recovered, deletion_result.delta)
    void merge(recovered, shared_delta)
    recovered = create<string>(snapshot(recovered))

    expect_converged(source, recovered)
  })

  it('continues converging after acknowledged Masks are collected', () => {
    const source = create_seed(['a', 'b', 'c'])
    const peer = create<string>(snapshot(source))
    const deletion = remove(source, 1, 2)
    assert(deletion !== false)
    void merge(peer, deletion.delta)

    const source_frontier = acknowledge(source)
    const peer_frontier = acknowledge(peer)
    assert(source_frontier !== false)
    assert(peer_frontier !== false)

    const clone_frontier = (frontier: Acknowledgement): Acknowledgement =>
      frontier.map((point) => [point[0], point[1], point[2]])
    garbageCollect(
      [clone_frontier(source_frontier), clone_frontier(peer_frontier)],
      source
    )
    garbageCollect(
      [clone_frontier(source_frontier), clone_frontier(peer_frontier)],
      peer
    )

    const later = insert(source, length(source), ['later'])
    assert(later !== false)
    void merge(peer, later.delta)

    expect_converged(source, peer)
  })
})
