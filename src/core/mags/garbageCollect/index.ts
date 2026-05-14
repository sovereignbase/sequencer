import { isUuidV7 } from '@sovereignbase/utils'
import { CRListAck, CRListState } from '../../../.types/index.js'

/**
 * Removes tombstones acknowledged by all supplied frontiers.
 *
 * The smallest valid UUIDv7 frontier is used as the safe collection boundary.
 * Tombstones less than or equal to that boundary are removed from the local
 * replica.
 *
 * @param frontiers - Acknowledgement frontiers received from peers.
 * @param crListReplica - Replica whose tombstones will be collected.
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
  void frontiers.sort()
  const smallest = frontiers.find((frontier) => isUuidV7(frontier))
  if (typeof smallest !== 'string') return
  void crListReplica.tombstones.forEach((tombstone, __, tombstones) => {
    if (tombstone <= smallest) {
      void tombstones.delete(tombstone)
    }
  })
}
