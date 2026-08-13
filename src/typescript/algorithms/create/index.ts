/**
 * Replica creation from an optional Delta of already-issued Strips.
 *
 * @module
 */
import {
  clear_sequence,
  initialize_sequence,
  resolve_initial_projection,
  stage_strip,
  write_strip_to_buffer,
} from '../../wasm/index.js'
import { is_strip } from '../../helpers/index.js'
import type { Replica, VirtualStrip } from '../../types/type.js'

/** Releases the native Projector after its JavaScript Replica is collected. */
const finalization_registry = new FinalizationRegistry<number>(clear_sequence)

/**
 * Creates an independently maintained sequence state.
 *
 * Every supplied Strip is validated and staged. One subsequent
 * `resolve_initial_projection` call selects Initial Root Candidates and
 * materializes every reachable dependency independently of input order.
 * Unresolved valid Strips remain Pending and are retained by Snapshot. Invalid
 * input and invalid entries are ignored; an empty Replica is still returned.
 * Creation preserves coordinates and issues no Sequence Points.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param data Optional candidate Delta used to initialize retained state.
 * @returns A new Replica owning its JavaScript Footage and native Projector.
 */
export function create<T>(data?: unknown): Replica<T> {
  // Initialize consumer-owned Footage and an empty native Projector.
  const state: Replica<T> = {
    id: initialize_sequence(),
    footage: [],
  }
  void finalization_registry.register(state, state.id)

  if (Array.isArray(data))
    for (const chunk of data) {
      if (!is_strip<T>(chunk)) continue

      const meta: VirtualStrip<T> = [...chunk[0]]
      const visible = meta[0] === 0
      if (visible) void meta.push(state.footage.length)
      void write_strip_to_buffer(meta)
      if (stage_strip(state.id) && visible) void state.footage.push(...chunk[1]!)
    }

  if (state.footage.length !== 0) void resolve_initial_projection(state.id)

  // Return the independently maintained Replica.
  return state
}
