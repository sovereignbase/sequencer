# Lifecycle and tuple controls

5 complete matched runs per build. Before: baseline; candidate: compact-ack. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 14 timing medians improve over 5%; 12 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                    |           Before (IQR) |        Candidate (IQR) |  Change | Paired change (IQR) |
| -------------------------------------- | ---------------------: | ---------------------: | ------: | ------------------: |
| lifecycle/scaleUp/apply.random         |      3,572.89 (172.65) |      3,927.06 (651.75) |  +9.91% |   +11.46% (5.61 pp) |
| lifecycle/scaleUp/insert.head          |          804.3 (89.36) |          782.62 (9.18) |  -2.69% |    -2.63% (4.92 pp) |
| lifecycle/scaleUp/insert.random        |         1,595.4 (72.9) |      1,623.94 (218.57) |  +1.79% |    -0.31% (9.66 pp) |
| lifecycle/scaleUp/insert.tail          |         714.99 (82.21) |         743.99 (57.09) |  +4.06% |    +1.07% (6.43 pp) |
| lifecycle/scaleUp/remove.random        |       2,498.5 (318.96) |      2,562.08 (260.35) |  +2.55% |    -0.52% (1.07 pp) |
| lifecycle/scaleUp/replace.head         |      2,544.65 (294.05) |       2,316.4 (125.22) |  -8.97% |   -0.87% (14.39 pp) |
| lifecycle/scaleUp/replace.random       |      3,432.71 (411.57) |       3,424.15 (294.6) |  -0.25% |    +1.91% (4.14 pp) |
| lifecycle/scaleUp/replace.tail         |      2,334.47 (343.36) |       2,274.2 (160.31) |  -2.58% |   -3.42% (19.87 pp) |
| lifecycle/scaleUp/value.head           |          304.92 (8.14) |         317.59 (10.82) |  +4.16% |    +4.16% (4.26 pp) |
| lifecycle/scaleUp/value.random         |       1,010.43 (35.28) |         991.49 (42.96) |  -1.87% |    -0.39% (2.25 pp) |
| lifecycle/scaleUp/value.tail           |          146.33 (6.58) |          148.51 (9.45) |  +1.49% |    +2.29% (4.08 pp) |
| lifecycle/scaleDown/apply.random       |       3,231.83 (48.93) |       3,221.87 (19.14) |  -0.31% |     -0.61% (0.8 pp) |
| lifecycle/scaleDown/insert.random      |       1,597.44 (39.18) |        1,568.94 (59.7) |  -1.78% |    -1.64% (2.89 pp) |
| lifecycle/scaleDown/remove.head        |       1,818.22 (43.11) |        1,832.01 (2.73) |  +0.76% |    +0.76% (5.17 pp) |
| lifecycle/scaleDown/remove.random      |        2,424.9 (11.82) |      2,683.06 (361.18) | +10.65% |   +1.69% (19.81 pp) |
| lifecycle/scaleDown/remove.tail        |      1,628.08 (112.35) |       1,672.34 (97.67) |  +2.72% |   +4.57% (12.61 pp) |
| lifecycle/scaleDown/replace.head       |       2,322.73 (63.21) |      2,580.86 (269.86) | +11.11% |   +3.32% (15.44 pp) |
| lifecycle/scaleDown/replace.random     |       2,990.97 (66.81) |       3,227.68 (210.1) |  +7.91% |    +1.61% (7.65 pp) |
| lifecycle/scaleDown/replace.tail       |     17,847.89 (698.06) |      17,878.15 (609.2) |  +0.17% |    -1.93% (7.34 pp) |
| lifecycle/scaleDown/value.head         |          396.45 (5.87) |          389.11 (12.9) |  -1.85% |    +1.13% (2.76 pp) |
| lifecycle/scaleDown/value.random       |         976.22 (26.98) |         941.89 (13.88) |  -3.52% |    -2.86% (2.25 pp) |
| lifecycle/scaleDown/value.tail         |          219.01 (5.35) |          219.88 (7.27) |  +0.40% |     +0.40% (6.9 pp) |
| lifecycle/fullLifecycle/apply.random   |       3,380.43 (99.56) |      3,530.53 (328.95) |  +4.44% |    +5.19% (2.94 pp) |
| lifecycle/fullLifecycle/insert.head    |          804.3 (89.36) |          782.62 (9.18) |  -2.69% |    -2.63% (4.92 pp) |
| lifecycle/fullLifecycle/insert.random  |       1,607.19 (16.44) |      1,571.56 (122.22) |  -2.22% |    -1.32% (6.32 pp) |
| lifecycle/fullLifecycle/insert.tail    |         714.99 (82.21) |         743.99 (57.09) |  +4.06% |    +1.07% (6.43 pp) |
| lifecycle/fullLifecycle/remove.head    |       1,818.22 (43.11) |        1,832.01 (2.73) |  +0.76% |    +0.76% (5.17 pp) |
| lifecycle/fullLifecycle/remove.random  |      2,585.51 (162.46) |       2,555.6 (131.02) |  -1.16% |      -1.57% (12 pp) |
| lifecycle/fullLifecycle/remove.tail    |      1,628.08 (112.35) |       1,672.34 (97.67) |  +2.72% |   +4.57% (12.61 pp) |
| lifecycle/fullLifecycle/replace.head   |      2,452.78 (159.54) |       2,485.35 (174.5) |  +1.33% |   +8.84% (13.52 pp) |
| lifecycle/fullLifecycle/replace.random |      3,202.06 (208.17) |       3,230.88 (67.64) |  +0.90% |    +1.61% (3.89 pp) |
| lifecycle/fullLifecycle/replace.tail   |     10,195.47 (194.68) |     10,066.43 (187.56) |  -1.27% |    -2.10% (3.31 pp) |
| lifecycle/fullLifecycle/value.head     |         350.68 (10.19) |            352 (11.11) |  +0.38% |    +2.44% (3.57 pp) |
| lifecycle/fullLifecycle/value.random   |         983.41 (10.53) |         964.31 (34.03) |  -1.94% |    -1.08% (1.52 pp) |
| lifecycle/fullLifecycle/value.tail     |          184.33 (5.97) |          182.86 (8.28) |  -0.80% |    +2.01% (5.17 pp) |
| checkpoint/up/1000/create              |       372,400 (24,600) |       384,200 (38,400) |  +3.17% |    +3.53% (3.72 pp) |
| checkpoint/up/1000/sequence            |    2,356,200 (250,000) |    2,482,600 (214,600) |  +5.36% |    +5.36% (5.31 pp) |
| checkpoint/up/1000/values              |    1,697,000 (142,000) |    1,771,200 (212,300) |  +4.37% |    +3.52% (2.09 pp) |
| checkpoint/up/5000/create              |       857,500 (30,600) |       853,900 (17,000) |  -0.42% |    -2.38% (10.2 pp) |
| checkpoint/up/5000/sequence            |     7,763,700 (12,900) |    7,723,900 (387,900) |  -0.51% |   -0.66% (11.98 pp) |
| checkpoint/up/5000/values              |    4,687,100 (521,000) |    4,693,000 (467,200) |  +0.13% |    +1.24% (3.84 pp) |
| checkpoint/up/10000/create             |     1,483,500 (57,200) |    1,568,800 (163,400) |  +5.75% |    +1.90% (7.56 pp) |
| checkpoint/up/10000/sequence           |   13,125,300 (898,000) |   13,056,500 (849,500) |  -0.52% |    -2.66% (2.49 pp) |
| checkpoint/up/10000/values             |    19,935,900 (80,800) | 20,092,600 (1,085,800) |  +0.79% |    +0.79% (8.04 pp) |
| checkpoint/up/15000/create             |     2,428,100 (85,000) |    2,395,800 (123,600) |  -1.33% |    +2.34% (2.97 pp) |
| checkpoint/up/15000/sequence           |   13,959,800 (341,400) |   14,021,600 (682,900) |  +0.44% |   +4.62% (10.34 pp) |
| checkpoint/up/15000/values             | 28,088,900 (1,555,400) |   29,195,800 (845,700) |  +3.94% |     -1.54% (8.5 pp) |
| checkpoint/up/20000/create             |     3,261,700 (44,800) |    3,263,000 (143,600) |  +0.04% |    +0.04% (6.17 pp) |
| checkpoint/up/20000/sequence           |   20,065,000 (324,800) | 20,533,800 (1,067,400) |  +2.34% |    +3.47% (6.07 pp) |
| checkpoint/up/20000/values             |     9,867,300 (20,100) |    9,817,100 (107,600) |  -0.51% |    +0.13% (6.08 pp) |
| checkpoint/up/25000/create             |     3,978,300 (82,000) |    3,962,900 (116,900) |  -0.39% |    -0.82% (4.31 pp) |
| checkpoint/up/25000/sequence           | 22,814,300 (2,413,700) | 22,541,500 (5,709,900) |  -1.20% |    +5.26% (22.4 pp) |
| checkpoint/up/25000/values             |   11,143,500 (468,300) |   11,280,000 (762,600) |  +1.22% |    -1.48% (3.46 pp) |
| checkpoint/down/20000/create           |     3,425,800 (82,800) |     3,382,600 (89,500) |  -1.26% |    -0.84% (0.61 pp) |
| checkpoint/down/20000/sequence         |   17,716,200 (786,800) |   17,958,300 (581,400) |  +1.37% |    -0.84% (1.33 pp) |
| checkpoint/down/20000/values           |    8,578,900 (352,500) |    8,911,300 (936,100) |  +3.87% |    +3.87% (6.45 pp) |
| checkpoint/down/15000/create           |     2,368,300 (25,400) |     2,436,600 (69,100) |  +2.88% |    +2.53% (3.43 pp) |
| checkpoint/down/15000/sequence         |   14,903,900 (848,100) |   14,795,600 (119,900) |  -0.73% |    +1.88% (6.23 pp) |
| checkpoint/down/15000/values           |    7,134,800 (169,800) |    7,031,600 (503,900) |  -1.45% |   -6.82% (17.09 pp) |
| checkpoint/down/10000/create           |    1,657,000 (117,300) |     1,654,000 (46,800) |  -0.18% |    +0.82% (4.83 pp) |
| checkpoint/down/10000/sequence         | 12,629,000 (1,838,900) |    11,675,600 (10,000) |  -7.55% |   -7.48% (15.77 pp) |
| checkpoint/down/10000/values           |    5,183,900 (365,000) |    5,086,100 (118,900) |  -1.89% |    -4.79% (9.91 pp) |
| checkpoint/down/5000/create            |       789,400 (19,400) |       789,900 (27,400) |  +0.06% |    -1.89% (4.22 pp) |
| checkpoint/down/5000/sequence          |    8,989,600 (366,000) |     8,940,500 (28,600) |  -0.55% |    -3.36% (8.49 pp) |
| checkpoint/down/5000/values            |    2,900,100 (493,700) |    2,791,600 (447,500) |  -3.74% |    -3.74% (9.61 pp) |
| checkpoint/down/1000/create            |        154,800 (8,400) |        165,600 (9,200) |  +6.98% |    +9.43% (9.53 pp) |
| checkpoint/down/1000/sequence          |    5,409,800 (205,900) |    5,667,300 (348,400) |  +4.76% |    +5.64% (9.46 pp) |
| checkpoint/down/1000/values            |       479,300 (56,300) |       493,100 (36,900) |  +2.88% |   +0.86% (17.42 pp) |
| checkpoint/down/0/create               |         16,300 (5,400) |           14,600 (400) | -10.43% |  -10.43% (38.31 pp) |
| checkpoint/down/0/sequence             |    1,596,100 (469,600) |     1,255,700 (79,900) | -21.33% |  -22.56% (34.64 pp) |
| checkpoint/down/0/values               |         10,400 (2,200) |           10,400 (500) |  +0.00% |   +1.92% (27.79 pp) |
| tuple/projection/2/create.empty        |         353.56 (27.09) |         338.79 (17.42) |  -4.18% |    -4.96% (5.68 pp) |
| tuple/tuple/2/create.empty             |         405.47 (15.06) |         395.25 (17.98) |  -2.52% |    +0.50% (2.03 pp) |
| tuple/projection/2/create.sequence     |       1,106.75 (160.6) |       1,127.67 (18.81) |  +1.89% |   +2.98% (15.88 pp) |
| tuple/tuple/2/create.sequence          |       1,372.66 (60.23) |       1,323.97 (25.56) |  -3.55% |    -6.89% (3.47 pp) |
| tuple/projection/2/replace.random      |          982.45 (5.25) |         946.95 (95.87) |  -3.61% |    -1.69% (9.89 pp) |
| tuple/tuple/2/replace.random           |         661.97 (66.22) |        676.44 (158.25) |  +2.19% |   +8.59% (26.83 pp) |
| tuple/projection/2/apply.replace       |       1,814.95 (376.3) |      1,495.53 (211.57) | -17.60% |   -8.33% (25.09 pp) |
| tuple/tuple/2/apply.replace            |       1,092.51 (28.66) |       1,044.14 (98.21) |  -4.43% |   -4.64% (13.25 pp) |
| tuple/projection/2/apply.duplicate     |         575.08 (23.08) |         543.48 (44.17) |  -5.49% |    -1.79% (9.59 pp) |
| tuple/tuple/2/apply.duplicate          |           586.9 (7.31) |          562.5 (82.82) |  -4.16% |   -2.80% (13.25 pp) |
| tuple/projection/2/merge.duplicate     |         618.65 (44.02) |           596.06 (7.4) |  -3.65% |    -0.49% (8.01 pp) |
| tuple/tuple/2/merge.duplicate          |          577.41 (44.2) |         575.22 (12.68) |  -0.38% |    -3.28% (6.09 pp) |
| tuple/projection/2/length              |            7.04 (0.15) |            7.28 (0.23) |  +3.48% |    +2.40% (6.17 pp) |
| tuple/tuple/2/length                   |            7.08 (0.11) |            7.17 (0.08) |  +1.25% |    +1.25% (2.11 pp) |
| tuple/projection/2/value.random        |           28.64 (1.99) |           30.43 (1.13) |  +6.25% |    +3.22% (4.99 pp) |
| tuple/tuple/2/value.random             |           18.38 (0.58) |            18.4 (0.25) |  +0.11% |    +1.18% (2.95 pp) |
| tuple/projection/2/values              |           72.15 (1.88) |            78.36 (3.9) |  +8.61% |    +7.59% (4.89 pp) |
| tuple/tuple/2/values                   |           77.15 (2.32) |           79.89 (2.97) |  +3.55% |     +1.55% (3.4 pp) |
| tuple/projection/2/sequence            |         430.49 (37.37) |         448.06 (23.37) |  +4.08% |      -6.50% (19 pp) |
| tuple/tuple/2/sequence                 |         465.68 (79.24) |         497.27 (74.28) |  +6.78% |   -2.10% (28.72 pp) |
| tuple/projection/4/create.empty        |         440.46 (44.29) |         409.57 (23.86) |  -7.01% |    -3.42% (5.02 pp) |
| tuple/tuple/4/create.empty             |         413.84 (11.72) |         423.86 (21.31) |  +2.42% |    -0.17% (4.81 pp) |
| tuple/projection/4/create.sequence     |       1,623.25 (35.33) |       1,584.64 (62.85) |  -2.38% |    -2.63% (2.04 pp) |
| tuple/tuple/4/create.sequence          |       1,496.88 (94.51) |       1,528.02 (26.73) |  +2.08% |   -3.16% (12.41 pp) |
| tuple/projection/4/replace.random      |      1,135.42 (108.88) |        1,074.8 (65.56) |  -5.34% |    +3.12% (10.3 pp) |
| tuple/tuple/4/replace.random           |           615.03 (8.7) |         630.55 (34.09) |  +2.52% |    +0.43% (8.56 pp) |
| tuple/projection/4/apply.replace       |       1,624.61 (71.05) |       1,603.32 (84.23) |  -1.31% |    -4.84% (6.19 pp) |
| tuple/tuple/4/apply.replace            |       1,041.12 (30.27) |       1,002.83 (67.15) |  -3.68% |    -4.56% (5.72 pp) |
| tuple/projection/4/apply.duplicate     |         577.98 (28.18) |         544.51 (20.74) |  -5.79% |    -4.24% (6.51 pp) |
| tuple/tuple/4/apply.duplicate          |         599.34 (23.55) |         601.91 (53.31) |  +0.43% |    -1.66% (7.18 pp) |
| tuple/projection/4/merge.duplicate     |         731.83 (29.32) |         728.37 (28.63) |  -0.47% |    -0.47% (5.25 pp) |
| tuple/tuple/4/merge.duplicate          |          770.06 (2.48) |         761.57 (43.77) |  -1.10% |     -1.36% (5.1 pp) |
| tuple/projection/4/length              |           27.01 (0.65) |           27.62 (0.22) |  +2.24% |    +3.98% (5.26 pp) |
| tuple/tuple/4/length                   |           25.69 (1.28) |            25.3 (0.94) |  -1.55% |    +1.85% (1.14 pp) |
| tuple/projection/4/value.random        |           39.76 (1.16) |           41.39 (2.92) |  +4.10% |   +4.10% (13.73 pp) |
| tuple/tuple/4/value.random             |           17.89 (1.46) |           18.52 (2.58) |  +3.54% |    -0.05% (9.83 pp) |
| tuple/projection/4/values              |          142.82 (0.78) |           145.1 (6.27) |  +1.60% |    +1.96% (1.18 pp) |
| tuple/tuple/4/values                   |          141.41 (5.49) |          136.54 (5.95) |  -3.44% |    -2.52% (3.92 pp) |
| tuple/projection/4/sequence            |         444.42 (14.77) |         428.13 (54.01) |  -3.66% |   -2.43% (11.13 pp) |
| tuple/tuple/4/sequence                 |         526.46 (33.39) |         525.25 (23.96) |  -0.23% |     +2.17% (8.4 pp) |
| tuple/projection/8/create.empty        |         400.23 (15.31) |         416.13 (26.05) |  +3.97% |   -0.92% (10.33 pp) |
| tuple/tuple/8/create.empty             |         438.79 (29.15) |         430.09 (17.49) |  -1.98% |    +1.33% (7.04 pp) |
| tuple/projection/8/create.sequence     |      2,192.92 (132.24) |       2,231.29 (50.05) |  +1.75% |     -1.44% (5.5 pp) |
| tuple/tuple/8/create.sequence          |       1,970.14 (59.67) |       1,978.14 (75.94) |  +0.41% |    -2.30% (8.44 pp) |
| tuple/projection/8/replace.random      |      1,095.25 (159.26) |       1,093.39 (31.37) |  -0.17% |    -1.32% (8.61 pp) |
| tuple/tuple/8/replace.random           |         625.65 (18.65) |         641.94 (29.09) |  +2.60% |    +4.78% (9.58 pp) |
| tuple/projection/8/apply.replace       |       1,754.5 (168.58) |      1,704.71 (222.23) |  -2.84% |   -2.84% (22.71 pp) |
| tuple/tuple/8/apply.replace            |         936.04 (86.17) |         973.57 (51.96) |  +4.01% |    -1.03% (9.44 pp) |
| tuple/projection/8/apply.duplicate     |         584.45 (38.92) |         565.79 (38.24) |  -3.19% |    -6.50% (4.52 pp) |
| tuple/tuple/8/apply.duplicate          |         593.56 (45.18) |         607.98 (57.08) |  +2.43% |   -1.06% (10.31 pp) |
| tuple/projection/8/merge.duplicate     |       1,010.82 (58.88) |        1,056.59 (9.35) |  +4.53% |    +1.09% (4.55 pp) |
| tuple/tuple/8/merge.duplicate          |       1,141.99 (46.06) |       1,112.56 (75.01) |  -2.58% |    -1.94% (3.96 pp) |
| tuple/projection/8/length              |           28.06 (4.97) |           26.41 (2.16) |  -5.88% |   -1.79% (11.78 pp) |
| tuple/tuple/8/length                   |            26.16 (0.5) |           25.88 (0.69) |  -1.04% |    -1.44% (6.29 pp) |
| tuple/projection/8/value.random        |           51.06 (3.48) |           52.14 (3.46) |  +2.11% |    +5.94% (3.99 pp) |
| tuple/tuple/8/value.random             |           18.33 (1.47) |           18.44 (1.06) |  +0.58% |   +1.07% (11.78 pp) |
| tuple/projection/8/values              |          214.62 (8.62) |          217.3 (13.26) |  +1.25% |    +0.33% (1.55 pp) |
| tuple/tuple/8/values                   |          207.65 (10.3) |           196.56 (1.7) |  -5.34% |    -7.20% (6.92 pp) |
| tuple/projection/8/sequence            |         602.91 (13.84) |         632.84 (42.63) |  +4.96% |   +9.67% (12.48 pp) |
| tuple/tuple/8/sequence                 |         657.38 (30.84) |          656.01 (37.3) |  -0.21% |    -0.39% (8.93 pp) |
| tuple/projection/100/create.empty      |         434.88 (10.41) |         425.83 (19.06) |  -2.08% |    -2.18% (4.56 pp) |
| tuple/tuple/100/create.empty           |         449.58 (40.17) |         459.37 (21.57) |  +2.18% |    -2.40% (9.75 pp) |
| tuple/projection/100/create.sequence   |     13,419.63 (239.36) |       13,646.8 (731.4) |  +1.69% |    +1.69% (4.02 pp) |
| tuple/tuple/100/create.sequence        |     11,291.51 (724.37) |     11,224.98 (406.25) |  -0.59% |    +0.89% (4.85 pp) |
| tuple/projection/100/replace.random    |        1,121.46 (5.28) |        1,130.82 (6.62) |  +0.83% |     +0.88% (4.6 pp) |
| tuple/tuple/100/replace.random         |          597.74 (6.76) |          602.97 (6.86) |  +0.88% |    +0.85% (1.03 pp) |
| tuple/projection/100/apply.replace     |       1,729.51 (51.79) |          1,609.4 (9.1) |  -6.94% |    -7.16% (1.88 pp) |
| tuple/tuple/100/apply.replace          |         972.26 (83.21) |         912.23 (24.56) |  -6.17% |    -6.17% (9.45 pp) |
| tuple/projection/100/apply.duplicate   |         603.02 (54.34) |          545.95 (20.6) |  -9.46% |    -4.85% (6.57 pp) |
| tuple/tuple/100/apply.duplicate        |         602.41 (46.73) |         573.91 (12.06) |  -4.73% |    -7.69% (2.99 pp) |
| tuple/projection/100/merge.duplicate   |      9,012.72 (570.76) |      9,134.68 (212.45) |  +1.35% |    -2.26% (6.03 pp) |
| tuple/tuple/100/merge.duplicate        |     12,508.81 (759.16) |     12,915.89 (230.15) |  +3.25% |    +3.98% (3.98 pp) |
| tuple/projection/100/length            |           26.37 (1.17) |           25.12 (2.33) |  -4.74% |   -4.74% (10.85 pp) |
| tuple/tuple/100/length                 |           26.29 (1.57) |           26.64 (2.05) |  +1.33% |    +6.27% (9.29 pp) |
| tuple/projection/100/value.random      |           76.87 (0.03) |           72.23 (8.67) |  -6.02% |   -6.03% (13.67 pp) |
| tuple/tuple/100/value.random           |            17.1 (0.73) |           18.42 (1.29) |  +7.75% |    +3.88% (8.33 pp) |
| tuple/projection/100/values            |       1,820.46 (66.01) |       1,949.84 (55.86) |  +7.11% |    +4.15% (7.63 pp) |
| tuple/tuple/100/values                 |       1,500.63 (72.87) |       1,487.94 (42.23) |  -0.85% |    -2.04% (8.96 pp) |
| tuple/projection/100/sequence          |      6,123.25 (449.36) |      6,246.63 (303.72) |  +2.01% |   +2.01% (13.96 pp) |
| tuple/tuple/100/sequence               |      5,442.63 (180.62) |       5,339.02 (146.3) |  -1.90% |    -0.15% (6.42 pp) |

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
