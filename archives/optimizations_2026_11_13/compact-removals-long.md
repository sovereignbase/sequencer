# Long-Insertion sequence diagnostics

Five rotating/reversed matched rounds through the public API. Each fixture authors one positive Insertion, applies fixed single/sparse/alternating removals, and verifies all visible values and exported Footage. Each case has 25 ms warmup, explicit JS process GC, and 50 ms measured sequence work, timed in bursts. Setup, deletion and verification are outside timings. This supplementary workload does not replace the production regression guard. Times are median ns/call.

## signed-slice → compact-removals

| Frames / pattern |     Before |      IQR |      After |      IQR | Change | Paired change | Paired IQR, pp | Slower in every pair |
| :--------------- | ---------: | -------: | ---------: | -------: | -----: | ------------: | -------------: | :------------------- |
| 8/single         |    1171.18 |   215.29 |    1271.09 |   175.89 |  8.53% |        -5.09% |           6.29 |                      |
| 8/sparse         |     665.14 |    51.21 |     622.11 |    43.78 | -6.47% |       -10.78% |           5.44 |                      |
| 8/alternating    |    1254.25 |    28.78 |    1232.06 |    95.51 | -1.77% |        -1.77% |           5.06 |                      |
| 1024/single      |    7164.96 |   170.51 |    7130.98 |    58.87 | -0.47% |         1.08% |           6.07 |                      |
| 1024/sparse      |   10301.07 |    92.86 |    9844.27 |   118.27 | -4.43% |        -4.37% |           3.25 |                      |
| 1024/alternating |   70168.10 |  3949.87 |   63306.74 |  3395.38 | -9.78% |        -7.12% |           0.79 |                      |
| 100000/single    | 1094191.67 | 69004.17 | 1047927.08 | 44434.52 | -4.23% |        -7.27% |           4.42 |                      |
| 100000/sparse    |  859800.00 | 81153.57 |  898519.64 | 96389.96 |  4.50% |         2.95% |           5.53 |                      |
