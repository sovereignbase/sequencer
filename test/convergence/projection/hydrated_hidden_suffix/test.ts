import { expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
import type { Insertion } from '../../../../src/typescript/class.ts';
it('retains its visible tail across concurrent removals of the same suffix', async () => {
    const insertions: Array<Insertion<number>> = [];
    for (let index = 0; index < 18; ++index)
        insertions.push([
            0,
            0,
            0,
            1000 - index,
            0,
            index === 17 ? 4 : 1,
            index === 17 ? [17, 18, 19, 20] : [index],
        ]);
    for (let index = 0; index < 46; ++index)
        insertions.push([983, 0, 1, 2000 - index, 0, -3]);
    const projection = new Projection<number>(1, [[[2]], insertions]);
    const expected = Array.from({ length: 18 }, (_, index) => index);
    expect(await projection.values()).toEqual(expected);
    const hydrated = new Projection<number>(3, await projection.sequence());
    expect(await hydrated.values()).toEqual(expected);
    expect(await hydrated.value(17)).toBe(17);
    await projection.apply(await hydrated.insert([64], 18));
    expect(await projection.values()).toEqual([...expected, 64]);
    expect(await hydrated.values()).toEqual(await projection.values());
});
it('retains visible root boundaries across an unacknowledged hidden suffix', async () => {
    const insertions: Array<Insertion<number>> = [];
    for (let index = 0; index < 64; ++index) {
        const session = 1000 - index;
        insertions.push([0, 0, 0, session, 0, 1, [index]]);
        if (index >= 17)
            insertions.push([session, 0, 0, 2000, (index - 17) * 2, -1]);
    }
    const projection = new Projection<number>(1, [[[2]], insertions]);
    const expected = Array.from({ length: 17 }, (_, index) => index);
    expect(await projection.values()).toEqual(expected);
    const hydrated = new Projection<number>(3, await projection.sequence());
    expect(await hydrated.values()).toEqual(expected);
    expect(await hydrated.value(16)).toBe(16);
    await projection.apply(await hydrated.insert([64], 17));
    expect(await projection.values()).toEqual([...expected, 64]);
    expect(await hydrated.values()).toEqual(await projection.values());
});
it.each([17, 28, 31])('retains %i visible Frames while hydrating an unacknowledged hidden suffix', async (visibleCount) => {
    const source = new Projection<number>(1);
    for (let index = 0; index < 64; ++index)
        await source.insert([index], await source.length());
    await source.apply([[2]]);
    await source.remove(visibleCount);
    const snapshot = await source.sequence();
    expect(snapshot[1].some((entry) => entry[5] < 0)).toBe(true);
    const hydrated = new Projection<number>(3, snapshot);
    expect(await hydrated.values()).toEqual(Array.from({ length: visibleCount }, (_, index) => index));
    expect(await hydrated.value(visibleCount - 1)).toBe(visibleCount - 1);
    const gossip = await hydrated.insert([64], await hydrated.length());
    await source.apply(gossip);
    expect(await source.values()).toEqual(await hydrated.values());
    expect(await hydrated.values()).toEqual([
        ...Array.from({ length: visibleCount }, (_, index) => index),
        64,
    ]);
});
