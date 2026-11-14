# bounded-release-editing: tuple follow-up

5 matched rounds select the production tuple benchmark's replace.random and apply.replace cases. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Only case selection changes in a temporary entry file; fixtures, reset, GC, work, timing and correctness checks remain unchanged. Build order rotates and reverses between rounds. This is a 16-row targeted comparison, not the complete tuple suite.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → direct-create

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1361.89 | 114.84 |  1534.71 |  44.79 |     172.82 |  12.69% |        12.88% |          12.65 |                      |
| tuple/tuple/2/replace.random        |   719.53 |  39.60 |   668.71 |  18.70 |     -50.82 |  -7.06% |        -5.35% |           9.61 |                      |
| tuple/projection/2/apply.replace    |  1701.86 | 151.74 |  1869.14 | 116.35 |     167.28 |   9.83% |        13.09% |           5.00 |                      |
| tuple/tuple/2/apply.replace         |  1091.05 | 104.78 |  1098.76 | 108.13 |       7.71 |   0.71% |         0.14% |           5.69 |                      |
| tuple/projection/4/replace.random   |  1151.78 |  48.88 |  1269.43 |  58.77 |     117.65 |  10.21% |        12.31% |           5.96 |                      |
| tuple/tuple/4/replace.random        |   652.28 |  37.78 |   644.23 |  45.91 |      -8.05 |  -1.23% |        -4.96% |           6.72 |                      |
| tuple/projection/4/apply.replace    |  2132.91 | 208.54 |  1876.20 | 173.68 |    -256.71 | -12.04% |       -18.38% |           9.24 |                      |
| tuple/tuple/4/apply.replace         |  1029.56 |  89.86 |  1048.64 | 113.38 |      19.08 |   1.85% |        -0.26% |          20.97 |                      |
| tuple/projection/8/replace.random   |  1122.06 |   9.40 |  1339.52 | 161.37 |     217.46 |  19.38% |        18.74% |          14.91 | yes                  |
| tuple/tuple/8/replace.random        |   684.04 |  64.01 |   679.06 |  30.91 |      -4.98 |  -0.73% |        -0.73% |           3.25 |                      |
| tuple/projection/8/apply.replace    |  2524.88 | 209.89 |  1735.90 | 107.30 |    -788.98 | -31.25% |       -29.90% |          11.71 |                      |
| tuple/tuple/8/apply.replace         |  1035.67 |  50.19 |  1045.46 |  11.55 |       9.79 |   0.95% |         0.37% |           1.64 |                      |
| tuple/projection/100/replace.random |  1418.59 | 261.29 |  1361.05 | 139.75 |     -57.54 |  -4.06% |        -4.64% |           4.22 |                      |
| tuple/tuple/100/replace.random      |   652.06 |  50.44 |   659.59 |  57.53 |       7.53 |   1.16% |         0.87% |          12.69 |                      |
| tuple/projection/100/apply.replace  |  2975.36 | 126.99 |  1894.28 |  25.64 |   -1081.08 | -36.33% |       -36.58% |           7.02 |                      |
| tuple/tuple/100/apply.replace       |   990.22 |  41.69 |  1129.65 | 133.88 |     139.43 |  14.08% |        14.08% |          26.64 |                      |
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

## fixed-table → bounded-release

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1361.89 | 114.84 |  1401.43 |  61.64 |      39.54 |   2.90% |         0.94% |           6.11 |                      |
| tuple/tuple/2/replace.random        |   719.53 |  39.60 |   646.77 |  24.48 |     -72.76 | -10.11% |        -8.37% |           9.71 |                      |
| tuple/projection/2/apply.replace    |  1701.86 | 151.74 |  1960.57 | 218.21 |     258.71 |  15.20% |         9.94% |          16.50 |                      |
| tuple/tuple/2/apply.replace         |  1091.05 | 104.78 |  1182.52 | 137.43 |      91.47 |   8.38% |         5.13% |           7.64 |                      |
| tuple/projection/4/replace.random   |  1151.78 |  48.88 |  1247.26 | 164.21 |      95.47 |   8.29% |         1.35% |          11.59 |                      |
| tuple/tuple/4/replace.random        |   652.28 |  37.78 |   636.21 |  68.79 |     -16.07 |  -2.46% |        -0.38% |          10.19 |                      |
| tuple/projection/4/apply.replace    |  2132.91 | 208.54 |  1680.28 |  48.31 |    -452.64 | -21.22% |       -28.00% |           7.89 |                      |
| tuple/tuple/4/apply.replace         |  1029.56 |  89.86 |  1032.92 |  49.02 |       3.36 |   0.33% |         0.57% |           4.48 |                      |
| tuple/projection/8/replace.random   |  1122.06 |   9.40 |  1139.40 |  90.61 |      17.34 |   1.55% |         1.85% |          11.15 |                      |
| tuple/tuple/8/replace.random        |   684.04 |  64.01 |   659.26 |  26.69 |     -24.78 |  -3.62% |        -4.25% |          13.20 |                      |
| tuple/projection/8/apply.replace    |  2524.88 | 209.89 |  1652.69 | 115.88 |    -872.18 | -34.54% |       -34.92% |           9.15 |                      |
| tuple/tuple/8/apply.replace         |  1035.67 |  50.19 |  1052.41 |  47.71 |      16.74 |   1.62% |        -1.06% |          10.93 |                      |
| tuple/projection/100/replace.random |  1418.59 | 261.29 |  1330.13 | 134.47 |     -88.46 |  -6.24% |        -7.78% |          10.63 |                      |
| tuple/tuple/100/replace.random      |   652.06 |  50.44 |   653.40 |  48.41 |       1.34 |   0.21% |        -3.55% |           6.27 |                      |
| tuple/projection/100/apply.replace  |  2975.36 | 126.99 |  1829.19 | 156.09 |   -1146.17 | -38.52% |       -41.02% |           5.66 |                      |
| tuple/tuple/100/apply.replace       |   990.22 |  41.69 |  1007.92 |  51.01 |      17.69 |   1.79% |         1.56% |           3.99 |                      |
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
