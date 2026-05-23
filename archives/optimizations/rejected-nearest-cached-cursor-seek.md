# Rejected Nearest Cached Cursor Seek

## Idea And Rationale

CRList wins many individual local operations but still loses some mixed workload
and latency rows. One suspected cause was cursor seeking after mutations reset
the opportunistic index cache.

The attempted change made `seekCursorToIndex` scan cached index entries and walk
from the closest valid cached entry instead of always walking from the current
cursor when the exact target index was not cached.

The guard only used cached entries when:

- the entry was still present in `parentMap`
- the entry's stored `index` matched the cache key

## Before Results

Targeted benchmark before the change:

| Benchmark                                                          | CRList Before |
| ------------------------------------------------------------------ | ------------: |
| crud / read / random indexed reads                                 |     0.4466 ms |
| crud / read / sequential indexed reads from head                   |     0.2587 ms |
| crud / read / sequential indexed reads from middle                 |     0.1459 ms |
| crud / read / sequential indexed reads from tail                   |     0.0735 ms |
| workload / local app session                                       |     6.4571 ms |
| workload / read heavy session                                      |     0.1424 ms |
| workload / balanced append prepend insert overwrite delete session |     8.6164 ms |
| workload / random edit session                                     |    19.7892 ms |

## After Results

Targeted benchmark after the attempted change:

| Benchmark                                                          | CRList After |
| ------------------------------------------------------------------ | -----------: |
| crud / read / random indexed reads                                 |    0.3432 ms |
| crud / read / sequential indexed reads from head                   |    0.2212 ms |
| crud / read / sequential indexed reads from middle                 |    0.1432 ms |
| crud / read / sequential indexed reads from tail                   |    0.1158 ms |
| workload / local app session                                       |   14.5785 ms |
| workload / read heavy session                                      |    0.2461 ms |
| workload / balanced append prepend insert overwrite delete session |   15.6931 ms |
| workload / random edit session                                     |   11.9753 ms |

## Verification

Targeted tests passed:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

The change was reverted.

It improved random-edit workload and random indexed reads, but it regressed
read-heavy, local app, balanced workload, and sequential tail reads. Since the
optimization goal is consumer-visible workload latency rather than one isolated
read case, this tradeoff was not acceptable.
