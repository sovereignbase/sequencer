/**
 * Visible replacement operations composed from deletion and insertion.
 *
 * @module
 */

import { remove } from '../remove/index.js'
import { insert } from '../insert/index.js'
import type { Mutation, Replica } from '../../types/type.js'

/**
 * Replaces visible Frames starting at one Projection index.
 *
 * Removes the visible span covered by `values.length` and inserts `values` at
 * the original index. The transferable Deltas from both operations are
 * combined lane by lane into one `[projection, footage]` tuple.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica to modify.
 * @param index Zero-based visible index at which replacement begins.
 * @param values Contiguous values replacing the existing visible Frames.
 * @returns The combined transferable Delta, or `false` for empty
 * values or when the deletion cannot be performed. If insertion is rejected
 * after deletion, returns the deletion Delta.
 * @remarks Replacement is intentionally a composition of the public Mask and
 * insertion paths; it introduces no separate native operation.
 */
export function replace<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>
): Array<Mutation<T>> | false {
  const removed = remove(state, index, index + values.length)

  if (!removed) return false

  const removedMutations =
    typeof (removed as Mutation<T>)[0][0] === 'number'
      ? [removed as Mutation<T>]
      : (removed as Array<Mutation<T>>)
  const inserted = insert(state, index, values)
  if (!inserted) return removedMutations

  return [...removedMutations, inserted]
}
