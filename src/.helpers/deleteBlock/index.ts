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
  const previousBlock = block.previousBlock
  const nextBlock = block.nextBlock
  const blockLength = block.items.length

  void markDeletedRange(
    replica.deletedRanges,
    block.id,
    block.id + BigInt(blockLength - 1)
  )
  if (deltaObject)
    void (deltaObject.deletedRuns ??= []).push([block.idString, blockLength])

  if (previousBlock) previousBlock.nextBlock = nextBlock
  if (nextBlock) nextBlock.previousBlock = previousBlock

  void detachBlockFromIndexes<T>(replica, block)

  if (replica.firstBlock === block) replica.firstBlock = nextBlock
  if (replica.lastBlock === block) replica.lastBlock = previousBlock
  if (replica.currentBlock === block)
    replica.currentBlock = nextBlock ?? previousBlock
  if (!replica.currentBlock) replica.currentBlockIndex = undefined
  block.previousBlock = undefined
  block.nextBlock = undefined
  replica.size = replica.size - blockLength
}
