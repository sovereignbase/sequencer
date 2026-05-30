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
  if (!isRecord(delta)) return false
  const newBlocks: Array<NonNullable<CRListStateBlock<T>>> = []
  const newDeletedIndexes: Array<number> = []
  const reparentedBlocks: Array<CRListReparentedStateBlock<T>> = []
  const change: CRListChange<T> = {}
  let lastBlockDeleteMovedCurrentBlock = false
  let needsRelink = false

  /** Apply remote item deletions before linking remote blocks. */
  if (Array.isArray(delta.deletedIds)) {
    for (const deletedId of delta.deletedIds) {
      if (typeof deletedId !== 'string' || replica.deletedIds.has(deletedId))
        continue
      void replica.deletedIds.add(deletedId)
      const deletedBigInt = safeBigIntFromString(deletedId)
      if (deletedBigInt === false) continue
      const deleted = deleteItemById<T>(deletedBigInt, replica)
      if (deleted) {
        void newDeletedIndexes.push(deleted.index)
        if (deleted.index >= 0) void replica.blocksByIndex.delete(deleted.index)
        lastBlockDeleteMovedCurrentBlock =
          deleted.wasLastBlock && deleted.wasCurrentBlock
        needsRelink = true
      }
    }
  }

  /** Return early when the delta only carried item deletions. */
  if (
    !Array.isArray(delta.blocks) ||
    (delta.blocks.length === 0 && lastBlockDeleteMovedCurrentBlock)
  ) {
    if (newDeletedIndexes.length === 0) return false
    if (newDeletedIndexes.length === 1 && lastBlockDeleteMovedCurrentBlock) {
      if (replica.currentBlock) {
        replica.currentBlockIndex =
          replica.size - replica.currentBlock.items.length
        void replica.blocksByIndex.set(
          replica.currentBlockIndex,
          replica.currentBlock
        )
      } else {
        replica.currentBlockIndex = undefined
      }
      change[newDeletedIndexes[0]] = undefined
      return change
    }
    void rebuildBlocksByIndex<T>(replica)
    for (const index of newDeletedIndexes) change[index] = undefined
    return change
  }

  /** Attach accepted blocks to the previousBlock tree. */
  for (const snapshotBlock of delta.blocks) {
    if (snapshotBlock === null || snapshotBlock === undefined) continue
    const blockId = uuidV7BigIntStringToBigInt(snapshotBlock.id)
    if (blockId === false) continue

    const existingBlock = replica.blocksById.get(blockId)

    if (existingBlock) {
      if (replica.deletedIds.has(snapshotBlock.id)) continue
      if (
        !Array.isArray(snapshotBlock.items) ||
        snapshotBlock.items.length === 0
      )
        continue
      const newPreviousBlockId = uuidV7BigIntStringToBigInt(
        snapshotBlock.previousBlockId
      )
      if (newPreviousBlockId === false) continue
      let blockToMove = existingBlock
      if (existingBlock.id !== blockId) {
        const [, right] = splitBlock<T>(
          replica,
          existingBlock,
          Number(blockId - existingBlock.id)
        )
        blockToMove = right
      }
      if (blockToMove.items.length > snapshotBlock.items.length) {
        const [left] = splitBlock<T>(
          replica,
          blockToMove,
          snapshotBlock.items.length
        )
        blockToMove = left
      }
      if (blockToMove.previousBlockId >= newPreviousBlockId) continue
      if (
        newPreviousBlockId >= blockToMove.id &&
        newPreviousBlockId <= getBlockEndId(blockToMove)
      )
        continue
      const oldPreviousBlockId = blockToMove.previousBlockId
      void changePreviousBlockOf<T>(replica, blockToMove, newPreviousBlockId)
      void reparentedBlocks.push({ block: blockToMove, oldPreviousBlockId })
      needsRelink = true
      continue
    }

    const block = createStateBlock<T>(snapshotBlock, replica, blockId)
    if (!block) continue
    const liveBlocks = sliceBlockIntoUnseenBlocks<T>(block, replica)
    if (liveBlocks.length === 0) continue

    for (const liveBlock of liveBlocks)
      void attachBlockToIndexes<T>(replica, liveBlock)
    void newBlocks.push(...liveBlocks)
    const liveBlock = liveBlocks[0]
    if (
      liveBlocks.length !== 1 ||
      liveBlock.id !== block.id ||
      liveBlock.items.length !== block.items.length
    ) {
      needsRelink = true
      continue
    }
    const previousBlock =
      liveBlock.previousBlockId === 0n
        ? undefined
        : replica.blocksById.get(liveBlock.previousBlockId)
    if (!needsRelink && liveBlock.previousBlockId === 0n) {
      if (replica.size === 0) {
        replica.firstBlock = liveBlock
        replica.lastBlock = liveBlock
        replica.currentBlock = liveBlock
        replica.currentBlockIndex = 0
        replica.size = replica.blocksById.size
        void replica.blocksByIndex.set(0, liveBlock)
      } else {
        needsRelink = true
      }
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
      needsRelink = true
    }
  }

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
      void rebuildLiveProjection<T>(replica)
    }
  }

  if (newDeletedIndexes.length === 0 && newBlocks.length === 0) return false

  for (const index of newDeletedIndexes) change[index] = undefined
  for (const block of newBlocks) {
    const blockStartIndex = getBlockStartIndex(replica, block)
    if (blockStartIndex !== undefined)
      void writeBlockChange<T>(change, block, blockStartIndex)
  }

  return change
}
