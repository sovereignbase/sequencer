# visible-tail-tuple-target: tuple follow-up

5 matched rounds select apply.replace and apply.duplicate from the production tuple CLI; fixtures, warmup, measured work and correctness checks are unchanged. Sizes 2, 4, 8 and 100; both ordinary Projection and fixed tuple modes; minimum 25 ms of API warmup and 50 ms of measured API work per case. Every burst retains its original correctness checks. Build order rotates and reverses between rounds.

Times are median ns/call, space is bytes. IQR is the third minus first quartile. Paired changes compare matching rounds. Length remains reported and is excluded from the timing decision. All raw samples and slower results are retained.

## fixed-table → compact-removals

| Case                                 |   Before |     IQR |    After |     IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | ------: | -------: | ------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1619.61 |  124.91 |  1797.52 |  215.69 |     177.91 |  10.98% |        11.55% |           5.49 | yes                  |
| tuple/tuple/2/apply.replace          |  1122.05 |  173.92 |  1081.08 |   29.74 |     -40.97 |  -3.65% |        -5.98% |          14.56 |                      |
| tuple/projection/2/apply.duplicate   |   577.57 |   50.77 |   568.97 |    6.65 |      -8.60 |  -1.49% |        -1.49% |           3.52 |                      |
| tuple/tuple/2/apply.duplicate        |   635.90 |   44.33 |   582.86 |   23.05 |     -53.04 |  -8.34% |        -8.40% |           8.43 |                      |
| tuple/projection/4/apply.replace     |  2335.42 |  151.74 |  1728.23 |   39.50 |    -607.19 | -26.00% |       -25.30% |           4.55 |                      |
| tuple/tuple/4/apply.replace          |  1043.45 |  421.06 |  1079.82 |   33.29 |      36.37 |   3.49% |        -2.24% |          28.85 |                      |
| tuple/projection/4/apply.duplicate   |   558.07 |  129.66 |   576.89 |   57.04 |      18.82 |   3.37% |        -2.19% |          29.52 |                      |
| tuple/tuple/4/apply.duplicate        |   590.87 |   51.04 |   708.23 |  140.75 |     117.35 |  19.86% |        14.87% |          29.91 |                      |
| tuple/projection/8/apply.replace     |  2491.31 |  112.66 |  1946.97 | 2208.11 |    -544.34 | -21.85% |       -23.16% |          90.77 |                      |
| tuple/tuple/8/apply.replace          |  1013.59 |   90.99 |  1035.78 |  811.88 |      22.19 |   2.19% |         2.19% |          93.36 |                      |
| tuple/projection/8/apply.duplicate   |   556.62 |   55.13 |   725.07 |  206.64 |     168.45 |  30.26% |         8.08% |          49.52 | yes                  |
| tuple/tuple/8/apply.duplicate        |   598.38 |   85.55 |   636.09 |  115.81 |      37.70 |   6.30% |         6.45% |          26.39 |                      |
| tuple/projection/100/apply.replace   |  3101.66 | 1620.49 |  1950.57 |  139.46 |   -1151.10 | -37.11% |       -40.67% |          21.65 |                      |
| tuple/tuple/100/apply.replace        |   979.89 |   38.96 |  1076.09 |  132.59 |      96.20 |   9.82% |         9.82% |          18.60 |                      |
| tuple/projection/100/apply.duplicate |   569.12 |   62.89 |   590.97 |   69.95 |      21.86 |   3.84% |         7.97% |          21.28 |                      |
| tuple/tuple/100/apply.duplicate      |   635.82 |   68.60 |   609.34 |   78.83 |     -26.48 |  -4.16% |         7.01% |          15.02 |                      |
| space/projection/2/allocatedBytes    |   816.00 |    0.00 |   752.00 |    0.00 |     -64.00 |  -7.84% |        -7.84% |           0.00 |                      |
| space/projection/2/msgpackBytes      |    32.00 |    0.00 |    32.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/2/gzipBytes         |    42.00 |    0.00 |    42.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/allocatedBytes         |   808.00 |    0.00 |   792.00 |    0.00 |     -16.00 |  -1.98% |        -1.98% |           0.00 |                      |
| space/tuple/2/msgpackBytes           |    38.00 |    0.00 |    38.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/gzipBytes              |    56.00 |    0.00 |    56.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/allocatedBytes    |  1488.00 |    0.00 |  1432.00 |    0.00 |     -56.00 |  -3.76% |        -3.76% |           0.00 |                      |
| space/projection/4/msgpackBytes      |    64.00 |    0.00 |    64.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/gzipBytes         |    53.00 |    0.00 |    53.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/allocatedBytes         |   984.00 |    0.00 |   968.00 |    0.00 |     -16.00 |  -1.63% |        -1.63% |           0.00 |                      |
| space/tuple/4/msgpackBytes           |    60.00 |    0.00 |    60.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/gzipBytes              |    71.00 |    0.00 |    71.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/allocatedBytes    |  2416.00 |    0.00 |  2328.00 |    0.00 |     -88.00 |  -3.64% |        -3.64% |           0.00 |                      |
| space/projection/8/msgpackBytes      |   124.00 |    0.00 |   124.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/gzipBytes         |    80.00 |    0.00 |    80.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/allocatedBytes         |  1432.00 |    0.00 |  1416.00 |    0.00 |     -16.00 |  -1.12% |        -1.12% |           0.00 |                      |
| space/tuple/8/msgpackBytes           |   104.00 |    0.00 |   104.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/gzipBytes              |    92.00 |    0.00 |    92.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/allocatedBytes  | 23080.00 |    0.00 | 21400.00 |    0.00 |   -1680.00 |  -7.28% |        -7.28% |           0.00 |                      |
| space/projection/100/msgpackBytes    |   682.00 |    0.00 |   682.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/gzipBytes       |   586.00 |    0.00 |   586.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/allocatedBytes       | 11624.00 |    0.00 | 11608.00 |    0.00 |     -16.00 |  -0.14% |        -0.14% |           0.00 |                      |
| space/tuple/100/msgpackBytes         |   527.00 |    0.00 |   527.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/gzipBytes            |   356.00 |    0.00 |   356.00 |    0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |

