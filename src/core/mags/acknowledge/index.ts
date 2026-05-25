import { safeBigIntFromString } from '@sovereignbase/utils'
import type { CRListAck, CRListState } from '../../../.types/type.js'

/**
 * Returns the replica tombstone acknowledgement frontier.
 *
 * @param crListReplica - Replica to acknowledge.
 * @returns - The acknowledgement frontier, or `false` when there are no tombstones.
 */
export function __acknowledge<T>(
  crListReplica: CRListState<T>
): CRListAck | false {
  let largest: bigint | undefined
  void crListReplica.tombstones.forEach((tombstone) => {
    const canditate = safeBigIntFromString(tombstone)
    if (canditate !== false && (largest === undefined || canditate > largest))
      largest = canditate
  })
  return largest !== undefined ? largest.toString() : false
}
