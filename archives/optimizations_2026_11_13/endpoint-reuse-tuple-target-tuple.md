# endpoint-reuse-tuple-target: tuple follow-up

5 matched rounds select apply.replace and apply.duplicate from the production tuple CLI; fixtures, warmup, measured work and correctness checks are unchanged. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Every burst retains its original correctness checks. Build order rotates and reverses between rounds.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → compact-removals

| Case                                 |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1662.74 | 134.03 |  1789.93 | 382.66 |     127.19 |   7.65% |        10.04% |          30.92 |                      |
| tuple/tuple/2/apply.replace          |  1087.51 |  79.90 |  1109.85 |   9.68 |      22.34 |   2.05% |         1.28% |           4.86 |                      |
| tuple/projection/2/apply.duplicate   |   572.34 |  34.10 |   591.62 |  60.21 |      19.28 |   3.37% |         1.75% |          18.52 |                      |
| tuple/tuple/2/apply.duplicate        |   598.79 | 122.74 |   594.55 | 160.43 |      -4.25 |  -0.71% |        -0.71% |           8.08 |                      |
| tuple/projection/4/apply.replace     |  2569.93 | 269.07 |  1759.07 | 168.14 |    -810.86 | -31.55% |       -29.18% |           6.95 |                      |
| tuple/tuple/4/apply.replace          |  1073.69 |  32.69 |  1057.11 | 171.30 |     -16.57 |  -1.54% |        -8.70% |          18.99 |                      |
| tuple/projection/4/apply.duplicate   |   547.87 |  12.62 |   557.45 |  31.34 |       9.58 |   1.75% |         2.96% |           7.42 |                      |
| tuple/tuple/4/apply.duplicate        |   577.26 |  48.85 |   562.14 |  37.80 |     -15.12 |  -2.62% |        -0.19% |           6.34 |                      |
| tuple/projection/8/apply.replace     |  2474.54 | 111.91 |  1739.32 |  41.25 |    -735.22 | -29.71% |       -32.24% |           2.94 |                      |
| tuple/tuple/8/apply.replace          |  1081.42 |  80.31 |  1017.77 |  42.17 |     -63.65 |  -5.89% |        -5.89% |           3.19 |                      |
| tuple/projection/8/apply.duplicate   |   576.97 |  43.11 |   557.22 |  17.92 |     -19.75 |  -3.42% |        -3.42% |           5.76 |                      |
| tuple/tuple/8/apply.duplicate        |   582.03 |  36.37 |   565.50 |  76.92 |     -16.54 |  -2.84% |        -2.84% |          20.20 |                      |
| tuple/projection/100/apply.replace   |  2999.25 |  96.73 |  1726.41 | 176.81 |   -1272.85 | -42.44% |       -41.05% |           6.37 |                      |
| tuple/tuple/100/apply.replace        |   958.90 | 140.66 |  1003.27 |  72.17 |      44.37 |   4.63% |         8.82% |          20.63 |                      |
| tuple/projection/100/apply.duplicate |   552.16 |  67.48 |   588.72 |  47.29 |      36.56 |   6.62% |         4.62% |          15.66 |                      |
| tuple/tuple/100/apply.duplicate      |   553.32 |  30.14 |   602.62 |  38.39 |      49.30 |   8.91% |         1.62% |          11.35 |                      |
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
| tuple/projection/2/apply.replace     |  1662.74 | 134.03 |  2077.88 | 431.70 |     415.15 |  24.97% |        31.09% |          38.31 |                      |
| tuple/tuple/2/apply.replace          |  1087.51 |  79.90 |  1098.95 |  73.89 |      11.44 |   1.05% |        -3.81% |           7.43 |                      |
| tuple/projection/2/apply.duplicate   |   572.34 |  34.10 |   534.38 |  24.56 |     -37.96 |  -6.63% |        -7.71% |           5.51 |                      |
| tuple/tuple/2/apply.duplicate        |   598.79 | 122.74 |   553.35 |  77.94 |     -45.44 |  -7.59% |        -7.05% |          32.44 |                      |
| tuple/projection/4/apply.replace     |  2569.93 | 269.07 |  1778.52 |  90.41 |    -791.41 | -30.79% |       -34.14% |          16.81 |                      |
| tuple/tuple/4/apply.replace          |  1073.69 |  32.69 |   988.50 |  19.11 |     -85.18 |  -7.93% |        -8.72% |          10.13 |                      |
| tuple/projection/4/apply.duplicate   |   547.87 |  12.62 |   545.68 |  29.27 |      -2.19 |  -0.40% |        -0.89% |           4.79 |                      |
| tuple/tuple/4/apply.duplicate        |   577.26 |  48.85 |   573.79 |  15.83 |      -3.47 |  -0.60% |        -4.56% |           9.80 |                      |
| tuple/projection/8/apply.replace     |  2474.54 | 111.91 |  1761.36 |  89.73 |    -713.18 | -28.82% |       -27.65% |           3.14 |                      |
| tuple/tuple/8/apply.replace          |  1081.42 |  80.31 |   993.47 |  75.50 |     -87.95 |  -8.13% |        -5.07% |           6.04 |                      |
| tuple/projection/8/apply.duplicate   |   576.97 |  43.11 |   573.12 |  67.94 |      -3.85 |  -0.67% |         4.52% |           8.22 |                      |
| tuple/tuple/8/apply.duplicate        |   582.03 |  36.37 |   574.32 |  86.81 |      -7.71 |  -1.32% |        -1.32% |          23.20 |                      |
| tuple/projection/100/apply.replace   |  2999.25 |  96.73 |  1852.43 |  93.91 |   -1146.83 | -38.24% |       -38.15% |           2.30 |                      |
| tuple/tuple/100/apply.replace        |   958.90 | 140.66 |   988.15 |  66.85 |      29.25 |   3.05% |         3.05% |           6.22 |                      |
| tuple/projection/100/apply.duplicate |   552.16 |  67.48 |   566.06 |  67.28 |      13.90 |   2.52% |         1.03% |          11.00 |                      |
| tuple/tuple/100/apply.duplicate      |   553.32 |  30.14 |   559.16 |   7.98 |       5.84 |   1.06% |         2.27% |           2.71 |                      |
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
