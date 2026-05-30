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
  // Point the block back to its new projection predecessor.
  block.previousBlock = previousBlock

  // Point the block forward to its new projection successor.
  block.nextBlock = nextBlock

  // Patch predecessor forward link when a predecessor exists.
  if (previousBlock) previousBlock.nextBlock = block

  // Patch successor backward link when a successor exists.
  if (nextBlock) nextBlock.previousBlock = block
}
