# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/directory-ring-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |    IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | -----: | ------: | -----: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   | 1151.07 | 475.68 |  707.81 |  59.08 | -38.51% |       -36.42% |          10.55 | 0/5          |
| 256/insert/tail/reverse                   | 2946.29 | 155.76 | 2895.41 |  80.47 |  -1.73% |        -4.09% |           2.07 | 1/5          |
| 256/insert/tail/shuffled                  | 2341.31 |  78.42 | 2221.78 | 233.01 |  -5.11% |        -7.78% |           6.25 | 1/5          |
| 256/insert/random/ordered                 | 2024.51 | 722.36 | 1073.83 |  62.79 | -46.96% |       -26.78% |          27.53 | 0/5          |
| 256/insert/random/reverse                 | 1057.23 |  89.36 |  820.70 |  68.65 | -22.37% |       -25.48% |           3.82 | 1/5          |
| 256/insert/random/shuffled                | 1098.24 |  93.07 |  968.16 | 122.27 | -11.84% |       -16.27% |          17.98 | 1/5          |
| 256/remove/tail/ordered                   | 1892.19 | 434.47 | 1184.47 |  43.26 | -37.40% |       -36.40% |          16.90 | 1/5          |
| 256/remove/tail/reverse                   | 1355.86 | 108.50 | 1172.75 | 141.11 | -13.50% |       -11.67% |          15.15 | 1/5          |
| 256/remove/tail/shuffled                  | 1554.79 |  94.43 | 1385.55 | 268.16 | -10.88% |       -10.88% |          11.68 | 1/5          |
| 256/remove/random/ordered                 | 1267.97 | 163.87 | 1114.26 | 156.05 | -12.12% |       -14.36% |           9.94 | 0/5          |
| 256/remove/random/reverse                 | 1229.79 |  75.68 | 1036.91 |  75.20 | -15.68% |       -14.39% |           3.99 | 0/5          |
| 256/remove/random/shuffled                | 1467.19 | 136.43 | 1240.72 | 281.84 | -15.44% |        -3.69% |          15.82 | 0/5          |
| 256/replace/tail/ordered                  | 2266.41 | 717.87 | 1878.71 | 134.18 | -17.11% |       -14.52% |          29.87 | 1/5          |
| 256/replace/tail/reverse                  | 2048.83 | 174.02 | 1855.86 |  55.66 |  -9.42% |        -1.83% |          10.53 | 0/5          |
| 256/replace/tail/shuffled                 | 2604.39 | 253.12 | 2033.40 | 126.27 | -21.92% |       -20.06% |           7.40 | 0/5          |
| 256/replace/random/ordered                | 2092.48 | 420.41 | 1521.58 |  43.55 | -27.28% |       -26.38% |          11.88 | 0/5          |
| 256/replace/random/reverse                | 2214.06 | 201.66 | 1679.59 |  54.98 | -24.14% |       -23.33% |           5.15 | 0/5          |
| 256/replace/random/shuffled               | 2264.65 | 190.33 | 1812.21 | 374.02 | -19.98% |       -22.81% |          18.43 | 0/5          |
| 4096/insert/tail/ordered                  |  580.76 | 185.25 |  613.38 | 129.88 |   5.62% |        -9.22% |          10.24 | 1/5          |
| 4096/insert/tail/reverse                  | 3077.34 | 253.81 | 3076.56 | 141.41 |  -0.03% |        -0.03% |           8.83 | 2/5          |
| 4096/insert/tail/shuffled                 | 2329.39 |  76.66 | 2060.06 | 150.49 | -11.56% |        -9.57% |           8.31 | 0/5          |
| 4096/insert/random/ordered                | 1442.19 |  54.49 | 1072.85 |  22.36 | -25.61% |       -25.61% |           7.83 | 0/5          |
| 4096/insert/random/reverse                | 1602.05 |  75.29 | 1036.62 | 122.95 | -35.29% |       -31.45% |           7.73 | 0/5          |
| 4096/insert/random/shuffled               | 1703.22 |  63.87 | 1194.82 | 108.50 | -29.85% |       -33.72% |          22.68 | 0/5          |
| 4096/remove/tail/ordered                  | 1085.94 |  72.85 |  962.01 |  72.36 | -11.41% |        -8.18% |           9.23 | 1/5          |
| 4096/remove/tail/reverse                  | 4218.95 | 118.16 | 4064.06 | 147.36 |  -3.67% |        -5.66% |           9.88 | 2/5          |
| 4096/remove/tail/shuffled                 | 3776.56 | 276.37 | 3389.65 | 181.84 | -10.25% |        -7.67% |          12.34 | 1/5          |
| 4096/remove/random/ordered                | 1698.44 | 174.71 | 1239.94 | 283.30 | -27.00% |       -26.62% |          24.19 | 1/5          |
| 4096/remove/random/reverse                | 1859.08 |  73.93 | 1248.93 |  35.74 | -32.82% |       -33.28% |           5.18 | 1/5          |
| 4096/remove/random/shuffled               | 2077.25 | 292.09 | 1307.32 |  78.22 | -37.06% |       -37.06% |           4.92 | 0/5          |
| 4096/replace/tail/ordered                 | 2183.69 | 128.61 | 1645.31 | 169.82 | -24.65% |       -21.49% |           4.91 | 0/5          |
| 4096/replace/tail/reverse                 | 2087.01 | 112.30 | 2049.71 | 147.36 |  -1.79% |        -1.36% |           0.68 | 1/5          |
| 4096/replace/tail/shuffled                | 3266.31 |  65.82 | 2138.67 |  79.88 | -34.52% |       -32.92% |           6.73 | 0/5          |
| 4096/replace/random/ordered               | 2984.18 | 174.61 | 1844.63 |  83.98 | -38.19% |       -41.05% |           5.81 | 0/5          |
| 4096/replace/random/reverse               | 3493.85 | 657.42 | 1941.99 | 285.64 | -44.42% |       -40.31% |           7.60 | 0/5          |
| 4096/replace/random/shuffled              | 3275.88 | 246.29 | 2005.57 |  67.48 | -38.78% |       -38.17% |           5.68 | 0/5          |
