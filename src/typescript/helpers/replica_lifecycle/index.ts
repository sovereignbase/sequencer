import type { Replica } from '../../types/type.js'
import { clear_sequence } from '../../wasm/index.js'

/** Releases the native Projector after its JavaScript Replica is collected. */
const finalization_registry = new FinalizationRegistry<number>(clear_sequence)

/** Stops automatic cleanup after a Replica has been destroyed explicitly. */
export function unregister_replica<T>(state: Replica<T>): void {
  void finalization_registry.unregister(state)
}

/** Adds automatic wasm cleanup for a Replica. */
export function register_replica<T>(state: Replica<T>) {
  void finalization_registry.register(state, state[0], state)
}
