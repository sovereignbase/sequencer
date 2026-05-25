import type { CRListState, CRListStateEntry } from '../../.types/type.js'

/**
 * Removes a live entry from UUID and predecessor indexes.
 */
export function detachEntryFromIndexes<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>
): void {
  for (
    let entryOffset = 0;
    entryOffset < linkedListEntry.values.length;
    entryOffset++
  )
    void crListReplica.parentMap.delete(
      linkedListEntry.id + BigInt(entryOffset)
    )
  const siblings = crListReplica.childrenMap.get(linkedListEntry.predecessor)
  if (siblings) {
    const index = siblings.indexOf(linkedListEntry)
    if (index !== -1) void siblings.splice(index, 1)
  }
}
