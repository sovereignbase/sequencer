import type {
  CRListReplica,
  CRListSnapshotValueEntry,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
import { isUuidV7, safeStructuredClone } from '@sovereignbase/utils'
export function snapshotValueToLinkedListValue<T>(
  valueEntry: CRListSnapshotValueEntry<T>,
  crListReplica: CRListReplica<T>
): DoublyLinkedListEntry<T> {
  if (
    !isUuidV7(valueEntry.uuidv7) ||
    crListReplica.tombstones.has(valueEntry.uuidv7) ||
    crListReplica.parentMap.has(valueEntry.uuidv7) ||
    (!isUuidV7(valueEntry.predecessor) && valueEntry.predecessor !== '\0')
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
