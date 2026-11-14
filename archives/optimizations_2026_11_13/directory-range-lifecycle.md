# directory-range-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: directory-range. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/directory-range-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    12762.30 |     781.60 |     4177.74 |     511.48 | -67.26% |       -66.57% |           5.25 |                      |
| lifecycle/scaleUp/insert.head          |      833.20 |     166.45 |      918.04 |      12.60 |  10.18% |        21.29% |          15.83 | yes                  |
| lifecycle/scaleUp/insert.random        |     6390.28 |     379.82 |     1851.16 |     149.54 | -71.03% |       -71.27% |           5.25 |                      |
| lifecycle/scaleUp/insert.tail          |      821.34 |      91.97 |      849.33 |      83.13 |   3.41% |         3.41% |           6.26 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11330.82 |     570.82 |     2773.00 |     228.34 | -75.53% |       -74.87% |           3.31 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2570.84 |     353.03 |     2691.36 |     460.63 |   4.69% |         0.12% |           4.73 |                      |
| lifecycle/scaleUp/replace.random       |    12147.34 |     668.04 |     3978.90 |     286.88 | -67.24% |       -66.30% |           4.46 |                      |
| lifecycle/scaleUp/replace.tail         |     2246.70 |      43.41 |     2475.01 |     389.34 |  10.16% |        10.16% |          19.59 |                      |
| lifecycle/scaleUp/value.head           |      368.49 |      22.99 |      334.03 |      54.72 |  -9.35% |        -8.47% |          27.21 |                      |
| lifecycle/scaleUp/value.random         |     9370.80 |     739.11 |     1143.82 |     113.29 | -87.79% |       -87.79% |           2.15 |                      |
| lifecycle/scaleUp/value.tail           |      250.44 |      21.38 |      158.40 |       9.02 | -36.75% |       -37.68% |           9.82 |                      |
| lifecycle/scaleDown/apply.random       |    11121.08 |     351.78 |     3646.19 |     414.42 | -67.21% |       -66.30% |           4.45 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3861.51 |     178.62 |     2051.73 |     194.66 | -46.87% |       -50.66% |           8.44 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1941.25 |      70.75 |     2662.95 |     147.51 |  37.18% |        40.13% |          14.13 |                      |
| lifecycle/scaleDown/remove.random      |     5812.07 |     273.92 |     2832.72 |     434.10 | -51.26% |       -49.75% |          10.08 |                      |
| lifecycle/scaleDown/remove.tail        |     2029.09 |     107.50 |     1896.02 |     214.10 |  -6.56% |       -10.49% |          11.32 |                      |
| lifecycle/scaleDown/replace.head       |     2566.12 |      60.46 |     2961.02 |     518.47 |  15.39% |        11.10% |          21.97 |                      |
| lifecycle/scaleDown/replace.random     |     6187.86 |      99.38 |     3673.90 |     339.90 | -40.63% |       -40.70% |           5.90 |                      |
| lifecycle/scaleDown/replace.tail       |    40909.75 |    2085.47 |    33626.50 |    4041.44 | -17.80% |       -17.53% |          13.42 |                      |
| lifecycle/scaleDown/value.head         |      496.43 |      30.99 |      448.96 |      26.35 |  -9.56% |       -12.18% |           9.11 |                      |
| lifecycle/scaleDown/value.random       |     3752.18 |     124.74 |     1076.14 |     129.42 | -71.32% |       -70.59% |           3.69 |                      |
| lifecycle/scaleDown/value.tail         |      285.64 |       8.00 |      239.02 |      16.25 | -16.32% |       -16.60% |           4.63 |                      |
| lifecycle/fullLifecycle/apply.random   |    11830.96 |     989.38 |     3942.22 |     240.19 | -66.68% |       -66.92% |           5.90 |                      |
| lifecycle/fullLifecycle/insert.head    |      833.20 |     166.45 |      918.04 |      12.60 |  10.18% |        21.29% |          15.83 | yes                  |
| lifecycle/fullLifecycle/insert.random  |     5156.50 |     408.62 |     1918.75 |     242.23 | -62.79% |       -64.58% |           7.67 |                      |
| lifecycle/fullLifecycle/insert.tail    |      821.34 |      91.97 |      849.33 |      83.13 |   3.41% |         3.41% |           6.26 |                      |
| lifecycle/fullLifecycle/remove.head    |     1941.25 |      70.75 |     2662.95 |     147.51 |  37.18% |        40.13% |          14.13 |                      |
| lifecycle/fullLifecycle/remove.random  |     8483.92 |     608.39 |     3010.76 |     289.03 | -64.51% |       -67.47% |           3.66 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2029.09 |     107.50 |     1896.02 |     214.10 |  -6.56% |       -10.49% |          11.32 |                      |
| lifecycle/fullLifecycle/replace.head   |     2711.32 |     187.80 |     2891.09 |      40.88 |   6.63% |         6.63% |          15.45 |                      |
| lifecycle/fullLifecycle/replace.random |     9167.60 |     776.50 |     3889.52 |     247.86 | -57.57% |       -56.50% |           5.14 |                      |
| lifecycle/fullLifecycle/replace.tail   |    21565.66 |     966.52 |    17964.43 |    1944.01 | -16.70% |       -15.58% |          11.33 |                      |
| lifecycle/fullLifecycle/value.head     |      442.18 |      13.72 |      391.49 |      53.21 | -11.46% |       -12.04% |          15.33 |                      |
| lifecycle/fullLifecycle/value.random   |     6577.46 |     615.56 |     1151.87 |      78.86 | -82.49% |       -83.23% |           2.91 |                      |
| lifecycle/fullLifecycle/value.tail     |      268.04 |      17.10 |      201.62 |       9.80 | -24.78% |       -25.17% |           5.10 |                      |
| checkpoint/up/1000/create              |   292100.00 |   96000.00 |   272700.00 |   20000.00 |  -6.64% |       -12.64% |          17.59 |                      |
| checkpoint/up/1000/sequence            |  2591800.00 |  393600.00 |  2979800.00 |  451300.00 |  14.97% |         6.35% |          30.06 |                      |
| checkpoint/up/1000/values              |  1712900.00 |  177200.00 |  1651700.00 |   37100.00 |  -3.57% |        -1.83% |           8.68 |                      |
| checkpoint/up/5000/create              |   994900.00 |   34900.00 |   882200.00 |  129100.00 | -11.33% |        -8.48% |          22.98 |                      |
| checkpoint/up/5000/sequence            | 10093600.00 |  329100.00 |  9783800.00 |  582900.00 |  -3.07% |        -0.11% |           1.53 |                      |
| checkpoint/up/5000/values              |  4900400.00 |  146400.00 |  5296900.00 |  556600.00 |   8.09% |        -3.03% |          14.77 |                      |
| checkpoint/up/10000/create             |  1467700.00 |  142500.00 |  1651000.00 |   31600.00 |  12.49% |         6.72% |          10.94 | yes                  |
| checkpoint/up/10000/sequence           | 14452200.00 | 3855000.00 | 14278900.00 | 1289300.00 |  -1.20% |        -1.20% |          17.78 |                      |
| checkpoint/up/10000/values             | 21521400.00 |  749400.00 | 21352600.00 |  375100.00 |  -0.78% |        -0.78% |           4.16 |                      |
| checkpoint/up/15000/create             |  2376500.00 |  611800.00 |  2384400.00 |  113200.00 |   0.33% |         2.48% |          25.76 |                      |
| checkpoint/up/15000/sequence           | 17806000.00 |  609800.00 | 16751600.00 | 6676700.00 |  -5.92% |        -5.92% |          40.74 |                      |
| checkpoint/up/15000/values             | 30567900.00 |  143900.00 | 32070600.00 |  709400.00 |   4.92% |         4.60% |           1.86 |                      |
| checkpoint/up/20000/create             |  3536900.00 |  265900.00 |  3527400.00 |  208400.00 |  -0.27% |        -0.08% |           5.80 |                      |
| checkpoint/up/20000/sequence           | 26487900.00 | 3837300.00 | 25874700.00 |  122600.00 |  -2.32% |        -0.86% |           2.49 |                      |
| checkpoint/up/20000/values             | 13382100.00 |  714200.00 | 14090600.00 | 1527200.00 |   5.29% |         5.29% |          16.42 |                      |
| checkpoint/up/25000/create             |  4159700.00 |  542600.00 |  4147600.00 |  211700.00 |  -0.29% |         4.01% |          11.01 |                      |
| checkpoint/up/25000/sequence           | 27270800.00 |  837500.00 | 27874300.00 | 1611700.00 |   2.21% |        -1.18% |           5.83 |                      |
| checkpoint/up/25000/values             | 13675600.00 |  341400.00 | 13398400.00 |  430200.00 |  -2.03% |        -2.03% |           6.07 |                      |
| checkpoint/down/20000/create           |  3518200.00 |  189300.00 |  3436800.00 |   51700.00 |  -2.31% |        -1.86% |           1.26 |                      |
| checkpoint/down/20000/sequence         | 24491600.00 | 3239100.00 | 24335500.00 | 2226200.00 |  -0.64% |         1.92% |          27.49 |                      |
| checkpoint/down/20000/values           | 11485000.00 |  270100.00 | 11489000.00 | 1694400.00 |   0.03% |         1.86% |           4.80 |                      |
| checkpoint/down/15000/create           |  2446700.00 |  126900.00 |  2429000.00 |   39500.00 |  -0.72% |        -2.48% |           1.62 |                      |
| checkpoint/down/15000/sequence         | 21467200.00 | 2084000.00 | 19383700.00 |  286300.00 |  -9.71% |       -11.41% |          12.78 |                      |
| checkpoint/down/15000/values           |  9225400.00 | 1053200.00 |  8879600.00 | 1007600.00 |  -3.75% |       -10.29% |          25.40 |                      |
| checkpoint/down/10000/create           |  1821400.00 |  335900.00 |  1646400.00 |   45700.00 |  -9.61% |        -9.61% |          11.84 |                      |
| checkpoint/down/10000/sequence         | 20034100.00 | 6507500.00 | 14988100.00 |  390700.00 | -25.19% |       -25.19% |          29.95 |                      |
| checkpoint/down/10000/values           |  5932300.00 | 1625500.00 |  6382900.00 |  379000.00 |   7.60% |        -6.31% |          14.19 |                      |
| checkpoint/down/5000/create            |   792200.00 |   15600.00 |   780200.00 |    3600.00 |  -1.51% |        -1.60% |           1.86 |                      |
| checkpoint/down/5000/sequence          | 12293200.00 | 2589600.00 | 11456000.00 | 1169000.00 |  -6.81% |        -8.59% |          13.17 |                      |
| checkpoint/down/5000/values            |  3399400.00 |  866300.00 |  4039700.00 |  960600.00 |  18.84% |        26.23% |          43.41 |                      |
| checkpoint/down/1000/create            |   162600.00 |    6500.00 |   151100.00 |   11900.00 |  -7.07% |       -10.22% |          10.78 |                      |
| checkpoint/down/1000/sequence          |  7647300.00 |  272800.00 |  7605900.00 |  441300.00 |  -0.54% |        -4.01% |          15.39 |                      |
| checkpoint/down/1000/values            |   642100.00 |   57600.00 |   639900.00 |  257500.00 |  -0.34% |        -4.36% |          45.46 |                      |
| checkpoint/down/0/create               |    20700.00 |    3300.00 |    14400.00 |    4000.00 | -30.43% |       -16.43% |          29.97 |                      |
| checkpoint/down/0/sequence             |  1869400.00 |  572800.00 |  1721500.00 |  251200.00 |  -7.91% |        -5.13% |          21.11 |                      |
| checkpoint/down/0/values               |    10600.00 |    3900.00 |    10800.00 |     400.00 |   1.89% |         1.89% |          38.91 |                      |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |      Before |       After | Change |
| :-------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                   |   509304.00 |   479880.00 | -5.78% |
| memory/up/1000/js                       |   407560.00 |   407560.00 |  0.00% |
| storage/up/1000/jsonBytes               |   278238.00 |   278238.00 |  0.00% |
| storage/up/1000/jsonGzipBytes           |    14908.00 |    14908.00 |  0.00% |
| storage/up/1000/messagePackBytes        |   165784.00 |   165784.00 |  0.00% |
| storage/up/1000/messagePackGzipBytes    |    12641.00 |    12641.00 |  0.00% |
| memory/up/5000/native                   |  2304144.00 |  2154504.00 | -6.49% |
| memory/up/5000/js                       |  2059744.00 |  2059744.00 |  0.00% |
| storage/up/5000/jsonBytes               |  1662776.00 |  1662776.00 |  0.00% |
| storage/up/5000/jsonGzipBytes           |    75146.00 |    75146.00 |  0.00% |
| storage/up/5000/messagePackBytes        |   839612.00 |   839612.00 |  0.00% |
| storage/up/5000/messagePackGzipBytes    |    63127.00 |    63127.00 |  0.00% |
| memory/up/10000/native                  |  3862440.00 |  3563168.00 | -7.75% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  5274768.00 |  4815496.00 | -8.71% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6908040.00 |  6309528.00 | -8.66% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  8291920.00 |  7533408.00 | -9.15% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  7187552.00 |  6589048.00 | -8.33% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  6202528.00 |  5743264.00 | -7.40% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  5016200.00 |  4716944.00 | -5.97% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3925088.00 |  3775456.00 | -3.81% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2748336.00 |  2718920.00 | -1.07% |
| memory/down/1000/js                     |   413360.00 |   413360.00 |  0.00% |
| storage/down/1000/jsonBytes             |   386836.00 |   386836.00 |  0.00% |
| storage/down/1000/jsonGzipBytes         |    16336.00 |    16336.00 |  0.00% |
| storage/down/1000/messagePackBytes      |   271220.00 |   271220.00 |  0.00% |
| storage/down/1000/messagePackGzipBytes  |    13932.00 |    13932.00 |  0.00% |
| memory/down/0/native                    |  1598048.00 |  1598048.00 |  0.00% |
| memory/down/0/js                        |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonBytes                |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonGzipBytes            |       32.00 |       32.00 |  0.00% |
| storage/down/0/messagePackBytes         |        8.00 |        8.00 |  0.00% |
| storage/down/0/messagePackGzipBytes     |       28.00 |       28.00 |  0.00% |
