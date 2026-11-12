# Isolated Acknowledgement observation

Ten rotated/reversed independent-process rounds per build. Each process warms four times and records ten inner samples; its median is one independent round observation. Public `apply()` takes one Acknowledgement with 1, 8, 64 or 512 Session/frontier pairs. Positive values and zero reports with and without Actor/Session overlap are separate workloads when selected. All final snapshots match across independent processes. Native graph editing, canonical snapshots and production benchmarks remain unchanged. This diagnostic isolates ACK handling; it is not a complete-suite guard.

Nanoseconds per public call, median and IQR. Negative changes are faster.

## control

| Session pairs / mode |   Baseline (IQR) |  Candidate (IQR) | Change | Paired change (IQR) | All ten slower |
| :------------------- | ---------------: | ---------------: | -----: | ------------------: | :------------- |
| 1/positive           |    155.48 (9.27) |   151.43 (10.86) | -2.60% |    -0.26% (4.77 pp) | No             |
| 1/zero-overlap       |    150.56 (7.85) |   152.77 (13.76) |  1.47% |    -0.57% (9.49 pp) | No             |
| 1/zero-absent        |    147.38 (7.49) |    144.08 (2.65) | -2.24% |    -2.48% (5.66 pp) | No             |
| 8/positive           |    322.77 (9.88) |   339.33 (14.64) |  5.13% |     5.10% (8.03 pp) | No             |
| 8/zero-overlap       |   266.80 (18.20) |   276.05 (15.04) |  3.46% |     4.25% (4.70 pp) | No             |
| 8/zero-absent        |    287.30 (9.23) |   291.13 (24.50) |  1.33% |     2.03% (9.74 pp) | No             |
| 64/positive          |  1117.77 (69.24) | 1135.45 (226.59) |  1.58% |    2.78% (13.04 pp) | No             |
| 64/zero-overlap      | 1108.79 (110.60) | 1079.00 (152.65) | -2.69% |     0.58% (2.98 pp) | No             |
| 64/zero-absent       |   818.77 (81.79) |  850.63 (107.22) |  3.89% |    -0.77% (6.95 pp) | No             |
| 512/positive         | 7737.78 (730.42) | 7641.41 (929.22) | -1.25% |    -0.61% (5.13 pp) | No             |
| 512/zero-overlap     | 7847.24 (808.74) | 7919.73 (523.01) |  0.92% |    4.93% (12.46 pp) | No             |
| 512/zero-absent      | 5366.05 (738.80) | 5613.85 (694.99) |  4.62% |    -0.39% (3.14 pp) | No             |

## positive-frontier

| Session pairs / mode |   Baseline (IQR) |   Candidate (IQR) |  Change | Paired change (IQR) | All ten slower |
| :------------------- | ---------------: | ----------------: | ------: | ------------------: | :------------- |
| 1/positive           |    155.48 (9.27) |     147.77 (5.03) |  -4.96% |    -6.19% (9.20 pp) | No             |
| 1/zero-overlap       |    150.56 (7.85) |     151.99 (8.39) |   0.95% |    -0.72% (7.19 pp) | No             |
| 1/zero-absent        |    147.38 (7.49) |     147.84 (3.80) |   0.31% |     0.04% (6.42 pp) | No             |
| 8/positive           |    322.77 (9.88) |    248.03 (14.18) | -23.15% |   -24.10% (4.73 pp) | No             |
| 8/zero-overlap       |   266.80 (18.20) |    272.45 (10.61) |   2.12% |     2.63% (7.37 pp) | No             |
| 8/zero-absent        |    287.30 (9.23) |    295.79 (11.76) |   2.95% |     3.14% (4.84 pp) | No             |
| 64/positive          |  1117.77 (69.24) |    884.58 (74.83) | -20.86% |   -19.11% (7.90 pp) | No             |
| 64/zero-overlap      | 1108.79 (110.60) |   1092.87 (87.67) |  -1.44% |     2.10% (9.40 pp) | No             |
| 64/zero-absent       |   818.77 (81.79) |    798.40 (70.40) |  -2.49% |    -1.58% (5.50 pp) | No             |
| 512/positive         | 7737.78 (730.42) |  5932.41 (729.86) | -23.33% |   -23.55% (4.16 pp) | No             |
| 512/zero-overlap     | 7847.24 (808.74) | 7604.75 (1860.81) |  -3.09% |    0.22% (13.62 pp) | No             |
| 512/zero-absent      | 5366.05 (738.80) | 5378.73 (1234.18) |   0.24% |     0.75% (7.28 pp) | No             |

## frontier-overlap

| Session pairs / mode |   Baseline (IQR) |  Candidate (IQR) |  Change | Paired change (IQR) | All ten slower |
| :------------------- | ---------------: | ---------------: | ------: | ------------------: | :------------- |
| 1/positive           |    155.48 (9.27) |    150.69 (2.99) |  -3.08% |    -1.25% (4.14 pp) | No             |
| 1/zero-overlap       |    150.56 (7.85) |    155.05 (7.49) |   2.98% |     1.52% (4.95 pp) | No             |
| 1/zero-absent        |    147.38 (7.49) |    147.12 (7.64) |  -0.18% |     0.06% (8.53 pp) | No             |
| 8/positive           |    322.77 (9.88) |   244.51 (13.93) | -24.25% |   -22.82% (5.86 pp) | No             |
| 8/zero-overlap       |   266.80 (18.20) |   251.07 (15.28) |  -5.90% |    -4.34% (6.67 pp) | No             |
| 8/zero-absent        |    287.30 (9.23) |   295.87 (25.53) |   2.98% |    7.25% (11.01 pp) | No             |
| 64/positive          |  1117.77 (69.24) |   925.13 (45.17) | -17.23% |   -18.99% (9.34 pp) | No             |
| 64/zero-overlap      | 1108.79 (110.60) |   922.68 (71.06) | -16.78% |   -17.49% (7.87 pp) | No             |
| 64/zero-absent       |   818.77 (81.79) |   838.14 (68.63) |   2.36% |   -1.98% (13.63 pp) | No             |
| 512/positive         | 7737.78 (730.42) | 6285.69 (581.93) | -18.77% |   -22.48% (7.53 pp) | No             |
| 512/zero-overlap     | 7847.24 (808.74) | 6076.18 (925.72) | -22.57% |   -21.89% (6.90 pp) | No             |
| 512/zero-absent      | 5366.05 (738.80) | 5321.93 (647.57) |  -0.82% |   -1.26% (11.55 pp) | No             |
