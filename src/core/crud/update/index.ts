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

  const v7 = uuidv7()

  const linkedListEntry: NonNullable<DoublyLinkedListEntry<T>> = {
    uuidv7: v7,
    value: copiedValue,
    predecessor: '\n',
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

    linkedListEntry.predecessor = crListReplica.cursor.predecessor
    linkedListEntry.index = crListReplica.cursor.index
    linkedListEntry.next = crListReplica.cursor.next
    linkedListEntry.prev = crListReplica.cursor.prev
    if (crListReplica.cursor.prev)
      crListReplica.cursor.prev.next = linkedListEntry
    if (crListReplica.cursor.next)
      crListReplica.cursor.next.prev = linkedListEntry
    void updateEntryToMaps<T>(crListReplica, crListReplica.cursor)

    crListReplica.cursor.next = undefined
    crListReplica.cursor.prev = undefined
    crListReplica.tombstones.add(crListReplica.cursor.uuidv7)
    void deleteEntryFromMaps<T>(crListReplica, crListReplica.cursor)
    crListReplica.size = crListReplica.parentMap.size
    return
  }

  if (listIndex !== crListReplica.size) {
    void walkToIndex<T>(listIndex, crListReplica)
    if (!crListReplica.cursor) return
    linkedListEntry.index = listIndex

    switch (mode) {
      case 'after': {
        const thisNext = crListReplica.cursor.next
        linkedListEntry.index = crListReplica.cursor.index + 1
        linkedListEntry.predecessor = crListReplica.cursor.uuidv7
        linkedListEntry.next = thisNext
        linkedListEntry.prev = crListReplica.cursor
        crListReplica.cursor.next = linkedListEntry
        if (thisNext) thisNext.prev = linkedListEntry
        void updateEntryToMaps<T>(crListReplica, linkedListEntry)
        crListReplica.cursor = linkedListEntry
        let cursor: DoublyLinkedListEntry<T> = linkedListEntry.next
        while (cursor) {
          cursor.index++
          cursor = cursor.next
        }
        crListReplica.size = crListReplica.parentMap.size
        break
      }
      case 'before': {
        const thisPrev = crListReplica.cursor.prev
        linkedListEntry.index = crListReplica.cursor.index
        linkedListEntry.predecessor = thisPrev?.uuidv7 ?? '\0'
        linkedListEntry.next = crListReplica.cursor
        linkedListEntry.prev = thisPrev
        if (thisPrev) thisPrev.next = linkedListEntry
        crListReplica.cursor.prev = linkedListEntry
        void updateEntryToMaps<T>(crListReplica, linkedListEntry)
        crListReplica.cursor = linkedListEntry
        let cursor: DoublyLinkedListEntry<T> = linkedListEntry.next
        while (cursor) {
          cursor.index++
          cursor = cursor.next
        }
        crListReplica.size = crListReplica.parentMap.size
        break
      }
    }
  }
}
