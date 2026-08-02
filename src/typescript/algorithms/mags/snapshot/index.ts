import type { Sequence, SequenceReel } from '../../../types/type.js'
import {
  read_strip_from_buffer,
  write_first_structural_strip_to_buffer,
  write_next_structural_strip_to_buffer,
} from '../../../wasm/index.js'

export function __snapshot<T>(state: Sequence<T>): SequenceReel<T> {
  const reel: SequenceReel<T> = []
  if (!write_first_structural_strip_to_buffer(state.id)) return reel

  do {
    const [is_masked, strip_frame_count, footage_frame_index, coordinate] =
      read_strip_from_buffer()

    if (is_masked !== 0 && state.footage[footage_frame_index] === undefined)
      reel.push([1, strip_frame_count, coordinate])
    else
      reel.push([
        is_masked === 0 ? 0 : 1,
        strip_frame_count,
        coordinate,
        state.footage.slice(
          footage_frame_index,
          footage_frame_index + strip_frame_count
        ) as Array<T>,
      ])
  } while (write_next_structural_strip_to_buffer(state.id))

  return reel
}
