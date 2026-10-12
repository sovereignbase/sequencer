/** Actor identifier used in Acknowledgements is shared across tabs; authoring Session clocks and Insertion identities remain per-instance. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts'
/**
 * Materializes every visible Frame for exact Projection comparison.
 */
/** Reads visible Frames independently of snapshot compaction and internal cache shape. */
const project = <T>(sequence: Projection<T>): Array<T | undefined> =>
  Array.from({ length: sequence.length() }, (_, index) => sequence.value(index))
/**
 * Verifies that every supplied replica exposes the same visible Projection as
 * the expected replica.
 */
/** Compares all complete receivers with one expected visible Projection. */
const expectConverged = <T>(
  expected: Projection<T>,
  replicas: Array<Projection<T>>
): void => {
  for (const replica of replicas) {
    expect(replica.length()).toBe(expected.length())
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
/** Returns Acknowledgements under the shared Actor identity while preserving distinct authoring Sessions. */
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
    // Both tabs independently mutate the same retained origin.
    const leftInsert = left.insert(['left-0', 'left-1'], 1)
    const leftReplace = left.replace(['left-r0', 'left-r1'], 2, 3)
    const rightInsert = right.insert(['right-0', 'right-1'], 3)
    const rightRemove = right.remove(1, 2)
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
    gossip(left, right, leftInsert)
    gossip(left, right, leftReplace)
    gossip(right, left, rightRemove)
    gossip(right, left, rightInsert)
    expectConverged(left, [right])
    // Continue editing from the converged live state on both tabs.
    const leftTail = left.insert(['left-tail'], left.length())
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
