import { CRListError } from '../../../.errors/class.js'
import { safeStructuredClone } from '@sovereignbase/utils'
import {
  updateEntryToMaps,
  deleteEntryFromMaps,
  walkToIndex,
} from '../../../.helpers/index.js'
import { v7 as uuidv7 } from 'uuid'
import { CRListReplica, DoublyLinkedListEntry } from '../../../.types/index.js'
/**
 * Time complexity: O(d), worst case O(n)
 * - d = distance from cursor to target index
 * Space complexity: O(1)
 */
export function __update<T>(
  listIndex: number,
  listValue: T,
  crListReplica: CRListReplica<T>,
  mode: 'overwrite' | 'before' | 'after'
): void {
  const [cloned, copiedValue] = safeStructuredClone(listValue)

  if (!cloned) throw new CRListError('VALUE_NOT_CLONEABLE')

  const moveEntryToPredecessor = (
    entry: NonNullable<DoublyLinkedListEntry<T>>,
    predecessor: string
  ): void => {
    const siblings = crListReplica.childrenMap.get(entry.predecessor)
    const siblingIndex = siblings?.indexOf(entry) ?? -1
    if (siblings && siblingIndex !== -1) siblings.splice(siblingIndex, 1)
    entry.predecessor = predecessor
    void updateEntryToMaps<T>(crListReplica, entry)
  }

  const v7 = uuidv7()

  const linkedListEntry: NonNullable<DoublyLinkedListEntry<T>> = {
    uuidv7: v7,
    value: copiedValue,
    predecessor: '\0',
    index: 0,
    next: undefined,
    prev: undefined,
  }

  if (crListReplica.size === 0 && listIndex === 0) {
    if (!crListReplica.cursor) crListReplica.cursor = linkedListEntry
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)
    crListReplica.size = crListReplica.parentMap.size
    return
  }

  if (listIndex === crListReplica.size) {
    linkedListEntry.index = listIndex
    void walkToIndex<T>(crListReplica.size - 1, crListReplica)
    if (!crListReplica.cursor) return
    crListReplica.cursor.next = linkedListEntry
    linkedListEntry.prev = crListReplica.cursor
    linkedListEntry.predecessor = crListReplica.cursor.uuidv7
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)
    crListReplica.size = crListReplica.parentMap.size
    return
  }

  if (mode === 'overwrite') {
    void walkToIndex<T>(listIndex, crListReplica)
    if (!crListReplica.cursor) return
    const overwrittenEntry = crListReplica.cursor

    linkedListEntry.predecessor = overwrittenEntry.predecessor
    linkedListEntry.index = overwrittenEntry.index
    linkedListEntry.next = overwrittenEntry.next
    linkedListEntry.prev = overwrittenEntry.prev
    if (overwrittenEntry.prev) overwrittenEntry.prev.next = linkedListEntry
    if (overwrittenEntry.next) {
      overwrittenEntry.next.prev = linkedListEntry
      if (overwrittenEntry.next.predecessor === overwrittenEntry.uuidv7) {
        moveEntryToPredecessor(overwrittenEntry.next, linkedListEntry.uuidv7)
      }
    }
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)

    overwrittenEntry.next = undefined
    overwrittenEntry.prev = undefined
    crListReplica.tombstones.add(overwrittenEntry.uuidv7)
    void deleteEntryFromMaps<T>(crListReplica, overwrittenEntry)
    crListReplica.cursor = linkedListEntry
    crListReplica.size = crListReplica.parentMap.size
    return
  }

  void walkToIndex<T>(listIndex, crListReplica)
  if (!crListReplica.cursor) return

  switch (mode) {
    case 'after': {
      const target = crListReplica.cursor
      const next = crListReplica.cursor.next
      linkedListEntry.index = crListReplica.cursor.index + 1
      linkedListEntry.predecessor = crListReplica.cursor.uuidv7
      linkedListEntry.prev = crListReplica.cursor
      linkedListEntry.next = next
      crListReplica.cursor.next = linkedListEntry
      if (next) {
        next.prev = linkedListEntry
        if (next.predecessor === target.uuidv7) {
          moveEntryToPredecessor(next, linkedListEntry.uuidv7)
        }
      }
      let current = linkedListEntry.next
      while (current) {
        current.index++
        current = current.next
      }
      void updateEntryToMaps<T>(crListReplica, linkedListEntry)
      crListReplica.cursor = linkedListEntry
      break
    }
    case 'before': {
      const target = crListReplica.cursor
      const prev = crListReplica.cursor.prev
      const predecessor = prev?.uuidv7 ?? '\0'
      linkedListEntry.index = crListReplica.cursor.index
      linkedListEntry.predecessor = predecessor
      linkedListEntry.prev = prev
      linkedListEntry.next = crListReplica.cursor
      if (prev) prev.next = linkedListEntry
      crListReplica.cursor.prev = linkedListEntry
      if (target.predecessor === predecessor) {
        moveEntryToPredecessor(target, linkedListEntry.uuidv7)
      }
      let current = linkedListEntry.next
      while (current) {
        current.index++
        current = current.next
      }
      void updateEntryToMaps<T>(crListReplica, linkedListEntry)
      crListReplica.cursor = linkedListEntry
      break
    }
  }
  crListReplica.size = crListReplica.parentMap.size
}
