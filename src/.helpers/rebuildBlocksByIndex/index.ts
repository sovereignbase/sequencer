import type { CRListState } from '../../.types/type.js'

/**
 * Rebuilds the opportunistic index cache from the current live projection.
 */
export function rebuildBlocksByIndex<T>(replica: CRListState<T>): void {
  // Discard stale block-start cache entries before rebuilding known positions.
  void replica.blocksByIndex.clear()

  // Empty projection has no endpoints or cursor index.
  if (!replica.currentBlock) {
    replica.firstBlock = undefined
    replica.lastBlock = undefined
    replica.currentBlockIndex = undefined
    return
  }

  // Walk backward to firstBlock — O(k) where k = current cursor position.
  while (replica.currentBlock.previousBlock)
    replica.currentBlock = replica.currentBlock?.previousBlock

  // The backward walk leaves the cursor on the projection head.
  replica.firstBlock = replica.currentBlock

  // Cache the head block start index.
  void replica.blocksByIndex.set(0, replica.currentBlock)

  // Cursor now points at index 0.
  replica.currentBlockIndex = 0
}
