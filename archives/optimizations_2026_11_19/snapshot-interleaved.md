# snapshot-interleaved: production throughput control

Five fresh process pairs compare 27 selected production case/checkpoint combinations. Within each process, both builds execute each case consecutively; order reverses by case and round. Both receive 10,000 warmup calls, a 1,000,000-call cap for reads and 10,000 for other cases, and the unchanged 100 ms burst limit. Fixtures, assertions and API work are identical between builds. All samples are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → text-snapshot

| Method                      |     Before |       IQR |      After |       IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------------- | ---------: | --------: | ---------: | --------: | ------: | ------------: | -------------: | :------------------- |
| 100/apply.duplicate         |    1013.26 |     64.07 |     919.70 |    379.18 |  -9.23% |        -4.47% |          26.29 |                      |
| 5000/apply.duplicateRemove  |    1242.50 |    231.48 |    1192.93 |    156.85 |  -3.99% |        -7.54% |          32.09 |                      |
| 10000/apply.duplicateRemove |     797.49 |     73.51 |     785.20 |     39.48 |  -1.54% |        -1.54% |          13.38 |                      |
| 10000/apply.insert          |    1541.78 |     43.73 |    1553.92 |   1362.49 |   0.79% |         3.47% |          85.78 |                      |
| 100/apply.remove            |    1550.83 |    179.13 |    1685.39 |     71.73 |   8.68% |         2.09% |          16.33 |                      |
| 25000/apply.replace         |    3107.75 |    172.72 |    2865.93 |    412.31 |  -7.78% |        -7.98% |          19.68 |                      |
| 15000/insert.middle         |     504.53 |     55.59 |     497.33 |     24.33 |  -1.43% |        -5.39% |           5.68 |                      |
| 15000/insert.sameIndex      |     498.53 |    127.61 |     469.66 |     62.81 |  -5.79% |         0.36% |          15.54 |                      |
| 20000/insert.sameIndex      |     512.64 |     72.72 |     445.43 |     86.06 | -13.11% |       -18.78% |          24.72 |                      |
| 15000/insert.tail           |     813.89 |     97.12 |    1078.74 |    300.61 |  32.54% |        25.56% |          23.31 |                      |
| 100/replace.middle          |    1193.63 |    116.67 |    1151.69 |    243.33 |  -3.51% |        -0.18% |          16.52 |                      |
| 100/replace.random          |    1789.19 |     29.18 |    1859.00 |    169.08 |   3.90% |        -2.75% |           9.10 |                      |
| 100/replace.sameIndex       |    1222.59 |     24.67 |    1187.28 |     52.93 |  -2.89% |        -3.81% |           7.82 |                      |
| 100/retire                  |     170.23 |      5.29 |     165.43 |      7.51 |  -2.82% |        -2.22% |           1.53 |                      |
| 100/sequence                |     230.45 |     17.44 |     275.05 |     89.24 |  19.35% |        23.22% |          42.59 |                      |
| 15000/value.head            |      73.60 |      5.66 |      76.48 |      7.76 |   3.91% |         2.93% |          11.00 |                      |
| 100/value.middle            |     114.02 |      7.80 |     115.19 |      6.13 |   1.02% |        -1.29% |          10.59 |                      |
| 100/value.random            |     114.83 |      3.21 |     117.00 |      4.35 |   1.89% |         3.09% |           8.51 |                      |
| 1000/value.tail             |     119.65 |     22.42 |     111.41 |      2.85 |  -6.89% |        -7.94% |          18.17 |                      |
| 25000/values                | 3510539.06 | 154492.19 | 3572035.94 | 797407.81 |   1.75% |         1.75% |          13.57 |                      |
| 5000/values.head            |     249.49 |     12.32 |     238.32 |     46.09 |  -4.48% |        -4.48% |          11.64 |                      |
| 15000/values.head           |     229.11 |     40.13 |     251.11 |     23.93 |   9.60% |         3.72% |          19.59 |                      |
| 1000/values.middle          |     371.27 |     45.29 |     375.26 |     36.09 |   1.07% |         0.90% |          17.38 |                      |
| 1000/values.sameIndex       |     300.94 |     21.70 |     303.66 |     39.38 |   0.90% |        -0.04% |          16.64 |                      |
| 1000/values.tail            |     252.78 |     14.65 |     245.42 |     22.48 |  -2.91% |         0.79% |          13.50 |                      |
| 5000/values.tail            |     265.57 |      6.39 |     272.83 |      6.45 |   2.73% |         1.56% |           4.73 |                      |
| 100/apply.replace           |    3323.33 |   1449.45 |    2460.83 |    377.63 | -25.95% |       -25.50% |          45.88 |                      |
