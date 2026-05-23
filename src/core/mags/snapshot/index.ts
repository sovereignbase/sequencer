import { CRListError } from '../../../.errors/class.js'
import { CRListState, CRListSnapshot } from '../../../.types/index.js'

/**
 * Creates a full CRList snapshot from the current replica state.
 *
 * The snapshot contains every live value entry and all retained tombstones. Value
 * payloads are live references, so callers must not mutate snapshot values
 * unless they have first isolated them from replica state.
 *
 * @param crListReplica - Replica to snapshot.
 * @returns - A full snapshot suitable for hydration or transport.
 *
 * Time complexity: O(n + t)
 * - n = replica value entry count
 * - t = replica tombstone count
 *
 * Space complexity: O(n + t)
 */
export function __snapshot<T>(
  crListReplica: CRListState<T>
): CRListSnapshot<T> {
  const values: CRListSnapshot<T>['values'] = []
  for (const linkedListEntry of crListReplica.parentMap.values()) {
    if (!linkedListEntry) throw new CRListError('LIST_INTEGRITY_VIOLATION')
    void values.push({
      uuidv7: linkedListEntry.uuidv7,
      value: linkedListEntry.value,
      predecessor: linkedListEntry.predecessor,
    })
  }
  return {
    values,
    tombstones: Array.from(crListReplica.tombstones),
  }
}
