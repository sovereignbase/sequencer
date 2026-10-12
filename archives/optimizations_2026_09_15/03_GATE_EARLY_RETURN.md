# Gate/no-diff position early return

Date: 2026-09-15

Decision: rejected and fully reverted.

## Hypothesis

Return the cached Gate position immediately when:

```text
strip == gate
frame_count_diff == 0
strip_count_diff == 0
```

The immediate answer is already known.

## Result

The removed call also constructs opportunistic jump links. Skipping it saved a
lookup but prevented cache construction needed by later tombstone traversal.

At 300 Strips with the candidate:

| operation     | average µs | maximum µs |
| ------------- | ---------: | ---------: |
| headRemove    |     77.299 |    457.300 |
| tailRemove    |    250.145 |  1,741.500 |
| randomFind    |     10.641 |    121.500 |
| randomRemove  |     42.262 |  1,162.000 |
| randomReplace |     53.542 |  1,047.700 |
| randomInsert  |     30.294 |  1,611.100 |
| randomIngest  |     84.451 |  2,119.100 |

After reverting it, the same 300-Strip workload measured:

```text
tailRemove: 86.343 µs average
randomIngest: 54.772 µs average
complete lifecycle: 2.57 seconds
```

The lookup is redundant only for its return value, not for future navigation
complexity.
