import { is_sequence_strip } from '../../../helpers/index.js'
import type { Sequence, SequenceChange } from '../../../types/type.js'
import {
  merge_strip_into_sequence,
  write_strip_to_buffer,
} from '../../../wasm/index.js'

export function __merge<T>(
  state: Sequence<T>,
  data: unknown
): SequenceChange<T> | false {
  if (!Array.isArray(data)) return false

  const change: SequenceChange<T> = {}
  let changed = false

  for (const chunk of data) {
    if (!is_sequence_strip<T>(chunk)) continue

    const [is_masked, frame_count, coordinate, footage] = chunk
    if (is_masked === 0 && footage?.length !== frame_count) continue

    const footage_frame_index = state.footage.length

    if (is_masked === 0) state.footage.push(...footage!)

    write_strip_to_buffer(
      is_masked,
      frame_count,
      footage_frame_index,
      coordinate
    )
    const projection_frame_index = merge_strip_into_sequence(state.id)
    if (projection_frame_index === false) continue

    changed = true
    for (let frame_offset = 0; frame_offset < frame_count; frame_offset++)
      change[projection_frame_index + frame_offset] =
        is_masked === 0 ? footage![frame_offset] : undefined
  }

  return changed ? change : false
}
