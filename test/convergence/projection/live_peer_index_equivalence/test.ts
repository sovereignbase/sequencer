/** Every indexed read must agree after each live Gossip exchange despite independent traversal caches. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip } from '../../../../src/typescript/types/type.ts'
/**
 * Verifies that two live peers expose exactly the same visible Projection.
 *
 * The comparison is intentionally performed through public Projection
 * positions rather than internal Strip or jump state. Local traversal caches
 * may differ between peers, but every visible position must resolve to the same
 * Footage.
 */
const expect_same_projection = <T>(
  left: Projection<T>,
  right: Projection<T>
): void => {
  expect(right.length()).toBe(left.length())
  for (let index = 0; index < left.length(); ++index)
    expect(right.value(index)).toBe(left.value(index))
}
/**
 * Delivers one locally authored Gossip update immediately to the other peer,
 * returns any acknowledgement to the author, and verifies convergence after
 * that delivery.
 *
 * This keeps both peers synchronized while allowing their local traversal and
 * jump state to evolve independently.
 */
const gossip = <T>(
  author: Projection<T>,
  receiver: Projection<T>,
  delta: Gossip<T>
): void => {
  const acknowledgements = receiver.apply(delta)?.[1]
  if (acknowledgements) author.apply(acknowledgements)
  expect_same_projection(author, receiver)
}
describe('live peer projection-position equivalence through jumps', () => {
  /**
   * Verifies projection-position lookup equivalence after a long sequence of
   * inserts, replacements, and removals that repeatedly create positive and
   * negative Strips and fragment the same structural regions.
   */
  it('returns the same Footage from every projection position', () => {
    const state = new Projection<number>(1)
    const peer = new Projection<number>(2)
    gossip(state, peer, state.insert([1, 1], 0))
    gossip(state, peer, state.replace([2, 2], 0, 1))
    gossip(state, peer, state.remove(0, 1))
    gossip(state, peer, state.insert([3, 3], 0))
    gossip(peer, state, peer.replace([4, 4], 0, 1))
    gossip(state, peer, state.insert([5, 5], 0))
    gossip(state, peer, state.replace([6, 6], 0, 1))
    gossip(state, peer, state.remove(0, 1))
    gossip(state, peer, state.insert([7, 7], 2))
    gossip(peer, state, peer.replace([8, 8], 0, 1))
    gossip(state, peer, state.insert([9, 9], 4))
    gossip(state, peer, state.replace([10, 10], 2, 3))
    gossip(state, peer, state.remove(4, 5))
    gossip(state, peer, state.insert([11, 11], 2))
    gossip(peer, state, peer.replace([12, 12], 2, 3))
    gossip(state, peer, state.insert([13, 13], 0))
    gossip(state, peer, state.replace([14, 14], 2, 3))
    expect(state.length()).toBe(8)
    expect(
      Array.from({ length: state.length() }, (_, index) => state.value(index))
    ).toEqual([13, 13, 14, 14, 12, 12, 10, 10])
  })
})
