import { describe, expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
const expect_projection = <T>(projection: Projection<T>, expected: Array<T>): void => {
    expect(projection.values()).toEqual(expected);
    expect(projection.length()).toBe(expected.length);
    expect(Array.from({ length: projection.length() }, (_, index) => projection.value(index))).toEqual(expected);
};
describe('local editing lifecycle', () => {
    it('preserves visible values through local edits and reconstruction', () => {
        let projection = new Projection<string>(1);
        projection.insert(['a', 'b', 'c'], 0);
        expect_projection(projection, ['a', 'b', 'c']);
        projection.insert(['d', 'e', 'f'], 3);
        expect_projection(projection, ['a', 'b', 'c', 'd', 'e', 'f']);
        projection.insert(['g', 'h', 'i'], 0);
        expect_projection(projection, [
            'g',
            'h',
            'i',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
        ]);
        projection.insert(['j', 'k', 'l'], 3);
        expect_projection(projection, [
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
        projection.insert(['m', 'n', 'o'], 5);
        expect_projection(projection, [
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
        projection.insert(['p', 'q', 'r'], projection.length());
        expect_projection(projection, [
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
        projection.insert(['s', 't', 'u'], 0);
        expect_projection(projection, [
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
        projection.replace(['v', 'w', 'x'], 0, 2);
        expect_projection(projection, [
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
        projection.remove(0, 2);
        expect_projection(projection, [
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
        projection.remove(5, 8);
        expect_projection(projection, [
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
        projection.replace(['y', 'z'], 10, 11);
        expect_projection(projection, [
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
        projection = new Projection<string>(1, projection.sequence());
        expect_projection(projection, [
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
