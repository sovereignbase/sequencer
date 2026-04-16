import type {
  CRListState,
  CRListSnapshotEntry,
  CRListStateEntry,
} from '../../.types/index.js'
import { isUuidV7, safeStructuredClone } from '@sovereignbase/utils'
export function transformSnapshotEntryToStateEntry<T>(
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

  const [cloned, copiedValue] = safeStructuredClone(valueEntry.value)

  if (!cloned) return undefined
  return {
    uuidv7: valueEntry.uuidv7,
    value: copiedValue,
    predecessor: valueEntry.predecessor,
    index: 0,
    next: undefined,
    prev: undefined,
  }
}
