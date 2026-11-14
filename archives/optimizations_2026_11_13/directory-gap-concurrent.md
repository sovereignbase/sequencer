# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/directory-gap-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |     IQR |   After |     IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | ------: | ------: | ------: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   | 1240.43 |   21.29 | 1098.93 |  665.82 | -11.41% |       -11.41% |          17.67 | 1/5          |
| 256/insert/tail/reverse                   | 2973.14 |  689.16 | 3027.93 |  255.08 |   1.84% |        -0.27% |          18.20 | 2/5          |
| 256/insert/tail/shuffled                  | 2267.09 |  207.42 | 2251.66 |  919.92 |  -0.68% |        -1.61% |          11.33 | 2/5          |
| 256/insert/random/ordered                 | 1309.57 |  195.80 | 1039.36 |   92.09 | -20.63% |       -18.05% |          21.99 | 1/5          |
| 256/insert/random/reverse                 | 1013.57 |  120.90 |  875.98 |   89.75 | -13.58% |       -16.22% |          14.19 | 0/5          |
| 256/insert/random/shuffled                | 1105.18 |  162.70 |  836.52 |   22.07 | -24.31% |       -24.31% |           8.60 | 0/5          |
| 256/remove/tail/ordered                   | 1307.52 |  152.54 | 1045.70 |  343.46 | -20.02% |       -19.41% |          25.36 | 2/5          |
| 256/remove/tail/reverse                   | 1129.98 |   63.57 | 1254.98 |  397.56 |  11.06% |        17.11% |          46.64 | 3/5          |
| 256/remove/tail/shuffled                  | 1228.81 |   22.85 | 1035.45 |   35.64 | -15.74% |       -15.74% |           4.49 | 0/5          |
| 256/remove/random/ordered                 | 1208.50 |   42.77 |  945.41 |  147.36 | -21.77% |       -17.50% |           7.40 | 0/5          |
| 256/remove/random/reverse                 | 1313.96 |  195.02 | 1088.18 |  163.96 | -17.18% |       -21.84% |          36.47 | 2/5          |
| 256/remove/random/shuffled                | 1222.07 |   60.16 | 1036.33 |  162.79 | -15.20% |       -14.32% |           7.23 | 1/5          |
| 256/replace/tail/ordered                  | 2547.85 | 2068.65 | 2188.96 | 1096.68 | -14.09% |        -7.15% |          23.03 | 1/5          |
| 256/replace/tail/reverse                  | 1938.96 |  120.02 | 1867.29 |   94.82 |  -3.70% |        -5.94% |           4.75 | 1/5          |
| 256/replace/tail/shuffled                 | 2730.86 |  152.83 | 2045.70 |  195.61 | -25.09% |       -19.81% |           3.36 | 0/5          |
| 256/replace/random/ordered                | 2044.04 |  133.20 | 1716.02 |  208.01 | -16.05% |       -18.24% |          12.07 | 0/5          |
| 256/replace/random/reverse                | 2207.52 |  120.70 | 1679.98 |  163.28 | -23.90% |       -23.90% |           4.37 | 0/5          |
| 256/replace/random/shuffled               | 2359.96 |   61.72 | 1778.42 |   68.85 | -24.64% |       -24.55% |           1.02 | 0/5          |
| 4096/insert/tail/ordered                  |  734.57 |  374.12 |  436.43 |  103.42 | -40.59% |       -27.55% |          19.41 | 0/5          |
| 4096/insert/tail/reverse                  | 3001.86 |   83.59 | 3038.18 |   63.09 |   1.21% |         1.08% |           4.05 | 3/5          |
| 4096/insert/tail/shuffled                 | 2839.84 | 1318.85 | 2237.99 |  337.11 | -21.19% |       -24.13% |          27.75 | 2/5          |
| 4096/insert/random/ordered                | 1470.80 |  129.59 |  925.29 |   40.23 | -37.09% |       -38.74% |           2.61 | 0/5          |
| 4096/insert/random/reverse                | 1582.23 |  154.98 |  936.13 |  118.07 | -40.83% |       -37.60% |          12.56 | 0/5          |
| 4096/insert/random/shuffled               | 1641.41 |  159.08 | 1002.64 |   65.72 | -38.92% |       -36.76% |           1.65 | 0/5          |
| 4096/remove/tail/ordered                  | 1075.98 |   89.94 |  830.76 |   21.09 | -22.79% |       -23.89% |           7.65 | 0/5          |
| 4096/remove/tail/reverse                  | 4167.48 |   63.77 | 3995.02 |  169.14 |  -4.14% |        -4.58% |          13.06 | 1/5          |
| 4096/remove/tail/shuffled                 | 4005.08 |  245.51 | 3599.12 |   52.93 | -10.14% |        -6.91% |           6.69 | 0/5          |
| 4096/remove/random/ordered                | 1818.36 |   53.71 | 1350.10 |   49.80 | -25.75% |       -25.75% |           6.63 | 0/5          |
| 4096/remove/random/reverse                | 1885.16 |  672.66 | 1278.32 |  197.75 | -32.19% |       -32.62% |           9.02 | 0/5          |
| 4096/remove/random/shuffled               | 1951.66 |  430.66 | 1263.48 |   25.78 | -35.26% |       -36.47% |           8.09 | 0/5          |
| 4096/replace/tail/ordered                 | 2032.71 |   56.25 | 1592.77 |   39.65 | -21.64% |       -20.28% |           3.24 | 0/5          |
| 4096/replace/tail/reverse                 | 2015.14 |  230.27 | 2453.61 |  123.44 |  21.76% |        10.99% |          17.21 | 4/5          |
| 4096/replace/tail/shuffled                | 3024.02 |  195.90 | 2182.52 |  163.38 | -27.83% |       -27.83% |           9.66 | 1/5          |
| 4096/replace/random/ordered               | 2988.67 |  140.23 | 1953.13 |  356.05 | -34.65% |       -33.61% |           9.64 | 0/5          |
| 4096/replace/random/reverse               | 2943.36 |  311.72 | 1968.55 |   61.04 | -33.12% |       -32.52% |           8.41 | 0/5          |
| 4096/replace/random/shuffled              | 3073.83 |   47.75 | 2070.61 |  110.16 | -32.64% |       -30.93% |           3.74 | 0/5          |
