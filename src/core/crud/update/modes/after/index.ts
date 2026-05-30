import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../../../../.types/type.js'
import {
  attachBlockToEmptyReplica,
  attachBlockToIndexes,
  getBlockEndId,
  getBlockStartIndex,
  linkBlockBetween,
  changePreviousBlockOf,
  seekCursorToIndex,
  splitCursorAfterIndex,
  writeBlockChange,
} from '../../../../../.helpers/index.js'

/**
 * Inserts a prepared block after a target live index.
 *
 * This mode preserves the target item and anchors the new block to the target
 * block's final item id after any needed cursor split.
 */
export function after<T>(
  listIndex: number,
  block: NonNullable<CRListStateBlock<T>>,
  replica: CRListState<T>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  // Empty-list insertion after index 0 is the same as installing the first block.
  if (replica.size === 0 && listIndex === 0) {
    void attachBlockToEmptyReplica<T>(replica, block, change, delta)
    return
  }

  // Appending at size needs the last live item as the seek target.
  const seekTo = listIndex === replica.size ? replica.size - 1 : listIndex

  // Move the cursor onto the block that contains the insertion anchor.
  void seekCursorToIndex<T>(replica, seekTo)
  if (!replica.currentBlock) return

  // Split the cursor so the insertion point is between whole blocks.
  const boundary = splitCursorAfterIndex<T>(replica, listIndex)
  if (!boundary) return

  // `insertAfter` is the block immediately before the new block.
  const { block: insertAfter, next } = boundary

  // Resolve absolute index where the inserted block will become visible.
  const insertAfterIndex = getBlockStartIndex(replica, insertAfter)
  if (insertAfterIndex === undefined) return
  const insertedIndex = insertAfterIndex + insertAfter.items.length

  // Anchor the new block after the final item id of the preceding block.
  block.previousBlockId = getBlockEndId(insertAfter)

  // Link the new block into the local live projection.
  void linkBlockBetween<T>(insertAfter, block, next)

  // Index the block and append it to the outbound delta.
  void attachBlockToIndexes<T>(replica, block, delta)

  // If the right neighbour had the same old anchor, move it after the new block.
  if (next && next.previousBlockId === block.previousBlockId)
    void changePreviousBlockOf<T>(replica, next, getBlockEndId(block), delta)

  // Keep the projection tail accurate for append operations.
  if (!next) replica.lastBlock = block

  // Move the cursor to the inserted block for likely follow-up writes.
  replica.currentBlock = block
  replica.currentBlockIndex = insertedIndex

  // A middle insertion invalidates other absolute block-start cache entries.
  if (next) void replica.blocksByIndex.clear()

  // Cache the exact start index of the inserted block.
  void replica.blocksByIndex.set(insertedIndex, block)

  // Emit inserted values as a visible index-keyed change.
  void writeBlockChange<T>(change, block, insertedIndex)

  // Live size is tracked by indexed live item ids.
  replica.size = replica.blocksById.size
}
