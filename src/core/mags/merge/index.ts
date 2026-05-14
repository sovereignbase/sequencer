import type {
  CRListChange,
  CRListDelta,
  CRListSnapshotEntry,
  CRListState,
  CRListStateEntry,
} from '../../../.types/index.js'
import {
  transformSnapshotEntryToStateEntry,
  updateEntryToMaps,
  flattenAndLinkTrustedState,
  assertListIndices,
  deleteLinkedEntry,
  moveEntryToPredecessor,
} from '../../../.helpers/index.js'
import { prototype, isUuidV7 } from '@sovereignbase/utils'

/**
 * Merges a remote CRList delta into the local replica.
 *
 * Accepted tombstones update the local live view and accepted values are attached
 * to the predecessor tree. Tail-append deltas are linked incrementally; deltas
 * that can affect ordering fall back to deterministic relinking.
 *
 * @param crListReplica - Replica to mutate.
 * @param crListDelta - Remote gossip delta.
 * @returns - A minimal local change patch, or `false` when the delta is ignored.
 *
 * Time complexity: O(v + t + c) for tail-append deltas; O(n + t + qk) for tombstone-only deletes; otherwise O(n log n + v + t + m*k + c)
 * Worst case: O(n^2 + (v + t)n + c)
 * - n = replica value entry count after merge
 * - v = delta value entry count
 * - t = delta tombstone count
 * - q = amount of live entries deleted by tombstones
 * - m = entries moved between predecessor buckets
 * - k = sibling bucket size when entries are removed from buckets
 * - c = cloned delta value payload size
 *
 * Space complexity: O(n + v + t + c)
 */
