import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
export function tryToMergeEntry<T>(
  crListReplica: CRListReplica<T>,
  entry: DoublyLinkedListEntry<T>
) {
  if (!entry) return
  /**FAST PATH (append right)*/ if (
    entry.predecessor === crListReplica.cursor?.uuidv7 &&
    !Object.hasOwn(
      crListReplica.seenPredecessorIdentifiersAndTheirEntries,
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
