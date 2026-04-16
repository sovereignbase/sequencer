import { isUuidV7 } from '@sovereignbase/utils'
import { CRListAck, CRListState } from '../../../.types/index.js'

/**
 * Removes tombstones acknowledged by all supplied frontiers.
 *
 * The minimum frontier is used as the safe collection boundary. Tombstones less
 * than or equal to that boundary are removed from the local replica.
 *
 * @param frontiers Acknowledgement frontiers received from peers.
 * @param crListReplica Replica whose tombstones will be collected.
 *
 * Time complexity: O(f log f + t)
 * - f = frontier count
 * - t = replica tombstone count
 *
 * Space complexity: O(1)
 */
export function __garbageCollect<T>(
  frontiers: Array<CRListAck>,
  crListReplica: CRListState<T>
): void {
  if (!Array.isArray(frontiers)) return
  let smallest = ''
  frontiers.sort()
  while (smallest === '') {
    const v7 = frontiers.shift()
    if (isUuidV7(v7)) smallest = v7
  }
  crListReplica.tombstones.forEach((tombstone, __, tombstones) => {
    if (tombstone <= smallest) {
      tombstones.delete(tombstone)
    }
  })
}
