import type { SequencerState } from '../../../types/type.js'

import { footage_position_of, size_of } from '../../../wasm/index.js'
import { is_safe_index } from '../../../auxiliary/index.js'

export function __read<T>(
  state: SequencerState<T>,
  index: number
): T | undefined {
  if (!is_safe_index(index, size_of(state.projector_id))) return undefined
  return state.footage[footage_position_of(state.projector_id, index)]
}

export function __size<T>(state: SequencerState<T>) {
  return size_of(state.projector_id)
}
