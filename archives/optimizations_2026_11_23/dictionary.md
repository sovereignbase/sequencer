# Session dictionary count guard

5 complete matched runs per build. Before: baseline; candidate: dictionary. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 40 timing medians improve over 5%; 74 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |                Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | --------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |              768.75 (72.64) |            764.92 (44.54) |  -0.50% |    -4.43% (6.47 pp) |
| throughput/1000/apply.duplicate         |              808.54 (19.39) |            851.68 (22.01) |  +5.34% |   +2.97% (26.08 pp) |
| throughput/5000/apply.duplicate         |               375.28 (13.1) |             377.11 (2.32) |  +0.49% |    +0.31% (3.73 pp) |
| throughput/10000/apply.duplicate        |               341.04 (1.72) |            342.92 (69.98) |  +0.55% |   +0.55% (23.79 pp) |
| throughput/15000/apply.duplicate        |              317.91 (13.25) |            325.28 (17.22) |  +2.32% |    +1.18% (2.07 pp) |
| throughput/20000/apply.duplicate        |              317.26 (14.47) |            318.77 (32.44) |  +0.48% |    +1.04% (8.97 pp) |
| throughput/25000/apply.duplicate        |              323.34 (14.79) |            328.01 (13.21) |  +1.44% |   +4.33% (13.52 pp) |
| throughput/100/apply.duplicateRemove    |               1,507 (158.4) |          1,599.23 (72.49) |  +6.12% |    +5.95% (2.78 pp) |
| throughput/1000/apply.duplicateRemove   |              832.85 (12.85) |             877.61 (27.2) |  +5.37% |   +8.16% (16.42 pp) |
| throughput/5000/apply.duplicateRemove   |              769.68 (65.21) |            745.71 (25.46) |  -3.11% |    -1.15% (5.55 pp) |
| throughput/10000/apply.duplicateRemove  |              700.99 (24.78) |            723.05 (24.27) |  +3.15% |    -0.39% (13.6 pp) |
| throughput/15000/apply.duplicateRemove  |              665.61 (28.89) |            681.01 (29.43) |  +2.31% |     +2.60% (1.9 pp) |
| throughput/20000/apply.duplicateRemove  |              668.58 (15.24) |            643.56 (21.83) |  -3.74% |    -3.74% (4.76 pp) |
| throughput/25000/apply.duplicateRemove  |              683.81 (31.11) |           655.42 (130.82) |  -4.15% |   -5.65% (31.62 pp) |
| throughput/100/apply.duplicateReplace   |            1,049.89 (76.74) |         1,061.03 (170.25) |  +1.06% |   -2.06% (12.35 pp) |
| throughput/1000/apply.duplicateReplace  |            1,040.79 (16.62) |             1,093.03 (84) |  +5.02% |   +7.27% (11.59 pp) |
| throughput/5000/apply.duplicateReplace  |               926.59 (21.8) |             917.6 (29.24) |  -0.97% |    -0.47% (6.55 pp) |
| throughput/10000/apply.duplicateReplace |              862.85 (47.78) |             918.52 (59.2) |  +6.45% |   +4.54% (11.12 pp) |
| throughput/15000/apply.duplicateReplace |              831.78 (91.55) |             875.58 (14.4) |  +5.27% |   +6.90% (12.41 pp) |
| throughput/20000/apply.duplicateReplace |               876.74 (89.9) |            827.84 (46.85) |  -5.58% |   -6.88% (12.33 pp) |
| throughput/25000/apply.duplicateReplace |              871.13 (61.99) |              873.42 (6.3) |  +0.26% |    +0.97% (6.01 pp) |
| throughput/100/apply.insert             |           1,590.32 (132.95) |         1,552.17 (153.47) |  -2.40% |    -2.14% (9.58 pp) |
| throughput/1000/apply.insert            |           1,407.79 (221.96) |          1,371.94 (147.9) |  -2.55% |     +0.30% (8.4 pp) |
| throughput/5000/apply.insert            |           1,308.25 (209.16) |          1,235.93 (31.42) |  -5.53% |   -5.53% (11.28 pp) |
| throughput/10000/apply.insert           |           1,335.82 (144.45) |         1,344.17 (297.96) |  +0.63% |  +10.61% (17.03 pp) |
| throughput/15000/apply.insert           |           1,257.34 (111.25) |          1,290.14 (65.33) |  +2.61% |    +4.35% (8.07 pp) |
| throughput/20000/apply.insert           |            1,242.18 (342.8) |           1,197.9 (89.34) |  -3.56% |    -3.56% (14.4 pp) |
| throughput/25000/apply.insert           |           1,260.66 (209.39) |         1,203.73 (195.26) |  -4.52% |   -4.34% (12.92 pp) |
| throughput/100/apply.remove             |            1,816.75 (48.33) |         1,895.79 (264.64) |  +4.35% |   +0.68% (14.15 pp) |
| throughput/1000/apply.remove            |            1,434.13 (87.07) |         1,556.21 (335.75) |  +8.51% |  +17.10% (19.59 pp) |
| throughput/5000/apply.remove            |             1,468.95 (87.1) |          1,505.17 (61.59) |  +2.47% |    -0.82% (2.06 pp) |
| throughput/10000/apply.remove           |            1,436.28 (64.65) |         1,516.64 (231.68) |  +5.60% |    +5.48% (3.74 pp) |
| throughput/15000/apply.remove           |             1,440.19 (5.46) |         1,577.45 (166.05) |  +9.53% |     +9.07% (9.5 pp) |
| throughput/20000/apply.remove           |            1,475.86 (71.84) |         1,573.34 (209.85) |  +6.60% |   -1.37% (17.16 pp) |
| throughput/25000/apply.remove           |            1,726.85 (121.9) |           1,653.7 (88.86) |  -4.24% |    -8.54% (6.24 pp) |
| throughput/100/apply.replace            |            2,548.75 (62.93) |         2,771.89 (176.07) |  +8.75% |   +8.50% (17.09 pp) |
| throughput/1000/apply.replace           |            2,616.3 (168.09) |           2,726.2 (208.2) |  +4.20% |    +5.07% (4.38 pp) |
| throughput/5000/apply.replace           |           2,682.43 (300.45) |          2,684.76 (82.74) |  +0.09% |    +0.10% (3.76 pp) |
| throughput/10000/apply.replace          |            2,580.09 (82.23) |          2,778.02 (414.8) |  +7.67% |   +9.55% (11.78 pp) |
| throughput/15000/apply.replace          |           2,657.71 (216.13) |          2,631.25 (166.9) |  -1.00% |    +0.75% (6.01 pp) |
| throughput/20000/apply.replace          |           2,622.21 (338.46) |         2,612.14 (216.94) |  -0.38% |    -0.73% (1.28 pp) |
| throughput/25000/apply.replace          |            2,787.7 (252.31) |          2,832.6 (210.25) |  +1.61% |   -4.48% (12.37 pp) |
| throughput/100/create.empty             |              556.23 (50.07) |            583.14 (84.55) |  +4.84% |   +7.27% (24.13 pp) |
| throughput/1000/create.empty            |              770.08 (75.72) |           735.71 (101.52) |  -4.46% |   +1.43% (18.54 pp) |
| throughput/5000/create.empty            |              762.09 (63.12) |            787.37 (26.77) |  +3.32% |   -2.64% (10.06 pp) |
| throughput/10000/create.empty           |              741.53 (48.36) |             822.39 (93.3) | +10.90% |    +8.91% (18.1 pp) |
| throughput/15000/create.empty           |              793.74 (66.87) |            756.64 (38.06) |  -4.67% |   -8.29% (13.11 pp) |
| throughput/20000/create.empty           |               840.85 (86.6) |            721.04 (51.22) | -14.25% |   -10.83% (4.55 pp) |
| throughput/25000/create.empty           |                820.64 (102) |            703.17 (57.85) | -14.31% |   -13.24% (6.11 pp) |
| throughput/100/create.sequence          |           1,592.14 (104.97) |         1,599.38 (114.06) |  +0.45% |   +2.51% (14.18 pp) |
| throughput/1000/create.sequence         |           1,980.12 (292.55) |         1,916.83 (147.26) |  -3.20% |  +13.35% (15.61 pp) |
| throughput/5000/create.sequence         |             1,656.6 (34.15) |         1,572.34 (186.02) |  -5.09% |    -5.01% (9.61 pp) |
| throughput/10000/create.sequence        |           1,639.99 (184.64) |         1,663.24 (248.94) |  +1.42% |    -1.35% (5.78 pp) |
| throughput/15000/create.sequence        |             1,442.15 (37.6) |          1,414.51 (50.04) |  -1.92% |    -5.21% (3.91 pp) |
| throughput/20000/create.sequence        |             1,681.72 (91.6) |         1,639.71 (261.46) |  -2.50% |    -2.50% (3.97 pp) |
| throughput/25000/create.sequence        |           1,640.18 (208.11) |          1,545.39 (258.3) |  -5.78% |   -0.87% (31.73 pp) |
| throughput/100/insert.head              |               502.38 (7.17) |            541.13 (21.23) |  +7.71% |     +8.12% (9.1 pp) |
| throughput/1000/insert.head             |              502.83 (28.43) |             524.4 (28.48) |  +4.29% |   +6.53% (17.16 pp) |
| throughput/5000/insert.head             |              503.44 (18.99) |           556.15 (111.95) | +10.47% |  +13.65% (19.32 pp) |
| throughput/10000/insert.head            |              499.62 (41.19) |            514.15 (95.59) |  +2.91% |   +12.68% (9.89 pp) |
| throughput/15000/insert.head            |              472.51 (11.41) |            489.11 (64.14) |  +3.51% |   +3.07% (14.73 pp) |
| throughput/20000/insert.head            |              460.42 (43.85) |            484.76 (36.15) |  +5.29% |   +3.37% (19.28 pp) |
| throughput/25000/insert.head            |              461.75 (66.95) |            477.78 (46.85) |  +3.47% |   +3.74% (22.48 pp) |
| throughput/100/insert.middle            |               581.6 (27.88) |            567.83 (49.99) |  -2.37% |   -6.42% (11.35 pp) |
| throughput/1000/insert.middle           |              618.99 (26.17) |             636.32 (12.5) |  +2.80% |    +6.70% (7.36 pp) |
| throughput/5000/insert.middle           |               591.3 (17.83) |            598.03 (24.65) |  +1.14% |    +0.94% (2.49 pp) |
| throughput/10000/insert.middle          |               615.4 (11.01) |            590.77 (25.82) |  -4.00% |    -1.60% (4.18 pp) |
| throughput/15000/insert.middle          |              537.57 (37.11) |            563.52 (46.06) |  +4.83% |    -0.37% (7.23 pp) |
| throughput/20000/insert.middle          |              571.83 (26.76) |            557.22 (37.71) |  -2.55% |    +0.51% (3.78 pp) |
| throughput/25000/insert.middle          |             555.81 (169.93) |            551.65 (45.14) |  -0.75% |   -2.46% (19.42 pp) |
| throughput/100/insert.random            |              845.9 (115.09) |            847.63 (42.51) |  +0.20% |   -1.55% (15.93 pp) |
| throughput/1000/insert.random           |               895.92 (5.07) |         1,027.75 (310.03) | +14.71% |  +14.71% (37.68 pp) |
| throughput/5000/insert.random           |              882.83 (43.14) |            867.48 (44.22) |  -1.74% |    -2.19% (5.45 pp) |
| throughput/10000/insert.random          |              876.01 (48.94) |             824.02 (68.4) |  -5.93% |    -2.77% (2.26 pp) |
| throughput/15000/insert.random          |                810.4 (5.94) |           862.29 (171.08) |  +6.40% |   +9.26% (14.25 pp) |
| throughput/20000/insert.random          |               850.42 (7.45) |            830.25 (26.84) |  -2.37% |    +0.22% (6.56 pp) |
| throughput/25000/insert.random          |              837.25 (48.63) |             830.58 (4.56) |  -0.80% |    -0.80% (7.26 pp) |
| throughput/100/insert.sameIndex         |              555.56 (70.98) |            564.43 (38.58) |  +1.60% |   +0.80% (12.74 pp) |
| throughput/1000/insert.sameIndex        |               546.25 (12.6) |            593.94 (84.29) |  +8.73% |  +10.57% (16.49 pp) |
| throughput/5000/insert.sameIndex        |              549.58 (12.94) |             545.2 (50.08) |  -0.80% |   +5.56% (13.04 pp) |
| throughput/10000/insert.sameIndex       |              533.48 (49.41) |            539.48 (15.48) |  +1.12% |    +0.73% (9.48 pp) |
| throughput/15000/insert.sameIndex       |              512.27 (81.03) |            573.53 (39.03) | +11.96% |  +20.16% (25.47 pp) |
| throughput/20000/insert.sameIndex       |              514.66 (38.34) |            529.96 (15.74) |  +2.97% |    +0.14% (7.35 pp) |
| throughput/25000/insert.sameIndex       |              510.54 (19.62) |            507.03 (39.92) |  -0.69% |   +4.57% (13.47 pp) |
| throughput/100/insert.tail              |              762.68 (49.57) |            818.61 (21.96) |  +7.33% |  +15.42% (13.56 pp) |
| throughput/1000/insert.tail             |              791.45 (64.23) |           831.58 (171.87) |  +5.07% |   -0.49% (10.82 pp) |
| throughput/5000/insert.tail             |              912.47 (23.83) |              948.7 (54.7) |  +3.97% |    -0.67% (7.53 pp) |
| throughput/10000/insert.tail            |              820.5 (140.45) |           797.03 (131.12) |  -2.86% |    -2.86% (17.8 pp) |
| throughput/15000/insert.tail            |              767.57 (54.82) |             855.8 (58.81) | +11.49% |      +12.53% (8 pp) |
| throughput/20000/insert.tail            |             769.26 (151.68) |             755.9 (55.99) |  -1.74% |    -1.41% (7.43 pp) |
| throughput/25000/insert.tail            |             882.29 (133.59) |            847.38 (25.82) |  -3.96% |    -1.11% (4.75 pp) |
| throughput/100/length                   |              113.12 (29.49) |            121.34 (29.83) |  +7.27% |   -4.40% (44.39 pp) |
| throughput/1000/length                  |               104.66 (3.44) |             115.36 (4.84) | +10.22% |   +11.67% (10.6 pp) |
| throughput/5000/length                  |               114.08 (2.78) |             110.09 (3.97) |  -3.50% |    -1.55% (1.96 pp) |
| throughput/10000/length                 |                111.7 (7.76) |             110.56 (7.97) |  -1.02% |   -3.76% (10.52 pp) |
| throughput/15000/length                 |                108.03 (5.1) |            108.32 (13.29) |  +0.27% |   +0.27% (17.42 pp) |
| throughput/20000/length                 |               107.66 (5.44) |             106.84 (7.87) |  -0.76% |    -1.22% (9.88 pp) |
| throughput/25000/length                 |               104.81 (6.13) |              97.47 (3.61) |  -7.00% |    -3.95% (3.38 pp) |
| throughput/100/merge.duplicate          |              779.97 (104.3) |            883.12 (86.55) | +13.22% |   +6.47% (14.26 pp) |
| throughput/1000/merge.duplicate         |               652.98 (30.9) |            662.74 (29.49) |  +1.49% |    +4.57% (2.33 pp) |
| throughput/5000/merge.duplicate         |              649.82 (18.65) |           669.45 (117.07) |  +3.02% |   +3.20% (10.52 pp) |
| throughput/10000/merge.duplicate        |              658.34 (55.77) |            621.29 (25.85) |  -5.63% |       -3.23% (5 pp) |
| throughput/15000/merge.duplicate        |              597.18 (17.51) |            615.43 (31.17) |  +3.06% |    -1.91% (5.99 pp) |
| throughput/20000/merge.duplicate        |               594.7 (31.39) |            594.58 (25.23) |  -0.02% |    -2.98% (6.62 pp) |
| throughput/25000/merge.duplicate        |              633.29 (62.21) |            592.68 (27.42) |  -6.41% |   -0.44% (13.67 pp) |
| throughput/100/merge.insert             |            1,689.35 (72.82) |           1,758.01 (88.2) |  +4.06% |    +5.11% (6.85 pp) |
| throughput/1000/merge.insert            |           1,512.81 (125.43) |          1,510.69 (73.79) |  -0.14% |    -2.99% (3.62 pp) |
| throughput/5000/merge.insert            |             1,576.98 (84.1) |          1,541.08 (31.83) |  -2.28% |    +1.55% (8.81 pp) |
| throughput/10000/merge.insert           |             1,585.13 (3.92) |         1,516.39 (120.67) |  -4.34% |    -1.55% (7.55 pp) |
| throughput/15000/merge.insert           |            1,519.04 (95.23) |          1,366.52 (253.3) | -10.04% |   -2.57% (11.39 pp) |
| throughput/20000/merge.insert           |           1,504.65 (129.34) |         1,446.71 (133.51) |  -3.85% |    +1.65% (6.86 pp) |
| throughput/25000/merge.insert           |            1,310.72 (79.42) |         1,431.46 (145.63) |  +9.21% |   +6.45% (10.95 pp) |
| throughput/100/remove.head              |             813.18 (201.79) |            741.77 (44.96) |  -8.78% |   -2.39% (28.44 pp) |
| throughput/1000/remove.head             |              770.89 (43.12) |            789.36 (32.69) |  +2.40% |   +0.02% (11.34 pp) |
| throughput/5000/remove.head             |              804.03 (28.98) |            866.52 (60.06) |  +7.77% |   +4.30% (10.82 pp) |
| throughput/10000/remove.head            |              875.79 (25.77) |             879.64 (18.9) |  +0.44% |    +3.15% (7.69 pp) |
| throughput/15000/remove.head            |              834.33 (86.64) |           944.35 (114.32) | +13.19% |   +13.19% (0.59 pp) |
| throughput/20000/remove.head            |               905.59 (24.5) |             937.04 (6.84) |  +3.47% |    +3.30% (4.99 pp) |
| throughput/25000/remove.head            |              914.2 (106.86) |                900 (41.5) |  -1.55% |    -4.65% (6.97 pp) |
| throughput/100/remove.middle            |             827.87 (153.08) |            782.16 (91.95) |  -5.52% |   +0.45% (12.99 pp) |
| throughput/1000/remove.middle           |              789.31 (69.45) |             806.5 (49.94) |  +2.18% |    +7.50% (8.87 pp) |
| throughput/5000/remove.middle           |              866.57 (46.91) |           814.86 (175.97) |  -5.97% |   -0.59% (11.52 pp) |
| throughput/10000/remove.middle          |              821.26 (50.83) |             839.5 (53.32) |  +2.22% |    +4.44% (3.44 pp) |
| throughput/15000/remove.middle          |               838.54 (5.59) |            890.54 (78.99) |  +6.20% |    +6.48% (2.32 pp) |
| throughput/20000/remove.middle          |              919.72 (25.15) |            896.06 (47.37) |  -2.57% |    -2.66% (1.27 pp) |
| throughput/25000/remove.middle          |               896.4 (30.53) |               906.09 (15) |  +1.08% |    -0.41% (0.95 pp) |
| throughput/100/remove.random            |            1,068.62 (80.61) |         1,051.14 (126.03) |  -1.64% |    -5.06% (8.44 pp) |
| throughput/1000/remove.random           |            1,142.29 (34.16) |           1,218.34 (37.7) |  +6.66% |    +7.52% (6.22 pp) |
| throughput/5000/remove.random           |            1,169.35 (19.09) |         1,195.19 (235.32) |  +2.21% |   +3.55% (14.67 pp) |
| throughput/10000/remove.random          |            1,214.25 (28.79) |          1,148.31 (48.29) |  -5.43% |    -4.55% (5.37 pp) |
| throughput/15000/remove.random          |            1,159.56 (18.56) |          1,153.53 (68.84) |  -0.52% |   -2.16% (11.33 pp) |
| throughput/20000/remove.random          |            1,256.19 (46.81) |          1,211.25 (18.04) |  -3.58% |    -4.50% (5.16 pp) |
| throughput/25000/remove.random          |            1,286.29 (66.13) |          1,201.19 (60.25) |  -6.62% |   -8.47% (12.98 pp) |
| throughput/100/remove.sameIndex         |             941.01 (130.05) |           963.89 (166.53) |  +2.43% |   -0.94% (11.37 pp) |
| throughput/1000/remove.sameIndex        |              791.17 (70.46) |            793.81 (77.32) |  +0.33% |    +0.33% (7.85 pp) |
| throughput/5000/remove.sameIndex        |               840.2 (19.94) |           830.51 (138.37) |  -1.15% |   -4.55% (22.75 pp) |
| throughput/10000/remove.sameIndex       |             800.13 (117.27) |             846.49 (13.2) |  +5.79% |   +1.95% (13.23 pp) |
| throughput/15000/remove.sameIndex       |               829.1 (44.68) |            826.42 (10.33) |  -0.32% |    -0.34% (5.09 pp) |
| throughput/20000/remove.sameIndex       |              879.38 (28.19) |             908.1 (75.76) |  +3.27% |    +4.57% (8.26 pp) |
| throughput/25000/remove.sameIndex       |              909.84 (56.75) |            923.76 (20.41) |  +1.53% |    +0.76% (6.25 pp) |
| throughput/100/remove.tail              |              760.02 (83.26) |            775.82 (75.98) |  +2.08% |    +6.48% (6.87 pp) |
| throughput/1000/remove.tail             |              714.41 (33.28) |            697.77 (45.24) |  -2.33% |   +3.25% (12.04 pp) |
| throughput/5000/remove.tail             |              725.49 (15.18) |            715.41 (68.97) |  -1.39% |   -3.13% (15.41 pp) |
| throughput/10000/remove.tail            |              750.55 (23.07) |           743.05 (115.23) |  -1.00% |   +1.32% (11.14 pp) |
| throughput/15000/remove.tail            |               758.6 (43.48) |            728.15 (91.76) |  -4.01% |   +3.39% (11.15 pp) |
| throughput/20000/remove.tail            |              856.63 (71.88) |            821.51 (51.33) |  -4.10% |    -4.85% (3.93 pp) |
| throughput/25000/remove.tail            |              786.59 (66.57) |            797.58 (18.83) |  +1.40% |   -0.58% (10.69 pp) |
| throughput/100/replace.head             |           1,026.39 (127.66) |          1,083.18 (143.2) |  +5.53% |   -3.60% (24.07 pp) |
| throughput/1000/replace.head            |            1,148.12 (49.71) |           1,135.4 (55.92) |  -1.11% |    +2.13% (2.12 pp) |
| throughput/5000/replace.head            |            1,142.99 (79.61) |          1,178.68 (85.94) |  +3.12% |   +6.73% (12.29 pp) |
| throughput/10000/replace.head           |            1,133.78 (13.97) |          1,164.53 (34.77) |  +2.71% |    +2.08% (2.45 pp) |
| throughput/15000/replace.head           |            1,121.25 (72.13) |         1,151.67 (102.71) |  +2.71% |    -1.90% (1.79 pp) |
| throughput/20000/replace.head           |            1,198.48 (137.9) |          1,218.06 (45.37) |  +1.63% |    -2.09% (7.03 pp) |
| throughput/25000/replace.head           |           1,184.99 (119.44) |             1,184.61 (60) |  -0.03% |    -0.28% (8.11 pp) |
| throughput/100/replace.middle           |             1,133.6 (48.58) |          1,117.79 (93.74) |  -1.39% |   -0.89% (12.57 pp) |
| throughput/1000/replace.middle          |              1,178.5 (81.7) |          1,203.08 (17.46) |  +2.09% |    +3.89% (4.24 pp) |
| throughput/5000/replace.middle          |            1,149.59 (57.82) |         1,179.98 (134.51) |  +2.64% |   +1.79% (14.07 pp) |
| throughput/10000/replace.middle         |            1,234.19 (14.09) |          1,219.04 (97.66) |  -1.23% |   +0.98% (11.12 pp) |
| throughput/15000/replace.middle         |            1,194.03 (16.42) |          1,192.97 (41.03) |  -0.09% |     +0.25% (3.9 pp) |
| throughput/20000/replace.middle         |           1,302.31 (144.69) |          1,317.09 (59.83) |  +1.13% |   -5.68% (14.21 pp) |
| throughput/25000/replace.middle         |            1,219.66 (93.81) |          1,268.08 (27.77) |  +3.97% |    +2.76% (7.57 pp) |
| throughput/100/replace.random           |           1,699.27 (157.77) |         1,735.39 (140.25) |  +2.13% |    +2.13% (6.83 pp) |
| throughput/1000/replace.random          |            1,758.14 (71.03) |          1,728.77 (74.97) |  -1.67% |    +6.03% (9.53 pp) |
| throughput/5000/replace.random          |           1,715.88 (110.08) |         1,769.47 (156.41) |  +3.12% |   +1.17% (11.31 pp) |
| throughput/10000/replace.random         |            1,732.59 (74.28) |          1,723.27 (62.57) |  -0.54% |    +3.13% (7.99 pp) |
| throughput/15000/replace.random         |            1,611.29 (73.22) |          1,720.28 (32.96) |  +6.76% |   +2.22% (13.16 pp) |
| throughput/20000/replace.random         |            1,810.42 (76.28) |         1,695.09 (156.28) |  -6.37% |    -4.34% (4.98 pp) |
| throughput/25000/replace.random         |             1,754.4 (94.34) |           1,743.14 (69.1) |  -0.64% |    -3.06% (2.09 pp) |
| throughput/100/replace.sameIndex        |            1,116.23 (86.17) |          1,149.95 (41.56) |  +3.02% |    +5.11% (9.11 pp) |
| throughput/1000/replace.sameIndex       |            1,146.72 (64.75) |           1,140.73 (70.1) |  -0.52% |    -0.18% (8.85 pp) |
| throughput/5000/replace.sameIndex       |              1,124.9 (53.9) |          1,154.19 (29.86) |  +2.60% |    +5.43% (9.51 pp) |
| throughput/10000/replace.sameIndex      |            1,101.56 (37.72) |          1,144.88 (32.31) |  +3.93% |    +3.52% (1.74 pp) |
| throughput/15000/replace.sameIndex      |            1,113.73 (62.72) |         1,145.19 (187.41) |  +2.82% |   -1.43% (21.83 pp) |
| throughput/20000/replace.sameIndex      |            1,183.22 (29.59) |          1,187.73 (53.17) |  +0.38% |    -0.11% (4.93 pp) |
| throughput/25000/replace.sameIndex      |           1,136.74 (120.46) |          1,273.37 (47.41) | +12.02% |   +9.68% (12.77 pp) |
| throughput/100/replace.tail             |           1,099.34 (117.72) |           1,162.94 (76.2) |  +5.79% |   +5.79% (11.27 pp) |
| throughput/1000/replace.tail            |              1,188.6 (60.4) |           1,186.46 (56.4) |  -0.18% |    +0.30% (5.21 pp) |
| throughput/5000/replace.tail            |            1,143.56 (57.55) |           1,136.92 (21.6) |  -0.58% |    +0.30% (5.63 pp) |
| throughput/10000/replace.tail           |             1,132.74 (30.1) |         1,189.22 (103.18) |  +4.99% |    +6.20% (5.74 pp) |
| throughput/15000/replace.tail           |             1,111.36 (4.67) |          1,164.92 (80.22) |  +4.82% |    +5.02% (7.45 pp) |
| throughput/20000/replace.tail           |             1,178.85 (28.4) |          1,238.35 (17.08) |  +5.05% |    +5.05% (4.64 pp) |
| throughput/25000/replace.tail           |           1,228.15 (137.59) |         1,254.96 (217.64) |  +2.18% |  +10.14% (23.83 pp) |
| throughput/100/retire                   |              200.76 (25.81) |            220.87 (99.57) | +10.02% |  +25.34% (47.09 pp) |
| throughput/1000/retire                  |               214.71 (8.77) |            217.81 (10.03) |  +1.44% |    -0.16% (5.85 pp) |
| throughput/5000/retire                  |               204.6 (12.99) |            199.93 (10.93) |  -2.28% |    -4.62% (7.29 pp) |
| throughput/10000/retire                 |                 203.69 (14) |             205.9 (14.85) |  +1.08% |    +7.44% (2.44 pp) |
| throughput/15000/retire                 |               200.11 (7.16) |            190.54 (16.25) |  -4.78% |    -3.95% (9.77 pp) |
| throughput/20000/retire                 |                191.38 (9.7) |             183.62 (5.45) |  -4.05% |    -3.11% (8.83 pp) |
| throughput/25000/retire                 |                181.9 (3.77) |             194.83 (7.78) |  +7.11% |     +8.32% (1.9 pp) |
| throughput/100/sequence                 |              293.93 (24.73) |            364.83 (45.99) | +24.12% |   +15.32% (5.08 pp) |
| throughput/1000/sequence                |              307.13 (15.24) |             298.03 (8.33) |  -2.96% |    -0.66% (5.24 pp) |
| throughput/5000/sequence                |               281.16 (7.89) |            279.46 (14.39) |  -0.60% |    -2.65% (7.36 pp) |
| throughput/10000/sequence               |              265.74 (21.56) |             260.79 (63.1) |  -1.86% |   -4.44% (36.66 pp) |
| throughput/15000/sequence               |               256.16 (2.27) |            261.55 (12.83) |  +2.10% |    -0.99% (5.78 pp) |
| throughput/20000/sequence               |               259.4 (12.63) |            283.58 (47.03) |  +9.32% |   +5.97% (11.86 pp) |
| throughput/25000/sequence               |                250.7 (5.16) |            266.18 (24.04) |  +6.17% |    +6.08% (12.2 pp) |
| throughput/100/value.head               |              191.36 (27.23) |            195.03 (12.54) |  +1.92% |    +2.25% (9.57 pp) |
| throughput/1000/value.head              |               160.02 (8.69) |             165.13 (9.49) |  +3.19% |     +5.84% (3.7 pp) |
| throughput/5000/value.head              |              145.35 (15.94) |             145.96 (1.73) |  +0.42% |    -1.17% (3.51 pp) |
| throughput/10000/value.head             |               141.01 (2.75) |              151.4 (4.06) |  +7.37% |    +9.19% (5.26 pp) |
| throughput/15000/value.head             |               128.26 (4.28) |            139.58 (14.24) |  +8.83% |   +6.31% (15.06 pp) |
| throughput/20000/value.head             |               133.33 (5.49) |             134.97 (5.25) |  +1.23% |    +1.23% (8.27 pp) |
| throughput/25000/value.head             |              124.82 (15.48) |             135.71 (7.12) |  +8.72% |   +5.55% (16.95 pp) |
| throughput/100/value.middle             |              258.44 (25.36) |            297.11 (27.07) | +14.96% |   +8.32% (31.21 pp) |
| throughput/1000/value.middle            |               260.68 (20.6) |              262.53 (7.7) |  +0.71% |   +1.28% (18.42 pp) |
| throughput/5000/value.middle            |               230.94 (5.73) |            221.63 (12.09) |  -4.03% |    -1.81% (3.33 pp) |
| throughput/10000/value.middle           |               216.68 (12.2) |             216.72 (6.45) |  +0.02% |    -0.62% (7.95 pp) |
| throughput/15000/value.middle           |               203.77 (7.06) |            214.11 (11.13) |  +5.07% |    +6.76% (8.75 pp) |
| throughput/20000/value.middle           |              213.61 (14.12) |             213.6 (24.25) |  -0.00% |   +6.78% (13.46 pp) |
| throughput/25000/value.middle           |               211.83 (9.47) |             218.04 (2.36) |  +2.93% |    -0.07% (7.16 pp) |
| throughput/100/value.random             |               214.47 (3.39) |             232.25 (9.17) |  +8.29% |     +9.61% (6.8 pp) |
| throughput/1000/value.random            |               225.26 (4.71) |              228.75 (4.8) |  +1.55% |    +2.36% (3.38 pp) |
| throughput/5000/value.random            |               256.06 (2.06) |            260.55 (27.92) |  +1.75% |   +5.78% (11.41 pp) |
| throughput/10000/value.random           |              289.92 (15.81) |             266.66 (7.13) |  -8.02% |    -8.37% (4.31 pp) |
| throughput/15000/value.random           |              269.27 (59.41) |             252.92 (8.38) |  -6.07% |   -2.35% (22.42 pp) |
| throughput/20000/value.random           |                265.2 (7.81) |            268.27 (13.47) |  +1.16% |    +5.93% (5.83 pp) |
| throughput/25000/value.random           |                 254 (13.12) |             263.76 (5.67) |  +3.84% |     +4.66% (3.5 pp) |
| throughput/100/value.sameIndex          |                193.4 (6.22) |            208.04 (18.08) |  +7.57% |  +10.92% (14.89 pp) |
| throughput/1000/value.sameIndex         |              187.06 (11.71) |             180.92 (0.66) |  -3.28% |   -2.95% (12.05 pp) |
| throughput/5000/value.sameIndex         |              176.78 (13.65) |             172.81 (7.12) |  -2.25% |   -0.42% (10.67 pp) |
| throughput/10000/value.sameIndex        |              165.56 (11.02) |               167.7 (3.8) |  +1.29% |   +1.29% (10.05 pp) |
| throughput/15000/value.sameIndex        |               160.55 (9.79) |            169.92 (17.97) |  +5.84% |   +4.26% (12.07 pp) |
| throughput/20000/value.sameIndex        |                162.4 (5.71) |              157.75 (2.7) |  -2.86% |    -5.08% (4.74 pp) |
| throughput/25000/value.sameIndex        |              162.18 (15.34) |            149.01 (12.12) |  -8.12% |   -5.57% (11.15 pp) |
| throughput/100/value.tail               |               260.2 (12.22) |             253.93 (45.8) |  -2.41% |   +6.98% (12.02 pp) |
| throughput/1000/value.tail              |               215.08 (2.48) |             208.41 (6.35) |  -3.10% |   -1.34% (11.81 pp) |
| throughput/5000/value.tail              |               199.17 (5.89) |              194.9 (7.08) |  -2.14% |    -2.13% (7.88 pp) |
| throughput/10000/value.tail             |               184.57 (5.04) |             193.69 (6.71) |  +4.94% |    +2.87% (5.88 pp) |
| throughput/15000/value.tail             |              189.84 (13.12) |             182.89 (5.18) |  -3.66% |    -2.23% (7.38 pp) |
| throughput/20000/value.tail             |               184.77 (6.26) |             180.45 (5.65) |  -2.34% |    +0.55% (3.02 pp) |
| throughput/25000/value.tail             |                  182 (7.84) |            174.75 (20.25) |  -3.98% |    -6.80% (11.2 pp) |
| throughput/100/values                   |            4,224.2 (223.91) |         4,179.69 (559.05) |  -1.05% |   +4.08% (18.42 pp) |
| throughput/1000/values                  |       160,990.77 (5,217.43) |     156,544.84 (3,338.44) |  -2.76% |    -1.01% (3.68 pp) |
| throughput/5000/values                  |      501,952.34 (43,647.66) |    563,003.65 (15,011.98) | +12.16% |  +14.18% (11.83 pp) |
| throughput/10000/values                 |   1,080,317.19 (114,563.28) |  1,167,768.75 (36,456.25) |  +8.09% |   +7.72% (11.53 pp) |
| throughput/15000/values                 |    1,656,581.25 (57,718.75) | 1,699,410.94 (120,785.94) |  +2.59% |    +0.15% (8.41 pp) |
| throughput/20000/values                 |    2,326,256.25 (107,762.5) | 2,346,820.31 (243,545.31) |  +0.88% |    +0.88% (4.71 pp) |
| throughput/25000/values                 | 3,143,373.44 (1,369,457.81) |  2,862,253.13 (92,826.56) |  -8.94% |   -8.94% (27.24 pp) |
| throughput/100/values.head              |               308.81 (0.83) |            320.01 (39.23) |  +3.63% |    +6.00% (9.28 pp) |
| throughput/1000/values.head             |              245.15 (15.15) |             252.15 (4.47) |  +2.86% |    +2.86% (8.36 pp) |
| throughput/5000/values.head             |              258.43 (12.54) |               265.73 (14) |  +2.82% |    +0.09% (1.35 pp) |
| throughput/10000/values.head            |              248.54 (24.67) |             256.83 (53.3) |  +3.34% |   +6.45% (30.28 pp) |
| throughput/15000/values.head            |                252.4 (2.71) |             252.23 (5.52) |  -0.07% |   -0.28% (17.39 pp) |
| throughput/20000/values.head            |              263.65 (12.83) |            245.47 (28.51) |  -6.90% |    -6.08% (2.83 pp) |
| throughput/25000/values.head            |              254.79 (18.59) |            233.34 (11.55) |  -8.42% |   -8.75% (14.45 pp) |
| throughput/100/values.middle            |              289.44 (18.21) |             303.1 (24.36) |  +4.72% |    +2.99% (3.13 pp) |
| throughput/1000/values.middle           |                247.03 (6.7) |             247.06 (7.63) |  +0.01% |    +2.88% (6.64 pp) |
| throughput/5000/values.middle           |              256.08 (16.98) |            255.21 (30.89) |  -0.34% |    +2.47% (2.15 pp) |
| throughput/10000/values.middle          |               260.19 (7.28) |             256.28 (5.97) |  -1.50% |   -1.85% (17.24 pp) |
| throughput/15000/values.middle          |               228.84 (8.44) |            231.28 (27.41) |  +1.07% |   +8.23% (18.42 pp) |
| throughput/20000/values.middle          |              242.87 (20.23) |            262.35 (89.53) |  +8.02% |    +6.45% (6.69 pp) |
| throughput/25000/values.middle          |              247.24 (33.72) |             212.64 (9.25) | -13.99% |  -14.46% (11.65 pp) |
| throughput/100/values.random            |               303.91 (1.18) |            310.48 (29.13) |  +2.16% |    +5.24% (7.64 pp) |
| throughput/1000/values.random           |              276.43 (12.04) |             281.04 (7.89) |  +1.67% |     -1.87% (4.2 pp) |
| throughput/5000/values.random           |              326.64 (99.77) |             324.58 (4.22) |  -0.63% |   -3.84% (25.25 pp) |
| throughput/10000/values.random          |              361.48 (90.22) |            326.44 (21.96) |  -9.69% |  -11.87% (22.92 pp) |
| throughput/15000/values.random          |              381.26 (25.27) |            361.21 (43.25) |  -5.26% |   -5.26% (20.46 pp) |
| throughput/20000/values.random          |             478.93 (140.69) |            376.04 (30.94) | -21.48% |  -15.79% (27.22 pp) |
| throughput/25000/values.random          |              387.45 (56.69) |             347.5 (68.56) | -10.31% |    -6.16% (29.8 pp) |
| throughput/100/values.sameIndex         |              284.62 (12.91) |            289.45 (31.52) |  +1.70% |    +8.85% (7.31 pp) |
| throughput/1000/values.sameIndex        |               248.53 (9.77) |             259.93 (11.3) |  +4.59% |    +4.59% (4.08 pp) |
| throughput/5000/values.sameIndex        |              249.97 (19.31) |            267.69 (10.74) |  +7.09% |   +9.54% (13.13 pp) |
| throughput/10000/values.sameIndex       |              248.25 (23.37) |              246.89 (8.7) |  -0.55% |       -1.00% (7 pp) |
| throughput/15000/values.sameIndex       |              226.56 (24.63) |             227.6 (11.31) |  +0.46% |    -3.32% (4.77 pp) |
| throughput/20000/values.sameIndex       |              251.83 (17.77) |            238.14 (16.55) |  -5.44% |   -7.54% (16.53 pp) |
| throughput/25000/values.sameIndex       |              218.48 (53.15) |             213.72 (1.16) |  -2.18% |   -2.18% (19.32 pp) |
| throughput/100/values.tail              |              282.38 (31.23) |            286.34 (24.65) |  +1.40% |   +10.48% (23.1 pp) |
| throughput/1000/values.tail             |                 249.8 (7.9) |             247.65 (1.88) |  -0.86% |    -0.36% (4.29 pp) |
| throughput/5000/values.tail             |              239.75 (15.03) |              249.51 (8.5) |  +4.07% |    +1.70% (4.75 pp) |
| throughput/10000/values.tail            |              246.34 (31.28) |             240.82 (5.27) |  -2.24% |    +0.24% (9.41 pp) |
| throughput/15000/values.tail            |               225.59 (9.16) |             223.51 (8.24) |  -0.92% |       +5.68% (8 pp) |
| throughput/20000/values.tail            |               275.3 (28.81) |              232.5 (0.64) | -15.55% |   -15.55% (4.48 pp) |
| throughput/25000/values.tail            |                233.1 (2.64) |            225.01 (14.68) |  -3.47% |    -6.57% (7.09 pp) |
| lifecycle/scaleUp/apply.random          |           3,541.96 (144.23) |         3,541.48 (167.67) |  -0.01% |    +1.90% (2.49 pp) |
| lifecycle/scaleUp/insert.head           |             802.24 (101.98) |            806.92 (87.55) |  +0.58% |    +1.51% (4.17 pp) |
| lifecycle/scaleUp/insert.random         |           1,597.32 (101.86) |          1,567.31 (80.59) |  -1.88% |    +0.02% (3.64 pp) |
| lifecycle/scaleUp/insert.tail           |              731.42 (40.49) |            716.14 (47.21) |  -2.09% |    +1.45% (3.42 pp) |
| lifecycle/scaleUp/remove.random         |           2,495.56 (169.34) |          2,505.98 (27.09) |  +0.42% |    +1.42% (1.61 pp) |
| lifecycle/scaleUp/replace.head          |           2,422.36 (149.62) |          2,311.94 (19.46) |  -4.56% |   -6.54% (14.04 pp) |
| lifecycle/scaleUp/replace.random        |           3,175.18 (358.86) |         3,184.16 (380.17) |  +0.28% |   -0.01% (20.66 pp) |
| lifecycle/scaleUp/replace.tail          |            2,170.36 (51.21) |            2,193.48 (7.3) |  +1.07% |    +1.77% (5.22 pp) |
| lifecycle/scaleUp/value.head            |              312.31 (17.17) |             303.5 (12.99) |  -2.82% |    -1.75% (2.91 pp) |
| lifecycle/scaleUp/value.random          |              996.82 (15.73) |            984.62 (12.36) |  -1.22% |    -2.15% (4.28 pp) |
| lifecycle/scaleUp/value.tail            |               152.86 (6.84) |            152.56 (10.64) |  -0.20% |    +1.34% (6.68 pp) |
| lifecycle/scaleDown/apply.random        |           3,210.84 (129.62) |         3,267.17 (202.02) |  +1.75% |    +0.73% (4.09 pp) |
| lifecycle/scaleDown/insert.random       |              1,569.4 (23.8) |         1,602.48 (116.82) |  +2.11% |    +1.20% (6.47 pp) |
| lifecycle/scaleDown/remove.head         |             1,797.5 (15.07) |         1,867.28 (170.11) |  +3.88% |    +1.31% (8.62 pp) |
| lifecycle/scaleDown/remove.random       |            2,439.4 (120.42) |          2,653.7 (285.41) |  +8.78% |    +2.22% (7.25 pp) |
| lifecycle/scaleDown/remove.tail         |             1,655.5 (44.95) |         1,680.23 (204.09) |  +1.49% |    +0.63% (9.62 pp) |
| lifecycle/scaleDown/replace.head        |           2,649.96 (406.94) |         2,344.88 (271.21) | -11.51% |    -0.50% (2.07 pp) |
| lifecycle/scaleDown/replace.random      |            2,939.48 (77.92) |         3,159.04 (234.86) |  +7.47% |    -0.17% (8.38 pp) |
| lifecycle/scaleDown/replace.tail        |        18,366.78 (1,248.88) |       18,418.34 (2,623.9) |  +0.28% |    +2.34% (20.1 pp) |
| lifecycle/scaleDown/value.head          |              393.19 (13.32) |            410.06 (25.46) |  +4.29% |    +1.78% (5.22 pp) |
| lifecycle/scaleDown/value.random        |               947.44 (17.9) |             968.8 (76.35) |  +2.25% |    +0.02% (6.24 pp) |
| lifecycle/scaleDown/value.tail          |               222.07 (2.96) |             227.79 (7.26) |  +2.58% |    +2.19% (3.95 pp) |
| lifecycle/fullLifecycle/apply.random    |            3,386.89 (16.62) |           3,449.26 (18.2) |  +1.84% |     +2.35% (2.2 pp) |
| lifecycle/fullLifecycle/insert.head     |             802.24 (101.98) |            806.92 (87.55) |  +0.58% |    +1.51% (4.17 pp) |
| lifecycle/fullLifecycle/insert.random   |            1,593.48 (32.43) |          1,615.96 (54.56) |  +1.41% |    +2.14% (7.66 pp) |
| lifecycle/fullLifecycle/insert.tail     |              731.42 (40.49) |            716.14 (47.21) |  -2.09% |    +1.45% (3.42 pp) |
| lifecycle/fullLifecycle/remove.head     |             1,797.5 (15.07) |         1,867.28 (170.11) |  +3.88% |    +1.31% (8.62 pp) |
| lifecycle/fullLifecycle/remove.random   |            2,495.58 (91.88) |         2,579.84 (156.25) |  +3.38% |    +1.77% (4.33 pp) |
| lifecycle/fullLifecycle/remove.tail     |             1,655.5 (44.95) |         1,680.23 (204.09) |  +1.49% |    +0.63% (9.62 pp) |
| lifecycle/fullLifecycle/replace.head    |            2,522.64 (31.63) |         2,328.41 (323.32) |  -7.70% |   -3.58% (11.66 pp) |
| lifecycle/fullLifecycle/replace.random  |           3,092.49 (166.82) |          3,228.11 (102.1) |  +4.39% |   +5.10% (11.26 pp) |
| lifecycle/fullLifecycle/replace.tail    |          10,255.51 (577.64) |      10,358.27 (1,323.78) |  +1.00% |   +1.61% (17.43 pp) |
| lifecycle/fullLifecycle/value.head      |              349.75 (16.96) |            351.95 (11.07) |  +0.63% |    +0.20% (2.36 pp) |
| lifecycle/fullLifecycle/value.random    |              969.52 (24.29) |             972.13 (50.1) |  +0.27% |    -1.93% (7.54 pp) |
| lifecycle/fullLifecycle/value.tail      |               187.47 (7.09) |              190.6 (8.53) |  +1.67% |    +1.83% (6.75 pp) |
| checkpoint/up/1000/create               |            377,100 (37,000) |          398,700 (49,400) |  +5.73% |   +5.73% (26.46 pp) |
| checkpoint/up/1000/sequence             |         2,493,000 (123,700) |        2,483,600 (96,000) |  -0.38% |    +4.76% (3.37 pp) |
| checkpoint/up/1000/values               |         1,681,500 (156,900) |       1,767,900 (110,000) |  +5.14% |   +5.14% (15.28 pp) |
| checkpoint/up/5000/create               |            892,200 (26,900) |           856,100 (5,500) |  -4.05% |    -3.91% (5.69 pp) |
| checkpoint/up/5000/sequence             |         7,606,000 (748,200) |     8,103,400 (1,158,500) |  +6.54% |  +11.76% (26.75 pp) |
| checkpoint/up/5000/values               |         4,549,800 (885,900) |       4,141,000 (844,700) |  -8.99% |    -8.22% (7.98 pp) |
| checkpoint/up/10000/create              |         1,502,600 (241,500) |        1,593,200 (91,000) |  +6.03% |   +4.97% (16.52 pp) |
| checkpoint/up/10000/sequence            |      12,859,600 (1,417,100) |      12,998,800 (968,400) |  +1.08% |    +7.21% (13.8 pp) |
| checkpoint/up/10000/values              |        20,016,100 (854,300) |      19,696,400 (410,500) |  -1.60% |    -1.98% (1.11 pp) |
| checkpoint/up/15000/create              |          2,354,300 (46,000) |        2,354,400 (71,400) |  +0.00% |    +1.19% (1.29 pp) |
| checkpoint/up/15000/sequence            |        13,763,300 (195,100) |      14,061,700 (308,800) |  +2.17% |    +0.73% (8.68 pp) |
| checkpoint/up/15000/values              |        28,339,800 (619,800) |    29,707,900 (1,283,000) |  +4.83% |    +2.71% (3.42 pp) |
| checkpoint/up/20000/create              |         3,291,900 (111,300) |       3,255,100 (119,000) |  -1.12% |    +0.09% (5.28 pp) |
| checkpoint/up/20000/sequence            |        20,106,700 (763,600) |      20,354,200 (439,400) |  +1.23% |    +0.72% (4.88 pp) |
| checkpoint/up/20000/values              |      10,532,600 (1,000,700) |      10,004,300 (187,900) |  -5.02% |    -4.11% (1.38 pp) |
| checkpoint/up/25000/create              |         3,881,600 (149,800) |       4,083,800 (288,800) |  +5.21% |     +1.93% (4.2 pp) |
| checkpoint/up/25000/sequence            |        22,453,000 (584,800) |      22,628,500 (310,100) |  +0.78% |    +1.89% (5.02 pp) |
| checkpoint/up/25000/values              |        10,702,000 (491,400) |    10,896,900 (1,601,500) |  +1.82% |   +1.01% (16.47 pp) |
| checkpoint/down/20000/create            |          3,359,200 (24,600) |        3,489,500 (27,500) |  +3.88% |    +3.96% (2.78 pp) |
| checkpoint/down/20000/sequence          |        17,970,000 (211,200) |      18,399,100 (541,200) |  +2.39% |    +2.68% (4.84 pp) |
| checkpoint/down/20000/values            |         8,795,800 (125,200) |       8,684,800 (235,800) |  -1.26% |    -0.79% (7.34 pp) |
| checkpoint/down/15000/create            |          2,373,300 (18,900) |        2,372,500 (82,400) |  -0.03% |     +0.14% (2.5 pp) |
| checkpoint/down/15000/sequence          |         14,756,500 (27,800) |    15,498,700 (1,555,800) |  +5.03% |    +3.61% (9.93 pp) |
| checkpoint/down/15000/values            |         6,987,600 (173,400) |       7,173,200 (115,000) |  +2.66% |   +2.38% (10.93 pp) |
| checkpoint/down/10000/create            |          1,626,300 (33,600) |        1,646,600 (30,800) |  +1.25% |       +0.02% (6 pp) |
| checkpoint/down/10000/sequence          |        12,152,700 (535,000) |    12,176,400 (1,427,600) |  +0.20% |   -1.76% (12.82 pp) |
| checkpoint/down/10000/values            |         5,433,100 (125,600) |       5,180,500 (534,100) |  -4.65% |    -1.85% (8.65 pp) |
| checkpoint/down/5000/create             |            773,100 (22,600) |          770,400 (35,400) |  -0.35% |    +0.86% (9.94 pp) |
| checkpoint/down/5000/sequence           |         9,175,700 (476,900) |       8,843,400 (364,300) |  -3.62% |    -0.01% (5.47 pp) |
| checkpoint/down/5000/values             |         2,814,800 (670,200) |       2,777,500 (268,100) |  -1.33% |    +0.72% (24.5 pp) |
| checkpoint/down/1000/create             |            153,200 (12,400) |          152,700 (12,500) |  -0.33% |    -6.09% (5.92 pp) |
| checkpoint/down/1000/sequence           |       5,645,900 (1,400,700) |       5,338,500 (173,200) |  -5.44% |   -5.44% (18.89 pp) |
| checkpoint/down/1000/values             |           483,500 (126,300) |          470,400 (42,900) |  -2.71% |   -6.35% (17.02 pp) |
| checkpoint/down/0/create                |                14,400 (400) |            15,000 (4,500) |  +4.17% |   +3.45% (26.39 pp) |
| checkpoint/down/0/sequence              |          1,340,900 (37,500) |       1,263,800 (247,000) |  -5.75% |   -7.13% (25.08 pp) |
| checkpoint/down/0/values                |              10,500 (1,300) |            10,100 (1,200) |  -3.81% |   +5.21% (15.58 pp) |
| tuple/projection/2/create.empty         |              340.34 (11.92) |             357.48 (3.93) |  +5.04% |    +4.79% (2.69 pp) |
| tuple/tuple/2/create.empty              |              426.26 (11.22) |            422.67 (13.54) |  -0.84% |    +1.55% (4.94 pp) |
| tuple/projection/2/create.sequence      |            1,225.92 (33.89) |          1,200.43 (30.25) |  -2.08% |    +0.38% (2.68 pp) |
| tuple/tuple/2/create.sequence           |             1,440.25 (21.7) |           1,355.1 (29.36) |  -5.91% |    -3.97% (2.64 pp) |
| tuple/projection/2/replace.random       |            1,030.48 (50.43) |          1,006.6 (148.74) |  -2.32% |   +0.29% (11.75 pp) |
| tuple/tuple/2/replace.random            |              703.24 (41.37) |            667.48 (20.85) |  -5.09% |    -2.24% (9.84 pp) |
| tuple/projection/2/apply.replace        |              1,744 (202.47) |         1,667.11 (203.99) |  -4.41% |    -1.18% (7.44 pp) |
| tuple/tuple/2/apply.replace             |            1,116.86 (115.5) |          1,232.83 (23.99) | +10.38% |    +6.02% (9.56 pp) |
| tuple/projection/2/apply.duplicate      |                665.1 (32.6) |            664.08 (67.66) |  -0.15% |    -0.15% (5.42 pp) |
| tuple/tuple/2/apply.duplicate           |              631.81 (31.39) |            646.24 (46.86) |  +2.28% |    +2.04% (4.09 pp) |
| tuple/projection/2/merge.duplicate      |               661.1 (19.86) |            678.35 (31.35) |  +2.61% |    +0.81% (5.84 pp) |
| tuple/tuple/2/merge.duplicate           |              631.77 (16.54) |            664.55 (40.56) |  +5.19% |    +5.50% (12.4 pp) |
| tuple/projection/2/length               |                 7.45 (0.57) |               7.53 (0.31) |  +1.02% |    +2.64% (7.17 pp) |
| tuple/tuple/2/length                    |                 7.23 (0.27) |               7.23 (0.04) |  -0.00% |    +1.86% (2.86 pp) |
| tuple/projection/2/value.random         |                30.68 (2.17) |              30.05 (1.39) |  -2.04% |   -5.91% (10.89 pp) |
| tuple/tuple/2/value.random              |                19.33 (1.18) |              18.57 (5.43) |  -3.90% |   -3.90% (24.07 pp) |
| tuple/projection/2/values               |                77.29 (5.61) |             96.16 (17.95) | +24.41% |  +27.41% (28.77 pp) |
| tuple/tuple/2/values                    |               79.18 (24.76) |             95.16 (16.77) | +20.18% |   +2.03% (20.55 pp) |
| tuple/projection/2/sequence             |              449.17 (45.62) |            529.42 (79.49) | +17.87% |   +17.87% (25.6 pp) |
| tuple/tuple/2/sequence                  |               457.46 (9.01) |            530.82 (58.38) | +16.04% |  +16.04% (16.95 pp) |
| tuple/projection/4/create.empty         |                397.66 (3.4) |           492.46 (125.12) | +23.84% |  +24.06% (32.16 pp) |
| tuple/tuple/4/create.empty              |              420.48 (10.79) |            474.53 (87.65) | +12.86% |  +16.37% (19.75 pp) |
| tuple/projection/4/create.sequence      |            1,638.08 (116.7) |           1,646.28 (88.2) |  +0.50% |   -0.63% (11.82 pp) |
| tuple/tuple/4/create.sequence           |            1,508.21 (51.94) |          1,574.02 (169.9) |  +4.36% |   +6.83% (18.62 pp) |
| tuple/projection/4/replace.random       |            1,147.77 (62.76) |          1,138.35 (97.83) |  -0.82% |   +1.59% (18.92 pp) |
| tuple/tuple/4/replace.random            |              628.78 (80.54) |            633.17 (39.81) |  +0.70% |     -0.12% (6.6 pp) |
| tuple/projection/4/apply.replace        |            1,696.75 (56.52) |         1,751.73 (105.61) |  +3.24% |   +6.35% (12.22 pp) |
| tuple/tuple/4/apply.replace             |             1,052.1 (50.17) |           1,097.76 (32.8) |  +4.34% |    +4.92% (4.13 pp) |
| tuple/projection/4/apply.duplicate      |               597.9 (33.09) |            634.94 (73.61) |  +6.19% |   +6.19% (14.81 pp) |
| tuple/tuple/4/apply.duplicate           |              639.12 (64.15) |            621.72 (72.77) |  -2.72% |   -2.72% (14.79 pp) |
| tuple/projection/4/merge.duplicate      |             758.96 (135.45) |            747.87 (22.75) |  -1.46% |   -3.96% (10.03 pp) |
| tuple/tuple/4/merge.duplicate           |              789.14 (57.94) |            782.71 (31.29) |  -0.82% |    -0.82% (1.16 pp) |
| tuple/projection/4/length               |                26.93 (0.69) |               7.36 (20.5) | -72.66% |  -72.66% (81.45 pp) |
| tuple/tuple/4/length                    |                25.72 (2.22) |              7.09 (19.62) | -72.44% |  -71.14% (77.36 pp) |
| tuple/projection/4/value.random         |                39.45 (3.86) |              41.08 (3.72) |  +4.13% |   -7.49% (14.98 pp) |
| tuple/tuple/4/value.random              |                 18.3 (2.89) |              17.75 (1.55) |  -2.97% |   -1.54% (16.79 pp) |
| tuple/projection/4/values               |               148.28 (5.37) |            117.11 (25.81) | -21.02% |  -22.60% (18.61 pp) |
| tuple/tuple/4/values                    |               141.01 (9.45) |            110.74 (31.97) | -21.47% |  -20.68% (25.53 pp) |
| tuple/projection/4/sequence             |              460.63 (20.63) |            444.98 (22.12) |  -3.40% |    -3.28% (1.39 pp) |
| tuple/tuple/4/sequence                  |              574.19 (61.33) |            554.05 (313.1) |  -3.51% |   +6.98% (51.52 pp) |
| tuple/projection/8/create.empty         |               399.53 (0.77) |            408.97 (53.06) |  +2.36% |   +1.54% (17.39 pp) |
| tuple/tuple/8/create.empty              |              435.46 (21.52) |            473.92 (32.38) |  +8.83% |    +6.96% (6.44 pp) |
| tuple/projection/8/create.sequence      |           2,341.98 (363.87) |            2,375.88 (161) |  +1.45% |   +3.57% (23.54 pp) |
| tuple/tuple/8/create.sequence           |            2,046.6 (150.63) |          2,005.08 (77.71) |  -2.03% |    -1.06% (4.32 pp) |
| tuple/projection/8/replace.random       |            1,173.88 (29.83) |          1,136.48 (58.36) |  -3.19% |    -0.33% (5.61 pp) |
| tuple/tuple/8/replace.random            |              633.92 (15.06) |            637.87 (78.16) |  +0.62% |    +2.77% (8.21 pp) |
| tuple/projection/8/apply.replace        |            1,727.47 (40.69) |         1,684.74 (153.74) |  -2.47% |    -2.47% (2.48 pp) |
| tuple/tuple/8/apply.replace             |              953.85 (33.82) |          1,008.91 (84.62) |  +5.77% |    +0.60% (6.13 pp) |
| tuple/projection/8/apply.duplicate      |              581.95 (10.98) |            625.63 (55.27) |  +7.51% |    +4.26% (9.52 pp) |
| tuple/tuple/8/apply.duplicate           |              597.13 (39.59) |           618.69 (107.11) |  +3.61% |   +2.32% (20.88 pp) |
| tuple/projection/8/merge.duplicate      |            1,031.78 (63.88) |          1,065.95 (93.81) |  +3.31% |   +4.45% (14.17 pp) |
| tuple/tuple/8/merge.duplicate           |            1,083.43 (57.62) |            1,119.5 (84.6) |  +3.33% |    +5.60% (6.98 pp) |
| tuple/projection/8/length               |                27.54 (2.27) |             27.46 (19.69) |  -0.32% |   -3.09% (71.75 pp) |
| tuple/tuple/8/length                    |                26.49 (1.11) |             25.82 (18.56) |  -2.52% |   -0.65% (69.44 pp) |
| tuple/projection/8/value.random         |                51.89 (1.72) |              51.51 (5.15) |  -0.73% |    -1.33% (7.43 pp) |
| tuple/tuple/8/value.random              |                17.79 (0.23) |              18.04 (1.24) |  +1.38% |    +4.49% (7.14 pp) |
| tuple/projection/8/values               |               219.84 (4.45) |            216.73 (27.14) |  -1.41% |    -2.90% (9.11 pp) |
| tuple/tuple/8/values                    |               207.04 (11.8) |            202.03 (29.66) |  -2.42% |    -5.38% (7.63 pp) |
| tuple/projection/8/sequence             |              626.98 (29.41) |            632.44 (50.86) |  +0.87% |   +1.29% (13.56 pp) |
| tuple/tuple/8/sequence                  |              686.35 (29.27) |            679.66 (55.07) |  -0.97% |   -0.03% (11.07 pp) |
| tuple/projection/100/create.empty       |              429.81 (30.85) |             430.43 (5.27) |  +0.14% |    -0.07% (8.62 pp) |
| tuple/tuple/100/create.empty            |              470.62 (42.76) |            447.03 (13.06) |  -5.01% |    -6.66% (6.76 pp) |
| tuple/projection/100/create.sequence    |          14,202.06 (824.24) |        13,777.03 (324.78) |  -2.99% |    -1.74% (6.06 pp) |
| tuple/tuple/100/create.sequence         |          11,415.52 (490.49) |         11,100.95 (37.76) |  -2.76% |    -1.74% (7.23 pp) |
| tuple/projection/100/replace.random     |            1,174.93 (72.97) |          1,136.93 (34.77) |  -3.23% |   -3.93% (11.66 pp) |
| tuple/tuple/100/replace.random          |              620.71 (12.25) |             638.25 (23.7) |  +2.83% |    +2.83% (3.22 pp) |
| tuple/projection/100/apply.replace      |           1,677.59 (110.83) |          1,708.73 (55.29) |  +1.86% |    +1.27% (9.19 pp) |
| tuple/tuple/100/apply.replace           |              968.31 (20.46) |            991.59 (33.37) |  +2.40% |    +1.44% (2.45 pp) |
| tuple/projection/100/apply.duplicate    |              578.85 (11.43) |            594.35 (38.82) |  +2.68% |    -0.15% (4.43 pp) |
| tuple/tuple/100/apply.duplicate         |              599.83 (21.14) |            607.89 (12.51) |  +1.34% |    -0.05% (0.47 pp) |
| tuple/projection/100/merge.duplicate    |           9,257.92 (398.22) |         8,974.87 (152.27) |  -3.06% |    -3.06% (8.21 pp) |
| tuple/tuple/100/merge.duplicate         |          13,331.98 (802.64) |        13,047.61 (242.53) |  -2.13% |    -5.15% (8.54 pp) |
| tuple/projection/100/length             |                26.72 (3.34) |             26.35 (19.58) |  -1.39% |  -17.17% (66.96 pp) |
| tuple/tuple/100/length                  |                26.33 (1.24) |             24.91 (17.56) |  -5.39% |   -7.16% (67.55 pp) |
| tuple/projection/100/value.random       |                76.73 (3.46) |             78.54 (15.47) |  +2.36% |    +2.36% (12.7 pp) |
| tuple/tuple/100/value.random            |                17.63 (0.18) |              18.43 (0.86) |  +4.52% |     +5.82% (1.4 pp) |
| tuple/projection/100/values             |            1,830.96 (50.22) |          1,846.78 (89.61) |  +0.86% |    -1.83% (7.49 pp) |
| tuple/tuple/100/values                  |            1,534.93 (24.68) |          1,550.36 (71.88) |  +1.01% |   -0.52% (10.11 pp) |
| tuple/projection/100/sequence           |           5,997.32 (986.66) |         6,298.91 (532.25) |  +5.03% |    +4.21% (7.96 pp) |
| tuple/tuple/100/sequence                |           5,341.19 (284.86) |         5,435.17 (351.66) |  +1.76% |    -1.56% (9.05 pp) |

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
