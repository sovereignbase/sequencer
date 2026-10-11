import { afterAll, beforeAll, expect, test } from 'vitest';
import { browserRuntime, loadProjection } from '../../.helpers/browser.ts';
let runtime: Awaited<ReturnType<typeof browserRuntime>>;
beforeAll(async () => {
    runtime = await browserRuntime();
});
afterAll(async () => {
    await runtime?.browser.close();
});
/**
 * Verifies causal staging across three real browser peers.
 *
 * Peer A authors a parent and delivers it only to B. B then authors a child
 * against that parent, but the child reaches C before C has received the parent.
 *
 * C must accept and retain the child without materializing it. When the delayed
 * parent later arrives, the pending child must resolve automatically without
 * child redelivery.
 *
 * Final state:
 *
 *   A: A:parent, B:child
 *   B: A:parent, B:child
 *   C: A:parent, B:child
 *
 * This exercises causal staging through the public browser API rather than the
 * direct Projection implementation.
 */
test('peer gossip resolves B child at C after delayed A parent', async () => {
    const context = await runtime.browser.newContext();
    const [a, b, c] = await Promise.all([0, 1, 2].map(() => context.newPage()));
    try {
        // Create three independent browser peers.
        await Promise.all(await Promise.all([a, b, c].map(async (page, peer) => {
            await page.route('http://sequencer.test/**', (route) => route.fulfill({ body: '<!doctype html>' }));
            await page.goto('http://sequencer.test/');
            await loadProjection(page, runtime.source);
            await page.evaluate((actor) => {
                ;
                (window as any).causalPeer = {
                    state: new window.Projection<string>(actor),
                };
            }, 300 + peer);
        })));
        // A authors the parent and delivers it only to B.
        const parent = await a.evaluate(async () => {
            return await (window as any).causalPeer.state.insert(['A:parent'], 0);
        });
        expect(await b.evaluate(async (delta) => {
            return await (window as any).causalPeer.state.apply(delta) !== undefined;
        }, parent)).toBe(true);
        // B authors a child after A's parent. C has never seen the parent, so this
        // operation must be accepted into pending rather than partially projected.
        const child = await b.evaluate(async () => {
            return await (window as any).causalPeer.state.insert(['B:child'], 1);
        });
        expect(await c.evaluate(async (delta) => {
            return await (window as any).causalPeer.state.apply(delta) !== undefined;
        }, child)).toBe(true);
        // The unresolved child remains invisible until its missing parent arrives.
        expect(await c.evaluate(async () => {
            return await (window as any).causalPeer.state.values();
        })).toEqual([]);
        // The delayed parent must automatically unlock C's retained child. The
        // child itself is not redelivered.
        expect(await c.evaluate(async (delta) => {
            return await (window as any).causalPeer.state.apply(delta) !== undefined;
        }, parent)).toBe(true);
        // Complete A's view by delivering B's child back to A.
        expect(await a.evaluate(async (delta) => {
            return await (window as any).causalPeer.state.apply(delta) !== undefined;
        }, child)).toBe(true);
        const values = await Promise.all([a, b, c].map((page) => page.evaluate(async () => {
            return await (window as any).causalPeer.state.values();
        })));
        // All three browser peers must expose the exact same causal Projection.
        expect(values).toEqual([
            ['A:parent', 'B:child'],
            ['A:parent', 'B:child'],
            ['A:parent', 'B:child'],
        ]);
    }
    finally {
        await context.close();
    }
});
/**
 * Verifies convergence between three continuously running browser peers while
 * each editor authors operations on independent timers and receives concurrent
 * Gossip in a different network order.
 *
 * The peers communicate through BroadcastChannel. Every receiver applies a
 * deterministic sender/editor-specific delay, so cross-sender operations are
 * intentionally observed in different orders.
 *
 * The workload has two phases:
 *
 * 1. All three editors independently create concurrent root insertions.
 * 2. Each editor continues with three timed insert/replace/remove operations
 *    against its own live Projection.
 *
 * No local edit waits for a remote packet. The edit intervals are merely longer
 * than the bounded network jitter, allowing ordinary causal continuation while
 * concurrent cross-peer operations still arrive in different orders.
 *
 * After all eight remote updates have reached every peer:
 *
 * - all three visible Projections must be identical;
 * - every remote update must have been accepted;
 * - every local mutation must have been accepted.
 *
 * This exercises live peer convergence through the browser Projection API,
 * real browser event loops, timers, BroadcastChannel delivery, and independent
 * network reordering.
 */
