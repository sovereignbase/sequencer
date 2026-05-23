import type {
  CRListReparentedEntry,
  CRListState,
  CRListStateEntry,
} from '../../.types/index.js'
import { linkEntryBetween } from '../linkEntryBetween/index.js'

/**
 * Applies a simple concurrent sibling insert without a full projection rebuild.
 */
export function trySpliceSiblingInsert<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateEntry<T>>>,
  reparentedEntries: Array<CRListReparentedEntry<T>>,
  tombstoneCount: number
): boolean {
  if (
    tombstoneCount !== 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length !== 0
  )
    return false
  const inserted = insertedEntries[0]
  if (inserted.predecessor === '\0') return false
  if (crListReplica.childrenMap.get(inserted.uuidv7)?.length) return false

  const predecessor = crListReplica.parentMap.get(inserted.predecessor)
  const siblings = crListReplica.childrenMap.get(inserted.predecessor)
  if (!predecessor || !siblings || siblings.length < 2) return false

  void siblings.sort((a, b) => (a.uuidv7 > b.uuidv7 ? 1 : -1))
  const siblingIndex = siblings.indexOf(inserted)
  if (siblingIndex === -1) return false
  const lastSibling = siblings[siblings.length - 1]
  if (lastSibling !== inserted && lastSibling.next) return false

  const previousSibling = siblings[siblingIndex - 1]
  const nextSibling = siblings[siblingIndex + 1]
  if (previousSibling?.uuidv7) {
    if (crListReplica.childrenMap.get(previousSibling.uuidv7)?.length)
      return false
    if (previousSibling.next !== nextSibling) return false
  } else if (predecessor.next !== nextSibling) {
    return false
  }

  const prev = previousSibling ?? predecessor
  const next = nextSibling
  if (next && next.prev !== prev) return false

  void linkEntryBetween<T>(prev, inserted, next)
  let current: CRListStateEntry<T> = inserted
  let index = prev.index + 1
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
