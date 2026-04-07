import { CRListAck, CRListReplica } from '../../../.types/index.js'

export function garbageCollect<T>(
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
