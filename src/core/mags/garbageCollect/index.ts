import { CRListAck, CRListReplica } from '../../../.types/index.js'

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
  crListReplica: CRListReplica<T>
): void {
  if (!Array.isArray(frontiers)) return
  const frontier = frontiers.sort((a, b) => a.localeCompare(b)).shift()
  if (typeof frontier !== 'string') return
  crListReplica.tombstones.forEach((tombstone, __, tombstones) => {
    if (tombstone <= frontier) {
      tombstones.delete(tombstone)
    }
  })
}
