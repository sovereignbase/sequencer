import type {
  CRListDelta,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
import { deleteEntryFromMaps } from '../deleteEntryFromMaps/index.js'

export function deleteLinkedEntry<T>(
  crListReplica: CRListReplica<T>,
  linkedListEntry: NonNullable<DoublyLinkedListEntry<T>>,
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
    if (next.predecessor === linkedListEntry.uuidv7) {
      const siblings = crListReplica.childrenMap.get(next.predecessor)
      const siblingIndex = siblings?.indexOf(next) ?? -1
      if (siblings && siblingIndex !== -1) siblings.splice(siblingIndex, 1)
      next.predecessor = prev?.uuidv7 ?? '\0'
      if (!crListReplica.childrenMap.has(next.predecessor)) {
        crListReplica.childrenMap.set(next.predecessor, [])
      }
      crListReplica.childrenMap.get(next.predecessor)?.push(next)
    }
  }
  void deleteEntryFromMaps<T>(crListReplica, linkedListEntry)
  if (crListReplica.cursor === linkedListEntry)
    crListReplica.cursor = next ?? prev
  linkedListEntry.prev = undefined
  linkedListEntry.next = undefined
  crListReplica.size = crListReplica.parentMap.size
}
