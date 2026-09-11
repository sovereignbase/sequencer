/**
 * Soft and hard deletion represented by Masks over existing Frames.
 *
 * @module
 */
import { is_safe_index } from '../../helpers/is_safe_index/index.js'
import type { Delta, Replica } from '../../types/type.js'
import {
  get_projection_frame_count,
  no_projection_frame_index,
  update_sequence,
  read_projection_from_buffer,
  read_footage_spans,
  release_mask_footage,
  clear_footage_spans,
} from '../../wasm/index.js'

/**
 * Deletes the half-open visible range `[start_index, end_index)` by masking it.
 *
 * Native update issues one Mask for each containing Strip crossed by the range.
 * Each update reports its actual bounded length and retained Footage span.
 * The returned Delta contains flat Mask encodings and no new Footage. A hard
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
 * @returns The transferable Delta, or `false` when the requested range is
 * invalid or empty, or the first issuance is rejected. If a later issuance is
 * rejected, returns the accepted prefix Delta.
 */
export function remove<T>(
  state: Replica<T>,
  start_index = 0,
  end_index?: number,
  hard = false
): Delta<T> | false {
  const projection_frame_count = get_projection_frame_count(state[0])
  const deletion_end_index = end_index ?? projection_frame_count

  if (
    !is_safe_index(start_index, projection_frame_count, true) ||
    !is_safe_index(deletion_end_index, projection_frame_count, true) ||
    start_index >= deletion_end_index
  )
    return false

  const projection: number[] = []
  let remaining_frame_count = deletion_end_index - start_index

  while (remaining_frame_count > 0) {
    const position =
      update_sequence(
        state[0],
        start_index,
        2,
        remaining_frame_count,
        no_projection_frame_index
      ) >>> 0
    if (position === no_projection_frame_index) break

    const mask = read_projection_from_buffer(12)
    const mask_frame_count = mask[1]
    for (const word of mask) void projection.push(word)

    if (hard) {
      const footage_frame_index = read_footage_spans(1)[1]
      void state[1].fill(
        undefined,
        footage_frame_index,
        footage_frame_index + mask_frame_count
      )
      void release_mask_footage(
        state[0],
        mask[2],
        mask[3],
        mask[4]
      )
    }
    void clear_footage_spans()
    remaining_frame_count -= mask_frame_count
  }

  return projection.length === 0 ? false : [projection]
}
