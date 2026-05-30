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
  // Cursor seeking only accepts indexes currently visible in the live list.
  if (targetIndex < 0 || targetIndex >= replica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS', 'Index out of bounds')

  // Exact block-start hits avoid walking.
  const indexedBlock: CRListStateBlock<T> =
    replica.blocksByIndex.get(targetIndex)

  // Cached block-start hit makes the requested index the cursor start.
  if (indexedBlock) {
    replica.currentBlock = indexedBlock
    replica.currentBlockIndex = targetIndex
    return
  }

  // A non-empty list requires head, cursor, tail, and cursor index metadata.
  if (
    !replica.firstBlock ||
    !replica.currentBlock ||
    !replica.lastBlock ||
    replica.currentBlockIndex === undefined
  )
    throw new CRListError('LIST_EMPTY', 'List is empty')

  // Compute the start index of the tail block.
  const lastBlockIndex: number = replica.size - replica.lastBlock.items.length

  // Choose the nearest known starting point to minimize link traversal.
  let currentBlockIndex: number = nearestOf3Numbers(
    targetIndex,
    0,
    replica.currentBlockIndex,
    lastBlockIndex
  )

  // Move cursor to head if head was chosen as nearest start.
  if (currentBlockIndex === 0 && replica.firstBlock !== replica.currentBlock)
    replica.currentBlock = replica.firstBlock
  // Move cursor to tail if tail was chosen as nearest start.
  else if (
    currentBlockIndex === lastBlockIndex &&
    replica.lastBlock !== replica.currentBlock
  )
    replica.currentBlock = replica.lastBlock
  // Otherwise retain the existing cursor as the nearest start.
  else currentBlockIndex = replica.currentBlockIndex

  // Direction is determined once from the selected start index.
  const direction: 'prev' | 'next' =
    currentBlockIndex > targetIndex ? 'prev' : 'next'

  // Walk linked projection blocks until the target index falls inside the cursor.
  while (replica.currentBlock) {
    // End index is exclusive.
    const blockEnd = currentBlockIndex + replica.currentBlock.items.length

    // Found containing block; persist cursor and cache the exact block start.
    if (currentBlockIndex <= targetIndex && targetIndex < blockEnd) {
      replica.currentBlockIndex = currentBlockIndex
      void replica.blocksByIndex.set(currentBlockIndex, replica.currentBlock)
      return
    }

    // Move right by the current block length.
    if (direction === 'next') {
      currentBlockIndex += replica.currentBlock.items.length
      replica.currentBlock = replica.currentBlock.nextBlock
    } else if (replica.currentBlock.previousBlock) {
      // Move left by the previous block length.
      currentBlockIndex -= replica.currentBlock.previousBlock.items.length
      replica.currentBlock = replica.currentBlock.previousBlock
    }
  }
}
