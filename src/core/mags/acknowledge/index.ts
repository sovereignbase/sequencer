import {
  safeBigIntFromString,
  uuidV7BigIntStringToBigInt,
} from '@sovereignbase/utils'
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
  let largest: bigint | undefined
  void crListReplica.deletedIds.forEach((deletedId) => {
    const canditate = uuidV7BigIntStringToBigInt(deletedId)

    if (canditate === false) {
      crListReplica.deletedIds.delete(deletedId)
      return
    }

    if (largest === undefined || canditate > largest) largest = canditate
  })
  return largest !== undefined ? largest.toString() : false
}
