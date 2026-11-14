# compact-removals-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: signed-slice; candidate: compact-removals. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/compact-removals-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |     3911.71 |     359.11 |     3741.18 |     131.71 |  -4.36% |        -6.39% |          14.48 |                      |
| lifecycle/scaleUp/insert.head          |      821.09 |      41.18 |      907.33 |     115.47 |  10.50% |         9.45% |          16.09 |                      |
| lifecycle/scaleUp/insert.random        |     1788.17 |      65.88 |     1747.95 |      95.39 |  -2.25% |         1.87% |           3.65 |                      |
| lifecycle/scaleUp/insert.tail          |      818.34 |     101.25 |      762.02 |      37.93 |  -6.88% |         2.32% |          11.29 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |     2751.05 |      58.71 |     2761.99 |     139.99 |   0.40% |        -0.46% |           3.91 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2603.72 |     207.46 |     2494.12 |     141.46 |  -4.21% |        -0.30% |           8.45 |                      |
| lifecycle/scaleUp/replace.random       |     3671.89 |     200.32 |     3636.36 |     216.46 |  -0.97% |        -0.94% |           4.34 |                      |
| lifecycle/scaleUp/replace.tail         |     2345.90 |      76.82 |     2464.87 |     102.61 |   5.07% |         7.00% |           4.55 |                      |
| lifecycle/scaleUp/value.head           |      321.95 |      12.14 |      320.21 |      14.90 |  -0.54% |        -3.45% |           4.91 |                      |
| lifecycle/scaleUp/value.random         |     1173.70 |      38.18 |     1155.73 |      20.35 |  -1.53% |         1.28% |           2.92 |                      |
| lifecycle/scaleUp/value.tail           |      158.33 |       2.48 |      157.32 |       3.28 |  -0.63% |         0.95% |           3.95 |                      |
| lifecycle/scaleDown/apply.random       |     3425.09 |     176.82 |     3467.30 |     542.84 |   1.23% |         0.96% |          10.15 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     1696.25 |     270.64 |     1712.04 |      27.26 |   0.93% |        -0.67% |          10.30 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1879.66 |     245.50 |     1886.74 |     129.55 |   0.38% |         0.22% |          13.26 |                      |
| lifecycle/scaleDown/remove.random      |     2654.86 |     353.94 |     2701.02 |     344.26 |   1.74% |         1.79% |           0.71 |                      |
| lifecycle/scaleDown/remove.tail        |     1712.66 |      70.96 |     1818.66 |     812.84 |   6.19% |         4.59% |          44.47 |                      |
| lifecycle/scaleDown/replace.head       |     2556.70 |     230.82 |     2635.52 |     225.91 |   3.08% |         2.68% |           7.65 |                      |
| lifecycle/scaleDown/replace.random     |     3573.26 |     136.73 |     3410.04 |     552.77 |  -4.57% |        -0.91% |           5.00 |                      |
| lifecycle/scaleDown/replace.tail       |    19429.36 |     917.70 |    20023.28 |     307.40 |   3.06% |         1.26% |           3.11 |                      |
| lifecycle/scaleDown/value.head         |      437.22 |      26.84 |      438.78 |      14.82 |   0.36% |        -2.08% |           6.43 |                      |
| lifecycle/scaleDown/value.random       |     1094.06 |      39.21 |     1087.44 |      24.76 |  -0.60% |         0.36% |           5.04 |                      |
| lifecycle/scaleDown/value.tail         |      238.35 |       7.95 |      235.06 |       1.86 |  -1.38% |        -1.30% |           2.49 |                      |
| lifecycle/fullLifecycle/apply.random   |     3643.16 |     275.61 |     3618.24 |     291.66 |  -0.68% |        -2.98% |          13.70 |                      |
| lifecycle/fullLifecycle/insert.head    |      821.09 |      41.18 |      907.33 |     115.47 |  10.50% |         9.45% |          16.09 |                      |
| lifecycle/fullLifecycle/insert.random  |     1743.95 |     161.75 |     1730.77 |      84.12 |  -0.76% |        -0.76% |           3.92 |                      |
| lifecycle/fullLifecycle/insert.tail    |      818.34 |     101.25 |      762.02 |      37.93 |  -6.88% |         2.32% |          11.29 |                      |
| lifecycle/fullLifecycle/remove.head    |     1879.66 |     245.50 |     1886.74 |     129.55 |   0.38% |         0.22% |          13.26 |                      |
| lifecycle/fullLifecycle/remove.random  |     2701.75 |     171.27 |     2898.42 |     230.38 |   7.28% |         2.59% |           7.28 |                      |
| lifecycle/fullLifecycle/remove.tail    |     1712.66 |      70.96 |     1818.66 |     812.84 |   6.19% |         4.59% |          44.47 |                      |
| lifecycle/fullLifecycle/replace.head   |     2570.54 |      65.85 |     2615.16 |     107.32 |   1.74% |         3.48% |           2.63 |                      |
| lifecycle/fullLifecycle/replace.random |     3615.70 |      78.07 |     3690.83 |     217.13 |   2.08% |        -0.81% |           1.78 |                      |
| lifecycle/fullLifecycle/replace.tail   |    11119.68 |     456.95 |    11211.74 |     205.00 |   0.83% |         0.83% |           1.90 |                      |
| lifecycle/fullLifecycle/value.head     |      387.68 |      10.22 |      378.59 |       4.98 |  -2.35% |        -2.88% |           2.91 |                      |
| lifecycle/fullLifecycle/value.random   |     1132.16 |       7.19 |     1129.56 |      14.68 |  -0.23% |        -1.17% |           3.13 |                      |
| lifecycle/fullLifecycle/value.tail     |      197.64 |      17.87 |      196.19 |       3.04 |  -0.73% |         0.44% |           8.03 |                      |
| checkpoint/up/1000/create              |   293500.00 |  219200.00 |   258600.00 |   12400.00 | -11.89% |       -12.95% |          38.57 |                      |
| checkpoint/up/1000/sequence            |  2689400.00 | 1240000.00 |  2019200.00 |   94300.00 | -24.92% |       -29.84% |          27.63 |                      |
| checkpoint/up/1000/values              |  1629100.00 |   13400.00 |  1623500.00 |   87800.00 |  -0.34% |         0.36% |           5.50 |                      |
| checkpoint/up/5000/create              |   832900.00 |  137900.00 |   848400.00 |   21000.00 |   1.86% |         2.16% |          17.53 |                      |
| checkpoint/up/5000/sequence            |  9472000.00 |  889000.00 |  7977300.00 | 1394900.00 | -15.78% |       -10.62% |           6.38 |                      |
| checkpoint/up/5000/values              |  4675400.00 |  157300.00 |  5580000.00 | 1602700.00 |  19.35% |         6.03% |          39.81 |                      |
| checkpoint/up/10000/create             |  1625700.00 |   86300.00 |  1523400.00 |  128600.00 |  -6.29% |        -3.83% |           8.03 |                      |
| checkpoint/up/10000/sequence           | 15799300.00 | 3805000.00 | 13367400.00 | 1143300.00 | -15.39% |       -16.26% |          10.62 |                      |
| checkpoint/up/10000/values             | 20431800.00 | 1855200.00 | 20145100.00 |  542700.00 |  -1.40% |        -2.60% |           8.74 |                      |
| checkpoint/up/15000/create             |  2386300.00 |   38400.00 |  2336500.00 |   48600.00 |  -2.09% |        -1.19% |           5.02 |                      |
| checkpoint/up/15000/sequence           | 16952600.00 |  797200.00 | 15123100.00 |  811700.00 | -10.79% |        -8.06% |           0.86 |                      |
| checkpoint/up/15000/values             | 29731700.00 | 2109800.00 | 30268400.00 |  335400.00 |   1.81% |         1.81% |           6.74 |                      |
| checkpoint/up/20000/create             |  3337900.00 |  352300.00 |  3386900.00 |  217300.00 |   1.47% |        -1.24% |           8.17 |                      |
| checkpoint/up/20000/sequence           | 25302800.00 | 1414400.00 | 22248800.00 | 1481600.00 | -12.07% |       -12.07% |          11.31 |                      |
| checkpoint/up/20000/values             | 10433800.00 |  732900.00 | 11711700.00 | 1267600.00 |  12.25% |        12.91% |           9.88 |                      |
| checkpoint/up/25000/create             |  3873100.00 |  167200.00 |  3965300.00 |  580900.00 |   2.38% |         3.23% |          11.08 |                      |
| checkpoint/up/25000/sequence           | 28701200.00 | 3464900.00 | 24693000.00 | 1166100.00 | -13.97% |       -13.10% |           6.84 |                      |
| checkpoint/up/25000/values             | 12131700.00 |  500500.00 | 12073000.00 | 1214200.00 |  -0.48% |        -3.07% |           2.87 |                      |
| checkpoint/down/20000/create           |  3516500.00 |  227600.00 |  3469600.00 |  178600.00 |  -1.33% |         1.03% |           4.66 |                      |
| checkpoint/down/20000/sequence         | 23585700.00 | 1345800.00 | 19259700.00 |  168500.00 | -18.34% |       -19.05% |           4.57 |                      |
| checkpoint/down/20000/values           |  9187700.00 |  619900.00 |  9277300.00 |  833700.00 |   0.98% |        -1.36% |          12.18 |                      |
| checkpoint/down/15000/create           |  2379800.00 |  152100.00 |  2403900.00 |  113500.00 |   1.01% |        -2.49% |           2.19 |                      |
| checkpoint/down/15000/sequence         | 19302700.00 | 1204500.00 | 15995600.00 |  801600.00 | -17.13% |       -15.52% |           9.35 |                      |
| checkpoint/down/15000/values           |  7368700.00 | 1036100.00 |  7285200.00 |  283200.00 |  -1.13% |        -4.10% |          11.11 |                      |
| checkpoint/down/10000/create           |  1616200.00 |    9300.00 |  1674100.00 |   19600.00 |   3.58% |         3.06% |           1.29 |                      |
| checkpoint/down/10000/sequence         | 15132100.00 |  445100.00 | 12698700.00 | 1246100.00 | -16.08% |       -16.08% |          11.56 |                      |
| checkpoint/down/10000/values           |  5505000.00 |  784300.00 |  5275100.00 |  315800.00 |  -4.18% |        -4.18% |           5.23 |                      |
| checkpoint/down/5000/create            |   768700.00 |   36400.00 |   767000.00 |   12100.00 |  -0.22% |        -3.18% |           5.42 |                      |
| checkpoint/down/5000/sequence          | 12604700.00 | 2503100.00 |  9465300.00 |  462000.00 | -24.91% |       -24.11% |          13.88 |                      |
| checkpoint/down/5000/values            |  2826300.00 |  302600.00 |  3002200.00 |  534400.00 |   6.22% |        -6.36% |          13.69 |                      |
| checkpoint/down/1000/create            |   153600.00 |   10800.00 |   156200.00 |    6800.00 |   1.69% |         4.76% |           5.49 |                      |
| checkpoint/down/1000/sequence          |  7784900.00 | 1974000.00 |  6058300.00 |  130200.00 | -22.18% |       -23.74% |          14.79 |                      |
| checkpoint/down/1000/values            |   597900.00 |   45700.00 |   584000.00 |   67900.00 |  -2.32% |        -1.42% |           6.62 |                      |
| checkpoint/down/0/create               |    15100.00 |   14500.00 |    17900.00 |    2200.00 |  18.54% |         5.19% |          46.18 |                      |
| checkpoint/down/0/sequence             |  1776000.00 | 1137700.00 |  1316500.00 |  394900.00 | -25.87% |       -32.56% |          20.72 |                      |
| checkpoint/down/0/values               |    12600.00 |    1200.00 |    11100.00 |    1900.00 | -11.90% |       -11.90% |          19.74 |                      |

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
| memory/up/10000/native                  |  3567240.00 |  3567256.00 |  0.00% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  4819568.00 |  4819576.00 |  0.00% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6317696.00 |  6317704.00 |  0.00% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  7541576.00 |  7541584.00 |  0.00% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  6597208.00 |  6597224.00 |  0.00% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  5747344.00 |  5747352.00 |  0.00% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  4721016.00 |  4721024.00 |  0.00% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3777480.00 |  3777488.00 |  0.00% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2719408.00 |  2719416.00 |  0.00% |
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
