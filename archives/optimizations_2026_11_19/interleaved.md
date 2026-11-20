# interleaved: production throughput control

Five paired rounds of 27 selected production case/checkpoint pairs. Fixtures, assertions and API work are unchanged in both builds. This diagnostic increases warmup from 64 to 10,000 calls and the read-call cap from 10,000 to 1,000,000; other cases retain the 10,000-call cap. The 100 ms burst limit is unchanged. Both builds run each case consecutively in the same process, reversing order by case and round. Each round starts a fresh process. All samples are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → text-opt-in

| Method                      |     Before |       IQR |      After |       IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------------- | ---------: | --------: | ---------: | --------: | ------: | ------------: | -------------: | :------------------- |
| 100/apply.duplicate         |    1011.05 |    314.33 |    1073.39 |     78.10 |   6.17% |         3.36% |          45.83 |                      |
| 5000/apply.duplicateRemove  |    1227.02 |    401.36 |    1121.02 |    167.86 |  -8.64% |        -8.64% |          16.42 |                      |
| 10000/apply.duplicateRemove |     825.55 |    793.26 |     814.38 |   1026.82 |  -1.35% |        -7.53% |         172.50 |                      |
| 10000/apply.insert          |    2725.83 |   1599.75 |    1419.92 |     82.04 | -47.91% |       -51.90% |          59.06 |                      |
| 100/apply.remove            |    1765.97 |     95.08 |    1710.01 |    208.39 |  -3.17% |        -0.70% |          14.44 |                      |
| 25000/apply.replace         |    3293.84 |    894.35 |    2910.20 |   1714.26 | -11.65% |         1.30% |          65.64 |                      |
| 15000/insert.middle         |     496.33 |    102.71 |     612.26 |    100.42 |  23.36% |        20.37% |           5.97 | yes                  |
| 15000/insert.sameIndex      |     533.89 |    143.48 |     473.01 |     81.23 | -11.40% |        -6.73% |          28.68 |                      |
| 20000/insert.sameIndex      |     499.76 |      0.99 |     472.00 |     12.61 |  -5.55% |        -4.38% |          13.28 |                      |
| 15000/insert.tail           |     807.25 |     77.75 |     791.62 |    197.65 |  -1.94% |         4.32% |          11.05 |                      |
| 100/replace.middle          |    1337.08 |    363.97 |    1523.58 |    337.94 |  13.95% |         1.48% |          28.50 |                      |
| 100/replace.random          |    1832.78 |    210.80 |    1882.24 |    175.84 |   2.70% |         2.70% |           7.52 |                      |
| 100/replace.sameIndex       |    1143.92 |    216.43 |    1063.76 |     87.29 |  -7.01% |        -6.27% |           1.59 |                      |
| 100/retire                  |     179.77 |     21.93 |     169.81 |     16.31 |  -5.54% |        -3.82% |           3.12 |                      |
| 100/sequence                |     241.80 |      5.34 |     255.55 |     67.59 |   5.69% |         5.69% |          19.69 |                      |
| 15000/value.head            |      68.47 |      2.79 |      73.34 |      2.29 |   7.12% |         7.67% |           6.78 | yes                  |
| 100/value.middle            |     129.40 |     22.04 |     131.65 |     25.00 |   1.74% |         1.74% |          31.79 |                      |
| 100/value.random            |     117.42 |      1.18 |     124.50 |     39.05 |   6.02% |         8.23% |          23.63 |                      |
| 1000/value.tail             |     105.49 |      6.04 |     106.85 |      2.55 |   1.28% |         2.91% |           7.23 |                      |
| 25000/values                | 3630123.44 | 430193.75 | 3875704.69 | 631892.19 |   6.77% |        -6.74% |          15.74 |                      |
| 5000/values.head            |     247.09 |     15.95 |     246.53 |     65.46 |  -0.23% |         9.34% |          19.15 |                      |
| 15000/values.head           |     226.82 |     65.17 |     244.84 |     27.39 |   7.95% |         7.95% |          11.66 |                      |
| 1000/values.middle          |     410.67 |     85.37 |     396.62 |     52.54 |  -3.42% |         2.47% |          10.12 |                      |
| 1000/values.sameIndex       |     325.61 |     17.48 |     332.31 |     25.47 |   2.06% |        -5.02% |          18.10 |                      |
| 1000/values.tail            |     270.72 |      7.78 |     270.58 |     15.89 |  -0.05% |        -1.18% |           5.47 |                      |
| 5000/values.tail            |     278.64 |     15.95 |     272.52 |      4.98 |  -2.20% |        -5.06% |          14.13 |                      |
| 100/apply.replace           |    2284.51 |    762.39 |    2273.63 |    163.37 |  -0.48% |         5.10% |          33.00 |                      |
