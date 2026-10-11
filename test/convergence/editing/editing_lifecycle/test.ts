import { describe, expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
const expect_projection = async <T>(projection: Projection<T>, expected: Array<T>): Promise<void> => {
    expect(await projection.values()).toEqual(expected);
    expect(await projection.length()).toBe(expected.length);
    expect(await Promise.all(Array.from({ length: await projection.length() }, async (_, index) => await projection.value(index)))).toEqual(expected);
};
describe('local editing lifecycle', () => {
    it('preserves visible values through local edits and reconstruction', async () => {
        let projection = new Projection<string>(1);
        await projection.insert(['a', 'b', 'c'], 0);
        await expect_projection(projection, ['a', 'b', 'c']);
        await projection.insert(['d', 'e', 'f'], 3);
        await expect_projection(projection, ['a', 'b', 'c', 'd', 'e', 'f']);
        await projection.insert(['g', 'h', 'i'], 0);
        await expect_projection(projection, ['g', 'h', 'i', 'a', 'b', 'c', 'd', 'e', 'f']);
        await projection.insert(['j', 'k', 'l'], 3);
        await expect_projection(projection, [
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
        ]);
        await projection.insert(['m', 'n', 'o'], 5);
        await expect_projection(projection, [
            'g',
            'h',
            'i',
            'j',
            'k',
            'm',
            'n',
            'o',
            'l',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
        ]);
        await projection.insert(['p', 'q', 'r'], await projection.length());
        await expect_projection(projection, [
            'g',
            'h',
            'i',
            'j',
            'k',
            'm',
            'n',
            'o',
            'l',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'p',
            'q',
            'r',
        ]);
        await projection.insert(['s', 't', 'u'], 0);
        await expect_projection(projection, [
            's',
            't',
            'u',
            'g',
            'h',
            'i',
            'j',
            'k',
            'm',
            'n',
            'o',
            'l',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'p',
            'q',
            'r',
        ]);
        await projection.replace(['v', 'w', 'x'], 0, 2);
        await expect_projection(projection, [
            'v',
            'w',
            'x',
            'g',
            'h',
            'i',
            'j',
            'k',
            'm',
            'n',
            'o',
            'l',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'p',
            'q',
            'r',
        ]);
        await projection.remove(0, 2);
        await expect_projection(projection, [
            'g',
            'h',
            'i',
            'j',
            'k',
            'm',
            'n',
            'o',
            'l',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'p',
            'q',
            'r',
        ]);
        await projection.remove(5, 8);
        await expect_projection(projection, [
            'g',
            'h',
            'i',
            'j',
            'k',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'p',
            'q',
            'r',
        ]);
        await projection.replace(['y', 'z'], 10, 11);
        await expect_projection(projection, [
            'g',
            'h',
            'i',
            'j',
            'k',
            'a',
            'b',
            'c',
            'd',
            'e',
            'y',
            'z',
            'q',
            'r',
        ]);
        projection = new Projection<string>(1, await projection.sequence());
        await expect_projection(projection, [
            'g',
            'h',
            'i',
            'j',
            'k',
            'a',
            'b',
            'c',
            'd',
            'e',
            'y',
            'z',
            'q',
            'r',
        ]);
    });
});
