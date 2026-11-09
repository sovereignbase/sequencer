/** Stable-index reads, local edits, retained configuration and Footage ownership. */
import { afterEach, describe, expect, it } from 'vitest'
import { Projection, SequencerError } from '../../../src/typescript/class.ts'
import { sequenceInsertions } from '../../.shared/sequence.ts'

const instances: Projection<unknown>[] = []
/** Tracks native ownership while exercising only the public API. */
function tuple<T>(length?: number): Projection<T> {
  const projection = new Projection<T>(1, undefined, {
    enabled: 1,
    maxLength: length,
  })
  instances.push(projection)
  return projection
}
afterEach(() => {
  for (const projection of instances.splice(0)) projection.destroy()
})

describe('Tuple public API', () => {
  it('keeps ordinary sequence behavior when disabled', () => {
    const projection = new Projection<string>(1, undefined, {
      enabled: 0,
      maxLength: 4,
    })
    instances.push(projection)
    projection.insert(['a', 'b'], 0)
    projection.insert(['c'], 0)
    expect(projection.values()).toEqual(['c', 'a', 'b'])
    expect(projection.length()).toBe(3)
  })

  it('starts with a fixed number of empty registers, including length zero', () => {
    const projection = tuple<string>(4)
    expect(projection.length()).toBe(4)
    expect(projection.values()).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ])
    expect(projection.value(3)).toBeUndefined()
    expect(projection.value(4)).toBeUndefined()
    const empty = tuple(0)
    expect(empty.length()).toBe(0)
    expect(empty.values()).toEqual([])
    expect(empty.remove()).toEqual([[1]])
  })

  it('authors six words per Frame without shifting adjacent indices', () => {
    const projection = tuple<string>(4)
    const values = ['a', 'b', 'c']
    const gossip = projection.insert(values, 1)
    expect(gossip).toHaveLength(3)
    expect(
      gossip.map((entry) => (entry[0] as readonly number[]).slice(0, 3))
    ).toEqual([
      [0, 0, 1],
      [0, 0, 2],
      [0, 0, 3],
    ])
    expect(gossip.map((entry) => (entry[0] as readonly number[])[5])).toEqual([
      1, 1, 1,
    ])
    expect(gossip.map((entry) => entry[1])).toEqual([['a'], ['b'], ['c']])
    projection.remove(2, 2)
    expect(projection.values()).toEqual([undefined, 'a', undefined, 'c'])
    expect(values).toEqual(['a', 'b', 'c'])
    expect(gossip.map((entry) => entry[1])).toEqual([['a'], ['b'], ['c']])
    expect(projection.values(1, 2)).toEqual(['a', undefined])
    expect(projection.values(3, 2)).toEqual([])
    expect(projection.length()).toBe(4)
  })

  it('replaces an inclusive range without moving the remaining registers', () => {
    const projection = tuple<string>(4)
    projection.insert(['a', 'b', 'c', 'd'], 0)
    projection.replace(['x'], 1, 2)
    expect(projection.values()).toEqual(['a', 'x', undefined, 'd'])
    projection.replace([], 1, 1)
    expect(projection.values()).toEqual(['a', undefined, undefined, 'd'])
    projection.remove()
    expect(projection.values()).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ])
    projection.replace(['new'])
    expect(projection.values()).toEqual([
      'new',
      undefined,
      undefined,
      undefined,
    ])
  })

  it('grows dynamically while preserving empty and removed indices', () => {
    const projection = tuple<string>()
    expect(projection.length()).toBe(0)
    projection.insert(['x'], 4)
    expect(projection.length()).toBe(5)
    expect(projection.values()).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      'x',
    ])
    projection.remove(4, 4)
    expect(projection.length()).toBe(5)
    const restored = new Projection<string>(2, projection.sequence())
    instances.push(restored)
    expect(restored.length()).toBe(5)
    expect(restored.values()).toEqual(projection.values())
  })

  it('addresses sparse high indices without allocating intervening registers', () => {
    const projection = tuple<string>()
    projection.insert(['x'], 1_000_000_000)
    projection.insert(['y'], 0)
    expect(projection.length()).toBe(1_000_000_001)
    expect(projection.value(1_000_000_000)).toBe('x')
    expect(projection.value(999_999_999)).toBeUndefined()
    projection.remove()
    expect(projection.value(0)).toBeUndefined()
    expect(projection.value(1_000_000_000)).toBeUndefined()
    expect(projection.sequence()[1]).toEqual([])
  })

  it('restores fixed configuration and canonical offsets from array or string snapshots', () => {
    const projection = tuple<string>(6)
    projection.insert(['a', 'b', 'c'], 2)
    const snapshot = projection.sequence()
    const text = projection.sequence(true)
    expect(text[1]).toBe('abc')
    for (const sequence of [snapshot, text]) {
      const restored = new Projection<string>(2, sequence)
      instances.push(restored)
      expect(restored.length()).toBe(6)
      expect(restored.values()).toEqual(projection.values())
      restored.remove(3, 3)
      expect(snapshot[1]).toEqual(['a', 'b', 'c'])
      expect(projection.value(3)).toBe('b')
    }
  })

  it('retains omitted Footage and typed numeric lanes', () => {
    const projection = tuple<string>(3)
    expect(projection.apply([[new Uint32Array([0, 0, 1, 100, 0, 1])]])).toEqual(
      [[[1, 2, [undefined]]]]
    )
    expect(sequenceInsertions(projection.sequence())[0][1]).toEqual([undefined])
    const restored = new Projection<string>(2, [
      new Uint32Array(projection.sequence()[0]),
      '\0',
    ])
    instances.push(restored)
    expect(restored.length()).toBe(3)
    expect(restored.value(1)).toBe('\0')
  })

  it('rejects incompatible snapshot modes and capacities', () => {
    const projection = tuple<string>(3)
    const ordinary = new Projection<string>(2)
    instances.push(ordinary)
    ordinary.insert(['a'], 0)
    expect(projection.merge(ordinary.sequence())).toBeUndefined()
    expect(ordinary.merge(projection.sequence())).toBeUndefined()
    expect(tuple<string>(4).merge(projection.sequence())).toBeUndefined()
    expect(
      () => new Projection(2, projection.sequence(), { enabled: false })
    ).toThrow(SequencerError)
    expect(
      () => new Projection(2, ordinary.sequence(), { enabled: true })
    ).toThrow(SequencerError)
    const restored = new Projection(2, projection.sequence(), {
      enabled: true,
      maxLength: 3,
    })
    instances.push(restored)
    expect(restored.length()).toBe(3)
  })

  it('rejects invalid remote coordinates while keeping the accepted prefix', () => {
    const projection = tuple<string>(3)
    for (const words of [
      [0, 0, 3, 100, 0, 1],
      [0, 0, 0, 100, 0, 2],
      [0, 0, 0, 0, 0, 1],
      [100, 0, 0, 101, 0, 1],
      [0, 0, 0, 100, 0, 0xffffffff],
    ])
      expect(projection.apply([[words, ['bad']]])).toBeUndefined()
    expect(
      projection.apply([
        [[0, 0, 1, 100, 0, 1], ['ok']],
        [[0, 0, 3, 200, 0, 1], ['bad']],
      ])
    ).toBeUndefined()
    expect(projection.value(1)).toBe('ok')
    expect(
      projection.apply([[[100, 0, 2, 201, 0, 0xffffffff]]])
    ).toBeUndefined()
    expect(projection.value(1)).toBe('ok')
  })

  it('releases tuple handles and retains the existing destruction errors', () => {
    const projection = tuple<string>(3)
    projection.insert(['x'], 1)
    projection.destroy()
    projection.destroy()
    expect(() => projection.insert(['y'], 1)).toThrow(SequencerError)
    expect(() => projection.value(1)).toThrow(SequencerError)
    expect(() => projection.sequence()).toThrow(SequencerError)
  })
})
