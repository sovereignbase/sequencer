# Byte words: five matched process rounds

Unmodified numeric API versus the new numeric and binary modes. Each build/mode runs in its own process. Build order rotates and reverses. Positions, payloads and native Session entropy are fixed. All 6,000-edit workloads, checks, warmup and timing limits are identical. Times are medians; paired IQR is in percentage points.

## baseline/numeric → words-final/numeric

| Workload / operation |     Before µs (IQR) |     After µs (IQR) |  Change | Paired change (IQR) |
| -------------------- | ------------------: | -----------------: | ------: | ------------------: |
| append/sequence      |         2.35 (0.46) |        2.86 (1.08) |  21.57% |   28.16% (73.72 pp) |
| append/encode        |        61.57 (5.53) |       56.51 (9.66) |  -8.21% |   -1.02% (20.41 pp) |
| append/decode        |         3.95 (0.49) |        3.70 (0.07) |  -6.34% |   -12.31% (9.67 pp) |
| append/create        |         3.72 (1.53) |        4.39 (0.48) |  17.93% |    1.74% (24.04 pp) |
| append/load          |        12.27 (3.54) |       12.79 (1.51) |   4.23% |   -4.52% (32.97 pp) |
| append/apply         |   10597.52 (285.42) |  10615.30 (783.34) |   0.17% |    0.17% (10.09 pp) |
| append/receive       |  10304.30 (4309.60) |  8564.73 (2361.32) | -16.88% |  -27.70% (57.59 pp) |
| prepend/sequence     |    1001.92 (357.07) |   1046.16 (253.47) |   4.42% |    5.71% (25.93 pp) |
| prepend/encode       |    1021.51 (202.85) |    1084.26 (78.38) |   6.14% |     8.23% (5.57 pp) |
| prepend/decode       |      256.28 (75.95) |     278.90 (69.11) |   8.82% |   -1.31% (44.20 pp) |
| prepend/create       |    1606.65 (272.78) |   1508.51 (130.87) |  -6.11% |   -4.80% (16.74 pp) |
| prepend/load         |    2304.10 (417.18) |     2654.79 (4.07) |  15.22% |    7.39% (20.93 pp) |
| prepend/apply        |    4227.85 (789.30) |   4813.82 (702.43) |  13.86% |   13.86% (36.27 pp) |
| prepend/receive      |  10914.28 (2049.70) | 10234.70 (2768.68) |  -6.23% |    11.76% (4.46 pp) |
| random/sequence      |    2316.98 (741.18) |   2146.46 (536.38) |  -7.36% |    2.49% (28.05 pp) |
| random/encode        |    4122.08 (726.81) |   4325.02 (274.87) |   4.92% |   -5.95% (20.66 pp) |
| random/decode        |   2131.50 (1761.92) |   1752.13 (113.24) | -17.80% |  -17.45% (48.37 pp) |
| random/create        |    3503.62 (155.26) |   3714.04 (291.19) |   6.01% |   -0.87% (27.58 pp) |
| random/load          |   8503.60 (3325.76) |  9179.03 (1359.69) |   7.94% |   22.86% (75.64 pp) |
| random/apply         |  18361.43 (5383.85) | 19882.80 (4002.97) |   8.29% |   15.93% (33.57 pp) |
| random/receive       | 23370.70 (11590.92) | 28995.15 (3581.25) |  24.07% |   -1.95% (55.41 pp) |
| concurrent/sequence  |    2133.81 (758.59) |   1651.24 (207.73) | -22.62% |  -18.09% (37.89 pp) |
| concurrent/encode    |    2887.76 (261.51) |   3020.72 (240.95) |   4.60% |    5.07% (16.54 pp) |
| concurrent/decode    |    1203.93 (136.92) |   1199.16 (122.84) |  -0.40% |    8.08% (26.00 pp) |
| concurrent/create    |    3980.62 (592.29) |    4459.34 (59.74) |  12.03% |   11.67% (14.93 pp) |
| concurrent/load      |   9252.68 (1285.54) |   8358.80 (927.84) |  -9.66% |  -16.88% (42.50 pp) |
| concurrent/apply     |  11897.58 (1472.64) |  13126.43 (667.52) |  10.33% |   10.33% (16.00 pp) |
| concurrent/receive   | 25915.15 (10345.35) | 25608.65 (6591.22) |  -1.18% |  -16.15% (15.22 pp) |

## baseline/numeric → words-final/binary

