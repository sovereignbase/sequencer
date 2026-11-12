# Direct module calls: tuple follow-up

Five matched runs per build. Each cell gives median nanoseconds per call and IQR. The actual tuple benchmark, sizes, warm-up and call counts are unchanged. Build order rotates by pair. This is a targeted check, not full-suite acceptance.

The continuation baseline is `current`; `view` reads native Frame count through a borrowed handle view, while `direct` also calls named module functions instead of an aggregate object. Native code is byte-identical between view and direct. All valid observations are retained.

| Case                           | Current median / IQR |  View median / IQR | Direct median / IQR | Direct / current |
| ------------------------------ | -------------------: | -----------------: | ------------------: | ---------------: |
| projection/2/create.empty      |      492.25 / 106.25 |     575.96 / 31.49 |     537.66 / 169.03 |            9.23% |
| tuple/2/create.empty           |      660.21 / 121.36 |     586.88 / 36.94 |      576.44 / 53.09 |          -12.69% |
| projection/2/create.sequence   |     1849.22 / 457.36 |   1345.48 / 130.80 |    1262.45 / 386.75 |          -31.73% |
| tuple/2/create.sequence        |    1799.84 / 1383.46 |   1549.88 / 279.29 |    1409.22 / 170.67 |          -21.70% |
| projection/2/replace.random    |     1255.85 / 649.46 |    1240.34 / 57.48 |    1190.45 / 299.06 |           -5.21% |
| tuple/2/replace.random         |      949.86 / 659.85 |     688.03 / 35.90 |      706.05 / 93.67 |          -25.67% |
| projection/2/apply.replace     |    1753.28 / 1429.65 |   1779.24 / 244.67 |    1744.22 / 139.74 |           -0.52% |
| tuple/2/apply.replace          |     1829.29 / 362.40 |   1364.55 / 151.98 |     1235.83 / 71.53 |          -32.44% |
| projection/2/apply.duplicate   |     1287.93 / 503.68 |    587.16 / 148.45 |       593.34 / 9.99 |          -53.93% |
| tuple/2/apply.duplicate        |     1357.86 / 404.93 |     615.70 / 72.62 |      632.79 / 36.51 |          -53.40% |
| projection/2/merge.duplicate   |     1124.03 / 333.03 |     960.86 / 71.90 |     886.75 / 116.60 |          -21.11% |
| tuple/2/merge.duplicate        |     1111.08 / 200.42 |   1163.94 / 228.10 |      823.35 / 27.23 |          -25.90% |
| projection/2/length            |          7.31 / 0.38 |        7.51 / 1.77 |         6.36 / 0.26 |          -12.90% |
| tuple/2/length                 |          7.48 / 0.35 |        6.29 / 0.70 |         6.31 / 0.13 |          -15.75% |
| projection/2/value.random      |         31.13 / 1.89 |       33.50 / 5.45 |        30.82 / 1.48 |           -0.99% |
| tuple/2/value.random           |         18.67 / 0.99 |       19.74 / 1.94 |        18.48 / 1.17 |           -1.03% |
| projection/2/values            |        79.87 / 11.19 |       81.97 / 3.95 |        78.04 / 2.35 |           -2.29% |
| tuple/2/values                 |        94.29 / 17.76 |       79.50 / 2.44 |        77.52 / 3.15 |          -17.78% |
| projection/2/sequence          |        470.99 / 7.38 |     471.70 / 48.80 |      470.54 / 65.76 |           -0.09% |
| tuple/2/sequence               |       520.18 / 24.69 |     501.06 / 17.91 |      484.53 / 21.94 |           -6.85% |
| projection/4/create.empty      |      608.88 / 143.27 |     531.52 / 43.94 |      465.61 / 36.60 |          -23.53% |
| tuple/4/create.empty           |      656.12 / 919.62 |    540.17 / 151.21 |     540.32 / 115.78 |          -17.65% |
| projection/4/create.sequence   |     2040.60 / 877.32 |   1840.13 / 287.82 |    1742.59 / 130.73 |          -14.60% |
| tuple/4/create.sequence        |    1846.31 / 1052.85 |   1655.35 / 262.98 |     1514.63 / 14.02 |          -17.96% |
| projection/4/replace.random    |     1142.51 / 522.18 |   1240.62 / 101.34 |     1135.20 / 63.30 |           -0.64% |
| tuple/4/replace.random         |      848.91 / 257.31 |    734.53 / 139.63 |      644.24 / 34.03 |          -24.11% |
| projection/4/apply.replace     |     3069.93 / 628.77 |   2388.57 / 129.68 |    2272.66 / 153.08 |          -25.97% |
| tuple/4/apply.replace          |     1454.84 / 618.04 |    1010.57 / 30.75 |    1012.60 / 162.96 |          -30.40% |
| projection/4/apply.duplicate   |     1120.11 / 583.62 |     577.07 / 24.26 |      615.04 / 90.03 |          -45.09% |
| tuple/4/apply.duplicate        |     1123.04 / 184.93 |     612.53 / 96.17 |      635.93 / 36.99 |          -43.37% |
| projection/4/merge.duplicate   |     1301.67 / 540.23 |   1142.64 / 179.48 |     1006.23 / 50.28 |          -22.70% |
| tuple/4/merge.duplicate        |     1397.84 / 333.43 |   1069.38 / 202.60 |     1079.96 / 81.37 |          -22.74% |
| projection/4/length            |        33.56 / 10.10 |       21.22 / 5.34 |       20.84 / 14.76 |          -37.91% |
| tuple/4/length                 |        33.53 / 17.06 |       21.79 / 0.90 |       21.70 / 15.51 |          -35.28% |
| projection/4/value.random      |        43.33 / 19.84 |       40.07 / 8.22 |        41.44 / 0.73 |           -4.37% |
| tuple/4/value.random           |         20.78 / 3.81 |       17.68 / 0.89 |        18.35 / 1.43 |          -11.71% |
| projection/4/values            |       168.89 / 34.95 |     145.78 / 13.05 |      148.61 / 22.92 |          -12.01% |
| tuple/4/values                 |       173.05 / 31.83 |     139.13 / 14.28 |      142.98 / 21.14 |          -17.37% |
| projection/4/sequence          |       535.76 / 82.46 |    513.55 / 111.44 |      477.65 / 10.70 |          -10.85% |
| tuple/4/sequence               |       582.28 / 24.00 |    545.57 / 100.82 |      541.88 / 55.39 |           -6.94% |
| projection/8/create.empty      |      657.29 / 126.99 |     515.23 / 68.27 |      482.09 / 61.60 |          -26.66% |
| tuple/8/create.empty           |      718.33 / 168.20 |     618.30 / 43.50 |     589.48 / 180.56 |          -17.94% |
| projection/8/create.sequence   |     2896.56 / 596.48 |   2439.58 / 331.97 |    2496.36 / 452.86 |          -13.82% |
| tuple/8/create.sequence        |     2725.09 / 238.75 |   2104.87 / 335.15 |    2104.34 / 237.21 |          -22.78% |
| projection/8/replace.random    |     1248.30 / 251.22 |   1310.15 / 130.00 |    1242.80 / 148.07 |           -0.44% |
| tuple/8/replace.random         |      809.73 / 117.66 |     625.37 / 47.85 |      649.75 / 76.93 |          -19.76% |
| projection/8/apply.replace     |     3127.41 / 959.06 |   2600.19 / 728.24 |     2493.60 / 58.75 |          -20.27% |
| tuple/8/apply.replace          |     1504.23 / 540.11 |    1026.69 / 48.75 |    1115.70 / 121.95 |          -25.83% |
| projection/8/apply.duplicate   |      989.74 / 678.39 |     619.18 / 42.96 |     645.15 / 175.06 |          -34.82% |
| tuple/8/apply.duplicate        |      1116.00 / 94.79 |    608.25 / 107.04 |     648.60 / 141.43 |          -41.88% |
| projection/8/merge.duplicate   |     2242.77 / 505.37 |   1809.60 / 225.20 |    1540.48 / 462.25 |          -31.31% |
| tuple/8/merge.duplicate        |     2101.79 / 492.25 |   1769.64 / 498.33 |    1745.32 / 400.30 |          -16.96% |
| projection/8/length            |        36.90 / 19.20 |       22.39 / 1.08 |        23.06 / 2.02 |          -37.52% |
| tuple/8/length                 |        36.43 / 13.11 |       21.51 / 2.26 |        22.10 / 1.05 |          -39.34% |
| projection/8/value.random      |         61.00 / 9.59 |       51.59 / 4.93 |        56.35 / 2.36 |           -7.62% |
| tuple/8/value.random           |         21.88 / 9.03 |       18.84 / 0.91 |        19.72 / 5.29 |           -9.86% |
| projection/8/values            |      293.51 / 247.31 |     221.18 / 22.05 |       233.26 / 4.25 |          -20.53% |
| tuple/8/values                 |       288.32 / 97.38 |     193.95 / 52.65 |      198.79 / 12.40 |          -31.05% |
| projection/8/sequence          |     1025.30 / 423.94 |     701.73 / 19.39 |       730.52 / 6.67 |          -28.75% |
| tuple/8/sequence               |      952.46 / 455.84 |     725.16 / 56.29 |      667.52 / 32.06 |          -29.92% |
| projection/100/create.empty    |      818.17 / 330.75 |     504.94 / 12.73 |      507.21 / 48.18 |          -38.01% |
| tuple/100/create.empty         |      862.33 / 128.94 |     572.18 / 66.18 |      617.08 / 87.75 |          -28.44% |
| projection/100/create.sequence |  19057.10 / 20851.53 | 14762.58 / 2275.06 |   14000.92 / 253.32 |          -26.53% |
| tuple/100/create.sequence      |   11490.69 / 1704.35 |  11096.74 / 912.93 |  11021.74 / 1203.28 |           -4.08% |
| projection/100/replace.random  |     1474.89 / 350.00 |   1605.55 / 210.27 |    1401.39 / 157.69 |           -4.98% |
| tuple/100/replace.random       |      892.77 / 149.03 |     690.52 / 63.93 |     740.08 / 116.54 |          -17.10% |
| projection/100/apply.replace   |     3661.91 / 519.50 |   3075.42 / 131.24 |    3182.33 / 329.74 |          -13.10% |
| tuple/100/apply.replace        |     1440.29 / 184.22 |    1043.62 / 28.35 |    1029.73 / 100.44 |          -28.51% |
| projection/100/apply.duplicate |      1078.63 / 86.50 |     633.52 / 24.39 |      618.36 / 50.65 |          -42.67% |
| tuple/100/apply.duplicate      |      1048.90 / 79.81 |     646.99 / 32.38 |      627.89 / 27.30 |          -40.14% |
| projection/100/merge.duplicate |     9657.14 / 415.53 |   9318.01 / 177.95 |    9610.77 / 914.75 |           -0.48% |
| tuple/100/merge.duplicate      |    14360.62 / 869.31 |  14580.83 / 693.82 |  15738.23 / 1382.25 |            9.59% |
| projection/100/length          |         36.17 / 7.39 |       22.14 / 3.34 |        23.46 / 1.54 |          -35.14% |
| tuple/100/length               |         38.63 / 7.06 |       20.88 / 4.26 |        22.74 / 0.81 |          -41.12% |
| projection/100/value.random    |        115.35 / 5.37 |      105.91 / 2.85 |       111.50 / 9.60 |           -3.34% |
| tuple/100/value.random         |         16.87 / 2.46 |       17.71 / 0.45 |        17.48 / 5.54 |            3.67% |
| projection/100/values          |     2007.80 / 816.14 |   2029.57 / 297.53 |    2008.03 / 428.61 |            0.01% |
| tuple/100/values               |      1617.72 / 38.50 |    1571.25 / 58.81 |    1677.50 / 146.91 |            3.70% |
| projection/100/sequence        |      6413.50 / 79.09 |   6389.65 / 971.12 |    6725.46 / 842.77 |            4.86% |
| tuple/100/sequence             |    6648.56 / 4443.48 |   5665.62 / 443.12 |    5920.85 / 673.49 |          -10.95% |

The complete raw distributions are in `temp/optimization_2026_11_11/direct-tuple-pairs-comparison.json`. The positive medians remain unresolved. In particular, this run does not reproduce the earlier baseline length medians at sizes 4–100; no single change is claimed to explain that variation.
