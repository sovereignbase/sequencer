import type {
  CRListState,
  CRListStateEntry,
  CRListDelta,
} from '../../.types/index.js'
export function updateEntryToMaps<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  deltaBuf?: CRListDelta<T>
): void {
  crListReplica.parentMap.set(linkedListEntry.uuidv7, linkedListEntry)
  const siblings = crListReplica.childrenMap.get(linkedListEntry.predecessor)
  if (siblings) {
    siblings.push(linkedListEntry)
  } else {
    crListReplica.childrenMap.set(linkedListEntry.predecessor, [
      linkedListEntry,
    ])
  }
  if (deltaBuf && !Array.isArray(deltaBuf.values)) deltaBuf.values = []
  if (deltaBuf?.values)
    deltaBuf.values.push({
      uuidv7: linkedListEntry.uuidv7,
      value: linkedListEntry.value,
      predecessor: linkedListEntry.predecessor,
    })
}
