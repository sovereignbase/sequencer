# directory-ring-lifecycle: complete production lifecycle

5 matched full lifecycle runs per build, rotating/reversed build order. Baseline: fixed-table; candidate: directory-ring. All checkpoints, mixed editing, acknowledgement exchange, compaction and recreation are unchanged. Throughput and tuple suites are not included in this targeted comparison; it is not complete-suite acceptance.

Times are median ns/call, with IQR. Negative changes mean faster. Every valid sample and slower row is retained. Raw results: `temp/optimization_2026_11_12/directory-ring-lifecycle-*`.

| Method / checkpoint                    |      Before |        IQR |       After |        IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :------------------------------------- | ----------: | ---------: | ----------: | ---------: | ------: | ------------: | -------------: | :------------------- |
| lifecycle/scaleUp/apply.random         |    12759.15 |     292.58 |     3871.00 |     174.71 | -69.66% |       -69.95% |           2.02 |                      |
| lifecycle/scaleUp/insert.head          |      834.05 |      81.54 |      984.60 |      32.88 |  18.05% |        17.53% |           4.09 | yes                  |
| lifecycle/scaleUp/insert.random        |     6329.10 |     136.55 |     1849.78 |      23.27 | -70.77% |       -70.89% |           1.20 |                      |
| lifecycle/scaleUp/insert.tail          |      791.47 |      74.18 |      822.28 |     116.27 |   3.89% |         4.75% |           5.95 |                      |
| lifecycle/scaleUp/remove.head          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/remove.random        |    11061.00 |     215.62 |     2847.36 |      33.43 | -74.26% |       -74.35% |           0.56 |                      |
| lifecycle/scaleUp/remove.tail          |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleUp/replace.head         |     2611.28 |     308.48 |     2837.41 |     560.98 |   8.66% |        16.39% |          20.80 |                      |
| lifecycle/scaleUp/replace.random       |    11697.98 |     230.45 |     3692.14 |     160.37 | -68.44% |       -68.13% |           0.69 |                      |
| lifecycle/scaleUp/replace.tail         |     2266.53 |     718.38 |     2486.91 |     224.03 |   9.72% |         7.11% |          24.23 |                      |
| lifecycle/scaleUp/value.head           |      352.07 |       5.53 |      316.52 |      47.22 | -10.10% |        -8.73% |          11.24 |                      |
| lifecycle/scaleUp/value.random         |     9214.36 |     212.68 |     1155.90 |      42.35 | -87.46% |       -87.63% |           0.28 |                      |
| lifecycle/scaleUp/value.tail           |      232.38 |      17.98 |      154.01 |       6.52 | -33.72% |       -36.40% |           6.59 |                      |
| lifecycle/scaleDown/apply.random       |    10992.07 |     406.31 |     3711.17 |      73.45 | -66.24% |       -67.28% |           2.70 |                      |
| lifecycle/scaleDown/insert.head        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/insert.random      |     3959.57 |     361.04 |     1860.24 |      22.57 | -53.02% |       -53.02% |           5.61 |                      |
| lifecycle/scaleDown/insert.tail        |        0.00 |       0.00 |        0.00 |       0.00 |   0.00% |         0.00% |           0.00 |                      |
| lifecycle/scaleDown/remove.head        |     1991.54 |      73.46 |     2040.27 |     200.92 |   2.45% |         2.45% |           6.97 |                      |
| lifecycle/scaleDown/remove.random      |     5773.46 |     219.49 |     3001.69 |     228.51 | -48.01% |       -48.55% |           4.09 |                      |
| lifecycle/scaleDown/remove.tail        |     2129.05 |      52.07 |     1824.86 |      95.24 | -14.29% |       -10.28% |           4.50 |                      |
| lifecycle/scaleDown/replace.head       |     2664.09 |      86.30 |     2843.26 |     119.54 |   6.73% |         6.90% |           0.57 | yes                  |
| lifecycle/scaleDown/replace.random     |     5946.90 |     339.58 |     3545.86 |     149.69 | -40.37% |       -40.00% |           2.13 |                      |
| lifecycle/scaleDown/replace.tail       |    41847.22 |    2335.62 |    32001.84 |    3139.46 | -23.53% |       -24.95% |           6.50 |                      |
| lifecycle/scaleDown/value.head         |      516.92 |      52.71 |      435.09 |      25.01 | -15.83% |       -12.28% |           8.66 |                      |
| lifecycle/scaleDown/value.random       |     3683.52 |     248.17 |     1108.09 |      40.98 | -69.92% |       -71.01% |           3.02 |                      |
| lifecycle/scaleDown/value.tail         |      289.75 |       0.20 |      241.82 |       5.72 | -16.54% |       -15.44% |           3.23 |                      |
| lifecycle/fullLifecycle/apply.random   |    11908.86 |     236.19 |     3786.62 |     135.04 | -68.20% |       -67.86% |           0.43 |                      |
| lifecycle/fullLifecycle/insert.head    |      834.05 |      81.54 |      984.60 |      32.88 |  18.05% |        17.53% |           4.09 | yes                  |
| lifecycle/fullLifecycle/insert.random  |     5086.96 |     169.51 |     1873.01 |      65.15 | -63.18% |       -62.73% |           2.95 |                      |
| lifecycle/fullLifecycle/insert.tail    |      791.47 |      74.18 |      822.28 |     116.27 |   3.89% |         4.75% |           5.95 |                      |
| lifecycle/fullLifecycle/remove.head    |     1991.54 |      73.46 |     2040.27 |     200.92 |   2.45% |         2.45% |           6.97 |                      |
| lifecycle/fullLifecycle/remove.random  |     8487.85 |     130.35 |     2925.65 |     168.36 | -65.53% |       -65.63% |           1.14 |                      |
| lifecycle/fullLifecycle/remove.tail    |     2129.05 |      52.07 |     1824.86 |      95.24 | -14.29% |       -10.28% |           4.50 |                      |
| lifecycle/fullLifecycle/replace.head   |     2640.19 |     109.27 |     2862.18 |     320.44 |   8.41% |        11.97% |          11.60 | yes                  |
| lifecycle/fullLifecycle/replace.random |     8899.58 |     128.69 |     3641.29 |      54.43 | -59.08% |       -58.69% |           0.94 |                      |
| lifecycle/fullLifecycle/replace.tail   |    22024.90 |     778.84 |    17214.76 |    1860.27 | -21.84% |       -24.48% |           7.80 |                      |
| lifecycle/fullLifecycle/value.head     |      434.62 |      32.83 |      396.90 |      12.54 |  -8.68% |       -11.49% |           1.21 |                      |
| lifecycle/fullLifecycle/value.random   |     6552.87 |      14.52 |     1131.99 |      28.66 | -82.73% |       -82.49% |           0.42 |                      |
| lifecycle/fullLifecycle/value.tail     |      261.06 |      11.82 |      202.60 |      10.99 | -22.39% |       -23.60% |           2.04 |                      |
| checkpoint/up/1000/create              |   318600.00 |   19000.00 |   309600.00 |  180600.00 |  -2.82% |         8.21% |          50.75 |                      |
| checkpoint/up/1000/sequence            |  2542700.00 |  100500.00 |  2495400.00 |  637400.00 |  -1.86% |        -3.02% |           5.30 |                      |
| checkpoint/up/1000/values              |  1685800.00 |   55100.00 |  1689800.00 |  328300.00 |   0.24% |         3.33% |          17.41 |                      |
| checkpoint/up/5000/create              |  1001300.00 |   15000.00 |   920100.00 |   55100.00 |  -8.11% |        -8.16% |           6.86 |                      |
| checkpoint/up/5000/sequence            |  9454400.00 |  862000.00 |  9287300.00 |  528400.00 |  -1.77% |        -1.94% |           5.46 |                      |
| checkpoint/up/5000/values              |  5289300.00 | 1238700.00 |  4770700.00 |  300500.00 |  -9.80% |        -4.86% |          13.07 |                      |
| checkpoint/up/10000/create             |  1519100.00 |   54100.00 |  1473600.00 |   55100.00 |  -3.00% |        -1.89% |           5.80 |                      |
| checkpoint/up/10000/sequence           | 16081800.00 |  550200.00 | 15963200.00 | 1714900.00 |  -0.74% |         4.38% |          14.16 |                      |
| checkpoint/up/10000/values             | 21185600.00 |  538500.00 | 20719600.00 | 1075000.00 |  -2.20% |        -3.81% |           8.47 |                      |
| checkpoint/up/15000/create             |  2270900.00 |   96300.00 |  2344400.00 |   58200.00 |   3.24% |         3.24% |           0.98 |                      |
| checkpoint/up/15000/sequence           | 17730400.00 | 1310900.00 | 16997900.00 |  157400.00 |  -4.13% |         0.14% |           9.90 |                      |
| checkpoint/up/15000/values             | 31279000.00 | 1245900.00 | 30965600.00 |  643000.00 |  -1.00% |        -2.17% |           3.78 |                      |
| checkpoint/up/20000/create             |  3383100.00 |   12300.00 |  3327200.00 |   79500.00 |  -1.65% |        -0.10% |           4.85 |                      |
| checkpoint/up/20000/sequence           | 25065200.00 |  762200.00 | 24842300.00 |  694000.00 |  -0.89% |        -2.19% |           5.71 |                      |
| checkpoint/up/20000/values             | 13430000.00 |  769500.00 | 13262400.00 |  715400.00 |  -1.25% |        -1.25% |          10.59 |                      |
| checkpoint/up/25000/create             |  4081800.00 |   87200.00 |  3969600.00 |  876700.00 |  -2.75% |        -1.91% |           2.18 |                      |
| checkpoint/up/25000/sequence           | 27029700.00 | 1337900.00 | 28143200.00 |  950600.00 |   4.12% |         4.12% |          12.03 |                      |
| checkpoint/up/25000/values             | 13752000.00 | 1772000.00 | 13319300.00 |  775000.00 |  -3.15% |        -4.13% |           6.96 |                      |
| checkpoint/down/20000/create           |  3394400.00 |   42600.00 |  3380500.00 |   77800.00 |  -0.41% |        -0.41% |           2.74 |                      |
| checkpoint/down/20000/sequence         | 23619500.00 | 3556200.00 | 22749700.00 |  213200.00 |  -3.68% |        -0.98% |          15.81 |                      |
| checkpoint/down/20000/values           | 11440800.00 | 1057900.00 | 10697700.00 |  756000.00 |  -6.50% |        -6.35% |           6.61 |                      |
| checkpoint/down/15000/create           |  2453100.00 |  206300.00 |  2562200.00 |  153300.00 |   4.45% |        -3.80% |          14.22 |                      |
| checkpoint/down/15000/sequence         | 19422800.00 | 1398500.00 | 19370800.00 | 2035100.00 |  -0.27% |        -3.16% |          18.21 |                      |
| checkpoint/down/15000/values           |  8426500.00 |   21900.00 |  8346800.00 |  554800.00 |  -0.95% |         5.23% |          12.14 |                      |
| checkpoint/down/10000/create           |  1671700.00 |   27700.00 |  1668300.00 |   65200.00 |  -0.20% |         1.73% |           4.43 |                      |
| checkpoint/down/10000/sequence         | 14990100.00 | 1478800.00 | 15089100.00 | 1091100.00 |   0.66% |         4.50% |          13.90 |                      |
| checkpoint/down/10000/values           |  6812800.00 |  407300.00 |  5964800.00 |  668900.00 | -12.45% |       -14.78% |           2.12 |                      |
| checkpoint/down/5000/create            |   773400.00 |   37100.00 |   779200.00 |    8800.00 |   0.75% |        -1.72% |           4.43 |                      |
| checkpoint/down/5000/sequence          | 11849200.00 |  915000.00 | 11802100.00 |  145500.00 |  -0.40% |        -0.72% |           8.99 |                      |
| checkpoint/down/5000/values            |  3321100.00 |  296700.00 |  3012400.00 |   87100.00 |  -9.30% |        -7.63% |          15.13 |                      |
| checkpoint/down/1000/create            |   145100.00 |   13000.00 |   162400.00 |   39400.00 |  11.92% |        13.65% |          12.03 | yes                  |
| checkpoint/down/1000/sequence          |  7249200.00 |  239300.00 |  8089800.00 | 2357600.00 |  11.60% |        13.12% |          18.26 |                      |
| checkpoint/down/1000/values            |   586400.00 |   46100.00 |   724400.00 |  161300.00 |  23.53% |        18.64% |           8.51 |                      |
| checkpoint/down/0/create               |    13100.00 |     500.00 |    15500.00 |    2800.00 |  18.32% |        19.23% |          28.49 |                      |
| checkpoint/down/0/sequence             |  1470500.00 |  127400.00 |  1565900.00 |  139100.00 |   6.49% |         9.01% |           8.11 |                      |
| checkpoint/down/0/values               |    10800.00 |    1200.00 |    11600.00 |    4100.00 |   7.41% |        10.23% |           7.56 |                      |

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
