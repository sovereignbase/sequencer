import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
import { CRListError } from '../../.errors/class.js'

export function walkToIndex<T>(
  targetIndex: number,
  crListReplica: CRListReplica<T>
): void {
  if (targetIndex < 0 || targetIndex >= crListReplica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS', 'Index out of bounds')
  if (!crListReplica.cursor)
    throw new CRListError('LIST_EMPTY', 'List is empty')
  const direction = crListReplica.cursor.index > targetIndex ? 'prev' : 'next'
  while (crListReplica.cursor && crListReplica.cursor.index !== targetIndex) {
    crListReplica.cursor = crListReplica.cursor[direction]
  }
}
