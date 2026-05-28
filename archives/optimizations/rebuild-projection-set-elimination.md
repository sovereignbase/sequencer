# rebuildLiveProjection: Eliminate Both Sets

## Idea And Rationale

`rebuildLiveProjection` allocated two `Set` objects per call:

1. **`seen: Set<bigint>`** in the reset phase — iterates all N parentMap entries
   (one per element), using the Set to skip the N-1 duplicate entries per block.
2. **`appended: Set<bigint>`** in `appendChildren` — prevents a block from being
   appended twice if it appears in multiple childrenMap buckets.

For a 5,000-element list this means two Set allocations and ~10,000 bigint hash
operations on every call to `rebuildLiveProjection`.

### Replace `seen` with a linked-list walk

The same pattern used in `__snapshot`: walk `cache.get(0) ?? cursor` backward
to head, then forward resetting `prev`/`next`. Newly created entries (from a
concurrent merge) already have `prev = undefined, next = undefined` and are
invisible to the walk. Tombstoned entries are already unlinked and also
invisible. O(B) blocks visited, zero Set overhead.

Note: the walk happens **before** `cache.clear()` and `cursor = undefined` so
that `cache.get(0)` is still valid as the starting anchor.

### Replace `appended` with `sibling === first || sibling.prev !== undefined`

After the reset phase, all existing entries have `prev = undefined`. During
`appendChildren`, `linkEntryBetween(previous, sibling, undefined)` sets
`sibling.prev = previous` for every appended block except the first (which gets
`prev = undefined` because `previous` is undefined at the start). We track the
first appended block as `first`. A block is "already appended" iff:

- `sibling === first` (it's the first block, prev stays undefined), or
- `sibling.prev !== undefined` (any later block has a non-null prev once linked).

This is a constant-time O(1) check per sibling that replaces a Set lookup, with
no allocation.

## Smallest Safe Change

`src/.helpers/rebuildLiveProjection/index.ts`:

- Moved linked-list reset walk before `cursor = undefined` / `cache.clear()`.
- Removed `const seen = new Set<bigint>()` and the parentMap.values() loop.
- Removed `const appended = new Set<bigint>()`.
- Replaced `appended.has(sibling.id)` / `appended.add(sibling.id)` with the
  `sibling === first || sibling.prev !== undefined` check (no add needed).

## Before Results

| Benchmark                                        | CRList Before | Yjs Before |
| ------------------------------------------------ | ------------: | ---------: |
| mags / merge / concurrent prepends same head     |       2.63 ms |    0.07 ms |
| mags / merge / concurrent inserts same middle    |       4.34 ms |    0.06 ms |
| mags / merge / concurrent overwrites same head   |       4.69 ms |    0.07 ms |
| mags / merge / concurrent overwrites same middle |       4.42 ms |    0.05 ms |
| mags / merge / concurrent deletes same head      |       6.33 ms |    0.02 ms |
| mags / merge / concurrent deletes same middle    |       4.24 ms |    0.03 ms |
| mags / merge shuffled gossip                     |       1.83 ms |    0.68 ms |
| class / merge shuffled gossip                    |       1.67 ms |    0.39 ms |

## After Results

| Benchmark                                        | CRList After | Yjs After |
| ------------------------------------------------ | -----------: | --------: |
| mags / merge / concurrent prepends same head     |      1.41 ms |   0.07 ms |
| mags / merge / concurrent inserts same middle    |      1.60 ms |   0.05 ms |
| mags / merge / concurrent overwrites same head   |      1.87 ms |   0.07 ms |
| mags / merge / concurrent overwrites same middle |      1.59 ms |   0.05 ms |
| mags / merge / concurrent deletes same head      |      1.79 ms |   0.02 ms |
| mags / merge / concurrent deletes same middle    |      1.76 ms |   0.03 ms |
| mags / merge shuffled gossip                     |      1.13 ms |   0.68 ms |
| class / merge shuffled gossip                    |      0.87 ms |   0.45 ms |

Concurrent cases: ~2.4–3.5x improvement. Shuffled gossip workloads: ~1.6–1.9x improvement.
CRList still behind Yjs on concurrent cases (Yjs does not maintain per-entry indices).

## Verification

All 17 tests passed.

## Final Rationale

Kept. Two Set allocations and ~10,000 bigint hash operations eliminated per
call to `rebuildLiveProjection`. The `sibling === first || prev !== undefined`
check is sound because: (1) reset phase guarantees all prev=undefined before
rebuild; (2) `first` handles the one ambiguous case (first block, prev stays
undefined after linking); (3) every subsequent block has prev≠undefined
immediately after `linkEntryBetween`.
