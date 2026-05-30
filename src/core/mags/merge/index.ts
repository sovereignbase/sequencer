import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateBlock,
  CRListReparentedStateBlock,
} from '../../../.types/type.js'
import {
  createStateBlock,
  attachBlockToIndexes,
  rebuildLiveProjection,
  rebuildBlocksByIndex,
  deleteItemById,
  getBlockEndId,
  getBlockStartIndex,
  changePreviousBlockOf,
  isDeleted,
  markDeletedRange,
  trySpliceChildInsert,
  trySpliceSiblingInsert,
  trySpliceSiblingParentInsert,
  trySpliceReplacement,
  splitBlock,
  sliceBlockIntoUnseenBlocks,
  writeBlockChange,
} from '../../../.helpers/index.js'
import {
  isRecord,
  safeBigIntFromString,
  uuidV7BigIntStringToBigInt,
} from '@sovereignbase/utils'
import { trySpliceInsertedParent } from '../../../.helpers/trySpliceInsertedParent/index.js'

/**
 * Merges a remote CRList delta into the local replica.
 *
 * @param replica - Replica to mutate.
 * @param delta - Remote gossip delta.
 * @returns - A minimal local change patch, or `false` when the delta is ignored.
 */
export function __merge<T>(
  replica: CRListState<T>,
  delta: CRListDelta<T>
): CRListChange<T> | false {
  // Ignore malformed deltas; merge is intentionally tolerant at the boundary.
  if (!isRecord(delta)) return false

  // Blocks newly accepted from the remote delta.
  const newBlocks: Array<NonNullable<CRListStateBlock<T>>> = []

  // Live indexes deleted by remote tombstones.
  const newDeletedIndexes: Array<number> = []

  // Existing live blocks whose stable previousBlock id changed.
  const reparentedBlocks: Array<CRListReparentedStateBlock<T>> = []

  // Local visible patch that will be emitted if the merge changes projection.
  const change: CRListChange<T> = {}

  // Tracks a cursor repair case after deleting the last current block.
  let lastBlockDeleteMovedCurrentBlock = false

  // Flags that projection links must be spliced or fully rebuilt.
  let needsRelink = false

  /** Apply remote item deletions before linking remote blocks. */
  if (Array.isArray(delta.deletedRuns)) {
    for (const run of delta.deletedRuns) {
      // A deleted run must be `[startId, length]`.
      if (!Array.isArray(run)) continue

      // Parse the start id from the transport string representation.
      const start = safeBigIntFromString(run[0])
      const length = run[1]

      // Ignore malformed or empty remote tombstone runs.
      if (start === false || typeof length !== 'number' || length < 1) continue

      // Apply each deleted item id so partial-block deletes can split correctly.
      for (let offset = 0; offset < length; offset++) {
        // Compute the concrete virtual item id covered by this offset.
        const id = start + BigInt(offset)

        // Already-known tombstones do not need duplicate block work.
        if (isDeleted(replica.deletedRanges, id)) continue

        // Delete the item from the live projection if it is still present.
        const deleted = deleteItemById<T>(id, replica)
        if (deleted) {
          // Record the former visible index for the local change patch.
          void newDeletedIndexes.push(deleted.index)

          // Remove a possibly stale block-start cache entry for that index.
          if (deleted.index >= 0)
            void replica.blocksByIndex.delete(deleted.index)

          // Remember the special cursor-repair case for pure delete deltas.
          lastBlockDeleteMovedCurrentBlock =
            deleted.wasLastBlock && deleted.wasCurrentBlock

          // Deletions can alter links and indexes, so relinking may be needed.
          needsRelink = true
        }
      }

      // Store the remote tombstone range whether or not local items were live.
      void markDeletedRange(
        replica.deletedRanges,
        start,
        start + BigInt(length) - 1n
      )
    }
  }

  /** Return early when the delta only carried item deletions. */
  if (
    !Array.isArray(delta.blocks) ||
    (delta.blocks.length === 0 && lastBlockDeleteMovedCurrentBlock)
  ) {
    // Pure tombstone delta with no visible local effect is ignored.
    if (newDeletedIndexes.length === 0) return false

    // Repair the cursor cheaply when one deleted last/current block moved it.
    if (newDeletedIndexes.length === 1 && lastBlockDeleteMovedCurrentBlock) {
      if (replica.currentBlock) {
        // The new cursor start is the new tail block start index.
        replica.currentBlockIndex =
          replica.size - replica.currentBlock.items.length
        void replica.blocksByIndex.set(
          replica.currentBlockIndex,
          replica.currentBlock
        )
      } else {
        // Empty projection has no cursor index.
        replica.currentBlockIndex = undefined
      }
      // Mark the deleted visible index in the local patch.
      change[newDeletedIndexes[0]] = undefined
      return change
    }

    // Rebuild cache and projection endpoints for multi-delete pure deltas.
    void rebuildBlocksByIndex<T>(replica)

    // Emit every removed visible index as `undefined`.
    for (const index of newDeletedIndexes) change[index] = undefined
    return change
  }

  /** Attach accepted blocks to the previousBlock tree. */
  for (const snapshotBlock of delta.blocks) {
    // Skip nullish entries to keep merge tolerant of malformed arrays.
    if (snapshotBlock === null || snapshotBlock === undefined) continue

    // Parse the incoming block id once for validation and lookup.
    const blockId = uuidV7BigIntStringToBigInt(snapshotBlock.id)
    if (blockId === false) continue

    // Existing item id means this delta may be a reparent for a known block.
    const existingBlock = replica.blocksById.get(blockId)

    if (existingBlock) {
      // Deleted known ids must not be resurrected.
      if (isDeleted(replica.deletedRanges, blockId)) continue

      // A reparent delta still needs a valid non-empty item list.
      if (
        !Array.isArray(snapshotBlock.items) ||
        snapshotBlock.items.length === 0
      )
        continue

      // Parse the incoming stable anchor.
      const newPreviousBlockId = uuidV7BigIntStringToBigInt(
        snapshotBlock.previousBlockId
      )
      if (newPreviousBlockId === false) continue

      // Existing block may start before the incoming id, so split at id first.
      let blockToMove = existingBlock
      if (existingBlock.id !== blockId) {
        const [, right] = splitBlock<T>(
          replica,
          existingBlock,
          Number(blockId - existingBlock.id)
        )
        blockToMove = right
      }

      // Incoming item span may be shorter than the local containing block.
      if (blockToMove.items.length > snapshotBlock.items.length) {
        const [left] = splitBlock<T>(
          replica,
          blockToMove,
          snapshotBlock.items.length
        )
        blockToMove = left
      }

      // Never move a block backwards or to the same/equivalent anchor.
      if (blockToMove.previousBlockId >= newPreviousBlockId) continue

      // Prevent a block from anchoring inside its own id range.
      if (
        newPreviousBlockId >= blockToMove.id &&
        newPreviousBlockId <= getBlockEndId(blockToMove)
      )
        continue

      // Preserve the old anchor so fast-path splices can validate shape.
      const oldPreviousBlockId = blockToMove.previousBlockId

      // Update previousBlock indexes; projection links are handled later.
      void changePreviousBlockOf<T>(replica, blockToMove, newPreviousBlockId)

      // Record this reparent for targeted splice attempts.
      void reparentedBlocks.push({ block: blockToMove, oldPreviousBlockId })
      needsRelink = true
      continue
    }

    // Convert an unseen snapshot block into mutable state if it is valid.
    const block = createStateBlock<T>(snapshotBlock, replica, blockId)
    if (!block) continue

    // Drop already-seen or tombstoned item ids from the received block.
    const liveBlocks = sliceBlockIntoUnseenBlocks<T>(block, replica)
    if (liveBlocks.length === 0) continue

    // Index every accepted live run before projection relinking.
    for (const liveBlock of liveBlocks)
      void attachBlockToIndexes<T>(replica, liveBlock)

    // Track accepted runs for change generation and splice fast paths.
    void newBlocks.push(...liveBlocks)

    // The first live run represents the original block when no slicing occurred.
    const liveBlock = liveBlocks[0]
    if (
      liveBlocks.length !== 1 ||
      liveBlock.id !== block.id ||
      liveBlock.items.length !== block.items.length
    ) {
      // Partial overlap or split runs require deterministic relinking.
      needsRelink = true
      continue
    }

    // Resolve the local previous block, if the anchor points to a live item.
    const previousBlock =
      liveBlock.previousBlockId === 0n
        ? undefined
        : replica.blocksById.get(liveBlock.previousBlockId)

    // Root insert can be linked cheaply only when the replica is currently empty.
    if (!needsRelink && liveBlock.previousBlockId === 0n) {
      if (replica.size === 0) {
        replica.firstBlock = liveBlock
        replica.lastBlock = liveBlock
        replica.currentBlock = liveBlock
        replica.currentBlockIndex = 0
        replica.size = replica.blocksById.size
        void replica.blocksByIndex.set(0, liveBlock)
      } else {
        // Competing roots require deterministic rebuild/splice logic.
        needsRelink = true
      }
      // Tail append after a known previous block can be linked cheaply.
    } else if (!needsRelink && previousBlock && !previousBlock.nextBlock) {
      liveBlock.previousBlock = previousBlock
      const liveBlockIndex = replica.size
      previousBlock.nextBlock = liveBlock
      replica.lastBlock = liveBlock
      replica.currentBlock = liveBlock
      replica.currentBlockIndex = liveBlockIndex
      replica.size = replica.blocksById.size
      void replica.blocksByIndex.set(liveBlockIndex, liveBlock)
    } else {
      // Middle insert, missing parent, or occupied next link requires relink.
      needsRelink = true
    }
  }

  // Try specialized local splice repairs before falling back to full rebuild.
  if (needsRelink) {
    if (
      !trySpliceSiblingInsert<T>(
        replica,
        newBlocks,
        reparentedBlocks,
        newDeletedIndexes.length
      ) &&
      !trySpliceChildInsert<T>(
        replica,
        newBlocks,
        reparentedBlocks,
        newDeletedIndexes.length
      ) &&
      !trySpliceInsertedParent<T>(replica, newBlocks, reparentedBlocks) &&
      !trySpliceSiblingParentInsert<T>(replica, newBlocks, reparentedBlocks) &&
      !trySpliceReplacement<T>(
        replica,
        newBlocks,
        reparentedBlocks,
        newDeletedIndexes.length
      )
    ) {
      // Full rebuild is the deterministic convergence fallback for hard cases.
      void rebuildLiveProjection<T>(replica)
    }
  }

  // If no local tombstones or live blocks were accepted, the delta was redundant.
  if (newDeletedIndexes.length === 0 && newBlocks.length === 0) return false

  // Publish all remote deletions as index removals in the local change patch.
  for (const index of newDeletedIndexes) change[index] = undefined

  // Publish all accepted live blocks at their final projected indexes.
  for (const block of newBlocks) {
    const blockStartIndex = getBlockStartIndex(replica, block)
    if (blockStartIndex !== undefined)
      void writeBlockChange<T>(change, block, blockStartIndex)
  }

  // Return the minimal visible patch produced by this merge.
  return change
}
