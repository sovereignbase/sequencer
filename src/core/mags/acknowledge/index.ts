import type { CRListAck, CRListState } from '../../../.types/index.js'

/**
 * Returns the replica tombstone acknowledgement frontier.
 *
 * The frontier is the greatest tombstone identifier currently retained by the
 * replica. Peers can use it as input for tombstone garbage collection.
 *
 * @param crListReplica Replica to acknowledge.
 * @returns The acknowledgement frontier, or `false` when there are no tombstones.
 *
 * Time complexity: O(t)
 * - t = replica tombstone count
 *
 * Space complexity: O(1)
 */
export function __acknowledge<T>(
  crListReplica: CRListState<T>
): CRListAck | false {
  let frontier: CRListAck | false = false
  crListReplica.tombstones.forEach((tombstone) => {
    if (frontier === false || frontier < tombstone) frontier = tombstone
  })
  if (typeof frontier === 'string') return frontier
  return false
}
