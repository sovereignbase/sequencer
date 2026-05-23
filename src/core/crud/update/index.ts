import { CRListError } from '../../../.errors/class.js'
import {
  attachEntryToIndexes,
  detachEntryFromIndexes,
  seekCursorToIndex,
  linkEntryBetween,
  deriveRunUuid,
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
  let displacedEntry: NonNullable<CRListStateEntry<T>> | undefined
  const batchEntries: Array<NonNullable<CRListStateEntry<T>>> = []
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
        if (entryToOverwrite.next?.predecessor === entryToOverwrite.uuidv7) {
          const overwriteNext = entryToOverwrite.next
          const owSibs = crListReplica.childrenMap.get(
            overwriteNext.predecessor
          )
          if (owSibs) {
            const i = owSibs.indexOf(overwriteNext)
            if (i !== -1) owSibs.splice(i, 1)
          }
          overwriteNext.predecessor = linkedListEntry.uuidv7
          const newSibs = crListReplica.childrenMap.get(linkedListEntry.uuidv7)
          if (newSibs) newSibs.push(overwriteNext)
          else
            crListReplica.childrenMap.set(linkedListEntry.uuidv7, [
              overwriteNext,
            ])
          delta.values?.push({
            uuidv7: overwriteNext.uuidv7,
            value: overwriteNext.value,
            predecessor: overwriteNext.predecessor,
          })
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
        if (next && next.predecessor === crListReplica.cursor.uuidv7) {
          if (!displacedEntry) {
            displacedEntry = next
            const sibs = crListReplica.childrenMap.get(next.predecessor)
            if (sibs) {
              const i = sibs.indexOf(next)
              if (i !== -1) sibs.splice(i, 1)
            }
          }
          displacedEntry.predecessor = linkedListEntry.uuidv7
        }
        void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
        crListReplica.cursor = linkedListEntry
        crListReplica.cursorIndex = linkedListEntry.index
        if (next) {
          if (crListReplica.index) crListReplica.index.clear()
          else crListReplica.index = new Map()
        }
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
          if (!displacedEntry) {
            displacedEntry = crListReplica.cursor
            const sibs = crListReplica.childrenMap.get(
              crListReplica.cursor.predecessor
            )
            if (sibs) {
              const i = sibs.indexOf(crListReplica.cursor)
              if (i !== -1) sibs.splice(i, 1)
            }
          }
          displacedEntry.predecessor = linkedListEntry.uuidv7
        }
        void attachEntryToIndexes<T>(crListReplica, linkedListEntry, delta)
        crListReplica.cursor = linkedListEntry
        crListReplica.cursorIndex = actualIndex
        if (crListReplica.index) crListReplica.index.clear()
        else crListReplica.index = new Map()
        void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
        change[actualIndex] = linkedListEntry.value
        mode = 'after'
        listIndex = linkedListEntry.index - 1

        break
      }
    }
    batchEntries.push(linkedListEntry)
    crListReplica.size = crListReplica.parentMap.size
    listIndex++
  }

  // Convert consecutive chain pairs to runNext, replacing singleton childrenMap
  // buckets with direct pointers. Saves N-1 array allocations per batch.
  if (batchEntries.length > 1) {
    for (let k = 0; k + 1 < batchEntries.length; k++) {
      const curr = batchEntries[k]
      const next = batchEntries[k + 1]
      if (next.predecessor !== curr.uuidv7) continue
      // The childrenMap bucket for curr.uuidv7 is always a singleton [next]
      // because curr is a fresh UUID — no other entry can share this predecessor.
      crListReplica.childrenMap.delete(curr.uuidv7)
      if (!crListReplica.runNext) crListReplica.runNext = new Map()
      crListReplica.runNext.set(curr.uuidv7, next)
    }
  }

  // Pack a consecutive run into a single delta entry when the generated UUIDs
  // are sequential (same millisecond — the common case for batch inserts).
  if (
    batchEntries.length > 1 &&
    delta.values &&
    delta.values.length >= batchEntries.length
  ) {
    const first = batchEntries[0]
    const last = batchEntries[batchEntries.length - 1]
    if (deriveRunUuid(first.uuidv7, batchEntries.length - 1) === last.uuidv7) {
      // Replace the N individual delta entries with one run entry.
      delta.values.splice(
        delta.values.length - batchEntries.length,
        batchEntries.length,
        {
          uuidv7: first.uuidv7,
          value: first.value,
          predecessor: first.predecessor,
          tail: batchEntries.slice(1).map((e) => e.value),
        }
      )
    }
  }

  if (displacedEntry) {
    const sibs = crListReplica.childrenMap.get(displacedEntry.predecessor)
    if (sibs) sibs.push(displacedEntry)
    else
      crListReplica.childrenMap.set(displacedEntry.predecessor, [
        displacedEntry,
      ])
    delta.values?.push({
      uuidv7: displacedEntry.uuidv7,
      value: displacedEntry.value,
      predecessor: displacedEntry.predecessor,
    })
  }
  return { change, delta }
}
