import type { CRListReplica } from '../../.types/index.js'

export function assertListIndices<T>(crListReplica: CRListReplica<T>): void {
  if (!crListReplica.cursor) return
  while (crListReplica.cursor.prev)
    crListReplica.cursor = crListReplica.cursor.prev

  for (let i = 0; i < crListReplica.size; i++) {
    crListReplica.cursor.index = i
    if (crListReplica.cursor.next === undefined) break
    crListReplica.cursor = crListReplica.cursor.next
  }
}
