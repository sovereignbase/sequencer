import type {
  CRListReparentedStateBlock,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { getBlockEndId } from '../getBlockEndId/index.js'
import { getIndexAfterBlockId } from '../getIndexAfterBlockId/index.js'
import { getBlockStartIndex } from '../getBlockStartIndex/index.js'
import { linkBlockBetween } from '../linkBlockBetween/index.js'

/**
 * Applies a simple concurrent sibling insert without a full projection rebuild.
 */
export function trySpliceSiblingInsert<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateBlock<T>>>,
  reparentedEntries: Array<CRListReparentedStateBlock<T>>,
  tombstoneCount: number
): boolean {
  // This fast path handles exactly one new sibling and no tombstones/reparents.
  if (
    tombstoneCount !== 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length !== 0
  )
    return false

  // Candidate sibling inserted by the remote delta.
  const inserted = insertedEntries[0]

  // Only single-item sibling inserts are handled by this targeted splice.
  if (inserted.items.length !== 1) return false

  // If the inserted block already has children, full relink is safer.
  if (
    crListReplica.blocksByPreviousBlockId.get(getBlockEndId(inserted))?.length
  )
    return false

  // Resolve the live parent item when the sibling is not root-level.
  const previousBlock =
    inserted.previousBlockId === 0n
      ? undefined
      : crListReplica.blocksById.get(inserted.previousBlockId)

  // Read all siblings competing for the same stable anchor.
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )

  // Need at least one existing sibling to splice around.
  if (!siblings || siblings.length < 2) return false

  // Non-root siblings require a live previous block.
  if (inserted.previousBlockId !== 0n && !previousBlock) return false

  // Deterministic sibling order is ascending id.
  void siblings.sort((a, b) => (a.id > b.id ? 1 : -1))

  // Locate the inserted block within its sorted sibling bucket.
  const siblingIndex = siblings.indexOf(inserted)
  if (siblingIndex === -1) return false

  // Root-level sibling insertion has its own head-splice constraints.
  if (inserted.previousBlockId === 0n) {
    // This fast path only inserts before the current first root sibling.
    if (siblingIndex !== 0) return false

    // The next sibling must currently be the projection head.
    const next = siblings[1]
    if (
      !next ||
      crListReplica.firstBlock !== next ||
      next.previousBlock !== undefined
    )
      return false

    // Link inserted root before the old head.
    void linkBlockBetween<T>(undefined, inserted, next)
    crListReplica.firstBlock = inserted

    // Reset cache and cursor to the new head.
    void crListReplica.blocksByIndex.clear()
    void crListReplica.blocksByIndex.set(0, inserted)
    crListReplica.currentBlock = inserted
    crListReplica.currentBlockIndex = 0

    // Size is authoritative from live item-id index count.
    crListReplica.size = crListReplica.blocksById.size
    return true
  }

  // Non-root sibling insertion requires a live parent.
  if (!previousBlock) return false

  // Determine sorted neighbours around the inserted sibling.
  const previousSibling = siblings[siblingIndex - 1]
  const nextSibling = siblings[siblingIndex + 1]

  // Validate there is no child hanging off the previous sibling.
  if (previousSibling?.id) {
    if (
      crListReplica.blocksByPreviousBlockId.get(getBlockEndId(previousSibling))
        ?.length
    )
      return false

    // Existing projection must currently link previous sibling to next sibling.
    if (previousSibling.nextBlock !== nextSibling) return false
  } else if (previousBlock.nextBlock !== nextSibling) {
    // Without previous sibling, parent must currently link to next sibling.
    return false
  }

  // Projection predecessor is previous sibling when present, otherwise parent.
  const prev = previousSibling ?? previousBlock

  // Projection successor is the next sorted sibling.
  const next = nextSibling

  // Successor must currently point back to the predecessor.
  if (next && next.previousBlock !== prev) return false

  // Resolve predecessor start index when predecessor is a sibling block.
  const prevStart = previousSibling
    ? getBlockStartIndex(crListReplica, previousSibling)
    : undefined

  // Inserted index follows previous sibling or the anchored parent item.
  const index =
    prevStart !== undefined
      ? prevStart + previousSibling!.items.length
      : getIndexAfterBlockId<T>(crListReplica, inserted.previousBlockId)
  if (index === undefined) return false

  // Splice inserted block between validated neighbours.
  void linkBlockBetween<T>(prev, inserted, next)

  // Update tail when inserted block becomes the last projection block.
  if (!next) crListReplica.lastBlock = inserted

  // Reset cache and focus cursor on inserted block.
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(index, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = index

  // Size is authoritative from live item-id index count.
  crListReplica.size = crListReplica.blocksById.size
  return true
}
