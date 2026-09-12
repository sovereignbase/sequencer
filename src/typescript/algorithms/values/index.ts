/**
 * Batched visible Projection range reads through Footage Spans.
 *
 * @module
 */
import type { Replica } from '../../types/type.js'
import {
  get_projection_footage_spans,
  get_projection_frame_count,
  clear_footage_spans,
} from '../../wasm/index.js'

/**
 * Reads a half-open visible Projection range from ordered Footage spans.
 *
 * @param state Replica whose Projection is read.
 * @param start_index First visible frame to include.
 * @param end_index Boundary after the final frame; defaults to Projection end.
 * @returns The selected visible values, or an empty array for an empty range.
 *
 * @remarks The caller supplies valid range boundaries.
 *
 * Masks are skipped natively. The resulting spans are consumed before
 * another Wasm call can reuse the shared Footage Span Buffer.
 */
export function values<T>(
  state: Replica<T>,
  start_index = 0,
  end_index?: number
): Array<T | undefined> {
  const range_end = end_index ?? get_projection_frame_count(state[0])

  const spans = get_projection_footage_spans(state[0], start_index, range_end)
  if (!spans) return []

  const result = new Array<T | undefined>(range_end - start_index)
  let result_index = 0
  for (let span_index = 0; span_index < spans.length; span_index += 4) {
    const footage_start = spans[span_index + 1]
    const footage_end = footage_start + spans[span_index + 2]
    for (
      let footage_index = footage_start;
      footage_index < footage_end;
      ++footage_index
    )
      result[result_index++] = state[1][footage_index]
  }
  void clear_footage_spans()
  return result
}
