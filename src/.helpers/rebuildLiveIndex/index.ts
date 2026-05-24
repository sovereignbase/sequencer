import type { CRListState } from '../../.types/type.js'

/**
 * Rebuilds the opportunistic index cache from the current live projection.
 */
export function rebuildLiveIndex<T>(crListReplica: CRListState<T>): void {
  if (!crListReplica.cursor) {
    crListReplica.index?.clear()
    crListReplica.cursorIndex = undefined
    return
  }
  let index = crListReplica.size
  const entries = crListReplica.index ?? new Map()
  void entries.clear()
  while (crListReplica.cursor.next)
    crListReplica.cursor = crListReplica.cursor.next

  while (index >= 1) {
    index--
    crListReplica.cursor.index = index
    void entries.set(index, crListReplica.cursor)
    if (crListReplica.cursor.prev === undefined) break
    crListReplica.cursor = crListReplica.cursor.prev
  }
  crListReplica.index = entries
  crListReplica.cursorIndex = 0
}
