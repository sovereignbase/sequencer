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
  splitCursorAtIndex,
  writeBlockChange,
} from '../../../../../.helpers/index.js'

/**
 * Inserts a prepared block before a target live index.
 *
 * The inserted block inherits the target block's previous anchor, then the
 * target block is re-anchored after the inserted block when needed.
 */
export function before<T>(
  listIndex: number,
  block: NonNullable<CRListStateBlock<T>>,
  replica: CRListState<T>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  // Empty-list insertion before index 0 installs the first live block.
  if (replica.size === 0 && listIndex === 0) {
    void attachBlockToEmptyReplica<T>(replica, block, change, delta)
    return
  }

  // Move the cursor onto the block that contains the target live index.
  void seekCursorToIndex<T>(replica, listIndex)
  if (!replica.currentBlock) return

  // Split the cursor so insertion starts exactly before a whole block.
  const insertBefore = splitCursorAtIndex<T>(replica, listIndex)
  if (!insertBefore) return

  // Capture the projection predecessor, if the target block has one.
  const prev = insertBefore.previousBlock

  // The new block should anchor where the target block previously anchored.
  const previousBlock = prev ? getBlockEndId(prev) : 0n

  // Resolve the visible index where the new block will begin.
  const insertedIndex = getBlockStartIndex(replica, insertBefore)
  if (insertedIndex === undefined) return

  // Assign the stable CRDT anchor before indexing the new block.
  block.previousBlockId = previousBlock

  // Link the new block immediately before the target block.
  void linkBlockBetween<T>(prev, block, insertBefore)

  // Index the new block and include it in the outbound delta.
  void attachBlockToIndexes<T>(replica, block, delta)

  // Move the original target block after the inserted block when it shared anchor.
  if (insertBefore.previousBlockId === previousBlock)
    void changePreviousBlockOf<T>(
      replica,
      insertBefore,
      getBlockEndId(block),
      delta
    )

  // Update the projection head when the insertion happened at index 0.
  if (!prev) replica.firstBlock = block

  // Keep cursor and cache focused on the inserted block.
  replica.currentBlock = block
  replica.currentBlockIndex = insertedIndex

  // Middle insertion shifts later indexes, so clear stale cache entries.
  void replica.blocksByIndex.clear()

  // Cache the inserted block's exact visible start index.
  void replica.blocksByIndex.set(insertedIndex, block)

  // Emit inserted values as an index-keyed local change.
  void writeBlockChange<T>(change, block, insertedIndex)

  // Live size is derived from the indexed live item ids.
  replica.size = replica.blocksById.size
}
