import type {
  CRListState,
  CRListStateEntry,
  CRListDelta,
} from '../../.types/index.js'

/**
 * Attaches a live entry to UUID and predecessor indexes.
 *
 * When a delta buffer is provided, the same live payload reference is appended
 * to the outgoing delta.
 */
export function attachEntryToIndexes<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  deltaBuf?: CRListDelta<T>
): void {
  void crListReplica.parentMap.set(linkedListEntry.uuidv7, linkedListEntry)
  const siblings = crListReplica.childrenMap.get(linkedListEntry.predecessor)
  if (siblings) {
    void siblings.push(linkedListEntry)
  } else {
    void crListReplica.childrenMap.set(linkedListEntry.predecessor, [
      linkedListEntry,
    ])
  }
  if (deltaBuf && !Array.isArray(deltaBuf.values)) deltaBuf.values = []
  if (deltaBuf?.values)
    void deltaBuf.values.push({
      uuidv7: linkedListEntry.uuidv7,
      value: linkedListEntry.value,
      predecessor: linkedListEntry.predecessor,
    })
}
