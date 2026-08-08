/**
 * Replica creation from an optional Reel of already-issued Strips.
 *
 * @module
 */
import { clear_sequence, initialize_sequence } from '../../wasm/index.js'
import type { Replica } from '../../types/type.js'
import { merge } from '../update/index.js'

/** Releases the native Projector after its JavaScript Replica is collected. */
const finalization_registry = new FinalizationRegistry<number>(clear_sequence)

/**
 * Creates an independently maintained sequence state.
 *
 * Entries are staged without integration, then one native Root traversal
 * resolves every reachable dependency. Pending is never represented in
 * transferred data. Invalid input and invalid entries are ignored; an empty
 * Replica is still returned. Creation preserves coordinates and issues no
 * points.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param data Optional candidate Reel used to initialize retained state.
 * @returns A new Replica owning its JavaScript Footage and native Projector.
 */
export function create<T>(data?: unknown): Replica<T> {
  // Initialize consumer-owned Footage and an empty native Projector.
  const state: Replica<T> = {
    id: initialize_sequence(),
    footage: [],
  }
  void finalization_registry.register(state, state.id)

  void merge<T>(state, data)

  // Return the independently maintained Replica.
  return state
}
