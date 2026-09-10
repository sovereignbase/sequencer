import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Delta, Replica } from '../../src/typescript/types/type.js'

const operations = vi.hoisted(() => ({ remove: vi.fn(), insert: vi.fn() }))

vi.mock('../../src/typescript/algorithms/remove/index.js', () => ({
  remove: operations.remove,
}))
vi.mock('../../src/typescript/algorithms/insert/index.js', () => ({
  insert: operations.insert,
}))

import { replace } from '../../src/typescript/algorithms/replace/index.js'

describe('Replacement Delta composition', () => {
  let state: Replica<string>
  let deletion: Delta<string>
  let insertion: Delta<string>

  beforeEach(() => {
    vi.resetAllMocks()
    state = [42, ['a', 'b', 'c']]
    deletion = [[2, 2, 10, 20, 0, 30, 40, 0, 0xffff_ffff, 0xffff_ffff], []]
    insertion = [
      [0, 2, 30, 40, 4, 10, 20, 0, 0xffff_ffff, 0xffff_ffff],
      ['X', 'Y'],
    ]
    operations.remove.mockReturnValue(deletion)
    operations.insert.mockReturnValue(insertion)
  })

  it('combines flat Projection words and Footage into exactly two lanes', () => {
    const result = replace(state, 1, ['X', 'Y'])
    expect(result).toEqual([
      [...deletion[0], ...insertion[0]],
      ['X', 'Y'],
    ])
    expect(result).toHaveLength(2)
    expect(operations.remove).toHaveBeenCalledExactlyOnceWith(
      state,
      1,
      3,
      false
    )
    expect(operations.insert).toHaveBeenCalledExactlyOnceWith(state, 1, [
      'X',
      'Y',
    ])
    expect(operations.remove.mock.invocationCallOrder[0]).toBeLessThan(
      operations.insert.mock.invocationCallOrder[0]
    )
  })

  it.each([false, true])('forwards hard=%s only to deletion', (hard) => {
    replace(state, 0, ['X', 'Y'], hard)
    expect(operations.remove).toHaveBeenCalledExactlyOnceWith(state, 0, 2, hard)
    expect(operations.insert).toHaveBeenCalledExactlyOnceWith(state, 0, [
      'X',
      'Y',
    ])
  })

  it('preserves both operations and orders any transferred Footage', () => {
    deletion[1].push('retained')
    const before = structuredClone([deletion, insertion])
    for (const delta of [deletion, insertion]) {
      Object.freeze(delta[0])
      Object.freeze(delta[1])
      Object.freeze(delta)
    }
    const result = replace(state, 1, ['X', 'Y']) as Delta<string>
    expect(result[1]).toEqual(['retained', 'X', 'Y'])
    expect([deletion, insertion]).toEqual(before)
    result[0][0] = 99
    result[1][0] = 'changed'
    expect([deletion, insertion]).toEqual(before)
  })

  it('does not insert when deletion rejects the range', () => {
    operations.remove.mockReturnValue(false)
    expect(replace(state, 3, ['X', 'Y'])).toBe(false)
    expect(operations.insert).not.toHaveBeenCalled()
    expect(state).toEqual([42, ['a', 'b', 'c']])
  })

  it('returns the accepted deletion when insertion is rejected', () => {
    operations.insert.mockReturnValue(false)
    expect(replace(state, 1, ['X', 'Y'])).toBe(deletion)
  })

  it.each([
    { values: [] },
    { values: null },
    { values: undefined },
    { values: 'XY' },
    { values: { length: 2 } },
    { values: new Uint32Array([1, 2]) },
  ])('rejects invalid values before deleting: $values', ({ values }) => {
    expect(replace(state, 0, values as string[])).toBe(false)
    expect(operations.remove).not.toHaveBeenCalled()
    expect(operations.insert).not.toHaveBeenCalled()
    expect(state).toEqual([42, ['a', 'b', 'c']])
  })

  it('captures aliased Footage before hard deletion releases its slots', () => {
    const values = state[1] as string[]
    operations.remove.mockImplementation(() => {
      state[1].fill(undefined)
      return deletion
    })
    replace(state, 0, values, true)
    const replacement = operations.insert.mock.calls[0][2]
    expect(replacement).toEqual(['a', 'b', 'c'])
    expect(replacement).not.toBe(values)
    expect(values).toEqual([undefined, undefined, undefined])
  })

  it('does not copy unaliased values before delegating to insertion', () => {
    const values = ['X', 'Y']
    replace(state, 0, values)
    expect(operations.insert.mock.calls[0][2]).toBe(values)
  })

  it('combines large flat buffers without variadic calls', () => {
    deletion[0] = Array.from({ length: 150_000 }, (_, index) => index)
    insertion[0] = Array.from(
      { length: 150_000 },
      (_, index) => index + 150_000
    )
    insertion[1] = new Array(150_000).fill('X')
    const result = replace(state, 0, ['X']) as Delta<string>
    expect(result[0]).toHaveLength(300_000)
    expect(result[0][149_999]).toBe(149_999)
    expect(result[0][150_000]).toBe(150_000)
    expect(result[0][299_999]).toBe(299_999)
    expect(result[1]).toEqual(insertion[1])
  })
})
