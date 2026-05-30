import type {
  CRListReparentedStateBlock,
  CRListState,
  CRListStateBlock,
} from '../../.types/type.js'
import { getBlockEndId } from '../getBlockEndId/index.js'
import { getIndexAfterBlockId } from '../getIndexAfterBlockId/index.js'
import { getBlockStartIndex } from '../getBlockStartIndex/index.js'
import { linkBlockBetween } from '../linkBlockBetween/index.js'

/**
 * Applies a simple concurrent sibling insert without a full projection rebuild.
 */
export function trySpliceSiblingInsert<T>(
  crListReplica: CRListState<T>,
  insertedEntries: Array<NonNullable<CRListStateBlock<T>>>,
  reparentedEntries: Array<CRListReparentedStateBlock<T>>,
  tombstoneCount: number
): boolean {
  if (
    tombstoneCount !== 0 ||
    insertedEntries.length !== 1 ||
    reparentedEntries.length !== 0
  )
    return false
  const inserted = insertedEntries[0]
  if (inserted.items.length !== 1) return false
  if (
    crListReplica.blocksByPreviousBlockId.get(getBlockEndId(inserted))?.length
  )
    return false

  const previousBlock =
    inserted.previousBlockId === 0n
      ? undefined
      : crListReplica.blocksById.get(inserted.previousBlockId)
  const siblings = crListReplica.blocksByPreviousBlockId.get(
    inserted.previousBlockId
  )
  if (!siblings || siblings.length < 2) return false
  if (inserted.previousBlockId !== 0n && !previousBlock) return false

  void siblings.sort((a, b) => (a.id > b.id ? 1 : -1))
  const siblingIndex = siblings.indexOf(inserted)
  if (siblingIndex === -1) return false
  if (inserted.previousBlockId === 0n) {
    if (siblingIndex !== 0) return false
    const next = siblings[1]
    if (
      !next ||
      crListReplica.firstBlock !== next ||
      next.previousBlock !== undefined
    )
      return false
    void linkBlockBetween<T>(undefined, inserted, next)
    crListReplica.firstBlock = inserted
    void crListReplica.blocksByIndex.clear()
    void crListReplica.blocksByIndex.set(0, inserted)
    crListReplica.currentBlock = inserted
    crListReplica.currentBlockIndex = 0
    crListReplica.size = crListReplica.blocksById.size
    return true
  }
  if (!previousBlock) return false
  const previousSibling = siblings[siblingIndex - 1]
  const nextSibling = siblings[siblingIndex + 1]
  if (previousSibling?.id) {
    if (
      crListReplica.blocksByPreviousBlockId.get(getBlockEndId(previousSibling))
        ?.length
    )
      return false
    if (previousSibling.nextBlock !== nextSibling) return false
  } else if (previousBlock.nextBlock !== nextSibling) {
    return false
  }

  const prev = previousSibling ?? previousBlock
  const next = nextSibling
  if (next && next.previousBlock !== prev) return false

  const prevStart = previousSibling
    ? getBlockStartIndex(crListReplica, previousSibling)
    : undefined
  const index =
    prevStart !== undefined
      ? prevStart + previousSibling!.items.length
      : getIndexAfterBlockId<T>(crListReplica, inserted.previousBlockId)
  if (index === undefined) return false
  void linkBlockBetween<T>(prev, inserted, next)
  if (!next) crListReplica.lastBlock = inserted
  void crListReplica.blocksByIndex.clear()
  void crListReplica.blocksByIndex.set(index, inserted)
  crListReplica.currentBlock = inserted
  crListReplica.currentBlockIndex = index
  crListReplica.size = crListReplica.blocksById.size
  return true
}
