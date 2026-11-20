# context-interleaved: production throughput control

Five fresh process pairs compare 27 selected production case/checkpoint combinations. Within each process, both builds execute each case consecutively; order reverses by case and round. Both receive 10,000 warmup calls, a 1,000,000-call cap for reads and 10,000 for other cases, and the unchanged 100 ms burst limit. Fixtures, assertions and API work are identical between builds. All samples are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → text-context

| Method                      |     Before |        IQR |      After |      IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------------- | ---------: | ---------: | ---------: | -------: | ------: | ------------: | -------------: | :------------------- |
| 100/apply.duplicate         |    1033.85 |      86.16 |    1022.94 |   175.70 |  -1.06% |         8.89% |          22.90 |                      |
| 5000/apply.duplicateRemove  |    1184.37 |     322.19 |    1307.93 |   203.09 |  10.43% |        -5.69% |          39.51 |                      |
| 10000/apply.duplicateRemove |    1038.34 |    1009.48 |     762.16 |    97.41 | -26.60% |       -26.60% |          43.80 |                      |
| 10000/apply.insert          |    1479.66 |     133.83 |    2152.68 |   947.43 |  45.48% |        49.94% |          69.97 |                      |
| 100/apply.remove            |    1615.77 |     255.61 |    1602.42 |   200.16 |  -0.83% |         1.71% |          32.14 |                      |
| 25000/apply.replace         |    2899.32 |     347.68 |    2985.37 |  1584.31 |   2.97% |         5.04% |          58.24 |                      |
| 15000/insert.middle         |     549.45 |      13.00 |     488.96 |    37.55 | -11.01% |       -11.87% |           2.97 |                      |
| 15000/insert.sameIndex      |     480.97 |      97.41 |     528.61 |    49.22 |   9.90% |         3.53% |           9.22 |                      |
| 20000/insert.sameIndex      |     450.67 |       3.44 |     480.68 |    25.46 |   6.66% |         7.32% |          12.53 |                      |
| 15000/insert.tail           |     939.30 |     762.56 |     869.19 |   322.12 |  -7.46% |       -23.16% |          41.45 |                      |
| 100/replace.middle          |    1310.13 |     184.06 |    1122.64 |    45.26 | -14.31% |       -12.50% |           7.35 |                      |
| 100/replace.random          |    1824.06 |     151.76 |    1773.08 |   151.42 |  -2.79% |        -7.64% |          24.48 |                      |
| 100/replace.sameIndex       |    1127.00 |      86.76 |    1188.75 |    88.55 |   5.48% |         2.99% |          10.54 |                      |
| 100/retire                  |     168.49 |      14.57 |     176.10 |    15.41 |   4.52% |        -1.93% |           5.58 |                      |
| 100/sequence                |     241.03 |      50.10 |     242.87 |    17.89 |   0.76% |         8.82% |          27.40 |                      |
| 15000/value.head            |      77.20 |       7.17 |      73.44 |     9.51 |  -4.87% |         4.79% |           3.33 |                      |
| 100/value.middle            |     120.96 |      16.26 |     124.55 |    11.32 |   2.97% |       -10.93% |          16.72 |                      |
| 100/value.random            |     113.75 |       0.86 |     117.60 |     3.59 |   3.39% |         2.57% |           4.23 |                      |
| 1000/value.tail             |     104.03 |       4.80 |     111.14 |     5.49 |   6.83% |         5.54% |           3.85 |                      |
| 25000/values                | 4238893.75 | 1402256.25 | 3445389.06 | 77964.06 | -18.72% |       -19.27% |          33.31 |                      |
| 5000/values.head            |     228.98 |      21.11 |     240.34 |     7.40 |   4.96% |         8.01% |          17.24 |                      |
| 15000/values.head           |     233.22 |      16.43 |     250.80 |    48.50 |   7.54% |        16.41% |          37.56 |                      |
| 1000/values.middle          |     398.17 |      20.55 |     409.75 |    82.41 |   2.91% |        -1.83% |           8.33 |                      |
| 1000/values.sameIndex       |     305.64 |      11.34 |     317.87 |    17.41 |   4.00% |         5.99% |           5.80 | yes                  |
| 1000/values.tail            |     261.45 |       7.73 |     270.32 |    12.81 |   3.39% |         4.61% |           6.80 |                      |
| 5000/values.tail            |     283.14 |      21.60 |     281.07 |     3.83 |  -0.73% |        -1.32% |          15.49 |                      |
| 100/apply.replace           |    2518.40 |     877.88 |    2437.09 |    86.72 |  -3.23% |        -4.16% |          22.80 |                      |
