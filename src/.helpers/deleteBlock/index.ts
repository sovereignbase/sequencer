import type {
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { detachBlockFromIndexes } from '../detachBlockFromIndexes/index.js'

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

  if (deltaObject && !Array.isArray(deltaObject.deletedIds))
    deltaObject.deletedIds = []

  for (let itemOffset = 0; itemOffset < block.items.length; itemOffset++) {
    const deletedId = (block.id + BigInt(itemOffset)).toString()
    void replica.deletedIds.add(deletedId)
    void deltaObject?.deletedIds?.push(deletedId)
  }

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
  replica.size = replica.size - block.items.length
}
