import {
  safeBigIntFromString,
  uuidV7BigIntStringToBigInt,
} from '@sovereignbase/utils'
import { CRListAck, CRListState } from '../../../.types/type.js'

/**
 * Removes deleted item ids acknowledged by all supplied frontiers.
 *
 * @param frontiers - Acknowledgement frontiers received from peers.
 * @param replica - Replica whose deleted item ids will be collected.
 */
export function __garbageCollect<T>(
  frontiers: Array<CRListAck>,
  replica: CRListState<T>
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
  void replica.deletedIds.forEach((deletedId, __, deletedIds) => {
    const canditate = uuidV7BigIntStringToBigInt(deletedId)

    /** Delete malformed ids and ids acknowledged by every supplied frontier. */
    if (canditate === false || canditate <= smallestBig)
      void deletedIds.delete(deletedId)
  })
}
