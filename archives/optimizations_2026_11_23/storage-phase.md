# Native ACK storage lifecycle and tuple control

5 complete matched runs per build. Before: baseline; candidate: ack-storage. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 26 timing medians improve over 5%; 19 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                    |           Before (IQR) |        Candidate (IQR) |  Change | Paired change (IQR) |
| -------------------------------------- | ---------------------: | ---------------------: | ------: | ------------------: |
| lifecycle/scaleUp/apply.random         |       4,129.54 (351.2) |      3,973.96 (172.17) |  -3.77% |    -6.04% (8.87 pp) |
| lifecycle/scaleUp/insert.head          |         893.62 (67.58) |          919.52 (29.3) |  +2.90% |    +3.59% (9.27 pp) |
| lifecycle/scaleUp/insert.random        |       1,847.96 (28.42) |      1,989.48 (170.09) |  +7.66% |     +7.13% (8.6 pp) |
| lifecycle/scaleUp/insert.tail          |        875.42 (175.69) |         845.69 (33.67) |  -3.40% |   +3.37% (15.48 pp) |
| lifecycle/scaleUp/remove.random        |      3,089.69 (367.96) |      2,989.31 (152.56) |  -3.25% |     -8.35% (6.9 pp) |
| lifecycle/scaleUp/replace.head         |         2,620.24 (389) |      2,776.86 (242.41) |  +5.98% |    +0.27% (11.1 pp) |
| lifecycle/scaleUp/replace.random       |       3,639.26 (39.85) |       3,707.1 (102.88) |  +1.86% |    +1.00% (5.55 pp) |
| lifecycle/scaleUp/replace.tail         |      2,908.98 (337.88) |      2,701.19 (318.59) |  -7.14% |    -7.14% (7.18 pp) |
| lifecycle/scaleUp/value.head           |           340.26 (9.4) |         353.62 (14.66) |  +3.93% |    +3.86% (5.13 pp) |
| lifecycle/scaleUp/value.random         |       1,223.08 (35.02) |       1,211.83 (82.59) |  -0.92% |     +0.94% (4.9 pp) |
| lifecycle/scaleUp/value.tail           |          162.48 (2.91) |         158.13 (10.09) |  -2.68% |   -2.24% (13.29 pp) |
| lifecycle/scaleDown/apply.random       |      4,170.64 (656.27) |       3,724.79 (226.2) | -10.69% |     -1.87% (9.5 pp) |
| lifecycle/scaleDown/insert.random      |       1,958.13 (95.11) |      1,932.88 (224.21) |  -1.29% |    -0.36% (7.56 pp) |
| lifecycle/scaleDown/remove.head        |      2,037.39 (228.34) |       2,043.24 (60.28) |  +0.29% |    +0.29% (2.82 pp) |
| lifecycle/scaleDown/remove.random      |      2,893.07 (134.05) |      2,891.45 (536.32) |  -0.06% |    -0.06% (1.66 pp) |
| lifecycle/scaleDown/remove.tail        |      1,833.66 (430.11) |        1,850.7 (30.65) |  +0.93% |   +0.66% (18.25 pp) |
| lifecycle/scaleDown/replace.head       |      2,736.33 (228.73) |      3,071.93 (323.56) | +12.26% |    +1.66% (7.11 pp) |
| lifecycle/scaleDown/replace.random     |       3,548.04 (155.3) |      3,555.69 (492.46) |  +0.22% |    -0.32% (1.55 pp) |
| lifecycle/scaleDown/replace.tail       |   22,673.28 (1,605.28) |      22,750.5 (592.84) |  +0.34% |    +0.34% (2.77 pp) |
| lifecycle/scaleDown/value.head         |          459.5 (24.42) |          475.2 (23.58) |  +3.42% |     +6.05% (7.3 pp) |
| lifecycle/scaleDown/value.random       |       1,218.44 (36.84) |       1,203.29 (48.57) |  -1.24% |    -1.24% (3.28 pp) |
| lifecycle/scaleDown/value.tail         |         249.62 (15.71) |           252.26 (3.5) |  +1.06% |    +0.26% (2.43 pp) |
| lifecycle/fullLifecycle/apply.random   |      4,150.09 (182.03) |      3,940.52 (172.72) |  -5.05% |    -6.64% (6.78 pp) |
| lifecycle/fullLifecycle/insert.head    |         893.62 (67.58) |          919.52 (29.3) |  +2.90% |    +3.59% (9.27 pp) |
| lifecycle/fullLifecycle/insert.random  |        1,903.04 (2.46) |       2,043.6 (161.46) |  +7.39% |    +5.16% (5.31 pp) |
| lifecycle/fullLifecycle/insert.tail    |        875.42 (175.69) |         845.69 (33.67) |  -3.40% |   +3.37% (15.48 pp) |
| lifecycle/fullLifecycle/remove.head    |      2,037.39 (228.34) |       2,043.24 (60.28) |  +0.29% |    +0.29% (2.82 pp) |
| lifecycle/fullLifecycle/remove.random  |       2,982.93 (168.2) |      2,973.02 (224.52) |  -0.33% |    -4.61% (2.72 pp) |
| lifecycle/fullLifecycle/remove.tail    |      1,833.66 (430.11) |        1,850.7 (30.65) |  +0.93% |   +0.66% (18.25 pp) |
| lifecycle/fullLifecycle/replace.head   |          2,750.1 (373) |      2,845.31 (254.57) |  +3.46% |    +4.22% (7.32 pp) |
| lifecycle/fullLifecycle/replace.random |      3,593.65 (371.43) |      3,662.86 (304.62) |  +1.93% |    -0.64% (3.33 pp) |
| lifecycle/fullLifecycle/replace.tail   |     12,593.89 (935.26) |     12,566.61 (201.06) |  -0.22% |    -0.33% (5.16 pp) |
| lifecycle/fullLifecycle/value.head     |         393.57 (14.81) |          414.41 (3.22) |  +5.30% |    +2.08% (4.73 pp) |
| lifecycle/fullLifecycle/value.random   |       1,220.64 (39.52) |       1,221.91 (35.81) |  +0.10% |    -1.75% (4.19 pp) |
| lifecycle/fullLifecycle/value.tail     |           208.6 (8.31) |          209.88 (4.88) |  +0.61% |    -1.73% (3.15 pp) |
| checkpoint/up/1000/create              |       430,000 (28,300) |       433,500 (95,600) |  +0.81% |   +5.59% (20.03 pp) |
| checkpoint/up/1000/sequence            |     2,769,300 (86,100) |    2,858,100 (267,300) |  +3.21% |   +2.39% (20.65 pp) |
| checkpoint/up/1000/values              |     1,962,500 (80,200) |    2,004,000 (199,000) |  +2.11% |   +8.86% (19.64 pp) |
| checkpoint/up/5000/create              |       908,200 (46,700) |        946,700 (8,700) |  +4.24% |    +3.94% (5.33 pp) |
| checkpoint/up/5000/sequence            | 10,187,100 (2,488,700) |    8,409,500 (741,100) | -17.45% |   -11.84% (28.7 pp) |
| checkpoint/up/5000/values              |    4,828,200 (719,100) |    5,103,400 (971,300) |  +5.70% |   +1.18% (17.72 pp) |
| checkpoint/up/10000/create             |     1,594,600 (97,400) |    1,631,600 (165,600) |  +2.32% |   -3.59% (10.77 pp) |
| checkpoint/up/10000/sequence           |   14,387,400 (677,900) | 14,866,700 (1,602,500) |  +3.33% |   -0.35% (13.97 pp) |
| checkpoint/up/10000/values             | 20,039,000 (1,036,400) |   21,133,300 (498,700) |  +5.46% |   +5.46% (11.13 pp) |
| checkpoint/up/15000/create             |     2,551,100 (81,600) |    2,532,000 (274,400) |  -0.75% |    +3.19% (6.92 pp) |
| checkpoint/up/15000/sequence           |    16,918,400 (88,400) | 15,831,500 (2,531,000) |  -6.42% |    -6.42% (8.52 pp) |
| checkpoint/up/15000/values             | 31,284,700 (2,484,600) | 30,575,100 (2,417,100) |  -2.27% |    -1.14% (6.86 pp) |
| checkpoint/up/20000/create             |    3,694,400 (517,000) |     3,486,900 (84,400) |  -5.62% |   -5.62% (10.44 pp) |
| checkpoint/up/20000/sequence           | 25,255,800 (3,913,000) |   24,265,500 (369,300) |  -3.92% |   -3.92% (12.36 pp) |
| checkpoint/up/20000/values             | 10,884,300 (1,121,000) |   11,503,400 (565,400) |  +5.69% |   +4.04% (19.43 pp) |
| checkpoint/up/25000/create             |    4,313,100 (180,600) |    4,285,400 (230,900) |  -0.64% |    -1.88% (1.48 pp) |
| checkpoint/up/25000/sequence           | 27,252,000 (3,397,000) |   27,134,900 (848,600) |  -0.43% |   +8.04% (16.86 pp) |
| checkpoint/up/25000/values             | 12,874,600 (1,050,100) |   13,046,000 (884,400) |  +1.33% |   +6.28% (12.62 pp) |
| checkpoint/down/20000/create           |    3,615,000 (358,200) |    3,780,200 (227,500) |  +4.57% |     +3.30% (7.6 pp) |
| checkpoint/down/20000/sequence         | 23,888,100 (1,150,900) | 20,989,900 (1,618,900) | -12.13% |    -9.58% (5.83 pp) |
| checkpoint/down/20000/values           | 11,449,300 (1,643,800) | 10,051,700 (1,412,500) | -12.21% |  -14.51% (20.51 pp) |
| checkpoint/down/15000/create           |    2,635,600 (153,900) |     2,530,300 (50,600) |  -4.00% |    -3.25% (3.78 pp) |
| checkpoint/down/15000/sequence         |   17,786,700 (743,000) |   17,944,800 (362,700) |  +0.89% |    -0.14% (6.72 pp) |
| checkpoint/down/15000/values           |    7,758,200 (714,000) |  7,589,900 (1,147,500) |  -2.17% |   +2.52% (18.34 pp) |
| checkpoint/down/10000/create           |    1,778,000 (206,400) |    1,747,600 (134,700) |  -1.71% |    +3.15% (7.31 pp) |
| checkpoint/down/10000/sequence         |   14,438,300 (628,800) | 14,657,700 (1,925,800) |  +1.52% |   +2.27% (13.86 pp) |
| checkpoint/down/10000/values           |    6,907,200 (789,500) |    5,762,200 (893,700) | -16.58% |  -18.01% (24.84 pp) |
| checkpoint/down/5000/create            |      828,800 (189,500) |      836,900 (389,300) |  +0.98% |   +0.98% (33.16 pp) |
| checkpoint/down/5000/sequence          |   10,601,000 (447,000) |   10,570,600 (991,000) |  -0.29% |    +4.54% (6.88 pp) |
| checkpoint/down/5000/values            |  3,354,600 (1,440,200) |  4,200,100 (1,383,800) | +25.20% |   +6.19% (28.31 pp) |
| checkpoint/down/1000/create            |      198,400 (119,800) |       163,600 (17,500) | -17.54% |  -17.42% (39.06 pp) |
| checkpoint/down/1000/sequence          |    7,038,600 (455,400) |  6,762,500 (2,838,100) |  -3.92% |   +3.00% (49.18 pp) |
| checkpoint/down/1000/values            |      601,800 (108,900) |      645,900 (180,600) |  +7.33% |   +6.89% (21.66 pp) |
| checkpoint/down/0/create               |         18,300 (2,900) |         17,100 (1,700) |  -6.56% |    -3.78% (8.36 pp) |
| checkpoint/down/0/sequence             |    2,080,700 (509,700) |    1,631,200 (225,500) | -21.60% |   -24.05% (7.75 pp) |
| checkpoint/down/0/values               |         14,100 (3,000) |         12,300 (3,600) | -12.77% |  -21.99% (33.26 pp) |
| tuple/projection/2/create.empty        |         418.23 (76.48) |        440.65 (104.35) |  +5.36% |  +12.50% (11.88 pp) |
| tuple/tuple/2/create.empty             |         502.51 (75.74) |         491.84 (67.88) |  -2.12% |    +9.04% (9.93 pp) |
| tuple/projection/2/create.sequence     |      1,482.11 (315.12) |      1,425.13 (255.97) |  -3.84% |     +18.42% (14 pp) |
| tuple/tuple/2/create.sequence          |      1,608.83 (177.33) |      1,658.13 (350.92) |  +3.06% |   +7.82% (26.43 pp) |
| tuple/projection/2/replace.random      |       1,181.3 (174.94) |         1,171 (269.83) |  -0.87% |    +5.09% (9.53 pp) |
| tuple/tuple/2/replace.random           |        810.61 (148.19) |        764.02 (153.87) |  -5.75% |   +1.84% (13.48 pp) |
| tuple/projection/2/apply.replace       |      1,969.99 (496.97) |      2,143.64 (403.58) |  +8.81% |   +8.81% (11.22 pp) |
| tuple/tuple/2/apply.replace            |      1,414.63 (246.02) |      1,357.76 (215.02) |  -4.02% |   -3.96% (19.52 pp) |
| tuple/projection/2/apply.duplicate     |        665.32 (144.03) |         673.58 (63.88) |  +1.24% |   +1.50% (10.29 pp) |
| tuple/tuple/2/apply.duplicate          |         645.7 (101.84) |         675.53 (48.35) |  +4.62% |   -6.37% (15.54 pp) |
| tuple/projection/2/merge.duplicate     |        647.08 (114.77) |          699.75 (9.99) |  +8.14% |   +4.27% (17.72 pp) |
| tuple/tuple/2/merge.duplicate          |        740.12 (118.08) |         694.43 (86.16) |  -6.17% |   -6.82% (21.99 pp) |
| tuple/projection/2/length              |            8.22 (0.19) |            7.97 (3.47) |  -3.00% |    -4.18% (53.1 pp) |
| tuple/tuple/2/length                   |            7.45 (0.23) |            8.04 (0.93) |  +7.88% |   +2.79% (10.24 pp) |
| tuple/projection/2/value.random        |            28.9 (3.27) |           30.14 (1.94) |  +4.28% |   -2.45% (12.71 pp) |
| tuple/tuple/2/value.random             |           19.09 (0.17) |           18.61 (0.34) |  -2.49% |    -2.07% (0.94 pp) |
| tuple/projection/2/values              |           79.53 (3.06) |           78.08 (1.62) |  -1.81% |    -1.81% (4.98 pp) |
| tuple/tuple/2/values                   |            80.7 (2.76) |            80.51 (3.6) |  -0.24% |    -2.16% (4.01 pp) |
| tuple/projection/2/sequence            |         461.64 (13.08) |         453.92 (25.36) |  -1.67% |    -0.05% (1.96 pp) |
| tuple/tuple/2/sequence                 |          493.1 (20.62) |         477.25 (27.73) |  -3.22% |     +0.61% (6.7 pp) |
| tuple/projection/4/create.empty        |          409.25 (5.03) |          416.16 (3.64) |  +1.69% |       +1.34% (2 pp) |
| tuple/tuple/4/create.empty             |          444.73 (27.7) |         435.12 (12.61) |  -2.16% |    -2.16% (5.06 pp) |
| tuple/projection/4/create.sequence     |      1,658.11 (116.93) |      1,661.22 (100.56) |  +0.19% |   +0.19% (13.03 pp) |
| tuple/tuple/4/create.sequence          |       1,668.84 (14.95) |      1,690.29 (116.22) |  +1.29% |    +1.13% (1.39 pp) |
| tuple/projection/4/replace.random      |        1,182.74 (70.7) |       1,128.33 (23.07) |  -4.60% |    -4.87% (4.87 pp) |
| tuple/tuple/4/replace.random           |         652.65 (13.28) |        661.16 (106.96) |  +1.30% |   +4.28% (12.54 pp) |
| tuple/projection/4/apply.replace       |      1,870.12 (237.13) |      1,673.76 (157.73) | -10.50% |     -2.26% (9.4 pp) |
| tuple/tuple/4/apply.replace            |      1,113.84 (177.78) |        1,052.8 (40.08) |  -5.48% |    -5.48% (3.74 pp) |
| tuple/projection/4/apply.duplicate     |         639.53 (41.21) |         592.49 (22.67) |  -7.35% |    -7.81% (7.31 pp) |
| tuple/tuple/4/apply.duplicate          |         609.19 (50.02) |          594.34 (6.72) |  -2.44% |    -2.74% (7.03 pp) |
| tuple/projection/4/merge.duplicate     |         757.84 (10.78) |          733.17 (41.3) |  -3.26% |    +1.04% (6.79 pp) |
| tuple/tuple/4/merge.duplicate          |             798.5 (30) |         791.77 (93.45) |  -0.84% |   -2.37% (15.78 pp) |
| tuple/projection/4/length              |           28.66 (4.42) |           27.57 (2.66) |  -3.82% |    +0.62% (3.65 pp) |
| tuple/tuple/4/length                   |            28.75 (1.6) |           28.21 (0.63) |  -1.85% |    +2.54% (9.53 pp) |
| tuple/projection/4/value.random        |            43.36 (9.1) |           42.79 (0.96) |  -1.30% |   -1.30% (15.64 pp) |
| tuple/tuple/4/value.random             |           18.65 (3.22) |           18.43 (0.76) |  -1.13% |   -5.82% (10.41 pp) |
| tuple/projection/4/values              |          145.41 (9.06) |          159.88 (7.79) |  +9.95% |    +7.41% (7.53 pp) |
| tuple/tuple/4/values                   |          150.16 (6.54) |          148.48 (0.03) |  -1.11% |    +0.58% (6.36 pp) |
| tuple/projection/4/sequence            |         490.6 (109.28) |            477.46 (14) |  -2.68% |   -1.41% (13.79 pp) |
| tuple/tuple/4/sequence                 |        556.69 (149.37) |         564.71 (65.37) |  +1.44% |    -0.88% (3.62 pp) |
| tuple/projection/8/create.empty        |         422.12 (18.28) |         414.82 (10.51) |  -1.73% |    -3.99% (5.91 pp) |
| tuple/tuple/8/create.empty             |         435.08 (15.84) |          444.77 (6.12) |  +2.23% |     +1.03% (8.1 pp) |
| tuple/projection/8/create.sequence     |      2,240.79 (170.48) |      2,351.47 (172.19) |  +4.94% |   -2.18% (18.78 pp) |
| tuple/tuple/8/create.sequence          |      1,974.97 (152.46) |      2,014.96 (158.01) |  +2.02% |    +2.38% (0.45 pp) |
| tuple/projection/8/replace.random      |       1,201.97 (272.5) |       1,181.86 (32.22) |  -1.67% |     -1.67% (3.6 pp) |
| tuple/tuple/8/replace.random           |         711.66 (36.19) |         651.62 (87.65) |  -8.44% |  -11.26% (25.15 pp) |
| tuple/projection/8/apply.replace       |       1,825.86 (64.53) |       1,818.06 (40.71) |  -0.43% |   -0.43% (13.34 pp) |
| tuple/tuple/8/apply.replace            |        1,121.3 (100.8) |        1,025.77 (84.7) |  -8.52% |   +2.02% (14.21 pp) |
| tuple/projection/8/apply.duplicate     |         655.66 (42.18) |         687.06 (68.29) |  +4.79% |   -0.47% (10.95 pp) |
| tuple/tuple/8/apply.duplicate          |         628.09 (39.42) |          632.23 (26.4) |  +0.66% |   +0.66% (11.53 pp) |
| tuple/projection/8/merge.duplicate     |       1,096.79 (23.74) |      1,157.86 (112.69) |  +5.57% |   +5.87% (10.35 pp) |
| tuple/tuple/8/merge.duplicate          |        1,128.77 (8.66) |      1,215.59 (332.03) |  +7.69% |    +7.69% (32.5 pp) |
| tuple/projection/8/length              |           28.36 (3.23) |           35.67 (8.08) | +25.77% |  +30.56% (53.48 pp) |
| tuple/tuple/8/length                   |            27.96 (1.2) |           30.86 (3.58) | +10.39% |   +5.13% (19.89 pp) |
| tuple/projection/8/value.random        |           57.7 (18.84) |           57.65 (8.19) |  -0.09% |   -3.53% (11.01 pp) |
| tuple/tuple/8/value.random             |           18.38 (0.22) |           18.38 (3.67) |  +0.02% |    +4.23% (4.59 pp) |
| tuple/projection/8/values              |         230.73 (12.24) |          232.9 (27.94) |  +0.94% |    -0.09% (5.03 pp) |
| tuple/tuple/8/values                   |         211.47 (16.97) |         218.59 (36.79) |  +3.37% |    +3.36% (1.97 pp) |
| tuple/projection/8/sequence            |         644.06 (52.75) |         707.27 (73.15) |  +9.81% |    +1.01% (7.83 pp) |
| tuple/tuple/8/sequence                 |         700.45 (90.76) |         701.76 (54.43) |  +0.19% |    +2.84% (5.83 pp) |
| tuple/projection/100/create.empty      |          466.5 (27.49) |          449.04 (79.4) |  -3.74% |    +0.15% (0.21 pp) |
| tuple/tuple/100/create.empty           |         461.39 (70.52) |         457.02 (78.27) |  -0.95% |    -0.67% (3.12 pp) |
| tuple/projection/100/create.sequence   |     13,951.37 (534.74) |      14,043.72 (1,810) |  +0.66% |    +1.85% (8.35 pp) |
| tuple/tuple/100/create.sequence        |   11,300.13 (1,201.59) |   11,996.22 (1,102.78) |  +6.16% |    +5.17% (1.82 pp) |
| tuple/projection/100/replace.random    |      1,213.97 (100.81) |      1,175.03 (246.52) |  -3.21% |    -0.94% (5.86 pp) |
| tuple/tuple/100/replace.random         |            659 (59.55) |        668.33 (133.65) |  +1.42% |   -3.69% (12.58 pp) |
| tuple/projection/100/apply.replace     |       1,899.24 (240.2) |      1,755.75 (236.44) |  -7.56% |    -5.97% (4.73 pp) |
| tuple/tuple/100/apply.replace          |      1,006.12 (130.84) |       1,034.56 (93.86) |  +2.83% |    +2.85% (5.27 pp) |
| tuple/projection/100/apply.duplicate   |         616.84 (120.6) |        596.38 (130.67) |  -3.32% |    -3.89% (3.85 pp) |
| tuple/tuple/100/apply.duplicate        |        621.44 (135.56) |        608.85 (105.01) |  -2.03% |    -3.18% (1.97 pp) |
| tuple/projection/100/merge.duplicate   |    9,173.79 (1,014.81) |    9,099.96 (1,827.88) |  -0.80% |    -0.80% (2.76 pp) |
| tuple/tuple/100/merge.duplicate        |     13,516.94 (670.41) |     14,221.51 (864.55) |  +5.21% |    +2.75% (7.12 pp) |
| tuple/projection/100/length            |           28.58 (1.88) |           29.84 (2.05) |  +4.40% |    +5.88% (5.11 pp) |
| tuple/tuple/100/length                 |           30.13 (2.47) |           29.72 (2.91) |  -1.34% |    -2.07% (5.35 pp) |
| tuple/projection/100/value.random      |           84.68 (8.48) |           88.17 (8.74) |  +4.12% |   +1.13% (20.35 pp) |
| tuple/tuple/100/value.random           |           21.24 (2.54) |           19.37 (1.26) |  -8.83% |   -9.88% (19.69 pp) |
| tuple/projection/100/values            |      2,033.01 (336.93) |      1,911.25 (121.22) |  -5.99% |   +2.61% (20.69 pp) |
| tuple/tuple/100/values                 |      1,824.72 (346.04) |      1,590.69 (437.81) | -12.83% |   -3.77% (32.03 pp) |
| tuple/projection/100/sequence          |    7,173.54 (1,409.06) |     6,296.5 (1,826.07) | -12.23% |   -0.62% (29.02 pp) |
| tuple/tuple/100/sequence               |      6,455.79 (633.67) |      5,610.99 (734.05) | -13.09% |    -7.18% (1.55 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |     Before |  Candidate | Change |
| ----------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                     |    480,344 |    480,320 | -0.00% |
| memory/up/1000/js                         |    407,560 |    407,560 | +0.00% |
| storage/up/1000/jsonBytes                 |    278,238 |    278,238 | +0.00% |
| storage/up/1000/jsonGzipBytes             |     14,908 |     14,908 | +0.00% |
| storage/up/1000/messagePackBytes          |    165,784 |    165,784 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |     12,641 |     12,641 | +0.00% |
| memory/up/5000/native                     |  2,156,488 |  2,156,480 | -0.00% |
| memory/up/5000/js                         |  2,059,744 |  2,059,744 | +0.00% |
| storage/up/5000/jsonBytes                 |  1,662,776 |  1,662,776 | +0.00% |
| storage/up/5000/jsonGzipBytes             |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes          |    839,612 |    839,612 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |     63,127 |     63,127 | +0.00% |
| memory/up/10000/native                    |  3,567,200 |  3,567,192 | -0.00% |
| memory/up/10000/js                        |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes                |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes            |    152,232 |    152,232 | +0.00% |
| storage/up/10000/messagePackBytes         |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |    127,808 |    127,808 | +0.00% |
| memory/up/15000/native                    |  4,819,528 |  4,819,520 | -0.00% |
| memory/up/15000/js                        |  6,196,128 |  6,196,128 | +0.00% |
| storage/up/15000/jsonBytes                |  5,053,159 |  5,053,159 | +0.00% |
| storage/up/15000/jsonGzipBytes            |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes         |  3,635,106 |  3,635,106 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                    |  6,317,656 |  6,317,648 | -0.00% |
| memory/up/20000/js                        |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes                |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes            |    318,634 |    318,634 | +0.00% |
| storage/up/20000/messagePackBytes         |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |    269,890 |    269,890 | +0.00% |
| memory/up/25000/native                    |  7,541,536 |  7,541,528 | -0.00% |
| memory/up/25000/js                        | 10,328,360 | 10,328,360 | +0.00% |
| storage/up/25000/jsonBytes                |  9,500,463 |  9,500,463 | +0.00% |
| storage/up/25000/jsonGzipBytes            |    402,015 |    402,015 | +0.00% |
| storage/up/25000/messagePackBytes         |  6,711,789 |  6,711,789 | +0.00% |
| storage/up/25000/messagePackGzipBytes     |    343,336 |    343,336 | +0.00% |
| memory/down/20000/native                  |  6,597,168 |  6,597,168 | +0.00% |
| memory/down/20000/js                      |  8,267,264 |  8,267,264 | +0.00% |
| storage/down/20000/jsonBytes              |  7,760,743 |  7,760,743 | +0.00% |
| storage/down/20000/jsonGzipBytes          |    334,475 |    334,475 | +0.00% |
| storage/down/20000/messagePackBytes       |  5,444,111 |  5,444,111 | +0.00% |
| storage/down/20000/messagePackGzipBytes   |    284,870 |    284,870 | +0.00% |
| memory/down/15000/native                  |  5,747,296 |  5,747,296 | +0.00% |
| memory/down/15000/js                      |  6,212,288 |  6,212,288 | +0.00% |
| storage/down/15000/jsonBytes              |  5,878,783 |  5,878,783 | +0.00% |
| storage/down/15000/jsonGzipBytes          |    253,153 |    253,153 | +0.00% |
| storage/down/15000/messagePackBytes       |  4,110,000 |  4,110,000 | +0.00% |
| storage/down/15000/messagePackGzipBytes   |    214,870 |    214,870 | +0.00% |
| memory/down/10000/native                  |  4,720,968 |  4,720,968 | +0.00% |
| memory/down/10000/js                      |  4,155,848 |  4,155,848 | +0.00% |
| storage/down/10000/jsonBytes              |  3,941,927 |  3,941,927 | +0.00% |
| storage/down/10000/jsonGzipBytes          |    168,770 |    168,770 | +0.00% |
| storage/down/10000/messagePackBytes       |  2,750,169 |  2,750,169 | +0.00% |
| storage/down/10000/messagePackGzipBytes   |    143,189 |    143,189 | +0.00% |
| memory/down/5000/native                   |  3,777,432 |  3,777,432 | +0.00% |
| memory/down/5000/js                       |  2,066,312 |  2,066,312 | +0.00% |
| storage/down/5000/jsonBytes               |  1,950,486 |  1,950,486 | +0.00% |
| storage/down/5000/jsonGzipBytes           |     81,724 |     81,724 | +0.00% |
| storage/down/5000/messagePackBytes        |  1,363,171 |  1,363,171 | +0.00% |
| storage/down/5000/messagePackGzipBytes    |     69,494 |     69,494 | +0.00% |
| memory/down/1000/native                   |  2,719,360 |  2,719,352 | -0.00% |
| memory/down/1000/js                       |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes               |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes           |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes        |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |     13,932 |     13,932 | +0.00% |
| memory/down/0/native                      |  1,597,976 |  1,597,968 | -0.00% |
| memory/down/0/js                          |         16 |         16 | +0.00% |
| storage/down/0/jsonBytes                  |         16 |         16 | +0.00% |
| storage/down/0/jsonGzipBytes              |         32 |         32 | +0.00% |
| storage/down/0/messagePackBytes           |          8 |          8 | +0.00% |
| storage/down/0/messagePackGzipBytes       |         28 |         28 | +0.00% |
| tuple-space/projection/2/allocatedBytes   |        704 |        704 | +0.00% |
| tuple-space/projection/2/msgpackBytes     |         32 |         32 | +0.00% |
| tuple-space/projection/2/gzipBytes        |         42 |         42 | +0.00% |
| tuple-space/tuple/2/allocatedBytes        |        744 |        744 | +0.00% |
| tuple-space/tuple/2/msgpackBytes          |         38 |         38 | +0.00% |
| tuple-space/tuple/2/gzipBytes             |         56 |         56 | +0.00% |
| tuple-space/projection/4/allocatedBytes   |      1,432 |      1,432 | +0.00% |
| tuple-space/projection/4/msgpackBytes     |         64 |         64 | +0.00% |
| tuple-space/projection/4/gzipBytes        |         53 |         53 | +0.00% |
| tuple-space/tuple/4/allocatedBytes        |        968 |        968 | +0.00% |
| tuple-space/tuple/4/msgpackBytes          |         60 |         60 | +0.00% |
| tuple-space/tuple/4/gzipBytes             |         71 |         71 | +0.00% |
| tuple-space/projection/8/allocatedBytes   |      2,328 |      2,328 | +0.00% |
| tuple-space/projection/8/msgpackBytes     |        124 |        124 | +0.00% |
| tuple-space/projection/8/gzipBytes        |         80 |         80 | +0.00% |
| tuple-space/tuple/8/allocatedBytes        |      1,416 |      1,416 | +0.00% |
| tuple-space/tuple/8/msgpackBytes          |        104 |        104 | +0.00% |
| tuple-space/tuple/8/gzipBytes             |         92 |         92 | +0.00% |
| tuple-space/projection/100/allocatedBytes |     21,400 |     21,400 | +0.00% |
| tuple-space/projection/100/msgpackBytes   |        682 |        682 | +0.00% |
| tuple-space/projection/100/gzipBytes      |        586 |        586 | +0.00% |
| tuple-space/tuple/100/allocatedBytes      |     11,608 |     11,608 | +0.00% |
| tuple-space/tuple/100/msgpackBytes        |        527 |        527 | +0.00% |
| tuple-space/tuple/100/gzipBytes           |        356 |        356 | +0.00% |

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_23_runtime`. No external competitor was run.
