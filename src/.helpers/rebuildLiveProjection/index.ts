import type { CRListState, CRListStateBlock } from '../../.types/type.js'
import { linkBlockBetween } from '../linkBlockBetween/index.js'

/**
 * Rebuilds the live linked-list projection and block-start cache from
 * previousBlock buckets.
 *
 * Sibling order is deterministic by bigint id, which keeps replicas convergent
 * even when deltas arrive in different orders.
 */
export function rebuildLiveProjection<T>(replica: CRListState<T>) {
  // Reset links via linked-list walk — O(B) not O(N)+Set.
  // New entries (prev/next already undefined) are skipped naturally.
  // Start from the current projection head.
  let cursor = replica.firstBlock

  // Remove old projection links so rebuild can relink from indexes only.
  while (cursor) {
    const next = cursor.nextBlock
    cursor.previousBlock = undefined
    cursor.nextBlock = undefined
    cursor = next
  }

  // Cursor will be reset to the rebuilt first block.
  replica.currentBlock = undefined

  // Block-start cache cannot survive projection rebuild.
  void replica.blocksByIndex.clear()

  // Last block appended to the rebuilt projection.
  let previousBlock: CRListStateBlock<T> = undefined

  // First block appended to the rebuilt projection.
  let firstBlock: CRListStateBlock<T> = undefined

  // Absolute start index for the next appended block.
  let blockStartIndex = 0

  // Append all blocks reachable from a previousBlock id using deterministic DFS.
  const appendChildren = (previousBlockId: bigint): void => {
    // Explicit stack avoids recursion depth risks on large documents.
    const stack: Array<{
      previousBlockId: bigint
      siblingBlockIndex: number
      siblingBlocks?: Array<NonNullable<CRListStateBlock<T>>>
    }> = [{ previousBlockId, siblingBlockIndex: 0 }]

    // Process stack frames until all reachable children have been appended.
    while (stack.length > 0) {
      // The top frame tracks siblings for one previousBlock id.
      const frame = stack[stack.length - 1]

      // Lazily load and sort sibling blocks for this previousBlock id.
      if (!frame.siblingBlocks) {
        frame.siblingBlocks = replica.blocksByPreviousBlockId.get(
          frame.previousBlockId
        )

        // No children for this id; remove the frame.
        if (!frame.siblingBlocks) {
          void stack.pop()
          continue
        }

        // Sort concurrent siblings by id for deterministic convergence.
        if (frame.siblingBlocks.length > 1)
          void frame.siblingBlocks.sort((a, b) => (a.id > b.id ? 1 : -1))
      }

      // All siblings for this anchor have been consumed.
      if (frame.siblingBlockIndex >= frame.siblingBlocks.length) {
        void stack.pop()
        continue
      }

      // Take the next sibling block from this anchor bucket.
      const siblingBlock = frame.siblingBlocks[frame.siblingBlockIndex]
      frame.siblingBlockIndex++

      // Defensive skip for sparse or corrupted sibling arrays.
      if (!siblingBlock) continue

      // sibling === first covers the first block (prev stays undefined after link).
      // sibling.previousBlock !== undefined covers all subsequent blocks once linked.
      if (
        siblingBlock === firstBlock ||
        siblingBlock.previousBlock !== undefined
      )
        continue

      // Ignore stale bucket entries that no longer point to live item ids.
      if (replica.blocksById.get(siblingBlock.id) !== siblingBlock) continue

      // Append the sibling after the last rebuilt block.
      void linkBlockBetween<T>(previousBlock, siblingBlock, undefined)

      // Cache the sibling's absolute live start index.
      void replica.blocksByIndex.set(blockStartIndex, siblingBlock)

      // Advance the next start index by the sibling's live length.
      blockStartIndex += siblingBlock.items.length

      // Record the first appended block as projection head.
      if (!firstBlock) firstBlock = siblingBlock

      // The appended sibling becomes predecessor for the next appended block.
      previousBlock = siblingBlock

      // Push children for each item id in this block (handles mid-block insertions)
      for (
        let itemOffset = siblingBlock.items.length - 1;
        itemOffset >= 0;
        itemOffset--
      ) {
        // Children of later items are pushed first so lower offsets process first.
        void stack.push({
          previousBlockId: siblingBlock.id + BigInt(itemOffset),
          siblingBlockIndex: 0,
        })
      }
    }
  }

  // First pass appends all blocks rooted at anchor 0.
  void appendChildren(0n)

  // Detached anchors are previousBlock ids whose source item is no longer live.
  const detachedPreviousBlocks: Array<bigint> = []

  // Collect detached previousBlock buckets for deterministic append after roots.
  for (const previousBlockId of replica.blocksByPreviousBlockId.keys()) {
    if (previousBlockId !== 0n && !replica.blocksById.get(previousBlockId))
      void detachedPreviousBlocks.push(previousBlockId)
  }

  // Sort detached roots so all replicas converge on the same fallback order.
  if (detachedPreviousBlocks.length > 1)
    void detachedPreviousBlocks.sort((a, b) => (a > b ? 1 : -1))

  // Append blocks whose anchors point at tombstoned or otherwise missing ids.
  for (const previousBlockId of detachedPreviousBlocks)
    void appendChildren(previousBlockId)

  // Publish rebuilt projection endpoints.
  replica.firstBlock = firstBlock
  replica.lastBlock = previousBlock ?? firstBlock

  // Place cursor at the rebuilt projection head.
  replica.currentBlock = firstBlock
  replica.currentBlockIndex = firstBlock ? 0 : undefined

  // Ensure the head cache entry exists when the projection is non-empty.
  if (firstBlock) void replica.blocksByIndex.set(0, firstBlock)

  // Live size equals indexed live item ids after rebuild.
  replica.size = replica.blocksById.size
}
