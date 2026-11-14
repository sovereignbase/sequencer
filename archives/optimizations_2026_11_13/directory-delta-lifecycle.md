# directory-delta-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: directory-delta. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/directory-delta-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    13347.87 |    1520.10 |     3939.26 |     182.10 | -70.49% |       -70.48% |           2.14 |                      |
| lifecycle/scaleUp/insert.head          |      835.36 |      26.45 |      948.72 |      59.95 |  13.57% |        11.49% |           4.55 | yes                  |
| lifecycle/scaleUp/insert.random        |     6452.34 |     148.20 |     1842.70 |      79.14 | -71.44% |       -71.77% |           1.30 |                      |
| lifecycle/scaleUp/insert.tail          |      809.58 |     138.45 |      855.32 |     117.32 |   5.65% |         3.90% |           2.26 | yes                  |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11357.62 |     149.89 |     2959.69 |     187.60 | -73.94% |       -74.18% |           0.75 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2646.79 |      34.43 |     2701.76 |      41.57 |   2.08% |         1.51% |           1.12 | yes                  |
| lifecycle/scaleUp/replace.random       |    12169.39 |     359.28 |     3802.75 |     265.05 | -68.75% |       -68.42% |           1.37 |                      |
| lifecycle/scaleUp/replace.tail         |     2473.80 |     187.08 |     2552.14 |      56.04 |   3.17% |         8.30% |           8.09 |                      |
| lifecycle/scaleUp/value.head           |      367.41 |      11.25 |      297.82 |      17.71 | -18.94% |       -18.68% |           3.27 |                      |
| lifecycle/scaleUp/value.random         |     9438.67 |     489.19 |     1155.41 |      35.37 | -87.76% |       -88.03% |           0.35 |                      |
| lifecycle/scaleUp/value.tail           |      234.20 |       5.60 |      155.58 |       5.92 | -33.57% |       -32.05% |           3.80 |                      |
| lifecycle/scaleDown/apply.random       |    11101.57 |     138.87 |     3787.94 |     168.84 | -65.88% |       -66.16% |           1.74 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3836.76 |     324.03 |     1910.06 |      24.80 | -50.22% |       -50.09% |           2.50 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1947.32 |     136.88 |     2010.96 |     291.64 |   3.27% |         4.46% |          12.88 |                      |
| lifecycle/scaleDown/remove.random      |     5826.26 |      93.47 |     2829.88 |      49.35 | -51.43% |       -50.74% |           3.88 |                      |
| lifecycle/scaleDown/remove.tail        |     2129.78 |      92.05 |     1859.85 |     134.91 | -12.67% |       -12.91% |           3.86 |                      |
| lifecycle/scaleDown/replace.head       |     2576.12 |     181.44 |     2935.59 |     323.48 |  13.95% |        14.44% |           9.52 |                      |
| lifecycle/scaleDown/replace.random     |     6009.00 |     299.99 |     3849.58 |     436.81 | -35.94% |       -36.69% |           8.44 |                      |
| lifecycle/scaleDown/replace.tail       |    40782.81 |    4857.09 |    32238.12 |    1188.00 | -20.95% |       -23.77% |           5.95 |                      |
| lifecycle/scaleDown/value.head         |      489.78 |      27.44 |      443.44 |      10.25 |  -9.46% |       -12.67% |           4.39 |                      |
| lifecycle/scaleDown/value.random       |     3678.24 |      86.71 |     1108.30 |      19.40 | -69.87% |       -69.87% |           1.47 |                      |
| lifecycle/scaleDown/value.tail         |      286.03 |      10.13 |      238.72 |       8.43 | -16.54% |       -15.78% |           3.47 |                      |
| lifecycle/fullLifecycle/apply.random   |    12201.58 |     713.79 |     3863.60 |     188.88 | -68.34% |       -69.01% |           1.55 |                      |
| lifecycle/fullLifecycle/insert.head    |      835.36 |      26.45 |      948.72 |      59.95 |  13.57% |        11.49% |           4.55 | yes                  |
| lifecycle/fullLifecycle/insert.random  |     5213.90 |     240.63 |     1866.32 |      48.40 | -64.20% |       -63.51% |           1.62 |                      |
| lifecycle/fullLifecycle/insert.tail    |      809.58 |     138.45 |      855.32 |     117.32 |   5.65% |         3.90% |           2.26 | yes                  |
| lifecycle/fullLifecycle/remove.head    |     1947.32 |     136.88 |     2010.96 |     291.64 |   3.27% |         4.46% |          12.88 |                      |
| lifecycle/fullLifecycle/remove.random  |     8626.37 |     172.90 |     2966.48 |      62.54 | -65.61% |       -66.30% |           1.61 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2129.78 |      92.05 |     1859.85 |     134.91 | -12.67% |       -12.91% |           3.86 |                      |
| lifecycle/fullLifecycle/replace.head   |     2618.82 |      93.58 |     2901.34 |     128.42 |  10.79% |         8.29% |           6.52 |                      |
| lifecycle/fullLifecycle/replace.random |     9136.57 |     268.50 |     3826.17 |      44.44 | -58.12% |       -58.29% |           2.65 |                      |
| lifecycle/fullLifecycle/replace.tail   |    21656.94 |    2214.05 |    17388.33 |     410.33 | -19.71% |       -22.51% |           5.91 |                      |
| lifecycle/fullLifecycle/value.head     |      426.35 |      21.75 |      370.63 |      14.85 | -13.07% |       -13.93% |           4.79 |                      |
| lifecycle/fullLifecycle/value.random   |     6590.95 |     274.42 |     1136.94 |      28.41 | -82.75% |       -83.09% |           0.39 |                      |
| lifecycle/fullLifecycle/value.tail     |      260.11 |       7.86 |      198.20 |       6.12 | -23.80% |       -22.80% |           4.25 |                      |
| checkpoint/up/1000/create              |   336300.00 |  182100.00 |   252200.00 |   12800.00 | -25.01% |       -25.01% |          18.08 |                      |
| checkpoint/up/1000/sequence            |  2744900.00 |   56800.00 |  2614300.00 |   69300.00 |  -4.76% |        -4.52% |           1.14 |                      |
| checkpoint/up/1000/values              |  1570500.00 |  136800.00 |  1633100.00 |   37000.00 |   3.99% |         1.61% |           9.92 |                      |
| checkpoint/up/5000/create              |   989400.00 |   41500.00 |   872400.00 |   20500.00 | -11.83% |        -6.95% |           8.75 |                      |
| checkpoint/up/5000/sequence            |  8978600.00 |  299600.00 |  9202600.00 | 1184600.00 |   2.49% |         4.48% |          12.46 |                      |
| checkpoint/up/5000/values              |  5425800.00 |  630600.00 |  5350600.00 | 1180100.00 |  -1.39% |        -3.81% |           8.30 |                      |
| checkpoint/up/10000/create             |  1491700.00 |   47400.00 |  1455900.00 |   43600.00 |  -2.40% |        -4.15% |           3.37 |                      |
| checkpoint/up/10000/sequence           | 15093400.00 |  914300.00 | 15893000.00 |  398400.00 |   5.30% |         0.46% |           6.27 |                      |
| checkpoint/up/10000/values             | 21471600.00 | 1199800.00 | 21269700.00 |  216000.00 |  -0.94% |        -1.62% |           5.88 |                      |
| checkpoint/up/15000/create             |  2324800.00 |  180600.00 |  2378300.00 |   37700.00 |   2.30% |         2.30% |           6.68 |                      |
| checkpoint/up/15000/sequence           | 17411500.00 | 4671600.00 | 17437400.00 | 1809400.00 |   0.15% |         1.69% |          16.50 |                      |
| checkpoint/up/15000/values             | 31141400.00 | 1476900.00 | 32034500.00 |  683000.00 |   2.87% |         2.87% |           6.74 |                      |
| checkpoint/up/20000/create             |  3419700.00 |   81600.00 |  3322700.00 |   28300.00 |  -2.84% |        -2.84% |           0.64 |                      |
| checkpoint/up/20000/sequence           | 25177100.00 | 3772100.00 | 25310600.00 | 2118300.00 |   0.53% |         0.66% |          18.82 |                      |
| checkpoint/up/20000/values             | 13505800.00 | 1851000.00 | 13356200.00 |  626900.00 |  -1.11% |        -7.71% |           9.13 |                      |
| checkpoint/up/25000/create             |  4091600.00 |   29200.00 |  3987200.00 |  133000.00 |  -2.55% |        -2.09% |           3.87 |                      |
| checkpoint/up/25000/sequence           | 28400100.00 | 1069200.00 | 27378700.00 | 1577200.00 |  -3.60% |        -1.87% |           2.06 |                      |
| checkpoint/up/25000/values             | 13962700.00 |  456900.00 | 14059900.00 |  508400.00 |   0.70% |         0.10% |           5.36 |                      |
| checkpoint/down/20000/create           |  3458900.00 |  158400.00 |  3426900.00 |  169500.00 |  -0.93% |         1.13% |           8.32 |                      |
| checkpoint/down/20000/sequence         | 22123300.00 | 1078500.00 | 23041500.00 | 1437900.00 |   4.15% |         2.34% |          12.12 |                      |
| checkpoint/down/20000/values           | 10951900.00 |  556600.00 | 10621900.00 |  513600.00 |  -3.01% |        -2.66% |           9.27 |                      |
| checkpoint/down/15000/create           |  2454400.00 |  195300.00 |  2450800.00 |  148100.00 |  -0.15% |        -4.32% |           3.31 |                      |
| checkpoint/down/15000/sequence         | 19223200.00 |  650500.00 | 19243700.00 | 2779000.00 |   0.11% |         0.11% |          19.02 |                      |
| checkpoint/down/15000/values           |  7945500.00 |  129700.00 |  9190700.00 |  965700.00 |  15.67% |        15.67% |           7.09 | yes                  |
| checkpoint/down/10000/create           |  1762700.00 |   64600.00 |  1629300.00 |   30600.00 |  -7.57% |        -5.60% |           7.70 |                      |
| checkpoint/down/10000/sequence         | 17215700.00 | 5139100.00 | 16237800.00 | 2539200.00 |  -5.68% |         1.88% |           9.48 |                      |
| checkpoint/down/10000/values           |  6754400.00 | 1283900.00 |  7022600.00 | 2939000.00 |   3.97% |         6.53% |          35.49 |                      |
| checkpoint/down/5000/create            |   804700.00 |   56800.00 |   779600.00 |   55500.00 |  -3.12% |        -2.28% |           6.81 |                      |
| checkpoint/down/5000/sequence          | 11429600.00 | 2820400.00 | 12173800.00 |  955000.00 |   6.51% |        -1.56% |          19.85 |                      |
| checkpoint/down/5000/values            |  4191100.00 |  685600.00 |  3732100.00 | 1352100.00 | -10.95% |        -8.77% |          27.36 |                      |
| checkpoint/down/1000/create            |   148100.00 |    4000.00 |   168300.00 |   88900.00 |  13.64% |         6.65% |          62.02 | yes                  |
| checkpoint/down/1000/sequence          |  7444100.00 |  240200.00 |  7673700.00 |  867700.00 |   3.08% |        -3.82% |          19.13 |                      |
| checkpoint/down/1000/values            |   610600.00 |   30900.00 |   654500.00 |  116800.00 |   7.19% |        -1.54% |          24.26 |                      |
| checkpoint/down/0/create               |    19100.00 |   14300.00 |    16800.00 |    5000.00 | -12.04% |       -27.23% |          34.60 |                      |
| checkpoint/down/0/sequence             |  1628300.00 |   73600.00 |  1625400.00 |   93500.00 |  -0.18% |        -4.60% |          33.71 |                      |
| checkpoint/down/0/values               |    11900.00 |    2000.00 |    10700.00 |     200.00 | -10.08% |       -10.08% |          24.15 |                      |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |      Before |       After | Change |
| :-------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                   |   509304.00 |   479880.00 | -5.78% |
| memory/up/1000/js                       |   407560.00 |   407560.00 |  0.00% |
| storage/up/1000/jsonBytes               |   278238.00 |   278238.00 |  0.00% |
| storage/up/1000/jsonGzipBytes           |    14908.00 |    14908.00 |  0.00% |
| storage/up/1000/messagePackBytes        |   165784.00 |   165784.00 |  0.00% |
| storage/up/1000/messagePackGzipBytes    |    12641.00 |    12641.00 |  0.00% |
| memory/up/5000/native                   |  2304144.00 |  2154504.00 | -6.49% |
| memory/up/5000/js                       |  2059744.00 |  2059744.00 |  0.00% |
| storage/up/5000/jsonBytes               |  1662776.00 |  1662776.00 |  0.00% |
| storage/up/5000/jsonGzipBytes           |    75146.00 |    75146.00 |  0.00% |
| storage/up/5000/messagePackBytes        |   839612.00 |   839612.00 |  0.00% |
| storage/up/5000/messagePackGzipBytes    |    63127.00 |    63127.00 |  0.00% |
| memory/up/10000/native                  |  3862440.00 |  3563168.00 | -7.75% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  5274768.00 |  4815496.00 | -8.71% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6908040.00 |  6309528.00 | -8.66% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  8291920.00 |  7533408.00 | -9.15% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  7187552.00 |  6589048.00 | -8.33% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  6202528.00 |  5743264.00 | -7.40% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  5016200.00 |  4716944.00 | -5.97% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3925088.00 |  3775456.00 | -3.81% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2748336.00 |  2718920.00 | -1.07% |
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
