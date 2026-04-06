import { isUuidV7, safeStructuredClone, prototype } from '@sovereignbase/utils'
import {
  CRListSnapshot,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'
import { tryToMergeEntry } from '../../../.helpers/index.js'

export function __create<T>(snapshot?: CRListSnapshot<T>): CRListReplica<T> {
  const crListReplica: CRListReplica<T> = {
    size: 0,
    cursor: undefined,
    tombstones: new Set<string>(),
    detachedEntries: new Set<DoublyLinkedListEntry<T>>(),
    seenUuidV7Identifiers: new Set<string>(),
    seenPredecessorIdentifiersAndTheirEntry: {},
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
        crListReplica.seenUuidV7Identifiers.has(uuidv7) ||
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

      crListReplica.seenUuidV7Identifiers.add(entry.uuidv7)
      crListReplica.seenPredecessorIdentifiersAndTheirEntry[entry.predecessor] =
        entry
    }
    const detachedSizeAfterLinear = crListReplica.detachedEntries.size
    for (let i = 0; i < detachedSizeAfterLinear; i++) {
      crListReplica.detachedEntries.forEach((entry) => {
        crListReplica.detachedEntries.delete(entry)
        tryToMergeEntry(crListReplica, entry)
      })
      if (crListReplica.detachedEntries.size <= 0) break
    }
    if (crListReplica.cursor) {
      while (crListReplica.cursor.next) {
        crListReplica.cursor = crListReplica.cursor.next
      }

      let listIndex: number = crListReplica.size - 1
      let indexingCursor: DoublyLinkedListEntry<T> = crListReplica.cursor
      indexingCursor.index = listIndex
      while (indexingCursor && listIndex > 0) {
        listIndex--
        indexingCursor = indexingCursor.prev
        if (indexingCursor) indexingCursor.index = listIndex
      }
    }
  }
  return crListReplica
}
