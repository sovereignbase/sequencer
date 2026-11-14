# footage-readers-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: directory-lazy; candidate: footage-readers. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/footage-readers-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |     3724.48 |     135.90 |     3780.64 |      49.72 |   1.51% |         0.82% |           7.92 |                      |
| lifecycle/scaleUp/insert.head          |      854.29 |      74.38 |      798.73 |      73.53 |  -6.50% |        -1.71% |          10.57 |                      |
| lifecycle/scaleUp/insert.random        |     1734.34 |      67.14 |     1802.64 |      75.89 |   3.94% |         1.14% |           2.92 |                      |
| lifecycle/scaleUp/insert.tail          |      744.18 |      71.59 |      779.51 |     128.43 |   4.75% |         0.14% |           5.82 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |     2756.58 |     215.66 |     2793.80 |     409.54 |   1.35% |         2.55% |          11.23 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2506.24 |     107.47 |     2557.29 |     103.44 |   2.04% |        -0.48% |           7.24 |                      |
| lifecycle/scaleUp/replace.random       |     3723.50 |     321.78 |     3795.52 |     130.14 |   1.93% |         2.73% |           4.78 |                      |
| lifecycle/scaleUp/replace.tail         |     2403.64 |     169.27 |     2360.93 |      54.96 |  -1.78% |         0.11% |           1.44 |                      |
| lifecycle/scaleUp/value.head           |      313.40 |       4.95 |      333.87 |      22.44 |   6.53% |         7.28% |          10.33 |                      |
| lifecycle/scaleUp/value.random         |     1142.89 |      24.38 |     1172.70 |      36.12 |   2.61% |         2.54% |           4.25 |                      |
| lifecycle/scaleUp/value.tail           |      154.16 |       8.29 |      158.78 |       8.52 |   2.99% |         3.14% |           3.38 |                      |
| lifecycle/scaleDown/apply.random       |     3451.57 |     546.03 |     3786.04 |     305.20 |   9.69% |        -0.06% |           6.26 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     1750.79 |     209.67 |     1736.47 |     163.87 |  -0.82% |        -4.13% |          12.11 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1935.81 |     692.07 |     2013.04 |     180.03 |   3.99% |        -1.28% |          15.37 |                      |
| lifecycle/scaleDown/remove.random      |     2698.51 |      25.88 |     2741.79 |     261.81 |   1.60% |        -0.21% |           6.09 |                      |
| lifecycle/scaleDown/remove.tail        |     1729.33 |      92.86 |     1859.91 |     154.34 |   7.55% |         1.16% |          11.08 |                      |
| lifecycle/scaleDown/replace.head       |     2616.01 |     236.92 |     2709.07 |     263.48 |   3.56% |         0.55% |           2.59 |                      |
| lifecycle/scaleDown/replace.random     |     3691.34 |     244.31 |     3546.84 |     200.55 |  -3.91% |        -7.61% |           3.16 |                      |
| lifecycle/scaleDown/replace.tail       |    19583.24 |    2795.49 |    19784.13 |    1074.17 |   1.03% |        -1.15% |          13.34 |                      |
| lifecycle/scaleDown/value.head         |      421.59 |      46.72 |      454.47 |      25.21 |   7.80% |         5.00% |           9.71 |                      |
| lifecycle/scaleDown/value.random       |     1093.24 |     158.34 |     1105.76 |     132.63 |   1.14% |        -0.43% |           5.53 |                      |
| lifecycle/scaleDown/value.tail         |      235.02 |      11.53 |      243.11 |      10.41 |   3.44% |         0.66% |           3.41 |                      |
| lifecycle/fullLifecycle/apply.random   |     3608.86 |     293.44 |     3787.02 |     173.78 |   4.94% |        -1.09% |           3.18 |                      |
| lifecycle/fullLifecycle/insert.head    |      854.29 |      74.38 |      798.73 |      73.53 |  -6.50% |        -1.71% |          10.57 |                      |
| lifecycle/fullLifecycle/insert.random  |     1750.51 |      84.04 |     1769.55 |     135.89 |   1.09% |        -0.21% |           7.08 |                      |
| lifecycle/fullLifecycle/insert.tail    |      744.18 |      71.59 |      779.51 |     128.43 |   4.75% |         0.14% |           5.82 |                      |
| lifecycle/fullLifecycle/remove.head    |     1935.81 |     692.07 |     2013.04 |     180.03 |   3.99% |        -1.28% |          15.37 |                      |
| lifecycle/fullLifecycle/remove.random  |     2719.93 |     113.15 |     2846.13 |     171.50 |   4.64% |         4.18% |           1.63 |                      |
| lifecycle/fullLifecycle/remove.tail    |     1729.33 |      92.86 |     1859.91 |     154.34 |   7.55% |         1.16% |          11.08 |                      |
| lifecycle/fullLifecycle/replace.head   |     2650.55 |     144.71 |     2667.17 |     107.87 |   0.63% |         2.86% |           6.10 |                      |
| lifecycle/fullLifecycle/replace.random |     3848.13 |     321.30 |     3748.11 |     110.18 |  -2.60% |        -2.24% |           4.95 |                      |
| lifecycle/fullLifecycle/replace.tail   |    10992.44 |    1352.41 |    11068.35 |     519.81 |   0.69% |         0.09% |          12.96 |                      |
| lifecycle/fullLifecycle/value.head     |      367.49 |      44.23 |      390.37 |      13.68 |   6.23% |         7.32% |           9.95 |                      |
| lifecycle/fullLifecycle/value.random   |     1125.22 |      76.01 |     1135.18 |      59.96 |   0.89% |         0.90% |           3.11 |                      |
| lifecycle/fullLifecycle/value.tail     |      194.59 |      11.89 |      199.60 |       7.82 |   2.58% |         1.75% |           0.81 |                      |
| checkpoint/up/1000/create              |   298400.00 |  103800.00 |   336100.00 |  191800.00 |  12.63% |        12.63% |         120.83 |                      |
| checkpoint/up/1000/sequence            |  2638900.00 |  233000.00 |  3087800.00 |  431600.00 |  17.01% |        12.23% |          18.64 |                      |
| checkpoint/up/1000/values              |  1718000.00 |  254400.00 |  1576600.00 |   33500.00 |  -8.23% |       -14.24% |          13.19 |                      |
| checkpoint/up/5000/create              |   859800.00 |   20000.00 |   858100.00 |   43300.00 |  -0.20% |         0.55% |           7.04 |                      |
| checkpoint/up/5000/sequence            |  9504900.00 | 1117600.00 |  9684400.00 |  752300.00 |   1.89% |        -1.89% |          10.26 |                      |
| checkpoint/up/5000/values              |  4729500.00 |  685700.00 |  4866500.00 |  471900.00 |   2.90% |        -3.70% |          10.02 |                      |
| checkpoint/up/10000/create             |  1662500.00 |  293000.00 |  1542000.00 |  190900.00 |  -7.25% |         7.25% |          22.48 |                      |
| checkpoint/up/10000/sequence           | 15223900.00 | 1146500.00 | 14925200.00 | 3102200.00 |  -1.96% |         0.30% |          22.05 |                      |
| checkpoint/up/10000/values             | 21545000.00 |  482700.00 |  8722400.00 |  969500.00 | -59.52% |       -59.45% |           2.55 |                      |
| checkpoint/up/15000/create             |  2314400.00 |   46700.00 |  2410900.00 |  186300.00 |   4.17% |         4.52% |           4.47 |                      |
| checkpoint/up/15000/sequence           | 17392200.00 |  804700.00 | 17165100.00 | 2641400.00 |  -1.31% |         7.20% |          12.58 |                      |
| checkpoint/up/15000/values             | 30410700.00 |  752400.00 | 10896900.00 |  758600.00 | -64.17% |       -64.17% |           1.62 |                      |
| checkpoint/up/20000/create             |  3372000.00 |  705200.00 |  3335400.00 |  111000.00 |  -1.09% |        -4.10% |          17.35 |                      |
| checkpoint/up/20000/sequence           | 28017600.00 | 3911000.00 | 24560100.00 | 1176100.00 | -12.34% |        -5.47% |          16.16 |                      |
| checkpoint/up/20000/values             | 13960500.00 |  191100.00 | 13472100.00 |  728700.00 |  -3.50% |        -3.13% |           2.69 |                      |
| checkpoint/up/25000/create             |  4044100.00 |  290100.00 |  4162600.00 |  232000.00 |   2.93% |        -0.12% |           8.86 |                      |
| checkpoint/up/25000/sequence           | 27573500.00 |  174600.00 | 27716500.00 |  837400.00 |   0.52% |         0.44% |           9.25 |                      |
| checkpoint/up/25000/values             | 13660400.00 |  595200.00 | 15660300.00 |  655200.00 |  14.64% |        10.59% |          10.52 | yes                  |
| checkpoint/down/20000/create           |  3351800.00 |  113300.00 |  3511000.00 |  216400.00 |   4.75% |        -0.05% |           3.86 |                      |
| checkpoint/down/20000/sequence         | 24213400.00 | 2063700.00 | 23240400.00 | 8432500.00 |  -4.02% |        -2.92% |          24.53 |                      |
| checkpoint/down/20000/values           | 10876700.00 |  792200.00 | 12715700.00 |  874800.00 |  16.91% |        19.68% |          10.68 |                      |
| checkpoint/down/15000/create           |  2368200.00 |    8800.00 |  2406000.00 |   56300.00 |   1.60% |         1.90% |           2.45 |                      |
| checkpoint/down/15000/sequence         | 19846900.00 |  819300.00 | 19860500.00 | 2918000.00 |   0.07% |        -0.35% |           9.07 |                      |
| checkpoint/down/15000/values           |  8678100.00 | 2333700.00 | 11096400.00 | 1251400.00 |  27.87% |        27.87% |          50.23 |                      |
| checkpoint/down/10000/create           |  1634100.00 |  116800.00 |  1649500.00 |   19200.00 |   0.94% |        -0.01% |           5.84 |                      |
| checkpoint/down/10000/sequence         | 15300100.00 |  697200.00 | 16111200.00 | 2783000.00 |   5.30% |         5.30% |          15.62 |                      |
| checkpoint/down/10000/values           |  6670900.00 | 1369100.00 |  7492800.00 | 1290400.00 |  12.32% |        25.13% |          22.81 | yes                  |
| checkpoint/down/5000/create            |   818600.00 |   79400.00 |   799100.00 |  125000.00 |  -2.38% |         4.20% |          10.53 |                      |
| checkpoint/down/5000/sequence          | 12244000.00 |  853700.00 | 13038100.00 | 2759300.00 |   6.49% |        14.40% |          21.34 |                      |
| checkpoint/down/5000/values            |  3340100.00 |  884900.00 |  5578800.00 | 1688800.00 |  67.02% |        39.64% |          60.91 | yes                  |
| checkpoint/down/1000/create            |   148000.00 |   15600.00 |   148100.00 |    1800.00 |   0.07% |        -1.01% |           9.22 |                      |
| checkpoint/down/1000/sequence          |  7388200.00 |  648800.00 |  8702600.00 | 2298600.00 |  17.79% |        12.39% |          19.38 | yes                  |
| checkpoint/down/1000/values            |   648900.00 |   31600.00 |  1405700.00 |  745100.00 | 116.63% |       139.72% |          57.51 | yes                  |
| checkpoint/down/0/create               |    14500.00 |   19800.00 |    15400.00 |    3700.00 |   6.21% |         0.00% |          47.11 |                      |
| checkpoint/down/0/sequence             |  1585400.00 |  505800.00 |  1669300.00 |  277300.00 |   5.29% |        -0.32% |          11.21 |                      |
| checkpoint/down/0/values               |    11700.00 |    2700.00 |    10100.00 |    2100.00 | -13.68% |        -9.09% |          31.16 |                      |

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
