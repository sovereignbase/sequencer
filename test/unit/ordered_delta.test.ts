import { assert, describe, expect, it } from 'vitest'
import {
  create,
  insert,
  merge,
  replace,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import {
  clear_footage_spans,
  merge_sequence,
} from '../../src/typescript/wasm/index.js'
import type { Delta, Replica } from '../../src/typescript/index.js'

const absent = 0xffff_ffff

function spans(state: Replica<string>, delta: Delta<string>) {
  const borrowed = merge_sequence(
    state[0],
    delta[0],
    state[1].length,
    delta[1]?.length ?? 0
  )
  const result = borrowed === false ? [] : Array.from(borrowed)
  clear_footage_spans()
  return Array.from({ length: result.length / 4 }, (_, index) =>
    result.slice(index * 4, index * 4 + 4)
  )
}

function source(length: number): Delta<string> {
  return [
    [1, length, 10, 20, 0, 0, 0, 0, absent, absent, length, 0],
    new Array<string>(length).fill('a'),
  ]
}

describe('Dependency-ordered Delta contract', () => {
  it('does not read the accepted Footage back frame by frame to materialize a Change', () => {
    const state = create<string>()
    let frame_reads = 0
    state[1] = new Proxy(state[1], {
      get(target, property, receiver) {
        if (typeof property === 'string' && /^\d+$/.test(property))
          ++frame_reads
        return Reflect.get(target, property, receiver)
      },
    })
    merge(state, source(4))
    expect(frame_reads).toBe(0)
  })

  it('stops at a later missing dependency without searching the remaining rows', () => {
    const state = create<string>()
    const parent = source(2)
    const unknown = [1, 1, 30, 40, 0, 90, 100, 0, absent, absent, 1, 0]
    const independent = [1, 1, 50, 60, 0, 0, 0, 0, absent, absent, 1, 0]
    expect(
      merge(state, [
        [...parent[0], ...unknown, ...independent],
        ['a', 'a', 'unknown', 'independent'],
      ])
    ).toEqual({ 0: 'a', 1: 'a' })
    expect(snapshot(state)).toEqual(parent)
    expect(state[1]).toEqual(['a', 'a'])
  })

  it.each([3, 4, 5, 6, 7, 22, 23, 255])(
    'rejects non-operation type %i without retaining state',
    (type) => {
      const state = create<string>()
      const invalid = source(1)
      invalid[0][0] = type
      expect(merge(state, invalid)).toBe(false)
      expect(snapshot(state)).toEqual([[], []])
      expect(state[1]).toEqual([])
    }
  )

  it.each([4, 65536])(
    'emits only the inserted Strip spans in a %i-Frame source',
    (length) => {
      const state = create<string>()
      merge(state, source(length))
      const position = length / 2
      const delta: Delta<string> = [
        [0, 1, 30, 40, 0, 10, 20, position, absent, absent, 1, position],
        ['X'],
      ]
      expect(spans(state, delta)).toEqual([
        [absent, 0, 1, 0],
        [position, length, 1, 0],
      ])
    }
  )

  it('emits only the Mask and insert ranges for an equal-length replacement', () => {
    const author = create<string>()
    const target = create<string>()
    const base = source(32)
    merge(author, base)
    merge(target, base)
    const delta = replace(author, 8, ['X', 'Y'])
    assert(delta !== false)
    expect(spans(target, delta)).toEqual([
      [8, absent, 2, 1],
      [absent, 0, 2, 0],
      [8, 32, 2, 0],
    ])
  })

  it('keeps separate Mask spans when unrelated insertions separate its source fragments', () => {
    const state = create<string>()
    merge(state, [
      [1, 6, 10, 20, 0, 0, 0, 0, absent, absent, 6, 0],
      ['a', 'b', 'c', 'd', 'e', 'f'],
    ])
    assert(insert(state, 2, ['X']))
    assert(insert(state, 5, ['Y']))
    const mask: Delta<string> = [
      [2, 5, 30, 40, 0, 10, 20, 0, absent, absent, 0, 0],
    ]
    const result = spans(state, mask)
    expect(values(state)).toEqual(['X', 'Y', 'f'])
    expect(result).toEqual([
      [0, absent, 2, 1],
      [1, absent, 2, 1],
      [2, absent, 1, 1],
    ])
  })
})
