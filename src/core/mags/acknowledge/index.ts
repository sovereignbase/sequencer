import type { CRListAck, CRListReplica } from '../../../.types/index.js'

/**
 * Returns the replica tombstone acknowledgement frontier.
 *
 * The frontier is the greatest tombstone identifier currently retained by the
 * replica. Peers can use it as input for tombstone garbage collection.
 *
 * @param crListReplica Replica to acknowledge.
 * @returns The acknowledgement frontier, or `false` when there are no tombstones.
 *
 * Time complexity: O(t log t)
 * - t = replica tombstone count
 *
 * Space complexity: O(t)
 */
export function __acknowledge<T>(
  crListReplica: CRListReplica<T>
): CRListAck | false {
  const frontier = Array.from(crListReplica.tombstones.values()).sort().pop()
  if (typeof frontier === 'string') return frontier
  return false
}
