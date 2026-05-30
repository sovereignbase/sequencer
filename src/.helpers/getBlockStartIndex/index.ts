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
  // Cursor hit is the cheapest exact start-index lookup.
  if (replica.currentBlock === block) return replica.currentBlockIndex

  // Projection head always starts at index 0.
  if (replica.firstBlock === block) return 0

  // Projection tail start is size minus the tail block length.
  if (replica.lastBlock === block) return replica.size - block.items.length

  // Merge splices leave the cursor on the last touched block, and the next
  // queried block is usually a near neighbour (concurrent same-position and
  // ordered middle-insert deltas). A short bidirectional probe resolves those
  // in O(1) before falling back to the linear walk. Indexes are counted along
  // the live links from the cursor start, so the result stays exact.
  const cursor = replica.currentBlock
  const cursorIndex = replica.currentBlockIndex

  // Probe around a known cursor before falling back to a full walk.
  if (cursor && cursorIndex !== undefined) {
    // Start one block to the left and one block to the right of the cursor.
    let previousBlock = cursor.previousBlock
    let nextBlock = cursor.nextBlock

    // Track absolute indexes for the current left and right probe positions.
    let previousIndex = cursorIndex
    let nextIndex = cursorIndex + cursor.items.length

    // Search outward by a bounded number of steps to keep worst-case controlled.
    for (
      let step = 0;
      step < CURSOR_PROBE_RADIUS && (previousBlock || nextBlock);
      step++
    ) {
      // Probe one block to the left of the cursor.
      if (previousBlock) {
        previousIndex -= previousBlock.items.length
        if (previousBlock === block) return previousIndex
        previousBlock = previousBlock.previousBlock
      }

      // Probe one block to the right of the cursor.
      if (nextBlock) {
        if (nextBlock === block) return nextIndex
        nextIndex += nextBlock.items.length
        nextBlock = nextBlock.nextBlock
      }
    }
  }

  // Linear fallback starts from the projection head.
  let index = 0
  let currentBlock = replica.firstBlock

  // Guard the walk by live item count to avoid infinite loops on corrupted links.
  let visitedItems = 0
  const limit = replica.blocksById.size

  // Walk forward until the target block is found or the guard is exhausted.
  while (currentBlock && visitedItems < limit) {
    if (currentBlock === block) return index
    index += currentBlock.items.length
    visitedItems += currentBlock.items.length
    currentBlock = currentBlock.nextBlock
  }

  // Undefined means the block is not reachable in the live projection.
  return undefined
}
