import type {
  CRListDelta,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
import { deleteEntryFromMaps } from '../deleteEntryFromMaps/index.js'
import { updateEntryToMaps } from '../updateEntryToMaps/index.js'

export function moveEntryToPredecessor<T>(
  crListReplica: CRListReplica<T>,
  linkedListEntry: NonNullable<DoublyLinkedListEntry<T>>,
  predecessor: string,
  deltaBuf?: CRListDelta<T>
): void {
  void deleteEntryFromMaps<T>(crListReplica, linkedListEntry)
  linkedListEntry.predecessor = predecessor
  void updateEntryToMaps<T>(crListReplica, linkedListEntry, deltaBuf)
}
