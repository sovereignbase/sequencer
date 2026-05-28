# Computed Index Soft Delete Merge Fast Path

## Idea And Rationale

The dirty worktree was mid-refactor toward computed indexes: entries should no
longer require suffix-wide absolute index rewrites after every insert, delete,
or merge splice.

This round finished the unsafe parts of that refactor:

- `cursorIndex` is treated as the cursor block-start, including tail anchors.
- `head` and `tail` are maintained through splits and deletes.
- remote tombstone merges use `-1` as the change index when an exact visible
  index is not available from a cheap anchor (`head`, `tail`, `cursor`, or
  cache).
- merge splice helpers update only the inserted entry and its immediate moved
  neighbor, not the whole suffix.

That keeps merge work local while preserving convergence. The important
rejection from the earlier retained-tombstone attempt still stands: deleted
entries are not retained as ordering graph nodes, because that version broke
shuffled convergence.

## Correctness Fixes

The first computed-index version had two correctness problems:

1. Tail seek used `size - 1` as `cursorIndex`, but `cursorIndex` is a block-start.
   Multi-value tail blocks could therefore read the wrong element.
2. A fast splice could create a cycle when a new inserted parent had already
   been tail-linked before a following existing entry was split and reparented.
   The splice now transfers the old `moved -> inserted` edge before relinking.

## Own Targeted Before/After

The first two measurements below are from this same optimization round after
the correctness fixes but before the immediate-neighbor index fix. The after
measurements are after removing the stale `moved.index === expectedIndex`
requirement and updating only the immediate moved neighbor.

| Benchmark                                         | Before avg |  After avg | CRList change | Best competitor after | Relative after |
| ------------------------------------------------- | ---------: | ---------: | ------------: | --------------------: | -------------: |
| mags / merge ordered deltas                       |   0.365 ms |   0.020 ms |  94.5% faster |    json-joy ~0.010 ms |   ~2.0x slower |
| mags / merge / ordered 1,000 middle insert deltas |   0.610 ms | ~0.0048 ms |  99.2% faster |   json-joy ~0.0047 ms |   ~2.7% slower |

The stale-index guard was effectively reintroducing absolute-index tracking as
a correctness condition. Once an immediate child had been moved by a previous
splice, its cached `index` could lag even though the linked-list shape was
valid. That forced full projection rebuilds on ordered middle inserts.

## Current Targeted Merge Results

Two after-runs of `node benchmark\bench-merge.js` showed:

- CRList wins the ordered 1,000 append rows.
- CRList wins the ordered 1,000 prepend rows.
- CRList is at parity with json-joy on ordered 1,000 middle inserts and won one
  of the two runs.
- CRList still loses most concurrent same-head and same-middle rows to Yjs or
  json-joy.

Relative to the supplied pre-round full table, the broad merge picture improved
where this refactor targeted local splice work:

- `merge ordered deltas`: 0.07 ms -> ~0.02 ms, about 71% faster.
- `merge / ordered 1,000 middle insert deltas`: 0.06 ms -> ~0.0048 ms, about
  92% faster, now roughly tied with the fastest competitor.
- `merge / concurrent prepends same head`: 1.55 ms -> ~0.74 ms, about 52%
  faster, but still roughly 10x slower than Yjs.
- `merge shuffled gossip`: 1.44 ms -> ~1.00 ms, about 31% faster, still roughly
  1.4x slower than the best run winner.

## Verification

- `npx tsc --noEmit`
- `npm run build`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`
- `node benchmark\bench-merge.js` twice
- `node benchmark\bench-latency.js` twice
- `npm run test`

Full benchmark was intentionally not run because the current full table was
already supplied and the round required targeted benchmark loops.

## Final Rationale

Retained.

The change removes the main local regression from the computed-index refactor:
fast splices no longer depend on stale absolute indexes, and they update only
the immediate neighboring block needed for the next fast path. Correctness
stress and all runtime suites pass.

The remaining merge gap is concurrent same-head/same-middle conflict handling,
where Yjs still wins because its item graph can mark deletes and integrate
conflicting structs without rebuilding a CRList predecessor projection.
