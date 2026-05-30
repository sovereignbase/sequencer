import type {
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { detachBlockFromIndexes } from '../detachBlockFromIndexes/index.js'
import { markDeletedRange } from '../deletedRanges/index.js'

/**
 * Deletes a state block and unlinks it from the local projection.
 */
export function deleteBlock<T>(
  replica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>,
  deltaObject?: CRListDelta<T>
): void {
  // Capture neighbours before unlinking the block from projection state.
  const previousBlock = block.previousBlock
  const nextBlock = block.nextBlock

  // The whole block is deleted as one contiguous id run.
  const blockLength = block.items.length

  // Record the deleted inclusive id range locally.
  void markDeletedRange(
    replica.deletedRanges,
    block.id,
    block.id + BigInt(blockLength - 1)
  )

  // Publish the deleted run when the caller is constructing a delta.
  if (deltaObject)
    void (deltaObject.deletedRuns ??= []).push([block.idString, blockLength])

  // Connect live neighbours around the removed block.
  if (previousBlock) previousBlock.nextBlock = nextBlock
  if (nextBlock) nextBlock.previousBlock = previousBlock

  // Remove every block id and previousBlock bucket reference.
  void detachBlockFromIndexes<T>(replica, block)

  // Update projection endpoints if the deleted block was at an edge.
  if (replica.firstBlock === block) replica.firstBlock = nextBlock
  if (replica.lastBlock === block) replica.lastBlock = previousBlock

  // Move cursor to the next live block, or previous live block if at tail.
  if (replica.currentBlock === block)
    replica.currentBlock = nextBlock ?? previousBlock

  // Empty projections have no valid cursor index.
  if (!replica.currentBlock) replica.currentBlockIndex = undefined

  // Fully detach the deleted block from live projection links.
  block.previousBlock = undefined
  block.nextBlock = undefined

  // Maintain live size eagerly for callers that inspect state mid-operation.
  replica.size = replica.size - blockLength
}
