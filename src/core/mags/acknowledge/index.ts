import {
  compareUint32UuidV7,
  snapshotRangeEnd,
} from '../../../.helpers/index.js'
import type {
  CRListAck,
  CRListState,
  Uint32UuidV7,
} from '../../../.types/type.js'

/**
 * Returns the replica deleted-id acknowledgement frontier.
 *
 * @param crListReplica - Replica to acknowledge.
 * @returns - The acknowledgement frontier, or `false` when there are no deleted ids.
 */
export function __acknowledge<T>(
  crListReplica: CRListState<T>
): CRListAck | false {
  let frontier: Uint32UuidV7 | undefined

  for (const range of crListReplica.ranges) {
    if (range.items !== undefined) continue
    const end = snapshotRangeEnd(range)
    if (frontier === undefined || compareUint32UuidV7(end, frontier) > 0)
      frontier = end
  }

  return frontier ?? false
}
