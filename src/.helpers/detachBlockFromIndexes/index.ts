import type { CRListState, CRListStateBlock } from '../../.types/type.js'

/**
 * Removes a live block from item-id and previousBlock indexes.
 */
export function detachBlockFromIndexes<T>(
  crListReplica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>
): void {
  for (let itemOffset = 0; itemOffset < block.items.length; itemOffset++)
    void crListReplica.blocksById.delete(block.id + BigInt(itemOffset))
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    block.previousBlockId
  )
  if (siblings) {
    const index = siblings.indexOf(block)
    if (index !== -1) void siblings.splice(index, 1)
  }
}
