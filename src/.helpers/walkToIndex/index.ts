import type { DoublyLinkedListEntry } from '../../.types/index.ts'

const walker = {
  forward<T>(cursor: DoublyLinkedListEntry<T>) {
    return cursor?.next
  },
  backward<T>(cursor: DoublyLinkedListEntry<T>) {
    return cursor?.prev
  },
}
export function walkToIndex<T>(
  cursor: DoublyLinkedListEntry<T>,
  listLength: number,
  targetIndex: number
): DoublyLinkedListEntry<T> {
  if (targetIndex < 0 || targetIndex >= listLength)
    throw new Error('out of bounds')
  if (!cursor) throw new Error('empty')
  const direction = cursor.index > targetIndex ? 'backward' : 'forward'
  const walk = walker[direction]
  while (cursor.index !== targetIndex) {
    cursor = walk<T>(cursor)
    if (!cursor) throw new Error('broken list')
  }
  return cursor
}
