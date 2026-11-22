# Byte API: five paired process rounds

Unmodified 1.2.8 versus the final implementation. Builds alternate order. Positions, payloads, native Session entropy, warmup and iteration caps are identical. Median latency, IQR and paired changes are all retained. Negative changes are faster. Explicit JS process garbage collection stays outside API timings.

| Mode / workload / method    |    Before µs (IQR) |      After µs (IQR) |  Change | Paired change (IQR pp) |
| --------------------------- | -----------------: | ------------------: | ------: | ---------------------: |
| numeric/append/sequence     |        2.29 (0.21) |         2.40 (0.43) |   4.80% |         16.35% (23.51) |
| numeric/append/encode       |       71.29 (1.02) |        82.96 (2.74) |  16.37% |         14.14% (17.30) |
| numeric/append/decode       |        4.71 (0.27) |         4.81 (0.88) |   2.01% |          2.01% (23.95) |
| numeric/append/create       |        6.92 (1.23) |         6.96 (1.12) |   0.66% |         -5.53% (37.96) |
| numeric/append/load         |       20.48 (1.85) |        21.26 (7.03) |   3.76% |           7.63% (6.64) |
| numeric/append/apply        | 15072.23 (1185.40) |   15388.63 (593.02) |   2.10% |          1.35% (13.15) |
| numeric/append/receive      | 32315.40 (1840.75) |  29710.20 (9870.17) |  -8.06% |         -3.05% (48.10) |
| binary/append/sequence      |        3.01 (0.36) |         3.18 (0.48) |   5.40% |          0.97% (39.45) |
| binary/append/encode        |       75.91 (8.90) |       77.19 (16.45) |   1.68% |          1.68% (33.82) |
| binary/append/decode        |        9.54 (0.25) |         9.27 (2.47) |  -2.87% |         -2.87% (25.50) |
| binary/append/create        |        6.11 (0.38) |         6.19 (0.40) |   1.33% |          4.44% (14.14) |
| binary/append/load          |       21.47 (5.69) |        20.54 (0.40) |  -4.30% |         -4.46% (29.05) |
| binary/append/apply         |  8290.79 (2748.69) |    9648.03 (740.03) |  16.37% |         21.61% (40.37) |
| binary/append/receive       | 13574.40 (6914.91) |  12154.64 (1816.25) | -10.46% |          0.41% (42.87) |
| numeric/prepend/sequence    |    1234.75 (85.04) |     992.29 (297.95) | -19.64% |         -5.68% (22.78) |
| numeric/prepend/encode      |    1448.23 (49.17) |    1352.68 (640.99) |  -6.60% |          1.09% (42.26) |
| numeric/prepend/decode      |     360.00 (55.77) |     416.31 (149.55) |  15.64% |         -5.19% (44.50) |
| numeric/prepend/create      |    2058.34 (17.84) |    2051.62 (483.81) |  -0.33% |          0.09% (14.04) |
| numeric/prepend/load        |  3310.74 (1033.72) |   4370.17 (1419.75) |  32.00% |           0.78% (6.67) |
| numeric/prepend/apply       |  10570.26 (971.14) |   8724.30 (1485.83) | -17.46% |        -13.56% (10.86) |
| numeric/prepend/receive     | 16487.13 (2668.75) |  19138.00 (4764.24) |  16.08% |         16.15% (10.53) |
| binary/prepend/sequence     |      927.99 (3.63) |     968.29 (154.42) |   4.34% |          6.18% (16.68) |
| binary/prepend/encode       |       98.19 (5.48) |        82.43 (6.06) | -16.05% |         -17.39% (9.68) |
| binary/prepend/decode       |        6.95 (1.66) |         6.44 (2.26) |  -7.46% |       -24.18% (118.55) |
| binary/prepend/create       |   2027.36 (170.02) |     2065.86 (64.62) |   1.90% |           0.07% (5.74) |
| binary/prepend/load         |   2446.33 (257.03) |    2144.15 (296.95) | -12.35% |        -14.46% (23.93) |
| binary/prepend/apply        |  9284.15 (2141.69) |    7890.16 (725.82) | -15.01% |        -25.50% (18.79) |
| binary/prepend/receive      | 14234.32 (2550.66) |  12676.72 (1234.19) | -10.94% |         -11.71% (1.17) |
| numeric/random/sequence     |   2661.32 (657.17) |     3127.34 (50.62) |  17.51% |          0.41% (31.06) |
| numeric/random/encode       |  5947.87 (1476.69) |   5316.87 (1088.15) | -10.61% |         -3.30% (30.17) |
| numeric/random/decode       |   2799.19 (405.79) |    2814.03 (327.03) |   0.53% |        -11.14% (20.99) |
| numeric/random/create       |   4855.65 (970.11) |    4829.23 (501.39) |  -0.54% |         -9.16% (36.11) |
| numeric/random/load         | 18453.53 (2484.60) |  16943.53 (3200.12) |  -8.18% |         -2.21% (18.81) |
| numeric/random/apply        | 30768.70 (1822.45) | 36582.80 (26375.55) |  18.90% |         21.06% (50.68) |
| numeric/random/receive      | 40659.60 (5954.25) | 45945.70 (16172.25) |  13.00% |         38.30% (72.20) |
| binary/random/sequence      |    2237.23 (66.69) |    2088.53 (263.17) |  -6.65% |         -6.65% (16.62) |
| binary/random/encode        |     175.80 (13.64) |      167.29 (26.90) |  -4.84% |         -9.02% (20.79) |
| binary/random/decode        |        6.17 (1.98) |         6.84 (2.05) |  10.98% |          10.37% (3.00) |
| binary/random/create        |   5277.33 (372.21) |    4781.22 (175.15) |  -9.40% |          -4.65% (4.29) |
| binary/random/load          |  5278.90 (1163.63) |    5102.47 (703.78) |  -3.34% |         -3.78% (16.69) |
| binary/random/apply         | 27536.65 (6711.98) |  20330.30 (3262.80) | -26.17% |        -22.12% (26.23) |
| binary/random/receive       | 50056.10 (7228.80) |  30656.90 (4349.70) | -38.75% |         -32.87% (4.47) |
| numeric/concurrent/sequence |   2000.55 (118.00) |    2016.81 (126.58) |   0.81% |          -0.19% (3.14) |
| numeric/concurrent/encode   |  4835.40 (1409.87) |    3740.05 (255.80) | -22.65% |        -25.63% (38.45) |
| numeric/concurrent/decode   |  2683.19 (4345.53) |    2275.78 (473.38) | -15.18% |        -25.95% (42.15) |
| numeric/concurrent/create   |   6070.66 (540.63) |    6272.26 (998.85) |   3.32% |          7.30% (22.03) |
| numeric/concurrent/load     | 17187.60 (3166.23) |   15023.23 (939.43) | -12.59% |         -1.85% (25.30) |
| numeric/concurrent/apply    | 15114.75 (2423.90) |  18641.73 (3309.71) |  23.33% |         12.62% (33.15) |
| numeric/concurrent/receive  | 31243.00 (9585.55) | 39170.65 (13588.45) |  25.37% |         -2.61% (45.13) |
| binary/concurrent/sequence  |   1883.19 (282.61) |    2128.90 (438.84) |  13.05% |         -7.17% (32.38) |
| binary/concurrent/encode    |      151.85 (8.10) |      137.63 (15.05) |  -9.36% |         -8.65% (14.98) |
| binary/concurrent/decode    |        6.25 (1.63) |         6.54 (2.26) |   4.66% |          9.77% (23.28) |
| binary/concurrent/create    |   6124.18 (189.53) |    6022.92 (554.43) |  -1.65% |          -1.11% (6.69) |
| binary/concurrent/load      |  7167.47 (1072.95) |    6491.74 (222.16) |  -9.43% |         -2.39% (17.48) |
| binary/concurrent/apply     | 18172.17 (2891.54) |  14416.60 (2184.95) | -20.67% |         -20.99% (9.64) |
| binary/concurrent/receive   | 32169.75 (4191.80) |  25037.67 (3772.23) | -22.17% |        -29.92% (11.44) |

## Byte sizes

MessagePack includes string Footage. Metadata counts returned buffer bytes. gzip uses level nine. Median of all five runs.

| Workload   | Build     | Metadata B | Document B | Document gzip B | Mean update B |
| ---------- | --------- | ---------: | ---------: | --------------: | ------------: |
| append     | baseline  |         21 |       6039 |            3694 |         13.98 |
| prepend    | baseline  |      12021 |      18040 |            3759 |         14.99 |
| random     | baseline  |      50141 |      56159 |           37849 |         29.60 |
| concurrent | baseline  |      36643 |      43478 |           29629 |         23.69 |
| append     | candidate |         21 |       6039 |            3694 |         13.98 |
| prepend    | candidate |         25 |       6043 |            3702 |         13.99 |
| random     | candidate |      44751 |      50769 |           36224 |         23.45 |
| concurrent | candidate |      33042 |      39877 |           28830 |         20.71 |