export function __merge<T>(
  crListReplica: CRListState<T>,
  crListDelta: CRListDelta<T>
): CRListChange<T> | false {
  if (!crListDelta || prototype(crListDelta) !== 'record') return false
  const newVals: Array<NonNullable<CRListStateEntry<T>>> = []
  const newTombsIndices: Array<number> = []
  const change: CRListChange<T> = {}
  const deferredMoves: Array<CRListSnapshotEntry<T>> = []
  let needsRelink = false
  if (
    Object.hasOwn(crListDelta, 'values') &&
    Array.isArray(crListDelta.values) &&
    crListDelta.values.length === 1 &&
    (!Object.hasOwn(crListDelta, 'tombstones') ||
      (Array.isArray(crListDelta.tombstones) &&
        crListDelta.tombstones.length === 0))
  ) {
    const linkedListEntry = transformSnapshotEntryToStateEntry<T>(
      crListDelta.values[0],
      crListReplica
    )
    if (!linkedListEntry) return false
    const predecessor =
      linkedListEntry.predecessor === '\0'
        ? undefined
        : crListReplica.parentMap.get(linkedListEntry.predecessor)
    if (
      (linkedListEntry.predecessor === '\0' && crListReplica.size === 0) ||
      (predecessor && !predecessor.next)
    ) {
      linkedListEntry.prev = predecessor
      linkedListEntry.index = crListReplica.size
      if (predecessor) predecessor.next = linkedListEntry
      crListReplica.cursor = linkedListEntry
      crListReplica.cursorIndex = linkedListEntry.index
      void updateEntryToMaps<T>(crListReplica, linkedListEntry)
      crListReplica.size = crListReplica.parentMap.size
      crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
      return { [linkedListEntry.index]: linkedListEntry.value }
    }
  }

  /** Apply tombstone entries. */
  if (
    Object.hasOwn(crListDelta, 'tombstones') &&
    Array.isArray(crListDelta.tombstones)
  ) {
    for (const tombstone of crListDelta.tombstones) {
      if (crListReplica.tombstones.has(tombstone) || !isUuidV7(tombstone))
        continue
      crListReplica.tombstones.add(tombstone)
      const linkedListEntry = crListReplica.parentMap.get(tombstone)
      if (linkedListEntry) {
        const removedIndex = linkedListEntry.index
        const cursorIndex = crListReplica.cursorIndex
        const next = linkedListEntry.next
        const prev = linkedListEntry.prev
        const removedCursor = crListReplica.cursor === linkedListEntry
        void newTombsIndices.push(removedIndex)
        crListReplica.index?.delete(linkedListEntry.index)
        void deleteLinkedEntry<T>(crListReplica, linkedListEntry)
        if (!crListReplica.cursor) {
          crListReplica.cursorIndex = undefined
        } else if (removedCursor) {
          crListReplica.cursorIndex = next
            ? removedIndex
            : prev
              ? removedIndex - 1
              : undefined
        } else if (cursorIndex !== undefined && removedIndex < cursorIndex) {
          crListReplica.cursorIndex = cursorIndex - 1
        }
        crListReplica.index = new Map()
        if (crListReplica.cursor && crListReplica.cursorIndex !== undefined)
          crListReplica.index.set(crListReplica.cursorIndex, crListReplica.cursor)
      }
    }
  }

  /** Apply value entries. */
  if (
    !Object.hasOwn(crListDelta, 'values') ||
    !Array.isArray(crListDelta.values)
  ) {
    if (newTombsIndices.length === 0) return false
    for (const index of newTombsIndices) {
      change[index] = undefined
    }
    return change
  }
  // Attach accepted values to the predecessor tree.
  for (const valueEntry of crListDelta.values) {
    if (valueEntry === null || valueEntry === undefined) continue
    const existingEntry = crListReplica.parentMap.get(valueEntry.uuidv7)
    if (existingEntry) {
      if (
        crListReplica.tombstones.has(valueEntry.uuidv7) ||
        (!isUuidV7(valueEntry.predecessor) && valueEntry.predecessor !== '\0')
      )
        continue
      if (existingEntry.predecessor >= valueEntry.predecessor) continue
      if (
        valueEntry.predecessor !== '\0' &&
        !crListReplica.parentMap.has(valueEntry.predecessor) &&
        crListDelta.values.some(
          (entry) => entry?.uuidv7 === valueEntry.predecessor
        )
      ) {
        deferredMoves.push(valueEntry)
        continue
      }
      void moveEntryToPredecessor<T>(
        crListReplica,
        existingEntry,
        valueEntry.predecessor
      )
      if (existingEntry.prev?.uuidv7 !== valueEntry.predecessor)
        needsRelink = true
      continue
    }
    const linkedListEntry = transformSnapshotEntryToStateEntry<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    const predecessor =
      linkedListEntry.predecessor === '\0'
        ? undefined
        : crListReplica.parentMap.get(linkedListEntry.predecessor)
    const next = predecessor?.next
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)
    void newVals.push(linkedListEntry)
    if (!needsRelink && linkedListEntry.predecessor === '\0') {
      if (crListReplica.size === 0) {
        crListReplica.cursor = linkedListEntry
        crListReplica.cursorIndex = linkedListEntry.index
        crListReplica.size = crListReplica.parentMap.size
        crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
      } else {
        let head = crListReplica.index?.get(0) ?? crListReplica.cursor
        while (head?.prev) head = head.prev
        if (
          head &&
          crListDelta.values.some(
            (entry) =>
              entry?.uuidv7 === head.uuidv7 &&
              entry.predecessor === linkedListEntry.uuidv7
          )
        ) {
          linkedListEntry.index = 0
          linkedListEntry.next = head
          head.prev = linkedListEntry
          crListReplica.cursor = linkedListEntry
          crListReplica.cursorIndex = linkedListEntry.index
          crListReplica.size = crListReplica.parentMap.size
          crListReplica.index = new Map([[linkedListEntry.index, linkedListEntry]])
        } else {
          needsRelink = true
        }
      }
    } else if (
      !needsRelink &&
      predecessor &&
      next &&
      crListReplica.childrenMap.get(linkedListEntry.predecessor)?.length === 1
    ) {
      linkedListEntry.index = predecessor.index + 1
      linkedListEntry.prev = predecessor
      linkedListEntry.next = next
      predecessor.next = linkedListEntry
      next.prev = linkedListEntry
      crListReplica.cursor = linkedListEntry
      crListReplica.cursorIndex = linkedListEntry.index
      crListReplica.size = crListReplica.parentMap.size
      crListReplica.index = new Map([[linkedListEntry.index, linkedListEntry]])
    } else if (!needsRelink && predecessor && !predecessor.next) {
      linkedListEntry.prev = predecessor
      linkedListEntry.index = crListReplica.size
      predecessor.next = linkedListEntry
      crListReplica.cursor = linkedListEntry
      crListReplica.cursorIndex = linkedListEntry.index
      crListReplica.size = crListReplica.parentMap.size
      crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
    } else if (
      !needsRelink &&
      predecessor &&
      next &&
      crListDelta.values.some(
        (entry) =>
          entry?.uuidv7 === next.uuidv7 &&
          entry.predecessor === linkedListEntry.uuidv7
      )
    ) {
      linkedListEntry.index = predecessor.index + 1
      linkedListEntry.prev = predecessor
      linkedListEntry.next = next
      predecessor.next = linkedListEntry
      next.prev = linkedListEntry
      crListReplica.cursor = linkedListEntry
      crListReplica.cursorIndex = linkedListEntry.index
      crListReplica.size = crListReplica.parentMap.size
      crListReplica.index = new Map([[linkedListEntry.index, linkedListEntry]])
      } else {
        needsRelink = true
      }
  }
  for (const valueEntry of deferredMoves) {
    const existingEntry = crListReplica.parentMap.get(valueEntry.uuidv7)
    if (!existingEntry || !crListReplica.parentMap.has(valueEntry.predecessor))
      continue
    if (existingEntry.predecessor >= valueEntry.predecessor) continue
    void moveEntryToPredecessor<T>(
      crListReplica,
      existingEntry,
      valueEntry.predecessor
    )
    if (existingEntry.prev?.uuidv7 !== valueEntry.predecessor)
      needsRelink = true
  }
  if (needsRelink) {
    // Flatten tree into a doubly linked list.
    void flattenAndLinkTrustedState<T>(crListReplica)
    // Write live-view indexes.
    void assertListIndices<T>(crListReplica)
  }

  if (newTombsIndices.length === 0 && newVals.length === 0) return false

  for (const index of newTombsIndices) {
    change[index] = undefined
  }
  for (const val of newVals) {
    change[val.index] = val.value
  }

  return change
}
