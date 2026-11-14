# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/two-slots-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |     IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | ------: | ------: | -----: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   |  875.59 |  266.60 |  950.29 | 309.96 |   8.53% |         8.06% |          66.80 | 3/5          |
| 256/insert/tail/reverse                   | 2962.30 |   70.70 | 2963.28 | 177.44 |   0.03% |        -1.33% |           4.62 | 2/5          |
| 256/insert/tail/shuffled                  | 2614.84 |  499.41 | 2689.94 | 904.20 |   2.87% |        -5.98% |          19.50 | 2/5          |
| 256/insert/random/ordered                 | 1352.54 |  114.16 | 1110.74 | 158.50 | -17.88% |       -17.88% |          17.61 | 1/5          |
| 256/insert/random/reverse                 | 1148.24 |  250.49 |  832.71 |  49.02 | -27.48% |       -24.27% |           4.66 | 1/5          |
| 256/insert/random/shuffled                | 1136.82 |  195.31 |  916.11 |  61.72 | -19.41% |       -14.23% |           4.18 | 0/5          |
| 256/remove/tail/ordered                   | 1189.16 |   94.53 | 1067.68 | 947.27 | -10.22% |       -11.03% |          14.01 | 1/5          |
| 256/remove/tail/reverse                   | 1120.80 |  135.45 |  918.16 |  76.86 | -18.08% |       -12.24% |          16.27 | 1/5          |
| 256/remove/tail/shuffled                  | 1222.46 |   18.16 | 1052.64 | 154.59 | -13.89% |       -15.55% |          12.86 | 1/5          |
| 256/remove/random/ordered                 | 1323.14 |   38.57 | 1023.54 | 183.01 | -22.64% |       -22.49% |           4.62 | 0/5          |
| 256/remove/random/reverse                 | 1193.85 |    9.38 | 1045.31 |  45.41 | -12.44% |       -11.89% |           3.94 | 0/5          |
| 256/remove/random/shuffled                | 1297.66 |  184.67 | 1080.86 | 123.05 | -16.71% |       -20.99% |           2.13 | 0/5          |
| 256/replace/tail/ordered                  | 2120.12 | 1682.32 | 1721.29 | 960.84 | -18.81% |       -25.43% |          88.61 | 2/5          |
| 256/replace/tail/reverse                  | 2051.37 |  331.45 | 2089.26 | 239.06 |   1.85% |        -8.49% |          18.56 | 2/5          |
| 256/replace/tail/shuffled                 | 2938.48 |  748.05 | 2459.28 | 319.34 | -16.31% |       -11.05% |          16.94 | 1/5          |
| 256/replace/random/ordered                | 2099.90 |   71.29 | 1542.77 |  40.72 | -26.53% |       -26.62% |           3.37 | 0/5          |
| 256/replace/random/reverse                | 2449.51 |  151.76 | 1728.03 |  16.89 | -29.45% |       -29.45% |           5.63 | 0/5          |
| 256/replace/random/shuffled               | 2241.89 |  232.23 | 1702.73 |  50.39 | -24.05% |       -25.10% |           5.15 | 0/5          |
| 4096/insert/tail/ordered                  |  639.36 |  243.65 |  588.67 |  47.66 |  -7.93% |        -6.38% |          47.81 | 2/5          |
| 4096/insert/tail/reverse                  | 2974.32 |   88.87 | 2966.89 | 128.13 |  -0.25% |        -0.25% |           1.44 | 2/5          |
| 4096/insert/tail/shuffled                 | 2190.62 |  130.18 | 2229.30 | 112.79 |   1.77% |        -2.27% |           5.77 | 2/5          |
| 4096/insert/random/ordered                | 1512.79 |  213.96 | 1057.03 | 175.00 | -30.13% |       -32.65% |           9.98 | 0/5          |
| 4096/insert/random/reverse                | 1576.56 |  181.25 | 1034.38 | 302.15 | -34.39% |       -31.35% |          10.76 | 1/5          |
| 4096/insert/random/shuffled               | 1657.42 |   43.16 | 1059.38 | 121.87 | -36.08% |       -41.36% |           5.15 | 0/5          |
| 4096/remove/tail/ordered                  | 1046.39 |   12.99 |  843.65 | 115.72 | -19.37% |       -16.79% |           8.22 | 0/5          |
| 4096/remove/tail/reverse                  | 4276.46 |  213.96 | 3994.53 | 164.94 |  -6.59% |        -5.05% |           4.70 | 0/5          |
| 4096/remove/tail/shuffled                 | 3862.60 |  620.02 | 3626.37 | 212.21 |  -6.12% |        -8.97% |           2.81 | 0/5          |
| 4096/remove/random/ordered                | 1800.20 |  243.26 | 1171.00 | 237.11 | -34.95% |       -38.04% |           5.79 | 0/5          |
| 4096/remove/random/reverse                | 1962.60 |  125.29 | 1280.27 | 187.21 | -34.77% |       -34.77% |          11.03 | 0/5          |
| 4096/remove/random/shuffled               | 1917.97 |   44.53 | 1227.34 | 109.18 | -36.01% |       -34.45% |           5.93 | 0/5          |
| 4096/replace/tail/ordered                 | 1986.91 |   48.05 | 1372.95 |   8.69 | -30.90% |       -29.85% |           1.20 | 0/5          |
| 4096/replace/tail/reverse                 | 2200.29 |  158.40 | 2000.98 | 165.14 |  -9.06% |        -9.75% |           3.47 | 0/5          |
| 4096/replace/tail/shuffled                | 3356.74 |  152.54 | 2145.70 | 146.19 | -36.08% |       -36.05% |           1.59 | 0/5          |
| 4096/replace/random/ordered               | 2801.27 |  104.49 | 1818.75 | 203.91 | -35.07% |       -29.89% |           9.81 | 0/5          |
| 4096/replace/random/reverse               | 3112.11 |  230.47 | 1926.27 | 110.74 | -38.10% |       -40.94% |           2.89 | 0/5          |
| 4096/replace/random/shuffled              | 3084.18 |  140.23 | 2085.45 | 263.18 | -32.38% |       -37.80% |           9.51 | 0/5          |
