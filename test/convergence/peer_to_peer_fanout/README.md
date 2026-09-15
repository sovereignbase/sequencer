# Peer browser fanout

Three browser pages communicate through a same-origin `BroadcastChannel`; there
is no central Delta relay or persisted server state. Each page is both editor
and peer.

The first phase creates one independent root Insert per editor. Every receiver
adds a different artificial delay, so those dependency-free Deltas may be
ingested in different orders. They must converge without pending.

The second phase schedules Insert, hard replace, and remove on each editor's own
timeouts. Editors never await delivery or ACKs. Artificial receive jitter stays
below the edit interval, modelling normal realtime peer use while retaining
per-sender causality.

Expected per peer:

```text
8 received peer Deltas
0 rejected peer Deltas (no pending required)
0 rejected local edits
identical final visible sequence
```

This does not claim that a causal child delivered before its parent can avoid a
pending store. That adversarial case necessarily requires buffering or retry and
is covered by causal-staging tests.
