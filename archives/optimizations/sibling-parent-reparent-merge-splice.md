# Sibling Parent Reparent Merge Splice

## Idea And Rationale

Concurrent head and middle replacement-shaped merges can insert one new sibling
parent and reparent one existing child under it. Before this optimization,
those shapes fell through to `rebuildLiveProjection()`, which sorts and relinks
the whole visible projection even when the local linked-list shape is already
known.

The earlier sibling-parent splice attempt was rejected because it improved
synthetic merge rows but made some consumer-visible latency rows worse. This
retained version is narrower: it only splices when the current linked list
exactly matches the sibling-parent shape that the merge just created.

## Smallest Safe Change

Added `trySpliceSiblingParentInsert()` and called it before the full projection
rebuild fallback.

The helper only handles the guarded case where:

- exactly one new value was inserted,
- exactly one existing value was reparented,
- both affected blocks are single-value blocks,
- the moved block is the only child of the inserted block,
- the inserted block sorts immediately after the previous sibling,
- the moved block is already linked after that previous sibling, and
- the next sibling, when present, is already linked after the moved block.

Any mismatch returns `false` and merge keeps using the deterministic full
projection rebuild.

## Before Results

Previous local disabled-helper A/B baseline from
`archives/optimizations/rejected-sibling-parent-insert-splice.md`:

| Benchmark                                              | CRList Before |
| ------------------------------------------------------ | ------------: |
| mags / merge / concurrent prepends same head           |    10.0464 ms |
| mags / merge / concurrent inserts same middle position |     6.3869 ms |
| mags / merge / concurrent overwrites same head         |    13.0119 ms |
| mags / merge / concurrent overwrites same middle       |    10.2371 ms |
| mags / merge / concurrent deletes same head            |     8.0168 ms |
| mags / merge / concurrent deletes same middle          |     4.2452 ms |
| mags / merge / concurrent overwrite delete same entry  |     9.7659 ms |

## After Results

Local targeted run after this retained narrower helper:

Command:

```powershell
node benchmark\bench-merge.js
```

| Benchmark                                              | CRList After | Yjs After | json-joy After | Automerge After | Winner   |
| ------------------------------------------------------ | -----------: | --------: | -------------: | --------------: | -------- |
| mags / merge / concurrent prepends same head           |      1.51 ms |   0.11 ms |            n/a |        20.68 ms | yjs      |
| mags / merge / concurrent inserts same middle position |      1.73 ms |   0.10 ms |            n/a |        29.85 ms | yjs      |
| mags / merge / concurrent overwrites same head         |      2.45 ms |   0.17 ms |            n/a |        26.89 ms | yjs      |
| mags / merge / concurrent overwrites same middle       |      3.13 ms |   0.09 ms |            n/a |        20.53 ms | yjs      |
| mags / merge / concurrent deletes same head            |      1.68 ms |   0.03 ms |        0.04 ms |        15.09 ms | yjs      |
| mags / merge / concurrent deletes same middle          |      1.01 ms |   0.06 ms |        0.05 ms |        30.53 ms | json-joy |
| mags / merge / concurrent overwrite delete same entry  |      3.81 ms |   0.10 ms |        0.04 ms |         9.23 ms | json-joy |

## Verification

Targeted verification passed after the retained implementation:

- `npx tsc --noEmit`
- `npm run build`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

Kept, but this is only a partial fix. It removes the worst full-rebuild cost
from several sibling-parent reparent shapes and keeps convergence guarded by
falling back on any ambiguous structure. It does not yet close the Yjs gap,
because CRList still reindexes the suffix after the splice and still rebuilds
for several root and concurrent replacement layouts.

A lazy suffix-index attempt was rejected after the convergence stress runner
timed out. The next merge work should either make root sibling splice cases
eligible or introduce a real index-invalidation design rather than partially
skipping suffix index maintenance.
