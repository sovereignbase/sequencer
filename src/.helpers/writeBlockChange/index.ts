import type { CRListChange, CRListStateBlock } from '../../.types/type.js'

/**
 * Writes every item from a block into an index-keyed change patch.
 */
export function writeBlockChange<T>(
  change: CRListChange<T>,
  block: NonNullable<CRListStateBlock<T>>,
  blockStartIndex: number
): void {
  for (let itemOffset = 0; itemOffset < block.items.length; itemOffset++)
    change[blockStartIndex + itemOffset] = block.items[itemOffset]
}
