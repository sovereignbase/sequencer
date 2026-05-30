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
  // This fast path handles one inserted parent and one moved child.
  if (insertedEntries.length !== 1 || reparentedEntries.length !== 1)
    return false

  // Candidate inserted parent block.
  const inserted = insertedEntries[0]

  // Reparent metadata for the existing child block.
  const reparented = reparentedEntries[0]

  // Existing child block that should move after the inserted parent.
  const moved = reparented.block

  // The targeted shape is a single-item parent and a single-item child.
  if (inserted.items.length !== 1 || moved.items.length !== 1) return false

  // The inserted parent tail id must be the moved child's new anchor.
  const insertedTailId = getBlockEndId(inserted)

  // Inserted parent must have taken the child's old anchor.
  if (
    moved.previousBlockId !== insertedTailId ||
    inserted.previousBlockId !== reparented.oldPreviousBlockId
  )
    return false

  // Inserted parent must be the only sibling under its anchor.
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )

  // Moved child must be the only child under the inserted parent.
  const children = crListReplica.blocksByPreviousBlockId.get(insertedTailId)
  if (
    siblings?.length !== 1 ||
    siblings[0] !== inserted ||
    children?.length !== 1 ||
    children[0] !== moved
  )
    return false

  // Resolve the predecessor block for non-root inserted parents.
  const previousBlock =
    inserted.previousBlockId === 0n
      ? undefined
      : crListReplica.blocksById.get(inserted.previousBlockId)

  // Non-root insertion cannot splice without a live predecessor.
  if (inserted.previousBlockId !== 0n && !previousBlock) return false

  // The inserted parent becomes visible immediately after its anchor.
  const expectedIndex = getIndexAfterBlockId<T>(
    crListReplica,
    inserted.previousBlockId
  )
  if (expectedIndex === undefined) return false

  // Existing projection must still have predecessor linked directly to moved child.
  if (
    moved.previousBlock !== previousBlock ||
    (previousBlock && previousBlock.nextBlock !== moved)
  )
    return false

  // If moved temporarily points at inserted, detach that old forward link first.
  if (moved.nextBlock === inserted) {
    moved.nextBlock = inserted.nextBlock
    if (moved.nextBlock) moved.nextBlock.previousBlock = moved
  }

  // Splice inserted parent between predecessor and moved child.
  void linkBlockBetween<T>(previousBlock, inserted, moved)

  // Root inserted parent becomes the projection head.
  if (!previousBlock) crListReplica.firstBlock = inserted

  // Moved child remains tail when it has no successor.
  if (!moved.nextBlock) crListReplica.lastBlock = moved

  // Reset cache and focus cursor on inserted parent.
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(expectedIndex, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = expectedIndex

  // Size is authoritative from live item-id index count.
  crListReplica.size = crListReplica.blocksById.size
  return true
}
