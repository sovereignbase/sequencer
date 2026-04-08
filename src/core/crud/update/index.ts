import { CRListError } from '../../../.errors/class.js'
import { safeStructuredClone } from '@sovereignbase/utils'
import {
  updateEntryToMaps,
  deleteEntryFromMaps,
  walkToIndex,
  moveEntryToPredecessor,
  insertBetween,
} from '../../../.helpers/index.js'
import { v7 as uuidv7 } from 'uuid'
import {
  CRListDelta,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'
/**
 * Applies a local value mutation to the replica live view.
 *
 * The update can replace the target entry, insert before it, or insert after it.
 * The returned delta is suitable for gossip. Local callers already know the
 * requested mutation and can patch their own live view from that context.
 *
 * @param listIndex Target index in the live list.
 * @param listValues Value to insert or overwrite.
 * @param crListReplica Replica to mutate.
 * @param mode Mutation mode relative to `listIndex`.
 * @returns A gossip delta, or `false` if no mutation occurred.
 *
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
  listValues: Array<T>,
  crListReplica: CRListReplica<T>,
  mode: 'overwrite' | 'before' | 'after'
): CRListDelta<T> | false {
  if (listIndex < 0 || listIndex > crListReplica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS')
  if (!Array.isArray(listValues))
    throw new CRListError(
      'UPDATE_EXPECTED_AN_ARRAY',
      '`listValues` must be an Array'
    )
  if (listValues.length === 0) return false
  const delta: CRListDelta<T> = { values: [], tombstones: [] }
  let shiftCursor: DoublyLinkedListEntry<T>
  for (const listValue of listValues) {
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
        if (listIndex === crListReplica.size) {
          void walkToIndex<T>(crListReplica.size - 1, crListReplica)
          if (!crListReplica.cursor) return false
          linkedListEntry.index = crListReplica.cursor.index + 1
          linkedListEntry.predecessor = crListReplica.cursor.uuidv7
          insertBetween<T>(crListReplica.cursor, linkedListEntry, undefined)
          void updateEntryToMaps<T>(crListReplica, linkedListEntry, delta)
          crListReplica.cursor = linkedListEntry
          crListReplica.size = crListReplica.parentMap.size
          break
        }
        void walkToIndex<T>(listIndex, crListReplica)
        if (!crListReplica.cursor) return false
        const entryToOverwrite = crListReplica.cursor

        linkedListEntry.predecessor = entryToOverwrite.predecessor
        linkedListEntry.index = entryToOverwrite.index
        insertBetween<T>(
          entryToOverwrite.prev,
          linkedListEntry,
          entryToOverwrite.next
        )
        if (entryToOverwrite.next) {
          if (entryToOverwrite.next.predecessor === entryToOverwrite.uuidv7) {
            void moveEntryToPredecessor<T>(
              crListReplica,
              entryToOverwrite.next,
              linkedListEntry.uuidv7,
              delta
            )
          }
        }
        void updateEntryToMaps<T>(crListReplica, linkedListEntry, delta)
        crListReplica.tombstones.add(entryToOverwrite.uuidv7)
        delta.tombstones?.push(entryToOverwrite.uuidv7)
        void deleteEntryFromMaps<T>(crListReplica, entryToOverwrite)
        entryToOverwrite.next = undefined
        entryToOverwrite.prev = undefined
        crListReplica.cursor = linkedListEntry
        break
      }
      case 'after': {
        if (crListReplica.size === 0 && listIndex === 0) {
          crListReplica.cursor = linkedListEntry
          void updateEntryToMaps<T>(crListReplica, linkedListEntry, delta)
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
          listIndex === crListReplica.size
            ? undefined
            : crListReplica.cursor.next
        shiftCursor = next
        linkedListEntry.index = crListReplica.cursor.index + 1
        linkedListEntry.predecessor = crListReplica.cursor.uuidv7
        insertBetween<T>(crListReplica.cursor, linkedListEntry, next)
        if (next) {
          if (next.predecessor === crListReplica.cursor.uuidv7) {
            void moveEntryToPredecessor<T>(
              crListReplica,
              next,
              linkedListEntry.uuidv7,
              delta
            )
          }
        }
        void updateEntryToMaps<T>(crListReplica, linkedListEntry, delta)
        crListReplica.cursor = linkedListEntry
        break
      }
      case 'before': {
        if (crListReplica.size === 0 && listIndex === 0) {
          crListReplica.cursor = linkedListEntry
          void updateEntryToMaps<T>(crListReplica, linkedListEntry, delta)
          crListReplica.size = crListReplica.parentMap.size
          break
        }
        void walkToIndex<T>(listIndex, crListReplica)
        if (!crListReplica.cursor) return false
        const prev = crListReplica.cursor.prev
        shiftCursor = crListReplica.cursor
        linkedListEntry.index = crListReplica.cursor.index
        linkedListEntry.predecessor = prev?.uuidv7 ?? '\0'
        insertBetween<T>(prev, linkedListEntry, crListReplica.cursor)
        if (crListReplica.cursor.predecessor === linkedListEntry.predecessor) {
          void moveEntryToPredecessor<T>(
            crListReplica,
            crListReplica.cursor,
            linkedListEntry.uuidv7,
            delta
          )
        }
        void updateEntryToMaps<T>(crListReplica, linkedListEntry, delta)
        crListReplica.cursor = linkedListEntry

        break
      }
    }
    listIndex++
  }
  if (mode !== 'overwrite')
    while (shiftCursor) {
      shiftCursor.index += listValues.length
      shiftCursor = shiftCursor.next
    }
  crListReplica.size = crListReplica.parentMap.size
  return delta
}
