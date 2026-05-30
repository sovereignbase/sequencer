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

export function before<T>(
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

  void seekCursorToIndex<T>(replica, listIndex)
  if (!replica.currentBlock) return

  const insertBefore = splitCursorAtIndex<T>(replica, listIndex)
  if (!insertBefore) return
  const prev = insertBefore.previousBlock
  const previousBlock = prev ? getBlockEndId(prev) : 0n
  const insertedIndex = getBlockStartIndex(replica, insertBefore)
  if (insertedIndex === undefined) return

  block.previousBlockId = previousBlock

  void linkBlockBetween<T>(prev, block, insertBefore)

  void attachBlockToIndexes<T>(replica, block, delta)
  if (insertBefore.previousBlockId === previousBlock)
    void changePreviousBlockOf<T>(
      replica,
      insertBefore,
      getBlockEndId(block),
      delta
    )
  if (!prev) replica.firstBlock = block
  replica.currentBlock = block
  replica.currentBlockIndex = insertedIndex

  void replica.blocksByIndex.clear()
  void replica.blocksByIndex.set(insertedIndex, block)

  void writeBlockChange<T>(change, block, insertedIndex)
  replica.size = replica.blocksById.size
}
