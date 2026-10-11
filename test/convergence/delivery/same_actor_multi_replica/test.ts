import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
/**
 * Materializes every visible Frame for exact Projection comparison.
 */
const project = async <T>(
  sequence: Projection<T>
): Promise<Array<T | undefined>> =>
  await Promise.all(
    await Promise.all(
      Array.from(
        { length: await sequence.length() },
        async (_, index) => await sequence.value(index)
      )
      /**
       * Verifies that every supplied replica exposes the same visible Projection as
       * the expected replica.
       */
    )
  )
/**
 * Verifies that every supplied replica exposes the same visible Projection as
 * the expected replica.
 */
const expectConverged = async <T>(
  expected: Projection<T>,
  replicas: Array<Projection<T>>
): Promise<void> => {
  for (const replica of replicas) {
    expect(await replica.length()).toBe(await expected.length())
    expect(await project(replica)).toEqual(await project(expected))
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
const gossip = async <T>(
  author: Projection<T>,
  receiver: Projection<T>,
  update: Gossip<T>
): Promise<void> => {
  const acknowledgements = (await receiver.apply(update))?.[1]
  if (acknowledgements) {
    for (const acknowledgement of acknowledgements)
      expect(acknowledgement[0]).toBe(42)
    await author.apply(acknowledgements)
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
  it('keeps per-instance Clocks independent across concurrent tabs', async () => {
    // Establish the common retained document.
    const seed = new Projection<string>(1)
    await seed.insert(['a', 'b', 'c', 'd'], 0)
    const sequence: Sequence<string> = await seed.sequence()
    // Simulate two concurrently active tabs belonging to the same Actor.
    const left = new Projection<string>(42, sequence)
    const right = new Projection<string>(42, sequence)
    // Sharing an Actor must not make independent instances reuse the same
    // increase or decrease Session Clock.

    // Both tabs independently mutate the same retained origin.
    const leftInsert = await left.insert(['left-0', 'left-1'], 1)
    const leftReplace = await left.replace(['left-r0', 'left-r1'], 2, 3)
    const rightInsert = await right.insert(['right-0', 'right-1'], 3)
    const rightRemove = await right.remove(1, 2)
    expect(
      (
        leftInsert[0] as import('../../../../src/typescript/types/type.ts').Insertion<string>
      )[0][3]
    ).not.toBe(
      (
        rightInsert[0] as import('../../../../src/typescript/types/type.ts').Insertion<string>
      )[0][3]
    )
    expect(
      (
        leftReplace[0] as import('../../../../src/typescript/types/type.ts').Insertion<string>
      )[0][3]
    ).not.toBe(
      (
        rightRemove[0] as import('../../../../src/typescript/types/type.ts').Insertion<string>
      )[0][3]
    )
    // Exchange the independently authored mutations and acknowledgements.
    await gossip(left, right, leftInsert)
    await gossip(left, right, leftReplace)
    await gossip(right, left, rightRemove)
    await gossip(right, left, rightInsert)
    await expectConverged(left, [right])
    // Continue editing from the converged live state on both tabs.
    const leftTail = await left.insert(['left-tail'], await left.length())
    const rightHead = await right.replace(['right-head'], 0, 0)
    await gossip(right, left, rightHead)
    await gossip(left, right, leftTail)
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
      await replay.apply(update)
    // Live exchange and reordered replay must resolve to the same Projection.
    await expectConverged(left, [right, replay])
  })
})
