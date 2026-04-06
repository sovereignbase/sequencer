import { isUuidV7, safeStructuredClone, prototype } from '@sovereignbase/utils'
import {
  CRListSnapshot,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'
import {
  flattenAndLinkValues,
  assertListIndices,
} from '../../../.helpers/index.js'

export function __create<T>(snapshot?: CRListSnapshot<T>): CRListReplica<T> {
  const crListReplica: CRListReplica<T> = {
    size: 0,
    cursor: undefined,
    tombstones: new Set<string>(),
    parentMap: {},
    childrenMap: {},
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
  const values = snapshot.values

  if (
    !Object.hasOwn(values, 'parentMap') ||
    !Object.hasOwn(values, 'childrenMap')
  )
    return crListReplica

  crListReplica.parentMap = values.parentMap as Record<
    string,
    DoublyLinkedListEntry<T>
  >
  crListReplica.childrenMap = values.childrenMap as Record<
    string,
    Array<DoublyLinkedListEntry<T>>
  >
  //**flatten tree in to doubly linked list */
  flattenAndLinkValues(crListReplica)
  //**write indices*/
  assertListIndices(crListReplica)

  return crListReplica
}
