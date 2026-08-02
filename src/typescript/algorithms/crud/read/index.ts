import type { Sequence } from '../../../types/type.js'

import {
  get_footage_frame_index,
  get_projection_frame_count,
  read_strip_from_buffer,
  write_first_structural_strip_to_buffer,
  write_next_structural_strip_to_buffer,
} from '../../../wasm/index.js'
import { is_safe_index } from '../../../helpers/index.js'

export function __read<T>(state: Sequence<T>, index: number): T | undefined {
  if (!is_safe_index(index, get_projection_frame_count(state.id)))
    return undefined
  return state.footage[get_footage_frame_index(state.id, index)]
}

export function __length<T>(state: Sequence<T>) {
  return get_projection_frame_count(state.id)
}

/** Returns every retained value in projection order, including soft deletes. */
export function __recover<T>(state: Sequence<T>): Array<T> {
  const values: Array<T> = []
  if (!write_first_structural_strip_to_buffer(state.id)) return values

  do {
    const [, frame_count, footage_frame_index] = read_strip_from_buffer()
    const footage_end_index = footage_frame_index + frame_count

    for (let index = footage_frame_index; index < footage_end_index; index++) {
      const value = state.footage[index]
      if (value !== undefined) values.push(value)
    }
  } while (write_next_structural_strip_to_buffer(state.id))

  return values
}
