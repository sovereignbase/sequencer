import { isUuidV7, safeStructuredClone, prototype } from '@sovereignbase/utils'
import {
  CRListSnapshot,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'

export function __create<T>(snapshot?: CRListSnapshot<T>): CRListReplica<T> {
  const crListReplica: CRListReplica<T> = {
    length: 0,
    cursor: undefined,
    tombstones: new Set<string>(),
    seenUuidV7Identifiers: {},
    seenPredecessorIdentifiers: {},
  }
  if (!snapshot || prototype(snapshot) !== 'record') return crListReplica

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

  if (Object.hasOwn(snapshot, 'values') && Array.isArray(snapshot.values)) {
    for (const { uuidv7, value, predecessor } of snapshot.values) {
      if (
        crListReplica.tombstones.has(uuidv7) ||
        Object.hasOwn(crListReplica.seenUuidV7Identifiers, uuidv7) ||
        !isUuidV7(uuidv7) ||
        (predecessor && !isUuidV7(predecessor))
      )
        continue

      const [cloned, copiedValue] = safeStructuredClone(value)
      if (!cloned) continue

      const pending = crListReplica.seenPredecessorIdentifiers[uuidv7]
      const entry: Exclude<DoublyLinkedListEntry<T>, undefined> = {
        uuidv7,
        value: copiedValue,
        predecessor,
        index: crListReplica.length,
        next: undefined,
        prev: undefined,
      }

      if (
        /**if the item is detached*/
        !Object.hasOwn(crListReplica.seenUuidV7Identifiers, predecessor) &&
        !Object.hasOwn(crListReplica.seenPredecessorIdentifiers, predecessor)
      ) {
        //**attach to list expcept undefined for first iter*/
        entry.prev = crListReplica.cursor
        /**if not first iter (undefined) mark new entry as the next for last one (doubly linked) */
        if (crListReplica.cursor) crListReplica.cursor.next = entry
        //**set entry as cursor*/
        crListReplica.cursor = entry
      } else if (
        /**if predecessor is equal to cursor uuidv7 and uuidv7 is not a predecessor to some other node*/
        predecessor === crListReplica.cursor?.uuidv7 &&
        !Object.hasOwn(
          crListReplica.seenPredecessorIdentifiers,
          crListReplica.cursor.uuidv7
        )
      ) {
        //**set cursor as pervious for entry */
        entry.prev = crListReplica.cursor
        /**doubly link cursor next to entry */
        if (crListReplica.cursor) crListReplica.cursor.next = entry
        /**move cursor to entry */
        crListReplica.cursor = entry
      } else {
        let prev = crListReplica.seenUuidV7Identifiers[predecessor]
        let next =
          crListReplica.seenPredecessorIdentifiers[predecessor] ?? prev?.next

        while (next && next.uuidv7 < uuidv7) {
          prev = next
          next = crListReplica.seenPredecessorIdentifiers[next.uuidv7]
        }

        entry.predecessor = prev?.uuidv7 ?? predecessor
        entry.index = next ? next.index : (prev?.index ?? -1) + 1
        entry.prev = prev ?? next?.prev
        entry.next = next

        if (entry.prev) entry.prev.next = entry

        if (next) {
          next.prev = entry
          next.predecessor = uuidv7
          let cursor: DoublyLinkedListEntry<T> = next
          while (cursor) {
            cursor.index++
            cursor = cursor.next
          }
        } else {
          crListReplica.cursor = entry
        }
      }

      crListReplica.seenUuidV7Identifiers[uuidv7] = entry
      crListReplica.seenPredecessorIdentifiers[entry.predecessor] = entry

      if (pending && pending !== entry.next) {
        crListReplica.seenPredecessorIdentifiers[uuidv7] = pending
      } else if (entry.next) {
        crListReplica.seenPredecessorIdentifiers[uuidv7] = entry.next
      }

      crListReplica.length++

      let left = entry
      let patch = pending

      while (patch && patch !== entry.next) {
        const patchNext = crListReplica.seenPredecessorIdentifiers[patch.uuidv7]

        if (patch.prev !== left) {
          const oldNext = patch.next

          if (patch.prev) patch.prev.next = patch.next
          if (patch.next) patch.next.prev = patch.prev
          else if (crListReplica.cursor?.uuidv7 === patch.uuidv7)
            crListReplica.cursor = patch.prev

          let cursor = oldNext
          while (cursor) {
            cursor.index--
            cursor = cursor.next
          }

          const right = left.next
          patch.prev = left
          patch.next = right
          patch.predecessor = left.uuidv7
          patch.index = left.index + 1
          left.next = patch

          if (right) {
            right.prev = patch
            right.predecessor = patch.uuidv7
            cursor = right
            while (cursor) {
              cursor.index++
              cursor = cursor.next
            }
          } else {
            crListReplica.cursor = patch
          }
        } else {
          patch.predecessor = left.uuidv7
        }

        crListReplica.seenPredecessorIdentifiers[left.uuidv7] = patch

        if (patchNext) {
          crListReplica.seenPredecessorIdentifiers[patch.uuidv7] = patchNext
        } else if (patch.next) {
          crListReplica.seenPredecessorIdentifiers[patch.uuidv7] = patch.next
        }

        left = patch
        patch = patchNext
      }
    }
  }
  return crListReplica
}
