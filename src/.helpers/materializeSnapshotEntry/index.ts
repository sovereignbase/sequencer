import type {
  CRListState,
  CRListSnapshotEntry,
  CRListStateEntry,
} from '../../.types/index.js'
import { isUuidV7 } from '@sovereignbase/utils'

/**
 * Converts a snapshot or delta value entry into local mutable entry state.
 *
 * Invalid, deleted, duplicate, or currently unanchored entries are ignored.
 * Payload values are kept by reference.
 */
export function materializeSnapshotEntry<T>(
  valueEntry: CRListSnapshotEntry<T>,
  crListReplica: CRListState<T>
): CRListStateEntry<T> {
  if (valueEntry === null || valueEntry === undefined) return undefined
  if (
    !isUuidV7(valueEntry.uuidv7) ||
    crListReplica.tombstones.has(valueEntry.uuidv7) ||
    crListReplica.parentMap.has(valueEntry.uuidv7) ||
    (!isUuidV7(valueEntry.predecessor) &&
      valueEntry.predecessor !== '\0' &&
      !crListReplica.tombstones.has(valueEntry.predecessor))
  )
    return undefined

  return {
    uuidv7: valueEntry.uuidv7,
    value: valueEntry.value,
    predecessor: valueEntry.predecessor,
    index: 0,
    next: undefined,
    prev: undefined,
  }
}
