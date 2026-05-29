import type {
  CRListReparentedStateEntry,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { getEntryTailId } from '../getEntryTailId/index.js'
import { linkEntryBetween } from '../linkEntryBetween/index.js'

/**
 * Splices a concurrent sibling parent before the child it reparented.
 */
export function trySpliceSiblingParentInsert<T>(
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
  if (moved.predecessor !== insertedTailId) return false

  const siblings = crListReplica.childrenMap.get(inserted.predecessor)
  const children = crListReplica.childrenMap.get(insertedTailId)
  if (!siblings || siblings.length < 2 || children?.length !== 1) return false
  if (children[0] !== moved) return false

  void siblings.sort((a, b) => (a.id > b.id ? 1 : -1))
  const siblingIndex = siblings.indexOf(inserted)
  if (siblingIndex <= 0) return false

  const previousSibling = siblings[siblingIndex - 1]
  const nextSibling = siblings[siblingIndex + 1]
  const previousSiblingTailId = getEntryTailId(previousSibling)
  const tombstoneBridge =
    reparented.oldPredecessor !== previousSiblingTailId &&
    crListReplica.tombstones.has(reparented.oldPredecessor.toString())
  if (reparented.oldPredecessor !== previousSiblingTailId && !tombstoneBridge)
    return false
  if (previousSibling.next !== moved || moved.prev !== previousSibling)
    return false
  if (nextSibling && moved.next !== nextSibling) return false

  if (moved.next === inserted) {
    moved.next = inserted.next
    if (moved.next) moved.next.prev = moved
  }
  const siblingStart =
    crListReplica.cursor === previousSibling
      ? (crListReplica.cursorIndex ?? previousSibling.index)
      : previousSibling.index
  const index = siblingStart + previousSibling.values.length
  void linkEntryBetween<T>(previousSibling, inserted, moved)
  inserted.index = index
  moved.index = index + inserted.values.length
  void crListReplica.cache.clear()
  void crListReplica.cache.set(index, inserted)
  crListReplica.cursor = inserted
  crListReplica.cursorIndex = index
  if (!moved.next) crListReplica.tail = moved
  crListReplica.size = crListReplica.parentMap.size
  return true
}
