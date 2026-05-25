import type { CRListChange, CRListStateEntry } from '../../.types/type.js'

/**
 * Writes every value from an RLE entry into an index-keyed change patch.
 */
export function writeEntryChange<T>(
  change: CRListChange<T>,
  entry: NonNullable<CRListStateEntry<T>>
): void {
  for (let index = 0; index < entry.values.length; index++)
    change[entry.index + index] = entry.values[index]
}
