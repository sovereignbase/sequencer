# Rejected inline locator cache prefix

5 complete matched runs per build. Before: baseline; candidate: text-gate. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 57 timing medians improve over 5%; 92 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 5%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            757.58 (62.54) |             801.12 (37.2) |  +5.75% |  +11.53% (13.36 pp) |
| throughput/1000/apply.duplicate         |           797.91 (114.33) |           712.87 (132.97) | -10.66% |    +0.92% (10.9 pp) |
| throughput/5000/apply.duplicate         |             385.22 (16.8) |            370.59 (13.83) |  -3.80% |    -2.39% (5.26 pp) |
| throughput/10000/apply.duplicate        |            353.64 (31.07) |            331.87 (16.65) |  -6.16% |   +2.26% (18.83 pp) |
| throughput/15000/apply.duplicate        |            316.41 (89.63) |            333.21 (10.54) |  +5.31% |   +5.31% (21.96 pp) |
| throughput/20000/apply.duplicate        |             323.35 (97.4) |             332.51 (6.66) |  +2.83% |   +1.50% (22.96 pp) |
| throughput/25000/apply.duplicate        |            300.63 (16.49) |            306.62 (24.14) |  +1.99% |     +2.67% (8.3 pp) |
| throughput/100/apply.duplicateRemove    |         1,453.85 (151.33) |         1,536.15 (170.91) |  +5.66% |   +0.97% (18.54 pp) |
| throughput/1000/apply.duplicateRemove   |           795.27 (101.08) |             771.84 (23.5) |  -2.95% |   -6.77% (11.62 pp) |
| throughput/5000/apply.duplicateRemove   |            853.09 (54.83) |            745.99 (54.92) | -12.55% |    -7.31% (4.84 pp) |
| throughput/10000/apply.duplicateRemove  |            752.55 (36.08) |            691.76 (20.28) |  -8.08% |   -7.51% (12.47 pp) |
| throughput/15000/apply.duplicateRemove  |            662.5 (135.36) |            647.65 (54.56) |  -2.24% |   -3.25% (31.15 pp) |
| throughput/20000/apply.duplicateRemove  |            680.68 (86.75) |            684.95 (42.56) |  +0.63% |       -2.55% (8 pp) |
| throughput/25000/apply.duplicateRemove  |           720.42 (123.45) |            657.37 (65.77) |  -8.75% |   +6.17% (12.77 pp) |
| throughput/100/apply.duplicateReplace   |          1,297.28 (37.28) |          1,023.13 (26.89) | -21.13% |   -21.08% (4.95 pp) |
| throughput/1000/apply.duplicateReplace  |         1,056.61 (153.41) |         1,032.35 (169.08) |  -2.30% |   +7.34% (10.04 pp) |
| throughput/5000/apply.duplicateReplace  |            930.75 (38.99) |              888.89 (4.8) |  -4.50% |    -4.19% (4.12 pp) |
| throughput/10000/apply.duplicateReplace |            867.56 (10.62) |           889.44 (114.52) |  +2.52% |    +3.13% (5.86 pp) |
| throughput/15000/apply.duplicateReplace |            865.83 (90.23) |             840.07 (37.8) |  -2.98% |   -2.98% (17.32 pp) |
| throughput/20000/apply.duplicateReplace |             829.16 (49.4) |            821.55 (29.63) |  -0.92% |    -1.64% (9.09 pp) |
| throughput/25000/apply.duplicateReplace |            816.11 (38.07) |            877.35 (36.67) |  +7.50% |    +7.64% (0.52 pp) |
| throughput/100/apply.insert             |         1,823.23 (104.01) |         1,859.26 (215.85) |  +1.98% |   +1.98% (22.43 pp) |
| throughput/1000/apply.insert            |         1,461.06 (145.65) |         1,394.75 (108.13) |  -4.54% |    -3.93% (6.57 pp) |
| throughput/5000/apply.insert            |          1,369.16 (66.56) |          1,416.41 (48.57) |  +3.45% |    +2.38% (4.87 pp) |
| throughput/10000/apply.insert           |          1,324.45 (83.13) |          1,400.35 (52.34) |  +5.73% |   +6.39% (11.18 pp) |
| throughput/15000/apply.insert           |          1,289.37 (314.6) |         1,335.78 (115.01) |  +3.60% |   +5.13% (32.55 pp) |
| throughput/20000/apply.insert           |         1,252.23 (185.92) |         1,201.69 (178.84) |  -4.04% |    -2.57% (2.95 pp) |
| throughput/25000/apply.insert           |         1,258.96 (188.17) |           1,252.1 (53.28) |  -0.54% |    -1.68% (25.4 pp) |
| throughput/100/apply.remove             |         1,474.64 (102.74) |          1,780.55 (10.75) | +20.74% |  +24.85% (10.62 pp) |
| throughput/1000/apply.remove            |          1,439.63 (52.96) |          1,466.05 (92.05) |  +1.84% |    -0.75% (3.99 pp) |
| throughput/5000/apply.remove            |          1,548.25 (20.97) |          1,486.11 (12.04) |  -4.01% |   -4.28% (13.09 pp) |
| throughput/10000/apply.remove           |          1,464.37 (95.48) |          1,514.55 (50.22) |  +3.43% |    +3.43% (14.1 pp) |
| throughput/15000/apply.remove           |         1,597.75 (376.17) |         1,620.21 (135.21) |  +1.41% |    -3.03% (11.8 pp) |
| throughput/20000/apply.remove           |         1,504.37 (150.55) |           1,560.4 (78.06) |  +3.72% |   +0.45% (14.35 pp) |
| throughput/25000/apply.remove           |         1,591.67 (107.55) |           1,620.1 (92.99) |  +1.79% |     +0.94% (9.7 pp) |
| throughput/100/apply.replace            |         2,501.95 (221.58) |         2,889.19 (320.09) | +15.48% |  +15.48% (22.33 pp) |
| throughput/1000/apply.replace           |           2,685.12 (58.4) |         2,638.11 (221.77) |  -1.75% |    -3.55% (8.06 pp) |
| throughput/5000/apply.replace           |          2,732.02 (61.02) |         2,743.56 (125.74) |  +0.42% |    +0.42% (8.46 pp) |
| throughput/10000/apply.replace          |         2,737.23 (869.35) |         2,750.51 (458.38) |  +0.49% |  +16.11% (23.09 pp) |
| throughput/15000/apply.replace          |          2,823.52 (17.04) |            2,688.68 (280) |  -4.78% |    -8.24% (3.22 pp) |
| throughput/20000/apply.replace          |         2,688.37 (270.92) |             2,761 (66.59) |  +2.70% |   +2.70% (10.13 pp) |
| throughput/25000/apply.replace          |         2,679.01 (115.64) |         3,011.29 (101.48) | +12.40% |   +8.19% (12.76 pp) |
| throughput/100/create.empty             |           543.85 (104.03) |            609.83 (59.24) | +12.13% |   +4.32% (15.49 pp) |
| throughput/1000/create.empty            |            718.51 (17.58) |            739.94 (103.8) |  +2.98% |   +0.58% (10.04 pp) |
| throughput/5000/create.empty            |           842.37 (128.31) |            815.06 (67.11) |  -3.24% |   -0.05% (37.44 pp) |
| throughput/10000/create.empty           |             789.23 (54.1) |           874.02 (145.43) | +10.74% |  +18.28% (29.72 pp) |
| throughput/15000/create.empty           |            803.83 (37.53) |             788.84 (53.1) |  -1.86% |    +1.61% (6.63 pp) |
| throughput/20000/create.empty           |            745.99 (93.45) |            764.56 (77.92) |  +2.49% |   -1.06% (13.53 pp) |
| throughput/25000/create.empty           |            702.72 (51.03) |           691.44 (111.12) |  -1.61% |   +4.61% (12.84 pp) |
| throughput/100/create.sequence          |          1,563.28 (99.42) |          1,598.81 (74.35) |  +2.27% |    -1.62% (1.27 pp) |
| throughput/1000/create.sequence         |         1,802.77 (151.83) |         1,858.14 (144.53) |  +3.07% |   -1.50% (11.36 pp) |
| throughput/5000/create.sequence         |         1,800.64 (113.32) |         1,615.87 (141.59) | -10.26% |  -11.31% (15.69 pp) |
| throughput/10000/create.sequence        |             1,722.31 (66) |         1,741.38 (103.02) |  +1.11% |    +4.70% (8.29 pp) |
| throughput/15000/create.sequence        |          1,494.12 (89.62) |          1,588.88 (59.59) |  +6.34% |    +6.34% (2.56 pp) |
| throughput/20000/create.sequence        |          1,626.07 (59.25) |          1,700.6 (190.79) |  +4.58% |    +1.61% (5.41 pp) |
| throughput/25000/create.sequence        |         1,553.77 (116.86) |          1,626.92 (41.23) |  +4.71% |    +4.85% (2.65 pp) |
| throughput/100/insert.head              |            539.66 (29.67) |                503.7 (34) |  -6.66% |    -5.06% (3.44 pp) |
| throughput/1000/insert.head             |            555.89 (17.27) |            544.29 (32.23) |  -2.09% |    -3.96% (2.83 pp) |
| throughput/5000/insert.head             |            574.57 (15.67) |            532.88 (24.44) |  -7.26% |    -7.02% (4.16 pp) |
| throughput/10000/insert.head            |            549.53 (42.96) |            560.32 (18.93) |  +1.96% |     +1.08% (3.8 pp) |
| throughput/15000/insert.head            |           477.78 (111.96) |            501.21 (16.79) |  +4.90% |    +5.44% (6.67 pp) |
| throughput/20000/insert.head            |             512.85 (16.3) |            522.97 (64.55) |  +1.97% |    -4.63% (9.39 pp) |
| throughput/25000/insert.head            |            487.08 (20.21) |            483.72 (44.23) |  -0.69% |    +3.28% (6.54 pp) |
| throughput/100/insert.middle            |            599.88 (73.35) |             612.3 (37.73) |  +2.07% |    -1.83% (5.75 pp) |
| throughput/1000/insert.middle           |           711.76 (105.87) |             622.3 (29.07) | -12.57% |   -12.57% (8.75 pp) |
| throughput/5000/insert.middle           |            623.88 (16.85) |            652.01 (37.16) |  +4.51% |    +2.01% (7.67 pp) |
| throughput/10000/insert.middle          |            667.08 (34.63) |            624.9 (136.56) |  -6.32% |   -2.00% (26.53 pp) |
| throughput/15000/insert.middle          |           677.12 (110.98) |            656.48 (75.38) |  -3.05% |    -3.05% (34.4 pp) |
| throughput/20000/insert.middle          |             660.77 (83.2) |            630.84 (10.05) |  -4.53% |   -2.19% (11.62 pp) |
| throughput/25000/insert.middle          |             598.03 (35.7) |            592.19 (25.53) |  -0.98% |    -1.26% (8.71 pp) |
| throughput/100/insert.random            |             877.51 (25.2) |            871.24 (11.37) |  -0.71% |    -2.13% (5.47 pp) |
| throughput/1000/insert.random           |           919.76 (145.35) |            911.45 (57.31) |  -0.90% |   +2.23% (12.48 pp) |
| throughput/5000/insert.random           |            976.45 (44.62) |            970.47 (68.15) |  -0.61% |    +4.08% (8.59 pp) |
| throughput/10000/insert.random          |           919.75 (136.19) |         1,004.54 (139.04) |  +9.22% |   +12.82% (7.22 pp) |
| throughput/15000/insert.random          |             957.87 (50.3) |            946.98 (107.9) |  -1.14% |    +1.66% (5.01 pp) |
| throughput/20000/insert.random          |            875.98 (21.91) |            883.28 (71.28) |  +0.83% |     +1.13% (8.2 pp) |
| throughput/25000/insert.random          |            835.4 (132.09) |            823.22 (53.55) |  -1.46% |   -1.46% (14.59 pp) |
| throughput/100/insert.sameIndex         |            563.18 (50.29) |            539.47 (61.85) |  -4.21% |   -1.80% (15.88 pp) |
| throughput/1000/insert.sameIndex        |            610.65 (97.97) |            571.62 (58.74) |  -6.39% |   -1.11% (14.59 pp) |
| throughput/5000/insert.sameIndex        |            605.86 (79.42) |            612.51 (53.71) |  +1.10% |    +4.88% (8.34 pp) |
| throughput/10000/insert.sameIndex       |            605.92 (10.18) |            568.47 (20.28) |  -6.18% |   -9.61% (10.47 pp) |
| throughput/15000/insert.sameIndex       |            526.69 (27.66) |            607.35 (46.92) | +15.31% |  +15.31% (17.17 pp) |
| throughput/20000/insert.sameIndex       |              563.4 (3.34) |             583.29 (48.4) |  +3.53% |   +3.28% (12.58 pp) |
| throughput/25000/insert.sameIndex       |            536.24 (20.13) |            566.39 (25.85) |  +5.62% |   +4.46% (16.75 pp) |
| throughput/100/insert.tail              |            860.63 (59.21) |            847.65 (24.49) |  -1.51% |    -0.27% (4.71 pp) |
| throughput/1000/insert.tail             |           881.28 (102.56) |           846.53 (118.07) |  -3.94% |    -0.22% (6.94 pp) |
| throughput/5000/insert.tail             |         1,080.94 (152.29) |            978.28 (27.58) |  -9.50% |    -9.50% (6.34 pp) |
| throughput/10000/insert.tail            |         1,003.97 (130.79) |           900.69 (132.28) | -10.29% |   -10.29% (5.26 pp) |
| throughput/15000/insert.tail            |           892.17 (287.87) |           846.68 (107.19) |  -5.10% |    +3.96% (31.6 pp) |
| throughput/20000/insert.tail            |            876.18 (65.48) |           838.01 (138.72) |  -4.36% |    -1.39% (8.29 pp) |
| throughput/25000/insert.tail            |            868.21 (77.06) |            883.12 (92.41) |  +1.72% |   +6.67% (12.04 pp) |
| throughput/100/length                   |             127.39 (6.01) |            115.02 (11.91) |  -9.71% |      -9.70% (27 pp) |
| throughput/1000/length                  |             108.79 (8.03) |             110.88 (2.65) |  +1.92% |    -0.77% (3.35 pp) |
| throughput/5000/length                  |             114.34 (6.91) |             119.35 (7.35) |  +4.38% |    +0.88% (9.11 pp) |
| throughput/10000/length                 |            115.38 (13.09) |             125.49 (13.2) |  +8.76% |   +3.20% (17.14 pp) |
| throughput/15000/length                 |            126.29 (26.12) |             114.97 (6.56) |  -8.96% |    -3.08% (9.54 pp) |
| throughput/20000/length                 |             111.58 (2.57) |             107.28 (9.34) |  -3.85% |    -5.88% (7.38 pp) |
| throughput/25000/length                 |             103.31 (2.42) |             103.96 (6.23) |  +0.63% |   +1.12% (10.84 pp) |
| throughput/100/merge.duplicate          |            797.27 (23.65) |            795.61 (55.58) |  -0.21% |   +2.88% (11.13 pp) |
| throughput/1000/merge.duplicate         |            661.94 (32.86) |            644.52 (25.52) |  -2.63% |    -3.31% (7.35 pp) |
| throughput/5000/merge.duplicate         |            643.88 (36.18) |              666.45 (148) |  +3.51% |   +1.09% (19.23 pp) |
| throughput/10000/merge.duplicate        |             634.13 (29.6) |            625.89 (65.54) |  -1.30% |   -0.28% (12.98 pp) |
| throughput/15000/merge.duplicate        |           634.54 (122.21) |            624.81 (52.14) |  -1.53% |   +3.47% (27.36 pp) |
| throughput/20000/merge.duplicate        |            620.13 (68.85) |            583.97 (11.31) |  -5.83% |    -2.30% (9.69 pp) |
| throughput/25000/merge.duplicate        |            613.89 (44.35) |            605.02 (27.29) |  -1.44% |    -2.67% (4.94 pp) |
| throughput/100/merge.insert             |          1,880.6 (134.33) |         1,740.41 (154.37) |  -7.45% |    -2.22% (8.19 pp) |
| throughput/1000/merge.insert            |         1,669.69 (236.67) |          1,595.02 (151.5) |  -4.47% |   +3.31% (10.33 pp) |
| throughput/5000/merge.insert            |          1,571.65 (81.28) |          1,618.76 (60.78) |  +3.00% |    +2.97% (5.49 pp) |
| throughput/10000/merge.insert           |         1,652.03 (652.64) |         1,763.82 (445.84) |  +6.77% |   +2.29% (19.66 pp) |
| throughput/15000/merge.insert           |          1,548.52 (99.16) |          1,569.19 (89.68) |  +1.33% |    -1.96% (6.59 pp) |
| throughput/20000/merge.insert           |           1,529.75 (98.8) |          1,588.81 (55.45) |  +3.86% |   +3.86% (10.71 pp) |
| throughput/25000/merge.insert           |          1,308.01 (53.82) |          1,410.26 (19.98) |  +7.82% |   +6.55% (12.33 pp) |
| throughput/100/remove.head              |            751.47 (61.85) |             765.72 (50.8) |  +1.90% |    +1.90% (5.19 pp) |
| throughput/1000/remove.head             |            785.75 (17.65) |            792.29 (81.47) |  +0.83% |   -0.78% (16.96 pp) |
| throughput/5000/remove.head             |            844.01 (56.44) |            839.93 (55.57) |  -0.48% |    -3.93% (1.92 pp) |
| throughput/10000/remove.head            |           914.01 (304.41) |              925.8 (91.8) |  +1.29% |   -7.98% (21.32 pp) |
| throughput/15000/remove.head            |            895.41 (47.72) |            911.17 (86.86) |  +1.76% |   -0.28% (19.36 pp) |
| throughput/20000/remove.head            |            924.16 (24.76) |            952.48 (64.34) |  +3.06% |   +3.96% (17.17 pp) |
| throughput/25000/remove.head            |           933.03 (130.68) |           1,005.04 (51.6) |  +7.72% |    +8.49% (7.66 pp) |
| throughput/100/remove.middle            |             742.66 (18.3) |            821.11 (81.59) | +10.56% |   +6.57% (10.77 pp) |
| throughput/1000/remove.middle           |             809.62 (68.8) |            889.65 (60.42) |  +9.88% |   +14.34% (17.1 pp) |
| throughput/5000/remove.middle           |            880.89 (11.66) |            874.59 (58.33) |  -0.72% |    +1.69% (9.38 pp) |
| throughput/10000/remove.middle          |           968.92 (234.84) |            883.77 (94.51) |  -8.79% |   -5.71% (11.92 pp) |
| throughput/15000/remove.middle          |            856.57 (93.35) |            889.32 (74.32) |  +3.82% |    -0.09% (4.06 pp) |
| throughput/20000/remove.middle          |          1,063.07 (64.72) |            988.24 (81.99) |  -7.04% |    -4.51% (3.43 pp) |
| throughput/25000/remove.middle          |           900.89 (108.03) |           879.63 (163.46) |  -2.36% |    -0.58% (5.77 pp) |
| throughput/100/remove.random            |            951.03 (32.05) |          1,025.39 (56.76) |  +7.82% |    +6.24% (6.09 pp) |
| throughput/1000/remove.random           |          1,215.69 (72.26) |          1,221.22 (80.55) |  +0.45% |    +2.75% (9.52 pp) |
| throughput/5000/remove.random           |          1,277.17 (60.01) |           1,232.82 (57.3) |  -3.47% |    -0.67% (5.16 pp) |
| throughput/10000/remove.random          |         1,201.94 (365.96) |          1,317.16 (70.79) |  +9.59% |   +3.95% (10.13 pp) |
| throughput/15000/remove.random          |          1,381.19 (58.06) |          1,315.21 (52.55) |  -4.78% |    -3.49% (2.37 pp) |
| throughput/20000/remove.random          |           1,464.5 (211.4) |          1,457.32 (111.5) |  -0.49% |  +13.12% (24.21 pp) |
| throughput/25000/remove.random          |         1,263.77 (148.34) |          1,306.61 (110.3) |  +3.39% |    +5.78% (8.41 pp) |
| throughput/100/remove.sameIndex         |            909.13 (71.76) |           987.77 (429.87) |  +8.65% |   +4.35% (21.68 pp) |
| throughput/1000/remove.sameIndex        |            797.24 (32.95) |           853.67 (145.11) |  +7.08% |    +3.38% (21.9 pp) |
| throughput/5000/remove.sameIndex        |           870.89 (103.77) |            901.25 (30.49) |  +3.49% |   +4.29% (14.27 pp) |
| throughput/10000/remove.sameIndex       |           884.33 (158.12) |            906.65 (18.38) |  +2.52% |    +2.52% (5.24 pp) |
| throughput/15000/remove.sameIndex       |             910.9 (78.72) |            984.69 (56.14) |  +8.10% |   +3.59% (23.92 pp) |
| throughput/20000/remove.sameIndex       |            925.78 (102.3) |          1,072.94 (70.89) | +15.90% |   +9.44% (23.08 pp) |
| throughput/25000/remove.sameIndex       |            943.04 (63.65) |         1,076.41 (268.27) | +14.14% |   +2.34% (24.01 pp) |
| throughput/100/remove.tail              |            709.95 (24.21) |           738.91 (103.71) |  +4.08% |     +3.38% (6.2 pp) |
| throughput/1000/remove.tail             |           753.09 (106.82) |            754.11 (13.98) |  +0.14% |   +0.14% (11.42 pp) |
| throughput/5000/remove.tail             |           784.93 (118.71) |            723.72 (37.26) |  -7.80% |  -10.55% (11.67 pp) |
| throughput/10000/remove.tail            |           833.21 (167.78) |            785.14 (30.29) |  -5.77% |    -4.98% (7.95 pp) |
| throughput/15000/remove.tail            |            808.77 (76.53) |            751.03 (30.99) |  -7.14% |    -5.58% (2.79 pp) |
| throughput/20000/remove.tail            |           876.44 (186.06) |            918.33 (32.08) |  +4.78% |      +2.56% (19 pp) |
| throughput/25000/remove.tail            |            894.57 (20.32) |              884.28 (120) |  -1.15% |    +0.38% (3.03 pp) |
| throughput/100/replace.head             |          1,060.15 (28.52) |           1,063.97 (78.5) |  +0.36% |     +0.70% (8.9 pp) |
| throughput/1000/replace.head            |          1,195.66 (58.37) |          1,201.17 (85.38) |  +0.46% |   +0.20% (12.36 pp) |
| throughput/5000/replace.head            |          1,233.37 (55.63) |           1,130.2 (35.41) |  -8.36% |   -6.70% (10.65 pp) |
| throughput/10000/replace.head           |         1,184.45 (143.68) |          1,214.42 (83.77) |  +2.53% |    +1.92% (8.29 pp) |
| throughput/15000/replace.head           |          1,179.19 (72.62) |          1,160.46 (121.2) |  -1.59% |    +2.33% (7.82 pp) |
| throughput/20000/replace.head           |         1,218.43 (129.88) |         1,252.05 (102.08) |  +2.76% |   +8.06% (24.25 pp) |
| throughput/25000/replace.head           |          1,163.11 (28.89) |         1,398.24 (136.38) | +20.22% |  +20.41% (21.66 pp) |
| throughput/100/replace.middle           |          1,132.39 (291.5) |         1,144.96 (139.53) |  +1.11% |    -5.99% (8.98 pp) |
| throughput/1000/replace.middle          |         1,285.81 (101.41) |          1,270.49 (98.37) |  -1.19% |    -3.76% (3.73 pp) |
| throughput/5000/replace.middle          |         1,278.06 (178.03) |         1,334.43 (135.36) |  +4.41% |   +10.63% (15.5 pp) |
| throughput/10000/replace.middle         |         1,264.39 (148.11) |          1,286.82 (78.79) |  +1.77% |   +6.00% (13.74 pp) |
| throughput/15000/replace.middle         |          1,354.67 (41.87) |          1,198.45 (24.02) | -11.53% |   -11.65% (6.62 pp) |
| throughput/20000/replace.middle         |          1,300.44 (70.93) |          1,266.27 (116.8) |  -2.63% |     +0.98% (6.4 pp) |
| throughput/25000/replace.middle         |          1,257.63 (114.1) |          1,305.15 (45.19) |  +3.78% |    +0.07% (1.23 pp) |
| throughput/100/replace.random           |         1,662.23 (308.56) |          1,657.67 (139.6) |  -0.27% |    -0.89% (9.48 pp) |
| throughput/1000/replace.random          |           1,852.4 (40.24) |          1,843.34 (97.93) |  -0.49% |    +2.01% (3.14 pp) |
| throughput/5000/replace.random          |          1,729.92 (549.2) |         2,006.72 (423.26) | +16.00% |   +2.69% (20.59 pp) |
| throughput/10000/replace.random         |         1,854.24 (336.58) |          1,795.37 (86.83) |  -3.17% |   +4.80% (13.25 pp) |
| throughput/15000/replace.random         |          1,888.74 (55.69) |          1,790.24 (95.74) |  -5.22% |    -3.32% (6.31 pp) |
| throughput/20000/replace.random         |           1,740.9 (42.06) |         1,822.59 (314.93) |  +4.69% |    +7.17% (18.2 pp) |
| throughput/25000/replace.random         |          1,749.15 (63.66) |         1,912.91 (217.66) |  +9.36% |   +4.65% (14.56 pp) |
| throughput/100/replace.sameIndex        |            992.82 (83.56) |          1,076.22 (58.82) |  +8.40% |    +0.73% (3.79 pp) |
| throughput/1000/replace.sameIndex       |          1,207.61 (18.22) |          1,170.45 (64.45) |  -3.08% |    -2.02% (4.91 pp) |
| throughput/5000/replace.sameIndex       |         1,204.36 (180.01) |         1,379.93 (429.08) | +14.58% |   +5.96% (45.59 pp) |
| throughput/10000/replace.sameIndex      |         1,243.17 (278.84) |         1,253.78 (452.71) |  +0.85% |  +12.25% (17.68 pp) |
| throughput/15000/replace.sameIndex      |          1,149.22 (42.54) |           1,215.7 (78.91) |  +5.78% |    +4.07% (11.1 pp) |
| throughput/20000/replace.sameIndex      |          1,196.52 (38.08) |          1,286.58 (55.81) |  +7.53% |   +3.00% (11.85 pp) |
| throughput/25000/replace.sameIndex      |          1,256.57 (37.69) |          1,204.65 (60.22) |  -4.13% |    -5.13% (3.99 pp) |
| throughput/100/replace.tail             |           1,051.7 (110.7) |          1,074.06 (57.24) |  +2.13% |    +0.25% (2.94 pp) |
| throughput/1000/replace.tail            |           1,226.25 (63.3) |          1,200.18 (92.96) |  -2.13% |     +0.06% (6.1 pp) |
| throughput/5000/replace.tail            |         1,169.53 (151.26) |         1,251.69 (199.32) |  +7.03% |   +7.51% (16.16 pp) |
| throughput/10000/replace.tail           |          1,194.22 (76.53) |          1,227.09 (36.27) |  +2.75% |    +4.63% (7.88 pp) |
| throughput/15000/replace.tail           |          1,288.69 (100.1) |          1,209.36 (68.53) |  -6.16% |   -5.07% (11.56 pp) |
| throughput/20000/replace.tail           |           1,256.16 (58.9) |          1,328.35 (44.68) |  +5.75% |    +5.75% (9.03 pp) |
| throughput/25000/replace.tail           |          1,295.66 (93.87) |           1,325.18 (26.4) |  +2.28% |    +1.21% (1.64 pp) |
| throughput/100/retire                   |            176.19 (66.35) |            167.43 (38.03) |  -4.97% |    -3.35% (6.84 pp) |
| throughput/1000/retire                  |            221.41 (32.79) |              211.7 (7.94) |  -4.39% |   -3.79% (12.06 pp) |
| throughput/5000/retire                  |             208.09 (7.78) |            242.77 (22.54) | +16.67% |  +16.67% (15.19 pp) |
| throughput/10000/retire                 |             205.98 (1.67) |            199.75 (14.43) |  -3.02% |   -3.41% (10.81 pp) |
| throughput/15000/retire                 |            208.42 (26.18) |             193.1 (25.33) |  -7.35% |   -9.54% (17.72 pp) |
| throughput/20000/retire                 |             193.49 (8.55) |             194.23 (5.94) |  +0.38% |    -2.06% (9.16 pp) |
| throughput/25000/retire                 |            190.29 (22.62) |            189.02 (40.57) |  -0.67% |    +1.03% (7.82 pp) |
| throughput/100/sequence                 |            275.57 (14.61) |             260.86 (4.77) |  -5.34% |    -5.34% (4.37 pp) |
| throughput/1000/sequence                |            297.73 (36.89) |             286.43 (9.08) |  -3.80% |   -3.80% (18.99 pp) |
| throughput/5000/sequence                |           268.98 (114.83) |             285.6 (34.79) |  +6.18% |   +0.90% (39.23 pp) |
| throughput/10000/sequence               |               273 (17.06) |            266.18 (13.35) |  -2.50% |     -1.19% (0.1 pp) |
| throughput/15000/sequence               |             260.3 (15.83) |            246.31 (12.14) |  -5.37% |    -5.47% (6.03 pp) |
| throughput/20000/sequence               |            250.17 (13.42) |             232.81 (5.84) |  -6.94% |    -4.65% (7.26 pp) |
| throughput/25000/sequence               |             247.34 (7.37) |            267.36 (61.71) |  +8.09% |   +8.09% (21.97 pp) |
| throughput/100/value.head               |            180.95 (40.54) |            230.66 (51.56) | +27.47% |  +12.31% (39.94 pp) |
| throughput/1000/value.head              |            172.04 (11.46) |             159.25 (3.92) |  -7.43% |   -10.89% (5.58 pp) |
| throughput/5000/value.head              |            159.64 (16.04) |            180.61 (23.29) | +13.14% |  +29.38% (44.14 pp) |
| throughput/10000/value.head             |             152.49 (3.68) |            173.36 (46.56) | +13.69% |  +13.69% (25.83 pp) |
| throughput/15000/value.head             |             154.07 (7.38) |            140.44 (24.76) |  -8.85% |   -2.70% (15.05 pp) |
| throughput/20000/value.head             |            137.89 (15.28) |             134.51 (6.93) |  -2.45% |    -3.64% (7.95 pp) |
| throughput/25000/value.head             |            139.27 (15.79) |            146.22 (13.36) |  +4.99% |   +6.30% (13.37 pp) |
| throughput/100/value.middle             |            252.04 (26.77) |            238.08 (25.89) |  -5.54% |    -3.44% (5.84 pp) |
| throughput/1000/value.middle            |            264.07 (21.78) |             253.22 (6.84) |  -4.11% |    -3.26% (4.95 pp) |
| throughput/5000/value.middle            |            246.52 (13.62) |             257.1 (31.11) |  +4.29% |  +10.00% (18.61 pp) |
| throughput/10000/value.middle           |            235.08 (26.92) |            230.26 (14.18) |  -2.05% |    +0.08% (2.53 pp) |
| throughput/15000/value.middle           |            239.49 (38.18) |            220.37 (10.11) |  -7.98% |  -12.94% (15.42 pp) |
| throughput/20000/value.middle           |            222.14 (12.55) |            207.01 (12.37) |  -6.81% |    -8.50% (7.71 pp) |
| throughput/25000/value.middle           |             201.68 (5.88) |            231.01 (20.68) | +14.54% |   +7.79% (11.93 pp) |
| throughput/100/value.random             |            220.84 (24.23) |             204.07 (42.9) |  -7.59% |    -3.85% (9.45 pp) |
| throughput/1000/value.random            |            225.93 (33.83) |             219.2 (10.03) |  -2.98% |   -0.80% (16.44 pp) |
| throughput/5000/value.random            |            275.63 (16.14) |             311.05 (6.63) | +12.85% |   +19.15% (8.39 pp) |
| throughput/10000/value.random           |            291.25 (16.29) |            284.51 (26.28) |  -2.31% |     +3.70% (8.1 pp) |
| throughput/15000/value.random           |            297.05 (15.97) |              273.42 (8.6) |  -7.95% |  -12.97% (17.91 pp) |
| throughput/20000/value.random           |            283.12 (15.52) |            294.49 (15.25) |  +4.02% |    +6.34% (8.67 pp) |
| throughput/25000/value.random           |            283.85 (28.96) |             278.49 (59.1) |  -1.89% |   -2.52% (10.61 pp) |
| throughput/100/value.sameIndex          |            190.36 (36.91) |               172.52 (22) |  -9.37% |   -6.72% (22.77 pp) |
| throughput/1000/value.sameIndex         |              187.7 (20.9) |             182.81 (9.73) |  -2.61% |   -5.94% (14.37 pp) |
| throughput/5000/value.sameIndex         |            189.55 (79.53) |             182.97 (4.62) |  -3.47% |   -6.98% (12.49 pp) |
| throughput/10000/value.sameIndex        |             171.03 (9.39) |            194.11 (57.75) | +13.49% |   +13.14% (8.14 pp) |
| throughput/15000/value.sameIndex        |            170.08 (56.71) |            170.87 (75.56) |  +0.46% |  +10.01% (76.87 pp) |
| throughput/20000/value.sameIndex        |             166.23 (8.89) |            163.16 (12.55) |  -1.85% |     +3.29% (6.7 pp) |
| throughput/25000/value.sameIndex        |             163.26 (1.25) |            212.47 (42.67) | +30.14% |  +30.14% (28.71 pp) |
| throughput/100/value.tail               |             230.98 (9.04) |            232.07 (39.89) |  +0.47% |    -7.28% (8.27 pp) |
| throughput/1000/value.tail              |             223.6 (36.53) |            207.57 (16.03) |  -7.17% |   -4.57% (15.25 pp) |
| throughput/5000/value.tail              |             217.12 (5.32) |             203.37 (5.64) |  -6.33% |    -6.33% (3.71 pp) |
| throughput/10000/value.tail             |            201.34 (17.59) |            198.33 (27.83) |  -1.49% |    -6.90% (8.72 pp) |
| throughput/15000/value.tail             |            181.28 (43.92) |             189.7 (12.98) |  +4.64% |   +1.14% (22.55 pp) |
| throughput/20000/value.tail             |            184.28 (17.98) |               183.2 (9.2) |  -0.59% |     -5.81% (2.9 pp) |
| throughput/25000/value.tail             |             179.97 (0.89) |            208.97 (31.25) | +16.11% |  +16.11% (16.79 pp) |
| throughput/100/values                   |         4,759.42 (211.93) |         4,642.93 (265.84) |  -2.45% |   -2.59% (10.21 pp) |
| throughput/1000/values                  |     174,880.9 (22,642.92) |     168,807.34 (11,655.1) |  -3.47% |   -1.62% (14.46 pp) |
| throughput/5000/values                  |    623,036.98 (19,910.94) |   553,793.23 (139,876.04) | -11.11% |   -3.48% (25.54 pp) |
| throughput/10000/values                 |    1,288,889.84 (129,125) |  1,187,426.56 (15,041.41) |  -7.87% |   -8.08% (12.57 pp) |
| throughput/15000/values                 | 1,859,206.25 (192,351.56) | 2,099,135.94 (239,667.19) | +12.90% |   +8.06% (14.37 pp) |
| throughput/20000/values                 | 2,476,853.13 (124,754.69) | 3,186,196.88 (694,382.81) | +28.64% |  +29.29% (29.39 pp) |
| throughput/25000/values                 |  3,616,159.38 (77,029.69) | 3,636,790.63 (712,357.81) |  +0.57% |   -0.37% (21.31 pp) |
| throughput/100/values.head              |            302.19 (34.98) |            325.16 (50.09) |  +7.60% |   +8.04% (25.74 pp) |
| throughput/1000/values.head             |           330.33 (131.61) |            270.31 (13.84) | -18.17% |  -18.17% (23.25 pp) |
| throughput/5000/values.head             |            273.48 (28.64) |             271.7 (11.63) |  -0.65% |    +1.37% (9.64 pp) |
| throughput/10000/values.head            |            297.78 (26.95) |            284.39 (15.08) |  -4.50% |   -3.50% (12.36 pp) |
| throughput/15000/values.head            |             297.3 (41.05) |            299.57 (19.29) |  +0.76% |   +3.88% (10.17 pp) |
| throughput/20000/values.head            |            260.63 (54.91) |            279.16 (19.77) |  +7.11% |   +0.31% (20.46 pp) |
| throughput/25000/values.head            |            250.25 (20.32) |            274.95 (109.3) |  +9.87% |  +17.25% (35.61 pp) |
| throughput/100/values.middle            |            308.76 (74.81) |            300.37 (76.11) |  -2.72% |    -8.77% (7.92 pp) |
| throughput/1000/values.middle           |            274.33 (25.88) |            264.31 (25.63) |  -3.65% |    +0.84% (5.16 pp) |
| throughput/5000/values.middle           |             256.1 (92.07) |            259.92 (54.31) |  +1.49% |     -5.31% (9.6 pp) |
| throughput/10000/values.middle          |            263.65 (44.71) |           279.98 (137.11) |  +6.19% |  +11.77% (30.78 pp) |
| throughput/15000/values.middle          |            289.63 (50.43) |            240.82 (22.71) | -16.85% |   +0.53% (26.48 pp) |
| throughput/20000/values.middle          |            266.33 (26.55) |            265.64 (26.89) |  -0.26% |   +2.01% (14.86 pp) |
| throughput/25000/values.middle          |            248.37 (52.65) |            273.17 (62.37) |  +9.99% |   -4.38% (32.46 pp) |
| throughput/100/values.random            |            313.55 (18.01) |            289.74 (38.93) |  -7.59% |   -3.91% (12.43 pp) |
| throughput/1000/values.random           |            299.94 (54.49) |            308.22 (13.89) |  +2.76% |   +2.76% (10.57 pp) |
| throughput/5000/values.random           |            317.87 (17.37) |            373.56 (15.74) | +17.52% |   +12.82% (7.88 pp) |
| throughput/10000/values.random          |            394.76 (61.44) |            351.36 (94.04) | -10.99% |   -13.11% (38.7 pp) |
| throughput/15000/values.random          |            466.05 (77.76) |            427.55 (56.17) |  -8.26% |     -6.43% (6.1 pp) |
| throughput/20000/values.random          |            422.27 (48.33) |            384.31 (18.98) |  -8.99% |   -5.52% (18.28 pp) |
| throughput/25000/values.random          |             383.9 (48.51) |            401.76 (41.59) |  +4.65% |    -3.37% (15.3 pp) |
| throughput/100/values.sameIndex         |            285.84 (29.57) |             286.62 (7.99) |  +0.27% |    -4.67% (9.02 pp) |
| throughput/1000/values.sameIndex        |            295.42 (15.27) |            266.51 (11.39) |  -9.79% |    -9.95% (3.36 pp) |
| throughput/5000/values.sameIndex        |            249.71 (58.62) |            267.39 (57.71) |  +7.08% |     +7.17% (3.3 pp) |
| throughput/10000/values.sameIndex       |            286.14 (13.84) |            284.09 (39.98) |  -0.72% |   -0.28% (11.72 pp) |
| throughput/15000/values.sameIndex       |            256.17 (20.08) |             247.8 (14.46) |  -3.27% |    -2.08% (8.57 pp) |
| throughput/20000/values.sameIndex       |             270.5 (52.81) |               262.03 (31) |  -3.13% |     -6.67% (4.9 pp) |
| throughput/25000/values.sameIndex       |               263.76 (19) |            251.76 (22.09) |  -4.55% |    -3.62% (4.76 pp) |
| throughput/100/values.tail              |            290.08 (16.47) |            277.69 (36.29) |  -4.27% |    -4.27% (3.84 pp) |
| throughput/1000/values.tail             |            289.37 (35.84) |            275.35 (12.44) |  -4.85% |   +5.31% (20.51 pp) |
| throughput/5000/values.tail             |            274.63 (24.04) |             269.37 (22.3) |  -1.92% |   -3.17% (15.19 pp) |
| throughput/10000/values.tail            |            250.59 (33.21) |            270.18 (40.81) |  +7.82% |   +7.86% (16.61 pp) |
| throughput/15000/values.tail            |             235.62 (17.4) |            242.45 (13.76) |  +2.90% |   +1.79% (15.95 pp) |
| throughput/20000/values.tail            |            232.09 (25.46) |            261.34 (30.34) | +12.60% |  +11.58% (13.08 pp) |
| throughput/25000/values.tail            |             245.11 (40.2) |            241.57 (34.53) |  -1.44% |   -2.51% (23.86 pp) |
| lifecycle/scaleUp/apply.random          |         3,780.42 (118.68) |          3,796.01 (83.99) |  +0.41% |     -0.43% (7.8 pp) |
| lifecycle/scaleUp/insert.head           |            812.65 (56.74) |            867.72 (82.92) |  +6.78% |   -0.12% (11.61 pp) |
| lifecycle/scaleUp/insert.random         |           1,778.08 (68.6) |          1,826.19 (61.02) |  +2.71% |    +2.71% (6.07 pp) |
| lifecycle/scaleUp/insert.tail           |           754.58 (104.68) |           830.38 (105.85) | +10.05% |    -0.25% (2.21 pp) |
| lifecycle/scaleUp/remove.random         |         2,725.99 (101.67) |         2,824.18 (290.94) |  +3.60% |    +1.46% (7.42 pp) |
| lifecycle/scaleUp/replace.head          |            2,446.8 (4.47) |         2,699.64 (250.06) | +10.33% |    +7.07% (6.69 pp) |
| lifecycle/scaleUp/replace.random        |         3,487.79 (244.07) |         4,055.67 (482.59) | +16.28% |    +2.24% (14.5 pp) |
| lifecycle/scaleUp/replace.tail          |         2,334.24 (727.99) |         2,353.41 (136.22) |  +0.82% |      +0.74% (20 pp) |
| lifecycle/scaleUp/value.head            |            307.59 (19.98) |            344.83 (42.14) | +12.11% |  +11.22% (13.42 pp) |
| lifecycle/scaleUp/value.random          |          1,113.53 (43.95) |           1,134.22 (2.26) |  +1.86% |    +2.34% (1.98 pp) |
| lifecycle/scaleUp/value.tail            |             158.72 (9.88) |             158.52 (0.61) |  -0.13% |    -0.40% (1.63 pp) |
| lifecycle/scaleDown/apply.random        |          3,384.7 (170.87) |         3,570.85 (538.96) |  +5.50% |   +5.50% (15.26 pp) |
| lifecycle/scaleDown/insert.random       |         1,723.04 (192.03) |          1,669.42 (59.69) |  -3.11% |    -1.16% (2.27 pp) |
| lifecycle/scaleDown/remove.head         |           1,895.1 (69.46) |          1,910.54 (74.81) |  +0.82% |    +1.47% (4.75 pp) |
| lifecycle/scaleDown/remove.random       |          2,608.51 (63.52) |         2,610.74 (204.11) |  +0.09% |    -1.63% (4.56 pp) |
| lifecycle/scaleDown/remove.tail         |          1,734.08 (71.57) |           1,709.95 (6.45) |  -1.39% |    -2.02% (3.94 pp) |
| lifecycle/scaleDown/replace.head        |         2,589.74 (109.87) |         2,520.61 (142.48) |  -2.67% |    +0.23% (2.69 pp) |
| lifecycle/scaleDown/replace.random      |         3,352.86 (301.31) |         3,243.22 (313.28) |  -3.27% |   -0.35% (18.85 pp) |
| lifecycle/scaleDown/replace.tail        |         19,639.8 (409.65) |        19,526.44 (742.84) |  -0.58% |    -0.52% (3.77 pp) |
| lifecycle/scaleDown/value.head          |            419.66 (25.79) |             427.44 (8.71) |  +1.85% |    -0.07% (3.74 pp) |
| lifecycle/scaleDown/value.random        |          1,055.24 (19.42) |          1,059.88 (11.68) |  +0.44% |    -1.00% (4.87 pp) |
| lifecycle/scaleDown/value.tail          |             233.54 (2.13) |             232.93 (2.51) |  -0.26% |    -0.43% (2.02 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,687.44 (198.19) |         3,683.44 (207.64) |  -0.11% |    +1.88% (3.66 pp) |
| lifecycle/fullLifecycle/insert.head     |            812.65 (56.74) |            867.72 (82.92) |  +6.78% |   -0.12% (11.61 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,740.89 (175.27) |           1,774.51 (66.1) |  +1.93% |    -0.02% (4.89 pp) |
| lifecycle/fullLifecycle/insert.tail     |           754.58 (104.68) |           830.38 (105.85) | +10.05% |    -0.25% (2.21 pp) |
| lifecycle/fullLifecycle/remove.head     |           1,895.1 (69.46) |          1,910.54 (74.81) |  +0.82% |    +1.47% (4.75 pp) |
| lifecycle/fullLifecycle/remove.random   |          2,693.18 (73.02) |          2,760.08 (97.94) |  +2.48% |    +2.48% (8.63 pp) |
| lifecycle/fullLifecycle/remove.tail     |          1,734.08 (71.57) |           1,709.95 (6.45) |  -1.39% |    -2.02% (3.94 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,518.27 (105.81) |          2,749.24 (338.9) |  +9.17% |   +4.88% (20.91 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,462.55 (153.64) |         3,631.45 (128.85) |  +4.88% |    +3.49% (6.92 pp) |
| lifecycle/fullLifecycle/replace.tail    |         11,054.73 (530.8) |        10,971.98 (323.09) |  -0.75% |    -1.26% (5.99 pp) |
| lifecycle/fullLifecycle/value.head      |            366.94 (12.96) |            378.07 (10.41) |  +3.03% |    +4.82% (5.11 pp) |
| lifecycle/fullLifecycle/value.random    |           1,097.7 (30.82) |          1,097.85 (27.82) |  +0.01% |    +1.86% (2.19 pp) |
| lifecycle/fullLifecycle/value.tail      |             195.94 (6.06) |             196.78 (4.13) |  +0.43% |    -1.14% (1.85 pp) |
| checkpoint/up/1000/create               |          264,900 (42,800) |          281,500 (30,800) |  +6.27% |    +2.96% (5.04 pp) |
| checkpoint/up/1000/sequence             |       2,010,300 (264,800) |       2,122,600 (289,400) |  +5.59% |   +8.26% (16.42 pp) |
| checkpoint/up/1000/values               |        1,726,500 (30,900) |       1,907,400 (150,600) | +10.48% |  +10.48% (10.01 pp) |
| checkpoint/up/5000/create               |          860,100 (40,100) |         901,000 (106,300) |  +4.76% |      +4.76% (17 pp) |
| checkpoint/up/5000/sequence             |     9,062,800 (1,094,900) |     8,016,900 (1,177,300) | -11.54% |   -0.70% (13.94 pp) |
| checkpoint/up/5000/values               |     4,583,200 (1,353,800) |       4,630,300 (548,600) |  +1.03% |    -0.11% (9.91 pp) |
| checkpoint/up/10000/create              |        1,554,000 (76,500) |        1,614,700 (60,600) |  +3.91% |    +3.91% (9.26 pp) |
| checkpoint/up/10000/sequence            |      12,848,000 (274,500) |      13,400,300 (475,600) |  +4.30% |    +3.15% (4.96 pp) |
| checkpoint/up/10000/values              |      20,996,100 (935,900) |      21,134,500 (220,300) |  +0.66% |    -0.24% (4.01 pp) |
| checkpoint/up/15000/create              |        2,402,100 (93,500) |       2,378,700 (192,700) |  -0.97% |    -0.97% (4.59 pp) |
| checkpoint/up/15000/sequence            |      14,849,000 (212,800) |      14,815,800 (540,000) |  -0.22% |    -1.10% (3.01 pp) |
| checkpoint/up/15000/values              |      30,283,000 (569,700) |      30,860,100 (279,300) |  +1.91% |    +1.04% (1.85 pp) |
| checkpoint/up/20000/create              |        3,352,500 (38,200) |       3,496,200 (192,100) |  +4.29% |    +4.67% (4.92 pp) |
| checkpoint/up/20000/sequence            |    22,756,700 (1,022,900) |    21,813,700 (3,015,700) |  -4.14% |   -5.74% (18.15 pp) |
| checkpoint/up/20000/values              |      10,905,700 (256,800) |      11,251,100 (778,400) |  +3.17% |    +3.70% (4.58 pp) |
| checkpoint/up/25000/create              |       3,923,500 (259,500) |       4,278,000 (396,100) |  +9.04% |   -0.11% (10.34 pp) |
| checkpoint/up/25000/sequence            |      23,764,400 (287,300) |      23,739,400 (787,600) |  -0.11% |     +1.98% (4.3 pp) |
| checkpoint/up/25000/values              |       11,831,500 (86,700) |      12,000,500 (633,600) |  +1.43% |    +1.41% (3.62 pp) |
| checkpoint/down/20000/create            |       3,376,400 (286,300) |       3,566,500 (124,900) |  +5.63% |    +5.67% (5.22 pp) |
| checkpoint/down/20000/sequence          |    19,741,100 (1,783,000) |      19,987,100 (576,600) |  +1.25% |    +1.95% (5.37 pp) |
| checkpoint/down/20000/values            |       9,876,900 (494,300) |       8,792,800 (487,200) | -10.98% |   -5.33% (10.14 pp) |
| checkpoint/down/15000/create            |        2,399,100 (56,600) |       2,381,800 (101,200) |  -0.72% |    +1.10% (1.96 pp) |
| checkpoint/down/15000/sequence          |    16,642,000 (2,341,700) |    16,301,400 (1,022,100) |  -2.05% |   -7.43% (12.07 pp) |
| checkpoint/down/15000/values            |     7,719,900 (1,456,100) |     7,468,000 (1,447,800) |  -3.26% |   -6.13% (16.35 pp) |
| checkpoint/down/10000/create            |        1,658,700 (67,300) |         1,654,600 (9,100) |  -0.25% |    -0.08% (4.53 pp) |
| checkpoint/down/10000/sequence          |      12,801,000 (300,600) |      13,269,100 (510,600) |  +3.66% |    +0.21% (4.07 pp) |
| checkpoint/down/10000/values            |       5,277,000 (490,100) |     5,853,400 (1,041,000) | +10.92% |  +10.92% (20.98 pp) |
| checkpoint/down/5000/create             |          769,700 (28,400) |           778,200 (8,400) |  +1.10% |    +1.35% (2.47 pp) |
| checkpoint/down/5000/sequence           |      10,047,000 (870,800) |       9,969,500 (298,700) |  -0.77% |     -0.51% (6.3 pp) |
| checkpoint/down/5000/values             |       3,343,800 (470,900) |       2,672,800 (776,500) | -20.07% |  -11.84% (21.07 pp) |
| checkpoint/down/1000/create             |           153,100 (9,700) |          153,000 (21,300) |  -0.07% |   -2.97% (19.35 pp) |
| checkpoint/down/1000/sequence           |       5,602,900 (403,600) |       6,256,900 (240,100) | +11.67% |   +11.19% (3.86 pp) |
| checkpoint/down/1000/values             |          542,700 (25,500) |          600,800 (66,600) | +10.71% |   +10.25% (2.82 pp) |
| checkpoint/down/0/create                |            14,400 (2,400) |            15,200 (4,000) |  +5.56% |    -0.57% (9.18 pp) |
| checkpoint/down/0/sequence              |        1,387,200 (65,400) |       1,434,600 (148,800) |  +3.42% |     +2.57% (3.2 pp) |
| checkpoint/down/0/values                |             9,400 (1,000) |            11,500 (2,300) | +22.34% |   +14.29% (9.54 pp) |
| tuple/projection/2/create.empty         |             350.05 (3.26) |            369.55 (14.07) |  +5.57% |    +8.53% (3.62 pp) |
| tuple/tuple/2/create.empty              |            428.48 (16.02) |             435.61 (8.38) |  +1.66% |    +1.93% (4.07 pp) |
| tuple/projection/2/create.sequence      |          1,200.77 (87.46) |          1,178.28 (78.83) |  -1.87% |    +0.86% (5.29 pp) |
| tuple/tuple/2/create.sequence           |         1,379.17 (143.28) |             1,348 (48.39) |  -2.26% |    -3.43% (3.49 pp) |
| tuple/projection/2/replace.random       |          1,060.56 (24.74) |          1,037.35 (14.32) |  -2.19% |    -2.00% (3.78 pp) |
| tuple/tuple/2/replace.random            |            707.99 (64.73) |            680.36 (74.29) |  -3.90% |    -3.90% (16.3 pp) |
| tuple/projection/2/apply.replace        |         1,818.35 (217.79) |         1,771.78 (196.75) |  -2.56% |   +0.47% (12.95 pp) |
| tuple/tuple/2/apply.replace             |         1,171.77 (125.66) |             1,155.23 (66) |  -1.41% |    -4.19% (9.45 pp) |
| tuple/projection/2/apply.duplicate      |             600.2 (18.41) |            598.75 (53.76) |  -0.24% |   +2.23% (12.11 pp) |
| tuple/tuple/2/apply.duplicate           |            618.45 (49.09) |            650.2 (149.74) |  +5.13% |  +13.20% (38.96 pp) |
| tuple/projection/2/merge.duplicate      |            668.46 (59.72) |               720 (53.54) |  +7.71% |    +7.71% (5.63 pp) |
| tuple/tuple/2/merge.duplicate           |            623.15 (88.43) |             680.4 (58.33) |  +9.19% |     -0.55% (9.7 pp) |
| tuple/projection/2/length               |               7.86 (0.43) |               7.73 (0.28) |  -1.73% |    -1.73% (9.93 pp) |
| tuple/tuple/2/length                    |               7.45 (0.62) |               7.56 (0.27) |  +1.44% |    +3.65% (5.37 pp) |
| tuple/projection/2/value.random         |               30.74 (2.6) |              32.19 (5.31) |  +4.71% |    +2.06% (3.57 pp) |
| tuple/tuple/2/value.random              |              21.15 (1.92) |              22.79 (3.96) |  +7.77% |    +7.77% (23.1 pp) |
| tuple/projection/2/values               |              84.63 (2.77) |               90.61 (8.5) |  +7.07% |    +6.34% (7.25 pp) |
| tuple/tuple/2/values                    |              88.89 (5.54) |                80 (26.38) | -10.00% |      -0.30% (32 pp) |
| tuple/projection/2/sequence             |             424.3 (11.21) |            509.79 (49.38) | +20.15% |  +12.26% (14.38 pp) |
| tuple/tuple/2/sequence                  |             484.6 (38.86) |            480.98 (52.62) |  -0.75% |   +11.61% (20.2 pp) |
| tuple/projection/4/create.empty         |            411.57 (37.29) |            422.52 (82.12) |  +2.66% |   +5.36% (34.29 pp) |
| tuple/tuple/4/create.empty              |            468.06 (33.85) |            443.77 (73.62) |  -5.19% |   +3.75% (16.06 pp) |
| tuple/projection/4/create.sequence      |          1,616.99 (73.84) |         1,746.89 (214.58) |  +8.03% |   +11.07% (7.47 pp) |
| tuple/tuple/4/create.sequence           |         1,593.49 (107.85) |          1,647.83 (84.92) |  +3.41% |   +3.41% (15.34 pp) |
| tuple/projection/4/replace.random       |          1,129.61 (28.31) |         1,221.39 (131.89) |  +8.13% |   +11.38% (6.18 pp) |
| tuple/tuple/4/replace.random            |            620.85 (36.72) |            647.73 (53.61) |  +4.33% |   +5.69% (13.22 pp) |
| tuple/projection/4/apply.replace        |          1,706.65 (44.85) |          1,695.73 (37.52) |  -0.64% |     -0.64% (6.9 pp) |
| tuple/tuple/4/apply.replace             |           1,034.2 (22.26) |         1,051.11 (115.35) |  +1.63% |   +3.04% (14.57 pp) |
| tuple/projection/4/apply.duplicate      |           557.74 (110.35) |             546.94 (2.65) |  -1.94% |   -1.94% (17.32 pp) |
| tuple/tuple/4/apply.duplicate           |            593.35 (31.77) |            580.98 (29.16) |  -2.08% |   -2.97% (15.24 pp) |
| tuple/projection/4/merge.duplicate      |            711.46 (38.98) |            736.14 (11.59) |  +3.47% |    +4.63% (9.32 pp) |
| tuple/tuple/4/merge.duplicate           |            759.26 (38.22) |            774.66 (25.82) |  +2.03% |    +0.14% (2.78 pp) |
| tuple/projection/4/length               |              28.36 (1.23) |              27.99 (0.51) |  -1.31% |   -1.09% (40.58 pp) |
| tuple/tuple/4/length                    |               26.49 (3.3) |               26.42 (1.1) |  -0.26% |    -0.93% (8.82 pp) |
| tuple/projection/4/value.random         |              44.58 (3.06) |              40.74 (2.53) |  -8.61% |    -3.40% (9.19 pp) |
| tuple/tuple/4/value.random              |              18.56 (1.31) |              18.28 (2.32) |  -1.50% |   -3.57% (10.36 pp) |
| tuple/projection/4/values               |             142.5 (12.65) |            154.18 (21.23) |  +8.19% |  +10.10% (46.11 pp) |
| tuple/tuple/4/values                    |             154.84 (18.3) |            140.51 (20.63) |  -9.25% |   -7.94% (51.48 pp) |
| tuple/projection/4/sequence             |             450.3 (58.23) |             448.6 (16.67) |  -0.38% |    +2.20% (6.06 pp) |
| tuple/tuple/4/sequence                  |             526.91 (9.78) |           539.17 (161.75) |  +2.33% |   +2.78% (31.52 pp) |
| tuple/projection/8/create.empty         |             412.87 (20.3) |            425.88 (28.05) |  +3.15% |    -0.19% (9.08 pp) |
| tuple/tuple/8/create.empty              |             456.43 (57.6) |            441.43 (63.64) |  -3.29% |     +1.53% (5.2 pp) |
| tuple/projection/8/create.sequence      |         2,286.52 (103.34) |         2,483.51 (246.79) |  +8.62% |  +12.05% (19.99 pp) |
| tuple/tuple/8/create.sequence           |         2,030.23 (102.14) |          2,030.4 (255.09) |  +0.01% |   +3.68% (16.97 pp) |
| tuple/projection/8/replace.random       |          1,142.05 (30.76) |            1,230.5 (46.1) |  +7.74% |   +7.48% (11.19 pp) |
| tuple/tuple/8/replace.random            |            625.75 (25.75) |            728.68 (92.88) | +16.45% |  +16.45% (21.48 pp) |
| tuple/projection/8/apply.replace        |          1,705.28 (55.55) |           1,782.65 (61.1) |  +4.54% |    +4.66% (5.77 pp) |
| tuple/tuple/8/apply.replace             |              937.5 (10.7) |            972.46 (34.66) |  +3.73% |     +3.33% (2.5 pp) |
| tuple/projection/8/apply.duplicate      |            567.95 (25.19) |            543.97 (14.78) |  -4.22% |    -1.73% (1.65 pp) |
| tuple/tuple/8/apply.duplicate           |              584.69 (0.9) |            558.92 (19.26) |  -4.41% |    -4.38% (1.62 pp) |
| tuple/projection/8/merge.duplicate      |          1,071.73 (46.92) |          1,022.91 (47.78) |  -4.56% |    +0.52% (9.82 pp) |
| tuple/tuple/8/merge.duplicate           |          1,059.03 (97.34) |          1,115.6 (168.44) |  +5.34% |     -0.40% (6.6 pp) |
| tuple/projection/8/length               |              27.91 (0.31) |              30.32 (3.09) |  +8.63% |   +9.00% (13.41 pp) |
| tuple/tuple/8/length                    |              27.39 (0.74) |              25.95 (2.38) |  -5.27% |   -6.80% (14.72 pp) |
| tuple/projection/8/value.random         |               54.53 (3.1) |              55.26 (1.46) |  +1.32% |   +3.73% (10.32 pp) |
| tuple/tuple/8/value.random              |              18.41 (0.85) |               18.7 (2.07) |  +1.55% |    +2.27% (7.65 pp) |
| tuple/projection/8/values               |            234.27 (19.69) |               224 (15.53) |  -4.38% |    -0.13% (8.56 pp) |
| tuple/tuple/8/values                    |             206.68 (7.64) |             204.75 (7.46) |  -0.93% |    -0.93% (3.67 pp) |
| tuple/projection/8/sequence             |              620.52 (6.8) |            610.44 (16.48) |  -1.63% |    -2.05% (1.35 pp) |
| tuple/tuple/8/sequence                  |            660.25 (28.03) |            682.06 (11.59) |  +3.30% |    +2.76% (1.35 pp) |
| tuple/projection/100/create.empty       |             432.59 (23.2) |            446.23 (17.57) |  +3.15% |    +5.87% (4.92 pp) |
| tuple/tuple/100/create.empty            |             480.29 (0.58) |            461.35 (12.19) |  -3.94% |    -2.84% (4.66 pp) |
| tuple/projection/100/create.sequence    |        13,950.93 (413.53) |        14,016.07 (383.12) |  +0.47% |    -1.12% (5.65 pp) |
| tuple/tuple/100/create.sequence         |         10,218.38 (427.5) |      11,868.08 (1,024.37) | +16.14% |  +16.14% (15.04 pp) |
| tuple/projection/100/replace.random     |          1,196.19 (10.07) |          1,239.04 (40.49) |  +3.58% |    +0.23% (8.84 pp) |
| tuple/tuple/100/replace.random          |             621.44 (45.7) |             644.24 (9.12) |  +3.67% |     -1.06% (8.7 pp) |
| tuple/projection/100/apply.replace      |           1,696.58 (51.2) |          1,755.17 (86.94) |  +3.45% |     +2.39% (2.6 pp) |
| tuple/tuple/100/apply.replace           |            963.98 (29.34) |             975.4 (10.45) |  +1.18% |    +1.14% (4.18 pp) |
| tuple/projection/100/apply.duplicate    |            559.27 (33.64) |            585.73 (29.23) |  +4.73% |    +6.44% (9.17 pp) |
| tuple/tuple/100/apply.duplicate         |            581.47 (17.09) |             570.37 (54.2) |  -1.91% |    +0.77% (6.83 pp) |
| tuple/projection/100/merge.duplicate    |          8,844.15 (294.3) |          8,630.3 (245.23) |  -2.42% |    -2.77% (4.21 pp) |
| tuple/tuple/100/merge.duplicate         |        12,649.24 (679.44) |        13,550.73 (817.77) |  +7.13% |    +3.70% (4.34 pp) |
| tuple/projection/100/length             |              27.85 (2.13) |              27.53 (0.35) |  -1.16% |   -1.38% (10.47 pp) |
| tuple/tuple/100/length                  |              28.55 (1.92) |              25.84 (2.88) |  -9.48% |  -13.90% (11.42 pp) |
| tuple/projection/100/value.random       |              79.04 (1.74) |              80.84 (6.31) |  +2.27% |   -1.57% (14.38 pp) |
| tuple/tuple/100/value.random            |              18.53 (0.25) |              18.67 (0.27) |  +0.77% |    +0.76% (5.66 pp) |
| tuple/projection/100/values             |          1,886.48 (28.92) |           1,978.38 (50.1) |  +4.87% |    +5.74% (3.86 pp) |
| tuple/tuple/100/values                  |          1,551.57 (31.61) |          1,535.91 (54.21) |  -1.01% |    +0.11% (3.88 pp) |
| tuple/projection/100/sequence           |         6,382.65 (822.56) |         6,116.64 (343.39) |  -4.17% |    -4.17% (3.03 pp) |
| tuple/tuple/100/sequence                |          5,718.4 (799.15) |         5,523.85 (148.11) |  -3.40% |   -1.13% (14.31 pp) |

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
