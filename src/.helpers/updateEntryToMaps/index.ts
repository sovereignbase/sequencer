import type {
  CRListReplica,
  DoublyLinkedListEntry,
  CRListDelta,
} from '../../.types/index.js'
export function updateEntryToMaps<T>(
  crListReplica: CRListReplica<T>,
  linkedListEntry: NonNullable<DoublyLinkedListEntry<T>>,
  deltaBuf?: CRListDelta<T>
): void {
  crListReplica.parentMap.set(linkedListEntry.uuidv7, linkedListEntry)
  if (!crListReplica.childrenMap.has(linkedListEntry.predecessor)) {
    crListReplica.childrenMap.set(linkedListEntry.predecessor, [])
  }
  crListReplica.childrenMap
    .get(linkedListEntry.predecessor)
    ?.push(linkedListEntry)
  if (deltaBuf && !Array.isArray(deltaBuf.values)) deltaBuf.values = []
  if (deltaBuf?.values)
    deltaBuf.values.push({
      uuidv7: linkedListEntry.uuidv7,
      value: linkedListEntry.value,
      predecessor: linkedListEntry.predecessor,
    })
}
