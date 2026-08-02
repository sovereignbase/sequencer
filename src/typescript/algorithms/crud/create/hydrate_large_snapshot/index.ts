/**
 * Preallocated hydration of a large retained Snapshot.
 *
 * @module
 */
import { is_strip } from '../../../../helpers/index.js'
import {
  hydrate_pending_snapshot_strip_into_sequence,
  hydrate_snapshot_strip_into_sequence,
  write_strip_to_buffer,
} from '../../../../wasm/index.js'
import type { Replica, Strip } from '../../../../types/type.js'

/** Hydrates a large candidate Snapshot without repeatedly growing Footage. */
export function hydrate_large_snapshot<T>(
  state: Replica<T>,
  data: Array<unknown>
): void {
  const snapshot_strips = new Array<Strip<T>>()
  let footage_frame_count = 0

  // Validate once and determine the complete stable Footage address space.
  for (const chunk of data) {
    if (!is_strip<T>(chunk)) continue
    const [is_masked, frame_count, , footage, is_pending] = chunk
    if (
      (is_masked === 0 && footage?.length !== frame_count) ||
      (footage !== undefined && footage.length !== frame_count)
    )
      continue
    snapshot_strips.push(chunk)
    if (footage !== undefined || is_pending !== 1)
      footage_frame_count += frame_count
  }

  state.footage = new Array<T | undefined>(footage_frame_count)
  let next_footage_frame_index = 0

  // Copy values and hydrate validated Strips in supplied structural order.
  for (const chunk of snapshot_strips) {
    const [is_masked, frame_count, coordinate, footage, is_pending] = chunk
    const footage_frame_index = next_footage_frame_index

    if (footage !== undefined)
      for (let frame_offset = 0; frame_offset < frame_count; frame_offset++)
        state.footage[footage_frame_index + frame_offset] =
          footage[frame_offset]
    if (footage !== undefined || is_pending !== 1)
      next_footage_frame_index += frame_count

    write_strip_to_buffer(
      is_masked,
      frame_count,
      footage_frame_index,
      coordinate
    )
    if (is_pending === 1) hydrate_pending_snapshot_strip_into_sequence(state.id)
    else hydrate_snapshot_strip_into_sequence(state.id)
  }
}
