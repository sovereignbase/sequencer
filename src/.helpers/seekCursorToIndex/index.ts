import type { CRListState } from '../../.types/type.js'
import { CRListError } from '../../.errors/class.js'

/**
 * Moves the replica cursor to a live index.
 *
 * Starting point is chosen as the nearest of: head (index 0), tail
 * (index size-1), or current cursor (cursorIndex). A valid cache entry
 * shortcuts the walk entirely. Stale `.index` on non-cursor entries are
 * repaired lazily as entries are visited.
 *
 * cursorIndex always stores the block-start of the cursor after this call.
 */
export function seekCursorToIndex<T>(
  targetIndex: number,
  crListReplica: CRListState<T>
): void {
  if (targetIndex < 0 || targetIndex >= crListReplica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS', 'Index out of bounds')
  const indexedEntry = crListReplica.cache.get(targetIndex)
  if (indexedEntry) {
    crListReplica.cursor = indexedEntry
    crListReplica.cursorIndex = indexedEntry.index
    return
  }
  if (!crListReplica.cursor)
    throw new CRListError('LIST_EMPTY', 'List is empty')

  // Pick the nearest anchor: head (0), tail block start, or current cursor.
  // Skip anchors that equal the cursor — no gain in jumping to the same entry.
  const cursorStart = crListReplica.cursorIndex ?? crListReplica.cursor.index
  const cursorEnd = cursorStart + crListReplica.cursor.values.length - 1
  const cursorDist =
    targetIndex < cursorStart
      ? cursorStart - targetIndex
      : targetIndex > cursorEnd
        ? targetIndex - cursorEnd
        : 0
  const headDist = targetIndex
  const tailStart = crListReplica.tail
    ? crListReplica.size - crListReplica.tail.values.length
    : crListReplica.size - 1
  const tailDist = targetIndex < tailStart ? tailStart - targetIndex : 0

  if (
    headDist < cursorDist &&
    headDist <= tailDist &&
    crListReplica.head &&
    crListReplica.head !== crListReplica.cursor
  ) {
    crListReplica.cursor = crListReplica.head
    crListReplica.cursorIndex = 0
  } else if (
    tailDist < cursorDist &&
    crListReplica.tail &&
    crListReplica.tail !== crListReplica.cursor
  ) {
    crListReplica.cursor = crListReplica.tail
    crListReplica.cursorIndex = tailStart
  }

  // cursorIndex is always the block-start of the cursor — use it as the
  // starting point so stale .index on non-cursor entries is irrelevant.
  let blockStart = crListReplica.cursorIndex ?? 0
  const direction = blockStart > targetIndex ? 'prev' : 'next'
  while (crListReplica.cursor) {
    crListReplica.cursor.index = blockStart
    const blockEnd = blockStart + crListReplica.cursor.values.length
    if (blockStart <= targetIndex && targetIndex < blockEnd) {
      crListReplica.cursorIndex = blockStart
      void crListReplica.cache.set(blockStart, crListReplica.cursor)
      return
    }
    if (direction === 'next') {
      blockStart += crListReplica.cursor.values.length
      crListReplica.cursor = crListReplica.cursor.next
    } else {
      const prev = crListReplica.cursor.prev
      if (prev) blockStart -= prev.values.length
      crListReplica.cursor = prev
    }
  }
}
