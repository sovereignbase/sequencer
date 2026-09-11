import { assert, describe, expect, it } from 'vitest'
import {
  acknowledge,
  compact,
  create,
  insert,
  merge,
  recover,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import type { Delta } from '../../src/typescript/types/type.js'

const absent = 0xffff_ffff
const parent: Delta<string> = [
  [1, 3, 10, 20, 0, 0, 0, 0, absent, absent, 3, 0],
  ['a', 'b', 'c'],
]
const mask: Delta<string> = [[2, 1, 70, 80, 0, 10, 20, 1, absent, absent, 0, 1]]
const head: Delta<string> = [
  [0, 1, 30, 40, 0, 10, 20, 0, absent, absent, 1, 0],
  ['X'],
]

function instructions(delta: Delta<unknown>) {
  const result: number[][] = []
  for (let offset = 0; offset < delta[0].length; offset += 12)
    if (delta[0][offset] === 2 || delta[0][offset] === 5)
      result.push(delta[0].slice(offset, offset + 12))
  return result
}

describe('Mask creation-time dependency prefix', () => {
  it.each([false, true])(
    'masks b on either side of a head split, reverse=%s',
    (reverse) => {
      let state = create<string>(parent)
      const operations = reverse ? [head, mask] : [mask, head]
      merge(state, operations[0])
      state = create<string>(snapshot(state))
      merge(state, operations[1])
      expect(values(state)).toEqual(['X', 'a', 'c'])
      const saved = snapshot(state)
      expect(instructions(saved)[0].slice(5, 8)).toEqual([10, 20, 1])
      expect(instructions(saved)[0][11]).toBe(1)
      const restarted = create<string>(saved)
      expect(values(restarted)).toEqual(['X', 'a', 'c'])
      expect(recover(restarted)).toEqual(['X', 'a', 'b', 'c'])
      expect(acknowledge(restarted)).toEqual([70, 80, 2])
      expect(merge(restarted, mask)).toBe(false)
      compact([[70, 80, 2]], restarted, true)
      expect(values(restarted)).toEqual(['X', 'a', 'c'])
      expect(recover(restarted)).toEqual(['X', 'a', 'c'])
    }
  )

  it('keeps the prefix through a pending snapshot and later source arrival', () => {
    const pending = create<string>()
    expect(merge(pending, mask)).toBe(false)
    const saved = snapshot(pending)
    expect(instructions(saved)[0][0]).toBe(5)
    expect(instructions(saved)[0][11]).toBe(1)
    const state = create<string>(saved)
    merge(state, parent)
    merge(state, head)
    expect(values(state)).toEqual(['X', 'a', 'c'])
  })

  it.each([0, 1])(
    'resolves the unchanged source before insertion at %i arrives',
    (index) => {
      const author = create<string>(parent)
      const insertion = insert(author, index, ['X'])
      assert(insertion !== false)
      const deletion = remove(author, 2, 3)
      assert(deletion !== false)
      const peer = create<string>(parent)
      expect(merge(peer, deletion)).not.toBe(false)
      expect(values(peer)).toEqual(['a', 'c'])
      const restarted = create<string>(snapshot(peer))
      merge(restarted, insertion)
      expect(values(restarted)).toEqual(values(author))
      expect(values(restarted)).toEqual(
        index === 0 ? ['X', 'a', 'c'] : ['a', 'X', 'c']
      )
      expect(instructions(snapshot(restarted))[0][0]).toBe(2)
    }
  )

  it('stores a frame offset larger than the Strip count without index remapping', () => {
    const source = create<number>()
    const insertion = insert(
      source,
      0,
      Array.from({ length: 64 }, (_, index) => index)
    )
    assert(insertion !== false)
    const deletion = remove(source, 32, 33)
    assert(deletion !== false)
    expect(deletion[0][11]).toBe(32)
    const saved = snapshot(source)
    expect(instructions(saved)[0][11]).toBe(32)
    for (const state of [
      create<number>(saved),
      create<number>(insertion),
      create<number>(),
    ]) {
      merge(state, snapshot(source))
      expect(values(state)).toEqual(values(source))
      expect(instructions(snapshot(state))[0][11]).toBe(32)
      const frontier = acknowledge(state)
      assert(frontier !== false)
      compact([frontier], state, true)
      expect(recover(state)).toEqual(values(source))
      const next = remove(state, 0, 1)
      assert(next !== false)
      const next_frontier = acknowledge(state)
      assert(next_frontier !== false)
      compact([next_frontier], state, true)
      expect(recover(state)).toEqual(values(source).slice(1))
    }
  })

  it('keeps source prefix fragments until dependent instructions can be collected', () => {
    const state = create<string>([
      [1, 4, 10, 20, 0, 0, 0, 0, absent, absent, 4, 0],
      ['a', 'b', 'c', 'd'],
    ])
    merge(state, [[2, 2, 70, 80, 0, 10, 20, 1, absent, absent, 0, 1]])
    merge(state, [[2, 2, 90, 100, 0, 10, 20, 2, absent, absent, 0, 2]])
    compact([[70, 80, 3]], state, true)
    const saved = snapshot(state)
    expect(instructions(saved).map((row) => row[2])).toEqual([90])
    const restarted = create<string>(saved)
    compact([[90, 100, 3]], restarted, true)
    expect(values(restarted)).toEqual(['a'])
    expect(recover(restarted)).toEqual(['a'])
    expect(instructions(snapshot(restarted))).toEqual([])
  })
})
