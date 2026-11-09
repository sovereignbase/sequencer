/** Observed removal, deterministic winners and acknowledgement-gated tuple checkpoints. */
import { afterEach, expect, it } from 'vitest'
import { Projection } from '../../../src/typescript/class.ts'
import type { Gossip, Insertion } from '../../../src/typescript/class.ts'
import {
  sequenceFrontiers,
  sequenceInsertions,
} from '../../.shared/sequence.ts'

const instances: Projection<string>[] = []
/** Registers both Actors before any removal can become compactable. */
function tuple(actor = 1, length = 4): Projection<string> {
  const projection = new Projection<string>(actor, undefined, {
    enabled: true,
    maxLength: length,
  })
  projection.apply([[1], [2]])
  instances.push(projection)
  return projection
}
/** Distinct canonical versions isolate ordering from generated local Session identifiers. */
const version = (
  session: number,
  value: string,
  at = 2,
  start = 0
): Insertion<string> => [[0, 0, at, session, start, 1], [value]]
const mask = (
  target: number,
  session: number,
  at = 2,
  targetStart = 0
): Insertion<string> => [[target, targetStart, at, session, 0, 0xffffffff]]
afterEach(() => {
  for (const projection of instances.splice(0)) projection.destroy()
})

it('chooses the same identity for every conflict delivery order', () => {
  for (const sessions of [
    [1, 2, 3],
    [0x7fffffff, 0x80000000, 0xffffffff],
  ]) {
    const operations = sessions.map((session, i) => version(session, String(i)))
    for (const order of [
      [0, 1, 2],
      [2, 1, 0],
      [1, 2, 0],
      [2, 0, 1],
    ]) {
      const projection = tuple()
      for (const index of order) projection.apply([operations[index]])
      expect(projection.value(2)).toBe('2')
      expect(sequenceInsertions(projection.sequence())).toHaveLength(3)
      for (const operation of operations)
        expect(projection.apply([operation])).toEqual([[]])
    }
  }
})

it('breaks same-Session ties by logical start and reports only winner changes', () => {
  const projection = tuple()
  expect(projection.apply([version(100, 'new', 2, 2)])).toEqual([
    [[2, 3, ['new']]],
  ])
  expect(projection.apply([version(100, 'old')])).toEqual([[]])
  expect(projection.apply([mask(100, 200, 2, 2)])?.[0]).toEqual([
    [2, 3, ['old']],
  ])
})

it('removes all observed candidates so hidden versions cannot reappear', () => {
  const a = tuple(1),
    b = tuple(2)
  const operations = [version(100, 'a'), version(200, 'b'), version(300, 'c')]
  a.apply(operations)
  b.apply(operations.toReversed())
  const removal = a.remove(2, 2)
  expect(removal).toHaveLength(4)
  const result = b.apply(removal)!
  expect(a.value(2)).toBeUndefined()
  expect(b.value(2)).toBeUndefined()
  expect(result[0].at(-1)).toEqual([2, 3, [undefined]])
  expect(b.apply(removal)?.[0]).toEqual([])
  expect(b.value(2)).toBeUndefined()
})

it('preserves an unseen concurrent version when observed versions are removed', () => {
  const a = tuple(1),
    b = tuple(2)
  a.apply([version(200, 'known')])
  b.apply([version(200, 'known'), version(100, 'unseen')])
  const removal = a.remove(2, 2)
  b.apply(removal)
  a.apply([version(100, 'unseen')])
  expect(a.value(2)).toBe('unseen')
  expect(b.value(2)).toBe('unseen')
})

it('resolves removals arriving before their targets, including across restart', () => {
  for (const restart of [false, true]) {
    let projection = tuple()
    expect(projection.apply([mask(100, 200)])?.[0]).toEqual([])
    if (restart) {
      projection = new Projection<string>(1, projection.sequence())
      instances.push(projection)
    }
    expect(projection.apply([version(100, 'removed')])?.[0]).toEqual([])
    expect(projection.value(2)).toBeUndefined()
    projection.apply([version(50, 'concurrent')])
    expect(projection.value(2)).toBe('concurrent')
  }
})

