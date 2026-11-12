# Isolated Acknowledgement observation

Ten rotated/reversed independent-process rounds per build. Each process warms four times and records ten inner samples; its median is one independent round observation. Public `apply()` takes one Acknowledgement with 1, 8, 64 or 512 Session/frontier pairs. Positive values and zero reports with Actor/Session overlap are separate workloads. All 240 final snapshot comparisons match. Native graph editing, canonical snapshots and production benchmarks remain unchanged. This diagnostic isolates ACK handling; it is not a complete-suite guard.

Nanoseconds per public call, median and IQR. Negative changes are faster.

## control

| Session pairs / mode |   Baseline (IQR) |  Candidate (IQR) | Change | Paired change (IQR) | All ten slower |
| :------------------- | ---------------: | ---------------: | -----: | ------------------: | :------------- |
| 1/positive           |    149.40 (5.91) |   150.15 (10.14) |  0.50% |    -2.05% (7.49 pp) | No             |
| 1/zero-overlap       |   151.49 (10.61) |    143.28 (7.93) | -5.42% |    -4.16% (7.70 pp) | No             |
| 8/positive           |   325.30 (21.17) |   318.46 (20.41) | -2.10% |   -1.88% (11.07 pp) | No             |
| 8/zero-overlap       |   261.36 (30.68) |    257.51 (6.67) | -1.47% |    -0.07% (8.48 pp) | No             |
| 64/positive          |  1050.62 (52.29) |  1043.99 (29.48) | -0.63% |    -1.35% (3.50 pp) | No             |
| 64/zero-overlap      | 1051.79 (125.95) |  1043.84 (76.59) | -0.76% |     1.84% (7.95 pp) | No             |
| 512/positive         | 7179.35 (261.22) |  7132.98 (78.04) | -0.65% |     0.08% (2.68 pp) | No             |
| 512/zero-overlap     | 7159.10 (241.74) | 7094.22 (417.82) | -0.91% |    1.27% (11.55 pp) | No             |

## positive-frontier

| Session pairs / mode |   Baseline (IQR) |  Candidate (IQR) |  Change | Paired change (IQR) | All ten slower |
| :------------------- | ---------------: | ---------------: | ------: | ------------------: | :------------- |
| 1/positive           |    149.40 (5.91) |    145.38 (7.25) |  -2.69% |    -3.28% (5.20 pp) | No             |
| 1/zero-overlap       |   151.49 (10.61) |    151.41 (6.25) |  -0.05% |     1.21% (5.09 pp) | No             |
| 8/positive           |   325.30 (21.17) |    239.03 (9.41) | -26.52% |   -25.92% (7.88 pp) | No             |
| 8/zero-overlap       |   261.36 (30.68) |   277.09 (15.41) |   6.02% |     7.16% (8.96 pp) | No             |
| 64/positive          |  1050.62 (52.29) |   855.89 (31.94) | -18.54% |   -18.95% (7.30 pp) | No             |
| 64/zero-overlap      | 1051.79 (125.95) |  1077.74 (27.45) |   2.47% |    1.95% (10.43 pp) | No             |
| 512/positive         | 7179.35 (261.22) | 5461.04 (200.97) | -23.93% |   -24.39% (2.69 pp) | No             |
| 512/zero-overlap     | 7159.10 (241.74) | 7121.88 (362.32) |  -0.52% |     0.52% (7.16 pp) | No             |
