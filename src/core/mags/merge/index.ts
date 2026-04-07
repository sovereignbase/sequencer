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
} from '../../../.helpers/index.js'
import { prototype, isUuidV7 } from '@sovereignbase/utils'

/**
 * Time complexity: O(n log n + v + tk + c), worst case O(n log n + n^2 + c)
 * - n = replica value entry count after merge
 * - v = delta value entry count
 * - t = delta tombstone count
 * - k = sibling bucket size when deleted entries are removed from buckets
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
      const siblings = crListReplica.childrenMap.get(existingEntry.predecessor)
      const siblingIndex = siblings?.indexOf(existingEntry) ?? -1
      if (siblings && siblingIndex !== -1) siblings.splice(siblingIndex, 1)
      existingEntry.predecessor = valueEntry.predecessor
      void updateEntryToMaps<T>(crListReplica, existingEntry)
      void newVals.push(existingEntry)
      continue
    }
    const linkedListEntry = snapshotValueToLinkedListValue<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    void newVals.push(linkedListEntry)
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)
  }
  //**flatten tree in to doubly linked list */
  void flattenAndLinkTrustedState<T>(crListReplica)
  //**write indices*/
  void assertListIndices<T>(crListReplica)

  if (newTombsIndices.length === 0 && newVals.length === 0) return false

  for (const index of newTombsIndices) {
    change[index] = undefined
  }
  for (const val of newVals) {
    change[val.index] = val.value
  }

  return change
}
