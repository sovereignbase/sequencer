import type { CRListState, CRListStateBlock } from '../../.types/type.js'
import { splitBlock } from '../splitBlock/index.js'

/**
 * Splits the cursor block so the cursor starts exactly at `listIndex`.
 */
export function splitCursorAtIndex<T>(
  crListReplica: CRListState<T>,
  listIndex: number
): CRListStateBlock<T> {
  // Cursor must already be positioned on a live block by the caller.
  const cursor = crListReplica.currentBlock
  if (!cursor) return undefined

  // Current cursor index is the block start of the cursor.
  const blockStart = crListReplica.currentBlockIndex
  if (blockStart === undefined) return undefined

  // Split only when the desired boundary is inside the current cursor block.
  if (blockStart < listIndex) {
    const [, right] = splitBlock<T>(
      crListReplica,
      cursor,
      listIndex - blockStart
    )

    // Move cursor to the right split, which starts at the requested index.
    crListReplica.currentBlock = right
    crListReplica.currentBlockIndex = listIndex
    return right
  }

  // Cursor is already aligned with the requested index.
  return cursor
}
