import { get_projection_frame_count } from '../../../wasm/index.js'
import type { Replica } from '../../../types/type.js'

/**
 * Returns the number of visible values in a Replica's current Projection.
 *
 * @typeParam T Consumer-owned sequence value.
 * @param state Replica to measure.
 * @returns Current Projection Frame count.
 */
export function length<T>(state: Replica<T>): number {
  // Read the native visible Frame count without traversing Strips.
  return get_projection_frame_count(state.id)
}
