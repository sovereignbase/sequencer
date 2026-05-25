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

  const wasCursorOnSource = crListReplica.cursor === source
  let entryToDelete = source
  const offset = Number(id - source.id)
  if (offset > 0) {
    const [, right] = splitBlock<T>(crListReplica, source, offset)
    entryToDelete = right
  }
  if (entryToDelete.values.length > 1) {
    const [left] = splitBlock<T>(crListReplica, entryToDelete, 1)
    entryToDelete = left
  }

  const result = {
    index: entryToDelete.index,
    wasCursor: wasCursorOnSource || crListReplica.cursor === entryToDelete,
    wasTail: entryToDelete.next === undefined,
    entry: entryToDelete,
  }
  void deleteLiveEntry<T>(crListReplica, entryToDelete, deltaBuf)
  return result
}
