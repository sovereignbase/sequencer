/**
 * Replica creation from an optional trusted snapshot.
 *
 * @module
 */
import {
  initialize_sequence,
  write_projection_to_buffer,
} from '../../wasm/index.js'
import type { Delta, Replica } from '../../types/type.js'
import { register_replica } from '../../helpers/index.js'

/**
 * Reconstructs an independently maintained Replica without replaying history.
 *
 * Transfers the ordered materialized Strips in one
 * buffer copy. Native initialization restores structural links, lookup tables,
 * counters, and Footage positions, including retained soft-masked content.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param data Optional trusted Delta; omitted data creates an empty Replica.
 * @returns A new Replica using the supplied Footage array and a native Projector.
 * @remarks Input must be a valid trusted snapshot. Strip contents and ordering
 * are not validated or resolved again. Footage is used directly without a copy.
 * No SequencePoints are issued.
 */
export function create<T>(data?: unknown): Replica<T> {
  const [projection, footage] = (data ?? []) as Delta<T>

  if (projection !== undefined) void write_projection_to_buffer(projection)

  const state: Replica<T> = [initialize_sequence(), footage ?? []]

  void register_replica(state)

  return state
}
