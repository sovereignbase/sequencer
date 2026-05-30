import type {
  CRListState,
  CRListStateBlock,
  CRListDelta,
} from '../../.types/type.js'

/**
 * Attaches a live block to item-id and previousBlock indexes.
 *
 * Each item in a block has a virtual id derived from the block start id. The
 * block itself is stored under every contained item id so item-targeted merges
 * and deletes can locate the containing block in O(1).
 */
export function attachBlockToIndexes<T>(
  crListReplica: CRListState<T>,
  linkedListBlock: NonNullable<CRListStateBlock<T>>,
  deltaObject?: CRListDelta<T>
): void {
  const { id, items, previousBlockId } = linkedListBlock
  for (let blockOffset = 0; blockOffset < items.length; blockOffset++)
    void crListReplica.blocksById.set(id + BigInt(blockOffset), linkedListBlock)
  const siblings: Array<NonNullable<CRListStateBlock<T>>> | undefined =
    crListReplica.blocksByPreviousBlockId.get(previousBlockId)
  if (siblings) {
    void siblings.push(linkedListBlock)
  } else {
    void crListReplica.blocksByPreviousBlockId.set(previousBlockId, [
      linkedListBlock,
    ])
  }

  if (!deltaObject) return
  void (deltaObject.blocks ??= []).push({
    id: linkedListBlock.idString,
    items,
    previousBlockId: previousBlockId.toString(),
  })
}
