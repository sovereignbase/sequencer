/**
 * Visible replacement operations composed from deletion and insertion.
 *
 * @module
 */

import { remove } from '../remove/index.js'
import { insert } from '../insert/index.js'
import type { Delta, Replica } from '../../types/type.js'

/**
 * Replaces visible Frames starting at one Projection index.
 *
 * Removes the visible span covered by `values.length` and inserts `values` at
 * the original index. The transferable Deltas from both operations are
 * combined lane by lane into one `[projection, footage]` tuple.
 *
 * `hard` controls whether the replaced Footage is released while deleting the
 * existing Frames.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica to modify.
 * @param index Zero-based visible index at which replacement begins.
 * @param values Contiguous values replacing the existing visible Frames.
 * @param hard Whether replaced Footage should be released.
 * @returns The combined transferable Delta, or `false` for empty or invalid
 * values or when the deletion cannot be performed. If insertion is rejected
 * after deletion, returns the deletion Delta.
 * @remarks Replacement is intentionally a composition of the public Mask and
 * insertion paths; it introduces no separate native operation.
 */
export function replace<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>,
  hard = false
): Delta<T> | false {
  if (!Array.isArray(values) || values.length === 0) return false

  const replacement = values === state[1] ? values.slice() : values
  const delta = remove(state, index, index + values.length, hard)

  if (!delta) return false

  const additional_delta = insert(state, index, replacement)
  if (!additional_delta) return delta

  return [delta[0].concat(additional_delta[0]), additional_delta[1]]
}
