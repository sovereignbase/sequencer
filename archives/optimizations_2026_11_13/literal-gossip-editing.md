# literal-gossip-editing: tuple follow-up

5 matched rounds select the production tuple benchmark's replace.random and apply.replace cases. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Only case selection changes in a temporary entry file; fixtures, reset, GC, work, timing and correctness checks remain unchanged. Build order rotates and reverses between rounds. This is a 16-row targeted comparison, not the complete tuple suite.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → bounded-release

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1289.99 |  38.50 |  1382.89 | 243.18 |      92.90 |   7.20% |         2.69% |          21.96 |                      |
| tuple/tuple/2/replace.random        |   635.27 |  12.43 |   687.90 |  47.13 |      52.63 |   8.28% |         5.18% |           6.78 |                      |
| tuple/projection/2/apply.replace    |  1687.43 | 104.87 |  1875.68 |  78.25 |     188.25 |  11.16% |        10.08% |          10.79 |                      |
| tuple/tuple/2/apply.replace         |  1061.63 |  25.28 |  1087.25 | 115.72 |      25.62 |   2.41% |         2.41% |          11.71 |                      |
| tuple/projection/4/replace.random   |  1182.14 | 204.53 |  1186.79 |  55.68 |       4.64 |   0.39% |         1.37% |           6.75 |                      |
| tuple/tuple/4/replace.random        |   613.26 |  29.11 |   620.37 |  18.76 |       7.11 |   1.16% |         4.21% |           2.93 |                      |
| tuple/projection/4/apply.replace    |  2157.34 |  21.23 |  1673.99 | 176.16 |    -483.35 | -22.41% |       -21.30% |           8.90 |                      |
| tuple/tuple/4/apply.replace         |  1020.41 | 112.15 |  1017.59 |  19.82 |      -2.83 |  -0.28% |        -0.89% |           8.69 |                      |
| tuple/projection/8/replace.random   |  1044.85 |  95.24 |  1141.67 | 110.95 |      96.81 |   9.27% |         7.73% |          11.57 |                      |
| tuple/tuple/8/replace.random        |   742.51 | 107.76 |   627.60 |  22.61 |    -114.91 | -15.48% |       -15.48% |           7.85 |                      |
| tuple/projection/8/apply.replace    |  2415.51 |  94.96 |  1577.78 |  98.41 |    -837.73 | -34.68% |       -35.00% |           4.35 |                      |
| tuple/tuple/8/apply.replace         |  1023.55 |  58.54 |   974.48 |  42.14 |     -49.07 |  -4.79% |        -6.81% |           7.10 |                      |
| tuple/projection/100/replace.random |  1464.54 | 132.97 |  1185.13 |  51.14 |    -279.40 | -19.08% |       -19.08% |           3.09 |                      |
| tuple/tuple/100/replace.random      |   615.56 |  77.37 |   653.25 |  34.89 |      37.69 |   6.12% |         2.77% |           9.56 |                      |
| tuple/projection/100/apply.replace  |  2903.13 | 280.21 |  1832.54 | 133.61 |   -1070.59 | -36.88% |       -36.88% |          11.32 |                      |
| tuple/tuple/100/apply.replace       |  1051.42 | 142.03 |  1012.84 |  43.99 |     -38.58 |  -3.67% |         4.52% |          12.16 |                      |
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

## fixed-table → literal-gossip

| Case                                |   Before |    IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------------------- | -------: | -----: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/replace.random   |  1289.99 |  38.50 |  1397.72 |  37.54 |     107.72 |   8.35% |         8.63% |          16.91 |                      |
| tuple/tuple/2/replace.random        |   635.27 |  12.43 |   626.05 |  20.07 |      -9.21 |  -1.45% |        -2.48% |           2.90 |                      |
| tuple/projection/2/apply.replace    |  1687.43 | 104.87 |  1801.32 |  36.37 |     113.89 |   6.75% |         2.42% |          11.96 | yes                  |
| tuple/tuple/2/apply.replace         |  1061.63 |  25.28 |  1105.65 |  11.03 |      44.02 |   4.15% |         4.78% |           7.05 |                      |
| tuple/projection/4/replace.random   |  1182.14 | 204.53 |  1054.86 |  85.52 |    -127.29 | -10.77% |       -12.28% |          16.87 |                      |
| tuple/tuple/4/replace.random        |   613.26 |  29.11 |   597.88 |  76.11 |     -15.38 |  -2.51% |        -4.25% |           8.65 |                      |
| tuple/projection/4/apply.replace    |  2157.34 |  21.23 |  1643.53 | 177.38 |    -513.81 | -23.82% |       -20.82% |           8.98 |                      |
| tuple/tuple/4/apply.replace         |  1020.41 | 112.15 |  1026.11 | 145.34 |       5.70 |   0.56% |         3.87% |          24.21 |                      |
| tuple/projection/8/replace.random   |  1044.85 |  95.24 |  1163.21 | 123.77 |     118.36 |  11.33% |         7.36% |          27.75 |                      |
| tuple/tuple/8/replace.random        |   742.51 | 107.76 |   597.26 |  99.96 |    -145.25 | -19.56% |       -16.63% |          12.31 |                      |
| tuple/projection/8/apply.replace    |  2415.51 |  94.96 |  1730.25 |  50.00 |    -685.27 | -28.37% |       -26.27% |           2.30 |                      |
| tuple/tuple/8/apply.replace         |  1023.55 |  58.54 |  1050.09 | 113.15 |      26.54 |   2.59% |         6.11% |          13.34 |                      |
| tuple/projection/100/replace.random |  1464.54 | 132.97 |  1245.04 |  87.60 |    -219.50 | -14.99% |       -12.99% |          13.22 |                      |
| tuple/tuple/100/replace.random      |   615.56 |  77.37 |   582.12 |  14.26 |     -33.44 |  -5.43% |        -5.43% |          11.22 |                      |
| tuple/projection/100/apply.replace  |  2903.13 | 280.21 |  1827.85 |  57.82 |   -1075.29 | -37.04% |       -36.25% |           8.92 |                      |
| tuple/tuple/100/apply.replace       |  1051.42 | 142.03 |  1059.70 |  35.74 |       8.28 |   0.79% |         0.04% |          19.44 |                      |
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
