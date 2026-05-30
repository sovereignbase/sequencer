import { seekCursorToIndex } from '../../../.helpers/index.js'
import { CRListState } from '../../../.types/type.js'

/**
 * Reads the value at an index in the replica live view.
 *
 * The replica current block is moved as part of the lookup. Successful reads return
 * the live value reference stored by the replica. Mutating that value directly
 * can mutate replica state and should only be done when the caller owns an
 * independent value object. Out-of-bounds and empty list reads resolve to
 * `undefined` instead of throwing.
 *
 * @param targetIndex - Index in the live list.
 * @param replica - Replica to read from.
 * @returns - The live value at `targetIndex`, or `undefined` when
 * no value is present.
 *
 * Time complexity: O(d), worst case O(n)
 * - d = distance from current block to target index
 * - n = list size
 *
 * Space complexity: O(1)
 */
export function __read<T>(
  targetIndex: number,
  replica: CRListState<T>
): T | undefined {
  try {
    // Move the cursor onto the block that contains the requested live index.
    void seekCursorToIndex<T>(replica, targetIndex)

    // Convert the absolute list index into an offset inside the cursor block.
    return replica.currentBlock?.items[
      targetIndex - (replica.currentBlockIndex ?? 0)
    ]
  } catch {
    // Reads intentionally collapse invalid indexes and empty lists to undefined.
    return undefined
  }
}
