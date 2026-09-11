/**
 * Point-issuing visible insertion through the native update path.
 *
 * @module
 */
import { is_safe_index } from '../../helpers/is_safe_index/index.js'
import type { Delta, Replica } from '../../types/type.js'
import {
  get_projection_frame_count,
  no_projection_frame_index,
  update_sequence,
  read_projection_from_buffer,
} from '../../wasm/index.js'

/**
 * Inserts values at one visible Projection index.
 *
 * Native update issues the Strip and handles birth, before, or tail placement.
 * The returned Delta contains its flat twelve-word encoding and an independent
 * Footage array. Consumer values are not deep-cloned.
 *
 * @param state Replica to modify.
 * @param index Insertion position, including the current Projection end.
 * @param values Nonempty contiguous values to insert.
 * @returns The issued Delta, or false for invalid input or rejected issuance.
 * @remarks Reads and releases the native result buffer synchronously. Rejected
 * issuance leaves JavaScript Footage unchanged.
 */
export function insert<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>
): Delta<T> | false {
  const projection_frame_count = get_projection_frame_count(state[0])
  if (
    !Array.isArray(values) ||
    values.length === 0 ||
    !is_safe_index(index, projection_frame_count, true)
  )
    return false

  const tail = projection_frame_count !== 0 && index === projection_frame_count
  const footage_start = state[1].length
  const frame_count = values.length
  const position =
    update_sequence(
      state[0],
      tail ? index - 1 : index,
      tail ? 1 : 0,
      frame_count,
      footage_start
    ) >>> 0
  if (position === no_projection_frame_index) return false

  const projection = read_projection_from_buffer(12)
  const footage = values.slice()

  state[1].length = footage_start + frame_count
  for (let frame = 0; frame < frame_count; ++frame)
    state[1][footage_start + frame] = footage[frame]
  return [projection, footage]
}
