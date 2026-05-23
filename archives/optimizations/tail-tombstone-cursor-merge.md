# Tail Tombstone Cursor Merge

## Idea And Rationale

The collaborative offline workload profile showed one expensive shape:

- right-side tail-heavy operations produced tombstone-only delete deltas
- merging those deltas into another replica repeatedly rebuilt the live index
- in the profiled run, `delete:v0:t1` accounted for most of the merge time

For a single accepted tail tombstone, if the deleted entry was also the current
cursor, the projection links are already correct after `deleteLiveEntry`. The
only required repair is moving the cursor index to the new tail.

## Smallest Safe Change

`src/core/mags/merge/index.ts` now skips `rebuildLiveIndex` for this narrow
case:

- exactly one tombstone was accepted
- the deleted entry was the live tail
- the deleted entry was the current cursor
- the delta had no accepted values

All other tombstone-only deletes still use the existing index rebuild path.

## Before Results

Targeted benchmark before the change:

| Benchmark                                             | CRList Before |
| ----------------------------------------------------- | ------------: |
| mags / merge / delete middle delta into equal replica |     0.5372 ms |
| mags / merge / delete tail delta into equal replica   |     6.5252 ms |
| workload / collaborative offline session              |    97.3020 ms |
| workload / sync and cleanup session                   |     3.9860 ms |

## After Results

Targeted benchmark after the retained narrow change:

| Benchmark                                           | CRList After |
| --------------------------------------------------- | -----------: |
| mags / merge / delete tail delta into equal replica |    7.0151 ms |
| workload / collaborative offline session            |   85.6652 ms |
| workload / sync and cleanup session                 |    4.4112 ms |

An earlier immediate run showed stronger improvement:

| Benchmark                                             | CRList After |
| ----------------------------------------------------- | -----------: |
| mags / merge / delete middle delta into equal replica |    0.6576 ms |
| mags / merge / delete tail delta into equal replica   |    5.0308 ms |
| workload / collaborative offline session              |   75.0257 ms |
| workload / sync and cleanup session                   |    3.7600 ms |

## Rejected Variant

A broader variant skipped the rebuild for any single tail tombstone even when
the deleted entry was not the cursor.

That variant was reverted because it regressed the collaborative workload:

| Benchmark                                           | CRList With Rejected Variant |
| --------------------------------------------------- | ---------------------------: |
| mags / merge / delete tail delta into equal replica |                    6.0855 ms |
| workload / collaborative offline session            |                  124.0142 ms |
| workload / sync and cleanup session                 |                    4.6249 ms |

## Verification

Targeted tests passed after the retained change:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

The narrow cursor-tail path is retained because it improved the targeted
collaborative workload in the before/after run and preserves the existing
deterministic repair path for all ambiguous tail deletes.

The broader non-cursor tail path was rejected because it regressed the
consumer-visible collaborative workload.
