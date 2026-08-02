import type { Sequence, SequenceReel } from '../../../types/type.js'
import {
  get_projection_frame_count,
  read_strip_from_buffer,
  write_strip_at_projection_frame_index_to_buffer,
} from '../../../wasm/index.js'

export function __snapshot<T>(state: Sequence<T>): SequenceReel<T> {
  const reel: SequenceReel<T> = []
  const projection_frame_count = get_projection_frame_count(state.id)
  let frame_index = 0

  while (frame_index < projection_frame_count) {
    write_strip_at_projection_frame_index_to_buffer(state.id, frame_index)
    const [, strip_frame_count, footage_frame_index, coordinate] =
      read_strip_from_buffer()

    reel.push([
      0,
      strip_frame_count,
      coordinate,
      state.footage.slice(
        footage_frame_index,
        footage_frame_index + strip_frame_count
      ),
    ])
    frame_index += strip_frame_count
  }

  return reel
}
