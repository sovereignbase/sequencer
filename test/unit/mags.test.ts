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
import type { Acknowledgement } from '../../src/typescript/index.js'

describe('runtime merge and retained state', () => {
  it('ignores malformed and duplicate creation data', () => {
    const source = create<string>()
    assert(insert(source, 0, ['a', 'b']))
    const delta = snapshot(source)

    expect(values(create([null, [[0]], ...delta]))).toEqual(['a', 'b'])
    expect(values(create([...delta, ...delta]))).toEqual(['a', 'b'])
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

    expect(merge(target, result)).toEqual({ 1: undefined })
    expect(values(target)).toEqual(['a', 'c'])
  })

  it('retains a valid unresolved Strip in the Snapshot', () => {
    const state = create<string>()
    assert(insert(state, 0, ['root']))
    const orphan = [[0, 0, 1, 11, 22, 0, 33, 44, 0], ['pending']]

    expect(merge(state, [orphan])).toBe(false)
    const retained = snapshot(state)
    expect(retained).toHaveLength(2)
    expect(retained[1]).toEqual(orphan)
  })

  it('acknowledges materialized Realms and collects Mask Footage', () => {
    const state = create<string>()
    assert(insert(state, 0, ['a', 'b', 'c']))
    assert(remove(state, 1, 2))

    const frontier = acknowledge(state)
    assert(frontier)
    expect(frontier).toHaveLength(1)

    compact([frontier], state)

    expect(values(state)).toEqual(['a', 'c'])
    expect(recover(state)).toEqual(['a', 'c'])
    expect(state.footage[1]).toBeUndefined()
  })

  it('reduces acknowledgement boundaries by matching Realm', () => {
    const state = create<string>()
    const first: Acknowledgement = [
      [10, 20, 8],
      [11, 21, 7],
    ]
    const selected: Acknowledgement = first.map((point) => [...point])
    const second: Acknowledgement = [
      [10, 20, 3],
      [11, 21, 5],
    ]
    const third: Acknowledgement = [[10, 20, 6]]

    compact([selected, second, third], state)

    expect(selected).toEqual(second)
  })
})
