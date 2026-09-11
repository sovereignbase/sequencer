/**
 * Integration of remotely supplied, already-issued Delta material.
 *
 * @module
 */
import { is_delta } from '../../helpers/is_delta/index.js'
import type { Change, Replica } from '../../types/type.js'
import {
  get_projection_frame_count,
  no_projection_frame_index,
  wasm,
} from '../../wasm/index.js'
import { values } from '../values/index.js'

/**
 * Integrates encoded Strips and returns the changed suffix of the visible view.
 * Missing dependencies remain pending. Merge issues no new SequencePoints.
 *
 * @param state Replica receiving remote material.
 * @param data Transferable `[projection, footage]` tuple.
 * @returns A visible index patch, or false when no visible change occurs.
 */
export function merge<T>(state: Replica<T>, data: unknown): Change<T> | false {
  if (!is_delta<T>(data)) return false

  const [projection, footage] = data

  const previous_length: number = get_projection_frame_count(state[0])
  const footage_start: number = state[1].length
  const buffer_start =
    wasm._prepare_projection_buffer(projection.length / 10) >>> 2
  wasm.HEAPU32.set(projection, buffer_start)
  const projection_frame_index =
    wasm._merge_projection(state[0], footage_start) >>> 0
  if (projection_frame_index === no_projection_frame_index) return false

  void state[1].push(...footage!)

  const current = values(state, projection_frame_index)
  const change: Change<T> = {}
  for (let frame = 0; frame < current.length; ++frame)
    change[projection_frame_index + frame] = current[frame]
  for (
    let frame = projection_frame_index + current.length;
    frame < previous_length;
    ++frame
  )
    change[frame] = undefined
  return change
}
