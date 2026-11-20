# shared-interleaved: production throughput control

Five fresh process pairs compare 27 selected production case/checkpoint combinations. Within each process, both builds execute each case consecutively; order reverses by case and round. Both receive 10,000 warmup calls, a 1,000,000-call cap for reads and 10,000 for other cases, and the unchanged 100 ms burst limit. Fixtures, assertions and API work are identical between builds. All samples are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → text-shared

| Method                      |     Before |       IQR |      After |       IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------------- | ---------: | --------: | ---------: | --------: | ------: | ------------: | -------------: | :------------------- |
| 100/apply.duplicate         |     917.95 |     70.35 |     879.77 |    120.45 |  -4.16% |        -9.31% |          21.73 |                      |
| 5000/apply.duplicateRemove  |    1128.69 |    199.36 |    1194.92 |     38.81 |   5.87% |         1.96% |           8.05 |                      |
| 10000/apply.duplicateRemove |     822.74 |     60.00 |     900.18 |    572.08 |   9.41% |        25.91% |          75.78 |                      |
| 10000/apply.insert          |    1532.91 |    213.84 |    1429.42 |     38.11 |  -6.75% |       -15.38% |          22.06 |                      |
| 100/apply.remove            |    1529.72 |    211.55 |    1626.17 |    124.34 |   6.31% |        -5.02% |          15.15 |                      |
| 25000/apply.replace         |    3157.43 |    480.73 |    3186.39 |    554.61 |   0.92% |         0.04% |          33.10 |                      |
| 15000/insert.middle         |     528.71 |     59.71 |     502.70 |     40.65 |  -4.92% |        -3.82% |          10.33 |                      |
| 15000/insert.sameIndex      |     450.79 |     32.08 |     508.16 |     83.87 |  12.73% |        -5.15% |          28.02 |                      |
| 20000/insert.sameIndex      |     472.82 |     28.47 |     532.48 |     13.44 |  12.62% |        12.29% |          10.99 | yes                  |
| 15000/insert.tail           |    1164.88 |    363.79 |     945.26 |    548.30 | -18.85% |         0.90% |          70.06 |                      |
| 100/replace.middle          |    1070.38 |    209.68 |    1094.64 |    218.27 |   2.27% |         2.58% |           1.61 |                      |
| 100/replace.random          |    1708.36 |    112.28 |    1811.56 |    156.57 |   6.04% |        12.41% |          10.63 | yes                  |
| 100/replace.sameIndex       |    1224.11 |     77.61 |    1252.43 |    106.79 |   2.31% |         5.54% |          13.34 |                      |
| 100/retire                  |     165.64 |      9.70 |     167.20 |     18.74 |   0.94% |        -0.68% |           4.12 |                      |
| 100/sequence                |     238.42 |      7.10 |     263.69 |     18.72 |  10.60% |         6.39% |          15.65 | yes                  |
| 15000/value.head            |      70.41 |      3.84 |      72.58 |      2.50 |   3.09% |         5.49% |           2.75 |                      |
| 100/value.middle            |     125.81 |     10.55 |     119.02 |      6.39 |  -5.40% |        -7.93% |          11.46 |                      |
| 100/value.random            |     112.86 |      1.79 |     113.06 |      0.41 |   0.18% |        -1.43% |           3.06 |                      |
| 1000/value.tail             |     105.09 |      2.50 |     110.54 |      4.08 |   5.19% |         3.00% |           1.46 |                      |
| 25000/values                | 3440026.56 | 213840.63 | 3243354.69 | 706525.00 |  -5.72% |        -9.76% |           8.77 |                      |
| 5000/values.head            |     230.62 |     26.62 |     244.16 |      7.31 |   5.87% |        11.31% |           7.88 |                      |
| 15000/values.head           |     215.78 |     49.26 |     239.18 |     27.24 |  10.84% |        10.84% |          36.30 |                      |
| 1000/values.middle          |     366.09 |     56.47 |     369.70 |     30.79 |   0.98% |        -3.34% |           7.67 |                      |
| 1000/values.sameIndex       |     320.06 |     35.80 |     288.43 |     23.67 |  -9.88% |        -4.64% |           7.36 |                      |
| 1000/values.tail            |     245.11 |     25.40 |     242.80 |      8.71 |  -0.94% |        -0.94% |           5.00 |                      |
| 5000/values.tail            |     267.07 |     17.59 |     262.49 |     15.79 |  -1.72% |        -1.72% |          13.46 |                      |
| 100/apply.replace           |    2374.19 |    193.66 |    2292.60 |     35.26 |  -3.44% |        -6.33% |           9.24 |                      |
