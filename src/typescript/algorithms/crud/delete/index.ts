/**
 * Soft and hard deletion represented by Masks over existing Frames.
 *
 * @module
 */
import { is_safe_index } from '../../../helpers/index.js'
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
 * @returns The consumer-facing Change and transferable Reel, or `false` when
 * the requested range is invalid or empty.
 */
export function __delete<T>(
  state: Replica<T>,
  start_index = 0,
  end_index?: number,
  hard = false
):
  | {
      /** Minimal patch for the consumer's currently visible state. */
      change: Change<T>

      /** Masks to exchange with other Replicas. */
      reel: Reel<T>
    }
  | false {
  // Validate the requested half-open Projection range.
  const projection_frame_count = get_projection_frame_count(state.id)
  const deletion_end_index = end_index ?? projection_frame_count

  if (
    !is_safe_index(projection_frame_count, start_index, true) ||
    !is_safe_index(projection_frame_count, deletion_end_index, true) ||
    start_index >= deletion_end_index
  )
    return false

  // Initialize the consumer result and unresolved deletion span.
  const change: Change<T> = {}
  const reel: Reel<T> = []
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
    const selected_footage_frame_index =
      write_strip_at_projection_frame_index_to_buffer(state.id, start_index)

    const [
      ,
      containing_strip_frame_count,
      containing_strip_footage_frame_index,
      [, containing_strip_start],
    ] = read_strip_from_buffer()

    // Derive the bounded span and its first existing masked Frame point.
    const strip_frame_offset =
      selected_footage_frame_index - containing_strip_footage_frame_index

    const mask_frame_count = Math.min(
      remaining_frame_count,
      containing_strip_frame_count - strip_frame_offset
    )

    const mask_strip_start: SequencePoint = [
      containing_strip_start[0],
      containing_strip_start[1] + strip_frame_offset,
      containing_strip_start[2],
    ]

    const mask_coordinate: SequenceCoordinate = [
      containing_strip_start,
      mask_strip_start,
    ]

    // Transfer and merge the Mask without issuing Sequence Points.
    write_strip_to_buffer(1, mask_frame_count, 0, mask_coordinate)
    const projection_frame_index = merge_strip_into_sequence(state.id)

    // Release accepted hard-deletion Footage without compacting its array.
    if (hard && projection_frame_index !== false) {
      state.footage.fill(
        undefined,
        selected_footage_frame_index,
        selected_footage_frame_index + mask_frame_count
      )
    }

    // Record the transferable Mask and advance the unresolved span.
    reel.push([1, mask_frame_count, mask_coordinate])
    remaining_frame_count -= mask_frame_count
  }

  // Return the local Projection Change and Mask Reel.
  return { change, reel }
}
