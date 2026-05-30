import type {
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { detachBlockFromIndexes } from '../detachBlockFromIndexes/index.js'
import { attachBlockToIndexes } from '../attachBlockToIndexes/index.js'

/**
 * Reattaches an existing live block to a stable previousBlock block id.
 *
 * The local projection links are intentionally left alone. The next relink or
 * rebuild uses the updated previousBlock index to place the block.
 */
export function changePreviousBlockOf<T>(
  replica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>,
  previousBlockId: bigint,
  deltaObject?: CRListDelta<T>
): void {
  // Remove old item-id and previousBlock bucket entries before changing anchor.
  void detachBlockFromIndexes<T>(replica, block)

  // Update the stable CRDT ordering anchor.
  block.previousBlockId = previousBlockId

  // Re-index the block under the new anchor and optionally add it to a delta.
  void attachBlockToIndexes<T>(replica, block, deltaObject)
}
