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
async function expectGossip(
  gossip: Gossip<string>,
  expected: string[]
): Promise<void> {
  const receiver = new Projection<string>(2, seed())
  expect(await receiver.apply(gossip)).toBeDefined()
  expect(await receiver.values()).toEqual(expected)
}
describe('Projection public API', () => {
  describe('constructor', () => {
    it('creates an empty projection for the supplied actor', async () => {
      const projection = new Projection<string>(7)
      expect(projection.actorID).toBe(7)
      expect(await projection.length()).toBe(0)
      expect(await projection.values()).toEqual([])
    })
    it('hydrates a trusted Sequence', async () => {
      const projection = new Projection<string>(7, seed())
      expect(projection.actorID).toBe(7)
      expect(await projection.length()).toBe(3)
      expect(await projection.values()).toEqual(['a', 'b', 'c'])
    })
  })
  describe('apply', () => {
    it('returns insertion splices using visible positions', async () => {
      const projection = new Projection<string>(2)
      expect(await projection.apply(seed()[1])).toEqual([
        [[0, 0, ['a', 'b', 'c']]],
      ])
      expect(await projection.values()).toEqual(['a', 'b', 'c'])
    })
    it('returns removal splices with an exclusive end and receipt Gossip', async () => {
      const projection = seeded()
      expect(
        await projection.apply([[[100, 0, 1, 200, 0, 4294967295]]])
      ).toEqual([[[1, 2]], [[1, 200, 1]]])
      expect(await projection.values()).toEqual(['a', 'c'])
    })
    it('preserves the Frame count in returned splices when Footage is omitted', async () => {
      const projection = new Projection<string>(1)
      const result = await projection.apply([[[0, 0, 0, 100, 0, 2]]])
      expect(result?.[0]).toEqual([[0, 0, new Array(2)]])
      expect(await projection.length()).toBe(2)
      expect(await projection.value(0)).toBeUndefined()
    })
    it('accepts empty batches, acknowledgements, and duplicate Insertions without visible changes', async () => {
      const projection = seeded()
      for (const gossip of [[], [[2]], seed()[1]])
        expect(await projection.apply(gossip)).toEqual([[]])
      expect(await projection.values()).toEqual(['a', 'b', 'c'])
    })
    it('defers an Insertion until its parent arrives', async () => {
      const projection = new Projection<string>(1)
      expect(await projection.apply([[[100, 0, 1, 200, 0, 1], ['X']]])).toEqual(
        [[]]
      )
      expect(await projection.values()).toEqual([])
      expect(await projection.apply(seed()[1])).toEqual([
        [
          [0, 0, ['a', 'b', 'c']],
          [1, 1, ['X']],
        ],
      ])
      expect(await projection.values()).toEqual(['a', 'X', 'b', 'c'])
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
    )('returns undefined for malformed input $input', async ({ input }) => {
      const projection = seeded()
      expect(await projection.apply(input)).toBeUndefined()
      expect(await projection.values()).toEqual(['a', 'b', 'c'])
    })
    it('retains earlier valid entries when a later entry is invalid', async () => {
      const projection = new Projection<string>(1)
      expect(await projection.apply([...seed()[1], null])).toBeUndefined()
      expect(await projection.values()).toEqual(['a', 'b', 'c'])
    })
  })
  describe('insert', () => {
    it.each([
      [0, ['X', 'a', 'b', 'c']],
      [1, ['a', 'X', 'b', 'c']],
      [3, ['a', 'b', 'c', 'X']],
    ])(
      'inserts at boundary %i and returns replicable Gossip',
      async (at, expected) => {
        const projection = seeded()
        const gossip = await projection.insert(['X'], at)
        expect(await projection.values()).toEqual(expected)
        await expectGossip(gossip, expected)
      }
    )
    it('inserts into an empty projection and preserves returned value references', async () => {
      const projection = new Projection<object>(1)
      const value = { text: 'a' }
      const footage = [value]
      const gossip = await projection.insert(footage, 0)
      expect(gossip).toHaveLength(1)
      expect(gossip[0][1]).toBe(footage)
      expect(await projection.value(0)).toBe(value)
      expect(await projection.length()).toBe(1)
    })
  })
  describe('length', () => {
    it('reports the visible size after insertion, removal, and replacement', async () => {
      const projection = seeded()
      expect(await projection.length()).toBe(3)
      await projection.insert(['d', 'e'], 3)
      expect(await projection.length()).toBe(5)
      await projection.remove(3, 4)
      expect(await projection.length()).toBe(3)
      await projection.replace(['X', 'Y'], 1, 1)
      expect(await projection.length()).toBe(4)
    })
  })
  describe('merge', () => {
    it('accepts acknowledgement frontiers in an exported Sequence', async () => {
      const source = seeded()
      await source.remove(1, 1)
      const snapshot = await source.sequence()
      expect(snapshot[0].length).toBeGreaterThan(0)
      const receiver = new Projection<string>(2)
      expect(await receiver.merge(snapshot)).toBeDefined()
      expect(await receiver.values()).toEqual(['a', 'c'])
    })
    it('merges a Sequence and returns its visible changes', async () => {
      const projection = new Projection<string>(2)
      expect(await projection.merge(seed())).toEqual([
        [[0, 0, ['a', 'b', 'c']]],
      ])
      expect(await projection.values()).toEqual(['a', 'b', 'c'])
      expect(await projection.merge(seed())).toEqual([[]])
      expect(await projection.values()).toEqual(['a', 'b', 'c'])
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
      async ({ input }) => {
        const projection = new Projection<string>(1)
        expect(await projection.merge(input)).toBeUndefined()
        expect(await projection.values()).toEqual([])
      }
    )
  })
  describe('remove', () => {
    it('removes an inclusive range and returns replicable Gossip', async () => {
      const projection = seeded()
      const gossip = await projection.remove(0, 1)
      expect(await projection.values()).toEqual(['c'])
      await expectGossip(gossip, ['c'])
    })
    it('defaults the end to the last visible position', async () => {
      const projection = seeded()
      const gossip = await projection.remove(1)
      expect(await projection.values()).toEqual(['a'])
      await expectGossip(gossip, ['a'])
    })
    it('defaults to removing the entire projection, including an empty one', async () => {
      const projection = seeded()
      const gossip = await projection.remove()
      expect(await projection.values()).toEqual([])
      await expectGossip(gossip, [])
      expect(await projection.remove()).toEqual(expect.any(Array))
      expect(await projection.length()).toBe(0)
    })
  })
  describe('replace', () => {
    it('replaces an inclusive range and returns removal/insertion Gossip', async () => {
      const projection = seeded()
      const gossip = await projection.replace(['X', 'Y'], 1, 1)
      expect(await projection.values()).toEqual(['a', 'X', 'Y', 'c'])
      await expectGossip(gossip, ['a', 'X', 'Y', 'c'])
    })
    it('uses an empty replacement as removal only', async () => {
      const projection = seeded()
      const gossip = await projection.replace([], 1, 1)
      expect(await projection.values()).toEqual(['a', 'c'])
      await expectGossip(gossip, ['a', 'c'])
    })
    it('defaults to replacing the whole projection', async () => {
      const projection = seeded()
      const gossip = await projection.replace(['X'])
      expect(await projection.values()).toEqual(['X'])
      await expectGossip(gossip, ['X'])
    })
    it('can initialize an empty projection', async () => {
      const projection = new Projection<string>(1)
      expect(await projection.replace(['X'])).toEqual(expect.any(Array))
      expect(await projection.values()).toEqual(['X'])
    })
  })
  describe('retire', () => {
    it('excludes a retired actor from compaction requirements and future acknowledgements', async () => {
      const projection = seeded()
      await projection.apply([[2]])
      await projection.remove(1, 1)
      expect(
        (await projection.sequence())[1].some((entry) => (entry[0][5] | 0) < 0)
      ).toBe(true)
      expect(await projection.retire(2)).toBeUndefined()
      await projection.apply([[2]])
      const sequence = await projection.sequence()
      expect(sequence[0].some((frontier) => frontier[0] === 2)).toBe(false)
      expect(sequence[1].every((entry) => (entry[0][5] | 0) > 0)).toBe(true)
      expect(await new Projection<string>(3, sequence).values()).toEqual([
        'a',
        'c',
      ])
      expect(await projection.values()).toEqual(['a', 'c'])
    })
  })
  describe('sequence', () => {
    it('exports an empty Sequence', async () => {
      expect(await new Projection<string>(1).sequence()).toEqual([[], []])
    })
    it('exports reconstructible state without changing the live projection', async () => {
      const projection = seeded()
      await projection.remove(1, 1)
      const sequence = await projection.sequence()
      expect(sequence[1].every((entry) => (entry[0][5] | 0) > 0)).toBe(true)
      expect(await new Projection<string>(2, sequence).values()).toEqual([
        'a',
        'c',
      ])
      expect(await projection.values()).toEqual(['a', 'c'])
      await projection.insert(['X'], 1)
      expect(await projection.values()).toEqual(['a', 'X', 'c'])
    })
    it('retains a removal Session until active actors acknowledge the same complete frontier', async () => {
      const author = seeded()
      const receiver = new Projection<string>(2, seed())
      await author.apply([[receiver.actorID]])
      const first = await author.remove(0, 0)
      const receipt = (await receiver.apply(first))!
      await author.apply(receipt[1])
      const second = await author.remove(0, 0)
      const retained = await author.sequence()
      expect(retained[1].filter((entry) => (entry[0][5] | 0) < 0)).toHaveLength(
        2
      )
      expect(await new Projection<string>(3, retained).values()).toEqual(['c'])
      await author.apply((await receiver.apply(second))![1])
      expect(
        (await author.sequence())[1].every((entry) => (entry[0][5] | 0) > 0)
      ).toBe(true)
      expect(await author.values()).toEqual(['c'])
    })
  })
  describe('value', () => {
    it.each([0, 1, 2])('reads visible position %i', async (at) => {
      expect(await seeded().value(at)).toBe(['a', 'b', 'c'][at])
    })
    it('preserves undefined as a valid inserted value', async () => {
      const projection = new Projection<string | undefined>(1)
      await projection.insert(['a', undefined, 'c'], 0)
      expect(await projection.value(1)).toBeUndefined()
      expect(await projection.length()).toBe(3)
    })
  })
  describe('values', () => {
    it('returns all values by default and an inclusive range when supplied', async () => {
      const projection = seeded()
      expect(await projection.values()).toEqual(['a', 'b', 'c'])
      expect(await projection.values(1)).toEqual(['b', 'c'])
      expect(await projection.values(0, 1)).toEqual(['a', 'b'])
      expect(await projection.values(1, 1)).toEqual(['b'])
    })
    it('returns an empty array for an empty projection or inverted range', async () => {
      expect(await new Projection<string>(1).values()).toEqual([])
      expect(await seeded().values(2, 1)).toEqual([])
    })
    it('returns a new array without cloning its values', async () => {
      const projection = new Projection<object>(1)
      const value = { text: 'a' }
      const footage = [value]
      await projection.insert(footage, 0)
      const values = await projection.values()
      expect(values).not.toBe(footage)
      expect(values).not.toBe(await projection.values())
      expect(values[0]).toBe(value)
      values.length = 0
      expect(await projection.values()).toEqual([value])
    })
  })
})
