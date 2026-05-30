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
  // Deleted ranges are sorted ascending, so the last range has the high frontier.
  const ranges = crListReplica.deletedRanges

  // No retained tombstones means there is nothing useful to acknowledge.
  if (ranges.length === 0) return false

  // Return the highest retained deleted id as the acknowledgement frontier.
  return ranges[ranges.length - 1][1].toString()
}
