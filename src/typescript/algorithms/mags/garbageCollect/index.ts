/**
 * MAGS garbageCollect selection and permanent acknowledged Mask collection.
 *
 * @module
 */
import type { Frontier, Replica } from '../../../types/type.js'
import { garbage_collect_sequence } from '../../../wasm/index.js'

/**
 * Permanently collects Masks covered by the supplied Replica Frontiers.
 *
 * For every Realm in the first Frontier, the smallest corresponding point
 * found in later Frontiers becomes the garbage-collection boundary. Native
 * code removes covered Masks directly from their indexed Realms and returns
 * the Footage spans whose JavaScript references must be released.
 *
 * The first supplied Frontier is reused as the selected boundary and may be
 * overwritten. Other Frontiers are read without mutation. Every Realm eligible
 * for collection must have a corresponding point in each participating Replica
 * Frontier.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param frontiers Acknowledgement Frontiers from participating Replicas.
 * @param state Replica whose acknowledged Masks and Footage are collected.
 */
export function __garbageCollect<T>(
  frontiers: Array<Frontier>,
  state: Replica<T>
): void {
  // Validate that at least one participating Frontier was supplied.
  if (frontiers.length === 0) return

  // Reuse the first Frontier as the mutable Realm-wise boundary.
  const frontier = frontiers[0]

  // Reduce every represented Realm to the least participating counter.
  for (let replica_index = 1; replica_index < frontiers.length; replica_index++)
    for (let realm_index = 0; realm_index < frontier.length; realm_index++) {
      const [unix_lower_bits, counter_bits, random_bits] = frontier[realm_index]
      const replica_point = frontiers[replica_index].find(
        ([replica_unix_lower_bits, , replica_random_bits]) =>
          replica_unix_lower_bits === unix_lower_bits &&
          replica_random_bits === random_bits
      )

      // Lower the selected boundary when this Replica is further behind.
      if (replica_point && replica_point[1] < counter_bits)
        frontier[realm_index] = replica_point
    }

  // Transfer selected boundaries and collect matching native Masks.
  const footage_spans = garbage_collect_sequence(state.id, frontier)
  if (!footage_spans) return

  // Release returned Footage spans without compacting stable indexes.
  for (let span_index = 0; span_index < footage_spans.length; span_index += 2) {
    const footage_frame_index = footage_spans[span_index]
    state.footage.fill(
      undefined,
      footage_frame_index,
      footage_frame_index + footage_spans[span_index + 1]
    )
  }
}
