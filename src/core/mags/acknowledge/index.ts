import type { CRListAck, CRListState } from '../../../.types/type.js'

/**
 * Returns the replica deleted-id acknowledgement frontier.
 *
 * @param crListReplica - Replica to acknowledge.
 * @returns - The acknowledgement frontier, or `false` when there are no deleted ids.
 */
export function __acknowledge<T>(
  crListReplica: CRListState<T>
): CRListAck | false {
  const ranges = crListReplica.deletedRanges
  if (ranges.length === 0) return false
  return ranges[ranges.length - 1][1].toString()
}
