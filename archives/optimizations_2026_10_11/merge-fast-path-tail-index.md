# Merge Fast Path: Fix Stale Tail Index (Convergence Bug)

## Bug and Root Cause

`__merge` had a fast path for ordered tail appends
(`!needsRelink && predecessor && !predecessor.next`) that computed
`liveBlock.index` using `getIndexAfterEntryId(crListReplica, liveBlock.predecessor)`:

```typescript
liveBlock.index =
  getIndexAfterEntryId<T>(crListReplica, liveBlock.predecessor) ??
  predecessor.index + predecessor.values.length
```

`getIndexAfterEntryId` returns `entry.index + offset + 1`. This relies on
the predecessor's **stored `.index`**, which is lazily maintained and can be
stale after mid-list insertions that only update the newly inserted entry's
index (not the entries pushed forward).

**Concrete scenario**: Replica A does 250 middle inserts on a 5,000-element
list. The original tail element's stored `.index` stays at 4999 instead of
the correct 5249. Then replica B's ordered tail inserts arrive. Each uses
the fast path and computes `liveBlock.index = 4999 + 1 = 5000` (wrong,
should be 5250). The cursor is set to this block with a wrong `.index`.

**Cascade**: `seekCursorToIndex` initialises its backward walk from
`cursor.index` (stale). The backward walk propagates wrong `blockStart`
values to every block it touches (`cursor.index = blockStart`). Subsequent
cache lookups find blocks with corrupted `.index` values and attempt
`cursor.values[targetIndex - cursor.index]` with an out-of-range offset,
returning `undefined`.

This caused **convergence failure** (`n/a`) for all forked-replica and
collaborative-session benchmarks.

## Fix

Replace the stale predecessor lookup with an always-accurate formula:

```typescript
// parentMap already includes liveBlock (attachEntryToIndexes ran above),
// so tail index = parentMap.size - values.length, regardless of stale
// predecessor.index (which can lag after mid-list inserts on this replica).
liveBlock.index = crListReplica.parentMap.size - liveBlock.values.length
```

Because `attachEntryToIndexes` runs before this branch, `parentMap.size`
already includes `liveBlock`'s elements. The tail block's start index is
always `parentMap.size - values.length`.

**Proof of correctness**: For a single-value tail insert,
`parentMap.size - 1` = (old size) = correct new tail index.
For a multi-value block, `parentMap.size - N` = first element index of
the new tail block. Both cases match what `rebuildLiveProjection` would compute.

## Before Results

All forked-replica and collaborative benchmarks returned `n/a` (convergence failure):

| Benchmark                                           | CRList Before | Yjs Before |
| --------------------------------------------------- | ------------: | ---------: |
| mags / merge / forked replicas rejoin after 250 ops |           n/a |   17.68 ms |
| latency / forked replicas mixed ops then converge   |           n/a |    8.14 ms |
| workload / collaborative offline session            |           n/a |   12.47 ms |

## After Results

| Benchmark                                           | CRList After | Yjs After |
| --------------------------------------------------- | -----------: | --------: |
| mags / merge / forked replicas rejoin after 250 ops |     18.66 ms |  17.68 ms |
| latency / forked replicas mixed ops then converge   |     13.63 ms |   8.14 ms |
| workload / collaborative offline session            |      9.77 ms |  12.47 ms |

`mags/forked`: within noise of Yjs. `workload/collaborative`: CRList wins.
`latency/forked`: still behind (complex concurrent pattern).

## Verification

All 17 unit tests passed. Integration stress suite (12/12) passed.
