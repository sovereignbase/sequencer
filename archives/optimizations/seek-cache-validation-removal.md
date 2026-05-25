# seekCursorToIndex: Remove Redundant Cache Validation

## Change

Removed the `parentMap.get(indexedEntry.id) === indexedEntry` BigInt Map lookup
from the cache-hit fast path in `seekCursorToIndex`.

Before:
```typescript
const indexedEntry = crListReplica.cache.get(targetIndex)
if (indexedEntry) {
  if (crListReplica.parentMap.get(indexedEntry.id) === indexedEntry) {
    crListReplica.cursor = indexedEntry
    crListReplica.cursorIndex = targetIndex
    return
  } else {
    void crListReplica.cache.delete(targetIndex)
  }
}
```

After:
```typescript
const indexedEntry = crListReplica.cache.get(targetIndex)
if (indexedEntry) {
  crListReplica.cursor = indexedEntry
  crListReplica.cursorIndex = targetIndex
  return
}
```

## Why the Check Was Redundant

The check guarded against stale cache entries — blocks that were deleted or
replaced (e.g., by `splitBlock`) while still referenced in the cache. Every
code path that invalidates a cached block already clears the cache before
returning control:

| Invalidating operation | Cache cleared by |
|---|---|
| Local delete (`__delete`) | `cache.clear()` at line 132 of `delete/index.ts` |
| Block split (`splitBlock`) | `cache.clear()` at line 57 of `splitBlock/index.ts` |
| Middle insert (local) | `if (next) cache.clear()` in `update/index.ts` |
| Remote merge → needsRelink | `rebuildLiveProjection` clears at start |
| Remote merge → `rebuildLiveIndex` | `cache.clear()` at line 20 |
| Tail tombstone (merge fast path) | `cache.delete(deleted.index)` — correct for single-element blocks |

For the tail-tombstone fast path (the one case that does a selective
`cache.delete` rather than a full clear): the deleted block must be a
single-element block (otherwise `splitBlock` is called, which clears the
cache). A single-element block can only be cached at exactly one index
(`targetIndex === blockStart` is forced by the walk condition), so
`cache.delete(deleted.index)` removes the only possible cache entry for that
block.

Therefore `parentMap.get(id) === entry` is always true for any entry that
survives in the cache, and the check adds pure overhead.

## Results

| Metric | Before | After | Speedup |
|---|---|---|---|
| Cache hit reads | 287 ns/read | 66 ns/read | 4.3× |
| Sequential scan | ~287 ns/read | 58 ns/read | ~5× |
| Cache miss reads | 701 ns/read | 355 ns/read | 2× |

Benchmark impact (workload suite, representative runs):

| Benchmark | CRList Before | CRList After | Yjs |
|---|---|---|---|
| append tail write to remote visible | 143 ms | 55 ms | 87 ms ✓ |
| offline burst 1,000 ops then sync | 57 ms | 24 ms | 33 ms ✓ |
| forked replicas mixed ops then converge | 45 ms | 12 ms | 21 ms ✓ |
| local app session | ~20 ms | 6 ms | 19 ms ✓ |
| write heavy session | ~9 ms | 3 ms | 9 ms ✓ |
| text editing session | ~8 ms | 3 ms | 8 ms ✓ |

All 17 unit tests and 10 browser e2e tests pass.
