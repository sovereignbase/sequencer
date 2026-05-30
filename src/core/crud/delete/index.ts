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
  const change: CRListChange<T> = {}
  const delta: CRListDelta<T> = {}
  const listIndex = startIndex ?? 0
  const targetEndIndex = endIndex ?? replica.size
  if (listIndex < 0 || targetEndIndex < listIndex || listIndex > replica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS')
  const deleteCount = Math.min(targetEndIndex, replica.size) - listIndex
  if (deleteCount <= 0) return false

  void seekCursorToIndex<T>(replica, listIndex)
  if (!replica.currentBlock) return false

  const start = splitCursorAtIndex<T>(replica, listIndex)
  if (!start) return false

  const previousBlockId = start.previousBlock
    ? getBlockEndId(start.previousBlock)
    : 0n
  let deleted = 0
  let currentIndex = listIndex

  let current: CRListStateBlock<T> = start

  while (current && deleted < deleteCount) {
    const remaining = deleteCount - deleted
    let blockToDelete: NonNullable<CRListStateBlock<T>>

    if (current.items.length <= remaining) {
      blockToDelete = current
      current = current.nextBlock
    } else {
      // Partial last block: split, delete the first `remaining` elements
      const [leftPart, rightPart] = splitBlock(replica, current, remaining)
      blockToDelete = leftPart
      current = rightPart
    }

    const blockLength = blockToDelete.items.length
    for (let index = 0; index < blockLength; index++)
      change[currentIndex + index] = undefined

    void replica.blocksByIndex.delete(currentIndex)
    // deleteBlock records the tombstone range the re-anchor checks read below.
    void deleteBlock<T>(replica, blockToDelete, delta)
    deleted += blockLength
    currentIndex += blockLength
  }

  // If the block immediately after the deleted range has a deleted previousBlock,
  // delete it and create a re-anchored replacement.
  if (current && isDeleted(replica.deletedRanges, current.previousBlockId)) {
    const replacementId = getBlockStartId(replica, current.items.length)
    const replacement: NonNullable<CRListStateBlock<T>> = {
      id: replacementId,
      idString: replacementId.toString(),
      items: current.items,
      previousBlockId: previousBlockId,
      previousBlock: undefined,
      nextBlock: undefined,
    }
    const prev = current.previousBlock
    const next = current.nextBlock
    // deleteBlock records current's tombstone range used by the next check.
    void deleteBlock<T>(replica, current, delta)
    void linkBlockBetween<T>(prev, replacement, next)
    void attachBlockToIndexes<T>(replica, replacement, delta)
    if (!prev) replica.firstBlock = replacement
    if (!next) replica.lastBlock = replacement
    if (next && isDeleted(replica.deletedRanges, next.previousBlockId))
      void changePreviousBlockOf<T>(
        replica,
        next,
        getBlockEndId(replacement),
        delta
      )
    current = replacement
  }

  replica.size = replica.blocksById.size
  replica.currentBlock = current ?? replica.currentBlock
  replica.currentBlockIndex = current
    ? listIndex
    : replica.currentBlock
      ? Math.max(0, replica.size - replica.currentBlock.items.length)
      : undefined
  void replica.blocksByIndex.clear()
  if (replica.currentBlock && replica.currentBlockIndex !== undefined)
    void replica.blocksByIndex.set(
      replica.currentBlockIndex,
      replica.currentBlock
    )

  return { change, delta }
}
