import type {
  CRListState,
  CRListStateEntry,
  CRListReparentedStateEntry,
} from '../../.types/type.js'
import { getEntryTailId } from '../getEntryTailId/index.js'
import { getIndexAfterEntryId } from '../getIndexAfterEntryId/index.js'
import { linkEntryBetween } from '../linkEntryBetween/index.js'

/**
 * Applies the common single-insert reparent delta without a full projection rebuild.
 */
export function trySpliceInsertedParent<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateEntry<T>>>,
  reparentedEntries: Array<CRListReparentedStateEntry<T>>
): boolean {
  if (insertedEntries.length !== 1 || reparentedEntries.length !== 1)
    return false
  const inserted = insertedEntries[0]
  const reparented = reparentedEntries[0]
  const moved = reparented.entry
  if (inserted.values.length !== 1 || moved.values.length !== 1) return false
  const insertedTailId = getEntryTailId(inserted)
  if (
    moved.predecessor !== insertedTailId ||
    inserted.predecessor !== reparented.oldPredecessor
  )
    return false
  const siblings = crListReplica.childrenMap.get(inserted.predecessor)
  const children = crListReplica.childrenMap.get(insertedTailId)
  if (
    siblings?.length !== 1 ||
    siblings[0] !== inserted ||
    children?.length !== 1 ||
    children[0] !== moved
  )
    return false
  const predecessor =
    inserted.predecessor === 0n
      ? undefined
      : crListReplica.parentMap.get(inserted.predecessor)
  if (inserted.predecessor !== 0n && !predecessor) return false
  const expectedIndex = getIndexAfterEntryId<T>(
    crListReplica,
    inserted.predecessor
  )
  if (expectedIndex === undefined) return false
  if (moved.prev !== predecessor || (predecessor && predecessor.next !== moved))
    return false

  if (moved.next === inserted) {
    moved.next = inserted.next
    if (moved.next) moved.next.prev = moved
  }
  void linkEntryBetween<T>(predecessor, inserted, moved)
  inserted.index = expectedIndex
  moved.index = expectedIndex + inserted.values.length
  if (!predecessor) crListReplica.head = inserted
  if (!moved.next) crListReplica.tail = moved
  void crListReplica.cache.clear()
  void crListReplica.cache.set(expectedIndex, inserted)
  crListReplica.cursor = inserted
  crListReplica.cursorIndex = expectedIndex
  crListReplica.size = crListReplica.parentMap.size
  return true
}
