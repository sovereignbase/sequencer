# Identical-source lifecycle and tuple control

5 complete matched runs per build. Before: baseline; candidate: baseline-copy. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 33 timing medians improve over 5%; 20 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                    |           Before (IQR) |        Candidate (IQR) |  Change | Paired change (IQR) |
| -------------------------------------- | ---------------------: | ---------------------: | ------: | ------------------: |
| lifecycle/scaleUp/apply.random         |       4,129.54 (351.2) |      4,524.66 (155.01) |  +9.57% |   +9.57% (12.86 pp) |
| lifecycle/scaleUp/insert.head          |         893.62 (67.58) |         913.9 (177.94) |  +2.27% |   +2.16% (15.57 pp) |
| lifecycle/scaleUp/insert.random        |       1,847.96 (28.42) |      1,936.46 (272.38) |  +4.79% |   -0.76% (15.42 pp) |
| lifecycle/scaleUp/insert.tail          |        875.42 (175.69) |         916.6 (202.93) |  +4.70% |    +5.05% (8.71 pp) |
| lifecycle/scaleUp/remove.random        |      3,089.69 (367.96) |      3,412.43 (511.62) | +10.45% |   +0.37% (23.02 pp) |
| lifecycle/scaleUp/replace.head         |         2,620.24 (389) |      2,931.32 (802.52) | +11.87% |   +7.62% (18.32 pp) |
| lifecycle/scaleUp/replace.random       |       3,639.26 (39.85) |      4,024.72 (512.28) | +10.59% |   +9.39% (11.23 pp) |
| lifecycle/scaleUp/replace.tail         |      2,908.98 (337.88) |       2,388.9 (529.08) | -17.88% |   -0.48% (13.06 pp) |
| lifecycle/scaleUp/value.head           |           340.26 (9.4) |         334.07 (69.88) |  -1.82% |   +1.94% (16.19 pp) |
| lifecycle/scaleUp/value.random         |       1,223.08 (35.02) |      1,190.96 (171.45) |  -2.63% |      -2.62% (14 pp) |
| lifecycle/scaleUp/value.tail           |          162.48 (2.91) |         164.64 (24.21) |  +1.33% |   +1.78% (14.42 pp) |
| lifecycle/scaleDown/apply.random       |      4,170.64 (656.27) |      4,027.58 (460.28) |  -3.43% |    +0.85% (8.84 pp) |
| lifecycle/scaleDown/insert.random      |       1,958.13 (95.11) |       1,873.5 (155.44) |  -4.32% |   -0.28% (10.97 pp) |
| lifecycle/scaleDown/remove.head        |      2,037.39 (228.34) |      2,063.43 (217.02) |  +1.28% |    +0.75% (8.19 pp) |
| lifecycle/scaleDown/remove.random      |      2,893.07 (134.05) |       2,914.58 (370.6) |  +0.74% |   +1.67% (13.18 pp) |
| lifecycle/scaleDown/remove.tail        |      1,833.66 (430.11) |      1,912.16 (247.25) |  +4.28% |   -0.55% (16.28 pp) |
| lifecycle/scaleDown/replace.head       |      2,736.33 (228.73) |      2,969.83 (462.47) |  +8.53% |    +1.54% (17.1 pp) |
| lifecycle/scaleDown/replace.random     |       3,548.04 (155.3) |      3,840.84 (324.68) |  +8.25% |    -0.69% (8.74 pp) |
| lifecycle/scaleDown/replace.tail       |   22,673.28 (1,605.28) |     23,154.9 (7,025.3) |  +2.12% |   +3.93% (30.13 pp) |
| lifecycle/scaleDown/value.head         |          459.5 (24.42) |         455.75 (86.89) |  -0.82% |   +2.80% (23.91 pp) |
| lifecycle/scaleDown/value.random       |       1,218.44 (36.84) |       1,207.33 (88.99) |  -0.91% |    -0.26% (7.19 pp) |
| lifecycle/scaleDown/value.tail         |         249.62 (15.71) |          246.3 (30.63) |  -1.33% |    -1.33% (6.44 pp) |
| lifecycle/fullLifecycle/apply.random   |      4,150.09 (182.03) |      4,276.12 (152.63) |  +3.04% |    +7.91% (5.06 pp) |
| lifecycle/fullLifecycle/insert.head    |         893.62 (67.58) |         913.9 (177.94) |  +2.27% |   +2.16% (15.57 pp) |
| lifecycle/fullLifecycle/insert.random  |        1,903.04 (2.46) |         1,980.89 (138) |  +4.09% |    +4.06% (9.22 pp) |
| lifecycle/fullLifecycle/insert.tail    |        875.42 (175.69) |         916.6 (202.93) |  +4.70% |    +5.05% (8.71 pp) |
| lifecycle/fullLifecycle/remove.head    |      2,037.39 (228.34) |      2,063.43 (217.02) |  +1.28% |    +0.75% (8.19 pp) |
| lifecycle/fullLifecycle/remove.random  |       2,982.93 (168.2) |      3,102.67 (215.16) |  +4.01% |    +4.86% (11.9 pp) |
| lifecycle/fullLifecycle/remove.tail    |      1,833.66 (430.11) |      1,912.16 (247.25) |  +4.28% |   -0.55% (16.28 pp) |
| lifecycle/fullLifecycle/replace.head   |          2,750.1 (373) |      2,808.81 (202.23) |  +2.13% |   +6.64% (13.91 pp) |
| lifecycle/fullLifecycle/replace.random |      3,593.65 (371.43) |      3,774.15 (252.42) |  +5.02% |    +5.02% (7.04 pp) |
| lifecycle/fullLifecycle/replace.tail   |     12,593.89 (935.26) |   13,027.64 (3,535.41) |  +3.44% |   +3.44% (30.09 pp) |
| lifecycle/fullLifecycle/value.head     |         393.57 (14.81) |         423.86 (48.01) |  +7.70% |   +7.71% (13.25 pp) |
| lifecycle/fullLifecycle/value.random   |       1,220.64 (39.52) |       1,242.44 (86.92) |  +1.79% |    +2.08% (7.45 pp) |
| lifecycle/fullLifecycle/value.tail     |           208.6 (8.31) |         215.09 (12.83) |  +3.11% |     +3.14% (5.3 pp) |
| checkpoint/up/1000/create              |       430,000 (28,300) |      475,200 (116,100) | +10.51% |    -0.65% (38.9 pp) |
| checkpoint/up/1000/sequence            |     2,769,300 (86,100) |    2,970,600 (568,800) |  +7.27% |    +7.27% (17.4 pp) |
| checkpoint/up/1000/values              |     1,962,500 (80,200) |    2,050,800 (551,300) |  +4.50% |   +4.50% (23.86 pp) |
| checkpoint/up/5000/create              |       908,200 (46,700) |      963,700 (128,600) |  +6.11% |   +1.47% (13.72 pp) |
| checkpoint/up/5000/sequence            | 10,187,100 (2,488,700) |  8,256,300 (1,076,500) | -18.95% |   -8.57% (13.83 pp) |
| checkpoint/up/5000/values              |    4,828,200 (719,100) |    5,024,700 (768,000) |  +4.07% |   +1.11% (10.66 pp) |
| checkpoint/up/10000/create             |     1,594,600 (97,400) |    1,599,600 (217,300) |  +0.31% |    -4.88% (9.04 pp) |
| checkpoint/up/10000/sequence           |   14,387,400 (677,900) | 14,704,300 (1,810,400) |  +2.20% |    -4.55% (10.4 pp) |
| checkpoint/up/10000/values             | 20,039,000 (1,036,400) | 20,734,000 (1,527,300) |  +3.47% |    -0.54% (9.18 pp) |
| checkpoint/up/15000/create             |     2,551,100 (81,600) |    2,523,200 (119,500) |  -1.09% |    -2.26% (7.86 pp) |
| checkpoint/up/15000/sequence           |    16,918,400 (88,400) | 16,396,100 (1,306,900) |  -3.09% |    -3.08% (7.07 pp) |
| checkpoint/up/15000/values             | 31,284,700 (2,484,600) | 30,679,700 (1,982,900) |  -1.93% |    +1.37% (7.31 pp) |
| checkpoint/up/20000/create             |    3,694,400 (517,000) |    4,051,400 (867,700) |  +9.66% |   +5.44% (11.26 pp) |
| checkpoint/up/20000/sequence           | 25,255,800 (3,913,000) | 25,408,600 (3,482,300) |  +0.61% |    -1.92% (6.87 pp) |
| checkpoint/up/20000/values             | 10,884,300 (1,121,000) | 12,243,900 (1,090,800) | +12.49% |   +4.11% (16.85 pp) |
| checkpoint/up/25000/create             |    4,313,100 (180,600) |    4,600,600 (706,700) |  +6.67% |   +0.80% (13.75 pp) |
| checkpoint/up/25000/sequence           | 27,252,000 (3,397,000) | 27,519,800 (1,954,900) |  +0.98% |   +18.40% (23.2 pp) |
| checkpoint/up/25000/values             | 12,874,600 (1,050,100) |   13,161,300 (690,800) |  +2.23% |     +9.05% (4.8 pp) |
| checkpoint/down/20000/create           |    3,615,000 (358,200) |    3,656,100 (384,900) |  +1.14% |    +2.26% (8.11 pp) |
| checkpoint/down/20000/sequence         | 23,888,100 (1,150,900) | 23,453,200 (3,106,600) |  -1.82% |   -8.49% (28.97 pp) |
| checkpoint/down/20000/values           | 11,449,300 (1,643,800) | 10,121,500 (1,181,900) | -11.60% |   -7.57% (19.43 pp) |
| checkpoint/down/15000/create           |    2,635,600 (153,900) |    2,531,100 (236,500) |  -3.96% |    +0.34% (7.93 pp) |
| checkpoint/down/15000/sequence         |   17,786,700 (743,000) | 17,357,800 (1,131,000) |  -2.41% |    -0.64% (3.79 pp) |
| checkpoint/down/15000/values           |    7,758,200 (714,000) |    8,064,600 (214,000) |  +3.95% |   +0.42% (13.23 pp) |
| checkpoint/down/10000/create           |    1,778,000 (206,400) |    1,731,300 (176,500) |  -2.63% |    -1.15% (7.31 pp) |
| checkpoint/down/10000/sequence         |   14,438,300 (628,800) | 14,539,300 (1,378,600) |  +0.70% |   +9.26% (14.16 pp) |
| checkpoint/down/10000/values           |    6,907,200 (789,500) |    6,183,600 (341,700) | -10.48% |  -12.01% (14.62 pp) |
| checkpoint/down/5000/create            |      828,800 (189,500) |       806,000 (17,400) |  -2.75% |   -3.34% (20.77 pp) |
| checkpoint/down/5000/sequence          |   10,601,000 (447,000) |   10,084,100 (835,600) |  -4.88% |    -0.27% (8.37 pp) |
| checkpoint/down/5000/values            |  3,354,600 (1,440,200) |    2,931,500 (420,000) | -12.61% |   +5.70% (48.58 pp) |
| checkpoint/down/1000/create            |      198,400 (119,800) |       196,500 (74,400) |  -0.96% |  -21.70% (22.87 pp) |
| checkpoint/down/1000/sequence          |    7,038,600 (455,400) |  5,892,200 (1,356,900) | -16.29% |   -10.25% (29.4 pp) |
| checkpoint/down/1000/values            |      601,800 (108,900) |       631,000 (95,900) |  +4.85% |   -5.74% (12.29 pp) |
| checkpoint/down/0/create               |         18,300 (2,900) |         16,200 (1,300) | -11.48% |  -10.81% (21.93 pp) |
| checkpoint/down/0/sequence             |    2,080,700 (509,700) |    1,560,800 (269,700) | -24.99% |   -24.99% (9.94 pp) |
| checkpoint/down/0/values               |         14,100 (3,000) |         12,500 (6,300) | -11.35% |  -24.70% (59.99 pp) |
| tuple/projection/2/create.empty        |         418.23 (76.48) |        413.62 (116.94) |  -1.10% |  +14.88% (45.38 pp) |
| tuple/tuple/2/create.empty             |         502.51 (75.74) |          464.5 (59.48) |  -7.56% |   +1.20% (32.72 pp) |
| tuple/projection/2/create.sequence     |      1,482.11 (315.12) |      1,334.43 (200.11) |  -9.96% |   +4.44% (39.88 pp) |
| tuple/tuple/2/create.sequence          |      1,608.83 (177.33) |      1,491.51 (232.44) |  -7.29% |    -2.75% (19.2 pp) |
| tuple/projection/2/replace.random      |       1,181.3 (174.94) |      1,095.47 (107.49) |  -7.27% |  +11.39% (31.04 pp) |
| tuple/tuple/2/replace.random           |        810.61 (148.19) |         733.84 (78.05) |  -9.47% |    +2.62% (36.3 pp) |
| tuple/projection/2/apply.replace       |      1,969.99 (496.97) |        1,773.3 (51.25) |  -9.98% |   +4.27% (18.83 pp) |
| tuple/tuple/2/apply.replace            |      1,414.63 (246.02) |       1,172.72 (67.99) | -17.10% |   +0.61% (21.44 pp) |
| tuple/projection/2/apply.duplicate     |        665.32 (144.03) |         644.38 (18.12) |  -3.15% |   +3.43% (21.11 pp) |
| tuple/tuple/2/apply.duplicate          |         645.7 (101.84) |         638.91 (31.54) |  -1.05% |    +0.48% (4.11 pp) |
| tuple/projection/2/merge.duplicate     |        647.08 (114.77) |         677.01 (137.1) |  +4.63% |   +4.73% (34.61 pp) |
| tuple/tuple/2/merge.duplicate          |        740.12 (118.08) |         652.93 (12.81) | -11.78% |   +3.92% (24.32 pp) |
| tuple/projection/2/length              |            8.22 (0.19) |             7.5 (0.32) |  -8.76% |    -6.78% (4.93 pp) |
| tuple/tuple/2/length                   |            7.45 (0.23) |            7.42 (0.67) |  -0.42% |    -1.60% (5.57 pp) |
| tuple/projection/2/value.random        |            28.9 (3.27) |           31.95 (9.04) | +10.56% |   +11.18% (7.64 pp) |
| tuple/tuple/2/value.random             |           19.09 (0.17) |           19.66 (6.31) |  +2.96% |   +4.73% (23.97 pp) |
| tuple/projection/2/values              |           79.53 (3.06) |          79.07 (15.75) |  -0.57% |    +3.01% (12.2 pp) |
| tuple/tuple/2/values                   |            80.7 (2.76) |          84.26 (20.49) |  +4.40% |   +4.40% (15.57 pp) |
| tuple/projection/2/sequence            |         461.64 (13.08) |         465.15 (93.27) |  +0.76% |   +2.43% (16.35 pp) |
| tuple/tuple/2/sequence                 |          493.1 (20.62) |         485.79 (81.27) |  -1.48% |    -2.03% (15.9 pp) |
| tuple/projection/4/create.empty        |          409.25 (5.03) |         453.73 (82.14) | +10.87% |   +11.15% (18.9 pp) |
| tuple/tuple/4/create.empty             |          444.73 (27.7) |         461.39 (69.17) |  +3.75% |    +9.60% (6.61 pp) |
| tuple/projection/4/create.sequence     |      1,658.11 (116.93) |      1,633.56 (259.34) |  -1.48% |    -0.30% (1.58 pp) |
| tuple/tuple/4/create.sequence          |       1,668.84 (14.95) |      1,566.37 (263.93) |  -6.14% |   -3.71% (11.83 pp) |
| tuple/projection/4/replace.random      |        1,182.74 (70.7) |      1,139.18 (262.56) |  -3.68% |    -1.32% (21.2 pp) |
| tuple/tuple/4/replace.random           |         652.65 (13.28) |        681.93 (182.74) |  +4.49% |   +5.49% (21.79 pp) |
| tuple/projection/4/apply.replace       |      1,870.12 (237.13) |      1,725.94 (182.75) |  -7.71% |    -1.77% (3.28 pp) |
| tuple/tuple/4/apply.replace            |      1,113.84 (177.78) |       1,078.74 (79.02) |  -3.15% |   +0.11% (23.86 pp) |
| tuple/projection/4/apply.duplicate     |         639.53 (41.21) |         602.87 (37.84) |  -5.73% |   -6.48% (12.18 pp) |
| tuple/tuple/4/apply.duplicate          |         609.19 (50.02) |         614.28 (21.58) |  +0.84% |   +1.33% (10.82 pp) |
| tuple/projection/4/merge.duplicate     |         757.84 (10.78) |         776.27 (35.52) |  +2.43% |    +2.43% (6.93 pp) |
| tuple/tuple/4/merge.duplicate          |             798.5 (30) |         807.28 (12.67) |  +1.10% |    +4.71% (5.99 pp) |
| tuple/projection/4/length              |           28.66 (4.42) |           27.56 (2.25) |  -3.84% |    -7.92% (7.23 pp) |
| tuple/tuple/4/length                   |            28.75 (1.6) |           26.72 (0.85) |  -7.05% |    -2.97% (6.55 pp) |
| tuple/projection/4/value.random        |            43.36 (9.1) |           40.71 (0.08) |  -6.12% |   -4.73% (17.82 pp) |
| tuple/tuple/4/value.random             |           18.65 (3.22) |           18.18 (0.68) |  -2.52% |   -4.97% (17.89 pp) |
| tuple/projection/4/values              |          145.41 (9.06) |          152.46 (3.97) |  +4.85% |    +5.86% (9.16 pp) |
| tuple/tuple/4/values                   |          150.16 (6.54) |         141.42 (10.63) |  -5.82% |    -5.11% (3.66 pp) |
| tuple/projection/4/sequence            |         490.6 (109.28) |         464.58 (23.75) |  -5.30% |    -5.30% (6.36 pp) |
| tuple/tuple/4/sequence                 |        556.69 (149.37) |         574.01 (100.5) |  +3.11% |    -0.35% (6.51 pp) |
| tuple/projection/8/create.empty        |         422.12 (18.28) |          412.18 (7.91) |  -2.36% |    -5.47% (2.21 pp) |
| tuple/tuple/8/create.empty             |         435.08 (15.84) |          442.4 (11.96) |  +1.68% |     +1.68% (4.7 pp) |
| tuple/projection/8/create.sequence     |      2,240.79 (170.48) |       2,288.37 (86.26) |  +2.12% |    +2.12% (3.94 pp) |
| tuple/tuple/8/create.sequence          |      1,974.97 (152.46) |           2,041.1 (78) |  +3.35% |    +1.09% (5.46 pp) |
| tuple/projection/8/replace.random      |       1,201.97 (272.5) |      1,145.72 (102.81) |  -4.68% |   -6.57% (19.25 pp) |
| tuple/tuple/8/replace.random           |         711.66 (36.19) |         660.13 (20.23) |  -7.24% |    -9.73% (4.05 pp) |
| tuple/projection/8/apply.replace       |       1,825.86 (64.53) |      1,779.63 (108.08) |  -2.53% |    +0.04% (4.95 pp) |
| tuple/tuple/8/apply.replace            |        1,121.3 (100.8) |       1,005.12 (54.07) | -10.36% |  -10.36% (12.43 pp) |
| tuple/projection/8/apply.duplicate     |         655.66 (42.18) |         621.55 (80.47) |  -5.20% |    -2.08% (8.35 pp) |
| tuple/tuple/8/apply.duplicate          |         628.09 (39.42) |           608.69 (7.9) |  -3.09% |    -3.65% (5.32 pp) |
| tuple/projection/8/merge.duplicate     |       1,096.79 (23.74) |       1,065.51 (13.54) |  -2.85% |    -2.57% (3.01 pp) |
| tuple/tuple/8/merge.duplicate          |        1,128.77 (8.66) |       1,105.91 (55.01) |  -2.03% |    -2.35% (0.79 pp) |
| tuple/projection/8/length              |           28.36 (3.23) |           27.41 (1.06) |  -3.35% |    -5.81% (7.37 pp) |
| tuple/tuple/8/length                   |            27.96 (1.2) |            27.7 (1.73) |  -0.91% |    -4.15% (7.39 pp) |
| tuple/projection/8/value.random        |           57.7 (18.84) |           57.08 (8.53) |  -1.07% |   -9.17% (15.74 pp) |
| tuple/tuple/8/value.random             |           18.38 (0.22) |           18.29 (3.06) |  -0.44% |   -3.02% (16.81 pp) |
| tuple/projection/8/values              |         230.73 (12.24) |         242.93 (16.54) |  +5.28% |    +5.28% (4.77 pp) |
| tuple/tuple/8/values                   |         211.47 (16.97) |         216.79 (14.12) |  +2.51% |    -0.02% (8.85 pp) |
| tuple/projection/8/sequence            |         644.06 (52.75) |         680.49 (55.66) |  +5.66% |    +0.20% (7.04 pp) |
| tuple/tuple/8/sequence                 |         700.45 (90.76) |          714.74 (19.4) |  +2.04% |     +4.59% (4.8 pp) |
| tuple/projection/100/create.empty      |          466.5 (27.49) |            470.55 (53) |  +0.87% |    +5.01% (5.62 pp) |
| tuple/tuple/100/create.empty           |         461.39 (70.52) |          485.25 (5.79) |  +5.17% |    +2.49% (7.47 pp) |
| tuple/projection/100/create.sequence   |     13,951.37 (534.74) |     14,277.15 (455.19) |  +2.34% |    +3.82% (2.62 pp) |
| tuple/tuple/100/create.sequence        |   11,300.13 (1,201.59) |     11,980.3 (1,214.5) |  +6.02% |   +6.02% (15.84 pp) |
| tuple/projection/100/replace.random    |      1,213.97 (100.81) |       1,269.9 (253.64) |  +4.61% |   -0.61% (14.22 pp) |
| tuple/tuple/100/replace.random         |            659 (59.55) |          646.1 (71.35) |  -1.96% |    -2.91% (2.68 pp) |
| tuple/projection/100/apply.replace     |       1,899.24 (240.2) |      1,772.24 (101.29) |  -6.69% |    -6.69% (3.64 pp) |
| tuple/tuple/100/apply.replace          |      1,006.12 (130.84) |       1,019.81 (28.54) |  +1.36% |    -1.30% (5.08 pp) |
| tuple/projection/100/apply.duplicate   |         616.84 (120.6) |         625.04 (35.56) |  +1.33% |    +0.18% (6.65 pp) |
| tuple/tuple/100/apply.duplicate        |        621.44 (135.56) |         608.64 (15.26) |  -2.06% |   -1.08% (20.49 pp) |
| tuple/projection/100/merge.duplicate   |    9,173.79 (1,014.81) |      9,188.27 (392.58) |  +0.16% |    -0.51% (7.76 pp) |
| tuple/tuple/100/merge.duplicate        |     13,516.94 (670.41) |     13,279.98 (292.38) |  -1.75% |    -3.90% (6.63 pp) |
| tuple/projection/100/length            |           28.58 (1.88) |           27.28 (2.06) |  -4.57% |    -1.56% (3.87 pp) |
| tuple/tuple/100/length                 |           30.13 (2.47) |           28.01 (5.27) |  -7.02% |   -7.23% (17.65 pp) |
| tuple/projection/100/value.random      |           84.68 (8.48) |           80.17 (1.21) |  -5.32% |    -0.55% (8.03 pp) |
| tuple/tuple/100/value.random           |           21.24 (2.54) |           18.32 (0.12) | -13.74% |  -10.20% (21.33 pp) |
| tuple/projection/100/values            |      2,033.01 (336.93) |      1,916.07 (106.14) |  -5.75% |   -0.91% (15.22 pp) |
| tuple/tuple/100/values                 |      1,824.72 (346.04) |       1,536.61 (91.02) | -15.79% |  -15.79% (13.84 pp) |
| tuple/projection/100/sequence          |    7,173.54 (1,409.06) |       6,301.82 (67.43) | -12.15% |   -12.58% (16.9 pp) |
| tuple/tuple/100/sequence               |      6,455.79 (633.67) |      6,065.04 (701.21) |  -6.05% |    -6.05% (5.66 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |     Before |  Candidate | Change |
| ----------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                     |    480,344 |    480,344 | +0.00% |
| memory/up/1000/js                         |    407,560 |    407,560 | +0.00% |
| storage/up/1000/jsonBytes                 |    278,238 |    278,238 | +0.00% |
| storage/up/1000/jsonGzipBytes             |     14,908 |     14,908 | +0.00% |
| storage/up/1000/messagePackBytes          |    165,784 |    165,784 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |     12,641 |     12,641 | +0.00% |
| memory/up/5000/native                     |  2,156,488 |  2,156,488 | +0.00% |
| memory/up/5000/js                         |  2,059,744 |  2,059,744 | +0.00% |
| storage/up/5000/jsonBytes                 |  1,662,776 |  1,662,776 | +0.00% |
| storage/up/5000/jsonGzipBytes             |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes          |    839,612 |    839,612 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |     63,127 |     63,127 | +0.00% |
| memory/up/10000/native                    |  3,567,200 |  3,567,200 | +0.00% |
| memory/up/10000/js                        |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes                |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes            |    152,232 |    152,232 | +0.00% |
| storage/up/10000/messagePackBytes         |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |    127,808 |    127,808 | +0.00% |
| memory/up/15000/native                    |  4,819,528 |  4,819,528 | +0.00% |
| memory/up/15000/js                        |  6,196,128 |  6,196,128 | +0.00% |
| storage/up/15000/jsonBytes                |  5,053,159 |  5,053,159 | +0.00% |
| storage/up/15000/jsonGzipBytes            |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes         |  3,635,106 |  3,635,106 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                    |  6,317,656 |  6,317,656 | +0.00% |
| memory/up/20000/js                        |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes                |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes            |    318,634 |    318,634 | +0.00% |
| storage/up/20000/messagePackBytes         |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |    269,890 |    269,890 | +0.00% |
| memory/up/25000/native                    |  7,541,536 |  7,541,536 | +0.00% |
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
| memory/down/1000/native                   |  2,719,360 |  2,719,360 | +0.00% |
| memory/down/1000/js                       |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes               |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes           |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes        |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |     13,932 |     13,932 | +0.00% |
| memory/down/0/native                      |  1,597,976 |  1,597,976 | +0.00% |
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
