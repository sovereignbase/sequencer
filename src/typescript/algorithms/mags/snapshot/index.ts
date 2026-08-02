/**
 * MAGS capture of complete retained Replica state without point issuance.
 *
 * @module
 */
import type { Reel, Replica } from '../../../types/type.js'
import {
  read_strip_from_buffer,
  write_first_structural_strip_to_buffer,
  write_next_structural_strip_to_buffer,
} from '../../../wasm/index.js'

/**
 * Captures every materialized Strip in structural Sequence order.
 *
 * Collected Masks are absent because garbage collection removed them from the
 * Projector. Hard-deleted Masks remain structural but omit Footage whose
 * JavaScript references were released. Visible Strips and soft-deleted Masks
 * include independent Footage arrays.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica whose complete retained state is captured.
 * @returns A complete Reel in structural Sequence order, or an empty Reel for
 * an empty Replica.
 */
export function __snapshot<T>(state: Replica<T>): Reel<T> {
  // Initialize the Reel and native structural traversal.
  const reel: Reel<T> = []
  if (!write_first_structural_strip_to_buffer(state.id)) return reel

  // Traverse every retained visible Strip and Mask in Sequence order.
  do {
    // Read the current Strip and select its retained Footage representation.
    const [is_masked, strip_frame_count, footage_frame_index, coordinate] =
      read_strip_from_buffer()

    if (is_masked !== 0 && state.footage[footage_frame_index] === undefined)
      reel.push([1, strip_frame_count, coordinate])
    else
      reel.push([
        is_masked === 0 ? 0 : 1,
        strip_frame_count,
        coordinate,
        state.footage.slice(
          footage_frame_index,
          footage_frame_index + strip_frame_count
        ) as Array<T>,
      ])
  } while (write_next_structural_strip_to_buffer(state.id))

  // Return the complete retained Reel.
  return reel
}
