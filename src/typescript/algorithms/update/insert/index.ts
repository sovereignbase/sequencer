/**
 * Point-issuing visible insertion operations.
 *
 * @module
 */
import { is_safe_index, issue_virtual_strip } from '../../../helpers/index.js'
import type { Delta, Replica } from '../../../types/type.js'
import {
  get_projection_frame_count,
  merge_strip_into_sequence,
  read_strip_from_buffer,
  write_strip_at_projection_frame_index_to_buffer,
} from '../../../wasm/index.js'

/**
 * Inserts values at one visible Projection index.
 *
 * The inserted values begin at `index`. Any value previously visible at that
 * index, together with all following visible values, shifts right by
 * `values.length` Frames.
 *
 * Every successful call issues and returns one contiguous visible Strip.
 *
 * Insertion before an existing Frame uses inverse placement. Insertion at
 * Projection end references the final visible Frame and uses forward placement.
 * The first insertion stages its Strip and initializes the sentinel-free native
 * Projection through Initial Projection Resolution.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica to modify.
 * @param index Zero-based visible index at which insertion begins. The
 * Projection end is also a valid insertion position.
 * @param values Non-empty contiguous values to insert.
 * @returns The transferable Delta, or `false` when `values` or `index` is
 * invalid.
 */
export function insert<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>
): Delta<T> | false {
  const projection_frame_count = get_projection_frame_count(state.id)

  // Validate inserted values and the requested Projection position.
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    !is_safe_index(index, projection_frame_count, true)
  )
    return false

  // Cache Frame count.
  const frame_count = values.length

  // First insert fast path
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
    void merge_strip_into_sequence(state.id, 0)
    return [[meta, values]]
  }

  const is_inverse = index === 0 ? 1 : 0
  const footage_frame_index = write_strip_at_projection_frame_index_to_buffer(
    state.id,
    index
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
  void merge_strip_into_sequence(state.id, index)
  return [[meta, values]]
}
