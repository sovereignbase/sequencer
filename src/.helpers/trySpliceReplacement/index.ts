import type {
  CRListReparentedStateEntry,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { getEntryTailId } from '../getEntryTailId/index.js'
import { getIndexAfterEntryId } from '../getIndexAfterEntryId/index.js'
import { linkEntryBetween } from '../linkEntryBetween/index.js'

/**
 * Applies the common tombstone-backed replacement delta without full relinking.
 */
export function trySpliceReplacement<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateEntry<T>>>,
  reparentedEntries: Array<CRListReparentedStateEntry<T>>,
  tombstoneCount: number
): boolean {
  if (
    tombstoneCount === 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length > 1
  )
    return false
  const inserted = insertedEntries[0]
  if (inserted.values.length !== 1) return false
  const insertedTailId = getEntryTailId(inserted)
  const predecessor =
    inserted.predecessor === 0n
      ? undefined
      : crListReplica.parentMap.get(inserted.predecessor)
  if (inserted.predecessor !== 0n && !predecessor) return false

  const siblings = crListReplica.childrenMap.get(inserted.predecessor)
  if (siblings?.length !== 1 || siblings[0] !== inserted) return false

  const reparented = reparentedEntries[0]
  const next = reparented?.entry
  if (next && next.values.length !== 1) return false
  if (next) {
    const children = crListReplica.childrenMap.get(insertedTailId)
    if (
      next.predecessor !== insertedTailId ||
      !crListReplica.tombstones.has(reparented.oldPredecessor.toString()) ||
      children?.length !== 1 ||
      children[0] !== next ||
      next.prev !== predecessor
    )
      return false
  } else if (crListReplica.childrenMap.get(insertedTailId)?.length) {
    return false
  }

  if (predecessor) {
    if (predecessor.next !== next) return false
  } else {
    let reachable = 0
    let current: CRListStateEntry<T> = next
    const limit = crListReplica.parentMap.size
    while (current && reachable < limit) {
      reachable++
      current = current.next
    }
    if (reachable !== crListReplica.parentMap.size - inserted.values.length)
      return false
  }

  const expectedIndex = getIndexAfterEntryId<T>(
    crListReplica,
    inserted.predecessor
  )
  if (expectedIndex === undefined) return false
  void linkEntryBetween<T>(predecessor, inserted, next)
  inserted.index = expectedIndex
  if (next) next.index = expectedIndex + inserted.values.length
  if (!predecessor) crListReplica.head = inserted
  if (!next) crListReplica.tail = inserted
  void crListReplica.cache.clear()
  void crListReplica.cache.set(expectedIndex, inserted)
  crListReplica.cursor = inserted
  crListReplica.cursorIndex = expectedIndex
  crListReplica.size = crListReplica.parentMap.size
  return true
}
