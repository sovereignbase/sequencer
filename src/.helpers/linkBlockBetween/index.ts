import type { CRListStateBlock } from '../../.types/type.js'

/**
 * Links a live block between optional neighboring projection blocks.
 *
 * This helper only mutates local projection pointers. Stable CRDT ordering is
 * still carried by `previousBlockId` and the previousBlock index.
 */
export function linkBlockBetween<T>(
  previousBlock: CRListStateBlock<T>,
  block: NonNullable<CRListStateBlock<T>>,
  nextBlock: CRListStateBlock<T>
): void {
  block.previousBlock = previousBlock
  block.nextBlock = nextBlock
  if (previousBlock) previousBlock.nextBlock = block
  if (nextBlock) nextBlock.previousBlock = block
}
