/**
 * Visible replacement operations composed from deletion and insertion.
 *
 * @module
 */

import { remove } from '../../delete/index.js'
import { insert } from '../insert/index.js'
import type { Replica, Result } from '../../../types/type.js'

/**
 * Replaces visible Frames starting at one Projection index.
 *
 * Removes the visible span covered by `values.length` and inserts `values` at
 * the original index. The resulting local Changes and transferable Deltas from
 * both operations are combined into one Result.
 *
 * `hard` controls whether the replaced Footage is released while deleting the
 * existing Frames.
 *
 * @param state Replica to modify.
 * @param index Zero-based visible index at which replacement begins.
 * @param values Contiguous values replacing the existing visible Frames.
 * @param hard Whether replaced Footage should be released.
 * @returns The combined local Change and transferable Delta, or `false` when
 * the deletion cannot be performed.
 */
export function replace<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>,
  hard = false
): Result<T> {
  const result = remove(state, index, index + values.length, hard)

  if (!result) return false

  const additional_result = insert(state, index, values)

  if (!additional_result) return result

  for (const key of Object.keys(additional_result.change))
    result.change[+key] = additional_result.change[+key]

  void result.delta.push(...additional_result.delta)

  // Return the combined deletion and insertion result.
  return result
}
