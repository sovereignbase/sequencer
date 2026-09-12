/**
 * Explicit Replica destruction and native Projector release.
 *
 * @module
 */
import { clear_sequence } from '../../wasm/index.js'
import type { Replica } from '../../types/type.js'
import { unregister_replica } from '../../helpers/index.js'

/**
 * Immediately releases the native Projector owned by a Replica.
 *
 * The Replica is invalidated in-place and must not be passed to any Sequencer
 * operation after this call. Repeated destruction of the same Replica is a
 * no-op. Explicit destruction also unregisters automatic finalization, so a
 * later garbage-collection pass cannot clear a reused Projector identifier.
 *
 * @param state Replica to invalidate and release.
 */
export function destroy<T>(state: Replica<T>): void {
  const mutable_state = state as unknown[]
  if (mutable_state.length === 0) return
  void unregister_replica(state)
  void clear_sequence(state[0])
  mutable_state.length = 0
}
