import { expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Insertion, Sequence } from '../../../../src/typescript/class.ts'
it('retains an offline insertion inside repeated tail replacement history', async () => {
  const receiver = new Projection<number>(2, [
    [],
    [
      [
        [0, 0, 0, 100, 0, 2],
        [0, 1],
      ],
    ],
  ])
  await receiver.apply([[1]])
  const author = new Projection<number>(1, [
    [],
    [
      [
        [0, 0, 0, 100, 0, 2],
        [0, 1],
      ],
    ],
  ])
  for (let index = 0; index < 128; ++index)
    await author.apply(await receiver.replace([index + 2], 1, 1))
  const insertion = await author.insert([999], 1)
  for (let index = 0; index < 128; ++index)
    await author.apply(await receiver.replace([index + 130], 1, 1))
  await receiver.apply(insertion)
  expect(await receiver.values()).toEqual(await author.values())
  expect(await receiver.values()).toEqual([0, 999, 257])
})
it('retains an offline insertion inside a coalesced deleted prefix', async () => {
  const seed = (): Sequence<number> => {
    const insertions: Array<Insertion<number>> = []
    for (let index = 0; index < 64; ++index)
      insertions.push([
        [
          index === 0 ? 0 : 100,
          index === 0 ? 0 : (index - 1) * 2,
          index === 0 ? 0 : 1,
          100,
          index * 2,
          1,
        ],
        [index],
      ])
    return [[], insertions]
  }
  const author = new Projection<number>(1, seed())
  const receiver = new Projection<number>(2, seed())
  const removal = await receiver.remove(0, 62)
  await receiver.apply(await author.insert([999], 32))
  await author.apply(removal)
  expect(await receiver.values()).toEqual([999, 63])
  expect(await author.values()).toEqual(await receiver.values())
})
it.each([false, true])(
  'retains a child at the zero anchor of an overlapped mask (reverse: %s)',
  async (reverse) => {
    const projection = new Projection<string>(1, [
      [],
      [
        [
          [0, 0, 0, 100, 0, 4],
          ['a', 'b', 'c', 'd'],
        ],
      ],
    ])
    const updates = [
      [[100, 0, 1, 200, 0, 4294967293]],
      [[100, 0, 1, 300, 0, 4294967293]],
      [[300, 0, 0, 400, 0, 1], ['X']],
    ]
    await projection.apply(reverse ? updates.reverse() : updates)
    expect(await projection.values()).toEqual(['a', 'X'])
    expect(
      await new Projection<string>(2, await projection.sequence()).values()
    ).toEqual(['a', 'X'])
  }
)
it('keeps a gate in another root subtree across a fragmented remote removal', async () => {
  const seed = (): Sequence<string> => [
    [],
    [
      [[0, 0, 0, 300, 0, 1], ['B']],
      [
        [0, 0, 0, 100, 0, 2],
        ['a', 'b'],
      ],
    ],
  ]
  const author = new Projection<string>(1, seed())
  const receiver = new Projection<string>(2, seed())
  await receiver.apply([[[100, 0, 1, 200, 0, 1], ['X']]])
  expect(await receiver.value(0)).toBe('B')
  await receiver.apply(await author.remove(1, 2))
  expect(await receiver.values()).toEqual(['B', 'X'])
})
it('omits a retained mask whose entire range is represented by compacted removal', async () => {
  const projection = new Projection<string>(1, [
    [
      [1, 200, 3],
      [2, 200, 3],
    ],
    [
      [
        [0, 0, 0, 100, 0, 3],
        ['a', 'b', 'c'],
      ],
      [[100, 0, 0, 200, 0, 4294967293]],
      [[100, 0, 0, 300, 0, 4294967293]],
    ],
  ])
  expect(await projection.values()).toEqual([])
  const snapshot = await projection.sequence()
  expect(snapshot[1]).toEqual([])
  expect(await new Projection<string>(3, snapshot).values()).toEqual([])
})
it('compacts separate removals that together consume an entire original Footage', async () => {
  const projection = new Projection<string>(1)
  await projection.insert(['a', 'b', 'c'], 0)
  for (let index = 0; index < 3; ++index) await projection.remove(0, 0)
  expect((await projection.sequence())[1]).toEqual([])
  expect(await projection.values()).toEqual([])
})
