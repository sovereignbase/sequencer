import type { CRListStateEntry } from '../../.types/type.js'

/**
 * Returns the virtual id of the last value in an RLE state entry.
 */
export function getEntryTailId<T>(
  entry: NonNullable<CRListStateEntry<T>>
): bigint {
  return entry.id + BigInt(entry.values.length - 1)
}
