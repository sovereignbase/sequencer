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
} from '../../../.helpers/index.js'
import { prototype, isUuidV7 } from '@sovereignbase/utils'

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
