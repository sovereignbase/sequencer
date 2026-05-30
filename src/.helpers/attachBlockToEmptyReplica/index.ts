import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { attachBlockToIndexes } from '../attachBlockToIndexes/index.js'
import { writeBlockChange } from '../writeBlockChange/index.js'

/**
 * Installs the first live block in an empty replica.
 */
export function attachBlockToEmptyReplica<T>(
  replica: CRListState<T>,
  block: NonNullable<CRListStateBlock<T>>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  // The first block is simultaneously head, tail, and cursor.
  replica.firstBlock = block
  replica.lastBlock = block
  replica.currentBlock = block

  // The only live block starts at index 0.
  replica.currentBlockIndex = 0

  // Index the block and add it to the outbound delta.
  void attachBlockToIndexes<T>(replica, block, delta)

  // Cache the first block's start index.
  void replica.blocksByIndex.set(0, block)

  // Emit the inserted values as a local visible change.
  void writeBlockChange<T>(change, block, 0)

  // Size equals the number of indexed live item ids.
  replica.size = replica.blocksById.size
}
