import type { CRListStateEntry } from '../../.types/index.js'

export function insertBetween<T>(
  prev: CRListStateEntry<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  next: CRListStateEntry<T>
): void {
  linkedListEntry.prev = prev
  linkedListEntry.next = next
  if (prev) prev.next = linkedListEntry
  if (next) next.prev = linkedListEntry
}