test('peer browsers converge with independent reordering and editor timers', async () => {
    const context = await runtime.browser.newContext();
    const pages = await Promise.all([0, 1, 2].map(() => context.newPage()));
    const channelName = `sequencer-p2p-${Date.now()}`;
    try {
        // Initialize three independent live peers sharing one BroadcastChannel.
        await Promise.all(await Promise.all(pages.map(async (page, editor) => {
            await page.route('http://sequencer.test/**', (route) => route.fulfill({ body: '<!doctype html>' }));
            await page.goto('http://sequencer.test/');
            await loadProjection(page, runtime.source);
            await page.evaluate(({ actor, channelName, editor }) => {
                const channel = new BroadcastChannel(channelName);
                const runtime = {
                    actor,
                    state: new window.Projection<string>(actor),
                    channel,
                    received: 0,
                    rejected: 0,
                    localRejected: 0,
                };
                (window as any).peerRuntime = runtime;
                channel.onmessage = (event) => {
                    const { source, ordinal, delta } = event.data;
                    // Give each receiver a different deterministic delivery delay.
                    // Concurrent operations therefore arrive in different orders at
                    // different peers.
                    const delay = (editor * 11 + source * 7 + ordinal * 3) % 19;
                    setTimeout(async () => {
                        if (await runtime.state.apply(delta) === undefined)
                            ++runtime.rejected;
                        ++runtime.received;
                    }, delay);
                };
            }, { actor: 200 + editor, channelName, editor });
        })));
        /**
         * Author three independent concurrent roots.
         *
         * None depends on another peer's root, so all three may be received and
         * integrated in different orders without causal staging.
         */
        await Promise.all(pages.map((page, editor) => page.evaluate((editor) => new Promise<void>((resolve) => setTimeout(async () => {
            const runtime = (window as any).peerRuntime;
            const delta = await runtime.state.insert([`root:${editor}`], 0);
            if (delta === false)
                ++runtime.localRejected;
            else
                runtime.channel.postMessage({
                    source: editor,
                    ordinal: 0,
                    delta,
                });
            resolve();
        }, editor * 3)), editor)));
        // Each peer must receive the other two root operations.
        await Promise.all(pages.map((page) => page.waitForFunction(() => (window as any).peerRuntime.received === 2)));
        /**
         * Continue normal editing independently on each peer.
         *
         * Every editor authors three operations on its own timers. No callback waits
         * for a peer message before creating the next local edit.
         */
        await Promise.all(pages.map((page, editor) => page.evaluate((editor) => new Promise<void>((resolve) => {
            const runtime = (window as any).peerRuntime;
            let remaining = 3;
            for (let edit = editor; edit < 9; edit += 3)
                setTimeout(async () => {
                    const { state, channel } = runtime;
                    const size = await state.length();
                    const delta = edit % 3 === 0
                        ? await state.insert([`insert:${edit}`], size) : edit % 3 === 1
                        ? await state.replace([`replace:${edit}`], edit % size, edit % size) : await state.remove(edit % size, edit % size);
                    if (delta === false)
                        ++runtime.localRejected;
                    else
                        channel.postMessage({
                            source: editor,
                            ordinal: edit + 1,
                            delta,
                        });
                    if (--remaining === 0)
                        resolve();
                }, 50 + edit * 40);
        }), editor)));
        // Each peer authored three updates and must receive the other six, in
        // addition to the two root updates already received.
        await Promise.all(pages.map((page) => page.waitForFunction(() => (window as any).peerRuntime.received === 8)));
        const results = await Promise.all(pages.map((page) => page.evaluate(async () => {
            const runtime = (window as any).peerRuntime;
            runtime.channel.close();
            return {
                values: await runtime.state.values(),
                received: runtime.received,
                rejected: runtime.rejected,
                localRejected: runtime.localRejected,
            };
        })));
        // Independent network ordering must still produce one identical Projection.
        expect(results.map(({ values }) => values)).toEqual([
            results[0].values,
            results[0].values,
            results[0].values,
        ]);
        // Every expected local and remote operation must have been accepted.
        for (const result of results) {
            expect(result.received).toBe(8);
            expect(result.rejected).toBe(0);
            expect(result.localRejected).toBe(0);
        }
    }
    finally {
        await context.close();
    }
});
