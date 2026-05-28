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
  splitCursorAfterIndex,
  writeEntryChange,
} from '../../../../../.helpers/index.js'

export function after<T>(
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

  const seekTo =
    listIndex === crListReplica.size ? crListReplica.size - 1 : listIndex
  void seekCursorToIndex<T>(seekTo, crListReplica)
  if (!crListReplica.cursor) return

  const boundary = splitCursorAfterIndex<T>(crListReplica, listIndex)
  if (!boundary) return
  const { entry: insertAfter, next } = boundary

  linkedListEntry.index = insertAfter.index + insertAfter.values.length
  linkedListEntry.predecessor = getEntryTailId(insertAfter)

  void linkEntryBetween<T>(insertAfter, linkedListEntry, next)

  void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
  if (next && next.predecessor === linkedListEntry.predecessor)
    void moveEntryToPredecessor<T>(
      crListReplica,
      next,
      getEntryTailId(linkedListEntry),
      delta
    )
  if (!next) crListReplica.tail = linkedListEntry
  crListReplica.cursor = linkedListEntry
  crListReplica.cursorIndex = linkedListEntry.index

  if (next) void crListReplica.cache.clear()
  void crListReplica.cache.set(linkedListEntry.index, linkedListEntry)

  void writeEntryChange<T>(change, linkedListEntry)
  crListReplica.size = crListReplica.parentMap.size
}
