import { walkToIndex } from '../../../.helpers/index.js'
import { CRListReplica } from '../../../.types/index.js'

/**
 * Time complexity: O(d), worst case O(n)
 * - d = distance from cursor to target index
 * Space complexity: O(1)
 */
export function __read<T>(
  targetIndex: number,
  crListReplica: CRListReplica<T>
): T | undefined {
  try {
    void walkToIndex<T>(targetIndex, crListReplica)
    return crListReplica?.cursor?.value
  } catch {
    return undefined
  }
}
