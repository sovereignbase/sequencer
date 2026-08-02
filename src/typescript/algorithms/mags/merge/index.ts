/**
 * MAGS integration of remotely supplied, already-issued Reel material.
 *
 * @module
 */
import { is_strip } from '../../../helpers/index.js'
import type { Change, Replica } from '../../../types/type.js'
import {
  merge_strip_into_sequence,
  write_strip_to_buffer,
} from '../../../wasm/index.js'

/**
 * Integrates transferable Strip material into one Replica.
 *
 * Candidate Reel entries are processed independently. Malformed entries and
 * visible Strips whose Footage length differs from their Frame count are
 * ignored. A valid Strip whose coordinate dependency has not arrived remains
 * pending in the native Projector and produces no immediate Change.
 * Merge issues no Sequence Points. Native integration orders competing visible
 * Strip starts ascending after ordinary points and descending after the Root;
 * a Mask references its containing indexed Strip and first existing Frame.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica receiving the candidate Reel material.
 * @param data Unknown value expected to contain transferable Strips.
 * @returns A minimal visible Change when at least one Strip materializes, or
 * `false` when no input changes the current Projection immediately.
 */
export function __merge<T>(
  state: Replica<T>,
  data: unknown
): Change<T> | false {
  // Validate the candidate Reel container and initialize the Change.
  if (!Array.isArray(data)) return false

  const change: Change<T> = {}
  let changed = false

  // Validate and transfer each candidate Strip independently.
  for (const chunk of data) {
    // Validate tuple shape and complete visible Footage.
    if (!is_strip<T>(chunk)) continue

    const [is_masked, frame_count, coordinate, footage] = chunk
    if (is_masked === 0 && footage?.length !== frame_count) continue

    // Append visible Footage at a stable, non-compacting span.
    const footage_frame_index = state.footage.length

    if (is_masked === 0) state.footage.push(...footage!)

    // Transfer the Strip for native dependency and ordering resolution.
    write_strip_to_buffer(
      is_masked,
      frame_count,
      footage_frame_index,
      coordinate
    )
    const projection_frame_index = merge_strip_into_sequence(state.id)
    if (projection_frame_index === false) continue

    // Project the accepted Strip into the consumer-facing Change.
    changed = true
    for (let frame_offset = 0; frame_offset < frame_count; frame_offset++)
      change[projection_frame_index + frame_offset] =
        is_masked === 0 ? footage![frame_offset] : undefined
  }

  // Return only an immediately materialized visible change.
  return changed ? change : false
}
