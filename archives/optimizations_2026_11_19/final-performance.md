# Final complete public API comparison

5 complete matched runs per build. Before: baseline; candidate: text-context. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 67 timing medians improve over 5%; 75 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 5%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            749.34 (103.7) |            828.68 (41.34) | +10.59% |  +12.23% (29.96 pp) |
| throughput/1000/apply.duplicate         |            775.39 (61.04) |            821.59 (26.02) |  +5.96% |    +8.50% (11.8 pp) |
| throughput/5000/apply.duplicate         |               375 (12.29) |            363.71 (12.17) |  -3.01% |     -1.53% (3.4 pp) |
| throughput/10000/apply.duplicate        |             336.52 (40.9) |               336.47 (36) |  -0.01% |    +1.72% (9.26 pp) |
| throughput/15000/apply.duplicate        |            331.76 (10.33) |            326.71 (32.09) |  -1.52% |   -0.31% (19.25 pp) |
| throughput/20000/apply.duplicate        |            330.35 (24.47) |             319.66 (1.73) |  -3.24% |   -3.40% (11.46 pp) |
| throughput/25000/apply.duplicate        |            320.35 (41.44) |               351.18 (48) |  +9.62% |   +17.01% (8.74 pp) |
| throughput/100/apply.duplicateRemove    |         1,328.04 (170.95) |          1,352.12 (73.43) |  +1.81% |   -2.21% (17.17 pp) |
| throughput/1000/apply.duplicateRemove   |               804.23 (26) |             891.42 (35.6) | +10.84% |  +12.48% (10.66 pp) |
| throughput/5000/apply.duplicateRemove   |            755.49 (29.39) |             785.09 (42.2) |  +3.92% |    +3.92% (6.26 pp) |
| throughput/10000/apply.duplicateRemove  |            726.87 (54.52) |            757.55 (71.47) |  +4.22% |     +1.89% (9.3 pp) |
| throughput/15000/apply.duplicateRemove  |            647.47 (82.03) |            723.06 (15.06) | +11.67% |   +2.74% (14.45 pp) |
| throughput/20000/apply.duplicateRemove  |           706.99 (131.32) |            677.67 (42.85) |  -4.15% |   -2.43% (23.71 pp) |
| throughput/25000/apply.duplicateRemove  |             634.63 (5.57) |           748.01 (125.34) | +17.87% |  +10.94% (20.76 pp) |
| throughput/100/apply.duplicateReplace   |          1,439.39 (19.78) |            959.61 (92.94) | -33.33% |   -34.06% (7.48 pp) |
| throughput/1000/apply.duplicateReplace  |          1,091.45 (54.96) |         1,150.11 (165.14) |  +5.37% |   +1.34% (14.08 pp) |
| throughput/5000/apply.duplicateReplace  |            878.47 (13.51) |            980.03 (30.73) | +11.56% |    +11.26% (6.6 pp) |
| throughput/10000/apply.duplicateReplace |            867.05 (84.35) |           985.18 (109.45) | +13.62% |  +14.94% (28.25 pp) |
| throughput/15000/apply.duplicateReplace |               829.58 (75) |               830.85 (87) |  +0.15% |    +0.58% (8.86 pp) |
| throughput/20000/apply.duplicateReplace |            793.14 (69.54) |            796.26 (74.38) |  +0.39% |   +1.42% (16.47 pp) |
| throughput/25000/apply.duplicateReplace |           853.43 (107.61) |            939.81 (62.78) | +10.12% |  +10.12% (12.57 pp) |
| throughput/100/apply.insert             |         2,108.79 (336.56) |         1,732.58 (120.41) | -17.84% |  -19.71% (11.01 pp) |
| throughput/1000/apply.insert            |         1,445.95 (119.53) |         1,481.65 (138.94) |  +2.47% |    +1.61% (4.27 pp) |
| throughput/5000/apply.insert            |          1,327.38 (28.86) |          1,346.28 (42.67) |  +1.42% |    +3.07% (5.75 pp) |
| throughput/10000/apply.insert           |         1,400.82 (189.52) |          1,328.48 (76.11) |  -5.16% |    +6.70% (8.56 pp) |
| throughput/15000/apply.insert           |          1,367.83 (39.62) |         1,441.15 (222.18) |  +5.36% |   +6.16% (13.88 pp) |
| throughput/20000/apply.insert           |         1,193.92 (131.05) |          1,212.97 (94.09) |  +1.60% |    +0.14% (8.29 pp) |
| throughput/25000/apply.insert           |          1,284.36 (50.07) |         1,327.15 (114.19) |  +3.33% |    -0.50% (4.91 pp) |
| throughput/100/apply.remove             |         1,725.15 (332.55) |         1,894.87 (568.91) |  +9.84% |   +7.89% (31.88 pp) |
| throughput/1000/apply.remove            |         1,556.41 (126.48) |          1,525.27 (37.86) |  -2.00% |   -1.59% (15.11 pp) |
| throughput/5000/apply.remove            |          1,436.04 (82.53) |          1,539.32 (34.62) |  +7.19% |   +7.69% (10.75 pp) |
| throughput/10000/apply.remove           |          1,539.54 (77.48) |         1,509.62 (182.34) |  -1.94% |   +0.83% (10.81 pp) |
| throughput/15000/apply.remove           |           1,575.2 (63.35) |          1,610.96 (33.75) |  +2.27% |    +2.18% (4.33 pp) |
| throughput/20000/apply.remove           |         1,508.55 (142.33) |         1,560.93 (219.56) |  +3.47% |    -1.71% (6.38 pp) |
| throughput/25000/apply.remove           |          1,454.48 (93.91) |         1,756.21 (216.22) | +20.74% |   +22.55% (6.62 pp) |
| throughput/100/apply.replace            |          2,589.53 (71.75) |           2,617.22 (78.3) |  +1.07% |    +3.73% (6.89 pp) |
| throughput/1000/apply.replace           |         2,761.84 (248.79) |         2,823.25 (106.47) |  +2.22% |    +6.02% (7.74 pp) |
| throughput/5000/apply.replace           |          2,735.53 (62.53) |         2,796.86 (108.11) |  +2.24% |    +3.08% (5.92 pp) |
| throughput/10000/apply.replace          |         2,646.19 (133.77) |          2,677.29 (60.11) |  +1.18% |    +0.37% (3.66 pp) |
| throughput/15000/apply.replace          |         2,789.81 (452.92) |         2,883.03 (124.84) |  +3.34% |    -4.50% (9.92 pp) |
| throughput/20000/apply.replace          |          2,774.7 (134.79) |          2,767.54 (67.11) |  -0.26% |    -1.44% (7.06 pp) |
| throughput/25000/apply.replace          |          2,620.75 (53.24) |         3,090.54 (214.53) | +17.93% |  +18.59% (15.45 pp) |
| throughput/100/create.empty             |             555.99 (88.1) |            566.54 (11.81) |  +1.90% |    +1.90% (8.04 pp) |
| throughput/1000/create.empty            |           721.54 (174.81) |            736.09 (28.53) |  +2.02% |  +19.55% (30.24 pp) |
| throughput/5000/create.empty            |           770.44 (111.78) |            791.65 (30.38) |  +2.75% |   +4.12% (16.02 pp) |
| throughput/10000/create.empty           |            741.87 (32.52) |            809.35 (58.25) |  +9.10% |   +12.71% (6.77 pp) |
| throughput/15000/create.empty           |           828.21 (125.21) |            799.78 (37.41) |  -3.43% |   +0.32% (20.81 pp) |
| throughput/20000/create.empty           |            707.81 (69.59) |             722.2 (37.91) |  +2.03% |    -0.95% (5.75 pp) |
| throughput/25000/create.empty           |           777.58 (103.55) |            739.69 (66.82) |  -4.87% |   +1.15% (17.41 pp) |
| throughput/100/create.sequence          |          1,584.78 (84.78) |          1,559.45 (25.46) |  -1.60% |    -1.60% (8.23 pp) |
| throughput/1000/create.sequence         |         1,976.65 (298.61) |          1,940.65 (98.31) |  -1.82% |   +3.35% (17.65 pp) |
| throughput/5000/create.sequence         |         1,759.72 (236.89) |         1,559.31 (462.82) | -11.39% |    -9.60% (35.4 pp) |
| throughput/10000/create.sequence        |         1,779.08 (130.99) |          1,753.69 (258.8) |  -1.43% |     -1.06% (3.5 pp) |
| throughput/15000/create.sequence        |           1,551.53 (63.6) |          1,499.63 (70.07) |  -3.35% |    -4.55% (5.86 pp) |
| throughput/20000/create.sequence        |         1,537.41 (295.04) |         1,638.48 (156.87) |  +6.57% |    +0.65% (13.5 pp) |
| throughput/25000/create.sequence        |         1,522.44 (158.11) |         1,536.44 (313.52) |  +0.92% |   +2.48% (12.48 pp) |
| throughput/100/insert.head              |            540.58 (20.73) |             562.6 (45.35) |  +4.07% |   +3.45% (11.03 pp) |
| throughput/1000/insert.head             |            566.74 (55.24) |              572.79 (4.9) |  +1.07% |   +0.26% (11.74 pp) |
| throughput/5000/insert.head             |            555.51 (33.16) |            548.48 (43.35) |  -1.27% |    -4.07% (8.22 pp) |
| throughput/10000/insert.head            |            519.89 (47.24) |            577.61 (43.39) | +11.10% |  +11.87% (19.83 pp) |
| throughput/15000/insert.head            |            562.07 (78.03) |            505.57 (85.02) | -10.05% |   +0.04% (10.51 pp) |
| throughput/20000/insert.head            |            556.94 (51.37) |             523.8 (59.07) |  -5.95% |    -5.67% (2.43 pp) |
| throughput/25000/insert.head            |            498.33 (39.71) |            477.88 (52.34) |  -4.10% |   -0.68% (11.81 pp) |
| throughput/100/insert.middle            |               666 (50.47) |            625.57 (24.83) |  -6.07% |   +0.61% (20.06 pp) |
| throughput/1000/insert.middle           |             625.5 (37.48) |             702.83 (70.6) | +12.36% |   +12.36% (4.84 pp) |
| throughput/5000/insert.middle           |            653.86 (12.02) |             641.37 (49.9) |  -1.91% |    +4.50% (7.53 pp) |
| throughput/10000/insert.middle          |             690.4 (28.45) |             610.6 (51.47) | -11.56% |   -11.73% (8.27 pp) |
| throughput/15000/insert.middle          |            650.66 (57.05) |            612.34 (18.32) |  -5.89% |    -4.55% (8.53 pp) |
| throughput/20000/insert.middle          |            610.59 (38.03) |            625.73 (58.27) |  +2.48% |   +10.38% (15.1 pp) |
| throughput/25000/insert.middle          |            594.63 (42.66) |            572.26 (54.86) |  -3.76% |    +2.19% (7.09 pp) |
| throughput/100/insert.random            |            906.94 (85.63) |         1,008.48 (113.98) | +11.20% |   -1.76% (22.73 pp) |
| throughput/1000/insert.random           |            925.24 (45.27) |            983.87 (78.48) |  +6.34% |    +6.00% (7.18 pp) |
| throughput/5000/insert.random           |            944.78 (24.01) |             962.34 (6.54) |  +1.86% |    +2.34% (0.73 pp) |
| throughput/10000/insert.random          |             885.63 (41.6) |            951.31 (78.62) |  +7.42% |  +12.79% (15.05 pp) |
| throughput/15000/insert.random          |           881.35 (198.47) |            896.55 (39.68) |  +1.72% |   -1.84% (16.96 pp) |
| throughput/20000/insert.random          |            885.78 (17.82) |            888.07 (40.92) |  +0.26% |    +3.64% (6.61 pp) |
| throughput/25000/insert.random          |            911.97 (64.21) |            884.38 (47.87) |  -3.03% |   -1.61% (10.88 pp) |
| throughput/100/insert.sameIndex         |            565.46 (26.59) |            626.02 (93.76) | +10.71% |  +12.62% (24.13 pp) |
| throughput/1000/insert.sameIndex        |            567.04 (23.17) |                591.92 (5) |  +4.39% |    +7.75% (5.35 pp) |
| throughput/5000/insert.sameIndex        |            592.95 (97.65) |            599.37 (22.92) |  +1.08% |    +0.06% (12.7 pp) |
| throughput/10000/insert.sameIndex       |              578.4 (49.8) |            599.07 (64.79) |  +3.57% |    -2.57% (13.4 pp) |
| throughput/15000/insert.sameIndex       |           661.43 (184.56) |           568.43 (232.75) | -14.06% |   +2.52% (80.65 pp) |
| throughput/20000/insert.sameIndex       |            563.33 (52.96) |              555.5 (47.3) |  -1.39% |    -4.10% (7.81 pp) |
| throughput/25000/insert.sameIndex       |            514.89 (18.86) |            544.29 (64.39) |  +5.71% |   +9.70% (10.74 pp) |
| throughput/100/insert.tail              |            880.99 (80.84) |           887.01 (164.05) |  +0.68% |  +11.31% (19.46 pp) |
| throughput/1000/insert.tail             |            841.75 (101.5) |           877.44 (242.84) |  +4.24% |    +4.24% (7.75 pp) |
| throughput/5000/insert.tail             |             901.1 (36.54) |          1,009.47 (139.5) | +12.03% |     +8.66% (7.8 pp) |
| throughput/10000/insert.tail            |           921.69 (191.64) |           937.26 (195.09) |  +1.69% |    +9.52% (5.24 pp) |
| throughput/15000/insert.tail            |            916.13 (198.4) |           911.58 (111.44) |  -0.50% |   +8.81% (11.17 pp) |
| throughput/20000/insert.tail            |            862.5 (123.04) |               895.16 (32) |  +3.79% |   -6.53% (15.51 pp) |
| throughput/25000/insert.tail            |           999.29 (227.46) |            865.12 (200.3) | -13.43% |  -13.43% (38.12 pp) |
| throughput/100/length                   |             124.53 (15.6) |             131.03 (6.13) |  +5.22% |   +4.10% (22.09 pp) |
| throughput/1000/length                  |             113.52 (5.56) |             113.68 (8.42) |  +0.14% |   -2.51% (14.23 pp) |
| throughput/5000/length                  |             117.25 (1.97) |                113 (6.89) |  -3.62% |   -5.01% (10.22 pp) |
| throughput/10000/length                 |             116.39 (6.69) |            123.07 (44.13) |  +5.74% |  +10.00% (31.88 pp) |
| throughput/15000/length                 |             105.34 (8.98) |             122.15 (9.08) | +15.96% |   +1.28% (25.04 pp) |
| throughput/20000/length                 |             105.59 (5.76) |             107.41 (1.73) |  +1.72% |    +2.71% (4.56 pp) |
| throughput/25000/length                 |             107.25 (8.32) |             102.89 (6.17) |  -4.07% |    -4.07% (5.81 pp) |
| throughput/100/merge.duplicate          |            810.73 (86.81) |            825.15 (93.06) |  +1.78% |   +0.91% (12.24 pp) |
| throughput/1000/merge.duplicate         |            677.84 (47.11) |            643.63 (29.99) |  -5.05% |   -5.05% (11.48 pp) |
| throughput/5000/merge.duplicate         |             671.7 (23.94) |            632.87 (23.91) |  -5.78% |    -7.00% (8.04 pp) |
| throughput/10000/merge.duplicate        |            642.06 (18.58) |            651.32 (52.04) |  +1.44% |    -1.43% (9.18 pp) |
| throughput/15000/merge.duplicate        |             604.44 (8.47) |            599.61 (50.46) |  -0.80% |    -0.80% (7.16 pp) |
| throughput/20000/merge.duplicate        |             594.17 (7.52) |            589.16 (44.73) |  -0.84% |    -1.23% (4.67 pp) |
| throughput/25000/merge.duplicate        |            589.15 (16.65) |            568.78 (39.95) |  -3.46% |    +0.14% (6.67 pp) |
| throughput/100/merge.insert             |          1,738.96 (64.41) |         1,802.52 (112.09) |  +3.66% |    +1.49% (7.05 pp) |
| throughput/1000/merge.insert            |         1,483.06 (200.34) |           1,628.8 (68.14) |  +9.83% |   -3.63% (26.55 pp) |
| throughput/5000/merge.insert            |         1,572.43 (154.98) |          1,608.05 (44.12) |  +2.27% |    +1.43% (4.59 pp) |
| throughput/10000/merge.insert           |          1,632.79 (94.08) |          1,607.88 (54.22) |  -1.53% |    -0.28% (8.24 pp) |
| throughput/15000/merge.insert           |         1,525.83 (223.17) |           1,459.55 (7.46) |  -4.34% |    -4.53% (0.71 pp) |
| throughput/20000/merge.insert           |         1,596.35 (304.41) |          1,626.48 (67.83) |  +1.89% |   -1.88% (20.16 pp) |
| throughput/25000/merge.insert           |         1,466.43 (154.27) |         1,300.57 (130.51) | -11.31% |   -4.67% (12.61 pp) |
| throughput/100/remove.head              |            735.37 (55.01) |              697 (170.82) |  -5.22% |   -5.73% (36.06 pp) |
| throughput/1000/remove.head             |            797.75 (77.89) |            802.97 (19.01) |  +0.65% |   +2.30% (14.57 pp) |
| throughput/5000/remove.head             |           801.08 (105.85) |            814.53 (44.92) |  +1.68% |     +0.88% (7.7 pp) |
| throughput/10000/remove.head            |             884.8 (53.68) |            914.38 (19.66) |  +3.34% |    +1.02% (6.68 pp) |
| throughput/15000/remove.head            |           933.25 (103.65) |            833.24 (22.05) | -10.72% |  -11.54% (15.41 pp) |
| throughput/20000/remove.head            |            945.03 (35.18) |            944.84 (14.41) |  -0.02% |    +1.16% (7.32 pp) |
| throughput/25000/remove.head            |           988.33 (247.75) |           889.24 (102.44) | -10.03% |   -10.03% (8.27 pp) |
| throughput/100/remove.middle            |           797.59 (143.89) |            771.14 (36.32) |  -3.32% |    -2.88% (1.21 pp) |
| throughput/1000/remove.middle           |            860.16 (79.24) |            829.58 (13.82) |  -3.56% |    -5.63% (15.2 pp) |
| throughput/5000/remove.middle           |            865.71 (37.01) |            830.77 (27.82) |  -4.04% |    -5.26% (7.65 pp) |
| throughput/10000/remove.middle          |            907.06 (16.02) |            870.31 (10.97) |  -4.05% |    -4.00% (4.41 pp) |
| throughput/15000/remove.middle          |            905.96 (12.84) |            902.79 (40.27) |  -0.35% |    -0.35% (5.86 pp) |
| throughput/20000/remove.middle          |            963.77 (20.41) |             935.62 (9.12) |  -2.92% |    -3.04% (8.24 pp) |
| throughput/25000/remove.middle          |          1,006.75 (115.9) |            958.17 (18.82) |  -4.83% |    -6.72% (2.22 pp) |
| throughput/100/remove.random            |         1,099.88 (132.01) |            949.4 (144.89) | -13.68% |   -4.41% (22.75 pp) |
| throughput/1000/remove.random           |          1,215.11 (76.69) |          1,243.17 (36.87) |  +2.31% |    +2.40% (9.92 pp) |
| throughput/5000/remove.random           |         1,199.15 (194.09) |          1,244.86 (77.03) |  +3.81% |   +2.14% (14.57 pp) |
| throughput/10000/remove.random          |          1,206.51 (90.22) |          1,231.19 (81.92) |  +2.05% |   +2.05% (11.72 pp) |
| throughput/15000/remove.random          |           1,238.9 (73.37) |          1,197.91 (24.71) |  -3.31% |    -2.73% (3.18 pp) |
| throughput/20000/remove.random          |          1,252.05 (51.73) |          1,266.41 (53.24) |  +1.15% |    +4.63% (8.95 pp) |
| throughput/25000/remove.random          |         1,426.23 (368.07) |          1,282.39 (18.84) | -10.09% |  -10.09% (20.72 pp) |
| throughput/100/remove.sameIndex         |          1,106.7 (546.62) |           904.27 (181.01) | -18.29% |   -4.11% (46.38 pp) |
| throughput/1000/remove.sameIndex        |            846.42 (16.68) |            833.36 (25.83) |  -1.54% |   -0.67% (15.19 pp) |
| throughput/5000/remove.sameIndex        |             819.81 (33.8) |            898.07 (50.06) |  +9.55% |   +4.97% (12.36 pp) |
| throughput/10000/remove.sameIndex       |            943.57 (30.89) |            862.31 (36.65) |  -8.61% |    -8.26% (6.84 pp) |
| throughput/15000/remove.sameIndex       |            950.74 (35.51) |            923.29 (44.64) |  -2.89% |    +0.61% (2.08 pp) |
| throughput/20000/remove.sameIndex       |           941.12 (169.83) |           993.79 (106.72) |  +5.60% |    +5.60% (5.25 pp) |
| throughput/25000/remove.sameIndex       |           1,095.8 (70.56) |            906.85 (81.96) | -17.24% |   -10.76% (4.89 pp) |
| throughput/100/remove.tail              |            842.18 (89.69) |           721.02 (164.66) | -14.39% |   +4.94% (20.57 pp) |
| throughput/1000/remove.tail             |            719.98 (38.02) |            709.71 (41.64) |  -1.43% |   -1.69% (13.18 pp) |
| throughput/5000/remove.tail             |            763.87 (49.91) |            752.58 (26.41) |  -1.48% |    -3.31% (3.42 pp) |
| throughput/10000/remove.tail            |           827.42 (197.22) |            760.59 (39.98) |  -8.08% |   -7.08% (22.04 pp) |
| throughput/15000/remove.tail            |             768.6 (23.11) |            774.63 (14.95) |  +0.78% |       +2.62% (5 pp) |
| throughput/20000/remove.tail            |            810.61 (66.94) |            851.72 (84.78) |  +5.07% |   +5.07% (11.38 pp) |
| throughput/25000/remove.tail            |           861.88 (142.21) |           868.91 (180.05) |  +0.82% |    -7.88% (9.12 pp) |
| throughput/100/replace.head             |         1,104.45 (115.96) |         1,158.52 (175.15) |  +4.90% |   +5.20% (22.68 pp) |
| throughput/1000/replace.head            |          1,143.75 (44.77) |             1,163 (88.74) |  +1.68% |   -1.45% (13.93 pp) |
| throughput/5000/replace.head            |         1,134.86 (181.99) |          1,171.51 (22.59) |  +3.23% |   +3.23% (13.22 pp) |
| throughput/10000/replace.head           |         1,203.97 (175.77) |           1,203.07 (12.2) |  -0.07% |    -0.84% (8.16 pp) |
| throughput/15000/replace.head           |         1,208.33 (126.04) |         1,155.55 (171.22) |  -4.37% |   +3.50% (11.06 pp) |
| throughput/20000/replace.head           |          1,224.79 (52.56) |          1,370.8 (170.69) | +11.92% |   +8.55% (12.71 pp) |
| throughput/25000/replace.head           |         1,259.39 (142.34) |          1,241.41 (185.4) |  -1.43% |    +7.86% (5.72 pp) |
| throughput/100/replace.middle           |         1,225.97 (170.76) |          1,105.06 (75.87) |  -9.86% |   -3.63% (17.21 pp) |
| throughput/1000/replace.middle          |          1,260.99 (84.76) |          1,237.99 (89.07) |  -1.82% |   +1.53% (10.73 pp) |
| throughput/5000/replace.middle          |           1,280.2 (96.36) |          1,204.65 (12.62) |  -5.90% |    -5.90% (3.99 pp) |
| throughput/10000/replace.middle         |         1,231.99 (228.27) |          1,218.19 (32.12) |  -1.12% |   +1.27% (18.73 pp) |
| throughput/15000/replace.middle         |         1,411.02 (491.45) |         1,202.61 (117.04) | -14.77% |  -14.77% (36.37 pp) |
| throughput/20000/replace.middle         |           1,309.68 (81.8) |          1,319.59 (70.84) |  +0.76% |    -0.27% (12.3 pp) |
| throughput/25000/replace.middle         |         1,244.11 (110.35) |           1,285.7 (61.81) |  +3.34% |   +1.71% (12.16 pp) |
| throughput/100/replace.random           |          1,731.13 (15.97) |          1,645.07 (35.55) |  -4.97% |   -5.39% (13.88 pp) |
| throughput/1000/replace.random          |         1,879.89 (178.73) |         1,875.16 (125.89) |  -0.25% |    +8.41% (6.58 pp) |
| throughput/5000/replace.random          |          1,793.88 (44.47) |          1,801.36 (19.78) |  +0.42% |    -1.36% (2.91 pp) |
| throughput/10000/replace.random         |          1,808.53 (73.85) |          1,892.06 (53.98) |  +4.62% |   -0.42% (12.27 pp) |
| throughput/15000/replace.random         |          1,703.8 (252.92) |          1,764.61 (48.01) |  +3.57% |   +2.34% (15.16 pp) |
| throughput/20000/replace.random         |         1,867.75 (155.22) |         1,865.56 (290.98) |  -0.12% |    -0.47% (8.11 pp) |
| throughput/25000/replace.random         |         1,904.16 (263.76) |          1,764.3 (127.07) |  -7.34% |    -3.44% (7.94 pp) |
| throughput/100/replace.sameIndex        |          1,049.56 (18.64) |          1,026.58 (15.69) |  -2.19% |     -1.80% (8.5 pp) |
| throughput/1000/replace.sameIndex       |          1,138.62 (47.12) |          1,211.86 (19.67) |  +6.43% |    +6.43% (6.18 pp) |
| throughput/5000/replace.sameIndex       |         1,183.98 (131.88) |          1,120.69 (26.59) |  -5.35% |    -5.54% (1.55 pp) |
| throughput/10000/replace.sameIndex      |          1,214.49 (42.11) |          1,203.56 (56.75) |  -0.90% |    -4.98% (8.78 pp) |
| throughput/15000/replace.sameIndex      |          1,199.48 (80.47) |         1,263.55 (120.89) |  +5.34% |   +6.70% (15.76 pp) |
| throughput/20000/replace.sameIndex      |       1,318.26 (1,755.86) |         1,277.95 (144.67) |  -3.06% |   +1.52% (63.51 pp) |
| throughput/25000/replace.sameIndex      |          1,211.05 (22.09) |          1,314.03 (89.52) |  +8.50% |   +9.56% (14.47 pp) |
| throughput/100/replace.tail             |          1,027.25 (40.44) |          1,066.25 (88.42) |  +3.80% |    +2.98% (0.98 pp) |
| throughput/1000/replace.tail            |          1,176.42 (92.86) |          1,293.75 (57.71) |  +9.97% |    +9.92% (3.75 pp) |
| throughput/5000/replace.tail            |          1,200.75 (61.66) |          1,224.12 (62.62) |  +1.95% |    -1.28% (7.21 pp) |
| throughput/10000/replace.tail           |         1,219.01 (103.99) |          1,228.73 (66.18) |  +0.80% |   +4.63% (11.65 pp) |
| throughput/15000/replace.tail           |          1,250.16 (98.76) |         1,200.35 (197.64) |  -3.98% |    -2.51% (6.94 pp) |
| throughput/20000/replace.tail           |          1,263.22 (94.77) |          1,309.07 (91.71) |  +3.63% |    +3.63% (1.79 pp) |
| throughput/25000/replace.tail           |           1,208.43 (27.4) |          1,272.23 (89.55) |  +5.28% |    +2.86% (2.02 pp) |
| throughput/100/retire                   |            176.65 (24.41) |            177.34 (33.22) |  +0.39% |     -1.23% (6.3 pp) |
| throughput/1000/retire                  |            213.31 (13.71) |             212.34 (9.77) |  -0.45% |    +3.88% (2.78 pp) |
| throughput/5000/retire                  |            208.01 (21.51) |             202.26 (0.39) |  -2.76% |    -4.46% (6.64 pp) |
| throughput/10000/retire                 |             206.8 (15.28) |             199.75 (4.52) |  -3.41% |   -7.16% (10.31 pp) |
| throughput/15000/retire                 |            204.06 (10.36) |             193.81 (4.97) |  -5.02% |    -5.43% (3.95 pp) |
| throughput/20000/retire                 |             193.57 (5.67) |             185.39 (8.83) |  -4.23% |     -1.10% (7.2 pp) |
| throughput/25000/retire                 |             200.01 (4.21) |             199.29 (6.31) |  -0.36% |    -0.36% (2.36 pp) |
| throughput/100/sequence                 |            262.31 (11.48) |            300.27 (37.86) | +14.47% |   +5.06% (18.84 pp) |
| throughput/1000/sequence                |            287.37 (13.93) |             286.62 (6.58) |  -0.26% |    -1.69% (3.26 pp) |
| throughput/5000/sequence                |             266.35 (9.75) |             261.69 (7.59) |  -1.75% |    -5.02% (3.86 pp) |
| throughput/10000/sequence               |              261.6 (14.1) |             269.35 (5.78) |  +2.96% |     +2.01% (7.9 pp) |
| throughput/15000/sequence               |            262.28 (14.22) |             245.01 (6.33) |  -6.58% |   -5.47% (11.39 pp) |
| throughput/20000/sequence               |            257.91 (43.25) |            246.07 (17.88) |  -4.59% |   -3.50% (21.12 pp) |
| throughput/25000/sequence               |             246.03 (4.23) |             250.45 (6.62) |  +1.80% |    +2.18% (2.37 pp) |
| throughput/100/value.head               |            167.93 (10.01) |            188.47 (20.81) | +12.23% |   +9.57% (10.85 pp) |
| throughput/1000/value.head              |             165.29 (6.07) |             169.23 (1.39) |  +2.38% |    +2.31% (7.57 pp) |
| throughput/5000/value.head              |             145.6 (15.53) |             150.22 (6.77) |  +3.17% |   +1.00% (12.89 pp) |
| throughput/10000/value.head             |              140.06 (4.9) |              145.4 (2.27) |  +3.81% |    +2.97% (3.19 pp) |
| throughput/15000/value.head             |            137.77 (10.53) |             141.91 (6.24) |  +3.01% |   +3.28% (10.72 pp) |
| throughput/20000/value.head             |            139.37 (12.85) |             142.77 (3.85) |  +2.44% |    +2.53% (4.41 pp) |
| throughput/25000/value.head             |             127.98 (3.59) |             134.36 (9.68) |  +4.99% |    +2.41% (2.96 pp) |
| throughput/100/value.middle             |            250.83 (25.52) |            277.34 (25.22) | +10.57% |    +7.57% (4.15 pp) |
| throughput/1000/value.middle            |            252.08 (17.94) |             256.24 (9.45) |  +1.65% |    +3.82% (2.26 pp) |
| throughput/5000/value.middle            |            229.79 (10.35) |             233.57 (8.27) |  +1.64% |     +1.76% (3.3 pp) |
| throughput/10000/value.middle           |            232.91 (21.44) |              223.63 (9.7) |  -3.98% |   -0.15% (17.05 pp) |
| throughput/15000/value.middle           |             226.18 (3.71) |             221.47 (9.04) |  -2.08% |    -0.69% (3.96 pp) |
| throughput/20000/value.middle           |            212.28 (40.88) |            224.05 (20.81) |  +5.54% |   +9.69% (28.13 pp) |
| throughput/25000/value.middle           |            219.53 (15.31) |            210.04 (15.72) |  -4.32% |    -0.54% (2.05 pp) |
| throughput/100/value.random             |            206.61 (26.87) |            218.84 (28.03) |  +5.92% |   +7.52% (25.84 pp) |
| throughput/1000/value.random            |             229.58 (6.08) |            252.59 (15.07) | +10.02% |  +13.76% (13.36 pp) |
| throughput/5000/value.random            |            297.35 (25.85) |               282 (12.35) |  -5.16% |    +1.51% (4.72 pp) |
| throughput/10000/value.random           |            290.55 (14.27) |            293.83 (32.17) |  +1.13% |    +1.65% (6.75 pp) |
| throughput/15000/value.random           |            271.64 (30.93) |            272.25 (21.85) |  +0.22% |    -3.47% (8.67 pp) |
| throughput/20000/value.random           |            287.53 (51.53) |            270.04 (20.43) |  -6.08% |   -4.69% (27.57 pp) |
| throughput/25000/value.random           |            277.03 (26.31) |            275.98 (26.65) |  -0.38% |    +2.28% (6.14 pp) |
| throughput/100/value.sameIndex          |             198.05 (20.7) |               199.52 (10) |  +0.74% |   -0.62% (24.78 pp) |
| throughput/1000/value.sameIndex         |              184.2 (3.04) |             188.84 (2.63) |  +2.52% |    +2.52% (4.02 pp) |
| throughput/5000/value.sameIndex         |             174.08 (26.9) |            183.26 (40.46) |  +5.27% |  +10.93% (22.98 pp) |
| throughput/10000/value.sameIndex        |              174.9 (4.77) |             175.62 (8.84) |  +0.41% |    +1.48% (4.51 pp) |
| throughput/15000/value.sameIndex        |            159.69 (21.45) |             163.45 (5.27) |  +2.35% |    -0.60% (7.12 pp) |
| throughput/20000/value.sameIndex        |               186.56 (36) |              161.9 (4.58) | -13.22% |  -17.55% (19.25 pp) |
| throughput/25000/value.sameIndex        |             155.81 (8.37) |            175.62 (14.53) | +12.71% |   +11.89% (4.17 pp) |
| throughput/100/value.tail               |             241.15 (7.38) |             241.26 (38.6) |  +0.05% |   -2.33% (25.46 pp) |
| throughput/1000/value.tail              |                217.71 (3) |            218.81 (10.35) |  +0.51% |    +0.66% (5.97 pp) |
| throughput/5000/value.tail              |             200.82 (2.11) |            216.55 (16.09) |  +7.83% |    +4.09% (6.21 pp) |
| throughput/10000/value.tail             |             199.77 (7.43) |            222.98 (66.52) | +11.62% |   +2.02% (33.85 pp) |
| throughput/15000/value.tail             |            205.14 (10.26) |            188.05 (10.04) |  -8.33% |    -5.20% (7.42 pp) |
| throughput/20000/value.tail             |             196.55 (4.48) |             189.13 (5.33) |  -3.78% |    -3.75% (0.76 pp) |
| throughput/25000/value.tail             |            192.42 (22.89) |             182.04 (6.51) |  -5.39% |    -4.57% (3.05 pp) |
| throughput/100/values                   |         4,613.83 (326.43) |          4,715.3 (526.93) |  +2.20% |    +4.05% (3.99 pp) |
| throughput/1000/values                  |     179,570.49 (3,847.92) |      181,488.72 (5,537.5) |  +1.07% |   -0.03% (19.56 pp) |
| throughput/5000/values                  |    610,277.08 (24,563.54) |    601,424.48 (54,236.98) |  -1.45% |   +0.28% (11.03 pp) |
| throughput/10000/values                 | 1,205,954.69 (119,582.03) |  1,289,735.94 (69,274.22) |  +6.95% |   +6.95% (11.84 pp) |
| throughput/15000/values                 | 1,867,398.44 (710,040.63) |  1,853,389.06 (23,331.25) |  -0.75% |   -5.92% (30.14 pp) |
| throughput/20000/values                 | 2,505,126.56 (338,003.13) |   2,552,132.81 (37,737.5) |  +1.88% |   +1.08% (12.14 pp) |
| throughput/25000/values                 |  3,683,271.88 (378,937.5) | 3,617,306.25 (281,979.69) |  -1.79% |   +1.57% (13.71 pp) |
| throughput/100/values.head              |               322.37 (36) |            352.37 (18.41) |  +9.31% |   +17.20% (17.7 pp) |
| throughput/1000/values.head             |            276.08 (16.45) |            291.21 (31.49) |  +5.48% |  +17.11% (17.35 pp) |
| throughput/5000/values.head             |            273.95 (19.98) |            277.33 (26.73) |  +1.23% |     -3.53% (9.7 pp) |
| throughput/10000/values.head            |             290.2 (14.31) |             273.62 (37.8) |  -5.71% |   -5.71% (11.73 pp) |
| throughput/15000/values.head            |            310.49 (39.89) |             285.82 (30.1) |  -7.95% |  -10.04% (21.93 pp) |
| throughput/20000/values.head            |             277.65 (1.42) |            283.18 (12.06) |  +1.99% |    +2.16% (3.13 pp) |
| throughput/25000/values.head            |            284.69 (36.88) |            301.05 (29.66) |  +5.75% |   +1.38% (31.19 pp) |
| throughput/100/values.middle            |            324.65 (47.18) |            324.61 (17.35) |  -0.01% |   -0.01% (28.02 pp) |
| throughput/1000/values.middle           |             288.38 (21.7) |             287.63 (22.8) |  -0.26% |    +0.33% (3.48 pp) |
| throughput/5000/values.middle           |            313.42 (68.99) |             281.5 (42.18) | -10.18% |  -16.42% (21.83 pp) |
| throughput/10000/values.middle          |            315.44 (70.35) |             251.75 (34.7) | -20.19% |  -19.16% (28.59 pp) |
| throughput/15000/values.middle          |            271.73 (34.34) |             250.19 (41.3) |  -7.93% |   -4.36% (21.66 pp) |
| throughput/20000/values.middle          |            235.64 (10.93) |                256.69 (5) |  +8.93% |   +7.92% (15.19 pp) |
| throughput/25000/values.middle          |             235.32 (4.32) |            249.16 (31.03) |  +5.88% |   -4.02% (12.02 pp) |
| throughput/100/values.random            |             313.87 (8.45) |             355.3 (34.58) | +13.20% |    +7.82% (4.03 pp) |
| throughput/1000/values.random           |             323.1 (13.52) |             322.33 (9.12) |  -0.24% |    -0.25% (3.93 pp) |
| throughput/5000/values.random           |           357.58 (235.84) |            360.89 (34.54) |  +0.93% |      -8.43% (28 pp) |
| throughput/10000/values.random          |            381.79 (39.56) |            339.77 (35.83) | -11.01% |    -5.62% (4.59 pp) |
| throughput/15000/values.random          |            436.71 (31.72) |            369.27 (20.41) | -15.44% |   -12.91% (1.02 pp) |
| throughput/20000/values.random          |            394.83 (58.11) |             405.85 (8.24) |  +2.79% |    +1.67% (7.94 pp) |
| throughput/25000/values.random          |            404.92 (19.71) |            398.71 (15.84) |  -1.53% |    -1.34% (6.26 pp) |
| throughput/100/values.sameIndex         |             290.8 (16.44) |            343.36 (52.34) | +18.07% |  +18.07% (24.23 pp) |
| throughput/1000/values.sameIndex        |             279.35 (2.44) |            283.75 (18.54) |  +1.58% |   +6.69% (14.44 pp) |
| throughput/5000/values.sameIndex        |            280.27 (27.25) |           264.06 (166.22) |  -5.78% |   +3.93% (74.48 pp) |
| throughput/10000/values.sameIndex       |            276.63 (31.47) |            265.95 (62.01) |  -3.86% |   +5.41% (17.95 pp) |
| throughput/15000/values.sameIndex       |            256.73 (24.29) |             246.97 (9.73) |  -3.80% |    -6.66% (9.98 pp) |
| throughput/20000/values.sameIndex       |            246.21 (13.85) |            259.88 (42.38) |  +5.55% |   +3.25% (29.93 pp) |
| throughput/25000/values.sameIndex       |             236.81 (15.7) |            255.15 (32.46) |  +7.74% |    +6.90% (6.25 pp) |
| throughput/100/values.tail              |            295.83 (57.78) |            314.09 (30.13) |  +6.17% |   +5.23% (18.88 pp) |
| throughput/1000/values.tail             |            268.87 (11.62) |              275.5 (8.23) |  +2.47% |    +5.56% (3.86 pp) |
| throughput/5000/values.tail             |            284.22 (57.09) |              261.1 (5.33) |  -8.13% |   -8.13% (18.21 pp) |
| throughput/10000/values.tail            |            282.53 (52.52) |            260.93 (29.08) |  -7.65% |   +2.38% (36.88 pp) |
| throughput/15000/values.tail            |            246.76 (16.05) |            252.45 (18.92) |  +2.31% |    +2.33% (4.95 pp) |
| throughput/20000/values.tail            |            274.49 (48.97) |            282.64 (54.68) |  +2.97% |    +0.90% (7.98 pp) |
| throughput/25000/values.tail            |             252.9 (65.33) |            234.65 (11.09) |  -7.22% |  -12.16% (17.62 pp) |
| lifecycle/scaleUp/apply.random          |         3,784.52 (235.71) |          3,727.15 (85.71) |  -1.52% |    -2.22% (4.56 pp) |
| lifecycle/scaleUp/insert.head           |            848.79 (21.26) |            822.79 (71.61) |  -3.06% |    -6.14% (9.64 pp) |
| lifecycle/scaleUp/insert.random         |          1,718.34 (83.94) |          1,823.73 (66.18) |  +6.13% |    +4.78% (6.09 pp) |
| lifecycle/scaleUp/insert.tail           |            832.54 (84.03) |            774.37 (51.13) |  -6.99% |   -0.78% (10.54 pp) |
| lifecycle/scaleUp/remove.random         |         2,702.28 (336.14) |          2,888.7 (256.61) |  +6.90% |   +3.98% (21.61 pp) |
| lifecycle/scaleUp/replace.head          |         2,445.36 (223.67) |         2,509.52 (100.62) |  +2.62% |   +1.63% (14.08 pp) |
| lifecycle/scaleUp/replace.random        |         3,594.29 (121.04) |         3,966.09 (488.98) | +10.34% |   +7.42% (23.23 pp) |
| lifecycle/scaleUp/replace.tail          |         2,336.16 (691.99) |         2,461.83 (383.74) |  +5.38% |   +1.17% (17.72 pp) |
| lifecycle/scaleUp/value.head            |            335.41 (38.07) |              322.6 (6.89) |  -3.82% |   -3.39% (13.87 pp) |
| lifecycle/scaleUp/value.random          |           1,132.9 (17.56) |          1,140.24 (38.08) |  +0.65% |    +2.09% (5.63 pp) |
| lifecycle/scaleUp/value.tail            |             155.06 (8.67) |              159.1 (2.86) |  +2.60% |    +1.29% (5.01 pp) |
| lifecycle/scaleDown/apply.random        |         3,763.64 (406.51) |          3,484.28 (107.4) |  -7.42% |     -5.89% (6.8 pp) |
| lifecycle/scaleDown/insert.random       |          1,688.8 (112.13) |          1,695.27 (47.08) |  +0.38% |    +0.15% (3.66 pp) |
| lifecycle/scaleDown/remove.head         |          2,011.08 (129.7) |          1,909.85 (43.78) |  -5.03% |   -5.03% (10.02 pp) |
| lifecycle/scaleDown/remove.random       |          2,633.57 (148.9) |           2,713.3 (35.86) |  +3.03% |    +3.59% (9.36 pp) |
| lifecycle/scaleDown/remove.tail         |         1,781.39 (133.83) |          1,733.14 (78.94) |  -2.71% |   +1.20% (10.48 pp) |
| lifecycle/scaleDown/replace.head        |         2,613.05 (179.14) |         2,543.46 (124.42) |  -2.66% |    -1.03% (6.24 pp) |
| lifecycle/scaleDown/replace.random      |         3,283.86 (415.75) |         3,433.16 (339.49) |  +4.55% |    +1.45% (2.18 pp) |
| lifecycle/scaleDown/replace.tail        |        19,282.55 (553.39) |        19,603.84 (939.62) |  +1.67% |     -0.91% (6.2 pp) |
| lifecycle/scaleDown/value.head          |               439 (10.61) |            417.44 (20.26) |  -4.91% |    -0.98% (6.42 pp) |
| lifecycle/scaleDown/value.random        |           1,060.01 (31.4) |          1,082.38 (22.76) |  +2.11% |    +0.84% (2.16 pp) |
| lifecycle/scaleDown/value.tail          |            233.88 (10.72) |             234.72 (4.24) |  +0.36% |    -0.59% (7.15 pp) |
| lifecycle/fullLifecycle/apply.random    |          3,815.8 (200.61) |          3,621.89 (82.85) |  -5.08% |    -4.02% (1.45 pp) |
| lifecycle/fullLifecycle/insert.head     |            848.79 (21.26) |            822.79 (71.61) |  -3.06% |    -6.14% (9.64 pp) |
| lifecycle/fullLifecycle/insert.random   |          1,715.91 (38.46) |           1,775.86 (32.8) |  +3.49% |    +3.17% (2.32 pp) |
| lifecycle/fullLifecycle/insert.tail     |            832.54 (84.03) |            774.37 (51.13) |  -6.99% |   -0.78% (10.54 pp) |
| lifecycle/fullLifecycle/remove.head     |          2,011.08 (129.7) |          1,909.85 (43.78) |  -5.03% |   -5.03% (10.02 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,667.92 (256.14) |         2,743.07 (129.96) |  +2.82% |   +3.79% (17.38 pp) |
| lifecycle/fullLifecycle/remove.tail     |         1,781.39 (133.83) |          1,733.14 (78.94) |  -2.71% |   +1.20% (10.48 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,562.04 (279.09) |         2,509.76 (152.22) |  -2.04% |   -2.04% (10.85 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,449.71 (193.13) |         3,842.72 (341.45) | +11.39% |    +5.13% (9.69 pp) |
| lifecycle/fullLifecycle/replace.tail    |         11,268.04 (605.5) |         11,114.9 (882.23) |  -1.36% |    +0.59% (3.42 pp) |
| lifecycle/fullLifecycle/value.head      |            390.73 (24.34) |              377.3 (11.9) |  -3.44% |    -3.60% (8.72 pp) |
| lifecycle/fullLifecycle/value.random    |          1,097.17 (27.18) |          1,124.92 (25.84) |  +2.53% |    +4.31% (3.98 pp) |
| lifecycle/fullLifecycle/value.tail      |             193.64 (9.14) |               196.9 (3.5) |  +1.69% |    +2.70% (6.53 pp) |
| checkpoint/up/1000/create               |          293,700 (30,100) |           266,100 (3,700) |  -9.40% |  -10.39% (11.06 pp) |
| checkpoint/up/1000/sequence             |       2,165,700 (101,400) |       2,067,500 (170,800) |  -4.53% |    -7.39% (5.14 pp) |
| checkpoint/up/1000/values               |        1,749,900 (65,100) |       1,862,300 (217,500) |  +6.42% |  +14.33% (17.44 pp) |
| checkpoint/up/5000/create               |         862,200 (240,000) |          867,200 (39,000) |  +0.58% |   -0.13% (13.71 pp) |
| checkpoint/up/5000/sequence             |     9,029,600 (3,447,300) |        8,023,700 (90,900) | -11.14% |   -4.93% (31.42 pp) |
| checkpoint/up/5000/values               |       4,882,000 (378,200) |       4,930,800 (934,900) |  +1.00% |    -0.88% (8.75 pp) |
| checkpoint/up/10000/create              |       1,592,700 (203,800) |        1,527,700 (72,500) |  -4.08% |   -1.07% (16.19 pp) |
| checkpoint/up/10000/sequence            |      12,980,300 (415,200) |    12,994,500 (1,304,400) |  +0.11% |    +0.05% (7.34 pp) |
| checkpoint/up/10000/values              |      19,772,300 (711,400) |      20,759,000 (366,800) |  +4.99% |    +2.65% (3.99 pp) |
| checkpoint/up/15000/create              |        2,376,500 (25,900) |       2,568,200 (346,100) |  +8.07% |     -0.76% (9.9 pp) |
| checkpoint/up/15000/sequence            |      15,020,100 (798,300) |      14,802,400 (623,700) |  -1.45% |    -0.59% (3.23 pp) |
| checkpoint/up/15000/values              |      30,310,000 (219,100) |      30,519,500 (776,400) |  +0.69% |    +1.08% (3.29 pp) |
| checkpoint/up/20000/create              |       3,581,200 (762,200) |        3,305,000 (40,400) |  -7.71% |   -8.17% (20.11 pp) |
| checkpoint/up/20000/sequence            |    22,961,900 (4,654,100) |      22,224,400 (692,100) |  -3.21% |   -6.14% (27.07 pp) |
| checkpoint/up/20000/values              |    11,618,700 (2,038,800) |      11,210,400 (673,100) |  -3.51% |    -0.16% (22.8 pp) |
| checkpoint/up/25000/create              |       3,949,200 (107,400) |       4,142,800 (340,500) |  +4.90% |    +5.11% (5.64 pp) |
| checkpoint/up/25000/sequence            |    24,131,000 (1,426,400) |    25,764,500 (1,190,200) |  +6.77% |    +7.82% (6.69 pp) |
| checkpoint/up/25000/values              |      12,562,700 (881,500) |    12,522,600 (1,493,600) |  -0.32% |   -1.79% (22.36 pp) |
| checkpoint/down/20000/create            |        3,345,300 (30,700) |        3,378,900 (41,800) |  +1.00% |    +1.78% (1.64 pp) |
| checkpoint/down/20000/sequence          |      18,858,000 (190,100) |      18,905,200 (319,400) |  +0.25% |    +0.82% (3.07 pp) |
| checkpoint/down/20000/values            |       9,403,300 (477,300) |       9,660,500 (574,000) |  +2.74% |    +2.27% (4.18 pp) |
| checkpoint/down/15000/create            |        2,408,900 (18,600) |       2,543,200 (272,100) |  +5.58% |   +6.13% (10.37 pp) |
| checkpoint/down/15000/sequence          |    15,668,800 (1,304,600) |      16,098,000 (253,800) |  +2.74% |     +3.85% (2.4 pp) |
| checkpoint/down/15000/values            |       7,573,900 (680,900) |       7,487,900 (135,700) |  -1.14% |    -4.61% (8.51 pp) |
| checkpoint/down/10000/create            |         1,630,500 (5,400) |        1,646,600 (16,400) |  +0.99% |       +0.40% (3 pp) |
| checkpoint/down/10000/sequence          |      12,810,900 (494,300) |      13,085,900 (265,200) |  +2.15% |     +2.29% (6.5 pp) |
| checkpoint/down/10000/values            |       5,632,700 (376,400) |     5,444,400 (1,220,400) |  -3.34% |   -3.30% (14.83 pp) |
| checkpoint/down/5000/create             |           760,300 (4,600) |          792,900 (37,900) |  +4.29% |     +3.77% (4.3 pp) |
| checkpoint/down/5000/sequence           |       9,317,000 (616,800) |    10,545,400 (1,358,700) | +13.18% |      +13.18% (7 pp) |
| checkpoint/down/5000/values             |       3,222,700 (561,300) |       3,110,200 (845,000) |  -3.49% |   -8.75% (17.97 pp) |
| checkpoint/down/1000/create             |          172,400 (32,000) |          151,600 (29,400) | -12.06% |   -0.07% (13.51 pp) |
| checkpoint/down/1000/sequence           |        5,682,100 (46,500) |     5,603,900 (1,214,500) |  -1.38% |   -1.38% (22.83 pp) |
| checkpoint/down/1000/values             |         575,900 (126,900) |          535,200 (27,600) |  -7.07% |  -10.89% (15.35 pp) |
| checkpoint/down/0/create                |            14,200 (2,000) |                14,700 (0) |  +3.52% |    +3.52% (5.11 pp) |
| checkpoint/down/0/sequence              |       1,475,700 (135,400) |       1,374,000 (142,000) |  -6.89% |    -4.58% (7.37 pp) |
| checkpoint/down/0/values                |            11,800 (1,900) |            10,400 (2,600) | -11.86% |  -11.86% (38.43 pp) |
| tuple/projection/2/create.empty         |             357.58 (8.41) |            368.91 (11.37) |  +3.17% |     +5.41% (6.2 pp) |
| tuple/tuple/2/create.empty              |            445.29 (44.04) |             439.59 (5.08) |  -1.28% |    +1.52% (9.29 pp) |
| tuple/projection/2/create.sequence      |          1,225.96 (61.56) |          1,231.62 (44.35) |  +0.46% |    +0.46% (4.87 pp) |
| tuple/tuple/2/create.sequence           |          1,362.75 (56.01) |          1,392.42 (78.45) |  +2.18% |   -1.32% (11.56 pp) |
| tuple/projection/2/replace.random       |          1,066.19 (50.39) |          1,027.28 (78.86) |  -3.65% |    +0.07% (2.72 pp) |
| tuple/tuple/2/replace.random            |            683.67 (29.25) |            699.37 (83.91) |  +2.30% |   +6.96% (12.59 pp) |
| tuple/projection/2/apply.replace        |         1,702.92 (113.72) |          1,692.84 (67.63) |  -0.59% |    -0.59% (9.91 pp) |
| tuple/tuple/2/apply.replace             |           1,141.03 (32.4) |          1,134.9 (565.75) |  -0.54% |   +0.73% (47.45 pp) |
| tuple/projection/2/apply.duplicate      |            578.11 (78.91) |           674.85 (147.13) | +16.74% |    +4.92% (3.56 pp) |
| tuple/tuple/2/apply.duplicate           |            606.42 (39.05) |            621.5 (107.02) |  +2.49% |   +2.90% (10.61 pp) |
| tuple/projection/2/merge.duplicate      |            670.46 (30.26) |             672.8 (77.05) |  +0.35% |  +10.10% (17.75 pp) |
| tuple/tuple/2/merge.duplicate           |            640.48 (43.22) |            664.46 (28.31) |  +3.74% |   +7.21% (16.91 pp) |
| tuple/projection/2/length               |                 7.7 (0.1) |               7.81 (0.15) |  +1.34% |     +1.34% (3.7 pp) |
| tuple/tuple/2/length                    |               7.76 (0.12) |               7.35 (0.22) |  -5.32% |    -2.95% (4.02 pp) |
| tuple/projection/2/value.random         |              31.97 (1.22) |              33.41 (2.94) |  +4.49% |   +9.79% (17.64 pp) |
| tuple/tuple/2/value.random              |              19.85 (1.44) |              19.44 (1.15) |  -2.10% |    -6.70% (8.13 pp) |
| tuple/projection/2/values               |              82.85 (4.86) |              79.58 (4.94) |  -3.95% |    -3.70% (6.05 pp) |
| tuple/tuple/2/values                    |                87.5 (2.5) |              83.9 (56.87) |  -4.11% |   -2.88% (66.08 pp) |
| tuple/projection/2/sequence             |            436.48 (19.14) |             434.4 (79.86) |  -0.48% |   -0.10% (22.04 pp) |
| tuple/tuple/2/sequence                  |            485.44 (10.95) |             497.24 (56.4) |  +2.43% |   -0.33% (11.24 pp) |
| tuple/projection/4/create.empty         |            422.36 (18.01) |             469.5 (26.46) | +11.16% |   +10.85% (9.84 pp) |
| tuple/tuple/4/create.empty              |             446.1 (33.56) |             468.82 (15.4) |  +5.09% |    +3.54% (6.91 pp) |
| tuple/projection/4/create.sequence      |           1,616.88 (94.1) |           1,629.48 (55.6) |  +0.78% |    -1.01% (6.53 pp) |
| tuple/tuple/4/create.sequence           |         1,543.81 (106.38) |          1,570.24 (73.14) |  +1.71% |    -1.94% (8.74 pp) |
| tuple/projection/4/replace.random       |            1,143 (112.79) |          1,147.01 (99.03) |  +0.35% |   -2.05% (13.82 pp) |
| tuple/tuple/4/replace.random            |            614.75 (14.71) |           656.76 (133.24) |  +6.83% |  +11.37% (17.93 pp) |
| tuple/projection/4/apply.replace        |          1,656.84 (42.14) |         1,684.91 (139.87) |  +1.69% |   +2.74% (11.79 pp) |
| tuple/tuple/4/apply.replace             |            1,042.9 (5.78) |          1,064.43 (154.8) |  +2.06% |   +2.06% (22.18 pp) |
| tuple/projection/4/apply.duplicate      |            577.85 (15.39) |            595.49 (76.28) |  +3.05% |   +3.05% (20.04 pp) |
| tuple/tuple/4/apply.duplicate           |            583.31 (10.07) |           611.08 (153.09) |  +4.76% |   +1.30% (34.89 pp) |
| tuple/projection/4/merge.duplicate      |            749.29 (34.37) |            758.36 (10.85) |  +1.21% |    +4.39% (4.22 pp) |
| tuple/tuple/4/merge.duplicate           |            751.47 (64.31) |            786.09 (59.12) |  +4.61% |    +6.83% (5.41 pp) |
| tuple/projection/4/length               |              30.16 (4.66) |             28.09 (19.82) |  -6.86% |  -18.66% (65.44 pp) |
| tuple/tuple/4/length                    |              29.38 (0.46) |             25.99 (19.29) | -11.55% |  -10.64% (70.56 pp) |
| tuple/projection/4/value.random         |              42.57 (2.19) |              42.79 (4.35) |  +0.53% |   +1.13% (15.74 pp) |
| tuple/tuple/4/value.random              |               18.33 (0.2) |              18.88 (0.99) |  +2.99% |    +1.94% (7.59 pp) |
| tuple/projection/4/values               |             155.47 (3.56) |             145.41 (3.92) |  -6.47% |    -6.14% (7.53 pp) |
| tuple/tuple/4/values                    |             147.76 (3.94) |            146.27 (39.46) |  -1.01% |   -6.26% (24.11 pp) |
| tuple/projection/4/sequence             |            455.67 (14.12) |            458.47 (27.16) |  +0.62% |    +4.64% (2.86 pp) |
| tuple/tuple/4/sequence                  |            538.47 (10.31) |            524.17 (16.65) |  -2.66% |    -2.66% (2.31 pp) |
| tuple/projection/8/create.empty         |            426.67 (13.57) |              416.3 (9.18) |  -2.43% |    -5.09% (6.22 pp) |
| tuple/tuple/8/create.empty              |            451.82 (25.98) |            468.12 (28.63) |  +3.61% |    +4.64% (2.74 pp) |
| tuple/projection/8/create.sequence      |          2,166.83 (38.26) |         2,243.02 (146.41) |  +3.52% |    +2.64% (2.25 pp) |
| tuple/tuple/8/create.sequence           |          1,861.89 (78.74) |          2,045.78 (85.57) |  +9.88% |     +8.99% (3.7 pp) |
| tuple/projection/8/replace.random       |          1,198.14 (16.02) |          1,170.37 (31.55) |  -2.32% |    -2.11% (3.69 pp) |
| tuple/tuple/8/replace.random            |            647.04 (26.02) |            648.61 (22.93) |  +0.24% |    -0.38% (3.32 pp) |
| tuple/projection/8/apply.replace        |          1,770.24 (84.29) |          1,724.39 (17.73) |  -2.59% |    -3.56% (4.66 pp) |
| tuple/tuple/8/apply.replace             |            984.82 (64.63) |          1,073.37 (66.28) |  +8.99% |   +7.52% (14.68 pp) |
| tuple/projection/8/apply.duplicate      |            577.67 (80.34) |             587.5 (97.32) |  +1.70% |    -0.10% (6.54 pp) |
| tuple/tuple/8/apply.duplicate           |            599.81 (75.93) |           606.44 (128.15) |  +1.11% |   -0.40% (17.02 pp) |
| tuple/projection/8/merge.duplicate      |          1,094.75 (23.94) |          1,069.84 (26.41) |  -2.28% |    -2.59% (1.71 pp) |
| tuple/tuple/8/merge.duplicate           |           1,064.3 (33.52) |          1,079.67 (37.23) |  +1.44% |    -1.48% (5.51 pp) |
| tuple/projection/8/length               |              27.34 (0.99) |              29.01 (4.87) |  +6.11% |     +3.15% (7.2 pp) |
| tuple/tuple/8/length                    |              27.61 (1.89) |              26.97 (3.74) |  -2.33% |    +0.96% (3.61 pp) |
| tuple/projection/8/value.random         |               55.64 (9.3) |              52.04 (6.04) |  -6.47% |    -6.47% (7.65 pp) |
| tuple/tuple/8/value.random              |              18.26 (1.95) |              17.75 (1.77) |  -2.77% |    -0.62% (2.81 pp) |
| tuple/projection/8/values               |            229.47 (19.56) |             238.2 (18.78) |  +3.80% |   +0.36% (10.14 pp) |
| tuple/tuple/8/values                    |            212.96 (17.18) |             216.63 (6.65) |  +1.72% |    -2.86% (5.13 pp) |
| tuple/projection/8/sequence             |            630.78 (21.76) |             616.76 (4.36) |  -2.22% |    -2.51% (4.11 pp) |
| tuple/tuple/8/sequence                  |             682.89 (31.9) |            683.46 (11.14) |  +0.08% |    -0.43% (5.23 pp) |
| tuple/projection/100/create.empty       |            471.35 (10.02) |            441.73 (15.01) |  -6.28% |    -4.39% (6.34 pp) |
| tuple/tuple/100/create.empty            |            473.26 (63.19) |             459.99 (1.49) |  -2.80% |   -5.55% (11.08 pp) |
| tuple/projection/100/create.sequence    |       14,377.9 (3,233.58) |        13,772.36 (467.93) |  -4.21% |   -6.28% (21.82 pp) |
| tuple/tuple/100/create.sequence         |      10,229.53 (2,994.92) |        11,756.77 (638.39) | +14.93% |  +17.67% (28.67 pp) |
| tuple/projection/100/replace.random     |         1,192.15 (275.73) |           1,246.5 (31.48) |  +4.56% |   -1.41% (16.91 pp) |
| tuple/tuple/100/replace.random          |           639.84 (123.15) |            654.61 (29.15) |  +2.31% |    +2.31% (2.81 pp) |
| tuple/projection/100/apply.replace      |         1,891.96 (103.06) |          1,787.28 (76.88) |  -5.53% |    -7.25% (10.7 pp) |
| tuple/tuple/100/apply.replace           |          1,043.04 (57.09) |             986.06 (18.7) |  -5.46% |    -3.49% (6.84 pp) |
| tuple/projection/100/apply.duplicate    |            619.69 (33.57) |            556.41 (20.65) | -10.21% |   -13.52% (6.21 pp) |
| tuple/tuple/100/apply.duplicate         |            604.96 (52.41) |             559.06 (31.3) |  -7.59% |    -3.84% (1.28 pp) |
| tuple/projection/100/merge.duplicate    |           9,211.8 (1,758) |            8,777 (596.66) |  -4.72% |   +3.34% (21.64 pp) |
| tuple/tuple/100/merge.duplicate         |        12,816.53 (165.99) |        13,286.25 (928.59) |  +3.67% |   -0.48% (10.49 pp) |
| tuple/projection/100/length             |              28.23 (1.63) |              28.56 (2.95) |  +1.16% |   +5.10% (12.26 pp) |
| tuple/tuple/100/length                  |              26.88 (2.16) |              26.75 (4.01) |  -0.47% |   +3.08% (18.95 pp) |
| tuple/projection/100/value.random       |              84.36 (0.82) |              82.53 (4.67) |  -2.18% |    -0.89% (5.23 pp) |
| tuple/tuple/100/value.random            |              17.86 (0.54) |              18.37 (1.01) |  +2.81% |    +0.34% (1.23 pp) |
| tuple/projection/100/values             |           1,862.9 (37.96) |         1,903.92 (112.23) |  +2.20% |    +1.35% (7.32 pp) |
| tuple/tuple/100/values                  |          1,580.66 (57.42) |         1,690.02 (186.51) |  +6.92% |    +8.53% (4.04 pp) |
| tuple/projection/100/sequence           |          6,174.28 (873.5) |         6,382.24 (363.51) |  +3.37% |   +1.05% (10.84 pp) |
| tuple/tuple/100/sequence                |          5,606.21 (92.97) |         5,941.62 (640.33) |  +5.98% |   +7.51% (10.47 pp) |

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