## fixed-table → visible-tail

| Case                                 |   Before |     IQR |    After |    IQR | Difference |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :----------------------------------- | -------: | ------: | -------: | -----: | ---------: | ------: | ------------: | -------------: | :------------------- |
| tuple/projection/2/apply.replace     |  1619.61 |  124.91 |  1782.71 | 383.34 |     163.10 |  10.07% |         9.55% |          21.63 | yes                  |
| tuple/tuple/2/apply.replace          |  1122.05 |  173.92 |  1159.98 | 111.37 |      37.92 |   3.38% |         3.38% |          17.80 |                      |
| tuple/projection/2/apply.duplicate   |   577.57 |   50.77 |   615.97 |  76.71 |      38.39 |   6.65% |        12.92% |          15.54 |                      |
| tuple/tuple/2/apply.duplicate        |   635.90 |   44.33 |   600.24 |  86.02 |     -35.66 |  -5.61% |        -4.35% |           4.72 |                      |
| tuple/projection/4/apply.replace     |  2335.42 |  151.74 |  1859.04 |  93.69 |    -476.38 | -20.40% |       -20.62% |          12.68 |                      |
| tuple/tuple/4/apply.replace          |  1043.45 |  421.06 |  1042.04 | 259.74 |      -1.41 |  -0.13% |        -2.77% |           9.78 |                      |
| tuple/projection/4/apply.duplicate   |   558.07 |  129.66 |   593.84 |  49.72 |      35.77 |   6.41% |        -2.25% |          21.42 |                      |
| tuple/tuple/4/apply.duplicate        |   590.87 |   51.04 |   598.72 | 117.36 |       7.85 |   1.33% |        -0.82% |          11.03 |                      |
| tuple/projection/8/apply.replace     |  2491.31 |  112.66 |  1669.73 | 197.56 |    -821.59 | -32.98% |       -33.74% |           5.01 |                      |
| tuple/tuple/8/apply.replace          |  1013.59 |   90.99 |  1033.23 | 124.28 |      19.64 |   1.94% |        -0.04% |           0.82 |                      |
| tuple/projection/8/apply.duplicate   |   556.62 |   55.13 |   590.47 |  83.56 |      33.84 |   6.08% |         1.65% |           5.23 |                      |
| tuple/tuple/8/apply.duplicate        |   598.38 |   85.55 |   587.38 |  67.89 |     -11.01 |  -1.84% |        -6.89% |          19.22 |                      |
| tuple/projection/100/apply.replace   |  3101.66 | 1620.49 |  1957.68 | 246.90 |   -1143.98 | -36.88% |       -42.21% |          18.33 |                      |
| tuple/tuple/100/apply.replace        |   979.89 |   38.96 |  1085.01 |  79.91 |     105.12 |  10.73% |         9.25% |          16.45 |                      |
| tuple/projection/100/apply.duplicate |   569.12 |   62.89 |   596.24 |  46.34 |      27.13 |   4.77% |         3.02% |           3.46 |                      |
| tuple/tuple/100/apply.duplicate      |   635.82 |   68.60 |   577.53 |  36.82 |     -58.28 |  -9.17% |        -9.17% |          16.46 |                      |
| space/projection/2/allocatedBytes    |   816.00 |    0.00 |   752.00 |   0.00 |     -64.00 |  -7.84% |        -7.84% |           0.00 |                      |
| space/projection/2/msgpackBytes      |    32.00 |    0.00 |    32.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/2/gzipBytes         |    42.00 |    0.00 |    42.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/allocatedBytes         |   808.00 |    0.00 |   792.00 |   0.00 |     -16.00 |  -1.98% |        -1.98% |           0.00 |                      |
| space/tuple/2/msgpackBytes           |    38.00 |    0.00 |    38.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/2/gzipBytes              |    56.00 |    0.00 |    56.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/allocatedBytes    |  1488.00 |    0.00 |  1432.00 |   0.00 |     -56.00 |  -3.76% |        -3.76% |           0.00 |                      |
| space/projection/4/msgpackBytes      |    64.00 |    0.00 |    64.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/4/gzipBytes         |    53.00 |    0.00 |    53.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/allocatedBytes         |   984.00 |    0.00 |   968.00 |   0.00 |     -16.00 |  -1.63% |        -1.63% |           0.00 |                      |
| space/tuple/4/msgpackBytes           |    60.00 |    0.00 |    60.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/4/gzipBytes              |    71.00 |    0.00 |    71.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/allocatedBytes    |  2416.00 |    0.00 |  2328.00 |   0.00 |     -88.00 |  -3.64% |        -3.64% |           0.00 |                      |
| space/projection/8/msgpackBytes      |   124.00 |    0.00 |   124.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/8/gzipBytes         |    80.00 |    0.00 |    80.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/allocatedBytes         |  1432.00 |    0.00 |  1416.00 |   0.00 |     -16.00 |  -1.12% |        -1.12% |           0.00 |                      |
| space/tuple/8/msgpackBytes           |   104.00 |    0.00 |   104.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/8/gzipBytes              |    92.00 |    0.00 |    92.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/allocatedBytes  | 23080.00 |    0.00 | 21400.00 |   0.00 |   -1680.00 |  -7.28% |        -7.28% |           0.00 |                      |
| space/projection/100/msgpackBytes    |   682.00 |    0.00 |   682.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/projection/100/gzipBytes       |   586.00 |    0.00 |   586.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/allocatedBytes       | 11624.00 |    0.00 | 11608.00 |   0.00 |     -16.00 |  -0.14% |        -0.14% |           0.00 |                      |
| space/tuple/100/msgpackBytes         |   527.00 |    0.00 |   527.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| space/tuple/100/gzipBytes            |   356.00 |    0.00 |   356.00 |   0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
