import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'

/**
 * Deterministic two-replica workload containing inserts, removes, and
 * replacements authored independently from the same retained Sequence.
 *
 * Operations created by the same replica remain causally ordered through that
 * replica's local Projection. Operations created by different replicas are
 * concurrent because Gossip is not exchanged while the workload is authored.
 */
const operations = [
  ['replace', 1837749800, 20512115, 1],
  ['replace', 1617521697, 1569299415, 1],
  ['insert', 1268534401, 1502952196, 4],
  ['insert', 743700871, 256912417, 1],
  ['insert', 1606676183, 1277281821, 1],
  ['replace', 171658493, 147095872, 3],
  ['remove', 664514791, 350362757, 1],
  ['replace', 522327745, 848656602, 3],
  ['remove', 692013875, 731636726, 2],
  ['remove', 1350957019, 300076836, 1],
  ['insert', 2083558510, 429549960, 4],
  ['replace', 163720766, 565574588, 4],
  ['insert', 735715695, 1304623410, 3],
  ['replace', 9806760, 2084350484, 1],
  ['replace', 556989605, 671512747, 3],
  ['replace', 1955270739, 1148533248, 1],
] as const

/**
 * Stable keys used only to produce a deterministic mixed delivery order.
 *
 * They do not alter any authored operation; they only permute the order in
 * which the same Gossip set is applied to a receiver.
 */
const deliveryKeys = [
  -587545375, -1451642704, 450361033, -1237044316, 746367878,
]

/**
 * Materializes the complete visible Projection for exact convergence
 * comparison.
 */
const project = (sequence: Projection<string>): Array<string | undefined> =>
  Array.from({ length: sequence.projectionFrameCount }, (_, index) =>
    sequence.value(index)
  )

/**
 * Reconstructs one live replica from the retained base Sequence and applies
 * every mutation in exactly the supplied delivery order.
 */
const deliver = (
  retained: Sequence<string>,
  mutations: Array<Gossip<string>>
): Projection<string> => {
  const receiver = new Projection<string>(10_000, retained)

  for (const mutation of mutations) receiver.apply(mutation)

  return receiver
}

describe('unordered replace delivery', () => {
  /**
   * Verifies that one complete concurrent edit history converges identically
   * when delivered chronologically, in reverse, or in a deterministic mixed
   * order.
   *
   * Two replicas begin from the same retained four-Frame base and independently
   * author inserts, removals, and replacements. Several replacements and Masks
   * may therefore overlap the same historical regions without observing the
   * other replica's concurrent edits.
   *
   * The complete authored Gossip set is then reconstructed three times:
   *
   * - `chronological` receives mutations in workload creation order;
   * - `reverse` receives the exact same mutations in reverse order;
   * - `mixed` receives the exact same mutations in a deterministic permutation.
   *
   * All three receivers must expose exactly the same visible Projection.
   * Delivery order must not change which original Frames remain masked, which
   * inserted Frames survive, or how concurrent subtrees are ordered.
   */
  it('converges in chronological, reverse, and mixed delivery order', () => {
    // Establish the shared retained origin.
    const base = new Projection<string>(1)

    base.insert(['base-0', 'base-1', 'base-2', 'base-3'], 0)

    const retained = base.sequence()

    // Fork two independent authors from the same retained Sequence.
    const replicas = [
      new Projection<string>(1, retained),
      new Projection<string>(2, retained),
    ]

    const mutations: Array<Gossip<string>> = []

    // Author the deterministic concurrent workload.
    operations.forEach(
      ([kind, replicaSelector, indexSelector, frameCount], operationIndex) => {
        const replicaIndex = replicaSelector % replicas.length
        const replica = replicas[replicaIndex]
        const length = replica.projectionFrameCount

        if (kind === 'remove') {
          if (length !== 0) {
            const start = indexSelector % length

            mutations.push(
              replica.remove(
                start,
                Math.min(length - 1, start + frameCount - 1)
              )
            )
          }

          return
        }

        // Give every authored Frame a unique value so misplaced, duplicated,
        // removed, or resurrected content is visible in the final comparison.
        const frames = Array.from(
          { length: frameCount },
          (_, frame) => `r${replicaIndex}-o${operationIndex}-f${frame}`
        )

        if (kind === 'replace') {
          if (length !== 0) {
            const start = indexSelector % length
            const count = Math.min(frameCount, length - start)

            mutations.push(
              replica.replace(frames.slice(0, count), start, start + count - 1)
            )
          }

          return
        }

        mutations.push(replica.insert(frames, indexSelector % (length + 1)))
      }
    )

    // Baseline reconstruction in workload creation order.
    const chronological = deliver(retained, mutations)

    // Reconstruct the same operation set in exact reverse order.
    const reverse = deliver(retained, [...mutations].reverse())

    // Reconstruct the same operation set in a stable mixed order.
    const mixed = deliver(
      retained,
      mutations
        .map((mutation, index) => ({
          mutation,
          key: deliveryKeys[index % deliveryKeys.length],
          index,
        }))
        .sort((left, right) => left.key - right.key || left.index - right.index)
        .map(({ mutation }) => mutation)
    )

    // Every delivery order must materialize the exact same visible Projection.
    for (const receiver of [reverse, mixed]) {
      expect(receiver.projectionFrameCount).toBe(
        chronological.projectionFrameCount
      )

      expect(project(receiver)).toEqual(project(chronological))
    }
  })
})
