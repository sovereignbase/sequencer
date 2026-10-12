/** Independent mixed edits must reconstruct one Projection through chronological, reverse and keyed Gossip order. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
/**
 * Deterministic two-replica workload containing inserts, removes, and
 * replacements authored independently from the same retained Sequence.
 *
 * Operations created by the same replica remain causally ordered through that
 * replica's local Projection. Operations created by different replicas are
 * concurrent because Gossip is not exchanged while the workload is authored.
 */
/** Fixed disconnected edit intents; selectors resolve against each author's own Projection. */
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
/** Repeatable packet ordering keys; original ordinal breaks equal-key ties without losing entries. */
const deliveryKeys = [
  -587545375, -1451642704, 450361033, -1237044316, 746367878,
]
/**
 * Materializes the complete visible Projection for exact convergence
 * comparison.
 */
/** Materializes indexed reads so bulk-export shortcuts cannot hide lookup disagreement. */
const project = (sequence: Projection<string>): Array<string | undefined> =>
  Array.from({ length: sequence.length() }, (_, index) => sequence.value(index))
/**
 * Reconstructs one live replica from the retained base Sequence and applies
 * every mutation in exactly the supplied delivery order.
 */
/** Replays the same canonical operation set into a fresh receiver in the requested order. */
const deliver = (
  retained: Sequence<string>,
  mutations: Array<Gossip<string>>
): Projection<string> => {
  const receiver = new Projection<string>(10000, retained)
  for (const mutation of mutations) receiver.apply(mutation)
  return receiver
}
describe('unordered replace delivery', () => {
  /**
   * Verifies that one complete concurrent edit history converges identically when
   * delivered chronologically, in reverse, or in a deterministic mixed order.
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
          mutations.push(
            replica.remove(start, Math.min(length - 1, start + frameCount - 1))
          )
        }
        continue
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
        continue
      }
      mutations.push(replica.insert(frames, indexSelector % (length + 1)))
    }
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
      expect(receiver.length()).toBe(chronological.length())
      expect(project(receiver)).toEqual(project(chronological))
    }
  })
})
