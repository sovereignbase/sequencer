import type { CRListState, CRListStateBlock } from '../../.types/type.js'

/**
 * Removes a live block from item-id and previousBlock indexes.
 */
export function detachBlockFromIndexes<T>(
  crListReplica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>
): void {
  // Remove every virtual item id owned by the block.
  for (let itemOffset = 0; itemOffset < block.items.length; itemOffset++)
    void crListReplica.blocksById.delete(block.id + BigInt(itemOffset))

  // Locate the stable-anchor sibling bucket that contains this block.
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    block.previousBlockId
  )

  // Remove the block from its sibling bucket if the bucket is present.
  if (siblings) {
    const index = siblings.indexOf(block)
    if (index !== -1) void siblings.splice(index, 1)
  }
}
