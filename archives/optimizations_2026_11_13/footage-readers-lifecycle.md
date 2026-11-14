# footage-readers-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: footage-readers. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/footage-readers-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    12663.60 |      71.36 |     3780.64 |      49.72 | -70.15% |       -70.44% |           0.44 |                      |
| lifecycle/scaleUp/insert.head          |      841.14 |      16.86 |      798.73 |      73.53 |  -5.04% |         3.11% |           9.02 |                      |
| lifecycle/scaleUp/insert.random        |     6339.48 |      89.96 |     1802.64 |      75.89 | -71.56% |       -71.56% |           1.49 |                      |
| lifecycle/scaleUp/insert.tail          |      809.22 |      83.38 |      779.51 |     128.43 |  -3.67% |        -3.67% |           6.75 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    10989.96 |      30.62 |     2793.80 |     409.54 | -74.58% |       -74.29% |           3.80 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2609.89 |     154.16 |     2557.29 |     103.44 |  -2.02% |        -1.39% |           0.89 |                      |
| lifecycle/scaleUp/replace.random       |    11951.96 |     462.12 |     3795.52 |     130.14 | -68.24% |       -68.99% |           2.32 |                      |
| lifecycle/scaleUp/replace.tail         |     2346.55 |      97.43 |     2360.93 |      54.96 |   0.61% |         1.50% |           5.70 |                      |
| lifecycle/scaleUp/value.head           |      358.70 |      16.76 |      333.87 |      22.44 |  -6.92% |       -10.02% |           3.54 |                      |
| lifecycle/scaleUp/value.random         |     9375.58 |     192.61 |     1172.70 |      36.12 | -87.49% |       -87.38% |           1.27 |                      |
| lifecycle/scaleUp/value.tail           |      234.34 |       3.53 |      158.78 |       8.52 | -32.25% |       -35.04% |           3.94 |                      |
| lifecycle/scaleDown/apply.random       |    11588.86 |     793.06 |     3786.04 |     305.20 | -67.33% |       -67.27% |           1.65 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3803.32 |     231.85 |     1736.47 |     163.87 | -54.34% |       -53.91% |           1.70 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     2033.14 |     286.58 |     2013.04 |     180.03 |  -0.99% |        -4.08% |           9.99 |                      |
| lifecycle/scaleDown/remove.random      |     6297.29 |     652.10 |     2741.79 |     261.81 | -56.46% |       -52.65% |           0.79 |                      |
| lifecycle/scaleDown/remove.tail        |     2111.01 |     291.63 |     1859.91 |     154.34 | -11.89% |       -15.91% |           1.74 |                      |
| lifecycle/scaleDown/replace.head       |     2604.15 |     526.57 |     2709.07 |     263.48 |   4.03% |         2.09% |          15.87 |                      |
| lifecycle/scaleDown/replace.random     |     6378.61 |     202.62 |     3546.84 |     200.55 | -44.39% |       -44.39% |           6.70 |                      |
| lifecycle/scaleDown/replace.tail       |    40279.35 |     788.25 |    19784.13 |    1074.17 | -50.88% |       -50.36% |           0.90 |                      |
| lifecycle/scaleDown/value.head         |      503.44 |      45.31 |      454.47 |      25.21 |  -9.73% |        -7.86% |           5.56 |                      |
| lifecycle/scaleDown/value.random       |     3726.26 |     301.44 |     1105.76 |     132.63 | -70.33% |       -69.70% |           1.46 |                      |
| lifecycle/scaleDown/value.tail         |      282.22 |       5.81 |      243.11 |      10.41 | -13.86% |       -11.90% |           6.47 |                      |
| lifecycle/fullLifecycle/apply.random   |    12109.48 |     995.69 |     3787.02 |     173.78 | -68.73% |       -68.73% |           0.58 |                      |
| lifecycle/fullLifecycle/insert.head    |      841.14 |      16.86 |      798.73 |      73.53 |  -5.04% |         3.11% |           9.02 |                      |
| lifecycle/fullLifecycle/insert.random  |     5096.14 |     317.75 |     1769.55 |     135.89 | -65.28% |       -65.21% |           0.61 |                      |
| lifecycle/fullLifecycle/insert.tail    |      809.22 |      83.38 |      779.51 |     128.43 |  -3.67% |        -3.67% |           6.75 |                      |
| lifecycle/fullLifecycle/remove.head    |     2033.14 |     286.58 |     2013.04 |     180.03 |  -0.99% |        -4.08% |           9.99 |                      |
| lifecycle/fullLifecycle/remove.random  |     8643.63 |     606.04 |     2846.13 |     171.50 | -67.07% |       -66.69% |           4.31 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2111.01 |     291.63 |     1859.91 |     154.34 | -11.89% |       -15.91% |           1.74 |                      |
| lifecycle/fullLifecycle/replace.head   |     2559.05 |     336.21 |     2667.17 |     107.87 |   4.23% |         1.44% |           7.79 |                      |
| lifecycle/fullLifecycle/replace.random |     9312.21 |     405.86 |     3748.11 |     110.18 | -59.75% |       -59.92% |           1.22 |                      |
| lifecycle/fullLifecycle/replace.tail   |    21356.22 |     353.26 |    11068.35 |     519.81 | -48.17% |       -47.37% |           1.76 |                      |
| lifecycle/fullLifecycle/value.head     |      430.93 |      27.55 |      390.37 |      13.68 |  -9.41% |        -8.76% |           7.85 |                      |
| lifecycle/fullLifecycle/value.random   |     6550.92 |     388.04 |     1135.18 |      59.96 | -82.67% |       -82.45% |           0.47 |                      |
| lifecycle/fullLifecycle/value.tail     |      259.22 |       7.72 |      199.60 |       7.82 | -23.00% |       -21.91% |           4.28 |                      |
| checkpoint/up/1000/create              |   300800.00 |    8800.00 |   336100.00 |  191800.00 |  11.74% |        -0.28% |          18.77 |                      |
| checkpoint/up/1000/sequence            |  2511000.00 |  162500.00 |  3087800.00 |  431600.00 |  22.97% |        24.47% |          21.38 |                      |
| checkpoint/up/1000/values              |  1680500.00 |  120300.00 |  1576600.00 |   33500.00 |  -6.18% |        -8.87% |           3.34 |                      |
| checkpoint/up/5000/create              |  1008500.00 |  563600.00 |   858100.00 |   43300.00 | -14.91% |       -18.56% |          26.66 |                      |
| checkpoint/up/5000/sequence            |  9656300.00 | 1359800.00 |  9684400.00 |  752300.00 |   0.29% |        -2.19% |          11.83 |                      |
| checkpoint/up/5000/values              |  4859200.00 | 1014900.00 |  4866500.00 |  471900.00 |   0.15% |        -7.96% |          15.59 |                      |
| checkpoint/up/10000/create             |  1643500.00 |  876400.00 |  1542000.00 |  190900.00 |  -6.18% |         1.30% |          33.24 |                      |
| checkpoint/up/10000/sequence           | 15696700.00 | 3008000.00 | 14925200.00 | 3102200.00 |  -4.92% |        -3.63% |           6.36 |                      |
| checkpoint/up/10000/values             | 20964300.00 | 1950400.00 |  8722400.00 |  969500.00 | -58.39% |       -55.64% |           2.56 |                      |
| checkpoint/up/15000/create             |  2575700.00 |  336000.00 |  2410900.00 |  186300.00 |  -6.40% |        -4.15% |           4.36 |                      |
| checkpoint/up/15000/sequence           | 24363800.00 | 6479800.00 | 17165100.00 | 2641400.00 | -29.55% |       -20.45% |          23.30 |                      |
| checkpoint/up/15000/values             | 31946200.00 |  819100.00 | 10896900.00 |  758600.00 | -65.89% |       -65.13% |           2.50 |                      |
| checkpoint/up/20000/create             |  3905300.00 |  379800.00 |  3335400.00 |  111000.00 | -14.59% |       -14.07% |           6.49 |                      |
| checkpoint/up/20000/sequence           | 25197700.00 | 1634100.00 | 24560100.00 | 1176100.00 |  -2.53% |        -3.97% |          10.99 |                      |
| checkpoint/up/20000/values             | 13218100.00 |  417300.00 | 13472100.00 |  728700.00 |   1.92% |         0.48% |          10.88 |                      |
| checkpoint/up/25000/create             |  4073500.00 |  200100.00 |  4162600.00 |  232000.00 |   2.19% |        -1.47% |           3.96 |                      |
| checkpoint/up/25000/sequence           | 27988000.00 | 1203500.00 | 27716500.00 |  837400.00 |  -0.97% |         1.94% |           6.38 |                      |
| checkpoint/up/25000/values             | 13697800.00 |  519800.00 | 15660300.00 |  655200.00 |  14.33% |        12.36% |           4.64 | yes                  |
| checkpoint/down/20000/create           |  3377700.00 |   85200.00 |  3511000.00 |  216400.00 |   3.95% |        -1.07% |          10.73 |                      |
| checkpoint/down/20000/sequence         | 22610500.00 |  199600.00 | 23240400.00 | 8432500.00 |   2.79% |         3.14% |          41.39 |                      |
| checkpoint/down/20000/values           | 10930700.00 |  678700.00 | 12715700.00 |  874800.00 |  16.33% |        18.47% |          20.72 | yes                  |
| checkpoint/down/15000/create           |  2400900.00 |   92500.00 |  2406000.00 |   56300.00 |   0.21% |        -1.86% |           5.67 |                      |
| checkpoint/down/15000/sequence         | 18156900.00 |  734200.00 | 19860500.00 | 2918000.00 |   9.38% |         3.25% |          16.16 |                      |
| checkpoint/down/15000/values           |  8672300.00 |  968400.00 | 11096400.00 | 1251400.00 |  27.95% |        18.81% |          10.73 |                      |
| checkpoint/down/10000/create           |  1640500.00 |   35600.00 |  1649500.00 |   19200.00 |   0.55% |        -1.39% |           6.40 |                      |
| checkpoint/down/10000/sequence         | 15507200.00 | 1709600.00 | 16111200.00 | 2783000.00 |   3.89% |        -3.24% |          33.85 |                      |
| checkpoint/down/10000/values           |  6698700.00 |  134200.00 |  7492800.00 | 1290400.00 |  11.85% |        24.35% |          12.92 | yes                  |
| checkpoint/down/5000/create            |   800700.00 |   65300.00 |   799100.00 |  125000.00 |  -0.20% |        -0.20% |          29.03 |                      |
| checkpoint/down/5000/sequence          | 11445000.00 |  304900.00 | 13038100.00 | 2759300.00 |  13.92% |        11.80% |          19.15 | yes                  |
| checkpoint/down/5000/values            |  3811100.00 | 1078400.00 |  5578800.00 | 1688800.00 |  46.38% |        41.13% |          36.80 | yes                  |
| checkpoint/down/1000/create            |   160300.00 |   53700.00 |   148100.00 |    1800.00 |  -7.61% |        -7.17% |          28.09 |                      |
| checkpoint/down/1000/sequence          |  7537100.00 |  536200.00 |  8702600.00 | 2298600.00 |  15.46% |         6.99% |           6.72 | yes                  |
| checkpoint/down/1000/values            |   691100.00 |  112900.00 |  1405700.00 |  745100.00 | 103.40% |       107.18% |          55.92 | yes                  |
| checkpoint/down/0/create               |    13500.00 |    3900.00 |    15400.00 |    3700.00 |  14.07% |         2.96% |          50.85 |                      |
| checkpoint/down/0/sequence             |  1495600.00 |  445000.00 |  1669300.00 |  277300.00 |  11.61% |         1.60% |          43.31 |                      |
| checkpoint/down/0/values               |    10100.00 |    3500.00 |    10100.00 |    2100.00 |   0.00% |         7.53% |          49.03 |                      |

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
