import type { CRListState, CRListStateBlock } from '../../.types/type.js'

/**
 * Splits a block at an item offset, returning `[left, right]`.
 *
 * The right block starts at the virtual item id `block.id + offset`; its
 * previousBlock is the left block's last item id.
 */
export function splitBlock<T>(
  crListReplica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>,
  offset: number
): [NonNullable<CRListStateBlock<T>>, NonNullable<CRListStateBlock<T>>] {
  // Offsets outside the interior cannot produce two distinct blocks.
  if (offset <= 0 || offset >= block.items.length) return [block, block]

  // The right block starts at the virtual id for the split offset.
  const rightId = block.id + BigInt(offset)

  // Left block keeps the original id, anchor, and previous projection link.
  const left: NonNullable<CRListStateBlock<T>> = {
    id: block.id,
    idString: block.idString,
    items: block.items.slice(0, offset),
    previousBlockId: block.previousBlockId,
    previousBlock: block.previousBlock,
    nextBlock: undefined,
  }

  // Right block owns the suffix items and anchors after the left block's tail id.
  const right: NonNullable<CRListStateBlock<T>> = {
    id: rightId,
    idString: rightId.toString(),
    items: block.items.slice(offset),
    previousBlockId: rightId - 1n,
    previousBlock: left,
    nextBlock: block.nextBlock,
  }

  // Link the two replacement blocks together.
  left.nextBlock = right

  // Patch the original previous neighbour to the left replacement.
  if (block.previousBlock) block.previousBlock.nextBlock = left

  // Patch the original next neighbour back to the right replacement.
  if (block.nextBlock) block.nextBlock.previousBlock = right

  // Preserve projection endpoints when the original block was an edge.
  if (crListReplica.firstBlock === block) crListReplica.firstBlock = left
  if (crListReplica.lastBlock === block) crListReplica.lastBlock = right

  // Remove all old item-id index entries that pointed at the unsplit block.
  for (let itemOffset = 0; itemOffset < block.items.length; itemOffset++)
    void crListReplica.blocksById.delete(block.id + BigInt(itemOffset))

  // Index every left-side item id to the left replacement block.
  for (let itemOffset = 0; itemOffset < left.items.length; itemOffset++)
    void crListReplica.blocksById.set(left.id + BigInt(itemOffset), left)

  // Index every right-side item id to the right replacement block.
  for (let itemOffset = 0; itemOffset < right.items.length; itemOffset++)
    void crListReplica.blocksById.set(right.id + BigInt(itemOffset), right)

  // Replace the original block in its existing previousBlock sibling bucket.
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    block.previousBlockId
  )
  if (siblings) {
    const index = siblings.indexOf(block)
    if (index !== -1) siblings[index] = left
  }

  // Add the right block to the sibling bucket keyed by its new anchor.
  const rightSiblings = crListReplica.blocksByPreviousBlockId.get(
    right.previousBlockId
  )
  if (rightSiblings) {
    // Avoid duplicate bucket entries when splitBlock is called repeatedly.
    if (!rightSiblings.includes(right)) void rightSiblings.push(right)
  } else {
    // Create the right block bucket when no siblings share its anchor yet.
    void crListReplica.blocksByPreviousBlockId.set(right.previousBlockId, [
      right,
    ])
  }

  // Keep the cursor on the left replacement when it pointed at the old block.
  if (crListReplica.currentBlock === block) crListReplica.currentBlock = left

  // Splitting changes block boundaries, so absolute block-start cache is stale.
  void crListReplica.blocksByIndex.clear()

  // Return both replacement blocks to the caller.
  return [left, right]
}
