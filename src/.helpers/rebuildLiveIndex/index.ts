import type { CRListState } from '../../.types/type.js'

/**
 * Rebuilds the opportunistic index cache from the current live projection.
 */
export function rebuildLiveIndex<T>(crListReplica: CRListState<T>): void {
  if (!crListReplica.cursor) {
    crListReplica.cache.clear()
    crListReplica.head = undefined
    crListReplica.tail = undefined
    crListReplica.cursorIndex = undefined
    return
  }
  // Walk backward to head — O(k) where k = current cursor position.
  while (crListReplica.cursor.prev)
    crListReplica.cursor = crListReplica.cursor.prev
  crListReplica.cursor.index = 0
  crListReplica.head = crListReplica.cursor
  void crListReplica.cache.clear()
  void crListReplica.cache.set(0, crListReplica.cursor)
  crListReplica.cursorIndex = 0
}
