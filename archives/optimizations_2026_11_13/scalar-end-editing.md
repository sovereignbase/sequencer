# scalar-end-editing: tuple follow-up

5 matched rounds select the production tuple benchmark's replace.random and apply.replace cases. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Only case selection changes in a temporary entry file; fixtures, reset, GC, work, timing and correctness checks remain unchanged. Build order rotates and reverses between rounds. This is a 16-row targeted comparison, not the complete tuple suite.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → bounded-release

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1457.07 | 163.72 |  1366.75 |  75.82 |     -90.32 |  -6.20% |        -9.63% |          10.90 |                      |
| tuple/tuple/2/replace.random        |   617.38 |  87.57 |   671.25 |  47.82 |      53.86 |   8.72% |         0.27% |           5.83 |                      |
| tuple/projection/2/apply.replace    |  1841.13 | 205.72 |  1886.07 | 107.38 |      44.93 |   2.44% |         7.94% |           7.31 |                      |
| tuple/tuple/2/apply.replace         |  1073.89 | 155.13 |  1138.84 | 141.40 |      64.96 |   6.05% |         1.72% |           6.60 |                      |
| tuple/projection/4/replace.random   |  1228.08 |  82.60 |  1139.31 | 153.83 |     -88.77 |  -7.23% |        -3.31% |          17.31 |                      |
| tuple/tuple/4/replace.random        |   638.68 |  50.97 |   657.67 |  95.82 |      19.00 |   2.97% |        -1.01% |           5.75 |                      |
| tuple/projection/4/apply.replace    |  2132.94 | 340.78 |  1662.67 | 108.73 |    -470.27 | -22.05% |       -26.47% |           2.93 |                      |
| tuple/tuple/4/apply.replace         |  1029.22 |  59.99 |  1034.88 |  60.31 |       5.66 |   0.55% |        -3.60% |           8.42 |                      |
| tuple/projection/8/replace.random   |  1204.61 | 168.82 |  1170.84 |  49.32 |     -33.77 |  -2.80% |        -2.80% |           7.64 |                      |
| tuple/tuple/8/replace.random        |   773.85 | 204.05 |   614.58 |  25.56 |    -159.27 | -20.58% |       -21.66% |          20.36 |                      |
| tuple/projection/8/apply.replace    |  2499.81 | 204.96 |  1659.43 | 172.63 |    -840.38 | -33.62% |       -29.49% |           7.58 |                      |
| tuple/tuple/8/apply.replace         |  1033.80 | 123.35 |  1060.57 |  58.15 |      26.77 |   2.59% |         2.82% |           7.41 |                      |
| tuple/projection/100/replace.random |  1547.42 | 207.20 |  1295.03 | 156.84 |    -252.39 | -16.31% |       -11.53% |           6.65 |                      |
| tuple/tuple/100/replace.random      |   628.06 |  33.94 |   614.47 | 132.66 |     -13.60 |  -2.16% |        -1.08% |           7.84 |                      |
| tuple/projection/100/apply.replace  |  2947.58 | 189.71 |  1796.56 |  62.28 |   -1151.02 | -39.05% |       -39.92% |           2.70 |                      |
| tuple/tuple/100/apply.replace       |  1047.96 | 142.03 |  1032.42 | 341.42 |     -15.53 |  -1.48% |         3.62% |          15.77 |                      |
| space/projection/2/allocatedBytes   |   816.00 |   0.00 |   752.00 |   0.00 |     -64.00 |  -7.84% |        -7.84% |           0.00 |                      |
| space/projection/2/msgpackBytes     |    32.00 |   0.00 |    32.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/2/gzipBytes        |    42.00 |   0.00 |    42.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/allocatedBytes        |   808.00 |   0.00 |   792.00 |   0.00 |     -16.00 |  -1.98% |        -1.98% |           0.00 |                      |
| space/tuple/2/msgpackBytes          |    38.00 |   0.00 |    38.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/gzipBytes             |    56.00 |   0.00 |    56.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/allocatedBytes   |  1488.00 |   0.00 |  1432.00 |   0.00 |     -56.00 |  -3.76% |        -3.76% |           0.00 |                      |
| space/projection/4/msgpackBytes     |    64.00 |   0.00 |    64.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/gzipBytes        |    53.00 |   0.00 |    53.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/allocatedBytes        |   984.00 |   0.00 |   968.00 |   0.00 |     -16.00 |  -1.63% |        -1.63% |           0.00 |                      |
| space/tuple/4/msgpackBytes          |    60.00 |   0.00 |    60.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/gzipBytes             |    71.00 |   0.00 |    71.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/allocatedBytes   |  2416.00 |   0.00 |  2328.00 |   0.00 |     -88.00 |  -3.64% |        -3.64% |           0.00 |                      |
| space/projection/8/msgpackBytes     |   124.00 |   0.00 |   124.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/gzipBytes        |    80.00 |   0.00 |    80.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/allocatedBytes        |  1432.00 |   0.00 |  1416.00 |   0.00 |     -16.00 |  -1.12% |        -1.12% |           0.00 |                      |
| space/tuple/8/msgpackBytes          |   104.00 |   0.00 |   104.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/gzipBytes             |    92.00 |   0.00 |    92.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/allocatedBytes | 23080.00 |   0.00 | 21400.00 |   0.00 |   -1680.00 |  -7.28% |        -7.28% |           0.00 |                      |
| space/projection/100/msgpackBytes   |   682.00 |   0.00 |   682.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/gzipBytes      |   586.00 |   0.00 |   586.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/allocatedBytes      | 11624.00 |   0.00 | 11608.00 |   0.00 |     -16.00 |  -0.14% |        -0.14% |           0.00 |                      |
| space/tuple/100/msgpackBytes        |   527.00 |   0.00 |   527.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/gzipBytes           |   356.00 |   0.00 |   356.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |

