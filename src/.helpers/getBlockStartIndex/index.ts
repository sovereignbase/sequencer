import type { CRListState, CRListStateBlock } from '../../.types/type.js'

/**
 * Resolves a live block's current start index without storing it on the block.
 */
export function getBlockStartIndex<T>(
  replica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>
): number | undefined {
  if (replica.currentBlock === block) return replica.currentBlockIndex

  let index = 0
  let currentBlock = replica.firstBlock
  let visitedItems = 0
  const limit = replica.blocksById.size

  while (currentBlock && visitedItems < limit) {
    if (currentBlock === block) return index
    index += currentBlock.items.length
    visitedItems += currentBlock.items.length
    currentBlock = currentBlock.nextBlock
  }

  return undefined
}
