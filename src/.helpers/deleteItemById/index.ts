import type {
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { deleteBlock } from '../deleteBlock/index.js'
import { getBlockStartIndex } from '../getBlockStartIndex/index.js'
import { splitBlock } from '../splitBlock/index.js'

/**
 * Deletes one item id, splitting its containing block when needed.
 */
export function deleteItemById<T>(
  id: bigint,
  replica: CRListState<T>,
  deltaObject?: CRListDelta<T>
):
  | {
      index: number
      block: NonNullable<CRListStateBlock<T>>
      wasLastBlock: boolean
      wasCurrentBlock: boolean
    }
  | undefined {
  const sourceBlock = replica.blocksById.get(id)
  if (!sourceBlock || !Array.isArray(sourceBlock.items)) return undefined

  const isCurrentBlockOnSourceBlock = replica.currentBlock === sourceBlock

  const sourceBlockIndex = getBlockStartIndex(replica, sourceBlock) ?? -1

  let blockToDelete = sourceBlock
  const itemOffset = Number(id - sourceBlock.id)
  const deletedIndex =
    sourceBlockIndex === -1 ? -1 : sourceBlockIndex + itemOffset
  if (itemOffset > 0) {
    const [, right] = splitBlock<T>(replica, sourceBlock, itemOffset)
    blockToDelete = right
  }
  if (blockToDelete.items.length > 1) {
    const [left] = splitBlock<T>(replica, blockToDelete, 1)
    blockToDelete = left
  }

  const result = {
    index: deletedIndex,
    wasCurrentBlock:
      isCurrentBlockOnSourceBlock || replica.currentBlock === blockToDelete,
    wasLastBlock: blockToDelete.nextBlock === undefined,
    block: blockToDelete,
  }
  void deleteBlock<T>(replica, blockToDelete, deltaObject)
  return result
}
