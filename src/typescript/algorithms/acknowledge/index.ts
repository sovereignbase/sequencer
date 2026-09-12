/**
 * Acknowledgement of complete, gap-free Mask Realms.
 *
 * @module
 */
import { get_acknowledgement_frontier } from '../../wasm/index.js'
import type { Acknowledgement, Replica } from '../../types/type.js'

/**
 * Reports one Replica's realm-indexed acknowledgement Frontier.
 *
 * Each flat triple identifies a Mask Realm and its exclusive final counter.
 * Every known interval must continue from zero without gaps. Insert Realms do
 * not contribute. Ignored Masks are not known state and cannot be acknowledged.
 * Compaction additionally requires agreement from every Actor.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param state Replica whose known Mask Realms are acknowledged.
 * @returns The Replica Frontier, or `false` when no Mask Realm verifies.
 */
export function acknowledge<T>(state: Replica<T>): Acknowledgement | false {
  return get_acknowledgement_frontier(state[0])
}
