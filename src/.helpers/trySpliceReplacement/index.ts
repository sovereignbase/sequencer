import type {
  CRListReparentedStateBlock,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { getBlockEndId } from '../getBlockEndId/index.js'
import { getIndexAfterBlockId } from '../getIndexAfterBlockId/index.js'
import { isDeleted } from '../deletedRanges/index.js'
import { linkBlockBetween } from '../linkBlockBetween/index.js'

/**
 * Applies the common tombstone-backed replacement delta without full relinking.
 */
export function trySpliceReplacement<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateBlock<T>>>,
  reparentedEntries: Array<CRListReparentedStateBlock<T>>,
  tombstoneCount: number
): boolean {
  if (
    tombstoneCount === 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length > 1
  )
    return false
  const inserted = insertedEntries[0]
  if (inserted.items.length !== 1) return false
  const insertedTailId = getBlockEndId(inserted)
  const previousBlock =
    inserted.previousBlockId === 0n
      ? undefined
      : crListReplica.blocksById.get(inserted.previousBlockId)
  if (inserted.previousBlockId !== 0n && !previousBlock) return false

  const siblings = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )
  if (siblings?.length !== 1 || siblings[0] !== inserted) return false

  const reparented = reparentedEntries[0]
  const next = reparented?.block
  if (next && next.items.length !== 1) return false
  if (next) {
    const children = crListReplica.blocksByPreviousBlockId.get(insertedTailId)
    if (
      next.previousBlockId !== insertedTailId ||
      !isDeleted(crListReplica.deletedRanges, reparented.oldPreviousBlockId) ||
      children?.length !== 1 ||
      children[0] !== next ||
      next.previousBlock !== previousBlock
    )
      return false
  } else if (
    crListReplica.blocksByPreviousBlockId.get(insertedTailId)?.length
  ) {
    return false
  }

  let expectedIndex: number | undefined
  if (previousBlock) {
    if (previousBlock.nextBlock !== next) return false
    expectedIndex = getIndexAfterBlockId<T>(
      crListReplica,
      inserted.previousBlockId
    )
  } else if (
    (next &&
      crListReplica.firstBlock === next &&
      next.previousBlock === undefined) ||
    (!next && crListReplica.firstBlock === undefined)
  ) {
    expectedIndex = 0
  } else {
    let reachable = 0
    let current: CRListStateBlock<T> = next
    const limit = crListReplica.blocksById.size
    while (current && reachable < limit) {
      reachable++
      current = current.nextBlock
    }
    if (reachable !== crListReplica.blocksById.size - inserted.items.length)
      return false
    expectedIndex = 0
  }

  if (expectedIndex === undefined) return false
  void linkBlockBetween<T>(previousBlock, inserted, next)
  if (!previousBlock) crListReplica.firstBlock = inserted
  if (!next) crListReplica.lastBlock = inserted
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(expectedIndex, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = expectedIndex
  crListReplica.size = crListReplica.blocksById.size
  return true
}
