# Direct Splice: complete guard

5 complete matched runs per build. Before: baseline; candidate: direct-splice. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 70 timing medians improve over 5%; 47 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 0%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |          Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | -----------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            776.54 (42.74) |           874.39 (76.84) | +12.60% |  +14.89% (17.15 pp) |
| throughput/1000/apply.duplicate         |             858.01 (52.3) |            873.2 (36.81) |  +1.77% |    +7.26% (13.1 pp) |
| throughput/5000/apply.duplicate         |            387.72 (10.55) |           391.19 (12.16) |  +0.89% |     -1.27% (1.4 pp) |
| throughput/10000/apply.duplicate        |             356.36 (21.3) |          352.38 (207.97) |  -1.12% |   -1.12% (57.55 pp) |
| throughput/15000/apply.duplicate        |             352.86 (7.71) |           341.56 (20.65) |  -3.20% |    -5.58% (4.91 pp) |
| throughput/20000/apply.duplicate        |             330.3 (20.49) |           343.54 (23.76) |  +4.01% |    +3.02% (1.69 pp) |
| throughput/25000/apply.duplicate        |            328.77 (17.54) |           328.71 (24.57) |  -0.02% |    +0.40% (3.02 pp) |
| throughput/100/apply.duplicateRemove    |         1,482.21 (390.56) |        1,703.39 (216.84) | +14.92% |   +2.75% (22.51 pp) |
| throughput/1000/apply.duplicateRemove   |             858.1 (10.68) |           869.58 (46.75) |  +1.34% |   +7.30% (10.43 pp) |
| throughput/5000/apply.duplicateRemove   |            787.06 (59.95) |           817.09 (46.26) |  +3.82% |    +0.79% (1.75 pp) |
| throughput/10000/apply.duplicateRemove  |             756.94 (15.4) |          755.84 (165.51) |  -0.15% |   +1.55% (15.39 pp) |
| throughput/15000/apply.duplicateRemove  |            691.67 (59.22) |           701.14 (36.71) |  +1.37% |    -6.45% (9.61 pp) |
| throughput/20000/apply.duplicateRemove  |            699.12 (18.07) |           702.92 (48.81) |  +0.54% |   -1.52% (10.04 pp) |
| throughput/25000/apply.duplicateRemove  |                670 (37.2) |            686.81 (56.7) |  +2.51% |    +1.60% (3.75 pp) |
| throughput/100/apply.duplicateReplace   |          1,053.27 (51.37) |        1,100.13 (149.31) |  +4.45% |  +12.19% (18.58 pp) |
| throughput/1000/apply.duplicateReplace  |           1,130.3 (21.95) |          1,096.5 (74.86) |  -2.99% |    -1.48% (6.41 pp) |
| throughput/5000/apply.duplicateReplace  |            998.09 (27.36) |           973.04 (22.63) |  -2.51% |    +0.90% (4.32 pp) |
| throughput/10000/apply.duplicateReplace |            942.67 (29.96) |          931.17 (100.09) |  -1.22% |    -1.22% (6.12 pp) |
| throughput/15000/apply.duplicateReplace |               891 (53.16) |           876.76 (61.47) |  -1.60% |   -1.73% (11.55 pp) |
| throughput/20000/apply.duplicateReplace |            850.02 (33.72) |             856.6 (32.5) |  +0.77% |    +3.23% (5.47 pp) |
| throughput/25000/apply.duplicateReplace |            854.48 (35.56) |             833.7 (47.3) |  -2.43% |    -4.69% (8.46 pp) |
| throughput/100/apply.insert             |         1,706.38 (142.37) |        1,663.68 (210.87) |  -2.50% |    +3.77% (9.61 pp) |
| throughput/1000/apply.insert            |         1,467.75 (186.45) |        1,360.65 (144.62) |  -7.30% |     -0.96% (1.9 pp) |
| throughput/5000/apply.insert            |          1,344.11 (51.63) |         1,327.34 (84.59) |  -1.25% |     +0.07% (4.6 pp) |
| throughput/10000/apply.insert           |          1,349.81 (57.76) |        1,385.72 (180.23) |  +2.66% |    +2.66% (6.39 pp) |
| throughput/15000/apply.insert           |          1,293.75 (67.06) |          1,365.2 (26.01) |  +5.52% |    +4.14% (8.47 pp) |
| throughput/20000/apply.insert           |           1,243.73 (33.1) |        1,253.39 (106.44) |  +0.78% |    +4.67% (3.62 pp) |
| throughput/25000/apply.insert           |          1,202.47 (81.08) |            1,256.15 (71) |  +4.46% |    +1.76% (4.23 pp) |
| throughput/100/apply.remove             |          1,847.84 (79.48) |            1,873.61 (28) |  +1.39% |    +1.96% (6.96 pp) |
| throughput/1000/apply.remove            |           1,548.76 (45.8) |         1,493.51 (73.75) |  -3.57% |    -0.99% (4.83 pp) |
| throughput/5000/apply.remove            |          1,539.3 (143.66) |            1,584 (52.53) |  +2.90% |   -2.63% (10.98 pp) |
| throughput/10000/apply.remove           |           1,553.72 (30.7) |         1,593.48 (93.64) |  +2.56% |    +3.71% (4.96 pp) |
| throughput/15000/apply.remove           |         1,550.12 (147.73) |            1,626 (82.38) |  +4.90% |   +7.99% (12.52 pp) |
| throughput/20000/apply.remove           |         1,599.62 (113.99) |        1,737.38 (227.97) |  +8.61% |   +6.68% (13.56 pp) |
| throughput/25000/apply.remove           |         1,490.41 (140.51) |         1,605.86 (24.95) |  +7.75% |    +7.07% (6.73 pp) |
| throughput/100/apply.replace            |         2,902.11 (316.76) |         2,625.87 (16.64) |  -9.52% |    -7.55% (9.38 pp) |
| throughput/1000/apply.replace           |          2,768.59 (30.78) |        2,730.43 (201.02) |  -1.38% |    +4.83% (9.42 pp) |
| throughput/5000/apply.replace           |         2,825.29 (103.96) |         2,829.71 (36.72) |  +0.16% |    +2.72% (2.79 pp) |
| throughput/10000/apply.replace          |         2,692.35 (102.38) |         2,767.77 (36.49) |  +2.80% |    +2.84% (3.41 pp) |
| throughput/15000/apply.replace          |          2,896.2 (240.31) |        2,770.82 (113.98) |  -4.33% |   -4.12% (11.53 pp) |
| throughput/20000/apply.replace          |          2,778.19 (71.16) |         2,838.84 (222.7) |  +2.18% |    -1.33% (5.97 pp) |
| throughput/25000/apply.replace          |          2,822.46 (85.98) |        2,765.46 (151.56) |  -2.02% |    -3.43% (2.57 pp) |
| throughput/100/create.empty             |            597.6 (118.41) |              527 (49.67) | -11.81% |  -14.68% (16.27 pp) |
| throughput/1000/create.empty            |            736.36 (25.88) |           740.15 (65.53) |  +0.51% |    +1.45% (6.17 pp) |
| throughput/5000/create.empty            |             831.9 (43.17) |           820.72 (48.34) |  -1.34% |    +0.14% (5.81 pp) |
| throughput/10000/create.empty           |            748.54 (18.16) |           822.07 (43.07) |  +9.82% |     +7.42% (7.5 pp) |
| throughput/15000/create.empty           |             794.4 (36.05) |           825.91 (63.69) |  +3.97% |   -1.58% (25.52 pp) |
| throughput/20000/create.empty           |            759.34 (66.57) |           748.41 (45.81) |  -1.44% |     -0.27% (4.6 pp) |
| throughput/25000/create.empty           |             703.7 (59.18) |            766.42 (46.2) |  +8.91% |   +8.91% (18.68 pp) |
| throughput/100/create.sequence          |         1,651.89 (125.89) |          1,529.3 (61.39) |  -7.42% |    -9.72% (3.39 pp) |
| throughput/1000/create.sequence         |          1,917.97 (74.63) |         1,926.45 (20.68) |  +0.44% |    +0.44% (5.25 pp) |
| throughput/5000/create.sequence         |          1,637.47 (78.79) |         1,628.33 (153.7) |  -0.56% |    +3.09% (8.38 pp) |
| throughput/10000/create.sequence        |           1,821.22 (79.8) |         1,605.2 (257.44) | -11.86% |   +1.88% (22.99 pp) |
| throughput/15000/create.sequence        |          1,552.73 (77.32) |          1,591.7 (33.73) |  +2.51% |    +0.35% (3.93 pp) |
| throughput/20000/create.sequence        |         1,654.58 (242.33) |        1,541.84 (236.89) |  -6.81% |   +5.37% (21.91 pp) |
| throughput/25000/create.sequence        |         1,743.76 (237.89) |        1,646.89 (255.63) |  -5.56% |   -2.70% (14.16 pp) |
| throughput/100/insert.head              |            585.98 (63.97) |           526.51 (25.11) | -10.15% |    -8.91% (17.7 pp) |
| throughput/1000/insert.head             |            563.22 (13.81) |            552.73 (8.41) |  -1.86% |    -0.50% (1.49 pp) |
| throughput/5000/insert.head             |            536.8 (113.61) |           558.96 (21.52) |  +4.13% |    +3.44% (7.92 pp) |
| throughput/10000/insert.head            |            516.79 (13.69) |           564.77 (48.98) |  +9.28% |  +10.76% (20.21 pp) |
| throughput/15000/insert.head            |            508.78 (89.83) |           494.25 (29.78) |  -2.86% |   -2.86% (11.48 pp) |
| throughput/20000/insert.head            |            547.91 (35.19) |           557.59 (45.32) |  +1.77% |    +3.70% (4.68 pp) |
| throughput/25000/insert.head            |            507.16 (76.47) |           551.43 (84.83) |  +8.73% |    -1.15% (3.87 pp) |
| throughput/100/insert.middle            |            652.53 (92.14) |           590.09 (82.31) |  -9.57% |   -8.61% (19.25 pp) |
| throughput/1000/insert.middle           |            696.89 (42.39) |           664.26 (11.39) |  -4.68% |    -3.07% (9.79 pp) |
| throughput/5000/insert.middle           |            638.53 (75.38) |           651.53 (28.43) |  +2.04% |   -2.61% (15.12 pp) |
| throughput/10000/insert.middle          |            617.97 (27.09) |            621.86 (5.09) |  +0.63% |    +4.05% (3.53 pp) |
| throughput/15000/insert.middle          |            575.46 (97.72) |           590.06 (20.18) |  +2.54% |   +0.69% (10.74 pp) |
| throughput/20000/insert.middle          |            670.92 (21.69) |           614.02 (18.41) |  -8.48% |    -7.43% (3.23 pp) |
| throughput/25000/insert.middle          |            585.04 (29.88) |           556.55 (17.51) |  -4.87% |    -4.57% (4.29 pp) |
| throughput/100/insert.random            |           895.52 (160.33) |           887.77 (96.25) |  -0.87% |   +3.48% (21.38 pp) |
| throughput/1000/insert.random           |            980.43 (60.68) |           964.84 (30.33) |  -1.59% |    -1.59% (3.48 pp) |
| throughput/5000/insert.random           |           980.24 (334.43) |          958.68 (107.78) |  -2.20% |    +1.51% (29.9 pp) |
| throughput/10000/insert.random          |            918.64 (82.56) |           917.98 (60.98) |  -0.07% |    +2.27% (8.61 pp) |
| throughput/15000/insert.random          |             939.17 (88.9) |           880.74 (19.66) |  -6.22% |   -6.05% (14.94 pp) |
| throughput/20000/insert.random          |            896.37 (15.16) |            909.6 (19.98) |  +1.48% |    +1.48% (4.14 pp) |
| throughput/25000/insert.random          |            916.49 (75.04) |           835.11 (27.36) |  -8.88% |    -9.00% (7.96 pp) |
| throughput/100/insert.sameIndex         |           569.75 (129.62) |           534.6 (163.56) |  -6.17% |   +1.40% (10.76 pp) |
| throughput/1000/insert.sameIndex        |            605.74 (66.11) |           575.48 (16.37) |  -5.00% |    -8.55% (8.43 pp) |
| throughput/5000/insert.sameIndex        |            549.94 (52.79) |           588.92 (54.25) |  +7.09% |    +0.10% (8.57 pp) |
| throughput/10000/insert.sameIndex       |              542.5 (4.02) |            563.98 (42.2) |  +3.96% |    +3.96% (8.54 pp) |
| throughput/15000/insert.sameIndex       |            554.92 (75.46) |           552.48 (42.85) |  -0.44% |   -5.56% (19.22 pp) |
| throughput/20000/insert.sameIndex       |             537.73 (51.9) |           540.43 (49.95) |  +0.50% |   +3.17% (10.23 pp) |
| throughput/25000/insert.sameIndex       |           543.29 (101.33) |           542.26 (29.57) |  -0.19% |   -3.71% (14.14 pp) |
| throughput/100/insert.tail              |             921.3 (22.94) |            830.6 (63.56) |  -9.84% |    -8.26% (1.76 pp) |
| throughput/1000/insert.tail             |            935.8 (153.47) |           919.78 (92.85) |  -1.71% |    -1.71% (6.91 pp) |
| throughput/5000/insert.tail             |         1,091.98 (189.58) |          1,008.01 (28.8) |  -7.69% |  -14.86% (19.36 pp) |
| throughput/10000/insert.tail            |            907.95 (39.51) |           946.32 (36.29) |  +4.23% |   +2.88% (10.82 pp) |
| throughput/15000/insert.tail            |            815.4 (107.74) |          825.12 (112.98) |  +1.19% |    -9.89% (0.37 pp) |
| throughput/20000/insert.tail            |            875.34 (17.31) |           939.62 (88.64) |  +7.34% |   +6.66% (11.61 pp) |
| throughput/25000/insert.tail            |            881.65 (93.48) |          802.03 (113.93) |  -9.03% |    -5.62% (2.86 pp) |
| throughput/100/length                   |            126.24 (27.41) |           115.84 (10.87) |  -8.24% |   +5.10% (34.52 pp) |
| throughput/1000/length                  |             113.05 (3.46) |           113.15 (12.71) |  +0.09% |    +0.02% (2.12 pp) |
| throughput/5000/length                  |             118.15 (15.8) |           129.42 (26.44) |  +9.54% |  +11.01% (23.26 pp) |
| throughput/10000/length                 |            113.26 (10.36) |            115.48 (4.46) |  +1.96% |   +0.94% (14.78 pp) |
| throughput/15000/length                 |             110.77 (7.41) |             114.1 (8.92) |  +3.01% |    +5.66% (6.08 pp) |
| throughput/20000/length                 |             117.18 (5.32) |           112.04 (18.41) |  -4.39% |   -3.38% (25.67 pp) |
| throughput/25000/length                 |             105.79 (6.72) |            104.25 (5.25) |  -1.46% |    +2.08% (9.78 pp) |
| throughput/100/merge.duplicate          |            836.83 (62.47) |           797.68 (70.61) |  -4.68% |    -1.81% (1.78 pp) |
| throughput/1000/merge.duplicate         |            672.48 (23.98) |           675.45 (30.34) |  +0.44% |    -2.12% (0.81 pp) |
| throughput/5000/merge.duplicate         |            671.15 (39.25) |           651.04 (23.34) |  -3.00% |    -3.19% (7.68 pp) |
| throughput/10000/merge.duplicate        |               633.03 (44) |           645.23 (11.13) |  +1.93% |    +1.27% (5.75 pp) |
| throughput/15000/merge.duplicate        |            607.44 (32.14) |           595.21 (34.15) |  -2.01% |    -2.42% (4.35 pp) |
| throughput/20000/merge.duplicate        |            610.01 (15.13) |           613.69 (28.88) |  +0.60% |    -0.26% (1.66 pp) |
| throughput/25000/merge.duplicate        |            629.08 (24.76) |           589.95 (56.61) |  -6.22% |   -6.02% (11.23 pp) |
| throughput/100/merge.insert             |         1,788.15 (185.07) |        1,710.95 (131.57) |  -4.32% |    -1.30% (5.99 pp) |
| throughput/1000/merge.insert            |         1,740.05 (253.79) |          1,538.54 (58.1) | -11.58% |   -9.94% (18.29 pp) |
| throughput/5000/merge.insert            |         1,593.48 (193.48) |         1,573.58 (64.15) |  -1.25% |    -6.20% (6.53 pp) |
| throughput/10000/merge.insert           |             1,548.97 (39) |         1,630.45 (85.07) |  +5.26% |    +4.77% (3.06 pp) |
| throughput/15000/merge.insert           |           1,547.55 (38.4) |         1,485.52 (45.21) |  -4.01% |    -3.98% (2.47 pp) |
| throughput/20000/merge.insert           |          1,585.9 (315.54) |         1,545.58 (33.76) |  -2.54% |   +1.86% (17.58 pp) |
| throughput/25000/merge.insert           |          1,365.56 (63.37) |         1,373.99 (28.24) |  +0.62% |     -0.16% (3.6 pp) |
| throughput/100/remove.head              |            820.45 (99.15) |           745.91 (99.84) |  -9.09% |   -9.09% (30.74 pp) |
| throughput/1000/remove.head             |            824.09 (91.85) |           762.99 (26.27) |  -7.41% |    -7.41% (4.25 pp) |
| throughput/5000/remove.head             |            842.47 (65.89) |           825.52 (20.66) |  -2.01% |    -0.50% (7.35 pp) |
| throughput/10000/remove.head            |            904.37 (20.78) |           893.65 (49.03) |  -1.19% |    -1.55% (5.16 pp) |
| throughput/15000/remove.head            |            885.24 (36.88) |           855.67 (46.83) |  -3.34% |   -6.05% (10.62 pp) |
| throughput/20000/remove.head            |          1,025.82 (51.82) |           967.47 (52.61) |  -5.69% |   -5.69% (10.06 pp) |
| throughput/25000/remove.head            |            965.04 (88.27) |           943.72 (26.85) |  -2.21% |    -4.29% (6.35 pp) |
| throughput/100/remove.middle            |            825.72 (31.81) |            790.65 (98.2) |  -4.25% |   -2.61% (15.01 pp) |
| throughput/1000/remove.middle           |            852.54 (59.66) |             812.6 (18.8) |  -4.68% |    -7.79% (6.76 pp) |
| throughput/5000/remove.middle           |            867.69 (47.79) |           823.56 (50.49) |  -5.09% |    -4.05% (6.94 pp) |
| throughput/10000/remove.middle          |            901.34 (32.16) |           882.91 (56.67) |  -2.04% |     -2.04% (2.2 pp) |
| throughput/15000/remove.middle          |             892.54 (9.52) |           852.59 (74.83) |  -4.48% |    -1.98% (9.46 pp) |
| throughput/20000/remove.middle          |           1,038.64 (41.5) |           971.84 (20.07) |  -6.43% |    -6.43% (4.89 pp) |
| throughput/25000/remove.middle          |            934.27 (35.62) |           968.47 (53.68) |  +3.66% |    +0.89% (9.49 pp) |
| throughput/100/remove.random            |          1,110.27 (83.22) |        1,012.03 (189.56) |  -8.85% |   +1.80% (16.16 pp) |
| throughput/1000/remove.random           |          1,241.89 (16.17) |         1,178.87 (19.29) |  -5.07% |    -5.64% (2.62 pp) |
| throughput/5000/remove.random           |         1,290.42 (120.15) |            1,226.83 (75) |  -4.93% |    -4.93% (4.46 pp) |
| throughput/10000/remove.random          |           1,274.9 (38.31) |        1,273.02 (108.67) |  -0.15% |    -6.79% (9.62 pp) |
| throughput/15000/remove.random          |          1,210.44 (20.29) |          1,244.89 (77.6) |  +2.85% |    +4.30% (5.98 pp) |
| throughput/20000/remove.random          |          1,512.4 (249.98) |          1,299.85 (24.9) | -14.05% |  -16.31% (18.39 pp) |
| throughput/25000/remove.random          |         1,329.56 (110.55) |          1,275.2 (71.82) |  -4.09% |    -3.86% (6.08 pp) |
| throughput/100/remove.sameIndex         |          1,178.4 (232.77) |           929.01 (74.12) | -21.16% |  -16.91% (28.15 pp) |
| throughput/1000/remove.sameIndex        |            842.72 (12.43) |           816.79 (23.47) |  -3.08% |    -5.51% (1.81 pp) |
| throughput/5000/remove.sameIndex        |            857.09 (24.83) |           861.22 (52.96) |  +0.48% |    +0.79% (1.91 pp) |
| throughput/10000/remove.sameIndex       |             912.92 (76.3) |           934.43 (48.82) |  +2.36% |    +6.18% (5.24 pp) |
| throughput/15000/remove.sameIndex       |           858.01 (105.15) |           848.71 (37.53) |  -1.08% |    -1.11% (9.88 pp) |
| throughput/20000/remove.sameIndex       |         1,116.84 (176.02) |           972.01 (46.65) | -12.97% |   -10.00% (22.3 pp) |
| throughput/25000/remove.sameIndex       |            967.04 (55.57) |          960.05 (165.41) |  -0.72% |   +6.09% (15.46 pp) |
| throughput/100/remove.tail              |           764.29 (153.51) |           759.69 (72.16) |  -0.60% |   -1.89% (11.47 pp) |
| throughput/1000/remove.tail             |            816.15 (43.88) |           713.09 (37.88) | -12.63% |   -12.49% (4.18 pp) |
| throughput/5000/remove.tail             |            779.74 (36.04) |           767.59 (20.44) |  -1.56% |   -3.26% (12.46 pp) |
| throughput/10000/remove.tail            |            778.48 (28.85) |            796.07 (41.8) |  +2.26% |    +0.79% (5.52 pp) |
| throughput/15000/remove.tail            |             815.88 (25.6) |           753.74 (30.89) |  -7.62% |    -7.16% (5.32 pp) |
| throughput/20000/remove.tail            |           848.24 (569.97) |           827.97 (50.78) |  -2.39% |   -2.96% (35.12 pp) |
| throughput/25000/remove.tail            |             861.7 (71.04) |          964.13 (111.32) | +11.89% |   +7.84% (21.62 pp) |
| throughput/100/replace.head             |         1,112.29 (219.85) |         1,120.59 (88.77) |  +0.75% |   -4.91% (24.94 pp) |
| throughput/1000/replace.head            |         1,361.13 (171.91) |         1,224.42 (14.89) | -10.04% |   -9.70% (12.36 pp) |
| throughput/5000/replace.head            |          1,227.04 (92.92) |         1,149.93 (88.09) |  -6.28% |    -5.83% (6.56 pp) |
| throughput/10000/replace.head           |          1,192.21 (40.41) |         1,172.91 (53.37) |  -1.62% |    -1.74% (3.18 pp) |
| throughput/15000/replace.head           |          1,210.82 (86.66) |         1,233.55 (55.37) |  +1.88% |   +1.88% (13.33 pp) |
| throughput/20000/replace.head           |         1,439.19 (232.67) |         1,220.08 (41.37) | -15.22% |  -16.91% (11.62 pp) |
| throughput/25000/replace.head           |           1,273.69 (39.7) |         1,270.04 (60.87) |  -0.29% |    +1.51% (5.34 pp) |
| throughput/100/replace.middle           |          1,080.9 (204.98) |         1,181.27 (56.16) |  +9.29% |   -1.28% (22.67 pp) |
| throughput/1000/replace.middle          |          1,294.16 (32.07) |         1,254.74 (26.78) |  -3.05% |    -4.49% (2.92 pp) |
| throughput/5000/replace.middle          |           1,238.73 (62.6) |         1,207.05 (52.49) |  -2.56% |    -5.03% (8.45 pp) |
| throughput/10000/replace.middle         |           1,271.74 (65.6) |         1,272.48 (12.78) |  +0.06% |    -0.04% (7.67 pp) |
| throughput/15000/replace.middle         |          1,246.51 (105.5) |         1,235.38 (19.84) |  -0.89% |   -0.35% (12.06 pp) |
| throughput/20000/replace.middle         |          1,349.58 (49.56) |        1,298.43 (123.53) |  -3.79% |  -11.60% (12.67 pp) |
| throughput/25000/replace.middle         |          1,347.48 (20.87) |         1,319.15 (95.02) |  -2.10% |    -3.68% (6.91 pp) |
| throughput/100/replace.random           |         1,655.03 (276.93) |          1,716.4 (39.64) |  +3.71% |   +4.80% (18.02 pp) |
| throughput/1000/replace.random          |           1,882.45 (26.5) |        1,816.26 (107.76) |  -3.52% |    -5.10% (7.44 pp) |
| throughput/5000/replace.random          |         1,802.93 (136.85) |         1,783.59 (21.84) |  -1.07% |    -0.97% (1.74 pp) |
| throughput/10000/replace.random         |          1,759.21 (102.3) |          1,749.77 (8.82) |  -0.54% |   -0.54% (10.05 pp) |
| throughput/15000/replace.random         |           1,816.03 (55.6) |          1,754.6 (61.88) |  -3.38% |   -2.65% (11.19 pp) |
| throughput/20000/replace.random         |         2,057.93 (146.65) |        1,795.44 (153.77) | -12.76% |   -10.23% (6.88 pp) |
| throughput/25000/replace.random         |          1,819.66 (81.79) |        1,836.74 (102.95) |  +0.94% |   +2.35% (13.71 pp) |
| throughput/100/replace.sameIndex        |         1,036.83 (244.78) |        1,180.35 (138.63) | +13.84% |  +13.84% (36.45 pp) |
| throughput/1000/replace.sameIndex       |          1,238.43 (37.24) |            1,194.76 (29) |  -3.53% |    -1.19% (1.01 pp) |
| throughput/5000/replace.sameIndex       |          1,186.29 (16.86) |         1,128.84 (74.63) |  -4.84% |    -3.67% (5.84 pp) |
| throughput/10000/replace.sameIndex      |           1,181.53 (73.5) |         1,180.54 (61.94) |  -0.08% |    -4.29% (8.41 pp) |
| throughput/15000/replace.sameIndex      |         1,187.55 (116.83) |          1,150.7 (64.62) |  -3.10% |    -5.32% (4.59 pp) |
| throughput/20000/replace.sameIndex      |         1,411.04 (113.16) |         1,321.97 (98.12) |  -6.31% |  -15.46% (15.68 pp) |
| throughput/25000/replace.sameIndex      |         1,278.21 (148.22) |        1,277.95 (116.71) |  -0.02% |   +0.16% (19.02 pp) |
| throughput/100/replace.tail             |          1,065.7 (179.25) |         1,199.25 (47.96) | +12.53% |   +5.21% (15.86 pp) |
| throughput/1000/replace.tail            |          1,251.67 (18.76) |         1,237.88 (30.82) |  -1.10% |    -1.57% (5.81 pp) |
| throughput/5000/replace.tail            |          1,246.29 (82.97) |          1,196.8 (52.47) |  -3.97% |   -3.97% (12.14 pp) |
| throughput/10000/replace.tail           |           1,202.77 (3.93) |           1,180 (107.96) |  -1.89% |    -1.76% (8.78 pp) |
| throughput/15000/replace.tail           |          1,239.57 (56.02) |          1,180.36 (18.6) |  -4.78% |    -0.95% (6.76 pp) |
| throughput/20000/replace.tail           |          1,288.3 (134.82) |         1,324.69 (84.74) |  +2.82% |   +2.83% (22.82 pp) |
| throughput/25000/replace.tail           |         1,289.77 (133.29) |          1,233.08 (27.9) |  -4.40% |    -3.64% (0.36 pp) |
| throughput/100/retire                   |               195 (11.85) |           265.49 (61.05) | +36.15% |  +37.25% (16.16 pp) |
| throughput/1000/retire                  |             225.78 (3.04) |            220.83 (3.34) |  -2.19% |    -2.19% (4.14 pp) |
| throughput/5000/retire                  |              209.03 (5.3) |           207.59 (12.55) |  -0.69% |    +1.19% (1.88 pp) |
| throughput/10000/retire                 |             201.15 (2.16) |           206.88 (80.51) |  +2.85% |   +3.15% (40.47 pp) |
| throughput/15000/retire                 |               200 (14.56) |            192.35 (4.28) |  -3.83% |    -5.04% (8.68 pp) |
| throughput/20000/retire                 |              200.3 (18.2) |           204.98 (28.04) |  +2.34% |    -1.58% (8.94 pp) |
| throughput/25000/retire                 |             188.55 (3.95) |           202.53 (31.56) |  +7.41% |   +4.16% (16.07 pp) |
| throughput/100/sequence                 |            337.37 (44.15) |           341.03 (33.33) |  +1.08% |    -0.23% (2.25 pp) |
| throughput/1000/sequence                |             317.56 (0.89) |            315.47 (9.19) |  -0.66% |    -2.67% (2.96 pp) |
| throughput/5000/sequence                |             285.48 (4.55) |            276.31 (9.77) |  -3.21% |    -3.16% (4.88 pp) |
| throughput/10000/sequence               |             269.31 (4.35) |            277.79 (9.66) |  +3.15% |    +3.46% (5.85 pp) |
| throughput/15000/sequence               |             273.09 (7.91) |           269.78 (21.98) |  -1.21% |    -3.44% (7.03 pp) |
| throughput/20000/sequence               |            287.19 (67.34) |           273.07 (25.12) |  -4.92% |   +0.54% (21.45 pp) |
| throughput/25000/sequence               |             264.42 (1.23) |               262 (3.16) |  -0.92% |    -0.91% (4.47 pp) |
| throughput/100/value.head               |            208.05 (17.25) |           198.47 (20.45) |  -4.60% |    +2.04% (5.52 pp) |
| throughput/1000/value.head              |             172.96 (5.78) |            168.05 (0.94) |  -2.84% |    -2.54% (8.19 pp) |
| throughput/5000/value.head              |             148.39 (3.79) |           143.14 (15.06) |  -3.54% |    -2.99% (1.91 pp) |
| throughput/10000/value.head             |            146.17 (12.35) |              141.31 (20) |  -3.32% |    +2.92% (9.05 pp) |
| throughput/15000/value.head             |             139.74 (5.38) |             135.96 (3.3) |  -2.71% |    -1.75% (2.36 pp) |
| throughput/20000/value.head             |            150.42 (12.22) |           155.67 (40.48) |  +3.49% |   -0.90% (40.49 pp) |
| throughput/25000/value.head             |             139.35 (8.48) |            132.99 (5.45) |  -4.56% |    -2.14% (2.39 pp) |
| throughput/100/value.middle             |            265.82 (16.77) |            271.83 (5.65) |  +2.26% |    +2.26% (16.9 pp) |
| throughput/1000/value.middle            |            265.49 (16.14) |            256.44 (7.17) |  -3.41% |    +1.01% (5.35 pp) |
| throughput/5000/value.middle            |             242.82 (9.57) |           227.81 (77.98) |  -6.18% |    -3.81% (31.6 pp) |
| throughput/10000/value.middle           |             222.54 (6.04) |            224.51 (1.46) |  +0.89% |    +0.58% (9.12 pp) |
| throughput/15000/value.middle           |             226.46 (8.22) |            210.23 (9.94) |  -7.17% |    -3.69% (5.64 pp) |
| throughput/20000/value.middle           |             211.03 (6.44) |           232.19 (29.78) | +10.03% |   +2.45% (24.41 pp) |
| throughput/25000/value.middle           |             220.08 (6.32) |            219.49 (5.58) |  -0.27% |    -0.27% (5.38 pp) |
| throughput/100/value.random             |             224.61 (2.93) |            243.69 (24.1) |  +8.49% |   +8.56% (19.33 pp) |
| throughput/1000/value.random            |             234.45 (8.56) |            271.55 (8.67) | +15.82% |   +16.59% (0.99 pp) |
| throughput/5000/value.random            |            283.61 (27.12) |           283.87 (63.73) |  +0.09% |   +7.16% (25.27 pp) |
| throughput/10000/value.random           |             288.13 (7.78) |           289.59 (18.93) |  +0.51% |    -3.80% (6.41 pp) |
| throughput/15000/value.random           |            283.18 (21.13) |            256.77 (8.48) |  -9.33% |   -4.37% (10.05 pp) |
| throughput/20000/value.random           |             294.55 (5.26) |           287.98 (11.71) |  -2.23% |     -3.90% (2.9 pp) |
| throughput/25000/value.random           |            268.98 (22.18) |            283.88 (8.48) |  +5.54% |    +1.33% (5.24 pp) |
| throughput/100/value.sameIndex          |            207.13 (10.49) |           228.03 (14.74) | +10.09% |   +13.32% (3.71 pp) |
| throughput/1000/value.sameIndex         |             186.73 (9.67) |           192.09 (11.46) |  +2.87% |    +1.06% (1.24 pp) |
| throughput/5000/value.sameIndex         |             172.03 (7.56) |           193.84 (58.99) | +12.68% |  +15.02% (29.55 pp) |
| throughput/10000/value.sameIndex        |            183.13 (17.75) |            170.22 (3.12) |  -7.05% |  -10.58% (11.04 pp) |
| throughput/15000/value.sameIndex        |             169.26 (4.22) |           175.14 (13.32) |  +3.47% |    +6.42% (6.02 pp) |
| throughput/20000/value.sameIndex        |            164.08 (14.25) |           238.41 (70.59) | +45.30% |  +23.46% (46.07 pp) |
| throughput/25000/value.sameIndex        |             159.83 (6.36) |           155.66 (12.27) |  -2.61% |    -1.58% (4.88 pp) |
| throughput/100/value.tail               |              228.6 (8.38) |           273.74 (28.02) | +19.75% |  +22.50% (16.65 pp) |
| throughput/1000/value.tail              |             220.03 (2.66) |            221.37 (2.37) |  +0.61% |    -0.34% (3.71 pp) |
| throughput/5000/value.tail              |            198.81 (14.03) |           199.03 (31.21) |  +0.11% |   -0.29% (22.92 pp) |
| throughput/10000/value.tail             |            193.66 (12.38) |           195.86 (11.26) |  +1.14% |       -0.00% (4 pp) |
| throughput/15000/value.tail             |             181.04 (5.13) |           189.66 (15.49) |  +4.76% |    +3.70% (8.17 pp) |
| throughput/20000/value.tail             |            182.12 (18.51) |           186.63 (20.66) |  +2.48% |    +2.90% (7.58 pp) |
| throughput/25000/value.tail             |            193.83 (13.89) |            176.51 (4.77) |  -8.94% |    -8.74% (5.65 pp) |
| throughput/100/values                   |         4,936.43 (230.44) |        5,091.77 (152.58) |  +3.15% |    +3.33% (1.93 pp) |
| throughput/1000/values                  |     178,236.28 (6,568.58) |    167,432.19 (8,106.93) |  -6.06% |    -7.49% (3.43 pp) |
| throughput/5000/values                  |    533,265.63 (27,154.56) |    599,058.33 (69,527.6) | +12.34% |    +3.28% (9.41 pp) |
| throughput/10000/values                 | 1,238,924.22 (325,017.97) |   1,195,800 (119,207.03) |  -3.48% |    -3.48% (7.53 pp) |
| throughput/15000/values                 |  2,011,137.5 (342,551.56) |   1,795,750 (135,140.63) | -10.71% |   -4.65% (15.17 pp) |
| throughput/20000/values                 | 2,770,031.25 (221,129.69) |   2,553,387.5 (7,707.81) |  -7.82% |    -4.46% (9.55 pp) |
| throughput/25000/values                 | 3,622,785.94 (231,534.38) | 3,481,337.5 (292,140.63) |  -3.90% |   +4.46% (20.71 pp) |
| throughput/100/values.head              |             330.43 (8.26) |           331.29 (27.38) |  +0.26% |   +8.30% (11.55 pp) |
| throughput/1000/values.head             |                276.67 (6) |           311.57 (45.06) | +12.61% |   +13.26% (12.9 pp) |
| throughput/5000/values.head             |             271.74 (9.27) |           275.36 (28.33) |  +1.33% |   -0.22% (11.64 pp) |
| throughput/10000/values.head            |            274.65 (21.83) |            295.5 (48.02) |  +7.59% |    +2.91% (24.1 pp) |
| throughput/15000/values.head            |            275.06 (14.11) |           268.97 (26.87) |  -2.21% |   -5.08% (20.57 pp) |
| throughput/20000/values.head            |            246.14 (43.72) |           299.39 (31.35) | +21.63% |  +21.63% (30.87 pp) |
| throughput/25000/values.head            |            280.75 (15.33) |           301.47 (52.57) |  +7.38% |  +12.27% (15.39 pp) |
| throughput/100/values.middle            |            352.81 (91.04) |            313.34 (7.98) | -11.19% |  -11.48% (22.09 pp) |
| throughput/1000/values.middle           |             277.83 (7.99) |           269.88 (10.38) |  -2.86% |    -3.26% (3.08 pp) |
| throughput/5000/values.middle           |            278.28 (28.66) |           305.98 (62.31) |  +9.95% |   +24.17% (32.1 pp) |
| throughput/10000/values.middle          |            256.04 (37.73) |           270.36 (28.66) |  +5.59% |    +5.76% (8.67 pp) |
| throughput/15000/values.middle          |            239.05 (24.78) |           252.81 (27.35) |  +5.76% |   +4.39% (18.79 pp) |
| throughput/20000/values.middle          |            297.74 (56.95) |           248.68 (49.75) | -16.48% |      -3.46% (37 pp) |
| throughput/25000/values.middle          |            247.41 (24.83) |            258.56 (25.2) |  +4.51% |    +1.08% (6.76 pp) |
| throughput/100/values.random            |            347.47 (10.69) |           353.84 (40.38) |  +1.83% |    -1.55% (8.52 pp) |
| throughput/1000/values.random           |            307.62 (15.71) |            305.56 (1.72) |  -0.67% |    -0.17% (2.87 pp) |
| throughput/5000/values.random           |            352.64 (22.61) |          370.05 (102.49) |  +4.94% |   -2.40% (30.31 pp) |
| throughput/10000/values.random          |            357.39 (21.22) |          386.72 (106.18) |  +8.21% |   -7.27% (22.61 pp) |
| throughput/15000/values.random          |             359.75 (3.68) |             373.5 (34.8) |  +3.82% |   +3.78% (12.71 pp) |
| throughput/20000/values.random          |            417.94 (41.15) |              392 (15.46) |  -6.21% |    -3.07% (6.69 pp) |
| throughput/25000/values.random          |            376.87 (28.88) |            389.25 (36.3) |  +3.28% |   +2.51% (13.97 pp) |
| throughput/100/values.sameIndex         |             313.21 (7.46) |           310.08 (20.63) |  -1.00% |    +1.51% (3.11 pp) |
| throughput/1000/values.sameIndex        |             280.91 (1.33) |           281.59 (14.73) |  +0.24% |    +3.50% (8.44 pp) |
| throughput/5000/values.sameIndex        |            259.81 (46.81) |           272.31 (36.73) |  +4.81% |   +3.74% (37.03 pp) |
| throughput/10000/values.sameIndex       |            251.73 (28.04) |           272.14 (11.83) |  +8.11% |     +7.72% (3.7 pp) |
| throughput/15000/values.sameIndex       |            258.12 (19.13) |            240.79 (18.5) |  -6.71% |   -2.01% (13.29 pp) |
| throughput/20000/values.sameIndex       |            270.56 (10.65) |           240.05 (15.52) | -11.28% |    -5.89% (4.17 pp) |
| throughput/25000/values.sameIndex       |            255.15 (24.34) |            238.28 (18.8) |  -6.61% |   -0.59% (14.11 pp) |
| throughput/100/values.tail              |            300.57 (18.28) |            303.05 (5.04) |  +0.83% |   +0.69% (20.03 pp) |
| throughput/1000/values.tail             |             269.38 (5.33) |            271.66 (8.22) |  +0.85% |    -2.19% (5.69 pp) |
| throughput/5000/values.tail             |            274.91 (45.59) |           286.29 (40.83) |  +4.14% |   -3.39% (19.89 pp) |
| throughput/10000/values.tail            |            269.26 (65.03) |           263.17 (13.59) |  -2.26% |   -2.26% (22.95 pp) |
| throughput/15000/values.tail            |             239.31 (10.2) |            255.66 (37.1) |  +6.83% |   +4.74% (19.17 pp) |
| throughput/20000/values.tail            |            267.74 (48.99) |            247.1 (10.12) |  -7.71% |   -8.33% (23.24 pp) |
| throughput/25000/values.tail            |             244.3 (15.27) |            240.45 (5.16) |  -1.58% |    -1.34% (7.66 pp) |
| lifecycle/scaleUp/apply.random          |         3,906.51 (127.68) |        4,261.42 (634.75) |  +9.09% |   -3.93% (21.34 pp) |
| lifecycle/scaleUp/insert.head           |            855.66 (73.18) |          866.85 (140.42) |  +1.31% |   +2.81% (12.14 pp) |
| lifecycle/scaleUp/insert.random         |         1,852.36 (130.46) |        1,832.78 (108.87) |  -1.06% |    -0.52% (8.06 pp) |
| lifecycle/scaleUp/insert.tail           |           826.85 (120.26) |          767.46 (122.05) |  -7.18% |    +2.75% (9.06 pp) |
| lifecycle/scaleUp/remove.random         |         2,802.82 (351.06) |        3,004.47 (461.05) |  +7.19% |   +2.63% (11.63 pp) |
| lifecycle/scaleUp/replace.head          |            2,595 (222.74) |        2,861.15 (208.35) | +10.26% |  +16.59% (10.56 pp) |
| lifecycle/scaleUp/replace.random        |          3,773.19 (423.6) |        3,587.54 (206.34) |  -4.92% |    -0.46% (5.86 pp) |
| lifecycle/scaleUp/replace.tail          |          2,327.17 (60.43) |         2,671.5 (299.82) | +14.80% |   +4.31% (17.45 pp) |
| lifecycle/scaleUp/value.head            |            325.94 (10.84) |           329.52 (23.83) |  +1.10% |     +1.10% (9.6 pp) |
| lifecycle/scaleUp/value.random          |          1,136.28 (39.38) |         1,155.62 (90.06) |  +1.70% |   +2.28% (14.09 pp) |
| lifecycle/scaleUp/value.tail            |             151.84 (2.04) |           159.34 (10.99) |  +4.94% |    +3.78% (5.74 pp) |
| lifecycle/scaleDown/apply.random        |         3,546.97 (119.42) |          3,501.42 (99.4) |  -1.28% |    -2.49% (4.97 pp) |
| lifecycle/scaleDown/insert.random       |           1,702.9 (48.01) |         1,740.06 (96.02) |  +2.18% |    +2.18% (6.69 pp) |
| lifecycle/scaleDown/remove.head         |          1,910.6 (105.37) |         1,929.47 (62.58) |  +0.99% |    -0.64% (3.12 pp) |
| lifecycle/scaleDown/remove.random       |         2,695.58 (159.61) |         2,673.97 (66.89) |  -0.80% |    -0.80% (1.63 pp) |
| lifecycle/scaleDown/remove.tail         |          1,734.84 (60.73) |         1,746.18 (22.13) |  +0.65% |     -2.75% (5.2 pp) |
| lifecycle/scaleDown/replace.head        |          2,867.73 (138.6) |        2,516.06 (113.47) | -12.26% |   -12.49% (2.62 pp) |
| lifecycle/scaleDown/replace.random      |         3,273.34 (257.66) |          3,266.6 (96.16) |  -0.21% |    -0.23% (5.93 pp) |
| lifecycle/scaleDown/replace.tail        |        19,000.17 (442.16) |       20,007.36 (293.42) |  +5.30% |    +3.65% (5.06 pp) |
| lifecycle/scaleDown/value.head          |            416.43 (28.38) |           421.38 (14.13) |  +1.19% |    +2.33% (4.31 pp) |
| lifecycle/scaleDown/value.random        |           1,076.45 (6.48) |          1,075.32 (13.3) |  -0.11% |    -0.01% (1.18 pp) |
| lifecycle/scaleDown/value.tail          |            226.91 (12.78) |             234.86 (3.5) |  +3.51% |    +3.13% (6.95 pp) |
| lifecycle/fullLifecycle/apply.random    |          3,700.53 (71.43) |        3,838.93 (175.82) |  +3.74% |    +0.72% (9.38 pp) |
| lifecycle/fullLifecycle/insert.head     |            855.66 (73.18) |          866.85 (140.42) |  +1.31% |   +2.81% (12.14 pp) |
| lifecycle/fullLifecycle/insert.random   |          1,768.55 (39.92) |         1,796.56 (45.98) |  +1.58% |    +2.27% (2.34 pp) |
| lifecycle/fullLifecycle/insert.tail     |           826.85 (120.26) |          767.46 (122.05) |  -7.18% |    +2.75% (9.06 pp) |
| lifecycle/fullLifecycle/remove.head     |          1,910.6 (105.37) |         1,929.47 (62.58) |  +0.99% |    -0.64% (3.12 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,909.02 (189.61) |         2,865.89 (73.58) |  -1.48% |    +1.04% (8.69 pp) |
| lifecycle/fullLifecycle/remove.tail     |          1,734.84 (60.73) |         1,746.18 (22.13) |  +0.65% |     -2.75% (5.2 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,731.37 (138.76) |         2,776.98 (130.2) |  +1.67% |    +0.72% (3.77 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,523.26 (596.35) |        3,457.11 (297.53) |  -1.88% |    -0.32% (2.37 pp) |
| lifecycle/fullLifecycle/replace.tail    |        10,686.69 (244.12) |       11,171.25 (352.91) |  +4.53% |     +4.50% (3.2 pp) |
| lifecycle/fullLifecycle/value.head      |            371.18 (19.61) |           374.95 (18.48) |  +1.02% |    +1.54% (6.88 pp) |
| lifecycle/fullLifecycle/value.random    |          1,106.37 (12.76) |          1,118.4 (50.54) |  +1.09% |    +1.36% (7.99 pp) |
| lifecycle/fullLifecycle/value.tail      |             189.06 (7.09) |            198.21 (4.86) |  +4.84% |    +5.82% (6.56 pp) |
| checkpoint/up/1000/create               |          411,500 (76,000) |         404,100 (61,300) |  -1.80% |   -4.81% (16.67 pp) |
| checkpoint/up/1000/sequence             |       2,608,600 (434,400) |      2,625,200 (223,700) |  +0.64% |    +0.15% (9.42 pp) |
| checkpoint/up/1000/values               |       1,818,800 (297,400) |      1,902,600 (769,100) |  +4.61% |   +8.91% (24.55 pp) |
| checkpoint/up/5000/create               |          927,200 (98,700) |         903,800 (27,000) |  -2.52% |    -2.52% (6.86 pp) |
| checkpoint/up/5000/sequence             |       7,893,900 (679,500) |      7,830,200 (661,800) |  -0.81% |    -3.33% (4.83 pp) |
| checkpoint/up/5000/values               |       5,194,600 (594,300) |      4,631,100 (831,000) | -10.85% |    -3.43% (21.1 pp) |
| checkpoint/up/10000/create              |        1,572,600 (41,500) |      1,503,000 (129,000) |  -4.43% |   -2.98% (12.63 pp) |
| checkpoint/up/10000/sequence            |      13,451,500 (989,400) |     14,348,700 (626,000) |  +6.67% |    +6.67% (8.45 pp) |
| checkpoint/up/10000/values              |      21,176,400 (643,400) |     20,325,400 (342,600) |  -4.02% |    -4.87% (4.94 pp) |
| checkpoint/up/15000/create              |       2,500,600 (243,000) |       2,417,900 (55,200) |  -3.31% |   -6.53% (11.77 pp) |
| checkpoint/up/15000/sequence            |    14,838,200 (1,374,700) |   15,479,200 (1,008,500) |  +4.32% |   +7.07% (11.06 pp) |
| checkpoint/up/15000/values              |      29,799,500 (791,600) |     30,667,200 (405,800) |  +2.91% |    +3.40% (6.09 pp) |
| checkpoint/up/20000/create              |        3,421,000 (84,700) |      3,400,400 (119,800) |  -0.60% |    -0.62% (3.13 pp) |
| checkpoint/up/20000/sequence            |      21,986,600 (882,900) |     21,546,900 (454,900) |  -2.00% |    -2.52% (5.34 pp) |
| checkpoint/up/20000/values              |    11,249,900 (1,243,000) |     10,612,000 (432,000) |  -5.67% |   -9.62% (14.43 pp) |
| checkpoint/up/25000/create              |       4,053,700 (172,100) |      3,993,500 (106,300) |  -1.49% |    -4.30% (4.64 pp) |
| checkpoint/up/25000/sequence            |      25,085,700 (451,900) |     24,539,900 (600,600) |  -2.18% |    -1.67% (2.48 pp) |
| checkpoint/up/25000/values              |      11,624,400 (420,900) |     11,744,000 (143,300) |  +1.03% |    +1.44% (5.91 pp) |
| checkpoint/down/20000/create            |        3,456,500 (12,200) |      3,372,300 (152,300) |  -2.44% |    -2.37% (4.76 pp) |
| checkpoint/down/20000/sequence          |      19,747,000 (754,300) |     18,521,300 (736,700) |  -6.21% |    -3.25% (7.19 pp) |
| checkpoint/down/20000/values            |       9,689,600 (689,900) |      9,511,500 (649,500) |  -1.84% |    -4.54% (3.34 pp) |
| checkpoint/down/15000/create            |       2,610,600 (147,800) |       2,481,100 (74,800) |  -4.96% |    -7.04% (7.68 pp) |
| checkpoint/down/15000/sequence          |    16,785,900 (3,263,700) |   17,240,100 (1,378,500) |  +2.71% |    -1.51% (7.53 pp) |
| checkpoint/down/15000/values            |       7,437,200 (774,400) |      7,414,700 (605,000) |  -0.30% |    +4.75% (3.34 pp) |
| checkpoint/down/10000/create            |        1,680,300 (72,100) |       1,660,300 (19,600) |  -1.19% |    -2.90% (4.12 pp) |
| checkpoint/down/10000/sequence          |      12,669,500 (478,000) |   13,125,200 (1,409,300) |  +3.60% |    +3.98% (8.89 pp) |
| checkpoint/down/10000/values            |       5,453,700 (619,600) |      5,338,400 (102,800) |  -2.11% |    -0.55% (6.63 pp) |
| checkpoint/down/5000/create             |          800,700 (14,300) |         808,200 (27,200) |  +0.94% |    +1.66% (3.96 pp) |
| checkpoint/down/5000/sequence           |        9,596,300 (83,200) |     10,238,600 (481,200) |  +6.69% |     +7.30% (5.9 pp) |
| checkpoint/down/5000/values             |       3,284,300 (685,900) |      2,718,500 (364,700) | -17.23% |   -8.21% (13.17 pp) |
| checkpoint/down/1000/create             |           158,800 (4,900) |         162,000 (39,000) |  +2.02% |    +1.17% (6.42 pp) |
| checkpoint/down/1000/sequence           |       6,161,400 (602,600) |      5,644,000 (389,000) |  -8.40% |   -8.40% (19.39 pp) |
| checkpoint/down/1000/values             |          509,400 (29,600) |         558,800 (75,000) |  +9.70% |   +0.98% (18.37 pp) |
| checkpoint/down/0/create                |            15,000 (4,500) |           14,400 (1,700) |  -4.00% |  -13.33% (34.42 pp) |
| checkpoint/down/0/sequence              |       1,342,100 (156,300) |      1,349,600 (220,000) |  +0.56% |   +3.78% (16.56 pp) |
| checkpoint/down/0/values                |            10,400 (1,500) |              9,300 (700) | -10.58% |   +4.21% (18.81 pp) |
| tuple/projection/2/create.empty         |            391.45 (63.37) |            371.89 (7.26) |  -5.00% |    -3.09% (5.46 pp) |
| tuple/tuple/2/create.empty              |            457.92 (31.67) |            441.44 (1.75) |  -3.60% |    -3.16% (2.05 pp) |
| tuple/projection/2/create.sequence      |           1,285.1 (26.55) |         1,214.66 (32.72) |  -5.48% |    -6.24% (0.72 pp) |
| tuple/tuple/2/create.sequence           |           1,444.09 (59.3) |         1,396.17 (15.44) |  -3.32% |     -5.34% (2.8 pp) |
| tuple/projection/2/replace.random       |          1,096.51 (73.83) |         1,093.38 (79.24) |  -0.29% |   -5.55% (11.71 pp) |
| tuple/tuple/2/replace.random            |            754.29 (61.73) |           707.28 (29.85) |  -6.23% |   -3.19% (11.27 pp) |
| tuple/projection/2/apply.replace        |          1,835.11 (81.46) |        1,923.35 (267.31) |  +4.81% |   +9.35% (16.66 pp) |
| tuple/tuple/2/apply.replace             |          1,239.43 (78.86) |        1,228.78 (114.72) |  -0.86% |    -0.86% (4.86 pp) |
| tuple/projection/2/apply.duplicate      |            674.44 (56.83) |           669.94 (17.08) |  -0.67% |   +8.52% (10.76 pp) |
| tuple/tuple/2/apply.duplicate           |             654.13 (8.47) |            639.5 (14.95) |  -2.24% |    -1.98% (1.61 pp) |
| tuple/projection/2/merge.duplicate      |           760.54 (126.45) |           681.37 (38.79) | -10.41% |    +3.74% (20.4 pp) |
| tuple/tuple/2/merge.duplicate           |            713.22 (59.63) |            658.15 (6.74) |  -7.72% |   -5.42% (13.74 pp) |
| tuple/projection/2/length               |               7.67 (0.04) |              7.86 (1.11) |  +2.53% |   +2.75% (15.14 pp) |
| tuple/tuple/2/length                    |               7.73 (1.03) |              7.66 (0.18) |  -1.02% |   +1.53% (15.28 pp) |
| tuple/projection/2/value.random         |              29.56 (3.44) |             30.55 (2.21) |  +3.34% |    -2.87% (14.4 pp) |
| tuple/tuple/2/value.random              |              19.49 (0.42) |             18.85 (0.67) |  -3.25% |    -2.23% (4.76 pp) |
| tuple/projection/2/values               |              82.13 (3.11) |             86.97 (5.54) |  +5.89% |    +6.23% (4.66 pp) |
| tuple/tuple/2/values                    |               82.1 (3.45) |             82.02 (3.88) |  -0.09% |    +0.06% (0.46 pp) |
| tuple/projection/2/sequence             |            460.49 (12.73) |            467.68 (14.2) |  +1.56% |    +0.19% (2.41 pp) |
| tuple/tuple/2/sequence                  |               498 (27.39) |           494.29 (32.68) |  -0.74% |    +3.83% (8.75 pp) |
| tuple/projection/4/create.empty         |             437.68 (3.31) |           437.97 (20.34) |  +0.07% |    +0.07% (6.75 pp) |
| tuple/tuple/4/create.empty              |            444.83 (24.32) |           445.93 (10.31) |  +0.25% |    -0.73% (4.54 pp) |
| tuple/projection/4/create.sequence      |         1,674.85 (232.48) |         1,597.92 (83.42) |  -4.59% |   -4.76% (15.04 pp) |
| tuple/tuple/4/create.sequence           |         1,656.92 (157.19) |         1,632.18 (193.8) |  -1.49% |    +4.08% (8.92 pp) |
| tuple/projection/4/replace.random       |         1,204.37 (174.43) |         1,185.08 (68.35) |  -1.60% |    +3.81% (4.85 pp) |
| tuple/tuple/4/replace.random            |               667 (74.55) |           658.03 (36.73) |  -1.34% |    -1.34% (6.81 pp) |
| tuple/projection/4/apply.replace        |         1,723.18 (158.46) |        1,757.26 (155.91) |  +1.98% |   -0.35% (18.28 pp) |
| tuple/tuple/4/apply.replace             |          1,146.66 (61.13) |        1,046.26 (109.73) |  -8.76% |   -5.44% (11.24 pp) |
| tuple/projection/4/apply.duplicate      |            631.08 (46.92) |           581.27 (64.15) |  -7.89% |   -0.51% (10.17 pp) |
| tuple/tuple/4/apply.duplicate           |             625.66 (2.59) |           631.82 (78.27) |  +0.98% |   +1.19% (21.34 pp) |
| tuple/projection/4/merge.duplicate      |           814.09 (272.16) |            791.5 (28.67) |  -2.77% |    -2.23% (9.48 pp) |
| tuple/tuple/4/merge.duplicate           |            904.5 (179.94) |           809.23 (34.16) | -10.53% |   -12.27% (5.63 pp) |
| tuple/projection/4/length               |              30.78 (3.43) |             28.89 (2.62) |  -6.13% |   -9.78% (22.75 pp) |
| tuple/tuple/4/length                    |              27.91 (0.33) |             26.84 (0.36) |  -3.82% |    -4.00% (9.44 pp) |
| tuple/projection/4/value.random         |              43.25 (2.57) |             43.01 (3.23) |  -0.57% |   -1.00% (12.46 pp) |
| tuple/tuple/4/value.random              |              19.44 (0.84) |             18.57 (1.41) |  -4.50% |   -4.50% (11.65 pp) |
| tuple/projection/4/values               |             149.75 (9.05) |            149.55 (7.64) |  -0.14% |   -0.14% (19.13 pp) |
| tuple/tuple/4/values                    |             142.98 (7.64) |            145.69 (3.43) |  +1.90% |   +0.91% (10.58 pp) |
| tuple/projection/4/sequence             |               462.99 (15) |            457.7 (16.54) |  -1.14% |    +1.81% (5.92 pp) |
| tuple/tuple/4/sequence                  |            540.38 (17.93) |           563.25 (27.95) |  +4.23% |    +0.75% (6.56 pp) |
| tuple/projection/8/create.empty         |            428.34 (18.05) |            429.3 (10.28) |  +0.22% |    +1.45% (5.45 pp) |
| tuple/tuple/8/create.empty              |            446.41 (24.04) |            454.49 (7.27) |  +1.81% |    +1.81% (3.76 pp) |
| tuple/projection/8/create.sequence      |          2,262.4 (515.73) |         2,328.35 (18.79) |  +2.92% |   -0.22% (13.95 pp) |
| tuple/tuple/8/create.sequence           |           2,065.6 (83.85) |         2,050.87 (46.99) |  -0.71% |    -1.89% (5.17 pp) |
| tuple/projection/8/replace.random       |         1,209.65 (190.08) |         1,222.26 (140.6) |  +1.04% |   +0.75% (19.03 pp) |
| tuple/tuple/8/replace.random            |            668.59 (12.03) |            700.9 (65.23) |  +4.83% |   +0.87% (16.03 pp) |
| tuple/projection/8/apply.replace        |          1,803.7 (140.42) |         1,816.36 (72.62) |  +0.70% |       -3.33% (6 pp) |
| tuple/tuple/8/apply.replace             |           1,032.6 (88.78) |         1,015.03 (39.16) |  -1.70% |     -0.76% (4.8 pp) |
| tuple/projection/8/apply.duplicate      |             597.63 (12.4) |           612.51 (13.17) |  +2.49% |     +2.49% (3.6 pp) |
| tuple/tuple/8/apply.duplicate           |            601.42 (16.45) |           623.25 (34.22) |  +3.63% |    +3.94% (4.51 pp) |
| tuple/projection/8/merge.duplicate      |         1,094.99 (471.94) |         1,080.98 (22.72) |  -1.28% |   -0.36% (29.31 pp) |
| tuple/tuple/8/merge.duplicate           |         1,312.53 (475.12) |         1,103.65 (59.55) | -15.91% |   -11.98% (23.8 pp) |
| tuple/projection/8/length               |               28.18 (1.1) |             26.51 (2.55) |  -5.94% |  -10.05% (28.36 pp) |
| tuple/tuple/8/length                    |              28.01 (5.29) |             26.45 (0.73) |  -5.57% |  -12.56% (16.69 pp) |
| tuple/projection/8/value.random         |              56.13 (4.49) |             54.97 (3.93) |  -2.07% |   +2.30% (14.26 pp) |
| tuple/tuple/8/value.random              |              19.29 (2.65) |              18.24 (0.2) |  -5.46% |   -5.46% (17.43 pp) |
| tuple/projection/8/values               |            252.83 (29.07) |            217.99 (9.29) | -13.78% |   -10.49% (9.04 pp) |
| tuple/tuple/8/values                    |             224.46 (6.41) |           206.99 (11.38) |  -7.78% |    -7.81% (12.1 pp) |
| tuple/projection/8/sequence             |            662.12 (55.79) |            647.62 (11.8) |  -2.19% |   -2.04% (11.78 pp) |
| tuple/tuple/8/sequence                  |            686.86 (14.06) |           684.03 (12.22) |  -0.41% |    -0.98% (1.02 pp) |
| tuple/projection/100/create.empty       |            463.95 (40.11) |            459.83 (8.01) |  -0.89% |    +0.65% (5.83 pp) |
| tuple/tuple/100/create.empty            |            492.03 (50.09) |           474.09 (18.57) |  -3.65% |    -2.10% (5.38 pp) |
| tuple/projection/100/create.sequence    |        14,693.11 (559.68) |       14,273.86 (170.74) |  -2.85% |     -4.47% (5.8 pp) |
| tuple/tuple/100/create.sequence         |         11,739.5 (364.06) |        11,980.51 (130.9) |  +2.05% |    +2.44% (5.95 pp) |
| tuple/projection/100/replace.random     |         1,179.76 (233.27) |            1,205.93 (97) |  +2.22% |   -0.36% (25.13 pp) |
| tuple/tuple/100/replace.random          |            664.74 (38.03) |           729.77 (95.68) |  +9.78% |   +9.78% (15.45 pp) |
| tuple/projection/100/apply.replace      |         1,851.48 (188.68) |        1,790.15 (121.76) |  -3.31% |   +5.91% (12.13 pp) |
| tuple/tuple/100/apply.replace           |          1,056.93 (27.22) |         1,020.81 (62.56) |  -3.42% |    -4.91% (9.79 pp) |
| tuple/projection/100/apply.duplicate    |              616.6 (23.6) |           610.63 (48.83) |  -0.97% |    -0.97% (8.74 pp) |
| tuple/tuple/100/apply.duplicate         |            626.74 (36.51) |           625.33 (22.95) |  -0.22% |    +0.65% (6.74 pp) |
| tuple/projection/100/merge.duplicate    |         9,070.19 (350.98) |      9,489.58 (4,554.81) |  +4.62% |   +1.88% (56.62 pp) |
| tuple/tuple/100/merge.duplicate         |        13,263.13 (428.64) |     13,458.86 (3,020.26) |  +1.48% |   +3.37% (15.64 pp) |
| tuple/projection/100/length             |              28.26 (1.86) |             28.33 (2.47) |  +0.27% |   +6.45% (27.97 pp) |
| tuple/tuple/100/length                  |              29.57 (2.95) |             28.66 (2.81) |  -3.10% |   -0.46% (44.65 pp) |
| tuple/projection/100/value.random       |              82.54 (2.62) |             79.51 (7.66) |  -3.67% |   -7.17% (18.37 pp) |
| tuple/tuple/100/value.random            |               19.09 (0.7) |             19.38 (0.31) |  +1.52% |    -0.08% (4.64 pp) |
| tuple/projection/100/values             |         1,958.05 (102.38) |         1,911.79 (28.16) |  -2.36% |    -2.84% (3.81 pp) |
| tuple/tuple/100/values                  |         1,610.98 (228.37) |         1,537.37 (32.63) |  -4.57% |   -4.90% (10.67 pp) |
| tuple/projection/100/sequence           |          6,524.41 (83.13) |        6,513.13 (352.19) |  -0.17% |   -0.73% (11.88 pp) |
| tuple/tuple/100/sequence                |          5,797.86 (747.5) |      5,860.27 (2,905.18) |  +1.08% |   +1.08% (19.03 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |     Before |  Candidate | Change |
| ----------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                     |    480,376 |    480,344 | -0.01% |
| memory/up/1000/js                         |    407,560 |    407,560 | +0.00% |
| storage/up/1000/jsonBytes                 |    278,238 |    278,238 | +0.00% |
| storage/up/1000/jsonGzipBytes             |     14,908 |     14,908 | +0.00% |
| storage/up/1000/messagePackBytes          |    165,784 |    165,784 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |     12,641 |     12,641 | +0.00% |
| memory/up/5000/native                     |  2,156,536 |  2,156,488 | -0.00% |
| memory/up/5000/js                         |  2,059,744 |  2,059,744 | +0.00% |
| storage/up/5000/jsonBytes                 |  1,662,776 |  1,662,776 | +0.00% |
| storage/up/5000/jsonGzipBytes             |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes          |    839,612 |    839,612 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |     63,127 |     63,127 | +0.00% |
| memory/up/10000/native                    |  3,567,248 |  3,567,200 | -0.00% |
| memory/up/10000/js                        |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes                |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes            |    152,232 |    152,232 | +0.00% |
| storage/up/10000/messagePackBytes         |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |    127,808 |    127,808 | +0.00% |
| memory/up/15000/native                    |  4,819,576 |  4,819,528 | -0.00% |
| memory/up/15000/js                        |  6,196,128 |  6,196,128 | +0.00% |
| storage/up/15000/jsonBytes                |  5,053,159 |  5,053,159 | +0.00% |
| storage/up/15000/jsonGzipBytes            |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes         |  3,635,106 |  3,635,106 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                    |  6,317,704 |  6,317,656 | -0.00% |
| memory/up/20000/js                        |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes                |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes            |    318,634 |    318,634 | +0.00% |
| storage/up/20000/messagePackBytes         |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |    269,890 |    269,890 | +0.00% |
| memory/up/25000/native                    |  7,541,592 |  7,541,536 | -0.00% |
| memory/up/25000/js                        | 10,328,360 | 10,328,360 | +0.00% |
| storage/up/25000/jsonBytes                |  9,500,463 |  9,500,463 | +0.00% |
| storage/up/25000/jsonGzipBytes            |    402,015 |    402,015 | +0.00% |
| storage/up/25000/messagePackBytes         |  6,711,789 |  6,711,789 | +0.00% |
| storage/up/25000/messagePackGzipBytes     |    343,336 |    343,336 | +0.00% |
| memory/down/20000/native                  |  6,597,224 |  6,597,168 | -0.00% |
| memory/down/20000/js                      |  8,267,264 |  8,267,264 | +0.00% |
| storage/down/20000/jsonBytes              |  7,760,743 |  7,760,743 | +0.00% |
| storage/down/20000/jsonGzipBytes          |    334,475 |    334,475 | +0.00% |
| storage/down/20000/messagePackBytes       |  5,444,111 |  5,444,111 | +0.00% |
| storage/down/20000/messagePackGzipBytes   |    284,870 |    284,870 | +0.00% |
| memory/down/15000/native                  |  5,747,352 |  5,747,296 | -0.00% |
| memory/down/15000/js                      |  6,212,288 |  6,212,288 | +0.00% |
| storage/down/15000/jsonBytes              |  5,878,783 |  5,878,783 | +0.00% |
| storage/down/15000/jsonGzipBytes          |    253,153 |    253,153 | +0.00% |
| storage/down/15000/messagePackBytes       |  4,110,000 |  4,110,000 | +0.00% |
| storage/down/15000/messagePackGzipBytes   |    214,870 |    214,870 | +0.00% |
| memory/down/10000/native                  |  4,721,024 |  4,720,968 | -0.00% |
| memory/down/10000/js                      |  4,155,848 |  4,155,848 | +0.00% |
| storage/down/10000/jsonBytes              |  3,941,927 |  3,941,927 | +0.00% |
| storage/down/10000/jsonGzipBytes          |    168,770 |    168,770 | +0.00% |
| storage/down/10000/messagePackBytes       |  2,750,169 |  2,750,169 | +0.00% |
| storage/down/10000/messagePackGzipBytes   |    143,189 |    143,189 | +0.00% |
| memory/down/5000/native                   |  3,777,488 |  3,777,432 | -0.00% |
| memory/down/5000/js                       |  2,066,312 |  2,066,312 | +0.00% |
| storage/down/5000/jsonBytes               |  1,950,486 |  1,950,486 | +0.00% |
| storage/down/5000/jsonGzipBytes           |     81,724 |     81,724 | +0.00% |
| storage/down/5000/messagePackBytes        |  1,363,171 |  1,363,171 | +0.00% |
| storage/down/5000/messagePackGzipBytes    |     69,494 |     69,494 | +0.00% |
| memory/down/1000/native                   |  2,719,416 |  2,719,360 | -0.00% |
| memory/down/1000/js                       |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes               |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes           |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes        |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |     13,932 |     13,932 | +0.00% |
| memory/down/0/native                      |  1,598,032 |  1,597,976 | -0.00% |
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

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_22_runtime`. No external competitor was run.
