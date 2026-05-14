import { seekCursorToIndex } from '../../../.helpers/index.js'
import { CRListState } from '../../../.types/index.js'

/**
 * Reads the value at an index in the replica live view.
 *
 * The replica cursor is moved as part of the lookup. Successful reads return
 * the live value reference stored by the replica. Mutating that value directly
 * can mutate replica state and should only be done when the caller owns an
 * independent value object. Out-of-bounds and empty list reads resolve to
 * `undefined` instead of throwing.
 *
 * @param targetIndex - Index in the live list.
 * @param crListReplica - Replica to read from.
 * @returns - The live value at `targetIndex`, or `undefined` when
 * no value is present.
 *
 * Time complexity: O(d), worst case O(n)
 * - d = distance from cursor to target index
 * - n = list size
 *
 * Space complexity: O(1)
 */
export function __read<T>(
  targetIndex: number,
  crListReplica: CRListState<T>
): T | undefined {
  try {
    void seekCursorToIndex<T>(targetIndex, crListReplica)
    return crListReplica.cursor?.value
  } catch {
    return undefined
  }
}