| Workload / operation |     Before µs (IQR) |     After µs (IQR) |  Change | Paired change (IQR) |
| -------------------- | ------------------: | -----------------: | ------: | ------------------: |
| append/sequence      |         2.35 (0.46) |        2.29 (0.62) |  -2.54% |   16.52% (42.87 pp) |
| append/encode        |        61.57 (5.53) |       60.95 (6.29) |  -1.00% |     1.99% (4.02 pp) |
| append/decode        |         3.95 (0.49) |        5.85 (2.80) |  48.34% |   48.34% (49.94 pp) |
| append/create        |         3.72 (1.53) |        4.05 (0.29) |   8.77% |   -0.29% (14.92 pp) |
| append/load          |        12.27 (3.54) |       12.55 (0.92) |   2.27% |  -13.56% (19.93 pp) |
| append/apply         |   10597.52 (285.42) |   4722.62 (922.65) | -55.44% |  -58.21% (10.88 pp) |
| append/receive       |  10304.30 (4309.60) |  9241.12 (4326.04) | -10.32% |  -17.83% (88.93 pp) |
| prepend/sequence     |    1001.92 (357.07) |     783.50 (42.97) | -21.80% |  -20.69% (48.64 pp) |
| prepend/encode       |    1021.51 (202.85) |       70.49 (6.13) | -93.10% |   -92.98% (1.24 pp) |
| prepend/decode       |      256.28 (75.95) |        4.71 (0.91) | -98.16% |   -98.20% (0.65 pp) |
| prepend/create       |    1606.65 (272.78) |    1595.51 (60.24) |  -0.69% |   -2.07% (53.08 pp) |
| prepend/load         |    2304.10 (417.18) |   1648.58 (528.14) | -28.45% |  -28.64% (15.71 pp) |
| prepend/apply        |    4227.85 (789.30) |   5577.30 (640.08) |  31.92% |   16.67% (30.51 pp) |
| prepend/receive      |  10914.28 (2049.70) | 10685.64 (2990.89) |  -2.09% |     2.31% (9.56 pp) |
| random/sequence      |    2316.98 (741.18) |   1866.50 (351.89) | -19.44% |  -11.27% (29.56 pp) |
| random/encode        |    4122.08 (726.81) |     141.66 (16.24) | -96.56% |   -96.52% (0.12 pp) |
| random/decode        |   2131.50 (1761.92) |        4.27 (0.08) | -99.80% |   -99.80% (0.15 pp) |
| random/create        |    3503.62 (155.26) |   3878.62 (171.25) |  10.70% |   11.47% (13.39 pp) |
| random/load          |   8503.60 (3325.76) |    3847.07 (45.69) | -54.76% |  -48.51% (20.53 pp) |
| random/apply         |  18361.43 (5383.85) | 15846.48 (3080.43) | -13.70% |   -0.84% (37.62 pp) |
| random/receive       | 23370.70 (11590.92) | 19997.27 (2121.23) | -14.43% |  -34.25% (22.12 pp) |
| concurrent/sequence  |    2133.81 (758.59) |    1541.86 (88.16) | -27.74% |  -17.20% (28.26 pp) |
| concurrent/encode    |    2887.76 (261.51) |      140.19 (7.40) | -95.15% |   -95.02% (1.00 pp) |
| concurrent/decode    |    1203.93 (136.92) |        6.10 (0.20) | -99.49% |   -99.55% (0.12 pp) |
| concurrent/create    |    3980.62 (592.29) |   4340.43 (865.41) |   9.04% |    4.92% (23.82 pp) |
| concurrent/load      |   9252.68 (1285.54) |  5206.06 (3285.11) | -43.73% |  -34.52% (69.83 pp) |
| concurrent/apply     |  11897.58 (1472.64) |  10306.60 (109.90) | -13.37% |  -13.02% (29.14 pp) |
| concurrent/receive   | 25915.15 (10345.35) | 17464.00 (7827.43) | -32.61% |  -27.33% (53.50 pp) |

## Encoded size

MessagePack includes Footage. Updates are encoded individually; snapshot gzip uses level nine. Metadata payload counts four bytes per numeric word and actual bytes for binary words, excluding JS object headers.

| Workload   | Mode                | Metadata KiB | Snapshot KiB | Snapshot gzip KiB | Mean update B |
| ---------- | ------------------- | -----------: | -----------: | ----------------: | ------------: |
| append     | baseline/numeric    |         0.07 |         5.90 |              3.61 |         22.88 |
| prepend    | baseline/numeric    |        46.95 |        40.07 |             18.06 |         22.94 |
| random     | baseline/numeric    |       186.68 |       138.05 |             57.31 |         39.88 |
| concurrent | baseline/numeric    |       131.05 |        92.24 |             42.76 |         32.34 |
| append     | words-final/numeric |         0.07 |         5.90 |              3.61 |         22.88 |
| prepend    | words-final/numeric |        46.95 |        40.07 |             18.06 |         22.94 |
| random     | words-final/numeric |       186.68 |       138.05 |             57.31 |         39.88 |
| concurrent | words-final/numeric |       131.05 |        92.24 |             42.76 |         32.34 |
| append     | words-final/binary  |         0.02 |         5.90 |              3.61 |         13.98 |
| prepend    | words-final/binary  |        11.74 |        17.62 |              3.67 |         14.99 |
| random     | words-final/binary  |        48.97 |        54.84 |             36.96 |         29.60 |
| concurrent | words-final/binary  |        35.78 |        42.46 |             28.93 |         23.69 |
