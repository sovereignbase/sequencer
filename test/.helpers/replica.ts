/** Shared current-API fixtures for deterministic Replica tests. */
import { assert, expect } from 'vitest'
import {
  create,
  insert,
  length,
  snapshot,
  values,
} from '../../src/typescript/index.js'
import type {
  Delta,
  Replica,
  Result,
  Strip,
} from '../../src/typescript/index.js'

/** Three unsigned lanes forming one Sequence Point. */
export type SequencePoint = [
  crypto_random_bits: number,
  unix_lower_bits: number,
  counter_bits: number,
]

/** Creates a Replica containing one visible seed Strip. */
export function create_seed<T>(seed_values: Array<T>): Replica<T> {
  const state = create<T>()
  if (seed_values.length === 0) return state

  const result = insert(state, 0, seed_values)
  assert(result !== false)
  return state
}

/** Reads the complete visible Projection through the batched public API. */
export function projection_values<T>(state: Replica<T>): Array<T | undefined> {
  return values(state)
}

/** Extracts the visible Strip issued by one accepted local operation. */
export function visible_strip<T>(result: Result<T>): Strip<T> {
  assert(result !== false)
  const strip = result.delta.find(([meta]) => meta[0] === 0)
  assert(strip !== undefined)
  return strip
}

/** Reads one Strip's `this_strip_start` from its transferable metadata. */
export function strip_start<T>(strip: Strip<T>): SequencePoint {
  return [strip[0][3], strip[0][4], strip[0][5]]
}

/** Compares Sequence Points in the same lane order as the native comparator. */
export function compare_points(
  left: SequencePoint,
  right: SequencePoint
): number {
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2]
}

/** Produces a deterministic hostile staging order for one supplied seed. */
export function shuffle_strips<T>(
  strips: Array<Strip<T>>,
  seed: number
): Array<Strip<T>> {
  const shuffled = [...strips]
  let state = seed >>> 0

  for (let index = shuffled.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    const selected_index = state % (index + 1)
    ;[shuffled[index], shuffled[selected_index]] = [
      shuffled[selected_index],
      shuffled[index],
    ]
  }

  return shuffled
}

/** Stages Strips through create and optionally snapshot-restarts mid-batch. */
export function deliver<T>(
  base: Delta<T>,
  strips: Array<Strip<T>>,
  restart_index?: number
): Replica<T> {
  if (restart_index === undefined) return create<T>([...base, ...strips])

  const first = create<T>([...base, ...strips.slice(0, restart_index)])
  return create<T>([...snapshot(first), ...strips.slice(restart_index)])
}

/** Requires equal visible Projection length and values. */
export function expect_converged<T>(
  expected: Replica<T>,
  actual: Replica<T>
): void {
  expect(projection_values(actual)).toEqual(projection_values(expected))
  expect(length(actual)).toBe(length(expected))
}
