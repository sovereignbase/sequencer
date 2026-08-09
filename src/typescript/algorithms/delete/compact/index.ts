/**
 * MAGS compaction selection and acknowledged Footage release.
 *
 * @module
 */
import type { Acknowledgement, Replica } from '../../../types/type.js'
import { compact_sequence } from '../../../wasm/index.js'

/**
 * Releases Footage covered by the supplied Replica Frontiers.
 *
 * For every Realm in the first Acknowledgement, the smallest matching counter
 * supplied by later Frontiers becomes the compaction boundary. Native code
 * retains every Mask, coordinate, and structural link and returns only the
 * Footage Spans whose JavaScript references may be released.
 *
 * The first supplied Acknowledgement is reused as the selected boundary and may
 * be overwritten. Other Frontiers are read without mutation. The caller must
 * ensure that every Realm selected for safe compaction has a matching entry in
 * every required Replica Acknowledgement; this reducer ignores a missing match.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param frontiers Acknowledgement Frontiers from participating Replicas.
 * @param state Replica whose acknowledged Mask Footage is released.
 * @returns Nothing. Released entries are replaced with `undefined` in-place and
 * the Footage array is never physically compacted.
 */
export function compact<T>(
  frontiers: Array<Acknowledgement>,
  state: Replica<T>
): void {
  // Validate that at least one participating Acknowledgement was supplied.
  if (frontiers.length === 0) return

  // Reuse the first Acknowledgement as the mutable Realm-wise boundary.
  const frontier = frontiers[0]

  // Reduce every represented Realm to the least participating counter.
  for (let replica_index = 1; replica_index < frontiers.length; replica_index++)
    for (let realm_index = 0; realm_index < frontier.length; realm_index++) {
      const [crypto_random_bits, unix_lower_bits, counter_bits] =
        frontier[realm_index]
      const replica_point = frontiers[replica_index].find(
        ([realm_crypto_random, realm_unix_lower_bits]) =>
          realm_crypto_random === crypto_random_bits &&
          realm_unix_lower_bits === unix_lower_bits
      )

      // Lower the selected boundary when this Replica is further behind.
      if (replica_point && replica_point[2] < counter_bits)
        frontier[realm_index] = replica_point
    }

  // Transfer selected boundaries and resolve matching Mask Footage.
  const footage_spans = compact_sequence(state.id, frontier)
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
