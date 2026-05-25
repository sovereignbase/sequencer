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
  const forwardSeen = new Set<unknown>()
  while (crListReplica.cursor.next) {
    if (forwardSeen.has(crListReplica.cursor)) break
    void forwardSeen.add(crListReplica.cursor)
    crListReplica.cursor = crListReplica.cursor.next
  }

  let index = crListReplica.size
  void crListReplica.cache.clear()
  const backwardSeen = new Set<unknown>()
  while (crListReplica.cursor) {
    if (backwardSeen.has(crListReplica.cursor)) break
    void backwardSeen.add(crListReplica.cursor)
    index -= crListReplica.cursor.values.length
    crListReplica.cursor.index = index
    void crListReplica.cache.set(index, crListReplica.cursor)
    if (!crListReplica.cursor.prev) break
    crListReplica.cursor = crListReplica.cursor.prev
  }
  crListReplica.cursorIndex = 0
}
