import type { CRListState } from '../../.types/index.js'
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
  const indexedEntry = crListReplica.index?.get(targetIndex)
  if (indexedEntry) {
    if (crListReplica.parentMap.get(indexedEntry.uuidv7) === indexedEntry) {
      crListReplica.cursor = indexedEntry
      crListReplica.cursorIndex = targetIndex
      return
    } else {
      crListReplica.index?.delete(targetIndex)
    }
  }
  if (!crListReplica.cursor)
    throw new CRListError('LIST_EMPTY', 'List is empty')
  let cursorIndex = crListReplica.cursorIndex ?? crListReplica.cursor.index
  const direction = cursorIndex > targetIndex ? 'prev' : 'next'
  while (crListReplica.cursor && cursorIndex !== targetIndex) {
    crListReplica.cursor = crListReplica.cursor[direction]
    cursorIndex += direction === 'next' ? 1 : -1
  }
  if (crListReplica.cursor) {
    crListReplica.cursorIndex = targetIndex
    crListReplica.index?.set(targetIndex, crListReplica.cursor)
  }
}
