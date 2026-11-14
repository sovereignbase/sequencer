# footage-copy-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: directory-lazy; candidate: footage-copy. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/footage-copy-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |     3838.27 |     324.05 |     3837.87 |     234.86 |  -0.01% |         2.77% |           9.44 |                      |
| lifecycle/scaleUp/insert.head          |      843.97 |     101.66 |      846.50 |      99.18 |   0.30% |         0.30% |           4.06 |                      |
| lifecycle/scaleUp/insert.random        |     1701.94 |      36.06 |     1742.50 |      31.94 |   2.38% |         1.15% |           4.28 |                      |
| lifecycle/scaleUp/insert.tail          |      758.27 |      98.00 |      740.62 |      45.05 |  -2.33% |        -3.94% |           5.13 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |     2708.60 |     398.16 |     2741.95 |     116.84 |   1.23% |         0.02% |          18.92 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2826.34 |     443.89 |     2439.24 |      84.36 | -13.70% |         2.41% |          18.98 |                      |
| lifecycle/scaleUp/replace.random       |     3591.21 |     690.32 |     3494.37 |     160.33 |  -2.70% |        -1.05% |           3.57 |                      |
| lifecycle/scaleUp/replace.tail         |     2298.25 |     339.67 |     2431.12 |     124.03 |   5.78% |        -0.82% |           8.32 |                      |
| lifecycle/scaleUp/value.head           |      316.83 |      21.71 |      309.06 |      56.68 |  -2.45% |         2.87% |          23.15 |                      |
| lifecycle/scaleUp/value.random         |     1133.91 |       8.46 |     1136.39 |       8.27 |   0.22% |         0.11% |           1.09 |                      |
| lifecycle/scaleUp/value.tail           |      158.43 |       4.26 |      154.66 |       6.56 |  -2.38% |        -3.37% |           4.45 |                      |
| lifecycle/scaleDown/apply.random       |     3448.58 |     159.43 |     3440.07 |      44.53 |  -0.25% |         0.81% |           4.31 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     1802.80 |     378.80 |     1693.03 |      58.44 |  -6.09% |        -1.44% |           5.78 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1977.47 |      81.50 |     1901.56 |      26.38 |  -3.84% |         0.52% |           7.62 |                      |
| lifecycle/scaleDown/remove.random      |     2615.33 |     234.50 |     2665.90 |      46.93 |   1.93% |        -0.17% |           9.21 |                      |
| lifecycle/scaleDown/remove.tail        |     1737.02 |      50.20 |     1695.78 |      26.64 |  -2.37% |        -2.87% |           3.88 |                      |
| lifecycle/scaleDown/replace.head       |     2761.75 |     316.50 |     2585.14 |      20.12 |  -6.40% |        -2.28% |           7.49 |                      |
| lifecycle/scaleDown/replace.random     |     3325.14 |     358.82 |     3331.59 |     228.05 |   0.19% |        -0.30% |           3.43 |                      |
| lifecycle/scaleDown/replace.tail       |    18898.27 |    4648.59 |    19727.50 |     711.23 |   4.39% |         1.63% |          16.24 |                      |
| lifecycle/scaleDown/value.head         |      438.98 |      26.58 |      424.46 |       3.96 |  -3.31% |        -4.35% |           7.67 |                      |
| lifecycle/scaleDown/value.random       |     1078.00 |     116.00 |     1094.40 |      25.17 |   1.52% |         0.91% |           8.19 |                      |
| lifecycle/scaleDown/value.tail         |      237.41 |       8.73 |      234.16 |      11.76 |  -1.37% |        -1.16% |           7.04 |                      |
| lifecycle/fullLifecycle/apply.random   |     3671.07 |     137.74 |     3685.81 |     121.32 |   0.40% |        -0.69% |           3.80 |                      |
| lifecycle/fullLifecycle/insert.head    |      843.97 |     101.66 |      846.50 |      99.18 |   0.30% |         0.30% |           4.06 |                      |
| lifecycle/fullLifecycle/insert.random  |     1883.12 |     206.60 |     1747.39 |      45.72 |  -7.21% |        -1.08% |          15.88 |                      |
| lifecycle/fullLifecycle/insert.tail    |      758.27 |      98.00 |      740.62 |      45.05 |  -2.33% |        -3.94% |           5.13 |                      |
| lifecycle/fullLifecycle/remove.head    |     1977.47 |      81.50 |     1901.56 |      26.38 |  -3.84% |         0.52% |           7.62 |                      |
| lifecycle/fullLifecycle/remove.random  |     2838.03 |     163.65 |     2725.24 |      81.89 |  -3.97% |        -5.05% |           5.41 |                      |
| lifecycle/fullLifecycle/remove.tail    |     1737.02 |      50.20 |     1695.78 |      26.64 |  -2.37% |        -2.87% |           3.88 |                      |
| lifecycle/fullLifecycle/replace.head   |     2662.16 |     110.93 |     2549.17 |     174.20 |  -4.24% |        -4.98% |           6.19 |                      |
| lifecycle/fullLifecycle/replace.random |     3669.25 |     299.02 |     3489.35 |     119.26 |  -4.90% |        -1.82% |           4.14 |                      |
| lifecycle/fullLifecycle/replace.tail   |    10765.13 |    2088.35 |    11079.31 |     275.90 |   2.92% |         2.39% |          14.35 |                      |
| lifecycle/fullLifecycle/value.head     |      380.78 |      17.45 |      369.59 |      27.05 |  -2.94% |        -0.61% |           8.27 |                      |
| lifecycle/fullLifecycle/value.random   |     1146.71 |      64.13 |     1115.39 |       8.24 |  -2.73% |        -2.40% |           5.29 |                      |
| lifecycle/fullLifecycle/value.tail     |      198.10 |       8.62 |      194.41 |      10.71 |  -1.86% |        -2.07% |           0.21 |                      |
| checkpoint/up/1000/create              |   262500.00 |   77200.00 |   288900.00 |   44600.00 |  10.06% |        -1.59% |          12.35 |                      |
| checkpoint/up/1000/sequence            |  2758300.00 |  214700.00 |  2449600.00 |  299200.00 | -11.19% |        -9.96% |          10.01 |                      |
| checkpoint/up/1000/values              |  1676700.00 |   52700.00 |  1660100.00 |  142400.00 |  -0.99% |        -3.12% |           6.46 |                      |
| checkpoint/up/5000/create              |   843100.00 |   17000.00 |   857500.00 |    1800.00 |   1.71% |         1.31% |           5.24 |                      |
| checkpoint/up/5000/sequence            |  9656300.00 |  426400.00 |  9494400.00 |  886000.00 |  -1.68% |        -5.48% |           1.92 |                      |
| checkpoint/up/5000/values              |  4979300.00 |  620900.00 |  5339000.00 |  991300.00 |   7.22% |        15.80% |          34.37 |                      |
| checkpoint/up/10000/create             |  1482900.00 |   86400.00 |  1455600.00 |  100800.00 |  -1.84% |        -2.59% |           8.81 |                      |
| checkpoint/up/10000/sequence           | 14935400.00 |  523600.00 | 14546200.00 |  362300.00 |  -2.61% |        -0.49% |           5.71 |                      |
| checkpoint/up/10000/values             | 21286800.00 |  715400.00 | 20325300.00 |  796800.00 |  -4.52% |        -5.74% |           3.01 |                      |
| checkpoint/up/15000/create             |  2419000.00 |   27400.00 |  2345100.00 |  217500.00 |  -3.05% |        -2.29% |           9.32 |                      |
| checkpoint/up/15000/sequence           | 17719500.00 | 1314100.00 | 17491600.00 |  596600.00 |  -1.29% |        -2.86% |           3.76 |                      |
| checkpoint/up/15000/values             | 32020000.00 |  675300.00 | 30177500.00 |  199400.00 |  -5.75% |        -5.75% |           1.72 |                      |
| checkpoint/up/20000/create             |  3339300.00 |  144500.00 |  3353000.00 |   58200.00 |   0.41% |        -1.73% |           4.54 |                      |
| checkpoint/up/20000/sequence           | 25234400.00 | 1421700.00 | 26844400.00 | 2824400.00 |   6.38% |         6.38% |          16.84 |                      |
| checkpoint/up/20000/values             | 13677800.00 |  318600.00 | 11058500.00 |  806000.00 | -19.15% |       -17.38% |           5.76 |                      |
| checkpoint/up/25000/create             |  4054400.00 |  214500.00 |  3979800.00 |   80600.00 |  -1.84% |        -1.58% |           4.63 |                      |
| checkpoint/up/25000/sequence           | 29791900.00 | 4210000.00 | 27284200.00 |  395400.00 |  -8.42% |        -8.69% |          13.68 |                      |
| checkpoint/up/25000/values             | 13843000.00 |  839700.00 | 11699800.00 |  914900.00 | -15.48% |       -13.62% |           2.51 |                      |
| checkpoint/down/20000/create           |  3435000.00 |  108200.00 |  3418300.00 |   74200.00 |  -0.49% |        -0.24% |           4.58 |                      |
| checkpoint/down/20000/sequence         | 23443700.00 | 1690400.00 | 23220200.00 |  580800.00 |  -0.95% |        -2.84% |           3.24 |                      |
| checkpoint/down/20000/values           | 10584400.00 |  181300.00 | 10451800.00 | 1756500.00 |  -1.25% |       -15.88% |          17.43 |                      |
| checkpoint/down/15000/create           |  2325500.00 |   20100.00 |  2336700.00 |   62900.00 |   0.48% |        -0.33% |           2.07 |                      |
| checkpoint/down/15000/sequence         | 18619200.00 | 2235100.00 | 18434400.00 | 1481900.00 |  -0.99% |        -3.43% |           4.47 |                      |
| checkpoint/down/15000/values           |  8833700.00 |  167200.00 |  7771000.00 |  400100.00 | -12.03% |       -15.55% |          11.66 |                      |
| checkpoint/down/10000/create           |  1637200.00 |   63500.00 |  1669700.00 |   85000.00 |   1.99% |         1.83% |           3.94 |                      |
| checkpoint/down/10000/sequence         | 15691700.00 | 1304300.00 | 15176600.00 | 1000800.00 |  -3.28% |        -2.95% |           2.98 |                      |
| checkpoint/down/10000/values           |  6220000.00 |  695300.00 |  5232200.00 | 1038200.00 | -15.88% |       -10.19% |          11.30 |                      |
| checkpoint/down/5000/create            |   790200.00 |   11900.00 |   782300.00 |    3600.00 |  -1.00% |        -0.42% |           1.84 |                      |
| checkpoint/down/5000/sequence          | 11424500.00 |  242600.00 | 11716700.00 |  623900.00 |   2.56% |         4.21% |           8.75 |                      |
| checkpoint/down/5000/values            |  3819100.00 |  419600.00 |  2710000.00 | 1224200.00 | -29.04% |       -19.15% |          39.59 |                      |
| checkpoint/down/1000/create            |   152900.00 |    7500.00 |   161400.00 |   18000.00 |   5.56% |         7.86% |          19.00 |                      |
| checkpoint/down/1000/sequence          |  7015400.00 | 1140300.00 |  7425200.00 |  793700.00 |   5.84% |         5.84% |           5.87 |                      |
| checkpoint/down/1000/values            |   652400.00 |   74700.00 |   609300.00 |   51900.00 |  -6.61% |        -6.61% |          14.19 |                      |
| checkpoint/down/0/create               |    17500.00 |    3000.00 |    17600.00 |    2400.00 |   0.57% |       -10.64% |          24.41 |                      |
| checkpoint/down/0/sequence             |  1534900.00 |  304100.00 |  1676700.00 |  526000.00 |   9.24% |         0.88% |          13.29 |                      |
| checkpoint/down/0/values               |    11700.00 |    1300.00 |    11900.00 |    1800.00 |   1.71% |         1.71% |          21.74 |                      |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |      Before |       After | Change |
| :-------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                   |   480392.00 |   480392.00 |  0.00% |
| memory/up/1000/js                       |   407560.00 |   407560.00 |  0.00% |
| storage/up/1000/jsonBytes               |   278238.00 |   278238.00 |  0.00% |
| storage/up/1000/jsonGzipBytes           |    14908.00 |    14908.00 |  0.00% |
| storage/up/1000/messagePackBytes        |   165784.00 |   165784.00 |  0.00% |
| storage/up/1000/messagePackGzipBytes    |    12641.00 |    12641.00 |  0.00% |
| memory/up/5000/native                   |  2156552.00 |  2156552.00 |  0.00% |
| memory/up/5000/js                       |  2059744.00 |  2059744.00 |  0.00% |
| storage/up/5000/jsonBytes               |  1662776.00 |  1662776.00 |  0.00% |
| storage/up/5000/jsonGzipBytes           |    75146.00 |    75146.00 |  0.00% |
| storage/up/5000/messagePackBytes        |   839612.00 |   839612.00 |  0.00% |
| storage/up/5000/messagePackGzipBytes    |    63127.00 |    63127.00 |  0.00% |
| memory/up/10000/native                  |  3567264.00 |  3567264.00 |  0.00% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  4819592.00 |  4819592.00 |  0.00% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6317720.00 |  6317720.00 |  0.00% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  7541600.00 |  7541600.00 |  0.00% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  6597240.00 |  6597240.00 |  0.00% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  5747360.00 |  5747360.00 |  0.00% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  4721040.00 |  4721040.00 |  0.00% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3777504.00 |  3777504.00 |  0.00% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2719432.00 |  2719432.00 |  0.00% |
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
