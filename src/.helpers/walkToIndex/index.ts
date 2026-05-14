import type { CRListState } from '../../.types/index.js'
import { CRListError } from '../../.errors/class.js'

export function walkToIndex<T>(
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
