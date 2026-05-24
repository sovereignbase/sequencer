import type { CRListStateEntry } from '../../.types/type.js'

/**
 * Links a live entry between optional neighboring projection entries.
 */
export function linkEntryBetween<T>(
  prev: CRListStateEntry<T>,
  linkedListEntry: NonNullable<CRListStateEntry<T>>,
  next: CRListStateEntry<T>
): void {
  linkedListEntry.prev = prev
  linkedListEntry.next = next
  if (prev) prev.next = linkedListEntry
  if (next) next.prev = linkedListEntry
}
