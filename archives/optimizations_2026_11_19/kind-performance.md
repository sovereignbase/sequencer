# Input-kind complete public-API guard

5 complete matched runs per build. Before: baseline; candidate: text-kind. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 71 timing medians improve over 5%; 80 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 10%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |           769.22 (198.19) |           817.47 (100.51) |  +6.27% |   +7.51% (12.84 pp) |
| throughput/1000/apply.duplicate         |           820.78 (136.59) |           795.59 (169.31) |  -3.07% |   +2.95% (10.19 pp) |
| throughput/5000/apply.duplicate         |            368.12 (11.55) |             364.52 (6.63) |  -0.98% |    -3.32% (2.32 pp) |
| throughput/10000/apply.duplicate        |             336.95 (3.21) |            344.41 (27.24) |  +2.21% |    +2.43% (7.97 pp) |
| throughput/15000/apply.duplicate        |            324.03 (13.18) |            304.66 (13.05) |  -5.98% |   -3.99% (10.87 pp) |
| throughput/20000/apply.duplicate        |            350.88 (53.05) |            341.22 (83.97) |  -2.75% |   +9.58% (35.89 pp) |
| throughput/25000/apply.duplicate        |            330.84 (17.83) |            339.29 (82.12) |  +2.55% |    +0.25% (10.3 pp) |
| throughput/100/apply.duplicateRemove    |          1,404.2 (381.02) |          1,499.09 (75.06) |  +6.76% |   +1.81% (14.72 pp) |
| throughput/1000/apply.duplicateRemove   |           829.16 (143.34) |            932.5 (173.56) | +12.46% |    +14.38% (4.7 pp) |
| throughput/5000/apply.duplicateRemove   |           853.42 (113.95) |            723.61 (19.41) | -15.21% |   -8.35% (12.51 pp) |
| throughput/10000/apply.duplicateRemove  |            712.05 (33.75) |            725.64 (25.39) |  +1.91% |    +8.20% (9.32 pp) |
| throughput/15000/apply.duplicateRemove  |            689.24 (34.05) |            681.98 (56.15) |  -1.05% |    -3.70% (8.71 pp) |
| throughput/20000/apply.duplicateRemove  |            684.3 (103.61) |            722.87 (91.33) |  +5.64% |    +2.54% (9.66 pp) |
| throughput/25000/apply.duplicateRemove  |            644.97 (42.88) |           706.92 (131.76) |  +9.61% |   -3.95% (29.18 pp) |
| throughput/100/apply.duplicateReplace   |         1,586.65 (205.42) |               993 (61.07) | -37.42% |   -36.28% (2.82 pp) |
| throughput/1000/apply.duplicateReplace  |         1,047.23 (138.84) |           998.44 (236.65) |  -4.66% |   +7.59% (18.16 pp) |
| throughput/5000/apply.duplicateReplace  |            894.49 (31.58) |            900.45 (28.38) |  +0.67% |   +0.79% (12.93 pp) |
| throughput/10000/apply.duplicateReplace |            849.95 (29.91) |            878.11 (26.56) |  +3.31% |    +1.16% (5.65 pp) |
| throughput/15000/apply.duplicateReplace |             791.29 (12.8) |            785.05 (87.67) |  -0.79% |    +2.37% (9.63 pp) |
| throughput/20000/apply.duplicateReplace |            859.76 (45.51) |           801.61 (140.17) |  -6.76% |   -0.03% (12.82 pp) |
| throughput/25000/apply.duplicateReplace |            755.97 (37.65) |            873.94 (69.41) | +15.61% |   +10.31% (9.39 pp) |
| throughput/100/apply.insert             |         1,940.27 (341.23) |             1,853.7 (258) |  -4.46% |   +8.26% (29.91 pp) |
| throughput/1000/apply.insert            |         1,389.86 (128.71) |          1,382.19 (47.95) |  -0.55% |    -0.35% (8.18 pp) |
| throughput/5000/apply.insert            |         1,391.04 (126.81) |          1,325.72 (84.66) |  -4.70% |     -7.14% (6.6 pp) |
| throughput/10000/apply.insert           |          1,321.72 (94.77) |          1,390.37 (31.17) |  +5.19% |    +5.19% (2.62 pp) |
| throughput/15000/apply.insert           |         1,327.61 (125.63) |         1,397.65 (172.23) |  +5.28% |     +5.25% (4.7 pp) |
| throughput/20000/apply.insert           |         1,252.49 (204.57) |         1,383.64 (333.16) | +10.47% |  +13.08% (11.97 pp) |
| throughput/25000/apply.insert           |         1,342.33 (205.82) |          1,283.91 (72.82) |  -4.35% |    -4.35% (6.28 pp) |
| throughput/100/apply.remove             |         1,528.47 (133.39) |         1,781.85 (104.13) | +16.58% |   +20.95% (3.23 pp) |
| throughput/1000/apply.remove            |           1,483.5 (74.44) |         1,562.07 (122.25) |  +5.30% |   +6.22% (13.65 pp) |
| throughput/5000/apply.remove            |           1,558.8 (94.61) |          1,484.11 (17.47) |  -4.79% |    -5.89% (2.97 pp) |
| throughput/10000/apply.remove           |          1,479.89 (42.74) |          1,550.78 (125.2) |  +4.79% |   +3.64% (11.55 pp) |
| throughput/15000/apply.remove           |          1,573.84 (80.56) |          1,608.69 (43.58) |  +2.21% |   +1.46% (13.05 pp) |
| throughput/20000/apply.remove           |         1,575.31 (235.04) |          1,614.62 (89.39) |  +2.50% |    -1.44% (14.4 pp) |
| throughput/25000/apply.remove           |         1,739.53 (290.38) |           1,673.3 (54.96) |  -3.81% |   +14.87% (21.8 pp) |
| throughput/100/apply.replace            |           2,409.9 (67.62) |         2,606.66 (207.35) |  +8.16% |    +8.38% (8.86 pp) |
| throughput/1000/apply.replace           |         2,693.42 (499.12) |         2,782.45 (180.86) |  +3.31% |   +9.41% (16.09 pp) |
| throughput/5000/apply.replace           |          2,719.23 (98.54) |          2,727.68 (49.29) |  +0.31% |    -0.83% (1.98 pp) |
| throughput/10000/apply.replace          |          2,777.2 (311.83) |          2,730.39 (41.56) |  -1.69% |   -6.50% (18.96 pp) |
| throughput/15000/apply.replace          |         2,873.79 (137.69) |         2,775.79 (227.37) |  -3.41% |    -7.99% (4.98 pp) |
| throughput/20000/apply.replace          |         2,775.39 (286.39) |         2,812.32 (303.78) |  +1.33% |    +5.51% (4.35 pp) |
| throughput/25000/apply.replace          |          2,676.6 (484.69) |         2,876.38 (241.99) |  +7.46% |    +2.85% (21.9 pp) |
| throughput/100/create.empty             |            602.94 (41.31) |            536.55 (55.98) | -11.01% |  -15.47% (16.24 pp) |
| throughput/1000/create.empty            |            722.95 (61.66) |            766.08 (80.16) |  +5.97% |    +4.07% (18.9 pp) |
| throughput/5000/create.empty            |            830.56 (55.24) |            861.15 (26.53) |  +3.68% |   +1.03% (12.34 pp) |
| throughput/10000/create.empty           |            731.85 (46.58) |            839.15 (43.72) | +14.66% |  +12.16% (10.33 pp) |
| throughput/15000/create.empty           |            762.55 (91.52) |            765.97 (42.86) |  +0.45% |    +1.96% (6.07 pp) |
| throughput/20000/create.empty           |            691.77 (98.44) |            794.57 (64.91) | +14.86% |  +19.36% (13.42 pp) |
| throughput/25000/create.empty           |            755.66 (86.62) |           720.71 (115.47) |  -4.63% |   +1.08% (12.98 pp) |
| throughput/100/create.sequence          |          1,633.31 (61.74) |         1,461.56 (195.21) | -10.52% |   -6.69% (14.13 pp) |
| throughput/1000/create.sequence         |         1,938.91 (173.26) |         2,054.94 (715.36) |  +5.98% |   -1.79% (19.82 pp) |
| throughput/5000/create.sequence         |          1,689.11 (277.2) |          1,592.09 (84.31) |  -5.74% |      -6.50% (12 pp) |
| throughput/10000/create.sequence        |          1,770.76 (81.06) |         1,624.42 (103.05) |  -8.26% |    -7.65% (9.17 pp) |
| throughput/15000/create.sequence        |          1,541.77 (62.25) |          1,468.04 (68.08) |  -4.78% |    -3.66% (8.37 pp) |
| throughput/20000/create.sequence        |         1,719.07 (238.41) |         1,658.67 (291.04) |  -3.51% |   -10.21% (7.68 pp) |
| throughput/25000/create.sequence        |         1,606.16 (375.23) |          1,678.46 (74.09) |  +4.50% |   +4.02% (20.57 pp) |
| throughput/100/insert.head              |             518.41 (12.5) |            533.92 (38.05) |  +2.99% |   -2.09% (10.41 pp) |
| throughput/1000/insert.head             |             553.66 (62.8) |            554.56 (46.18) |  +0.16% |    +1.34% (9.59 pp) |
| throughput/5000/insert.head             |             548.43 (58.9) |            528.43 (28.72) |  -3.65% |   +3.11% (16.48 pp) |
| throughput/10000/insert.head            |            522.87 (60.03) |             506.95 (9.07) |  -3.04% |   -1.77% (12.64 pp) |
| throughput/15000/insert.head            |            508.52 (42.66) |            535.03 (62.73) |  +5.21% |    -0.09% (3.88 pp) |
| throughput/20000/insert.head            |             572.1 (21.26) |            543.67 (30.61) |  -4.97% |    -3.24% (6.94 pp) |
| throughput/25000/insert.head            |            470.33 (29.59) |            548.05 (83.47) | +16.52% |  +15.05% (11.55 pp) |
| throughput/100/insert.middle            |            628.54 (34.32) |              600 (103.46) |  -4.54% |   -1.24% (17.09 pp) |
| throughput/1000/insert.middle           |            751.66 (64.29) |            663.56 (94.09) | -11.72% |    -5.18% (6.15 pp) |
| throughput/5000/insert.middle           |            651.99 (20.86) |             650.5 (81.62) |  -0.23% |    +0.07% (3.29 pp) |
| throughput/10000/insert.middle          |            613.93 (10.67) |            681.34 (33.92) | +10.98% |   +11.22% (8.08 pp) |
| throughput/15000/insert.middle          |            627.92 (16.64) |            668.45 (99.01) |  +6.45% |   -0.45% (14.88 pp) |
| throughput/20000/insert.middle          |            609.41 (15.22) |           647.14 (103.96) |  +6.19% |    +6.19% (9.46 pp) |
| throughput/25000/insert.middle          |            593.44 (38.87) |           619.97 (180.06) |  +4.47% |   +9.65% (38.39 pp) |
| throughput/100/insert.random            |           894.71 (135.75) |            855.38 (33.35) |  -4.40% |   -0.64% (15.59 pp) |
| throughput/1000/insert.random           |            991.64 (64.81) |         1,015.55 (123.87) |  +2.41% |   -4.57% (21.11 pp) |
| throughput/5000/insert.random           |            951.51 (88.19) |            908.44 (13.94) |  -4.53% |    -2.08% (7.05 pp) |
| throughput/10000/insert.random          |            917.24 (31.83) |           961.24 (164.58) |  +4.80% |  +10.36% (17.22 pp) |
| throughput/15000/insert.random          |            889.63 (76.65) |           905.92 (382.52) |  +1.83% |   +3.97% (55.12 pp) |
| throughput/20000/insert.random          |            901.65 (76.32) |            957.39 (63.01) |  +6.18% |   +1.10% (20.73 pp) |
| throughput/25000/insert.random          |            934.88 (83.34) |            845.84 (20.96) |  -9.52% |   -10.44% (2.38 pp) |
| throughput/100/insert.sameIndex         |               580 (45.06) |            555.14 (40.37) |  -4.29% |    -8.38% (9.07 pp) |
| throughput/1000/insert.sameIndex        |            609.68 (31.53) |             599.1 (67.74) |  -1.74% |   +3.06% (14.93 pp) |
| throughput/5000/insert.sameIndex        |            594.21 (28.87) |            593.75 (59.57) |  -0.08% |     -0.76% (3.8 pp) |
| throughput/10000/insert.sameIndex       |             546.21 (38.3) |           617.24 (146.15) | +13.00% |   +8.93% (27.21 pp) |
| throughput/15000/insert.sameIndex       |            538.52 (45.06) |            586.98 (63.54) |  +9.00% |   +13.86% (9.89 pp) |
| throughput/20000/insert.sameIndex       |               566 (68.98) |            576.97 (106.7) |  +1.94% |    +1.94% (3.14 pp) |
| throughput/25000/insert.sameIndex       |            561.86 (15.44) |            530.62 (43.35) |  -5.56% |    -4.39% (6.18 pp) |
| throughput/100/insert.tail              |            863.68 (78.18) |             850.3 (65.92) |  -1.55% |   -8.13% (10.97 pp) |
| throughput/1000/insert.tail             |           851.32 (137.08) |           951.46 (196.36) | +11.76% |   +6.59% (11.04 pp) |
| throughput/5000/insert.tail             |            924.94 (53.67) |             970.39 (25.4) |  +4.91% |    +3.28% (9.47 pp) |
| throughput/10000/insert.tail            |            924.88 (68.24) |           965.26 (118.44) |  +4.37% |  +14.14% (27.99 pp) |
| throughput/15000/insert.tail            |            722.84 (226.3) |              935 (232.39) | +29.35% |    +1.30% (4.72 pp) |
| throughput/20000/insert.tail            |           910.67 (165.92) |           951.54 (135.94) |  +4.49% |   +13.40% (22.1 pp) |
| throughput/25000/insert.tail            |           949.17 (192.46) |           828.82 (210.12) | -12.68% |   -1.65% (11.87 pp) |
| throughput/100/length                   |            127.85 (53.32) |            120.69 (14.88) |  -5.60% |   -7.75% (25.77 pp) |
| throughput/1000/length                  |             114.31 (7.17) |            112.38 (15.87) |  -1.69% |   +6.92% (17.73 pp) |
| throughput/5000/length                  |            123.52 (10.49) |             117.93 (6.76) |  -4.53% |    -5.61% (5.99 pp) |
| throughput/10000/length                 |            122.64 (10.32) |            125.11 (25.47) |  +2.01% |   +2.01% (11.83 pp) |
| throughput/15000/length                 |            128.12 (19.54) |            119.69 (16.24) |  -6.58% |   +1.68% (12.69 pp) |
| throughput/20000/length                 |             108.68 (6.74) |            126.27 (39.23) | +16.19% |  +19.64% (35.16 pp) |
| throughput/25000/length                 |            105.49 (10.16) |            102.57 (11.17) |  -2.77% |    -0.44% (6.52 pp) |
| throughput/100/merge.duplicate          |           811.22 (232.55) |           833.31 (135.01) |  +2.72% |   -4.33% (10.28 pp) |
| throughput/1000/merge.duplicate         |            671.84 (19.99) |            694.69 (53.44) |  +3.40% |    +4.18% (9.15 pp) |
| throughput/5000/merge.duplicate         |             644.31 (13.3) |              637.89 (7.5) |  -1.00% |     -0.71% (3.2 pp) |
| throughput/10000/merge.duplicate        |            607.88 (33.62) |             690.8 (66.71) | +13.64% |   +8.27% (18.73 pp) |
| throughput/15000/merge.duplicate        |            591.04 (14.06) |            653.93 (82.37) | +10.64% |  +11.24% (14.99 pp) |
| throughput/20000/merge.duplicate        |             631.5 (39.87) |           684.03 (177.57) |  +8.32% |   +4.54% (14.66 pp) |
| throughput/25000/merge.duplicate        |              601.5 (79.8) |            596.01 (54.48) |  -0.91% |   -7.24% (23.29 pp) |
| throughput/100/merge.insert             |          1,831.77 (169.2) |          1,789.46 (35.23) |  -2.31% |   +2.65% (13.48 pp) |
| throughput/1000/merge.insert            |           1,536.15 (63.3) |         1,738.21 (261.05) | +13.15% |    +9.87% (22.5 pp) |
| throughput/5000/merge.insert            |          1,588.01 (26.17) |          1,599.65 (99.33) |  +0.73% |    +0.77% (7.79 pp) |
| throughput/10000/merge.insert           |          1,555.33 (25.28) |           1,622.26 (15.9) |  +4.30% |    +3.09% (3.93 pp) |
| throughput/15000/merge.insert           |           1,587.1 (10.74) |         1,505.21 (122.06) |  -5.16% |    +2.02% (9.03 pp) |
| throughput/20000/merge.insert           |          1,544.41 (77.36) |         1,494.95 (235.85) |  -3.20% |   +2.93% (18.28 pp) |
| throughput/25000/merge.insert           |         1,392.83 (259.59) |           1,458.5 (98.48) |  +4.71% |    -2.13% (5.87 pp) |
| throughput/100/remove.head              |            709.77 (66.22) |           803.15 (212.48) | +13.16% |    +4.23% (8.72 pp) |
| throughput/1000/remove.head             |             793.38 (46.1) |           816.57 (135.03) |  +2.92% |   -0.69% (20.34 pp) |
| throughput/5000/remove.head             |            825.39 (10.37) |            865.96 (53.62) |  +4.92% |   +4.73% (11.09 pp) |
| throughput/10000/remove.head            |            897.93 (75.41) |             904.2 (68.48) |  +0.70% |    -1.30% (6.43 pp) |
| throughput/15000/remove.head            |            902.94 (80.32) |           859.41 (110.64) |  -4.82% |    -0.07% (6.95 pp) |
| throughput/20000/remove.head            |            953.77 (36.41) |            930.5 (124.18) |  -2.44% |   -7.04% (26.98 pp) |
| throughput/25000/remove.head            |             956.41 (4.19) |            950.43 (83.73) |  -0.63% |   -5.00% (12.38 pp) |
| throughput/100/remove.middle            |           834.57 (160.16) |            866.38 (69.79) |  +3.81% |   -3.30% (27.49 pp) |
| throughput/1000/remove.middle           |            835.84 (11.66) |            828.74 (32.78) |  -0.85% |   +0.13% (11.94 pp) |
| throughput/5000/remove.middle           |             855.12 (9.23) |            855.56 (49.35) |  +0.05% |    -0.11% (8.68 pp) |
| throughput/10000/remove.middle          |            845.87 (17.62) |         1,017.91 (178.56) | +20.34% |  +27.67% (22.73 pp) |
| throughput/15000/remove.middle          |            902.83 (59.48) |             890.31 (10.7) |  -1.39% |   -1.67% (11.08 pp) |
| throughput/20000/remove.middle          |           1,009.8 (52.41) |            980.18 (79.25) |  -2.93% |    -4.78% (4.22 pp) |
| throughput/25000/remove.middle          |               950.89 (45) |            971.34 (58.46) |  +2.15% |    +4.79% (13.8 pp) |
| throughput/100/remove.random            |          1,165.1 (164.32) |          1,071.59 (126.4) |  -8.03% |  -12.02% (33.09 pp) |
| throughput/1000/remove.random           |           1,184.6 (41.92) |          1,220.09 (68.71) |  +3.00% |    +7.68% (9.82 pp) |
| throughput/5000/remove.random           |          1,247.01 (27.98) |          1,219.06 (67.43) |  -2.24% |    -2.79% (4.56 pp) |
| throughput/10000/remove.random          |         1,434.73 (123.05) |         1,407.42 (184.84) |  -1.90% |   -0.66% (13.09 pp) |
| throughput/15000/remove.random          |         1,318.11 (217.01) |          1,170.29 (99.21) | -11.21% |  -16.08% (16.51 pp) |
| throughput/20000/remove.random          |          1,342.73 (95.62) |          1,399.31 (88.05) |  +4.21% |     +8.58% (6.6 pp) |
| throughput/25000/remove.random          |          1,336.63 (81.28) |          1,385.2 (321.75) |  +3.63% |   +7.27% (31.13 pp) |
| throughput/100/remove.sameIndex         |           1,069.6 (46.21) |         1,092.57 (359.21) |  +2.15% |   -0.76% (55.49 pp) |
| throughput/1000/remove.sameIndex        |            848.59 (32.41) |             836.5 (32.41) |  -1.42% |   -1.43% (17.03 pp) |
| throughput/5000/remove.sameIndex        |            888.26 (68.79) |             827.7 (85.03) |  -6.82% |   -3.34% (10.19 pp) |
| throughput/10000/remove.sameIndex       |            913.53 (13.91) |             911.71 (6.64) |  -0.20% |    -0.27% (6.83 pp) |
| throughput/15000/remove.sameIndex       |            877.71 (43.24) |               870.3 (4.4) |  -0.84% |    -1.08% (8.56 pp) |
| throughput/20000/remove.sameIndex       |           967.56 (117.55) |           956.47 (112.36) |  -1.15% |   +3.25% (31.39 pp) |
| throughput/25000/remove.sameIndex       |          1,022.7 (122.42) |            938.64 (59.07) |  -8.22% |   -8.22% (18.63 pp) |
| throughput/100/remove.tail              |           723.99 (187.01) |            756.14 (65.95) |  +4.44% |   -4.96% (14.05 pp) |
| throughput/1000/remove.tail             |            743.85 (23.31) |            734.15 (19.74) |  -1.30% |   +0.44% (12.59 pp) |
| throughput/5000/remove.tail             |            765.65 (47.63) |            745.95 (39.34) |  -2.57% |   -6.45% (12.04 pp) |
| throughput/10000/remove.tail            |           781.76 (270.57) |              827.05 (9.1) |  +5.79% |   +5.79% (25.86 pp) |
| throughput/15000/remove.tail            |            808.27 (57.46) |            767.17 (38.46) |  -5.08% |   -5.08% (15.65 pp) |
| throughput/20000/remove.tail            |             858.99 (3.78) |            882.87 (39.44) |  +2.78% |    +6.72% (4.95 pp) |
| throughput/25000/remove.tail            |            847.16 (37.26) |           923.23 (140.66) |  +8.98% |   +6.67% (21.14 pp) |
| throughput/100/replace.head             |         1,191.05 (238.31) |          1,134.91 (77.62) |  -4.71% |   +1.24% (13.46 pp) |
| throughput/1000/replace.head            |          1,151.12 (35.11) |          1,171.42 (65.75) |  +1.76% |    +3.35% (6.28 pp) |
| throughput/5000/replace.head            |          1,190.97 (37.84) |           1,157.92 (8.18) |  -2.78% |     +0.23% (3.2 pp) |
| throughput/10000/replace.head           |          1,158.72 (69.11) |          1,209.71 (24.26) |  +4.40% |    +2.84% (8.23 pp) |
| throughput/15000/replace.head           |         1,179.34 (118.26) |           1,172.4 (40.36) |  -0.59% |   +4.25% (11.12 pp) |
| throughput/20000/replace.head           |          1,206.13 (59.93) |         1,214.55 (177.71) |  +0.70% |   -0.58% (14.61 pp) |
| throughput/25000/replace.head           |          1,166.63 (57.82) |         1,386.96 (387.92) | +18.89% |   +4.04% (36.35 pp) |
| throughput/100/replace.middle           |         1,060.67 (235.42) |         1,087.32 (204.63) |  +2.51% |    +1.87% (5.92 pp) |
| throughput/1000/replace.middle          |          1,218.14 (27.17) |          1,235.73 (15.31) |  +1.44% |    +2.02% (6.98 pp) |
| throughput/5000/replace.middle          |          1,223.35 (20.67) |          1,212.74 (59.21) |  -0.87% |   -2.09% (10.83 pp) |
| throughput/10000/replace.middle         |          1,246.53 (33.76) |          1,292.97 (47.44) |  +3.73% |    +3.73% (7.24 pp) |
| throughput/15000/replace.middle         |          1,228.03 (29.67) |          1,217.31 (91.69) |  -0.87% |    +0.32% (7.51 pp) |
| throughput/20000/replace.middle         |         1,354.87 (107.07) |          1,369.88 (427.7) |  +1.11% |   -1.10% (38.31 pp) |
| throughput/25000/replace.middle         |            1,240.8 (52.8) |          1,241.4 (228.36) |  +0.05% |   +0.05% (25.92 pp) |
| throughput/100/replace.random           |         1,719.72 (308.08) |         1,751.96 (197.65) |  +1.87% |    -1.94% (8.35 pp) |
| throughput/1000/replace.random          |           1,917.3 (82.57) |          1,818.19 (31.19) |  -5.17% |    -4.06% (8.95 pp) |
| throughput/5000/replace.random          |          1,803.63 (94.35) |         1,788.49 (310.24) |  -0.84% |    -4.19% (7.88 pp) |
| throughput/10000/replace.random         |         1,719.87 (122.81) |         1,908.63 (210.91) | +10.98% |  +13.15% (30.49 pp) |
| throughput/15000/replace.random         |          1,922.83 (83.83) |          1,676.78 (39.16) | -12.80% |   -11.23% (1.69 pp) |
| throughput/20000/replace.random         |           1,889.7 (27.77) |         1,803.96 (112.41) |  -4.54% |    -3.62% (3.86 pp) |
| throughput/25000/replace.random         |          1,857.93 (82.41) |           1,849.45 (95.3) |  -0.46% |   -0.42% (10.98 pp) |
| throughput/100/replace.sameIndex        |         1,066.95 (150.48) |         1,144.97 (138.25) |  +7.31% |   -3.58% (12.14 pp) |
| throughput/1000/replace.sameIndex       |          1,174.08 (71.34) |          1,153.14 (24.48) |  -1.78% |    +0.87% (5.29 pp) |
| throughput/5000/replace.sameIndex       |          1,194.14 (52.23) |          1,150.56 (67.32) |  -3.65% |     -5.98% (8.8 pp) |
| throughput/10000/replace.sameIndex      |         1,270.69 (363.48) |          1,213.64 (27.13) |  -4.49% |   -3.23% (25.27 pp) |
| throughput/15000/replace.sameIndex      |        1,269.56 (1,226.2) |          1,140.69 (71.01) | -10.15% |   -10.15% (44.7 pp) |
| throughput/20000/replace.sameIndex      |          1,240.57 (59.58) |         1,230.51 (131.16) |  -0.81% |   -0.62% (11.57 pp) |
| throughput/25000/replace.sameIndex      |          1,255.22 (56.45) |          1,231.54 (95.62) |  -1.89% |    -1.80% (6.21 pp) |
| throughput/100/replace.tail             |         1,091.63 (168.81) |           1,085.82 (92.8) |  -0.53% |    -0.53% (10.3 pp) |
| throughput/1000/replace.tail            |           1,252.7 (52.57) |          1,169.09 (29.05) |  -6.67% |    -4.56% (5.73 pp) |
| throughput/5000/replace.tail            |          1,173.51 (84.28) |          1,266.6 (151.11) |  +7.93% |   +3.55% (17.23 pp) |
| throughput/10000/replace.tail           |          1,237.28 (52.05) |          1,237.72 (69.75) |  +0.04% |    -0.46% (12.5 pp) |
| throughput/15000/replace.tail           |          1,289.76 (67.98) |          1,163.92 (32.86) |  -9.76% |   -11.74% (6.47 pp) |
| throughput/20000/replace.tail           |         1,339.86 (206.49) |          1,240.51 (79.69) |  -7.41% |    -5.36% (8.48 pp) |
| throughput/25000/replace.tail           |           1,233.1 (55.34) |          1,199.65 (11.32) |  -2.71% |     -2.71% (3.4 pp) |
| throughput/100/retire                   |            204.99 (27.75) |           167.23 (110.55) | -18.42% |   -4.67% (33.84 pp) |
| throughput/1000/retire                  |             222.48 (6.04) |            209.99 (10.49) |  -5.61% |    -2.40% (3.18 pp) |
| throughput/5000/retire                  |            206.42 (10.11) |            209.87 (15.64) |  +1.67% |    +3.02% (7.57 pp) |
| throughput/10000/retire                 |             206.66 (6.42) |            199.48 (13.11) |  -3.47% |    -2.09% (9.41 pp) |
| throughput/15000/retire                 |             193.29 (11.8) |            191.69 (12.52) |  -0.83% |    +0.98% (3.35 pp) |
| throughput/20000/retire                 |            204.24 (14.73) |             189.45 (9.49) |  -7.24% |   -2.22% (22.84 pp) |
| throughput/25000/retire                 |             192.05 (6.92) |                183.7 (18) |  -4.35% |    -1.85% (1.91 pp) |
| throughput/100/sequence                 |             328.7 (40.36) |            313.04 (79.44) |  -4.76% |   +1.91% (39.38 pp) |
| throughput/1000/sequence                |             300.05 (3.95) |            278.73 (17.27) |  -7.11% |    -1.46% (5.34 pp) |
| throughput/5000/sequence                |            276.41 (60.08) |             267.86 (1.97) |  -3.09% |   -2.82% (18.97 pp) |
| throughput/10000/sequence               |            281.36 (16.54) |            265.96 (27.71) |  -5.47% |   -6.77% (16.35 pp) |
| throughput/15000/sequence               |              255.3 (9.15) |             251.67 (7.99) |  -1.42% |    -1.77% (4.74 pp) |
| throughput/20000/sequence               |            237.84 (22.77) |             225.68 (9.58) |  -5.11% |     -2.24% (7.4 pp) |
| throughput/25000/sequence               |             252.08 (4.94) |            232.11 (13.73) |  -7.92% |    -8.25% (8.07 pp) |
| throughput/100/value.head               |            208.27 (41.99) |            178.16 (53.99) | -14.46% |   -11.36% (3.83 pp) |
| throughput/1000/value.head              |             169.57 (9.63) |              162.5 (8.42) |  -4.17% |   -4.17% (13.84 pp) |
| throughput/5000/value.head              |            153.79 (41.78) |            153.05 (17.42) |  -0.48% |   +2.69% (23.84 pp) |
| throughput/10000/value.head             |             147.68 (9.13) |             151.77 (3.64) |  +2.77% |    +6.04% (2.74 pp) |
| throughput/15000/value.head             |             141.26 (8.18) |            150.85 (10.42) |  +6.79% |    +9.52% (4.57 pp) |
| throughput/20000/value.head             |             141.36 (8.09) |            142.69 (11.47) |  +0.94% |   +5.44% (15.32 pp) |
| throughput/25000/value.head             |            140.14 (12.25) |              149.43 (2.1) |  +6.63% |   +15.86% (18.5 pp) |
| throughput/100/value.middle             |            303.88 (26.13) |           228.62 (130.73) | -24.77% |    -5.27% (54.9 pp) |
| throughput/1000/value.middle            |            256.21 (14.06) |             259.27 (7.43) |  +1.19% |    -1.69% (4.88 pp) |
| throughput/5000/value.middle            |            234.47 (24.62) |              237.2 (8.21) |  +1.16% |    +0.20% (6.06 pp) |
| throughput/10000/value.middle           |             231.02 (9.55) |            216.98 (23.62) |  -6.08% |    -3.96% (8.32 pp) |
| throughput/15000/value.middle           |            231.68 (14.29) |             216.23 (3.27) |  -6.67% |     -4.70% (6.1 pp) |
| throughput/20000/value.middle           |             218.4 (11.97) |            217.46 (12.22) |  -0.43% |    +3.33% (6.04 pp) |
| throughput/25000/value.middle           |             216.5 (19.85) |            223.05 (15.57) |  +3.03% |    +1.26% (7.61 pp) |
| throughput/100/value.random             |            234.12 (63.18) |            207.12 (62.06) | -11.53% |   +6.22% (14.42 pp) |
| throughput/1000/value.random            |             222.79 (14.6) |            224.79 (22.22) |  +0.90% |    +6.52% (6.46 pp) |
| throughput/5000/value.random            |             276.74 (1.79) |            297.84 (24.14) |  +7.62% |       +7.19% (9 pp) |
| throughput/10000/value.random           |            304.83 (10.65) |            275.08 (46.69) |  -9.76% |   -7.46% (16.21 pp) |
| throughput/15000/value.random           |            284.02 (24.74) |             273.2 (10.64) |  -3.81% |    -4.69% (12.1 pp) |
| throughput/20000/value.random           |            287.84 (14.48) |             288.07 (2.75) |  +0.08% |    -1.23% (2.51 pp) |
| throughput/25000/value.random           |             287.2 (68.99) |              255.68 (3.6) | -10.97% |   -10.84% (9.12 pp) |
| throughput/100/value.sameIndex          |             222.11 (52.1) |            201.36 (52.39) |  -9.34% |   +2.12% (19.87 pp) |
| throughput/1000/value.sameIndex         |             184.12 (9.95) |             181.04 (9.18) |  -1.67% |   +3.00% (22.56 pp) |
| throughput/5000/value.sameIndex         |             183.5 (20.19) |              186.6 (5.77) |  +1.69% |    +5.32% (5.59 pp) |
| throughput/10000/value.sameIndex        |            178.79 (76.44) |             177.11 (4.95) |  -0.94% |   +0.05% (29.48 pp) |
| throughput/15000/value.sameIndex        |              171.7 (2.92) |            172.51 (25.77) |  +0.47% |    -0.03% (18.8 pp) |
| throughput/20000/value.sameIndex        |            172.32 (17.83) |             164.99 (9.88) |  -4.25% |    -1.07% (2.76 pp) |
| throughput/25000/value.sameIndex        |            151.79 (35.74) |            172.53 (54.73) | +13.66% |     +13.77% (42 pp) |
| throughput/100/value.tail               |            279.01 (46.46) |            300.39 (105.8) |  +7.66% |   -2.97% (37.09 pp) |
| throughput/1000/value.tail              |            222.14 (19.72) |             211.7 (12.81) |  -4.70% |    -1.08% (2.92 pp) |
| throughput/5000/value.tail              |            204.93 (21.34) |             201.21 (5.59) |  -1.82% |   +4.00% (10.25 pp) |
| throughput/10000/value.tail             |             193.91 (8.01) |            203.25 (31.01) |  +4.82% |  +10.33% (16.95 pp) |
| throughput/15000/value.tail             |             202.8 (17.29) |             191.26 (7.84) |  -5.69% |    -5.04% (11.5 pp) |
| throughput/20000/value.tail             |             179.21 (7.98) |             186.63 (9.94) |  +4.14% |    +2.81% (4.81 pp) |
| throughput/25000/value.tail             |            190.43 (11.36) |            198.54 (62.61) |  +4.26% |  +10.05% (44.67 pp) |
| throughput/100/values                   |          5,131.89 (757.5) |         4,682.98 (994.09) |  -8.75% |   +3.88% (37.74 pp) |
| throughput/1000/values                  |    167,745.47 (10,096.13) |     166,202.19 (1,347.03) |  -0.92% |    -1.25% (6.17 pp) |
| throughput/5000/values                  |     577,190.1 (26,736.98) |    586,799.48 (90,895.31) |  +1.66% |   +6.43% (13.88 pp) |
| throughput/10000/values                 | 1,217,078.13 (304,978.13) |  1,408,721.09 (21,188.28) | +15.75% |  +16.25% (21.48 pp) |
| throughput/15000/values                 | 1,885,801.56 (210,579.69) |       2,025,775 (130,525) |  +7.42% |    +7.27% (7.24 pp) |
| throughput/20000/values                 | 2,905,296.88 (130,739.06) | 2,671,656.25 (381,139.06) |  -8.04% |  -11.25% (18.36 pp) |
| throughput/25000/values                 |  3,632,068.75 (80,298.44) |  3,623,557.81 (93,018.75) |  -0.23% |    +1.59% (9.84 pp) |
| throughput/100/values.head              |           356.69 (168.63) |            281.35 (112.5) | -21.12% |      -6.18% (24 pp) |
| throughput/1000/values.head             |            282.99 (35.57) |            269.84 (70.91) |  -4.65% |   +3.04% (20.72 pp) |
| throughput/5000/values.head             |            281.13 (24.79) |             275.65 (46.4) |  -1.95% |   +3.58% (21.93 pp) |
| throughput/10000/values.head            |             269.8 (26.52) |            274.22 (33.61) |  +1.64% |   +1.64% (27.62 pp) |
| throughput/15000/values.head            |             275.8 (12.02) |            305.62 (44.55) | +10.81% |   +8.03% (24.15 pp) |
| throughput/20000/values.head            |            266.41 (13.74) |            274.98 (52.76) |  +3.22% |   +0.91% (23.25 pp) |
| throughput/25000/values.head            |            289.76 (13.05) |               267 (87.66) |  -7.85% |   -6.94% (32.04 pp) |
| throughput/100/values.middle            |            330.38 (64.59) |            276.56 (76.42) | -16.29% |   +3.21% (23.66 pp) |
| throughput/1000/values.middle           |             277.14 (7.26) |             267.15 (9.13) |  -3.60% |    -5.86% (2.44 pp) |
| throughput/5000/values.middle           |            328.83 (40.23) |            278.66 (39.88) | -15.26% |    -9.16% (5.32 pp) |
| throughput/10000/values.middle          |            285.81 (25.21) |            290.93 (36.86) |  +1.79% |   -9.77% (25.93 pp) |
| throughput/15000/values.middle          |            257.68 (25.06) |            244.12 (19.73) |  -5.26% |   -6.02% (12.96 pp) |
| throughput/20000/values.middle          |            262.72 (42.62) |            281.12 (41.27) |  +7.00% |   -3.16% (12.37 pp) |
| throughput/25000/values.middle          |            242.27 (17.85) |             233.59 (8.29) |  -3.58% |   -1.61% (15.38 pp) |
| throughput/100/values.random            |            338.93 (71.96) |            286.88 (40.89) | -15.36% |    -4.20% (4.72 pp) |
| throughput/1000/values.random           |            309.34 (26.48) |            313.75 (26.93) |  +1.43% |    -3.71% (2.88 pp) |
| throughput/5000/values.random           |            351.54 (75.45) |            352.65 (26.05) |  +0.32% |  -10.67% (14.42 pp) |
| throughput/10000/values.random          |            411.06 (78.38) |            404.91 (48.37) |  -1.50% |   -1.50% (12.73 pp) |
| throughput/15000/values.random          |            372.99 (44.59) |            378.83 (31.83) |  +1.57% |   -0.15% (20.29 pp) |
| throughput/20000/values.random          |             413.85 (6.08) |            438.12 (44.69) |  +5.86% |   +4.46% (10.68 pp) |
| throughput/25000/values.random          |             379.8 (32.62) |             371.74 (8.06) |  -2.12% |    +2.04% (9.38 pp) |
| throughput/100/values.sameIndex         |             292.4 (110.3) |            323.66 (62.06) | +10.69% |    +10.69% (5.5 pp) |
| throughput/1000/values.sameIndex        |             266.39 (6.28) |            272.54 (13.42) |  +2.31% |    +1.84% (9.92 pp) |
| throughput/5000/values.sameIndex        |            256.23 (19.76) |            271.45 (45.23) |  +5.94% |    +5.94% (4.81 pp) |
| throughput/10000/values.sameIndex       |             251.8 (14.07) |             283.3 (23.82) | +12.51% |   +3.71% (19.92 pp) |
| throughput/15000/values.sameIndex       |               240.06 (26) |            261.85 (31.93) |  +9.08% |    +2.80% (4.54 pp) |
| throughput/20000/values.sameIndex       |           271.38 (125.08) |            300.98 (38.47) | +10.91% |   -3.53% (20.48 pp) |
| throughput/25000/values.sameIndex       |            237.15 (16.12) |            262.92 (39.04) | +10.87% |   +14.00% (7.82 pp) |
| throughput/100/values.tail              |            308.13 (88.02) |            284.51 (40.34) |  -7.67% |    -3.64% (6.32 pp) |
| throughput/1000/values.tail             |            265.03 (17.05) |            274.39 (16.68) |  +3.53% |    +6.24% (7.08 pp) |
| throughput/5000/values.tail             |              270.28 (3.2) |                271.52 (6) |  +0.46% |    +0.56% (8.19 pp) |
| throughput/10000/values.tail            |            290.83 (41.78) |             286.4 (22.89) |  -1.52% |   +2.34% (12.43 pp) |
| throughput/15000/values.tail            |             245.75 (9.04) |            277.19 (32.72) | +12.79% |      +2.93% (12 pp) |
| throughput/20000/values.tail            |            276.29 (37.29) |            294.34 (45.58) |  +6.53% |   +8.51% (18.94 pp) |
| throughput/25000/values.tail            |            227.88 (17.63) |            283.25 (27.59) | +24.30% |  +28.85% (27.78 pp) |
| lifecycle/scaleUp/apply.random          |         3,838.44 (431.83) |         3,726.21 (121.82) |  -2.92% |    +1.81% (6.87 pp) |
| lifecycle/scaleUp/insert.head           |           866.34 (103.24) |             880.5 (87.43) |  +1.63% |   +1.63% (27.58 pp) |
| lifecycle/scaleUp/insert.random         |           1,735.68 (69.2) |          1,797.26 (173.8) |  +3.55% |    +1.20% (0.36 pp) |
| lifecycle/scaleUp/insert.tail           |            762.34 (49.04) |           749.32 (120.73) |  -1.71% |    -0.90% (3.87 pp) |
| lifecycle/scaleUp/remove.random         |          2,829.54 (148.3) |          2,801.76 (97.31) |  -0.98% |    +1.93% (8.61 pp) |
| lifecycle/scaleUp/replace.head          |         2,651.91 (187.72) |          2,578.94 (201.1) |  -2.75% |     -8.07% (7.2 pp) |
| lifecycle/scaleUp/replace.random        |         3,762.72 (393.86) |          3,638.63 (161.7) |  -3.30% |    -9.26% (5.35 pp) |
| lifecycle/scaleUp/replace.tail          |         2,573.86 (217.43) |         2,338.25 (119.15) |  -9.15% |   -2.25% (15.93 pp) |
| lifecycle/scaleUp/value.head            |            311.83 (14.06) |            319.67 (21.11) |  +2.51% |    +0.39% (5.94 pp) |
| lifecycle/scaleUp/value.random          |          1,128.24 (81.88) |          1,153.57 (22.55) |  +2.25% |    +2.25% (5.32 pp) |
| lifecycle/scaleUp/value.tail            |              160.59 (2.3) |             154.54 (2.49) |  -3.77% |    -4.98% (1.45 pp) |
| lifecycle/scaleDown/apply.random        |         3,581.39 (159.39) |         3,802.26 (258.26) |  +6.17% |    +6.13% (2.94 pp) |
| lifecycle/scaleDown/insert.random       |          1,775.04 (27.56) |           1,731.59 (6.22) |  -2.45% |    -2.45% (3.09 pp) |
| lifecycle/scaleDown/remove.head         |         2,033.79 (784.91) |         1,897.49 (108.29) |  -6.70% |    -3.13% (24.4 pp) |
| lifecycle/scaleDown/remove.random       |         2,748.36 (192.15) |         2,700.08 (160.64) |  -1.76% |    -0.67% (10.2 pp) |
| lifecycle/scaleDown/remove.tail         |         1,810.41 (154.82) |         1,725.37 (157.73) |  -4.70% |   -2.75% (10.39 pp) |
| lifecycle/scaleDown/replace.head        |         2,581.05 (114.23) |         2,623.66 (390.07) |  +1.65% |   +1.73% (19.59 pp) |
| lifecycle/scaleDown/replace.random      |         3,497.03 (427.99) |          3,371.04 (50.72) |  -3.60% |    -2.31% (1.17 pp) |
| lifecycle/scaleDown/replace.tail        |      20,844.54 (1,292.19) |        19,762.39 (909.47) |  -5.19% |    -5.19% (5.85 pp) |
| lifecycle/scaleDown/value.head          |             435.16 (7.37) |            432.28 (16.66) |  -0.66% |    -1.95% (5.21 pp) |
| lifecycle/scaleDown/value.random        |          1,110.76 (65.54) |          1,105.44 (15.98) |  -0.48% |    -1.69% (2.57 pp) |
| lifecycle/scaleDown/value.tail          |             242.36 (6.96) |             235.53 (7.79) |  -2.82% |    -4.14% (2.79 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,709.91 (499.25) |          3,763.26 (97.96) |  +1.44% |    +5.00% (4.08 pp) |
| lifecycle/fullLifecycle/insert.head     |           866.34 (103.24) |             880.5 (87.43) |  +1.63% |   +1.63% (27.58 pp) |
| lifecycle/fullLifecycle/insert.random   |           1,766.2 (31.24) |          1,766.09 (99.02) |  -0.01% |    -1.41% (3.22 pp) |
| lifecycle/fullLifecycle/insert.tail     |            762.34 (49.04) |           749.32 (120.73) |  -1.71% |    -0.90% (3.87 pp) |
| lifecycle/fullLifecycle/remove.head     |         2,033.79 (784.91) |         1,897.49 (108.29) |  -6.70% |    -3.13% (24.4 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,788.95 (170.23) |         2,751.35 (150.85) |  -1.35% |    +0.64% (9.39 pp) |
| lifecycle/fullLifecycle/remove.tail     |         1,810.41 (154.82) |         1,725.37 (157.73) |  -4.70% |   -2.75% (10.39 pp) |
| lifecycle/fullLifecycle/replace.head    |          2,670.33 (78.21) |         2,624.12 (303.45) |  -1.73% |   +0.33% (10.01 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,790.83 (321.92) |         3,483.84 (247.02) |  -8.10% |    -5.89% (5.49 pp) |
| lifecycle/fullLifecycle/replace.tail    |        11,664.07 (582.51) |        11,095.07 (181.83) |  -4.88% |    -5.77% (3.09 pp) |
| lifecycle/fullLifecycle/value.head      |            372.52 (12.16) |            375.97 (18.88) |  +0.93% |    -2.45% (3.53 pp) |
| lifecycle/fullLifecycle/value.random    |          1,150.19 (52.67) |          1,132.41 (46.02) |  -1.55% |    -1.65% (3.35 pp) |
| lifecycle/fullLifecycle/value.tail      |             198.63 (4.99) |             195.67 (6.13) |  -1.49% |    -3.89% (5.78 pp) |
| checkpoint/up/1000/create               |           276,100 (6,900) |          281,200 (21,000) |  +1.85% |   +8.24% (10.32 pp) |
| checkpoint/up/1000/sequence             |       2,176,400 (322,100) |       2,037,600 (152,300) |  -6.38% |   -6.10% (14.06 pp) |
| checkpoint/up/1000/values               |       1,916,500 (281,100) |        1,860,900 (56,000) |  -2.90% |    -2.90% (25.8 pp) |
| checkpoint/up/5000/create               |          899,300 (87,400) |          841,400 (14,400) |  -6.44% |   -4.60% (12.03 pp) |
| checkpoint/up/5000/sequence             |     7,911,600 (1,480,900) |       7,966,300 (549,600) |  +0.69% |    -1.14% (4.66 pp) |
| checkpoint/up/5000/values               |       5,915,600 (652,500) |       5,108,000 (648,300) | -13.65% |   -13.65% (1.45 pp) |
| checkpoint/up/10000/create              |       1,601,900 (205,000) |        1,642,100 (82,200) |  +2.51% |   -2.39% (17.68 pp) |
| checkpoint/up/10000/sequence            |    13,840,900 (1,684,700) |    12,736,900 (1,234,500) |  -7.98% |    -9.77% (3.69 pp) |
| checkpoint/up/10000/values              |    21,163,400 (1,060,000) |      20,191,600 (581,600) |  -4.59% |    -5.72% (7.02 pp) |
| checkpoint/up/15000/create              |        2,332,400 (17,100) |        2,305,800 (50,600) |  -1.14% |    -1.14% (2.91 pp) |
| checkpoint/up/15000/sequence            |      15,423,600 (716,600) |      14,837,100 (347,000) |  -3.80% |    -3.80% (7.17 pp) |
| checkpoint/up/15000/values              |      31,046,800 (257,300) |      30,078,500 (577,800) |  -3.12% |    -2.47% (0.85 pp) |
| checkpoint/up/20000/create              |        3,382,300 (37,600) |        3,373,200 (68,200) |  -0.27% |    -0.50% (2.89 pp) |
| checkpoint/up/20000/sequence            |      22,056,500 (225,400) |    22,967,500 (1,720,200) |  +4.13% |    -2.50% (8.95 pp) |
| checkpoint/up/20000/values              |      10,792,000 (569,200) |      11,089,300 (648,500) |  +2.75% |    +0.95% (1.39 pp) |
| checkpoint/up/25000/create              |        3,928,500 (71,100) |       4,081,600 (151,300) |  +3.90% |    +1.92% (7.79 pp) |
| checkpoint/up/25000/sequence            |    23,741,100 (1,708,000) |    26,337,400 (2,876,200) | +10.94% |  +11.39% (21.34 pp) |
| checkpoint/up/25000/values              |      12,091,900 (516,600) |    12,088,800 (3,195,500) |  -0.03% |   -0.14% (28.35 pp) |
| checkpoint/down/20000/create            |        3,449,300 (38,900) |        3,400,100 (86,600) |  -1.43% |     -1.43% (3.5 pp) |
| checkpoint/down/20000/sequence          |    19,457,900 (2,078,100) |      19,255,000 (168,300) |  -1.04% |    -1.34% (9.38 pp) |
| checkpoint/down/20000/values            |    10,922,300 (1,596,900) |       9,082,100 (328,300) | -16.85% |  -16.01% (11.61 pp) |
| checkpoint/down/15000/create            |        2,386,300 (35,300) |        2,402,000 (36,200) |  +0.66% |    +0.66% (1.28 pp) |
| checkpoint/down/15000/sequence          |      15,970,200 (602,600) |      16,252,800 (687,400) |  +1.77% |   +2.61% (11.07 pp) |
| checkpoint/down/15000/values            |       7,475,700 (319,600) |       7,820,200 (803,800) |  +4.61% |    +6.21% (9.68 pp) |
| checkpoint/down/10000/create            |        1,647,000 (12,800) |        1,637,200 (20,200) |  -0.60% |    -1.41% (4.11 pp) |
| checkpoint/down/10000/sequence          |      12,866,400 (915,800) |      13,179,300 (170,600) |  +2.43% |   +2.61% (10.23 pp) |
| checkpoint/down/10000/values            |       5,632,400 (961,300) |       5,863,400 (515,100) |  +4.10% |   +7.84% (16.21 pp) |
| checkpoint/down/5000/create             |          784,000 (34,400) |          769,300 (21,200) |  -1.88% |    -4.72% (7.84 pp) |
| checkpoint/down/5000/sequence           |     9,593,500 (1,267,400) |       9,305,100 (170,000) |  -3.01% |   -2.10% (14.19 pp) |
| checkpoint/down/5000/values             |       2,832,300 (368,000) |       2,773,300 (529,200) |  -2.08% |   -0.58% (14.86 pp) |
| checkpoint/down/1000/create             |          180,100 (21,900) |          161,300 (42,200) | -10.44% |   +3.86% (23.43 pp) |
| checkpoint/down/1000/sequence           |       6,091,000 (595,100) |     6,765,100 (1,286,700) | +11.07% |   +7.07% (16.77 pp) |
| checkpoint/down/1000/values             |         630,600 (256,200) |          606,100 (76,400) |  -3.89% |  +10.19% (33.23 pp) |
| checkpoint/down/0/create                |            14,500 (1,000) |            18,800 (1,600) | +29.66% |   +28.10% (7.33 pp) |
| checkpoint/down/0/sequence              |        1,292,600 (34,700) |       1,742,300 (371,800) | +34.79% |  +36.94% (22.04 pp) |
| checkpoint/down/0/values                |            10,300 (1,800) |            13,200 (1,800) | +28.16% |  +19.80% (13.58 pp) |
| tuple/projection/2/create.empty         |             357.73 (11.8) |            391.27 (53.85) |  +9.38% |   +7.48% (13.79 pp) |
| tuple/tuple/2/create.empty              |            426.94 (35.26) |               450.43 (61) |  +5.50% |    +2.22% (20.5 pp) |
| tuple/projection/2/create.sequence      |          1,210.84 (33.87) |         1,285.38 (395.56) |  +6.16% |   +5.24% (30.77 pp) |
| tuple/tuple/2/create.sequence           |          1,326.32 (58.03) |         1,504.15 (185.96) | +13.41% |   +9.86% (16.47 pp) |
| tuple/projection/2/replace.random       |          1,061.09 (69.83) |          1,064.2 (120.98) |  +0.29% |   +6.88% (22.42 pp) |
| tuple/tuple/2/replace.random            |            668.58 (73.69) |           741.71 (102.54) | +10.94% |   +10.62% (7.32 pp) |
| tuple/projection/2/apply.replace        |         1,755.93 (359.15) |         1,782.06 (384.09) |  +1.49% |    -5.63% (13.7 pp) |
| tuple/tuple/2/apply.replace             |          1,161.47 (81.69) |         1,171.88 (117.07) |  +0.90% |   +3.71% (11.19 pp) |
| tuple/projection/2/apply.duplicate      |            586.67 (57.73) |                578 (83.1) |  -1.48% |    +0.33% (4.52 pp) |
| tuple/tuple/2/apply.duplicate           |            605.21 (34.42) |            576.09 (97.68) |  -4.81% |   +0.33% (19.41 pp) |
| tuple/projection/2/merge.duplicate      |            654.19 (52.38) |            723.17 (51.09) | +10.55% |   +3.78% (23.93 pp) |
| tuple/tuple/2/merge.duplicate           |            613.87 (51.61) |            659.88 (92.13) |  +7.50% |  +14.44% (21.12 pp) |
| tuple/projection/2/length               |               8.13 (0.54) |               7.75 (5.28) |  -4.63% |   +0.59% (82.16 pp) |
| tuple/tuple/2/length                    |               7.39 (0.19) |               7.69 (3.42) |  +4.03% |   +1.61% (51.64 pp) |
| tuple/projection/2/value.random         |             31.86 (10.46) |              32.78 (4.38) |  +2.87% |   +9.29% (43.34 pp) |
| tuple/tuple/2/value.random              |              21.62 (3.97) |              19.84 (3.89) |  -8.25% |   -1.70% (11.34 pp) |
| tuple/projection/2/values               |               83.24 (2.3) |             92.29 (11.24) | +10.87% |   +0.74% (23.15 pp) |
| tuple/tuple/2/values                    |              88.87 (10.3) |              84.96 (38.1) |  -4.39% |   +6.31% (33.37 pp) |
| tuple/projection/2/sequence             |            477.84 (31.17) |            437.48 (53.68) |  -8.45% |    -7.37% (7.39 pp) |
| tuple/tuple/2/sequence                  |           533.69 (165.73) |             467.38 (72.7) | -12.42% |   -3.76% (15.69 pp) |
| tuple/projection/4/create.empty         |           418.82 (122.78) |            446.73 (37.25) |  +6.66% |   +0.45% (37.77 pp) |
| tuple/tuple/4/create.empty              |            466.21 (32.61) |            469.73 (22.82) |  +0.75% |    -1.04% (11.7 pp) |
| tuple/projection/4/create.sequence      |         1,709.67 (354.18) |         1,655.66 (156.96) |  -3.16% |   -6.76% (16.11 pp) |
| tuple/tuple/4/create.sequence           |         1,645.54 (845.48) |         1,526.96 (188.76) |  -7.21% |   -1.31% (32.26 pp) |
| tuple/projection/4/replace.random       |         1,434.86 (384.39) |          1,193.62 (72.67) | -16.81% |   -6.12% (24.27 pp) |
| tuple/tuple/4/replace.random            |            654.09 (10.88) |            705.65 (90.11) |  +7.88% |   +7.88% (19.73 pp) |
| tuple/projection/4/apply.replace        |         1,764.92 (278.51) |         1,694.17 (172.99) |  -4.01% |   -7.00% (13.26 pp) |
| tuple/tuple/4/apply.replace             |          1,146.41 (28.14) |         1,157.37 (101.84) |  +0.96% |    +3.04% (2.01 pp) |
| tuple/projection/4/apply.duplicate      |             624.46 (5.57) |            560.38 (36.23) | -10.26% |    -6.20% (5.61 pp) |
| tuple/tuple/4/apply.duplicate           |            627.89 (66.83) |            580.27 (65.63) |  -7.58% |     -2.74% (6.3 pp) |
| tuple/projection/4/merge.duplicate      |           793.62 (179.33) |           764.04 (107.97) |  -3.73% |    +1.07% (8.32 pp) |
| tuple/tuple/4/merge.duplicate           |           913.67 (105.91) |            906.46 (64.99) |  -0.79% |   +3.48% (13.16 pp) |
| tuple/projection/4/length               |                 28 (22.1) |              29.59 (1.97) |  +5.68% |  +6.95% (268.14 pp) |
| tuple/tuple/4/length                    |             28.81 (21.59) |              28.36 (4.54) |  -1.57% |  +1.92% (220.67 pp) |
| tuple/projection/4/value.random         |              40.54 (6.75) |              44.23 (2.43) |  +9.12% |  +12.61% (24.87 pp) |
| tuple/tuple/4/value.random              |              18.59 (0.55) |              18.35 (0.97) |  -1.26% |    -2.21% (1.15 pp) |
| tuple/projection/4/values               |            155.31 (37.47) |            162.47 (10.24) |  +4.61% |   +8.08% (15.43 pp) |
| tuple/tuple/4/values                    |             151.45 (36.9) |             146.42 (17.7) |  -3.32% |   +4.47% (23.81 pp) |
| tuple/projection/4/sequence             |            472.72 (75.62) |            466.97 (35.64) |  -1.22% |   -7.47% (13.06 pp) |
| tuple/tuple/4/sequence                  |            585.29 (64.16) |              525.84 (6.2) | -10.16% |    -9.62% (5.87 pp) |
| tuple/projection/8/create.empty         |            428.26 (16.99) |            404.59 (14.34) |  -5.53% |    -4.42% (2.16 pp) |
| tuple/tuple/8/create.empty              |            452.96 (34.55) |            444.14 (15.01) |  -1.95% |    +0.33% (3.74 pp) |
| tuple/projection/8/create.sequence      |          2,332.68 (92.11) |          2,349.88 (19.33) |  +0.74% |    +1.63% (2.92 pp) |
| tuple/tuple/8/create.sequence           |          1,917.48 (54.39) |         1,925.92 (177.32) |  +0.44% |   +0.02% (13.24 pp) |
| tuple/projection/8/replace.random       |          1,213.42 (37.91) |           1,198.79 (39.5) |  -1.21% |     -3.12% (2.7 pp) |
| tuple/tuple/8/replace.random            |           668.11 (120.33) |            643.64 (19.96) |  -3.66% |   +1.91% (18.98 pp) |
| tuple/projection/8/apply.replace        |          1,801.26 (49.71) |          1,713.57 (59.14) |  -4.87% |    -3.23% (7.12 pp) |
| tuple/tuple/8/apply.replace             |            984.18 (79.15) |         1,034.05 (119.07) |  +5.07% |    +4.86% (15.4 pp) |
| tuple/projection/8/apply.duplicate      |            586.66 (55.87) |            558.57 (21.31) |  -4.79% |    -6.73% (2.53 pp) |
| tuple/tuple/8/apply.duplicate           |            573.92 (17.19) |            571.23 (20.52) |  -0.47% |    -0.85% (4.85 pp) |
| tuple/projection/8/merge.duplicate      |          1,039.79 (54.18) |          1,011.92 (20.95) |  -2.68% |    -3.17% (9.24 pp) |
| tuple/tuple/8/merge.duplicate           |          1,077.89 (23.09) |          1,062.83 (90.15) |  -1.40% |    -0.09% (8.45 pp) |
| tuple/projection/8/length               |             30.49 (27.64) |              27.77 (1.98) |  -8.93% |  -8.93% (248.81 pp) |
| tuple/tuple/8/length                    |             28.81 (26.38) |              28.91 (8.59) |  +0.34% |  +24.41% (270.4 pp) |
| tuple/projection/8/value.random         |                52 (31.65) |             52.87 (13.08) |  +1.65% |   +5.81% (63.57 pp) |
| tuple/tuple/8/value.random              |              21.88 (12.6) |              18.53 (1.53) | -15.30% |   -9.81% (36.09 pp) |
| tuple/projection/8/values               |           228.42 (132.65) |            241.17 (12.55) |  +5.58% |   +1.84% (44.43 pp) |
| tuple/tuple/8/values                    |           210.74 (119.19) |             211.73 (6.22) |  +0.47% |   -0.91% (44.96 pp) |
| tuple/projection/8/sequence             |           655.91 (201.19) |            626.78 (12.66) |  -4.44% |   -7.46% (22.08 pp) |
| tuple/tuple/8/sequence                  |           702.46 (139.06) |             695.54 (4.06) |  -0.98% |   -1.11% (24.18 pp) |
| tuple/projection/100/create.empty       |            443.65 (28.39) |            439.78 (42.59) |  -0.87% |    -1.97% (6.46 pp) |
| tuple/tuple/100/create.empty            |            453.53 (50.34) |            465.56 (18.58) |  +2.65% |   +1.99% (14.15 pp) |
| tuple/projection/100/create.sequence    |        14,103.68 (624.92) |         13,805.79 (44.29) |  -2.11% |    -2.60% (4.77 pp) |
| tuple/tuple/100/create.sequence         |         10,321.64 (47.25) |         11,657.36 (97.01) | +12.94% |   +12.55% (9.85 pp) |
| tuple/projection/100/replace.random     |          1,171.52 (112.5) |         1,274.93 (102.39) |  +8.83% |   +0.92% (16.46 pp) |
| tuple/tuple/100/replace.random          |             627.96 (5.24) |             649.4 (15.43) |  +3.42% |    +2.54% (5.19 pp) |
| tuple/projection/100/apply.replace      |          1,746.34 (115.2) |         1,849.82 (163.29) |  +5.93% |    +4.91% (6.85 pp) |
| tuple/tuple/100/apply.replace           |          1,021.91 (41.63) |             966.56 (69.7) |  -5.42% |   +3.56% (11.63 pp) |
| tuple/projection/100/apply.duplicate    |           560.31 (100.91) |            548.17 (37.73) |  -2.17% |   -8.20% (14.63 pp) |
| tuple/tuple/100/apply.duplicate         |            552.45 (34.47) |           558.85 (141.75) |  +1.16% |   +6.32% (33.64 pp) |
| tuple/projection/100/merge.duplicate    |          8,909.39 (618.4) |         8,729.32 (724.68) |  -2.02% |   -4.02% (15.63 pp) |
| tuple/tuple/100/merge.duplicate         |        12,820.63 (677.29) |        12,810.21 (773.22) |  -0.08% |   -0.08% (12.26 pp) |
| tuple/projection/100/length             |              27.68 (1.48) |              28.63 (3.52) |  +3.44% |   +5.27% (17.36 pp) |
| tuple/tuple/100/length                  |               26.07 (1.7) |               26.59 (0.5) |  +2.00% |   +1.11% (11.15 pp) |
| tuple/projection/100/value.random       |                 79.33 (6) |              81.43 (3.45) |  +2.66% |    +1.68% (7.08 pp) |
| tuple/tuple/100/value.random            |              18.63 (0.65) |              17.97 (0.89) |  -3.52% |    -3.20% (2.92 pp) |
| tuple/projection/100/values             |          1,874.06 (63.57) |         1,946.88 (108.57) |  +3.89% |    +2.38% (3.59 pp) |
| tuple/tuple/100/values                  |          1,591.95 (78.14) |         1,545.91 (114.38) |  -2.89% |      -2.89% (10 pp) |
| tuple/projection/100/sequence           |         6,355.29 (768.58) |         6,261.28 (165.93) |  -1.48% |   +6.29% (17.33 pp) |
| tuple/tuple/100/sequence                |         5,483.46 (285.68) |         5,648.16 (206.74) |  +3.00% |    +2.65% (8.55 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |     Before |  Candidate | Change |
| ----------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                     |    480,376 |    480,376 | +0.00% |
| memory/up/1000/js                         |    407,560 |    407,560 | +0.00% |
| storage/up/1000/jsonBytes                 |    278,238 |    278,238 | +0.00% |
| storage/up/1000/jsonGzipBytes             |     14,908 |     14,908 | +0.00% |
| storage/up/1000/messagePackBytes          |    165,784 |    165,784 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |     12,641 |     12,641 | +0.00% |
| memory/up/5000/native                     |  2,156,536 |  2,156,536 | +0.00% |
| memory/up/5000/js                         |  2,059,744 |  2,059,744 | +0.00% |
| storage/up/5000/jsonBytes                 |  1,662,776 |  1,662,776 | +0.00% |
| storage/up/5000/jsonGzipBytes             |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes          |    839,612 |    839,612 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |     63,127 |     63,127 | +0.00% |
| memory/up/10000/native                    |  3,567,248 |  3,567,248 | +0.00% |
| memory/up/10000/js                        |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes                |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes            |    152,232 |    152,232 | +0.00% |
| storage/up/10000/messagePackBytes         |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |    127,808 |    127,808 | +0.00% |
| memory/up/15000/native                    |  4,819,576 |  4,819,576 | +0.00% |
| memory/up/15000/js                        |  6,196,128 |  6,196,128 | +0.00% |
| storage/up/15000/jsonBytes                |  5,053,159 |  5,053,159 | +0.00% |
| storage/up/15000/jsonGzipBytes            |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes         |  3,635,106 |  3,635,106 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                    |  6,317,704 |  6,317,704 | +0.00% |
| memory/up/20000/js                        |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes                |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes            |    318,634 |    318,634 | +0.00% |
| storage/up/20000/messagePackBytes         |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |    269,890 |    269,890 | +0.00% |
| memory/up/25000/native                    |  7,541,592 |  7,541,592 | +0.00% |
| memory/up/25000/js                        | 10,328,360 | 10,328,360 | +0.00% |
| storage/up/25000/jsonBytes                |  9,500,463 |  9,500,463 | +0.00% |
| storage/up/25000/jsonGzipBytes            |    402,015 |    402,015 | +0.00% |
| storage/up/25000/messagePackBytes         |  6,711,789 |  6,711,789 | +0.00% |
| storage/up/25000/messagePackGzipBytes     |    343,336 |    343,336 | +0.00% |
| memory/down/20000/native                  |  6,597,224 |  6,597,224 | +0.00% |
| memory/down/20000/js                      |  8,267,264 |  8,267,264 | +0.00% |
| storage/down/20000/jsonBytes              |  7,760,743 |  7,760,743 | +0.00% |
| storage/down/20000/jsonGzipBytes          |    334,475 |    334,475 | +0.00% |
| storage/down/20000/messagePackBytes       |  5,444,111 |  5,444,111 | +0.00% |
| storage/down/20000/messagePackGzipBytes   |    284,870 |    284,870 | +0.00% |
| memory/down/15000/native                  |  5,747,352 |  5,747,352 | +0.00% |
| memory/down/15000/js                      |  6,212,288 |  6,212,288 | +0.00% |
| storage/down/15000/jsonBytes              |  5,878,783 |  5,878,783 | +0.00% |
| storage/down/15000/jsonGzipBytes          |    253,153 |    253,153 | +0.00% |
| storage/down/15000/messagePackBytes       |  4,110,000 |  4,110,000 | +0.00% |
| storage/down/15000/messagePackGzipBytes   |    214,870 |    214,870 | +0.00% |
| memory/down/10000/native                  |  4,721,024 |  4,721,024 | +0.00% |
| memory/down/10000/js                      |  4,155,848 |  4,155,848 | +0.00% |
| storage/down/10000/jsonBytes              |  3,941,927 |  3,941,927 | +0.00% |
| storage/down/10000/jsonGzipBytes          |    168,770 |    168,770 | +0.00% |
| storage/down/10000/messagePackBytes       |  2,750,169 |  2,750,169 | +0.00% |
| storage/down/10000/messagePackGzipBytes   |    143,189 |    143,189 | +0.00% |
| memory/down/5000/native                   |  3,777,488 |  3,777,488 | +0.00% |
| memory/down/5000/js                       |  2,066,312 |  2,066,312 | +0.00% |
| storage/down/5000/jsonBytes               |  1,950,486 |  1,950,486 | +0.00% |
| storage/down/5000/jsonGzipBytes           |     81,724 |     81,724 | +0.00% |
| storage/down/5000/messagePackBytes        |  1,363,171 |  1,363,171 | +0.00% |
| storage/down/5000/messagePackGzipBytes    |     69,494 |     69,494 | +0.00% |
| memory/down/1000/native                   |  2,719,416 |  2,719,416 | +0.00% |
| memory/down/1000/js                       |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes               |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes           |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes        |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |     13,932 |     13,932 | +0.00% |
| memory/down/0/native                      |  1,598,032 |  1,598,032 | +0.00% |
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

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_19`. No external competitor was run.
