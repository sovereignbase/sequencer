# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/reserved-slot-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |     IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | ------: | ------: | -----: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   |  785.06 |  481.54 |  601.86 |  57.13 | -23.34% |       -23.34% |          29.96 | 0/5          |
| 256/insert/tail/reverse                   | 2956.15 |  289.16 | 2904.79 |  24.41 |  -1.74% |        -2.52% |           7.44 | 0/5          |
| 256/insert/tail/shuffled                  | 2269.04 |  238.48 | 2129.59 | 431.74 |  -6.15% |        -6.15% |          15.79 | 1/5          |
| 256/insert/random/ordered                 | 1802.34 |  306.05 | 1209.18 | 302.05 | -32.91% |       -34.73% |          21.77 | 0/5          |
| 256/insert/random/reverse                 | 1012.79 |  117.58 |  880.76 |  80.37 | -13.04% |       -15.65% |          11.15 | 0/5          |
| 256/insert/random/shuffled                | 1058.79 |   21.00 |  869.24 |  97.27 | -17.90% |       -18.34% |          12.40 | 1/5          |
| 256/remove/tail/ordered                   | 1162.79 |  355.66 | 1080.37 | 159.86 |  -7.09% |       -16.25% |          37.03 | 2/5          |
| 256/remove/tail/reverse                   | 1114.55 |   51.37 | 1050.98 | 117.58 |  -5.70% |         0.64% |          17.83 | 3/5          |
| 256/remove/tail/shuffled                  | 1359.47 |   89.84 | 1107.23 |  69.73 | -18.55% |       -20.04% |           5.76 | 0/5          |
| 256/remove/random/ordered                 | 1197.56 |   88.28 |  870.70 |  42.87 | -27.29% |       -27.07% |           9.29 | 0/5          |
| 256/remove/random/reverse                 | 1295.21 |   74.41 | 1050.29 | 134.77 | -18.91% |       -16.61% |          12.72 | 0/5          |
| 256/remove/random/shuffled                | 1344.92 |  362.79 | 1063.77 |  85.25 | -20.90% |       -20.98% |          19.31 | 0/5          |
| 256/replace/tail/ordered                  | 2633.11 | 1067.29 | 1638.28 | 468.26 | -37.78% |       -40.93% |          65.52 | 2/5          |
| 256/replace/tail/reverse                  | 2000.49 |  391.70 | 2182.42 | 510.84 |   9.09% |        -7.48% |          30.96 | 2/5          |
| 256/replace/tail/shuffled                 | 2519.82 |  458.98 | 1901.27 | 400.00 | -24.55% |       -25.40% |           4.73 | 0/5          |
| 256/replace/random/ordered                | 2280.27 |  165.43 | 1692.97 | 118.95 | -25.76% |       -25.76% |          16.87 | 0/5          |
| 256/replace/random/reverse                | 2535.84 |  187.30 | 1761.82 | 436.82 | -30.52% |       -27.95% |          13.08 | 0/5          |
| 256/replace/random/shuffled               | 2405.27 |  263.67 | 1730.47 | 169.43 | -28.06% |       -25.72% |           7.07 | 0/5          |
| 4096/insert/tail/ordered                  |  751.17 |  222.27 |  608.11 | 148.05 | -19.05% |        -9.32% |          18.22 | 1/5          |
| 4096/insert/tail/reverse                  | 3271.48 |  222.95 | 2896.68 | 943.75 | -11.46% |       -14.71% |          10.36 | 1/5          |
| 4096/insert/tail/shuffled                 | 2085.25 |  193.95 | 2251.56 | 146.68 |   7.98% |         3.53% |           4.22 | 4/5          |
| 4096/insert/random/ordered                | 1548.54 |   97.27 |  943.55 | 449.61 | -39.07% |       -37.46% |          19.35 | 1/5          |
| 4096/insert/random/reverse                | 1638.96 |  122.75 | 1046.78 |  74.80 | -36.13% |       -35.60% |           6.12 | 0/5          |
| 4096/insert/random/shuffled               | 1933.50 |  454.10 | 1026.66 |  10.06 | -46.90% |       -48.93% |          16.51 | 0/5          |
| 4096/remove/tail/ordered                  | 1139.94 |   64.06 |  932.42 |  17.77 | -18.20% |       -20.59% |          10.13 | 0/5          |
| 4096/remove/tail/reverse                  | 4252.44 |  312.01 | 4020.61 |  77.93 |  -5.45% |        -5.45% |          10.46 | 2/5          |
| 4096/remove/tail/shuffled                 | 3884.47 |  345.80 | 3436.13 | 161.43 | -11.54% |       -11.48% |           3.11 | 0/5          |
| 4096/remove/random/ordered                | 1905.47 |   59.38 | 1226.37 | 140.72 | -35.64% |       -36.28% |           6.71 | 0/5          |
| 4096/remove/random/reverse                | 1942.29 |   91.11 | 1241.21 |  21.19 | -36.10% |       -36.10% |           2.46 | 0/5          |
| 4096/remove/random/shuffled               | 1991.89 |   26.86 | 1401.37 | 179.30 | -29.65% |       -27.98% |          10.59 | 0/5          |
| 4096/replace/tail/ordered                 | 2316.31 |  179.00 | 1583.50 | 338.87 | -31.64% |       -34.22% |           9.68 | 0/5          |
| 4096/replace/tail/reverse                 | 2285.55 |  273.54 | 2145.90 | 131.93 |  -6.11% |        -9.55% |          16.45 | 2/5          |
| 4096/replace/tail/shuffled                | 3190.23 |  174.02 | 2021.39 | 171.09 | -36.64% |       -34.47% |           3.13 | 0/5          |
| 4096/replace/random/ordered               | 3155.08 |  367.48 | 1742.77 |  24.12 | -44.76% |       -44.10% |           2.79 | 0/5          |
| 4096/replace/random/reverse               | 3342.38 |  163.09 | 2066.11 |  97.66 | -38.18% |       -37.66% |           5.85 | 0/5          |
| 4096/replace/random/shuffled              | 3173.73 |  207.52 | 1914.16 | 139.75 | -39.69% |       -39.60% |           6.15 | 0/5          |
