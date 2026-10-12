import { makeSequence, sequenceInsertions } from '../../../.shared/sequence.ts'
import { expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Insertion } from '../../../../src/typescript/class.ts'
it('retains its visible tail across concurrent removals of the same suffix', () => {
  const insertions: Array<Insertion<number>> = []
  for (let index = 0; index < 18; ++index)
    insertions.push([
      [0, 0, 0, 1000 - index, 0, index === 17 ? 4 : 1],
      index === 17 ? [17, 18, 19, 20] : [index],
    ])
  for (let index = 0; index < 46; ++index)
    insertions.push([[983, 0, 1, 2000 - index, 0, 4294967293]])
  const projection = new Projection<number>(1, makeSequence([[2]], insertions))
  const expected = Array.from({ length: 18 }, (_, index) => index)
  expect(projection.values()).toEqual(expected)
  const hydrated = new Projection<number>(3, projection.sequence())
  expect(hydrated.values()).toEqual(expected)
  expect(hydrated.value(17)).toBe(17)
  projection.apply(hydrated.insert([64], 18))
  expect(projection.values()).toEqual([...expected, 64])
  expect(hydrated.values()).toEqual(projection.values())
})
it('retains visible root boundaries across an unacknowledged hidden suffix', () => {
  const insertions: Array<Insertion<number>> = []
  for (let index = 0; index < 64; ++index) {
    const session = 1000 - index
    insertions.push([[0, 0, 0, session, 0, 1], [index]])
    if (index >= 17)
      insertions.push([[session, 0, 0, 2000, (index - 17) * 2, 0xffffffff]])
  }
  const projection = new Projection<number>(1, makeSequence([[2]], insertions))
  const expected = Array.from({ length: 17 }, (_, index) => index)
  expect(projection.values()).toEqual(expected)
  const hydrated = new Projection<number>(3, projection.sequence())
  expect(hydrated.values()).toEqual(expected)
  expect(hydrated.value(16)).toBe(16)
  projection.apply(hydrated.insert([64], 17))
  expect(projection.values()).toEqual([...expected, 64])
  expect(hydrated.values()).toEqual(projection.values())
})
it.each([17, 28, 31])(
  'retains %i visible Frames while hydrating an unacknowledged hidden suffix',
  (visibleCount) => {
    const source = new Projection<number>(1)
    for (let index = 0; index < 64; ++index)
      source.insert([index], source.length())
    source.apply([[2]])
    source.remove(visibleCount)
    const snapshot = source.sequence()
    expect(
      sequenceInsertions(snapshot).some(
        (entry) => ((entry[0] as ReadonlyArray<number>)[5] | 0) < 0
      )
    ).toBe(true)
    const hydrated = new Projection<number>(3, snapshot)
    expect(hydrated.values()).toEqual(
      Array.from({ length: visibleCount }, (_, index) => index)
    )
    expect(hydrated.value(visibleCount - 1)).toBe(visibleCount - 1)
    const gossip = hydrated.insert([64], hydrated.length())
    source.apply(gossip)
    expect(source.values()).toEqual(hydrated.values())
    expect(hydrated.values()).toEqual([
      ...Array.from({ length: visibleCount }, (_, index) => index),
      64,
    ])
  }
)
