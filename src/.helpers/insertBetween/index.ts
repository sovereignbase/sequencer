import type { DoublyLinkedListEntry } from '../../.types/index.js'

export function insertBetween<T>(
  prev: DoublyLinkedListEntry<T>,
  linkedListEntry: NonNullable<DoublyLinkedListEntry<T>>,
  next: DoublyLinkedListEntry<T>
): void {
  linkedListEntry.prev = prev
  linkedListEntry.next = next
  if (prev) prev.next = linkedListEntry
  if (next) next.prev = linkedListEntry
}
