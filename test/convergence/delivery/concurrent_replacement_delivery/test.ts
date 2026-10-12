/** Disconnected replacement histories must converge after chronological and stable keyed delivery. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
/**
 * Deterministic concurrent workload.
 */
/** Fixed disconnected edit intents; selectors resolve against each author's own Projection. */
const operations = [
  ['insert', 180133792, 1109629188, 4],
  ['replace', 1199022686, 394473361, 1],
  ['insert', 581967531, 387536348, 1],
  ['replace', 1483458282, 12320982, 1],
  ['replace', 1099093393, 443596640, 1],
  ['replace', 1025719290, 120165420, 4],
  ['remove', 1165076140, 389590309, 1],
  ['replace', 381757984, 1887995565, 1],
] as const
/**
 * Stable keys used only to construct an intentionally mixed delivery order.
 *
 * They do not affect the authored operations themselves. Sorting Gossip by
 * these keys produces a deterministic permutation of the same operation set.
 */
/** Repeatable packet ordering keys; original ordinal breaks equal-key ties without losing entries. */
const deliveryKeys = [
  -1217396083, -7, -19, 20, -2147483641, -779887926, 2147483629, -28,
  -2147483620, -26,
]
/**
 * Materializes the visible Projection for exact convergence comparison.
 */
/** Materializes indexed reads so bulk-export shortcuts cannot hide lookup disagreement. */
const project = (sequence: Projection<string>): Array<string | undefined> =>
  Array.from({ length: sequence.length() }, (_, index) => sequence.value(index))
/**
 * Reconstructs a replica from the retained base Sequence and applies the given
 * Gossip updates in exactly the supplied delivery order.
 */
/** Replays the same canonical operation set into a fresh receiver in the requested order. */
const deliver = (
  retained: Sequence<string>,
  gossip: Array<Gossip<string>>
): Projection<string> => {
  const receiver = new Projection<string>(10000, retained)
  for (const update of gossip) receiver.apply(update)
  return receiver
}
describe('concurrent replacement delivery', () => {
  /**
   * Verifies that a mixed delivery order reconstructs the same Projection as
   * chronological delivery for a deterministic workload containing concurrent
   * inserts, replacements, and removal.
   */
  it('converges in chronological and deterministic mixed order', () => {
    /**
     * Establish the common retained origin.
     */
    const base = new Projection<string>(1)
    base.insert(
      Array.from({ length: 5 }, (_, index) => `base-${index}`),
      0
    )
    const retained = base.sequence()
    /**
     * Fork three independent authors from the same retained Sequence.
     *
     * No Gossip is exchanged between them while mutations are authored.
     */
    const replicas = [0, 1, 2].map(
      (index) => new Projection<string>(100 + index, retained)
    )
    const gossip: Array<Gossip<string>> = []
    /**
     * Author the deterministic workload.
     *
     * Replica and position selectors are reduced against the available replica
     * count and that replica's current local Projection. Replacement and removal
     * ranges are clipped to remain within the locally visible Frames.
     */
    for (const [
      operationIndex,
      [kind, replicaSelector, indexSelector, frameCount],
    ] of operations.entries()) {
      const replicaIndex = replicaSelector % replicas.length
      const replica = replicas[replicaIndex]
      const length = replica.length()
      if (kind === 'remove') {
        if (length !== 0) {
          const start = indexSelector % length
          gossip.push(
            replica.remove(start, Math.min(length - 1, start + frameCount - 1))
          )
        }
        continue
      }
      /**
       * Give every authored Frame a unique value so incorrect placement,
       * masking, duplication, or survival is observable in the final
       * Projection comparison.
       */
      const frames = Array.from(
        { length: frameCount },
        (_, frame) => `r${replicaIndex}-o${operationIndex}-f${frame}`
      )
      if (kind === 'replace') {
        if (length !== 0) {
          const start = indexSelector % length
          const count = Math.min(frameCount, length - start)
          gossip.push(
            replica.replace(frames.slice(0, count), start, start + count - 1)
          )
        }
        continue
      }
      gossip.push(replica.insert(frames, indexSelector % (length + 1)))
    }
    /**
     * Baseline reconstruction using workload authoring order.
     */
    const chronological = deliver(retained, gossip)
    /**
     * Reconstruct exactly the same authored operations in a stable mixed order.
     *
     * The permutation changes only delivery order; every Gossip update remains
     * byte-for-byte the same authored operation.
     */
    const mixed = deliver(
      retained,
      gossip
        .map((update, index) => ({
          update,
          key: deliveryKeys[index % deliveryKeys.length],
          index,
        }))
        .sort((left, right) => left.key - right.key || left.index - right.index)
        .map(({ update }) => update)
    )
    // Delivery order must not change either visible length or Frame placement.
    expect(mixed.length()).toBe(chronological.length())
    expect(project(mixed)).toEqual(project(chronological))
  })
})
