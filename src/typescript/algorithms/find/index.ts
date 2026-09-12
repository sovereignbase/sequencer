/**
 * Single-Frame visible Projection reads.
 *
 * @module
 */
import type { Replica } from '../../types/type.js'

import {
  get_footage_frame_index,
} from '../../wasm/index.js'

/**
 * Reads one visible value by zero-based index.
 *
 * @typeParam T Consumer-owned sequence value.
 * @param state Replica whose Projection is read.
 * @param index Zero-based visible index.
 * @returns The value at a valid `index`, or `undefined` for released Footage.
 * @remarks Native code resolves only the Footage Index. The value itself stays
 * in the Replica-owned JavaScript array.
 */
export function find<T>(state: Replica<T>, index: number): T | undefined {
  // Resolve the native Footage index and return its consumer-owned value.
  return state[1][get_footage_frame_index(state[0], index)] ?? undefined
}
