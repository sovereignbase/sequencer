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
      if (indexedEntry.index !== targetIndex) {
        crListReplica.index?.delete(targetIndex)
        crListReplica.index?.set(indexedEntry.index, indexedEntry)
      }
    } else {
      crListReplica.index?.delete(targetIndex)
    }
  }
  if (!crListReplica.cursor)
    throw new CRListError('LIST_EMPTY', 'List is empty')
  const direction = crListReplica.cursor.index > targetIndex ? 'prev' : 'next'
  while (crListReplica.cursor && crListReplica.cursor.index !== targetIndex) {
    crListReplica.cursor = crListReplica.cursor[direction]
  }
  if (crListReplica.cursor)
    crListReplica.index?.set(targetIndex, crListReplica.cursor)
}
