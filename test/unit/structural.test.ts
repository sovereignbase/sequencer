/**
 * Structural ordering and Mask-coordinate coverage through public Reels.
 */
import { assert, describe, expect, it } from 'vitest'
import {
  __create,
  __delete,
  __length,
  __merge,
  __read,
  __recover,
  __snapshot,
  __update,
} from '../../src/typescript/index.js'
import type {
  Replica,
  SequencePoint,
  Strip,
} from '../../src/typescript/index.js'

// Observe the complete visible Projection through stable public reads.
function projection_values<T>(state: Replica<T>): Array<T | undefined> {
  return Array.from({ length: __length(state) }, (_, frame_index) =>
    __read(state, frame_index)
  )
}

// Mirror the native deterministic Sequence Point comparator for expectations.
function compare_points(left: SequencePoint, right: SequencePoint): number {
  return (
    left[0] - right[0] ||
    left[1] - right[1] ||
    left[2] - right[2]
  )
}

// Extract the only visible Strip issued by one single-Strip update.
function issued_strip<T>(
  update_result: ReturnType<typeof __update<T>>
): Strip<T> {
  assert(update_result !== false)
  const strip = update_result.reel.find(([is_masked]) => is_masked === 0)
  assert(strip !== undefined)
  return strip
}

// Deterministic concurrent placement.
describe('structural insertion order', () => {
  it('orders concurrent Root successors descending in both delivery orders', () => {
    const left_strip = issued_strip(
      __update(__create<string>(), 0, ['left'], 'before')
    )
    const right_strip = issued_strip(
      __update(__create<string>(), 0, ['right'], 'before')
    )
    const expected = [left_strip, right_strip]
      .sort((left, right) => compare_points(right[2][1], left[2][1]))
      .map((strip) => strip[3]?.[0])

    const forward = __create<string>()
    void __merge(forward, [left_strip])
    void __merge(forward, [right_strip])

    const reverse = __create<string>()
    void __merge(reverse, [right_strip])
    void __merge(reverse, [left_strip])

    expect(projection_values(forward)).toEqual(expected)
    expect(projection_values(reverse)).toEqual(expected)
  })

  it('orders concurrent non-Root successors ascending in both delivery orders', () => {
    const base = __create<string>()
    const base_result = __update(base, 0, ['base'], 'after')
    assert(base_result !== false)
    const snapshot = __snapshot(base)

    const left = __create<string>(snapshot)
    const left_strip = issued_strip(__update(left, 0, ['left'], 'after'))
    const right = __create<string>(snapshot)
    const right_strip = issued_strip(__update(right, 0, ['right'], 'after'))
    const expected_successors = [left_strip, right_strip]
      .sort((left_strip_value, right_strip_value) =>
        compare_points(left_strip_value[2][1], right_strip_value[2][1])
      )
      .map((strip) => strip[3]?.[0])
    const expected = ['base', ...expected_successors]

    const forward = __create<string>(snapshot)
    void __merge(forward, [left_strip])
    void __merge(forward, [right_strip])

    const reverse = __create<string>(snapshot)
    void __merge(reverse, [right_strip])
    void __merge(reverse, [left_strip])

    expect(projection_values(forward)).toEqual(expected)
    expect(projection_values(reverse)).toEqual(expected)
  })
})

// Masks remain bounded by their containing materialized Strips.
describe('structural Mask coordinates', () => {
  it('creates one contained Mask for each crossed Strip', () => {
    const state = __create<string>()
    const first_strip = issued_strip(__update(state, 0, ['a', 'b'], 'after'))
    const second_strip = issued_strip(__update(state, 1, ['c', 'd'], 'after'))
    const deletion_result = __delete(state, 1, 3)
    assert(deletion_result !== false)

    expect(deletion_result.reel).toHaveLength(2)
    expect(deletion_result.reel[0][2]).toEqual([
      first_strip[2][1],
      [first_strip[2][1][0], first_strip[2][1][1] + 1, first_strip[2][1][2]],
    ])
    expect(deletion_result.reel[1][2]).toEqual([
      second_strip[2][1],
      second_strip[2][1],
    ])
    expect(projection_values(state)).toEqual(['a', 'd'])
    expect(__recover(state)).toEqual(['a', 'b', 'c', 'd'])
  })
})
