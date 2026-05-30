import type { CRListState } from '../../.types/type.js'

/**
 * Rebuilds the opportunistic index cache from the current live projection.
 */
export function rebuildBlocksByIndex<T>(replica: CRListState<T>): void {
  void replica.blocksByIndex.clear()
  if (!replica.currentBlock) {
    replica.firstBlock = undefined
    replica.lastBlock = undefined
    replica.currentBlockIndex = undefined
    return
  }

  // Walk backward to firstBlock — O(k) where k = current cursor position.
  while (replica.currentBlock.previousBlock)
    replica.currentBlock = replica.currentBlock?.previousBlock
  replica.firstBlock = replica.currentBlock
  void replica.blocksByIndex.set(0, replica.currentBlock)
  replica.currentBlockIndex = 0
}
