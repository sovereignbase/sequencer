import { is_safe_index, issue_strip_start } from '../../../helpers/index.js'
import type {
  Sequence,
  SequenceChange,
  SequenceCoordinate,
  SequencePoint,
  SequenceReel,
} from '../../../types/type.js'
import {
  get_footage_frame_index,
  get_projection_frame_count,
  merge_strip_into_sequence,
  read_strip_from_buffer,
  write_strip_at_projection_frame_index_to_buffer,
  write_strip_to_buffer,
} from '../../../wasm/index.js'
import { __delete } from '../delete/index.js'

export function __update<T>(
  state: Sequence<T>,
  index: number,
  values: Array<T>,
  mode: 'overwrite' | 'before' | 'after'
): { change: SequenceChange<T>; reel: SequenceReel<T> } | false {
  if (!Array.isArray(values) || values.length === 0) return false

  const projection_frame_count = get_projection_frame_count(state.id)
  if (!is_safe_index(projection_frame_count, index, true)) return false

  const insertion_frame_index =
    mode === 'after' ? Math.min(index + 1, projection_frame_count) : index
  const masked =
    mode === 'overwrite'
      ? __delete(
          state,
          index,
          Math.min(index + values.length, projection_frame_count)
        )
      : false
  const change: SequenceChange<T> = masked ? masked.change : {}
  const reel: SequenceReel<T> = masked ? masked.reel : []
  let previous_strip_start: SequencePoint = [0, 0, 0]

  if (insertion_frame_index > 0) {
    const previous_projection_frame_index = insertion_frame_index - 1
    const previous_footage_frame_index = get_footage_frame_index(
      state.id,
      previous_projection_frame_index
    )
    write_strip_at_projection_frame_index_to_buffer(
      state.id,
      previous_projection_frame_index
    )

    const [, , strip_footage_frame_index, [, strip_start]] =
      read_strip_from_buffer()
    previous_strip_start = [
      strip_start[0],
      strip_start[1] + previous_footage_frame_index - strip_footage_frame_index,
      strip_start[2],
    ]
  }

  const frame_count = values.length
  const footage_frame_index = state.footage.length
  const coordinate: SequenceCoordinate = [
    previous_strip_start,
    issue_strip_start(frame_count),
  ]

  state.footage.push(...values)
  write_strip_to_buffer(0, frame_count, footage_frame_index, coordinate)
  merge_strip_into_sequence(state.id)
  reel.push([0, frame_count, coordinate, values])

  for (let frame_offset = 0; frame_offset < frame_count; frame_offset++)
    change[insertion_frame_index + frame_offset] = values[frame_offset]

  return { change, reel }
}
