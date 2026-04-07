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
  deleteLinkedEntry,
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
      if (linkedListEntry)
        void deleteLinkedEntry<T>(crListReplica, linkedListEntry)
    }
  }

  /**Fill values entry(s)*/
  if (
    !Object.hasOwn(crListDelta, 'values') ||
    !Array.isArray(crListDelta.values)
  )
    return crListReplica
  //**attach valid ones to tree*/
  for (const valueEntry of crListDelta.values) {
    const linkedListEntry = snapshotValueToLinkedListValue<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)
  }
  //**flatten tree in to doubly linked list */
  void flattenAndLinkTrustedState<T>(crListReplica)
  //**write indices*/
  void assertListIndices<T>(crListReplica)

  return change
}
