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
  replica.firstBlock = block
  replica.lastBlock = block
  replica.currentBlock = block
  replica.currentBlockIndex = 0
  void attachBlockToIndexes<T>(replica, block, delta)
  void replica.blocksByIndex.set(0, block)
  void writeBlockChange<T>(change, block, 0)
  replica.size = replica.blocksById.size
}
