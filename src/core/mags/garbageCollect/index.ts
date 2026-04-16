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
  const frontier = frontiers.sort().shift()
  if (typeof frontier !== 'string') return
  crListReplica.tombstones.forEach((tombstone, __, tombstones) => {
    if (isUuidV7(tombstone) && tombstone <= frontier) {
      tombstones.delete(tombstone)
    }
  })
}
