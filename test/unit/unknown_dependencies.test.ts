import { assert, describe, expect, it } from 'vitest'
import {
  acknowledge,
  create,
  insert,
  merge,
  recover,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import { wasm } from '../../src/typescript/wasm/index.js'
import type { Delta } from '../../src/typescript/index.js'

const absent = 0xffff_ffff
const parent: Delta<string> = [
  [1, 3, 10, 20, 0, 0, 0, 0, absent, absent, 3, 0],
  ['a', 'b', 'c'],
]
const child: Delta<string> = [
  [1, 1, 30, 40, 0, 10, 20, 3, absent, absent, 1, 3],
  ['X'],
]

describe('No retained dependency queue', () => {
  it('accepts a local insert anchored to a known Mask instruction', () => {
    const author = create<string>()
    merge(author, parent)
    const target = create<string>()
    merge(target, parent)
    const mask = remove(author, 1, 3)
    assert(mask !== false)
    merge(target, mask)
    const insertion = insert(author, 1, ['X'])
    assert(insertion !== false)
    expect(insertion[0].slice(5, 8)).toEqual(mask[0].slice(2, 5))
    expect(merge(target, insertion)).toEqual({ 1: 'X' })
    expect(values(target)).toEqual(['a', 'X'])
    expect(values(target)).toEqual(values(author))
  })

  it('does not retry an earlier row when its source arrives later in the same Delta', () => {
    const state = create<string>()
    expect(
      merge(state, [
        [...child[0], ...parent[0]],
        ['X', 'a', 'b', 'c'],
      ])
    ).toEqual({ 0: 'a', 1: 'b', 2: 'c' })
    expect(state[1]).toEqual(['a', 'b', 'c'])
    expect(snapshot(state)).toEqual(parent)
    expect(merge(state, child)).toEqual({ 3: 'X' })
    expect(merge(state, child)).toBe(false)
    expect(state[1]).toEqual(['a', 'b', 'c', 'X'])
  })

  it('accepts an ignored operation through a subsequent full snapshot', () => {
    const author = create<string>()
    merge(author, parent)
    merge(author, child)
    const state = create<string>()
    expect(merge(state, child)).toBe(false)
    expect(snapshot(state)).toEqual([[], []])
    expect(merge(state, snapshot(author))).toEqual({
      0: 'a',
      1: 'b',
      2: 'c',
      3: 'X',
    })
    expect(values(state)).toEqual(values(author))
    expect(recover(state)).toEqual(recover(author))
  })

  it('retains a Mask before its hidden content fragments without a visible Change', () => {
    const author = create<string>()
    assert(insert(author, 0, ['a', 'b', 'c']))
    const mask = remove(author, 0, 3)
    assert(mask !== false)
    const saved = snapshot(author)
    expect(saved[0][0]).toBeLessThan(2)
    expect(saved[0][10]).toBe(0)
    expect(saved[0][12]).toBe(2)
    expect(saved[0][24]).toBeGreaterThanOrEqual(6)
    const state = create<string>()
    expect(merge(state, mask)).toBe(false)
    expect(acknowledge(state)).toBe(false)
    expect(merge(state, saved)).toBe(false)
    expect(values(state)).toEqual([])
    expect(recover(state)).toEqual(['a', 'b', 'c'])
    expect(state[1]).toEqual(['a', 'b', 'c'])
    expect(acknowledge(state)).toEqual(acknowledge(author))
    expect(merge(state, saved)).toBe(false)
    expect(state[1]).toEqual(['a', 'b', 'c'])
    expect(recover(create<string>(snapshot(state)))).toEqual(['a', 'b', 'c'])
    expect(wasm._get_footage_span_buffer_count()).toBe(0)
    expect(wasm._get_projection_buffer_word_count()).toBe(0)
  })

  it('reports accepted prefix changes when a later row lacks its Footage', () => {
    const state = create<string>()
    expect(
      merge(state, [
        [...parent[0], ...child[0]],
        ['a', 'b', 'c'],
      ])
    ).toEqual({ 0: 'a', 1: 'b', 2: 'c' })
    expect(snapshot(state)).toEqual(parent)
    expect(merge(state, child)).toEqual({ 3: 'X' })
  })
})
