/**
 * Soft and hard deletion represented by Masks over existing Frames.
 *
 * @module
 */
import { is_safe_index, issue_virtual_strip } from '../../../helpers/index.js'
import type {
  Change,
  Delta,
  Replica,
  Result,
  Strip,
} from '../../../types/type.js'
import {
  get_projection_frame_count,
  merge_strip_into_sequence,
  read_strip_from_buffer,
  write_strip_at_projection_frame_index_to_buffer,
} from '../../../wasm/index.js'

/**
 * Deletes the half-open visible range `[start_index, end_index)` by masking it.
 *
 * One Mask is created for each containing Strip crossed by the range, ensuring
 * that every Mask remains contained within one materialized Strip. Its
 * previous point is the containing Strip start and its own start is the first
 * masked Frame's existing Sequence Point; masking issues no new points. A hard
 * deletion also releases the corresponding JavaScript Footage immediately.
 * Released entries become `undefined`; the Footage array is not compacted, so
 * all retained indexes stay stable.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica whose visible values are deleted.
 * @param start_index Index of the first value to delete.
 * @param end_index Boundary immediately after the final value to delete;
 * defaults to the current length.
 * @param hard Whether to release deleted values immediately instead of
 * retaining them for recovery until garbage collection.
 * @returns The consumer-facing Change and transferable Delta, or `false` when
 * the requested range is invalid or empty.
 */
export function remove<T>(
  state: Replica<T>,
  start_index = 0,
  end_index?: number,
  hard = false
): Result<T> {
  // Validate the requested half-open Projection range.
  const projection_frame_count = get_projection_frame_count(state.id)
  const deletion_end_index = end_index ?? projection_frame_count

  if (
    !is_safe_index(start_index, projection_frame_count, true) ||
    !is_safe_index(deletion_end_index, projection_frame_count, true) ||
    start_index >= deletion_end_index
  )
    return false

  // Initialize the consumer result and unresolved deletion span.
  const change: Change<T> = {}
  const delta: Delta<T> = []
  let remaining_frame_count = deletion_end_index - start_index

  // Build removals at the original visible Projection positions.
  for (
    let frame_index = start_index;
    frame_index < deletion_end_index;
    frame_index++
  )
    change[frame_index] = undefined

  // Resolve and mask one containing materialized Strip at a time.
  while (remaining_frame_count > 0) {
    // Resolve the containing Strip and its Footage position.
    const footage_frame_index = write_strip_at_projection_frame_index_to_buffer(
      state.id,
      start_index
    )
    const containing_strip = read_strip_from_buffer<T>()

    // Derive the bounded span and its first existing masked Frame point.
    const strip_frame_offset = footage_frame_index - containing_strip[9]!

    const mask_frame_count = Math.min(
      remaining_frame_count,
      containing_strip[2] - strip_frame_offset
    )

    // Transfer and merge the Mask.
    const meta: Strip<T>[0] = issue_virtual_strip<T>(
      1,
      0,
      mask_frame_count,
      containing_strip[3],
      containing_strip[4],
      containing_strip[5] + strip_frame_offset
    )
    const projection_frame_index = merge_strip_into_sequence(
      state.id,
      start_index
    )

    // Release accepted hard-deletion Footage without compacting its array.
    if (hard && projection_frame_index !== false) {
      void state.footage.fill(
        undefined,
        footage_frame_index,
        footage_frame_index + mask_frame_count
      )
    }

    // Record the transferable Mask and advance the unresolved span.
    void delta.push([meta])
    remaining_frame_count -= mask_frame_count
  }

  // Return the local Projection Change and Mask Delta.
  return { change, delta }
}
