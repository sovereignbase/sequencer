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
 * Every materialized visible Strip and Mask is serialized in Structural Order,
 * followed by unresolved Pending Strips. Stable Positions, dense links, sibling
 * distances, and Footage Indexes are omitted because they are local runtime
 * state.
 *
 * Visible Strips include independent copies of their referenced Footage. A
 * materialized Mask with retained Footage is encoded as a reconstructable
 * visible source fragment followed by its Footage-free Mask command. A source
 * whose Footage has been released is omitted. The original Pending Mask remains
 * transferable without a Footage mapping, allowing snapshots to compact the
 * released insertion metadata eventually.
 *
 * Snapshotting only reads already-issued Sequence material and never issues new
 * Sequence Points.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica whose complete retained state is captured.
 * @returns Complete transferable retained state, including unresolved pending
 * Strips.
 * @remarks Snapshot order is deterministic output, but creation still derives
 * Projection order from coordinates rather than trusting array order.
 */
export function snapshot<T>(state: Replica<T>): Delta<T> {
  const { id, footage } = state

  // Initialize the transferable retained state.
  const delta: Delta<T> = []

  // Append the Strip currently exposed through the shared native buffer.
  const append_buffered_strip = (materialized: boolean): void => {
    const meta = read_strip_from_buffer()
    const footage_frame_index = meta[9]!
    void meta.pop()

    if (meta[0] === 0) {
      if (footage[footage_frame_index] === undefined) return

      const values = footage.slice(
        footage_frame_index,
        footage_frame_index + meta[2]
      )
      void delta.push([meta as Strip<T>[0], values as Array<T>])
      return
    }

    if (!materialized) {
      void delta.push([meta as Strip<T>[0]])
      return
    }

    if (footage[footage_frame_index] === undefined) return

    const source_meta = [...meta] as Strip<T>[0]
    source_meta[0] = 0
    const values = footage.slice(
      footage_frame_index,
      footage_frame_index + meta[2]
    )
    void delta.push([source_meta, values as Array<T>])
    meta[1] = 0
    meta[6] = meta[3]
    meta[7] = meta[4]
    meta[8] = meta[5]
    void delta.push([meta as Strip<T>[0]])
  }

  // Traverse every materialized visible Strip and Mask in Sequence order.
  if (write_first_structural_strip_to_buffer(id))
    do void append_buffered_strip(true)
    while (write_next_structural_strip_to_buffer(id))

  // Append unresolved pending Strips after materialized Sequence state.
  if (write_first_pending_strip_to_buffer(id))
    do void append_buffered_strip(false)
    while (write_next_pending_strip_to_buffer(id))

  // Return the complete retained Delta.
  return delta
}
