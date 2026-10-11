import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'

/**
 * Deterministic concurrent workload.
 *
 * All replicas begin from the same retained five-Frame Sequence. Operations
 * authored by different replicas are concurrent because Gossip is not exchanged
 * while this workload is being created. Operations authored by the same replica
 * remain causally ordered through that replica's local Projection.
 *
 * The numeric selectors are reduced against the current local Projection to
 * choose the authoring replica and edit position reproducibly.
 */
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
const deliveryKeys = [
  -1217396083, -7, -19, 20, -2147483641, -779887926, 2147483629, -28,
  -2147483620, -26,
]

/**
 * Materializes the visible Projection for exact convergence comparison.
 */
const project = (sequence: Projection<string>): Array<string | undefined> =>
  Array.from({ length: sequence.projectionFrameCount }, (_, index) =>
    sequence.value(index)
  )

/**
 * Reconstructs a replica from the retained base Sequence and applies the given
 * Gossip updates in exactly the supplied delivery order.
 */
const deliver = (
  retained: Sequence<string>,
  gossip: Array<Gossip<string>>
): Projection<string> => {
  const receiver = new Projection<string>(10_000, retained)

  for (const update of gossip) receiver.apply(update)

  return receiver
}

describe('concurrent replacement delivery', () => {
  /**
   * Verifies that a mixed delivery order reconstructs the same Projection as
   * chronological delivery for a deterministic workload containing concurrent
   * inserts, replacements, and removal.
   *
   * Three replicas begin from the same retained five-Frame base. They then
   * author operations independently without exchanging Gossip. Consequently,
   * edits from different replicas may target overlapping historical regions
   * without having observed one another.
   *
   * The resulting Gossip set is reconstructed twice:
   *
   * 1. `chronological` receives updates in the order in which the workload
   *    authored them.
   * 2. `mixed` receives exactly the same updates in a deterministic shuffled
   *    order.
   *
   * Both receivers must expose the same Projection length and identical Frames.
   * A failure means replacement, Mask, anchor, or competition resolution still
   * depends on delivery order rather than solely on the authored operation set.
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
    operations.forEach(
      ([kind, replicaSelector, indexSelector, frameCount], operationIndex) => {
        const replicaIndex = replicaSelector % replicas.length
        const replica = replicas[replicaIndex]
        const length = replica.projectionFrameCount

        if (kind === 'remove') {
          if (length !== 0) {
            const start = indexSelector % length

            gossip.push(
              replica.remove(
                start,
                Math.min(length - 1, start + frameCount - 1)
              )
            )
          }

          return
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

          return
        }

        gossip.push(replica.insert(frames, indexSelector % (length + 1)))
      }
    )

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
    expect(mixed.projectionFrameCount).toBe(chronological.projectionFrameCount)
    expect(project(mixed)).toEqual(project(chronological))
  })
})
