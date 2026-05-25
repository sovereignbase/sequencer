import { safeBigIntFromString } from '@sovereignbase/utils'
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
  const valid = frontiers.filter(
    (frontier) =>
      typeof frontier === 'string' && safeBigIntFromString(frontier) !== false
  )
  if (valid.length === 0) return
  void valid.sort((a, b) => (BigInt(a) < BigInt(b) ? -1 : 1))
  const smallestBig = BigInt(valid[0])
  void crListReplica.tombstones.forEach((tombstone, __, tombstones) => {
    const canditate = safeBigIntFromString(tombstone)
    if (canditate !== false && canditate <= smallestBig)
      void tombstones.delete(tombstone)
  })
}
