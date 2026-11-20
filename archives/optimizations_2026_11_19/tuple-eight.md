# tuple-eight: production throughput control

Five matched rounds of the unchanged tuple benchmark restricted through its
existing `--sizes 8` option. All ten methods in both ordinary and static-tuple
mode retain the original 25 ms warmup and 50 ms measurement limits. Baseline,
identical control and candidate run in rotating, reversing order. All 20 rows
and every sample remain visible. No candidate median is above +10%.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. Length is retained as a control and excluded from the timing acceptance criterion.

## baseline → control

| Method                       |  Before |    IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :--------------------------- | ------: | -----: | ------: | -----: | ------: | ------------: | -------------: | :------------------- |
| 8/projection/create.empty    |  399.63 |  53.98 |  422.28 |  37.97 |   5.67% |         5.67% |           7.10 |                      |
| 8/tuple/create.empty         |  468.58 |  44.76 |  455.40 |  36.76 |  -2.81% |        -2.48% |           5.29 |                      |
| 8/projection/create.sequence | 2820.13 | 464.12 | 2824.84 |  63.28 |   0.17% |        -1.79% |          16.61 |                      |
| 8/tuple/create.sequence      | 2408.74 | 283.38 | 2072.10 | 107.34 | -13.98% |       -13.98% |          20.49 |                      |
| 8/projection/replace.random  | 1526.06 | 144.00 | 1271.59 | 210.05 | -16.67% |       -12.82% |           7.59 |                      |
| 8/tuple/replace.random       |  740.55 |  34.99 |  773.56 | 119.22 |   4.46% |         2.58% |          13.02 |                      |
| 8/projection/apply.replace   | 2362.92 | 379.65 | 2143.16 | 145.32 |  -9.30% |        -5.19% |           9.29 |                      |
| 8/tuple/apply.replace        | 1370.14 | 161.51 | 1361.37 | 226.18 |  -0.64% |         2.25% |           6.28 |                      |
| 8/projection/apply.duplicate |  708.66 |  54.96 |  715.71 | 133.36 |   0.99% |        10.32% |           9.73 |                      |
| 8/tuple/apply.duplicate      |  657.43 |  96.98 |  683.52 |  28.26 |   3.97% |         7.46% |           7.57 |                      |
| 8/projection/merge.duplicate | 1338.22 | 208.53 | 1367.48 |  31.18 |   2.19% |         3.11% |           1.36 |                      |
| 8/tuple/merge.duplicate      | 1256.69 | 161.70 | 1302.01 | 172.56 |   3.61% |         8.98% |           9.18 |                      |
| 8/projection/length          |    9.13 |   0.96 |    9.16 |   0.69 |   0.26% |         1.21% |           6.26 |                      |
| 8/tuple/length               |    9.03 |   0.97 |    8.62 |   0.17 |  -4.52% |        -4.58% |           5.80 |                      |
| 8/projection/value.random    |   55.43 |   7.89 |   55.34 |   5.02 |  -0.16% |         4.08% |          11.04 |                      |
| 8/tuple/value.random         |   23.05 |   1.63 |   21.96 |   1.21 |  -4.70% |        -6.97% |          11.60 |                      |
| 8/projection/values          |  198.91 |  93.84 |  210.75 |   7.51 |   5.95% |        -3.64% |          23.51 |                      |
| 8/tuple/values               |  225.40 |  16.62 |  228.93 |  11.52 |   1.57% |         0.96% |          15.69 |                      |
| 8/projection/sequence        |  772.78 |  63.91 |  973.09 | 246.11 |  25.92% |        43.70% |          40.10 |                      |
| 8/tuple/sequence             |  799.46 | 179.49 |  863.98 |  20.86 |   8.07% |         8.07% |          31.20 |                      |

## baseline → text-kind

| Method                       |  Before |    IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :--------------------------- | ------: | -----: | ------: | -----: | ------: | ------------: | -------------: | :------------------- |
| 8/projection/create.empty    |  399.63 |  53.98 |  410.78 |  91.55 |   2.79% |         1.99% |           9.60 |                      |
| 8/tuple/create.empty         |  468.58 |  44.76 |  451.61 |  65.18 |  -3.62% |        -0.20% |           8.16 |                      |
| 8/projection/create.sequence | 2820.13 | 464.12 | 2580.99 | 350.54 |  -8.48% |        -1.00% |          11.94 |                      |
| 8/tuple/create.sequence      | 2408.74 | 283.38 | 2233.07 |  98.66 |  -7.29% |        -5.16% |          16.54 |                      |
| 8/projection/replace.random  | 1526.06 | 144.00 | 1334.13 |  51.87 | -12.58% |       -16.46% |          12.19 |                      |
| 8/tuple/replace.random       |  740.55 |  34.99 |  751.12 |  48.57 |   1.43% |         6.10% |           5.01 |                      |
| 8/projection/apply.replace   | 2362.92 | 379.65 | 2167.37 | 342.83 |  -8.28% |        -3.84% |          11.16 |                      |
| 8/tuple/apply.replace        | 1370.14 | 161.51 | 1317.12 | 211.75 |  -3.87% |        -3.84% |           3.82 |                      |
| 8/projection/apply.duplicate |  708.66 |  54.96 |  700.01 |  60.57 |  -1.22% |        -8.91% |          10.15 |                      |
| 8/tuple/apply.duplicate      |  657.43 |  96.98 |  648.67 | 155.47 |  -1.33% |         0.61% |           4.37 |                      |
| 8/projection/merge.duplicate | 1338.22 | 208.53 | 1438.14 | 282.76 |   7.47% |         0.42% |           4.17 |                      |
| 8/tuple/merge.duplicate      | 1256.69 | 161.70 | 1299.49 |  53.82 |   3.41% |         2.53% |           2.41 |                      |
| 8/projection/length          |    9.13 |   0.96 |    9.12 |   0.31 |  -0.12% |        -1.15% |           7.60 |                      |
| 8/tuple/length               |    9.03 |   0.97 |    8.69 |   0.25 |  -3.81% |         2.19% |          14.14 |                      |
| 8/projection/value.random    |   55.43 |   7.89 |   56.50 |   2.44 |   1.92% |         1.05% |           1.18 |                      |
| 8/tuple/value.random         |   23.05 |   1.63 |   22.61 |   1.69 |  -1.90% |        -6.80% |           9.98 |                      |
| 8/projection/values          |  198.91 |  93.84 |  204.39 |   6.62 |   2.75% |         4.93% |          36.70 |                      |
| 8/tuple/values               |  225.40 |  16.62 |  212.75 |  11.65 |  -5.61% |       -11.27% |          14.56 |                      |
| 8/projection/sequence        |  772.78 |  63.91 |  749.66 |  71.44 |  -2.99% |         3.60% |          18.73 |                      |
| 8/tuple/sequence             |  799.46 | 179.49 |  842.67 |  57.11 |   5.40% |         1.96% |           9.69 |                      |
