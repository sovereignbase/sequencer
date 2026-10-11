import { describe, expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
import type { Gossip, Insertion, } from '../../../../src/typescript/types/type.ts';
describe.each(['ordered', 'reverse', 'shuffled'] as const)('snapshot/live tail append with %s delivery', (delivery) => {
    it.each([2, 4, 128])('converges across %i replacements before and after hydration', (replacements) => {
        const live = new Projection<number>(2, [
            [],
            [
                [
                    [0, 0, 0, 100, 0, 2],
                    [0, 1],
                ],
            ],
        ]);
        // The joining actor has not received the masks, so compaction cannot retire them.
        live.apply([[1]]);
        for (let index = 0; index < replacements; ++index)
            live.replace([index + 2], 1, 1);
        const hydrated = new Projection<number>(1, structuredClone(live.sequence()));
        expect(hydrated.values()).toEqual(live.values());
        const append = hydrated.insert([999], hydrated.length());
        expect(hydrated.values()).toEqual([0, replacements + 1, 999]);
        const updates: Array<Gossip<number>> = [];
        for (let index = 0; index < replacements; ++index)
            updates.push(structuredClone(live.replace([index + replacements + 2], 1, 1)));
        const ordered = delivery === 'reverse'
            ? [...updates].reverse()
            : delivery === 'shuffled'
                ? [
                    ...updates.filter((_, index) => index % 2 !== 0),
                    ...updates.filter((_, index) => index % 2 === 0),
                ]
                : updates;
        for (const update of ordered)
            hydrated.apply(update);
        live.apply(append);
        const expected = [0, 999, replacements * 2 + 1];
        for (const peer of [live, hydrated]) {
            expect(peer.values()).toEqual(expected);
            expect(Array.from({ length: peer.length() }, (_, index) => peer.value(index))).toEqual(expected);
        }
        // Return the final ACK only after the joining peer has received every mask.
        live.apply((hydrated.apply(updates.at(-1)!))![1]!);
        for (const peer of [live, hydrated]) {
            const compacted = peer.sequence();
            expect(compacted[1].every((entry) => ((entry[0] as ReadonlyArray<number>)[5] | 0) > 0)).toBe(true);
            expect(new Projection<number>(4, structuredClone(compacted)).values()).toEqual(expected);
        }
    });
});
it('preserves competing offline tail appends before a later mask-end replacement', () => {
    const live = new Projection<string>(2, [
        [[1], [2], [3]],
        [
            [
                [0, 0, 0, 100, 0, 2],
                ['a', 'old'],
            ],
        ],
    ]);
    live.replace(['previous'], 1, 1);
    live.replace(['tail'], 1, 1);
    const snapshot = live.sequence();
    const first = new Projection<string>(1, structuredClone(snapshot));
    const second = new Projection<string>(3, structuredClone(snapshot));
    const appendFirst = first.insert(['X'], 2);
    const appendSecond = second.insert(['Y'], 2);
    first.apply(appendSecond);
    second.apply(appendFirst);
    const replacement = live.replace(['new'], 1, 1);
    live.apply(appendFirst);
    live.apply(appendSecond);
    first.apply(replacement);
    second.apply(replacement);
    const ordered = (appendFirst[0] as Insertion<string>)[0][3] >
        (appendSecond[0] as Insertion<string>)[0][3]
        ? ['X', 'Y']
        : ['Y', 'X'];
    for (const peer of [live, first, second])
        expect(peer.values()).toEqual(['a', ...ordered, 'new']);
});
