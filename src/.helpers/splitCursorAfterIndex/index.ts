import type { CRListState, CRListStateEntry } from '../../.types/type.js'
import { splitBlock } from '../splitBlock/index.js'

/**
 * Splits the cursor block so insertion after `listIndex` is at a block edge.
 */
export function splitCursorAfterIndex<T>(
  crListReplica: CRListState<T>,
  listIndex: number
):
  | { entry: NonNullable<CRListStateEntry<T>>; next: CRListStateEntry<T> }
  | false {
  const cursor = crListReplica.cursor
  if (!cursor) return false
  if (listIndex === crListReplica.size) {
    return { entry: cursor, next: undefined }
  }

  const offset = listIndex - cursor.index
  if (offset < cursor.values.length - 1) {
    const [left, right] = splitBlock<T>(crListReplica, cursor, offset + 1)
    return { entry: left, next: right }
  }

  return { entry: cursor, next: cursor.next }
}
