/**
 * Single-Frame visible Projection reads.
 *
 * @module
 */
import type { Replica } from '../../../types/type.js'

import {
  get_footage_frame_index,
  get_projection_frame_count,
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
 * @remarks Native code resolves only the Footage Index. The value itself stays
 * in the Replica-owned JavaScript array.
 */
export function find<T>(state: Replica<T>, index: number): T | undefined {
  // Validate the requested visible Projection index.
  if (!is_safe_index(index, get_projection_frame_count(state.id)))
    return undefined

  // Resolve the native Footage index and return its consumer-owned value.
  return state.footage[get_footage_frame_index(state.id, index)]
}
