import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../../../../.types/type.js'
import {
  attachEntryToEmptyReplica,
  attachEntryToIndexes,
  getEntryTailId,
  linkEntryBetween,
  moveEntryToPredecessor,
  seekCursorToIndex,
  splitCursorAtIndex,
  writeEntryChange,
} from '../../../../../.helpers/index.js'

export function before<T>(
  listIndex: number,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  crListReplica: CRListState<T>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  if (crListReplica.size === 0 && listIndex === 0) {
    void attachEntryToEmptyReplica<T>(
      crListReplica,
      linkedListEntry,
      change,
      delta
    )
    return
  }

  void seekCursorToIndex<T>(listIndex, crListReplica)
  if (!crListReplica.cursor) return

  const insertBefore = splitCursorAtIndex<T>(crListReplica, listIndex)
  if (!insertBefore) return
  const prev = insertBefore.prev
  const predecessor = prev ? getEntryTailId(prev) : 0n

  linkedListEntry.index = insertBefore.index
  linkedListEntry.predecessor = predecessor

  void linkEntryBetween<T>(prev, linkedListEntry, insertBefore)

  void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
  if (insertBefore.predecessor === predecessor)
    void moveEntryToPredecessor<T>(
      crListReplica,
      insertBefore,
      getEntryTailId(linkedListEntry),
      delta
    )
  if (!prev) crListReplica.head = linkedListEntry
  crListReplica.cursor = linkedListEntry
  crListReplica.cursorIndex = linkedListEntry.index

  void crListReplica.cache.clear()
  void crListReplica.cache.set(linkedListEntry.index, linkedListEntry)

  void writeEntryChange<T>(change, linkedListEntry)
  crListReplica.size = crListReplica.parentMap.size
}
