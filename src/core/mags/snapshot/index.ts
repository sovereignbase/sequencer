import { CRListError } from '../../../.errors/class.js'
import { CRListReplica, CRListSnapshot } from '../../../.types/index.js'

/**
 * Time complexity: O(n + t + c)
 * - n = replica value entry count
 * - t = replica tombstone count
 * - c = cloned value payload size
 *
 * Space complexity: O(n + t + c)
 */
export function __snapshot<T>(
  crListReplica: CRListReplica<T>
): CRListSnapshot<T> {
  return {
    values: Array.from(crListReplica.parentMap.values()).map(
      (linkedListEntry) => {
        if (!linkedListEntry) throw new CRListError('LIST_INTEGRITY_VIOLATION')
        return {
          uuidv7: linkedListEntry.uuidv7,
          value: structuredClone(linkedListEntry.value),
          predecessor: linkedListEntry.predecessor,
        }
      }
    ),
    tombstones: Array.from(crListReplica.tombstones),
  }
}
