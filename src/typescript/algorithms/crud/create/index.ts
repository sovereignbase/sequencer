/**
 * Replica creation from an optional Reel of already-issued Strips.
 *
 * @module
 */
import { is_strip } from '../../../helpers/index.js'
import {
  append_structural_strip_to_sequence,
  clear_sequence,
  initialize_sequence,
  merge_strip_into_sequence,
  write_strip_to_buffer,
} from '../../../wasm/index.js'
import type { Replica } from '../../../types/type.js'
import { isUint32 as is_uint32 } from '@sovereignbase/utils'

/** Releases the native Projector after its JavaScript Replica is collected. */
const finalization_registry = new FinalizationRegistry((held_value) => {
  if (!is_uint32(held_value)) return
  void clear_sequence(held_value)
})

/**
 * Creates an independently maintained sequence state.
 *
 * Every structurally valid Strip in `data` is integrated in arrival order. The
 * native Projector resolves Sequence Coordinates, so the resulting Projection
 * does not depend on that order. Invalid input and invalid Reel entries are
 * ignored; an empty Replica is still returned. Creation integrates supplied
 * Sequence Points unchanged and never issues new points.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param data Optional candidate Reel used to initialize retained state.
 * @returns A new Replica owning its JavaScript Footage and native Projector.
 */
export function __create<T>(data?: unknown): Replica<T> {
  // Initialize consumer-owned Footage and an empty native Projector.
  const state: Replica<T> = {
    id: initialize_sequence(),
    footage: [],
  }
  void finalization_registry.register(state, state.id)

  // Validate the optional initialization Reel container.
  if (!Array.isArray(data) || data.length < 1) return state

  // Integrate structurally valid retained Strips in supplied Reel order.
  for (const chunk of data) {
    // Validate the transferable Strip tuple.
    if (!is_strip<T>(chunk)) continue
    const [is_masked, frame_count, coordinate, footage] = chunk
    if (
      (is_masked === 0 && footage?.length !== frame_count) ||
      (footage !== undefined && footage.length !== frame_count)
    )
      continue

    // Resolve a stable append-only Footage span for supplied values.
    const footage_frame_index = state.footage.length

    if (footage) void state.footage.push(...footage)
    else state.footage.length += frame_count

    // Transfer the Strip and let native code resolve dependency and ordering.
    write_strip_to_buffer(
      is_masked,
      frame_count,
      footage_frame_index,
      coordinate
    )

    if (!append_structural_strip_to_sequence(state.id))
      void merge_strip_into_sequence(state.id)
  }

  // Return the independently maintained Replica.
  return state
}
