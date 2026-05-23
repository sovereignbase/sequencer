import type { CRListState, CRListStateEntry } from '../../.types/index.js'

/**
 * Removes a live entry from UUID and predecessor indexes.
 */
export function detachEntryFromIndexes<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>
): void {
  void crListReplica.parentMap.delete(linkedListEntry.uuidv7)
  const siblings = crListReplica.childrenMap.get(linkedListEntry.predecessor)
  if (siblings) {
    const index = siblings.indexOf(linkedListEntry)
    if (index !== -1) void siblings.splice(index, 1)
  }
  if (crListReplica.runNext) {
    // If this entry was a runNext target, remove the pointer to it.
    if (
      crListReplica.runNext.get(linkedListEntry.predecessor) === linkedListEntry
    )
      crListReplica.runNext.delete(linkedListEntry.predecessor)
    // If this entry pointed to a run successor, promote that successor to
    // childrenMap so rebuildLiveProjection can reach it via the detached
    // predecessor path.
    const runSuccessor = crListReplica.runNext.get(linkedListEntry.uuidv7)
    if (runSuccessor) {
      crListReplica.runNext.delete(linkedListEntry.uuidv7)
      const sibs = crListReplica.childrenMap.get(linkedListEntry.uuidv7)
      if (sibs) sibs.push(runSuccessor)
      else crListReplica.childrenMap.set(linkedListEntry.uuidv7, [runSuccessor])
    }
  }
}
