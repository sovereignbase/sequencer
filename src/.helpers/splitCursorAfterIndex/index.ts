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
  // Cursor must already be positioned on a live block by the caller.
  const cursor = crListReplica.currentBlock
  if (!cursor) return false

  // Insertion at size appends after the current cursor block.
  if (listIndex === crListReplica.size) {
    return { block: cursor, next: undefined }
  }

  // Current cursor index is required to compute the split offset.
  const blockStart = crListReplica.currentBlockIndex
  if (blockStart === undefined) return false

  // Offset identifies the target item inside the cursor block.
  const offset = listIndex - blockStart

  // Split when the after-boundary falls before the cursor block end.
  if (offset < cursor.items.length - 1) {
    const [left, right] = splitBlock<T>(crListReplica, cursor, offset + 1)
    return { block: left, next: right }
  }

  // Boundary is already between the cursor block and its next neighbour.
  return { block: cursor, next: cursor.nextBlock }
}
