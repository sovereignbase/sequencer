# Delete Range Tombstones (In Progress)

Status: **work in progress.** The source changes below are implemented and the
delete benchmark gain is real and measured, but the unit/e2e tests still assert
the old per-item `deletedIds` wire shape and have not been migrated yet. Do not
treat this as merged/kept until the test migration and the structural follow-up
(below) are done.

## Idea And Rationale

CRList loses the range-delete rows to Yjs by ~8–9x:

| row                              | crlist (node24 baseline) | yjs        |
| -------------------------------- | -----------------------: | ---------: |
| crud / delete / range from head  |              912,925 o/s | ~8,500,000 |
| crud / delete / range from middle|              798,709 o/s | ~7,080,000 |
| crud / delete / range from tail  |              938,897 o/s | ~7,800,000 |
| class / remove / range from head |            1,257,545 o/s | ~9,200,000 |

The original hypothesis was that the cost was per-item tombstone strings:
`deleteBlock` did `(block.id + BigInt(off)).toString()` once per deleted item,
adding to a `Set<string>` and pushing to `delta.deletedIds: string[]`. A
contiguous delete of N items produced N `toString` + N set inserts + N pushes,
where Yjs records a single `(clock, len)` range in its delete-set.

We replaced per-item tombstones with **id ranges**:

- Internal state: `deletedIds: Set<string>` → `deletedRanges: Array<[bigint, bigint]>`
  (sorted, disjoint, non-adjacent, inclusive). Every block owns a contiguous
  disjoint id span, so a contiguous delete collapses to one range. Membership
  (`isDeleted`) is a binary search; recording merges into overlapping/adjacent
  neighbours.
- Wire: `deletedIds: string[]` → `deletedRuns: [string, number][]`
  (`[startIdString, length]`). `deleteBlock` pushes `[block.idString, len]` using
  the **cached** `idString` (no `toString`).
- `__acknowledge` is now O(1) (last range end). `__garbageCollect` trims leading
  ranges. `__snapshot` emits runs; `__create`/`__merge` read runs. Membership in
  `sliceBlockIntoUnseenBlocks`/`createStateBlock`/`trySplice*` uses `isDeleted`
  (drops a per-item `toString` on the merge path too).

### What profiling actually showed

Range tombstones **alone did not move the range-delete numbers** (913K → 923K).
The `toString` hypothesis was wrong. Two things were learned from an
inspector-sampled profile of the delete loop only (build excluded):

1. The first cut of `markDeletedRange` was called **twice per block** (global +
   a local `callDeleted` set for the re-anchor check), each doing a full
   binary-search + `splice` with bigint compares — it added **~20%**.
2. The genuine structural cost is `detachBlockFromIndexes` (**~40%** of the
   delete loop): per-item `blocksById.delete` and the sibling-bucket
   `get`/`indexOf`/`splice` — all on **128-bit bigint keys**. bigint Map
   hashing/equality + the bigint arithmetic (`BigIntAdd`/`LessThan`) + the GC
   from constant bigint allocation are the real tax, not the tombstone strings.

Fixes applied after profiling:

- `markDeletedRange` got an O(1) fast path: sequential deletes always land at or
  after the maximum range, so it just extends or appends the last range without
  the binary search / splice.
- Dropped the redundant `callDeleted` set in `__delete` and `overwrite`. The
  re-anchor check now reads the global `deletedRanges` (which `deleteBlock`
  already updated), halving the per-block `markDeletedRange` calls.

## Files Changed

- new `src/.helpers/deletedRanges/index.ts` — `isDeleted`, `markDeletedRange`
  (with sequential fast path); `DeletedRanges` type in `src/.types/type.ts`.
- `deleteBlock` records one range + pushes one cached-string run.
- `__delete`, `overwrite` — removed local `callDeleted`, use global ranges.
- `__merge` reads `deletedRuns`, applies per id, marks the run once.
- `__snapshot`/`__create` emit/read `deletedRuns`; `__acknowledge` O(1);
  `__garbageCollect` trims ranges; `createStateBlock`/`sliceBlockIntoUnseenBlocks`/
  `trySpliceReplacement`/`trySpliceSiblingParentInsert` use `isDeleted`.
- `CRList` event gating checks `delta.deletedRuns?.length`.

## Before / After Results (node 24, best of 3, items/sec)

| row                               | before (baseline) | after     | yjs        |
| --------------------------------- | ----------------: | --------: | ---------: |
| crud / delete / range from head   |           912,925 | 1,635,965 | ~8,000,000 |
| crud / delete / range from middle |           798,709 | 1,309,278 | ~6,700,000 |
| crud / delete / range from tail   |           938,897 | 1,250,625 | ~7,500,000 |
| class / remove / range from head  |         1,257,545 | 1,725,626 | ~9,400,000 |
| class / remove / range from middle|         1,010,223 | 1,240,110 | ~7,800,000 |
| class / remove / range from tail  |           699,761 | 1,335,363 | ~8,000,000 |

~1.7–1.9x on the range rows. Single-entry delete/remove rows (head/middle/tail)
also improved modestly and crlist already wins them. Still ~5x behind Yjs on the
range rows — the remaining gap is `detachBlockFromIndexes`.

Delete-loop profile attribution (inspector, build excluded):

| function                | before fast-path | after fast-path |
| ----------------------- | ---------------: | --------------: |
| detachBlockFromIndexes  |            30.2% |           39.8% |
| __delete                |            22.4% |           25.3% |
| markDeletedRange        |            20.2% |           15.0% |
| deleteBlock             |            17.0% |            7.6% |

Total samples 3174 → 2103 (~34% faster loop).

## Verification

Not yet green. The wire field rename (`deletedIds` → `deletedRuns`) and the
internal `replica.deletedIds` Set → `deletedRanges` break ~25 test sites in
`test/unit/coverage.test.js`, `test/e2e/shared/suite.mjs`, and the browser
specs, which construct old-shape deltas/snapshots and read `replica.deletedIds`.
These need migration to `deletedRuns` / `deletedRanges` before this can land.

## Open Threads / Next Steps

The remaining ~5x is the bigint-keyed `blocksById` (per-item id→block) churn on
delete. Yjs never removes deleted structs from its store — it keeps them, marked,
and range-encodes the delete-set. The principled mirror:

1. **Lazy `blocksById` on delete** — leave deleted items in `blocksById`,
   shadowed by the tombstone range (now the deletion authority). Requires
   decoupling `replica.size` from `blocksById.size` (≈20 sites set
   `replica.size = replica.blocksById.size`; `getBlockStartIndex` and
   `trySpliceReplacement` use `blocksById.size` as a loop bound) and guarding
   `blocksById.get`/`.has` in merge with `isDeleted`.
2. **Sparse `blocksById` + insert coalescing** — key `blocksById` by block-start
   only and floor-resolve an item id to its block, so a built list is one run and
   a split/delete is O(1) per block instead of O(items). Bigger rewrite of the
   merge lookups.
3. Sibling buckets (`blocksByPreviousBlockId: Map<bigint, Array<block>>`):
   replacing the array with a `Set` does **not** help deletes (buckets are size-1
   there; cost is the bigint Map ops, not the array scan). Only relevant for
   many-concurrent-sibling shapes and would complicate the ordering-dependent
   `sort` in `trySpliceSiblingParentInsert`.
