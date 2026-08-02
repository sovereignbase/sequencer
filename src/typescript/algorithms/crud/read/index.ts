import type { Sequence } from '../../../types/type.js'

import {
  get_footage_frame_index,
  get_projection_frame_count,
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

export function __recover<T>(state: Sequence<T>) {}
