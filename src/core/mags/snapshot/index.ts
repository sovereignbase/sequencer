import { CRListState, CRListSnapshot } from '../../../.types/type.js'
import { getEntryTailId } from '../../../.helpers/index.js'

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
  let block =
    crListReplica.head ?? crListReplica.cache.get(0) ?? crListReplica.cursor
  while (block?.prev) block = block.prev
  let previous = block?.prev
  while (block) {
    const predecessor =
      block.predecessor === 0n
        ? '0'
        : previous && block.predecessor === getEntryTailId(previous)
          ? previous.values.length === 1
            ? previous.idString
            : block.predecessor.toString()
          : block.predecessor.toString()
    void values.push({
      id: block.idString,
      values: block.values,
      predecessor,
    })
    previous = block
    block = block.next
  }
  return {
    values,
    tombstones: Array.from(crListReplica.tombstones),
  }
}
