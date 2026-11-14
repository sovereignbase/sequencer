# directory-records-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: subtree-cache; candidate: directory-records. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/directory-records-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |     3788.52 |      84.74 |     3783.11 |     197.82 |  -0.14% |        -3.46% |           3.97 |                      |
| lifecycle/scaleUp/insert.head          |      906.11 |      86.56 |      830.43 |      46.06 |  -8.35% |        -7.56% |           1.56 |                      |
| lifecycle/scaleUp/insert.random        |     1888.54 |     195.51 |     1743.50 |      89.76 |  -7.68% |        -4.43% |           2.67 |                      |
| lifecycle/scaleUp/insert.tail          |      834.49 |     104.80 |      780.22 |      80.59 |  -6.50% |        -6.50% |           1.54 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |     2796.89 |      84.84 |     2683.94 |     224.20 |  -4.04% |         0.06% |           3.44 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2526.90 |     150.64 |     2524.67 |      80.68 |  -0.09% |        -1.06% |           2.75 |                      |
| lifecycle/scaleUp/replace.random       |     3620.68 |     334.15 |     3662.36 |     200.18 |   1.15% |        -2.44% |           3.60 |                      |
| lifecycle/scaleUp/replace.tail         |     2426.92 |     207.02 |     2399.14 |     417.24 |  -1.14% |         2.07% |          14.79 |                      |
| lifecycle/scaleUp/value.head           |      320.10 |       4.95 |      325.55 |      39.76 |   1.70% |         1.70% |          14.52 |                      |
| lifecycle/scaleUp/value.random         |     1119.90 |      45.42 |     1143.12 |      60.27 |   2.07% |         1.92% |           1.67 |                      |
| lifecycle/scaleUp/value.tail           |      159.79 |       3.80 |      157.52 |       6.82 |  -1.42% |         1.24% |           3.88 |                      |
| lifecycle/scaleDown/apply.random       |     3594.05 |      62.47 |     3530.31 |     183.55 |  -1.77% |        -2.73% |           6.30 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     1823.31 |      18.00 |     1759.95 |      86.98 |  -3.48% |        -3.48% |           7.11 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1958.13 |      48.69 |     1991.20 |      93.02 |   1.69% |         0.06% |           7.87 |                      |
| lifecycle/scaleDown/remove.random      |     2766.23 |      81.53 |     2690.40 |     192.86 |  -2.74% |        -2.34% |           6.51 |                      |
| lifecycle/scaleDown/remove.tail        |     1800.66 |     790.58 |     1712.42 |     118.40 |  -4.90% |        -1.38% |          35.00 |                      |
| lifecycle/scaleDown/replace.head       |     2669.46 |     192.15 |     2878.94 |     268.53 |   7.85% |         0.88% |          18.67 |                      |
| lifecycle/scaleDown/replace.random     |     3431.56 |     375.28 |     3394.26 |     528.35 |  -1.09% |        -0.33% |           5.31 |                      |
| lifecycle/scaleDown/replace.tail       |    20034.94 |    1503.33 |    20953.54 |    2236.27 |   4.58% |         2.79% |           5.38 |                      |
| lifecycle/scaleDown/value.head         |      429.06 |      18.13 |      421.51 |      22.77 |  -1.76% |        -1.81% |           2.47 |                      |
| lifecycle/scaleDown/value.random       |     1070.29 |      25.42 |     1101.25 |      52.97 |   2.89% |         3.45% |           4.49 |                      |
| lifecycle/scaleDown/value.tail         |      236.74 |       4.40 |      234.82 |       3.16 |  -0.81% |        -0.81% |           1.81 |                      |
| lifecycle/fullLifecycle/apply.random   |     3691.29 |      94.94 |     3746.69 |     296.21 |   1.50% |        -3.13% |           6.82 |                      |
| lifecycle/fullLifecycle/insert.head    |      906.11 |      86.56 |      830.43 |      46.06 |  -8.35% |        -7.56% |           1.56 |                      |
| lifecycle/fullLifecycle/insert.random  |     1835.52 |     210.82 |     1768.12 |      60.52 |  -3.67% |        -5.52% |           6.29 |                      |
| lifecycle/fullLifecycle/insert.tail    |      834.49 |     104.80 |      780.22 |      80.59 |  -6.50% |        -6.50% |           1.54 |                      |
| lifecycle/fullLifecycle/remove.head    |     1958.13 |      48.69 |     1991.20 |      93.02 |   1.69% |         0.06% |           7.87 |                      |
| lifecycle/fullLifecycle/remove.random  |     2790.10 |      83.07 |     2766.55 |     221.85 |  -0.84% |        -4.02% |           5.50 |                      |
| lifecycle/fullLifecycle/remove.tail    |     1800.66 |     790.58 |     1712.42 |     118.40 |  -4.90% |        -1.38% |          35.00 |                      |
| lifecycle/fullLifecycle/replace.head   |     2750.61 |     271.07 |     2729.89 |     355.44 |  -0.75% |        -0.75% |           8.66 |                      |
| lifecycle/fullLifecycle/replace.random |     3526.12 |     362.51 |     3563.41 |     329.17 |   1.06% |        -1.24% |           3.25 |                      |
| lifecycle/fullLifecycle/replace.tail   |    11222.59 |     656.49 |    11857.54 |     830.56 |   5.66% |         2.38% |           4.73 |                      |
| lifecycle/fullLifecycle/value.head     |      374.69 |       9.68 |      373.53 |      33.74 |  -0.31% |        -0.31% |           7.58 |                      |
| lifecycle/fullLifecycle/value.random   |     1109.20 |      27.26 |     1151.99 |      60.22 |   3.86% |         2.66% |           6.27 |                      |
| lifecycle/fullLifecycle/value.tail     |      198.90 |       3.47 |      194.55 |       4.99 |  -2.18% |        -0.12% |           2.84 |                      |
| checkpoint/up/1000/create              |   304800.00 |  197200.00 |   495300.00 |  254500.00 |  62.50% |         2.59% |         110.16 |                      |
| checkpoint/up/1000/sequence            |  2642800.00 |  151100.00 |  2468200.00 |   84900.00 |  -6.61% |        -6.97% |           5.78 |                      |
| checkpoint/up/1000/values              |  1624700.00 |  160800.00 |  1618400.00 |  106500.00 |  -0.39% |        -0.39% |          11.42 |                      |
| checkpoint/up/5000/create              |   996200.00 |  319700.00 |   953300.00 |  147600.00 |  -4.31% |        -8.01% |          14.56 |                      |
| checkpoint/up/5000/sequence            |  9803400.00 | 1097800.00 | 10026100.00 |  980300.00 |   2.27% |         2.77% |           0.70 |                      |
| checkpoint/up/5000/values              |  4729400.00 |  212800.00 |  5721700.00 | 1855600.00 |  20.98% |         5.20% |          33.10 | yes                  |
| checkpoint/up/10000/create             |  1539200.00 |  208400.00 |  1493600.00 |   82000.00 |  -2.96% |        -1.15% |           5.62 |                      |
| checkpoint/up/10000/sequence           | 16064100.00 | 2068400.00 | 15859300.00 |  774100.00 |  -1.27% |         9.79% |           7.59 |                      |
| checkpoint/up/10000/values             | 21358800.00 | 1033300.00 | 21607200.00 |  555300.00 |   1.16% |         1.10% |           2.59 |                      |
| checkpoint/up/15000/create             |  2403000.00 |   88300.00 |  2341500.00 |  319600.00 |  -2.56% |        -0.41% |          10.33 |                      |
| checkpoint/up/15000/sequence           | 18335500.00 | 1065300.00 | 18071200.00 |  205700.00 |  -1.44% |         0.83% |           8.01 |                      |
| checkpoint/up/15000/values             | 31661500.00 |  988300.00 | 31055300.00 | 1762200.00 |  -1.91% |         2.25% |           6.74 |                      |
| checkpoint/up/20000/create             |  3336700.00 |  120000.00 |  3285900.00 |  101100.00 |  -1.52% |         0.44% |           1.76 |                      |
| checkpoint/up/20000/sequence           | 24189700.00 |  811300.00 | 25968100.00 | 1575300.00 |   7.35% |        10.20% |          12.08 | yes                  |
| checkpoint/up/20000/values             | 13471700.00 |  400000.00 | 13730400.00 | 1730400.00 |   1.92% |         5.39% |          15.82 |                      |
| checkpoint/up/25000/create             |  4022300.00 |  136300.00 |  4114100.00 |  183300.00 |   2.28% |         2.28% |           1.22 |                      |
| checkpoint/up/25000/sequence           | 28198900.00 |  928500.00 | 29311300.00 | 1599800.00 |   3.94% |        -0.15% |           9.35 |                      |
| checkpoint/up/25000/values             | 14268900.00 | 1236500.00 | 13687700.00 |  177200.00 |  -4.07% |        -2.86% |           3.25 |                      |
| checkpoint/down/20000/create           |  3396100.00 |   35000.00 |  3410800.00 |  131800.00 |   0.43% |         2.23% |           3.60 |                      |
| checkpoint/down/20000/sequence         | 22698500.00 | 2146600.00 | 22648300.00 |  912300.00 |  -0.22% |         3.76% |          12.89 |                      |
| checkpoint/down/20000/values           | 10790100.00 |  387400.00 | 10876600.00 |  808700.00 |   0.80% |        -4.19% |          11.30 |                      |
| checkpoint/down/15000/create           |  2414500.00 |   15600.00 |  2471300.00 |  107600.00 |   2.35% |         3.57% |           5.52 |                      |
| checkpoint/down/15000/sequence         | 18670400.00 |  846400.00 | 21021400.00 | 1987800.00 |  12.59% |        10.80% |           3.90 |                      |
| checkpoint/down/15000/values           |  9173600.00 | 1416000.00 |  8906800.00 | 1030900.00 |  -2.91% |        -1.10% |           5.80 |                      |
| checkpoint/down/10000/create           |  1696900.00 |   33100.00 |  1592100.00 |   38400.00 |  -6.18% |        -7.66% |           4.52 |                      |
| checkpoint/down/10000/sequence         | 15761700.00 |  655200.00 | 16519300.00 | 2585300.00 |   4.81% |         4.81% |           2.98 |                      |
| checkpoint/down/10000/values           |  6045000.00 |  596600.00 |  7307800.00 | 1115900.00 |  20.89% |        26.77% |          35.87 |                      |
| checkpoint/down/5000/create            |   779600.00 |   12000.00 |   807100.00 |   34700.00 |   3.53% |         1.69% |           2.93 |                      |
| checkpoint/down/5000/sequence          | 12226600.00 |   27700.00 | 12874700.00 | 1915400.00 |   5.30% |         5.30% |          10.86 |                      |
| checkpoint/down/5000/values            |  2950100.00 |  630000.00 |  3530600.00 |  133000.00 |  19.68% |        14.84% |          27.24 |                      |
| checkpoint/down/1000/create            |   180800.00 |  285800.00 |   154400.00 |   13900.00 | -14.60% |        -1.40% |          69.98 |                      |
| checkpoint/down/1000/sequence          |  7671900.00 |  741800.00 |  7913900.00 | 1431900.00 |   3.15% |        -2.53% |          12.41 |                      |
| checkpoint/down/1000/values            |   624600.00 |   16100.00 |   624200.00 |   79300.00 |  -0.06% |        -0.64% |          12.35 |                      |
| checkpoint/down/0/create               |    16500.00 |    7600.00 |    16200.00 |   10800.00 |  -1.82% |       -17.43% |          26.91 |                      |
| checkpoint/down/0/sequence             |  1701100.00 |  421700.00 |  1683300.00 |  489300.00 |  -1.05% |        19.36% |          55.45 |                      |
| checkpoint/down/0/values               |    12500.00 |    6300.00 |    13700.00 |    5300.00 |   9.60% |         6.80% |          38.81 |                      |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |      Before |       After | Change |
| :-------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                   |   487888.00 |   480392.00 | -1.54% |
| memory/up/1000/js                       |   407560.00 |   407560.00 |  0.00% |
| storage/up/1000/jsonBytes               |   278238.00 |   278238.00 |  0.00% |
| storage/up/1000/jsonGzipBytes           |    14908.00 |    14908.00 |  0.00% |
| storage/up/1000/messagePackBytes        |   165784.00 |   165784.00 |  0.00% |
| storage/up/1000/messagePackGzipBytes    |    12641.00 |    12641.00 |  0.00% |
| memory/up/5000/native                   |  2194520.00 |  2156552.00 | -1.73% |
| memory/up/5000/js                       |  2059744.00 |  2059744.00 |  0.00% |
| storage/up/5000/jsonBytes               |  1662776.00 |  1662776.00 |  0.00% |
| storage/up/5000/jsonGzipBytes           |    75146.00 |    75146.00 |  0.00% |
| storage/up/5000/messagePackBytes        |   839612.00 |   839612.00 |  0.00% |
| storage/up/5000/messagePackGzipBytes    |    63127.00 |    63127.00 |  0.00% |
| memory/up/10000/native                  |  3643184.00 |  3567264.00 | -2.08% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  4935512.00 |  4819592.00 | -2.35% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6469536.00 |  6317720.00 | -2.35% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  7733416.00 |  7541600.00 | -2.48% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  6749048.00 |  6597240.00 | -2.25% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  5863296.00 |  5747360.00 | -1.98% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  4796968.00 |  4721040.00 | -1.58% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3815480.00 |  3777504.00 | -1.00% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2726944.00 |  2719432.00 | -0.28% |
| memory/down/1000/js                     |   413360.00 |   413360.00 |  0.00% |
| storage/down/1000/jsonBytes             |   386836.00 |   386836.00 |  0.00% |
| storage/down/1000/jsonGzipBytes         |    16336.00 |    16336.00 |  0.00% |
| storage/down/1000/messagePackBytes      |   271220.00 |   271220.00 |  0.00% |
| storage/down/1000/messagePackGzipBytes  |    13932.00 |    13932.00 |  0.00% |
| memory/down/0/native                    |  1598056.00 |  1598048.00 | -0.00% |
| memory/down/0/js                        |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonBytes                |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonGzipBytes            |       32.00 |       32.00 |  0.00% |
| storage/down/0/messagePackBytes         |        8.00 |        8.00 |  0.00% |
| storage/down/0/messagePackGzipBytes     |       28.00 |       28.00 |  0.00% |
