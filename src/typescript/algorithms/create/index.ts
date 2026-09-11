/**
 * Replica creation from an optional trusted snapshot.
 *
 * @module
 */
import { clear_sequence, initialize_sequence, wasm } from '../../wasm/index.js'
import type { Delta, Replica } from '../../types/type.js'

/** Releases the native Projector after its JavaScript Replica is collected. */
const finalization_registry = new FinalizationRegistry<number>(clear_sequence)

/**
 * Reconstructs an independently maintained Replica without replaying history.
 *
 * Transfers the ordered materialized prefix and detached pending suffix in one
 * buffer copy. Native initialization restores structural links, lookup tables,
 * counters, and Footage positions, including retained soft-masked content.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param data Optional trusted Delta; omitted data creates an empty Replica.
 * @returns A new Replica owning its Footage array and native Projector.
 * @remarks Input must be a valid trusted snapshot. Strip contents and ordering
 * are not validated or resolved again. Array storage is copied, but consumer
 * values are not deep-cloned. No SequencePoints are issued.
 */
export function create<T>(data?: unknown): Replica<T> {
  const [projection, footage] = data as Delta<T>

  if (projection !== undefined) {
    const pointer =
      wasm._prepare_projection_buffer(projection.length / 10) >>> 2
    wasm.HEAPU32.set(projection, pointer)
  }

  const state: Replica<T> = [initialize_sequence(), footage ?? []]
  void finalization_registry.register(state, state[0])
  return state
}
