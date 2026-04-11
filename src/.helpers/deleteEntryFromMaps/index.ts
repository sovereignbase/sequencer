import type { CRListState, CRListStateEntry } from '../../.types/index.js'
export function deleteEntryFromMaps<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>
): void {
  crListReplica.parentMap.delete(linkedListEntry.uuidv7)
  const siblings = crListReplica.childrenMap.get(linkedListEntry.predecessor)
  if (!siblings) return
  const index = siblings.indexOf(linkedListEntry)
  if (index !== -1) siblings.splice(index, 1)
}
