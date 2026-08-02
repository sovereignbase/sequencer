import { get_acknowledgement_frontier } from '../../../wasm/index.js'
import type { Sequence, SequenceFrontier } from '../../../types/type.js'

/**
 * Returns the sequence's realm-specific acknowledgement frontier.
 *
 * @param state Sequence to acknowledge.
 * @returns Realm frontiers, or `false` when the sequence is empty.
 */
export function __acknowledge<T>(state: Sequence<T>): SequenceFrontier | false {
  return get_acknowledgement_frontier(state.id)
}
