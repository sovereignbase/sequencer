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

export function after<T>(
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

  const seekTo =
    listIndex === crListReplica.size ? crListReplica.size - 1 : listIndex
  void seekCursorToIndex<T>(seekTo, crListReplica)
  if (!crListReplica.cursor) return

  const insertAfter = crListReplica.cursor
  const insertAfterIndex = insertAfter.index + insertAfter.values.length - 1
  const next = listIndex === crListReplica.size ? undefined : insertAfter.next

  linkedListEntry.index = insertAfterIndex + 1
  linkedListEntry.predecessor = insertAfter.id

  void linkEntryBetween<T>(insertAfter, linkedListEntry, next)

  if (next && next.predecessor === insertAfter.id) {
    const siblings = crListReplica.childrenMap.get(insertAfter.id)
    if (siblings) {
      const index = siblings.indexOf(next)
      if (index !== -1) void siblings.splice(index, 1)
    }
    next.predecessor = linkedListEntry.id
    const newSiblings = crListReplica.childrenMap.get(linkedListEntry.id)
    if (newSiblings) newSiblings.push(next)
    else crListReplica.childrenMap.set(linkedListEntry.id, [next])
    if (Array.isArray(delta.values))
      delta.values.push({
        id: next.id.toString(),
        values: next.values,
        predecessor: next.predecessor.toString(),
      })
  }

  void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
  crListReplica.cursor = linkedListEntry
  crListReplica.cursorIndex = linkedListEntry.index

  if (next) void crListReplica.cache.clear()
  void crListReplica.cache.set(linkedListEntry.index, linkedListEntry)

  for (let index = 0; index < length; index++)
    change[linkedListEntry.index + index] = linkedListEntry.values[index]
  crListReplica.size = crListReplica.parentMap.size
}
