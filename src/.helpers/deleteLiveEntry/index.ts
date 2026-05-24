import type {
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { detachEntryFromIndexes } from '../detachEntryFromIndexes/index.js'

/**
 * Tombstones a live entry and unlinks it from the local projection.
 */
export function deleteLiveEntry<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  deltaBuf?: CRListDelta<T>
): void {
  const prev = linkedListEntry.prev
  const next = linkedListEntry.next
  void crListReplica.tombstones.add(linkedListEntry.uuidv7)
  if (deltaBuf && !Array.isArray(deltaBuf.tombstones)) deltaBuf.tombstones = []
  void deltaBuf?.tombstones?.push(linkedListEntry.uuidv7)
  if (prev) prev.next = next
  if (next) {
    next.prev = prev
  }
  void detachEntryFromIndexes<T>(crListReplica, linkedListEntry)
  if (crListReplica.cursor === linkedListEntry)
    crListReplica.cursor = next ?? prev
  if (!crListReplica.cursor) crListReplica.cursorIndex = undefined
  linkedListEntry.prev = undefined
  linkedListEntry.next = undefined
  crListReplica.size = crListReplica.parentMap.size
}
