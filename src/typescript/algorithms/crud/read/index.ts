/**
 * Projection reads, visible length inspection, and retained Footage recovery.
 *
 * @module
 */
import type { Replica } from '../../../types/type.js'

import {
  get_footage_frame_index,
  get_projection_frame_count,
  read_strip_from_buffer,
  write_first_structural_strip_to_buffer,
  write_next_structural_strip_to_buffer,
} from '../../../wasm/index.js'
import { is_safe_index } from '../../../helpers/index.js'

/**
 * Reads one visible value by zero-based index.
 *
 * @typeParam T Consumer-owned sequence value.
 * @param state Replica whose Projection is read.
 * @param index Zero-based visible index.
 * @returns The value at `index`, or `undefined` when the index is invalid or its
 * Footage has been released.
 */
export function __read<T>(state: Replica<T>, index: number): T | undefined {
  // Validate the requested visible Projection index.
  if (!is_safe_index(get_projection_frame_count(state.id), index))
    return undefined

  // Resolve the native Footage index and return its consumer-owned value.
  return state.footage[get_footage_frame_index(state.id, index)]
}

/**
 * Returns the number of visible values in a Replica's current Projection.
 *
 * @typeParam T Consumer-owned sequence value.
 * @param state Replica to measure.
 * @returns Current Projection Frame count.
 */
export function __length<T>(state: Replica<T>): number {
  // Read the native visible Frame count without traversing Strips.
  return get_projection_frame_count(state.id)
}

/**
 * Recovers every retained Footage value in structural Sequence order.
 *
 * Unlike a Projection read, recovery includes values represented by Masks.
 * Values released by hard deletion or garbage collection remain `undefined`
 * and are omitted from the dense result.
 *
 * @typeParam T Consumer-owned sequence value.
 * @param state Replica whose retained values are recovered.
 * @returns Dense values in structural Sequence order.
 */
export function __recover<T>(state: Replica<T>): Array<T> {
  // Initialize structural traversal and defer result allocation while Footage
  // remains contiguous in Sequence order.
  if (!write_first_structural_strip_to_buffer(state.id)) return []
  const footage = state.footage
  let contiguous_footage_end = 0
  let values: Array<T> | undefined
  let value_count = 0

  // Traverse every retained visible Strip and Mask in Sequence order.
  do {
    // Resolve the current Strip's stable Footage span.
    const [, frame_count, footage_frame_index] = read_strip_from_buffer()
    const footage_end_index = footage_frame_index + frame_count

    // Prove the common append and hydration layout without copying each Frame.
    if (
      values === undefined &&
      footage_frame_index === contiguous_footage_end
    ) {
      contiguous_footage_end = footage_end_index
      continue
    }

    // Materialize the proven prefix only when structural order diverges.
    if (values === undefined) {
      values = new Array<T>(footage.length)
      for (let index = 0; index < contiguous_footage_end; index++) {
        const value = footage[index]
        if (value !== undefined) values[value_count++] = value
      }
    }

    // Append only Frames whose Footage has not been released.
    for (let index = footage_frame_index; index < footage_end_index; index++) {
      const value = footage[index]
      if (value !== undefined) values[value_count++] = value
    }
  } while (write_next_structural_strip_to_buffer(state.id))

  // Copy a complete contiguous layout through optimized array primitives.
  if (
    values === undefined &&
    contiguous_footage_end === footage.length &&
    !footage.includes(undefined)
  )
    return footage.slice() as Array<T>

  // Densify a contiguous prefix containing released or pending Footage.
  if (values === undefined) {
    values = new Array<T>(contiguous_footage_end)
    for (let index = 0; index < contiguous_footage_end; index++) {
      const value = footage[index]
      if (value !== undefined) values[value_count++] = value
    }
  }

  // Return retained values as one dense structural sequence.
  values.length = value_count
  return values
}
