import { describe, expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
import type { Insertion, Strip } from '../../../../src/typescript/types/type.ts';
describe('sequence jump preoptimization', () => {
    it('hydrates successive fragment boundaries and their same-point competitors', async () => {
        const frames = Array.from({ length: 256 }, (_, index) => index);
        const insertions: Array<Insertion<number>> = [
            [0, 0, 0, 100, 0, frames.length, frames],
        ];
        const expected = [...frames];
        for (let index = 0; index < 128; ++index) {
            const at = index * 2 + 1;
            insertions.push([100, 0, at, 300, index * 2, 1, [-at]]);
            insertions.push([100, 0, at, 200, index * 2, 1, [-at - 1000]]);
            expected.splice(index * 4 + 1, 0, -at, -at - 1000);
        }
        const hydrated = new Projection<number>(1, [[], insertions]);
        expect(await hydrated.values()).toEqual(expected);
        expect(await new Projection<number>(1, await hydrated.sequence()).values()).toEqual(expected);
        await hydrated.insert([9999], 255);
        expected.splice(255, 0, 9999);
        expect(await hydrated.values()).toEqual(expected);
    });
    /**
     * Verifies that reconstruction from a retained Sequence prebuilds valid
     * traversal jumps at approximately square-root spacing.
     *
     * The source contains sixteen one-Frame Strips in a simple linear order.
     * Recreating a Projection from that Sequence should immediately install
     * reciprocal traversal jumps instead of requiring later lookups to discover
     * and optimize the path opportunistically.
     *
     * For this Sequence:
     *
     * - jump spacing is `round(sqrt(stripCount))`;
     * - every jump crosses exactly that many Strips;
     * - because every Strip contributes one visible Frame, each jump crosses the
     *   same number of Projection Frames;
     * - every right jump must have the matching reciprocal left jump.
     *
     * With sixteen Strips the spacing is four, producing three complete jumps
     * from the head before the remaining tail is shorter than one full jump.
     *
     * Preoptimization must not affect the reconstructed visible Projection.
     */
    it('creates valid square-root-spaced jumps during reconstruction', async () => {
        // Build sixteen consecutive one-Frame Strips.
        const source = new Projection<number>(1);
        for (let value = 0; value < 16; ++value)
            await source.insert([value], await source.length());
        const sequence = await source.sequence();
        // Reconstruction should prebuild traversal jumps directly from Sequence.
        const recreated = new Projection<number>(2, sequence);
        const spacing = Math.round(Math.sqrt(sequence[1].length));
        let jump = recreated.head;
        let jumpCount = 0;
        // Every complete prebuilt jump must span the expected number of Strips and
        // Frames and maintain a reciprocal link in the opposite direction.
        while (jump?.rightJump) {
            expect(jump.rightJumpStripCount).toBe(spacing);
            expect(jump.rightJumpFrameCount).toBe(spacing);
            expect(jump.rightJump.leftJump).toBe(jump);
            jump = jump.rightJump;
            ++jumpCount;
        }
        // Sixteen Strips with spacing four produce three complete forward jumps:
        // head -> 4 -> 8 -> 12.
        expect(jumpCount).toBe(3);
        // Jump preoptimization must not change any visible Footage.
        expect(await recreated.values()).toEqual(await source.values());
    });
    it('retains valid jumps through local and remote edits inside prebuilt spans', async () => {
        const source = new Projection<number>(1);
        const expected: number[] = [];
        for (let i = 0; i < 16; ++i) {
            const frames = Array.from({ length: 8 }, (_, j) => i * 8 + j);
            await source.insert(frames, await source.length());
            expected.push(...frames);
        }
        const sequence = await source.sequence();
        const local = new Projection<number>(2, sequence);
        const remote = new Projection<number>(3, sequence);
        for (let i = 0; i < 64; ++i) {
            const index = (i * 37) % expected.length;
            const removing = i % 3 === 0;
            const update = removing
                ? await local.remove(index, index) : await local.insert([-i], index);
            expected.splice(index, removing ? 1 : 0, ...(removing ? [] : [-i]));
            const result = (await remote.apply(update))!;
            if (result[1])
                await local.apply(result[1]);
            for (const projection of [local, remote]) {
                expect(await projection.value(index)).toBe(expected[index]);
                expect(await projection.values()).toEqual(expected);
                const positions = new Map<NonNullable<Strip<number>>, [
                    number,
                    number
                ]>();
                let frames = 0;
                for (let strip = projection.structuralHead; strip; strip = strip.rightStep) {
                    positions.set(strip, [frames, positions.size]);
                    frames += Math.max(0, strip.fragmentDiff ?? strip.insertionDiff);
                }
                let jumps = 0;
                for (const [strip, [frame, order]] of positions) {
                    if (!strip.rightJump)
                        continue;
                    const [rightFrame, rightOrder] = positions.get(strip.rightJump)!;
                    expect(strip.rightJumpFrameCount).toBe(rightFrame - frame);
                    expect(strip.rightJumpStripCount).toBe(rightOrder - order);
                    expect(strip.rightJump.leftJump).toBe(strip);
                    expect(strip.rightJump.leftJumpFrameCount).toBe(rightFrame - frame);
                    expect(strip.rightJump.leftJumpStripCount).toBe(rightOrder - order);
                    ++jumps;
                }
                expect(jumps).toBeGreaterThan(0);
            }
        }
    });
});
