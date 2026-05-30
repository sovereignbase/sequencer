import type {
  CRListReparentedStateBlock,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { getBlockEndId } from '../getBlockEndId/index.js'
import { getIndexAfterBlockId } from '../getIndexAfterBlockId/index.js'
import { linkBlockBetween } from '../linkBlockBetween/index.js'

/**
 * Splices a first child under a previousBlock before the previousBlock's old next.
 */
export function trySpliceChildInsert<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateBlock<T>>>,
  reparentedEntries: Array<CRListReparentedStateBlock<T>>,
  tombstoneCount: number
): boolean {
  if (
    tombstoneCount !== 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length !== 0
  )
    return false

  const inserted = insertedEntries[0]
  if (inserted.items.length !== 1 || inserted.previousBlockId === 0n)
    return false
  if (
    crListReplica.blocksByPreviousBlockId.get(getBlockEndId(inserted))?.length
  )
    return false

  const previousBlock = crListReplica.blocksById.get(inserted.previousBlockId)
  if (
    !previousBlock ||
    inserted.previousBlockId !== getBlockEndId(previousBlock)
  )
    return false

  const children = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )
  if (children?.length !== 1 || children[0] !== inserted) return false

  const next = previousBlock.nextBlock
  if (!next || next.previousBlock !== previousBlock) return false

  const index = getIndexAfterBlockId<T>(crListReplica, inserted.previousBlockId)
  if (index === undefined) return false
  void linkBlockBetween<T>(previousBlock, inserted, next)
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(index, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = index
  crListReplica.size = crListReplica.blocksById.size
  return true
}
