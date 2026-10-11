import { describe, expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
import type { Gossip, Sequence } from '../../../../src/typescript/types/type.ts';
import { deliver, expect_converged } from '../../../.helpers/replica.ts';
describe('concurrent root sequence', () => {
    /**
     * Verifies that three independently authored root subtrees retain one
     * deterministic Structural Order and that the same Projection is reconstructed
     * from a retained Sequence.
     *
     * `primary` creates one root and extends its subtree several times at the
     * head:
     *
     *   primary-5
     *   primary-4
     *   primary-1
     *   primary-root
     *
     * `second` and `third` independently create their own roots from the same
     * empty Sequence:
     *
     *   second-root
     *
     *   third-root
     *
     * The three roots are concurrent. Their subtrees must therefore be ordered
     * deterministically without allowing the primary descendants to become
     * separated from their root by another concurrent root.
     *
     * After all Gossip has been delivered, the resulting Sequence is retained and
     * used to initialize a fresh Projection. Recreation must preserve the exact
     * visible Projection, including the deterministic order of all concurrent
     * root subtrees.
     */
    it('recreates three concurrent root subtrees in deterministic order', async () => {
        const primary = new Projection<string>(0);
        const second = new Projection<string>(1);
        const third = new Projection<string>(2);
        const mutations: Array<Gossip<string>> = [
            await 
            // Establish the primary root.
            primary.insert(['primary-root'], 0),
            await 
            // Extend the primary root subtree at its head.
            primary.insert(['primary-1'], 0),
            await 
            // Create two independent concurrent roots.
            second.insert(['second-root'], 0),
            await third.insert(['third-root'], 0),
            await 
            // Continue extending the primary subtree without observing either
            // concurrent root.
            primary.insert(['primary-4'], 0),
            await primary.insert(['primary-5'], 0),
        ];
        const empty: Sequence<string> = [[], []];
        // Materialize the complete concurrent operation set.
        const ordered = await deliver(empty, mutations);
        // Recreate a fresh live Projection directly from the retained Sequence.
        const recreated = new Projection<string>(3, await ordered.sequence());
        // Recreation must preserve the complete visible Projection exactly.
        await expect_converged(ordered, recreated);
        // Every authored Frame must survive exactly once.
        expect(new Set(ordered.values())).toEqual(new Set([
            'third-root',
            'second-root',
            'primary-5',
            'primary-4',
            'primary-1',
            'primary-root',
        ]));
    });
});
