import { clear_sequence } from '../../wasm/index.js'
import type { Projection } from '../../class.js'

/** Releases the native Projector after its JavaScript Replica is collected. */
const finalization_registry = new FinalizationRegistry<number>(clear_sequence)

/** Stops automatic cleanup after a Replica has been destroyed explicitly. */
export function unregister_instance<T>(instance: Projection<T>): void {
  void finalization_registry.unregister(instance)
}

/** Adds automatic wasm cleanup for a Projection. */
export function register_instance<T>(
  instance: Projection<T>,
  id: number
): void {
  void finalization_registry.register(instance, id, instance)
}
