import type {
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../.types/index.js'
import { deleteEntryFromMaps } from '../deleteEntryFromMaps/index.js'

export function deleteLinkedEntry<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  deltaBuf?: CRListDelta<T>
): void {
  const prev = linkedListEntry.prev
  const next = linkedListEntry.next
  crListReplica.tombstones.add(linkedListEntry.uuidv7)
  if (deltaBuf && !Array.isArray(deltaBuf.tombstones)) deltaBuf.tombstones = []
  deltaBuf?.tombstones?.push(linkedListEntry.uuidv7)
  if (prev) prev.next = next
  if (next) {
    next.prev = prev
  }
  void deleteEntryFromMaps<T>(crListReplica, linkedListEntry)
  if (crListReplica.cursor === linkedListEntry)
    crListReplica.cursor = next ?? prev
  if (!crListReplica.cursor) crListReplica.cursorIndex = undefined
  linkedListEntry.prev = undefined
  linkedListEntry.next = undefined
  crListReplica.size = crListReplica.parentMap.size
}
