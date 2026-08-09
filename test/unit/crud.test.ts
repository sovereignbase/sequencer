import { assert, describe, expect, it } from 'vitest'
import {
  create,
  find,
  insert,
  length,
  recover,
  remove,
  replace,
  values,
} from '../../src/typescript/index.js'

describe('runtime CRUD', () => {
  it('creates an empty Projection and validates read ranges', () => {
    const state = create<string>('invalid')

    expect(length(state)).toBe(0)
    expect(values(state)).toEqual([])
    expect(values(state, -1)).toEqual([])
    expect(values(state, 0.5)).toEqual([])
    expect(find(state, 0)).toBeUndefined()
    expect(recover(state)).toEqual([])
  })

  it('inserts at the beginning, middle, and end', () => {
    const state = create<string>()

    expect(insert(state, 0, ['a', 'b', 'c'])).not.toBe(false)
    expect(insert(state, 1, ['x'])).not.toBe(false)
    expect(insert(state, length(state), ['d'])).not.toBe(false)

    expect(values(state)).toEqual(['a', 'x', 'b', 'c', 'd'])
    expect(values(state, 1, 4)).toEqual(['x', 'b', 'c'])
    expect(find(state, 3)).toBe('c')
    expect(recover(state)).toEqual(['a', 'x', 'b', 'c', 'd'])
  })

  it('soft deletion hides a range while retaining recovery Footage', () => {
    const state = create<string>()
    assert(insert(state, 0, ['a', 'b', 'c', 'd']))

    const result = remove(state, 1, 3)

    expect(result).not.toBe(false)
    expect(values(state)).toEqual(['a', 'd'])
    expect(recover(state)).toEqual(['a', 'b', 'c', 'd'])
  })

  it('hard deletion releases only the removed Footage', () => {
    const state = create<string>()
    assert(insert(state, 0, ['a', 'b', 'c', 'd']))

    expect(remove(state, 1, 3, true)).not.toBe(false)
    expect(values(state)).toEqual(['a', 'd'])
    expect(recover(state)).toEqual(['a', 'd'])
    expect(state.footage).toEqual(['a', undefined, undefined, 'd'])
  })

  it('replaces a visible range through one combined result', () => {
    const state = create<string>()
    assert(insert(state, 0, ['a', 'b', 'c']))

    const result = replace(state, 1, ['x', 'y'], true)

    assert(result)
    expect(result.delta).toHaveLength(2)
    expect(result.change).toEqual({ 1: 'x', 2: 'y' })
    expect(values(state)).toEqual(['a', 'x', 'y'])
    expect(recover(state)).toEqual(['a', 'x', 'y'])
    expect(replace(state, 3, ['z'])).toBe(false)
  })

  it('uses Projection end as the default removal boundary', () => {
    const state = create<string>()
    assert(insert(state, 0, ['a', 'b']))

    expect(remove(state, 1)).not.toBe(false)
    expect(values(state)).toEqual(['a'])
  })

  it('rejects invalid writes without changing the Projection', () => {
    const state = create<string>()
    assert(insert(state, 0, ['a']))

    expect(insert(state, -1, ['x'])).toBe(false)
    expect(insert(state, 0.5, ['x'])).toBe(false)
    expect(insert(state, 2, ['x'])).toBe(false)
    expect(insert(state, 0, [])).toBe(false)
    expect(remove(state, 0, 0)).toBe(false)
    expect(remove(state, 2, 3)).toBe(false)
    expect(values(state, 1, 0)).toEqual([])
    expect(values(state, 0, 2)).toEqual([])
    expect(values(state)).toEqual(['a'])
  })
})
