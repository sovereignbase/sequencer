# Rejected Soft Delete Retained Tombstone Merge Fast Path

## Idea And Rationale

Yjs keeps deleted items in the struct graph and marks them deleted. Visible
iteration skips deleted structs, so merge can often apply deletes without
rewriting the surrounding ordering graph.

The attempted CRList change tried to model that with `index = -1`:

1. Split the target RLE block to one virtual entry.
2. Unlink that entry from the visible `prev`/`next` projection.
3. Keep it in `parentMap` and `childrenMap` as a retained ordering anchor.
4. Move physical cleanup or deterministic compaction to relink/snapshot.

This was tested both as a broad merge tombstone path and as a narrower
tombstone-only tail path.

## Before Results

Two local targeted runs on the reverted baseline:

| Benchmark                                       | Before 1 | Before 2 | Avg Before | Winner Gap Avg |
| ----------------------------------------------- | -------: | -------: | ---------: | -------------: |
| merge shuffled gossip                           |  0.92 ms |  1.11 ms |    1.02 ms |   1.36x slower |
| merge / concurrent prepends same head           |  0.87 ms |  2.22 ms |    1.55 ms |  20.07x slower |
| merge / concurrent inserts same middle position |  0.96 ms |  0.89 ms |    0.93 ms |  14.92x slower |
| merge / concurrent overwrites same head         |  0.96 ms |  1.60 ms |    1.28 ms |  12.78x slower |
| merge / concurrent deletes same head            |  1.30 ms |  1.20 ms |    1.25 ms |  33.31x slower |
| merge / concurrent overwrite delete same entry  |  1.87 ms |  2.37 ms |    2.12 ms |  43.71x slower |

## After Results

The broad retained-tombstone version failed convergence stress:

- `replicas converge after shuffled async delta delivery`
- `replicas converge across shuffled delivery with restarts`
- `concurrent insert after concurrently deleted predecessor converges`
- `100 aggressive deterministic convergence scenarios`

After restricting soft delete to tombstone-only tail deletes, correctness still
failed stress and the targeted merge result was worse:

| Benchmark                                       |   After | CRList Change |     Winner Gap |
| ----------------------------------------------- | ------: | ------------: | -------------: |
| merge shuffled gossip                           | 2.24 ms | 120.7% slower |   2.73x slower |
| merge / concurrent inserts same middle position | 2.25 ms | 143.2% slower |  28.13x slower |
| merge / concurrent overwrites same head         | 2.56 ms | 100.0% slower |  36.57x slower |
| merge / concurrent deletes same head            | 2.66 ms | 112.8% slower |  78.24x slower |
| merge / concurrent overwrite delete same entry  | 4.66 ms | 119.8% slower | 155.33x slower |

## Verification

The broken broad version failed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

After reverting the source changes, the same targeted correctness check passed:

- `npm run build`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

## Final Rationale

Rejected and reverted.

The current CRList delta model only stores `predecessor`, not Yjs-style
left/right origins. Retaining deleted predecessors in `parentMap` changes how
later deterministic relinks and snapshots order descendants. If snapshot
compacts from the temporary visible linked order, restarts can preserve a
delivery-order-dependent order. If relink treats retained tombstones as graph
nodes, shuffled gossip can diverge.

Soft delete remains plausible, but it needs a larger design:

- Either store enough ordering metadata to emulate Yjs `origin` and
  `rightOrigin`.
- Or change local delete/overwrite delta semantics so retained tombstone
  anchors are part of a formally deterministic compaction model.
- Snapshot compaction must be deterministic from CRDT metadata, not from a
  temporary local visible projection.
