import type {
  CRListChange,
  CRListDelta,
  CRListReplica,
} from '../../../.types/index.js'
import {
  snapshotValueToLinkedListValue,
  updateEntryToMaps,
  flattenAndLinkTrustedState,
  assertListIndices,
  walkToIndex,
} from '../../../.helpers/index.js'
import { prototype, isUuidV7 } from '@sovereignbase/utils'

/**
 * Time complexity: O(n log n + v + t + d + r + c), worst case O(n log n + c)
 * - n = replica value entry count after merge
 * - v = delta value entry count
 * - t = delta tombstone count
 * - d = distance from cursor to first changed index
 * - r = amount of nodes from first changed index to list end
 * - c = cloned delta value payload size
 *
 * Space complexity: O(n + r + c)
 */
export function __merge<T>(
  crListReplica: CRListReplica<T>,
  crListDelta: CRListDelta<T>
): CRListChange<T> | false {
  if (!crListDelta || prototype(crListDelta) !== 'record') return false

  const change: CRListChange<T> = {}

  if (
    Object.hasOwn(crListDelta, 'tombstones') &&
    Array.isArray(crListDelta.tombstones)
  ) {
    for (const tombstone of crListDelta.tombstones) {
      if (crListReplica.tombstones.has(tombstone) || !isUuidV7(tombstone))
        continue
      crListReplica.tombstones.add(tombstone)
    }
  }

  /**Hydrate values entry(s)*/
  if (
    !Object.hasOwn(crListDelta, 'values') ||
    !Array.isArray(crListDelta.values)
  )
    return change
  //**BUILD TREE*/
  let changeStartIndex = crListReplica.size
  const acceptedIdentifiers = new Set<string>()
  for (const valueEntry of crListDelta.values) {
    const linkedListEntry = snapshotValueToLinkedListValue<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    acceptedIdentifiers.add(linkedListEntry.uuidv7)
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)
  }
  //**flatten tree in to doubly linked list */
  void flattenAndLinkTrustedState<T>(crListReplica)
  //**write indices*/
  void assertListIndices<T>(crListReplica)

  for (const uuidv7 of acceptedIdentifiers) {
    const linkedListEntry = crListReplica.parentMap.get(uuidv7)
    if (linkedListEntry && linkedListEntry.index < changeStartIndex)
      changeStartIndex = linkedListEntry.index
  }

  if (changeStartIndex >= crListReplica.size) return change

  void walkToIndex<T>(changeStartIndex, crListReplica)
  let cursor = crListReplica.cursor
  while (cursor) {
    change[cursor.index] = cursor.value
    cursor = cursor.next
  }

  return change
}
