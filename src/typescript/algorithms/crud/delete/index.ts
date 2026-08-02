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

/**
 * Masks the half-open projection range `[start_index, end_index)`.
 *
 * A hard deletion also releases the corresponding JavaScript footage entries
 * after each mask is materialized. Indexes remain stable because releasing a
 * span never changes the footage array's length.
 *
 * @param state Sequence whose visible range is masked.
 * @param start_index First projection frame to mask.
 * @param end_index Projection boundary after the final frame to mask.
 * @param hard Whether to release the masked footage references immediately.
 */
export function __delete<T>(
  state: Sequence<T>,
  start_index = 0,
  end_index?: number,
  hard = false
): { change: SequenceChange<T>; reel: SequenceReel<T> } | false {
  const projection_frame_count = get_projection_frame_count(state.id)
  const deletion_end_index = end_index ?? projection_frame_count

  if (
    !is_safe_index(projection_frame_count, start_index, true) ||
    !is_safe_index(projection_frame_count, deletion_end_index, true) ||
    start_index >= deletion_end_index
  )
    return false

  const change: SequenceChange<T> = {}
  const reel: SequenceReel<T> = []
  let remaining_frame_count = deletion_end_index - start_index

  for (
    let frame_index = start_index;
    frame_index < deletion_end_index;
    frame_index++
  )
    change[frame_index] = undefined

  while (remaining_frame_count > 0) {
    const selected_footage_frame_index = get_footage_frame_index(
      state.id,
      start_index
    )
    write_strip_at_projection_frame_index_to_buffer(state.id, start_index)

    const [
      ,
      containing_strip_frame_count,
      containing_strip_footage_frame_index,
      [, containing_strip_start],
    ] = read_strip_from_buffer()

    const strip_frame_offset =
      selected_footage_frame_index - containing_strip_footage_frame_index

    const mask_frame_count = Math.min(
      remaining_frame_count,
      containing_strip_frame_count - strip_frame_offset
    )

    const previous_strip_start: SequencePoint = [
      containing_strip_start[0],
      containing_strip_start[1] + strip_frame_offset,
      containing_strip_start[2],
    ]

    const mask_coordinate: SequenceCoordinate = [
      previous_strip_start,
      issue_strip_start(mask_frame_count),
    ]

    write_strip_to_buffer(1, mask_frame_count, 0, mask_coordinate)
    const projection_frame_index = merge_strip_into_sequence(state.id)
    if (hard && projection_frame_index !== false) {
      state.footage.fill(
        undefined,
        selected_footage_frame_index,
        selected_footage_frame_index + mask_frame_count
      )
    }
    reel.push([1, mask_frame_count, mask_coordinate])
    remaining_frame_count -= mask_frame_count
  }

  return { change, reel }
}
