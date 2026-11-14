# first-visible-editing: tuple follow-up

5 matched rounds select the production tuple benchmark's replace.random and apply.replace cases. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Only case selection changes in a temporary entry file; fixtures, reset, GC, work, timing and correctness checks remain unchanged. Build order rotates and reverses between rounds. This is a 16-row targeted comparison, not the complete tuple suite.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → bounded-release

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1267.27 |  56.86 |  1412.47 | 381.21 |     145.20 |  11.46% |        11.91% |          39.78 |                      |
| tuple/tuple/2/replace.random        |   658.58 |  15.84 |   635.46 |  16.81 |     -23.12 |  -3.51% |        -1.81% |           1.80 |                      |
| tuple/projection/2/apply.replace    |  1617.75 |  83.31 |  1891.95 | 124.02 |     274.20 |  16.95% |        13.89% |           6.48 |                      |
| tuple/tuple/2/apply.replace         |  1095.12 |  96.88 |  1091.33 |  36.43 |      -3.79 |  -0.35% |        -6.55% |           8.27 |                      |
| tuple/projection/4/replace.random   |  1071.18 |  91.52 |  1129.75 | 175.08 |      58.57 |   5.47% |         2.83% |           8.22 |                      |
| tuple/tuple/4/replace.random        |   617.72 |  19.91 |   626.98 |  45.48 |       9.27 |   1.50% |         1.27% |           4.11 |                      |
| tuple/projection/4/apply.replace    |  2239.18 | 158.78 |  1602.68 |  54.53 |    -636.50 | -28.43% |       -29.05% |          10.16 |                      |
| tuple/tuple/4/apply.replace         |  1074.09 | 137.53 |   987.56 |  57.23 |     -86.53 |  -8.06% |        -3.07% |          17.41 |                      |
| tuple/projection/8/replace.random   |  1194.97 |  40.21 |  1120.75 |  19.67 |     -74.22 |  -6.21% |        -4.64% |           3.04 |                      |
| tuple/tuple/8/replace.random        |   643.41 |  71.85 |   631.91 |  74.91 |     -11.50 |  -1.79% |         0.01% |           3.80 |                      |
| tuple/projection/8/apply.replace    |  2327.71 | 300.52 |  1625.96 |  74.36 |    -701.74 | -30.15% |       -31.37% |           5.19 |                      |
| tuple/tuple/8/apply.replace         |  1060.11 | 184.90 |  1093.83 | 130.84 |      33.73 |   3.18% |        -1.45% |           1.55 |                      |
| tuple/projection/100/replace.random |  1555.21 | 317.98 |  1285.96 |  96.08 |    -269.26 | -17.31% |       -10.80% |          22.66 |                      |
| tuple/tuple/100/replace.random      |   623.26 | 109.18 |   624.71 |  29.99 |       1.45 |   0.23% |         1.33% |           4.68 |                      |
| tuple/projection/100/apply.replace  |  2944.75 | 302.47 |  1798.91 |  50.23 |   -1145.84 | -38.91% |       -40.06% |          10.94 |                      |
| tuple/tuple/100/apply.replace       |  1209.24 | 247.27 |   956.93 |  95.41 |    -252.31 | -20.87% |       -15.15% |          21.26 |                      |
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

## fixed-table → first-visible

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1267.27 |  56.86 |  1293.88 |  74.54 |      26.61 |   2.10% |         2.18% |           4.51 |                      |
| tuple/tuple/2/replace.random        |   658.58 |  15.84 |   663.64 |  38.04 |       5.06 |   0.77% |         0.62% |           3.43 |                      |
| tuple/projection/2/apply.replace    |  1617.75 |  83.31 |  1913.09 | 163.21 |     295.34 |  18.26% |        13.21% |           6.93 | yes                  |
| tuple/tuple/2/apply.replace         |  1095.12 |  96.88 |  1061.09 |  49.08 |     -34.03 |  -3.11% |         0.44% |          16.94 |                      |
| tuple/projection/4/replace.random   |  1071.18 |  91.52 |  1183.77 | 140.02 |     112.59 |  10.51% |         2.92% |          15.78 |                      |
| tuple/tuple/4/replace.random        |   617.72 |  19.91 |   614.10 |   1.93 |      -3.62 |  -0.59% |        -0.59% |           5.74 |                      |
| tuple/projection/4/apply.replace    |  2239.18 | 158.78 |  1633.28 |  98.10 |    -605.90 | -27.06% |       -25.67% |           8.46 |                      |
| tuple/tuple/4/apply.replace         |  1074.09 | 137.53 |   980.94 |  18.03 |     -93.15 |  -8.67% |        -7.33% |           9.40 |                      |
| tuple/projection/8/replace.random   |  1194.97 |  40.21 |  1089.20 |  61.58 |    -105.77 |  -8.85% |        -8.85% |          12.35 |                      |
| tuple/tuple/8/replace.random        |   643.41 |  71.85 |   644.65 |  56.06 |       1.24 |   0.19% |        -4.43% |           8.08 |                      |
| tuple/projection/8/apply.replace    |  2327.71 | 300.52 |  1628.98 | 129.71 |    -698.73 | -30.02% |       -32.01% |           8.35 |                      |
| tuple/tuple/8/apply.replace         |  1060.11 | 184.90 |   958.33 |  75.92 |    -101.78 |  -9.60% |       -10.02% |          10.67 |                      |
| tuple/projection/100/replace.random |  1555.21 | 317.98 |  1153.67 |  69.72 |    -401.54 | -25.82% |       -30.62% |          14.00 |                      |
| tuple/tuple/100/replace.random      |   623.26 | 109.18 |   621.62 |   9.20 |      -1.64 |  -0.26% |        -0.39% |          16.67 |                      |
| tuple/projection/100/apply.replace  |  2944.75 | 302.47 |  1745.03 |  42.79 |   -1199.72 | -40.74% |       -39.71% |           3.00 |                      |
| tuple/tuple/100/apply.replace       |  1209.24 | 247.27 |   948.96 |  45.12 |    -260.29 | -21.52% |       -23.16% |          23.35 |                      |
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
