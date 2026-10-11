import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'

/**
 * Deterministic three-replica workload authored from an empty Sequence.
 *
 * The workload mixes increasing operations (insert and replacement Footage)
 * with reducing operations (remove and replacement Masks). Each replica edits
 * only its own local Projection while the mutations are authored, so operations
 * from different replicas are concurrent.
 */
const operations = [
  ['replace', 714732407, 1247215733, 1],
  ['insert', 1920487907, 35035786, 2],
  ['replace', 2059015479, 6, 1],
  ['remove', 869144873, 1922780283, 2],
  ['insert', 1876648066, 1, 4],
  ['replace', 1978790635, 1506149196, 2],
  ['remove', 20, 3, 4],
  ['insert', 383284506, 1, 4],
  ['insert', 281936605, 40403690, 3],
] as const

/**
 * Stable keys used only to create a hostile deterministic delivery order.
 *
 * The Gossip operations themselves are left unchanged; only their delivery
 * order differs from the chronological baseline.
 */
const deliveryKeys = [
  702303704, -1097475808, -180650997, 1330791140, -1039610715, 2111140307,
  1841741144,
]

/**
 * Every possible relative ordering of the three replica clocks.
 *
 * Increasing and reducing clocks are permuted independently so the workload is
 * exercised under all combinations of concurrent increase and decrease
 * ordering.
 */
const sessionOrders = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
] as const

/**
 * Materializes the complete visible Projection for exact Frame-by-Frame
 * convergence comparison.
 */
const project = (sequence: Projection<string>): Array<string | undefined> =>
  Array.from({ length: sequence.projectionFrameCount }, (_, index) =>
    sequence.value(index)
  )

/**
 * Creates a fresh receiver from the retained Sequence and applies the supplied
 * Gossip mutations in exactly that order.
 */
const deliver = (
  retained: Sequence<string>,
  mutations: Array<Gossip<string>>
): Projection<string> => {
  const receiver = new Projection<string>(10_000, retained)

  for (const mutation of mutations) receiver.apply(mutation)

  return receiver
}

describe('hostile three-peer delivery', () => {
  /**
   * Verifies delivery-order convergence for three concurrent editors across
   * every relative ordering of their increasing and reducing clocks.
   *
   * All three replicas begin from the same empty retained Sequence. For each
   * clock-order combination they independently author the same deterministic
   * workload of inserts, removes, and replacements.
   *
   * The resulting Gossip set is reconstructed twice:
   *
   * - `chronological` receives mutations in workload creation order;
   * - `mixed` receives the exact same mutations in a hostile deterministic
   *   permutation.
   *
   * The six possible increase-clock orders and six possible decrease-clock
   * orders are tested independently, covering all 36 combinations.
   *
   * For every combination, both delivery histories must produce the exact same
   * visible Projection. Concurrent subtree ordering, replacement competition,
   * Mask ownership, and surviving Footage must therefore depend only on the
   * authored operations and their clocks, never on network arrival order.
   */
  it('converges from an empty sequence in chronological and mixed order', () => {
    const retained = new Projection<string>(1).sequence()

    for (const increaseOrder of sessionOrders)
      for (const decreaseOrder of sessionOrders) {
        // Recreate three independent authors for this exact combination of
        // increasing and reducing clock order.
        const replicas = [
          new Projection<string>(0, retained),
          new Projection<string>(1, retained),
          new Projection<string>(2, retained),
        ]

        replicas.forEach((replica, index) => {
          replica.increaseClock[0] = 1_000 + increaseOrder[index]
          replica.decreaseClock[0] = 2_000 + decreaseOrder[index]
        })

        const mutations: Array<Gossip<string>> = []

        // Author the complete deterministic workload against each replica's
        // independent local Projection.
        operations.forEach(
          (
            [kind, replicaSelector, indexSelector, frameCount],
            operationIndex
          ) => {
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

            // Every inserted Frame is uniquely identifiable so missing,
            // duplicated, misplaced, or incorrectly masked Footage is visible
            // in the final Projection comparison.
            const frames = Array.from(
              { length: frameCount },
              (_, frame) => `r${replicaIndex}-o${operationIndex}-f${frame}`
            )

            if (kind === 'replace') {
              if (length !== 0) {
                const start = indexSelector % length
                const count = Math.min(frameCount, length - start)

                mutations.push(
                  replica.replace(
                    frames.slice(0, count),
                    start,
                    start + count - 1
                  )
                )
              }

              return
            }

            mutations.push(replica.insert(frames, indexSelector % (length + 1)))
          }
        )

        // Baseline reconstruction in workload creation order.
        const chronological = deliver(retained, mutations)

        // Reconstruct the same operation set in a hostile mixed order.
        const mixed = deliver(
          retained,
          mutations
            .map((mutation, index) => ({
              mutation,
              key: deliveryKeys[index % deliveryKeys.length],
              index,
            }))
            .sort(
              (left, right) => left.key - right.key || left.index - right.index
            )
            .map(({ mutation }) => mutation)
        )

        // Delivery order must not change either visible length or any Frame.
        expect(mixed.projectionFrameCount).toBe(
          chronological.projectionFrameCount
        )

        expect(
          project(mixed),
          `increase ${increaseOrder.join(',')} decrease ${decreaseOrder.join(',')}`
        ).toEqual(project(chronological))
      }
  })
})
