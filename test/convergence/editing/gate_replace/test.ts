import { describe, expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
describe('local replace gate', () => {
    /**
     * Verifies that a local replacement leaves the gate positioned against the
     * left side of the replaced region so that a following insertion resolves
     * against the replacement Footage rather than the original Strip boundary.
     *
     * The Projection evolves as:
     *
     *   a, b, c
     *
     * Replacing the first two Frames produces:
     *
     *   x, y, c
     *
     * The next insertion targets Projection position 1, between `x` and `y`:
     *
     *   x | y, c
     *     ↑
     *     z
     *
     * The gate and its projected index must therefore still describe that visible
     * left-side boundary after the replacement. The insertion must resolve to:
     *
     *   x, z, y, c
     *
     * If the replacement leaves the gate indexed on the wrong side of the split
     * structure, the following insertion can anchor against the wrong fragment.
     */
    it('keeps the gate index on the left side of a same-strip replacement', async () => {
        const sequence = new Projection<string>(1);
        // Establish one three-Frame Strip.
        await sequence.insert(['a', 'b', 'c'], 0);
        // Replace the first two Frames within that same Strip.
        await sequence.replace(['x', 'y'], 0, 1);
        // Insert at the visible boundary between the two replacement Frames.
        await sequence.insert(['z'], 1);
        expect(await sequence.values()).toEqual(['x', 'z', 'y', 'c']);
    });
});
