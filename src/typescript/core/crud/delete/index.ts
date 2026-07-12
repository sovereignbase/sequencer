import { is_safe_index } from '../../../auxiliary/index.js'
import type {
  SequenceChange,
  SequencerState,
  SequenceStrip,
  SequenceReel,
} from '../../../types/type.js'
import {
  length_of,
  sequence_coordinate_of,
  splice_sequence,
  write_to_strip_start_buffer,
} from '../../../wasm/index.js'

export function __delete<T>(
  state: SequencerState<T>,
  start_index?: number, // exclusive
  end_index?: number //inclusive
): { change: SequenceChange<T>; reel: SequenceReel<T> } | false {
  const sequence_index = start_index ?? 0
  const seqeunce_length = length_of(state.sequence_id)
  const target_end_index = end_index ?? seqeunce_length

  if (
    !is_safe_index(sequence_index, seqeunce_length, true) ||
    !is_safe_index(target_end_index, seqeunce_length, true) ||
    target_end_index < sequence_index
  )
    return false

  let delete_count: number =
    Math.min(target_end_index, seqeunce_length) - sequence_index

  if (delete_count <= 0) return false

  const change: SequenceChange<T> = {}
  const reel: SequenceReel<T> = []

  while (delete_count > 0) {
    const [
      previous_sequence_point_for_index,
      following_frame_count_in_strip_for_index,
    ] = sequence_coordinate_of(state.sequence_id, sequence_index)

    const mask_length =
      delete_count < following_frame_count_in_strip_for_index
        ? delete_count
        : following_frame_count_in_strip_for_index

    delete_count -= mask_length

    for (let i = 0; i < following_frame_count_in_strip; i++)
      change[sequence_Index + i] = undefined

    void splice_sequence()
    void reel.push(materialize_strip<T>())
  }

  // Return the live-view patch and tombstone delta to the caller.
  return { change, reel }
}
