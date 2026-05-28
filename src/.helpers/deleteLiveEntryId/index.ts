import type {
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { deleteLiveEntry } from '../deleteLiveEntry/index.js'
import { splitBlock } from '../splitBlock/index.js'

/**
 * Tombstones one virtual entry id, splitting its RLE block when needed.
 */
export function deleteLiveEntryId<T>(
  crListReplica: CRListState<T>,
  id: bigint,
  deltaBuf?: CRListDelta<T>
):
  | {
      index: number
      wasCursor: boolean
      wasTail: boolean
      entry: NonNullable<CRListStateEntry<T>>
    }
  | undefined {
  const source = crListReplica.parentMap.get(id)
  if (!source) return undefined

  let sourceIndex = -1
  if (source === crListReplica.head || !source.prev) sourceIndex = 0
  else if (source === crListReplica.tail || !source.next)
    sourceIndex = crListReplica.size - source.values.length
  else if (source === crListReplica.cursor)
    sourceIndex = crListReplica.cursorIndex ?? -1
  else if (crListReplica.cache.get(source.index) === source)
    sourceIndex = source.index

  const wasCursorOnSource = crListReplica.cursor === source
  let entryToDelete = source
  const offset = Number(id - source.id)
  const deletedIndex = sourceIndex === -1 ? -1 : sourceIndex + offset
  if (offset > 0) {
    const [, right] = splitBlock<T>(crListReplica, source, offset)
    entryToDelete = right
  }
  if (entryToDelete.values.length > 1) {
    const [left] = splitBlock<T>(crListReplica, entryToDelete, 1)
    entryToDelete = left
  }

  const result = {
    index: deletedIndex,
    wasCursor: wasCursorOnSource || crListReplica.cursor === entryToDelete,
    wasTail: entryToDelete.next === undefined,
    entry: entryToDelete,
  }
  void deleteLiveEntry<T>(crListReplica, entryToDelete, deltaBuf)
  return result
}
