import { is_safe_index } from '../../../helpers/index.js'
import type { Replica } from '../../../types/type.js'
import {
  get_projection_footage_spans,
  get_projection_frame_count,
} from '../../../wasm/index.js'

/**
 * Reads a half-open visible Projection range from ordered Footage spans.
 *
 * @param state Replica whose Projection is read.
 * @param start_index First visible frame to include.
 * @param end_index Boundary after the final frame; defaults to Projection end.
 * @returns The selected visible values, or an empty array for an invalid or
 * empty range.
 */
export function values<T>(
  state: Replica<T>,
  start_index = 0,
  end_index?: number
): Array<T | undefined> {
  const projection_frame_count = get_projection_frame_count(state.id)
  const range_end = end_index ?? projection_frame_count
  if (
    !is_safe_index(start_index, projection_frame_count, true) ||
    !is_safe_index(range_end, projection_frame_count, true) ||
    start_index > range_end
  )
    return []

  const spans = get_projection_footage_spans(state.id, start_index, range_end)
  if (!spans) return []

  const result = new Array<T | undefined>(range_end - start_index)
  let result_index = 0
  for (let span_index = 0; span_index < spans.length; span_index += 2) {
    const footage_start = spans[span_index]
    const footage_end = footage_start + spans[span_index + 1]
    for (
      let footage_index = footage_start;
      footage_index < footage_end;
      ++footage_index
    )
      result[result_index++] = state.footage[footage_index]
  }
  return result
}
