# footage-copy-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: footage-copy. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/footage-copy-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    12984.37 |     435.95 |     3837.87 |     234.86 | -70.44% |       -70.71% |           1.74 |                      |
| lifecycle/scaleUp/insert.head          |      826.74 |      48.60 |      846.50 |      99.18 |   2.39% |         3.18% |           8.72 |                      |
| lifecycle/scaleUp/insert.random        |     6470.05 |      99.43 |     1742.50 |      31.94 | -73.07% |       -73.21% |           0.30 |                      |
| lifecycle/scaleUp/insert.tail          |      832.58 |     167.22 |      740.62 |      45.05 | -11.05% |       -12.52% |           1.08 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11089.18 |     211.12 |     2741.95 |     116.84 | -75.27% |       -75.23% |           0.98 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2719.67 |     426.19 |     2439.24 |      84.36 | -10.31% |        -5.45% |          10.81 |                      |
| lifecycle/scaleUp/replace.random       |    11841.12 |     163.30 |     3494.37 |     160.33 | -70.49% |       -69.99% |           1.01 |                      |
| lifecycle/scaleUp/replace.tail         |     2410.77 |     190.91 |     2431.12 |     124.03 |   0.84% |         4.05% |          11.28 |                      |
| lifecycle/scaleUp/value.head           |      374.66 |      20.50 |      309.06 |      56.68 | -17.51% |       -13.72% |          12.92 |                      |
| lifecycle/scaleUp/value.random         |     9372.91 |     150.46 |     1136.39 |       8.27 | -87.88% |       -87.88% |           0.19 |                      |
| lifecycle/scaleUp/value.tail           |      236.17 |      14.43 |      154.66 |       6.56 | -34.52% |       -33.00% |           3.04 |                      |
| lifecycle/scaleDown/apply.random       |    11142.62 |     338.45 |     3440.07 |      44.53 | -69.13% |       -68.52% |           0.64 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3811.18 |      43.14 |     1693.03 |      58.44 | -55.58% |       -55.97% |           0.89 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1964.51 |     236.19 |     1901.56 |      26.38 |  -3.20% |        -2.49% |          13.80 |                      |
| lifecycle/scaleDown/remove.random      |     5794.58 |     157.20 |     2665.90 |      46.93 | -53.99% |       -53.37% |           0.71 |                      |
| lifecycle/scaleDown/remove.tail        |     2218.26 |     169.92 |     1695.78 |      26.64 | -23.55% |       -19.76% |           8.08 |                      |
| lifecycle/scaleDown/replace.head       |     2791.85 |     271.20 |     2585.14 |      20.12 |  -7.40% |        -4.65% |          11.80 |                      |
| lifecycle/scaleDown/replace.random     |     6255.47 |     343.38 |     3331.59 |     228.05 | -46.74% |       -44.50% |           0.62 |                      |
| lifecycle/scaleDown/replace.tail       |    40714.60 |    1341.67 |    19727.50 |     711.23 | -51.55% |       -50.43% |           1.50 |                      |
| lifecycle/scaleDown/value.head         |      499.98 |      17.98 |      424.46 |       3.96 | -15.10% |       -14.49% |           3.37 |                      |
| lifecycle/scaleDown/value.random       |     3677.86 |      28.11 |     1094.40 |      25.17 | -70.24% |       -70.27% |           0.57 |                      |
| lifecycle/scaleDown/value.tail         |      289.46 |       3.14 |      234.16 |      11.76 | -19.10% |       -16.30% |           4.52 |                      |
| lifecycle/fullLifecycle/apply.random   |    11938.13 |     199.67 |     3685.81 |     121.32 | -69.13% |       -69.70% |           0.62 |                      |
| lifecycle/fullLifecycle/insert.head    |      826.74 |      48.60 |      846.50 |      99.18 |   2.39% |         3.18% |           8.72 |                      |
| lifecycle/fullLifecycle/insert.random  |     5127.43 |      37.13 |     1747.39 |      45.72 | -65.92% |       -66.78% |           1.62 |                      |
| lifecycle/fullLifecycle/insert.tail    |      832.58 |     167.22 |      740.62 |      45.05 | -11.05% |       -12.52% |           1.08 |                      |
| lifecycle/fullLifecycle/remove.head    |     1964.51 |     236.19 |     1901.56 |      26.38 |  -3.20% |        -2.49% |          13.80 |                      |
| lifecycle/fullLifecycle/remove.random  |     8476.17 |      51.60 |     2725.24 |      81.89 | -67.85% |       -67.69% |           0.54 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2218.26 |     169.92 |     1695.78 |      26.64 | -23.55% |       -19.76% |           8.08 |                      |
| lifecycle/fullLifecycle/replace.head   |     2851.00 |     259.90 |     2549.17 |     174.20 | -10.59% |        -8.37% |          11.34 |                      |
| lifecycle/fullLifecycle/replace.random |     9068.14 |     306.03 |     3489.35 |     119.26 | -61.52% |       -61.41% |           0.67 |                      |
| lifecycle/fullLifecycle/replace.tail   |    21562.69 |     766.29 |    11079.31 |     275.90 | -48.62% |       -47.60% |           1.46 |                      |
| lifecycle/fullLifecycle/value.head     |      437.32 |       8.87 |      369.59 |      27.05 | -15.49% |       -12.97% |           6.72 |                      |
| lifecycle/fullLifecycle/value.random   |     6525.38 |     120.17 |     1115.39 |       8.24 | -82.91% |       -82.91% |           0.30 |                      |
| lifecycle/fullLifecycle/value.tail     |      260.60 |       3.40 |      194.41 |      10.71 | -25.40% |       -25.35% |           2.68 |                      |
| checkpoint/up/1000/create              |   296800.00 |  144300.00 |   288900.00 |   44600.00 |  -2.66% |       -13.56% |          21.52 |                      |
| checkpoint/up/1000/sequence            |  2570600.00 |  568200.00 |  2449600.00 |  299200.00 |  -4.71% |        -1.29% |          34.95 |                      |
| checkpoint/up/1000/values              |  1650800.00 |   87200.00 |  1660100.00 |  142400.00 |   0.56% |         6.02% |           7.57 |                      |
| checkpoint/up/5000/create              |  1213600.00 |  141400.00 |   857500.00 |    1800.00 | -29.34% |       -32.07% |           5.23 |                      |
| checkpoint/up/5000/sequence            |  9804200.00 | 2281700.00 |  9494400.00 |  886000.00 |  -3.16% |         1.18% |          28.62 |                      |
| checkpoint/up/5000/values              |  5215700.00 | 2062600.00 |  5339000.00 |  991300.00 |   2.36% |        -7.53% |          34.31 |                      |
| checkpoint/up/10000/create             |  1483500.00 |  121500.00 |  1455600.00 |  100800.00 |  -1.88% |        -6.78% |          11.69 |                      |
| checkpoint/up/10000/sequence           | 15116400.00 |  543800.00 | 14546200.00 |  362300.00 |  -3.77% |        -2.98% |           6.05 |                      |
| checkpoint/up/10000/values             | 21219700.00 |  679500.00 | 20325300.00 |  796800.00 |  -4.21% |        -4.81% |           2.34 |                      |
| checkpoint/up/15000/create             |  2353700.00 |  185400.00 |  2345100.00 |  217500.00 |  -0.37% |         2.27% |          15.00 |                      |
| checkpoint/up/15000/sequence           | 17652300.00 |  703000.00 | 17491600.00 |  596600.00 |  -0.91% |         2.95% |           6.23 |                      |
| checkpoint/up/15000/values             | 31118500.00 |  882100.00 | 30177500.00 |  199400.00 |  -3.02% |        -3.08% |           0.72 |                      |
| checkpoint/up/20000/create             |  3393900.00 |  112900.00 |  3353000.00 |   58200.00 |  -1.21% |        -0.76% |           2.11 |                      |
| checkpoint/up/20000/sequence           | 26172900.00 | 1235400.00 | 26844400.00 | 2824400.00 |   2.57% |         5.43% |           8.46 |                      |
| checkpoint/up/20000/values             | 13613900.00 |  498400.00 | 11058500.00 |  806000.00 | -18.77% |       -20.78% |           5.69 |                      |
| checkpoint/up/25000/create             |  3978000.00 |    9400.00 |  3979800.00 |   80600.00 |   0.05% |         0.05% |           1.79 |                      |
| checkpoint/up/25000/sequence           | 27449400.00 | 1549700.00 | 27284200.00 |  395400.00 |  -0.60% |         0.49% |           3.15 |                      |
| checkpoint/up/25000/values             | 13442600.00 |  200300.00 | 11699800.00 |  914900.00 | -12.96% |       -11.39% |           7.19 |                      |
| checkpoint/down/20000/create           |  3521200.00 |  214500.00 |  3418300.00 |   74200.00 |  -2.92% |         1.97% |           7.28 |                      |
| checkpoint/down/20000/sequence         | 23163600.00 | 1232200.00 | 23220200.00 |  580800.00 |   0.24% |        -1.66% |           6.72 |                      |
| checkpoint/down/20000/values           | 10815000.00 |  170600.00 | 10451800.00 | 1756500.00 |  -3.36% |        -3.36% |           8.95 |                      |
| checkpoint/down/15000/create           |  2422800.00 |  149600.00 |  2336700.00 |   62900.00 |  -3.55% |        -6.01% |           3.04 |                      |
| checkpoint/down/15000/sequence         | 19269600.00 | 2029900.00 | 18434400.00 | 1481900.00 |  -4.33% |        -6.69% |          18.49 |                      |
| checkpoint/down/15000/values           |  8324600.00 |  378400.00 |  7771000.00 |  400100.00 |  -6.65% |       -10.38% |           6.85 |                      |
| checkpoint/down/10000/create           |  1664400.00 |   33300.00 |  1669700.00 |   85000.00 |   0.32% |        -0.74% |           4.46 |                      |
| checkpoint/down/10000/sequence         | 15865300.00 |  616500.00 | 15176600.00 | 1000800.00 |  -4.34% |        -2.67% |           7.41 |                      |
| checkpoint/down/10000/values           |  6213500.00 |  775000.00 |  5232200.00 | 1038200.00 | -15.79% |       -20.87% |          33.08 |                      |
| checkpoint/down/5000/create            |   789100.00 |   41800.00 |   782300.00 |    3600.00 |  -0.86% |        -0.86% |           6.67 |                      |
| checkpoint/down/5000/sequence          | 11604800.00 |  624700.00 | 11716700.00 |  623900.00 |   0.96% |         3.59% |          10.50 |                      |
| checkpoint/down/5000/values            |  3603900.00 | 1253800.00 |  2710000.00 | 1224200.00 | -24.80% |       -29.66% |          63.81 |                      |
| checkpoint/down/1000/create            |   155100.00 |    2400.00 |   161400.00 |   18000.00 |   4.06% |         4.97% |          12.59 | yes                  |
| checkpoint/down/1000/sequence          |  7857700.00 |  744600.00 |  7425200.00 |  793700.00 |  -5.50% |        -5.81% |           9.69 |                      |
| checkpoint/down/1000/values            |   633600.00 |   56400.00 |   609300.00 |   51900.00 |  -3.84% |         0.98% |          11.93 |                      |
| checkpoint/down/0/create               |    14100.00 |    6900.00 |    17600.00 |    2400.00 |  24.82% |        19.70% |          23.69 |                      |
| checkpoint/down/0/sequence             |  1572500.00 |  314000.00 |  1676700.00 |  526000.00 |   6.63% |        -0.01% |          33.83 |                      |
| checkpoint/down/0/values               |    11100.00 |     800.00 |    11900.00 |    1800.00 |   7.21% |         9.09% |          28.33 |                      |

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
