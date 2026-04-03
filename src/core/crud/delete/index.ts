import { walkToIndex } from '../../../.helpers/index.js'
import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../../.types/index.js'

/**
 * Time complexity: O(d + m), worst case O(n)
 * - d = distance from cursor to target index
 * - m = amount of nodes after the deleted node whose indexes must be shifted
 * Space complexity: O(1)
 */
export function __delete<T>(
  crListReplica: CRListReplica<T>,
  startIndex?: number,
  endIndex?: number
): void {
  let listIndex = startIndex ?? 0
  let cursor = crListReplica.cursor
  while (listIndex < (endIndex ?? crListReplica.length)) {
    walkToIndex<T>(cursor, crListReplica.length, listIndex)
    if (!cursor) return
    const prev = cursor.prev
    const next = cursor.next
    crListReplica.tombstones.add(cursor.uuidv7)

    if (prev) prev.next = next
    if (next) {
      next.prev = prev
      if (prev) next.predecessor = prev.uuidv7
    }

    crListReplica.length--

    let current = next
    while (current) {
      current.index--
      current = current.next
    }

    crListReplica.cursor = next ?? prev

    cursor.prev = undefined
    cursor.next = undefined
  }
}
