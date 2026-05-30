import type { CRListChange, CRListStateBlock } from '../../.types/type.js'

/**
 * Writes every item from a block into an index-keyed change patch.
 *
 * The change map represents the visible list projection. Each block item is
 * expanded into its absolute list index so event consumers can patch local
 * views without understanding block internals.
 */
export function writeBlockChange<T>(
  change: CRListChange<T>,
  block: NonNullable<CRListStateBlock<T>>,
  blockStartIndex: number
): void {
  // Copy each block-local offset into the public index-keyed patch.
  for (let itemOffset = 0; itemOffset < block.items.length; itemOffset++)
    change[blockStartIndex + itemOffset] = block.items[itemOffset]
}
