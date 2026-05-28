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
  if (reparented.oldPredecessor !== getEntryTailId(previousSibling))
    return false
  if (previousSibling.next !== moved || moved.prev !== previousSibling)
    return false
  if (nextSibling && moved.next !== nextSibling) return false

  void linkEntryBetween<T>(previousSibling, inserted, moved)

  let current: CRListStateEntry<T> = inserted
  let index = previousSibling.index + previousSibling.values.length
  let limit = crListReplica.parentMap.size
  while (current) {
    if (limit-- <= 0) return false
    current.index = index
    index += current.values.length
    current = current.next
  }

  void crListReplica.cache.clear()
  void crListReplica.cache.set(inserted.index, inserted)
  crListReplica.cursor = inserted
  crListReplica.cursorIndex = inserted.index
  crListReplica.size = crListReplica.parentMap.size
  return true
}
