import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
import { CRListError } from '../../.errors/class.js'

const walker = {
  forward<T>(cursor: DoublyLinkedListEntry<T>) {
    return cursor?.next
  },
  backward<T>(cursor: DoublyLinkedListEntry<T>) {
    return cursor?.prev
  },
}
export function walkToIndex<T>(
  targetIndex: number,
  crListReplica: CRListReplica<T>
): void {
  if (targetIndex < 0 || targetIndex >= crListReplica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS', 'Index out of bounds')
  if (!crListReplica.cursor)
    throw new CRListError('LIST_EMPTY', 'List is empty')
  const direction =
    crListReplica.cursor.index > targetIndex ? 'backward' : 'forward'
  const walk = walker[direction]
  while (crListReplica?.cursor?.index !== targetIndex) {
    crListReplica.cursor = walk<T>(crListReplica.cursor)
  }
}
