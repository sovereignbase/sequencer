import type {
  CRListState,
  CRListStateEntry,
  CRListDelta,
} from '../../.types/type.js'

/**
 * Attaches a live entry to id and predecessor indexes.
 *
 * When a delta buffer is provided, a single multi-value entry is appended to
 * the outgoing delta.
 */
export function attachEntryToIndexes<T>(
  crListReplica: CRListState<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  deltaBuf?: CRListDelta<T>
): void {
  const { id, values, predecessor } = linkedListEntry
  for (let entryOffset = 0; entryOffset < values.length; entryOffset++)
    void crListReplica.parentMap.set(id + BigInt(entryOffset), linkedListEntry)
  const siblings = crListReplica.childrenMap.get(predecessor)
  if (siblings) {
    void siblings.push(linkedListEntry)
  } else {
    void crListReplica.childrenMap.set(predecessor, [linkedListEntry])
  }
  if (deltaBuf) {
    if (!Array.isArray(deltaBuf.values)) deltaBuf.values = []
    void deltaBuf.values.push({
      id: linkedListEntry.idStr,
      values,
      predecessor: predecessor.toString(),
    })
  }
}
