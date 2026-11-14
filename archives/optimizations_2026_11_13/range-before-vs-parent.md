# range-before-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: reserved-slot; candidate: range-before. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/range-before-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |     3750.42 |      39.61 |     3698.84 |     201.98 |  -1.38% |        -1.14% |           1.62 |                      |
| lifecycle/scaleUp/insert.head          |      830.91 |      40.51 |      830.46 |      94.64 |  -0.05% |        -0.05% |           2.66 |                      |
| lifecycle/scaleUp/insert.random        |     1815.04 |      84.91 |     1701.24 |      62.02 |  -6.27% |        -2.64% |           4.14 |                      |
| lifecycle/scaleUp/insert.tail          |      779.72 |      51.40 |      740.96 |      94.37 |  -4.97% |        -2.42% |           3.28 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |     2785.93 |     381.36 |     2660.76 |      24.55 |  -4.49% |        -4.97% |          11.47 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2374.22 |     327.15 |     2381.18 |      60.36 |   0.29% |        -1.59% |          10.05 |                      |
| lifecycle/scaleUp/replace.random       |     3614.07 |     246.65 |     3673.38 |     254.04 |   1.64% |        -0.96% |           6.08 |                      |
| lifecycle/scaleUp/replace.tail         |     2600.88 |     180.79 |     2240.31 |     107.47 | -13.86% |       -10.26% |          10.39 |                      |
| lifecycle/scaleUp/value.head           |      308.07 |      41.10 |      304.05 |      22.40 |  -1.30% |        -4.58% |           9.41 |                      |
| lifecycle/scaleUp/value.random         |     1168.21 |      33.80 |     1134.44 |      16.92 |  -2.89% |        -2.72% |           2.22 |                      |
| lifecycle/scaleUp/value.tail           |      156.50 |      10.11 |      153.36 |       6.56 |  -2.01% |        -3.04% |           8.07 |                      |
| lifecycle/scaleDown/apply.random       |     3514.23 |      87.76 |     3996.19 |     165.07 |  13.71% |        14.49% |          12.73 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     1825.00 |     127.27 |     1709.74 |     164.27 |  -6.32% |        -6.32% |           6.34 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1990.62 |     790.56 |     1892.38 |     135.83 |  -4.94% |        -6.41% |          17.99 |                      |
| lifecycle/scaleDown/remove.random      |     2671.02 |     111.56 |     2699.20 |     246.25 |   1.06% |         1.06% |          13.48 |                      |
| lifecycle/scaleDown/remove.tail        |     1751.13 |      28.16 |     1736.55 |     155.78 |  -0.83% |        -0.83% |          11.08 |                      |
| lifecycle/scaleDown/replace.head       |     2566.09 |     169.64 |     2788.24 |     385.45 |   8.66% |         0.18% |          22.58 |                      |
| lifecycle/scaleDown/replace.random     |     3529.76 |     238.15 |     3910.83 |     844.80 |  10.80% |         7.54% |          23.57 |                      |
| lifecycle/scaleDown/replace.tail       |    19882.26 |    1687.24 |    19341.00 |    3190.54 |  -2.72% |        -2.72% |           9.35 |                      |
| lifecycle/scaleDown/value.head         |      430.69 |      29.83 |      424.84 |      36.20 |  -1.36% |        -1.36% |          16.67 |                      |
| lifecycle/scaleDown/value.random       |     1120.02 |      58.36 |     1116.89 |     123.93 |  -0.28% |        -0.28% |          16.51 |                      |
| lifecycle/scaleDown/value.tail         |      238.37 |       2.36 |      235.00 |       6.54 |  -1.42% |        -1.42% |          11.24 |                      |
| lifecycle/fullLifecycle/apply.random   |     3641.85 |      97.37 |     3878.75 |     169.93 |   6.50% |         6.44% |           5.84 |                      |
| lifecycle/fullLifecycle/insert.head    |      830.91 |      40.51 |      830.46 |      94.64 |  -0.05% |        -0.05% |           2.66 |                      |
| lifecycle/fullLifecycle/insert.random  |     1820.02 |     202.41 |     1758.58 |      53.03 |  -3.38% |        -5.16% |           0.52 |                      |
| lifecycle/fullLifecycle/insert.tail    |      779.72 |      51.40 |      740.96 |      94.37 |  -4.97% |        -2.42% |           3.28 |                      |
| lifecycle/fullLifecycle/remove.head    |     1990.62 |     790.56 |     1892.38 |     135.83 |  -4.94% |        -6.41% |          17.99 |                      |
| lifecycle/fullLifecycle/remove.random  |     2913.85 |     239.03 |     2679.76 |     159.83 |  -8.03% |        -8.03% |          14.27 |                      |
| lifecycle/fullLifecycle/remove.tail    |     1751.13 |      28.16 |     1736.55 |     155.78 |  -0.83% |        -0.83% |          11.08 |                      |
| lifecycle/fullLifecycle/replace.head   |     2617.90 |     190.91 |     2676.19 |     151.75 |   2.23% |        -0.67% |           6.10 |                      |
| lifecycle/fullLifecycle/replace.random |     3570.59 |     102.88 |     3784.77 |     193.69 |   6.00% |         7.18% |           1.67 |                      |
| lifecycle/fullLifecycle/replace.tail   |    11241.57 |     817.56 |    10837.52 |    1587.79 |  -3.59% |        -3.59% |           9.86 |                      |
| lifecycle/fullLifecycle/value.head     |      374.26 |      39.29 |      357.96 |      30.82 |  -4.36% |        -6.67% |          19.54 |                      |
| lifecycle/fullLifecycle/value.random   |     1149.84 |      46.54 |     1132.24 |      63.10 |  -1.53% |        -1.53% |           9.67 |                      |
| lifecycle/fullLifecycle/value.tail     |      197.44 |       9.19 |      193.37 |       3.74 |  -2.06% |        -1.08% |           4.93 |                      |
| checkpoint/up/1000/create              |   286500.00 |   28500.00 |   262300.00 |  186600.00 |  -8.45% |         0.19% |          73.48 |                      |
| checkpoint/up/1000/sequence            |  2676100.00 |   88400.00 |  2628400.00 |  206400.00 |  -1.78% |        -0.31% |          12.58 |                      |
| checkpoint/up/1000/values              |  1613900.00 |  113600.00 |  1783200.00 |  174100.00 |  10.49% |        10.49% |          18.60 |                      |
| checkpoint/up/5000/create              |   842400.00 |   39200.00 |   890200.00 |   84800.00 |   5.67% |         4.70% |           3.69 |                      |
| checkpoint/up/5000/sequence            |  9838700.00 |  140500.00 |  8986600.00 | 1099700.00 |  -8.66% |        -9.97% |          10.01 |                      |
| checkpoint/up/5000/values              |  4460300.00 |  131700.00 |  5421300.00 |  241100.00 |  21.55% |        21.73% |           7.81 | yes                  |
| checkpoint/up/10000/create             |  1667900.00 |   64300.00 |  1615800.00 |  143500.00 |  -3.12% |        -0.78% |          12.24 |                      |
| checkpoint/up/10000/sequence           | 15870100.00 |  344500.00 | 15455200.00 |  186200.00 |  -2.61% |        -3.82% |           4.36 |                      |
| checkpoint/up/10000/values             | 20911600.00 |  911300.00 | 20970400.00 |  414600.00 |   0.28% |        -1.07% |           1.00 |                      |
| checkpoint/up/15000/create             |  2323100.00 |   77700.00 |  2321900.00 |   14200.00 |  -0.05% |         0.28% |           3.64 |                      |
| checkpoint/up/15000/sequence           | 17753000.00 | 2999100.00 | 17025800.00 |  171900.00 |  -4.10% |        -8.21% |          14.41 |                      |
| checkpoint/up/15000/values             | 30363600.00 | 1086700.00 | 30157200.00 | 1136200.00 |  -0.68% |         1.99% |           6.89 |                      |
| checkpoint/up/20000/create             |  3289100.00 |   89500.00 |  3391300.00 |   73700.00 |   3.11% |         4.37% |           3.73 |                      |
| checkpoint/up/20000/sequence           | 24725200.00 | 1102800.00 | 25757500.00 | 2064400.00 |   4.18% |         2.30% |           4.73 |                      |
| checkpoint/up/20000/values             | 10887200.00 |  190800.00 | 11070900.00 |  463400.00 |   1.69% |         3.67% |           7.40 |                      |
| checkpoint/up/25000/create             |  3957800.00 |  372800.00 |  3861400.00 |   22400.00 |  -2.44% |        -2.70% |          10.66 |                      |
| checkpoint/up/25000/sequence           | 29828100.00 | 9505200.00 | 27407300.00 | 1220300.00 |  -8.12% |        -3.23% |          21.33 |                      |
| checkpoint/up/25000/values             | 12341400.00 |   99900.00 | 12584700.00 | 1013800.00 |   1.97% |         2.30% |           4.63 |                      |
| checkpoint/down/20000/create           |  3360700.00 |   80000.00 |  3386100.00 |  288400.00 |   0.76% |         2.71% |           5.84 | yes                  |
| checkpoint/down/20000/sequence         | 22740100.00 |  610800.00 | 24202300.00 | 3257500.00 |   6.43% |         4.81% |           2.45 |                      |
| checkpoint/down/20000/values           |  9307400.00 |  606700.00 |  9905400.00 |  671500.00 |   6.42% |         2.06% |          14.93 |                      |
| checkpoint/down/15000/create           |  2381000.00 |   81900.00 |  2505000.00 |  110200.00 |   5.21% |         4.10% |           2.17 |                      |
| checkpoint/down/15000/sequence         | 18795800.00 |  749700.00 | 21850300.00 | 6763900.00 |  16.25% |         9.62% |          15.22 |                      |
| checkpoint/down/15000/values           |  7110200.00 |  504700.00 |  9261100.00 | 2728500.00 |  30.25% |        21.65% |          40.92 |                      |
| checkpoint/down/10000/create           |  1656800.00 |   22600.00 |  1627500.00 |   24200.00 |  -1.77% |        -1.81% |           1.11 |                      |
| checkpoint/down/10000/sequence         | 15883700.00 | 1601200.00 | 15847600.00 |  967600.00 |  -0.23% |        -4.20% |          19.81 |                      |
| checkpoint/down/10000/values           |  5662800.00 | 1112300.00 |  5320800.00 |  510500.00 |  -6.04% |         4.59% |          27.54 |                      |
| checkpoint/down/5000/create            |   797000.00 |   27300.00 |   790500.00 |   22100.00 |  -0.82% |         1.54% |           2.59 |                      |
| checkpoint/down/5000/sequence          | 11643300.00 | 1677400.00 | 13361500.00 | 3846700.00 |  14.76% |        20.26% |          42.76 |                      |
| checkpoint/down/5000/values            |  3813800.00 | 1109500.00 |  2734800.00 |  421700.00 | -28.29% |        -6.83% |          24.53 |                      |
| checkpoint/down/1000/create            |   197600.00 |  113200.00 |   157100.00 |   27000.00 | -20.50% |       -20.50% |          13.71 |                      |
| checkpoint/down/1000/sequence          |  7217300.00 |  422700.00 |  8500100.00 | 2545400.00 |  17.77% |         2.50% |          30.79 |                      |
| checkpoint/down/1000/values            |   533800.00 |    7900.00 |   545900.00 |   72200.00 |   2.27% |         1.81% |           7.93 |                      |
| checkpoint/down/0/create               |    14800.00 |    6100.00 |    15200.00 |    2800.00 |   2.70% |         3.09% |          13.73 |                      |
| checkpoint/down/0/sequence             |  1603800.00 |  188900.00 |  1490800.00 |   89600.00 |  -7.05% |        -7.05% |          17.80 |                      |
| checkpoint/down/0/values               |    10700.00 |    1900.00 |    10100.00 |     300.00 |  -5.61% |        -7.69% |          12.32 |                      |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |      Before |       After | Change |
| :-------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                   |   480376.00 |   480376.00 |  0.00% |
| memory/up/1000/js                       |   407560.00 |   407560.00 |  0.00% |
| storage/up/1000/jsonBytes               |   278238.00 |   278238.00 |  0.00% |
| storage/up/1000/jsonGzipBytes           |    14908.00 |    14908.00 |  0.00% |
| storage/up/1000/messagePackBytes        |   165784.00 |   165784.00 |  0.00% |
| storage/up/1000/messagePackGzipBytes    |    12641.00 |    12641.00 |  0.00% |
| memory/up/5000/native                   |  2156536.00 |  2156536.00 |  0.00% |
| memory/up/5000/js                       |  2059744.00 |  2059744.00 |  0.00% |
| storage/up/5000/jsonBytes               |  1662776.00 |  1662776.00 |  0.00% |
| storage/up/5000/jsonGzipBytes           |    75146.00 |    75146.00 |  0.00% |
| storage/up/5000/messagePackBytes        |   839612.00 |   839612.00 |  0.00% |
| storage/up/5000/messagePackGzipBytes    |    63127.00 |    63127.00 |  0.00% |
| memory/up/10000/native                  |  3567240.00 |  3567240.00 |  0.00% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  4819568.00 |  4819568.00 |  0.00% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6317696.00 |  6317696.00 |  0.00% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  7541576.00 |  7541576.00 |  0.00% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  6597208.00 |  6597208.00 |  0.00% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  5747344.00 |  5747344.00 |  0.00% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  4721016.00 |  4721016.00 |  0.00% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3777480.00 |  3777480.00 |  0.00% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2719408.00 |  2719408.00 |  0.00% |
| memory/down/1000/js                     |   413360.00 |   413360.00 |  0.00% |
| storage/down/1000/jsonBytes             |   386836.00 |   386836.00 |  0.00% |
| storage/down/1000/jsonGzipBytes         |    16336.00 |    16336.00 |  0.00% |
| storage/down/1000/messagePackBytes      |   271220.00 |   271220.00 |  0.00% |
| storage/down/1000/messagePackGzipBytes  |    13932.00 |    13932.00 |  0.00% |
| memory/down/0/native                    |  1598032.00 |  1598032.00 |  0.00% |
| memory/down/0/js                        |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonBytes                |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonGzipBytes            |       32.00 |       32.00 |  0.00% |
| storage/down/0/messagePackBytes         |        8.00 |        8.00 |  0.00% |
| storage/down/0/messagePackGzipBytes     |       28.00 |       28.00 |  0.00% |
