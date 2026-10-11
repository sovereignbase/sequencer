import { Projection } from '../../../dist/index.js';
import type { Sequence } from '../../../dist/index.js';
export type Outcome = {
    name: string;
    error: string | null;
};
async function snapshot<T>(projection: Projection<T>): Promise<Sequence<T>> {
    const [frontiers, insertions] = await projection.sequence();
    // Omit absent Footage: JSON otherwise turns the optional field into invalid null.
    return JSON.parse(JSON.stringify([
        frontiers,
        insertions.map((entry) => entry[6] === undefined ? entry.slice(0, 6) : entry),
    ]));
}
function equal(actual: unknown, expected: unknown): void {
    if (!Object.is(actual, expected))
        throw new Error(`Expected ${String(expected)}, received ${String(actual)}`);
}
async function check<T>(projection: Projection<T>, expected: T[]): Promise<void> {
    equal(await projection.length(), expected.length);
    const values = await projection.values();
    equal(values.length, expected.length);
    for (let index = 0; index < expected.length; ++index) {
        equal(values[index], expected[index]);
        equal(await projection.value(index), expected[index]);
    }
    if (expected.length > 2) {
        const range = await projection.values(1, expected.length - 2);
        equal(range.length, expected.length - 2);
        for (let index = 0; index < range.length; ++index)
            equal(range[index], expected[index + 1]);
    }
}
/** The same public-API expectations run inside every target runtime. */
export function runSuite(Constructor: typeof Projection = Projection): Outcome[] {
    const cases: Array<[
        string,
        () => void
    ]> = [
        [
            'local editing lifecycle',
            async () => {
                const projection = new Constructor<string>(1);
                await check(projection, []);
                await projection.insert(['a', 'b', 'c'], 0);
                await check(projection, ['a', 'b', 'c']);
                await projection.insert(['head'], 0);
                await projection.insert(['tail'], await projection.length());
                await projection.insert(['middle'], 2);
                await check(projection, ['head', 'a', 'middle', 'b', 'c', 'tail']);
                await projection.replace(['B', 'C'], 3, 4);
                await check(projection, ['head', 'a', 'middle', 'B', 'C', 'tail']);
                await projection.remove(2, 2);
                await projection.remove(0, 0);
                await projection.remove(await projection.length() - 1);
                await check(projection, ['a', 'B', 'C']);
                await projection.remove();
                await check(projection, []);
                await projection.insert(['again'], 0);
                await check(projection, ['again']);
            },
        ],
        [
            'Footage identity and value types',
            async () => {
                const values = ['ää😀', 42, false, null, undefined, NaN, 3n];
                const projection = new Constructor<(typeof values)[number]>(1);
                await projection.insert(values, 0);
                equal(projection.head?.footage, values);
                await check(projection, values);
                await check(new Constructor(2, await projection.sequence()), values);
            },
        ],
        ...(['ordered', 'shuffled', 'reverse'] as const).map((order): [
            string,
            () => void
        ] => [
            `${order} delivery and duplicate apply`,
            async () => {
                const author = new Constructor<string>(1);
                author.increaseClock[0] = 100;
                author.decreaseClock[0] = 200;
                const updates = [
                    await author.insert(['a', 'b', 'c'], 0),
                    await author.insert(['X'], 1),
                    await author.remove(2, 2),
                    await author.replace(['Z'], 2, 2),
                ].flat();
                await check(author, ['a', 'X', 'Z']);
                const indices = updates.map((_, index) => index);
                if (order === 'reverse')
                    indices.reverse();
                if (order === 'shuffled') {
                    let seed = 42;
                    for (let index = indices.length - 1; index > 0; --index) {
                        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
                        const other = seed % (index + 1);
                        [indices[index], indices[other]] = [
                            indices[other],
                            indices[index],
                        ];
                    }
                }
                const receiver = new Constructor<string>(2);
                for (const index of indices) {
                    equal(await receiver.apply([updates[index]]) !== undefined, true);
                    await receiver.apply([updates[index]]);
                }
                await check(receiver, ['a', 'X', 'Z']);
            },
        ]),
        [
            'concurrent insertion tie-break',
            async () => {
                const root = [0, 0, 0, 100, 0, 2, ['a', 'b']];
                const lower = [100, 0, 1, 200, 0, 1, ['L']];
                const higher = [100, 0, 1, 300, 0, 1, ['H']];
                for (const updates of [
                    [root, lower, higher],
                    [higher, lower, root],
                ]) {
                    const projection = new Constructor<string>(1);
                    for (const update of updates)
                        await projection.apply([update]);
                    await check(projection, ['a', 'H', 'L', 'b']);
                }
            },
        ],
        [
            'merge and duplicate merge over JSON',
            async () => {
                const source = new Constructor<string>(1);
                await source.insert(['a', 'b', 'c'], 0);
                const initial = await snapshot(source);
                const receiver = new Constructor<string>(2);
                equal(await receiver.merge(initial) !== undefined, true);
                // Register the receiver before removal so its missing masks cannot compact.
                await source.apply([[receiver.actorID]]);
                await check(receiver, ['a', 'b', 'c']);
                equal(await receiver.merge(initial) !== undefined, true);
                await check(receiver, ['a', 'b', 'c']);
                await source.replace(['X'], 1, 1);
                equal(await receiver.merge(await snapshot(source)) !== undefined, true);
                await check(receiver, ['a', 'X', 'c']);
            },
        ],
        ...([false, true] as const).map((compact): [
            string,
            () => void
        ] => [
            `snapshot/hydration with compaction ${compact}`,
            async () => {
                const projection = new Constructor<string>(1);
                projection.increaseClock[0] = 100;
                projection.decreaseClock[0] = 200;
                await projection.insert(['a', 'b', 'c'], 0);
                if (!compact)
                    await projection.apply([[2]]);
                await projection.remove(1, 1);
                await projection.insert(['X'], 1);
                await check(projection, ['a', 'X', 'c']);
                const retained = await snapshot(projection);
                equal(retained[1].some((entry) => entry[5] < 0), !compact);
                let hydrated = new Constructor<string>(1, retained);
                for (let cycle = 0; cycle < 3; ++cycle) {
                    await check(hydrated, ['a', 'X', 'c']);
                    hydrated = new Constructor(1, await snapshot(hydrated));
                }
                await check(projection, ['a', 'X', 'c']);
                await hydrated.insert(['tail'], await hydrated.length());
                await check(hydrated, ['a', 'X', 'c', 'tail']);
            },
        ]),
        [
            'indexed reads across hydrated jumps',
            async () => {
                const source = new Constructor<number>(1);
                const expected = Array.from({ length: 128 }, (_, index) => index);
                for (const value of expected)
                    await source.insert([value], await source.length());
                const hydrated = new Constructor<number>(2, await source.sequence());
                for (let index = 0; index < expected.length; ++index) {
                    const at = (index * 37) % expected.length;
                    equal(await hydrated.value(at), expected[at]);
                }
                await hydrated.insert([-1], 63);
                expected.splice(63, 0, -1);
                await check(hydrated, expected);
            },
        ],
    ];
    return cases.map(([name, run]) => {
        try {
            run();
            return { name, error: null };
        }
        catch (error) {
            return {
                name,
                error: error instanceof Error
                    ? `${error.message}\n${error.stack ?? ''}`
                    : String(error),
            };
        }
    });
}
