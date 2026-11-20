# export-interleaved: production throughput control

Five fresh process pairs compare 27 selected production case/checkpoint combinations. Within each process, both builds execute each case consecutively; order reverses by case and round. Both receive 10,000 warmup calls, a 1,000,000-call cap for reads and 10,000 for other cases, and the unchanged 100 ms burst limit. Fixtures, assertions and API work are identical between builds. All samples are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → text-export

| Method                      |     Before |       IQR |      After |       IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------------- | ---------: | --------: | ---------: | --------: | ------: | ------------: | -------------: | :------------------- |
| 100/apply.duplicate         |     980.39 |     40.18 |     952.27 |     68.60 |  -2.87% |        -1.77% |           7.50 |                      |
| 5000/apply.duplicateRemove  |    1159.91 |    105.10 |    1467.84 |    154.82 |  26.55% |        26.80% |           2.36 |                      |
| 10000/apply.duplicateRemove |     811.40 |    227.63 |     855.82 |    531.00 |   5.47% |         9.61% |          14.84 |                      |
| 10000/apply.insert          |    1370.54 |     97.03 |    1675.16 |   1076.25 |  22.23% |        19.72% |          76.30 |                      |
| 100/apply.remove            |    1569.32 |    727.28 |    1589.66 |     45.71 |   1.30% |         3.75% |          41.46 |                      |
| 25000/apply.replace         |    3012.43 |   1226.93 |    2781.54 |    151.78 |  -7.66% |        -6.48% |          30.95 |                      |
| 15000/insert.middle         |     533.69 |     64.68 |     597.90 |     54.98 |  12.03% |         5.09% |          28.99 |                      |
| 15000/insert.sameIndex      |     471.28 |     98.75 |     459.85 |     23.73 |  -2.43% |        -3.10% |          28.00 |                      |
| 20000/insert.sameIndex      |     530.70 |     71.81 |     460.12 |     90.31 | -13.30% |         0.01% |          22.38 |                      |
| 15000/insert.tail           |     913.01 |    242.82 |     884.09 |    374.25 |  -3.17% |         7.65% |          75.90 |                      |
| 100/replace.middle          |    1251.87 |    343.05 |    1139.05 |    559.81 |  -9.01% |        -1.11% |          15.54 |                      |
| 100/replace.random          |    1832.56 |     82.39 |    1832.85 |    186.01 |   0.02% |        -6.90% |           9.96 |                      |
| 100/replace.sameIndex       |    1176.80 |      5.19 |    1218.72 |     80.35 |   3.56% |         3.56% |           9.05 |                      |
| 100/retire                  |     173.43 |     39.42 |     176.30 |     25.89 |   1.65% |        -4.42% |          31.46 |                      |
| 100/sequence                |     219.79 |      4.74 |     249.36 |     15.54 |  13.45% |        13.45% |           2.26 | yes                  |
| 15000/value.head            |      71.29 |      9.74 |      70.41 |      6.63 |  -1.23% |         0.15% |           6.34 |                      |
| 100/value.middle            |     112.89 |     14.06 |     117.44 |     17.48 |   4.03% |        14.02% |          13.28 |                      |
| 100/value.random            |     114.79 |      6.41 |     116.77 |      9.09 |   1.72% |         0.72% |           3.78 |                      |
| 1000/value.tail             |     102.87 |      1.83 |     108.76 |      9.38 |   5.73% |         0.41% |           9.87 |                      |
| 25000/values                | 3474120.31 | 372606.25 | 3605029.69 | 728432.81 |   3.77% |         3.77% |          36.92 |                      |
| 5000/values.head            |     244.55 |     41.95 |     240.80 |     15.30 |  -1.53% |        -4.68% |          20.83 |                      |
| 15000/values.head           |     224.07 |     32.26 |     245.56 |     37.81 |   9.59% |        10.52% |          28.97 |                      |
| 1000/values.middle          |     395.40 |     21.89 |     388.72 |      4.48 |  -1.69% |        -1.12% |           9.60 |                      |
| 1000/values.sameIndex       |     326.36 |     42.86 |     303.62 |     14.06 |  -6.97% |        -5.50% |          12.97 |                      |
| 1000/values.tail            |     263.27 |     24.24 |     262.40 |     48.22 |  -0.33% |         3.59% |           9.34 |                      |
| 5000/values.tail            |     281.35 |     10.62 |     271.43 |     10.54 |  -3.53% |        -8.09% |           7.18 |                      |
| 100/apply.replace           |    2838.03 |    454.94 |    2338.76 |    248.58 | -17.59% |       -12.52% |          26.64 |                      |
