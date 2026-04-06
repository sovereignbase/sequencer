import { isUuidV7, safeStructuredClone, prototype } from '@sovereignbase/utils'
import {
  CRListSnapshot,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'
import {
  tryToMergeEntry,
  assertListIndices,
  resolveSiblingOrdering,
  tryMergingDetached,
} from '../../../.helpers/index.js'

export function __create<T>(snapshot?: CRListSnapshot<T>): CRListReplica<T> {
  const crListReplica: CRListReplica<T> = {
    size: 0,
    cursor: undefined,
    tombstones: new Set<string>(),
    detachedEntries: new Set<DoublyLinkedListEntry<T>>(),
    seenUuidV7IdentifiersAndTheirEntry: {},
    seenPredecessorIdentifiersAndTheirEntries: {},
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
  if (Object.hasOwn(snapshot, 'values') && Array.isArray(snapshot.values)) {
    for (const { uuidv7, value, predecessor } of snapshot.values) {
      if (
        crListReplica.tombstones.has(uuidv7) ||
        Object.hasOwn(
          crListReplica.seenUuidV7IdentifiersAndTheirEntry,
          uuidv7
        ) ||
        !isUuidV7(uuidv7) ||
        (predecessor && !isUuidV7(predecessor))
      )
        continue

      const [cloned, copiedValue] = safeStructuredClone(value)
      if (!cloned) continue

      const entry: Exclude<DoublyLinkedListEntry<T>, undefined> = {
        uuidv7,
        value: copiedValue,
        predecessor,
        index: 0,
        next: undefined,
        prev: undefined,
      }

      if (!crListReplica.cursor) {
        crListReplica.cursor = entry
        crListReplica.size++
      } else tryToMergeEntry(crListReplica, entry)

      crListReplica.seenUuidV7IdentifiersAndTheirEntry[entry.uuidv7] = entry
      crListReplica.seenPredecessorIdentifiersAndTheirEntries[
        entry.predecessor
      ].add(entry)
    }
    //**retry merging detached*/
    tryMergingDetached(crListReplica)
    //**order siblings*/
    resolveSiblingOrdering(crListReplica)
    //**write indices*/
    assertListIndices(crListReplica)
  }
  return crListReplica
}
