import {
  attachEntryToIndexes,
  deleteLiveEntry,
  getEntryId,
  getEntryTailId,
  linkEntryBetween,
  moveEntryToPredecessor,
  seekCursorToIndex,
  splitBlock,
  splitCursorAtIndex,
} from '../../../.helpers/index.js'
import { CRListError } from '../../../.errors/class.js'
import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../../.types/type.js'

/**
 * Deletes a range from the replica live view.
 *
 * @param crListReplica - Replica to mutate.
 * @param startIndex - Inclusive start index. Defaults to `0`.
 * @param endIndex - Exclusive end index. Defaults to the current list size.
 * @returns - A local change and gossip delta, or `false` if nothing was deleted.
 */
export function __delete<T>(
  crListReplica: CRListState<T>,
  startIndex?: number,
  endIndex?: number
): { change: CRListChange<T>; delta: CRListDelta<T> } | false {
  const change: CRListChange<T> = {}
  const delta: CRListDelta<T> = { values: [], tombstones: [] }
  const listIndex = startIndex ?? 0
  const targetEndIndex = endIndex ?? crListReplica.size
  if (
    listIndex < 0 ||
    targetEndIndex < listIndex ||
    listIndex > crListReplica.size
  )
    throw new CRListError('INDEX_OUT_OF_BOUNDS')
  const deleteCount = Math.min(targetEndIndex, crListReplica.size) - listIndex
  if (deleteCount <= 0) return false

  void seekCursorToIndex<T>(listIndex, crListReplica)
  if (!crListReplica.cursor) return false

  const start = splitCursorAtIndex<T>(crListReplica, listIndex)
  if (!start) return false

  const predecessorId = start.prev ? getEntryTailId(start.prev) : 0n
  const deletedIds = new Set<string>()
  let deleted = 0
  let currentIndex = listIndex

  let current: CRListStateEntry<T> = start

  while (current && deleted < deleteCount) {
    const remaining = deleteCount - deleted
    let blockToDelete: NonNullable<CRListStateEntry<T>>

    if (current.values.length <= remaining) {
      blockToDelete = current
      current = current.next
    } else {
      // Partial last block: split, delete the first `remaining` elements
      const [leftPart, rightPart] = splitBlock(
        crListReplica,
        current,
        remaining
      )
      blockToDelete = leftPart
      current = rightPart
    }

    for (let index = 0; index < blockToDelete.values.length; index++)
      change[currentIndex + index] = undefined

    for (
      let entryOffset = 0;
      entryOffset < blockToDelete.values.length;
      entryOffset++
    )
      void deletedIds.add((blockToDelete.id + BigInt(entryOffset)).toString())

    void crListReplica.cache.delete(currentIndex)
    void deleteLiveEntry<T>(crListReplica, blockToDelete, delta)
    deleted += blockToDelete.values.length
    currentIndex += blockToDelete.values.length
  }

  // If the block immediately after the deleted range has a deleted predecessor,
  // delete it and create a re-anchored replacement.
  if (current && deletedIds.has(current.predecessor.toString())) {
    const replacementId = getEntryId(crListReplica, current.values.length)
    const replacement: NonNullable<CRListStateEntry<T>> = {
      id: replacementId,
      idStr: replacementId.toString(),
      values: current.values,
      predecessor: predecessorId,
      index: listIndex,
      next: undefined,
      prev: undefined,
    }
    const prev = current.prev
    const next = current.next
    void deleteLiveEntry<T>(crListReplica, current, delta)
    void linkEntryBetween<T>(prev, replacement, next)
    void attachEntryToIndexes<T>(crListReplica, replacement, delta)
    for (
      let entryOffset = 0;
      entryOffset < current.values.length;
      entryOffset++
    )
      void deletedIds.add((current.id + BigInt(entryOffset)).toString())
    if (next && deletedIds.has(next.predecessor.toString()))
      void moveEntryToPredecessor<T>(
        crListReplica,
        next,
        getEntryTailId(replacement),
        delta
      )
    current = replacement
  }

  crListReplica.size = crListReplica.parentMap.size
  crListReplica.cursor = current ?? crListReplica.cursor
  crListReplica.cursorIndex = current
    ? listIndex
    : crListReplica.cursor
      ? Math.max(0, crListReplica.size - 1)
      : undefined
  void crListReplica.cache.clear()
  if (crListReplica.cursor && crListReplica.cursorIndex !== undefined)
    void crListReplica.cache.set(
      crListReplica.cursorIndex,
      crListReplica.cursor
    )

  return { change, delta }
}
