# range-before-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: range-before. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/range-before-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    12615.39 |     242.85 |     3698.84 |     201.98 | -70.68% |       -70.68% |           0.68 |                      |
| lifecycle/scaleUp/insert.head          |      793.42 |      86.71 |      830.46 |      94.64 |   4.67% |         4.01% |           7.07 |                      |
| lifecycle/scaleUp/insert.random        |     6279.67 |     215.28 |     1701.24 |      62.02 | -72.91% |       -72.92% |           0.18 |                      |
| lifecycle/scaleUp/insert.tail          |      840.26 |     185.70 |      740.96 |      94.37 | -11.82% |        -8.09% |           3.76 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11068.50 |      33.77 |     2660.76 |      24.55 | -75.96% |       -76.03% |           0.33 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2617.15 |     183.87 |     2381.18 |      60.36 |  -9.02% |        -6.53% |           5.64 |                      |
| lifecycle/scaleUp/replace.random       |    11852.44 |     311.38 |     3673.38 |     254.04 | -69.01% |       -69.52% |           3.78 |                      |
| lifecycle/scaleUp/replace.tail         |     2296.44 |     182.76 |     2240.31 |     107.47 |  -2.44% |        -1.90% |           1.45 |                      |
| lifecycle/scaleUp/value.head           |      355.48 |       4.54 |      304.05 |      22.40 | -14.47% |       -14.47% |           7.66 |                      |
| lifecycle/scaleUp/value.random         |     9345.88 |     201.39 |     1134.44 |      16.92 | -87.86% |       -87.86% |           0.41 |                      |
| lifecycle/scaleUp/value.tail           |      233.70 |       5.11 |      153.36 |       6.56 | -34.38% |       -34.56% |           4.39 |                      |
| lifecycle/scaleDown/apply.random       |    11408.37 |     427.03 |     3996.19 |     165.07 | -64.97% |       -65.14% |           1.81 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     4025.42 |     206.90 |     1709.74 |     164.27 | -57.53% |       -54.87% |           6.54 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1998.14 |     169.47 |     1892.38 |     135.83 |  -5.29% |        -0.69% |           9.35 |                      |
| lifecycle/scaleDown/remove.random      |     5799.23 |     182.21 |     2699.20 |     246.25 | -53.46% |       -53.44% |           4.17 |                      |
| lifecycle/scaleDown/remove.tail        |     2138.25 |      47.50 |     1736.55 |     155.78 | -18.79% |       -17.27% |           6.35 |                      |
| lifecycle/scaleDown/replace.head       |     2593.24 |     419.40 |     2788.24 |     385.45 |   7.52% |        -0.87% |          22.29 |                      |
| lifecycle/scaleDown/replace.random     |     6132.32 |     101.97 |     3910.83 |     844.80 | -36.23% |       -36.69% |           8.47 |                      |
| lifecycle/scaleDown/replace.tail       |    40770.54 |    1020.28 |    19341.00 |    3190.54 | -52.56% |       -52.79% |           9.24 |                      |
| lifecycle/scaleDown/value.head         |      487.30 |       6.04 |      424.84 |      36.20 | -12.82% |       -14.44% |           6.34 |                      |
| lifecycle/scaleDown/value.random       |     3671.04 |      89.29 |     1116.89 |     123.93 | -69.58% |       -69.56% |           3.30 |                      |
| lifecycle/scaleDown/value.tail         |      282.39 |       3.73 |      235.00 |       6.54 | -16.78% |       -16.44% |           1.42 |                      |
| lifecycle/fullLifecycle/apply.random   |    11904.62 |     285.41 |     3878.75 |     169.93 | -67.42% |       -68.00% |           1.10 |                      |
| lifecycle/fullLifecycle/insert.head    |      793.42 |      86.71 |      830.46 |      94.64 |   4.67% |         4.01% |           7.07 |                      |
| lifecycle/fullLifecycle/insert.random  |     5148.27 |      39.21 |     1758.58 |      53.03 | -65.84% |       -66.24% |           2.56 |                      |
| lifecycle/fullLifecycle/insert.tail    |      840.26 |     185.70 |      740.96 |      94.37 | -11.82% |        -8.09% |           3.76 |                      |
| lifecycle/fullLifecycle/remove.head    |     1998.14 |     169.47 |     1892.38 |     135.83 |  -5.29% |        -0.69% |           9.35 |                      |
| lifecycle/fullLifecycle/remove.random  |     8432.57 |     363.33 |     2679.76 |     159.83 | -68.22% |       -68.24% |           2.59 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2138.25 |      47.50 |     1736.55 |     155.78 | -18.79% |       -17.27% |           6.35 |                      |
| lifecycle/fullLifecycle/replace.head   |     2670.41 |     236.43 |     2676.19 |     151.75 |   0.22% |        -8.12% |          13.18 |                      |
| lifecycle/fullLifecycle/replace.random |     8966.86 |     179.90 |     3784.77 |     193.69 | -57.79% |       -58.26% |           1.61 |                      |
| lifecycle/fullLifecycle/replace.tail   |    21602.14 |     572.64 |    10837.52 |    1587.79 | -49.83% |       -49.83% |           8.99 |                      |
| lifecycle/fullLifecycle/value.head     |      420.02 |       5.29 |      357.96 |      30.82 | -14.78% |       -14.58% |           8.02 |                      |
| lifecycle/fullLifecycle/value.random   |     6496.65 |      94.62 |     1132.24 |      63.10 | -82.57% |       -82.87% |           1.32 |                      |
| lifecycle/fullLifecycle/value.tail     |      257.67 |       2.99 |      193.37 |       3.74 | -24.95% |       -24.57% |           0.80 |                      |
| checkpoint/up/1000/create              |   293300.00 |   12900.00 |   262300.00 |  186600.00 | -10.57% |        -6.25% |          63.68 |                      |
| checkpoint/up/1000/sequence            |  2450800.00 |   86600.00 |  2628400.00 |  206400.00 |   7.25% |         4.68% |          14.87 |                      |
| checkpoint/up/1000/values              |  1601700.00 |   68600.00 |  1783200.00 |  174100.00 |  11.33% |         3.80% |          12.64 |                      |
| checkpoint/up/5000/create              |  1126800.00 |  238600.00 |   890200.00 |   84800.00 | -21.00% |       -19.52% |          10.48 |                      |
| checkpoint/up/5000/sequence            | 10212300.00 | 1205700.00 |  8986600.00 | 1099700.00 | -12.00% |        -6.73% |          26.81 |                      |
| checkpoint/up/5000/values              |  5416900.00 |  671900.00 |  5421300.00 |  241100.00 |   0.08% |         0.08% |          23.90 |                      |
| checkpoint/up/10000/create             |  1485900.00 |   35900.00 |  1615800.00 |  143500.00 |   8.74% |         2.99% |           9.70 |                      |
| checkpoint/up/10000/sequence           | 15185200.00 |  563400.00 | 15455200.00 |  186200.00 |   1.78% |         2.29% |          10.68 |                      |
| checkpoint/up/10000/values             | 20864600.00 |  438000.00 | 20970400.00 |  414600.00 |   0.51% |        -0.84% |           1.58 |                      |
| checkpoint/up/15000/create             |  2500100.00 |  218400.00 |  2321900.00 |   14200.00 |  -7.13% |        -7.49% |           9.02 |                      |
| checkpoint/up/15000/sequence           | 17122300.00 |  211600.00 | 17025800.00 |  171900.00 |  -0.56% |        -0.56% |           4.14 |                      |
| checkpoint/up/15000/values             | 31172000.00 |  329900.00 | 30157200.00 | 1136200.00 |  -3.26% |        -3.63% |           4.49 |                      |
| checkpoint/up/20000/create             |  3394400.00 |   84500.00 |  3391300.00 |   73700.00 |  -0.09% |        -0.64% |           1.60 |                      |
| checkpoint/up/20000/sequence           | 24007100.00 | 8986900.00 | 25757500.00 | 2064400.00 |   7.29% |         0.54% |          27.95 |                      |
| checkpoint/up/20000/values             | 13364200.00 | 1512100.00 | 11070900.00 |  463400.00 | -17.16% |       -15.54% |          11.78 |                      |
| checkpoint/up/25000/create             |  4021700.00 |  155100.00 |  3861400.00 |   22400.00 |  -3.99% |        -3.60% |           3.68 |                      |
| checkpoint/up/25000/sequence           | 27627800.00 | 1519500.00 | 27407300.00 | 1220300.00 |  -0.80% |        -1.64% |           5.75 |                      |
| checkpoint/up/25000/values             | 13388200.00 |   83900.00 | 12584700.00 | 1013800.00 |  -6.00% |        -6.12% |          12.98 |                      |
| checkpoint/down/20000/create           |  3481300.00 |  103000.00 |  3386100.00 |  288400.00 |  -2.73% |         0.50% |          10.07 |                      |
| checkpoint/down/20000/sequence         | 22845300.00 |  397500.00 | 24202300.00 | 3257500.00 |   5.94% |         8.21% |          13.49 | yes                  |
| checkpoint/down/20000/values           | 11382500.00 |  845000.00 |  9905400.00 |  671500.00 | -12.98% |        -8.28% |           7.87 |                      |
| checkpoint/down/15000/create           |  2462900.00 |  121900.00 |  2505000.00 |  110200.00 |   1.71% |         4.07% |          12.90 |                      |
| checkpoint/down/15000/sequence         | 18747300.00 |  473300.00 | 21850300.00 | 6763900.00 |  16.55% |         7.13% |          31.00 |                      |
| checkpoint/down/15000/values           |  8333900.00 |  345300.00 |  9261100.00 | 2728500.00 |  11.13% |         0.09% |          33.94 |                      |
| checkpoint/down/10000/create           |  1702200.00 |   56700.00 |  1627500.00 |   24200.00 |  -4.39% |        -5.49% |           3.75 |                      |
| checkpoint/down/10000/sequence         | 17690800.00 | 2567500.00 | 15847600.00 |  967600.00 | -10.42% |        -8.31% |           3.22 |                      |
| checkpoint/down/10000/values           |  6034500.00 |  674500.00 |  5320800.00 |  510500.00 | -11.83% |       -11.83% |          23.93 |                      |
| checkpoint/down/5000/create            |   793700.00 |   45800.00 |   790500.00 |   22100.00 |  -0.40% |         4.61% |           8.08 |                      |
| checkpoint/down/5000/sequence          | 13298500.00 | 1167700.00 | 13361500.00 | 3846700.00 |   0.47% |         9.65% |          12.76 |                      |
| checkpoint/down/5000/values            |  3621300.00 | 1193500.00 |  2734800.00 |  421700.00 | -24.48% |       -13.72% |           4.93 |                      |
| checkpoint/down/1000/create            |   190600.00 |  109900.00 |   157100.00 |   27000.00 | -17.58% |        -8.98% |          55.63 |                      |
| checkpoint/down/1000/sequence          |  8470800.00 | 2182800.00 |  8500100.00 | 2545400.00 |   0.35% |         3.14% |           9.77 |                      |
| checkpoint/down/1000/values            |   664600.00 |  122000.00 |   545900.00 |   72200.00 | -17.86% |       -21.49% |          14.52 |                      |
| checkpoint/down/0/create               |    13900.00 |    2500.00 |    15200.00 |    2800.00 |   9.35% |         9.52% |          27.04 |                      |
| checkpoint/down/0/sequence             |  1582000.00 |  569900.00 |  1490800.00 |   89600.00 |  -5.76% |        -9.90% |          19.49 |                      |
| checkpoint/down/0/values               |    11900.00 |    2100.00 |    10100.00 |     300.00 | -15.13% |       -19.33% |          12.20 |                      |

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
| memory/up/10000/native                  |  3862440.00 |  3567240.00 | -7.64% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  5274768.00 |  4819568.00 | -8.63% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6908040.00 |  6317696.00 | -8.55% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  8291920.00 |  7541576.00 | -9.05% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  7187552.00 |  6597208.00 | -8.21% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  6202528.00 |  5747344.00 | -7.34% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  5016200.00 |  4721016.00 | -5.88% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3925088.00 |  3777480.00 | -3.76% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2748336.00 |  2719408.00 | -1.05% |
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
