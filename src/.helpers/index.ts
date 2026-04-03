import type { DoublyLinkedListEntry } from '../.types/index.ts'

const walker = {
  forward<T>(cursor: DoublyLinkedListEntry<T>) {
    if (cursor?.next) cursor = cursor?.next
  },
  backward<T>(cursor: DoublyLinkedListEntry<T>) {
    if (cursor?.prev) cursor = cursor?.prev
  },
}
export function walkToIndex<T>(
  cursor: DoublyLinkedListEntry<T>,
  listLength: number,
  targetIndex: number
): void {
  if (targetIndex > listLength) throw new Error('out of bounds')
  if (!cursor) throw new Error('empty')
  const direction = cursor.index > targetIndex ? 'backward' : 'forward'
  const walk = walker[direction]
  while (cursor.index !== targetIndex) walk<T>(cursor)
}
