import { CRListError } from '../../../.errors/class.js'
import {
  attachEntryToIndexes,
  detachEntryFromIndexes,
  seekCursorToIndex,
  moveEntryToPredecessor,
  linkEntryBetween,
} from '../../../.helpers/index.js'
import { v7 as uuidv7 } from 'uuid'
import {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../../.types/index.js'
/**
 * Applies a local value mutation to the replica live view.
 *
 * The update can replace a range starting at the target entry, insert values
 * before it, or insert values after it. The returned delta is suitable for
 * gossip and the returned change describes the local live-view patch.
 *
 * @param listIndex - Target index in the live list.
 * @param listValues - Values to insert or overwrite.
 * @param crListReplica - Replica to mutate.
 * @param mode - Mutation mode relative to `listIndex`.
 * @returns - A local change and gossip delta, or `false` if no mutation occurred.
 *
 * Time complexity: O(d + v + r + vk), worst case O(vn)
 * - d = distance from cursor to target index
 * - v = amount of input values
 * - r = amount of nodes after inserted values whose indexes must be shifted
 * - k = sibling bucket size when predecessor bucket is updated
 *
 * Space complexity: O(v)
 */
export function __update<T>(
  listIndex: number,
  listValues: Array<T>,
  crListReplica: CRListState<T>,
  mode: 'overwrite' | 'before' | 'after'
): { change: CRListChange<T>; delta: CRListDelta<T> } | false {
  if (listIndex < 0 || listIndex > crListReplica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS')
  if (!Array.isArray(listValues))
    throw new CRListError(
      'UPDATE_EXPECTED_AN_ARRAY',
      '`listValues` must be an Array'
    )
  if (listValues.length === 0) return false
  const change: CRListChange<T> = {}
  const delta: CRListDelta<T> = { values: [], tombstones: [] }
  for (const listValue of listValues) {
    const v7 = uuidv7()

    const linkedListEntry: NonNullable<CRListStateEntry<T>> = {
      uuidv7: v7,
      value: listValue,
      predecessor: '\0',
      index: 0,
      next: undefined,
      prev: undefined,
    }

    switch (mode) {
      case 'overwrite': {
        if (listIndex === crListReplica.size) {
          if (crListReplica.size === 0) {
            crListReplica.cursor = linkedListEntry
            crListReplica.cursorIndex = linkedListEntry.index
            void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
            crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
            change[linkedListEntry.index] = linkedListEntry.value
            break
          }
          void seekCursorToIndex<T>(crListReplica.size - 1, crListReplica)
          if (!crListReplica.cursor) return false
          linkedListEntry.index = (crListReplica.cursorIndex ?? 0) + 1
          linkedListEntry.predecessor = crListReplica.cursor.uuidv7
          void linkEntryBetween<T>(
            crListReplica.cursor,
            linkedListEntry,
            undefined
          )
          void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
          crListReplica.cursor = linkedListEntry
          crListReplica.cursorIndex = linkedListEntry.index
          void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
          change[linkedListEntry.index] = linkedListEntry.value
          break
        }
        void seekCursorToIndex<T>(listIndex, crListReplica)
        if (!crListReplica.cursor) return false
        const entryToOverwrite = crListReplica.cursor
        const actualIndex = crListReplica.cursorIndex ?? listIndex

        linkedListEntry.predecessor = entryToOverwrite.predecessor
        linkedListEntry.index = actualIndex
        void linkEntryBetween<T>(
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
        void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
        void crListReplica.tombstones.add(entryToOverwrite.uuidv7)
        void delta.tombstones?.push(entryToOverwrite.uuidv7)
        void detachEntryFromIndexes<T>(crListReplica, entryToOverwrite)
        entryToOverwrite.next = undefined
        entryToOverwrite.prev = undefined
        crListReplica.cursor = linkedListEntry
        crListReplica.cursorIndex = actualIndex
        void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
        change[actualIndex] = linkedListEntry.value
        break
      }
      case 'after': {
        if (crListReplica.size === 0 && listIndex === 0) {
          crListReplica.cursor = linkedListEntry
          crListReplica.cursorIndex = linkedListEntry.index
          void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
          void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
          change[linkedListEntry.index] = linkedListEntry.value
          break
        }
        if (listIndex === crListReplica.size) {
          void seekCursorToIndex<T>(crListReplica.size - 1, crListReplica)
        } else {
          void seekCursorToIndex<T>(listIndex, crListReplica)
        }
        if (!crListReplica.cursor) return false
        const actualIndex = crListReplica.cursorIndex ?? listIndex
        const next =
          listIndex === crListReplica.size
            ? undefined
            : crListReplica.cursor.next
        linkedListEntry.index = actualIndex + 1
        linkedListEntry.predecessor = crListReplica.cursor.uuidv7
        void linkEntryBetween<T>(crListReplica.cursor, linkedListEntry, next)
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
        void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
        crListReplica.cursor = linkedListEntry
        crListReplica.cursorIndex = linkedListEntry.index
        if (next) crListReplica.index = new Map()
        void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
        change[linkedListEntry.index] = linkedListEntry.value
        break
      }
      case 'before': {
        if (crListReplica.size === 0 && listIndex === 0) {
          crListReplica.cursor = linkedListEntry
          crListReplica.cursorIndex = linkedListEntry.index
          void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
          void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
          change[linkedListEntry.index] = linkedListEntry.value
          mode = 'after'
          listIndex = linkedListEntry.index - 1
          break
        }
        void seekCursorToIndex<T>(listIndex, crListReplica)
        if (!crListReplica.cursor) return false
        const actualIndex = crListReplica.cursorIndex ?? listIndex
        const prev = crListReplica.cursor.prev
        linkedListEntry.index = actualIndex
        linkedListEntry.predecessor = prev?.uuidv7 ?? '\0'
        void linkEntryBetween<T>(prev, linkedListEntry, crListReplica.cursor)
        if (crListReplica.cursor.predecessor === linkedListEntry.predecessor) {
          void moveEntryToPredecessor<T>(
            crListReplica,
            crListReplica.cursor,
            linkedListEntry.uuidv7,
            delta
          )
        }
        void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
        crListReplica.cursor = linkedListEntry
        crListReplica.cursorIndex = actualIndex
        crListReplica.index = new Map()
        void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
        change[actualIndex] = linkedListEntry.value
        mode = 'after'
        listIndex = linkedListEntry.index - 1

        break
      }
    }
    crListReplica.size = crListReplica.parentMap.size
    listIndex++
  }
  return { change, delta }
}
