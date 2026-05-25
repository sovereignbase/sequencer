import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../../../../.types/type.js'
import {
  attachEntryToIndexes,
  linkEntryBetween,
  seekCursorToIndex,
} from '../../../../../.helpers/index.js'

export function before<T>(
  listIndex: number,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  crListReplica: CRListState<T>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  const length = linkedListEntry.values.length

  if (crListReplica.size === 0 && listIndex === 0) {
    linkedListEntry.index = 0
    crListReplica.cursor = linkedListEntry
    crListReplica.cursorIndex = 0
    void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
    void crListReplica.cache.set(0, linkedListEntry)
    for (let index = 0; index < length; index++)
      change[index] = linkedListEntry.values[index]
    crListReplica.size = crListReplica.parentMap.size
    return
  }

  void seekCursorToIndex<T>(listIndex, crListReplica)
  if (!crListReplica.cursor) return

  const insertBefore = crListReplica.cursor
  const prev = insertBefore.prev

  linkedListEntry.index = insertBefore.index
  linkedListEntry.predecessor = prev?.id ?? 0n

  void linkEntryBetween<T>(prev, linkedListEntry, insertBefore)

  if (insertBefore.predecessor === linkedListEntry.predecessor) {
    const siblings = crListReplica.childrenMap.get(insertBefore.predecessor)
    if (siblings) {
      const index = siblings.indexOf(insertBefore)
      if (index !== -1) void siblings.splice(index, 1)
    }
    insertBefore.predecessor = linkedListEntry.id
    const newSiblings = crListReplica.childrenMap.get(linkedListEntry.id)
    if (newSiblings) void newSiblings.push(insertBefore)
    else void crListReplica.childrenMap.set(linkedListEntry.id, [insertBefore])
    if (Array.isArray(delta.values))
      delta.values.push({
        id: insertBefore.id.toString(),
        values: insertBefore.values,
        predecessor: insertBefore.predecessor.toString(),
      })
  }

  void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
  crListReplica.cursor = linkedListEntry
  crListReplica.cursorIndex = linkedListEntry.index

  void crListReplica.cache.clear()
  void crListReplica.cache.set(linkedListEntry.index, linkedListEntry)

  for (let index = 0; index < length; index++)
    change[linkedListEntry.index + index] = linkedListEntry.values[index]
  crListReplica.size = crListReplica.parentMap.size
}
