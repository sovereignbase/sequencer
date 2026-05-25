import type { CRListState } from '../../.types/type.js'
import { CRListError } from '../../.errors/class.js'

/**
 * Moves the replica cursor to a live index.
 *
 * A valid cached index entry is used directly. Stale cache entries are dropped
 * and the cursor walks from its current position, then repairs the cache at the
 * requested index.
 */
export function seekCursorToIndex<T>(
  targetIndex: number,
  crListReplica: CRListState<T>
): void {
  if (targetIndex < 0 || targetIndex >= crListReplica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS', 'Index out of bounds')
  const indexedEntry = crListReplica.cache.get(targetIndex)
  if (indexedEntry) {
    if (crListReplica.parentMap.get(indexedEntry.id) === indexedEntry) {
      crListReplica.cursor = indexedEntry
      crListReplica.cursorIndex = targetIndex
      return
    } else {
      void crListReplica.cache.delete(targetIndex)
    }
  }
  if (!crListReplica.cursor)
    throw new CRListError('LIST_EMPTY', 'List is empty')
  // blockStart tracks the start element-index of the current cursor block.
  // cursor.index may be stale after mutations; we fix it lazily as we walk.
  let blockStart = crListReplica.cursor.index
  const direction =
    (crListReplica.cursorIndex ?? blockStart) > targetIndex ? 'prev' : 'next'
  while (crListReplica.cursor) {
    crListReplica.cursor.index = blockStart
    const blockEnd = blockStart + crListReplica.cursor.values.length
    if (blockStart <= targetIndex && targetIndex < blockEnd) {
      crListReplica.cursorIndex = targetIndex
      void crListReplica.cache.set(targetIndex, crListReplica.cursor)
      return
    }
    if (direction === 'next') {
      blockStart += crListReplica.cursor.values.length
      crListReplica.cursor = crListReplica.cursor.next
    } else {
      const prev = crListReplica.cursor.prev
      if (prev) blockStart -= prev.values.length
      crListReplica.cursor = prev
    }
  }
}
