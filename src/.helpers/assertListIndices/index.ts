import type { CRListReplica } from '../../.types/index.js'

export function assertListIndices<T>(crListReplica: CRListReplica<T>): void {
  if (!crListReplica.cursor) return
  let index = crListReplica.size - 1
  while (crListReplica.cursor.next)
    crListReplica.cursor = crListReplica.cursor.next

  while (index >= 0) {
    crListReplica.cursor.index = index
    if (crListReplica.cursor.prev === undefined) break
    crListReplica.cursor = crListReplica.cursor.prev
  }
}
