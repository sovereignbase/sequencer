# Tombstone Replacement Merge Splice

## Idea And Rationale

CRList was winning many local CRUD benchmarks but losing combined latency and
workload rows because merge paid for full projection rebuilds in common
replacement-shaped deltas.

The target was the observable consumer path:

1. Actor 1 overwrites or deletes an entry.
2. Actor 2 receives the delta.
3. Actor 2 can immediately read the correct visible list.

The expensive shape was a tombstone-backed replacement:

- one old live identity is tombstoned
- one replacement value is inserted at the same visible position
- optionally one successor is reparented under the replacement

That shape is produced by overwrite, and also by the convergence fix for
deleting a predecessor whose live successor must be re-anchored. It does not
need a full deterministic relink when the predecessor bucket is unambiguous.

## Smallest Safe Change

Added `src/.helpers/trySpliceReplacement/index.ts`.

The helper only splices when all of these are true:

- the delta accepted at least one tombstone
- exactly one new value was inserted
- at most one existing live entry was reparented
- the replacement's predecessor bucket contains only the replacement
- any reparented successor came from a tombstoned predecessor
- the local projection already has the expected predecessor and successor shape

If any guard fails, merge falls back to the existing deterministic full
projection rebuild.

## Before Results

Targeted benchmark before the change:

| Benchmark                                                          | CRList Before |
| ------------------------------------------------------------------ | ------------: |
| mags / merge / overwrite head delta into equal replica             |     5.7919 ms |
| mags / merge / overwrite middle delta into equal replica           |    15.4866 ms |
| mags / merge / overwrite tail delta into equal replica             |     4.5118 ms |
| mags / merge / delete middle delta into equal replica              |    42.1882 ms |
| mags / merge / shuffled 1,000 mixed deltas                         |  2840.3115 ms |
| workload / balanced append prepend insert overwrite delete session |     6.5948 ms |
| workload / collaborative offline session                           |   202.2741 ms |
| workload / sync and cleanup session                                |    55.8470 ms |

## After Results

Targeted benchmark after the change:

| Benchmark                                                          | CRList After |
| ------------------------------------------------------------------ | -----------: |
| mags / merge / overwrite head delta into equal replica             |    5.1413 ms |
| mags / merge / overwrite middle delta into equal replica           |    0.3136 ms |
| mags / merge / overwrite tail delta into equal replica             |    0.0785 ms |
| mags / merge / delete middle delta into equal replica              |    0.1186 ms |
| mags / merge / shuffled 1,000 mixed deltas                         |  964.3156 ms |
| workload / balanced append prepend insert overwrite delete session |    4.7043 ms |
| workload / collaborative offline session                           |   58.0709 ms |
| workload / sync and cleanup session                                |    4.8729 ms |

## Verification

Targeted tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`, so the convergence
invariants still passed for the targeted verification.

## Final Rationale

The change is retained because it improves the targeted workload and merge
latency rows without weakening convergence. The helper is deliberately guarded:
ambiguous concurrent shapes still use the existing deterministic relink path.

The remaining obvious follow-up is head replacement merge. It improved only
slightly because the first version of the helper was intentionally conservative
around root predecessor cursor state.
