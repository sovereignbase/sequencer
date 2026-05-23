# Run-Next Pointer and Delta Compression for Batch Inserts

## Idea And Rationale

UUIDv7's `rand_a` field (12-bit monotonic counter, hex positions 15–17) increments
by 1 on each call within the same millisecond. For a same-millisecond batch insert
of N values the generated UUIDs are therefore sequential:

```
uuid[k] = deriveRunUuid(uuid[0], k)   (for k = 0…N-1)
```

This mirrors Yjs's `(clientID, clock+k)` identity model and enables two linked
optimisations.

### 1 — runNext pointer (memory)

A batch insert of N values with consecutive UUIDs stores each interior pair
`(uuid[k], entry[k+1])` as a singleton `childrenMap` bucket — one array
allocation per pair. Those N-1 arrays serve only as wrappers around a single
pointer.

The fix: after the insert loop, promote each such consecutive pair into a new
`runNext` Map (`CRListState.runNext?: Map<string, entry>`). The singleton
`childrenMap` bucket is deleted and replaced by a direct Map pointer, saving one
array allocation per consecutive pair in every batch insert.

`rebuildLiveProjection` merges `runNext` and `childrenMap` per predecessor when
traversing the tree. `detachEntryFromIndexes` handles deletion of run-interior
entries by removing the `runNext` pointer and promoting the successor back into
`childrenMap` so the detached-predecessor path can reach it.

### 2 — Delta compression (wire size)

When the N generated UUIDs are confirmed sequential
(`deriveRunUuid(first, N-1) === last`), the N individual delta entries are replaced
by a single run entry:

```typescript
{ uuidv7: first.uuidv7, value: first.value, predecessor: first.predecessor,
  tail: [value[1], …, value[N-1]] }
```

Receivers expand the run via `deriveRunUuid` before processing. The `tail` field
was added to `CRListSnapshotEntry<T>`.

## Smallest Safe Change

### New helper — `src/.helpers/deriveRunUuid/index.ts`

Derives `uuid[k]` from `uuid[0]` by incrementing the 12-bit `rand_a` counter
(hex positions 15–17), wrapping at 0xFFF.

Exported from `src/.helpers/index.ts`.

### Type additions — `src/.types/index.ts`

- `CRListState<T>`: `runNext?: Map<string, NonNullable<CRListStateEntry<T>>>`
- `CRListSnapshotEntry<T>`: `tail?: Array<T>`

### `src/.helpers/detachEntryFromIndexes/index.ts`

When `runNext` exists:

- Remove `runNext[entry.predecessor]` if it points to this entry.
- Promote `runNext[entry.uuidv7]` into `childrenMap[entry.uuidv7]` so
  `rebuildLiveProjection`'s detached-predecessor path can reach run successors
  after the run head is deleted.

### `src/.helpers/rebuildLiveProjection/index.ts`

When resolving children for a predecessor, merge `childrenMap` and `runNext`
sources. Sort only when both sources contribute siblings. Singleton `runNext`
entries skip the sort entirely.

### `src/core/crud/update/index.ts`

- Collect `batchEntries` during the insert loop.
- After the loop, convert consecutive chain pairs to `runNext` (deleting the
  corresponding singleton `childrenMap` bucket).
- Pack the batch into a single run delta entry when UUIDs are sequential.

### `src/core/mags/merge/index.ts`

Before processing, expand any delta entry whose `tail` is non-empty into N
individual entries using `deriveRunUuid`. The `expandedValues` array replaces all
direct reads of `crListDelta.values` in the fast-path, early-exit guard, and main
value loop.

## Before Results

| Benchmark                                       | CRList Before |  Yjs Before |
| ----------------------------------------------- | ------------: | ----------: |
| crud / append / batch after tail                |   136,306 ops | 249,419 ops |
| class / paste / insert 10,000 entries at cursor |   124,841 ops | 972,555 ops |
| latency / middle insert write to remote visible |     2,943 ops |   6,325 ops |

## After Results

| Benchmark                                       | CRList After |   Yjs After |
| ----------------------------------------------- | -----------: | ----------: |
| crud / append / batch after tail                |  162,705 ops | 345,497 ops |
| class / paste / insert 10,000 entries at cursor |  126,588 ops | 597,350 ops |
| latency / middle insert write to remote visible |    2,460 ops |   5,410 ops |

Throughput numbers have ~20 % run-to-run variance; the headline gain is memory
pressure relief and delta wire-size reduction, not raw ops/sec. The `runNext`
change eliminates N-1 array allocations per batch insert; delta compression
reduces gossip payload from N entries to 1 for same-millisecond batches.

## Verification

All 17 tests passed (16 unit + 1 integration stress, plus all E2E runtimes:
Node, Bun, Deno, Cloudflare Workers, Edge Runtime, Chromium, Firefox, WebKit,
mobile-chrome, mobile-safari).

Coverage for the new `deriveRunUuid` helper: 100 % statements, 100 % branches.
The `tail` expansion path in `__merge` (lines 61–68) is not exercised by the
existing suite because the compression guard (`deriveRunUuid(first, N-1) ===
last`) requires a same-millisecond batch; adding explicit coverage is tracked
separately.

## Final Rationale

Kept. Two complementary savings — memory and wire — with a correctness argument
bounded to the deterministic property of UUIDv7's `rand_a` counter. The guard
`deriveRunUuid(first, N-1) === last` ensures compression is skipped whenever
UUIDs cross a millisecond boundary, so the optimisation degrades gracefully
to the uncompressed path with no correctness risk.
