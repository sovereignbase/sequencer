import type { CRListState, CRListStateBlock } from '../../.types/type.js'
import { splitBlock } from '../splitBlock/index.js'

/**
 * Splits the cursor block so insertion after `listIndex` is at a block edge.
 */
export function splitCursorAfterIndex<T>(
  crListReplica: CRListState<T>,
  listIndex: number
):
  | { block: NonNullable<CRListStateBlock<T>>; next: CRListStateBlock<T> }
  | false {
  const cursor = crListReplica.currentBlock
  if (!cursor) return false
  if (listIndex === crListReplica.size) {
    return { block: cursor, next: undefined }
  }

  const blockStart = crListReplica.currentBlockIndex
  if (blockStart === undefined) return false
  const offset = listIndex - blockStart
  if (offset < cursor.items.length - 1) {
    const [left, right] = splitBlock<T>(crListReplica, cursor, offset + 1)
    return { block: left, next: right }
  }

  return { block: cursor, next: cursor.nextBlock }
}
