import { describe, expect, it } from 'vitest'
import {
  acknowledge,
  compact,
  create,
  merge,
  recover,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import type { Delta } from '../../src/typescript/types/type.js'

const absent = 0xffff_ffff
const parent: Delta<string> = [
  [1, 3, 10, 20, 0, 0, 0, 0, absent, absent, 3, 0],
  ['a', 'b', 'c'],
]
const child: Delta<string> = [
  [1, 1, 30, 40, 0, 10, 20, 3, absent, absent, 1, 3],
  ['X'],
]
const mask: Delta<string> = [[2, 1, 70, 80, 0, 10, 20, 1, absent, absent, 0, 1], []]

describe('Compiled production runtime', () => {
  it.each([1, 16, 64])(
    'keeps one Mask across source fragments separated by %i inserts',
    (gap) => {
      const words: Array<number> = []
      const footage: Array<string> = []
      const visible: Array<string> = []
      for (let fragment = 0; fragment < 3; ++fragment) {
        const strip = words.length / 12
        words.push(
          1,
          fragment === 0 ? 6 : 0,
          ...(fragment === 0 ? [10, 20, 0] : [absent, absent, absent]),
          ...(fragment === 0 ? [0, 0, 0] : [10, 20, fragment * 2]),
          fragment === 2 ? absent : strip + gap + 1,
          absent,
          2,
          fragment * 2
        )
        footage.push(
          String.fromCharCode(97 + fragment * 2),
          String.fromCharCode(98 + fragment * 2)
        )
        if (fragment === 2) break
        for (let index = 0; index < gap; ++index) {
          const counter = (fragment * gap + index) * 2
          words.push(
            1,
            1,
            30,
            40,
            counter,
            10,
            20,
            fragment * 2 + 2,
            absent,
            absent,
            1,
            fragment * 2 + 2
          )
          const value = `X${fragment}:${index}`
          footage.push(value)
          visible.push(value)
        }
      }
      const state = create<string>([words, footage])
      const deletion: Delta<string> = [
        [2, 5, 70, 80, 0, 10, 20, 0, absent, absent, 0, 0],
        [],
      ]
      const observed = values(state)
      const change = merge(state, deletion)
      expect(change).not.toBe(false)
      Object.assign(observed, change)
      expect(observed.slice(0, visible.length + 1)).toEqual([...visible, 'f'])
      expect(
        observed.slice(visible.length + 1).every((value) => value === undefined)
      ).toBe(true)
      expect(values(state)).toEqual([...visible, 'f'])
      expect(recover(state).slice().sort()).toEqual(footage.slice().sort())
      expect(acknowledge(state)).toEqual([70, 80, 6])
      expect(merge(state, deletion)).toBe(false)
      const saved = snapshot(state)
      const masks = []
      for (let index = 0; index < saved[0].length; index += 12)
        if (saved[0][index] === 2) masks.push(saved[0].slice(index, index + 8))
      expect(masks).toEqual([deletion[0].slice(0, 8)])
      const restored = create<string>(saved)
      expect(values(restored)).toEqual([...visible, 'f'])
      expect(recover(restored)).toEqual(recover(state))
      expect(snapshot(restored)).toEqual(saved)
      expect(acknowledge(restored)).toEqual([70, 80, 6])
      for (const target of [state, restored]) {
        compact([[70, 80, 6]], target)
        expect(recover(target).slice().sort()).toEqual(footage.slice().sort())
        compact([[70, 80, 6]], target, true)
        expect(recover(target)).toEqual([...visible, 'f'])
        expect(values(target)).toEqual([...visible, 'f'])
        const next: Delta<string> = [
          [2, 1, 70, 80, 6, 10, 20, 5, absent, absent, 0, 5],
          [],
        ]
        expect(merge(target, next)).not.toBe(false)
        expect(acknowledge(target)).toEqual([70, 80, 8])
        expect(values(target)).toEqual(visible)
      }
    }
  )

  it.each([1, 3, 16])(
    'follows %i empty source anchors without masking intervening inserts',
    (anchor_count) => {
      const words: Array<number> = []
      const inserted = Array.from(
        { length: anchor_count },
        (_, index) => `X${index}`
      )
      for (let index = 0; index < anchor_count; ++index) {
        words.push(
          1,
          index === 0 ? 3 : 0,
          ...(index === 0 ? [10, 20, 0] : [absent, absent, absent]),
          ...(index === 0 ? [0, 0, 0] : [10, 20, 0]),
          (index + 1) * 2,
          absent,
          0,
          0
        )
        words.push(1, 1, 30, 40, index * 2, 10, 20, 0, absent, absent, 1, 0)
      }
      words.push(
        1,
        0,
        absent,
        absent,
        absent,
        10,
        20,
        0,
        absent,
        absent,
        3,
        0
      )
      const state = create<string>([words, [...inserted, 'a', 'b', 'c']])
      const deletion: Delta<string> = [
        [2, 2, 70, 80, 0, 10, 20, 0, absent, absent, 0, 0],
        [],
      ]
      expect(merge(state, deletion)).toEqual({
        [anchor_count]: 'c',
        [anchor_count + 1]: undefined,
        [anchor_count + 2]: undefined,
      })
      expect(values(state)).toEqual([...inserted, 'c'])
      expect(recover(state)).toEqual([...inserted, 'a', 'b', 'c'])
      expect(acknowledge(state)).toEqual([70, 80, 3])
      expect(merge(state, deletion)).toBe(false)
      const saved = snapshot(state)
      const restored = create<string>(saved)
      expect(values(restored)).toEqual([...inserted, 'c'])
      expect(recover(restored)).toEqual([...inserted, 'a', 'b', 'c'])
      expect(acknowledge(restored)).toEqual([70, 80, 3])
      expect(snapshot(restored)).toEqual(saved)
    }
  )

  it('resolves a pending child and ignores repeated identities', () => {
    const state = create<string>()
    expect(merge(state, child)).toBe(false)
    expect(values(state)).toEqual([])
    expect(merge(state, parent)).toEqual({ 0: 'a', 1: 'b', 2: 'c', 3: 'X' })
    expect(values(state)).toEqual(['a', 'b', 'c', 'X'])
    expect(merge(state, parent)).toBe(false)
    expect(merge(state, child)).toBe(false)
    expect(values(state)).toEqual(['a', 'b', 'c', 'X'])
    expect(values(create(snapshot(state)))).toEqual(['a', 'b', 'c', 'X'])
  })

  it('preserves an applied Mask identity and ACK through a snapshot', () => {
    const state = create<string>()
    merge(state, parent)
    expect(merge(state, mask)).toEqual({ 1: 'c', 2: undefined })
    expect(values(state)).toEqual(['a', 'c'])
    expect(recover(state)).toEqual(['a', 'b', 'c'])
    expect(acknowledge(state)).toEqual([70, 80, 2])
    const saved = snapshot(state)
    expect(saved[0].slice(12, 20)).toEqual(mask[0].slice(0, 8))
    const restored = create(saved)
    expect(values(restored)).toEqual(['a', 'c'])
    expect(recover(restored)).toEqual(['a', 'b', 'c'])
    expect(acknowledge(restored)).toEqual([70, 80, 2])
    expect(snapshot(restored)).toEqual(saved)
  })

  it('does not release soft content unless hard compaction is requested', () => {
    const state = create<string>()
    merge(state, parent)
    merge(state, mask)
    compact([[70, 80, 2]], state)
    expect(recover(state)).toEqual(['a', 'b', 'c'])
    compact([[70, 80, 2]], state, true)
    expect(state[1]).toEqual(['a', undefined, 'c'])
    expect(recover(state)).toEqual(['a', 'c'])
    expect(values(state)).toEqual(['a', 'c'])
  })
})
