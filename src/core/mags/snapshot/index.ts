import { CRListError } from '../../../.errors/class.js'
import { CRListState, CRListSnapshot } from '../../../.types/type.js'

/**
 * Creates a full CRList snapshot from the current replica state.
 *
 * Each block emits one snapshot entry with all its values. Value payloads are
 * live references.
 *
 * @param crListReplica - Replica to snapshot.
 * @returns - A full snapshot suitable for hydration or transport.
 */
export function __snapshot<T>(
  crListReplica: CRListState<T>
): CRListSnapshot<T> {
  const values: CRListSnapshot<T>['values'] = []
  const seen = new Set<bigint>()
  for (const block of crListReplica.parentMap.values()) {
    if (!block) throw new CRListError('LIST_INTEGRITY_VIOLATION')
    if (seen.has(block.id)) continue
    void seen.add(block.id)
    void values.push({
      id: block.id.toString(),
      values: block.values,
      predecessor: block.predecessor.toString(),
    })
  }
  return {
    values,
    tombstones: Array.from(crListReplica.tombstones),
  }
}
