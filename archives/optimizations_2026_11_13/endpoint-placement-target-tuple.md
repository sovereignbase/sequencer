# endpoint-placement-target: tuple follow-up

5 matched rounds select apply.replace and apply.duplicate from the production tuple CLI; fixtures, warmup, measured work and correctness checks are unchanged. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Every burst retains its original correctness checks. Build order rotates and reverses between rounds.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → compact-removals

| Case                                 |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1754.38 | 207.26 |  1970.28 | 313.22 |     215.90 |  12.31% |        19.26% |          30.36 |                      |
| tuple/tuple/2/apply.replace          |  1136.77 | 122.53 |  1130.38 |  29.53 |      -6.40 |  -0.56% |        -0.56% |          16.06 |                      |
| tuple/projection/2/apply.duplicate   |   579.22 |  25.67 |   569.67 |  25.50 |      -9.54 |  -1.65% |        -1.65% |           8.91 |                      |
| tuple/tuple/2/apply.duplicate        |   590.67 |  21.60 |   653.73 |  63.96 |      63.07 |  10.68% |         4.70% |           6.81 |                      |
| tuple/projection/4/apply.replace     |  2357.26 |  32.96 |  1809.37 |  18.94 |    -547.89 | -23.24% |       -23.23% |           2.85 |                      |
| tuple/tuple/4/apply.replace          |  1062.05 |  42.11 |  1093.49 |  91.23 |      31.44 |   2.96% |         2.49% |           2.66 | yes                  |
| tuple/projection/4/apply.duplicate   |   561.65 |   5.63 |   580.56 |  25.91 |      18.91 |   3.37% |         0.95% |           7.23 |                      |
| tuple/tuple/4/apply.duplicate        |   576.61 |  18.83 |   597.52 |  22.06 |      20.91 |   3.63% |         3.63% |           8.66 | yes                  |
| tuple/projection/8/apply.replace     |  2391.64 | 126.18 |  1801.89 | 169.30 |    -589.75 | -24.66% |       -24.97% |           0.56 |                      |
| tuple/tuple/8/apply.replace          |  1042.22 |  20.57 |  1032.82 |  94.51 |      -9.40 |  -0.90% |        -1.78% |           8.06 |                      |
| tuple/projection/8/apply.duplicate   |   568.75 |  36.45 |   563.75 |   3.24 |      -4.99 |  -0.88% |        -0.68% |           2.44 |                      |
| tuple/tuple/8/apply.duplicate        |   597.79 |  25.38 |   583.79 | 115.16 |     -14.01 |  -2.34% |        -2.34% |           1.55 |                      |
| tuple/projection/100/apply.replace   |  3059.85 | 120.13 |  1826.00 |  63.02 |   -1233.86 | -40.32% |       -40.75% |           1.31 |                      |
| tuple/tuple/100/apply.replace        |   964.76 |  18.27 |  1051.07 | 147.80 |      86.31 |   8.95% |        17.64% |          18.58 |                      |
| tuple/projection/100/apply.duplicate |   581.51 |  38.93 |   597.53 |  42.87 |      16.03 |   2.76% |         3.92% |           3.13 |                      |
| tuple/tuple/100/apply.duplicate      |   611.20 | 104.33 |   587.56 |  41.93 |     -23.64 |  -3.87% |        -5.67% |          14.36 |                      |
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

## fixed-table → endpoint-reuse

