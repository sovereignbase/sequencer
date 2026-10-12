/** Immediate two-peer delivery must reproduce each already applied local edit before the next edit is authored. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip } from '../../../../src/typescript/types/type.ts'
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
const project = (sequence: Projection<number>) => sequence.values()
describe('local/remote replacement equivalence', () => {
  /**
   * Verifies immediate convergence between two replicas that share exactly the
   * same Gossip operations.
   */
  it('converges after every immediately delivered Gossip update', () => {
    const state = new Projection<number>(1)
    const peer = new Projection<number>(2)
    // Fresh native Session clocks distinguish the two authors' canonical identities.
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
     * Delivers one already locally applied Gossip update to the other replica and
     * immediately verifies that their visible Projections are identical.
     */
    const gossip = (
      author: Projection<number>,
      receiver: Projection<number>,
      update: Gossip<number>
    ) => {
      const acknowledgements = receiver.apply(update)?.[1]
      if (acknowledgements) author.apply(acknowledgements)
      // Different visible lengths are already sufficient to prove divergence.
      expect(receiver.length()).toBe(author.length())
      const authorProjection = project(author)
      const receiverProjection = project(receiver)
      // Report the first differing Projection Frame explicitly instead of only
      // returning a generic whole-array equality failure.
      const difference = receiverProjection.findIndex(
        (frame, index) => frame !== authorProjection[index]
      )
      if (difference !== -1)
        throw new Error(
          `first difference at ${difference}: ${receiverProjection[difference]} !== ${authorProjection[difference]}; update=${JSON.stringify(update)}`
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
