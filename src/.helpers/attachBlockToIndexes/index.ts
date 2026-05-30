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
  // Destructure the stable id range and anchor used by both indexes.
  const { id, items, previousBlockId } = linkedListBlock

  // Map every virtual item id in the block back to its containing block.
  for (let blockOffset = 0; blockOffset < items.length; blockOffset++)
    void crListReplica.blocksById.set(id + BigInt(blockOffset), linkedListBlock)

  // Fetch the sibling bucket for blocks sharing the same stable anchor.
  const siblings: Array<NonNullable<CRListStateBlock<T>>> | undefined =
    crListReplica.blocksByPreviousBlockId.get(previousBlockId)

  // Append to an existing bucket or create the bucket if this is first sibling.
  if (siblings) {
    void siblings.push(linkedListBlock)
  } else {
    void crListReplica.blocksByPreviousBlockId.set(previousBlockId, [
      linkedListBlock,
    ])
  }

  // Local-only indexing is complete when no outbound delta is being built.
  if (!deltaObject) return

  // Add a snapshot-shaped block record to the outbound delta.
  void (deltaObject.blocks ??= []).push({
    id: linkedListBlock.idString,
    items,
    previousBlockId: previousBlockId.toString(),
  })
}
