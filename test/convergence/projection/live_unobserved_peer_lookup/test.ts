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
const gossip = async <T>(
  author: Projection<T>,
  receiver: Projection<T>,
  delta: Gossip<T>
): Promise<void> => {
  const acknowledgements = (await receiver.apply(delta))?.[1]
  if (acknowledgements) await author.apply(acknowledgements)
}
describe('unobserved live peer lookup', () => {
  /**
   * Verifies that Projection lookup remains correct after a long live edit
   * history even when no intermediate Frames have been read.
   *
   * Two synchronized peers repeatedly insert, replace, and remove Footage from
   * the head, middle, and tail. Either peer may author the next replacement, so
   * both replicas accumulate the same structural history through normal Gossip
   * and acknowledgement exchange.
   *
   * No `value()` call occurs until all mutations have completed. The final
   * lookup must therefore resolve directly from the resulting Structural Order
   * rather than depending on traversal state established by earlier reads.
   *
   * Both peers must expose:
   *
   * - the same `projectionFrameCount`;
   * - identical Footage at every Projection position;
   * - the exact final Projection
   *   `[15, 15, 16, 16, 14, 14, 10, 10]`.
   */
  it('resolves every Frame after several edits without intermediate reads', async () => {
    const state = new Projection<number>(1)
    const peer = new Projection<number>(2)
    // Build and repeatedly replace/remove the first visible region.
    await gossip(state, peer, await state.insert([1, 1], 0))
    await gossip(state, peer, await state.replace([2, 2], 0, 1))
    await gossip(state, peer, await state.remove(0, 1))
    await gossip(state, peer, await state.insert([3, 3], 0))
    await gossip(peer, state, await peer.replace([4, 4], 0, 1))
    // Rebuild the head again and introduce additional Footage after it.
    await gossip(state, peer, await state.insert([5, 5], 0))
    await gossip(state, peer, await state.replace([6, 6], 0, 1))
    await gossip(state, peer, await state.remove(0, 1))
    await gossip(state, peer, await state.insert([7, 7], 2))
    await gossip(peer, state, await peer.replace([8, 8], 0, 1))
    // Extend and mutate the middle/tail of the increasingly fragmented state.
    await gossip(state, peer, await state.insert([9, 9], 4))
    await gossip(state, peer, await state.replace([10, 10], 2, 3))
    await gossip(state, peer, await state.remove(4, 5))
    await gossip(state, peer, await state.insert([11, 11], 2))
    await gossip(peer, state, await peer.replace([12, 12], 2, 3))
    // Finish with further head and middle mutations, still without reading any
    // individual Projection Frame.
    await gossip(state, peer, await state.insert([13, 13], 0))
    await gossip(state, peer, await state.replace([14, 14], 2, 3))
    await gossip(state, peer, await state.remove(4, 5))
    await gossip(state, peer, await state.insert([15, 15], 0))
    const finalReplacement = await peer.replace([16, 16], 2, 3)
    await gossip(peer, state, finalReplacement)
    expect(await peer.length()).toBe(await state.length())
    expect(await state.length()).toBe(8)
    // Read every Frame only after the complete mutation history has settled.
    const stateValues = await Promise.all(
      Array.from(
        { length: await state.length() },
        async (_, index) => await state.value(index)
      )
    )
    const peerValues = await Promise.all(
      Array.from(
        { length: await peer.length() },
        async (_, index) => await peer.value(index)
      )
    )
    expect(peerValues).toEqual(stateValues)
    expect(stateValues).toEqual([15, 15, 16, 16, 14, 14, 10, 10])
  })
})
