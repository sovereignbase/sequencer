# Native ACK storage lifecycle target

5 complete matched runs per build. Before: baseline; candidate: ack-storage. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 5 timing medians improve over 5%; 9 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                    |           Before (IQR) |        Candidate (IQR) |  Change | Paired change (IQR) |
| -------------------------------------- | ---------------------: | ---------------------: | ------: | ------------------: |
| lifecycle/scaleUp/apply.random         |      3,575.54 (174.61) |      3,697.71 (300.06) |  +3.42% |    +4.86% (3.64 pp) |
| lifecycle/scaleUp/insert.head          |         780.34 (36.98) |          772.3 (41.26) |  -1.03% |    -0.97% (7.67 pp) |
| lifecycle/scaleUp/insert.random        |       1,584.04 (28.98) |       1,560.11 (151.3) |  -1.51% |    +0.25% (1.58 pp) |
| lifecycle/scaleUp/insert.tail          |         722.74 (85.58) |         748.18 (83.36) |  +3.52% |    -2.06% (1.78 pp) |
| lifecycle/scaleUp/remove.random        |      2,872.92 (469.73) |      2,470.09 (114.31) | -14.02% |   -14.70% (12.8 pp) |
| lifecycle/scaleUp/replace.head         |       2,305.68 (94.19) |      2,449.18 (255.06) |  +6.22% |    +5.74% (3.23 pp) |
| lifecycle/scaleUp/replace.random       |      3,234.51 (187.43) |      3,418.67 (383.38) |  +5.69% |   +6.01% (22.55 pp) |
| lifecycle/scaleUp/replace.tail         |       2,164.82 (22.19) |       2,175.65 (34.74) |  +0.50% |    +0.95% (3.66 pp) |
| lifecycle/scaleUp/value.head           |          301.14 (1.37) |         323.07 (33.23) |  +7.28% |   +7.39% (15.96 pp) |
| lifecycle/scaleUp/value.random         |         997.91 (43.02) |         989.75 (23.66) |  -0.82% |    -0.71% (0.54 pp) |
| lifecycle/scaleUp/value.tail           |          148.66 (3.06) |           149.42 (2.2) |  +0.52% |       +1.05% (1 pp) |
| lifecycle/scaleDown/apply.random       |      3,269.39 (488.04) |       3,241.48 (22.78) |  -0.85% |    -0.85% (8.63 pp) |
| lifecycle/scaleDown/insert.random      |       1,560.43 (64.18) |       1,574.53 (16.58) |  +0.90% |    +0.70% (2.06 pp) |
| lifecycle/scaleDown/remove.head        |       1,770.01 (31.22) |        1,839.58 (81.9) |  +3.93% |     +1.16% (7.5 pp) |
| lifecycle/scaleDown/remove.random      |      2,446.82 (285.24) |        2,411.42 (8.04) |  -1.45% |   -1.45% (10.44 pp) |
| lifecycle/scaleDown/remove.tail        |       1,601.69 (65.82) |       1,624.74 (28.01) |  +1.44% |    +0.45% (2.63 pp) |
| lifecycle/scaleDown/replace.head       |        2,345.3 (34.94) |      2,354.54 (116.64) |  +0.39% |    +1.41% (1.63 pp) |
| lifecycle/scaleDown/replace.random     |      3,010.51 (298.85) |      3,011.99 (129.38) |  +0.05% |    +1.24% (5.27 pp) |
| lifecycle/scaleDown/replace.tail       |     17,392.31 (996.36) |       17,875.5 (20.42) |  +2.78% |    -1.95% (5.43 pp) |
| lifecycle/scaleDown/value.head         |          393.61 (9.66) |          396.36 (9.76) |  +0.70% |    +0.70% (1.74 pp) |
| lifecycle/scaleDown/value.random       |          954.32 (6.12) |         961.52 (17.85) |  +0.75% |       +0.12% (2 pp) |
| lifecycle/scaleDown/value.tail         |           217.5 (4.24) |          216.88 (2.86) |  -0.29% |     -1.20% (3.2 pp) |
| lifecycle/fullLifecycle/apply.random   |      3,457.58 (199.85) |      3,538.18 (149.49) |  +2.33% |    -1.51% (4.58 pp) |
| lifecycle/fullLifecycle/insert.head    |         780.34 (36.98) |          772.3 (41.26) |  -1.03% |    -0.97% (7.67 pp) |
| lifecycle/fullLifecycle/insert.random  |       1,564.12 (41.07) |       1,562.96 (62.68) |  -0.07% |    +0.60% (1.78 pp) |
| lifecycle/fullLifecycle/insert.tail    |         722.74 (85.58) |         748.18 (83.36) |  +3.52% |    -2.06% (1.78 pp) |
| lifecycle/fullLifecycle/remove.head    |       1,770.01 (31.22) |        1,839.58 (81.9) |  +3.93% |     +1.16% (7.5 pp) |
| lifecycle/fullLifecycle/remove.random  |      2,684.84 (230.38) |       2,440.45 (72.49) |  -9.10% |    -6.93% (3.88 pp) |
| lifecycle/fullLifecycle/remove.tail    |       1,601.69 (65.82) |       1,624.74 (28.01) |  +1.44% |    +0.45% (2.63 pp) |
| lifecycle/fullLifecycle/replace.head   |       2,330.71 (58.22) |      2,429.02 (129.63) |  +4.22% |     +2.96% (4.2 pp) |
| lifecycle/fullLifecycle/replace.random |       3,211.41 (174.2) |      3,243.74 (220.64) |  +1.01% |    +0.73% (8.78 pp) |
| lifecycle/fullLifecycle/replace.tail   |       9,808.13 (487.1) |      10,014.76 (15.08) |  +2.11% |    -1.81% (4.29 pp) |
| lifecycle/fullLifecycle/value.head     |          346.06 (4.53) |         359.72 (14.19) |  +3.95% |    +3.60% (5.13 pp) |
| lifecycle/fullLifecycle/value.random   |          979.12 (1.96) |          974.22 (4.33) |  -0.50% |    -0.36% (1.84 pp) |
| lifecycle/fullLifecycle/value.tail     |           184.06 (3.5) |          183.55 (0.63) |  -0.28% |    -0.24% (2.32 pp) |
| checkpoint/up/1000/create              |       373,100 (33,800) |       374,900 (68,900) |  +0.48% |   -2.55% (36.44 pp) |
| checkpoint/up/1000/sequence            |     2,234,000 (80,300) |  2,440,800 (1,320,400) |  +9.26% |   +9.26% (53.71 pp) |
| checkpoint/up/1000/values              |     1,650,900 (29,700) |     1,772,100 (43,600) |  +7.34% |    +9.25% (7.67 pp) |
| checkpoint/up/5000/create              |      897,600 (154,100) |       870,200 (37,000) |  -3.05% |   +2.74% (14.74 pp) |
| checkpoint/up/5000/sequence            |    7,534,900 (186,100) |    7,215,100 (107,600) |  -4.24% |    -3.82% (5.01 pp) |
| checkpoint/up/5000/values              |  4,244,600 (1,219,800) |    4,662,100 (242,200) |  +9.84% |   +4.83% (17.97 pp) |
| checkpoint/up/10000/create             |     1,511,000 (69,500) |     1,466,000 (61,300) |  -2.98% |    -3.52% (6.08 pp) |
| checkpoint/up/10000/sequence           |   12,638,100 (670,600) |   11,922,500 (373,500) |  -5.66% |    -3.66% (4.27 pp) |
| checkpoint/up/10000/values             |   20,138,500 (112,000) |   19,628,400 (344,400) |  -2.53% |    -3.33% (1.39 pp) |
| checkpoint/up/15000/create             |     2,379,900 (58,700) |     2,400,000 (98,300) |  +0.84% |    -1.13% (3.67 pp) |
| checkpoint/up/15000/sequence           | 13,992,600 (1,077,900) | 13,763,300 (1,403,800) |  -1.64% |    -3.07% (3.76 pp) |
| checkpoint/up/15000/values             |   29,589,700 (188,400) | 29,285,500 (1,344,600) |  -1.03% |    -4.11% (4.83 pp) |
| checkpoint/up/20000/create             |     3,301,500 (27,500) |    3,343,100 (142,500) |  +1.26% |    +0.90% (1.95 pp) |
| checkpoint/up/20000/sequence           |   20,262,700 (869,600) |   20,137,500 (469,500) |  -0.62% |    -2.10% (4.53 pp) |
| checkpoint/up/20000/values             |    9,793,500 (402,900) | 10,779,900 (1,158,900) | +10.07% |   +11.06% (9.35 pp) |
| checkpoint/up/25000/create             |    3,959,000 (122,700) |    3,947,400 (151,800) |  -0.29% |    -1.89% (4.33 pp) |
| checkpoint/up/25000/sequence           | 22,040,900 (2,938,900) |   21,819,700 (697,600) |  -1.00% |   -1.09% (14.86 pp) |
| checkpoint/up/25000/values             |   11,287,600 (791,800) |   11,145,200 (832,300) |  -1.26% |    -3.90% (2.66 pp) |
| checkpoint/down/20000/create           |     3,448,300 (61,400) |    3,427,700 (149,000) |  -0.60% |    -0.75% (2.33 pp) |
| checkpoint/down/20000/sequence         |   17,664,500 (119,200) |   17,767,200 (134,200) |  +0.58% |    +0.69% (2.05 pp) |
| checkpoint/down/20000/values           |    8,356,200 (468,900) |    8,769,900 (698,200) |  +4.95% |   +1.33% (11.37 pp) |
| checkpoint/down/15000/create           |     2,410,000 (49,000) |     2,357,000 (18,000) |  -2.20% |    -2.61% (3.18 pp) |
| checkpoint/down/15000/sequence         |   15,043,300 (639,500) |   14,937,100 (326,900) |  -0.71% |    +1.18% (1.01 pp) |
| checkpoint/down/15000/values           |    7,110,500 (329,000) |    7,432,200 (324,600) |  +4.52% |    +5.61% (3.87 pp) |
| checkpoint/down/10000/create           |     1,716,300 (38,100) |     1,623,400 (23,700) |  -5.41% |    -4.58% (5.13 pp) |
| checkpoint/down/10000/sequence         |   11,980,700 (656,100) |   11,859,000 (143,900) |  -1.02% |    +3.51% (9.44 pp) |
| checkpoint/down/10000/values           |    5,508,900 (537,600) |    5,243,000 (591,600) |  -4.83% |  -11.54% (16.04 pp) |
| checkpoint/down/5000/create            |       770,600 (27,600) |       775,900 (19,000) |  +0.69% |    +0.69% (6.42 pp) |
| checkpoint/down/5000/sequence          |    9,003,800 (127,100) |    9,180,600 (680,300) |  +1.96% |    +4.39% (6.13 pp) |
| checkpoint/down/5000/values            |    2,806,700 (400,700) |    2,902,200 (597,400) |  +3.40% |   -2.75% (37.26 pp) |
| checkpoint/down/1000/create            |        149,700 (8,200) |        153,000 (9,600) |  +2.20% |    +1.74% (0.71 pp) |
| checkpoint/down/1000/sequence          |    5,602,400 (562,200) |    6,038,400 (355,700) |  +7.78% |     +3.89% (9.4 pp) |
| checkpoint/down/1000/values            |       466,600 (46,100) |       500,100 (43,900) |  +7.18% |   +2.09% (18.21 pp) |
| checkpoint/down/0/create               |         14,400 (1,400) |           14,400 (900) |  +0.00% |   -3.21% (11.19 pp) |
| checkpoint/down/0/sequence             |    1,349,700 (419,400) |    1,219,900 (110,000) |  -9.62% |  -15.54% (16.75 pp) |
| checkpoint/down/0/values               |         10,900 (1,800) |           10,400 (700) |  -4.59% |   +7.22% (26.76 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                   |     Before |  Candidate | Change |
| --------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                   |    480,344 |    480,320 | -0.00% |
| memory/up/1000/js                       |    407,560 |    407,560 | +0.00% |
| storage/up/1000/jsonBytes               |    278,238 |    278,238 | +0.00% |
| storage/up/1000/jsonGzipBytes           |     14,908 |     14,908 | +0.00% |
| storage/up/1000/messagePackBytes        |    165,784 |    165,784 | +0.00% |
| storage/up/1000/messagePackGzipBytes    |     12,641 |     12,641 | +0.00% |
| memory/up/5000/native                   |  2,156,488 |  2,156,480 | -0.00% |
| memory/up/5000/js                       |  2,059,744 |  2,059,744 | +0.00% |
| storage/up/5000/jsonBytes               |  1,662,776 |  1,662,776 | +0.00% |
| storage/up/5000/jsonGzipBytes           |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes        |    839,612 |    839,612 | +0.00% |
| storage/up/5000/messagePackGzipBytes    |     63,127 |     63,127 | +0.00% |
| memory/up/10000/native                  |  3,567,200 |  3,567,192 | -0.00% |
| memory/up/10000/js                      |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes              |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes          |    152,232 |    152,232 | +0.00% |
| storage/up/10000/messagePackBytes       |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes   |    127,808 |    127,808 | +0.00% |
| memory/up/15000/native                  |  4,819,528 |  4,819,520 | -0.00% |
| memory/up/15000/js                      |  6,196,128 |  6,196,128 | +0.00% |
| storage/up/15000/jsonBytes              |  5,053,159 |  5,053,159 | +0.00% |
| storage/up/15000/jsonGzipBytes          |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes       |  3,635,106 |  3,635,106 | +0.00% |
| storage/up/15000/messagePackGzipBytes   |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                  |  6,317,656 |  6,317,648 | -0.00% |
| memory/up/20000/js                      |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes              |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes          |    318,634 |    318,634 | +0.00% |
| storage/up/20000/messagePackBytes       |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes   |    269,890 |    269,890 | +0.00% |
| memory/up/25000/native                  |  7,541,536 |  7,541,528 | -0.00% |
| memory/up/25000/js                      | 10,328,360 | 10,328,360 | +0.00% |
| storage/up/25000/jsonBytes              |  9,500,463 |  9,500,463 | +0.00% |
| storage/up/25000/jsonGzipBytes          |    402,015 |    402,015 | +0.00% |
| storage/up/25000/messagePackBytes       |  6,711,789 |  6,711,789 | +0.00% |
| storage/up/25000/messagePackGzipBytes   |    343,336 |    343,336 | +0.00% |
| memory/down/20000/native                |  6,597,168 |  6,597,168 | +0.00% |
| memory/down/20000/js                    |  8,267,264 |  8,267,264 | +0.00% |
| storage/down/20000/jsonBytes            |  7,760,743 |  7,760,743 | +0.00% |
| storage/down/20000/jsonGzipBytes        |    334,475 |    334,475 | +0.00% |
| storage/down/20000/messagePackBytes     |  5,444,111 |  5,444,111 | +0.00% |
| storage/down/20000/messagePackGzipBytes |    284,870 |    284,870 | +0.00% |
| memory/down/15000/native                |  5,747,296 |  5,747,296 | +0.00% |
| memory/down/15000/js                    |  6,212,288 |  6,212,288 | +0.00% |
| storage/down/15000/jsonBytes            |  5,878,783 |  5,878,783 | +0.00% |
| storage/down/15000/jsonGzipBytes        |    253,153 |    253,153 | +0.00% |
| storage/down/15000/messagePackBytes     |  4,110,000 |  4,110,000 | +0.00% |
| storage/down/15000/messagePackGzipBytes |    214,870 |    214,870 | +0.00% |
| memory/down/10000/native                |  4,720,968 |  4,720,968 | +0.00% |
| memory/down/10000/js                    |  4,155,848 |  4,155,848 | +0.00% |
| storage/down/10000/jsonBytes            |  3,941,927 |  3,941,927 | +0.00% |
| storage/down/10000/jsonGzipBytes        |    168,770 |    168,770 | +0.00% |
| storage/down/10000/messagePackBytes     |  2,750,169 |  2,750,169 | +0.00% |
| storage/down/10000/messagePackGzipBytes |    143,189 |    143,189 | +0.00% |
| memory/down/5000/native                 |  3,777,432 |  3,777,432 | +0.00% |
| memory/down/5000/js                     |  2,066,312 |  2,066,312 | +0.00% |
| storage/down/5000/jsonBytes             |  1,950,486 |  1,950,486 | +0.00% |
| storage/down/5000/jsonGzipBytes         |     81,724 |     81,724 | +0.00% |
| storage/down/5000/messagePackBytes      |  1,363,171 |  1,363,171 | +0.00% |
| storage/down/5000/messagePackGzipBytes  |     69,494 |     69,494 | +0.00% |
| memory/down/1000/native                 |  2,719,360 |  2,719,352 | -0.00% |
| memory/down/1000/js                     |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes             |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes         |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes      |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes  |     13,932 |     13,932 | +0.00% |
| memory/down/0/native                    |  1,597,976 |  1,597,968 | -0.00% |
| memory/down/0/js                        |         16 |         16 | +0.00% |
| storage/down/0/jsonBytes                |         16 |         16 | +0.00% |
| storage/down/0/jsonGzipBytes            |         32 |         32 | +0.00% |
| storage/down/0/messagePackBytes         |          8 |          8 | +0.00% |
| storage/down/0/messagePackGzipBytes     |         28 |         28 | +0.00% |

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_23_runtime`. No external competitor was run.
