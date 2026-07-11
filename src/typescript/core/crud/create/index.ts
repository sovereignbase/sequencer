import { is_sequence_strip } from '../../../auxiliary/index.js'
import {
  cue_projector,
  splice_sequence,
  write_to_strip_start_buffer,
  this_strip_start_buffer,
  previous_strip_start_buffer,
} from '../../../wasm/index.js'
import type { SequencerState, SequenceReel } from '../../../types/type.js'

export function __create<T>(data?: unknown): SequencerState<T> {
  const state: SequencerState<T> = {
    footage: [],
    projector_id: cue_projector(),
  }

  if (!Array.isArray(data) || data.length < 1) return state

  for (const chunk of data) {
    if (!is_sequence_strip<T>(chunk)) continue

    const footage_position: number = state.footage.length

    void state.footage.push(...chunk.footage)

    const [previous_strip_start, this_strip_start] = chunk.sequence_coordinate

    void write_to_strip_start_buffer(
      previous_strip_start_buffer,
      previous_strip_start
    )
    void write_to_strip_start_buffer(this_strip_start_buffer, this_strip_start)

    void splice_sequence(footage_position, chunk.footage.length, chunk.masked)
  }

  return state
}
