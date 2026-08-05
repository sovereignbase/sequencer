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
  // Initialize the Reel.
  const reel: Reel<T> = []
  //Initialize a buffered-Strip encoder
  const append_buffered_strip = (): void => {
    const meta = read_strip_from_buffer()
    const footage =
      meta[0] !== 0 && state.footage[meta[8]] === undefined
        ? undefined
        : (state.footage.slice(
            state.footage[meta[8]],
            state.footage[meta[8]] + strip_frame_count
          ) as Array<T>)

    if (footage === undefined) void reel.push([meta])
    else void reel.push([meta, footage])
  }

  // Traverse every materialized visible Strip and Mask in Sequence order.
  if (write_first_structural_strip_to_buffer(state.id))
    do void append_buffered_strip()
    while (write_next_structural_strip_to_buffer(state.id))

  // Append runtime-pending entries last without changing their Strip shape.
  if (write_first_pending_strip_to_buffer(state.id))
    do void append_buffered_strip()
    while (write_next_pending_strip_to_buffer(state.id))

  // Return the complete retained Reel.
  return reel
}
