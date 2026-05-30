import type { CRListStateBlock } from '../../.types/type.js'

/**
 * Returns the virtual id of the last value in an RLE state block.
 */
export function getBlockEndId<T>(
  block: NonNullable<CRListStateBlock<T>>
): bigint {
  return block.id + BigInt(block.items.length - 1)
}
