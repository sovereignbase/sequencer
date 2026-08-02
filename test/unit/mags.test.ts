/**
 * MAGS unit coverage through the public TypeScript API.
 */
import { assert, describe, expect, it } from 'vitest'
import {
  __acknowledge,
  __create,
  __delete,
  __garbageCollect,
  __length,
  __merge,
  __read,
  __recover,
  __snapshot,
  __update,
} from '../../src/typescript/index.js'
import type {
  Frontier,
  Replica,
  Reel,
} from '../../src/typescript/index.js'

// Observe the complete visible Projection without inspecting Projector state.
function projection_values<T>(state: Replica<T>): Array<T | undefined> {
  return Array.from({ length: __length(state) }, (_, frame_index) =>
    __read(state, frame_index)
  )
}

// Remote integration and pending dependencies.
describe('MAGS merge', () => {
  it('rejects malformed Reels and incomplete visible Footage', () => {
    const state = __create<string>()
    const incomplete_reel: Reel<string> = [
      [0, 2, [[0, 0, 0], [1, 0, 1]], ['only one']],
    ]

    expect(__merge(state, undefined)).toBe(false)
    expect(__merge(state, [null])).toBe(false)
    expect(__merge(state, incomplete_reel)).toBe(false)
    expect(__length(state)).toBe(0)
  })

  it('retains a dependent Strip until its predecessor arrives', () => {
    const source = __create<string>()
    const parent_result = __update(source, 0, ['parent'], 'after')
    assert(parent_result !== false)
    const child_result = __update(source, 0, ['child'], 'after')
    assert(child_result !== false)

    const target = __create<string>()
    expect(__merge(target, child_result.reel)).toBe(false)
    expect(__length(target)).toBe(0)

    expect(__merge(target, parent_result.reel)).toEqual({
      0: 'parent',
      1: 'child',
    })
    expect(projection_values(target)).toEqual(['parent', 'child'])
  })
})

// Snapshot, acknowledgement, and collection lifecycle.
describe('MAGS retained state', () => {
  it('round-trips visible and soft-deleted state through a snapshot', () => {
    const source = __create<string>()
    const update_result = __update(source, 0, ['a', 'b', 'c'], 'after')
    assert(update_result !== false)
    const deletion_result = __delete(source, 1, 2)
    assert(deletion_result !== false)

    const snapshot = __snapshot(source)
    const target = __create<string>(snapshot)
    expect(projection_values(target)).toEqual(['a', 'c'])
    expect(__recover(target)).toEqual(['a', 'b', 'c'])

    const footage = snapshot.find((strip) => strip[3] !== undefined)?.[3]
    assert(footage !== undefined)
    footage[0] = 'mutated snapshot'
    expect(projection_values(source)).toEqual(['a', 'c'])
  })

  it('acknowledges the greatest materialized start in each Realm', () => {
    const state = __create<string>()
    expect(__acknowledge(state)).toBe(false)

    const first_result = __update(state, 0, ['a', 'b'], 'after')
    assert(first_result !== false)
    const second_result = __update(state, 1, ['c'], 'after')
    assert(second_result !== false)

    const frontier = __acknowledge(state)
    assert(frontier !== false)
    expect(frontier).toContainEqual(second_result.reel.at(-1)?.[2][1])
  })

  it('reduces Replica Frontiers realm-wise before collection', () => {
    const state = __create<string>()
    const first_frontier: Frontier = [
      [10, 8, 20],
      [11, 7, 21],
    ]
    const second_frontier: Frontier = [
      [10, 3, 20],
      [11, 5, 21],
    ]

    __garbageCollect([first_frontier, second_frontier], state)

    expect(first_frontier).toEqual(second_frontier)
    expect(second_frontier).toEqual([
      [10, 3, 20],
      [11, 5, 21],
    ])
  })

  it('collects acknowledged Masks and releases their Footage', () => {
    const state = __create<string>()
    const update_result = __update(state, 0, ['a', 'b', 'c'], 'after')
    assert(update_result !== false)
    const deletion_result = __delete(state, 1, 2)
    assert(deletion_result !== false)
    expect(__recover(state)).toEqual(['a', 'b', 'c'])

    const frontier = __acknowledge(state)
    assert(frontier !== false)
    __garbageCollect([frontier], state)

    expect(projection_values(state)).toEqual(['a', 'c'])
    expect(__recover(state)).toEqual(['a', 'c'])
    expect(state.footage[1]).toBeUndefined()
    expect(__snapshot(state).every(([is_masked]) => is_masked === 0)).toBe(true)
  })
})
