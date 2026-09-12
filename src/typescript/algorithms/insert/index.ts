/**
 * Point-issuing visible insertion through the native update path.
 *
 * @module
 */
import type { Delta, Replica } from '../../types/type.js'
import {
  no_projection_frame_index,
  update_sequence,
  read_strip_from_buffer,
} from '../../wasm/index.js'

/**
 * Inserts values at one visible Projection index.
 *
 * Native update issues the Strip and handles birth, before, or tail placement.
 * The returned Delta contains its flat twelve-word encoding and the supplied
 * values array itself. No defensive Footage copy is made.
 *
 * @param state Replica to modify.
 * @param index Insertion position, including the current Projection end.
 * @param values Nonempty contiguous values to insert.
 * @returns The issued Delta, or false for rejected issuance.
 * @remarks The caller supplies a valid index and values array.
 * @remarks Reads and releases the native result buffer synchronously. Rejected
 * issuance leaves JavaScript Footage unchanged.
 */
export function insert<T>(
  state: Replica<T>,
  index: number,
  values: Array<T>
): Delta<T> | false {
  const footage_start = state[1].length
  const frame_count = values.length
  const position =
    update_sequence(state[0], index, 0, frame_count, footage_start) >>> 0
  if (position === no_projection_frame_index) return false

  const projection = read_strip_from_buffer<T>()

  state[1].length = footage_start + frame_count
  for (let frame = 0; frame < frame_count; ++frame)
    state[1][footage_start + frame] = values[frame]
  return [projection, values]
}
