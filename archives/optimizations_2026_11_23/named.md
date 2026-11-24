# Rejected named-key slots

5 complete matched runs per build. Before: baseline; candidate: named. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 38 timing medians improve over 5%; 83 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |             826.2 (28.62) |            767.75 (16.88) |  -7.07% |    -8.87% (2.88 pp) |
| throughput/1000/apply.duplicate         |            818.64 (50.67) |           925.09 (243.36) | +13.00% |  +11.82% (23.59 pp) |
| throughput/5000/apply.duplicate         |            384.78 (40.69) |             377.35 (9.47) |  -1.93% |   -2.86% (11.91 pp) |
| throughput/10000/apply.duplicate        |             341.56 (8.26) |             347.93 (8.03) |  +1.86% |    +0.02% (3.28 pp) |
| throughput/15000/apply.duplicate        |            338.51 (26.83) |            341.27 (15.33) |  +0.82% |    -3.01% (1.87 pp) |
| throughput/20000/apply.duplicate        |                316 (7.66) |            330.07 (14.68) |  +4.45% |    +5.34% (1.58 pp) |
| throughput/25000/apply.duplicate        |             311.02 (5.66) |            315.82 (12.58) |  +1.54% |    +3.40% (6.43 pp) |
| throughput/100/apply.duplicateRemove    |         1,480.74 (184.95) |         1,694.76 (253.67) | +14.45% |    +2.71% (37.6 pp) |
| throughput/1000/apply.duplicateRemove   |            891.06 (79.72) |           866.84 (108.34) |  -2.72% |     -2.62% (1.7 pp) |
| throughput/5000/apply.duplicateRemove   |            842.38 (67.12) |            771.61 (37.99) |  -8.40% |    -7.37% (7.96 pp) |
| throughput/10000/apply.duplicateRemove  |               688 (31.98) |           728.98 (131.35) |  +5.96% |   +5.21% (20.53 pp) |
| throughput/15000/apply.duplicateRemove  |            679.86 (43.35) |            694.74 (15.94) |  +2.19% |     +1.37% (4.5 pp) |
| throughput/20000/apply.duplicateRemove  |             656.75 (5.64) |             724.72 (5.66) | +10.35% |   +10.17% (3.26 pp) |
| throughput/25000/apply.duplicateRemove  |            677.28 (48.63) |            658.01 (21.01) |  -2.85% |    -0.47% (4.14 pp) |
| throughput/100/apply.duplicateReplace   |         1,105.67 (232.46) |         1,158.13 (194.44) |  +4.74% |   +13.38% (9.35 pp) |
| throughput/1000/apply.duplicateReplace  |          1,190.09 (54.05) |         1,227.49 (250.31) |  +3.14% |    -0.85% (18.5 pp) |
| throughput/5000/apply.duplicateReplace  |         1,009.05 (123.99) |           995.55 (102.65) |  -1.34% |    -0.40% (0.99 pp) |
| throughput/10000/apply.duplicateReplace |            861.87 (35.89) |                931.2 (47) |  +8.04% |    +6.93% (3.16 pp) |
| throughput/15000/apply.duplicateReplace |              858.7 (56.1) |            829.02 (19.39) |  -3.46% |       -4.76% (9 pp) |
| throughput/20000/apply.duplicateReplace |            860.88 (60.24) |            824.02 (67.05) |  -4.28% |    -2.18% (5.86 pp) |
| throughput/25000/apply.duplicateReplace |            849.17 (44.62) |              823.5 (39.4) |  -3.02% |    -1.12% (9.54 pp) |
| throughput/100/apply.insert             |         1,695.71 (258.88) |          1,568.15 (72.44) |  -7.52% |   +0.91% (13.59 pp) |
| throughput/1000/apply.insert            |          1,392.75 (75.75) |         1,407.42 (143.37) |  +1.05% |    +3.87% (2.89 pp) |
| throughput/5000/apply.insert            |          1,367.5 (162.73) |         1,350.09 (101.05) |  -1.27% |    +0.02% (8.89 pp) |
| throughput/10000/apply.insert           |         1,361.82 (124.04) |         1,326.88 (123.53) |  -2.57% |   -2.00% (11.02 pp) |
| throughput/15000/apply.insert           |           1,230.2 (80.85) |          1,316.58 (30.24) |  +7.02% |    +5.05% (3.32 pp) |
| throughput/20000/apply.insert           |          1,218.59 (36.87) |          1,169.83 (82.86) |  -4.00% |    -1.69% (7.51 pp) |
| throughput/25000/apply.insert           |          1,293.87 (59.78) |          1,247.44 (29.72) |  -3.59% |   -5.30% (12.83 pp) |
| throughput/100/apply.remove             |         1,837.57 (187.45) |          2,092.37 (104.9) | +13.87% |   +12.23% (7.11 pp) |
| throughput/1000/apply.remove            |         1,452.41 (150.92) |          1,508.64 (18.86) |  +3.87% |   -1.57% (10.19 pp) |
| throughput/5000/apply.remove            |          1,502.34 (62.89) |         1,541.86 (102.79) |  +2.63% |   +2.63% (12.06 pp) |
| throughput/10000/apply.remove           |          1,537.91 (40.84) |          1,508.07 (62.22) |  -1.94% |   -1.94% (14.62 pp) |
| throughput/15000/apply.remove           |         1,480.01 (119.07) |          1,583.45 (66.87) |  +6.99% |   +10.02% (6.75 pp) |
| throughput/20000/apply.remove           |          1,534.91 (78.55) |         1,481.44 (118.35) |  -3.48% |    -3.75% (4.58 pp) |
| throughput/25000/apply.remove           |          1,499.01 (50.39) |           1,471.18 (88.5) |  -1.86% |    -1.86% (2.57 pp) |
| throughput/100/apply.replace            |         2,606.12 (545.52) |         2,698.18 (315.82) |  +3.53% |   -1.98% (12.72 pp) |
| throughput/1000/apply.replace           |          2,674.11 (95.76) |          2,689.47 (81.35) |  +0.57% |    +3.46% (2.08 pp) |
| throughput/5000/apply.replace           |           2,746.07 (90.7) |          2,807.54 (57.72) |  +2.24% |    +2.41% (3.15 pp) |
| throughput/10000/apply.replace          |         2,653.36 (132.06) |         2,795.89 (148.01) |  +5.37% |     +0.23% (5.6 pp) |
| throughput/15000/apply.replace          |         2,690.61 (144.44) |          2,694.99 (54.49) |  +0.16% |    -0.05% (2.93 pp) |
| throughput/20000/apply.replace          |          2,718.37 (53.37) |          2,743.5 (126.41) |  +0.92% |    -2.92% (4.94 pp) |
| throughput/25000/apply.replace          |          2,773.99 (52.75) |         2,755.39 (160.73) |  -0.67% |    +1.92% (9.74 pp) |
| throughput/100/create.empty             |           552.61 (101.09) |            564.22 (34.06) |  +2.10% |   +2.10% (11.76 pp) |
| throughput/1000/create.empty            |           723.28 (132.35) |             719.81 (2.25) |  -0.48% |   +1.67% (21.47 pp) |
| throughput/5000/create.empty            |            770.11 (63.37) |             834.8 (34.73) |  +8.40% |  +10.11% (15.46 pp) |
| throughput/10000/create.empty           |            735.69 (59.72) |           798.83 (102.92) |  +8.58% |    +9.17% (4.92 pp) |
| throughput/15000/create.empty           |            762.98 (36.46) |            749.54 (12.92) |  -1.76% |    -1.76% (8.14 pp) |
| throughput/20000/create.empty           |            749.58 (54.88) |             729.4 (23.96) |  -2.69% |   +6.49% (11.42 pp) |
| throughput/25000/create.empty           |            728.84 (59.13) |            711.88 (65.81) |  -2.33% |   +1.64% (10.21 pp) |
| throughput/100/create.sequence          |          1,544.66 (78.42) |          1,539.4 (278.89) |  -0.34% |   +3.06% (27.41 pp) |
| throughput/1000/create.sequence         |         1,842.68 (118.06) |          1,854.92 (47.59) |  +0.66% |    +2.04% (4.95 pp) |
| throughput/5000/create.sequence         |         1,610.82 (100.83) |         1,709.46 (180.87) |  +6.12% |   +6.12% (17.55 pp) |
| throughput/10000/create.sequence        |         1,590.78 (161.12) |         1,767.44 (158.13) | +11.11% |    +7.75% (22.5 pp) |
| throughput/15000/create.sequence        |          1,555.2 (206.85) |         1,548.56 (151.21) |  -0.43% |   -3.96% (19.79 pp) |
| throughput/20000/create.sequence        |         1,441.58 (163.96) |          1,645.33 (143.4) | +14.13% |    +4.45% (7.28 pp) |
| throughput/25000/create.sequence        |         1,484.19 (200.23) |         1,488.59 (197.39) |  +0.30% |   -1.54% (11.59 pp) |
| throughput/100/insert.head              |            508.74 (13.19) |            528.51 (15.47) |  +3.89% |    +1.95% (8.52 pp) |
| throughput/1000/insert.head             |            516.14 (39.02) |            535.18 (32.74) |  +3.69% |    -0.03% (3.83 pp) |
| throughput/5000/insert.head             |            532.74 (69.05) |             516.9 (56.22) |  -2.97% |    -1.46% (8.48 pp) |
| throughput/10000/insert.head            |            520.84 (87.62) |            505.58 (25.77) |  -2.93% |   -0.43% (10.51 pp) |
| throughput/15000/insert.head            |             479.98 (95.1) |            504.49 (28.94) |  +5.11% |   +2.13% (22.19 pp) |
| throughput/20000/insert.head            |            480.15 (31.27) |            517.74 (50.93) |  +7.83% |    +5.16% (5.61 pp) |
| throughput/25000/insert.head            |            502.04 (52.11) |             471.21 (4.05) |  -6.14% |   +2.88% (12.06 pp) |
| throughput/100/insert.middle            |             615.28 (4.34) |             651.93 (84.2) |  +5.96% |   -4.35% (14.63 pp) |
| throughput/1000/insert.middle           |            621.46 (20.07) |            616.05 (43.03) |  -0.87% |    -0.03% (8.16 pp) |
| throughput/5000/insert.middle           |            631.26 (40.66) |            593.79 (81.97) |  -5.94% |   -4.90% (20.72 pp) |
| throughput/10000/insert.middle          |           609.48 (111.21) |            615.05 (53.74) |  +0.91% |   +4.54% (22.18 pp) |
| throughput/15000/insert.middle          |           622.07 (124.88) |               621.81 (19) |  -0.04% |   -0.04% (22.62 pp) |
| throughput/20000/insert.middle          |            618.09 (68.24) |            622.01 (22.72) |  +0.63% |    -1.86% (12.2 pp) |
| throughput/25000/insert.middle          |            545.85 (14.25) |             568.77 (18.8) |  +4.20% |    +0.47% (5.19 pp) |
| throughput/100/insert.random            |            885.44 (99.93) |            914.91 (61.92) |  +3.33% |    +6.27% (4.45 pp) |
| throughput/1000/insert.random           |            926.77 (65.73) |             923.8 (49.99) |  -0.32% |    +4.50% (8.91 pp) |
| throughput/5000/insert.random           |            907.53 (81.44) |            994.71 (68.19) |  +9.61% |  +13.37% (13.34 pp) |
| throughput/10000/insert.random          |            869.48 (52.24) |            904.28 (38.72) |  +4.00% |   +4.00% (11.05 pp) |
| throughput/15000/insert.random          |             814.3 (24.24) |            853.89 (15.16) |  +4.86% |    +4.35% (1.42 pp) |
| throughput/20000/insert.random          |            876.37 (91.69) |            893.74 (43.83) |  +1.98% |    +1.49% (0.32 pp) |
| throughput/25000/insert.random          |            819.42 (49.04) |            867.87 (13.13) |  +5.91% |   +6.96% (10.82 pp) |
| throughput/100/insert.sameIndex         |            553.72 (48.18) |            571.77 (99.75) |  +3.26% |    +2.04% (6.69 pp) |
| throughput/1000/insert.sameIndex        |            579.08 (53.97) |           640.27 (136.22) | +10.57% |  +13.94% (24.63 pp) |
| throughput/5000/insert.sameIndex        |            611.54 (71.99) |            544.18 (72.05) | -11.01% |   -4.53% (12.41 pp) |
| throughput/10000/insert.sameIndex       |               556.52 (21) |           548.63 (319.83) |  -1.42% |   +4.75% (52.24 pp) |
| throughput/15000/insert.sameIndex       |            560.84 (29.57) |              497.1 (10.7) | -11.37% |    -5.14% (7.82 pp) |
| throughput/20000/insert.sameIndex       |             539.7 (20.77) |            553.89 (77.48) |  +2.63% |   +4.52% (15.13 pp) |
| throughput/25000/insert.sameIndex       |            506.19 (44.69) |             523.99 (3.01) |  +3.52% |     +3.52% (7.3 pp) |
| throughput/100/insert.tail              |            832.15 (22.74) |           893.97 (208.33) |  +7.43% |   -1.12% (26.01 pp) |
| throughput/1000/insert.tail             |           873.17 (125.11) |           843.05 (121.66) |  -3.45% |   -0.53% (10.93 pp) |
| throughput/5000/insert.tail             |            937.84 (14.41) |            944.43 (316.2) |  +0.70% |   +0.21% (27.99 pp) |
| throughput/10000/insert.tail            |           885.86 (152.44) |            821.18 (83.54) |  -7.30% |    -5.72% (6.42 pp) |
| throughput/15000/insert.tail            |           807.77 (160.02) |            730.79 (196.2) |  -9.53% |    +3.02% (5.39 pp) |
| throughput/20000/insert.tail            |            858.78 (57.43) |           839.41 (102.87) |  -2.26% |    -7.46% (4.61 pp) |
| throughput/25000/insert.tail            |           853.14 (112.09) |            814.8 (184.09) |  -4.49% |    -0.26% (3.66 pp) |
| throughput/100/length                   |            118.98 (11.72) |            124.26 (10.47) |  +4.44% |   -5.78% (13.37 pp) |
| throughput/1000/length                  |             108.77 (7.71) |             111.55 (9.02) |  +2.56% |    +9.35% (5.96 pp) |
| throughput/5000/length                  |            113.46 (10.92) |             118.27 (3.28) |  +4.24% |   +4.67% (12.68 pp) |
| throughput/10000/length                 |             118.89 (9.96) |             124.6 (10.49) |  +4.80% |   +2.48% (11.97 pp) |
| throughput/15000/length                 |             102.08 (8.18) |            105.66 (18.71) |  +3.51% |    +3.87% (8.33 pp) |
| throughput/20000/length                 |             110.61 (4.73) |            107.71 (11.66) |  -2.62% |    +0.36% (9.18 pp) |
| throughput/25000/length                 |             103.21 (9.39) |             113.57 (15.2) | +10.04% |   +4.57% (20.04 pp) |
| throughput/100/merge.duplicate          |            825.62 (75.84) |             788.51 (7.64) |  -4.49% |   -6.70% (11.97 pp) |
| throughput/1000/merge.duplicate         |            684.32 (38.78) |            662.92 (11.43) |  -3.13% |    -3.74% (7.74 pp) |
| throughput/5000/merge.duplicate         |            640.65 (43.54) |             654.92 (9.14) |  +2.23% |   +3.28% (10.46 pp) |
| throughput/10000/merge.duplicate        |            619.57 (12.58) |            636.92 (21.52) |  +2.80% |    +2.86% (4.06 pp) |
| throughput/15000/merge.duplicate        |            602.12 (39.03) |            601.87 (22.86) |  -0.04% |    +0.72% (8.81 pp) |
| throughput/20000/merge.duplicate        |            578.25 (14.18) |            609.15 (34.59) |  +5.34% |     +3.81% (7.8 pp) |
| throughput/25000/merge.duplicate        |             586.23 (9.89) |             612.8 (32.15) |  +4.53% |    +3.57% (9.01 pp) |
| throughput/100/merge.insert             |         1,707.55 (160.72) |         1,688.71 (147.55) |  -1.10% |   +1.44% (19.64 pp) |
| throughput/1000/merge.insert            |         1,482.96 (118.69) |          1,540.23 (80.04) |  +3.86% |    +0.81% (9.22 pp) |
| throughput/5000/merge.insert            |          1,426.34 (193.6) |          1,595.21 (42.86) | +11.84% |  +10.49% (10.18 pp) |
| throughput/10000/merge.insert           |         1,577.99 (139.64) |          1,531.99 (97.08) |  -2.92% |     -2.92% (4.5 pp) |
| throughput/15000/merge.insert           |         1,445.78 (102.98) |          1,457.29 (36.05) |  +0.80% |    +1.39% (8.87 pp) |
| throughput/20000/merge.insert           |             1,491 (64.09) |         1,431.53 (169.94) |  -3.99% |    +0.92% (4.13 pp) |
| throughput/25000/merge.insert           |           1,371.06 (39.3) |         1,406.04 (138.51) |  +2.55% |    +2.55% (8.96 pp) |
| throughput/100/remove.head              |            727.47 (75.37) |            708.01 (258.6) |  -2.68% |    -1.47% (8.11 pp) |
| throughput/1000/remove.head             |             793.53 (9.28) |            779.93 (30.96) |  -1.71% |     -2.55% (7.5 pp) |
| throughput/5000/remove.head             |              807.18 (7.9) |             830.6 (62.25) |  +2.90% |    +2.90% (9.34 pp) |
| throughput/10000/remove.head            |            873.07 (22.03) |             897.37 (26.2) |  +2.78% |    +2.76% (3.65 pp) |
| throughput/15000/remove.head            |            872.08 (28.72) |           927.82 (157.07) |  +6.39% |   +6.39% (14.67 pp) |
| throughput/20000/remove.head            |            909.83 (12.86) |            944.42 (18.98) |  +3.80% |    +4.38% (5.95 pp) |
| throughput/25000/remove.head            |            938.57 (72.58) |            956.16 (166.6) |  +1.87% |   -5.46% (28.26 pp) |
| throughput/100/remove.middle            |            715.14 (29.29) |            767.16 (67.91) |  +7.27% |   +7.27% (14.37 pp) |
| throughput/1000/remove.middle           |             811.85 (7.69) |              825.7 (1.12) |  +1.71% |    +1.75% (1.06 pp) |
| throughput/5000/remove.middle           |             815.04 (6.98) |            835.43 (87.91) |  +2.50% |   +1.26% (13.38 pp) |
| throughput/10000/remove.middle          |            851.85 (43.31) |            852.07 (25.23) |  +0.03% |    +2.15% (7.11 pp) |
| throughput/15000/remove.middle          |            841.47 (77.13) |            864.91 (99.22) |  +2.79% |   +3.26% (12.72 pp) |
| throughput/20000/remove.middle          |           932.67 (161.98) |                943 (40.7) |  +1.11% |   +5.57% (27.63 pp) |
| throughput/25000/remove.middle          |            930.61 (67.56) |            921.26 (29.71) |  -1.00% |   +0.16% (14.41 pp) |
| throughput/100/remove.random            |            928.06 (12.99) |         1,006.77 (144.41) |  +8.48% |   +4.32% (21.67 pp) |
| throughput/1000/remove.random           |          1,164.31 (46.88) |          1,210.1 (100.94) |  +3.93% |    +0.79% (6.35 pp) |
| throughput/5000/remove.random           |          1,209.48 (12.01) |          1,175.83 (31.86) |  -2.78% |    -2.49% (12.1 pp) |
| throughput/10000/remove.random          |          1,176.07 (55.74) |         1,212.96 (100.57) |  +3.14% |   +1.39% (12.59 pp) |
| throughput/15000/remove.random          |         1,258.81 (175.98) |          1,203.2 (122.86) |  -4.42% |    -6.25% (10.6 pp) |
| throughput/20000/remove.random          |           1,212.3 (94.96) |          1,246.22 (67.96) |  +2.80% |    +1.71% (1.73 pp) |
| throughput/25000/remove.random          |           1,266.25 (28.2) |           1,274.13 (47.3) |  +0.62% |    -0.42% (4.17 pp) |
| throughput/100/remove.sameIndex         |         1,079.19 (223.73) |         1,038.75 (236.37) |  -3.75% |   -3.75% (46.06 pp) |
| throughput/1000/remove.sameIndex        |             838.16 (26.8) |            830.21 (14.56) |  -0.95% |    -3.46% (2.45 pp) |
| throughput/5000/remove.sameIndex        |            846.23 (22.02) |           821.41 (103.17) |  -2.93% |     +3.35% (9.4 pp) |
| throughput/10000/remove.sameIndex       |            791.61 (17.06) |            888.79 (19.45) | +12.28% |   +12.52% (2.23 pp) |
| throughput/15000/remove.sameIndex       |            824.59 (49.02) |             879.49 (8.04) |  +6.66% |    +2.53% (4.69 pp) |
| throughput/20000/remove.sameIndex       |           935.91 (115.84) |            944.91 (61.45) |  +0.96% |  +11.17% (19.42 pp) |
| throughput/25000/remove.sameIndex       |            941.46 (86.77) |            902.71 (46.47) |  -4.12% |   -4.12% (14.38 pp) |
| throughput/100/remove.tail              |            761.71 (76.71) |            687.27 (37.89) |  -9.77% |   -9.85% (24.09 pp) |
| throughput/1000/remove.tail             |             710.66 (5.53) |            732.93 (86.16) |  +3.13% |   +3.71% (16.01 pp) |
| throughput/5000/remove.tail             |             757.1 (18.56) |             726.45 (4.21) |  -4.05% |    -2.10% (6.64 pp) |
| throughput/10000/remove.tail            |           786.98 (101.85) |            784.78 (67.92) |  -0.28% |   -3.36% (13.73 pp) |
| throughput/15000/remove.tail            |            753.64 (60.31) |               752.81 (41) |  -0.11% |    -1.30% (3.35 pp) |
| throughput/20000/remove.tail            |            800.51 (41.17) |            855.87 (34.86) |  +6.92% |    +6.92% (2.74 pp) |
| throughput/25000/remove.tail            |              877 (130.09) |             823.94 (76.4) |  -6.05% |   +1.75% (21.61 pp) |
| throughput/100/replace.head             |         1,039.55 (139.46) |           1,061.12 (83.9) |  +2.07% |   +5.49% (28.73 pp) |
| throughput/1000/replace.head            |          1,173.87 (22.04) |         1,201.01 (103.66) |  +2.31% |   +0.85% (15.48 pp) |
| throughput/5000/replace.head            |          1,131.49 (59.58) |          1,149.44 (74.11) |  +1.59% |   -1.50% (10.62 pp) |
| throughput/10000/replace.head           |         1,169.31 (115.16) |          1,204.45 (43.79) |  +3.01% |    +3.01% (7.58 pp) |
| throughput/15000/replace.head           |         1,164.01 (154.76) |         1,154.74 (130.24) |  -0.80% |    -4.06% (6.38 pp) |
| throughput/20000/replace.head           |         1,321.08 (115.87) |           1,254.7 (37.66) |  -5.02% |    -2.28% (2.23 pp) |
| throughput/25000/replace.head           |          1,200.8 (156.68) |          1,258.02 (67.47) |  +4.77% |   +4.77% (19.88 pp) |
| throughput/100/replace.middle           |         1,218.41 (300.11) |          1,148.45 (43.61) |  -5.74% |   +8.44% (27.12 pp) |
| throughput/1000/replace.middle          |          1,197.55 (35.27) |           1,252.3 (26.55) |  +4.57% |    +5.38% (5.31 pp) |
| throughput/5000/replace.middle          |          1,186.62 (84.01) |          1,185.03 (41.85) |  -0.13% |    -0.45% (10.1 pp) |
| throughput/10000/replace.middle         |          1,237.23 (98.79) |          1,193.99 (54.38) |  -3.49% |    -3.03% (8.48 pp) |
| throughput/15000/replace.middle         |          1,197.59 (31.19) |          1,203.13 (32.16) |  +0.46% |    +0.46% (3.47 pp) |
| throughput/20000/replace.middle         |          1,276.97 (60.94) |          1,332.41 (97.67) |  +4.34% |   +4.19% (12.92 pp) |
| throughput/25000/replace.middle         |          1,284.56 (38.01) |           1,249.68 (35.3) |  -2.72% |    -2.52% (1.99 pp) |
| throughput/100/replace.random           |         1,633.09 (203.75) |         1,698.72 (119.75) |  +4.02% |    +4.19% (7.06 pp) |
| throughput/1000/replace.random          |         1,853.14 (305.44) |          1,816.82 (153.6) |  -1.96% |    +4.19% (2.24 pp) |
| throughput/5000/replace.random          |           1,780.46 (4.96) |          1,764.06 (79.51) |  -0.92% |    -0.67% (5.27 pp) |
| throughput/10000/replace.random         |             1,793 (87.84) |          1,787.56 (33.75) |  -0.30% |    +0.49% (6.17 pp) |
| throughput/15000/replace.random         |          1,723.8 (146.19) |         1,781.02 (134.72) |  +3.32% |    +3.11% (8.77 pp) |
| throughput/20000/replace.random         |          1,788.45 (36.84) |          1,813.01 (91.98) |  +1.37% |    +1.37% (7.33 pp) |
| throughput/25000/replace.random         |         1,921.69 (873.89) |         1,881.75 (110.89) |  -2.08% |   -2.08% (27.08 pp) |
| throughput/100/replace.sameIndex        |           1,018.04 (6.61) |         1,098.52 (206.26) |  +7.91% |   -0.07% (25.71 pp) |
| throughput/1000/replace.sameIndex       |          1,154.64 (44.89) |          1,177.96 (29.87) |  +2.02% |    +2.02% (6.69 pp) |
| throughput/5000/replace.sameIndex       |          1,117.02 (37.89) |          1,168.55 (28.14) |  +4.61% |    +5.44% (7.42 pp) |
| throughput/10000/replace.sameIndex      |         1,237.79 (192.56) |           1,166.05 (6.62) |  -5.80% |   -6.26% (13.46 pp) |
| throughput/15000/replace.sameIndex      |          1,136.28 (78.66) |          1,121.47 (70.21) |  -1.30% |    -0.69% (1.73 pp) |
| throughput/20000/replace.sameIndex      |          1,207.62 (66.46) |          1,275.35 (46.16) |  +5.61% |       +3.57% (3 pp) |
| throughput/25000/replace.sameIndex      |         1,181.28 (144.78) |          1,327.73 (59.32) | +12.40% |   +4.96% (10.03 pp) |
| throughput/100/replace.tail             |          1,033.84 (66.84) |         1,109.09 (189.57) |  +7.28% |   +0.06% (29.77 pp) |
| throughput/1000/replace.tail            |          1,178.28 (26.85) |          1,162.64 (12.12) |  -1.33% |    -0.52% (9.36 pp) |
| throughput/5000/replace.tail            |          1,189.11 (45.48) |          1,178.25 (39.21) |  -0.91% |    +0.13% (3.08 pp) |
| throughput/10000/replace.tail           |         1,203.96 (154.41) |          1,207.48 (50.53) |  +0.29% |   +0.29% (17.84 pp) |
| throughput/15000/replace.tail           |          1,170.18 (97.23) |          1,181.42 (48.18) |  +0.96% |    -2.41% (9.04 pp) |
| throughput/20000/replace.tail           |           1,294.59 (53.1) |          1,218.88 (59.81) |  -5.85% |   -7.20% (13.48 pp) |
| throughput/25000/replace.tail           |         1,361.37 (153.56) |          1,277.48 (25.62) |  -6.16% |    -7.68% (4.79 pp) |
| throughput/100/retire                   |            181.92 (73.05) |             204.66 (8.63) | +12.50% |  +12.77% (32.49 pp) |
| throughput/1000/retire                  |            226.67 (33.91) |             219.5 (44.03) |  -3.16% |    +4.40% (1.05 pp) |
| throughput/5000/retire                  |             205.73 (4.33) |             208.83 (9.01) |  +1.51% |    +1.51% (3.96 pp) |
| throughput/10000/retire                 |             208.27 (28.6) |             193.39 (6.38) |  -7.14% |   -4.84% (13.13 pp) |
| throughput/15000/retire                 |             191.63 (0.81) |              186.89 (9.4) |  -2.47% |    -2.53% (2.59 pp) |
| throughput/20000/retire                 |             187.83 (4.72) |             192.16 (5.55) |  +2.31% |    +2.36% (1.68 pp) |
| throughput/25000/retire                 |            217.81 (18.58) |            185.83 (21.79) | -14.68% |  -11.66% (23.57 pp) |
| throughput/100/sequence                 |            295.25 (62.49) |             334.54 (52.4) | +13.31% |   -0.35% (24.45 pp) |
| throughput/1000/sequence                |             308.01 (12.7) |                 300.4 (9) |  -2.47% |     -2.85% (5.5 pp) |
| throughput/5000/sequence                |            287.93 (15.79) |             284.26 (9.12) |  -1.27% |    +4.27% (9.09 pp) |
| throughput/10000/sequence               |             293.8 (48.92) |            270.43 (10.77) |  -7.95% |  -11.62% (18.77 pp) |
| throughput/15000/sequence               |            269.26 (14.43) |            260.28 (15.72) |  -3.34% |    -1.09% (7.88 pp) |
| throughput/20000/sequence               |              266.4 (37.7) |            247.66 (12.22) |  -7.03% |   -7.99% (11.99 pp) |
| throughput/25000/sequence               |            284.03 (11.37) |              257.1 (9.74) |  -9.48% |    -8.54% (9.81 pp) |
| throughput/100/value.head               |            172.51 (34.93) |            203.64 (24.38) | +18.05% |  +18.05% (19.51 pp) |
| throughput/1000/value.head              |             164.19 (6.06) |            168.42 (13.56) |  +2.58% |   +1.87% (12.31 pp) |
| throughput/5000/value.head              |            148.75 (13.47) |             145.53 (8.38) |  -2.16% |    -1.47% (4.02 pp) |
| throughput/10000/value.head             |             149.13 (5.52) |            139.85 (13.04) |  -6.22% |   -5.65% (12.62 pp) |
| throughput/15000/value.head             |              139.03 (5.8) |             132.93 (5.04) |  -4.39% |    -3.36% (2.27 pp) |
| throughput/20000/value.head             |             132.69 (6.04) |             141.73 (8.51) |  +6.81% |    +2.37% (8.42 pp) |
| throughput/25000/value.head             |             137.35 (2.39) |             132.25 (9.61) |  -3.71% |   -2.94% (18.74 pp) |
| throughput/100/value.middle             |            262.64 (18.19) |            271.06 (26.39) |  +3.21% |    +7.92% (6.68 pp) |
| throughput/1000/value.middle            |            251.47 (11.03) |               248.7 (9.3) |  -1.10% |    +0.21% (7.85 pp) |
| throughput/5000/value.middle            |             225.36 (3.82) |            225.65 (14.69) |  +0.13% |     +0.98% (3.2 pp) |
| throughput/10000/value.middle           |             223.08 (7.23) |             232.56 (1.63) |  +4.25% |    +4.71% (6.94 pp) |
| throughput/15000/value.middle           |            212.24 (41.53) |            214.84 (15.66) |  +1.23% |    +2.31% (7.54 pp) |
| throughput/20000/value.middle           |             217.61 (5.35) |              222.14 (4.5) |  +2.08% |   +2.61% (11.51 pp) |
| throughput/25000/value.middle           |             208.47 (3.47) |             208.09 (7.14) |  -0.18% |     -0.25% (8.6 pp) |
| throughput/100/value.random             |            213.81 (22.63) |            222.25 (41.09) |  +3.95% |    -0.58% (5.84 pp) |
| throughput/1000/value.random            |            240.24 (16.24) |             231.59 (5.59) |  -3.60% |     -3.43% (6.6 pp) |
| throughput/5000/value.random            |            283.35 (10.54) |            264.54 (10.98) |  -6.64% |    -4.67% (2.19 pp) |
| throughput/10000/value.random           |            281.07 (35.56) |            290.24 (33.74) |  +3.26% |   +3.17% (11.44 pp) |
| throughput/15000/value.random           |             272.33 (7.47) |             275.45 (21.4) |  +1.15% |    +1.56% (5.09 pp) |
| throughput/20000/value.random           |            290.98 (12.98) |             282.25 (5.09) |  -3.00% |    -3.88% (9.53 pp) |
| throughput/25000/value.random           |              268.93 (7.7) |            265.69 (17.39) |  -1.20% |    -6.08% (5.24 pp) |
| throughput/100/value.sameIndex          |            178.52 (28.13) |            209.79 (16.35) | +17.52% |  +17.52% (14.28 pp) |
| throughput/1000/value.sameIndex         |             186.7 (20.47) |             182.5 (13.89) |  -2.25% |    -4.30% (4.81 pp) |
| throughput/5000/value.sameIndex         |              176.1 (8.86) |             176.37 (6.45) |  +0.15% |    +0.15% (9.76 pp) |
| throughput/10000/value.sameIndex        |              164.34 (5.6) |             161.04 (7.98) |  -2.01% |    +1.54% (2.86 pp) |
| throughput/15000/value.sameIndex        |             162.42 (4.57) |            167.45 (19.76) |  +3.10% |    -3.84% (8.06 pp) |
| throughput/20000/value.sameIndex        |             161.36 (5.04) |             160.43 (3.81) |  -0.58% |    +0.79% (3.62 pp) |
| throughput/25000/value.sameIndex        |             151.07 (2.19) |             153.63 (6.95) |  +1.69% |    +1.68% (4.28 pp) |
| throughput/100/value.tail               |            267.59 (48.34) |            259.93 (65.26) |  -2.86% |   -2.86% (25.31 pp) |
| throughput/1000/value.tail              |            217.77 (25.19) |             227.87 (4.55) |  +4.64% |   +5.05% (12.91 pp) |
| throughput/5000/value.tail              |             200.78 (5.58) |             193.99 (5.31) |  -3.38% |    -2.97% (2.13 pp) |
| throughput/10000/value.tail             |            191.09 (14.76) |             194.55 (2.45) |  +1.81% |    +1.44% (4.62 pp) |
| throughput/15000/value.tail             |            190.62 (14.65) |            183.82 (18.47) |  -3.57% |    -7.86% (2.54 pp) |
| throughput/20000/value.tail             |            193.61 (14.56) |              189.74 (4.6) |  -2.00% |     +4.12% (7.8 pp) |
| throughput/25000/value.tail             |                172 (8.02) |             177.06 (6.25) |  +2.94% |    -2.19% (9.59 pp) |
| throughput/100/values                   |         4,885.65 (566.58) |       4,814.22 (1,172.76) |  -1.46% |   -2.53% (39.18 pp) |
| throughput/1000/values                  |      164,395.31 (2,424.4) |    174,076.39 (16,907.72) |  +5.89% |    +5.05% (6.62 pp) |
| throughput/5000/values                  |    529,913.02 (11,638.02) |     531,637.5 (86,357.29) |  +0.33% |    -2.07% (20.2 pp) |
| throughput/10000/values                 |  1,225,647.66 (96,459.38) |  1,189,074.22 (87,134.38) |  -2.98% |    -6.05% (9.81 pp) |
| throughput/15000/values                 | 2,156,365.63 (526,654.69) | 1,884,629.69 (192,006.25) | -12.60% |  -11.38% (20.34 pp) |
| throughput/20000/values                 | 2,764,132.81 (387,198.44) | 2,460,245.31 (244,359.38) | -10.99% |   -1.05% (16.92 pp) |
| throughput/25000/values                 | 3,277,615.63 (319,454.69) | 3,236,785.94 (517,623.44) |  -1.25% |    -1.00% (6.16 pp) |
| throughput/100/values.head              |            310.08 (16.17) |            350.89 (23.49) | +13.16% |   +9.05% (14.43 pp) |
| throughput/1000/values.head             |            274.93 (35.64) |           279.22 (146.92) |  +1.56% |  +10.36% (42.47 pp) |
| throughput/5000/values.head             |             268.75 (5.52) |              267.64 (4.8) |  -0.41% |    -1.04% (7.06 pp) |
| throughput/10000/values.head            |             273.26 (6.57) |            271.21 (37.44) |  -0.75% |   -0.41% (12.26 pp) |
| throughput/15000/values.head            |            299.58 (29.48) |             257.68 (7.01) | -13.99% |  -12.32% (19.45 pp) |
| throughput/20000/values.head            |            255.17 (13.89) |            275.59 (56.02) |  +8.00% |   +8.94% (13.16 pp) |
| throughput/25000/values.head            |            244.46 (95.38) |            264.68 (25.39) |  +8.27% |   +2.51% (33.28 pp) |
| throughput/100/values.middle            |            296.43 (18.73) |            301.48 (30.63) |  +1.70% |   +1.70% (25.88 pp) |
| throughput/1000/values.middle           |            263.34 (19.02) |            265.97 (28.59) |  +1.00% |    +1.86% (8.94 pp) |
| throughput/5000/values.middle           |            258.02 (19.07) |             256.51 (5.45) |  -0.59% |    -0.22% (5.04 pp) |
| throughput/10000/values.middle          |               264.6 (3.2) |            284.45 (22.64) |  +7.50% |   +8.08% (14.49 pp) |
| throughput/15000/values.middle          |            245.89 (41.07) |           279.26 (141.87) | +13.57% |   +21.41% (42.5 pp) |
| throughput/20000/values.middle          |             257.45 (8.76) |            262.65 (40.44) |  +2.02% |    +5.29% (8.66 pp) |
| throughput/25000/values.middle          |            235.59 (52.79) |            243.12 (58.52) |  +3.20% |   +4.16% (45.72 pp) |
| throughput/100/values.random            |            300.09 (20.19) |            327.93 (45.39) |  +9.28% |  +12.45% (11.74 pp) |
| throughput/1000/values.random           |            295.35 (23.25) |            309.14 (13.64) |  +4.67% |   -0.23% (10.44 pp) |
| throughput/5000/values.random           |            349.34 (40.94) |            341.44 (42.84) |  -2.26% |    -2.92% (5.42 pp) |
| throughput/10000/values.random          |            346.71 (41.15) |            386.39 (82.37) | +11.44% |  +18.13% (35.17 pp) |
| throughput/15000/values.random          |            375.23 (81.88) |            346.26 (13.07) |  -7.72% |   -7.72% (10.48 pp) |
| throughput/20000/values.random          |             450.09 (58.6) |             391.6 (25.72) | -13.00% |    -4.69% (13.8 pp) |
| throughput/25000/values.random          |            362.94 (34.21) |            379.39 (12.06) |  +4.53% |   +2.23% (14.47 pp) |
| throughput/100/values.sameIndex         |             279.2 (10.83) |            335.65 (80.22) | +20.22% |  +18.32% (17.89 pp) |
| throughput/1000/values.sameIndex        |             272.13 (9.87) |             282.9 (11.53) |  +3.96% |    +1.05% (4.53 pp) |
| throughput/5000/values.sameIndex        |             291.01 (18.1) |            270.18 (45.81) |  -7.16% |   -5.45% (17.86 pp) |
| throughput/10000/values.sameIndex       |            255.65 (10.78) |            269.45 (23.77) |  +5.40% |   +8.02% (11.04 pp) |
| throughput/15000/values.sameIndex       |            247.15 (38.72) |             255.04 (4.39) |  +3.19% |    +4.60% (2.89 pp) |
| throughput/20000/values.sameIndex       |               246 (47.66) |            269.94 (11.49) |  +9.73% |   +7.53% (25.92 pp) |
| throughput/25000/values.sameIndex       |             241.4 (17.85) |             245.75 (7.01) |  +1.80% |    +4.68% (6.72 pp) |
| throughput/100/values.tail              |            282.65 (13.88) |            329.84 (90.54) | +16.70% |  +20.11% (19.12 pp) |
| throughput/1000/values.tail             |            253.51 (17.93) |             263.84 (5.15) |  +4.07% |    +3.71% (7.32 pp) |
| throughput/5000/values.tail             |            312.61 (68.05) |            258.98 (22.87) | -17.16% |   +3.06% (16.51 pp) |
| throughput/10000/values.tail            |            239.73 (47.88) |            258.69 (34.81) |  +7.91% |    +6.75% (5.76 pp) |
| throughput/15000/values.tail            |            239.19 (40.97) |            229.33 (15.87) |  -4.12% |     -0.53% (0.4 pp) |
| throughput/20000/values.tail            |            243.78 (20.49) |            254.29 (24.84) |  +4.31% |    +3.44% (9.67 pp) |
| throughput/25000/values.tail            |            233.44 (29.97) |            227.44 (11.95) |  -2.57% |   +8.48% (11.46 pp) |
| lifecycle/scaleUp/apply.random          |         3,842.65 (178.38) |          3,811.32 (100.7) |  -0.82% |    -1.53% (9.53 pp) |
| lifecycle/scaleUp/insert.head           |            836.57 (36.86) |            799.49 (74.39) |  -4.43% |    -2.50% (6.58 pp) |
| lifecycle/scaleUp/insert.random         |          1,807.24 (56.43) |             1,889.86 (43) |  +4.57% |    +0.75% (9.93 pp) |
| lifecycle/scaleUp/insert.tail           |            773.53 (98.89) |            828.88 (63.09) |  +7.16% |    -0.30% (8.21 pp) |
| lifecycle/scaleUp/remove.random         |         2,806.89 (290.18) |         2,762.66 (407.85) |  -1.58% |    +4.58% (18.5 pp) |
| lifecycle/scaleUp/replace.head          |         2,550.96 (297.95) |          2,794.94 (16.88) |  +9.56% |  +12.74% (14.72 pp) |
| lifecycle/scaleUp/replace.random        |         3,661.99 (301.12) |         3,600.41 (435.73) |  -1.68% |   -1.68% (10.21 pp) |
| lifecycle/scaleUp/replace.tail          |         2,271.44 (176.38) |         2,407.86 (303.48) |  +6.01% |   +2.50% (18.67 pp) |
| lifecycle/scaleUp/value.head            |            339.34 (16.98) |            323.96 (12.54) |  -4.53% |    -4.98% (0.45 pp) |
| lifecycle/scaleUp/value.random          |           1,128.26 (24.4) |          1,160.13 (50.24) |  +2.82% |   +2.51% (10.77 pp) |
| lifecycle/scaleUp/value.tail            |             153.24 (8.62) |              159.2 (2.79) |  +3.89% |    +3.96% (9.66 pp) |
| lifecycle/scaleDown/apply.random        |          3,419.06 (55.59) |         3,435.56 (353.05) |  +0.48% |    -0.78% (10.7 pp) |
| lifecycle/scaleDown/insert.random       |           1,686.61 (51.7) |          1,687.64 (94.28) |  +0.06% |    -1.51% (0.37 pp) |
| lifecycle/scaleDown/remove.head         |           1,910.1 (70.74) |         1,899.98 (116.41) |  -0.53% |    -0.53% (5.08 pp) |
| lifecycle/scaleDown/remove.random       |          2,564.7 (140.52) |          2,651.86 (29.32) |  +3.40% |    -0.04% (9.33 pp) |
| lifecycle/scaleDown/remove.tail         |           1,715.5 (41.82) |         1,846.28 (683.56) |  +7.62% |   +7.62% (44.77 pp) |
| lifecycle/scaleDown/replace.head        |          2,475.54 (43.99) |         2,532.01 (111.06) |  +2.28% |    -1.27% (4.07 pp) |
| lifecycle/scaleDown/replace.random      |         3,408.81 (305.44) |          3,200.59 (269.4) |  -6.11% |     -0.85% (6.6 pp) |
| lifecycle/scaleDown/replace.tail        |      18,085.22 (1,246.15) |           18,838 (945.46) |  +4.16% |    +1.03% (4.13 pp) |
| lifecycle/scaleDown/value.head          |              420.91 (6.3) |             420.95 (4.13) |  +0.01% |    -0.05% (6.37 pp) |
| lifecycle/scaleDown/value.random        |             1,031.63 (80) |          1,058.77 (11.95) |  +2.63% |    -0.29% (10.1 pp) |
| lifecycle/scaleDown/value.tail          |            230.52 (12.73) |            226.84 (11.76) |  -1.60% |    -1.20% (2.84 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,654.43 (267.22) |          3,787.3 (333.42) |  +3.64% |   +6.64% (18.72 pp) |
| lifecycle/fullLifecycle/insert.head     |            836.57 (36.86) |            799.49 (74.39) |  -4.43% |    -2.50% (6.58 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,752.78 (123.82) |          1,805.13 (92.54) |  +2.99% |    -2.58% (6.57 pp) |
| lifecycle/fullLifecycle/insert.tail     |            773.53 (98.89) |            828.88 (63.09) |  +7.16% |    -0.30% (8.21 pp) |
| lifecycle/fullLifecycle/remove.head     |           1,910.1 (70.74) |         1,899.98 (116.41) |  -0.53% |    -0.53% (5.08 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,654.88 (234.17) |         2,828.86 (208.65) |  +6.55% |   +5.46% (13.35 pp) |
| lifecycle/fullLifecycle/remove.tail     |           1,715.5 (41.82) |         1,846.28 (683.56) |  +7.62% |   +7.62% (44.77 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,534.09 (150.13) |          2,673.92 (75.18) |  +5.52% |    +6.37% (2.77 pp) |
| lifecycle/fullLifecycle/replace.random  |          3,530.17 (43.79) |         3,514.99 (197.66) |  -0.43% |    +0.79% (5.71 pp) |
| lifecycle/fullLifecycle/replace.tail    |        10,269.06 (691.32) |        10,722.63 (420.69) |  +4.42% |    +0.46% (1.49 pp) |
| lifecycle/fullLifecycle/value.head      |            378.32 (10.53) |             372.45 (9.46) |  -1.55% |    -0.94% (6.16 pp) |
| lifecycle/fullLifecycle/value.random    |          1,079.95 (32.07) |          1,122.74 (95.72) |  +3.96% |   +5.35% (15.35 pp) |
| lifecycle/fullLifecycle/value.tail      |             191.87 (6.35) |             194.96 (8.93) |  +1.61% |    +0.90% (4.11 pp) |
| checkpoint/up/1000/create               |          391,300 (15,300) |          423,100 (39,300) |  +8.13% |    +8.13% (5.65 pp) |
| checkpoint/up/1000/sequence             |       2,573,300 (122,900) |       2,707,300 (237,100) |  +5.21% |   +2.69% (22.73 pp) |
| checkpoint/up/1000/values               |       1,812,600 (162,500) |       1,850,300 (215,000) |  +2.08% |   -6.25% (20.99 pp) |
| checkpoint/up/5000/create               |          906,500 (21,100) |         930,900 (715,100) |  +2.69% |   -0.12% (80.41 pp) |
| checkpoint/up/5000/sequence             |       7,821,800 (853,400) |     9,845,500 (2,008,400) | +25.87% |  +25.87% (17.43 pp) |
| checkpoint/up/5000/values               |     4,937,600 (1,261,000) |       5,031,800 (770,100) |  +1.91% |   -1.11% (26.06 pp) |
| checkpoint/up/10000/create              |        1,517,400 (58,400) |        1,554,000 (79,100) |  +2.41% |    +0.31% (6.93 pp) |
| checkpoint/up/10000/sequence            |      13,049,100 (490,600) |    13,736,500 (1,429,100) |  +5.27% |    +8.84% (8.55 pp) |
| checkpoint/up/10000/values              |      20,473,500 (565,300) |      20,333,400 (270,600) |  -0.68% |     +2.48% (5.2 pp) |
| checkpoint/up/15000/create              |       2,393,400 (163,300) |        2,361,400 (35,800) |  -1.34% |     -1.59% (5.6 pp) |
| checkpoint/up/15000/sequence            |      14,770,300 (646,100) |    15,493,500 (1,276,700) |  +4.90% |    +2.43% (3.42 pp) |
| checkpoint/up/15000/values              |    29,829,600 (1,028,700) |    29,860,500 (1,620,300) |  +0.10% |    -0.22% (8.81 pp) |
| checkpoint/up/20000/create              |       3,403,400 (461,800) |       3,443,700 (150,200) |  +1.18% |   -0.19% (11.16 pp) |
| checkpoint/up/20000/sequence            |      21,448,300 (261,400) |    21,898,000 (2,489,100) |  +2.10% |   +1.62% (13.06 pp) |
| checkpoint/up/20000/values              |      10,705,000 (286,700) |    11,428,500 (1,137,500) |  +6.76% |    +5.65% (6.82 pp) |
| checkpoint/up/25000/create              |       4,352,900 (380,100) |        4,166,900 (59,800) |  -4.27% |   +0.95% (12.67 pp) |
| checkpoint/up/25000/sequence            |    26,907,500 (6,491,300) |      23,718,500 (887,500) | -11.85% |   -11.85% (7.22 pp) |
| checkpoint/up/25000/values              |      12,081,200 (645,000) |      11,630,800 (260,600) |  -3.73% |   -3.92% (17.86 pp) |
| checkpoint/down/20000/create            |        3,356,100 (61,100) |        3,420,800 (73,600) |  +1.93% |    +2.42% (1.53 pp) |
| checkpoint/down/20000/sequence          |    18,847,100 (1,038,900) |    19,496,100 (1,462,400) |  +3.44% |     +2.12% (6.7 pp) |
| checkpoint/down/20000/values            |    10,105,600 (1,504,100) |       8,915,000 (487,200) | -11.78% |  -11.78% (19.58 pp) |
| checkpoint/down/15000/create            |        2,408,000 (86,300) |        2,490,700 (50,800) |  +3.43% |    +2.97% (4.95 pp) |
| checkpoint/down/15000/sequence          |      16,381,000 (608,500) |    17,538,400 (2,951,400) |  +7.07% |    +0.03% (18.3 pp) |
| checkpoint/down/15000/values            |       8,106,300 (382,500) |     8,105,900 (1,458,600) |  -0.00% |    -0.00% (9.92 pp) |
| checkpoint/down/10000/create            |        1,634,200 (33,300) |        1,694,900 (71,500) |  +3.71% |    +2.31% (4.09 pp) |
| checkpoint/down/10000/sequence          |      12,573,700 (785,900) |    14,380,700 (2,937,900) | +14.37% |  +15.88% (34.34 pp) |
| checkpoint/down/10000/values            |        5,230,700 (31,300) |       5,783,400 (811,800) | +10.57% |   +8.70% (17.28 pp) |
| checkpoint/down/5000/create             |          797,200 (28,300) |          822,200 (41,800) |  +3.14% |    +2.55% (2.89 pp) |
| checkpoint/down/5000/sequence           |    11,022,500 (1,192,700) |       9,876,400 (525,500) | -10.40% |    -9.45% (9.89 pp) |
| checkpoint/down/5000/values             |       2,557,600 (296,500) |       3,212,500 (345,600) | +25.61% |   +16.60% (3.28 pp) |
| checkpoint/down/1000/create             |          153,100 (18,200) |          152,300 (12,600) |  -0.52% |    -0.26% (8.78 pp) |
| checkpoint/down/1000/sequence           |       5,792,400 (376,900) |       5,753,600 (594,600) |  -0.67% |   -0.67% (19.59 pp) |
| checkpoint/down/1000/values             |         563,400 (104,600) |          516,000 (48,400) |  -8.41% |   -4.73% (20.06 pp) |
| checkpoint/down/0/create                |            15,100 (2,200) |            14,700 (3,900) |  -2.65% |   -2.65% (38.02 pp) |
| checkpoint/down/0/sequence              |       1,336,300 (176,500) |        1,453,100 (99,500) |  +8.74% |      -1.70% (15 pp) |
| checkpoint/down/0/values                |            10,900 (2,000) |              10,400 (300) |  -4.59% |    +0.00% (9.43 pp) |
| tuple/projection/2/create.empty         |            368.24 (19.65) |            360.79 (11.26) |  -2.02% |     -2.02% (5.5 pp) |
| tuple/tuple/2/create.empty              |            441.24 (25.96) |            444.47 (16.57) |  +0.73% |     +0.73% (5.4 pp) |
| tuple/projection/2/create.sequence      |         1,269.46 (137.78) |           1,250.5 (54.33) |  -1.49% |    +0.34% (7.82 pp) |
| tuple/tuple/2/create.sequence           |          1,403.48 (55.12) |          1,389.16 (95.08) |  -1.02% |     -3.12% (6.6 pp) |
| tuple/projection/2/replace.random       |            979.68 (44.48) |            1,057.27 (112) |  +7.92% |   +12.74% (6.92 pp) |
| tuple/tuple/2/replace.random            |            681.61 (41.97) |            711.33 (38.06) |  +4.36% |   +7.28% (21.13 pp) |
| tuple/projection/2/apply.replace        |          1,695.79 (38.89) |          1,744.94 (87.63) |  +2.90% |    +2.77% (3.14 pp) |
| tuple/tuple/2/apply.replace             |           1,180.3 (71.53) |          1,180.91 (39.92) |  +0.05% |     +4.10% (9.4 pp) |
| tuple/projection/2/apply.duplicate      |             627.33 (26.8) |            655.16 (39.36) |  +4.44% |   -0.30% (15.91 pp) |
| tuple/tuple/2/apply.duplicate           |             629.1 (21.45) |            631.09 (42.52) |  +0.32% |    +5.06% (8.91 pp) |
| tuple/projection/2/merge.duplicate      |            647.41 (47.56) |             692.84 (9.79) |  +7.02% |    +8.07% (3.94 pp) |
| tuple/tuple/2/merge.duplicate           |            658.31 (16.12) |            693.48 (32.07) |  +5.34% |   +7.13% (11.19 pp) |
| tuple/projection/2/length               |               7.51 (0.15) |                7.51 (0.1) |  -0.06% |    +0.12% (0.97 pp) |
| tuple/tuple/2/length                    |               7.24 (0.21) |               7.53 (0.28) |  +3.89% |    +5.07% (4.61 pp) |
| tuple/projection/2/value.random         |               29.66 (0.5) |              31.19 (4.47) |  +5.13% |   +7.45% (12.83 pp) |
| tuple/tuple/2/value.random              |              19.17 (0.43) |              19.14 (0.98) |  -0.17% |    -0.23% (6.21 pp) |
| tuple/projection/2/values               |              76.05 (5.04) |              79.27 (6.14) |  +4.25% |    -0.36% (11.8 pp) |
| tuple/tuple/2/values                    |              78.79 (5.27) |               83.3 (2.95) |  +5.72% |    +5.72% (4.57 pp) |
| tuple/projection/2/sequence             |            450.12 (11.62) |             454.37 (45.3) |  +0.94% |     +0.94% (6.4 pp) |
| tuple/tuple/2/sequence                  |            490.16 (35.37) |            517.37 (24.92) |  +5.55% |    +6.42% (4.24 pp) |
| tuple/projection/4/create.empty         |              421.4 (3.55) |            422.25 (11.73) |  +0.20% |    -0.16% (3.56 pp) |
| tuple/tuple/4/create.empty              |            432.86 (11.07) |            442.24 (18.89) |  +2.17% |    +3.73% (7.97 pp) |
| tuple/projection/4/create.sequence      |          1,701.82 (12.82) |          1,679.5 (115.15) |  -1.31% |    -1.49% (2.62 pp) |
| tuple/tuple/4/create.sequence           |          1,625.76 (34.06) |          1,576.91 (59.15) |  -3.00% |    -3.12% (8.08 pp) |
| tuple/projection/4/replace.random       |          1,160.93 (43.83) |          1,130.81 (30.17) |  -2.59% |    -0.66% (6.55 pp) |
| tuple/tuple/4/replace.random            |            666.19 (28.42) |               645 (15.11) |  -3.18% |    -2.05% (2.89 pp) |
| tuple/projection/4/apply.replace        |         1,717.64 (153.82) |           1,662.39 (4.36) |  -3.22% |    -3.05% (6.17 pp) |
| tuple/tuple/4/apply.replace             |           1,101.97 (43.9) |           1,090.7 (31.14) |  -1.02% |    -3.79% (8.18 pp) |
| tuple/projection/4/apply.duplicate      |             600.08 (5.61) |            605.42 (22.04) |  +0.89% |    -1.40% (5.77 pp) |
| tuple/tuple/4/apply.duplicate           |             644.03 (40.5) |            622.37 (18.09) |  -3.36% |     -1.14% (3.5 pp) |
| tuple/projection/4/merge.duplicate      |           815.26 (108.18) |             871.11 (31.1) |  +6.85% |    +3.42% (4.19 pp) |
| tuple/tuple/4/merge.duplicate           |            801.06 (96.88) |            859.71 (67.42) |  +7.32% |    -2.27% (5.43 pp) |
| tuple/projection/4/length               |              27.86 (2.87) |               26.7 (0.46) |  -4.16% |  -11.59% (23.96 pp) |
| tuple/tuple/4/length                    |              27.27 (1.74) |              25.73 (1.13) |  -5.64% |   -1.65% (12.21 pp) |
| tuple/projection/4/value.random         |              40.73 (0.64) |              41.06 (0.43) |  +0.81% |    +0.42% (4.56 pp) |
| tuple/tuple/4/value.random              |               17.8 (0.22) |              18.49 (0.84) |  +3.88% |    +3.48% (9.32 pp) |
| tuple/projection/4/values               |            169.72 (26.56) |            152.69 (13.72) | -10.03% |  -12.64% (22.96 pp) |
| tuple/tuple/4/values                    |            146.15 (12.11) |              145.46 (6.5) |  -0.47% |   -7.13% (19.72 pp) |
| tuple/projection/4/sequence             |               479.38 (71) |              465.5 (6.49) |  -2.89% |   -3.95% (14.54 pp) |
| tuple/tuple/4/sequence                  |             526.07 (18.5) |            575.58 (38.78) |  +9.41% |    +8.19% (2.99 pp) |
| tuple/projection/8/create.empty         |            408.38 (10.59) |             421.85 (6.51) |  +3.30% |    +5.31% (2.72 pp) |
| tuple/tuple/8/create.empty              |            439.06 (82.51) |            443.81 (18.12) |  +1.08% |   +1.08% (14.04 pp) |
| tuple/projection/8/create.sequence      |          2,401.19 (199.1) |         2,291.83 (141.87) |  -4.55% |   -9.78% (10.74 pp) |
| tuple/tuple/8/create.sequence           |          2,134.18 (54.44) |          1,991.57 (150.4) |  -6.68% |   -6.68% (15.27 pp) |
| tuple/projection/8/replace.random       |          1,164.83 (74.46) |          1,155.24 (12.24) |  -0.82% |    -0.82% (7.77 pp) |
| tuple/tuple/8/replace.random            |            648.32 (42.74) |            638.13 (18.12) |  -1.57% |     +0.70% (7.7 pp) |
| tuple/projection/8/apply.replace        |         1,769.72 (113.92) |          1,770.26 (54.88) |  +0.03% |   +0.54% (13.25 pp) |
| tuple/tuple/8/apply.replace             |          1,025.53 (97.08) |          1,020.66 (11.23) |  -0.47% |    +0.08% (9.65 pp) |
| tuple/projection/8/apply.duplicate      |            620.17 (16.09) |            625.71 (55.73) |  +0.89% |    +6.08% (7.11 pp) |
| tuple/tuple/8/apply.duplicate           |               606 (26.26) |            628.82 (12.39) |  +3.77% |    +3.77% (6.32 pp) |
| tuple/projection/8/merge.duplicate      |          1,105.69 (22.36) |            1,091.8 (25.2) |  -1.26% |    -1.52% (0.89 pp) |
| tuple/tuple/8/merge.duplicate           |           1,130.2 (39.34) |            1,128.8 (99.9) |  -0.12% |   -0.12% (12.36 pp) |
| tuple/projection/8/length               |              27.44 (1.65) |              27.65 (0.23) |  +0.77% |    +0.70% (8.47 pp) |
| tuple/tuple/8/length                    |              28.02 (3.24) |              25.89 (1.88) |  -7.58% |   -5.20% (12.41 pp) |
| tuple/projection/8/value.random         |               52.58 (3.1) |               55.3 (3.55) |  +5.16% |    +6.29% (8.48 pp) |
| tuple/tuple/8/value.random              |              17.48 (0.77) |              18.38 (2.09) |  +5.18% |   +5.18% (21.44 pp) |
| tuple/projection/8/values               |             220.87 (4.63) |             222.99 (9.66) |  +0.96% |    +1.84% (1.75 pp) |
| tuple/tuple/8/values                    |            207.44 (11.98) |             203.77 (5.27) |  -1.77% |    -1.77% (8.19 pp) |
| tuple/projection/8/sequence             |             659.33 (5.95) |            644.12 (16.81) |  -2.31% |    -2.31% (3.44 pp) |
| tuple/tuple/8/sequence                  |            674.42 (13.48) |             697.16 (9.14) |  +3.37% |    +3.14% (2.66 pp) |
| tuple/projection/100/create.empty       |             435.08 (7.98) |            453.29 (14.38) |  +4.19% |    +1.69% (2.44 pp) |
| tuple/tuple/100/create.empty            |            460.06 (23.47) |            470.57 (14.44) |  +2.28% |    +2.40% (6.11 pp) |
| tuple/projection/100/create.sequence    |        13,860.45 (155.65) |         14,326.81 (64.03) |  +3.36% |    +3.45% (1.71 pp) |
| tuple/tuple/100/create.sequence         |        11,559.81 (182.55) |        11,324.39 (224.15) |  -2.04% |    -2.04% (8.31 pp) |
| tuple/projection/100/replace.random     |         1,165.38 (110.46) |           1,143.1 (76.12) |  -1.91% |    +0.36% (3.64 pp) |
| tuple/tuple/100/replace.random          |            633.84 (13.81) |            651.45 (13.94) |  +2.78% |     +2.78% (4.5 pp) |
| tuple/projection/100/apply.replace      |             1,750.64 (28) |         1,739.24 (119.73) |  -0.65% |    -3.16% (7.62 pp) |
| tuple/tuple/100/apply.replace           |            992.59 (15.44) |            998.17 (45.42) |  +0.56% |    +0.51% (0.84 pp) |
| tuple/projection/100/apply.duplicate    |             589.67 (4.29) |            628.58 (33.89) |  +6.60% |    +6.99% (7.23 pp) |
| tuple/tuple/100/apply.duplicate         |            586.65 (27.68) |            645.71 (30.71) | +10.07% |    +6.94% (6.45 pp) |
| tuple/projection/100/merge.duplicate    |         9,073.61 (170.65) |          9,617.7 (444.98) |  +6.00% |    +6.36% (2.12 pp) |
| tuple/tuple/100/merge.duplicate         |        12,901.95 (554.08) |        13,369.48 (371.51) |  +3.62% |    +3.17% (1.97 pp) |
| tuple/projection/100/length             |              28.54 (0.62) |              27.64 (0.88) |  -3.17% |   -5.67% (10.34 pp) |
| tuple/tuple/100/length                  |              27.58 (0.26) |               27.3 (1.76) |  -1.05% |    +0.40% (2.39 pp) |
| tuple/projection/100/value.random       |              78.96 (3.81) |              81.17 (4.16) |  +2.80% |     +4.51% (5.8 pp) |
| tuple/tuple/100/value.random            |              17.74 (0.54) |              18.43 (1.01) |  +3.91% |    +4.62% (8.71 pp) |
| tuple/projection/100/values             |          1,924.12 (39.25) |          1,839.48 (52.01) |  -4.40% |    -6.01% (2.39 pp) |
| tuple/tuple/100/values                  |           1,561.36 (7.03) |          1,514.93 (51.31) |  -2.97% |    -2.97% (3.71 pp) |
| tuple/projection/100/sequence           |         6,331.21 (198.66) |         5,965.32 (161.37) |  -5.78% |    -6.25% (5.97 pp) |
| tuple/tuple/100/sequence                |         5,653.12 (285.82) |         5,493.54 (127.24) |  -2.82% |    -3.62% (3.92 pp) |

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
