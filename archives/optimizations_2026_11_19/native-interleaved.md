# native-interleaved: production throughput control

Five fresh process pairs compare 27 selected production case/checkpoint combinations. Within each process, both builds execute each case consecutively; order reverses by case and round. Both receive 10,000 warmup calls, a 1,000,000-call cap for reads and 10,000 for other cases, and the unchanged 100 ms burst limit. Fixtures, assertions and API work are identical between builds. All samples are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → text-native-share

| Method                      |     Before |       IQR |      After |       IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------------- | ---------: | --------: | ---------: | --------: | ------: | ------------: | -------------: | :------------------- |
| 100/apply.duplicate         |     981.80 |    123.79 |    1069.55 |    488.87 |   8.94% |         9.82% |          67.19 |                      |
| 5000/apply.duplicateRemove  |    1370.20 |    337.21 |    1196.09 |    330.26 | -12.71% |        -1.66% |          25.07 |                      |
| 10000/apply.duplicateRemove |     894.45 |     28.70 |     880.81 |     32.97 |  -1.52% |        -1.26% |          14.44 |                      |
| 10000/apply.insert          |    1473.41 |    160.17 |    1376.06 |     53.93 |  -6.61% |        -8.74% |           4.67 |                      |
| 100/apply.remove            |    1671.77 |    191.57 |    1590.59 |    104.59 |  -4.86% |         1.27% |           2.30 |                      |
| 25000/apply.replace         |    3108.19 |   1085.77 |    3133.78 |    228.26 |   0.82% |         0.82% |          23.27 |                      |
| 15000/insert.middle         |     557.43 |     16.16 |     581.18 |     83.60 |   4.26% |        -1.11% |          11.73 |                      |
| 15000/insert.sameIndex      |     457.67 |     87.78 |     433.88 |     51.45 |  -5.20% |         0.83% |          21.15 |                      |
| 20000/insert.sameIndex      |     442.53 |    120.55 |     478.73 |     99.21 |   8.18% |         1.17% |           9.13 |                      |
| 15000/insert.tail           |     858.35 |     59.71 |     875.68 |    184.77 |   2.02% |        -4.04% |          36.96 |                      |
| 100/replace.middle          |    1525.05 |    636.30 |    1350.19 |    169.52 | -11.47% |       -11.47% |          46.86 |                      |
| 100/replace.random          |    1831.62 |     39.57 |    1870.32 |    299.50 |   2.11% |        -0.36% |           8.23 |                      |
| 100/replace.sameIndex       |    1152.90 |    154.73 |    1115.14 |    113.08 |  -3.28% |        -3.46% |           4.44 |                      |
| 100/retire                  |     178.58 |     27.56 |     174.12 |      7.32 |  -2.50% |        -2.50% |           9.89 |                      |
| 100/sequence                |     235.48 |     33.04 |     307.34 |     80.86 |  30.52% |        11.47% |          21.41 | yes                  |
| 15000/value.head            |      81.84 |     13.63 |      76.55 |      5.13 |  -6.46% |         5.06% |          11.80 |                      |
| 100/value.middle            |     122.78 |     13.38 |     121.41 |      2.68 |  -1.12% |        -6.28% |          12.74 |                      |
| 100/value.random            |     120.54 |      5.38 |     119.31 |      2.44 |  -1.02% |        -1.52% |           3.75 |                      |
| 1000/value.tail             |     110.84 |     20.19 |     109.01 |     18.81 |  -1.65% |        -1.65% |           2.69 |                      |
| 25000/values                | 3186560.94 | 334187.50 | 3416632.81 | 267331.25 |   7.22% |         2.36% |           9.36 |                      |
| 5000/values.head            |     233.68 |      8.44 |     242.87 |     52.08 |   3.93% |         5.59% |          22.25 |                      |
| 15000/values.head           |     225.65 |     34.64 |     244.63 |     22.24 |   8.41% |         9.36% |          23.66 |                      |
| 1000/values.middle          |     399.87 |     35.83 |     395.41 |     22.13 |  -1.11% |         0.77% |          15.55 |                      |
| 1000/values.sameIndex       |     292.70 |     24.86 |     307.05 |     24.80 |   4.91% |         1.94% |          11.29 |                      |
| 1000/values.tail            |     253.62 |     72.87 |     269.51 |     28.31 |   6.26% |        -4.62% |          10.17 |                      |
| 5000/values.tail            |     294.90 |     26.36 |     286.41 |      5.99 |  -2.88% |        -2.88% |           1.71 |                      |
| 100/apply.replace           |    3594.10 |   1740.97 |    2378.75 |     70.05 | -33.82% |       -13.72% |          39.17 |                      |
