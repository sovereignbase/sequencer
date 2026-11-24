# Rejected array-key slots

5 complete matched runs per build. Before: baseline; candidate: narrow. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 54 timing medians improve over 5%; 76 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |             Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | --------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |           845.31 (119.83) |              824.44 (33.05) |  -2.47% |   -2.47% (25.01 pp) |
| throughput/1000/apply.duplicate         |            838.56 (18.92) |               883.4 (15.77) |  +5.35% |    +5.35% (6.63 pp) |
| throughput/5000/apply.duplicate         |            393.06 (37.56) |              389.83 (13.03) |  -0.82% |    -5.12% (4.52 pp) |
| throughput/10000/apply.duplicate        |            368.28 (13.46) |              370.54 (16.81) |  +0.61% |    +4.37% (4.74 pp) |
| throughput/15000/apply.duplicate        |             334.31 (20.6) |               326.15 (8.75) |  -2.44% |    -3.53% (9.36 pp) |
| throughput/20000/apply.duplicate        |            323.27 (18.89) |               343.14 (27.3) |  +6.15% |  +11.38% (13.08 pp) |
| throughput/25000/apply.duplicate        |            327.23 (11.56) |              347.35 (30.29) |  +6.15% |   +0.32% (14.38 pp) |
| throughput/100/apply.duplicateRemove    |         1,711.57 (345.07) |           1,488.89 (134.57) | -13.01% |    -6.31% (8.17 pp) |
| throughput/1000/apply.duplicateRemove   |            853.16 (24.66) |              878.33 (11.41) |  +2.95% |    +4.13% (7.53 pp) |
| throughput/5000/apply.duplicateRemove   |            791.72 (63.22) |               769.65 (4.15) |  -2.79% |   -2.98% (13.69 pp) |
| throughput/10000/apply.duplicateRemove  |            722.59 (18.07) |               767.34 (9.34) |  +6.19% |     +8.32% (6.6 pp) |
| throughput/15000/apply.duplicateRemove  |            672.76 (59.67) |              733.02 (45.28) |  +8.96% |    +4.40% (7.15 pp) |
| throughput/20000/apply.duplicateRemove  |             689.92 (30.1) |              745.78 (29.55) |  +8.10% |     +8.92% (3.9 pp) |
| throughput/25000/apply.duplicateRemove  |            708.57 (34.52) |              718.47 (44.29) |  +1.40% |    +0.60% (7.82 pp) |
| throughput/100/apply.duplicateReplace   |         1,171.54 (123.88) |           1,104.32 (187.11) |  -5.74% |   -6.50% (12.15 pp) |
| throughput/1000/apply.duplicateReplace  |          1,141.63 (256.9) |            1,118.74 (19.23) |  -2.01% |   -2.01% (20.88 pp) |
| throughput/5000/apply.duplicateReplace  |            975.63 (76.65) |              946.25 (18.42) |  -3.01% |    -4.17% (3.28 pp) |
| throughput/10000/apply.duplicateReplace |            910.96 (48.25) |              927.01 (96.86) |  +1.76% |   +5.35% (15.74 pp) |
| throughput/15000/apply.duplicateReplace |            869.28 (39.92) |              887.19 (34.26) |  +2.06% |    +2.20% (8.23 pp) |
| throughput/20000/apply.duplicateReplace |             845.6 (23.22) |              914.33 (30.84) |  +8.13% |    +5.97% (3.28 pp) |
| throughput/25000/apply.duplicateReplace |            848.51 (44.24) |              880.13 (53.86) |  +3.73% |   +0.88% (12.74 pp) |
| throughput/100/apply.insert             |         1,716.89 (284.36) |             1,686.1 (44.92) |  -1.79% |    -1.79% (9.79 pp) |
| throughput/1000/apply.insert            |            1,439.5 (32.6) |               1,398 (84.58) |  -2.88% |    +1.62% (8.93 pp) |
| throughput/5000/apply.insert            |         1,360.23 (112.47) |           1,376.25 (117.46) |  +1.18% |    -3.11% (5.92 pp) |
| throughput/10000/apply.insert           |          1,294.77 (94.93) |            1,405.02 (39.35) |  +8.52% |    +8.12% (2.43 pp) |
| throughput/15000/apply.insert           |         1,297.12 (129.14) |            1,365.89 (94.27) |  +5.30% |    +5.30% (7.77 pp) |
| throughput/20000/apply.insert           |          1,191.36 (59.38) |           1,324.88 (123.76) | +11.21% |  +13.38% (10.64 pp) |
| throughput/25000/apply.insert           |             1,292 (13.94) |             1,311.73 (95.4) |  +1.53% |    +6.80% (9.53 pp) |
| throughput/100/apply.remove             |           1,952.34 (77.8) |            1,834.01 (29.52) |  -6.06% |    -4.28% (3.25 pp) |
| throughput/1000/apply.remove            |          1,511.43 (59.56) |            1,583.98 (28.71) |  +4.80% |    +5.79% (1.38 pp) |
| throughput/5000/apply.remove            |              1,626 (15.2) |            1,544.52 (50.64) |  -5.01% |    -4.16% (3.58 pp) |
| throughput/10000/apply.remove           |          1,589.38 (82.93) |             1,544.8 (106.3) |  -2.80% |    -1.15% (7.07 pp) |
| throughput/15000/apply.remove           |         1,543.32 (101.19) |            1,701.4 (337.29) | +10.24% |   +10.42% (7.78 pp) |
| throughput/20000/apply.remove           |          1,584.37 (32.93) |           1,582.71 (114.66) |  -0.10% |    +4.00% (2.81 pp) |
| throughput/25000/apply.remove           |           1,644.04 (70.6) |           1,591.83 (167.04) |  -3.18% |    +1.86% (8.53 pp) |
| throughput/100/apply.replace            |          2,715.35 (82.35) |              2,684.79 (171) |  -1.13% |    +0.89% (1.29 pp) |
| throughput/1000/apply.replace           |          2,731.14 (47.52) |           2,757.75 (111.12) |  +0.97% |    +0.97% (2.46 pp) |
| throughput/5000/apply.replace           |          2,841.99 (30.52) |            2,771.83 (36.34) |  -2.47% |    -2.47% (2.34 pp) |
| throughput/10000/apply.replace          |          2,733.38 (83.91) |           2,853.46 (220.85) |  +4.39% |   +4.39% (11.97 pp) |
| throughput/15000/apply.replace          |         2,901.14 (187.31) |           2,931.76 (882.81) |  +1.06% |   +9.23% (20.75 pp) |
| throughput/20000/apply.replace          |          2,680.24 (67.75) |           2,743.67 (359.01) |  +2.37% |   +3.20% (14.25 pp) |
| throughput/25000/apply.replace          |         2,724.03 (204.04) |            2,828.62 (87.15) |  +3.84% |   -2.12% (10.18 pp) |
| throughput/100/create.empty             |            567.08 (76.16) |              539.12 (41.23) |  -4.93% |    -4.93% (4.98 pp) |
| throughput/1000/create.empty            |            644.48 (51.77) |              705.36 (60.09) |  +9.45% |   +9.28% (10.14 pp) |
| throughput/5000/create.empty            |            759.95 (55.11) |              746.64 (56.45) |  -1.75% |    -1.01% (5.44 pp) |
| throughput/10000/create.empty           |           682.61 (100.34) |               780.69 (44.3) | +14.37% |  +15.66% (29.53 pp) |
| throughput/15000/create.empty           |           774.78 (151.47) |             785.02 (165.21) |  +1.32% |   -3.04% (29.73 pp) |
| throughput/20000/create.empty           |            724.56 (59.27) |              719.36 (77.42) |  -0.72% |   -3.94% (15.11 pp) |
| throughput/25000/create.empty           |           647.46 (221.59) |              758.25 (80.26) | +17.11% |   +6.77% (34.14 pp) |
| throughput/100/create.sequence          |          1,632.11 (212.5) |           1,500.18 (203.97) |  -8.08% |   -12.42% (2.33 pp) |
| throughput/1000/create.sequence         |         1,852.14 (127.21) |             1,849.41 (46.2) |  -0.15% |    -5.76% (8.27 pp) |
| throughput/5000/create.sequence         |          1,513.65 (25.01) |           1,557.85 (262.74) |  +2.92% |   +4.72% (14.18 pp) |
| throughput/10000/create.sequence        |         1,704.86 (157.25) |           1,574.89 (322.77) |  -7.62% |   -7.62% (31.01 pp) |
| throughput/15000/create.sequence        |           1,469.44 (9.32) |              1,438.02 (126) |  -2.14% |    -3.38% (9.29 pp) |
| throughput/20000/create.sequence        |         1,685.52 (237.48) |           1,509.14 (138.81) | -10.46% |   -11.67% (5.99 pp) |
| throughput/25000/create.sequence        |          1,430.2 (158.52) |           1,445.19 (138.61) |  +1.05% |    -1.62% (4.21 pp) |
| throughput/100/insert.head              |            557.08 (59.26) |               530.9 (18.53) |  -4.70% |   -9.76% (17.55 pp) |
| throughput/1000/insert.head             |            553.68 (29.61) |               537.55 (6.82) |  -2.91% |    -2.84% (4.93 pp) |
| throughput/5000/insert.head             |             593.2 (59.91) |              498.28 (21.93) | -16.00% |   -16.16% (8.85 pp) |
| throughput/10000/insert.head            |            521.22 (20.14) |             566.13 (157.04) |  +8.62% |   +8.25% (35.07 pp) |
| throughput/15000/insert.head            |            575.24 (64.93) |               551.9 (82.87) |  -4.06% |   -4.06% (26.73 pp) |
| throughput/20000/insert.head            |            579.02 (20.53) |               511.7 (20.46) | -11.63% |  -12.47% (23.93 pp) |
| throughput/25000/insert.head            |            492.98 (45.48) |               509.2 (14.95) |  +3.29% |    +0.83% (12.8 pp) |
| throughput/100/insert.middle            |            620.85 (39.11) |              588.18 (74.12) |  -5.26% |     -4.49% (6.5 pp) |
| throughput/1000/insert.middle           |            661.22 (35.84) |               644.75 (2.82) |  -2.49% |    -2.40% (6.38 pp) |
| throughput/5000/insert.middle           |               632 (48.89) |               640.41 (19.7) |  +1.33% |    +1.33% (2.18 pp) |
| throughput/10000/insert.middle          |             626.6 (48.29) |             642.18 (147.44) |  +2.49% |  +12.63% (23.49 pp) |
| throughput/15000/insert.middle          |            559.77 (48.19) |               581.9 (24.09) |  +3.95% |   +4.21% (11.42 pp) |
| throughput/20000/insert.middle          |            693.67 (89.62) |               593.5 (36.16) | -14.44% |   -10.15% (6.01 pp) |
| throughput/25000/insert.middle          |            574.33 (19.76) |              588.39 (35.28) |  +2.45% |    +0.12% (6.73 pp) |
| throughput/100/insert.random            |           919.27 (121.05) |              847.75 (30.71) |  -7.78% |   +0.50% (13.31 pp) |
| throughput/1000/insert.random           |             920.24 (4.81) |               928.8 (95.06) |  +0.93% |   +1.96% (11.02 pp) |
| throughput/5000/insert.random           |            928.48 (99.93) |             963.71 (117.51) |  +3.79% |     +5.89% (1.2 pp) |
| throughput/10000/insert.random          |            914.05 (29.33) |           1,050.29 (106.16) | +14.91% |  +13.94% (13.98 pp) |
| throughput/15000/insert.random          |            868.96 (66.68) |               900.4 (38.44) |  +3.62% |    +5.81% (3.32 pp) |
| throughput/20000/insert.random          |            926.92 (106.5) |              945.61 (50.22) |  +2.02% |   -2.29% (22.69 pp) |
| throughput/25000/insert.random          |            897.91 (75.27) |               852.4 (77.27) |  -5.07% |   +0.81% (15.83 pp) |
| throughput/100/insert.sameIndex         |           590.88 (110.06) |             598.89 (135.48) |  +1.36% |   +6.03% (21.45 pp) |
| throughput/1000/insert.sameIndex        |            591.56 (10.62) |               580.47 (8.33) |  -1.87% |    -2.12% (3.64 pp) |
| throughput/5000/insert.sameIndex        |             559.6 (33.95) |              565.63 (70.69) |  +1.08% |    +1.13% (6.63 pp) |
| throughput/10000/insert.sameIndex       |             571.88 (73.3) |              580.63 (79.95) |  +1.53% |    +8.82% (9.06 pp) |
| throughput/15000/insert.sameIndex       |             568.8 (35.92) |              533.48 (99.47) |  -6.21% |   -4.70% (11.14 pp) |
| throughput/20000/insert.sameIndex       |            543.55 (22.68) |             574.66 (266.05) |  +5.72% |   +6.38% (24.45 pp) |
| throughput/25000/insert.sameIndex       |            518.02 (75.29) |               515.31 (3.53) |  -0.52% |   +0.43% (13.07 pp) |
| throughput/100/insert.tail              |            941.92 (86.65) |              790.06 (28.56) | -16.12% |   -8.97% (11.04 pp) |
| throughput/1000/insert.tail             |            937.91 (165.6) |              859.97 (111.3) |  -8.31% |     +1.90% (8.1 pp) |
| throughput/5000/insert.tail             |            922.74 (31.71) |              972.31 (52.19) |  +5.37% |    +7.55% (5.66 pp) |
| throughput/10000/insert.tail            |           837.52 (206.16) |             920.67 (133.18) |  +9.93% |    -0.20% (2.94 pp) |
| throughput/15000/insert.tail            |            851.62 (34.66) |              746.61 (252.1) | -12.33% |    +3.62% (28.7 pp) |
| throughput/20000/insert.tail            |           1,000.8 (95.74) |              869.4 (153.56) | -13.13% |   -0.10% (23.81 pp) |
| throughput/25000/insert.tail            |            919.41 (62.83) |             912.98 (163.38) |  -0.70% |   -2.64% (21.26 pp) |
| throughput/100/length                   |            121.78 (24.49) |              131.83 (24.75) |  +8.25% |   +8.25% (25.33 pp) |
| throughput/1000/length                  |            116.88 (10.63) |               112.79 (8.32) |  -3.50% |     +1.22% (9.1 pp) |
| throughput/5000/length                  |              117.97 (3.8) |               113.08 (9.26) |  -4.15% |   -6.41% (11.09 pp) |
| throughput/10000/length                 |             122.15 (4.15) |               118.48 (8.31) |  -3.00% |   -3.38% (10.76 pp) |
| throughput/15000/length                 |             104.37 (6.24) |                114.97 (9.3) | +10.16% |    +6.86% (4.86 pp) |
| throughput/20000/length                 |             124.92 (5.21) |              123.47 (50.95) |  -1.16% |   +7.21% (40.61 pp) |
| throughput/25000/length                 |             114.55 (8.07) |               106.07 (4.35) |  -7.40% |     -8.97% (4.9 pp) |
| throughput/100/merge.duplicate          |           829.96 (111.83) |              843.51 (58.63) |  +1.63% |    -3.16% (6.51 pp) |
| throughput/1000/merge.duplicate         |            678.88 (31.33) |              683.35 (27.19) |  +0.66% |     +2.31% (5.5 pp) |
| throughput/5000/merge.duplicate         |            645.63 (21.62) |             658.71 (151.34) |  +2.03% |   +0.65% (18.49 pp) |
| throughput/10000/merge.duplicate        |            649.86 (31.19) |             655.91 (274.37) |  +0.93% |   -1.78% (46.09 pp) |
| throughput/15000/merge.duplicate        |            617.46 (45.58) |              604.26 (35.55) |  -2.14% |    -3.69% (2.74 pp) |
| throughput/20000/merge.duplicate        |              603.43 (5.2) |               576.45 (45.6) |  -4.47% |       -5.22% (9 pp) |
| throughput/25000/merge.duplicate        |            624.34 (37.42) |              575.17 (17.91) |  -7.88% |    -9.61% (7.78 pp) |
| throughput/100/merge.insert             |          1,992.84 (289.8) |           1,752.57 (242.38) | -12.06% |    +0.08% (6.56 pp) |
| throughput/1000/merge.insert            |         1,517.76 (128.68) |           1,625.64 (184.18) |  +7.11% |    +8.17% (7.72 pp) |
| throughput/5000/merge.insert            |         1,584.71 (178.52) |           1,578.14 (298.38) |  -0.41% |   +3.32% (12.52 pp) |
| throughput/10000/merge.insert           |          1,581.74 (83.17) |            1,561.54 (72.15) |  -1.28% |    +2.77% (9.93 pp) |
| throughput/15000/merge.insert           |          1,435.45 (38.63) |           1,644.37 (366.01) | +14.55% |   +1.03% (21.24 pp) |
| throughput/20000/merge.insert           |         1,511.54 (107.21) |            1,592.28 (66.72) |  +5.34% |    +3.83% (3.45 pp) |
| throughput/25000/merge.insert           |         1,336.23 (110.08) |           1,396.09 (152.25) |  +4.48% |   +1.26% (11.38 pp) |
| throughput/100/remove.head              |              797.8 (55.5) |              744.44 (74.02) |  -6.69% |    -6.92% (3.73 pp) |
| throughput/1000/remove.head             |            797.83 (11.31) |               789.63 (72.9) |  -1.03% |   -1.03% (11.33 pp) |
| throughput/5000/remove.head             |               822 (50.51) |              873.18 (34.75) |  +6.23% |    +1.47% (8.25 pp) |
| throughput/10000/remove.head            |            908.03 (32.19) |             888.82 (106.32) |  -2.12% |   -2.12% (24.31 pp) |
| throughput/15000/remove.head            |           977.29 (145.09) |             840.65 (108.62) | -13.98% |   -1.93% (27.18 pp) |
| throughput/20000/remove.head            |            987.51 (50.85) |              889.36 (18.51) |  -9.94% |    -6.71% (6.36 pp) |
| throughput/25000/remove.head            |         1,033.14 (585.45) |              930.81 (59.74) |  -9.90% |  -13.41% (40.44 pp) |
| throughput/100/remove.middle            |            826.71 (74.55) |              727.94 (27.93) | -11.95% |    -6.82% (5.94 pp) |
| throughput/1000/remove.middle           |            827.65 (19.14) |                 805 (23.35) |  -2.74% |     -0.55% (7.1 pp) |
| throughput/5000/remove.middle           |             849.74 (44.2) |             880.16 (145.42) |  +3.58% |    +7.54% (7.62 pp) |
| throughput/10000/remove.middle          |            887.31 (61.92) |              896.33 (61.65) |  +1.02% |    +2.28% (7.66 pp) |
| throughput/15000/remove.middle          |            937.44 (46.32) |              944.01 (30.94) |  +0.70% |   -4.41% (19.83 pp) |
| throughput/20000/remove.middle          |            879.47 (45.03) |            1,013.58 (11.53) | +15.25% |   +14.76% (1.94 pp) |
| throughput/25000/remove.middle          |           948.92 (103.94) |              915.26 (80.47) |  -3.55% |   -3.55% (11.81 pp) |
| throughput/100/remove.random            |          1,073.75 (95.39) |             985.24 (179.63) |  -8.24% |   -0.26% (18.28 pp) |
| throughput/1000/remove.random           |          1,257.76 (84.04) |            1,208.17 (48.64) |  -3.94% |    -2.37% (6.29 pp) |
| throughput/5000/remove.random           |          1,200.36 (23.95) |              1,190.48 (172) |  -0.82% |   +4.12% (16.31 pp) |
| throughput/10000/remove.random          |          1,247.01 (27.97) |              1,286 (126.01) |  +3.13% |    +0.44% (4.11 pp) |
| throughput/15000/remove.random          |          1,191.29 (45.17) |            1,245.8 (132.68) |  +4.58% |   +4.96% (10.95 pp) |
| throughput/20000/remove.random          |          1,360.53 (61.34) |             1,276.8 (28.32) |  -6.15% |    -4.35% (7.03 pp) |
| throughput/25000/remove.random          |         1,225.71 (305.56) |           1,260.48 (105.62) |  +2.84% |   -2.30% (23.89 pp) |
| throughput/100/remove.sameIndex         |         1,001.19 (106.31) |           1,004.76 (295.85) |  +0.36% |   +0.36% (19.06 pp) |
| throughput/1000/remove.sameIndex        |             824.27 (8.27) |              845.13 (14.69) |  +2.53% |    +2.83% (1.05 pp) |
| throughput/5000/remove.sameIndex        |            834.93 (38.83) |             944.67 (499.18) | +13.14% |  +19.15% (53.18 pp) |
| throughput/10000/remove.sameIndex       |            844.68 (32.08) |              846.85 (56.62) |  +0.26% |    -1.91% (3.84 pp) |
| throughput/15000/remove.sameIndex       |           868.48 (103.77) |              880.15 (118.6) |  +1.34% |   -4.20% (22.33 pp) |
| throughput/20000/remove.sameIndex       |            911.48 (75.05) |               968.57 (20.4) |  +6.26% |    +2.71% (9.81 pp) |
| throughput/25000/remove.sameIndex       |           937.26 (192.42) |              897.59 (90.94) |  -4.23% |   -6.95% (17.39 pp) |
| throughput/100/remove.tail              |            826.47 (66.77) |             731.12 (165.03) | -11.54% |   +0.47% (23.57 pp) |
| throughput/1000/remove.tail             |            729.99 (44.91) |              723.73 (30.46) |  -0.86% |    -1.20% (6.09 pp) |
| throughput/5000/remove.tail             |            742.38 (53.37) |              773.54 (98.72) |  +4.20% |    +5.29% (5.41 pp) |
| throughput/10000/remove.tail            |             797.61 (58.3) |              761.98 (51.76) |  -4.47% |     -3.41% (4.3 pp) |
| throughput/15000/remove.tail            |            776.81 (10.09) |              862.04 (62.27) | +10.97% |   +11.52% (8.91 pp) |
| throughput/20000/remove.tail            |         877.58 (1,145.54) |               807.57 (50.1) |  -7.98% |   -6.30% (71.78 pp) |
| throughput/25000/remove.tail            |            815.84 (46.46) |              814.93 (56.64) |  -0.11% |     +2.13% (3.5 pp) |
| throughput/100/replace.head             |         1,042.02 (168.99) |           1,045.37 (122.51) |  +0.32% |   +3.56% (11.67 pp) |
| throughput/1000/replace.head            |           1,191.19 (7.15) |             1,193.23 (23.2) |  +0.17% |    +1.43% (3.04 pp) |
| throughput/5000/replace.head            |          1,176.35 (19.08) |            1,213.45 (42.58) |  +3.15% |    +3.47% (2.76 pp) |
| throughput/10000/replace.head           |           1,171.88 (58.9) |            1,184.57 (24.19) |  +1.08% |    +0.25% (2.77 pp) |
| throughput/15000/replace.head           |          1,142.74 (98.84) |           1,166.36 (105.76) |  +2.07% |    +2.69% (0.76 pp) |
| throughput/20000/replace.head           |          1,200.01 (64.03) |            1,182.28 (62.99) |  -1.48% |    -0.30% (5.92 pp) |
| throughput/25000/replace.head           |         1,275.91 (101.46) |             1,255.6 (66.48) |  -1.59% |    -2.53% (6.72 pp) |
| throughput/100/replace.middle           |          1,158.22 (80.16) |           1,147.92 (123.92) |  -0.89% |    +1.05% (3.37 pp) |
| throughput/1000/replace.middle          |          1,228.16 (22.94) |            1,216.87 (29.41) |  -0.92% |    +1.45% (3.13 pp) |
| throughput/5000/replace.middle          |          1,210.81 (62.68) |           1,341.48 (710.61) | +10.79% |   +2.77% (61.02 pp) |
| throughput/10000/replace.middle         |          1,229.97 (31.79) |            1,207.74 (14.67) |  -1.81% |    -2.54% (3.96 pp) |
| throughput/15000/replace.middle         |          1,200.27 (35.11) |            1,249.18 (53.25) |  +4.07% |     +4.07% (6.6 pp) |
| throughput/20000/replace.middle         |          1,340.89 (46.92) |           1,278.12 (115.79) |  -4.68% |    -4.68% (6.95 pp) |
| throughput/25000/replace.middle         |          1,331.89 (49.96) |             1,281.7 (39.64) |  -3.77% |    -0.92% (8.22 pp) |
| throughput/100/replace.random           |          1,810.34 (333.9) |            1,599.9 (126.75) | -11.62% |   -5.76% (15.07 pp) |
| throughput/1000/replace.random          |          1,823.89 (29.65) |            1,778.01 (61.11) |  -2.52% |     -2.52% (5.5 pp) |
| throughput/5000/replace.random          |          1,742.49 (94.75) |           1,772.43 (594.99) |  +1.72% |   +2.76% (37.07 pp) |
| throughput/10000/replace.random         |         1,785.31 (131.96) |             1,845.39 (98.3) |  +3.37% |    +3.66% (10.9 pp) |
| throughput/15000/replace.random         |           1,707.19 (6.95) |            1,751.01 (66.36) |  +2.57% |     +1.99% (4.2 pp) |
| throughput/20000/replace.random         |          1,803.62 (90.33) |             1,894.7 (78.63) |  +5.05% |    +7.96% (6.73 pp) |
| throughput/25000/replace.random         |         1,816.91 (110.11) |            1,778.82 (64.65) |  -2.10% |    +2.85% (6.17 pp) |
| throughput/100/replace.sameIndex        |          1,070.6 (103.35) |           1,121.97 (140.72) |  +4.80% |    +6.08% (6.36 pp) |
| throughput/1000/replace.sameIndex       |           1,217.2 (41.56) |             1,159.08 (8.13) |  -4.77% |    -2.83% (6.62 pp) |
| throughput/5000/replace.sameIndex       |          1,120.46 (37.48) |           1,163.86 (205.73) |  +3.87% |    +3.49% (23.6 pp) |
| throughput/10000/replace.sameIndex      |          1,224.09 (77.79) |             1,235.15 (99.7) |  +0.90% |    +0.07% (4.14 pp) |
| throughput/15000/replace.sameIndex      |         1,156.84 (150.92) |           1,144.69 (118.95) |  -1.05% |   -1.05% (22.55 pp) |
| throughput/20000/replace.sameIndex      |          1,270.88 (63.62) |            1,265.81 (47.12) |  -0.40% |    +1.45% (3.39 pp) |
| throughput/25000/replace.sameIndex      |          1,246.93 (14.76) |           1,223.84 (165.54) |  -1.85% |   -1.06% (12.08 pp) |
| throughput/100/replace.tail             |         1,197.49 (157.02) |            1,167.84 (97.89) |  -2.48% |   +3.31% (15.26 pp) |
| throughput/1000/replace.tail            |            1,278 (120.56) |            1,213.59 (12.79) |  -5.04% |    -4.58% (8.87 pp) |
| throughput/5000/replace.tail            |           1,152.96 (12.4) |            1,193.07 (75.49) |  +3.48% |    +3.11% (1.37 pp) |
| throughput/10000/replace.tail           |          1,186.74 (57.18) |            1,207.99 (33.01) |  +1.79% |    -0.74% (4.76 pp) |
| throughput/15000/replace.tail           |          1,231.12 (83.04) |             1,159.7 (56.11) |  -5.80% |    -5.80% (3.55 pp) |
| throughput/20000/replace.tail           |          1,270.56 (87.46) |            1,270.26 (49.49) |  -0.02% |    +1.39% (8.19 pp) |
| throughput/25000/replace.tail           |             1,241.49 (41) |            1,233.5 (142.85) |  -0.64% |   +2.31% (11.08 pp) |
| throughput/100/retire                   |           205.13 (178.05) |             194.17 (120.09) |  -5.34% |  -12.86% (26.65 pp) |
| throughput/1000/retire                  |            224.71 (14.16) |               217.64 (7.75) |  -3.15% |    -5.40% (8.65 pp) |
| throughput/5000/retire                  |              202.9 (3.19) |              228.93 (25.46) | +12.83% |  +14.25% (13.29 pp) |
| throughput/10000/retire                 |             197.08 (6.77) |                205.74 (9.7) |  +4.39% |     +4.39% (8.8 pp) |
| throughput/15000/retire                 |            197.34 (15.97) |               194.12 (4.38) |  -1.63% |    -0.84% (5.83 pp) |
| throughput/20000/retire                 |            190.13 (11.97) |               189.31 (4.85) |  -0.43% |     +0.57% (6.9 pp) |
| throughput/25000/retire                 |             180.75 (1.25) |               195.11 (18.5) |  +7.94% |   +8.59% (10.13 pp) |
| throughput/100/sequence                 |            316.23 (17.24) |              322.39 (72.48) |  +1.95% |   +1.95% (12.34 pp) |
| throughput/1000/sequence                |             316.57 (9.96) |              317.88 (10.62) |  +0.41% |    -4.62% (6.77 pp) |
| throughput/5000/sequence                |             280.04 (6.79) |              286.24 (79.01) |  +2.21% |    +2.21% (35.3 pp) |
| throughput/10000/sequence               |            265.48 (22.69) |              270.81 (12.09) |  +2.01% |    -0.65% (4.26 pp) |
| throughput/15000/sequence               |            265.07 (19.48) |                267.53 (6.3) |  +0.93% |   +5.68% (10.45 pp) |
| throughput/20000/sequence               |            255.24 (35.13) |               270.77 (25.8) |  +6.08% |   +6.37% (15.59 pp) |
| throughput/25000/sequence               |             257.1 (32.57) |              266.65 (34.69) |  +3.71% |   -1.81% (25.42 pp) |
| throughput/100/value.head               |            183.96 (29.11) |               193.41 (9.03) |  +5.14% |  +15.43% (19.84 pp) |
| throughput/1000/value.head              |              169.46 (2.8) |               170.97 (6.06) |  +0.89% |    -1.78% (7.98 pp) |
| throughput/5000/value.head              |              141.3 (4.63) |              152.96 (42.41) |  +8.25% |  +11.37% (33.52 pp) |
| throughput/10000/value.head             |            146.22 (11.01) |               148.41 (9.59) |  +1.50% |    +1.27% (1.52 pp) |
| throughput/15000/value.head             |            146.92 (11.33) |              139.25 (17.11) |  -5.22% |    -5.36% (4.12 pp) |
| throughput/20000/value.head             |             133.82 (9.63) |              144.78 (11.63) |  +8.19% |    +5.35% (8.73 pp) |
| throughput/25000/value.head             |                131.54 (4) |              135.34 (14.48) |  +2.89% |    -0.61% (3.94 pp) |
| throughput/100/value.middle             |            257.35 (11.61) |                 255.07 (32) |  -0.89% |      +8.73% (10 pp) |
| throughput/1000/value.middle            |             268.6 (12.09) |               258.41 (6.76) |  -3.79% |     -4.35% (2.2 pp) |
| throughput/5000/value.middle            |             235.72 (5.35) |              239.89 (42.27) |  +1.77% |    +6.60% (8.54 pp) |
| throughput/10000/value.middle           |            227.42 (20.69) |               228.9 (10.05) |  +0.65% |   -4.66% (13.17 pp) |
| throughput/15000/value.middle           |             223.48 (3.42) |               219.77 (1.34) |  -1.66% |    -2.46% (4.58 pp) |
| throughput/20000/value.middle           |             211.27 (10.5) |              220.95 (20.63) |  +4.58% |    +1.37% (7.45 pp) |
| throughput/25000/value.middle           |            200.96 (15.08) |               218.83 (5.29) |  +8.89% |    +9.13% (9.95 pp) |
| throughput/100/value.random             |             233.06 (19.8) |              218.97 (12.02) |  -6.05% |   -4.39% (25.02 pp) |
| throughput/1000/value.random            |            241.17 (17.88) |              238.52 (13.01) |  -1.10% |   -1.57% (10.75 pp) |
| throughput/5000/value.random            |            288.66 (18.51) |              289.98 (42.17) |  +0.46% |   +2.08% (18.95 pp) |
| throughput/10000/value.random           |            271.09 (22.39) |              269.24 (13.05) |  -0.68% |   -0.68% (18.52 pp) |
| throughput/15000/value.random           |            276.49 (35.63) |              265.77 (13.65) |  -3.88% |    -3.67% (7.65 pp) |
| throughput/20000/value.random           |            292.32 (28.12) |              281.65 (10.54) |  -3.65% |    -2.20% (6.24 pp) |
| throughput/25000/value.random           |               274 (23.33) |              278.87 (14.05) |  +1.78% |   -0.34% (12.85 pp) |
| throughput/100/value.sameIndex          |            200.46 (56.71) |              198.44 (18.43) |  -1.01% |   +1.09% (22.37 pp) |
| throughput/1000/value.sameIndex         |              188.06 (9.4) |               189.59 (4.08) |  +0.81% |     +1.26% (3.2 pp) |
| throughput/5000/value.sameIndex         |             175.05 (2.88) |              177.17 (22.43) |  +1.21% |   +7.86% (15.64 pp) |
| throughput/10000/value.sameIndex        |             168.66 (4.79) |               166.81 (4.71) |  -1.10% |    -2.17% (1.43 pp) |
| throughput/15000/value.sameIndex        |                172 (4.38) |              160.22 (20.32) |  -6.85% |    -8.41% (15.7 pp) |
| throughput/20000/value.sameIndex        |             178.46 (6.88) |              205.62 (46.45) | +15.22% |  +13.97% (22.52 pp) |
| throughput/25000/value.sameIndex        |            184.39 (77.42) |              172.23 (70.73) |  -6.59% |   +2.70% (65.86 pp) |
| throughput/100/value.tail               |            233.24 (21.68) |              243.68 (90.49) |  +4.48% |   +13.12% (8.58 pp) |
| throughput/1000/value.tail              |            216.92 (12.16) |               221.73 (1.62) |  +2.22% |       +1.90% (6 pp) |
| throughput/5000/value.tail              |              193.5 (9.25) |              217.86 (22.32) | +12.59% |   +8.44% (15.28 pp) |
| throughput/10000/value.tail             |              188.33 (3.6) |               187.37 (8.54) |  -0.51% |    +2.60% (2.61 pp) |
| throughput/15000/value.tail             |             191.7 (20.19) |              192.14 (14.96) |  +0.23% |   +8.93% (21.81 pp) |
| throughput/20000/value.tail             |            183.82 (19.31) |               195.07 (10.3) |  +6.12% |   +5.73% (10.74 pp) |
| throughput/25000/value.tail             |            183.76 (14.28) |              183.26 (16.24) |  -0.27% |   +0.80% (17.33 pp) |
| throughput/100/values                   |         5,095.99 (384.91) |           4,902.44 (436.82) |  -3.80% |    +1.23% (10.7 pp) |
| throughput/1000/values                  |     174,607.81 (1,017.88) |       175,803.13 (1,741.15) |  +0.68% |    +0.78% (11.7 pp) |
| throughput/5000/values                  |    543,755.73 (90,295.83) |      595,581.25 (50,358.85) |  +9.53% |  +11.45% (13.54 pp) |
| throughput/10000/values                 | 1,195,860.94 (103,158.59) |   1,229,455.47 (113,059.38) |  +2.81% |   +4.84% (14.22 pp) |
| throughput/15000/values                 |  1,782,551.56 (57,842.19) |   1,940,885.94 (142,998.44) |  +8.88% |    +9.43% (7.06 pp) |
| throughput/20000/values                 | 2,716,109.38 (552,414.06) | 2,981,504.69 (1,464,642.19) |  +9.77% |  +20.11% (12.93 pp) |
| throughput/25000/values                 |    3,198,000 (218,157.81) |   3,688,951.56 (456,351.56) | +15.35% |   +12.61% (8.23 pp) |
| throughput/100/values.head              |            329.06 (34.01) |              338.94 (17.36) |  +3.00% |  +14.79% (24.88 pp) |
| throughput/1000/values.head             |            287.21 (35.96) |               286.3 (12.54) |  -0.32% |   -0.87% (10.94 pp) |
| throughput/5000/values.head             |            294.25 (54.13) |               293.68 (12.3) |  -0.19% |   +4.58% (15.25 pp) |
| throughput/10000/values.head            |            292.13 (22.37) |              262.25 (14.36) | -10.23% |    -7.63% (8.94 pp) |
| throughput/15000/values.head            |            272.08 (27.02) |              262.82 (14.65) |  -3.40% |     -3.69% (7.3 pp) |
| throughput/20000/values.head            |             274.74 (5.92) |              313.78 (30.91) | +14.21% |  +11.71% (10.86 pp) |
| throughput/25000/values.head            |            271.18 (31.54) |             294.69 (177.89) |  +8.67% |  +18.21% (46.03 pp) |
| throughput/100/values.middle            |            341.82 (38.04) |              337.91 (31.91) |  -1.14% |  +11.90% (14.33 pp) |
| throughput/1000/values.middle           |             275.1 (18.44) |               270.53 (14.7) |  -1.66% |    -3.90% (3.72 pp) |
| throughput/5000/values.middle           |            266.73 (45.33) |             290.46 (107.56) |  +8.90% |  +14.39% (31.76 pp) |
| throughput/10000/values.middle          |            257.39 (23.05) |              255.03 (60.04) |  -0.92% |   +3.83% (31.22 pp) |
| throughput/15000/values.middle          |             259.9 (39.76) |               253.9 (19.37) |  -2.31% |    +4.66% (6.77 pp) |
| throughput/20000/values.middle          |            287.98 (72.19) |              267.47 (24.56) |  -7.12% |   -9.40% (14.77 pp) |
| throughput/25000/values.middle          |            249.74 (16.32) |              264.66 (37.63) |  +5.97% |  +13.69% (22.46 pp) |
| throughput/100/values.random            |            315.45 (18.73) |               314.3 (27.69) |  -0.36% |     +0.51% (9.5 pp) |
| throughput/1000/values.random           |            307.69 (15.46) |              300.68 (10.93) |  -2.28% |    -5.73% (5.97 pp) |
| throughput/5000/values.random           |            339.39 (30.99) |              574.21 (353.1) | +69.19% | +80.55% (114.58 pp) |
| throughput/10000/values.random          |            417.24 (55.84) |              380.23 (50.36) |  -8.87% |   -11.03% (2.14 pp) |
| throughput/15000/values.random          |            357.67 (52.43) |              393.67 (22.58) | +10.07% |   +7.57% (13.31 pp) |
| throughput/20000/values.random          |            390.64 (73.62) |              422.93 (67.73) |  +8.27% |   +6.43% (41.32 pp) |
| throughput/25000/values.random          |             380.8 (56.68) |              433.12 (19.74) | +13.74% |  +17.16% (20.05 pp) |
| throughput/100/values.sameIndex         |            314.73 (33.21) |               320.49 (13.1) |  +1.83% |   +0.19% (11.87 pp) |
| throughput/1000/values.sameIndex        |            290.27 (18.07) |               279.12 (9.12) |  -3.84% |    -3.41% (0.85 pp) |
| throughput/5000/values.sameIndex        |            279.83 (16.34) |              298.41 (24.97) |  +6.64% |    +6.64% (2.26 pp) |
| throughput/10000/values.sameIndex       |              244.26 (4.8) |               273.3 (26.08) | +11.89% |   +11.26% (7.29 pp) |
| throughput/15000/values.sameIndex       |            249.35 (10.75) |              279.52 (51.22) | +12.10% |   -0.44% (18.81 pp) |
| throughput/20000/values.sameIndex       |            259.13 (47.63) |               266.09 (29.2) |  +2.69% |   -0.95% (10.73 pp) |
| throughput/25000/values.sameIndex       |              248.79 (9.7) |              260.32 (10.17) |  +4.63% |   +3.00% (14.75 pp) |
| throughput/100/values.tail              |            301.53 (10.37) |              321.76 (13.57) |  +6.71% |   +6.71% (11.01 pp) |
| throughput/1000/values.tail             |            292.61 (33.19) |               265.69 (8.82) |  -9.20% |   -9.20% (10.61 pp) |
| throughput/5000/values.tail             |             279.46 (4.05) |              271.86 (61.09) |  -2.72% |   -2.72% (26.96 pp) |
| throughput/10000/values.tail            |            251.86 (16.64) |              268.81 (18.29) |  +6.73% |    +5.90% (6.06 pp) |
| throughput/15000/values.tail            |             239.71 (42.1) |             241.32 (145.95) |  +0.67% |    +0.67% (78.5 pp) |
| throughput/20000/values.tail            |            223.29 (40.26) |              265.18 (12.39) | +18.76% |   +8.69% (12.58 pp) |
| throughput/25000/values.tail            |            243.37 (27.52) |              262.19 (26.88) |  +7.73% |   +12.21% (13.9 pp) |
| lifecycle/scaleUp/apply.random          |          4,037.6 (229.81) |            3,775.18 (55.74) |  -6.50% |    -7.17% (2.14 pp) |
| lifecycle/scaleUp/insert.head           |            875.68 (75.29) |              854.93 (91.62) |  -2.37% |    -9.22% (9.18 pp) |
| lifecycle/scaleUp/insert.random         |         1,883.66 (125.28) |           1,787.14 (114.89) |  -5.12% |    -5.12% (8.52 pp) |
| lifecycle/scaleUp/insert.tail           |           860.38 (112.53) |              760.98 (86.43) | -11.55% |    -2.39% (2.93 pp) |
| lifecycle/scaleUp/remove.random         |         2,940.44 (181.66) |            2,722.78 (41.44) |  -7.40% |    -4.53% (3.71 pp) |
| lifecycle/scaleUp/replace.head          |         2,779.42 (184.43) |           2,434.51 (130.06) | -12.41% |  -13.09% (12.56 pp) |
| lifecycle/scaleUp/replace.random        |         3,741.31 (213.62) |            3,513.29 (66.95) |  -6.09% |    +0.26% (8.77 pp) |
| lifecycle/scaleUp/replace.tail          |          2,410.43 (706.2) |           2,396.03 (303.51) |  -0.60% |   -0.58% (22.84 pp) |
| lifecycle/scaleUp/value.head            |            343.17 (28.33) |              335.18 (18.27) |  -2.33% |   -2.33% (11.79 pp) |
| lifecycle/scaleUp/value.random          |          1,158.36 (86.55) |               1,136.3 (8.5) |  -1.90% |    -1.72% (7.24 pp) |
| lifecycle/scaleUp/value.tail            |             163.25 (3.79) |               156.61 (5.66) |  -4.07% |    -5.45% (1.77 pp) |
| lifecycle/scaleDown/apply.random        |          3,449.77 (55.59) |           3,511.04 (359.04) |  +1.78% |    +1.86% (9.54 pp) |
| lifecycle/scaleDown/insert.random       |          1,717.82 (24.04) |            1,689.08 (16.26) |  -1.67% |    -1.81% (2.33 pp) |
| lifecycle/scaleDown/remove.head         |           1,903.32 (12.3) |            1,919.33 (61.97) |  +0.84% |    -0.28% (1.69 pp) |
| lifecycle/scaleDown/remove.random       |          2,669.44 (65.65) |            2,672.04 (89.71) |  +0.10% |    +0.70% (4.62 pp) |
| lifecycle/scaleDown/remove.tail         |           1,721.7 (46.55) |              1,705.4 (7.26) |  -0.95% |    -1.65% (2.95 pp) |
| lifecycle/scaleDown/replace.head        |             2,560.21 (77) |           2,507.18 (106.12) |  -2.07% |    -2.29% (1.04 pp) |
| lifecycle/scaleDown/replace.random      |           3,550.6 (327.4) |           3,629.21 (200.69) |  +2.21% |    -0.87% (5.42 pp) |
| lifecycle/scaleDown/replace.tail        |        19,272.52 (998.49) |          19,071.24 (343.84) |  -1.04% |    -1.16% (2.64 pp) |
| lifecycle/scaleDown/value.head          |            428.96 (15.85) |              419.83 (29.63) |  -2.13% |    -4.62% (8.39 pp) |
| lifecycle/scaleDown/value.random        |            1,076.6 (8.94) |             1,069.9 (21.22) |  -0.62% |    -2.11% (4.96 pp) |
| lifecycle/scaleDown/value.tail          |            236.58 (13.59) |               234.98 (2.79) |  -0.67% |    -2.66% (7.97 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,743.69 (157.99) |           3,822.91 (199.59) |  +2.12% |    +0.45% (9.35 pp) |
| lifecycle/fullLifecycle/insert.head     |            875.68 (75.29) |              854.93 (91.62) |  -2.37% |    -9.22% (9.18 pp) |
| lifecycle/fullLifecycle/insert.random   |          1,808.09 (99.93) |            1,735.47 (80.43) |  -4.02% |    -3.78% (4.09 pp) |
| lifecycle/fullLifecycle/insert.tail     |           860.38 (112.53) |              760.98 (86.43) | -11.55% |    -2.39% (2.93 pp) |
| lifecycle/fullLifecycle/remove.head     |           1,903.32 (12.3) |            1,919.33 (61.97) |  +0.84% |    -0.28% (1.69 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,818.09 (129.98) |           2,724.92 (118.49) |  -3.31% |    -3.32% (0.26 pp) |
| lifecycle/fullLifecycle/remove.tail     |           1,721.7 (46.55) |              1,705.4 (7.26) |  -0.95% |    -1.65% (2.95 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,621.82 (118.78) |           2,493.01 (131.74) |  -4.91% |    -8.04% (9.75 pp) |
| lifecycle/fullLifecycle/replace.random  |          3,543.51 (47.83) |           3,537.81 (160.04) |  -0.16% |    -0.99% (6.69 pp) |
| lifecycle/fullLifecycle/replace.tail    |        11,150.98 (576.44) |           10,714.02 (32.43) |  -3.92% |    -1.74% (2.82 pp) |
| lifecycle/fullLifecycle/value.head      |             386.07 (6.24) |              383.04 (20.56) |  -0.78% |    -3.46% (9.88 pp) |
| lifecycle/fullLifecycle/value.random    |          1,131.78 (39.19) |             1,103.1 (15.28) |  -2.53% |    -2.53% (2.05 pp) |
| lifecycle/fullLifecycle/value.tail      |             198.36 (8.48) |               197.51 (2.26) |  -0.43% |    -3.81% (5.68 pp) |
| checkpoint/up/1000/create               |           407,900 (9,200) |            419,900 (15,200) |  +2.94% |   +3.58% (12.09 pp) |
| checkpoint/up/1000/sequence             |       2,713,400 (207,400) |          2,700,600 (75,200) |  -0.47% |   +2.66% (10.32 pp) |
| checkpoint/up/1000/values               |       1,919,200 (431,400) |          1,796,600 (25,700) |  -6.39% |   -8.88% (11.34 pp) |
| checkpoint/up/5000/create               |          939,000 (45,700) |            952,100 (51,900) |  +1.40% |     -0.83% (8.1 pp) |
| checkpoint/up/5000/sequence             |       8,907,100 (994,600) |         7,865,400 (691,800) | -11.70% |  -10.90% (13.97 pp) |
| checkpoint/up/5000/values               |       4,855,600 (908,600) |         4,929,300 (454,600) |  +1.52% |    +0.78% (22.3 pp) |
| checkpoint/up/10000/create              |        1,656,200 (90,100) |          1,598,000 (95,600) |  -3.51% |    +1.76% (7.35 pp) |
| checkpoint/up/10000/sequence            |      13,834,300 (260,400) |      13,477,200 (2,269,100) |  -2.58% |   -0.54% (18.69 pp) |
| checkpoint/up/10000/values              |      21,105,800 (636,900) |        20,689,600 (751,700) |  -1.97% |     -2.40% (6.2 pp) |
| checkpoint/up/15000/create              |        2,468,700 (56,600) |         2,413,700 (192,000) |  -2.23% |     -0.53% (4.6 pp) |
| checkpoint/up/15000/sequence            |      15,286,000 (626,600) |        15,296,300 (270,700) |  +0.07% |    -0.19% (3.13 pp) |
| checkpoint/up/15000/values              |      30,578,000 (657,700) |      30,561,600 (1,234,900) |  -0.05% |    +0.35% (2.17 pp) |
| checkpoint/up/20000/create              |       3,423,900 (173,700) |         3,458,600 (118,200) |  +1.01% |    +0.99% (4.95 pp) |
| checkpoint/up/20000/sequence            |    22,743,500 (3,740,400) |      22,393,100 (1,933,500) |  -1.54% |    -1.67% (0.49 pp) |
| checkpoint/up/20000/values              |    11,525,800 (1,823,000) |        10,967,500 (778,500) |  -4.84% |   +4.35% (15.78 pp) |
| checkpoint/up/25000/create              |       4,052,300 (244,900) |         4,009,600 (184,300) |  -1.05% |    -1.05% (2.47 pp) |
| checkpoint/up/25000/sequence            |      24,513,900 (664,300) |      24,161,100 (3,119,100) |  -1.44% |   -0.79% (10.82 pp) |
| checkpoint/up/25000/values              |      12,523,500 (399,300) |        11,823,600 (811,400) |  -5.59% |    -5.18% (4.33 pp) |
| checkpoint/down/20000/create            |        3,422,700 (25,100) |          3,407,500 (71,900) |  -0.44% |    -0.44% (0.31 pp) |
| checkpoint/down/20000/sequence          |      18,903,100 (212,100) |        19,172,900 (229,700) |  +1.43% |    +1.21% (2.52 pp) |
| checkpoint/down/20000/values            |       9,390,200 (486,500) |         9,762,500 (603,100) |  +3.96% |     -1.49% (9.8 pp) |
| checkpoint/down/15000/create            |        2,484,600 (15,200) |          2,431,400 (70,400) |  -2.14% |    -1.72% (2.81 pp) |
| checkpoint/down/15000/sequence          |      16,133,800 (395,900) |        15,998,600 (458,700) |  -0.84% |    +0.54% (1.75 pp) |
| checkpoint/down/15000/values            |       7,088,800 (247,500) |         7,181,200 (938,700) |  +1.30% |    -0.08% (4.87 pp) |
| checkpoint/down/10000/create            |        1,673,200 (14,700) |          1,674,600 (30,600) |  +0.08% |     +0.38% (4.4 pp) |
| checkpoint/down/10000/sequence          |      13,356,700 (432,700) |        12,347,200 (785,300) |  -7.56% |   -4.00% (11.52 pp) |
| checkpoint/down/10000/values            |       5,180,700 (131,400) |          5,730,700 (67,700) | +10.62% |  +11.09% (16.03 pp) |
| checkpoint/down/5000/create             |           787,600 (7,800) |            792,200 (14,200) |  +0.58% |    +0.61% (3.24 pp) |
| checkpoint/down/5000/sequence           |    10,160,900 (1,687,900) |         9,811,600 (432,200) |  -3.44% |   -2.81% (23.66 pp) |
| checkpoint/down/5000/values             |       3,223,800 (381,200) |         3,129,100 (783,600) |  -2.94% |   -4.05% (37.21 pp) |
| checkpoint/down/1000/create             |           162,200 (6,200) |            161,200 (10,100) |  -0.62% |       -2.65% (4 pp) |
| checkpoint/down/1000/sequence           |     6,175,400 (1,088,600) |       5,898,400 (1,752,100) |  -4.49% |  -11.60% (42.38 pp) |
| checkpoint/down/1000/values             |         547,300 (219,900) |           569,700 (158,800) |  +4.09% |   +2.83% (64.28 pp) |
| checkpoint/down/0/create                |            13,800 (1,500) |              14,400 (1,900) |  +4.35% |   -2.99% (19.54 pp) |
| checkpoint/down/0/sequence              |        1,397,000 (72,500) |         1,294,200 (163,700) |  -7.36% |  -10.55% (12.75 pp) |
| checkpoint/down/0/values                |              11,000 (700) |               9,800 (1,000) | -10.91% |  -12.50% (15.93 pp) |
| tuple/projection/2/create.empty         |             357.73 (15.5) |              378.18 (81.62) |  +5.72% |    +5.72% (9.97 pp) |
| tuple/tuple/2/create.empty              |            433.13 (27.83) |              466.26 (51.26) |  +7.65% |    +4.44% (6.44 pp) |
| tuple/projection/2/create.sequence      |          1,229.56 (59.69) |           1,340.74 (108.49) |  +9.04% |    +9.27% (5.49 pp) |
| tuple/tuple/2/create.sequence           |           1,422.76 (4.42) |            1,546.79 (61.99) |  +8.72% |    +7.23% (4.69 pp) |
| tuple/projection/2/replace.random       |            992.51 (55.75) |             1,027.3 (66.97) |  +3.51% |   +0.57% (12.62 pp) |
| tuple/tuple/2/replace.random            |             673.55 (8.74) |               726.1 (49.31) |  +7.80% |    +7.84% (1.85 pp) |
| tuple/projection/2/apply.replace        |         1,748.51 (108.84) |            1,787.82 (67.47) |  +2.25% |    +4.44% (8.85 pp) |
| tuple/tuple/2/apply.replace             |          1,179.98 (28.05) |            1,162.86 (41.18) |  -1.45% |    +0.17% (9.74 pp) |
| tuple/projection/2/apply.duplicate      |            633.24 (14.91) |              655.08 (66.08) |  +3.45% |     +3.44% (8.7 pp) |
| tuple/tuple/2/apply.duplicate           |            665.03 (18.68) |              661.96 (16.09) |  -0.46% |    -0.62% (5.65 pp) |
| tuple/projection/2/merge.duplicate      |             719.14 (6.63) |              689.01 (44.79) |  -4.19% |   -4.19% (10.62 pp) |
| tuple/tuple/2/merge.duplicate           |             690.03 (9.75) |              704.31 (16.38) |  +2.07% |    +2.07% (7.59 pp) |
| tuple/projection/2/length               |               7.65 (0.26) |                 7.75 (0.07) |  +1.21% |    +1.21% (3.54 pp) |
| tuple/tuple/2/length                    |               7.54 (0.12) |                  7.4 (0.16) |  -1.82% |    -1.55% (0.84 pp) |
| tuple/projection/2/value.random         |               30.1 (2.11) |                29.52 (2.01) |  -1.94% |    -5.17% (5.07 pp) |
| tuple/tuple/2/value.random              |              19.28 (0.78) |                 19.88 (3.1) |  +3.11% |   +2.74% (12.42 pp) |
| tuple/projection/2/values               |             78.18 (16.59) |               78.15 (10.94) |  -0.04% |   -0.04% (16.95 pp) |
| tuple/tuple/2/values                    |              81.06 (4.72) |                83.35 (3.98) |  +2.82% |    -0.84% (2.52 pp) |
| tuple/projection/2/sequence             |            464.63 (22.37) |              475.45 (34.68) |  +2.33% |    +1.82% (5.97 pp) |
| tuple/tuple/2/sequence                  |            492.03 (53.47) |              509.53 (51.47) |  +3.56% |   -0.50% (17.11 pp) |
| tuple/projection/4/create.empty         |             421.3 (12.33) |              429.23 (29.16) |  +1.88% |     +1.88% (2.9 pp) |
| tuple/tuple/4/create.empty              |            430.81 (12.74) |              439.84 (18.69) |  +2.10% |    +3.00% (3.99 pp) |
| tuple/projection/4/create.sequence      |          1,665.18 (58.66) |            1,688.4 (162.39) |  +1.39% |    +2.85% (5.89 pp) |
| tuple/tuple/4/create.sequence           |          1,570.58 (25.77) |            1,638.7 (114.46) |  +4.34% |    +5.24% (5.55 pp) |
| tuple/projection/4/replace.random       |          1,149.48 (74.34) |            1,144.45 (101.4) |  -0.44% |   -0.44% (10.85 pp) |
| tuple/tuple/4/replace.random            |            634.02 (15.26) |              671.73 (42.59) |  +5.95% |    +0.38% (10.8 pp) |
| tuple/projection/4/apply.replace        |          1,689.26 (71.62) |             1,712.15 (8.56) |  +1.36% |    +1.46% (2.77 pp) |
| tuple/tuple/4/apply.replace             |           1,077.8 (34.97) |             1,062.23 (82.3) |  -1.44% |    +1.45% (5.74 pp) |
| tuple/projection/4/apply.duplicate      |             583.61 (4.76) |              593.09 (81.26) |  +1.62% |   +1.94% (12.36 pp) |
| tuple/tuple/4/apply.duplicate           |            608.88 (18.18) |              643.68 (88.05) |  +5.71% |      +0.50% (15 pp) |
| tuple/projection/4/merge.duplicate      |            750.48 (13.28) |             907.28 (136.42) | +20.89% |  +20.75% (19.14 pp) |
| tuple/tuple/4/merge.duplicate           |              786.3 (8.46) |              876.45 (93.73) | +11.46% |  +10.08% (15.64 pp) |
| tuple/projection/4/length               |              26.94 (2.19) |                28.22 (2.49) |  +4.74% |   -1.26% (12.63 pp) |
| tuple/tuple/4/length                    |              27.96 (0.76) |                27.51 (2.06) |  -1.60% |   -6.70% (13.77 pp) |
| tuple/projection/4/value.random         |              40.65 (3.13) |                 41.6 (1.57) |  +2.33% |     -4.33% (8.8 pp) |
| tuple/tuple/4/value.random              |              17.88 (0.58) |                18.28 (2.23) |  +2.23% |   +2.23% (17.04 pp) |
| tuple/projection/4/values               |             148.24 (3.93) |               147.86 (4.84) |  -0.26% |    -0.26% (5.93 pp) |
| tuple/tuple/4/values                    |             141.25 (8.76) |                149.82 (2.2) |  +6.07% |    +2.71% (5.45 pp) |
| tuple/projection/4/sequence             |            462.98 (39.88) |              478.45 (44.11) |  +3.34% |   +6.34% (17.17 pp) |
| tuple/tuple/4/sequence                  |            562.58 (53.08) |              558.66 (90.43) |  -0.70% |    -0.70% (2.54 pp) |
| tuple/projection/8/create.empty         |             408.2 (17.75) |              419.73 (43.85) |  +2.83% |   +3.68% (10.65 pp) |
| tuple/tuple/8/create.empty              |              444.8 (9.73) |              521.44 (77.49) | +17.23% |  +11.85% (16.42 pp) |
| tuple/projection/8/create.sequence      |          2,259.99 (15.12) |           2,511.23 (427.76) | +11.12% |  +11.16% (19.51 pp) |
| tuple/tuple/8/create.sequence           |          2,054.32 (82.36) |           2,181.17 (122.17) |  +6.17% |    +6.96% (5.55 pp) |
| tuple/projection/8/replace.random       |           1,160.44 (21.9) |            1,289.06 (161.2) | +11.08% |  +11.21% (11.62 pp) |
| tuple/tuple/8/replace.random            |             647.93 (6.94) |              675.17 (34.52) |  +4.20% |    +3.87% (6.66 pp) |
| tuple/projection/8/apply.replace        |          1,772.32 (64.73) |           1,795.93 (126.87) |  +1.33% |    +3.08% (5.66 pp) |
| tuple/tuple/8/apply.replace             |          1,047.22 (70.82) |             1,011.99 (53.6) |  -3.36% |    +0.44% (8.51 pp) |
| tuple/projection/8/apply.duplicate      |            618.04 (30.48) |              612.72 (19.31) |  -0.86% |     +0.04% (4.3 pp) |
| tuple/tuple/8/apply.duplicate           |             628.61 (0.88) |               614.45 (6.43) |  -2.25% |    -2.67% (4.09 pp) |
| tuple/projection/8/merge.duplicate      |           1,084.6 (32.93) |            1,112.3 (106.52) |  +2.55% |    +5.19% (8.66 pp) |
| tuple/tuple/8/merge.duplicate           |           1,126.52 (7.36) |            1,189.22 (24.55) |  +5.57% |    +5.01% (1.27 pp) |
| tuple/projection/8/length               |              27.61 (0.33) |                28.33 (2.36) |  +2.62% |    +4.79% (4.57 pp) |
| tuple/tuple/8/length                    |              28.17 (0.61) |                27.33 (2.68) |  -2.99% |    -2.99% (7.01 pp) |
| tuple/projection/8/value.random         |              54.65 (2.96) |                 56.4 (1.16) |  +3.20% |    +4.39% (7.67 pp) |
| tuple/tuple/8/value.random              |              18.51 (0.37) |                18.76 (0.33) |  +1.37% |    +1.75% (1.32 pp) |
| tuple/projection/8/values               |             228.97 (8.29) |              235.85 (18.81) |  +3.00% |    -0.03% (5.34 pp) |
| tuple/tuple/8/values                    |              209.75 (8.7) |               212.13 (5.91) |  +1.13% |   +1.96% (10.87 pp) |
| tuple/projection/8/sequence             |             660.1 (12.68) |              660.51 (60.03) |  +0.06% |    -2.07% (4.59 pp) |
| tuple/tuple/8/sequence                  |            680.46 (22.23) |              699.18 (29.99) |  +2.75% |    +1.14% (2.65 pp) |
| tuple/projection/100/create.empty       |             451.8 (18.81) |              456.78 (49.67) |  +1.10% |   -4.32% (12.53 pp) |
| tuple/tuple/100/create.empty            |             466.33 (6.87) |               472.9 (23.35) |  +1.41% |    +2.69% (6.43 pp) |
| tuple/projection/100/create.sequence    |         13,924.02 (56.45) |          14,531.58 (336.05) |  +4.36% |    +4.36% (3.41 pp) |
| tuple/tuple/100/create.sequence         |        11,412.83 (114.47) |          11,664.78 (606.71) |  +2.21% |    +3.40% (5.12 pp) |
| tuple/projection/100/replace.random     |          1,213.02 (94.01) |            1,160.93 (94.78) |  -4.29% |    -4.29% (15.8 pp) |
| tuple/tuple/100/replace.random          |               637 (14.13) |              678.48 (33.81) |  +6.51% |    +5.26% (8.85 pp) |
| tuple/projection/100/apply.replace      |         1,780.87 (128.68) |            1,807.31 (32.25) |  +1.48% |     +1.05% (6.8 pp) |
| tuple/tuple/100/apply.replace           |          1,009.12 (56.56) |              992.15 (11.91) |  -1.68% |    -2.00% (6.81 pp) |
| tuple/projection/100/apply.duplicate    |            599.23 (37.73) |               591.22 (4.67) |  -1.34% |    -1.86% (1.07 pp) |
| tuple/tuple/100/apply.duplicate         |            621.59 (31.79) |              611.48 (49.85) |  -1.63% |    -4.07% (8.12 pp) |
| tuple/projection/100/merge.duplicate    |         9,166.21 (231.36) |            9,120.41 (135.4) |  -0.50% |    -0.08% (3.58 pp) |
| tuple/tuple/100/merge.duplicate         |        13,333.54 (462.84) |          13,260.01 (376.86) |  -0.55% |    -2.32% (5.72 pp) |
| tuple/projection/100/length             |              28.25 (2.65) |                28.34 (0.97) |  +0.32% |      +1.71% (17 pp) |
| tuple/tuple/100/length                  |              27.44 (1.19) |                 27.69 (0.7) |  +0.91% |   -0.97% (13.22 pp) |
| tuple/projection/100/value.random       |              80.95 (1.66) |                78.65 (1.79) |  -2.85% |    +0.69% (4.65 pp) |
| tuple/tuple/100/value.random            |              17.91 (0.44) |                18.31 (2.35) |  +2.23% |   +2.29% (14.26 pp) |
| tuple/projection/100/values             |          1,917.26 (25.74) |           1,921.71 (190.28) |  +0.23% |    +0.70% (2.89 pp) |
| tuple/tuple/100/values                  |          1,538.88 (22.75) |           1,686.69 (203.64) |  +9.60% |    +9.85% (9.39 pp) |
| tuple/projection/100/sequence           |         6,275.52 (762.96) |           6,585.46 (832.79) |  +4.94% |   -0.80% (24.61 pp) |
| tuple/tuple/100/sequence                |         5,491.29 (263.15) |           5,663.45 (856.01) |  +3.14% |   +5.20% (19.54 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |     Before |  Candidate | Change |
| ----------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                     |    480,344 |    480,344 | +0.00% |
| memory/up/1000/js                         |    407,560 |    407,560 | +0.00% |
| storage/up/1000/jsonBytes                 |    278,238 |    278,238 | +0.00% |
| storage/up/1000/jsonGzipBytes             |     14,908 |     14,908 | +0.00% |
| storage/up/1000/messagePackBytes          |    165,784 |    165,784 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |     12,641 |     12,641 | +0.00% |
| memory/up/5000/native                     |  2,156,488 |  2,156,488 | +0.00% |
| memory/up/5000/js                         |  2,059,744 |  2,059,744 | +0.00% |
| storage/up/5000/jsonBytes                 |  1,662,776 |  1,662,776 | +0.00% |
| storage/up/5000/jsonGzipBytes             |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes          |    839,612 |    839,612 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |     63,127 |     63,127 | +0.00% |
| memory/up/10000/native                    |  3,567,200 |  3,567,200 | +0.00% |
| memory/up/10000/js                        |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes                |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes            |    152,232 |    152,232 | +0.00% |
| storage/up/10000/messagePackBytes         |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |    127,808 |    127,808 | +0.00% |
| memory/up/15000/native                    |  4,819,528 |  4,819,528 | +0.00% |
| memory/up/15000/js                        |  6,196,128 |  6,196,128 | +0.00% |
| storage/up/15000/jsonBytes                |  5,053,159 |  5,053,159 | +0.00% |
| storage/up/15000/jsonGzipBytes            |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes         |  3,635,106 |  3,635,106 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                    |  6,317,656 |  6,317,656 | +0.00% |
| memory/up/20000/js                        |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes                |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes            |    318,634 |    318,634 | +0.00% |
| storage/up/20000/messagePackBytes         |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |    269,890 |    269,890 | +0.00% |
| memory/up/25000/native                    |  7,541,536 |  7,541,536 | +0.00% |
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
| memory/down/1000/native                   |  2,719,360 |  2,719,360 | +0.00% |
| memory/down/1000/js                       |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes               |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes           |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes        |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |     13,932 |     13,932 | +0.00% |
| memory/down/0/native                      |  1,597,976 |  1,597,976 | +0.00% |
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
