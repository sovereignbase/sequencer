import { isUuidV7, safeStructuredClone, prototype } from '@sovereignbase/utils'
import { CRListSnapshot, CRListReplica } from '../../../.types/index.js'

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
        !isUuidV7(uuidv7) ||
        !isUuidV7(predecessor)
      )
        continue
      const [cloned, copiedValue] = safeStructuredClone(value)
      if (!cloned) continue

      //**these two indexes allow dynamic order adujusting because of the doubly linked list structure we ;) we can just detect and adjust*/
      if (Object.hasOwn(crListReplica.seenUuidV7Identifiers, predecessor)) {
        //**jump in and patch here
      }

      if (Object.hasOwn(crListReplica.seenPredecessorIdentifiers, uuidv7)) {
        //**jump in and patch here
      }

      const prev = crListReplica.cursor
      const entry = {
        uuidv7,
        value: copiedValue,
        predecessor,
        index: crListReplica.length,
        next: undefined,
        prev,
      }

      if (prev) prev.next = entry
      crListReplica.cursor = entry

      crListReplica.seenUuidV7Identifiers[uuidv7] = entry

      if (predecessor) {
        crListReplica.seenPredecessorIdentifiers[predecessor] = entry
      }

      crListReplica.length++
    }
  }
  return crListReplica
}
