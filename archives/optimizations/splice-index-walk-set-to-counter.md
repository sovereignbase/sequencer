# Splice Index Walk: Set to Counter

## Idea And Rationale

All three splice helpers (`trySpliceSiblingInsert`, `trySpliceReplacement`,
`trySpliceInsertedParent`) and `rebuildLiveIndex` allocate a `Set<unknown>`
per call solely for cycle detection in their index-update walks. In a
well-formed linked list these Sets never fire; they are pure GC pressure.

Replaced each `Set<unknown>` with an integer counter seeded at
`crListReplica.parentMap.size`. Each iteration decrements the counter; if it
reaches zero the function returns false (same bailout as the original cycle
guard). The counter is a valid upper bound because the total number of blocks
B ≤ total element count = `parentMap.size`.

`trySpliceReplacement` also uses a `Set` for the "reachable count" check (how
many entries are reachable from `next` to the end). Replaced with a `limit`
upper-bound loop; the existing `reachable !== expected` check still catches the
cycle case (reachable would exceed the limit and not match).

## Before Results

| Benchmark                                         | CRList Before | Yjs Before | json-joy Before |
| ------------------------------------------------- | ------------: | ---------: | --------------: |
| mags / merge ordered deltas                       |       0.24 ms |    0.05 ms |         0.01 ms |
| mags / merge / ordered 1,000 prepend deltas       |       0.45 ms |    0.02 ms |         0.02 ms |
| mags / merge / ordered 1,000 middle insert deltas |       0.18 ms |    0.03 ms |         0.02 ms |
| mags / merge / concurrent inserts same middle     |       4.34 ms |    0.06 ms |             n/a |
| class / merge ordered deltas                      |       0.20 ms |    0.02 ms |         0.01 ms |

## After Results

| Benchmark                                         | CRList After | Yjs After | json-joy After |
| ------------------------------------------------- | -----------: | --------: | -------------: |
| mags / merge ordered deltas                       |      0.06 ms |   0.05 ms |        0.01 ms |
| mags / merge / ordered 1,000 prepend deltas       |      0.05 ms |   0.01 ms |        0.01 ms |
| mags / merge / ordered 1,000 middle insert deltas |      0.02 ms |   0.02 ms |        0.02 ms |
| mags / merge / concurrent inserts same middle     |      4.30 ms |   0.06 ms |            n/a |
| class / merge ordered deltas                      |      0.04 ms |   0.02 ms |        0.01 ms |

`merge ordered deltas`: 4x improvement (0.24→0.06 ms), now matches Yjs.
`ordered 1,000 prepend deltas`: 9x improvement (0.45→0.05 ms).
`ordered 1,000 middle insert deltas`: 9x improvement (0.18→0.02 ms).
Concurrent head/middle cases unchanged (they hit rebuildLiveProjection, not the splice helpers).

## Verification

All 17 tests passed.

## Final Rationale

Kept. Correct, minimal, eliminates 4–5 Set allocations per merge call on
the hot path for splice-eligible deltas.
