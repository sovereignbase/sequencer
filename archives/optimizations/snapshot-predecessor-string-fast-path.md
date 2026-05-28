# Snapshot Predecessor String Fast Path

## Idea And Rationale

`__snapshot` still paid a measurable cost converting each predecessor id with
`toString()`, even after switching snapshot traversal to the live linked list.

Most live snapshot blocks are linear: the current block's predecessor is the
tail id of the previous visible block. When the previous block contains exactly
one value, that predecessor string is already available as `previous.idString`.
Reusing it avoids bigint stringification without storing a redundant
`predecessorString` field on every state entry.

The helper deliberately does not cache predecessor strings in state. The
predecessor can change during merge reparenting, so persistent cached strings
would add another invariant to maintain across split, move, replacement, and
garbage-collection paths.

## Smallest Safe Change

`src/core/mags/snapshot/index.ts` now computes the snapshot predecessor as:

- `"0"` for root entries.
- `previous.idString` only when the block directly follows `previous` and
  `previous.values.length === 1`.
- `block.predecessor.toString()` for every non-linear or multi-value case.

An earlier unconditional "next predecessor" approach was rejected because it
could emit the wrong predecessor for non-linear concurrent shapes. The retained
version keeps the exact fallback for those cases.

## Before Results

Previous local targeted snapshot run from
`archives/optimizations/snapshot-linked-list-walk.md`, after the linked-list
walk and before the predecessor string fast path:

| Benchmark                                       | CRList Before | Yjs Before | json-joy Before | Automerge Before |
| ----------------------------------------------- | ------------: | ---------: | --------------: | ---------------: |
| mags / snapshot                                 |       2.33 ms |    4.16 ms |         8.09 ms |         15.86 ms |
| mags / snapshot / clean state                   |       2.30 ms |    4.26 ms |         9.11 ms |         15.74 ms |
| mags / snapshot / tombstoned state 50% deleted  |       1.21 ms |    1.99 ms |         3.89 ms |         15.22 ms |
| mags / snapshot / tombstoned state 90% deleted  |       0.26 ms |    0.42 ms |         0.67 ms |         15.25 ms |
| mags / snapshot / after garbage collection      |       1.21 ms |    1.95 ms |         3.50 ms |         15.21 ms |
| class / snapshot                                |       2.39 ms |    3.96 ms |         8.16 ms |         15.58 ms |
| class / snapshot / tombstoned state 50% deleted |       1.18 ms |    2.04 ms |         3.78 ms |         15.15 ms |

## After Results

Local targeted run after this change:

Command:

```powershell
node benchmark\bench-snapshot.js
```

| Benchmark                                       | CRList After | Yjs After | json-joy After | Automerge After | Winner    |
| ----------------------------------------------- | -----------: | --------: | -------------: | --------------: | --------- |
| mags / snapshot                                 |      0.35 ms |   6.15 ms |       10.92 ms |        24.01 ms | crlist    |
| mags / snapshot / clean state                   |      0.26 ms |   7.67 ms |       10.94 ms |        25.24 ms | crlist    |
| mags / snapshot / tombstoned state 50% deleted  |      0.21 ms |   3.89 ms |        7.68 ms |        30.54 ms | crlist    |
| mags / snapshot / tombstoned state 90% deleted  |      0.09 ms |   1.00 ms |        1.66 ms |        28.25 ms | crlist    |
| mags / snapshot / after garbage collection      |      0.16 ms |   3.59 ms |        6.78 ms |        25.56 ms | crlist    |
| class / snapshot                                |      0.30 ms |   7.10 ms |       14.98 ms |        24.08 ms | crlist    |
| class / snapshot / tombstoned state 50% deleted |      0.12 ms |   3.01 ms |        5.44 ms |        22.50 ms | crlist    |
| class / snapshot / after garbage collection     |      0.21 ms |   0.42 ms |        3.58 ms |         0.10 ms | automerge |

## Verification

Targeted verification passed after the retained implementation:

- `npx tsc --noEmit`
- `npm run build`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

Kept. The change removes predecessor bigint stringification from the common
linear single-value block path while preserving exact predecessor emission for
multi-value and non-linear merge shapes. It also avoids adding
`predecessorString` as persistent state, keeping the state model smaller and
avoiding cache invalidation during reparenting.
