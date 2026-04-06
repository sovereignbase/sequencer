import type { DoublyLinkedListEntry, CRListReplica } from '../.types/index.ts'

const walker = {
  forward<T>(cursor: DoublyLinkedListEntry<T>) {
    return cursor?.next
  },
  backward<T>(cursor: DoublyLinkedListEntry<T>) {
    return cursor?.prev
  },
}
export function walkToIndex<T>(
  cursor: DoublyLinkedListEntry<T>,
  listLength: number,
  targetIndex: number
): DoublyLinkedListEntry<T> {
  if (targetIndex < 0 || targetIndex >= listLength)
    throw new Error('out of bounds')
  if (!cursor) throw new Error('empty')
  const direction = cursor.index > targetIndex ? 'backward' : 'forward'
  const walk = walker[direction]
  while (cursor.index !== targetIndex) {
    cursor = walk<T>(cursor)
    if (!cursor) throw new Error('broken list')
  }
  return cursor
}

export function tryToMergeEntry<T>(
  crListReplica: CRListReplica<T>,
  entry: DoublyLinkedListEntry<T>
) {
  if (!entry) return
  /**FAST PATH (append right)*/ if (
    entry.predecessor === crListReplica.cursor?.uuidv7 &&
    !Object.hasOwn(
      crListReplica.seenPredecessorIdentifiersAndTheirEntry,
      crListReplica.cursor.uuidv7
    )
  ) {
    entry.prev = crListReplica.cursor
    if (crListReplica.cursor) crListReplica.cursor.next = entry
    crListReplica.cursor = entry
    crListReplica.size++
  } else if (
    /**CONFLICT RESOLVE PATH*/
    Object.hasOwn(
      crListReplica.seenPredecessorIdentifiersAndTheirEntries,
      entry.predecessor
    )
  ) {
    crListReplica.seenPredecessorIdentifiersAndTheirEntries[
      entry.predecessor
    ].add(entry)
  } else /**DETACHED*/ {
    crListReplica.detachedEntries.add(entry)
  }
}
