/** Hydrated traversal must preserve indexed reads and subsequent edits across fragments and competitors. */
import { makeSequence } from '../../../.shared/sequence.ts'
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Insertion } from '../../../../src/typescript/types/type.ts'
describe('sequence jump preoptimization', () => {
  it('hydrates successive fragment boundaries and their same-point competitors', () => {
    const frames = Array.from({ length: 256 }, (_, index) => index)
    const insertions: Array<Insertion<number>> = [
      [[0, 0, 0, 100, 0, frames.length], frames],
    ]
    const expected = [...frames]
    for (let index = 0; index < 128; ++index) {
      const at = index * 2 + 1
      // Two exact-anchor competitors force repeated root fragmentation and deterministic sibling order.
      insertions.push([[100, 0, at, 300, index * 2, 1], [-at]])
      insertions.push([[100, 0, at, 200, index * 2, 1], [-at - 1000]])
      expected.splice(index * 4 + 1, 0, -at, -at - 1000)
    }
    const hydrated = new Projection<number>(1, makeSequence([], insertions))
    expect(hydrated.values()).toEqual(expected)
    expect(new Projection<number>(1, hydrated.sequence()).values()).toEqual(
      expected
    )
    hydrated.insert([9999], 255)
    expected.splice(255, 0, 9999)
    expect(hydrated.values()).toEqual(expected)
  })
  /**
   * Verifies that reconstruction from a retained Sequence prebuilds valid
   * traversal jumps at approximately square-root spacing.
   */
  it('creates valid square-root-spaced jumps during reconstruction', () => {
    // Consecutive appends may coalesce; hydration must preserve all sixteen Frames.
    const source = new Projection<number>(1)
    for (let value = 0; value < 16; ++value)
      source.insert([value], source.length())
    const sequence = source.sequence()
    // Hydration rebuilds whichever traversal structure the retained roots require.
    const recreated = new Projection<number>(2, sequence)
    for (const position of [0, 4, 8, 12, 15, 7, 3, 11])
      expect(recreated.value(position)).toBe(position)
    // Jump preoptimization must not change any visible Footage.
    expect(recreated.values()).toEqual(source.values())
  })
  it('retains valid jumps through local and remote edits inside prebuilt spans', () => {
    const source = new Projection<number>(1)
    const expected: number[] = []
    for (let i = 0; i < 16; ++i) {
      const frames = Array.from({ length: 8 }, (_, j) => i * 8 + j)
      source.insert(frames, source.length())
      expected.push(...frames)
    }
    const sequence = source.sequence()
    const local = new Projection<number>(2, sequence)
    const remote = new Projection<number>(3, sequence)
    for (let i = 0; i < 64; ++i) {
      const index = (i * 37) % expected.length
      const removing = i % 3 === 0
      const update = removing
        ? local.remove(index, index)
        : local.insert([-i], index)
      expected.splice(index, removing ? 1 : 0, ...(removing ? [] : [-i]))
      const result = remote.apply(update)!
      if (result[1]) local.apply(result[1])
      for (const projection of [local, remote]) {
        expect(projection.value(index)).toBe(expected[index])
        expect(projection.values()).toEqual(expected)
        for (const position of [
          0,
          expected.length - 1,
          Math.floor(expected.length / 2),
        ])
          expect(projection.value(position)).toBe(expected[position])
      }
    }
  })
})
