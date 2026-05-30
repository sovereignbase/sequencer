import {
  attachBlockToIndexes,
  deleteBlock,
  getBlockStartId,
  getBlockEndId,
  isDeleted,
  linkBlockBetween,
  changePreviousBlockOf,
  seekCursorToIndex,
  splitBlock,
  splitCursorAtIndex,
} from '../../../.helpers/index.js'
import { CRListError } from '../../../.errors/class.js'
import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../../.types/type.js'

/**
 * Deletes a range from the replica live view.
 *
 * @param replica - Replica to mutate.
 * @param startIndex - Inclusive start index. Defaults to `0`.
 * @param endIndex - Exclusive end index. Defaults to the current list size.
 * @returns - A local change and gossip delta, or `false` if nothing was deleted.
 */
export function __delete<T>(
  replica: CRListState<T>,
  startIndex?: number,
  endIndex?: number
): { change: CRListChange<T>; delta: CRListDelta<T> } | false {
  // Change records local visible removals; delta records tombstones for gossip.
  const change: CRListChange<T> = {}
  const delta: CRListDelta<T> = {}

  // Omitted start means delete from the beginning of the live projection.
  const listIndex = startIndex ?? 0

  // Omitted end means delete through the current live projection end.
  const targetEndIndex = endIndex ?? replica.size

  // Reject impossible ranges before touching cursor or index state.
  if (listIndex < 0 || targetEndIndex < listIndex || listIndex > replica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS')

  // Clamp deletion to the current size so oversized end indexes are harmless.
  const deleteCount = Math.min(targetEndIndex, replica.size) - listIndex

  // Empty ranges do not mutate state and produce no event payloads.
  if (deleteCount <= 0) return false

  // Position the cursor at the first live item that will be removed.
  void seekCursorToIndex<T>(replica, listIndex)

  // Defensive no-op for inconsistent empty state after cursor seeking.
  if (!replica.currentBlock) return false

  // Split the cursor so deletion starts exactly at a block boundary.
  const start = splitCursorAtIndex<T>(replica, listIndex)
  if (!start) return false

  // Capture the stable anchor that should precede any surviving right block.
  const previousBlockId = start.previousBlock
    ? getBlockEndId(start.previousBlock)
    : 0n

  // Track deleted item count across full and partial block removals.
  let deleted = 0

  // Track the visible index being marked undefined in the change patch.
  let currentIndex = listIndex

  // Walk through blocks starting at the first block to delete.
  let current: CRListStateBlock<T> = start

  // Delete full blocks until the requested item count has been removed.
  while (current && deleted < deleteCount) {
    // Number of items still required to satisfy the delete range.
    const remaining = deleteCount - deleted

    // The concrete block segment that will be tombstoned this iteration.
    let blockToDelete: NonNullable<CRListStateBlock<T>>

    // Delete the whole block when it fits inside the remaining range.
    if (current.items.length <= remaining) {
      blockToDelete = current
      current = current.nextBlock
    } else {
      // Partial last block: split, delete the first `remaining` elements
      const [leftPart, rightPart] = splitBlock(replica, current, remaining)
      blockToDelete = leftPart
      current = rightPart
    }

    // Mark each removed visible index as deleted for change-event consumers.
    const blockLength = blockToDelete.items.length
    for (let index = 0; index < blockLength; index++)
      change[currentIndex + index] = undefined

    // Remove stale block-start cache entry before tombstoning the block.
    void replica.blocksByIndex.delete(currentIndex)

    // deleteBlock records the tombstone range the re-anchor checks read below.
    void deleteBlock<T>(replica, blockToDelete, delta)

    // Advance deletion accounting and visible index position.
    deleted += blockLength
    currentIndex += blockLength
  }

  // If the block immediately after the deleted range has a deleted previousBlock,
  // delete it and create a re-anchored replacement.
  if (current && isDeleted(replica.deletedRanges, current.previousBlockId)) {
    // Allocate a replacement block so the survivor can anchor to live history.
    const replacementId = getBlockStartId(replica, current.items.length)

    // Copy the surviving items into a new block with the captured live anchor.
    const replacement: NonNullable<CRListStateBlock<T>> = {
      id: replacementId,
      idString: replacementId.toString(),
      items: current.items,
      previousBlockId: previousBlockId,
      previousBlock: undefined,
      nextBlock: undefined,
    }

    // Preserve neighbour references before deleting the old surviving block.
    const prev = current.previousBlock
    const next = current.nextBlock

    // deleteBlock records current's tombstone range used by the next check.
    void deleteBlock<T>(replica, current, delta)

    // Put the replacement into the same projection position.
    void linkBlockBetween<T>(prev, replacement, next)

    // Index and emit the replacement block through the delta.
    void attachBlockToIndexes<T>(replica, replacement, delta)

    // Update projection endpoints when replacement touches either edge.
    if (!prev) replica.firstBlock = replacement
    if (!next) replica.lastBlock = replacement

    // Re-anchor the next block too when its anchor was also tombstoned.
    if (next && isDeleted(replica.deletedRanges, next.previousBlockId))
      void changePreviousBlockOf<T>(
        replica,
        next,
        getBlockEndId(replacement),
        delta
      )

    // Leave cursor recovery below pointing at the live replacement block.
    current = replacement
  }

  // Size equals the number of indexed live item ids after tombstoning.
  replica.size = replica.blocksById.size

  // Prefer the next live block as cursor, otherwise keep any surviving cursor.
  replica.currentBlock = current ?? replica.currentBlock

  // Reconstruct cursor start index for the post-delete cursor state.
  replica.currentBlockIndex = current
    ? listIndex
    : replica.currentBlock
      ? Math.max(0, replica.size - replica.currentBlock.items.length)
      : undefined

  // Clear stale absolute indexes; only the cursor start is known cheaply here.
  void replica.blocksByIndex.clear()

  // Cache the current block's start index when a live cursor exists.
  if (replica.currentBlock && replica.currentBlockIndex !== undefined)
    void replica.blocksByIndex.set(
      replica.currentBlockIndex,
      replica.currentBlock
    )

  // Return the live-view patch and tombstone delta to the caller.
  return { change, delta }
}
