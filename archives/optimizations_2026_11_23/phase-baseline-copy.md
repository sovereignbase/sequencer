# Lifecycle and tuple identical-source control

5 complete matched runs per build. Before: baseline; candidate: baseline-copy. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 11 timing medians improve over 5%; 13 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                    |           Before (IQR) |        Candidate (IQR) |  Change | Paired change (IQR) |
| -------------------------------------- | ---------------------: | ---------------------: | ------: | ------------------: |
| lifecycle/scaleUp/apply.random         |      3,572.89 (172.65) |        3,676.8 (335.6) |  +2.91% |    +0.35% (5.64 pp) |
| lifecycle/scaleUp/insert.head          |          804.3 (89.36) |         811.02 (21.11) |  +0.84% |    +0.63% (3.55 pp) |
| lifecycle/scaleUp/insert.random        |         1,595.4 (72.9) |      1,592.66 (109.73) |  -0.17% |    +0.93% (3.33 pp) |
| lifecycle/scaleUp/insert.tail          |         714.99 (82.21) |        817.38 (114.41) | +14.32% |    -1.05% (6.02 pp) |
| lifecycle/scaleUp/remove.random        |       2,498.5 (318.96) |      2,709.59 (210.62) |  +8.45% |    +5.36% (4.51 pp) |
| lifecycle/scaleUp/replace.head         |      2,544.65 (294.05) |      2,428.08 (112.91) |  -4.58% |    -3.17% (5.97 pp) |
| lifecycle/scaleUp/replace.random       |      3,432.71 (411.57) |      3,149.99 (148.09) |  -8.24% |   -0.07% (12.79 pp) |
| lifecycle/scaleUp/replace.tail         |      2,334.47 (343.36) |       2,220.17 (80.68) |  -4.90% |    -1.21% (7.86 pp) |
| lifecycle/scaleUp/value.head           |          304.92 (8.14) |         305.86 (17.71) |  +0.31% |     -1.16% (4.6 pp) |
| lifecycle/scaleUp/value.random         |       1,010.43 (35.28) |         999.79 (27.26) |  -1.05% |    -1.44% (5.58 pp) |
| lifecycle/scaleUp/value.tail           |          146.33 (6.58) |         152.18 (10.21) |  +4.00% |    +2.35% (8.04 pp) |
| lifecycle/scaleDown/apply.random       |       3,231.83 (48.93) |      3,259.79 (245.38) |  +0.87% |    +0.99% (6.43 pp) |
| lifecycle/scaleDown/insert.random      |       1,597.44 (39.18) |       1,555.22 (24.07) |  -2.64% |    -2.51% (1.86 pp) |
| lifecycle/scaleDown/remove.head        |       1,818.22 (43.11) |      1,970.54 (190.76) |  +8.38% |   +8.13% (12.19 pp) |
| lifecycle/scaleDown/remove.random      |        2,424.9 (11.82) |      2,456.77 (159.62) |  +1.31% |    +1.34% (4.31 pp) |
| lifecycle/scaleDown/remove.tail        |      1,628.08 (112.35) |      1,695.92 (153.67) |  +4.17% |    +2.94% (7.61 pp) |
| lifecycle/scaleDown/replace.head       |       2,322.73 (63.21) |      2,384.44 (215.99) |  +2.66% |    +4.00% (1.52 pp) |
| lifecycle/scaleDown/replace.random     |       2,990.97 (66.81) |      3,063.94 (348.38) |  +2.44% |    +2.44% (9.22 pp) |
| lifecycle/scaleDown/replace.tail       |     17,847.89 (698.06) |     17,549.04 (489.54) |  -1.67% |    +0.10% (1.56 pp) |
| lifecycle/scaleDown/value.head         |          396.45 (5.87) |          396.67 (8.61) |  +0.05% |    -0.51% (1.87 pp) |
| lifecycle/scaleDown/value.random       |         976.22 (26.98) |          946.03 (9.19) |  -3.09% |    -1.43% (2.36 pp) |
| lifecycle/scaleDown/value.tail         |          219.01 (5.35) |          219.99 (2.35) |  +0.45% |     +0.45% (1.6 pp) |
| lifecycle/fullLifecycle/apply.random   |       3,380.43 (99.56) |      3,590.45 (151.52) |  +6.21% |    +1.15% (8.35 pp) |
| lifecycle/fullLifecycle/insert.head    |          804.3 (89.36) |         811.02 (21.11) |  +0.84% |    +0.63% (3.55 pp) |
| lifecycle/fullLifecycle/insert.random  |       1,607.19 (16.44) |       1,600.65 (36.46) |  -0.41% |    -0.82% (2.16 pp) |
| lifecycle/fullLifecycle/insert.tail    |         714.99 (82.21) |        817.38 (114.41) | +14.32% |    -1.05% (6.02 pp) |
| lifecycle/fullLifecycle/remove.head    |       1,818.22 (43.11) |      1,970.54 (190.76) |  +8.38% |   +8.13% (12.19 pp) |
| lifecycle/fullLifecycle/remove.random  |      2,585.51 (162.46) |      2,562.29 (130.22) |  -0.90% |     +5.25% (2.2 pp) |
| lifecycle/fullLifecycle/remove.tail    |      1,628.08 (112.35) |      1,695.92 (153.67) |  +4.17% |    +2.94% (7.61 pp) |
| lifecycle/fullLifecycle/replace.head   |      2,452.78 (159.54) |       2,442.7 (165.55) |  -0.41% |    +2.12% (2.64 pp) |
| lifecycle/fullLifecycle/replace.random |      3,202.06 (208.17) |       3,241.1 (368.74) |  +1.22% |    +0.96% (2.62 pp) |
| lifecycle/fullLifecycle/replace.tail   |     10,195.47 (194.68) |     10,095.82 (289.75) |  -0.98% |    +0.36% (2.57 pp) |
| lifecycle/fullLifecycle/value.head     |         350.68 (10.19) |          351.26 (6.55) |  +0.17% |    -0.46% (0.86 pp) |
| lifecycle/fullLifecycle/value.random   |         983.41 (10.53) |         974.83 (28.79) |  -0.87% |    -2.53% (3.45 pp) |
| lifecycle/fullLifecycle/value.tail     |          184.33 (5.97) |         186.08 (10.14) |  +0.95% |    +1.65% (2.16 pp) |
| checkpoint/up/1000/create              |       372,400 (24,600) |       381,800 (56,500) |  +2.52% |    +4.16% (4.84 pp) |
| checkpoint/up/1000/sequence            |    2,356,200 (250,000) |    2,632,700 (604,600) | +11.73% |   +15.70% (18.3 pp) |
| checkpoint/up/1000/values              |    1,697,000 (142,000) |    1,749,400 (528,000) |  +3.09% |   +3.98% (13.25 pp) |
| checkpoint/up/5000/create              |       857,500 (30,600) |        861,000 (8,800) |  +0.41% |    +1.76% (5.26 pp) |
| checkpoint/up/5000/sequence            |     7,763,700 (12,900) |    7,780,900 (600,000) |  +0.22% |   -4.02% (15.94 pp) |
| checkpoint/up/5000/values              |    4,687,100 (521,000) |  4,793,100 (1,322,400) |  +2.26% |  +10.70% (26.59 pp) |
| checkpoint/up/10000/create             |     1,483,500 (57,200) |     1,520,900 (62,300) |  +2.52% |    +0.89% (0.63 pp) |
| checkpoint/up/10000/sequence           |   13,125,300 (898,000) | 13,216,900 (3,280,900) |  +0.70% |   -0.82% (31.49 pp) |
| checkpoint/up/10000/values             |    19,935,900 (80,800) | 19,738,300 (1,013,100) |  -0.99% |    -0.48% (5.46 pp) |
| checkpoint/up/15000/create             |     2,428,100 (85,000) |    2,343,700 (110,300) |  -3.48% |    -1.02% (7.07 pp) |
| checkpoint/up/15000/sequence           |   13,959,800 (341,400) |   14,235,900 (602,700) |  +1.98% |    +0.05% (8.03 pp) |
| checkpoint/up/15000/values             | 28,088,900 (1,555,400) | 29,200,200 (1,683,500) |  +3.96% |     +3.76% (3.1 pp) |
| checkpoint/up/20000/create             |     3,261,700 (44,800) |     3,275,000 (10,800) |  +0.41% |    +0.21% (1.54 pp) |
| checkpoint/up/20000/sequence           |   20,065,000 (324,800) |   19,965,200 (888,900) |  -0.50% |    -0.50% (2.81 pp) |
| checkpoint/up/20000/values             |     9,867,300 (20,100) |    9,941,000 (698,300) |  +0.75% |    +0.75% (4.85 pp) |
| checkpoint/up/25000/create             |     3,978,300 (82,000) |    3,974,500 (145,600) |  -0.10% |    +0.51% (4.75 pp) |
| checkpoint/up/25000/sequence           | 22,814,300 (2,413,700) |   22,073,800 (607,100) |  -3.25% |   -3.32% (12.46 pp) |
| checkpoint/up/25000/values             |   11,143,500 (468,300) |   10,724,200 (456,400) |  -3.76% |    -6.33% (4.77 pp) |
| checkpoint/down/20000/create           |     3,425,800 (82,800) |     3,365,600 (13,700) |  -1.76% |    -0.33% (1.93 pp) |
| checkpoint/down/20000/sequence         |   17,716,200 (786,800) | 18,046,200 (2,502,200) |  +1.86% |    +2.95% (8.34 pp) |
| checkpoint/down/20000/values           |    8,578,900 (352,500) |    8,911,600 (710,600) |  +3.88% |    -0.06% (3.03 pp) |
| checkpoint/down/15000/create           |     2,368,300 (25,400) |     2,378,900 (27,500) |  +0.45% |    +0.49% (0.49 pp) |
| checkpoint/down/15000/sequence         |   14,903,900 (848,100) |   15,110,800 (285,500) |  +1.39% |    +3.49% (4.71 pp) |
| checkpoint/down/15000/values           |    7,134,800 (169,800) |    6,753,800 (389,100) |  -5.34% |     -4.36% (7.7 pp) |
| checkpoint/down/10000/create           |    1,657,000 (117,300) |     1,623,000 (33,900) |  -2.05% |       -0.17% (6 pp) |
| checkpoint/down/10000/sequence         | 12,629,000 (1,838,900) |   11,847,900 (766,800) |  -6.18% |   -0.12% (16.63 pp) |
| checkpoint/down/10000/values           |    5,183,900 (365,000) |  5,003,000 (1,574,500) |  -3.49% |  +11.33% (38.12 pp) |
| checkpoint/down/5000/create            |       789,400 (19,400) |       791,100 (13,100) |  +0.22% |    +0.46% (1.68 pp) |
| checkpoint/down/5000/sequence          |    8,989,600 (366,000) |    9,480,500 (338,800) |  +5.46% |    +3.34% (4.98 pp) |
| checkpoint/down/5000/values            |    2,900,100 (493,700) |    2,437,600 (825,300) | -15.95% |  -12.89% (15.48 pp) |
| checkpoint/down/1000/create            |        154,800 (8,400) |       154,700 (32,900) |  -0.06% |   +7.11% (20.57 pp) |
| checkpoint/down/1000/sequence          |    5,409,800 (205,900) |    5,615,200 (400,800) |  +3.80% |    -1.34% (4.29 pp) |
| checkpoint/down/1000/values            |       479,300 (56,300) |       454,900 (58,000) |  -5.09% |    -3.09% (4.97 pp) |
| checkpoint/down/0/create               |         16,300 (5,400) |         18,600 (1,500) | +14.11% |   +5.52% (52.41 pp) |
| checkpoint/down/0/sequence             |    1,596,100 (469,600) |    1,242,100 (368,500) | -22.18% |    -4.55% (2.54 pp) |
| checkpoint/down/0/values               |         10,400 (2,200) |           10,300 (500) |  -0.96% |   -0.96% (21.71 pp) |
| tuple/projection/2/create.empty        |         353.56 (27.09) |         334.49 (17.07) |  -5.39% |    -7.07% (3.45 pp) |
| tuple/tuple/2/create.empty             |         405.47 (15.06) |         410.11 (19.74) |  +1.14% |    +5.49% (8.87 pp) |
| tuple/projection/2/create.sequence     |       1,106.75 (160.6) |       1,120.72 (23.23) |  +1.26% |   -0.14% (15.52 pp) |
| tuple/tuple/2/create.sequence          |       1,372.66 (60.23) |       1,369.52 (146.2) |  -0.23% |    -4.00% (5.01 pp) |
| tuple/projection/2/replace.random      |          982.45 (5.25) |         953.17 (55.05) |  -2.98% |    -2.79% (5.92 pp) |
| tuple/tuple/2/replace.random           |         661.97 (66.22) |         627.41 (65.47) |  -5.22% |   -9.27% (15.56 pp) |
| tuple/projection/2/apply.replace       |       1,814.95 (376.3) |       1,549.12 (40.13) | -14.65% |  -17.09% (20.56 pp) |
| tuple/tuple/2/apply.replace            |       1,092.51 (28.66) |       1,070.33 (63.17) |  -2.03% |    +0.93% (3.16 pp) |
| tuple/projection/2/apply.duplicate     |         575.08 (23.08) |         574.58 (43.83) |  -0.09% |    -0.09% (9.11 pp) |
| tuple/tuple/2/apply.duplicate          |           586.9 (7.31) |         570.51 (20.59) |  -2.79% |     -1.41% (4.3 pp) |
| tuple/projection/2/merge.duplicate     |         618.65 (44.02) |         592.16 (42.89) |  -4.28% |    -4.09% (7.39 pp) |
| tuple/tuple/2/merge.duplicate          |          577.41 (44.2) |         579.59 (23.37) |  +0.38% |    -1.16% (2.73 pp) |
| tuple/projection/2/length              |            7.04 (0.15) |            7.22 (0.06) |  +2.51% |    +2.51% (2.75 pp) |
| tuple/tuple/2/length                   |            7.08 (0.11) |             7.21 (0.2) |  +1.75% |    +2.42% (6.24 pp) |
| tuple/projection/2/value.random        |           28.64 (1.99) |            28.4 (1.89) |  -0.85% |   +0.82% (16.25 pp) |
| tuple/tuple/2/value.random             |           18.38 (0.58) |           18.38 (0.68) |  -0.02% |    -1.11% (6.98 pp) |
| tuple/projection/2/values              |           72.15 (1.88) |           73.58 (4.26) |  +1.98% |    +1.51% (4.45 pp) |
| tuple/tuple/2/values                   |           77.15 (2.32) |           77.92 (4.19) |  +0.99% |    -0.56% (11.5 pp) |
| tuple/projection/2/sequence            |         430.49 (37.37) |         430.22 (31.73) |  -0.06% |   -0.45% (15.08 pp) |
| tuple/tuple/2/sequence                 |         465.68 (79.24) |         449.73 (48.57) |  -3.43% |   +4.74% (29.72 pp) |
| tuple/projection/4/create.empty        |         440.46 (44.29) |         395.96 (20.15) | -10.10% |    -6.14% (4.25 pp) |
| tuple/tuple/4/create.empty             |         413.84 (11.72) |         420.89 (23.35) |  +1.70% |    +0.53% (6.19 pp) |
| tuple/projection/4/create.sequence     |       1,623.25 (35.33) |       1,592.57 (14.25) |  -1.89% |    -2.14% (5.24 pp) |
| tuple/tuple/4/create.sequence          |       1,496.88 (94.51) |        1,524.2 (36.83) |  +1.83% |   +2.45% (10.62 pp) |
| tuple/projection/4/replace.random      |      1,135.42 (108.88) |       1,114.87 (49.31) |  -1.81% |    +0.88% (8.54 pp) |
| tuple/tuple/4/replace.random           |           615.03 (8.7) |         623.43 (28.09) |  +1.37% |    +0.40% (4.46 pp) |
| tuple/projection/4/apply.replace       |       1,624.61 (71.05) |       1,606.99 (45.07) |  -1.08% |    -3.78% (7.03 pp) |
| tuple/tuple/4/apply.replace            |       1,041.12 (30.27) |       1,021.83 (21.74) |  -1.85% |    -1.65% (3.52 pp) |
| tuple/projection/4/apply.duplicate     |         577.98 (28.18) |          579.77 (32.1) |  +0.31% |    +1.09% (1.74 pp) |
| tuple/tuple/4/apply.duplicate          |         599.34 (23.55) |           598.98 (9.5) |  -0.06% |    +1.26% (2.68 pp) |
| tuple/projection/4/merge.duplicate     |         731.83 (29.32) |         721.78 (87.61) |  -1.37% |    -1.16% (8.08 pp) |
| tuple/tuple/4/merge.duplicate          |          770.06 (2.48) |        809.23 (208.88) |  +5.09% |   +5.09% (29.39 pp) |
| tuple/projection/4/length              |           27.01 (0.65) |           28.33 (2.31) |  +4.87% |    +3.79% (7.08 pp) |
| tuple/tuple/4/length                   |           25.69 (1.28) |           26.03 (0.58) |  +1.30% |    +0.15% (7.77 pp) |
| tuple/projection/4/value.random        |           39.76 (1.16) |           39.53 (3.35) |  -0.56% |    +5.78% (5.72 pp) |
| tuple/tuple/4/value.random             |           17.89 (1.46) |            17.19 (1.3) |  -3.91% |   -5.17% (12.81 pp) |
| tuple/projection/4/values              |          142.82 (0.78) |         151.83 (11.65) |  +6.31% |    +6.10% (14.1 pp) |
| tuple/tuple/4/values                   |          141.41 (5.49) |          140.38 (8.06) |  -0.72% |    -4.21% (5.79 pp) |
| tuple/projection/4/sequence            |         444.42 (14.77) |          464.5 (57.96) |  +4.52% |   +5.86% (17.35 pp) |
| tuple/tuple/4/sequence                 |         526.46 (33.39) |          512.77 (4.94) |  -2.60% |    -1.85% (6.19 pp) |
| tuple/projection/8/create.empty        |         400.23 (15.31) |         387.36 (16.29) |  -3.22% |   -0.16% (10.14 pp) |
| tuple/tuple/8/create.empty             |         438.79 (29.15) |          420.1 (18.78) |  -4.26% |    -3.00% (6.93 pp) |
| tuple/projection/8/create.sequence     |      2,192.92 (132.24) |       2,286.31 (64.46) |  +4.26% |    +4.57% (6.27 pp) |
| tuple/tuple/8/create.sequence          |       1,970.14 (59.67) |        1,908.8 (51.99) |  -3.11% |    -2.14% (7.93 pp) |
| tuple/projection/8/replace.random      |      1,095.25 (159.26) |       1,129.34 (93.38) |  +3.11% |    +3.11% (6.04 pp) |
| tuple/tuple/8/replace.random           |         625.65 (18.65) |          617.28 (4.76) |  -1.34% |    -1.22% (6.17 pp) |
| tuple/projection/8/apply.replace       |       1,754.5 (168.58) |      1,686.48 (110.45) |  -3.88% |    -2.87% (9.31 pp) |
| tuple/tuple/8/apply.replace            |         936.04 (86.17) |        1,020.65 (85.5) |  +9.04% |   +0.28% (19.44 pp) |
| tuple/projection/8/apply.duplicate     |         584.45 (38.92) |         582.16 (16.37) |  -0.39% |    -1.80% (6.61 pp) |
| tuple/tuple/8/apply.duplicate          |         593.56 (45.18) |         589.79 (16.85) |  -0.63% |    +0.18% (4.49 pp) |
| tuple/projection/8/merge.duplicate     |       1,010.82 (58.88) |        1,046.4 (58.29) |  +3.52% |     +1.21% (2.5 pp) |
| tuple/tuple/8/merge.duplicate          |       1,141.99 (46.06) |        1,075.24 (12.1) |  -5.85% |    -3.75% (9.51 pp) |
| tuple/projection/8/length              |           28.06 (4.97) |           26.55 (1.99) |  -5.38% |   +3.59% (11.48 pp) |
| tuple/tuple/8/length                   |            26.16 (0.5) |              26.45 (1) |  +1.12% |    +0.66% (7.95 pp) |
| tuple/projection/8/value.random        |           51.06 (3.48) |           50.74 (1.46) |  -0.63% |    +0.45% (2.12 pp) |
| tuple/tuple/8/value.random             |           18.33 (1.47) |           17.69 (2.04) |  -3.49% |    -3.29% (4.64 pp) |
| tuple/projection/8/values              |          214.62 (8.62) |         215.46 (11.45) |  +0.39% |    +5.20% (5.32 pp) |
| tuple/tuple/8/values                   |          207.65 (10.3) |         206.54 (13.07) |  -0.54% |    +0.86% (7.62 pp) |
| tuple/projection/8/sequence            |         602.91 (13.84) |         615.97 (20.87) |  +2.17% |    +3.07% (3.47 pp) |
| tuple/tuple/8/sequence                 |         657.38 (30.84) |         647.83 (13.54) |  -1.45% |    +0.26% (6.09 pp) |
| tuple/projection/100/create.empty      |         434.88 (10.41) |         413.72 (34.39) |  -4.87% |    +0.46% (5.69 pp) |
| tuple/tuple/100/create.empty           |         449.58 (40.17) |          449.47 (35.7) |  -0.02% |    +0.97% (8.91 pp) |
| tuple/projection/100/create.sequence   |     13,419.63 (239.36) |     13,398.85 (478.91) |  -0.15% |     -0.15% (6.8 pp) |
| tuple/tuple/100/create.sequence        |     11,291.51 (724.37) |      10,953.1 (266.75) |  -3.00% |    -3.00% (2.82 pp) |
| tuple/projection/100/replace.random    |        1,121.46 (5.28) |        1,157.66 (9.98) |  +3.23% |    +3.56% (1.04 pp) |
| tuple/tuple/100/replace.random         |          597.74 (6.76) |          618.99 (26.2) |  +3.55% |       +4.21% (5 pp) |
| tuple/projection/100/apply.replace     |       1,729.51 (51.79) |        1,694.38 (20.9) |  -2.03% |    -4.03% (3.42 pp) |
| tuple/tuple/100/apply.replace          |         972.26 (83.21) |          952.52 (5.57) |  -2.03% |     -3.37% (1.2 pp) |
| tuple/projection/100/apply.duplicate   |         603.02 (54.34) |         577.78 (19.38) |  -4.19% |   -3.88% (11.43 pp) |
| tuple/tuple/100/apply.duplicate        |         602.41 (46.73) |          594.54 (9.32) |  -1.31% |    -2.63% (5.15 pp) |
| tuple/projection/100/merge.duplicate   |      9,012.72 (570.76) |       8,689.69 (84.31) |  -3.58% |    -3.21% (6.59 pp) |
| tuple/tuple/100/merge.duplicate        |     12,508.81 (759.16) |     12,861.11 (407.79) |  +2.82% |    +1.73% (4.81 pp) |
| tuple/projection/100/length            |           26.37 (1.17) |            27.5 (1.92) |  +4.26% |    +1.03% (5.54 pp) |
| tuple/tuple/100/length                 |           26.29 (1.57) |           26.31 (4.94) |  +0.08% |   +6.33% (13.38 pp) |
| tuple/projection/100/value.random      |           76.87 (0.03) |          80.06 (10.15) |  +4.16% |    +1.19% (7.35 pp) |
| tuple/tuple/100/value.random           |            17.1 (0.73) |           17.71 (1.19) |  +3.61% |    +1.87% (5.47 pp) |
| tuple/projection/100/values            |       1,820.46 (66.01) |       1,941.06 (88.82) |  +6.63% |    +6.63% (4.55 pp) |
| tuple/tuple/100/values                 |       1,500.63 (72.87) |       1,506.8 (137.54) |  +0.41% |    +2.84% (8.19 pp) |
| tuple/projection/100/sequence          |      6,123.25 (449.36) |      6,039.87 (305.03) |  -1.36% |   +4.98% (10.65 pp) |
| tuple/tuple/100/sequence               |      5,442.63 (180.62) |      5,473.31 (280.93) |  +0.56% |    +4.34% (5.68 pp) |

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
