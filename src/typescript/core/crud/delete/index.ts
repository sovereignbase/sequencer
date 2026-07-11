import { is_safe_index } from '../../../auxiliary/index.js'
import type {
  SequenceChange,
  SequencerState,
  SequenceStrip,
  SequenceReel,
} from '../../../types/type.js'
import { length_of } from '../../../wasm/index.js'

export function __delete<T>(
  state: SequencerState<T>,
  start_index?: number,
  end_index?: number
): { change: SequenceChange<T>; strip: SequenceStrip<T> } | false {
  const sequence_index = start_index ?? 0
  const seqeunce_length = length_of(state.projector_id)
  const target_end_index = end_index ?? seqeunce_length

  if (
    !is_safe_index(sequence_index, seqeunce_length, true) ||
    !is_safe_index(target_end_index, seqeunce_length, true) ||
    target_end_index < sequence_index
  )
    return false

  const delete_count =
    Math.min(target_end_index, seqeunce_length) - sequence_index
  if (delete_count <= 0) return false

  // Change records local visible removals; delta records tombstones for gossip.
  const change: SequenceChange<T> = {}
  const reel: SequenceReel<T> = []

  for (let index = 0; index < delete_count; index++) {
    const strip = generateSnapshotRange<T>(
      replica,
      undefined,
      getPreviousRangeId(replica, listIndex),
      1,
      getRangeIdAtIndex(replica, listIndex)
    )
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
    void reel.push(strip)
  }

  // Return the live-view patch and tombstone delta to the caller.
  return { change, reel }
}
