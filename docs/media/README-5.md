# WebSocket fanout

Three Chromium pages run independent instances of the current `Projection`
implementation from the same retained twelve-Frame Sequence. A stateless
WebSocket relay forwards each received Gossip packet to the other two peers.

Each peer authors four edits on independent timers: one inserts, one replaces,
and one removes. The calls use `insert(values, at)`, `replace(values, start, end)`
and `remove(start, end)`, with inclusive removal and replacement ranges.
Gossip is sent as ordinary JSON tuples and received through `apply(gossip)`.

Every peer must send four updates, receive eight updates, report no errors,
and expose the same final visible Projection. The test uses normal random
Session generation and imposes no Actor-derived Session identities.

Run with `npm run test:integration`. Vitest launches the browsers through
Playwright and bundles `src/class.ts` in memory.
