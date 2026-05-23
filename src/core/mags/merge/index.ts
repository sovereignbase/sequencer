import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../../.types/index.js'
import {
  materializeSnapshotEntry,
  attachEntryToIndexes,
  rebuildLiveProjection,
  rebuildLiveIndex,
  deleteLiveEntry,
  moveEntryToPredecessor,
} from '../../../.helpers/index.js'
import { prototype, isUuidV7 } from '@sovereignbase/utils'
import { trySpliceInsertedParent } from '../../../.helpers/trySpliceInsertedParent/index.js'

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
 * Time complexity: O(v + t) for tail-append deltas; O(n + t + qk) for tombstone-only deletes; otherwise O(n log n + v + t + m*k)
 * Worst case: O(n^2 + (v + t)n)
 * - n = replica value entry count after merge
 * - v = delta value entry count
 * - t = delta tombstone count
 * - q = amount of live entries deleted by tombstones
 * - m = entries moved between predecessor buckets
 * - k = sibling bucket size when entries are removed from buckets
 *
 * Space complexity: O(n + v + t)
 */
export function __merge<T>(
  crListReplica: CRListState<T>,
  crListDelta: CRListDelta<T>
): CRListChange<T> | false {
  if (!crListDelta || prototype(crListDelta) !== 'record') return false
  const newVals: Array<NonNullable<CRListStateEntry<T>>> = []
  const newTombsIndices: Array<number> = []
  const reparentedVals: Array<{
    entry: NonNullable<CRListStateEntry<T>>
    previousPredecessor: string
  }> = []
  const change: CRListChange<T> = {}
  let needsRelink = false
  if (
    Object.hasOwn(crListDelta, 'values') &&
    Array.isArray(crListDelta.values) &&
    crListDelta.values.length === 1 &&
    (!Object.hasOwn(crListDelta, 'tombstones') ||
      (Array.isArray(crListDelta.tombstones) &&
        crListDelta.tombstones.length === 0))
  ) {
    const linkedListEntry = materializeSnapshotEntry<T>(
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
      void attachEntryToIndexes<T>(crListReplica, linkedListEntry)
      crListReplica.size = crListReplica.parentMap.size
      void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
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
      void crListReplica.tombstones.add(tombstone)
      const linkedListEntry = crListReplica.parentMap.get(tombstone)
      if (linkedListEntry) {
        void newTombsIndices.push(linkedListEntry.index)
        void crListReplica.index?.delete(linkedListEntry.index)
        void deleteLiveEntry<T>(crListReplica, linkedListEntry)
        needsRelink = true
      }
    }
  }

  /** Apply value entries. */
  if (
    !Object.hasOwn(crListDelta, 'values') ||
    !Array.isArray(crListDelta.values)
  ) {
    if (newTombsIndices.length === 0) return false
    void rebuildLiveIndex<T>(crListReplica)
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
      if (crListReplica.tombstones.has(valueEntry.uuidv7)) continue
      if (valueEntry.predecessor !== '\0' && !isUuidV7(valueEntry.predecessor))
        continue
      if (existingEntry.predecessor >= valueEntry.predecessor) continue
      const previousPredecessor = existingEntry.predecessor
      void moveEntryToPredecessor<T>(
        crListReplica,
        existingEntry,
        valueEntry.predecessor
      )
      void reparentedVals.push({ entry: existingEntry, previousPredecessor })
      needsRelink = true
      continue
    }
    const linkedListEntry = materializeSnapshotEntry<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    const predecessor =
      linkedListEntry.predecessor === '\0'
        ? undefined
        : crListReplica.parentMap.get(linkedListEntry.predecessor)
    void attachEntryToIndexes<T>(crListReplica, linkedListEntry)
    void newVals.push(linkedListEntry)
    if (!needsRelink && linkedListEntry.predecessor === '\0') {
      if (crListReplica.size === 0) {
        crListReplica.cursor = linkedListEntry
        crListReplica.cursorIndex = linkedListEntry.index
        crListReplica.size = crListReplica.parentMap.size
        void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
      } else {
        needsRelink = true
      }
    } else if (!needsRelink && predecessor && !predecessor.next) {
      linkedListEntry.prev = predecessor
      linkedListEntry.index = crListReplica.size
      predecessor.next = linkedListEntry
      crListReplica.cursor = linkedListEntry
      crListReplica.cursorIndex = linkedListEntry.index
      crListReplica.size = crListReplica.parentMap.size
      void crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
    } else {
      needsRelink = true
    }
  }
  if (needsRelink) {
    if (!trySpliceInsertedParent<T>(crListReplica, newVals, reparentedVals)) {
      // Flatten tree into a doubly linked list and write live-view indexes.
      void rebuildLiveProjection<T>(crListReplica)
    }
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
