import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
export function deleteEntryFromMaps<T>(
  crListReplica: CRListReplica<T>,
  linkedListEntry: NonNullable<DoublyLinkedListEntry<T>>
): void {
  crListReplica.parentMap.delete(linkedListEntry.uuidv7)
  const siblings = crListReplica.childrenMap.get(linkedListEntry.predecessor)
  if (!Array.isArray(siblings)) return
  const index = siblings.indexOf(linkedListEntry)
  if (index !== -1) siblings.splice(index, 1)
}
