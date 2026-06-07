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
/**
 * Deletes a range from the replica live view.
 *
 * @param replica - Replica to mutate.
 * @param startIndex - Inclusive start index. Defaults to `0`.
 * @param endIndex - Exclusive end index. Defaults to the current list size.
 * @returns - A local change and gossip delta, or `false` if nothing was deleted.
 */
export function __delete<T>(
  replica: CRListState<T>,
  startIndex?: number,
  endIndex?: number
): { change: CRListChange<T>; delta: CRListDelta<T> } | false {
  const listIndex = startIndex ?? 0
  const liveAmount = wasmModule._get_live_item_amount(...replica.instanceId)
  const targetEndIndex = endIndex ?? liveAmount

  if (
    !isSafeIndex(listIndex, liveAmount, true) ||
    !isSafeIndex(targetEndIndex, liveAmount, true) ||
    targetEndIndex < listIndex
  )
    throw new CRListError('INDEX_OUT_OF_BOUNDS')

  const deleteCount = Math.min(targetEndIndex, liveAmount) - listIndex
  if (deleteCount <= 0) return false

  // Change records local visible removals; delta records tombstones for gossip.
  const change: CRListChange<T> = {}
  const delta: CRListDelta<T> = []

  for (let index = 0; index < deleteCount; index++) {
    const range = generateSnapshotRange<T>(
      replica,
      undefined,
      getPreviousRangeId(replica, listIndex),
      1
    )
    void replica.ranges.push(range)
    change[listIndex + index] = undefined
    void wasmModule._applyLocal(
      listIndex,
      1,
      1,
      0,
      ...replica.instanceId,
      ...range.id,
      ...range.previousRangeId
    )
    void delta.push(range)
  }

  // Return the live-view patch and tombstone delta to the caller.
  return { change, delta }
}
