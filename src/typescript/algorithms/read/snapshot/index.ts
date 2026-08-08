/**
 * Capture of complete retained Replica state without issuing new Sequence Points.
 *
 * @module
 */
import type { Delta, Replica, Strip } from '../../../types/type.js'
import {
  read_strip_from_buffer,
  write_first_structural_strip_to_buffer,
  write_next_structural_strip_to_buffer,
  write_first_pending_strip_to_buffer,
  write_next_pending_strip_to_buffer,
} from '../../../wasm/index.js'

/**
 * Captures the complete retained state of a Replica as a transferable Delta.
 *
 * Every materialized visible Strip and Mask is serialized in Sequence order,
 * followed by any unresolved pending Strips. Runtime-only indexes and Footage
 * positions are omitted from the serialized representation.
 *
 * Visible Strips include independent copies of their referenced Footage. Masks
 * omit Footage once their consumer-owned values have been released.
 *
 * Snapshotting only reads already-issued Sequence material and never issues new
 * Sequence Points.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica whose complete retained state is captured.
 * @returns Complete transferable retained state, including unresolved pending
 * Strips.
 */
export function snapshot<T>(state: Replica<T>): Delta<T> {
  const { id, footage } = state

  // Initialize the transferable retained state.
  const delta: Delta<T> = []

  // Append the Strip currently exposed through the shared native buffer.
  const append_buffered_strip = (): void => {
    const meta = read_strip_from_buffer()
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

  // Append unresolved pending Strips after materialized Sequence state.
  if (write_first_pending_strip_to_buffer(id))
    do void append_buffered_strip()
    while (write_next_pending_strip_to_buffer(id))

  // Return the complete retained Delta.
  return delta
}
