import { isUuidV7, isRecord } from '@sovereignbase/utils'
import {
  CRListSnapshot,
  CRListState,
  CRListStateEntry,
} from '../../../.types/type.js'
import {
  rebuildLiveProjection,
  materializeSnapshotEntry,
  attachEntryToIndexes,
  linkEntryBetween,
} from '../../../.helpers/index.js'
import { v7 } from 'uuid'
import { Bytes } from '@sovereignbase/bytecodec'

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
  const buf = new Uint8Array(16)
  void v7(undefined, buf)

  const crListReplica: CRListState<T> = {
    size: 0,
    /***/
    head: undefined,
    tail: undefined,
    cursor: undefined,
    cursorIndex: undefined,
    clock: Bytes.toBigInt(buf),
    /***/
    cache: new Map<number, NonNullable<CRListStateEntry<T>>>(),
    /***/
    parentMap: new Map<bigint, NonNullable<CRListStateEntry<T>>>(),
    childrenMap: new Map<bigint, Array<NonNullable<CRListStateEntry<T>>>>(),
    tombstones: new Set<string>(),
    /***/
  }

  /**Return fast*/
  if (!isRecord(snapshot)) return crListReplica

  /** Mint tombstone entries if there is any. */
  if (Array.isArray(snapshot.tombstones)) {
    for (const tombstone of snapshot.tombstones) {
      if (crListReplica.tombstones.has(tombstone) || !isUuidV7(tombstone))
        continue
      void crListReplica.tombstones.add(tombstone)
    }
  }

  /**Return fast*/
  if (!Array.isArray(snapshot.values)) return crListReplica

  /** Mint value entries if there is any. */
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
      linkedListEntry.predecessor === (previous?.id ?? '\0')
    ) {
      linkedListEntry.index = crListReplica.parentMap.size - 1
      void linkEntryBetween<T>(previous, linkedListEntry, undefined)
      previous = linkedListEntry
      void crListReplica.cache.set(linkedListEntry.index, linkedListEntry)
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
  // Flatten tree into a doubly linked list and write live-view indexes.
  void rebuildLiveProjection<T>(crListReplica)

  return crListReplica
}
