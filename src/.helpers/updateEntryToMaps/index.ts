import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'
export function writeTrustedEntryToMaps<T>(
  crListReplica: CRListReplica<T>,
  linkedListEntry: NonNullable<DoublyLinkedListEntry<T>>
): void {
  crListReplica.parentMap.set(linkedListEntry.uuidv7, linkedListEntry)
  if (!crListReplica.childrenMap.has(linkedListEntry.predecessor)) {
    crListReplica.childrenMap.set(linkedListEntry.predecessor, [])
  }
  crListReplica.childrenMap
    .get(linkedListEntry.predecessor)
    ?.push(linkedListEntry)
}
