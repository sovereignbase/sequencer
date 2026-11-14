# Long-Insertion sequence diagnostics

Five rotating/reversed matched rounds through the public API. Each fixture authors one positive Insertion, applies fixed single/sparse/alternating removals, and verifies all visible values and exported Footage. Each case has 25 ms warmup, explicit JS process GC, and 50 ms measured sequence work, timed in bursts. Setup, deletion and verification are outside timings. This supplementary workload does not replace the production regression guard. Times are median ns/call.

## reserved-slot → removal-ranges

| Frames / pattern |     Before |      IQR |     After |      IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :--------------- | ---------: | -------: | --------: | -------: | ------: | ------------: | -------------: | :------------------- |
| 8/single         |    1129.77 |   238.26 |   1186.24 |   212.43 |   5.00% |        -0.43% |          17.71 |                      |
| 8/sparse         |     639.24 |    12.59 |    645.82 |    25.64 |   1.03% |        -1.16% |           3.46 |                      |
| 8/alternating    |    1240.78 |    42.21 |   1315.14 |    29.15 |   5.99% |         5.69% |           3.48 | yes                  |
| 1024/single      |    7229.63 |   244.39 |   3184.85 |    40.53 | -55.95% |       -55.68% |           2.03 |                      |
| 1024/sparse      |   10086.46 |   223.81 |   7702.04 |   321.90 | -23.64% |       -23.64% |           5.15 |                      |
| 1024/alternating |   69698.96 |  3745.83 |  88249.35 |  2289.45 |  26.62% |        27.98% |           0.84 | yes                  |
| 100000/single    | 1071016.67 | 10708.33 | 670223.75 | 30077.22 | -37.42% |       -35.85% |           2.01 |                      |
| 100000/sparse    |  851560.94 | 18975.00 | 465159.82 | 36976.72 | -45.38% |       -46.01% |           0.84 |                      |

## reserved-slot → range-before

| Frames / pattern |     Before |      IQR |     After |     IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :--------------- | ---------: | -------: | --------: | ------: | ------: | ------------: | -------------: | :------------------- |
| 8/single         |    1129.77 |   238.26 |   1130.57 |   71.23 |   0.07% |         4.90% |          10.31 |                      |
| 8/sparse         |     639.24 |    12.59 |    637.26 |   42.42 |  -0.31% |        -1.50% |           2.26 |                      |
| 8/alternating    |    1240.78 |    42.21 |   1363.06 |   17.88 |   9.85% |        13.64% |           5.80 | yes                  |
| 1024/single      |    7229.63 |   244.39 |   3389.91 |  156.60 | -53.11% |       -52.62% |           0.12 |                      |
| 1024/sparse      |   10086.46 |   223.81 |   7889.35 |  177.81 | -21.78% |       -21.21% |           6.41 |                      |
| 1024/alternating |   69698.96 |  3745.83 |  91036.33 | 2442.71 |  30.61% |        30.61% |           9.67 | yes                  |
| 100000/single    | 1071016.67 | 10708.33 | 724329.17 | 9508.33 | -32.37% |       -31.57% |           3.05 |                      |
| 100000/sparse    |  851560.94 | 18975.00 | 491345.19 | 4263.46 | -42.30% |       -42.85% |           0.96 |                      |
