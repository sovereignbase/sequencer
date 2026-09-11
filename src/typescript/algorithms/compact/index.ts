/**
 * Soft and hard compaction of safely removable retained state.
 *
 * @module
 */
import type { Acknowledgement, Replica } from '../../types/type.js'
import { clear_footage_spans, compact_frontiers } from '../../wasm/index.js'

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
  const spans = compact_frontiers(state[0], frontiers, hard)
  if (!spans) return
  for (let span = 0; span < spans.length; span += 4)
    void state[1].fill(
      undefined,
      spans[span + 1],
      spans[span + 1] + spans[span + 2]
    )
  void clear_footage_spans()
}
