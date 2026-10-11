import { describe, expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
import type { Gossip } from '../../../../src/typescript/types/type.ts';
/**
 * Creates a repeated Footage range whose value identifies the operation that
 * produced it.
 */
const frames = (value: number, length: number): Array<number> => new Array<number>(length).fill(value);
/**
 * Verifies that two continuously running peers expose exactly the same
 * Projection.
 *
 * Their internal Structural Order, fragmentation, gate position, and jump
 * caches may differ locally. Only the visible Projection is required to remain
 * equivalent.
 */
const expectLivePeers = async (left: Projection<number>, right: Projection<number>): Promise<void> => {
    expect(await right.length()).toBe(await left.length());
    expect(await Promise.all(Array.from({ length: await right.length() }, async (_, index) => await right.value(index)))).toEqual(await Promise.all(Array.from({ length: await left.length() }, async (_, index) => await left.value(index))));
};
/**
 * Delivers one locally authored Gossip update immediately to the other peer,
 * returns any acknowledgement to its author, and verifies live Projection
 * equivalence before the next mutation is created.
 */
const gossip = async (author: Projection<number>, receiver: Projection<number>, delta: Gossip<number>): Promise<void> => {
    const acknowledgements = (await receiver.apply(delta))?.[1];
    if (acknowledgements)
        await author.apply(acknowledgements);
    await expectLivePeers(author, receiver);
};
describe('live replace then remove', () => {
    /**
     * Verifies that repeated replacement followed by removal produces the same
     * visible Projection through both the local mutation path and remote apply
     * path.
     *
     * Two live peers exchange every Gossip update immediately. The workload then
     * repeatedly performs the same structural pattern on increasingly fragmented
     * content:
     *
     *   insert
     *   replace
     *   remove
     *   insert
     *   remote replace
     *
     * Later rounds target head, middle, and tail ranges left behind by previous
     * replacements and removals. This creates overlapping positive Footage,
     * reducing Mask Strips, split fragments, and boundaries whose local structure
     * has accumulated a substantial edit history.
     *
     * The peers deliberately use different decrease clocks so reducing operations
     * have distinct identities while still being integrated into the same shared
     * history.
     *
     * After every individual Gossip delivery, both peers must expose exactly the
     * same `projectionFrameCount` and the same Footage at every Projection
     * position. A replacement or subsequent removal must therefore have identical
     * visible effect whether it was created locally or reconstructed remotely.
     */
    it('keeps the local and remotely applied structures equivalent', async () => {
        const primary = new Projection<number>(3);
        const peer = new Projection<number>(4);
        // Give reducing operations authored by each peer distinct clock identities.
        primary.decreaseClock[0] = 531265640;
        peer.decreaseClock[0] = 420094554;
        // Establish, replace, remove, and rebuild the initial range.
        await gossip(primary, peer, await primary.insert(frames(1, 86), 0));
        await gossip(primary, peer, await primary.replace(frames(2, 86), 0, 85));
        await gossip(primary, peer, await primary.remove(0, 85));
        await gossip(primary, peer, await primary.insert(frames(3, 90), 0));
        await gossip(peer, primary, await peer.replace(frames(4, 90), 0, 89));
        // Add a new head range, replace across the existing boundary, remove that
        // head again, and rebuild through a remote replacement.
        await gossip(primary, peer, await primary.insert(frames(5, 77), 0));
        await gossip(primary, peer, await primary.replace(frames(6, 90), 77, 166));
        await gossip(primary, peer, await primary.remove(0, 76));
        await gossip(primary, peer, await primary.insert(frames(7, 28), 0));
        await gossip(peer, primary, await peer.replace(frames(8, 90), 28, 117));
        // Continue editing through the fragmented middle of the Projection.
        await gossip(primary, peer, await primary.insert(frames(9, 3), 118));
        await gossip(primary, peer, await primary.replace(frames(10, 28), 0, 27));
        await gossip(primary, peer, await primary.remove(28, 117));
        await gossip(primary, peer, await primary.insert(frames(11, 88), 31));
        await gossip(peer, primary, await peer.replace(frames(12, 28), 0, 27));
        // Exercise another replacement/remove cycle spanning previously split
        // ranges before rebuilding the head again.
        await gossip(primary, peer, await primary.insert(frames(13, 42), 0));
        await gossip(primary, peer, await primary.replace(frames(14, 3), 70, 72));
        await gossip(primary, peer, await primary.remove(73, 160));
        await gossip(primary, peer, await primary.insert(frames(15, 96), 0));
        await gossip(peer, primary, await peer.replace(frames(16, 96), 0, 95));
        // Finish by extending the tail, replacing the head, and removing a later
        // fragmented range. Live equivalence is checked after every step.
        await gossip(primary, peer, await primary.insert(frames(17, 66), 169));
        await gossip(primary, peer, await primary.replace(frames(18, 96), 0, 95));
        await gossip(primary, peer, await primary.remove(138, 165));
    });
});
