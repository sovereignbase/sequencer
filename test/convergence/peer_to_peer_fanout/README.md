# Peer browser fanout

Three browser pages communicate through a same-origin `BroadcastChannel`; there
is no central Delta relay or persisted server state. Each page is both editor
and peer.

The causal pending regression uses an explicit three-peer route:

```text
A creates parent
A --parent--> B
B creates child(parent)
B --child--> C       # parent is still missing at C
A --parent--> C      # unlocks the retained child
B --child--> A
```

C accepts the child into its pending store, remains visibly empty, and then
materializes both `A:parent` and `B:child` when the delayed parent arrives.
The child is never redelivered and no snapshot is exchanged. All three peers
must end as `[A:parent, B:child]`.

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

The timer-driven test demonstrates the no-pending normal path; the explicit
A-to-B-to-C route demonstrates automatic pending resolution for causal network
reordering.
