import { assert, describe, expect, it } from 'vitest'
import {
  create,
  insert,
  merge,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import type { Delta } from '../../src/typescript/index.js'

const absent = 0xffff_ffff
const parent: Delta<string> = [
  [1, 3, 10, 20, 0, 0, 0, 0, absent, absent, 3, 0],
  ['a', 'b', 'c'],
]

function rows(delta: Delta<string>) {
  return Array.from({ length: delta[0].length / 12 }, (_, index) =>
    delta[0].slice(index * 12, index * 12 + 12)
  )
}

describe('Immutable issued identities', () => {
  it.each([false, true])(
    'keeps insert coordinates across concurrent splits, reverse=%s',
    (reverse) => {
      const head: Delta<string> = [
        [0, 1, 30, 40, 0, 10, 20, 0, absent, absent, 1, 0],
        ['X'],
      ]
      const middle: Delta<string> = [
        [0, 1, 50, 60, 0, 10, 20, 1, absent, absent, 1, 1],
        ['Y'],
      ]
      let state = create<string>(parent)
      for (const delta of reverse ? [middle, head] : [head, middle]) {
        merge(state, delta)
        state = create<string>(snapshot(state))
      }
      expect(values(state)).toEqual(['X', 'a', 'Y', 'b', 'c'])
      const saved = rows(snapshot(state))
      expect(saved.find((strip) => strip[2] === 10)?.[1]).toBe(3)
      const fragments = saved.filter((strip) => strip[4] === absent)
      expect(fragments.every((strip) => strip[1] === 0)).toBe(true)
      expect(fragments.reduce((sum, strip) => sum + strip[10], 0)).toBe(3)
    }
  )

  it('preserves local insertion order at an existing split boundary', () => {
    const state = create<string>(parent)
    const first = insert(state, 0, ['X'])
    const second = insert(state, 1, ['Y'])
    assert(first !== false && second !== false)
    expect(values(state)).toEqual(['X', 'Y', 'a', 'b', 'c'])
    const target = create<string>(parent)
    merge(target, second)
    merge(target, first)
    expect(values(target)).toEqual(values(state))
  })

  it('does not consume issued points when creating structural fragments', () => {
    const state = create<string>()
    const birth = insert(state, 0, ['a', 'b', 'c', 'd'])
    const tail = insert(state, 4, ['Y'])
    assert(birth !== false && tail !== false)
    expect(tail[0][4]).toBe(birth[0][4] + 5)
    insert(state, 0, ['X'])
    insert(state, 3, ['Z'])
    remove(state, 6, 7)
    expect(values(state)).toEqual(['X', 'a', 'b', 'Z', 'c', 'd'])
    const issued = rows(snapshot(state)).filter((strip) => strip[4] !== absent)
    expect(
      new Set(issued.map((strip) => strip.slice(2, 5).join(':'))).size
    ).toBe(issued.length)
  })

  it('rebuilds snapshot fragments without trusting split or competitor indices', () => {
    const author = create<string>(parent)
    insert(author, 0, ['X'])
    insert(author, 2, ['Y'])
    const saved = snapshot(author)
    for (let offset = 0; offset < saved[0].length; offset += 12) {
      saved[0][offset + 8] = 0
      saved[0][offset + 9] = 0
    }
    const target = create<string>()
    merge(target, saved)
    expect(values(target)).toEqual(values(author))
    const deletion: Delta<string> = [
      [2, 2, 70, 80, 0, 10, 20, 1, absent, absent, 0, 1],
    ]
    merge(target, deletion)
    merge(author, deletion)
    expect(values(target)).toEqual(['X', 'a', 'Y'])
    expect(values(target)).toEqual(values(author))
  })

  it('resolves pending Masks in merge without changing their original targets', () => {
    const author = create<string>()
    const birth = insert(author, 0, ['a', 'b', 'c'])
    const first = remove(author, 0, 1)
    const second = remove(author, 0, 1)
    assert(birth !== false && first !== false && second !== false)
    let target = create<string>()
    merge(target, second)
    merge(target, first)
    target = create<string>(snapshot(target))
    merge(target, birth)
    expect(values(target)).toEqual(['c'])
    expect(rows(snapshot(target)).filter((strip) => strip[0] === 5)).toEqual([])
  })

  it('does not process pending operations during a local apply', () => {
    const state = create<string>()
    const birth = insert(state, 0, ['a'])
    assert(birth !== false)
    const dependency = [...birth[0].slice(2, 4), birth[0][4] + 2]
    const pending: Delta<string> = [
      [1, 1, 70, 80, 0, ...dependency, absent, absent, 1, 0],
      ['pending'],
    ]
    expect(merge(state, pending)).toBe(false)
    insert(state, 1, ['b'])
    expect(values(state)).toEqual(['a', 'b'])
    expect(
      rows(snapshot(state)).filter((strip) => strip[0] === 4)
    ).toHaveLength(1)
  })
})
