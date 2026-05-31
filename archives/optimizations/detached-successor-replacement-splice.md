# Detached Successor Replacement Splice

## Idea And Rationale

The public class forked-replica benchmark still paid for a full projection
rebuild in a common tail/tail mixed branch shape:

1. one branch appends a successor after a tail item,
2. another branch overwrites that same tail item,
3. the overwrite tombstones the old item and inserts a one-item replacement
   anchored on the old predecessor.

After the tombstone is applied on the receiving replica, the appended successor
is "detached" from a stable predecessor-id point of view, but it is already the
current projection successor of the live predecessor. The deterministic rebuilt
order places the replacement between that predecessor and the successor.

`trySpliceReplacement()` now handles that exact non-root shape without a full
rebuild:

- one tombstone-backed inserted replacement,
- no reparented successor in the delta,
- the inserted replacement is the only sibling under its anchor,
- the live predecessor exists and has exactly one item,
- the predecessor current projection successor is reused as the splice
  successor.

This is still a hard-delete model. Deleted blocks are not retained as ordering
nodes, and snapshot/hydration semantics are unchanged.

## Before Results

Targeted local before runs on current HEAD before this change:

| Benchmark                                         | CRList before avg | Best competitor avg | Relative before |
| ------------------------------------------------- | ----------------: | ------------------: | --------------: |
| class / forked replicas rejoin after 250 ops each |          0.245 ms |        Yjs 0.019 ms |    12.8x slower |
| class / merge shuffled gossip                     |          1.141 ms |        Yjs 0.416 ms |     2.7x slower |
| mags / merge shuffled gossip                      |          1.226 ms |        Yjs 0.427 ms |     2.9x slower |

The delete-latency smoke before this change had CRList at about:

| Benchmark                                    | CRList before avg |
| -------------------------------------------- | ----------------: |
| latency / head delete to remote hidden       |          0.729 ms |
| latency / middle delete to remote hidden     |          0.787 ms |
| latency / delete middle to 10 remotes hidden |          0.788 ms |
| latency / out-of-order delete delivery       |          3.181 ms |
| latency / duplicate shuffled gossip          |          0.657 ms |

## After Results

Targeted local after runs with the retained splice:

| Benchmark                                         | CRList after avg | Best competitor avg | Relative after |
| ------------------------------------------------- | ---------------: | ------------------: | -------------: |
| class / forked replicas rejoin after 250 ops each |         0.026 ms |        Yjs 0.015 ms |    1.7x slower |
| class / merge shuffled gossip                     |         1.106 ms |        Yjs 0.462 ms |    2.4x slower |
| mags / merge shuffled gossip                      |         1.210 ms |        Yjs 0.482 ms |    2.5x slower |

Movement:

- `class / forked replicas rejoin after 250 ops each`: `0.245 ms -> 0.026 ms`,
  about 89.6% faster. The gap to Yjs improved from about `12.8x` slower to
  about `1.7x` slower.
- `class / merge shuffled gossip`: `1.141 ms -> 1.106 ms`, about 3.0% faster.
- `mags / merge shuffled gossip`: effectively unchanged, `1.226 ms -> 1.210 ms`.

Final CRList-only delete-latency smoke after warmup:

| Benchmark                                    | CRList after range |
| -------------------------------------------- | -----------------: |
| latency / head delete to remote hidden       |     0.689-0.863 ms |
| latency / middle delete to remote hidden     |     0.713-0.973 ms |
| latency / delete middle to 10 remotes hidden |     0.716-0.732 ms |
| latency / out-of-order delete delivery       |     2.836-3.442 ms |
| latency / duplicate shuffled gossip          |     0.606-0.658 ms |

## Rejected Variant

An accompanying `deleteItemById(..., resolveIndex = false)` variant was tested
to skip `getBlockStartIndex()` during unobserved merge. It broadened the helper
contract and did not produce a stable targeted win, so it was removed.

## Verification

Targeted verification for the retained shape:

- `npx tsdown`
- targeted before/after benchmark passes for class forked merge, shuffled
  gossip, and delete latency
- unit coverage case for replacement before a detached successor

Full runtime verification is run separately after this archive note.

## Final Rationale

Retained.

The change removes a full rebuild from a frequent forked-tail overwrite shape
without adding deleted-block state or changing transport, snapshot, hydration,
or tombstone semantics. Ordinary delete paths remain hard-delete paths.
