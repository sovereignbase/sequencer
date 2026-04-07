import { CRListError } from '../../../.errors/class.js'
import { safeStructuredClone } from '@sovereignbase/utils'
import {
  updateEntryToMaps,
  deleteEntryFromMaps,
  walkToIndex,
  moveEntryToPredecessor,
} from '../../../.helpers/index.js'
import { v7 as uuidv7 } from 'uuid'
import {
  CRListChange,
  CRListDelta,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'
/**
 * Time complexity: O(d + r + k + c), worst case O(n + c)
 * - d = distance from cursor to target index
 * - r = amount of nodes after the inserted node whose indexes must be shifted
 * - k = sibling bucket size when predecessor bucket is updated
 * - c = cloned value payload size
 *
 * Space complexity: O(c)
 */
export function __update<T>(
  listIndex: number,
  listValue: T,
  crListReplica: CRListReplica<T>,
  mode: 'overwrite' | 'before' | 'after'
): { change: CRListChange<T>; delta: CRListDelta<T> } | false {
  if (listIndex < 0 || listIndex > crListReplica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS')

  const result: { change: CRListChange<T>; delta: CRListDelta<T> } = {
    change: {},
    delta: { values: [], tombstones: [] },
  }

  const [cloned, copiedValue] = safeStructuredClone(listValue)

  if (!cloned) throw new CRListError('VALUE_NOT_CLONEABLE')

  const v7 = uuidv7()

  const linkedListEntry: NonNullable<DoublyLinkedListEntry<T>> = {
    uuidv7: v7,
    value: copiedValue,
    predecessor: '\0',
    index: 0,
    next: undefined,
    prev: undefined,
  }

  switch (mode) {
    case 'overwrite': {
      void walkToIndex<T>(listIndex, crListReplica)
      if (!crListReplica.cursor) return false
      const entryToOverwrite = crListReplica.cursor

      linkedListEntry.predecessor = entryToOverwrite.predecessor
      linkedListEntry.index = entryToOverwrite.index
      linkedListEntry.next = entryToOverwrite.next
      linkedListEntry.prev = entryToOverwrite.prev
      if (entryToOverwrite.prev) entryToOverwrite.prev.next = linkedListEntry
      if (entryToOverwrite.next) {
        entryToOverwrite.next.prev = linkedListEntry
        if (entryToOverwrite.next.predecessor === entryToOverwrite.uuidv7) {
          void moveEntryToPredecessor<T>(
            crListReplica,
            entryToOverwrite.next,
            linkedListEntry.uuidv7,
            result.delta
          )
        }
      }
      void updateEntryToMaps<T>(crListReplica, linkedListEntry, result.delta)
      crListReplica.tombstones.add(entryToOverwrite.uuidv7)
      result.delta.tombstones?.push(entryToOverwrite.uuidv7)
      void deleteEntryFromMaps<T>(crListReplica, entryToOverwrite)
      entryToOverwrite.next = undefined
      entryToOverwrite.prev = undefined
      crListReplica.cursor = linkedListEntry
      crListReplica.size = crListReplica.parentMap.size
      break
    }
    case 'after': {
      if (crListReplica.size === 0 && listIndex === 0) {
        crListReplica.cursor = linkedListEntry
        void updateEntryToMaps<T>(crListReplica, linkedListEntry, result.delta)
        crListReplica.size = crListReplica.parentMap.size
        break
      }
      if (listIndex === crListReplica.size) {
        void walkToIndex<T>(crListReplica.size - 1, crListReplica)
      } else {
        void walkToIndex<T>(listIndex, crListReplica)
      }
      if (!crListReplica.cursor) return false
      const next =
        listIndex === crListReplica.size ? undefined : crListReplica.cursor.next
      linkedListEntry.index = crListReplica.cursor.index + 1
      linkedListEntry.predecessor = crListReplica.cursor.uuidv7
      linkedListEntry.next = next
      linkedListEntry.prev = crListReplica.cursor
      crListReplica.cursor.next = linkedListEntry
      if (next) {
        next.prev = linkedListEntry
        if (next.predecessor === crListReplica.cursor.uuidv7) {
          void moveEntryToPredecessor<T>(
            crListReplica,
            next,
            linkedListEntry.uuidv7,
            result.delta
          )
        }
      }
      void updateEntryToMaps<T>(crListReplica, linkedListEntry, result.delta)
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
      if (crListReplica.size === 0 && listIndex === 0) {
        crListReplica.cursor = linkedListEntry
        void updateEntryToMaps<T>(crListReplica, linkedListEntry, result.delta)
        crListReplica.size = crListReplica.parentMap.size
        break
      }
      void walkToIndex<T>(listIndex, crListReplica)
      if (!crListReplica.cursor) return false
      const prev = crListReplica.cursor.prev
      linkedListEntry.index = crListReplica.cursor.index
      linkedListEntry.predecessor = prev?.uuidv7 ?? '\0'
      linkedListEntry.next = crListReplica.cursor
      linkedListEntry.prev = prev
      if (prev) prev.next = linkedListEntry
      crListReplica.cursor.prev = linkedListEntry
      if (crListReplica.cursor.predecessor === linkedListEntry.predecessor) {
        void moveEntryToPredecessor<T>(
          crListReplica,
          crListReplica.cursor,
          linkedListEntry.uuidv7,
          result.delta
        )
      }
      void updateEntryToMaps<T>(crListReplica, linkedListEntry, result.delta)
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
  result.change[linkedListEntry.index] = linkedListEntry.value
  return result
}
