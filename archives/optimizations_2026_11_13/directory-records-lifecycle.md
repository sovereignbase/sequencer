# directory-records-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: directory-records. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/directory-records-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    13356.57 |     751.76 |     3783.11 |     197.82 | -71.68% |       -71.38% |           3.97 |                      |
| lifecycle/scaleUp/insert.head          |      855.49 |      70.94 |      830.43 |      46.06 |  -2.93% |        -2.54% |           6.16 |                      |
| lifecycle/scaleUp/insert.random        |     6657.72 |     233.00 |     1743.50 |      89.76 | -73.81% |       -72.81% |           2.50 |                      |
| lifecycle/scaleUp/insert.tail          |      856.79 |      37.33 |      780.22 |      80.59 |  -8.94% |       -10.14% |          12.08 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    12058.49 |     724.17 |     2683.94 |     224.20 | -77.74% |       -77.92% |           3.53 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2737.52 |     257.47 |     2524.67 |      80.68 |  -7.78% |        -7.15% |           2.31 |                      |
| lifecycle/scaleUp/replace.random       |    12451.19 |     134.92 |     3662.36 |     200.18 | -70.59% |       -70.36% |           0.85 |                      |
| lifecycle/scaleUp/replace.tail         |     2352.26 |     185.16 |     2399.14 |     417.24 |   1.99% |        -1.89% |           4.11 |                      |
| lifecycle/scaleUp/value.head           |      360.72 |      12.00 |      325.55 |      39.76 |  -9.75% |       -12.35% |          11.36 |                      |
| lifecycle/scaleUp/value.random         |     9827.70 |     203.94 |     1143.12 |      60.27 | -88.37% |       -88.37% |           1.07 |                      |
| lifecycle/scaleUp/value.tail           |      240.83 |       3.37 |      157.52 |       6.82 | -34.59% |       -33.94% |           4.62 |                      |
| lifecycle/scaleDown/apply.random       |    11248.55 |     810.18 |     3530.31 |     183.55 | -68.62% |       -68.64% |           1.31 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     4038.36 |     223.66 |     1759.95 |      86.98 | -56.42% |       -56.01% |           3.45 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     2030.99 |      52.12 |     1991.20 |      93.02 |  -1.96% |        -4.34% |           5.53 |                      |
| lifecycle/scaleDown/remove.random      |     6077.20 |     228.51 |     2690.40 |     192.86 | -55.73% |       -55.01% |           2.62 |                      |
| lifecycle/scaleDown/remove.tail        |     2166.40 |      88.41 |     1712.42 |     118.40 | -20.96% |       -17.08% |           2.81 |                      |
| lifecycle/scaleDown/replace.head       |     2733.14 |     102.39 |     2878.94 |     268.53 |   5.33% |         1.24% |           3.05 |                      |
| lifecycle/scaleDown/replace.random     |     6292.47 |     610.78 |     3394.26 |     528.35 | -46.06% |       -45.85% |           1.50 |                      |
| lifecycle/scaleDown/replace.tail       |    42301.05 |    1785.75 |    20953.54 |    2236.27 | -50.47% |       -52.88% |           2.56 |                      |
| lifecycle/scaleDown/value.head         |      506.80 |      18.18 |      421.51 |      22.77 | -16.83% |       -14.16% |           7.43 |                      |
| lifecycle/scaleDown/value.random       |     3790.63 |     259.48 |     1101.25 |      52.97 | -70.95% |       -70.96% |           1.28 |                      |
| lifecycle/scaleDown/value.tail         |      294.26 |      20.61 |      234.82 |       3.16 | -20.20% |       -18.45% |           3.70 |                      |
| lifecycle/fullLifecycle/apply.random   |    12530.58 |     235.61 |     3746.69 |     296.21 | -70.10% |       -70.59% |           1.32 |                      |
| lifecycle/fullLifecycle/insert.head    |      855.49 |      70.94 |      830.43 |      46.06 |  -2.93% |        -2.54% |           6.16 |                      |
| lifecycle/fullLifecycle/insert.random  |     5397.24 |     190.21 |     1768.12 |      60.52 | -67.24% |       -67.24% |           2.28 |                      |
| lifecycle/fullLifecycle/insert.tail    |      856.79 |      37.33 |      780.22 |      80.59 |  -8.94% |       -10.14% |          12.08 |                      |
| lifecycle/fullLifecycle/remove.head    |     2030.99 |      52.12 |     1991.20 |      93.02 |  -1.96% |        -4.34% |           5.53 |                      |
| lifecycle/fullLifecycle/remove.random  |     9067.85 |     247.15 |     2766.55 |     221.85 | -69.49% |       -69.68% |           3.12 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2166.40 |      88.41 |     1712.42 |     118.40 | -20.96% |       -17.08% |           2.81 |                      |
| lifecycle/fullLifecycle/replace.head   |     2735.33 |     175.98 |     2729.89 |     355.44 |  -0.20% |        -3.18% |           6.48 |                      |
| lifecycle/fullLifecycle/replace.random |     9371.83 |     338.32 |     3563.41 |     329.17 | -61.98% |       -62.50% |           1.09 |                      |
| lifecycle/fullLifecycle/replace.tail   |    22533.48 |     976.81 |    11857.54 |     830.56 | -47.38% |       -48.95% |           2.52 |                      |
| lifecycle/fullLifecycle/value.head     |      433.11 |      32.33 |      373.53 |      33.74 | -13.76% |       -15.45% |           8.57 |                      |
| lifecycle/fullLifecycle/value.random   |     6876.11 |      79.67 |     1151.99 |      60.22 | -83.25% |       -83.28% |           0.73 |                      |
| lifecycle/fullLifecycle/value.tail     |      268.92 |      12.43 |      194.55 |       4.99 | -27.65% |       -24.74% |           5.28 |                      |
| checkpoint/up/1000/create              |   310000.00 |   28500.00 |   495300.00 |  254500.00 |  59.77% |        49.14% |          83.14 |                      |
| checkpoint/up/1000/sequence            |  2752300.00 |  256900.00 |  2468200.00 |   84900.00 | -10.32% |         0.49% |          15.37 |                      |
| checkpoint/up/1000/values              |  1682600.00 |  303100.00 |  1618400.00 |  106500.00 |  -3.82% |         3.98% |          16.34 |                      |
| checkpoint/up/5000/create              |  1014300.00 |   47100.00 |   953300.00 |  147600.00 |  -6.01% |        -4.94% |          19.34 |                      |
| checkpoint/up/5000/sequence            |  9842100.00 |  565700.00 | 10026100.00 |  980300.00 |   1.87% |        -4.36% |           4.88 |                      |
| checkpoint/up/5000/values              |  4798900.00 |  558500.00 |  5721700.00 | 1855600.00 |  19.23% |         7.35% |          40.01 |                      |
| checkpoint/up/10000/create             |  1636200.00 |  209700.00 |  1493600.00 |   82000.00 |  -8.72% |       -10.43% |          10.66 |                      |
| checkpoint/up/10000/sequence           | 14630300.00 | 3005600.00 | 15859300.00 |  774100.00 |   8.40% |         8.84% |          23.79 |                      |
| checkpoint/up/10000/values             | 21077600.00 | 1503900.00 | 21607200.00 |  555300.00 |   2.51% |        -1.99% |           9.29 |                      |
| checkpoint/up/15000/create             |  3008700.00 | 1572600.00 |  2341500.00 |  319600.00 | -22.18% |       -22.18% |          31.50 |                      |
| checkpoint/up/15000/sequence           | 18047100.00 | 5042000.00 | 18071200.00 |  205700.00 |   0.13% |        -0.77% |          19.41 |                      |
| checkpoint/up/15000/values             | 31164700.00 | 4405100.00 | 31055300.00 | 1762200.00 |  -0.35% |         0.07% |           0.72 |                      |
| checkpoint/up/20000/create             |  3393500.00 |   88400.00 |  3285900.00 |  101100.00 |  -3.17% |        -4.23% |           5.59 |                      |
| checkpoint/up/20000/sequence           | 24442400.00 |  250500.00 | 25968100.00 | 1575300.00 |   6.24% |         5.53% |          16.08 |                      |
| checkpoint/up/20000/values             | 12895200.00 |   20800.00 | 13730400.00 | 1730400.00 |   6.48% |        -3.33% |          10.52 |                      |
| checkpoint/up/25000/create             |  4003800.00 |  125600.00 |  4114100.00 |  183300.00 |   2.75% |         4.57% |           8.41 |                      |
| checkpoint/up/25000/sequence           | 27497700.00 |  554700.00 | 29311300.00 | 1599800.00 |   6.60% |         5.11% |           3.62 |                      |
| checkpoint/up/25000/values             | 14358200.00 |  784200.00 | 13687700.00 |  177200.00 |  -4.67% |        -3.71% |           5.66 |                      |
| checkpoint/down/20000/create           |  3622200.00 |  353200.00 |  3410800.00 |  131800.00 |  -5.84% |        -6.34% |           4.44 |                      |
| checkpoint/down/20000/sequence         | 22829800.00 |  583200.00 | 22648300.00 |  912300.00 |  -0.80% |        -0.83% |           7.41 |                      |
| checkpoint/down/20000/values           | 11576700.00 |  655100.00 | 10876600.00 |  808700.00 |  -6.05% |        -1.47% |           3.60 |                      |
| checkpoint/down/15000/create           |  2431400.00 |  267900.00 |  2471300.00 |  107600.00 |   1.64% |         0.31% |           8.90 |                      |
| checkpoint/down/15000/sequence         | 18995000.00 | 1190600.00 | 21021400.00 | 1987800.00 |  10.67% |         4.77% |          21.15 |                      |
| checkpoint/down/15000/values           |  9158700.00 | 1170900.00 |  8906800.00 | 1030900.00 |  -2.75% |         0.33% |          20.05 |                      |
| checkpoint/down/10000/create           |  1732700.00 |  139400.00 |  1592100.00 |   38400.00 |  -8.11% |        -9.33% |          11.27 |                      |
| checkpoint/down/10000/sequence         | 16015800.00 |  326200.00 | 16519300.00 | 2585300.00 |   3.14% |        -0.36% |           4.95 |                      |
| checkpoint/down/10000/values           |  5931800.00 | 1124500.00 |  7307800.00 | 1115900.00 |  23.20% |        20.06% |          14.61 |                      |
| checkpoint/down/5000/create            |   764600.00 |   23000.00 |   807100.00 |   34700.00 |   5.56% |         3.39% |           4.44 |                      |
| checkpoint/down/5000/sequence          | 12491000.00 |  716100.00 | 12874700.00 | 1915400.00 |   3.07% |         3.07% |          13.33 |                      |
| checkpoint/down/5000/values            |  3208100.00 |  425700.00 |  3530600.00 |  133000.00 |  10.05% |        10.05% |          13.85 |                      |
| checkpoint/down/1000/create            |   163800.00 |   44900.00 |   154400.00 |   13900.00 |  -5.74% |        -5.74% |          33.83 |                      |
| checkpoint/down/1000/sequence          |  7089000.00 | 2882700.00 |  7913900.00 | 1431900.00 |  11.64% |        -1.43% |          16.21 |                      |
| checkpoint/down/1000/values            |   951700.00 |  357200.00 |   624200.00 |   79300.00 | -34.41% |       -37.30% |          33.96 |                      |
| checkpoint/down/0/create               |    18000.00 |   14000.00 |    16200.00 |   10800.00 | -10.00% |       -25.70% |          44.53 |                      |
| checkpoint/down/0/sequence             |  2106900.00 |  965500.00 |  1683300.00 |  489300.00 | -20.11% |        -4.10% |          36.64 |                      |
| checkpoint/down/0/values               |    15900.00 |    6300.00 |    13700.00 |    5300.00 | -13.84% |         2.52% |          71.47 |                      |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |      Before |       After | Change |
| :-------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                   |   509304.00 |   480392.00 | -5.68% |
| memory/up/1000/js                       |   407560.00 |   407560.00 |  0.00% |
| storage/up/1000/jsonBytes               |   278238.00 |   278238.00 |  0.00% |
| storage/up/1000/jsonGzipBytes           |    14908.00 |    14908.00 |  0.00% |
| storage/up/1000/messagePackBytes        |   165784.00 |   165784.00 |  0.00% |
| storage/up/1000/messagePackGzipBytes    |    12641.00 |    12641.00 |  0.00% |
| memory/up/5000/native                   |  2304144.00 |  2156552.00 | -6.41% |
| memory/up/5000/js                       |  2059744.00 |  2059744.00 |  0.00% |
| storage/up/5000/jsonBytes               |  1662776.00 |  1662776.00 |  0.00% |
| storage/up/5000/jsonGzipBytes           |    75146.00 |    75146.00 |  0.00% |
| storage/up/5000/messagePackBytes        |   839612.00 |   839612.00 |  0.00% |
| storage/up/5000/messagePackGzipBytes    |    63127.00 |    63127.00 |  0.00% |
| memory/up/10000/native                  |  3862440.00 |  3567264.00 | -7.64% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  5274768.00 |  4819592.00 | -8.63% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6908040.00 |  6317720.00 | -8.55% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  8291920.00 |  7541600.00 | -9.05% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  7187552.00 |  6597240.00 | -8.21% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  6202528.00 |  5747360.00 | -7.34% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  5016200.00 |  4721040.00 | -5.88% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3925088.00 |  3777504.00 | -3.76% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2748336.00 |  2719432.00 | -1.05% |
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
