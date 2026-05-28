import {
  safeBigIntFromString,
  uuidV7BigIntStringToBigInt,
} from '@sovereignbase/utils'
import { CRListAck, CRListState } from '../../../.types/type.js'

/**
 * Removes tombstones acknowledged by all supplied frontiers.
 *
 * @param frontiers - Acknowledgement frontiers received from peers.
 * @param crListReplica - Replica whose tombstones will be collected.
 */
export function __garbageCollect<T>(
  frontiers: Array<CRListAck>,
  crListReplica: CRListState<T>
): void {
  if (!Array.isArray(frontiers)) return
  const valid: Array<bigint> = []

  for (const frontier of frontiers) {
    if (typeof frontier !== 'string') continue
    const bigint = safeBigIntFromString(frontier)

    if (bigint === false) continue

    void valid.push(bigint)
  }

  if (valid.length === 0) return
  void valid.sort((a, b) => (a < b ? -1 : 1))
  const smallestBig = valid[0]
  void crListReplica.tombstones.forEach((tombstone, __, tombstones) => {
    const canditate = uuidV7BigIntStringToBigInt(tombstone)

    /** delete malformed and valid acknowledged tombstones */
    if (canditate === false || canditate <= smallestBig)
      void tombstones.delete(tombstone)
  })
}
