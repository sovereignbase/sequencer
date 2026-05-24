import type {
  CRListReparentedEntry,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { linkEntryBetween } from '../../.helpers/index.js'

/**
 * Applies the common tombstone-backed replacement delta without full relinking.
 */
export function trySpliceReplacement<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateEntry<T>>>,
  reparentedEntries: Array<CRListReparentedEntry<T>>,
  tombstoneCount: number
): boolean {
  if (
    tombstoneCount === 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length > 1
  )
    return false
  const inserted = insertedEntries[0]
  const predecessor =
    inserted.predecessor === '\0'
      ? undefined
      : crListReplica.parentMap.get(inserted.predecessor)
  if (inserted.predecessor !== '\0' && !predecessor) return false

  const siblings = crListReplica.childrenMap.get(inserted.predecessor)
  if (siblings?.length !== 1 || siblings[0] !== inserted) return false

  const reparented = reparentedEntries[0]
  const next = reparented?.entry
  if (next) {
    const children = crListReplica.childrenMap.get(inserted.uuidv7)
    if (
      next.predecessor !== inserted.uuidv7 ||
      !crListReplica.tombstones.has(reparented.previousPredecessor) ||
      children?.length !== 1 ||
      children[0] !== next ||
      next.prev !== predecessor
    )
      return false
  } else if (crListReplica.childrenMap.get(inserted.uuidv7)?.length) {
    return false
  }

  if (predecessor) {
    if (predecessor.next !== next) return false
  } else {
    let reachable = 0
    let current: CRListStateEntry<T> = next
    while (current) {
      reachable++
      current = current.next
    }
    if (reachable !== crListReplica.parentMap.size - 1) return false
  }

  const expectedIndex = predecessor ? predecessor.index + 1 : 0
  void linkEntryBetween<T>(predecessor, inserted, next)

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
