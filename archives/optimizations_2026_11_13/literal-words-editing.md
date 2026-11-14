# literal-words-editing: tuple follow-up

5 matched rounds select the production tuple benchmark's replace.random and apply.replace cases. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Only case selection changes in a temporary entry file; fixtures, reset, GC, work, timing and correctness checks remain unchanged. Build order rotates and reverses between rounds. This is a 16-row targeted comparison, not the complete tuple suite.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → bounded-release

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1286.22 |  34.48 |  1386.26 | 197.60 |     100.03 |   7.78% |        15.39% |          13.78 |                      |
| tuple/tuple/2/replace.random        |   647.63 |  25.69 |   659.23 |   6.79 |      11.60 |   1.79% |         2.51% |           4.49 |                      |
| tuple/projection/2/apply.replace    |  1747.79 | 148.61 |  1847.06 |  24.06 |      99.27 |   5.68% |         6.21% |           6.95 | yes                  |
| tuple/tuple/2/apply.replace         |  1054.21 |  41.60 |  1079.51 | 119.30 |      25.29 |   2.40% |         2.40% |           8.23 |                      |
| tuple/projection/4/replace.random   |  1064.21 |  68.50 |  1171.78 |  33.72 |     107.57 |  10.11% |         9.69% |           7.25 | yes                  |
| tuple/tuple/4/replace.random        |   595.83 |  25.18 |   609.27 |  56.29 |      13.45 |   2.26% |        -1.53% |           7.02 |                      |
| tuple/projection/4/apply.replace    |  2210.92 |  97.80 |  1624.18 |  11.03 |    -586.74 | -26.54% |       -28.70% |           5.87 |                      |
| tuple/tuple/4/apply.replace         |   982.68 |  15.64 |   986.09 |  64.74 |       3.41 |   0.35% |        -1.51% |           9.13 |                      |
| tuple/projection/8/replace.random   |  1068.07 |  61.03 |  1191.94 |  41.26 |     123.87 |  11.60% |        11.60% |           6.96 |                      |
| tuple/tuple/8/replace.random        |   623.68 |  11.77 |   607.79 |  21.49 |     -15.89 |  -2.55% |        -2.45% |           9.09 |                      |
| tuple/projection/8/apply.replace    |  2386.01 |  35.71 |  1616.49 |  44.96 |    -769.53 | -32.25% |       -32.21% |           7.15 |                      |
| tuple/tuple/8/apply.replace         |   978.54 |  33.24 |  1024.01 | 106.96 |      45.47 |   4.65% |         7.79% |          16.55 |                      |
| tuple/projection/100/replace.random |  1302.41 |  38.65 |  1367.55 | 354.39 |      65.14 |   5.00% |         6.62% |          30.27 |                      |
| tuple/tuple/100/replace.random      |   628.65 |   4.22 |   666.60 |  54.12 |      37.96 |   6.04% |         6.04% |           8.18 |                      |
| tuple/projection/100/apply.replace  |  2954.28 | 616.74 |  1796.31 | 139.92 |   -1157.98 | -39.20% |       -45.81% |           9.45 |                      |
| tuple/tuple/100/apply.replace       |  1038.70 |  86.57 |   982.59 |  51.98 |     -56.10 |  -5.40% |        -4.07% |          10.17 |                      |
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

## fixed-table → literal-words

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1286.22 |  34.48 |  1419.70 |  40.85 |     133.48 |  10.38% |         7.93% |           0.96 | yes                  |
| tuple/tuple/2/replace.random        |   647.63 |  25.69 |   621.46 |  17.84 |     -26.17 |  -4.04% |        -2.53% |           2.74 |                      |
| tuple/projection/2/apply.replace    |  1747.79 | 148.61 |  1919.87 |  34.16 |     172.08 |   9.85% |         9.23% |          15.30 | yes                  |
| tuple/tuple/2/apply.replace         |  1054.21 |  41.60 |  1103.02 |  76.89 |      48.80 |   4.63% |         0.90% |           9.35 |                      |
| tuple/projection/4/replace.random   |  1064.21 |  68.50 |  1162.63 |  72.30 |      98.42 |   9.25% |        12.16% |           5.74 |                      |
| tuple/tuple/4/replace.random        |   595.83 |  25.18 |   600.93 |  17.21 |       5.11 |   0.86% |        -1.12% |           2.48 |                      |
| tuple/projection/4/apply.replace    |  2210.92 |  97.80 |  1619.90 |  86.09 |    -591.02 | -26.73% |       -23.19% |           5.28 |                      |
| tuple/tuple/4/apply.replace         |   982.68 |  15.64 |   993.93 |  57.37 |      11.25 |   1.14% |         2.10% |           9.35 |                      |
| tuple/projection/8/replace.random   |  1068.07 |  61.03 |  1113.99 |  73.99 |      45.92 |   4.30% |         3.68% |           7.16 |                      |
| tuple/tuple/8/replace.random        |   623.68 |  11.77 |   659.68 |  68.64 |      36.01 |   5.77% |        -1.44% |          10.01 |                      |
| tuple/projection/8/apply.replace    |  2386.01 |  35.71 |  1631.12 |  41.55 |    -754.89 | -31.64% |       -31.59% |           4.18 |                      |
| tuple/tuple/8/apply.replace         |   978.54 |  33.24 |   999.05 |  92.98 |      20.51 |   2.10% |         6.35% |          13.24 | yes                  |
| tuple/projection/100/replace.random |  1302.41 |  38.65 |  1284.41 |  84.24 |     -18.00 |  -1.38% |        -0.02% |           7.62 |                      |
| tuple/tuple/100/replace.random      |   628.65 |   4.22 |   600.97 |  41.53 |     -27.67 |  -4.40% |        -5.73% |           7.29 |                      |
| tuple/projection/100/apply.replace  |  2954.28 | 616.74 |  1797.57 | 198.94 |   -1156.72 | -39.15% |       -40.86% |           4.95 |                      |
| tuple/tuple/100/apply.replace       |  1038.70 |  86.57 |  1021.92 | 125.02 |     -16.77 |  -1.61% |         3.07% |          12.12 |                      |
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
