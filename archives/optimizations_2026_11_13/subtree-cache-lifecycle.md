# subtree-cache-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: subtree-cache. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/subtree-cache-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    11399.66 |     185.05 |     3876.42 |     113.77 | -66.00% |       -65.96% |           0.97 |                      |
| lifecycle/scaleUp/insert.head          |      755.01 |      91.27 |      876.15 |      67.04 |  16.05% |        15.74% |           7.58 | yes                  |
| lifecycle/scaleUp/insert.random        |     5724.87 |     290.33 |     1664.59 |     129.11 | -70.92% |       -70.70% |           1.38 |                      |
| lifecycle/scaleUp/insert.tail          |      734.43 |     142.98 |      761.14 |      88.17 |   3.64% |        -1.15% |           4.90 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    10145.00 |     131.39 |     2518.75 |      41.39 | -75.17% |       -75.47% |           0.95 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2338.18 |     138.76 |     2503.08 |     321.41 |   7.05% |         5.95% |           7.84 |                      |
| lifecycle/scaleUp/replace.random       |    10879.64 |     201.26 |     3456.56 |     286.31 | -68.23% |       -67.86% |           2.85 |                      |
| lifecycle/scaleUp/replace.tail         |     2188.20 |     271.30 |     2368.54 |     130.21 |   8.24% |         4.51% |           8.12 |                      |
| lifecycle/scaleUp/value.head           |      329.38 |       1.07 |      296.74 |      27.48 |  -9.91% |       -10.00% |           7.09 |                      |
| lifecycle/scaleUp/value.random         |     8465.55 |      46.87 |      979.40 |      33.86 | -88.43% |       -88.47% |           0.77 |                      |
| lifecycle/scaleUp/value.tail           |      220.14 |       0.25 |      147.23 |       5.98 | -33.12% |       -33.55% |           3.10 |                      |
| lifecycle/scaleDown/apply.random       |    10001.44 |     256.90 |     3296.41 |      42.15 | -67.04% |       -66.98% |           0.74 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3399.10 |     232.24 |     1607.98 |      16.06 | -52.69% |       -53.10% |           2.38 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1830.45 |      18.05 |     1911.28 |     542.82 |   4.42% |         0.17% |           5.23 |                      |
| lifecycle/scaleDown/remove.random      |     5127.86 |     103.34 |     2470.88 |      62.52 | -51.81% |       -51.47% |           2.24 |                      |
| lifecycle/scaleDown/remove.tail        |     1952.32 |      37.59 |     1667.60 |      46.94 | -14.58% |       -13.10% |           2.33 |                      |
| lifecycle/scaleDown/replace.head       |     2394.29 |     110.05 |     2528.65 |     173.70 |   5.61% |         5.10% |           5.51 | yes                  |
| lifecycle/scaleDown/replace.random     |     5372.08 |     334.05 |     3349.58 |      50.30 | -37.65% |       -36.98% |           6.03 |                      |
| lifecycle/scaleDown/replace.tail       |    34907.41 |     433.81 |    17250.00 |     459.92 | -50.58% |       -50.26% |           1.39 |                      |
| lifecycle/scaleDown/value.head         |      456.95 |      15.40 |      385.11 |       8.10 | -15.72% |       -15.17% |           2.19 |                      |
| lifecycle/scaleDown/value.random       |     3269.70 |     120.19 |      915.60 |       3.39 | -72.00% |       -72.02% |           1.66 |                      |
| lifecycle/scaleDown/value.tail         |      266.42 |       8.62 |      219.75 |       6.38 | -17.52% |       -17.52% |           6.20 |                      |
| lifecycle/fullLifecycle/apply.random   |    10696.32 |     263.51 |     3585.77 |      40.45 | -66.48% |       -66.48% |           0.67 |                      |
| lifecycle/fullLifecycle/insert.head    |      755.01 |      91.27 |      876.15 |      67.04 |  16.05% |        15.74% |           7.58 | yes                  |
| lifecycle/fullLifecycle/insert.random  |     4663.52 |       3.15 |     1647.78 |      53.76 | -64.67% |       -64.66% |           1.58 |                      |
| lifecycle/fullLifecycle/insert.tail    |      734.43 |     142.98 |      761.14 |      88.17 |   3.64% |        -1.15% |           4.90 |                      |
| lifecycle/fullLifecycle/remove.head    |     1830.45 |      18.05 |     1911.28 |     542.82 |   4.42% |         0.17% |           5.23 |                      |
| lifecycle/fullLifecycle/remove.random  |     7697.34 |     147.57 |     2469.11 |     106.42 | -67.92% |       -67.06% |           0.76 |                      |
| lifecycle/fullLifecycle/remove.tail    |     1952.32 |      37.59 |     1667.60 |      46.94 | -14.58% |       -13.10% |           2.33 |                      |
| lifecycle/fullLifecycle/replace.head   |     2349.78 |     146.15 |     2591.37 |     132.16 |  10.28% |         6.95% |           8.04 |                      |
| lifecycle/fullLifecycle/replace.random |     8197.70 |      71.05 |     3362.59 |     188.49 | -58.98% |       -58.81% |           1.39 |                      |
| lifecycle/fullLifecycle/replace.tail   |    18528.16 |     332.91 |     9809.27 |     160.14 | -47.06% |       -46.51% |           1.56 |                      |
| lifecycle/fullLifecycle/value.head     |      393.33 |       6.04 |      344.15 |       9.50 | -12.50% |       -12.50% |           4.55 |                      |
| lifecycle/fullLifecycle/value.random   |     5867.62 |     112.51 |      947.50 |       6.95 | -83.85% |       -84.08% |           0.48 |                      |
| lifecycle/fullLifecycle/value.tail     |      243.28 |       4.62 |      185.83 |       3.53 | -23.61% |       -23.90% |           3.03 |                      |
| checkpoint/up/1000/create              |   326300.00 |   70400.00 |   240200.00 |   27900.00 | -26.39% |       -32.45% |          13.28 |                      |
| checkpoint/up/1000/sequence            |  2513000.00 |  248800.00 |  2405900.00 |  445900.00 |  -4.26% |        -0.18% |          30.90 |                      |
| checkpoint/up/1000/values              |  1611000.00 |  190700.00 |  1705900.00 |  186500.00 |   5.89% |        -0.53% |          20.53 |                      |
| checkpoint/up/5000/create              |   966600.00 |   10700.00 |   857600.00 |   37000.00 | -11.28% |       -10.90% |           4.78 |                      |
| checkpoint/up/5000/sequence            |  8813700.00 |  368100.00 |  9050200.00 |  597700.00 |   2.68% |         0.06% |           9.45 |                      |
| checkpoint/up/5000/values              |  4999000.00 |  370500.00 |  4989100.00 |  544500.00 |  -0.20% |         0.80% |           2.07 |                      |
| checkpoint/up/10000/create             |  1440500.00 |   96800.00 |  1418900.00 |   35200.00 |  -1.50% |         2.92% |           7.27 |                      |
| checkpoint/up/10000/sequence           | 14527700.00 |  900600.00 | 14424400.00 | 1623600.00 |  -0.71% |         0.40% |          16.70 |                      |
| checkpoint/up/10000/values             | 20707000.00 |  410800.00 | 20175700.00 |  249900.00 |  -2.57% |        -2.57% |           2.25 |                      |
| checkpoint/up/15000/create             |  2202300.00 |   52700.00 |  2329200.00 |   75200.00 |   5.76% |         3.38% |           4.94 |                      |
| checkpoint/up/15000/sequence           | 15521400.00 |  812000.00 | 15677000.00 |  923000.00 |   1.00% |         1.00% |           6.53 |                      |
| checkpoint/up/15000/values             | 30514400.00 | 1392600.00 | 30454400.00 | 4241400.00 |  -0.20% |        -0.20% |          12.55 |                      |
| checkpoint/up/20000/create             |  3206600.00 |   69900.00 |  3290200.00 |  174500.00 |   2.61% |         0.22% |           6.80 |                      |
| checkpoint/up/20000/sequence           | 21980300.00 | 1138500.00 | 23354800.00 | 3823800.00 |   6.25% |         6.25% |          16.41 |                      |
| checkpoint/up/20000/values             | 12399300.00 |  329200.00 | 12643300.00 | 1289800.00 |   1.97% |         6.00% |          11.76 |                      |
| checkpoint/up/25000/create             |  3886900.00 |  160900.00 |  3871500.00 |  144500.00 |  -0.40% |         0.85% |           5.38 |                      |
| checkpoint/up/25000/sequence           | 24746200.00 | 1347000.00 | 24028800.00 |  580300.00 |  -2.90% |        -3.12% |           6.54 |                      |
| checkpoint/up/25000/values             | 12300500.00 |  427500.00 | 12736000.00 |  782900.00 |   3.54% |         0.16% |           1.20 |                      |
| checkpoint/down/20000/create           |  3254400.00 |  141600.00 |  3281400.00 |   96600.00 |   0.83% |         0.23% |           2.26 |                      |
| checkpoint/down/20000/sequence         | 20347900.00 |  713000.00 | 20479500.00 | 2643200.00 |   0.65% |         0.65% |          11.07 |                      |
| checkpoint/down/20000/values           | 10025800.00 |  279500.00 | 10091800.00 | 1144800.00 |   0.66% |         2.22% |          10.02 |                      |
| checkpoint/down/15000/create           |  2318100.00 |  145600.00 |  2330500.00 |   69800.00 |   0.53% |        -1.48% |           4.48 |                      |
| checkpoint/down/15000/sequence         | 17143000.00 |  770400.00 | 17269000.00 |  610600.00 |   0.73% |         0.75% |           5.50 |                      |
| checkpoint/down/15000/values           |  8251100.00 |  287500.00 |  8246000.00 |  424700.00 |  -0.06% |        -1.69% |           7.89 |                      |
| checkpoint/down/10000/create           |  1575200.00 |    9300.00 |  1615200.00 |   89400.00 |   2.54% |         3.01% |           6.28 | yes                  |
| checkpoint/down/10000/sequence         | 13899300.00 |  329400.00 | 14143500.00 |  790600.00 |   1.76% |         3.51% |           6.21 |                      |
| checkpoint/down/10000/values           |  5938100.00 |  184200.00 |  5810600.00 |  107700.00 |  -2.15% |        -2.15% |          10.20 |                      |
| checkpoint/down/5000/create            |   764100.00 |   32100.00 |   736500.00 |    2300.00 |  -3.61% |        -3.10% |           0.98 |                      |
| checkpoint/down/5000/sequence          | 12309400.00 | 2101700.00 | 10576400.00 |  405100.00 | -14.08% |       -15.36% |          11.38 |                      |
| checkpoint/down/5000/values            |  3471500.00 |  209700.00 |  3220400.00 |  105200.00 |  -7.23% |        -8.80% |           9.00 |                      |
| checkpoint/down/1000/create            |   143400.00 |   20800.00 |   145000.00 |   21600.00 |   1.12% |        -0.37% |          12.63 |                      |
| checkpoint/down/1000/sequence          |  6863000.00 |  259700.00 |  6829200.00 |  633700.00 |  -0.49% |        -0.49% |          13.03 |                      |
| checkpoint/down/1000/values            |   591800.00 |   31200.00 |   678600.00 |  112100.00 |  14.67% |        20.26% |          14.32 |                      |
| checkpoint/down/0/create               |    17000.00 |    2100.00 |    13600.00 |    1500.00 | -20.00% |       -13.53% |           6.45 |                      |
| checkpoint/down/0/sequence             |  1586400.00 |  231000.00 |  1493900.00 |  141500.00 |  -5.83% |        -6.74% |           7.75 |                      |
| checkpoint/down/0/values               |    11700.00 |    1700.00 |    10700.00 |     800.00 |  -8.55% |        -8.55% |           6.44 |                      |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |      Before |       After | Change |
| :-------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                   |   509304.00 |   487888.00 | -4.20% |
| memory/up/1000/js                       |   407560.00 |   407560.00 |  0.00% |
| storage/up/1000/jsonBytes               |   278238.00 |   278238.00 |  0.00% |
| storage/up/1000/jsonGzipBytes           |    14908.00 |    14908.00 |  0.00% |
| storage/up/1000/messagePackBytes        |   165784.00 |   165784.00 |  0.00% |
| storage/up/1000/messagePackGzipBytes    |    12641.00 |    12641.00 |  0.00% |
| memory/up/5000/native                   |  2304144.00 |  2194520.00 | -4.76% |
| memory/up/5000/js                       |  2059744.00 |  2059744.00 |  0.00% |
| storage/up/5000/jsonBytes               |  1662776.00 |  1662776.00 |  0.00% |
| storage/up/5000/jsonGzipBytes           |    75146.00 |    75146.00 |  0.00% |
| storage/up/5000/messagePackBytes        |   839612.00 |   839612.00 |  0.00% |
| storage/up/5000/messagePackGzipBytes    |    63127.00 |    63127.00 |  0.00% |
| memory/up/10000/native                  |  3862440.00 |  3643184.00 | -5.68% |
| memory/up/10000/js                      |  4124208.00 |  4124208.00 |  0.00% |
| storage/up/10000/jsonBytes              |  3340135.00 |  3340135.00 |  0.00% |
| storage/up/10000/jsonGzipBytes          |   152232.00 |   152232.00 |  0.00% |
| storage/up/10000/messagePackBytes       |  1687602.00 |  1687602.00 |  0.00% |
| storage/up/10000/messagePackGzipBytes   |   127808.00 |   127808.00 |  0.00% |
| memory/up/15000/native                  |  5274768.00 |  4935512.00 | -6.43% |
| memory/up/15000/js                      |  6196128.00 |  6196128.00 |  0.00% |
| storage/up/15000/jsonBytes              |  5053159.00 |  5053159.00 |  0.00% |
| storage/up/15000/jsonGzipBytes          |   231369.00 |   231369.00 |  0.00% |
| storage/up/15000/messagePackBytes       |  3635106.00 |  3635106.00 |  0.00% |
| storage/up/15000/messagePackGzipBytes   |   204824.00 |   204824.00 |  0.00% |
| memory/up/20000/native                  |  6908040.00 |  6469536.00 | -6.35% |
| memory/up/20000/js                      |  8250064.00 |  8250064.00 |  0.00% |
| storage/up/20000/jsonBytes              |  7278683.00 |  7278683.00 |  0.00% |
| storage/up/20000/jsonGzipBytes          |   318634.00 |   318634.00 |  0.00% |
| storage/up/20000/messagePackBytes       |  5249308.00 |  5249308.00 |  0.00% |
| storage/up/20000/messagePackGzipBytes   |   269890.00 |   269890.00 |  0.00% |
| memory/up/25000/native                  |  8291920.00 |  7733416.00 | -6.74% |
| memory/up/25000/js                      | 10328360.00 | 10328360.00 |  0.00% |
| storage/up/25000/jsonBytes              |  9500463.00 |  9500463.00 |  0.00% |
| storage/up/25000/jsonGzipBytes          |   402015.00 |   402015.00 |  0.00% |
| storage/up/25000/messagePackBytes       |  6711789.00 |  6711789.00 |  0.00% |
| storage/up/25000/messagePackGzipBytes   |   343336.00 |   343336.00 |  0.00% |
| memory/down/20000/native                |  7187552.00 |  6749048.00 | -6.10% |
| memory/down/20000/js                    |  8267264.00 |  8267264.00 |  0.00% |
| storage/down/20000/jsonBytes            |  7760743.00 |  7760743.00 |  0.00% |
| storage/down/20000/jsonGzipBytes        |   334475.00 |   334475.00 |  0.00% |
| storage/down/20000/messagePackBytes     |  5444111.00 |  5444111.00 |  0.00% |
| storage/down/20000/messagePackGzipBytes |   284870.00 |   284870.00 |  0.00% |
| memory/down/15000/native                |  6202528.00 |  5863296.00 | -5.47% |
| memory/down/15000/js                    |  6212288.00 |  6212288.00 |  0.00% |
| storage/down/15000/jsonBytes            |  5878783.00 |  5878783.00 |  0.00% |
| storage/down/15000/jsonGzipBytes        |   253153.00 |   253153.00 |  0.00% |
| storage/down/15000/messagePackBytes     |  4110000.00 |  4110000.00 |  0.00% |
| storage/down/15000/messagePackGzipBytes |   214870.00 |   214870.00 |  0.00% |
| memory/down/10000/native                |  5016200.00 |  4796968.00 | -4.37% |
| memory/down/10000/js                    |  4155848.00 |  4155848.00 |  0.00% |
| storage/down/10000/jsonBytes            |  3941927.00 |  3941927.00 |  0.00% |
| storage/down/10000/jsonGzipBytes        |   168770.00 |   168770.00 |  0.00% |
| storage/down/10000/messagePackBytes     |  2750169.00 |  2750169.00 |  0.00% |
| storage/down/10000/messagePackGzipBytes |   143189.00 |   143189.00 |  0.00% |
| memory/down/5000/native                 |  3925088.00 |  3815480.00 | -2.79% |
| memory/down/5000/js                     |  2066312.00 |  2066312.00 |  0.00% |
| storage/down/5000/jsonBytes             |  1950486.00 |  1950486.00 |  0.00% |
| storage/down/5000/jsonGzipBytes         |    81724.00 |    81724.00 |  0.00% |
| storage/down/5000/messagePackBytes      |  1363171.00 |  1363171.00 |  0.00% |
| storage/down/5000/messagePackGzipBytes  |    69494.00 |    69494.00 |  0.00% |
| memory/down/1000/native                 |  2748336.00 |  2726944.00 | -0.78% |
| memory/down/1000/js                     |   413360.00 |   413360.00 |  0.00% |
| storage/down/1000/jsonBytes             |   386836.00 |   386836.00 |  0.00% |
| storage/down/1000/jsonGzipBytes         |    16336.00 |    16336.00 |  0.00% |
| storage/down/1000/messagePackBytes      |   271220.00 |   271220.00 |  0.00% |
| storage/down/1000/messagePackGzipBytes  |    13932.00 |    13932.00 |  0.00% |
| memory/down/0/native                    |  1598048.00 |  1598056.00 |  0.00% |
| memory/down/0/js                        |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonBytes                |       16.00 |       16.00 |  0.00% |
| storage/down/0/jsonGzipBytes            |       32.00 |       32.00 |  0.00% |
| storage/down/0/messagePackBytes         |        8.00 |        8.00 |  0.00% |
| storage/down/0/messagePackGzipBytes     |       28.00 |       28.00 |  0.00% |
