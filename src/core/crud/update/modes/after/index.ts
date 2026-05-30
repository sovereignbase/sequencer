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

export function after<T>(
  listIndex: number,
  block: NonNullable<CRListStateBlock<T>>,
  replica: CRListState<T>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  if (replica.size === 0 && listIndex === 0) {
    void attachBlockToEmptyReplica<T>(replica, block, change, delta)
    return
  }

  const seekTo = listIndex === replica.size ? replica.size - 1 : listIndex
  void seekCursorToIndex<T>(replica, seekTo)
  if (!replica.currentBlock) return

  const boundary = splitCursorAfterIndex<T>(replica, listIndex)
  if (!boundary) return
  const { block: insertAfter, next } = boundary

  const insertAfterIndex = getBlockStartIndex(replica, insertAfter)
  if (insertAfterIndex === undefined) return
  const insertedIndex = insertAfterIndex + insertAfter.items.length
  block.previousBlockId = getBlockEndId(insertAfter)

  void linkBlockBetween<T>(insertAfter, block, next)

  void attachBlockToIndexes<T>(replica, block, delta)
  if (next && next.previousBlockId === block.previousBlockId)
    void changePreviousBlockOf<T>(replica, next, getBlockEndId(block), delta)
  if (!next) replica.lastBlock = block
  replica.currentBlock = block
  replica.currentBlockIndex = insertedIndex

  if (next) void replica.blocksByIndex.clear()
  void replica.blocksByIndex.set(insertedIndex, block)

  void writeBlockChange<T>(change, block, insertedIndex)
  replica.size = replica.blocksById.size
}
