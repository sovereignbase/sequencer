import { CRListError } from '../../../.errors/class.js'
import { getBlockStartId } from '../../../.helpers/index.js'
import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateBlock,
} from '../../../.types/type.js'
import * as modes from './modes/index.js'

/**
 * Applies a local value mutation to the replica live view.
 *
 * The update can replace a range starting at the target item, insert values
 * before it, or insert values after it. The returned delta is suitable for
 * gossip and the returned change describes the local live-view patch.
 *
 * @param listIndex - Target index in the live list.
 * @param listValues - Values to insert or overwrite.
 * @param replica - Replica to mutate.
 * @param mode - Mutation mode relative to `listIndex`.
 * @returns - A local change and gossip delta, or `false` if no mutation occurred.
 */
export function __update<T>(
  listIndex: number,
  listValues: Array<T>,
  replica: CRListState<T>,
  mode: 'overwrite' | 'before' | 'after'
): { change: CRListChange<T>; delta: CRListDelta<T> } | false {
  if (listIndex < 0 || listIndex > replica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS')
  if (!Array.isArray(listValues))
    throw new CRListError(
      'UPDATE_EXPECTED_AN_ARRAY',
      '`listValues` must be an Array'
    )
  if (listValues.length === 0) return false

  const change: CRListChange<T> = {}
  const delta: CRListDelta<T> = {}

  const blockId = getBlockStartId(replica, listValues.length)
  const block: NonNullable<CRListStateBlock<T>> = {
    id: blockId,
    idString: blockId.toString(),
    items: listValues,
    previousBlockId: 0n,
    previousBlock: undefined,
    nextBlock: undefined,
  }

  void modes[mode](listIndex, block, replica, change, delta)

  return { change, delta }
}
