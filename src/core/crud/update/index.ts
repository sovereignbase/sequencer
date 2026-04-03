import { CRListError } from '../../../.errors/class.js'
import { safeStructuredClone } from '@sovereignbase/utils'
import { walkToIndex } from '../../../.helpers/index.js'
import { v7 as uuidv7 } from 'uuid'
import { CRListReplica, DoublyLinkedListEntry } from '../../../.types/index.js'
/**
 * Time complexity: O(d), worst case O(n)
 * - d = distance from cursor to target index
 * Space complexity: O(1)
 */
export function __update<T>(
  crListReplica: CRListReplica<T>,
  listValue: T,
  listIndex: number,
  overwrite: boolean = false
): void {
  const [cloned, copiedValue] = safeStructuredClone(listValue)

  if (!cloned) throw new CRListError('VALUE_NOT_CLONEABLE')

  const v7 = uuidv7()

  if (listIndex === crListReplica.length) /**push*/ {
    if (!crListReplica.cursor) {
      crListReplica.cursor = {
        uuidv7: v7,
        value: copiedValue,
        predecessor: '',
        index: 0,
        next: undefined,
        prev: undefined,
      }
      crListReplica.length++
      return
    }
    const cursor = walkToIndex(
      crListReplica.cursor,
      crListReplica.length,
      crListReplica.length - 1
    )
    if (!cursor) return
    const entry: DoublyLinkedListEntry<T> = {
      uuidv7: v7,
      value: copiedValue,
      predecessor: cursor.uuidv7,
      index: listIndex,
      next: undefined,
      prev: cursor,
    }
    cursor.next = entry
    crListReplica.cursor = entry
    crListReplica.length++
  } else if (overwrite) /**overwrite index*/ {
    const cursor = walkToIndex(
      crListReplica.cursor,
      crListReplica.length,
      listIndex
    )
    if (!cursor) return
    crListReplica.tombstones.add(cursor.uuidv7)
    cursor.uuidv7 = v7
    cursor.value = copiedValue
    crListReplica.cursor = cursor
  } else /**insertAfter (between)*/ {
    const cursor = walkToIndex(
      crListReplica.cursor,
      crListReplica.length,
      listIndex
    )
    if (!cursor) return

    const entry: DoublyLinkedListEntry<T> = {
      uuidv7: v7,
      value: copiedValue,
      predecessor: cursor.uuidv7,
      index: cursor.index + 1,
      next: cursor.next,
      prev: cursor,
    }

    if (entry.next) entry.next.prev = entry
    cursor.next = entry
    crListReplica.length++

    let current = entry.next
    while (current) {
      current.index++
      current = current.next
    }
    crListReplica.cursor = entry
  }
}
