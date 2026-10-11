import { describe, expect, it } from 'vitest'
import { Projection } from '../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../src/typescript/class.ts'
const seed = (): Sequence<string> => [
  [],
  [
    [
      [0, 0, 0, 100, 0, 3],
      ['a', 'b', 'c'],
    ],
  ],
]
const seeded = () => new Projection<string>(1, seed())
function expectGossip(gossip: Gossip<string>, expected: string[]): void {
  const receiver = new Projection<string>(2, seed())
  expect(receiver.apply(gossip)).toBeDefined()
  expect(receiver.values()).toEqual(expected)
}
describe('Projection public API', () => {
  describe('constructor', () => {
    it('creates an empty projection for the supplied actor', () => {
      const projection = new Projection<string>(7)
      expect(projection.actorID).toBe(7)
      expect(projection.length()).toBe(0)
      expect(projection.values()).toEqual([])
    })
    it('hydrates a trusted Sequence', () => {
      const projection = new Projection<string>(7, seed())
      expect(projection.actorID).toBe(7)
      expect(projection.length()).toBe(3)
      expect(projection.values()).toEqual(['a', 'b', 'c'])
    })
  })
  describe('apply', () => {
    it('returns insertion splices using visible positions', () => {
      const projection = new Projection<string>(2)
      expect(projection.apply(seed()[1])).toEqual([[[0, 0, ['a', 'b', 'c']]]])
      expect(projection.values()).toEqual(['a', 'b', 'c'])
    })
    it('returns removal splices with an exclusive end and receipt Gossip', () => {
      const projection = seeded()
      expect(projection.apply([[[100, 0, 1, 200, 0, 4294967295]]])).toEqual([
        [[1, 2]],
        [[1, 200, 1]],
      ])
      expect(projection.values()).toEqual(['a', 'c'])
    })
    it('preserves the Frame count in returned splices when Footage is omitted', () => {
      const projection = new Projection<string>(1)
      const result = projection.apply([[[0, 0, 0, 100, 0, 2]]])
      expect(result?.[0]).toEqual([[0, 0, new Array(2)]])
      expect(projection.length()).toBe(2)
      expect(projection.value(0)).toBeUndefined()
    })
    it('accepts empty batches, acknowledgements, and duplicate Insertions without visible changes', () => {
      const projection = seeded()
      for (const gossip of [[], [[2]], seed()[1]])
        expect(projection.apply(gossip)).toEqual([[]])
      expect(projection.values()).toEqual(['a', 'b', 'c'])
    })
    it('defers an Insertion until its parent arrives', () => {
      const projection = new Projection<string>(1)
      expect(projection.apply([[[100, 0, 1, 200, 0, 1], ['X']]])).toEqual([[]])
      expect(projection.values()).toEqual([])
      expect(projection.apply(seed()[1])).toEqual([
        [
          [0, 0, ['a', 'b', 'c']],
          [1, 1, ['X']],
        ],
      ])
      expect(projection.values()).toEqual(['a', 'X', 'b', 'c'])
    })
    it.each(
      [
        undefined,
        null,
        {},
        'gossip',
        [[[0, 0, 0, 200, 0, 0], []]],
        [[1, 2]],
        [[1, NaN, 2]],
      ].map((input) => ({ input }))
    )('returns undefined for malformed input $input', ({ input }) => {
      const projection = seeded()
      expect(projection.apply(input)).toBeUndefined()
      expect(projection.values()).toEqual(['a', 'b', 'c'])
    })
    it('retains earlier valid entries when a later entry is invalid', () => {
      const projection = new Projection<string>(1)
      expect(projection.apply([...seed()[1], null])).toBeUndefined()
      expect(projection.values()).toEqual(['a', 'b', 'c'])
    })
  })
  describe('insert', () => {
    it.each([
      [0, ['X', 'a', 'b', 'c']],
      [1, ['a', 'X', 'b', 'c']],
      [3, ['a', 'b', 'c', 'X']],
    ])(
      'inserts at boundary %i and returns replicable Gossip',
      (at, expected) => {
        const projection = seeded()
        const gossip = projection.insert(['X'], at)
        expect(projection.values()).toEqual(expected)
        expectGossip(gossip, expected)
      }
    )
    it('inserts into an empty projection and preserves returned value references', () => {
      const projection = new Projection<object>(1)
      const value = { text: 'a' }
      const footage = [value]
      const gossip = projection.insert(footage, 0)
      expect(gossip).toHaveLength(1)
      expect(gossip[0][1]).toBe(footage)
      expect(projection.value(0)).toBe(value)
      expect(projection.length()).toBe(1)
    })
  })
  describe('length', () => {
    it('reports the visible size after insertion, removal, and replacement', () => {
      const projection = seeded()
      expect(projection.length()).toBe(3)
      projection.insert(['d', 'e'], 3)
      expect(projection.length()).toBe(5)
      projection.remove(3, 4)
      expect(projection.length()).toBe(3)
      projection.replace(['X', 'Y'], 1, 1)
      expect(projection.length()).toBe(4)
    })
  })
  describe('merge', () => {
    it('accepts acknowledgement frontiers in an exported Sequence', () => {
      const source = seeded()
      source.remove(1, 1)
      const snapshot = source.sequence()
      expect(snapshot[0].length).toBeGreaterThan(0)
      const receiver = new Projection<string>(2)
      expect(receiver.merge(snapshot)).toBeDefined()
      expect(receiver.values()).toEqual(['a', 'c'])
    })
    it('merges a Sequence and returns its visible changes', () => {
      const projection = new Projection<string>(2)
      expect(projection.merge(seed())).toEqual([[[0, 0, ['a', 'b', 'c']]]])
      expect(projection.values()).toEqual(['a', 'b', 'c'])
      expect(projection.merge(seed())).toEqual([[]])
      expect(projection.values()).toEqual(['a', 'b', 'c'])
    })
    it.each(
      [
        undefined,
        null,
        {},
        [],
        [[], [], []],
        [[], [...seed()[1], null]],
        [null, []],
        [[], {}],
        [[null], seed()[1]],
        [[[1, 2]], seed()[1]],
      ].map((input) => ({ input }))
    )(
      'rejects malformed input $input before applying any part of it',
      ({ input }) => {
        const projection = new Projection<string>(1)
        expect(projection.merge(input)).toBeUndefined()
        expect(projection.values()).toEqual([])
      }
    )
  })
  describe('remove', () => {
    it('removes an inclusive range and returns replicable Gossip', () => {
      const projection = seeded()
      const gossip = projection.remove(0, 1)
      expect(projection.values()).toEqual(['c'])
      expectGossip(gossip, ['c'])
    })
    it('defaults the end to the last visible position', () => {
      const projection = seeded()
      const gossip = projection.remove(1)
      expect(projection.values()).toEqual(['a'])
      expectGossip(gossip, ['a'])
    })
    it('defaults to removing the entire projection, including an empty one', () => {
      const projection = seeded()
      const gossip = projection.remove()
      expect(projection.values()).toEqual([])
      expectGossip(gossip, [])
      expect(projection.remove()).toEqual(expect.any(Array))
      expect(projection.length()).toBe(0)
    })
  })
  describe('replace', () => {
    it('replaces an inclusive range and returns removal/insertion Gossip', () => {
      const projection = seeded()
      const gossip = projection.replace(['X', 'Y'], 1, 1)
      expect(projection.values()).toEqual(['a', 'X', 'Y', 'c'])
      expectGossip(gossip, ['a', 'X', 'Y', 'c'])
    })
    it('uses an empty replacement as removal only', () => {
      const projection = seeded()
      const gossip = projection.replace([], 1, 1)
      expect(projection.values()).toEqual(['a', 'c'])
      expectGossip(gossip, ['a', 'c'])
    })
    it('defaults to replacing the whole projection', () => {
      const projection = seeded()
      const gossip = projection.replace(['X'])
      expect(projection.values()).toEqual(['X'])
      expectGossip(gossip, ['X'])
    })
    it('can initialize an empty projection', () => {
      const projection = new Projection<string>(1)
      expect(projection.replace(['X'])).toEqual(expect.any(Array))
      expect(projection.values()).toEqual(['X'])
    })
  })
  describe('retire', () => {
    it('excludes a retired actor from compaction requirements and future acknowledgements', () => {
      const projection = seeded()
      projection.apply([[2]])
      projection.remove(1, 1)
      expect(
        projection.sequence()[1].some((entry) => (entry[0][5] | 0) < 0)
      ).toBe(true)
      expect(projection.retire(2)).toBeUndefined()
      projection.apply([[2]])
      const sequence = projection.sequence()
      expect(sequence[0].some((frontier) => frontier[0] === 2)).toBe(false)
      expect(sequence[1].every((entry) => (entry[0][5] | 0) > 0)).toBe(true)
      expect(new Projection<string>(3, sequence).values()).toEqual(['a', 'c'])
      expect(projection.values()).toEqual(['a', 'c'])
    })
  })
  describe('sequence', () => {
    it('exports an empty Sequence', () => {
      expect(new Projection<string>(1).sequence()).toEqual([[], []])
    })
    it('exports reconstructible state without changing the live projection', () => {
      const projection = seeded()
      projection.remove(1, 1)
      const sequence = projection.sequence()
      expect(sequence[1].every((entry) => (entry[0][5] | 0) > 0)).toBe(true)
      expect(new Projection<string>(2, sequence).values()).toEqual(['a', 'c'])
      expect(projection.values()).toEqual(['a', 'c'])
      projection.insert(['X'], 1)
      expect(projection.values()).toEqual(['a', 'X', 'c'])
    })
    it('retains a removal Session until active actors acknowledge the same complete frontier', () => {
      const author = seeded()
      const receiver = new Projection<string>(2, seed())
      author.apply([[receiver.actorID]])
      const first = author.remove(0, 0)
      const receipt = receiver.apply(first)!
      author.apply(receipt[1])
      const second = author.remove(0, 0)
      const retained = author.sequence()
      expect(retained[1].filter((entry) => (entry[0][5] | 0) < 0)).toHaveLength(
        2
      )
      expect(new Projection<string>(3, retained).values()).toEqual(['c'])
      author.apply(receiver.apply(second)![1])
      expect(author.sequence()[1].every((entry) => (entry[0][5] | 0) > 0)).toBe(
        true
      )
      expect(author.values()).toEqual(['c'])
    })
  })
  describe('value', () => {
    it.each([0, 1, 2])('reads visible position %i', (at) => {
      expect(seeded().value(at)).toBe(['a', 'b', 'c'][at])
    })
    it('preserves undefined as a valid inserted value', () => {
      const projection = new Projection<string | undefined>(1)
      projection.insert(['a', undefined, 'c'], 0)
      expect(projection.value(1)).toBeUndefined()
      expect(projection.length()).toBe(3)
    })
  })
  describe('values', () => {
    it('returns all values by default and an inclusive range when supplied', () => {
      const projection = seeded()
      expect(projection.values()).toEqual(['a', 'b', 'c'])
      expect(projection.values(1)).toEqual(['b', 'c'])
      expect(projection.values(0, 1)).toEqual(['a', 'b'])
      expect(projection.values(1, 1)).toEqual(['b'])
    })
    it('returns an empty array for an empty projection or inverted range', () => {
      expect(new Projection<string>(1).values()).toEqual([])
      expect(seeded().values(2, 1)).toEqual([])
    })
    it('returns a new array without cloning its values', () => {
      const projection = new Projection<object>(1)
      const value = { text: 'a' }
      const footage = [value]
      projection.insert(footage, 0)
      const values = projection.values()
      expect(values).not.toBe(footage)
      expect(values).not.toBe(projection.values())
      expect(values[0]).toBe(value)
      values.length = 0
      expect(projection.values()).toEqual([value])
    })
  })
})
