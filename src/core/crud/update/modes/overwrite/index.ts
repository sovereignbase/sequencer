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

export function overwrite<T>(
  listIndex: number,
  block: NonNullable<CRListStateBlock<T>>,
  replica: CRListState<T>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  const length = block.items.length

  // Appending to end: treat like 'after' on the last element
  if (listIndex === replica.size) {
    if (replica.size === 0) {
      void attachBlockToEmptyReplica<T>(replica, block, change, delta)
      return
    }
    void seekCursorToIndex<T>(replica, replica.size - 1)
    if (!replica.currentBlock) return
    const last = replica.currentBlock
    const lastIndex = getBlockStartIndex(replica, last)
    if (lastIndex === undefined) return
    const insertedIndex = lastIndex + last.items.length
    block.previousBlockId = getBlockEndId(last)
    void linkBlockBetween<T>(last, block, undefined)
    void attachBlockToIndexes<T>(replica, block, delta)
    replica.lastBlock = block
    replica.currentBlock = block
    replica.currentBlockIndex = insertedIndex
    void replica.blocksByIndex.set(insertedIndex, block)
    void writeBlockChange<T>(change, block, insertedIndex)
    replica.size = replica.blocksById.size
    return
  }

  void seekCursorToIndex<T>(replica, listIndex)
  if (!replica.currentBlock) return

  const start = splitCursorAtIndex<T>(replica, listIndex)
  if (!start) return

  const actualIndex = getBlockStartIndex(replica, start)
  if (actualIndex === undefined) return
  const prev = start.previousBlock
  const previousBlock = prev ? getBlockEndId(prev) : 0n
  const deleteLimit = Math.min(length, replica.size - actualIndex)
  let deleted = 0
  let current: CRListStateBlock<T> = start

  while (current && deleted < deleteLimit) {
    const remaining = deleteLimit - deleted
    let blockToDelete: NonNullable<CRListStateBlock<T>>

    if (current.items.length <= remaining) {
      blockToDelete = current
      current = current.nextBlock
    } else {
      const [left, right] = splitBlock<T>(replica, current, remaining)
      blockToDelete = left
      current = right
    }

    // deleteBlock records the tombstone range read by the re-anchor check below.
    void deleteBlock<T>(replica, blockToDelete, delta)
    deleted += blockToDelete.items.length
  }

  block.previousBlockId = previousBlock

  void linkBlockBetween<T>(prev, block, current)
  void attachBlockToIndexes<T>(replica, block, delta)
  if (current && isDeleted(replica.deletedRanges, current.previousBlockId))
    void changePreviousBlockOf<T>(replica, current, getBlockEndId(block), delta)

  if (!prev) replica.firstBlock = block
  if (!current) replica.lastBlock = block
  replica.currentBlock = block
  replica.currentBlockIndex = actualIndex
  void replica.blocksByIndex.clear()
  void replica.blocksByIndex.set(actualIndex, block)
  void writeBlockChange<T>(change, block, actualIndex)
  replica.size = replica.blocksById.size
}
