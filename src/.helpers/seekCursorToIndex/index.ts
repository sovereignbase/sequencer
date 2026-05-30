import type { CRListState, CRListStateBlock } from '../../.types/type.js'
import { CRListError } from '../../.errors/class.js'
import { nearestOf3Numbers } from '../nearestOf3Numbers/index.js'

/**
 * Moves the replica cursor to a live index.
 *
 * Starting point is chosen as the nearest of: first block, last block, or the
 * current block cursor. A valid block-start cache entry shortcuts the walk.
 *
 * `currentBlockIndex` always stores the block-start of the cursor after this
 * call.
 */
export function seekCursorToIndex<T>(
  replica: CRListState<T>,
  targetIndex: number
): void {
  if (targetIndex < 0 || targetIndex >= replica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS', 'Index out of bounds')

  // Exact block-start hits avoid walking.
  const indexedBlock: CRListStateBlock<T> =
    replica.blocksByIndex.get(targetIndex)
  if (indexedBlock) {
    replica.currentBlock = indexedBlock
    replica.currentBlockIndex = targetIndex
    return
  }

  if (
    !replica.firstBlock ||
    !replica.currentBlock ||
    !replica.lastBlock ||
    replica.currentBlockIndex === undefined
  )
    throw new CRListError('LIST_EMPTY', 'List is empty')

  const lastBlockIndex: number = replica.size - replica.lastBlock.items.length

  let currentBlockIndex: number = nearestOf3Numbers(
    targetIndex,
    0,
    replica.currentBlockIndex,
    lastBlockIndex
  )

  if (currentBlockIndex === 0 && replica.firstBlock !== replica.currentBlock)
    replica.currentBlock = replica.firstBlock
  else if (
    currentBlockIndex === lastBlockIndex &&
    replica.lastBlock !== replica.currentBlock
  )
    replica.currentBlock = replica.lastBlock
  else currentBlockIndex = replica.currentBlockIndex

  const direction: 'prev' | 'next' =
    currentBlockIndex > targetIndex ? 'prev' : 'next'

  while (replica.currentBlock) {
    const blockEnd = currentBlockIndex + replica.currentBlock.items.length
    if (currentBlockIndex <= targetIndex && targetIndex < blockEnd) {
      replica.currentBlockIndex = currentBlockIndex
      void replica.blocksByIndex.set(currentBlockIndex, replica.currentBlock)
      return
    }
    if (direction === 'next') {
      currentBlockIndex += replica.currentBlock.items.length
      replica.currentBlock = replica.currentBlock.nextBlock
    } else if (replica.currentBlock.previousBlock) {
      currentBlockIndex -= replica.currentBlock.previousBlock.items.length
      replica.currentBlock = replica.currentBlock.previousBlock
    }
  }
}
