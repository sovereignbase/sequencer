/**
 * Point-issuing visible insertion and overwrite operations.
 *
 * @module
 */
import { is_safe_index, issue_strip_start } from '../../../helpers/index.js'
import type {
  Change,
  Reel,
  Replica,
  SequenceCoordinate,
  SequencePoint,
} from '../../../types/type.js'
import {
  get_projection_frame_count,
  merge_strip_into_sequence,
  read_strip_from_buffer,
  write_strip_at_projection_frame_index_to_buffer,
  write_strip_to_buffer,
} from '../../../wasm/index.js'
import { __delete } from '../delete/index.js'

/**
 * Inserts values relative to one visible index.
 *
 * `before` inserts at `index`, `after` inserts after it, and `overwrite` first
 * masks as many existing values as the insertion can cover before inserting at
 * the original index. Every call issues one contiguous visible Strip and
 * returns the local Change together with the Reel to exchange with Replicas.
 * Update is the only operation that issues new Sequence Points. Native
 * integration orders competing starts ascending after an ordinary point and
 * descending after the Root.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica to update.
 * @param index Zero-based visible index interpreted according to `mode`.
 * @param values Non-empty contiguous values to insert.
 * @param mode Placement or overwrite behavior.
 * @returns The consumer-facing Change and transferable Reel, or `false` when
 * `values` or `index` is invalid.
 */
export function __update<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>,
  mode: 'overwrite' | 'before' | 'after'
):
  | {
      /** Minimal patch for the consumer's currently visible state. */
      change: Change<T>

      /** Visible Strip and optional Masks to exchange with other Replicas. */
      reel: Reel<T>
    }
  | false {
  // Validate inserted values and the requested Projection position.
  if (!Array.isArray(values) || values.length === 0) return false

  const projection_frame_count = get_projection_frame_count(state.id)
  if (!is_safe_index(projection_frame_count, index, true)) return false

  // Resolve the insertion boundary and optional overwrite Masks.
  const insertion_frame_index =
    mode === 'after' ? Math.min(index + 1, projection_frame_count) : index
  const masking_result =
    mode === 'overwrite'
      ? __delete(
          state,
          index,
          Math.min(index + values.length, projection_frame_count)
        )
      : false

  // Initialize the consumer Change, transferable Reel, and Root context.
  const change: Change<T> = masking_result ? masking_result.change : {}
  const reel: Reel<T> = masking_result ? masking_result.reel : []
  let previous_strip_start: SequencePoint = [0, 0, 0]

  // Resolve the preceding visible Frame to its stable Sequence Point.
  if (insertion_frame_index > 0) {
    const previous_projection_frame_index = insertion_frame_index - 1
    const previous_footage_frame_index =
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

  // Issue the only new Sequence Point span created by this update.
  const frame_count = values.length
  const footage_frame_index = state.footage.length
  const coordinate: SequenceCoordinate = [
    previous_strip_start,
    issue_strip_start(frame_count),
  ]

  // Append Footage, transfer the Strip, and invoke native insert ordering.
  void state.footage.push(...values)
  write_strip_to_buffer(0, frame_count, footage_frame_index, coordinate)
  merge_strip_into_sequence(state.id)
  reel.push([0, frame_count, coordinate, values])

  // Build the consumer-facing visible Change.
  for (let frame_offset = 0; frame_offset < frame_count; frame_offset++)
    change[insertion_frame_index + frame_offset] = values[frame_offset]

  // Return both local and transferable update results.
  return { change, reel }
}
