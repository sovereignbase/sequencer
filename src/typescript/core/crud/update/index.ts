import { CRListError } from '../../../.errors/class.js'
import {
  generateSnapshotRange,
  getPreviousRangeId,
  isSafeIndex,
  wasmModule,
} from '../../../.helpers/index.js'
import type {
  CRListChange,
  CRListDelta,
  CRListState,
} from '../../../.types/type.js'
import { __delete } from '../delete/index.js'

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
  // Values must be an array because update modes operate on contiguous blocks.
  if (!Array.isArray(listValues))
    throw new CRListError(
      'UPDATE_EXPECTED_AN_ARRAY',
      '`listValues` must be an Array'
    )

  // Empty writes are semantic no-ops and produce no events or deltas.
  if (listValues.length === 0) return false

  const liveAmount = wasmModule._get_live_item_amount(...replica.instanceId)
  if (!isSafeIndex(listIndex, liveAmount, true))
    throw new CRListError('INDEX_OUT_OF_BOUNDS')

  // Change is the local live-view patch; delta is the gossip payload.
  const removed =
    mode === 'overwrite'
      ? __delete(
          replica,
          listIndex,
          Math.min(listIndex + listValues.length, liveAmount)
        )
      : false
  const change: CRListChange<T> = removed ? removed.change : {}
  const delta: CRListDelta<T> = removed ? removed.delta : []
  const currentLiveAmount = wasmModule._get_live_item_amount(
    ...replica.instanceId
  )
  const insertIndex =
    mode === 'after' ? Math.min(listIndex + 1, currentLiveAmount) : listIndex
  const range = generateSnapshotRange(
    replica,
    listValues,
    getPreviousRangeId(replica, insertIndex)
  )
  const consumerReference = replica.values.length

  void replica.values.push(...listValues)

  if (insertIndex === currentLiveAmount) {
    void wasmModule._add_range_to(
      listValues.length,
      consumerReference,
      0,
      ...replica.instanceId,
      ...range.id,
      ...range.previousRangeId
    )
  } else {
    void wasmModule._applyLocal(
      insertIndex,
      listValues.length,
      0,
      consumerReference,
      ...replica.instanceId,
      ...range.id,
      ...range.previousRangeId
    )
  }

  for (let index = 0; index < listValues.length; index++)
    change[insertIndex + index] = listValues[index]
  void delta.push(range)

  // Return both the local patch and the CRDT delta to the caller.
  return { change, delta }
}
