import { is_sequence_strip } from '../../../helpers/index.js'
import type { Sequence } from '../../../types/type.js'
import {
  merge_strip_into_sequence,
  write_strip_to_buffer,
} from '../../../wasm/index.js'

export function __merge<T>(state: Sequence<T>, data: unknown): void {
  if (!Array.isArray(data)) return

  for (const chunk of data) {
    if (!is_sequence_strip<T>(chunk)) continue

    const [is_masked, frame_count, coordinate, footage] = chunk
    const footage_frame_index = state.footage.length

    if (footage) state.footage.push(...footage)

    write_strip_to_buffer(
      is_masked,
      frame_count,
      footage_frame_index,
      coordinate
    )
    merge_strip_into_sequence(state.id)
  }
}
