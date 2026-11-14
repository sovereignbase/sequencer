# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/endpoint-reuse-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |    IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | -----: | ------: | -----: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   | 1064.06 | 843.16 | 1014.94 | 357.13 |  -4.62% |       -44.55% |          68.31 | 2/5          |
| 256/insert/tail/reverse                   | 2962.60 | 115.53 | 3030.08 | 253.32 |   2.28% |         1.86% |           5.19 | 3/5          |
| 256/insert/tail/shuffled                  | 2149.90 | 116.11 | 2093.95 |  76.95 |  -2.60% |        -1.74% |           5.37 | 2/5          |
| 256/insert/random/ordered                 | 1899.90 | 543.07 | 1072.95 | 141.21 | -43.53% |       -24.26% |          27.78 | 0/5          |
| 256/insert/random/reverse                 | 2145.21 | 586.23 | 1588.96 |  35.16 | -25.93% |       -24.19% |           2.37 | 0/5          |
| 256/insert/random/shuffled                | 1222.75 |  35.45 | 1046.97 |  47.36 | -14.38% |       -14.64% |           4.41 | 1/5          |
| 256/remove/tail/ordered                   | 2454.39 | 426.76 | 1932.13 | 340.82 | -21.28% |       -21.28% |          34.93 | 2/5          |
| 256/remove/tail/reverse                   | 1353.81 | 196.97 | 1250.88 | 136.91 |  -7.60% |        -9.95% |           1.92 | 0/5          |
| 256/remove/tail/shuffled                  | 1965.23 | 208.11 | 1318.07 | 223.83 | -32.93% |       -32.93% |          23.96 | 0/5          |
| 256/remove/random/ordered                 | 1607.13 | 884.18 | 1212.70 | 448.54 | -24.54% |       -35.30% |          11.06 | 0/5          |
| 256/remove/random/reverse                 | 1344.53 | 434.57 | 1109.86 | 110.16 | -17.45% |       -15.14% |          24.37 | 0/5          |
| 256/remove/random/shuffled                | 1508.40 | 396.78 | 1057.42 | 321.09 | -29.90% |       -21.41% |           4.14 | 0/5          |
| 256/replace/tail/ordered                  | 2350.78 | 456.25 | 1811.72 | 380.18 | -22.93% |       -19.77% |          13.89 | 1/5          |
| 256/replace/tail/reverse                  | 2553.61 | 768.07 | 2294.53 | 315.23 | -10.15% |         1.22% |           5.28 | 3/5          |
| 256/replace/tail/shuffled                 | 2499.80 |  49.80 | 1916.70 |  56.05 | -23.33% |       -23.48% |           1.82 | 0/5          |
| 256/replace/random/ordered                | 2041.21 | 516.41 | 1460.74 |  42.77 | -28.44% |       -27.37% |          19.08 | 0/5          |
| 256/replace/random/reverse                | 2140.23 |  69.73 | 1706.64 |  55.47 | -20.26% |       -21.27% |           4.50 | 0/5          |
| 256/replace/random/shuffled               | 2630.96 | 310.64 | 1891.89 | 386.62 | -28.09% |       -21.71% |           5.82 | 0/5          |
| 4096/insert/tail/ordered                  |  719.04 | 212.70 |  622.27 | 134.57 | -13.46% |       -24.77% |          56.31 | 2/5          |
| 4096/insert/tail/reverse                  | 2845.41 |  24.61 | 2884.08 |  77.54 |   1.36% |         1.15% |           4.70 | 3/5          |
| 4096/insert/tail/shuffled                 | 2297.17 | 310.45 | 2143.26 | 271.58 |  -6.70% |        -4.10% |          10.37 | 1/5          |
| 4096/insert/random/ordered                | 1749.51 | 218.36 |  980.27 | 450.78 | -43.97% |       -39.65% |          15.55 | 0/5          |
| 4096/insert/random/reverse                | 1514.94 |  96.78 | 1002.54 | 295.41 | -33.82% |       -38.21% |           1.51 | 0/5          |
| 4096/insert/random/shuffled               | 1727.93 | 155.37 | 1082.62 |  97.36 | -37.35% |       -31.51% |          15.73 | 0/5          |
| 4096/remove/tail/ordered                  | 1091.80 | 114.65 |  870.31 | 182.52 | -20.29% |       -23.17% |          22.21 | 1/5          |
| 4096/remove/tail/reverse                  | 4154.10 | 271.68 | 3894.34 |   9.38 |  -6.25% |       -10.08% |           5.28 | 0/5          |
| 4096/remove/tail/shuffled                 | 4062.89 | 176.76 | 3564.94 | 409.47 | -12.26% |       -12.76% |          13.65 | 1/5          |
| 4096/remove/random/ordered                | 2042.58 | 232.03 | 1117.58 | 227.34 | -45.29% |       -39.56% |           2.00 | 0/5          |
| 4096/remove/random/reverse                | 1838.09 | 295.80 | 1268.16 | 269.63 | -31.01% |       -35.48% |          14.29 | 0/5          |
| 4096/remove/random/shuffled               | 1981.84 |  86.62 | 1289.06 | 214.94 | -34.96% |       -34.96% |          16.98 | 0/5          |
| 4096/replace/tail/ordered                 | 2078.81 |  67.48 | 1511.33 | 172.17 | -27.30% |       -30.86% |           5.49 | 0/5          |
| 4096/replace/tail/reverse                 | 2087.21 |  84.28 | 1847.56 | 294.14 | -11.48% |        -7.24% |          13.74 | 1/5          |
| 4096/replace/tail/shuffled                | 3133.59 | 188.96 | 2301.37 | 537.21 | -26.56% |       -32.44% |          14.99 | 0/5          |
| 4096/replace/random/ordered               | 2969.92 | 256.54 | 1861.82 | 252.44 | -37.31% |       -33.29% |           2.80 | 0/5          |
| 4096/replace/random/reverse               | 3153.71 | 133.11 | 2072.46 | 166.11 | -34.29% |       -32.31% |           5.48 | 0/5          |
| 4096/replace/random/shuffled              | 3123.34 | 358.01 | 2068.65 | 276.86 | -33.77% |       -33.77% |          15.30 | 0/5          |
