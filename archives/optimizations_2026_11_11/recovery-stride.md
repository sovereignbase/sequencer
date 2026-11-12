# Large-arena growth layout: rejected

Five matched runs of the unchanged 39-case throughput suite at 20,000 initial edit groups. Before: directconst; candidate: stride. Median and IQR in ns/call. These are targeted diagnostics, not full-suite acceptance. The fixture begins with one extended canonical root; static reads do not themselves stress a large arena. Mutations may grow it. Cache misses were not directly measured. The source change was reverted.

| Method                       |           Before (IQR) |        Candidate (IQR) |  Change |
| ---------------------------- | ---------------------: | ---------------------: | ------: |
| 20000/apply.duplicate        |        1015.80 (89.98) |        983.69 (110.75) |  -3.16% |
| 20000/apply.duplicateRemove  |       2125.10 (373.70) |        1823.11 (66.30) | -14.21% |
| 20000/apply.duplicateReplace |        1457.05 (33.63) |       1609.86 (240.00) |  10.49% |
| 20000/apply.insert           |       1713.66 (145.58) |       1704.92 (206.61) |  -0.51% |
| 20000/apply.remove           |        1990.22 (83.86) |       2040.94 (400.47) |   2.55% |
| 20000/apply.replace          |      16306.45 (679.16) |     16210.54 (1619.50) |  -0.59% |
| 20000/create.empty           |       1010.01 (120.65) |       1012.32 (385.84) |   0.23% |
| 20000/create.sequence        |       1625.82 (171.74) |        1676.05 (93.91) |   3.09% |
| 20000/insert.head            |         681.36 (48.59) |        630.21 (251.46) |  -7.51% |
| 20000/insert.middle          |         914.56 (18.60) |         855.75 (62.95) |  -6.43% |
| 20000/insert.random          |        1526.94 (67.42) |        1392.95 (51.57) |  -8.78% |
| 20000/insert.sameIndex       |         708.65 (22.47) |         614.26 (74.05) | -13.32% |
| 20000/insert.tail            |        1057.27 (55.41) |         931.00 (38.09) | -11.94% |
| 20000/length                 |          110.93 (7.08) |         102.70 (15.53) |  -7.42% |
| 20000/merge.duplicate        |         894.68 (27.61) |         936.78 (75.14) |   4.71% |
| 20000/merge.insert           |        1975.21 (51.03) |        1933.08 (64.17) |  -2.13% |
| 20000/remove.head            |       1258.01 (169.53) |        1185.00 (85.10) |  -5.80% |
| 20000/remove.middle          |        1560.34 (57.59) |       1504.66 (102.07) |  -3.57% |
| 20000/remove.random          |       1909.41 (307.46) |        1859.77 (39.07) |  -2.60% |
| 20000/remove.sameIndex       |        1112.44 (68.76) |       1014.72 (105.60) |  -8.78% |
| 20000/remove.tail            |        1050.69 (38.66) |        1033.66 (52.18) |  -1.62% |
| 20000/replace.head           |        1509.33 (38.84) |        1482.35 (53.64) |  -1.79% |
| 20000/replace.middle         |        1648.96 (15.06) |       1761.53 (109.10) |   6.83% |
| 20000/replace.random         |       2370.03 (204.43) |       2302.87 (834.81) |  -2.83% |
| 20000/replace.sameIndex      |       1591.72 (177.07) |        1537.06 (86.27) |  -3.43% |
| 20000/replace.tail           |       1451.43 (318.05) |       1493.41 (165.51) |   2.89% |
| 20000/retire                 |          294.00 (6.51) |          291.25 (7.16) |  -0.94% |
| 20000/sequence               |         438.12 (28.02) |         515.24 (95.06) |  17.60% |
| 20000/value.head             |         171.51 (29.32) |          165.38 (9.72) |  -3.57% |
| 20000/value.middle           |         207.98 (12.03) |          211.41 (5.80) |   1.65% |
| 20000/value.random           |         262.01 (14.18) |         262.74 (39.05) |   0.28% |
| 20000/value.sameIndex        |          150.99 (3.13) |          148.67 (8.62) |  -1.54% |
| 20000/value.tail             |         180.73 (11.12) |          163.48 (7.26) |  -9.54% |
| 20000/values                 | 2569709.38 (164301.56) | 2537490.63 (146628.13) |  -1.25% |
| 20000/values.head            |         313.92 (28.61) |         289.28 (40.66) |  -7.85% |
| 20000/values.middle          |          250.57 (2.24) |         259.33 (18.61) |   3.50% |
| 20000/values.random          |         386.09 (19.81) |         346.89 (75.36) | -10.15% |
| 20000/values.sameIndex       |          228.92 (4.89) |          242.51 (5.55) |   5.94% |
| 20000/values.tail            |         233.37 (22.20) |          226.34 (3.90) |  -3.01% |
