# compact-removals-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: compact-removals. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/compact-removals-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    12580.55 |     106.54 |     3741.18 |     131.71 | -70.26% |       -70.04% |           1.15 |                      |
| lifecycle/scaleUp/insert.head          |      844.55 |      92.31 |      907.33 |     115.47 |   7.43% |         7.37% |          14.63 | yes                  |
| lifecycle/scaleUp/insert.random        |     6398.90 |     133.36 |     1747.95 |      95.39 | -72.68% |       -72.84% |           1.39 |                      |
| lifecycle/scaleUp/insert.tail          |      805.82 |     144.39 |      762.02 |      37.93 |  -5.44% |        -3.23% |           2.52 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11200.56 |      84.38 |     2761.99 |     139.99 | -75.34% |       -75.62% |           1.53 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2551.37 |      48.82 |     2494.12 |     141.46 |  -2.24% |         0.83% |           5.38 |                      |
| lifecycle/scaleUp/replace.random       |    11749.08 |     155.54 |     3636.36 |     216.46 | -69.05% |       -69.76% |           3.24 |                      |
| lifecycle/scaleUp/replace.tail         |     2373.30 |     432.96 |     2464.87 |     102.61 |   3.86% |         3.86% |          14.81 |                      |
| lifecycle/scaleUp/value.head           |      371.02 |      27.08 |      320.21 |      14.90 | -13.69% |       -13.80% |           3.86 |                      |
| lifecycle/scaleUp/value.random         |     9427.65 |      87.54 |     1155.73 |      20.35 | -87.74% |       -87.70% |           0.37 |                      |
| lifecycle/scaleUp/value.tail           |      234.40 |       7.70 |      157.32 |       3.28 | -32.88% |       -33.14% |           1.81 |                      |
| lifecycle/scaleDown/apply.random       |    10990.28 |     675.01 |     3467.30 |     542.84 | -68.45% |       -68.47% |           7.43 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3873.01 |     317.74 |     1712.04 |      27.26 | -55.80% |       -55.90% |           4.63 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1985.81 |      37.43 |     1886.74 |     129.55 |  -4.99% |        -3.75% |           3.41 |                      |
| lifecycle/scaleDown/remove.random      |     5722.23 |      79.99 |     2701.02 |     344.26 | -52.80% |       -51.74% |           6.18 |                      |
| lifecycle/scaleDown/remove.tail        |     2069.51 |     120.72 |     1818.66 |     812.84 | -12.12% |       -15.78% |           7.97 |                      |
| lifecycle/scaleDown/replace.head       |     2633.50 |     142.91 |     2635.52 |     225.91 |   0.08% |         1.39% |           5.54 |                      |
| lifecycle/scaleDown/replace.random     |     5965.34 |     395.13 |     3410.04 |     552.77 | -42.84% |       -41.67% |           7.78 |                      |
| lifecycle/scaleDown/replace.tail       |    41683.41 |    3284.51 |    20023.28 |     307.40 | -51.96% |       -52.43% |           1.11 |                      |
| lifecycle/scaleDown/value.head         |      502.19 |      10.85 |      438.78 |      14.82 | -12.63% |       -12.86% |           1.42 |                      |
| lifecycle/scaleDown/value.random       |     3683.07 |     104.96 |     1087.44 |      24.76 | -70.47% |       -70.47% |           1.39 |                      |
| lifecycle/scaleDown/value.tail         |      287.40 |       3.02 |      235.06 |       1.86 | -18.21% |       -18.42% |           1.18 |                      |
| lifecycle/fullLifecycle/apply.random   |    11848.09 |     285.51 |     3618.24 |     291.66 | -69.46% |       -69.31% |           4.21 |                      |
| lifecycle/fullLifecycle/insert.head    |      844.55 |      92.31 |      907.33 |     115.47 |   7.43% |         7.37% |          14.63 | yes                  |
| lifecycle/fullLifecycle/insert.random  |     5159.41 |     177.82 |     1730.77 |      84.12 | -66.45% |       -66.41% |           0.09 |                      |
| lifecycle/fullLifecycle/insert.tail    |      805.82 |     144.39 |      762.02 |      37.93 |  -5.44% |        -3.23% |           2.52 |                      |
| lifecycle/fullLifecycle/remove.head    |     1985.81 |      37.43 |     1886.74 |     129.55 |  -4.99% |        -3.75% |           3.41 |                      |
| lifecycle/fullLifecycle/remove.random  |     8489.12 |     204.12 |     2898.42 |     230.38 | -65.86% |       -65.86% |           3.50 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2069.51 |     120.72 |     1818.66 |     812.84 | -12.12% |       -15.78% |           7.97 |                      |
| lifecycle/fullLifecycle/replace.head   |     2596.84 |     123.30 |     2615.16 |     107.32 |   0.71% |         1.35% |           2.47 |                      |
| lifecycle/fullLifecycle/replace.random |     8982.47 |     141.52 |     3690.83 |     217.13 | -58.91% |       -58.71% |           0.70 |                      |
| lifecycle/fullLifecycle/replace.tail   |    22201.95 |    1671.35 |    11211.74 |     205.00 | -49.50% |       -49.89% |           1.18 |                      |
| lifecycle/fullLifecycle/value.head     |      435.30 |      21.19 |      378.59 |       4.98 | -13.03% |       -12.82% |           0.76 |                      |
| lifecycle/fullLifecycle/value.random   |     6566.37 |     112.30 |     1129.56 |      14.68 | -82.80% |       -83.01% |           0.58 |                      |
| lifecycle/fullLifecycle/value.tail     |      262.40 |       4.60 |      196.19 |       3.04 | -25.23% |       -24.45% |           0.49 |                      |
| checkpoint/up/1000/create              |   333600.00 |   96600.00 |   258600.00 |   12400.00 | -22.48% |       -18.66% |          21.54 |                      |
| checkpoint/up/1000/sequence            |  3140300.00 |  635700.00 |  2019200.00 |   94300.00 | -35.70% |       -38.94% |          15.94 |                      |
| checkpoint/up/1000/values              |  1742900.00 |   99400.00 |  1623500.00 |   87800.00 |  -6.85% |        -8.44% |           4.26 |                      |
| checkpoint/up/5000/create              |   980000.00 |    8800.00 |   848400.00 |   21000.00 | -13.43% |       -11.12% |           7.31 |                      |
| checkpoint/up/5000/sequence            |  9307000.00 |  540800.00 |  7977300.00 | 1394900.00 | -14.29% |       -15.90% |          12.62 |                      |
| checkpoint/up/5000/values              |  4984900.00 |  449900.00 |  5580000.00 | 1602700.00 |  11.94% |        -5.64% |          36.89 |                      |
| checkpoint/up/10000/create             |  1481500.00 |  169100.00 |  1523400.00 |  128600.00 |   2.83% |         0.01% |          13.57 |                      |
| checkpoint/up/10000/sequence           | 14989600.00 | 1515300.00 | 13367400.00 | 1143300.00 | -10.82% |       -15.18% |           2.74 |                      |
| checkpoint/up/10000/values             | 21554800.00 | 1465700.00 | 20145100.00 |  542700.00 |  -6.54% |        -5.16% |           4.30 |                      |
| checkpoint/up/15000/create             |  2360900.00 |  245400.00 |  2336500.00 |   48600.00 |  -1.03% |         0.62% |          12.32 |                      |
| checkpoint/up/15000/sequence           | 19070100.00 | 2702400.00 | 15123100.00 |  811700.00 | -20.70% |       -13.58% |           7.35 |                      |
| checkpoint/up/15000/values             | 30525000.00 |  729500.00 | 30268400.00 |  335400.00 |  -0.84% |        -1.47% |           0.57 |                      |
| checkpoint/up/20000/create             |  3396400.00 |  214100.00 |  3386900.00 |  217300.00 |  -0.28% |         0.76% |          13.66 |                      |
| checkpoint/up/20000/sequence           | 23951500.00 | 1110400.00 | 22248800.00 | 1481600.00 |  -7.11% |        -8.41% |          11.33 |                      |
| checkpoint/up/20000/values             | 13042000.00 |  133300.00 | 11711700.00 | 1267600.00 | -10.20% |       -13.21% |          11.22 |                      |
| checkpoint/up/25000/create             |  3956200.00 |   61700.00 |  3965300.00 |  580900.00 |   0.23% |         0.13% |          15.30 |                      |
| checkpoint/up/25000/sequence           | 26942700.00 | 1531300.00 | 24693000.00 | 1166100.00 |  -8.35% |        -9.70% |           7.03 |                      |
| checkpoint/up/25000/values             | 13533900.00 |  726200.00 | 12073000.00 | 1214200.00 | -10.79% |       -10.17% |           6.00 |                      |
| checkpoint/down/20000/create           |  3494700.00 |  480500.00 |  3469600.00 |  178600.00 |  -0.72% |         2.10% |          15.18 |                      |
| checkpoint/down/20000/sequence         | 22730600.00 | 1781400.00 | 19259700.00 |  168500.00 | -15.27% |       -16.23% |           7.23 |                      |
| checkpoint/down/20000/values           | 11162200.00 |  162800.00 |  9277300.00 |  833700.00 | -16.89% |       -18.49% |          10.51 |                      |
| checkpoint/down/15000/create           |  2395100.00 |   13600.00 |  2403900.00 |  113500.00 |   0.37% |        -1.81% |           5.43 |                      |
| checkpoint/down/15000/sequence         | 19175600.00 | 1065200.00 | 15995600.00 |  801600.00 | -16.58% |       -15.87% |           6.38 |                      |
| checkpoint/down/15000/values           |  8548300.00 | 1021200.00 |  7285200.00 |  283200.00 | -14.78% |       -19.08% |           9.74 |                      |
| checkpoint/down/10000/create           |  1632700.00 |    6400.00 |  1674100.00 |   19600.00 |   2.54% |         1.57% |           5.41 |                      |
| checkpoint/down/10000/sequence         | 15036500.00 |  691400.00 | 12698700.00 | 1246100.00 | -15.55% |       -14.81% |          10.80 |                      |
| checkpoint/down/10000/values           |  6025900.00 |  421000.00 |  5275100.00 |  315800.00 | -12.46% |       -12.46% |           2.47 |                      |
| checkpoint/down/5000/create            |   780200.00 |   21700.00 |   767000.00 |   12100.00 |  -1.69% |        -1.98% |           6.03 |                      |
| checkpoint/down/5000/sequence          | 12010000.00 |  691200.00 |  9465300.00 |  462000.00 | -21.19% |       -15.69% |           7.56 |                      |
| checkpoint/down/5000/values            |  3223900.00 |  380200.00 |  3002200.00 |  534400.00 |  -6.88% |       -11.74% |          27.34 |                      |
| checkpoint/down/1000/create            |   152000.00 |    3800.00 |   156200.00 |    6800.00 |   2.76% |         4.51% |           4.54 |                      |
| checkpoint/down/1000/sequence          |  7387300.00 |  890700.00 |  6058300.00 |  130200.00 | -17.99% |       -17.96% |           2.08 |                      |
| checkpoint/down/1000/values            |   647600.00 |  278000.00 |   584000.00 |   67900.00 |  -9.82% |       -16.53% |          19.35 |                      |
| checkpoint/down/0/create               |    22300.00 |   11500.00 |    17900.00 |    2200.00 | -19.73% |       -19.73% |          36.77 |                      |
| checkpoint/down/0/sequence             |  1856100.00 |  270100.00 |  1316500.00 |  394900.00 | -29.07% |       -20.28% |          21.43 |                      |
| checkpoint/down/0/values               |    11900.00 |    3300.00 |    11100.00 |    1900.00 |  -6.72% |        -7.69% |          17.84 |                      |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |      Before |       After | Change |
| :-------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                   |   509304.00 |   480376.00 | -5.68% |
| memory/up/1000/js                       |   407560.00 |   407560.00 |  0.00% |
| storage/up/1000/jsonBytes               |   278238.00 |   278238.00 |  0.00% |
| storage/up/1000/jsonGzipBytes           |    14908.00 |    14908.00 |  0.00% |
| storage/up/1000/messagePackBytes        |   165784.00 |   165784.00 |  0.00% |
| storage/up/1000/messagePackGzipBytes    |    12641.00 |    12641.00 |  0.00% |
| memory/up/5000/native                   |  2304144.00 |  2156536.00 | -6.41% |
| memory/up/5000/js                       |  2059744.00 |  2059744.00 |  0.00% |
| storage/up/5000/jsonBytes               |  1662776.00 |  1662776.00 |  0.00% |
| storage/up/5000/jsonGzipBytes           |    75146.00 |    75146.00 |  0.00% |
| storage/up/5000/messagePackBytes        |   839612.00 |   839612.00 |  0.00% |
| storage/up/5000/messagePackGzipBytes    |    63127.00 |    63127.00 |  0.00% |
| memory/up/10000/native                  |  3862440.00 |  3567256.00 | -7.64% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  5274768.00 |  4819576.00 | -8.63% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6908040.00 |  6317704.00 | -8.55% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  8291920.00 |  7541584.00 | -9.05% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  7187552.00 |  6597224.00 | -8.21% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  6202528.00 |  5747352.00 | -7.34% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  5016200.00 |  4721024.00 | -5.88% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3925088.00 |  3777488.00 | -3.76% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2748336.00 |  2719416.00 | -1.05% |
| memory/down/1000/js                     |   413360.00 |   413360.00 |  0.00% |
| storage/down/1000/jsonBytes             |   386836.00 |   386836.00 |  0.00% |
| storage/down/1000/jsonGzipBytes         |    16336.00 |    16336.00 |  0.00% |
| storage/down/1000/messagePackBytes      |   271220.00 |   271220.00 |  0.00% |
| storage/down/1000/messagePackGzipBytes  |    13932.00 |    13932.00 |  0.00% |
| memory/down/0/native                    |  1598048.00 |  1598032.00 | -0.00% |
| memory/down/0/js                        |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonBytes                |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonGzipBytes            |       32.00 |       32.00 |  0.00% |
| storage/down/0/messagePackBytes         |        8.00 |        8.00 |  0.00% |
| storage/down/0/messagePackGzipBytes     |       28.00 |       28.00 |  0.00% |
