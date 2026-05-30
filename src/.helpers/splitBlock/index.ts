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

  // Keep immutable-looking metadata before mutating the original block.
  const originalId = block.id
  const originalIdString = block.idString
  const originalItems = block.items
  const originalPreviousBlockId = block.previousBlockId
  const originalPreviousBlock = block.previousBlock
  const originalNextBlock = block.nextBlock

  // Update only the smaller side of the item-id index.
  const keepRight = offset <= originalItems.length - offset

  // Left block is either new or the original object, depending on update cost.
  let left: NonNullable<CRListStateBlock<T>>

  // Right block is either the original object or a new suffix object.
  let right: NonNullable<CRListStateBlock<T>>

  if (keepRight) {
    // Create a new prefix block and keep suffix item-id entries on `block`.
    left = {
      id: originalId,
      idString: originalIdString,
      items: originalItems.slice(0, offset),
      previousBlockId: originalPreviousBlockId,
      previousBlock: originalPreviousBlock,
      nextBlock: block,
    }

    // Mutate the original block into the right suffix.
    block.id = rightId
    block.idString = rightId.toString()
    block.items = originalItems.slice(offset)
    block.previousBlockId = rightId - 1n
    block.previousBlock = left
    block.nextBlock = originalNextBlock
    right = block

    // Only prefix ids need to be repointed away from the original block.
    for (let itemOffset = 0; itemOffset < left.items.length; itemOffset++)
      void crListReplica.blocksById.set(left.id + BigInt(itemOffset), left)

    // Replace the original block in its old previousBlock sibling bucket.
    const siblings = crListReplica.blocksByPreviousBlockId.get(
      originalPreviousBlockId
    )
    if (siblings) {
      const index = siblings.indexOf(block)
      if (index !== -1) siblings[index] = left
    }
  } else {
    // Keep prefix item-id entries on the original block.
    left = block

    // Create a new suffix block for the smaller side.
    right = {
      id: rightId,
      idString: rightId.toString(),
      items: originalItems.slice(offset),
      previousBlockId: rightId - 1n,
      previousBlock: left,
      nextBlock: originalNextBlock,
    }

    // Mutate the original block into the left prefix.
    left.items = originalItems.slice(0, offset)
    left.nextBlock = right

    // Only suffix ids need to be repointed away from the original block.
    for (let itemOffset = 0; itemOffset < right.items.length; itemOffset++)
      void crListReplica.blocksById.set(right.id + BigInt(itemOffset), right)
  }

  // Patch the original previous neighbour to the left block.
  if (originalPreviousBlock) originalPreviousBlock.nextBlock = left

  // Patch the original next neighbour back to the right block.
  if (originalNextBlock) originalNextBlock.previousBlock = right

  // Link the split pair together.
  left.nextBlock = right
  right.previousBlock = left

  // Preserve projection endpoints when the original block was an edge.
  if (crListReplica.firstBlock === block) crListReplica.firstBlock = left
  if (crListReplica.lastBlock === block) crListReplica.lastBlock = right

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
