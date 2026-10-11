import { expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
import type { Change } from '../../../../src/typescript/class.ts';
const fixture = async () => {
    const author = new Projection<string>(1);
    const receiver = new Projection<string>(2);
    await author.apply([[2]]);
    await receiver.apply([[1]]);
    await receiver.apply(structuredClone(await author.insert(['a', 'b', 'c', 'd', 'e', 'f'], 0)));
    await receiver.insert(['X', 'Y'], 2);
    await receiver.insert(['Z'], 6);
    return { author, receiver };
};
const applySplices = (view: Array<string | undefined>, changes: Change<string>) => {
    for (const [from, to, values] of changes)
        view.splice(from, to - from, ...(values ?? []));
    return view;
};
it.each(['apply', 'merge'] as const)('%s reports separate removals around surviving concurrent insertions', async (method) => {
    const { author, receiver } = await fixture();
    const view = (await receiver.values()).slice();
    const removal = await author.remove();
    const result = method === 'apply'
        ? (await receiver.apply(structuredClone(removal)))!
        : (await receiver.merge(structuredClone(await author.sequence())))!;
    expect(result[0]).toEqual([
        [0, 2],
        [2, 4],
        [3, 5],
    ]);
    expect(await receiver.values()).toEqual(['X', 'Y', 'Z']);
    expect(applySplices(view, result[0])).toEqual(['X', 'Y', 'Z']);
    expect((await receiver.apply(structuredClone(removal)))![0]).toEqual([]);
});
it('reports replacement splices against the view left by preceding removals', async () => {
    const { author, receiver } = await fixture();
    const view = (await receiver.values()).slice();
    const result = (await receiver.apply(structuredClone(await author.replace(['R'], 1, 4))))!;
    const expected = ['a', 'R', 'X', 'Y', 'Z', 'f'];
    expect(await receiver.values()).toEqual(expected);
    expect(applySplices(view, result[0])).toEqual(expected);
});
it('omits zero-effect mask fragments after earlier overlapping removals', async () => {
    const { author, receiver } = await fixture();
    await receiver.remove(1, 1);
    await receiver.remove(3, 3);
    const view = (await receiver.values()).slice();
    const result = (await receiver.apply(structuredClone(await author.remove())))!;
    expect(await receiver.values()).toEqual(['X', 'Y', 'Z']);
    expect(result[0].every(([from, to]) => from < to)).toBe(true);
    expect(applySplices(view, result[0])).toEqual(['X', 'Y', 'Z']);
});
