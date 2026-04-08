import { deleteLinkedEntry, walkToIndex } from '../../../.helpers/index.js'
import { CRListError } from '../../../.errors/class.js'
import type {
  CRListChange,
  CRListDelta,
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'

/**
 * Deletes a range from the replica live view.
 *
 * With no indexes, the full list is deleted. With only `startIndex`, all entries
 * from `startIndex` onward are deleted. With both indexes, the deleted range is
 * `[startIndex, endIndex)`.
 *
 * @param crListReplica Replica to mutate.
 * @param startIndex Inclusive start index. Defaults to `0`.
 * @param endIndex Exclusive end index. Defaults to the current list size.
 * @returns A local change and gossip delta, or `false` if nothing was deleted.
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
  crListReplica: CRListReplica<T>,
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

  void walkToIndex<T>(listIndex, crListReplica)
  if (!crListReplica.cursor) return false

  let current: DoublyLinkedListEntry<T> = crListReplica.cursor
  let deleted = 0

  while (current && deleted < deleteCount) {
    const next: DoublyLinkedListEntry<T> = current.next
    change[current.index] = undefined
    void deleteLinkedEntry<T>(crListReplica, current, delta)
    current = next
    deleted++
  }

  crListReplica.size = crListReplica.parentMap.size

  while (current) {
    current.index -= deleted
    current = current.next
  }

  return { change, delta }
}
