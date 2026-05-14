import { isUuidV7, prototype } from '@sovereignbase/utils'
import {
  CRListSnapshot,
  CRListState,
  CRListStateEntry,
} from '../../../.types/index.js'
import {
  rebuildLiveProjection,
  rebuildLiveIndex,
  materializeSnapshotEntry,
  attachEntryToIndexes,
  linkEntryBetween,
} from '../../../.helpers/index.js'

/**
 * Creates a local CRList replica from an optional snapshot.
 *
 * Invalid snapshot records are ignored. Accepted values are kept by reference,
 * indexed by UUIDv7, linked through their predecessor buckets, and exposed as a
 * live doubly-linked list projection.
 *
 * @param snapshot - Optional CRList snapshot.
 * @returns - A hydrated CRList replica.
 *
 * Time complexity: O(n log n + t), worst case O(n^2 + t)
 * - n = snapshot value entry count
 * - t = snapshot tombstone count
 *
 * Space complexity: O(n + t)
 */
export function __create<T>(snapshot?: CRListSnapshot<T>): CRListState<T> {
  const crListReplica: CRListState<T> = {
    size: 0,
    cursor: undefined,
    cursorIndex: undefined,
    index: new Map(),
    tombstones: new Set<string>(),
    parentMap: new Map<string, NonNullable<CRListStateEntry<T>>>(),
    childrenMap: new Map<string, Array<NonNullable<CRListStateEntry<T>>>>(),
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
  let canUseLinearProjection = true
  let previous: CRListStateEntry<T> = undefined
  for (const valueEntry of snapshot.values) {
    const linkedListEntry = materializeSnapshotEntry<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    void attachEntryToIndexes<T>(crListReplica, linkedListEntry)
    if (
      canUseLinearProjection &&
      linkedListEntry.predecessor === (previous?.uuidv7 ?? '\0')
    ) {
      linkedListEntry.index = crListReplica.parentMap.size - 1
      linkEntryBetween<T>(previous, linkedListEntry, undefined)
      previous = linkedListEntry
      crListReplica.index?.set(linkedListEntry.index, linkedListEntry)
      continue
    }
    canUseLinearProjection = false
  }
  if (canUseLinearProjection) {
    crListReplica.cursor = previous
    crListReplica.cursorIndex = previous
      ? crListReplica.parentMap.size - 1
      : undefined
    crListReplica.size = crListReplica.parentMap.size
    return crListReplica
  }
  // Flatten tree into a doubly linked list.
  void rebuildLiveProjection<T>(crListReplica)
  // Write live-view indexes.
  void rebuildLiveIndex<T>(crListReplica)

  return crListReplica
}
