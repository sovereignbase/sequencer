# removal-ranges-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: reserved-slot; candidate: removal-ranges. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/removal-ranges-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR | Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | -----: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |     3910.63 |     111.39 |     3647.38 |     191.70 | -6.73% |        -6.73% |          10.30 |                      |
| lifecycle/scaleUp/insert.head          |      849.21 |      64.02 |      811.06 |      96.01 | -4.49% |         5.36% |          12.92 |                      |
| lifecycle/scaleUp/insert.random        |     1825.87 |      82.10 |     1734.17 |     107.05 | -5.02% |        -3.65% |          10.27 |                      |
| lifecycle/scaleUp/insert.tail          |      784.86 |      91.49 |      748.28 |      41.53 | -4.66% |        -0.64% |           7.29 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |     2792.82 |     193.20 |     3058.61 |     295.18 |  9.52% |         0.78% |          20.43 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2488.73 |     313.48 |     2490.66 |     449.82 |  0.08% |         1.53% |           3.28 |                      |
| lifecycle/scaleUp/replace.random       |     3983.01 |     172.16 |     3636.74 |     260.34 | -8.69% |       -10.35% |           1.75 |                      |
| lifecycle/scaleUp/replace.tail         |     2353.50 |     162.82 |     2498.33 |     355.26 |  6.15% |         6.15% |          12.68 |                      |
| lifecycle/scaleUp/value.head           |      317.42 |      14.68 |      327.94 |      35.89 |  3.31% |         2.75% |           7.50 |                      |
| lifecycle/scaleUp/value.random         |     1162.84 |       4.38 |     1129.95 |      36.66 | -2.83% |        -2.69% |           2.08 |                      |
| lifecycle/scaleUp/value.tail           |      155.02 |       1.06 |      152.85 |       1.32 | -1.40% |        -1.86% |           2.86 |                      |
| lifecycle/scaleDown/apply.random       |     3419.58 |     135.59 |     3466.53 |      88.61 |  1.37% |        -1.35% |           2.23 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     1730.17 |      23.20 |     1656.62 |     145.72 | -4.25% |        -3.22% |           9.00 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |  0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1896.48 |      97.89 |     1949.58 |     126.58 |  2.80% |        -0.31% |           1.84 |                      |
| lifecycle/scaleDown/remove.random      |     2710.66 |     161.84 |     2640.49 |      77.30 | -2.59% |        -2.59% |           2.99 |                      |
| lifecycle/scaleDown/remove.tail        |     1719.34 |      98.35 |     1756.71 |      29.48 |  2.17% |         0.50% |           1.36 |                      |
| lifecycle/scaleDown/replace.head       |     2783.17 |     270.20 |     2745.45 |     146.98 | -1.36% |        -1.36% |          20.59 |                      |
| lifecycle/scaleDown/replace.random     |     3457.95 |     155.40 |     3284.64 |     158.58 | -5.01% |        -2.75% |           4.48 |                      |
| lifecycle/scaleDown/replace.tail       |    19461.57 |     427.07 |    19449.73 |     168.58 | -0.06% |         1.76% |           2.79 |                      |
| lifecycle/scaleDown/value.head         |      421.72 |       1.96 |      421.40 |       6.77 | -0.08% |         0.63% |           2.72 |                      |
| lifecycle/scaleDown/value.random       |     1080.84 |      22.64 |     1076.92 |       7.82 | -0.36% |        -0.24% |           2.36 |                      |
| lifecycle/scaleDown/value.tail         |      230.72 |       2.25 |      228.65 |       5.98 | -0.90% |        -1.41% |           4.24 |                      |
| lifecycle/fullLifecycle/apply.random   |     3727.20 |      98.92 |     3594.46 |      87.23 | -3.56% |        -1.39% |           6.49 |                      |
| lifecycle/fullLifecycle/insert.head    |      849.21 |      64.02 |      811.06 |      96.01 | -4.49% |         5.36% |          12.92 |                      |
| lifecycle/fullLifecycle/insert.random  |     1786.87 |     100.69 |     1761.71 |     219.52 | -1.41% |        -8.34% |          15.09 |                      |
| lifecycle/fullLifecycle/insert.tail    |      784.86 |      91.49 |      748.28 |      41.53 | -4.66% |        -0.64% |           7.29 |                      |
| lifecycle/fullLifecycle/remove.head    |     1896.48 |      97.89 |     1949.58 |     126.58 |  2.80% |        -0.31% |           1.84 |                      |
| lifecycle/fullLifecycle/remove.random  |     2826.66 |      67.08 |     2835.60 |     222.54 |  0.32% |        -6.58% |          10.21 |                      |
| lifecycle/fullLifecycle/remove.tail    |     1719.34 |      98.35 |     1756.71 |      29.48 |  2.17% |         0.50% |           1.36 |                      |
| lifecycle/fullLifecycle/replace.head   |     2637.76 |      65.94 |     2742.28 |     144.96 |  3.96% |         1.42% |           4.24 |                      |
| lifecycle/fullLifecycle/replace.random |     3762.95 |     180.52 |     3459.93 |      69.99 | -8.05% |        -7.06% |           3.09 |                      |
| lifecycle/fullLifecycle/replace.tail   |    10917.74 |     216.57 |    10974.03 |     103.97 |  0.52% |         2.11% |           2.63 |                      |
| lifecycle/fullLifecycle/value.head     |      369.57 |       7.48 |      373.81 |      23.65 |  1.15% |         1.67% |           4.61 |                      |
| lifecycle/fullLifecycle/value.random   |     1121.84 |      22.31 |     1110.68 |      22.24 | -1.00% |        -0.50% |           1.59 |                      |
| lifecycle/fullLifecycle/value.tail     |      192.71 |       1.94 |      190.75 |       4.76 | -1.02% |        -0.66% |           3.27 |                      |
| checkpoint/up/1000/create              |   269100.00 |  115300.00 |   275000.00 |  253900.00 |  2.19% |        -1.30% |         141.06 |                      |
| checkpoint/up/1000/sequence            |  2582300.00 |  621200.00 |  2693000.00 |  336900.00 |  4.29% |        -7.88% |          22.51 |                      |
| checkpoint/up/1000/values              |  1731700.00 |  261400.00 |  1608000.00 |   62500.00 | -7.14% |        -7.14% |          10.61 |                      |
| checkpoint/up/5000/create              |   838100.00 |   61800.00 |   858000.00 |   57900.00 |  2.37% |         1.29% |          16.05 |                      |
| checkpoint/up/5000/sequence            |  9493800.00 | 1417400.00 |  9736100.00 |  782900.00 |  2.55% |         2.55% |          11.27 |                      |
| checkpoint/up/5000/values              |  4427800.00 |  871400.00 |  5007400.00 | 1144500.00 | 13.09% |         7.93% |          14.61 |                      |
| checkpoint/up/10000/create             |  1617400.00 |  288600.00 |  1538600.00 |   58000.00 | -4.87% |       -11.31% |          12.67 |                      |
| checkpoint/up/10000/sequence           | 16184400.00 | 3053600.00 | 15803300.00 |  629300.00 | -2.35% |        -2.35% |          16.26 |                      |
| checkpoint/up/10000/values             | 20275000.00 | 1637800.00 | 20302600.00 |  168400.00 |  0.14% |         0.14% |           8.48 |                      |
| checkpoint/up/15000/create             |  2597600.00 |   58400.00 |  2370900.00 |   57900.00 | -8.73% |        -5.91% |           3.19 |                      |
| checkpoint/up/15000/sequence           | 18215700.00 | 2814400.00 | 17894100.00 | 1801900.00 | -1.77% |         6.92% |          16.74 |                      |
| checkpoint/up/15000/values             | 30927400.00 | 1052500.00 | 30641400.00 | 2430000.00 | -0.92% |         3.05% |           9.28 |                      |
| checkpoint/up/20000/create             |  3308300.00 |   35100.00 |  3457700.00 |  159500.00 |  4.52% |         0.25% |           4.67 |                      |
| checkpoint/up/20000/sequence           | 26011100.00 | 1273600.00 | 25259600.00 |  321300.00 | -2.89% |        -2.89% |           2.61 |                      |
| checkpoint/up/20000/values             | 10321500.00 |   81400.00 | 11192700.00 | 1874000.00 |  8.44% |        10.97% |          20.34 |                      |
| checkpoint/up/25000/create             |  4146300.00 |  416700.00 |  3852800.00 |   92000.00 | -7.08% |        -8.27% |          13.28 |                      |
| checkpoint/up/25000/sequence           | 26705800.00 | 3251800.00 | 28644000.00 | 2406600.00 |  7.26% |         7.26% |           5.54 |                      |
| checkpoint/up/25000/values             | 11500100.00 | 1100400.00 | 12436900.00 | 2341300.00 |  8.15% |        10.64% |          18.94 |                      |
| checkpoint/down/20000/create           |  3360300.00 |  253500.00 |  3544400.00 |  154400.00 |  5.48% |         2.96% |           3.08 |                      |
| checkpoint/down/20000/sequence         | 22569700.00 |  976200.00 | 23436300.00 |  365400.00 |  3.84% |         5.69% |           5.88 |                      |
| checkpoint/down/20000/values           |  9551300.00 |  797000.00 |  9494600.00 |  185100.00 | -0.59% |        -1.41% |           9.40 |                      |
| checkpoint/down/15000/create           |  2395500.00 |   35600.00 |  2323800.00 |   51700.00 | -2.99% |        -2.36% |           7.41 |                      |
| checkpoint/down/15000/sequence         | 18742700.00 |  155200.00 | 19726500.00 | 2417500.00 |  5.25% |         5.56% |          10.29 |                      |
| checkpoint/down/15000/values           |  7367600.00 |  110000.00 |  8067500.00 |  261800.00 |  9.50% |        10.27% |           3.23 | yes                  |
| checkpoint/down/10000/create           |  1649300.00 |    9500.00 |  1646600.00 |   81500.00 | -0.16% |        -1.90% |           4.62 |                      |
| checkpoint/down/10000/sequence         | 15902900.00 | 2971800.00 | 15913800.00 | 1404000.00 |  0.07% |        -6.62% |           6.51 |                      |
| checkpoint/down/10000/values           |  5452200.00 | 1264000.00 |  5540700.00 |  493100.00 |  1.62% |         5.95% |          31.28 |                      |
| checkpoint/down/5000/create            |   796100.00 |   69500.00 |   791800.00 |   17400.00 | -0.54% |         4.95% |          11.86 |                      |
| checkpoint/down/5000/sequence          | 11727300.00 | 1997400.00 | 13082800.00 | 2450500.00 | 11.56% |         6.19% |          13.19 |                      |
| checkpoint/down/5000/values            |  2947500.00 |  735800.00 |  3009600.00 |  209800.00 |  2.11% |        -0.14% |          16.45 |                      |
| checkpoint/down/1000/create            |   147300.00 |   10600.00 |   159200.00 |   91100.00 |  8.08% |        12.11% |          61.35 |                      |
| checkpoint/down/1000/sequence          |  6741900.00 | 1743500.00 |  7739800.00 | 2526400.00 | 14.80% |        10.99% |          11.81 |                      |
| checkpoint/down/1000/values            |   588400.00 |   73400.00 |   552700.00 |   77700.00 | -6.07% |         2.20% |          13.11 |                      |
| checkpoint/down/0/create               |    14100.00 |    4600.00 |    15100.00 |     900.00 |  7.09% |         3.91% |          33.59 |                      |
| checkpoint/down/0/sequence             |  1480100.00 |  419800.00 |  1605400.00 |  112800.00 |  8.47% |         3.72% |          30.27 |                      |
| checkpoint/down/0/values               |    10200.00 |     500.00 |    14100.00 |    9700.00 | 38.24% |        20.48% |          28.78 |                      |

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
