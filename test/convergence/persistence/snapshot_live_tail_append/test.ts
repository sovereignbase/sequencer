import { describe, expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
import type { Gossip } from '../../../../src/typescript/types/type.ts';
describe.each(['ordered', 'reverse', 'shuffled'] as const)('snapshot/live tail append with %s delivery', (delivery) => {
    it.each([2, 4, 128])('converges across %i replacements before and after hydration', async (replacements) => {
        const live = new Projection<number>(2, [
            [],
            [[0, 0, 0, 100, 0, 2, [0, 1]]],
        ]);
        live.increaseClock[0] = 200;
        live.decreaseClock[0] = 300;
        // The joining actor has not received the masks, so compaction cannot retire them.
        await live.apply([[1]]);
        for (let index = 0; index < replacements; ++index)
            await live.replace([index + 2], 1, 1);
        const hydrated = new Projection<number>(1, structuredClone(await live.sequence()));
        hydrated.increaseClock[0] = 400;
        expect(await hydrated.values()).toEqual(await live.values());
        const append = await hydrated.insert([999], await hydrated.length());
        expect(await hydrated.values()).toEqual([0, replacements + 1, 999]);
        const updates: Array<Gossip<number>> = [];
        for (let index = 0; index < replacements; ++index)
            updates.push(structuredClone(await live.replace([index + replacements + 2], 1, 1)));
        const ordered = delivery === 'reverse'
            ? [...updates].reverse()
            : delivery === 'shuffled'
                ? [
                    ...updates.filter((_, index) => index % 2 !== 0),
                    ...updates.filter((_, index) => index % 2 === 0),
                ]
                : updates;
        for (const update of ordered)
            await hydrated.apply(update);
        await live.apply(append);
        const expected = [0, 999, replacements * 2 + 1];
        for (const peer of [live, hydrated]) {
            expect(await peer.values()).toEqual(expected);
            expect(await Promise.all(Array.from({ length: await peer.length() }, async (_, index) => await peer.value(index)))).toEqual(expected);
        }
        // Return the final ACK only after the joining peer has received every mask.
        await live.apply((await hydrated.apply(updates.at(-1)!))![1]!);
        for (const peer of [live, hydrated]) {
            const compacted = await peer.sequence();
            expect(compacted[1].every((entry) => entry[5] > 0)).toBe(true);
            expect(await new Projection<number>(4, structuredClone(compacted)).values()).toEqual(expected);
        }
    });
});
it('preserves competing offline tail appends before a later mask-end replacement', async () => {
    const live = new Projection<string>(2, [
        [[1], [2], [3]],
        [[0, 0, 0, 100, 0, 2, ['a', 'old']]],
    ]);
    live.increaseClock[0] = 200;
    live.decreaseClock[0] = 300;
    await live.replace(['previous'], 1, 1);
    await live.replace(['tail'], 1, 1);
    const snapshot = await live.sequence();
    const first = new Projection<string>(1, structuredClone(snapshot));
    const second = new Projection<string>(3, structuredClone(snapshot));
    first.increaseClock[0] = 400;
    second.increaseClock[0] = 500;
    const appendFirst = await first.insert(['X'], 2);
    const appendSecond = await second.insert(['Y'], 2);
    await first.apply(appendSecond);
    await second.apply(appendFirst);
    const replacement = await live.replace(['new'], 1, 1);
    await live.apply(appendFirst);
    await live.apply(appendSecond);
    await first.apply(replacement);
    await second.apply(replacement);
    for (const peer of [live, first, second])
        expect(await peer.values()).toEqual(['a', 'Y', 'X', 'new']);
});
