/**
 * Visible replacement operations composed from deletion and insertion.
 *
 * @module
 */

import { remove } from '../../delete/index.js'
import { insert } from '../insert/index.js'
import type { Delta, Replica } from '../../../types/type.js'

/**
 * Replaces visible Frames starting at one Projection index.
 *
 * Removes the visible span covered by `values.length` and inserts `values` at
 * the original index. The transferable Deltas from both operations are
 * combined.
 *
 * `hard` controls whether the replaced Footage is released while deleting the
 * existing Frames.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica to modify.
 * @param index Zero-based visible index at which replacement begins.
 * @param values Contiguous values replacing the existing visible Frames.
 * @param hard Whether replaced Footage should be released.
 * @returns The combined transferable Delta, or `false` when the deletion
 * cannot be performed.
 * @remarks Replacement is intentionally a composition of the public Mask and
 * insertion paths; it introduces no separate native operation.
 */
export function replace<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>,
  hard = false
): Delta<T> | false {
  const delta = remove(state, index, index + values.length, hard)

  if (!delta) return false

  const additional_delta = insert(state, index, values)

  if (!additional_delta) return delta

  void delta.push(...additional_delta)
  return delta
}
