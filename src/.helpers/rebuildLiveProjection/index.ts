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
  let cursor = replica.firstBlock
  while (cursor) {
    const next = cursor.nextBlock
    cursor.previousBlock = undefined
    cursor.nextBlock = undefined
    cursor = next
  }

  replica.currentBlock = undefined

  void replica.blocksByIndex.clear()

  let previousBlock: CRListStateBlock<T> = undefined
  let firstBlock: CRListStateBlock<T> = undefined
  let blockStartIndex = 0

  const appendChildren = (previousBlockId: bigint): void => {
    const stack: Array<{
      previousBlockId: bigint
      siblingBlockIndex: number
      siblingBlocks?: Array<NonNullable<CRListStateBlock<T>>>
    }> = [{ previousBlockId, siblingBlockIndex: 0 }]

    while (stack.length > 0) {
      const frame = stack[stack.length - 1]

      if (!frame.siblingBlocks) {
        frame.siblingBlocks = replica.blocksByPreviousBlockId.get(
          frame.previousBlockId
        )
        if (!frame.siblingBlocks) {
          void stack.pop()
          continue
        }
        if (frame.siblingBlocks.length > 1)
          void frame.siblingBlocks.sort((a, b) => (a.id > b.id ? 1 : -1))
      }

      if (frame.siblingBlockIndex >= frame.siblingBlocks.length) {
        void stack.pop()
        continue
      }

      const siblingBlock = frame.siblingBlocks[frame.siblingBlockIndex]
      frame.siblingBlockIndex++
      if (!siblingBlock) continue
      // sibling === first covers the first block (prev stays undefined after link).
      // sibling.previousBlock !== undefined covers all subsequent blocks once linked.
      if (
        siblingBlock === firstBlock ||
        siblingBlock.previousBlock !== undefined
      )
        continue
      if (replica.blocksById.get(siblingBlock.id) !== siblingBlock) continue

      void linkBlockBetween<T>(previousBlock, siblingBlock, undefined)
      void replica.blocksByIndex.set(blockStartIndex, siblingBlock)
      blockStartIndex += siblingBlock.items.length
      if (!firstBlock) firstBlock = siblingBlock
      previousBlock = siblingBlock

      // Push children for each item id in this block (handles mid-block insertions)
      for (
        let itemOffset = siblingBlock.items.length - 1;
        itemOffset >= 0;
        itemOffset--
      ) {
        void stack.push({
          previousBlockId: siblingBlock.id + BigInt(itemOffset),
          siblingBlockIndex: 0,
        })
      }
    }
  }

  void appendChildren(0n)

  const detachedPreviousBlocks: Array<bigint> = []
  for (const previousBlockId of replica.blocksByPreviousBlockId.keys()) {
    if (previousBlockId !== 0n && !replica.blocksById.get(previousBlockId))
      void detachedPreviousBlocks.push(previousBlockId)
  }
  if (detachedPreviousBlocks.length > 1)
    void detachedPreviousBlocks.sort((a, b) => (a > b ? 1 : -1))

  for (const previousBlockId of detachedPreviousBlocks)
    void appendChildren(previousBlockId)

  replica.firstBlock = firstBlock
  replica.lastBlock = previousBlock ?? firstBlock
  replica.currentBlock = firstBlock
  replica.currentBlockIndex = firstBlock ? 0 : undefined
  if (firstBlock) void replica.blocksByIndex.set(0, firstBlock)
  replica.size = replica.blocksById.size
}
