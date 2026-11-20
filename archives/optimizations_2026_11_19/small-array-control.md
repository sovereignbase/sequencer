# Small array control

Five fresh processes per build, rotated/reversed order. The complete 1,024-code-unit array-mode text workload is unchanged: 10 ms warmup, 25 ms measurement, existing call caps. Baseline and control have identical runtime sources. All 19 operations and all valid samples are retained. Latencies are median ns/call; paired IQR is percentage points.

| Operation            |   Before | Identical control |    After |  Change | After / control | Paired IQR | Over 5% in every baseline pair | Over 5% in every control pair |
| -------------------- | -------: | ----------------: | -------: | ------: | --------------: | ---------: | :----------------------------- | :---------------------------- |
| insert               |  2486.73 |           2586.76 |  3010.22 |  21.05% |          16.37% |      36.35 |                                |                               |
| insert.append        | 12727.84 |          12115.75 | 13461.73 |   5.77% |          11.11% |      11.13 |                                |                               |
| replace              |  6889.17 |           7183.97 |  8003.27 |  16.17% |          11.40% |      21.31 |                                |                               |
| remove               |  3742.73 |           4003.41 |  4083.99 |   9.12% |           2.01% |      11.14 |                                |                               |
| remove.middle        |  2031.37 |           2008.52 |  2192.11 |   7.91% |           9.14% |      14.72 |                                |                               |
| replace.middle       |  2333.54 |           2286.45 |  2464.87 |   5.63% |           7.80% |      16.43 |                                |                               |
| apply                |   722.94 |            794.59 |   883.06 |  22.15% |          11.13% |      20.33 |                                |                               |
| apply.array          |   583.79 |            579.94 |   586.71 |   0.50% |           1.17% |      43.43 |                                |                               |
| concurrent.apply     | 66096.04 |          63100.00 | 66008.18 |  -0.13% |           4.61% |       1.00 |                                |                               |
| merge                |  2989.69 |           3003.38 |  3005.35 |   0.52% |           0.07% |       4.49 |                                |                               |
| create               |  3123.41 |           3084.43 |  3151.73 |   0.91% |           2.18% |       1.79 |                                |                               |
| value.random         |    44.60 |             48.94 |    45.62 |   2.29% |          -6.78% |       7.32 |                                |                               |
| values.range         |   143.00 |            110.81 |   112.92 | -21.03% |           1.90% |      26.41 |                                |                               |
| values.array         |  1328.88 |           1352.07 |  1595.40 |  20.06% |          18.00% |      19.30 |                                |                               |
| values.text          | 13085.77 |          13872.21 | 13117.47 |   0.24% |          -5.44% |       5.77 |                                |                               |
| sequence.array       |  1502.67 |           1576.00 |  1573.12 |   4.69% |          -0.18% |      19.21 |                                |                               |
| sequence.text        | 10441.50 |          10554.50 |  9533.78 |  -8.69% |          -9.67% |       5.78 |                                |                               |
| sequence.edited.text | 14677.46 |          14893.39 | 13981.16 |  -4.74% |          -6.13% |       1.31 |                                |                               |
| sequence.masked.text | 12480.59 |          12717.29 | 10916.11 | -12.54% |         -14.16% |       4.70 |                                |                               |
