# single-release-editing: tuple follow-up

5 matched rounds select the production tuple benchmark's replace.random and apply.replace cases. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Only case selection changes in a temporary entry file; fixtures, reset, GC, work, timing and correctness checks remain unchanged. Build order rotates and reverses between rounds. This is a 16-row targeted comparison, not the complete tuple suite.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → direct-create

| Case                                |   Before |    IQR |    After |   IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | ----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1254.29 | 100.64 |  1405.32 | 60.15 |     151.03 |  12.04% |        10.14% |          17.09 |                      |
| tuple/tuple/2/replace.random        |   631.09 |  34.40 |   647.02 | 46.61 |      15.93 |   2.52% |         4.00% |          11.18 |                      |
| tuple/projection/2/apply.replace    |  1664.33 |  57.11 |  1924.83 | 84.37 |     260.50 |  15.65% |        15.81% |           5.52 | yes                  |
| tuple/tuple/2/apply.replace         |  1076.74 |  36.97 |  1069.91 | 18.78 |      -6.82 |  -0.63% |         1.22% |           9.43 |                      |
| tuple/projection/4/replace.random   |  1052.58 | 183.10 |  1160.99 | 54.90 |     108.42 |  10.30% |         5.94% |          14.05 |                      |
| tuple/tuple/4/replace.random        |   632.32 |  17.39 |   607.16 | 51.28 |     -25.16 |  -3.98% |        -0.79% |           8.96 |                      |
| tuple/projection/4/apply.replace    |  2154.98 |  97.51 |  1725.20 | 80.72 |    -429.78 | -19.94% |       -18.76% |           4.99 |                      |
| tuple/tuple/4/apply.replace         |  1002.98 |  66.51 |   973.72 | 31.20 |     -29.26 |  -2.92% |         1.77% |          11.89 |                      |
| tuple/projection/8/replace.random   |  1048.81 |  26.31 |  1189.54 | 26.92 |     140.74 |  13.42% |        13.41% |           5.47 | yes                  |
| tuple/tuple/8/replace.random        |   653.27 |  30.66 |   620.23 | 56.18 |     -33.04 |  -5.06% |        -5.02% |          16.01 |                      |
| tuple/projection/8/apply.replace    |  2370.19 | 226.65 |  1700.25 | 55.65 |    -669.94 | -28.27% |       -31.20% |           7.22 |                      |
| tuple/tuple/8/apply.replace         |   982.00 |  31.47 |   995.24 | 27.96 |      13.24 |   1.35% |         2.67% |           6.54 |                      |
| tuple/projection/100/replace.random |  1312.33 | 264.17 |  1260.99 | 37.12 |     -51.34 |  -3.91% |        -0.72% |          16.58 |                      |
| tuple/tuple/100/replace.random      |   660.75 |  67.37 |   653.62 | 86.58 |      -7.12 |  -1.08% |         1.06% |          12.30 |                      |
| tuple/projection/100/apply.replace  |  3002.68 | 259.48 |  1836.30 | 48.25 |   -1166.38 | -38.84% |       -35.07% |           7.23 |                      |
| tuple/tuple/100/apply.replace       |  1052.95 |  24.25 |  1023.69 | 74.25 |     -29.26 |  -2.78% |         0.25% |          13.29 |                      |
| space/projection/2/allocatedBytes   |   816.00 |   0.00 |   752.00 |  0.00 |     -64.00 |  -7.84% |        -7.84% |           0.00 |                      |
| space/projection/2/msgpackBytes     |    32.00 |   0.00 |    32.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/2/gzipBytes        |    42.00 |   0.00 |    42.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/allocatedBytes        |   808.00 |   0.00 |   792.00 |  0.00 |     -16.00 |  -1.98% |        -1.98% |           0.00 |                      |
| space/tuple/2/msgpackBytes          |    38.00 |   0.00 |    38.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/gzipBytes             |    56.00 |   0.00 |    56.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/allocatedBytes   |  1488.00 |   0.00 |  1432.00 |  0.00 |     -56.00 |  -3.76% |        -3.76% |           0.00 |                      |
| space/projection/4/msgpackBytes     |    64.00 |   0.00 |    64.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/gzipBytes        |    53.00 |   0.00 |    53.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/allocatedBytes        |   984.00 |   0.00 |   968.00 |  0.00 |     -16.00 |  -1.63% |        -1.63% |           0.00 |                      |
| space/tuple/4/msgpackBytes          |    60.00 |   0.00 |    60.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/gzipBytes             |    71.00 |   0.00 |    71.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/allocatedBytes   |  2416.00 |   0.00 |  2328.00 |  0.00 |     -88.00 |  -3.64% |        -3.64% |           0.00 |                      |
| space/projection/8/msgpackBytes     |   124.00 |   0.00 |   124.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/gzipBytes        |    80.00 |   0.00 |    80.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/allocatedBytes        |  1432.00 |   0.00 |  1416.00 |  0.00 |     -16.00 |  -1.12% |        -1.12% |           0.00 |                      |
| space/tuple/8/msgpackBytes          |   104.00 |   0.00 |   104.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/gzipBytes             |    92.00 |   0.00 |    92.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/allocatedBytes | 23080.00 |   0.00 | 21400.00 |  0.00 |   -1680.00 |  -7.28% |        -7.28% |           0.00 |                      |
| space/projection/100/msgpackBytes   |   682.00 |   0.00 |   682.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/gzipBytes      |   586.00 |   0.00 |   586.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/allocatedBytes      | 11624.00 |   0.00 | 11608.00 |  0.00 |     -16.00 |  -0.14% |        -0.14% |           0.00 |                      |
| space/tuple/100/msgpackBytes        |   527.00 |   0.00 |   527.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/gzipBytes           |   356.00 |   0.00 |   356.00 |  0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |

