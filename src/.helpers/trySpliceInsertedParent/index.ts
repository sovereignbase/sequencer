import type {
  CRListState,
  CRListStateEntry,
  CRListReparentedEntry,
} from '../../.types/index.js'
import { linkEntryBetween } from '../../.helpers/index.js'

/**
 * Applies the common single-insert reparent delta without a full projection rebuild.
 */
export function trySpliceInsertedParent<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateEntry<T>>>,
  reparentedEntries: Array<CRListReparentedEntry<T>>
): boolean {
  if (insertedEntries.length !== 1 || reparentedEntries.length !== 1)
    return false
  const inserted = insertedEntries[0]
  const reparented = reparentedEntries[0]
  const moved = reparented.entry
  if (
    moved.predecessor !== inserted.uuidv7 ||
    inserted.predecessor !== reparented.previousPredecessor
  )
    return false
  const siblings = crListReplica.childrenMap.get(inserted.predecessor)
  const children = crListReplica.childrenMap.get(inserted.uuidv7)
  if (
    siblings?.length !== 1 ||
    siblings[0] !== inserted ||
    children?.length !== 1 ||
    children[0] !== moved
  )
    return false
  const predecessor =
    inserted.predecessor === '\0'
      ? undefined
      : crListReplica.parentMap.get(inserted.predecessor)
  if (inserted.predecessor !== '\0' && !predecessor) return false
  const expectedIndex = predecessor ? predecessor.index + 1 : 0
  if (
    moved.index !== expectedIndex ||
    moved.prev !== predecessor ||
    (predecessor && predecessor.next !== moved)
  )
    return false

  void linkEntryBetween<T>(predecessor, inserted, moved)
  let current: CRListStateEntry<T> = inserted
  let index = expectedIndex
  while (current) {
    current.index = index
    index++
    current = current.next
  }
  crListReplica.index = new Map([[inserted.index, inserted]])
  crListReplica.cursor = inserted
  crListReplica.cursorIndex = inserted.index
  crListReplica.size = crListReplica.parentMap.size
  return true
}
