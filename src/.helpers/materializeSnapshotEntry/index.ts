import type {
  CRListState,
  CRListSnapshotEntry,
  CRListStateEntry,
} from '../../.types/type.js'
import { isRecord, uuidV7BigIntStringToBigInt } from '@sovereignbase/utils'

/**
 * Converts a snapshot or delta value entry into local mutable entry state.
 *
 * Invalid, deleted, duplicate, or currently unanchored entries are ignored.
 * Payload values are kept by reference.
 */
export function materializeSnapshotEntry<T>(
  valueEntry: CRListSnapshotEntry<T>,
  crListReplica: CRListState<T>,
  parsedId?: bigint
): CRListStateEntry<T> {
  if (!isRecord(valueEntry)) return undefined
  if (!Array.isArray(valueEntry.values) || valueEntry.values.length === 0)
    return undefined

  if (crListReplica.tombstones.has(valueEntry.id)) return undefined

  const bigIntId = parsedId ?? uuidV7BigIntStringToBigInt(valueEntry.id)
  if (bigIntId === false) return undefined
  const bigIntPredecessor =
    valueEntry.predecessor === '0'
      ? 0n
      : uuidV7BigIntStringToBigInt(valueEntry.predecessor)
  if (bigIntPredecessor === false) return undefined
  if (crListReplica.parentMap.has(bigIntId)) return undefined

  return {
    id: bigIntId,
    idString: valueEntry.id,
    values: valueEntry.values,
    predecessor: bigIntPredecessor,
    index: 0,
    next: undefined,
    prev: undefined,
  }
}
