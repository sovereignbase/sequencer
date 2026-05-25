import type {
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { detachEntryFromIndexes } from '../detachEntryFromIndexes/index.js'
import { attachEntryToIndexes } from '../attachEntryToIndexes/index.js'

/**
 * Reattaches an existing live entry to a stable predecessor.
 */
export function moveEntryToPredecessor<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  predecessor: bigint,
  deltaBuf?: CRListDelta<T>
): void {
  void detachEntryFromIndexes<T>(crListReplica, linkedListEntry)
  linkedListEntry.predecessor = predecessor
  void attachEntryToIndexes<T>(crListReplica, linkedListEntry, deltaBuf)
}
