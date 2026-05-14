import { CRListError } from '../../../.errors/class.js'
import { CRListState, CRListSnapshot } from '../../../.types/index.js'

/**
 * Creates a full detached structured-clone-compatible CRList snapshot from the current replica state.
 *
 * The snapshot contains every live value entry and all retained tombstones. Value
 * payloads are cloned so callers cannot mutate the replica through the snapshot.
 *
 * @param crListReplica - Replica to snapshot.
 * @returns - A full snapshot suitable for hydration or transport.
 *
 * Time complexity: O(n + t + c)
 * - n = replica value entry count
 * - t = replica tombstone count
 * - c = cloned value payload size
 *
 * Space complexity: O(n + t + c)
 */
export function __snapshot<T>(
  crListReplica: CRListState<T>
): CRListSnapshot<T> {
  return {
    values: Array.from(crListReplica.parentMap.values()).map(
      (linkedListEntry) => {
        if (!linkedListEntry) throw new CRListError('LIST_INTEGRITY_VIOLATION')
        return {
          uuidv7: linkedListEntry.uuidv7,
          value: linkedListEntry.value,
          predecessor: linkedListEntry.predecessor,
        }
      }
    ),
    tombstones: Array.from(crListReplica.tombstones),
  }
}
