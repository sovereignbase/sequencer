import { describe, expect, it, vi } from 'vitest'
import {
  compact,
  create,
  merge,
  recover,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import { wasm } from '../../src/typescript/wasm/index.js'
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

describe('Native merge change spans', () => {
  it('returns the changed suffix without separate length or values calls', () => {
    const state = create([parent[0], ['a', 'b', 'c']])
    const length = vi.spyOn(wasm, '_get_projection_frame_count')
    const read = vi.spyOn(wasm, '_write_projection_footage_spans_to_buffer')
    try {
      expect(merge(state, child)).toEqual({ 3: 'X' })
      expect(length).not.toHaveBeenCalled()
      expect(read).not.toHaveBeenCalled()
      expect(wasm._get_footage_span_buffer_count()).toBe(0)
      expect(wasm._get_projection_buffer_word_count()).toBe(0)
    } finally {
      length.mockRestore()
      read.mockRestore()
    }
    expect(values(state)).toEqual(['a', 'b', 'c', 'X'])
  })

  it('retains pending content even when there is no visible change', () => {
    const state = create<string>()
    expect(merge(state, child)).toBe(false)
    const restarted = create<string>(snapshot(state))
    for (const target of [state, restarted]) {
      expect(merge(target, parent)).toEqual({ 0: 'a', 1: 'b', 2: 'c', 3: 'X' })
      expect(values(target)).toEqual(['a', 'b', 'c', 'X'])
      expect(merge(target, child)).toBe(false)
      expect(wasm._get_footage_span_buffer_count()).toBe(0)
    }
  })

  it('accepts a Mask without Footage and emits undefined for the removed tail', () => {
    const state = create([parent[0], ['a', 'b', 'c']])
    expect(
      merge(state, [[2, 2, 70, 80, 0, 10, 20, 1, absent, absent, 0, 1]])
    ).toEqual({
      1: undefined,
      2: undefined,
    })
    expect(values(state)).toEqual(['a'])
    expect(recover(state)).toEqual(['a', 'b', 'c'])
    expect(wasm._get_footage_span_buffer_count()).toBe(0)
  })

  it('returns retained values and tail removals in the same change', () => {
    const state = create([parent[0], ['a', 'b', 'c']])
    expect(
      merge(state, [[2, 1, 70, 80, 0, 10, 20, 0, absent, absent, 0, 0]])
    ).toEqual({
      0: 'b',
      1: 'c',
      2: undefined,
    })
    expect(values(state)).toEqual(['b', 'c'])
  })

  it('copies large incoming Footage without a spread-argument limit', () => {
    const footage = Array.from({ length: 200000 }, (_, index) => index)
    const state = create<number>()
    const change = merge(state, [
      [1, footage.length, 10, 20, 0, 0, 0, 0, absent, absent, footage.length, 0],
      footage,
    ])
    expect(change).not.toBe(false)
    if (change !== false) {
      expect(Object.keys(change)).toHaveLength(footage.length)
      expect(change[0]).toBe(0)
      expect(change[footage.length - 1]).toBe(footage.length - 1)
    }
    expect(values(state)).toEqual(footage)
  })

  it('rejects non-uint32 metadata before transfer and missing content natively', () => {
    const state = create<string>()
    expect(
      merge(state, [[1, 1, -1, 0, 0, 0, 0, 0, absent, absent, 1, 0], ['bad']])
    ).toBe(false)
    expect(merge(state, [parent[0]])).toBe(false)
    expect(values(state)).toEqual([])
    expect(wasm._get_projection_buffer_word_count()).toBe(0)
    expect(wasm._get_footage_span_buffer_count()).toBe(0)
  })

  it('bounds the copy when incoming Footage aliases the local array', () => {
    const state = create([parent[0], ['a', 'b', 'c']])
    const words = [1, 3, 30, 40, 0, 10, 20, 3, absent, absent, 3, 3]
    expect(merge(state, [words, state[1]])).toEqual({ 3: 'a', 4: 'b', 5: 'c' })
    expect(state[1]).toEqual(['a', 'b', 'c', 'a', 'b', 'c'])
  })
})

describe('Native multi-actor compaction agreement', () => {
  it.each([1, 3])(
    'rejects a differing frontier %i instead of selecting a minimum',
    (counter) => {
      const state = create([parent[0], ['a', 'b', 'c']])
      merge(state, [[2, 1, 70, 80, 0, 10, 20, 1, absent, absent, 0, 1]])
      compact(
        [
          [70, 80, 2],
          [70, 80, counter],
        ],
        state,
        true
      )
      expect(recover(state)).toEqual(['a', 'b', 'c'])
    }
  )

  it('requires every actor and accepts reordered exact common Realms', () => {
    const state = create([parent[0], ['a', 'b', 'c']])
    merge(state, [[2, 1, 70, 80, 0, 10, 20, 1, absent, absent, 0, 1]])
    compact([[70, 80, 2], []], state, true)
    expect(recover(state)).toEqual(['a', 'b', 'c'])
    compact(
      [
        [70, 80, 2, 90, 100, 5],
        [90, 100, 5, 70, 80, 2],
      ],
      state,
      true
    )
    expect(recover(state)).toEqual(['a', 'c'])
    expect(values(state)).toEqual(['a', 'c'])
  })
})
