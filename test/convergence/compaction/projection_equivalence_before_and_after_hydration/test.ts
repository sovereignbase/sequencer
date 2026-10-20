/** Acknowledged export compaction must preserve visible content, retained child order and subsequent editing. */
import { makeSequence, sequenceInsertions } from '../../../.shared/sequence.ts'
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'

it.each([false, true])(
  'retains repeated middle replacements before an older mask with compaction %s',
  (compact) => {
    const session = 4294967294
    const state = new Projection<number>(
      1,
      makeSequence(
        [],
        [
          [[0, 0, 0, session, 0, 1], [1]],
          [[session, 0, 1, session, 2, 79], new Array(79).fill(79)],
          [[session, 2, 79, session, 82, 1], [1]],
        ]
      )
    )
    // A membership-only claim from another Actor keeps all masks unacknowledged.
    if (!compact) state.apply([[2]])
    for (let i = 0; i < 8; ++i) state.replace([i], 1, 1)
    const expected = [1, 7, ...new Array(78).fill(79), 1]
    expect(state.length()).toBe(81)
    expect(state.values()).toEqual(expected)
    const restored = new Projection<number>(3, state.sequence())
    expect(restored.values()).toEqual(expected)
    restored.destroy()
    state.destroy()
  }
)
import type { Insertion } from '../../../../src/typescript/types/type.ts'
describe('projection equivalence before and after hydration', () => {
  it.each([false, true])(
    'preserves repeated head replacements and the next edit with compaction %s',
    (compact) => {
      const projection = new Projection<string>(1)
      // Keep masks in the exported history while exercising the same visible edits.
      if (!compact) projection.apply([[2]])
      projection.insert(['a', 'b'], 0)
      projection.replace(['x', 'y'], 0, 0)
      projection.replace(['z'], 0, 1)
      const snapshot = structuredClone(projection.sequence())
      expect(
        sequenceInsertions(snapshot).some(
          (entry) => ((entry[0] as ReadonlyArray<number>)[5] | 0) < 0
        )
      ).toBe(!compact)
      const hydrated = new Projection<string>(1, snapshot)
      hydrated.insert(['head'], 0)
      expect(hydrated.values()).toEqual(['head', 'z', 'b'])
      expect(hydrated.value(1)).toBe('z')
    }
  )
  it.each([false, true])(
    'preserves insertion order with compaction %s',
    (compact) => {
      const base = new Projection<string>(1)
      const root = base.insert(['tail'], 0)
      const original = new Projection<string>(2)
      original.apply(root)
      const branch = original.insert(['old'], 0)
      const local = new Projection<string>(3)
      const remote = new Projection<string>(4)
      for (const projection of [local, remote]) {
        projection.apply(root)
        projection.apply(branch)
      }
      // The active remote has not received the removal, so its mask cannot compact.
      local.apply([[remote.actorID]])
      const removal = local.remove(0, 0)
      const insertion = local.insert(['X'], 0)
      const concurrent = remote.insert(['Y'], 1)
      local.apply(concurrent)
      // The local edit uses the removed region's free endpoint.
      expect((insertion[0] as Insertion<string>)[0].slice(0, 3)).toEqual([
        (removal[0] as Insertion<string>)[0][3],
        (removal[0] as Insertion<string>)[0][4],
        1,
      ])
      const before = local.values()
      expect(before).toEqual(['Y', 'X', 'tail'])
      if (compact) {
        // Both active replicas have now received the complete removal Session.
        const result = remote.apply(removal)!
        local.apply(result[1])
      }
      const snapshot = local.sequence()
      expect(
        sequenceInsertions(snapshot).some(
          (entry) =>
            (entry[0] as ReadonlyArray<number>)[3] ===
              (removal[0] as Insertion<string>)[0][3] &&
            ((entry[0] as ReadonlyArray<number>)[5] | 0) < 0
        )
      ).toBe(!compact)
      if (compact)
        expect(
          sequenceInsertions(snapshot).some(
            (entry) =>
              (entry[0] as ReadonlyArray<number>)[3] ===
              (branch[0] as Insertion<string>)[0][3]
          )
        ).toBe(false)
      expect(local.values()).toEqual(before)
      const hydrated = new Projection<string>(5, snapshot)
      expect(hydrated.values()).toEqual(before)
      expect(new Projection<string>(5, hydrated.sequence()).values()).toEqual(
        before
      )
    }
  )
  it('preserves children at distinct points collapsed by compaction', () => {
    const projection = new Projection<string>(
      1,
      makeSequence(
        [],
        [
          [
            [0, 0, 0, 100, 0, 4],
            ['a', 'b', 'c', 'tail'],
          ],
          [[100, 0, 1, 200, 0, 1], ['A']],
          [[100, 0, 2, 300, 0, 1], ['B']],
        ]
      )
    )
    expect(projection.values()).toEqual(['a', 'A', 'b', 'B', 'c', 'tail'])
    projection.remove(4, 4)
    projection.remove(2, 2)
    projection.remove(0, 0)
    expect(projection.values()).toEqual(['A', 'B', 'tail'])
    // Export may discard eligible history, but the live Projection and retained child ordering stay unchanged.
    const snapshot = projection.sequence()
    expect(
      sequenceInsertions(snapshot).every(
        (entry) => ((entry[0] as ReadonlyArray<number>)[5] | 0) > 0
      )
    ).toBe(true)
    expect(sequenceInsertions(snapshot)[0][1]).toEqual(['tail'])
    const hydrated = new Projection<string>(1, snapshot)
    expect(hydrated.values()).toEqual(['A', 'B', 'tail'])
    hydrated.insert(['X'], 1)
    expect(hydrated.values()).toEqual(['A', 'X', 'B', 'tail'])
    expect(new Projection<string>(1, hydrated.sequence()).values()).toEqual([
      'A',
      'X',
      'B',
      'tail',
    ])
  })
  it('retains children when the only compactable mask is fully overlapped', () => {
    const projection = new Projection<string>(
      1,
      makeSequence(
        [
          [1, 300, 2],
          [2, 300, 2],
        ],
        [
          [
            [0, 0, 0, 100, 0, 2],
            ['a', 'b'],
          ],
          [[100, 0, 0, 200, 0, 4294967294]],
          [[100, 0, 0, 300, 0, 4294967294]],
          [[300, 0, 2, 400, 0, 1], ['X']],
        ]
      )
    )
    expect(projection.values()).toEqual(['X'])
    // Export may discard eligible history, but the live Projection and retained child ordering stay unchanged.
    const snapshot = projection.sequence()
    expect(
      sequenceInsertions(snapshot).some(
        (entry) => (entry[0] as ReadonlyArray<number>)[3] === 300
      )
    ).toBe(false)
    expect(
      sequenceInsertions(snapshot).some(
        (entry) => (entry[0] as ReadonlyArray<number>)[3] === 200
      )
    ).toBe(true)
    expect(new Projection<string>(3, snapshot).values()).toEqual(['X'])
  })
  it('compacts an acknowledged mask while retaining an overlapping unacknowledged mask', () => {
    const projection = new Projection<string>(
      1,
      makeSequence(
        [
          [1, 200, 2],
          [2, 200, 2],
        ],
        [
          [
            [0, 0, 0, 100, 0, 4],
            ['a', 'b', 'c', 'd'],
          ],
          [[100, 0, 0, 200, 0, 4294967294]],
          [[100, 0, 1, 300, 0, 4294967294]],
          [[300, 0, 2, 400, 0, 1], ['X']],
        ]
      )
    )
    expect(projection.values()).toEqual(['X', 'd'])
    // Export may discard eligible history, but the live Projection and retained child ordering stay unchanged.
    const snapshot = projection.sequence()
    expect(
      sequenceInsertions(snapshot).some(
        (entry) => (entry[0] as ReadonlyArray<number>)[3] === 200
      )
    ).toBe(false)
    expect(
      sequenceInsertions(snapshot).find(
        (entry) => (entry[0] as ReadonlyArray<number>)[3] === 300
      )?.[0][5]
    ).toBe(-1 >>> 0)
    expect(sequenceInsertions(snapshot)[0][1]).toEqual([undefined, 'd'])
    const hydrated = new Projection<string>(1, snapshot)
    expect(hydrated.values()).toEqual(['X', 'd'])
    expect(new Projection<string>(1, hydrated.sequence()).values()).toEqual([
      'X',
      'd',
    ])
  })
})
