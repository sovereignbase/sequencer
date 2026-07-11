import { is_sequence_strip } from '../../../auxiliary/index.js'
import { cue_projector, splice } from '../../../../wasm/index.js'
import type { SequencerState, SequenceReel } from '../../../types/type.js'

export function __create<T>(data?: unknown): SequencerState<T> {
  const state: SequencerState<T> = {
    footage: [],
    projector_id: cue_projector(),
  }

  // Non-Array snapshots are ignored so construction remains tolerant.
  if (!Array.isArray(data) || data.length < 1) return state

  for (const part of data) {
    if (!is_sequence_strip<T>(part)) continue

    const footage_code: number = state.footage.length

    const [previous_strip_start, this_strip_start] = part.sequence_coordinate

    void splice(
      part.footage.length,
      part.masked,
      footage_code,
      ...this_strip_start,
      ...previous_strip_start
    )
  }

  return state
}
