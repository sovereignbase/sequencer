import { is_sequence_strip } from '../../../helpers/index.js'
import {
  clear_sequence,
  initialize_sequence,
  merge_strip_into_sequence,
  write_strip_to_buffer,
} from '../../../wasm/index.js'
import type { Sequence, SequenceStrip } from '../../../types/type.js'
import { isUint32 as is_uint32 } from '@sovereignbase/utils'

const finalization_registry = new FinalizationRegistry((heldValue) => {
  if (!is_uint32(heldValue)) return
  void clear_sequence(heldValue)
})

export function __create<T>(data?: unknown): Sequence<T> {
  const state: Sequence<T> = {
    id: initialize_sequence(),
    footage: [],
  }

  if (!Array.isArray(data) || data.length < 1) return state

  for (const chunk of data) {
    if (!is_sequence_strip<T>(chunk)) continue
    const [mask, length, coordinate, footage] = chunk as SequenceStrip<T>

    const footage_frame_index: number = state.footage.length

    if (footage) void state.footage.push(...footage)

    write_strip_to_buffer(mask, length, footage_frame_index, coordinate)

    void merge_strip_into_sequence(state.id)

    void finalization_registry.register(state, state.id)
  }

  return state
}
