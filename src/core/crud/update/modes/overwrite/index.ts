import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../../../../.types/type.js'
import {
  attachEntryToIndexes,
  detachEntryFromIndexes,
  linkEntryBetween,
  seekCursorToIndex,
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
      linkedListEntry.index = 0
      crListReplica.cursor = linkedListEntry
      crListReplica.cursorIndex = 0
      void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
      void crListReplica.cache.set(0, linkedListEntry)
      for (let i = 0; i < length; i++) change[i] = linkedListEntry.values[i]
      crListReplica.size = crListReplica.parentMap.size
      return
    }
    void seekCursorToIndex<T>(crListReplica.size - 1, crListReplica)
    if (!crListReplica.cursor) return
    const last = crListReplica.cursor
    linkedListEntry.index = last.index + last.values.length
    linkedListEntry.predecessor = last.id
    void linkEntryBetween<T>(last, linkedListEntry, undefined)
    void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
    crListReplica.cursor = linkedListEntry
    crListReplica.cursorIndex = linkedListEntry.index
    void crListReplica.cache.set(linkedListEntry.index, linkedListEntry)
    for (let index = 0; index < length; index++)
      change[linkedListEntry.index + index] = linkedListEntry.values[index]
    crListReplica.size = crListReplica.parentMap.size
    return
  }

  void seekCursorToIndex<T>(listIndex, crListReplica)
  if (!crListReplica.cursor) return

  const entryToOverwrite = crListReplica.cursor
  const actualIndex = entryToOverwrite.index

  linkedListEntry.predecessor = entryToOverwrite.predecessor
  linkedListEntry.index = actualIndex

  void linkEntryBetween<T>(
    entryToOverwrite.prev,
    linkedListEntry,
    entryToOverwrite.next
  )

  // Re-anchor the overwritten entry's successor if it pointed at the overwritten entry
  if (entryToOverwrite.next?.predecessor === entryToOverwrite.id) {
    const overwriteNext = entryToOverwrite.next
    const overwritesSiblings = crListReplica.childrenMap.get(
      entryToOverwrite.id
    )
    if (overwritesSiblings) {
      const index = overwritesSiblings.indexOf(overwriteNext)
      if (index !== -1) void overwritesSiblings.splice(index, 1)
    }
    overwriteNext.predecessor = linkedListEntry.id
    const newSiblings = crListReplica.childrenMap.get(linkedListEntry.id)
    if (newSiblings) void newSiblings.push(overwriteNext)
    else crListReplica.childrenMap.set(linkedListEntry.id, [overwriteNext])
    // Emit the reparented successor in the delta so peers can converge
    if (delta.values) {
      delta.values.push({
        id: overwriteNext.id.toString(),
        values: overwriteNext.values,
        predecessor: overwriteNext.predecessor.toString(),
      })
    }
  }

  void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
  void crListReplica.tombstones.add(entryToOverwrite.id.toString())
  void delta.tombstones?.push(entryToOverwrite.id.toString())
  void detachEntryFromIndexes<T>(crListReplica, entryToOverwrite)
  entryToOverwrite.next = undefined
  entryToOverwrite.prev = undefined

  crListReplica.cursor = linkedListEntry
  crListReplica.cursorIndex = actualIndex
  void crListReplica.cache.set(actualIndex, linkedListEntry)
  for (let index = 0; index < length; index++)
    change[actualIndex + index] = linkedListEntry.values[index]
  crListReplica.size = crListReplica.parentMap.size
}
