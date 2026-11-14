# directory-outlined-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: directory-outlined. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/directory-outlined-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    13104.11 |     271.82 |     3873.37 |     353.92 | -70.44% |       -70.84% |           3.68 |                      |
| lifecycle/scaleUp/insert.head          |      818.55 |     140.62 |      922.53 |      80.62 |  12.70% |        15.38% |          19.93 | yes                  |
| lifecycle/scaleUp/insert.random        |     6444.30 |     153.32 |     1818.69 |      73.31 | -71.78% |       -72.54% |           1.80 |                      |
| lifecycle/scaleUp/insert.tail          |      817.75 |     112.86 |      775.38 |      80.74 |  -5.18% |        -5.42% |           1.20 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11418.66 |     240.83 |     2759.80 |      67.44 | -75.83% |       -75.25% |           1.09 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2852.29 |     220.28 |     2593.80 |     191.95 |  -9.06% |        -9.06% |          10.80 |                      |
| lifecycle/scaleUp/replace.random       |    11915.36 |     237.36 |     3724.22 |     171.70 | -68.74% |       -68.65% |           0.67 |                      |
| lifecycle/scaleUp/replace.tail         |     2338.72 |      83.72 |     2868.54 |     486.12 |  22.65% |        19.45% |          15.66 | yes                  |
| lifecycle/scaleUp/value.head           |      358.24 |       9.13 |      304.08 |      12.10 | -15.12% |       -14.65% |           7.63 |                      |
| lifecycle/scaleUp/value.random         |     9568.53 |     216.88 |     1141.45 |      35.82 | -88.07% |       -87.94% |           0.86 |                      |
| lifecycle/scaleUp/value.tail           |      236.55 |      11.12 |      156.42 |      16.48 | -33.87% |       -35.40% |           5.73 |                      |
| lifecycle/scaleDown/apply.random       |    10884.16 |     127.65 |     3589.60 |      84.21 | -67.02% |       -67.15% |           2.16 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3766.77 |      91.62 |     1805.02 |      71.73 | -52.08% |       -52.98% |           3.05 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     2206.06 |     408.70 |     1971.09 |      72.41 | -10.65% |       -12.84% |          12.66 |                      |
| lifecycle/scaleDown/remove.random      |     5757.69 |     129.42 |     2742.07 |     615.03 | -52.38% |       -51.77% |          10.68 |                      |
| lifecycle/scaleDown/remove.tail        |     2098.52 |      50.23 |     1749.78 |     110.99 | -16.62% |       -16.62% |           9.30 |                      |
| lifecycle/scaleDown/replace.head       |     2556.60 |     239.36 |     3047.59 |     252.02 |  19.20% |         9.12% |          19.84 |                      |
| lifecycle/scaleDown/replace.random     |     6056.60 |     267.73 |     3429.92 |     120.52 | -43.37% |       -42.64% |           5.64 |                      |
| lifecycle/scaleDown/replace.tail       |    41404.18 |    2574.26 |    29939.22 |     814.90 | -27.69% |       -27.61% |           6.16 |                      |
| lifecycle/scaleDown/value.head         |      494.44 |      29.51 |      432.58 |      14.81 | -12.51% |       -11.56% |           2.62 |                      |
| lifecycle/scaleDown/value.random       |     3685.90 |      43.10 |     1057.74 |      38.72 | -71.30% |       -71.40% |           1.08 |                      |
| lifecycle/scaleDown/value.tail         |      282.86 |       7.66 |      240.09 |      12.50 | -15.12% |       -17.13% |           4.19 |                      |
| lifecycle/fullLifecycle/apply.random   |    11972.40 |      85.91 |     3749.54 |     107.52 | -68.68% |       -68.76% |           1.87 |                      |
| lifecycle/fullLifecycle/insert.head    |      818.55 |     140.62 |      922.53 |      80.62 |  12.70% |        15.38% |          19.93 | yes                  |
| lifecycle/fullLifecycle/insert.random  |     5135.41 |      50.98 |     1811.85 |       6.63 | -64.72% |       -64.85% |           1.82 |                      |
| lifecycle/fullLifecycle/insert.tail    |      817.75 |     112.86 |      775.38 |      80.74 |  -5.18% |        -5.42% |           1.20 |                      |
| lifecycle/fullLifecycle/remove.head    |     2206.06 |     408.70 |     1971.09 |      72.41 | -10.65% |       -12.84% |          12.66 |                      |
| lifecycle/fullLifecycle/remove.random  |     8524.27 |     141.64 |     2736.39 |     358.62 | -67.90% |       -67.64% |           4.76 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2098.52 |      50.23 |     1749.78 |     110.99 | -16.62% |       -16.62% |           9.30 |                      |
| lifecycle/fullLifecycle/replace.head   |     2704.45 |     236.23 |     2830.74 |     125.70 |   4.67% |        -0.47% |          13.16 |                      |
| lifecycle/fullLifecycle/replace.random |     8949.25 |     273.24 |     3583.17 |     126.58 | -59.96% |       -60.03% |           2.59 |                      |
| lifecycle/fullLifecycle/replace.tail   |    21812.28 |    1261.32 |    16300.86 |     531.63 | -25.27% |       -24.89% |           3.91 |                      |
| lifecycle/fullLifecycle/value.head     |      430.78 |      19.32 |      370.20 |       6.09 | -14.06% |       -14.01% |           5.51 |                      |
| lifecycle/fullLifecycle/value.random   |     6601.68 |     110.00 |     1105.88 |      30.98 | -83.25% |       -83.33% |           1.08 |                      |
| lifecycle/fullLifecycle/value.tail     |      262.10 |       6.20 |      193.23 |       8.25 | -26.28% |       -23.79% |           4.69 |                      |
| checkpoint/up/1000/create              |   326900.00 |  204900.00 |   256200.00 |  180000.00 | -21.63% |       -21.63% |           5.09 |                      |
| checkpoint/up/1000/sequence            |  2899800.00 |  256200.00 |  2620000.00 |  199200.00 |  -9.65% |        -6.29% |          19.52 |                      |
| checkpoint/up/1000/values              |  1748600.00 |   72200.00 |  1611700.00 |   69400.00 |  -7.83% |        -7.83% |           7.56 |                      |
| checkpoint/up/5000/create              |   988700.00 |   43800.00 |   873500.00 |   88400.00 | -11.65% |       -14.47% |          10.36 |                      |
| checkpoint/up/5000/sequence            |  9721200.00 |  309800.00 |  9131100.00 |  780100.00 |  -6.07% |        -6.07% |          16.38 |                      |
| checkpoint/up/5000/values              |  5404900.00 |  940100.00 |  5416800.00 |  700300.00 |   0.22% |         3.70% |           1.70 |                      |
| checkpoint/up/10000/create             |  1520400.00 |  212300.00 |  1533600.00 |   65800.00 |   0.87% |         0.93% |          13.19 |                      |
| checkpoint/up/10000/sequence           | 15406600.00 |  843900.00 | 16042500.00 | 2527200.00 |   4.13% |         1.93% |          10.19 |                      |
| checkpoint/up/10000/values             | 20604500.00 |  137300.00 | 21663900.00 |  229900.00 |   5.14% |         4.65% |           0.98 |                      |
| checkpoint/up/15000/create             |  2448900.00 |  128400.00 |  2353200.00 |   51500.00 |  -3.91% |        -4.41% |           6.92 |                      |
| checkpoint/up/15000/sequence           | 17431600.00 | 2005100.00 | 17338900.00 |  565600.00 |  -0.53% |        -0.53% |           7.41 |                      |
| checkpoint/up/15000/values             | 31455600.00 | 1171400.00 | 31440700.00 | 1105700.00 |  -0.05% |        -2.72% |           2.67 |                      |
| checkpoint/up/20000/create             |  3412600.00 |  107700.00 |  3315300.00 |   58700.00 |  -2.85% |        -1.00% |           6.83 |                      |
| checkpoint/up/20000/sequence           | 25980400.00 | 3028200.00 | 24528600.00 |  765800.00 |  -5.59% |        -2.18% |          11.92 |                      |
| checkpoint/up/20000/values             | 14186800.00 | 1672200.00 | 13111400.00 |  925400.00 |  -7.58% |        -5.06% |          12.77 |                      |
| checkpoint/up/25000/create             |  3913400.00 |  182100.00 |  4198800.00 |  196700.00 |   7.29% |         2.63% |           4.50 |                      |
| checkpoint/up/25000/sequence           | 27068900.00 |  851100.00 | 27151200.00 |  505400.00 |   0.30% |         0.30% |           1.31 |                      |
| checkpoint/up/25000/values             | 13453400.00 |   93300.00 | 13390800.00 |  645900.00 |  -0.47% |        -0.12% |           8.79 |                      |
| checkpoint/down/20000/create           |  3456500.00 |  110800.00 |  3340300.00 |   73800.00 |  -3.36% |        -4.17% |           2.83 |                      |
| checkpoint/down/20000/sequence         | 23464400.00 | 4738000.00 | 22786400.00 |  328000.00 |  -2.89% |        -2.89% |          16.25 |                      |
| checkpoint/down/20000/values           | 10562700.00 | 1956400.00 | 10185500.00 |   19300.00 |  -3.57% |        -3.57% |          17.57 |                      |
| checkpoint/down/15000/create           |  2433800.00 |  126000.00 |  2420200.00 |  142500.00 |  -0.56% |        -1.24% |           7.46 |                      |
| checkpoint/down/15000/sequence         | 18967600.00 |  654900.00 | 19239300.00 | 2567800.00 |   1.43% |         1.91% |          10.31 |                      |
| checkpoint/down/15000/values           |  8327800.00 |  414400.00 |  9135900.00 |  973000.00 |   9.70% |        10.40% |          11.60 |                      |
| checkpoint/down/10000/create           |  1672900.00 |   28100.00 |  1657500.00 |   26200.00 |  -0.92% |         0.26% |           4.30 |                      |
| checkpoint/down/10000/sequence         | 15623100.00 |  433700.00 | 15336800.00 |  912900.00 |  -1.83% |        -1.49% |           8.54 |                      |
| checkpoint/down/10000/values           |  6531100.00 |  756400.00 |  6248500.00 |  188400.00 |  -4.33% |         1.13% |          10.58 |                      |
| checkpoint/down/5000/create            |   763500.00 |   56500.00 |   789600.00 |   18500.00 |   3.42% |         0.32% |           5.08 |                      |
| checkpoint/down/5000/sequence          | 12629300.00 | 1115200.00 | 11802100.00 |  249900.00 |  -6.55% |        -4.65% |           8.10 |                      |
| checkpoint/down/5000/values            |  3236600.00 |  495600.00 |  3169200.00 |  444400.00 |  -2.08% |        -2.08% |           4.87 |                      |
| checkpoint/down/1000/create            |   161900.00 |  128600.00 |   151200.00 |   18800.00 |  -6.61% |       -13.34% |          57.40 |                      |
| checkpoint/down/1000/sequence          |  7851400.00 |  900300.00 |  6908400.00 |  895000.00 | -12.01% |        -4.70% |           7.72 |                      |
| checkpoint/down/1000/values            |   651500.00 |   33200.00 |   618500.00 |   17200.00 |  -5.07% |        -4.93% |           3.87 |                      |
| checkpoint/down/0/create               |    13500.00 |    6800.00 |    14700.00 |    1000.00 |   8.89% |        11.81% |          32.12 |                      |
| checkpoint/down/0/sequence             |  1385600.00 |  253600.00 |  1614300.00 |  103800.00 |  16.51% |         9.86% |           8.58 |                      |
| checkpoint/down/0/values               |    10100.00 |     300.00 |    11000.00 |    1300.00 |   8.91% |        13.40% |          13.43 |                      |

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
