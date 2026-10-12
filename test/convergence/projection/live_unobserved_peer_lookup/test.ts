/** Remote edits must maintain valid lookup state without intermediate reads repairing the local gate. */
import { describe, expect, it } from 'vitest'
import { Projection } from '../../../../src/typescript/class.ts'
import type { Gossip } from '../../../../src/typescript/types/type.ts'
/**
 * Delivers one locally authored mutation to the live peer and returns any
 * acknowledgement to its author.
 *
 * The peers stay synchronized after every edit, but no `value()` lookup is
 * performed while the mutation history is being built.
 */
const gossip = <T>(
  author: Projection<T>,
  receiver: Projection<T>,
  delta: Gossip<T>
): void => {
  const acknowledgements = receiver.apply(delta)?.[1]
  if (acknowledgements) author.apply(acknowledgements)
}
describe('unobserved live peer lookup', () => {
  /**
   * Verifies that Projection lookup remains correct after a long live edit history
   * even when no intermediate Frames have been read.
   */
  it('resolves every Frame after several edits without intermediate reads', () => {
    const state = new Projection<number>(1)
    const peer = new Projection<number>(2)
    // Build and repeatedly replace/remove the first visible region.
    gossip(state, peer, state.insert([1, 1], 0))
    gossip(state, peer, state.replace([2, 2], 0, 1))
    gossip(state, peer, state.remove(0, 1))
    gossip(state, peer, state.insert([3, 3], 0))
    gossip(peer, state, peer.replace([4, 4], 0, 1))
    // Rebuild the head again and introduce additional Footage after it.
    gossip(state, peer, state.insert([5, 5], 0))
    gossip(state, peer, state.replace([6, 6], 0, 1))
    gossip(state, peer, state.remove(0, 1))
    gossip(state, peer, state.insert([7, 7], 2))
    gossip(peer, state, peer.replace([8, 8], 0, 1))
    // Extend and mutate the middle/tail of the increasingly fragmented state.
    gossip(state, peer, state.insert([9, 9], 4))
    gossip(state, peer, state.replace([10, 10], 2, 3))
    gossip(state, peer, state.remove(4, 5))
    gossip(state, peer, state.insert([11, 11], 2))
    gossip(peer, state, peer.replace([12, 12], 2, 3))
    // Finish with further head and middle mutations, still without reading any
    // individual Projection Frame.
    gossip(state, peer, state.insert([13, 13], 0))
    gossip(state, peer, state.replace([14, 14], 2, 3))
    gossip(state, peer, state.remove(4, 5))
    gossip(state, peer, state.insert([15, 15], 0))
    const finalReplacement = peer.replace([16, 16], 2, 3)
    gossip(peer, state, finalReplacement)
    expect(peer.length()).toBe(state.length())
    expect(state.length()).toBe(8)
    // Read every Frame only after the complete mutation history has settled.
    const stateValues = Array.from({ length: state.length() }, (_, index) =>
      state.value(index)
    )
    const peerValues = Array.from({ length: peer.length() }, (_, index) =>
      peer.value(index)
    )
    expect(peerValues).toEqual(stateValues)
    expect(stateValues).toEqual([15, 15, 16, 16, 14, 14, 10, 10])
  })
})
