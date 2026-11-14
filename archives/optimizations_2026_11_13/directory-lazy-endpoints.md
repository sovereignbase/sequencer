# directory-lazy-endpoints: production throughput control

10 matched rounds of 5 production throughput cases at 100, 1000, 20000 starting Strips. Case/checkpoint selection is recorded explicitly; preparation, warmup, work, checks and timing limits are unchanged. Build order rotates and reverses; all samples, including slower results, are retained.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## directory-records → directory-lazy

| Method                |  Before |    IQR |   After |    IQR | Change | Paired change | Paired IQR, pp | Slower in every pair |
| :-------------------- | ------: | -----: | ------: | -----: | -----: | ------------: | -------------: | :------------------- |
| 100/insert.tail       | 1407.49 | 114.07 | 1324.43 | 114.76 | -5.90% |        -6.13% |           8.10 |                      |
| 1000/insert.tail      | 1060.76 | 385.54 | 1081.85 | 234.58 |  1.99% |        -3.73% |           9.13 |                      |
| 20000/insert.tail     | 1013.52 | 175.13 |  925.00 |  99.50 | -8.73% |        -5.42% |          14.21 |                      |
| 100/merge.duplicate   | 1967.24 | 210.35 | 1965.85 | 264.46 | -0.07% |         3.34% |          27.95 |                      |
| 1000/merge.duplicate  | 1076.39 |  70.39 | 1002.71 |  56.12 | -6.85% |        -6.15% |           9.98 |                      |
| 20000/merge.duplicate |  557.37 |  36.80 |  558.38 |  96.91 |  0.18% |         1.08% |          17.67 |                      |
| 100/remove.head       | 2128.85 | 228.10 | 2112.51 | 486.19 | -0.77% |        -2.20% |          29.78 |                      |
| 1000/remove.head      |  882.38 |  76.62 |  795.93 |  20.19 | -9.80% |       -10.40% |           2.02 |                      |
| 20000/remove.head     | 1039.59 |  80.54 | 1004.03 | 131.17 | -3.42% |        -0.74% |           7.91 |                      |
| 100/remove.tail       | 1057.86 | 143.75 | 1021.63 | 114.58 | -3.42% |        -3.43% |          18.04 |                      |
| 1000/remove.tail      |  730.63 |   8.00 |  695.06 |  19.24 | -4.87% |        -4.29% |           4.93 |                      |
| 20000/remove.tail     |  918.47 | 104.85 |  882.85 |  71.00 | -3.88% |        -6.66% |           6.07 |                      |
| 100/values.head       |  346.18 |  33.84 |  357.94 |  24.56 |  3.40% |         0.04% |          17.71 |                      |
| 1000/values.head      |  333.64 |  64.84 |  338.47 |  43.33 |  1.45% |        -2.86% |          27.15 |                      |
| 20000/values.head     |  332.35 |  36.43 |  367.04 |  67.54 | 10.44% |         4.82% |          22.19 |                      |
