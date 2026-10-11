import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip } from '../../../../src/types/type.ts'
import {
  deriveSeed,
  Random,
  seedFromString,
  StripIndex,
} from '../../../../benchmark/.shared/support.ts'

/**
 * Materializes the visible Projection into a plain array.
 *
 * This intentionally compares the externally observable Projection rather than
 * internal structural state. Two replicas may organize their internal Strips
 * differently while still being convergent as long as every visible Projection
 * Frame resolves to the same value.
 */
const project = (sequence: Projection<number>): Array<number | undefined> =>
  Array.from({ length: sequence.projectionFrameCount }, (_, index) =>
    sequence.value(index)
  )

const structure = (projection: Projection<number>) => {
  const result = []
  for (let strip = projection.head; strip; strip = strip.rightStep)
    result.push([
      strip.anchorSession,
      strip.anchorStart,
      strip.anchorDiff,
      strip.insertionSession,
      strip.insertionStart,
      strip.insertionDiff,
      strip.fragmentStart,
      strip.fragmentDiff,
    ])
  return result
}

describe('local/remote replacement equivalence', () => {
  /**
   * Verifies immediate convergence between two replicas that share exactly the
   * same Gossip operations.
   *
   * Every mutation is first applied locally by its author and the resulting
   * Gossip update is then delivered immediately to the other replica before the
   * next mutation is created. After delivery, both replicas therefore contain
   * the same set of shared insertions and reductions, even though those
   * operations may have originated from different replica sessions.
   *
   * The test asserts convergence after every individual Gossip delivery, not
   * merely at the end of the workload. This catches cases where applying a
   * remote representation of an operation produces a different Projection than
   * the equivalent locally applied operation.
   *
   * The workload repeatedly exercises:
   *
   * - insertion at alternating head/tail structural positions;
   * - replacement of an existing Strip with an equal-length Strip;
   * - removal of an existing Strip;
   * - insertion at a random structural position;
   * - replacement authored by the opposite replica;
   * - reads between mutations, allowing traversal state and cached jumps to be
   *   exercised before later structural mutations.
   *
   * This is specifically an immediate-delivery convergence test. It does not
   * test concurrent operations created independently before replicas exchange
   * updates, nor convergence under different Gossip delivery orders.
   */
  it('converges after every immediately delivered Gossip update', () => {
    const state = new Projection<number>(1)
    const peer = new Projection<number>(2)

    // Keep the two replicas in distinct clock ranges so operations authored by
    // either side have clearly separate identities throughout the workload.
    state.increaseClock[0] = 1_001
    state.decreaseClock[0] = 2_001
    peer.increaseClock[0] = 1_002
    peer.decreaseClock[0] = 2_002

    /**
     * Tracks only the logical Strip boundaries needed to author valid local
     * edits. This is a workload-positioning aid, not a Projection oracle, and
     * is therefore never compared with either replica. The test's expectation
     * is that remote `apply` reproduces the already validated local result.
     */
    const strips = new StripIndex()

    // The workload is deterministic so any convergence failure is reproducible.
    const random = new Random(
      deriveSeed(
        deriveSeed(seedFromString('sequencer-lifecycle-v1'), 'run:0'),
        'shared-replica-workload'
      )
    )

    let nextStripId = 1

    /**
     * Delivers one already locally applied Gossip update to the other replica
     * and immediately verifies that their visible Projections are identical.
     *
     * `author` has already applied `update` by creating the local operation.
     * `receiver.apply(update)` gives the receiver exactly that same operation;
     * it does not recreate the mutation under the receiver's identity.
     *
     * Any acknowledgement produced by the receiver is sent directly back to
     * the author before convergence is checked.
     */
    const gossip = (
      author: Projection<number>,
      receiver: Projection<number>,
      update: Gossip<number>
    ) => {
      const acknowledgements = receiver.apply(update)?.[1]
      if (acknowledgements) author.apply(acknowledgements)

      // Different visible lengths are already sufficient to prove divergence.
      expect(receiver.projectionFrameCount).toBe(author.projectionFrameCount)

      const cursor = (projection: Projection<number>) => {
        let actual = 0
        let found = false
        for (let strip = projection.head; strip; strip = strip.rightStep) {
          if (strip === projection.gate) {
            found = true
            break
          }
          actual += strip.fragmentDiff ?? strip.insertionDiff
        }
        return [projection.gatePosition, actual, found]
      }
      const authorCursor = cursor(author)
      const receiverCursor = cursor(receiver)

      const jumps = (projection: Projection<number>) => {
        const strips: Array<NonNullable<Projection<number>['head']>> = []
        for (let strip = projection.head; strip; strip = strip.rightStep)
          strips.push(strip)
        return strips.map((strip) => {
          const left = strips.indexOf(strip.leftJump!)
          const right = strips.indexOf(strip.rightJump!)
          return [
            left === -1
              ? undefined
              : [left, strip.leftJumpFrameCount, strip.leftJumpStripCount],
            right === -1
              ? undefined
              : [right, strip.rightJumpFrameCount, strip.rightJumpStripCount],
          ]
        })
      }
      const authorJumps = jumps(author)
      const receiverJumps = jumps(receiver)
      const jumpDifference = authorJumps.findIndex(
        (jump, index) =>
          JSON.stringify(jump) !== JSON.stringify(receiverJumps[index])
      )

      const authorProjection = project(author)
      const receiverProjection = project(receiver)

      // Report the first differing Projection Frame explicitly instead of only
      // returning a generic whole-array equality failure.
      const difference = receiverProjection.findIndex(
        (frame, index) => frame !== authorProjection[index]
      )

      if (difference !== -1)
        throw new Error(
          `first difference at ${difference}: ${receiverProjection[difference]} !== ${authorProjection[difference]}; cursors=${JSON.stringify([authorCursor, receiverCursor])}; jumpDifference=${jumpDifference}:${JSON.stringify([authorJumps[jumpDifference], receiverJumps[jumpDifference]])}; update=${JSON.stringify(update)}; author=${JSON.stringify(structure(author))}; receiver=${JSON.stringify(structure(receiver))}`
        )
    }

    /**
     * Creates a uniquely identifiable visible Strip.
     *
     * Every frame receives the Strip id as its value, making misplaced,
     * duplicated, missing, or incorrectly replaced ranges visible directly in
     * Projection comparisons.
     */
    const createStrip = (length?: number) => {
      const id = nextStripId++
      const frameCount = length ?? random.inclusive(1, 100)

      return {
        id,
        length: frameCount,
        values: new Array(frameCount).fill(id),
      }
    }

    for (let step = 0; step < 100; ++step) {
      /**
       * Alternate deterministic insertions between the tail and head.
       *
       * This repeatedly exercises both structural extremes rather than allowing
       * the workload to grow exclusively in one direction.
       */
      const insertionIndex = strips.count % 2 === 0 ? strips.count : 0
      const insertionFrame = strips.frameOffsetAt(insertionIndex)
      const inserted = createStrip()

      gossip(state, peer, state.insert(inserted.values, insertionFrame))
      strips.insert(insertionIndex, inserted)

      /**
       * Perform a read before the following mutation.
       *
       * Besides validating normal access during the workload, this may populate
       * or update traversal optimization state whose correctness must survive
       * subsequent replacements, removals, and insertions.
       */
      void state.value(random.integer(strips.frameCount))

      /**
       * Replace one complete existing Strip from `state`.
       *
       * The replacement preserves the Strip's visible length so the test can
       * isolate replacement semantics from a simultaneous frame-count change.
       */
      const replacementIndex = random.integer(strips.count)
      const replacementFrame = strips.frameOffsetAt(replacementIndex)
      const replaced = strips.at(replacementIndex)
      const replacement = createStrip(replaced.length)

      gossip(
        state,
        peer,
        state.replace(
          replacement.values,
          replacementFrame,
          replacementFrame + replaced.length - 1
        )
      )

      strips.replace(replacementIndex, replacement)

      /**
       * Remove one complete existing Strip from `state`.
       */
      const removalIndex = random.integer(strips.count)
      const removalFrame = strips.frameOffsetAt(removalIndex)
      const removed = strips.at(removalIndex)

      gossip(
        state,
        peer,
        state.remove(removalFrame, removalFrame + removed.length - 1)
      )

      strips.remove(removalIndex)

      /**
       * Insert a new Strip at an arbitrary visible structural boundary.
       */
      const randomInsertionIndex = random.integer(strips.count + 1)
      const randomInsertionFrame = strips.frameOffsetAt(randomInsertionIndex)
      const randomInsertion = createStrip()

      gossip(
        state,
        peer,
        state.insert(randomInsertion.values, randomInsertionFrame)
      )

      strips.insert(randomInsertionIndex, randomInsertion)

      /**
       * Author a replacement from the opposite replica.
       *
       * This verifies symmetry: convergence must hold regardless of which
       * replica creates the operation and which replica receives it remotely.
       */
      const ingestIndex = random.integer(strips.count)
      const ingestFrame = strips.frameOffsetAt(ingestIndex)
      const ingested = createStrip(strips.at(ingestIndex).length)

      gossip(
        peer,
        state,
        peer.replace(
          ingested.values,
          ingestFrame,
          ingestFrame + ingested.length - 1
        )
      )

      strips.replace(ingestIndex, ingested)

      /**
       * Explicit checkpoint assertions complement the per-Gossip comparison and
       * make failures at representative workload sizes visible in Vitest's
       * normal assertion output.
       */
      if (step === 0 || step === 9 || step === 99)
        expect(project(peer)).toEqual(project(state))
    }
  })
})
