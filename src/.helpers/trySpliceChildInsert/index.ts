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
  // This fast path only handles one new block and no reparent/tombstone effects.
  if (
    tombstoneCount !== 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length !== 0
  )
    return false

  // Candidate block inserted by the remote delta.
  const inserted = insertedEntries[0]

  // Only single-item child inserts anchored to a live item are supported here.
  if (inserted.items.length !== 1 || inserted.previousBlockId === 0n)
    return false

  // If the inserted block already has children, full relink is safer.
  if (
    crListReplica.blocksByPreviousBlockId.get(getBlockEndId(inserted))?.length
  )
    return false

  // Parent item must still be live locally.
  const previousBlock = crListReplica.blocksById.get(inserted.previousBlockId)
  if (
    !previousBlock ||
    inserted.previousBlockId !== getBlockEndId(previousBlock)
  )
    return false

  // The inserted block must be the only child of the target parent item.
  const children = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )
  if (children?.length !== 1 || children[0] !== inserted) return false

  // The parent must have a current next block that the child can precede.
  const next = previousBlock.nextBlock
  if (!next || next.previousBlock !== previousBlock) return false

  // Inserted child becomes visible immediately after the parent item.
  const index = getIndexAfterBlockId<T>(crListReplica, inserted.previousBlockId)
  if (index === undefined) return false

  // Splice the inserted block between parent block and current successor.
  void linkBlockBetween<T>(previousBlock, inserted, next)

  // Insertion shifts later indexes, so clear stale cache.
  void crListReplica.blocksByIndex.clear()

  // Cache inserted block position and make it the cursor.
  void crListReplica.blocksByIndex.set(index, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = index

  // Size is authoritative from live item-id index count.
  crListReplica.size = crListReplica.blocksById.size
  return true
}
