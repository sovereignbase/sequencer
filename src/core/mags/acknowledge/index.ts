import type { CRListAck, CRListReplica } from '../../../.types/index.js'

/**
 * Time complexity: O(t log t)
 * - t = replica tombstone count
 *
 * Space complexity: O(t)
 */
export function __acknowledge<T>(
  crListReplica: CRListReplica<T>
): CRListAck | false {
  const frontier = Array.from(crListReplica.tombstones.values())
    .sort((a, b) => a.localeCompare(b))
    .pop()
  if (typeof frontier === 'string') return frontier
  return false
}
