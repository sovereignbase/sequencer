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
  }
  const children = crListReplica.childrenMap.get(linkedListEntry.uuidv7)
  if (children) {
    const predecessor = prev?.uuidv7 ?? '\0'
    if (!crListReplica.childrenMap.has(predecessor)) {
      crListReplica.childrenMap.set(predecessor, [])
    }
    const siblings = crListReplica.childrenMap.get(predecessor)
    for (const child of children) {
      child.predecessor = predecessor
      siblings?.push(child)
    }
    crListReplica.childrenMap.delete(linkedListEntry.uuidv7)
  }
  void deleteEntryFromMaps<T>(crListReplica, linkedListEntry)
  if (crListReplica.cursor === linkedListEntry)
    crListReplica.cursor = next ?? prev
  linkedListEntry.prev = undefined
  linkedListEntry.next = undefined
  crListReplica.size = crListReplica.parentMap.size
}
