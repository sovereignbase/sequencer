# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/directory-lazy-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |     IQR |   After |     IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | ------: | ------: | ------: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   | 1540.33 |  216.70 | 1490.33 |  222.46 |  -3.25% |         9.48% |          16.53 | 3/5          |
| 256/insert/tail/reverse                   | 4852.54 |  698.44 | 4520.21 |  312.30 |  -6.85% |        -6.85% |          17.92 | 1/5          |
| 256/insert/tail/shuffled                  | 4152.15 |  727.34 | 4221.68 | 1159.08 |   1.67% |       -19.25% |          44.92 | 2/5          |
| 256/insert/random/ordered                 | 2656.45 |  246.78 | 1931.84 |  575.88 | -27.28% |       -30.23% |          18.71 | 0/5          |
| 256/insert/random/reverse                 | 2209.57 |  342.87 | 1883.50 |  403.22 | -14.76% |       -14.65% |          13.21 | 0/5          |
| 256/insert/random/shuffled                | 2575.88 |  378.61 | 2158.30 |  761.82 | -16.21% |       -20.39% |          19.00 | 1/5          |
| 256/remove/tail/ordered                   | 2961.91 |  941.70 | 2127.25 | 1042.58 | -28.18% |       -24.79% |          11.41 | 1/5          |
| 256/remove/tail/reverse                   | 1733.01 |  607.62 | 1491.02 |  124.41 | -13.96% |       -15.72% |          29.06 | 1/5          |
| 256/remove/tail/shuffled                  | 1941.31 |  212.30 | 1677.05 |   13.48 | -13.61% |       -14.95% |           3.67 | 0/5          |
| 256/remove/random/ordered                 | 1803.61 |  298.44 | 1583.20 |  722.27 | -12.22% |       -22.64% |          46.69 | 2/5          |
| 256/remove/random/reverse                 | 1780.47 |  245.90 | 1349.12 |  276.17 | -24.23% |       -18.40% |          24.51 | 1/5          |
| 256/remove/random/shuffled                | 1800.10 |  163.77 | 1438.09 |  477.64 | -20.11% |       -22.64% |          33.78 | 2/5          |
| 256/replace/tail/ordered                  | 2954.59 |  612.30 | 2514.16 |  730.37 | -14.91% |        -7.83% |          33.77 | 2/5          |
| 256/replace/tail/reverse                  | 2987.79 |  210.25 | 2817.77 |  245.61 |  -5.69% |        -7.86% |          20.58 | 2/5          |
| 256/replace/tail/shuffled                 | 4273.05 | 1179.00 | 4024.41 | 1775.68 |  -5.82% |       -19.01% |           1.08 | 1/5          |
| 256/replace/random/ordered                | 2808.50 |  148.63 | 2224.02 |  150.98 | -20.81% |       -24.26% |           8.48 | 0/5          |
| 256/replace/random/reverse                | 2857.42 |  532.42 | 2329.69 |  125.00 | -18.47% |       -23.33% |          13.00 | 0/5          |
| 256/replace/random/shuffled               | 3042.38 |   88.57 | 2300.39 |   66.21 | -24.39% |       -24.54% |           1.49 | 0/5          |
| 4096/insert/tail/ordered                  | 1237.11 |  363.09 |  552.54 |  191.50 | -55.34% |       -43.23% |          19.45 | 0/5          |
| 4096/insert/tail/reverse                  | 3902.34 |  213.18 | 3723.63 |  240.53 |  -4.58% |        -4.53% |           5.89 | 2/5          |
| 4096/insert/tail/shuffled                 | 2962.89 |  380.27 | 2709.96 |  145.31 |  -8.54% |        -5.39% |           7.70 | 2/5          |
| 4096/insert/random/ordered                | 1838.67 |  182.13 | 1028.12 |    7.81 | -44.08% |       -45.06% |           7.17 | 0/5          |
| 4096/insert/random/reverse                | 1709.47 |   78.32 | 1234.47 |  228.91 | -27.79% |       -34.31% |          11.49 | 0/5          |
| 4096/insert/random/shuffled               | 1808.01 |  146.87 | 1032.03 |   15.92 | -42.92% |       -42.92% |           5.84 | 0/5          |
| 4096/remove/tail/ordered                  | 1118.65 |   68.95 | 1148.63 |  283.89 |   2.68% |         2.68% |          25.81 | 3/5          |
| 4096/remove/tail/reverse                  | 4587.11 |  206.15 | 4391.80 |  531.64 |  -4.26% |        -4.26% |          12.34 | 2/5          |
| 4096/remove/tail/shuffled                 | 4017.19 |  110.35 | 3533.98 |  143.16 | -12.03% |       -10.33% |           2.88 | 0/5          |
| 4096/remove/random/ordered                | 1821.29 |   47.56 | 1405.76 |   61.52 | -22.82% |       -23.49% |          10.14 | 0/5          |
| 4096/remove/random/reverse                | 1870.61 |    8.79 | 1365.63 |  386.72 | -27.00% |       -26.93% |          14.22 | 0/5          |
| 4096/remove/random/shuffled               | 1941.41 |  306.35 | 1311.43 |    4.20 | -32.45% |       -31.88% |           1.66 | 0/5          |
| 4096/replace/tail/ordered                 | 2132.52 |  357.62 | 1809.28 |  218.95 | -15.16% |       -19.37% |           2.99 | 1/5          |
| 4096/replace/tail/reverse                 | 2210.16 |   58.89 | 2068.16 |  184.77 |  -6.42% |        -5.89% |           7.72 | 2/5          |
| 4096/replace/tail/shuffled                | 3195.31 |   51.86 | 2211.72 |   58.40 | -30.78% |       -30.39% |           3.94 | 0/5          |
| 4096/replace/random/ordered               | 3134.57 |   54.69 | 1854.59 |  112.60 | -40.83% |       -40.25% |           3.13 | 0/5          |
| 4096/replace/random/reverse               | 3052.93 |   59.47 | 2017.19 |  250.00 | -33.93% |       -33.93% |           2.95 | 0/5          |
| 4096/replace/random/shuffled              | 3690.14 |  266.70 | 2119.43 |  459.28 | -42.56% |       -39.69% |           4.43 | 0/5          |
