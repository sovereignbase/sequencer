# Root Replacement Chain Splice

## Idea And Rationale

Head overwrite and head delete deltas are tombstone-backed replacement shapes:

- one or more root/head identities are tombstoned,
- one replacement value is inserted at the root,
- the old successor chain is reparented under the replacement.

CRList already had `trySpliceReplacement()`, but it required the replica cursor
to point at the immediate successor when the replacement predecessor was root.
Equal replicas created from append-heavy setup usually keep the cursor at the
tail, so head replacement deltas fell back to a full deterministic projection
rebuild even when the successor chain was already complete and unambiguous.

The target was consumer-visible head replacement latency without weakening
convergence.

## Smallest Safe Change

For root replacements, `trySpliceReplacement()` now proves that the successor
chain covers every remaining live entry before splicing the replacement root.

The earlier rejected root relaxation only checked `next.prev`. That was not
strong enough and failed convergence stress. This retained version walks the
successor chain and requires:

```text
reachable successor entries === parentMap.size - 1
```

If the chain is incomplete, detached, or ambiguous, merge still falls back to
the existing full projection rebuild.

## Before Results

Targeted benchmark before the change:

| Benchmark                                                    | CRList Before |        Winner Before |
| ------------------------------------------------------------ | ------------: | -------------------: |
| mags / merge / prepend head delta into equal replica         |     0.7573 ms |   json-joy 0.1081 ms |
| mags / merge / overwrite head delta into equal replica       |     7.6440 ms |   json-joy 0.5348 ms |
| mags / merge / delete head delta into equal replica          |     2.1478 ms |   json-joy 0.0947 ms |
| mags / merge / concurrent overwrites same head               |    24.4574 ms |        yjs 0.2417 ms |
| mags / merge / concurrent deletes same head                  |     4.5879 ms |        yjs 0.0965 ms |
| latency / overwrite head write to remote visible             |   232.5027 ms |   json-joy 8.5989 ms |
| latency / head delete to remote hidden                       |   404.0828 ms |      yjs 101.3446 ms |
| latency / out-of-order delete delivery to remote convergence |   315.0152 ms | automerge 56.3039 ms |

## After Results

Targeted benchmark after the retained change:

| Benchmark                                                    | CRList After |         Winner After |
| ------------------------------------------------------------ | -----------: | -------------------: |
| mags / merge / overwrite head delta into equal replica       |    0.9443 ms |   json-joy 0.1750 ms |
| mags / merge / delete head delta into equal replica          |    0.2987 ms |   json-joy 0.0612 ms |
| mags / merge / concurrent overwrites same head               |    7.5177 ms |        yjs 0.4967 ms |
| mags / merge / concurrent deletes same head                  |    6.9094 ms |        yjs 0.1429 ms |
| latency / overwrite head write to remote visible             |   23.0360 ms |  json-joy 15.7708 ms |
| latency / head delete to remote hidden                       |  175.8855 ms |       yjs 93.7958 ms |
| latency / out-of-order delete delivery to remote convergence |  330.2872 ms | automerge 55.9679 ms |

An earlier after pass measured overwrite-head merge at `0.5932 ms`, delete-head
merge at `0.2815 ms`, and overwrite-head remote visibility at `28.0228 ms`.

Concurrent delete-head and out-of-order delete remain unresolved. They did not
benefit from this root replacement splice and need separate work.

## Verification

Targeted tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

Added targeted unit coverage:

- `unit: merge splices root replacement when successor chain is complete`

## Final Rationale

The change is retained.

It replaces a full projection rebuild with a guarded root splice when the
existing successor chain proves the observable list can be repaired locally.
This materially improves the worst single-delta head overwrite/delete merge
rows and the remote-visible overwrite-head latency row while preserving the
full deterministic rebuild for incomplete root chains.
