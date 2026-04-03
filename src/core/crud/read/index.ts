import { walkToIndex } from '../../../.helpers/index.js'
import { CRListState, CRListStateEntry } from '../../../.types/index.js'

/**
 * Time complexity: O(d), worst case O(n)
 * - d = distance from cursor to target index
 * Space complexity: O(1)
 */
export function read<T>(
  cursor: CRListStateEntry<T>,
  maxLength: number,
  targetIndex: number
): T | undefined {
  try {
    walkToIndex<T>(cursor, maxLength, targetIndex)
  } catch {
    return undefined
  }
  return cursor.__value
}
