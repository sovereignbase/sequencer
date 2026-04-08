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
 * Creates a local CRList replica from an optional snapshot.
 *
 * Invalid snapshot records are ignored. Accepted values are cloned, indexed by
 * UUIDv7, linked through their predecessor buckets, and exposed as a live
 * doubly-linked list.
 *
 * @param snapshot Optional serializable CRList state.
 * @returns A hydrated CRList replica.
 *
 * Time complexity: O(n log n + t + c), worst case O(n log n + t + c)
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

  /** Hydrate tombstone entries. */
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

  /** Hydrate value entries. */
  if (!Object.hasOwn(snapshot, 'values') || !Array.isArray(snapshot.values))
    return crListReplica
  // Build predecessor tree.
  for (const valueEntry of snapshot.values) {
    const linkedListEntry = snapshotValueToLinkedListValue<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    void updateEntryToMaps<T>(crListReplica, linkedListEntry)
  }
  // Flatten tree into a doubly linked list.
  void flattenAndLinkTrustedState<T>(crListReplica)
  // Write live-view indexes.
  void assertListIndices<T>(crListReplica)

  return crListReplica
}
