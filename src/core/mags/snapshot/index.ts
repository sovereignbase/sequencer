import { CRListError } from '../../../.errors/class.js'
import { CRListState, CRListSnapshot } from '../../../.types/type.js'

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
  return {
    values: Array.from(crListReplica.parentMap.values()).map(
      (linkedListEntry) => {
        if (!linkedListEntry) throw new CRListError('LIST_INTEGRITY_VIOLATION')
        return {
          id: linkedListEntry.id.toString(),
          value: linkedListEntry.value,
          predecessor: linkedListEntry.predecessor,
        }
      }
    ),
    tombstones: Array.from(crListReplica.tombstones),
  }
}
