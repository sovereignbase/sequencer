# vector-interleaved: production throughput control

Five fresh process pairs compare 27 selected production case/checkpoint combinations. Within each process, both builds execute each case consecutively; order reverses by case and round. Both receive 10,000 warmup calls, a 1,000,000-call cap for reads and 10,000 for other cases, and the unchanged 100 ms burst limit. Fixtures, assertions and API work are identical between builds. All samples are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → text-vector

| Method                      |     Before |       IQR |      After |       IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------------- | ---------: | --------: | ---------: | --------: | ------: | ------------: | -------------: | :------------------- |
| 100/apply.duplicate         |    1235.84 |    162.94 |    1084.44 |    272.83 | -12.25% |         5.77% |          25.69 |                      |
| 5000/apply.duplicateRemove  |    1365.41 |    480.82 |    1207.63 |    175.18 | -11.56% |        -9.10% |          19.98 |                      |
| 10000/apply.duplicateRemove |     853.80 |    511.28 |     794.78 |     32.26 |  -6.91% |        -4.48% |          41.42 |                      |
| 10000/apply.insert          |    1597.61 |   1106.33 |    1508.77 |    267.19 |  -5.56% |        -9.18% |          27.18 |                      |
| 100/apply.remove            |    1913.38 |    627.22 |    1951.31 |    501.35 |   1.98% |         7.08% |           7.71 |                      |
| 25000/apply.replace         |    3028.30 |    109.67 |    3069.19 |   1381.97 |   1.35% |         0.85% |          47.71 |                      |
| 15000/insert.middle         |     572.91 |     74.73 |     662.61 |    253.35 |  15.66% |         6.05% |          64.01 |                      |
| 15000/insert.sameIndex      |     456.64 |     13.05 |     492.13 |     17.09 |   7.77% |         8.34% |           1.21 |                      |
| 20000/insert.sameIndex      |     494.51 |     18.87 |     497.20 |     77.36 |   0.54% |         8.00% |          14.50 |                      |
| 15000/insert.tail           |    1298.28 |    544.48 |     779.46 |     74.01 | -39.96% |       -19.09% |          30.93 |                      |
| 100/replace.middle          |    1197.10 |     58.53 |    1133.06 |     59.64 |  -5.35% |        -5.35% |           4.69 |                      |
| 100/replace.random          |    1729.12 |     27.44 |    1785.26 |    314.82 |   3.25% |         5.54% |          17.75 |                      |
| 100/replace.sameIndex       |    1034.38 |    197.64 |    1207.40 |    165.71 |  16.73% |        18.80% |          33.29 |                      |
| 100/retire                  |     182.47 |     77.05 |     208.15 |     32.72 |  14.07% |        -2.83% |          45.15 |                      |
| 100/sequence                |     254.30 |     29.18 |     339.24 |    177.53 |  33.40% |        15.62% |           9.95 | yes                  |
| 15000/value.head            |      72.97 |      7.26 |      77.71 |      2.96 |   6.49% |        10.09% |          15.37 |                      |
| 100/value.middle            |     113.70 |     22.76 |     109.11 |     26.43 |  -4.04% |         8.69% |          10.08 |                      |
| 100/value.random            |     128.00 |     18.75 |     118.59 |     10.43 |  -7.35% |         2.48% |          26.33 |                      |
| 1000/value.tail             |     108.84 |     16.85 |     107.34 |      5.30 |  -1.38% |        -1.38% |          25.19 |                      |
| 25000/values                | 3885989.06 | 740706.25 | 3734987.50 | 144015.63 |  -3.89% |         9.66% |          18.42 |                      |
| 5000/values.head            |     237.30 |     23.70 |     233.81 |     15.56 |  -1.47% |         2.19% |           6.35 |                      |
| 15000/values.head           |     233.48 |     56.34 |     246.08 |     40.33 |   5.40% |        -3.09% |          35.69 |                      |
| 1000/values.middle          |     389.62 |     26.47 |     373.87 |     25.67 |  -4.04% |        -1.74% |          11.27 |                      |
| 1000/values.sameIndex       |     297.15 |     15.81 |     313.79 |     26.94 |   5.60% |         8.10% |           8.66 |                      |
| 1000/values.tail            |     276.31 |     11.08 |     284.59 |     10.52 |   3.00% |         4.46% |           8.70 |                      |
| 5000/values.tail            |     278.54 |     29.29 |     285.43 |     34.46 |   2.47% |         7.67% |          20.05 |                      |
| 100/apply.replace           |    2411.50 |    542.68 |    2394.59 |     86.79 |  -0.70% |         1.75% |          15.45 |                      |