it('replays replacements and range removals at unchanged indices', () => {
  const a = tuple(1),
    b = tuple(2)
  b.apply(a.insert(['a', 'b', 'c'], 1))
  b.apply(a.replace(['x'], 1, 2))
  expect(b.values()).toEqual([undefined, 'x', undefined, 'c'])
  expect(b.values()).toEqual(a.values())
  b.apply(a.remove())
  expect(b.values()).toEqual([undefined, undefined, undefined, undefined])
})

it('retains losing candidates through packed snapshots and idempotent merges', () => {
  const source = tuple()
  const operations = Array.from({ length: 100 }, (_, i) =>
    version(i + 1, String(i))
  )
  source.apply(operations)
  const snapshot = source.sequence()
  expect(snapshot[0][4]).toBe(0)
  expect(sequenceInsertions(snapshot)).toHaveLength(100)
  const restored = new Projection<string>(2, snapshot)
  instances.push(restored)
  expect(restored.value(2)).toBe('99')
  expect(restored.merge(snapshot)?.[0]).toEqual([])
  restored.apply([mask(100, 201)])
  expect(restored.value(2)).toBe('98')
  expect(source.value(2)).toBe('99')
})

it('compacts acknowledged masks and deleted versions without rewriting stable indices', () => {
  const a = tuple(1),
    b = tuple(2)
  const insertion = a.insert(['a', 'b', 'c'], 1)
  b.apply(insertion)
  const removal = a.remove(2, 2)
  expect(sequenceInsertions(a.sequence())).toHaveLength(4)
  const result = b.apply(removal)!
  a.apply(result[1])
  for (const projection of [a, b]) {
    const snapshot = projection.sequence()
    expect(
      sequenceInsertions(snapshot).map(([words]) => [words[2], words[5]])
    ).toEqual([
      [1, 1],
      [3, 1],
    ])
    expect(snapshot[1]).toEqual(['a', 'c'])
    expect(sequenceFrontiers(snapshot)).toEqual([[1], [2]])
    const restored = new Projection<string>(3, snapshot)
    instances.push(restored)
    expect(restored.length()).toBe(4)
    expect(restored.values()).toEqual([undefined, 'a', undefined, 'c'])
  }
})

it('retains removals until missing Actors acknowledge or retire', () => {
  const projection = tuple()
  projection.apply([version(100, 'a')])
  projection.remove(2, 2)
  expect(sequenceInsertions(projection.sequence())).toHaveLength(2)
  projection.retire(2)
  expect(sequenceInsertions(projection.sequence())).toEqual([])
  expect(sequenceFrontiers(projection.sequence())).toEqual([[1]])
})

it('converges across every permutation of candidates and targeted removals', () => {
  const operations: Gossip<string> = [
    version(100, 'a'),
    version(200, 'b'),
    mask(200, 300),
  ]
  for (const order of [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ]) {
    const projection = tuple()
    for (const index of order) projection.apply([operations[index]])
    expect(projection.value(2)).toBe('a')
  }
})

it('preserves every register across reordered multi-Actor editing histories', () => {
  // Deliver each Actor's own history immediately; delay and reorder cross-Actor Gossip.
  for (const dynamic of [false, true]) {
    const actors = [1, 2, 3].map((actor) => {
      const projection = new Projection<string>(actor, undefined, {
        enabled: 1,
        maxLength: dynamic ? undefined : 16,
      })
      projection.apply([[1], [2], [3]])
      instances.push(projection)
      return projection
    })
    const packets: Gossip<string>[] = []
    for (let i = 0; i < 90; ++i) {
      const projection = actors[i % 3]
      const at = (i * 7) % 16
      packets.push(
        i % 5 === 0
          ? projection.remove(at, at)
          : i % 4 === 0
            ? projection.replace([String(i)], at, at)
            : projection.insert([String(i)], at)
      )
    }
    for (let actor = 0; actor < actors.length; ++actor)
      for (const packet of actor % 2 ? packets : packets.toReversed()) {
        expect(actors[actor].apply(packet)).toBeDefined()
        expect(actors[actor].apply(packet)).toBeDefined()
      }
    const expected = actors[0].values()
    for (const projection of actors) {
      expect(projection.values()).toEqual(expected)
      const restored = new Projection<string>(4, projection.sequence())
      instances.push(restored)
      expect(restored.values()).toEqual(expected)
    }
  }
})
