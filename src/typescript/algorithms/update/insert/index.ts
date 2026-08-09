/**
 * Point-issuing visible insertion operations.
 *
 * @module
 */
import { is_safe_index, issue_virtual_strip } from '../../../helpers/index.js'
import type { Change, Delta, Replica, Result } from '../../../types/type.js'
import {
  get_projection_frame_count,
  merge_strip_into_sequence,
  read_strip_from_buffer,
  resolve_initial_projection,
  write_strip_at_projection_frame_index_to_buffer,
} from '../../../wasm/index.js'

/**
 * Inserts values at one visible Projection index.
 *
 * The inserted values begin at `index`. Any value previously visible at that
 * index, together with all following visible values, shifts right by
 * `values.length` Frames.
 *
 * Every successful call issues one contiguous visible Strip and returns the
 * resulting local Change together with the Delta to exchange with other
 * Replicas.
 *
 * @param state Replica to modify.
 * @param index Zero-based visible index at which insertion begins. The
 * Projection end is also a valid insertion position.
 * @param values Non-empty contiguous values to insert.
 * @returns The consumer-facing Change and transferable Delta, or `false` when
 * `values` or `index` is invalid.
 */
export function insert<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>
): Result<T> {
  const projection_frame_count = get_projection_frame_count(state.id)

  // Validate inserted values and the requested Projection position.
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    !is_safe_index(index, projection_frame_count, true)
  )
    return false

  // Initialize the consumer Change and transferable Delta.
  const change: Change<T> = {}
  const delta: Delta<T> = []

  // Cache Frame count.
  const frame_count = values.length

  if (projection_frame_count === 0) {
    const meta = issue_virtual_strip<T>(
      0,
      1,
      frame_count,
      0,
      0,
      0,
      state.footage.length
    )
    void state.footage.push(...values)
    void merge_strip_into_sequence(state.id)
    resolve_initial_projection(state.id)
    void delta.push([meta, values])
    for (let frame_offset = 0; frame_offset < frame_count; frame_offset++)
      change[frame_offset] = values[frame_offset]
    return { change, delta }
  }

  const is_inverse = index < projection_frame_count ? 1 : 0
  const containing_frame_index = is_inverse !== 0 ? index : index - 1
  const footage_frame_index = write_strip_at_projection_frame_index_to_buffer(
    state.id,
    containing_frame_index
  )
  const containing_strip = read_strip_from_buffer<T>()

  // Derive the inserted point from the containing Strip.
  const strip_frame_offset = footage_frame_index - containing_strip[9]!

  const meta = issue_virtual_strip<T>(
    0,
    is_inverse,
    frame_count,
    containing_strip[3],
    containing_strip[4],
    containing_strip[5] + strip_frame_offset,
    state.footage.length
  )

  void state.footage.push(...values)
  void merge_strip_into_sequence(state.id)
  void delta.push([meta, values])

  // Build the consumer-facing visible Change.
  for (let frame_offset = 0; frame_offset < frame_count; frame_offset++)
    change[index + frame_offset] = values[frame_offset]

  // Return both local and transferable insertion results.
  return { change, delta }
}
