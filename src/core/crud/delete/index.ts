import {
  attachEntryToIndexes,
  deleteLiveEntry,
  linkEntryBetween,
  moveEntryToPredecessor,
  seekCursorToIndex,
} from '../../../.helpers/index.js'
import { CRListError } from '../../../.errors/class.js'
import { v7 as uuidv7 } from 'uuid'
import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../../.types/index.js'

/**
 * Deletes a range from the replica live view.
 *
 * With no indexes, the full list is deleted. With only `startIndex`, all entries
 * from `startIndex` onward are deleted. With both indexes, the deleted range is
 * `[startIndex, endIndex)`.
 *
 * @param crListReplica - Replica to mutate.
 * @param startIndex - Inclusive start index. Defaults to `0`.
 * @param endIndex - Exclusive end index. Defaults to the current list size.
 * @returns - A local change and gossip delta, or `false` if nothing was deleted.
 *
 * Time complexity: O(d + qk + r), worst case O(n^2)
 * - d = distance from cursor to target index
 * - q = amount of deleted nodes
 * - r = amount of nodes after the deleted range whose indexes must be shifted
 * - k = sibling bucket size when deleted entries are removed from buckets
 *
 * Space complexity: O(q)
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

  let current: CRListStateEntry<T> = crListReplica.cursor
  const predecessor = current.prev?.uuidv7 ?? '\0'
  const deletedIds = new Set<string>()
  let deleted = 0
  let currentIndex = crListReplica.cursorIndex ?? listIndex

  while (current && deleted < deleteCount) {
    const next: CRListStateEntry<T> = current.next
    change[currentIndex] = undefined
    void deletedIds.add(current.uuidv7)
    void crListReplica.index?.delete(currentIndex)
    void deleteLiveEntry<T>(crListReplica, current, delta)
    current = next
    currentIndex++
    deleted++
  }
  if (current && deletedIds.has(current.predecessor)) {
    const replacement: NonNullable<CRListStateEntry<T>> = {
      uuidv7: uuidv7(),
      value: current.value,
      predecessor,
      index: listIndex,
      next: undefined,
      prev: undefined,
    }
    const prev = current.prev
    const next = current.next
    void deleteLiveEntry<T>(crListReplica, current, delta)
    void linkEntryBetween<T>(prev, replacement, next)
    void attachEntryToIndexes<T>(crListReplica, replacement, delta)
    if (next?.predecessor === current.uuidv7)
      void moveEntryToPredecessor<T>(
        crListReplica,
        next,
        replacement.uuidv7,
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
  crListReplica.index = new Map()
  if (crListReplica.cursor && crListReplica.cursorIndex !== undefined)
    void crListReplica.index.set(
      crListReplica.cursorIndex,
      crListReplica.cursor
    )

  return { change, delta }
}
