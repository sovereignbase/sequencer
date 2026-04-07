import { CRListAck, CRListReplica } from '../../../.types/index.js'

/**
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
