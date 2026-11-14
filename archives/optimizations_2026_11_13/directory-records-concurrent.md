# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/directory-records-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |     IQR |   After |     IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | ------: | ------: | ------: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   |  667.29 |  104.20 |  989.65 |  132.23 |  48.31% |        30.68% |          59.10 | 3/5          |
| 256/insert/tail/reverse                   | 3003.52 |  236.23 | 2929.39 |   49.41 |  -2.47% |        -2.64% |           8.59 | 0/5          |
| 256/insert/tail/shuffled                  | 2301.27 |  187.21 | 2233.20 |   82.32 |  -2.96% |        -3.43% |           5.95 | 2/5          |
| 256/insert/random/ordered                 | 1321.48 |  133.89 | 1017.29 |  550.10 | -23.02% |       -21.90% |           4.02 | 1/5          |
| 256/insert/random/reverse                 | 1366.80 |  113.57 | 1061.13 |  112.70 | -22.36% |       -22.36% |          35.47 | 2/5          |
| 256/insert/random/shuffled                | 1272.85 |  103.03 | 1060.74 |  296.09 | -16.66% |        -8.36% |          29.72 | 2/5          |
| 256/remove/tail/ordered                   | 1585.45 |  666.80 | 1158.79 |  529.39 | -26.91% |       -33.63% |          38.12 | 1/5          |
| 256/remove/tail/reverse                   | 1298.63 |  158.50 | 1031.54 |  167.58 | -20.57% |       -17.28% |          14.33 | 1/5          |
| 256/remove/tail/shuffled                  | 1425.49 |  121.09 | 1241.50 |  179.49 | -12.91% |       -16.20% |          19.35 | 1/5          |
| 256/remove/random/ordered                 | 1688.57 |  122.07 | 1462.01 |  506.54 | -13.42% |       -17.26% |           2.67 | 1/5          |
| 256/remove/random/reverse                 | 1348.73 |   16.02 | 1095.12 |   76.17 | -18.80% |       -17.82% |           4.65 | 0/5          |
| 256/remove/random/shuffled                | 1457.62 |  101.86 | 1179.88 |  257.52 | -19.05% |       -19.05% |          26.63 | 0/5          |
| 256/replace/tail/ordered                  | 2506.15 |  525.98 | 2005.37 |  414.65 | -19.98% |       -17.98% |           6.33 | 1/5          |
| 256/replace/tail/reverse                  | 2295.61 |  349.71 | 2258.20 |  141.31 |  -1.63% |        -6.50% |          18.77 | 2/5          |
| 256/replace/tail/shuffled                 | 2845.90 |  140.23 | 2337.40 |  188.96 | -17.87% |       -16.44% |           5.04 | 0/5          |
| 256/replace/random/ordered                | 3993.36 | 1041.60 | 2209.28 | 1200.00 | -44.68% |       -24.35% |           9.45 | 0/5          |
| 256/replace/random/reverse                | 2799.51 |   92.87 | 2225.59 |   32.23 | -20.50% |       -21.05% |           4.50 | 1/5          |
| 256/replace/random/shuffled               | 3872.17 | 1068.46 | 3389.94 |  857.81 | -12.45% |       -25.75% |           9.88 | 1/5          |
| 4096/insert/tail/ordered                  |  974.90 |  450.88 |  693.55 |  241.80 | -28.86% |       -15.89% |          29.58 | 1/5          |
| 4096/insert/tail/reverse                  | 4068.26 |  101.56 | 4023.73 |  165.63 |  -1.09% |        -4.00% |           7.49 | 1/5          |
| 4096/insert/tail/shuffled                 | 2659.86 |  268.46 | 2764.36 |  290.14 |   3.93% |        -2.51% |          21.36 | 2/5          |
| 4096/insert/random/ordered                | 1897.85 |  371.48 | 1114.16 |  228.61 | -41.29% |       -39.35% |           4.71 | 0/5          |
| 4096/insert/random/reverse                | 1802.15 |  144.92 | 1184.28 |   73.24 | -34.29% |       -35.15% |           1.47 | 0/5          |
| 4096/insert/random/shuffled               | 1706.05 |   29.39 | 1194.92 |   93.65 | -29.96% |       -32.33% |           3.25 | 0/5          |
| 4096/remove/tail/ordered                  | 1088.18 |   26.66 |  965.43 |  218.46 | -11.28% |       -11.26% |          21.02 | 2/5          |
| 4096/remove/tail/reverse                  | 4141.60 |   60.84 | 3933.79 |  263.87 |  -5.02% |        -4.24% |           9.96 | 2/5          |
| 4096/remove/tail/shuffled                 | 3805.66 |  234.86 | 3421.97 |  171.68 | -10.08% |        -8.37% |           8.50 | 0/5          |
| 4096/remove/random/ordered                | 1854.00 |  321.48 | 1296.97 |  140.53 | -30.04% |       -34.16% |          11.90 | 0/5          |
| 4096/remove/random/reverse                | 2244.73 |  456.15 | 1399.90 |  122.85 | -37.64% |       -37.64% |           4.56 | 0/5          |
| 4096/remove/random/shuffled               | 1853.13 |  109.18 | 1295.12 |   80.86 | -30.11% |       -28.35% |           9.79 | 0/5          |
| 4096/replace/tail/ordered                 | 1989.65 |   22.85 | 1561.62 |   76.37 | -21.51% |       -18.76% |           4.16 | 0/5          |
| 4096/replace/tail/reverse                 | 2242.68 |  409.57 | 1923.14 |   27.73 | -14.25% |       -14.02% |          13.88 | 0/5          |
| 4096/replace/tail/shuffled                | 3065.14 |  186.52 | 2132.62 |   37.79 | -30.42% |       -30.80% |           3.13 | 0/5          |
| 4096/replace/random/ordered               | 3149.32 | 2461.33 | 2145.61 |  289.06 | -31.87% |       -43.11% |          24.80 | 0/5          |
| 4096/replace/random/reverse               | 2937.11 |  207.91 | 2043.16 |  191.21 | -30.44% |       -32.90% |           3.32 | 0/5          |
| 4096/replace/random/shuffled              | 3194.24 |   93.65 | 1976.17 |  362.60 | -38.13% |       -32.95% |          10.17 | 0/5          |
