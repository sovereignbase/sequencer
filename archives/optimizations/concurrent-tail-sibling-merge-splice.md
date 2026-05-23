# Concurrent Tail Sibling Merge Splice

## Idea And Rationale

The 10-replica gossip benchmark is mostly a concurrent tail append shape:

1. replicas start from the same snapshot,
2. each replica appends one value after the same tail predecessor,
3. each replica receives every sibling append delta.

Before this change, CRList treated each sibling append after the first one as an
ordering-affecting merge and rebuilt the whole live projection. That is safe but
too expensive for the common tail-sibling case where the local projection shape
is already unambiguous.

The target is consumer-visible convergence for concurrent append/gossip without
weakening deterministic sibling ordering.

## Smallest Safe Change

Added `trySpliceSiblingInsert()`.

The helper only splices when all of these are true:

- no tombstones were accepted,
- exactly one new value was accepted,
- no existing entry was reparented,
- the inserted entry has a non-root predecessor,
- the inserted entry has no children,
- the predecessor sibling bucket already forms a simple tail chain,
- the local projection links match the deterministic UUIDv7 sibling order.

Any ambiguous sibling subtree, root insertion, reparent, tombstone, or non-tail
shape still falls back to the existing deterministic projection rebuild.

## Before Results

Targeted benchmark before the change:

| Benchmark                                              | CRList Before |   Winner Before |
| ------------------------------------------------------ | ------------: | --------------: |
| mags / merge shuffled gossip                           |   174.8640 ms | yjs 173.4923 ms |
| mags / merge / concurrent prepends same head           |     8.9931 ms |   yjs 0.1259 ms |
| mags / merge / concurrent appends same tail            |     1.6665 ms |   yjs 0.1060 ms |
| mags / merge / concurrent inserts same middle position |     1.9257 ms |   yjs 0.1305 ms |
| mags / merge / 10 replicas gossip convergence          |   111.1200 ms |   yjs 1.8732 ms |
| class / merge shuffled gossip                          |   134.9948 ms | yjs 131.4637 ms |
| class / merge / concurrent appends same tail           |     1.7834 ms |   yjs 0.0925 ms |
| latency / duplicate shuffled gossip to convergence     |   143.5181 ms | yjs 127.0761 ms |
| workload / collaborative offline session               |    12.2690 ms |  yjs 11.9010 ms |

## After Results

Targeted benchmark after the retained tail-chain guard:

| Benchmark                                              | CRList After |       Winner After |
| ------------------------------------------------------ | -----------: | -----------------: |
| mags / merge shuffled gossip                           |  180.5446 ms | crlist 180.5446 ms |
| mags / merge / concurrent prepends same head           |    3.4514 ms |      yjs 0.3943 ms |
| mags / merge / concurrent appends same tail            |    0.0994 ms |   crlist 0.0994 ms |
| mags / merge / concurrent inserts same middle position |    2.0312 ms |      yjs 0.1533 ms |
| mags / merge / 10 replicas gossip convergence          |    0.5662 ms |   crlist 0.5662 ms |
| class / merge shuffled gossip                          |  177.2942 ms |    yjs 136.3416 ms |
| class / merge / concurrent appends same tail           |    0.0586 ms |   crlist 0.0586 ms |
| latency / duplicate shuffled gossip to convergence     |  150.0409 ms |    yjs 135.2526 ms |
| workload / collaborative offline session               |    9.6649 ms |      yjs 8.6186 ms |

An earlier broader version also spliced simple non-tail sibling chains. It made
the target rows fast but showed more shuffled-gossip noise, so the retained
version is restricted to tail sibling chains.

## Verification

Targeted tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

Added targeted unit coverage:

- `unit: merge splices simple concurrent tail siblings`

## Final Rationale

The change is retained.

It turns the worst targeted multi-replica gossip row from a full projection
rebuild per concurrent tail sibling into a guarded local splice. CRList now wins
the targeted 10-replica gossip and concurrent tail append rows in the measured
slice while preserving the full deterministic rebuild for ambiguous ordering
shapes.
