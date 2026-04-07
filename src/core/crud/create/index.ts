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
} from '../../../.helpers/index.js'

/**
 * Time:  O(n log n + t + c)
 * Space: O(n + t)
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
    crListReplica.parentMap.set(linkedListEntry.uuidv7, linkedListEntry)
    if (!crListReplica.childrenMap.has(linkedListEntry.predecessor)) {
      crListReplica.childrenMap.set(linkedListEntry.predecessor, [])
    }
    crListReplica.childrenMap
      .get(linkedListEntry.predecessor)
      ?.push(linkedListEntry)
  }
  //**flatten tree in to doubly linked list */
  void flattenAndLinkTrustedState<T>(crListReplica)
  //**write indices*/
  void assertListIndices<T>(crListReplica)

  return crListReplica
}
