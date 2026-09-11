/**
 * Integration of remotely supplied, already-issued Delta material.
 *
 * @module
 */
import { is_delta } from '../../helpers/is_delta/index.js'
import type { Change, Replica } from '../../types/type.js'
import { get_projection_frame_count, no_projection_frame_index, wasm } from '../../wasm/index.js'
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
  if (!is_delta<T>(data) || data[0].length === 0 || data[0].length % 10 !== 0)
    return false
  let required = 0
  for (let strip = 0; strip < data[0].length; strip += 10) {
    if (data[0][strip] >= 3) break
    const length = data[0][strip + 1]
    if (length >= no_projection_frame_index - data[0][strip + 4]) return false
    if (data[0][strip] !== 2) required += length
  }
  if (required > data[1].length) return false

  const previous_length = get_projection_frame_count(state[0])
  const footage_start = state[1].length
  const incoming = data[1] === state[1] ? data[1].slice() : data[1]
  const buffer_start = wasm._prepare_projection_buffer(data[0].length / 10) >>> 2
  wasm.HEAPU32.set(data[0], buffer_start)
  const position = wasm._merge_projection(state[0], footage_start) >>> 0
  state[1].length = footage_start + required
  for (let frame = 0; frame < required; ++frame)
    state[1][footage_start + frame] = incoming[frame]
  if (position === no_projection_frame_index) return false

  const current = values(state, position)
  const change: Change<T> = {}
  for (let frame = 0; frame < current.length; ++frame)
    change[position + frame] = current[frame]
  for (let frame = position + current.length; frame < previous_length; ++frame)
    change[frame] = undefined
  return change
}
