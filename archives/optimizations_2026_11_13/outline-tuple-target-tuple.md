# outline-tuple-target: tuple follow-up

5 matched rounds select apply.replace and apply.duplicate from the production tuple CLI; fixtures, warmup, measured work and correctness checks are unchanged. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Every burst retains its original correctness checks. Build order rotates and reverses between rounds.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → compact-removals

| Case                                 |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1609.41 |  22.80 |  1752.15 | 909.71 |     142.75 |   8.87% |         8.03% |          58.86 |                      |
| tuple/tuple/2/apply.replace          |  1051.29 |  18.01 |  1035.24 | 139.49 |     -16.05 |  -1.53% |        -0.31% |          12.32 |                      |
| tuple/projection/2/apply.duplicate   |   562.22 |  20.97 |   545.57 |  19.98 |     -16.65 |  -2.96% |        -2.81% |           7.63 |                      |
| tuple/tuple/2/apply.duplicate        |   598.62 |  67.02 |   569.83 | 133.61 |     -28.80 |  -4.81% |         0.40% |          15.01 |                      |
| tuple/projection/4/apply.replace     |  2374.19 |  17.29 |  1766.79 |  77.40 |    -607.40 | -25.58% |       -25.29% |           4.35 |                      |
| tuple/tuple/4/apply.replace          |  1037.57 |  61.88 |  1047.58 |  39.39 |      10.02 |   0.97% |        -1.56% |           8.78 |                      |
| tuple/projection/4/apply.duplicate   |   553.82 |  25.86 |   538.01 |  13.10 |     -15.81 |  -2.85% |        -0.60% |           9.65 |                      |
| tuple/tuple/4/apply.duplicate        |   563.04 |  21.57 |   558.63 |  45.87 |      -4.41 |  -0.78% |        -1.08% |           0.32 |                      |
| tuple/projection/8/apply.replace     |  2404.12 | 139.52 |  1710.04 | 210.79 |    -694.07 | -28.87% |       -32.58% |          10.43 |                      |
| tuple/tuple/8/apply.replace          |  1006.34 |  16.74 |  1003.71 |  10.82 |      -2.63 |  -0.26% |        -0.99% |           1.29 |                      |
| tuple/projection/8/apply.duplicate   |   541.06 |  92.97 |   581.69 |  57.25 |      40.63 |   7.51% |         2.34% |          13.00 |                      |
| tuple/tuple/8/apply.duplicate        |   546.97 |  19.39 |   589.42 |  25.87 |      42.46 |   7.76% |         2.06% |           6.81 | yes                  |
| tuple/projection/100/apply.replace   |  3042.73 |  90.80 |  1943.58 | 155.59 |   -1099.15 | -36.12% |       -35.72% |           3.53 |                      |
| tuple/tuple/100/apply.replace        |   961.50 |  62.32 |   977.40 |  35.72 |      15.89 |   1.65% |         1.24% |           1.21 |                      |
| tuple/projection/100/apply.duplicate |   547.73 |  75.20 |   567.65 |  23.05 |      19.92 |   3.64% |         3.64% |           9.33 |                      |
| tuple/tuple/100/apply.duplicate      |   586.44 |  15.57 |   571.42 |  38.05 |     -15.02 |  -2.56% |        -2.00% |           6.06 |                      |
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

## fixed-table → sequence-outline

| Case                                 |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1609.41 |  22.80 |  1973.61 | 261.59 |     364.20 |  22.63% |        23.71% |          18.53 |                      |
| tuple/tuple/2/apply.replace          |  1051.29 |  18.01 |  1043.22 |  11.86 |      -8.07 |  -0.77% |        -0.02% |           2.57 |                      |
| tuple/projection/2/apply.duplicate   |   562.22 |  20.97 |   566.07 |  15.78 |       3.85 |   0.68% |         0.91% |           3.28 |                      |
| tuple/tuple/2/apply.duplicate        |   598.62 |  67.02 |   588.60 |  44.19 |     -10.03 |  -1.67% |        -1.67% |           4.44 |                      |
| tuple/projection/4/apply.replace     |  2374.19 |  17.29 |  1701.96 | 119.71 |    -672.23 | -28.31% |       -28.07% |           3.67 |                      |
| tuple/tuple/4/apply.replace          |  1037.57 |  61.88 |  1050.97 |  70.11 |      13.40 |   1.29% |         2.54% |          17.82 |                      |
| tuple/projection/4/apply.duplicate   |   553.82 |  25.86 |   548.11 |  54.33 |      -5.71 |  -1.03% |         1.94% |           3.47 |                      |
| tuple/tuple/4/apply.duplicate        |   563.04 |  21.57 |   647.80 |  78.99 |      84.76 |  15.05% |        10.69% |          20.69 |                      |
| tuple/projection/8/apply.replace     |  2404.12 | 139.52 |  1724.61 |  99.91 |    -679.51 | -28.26% |       -31.29% |           5.54 |                      |
| tuple/tuple/8/apply.replace          |  1006.34 |  16.74 |  1006.62 | 228.69 |       0.28 |   0.03% |         0.76% |          24.12 |                      |
| tuple/projection/8/apply.duplicate   |   541.06 |  92.97 |   583.08 |  41.11 |      42.02 |   7.77% |         8.09% |          13.40 |                      |
| tuple/tuple/8/apply.duplicate        |   546.97 |  19.39 |   578.54 |  49.57 |      31.57 |   5.77% |         5.77% |           5.39 |                      |
| tuple/projection/100/apply.replace   |  3042.73 |  90.80 |  1800.05 |  27.07 |   -1242.68 | -40.84% |       -40.96% |           2.57 |                      |
| tuple/tuple/100/apply.replace        |   961.50 |  62.32 |   969.10 |  80.22 |       7.59 |   0.79% |         1.69% |          16.11 |                      |
| tuple/projection/100/apply.duplicate |   547.73 |  75.20 |   548.58 | 105.03 |       0.86 |   0.16% |         5.43% |          31.88 |                      |
| tuple/tuple/100/apply.duplicate      |   586.44 |  15.57 |   583.85 | 130.66 |      -2.59 |  -0.44% |        -1.95% |          33.86 |                      |
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
