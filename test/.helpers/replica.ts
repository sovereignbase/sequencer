/** Shared current-API fixtures for deterministic Replica tests. */
import { assert, expect } from 'vitest'
import {
  __create,
  __merge,
  __snapshot,
  __update,
} from '../../src/typescript/index.js'
import type {
  Reel,
  Replica,
  SequencePoint,
  Strip,
} from '../../src/typescript/index.js'

/** Creates a Replica containing one visible seed Strip. */
export function create_seed<T>(values: Array<T>): Replica<T> {
  const state = __create<T>()
  if (values.length === 0) return state

  const result = __update(state, 0, values, 'after')
  assert(result !== false)
  return state
}

/** Reads visible values structurally, independently of the point-read API. */
export function projection_values<T>(state: Replica<T>): Array<T> {
  return __snapshot(state).flatMap(([is_masked, , , footage]) =>
    is_masked === 0 ? (footage ?? []) : []
  )
}

/** Extracts the visible Strip issued by one accepted update. */
export function visible_strip<T>(
  result: ReturnType<typeof __update<T>>
): Strip<T> {
  assert(result !== false)
  const strip = result.reel.find(([is_masked]) => is_masked === 0)
  assert(strip !== undefined)
  return strip
}

/** Compares Sequence Points in the same lane order as the native comparator. */
export function compare_points(
  left: SequencePoint,
  right: SequencePoint
): number {
  return left[0] - right[0] || left[1] - right[1] || left[2] - right[2]
}

/** Produces a deterministic hostile delivery order for one supplied seed. */
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

/** Integrates individual Strips and optionally snapshot-restarts mid-delivery. */
export function deliver<T>(
  base: Reel<T>,
  strips: Array<Strip<T>>,
  restart_index?: number
): Replica<T> {
  let state = __create<T>(base)

  for (let index = 0; index < strips.length; index++) {
    void __merge(state, [strips[index]])
    if (index + 1 === restart_index) state = __create<T>(__snapshot(state))
  }

  return state
}

/** Requires equal Projection and retained structural Reel. */
export function expect_converged<T>(
  expected: Replica<T>,
  actual: Replica<T>
): void {
  expect(projection_values(actual)).toEqual(projection_values(expected))
  expect(__snapshot(actual)).toEqual(__snapshot(expected))
}
