/**
 * CRUD unit coverage through the public TypeScript API.
 */
import { assert, describe, expect, it } from 'vitest'
import {
  __create,
  __delete,
  __length,
  __read,
  __recover,
  __snapshot,
  __update,
} from '../../src/typescript/index.js'
import type { Replica } from '../../src/typescript/index.js'

// Observe the complete visible Projection without accessing native state.
function projection_values<T>(state: Replica<T>): Array<T | undefined> {
  return Array.from({ length: __length(state) }, (_, frame_index) =>
    __read(state, frame_index)
  )
}

// Create one visible Strip for tests that need established Frames.
function create_values<T>(values: Array<T>): Replica<T> {
  const state = __create<T>()
  const update_result = __update(state, 0, values, 'after')
  assert(update_result !== false)
  return state
}

// Creation and Projection reads.
describe('CRUD creation and reads', () => {
  it('creates empty state and rejects invalid read indexes', () => {
    const state = __create<string>('not a Reel')

    expect(__length(state)).toBe(0)
    expect(__read(state, -1)).toBeUndefined()
    expect(__read(state, 0)).toBeUndefined()
    expect(__read(state, 0.5)).toBeUndefined()
    expect(__recover(state)).toEqual([])
  })

  it('hydrates a complete Reel without changing its coordinates', () => {
    const source = create_values(['a', 'b', 'c'])
    const reel = __snapshot(source)
    const target = __create<string>(reel)

    expect(projection_values(target)).toEqual(['a', 'b', 'c'])
    expect(__recover(target)).toEqual(['a', 'b', 'c'])
    expect(__snapshot(target).map((strip) => strip[2])).toEqual(
      reel.map((strip) => strip[2])
    )
  })

  it('recovers structural order after Footage append order diverges', () => {
    const state = create_values(['a', 'b', 'c'])
    expect(__update(state, 0, ['x'], 'after')).not.toBe(false)

    expect(__recover(state)).toEqual(['a', 'x', 'b', 'c'])
  })
})

// Visible update modes and validation.
describe('CRUD updates', () => {
  it('applies before, after, and overwrite modes', () => {
    const before_state = create_values(['a', 'b', 'c'])
    const before_result = __update(before_state, 1, ['x'], 'before')
    assert(before_result !== false)
    expect(projection_values(before_state)).toEqual(['a', 'x', 'b', 'c'])
    expect(before_result.change).toEqual({ 1: 'x' })

    const after_state = create_values(['a', 'b', 'c'])
    const after_result = __update(after_state, 1, ['x'], 'after')
    assert(after_result !== false)
    expect(projection_values(after_state)).toEqual(['a', 'b', 'x', 'c'])
    expect(after_result.change).toEqual({ 2: 'x' })

    const overwrite_state = create_values(['a', 'b', 'c'])
    const overwrite_result = __update(
      overwrite_state,
      1,
      ['x', 'y'],
      'overwrite'
    )
    assert(overwrite_result !== false)
    expect(projection_values(overwrite_state)).toEqual(['a', 'x', 'y'])
    expect(overwrite_result.change).toEqual({ 1: 'x', 2: 'y' })
    expect(overwrite_result.reel).toHaveLength(2)
  })

  it('leaves state unchanged for invalid update input', () => {
    const state = create_values(['a'])

    expect(__update(state, -1, ['x'], 'before')).toBe(false)
    expect(__update(state, 2, ['x'], 'after')).toBe(false)
    expect(__update(state, 0, [], 'overwrite')).toBe(false)
    expect(projection_values(state)).toEqual(['a'])
  })
})

// Soft and hard Mask behavior.
describe('CRUD deletion and recovery', () => {
  it('soft deletion hides Frames while recovery retains them', () => {
    const state = create_values(['a', 'b', 'c', 'd'])
    const visible_strip = __snapshot(state)[0]
    const deletion_result = __delete(state, 1, 3)
    assert(deletion_result !== false)

    const mask = deletion_result.reel[0]
    const containing_strip_start = visible_strip[2][1]
    expect(mask[2][0]).toEqual(containing_strip_start)
    expect(mask[2][1]).toEqual([
      containing_strip_start[0],
      containing_strip_start[1] + 1,
      containing_strip_start[2],
    ])
    expect(projection_values(state)).toEqual(['a', 'd'])
    expect(__recover(state)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('hard deletion releases Footage and recovery omits it', () => {
    const state = create_values(['a', 'b', 'c', 'd'])
    const deletion_result = __delete(state, 1, 3, true)
    assert(deletion_result !== false)

    expect(projection_values(state)).toEqual(['a', 'd'])
    expect(__recover(state)).toEqual(['a', 'd'])
    expect(state.footage).toEqual(['a', undefined, undefined, 'd'])

    const mask = __snapshot(state).find(([is_masked]) => is_masked === 1)
    expect(mask?.[3]).toBeUndefined()
  })

  it('rejects invalid and empty deletion ranges', () => {
    const state = create_values(['a', 'b'])

    expect(__delete(state, -1, 1)).toBe(false)
    expect(__delete(state, 1, 1)).toBe(false)
    expect(__delete(state, 2, 3)).toBe(false)
    expect(projection_values(state)).toEqual(['a', 'b'])
  })
})
