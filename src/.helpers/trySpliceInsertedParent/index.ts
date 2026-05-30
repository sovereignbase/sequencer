import type {
  CRListState,
  CRListStateBlock,
  CRListReparentedStateBlock,
} from '../../.types/type.js'
import { getBlockEndId } from '../getBlockEndId/index.js'
import { getIndexAfterBlockId } from '../getIndexAfterBlockId/index.js'
import { linkBlockBetween } from '../linkBlockBetween/index.js'

/**
 * Applies the common single-insert reparent delta without a full projection rebuild.
 */
export function trySpliceInsertedParent<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateBlock<T>>>,
  reparentedEntries: Array<CRListReparentedStateBlock<T>>
): boolean {
  if (insertedEntries.length !== 1 || reparentedEntries.length !== 1)
    return false
  const inserted = insertedEntries[0]
  const reparented = reparentedEntries[0]
  const moved = reparented.block
  if (inserted.items.length !== 1 || moved.items.length !== 1) return false
  const insertedTailId = getBlockEndId(inserted)
  if (
    moved.previousBlockId !== insertedTailId ||
    inserted.previousBlockId !== reparented.oldPreviousBlockId
  )
    return false
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )
  const children = crListReplica.blocksByPreviousBlockId.get(insertedTailId)
  if (
    siblings?.length !== 1 ||
    siblings[0] !== inserted ||
    children?.length !== 1 ||
    children[0] !== moved
  )
    return false
  const previousBlock =
    inserted.previousBlockId === 0n
      ? undefined
      : crListReplica.blocksById.get(inserted.previousBlockId)
  if (inserted.previousBlockId !== 0n && !previousBlock) return false
  const expectedIndex = getIndexAfterBlockId<T>(
    crListReplica,
    inserted.previousBlockId
  )
  if (expectedIndex === undefined) return false
  if (
    moved.previousBlock !== previousBlock ||
    (previousBlock && previousBlock.nextBlock !== moved)
  )
    return false

  if (moved.nextBlock === inserted) {
    moved.nextBlock = inserted.nextBlock
    if (moved.nextBlock) moved.nextBlock.previousBlock = moved
  }
  void linkBlockBetween<T>(previousBlock, inserted, moved)
  if (!previousBlock) crListReplica.firstBlock = inserted
  if (!moved.nextBlock) crListReplica.lastBlock = moved
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(expectedIndex, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = expectedIndex
  crListReplica.size = crListReplica.blocksById.size
  return true
}
