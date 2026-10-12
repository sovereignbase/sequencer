/** Historical mask boundaries must retain offline children, even after overlap or later safe compaction. */
import { makeSequence, sequenceInsertions } from '../../../.shared/sequence.ts'
import { expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Insertion, Sequence } from '../../../../src/typescript/class.ts'
it('retains an offline insertion inside repeated tail replacement history', () => {
  const receiver = new Projection<number>(
    2,
    makeSequence(
      [],
      [
        [
          [0, 0, 0, 100, 0, 2],
          [0, 1],
        ],
      ]
    )
  )
  // Keep the other Actor active so its offline dependency cannot disappear through export compaction.
  receiver.apply([[1]])
  const author = new Projection<number>(
    1,
    makeSequence(
      [],
      [
        [
          [0, 0, 0, 100, 0, 2],
          [0, 1],
        ],
      ]
    )
  )
  for (let index = 0; index < 128; ++index)
    author.apply(receiver.replace([index + 2], 1, 1))
  const insertion = author.insert([999], 1)
  for (let index = 0; index < 128; ++index)
    author.apply(receiver.replace([index + 130], 1, 1))
  receiver.apply(insertion)
  expect(receiver.values()).toEqual(author.values())
  expect(receiver.values()).toEqual([0, 999, 257])
})
it('retains an offline insertion inside a coalesced deleted prefix', () => {
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
    return makeSequence([], insertions)
  }
  const author = new Projection<number>(1, seed())
  const receiver = new Projection<number>(2, seed())
  const removal = receiver.remove(0, 62)
  receiver.apply(author.insert([999], 32))
  author.apply(removal)
  expect(receiver.values()).toEqual([999, 63])
  expect(author.values()).toEqual(receiver.values())
})
it.each([false, true])(
  'retains a child at the zero anchor of an overlapped mask (reverse: %s)',
  (reverse) => {
    const projection = new Projection<string>(
      1,
      makeSequence(
        [],
        [
          [
            [0, 0, 0, 100, 0, 4],
            ['a', 'b', 'c', 'd'],
          ],
        ]
      )
    )
    // The child names the fully overlapped mask itself, whose zero-effect identity must remain addressable.
    const updates = [
      [[100, 0, 1, 200, 0, 4294967293]],
      [[100, 0, 1, 300, 0, 4294967293]],
      [[300, 0, 0, 400, 0, 1], ['X']],
    ]
    projection.apply(reverse ? updates.reverse() : updates)
    expect(projection.values()).toEqual(['a', 'X'])
    expect(new Projection<string>(2, projection.sequence()).values()).toEqual([
      'a',
      'X',
    ])
  }
)
it('keeps a gate in another root subtree across a fragmented remote removal', () => {
  const seed = (): Sequence<string> =>
    makeSequence(
      [],
      [
        [[0, 0, 0, 300, 0, 1], ['B']],
        [
          [0, 0, 0, 100, 0, 2],
          ['a', 'b'],
        ],
      ]
    )
  const author = new Projection<string>(1, seed())
  const receiver = new Projection<string>(2, seed())
  receiver.apply([[[100, 0, 1, 200, 0, 1], ['X']]])
  expect(receiver.value(0)).toBe('B')
  receiver.apply(author.remove(1, 2))
  expect(receiver.values()).toEqual(['B', 'X'])
})
it('omits a retained mask whose entire range is represented by compacted removal', () => {
  const projection = new Projection<string>(
    1,
    makeSequence(
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
      ]
    )
  )
  expect(projection.values()).toEqual([])
  const snapshot = projection.sequence()
  expect(sequenceInsertions(snapshot)).toEqual([])
  expect(new Projection<string>(3, snapshot).values()).toEqual([])
})
it('compacts separate removals that together consume an entire original Footage', () => {
  const projection = new Projection<string>(1)
  projection.insert(['a', 'b', 'c'], 0)
  for (let index = 0; index < 3; ++index) projection.remove(0, 0)
  expect(sequenceInsertions(projection.sequence())).toEqual([])
  expect(projection.values()).toEqual([])
})
