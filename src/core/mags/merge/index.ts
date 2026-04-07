import type {
  CRListChange,
  CRListDelta,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'
import {
  snapshotValueToLinkedListValue,
  updateEntryToMaps,
  flattenAndLinkTrustedState,
  assertListIndices,
  deleteLinkedEntry,
  moveEntryToPredecessor,
} from '../../../.helpers/index.js'
import { prototype, isUuidV7 } from '@sovereignbase/utils'

/**
 * Time complexity: O(v + t + c) for tail-append deltas; otherwise O(n log n + v + t + m*k + c)
 * Worst case: O(n log n + (v + t)n + c)
 * - n = replica value entry count after merge
 * - v = delta value entry count
 * - t = delta tombstone count
 * - m = entries moved between predecessor buckets
 * - k = sibling bucket size when entries are removed from buckets
 * - c = cloned delta value payload size
 *
 * Space complexity: O(n + v + t + c)
 */
export function __merge<T>(
  crListReplica: CRListReplica<T>,
  crListDelta: CRListDelta<T>
): CRListChange<T> | false {
  if (!crListDelta || prototype(crListDelta) !== 'record') return false
  const newVals: Array<NonNullable<DoublyLinkedListEntry<T>>> = []
  const newTombsIndices: Array<number> = []
  const change: CRListChange<T> = {}
  let needsRelink = false

  /**Fill tombstones entry(s)*/
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
        void newTombsIndices.push(linkedListEntry.index)
        void deleteLinkedEntry<T>(crListReplica, linkedListEntry)
        needsRelink = true
      }
    }
  }

  /**Fill values entry(s)*/
  if (
    !Object.hasOwn(crListDelta, 'values') ||
    !Array.isArray(crListDelta.values)
  ) {
    if (newTombsIndices.length === 0) return false
    void assertListIndices<T>(crListReplica)
    for (const index of newTombsIndices) {
      change[index] = undefined
    }
    return change
  }
  //**attach valid ones to tree*/
  for (const valueEntry of crListDelta.values) {
    const existingEntry = crListReplica.parentMap.get(valueEntry.uuidv7)
    if (existingEntry) {
      if (
        crListReplica.tombstones.has(valueEntry.uuidv7) ||
        (!isUuidV7(valueEntry.predecessor) && valueEntry.predecessor !== '\0')
      )
        continue
      if (existingEntry.predecessor >= valueEntry.predecessor) continue
      void moveEntryToPredecessor<T>(
        crListReplica,
        existingEntry,
        valueEntry.predecessor
      )
      needsRelink = true
      void newVals.push(existingEntry)
      continue
    }
    const linkedListEntry = snapshotValueToLinkedListValue<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    const predecessor =
      linkedListEntry.predecessor === '\0'
        ? undefined
        : crListReplica.parentMap.get(linkedListEntry.predecessor)
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)
    void newVals.push(linkedListEntry)
    if (!needsRelink && linkedListEntry.predecessor === '\0') {
      if (crListReplica.size === 0) {
        crListReplica.cursor = linkedListEntry
        crListReplica.size = crListReplica.parentMap.size
      } else {
        needsRelink = true
      }
    } else if (!needsRelink && predecessor && !predecessor.next) {
      linkedListEntry.prev = predecessor
      linkedListEntry.index = predecessor.index + 1
      predecessor.next = linkedListEntry
      crListReplica.cursor = linkedListEntry
      crListReplica.size = crListReplica.parentMap.size
    } else {
      needsRelink = true
    }
  }
  if (needsRelink) {
    //**flatten tree in to doubly linked list */
    void flattenAndLinkTrustedState<T>(crListReplica)
    //**write indices*/
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
