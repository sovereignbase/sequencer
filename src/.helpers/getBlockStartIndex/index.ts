import type { CRListState, CRListStateBlock } from '../../.types/type.js'

/** Bounded outward scan radius around the cursor before the linear fallback. */
const CURSOR_PROBE_RADIUS = 16

/**
 * Resolves a live block's current start index without storing it on the block.
 */
export function getBlockStartIndex<T>(
  replica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>
): number | undefined {
  if (replica.currentBlock === block) return replica.currentBlockIndex
  if (replica.firstBlock === block) return 0
  if (replica.lastBlock === block) return replica.size - block.items.length

  // Merge splices leave the cursor on the last touched block, and the next
  // queried block is usually a near neighbour (concurrent same-position and
  // ordered middle-insert deltas). A short bidirectional probe resolves those
  // in O(1) before falling back to the linear walk. Indexes are counted along
  // the live links from the cursor start, so the result stays exact.
  const cursor = replica.currentBlock
  const cursorIndex = replica.currentBlockIndex
  if (cursor && cursorIndex !== undefined) {
    let previousBlock = cursor.previousBlock
    let nextBlock = cursor.nextBlock
    let previousIndex = cursorIndex
    let nextIndex = cursorIndex + cursor.items.length
    for (
      let step = 0;
      step < CURSOR_PROBE_RADIUS && (previousBlock || nextBlock);
      step++
    ) {
      if (previousBlock) {
        previousIndex -= previousBlock.items.length
        if (previousBlock === block) return previousIndex
        previousBlock = previousBlock.previousBlock
      }
      if (nextBlock) {
        if (nextBlock === block) return nextIndex
        nextIndex += nextBlock.items.length
        nextBlock = nextBlock.nextBlock
      }
    }
  }

  let index = 0
  let currentBlock = replica.firstBlock
  let visitedItems = 0
  const limit = replica.blocksById.size

  while (currentBlock && visitedItems < limit) {
    if (currentBlock === block) return index
    index += currentBlock.items.length
    visitedItems += currentBlock.items.length
    currentBlock = currentBlock.nextBlock
  }

  return undefined
}
