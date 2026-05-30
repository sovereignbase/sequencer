import type {
  CRListReparentedStateBlock,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { getBlockEndId } from '../getBlockEndId/index.js'
import { getBlockStartIndex } from '../getBlockStartIndex/index.js'
import { linkBlockBetween } from '../linkBlockBetween/index.js'

/**
 * Splices a concurrent sibling parent before the child it reparented.
 */
export function trySpliceSiblingParentInsert<T>(
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
  if (moved.previousBlockId !== insertedTailId) return false

  const siblings = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )
  const children = crListReplica.blocksByPreviousBlockId.get(insertedTailId)
  if (!siblings || siblings.length < 2 || children?.length !== 1) return false
  if (children[0] !== moved) return false

  void siblings.sort((a, b) => (a.id > b.id ? 1 : -1))
  const siblingIndex = siblings.indexOf(inserted)
  if (siblingIndex <= 0) return false

  const previousSibling = siblings[siblingIndex - 1]
  const nextSibling = siblings[siblingIndex + 1]
  const previousSiblingTailId = getBlockEndId(previousSibling)
  const tombstoneBridge =
    reparented.oldPreviousBlockId !== previousSiblingTailId &&
    crListReplica.deletedIds.has(reparented.oldPreviousBlockId.toString())
  if (
    reparented.oldPreviousBlockId !== previousSiblingTailId &&
    !tombstoneBridge
  )
    return false
  if (
    previousSibling.nextBlock !== moved ||
    moved.previousBlock !== previousSibling
  )
    return false
  if (nextSibling && moved.nextBlock !== nextSibling) return false

  if (moved.nextBlock === inserted) {
    moved.nextBlock = inserted.nextBlock
    if (moved.nextBlock) moved.nextBlock.previousBlock = moved
  }
  const siblingStart = getBlockStartIndex(crListReplica, previousSibling)
  if (siblingStart === undefined) return false
  const index = siblingStart + previousSibling.items.length
  void linkBlockBetween<T>(previousSibling, inserted, moved)
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(index, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = index
  if (!moved.nextBlock) crListReplica.lastBlock = moved
  crListReplica.size = crListReplica.blocksById.size
  return true
}
