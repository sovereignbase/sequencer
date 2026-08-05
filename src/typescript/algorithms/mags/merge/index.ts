/**
 * MAGS integration of remotely supplied, already-issued Reel material.
 *
 * @module
 */
import { is_strip } from '../../../helpers/index.js'
import type { Change, Replica } from '../../../types/type.js'
import {
  get_footage_frame_index,
  get_projection_frame_count,
  merge_strip_into_sequence,
  write_strip_to_buffer,
} from '../../../wasm/index.js'

/**
 * Integrates transferable Strip material into a Replica.
 *
 * Candidate Reel entries are validated and processed independently. Invalid
 * entries are ignored. A valid Strip whose coordinate dependency has not yet
 * arrived remains pending in the native Projector and produces no immediate
 * Change.
 *
 * Visible Strip Footage is appended to the Replica before native integration.
 * Masks contain no Footage and remove their projected Frames from the returned
 * Change.
 *
 * Merge issues no new Sequence Points.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica receiving the candidate Reel material.
 * @param data Unknown value expected to contain transferable Strips.
 * @returns The immediately materialized visible Change, or `false` when the
 * input produces no immediate Projection change.
 */
export function __merge<T>(
  state: Replica<T>,
  data: unknown
): Change<T> | false {
  if (!Array.isArray(data)) return false

  const id = state.id
  const stored_footage = state.footage
  let change: Change<T> | undefined
  let footage_frame_index: number

  for (const chunk of data) {
    if (!is_strip<T>(chunk)) continue

    const meta = chunk[0]
    const visible = meta[0] === 0
    let previous_projection_frame_count = 0

    if (visible) {
      previous_projection_frame_count = get_projection_frame_count(id)
      footage_frame_index = stored_footage.length
      stored_footage.push(...chunk[1]!)
    }

    void write_strip_to_buffer(meta, footage_frame_index ?? 0)

    const projection_frame_index = merge_strip_into_sequence(id)
    if (projection_frame_index === false) continue

    const output = (change ??= {})

    const changed_frame_count = visible
      ? get_projection_frame_count(id) - previous_projection_frame_count
      : meta[1]

    const projection_end = projection_frame_index + changed_frame_count

    if (visible) {
      for (
        let frame_index = projection_frame_index;
        frame_index < projection_end;
        frame_index++
      ) {
        output[frame_index] =
          stored_footage[get_footage_frame_index(id, frame_index)]
      }
    } else {
      for (
        let frame_index = projection_frame_index;
        frame_index < projection_end;
        frame_index++
      ) {
        output[frame_index] = undefined
      }
    }
  }

  return change ?? false
}
