import type {
  CRListReparentedStateEntry,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { getEntryTailId } from '../getEntryTailId/index.js'
import { getIndexAfterEntryId } from '../getIndexAfterEntryId/index.js'
import { linkEntryBetween } from '../linkEntryBetween/index.js'

/**
 * Splices a first child under a predecessor before the predecessor's old next.
 */
export function trySpliceChildInsert<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateEntry<T>>>,
  reparentedEntries: Array<CRListReparentedStateEntry<T>>,
  tombstoneCount: number
): boolean {
  if (
    tombstoneCount !== 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length !== 0
  )
    return false

  const inserted = insertedEntries[0]
  if (inserted.values.length !== 1 || inserted.predecessor === 0n) return false
  if (crListReplica.childrenMap.get(getEntryTailId(inserted))?.length)
    return false

  const predecessor = crListReplica.parentMap.get(inserted.predecessor)
  if (!predecessor || inserted.predecessor !== getEntryTailId(predecessor))
    return false

  const children = crListReplica.childrenMap.get(inserted.predecessor)
  if (children?.length !== 1 || children[0] !== inserted) return false

  const next = predecessor.next
  if (!next || next.prev !== predecessor) return false

  const index = getIndexAfterEntryId<T>(crListReplica, inserted.predecessor)
  if (index === undefined) return false
  void linkEntryBetween<T>(predecessor, inserted, next)
  inserted.index = index
  next.index = index + inserted.values.length
  void crListReplica.cache.clear()
  void crListReplica.cache.set(index, inserted)
  crListReplica.cursor = inserted
  crListReplica.cursorIndex = index
  crListReplica.size = crListReplica.parentMap.size
  return true
}
