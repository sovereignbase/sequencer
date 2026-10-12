# Rejected Sibling Parent Insert Splice

## Idea And Rationale

Concurrent head overwrite and delete merges often create a sibling-parent shape:

1. the first concurrent replacement inserts a new root parent,
2. the second concurrent replacement inserts another root sibling,
3. the same successor is reparented under the second replacement.

The attempted helper spliced the later sibling parent directly between the
existing sibling parent and the moved child instead of rebuilding the whole
projection.

## Smallest Safe Change

Added `trySpliceSiblingParentInsert()` for the narrow case where:

- no tombstones were newly accepted,
- exactly one new value was accepted,
- exactly one existing value was reparented,
- the inserted sibling sorted immediately after the old parent,
- the old parent had no children,
- the moved child was directly linked after the old parent.

## Before Results

The A/B baseline with the helper disabled measured:

| Benchmark                                                          | CRList Baseline |
| ------------------------------------------------------------------ | --------------: |
| mags / merge / concurrent prepends same head                       |      10.0464 ms |
| mags / merge / concurrent inserts same middle position             |       6.3869 ms |
| mags / merge / concurrent overwrites same head                     |      13.0119 ms |
| mags / merge / concurrent overwrites same middle                   |      10.2371 ms |
| mags / merge / concurrent deletes same head                        |       8.0168 ms |
| mags / merge / concurrent deletes same middle                      |       4.2452 ms |
| mags / merge / concurrent overwrite delete same entry              |       9.7659 ms |
| latency / overwrite head write to remote visible                   |      27.3285 ms |
| latency / head delete to remote hidden                             |     187.3038 ms |
| workload / balanced append prepend insert overwrite delete session |       6.5830 ms |

## After Results

With the helper enabled:

| Benchmark                                                          | CRList With Helper |
| ------------------------------------------------------------------ | -----------------: |
| mags / merge / concurrent prepends same head                       |          5.0657 ms |
| mags / merge / concurrent inserts same middle position             |          4.0387 ms |
| mags / merge / concurrent overwrites same head                     |          5.4317 ms |
| mags / merge / concurrent overwrites same middle                   |          3.1792 ms |
| mags / merge / concurrent deletes same head                        |          1.6013 ms |
| mags / merge / concurrent deletes same middle                      |          3.0776 ms |
| mags / merge / concurrent overwrite delete same entry              |          5.7518 ms |
| latency / overwrite head write to remote visible                   |         35.7868 ms |
| latency / head delete to remote hidden                             |        222.7761 ms |
| workload / balanced append prepend insert overwrite delete session |          4.3368 ms |

## Verification

Targeted tests passed with the helper enabled:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

The change was rejected and reverted.

It improved many synthetic concurrent merge rows, but it made the
consumer-visible head overwrite/delete latency rows slower. The benchmark goal is
the fastest observable consumer experience, so this helper is not the right
tradeoff in its current form.
