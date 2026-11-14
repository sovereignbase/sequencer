# reserved-slot-editing: tuple follow-up

5 matched rounds select the production tuple benchmark's replace.random and apply.replace cases. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Only case selection changes in a temporary entry file; fixtures, reset, GC, work, timing and correctness checks remain unchanged. Build order rotates and reverses between rounds. This is a 16-row targeted comparison, not the complete tuple suite.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → scalar-end

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1331.64 | 123.93 |  1358.25 | 149.89 |      26.62 |   2.00% |         0.87% |           2.24 |                      |
| tuple/tuple/2/replace.random        |   696.40 |  73.17 |   671.04 |  28.91 |     -25.36 |  -3.64% |        -2.74% |           9.21 |                      |
| tuple/projection/2/apply.replace    |  1781.64 |  24.02 |  2060.25 | 104.63 |     278.61 |  15.64% |        15.05% |           7.44 | yes                  |
| tuple/tuple/2/apply.replace         |  1080.29 | 224.14 |  1136.06 |  84.82 |      55.77 |   5.16% |         0.24% |          12.57 |                      |
| tuple/projection/4/replace.random   |  1190.74 |  45.03 |  1240.85 | 180.41 |      50.12 |   4.21% |         7.09% |           9.48 |                      |
| tuple/tuple/4/replace.random        |   646.97 |  78.92 |   657.38 |  13.02 |      10.41 |   1.61% |        -8.88% |          11.15 |                      |
| tuple/projection/4/apply.replace    |  2228.31 | 185.42 |  1729.12 | 133.22 |    -499.19 | -22.40% |       -22.28% |          10.19 |                      |
| tuple/tuple/4/apply.replace         |  1034.34 |  27.95 |  1031.33 |  34.05 |      -3.02 |  -0.29% |        -0.78% |           1.21 |                      |
| tuple/projection/8/replace.random   |  1157.52 |  23.60 |  1155.83 |  89.94 |      -1.69 |  -0.15% |        -0.15% |           7.06 |                      |
| tuple/tuple/8/replace.random        |   657.79 |  33.68 |   621.18 |  30.45 |     -36.61 |  -5.57% |        -4.09% |           3.70 |                      |
| tuple/projection/8/apply.replace    |  2394.28 | 113.55 |  1711.82 | 132.42 |    -682.46 | -28.50% |       -28.53% |           2.25 |                      |
| tuple/tuple/8/apply.replace         |   983.67 |  19.21 |  1048.92 |  27.30 |      65.25 |   6.63% |         5.44% |           4.48 | yes                  |
| tuple/projection/100/replace.random |  1468.60 | 188.00 |  1265.18 |   2.63 |    -203.43 | -13.85% |       -13.89% |          10.87 |                      |
| tuple/tuple/100/replace.random      |   636.72 |  15.55 |   636.34 |   4.84 |      -0.39 |  -0.06% |         0.18% |          11.62 |                      |
| tuple/projection/100/apply.replace  |  3041.30 | 186.20 |  1880.85 |  33.72 |   -1160.46 | -38.16% |       -37.50% |           3.73 |                      |
| tuple/tuple/100/apply.replace       |  1034.26 |  87.47 |  1040.76 |  69.77 |       6.49 |   0.63% |         0.63% |           6.31 |                      |
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

## fixed-table → reserved-slot

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1331.64 | 123.93 |  1437.78 |  83.66 |     106.15 |   7.97% |         7.97% |          15.85 |                      |
| tuple/tuple/2/replace.random        |   696.40 |  73.17 |   661.81 |   8.67 |     -34.60 |  -4.97% |        -6.14% |          13.04 |                      |
| tuple/projection/2/apply.replace    |  1781.64 |  24.02 |  1845.62 |  49.63 |      63.98 |   3.59% |         3.83% |           6.10 |                      |
| tuple/tuple/2/apply.replace         |  1080.29 | 224.14 |  1113.54 |  84.43 |      33.25 |   3.08% |         1.54% |          20.81 |                      |
| tuple/projection/4/replace.random   |  1190.74 |  45.03 |  1206.50 | 141.61 |      15.77 |   1.32% |        -3.90% |          11.56 |                      |
| tuple/tuple/4/replace.random        |   646.97 |  78.92 |   654.70 |  46.78 |       7.73 |   1.20% |        -4.83% |           8.91 |                      |
| tuple/projection/4/apply.replace    |  2228.31 | 185.42 |  1651.69 | 159.01 |    -576.62 | -25.88% |       -24.47% |          10.97 |                      |
| tuple/tuple/4/apply.replace         |  1034.34 |  27.95 |  1066.62 |  58.02 |      32.28 |   3.12% |        -0.26% |          10.65 |                      |
| tuple/projection/8/replace.random   |  1157.52 |  23.60 |  1193.87 |  25.85 |      36.35 |   3.14% |         4.84% |           2.99 |                      |
| tuple/tuple/8/replace.random        |   657.79 |  33.68 |   653.98 |  43.56 |      -3.81 |  -0.58% |        -0.85% |           6.27 |                      |
| tuple/projection/8/apply.replace    |  2394.28 | 113.55 |  1734.63 |  97.94 |    -659.65 | -27.55% |       -29.74% |           0.98 |                      |
| tuple/tuple/8/apply.replace         |   983.67 |  19.21 |  1027.78 |  62.13 |      44.11 |   4.48% |         7.05% |           5.48 |                      |
| tuple/projection/100/replace.random |  1468.60 | 188.00 |  1317.06 |  30.07 |    -151.54 | -10.32% |       -10.24% |          18.93 |                      |
| tuple/tuple/100/replace.random      |   636.72 |  15.55 |   627.36 |   7.70 |      -9.37 |  -1.47% |        -3.21% |           1.14 |                      |
| tuple/projection/100/apply.replace  |  3041.30 | 186.20 |  1886.89 |  53.50 |   -1154.41 | -37.96% |       -37.77% |           3.39 |                      |
| tuple/tuple/100/apply.replace       |  1034.26 |  87.47 |  1048.81 |  32.15 |      14.55 |   1.41% |         1.41% |          18.51 |                      |
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
