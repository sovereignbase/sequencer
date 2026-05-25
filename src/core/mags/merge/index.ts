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
  deleteLiveEntry,
  moveEntryToPredecessor,
  trySpliceSiblingInsert,
  trySpliceReplacement,
  splitBlock,
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
  const newVals: Array<NonNullable<CRListStateEntry<T>>> = []
  const newTombsIndices: Array<number> = []
  const reparentedVals: Array<CRListReparentedStateEntry<T>> = []
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
      const tombBigInt = safeBigIntFromString(tombstone)
      if (tombBigInt === false) continue
      const linkedListEntry = crListReplica.parentMap.get(tombBigInt)
      if (linkedListEntry) {
        const wasCursorOnOriginal = crListReplica.cursor === linkedListEntry
        let entryToDelete = linkedListEntry
        if (linkedListEntry.id !== tombBigInt) {
          const offset = Number(tombBigInt - linkedListEntry.id)
          const [, right] = splitBlock<T>(
            crListReplica,
            linkedListEntry,
            offset
          )
          entryToDelete = right
        }
        const wasTail = entryToDelete.next === undefined
        const wasCursor = crListReplica.cursor === entryToDelete
        const effectiveWasCursor =
          wasCursor ||
          (entryToDelete !== linkedListEntry && wasCursorOnOriginal)
        void newTombsIndices.push(entryToDelete.index)
        void crListReplica.cache.delete(entryToDelete.index)
        void deleteLiveEntry<T>(crListReplica, entryToDelete)
        tailTombstoneMovedCursor = wasTail && effectiveWasCursor
        needsRelink = true
      }
    }
  }

  /** Return early */
  if (
    !Array.isArray(crListDelta.values) ||
    (crListDelta.values.length === 0 && tailTombstoneMovedCursor)
  ) {
    if (newTombsIndices.length === 0) return false
    if (newTombsIndices.length === 1 && tailTombstoneMovedCursor) {
      if (crListReplica.cursor) {
        crListReplica.cursorIndex = crListReplica.size - 1
        void crListReplica.cache.set(
          crListReplica.cursorIndex,
          crListReplica.cursor
        )
      } else {
        crListReplica.cursorIndex = undefined
      }
      change[newTombsIndices[0]] = undefined
      return change
    }
    void rebuildLiveIndex<T>(crListReplica)
    for (const index of newTombsIndices) change[index] = undefined
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
      const newPredecessor = uuidV7BigIntStringToBigInt(valueEntry.predecessor)
      if (newPredecessor === false) continue
      if (existingEntry.predecessor >= newPredecessor) continue
      const oldPredecessor = existingEntry.predecessor
      void moveEntryToPredecessor<T>(
        crListReplica,
        existingEntry,
        newPredecessor
      )
      void reparentedVals.push({ entry: existingEntry, oldPredecessor })
      needsRelink = true
      continue
    }

    const linkedListEntry = materializeSnapshotEntry<T>(
      valueEntry,
      crListReplica
    )
    if (!linkedListEntry) continue
    const predecessor =
      linkedListEntry.predecessor === 0n
        ? undefined
        : crListReplica.parentMap.get(linkedListEntry.predecessor)
    void attachEntryToIndexes<T>(crListReplica, linkedListEntry)

    // Trim any elements that were tombstoned before this block arrived.
    // Iterate from the end so splits don't shift earlier indices.
    let liveBlock: NonNullable<CRListStateEntry<T>> | null = linkedListEntry
    let trimmed = false
    trimLoop: for (
      let entryOffset = liveBlock.values.length - 1;
      entryOffset >= 0;
      entryOffset--
    ) {
      const live = liveBlock as NonNullable<CRListStateEntry<T>>
      if (
        !crListReplica.tombstones.has(
          (live.id + BigInt(entryOffset)).toString()
        )
      )
        continue
      trimmed = true
      if (entryOffset) {
        void deleteLiveEntry<T>(crListReplica, live)
        liveBlock = null
        break trimLoop
      }
      const [left, right] = splitBlock<T>(crListReplica, live, entryOffset)
      void deleteLiveEntry<T>(crListReplica, right)
      liveBlock = left
    }
    if (!liveBlock) continue

    void newVals.push(liveBlock)
    if (trimmed) {
      needsRelink = true
      continue
    }
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
      liveBlock.index = predecessor.index + predecessor.values.length
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
        newVals,
        reparentedVals,
        newTombsIndices.length
      ) &&
      !trySpliceInsertedParent<T>(crListReplica, newVals, reparentedVals) &&
      !trySpliceReplacement<T>(
        crListReplica,
        newVals,
        reparentedVals,
        newTombsIndices.length
      )
    ) {
      void rebuildLiveProjection<T>(crListReplica)
    }
  }

  if (newTombsIndices.length === 0 && newVals.length === 0) return false

  for (const index of newTombsIndices) change[index] = undefined
  for (const val of newVals) {
    for (let entryOffset = 0; entryOffset < val.values.length; entryOffset++)
      change[val.index + entryOffset] = val.values[entryOffset]
  }

  return change
}
