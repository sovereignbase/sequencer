import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
  CRListReparentedStateEntry,
} from '../../../.types/type.js'
import {
  materializeSnapshotEntry,
  attachEntryToIndexes,
  rebuildLiveProjection,
  rebuildLiveIndex,
  deleteLiveEntryId,
  getEntryTailId,
  getIndexAfterEntryId,
  moveEntryToPredecessor,
  trySpliceSiblingInsert,
  trySpliceReplacement,
  splitBlock,
  sliceEntryIntoUnseenBlocks,
  writeEntryChange,
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
 * @param crListReplica - Replica to mutate.
 * @param crListDelta - Remote gossip delta.
 * @returns - A minimal local change patch, or `false` when the delta is ignored.
 */
export function __merge<T>(
  crListReplica: CRListState<T>,
  crListDelta: CRListDelta<T>
): CRListChange<T> | false {
  if (!isRecord(crListDelta)) return false
  const newValues: Array<NonNullable<CRListStateEntry<T>>> = []
  const newTombstoneIndicies: Array<number> = []
  const reparentedvalues: Array<CRListReparentedStateEntry<T>> = []
  const change: CRListChange<T> = {}
  let tailTombstoneMovedCursor = false
  let needsRelink = false

  /** Apply tombstone entries. */
  if (Array.isArray(crListDelta.tombstones)) {
    for (const tombstone of crListDelta.tombstones) {
      if (
        typeof tombstone !== 'string' ||
        crListReplica.tombstones.has(tombstone)
      )
        continue
      void crListReplica.tombstones.add(tombstone)
      const tombstoneBigInt = safeBigIntFromString(tombstone)
      if (tombstoneBigInt === false) continue
      const deleted = deleteLiveEntryId<T>(crListReplica, tombstoneBigInt)
      if (deleted) {
        void newTombstoneIndicies.push(deleted.index)
        void crListReplica.cache.delete(deleted.index)
        tailTombstoneMovedCursor = deleted.wasTail && deleted.wasCursor
        needsRelink = true
      }
    }
  }

  /** Return early */
  if (
    !Array.isArray(crListDelta.values) ||
    (crListDelta.values.length === 0 && tailTombstoneMovedCursor)
  ) {
    if (newTombstoneIndicies.length === 0) return false
    if (newTombstoneIndicies.length === 1 && tailTombstoneMovedCursor) {
      if (crListReplica.cursor) {
        crListReplica.cursorIndex = crListReplica.size - 1
        void crListReplica.cache.set(
          crListReplica.cursorIndex,
          crListReplica.cursor
        )
      } else {
        crListReplica.cursorIndex = undefined
      }
      change[newTombstoneIndicies[0]] = undefined
      return change
    }
    void rebuildLiveIndex<T>(crListReplica)
    for (const index of newTombstoneIndicies) change[index] = undefined
    return change
  }

  /** Apply value entries. */
  // Attach accepted values to the predecessor tree.
  for (const valueEntry of crListDelta.values) {
    if (valueEntry === null || valueEntry === undefined) continue
    const entryId = uuidV7BigIntStringToBigInt(valueEntry.id)
    if (entryId === false) continue

    const existingEntry = crListReplica.parentMap.get(entryId)

    if (existingEntry) {
      if (crListReplica.tombstones.has(valueEntry.id)) continue
      if (!Array.isArray(valueEntry.values) || valueEntry.values.length === 0)
        continue
      const newPredecessor = uuidV7BigIntStringToBigInt(valueEntry.predecessor)
      if (newPredecessor === false) continue
      let entryToMove = existingEntry
      if (existingEntry.id !== entryId) {
        const [, right] = splitBlock<T>(
          crListReplica,
          existingEntry,
          Number(entryId - existingEntry.id)
        )
        entryToMove = right
      }
      if (entryToMove.values.length > valueEntry.values.length) {
        const [left] = splitBlock<T>(
          crListReplica,
          entryToMove,
          valueEntry.values.length
        )
        entryToMove = left
      }
      if (entryToMove.predecessor >= newPredecessor) continue
      if (
        newPredecessor >= entryToMove.id &&
        newPredecessor <= getEntryTailId(entryToMove)
      )
        continue
      const oldPredecessor = entryToMove.predecessor
      void moveEntryToPredecessor<T>(crListReplica, entryToMove, newPredecessor)
      void reparentedvalues.push({ entry: entryToMove, oldPredecessor })
      needsRelink = true
      continue
    }

    const linkedListEntry = materializeSnapshotEntry<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    const liveBlocks = sliceEntryIntoUnseenBlocks<T>(
      crListReplica,
      linkedListEntry
    )
    if (liveBlocks.length === 0) continue

    for (const liveBlock of liveBlocks)
      void attachEntryToIndexes<T>(crListReplica, liveBlock)
    void newValues.push(...liveBlocks)
    const liveBlock = liveBlocks[0]
    if (
      liveBlocks.length !== 1 ||
      liveBlock.id !== linkedListEntry.id ||
      liveBlock.values.length !== linkedListEntry.values.length
    ) {
      needsRelink = true
      continue
    }
    const predecessor =
      liveBlock.predecessor === 0n
        ? undefined
        : crListReplica.parentMap.get(liveBlock.predecessor)
    if (!needsRelink && liveBlock.predecessor === 0n) {
      if (crListReplica.size === 0) {
        liveBlock.index = 0
        crListReplica.cursor = liveBlock
        crListReplica.cursorIndex = 0
        crListReplica.size = crListReplica.parentMap.size
        void crListReplica.cache.set(0, liveBlock)
      } else {
        needsRelink = true
      }
    } else if (!needsRelink && predecessor && !predecessor.next) {
      liveBlock.prev = predecessor
      liveBlock.index =
        getIndexAfterEntryId<T>(crListReplica, liveBlock.predecessor) ??
        predecessor.index + predecessor.values.length
      predecessor.next = liveBlock
      crListReplica.cursor = liveBlock
      crListReplica.cursorIndex = liveBlock.index
      crListReplica.size = crListReplica.parentMap.size
      void crListReplica.cache.set(liveBlock.index, liveBlock)
    } else {
      needsRelink = true
    }
  }

  if (needsRelink) {
    if (
      !trySpliceSiblingInsert<T>(
        crListReplica,
        newValues,
        reparentedvalues,
        newTombstoneIndicies.length
      ) &&
      !trySpliceInsertedParent<T>(crListReplica, newValues, reparentedvalues) &&
      !trySpliceReplacement<T>(
        crListReplica,
        newValues,
        reparentedvalues,
        newTombstoneIndicies.length
      )
    ) {
      void rebuildLiveProjection<T>(crListReplica)
    }
  }

  if (newTombstoneIndicies.length === 0 && newValues.length === 0) return false

  for (const index of newTombstoneIndicies) change[index] = undefined
  for (const val of newValues) void writeEntryChange<T>(change, val)

  return change
}
