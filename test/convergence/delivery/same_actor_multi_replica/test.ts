import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/class.ts'
import type { Gossip, Sequence } from '../../../../src/types/type.ts'

/**
 * Materializes every visible Frame for exact Projection comparison.
 */
const project = <T>(sequence: Projection<T>): Array<T | undefined> =>
  Array.from({ length: sequence.projectionFrameCount }, (_, index) =>
    sequence.value(index)
  )

/**
 * Verifies that every supplied replica exposes the same visible Projection as
 * the expected replica.
 */
const expectConverged = <T>(
  expected: Projection<T>,
  replicas: Array<Projection<T>>
): void => {
  for (const replica of replicas) {
    expect(replica.projectionFrameCount).toBe(expected.projectionFrameCount)
    expect(project(replica)).toEqual(project(expected))
  }
}

/**
 * Delivers one Gossip update between two live replicas and returns any generated
 * acknowledgements to the author.
 *
 * Both replicas use Actor 42 in this regression, so every acknowledgement must
 * still identify that shared Actor even though the two Projection instances
 * maintain independent increase and decrease Clocks.
 */
const gossip = <T>(
  author: Projection<T>,
  receiver: Projection<T>,
  update: Gossip<T>
): void => {
  const acknowledgements = receiver.apply(update)?.[1]

  if (acknowledgements) {
    for (const acknowledgement of acknowledgements)
      expect(acknowledgement[0]).toBe(42)

    author.apply(acknowledgements)
  }
}

describe('same actor in multiple replicas', () => {
  /**
   * Verifies that two simultaneously active Projection instances may share the
   * same Actor identity without sharing their local Session Clocks.
   *
   * Both replicas are created as Actor 42 from the same retained Sequence, as
   * can happen when the same user opens the same document in multiple tabs.
   * Their increase and decrease Clocks must nevertheless begin with distinct
   * per-instance Session identities.
   *
   * The two replicas then independently author Inserts, Replaces, and Removes
   * before exchanging Gossip. They must converge even though every operation is
   * attributed to the same Actor.
   *
   * Further concurrent head and tail edits are exchanged in the opposite
   * direction, after which the complete mutation set is replayed into a fresh
   * Actor-42 Projection in a different delivery order.
   *
   * All three replicas must expose the same final Projection. Actor identity
   * therefore identifies the logical editor, while per-instance Clocks keep
   * concurrent tabs' increase and decrease Sessions distinct.
   */
  it('keeps per-instance Clocks independent across concurrent tabs', () => {
    // Establish the common retained document.
    const seed = new Projection<string>(1)
    seed.insert(['a', 'b', 'c', 'd'], 0)

    const sequence: Sequence<string> = seed.sequence()

    // Simulate two concurrently active tabs belonging to the same Actor.
    const left = new Projection<string>(42, sequence)
    const right = new Projection<string>(42, sequence)

    // Sharing an Actor must not make independent instances reuse the same
    // increase or decrease Session Clock.
    expect(left.increaseClock[0]).not.toBe(right.increaseClock[0])
    expect(left.decreaseClock[0]).not.toBe(right.decreaseClock[0])

    // Both tabs independently mutate the same retained origin.
    const leftInsert = left.insert(['left-0', 'left-1'], 1)
    const leftReplace = left.replace(['left-r0', 'left-r1'], 2, 3)

    const rightInsert = right.insert(['right-0', 'right-1'], 3)
    const rightRemove = right.remove(1, 2)

    // Exchange the independently authored mutations and acknowledgements.
    gossip(left, right, leftInsert)
    gossip(left, right, leftReplace)
    gossip(right, left, rightRemove)
    gossip(right, left, rightInsert)

    expectConverged(left, [right])

    // Continue editing from the converged live state on both tabs.
    const leftTail = left.insert(['left-tail'], left.projectionFrameCount)
    const rightHead = right.replace(['right-head'], 0, 0)

    gossip(right, left, rightHead)
    gossip(left, right, leftTail)

    /**
     * Reconstruct the complete operation set from the original retained
     * Sequence using a different delivery order.
     *
     * The replay uses the same Actor identity again but receives only the
     * already-authored Gossip, so its locally generated Clocks are irrelevant to
     * the deterministic result.
     */
    const replay = new Projection<string>(42, sequence)

    for (const update of [
      rightHead,
      leftTail,
      rightRemove,
      rightInsert,
      leftReplace,
      leftInsert,
    ])
      replay.apply(update)

    // Live exchange and reordered replay must resolve to the same Projection.
    expectConverged(left, [right, replay])
  })
})
