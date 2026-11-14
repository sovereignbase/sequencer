# compact-tuple-followup: tuple follow-up

5 matched rounds select apply.replace and apply.duplicate from the production tuple CLI; fixtures, warmup, measured work and correctness checks are unchanged. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Every burst retains its original correctness checks. Build order rotates and reverses between rounds.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → fixed-control

| Case                                 |   Before |    IQR |    After |    IQR | Difference | Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | -----: | -------: | -----: | ---------: | -----: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1575.60 |  66.94 |  1583.29 | 207.44 |       7.69 |  0.49% |        -0.07% |           2.02 |                      |
| tuple/tuple/2/apply.replace          |  1063.07 |  31.53 |  1103.43 |  85.65 |      40.37 |  3.80% |         0.29% |           7.28 |                      |
| tuple/projection/2/apply.duplicate   |   547.62 |  65.21 |   548.89 |  49.72 |       1.27 |  0.23% |         2.52% |           5.08 |                      |
| tuple/tuple/2/apply.duplicate        |   535.06 |  49.17 |   628.21 |  89.81 |      93.15 | 17.41% |         8.59% |          13.99 |                      |
| tuple/projection/4/apply.replace     |  2446.79 | 281.56 |  2231.83 |  86.80 |    -214.96 | -8.79% |        -8.85% |          13.00 |                      |
| tuple/tuple/4/apply.replace          |  1004.38 |  88.85 |  1018.34 |  34.23 |      13.96 |  1.39% |         2.07% |           9.19 |                      |
| tuple/projection/4/apply.duplicate   |   528.98 |  24.64 |   528.54 |   7.95 |      -0.45 | -0.08% |        -2.95% |           5.81 |                      |
| tuple/tuple/4/apply.duplicate        |   572.18 |  50.40 |   539.10 |  42.58 |     -33.08 | -5.78% |        -7.29% |          24.51 |                      |
| tuple/projection/8/apply.replace     |  2510.66 | 182.35 |  2371.09 | 153.13 |    -139.57 | -5.56% |        -3.12% |           6.04 |                      |
| tuple/tuple/8/apply.replace          |  1000.02 |  46.81 |   999.16 |  57.87 |      -0.86 | -0.09% |        -0.09% |           6.65 |                      |
| tuple/projection/8/apply.duplicate   |   560.74 |  30.13 |   567.66 |  52.99 |       6.92 |  1.23% |        -1.37% |           6.03 |                      |
| tuple/tuple/8/apply.duplicate        |   559.81 |  32.14 |   579.60 |  26.10 |      19.79 |  3.54% |         1.09% |           9.81 |                      |
| tuple/projection/100/apply.replace   |  3081.46 | 175.43 |  3061.90 | 138.18 |     -19.56 | -0.63% |        -0.63% |           2.88 |                      |
| tuple/tuple/100/apply.replace        |   967.18 |  64.67 |   975.99 |  43.16 |       8.81 |  0.91% |        -3.80% |           8.84 |                      |
| tuple/projection/100/apply.duplicate |   571.34 |  41.56 |   594.20 |  16.67 |      22.86 |  4.00% |         5.54% |           8.26 |                      |
| tuple/tuple/100/apply.duplicate      |   547.58 |  37.81 |   574.84 |  17.23 |      27.27 |  4.98% |        -0.22% |           4.95 |                      |
| space/projection/2/allocatedBytes    |   816.00 |   0.00 |   816.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/2/msgpackBytes      |    32.00 |   0.00 |    32.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/2/gzipBytes         |    42.00 |   0.00 |    42.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/allocatedBytes         |   808.00 |   0.00 |   808.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/msgpackBytes           |    38.00 |   0.00 |    38.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/gzipBytes              |    56.00 |   0.00 |    56.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/4/allocatedBytes    |  1488.00 |   0.00 |  1488.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/4/msgpackBytes      |    64.00 |   0.00 |    64.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/4/gzipBytes         |    53.00 |   0.00 |    53.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/allocatedBytes         |   984.00 |   0.00 |   984.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/msgpackBytes           |    60.00 |   0.00 |    60.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/gzipBytes              |    71.00 |   0.00 |    71.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/8/allocatedBytes    |  2416.00 |   0.00 |  2416.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/8/msgpackBytes      |   124.00 |   0.00 |   124.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/8/gzipBytes         |    80.00 |   0.00 |    80.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/allocatedBytes         |  1432.00 |   0.00 |  1432.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/msgpackBytes           |   104.00 |   0.00 |   104.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/gzipBytes              |    92.00 |   0.00 |    92.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/100/allocatedBytes  | 23080.00 |   0.00 | 23080.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/100/msgpackBytes    |   682.00 |   0.00 |   682.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/projection/100/gzipBytes       |   586.00 |   0.00 |   586.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/allocatedBytes       | 11624.00 |   0.00 | 11624.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/msgpackBytes         |   527.00 |   0.00 |   527.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/gzipBytes            |   356.00 |   0.00 |   356.00 |   0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |

## fixed-table → compact-removals

