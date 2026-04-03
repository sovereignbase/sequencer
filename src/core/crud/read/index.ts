import { walkToIndex } from '../../../.helpers/index.js'
import { DoublyLinkedListEntry } from '../../../.types/index.js'

/**
 * Time complexity: O(d), worst case O(n)
 * - d = distance from cursor to target index
 * Space complexity: O(1)
 */
export function __read<T>(
  cursor: DoublyLinkedListEntry<T>,
  listLength: number,
  targetIndex: number
): T | undefined {
  try {
    const entry = walkToIndex<T>(cursor, listLength, targetIndex)
    return entry?.value
  } catch {
    return undefined
  }
}
