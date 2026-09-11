/**
 * Soft and hard compaction of safely removable retained state.
 *
 * @module
 */
import type { Acknowledgement, Replica } from '../../types/type.js'
import { wasm } from '../../wasm/index.js'

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
 * @remarks Frontier selection uses exact Realm and counter agreement, not a
 * minimum counter. Input acknowledgement arrays are never modified.
 */
export function compact<T>(
  frontiers: Array<Acknowledgement>,
  state: Replica<T>,
  hard: boolean = false
): void {
  //TODO: Let wasm do the work instead of wasting time here give frontiers to wasm and take out instructions on what to undefine in state footage.

  // Validate that at least one participating Acknowledgement was supplied.
  if (frontiers.length === 0) return

  const frontier = frontiers[0].slice()
  for (
    let replica_index = 1;
    replica_index < frontiers.length && frontier.length !== 0;
    ++replica_index
  ) {
    const acknowledged = new Map<number, Map<number, number>>()
    const replica_frontier = frontiers[replica_index]
    for (let point = 0; point < replica_frontier.length; point += 3) {
      const crypto_random_bits = replica_frontier[point]
      let realms = acknowledged.get(crypto_random_bits)
      if (realms === undefined) {
        realms = new Map<number, number>()
        acknowledged.set(crypto_random_bits, realms)
      }
      realms.set(replica_frontier[point + 1], replica_frontier[point + 2])
    }

    let retained = 0
    for (let point = 0; point < frontier.length; point += 3) {
      const crypto_random_bits = frontier[point]
      const unix_lower_bits = frontier[point + 1]
      const counter_bits = frontier[point + 2]
      if (
        acknowledged.get(crypto_random_bits)?.get(unix_lower_bits) !==
        counter_bits
      )
        continue
      frontier[retained++] = crypto_random_bits
      frontier[retained++] = unix_lower_bits
      frontier[retained++] = counter_bits
    }
    frontier.length = retained
  }

  // Transfer selected boundaries and resolve matching Mask Footage.
  if (frontier.length === 0) return
  const buffer_start =
    wasm._prepare_compaction_sequence_point_buffer(frontier.length / 3) >>> 2
  wasm.HEAPU32.set(frontier, buffer_start)
  const span_count = wasm._compact_projection(state[0], hard ? 1 : 0) >>> 0
  const span_start =
    span_count === 0 ? 0 : wasm._get_footage_span_buffer_pointer() >>> 2
  const footage_spans = wasm.HEAPU32.subarray(
    span_start,
    span_start + span_count * 4
  )

  // Release returned Footage spans without compacting stable indexes.
  for (let span_index = 0; span_index < footage_spans.length; span_index += 4) {
    const footage_frame_index = footage_spans[span_index + 1]
    if (hard)
      void state[1].fill(
        undefined,
        footage_frame_index,
        footage_frame_index + footage_spans[span_index + 2]
      )
  }
  wasm._clear_footage_span_buffer()
}
