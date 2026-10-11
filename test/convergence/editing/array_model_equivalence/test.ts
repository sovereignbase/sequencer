import fc from 'fast-check';
import { expect, it } from 'vitest';
import { Projection } from '../../../../src/typescript/class.ts';
const operation = fc.record({
    kind: fc.constantFrom('insert', 'remove', 'replace', 'hydrate'),
    author: fc.integer({ min: 0, max: 1 }),
    boundary: fc.constantFrom('head', 'middle', 'tail', 'random'),
    index: fc.nat(),
    width: fc.integer({ min: 1, max: 12 }),
    frames: fc.integer({ min: 0, max: 8 }),
    whole: fc.boolean(),
    read: fc.boolean(),
});
it('reports a head insertion at zero after resolving a free original zero in the middle', () => {
    const peers = [new Projection<string>(1), new Projection<string>(2)];
    peers.map((peer) => peer.apply([[1], [2], [3]]));
    const deliver = (author: number, update: ReturnType<Projection<string>['insert']>) => {
        const result = (peers[1 - author].apply(structuredClone(update)))!;
        if (result[1])
            peers[author].apply(result[1]);
        return result[0];
    };
    const initial = Array.from({ length: 41 }, (_, index) => `initial:${index}`);
    deliver(0, peers[0].insert(initial.slice(), 0));
    deliver(0, peers[0].remove(0, 1));
    deliver(0, peers[0].insert(['X', 'Y', 'Z'], 0));
    deliver(0, peers[0].replace(['a', 'b', 'c', 'd', 'e', 'f', 'g'], 0, 7));
    deliver(0, peers[0].insert(['U', 'V'], 21));
    deliver(0, peers[0].remove(42, 42));
    deliver(0, peers[0].remove(20, 21));
    for (const peer of peers) {
        peer.values();
        for (let index = (peer.length()) - 1; index >= 0; --index)
            peer.value(index);
        peer.values(0, 1);
    }
    deliver(1, peers[1].insert(['M'], 20));
    expect(deliver(0, peers[0].insert(['H'], 0))).toEqual([
        [0, 0, ['H']],
    ]);
    const expected = [
        'H',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        ...initial.slice(7, 20),
        'M',
        'V',
        ...initial.slice(21, 40),
    ];
    for (const peer of peers) {
        expect(peer.values()).toEqual(expected);
        for (let index = expected.length - 1; index >= 0; --index)
            expect(peer.value(index)).toBe(expected[index]);
    }
});
it.each([false, true])('matches array editing and consumer splices with compaction %s', { timeout: 300000 }, (compact) => {
    fc.assert(fc.property(fc.integer({ min: 0, max: 64 }), fc.array(operation, { minLength: 1, maxLength: 100, size: 'medium' }), (initialLength, operations) => {
        let peers = [new Projection<string>(1), new Projection<string>(2)];
        let session = 0;
        const clocks = () => {
            for (const peer of peers) {
                peer.apply(compact ? [[1], [2]] : [[1], [2], [3]]);
            }
        };
        clocks();
        const expected = Array.from({ length: initialLength }, (_, i) => `initial:${i}`);
        const views: Array<Array<string | undefined>> = [
            expected.slice(),
            expected.slice(),
        ];
        if (initialLength)
            peers[1].apply(structuredClone(peers[0].insert(expected.slice(), 0)));
        const check = (peer: Projection<string>) => {
            expect(peer.length()).toBe(expected.length);
            expect(peer.values()).toEqual(expected);
            const positions = Array.from({ length: expected.length }, (_, index) => expected.length - 1 - index);
            const read = positions.map((index) => peer.value(index));
            expect(read).toEqual(expected.slice().reverse());
        };
        for (const [step, op] of operations.entries()) {
            if (op.kind === 'hydrate') {
                peers =
                    peers.map((peer) => {
                        const sequence = structuredClone(peer.sequence());
                        peer.destroy();
                        return new Projection<string>(peer.actorID, sequence);
                    });
                clocks();
            }
            else {
                const author = peers[op.author];
                const receiver = peers[1 - op.author];
                const limit = expected.length - (op.kind === 'insert' ? 0 : 1);
                if (limit < 0)
                    continue;
                const at = op.boundary === 'head'
                    ? 0
                    : op.boundary === 'tail'
                        ? limit
                        : op.boundary === 'middle'
                            ? Math.floor(limit / 2)
                            : op.index % (limit + 1);
                const start = op.kind !== 'insert' && op.whole ? 0 : at;
                const end = op.whole
                    ? expected.length - 1
                    : Math.min(expected.length - 1, start + op.width - 1);
                const frames = Array.from({
                    length: op.kind === 'insert' ? Math.max(1, op.frames) : op.frames,
                }, (_, frame) => `${step}:${frame}`);
                const gossip = op.kind === 'insert'
                    ? author.insert(frames, start)
                    : op.kind === 'remove'
                        ? author.remove(start, end)
                        : author.replace(frames, start, end);
                expected.splice(start, op.kind === 'insert' ? 0 : end - start + 1, ...(op.kind === 'remove' ? [] : frames));
                views[op.author] = expected.slice();
                const result = (receiver.apply(structuredClone(gossip)))!;
                expect(result).toBeDefined();
                for (const [from, to, values] of result[0])
                    views[1 - op.author].splice(from, to - from, ...(values ?? []));
                if (result[1])
                    author.apply(result[1]);
            }
            for (let index = 0; index < peers.length; ++index) {
                expect(peers[index].length()).toBe(expected.length);
                expect(views[index]).toEqual(expected);
                if (op.read) {
                    check(peers[index]);
                    if (expected.length) {
                        const start = op.index % expected.length;
                        const end = Math.min(expected.length - 1, start + op.width - 1);
                        expect(peers[index].values(start, end)).toEqual(expected.slice(start, end + 1));
                    }
                }
            }
        }
        peers.map(check);
        peers.map((peer) => peer.destroy());
    }), { seed: 0x51ced, numRuns: 1024 });
});
