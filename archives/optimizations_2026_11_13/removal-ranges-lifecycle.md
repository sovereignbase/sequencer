# removal-ranges-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: removal-ranges. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/removal-ranges-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    12588.29 |     294.78 |     3647.38 |     191.70 | -71.03% |       -70.76% |           2.18 |                      |
| lifecycle/scaleUp/insert.head          |      822.46 |     134.97 |      811.06 |      96.01 |  -1.39% |        -0.73% |          14.08 |                      |
| lifecycle/scaleUp/insert.random        |     6254.33 |     101.57 |     1734.17 |     107.05 | -72.27% |       -73.38% |           1.39 |                      |
| lifecycle/scaleUp/insert.tail          |      794.06 |     196.25 |      748.28 |      41.53 |  -5.76% |        -6.61% |           4.99 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11078.80 |     309.64 |     3058.61 |     295.18 | -72.39% |       -73.02% |           2.04 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2461.20 |      38.85 |     2490.66 |     449.82 |   1.20% |         2.09% |           4.00 |                      |
| lifecycle/scaleUp/replace.random       |    11602.68 |     125.40 |     3636.74 |     260.34 | -68.66% |       -68.16% |           2.59 |                      |
| lifecycle/scaleUp/replace.tail         |     2477.12 |     366.12 |     2498.33 |     355.26 |   0.86% |         0.34% |           7.56 |                      |
| lifecycle/scaleUp/value.head           |      364.41 |       7.17 |      327.94 |      35.89 | -10.01% |        -9.62% |           3.94 |                      |
| lifecycle/scaleUp/value.random         |     9290.64 |     144.61 |     1129.95 |      36.66 | -87.84% |       -87.71% |           0.20 |                      |
| lifecycle/scaleUp/value.tail           |      232.74 |       4.87 |      152.85 |       1.32 | -34.33% |       -33.90% |           1.71 |                      |
| lifecycle/scaleDown/apply.random       |    11436.21 |     608.72 |     3466.53 |      88.61 | -69.69% |       -69.41% |           2.83 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3922.01 |     182.24 |     1656.62 |     145.72 | -57.76% |       -55.27% |           4.74 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1992.18 |     108.45 |     1949.58 |     126.58 |  -2.14% |        -2.14% |           9.89 |                      |
| lifecycle/scaleDown/remove.random      |     5875.21 |     401.57 |     2640.49 |      77.30 | -55.06% |       -56.32% |           3.91 |                      |
| lifecycle/scaleDown/remove.tail        |     2052.14 |     118.17 |     1756.71 |      29.48 | -14.40% |       -17.27% |           3.46 |                      |
| lifecycle/scaleDown/replace.head       |     2583.78 |      82.10 |     2745.45 |     146.98 |   6.26% |         6.15% |          20.13 |                      |
| lifecycle/scaleDown/replace.random     |     6282.14 |     330.98 |     3284.64 |     158.58 | -47.71% |       -47.35% |           6.08 |                      |
| lifecycle/scaleDown/replace.tail       |    42157.68 |    2115.55 |    19449.73 |     168.58 | -53.86% |       -52.64% |           2.99 |                      |
| lifecycle/scaleDown/value.head         |      495.56 |      14.72 |      421.40 |       6.77 | -14.96% |       -16.66% |           1.68 |                      |
| lifecycle/scaleDown/value.random       |     3783.86 |     108.90 |     1076.92 |       7.82 | -71.54% |       -71.56% |           2.38 |                      |
| lifecycle/scaleDown/value.tail         |      291.02 |      10.32 |      228.65 |       5.98 | -21.43% |       -20.68% |           4.13 |                      |
| lifecycle/fullLifecycle/apply.random   |    12012.26 |     146.74 |     3594.46 |      87.23 | -70.08% |       -69.64% |           0.71 |                      |
| lifecycle/fullLifecycle/insert.head    |      822.46 |     134.97 |      811.06 |      96.01 |  -1.39% |        -0.73% |          14.08 |                      |
| lifecycle/fullLifecycle/insert.random  |     5135.01 |     120.07 |     1761.71 |     219.52 | -65.69% |       -65.87% |           3.06 |                      |
| lifecycle/fullLifecycle/insert.tail    |      794.06 |     196.25 |      748.28 |      41.53 |  -5.76% |        -6.61% |           4.99 |                      |
| lifecycle/fullLifecycle/remove.head    |     1992.18 |     108.45 |     1949.58 |     126.58 |  -2.14% |        -2.14% |           9.89 |                      |
| lifecycle/fullLifecycle/remove.random  |     8503.21 |      72.17 |     2835.60 |     222.54 | -66.65% |       -67.17% |           0.61 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2052.14 |     118.17 |     1756.71 |      29.48 | -14.40% |       -17.27% |           3.46 |                      |
| lifecycle/fullLifecycle/replace.head   |     2555.97 |     177.42 |     2742.28 |     144.96 |   7.29% |         6.40% |           5.45 |                      |
| lifecycle/fullLifecycle/replace.random |     8985.78 |      94.67 |     3459.93 |      69.99 | -61.50% |       -61.46% |           0.10 |                      |
| lifecycle/fullLifecycle/replace.tail   |    22345.38 |     886.59 |    10974.03 |     103.97 | -50.89% |       -49.45% |           1.61 |                      |
| lifecycle/fullLifecycle/value.head     |      429.46 |      20.87 |      373.81 |      23.65 | -12.96% |       -12.96% |           5.61 |                      |
| lifecycle/fullLifecycle/value.random   |     6540.95 |     132.66 |     1110.68 |      22.24 | -83.02% |       -83.09% |           0.77 |                      |
| lifecycle/fullLifecycle/value.tail     |      259.57 |       3.24 |      190.75 |       4.76 | -26.51% |       -26.51% |           1.50 |                      |
| checkpoint/up/1000/create              |   295000.00 |   41200.00 |   275000.00 |  253900.00 |  -6.78% |         1.04% |          97.01 |                      |
| checkpoint/up/1000/sequence            |  2804900.00 |  347900.00 |  2693000.00 |  336900.00 |  -3.99% |         1.07% |           6.29 |                      |
| checkpoint/up/1000/values              |  1703000.00 |  107600.00 |  1608000.00 |   62500.00 |  -5.58% |        -2.95% |           1.61 |                      |
| checkpoint/up/5000/create              |  1000600.00 |   51300.00 |   858000.00 |   57900.00 | -14.25% |       -11.59% |           5.99 |                      |
| checkpoint/up/5000/sequence            |  9116000.00 |  356000.00 |  9736100.00 |  782900.00 |   6.80% |        11.19% |          13.09 |                      |
| checkpoint/up/5000/values              |  5546000.00 |  760400.00 |  5007400.00 | 1144500.00 |  -9.71% |       -11.31% |           9.64 |                      |
| checkpoint/up/10000/create             |  1529500.00 |   71200.00 |  1538600.00 |   58000.00 |   0.59% |        -2.40% |          11.24 |                      |
| checkpoint/up/10000/sequence           | 14964000.00 |  784100.00 | 15803300.00 |  629300.00 |   5.61% |         5.61% |           9.29 |                      |
| checkpoint/up/10000/values             | 21442700.00 |  506500.00 | 20302600.00 |  168400.00 |  -5.32% |        -4.95% |           5.42 |                      |
| checkpoint/up/15000/create             |  2413600.00 |  361800.00 |  2370900.00 |   57900.00 |  -1.77% |        -1.77% |          20.40 |                      |
| checkpoint/up/15000/sequence           | 16927300.00 | 1423400.00 | 17894100.00 | 1801900.00 |   5.71% |         6.47% |          18.53 |                      |
| checkpoint/up/15000/values             | 31221500.00 |  622800.00 | 30641400.00 | 2430000.00 |  -1.86% |        -3.50% |          11.22 |                      |
| checkpoint/up/20000/create             |  3343700.00 |   11900.00 |  3457700.00 |  159500.00 |   3.41% |         3.11% |           2.81 |                      |
| checkpoint/up/20000/sequence           | 25184500.00 | 1368800.00 | 25259600.00 |  321300.00 |   0.30% |        -1.44% |           3.94 |                      |
| checkpoint/up/20000/values             | 12917600.00 |  786000.00 | 11192700.00 | 1874000.00 | -13.35% |        -8.62% |          17.73 |                      |
| checkpoint/up/25000/create             |  3921200.00 |   29600.00 |  3852800.00 |   92000.00 |  -1.74% |        -1.99% |           3.82 |                      |
| checkpoint/up/25000/sequence           | 26973900.00 |  574500.00 | 28644000.00 | 2406600.00 |   6.19% |         3.11% |           9.72 |                      |
| checkpoint/up/25000/values             | 13171100.00 |  863000.00 | 12436900.00 | 2341300.00 |  -5.57% |        -5.57% |           7.51 |                      |
| checkpoint/down/20000/create           |  3585500.00 |  337300.00 |  3544400.00 |  154400.00 |  -1.15% |        -1.15% |          15.62 |                      |
| checkpoint/down/20000/sequence         | 23913500.00 | 3578800.00 | 23436300.00 |  365400.00 |  -2.00% |        -0.86% |          16.67 |                      |
| checkpoint/down/20000/values           | 10568100.00 | 1510900.00 |  9494600.00 |  185100.00 | -10.16% |        -8.08% |          13.90 |                      |
| checkpoint/down/15000/create           |  2442800.00 |  464400.00 |  2323800.00 |   51700.00 |  -4.87% |        -6.93% |          11.26 |                      |
| checkpoint/down/15000/sequence         | 19807500.00 | 1223100.00 | 19726500.00 | 2417500.00 |  -0.41% |         5.91% |          11.97 |                      |
| checkpoint/down/15000/values           |  8841000.00 |  495100.00 |  8067500.00 |  261800.00 |  -8.75% |       -10.29% |           7.42 |                      |
| checkpoint/down/10000/create           |  1657800.00 |   90500.00 |  1646600.00 |   81500.00 |  -0.68% |        -2.70% |           2.30 |                      |
| checkpoint/down/10000/sequence         | 15071100.00 |  669900.00 | 15913800.00 | 1404000.00 |   5.59% |         2.84% |           7.16 |                      |
| checkpoint/down/10000/values           |  5832500.00 | 1500300.00 |  5540700.00 |  493100.00 |  -5.00% |        -5.00% |          33.68 |                      |
| checkpoint/down/5000/create            |   805600.00 |   77100.00 |   791800.00 |   17400.00 |  -1.71% |         1.06% |           5.07 |                      |
| checkpoint/down/5000/sequence          | 12545100.00 | 1867100.00 | 13082800.00 | 2450500.00 |   4.29% |         6.63% |          19.12 |                      |
| checkpoint/down/5000/values            |  3060800.00 |  302000.00 |  3009600.00 |  209800.00 |  -1.67% |        -4.29% |          14.42 |                      |
| checkpoint/down/1000/create            |   165900.00 |   28500.00 |   159200.00 |   91100.00 |  -4.04% |        -3.33% |          44.93 |                      |
| checkpoint/down/1000/sequence          |  7154400.00 |  961700.00 |  7739800.00 | 2526400.00 |   8.18% |         8.18% |          13.04 |                      |
| checkpoint/down/1000/values            |   665000.00 |  149900.00 |   552700.00 |   77700.00 | -16.89% |       -17.92% |           6.42 |                      |
| checkpoint/down/0/create               |    13900.00 |     300.00 |    15100.00 |     900.00 |   8.63% |         9.35% |          19.39 |                      |
| checkpoint/down/0/sequence             |  1422900.00 |  105900.00 |  1605400.00 |  112800.00 |  12.83% |         9.91% |           8.63 | yes                  |
| checkpoint/down/0/values               |     9800.00 |     700.00 |    14100.00 |    9700.00 |  43.88% |        43.88% |          91.26 |                      |

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
