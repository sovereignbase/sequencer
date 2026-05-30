import type {
  CRListReparentedStateBlock,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { getBlockEndId } from '../getBlockEndId/index.js'
import { getBlockStartIndex } from '../getBlockStartIndex/index.js'
import { isDeleted } from '../deletedRanges/index.js'
import { linkBlockBetween } from '../linkBlockBetween/index.js'

/**
 * Splices a concurrent sibling parent before the child it reparented.
 */
export function trySpliceSiblingParentInsert<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateBlock<T>>>,
  reparentedEntries: Array<CRListReparentedStateBlock<T>>
): boolean {
  // This fast path handles one inserted sibling parent and one moved child.
  if (insertedEntries.length !== 1 || reparentedEntries.length !== 1)
    return false

  // Candidate inserted block from the remote delta.
  const inserted = insertedEntries[0]

  // Reparent metadata for the existing moved block.
  const reparented = reparentedEntries[0]

  // Existing block now anchored after the inserted block.
  const moved = reparented.block

  // Targeted fast path is limited to single-item blocks.
  if (inserted.items.length !== 1 || moved.items.length !== 1) return false

  // Moved child must now anchor after the inserted block tail.
  const insertedTailId = getBlockEndId(inserted)
  if (moved.previousBlockId !== insertedTailId) return false

  // Sibling bucket contains inserted plus existing siblings under old anchor.
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )

  // Child bucket under inserted tail should contain only the moved child.
  const children = crListReplica.blocksByPreviousBlockId.get(insertedTailId)
  if (!siblings || siblings.length < 2 || children?.length !== 1) return false
  if (children[0] !== moved) return false

  // Deterministic sibling order is ascending id.
  void siblings.sort((a, b) => (a.id > b.id ? 1 : -1))

  // Locate inserted block among siblings sharing its old anchor.
  const siblingIndex = siblings.indexOf(inserted)
  if (siblingIndex <= 0) return false

  // Previous and next sorted siblings define the expected projection neighbourhood.
  const previousSibling = siblings[siblingIndex - 1]
  const nextSibling = siblings[siblingIndex + 1]

  // Previous sibling tail is the normal old anchor for moved.
  const previousSiblingTailId = getBlockEndId(previousSibling)

  // Tombstone bridge permits old anchor to be deleted instead of previous tail.
  const tombstoneBridge =
    reparented.oldPreviousBlockId !== previousSiblingTailId &&
    isDeleted(crListReplica.deletedRanges, reparented.oldPreviousBlockId)

  // Reject if moved did not come from previous sibling tail or a tombstone bridge.
  if (
    reparented.oldPreviousBlockId !== previousSiblingTailId &&
    !tombstoneBridge
  )
    return false

  // Current projection must still link previous sibling directly to moved child.
  if (
    previousSibling.nextBlock !== moved ||
    moved.previousBlock !== previousSibling
  )
    return false

  // Optional next sibling must still follow moved in projection order.
  if (nextSibling && moved.nextBlock !== nextSibling) return false

  // If moved temporarily points at inserted, detach that old forward link first.
  if (moved.nextBlock === inserted) {
    moved.nextBlock = inserted.nextBlock
    if (moved.nextBlock) moved.nextBlock.previousBlock = moved
  }

  // Resolve the previous sibling's current visible start index.
  const siblingStart = getBlockStartIndex(crListReplica, previousSibling)
  if (siblingStart === undefined) return false

  // Inserted block starts after the previous sibling block.
  const index = siblingStart + previousSibling.items.length

  // Splice inserted block between previous sibling and moved child.
  void linkBlockBetween<T>(previousSibling, inserted, moved)

  // Reset cache and focus cursor on inserted block.
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(index, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = index

  // Moved child remains tail when it has no successor.
  if (!moved.nextBlock) crListReplica.lastBlock = moved

  // Size is authoritative from live item-id index count.
  crListReplica.size = crListReplica.blocksById.size
  return true
}
