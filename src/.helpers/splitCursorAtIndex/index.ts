import type { CRListState, CRListStateBlock } from '../../.types/type.js'
import { splitBlock } from '../splitBlock/index.js'

/**
 * Splits the cursor block so the cursor starts exactly at `listIndex`.
 */
export function splitCursorAtIndex<T>(
  crListReplica: CRListState<T>,
  listIndex: number
): CRListStateBlock<T> {
  const cursor = crListReplica.currentBlock
  if (!cursor) return undefined
  const blockStart = crListReplica.currentBlockIndex
  if (blockStart === undefined) return undefined
  if (blockStart < listIndex) {
    const [, right] = splitBlock<T>(
      crListReplica,
      cursor,
      listIndex - blockStart
    )
    crListReplica.currentBlock = right
    crListReplica.currentBlockIndex = listIndex
    return right
  }
  return cursor
}
