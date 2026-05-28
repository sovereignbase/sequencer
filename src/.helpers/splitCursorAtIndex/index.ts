import type { CRListState, CRListStateEntry } from '../../.types/type.js'
import { splitBlock } from '../splitBlock/index.js'

/**
 * Splits the cursor block so the cursor starts exactly at `listIndex`.
 */
export function splitCursorAtIndex<T>(
  crListReplica: CRListState<T>,
  listIndex: number
): CRListStateEntry<T> {
  const cursor = crListReplica.cursor
  if (!cursor) return undefined
  const blockStart = crListReplica.cursorIndex ?? cursor.index
  if (blockStart < listIndex) {
    const [, right] = splitBlock<T>(
      crListReplica,
      cursor,
      listIndex - blockStart
    )
    crListReplica.cursor = right
    crListReplica.cursorIndex = listIndex
    return right
  }
  return cursor
}
