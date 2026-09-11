import { describe, expect, it } from 'vitest'
import { acknowledge, compact, create, find, insert, merge, recover, remove, snapshot, values } from '../../src/typescript/index.js'
import type { Delta } from '../../src/typescript/index.js'

const absent = 0xffff_ffff
const parent: Delta<string> = [[1, 4, 10, 20, 0, 0, 0, 0, absent, absent], ['a', 'b', 'c', 'd']]
const left: Delta<string> = [[2, 2, 70, 80, 0, 10, 20, 1, absent, absent], []]
const right: Delta<string> = [[2, 2, 90, 100, 0, 10, 20, 2, absent, absent], []]

function rows(delta: Delta<string>) {
  return Array.from({ length: delta[0].length / 10 }, (_, index) => delta[0].slice(index * 10, index * 10 + 10))
}

describe('Instruction and applied Masks', () => {
  it.each([false, true])('retains both overlapping instructions without duplicate content (reverse=%s)', (reverse) => {
    const state = create<string>()
    merge(state, parent)
    merge(state, reverse ? right : left)
    merge(state, reverse ? left : right)
    expect(values(state)).toEqual(['a'])
    expect(recover(state)).toEqual(['a', 'b', 'c', 'd'])
    const saved = snapshot(state)
    expect(saved[1]).toEqual(['a', 'b', 'c', 'd'])
    expect(rows(saved).filter((row) => row[0] === 2).map((row) => row.slice(0, 5)).sort()).toEqual([
      left[0].slice(0, 5), right[0].slice(0, 5),
    ].sort())
    expect(rows(saved).filter((row) => row[0] === 6 || row[0] === 7).reduce((sum, row) => sum + row[1], 0)).toBe(3)
    const restored = create<string>(saved)
    expect(values(restored)).toEqual(['a'])
    expect(recover(restored)).toEqual(recover(state))
    expect(acknowledge(restored)).toEqual(acknowledge(state))
    for (const target of [create<string>(), create<string>(parent)]) {
      merge(target, saved)
      expect(values(target)).toEqual(['a'])
      expect(recover(target)).toEqual(['a', 'b', 'c', 'd'])
      expect(acknowledge(target)).toEqual(acknowledge(state))
      expect(merge(target, saved)).toBe(false)
      expect(recover(target)).toEqual(['a', 'b', 'c', 'd'])
    }
  })

  it('resolves an insert depending on a masked source point before and after restart', () => {
    const state = create<string>()
    merge(state, parent)
    merge(state, left)
    const saved = snapshot(state)
    const child: Delta<string> = [[1, 1, 110, 120, 0, 10, 20, 2, absent, absent], ['X']]
    for (const target of [state, create<string>(saved)]) {
      expect(merge(target, child)).not.toBe(false)
      expect(values(target)).toEqual(['a', 'X', 'd'])
      expect(recover(target)).toEqual(['a', 'b', 'X', 'c', 'd'])
    }
  })

  it('hard GC preserves overlapping content until its remaining instruction is acknowledged', () => {
    const state = create<string>()
    merge(state, parent)
    merge(state, left)
    merge(state, right)
    compact([[70, 80, 3]], state, true)
    expect(recover(state)).toEqual(['a', 'c', 'd'])
    expect(values(state)).toEqual(['a'])
    const restored = create<string>(snapshot(state))
    expect(recover(restored)).toEqual(['a', 'c', 'd'])
    for (const target of [state, restored]) {
      compact([[70, 80, 3, 90, 100, 3]], target, true)
      expect(values(target)).toEqual(['a'])
      expect(recover(target)).toEqual(['a'])
      expect(rows(snapshot(target)).filter((row) => row[0] === 2 || row[0] === 6 || row[0] === 7)).toEqual([])
      expect(merge(target, parent)).toBe(false)
      expect(merge(target, left)).toBe(false)
      expect(merge(target, right)).toBe(false)
      expect(values(target)).toEqual(['a'])
      expect(insert(target, 1, ['Z'])).not.toBe(false)
      expect(values(target)).toEqual(['a', 'Z'])
      expect(find(target, 1)).toBe('Z')
    }
  })

  it('soft GC removes hard-released source fragments and preserves future Mask counters', () => {
    const state = create<string>()
    merge(state, parent)
    expect(remove(state, 1, 3, true)).not.toBe(false)
    const frontier = acknowledge(state)
    expect(frontier).not.toBe(false)
    if (frontier === false) return
    const retained = snapshot(state)
    expect(retained[1]).toEqual(['a', 'd'])
    const restored = create<string>(retained)
    for (const target of [state, restored]) {
      compact([frontier], target)
      expect(values(target)).toEqual(['a', 'd'])
      expect(recover(target)).toEqual(['a', 'd'])
      expect(rows(snapshot(target)).filter((row) => row[0] === 2 || row[0] === 22 || row[0] === 23)).toEqual([])
      const next = remove(target, 1, 2)
      expect(next).not.toBe(false)
      if (next !== false) expect(next[0][4]).toBe(frontier[2])
      const next_frontier = acknowledge(target)
      expect(next_frontier).toEqual([frontier[0], frontier[1], frontier[2] + 2])
    }
  })
})
