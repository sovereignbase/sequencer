# Final bulk text and warm merge controls

Five fresh processes per build. Same public calls and input as the initial [bulk control](bulk.md). Cold means the first transaction in its process after fixture setup; warm is the process median of 300 subsequent transactions. These are local controls, not external rankings.

| Build     | Cold median ms (IQR) | Warm median ms (IQR of process medians) |
| --------- | -------------------: | --------------------------------------: |
| baseline  |        2.123 (0.069) |                           0.098 (0.004) |
| ack-final |        2.202 (0.124) |                            0.102 (0.01) |

## Warm merge diagnostic

Original merge.insert fixtures, starting scales and 10,000-call measurement cap. Only the untimed warm-up rises from 64 to 10,000 calls, equally for all builds. Five rotated process rounds compare baseline, byte-identical copy and retained runtime. Values are nanoseconds per call.

| Starting Strips | Before ns |   A/A ns | Final ns | Final change | Paired change (IQR pp) | A/A change |
| --------------- | --------: | -------: | -------: | -----------: | ---------------------: | ---------: |
| 100             |  1,871.21 | 1,899.86 | 1,886.01 |       +0.79% |         -2.28% (8.955) |     +1.53% |
| 25000           |  1,926.83 |  2,031.5 | 2,016.33 |       +4.64% |         +2.70% (7.704) |     +5.43% |
