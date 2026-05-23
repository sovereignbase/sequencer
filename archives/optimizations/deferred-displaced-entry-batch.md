# Deferred Displaced Entry for Batch Inserts

## Idea And Rationale

For a batch insert of N values at a non-tail position, the entry immediately
after the insertion point (the "displaced entry") had its predecessor pointer
updated on every loop iteration via `moveEntryToPredecessor`. That function
detaches the entry from `parentMap` and `childrenMap`, updates the predecessor
field, then re-attaches it — repeated N times for the same displaced entry.

Only the final predecessor assignment matters for convergence. The N-1
intermediate states are discarded immediately and never observed.

The fix: detect the displaced entry on the first iteration, detach it from
`childrenMap` once, update its predecessor field each iteration (just a field
write, no map operations), then re-attach it to `childrenMap` once after the
loop. `parentMap` is never touched because the UUID never changes.

Also inlined the same pattern in the `overwrite` case to remove the
`moveEntryToPredecessor` import entirely, saving one extra
detach/re-attach per overwrite.

Delta size also shrinks: the displaced entry appears once in `delta.values`
with its final predecessor instead of N times with N intermediate ones.

## Smallest Safe Change

In `src/core/crud/update/index.ts`:

- Removed `moveEntryToPredecessor` import.
- Added `displacedEntry` variable before the loop.
- In `case 'after'`: when `next.predecessor === cursor.uuidv7`, capture the
  displaced entry on first occurrence, splice it from `childrenMap` once, then
  only update its `.predecessor` field on subsequent iterations.
- In `case 'before'`: same for `crListReplica.cursor` before mode switches to
  `'after'`.
- In `case 'overwrite'`: inlined the one-time detach/re-attach using the same
  childrenMap-only approach.
- After the loop: re-attach displaced entry to `childrenMap` and push one
  entry into `delta.values`.

## Before Results

Targeted benchmark before the change:

| Benchmark                                       | CRList Before |  Yjs Before |
| ----------------------------------------------- | ------------: | ----------: |
| crud / insert / batch before tail               |    55,245 ops | 512,143 ops |
| crud / insert / batch before middle             |   163,149 ops | 782,751 ops |
| crud / prepend / batch before head              |   171,874 ops | 553,137 ops |
| crud / append / batch after tail                |   163,414 ops | 302,173 ops |
| class / paste / insert 10,000 entries at cursor |    59,648 ops | 625,766 ops |

## After Results

Targeted benchmark after the change:

| Benchmark                                       | CRList After |    Yjs After |
| ----------------------------------------------- | -----------: | -----------: |
| crud / insert / batch before tail               | ~170,000 ops | ~520,000 ops |
| crud / insert / batch before middle             | ~170,000 ops | ~620,000 ops |
| crud / prepend / batch before head              | ~180,000 ops | ~640,000 ops |
| crud / append / batch after tail                | ~175,000 ops | ~325,000 ops |
| class / paste / insert 10,000 entries at cursor | ~130,000 ops | ~990,000 ops |

`insert / batch before tail` improved ~3x (55k → 170k).
`class / paste` improved ~2x (59k → 130k).

## Verification

All 17 tests passed (unit + integration stress suite).

## Final Rationale

Kept. The optimization is correct: only the final predecessor state is
observable by any merge partner. Intermediate updates were pure waste.
The delta is also smaller, reducing gossip payload size for batch inserts.
