# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/directory-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |     IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | ------: | ------: | -----: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   |  763.48 |   90.04 |  666.21 | 434.86 | -12.74% |       -12.22% |          31.28 | 2/5          |
| 256/insert/tail/reverse                   | 3010.25 |  197.17 | 2972.46 |  93.75 |  -1.26% |        -1.26% |           3.49 | 2/5          |
| 256/insert/tail/shuffled                  | 2423.73 |  191.50 | 2141.70 | 454.00 | -11.64% |        -6.19% |          13.92 | 1/5          |
| 256/insert/random/ordered                 | 1615.72 |  246.88 | 1060.74 | 102.34 | -34.35% |       -30.01% |          16.13 | 0/5          |
| 256/insert/random/reverse                 |  989.26 |   10.35 |  971.87 | 165.04 |  -1.76% |        -4.05% |          16.98 | 2/5          |
| 256/insert/random/shuffled                | 1320.31 |   96.87 | 1149.71 |  83.20 | -12.92% |       -14.21% |           2.31 | 0/5          |
| 256/remove/tail/ordered                   | 1485.74 |  209.28 | 1050.98 |  56.74 | -29.26% |       -25.92% |          13.17 | 0/5          |
| 256/remove/tail/reverse                   | 1167.58 |   64.36 | 1013.38 |  95.90 | -13.21% |       -11.90% |          13.41 | 0/5          |
| 256/remove/tail/shuffled                  | 1214.36 |  239.36 | 1036.13 |  80.76 | -14.68% |       -15.42% |           3.45 | 0/5          |
| 256/remove/random/ordered                 | 1587.60 | 1692.58 | 1157.71 | 281.45 | -27.08% |       -21.11% |          24.13 | 0/5          |
| 256/remove/random/reverse                 | 2475.00 |  291.89 | 2105.57 | 648.05 | -14.93% |       -15.95% |           6.99 | 0/5          |
| 256/remove/random/shuffled                | 2651.46 |  132.03 | 1928.13 | 517.48 | -27.28% |       -23.70% |          11.24 | 0/5          |
| 256/replace/tail/ordered                  | 3192.09 |  510.55 | 2294.43 | 800.68 | -28.12% |       -25.80% |          67.09 | 2/5          |
| 256/replace/tail/reverse                  | 2134.77 |  294.82 | 1947.36 | 253.22 |  -8.78% |        -1.69% |          22.95 | 2/5          |
| 256/replace/tail/shuffled                 | 2560.64 |  220.12 | 2150.78 | 244.24 | -16.01% |       -17.12% |          12.06 | 1/5          |
| 256/replace/random/ordered                | 2525.59 |  209.77 | 1838.38 | 682.03 | -27.21% |       -21.65% |          35.69 | 2/5          |
| 256/replace/random/reverse                | 2398.73 |   87.70 | 1833.20 |  56.93 | -23.58% |       -23.58% |           3.34 | 0/5          |
| 256/replace/random/shuffled               | 2351.07 |  193.75 | 1867.87 | 222.07 | -20.55% |       -18.46% |          11.60 | 1/5          |
| 4096/insert/tail/ordered                  |  598.14 |  158.89 |  522.36 |  58.98 | -12.67% |       -11.51% |          14.99 | 0/5          |
| 4096/insert/tail/reverse                  | 3001.86 |  146.39 | 2841.89 |  39.65 |  -5.33% |        -5.33% |          11.76 | 1/5          |
| 4096/insert/tail/shuffled                 | 2220.70 |   72.17 | 2229.00 |  83.30 |   0.37% |         1.37% |           6.49 | 3/5          |
| 4096/insert/random/ordered                | 1430.96 |  180.96 |  976.66 |  35.45 | -31.75% |       -37.52% |           7.64 | 0/5          |
| 4096/insert/random/reverse                | 1640.92 |   84.77 | 1149.41 | 252.73 | -29.95% |       -33.01% |          11.32 | 0/5          |
| 4096/insert/random/shuffled               | 1652.25 |   91.21 | 1266.99 |  82.23 | -23.32% |       -24.81% |           7.94 | 0/5          |
| 4096/remove/tail/ordered                  | 1169.53 |  126.76 |  917.58 |  96.78 | -21.54% |       -21.23% |           7.63 | 0/5          |
| 4096/remove/tail/reverse                  | 4382.71 |  839.16 | 4102.54 | 189.84 |  -6.39% |        -0.13% |          16.31 | 2/5          |
| 4096/remove/tail/shuffled                 | 3678.32 |  585.74 | 3614.26 | 156.54 |  -1.74% |        -1.92% |           5.68 | 1/5          |
| 4096/remove/random/ordered                | 1952.93 |  259.28 | 1603.52 | 493.36 | -17.89% |       -28.38% |          36.38 | 2/5          |
| 4096/remove/random/reverse                | 1835.16 |   52.83 | 1361.52 | 373.54 | -25.81% |       -23.38% |          19.21 | 0/5          |
| 4096/remove/random/shuffled               | 2216.99 |  421.68 | 1416.41 |  69.24 | -36.11% |       -29.88% |           9.84 | 0/5          |
| 4096/replace/tail/ordered                 | 2059.08 |   98.83 | 1564.16 |  67.38 | -24.04% |       -24.34% |          10.21 | 0/5          |
| 4096/replace/tail/reverse                 | 2062.60 |  128.42 | 1872.66 | 162.50 |  -9.21% |        -6.24% |          10.92 | 1/5          |
| 4096/replace/tail/shuffled                | 3008.20 |  175.59 | 2265.53 |  38.09 | -24.69% |       -25.81% |           8.33 | 0/5          |
| 4096/replace/random/ordered               | 2913.28 |   30.27 | 1988.38 |  98.63 | -31.75% |       -31.69% |           4.08 | 0/5          |
| 4096/replace/random/reverse               | 3567.09 |  826.86 | 2217.87 | 498.24 | -37.82% |       -32.37% |           6.26 | 0/5          |
| 4096/replace/random/shuffled              | 3081.64 |   11.43 | 1994.73 |  24.90 | -35.27% |       -35.27% |           4.05 | 0/5          |
