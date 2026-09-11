import { assert, describe, expect, it } from 'vitest'
import {
  acknowledge,
  create,
  compact,
  insert,
  merge,
  recover,
  remove,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import type { Delta } from '../../src/typescript/index.js'

describe('runtime merge and retained state', () => {
  it('rejects malformed merge data and ignores duplicate operations', () => {
    const source = create<string>()
    assert(insert(source, 0, ['a', 'b']))
    const delta = snapshot(source)

    const target = create<string>()
    expect(merge(target, null)).toBe(false)
    expect(merge(target, [[[0]], ['a']])).toBe(false)
    expect(merge(target, [[0], ['a']])).toBe(false)
    expect(values(target)).toEqual([])
    expect(merge(target, delta)).not.toBe(false)
    expect(merge(target, delta)).toBe(false)
    expect(values(target)).toEqual(['a', 'b'])
  })

  it('merges an issued Strip into a Replica with the same base', () => {
    const base = create<string>()
    assert(insert(base, 0, ['a']))
    const base_delta = snapshot(base)
    const source = create<string>(base_delta)
    const target = create<string>(base_delta)
    const result = insert(source, 1, ['b'])
    assert(result)

    expect(merge(target, result)).not.toBe(false)
    expect(values(target)).toEqual(['a', 'b'])
  })

  it('merges a Mask into a Replica with the same base', () => {
    const base = create<string>()
    assert(insert(base, 0, ['a', 'b', 'c']))
    const base_delta = snapshot(base)
    const source = create<string>(base_delta)
    const target = create<string>(base_delta)
    const result = remove(source, 1, 2)
    assert(result)

    expect(merge(target, result)).toEqual({ 1: 'c', 2: undefined })
    expect(values(target)).toEqual(['a', 'c'])
  })

  it('retains a valid unresolved Strip in the Snapshot', () => {
    const state = create<string>()
    assert(insert(state, 0, ['root']))
    const orphan: Delta<string> = [
      [1, 1, 11, 22, 0, 33, 44, 0, 0xffff_ffff, 0xffff_ffff, 1, 0],
      ['pending'],
    ]

    expect(merge(state, orphan)).toBe(false)
    const retained = snapshot(state)
    expect(retained[0]).toHaveLength(24)
    expect(retained[0].slice(12)).toEqual([4, ...orphan[0].slice(1)])
    expect(retained[1]).toEqual(['root', 'pending'])
    const restored = create<string>(retained)
    expect(values(restored)).toEqual(['root'])
    expect(snapshot(restored)).toEqual(retained)
  })

  it('acknowledges materialized Realms and collects Mask Footage', () => {
    const state = create<string>()
    assert(insert(state, 0, ['a', 'b', 'c']))
    assert(remove(state, 1, 2))

    const frontier = acknowledge(state)
    assert(frontier)
    expect(frontier).toHaveLength(3)
    expect(frontier[2]).toBe(2)

    compact([frontier], state)
    expect(recover(state)).toEqual(['a', 'b', 'c'])
    compact([frontier], state, true)

    expect(values(state)).toEqual(['a', 'c'])
    expect(recover(state)).toEqual(['a', 'c'])
    expect(state[1][1]).toBeUndefined()
  })

  it('requires exact Realm frontiers without mutating acknowledgements', () => {
    const state = create<string>()
    assert(insert(state, 0, ['a', 'b', 'c']))
    assert(remove(state, 1, 2))
    const frontier = acknowledge(state)
    assert(frontier)
    const differing = [...frontier.slice(0, 2), frontier[2] + 1]
    const missing = [frontier[0], (frontier[1] + 1) >>> 0, frontier[2]]
    for (const peer of [differing, missing]) {
      const inputs = [frontier.slice(), peer.slice()]
      const original = inputs.map((input) => input.slice())
      compact(inputs, state, true)
      expect(inputs).toEqual(original)
      expect(recover(state)).toEqual(['a', 'b', 'c'])
    }
    const inputs = [frontier.slice(), frontier.slice()]
    compact(inputs, state, true)
    expect(inputs).toEqual([frontier, frontier])
    expect(recover(state)).toEqual(['a', 'c'])
  })
})
