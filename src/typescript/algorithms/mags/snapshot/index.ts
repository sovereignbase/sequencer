/**
 * MAGS capture of complete retained Replica state without point issuance.
 *
 * @module
 */
import type { Reel, Replica } from '../../../types/type.js'
import {
  read_strip_from_buffer,
  write_first_pending_strip_to_buffer,
  write_first_structural_strip_to_buffer,
  write_next_pending_strip_to_buffer,
  write_next_structural_strip_to_buffer,
} from '../../../wasm/index.js'

/**
 * Captures materialized state and unresolved operations.
 *
 * Every Mask remains structural after hard deletion and garbage collection.
 * A Mask omits Footage after its JavaScript references are released. Visible
 * Strips and unreleased soft-deleted Masks include independent Footage arrays.
 * Pending indexes are runtime-only and are not serialized.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica whose complete retained state is captured.
 * @returns Complete retained state, including unresolved operations.
 */
export function __snapshot<T>(state: Replica<T>): Reel<T> {
  // Initialize the Reel and one buffered-Strip encoder.
  const reel: Reel<T> = []
  const append_buffered_strip = (): void => {
    const [is_masked, strip_frame_count, footage_frame_index, coordinate] =
      read_strip_from_buffer()
    const mask_state =
      is_masked === 3 || is_masked === 5 || is_masked === 7
        ? is_masked
        : is_masked === 0
          ? 0
          : 1
    const footage =
      is_masked !== 0 && state.footage[footage_frame_index] === undefined
        ? undefined
        : (state.footage.slice(
            footage_frame_index,
            footage_frame_index + strip_frame_count
          ) as Array<T>)

    if (footage === undefined)
      reel.push([mask_state, strip_frame_count, coordinate])
    else reel.push([mask_state, strip_frame_count, coordinate, footage])
  }

  // Traverse every materialized visible Strip and Mask in Sequence order.
  if (write_first_structural_strip_to_buffer(state.id))
    do append_buffered_strip()
    while (write_next_structural_strip_to_buffer(state.id))

  // Append runtime-pending entries last without changing their Strip shape.
  if (write_first_pending_strip_to_buffer(state.id))
    do append_buffered_strip()
    while (write_next_pending_strip_to_buffer(state.id))

  // Return the complete retained Reel.
  return reel
}
