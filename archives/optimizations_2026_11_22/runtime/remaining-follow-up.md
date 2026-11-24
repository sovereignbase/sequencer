# Full-guard follow-up

Five rotated/reversed fresh-process rounds. The same original throughput cases and tuple bursts retain their inputs, warm-up, timing windows and caps. The baseline copy is a byte-identical A/A control. Lower nanoseconds are better; every sample is retained. The direct-only build distinguishes Splice layout from the added ACK flag.

| Case                               | Build         |   Before ns (IQR) |    After ns (IQR) | Change | Paired change (IQR pp) | Slower in every pair |
| ---------------------------------- | ------------- | ----------------: | ----------------: | -----: | ---------------------: | -------------------- |
| throughput/100/insert.random       | baseline-copy |   1184.82 (61.56) |   1158.89 (24.17) | -2.19% |          -3.05% (4.84) |                      |
| throughput/100/insert.random       | direct-splice |   1184.82 (61.56) |  1245.27 (151.16) |  5.10% |           4.83% (3.69) |                      |
| throughput/100/insert.random       | ack-final     |   1184.82 (61.56) |   1202.86 (55.03) |  1.52% |          1.62% (10.68) |                      |
| throughput/100/sequence            | baseline-copy |   408.51 (126.13) |    398.68 (44.84) | -2.41% |          -2.41% (1.42) |                      |
| throughput/100/sequence            | direct-splice |   408.51 (126.13) |    414.23 (46.05) |  1.40% |         -5.18% (28.62) |                      |
| throughput/100/sequence            | ack-final     |   408.51 (126.13) |    394.51 (53.89) | -3.43% |           4.27% (3.30) |                      |
| throughput/100/value.tail          | baseline-copy |    225.58 (27.63) |     216.01 (3.73) | -4.24% |         -7.97% (12.74) |                      |
| throughput/100/value.tail          | direct-splice |    225.58 (27.63) |    221.67 (18.42) | -1.73% |          1.07% (18.75) |                      |
| throughput/100/value.tail          | ack-final     |    225.58 (27.63) |     212.93 (0.40) | -5.61% |         -8.94% (10.66) |                      |
| throughput/100/values              | baseline-copy | 5367.00 (1928.77) |  5190.63 (120.13) | -3.29% |         -7.39% (16.51) |                      |
| throughput/100/values              | direct-splice | 5367.00 (1928.77) |  5460.31 (318.84) |  1.74% |         -0.13% (21.79) |                      |
| throughput/100/values              | ack-final     | 5367.00 (1928.77) |  5427.87 (313.32) |  1.13% |         -6.98% (27.61) |                      |
| throughput/1000/insert.random      | baseline-copy |   1018.42 (63.17) |    949.80 (35.37) | -6.74% |          -8.25% (6.20) |                      |
| throughput/1000/insert.random      | direct-splice |   1018.42 (63.17) |    980.22 (78.71) | -3.75% |          -4.15% (5.27) |                      |
| throughput/1000/insert.random      | ack-final     |   1018.42 (63.17) |   981.24 (155.97) | -3.65% |         -1.01% (11.14) |                      |
| throughput/10000/remove.middle     | baseline-copy |  1460.89 (140.18) |  1360.46 (295.81) | -6.87% |         -8.37% (19.70) |                      |
| throughput/10000/remove.middle     | direct-splice |  1460.89 (140.18) |   1366.17 (90.22) | -6.48% |         -3.98% (19.78) |                      |
| throughput/10000/remove.middle     | ack-final     |  1460.89 (140.18) |  1413.03 (246.02) | -3.28% |          5.14% (14.17) |                      |
| throughput/15000/create.sequence   | baseline-copy |   1674.19 (54.34) | 1884.13 (1206.38) | 12.54% |          9.24% (60.38) | yes                  |
| throughput/15000/create.sequence   | direct-splice |   1674.19 (54.34) |   1677.86 (48.67) |  0.22% |          -2.12% (3.72) |                      |
| throughput/15000/create.sequence   | ack-final     |   1674.19 (54.34) |  1746.37 (153.04) |  4.31% |           2.35% (1.58) |                      |
| throughput/15000/value.sameIndex   | baseline-copy |    215.01 (45.75) |    222.77 (21.78) |  3.61% |           1.67% (9.88) |                      |
| throughput/15000/value.sameIndex   | direct-splice |    215.01 (45.75) |    213.88 (51.10) | -0.53% |          -2.08% (6.81) |                      |
| throughput/15000/value.sameIndex   | ack-final     |    215.01 (45.75) |    219.98 (11.22) |  2.31% |         -5.82% (15.77) |                      |
| throughput/25000/merge.duplicate   | baseline-copy |   1117.11 (27.68) |   1097.47 (77.16) | -1.76% |          -2.05% (5.89) |                      |
| throughput/25000/merge.duplicate   | direct-splice |   1117.11 (27.68) |  1222.73 (158.04) |  9.45% |          9.13% (16.60) |                      |
| throughput/25000/merge.duplicate   | ack-final     |   1117.11 (27.68) |  1117.71 (200.19) |  0.05% |          2.29% (18.19) |                      |
| tuple/projection/8/apply.duplicate | baseline-copy |    654.97 (52.83) |    626.63 (32.35) | -4.33% |         -4.33% (14.44) |                      |
| tuple/projection/8/apply.duplicate | direct-splice |    654.97 (52.83) |    627.13 (54.80) | -4.25% |         -6.53% (15.39) |                      |
| tuple/projection/8/apply.duplicate | ack-final     |    654.97 (52.83) |    601.10 (31.28) | -8.22% |         -8.22% (12.84) |                      |
| tuple/tuple/8/apply.duplicate      | baseline-copy |    658.07 (88.84) |    708.20 (29.64) |  7.62% |          9.60% (12.33) |                      |
| tuple/tuple/8/apply.duplicate      | direct-splice |    658.07 (88.84) |    659.99 (61.20) |  0.29% |          -6.65% (6.65) |                      |
| tuple/tuple/8/apply.duplicate      | ack-final     |    658.07 (88.84) |    678.11 (47.66) |  3.05% |          -0.43% (6.68) |                      |
| tuple/projection/2/values          | baseline-copy |      85.67 (6.52) |     86.81 (15.84) |  1.33% |          -0.24% (3.24) |                      |
| tuple/projection/2/values          | direct-splice |      85.67 (6.52) |     92.07 (11.67) |  7.46% |         -3.93% (17.19) |                      |
| tuple/projection/2/values          | ack-final     |      85.67 (6.52) |     91.43 (16.26) |  6.72% |          5.43% (18.07) |                      |
| tuple/projection/100/values        | baseline-copy |  2022.28 (141.76) |  2087.19 (166.50) |  3.21% |           2.15% (7.07) |                      |
| tuple/projection/100/values        | direct-splice |  2022.28 (141.76) |  2144.41 (236.68) |  6.04% |           6.60% (3.04) |                      |
| tuple/projection/100/values        | ack-final     |  2022.28 (141.76) |  2043.33 (149.59) |  1.04% |          4.46% (11.17) |                      |
