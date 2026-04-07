import { isUuidV7, safeStructuredClone, prototype } from '@sovereignbase/utils'
import {
  CRListSnapshot,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'
import {
  flattenAndLinkTrustedState,
  assertListIndices,
  snapshotValueToLinkedListValue,
} from '../../../.helpers/index.js'

/**
 * Time:  O(n log n + t)
 * Space: O(n + t)
 */
export function __create<T>(snapshot?: CRListSnapshot<T>): CRListReplica<T> {
  const crListReplica: CRListReplica<T> = {
    size: 0,
    cursor: undefined,
    tombstones: new Set<string>(),
    parentMap: new Map<string, DoublyLinkedListEntry<T>>(),
    childrenMap: new Map<string, Array<DoublyLinkedListEntry<T>>>(),
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
  if (!Object.hasOwn(snapshot, 'values')) return crListReplica
  //**BUILD TREE*/
  for (const valueEntry of snapshot.values) {
    const linkedListEntry = snapshotValueToLinkedListValue(valueEntry)
    if (!linkedListEntry) continue
  }
  //**flatten tree in to doubly linked list */
  flattenAndLinkTrustedState(crListReplica)
  //**write indices*/
  assertListIndices(crListReplica)

  return crListReplica
}
