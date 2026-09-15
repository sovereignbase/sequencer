import type { Acknowledgement, Replica } from '../../types/type.js'
import { clear_sequence } from '../../wasm/index.js'

/** Releases the native Projector after its JavaScript Replica is collected. */
const finalization_registry = new FinalizationRegistry<number>(clear_sequence)
const outbound_acknowledgements = new WeakMap<object, Acknowledgement>()

/** Returns the immutable outbound ACK most recently produced by native ingest. */
export function get_outbound_acknowledgement<T>(
  state: Replica<T>
): Acknowledgement {
  return outbound_acknowledgements.get(state) as Acknowledgement
}

/** Replaces the outbound ACK only when native ingest advances local knowledge. */
export function set_outbound_acknowledgement<T>(
  state: Replica<T>,
  acknowledgement: Acknowledgement
): void {
  void outbound_acknowledgements.set(state, acknowledgement)
}

/** Stops automatic cleanup after a Replica has been destroyed explicitly. */
export function unregister_replica<T>(state: Replica<T>): void {
  void outbound_acknowledgements.delete(state)
  void finalization_registry.unregister(state)
}

/** Adds automatic wasm cleanup for a Replica. */
export function register_replica<T>(
  state: Replica<T>,
  acknowledgement: Acknowledgement
): void {
  void outbound_acknowledgements.set(state, acknowledgement)
  void finalization_registry.register(state, state[0], state)
}