## fixed-table → scalar-end

| Case                                |   Before |    IQR |    After |     IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | ------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1457.07 | 163.72 |  1404.60 |  185.49 |     -52.47 |  -3.60% |        -9.09% |          10.84 |                      |
| tuple/tuple/2/replace.random        |   617.38 |  87.57 |   611.47 |   56.02 |      -5.91 |  -0.96% |        -4.87% |           4.25 |                      |
| tuple/projection/2/apply.replace    |  1841.13 | 205.72 |  1868.20 |  117.95 |      27.06 |   1.47% |         6.54% |          11.84 |                      |
| tuple/tuple/2/apply.replace         |  1073.89 | 155.13 |  1157.76 |   33.50 |      83.87 |   7.81% |         7.59% |           3.35 |                      |
| tuple/projection/4/replace.random   |  1228.08 |  82.60 |  1123.68 |   56.79 |    -104.40 |  -8.50% |        -8.50% |           7.90 |                      |
| tuple/tuple/4/replace.random        |   638.68 |  50.97 |   619.12 |    7.26 |     -19.55 |  -3.06% |        -5.64% |           8.16 |                      |
| tuple/projection/4/apply.replace    |  2132.94 | 340.78 |  1714.64 |  235.27 |    -418.31 | -19.61% |       -26.87% |           9.86 |                      |
| tuple/tuple/4/apply.replace         |  1029.22 |  59.99 |  1018.03 |   19.54 |     -11.19 |  -1.09% |        -1.59% |           5.07 |                      |
| tuple/projection/8/replace.random   |  1204.61 | 168.82 |  1154.69 |  144.38 |     -49.92 |  -4.14% |         0.18% |          23.87 |                      |
| tuple/tuple/8/replace.random        |   773.85 | 204.05 |   612.59 |   41.05 |    -161.26 | -20.84% |       -10.16% |          14.04 |                      |
| tuple/projection/8/apply.replace    |  2499.81 | 204.96 |  1616.59 |   99.24 |    -883.23 | -35.33% |       -33.02% |          13.26 |                      |
| tuple/tuple/8/apply.replace         |  1033.80 | 123.35 |  1047.74 |   37.85 |      13.95 |   1.35% |         2.32% |           6.54 |                      |
| tuple/projection/100/replace.random |  1547.42 | 207.20 |  1239.55 | 1242.53 |    -307.87 | -19.90% |        -8.94% |          80.92 |                      |
| tuple/tuple/100/replace.random      |   628.06 |  33.94 |   615.66 |   10.07 |     -12.41 |  -1.98% |        -1.68% |           0.87 |                      |
| tuple/projection/100/apply.replace  |  2947.58 | 189.71 |  1801.90 |   66.30 |   -1145.68 | -38.87% |       -37.86% |           5.34 |                      |
| tuple/tuple/100/apply.replace       |  1047.96 | 142.03 |   998.14 |  139.17 |     -49.82 |  -4.75% |        -9.37% |          26.31 |                      |
| space/projection/2/allocatedBytes   |   816.00 |   0.00 |   752.00 |    0.00 |     -64.00 |  -7.84% |        -7.84% |           0.00 |                      |
| space/projection/2/msgpackBytes     |    32.00 |   0.00 |    32.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/2/gzipBytes        |    42.00 |   0.00 |    42.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/allocatedBytes        |   808.00 |   0.00 |   792.00 |    0.00 |     -16.00 |  -1.98% |        -1.98% |           0.00 |                      |
| space/tuple/2/msgpackBytes          |    38.00 |   0.00 |    38.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/gzipBytes             |    56.00 |   0.00 |    56.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/allocatedBytes   |  1488.00 |   0.00 |  1432.00 |    0.00 |     -56.00 |  -3.76% |        -3.76% |           0.00 |                      |
| space/projection/4/msgpackBytes     |    64.00 |   0.00 |    64.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/gzipBytes        |    53.00 |   0.00 |    53.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/allocatedBytes        |   984.00 |   0.00 |   968.00 |    0.00 |     -16.00 |  -1.63% |        -1.63% |           0.00 |                      |
| space/tuple/4/msgpackBytes          |    60.00 |   0.00 |    60.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/gzipBytes             |    71.00 |   0.00 |    71.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/allocatedBytes   |  2416.00 |   0.00 |  2328.00 |    0.00 |     -88.00 |  -3.64% |        -3.64% |           0.00 |                      |
| space/projection/8/msgpackBytes     |   124.00 |   0.00 |   124.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/gzipBytes        |    80.00 |   0.00 |    80.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/allocatedBytes        |  1432.00 |   0.00 |  1416.00 |    0.00 |     -16.00 |  -1.12% |        -1.12% |           0.00 |                      |
| space/tuple/8/msgpackBytes          |   104.00 |   0.00 |   104.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/gzipBytes             |    92.00 |   0.00 |    92.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/allocatedBytes | 23080.00 |   0.00 | 21400.00 |    0.00 |   -1680.00 |  -7.28% |        -7.28% |           0.00 |                      |
| space/projection/100/msgpackBytes   |   682.00 |   0.00 |   682.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/gzipBytes      |   586.00 |   0.00 |   586.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/allocatedBytes      | 11624.00 |   0.00 | 11608.00 |    0.00 |     -16.00 |  -0.14% |        -0.14% |           0.00 |                      |
| space/tuple/100/msgpackBytes        |   527.00 |   0.00 |   527.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/gzipBytes           |   356.00 |   0.00 |   356.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
