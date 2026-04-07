import { isUuidV7, prototype } from '@sovereignbase/utils'
import {
  CRListSnapshot,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'
import {
  flattenAndLinkTrustedState,
  assertListIndices,
  snapshotValueToLinkedListValue,
  updateEntryToMaps,
} from '../../../.helpers/index.js'

/**
 * Time complexity: O(n log n + t + c), worst case O(n log n + c)
 * - n = snapshot value entry count
 * - t = snapshot tombstone count
 * - c = cloned value payload
 *
 * Space complexity: O(n + t + c)
 */
export function __create<T>(snapshot?: CRListSnapshot<T>): CRListReplica<T> {
  const crListReplica: CRListReplica<T> = {
    size: 0,
    cursor: undefined,
    tombstones: new Set<string>(),
    parentMap: new Map<string, NonNullable<DoublyLinkedListEntry<T>>>(),
    childrenMap: new Map<
      string,
      Array<NonNullable<DoublyLinkedListEntry<T>>>
    >(),
  }
  if (!snapshot || prototype(snapshot) !== 'record') return crListReplica

  /**Hydrate tombstones entry(s)*/
  if (
    Object.hasOwn(snapshot, 'tombstones') &&
    Array.isArray(snapshot.tombstones)
  ) {
    for (const tombstone of snapshot.tombstones) {
      if (crListReplica.tombstones.has(tombstone) || !isUuidV7(tombstone))
        continue
      crListReplica.tombstones.add(tombstone)
    }
  }

  /**Hydrate values entry(s)*/
  if (!Object.hasOwn(snapshot, 'values') || !Array.isArray(snapshot.values))
    return crListReplica
  //**BUILD TREE*/
  for (const valueEntry of snapshot.values) {
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

  return crListReplica
}
