import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../../../../.types/type.js'
import {
  attachBlockToEmptyReplica,
  attachBlockToIndexes,
  deleteBlock,
  getBlockEndId,
  getBlockStartIndex,
  isDeleted,
  linkBlockBetween,
  changePreviousBlockOf,
  seekCursorToIndex,
  splitBlock,
  splitCursorAtIndex,
  writeBlockChange,
} from '../../../../../.helpers/index.js'

/**
 * Replaces live values starting at an index with a prepared block.
 *
 * Replacement tombstones up to `block.items.length` existing values, then
 * links the new block into the same projection position.
 */
export function overwrite<T>(
  listIndex: number,
  block: NonNullable<CRListStateBlock<T>>,
  replica: CRListState<T>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  // Replacement length determines how many existing items can be overwritten.
  const length = block.items.length

  // Appending to end: treat like 'after' on the last element
  if (listIndex === replica.size) {
    // Empty-list append installs the first block.
    if (replica.size === 0) {
      void attachBlockToEmptyReplica<T>(replica, block, change, delta)
      return
    }

    // Seek to the current final live item so the append can anchor after it.
    void seekCursorToIndex<T>(replica, replica.size - 1)
    if (!replica.currentBlock) return

    // The cursor is now the append predecessor.
    const last = replica.currentBlock

    // Resolve the predecessor's live start index.
    const lastIndex = getBlockStartIndex(replica, last)
    if (lastIndex === undefined) return

    // The inserted block starts immediately after the predecessor.
    const insertedIndex = lastIndex + last.items.length

    // Anchor the appended block after the predecessor's final item id.
    block.previousBlockId = getBlockEndId(last)

    // Link, index, and publish the appended block.
    void linkBlockBetween<T>(last, block, undefined)
    void attachBlockToIndexes<T>(replica, block, delta)

    // Update tail and cursor metadata for the new last block.
    replica.lastBlock = block
    replica.currentBlock = block
    replica.currentBlockIndex = insertedIndex

    // Cache the new block's start index.
    void replica.blocksByIndex.set(insertedIndex, block)

    // Emit the appended values as visible local change entries.
    void writeBlockChange<T>(change, block, insertedIndex)

    // Size reflects all indexed live item ids.
    replica.size = replica.blocksById.size
    return
  }

  // Move the cursor to the first item being overwritten.
  void seekCursorToIndex<T>(replica, listIndex)
  if (!replica.currentBlock) return

  // Split the cursor so replacement starts on a whole-block boundary.
  const start = splitCursorAtIndex<T>(replica, listIndex)
  if (!start) return

  // Resolve the actual block start after any split.
  const actualIndex = getBlockStartIndex(replica, start)
  if (actualIndex === undefined) return

  // Capture the predecessor block and stable previousBlock anchor.
  const prev = start.previousBlock
  const previousBlock = prev ? getBlockEndId(prev) : 0n

  // Only overwrite values that exist after the actual replacement start.
  const deleteLimit = Math.min(length, replica.size - actualIndex)

  // Track how many live items have already been tombstoned.
  let deleted = 0

  // Walk through the live blocks being overwritten.
  let current: CRListStateBlock<T> = start

  // Tombstone full or partial blocks until the overwrite span is covered.
  while (current && deleted < deleteLimit) {
    // Remaining live item count that should be removed.
    const remaining = deleteLimit - deleted

    // Block segment selected for tombstoning in this iteration.
    let blockToDelete: NonNullable<CRListStateBlock<T>>

    // Delete whole block when it fits into the remaining overwrite span.
    if (current.items.length <= remaining) {
      blockToDelete = current
      current = current.nextBlock
    } else {
      // Split the last affected block so only overwritten values are deleted.
      const [left, right] = splitBlock<T>(replica, current, remaining)
      blockToDelete = left
      current = right
    }

    // deleteBlock records the tombstone range read by the re-anchor check below.
    void deleteBlock<T>(replica, blockToDelete, delta)

    // Advance deletion accounting by the tombstoned segment length.
    deleted += blockToDelete.items.length
  }

  // The replacement block inherits the overwritten span's predecessor anchor.
  block.previousBlockId = previousBlock

  // Link and index the replacement before any surviving right-hand block.
  void linkBlockBetween<T>(prev, block, current)
  void attachBlockToIndexes<T>(replica, block, delta)

  // Re-anchor the right neighbour if its previous anchor was tombstoned.
  if (current && isDeleted(replica.deletedRanges, current.previousBlockId))
    void changePreviousBlockOf<T>(replica, current, getBlockEndId(block), delta)

  // Update projection endpoints when replacement touches either edge.
  if (!prev) replica.firstBlock = block
  if (!current) replica.lastBlock = block

  // Move cursor and cache to the replacement block.
  replica.currentBlock = block
  replica.currentBlockIndex = actualIndex
  void replica.blocksByIndex.clear()
  void replica.blocksByIndex.set(actualIndex, block)

  // Emit replacement values as the visible local change.
  void writeBlockChange<T>(change, block, actualIndex)

  // Size reflects live item ids after tombstones and replacement insert.
  replica.size = replica.blocksById.size
}