| Case                                 |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1754.38 | 207.26 |  1720.56 | 291.85 |     -33.82 |  -1.93% |        12.14% |          18.53 |                      |
| tuple/tuple/2/apply.replace          |  1136.77 | 122.53 |  1069.93 |  15.08 |     -66.84 |  -5.88% |        -5.88% |           4.70 |                      |
| tuple/projection/2/apply.duplicate   |   579.22 |  25.67 |   571.28 |  50.52 |      -7.94 |  -1.37% |        -2.57% |           4.78 |                      |
| tuple/tuple/2/apply.duplicate        |   590.67 |  21.60 |   606.95 | 180.87 |      16.28 |   2.76% |        -2.79% |          31.20 |                      |
| tuple/projection/4/apply.replace     |  2357.26 |  32.96 |  1841.45 | 214.47 |    -515.80 | -21.88% |       -22.40% |           6.67 |                      |
| tuple/tuple/4/apply.replace          |  1062.05 |  42.11 |  1052.66 |  86.53 |      -9.39 |  -0.88% |        -2.30% |           6.43 |                      |
| tuple/projection/4/apply.duplicate   |   561.65 |   5.63 |   543.22 |  73.47 |     -18.43 |  -3.28% |         0.78% |           7.05 |                      |
| tuple/tuple/4/apply.duplicate        |   576.61 |  18.83 |   571.41 |  69.71 |      -5.20 |  -0.90% |        -0.90% |           7.78 |                      |
| tuple/projection/8/apply.replace     |  2391.64 | 126.18 |  1809.44 | 203.40 |    -582.20 | -24.34% |       -27.03% |           5.74 |                      |
| tuple/tuple/8/apply.replace          |  1042.22 |  20.57 |   971.32 |  53.75 |     -70.90 |  -6.80% |        -3.84% |           4.07 |                      |
| tuple/projection/8/apply.duplicate   |   568.75 |  36.45 |   560.24 |  43.23 |      -8.51 |  -1.50% |        -0.32% |           1.12 |                      |
| tuple/tuple/8/apply.duplicate        |   597.79 |  25.38 |   580.90 |  57.50 |     -16.90 |  -2.83% |        -2.83% |          12.03 |                      |
| tuple/projection/100/apply.replace   |  3059.85 | 120.13 |  1897.77 | 192.62 |   -1162.08 | -37.98% |       -35.92% |           5.83 |                      |
| tuple/tuple/100/apply.replace        |   964.76 |  18.27 |   950.23 |  32.33 |     -14.53 |  -1.51% |         2.81% |          13.81 |                      |
| tuple/projection/100/apply.duplicate |   581.51 |  38.93 |   598.97 |  55.14 |      17.46 |   3.00% |         2.44% |           9.91 |                      |
| tuple/tuple/100/apply.duplicate      |   611.20 | 104.33 |   611.52 |  32.54 |       0.32 |   0.05% |         0.05% |           5.61 |                      |
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

## fixed-table → conditional-endpoint

| Case                                 |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1754.38 | 207.26 |  1946.59 | 312.04 |     192.21 |  10.96% |        17.02% |           8.42 | yes                  |
| tuple/tuple/2/apply.replace          |  1136.77 | 122.53 |  1127.02 | 114.78 |      -9.75 |  -0.86% |        -4.59% |           7.19 |                      |
| tuple/projection/2/apply.duplicate   |   579.22 |  25.67 |   602.82 |  92.13 |      23.60 |   4.07% |         4.07% |          10.20 |                      |
| tuple/tuple/2/apply.duplicate        |   590.67 |  21.60 |   601.27 |  64.19 |      10.60 |   1.80% |        -2.99% |          10.33 |                      |
| tuple/projection/4/apply.replace     |  2357.26 |  32.96 |  1794.13 |  33.01 |    -563.13 | -23.89% |       -23.25% |           1.19 |                      |
| tuple/tuple/4/apply.replace          |  1062.05 |  42.11 |  1046.41 | 135.36 |     -15.64 |  -1.47% |        -0.16% |          11.85 |                      |
| tuple/projection/4/apply.duplicate   |   561.65 |   5.63 |   583.07 |  31.23 |      21.42 |   3.81% |         3.81% |          21.66 |                      |
| tuple/tuple/4/apply.duplicate        |   576.61 |  18.83 |   610.63 |  53.39 |      34.02 |   5.90% |         5.90% |           4.56 | yes                  |
| tuple/projection/8/apply.replace     |  2391.64 | 126.18 |  1861.87 | 518.64 |    -529.77 | -22.15% |       -21.67% |          27.62 |                      |
| tuple/tuple/8/apply.replace          |  1042.22 |  20.57 |  1040.92 | 158.16 |      -1.30 |  -0.12% |        -1.01% |          19.35 |                      |
| tuple/projection/8/apply.duplicate   |   568.75 |  36.45 |   679.07 | 150.74 |     110.32 |  19.40% |        22.52% |          30.41 |                      |
| tuple/tuple/8/apply.duplicate        |   597.79 |  25.38 |   572.79 |  40.89 |     -25.01 |  -4.18% |        -4.18% |          18.23 |                      |
| tuple/projection/100/apply.replace   |  3059.85 | 120.13 |  1837.17 | 490.75 |   -1222.69 | -39.96% |       -40.39% |          13.34 |                      |
| tuple/tuple/100/apply.replace        |   964.76 |  18.27 |  1093.24 | 154.55 |     128.47 |  13.32% |        12.60% |          34.96 |                      |
| tuple/projection/100/apply.duplicate |   581.51 |  38.93 |   596.10 |  76.87 |      14.59 |   2.51% |         1.92% |           9.37 |                      |
| tuple/tuple/100/apply.duplicate      |   611.20 | 104.33 |   628.25 | 153.28 |      17.04 |   2.79% |         4.53% |          12.17 |                      |
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
