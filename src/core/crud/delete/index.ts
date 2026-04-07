import {
  deleteEntryFromMaps,
  updateEntryToMaps,
  walkToIndex,
} from '../../../.helpers/index.js'
import { CRListError } from '../../../.errors/class.js'
import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'

/**
 * Time complexity: O(d + r + k), worst case O(n)
 * - d = distance from cursor to target index
 * - r = amount of nodes after the deleted range whose indexes must be shifted
 * - k = sibling bucket size when predecessor bucket is updated
 *
 * Space complexity: O(1)
 */
export function __delete<T>(
  crListReplica: CRListReplica<T>,
  startIndex?: number,
  endIndex?: number
): void {
  const listIndex = startIndex ?? 0
  const targetEndIndex = endIndex ?? crListReplica.size
  if (
    listIndex < 0 ||
    targetEndIndex < listIndex ||
    listIndex > crListReplica.size
  )
    throw new CRListError('INDEX_OUT_OF_BOUNDS')
  const deleteCount = Math.min(targetEndIndex, crListReplica.size) - listIndex
  if (deleteCount <= 0) return

  void walkToIndex<T>(listIndex, crListReplica)
  if (!crListReplica.cursor) return

  const prev: DoublyLinkedListEntry<T> = crListReplica.cursor.prev
  let current: DoublyLinkedListEntry<T> = crListReplica.cursor
  let deleted = 0

  while (current && deleted < deleteCount) {
    const next: DoublyLinkedListEntry<T> = current.next
    crListReplica.tombstones.add(current.uuidv7)
    void deleteEntryFromMaps<T>(crListReplica, current)
    current.prev = undefined
    current.next = undefined
    current = next
    deleted++
  }

  if (prev) prev.next = current
  if (current) {
    current.prev = prev
    if (crListReplica.tombstones.has(current.predecessor)) {
      const siblings = crListReplica.childrenMap.get(current.predecessor)
      const siblingIndex = siblings?.indexOf(current) ?? -1
      if (siblings && siblingIndex !== -1) siblings.splice(siblingIndex, 1)
      current.predecessor = prev?.uuidv7 ?? '\0'
      void updateEntryToMaps<T>(crListReplica, current)
    }
  }

  crListReplica.cursor = current ?? prev
  crListReplica.size = crListReplica.parentMap.size

  while (current) {
    current.index -= deleted
    current = current.next
  }
}
