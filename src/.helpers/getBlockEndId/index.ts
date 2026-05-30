import type { CRListStateBlock } from '../../.types/type.js'

/**
 * Returns the virtual id of the last value in an RLE state block.
 *
 * A block's first item owns `block.id`; every following item owns the next
 * contiguous bigint id.
 */
export function getBlockEndId<T>(
  block: NonNullable<CRListStateBlock<T>>
): bigint {
  // Last item id is the start id plus the final item offset.
  return block.id + BigInt(block.items.length - 1)
}
