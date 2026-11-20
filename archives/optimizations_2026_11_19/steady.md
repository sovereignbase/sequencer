# steady: production throughput control

Five paired rounds of 26 selected production case/checkpoint pairs. Fixtures, assertions and API work are unchanged in both builds. This diagnostic increases warmup from 64 to 10,000 calls and the read-call cap from 10,000 to 1,000,000; other cases retain the 10,000-call cap. The 100 ms burst limit is unchanged. Each build runs in a separate fresh process; build order rotates and reverses. All samples are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → text-opt-in

| Method                      |     Before |       IQR |      After |      IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------------- | ---------: | --------: | ---------: | -------: | ------: | ------------: | -------------: | :------------------- |
| 100/apply.duplicate         |     870.04 |     58.54 |     998.60 |   165.13 |  14.78% |        14.76% |           5.11 |                      |
| 100/apply.remove            |    1828.17 |    140.28 |    1840.72 |    20.64 |   0.69% |         2.79% |           3.44 |                      |
| 100/replace.middle          |    1489.40 |    147.86 |    1560.19 |   179.06 |   4.75% |        -2.00% |          21.59 |                      |
| 100/replace.random          |    2290.41 |     83.64 |    2476.87 |   357.55 |   8.14% |        -1.18% |           9.80 |                      |
| 100/replace.sameIndex       |    1276.85 |     14.21 |    1256.55 |    95.81 |  -1.59% |        -0.60% |           6.87 |                      |
| 100/retire                  |     419.28 |     82.48 |     360.30 |    58.82 | -14.07% |        -4.78% |          11.77 |                      |
| 100/sequence                |     316.23 |     40.02 |     321.75 |    18.64 |   1.75% |         5.90% |          15.84 |                      |
| 100/value.middle            |     108.30 |     13.22 |     119.77 |    15.08 |  10.59% |         4.26% |           6.74 |                      |
| 100/value.random            |     121.55 |      3.62 |     130.76 |    10.30 |   7.58% |         9.96% |          13.74 |                      |
| 5000/apply.duplicateRemove  |     771.94 |     20.27 |     866.62 |   302.11 |  12.27% |        11.83% |          36.69 |                      |
| 5000/values.head            |     251.38 |     43.30 |     241.81 |    18.22 |  -3.81% |         7.45% |          23.36 |                      |
| 5000/values.tail            |     250.05 |     45.84 |     246.66 |    28.05 |  -1.35% |         0.20% |           9.94 |                      |
| 10000/apply.duplicateRemove |     789.67 |     35.92 |     782.00 |    53.74 |  -0.97% |        -2.26% |          11.43 |                      |
| 10000/apply.insert          |    1799.63 |     34.87 |    1918.10 |   144.47 |   6.58% |        -0.17% |          11.59 |                      |
| 25000/apply.replace         |    2839.25 |    143.39 |    2799.17 |    75.20 |  -1.41% |         0.19% |           8.17 |                      |
| 25000/values                | 3211281.25 | 272131.25 | 3086137.50 | 42037.50 |  -3.90% |        -2.75% |           1.73 |                      |
| 15000/insert.middle         |     685.10 |    102.45 |     635.41 |    21.74 |  -7.25% |       -13.45% |          14.66 |                      |
| 15000/insert.sameIndex      |     604.83 |      4.07 |     575.02 |    18.58 |  -4.93% |        -2.94% |          10.65 |                      |
| 15000/insert.tail           |     852.04 |    101.97 |    1124.52 |   145.85 |  31.98% |        19.22% |           2.46 | yes                  |
| 15000/value.head            |      85.35 |     11.50 |      75.25 |     1.61 | -11.84% |       -11.84% |          19.28 |                      |
| 15000/values.head           |     253.12 |     36.49 |     271.38 |    16.72 |   7.21% |        -1.17% |          17.85 |                      |
| 20000/insert.sameIndex      |     519.43 |     27.05 |     554.80 |     8.28 |   6.81% |         6.97% |           6.64 | yes                  |
| 1000/value.tail             |     111.59 |     10.74 |     107.53 |     8.77 |  -3.64% |         2.42% |          16.20 |                      |
| 1000/values.middle          |     393.82 |     44.26 |     353.39 |    30.40 | -10.27% |        -2.99% |          15.77 |                      |
| 1000/values.sameIndex       |     273.19 |      6.40 |     278.93 |     1.16 |   2.10% |         2.61% |           2.47 |                      |
| 1000/values.tail            |     211.07 |     11.14 |     230.98 |    17.00 |   9.43% |         7.43% |           5.63 |                      |
