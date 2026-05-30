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
  // All update modes require a target inside or at the end of the live list.
  if (listIndex < 0 || listIndex > replica.size)
    throw new CRListError('INDEX_OUT_OF_BOUNDS')

  // Values must be an array because update modes operate on contiguous blocks.
  if (!Array.isArray(listValues))
    throw new CRListError(
      'UPDATE_EXPECTED_AN_ARRAY',
      '`listValues` must be an Array'
    )

  // Empty writes are semantic no-ops and produce no events or deltas.
  if (listValues.length === 0) return false

  // Change is the local live-view patch; delta is the gossip payload.
  const change: CRListChange<T> = {}
  const delta: CRListDelta<T> = {}

  // Reserve one contiguous id run for the new block's item values.
  const blockId = getBlockStartId(replica, listValues.length)

  // Build a detached block; the selected mode will set anchors and links.
  const block: NonNullable<CRListStateBlock<T>> = {
    id: blockId,
    idString: blockId.toString(),
    items: listValues,
    previousBlockId: 0n,
    previousBlock: undefined,
    nextBlock: undefined,
  }

  // Delegate placement semantics to the selected mode implementation.
  void modes[mode](listIndex, block, replica, change, delta)

  // If placement produced no visible change, suppress downstream events.
  if (Object.keys(change).length === 0) return false

  // Return both the local patch and the CRDT delta to the caller.
  return { change, delta }
}
