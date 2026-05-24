import type {
  CRListState,
  CRListSnapshotEntry,
  CRListStateEntry,
} from '../../.types/type.js'
import {
  isUuidV7,
  isRecord,
  uuidV7BigIntStringToBigInt,
} from '@sovereignbase/utils'

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
  if (!isRecord(valueEntry)) return undefined

  if (crListReplica.tombstones.has(valueEntry.id)) return undefined

  const bigIntId = uuidV7BigIntStringToBigInt(valueEntry.id)

  if (!bigIntId || crListReplica.parentMap.has(bigIntId)) return undefined

  const bigIntPredecessor = uuidV7BigIntStringToBigInt(valueEntry.predecessor)

  if (
    bigIntPredecessor &&
    valueEntry.predecessor !== '\0' &&
    !crListReplica.tombstones.has(valueEntry.predecessor)
  )
    return undefined

  return {
    id: bigIntId,
    value: valueEntry.value,
    predecessor: bigIntPredecessor,
    index: 0,
    next: undefined,
    prev: undefined,
  }
}
