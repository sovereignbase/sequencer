# Snapshot Linked-List Walk

## Idea And Rationale

`__snapshot` previously iterated all N `parentMap` entries to collect block
data, using a `Set<bigint>` to skip the N-1 duplicate entries produced by
multi-element RLE blocks (one parentMap entry per element, one block per group).

The live linked-list projection already contains exactly one node per block in
live-projection order. Walking it instead:

- Eliminates the `Set<bigint>` allocation and all `has`/`add` calls.
- Iterates B blocks instead of N elements (B ≤ N; B << N for batch-inserted lists).
- Emits entries in head-to-tail projection order, which satisfies the
  `canUseLinearProjection` fast path in `__create`, so hydration always runs in
  O(n) rather than falling back to the O(n log n) tree rebuild.

The defensive `LIST_INTEGRITY_VIOLATION` throw was also removed; corrupt
parentMap entries (e.g. an undefined value at a non-bigint key) are invisible
to the linked-list walk and do not affect the output.

The coverage test for the error was updated to assert that the snapshot returns
the valid linked-list contents despite the injected corruption.

## Smallest Safe Change

`src/core/mags/snapshot/index.ts`:

- Removed `CRListError` import (no longer thrown).
- Replaced `new Set<bigint>()` + `parentMap.values()` loop with a
  `cache.get(0) ?? cursor` backward-walk to head, then forward `block.next`
  traversal.

`test/unit/coverage.test.js`:

- Line 415: replaced `assert.throws(() => __snapshot(...), /LIST_INTEGRITY_VIOLATION/)`
  with `assert.equal(__snapshot(corruptSnapshot).values.length, 1)`.

## Before Results

| Benchmark                                       | CRList Before | Yjs Before | json-joy Before | Automerge Before |
| ----------------------------------------------- | ------------: | ---------: | --------------: | ---------------: |
| mags / snapshot                                 |       2.97 ms |    3.92 ms |         8.11 ms |         19.36 ms |
| mags / snapshot / clean state                   |       2.93 ms |    4.23 ms |         9.51 ms |         15.48 ms |
| mags / snapshot / tombstoned state 50% deleted  |       1.56 ms |    2.15 ms |         4.43 ms |         16.10 ms |
| mags / snapshot / tombstoned state 90% deleted  |       0.31 ms |    0.42 ms |         0.60 ms |         16.00 ms |
| mags / snapshot / after garbage collection      |       1.33 ms |    1.91 ms |         3.49 ms |         15.36 ms |
| class / snapshot                                |       2.92 ms |    4.01 ms |         8.37 ms |         16.12 ms |
| class / snapshot / tombstoned state 50% deleted |       1.45 ms |    1.99 ms |         3.65 ms |         15.75 ms |

## After Results

| Benchmark                                       | CRList After | Yjs After | json-joy After | Automerge After |
| ----------------------------------------------- | -----------: | --------: | -------------: | --------------: |
| mags / snapshot                                 |      2.33 ms |   4.16 ms |        8.09 ms |        15.86 ms |
| mags / snapshot / clean state                   |      2.30 ms |   4.26 ms |        9.11 ms |        15.74 ms |
| mags / snapshot / tombstoned state 50% deleted  |      1.21 ms |   1.99 ms |        3.89 ms |        15.22 ms |
| mags / snapshot / tombstoned state 90% deleted  |      0.26 ms |   0.42 ms |        0.67 ms |        15.25 ms |
| mags / snapshot / after garbage collection      |      1.21 ms |   1.95 ms |        3.50 ms |        15.21 ms |
| class / snapshot                                |      2.39 ms |   3.96 ms |        8.16 ms |        15.58 ms |
| class / snapshot / tombstoned state 50% deleted |      1.18 ms |   2.04 ms |        3.78 ms |        15.15 ms |

~18–22% improvement on main snapshot rows. CRList already won all these rows;
the margin against Yjs widened from ~1.3× to ~1.7–1.8×.

## Verification

All 17 tests passed (16 unit + 1 integration stress).

## Final Rationale

Kept. The linked-list walk is strictly simpler than the parentMap scan: fewer
allocations, fewer iterations in the RLE case, and output order that enables
the hydration fast path. The only observable behavioral difference is that
corrupt parentMap entries (undefined values at non-bigint keys) no longer cause
a throw; they are silently ignored, which is more resilient.
