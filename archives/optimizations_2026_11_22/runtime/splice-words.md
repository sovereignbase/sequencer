# Direct Splice words controls

Five alternating fresh-process pairs; identical 6,000-edit fixtures, native entropy, warmup and API timings. Negative latency changes are faster. Ratios of medians and paired medians are distinct statistics. Values are microseconds per call, with interquartile ranges.

| Mode / workload / method    |    Before µs (IQR) |     After µs (IQR) |  Change | Paired change (IQR pp) |
| --------------------------- | -----------------: | -----------------: | ------: | ---------------------: |
| numeric/append/sequence     |        0.95 (0.15) |        1.03 (0.30) |   7.94% |          5.47% (18.53) |
| numeric/append/encode       |       30.04 (1.47) |       28.82 (1.98) |  -4.05% |          -4.05% (5.88) |
| numeric/append/decode       |        2.96 (0.60) |        2.83 (0.18) |  -4.48% |         -0.51% (25.05) |
| numeric/append/create       |        2.07 (0.32) |        2.16 (0.17) |   4.37% |         -1.72% (16.80) |
| numeric/append/load         |        6.56 (2.37) |        6.93 (0.66) |   5.58% |         -0.12% (18.55) |
| numeric/append/apply        |  2641.23 (1444.73) |   3368.09 (918.06) |  27.52% |         -8.65% (13.09) |
| numeric/append/receive      |  4051.23 (2809.88) |  3333.52 (2108.04) | -17.72% |          -6.62% (9.67) |
| binary/append/sequence      |        0.84 (0.33) |        0.88 (0.04) |   5.37% |         -7.87% (21.53) |
| binary/append/encode        |       33.67 (1.24) |       32.99 (2.79) |  -2.04% |         -0.62% (30.81) |
| binary/append/decode        |        2.22 (1.26) |        1.81 (0.03) | -18.76% |        -11.76% (40.96) |
| binary/append/create        |        2.02 (0.30) |        2.11 (0.37) |   4.46% |           5.99% (5.93) |
| binary/append/load          |        5.88 (0.34) |        5.83 (0.64) |  -0.77% |          -1.52% (1.71) |
| binary/append/apply         |    1666.94 (82.10) |   1751.24 (373.70) |   5.06% |         -9.42% (23.07) |
| binary/append/receive       |   3407.75 (143.24) |   3020.95 (607.37) | -11.35% |         -0.91% (22.94) |
| numeric/prepend/sequence    |     494.31 (29.89) |     465.51 (72.95) |  -5.83% |          3.92% (20.32) |
| numeric/prepend/encode      |     533.06 (40.70) |     551.71 (70.08) |   3.50% |         -1.37% (14.50) |
| numeric/prepend/decode      |     152.73 (29.73) |     171.39 (10.26) |  12.22% |           1.17% (8.44) |
| numeric/prepend/create      |     798.99 (98.94) |     832.30 (46.35) |   4.17% |          1.01% (12.59) |
| numeric/prepend/load        |   1392.42 (166.39) |   1330.73 (130.50) |  -4.43% |          -6.34% (5.17) |
| numeric/prepend/apply       |   2406.21 (289.45) |    2405.53 (37.06) |  -0.03% |         -0.03% (17.26) |
| numeric/prepend/receive     |   4219.48 (855.48) |   4009.25 (994.64) |  -4.98% |         -2.62% (11.70) |
| binary/prepend/sequence     |     397.29 (21.47) |     435.20 (64.13) |   9.54% |         -2.68% (11.44) |
| binary/prepend/encode       |       31.86 (3.94) |       32.49 (2.56) |   2.00% |           5.91% (0.56) |
| binary/prepend/decode       |        2.03 (0.49) |        1.92 (0.36) |  -5.53% |         -5.53% (52.70) |
| binary/prepend/create       |     794.09 (38.99) |     821.64 (26.36) |   3.47% |           5.16% (6.91) |
| binary/prepend/load         |     837.69 (72.84) |      836.16 (6.61) |  -0.18% |           0.83% (8.76) |
| binary/prepend/apply        |   2463.07 (168.08) |   2388.28 (126.93) |  -3.04% |          -4.12% (7.76) |
| binary/prepend/receive      |  3908.15 (1373.09) |   3763.04 (437.74) |  -3.71% |         -3.71% (20.03) |
| numeric/random/sequence     |     929.53 (46.86) |     957.99 (59.53) |   3.06% |          -1.06% (3.83) |
| numeric/random/encode       |   2223.86 (259.69) |   2080.69 (189.67) |  -6.44% |          -3.90% (6.55) |
| numeric/random/decode       |    796.27 (286.30) |    771.30 (424.38) |  -3.14% |         -1.28% (90.82) |
| numeric/random/create       |   1623.83 (261.93) |   1817.82 (195.05) |  11.95% |           4.97% (6.79) |
| numeric/random/load         |  4346.73 (1090.84) |  5188.43 (1268.39) |  19.36% |          2.65% (22.10) |
| numeric/random/apply        |  7934.37 (1514.03) |   7790.10 (665.17) |  -1.82% |          -8.58% (8.03) |
| numeric/random/receive      | 12599.95 (2951.25) |  13069.90 (387.47) |   3.73% |           3.26% (9.76) |
| binary/random/sequence      |    892.24 (141.86) |     903.08 (12.22) |   1.22% |          5.82% (12.78) |
| binary/random/encode        |       73.64 (3.17) |       70.81 (4.31) |  -3.84% |          -3.84% (1.69) |
| binary/random/decode        |        1.63 (0.02) |        1.62 (0.04) |  -0.78% |          -0.14% (6.11) |
| binary/random/create        |   1941.42 (161.45) |    1855.16 (71.58) |  -4.44% |         -4.44% (15.02) |
| binary/random/load          |   1973.80 (151.92) |   2004.18 (134.58) |   1.54% |           1.03% (3.47) |
| binary/random/apply         |   6414.66 (766.34) |   6070.61 (413.82) |  -5.36% |          -1.19% (1.24) |
| binary/random/receive       |   8424.22 (386.20) |  8457.25 (1225.59) |   0.39% |           6.10% (8.91) |
| numeric/concurrent/sequence |     837.77 (91.97) |     808.07 (54.97) |  -3.54% |          -5.67% (4.42) |
| numeric/concurrent/encode   |   1533.18 (108.59) |   1476.28 (135.45) |  -3.71% |          -3.71% (1.62) |
| numeric/concurrent/decode   |    669.62 (170.58) |    741.00 (123.37) |  10.66% |         20.75% (15.39) |
| numeric/concurrent/create   |   2278.80 (191.75) |   2528.38 (229.24) |  10.95% |          1.80% (12.41) |
| numeric/concurrent/load     |   4283.29 (705.11) |   4698.94 (927.91) |   9.70% |           3.68% (9.40) |
| numeric/concurrent/apply    |   5693.86 (631.65) |   5712.88 (776.28) |   0.33% |          1.05% (11.67) |
| numeric/concurrent/receive  | 10039.42 (1355.31) | 10875.68 (2316.50) |   8.33% |         10.16% (19.70) |
| binary/concurrent/sequence  |     737.37 (41.82) |     781.14 (93.03) |   5.94% |           3.75% (7.10) |
| binary/concurrent/encode    |       62.96 (7.07) |       64.85 (4.23) |   2.99% |          4.26% (18.34) |
| binary/concurrent/decode    |        3.04 (1.01) |        2.74 (0.48) |  -9.76% |         -9.76% (30.94) |
| binary/concurrent/create    |   2289.34 (186.69) |   2311.61 (156.53) |   0.97% |         -3.72% (12.09) |
| binary/concurrent/load      |    2444.56 (77.55) |   2432.01 (104.19) |  -0.51% |          -1.25% (7.02) |
| binary/concurrent/apply     |   5268.45 (318.51) |   5407.88 (486.68) |   2.65% |          1.22% (20.78) |
| binary/concurrent/receive   |   7242.47 (528.22) |   6920.75 (142.36) |  -4.44% |          1.76% (14.53) |
