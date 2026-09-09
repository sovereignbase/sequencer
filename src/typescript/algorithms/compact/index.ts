/**
 * Soft and hard compaction of safely removable retained state.
 *
 * @module
 */
import type { Acknowledgement, Replica } from '../../../types/type.js'
import { compact_sequence } from '../../../wasm/index.js'

/**
 * Removes safely collectable structural garbage from one Replica.
 *
 * Soft compaction is the default. It removes only eligible structures that no
 * longer retain consumer content, such as an empty prefix left by a body-before
 * insertion or a Mask whose content was already released by hard deletion.
 * Content retained by soft deletion remains available for recovery.
 *
 * Hard compaction additionally removes eligible garbage that still retains
 * consumer content and releases that content. It does not remove visible values
 * or bypass acknowledgement and dependency requirements. Empty structures are
 * not automatically garbage: an anchor still needed by retained dependencies
 * must remain until its structural removal is safe.
 *
 * A Mask Realm can be collected only when all participating Actors acknowledge
 * the same complete final frontier. Removing an eligible chain reconnects the
 * surviving causal structure. The application supplies acknowledgements from
 * every required Actor in either mode.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 * @param frontiers Acknowledgement Frontiers from participating Replicas.
 * @param state Replica whose eligible retained garbage is collected.
 * @param hard Whether to also discard content-bearing garbage; defaults to
 * soft compaction, which preserves recoverable content.
 * @returns Nothing. Released entries are replaced with `undefined` in-place and
 * the Footage array is never physically compacted.
 */
export function compact<T>(
  frontiers: Array<Acknowledgement>,
  state: Replica<T>,
  hard: boolean = false
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
    void state.footage.fill(
      undefined,
      footage_frame_index,
      footage_frame_index + footage_spans[span_index + 1]
    )
  }
}
