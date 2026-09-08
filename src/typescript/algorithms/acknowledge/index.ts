/**
 * MAGS acknowledgement of materialized Realm progress.
 *
 * @module
 */
import { get_acknowledgement_frontier } from '../../../wasm/index.js'
import type { Acknowledgement, Replica } from '../../../types/type.js'

/**
 * Reports one Replica's realm-indexed acknowledgement Frontier.
 *
 * Each entry is the greatest materialized Strip start currently indexed in one
 * represented Realm. Visibility does not affect acknowledgement: visible
 * Strips and Masks advance the same Frontier.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica whose materialized Sequence is acknowledged.
 * @returns The Replica Frontier, or `false` when no Strip is materialized.
 */
export function acknowledge<T>(state: Replica<T>): Acknowledgement | false {
  // Copy the native Realm Frontier into TypeScript-owned tuples.
  return get_acknowledgement_frontier(state.id)
}
