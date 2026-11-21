# Default API at codec introduction

5 complete matched runs per build. Before: baseline; candidate: words-v3. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 39 timing medians improve over 5%; 175 slow over 5%. Length remains shown as a control. Default-format slowdowns were explicitly accepted for this round because that format will be removed. These are measured regressions, not a claim of unchanged default performance. Final packed-format measurements and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            770.1 (131.45) |         1,161.01 (255.53) | +50.76% |  +39.28% (48.28 pp) |
| throughput/1000/apply.duplicate         |            826.51 (39.37) |            913.09 (40.12) | +10.48% |     +9.91% (3.8 pp) |
| throughput/5000/apply.duplicate         |            371.86 (28.02) |            398.8 (119.08) |  +7.24% |   +6.19% (13.34 pp) |
| throughput/10000/apply.duplicate        |             334.9 (26.83) |             377.1 (72.28) | +12.60% |   +7.33% (30.49 pp) |
| throughput/15000/apply.duplicate        |              306.19 (2.5) |            347.97 (37.86) | +13.65% |   +12.95% (9.43 pp) |
| throughput/20000/apply.duplicate        |             316.19 (48.3) |            346.75 (49.17) |  +9.67% |    +7.38% (8.38 pp) |
| throughput/25000/apply.duplicate        |            325.59 (15.25) |            329.93 (29.08) |  +1.33% |   +1.33% (22.62 pp) |
| throughput/100/apply.duplicateRemove    |         1,385.91 (141.92) |          1,807.9 (461.73) | +30.45% |  +33.96% (23.19 pp) |
| throughput/1000/apply.duplicateRemove   |            870.86 (33.64) |            955.28 (68.77) |  +9.69% |    +9.08% (4.95 pp) |
| throughput/5000/apply.duplicateRemove   |            767.78 (88.57) |           805.84 (264.34) |  +4.96% |    +7.43% (42.8 pp) |
| throughput/10000/apply.duplicateRemove  |             689.27 (21.7) |             744.31 (43.3) |  +7.99% |    +8.70% (6.44 pp) |
| throughput/15000/apply.duplicateRemove  |             650.8 (25.79) |            731.56 (92.26) | +12.41% |  +10.00% (19.79 pp) |
| throughput/20000/apply.duplicateRemove  |            697.65 (92.44) |            727.58 (97.97) |  +4.29% |   +9.34% (23.61 pp) |
| throughput/25000/apply.duplicateRemove  |            678.23 (56.67) |            703.36 (31.75) |  +3.71% |    -0.49% (6.19 pp) |
| throughput/100/apply.duplicateReplace   |          1,057.7 (218.58) |         1,335.32 (399.98) | +26.25% |  +19.23% (35.37 pp) |
| throughput/1000/apply.duplicateReplace  |          1,090.21 (53.84) |         1,245.17 (482.55) | +14.21% |  +19.04% (45.88 pp) |
| throughput/5000/apply.duplicateReplace  |            910.75 (70.81) |         1,028.02 (124.43) | +12.88% |    +12.81% (4.8 pp) |
| throughput/10000/apply.duplicateReplace |            854.38 (38.35) |             910.28 (3.51) |  +6.54% |    +4.18% (5.53 pp) |
| throughput/15000/apply.duplicateReplace |            838.55 (51.75) |             855.27 (27.9) |  +1.99% |    +4.23% (7.74 pp) |
| throughput/20000/apply.duplicateReplace |            834.99 (21.27) |           894.66 (151.65) |  +7.15% |   +9.54% (16.89 pp) |
| throughput/25000/apply.duplicateReplace |           904.85 (186.81) |            867.95 (15.67) |  -4.08% |    -1.93% (7.66 pp) |
| throughput/100/apply.insert             |         1,717.92 (459.58) |         2,206.97 (536.14) | +28.47% |  +35.95% (51.12 pp) |
| throughput/1000/apply.insert            |         1,401.35 (175.98) |          1,455.68 (97.79) |  +3.88% |   +10.44% (5.68 pp) |
| throughput/5000/apply.insert            |         1,428.19 (129.05) |          1,461.34 (41.13) |  +2.32% |   +9.23% (14.92 pp) |
| throughput/10000/apply.insert           |          1,415.11 (98.76) |         1,461.17 (328.99) |  +3.25% |   +1.39% (35.23 pp) |
| throughput/15000/apply.insert           |         1,389.14 (181.02) |          1,407.65 (334.9) |  +1.33% |   +13.84% (7.43 pp) |
| throughput/20000/apply.insert           |         1,178.31 (201.34) |         1,204.24 (199.37) |  +2.20% |   +5.81% (27.15 pp) |
| throughput/25000/apply.insert           |         1,244.99 (149.49) |           1,288.95 (27.7) |  +3.53% |    +2.18% (8.69 pp) |
| throughput/100/apply.remove             |           2,015.6 (119.5) |          2,298.59 (637.1) | +14.04% |  +10.87% (23.55 pp) |
| throughput/1000/apply.remove            |          1,486.11 (68.15) |          1,628.12 (56.68) |  +9.56% |   +11.19% (2.86 pp) |
| throughput/5000/apply.remove            |         1,527.33 (129.46) |          1,684.51 (87.09) | +10.29% |   +10.14% (3.47 pp) |
| throughput/10000/apply.remove           |         1,469.02 (229.47) |         1,678.21 (321.42) | +14.24% |   +11.50% (9.71 pp) |
| throughput/15000/apply.remove           |          1,503.91 (97.71) |         1,783.03 (154.77) | +18.56% |  +18.79% (10.41 pp) |
| throughput/20000/apply.remove           |         1,574.53 (200.99) |          1,636.57 (73.33) |  +3.94% |   +1.51% (16.08 pp) |
| throughput/25000/apply.remove           |         1,552.41 (128.37) |          1,686.3 (182.99) |  +8.62% |   +1.23% (19.29 pp) |
| throughput/100/apply.replace            |         2,762.85 (377.79) |       4,194.73 (1,740.12) | +51.83% |   +3.57% (66.67 pp) |
| throughput/1000/apply.replace           |         2,770.72 (122.16) |         3,073.51 (186.23) | +10.93% |  +10.93% (10.65 pp) |
| throughput/5000/apply.replace           |           2,836.67 (97.2) |          3,417.26 (550.8) | +20.47% |   +7.08% (17.11 pp) |
| throughput/10000/apply.replace          |         2,721.74 (112.75) |         2,835.04 (556.76) |  +4.16% |   +0.32% (27.19 pp) |
| throughput/15000/apply.replace          |          2,729.96 (41.15) |         3,067.44 (178.79) | +12.36% |  +13.34% (12.55 pp) |
| throughput/20000/apply.replace          |         2,859.51 (126.19) |         2,922.82 (793.62) |  +2.21% |   +0.26% (28.01 pp) |
| throughput/25000/apply.replace          |         2,836.75 (188.14) |         2,910.54 (315.09) |  +2.60% |   +4.09% (13.68 pp) |
| throughput/100/create.empty             |           581.59 (146.73) |            662.71 (119.5) | +13.95% |   -4.08% (24.75 pp) |
| throughput/1000/create.empty            |            795.93 (49.86) |           907.17 (108.78) | +13.98% |     +18.65% (10 pp) |
| throughput/5000/create.empty            |            867.72 (70.41) |           851.74 (119.19) |  -1.84% |   -2.50% (18.11 pp) |
| throughput/10000/create.empty           |            871.26 (86.59) |           824.62 (133.92) |  -5.35% |    -5.35% (6.25 pp) |
| throughput/15000/create.empty           |            800.24 (91.88) |           841.68 (273.91) |  +5.18% |   +8.30% (20.66 pp) |
| throughput/20000/create.empty           |            797.14 (43.71) |           801.06 (151.48) |  +0.49% |   -1.51% (26.38 pp) |
| throughput/25000/create.empty           |               764 (22.75) |            729.03 (30.79) |  -4.58% |    -7.17% (6.74 pp) |
| throughput/100/create.sequence          |         1,647.66 (201.18) |         1,815.36 (463.64) | +10.18% |  +14.55% (38.49 pp) |
| throughput/1000/create.sequence         |          1,990.86 (99.36) |         1,880.34 (387.56) |  -5.55% |   +2.14% (12.88 pp) |
| throughput/5000/create.sequence         |          1,677.06 (60.56) |         1,824.85 (254.22) |  +8.81% |   +2.20% (13.75 pp) |
| throughput/10000/create.sequence        |         1,698.28 (148.18) |         1,704.69 (343.03) |  +0.38% |   -1.79% (19.38 pp) |
| throughput/15000/create.sequence        |          1,561.03 (94.88) |            1,618 (448.85) |  +3.65% |  +10.01% (16.79 pp) |
| throughput/20000/create.sequence        |         1,657.82 (116.69) |         1,648.16 (113.01) |  -0.58% |    -0.82% (28.6 pp) |
| throughput/25000/create.sequence        |          1,527.66 (81.34) |         1,633.98 (136.47) |  +6.96% |   +3.87% (21.85 pp) |
| throughput/100/insert.head              |            559.68 (41.07) |           607.24 (170.99) |  +8.50% |   +7.08% (19.68 pp) |
| throughput/1000/insert.head             |            557.73 (17.79) |            573.14 (45.65) |  +2.76% |   +3.20% (17.62 pp) |
| throughput/5000/insert.head             |            573.44 (77.39) |             542.15 (40.1) |  -5.46% |   -7.91% (18.96 pp) |
| throughput/10000/insert.head            |            569.75 (58.43) |            576.59 (80.34) |  +1.20% |    +2.82% (7.36 pp) |
| throughput/15000/insert.head            |            497.48 (24.46) |            610.99 (13.39) | +22.82% |   +30.91% (8.33 pp) |
| throughput/20000/insert.head            |               519.24 (15) |            567.56 (34.67) |  +9.31% |    +8.41% (3.73 pp) |
| throughput/25000/insert.head            |            506.06 (17.61) |            482.32 (13.48) |  -4.69% |    -4.32% (0.97 pp) |
| throughput/100/insert.middle            |           651.69 (206.59) |           720.82 (107.41) | +10.61% |  +10.61% (15.98 pp) |
| throughput/1000/insert.middle           |            669.33 (21.35) |            665.09 (50.49) |  -0.63% |    -1.55% (4.69 pp) |
| throughput/5000/insert.middle           |            663.91 (69.68) |            678.04 (28.49) |  +2.13% |   +6.45% (13.02 pp) |
| throughput/10000/insert.middle          |            656.71 (24.36) |           643.35 (104.82) |  -2.03% |   +3.52% (18.29 pp) |
| throughput/15000/insert.middle          |            638.16 (59.81) |           639.39 (253.78) |  +0.19% |      +0.19% (28 pp) |
| throughput/20000/insert.middle          |             639.3 (21.33) |               676 (50.75) |  +5.74% |    +4.43% (11.8 pp) |
| throughput/25000/insert.middle          |           599.17 (102.63) |            586.71 (60.29) |  -2.08% |   -5.76% (10.44 pp) |
| throughput/100/insert.random            |         1,018.26 (164.81) |         1,049.03 (159.58) |  +3.02% |      +3.95% (35 pp) |
| throughput/1000/insert.random           |            970.35 (72.77) |         1,011.78 (162.54) |  +4.27% |    +2.06% (3.05 pp) |
| throughput/5000/insert.random           |             933.86 (9.23) |         1,009.36 (106.83) |  +8.08% |   +0.74% (17.49 pp) |
| throughput/10000/insert.random          |             934.5 (29.85) |            953.28 (204.6) |  +2.01% |   +2.01% (27.07 pp) |
| throughput/15000/insert.random          |            948.85 (98.34) |            998.23 (98.38) |  +5.20% |   +4.47% (16.57 pp) |
| throughput/20000/insert.random          |           870.73 (123.23) |            899.72 (140.7) |  +3.33% |    +1.99% (5.48 pp) |
| throughput/25000/insert.random          |           890.85 (324.82) |           928.75 (157.14) |  +4.25% |    +5.07% (42.7 pp) |
| throughput/100/insert.sameIndex         |           658.29 (126.38) |               687 (155.6) |  +4.36% |   +1.79% (17.11 pp) |
| throughput/1000/insert.sameIndex        |            592.52 (54.88) |            613.73 (88.29) |  +3.58% |    +6.91% (6.78 pp) |
| throughput/5000/insert.sameIndex        |            563.62 (19.98) |           616.09 (114.26) |  +9.31% |  +12.26% (21.22 pp) |
| throughput/10000/insert.sameIndex       |            593.34 (57.74) |            621.12 (67.39) |  +4.68% |   +5.86% (15.97 pp) |
| throughput/15000/insert.sameIndex       |            550.39 (67.28) |           575.76 (182.37) |  +4.61% |    -4.26% (0.82 pp) |
| throughput/20000/insert.sameIndex       |            562.25 (37.15) |            660.02 (50.64) | +17.39% |  +17.39% (21.83 pp) |
| throughput/25000/insert.sameIndex       |            601.27 (88.93) |            550.02 (93.62) |  -8.52% |    -1.78% (6.12 pp) |
| throughput/100/insert.tail              |            930.37 (70.91) |            924.3 (222.08) |  -0.65% |   +5.88% (44.35 pp) |
| throughput/1000/insert.tail             |           939.79 (142.52) |           842.83 (118.94) | -10.32% |    +1.90% (2.14 pp) |
| throughput/5000/insert.tail             |             932.9 (52.99) |          1,054.12 (62.72) | +12.99% |    +8.00% (7.81 pp) |
| throughput/10000/insert.tail            |           909.15 (116.61) |            947.32 (432.2) |  +4.20% |    -4.96% (55.4 pp) |
| throughput/15000/insert.tail            |           901.62 (146.31) |           826.97 (294.84) |  -8.28% |   +2.59% (11.93 pp) |
| throughput/20000/insert.tail            |             971.9 (64.34) |           973.44 (635.31) |  +0.16% |    +0.31% (65.4 pp) |
| throughput/25000/insert.tail            |           999.36 (188.37) |            891.19 (57.43) | -10.82% |  -12.98% (13.74 pp) |
| throughput/100/length                   |            118.57 (28.29) |             132.37 (31.8) | +11.64% |    -3.84% (2.36 pp) |
| throughput/1000/length                  |             113.77 (2.16) |             115.22 (6.72) |  +1.27% |   +0.85% (11.34 pp) |
| throughput/5000/length                  |            117.57 (11.81) |             142.98 (55.5) | +21.61% |  +15.90% (35.26 pp) |
| throughput/10000/length                 |            119.12 (14.93) |            130.57 (24.94) |  +9.61% |   -5.81% (33.28 pp) |
| throughput/15000/length                 |             121.69 (18.2) |            124.92 (15.38) |  +2.65% |    +7.72% (26.5 pp) |
| throughput/20000/length                 |            104.62 (10.52) |             113.74 (5.68) |  +8.72% |   +7.62% (13.81 pp) |
| throughput/25000/length                 |            116.63 (20.62) |            117.68 (13.67) |  +0.90% |   -7.48% (27.29 pp) |
| throughput/100/merge.duplicate          |           919.97 (162.32) |            989.5 (130.13) |  +7.56% |   +9.09% (11.44 pp) |
| throughput/1000/merge.duplicate         |             657.22 (40.2) |             715.5 (17.48) |  +8.87% |    +8.87% (9.55 pp) |
| throughput/5000/merge.duplicate         |             676.2 (50.78) |            717.74 (89.22) |  +6.14% |   +2.87% (10.63 pp) |
| throughput/10000/merge.duplicate        |            624.39 (26.77) |           727.22 (107.38) | +16.47% |  +16.47% (21.55 pp) |
| throughput/15000/merge.duplicate        |            601.34 (95.69) |            672.73 (76.79) | +11.87% |    +1.02% (15.3 pp) |
| throughput/20000/merge.duplicate        |            603.72 (44.98) |           646.31 (165.52) |  +7.05% |   +9.73% (34.45 pp) |
| throughput/25000/merge.duplicate        |            657.09 (55.78) |            640.72 (88.47) |  -2.49% |    -6.11% (6.69 pp) |
| throughput/100/merge.insert             |         1,860.41 (198.92) |         2,030.83 (180.05) |  +9.16% |  +18.37% (25.13 pp) |
| throughput/1000/merge.insert            |         1,554.81 (114.67) |          1,631.7 (731.76) |  +4.95% |   +7.79% (53.78 pp) |
| throughput/5000/merge.insert            |         1,625.17 (177.91) |          1,718.51 (388.7) |  +5.74% |   +6.29% (12.16 pp) |
| throughput/10000/merge.insert           |           1,675.05 (23.4) |          1,718.18 (167.1) |  +2.57% |     +2.57% (5.8 pp) |
| throughput/15000/merge.insert           |          1,661.74 (232.8) |         1,884.94 (429.95) | +13.43% |   -8.19% (58.23 pp) |
| throughput/20000/merge.insert           |          1,571.44 (63.49) |            1,564.78 (309) |  -0.42% |   +3.99% (15.38 pp) |
| throughput/25000/merge.insert           |         1,454.76 (101.74) |         1,393.17 (104.27) |  -4.23% |    -7.21% (12.4 pp) |
| throughput/100/remove.head              |            743.42 (95.37) |           883.28 (237.09) | +18.81% |  +25.49% (25.01 pp) |
| throughput/1000/remove.head             |            818.89 (19.94) |           783.58 (155.46) |  -4.31% |   -1.87% (21.77 pp) |
| throughput/5000/remove.head             |            860.78 (76.48) |            831.8 (225.36) |  -3.37% |   +5.20% (38.32 pp) |
| throughput/10000/remove.head            |            870.58 (41.92) |            921.93 (95.87) |  +5.90% |   +2.52% (17.22 pp) |
| throughput/15000/remove.head            |            875.72 (10.06) |         1,042.93 (495.67) | +19.09% |  +19.09% (32.36 pp) |
| throughput/20000/remove.head            |            935.44 (54.84) |            949.55 (41.58) |  +1.51% |    +7.32% (8.41 pp) |
| throughput/25000/remove.head            |           961.18 (175.37) |          1,000.6 (114.09) |  +4.10% |   +4.10% (27.98 pp) |
| throughput/100/remove.middle            |            823.89 (86.87) |           888.86 (108.59) |  +7.89% |  +15.06% (22.56 pp) |
| throughput/1000/remove.middle           |             849.12 (29.3) |            836.19 (99.71) |  -1.52% |   +1.35% (16.01 pp) |
| throughput/5000/remove.middle           |             871.5 (51.48) |            911.09 (32.09) |  +4.54% |   +11.03% (7.01 pp) |
| throughput/10000/remove.middle          |           919.02 (111.02) |           913.03 (122.38) |  -0.65% |    +3.51% (6.99 pp) |
| throughput/15000/remove.middle          |            888.49 (20.88) |          1,005.88 (38.49) | +13.21% |   +17.34% (3.16 pp) |
| throughput/20000/remove.middle          |            935.22 (82.91) |             980.1 (71.61) |  +4.80% |  +10.96% (11.85 pp) |
| throughput/25000/remove.middle          |            952.98 (11.96) |          1,040.92 (34.13) |  +9.23% |   +8.05% (12.08 pp) |
| throughput/100/remove.random            |          1,160.17 (60.93) |          1,203.89 (26.17) |  +3.77% |   +3.77% (26.87 pp) |
| throughput/1000/remove.random           |          1,215.09 (78.48) |         1,328.54 (392.34) |  +9.34% |   +3.87% (33.87 pp) |
| throughput/5000/remove.random           |         1,244.94 (124.53) |         1,288.41 (276.34) |  +3.49% |   +0.75% (30.32 pp) |
| throughput/10000/remove.random          |         1,282.78 (395.76) |          1,285.97 (212.3) |  +0.25% |   +5.28% (21.92 pp) |
| throughput/15000/remove.random          |          1,230.64 (86.41) |         1,396.13 (226.58) | +13.45% |  +11.79% (26.18 pp) |
| throughput/20000/remove.random          |          1,286.13 (31.56) |           1,276.12 (9.31) |  -0.78% |    -3.08% (3.94 pp) |
| throughput/25000/remove.random          |           1,369.13 (72.5) |          1,387.3 (153.59) |  +1.33% |    +1.33% (7.95 pp) |
| throughput/100/remove.sameIndex         |         1,070.98 (189.41) |         1,479.37 (738.65) | +38.13% |  +25.91% (32.65 pp) |
| throughput/1000/remove.sameIndex        |            840.33 (53.27) |           887.42 (158.16) |  +5.60% |   +2.71% (22.35 pp) |
| throughput/5000/remove.sameIndex        |           825.02 (121.01) |           887.05 (209.43) |  +7.52% |   +7.52% (33.27 pp) |
| throughput/10000/remove.sameIndex       |            876.99 (75.45) |            914.19 (29.02) |  +4.24% |    +2.87% (8.45 pp) |
| throughput/15000/remove.sameIndex       |            839.63 (21.62) |           918.24 (100.06) |  +9.36% |   +9.36% (14.94 pp) |
| throughput/20000/remove.sameIndex       |            957.91 (56.92) |          1,070.61 (80.07) | +11.77% |   +7.66% (15.04 pp) |
| throughput/25000/remove.sameIndex       |               951 (91.55) |           938.77 (537.22) |  -1.29% |    -1.70% (71.3 pp) |
| throughput/100/remove.tail              |            796.94 (80.82) |            891.99 (17.02) | +11.93% |  +18.46% (13.15 pp) |
| throughput/1000/remove.tail             |            744.82 (23.69) |           775.24 (124.08) |  +4.08% |   +2.57% (11.75 pp) |
| throughput/5000/remove.tail             |            762.52 (21.55) |            789.77 (63.36) |  +3.57% |  +11.39% (11.34 pp) |
| throughput/10000/remove.tail            |           819.68 (113.65) |           824.11 (395.09) |  +0.54% |   -3.17% (70.28 pp) |
| throughput/15000/remove.tail            |            836.46 (38.25) |           834.85 (169.03) |  -0.19% |   -1.23% (22.67 pp) |
| throughput/20000/remove.tail            |           848.66 (119.37) |            907.65 (40.14) |  +6.95% |  +17.29% (22.75 pp) |
| throughput/25000/remove.tail            |            831.33 (34.01) |           929.13 (180.76) | +11.76% |   +3.80% (24.28 pp) |
| throughput/100/replace.head             |         1,115.51 (172.16) |          1,275.71 (24.74) | +14.36% |   +14.36% (5.84 pp) |
| throughput/1000/replace.head            |          1,221.18 (77.08) |         1,275.38 (106.54) |  +4.44% |    +0.54% (2.82 pp) |
| throughput/5000/replace.head            |          1,218.94 (98.63) |          1,174.67 (75.35) |  -3.63% |    +3.82% (3.08 pp) |
| throughput/10000/replace.head           |          1,238.15 (55.84) |         1,278.08 (640.46) |  +3.22% |   +4.77% (49.28 pp) |
| throughput/15000/replace.head           |           1,159.49 (6.89) |         1,425.46 (303.09) | +22.94% |  +22.94% (24.22 pp) |
| throughput/20000/replace.head           |          1,216.86 (21.74) |           1,249.15 (7.45) |  +2.65% |    +2.99% (3.45 pp) |
| throughput/25000/replace.head           |         1,351.46 (210.97) |         1,317.75 (299.93) |  -2.49% |   +0.92% (38.46 pp) |
| throughput/100/replace.middle           |         1,164.68 (188.44) |         1,267.31 (104.35) |  +8.81% |   +12.01% (3.86 pp) |
| throughput/1000/replace.middle          |           1,309.2 (73.05) |          1,308.17 (27.63) |  -0.08% |    -1.02% (3.39 pp) |
| throughput/5000/replace.middle          |          1,222.97 (12.44) |         1,285.76 (132.92) |  +5.13% |    +4.12% (4.16 pp) |
| throughput/10000/replace.middle         |          1,245.42 (73.15) |         1,306.72 (138.06) |  +4.92% |   +0.54% (15.34 pp) |
| throughput/15000/replace.middle         |          1,222.45 (29.95) |         1,436.17 (313.01) | +17.48% |  +21.97% (24.38 pp) |
| throughput/20000/replace.middle         |          1,301.83 (19.72) |          1,377.1 (153.54) |  +5.78% |   +4.23% (12.37 pp) |
| throughput/25000/replace.middle         |           1,347.2 (112.4) |           1,340.72 (37.6) |  -0.48% |   -0.48% (14.73 pp) |
| throughput/100/replace.random           |          1,927.6 (103.05) |          1,885.24 (98.64) |  -2.20% |   +1.23% (19.25 pp) |
| throughput/1000/replace.random          |          1,812.45 (32.58) |         1,896.56 (107.26) |  +4.64% |    +2.04% (4.68 pp) |
| throughput/5000/replace.random          |         1,806.85 (224.32) |          1,749.47 (62.77) |  -3.18% |   -3.18% (13.34 pp) |
| throughput/10000/replace.random         |         1,834.25 (167.35) |          1,895.66 (46.74) |  +3.35% |   +4.70% (13.37 pp) |
| throughput/15000/replace.random         |          1,733.26 (42.16) |         1,802.91 (200.38) |  +4.02% |   +7.87% (14.82 pp) |
| throughput/20000/replace.random         |         1,830.31 (118.94) |         1,897.42 (245.85) |  +3.67% |   +2.46% (32.84 pp) |
| throughput/25000/replace.random         |         1,842.33 (172.24) |          1,882.3 (296.21) |  +2.17% |   -4.44% (19.84 pp) |
| throughput/100/replace.sameIndex        |         1,157.54 (115.49) |          1,236.14 (52.11) |  +6.79% |     +9.71% (7.8 pp) |
| throughput/1000/replace.sameIndex       |          1,221.38 (42.39) |         1,271.23 (211.38) |  +4.08% |  +10.98% (21.31 pp) |
| throughput/5000/replace.sameIndex       |          1,172.45 (93.97) |           1,199.7 (80.48) |  +2.32% |   +2.11% (12.33 pp) |
| throughput/10000/replace.sameIndex      |          1,230.57 (101.5) |         1,239.51 (300.13) |  +0.73% |   -4.01% (45.38 pp) |
| throughput/15000/replace.sameIndex      |          1,138.43 (57.74) |         1,338.84 (135.52) | +17.60% |   +17.60% (5.74 pp) |
| throughput/20000/replace.sameIndex      |           1,253.72 (55.3) |          1,264.61 (26.22) |  +0.87% |   +4.46% (12.23 pp) |
| throughput/25000/replace.sameIndex      |         1,268.37 (117.43) |         1,314.88 (101.86) |  +3.67% |    +1.19% (7.38 pp) |
| throughput/100/replace.tail             |          1,179.78 (74.02) |          1,232.33 (68.17) |  +4.45% |    +6.12% (3.85 pp) |
| throughput/1000/replace.tail            |          1,180.53 (27.67) |          1,336.47 (91.34) | +13.21% |  +14.21% (15.66 pp) |
| throughput/5000/replace.tail            |          1,190.06 (89.85) |          1,317.3 (219.94) | +10.69% |   +3.18% (12.39 pp) |
| throughput/10000/replace.tail           |         1,214.94 (160.97) |          1,308.17 (46.47) |  +7.67% |   +6.83% (13.76 pp) |
| throughput/15000/replace.tail           |           1,239.73 (72.2) |         1,351.83 (143.65) |  +9.04% |    +6.70% (5.92 pp) |
| throughput/20000/replace.tail           |           1,259.2 (21.86) |         1,375.97 (216.68) |  +9.27% |    +5.46% (8.64 pp) |
| throughput/25000/replace.tail           |           1,278.76 (35.6) |         1,305.23 (560.43) |  +2.07% |   +1.29% (11.61 pp) |
| throughput/100/retire                   |            199.75 (17.51) |             224.81 (9.94) | +12.55% |  +14.74% (16.72 pp) |
| throughput/1000/retire                  |             215.89 (1.67) |            248.25 (30.94) | +14.99% |  +14.78% (13.03 pp) |
| throughput/5000/retire                  |             213.57 (8.51) |            216.94 (14.19) |  +1.58% |    +3.84% (5.06 pp) |
| throughput/10000/retire                 |              203.83 (7.3) |           209.15 (127.51) |  +2.61% |   +4.88% (65.99 pp) |
| throughput/15000/retire                 |             213.8 (20.47) |              196.53 (2.8) |  -8.08% |    -0.58% (9.09 pp) |
| throughput/20000/retire                 |              191.9 (8.73) |             209.89 (9.28) |  +9.37% |   +10.47% (7.23 pp) |
| throughput/25000/retire                 |            192.85 (17.14) |             201.39 (2.57) |  +4.43% |   +4.38% (12.69 pp) |
| throughput/100/sequence                 |            324.47 (16.48) |            358.79 (44.91) | +10.58% |   +9.99% (23.05 pp) |
| throughput/1000/sequence                |             288.51 (7.16) |             348.2 (21.73) | +20.69% |   +20.68% (4.63 pp) |
| throughput/5000/sequence                |            275.19 (12.59) |            302.57 (76.59) |  +9.95% |  +14.49% (17.08 pp) |
| throughput/10000/sequence               |            263.21 (18.69) |            320.59 (11.48) | +21.80% |  +23.89% (13.53 pp) |
| throughput/15000/sequence               |             257.85 (2.26) |            288.02 (18.22) | +11.70% |   +11.70% (5.22 pp) |
| throughput/20000/sequence               |            237.82 (10.21) |             268.21 (1.89) | +12.78% |   +13.49% (1.42 pp) |
| throughput/25000/sequence               |            248.21 (13.69) |            276.72 (11.03) | +11.49% |    +6.98% (2.61 pp) |
| throughput/100/value.head               |             208.25 (4.97) |            198.89 (48.75) |  -4.49% |   +2.10% (22.11 pp) |
| throughput/1000/value.head              |             182.2 (10.44) |            189.49 (14.96) |  +4.00% |   +0.56% (19.02 pp) |
| throughput/5000/value.head              |             153.17 (16.6) |             151.31 (2.29) |  -1.21% |   +2.18% (13.19 pp) |
| throughput/10000/value.head             |            168.92 (20.95) |            152.78 (18.97) |  -9.55% |    -6.21% (4.57 pp) |
| throughput/15000/value.head             |             138.76 (0.15) |             147.95 (8.26) |  +6.62% |    +6.62% (2.99 pp) |
| throughput/20000/value.head             |              146.4 (4.27) |              139.3 (9.45) |  -4.85% |    +0.48% (4.79 pp) |
| throughput/25000/value.head             |             147.22 (2.56) |              135.3 (7.21) |  -8.10% |    -8.10% (5.39 pp) |
| throughput/100/value.middle             |               281 (29.89) |             275.3 (75.54) |  -2.03% |   -1.99% (24.37 pp) |
| throughput/1000/value.middle            |            258.07 (11.12) |            293.24 (44.74) | +13.63% |  +14.14% (15.35 pp) |
| throughput/5000/value.middle            |            241.22 (12.04) |             243.19 (5.06) |  +0.82% |   +0.02% (12.09 pp) |
| throughput/10000/value.middle           |            227.95 (16.47) |            233.01 (21.14) |  +2.22% |    +1.74% (7.17 pp) |
| throughput/15000/value.middle           |            227.15 (11.86) |            239.71 (55.38) |  +5.53% |  +10.52% (27.79 pp) |
| throughput/20000/value.middle           |            216.28 (11.66) |            227.43 (21.77) |  +5.16% |    +0.23% (12.2 pp) |
| throughput/25000/value.middle           |            223.99 (17.67) |             213.95 (6.76) |  -4.48% |    -2.93% (6.24 pp) |
| throughput/100/value.random             |            242.62 (19.11) |            244.14 (24.19) |  +0.63% |   +2.74% (13.41 pp) |
| throughput/1000/value.random            |             243.12 (10.3) |            250.55 (21.36) |  +3.06% |    +4.43% (5.32 pp) |
| throughput/5000/value.random            |            286.31 (12.15) |            276.23 (45.36) |  -3.52% |   -3.52% (28.51 pp) |
| throughput/10000/value.random           |            296.09 (27.92) |            293.59 (42.75) |  -0.84% |    +2.31% (6.19 pp) |
| throughput/15000/value.random           |             276.24 (7.84) |            323.75 (32.01) | +17.20% |  +17.20% (12.83 pp) |
| throughput/20000/value.random           |             287.97 (6.46) |             296.96 (27.4) |  +3.12% |    +1.46% (4.63 pp) |
| throughput/25000/value.random           |             288.41 (24.1) |                278 (2.43) |  -3.61% |    -3.02% (7.39 pp) |
| throughput/100/value.sameIndex          |            227.09 (27.08) |            219.59 (25.14) |  -3.30% |   +5.09% (19.05 pp) |
| throughput/1000/value.sameIndex         |             191.56 (4.93) |            198.82 (24.82) |  +3.79% |   +3.93% (14.32 pp) |
| throughput/5000/value.sameIndex         |            183.42 (48.58) |            186.96 (78.62) |  +1.93% |    -1.03% (7.62 pp) |
| throughput/10000/value.sameIndex        |            174.41 (16.12) |           179.24 (160.08) |  +2.77% |   +6.37% (67.03 pp) |
| throughput/15000/value.sameIndex        |            180.22 (11.02) |            196.01 (39.47) |  +8.76% |  +13.10% (29.04 pp) |
| throughput/20000/value.sameIndex        |            165.01 (12.85) |            224.33 (84.88) | +35.95% |   +41.04% (57.9 pp) |
| throughput/25000/value.sameIndex        |            159.82 (11.36) |             165.75 (0.73) |  +3.71% |    +3.68% (7.02 pp) |
| throughput/100/value.tail               |            246.24 (37.26) |           277.14 (160.91) | +12.55% |  +13.24% (43.93 pp) |
| throughput/1000/value.tail              |            222.57 (10.55) |                227.63 (4) |  +2.27% |    +2.27% (7.94 pp) |
| throughput/5000/value.tail              |            214.43 (15.19) |            248.21 (61.64) | +15.75% |  +27.57% (31.79 pp) |
| throughput/10000/value.tail             |              193.19 (3.1) |             203.28 (5.44) |  +5.22% |    +6.17% (4.67 pp) |
| throughput/15000/value.tail             |            190.02 (19.31) |            208.67 (44.41) |  +9.81% |   +6.37% (31.01 pp) |
| throughput/20000/value.tail             |             184.7 (13.79) |            218.55 (39.68) | +18.33% |   +13.67% (12.5 pp) |
| throughput/25000/value.tail             |            209.14 (18.17) |             182.01 (6.94) | -12.97% |    -11.47% (7.3 pp) |
| throughput/100/values                   |         4,787.54 (273.76) |         5,399.66 (995.77) | +12.79% |   +6.28% (34.57 pp) |
| throughput/1000/values                  |     176,521.01 (1,723.09) |    182,095.83 (29,388.72) |  +3.16% |   +4.06% (16.18 pp) |
| throughput/5000/values                  |      602,912.5 (15,040.1) |      577,984.9 (80,140.1) |  -4.13% |   -5.41% (16.09 pp) |
| throughput/10000/values                 |  1,175,595.31 (25,226.56) | 1,315,485.16 (216,810.16) | +11.90% |   +8.39% (22.44 pp) |
| throughput/15000/values                 |  1,737,120.31 (51,206.25) | 1,910,768.75 (328,004.69) | +10.00% |  +10.00% (18.86 pp) |
| throughput/20000/values                 | 2,710,182.81 (254,810.94) |  3,206,693.75 (762,412.5) | +18.32% |  +17.43% (31.85 pp) |
| throughput/25000/values                 |  3,733,012.5 (331,746.88) | 3,068,298.44 (647,304.69) | -17.81% |   -9.49% (17.18 pp) |
| throughput/100/values.head              |            377.61 (25.71) |             342.01 (9.43) |  -9.43% |   -3.60% (15.26 pp) |
| throughput/1000/values.head             |            291.48 (16.72) |           345.43 (425.28) | +18.51% |  +18.51% (42.94 pp) |
| throughput/5000/values.head             |             311.8 (32.13) |            278.45 (11.23) | -10.70% |   -12.30% (5.89 pp) |
| throughput/10000/values.head            |            294.59 (18.64) |            301.68 (43.32) |  +2.41% |   +4.31% (27.02 pp) |
| throughput/15000/values.head            |             276.3 (31.18) |             280.8 (31.53) |  +1.63% |    +3.50% (7.91 pp) |
| throughput/20000/values.head            |            306.85 (47.85) |            283.76 (20.16) |  -7.52% |   -8.04% (10.16 pp) |
| throughput/25000/values.head            |            272.82 (28.97) |            268.17 (18.37) |  -1.70% |    -0.77% (3.53 pp) |
| throughput/100/values.middle            |            344.59 (56.98) |            319.23 (66.86) |  -7.36% |   +3.04% (12.63 pp) |
| throughput/1000/values.middle           |            276.02 (17.43) |            306.75 (78.07) | +11.13% |   -0.09% (14.35 pp) |
| throughput/5000/values.middle           |            267.27 (60.21) |            295.76 (98.25) | +10.66% |   +10.52% (6.67 pp) |
| throughput/10000/values.middle          |            282.84 (77.31) |            266.74 (41.82) |  -5.69% |    -2.92% (8.74 pp) |
| throughput/15000/values.middle          |            280.53 (19.27) |            254.76 (37.69) |  -9.19% |    +1.26% (7.16 pp) |
| throughput/20000/values.middle          |             287.88 (34.1) |            266.18 (13.98) |  -7.54% |   -6.95% (19.29 pp) |
| throughput/25000/values.middle          |            244.49 (32.06) |             265.2 (30.57) |  +8.47% |    +3.05% (1.64 pp) |
| throughput/100/values.random            |            330.42 (28.33) |             383.1 (60.54) | +15.94% |    +9.43% (14.1 pp) |
| throughput/1000/values.random           |            307.83 (83.11) |            332.64 (26.32) |  +8.06% |   +3.38% (11.25 pp) |
| throughput/5000/values.random           |               339.74 (45) |            366.51 (41.49) |  +7.88% |    +9.39% (7.83 pp) |
| throughput/10000/values.random          |              393.8 (20.4) |            361.28 (15.79) |  -8.26% |    -8.36% (2.26 pp) |
| throughput/15000/values.random          |             369.29 (4.57) |            370.62 (22.18) |  +0.36% |    -0.88% (7.17 pp) |
| throughput/20000/values.random          |             413.2 (23.02) |            438.75 (76.98) |  +6.18% |  +17.29% (24.68 pp) |
| throughput/25000/values.random          |             400.22 (56.6) |            408.73 (53.07) |  +2.13% |   -0.43% (22.63 pp) |
| throughput/100/values.sameIndex         |            322.34 (23.09) |            322.22 (87.89) |  -0.04% |   +0.49% (35.92 pp) |
| throughput/1000/values.sameIndex        |             296.25 (22.8) |            300.37 (33.98) |  +1.39% |   +2.20% (15.65 pp) |
| throughput/5000/values.sameIndex        |             289.41 (7.41) |            300.73 (47.14) |  +3.91% |   +4.94% (16.65 pp) |
| throughput/10000/values.sameIndex       |            251.62 (45.05) |            281.26 (56.89) | +11.78% |   +1.10% (20.82 pp) |
| throughput/15000/values.sameIndex       |             245.68 (7.35) |            242.95 (42.54) |  -1.11% |   +3.20% (19.97 pp) |
| throughput/20000/values.sameIndex       |            266.54 (29.73) |             272.62 (45.4) |  +2.28% |     +2.44% (6.5 pp) |
| throughput/25000/values.sameIndex       |               259 (20.18) |            241.02 (17.91) |  -6.94% |    -5.83% (9.52 pp) |
| throughput/100/values.tail              |            312.83 (22.56) |            337.19 (34.93) |  +7.79% |    +7.79% (3.39 pp) |
| throughput/1000/values.tail             |            283.03 (27.61) |            295.79 (20.93) |  +4.51% |    +3.13% (5.89 pp) |
| throughput/5000/values.tail             |            289.78 (81.94) |            258.92 (66.69) | -10.65% |    +1.44% (38.1 pp) |
| throughput/10000/values.tail            |             278.82 (9.85) |            275.84 (49.32) |  -1.07% |  -10.56% (27.07 pp) |
| throughput/15000/values.tail            |            239.28 (50.46) |            289.95 (86.18) | +21.18% |  +27.88% (51.66 pp) |
| throughput/20000/values.tail            |            283.57 (32.13) |            280.92 (18.08) |  -0.93% |   -3.50% (13.48 pp) |
| throughput/25000/values.tail            |            252.66 (12.38) |            243.13 (12.52) |  -3.77% |    -0.72% (4.52 pp) |
| lifecycle/scaleUp/apply.random          |          3,850.89 (269.9) |         4,129.36 (687.44) |  +7.23% |   +6.09% (16.24 pp) |
| lifecycle/scaleUp/insert.head           |           808.58 (104.32) |            903.92 (56.35) | +11.79% |   +4.85% (20.99 pp) |
| lifecycle/scaleUp/insert.random         |         1,857.36 (453.96) |         1,925.56 (285.43) |  +3.67% |   -1.46% (10.88 pp) |
| lifecycle/scaleUp/insert.tail           |            869.3 (125.25) |           896.63 (260.62) |  +3.14% |   +3.14% (19.93 pp) |
| lifecycle/scaleUp/remove.random         |          3,035.62 (299.2) |         2,948.12 (281.74) |  -2.88% |   +4.44% (10.96 pp) |
| lifecycle/scaleUp/replace.head          |         2,960.68 (414.42) |         2,613.84 (327.75) | -11.71% |   +5.00% (25.09 pp) |
| lifecycle/scaleUp/replace.random        |         3,982.51 (455.91) |         4,070.43 (317.52) |  +2.21% |    +0.04% (9.75 pp) |
| lifecycle/scaleUp/replace.tail          |         2,393.68 (182.63) |         2,708.89 (771.04) | +13.17% |    +5.46% (7.45 pp) |
| lifecycle/scaleUp/value.head            |            314.36 (26.32) |            334.66 (52.39) |  +6.45% |   +6.48% (26.51 pp) |
| lifecycle/scaleUp/value.random          |          1,142.18 (98.38) |         1,228.98 (144.07) |  +7.60% |   +4.98% (15.24 pp) |
| lifecycle/scaleUp/value.tail            |             157.26 (14.3) |             164.4 (19.62) |  +4.54% |    +8.09% (5.15 pp) |
| lifecycle/scaleDown/apply.random        |          3,461.8 (183.77) |         4,047.61 (350.73) | +16.92% |  +19.20% (17.55 pp) |
| lifecycle/scaleDown/insert.random       |          1,712.55 (54.26) |          1,874.3 (247.61) |  +9.45% |   +8.09% (10.06 pp) |
| lifecycle/scaleDown/remove.head         |          1,922.83 (17.02) |         2,031.29 (237.62) |  +5.64% |    +5.64% (3.08 pp) |
| lifecycle/scaleDown/remove.random       |           2,722.7 (64.49) |         3,135.13 (325.42) | +15.15% |  +12.80% (12.41 pp) |
| lifecycle/scaleDown/remove.tail         |          1,748.14 (75.41) |          1,852.35 (77.89) |  +5.96% |    +5.70% (2.23 pp) |
| lifecycle/scaleDown/replace.head        |          2,564.29 (57.94) |         2,921.88 (373.94) | +13.94% |    +3.79% (11.4 pp) |
| lifecycle/scaleDown/replace.random      |         3,470.83 (231.94) |         3,628.76 (137.44) |  +4.55% |    +4.55% (6.68 pp) |
| lifecycle/scaleDown/replace.tail        |      20,013.47 (1,316.28) |      19,968.25 (4,928.92) |  -0.23% |    +3.60% (23.8 pp) |
| lifecycle/scaleDown/value.head          |            415.65 (25.54) |            437.11 (57.18) |  +5.16% |    +6.14% (7.49 pp) |
| lifecycle/scaleDown/value.random        |          1,100.62 (51.06) |         1,253.59 (179.86) | +13.90% |   +9.77% (14.44 pp) |
| lifecycle/scaleDown/value.tail          |            241.35 (10.58) |            249.13 (25.84) |  +3.22% |    +2.68% (7.86 pp) |
| lifecycle/fullLifecycle/apply.random    |          3,631.34 (97.58) |            4,273.14 (398) | +17.67% |  +14.85% (16.42 pp) |
| lifecycle/fullLifecycle/insert.head     |           808.58 (104.32) |            903.92 (56.35) | +11.79% |   +4.85% (20.99 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,837.85 (251.55) |         1,887.64 (254.23) |  +2.71% |    +6.52% (7.36 pp) |
| lifecycle/fullLifecycle/insert.tail     |            869.3 (125.25) |           896.63 (260.62) |  +3.14% |   +3.14% (19.93 pp) |
| lifecycle/fullLifecycle/remove.head     |          1,922.83 (17.02) |         2,031.29 (237.62) |  +5.64% |    +5.64% (3.08 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,907.44 (408.62) |         3,000.49 (251.01) |  +3.20% |   +8.44% (19.58 pp) |
| lifecycle/fullLifecycle/remove.tail     |          1,748.14 (75.41) |          1,852.35 (77.89) |  +5.96% |    +5.70% (2.23 pp) |
| lifecycle/fullLifecycle/replace.head    |          2,793.57 (85.35) |         2,711.12 (358.92) |  -2.95% |    +6.81% (16.5 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,673.28 (332.66) |         3,856.91 (521.85) |  +5.00% |    +0.87% (8.26 pp) |
| lifecycle/fullLifecycle/replace.tail    |         11,291.1 (865.66) |      11,589.44 (2,679.93) |  +2.64% |   +2.66% (21.13 pp) |
| lifecycle/fullLifecycle/value.head      |            362.41 (25.49) |            385.88 (54.78) |  +6.48% |   +5.44% (18.43 pp) |
| lifecycle/fullLifecycle/value.random    |         1,157.19 (218.66) |         1,241.29 (161.96) |  +7.27% |   -0.02% (21.87 pp) |
| lifecycle/fullLifecycle/value.tail      |             201.2 (10.55) |             204.1 (21.43) |  +1.44% |    +5.44% (6.17 pp) |
| checkpoint/up/1000/create               |          280,000 (72,000) |          464,400 (50,700) | +65.86% |  +68.07% (35.65 pp) |
| checkpoint/up/1000/sequence             |       2,227,200 (329,000) |     3,325,400 (1,015,700) | +49.31% |  +37.50% (45.68 pp) |
| checkpoint/up/1000/values               |       1,877,500 (262,000) |       2,100,500 (847,100) | +11.88% |   +2.94% (17.64 pp) |
| checkpoint/up/5000/create               |          890,800 (22,100) |       1,147,300 (647,200) | +28.79% |   +3.21% (28.16 pp) |
| checkpoint/up/5000/sequence             |       8,493,800 (449,100) |     8,750,100 (2,113,800) |  +3.02% |   +3.64% (16.45 pp) |
| checkpoint/up/5000/values               |     5,317,300 (2,478,800) |       5,638,100 (716,800) |  +6.03% |   +8.75% (35.52 pp) |
| checkpoint/up/10000/create              |       1,581,600 (179,200) |       1,952,100 (584,700) | +23.43% |  +30.88% (32.11 pp) |
| checkpoint/up/10000/sequence            |    14,375,400 (1,222,700) |    16,220,600 (2,927,700) | +12.84% |   +12.08% (4.47 pp) |
| checkpoint/up/10000/values              |      21,931,300 (266,800) |    22,038,300 (4,168,400) |  +0.49% |   +1.14% (21.25 pp) |
| checkpoint/up/15000/create              |        2,410,600 (52,100) |     2,944,200 (1,639,100) | +22.14% |   +22.14% (83.6 pp) |
| checkpoint/up/15000/sequence            |    15,170,900 (1,213,400) |    15,591,300 (6,316,300) |  +2.77% |   +8.98% (47.54 pp) |
| checkpoint/up/15000/values              |    29,890,200 (1,490,200) |    33,328,700 (4,162,200) | +11.50% |   +7.51% (25.32 pp) |
| checkpoint/up/20000/create              |        3,325,500 (87,300) |        3,651,200 (50,900) |  +9.79% |     +9.66% (8.3 pp) |
| checkpoint/up/20000/sequence            |      22,506,000 (450,500) |    26,586,200 (1,670,200) | +18.13% |  +18.45% (12.49 pp) |
| checkpoint/up/20000/values              |      10,881,400 (272,900) |      12,894,300 (711,400) | +18.50% |  +15.39% (19.46 pp) |
| checkpoint/up/25000/create              |       3,881,000 (548,800) |       4,454,400 (634,600) | +14.77% |    +7.34% (4.97 pp) |
| checkpoint/up/25000/sequence            |   25,171,200 (13,459,700) |    28,197,600 (2,783,500) | +12.02% |   -5.60% (25.21 pp) |
| checkpoint/up/25000/values              |    13,162,100 (1,133,800) |    13,100,000 (1,253,000) |  -0.47% |   +0.48% (22.88 pp) |
| checkpoint/down/20000/create            |       3,277,400 (128,900) |       3,513,600 (250,400) |  +7.21% |    +9.85% (2.88 pp) |
| checkpoint/down/20000/sequence          |      19,631,400 (994,400) |    20,581,200 (2,746,500) |  +4.84% |   +4.77% (12.25 pp) |
| checkpoint/down/20000/values            |       9,564,200 (263,100) |      10,048,000 (614,600) |  +5.06% |    +7.81% (0.56 pp) |
| checkpoint/down/15000/create            |       2,354,800 (110,100) |        2,515,300 (36,400) |  +6.82% |    +3.07% (6.17 pp) |
| checkpoint/down/15000/sequence          |    16,418,400 (1,213,100) |    17,216,000 (1,132,900) |  +4.86% |   +8.12% (17.34 pp) |
| checkpoint/down/15000/values            |       7,284,400 (402,700) |     8,537,700 (1,118,000) | +17.21% |   +11.46% (9.28 pp) |
| checkpoint/down/10000/create            |        1,645,500 (41,100) |        1,753,200 (51,200) |  +6.55% |    +5.67% (2.39 pp) |
| checkpoint/down/10000/sequence          |      13,063,700 (461,100) |    13,119,700 (1,090,400) |  +0.43% |    +1.20% (7.47 pp) |
| checkpoint/down/10000/values            |     5,960,400 (1,094,100) |       5,419,800 (320,400) |  -9.07% |    -3.86% (23.5 pp) |
| checkpoint/down/5000/create             |          800,300 (54,100) |          874,900 (63,400) |  +9.32% |   +7.17% (14.56 pp) |
| checkpoint/down/5000/sequence           |      10,862,400 (539,800) |    10,632,700 (1,521,700) |  -2.11% |   -2.26% (25.94 pp) |
| checkpoint/down/5000/values             |       3,627,600 (767,000) |       3,287,500 (318,700) |  -9.38% |    -9.32% (11.3 pp) |
| checkpoint/down/1000/create             |         213,300 (429,400) |          167,900 (15,600) | -21.28% |  -26.49% (88.91 pp) |
| checkpoint/down/1000/sequence           |       6,616,600 (801,700) |       6,180,000 (710,400) |  -6.60% |    -6.60% (6.24 pp) |
| checkpoint/down/1000/values             |          553,300 (86,800) |          530,600 (70,100) |  -4.10% |     -1.40% (4.9 pp) |
| checkpoint/down/0/create                |            15,200 (4,100) |            17,700 (4,200) | +16.45% |   -2.78% (15.44 pp) |
| checkpoint/down/0/sequence              |       1,541,300 (373,400) |       1,573,200 (338,100) |  +2.07% |   +4.05% (16.21 pp) |
| checkpoint/down/0/values                |            12,000 (1,500) |            11,700 (4,100) |  -2.50% |   -6.21% (27.72 pp) |
| tuple/projection/2/create.empty         |            385.44 (13.97) |            360.19 (17.55) |  -6.55% |    -6.85% (4.14 pp) |
| tuple/tuple/2/create.empty              |             449.3 (89.31) |             437.14 (4.58) |  -2.71% |   -3.54% (13.55 pp) |
| tuple/projection/2/create.sequence      |          1,248.84 (85.13) |          1,213.37 (64.16) |  -2.84% |    -3.11% (5.82 pp) |
| tuple/tuple/2/create.sequence           |          1,416.77 (38.73) |         1,435.05 (155.54) |  +1.29% |    +1.08% (9.31 pp) |
| tuple/projection/2/replace.random       |          1,036.58 (21.98) |         1,098.55 (165.23) |  +5.98% |    +2.84% (4.63 pp) |
| tuple/tuple/2/replace.random            |            711.31 (34.79) |            762.61 (13.44) |  +7.21% |    +5.59% (9.61 pp) |
| tuple/projection/2/apply.replace        |         1,790.28 (335.04) |         1,894.93 (195.37) |  +5.85% |   +5.85% (18.08 pp) |
| tuple/tuple/2/apply.replace             |         1,291.22 (201.57) |          1,240.24 (16.79) |  -3.95% |   -3.95% (12.56 pp) |
| tuple/projection/2/apply.duplicate      |            592.5 (310.53) |            662.71 (20.86) | +11.85% |   +7.84% (33.88 pp) |
| tuple/tuple/2/apply.duplicate           |           591.68 (264.44) |            664.52 (21.31) | +12.31% |   +9.86% (31.94 pp) |
| tuple/projection/2/merge.duplicate      |           739.82 (117.17) |             671.9 (36.05) |  -9.18% |   -9.18% (17.13 pp) |
| tuple/tuple/2/merge.duplicate           |            719.55 (51.44) |            643.93 (14.85) | -10.51% |    -9.00% (8.62 pp) |
| tuple/projection/2/length               |               8.22 (0.43) |               8.27 (0.91) |  +0.61% |   -0.56% (15.72 pp) |
| tuple/tuple/2/length                    |               7.62 (0.98) |               8.15 (0.86) |  +6.96% |   -0.59% (22.72 pp) |
| tuple/projection/2/value.random         |              32.89 (1.69) |              32.42 (2.87) |  -1.44% |   -7.23% (12.44 pp) |
| tuple/tuple/2/value.random              |              20.09 (1.34) |               19.8 (1.04) |  -1.46% |    -1.46% (7.44 pp) |
| tuple/projection/2/values               |              80.21 (3.14) |              82.06 (1.67) |  +2.30% |    +1.81% (4.98 pp) |
| tuple/tuple/2/values                    |              87.48 (9.94) |              85.26 (3.53) |  -2.55% |   -2.31% (14.45 pp) |
| tuple/projection/2/sequence             |           453.33 (119.34) |            467.91 (20.24) |  +3.22% |   -2.03% (26.25 pp) |
| tuple/tuple/2/sequence                  |           507.02 (106.84) |            504.84 (11.54) |  -0.43% |   -0.43% (17.64 pp) |
| tuple/projection/4/create.empty         |            420.42 (35.45) |            429.72 (25.62) |  +2.21% |   +3.42% (17.37 pp) |
| tuple/tuple/4/create.empty              |            442.64 (20.65) |              454.4 (7.36) |  +2.66% |    +2.66% (3.13 pp) |
| tuple/projection/4/create.sequence      |         1,664.92 (161.47) |         1,696.35 (134.54) |  +1.89% |    +1.89% (6.59 pp) |
| tuple/tuple/4/create.sequence           |          1,567.33 (60.86) |          1,582.09 (11.66) |  +0.94% |    +0.94% (10.7 pp) |
| tuple/projection/4/replace.random       |          1,169.34 (138.5) |          1,197.21 (50.87) |  +2.38% |   +5.32% (11.02 pp) |
| tuple/tuple/4/replace.random            |            660.09 (27.64) |            685.58 (24.34) |  +3.86% |   +2.40% (11.56 pp) |
| tuple/projection/4/apply.replace        |          1,691.71 (27.19) |           1,778.96 (79.8) |  +5.16% |    +3.07% (5.25 pp) |
| tuple/tuple/4/apply.replace             |          1,042.84 (91.04) |         1,164.29 (125.99) | +11.65% |    +2.83% (4.67 pp) |
| tuple/projection/4/apply.duplicate      |             579.83 (56.9) |            670.85 (69.28) | +15.70% |   +7.70% (23.52 pp) |
| tuple/tuple/4/apply.duplicate           |            581.16 (47.46) |            656.83 (41.56) | +13.02% |  +13.02% (19.03 pp) |
| tuple/projection/4/merge.duplicate      |            746.74 (62.37) |             797.73 (18.9) |  +6.83% |   +5.54% (15.91 pp) |
| tuple/tuple/4/merge.duplicate           |             769.91 (6.58) |            788.78 (29.99) |  +2.45% |    +1.23% (8.07 pp) |
| tuple/projection/4/length               |              28.23 (1.46) |             26.46 (20.16) |  -6.25% |   -5.96% (31.58 pp) |
| tuple/tuple/4/length                    |              26.03 (2.13) |             26.57 (19.38) |  +2.07% |   -4.13% (57.97 pp) |
| tuple/projection/4/value.random         |              44.26 (0.29) |              41.56 (2.37) |  -6.11% |    -6.20% (4.37 pp) |
| tuple/tuple/4/value.random              |              21.55 (8.07) |              18.67 (1.13) | -13.33% |  -16.62% (21.06 pp) |
| tuple/projection/4/values               |             157.5 (73.83) |            158.02 (47.92) |  +0.33% |  -26.92% (40.23 pp) |
| tuple/tuple/4/values                    |             150.76 (63.6) |            146.01 (36.26) |  -3.15% |   -28.80% (45.5 pp) |
| tuple/projection/4/sequence             |           462.25 (141.12) |            482.35 (30.25) |  +4.35% |    -4.03% (28.3 pp) |
| tuple/tuple/4/sequence                  |           663.22 (154.88) |            536.73 (66.71) | -19.07% |  -11.74% (19.94 pp) |
| tuple/projection/8/create.empty         |           425.33 (113.83) |            429.37 (15.89) |  +0.95% |   -2.61% (29.64 pp) |
| tuple/tuple/8/create.empty              |            472.76 (59.46) |             462.24 (9.38) |  -2.23% |   -2.37% (15.48 pp) |
| tuple/projection/8/create.sequence      |         2,388.87 (189.22) |          2,297.88 (65.26) |  -3.81% |    -5.04% (9.25 pp) |
| tuple/tuple/8/create.sequence           |         2,080.45 (237.78) |          2,094.76 (66.18) |  +0.69% |    +0.56% (8.09 pp) |
| tuple/projection/8/replace.random       |          1,159.99 (45.38) |          1,206.54 (99.71) |  +4.01% |    +4.91% (5.33 pp) |
| tuple/tuple/8/replace.random            |           652.97 (150.45) |            655.68 (30.36) |  +0.41% |    -7.71% (7.82 pp) |
| tuple/projection/8/apply.replace        |          1,792.92 (84.24) |           1,843.5 (10.08) |  +2.82% |    +2.78% (11.2 pp) |
| tuple/tuple/8/apply.replace             |            992.64 (56.67) |          1,052.12 (81.44) |  +5.99% |     +5.95% (4.3 pp) |
| tuple/projection/8/apply.duplicate      |           556.93 (130.61) |            630.36 (34.53) | +13.18% |   +5.82% (13.29 pp) |
| tuple/tuple/8/apply.duplicate           |            561.35 (46.07) |               637.73 (33) | +13.61% |   +10.89% (2.87 pp) |
| tuple/projection/8/merge.duplicate      |          1,059.22 (39.82) |          1,136.69 (54.79) |  +7.31% |    +5.28% (5.08 pp) |
| tuple/tuple/8/merge.duplicate           |          1,111.88 (72.46) |         1,123.36 (113.22) |  +1.03% |   +7.51% (18.31 pp) |
| tuple/projection/8/length               |               29.8 (4.09) |             26.28 (18.01) | -11.81% |  -33.75% (63.73 pp) |
| tuple/tuple/8/length                    |              28.97 (6.57) |             25.88 (17.89) | -10.66% |  -24.12% (46.42 pp) |
| tuple/projection/8/value.random         |              55.84 (8.79) |              52.02 (5.96) |  -6.84% |    -9.97% (3.56 pp) |
| tuple/tuple/8/value.random              |              19.56 (3.07) |              18.61 (0.43) |  -4.83% |    -4.83% (7.37 pp) |
| tuple/projection/8/values               |            233.64 (20.14) |            215.37 (12.06) |  -7.82% |   -11.07% (18.6 pp) |
| tuple/tuple/8/values                    |            213.27 (17.97) |             207.6 (25.16) |  -2.66% |  -10.43% (14.66 pp) |
| tuple/projection/8/sequence             |            648.71 (11.35) |            636.97 (41.38) |  -1.81% |    -2.87% (4.67 pp) |
| tuple/tuple/8/sequence                  |           711.08 (119.34) |             673.88 (72.6) |  -5.23% |    -5.23% (5.33 pp) |
| tuple/projection/100/create.empty       |            474.82 (40.52) |            442.97 (29.26) |  -6.71% |    -2.11% (5.89 pp) |
| tuple/tuple/100/create.empty            |             483.62 (8.44) |            485.91 (70.64) |  +0.47% |    +0.68% (14.9 pp) |
| tuple/projection/100/create.sequence    |        14,341.02 (539.12) |      14,410.55 (1,640.09) |  +0.48% |   +6.16% (10.87 pp) |
| tuple/tuple/100/create.sequence         |         11,941.82 (438.5) |      11,838.74 (2,356.23) |  -0.86% |    +2.30% (6.38 pp) |
| tuple/projection/100/replace.random     |         1,273.15 (353.53) |         1,229.17 (164.89) |  -3.45% |   -3.50% (17.37 pp) |
| tuple/tuple/100/replace.random          |            708.23 (69.22) |            644.18 (86.44) |  -9.04% |   -5.05% (11.78 pp) |
| tuple/projection/100/apply.replace      |          1,836.38 (71.25) |          1,778.75 (67.11) |  -3.14% |    -4.47% (5.99 pp) |
| tuple/tuple/100/apply.replace           |            990.76 (62.76) |          1,053.53 (42.11) |  +6.34% |   +1.85% (15.74 pp) |
| tuple/projection/100/apply.duplicate    |            571.89 (56.91) |            654.79 (30.15) | +14.50% |    +8.49% (24.1 pp) |
| tuple/tuple/100/apply.duplicate         |            579.41 (33.33) |             636.53 (59.3) |  +9.86% |    +6.89% (11.5 pp) |
| tuple/projection/100/merge.duplicate    |         8,883.65 (201.99) |         9,440.09 (505.19) |  +6.26% |    +6.26% (5.27 pp) |
| tuple/tuple/100/merge.duplicate         |         12,840.21 (907.5) |        13,361.08 (337.52) |  +4.06% |    -1.60% (7.77 pp) |
| tuple/projection/100/length             |              28.53 (2.75) |             27.32 (18.66) |  -4.24% |  -12.31% (57.63 pp) |
| tuple/tuple/100/length                  |              28.11 (2.55) |             29.78 (23.75) |  +5.94% |   +4.70% (84.72 pp) |
| tuple/projection/100/value.random       |              79.63 (3.48) |              77.1 (12.29) |  -3.17% |   -3.17% (17.72 pp) |
| tuple/tuple/100/value.random            |              19.26 (1.16) |              19.26 (2.59) |  +0.01% |   +1.89% (11.27 pp) |
| tuple/projection/100/values             |            2,057.8 (90.7) |          1,869.43 (51.12) |  -9.15% |    -5.26% (6.44 pp) |
| tuple/tuple/100/values                  |         1,623.74 (242.54) |         1,555.34 (127.36) |  -4.21% |   -7.88% (17.63 pp) |
| tuple/projection/100/sequence           |         6,390.81 (291.31) |         6,574.17 (650.79) |  +2.87% |    +1.95% (8.24 pp) |
| tuple/tuple/100/sequence                |         5,779.96 (556.32) |         5,916.14 (353.57) |  +2.36% |    +6.01% (5.08 pp) |

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

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_21_words`. No external competitor was run.
