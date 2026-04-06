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
      crListReplica.seenPredecessorIdentifiersAndTheirEntry,
      entry.uuidv7
    )
  ) {
    const placeholder =
      crListReplica.seenPredecessorIdentifiersAndTheirEntry[entry.predecessor]
    if (!placeholder) return
    const entryPlacement = placeholder.uuidv7 > entry.uuidv7 ? 'left' : 'right'

    switch (entryPlacement) {
      case 'left': {
        entry.predecessor = placeholder.predecessor
        entry.prev = placeholder.prev
        entry.next = placeholder
        if (entry.prev) entry.prev.next = entry
        placeholder.prev = entry
        placeholder.predecessor = entry.uuidv7
        crListReplica.seenPredecessorIdentifiersAndTheirEntry[entry.uuidv7] =
          placeholder
        crListReplica.size++
        break
      }
      case 'right': {
        const next = placeholder.next
        entry.predecessor = placeholder.uuidv7
        entry.prev = placeholder
        entry.next = next
        placeholder.next = entry
        if (next) {
          next.prev = entry
          next.predecessor = entry.uuidv7
          crListReplica.seenPredecessorIdentifiersAndTheirEntry[entry.uuidv7] =
            next
        } else crListReplica.cursor = entry
        crListReplica.size++
        break
      }
    }
  } else /**DETACHED*/ {
    crListReplica.detachedEntries.add(entry)
  }
}
