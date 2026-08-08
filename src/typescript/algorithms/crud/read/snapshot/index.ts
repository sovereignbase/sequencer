/**
 * MAGS capture of complete retained Replica state without point issuance.
 *
 * @module
 */
import type { Delta, Replica, Strip } from '../../../../types/type.js'
import {
  read_strip_from_buffer,
  write_first_structural_strip_to_buffer,
  write_next_structural_strip_to_buffer,
} from '../../../../wasm/index.js'

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
export function __snapshot<T>(state: Replica<T>): Delta<T> {
  const { id, footage } = state
  // Initialize the Delta.
  const delta: Delta<T> = []
  //Initialize a buffered-Strip encoder
  const append_buffered_strip = (): void => {
    const meta = read_strip_from_buffer<T>()
    const values =
      meta[0] === 0 ? footage.slice(meta[9]!, meta[9]! + meta[2]) : undefined
    delete meta[9]
    if (values === undefined) void delta.push([meta as Strip<T>[0]])
    else
      void delta.push([
        meta as Strip<T>[0],
        values as Array<T>,
      ] satisfies Strip<T>)
  }

  // Traverse every materialized visible Strip and Mask in Sequence order.
  if (write_first_structural_strip_to_buffer(id))
    do void append_buffered_strip()
    while (write_next_structural_strip_to_buffer(id))

  // Append runtime-pending entries last without changing their Strip shape.
  if (write_first_pending_strip_to_buffer(id))
    do void append_buffered_strip()
    while (write_next_pending_strip_to_buffer(id))

  // Return the complete retained Delta.
  return delta
}
