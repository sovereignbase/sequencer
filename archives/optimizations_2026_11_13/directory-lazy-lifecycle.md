# directory-lazy-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: directory-lazy. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/directory-lazy-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    13002.17 |      68.80 |     4051.94 |      40.24 | -68.84% |       -68.92% |           1.12 |                      |
| lifecycle/scaleUp/insert.head          |      821.25 |      52.16 |      815.36 |      31.54 |  -0.72% |        -3.91% |           9.40 |                      |
| lifecycle/scaleUp/insert.random        |     6409.16 |      84.15 |     1797.54 |      63.92 | -71.95% |       -72.26% |           1.40 |                      |
| lifecycle/scaleUp/insert.tail          |      820.28 |     117.53 |      735.76 |     178.17 | -10.30% |        -9.97% |           4.42 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11378.13 |     187.56 |     2755.96 |     705.88 | -75.78% |       -75.54% |           6.00 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2830.97 |     392.36 |     2502.21 |      97.18 | -11.61% |        -7.18% |          11.92 |                      |
| lifecycle/scaleUp/replace.random       |    11974.14 |     139.01 |     3618.84 |     219.88 | -69.78% |       -69.79% |           1.25 |                      |
| lifecycle/scaleUp/replace.tail         |     2536.15 |     285.11 |     2370.65 |     350.72 |  -6.53% |         2.64% |          20.49 |                      |
| lifecycle/scaleUp/value.head           |      366.94 |      11.70 |      315.09 |      53.45 | -14.13% |       -13.22% |          15.83 |                      |
| lifecycle/scaleUp/value.random         |     9487.64 |     247.80 |     1160.46 |       7.94 | -87.77% |       -87.84% |           0.29 |                      |
| lifecycle/scaleUp/value.tail           |      234.82 |       7.54 |      151.63 |       5.04 | -35.43% |       -34.41% |           1.72 |                      |
| lifecycle/scaleDown/apply.random       |    11539.39 |     407.28 |     3582.31 |     280.30 | -68.96% |       -68.89% |           1.26 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3980.23 |     106.45 |     1804.43 |     131.01 | -54.67% |       -55.49% |           2.94 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1983.18 |     361.92 |     1956.63 |     145.70 |  -1.34% |        -0.88% |           7.30 |                      |
| lifecycle/scaleDown/remove.random      |     5969.37 |     112.54 |     2778.66 |     306.80 | -53.45% |       -53.45% |           4.19 |                      |
| lifecycle/scaleDown/remove.tail        |     2125.66 |     380.42 |     1782.87 |     130.35 | -16.13% |       -21.94% |           8.49 |                      |
| lifecycle/scaleDown/replace.head       |     2606.69 |     316.07 |     2669.76 |      58.59 |   2.42% |        -3.60% |           9.33 |                      |
| lifecycle/scaleDown/replace.random     |     6209.64 |     153.20 |     3602.51 |      59.98 | -41.99% |       -42.30% |           3.47 |                      |
| lifecycle/scaleDown/replace.tail       |    40491.34 |     828.28 |    20100.53 |     755.83 | -50.36% |       -50.36% |           2.87 |                      |
| lifecycle/scaleDown/value.head         |      502.38 |       4.04 |      419.09 |      14.54 | -16.58% |       -16.19% |           4.15 |                      |
| lifecycle/scaleDown/value.random       |     3823.67 |      64.24 |     1088.90 |      64.74 | -71.52% |       -70.76% |           2.07 |                      |
| lifecycle/scaleDown/value.tail         |      292.16 |       4.80 |      234.96 |      16.64 | -19.58% |       -18.26% |           6.63 |                      |
| lifecycle/fullLifecycle/apply.random   |    12461.84 |     407.21 |     3776.78 |     101.96 | -69.69% |       -68.80% |           0.86 |                      |
| lifecycle/fullLifecycle/insert.head    |      821.25 |      52.16 |      815.36 |      31.54 |  -0.72% |        -3.91% |           9.40 |                      |
| lifecycle/fullLifecycle/insert.random  |     5193.23 |      85.85 |     1801.06 |      97.38 | -65.32% |       -66.32% |           1.60 |                      |
| lifecycle/fullLifecycle/insert.tail    |      820.28 |     117.53 |      735.76 |     178.17 | -10.30% |        -9.97% |           4.42 |                      |
| lifecycle/fullLifecycle/remove.head    |     1983.18 |     361.92 |     1956.63 |     145.70 |  -1.34% |        -0.88% |           7.30 |                      |
| lifecycle/fullLifecycle/remove.random  |     8673.75 |      43.22 |     2876.45 |     195.05 | -66.84% |       -67.00% |           1.98 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2125.66 |     380.42 |     1782.87 |     130.35 | -16.13% |       -21.94% |           8.49 |                      |
| lifecycle/fullLifecycle/replace.head   |     2810.44 |      69.09 |     2595.54 |      30.57 |  -7.65% |        -6.92% |           4.49 |                      |
| lifecycle/fullLifecycle/replace.random |     9094.71 |     171.16 |     3613.67 |     157.80 | -60.27% |       -60.27% |           1.64 |                      |
| lifecycle/fullLifecycle/replace.tail   |    21414.55 |     394.81 |    11389.29 |     140.22 | -46.82% |       -46.67% |           1.61 |                      |
| lifecycle/fullLifecycle/value.head     |      437.60 |       3.08 |      370.91 |      16.19 | -15.24% |       -12.77% |           4.29 |                      |
| lifecycle/fullLifecycle/value.random   |     6614.41 |     139.00 |     1124.68 |      39.07 | -83.00% |       -83.00% |           0.17 |                      |
| lifecycle/fullLifecycle/value.tail     |      263.37 |       0.41 |      192.49 |       8.20 | -26.91% |       -26.95% |           4.90 |                      |
| checkpoint/up/1000/create              |   351500.00 |  113200.00 |   259800.00 |  127300.00 | -26.09% |        -9.80% |           9.20 |                      |
| checkpoint/up/1000/sequence            |  2523900.00 |  696800.00 |  2769700.00 | 1134500.00 |   9.74% |         9.74% |          14.18 |                      |
| checkpoint/up/1000/values              |  1739000.00 |   91000.00 |  1729500.00 |  287700.00 |  -0.55% |        -4.57% |          21.80 |                      |
| checkpoint/up/5000/create              |  1020300.00 |   44800.00 |   850100.00 |   30000.00 | -16.68% |       -16.11% |           9.80 |                      |
| checkpoint/up/5000/sequence            |  9931800.00 |  633300.00 |  9483200.00 |  980500.00 |  -4.52% |        -1.98% |           3.46 |                      |
| checkpoint/up/5000/values              |  4956200.00 |  421900.00 |  5533700.00 |  699200.00 |  11.65% |        18.43% |          17.64 |                      |
| checkpoint/up/10000/create             |  1541400.00 |  102500.00 |  1552800.00 |   76300.00 |   0.74% |         7.92% |           9.12 |                      |
| checkpoint/up/10000/sequence           | 15379200.00 | 1088600.00 | 16519100.00 |  218900.00 |   7.41% |         7.17% |          10.39 |                      |
| checkpoint/up/10000/values             | 20839000.00 |  723500.00 | 21089000.00 |  979200.00 |   1.20% |         1.20% |           1.64 |                      |
| checkpoint/up/15000/create             |  2277500.00 |   48500.00 |  2379700.00 |  169900.00 |   4.49% |         6.39% |           7.35 |                      |
| checkpoint/up/15000/sequence           | 16592800.00 | 1311100.00 | 17637300.00 |  414700.00 |   6.29% |         6.23% |           9.52 |                      |
| checkpoint/up/15000/values             | 30935500.00 | 1050100.00 | 31058200.00 |  895000.00 |   0.40% |         0.40% |           1.09 |                      |
| checkpoint/up/20000/create             |  3361100.00 |   12000.00 |  3324200.00 |   83700.00 |  -1.10% |         0.60% |           3.27 |                      |
| checkpoint/up/20000/sequence           | 25765700.00 |  592300.00 | 26707900.00 | 1130600.00 |   3.66% |         4.26% |           9.38 |                      |
| checkpoint/up/20000/values             | 13191300.00 |  809000.00 | 13559800.00 |  379400.00 |   2.79% |        -2.48% |           6.24 |                      |
| checkpoint/up/25000/create             |  3956600.00 |   31400.00 |  3920800.00 |  423200.00 |  -0.90% |        -0.20% |          12.74 |                      |
| checkpoint/up/25000/sequence           | 27936100.00 | 4212800.00 | 27054400.00 |  167000.00 |  -3.16% |        -4.97% |          13.63 |                      |
| checkpoint/up/25000/values             | 13719800.00 |  597300.00 | 13599300.00 |  471800.00 |  -0.88% |        -0.58% |           2.41 |                      |
| checkpoint/down/20000/create           |  3389800.00 |   67300.00 |  3389200.00 |   32500.00 |  -0.02% |         0.20% |           1.16 |                      |
| checkpoint/down/20000/sequence         | 21572500.00 |  521400.00 | 23721300.00 | 1046900.00 |   9.96% |         8.19% |           2.23 |                      |
| checkpoint/down/20000/values           | 11433700.00 |  128200.00 | 10446500.00 |  309900.00 |  -8.63% |        -8.63% |           8.52 |                      |
| checkpoint/down/15000/create           |  2445700.00 |   24300.00 |  2390800.00 |   50200.00 |  -2.24% |        -2.56% |           4.57 |                      |
| checkpoint/down/15000/sequence         | 18834300.00 | 1029500.00 | 18687000.00 |  430300.00 |  -0.78% |        -2.29% |           6.60 |                      |
| checkpoint/down/15000/values           |  8557500.00 |  965300.00 |  8430700.00 |  281800.00 |  -1.48% |        -3.61% |          14.82 |                      |
| checkpoint/down/10000/create           |  1669700.00 |   10100.00 |  1631800.00 |   16900.00 |  -2.27% |        -3.31% |           1.20 |                      |
| checkpoint/down/10000/sequence         | 15179600.00 |  840900.00 | 16104900.00 | 1688600.00 |   6.10% |         6.74% |           4.37 |                      |
| checkpoint/down/10000/values           |  6320100.00 |  636900.00 |  6964100.00 |  537700.00 |  10.19% |        11.29% |          19.92 |                      |
| checkpoint/down/5000/create            |   767800.00 |   28000.00 |   781500.00 |   10100.00 |   1.78% |        -0.12% |           2.05 |                      |
| checkpoint/down/5000/sequence          | 11473900.00 |  129400.00 | 11762500.00 | 1128900.00 |   2.52% |         6.55% |          10.96 |                      |
| checkpoint/down/5000/values            |  2996600.00 |  581800.00 |  3735400.00 |  776000.00 |  24.65% |         4.66% |          25.11 |                      |
| checkpoint/down/1000/create            |   156600.00 |   46600.00 |   147800.00 |   15900.00 |  -5.62% |        -6.51% |          16.81 |                      |
| checkpoint/down/1000/sequence          |  7754200.00 |  572700.00 |  7725700.00 | 1021900.00 |  -0.37% |        -0.37% |          20.95 |                      |
| checkpoint/down/1000/values            |   682500.00 |   65700.00 |   648900.00 |   38300.00 |  -4.92% |         3.99% |          15.45 |                      |
| checkpoint/down/0/create               |    15900.00 |     400.00 |    15200.00 |    1700.00 |  -4.40% |        -4.40% |          14.62 |                      |
| checkpoint/down/0/sequence             |  1790000.00 |  202700.00 |  1837700.00 |  189200.00 |   2.66% |         8.98% |          23.22 |                      |
| checkpoint/down/0/values               |    12100.00 |    1600.00 |    12600.00 |    2600.00 |   4.13% |        11.38% |          31.79 |                      |

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
