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
  // Locate the containing block through the item-id index.
  const sourceBlock = replica.blocksById.get(id)

  // Missing or malformed source blocks mean the id is not live locally.
  if (!sourceBlock || !Array.isArray(sourceBlock.items)) return undefined

  // Remember whether deleting this id may affect the current cursor.
  const isCurrentBlockOnSourceBlock = replica.currentBlock === sourceBlock

  // Resolve the source block start index for the public change patch.
  const sourceBlockIndex = getBlockStartIndex(replica, sourceBlock) ?? -1

  // Start with the containing block; splitting narrows it to one item.
  let blockToDelete = sourceBlock

  // Compute the target item offset inside the containing block.
  const itemOffset = Number(id - sourceBlock.id)

  // Convert block-relative offset to visible list index when possible.
  const deletedIndex =
    sourceBlockIndex === -1 ? -1 : sourceBlockIndex + itemOffset

  // Split off the prefix when the target item is not block-local offset 0.
  if (itemOffset > 0) {
    const [, right] = splitBlock<T>(replica, sourceBlock, itemOffset)
    blockToDelete = right
  }

  // Split off the suffix so the deleted block contains exactly one item.
  if (blockToDelete.items.length > 1) {
    const [left] = splitBlock<T>(replica, blockToDelete, 1)
    blockToDelete = left
  }

  // Capture deletion metadata before the block is unlinked.
  const result = {
    index: deletedIndex,
    wasCurrentBlock:
      isCurrentBlockOnSourceBlock || replica.currentBlock === blockToDelete,
    wasLastBlock: blockToDelete.nextBlock === undefined,
    block: blockToDelete,
  }

  // Tombstone and unlink the single-item block.
  void deleteBlock<T>(replica, blockToDelete, deltaObject)

  // Return metadata needed by merge and change generation.
  return result
}
