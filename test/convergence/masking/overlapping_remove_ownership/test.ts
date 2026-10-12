/** Concurrent masks must consume original Frames once across chronological, reverse and keyed delivery. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
/**
 * Deterministic three-replica workload containing overlapping removes,
 * replacements, and insertions against the same retained six-Frame origin.
 */
/** Fixed disconnected edit intents; selectors resolve against each author's own Projection. */
const operations = [
  ['remove', 2046280841, 395543388, 3],
  ['insert', 1269260299, 509571653, 2],
  ['insert', 682928331, 1883896801, 2],
  ['insert', 308408876, 307794834, 2],
  ['remove', 1313517349, 1028241202, 1],
  ['replace', 425806567, 1316093502, 2],
  ['remove', 1784413307, 1183766439, 2],
  ['insert', 899878280, 481760832, 3],
  ['replace', 1934409216, 150408220, 2],
  ['insert', 27945260, 108302903, 2],
  ['remove', 503092380, 298607732, 4],
  ['remove', 1631815643, 2072606514, 1],
  ['insert', 452223204, 249485537, 1],
  ['insert', 199131081, 1219490238, 1],
] as const
/**
 * Stable keys used only to construct a deterministic mixed delivery order.
 *
 * The authored Gossip remains unchanged; only the order in which receivers
 * observe the operations differs.
 */
/** Repeatable packet ordering keys; original ordinal breaks equal-key ties without losing entries. */
const deliveryKeys = [
  424738099, 173723364, 1960494304, 614813501, 700557849, -1769193726,
  -1179057743, 208131268, 805600223, 1204235890,
]
/**
 * Materializes the complete visible Projection for exact Frame-by-Frame
 * convergence comparison.
 */
/** Materializes indexed reads so bulk-export shortcuts cannot hide lookup disagreement. */
const project = (sequence: Projection<string>): Array<string | undefined> =>
  Array.from({ length: sequence.length() }, (_, index) => sequence.value(index))
/**
 * Reconstructs a fresh replica from the retained base Sequence and applies the
 * supplied Gossip updates in exactly that delivery order.
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
describe('overlapping remove ownership', () => {
  /**
   * Verifies that overlapping concurrent removes assign ownership
   * deterministically and independently of Gossip delivery order.
   */
  it('converges in chronological, reverse, and mixed delivery order', () => {
    // Establish the shared six-Frame origin.
    const base = new Projection<string>(1)
    base.insert(
      Array.from({ length: 6 }, (_, index) => `base-${index}`),
      0
    )
    const retained = base.sequence()
    // Fork three independent authors from the same retained Sequence.
    const replicas = [0, 1, 2].map(
      (index) => new Projection<string>(100 + index, retained)
    )
    /**
     * Fixed Session clocks make increase and decrease competition deterministic
     * across every reconstruction of this regression fixture.
     */
    const sessions = [
      [1310894871851451, 8540722160613772],
      [3273387611390330, 4888754746934803],
      [8750552661131626, 8381653247400557],
    ]
    replicas.forEach((replica, index) => {})
    const gossip: Array<Gossip<string>> = []
    // Author the deterministic concurrent workload against each replica's
    // independent local Projection.
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
      // Give every inserted Frame a unique value so incorrect ownership,
      // duplication, removeing, or placement is visible in the final Projection.
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
    // Baseline reconstruction in workload creation order.
    const chronological = deliver(retained, gossip)
    // Reconstruct the exact same operation set in reverse order.
    const reverse = deliver(retained, [...gossip].reverse())
    // Reconstruct the exact same operation set in a stable mixed order.
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
    // Delivery order must not change visible length or any resolved Frame.
    for (const receiver of [reverse, mixed]) {
      expect(receiver.length()).toBe(chronological.length())
      expect(project(receiver)).toEqual(project(chronological))
    }
  })
})
