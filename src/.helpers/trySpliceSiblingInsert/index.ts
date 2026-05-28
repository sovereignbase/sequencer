import type {
  CRListReparentedStateEntry,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { getEntryTailId } from '../getEntryTailId/index.js'
import { getIndexAfterEntryId } from '../getIndexAfterEntryId/index.js'
import { linkEntryBetween } from '../linkEntryBetween/index.js'

/**
 * Applies a simple concurrent sibling insert without a full projection rebuild.
 */
export function trySpliceSiblingInsert<T>(
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
  if (inserted.values.length !== 1) return false
  if (inserted.predecessor === 0n) return false
  if (crListReplica.childrenMap.get(getEntryTailId(inserted))?.length)
    return false

  const predecessor = crListReplica.parentMap.get(inserted.predecessor)
  const siblings = crListReplica.childrenMap.get(inserted.predecessor)
  if (!predecessor || !siblings || siblings.length < 2) return false

  void siblings.sort((a, b) => (a.id > b.id ? 1 : -1))
  const siblingIndex = siblings.indexOf(inserted)
  if (siblingIndex === -1) return false
  const lastSibling = siblings[siblings.length - 1]
  if (lastSibling !== inserted && lastSibling.next) return false

  const previousSibling = siblings[siblingIndex - 1]
  const nextSibling = siblings[siblingIndex + 1]
  if (previousSibling?.id) {
    if (crListReplica.childrenMap.get(getEntryTailId(previousSibling))?.length)
      return false
    if (previousSibling.next !== nextSibling) return false
  } else if (predecessor.next !== nextSibling) {
    return false
  }

  const prev = previousSibling ?? predecessor
  const next = nextSibling
  if (next && next.prev !== prev) return false

  const prevStart = previousSibling
    ? crListReplica.cursor === previousSibling
      ? (crListReplica.cursorIndex ?? previousSibling.index)
      : previousSibling.index
    : undefined
  const index =
    prevStart !== undefined
      ? prevStart + previousSibling!.values.length
      : getIndexAfterEntryId<T>(crListReplica, inserted.predecessor)
  if (index === undefined) return false
  void linkEntryBetween<T>(prev, inserted, next)
  inserted.index = index
  if (next) next.index = index + inserted.values.length
  if (!next) crListReplica.tail = inserted
  void crListReplica.cache.clear()
  void crListReplica.cache.set(index, inserted)
  crListReplica.cursor = inserted
  crListReplica.cursorIndex = index
  crListReplica.size = crListReplica.parentMap.size
  return true
}