## fixed-table → single-release

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1254.29 | 100.64 |  1385.66 |  59.39 |     131.37 |  10.47% |        11.33% |           3.05 |                      |
| tuple/tuple/2/replace.random        |   631.09 |  34.40 |   618.97 |  46.43 |     -12.12 |  -1.92% |         1.14% |          14.14 |                      |
| tuple/projection/2/apply.replace    |  1664.33 |  57.11 |  1798.78 | 255.29 |     134.45 |   8.08% |         6.72% |          21.64 | yes                  |
| tuple/tuple/2/apply.replace         |  1076.74 |  36.97 |  1105.82 |  21.10 |      29.09 |   2.70% |         2.70% |          12.89 |                      |
| tuple/projection/4/replace.random   |  1052.58 | 183.10 |  1195.69 | 143.01 |     143.11 |  13.60% |        11.21% |          11.13 |                      |
| tuple/tuple/4/replace.random        |   632.32 |  17.39 |   618.72 |  14.09 |     -13.60 |  -2.15% |        -3.39% |           7.49 |                      |
| tuple/projection/4/apply.replace    |  2154.98 |  97.51 |  1575.17 |  38.62 |    -579.81 | -26.91% |       -26.06% |           3.65 |                      |
| tuple/tuple/4/apply.replace         |  1002.98 |  66.51 |  1051.86 | 150.12 |      48.88 |   4.87% |        -2.63% |          10.53 |                      |
| tuple/projection/8/replace.random   |  1048.81 |  26.31 |  1136.07 |  66.07 |      87.26 |   8.32% |         4.65% |           8.57 |                      |
| tuple/tuple/8/replace.random        |   653.27 |  30.66 |   608.17 |  11.68 |     -45.10 |  -6.90% |        -5.47% |          10.22 |                      |
| tuple/projection/8/apply.replace    |  2370.19 | 226.65 |  1618.88 |  75.02 |    -751.31 | -31.70% |       -31.41% |           8.29 |                      |
| tuple/tuple/8/apply.replace         |   982.00 |  31.47 |   990.54 |  71.04 |       8.54 |   0.87% |         2.48% |           3.62 | yes                  |
| tuple/projection/100/replace.random |  1312.33 | 264.17 |  1182.31 |  22.11 |    -130.02 |  -9.91% |       -11.44% |          13.12 |                      |
| tuple/tuple/100/replace.random      |   660.75 |  67.37 |   642.67 |  45.10 |     -18.08 |  -2.74% |        -1.43% |          19.80 |                      |
| tuple/projection/100/apply.replace  |  3002.68 | 259.48 |  1729.23 | 103.75 |   -1273.45 | -42.41% |       -40.23% |           7.75 |                      |
| tuple/tuple/100/apply.replace       |  1052.95 |  24.25 |   971.15 |  53.87 |     -81.81 |  -7.77% |       -11.67% |           8.44 |                      |
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