| Case                                 |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1575.60 |  66.94 |  2198.40 | 330.79 |     622.80 |  39.53% |        22.90% |          17.34 | yes                  |
| tuple/tuple/2/apply.replace          |  1063.07 |  31.53 |  1046.10 | 126.11 |     -16.96 |  -1.60% |        -0.40% |           9.13 |                      |
| tuple/projection/2/apply.duplicate   |   547.62 |  65.21 |   536.98 |  68.60 |     -10.64 |  -1.94% |         0.85% |          15.95 |                      |
| tuple/tuple/2/apply.duplicate        |   535.06 |  49.17 |   564.89 |  37.91 |      29.83 |   5.58% |         5.87% |           6.01 |                      |
| tuple/projection/4/apply.replace     |  2446.79 | 281.56 |  1707.64 | 144.20 |    -739.15 | -30.21% |       -19.58% |          15.00 |                      |
| tuple/tuple/4/apply.replace          |  1004.38 |  88.85 |  1028.66 |  11.93 |      24.28 |   2.42% |        -0.40% |           7.90 |                      |
| tuple/projection/4/apply.duplicate   |   528.98 |  24.64 |   536.27 |  12.35 |       7.28 |   1.38% |        -0.64% |           8.58 |                      |
| tuple/tuple/4/apply.duplicate        |   572.18 |  50.40 |   596.87 | 131.22 |      24.68 |   4.31% |         9.34% |          13.16 |                      |
| tuple/projection/8/apply.replace     |  2510.66 | 182.35 |  1687.55 |  49.34 |    -823.11 | -32.78% |       -32.32% |           6.94 |                      |
| tuple/tuple/8/apply.replace          |  1000.02 |  46.81 |  1032.05 |  47.51 |      32.02 |   3.20% |         2.27% |           3.97 |                      |
| tuple/projection/8/apply.duplicate   |   560.74 |  30.13 |   556.45 |  13.32 |      -4.29 |  -0.76% |        -1.60% |           7.87 |                      |
| tuple/tuple/8/apply.duplicate        |   559.81 |  32.14 |   578.76 |  45.11 |      18.94 |   3.38% |         3.45% |           9.17 |                      |
| tuple/projection/100/apply.replace   |  3081.46 | 175.43 |  1944.08 | 352.98 |   -1137.37 | -36.91% |       -31.55% |           9.27 |                      |
| tuple/tuple/100/apply.replace        |   967.18 |  64.67 |   971.41 |  33.25 |       4.23 |   0.44% |        -2.39% |           8.93 |                      |
| tuple/projection/100/apply.duplicate |   571.34 |  41.56 |   574.65 |  35.08 |       3.31 |   0.58% |         1.82% |           3.83 |                      |
| tuple/tuple/100/apply.duplicate      |   547.58 |  37.81 |   563.44 |  28.58 |      15.86 |   2.90% |         1.28% |           7.35 |                      |
| space/projection/2/allocatedBytes    |   816.00 |   0.00 |   752.00 |   0.00 |     -64.00 |  -7.84% |        -7.84% |           0.00 |                      |
| space/projection/2/msgpackBytes      |    32.00 |   0.00 |    32.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/2/gzipBytes         |    42.00 |   0.00 |    42.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/allocatedBytes         |   808.00 |   0.00 |   792.00 |   0.00 |     -16.00 |  -1.98% |        -1.98% |           0.00 |                      |
| space/tuple/2/msgpackBytes           |    38.00 |   0.00 |    38.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/gzipBytes              |    56.00 |   0.00 |    56.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/allocatedBytes    |  1488.00 |   0.00 |  1432.00 |   0.00 |     -56.00 |  -3.76% |        -3.76% |           0.00 |                      |
| space/projection/4/msgpackBytes      |    64.00 |   0.00 |    64.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/gzipBytes         |    53.00 |   0.00 |    53.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/allocatedBytes         |   984.00 |   0.00 |   968.00 |   0.00 |     -16.00 |  -1.63% |        -1.63% |           0.00 |                      |
| space/tuple/4/msgpackBytes           |    60.00 |   0.00 |    60.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/gzipBytes              |    71.00 |   0.00 |    71.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/allocatedBytes    |  2416.00 |   0.00 |  2328.00 |   0.00 |     -88.00 |  -3.64% |        -3.64% |           0.00 |                      |
| space/projection/8/msgpackBytes      |   124.00 |   0.00 |   124.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/gzipBytes         |    80.00 |   0.00 |    80.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/allocatedBytes         |  1432.00 |   0.00 |  1416.00 |   0.00 |     -16.00 |  -1.12% |        -1.12% |           0.00 |                      |
| space/tuple/8/msgpackBytes           |   104.00 |   0.00 |   104.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/gzipBytes              |    92.00 |   0.00 |    92.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/allocatedBytes  | 23080.00 |   0.00 | 21400.00 |   0.00 |   -1680.00 |  -7.28% |        -7.28% |           0.00 |                      |
| space/projection/100/msgpackBytes    |   682.00 |   0.00 |   682.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/gzipBytes       |   586.00 |   0.00 |   586.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/allocatedBytes       | 11624.00 |   0.00 | 11608.00 |   0.00 |     -16.00 |  -0.14% |        -0.14% |           0.00 |                      |
| space/tuple/100/msgpackBytes         |   527.00 |   0.00 |   527.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/gzipBytes            |   356.00 |   0.00 |   356.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
