import type { CRListState } from '../../.types/type.js'

/**
 * Rebuilds the opportunistic index cache from the current live projection.
 */
export function rebuildLiveIndex<T>(crListReplica: CRListState<T>): void {
  if (!crListReplica.cursor) {
    crListReplica.cache.clear()
    crListReplica.cursorIndex = undefined
    return
  }
  // Walk to end
  let forwardLimit = crListReplica.size
  while (crListReplica.cursor.next) {
    if (forwardLimit-- <= 0) break
    crListReplica.cursor = crListReplica.cursor.next
  }

  let index = crListReplica.size
  void crListReplica.cache.clear()
  let backwardLimit = crListReplica.size
  while (crListReplica.cursor) {
    if (backwardLimit-- < 0) break
    index -= crListReplica.cursor.values.length
    crListReplica.cursor.index = index
    void crListReplica.cache.set(index, crListReplica.cursor)
    if (!crListReplica.cursor.prev) break
    crListReplica.cursor = crListReplica.cursor.prev
  }
  crListReplica.cursorIndex = 0
}
