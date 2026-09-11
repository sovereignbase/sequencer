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
  [1, 3, 10, 20, 0, 0, 0, 0, absent, absent],
  ['a', 'b', 'c'],
]
const child: Delta<string> = [
  [1, 1, 30, 40, 0, 10, 20, 3, absent, absent],
  ['X'],
]
const mask: Delta<string> = [[2, 1, 70, 80, 0, 10, 20, 1, absent, absent], []]

describe('Compiled production runtime', () => {
  it.each([1, 3, 16])('follows %i empty source anchors without masking intervening inserts', (anchor_count) => {
    const words: Array<number> = []
    const inserted = Array.from({ length: anchor_count }, (_, index) => `X${index}`)
    for (let index = 0; index < anchor_count; ++index) {
      words.push(1, 0, 10, 20, index,
        ...(index === 0 ? [0, 0, 0] : [10, 20, index - 1]),
        (index + 1) * 2, absent)
      words.push(1, 1, 30, 40, index * 2, 10, 20, index, absent, absent)
    }
    words.push(1, 3, 10, 20, anchor_count, 10, 20, anchor_count - 1, absent, absent)
    const state = create<string>([words, [...inserted, 'a', 'b', 'c']])
    const deletion: Delta<string> = [[2, 2, 70, 80, 0, 10, 20, 0, absent, absent], []]
    expect(merge(state, deletion)).toEqual({ [anchor_count]: 'c', [anchor_count + 1]: undefined, [anchor_count + 2]: undefined })
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
  })

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
    expect(saved[0].slice(10, 18)).toEqual(mask[0].slice(0, 8))
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
