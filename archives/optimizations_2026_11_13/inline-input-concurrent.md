# Eight-author replay: traversal directory

Five matched rounds after two warmups per build. Eight independent authors each make 128 edits against the same snapshot, with 256 or 4,096 initial four-Frame Insertions. Insert, remove and replace each run at tail and random positions, with ordered, reversed and shuffled delivery, then duplicate replay. Canonical snapshots match the checkpoint for the same delivery order, before and after duplicates; visible values agree across all orders. Existing production tests and expectations are unchanged.

Times are median ns/apply batch. Fixture preparation, hydration, verification, destruction and explicit JS process garbage collection are outside timing. Short bursts are diagnostic evidence; complete-suite comparisons determine acceptance. All raw samples remain under `temp/optimization_2026_11_12/inline-input-concurrent.json`. Negative changes mean faster.

| Initial / operation / position / delivery |  Before |    IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :---------------------------------------- | ------: | -----: | ------: | -----: | ------: | ------------: | -------------: | :----------- |
| 256/insert/tail/ordered                   | 1268.95 | 600.88 | 1167.48 | 253.61 |  -8.00% |       -19.16% |          22.29 | 1/5          |
| 256/insert/tail/reverse                   | 3125.49 | 442.29 | 2914.16 | 179.10 |  -6.76% |        -8.29% |           6.97 | 1/5          |
| 256/insert/tail/shuffled                  | 2237.11 | 345.90 | 2260.25 |  73.83 |   1.03% |         1.03% |          17.96 | 3/5          |
| 256/insert/random/ordered                 | 1355.27 | 144.24 | 1161.52 | 136.13 | -14.30% |       -20.78% |           8.05 | 0/5          |
| 256/insert/random/reverse                 | 1143.26 | 322.56 |  816.99 |  52.44 | -28.54% |       -19.64% |           8.88 | 1/5          |
| 256/insert/random/shuffled                | 1079.00 |  57.03 |  898.24 |  34.08 | -16.75% |       -17.70% |           2.52 | 0/5          |
| 256/remove/tail/ordered                   | 1539.94 | 173.73 | 1041.50 | 159.77 | -32.37% |       -19.62% |          20.47 | 0/5          |
| 256/remove/tail/reverse                   | 1178.13 |  97.95 |  887.40 | 110.94 | -24.68% |       -24.34% |          21.54 | 1/5          |
| 256/remove/tail/shuffled                  | 1334.18 |  63.18 | 1040.82 | 168.65 | -21.99% |       -21.48% |           5.60 | 1/5          |
| 256/remove/random/ordered                 | 1200.00 | 134.08 |  976.37 | 190.92 | -18.64% |       -23.11% |           9.76 | 1/5          |
| 256/remove/random/reverse                 | 1312.11 | 221.88 | 1110.35 | 239.45 | -15.38% |       -24.37% |          15.77 | 0/5          |
| 256/remove/random/shuffled                | 1258.20 |  25.68 |  981.45 |  82.13 | -22.00% |       -18.81% |           7.58 | 0/5          |
| 256/replace/tail/ordered                  | 2350.10 | 878.61 | 1611.33 | 504.59 | -31.44% |       -31.44% |          14.24 | 1/5          |
| 256/replace/tail/reverse                  | 1959.86 | 383.40 | 1956.64 | 468.55 |  -0.16% |       -10.82% |          33.54 | 2/5          |
| 256/replace/tail/shuffled                 | 2575.00 |  74.80 | 2028.42 |  29.79 | -21.23% |       -21.23% |           5.60 | 0/5          |
| 256/replace/random/ordered                | 2107.32 | 265.72 | 1429.98 |  38.18 | -32.14% |       -32.14% |           9.54 | 0/5          |
| 256/replace/random/reverse                | 2340.92 | 205.66 | 1580.18 | 205.37 | -32.50% |       -28.25% |           2.50 | 0/5          |
| 256/replace/random/shuffled               | 2256.64 | 154.98 | 1640.23 |  73.05 | -27.32% |       -29.39% |           3.69 | 0/5          |
| 4096/insert/tail/ordered                  |  562.30 | 159.86 |  549.61 | 259.18 |  -2.26% |       -16.71% |          18.67 | 1/5          |
| 4096/insert/tail/reverse                  | 2988.18 | 176.07 | 2775.10 |  82.91 |  -7.13% |        -8.29% |           3.73 | 0/5          |
| 4096/insert/tail/shuffled                 | 2643.75 | 288.77 | 2553.32 | 163.48 |  -3.42% |        -4.38% |          24.49 | 2/5          |
| 4096/insert/random/ordered                | 1538.18 |  96.48 | 1047.46 | 267.87 | -31.90% |       -35.26% |          11.55 | 0/5          |
| 4096/insert/random/reverse                | 1637.99 | 242.77 |  960.16 |  57.52 | -41.38% |       -40.39% |           5.46 | 0/5          |
| 4096/insert/random/shuffled               | 1593.65 |  70.90 | 1106.25 | 276.76 | -30.58% |       -30.58% |           7.80 | 0/5          |
| 4096/remove/tail/ordered                  | 1098.83 |  21.48 |  866.31 | 105.27 | -21.16% |       -25.29% |          12.39 | 1/5          |
| 4096/remove/tail/reverse                  | 4184.96 | 267.19 | 4011.62 | 180.08 |  -4.14% |         1.70% |           7.28 | 3/5          |
| 4096/remove/tail/shuffled                 | 3913.38 |  57.81 | 3493.65 | 214.75 | -10.73% |       -11.79% |           6.29 | 0/5          |
| 4096/remove/random/ordered                | 1926.17 | 268.75 | 1272.07 | 125.59 | -33.96% |       -37.81% |          18.15 | 0/5          |
| 4096/remove/random/reverse                | 1899.51 | 160.35 | 1186.33 | 237.79 | -37.55% |       -37.55% |          17.79 | 0/5          |
| 4096/remove/random/shuffled               | 1867.87 | 229.39 | 1250.59 | 359.47 | -33.05% |       -36.00% |          12.24 | 0/5          |
| 4096/replace/tail/ordered                 | 1957.13 |  10.35 | 1557.23 | 103.32 | -20.43% |       -22.65% |          10.67 | 0/5          |
| 4096/replace/tail/reverse                 | 2518.95 | 269.63 | 1910.64 | 213.28 | -24.15% |       -24.15% |          11.11 | 0/5          |
| 4096/replace/tail/shuffled                | 3007.03 | 177.83 | 2029.88 |  54.10 | -32.50% |       -31.44% |           4.26 | 0/5          |
| 4096/replace/random/ordered               | 3003.81 | 925.78 | 2222.46 | 637.01 | -26.01% |       -44.72% |          22.27 | 0/5          |
| 4096/replace/random/reverse               | 3104.49 | 664.36 | 1928.71 | 117.58 | -37.87% |       -33.92% |           5.99 | 0/5          |
| 4096/replace/random/shuffled              | 3187.60 |  96.29 | 1888.09 | 249.51 | -40.77% |       -39.62% |           7.41 | 0/5          |
