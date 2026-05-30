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
  // Replacement fast path requires tombstones, one inserted block, and at most one reparent.
  if (
    tombstoneCount === 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length > 1
  )
    return false

  // Candidate replacement block from the remote delta.
  const inserted = insertedEntries[0]

  // Targeted replacement shape is limited to a single inserted item.
  if (inserted.items.length !== 1) return false

  // Tail id of inserted block is the expected anchor for an optional successor.
  const insertedTailId = getBlockEndId(inserted)

  // Resolve live predecessor when replacement is not root-level.
  const previousBlock =
    inserted.previousBlockId === 0n
      ? undefined
      : crListReplica.blocksById.get(inserted.previousBlockId)

  // Non-root replacement cannot splice without its predecessor.
  if (inserted.previousBlockId !== 0n && !previousBlock) return false

  // The inserted block must be the only sibling under its anchor.
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )
  if (siblings?.length !== 1 || siblings[0] !== inserted) return false

  // Optional reparented block is the replacement successor.
  const reparented = reparentedEntries[0]
  const next = reparented?.block

  // Targeted successor shape is single-item when present.
  if (next && next.items.length !== 1) return false

  // Validate successor reparenting through the inserted block.
  if (next) {
    // Successor should be the only child anchored after inserted tail.
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
    // No successor means inserted tail must not have children.
    crListReplica.blocksByPreviousBlockId.get(insertedTailId)?.length
  ) {
    return false
  }

  // Expected visible start index of the inserted replacement.
  let expectedIndex: number | undefined

  // Non-root replacement starts immediately after its live predecessor anchor.
  if (previousBlock) {
    if (previousBlock.nextBlock !== next) return false
    expectedIndex = getIndexAfterBlockId<T>(
      crListReplica,
      inserted.previousBlockId
    )
  } else if (
    // Root replacement can start at 0 when it replaces the projection head.
    (next &&
      crListReplica.firstBlock === next &&
      next.previousBlock === undefined) ||
    (!next && crListReplica.firstBlock === undefined)
  ) {
    expectedIndex = 0
  } else {
    // Detached root fallback proves all existing live blocks are reachable from next.
    let reachable = 0
    let current: CRListStateBlock<T> = next
    const limit = crListReplica.blocksById.size

    // Walk successor chain with a live-item-count guard.
    while (current && reachable < limit) {
      reachable++
      current = current.nextBlock
    }

    // Reject if successor chain does not account for the existing projection.
    if (reachable !== crListReplica.blocksById.size - inserted.items.length)
      return false

    // Detached root replacement becomes projection head.
    expectedIndex = 0
  }

  // The fast path must know the exact visible insertion index.
  if (expectedIndex === undefined) return false

  // Splice inserted replacement between predecessor and optional successor.
  void linkBlockBetween<T>(previousBlock, inserted, next)

  // Update projection endpoints for root or tail replacement.
  if (!previousBlock) crListReplica.firstBlock = inserted
  if (!next) crListReplica.lastBlock = inserted

  // Reset cache and focus cursor on inserted replacement.
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(expectedIndex, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = expectedIndex

  // Size is authoritative from live item-id index count.
  crListReplica.size = crListReplica.blocksById.size
  return true
}
