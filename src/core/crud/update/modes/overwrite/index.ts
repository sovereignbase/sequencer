import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../../../../.types/type.js'
import {
  attachEntryToEmptyReplica,
  attachEntryToIndexes,
  deleteLiveEntry,
  getEntryTailId,
  linkEntryBetween,
  moveEntryToPredecessor,
  seekCursorToIndex,
  splitBlock,
  splitCursorAtIndex,
  writeEntryChange,
} from '../../../../../.helpers/index.js'

export function overwrite<T>(
  listIndex: number,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  crListReplica: CRListState<T>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  const length = linkedListEntry.values.length

  // Appending to end: treat like 'after' on the last element
  if (listIndex === crListReplica.size) {
    if (crListReplica.size === 0) {
      void attachEntryToEmptyReplica<T>(
        crListReplica,
        linkedListEntry,
        change,
        delta
      )
      return
    }
    void seekCursorToIndex<T>(crListReplica.size - 1, crListReplica)
    if (!crListReplica.cursor) return
    const last = crListReplica.cursor
    linkedListEntry.index = last.index + last.values.length
    linkedListEntry.predecessor = getEntryTailId(last)
    void linkEntryBetween<T>(last, linkedListEntry, undefined)
    void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
    crListReplica.cursor = linkedListEntry
    crListReplica.cursorIndex = linkedListEntry.index
    void crListReplica.cache.set(linkedListEntry.index, linkedListEntry)
    void writeEntryChange<T>(change, linkedListEntry)
    crListReplica.size = crListReplica.parentMap.size
    return
  }

  void seekCursorToIndex<T>(listIndex, crListReplica)
  if (!crListReplica.cursor) return

  const start = splitCursorAtIndex<T>(crListReplica, listIndex)
  if (!start) return

  const actualIndex = start.index
  const prev = start.prev
  const predecessor = prev ? getEntryTailId(prev) : 0n
  const deleteLimit = Math.min(length, crListReplica.size - actualIndex)
  const deletedIds = new Set<string>()
  let deleted = 0
  let current: CRListStateEntry<T> = start

  while (current && deleted < deleteLimit) {
    const remaining = deleteLimit - deleted
    let entryToDelete: NonNullable<CRListStateEntry<T>>

    if (current.values.length <= remaining) {
      entryToDelete = current
      current = current.next
    } else {
      const [left, right] = splitBlock<T>(crListReplica, current, remaining)
      entryToDelete = left
      current = right
    }

    for (
      let entryOffset = 0;
      entryOffset < entryToDelete.values.length;
      entryOffset++
    )
      void deletedIds.add((entryToDelete.id + BigInt(entryOffset)).toString())
    void deleteLiveEntry<T>(crListReplica, entryToDelete, delta)
    deleted += entryToDelete.values.length
  }

  linkedListEntry.predecessor = predecessor
  linkedListEntry.index = actualIndex

  void linkEntryBetween<T>(prev, linkedListEntry, current)
  void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
  if (current && deletedIds.has(current.predecessor.toString()))
    void moveEntryToPredecessor<T>(
      crListReplica,
      current,
      getEntryTailId(linkedListEntry),
      delta
    )

  crListReplica.cursor = linkedListEntry
  crListReplica.cursorIndex = actualIndex
  void crListReplica.cache.clear()
  void crListReplica.cache.set(actualIndex, linkedListEntry)
  void writeEntryChange<T>(change, linkedListEntry)
  crListReplica.size = crListReplica.parentMap.size
}
