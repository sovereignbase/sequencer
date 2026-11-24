# Retained runtime: second complete guard

5 complete matched runs per build. Before: baseline; candidate: ack-final. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 93 timing medians improve over 5%; 58 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 0%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            783.09 (68.79) |            819.01 (71.97) |  +4.59% |    +4.59% (2.24 pp) |
| throughput/1000/apply.duplicate         |            821.97 (53.93) |            847.87 (70.85) |  +3.15% |  +14.01% (15.91 pp) |
| throughput/5000/apply.duplicate         |             377.08 (23.4) |            385.43 (23.99) |  +2.21% |    +2.57% (3.67 pp) |
| throughput/10000/apply.duplicate        |            338.93 (29.83) |              343.7 (3.28) |  +1.41% |    +0.36% (2.98 pp) |
| throughput/15000/apply.duplicate        |             345.24 (8.57) |            327.53 (34.74) |  -5.13% |    -5.50% (9.82 pp) |
| throughput/20000/apply.duplicate        |            336.46 (16.87) |              311.68 (6.9) |  -7.36% |    -8.03% (7.38 pp) |
| throughput/25000/apply.duplicate        |             322.62 (3.62) |            325.57 (11.84) |  +0.91% |    +0.87% (8.14 pp) |
| throughput/100/apply.duplicateRemove    |          1,475.57 (54.06) |         1,516.62 (130.23) |  +2.78% |    -0.78% (9.67 pp) |
| throughput/1000/apply.duplicateRemove   |            823.63 (23.87) |            909.05 (76.04) | +10.37% |   +6.73% (10.39 pp) |
| throughput/5000/apply.duplicateRemove   |            791.41 (32.37) |            776.25 (10.39) |  -1.92% |    -1.92% (2.21 pp) |
| throughput/10000/apply.duplicateRemove  |            726.77 (35.31) |             720.6 (56.19) |  -0.85% |    +1.29% (4.38 pp) |
| throughput/15000/apply.duplicateRemove  |            711.08 (59.02) |            713.22 (37.81) |  +0.30% |    -3.61% (9.41 pp) |
| throughput/20000/apply.duplicateRemove  |            718.75 (327.8) |             710.85 (96.4) |  -1.10% |   -12.24% (9.28 pp) |
| throughput/25000/apply.duplicateRemove  |            680.52 (25.28) |            668.54 (64.83) |  -1.76% |    +3.90% (13.7 pp) |
| throughput/100/apply.duplicateReplace   |          1,196.7 (208.73) |         1,040.48 (195.08) | -13.05% |    -3.45% (7.36 pp) |
| throughput/1000/apply.duplicateReplace  |          1,086.47 (80.77) |          1,115.4 (104.45) |  +2.66% |   +8.17% (21.15 pp) |
| throughput/5000/apply.duplicateReplace  |            981.14 (65.03) |           961.01 (104.86) |  -2.05% |    +1.10% (8.76 pp) |
| throughput/10000/apply.duplicateReplace |             902.1 (19.46) |             922.42 (42.8) |  +2.25% |    +2.79% (6.22 pp) |
| throughput/15000/apply.duplicateReplace |            844.74 (68.33) |            870.53 (63.48) |  +3.05% |   +4.37% (10.84 pp) |
| throughput/20000/apply.duplicateReplace |            837.81 (85.68) |           846.56 (211.99) |  +1.04% |   -1.62% (11.58 pp) |
| throughput/25000/apply.duplicateReplace |            810.18 (65.94) |            838.46 (58.78) |  +3.49% |    +0.13% (6.33 pp) |
| throughput/100/apply.insert             |          1,701.11 (30.98) |         1,654.24 (105.62) |  -2.76% |    -2.62% (8.72 pp) |
| throughput/1000/apply.insert            |           1,357.32 (33.2) |         1,401.99 (253.21) |  +3.29% |   +3.29% (16.03 pp) |
| throughput/5000/apply.insert            |          1,370.18 (34.23) |         1,309.17 (195.46) |  -4.45% |   +1.54% (14.21 pp) |
| throughput/10000/apply.insert           |          1,339.73 (52.84) |         1,419.55 (200.49) |  +5.96% |    +5.37% (2.84 pp) |
| throughput/15000/apply.insert           |         1,307.93 (165.25) |         1,384.01 (109.66) |  +5.82% |   +0.78% (15.87 pp) |
| throughput/20000/apply.insert           |         1,223.82 (127.08) |         1,240.54 (114.43) |  +1.37% |    -3.99% (5.85 pp) |
| throughput/25000/apply.insert           |         1,373.24 (174.58) |          1,237.3 (163.45) |  -9.90% |  -10.95% (18.86 pp) |
| throughput/100/apply.remove             |          1,966.39 (46.77) |          1,788.07 (83.09) |  -9.07% |   -9.07% (12.19 pp) |
| throughput/1000/apply.remove            |          1,469.03 (27.09) |          1,494.14 (55.49) |  +1.71% |    +2.48% (9.27 pp) |
| throughput/5000/apply.remove            |          1,527.19 (86.28) |           1,547.2 (35.81) |  +1.31% |    +1.07% (3.69 pp) |
| throughput/10000/apply.remove           |          1,481.39 (12.82) |          1,508.65 (240.4) |  +1.84% |   +8.93% (17.64 pp) |
| throughput/15000/apply.remove           |         1,586.45 (125.83) |         1,524.76 (159.88) |  -3.89% |    -3.82% (3.48 pp) |
| throughput/20000/apply.remove           |         1,516.26 (354.92) |           1,528.29 (14.3) |  +0.79% |   +0.79% (20.44 pp) |
| throughput/25000/apply.remove           |          1,578.95 (85.66) |          1,539.07 (47.36) |  -2.53% |   -3.33% (12.22 pp) |
| throughput/100/apply.replace            |         3,108.96 (413.37) |         2,771.83 (227.77) | -10.84% |  -14.49% (16.23 pp) |
| throughput/1000/apply.replace           |          2,641.6 (200.57) |          2,796.23 (31.69) |  +5.85% |   +6.31% (11.64 pp) |
| throughput/5000/apply.replace           |         2,742.44 (106.05) |          2,777.73 (88.67) |  +1.29% |     -0.25% (9.8 pp) |
| throughput/10000/apply.replace          |          2,625.38 (129.7) |         2,780.14 (217.97) |  +5.89% |    +9.81% (6.77 pp) |
| throughput/15000/apply.replace          |         2,776.19 (159.95) |         2,770.58 (207.76) |  -0.20% |    -3.94% (2.45 pp) |
| throughput/20000/apply.replace          |          2,653.02 (69.19) |         2,925.14 (125.31) | +10.26% |   +4.93% (12.64 pp) |
| throughput/25000/apply.replace          |         2,717.86 (147.64) |         2,708.26 (107.79) |  -0.35% |    -2.87% (9.61 pp) |
| throughput/100/create.empty             |            623.62 (29.95) |            592.86 (67.81) |  -4.93% |    -7.76% (19.5 pp) |
| throughput/1000/create.empty            |            716.87 (73.79) |            730.93 (78.63) |  +1.96% |  +11.42% (22.46 pp) |
| throughput/5000/create.empty            |            763.68 (29.19) |            793.92 (44.56) |  +3.96% |    +6.85% (8.71 pp) |
| throughput/10000/create.empty           |            721.28 (67.73) |            758.62 (61.46) |  +5.18% |   +8.06% (11.27 pp) |
| throughput/15000/create.empty           |            733.88 (12.72) |            774.29 (38.52) |  +5.51% |    +3.75% (7.14 pp) |
| throughput/20000/create.empty           |            717.97 (40.03) |            793.55 (69.65) | +10.53% |  +10.53% (20.56 pp) |
| throughput/25000/create.empty           |           746.42 (126.24) |           783.49 (107.06) |  +4.97% |    -3.62% (23.4 pp) |
| throughput/100/create.sequence          |         1,718.47 (116.02) |         1,485.22 (188.01) | -13.57% |  -13.08% (17.04 pp) |
| throughput/1000/create.sequence         |         1,911.81 (185.96) |          1,901.89 (40.79) |  -0.52% |   -1.07% (13.08 pp) |
| throughput/5000/create.sequence         |          1,719.94 (36.02) |          1,627.55 (89.87) |  -5.37% |   -5.37% (18.52 pp) |
| throughput/10000/create.sequence        |         1,772.14 (177.54) |         1,713.69 (233.08) |  -3.30% |     -2.91% (8.6 pp) |
| throughput/15000/create.sequence        |         1,469.82 (113.77) |            1,560.32 (127) |  +6.16% |    +3.83% (4.16 pp) |
| throughput/20000/create.sequence        |         1,482.84 (314.93) |          1,644.68 (40.71) | +10.91% |   +8.24% (32.54 pp) |
| throughput/25000/create.sequence        |         1,619.81 (249.91) |         1,691.54 (319.94) |  +4.43% |    -6.09% (6.15 pp) |
| throughput/100/insert.head              |            530.73 (135.5) |            559.07 (48.35) |  +5.34% |    -8.43% (9.33 pp) |
| throughput/1000/insert.head             |              526.7 (9.12) |             545.28 (37.9) |  +3.53% |    -0.41% (4.04 pp) |
| throughput/5000/insert.head             |             531.2 (56.09) |            559.09 (44.39) |  +5.25% |    +4.51% (5.86 pp) |
| throughput/10000/insert.head            |            535.12 (38.13) |            501.97 (38.71) |  -6.19% |     -6.19% (2.9 pp) |
| throughput/15000/insert.head            |            509.99 (39.22) |             493.8 (38.46) |  -3.17% |   +1.47% (11.11 pp) |
| throughput/20000/insert.head            |            521.05 (50.45) |            509.57 (57.81) |  -2.20% |    -4.45% (5.08 pp) |
| throughput/25000/insert.head            |            481.87 (73.85) |           490.99 (129.23) |  +1.89% |    +0.47% (7.28 pp) |
| throughput/100/insert.middle            |            618.55 (71.43) |            580.27 (22.18) |  -6.19% |   -9.04% (11.25 pp) |
| throughput/1000/insert.middle           |            624.53 (27.15) |             643.11 (30.5) |  +2.98% |    +4.66% (9.27 pp) |
| throughput/5000/insert.middle           |            629.99 (64.66) |            600.99 (33.27) |  -4.60% |     -1.97% (3.7 pp) |
| throughput/10000/insert.middle          |            578.71 (81.66) |            665.89 (33.76) | +15.06% |  +22.38% (25.73 pp) |
| throughput/15000/insert.middle          |            567.35 (16.87) |            585.12 (20.98) |  +3.13% |    +3.13% (4.96 pp) |
| throughput/20000/insert.middle          |            594.72 (12.82) |            600.83 (41.13) |  +1.03% |    -0.72% (8.15 pp) |
| throughput/25000/insert.middle          |             580.25 (39.6) |            641.62 (60.31) | +10.58% |   +0.54% (13.28 pp) |
| throughput/100/insert.random            |           892.45 (115.42) |            943.65 (38.84) |  +5.74% |  +11.23% (15.81 pp) |
| throughput/1000/insert.random           |            892.23 (31.29) |            979.04 (49.81) |  +9.73% |     +7.27% (9.1 pp) |
| throughput/5000/insert.random           |            992.32 (176.3) |            903.83 (37.09) |  -8.92% |  -12.80% (18.31 pp) |
| throughput/10000/insert.random          |            912.01 (24.62) |            904.35 (42.97) |  -0.84% |    -1.87% (3.12 pp) |
| throughput/15000/insert.random          |            891.62 (16.85) |            849.05 (11.55) |  -4.77% |    -4.10% (2.68 pp) |
| throughput/20000/insert.random          |            890.06 (47.11) |            865.22 (49.51) |  -2.79% |    -2.79% (10.6 pp) |
| throughput/25000/insert.random          |            904.62 (69.95) |           888.81 (105.56) |  -1.75% |    -5.03% (5.92 pp) |
| throughput/100/insert.sameIndex         |            658.65 (98.42) |            582.34 (29.73) | -11.59% |  -11.59% (15.84 pp) |
| throughput/1000/insert.sameIndex        |            569.57 (10.22) |            581.85 (13.44) |  +2.16% |    +2.18% (4.21 pp) |
| throughput/5000/insert.sameIndex        |           656.63 (106.78) |            563.74 (11.24) | -14.15% |   -6.91% (16.67 pp) |
| throughput/10000/insert.sameIndex       |            577.05 (49.03) |            578.95 (50.98) |  +0.33% |   -5.24% (10.38 pp) |
| throughput/15000/insert.sameIndex       |            533.08 (44.35) |            566.31 (73.68) |  +6.23% |   +0.06% (18.48 pp) |
| throughput/20000/insert.sameIndex       |            576.34 (49.61) |            574.66 (30.32) |  -0.29% |    -2.49% (2.44 pp) |
| throughput/25000/insert.sameIndex       |            557.05 (49.73) |             505.42 (9.16) |  -9.27% |     -9.56% (7.1 pp) |
| throughput/100/insert.tail              |            887.26 (63.19) |             834.07 (44.8) |  -5.99% |   -7.74% (12.16 pp) |
| throughput/1000/insert.tail             |           905.71 (146.25) |           862.02 (174.72) |  -4.82% |    -2.48% (5.91 pp) |
| throughput/5000/insert.tail             |           996.63 (142.26) |          1,016.97 (69.15) |  +2.04% |    -1.75% (3.26 pp) |
| throughput/10000/insert.tail            |            843.56 (26.76) |           931.44 (172.18) | +10.42% |  +12.01% (25.69 pp) |
| throughput/15000/insert.tail            |           743.09 (109.51) |            853.77 (64.31) | +14.89% |    +6.67% (8.29 pp) |
| throughput/20000/insert.tail            |            941.65 (71.25) |             858.1 (42.85) |  -8.87% |    -9.40% (6.21 pp) |
| throughput/25000/insert.tail            |           894.62 (137.39) |           850.88 (203.46) |  -4.89% |    +4.15% (9.63 pp) |
| throughput/100/length                   |            116.68 (17.43) |             122.98 (2.25) |  +5.40% |   -1.16% (15.18 pp) |
| throughput/1000/length                  |             107.59 (1.99) |             110.86 (4.41) |  +3.04% |    +3.86% (5.18 pp) |
| throughput/5000/length                  |             115.01 (8.86) |             115.61 (6.29) |  +0.52% |    -0.96% (6.43 pp) |
| throughput/10000/length                 |             111.54 (7.63) |            118.27 (12.79) |  +6.03% |   +6.32% (13.71 pp) |
| throughput/15000/length                 |            110.19 (15.33) |             113.92 (8.57) |  +3.39% |   +3.39% (10.87 pp) |
| throughput/20000/length                 |             106.97 (0.86) |              116.12 (8.7) |  +8.55% |    +7.72% (22.7 pp) |
| throughput/25000/length                 |             108.88 (8.88) |            104.21 (11.12) |  -4.29% |    -0.26% (8.12 pp) |
| throughput/100/merge.duplicate          |            812.94 (68.94) |            799.11 (51.96) |  -1.70% |   -4.42% (18.28 pp) |
| throughput/1000/merge.duplicate         |            637.59 (20.35) |            658.04 (26.81) |  +3.21% |     +6.85% (8.3 pp) |
| throughput/5000/merge.duplicate         |           620.79 (129.97) |            637.41 (21.44) |  +2.68% |   +2.38% (21.26 pp) |
| throughput/10000/merge.duplicate        |              625.9 (42.9) |             620.58 (63.3) |  -0.85% |    -2.36% (5.97 pp) |
| throughput/15000/merge.duplicate        |            654.55 (61.14) |            607.39 (17.63) |  -7.20% |    -5.27% (8.06 pp) |
| throughput/20000/merge.duplicate        |            594.82 (47.72) |            636.36 (15.02) |  +6.98% |    +0.88% (5.16 pp) |
| throughput/25000/merge.duplicate        |            634.76 (62.86) |            616.29 (31.86) |  -2.91% |   +2.47% (17.55 pp) |
| throughput/100/merge.insert             |         1,970.59 (245.65) |         1,847.49 (201.51) |  -6.25% |    -7.21% (8.41 pp) |
| throughput/1000/merge.insert            |         1,540.73 (100.32) |          1,552.75 (13.74) |  +0.78% |    +0.05% (5.95 pp) |
| throughput/5000/merge.insert            |         1,553.33 (289.23) |         1,633.87 (141.17) |  +5.18% |   -2.15% (13.68 pp) |
| throughput/10000/merge.insert           |          1,561.85 (58.12) |          1,588.91 (42.38) |  +1.73% |    +0.69% (3.31 pp) |
| throughput/15000/merge.insert           |         1,586.12 (136.06) |            1,490 (139.79) |  -6.06% |   -6.75% (19.39 pp) |
| throughput/20000/merge.insert           |         1,617.61 (797.49) |          1,517.3 (117.91) |  -6.20% |   -8.47% (42.84 pp) |
| throughput/25000/merge.insert           |           1,423.04 (22.3) |           1,397.23 (8.69) |  -1.81% |    -3.13% (4.56 pp) |
| throughput/100/remove.head              |           815.81 (172.68) |              719.56 (169) | -11.80% |    -2.03% (9.97 pp) |
| throughput/1000/remove.head             |            776.88 (18.04) |            798.21 (71.41) |  +2.75% |    +4.07% (8.97 pp) |
| throughput/5000/remove.head             |            903.87 (83.54) |            870.28 (82.35) |  -3.72% |    -4.39% (6.11 pp) |
| throughput/10000/remove.head            |           999.86 (161.05) |            882.44 (56.51) | -11.74% |   -0.57% (13.28 pp) |
| throughput/15000/remove.head            |            914.25 (70.89) |            919.13 (83.35) |  +0.53% |    -0.57% (5.19 pp) |
| throughput/20000/remove.head            |           960.88 (108.08) |            914.78 (66.96) |  -4.80% |    -7.63% (3.76 pp) |
| throughput/25000/remove.head            |          1,045.86 (89.74) |             940.6 (34.92) | -10.06% |    -7.99% (6.36 pp) |
| throughput/100/remove.middle            |           797.23 (136.37) |            738.92 (65.26) |  -7.31% |    -6.58% (4.56 pp) |
| throughput/1000/remove.middle           |            808.65 (44.39) |            810.57 (17.31) |  +0.24% |    +0.24% (8.69 pp) |
| throughput/5000/remove.middle           |            877.09 (42.23) |            815.13 (87.09) |  -7.06% |   -2.88% (10.69 pp) |
| throughput/10000/remove.middle          |            848.49 (86.62) |            876.62 (78.22) |  +3.32% |    +8.52% (1.97 pp) |
| throughput/15000/remove.middle          |             859.97 (36.5) |            859.05 (77.17) |  -0.11% |   +3.12% (13.59 pp) |
| throughput/20000/remove.middle          |            972.86 (62.22) |            926.51 (90.29) |  -4.76% |  -13.24% (11.74 pp) |
| throughput/25000/remove.middle          |           954.86 (121.11) |             923.96 (4.68) |  -3.24% |   -8.53% (11.46 pp) |
| throughput/100/remove.random            |            984.1 (145.97) |           989.83 (135.58) |  +0.58% |    -1.96% (5.65 pp) |
| throughput/1000/remove.random           |         1,275.21 (181.15) |           1,201.17 (33.6) |  -5.81% |    -4.52% (5.29 pp) |
| throughput/5000/remove.random           |         1,237.37 (283.36) |           1,223.85 (4.49) |  -1.09% |   -3.57% (17.15 pp) |
| throughput/10000/remove.random          |          1,221.41 (61.83) |           1,200.88 (36.3) |  -1.68% |    +0.72% (9.03 pp) |
| throughput/15000/remove.random          |          1,255.53 (42.07) |          1,178.21 (16.39) |  -6.16% |    -5.35% (0.61 pp) |
| throughput/20000/remove.random          |         1,366.58 (143.91) |         1,271.57 (151.19) |  -6.95% |    -7.82% (4.47 pp) |
| throughput/25000/remove.random          |         1,462.81 (211.58) |            1,220.2 (44.7) | -16.59% |  -12.07% (15.45 pp) |
| throughput/100/remove.sameIndex         |          1,044.49 (99.03) |         1,034.34 (139.91) |  -0.97% |    -2.40% (3.71 pp) |
| throughput/1000/remove.sameIndex        |            829.92 (56.86) |            824.92 (25.22) |  -0.60% |    -1.63% (3.83 pp) |
| throughput/5000/remove.sameIndex        |           858.01 (102.49) |            838.57 (43.04) |  -2.27% |    +1.59% (8.95 pp) |
| throughput/10000/remove.sameIndex       |             859.19 (35.3) |             891.97 (39.9) |  +3.82% |     +3.11% (3.3 pp) |
| throughput/15000/remove.sameIndex       |             938.01 (7.01) |            835.75 (92.54) | -10.90% |   -3.89% (10.11 pp) |
| throughput/20000/remove.sameIndex       |           1,040.36 (87.5) |           923.93 (121.12) | -11.19% |   -4.67% (16.08 pp) |
| throughput/25000/remove.sameIndex       |         1,013.12 (113.15) |           931.89 (150.36) |  -8.02% |   +0.95% (12.79 pp) |
| throughput/100/remove.tail              |             813.4 (81.48) |            715.37 (89.81) | -12.05% |   -12.05% (8.53 pp) |
| throughput/1000/remove.tail             |             706.8 (69.74) |             719.43 (12.3) |  +1.79% |    -0.84% (8.02 pp) |
| throughput/5000/remove.tail             |            802.66 (82.79) |            769.84 (25.25) |  -4.09% |   -1.87% (14.11 pp) |
| throughput/10000/remove.tail            |            778.81 (31.16) |            793.96 (46.39) |  +1.95% |    +1.95% (6.66 pp) |
| throughput/15000/remove.tail            |            768.95 (40.37) |           809.97 (114.72) |  +5.33% |   +9.97% (16.14 pp) |
| throughput/20000/remove.tail            |         1,071.35 (267.01) |            870.86 (30.12) | -18.71% |  -20.29% (40.52 pp) |
| throughput/25000/remove.tail            |            826.25 (26.31) |            827.56 (46.88) |  +0.16% |    +2.68% (3.91 pp) |
| throughput/100/replace.head             |            1,139.18 (168) |             1,017.79 (71) | -10.66% |    -7.74% (8.52 pp) |
| throughput/1000/replace.head            |          1,205.63 (11.89) |          1,185.95 (46.86) |  -1.63% |    +0.48% (4.86 pp) |
| throughput/5000/replace.head            |          1,188.55 (76.83) |          1,159.62 (41.39) |  -2.43% |    -6.14% (7.06 pp) |
| throughput/10000/replace.head           |          1,189.24 (30.52) |         1,248.58 (103.09) |  +4.99% |    +2.03% (3.01 pp) |
| throughput/15000/replace.head           |          1,167.15 (16.36) |          1,155.53 (16.48) |  -1.00% |    -1.11% (2.69 pp) |
| throughput/20000/replace.head           |         1,271.12 (179.92) |         1,474.58 (530.42) | +16.01% |    +9.77% (36.6 pp) |
| throughput/25000/replace.head           |         1,227.58 (116.47) |          1,179.52 (45.35) |  -3.92% |    -4.50% (8.71 pp) |
| throughput/100/replace.middle           |          1,201.76 (87.58) |          1,058.05 (12.78) | -11.96% |   -6.39% (12.17 pp) |
| throughput/1000/replace.middle          |         1,267.56 (103.36) |          1,219.19 (17.32) |  -3.82% |    -4.41% (9.24 pp) |
| throughput/5000/replace.middle          |           1,196.07 (33.1) |          1,241.73 (99.11) |  +3.82% |     +3.23% (1.5 pp) |
| throughput/10000/replace.middle         |          1,201.04 (37.52) |          1,236.13 (78.01) |  +2.92% |   +3.36% (14.13 pp) |
| throughput/15000/replace.middle         |         1,169.48 (176.99) |          1,218.89 (93.51) |  +4.22% |    +4.29% (7.78 pp) |
| throughput/20000/replace.middle         |          1,343.42 (80.78) |          1,313.8 (280.13) |  -2.20% |   -2.77% (22.64 pp) |
| throughput/25000/replace.middle         |          1,292.5 (184.67) |          1,257.13 (80.33) |  -2.74% |    -1.07% (7.75 pp) |
| throughput/100/replace.random           |         1,835.91 (329.01) |          1,643.77 (50.81) | -10.47% |   -8.90% (18.04 pp) |
| throughput/1000/replace.random          |           1,858.5 (59.05) |          1,823.68 (83.64) |  -1.87% |    -1.01% (7.43 pp) |
| throughput/5000/replace.random          |             1,792 (33.61) |          1,767.61 (30.59) |  -1.36% |    -0.24% (2.51 pp) |
| throughput/10000/replace.random         |          1,802.73 (94.83) |         1,826.47 (116.32) |  +1.32% |    -2.04% (8.45 pp) |
| throughput/15000/replace.random         |         1,670.86 (237.77) |          1,838.92 (32.19) | +10.06% |   +5.57% (12.73 pp) |
| throughput/20000/replace.random         |         1,785.24 (182.17) |           1,731.81 (94.5) |  -2.99% |    -2.99% (6.61 pp) |
| throughput/25000/replace.random         |         1,812.05 (284.92) |          1,821.32 (38.19) |  +0.51% |   -1.15% (10.74 pp) |
| throughput/100/replace.sameIndex        |         1,061.47 (115.79) |          1,062.59 (50.16) |  +0.11% |   +1.23% (11.01 pp) |
| throughput/1000/replace.sameIndex       |          1,217.57 (67.97) |          1,152.26 (16.28) |  -5.36% |    -5.36% (3.98 pp) |
| throughput/5000/replace.sameIndex       |          1,123.66 (66.11) |           1,183.44 (7.98) |  +5.32% |    +5.66% (9.73 pp) |
| throughput/10000/replace.sameIndex      |          1,179.07 (33.45) |           1,220.06 (58.9) |  +3.48% |    +3.48% (5.22 pp) |
| throughput/15000/replace.sameIndex      |         1,164.22 (167.61) |           1,131.5 (16.81) |  -2.81% |   -1.75% (13.79 pp) |
| throughput/20000/replace.sameIndex      |          1,229.52 (56.59) |         1,305.43 (138.51) |  +6.17% |   +5.21% (13.29 pp) |
| throughput/25000/replace.sameIndex      |          1,169.71 (18.35) |          1,192.89 (97.41) |  +1.98% |    +3.91% (6.86 pp) |
| throughput/100/replace.tail             |          1,075.91 (196.9) |           1,045.1 (60.77) |  -2.86% |     -3.19% (5.9 pp) |
| throughput/1000/replace.tail            |          1,264.52 (48.72) |           1,186.6 (18.24) |  -6.16% |    -6.84% (6.48 pp) |
| throughput/5000/replace.tail            |          1,154.06 (25.44) |           1,189.6 (87.99) |  +3.08% |    +1.87% (7.14 pp) |
| throughput/10000/replace.tail           |          1,208.21 (57.41) |          1,204.08 (77.32) |  -0.34% |    -6.35% (5.41 pp) |
| throughput/15000/replace.tail           |          1,233.34 (36.61) |           1,144.98 (6.35) |  -7.16% |     -4.83% (3.9 pp) |
| throughput/20000/replace.tail           |          1,328.75 (19.28) |         1,249.37 (110.59) |  -5.97% |    -5.97% (8.25 pp) |
| throughput/25000/replace.tail           |             1,268.6 (6.3) |          1,187.85 (102.1) |  -6.37% |    +0.62% (7.93 pp) |
| throughput/100/retire                   |            193.38 (20.79) |           181.73 (102.89) |  -6.02% |  +12.61% (55.61 pp) |
| throughput/1000/retire                  |             219.75 (9.58) |             216.07 (2.84) |  -1.67% |    -2.15% (6.64 pp) |
| throughput/5000/retire                  |             203.52 (7.33) |            217.39 (14.29) |  +6.82% |   +7.25% (10.91 pp) |
| throughput/10000/retire                 |              198.19 (4.5) |             198.81 (2.23) |  +0.31% |    -0.43% (2.88 pp) |
| throughput/15000/retire                 |             205.02 (28.6) |             193.55 (1.26) |  -5.59% |   -7.38% (14.28 pp) |
| throughput/20000/retire                 |              196.2 (4.88) |            201.74 (11.36) |  +2.82% |   +1.85% (14.49 pp) |
| throughput/25000/retire                 |             194.39 (4.44) |              189.98 (1.4) |  -2.27% |    -0.96% (7.76 pp) |
| throughput/100/sequence                 |             274.4 (82.13) |            293.04 (30.42) |  +6.79% |    +6.79% (5.55 pp) |
| throughput/1000/sequence                |             322.8 (28.49) |             303.89 (6.76) |  -5.86% |    -4.65% (6.65 pp) |
| throughput/5000/sequence                |             274.11 (5.57) |            294.53 (10.62) |  +7.45% |    +8.26% (6.88 pp) |
| throughput/10000/sequence               |             272.5 (23.53) |            268.13 (14.85) |  -1.60% |   +2.12% (11.04 pp) |
| throughput/15000/sequence               |             260.35 (3.88) |            267.74 (19.26) |  +2.84% |   +2.90% (10.79 pp) |
| throughput/20000/sequence               |            267.79 (15.06) |             246.38 (5.19) |  -8.00% |    -4.10% (6.05 pp) |
| throughput/25000/sequence               |             258.31 (2.91) |            256.89 (24.47) |  -0.55% |   -1.46% (12.18 pp) |
| throughput/100/value.head               |             185.97 (33.2) |             174.44 (16.1) |  -6.20% |    -4.57% (19.7 pp) |
| throughput/1000/value.head              |             164.01 (8.35) |             163.05 (3.57) |  -0.59% |    -1.20% (5.48 pp) |
| throughput/5000/value.head              |              142.88 (4.4) |            148.73 (15.63) |  +4.09% |   +4.00% (11.06 pp) |
| throughput/10000/value.head             |             138.58 (3.11) |             140.29 (1.65) |  +1.23% |    +0.69% (1.59 pp) |
| throughput/15000/value.head             |            141.69 (11.11) |              137.96 (5.2) |  -2.63% |    +1.28% (6.03 pp) |
| throughput/20000/value.head             |             135.85 (3.97) |             137.27 (9.34) |  +1.05% |    -0.19% (9.86 pp) |
| throughput/25000/value.head             |             132.94 (7.05) |             128.54 (3.46) |  -3.31% |    -3.31% (9.11 pp) |
| throughput/100/value.middle             |             224.8 (52.42) |              243.07 (8.7) |  +8.13% |     +8.86% (8.9 pp) |
| throughput/1000/value.middle            |            258.98 (11.07) |             249.69 (11.1) |  -3.59% |    -5.11% (9.63 pp) |
| throughput/5000/value.middle            |             225.19 (9.07) |            237.75 (13.86) |  +5.58% |    +5.19% (8.84 pp) |
| throughput/10000/value.middle           |             219.78 (8.73) |             226.06 (1.68) |  +2.86% |     +4.74% (9.3 pp) |
| throughput/15000/value.middle           |            235.16 (31.55) |            226.92 (22.36) |  -3.50% |    +1.24% (9.75 pp) |
| throughput/20000/value.middle           |              214.2 (13.1) |             209.74 (8.89) |  -2.08% |   +3.56% (10.89 pp) |
| throughput/25000/value.middle           |            218.22 (12.93) |            211.61 (18.91) |  -3.03% |    -2.10% (9.61 pp) |
| throughput/100/value.random             |            190.05 (53.66) |            217.26 (16.06) | +14.32% |  +22.93% (27.51 pp) |
| throughput/1000/value.random            |            223.05 (10.84) |             224.32 (3.21) |  +0.57% |    -3.94% (6.69 pp) |
| throughput/5000/value.random            |            273.87 (23.54) |             265.93 (20.5) |  -2.90% |     +0.61% (7.7 pp) |
| throughput/10000/value.random           |              277.7 (6.09) |            275.19 (33.66) |  -0.90% |   +3.84% (15.45 pp) |
| throughput/15000/value.random           |             281.3 (19.01) |             281.6 (42.12) |  +0.11% |   +5.03% (12.82 pp) |
| throughput/20000/value.random           |            282.14 (23.26) |             286.2 (11.38) |  +1.44% |    -1.74% (3.61 pp) |
| throughput/25000/value.random           |             267.24 (8.98) |              262.39 (2.5) |  -1.81% |    -4.12% (2.95 pp) |
| throughput/100/value.sameIndex          |            172.55 (36.37) |            195.25 (58.02) | +13.16% |  +16.80% (40.02 pp) |
| throughput/1000/value.sameIndex         |             184.34 (7.55) |             183.13 (4.09) |  -0.66% |   +1.25% (24.45 pp) |
| throughput/5000/value.sameIndex         |            184.74 (13.04) |             170.31 (5.86) |  -7.81% |    -1.83% (8.11 pp) |
| throughput/10000/value.sameIndex        |            163.62 (12.89) |             174.53 (9.59) |  +6.67% |    +9.24% (2.37 pp) |
| throughput/15000/value.sameIndex        |             161.49 (0.87) |            226.89 (51.16) | +40.50% |  +42.38% (43.79 pp) |
| throughput/20000/value.sameIndex        |            172.73 (10.25) |            165.57 (61.65) |  -4.15% |    -0.98% (6.32 pp) |
| throughput/25000/value.sameIndex        |             159.19 (7.59) |             161.09 (30.1) |  +1.19% |   +2.89% (19.17 pp) |
| throughput/100/value.tail               |            250.07 (34.15) |            297.82 (54.19) | +19.09% |  +29.71% (16.87 pp) |
| throughput/1000/value.tail              |            221.05 (11.71) |            225.76 (14.17) |  +2.13% |    -2.55% (5.14 pp) |
| throughput/5000/value.tail              |             195.35 (7.09) |               196 (10.95) |  +0.33% |    -0.11% (0.49 pp) |
| throughput/10000/value.tail             |             189.89 (8.67) |              197.68 (4.5) |  +4.10% |    +2.68% (4.59 pp) |
| throughput/15000/value.tail             |              186.21 (7.8) |            190.42 (15.24) |  +2.26% |     -0.04% (3.8 pp) |
| throughput/20000/value.tail             |             178.68 (5.72) |             185.45 (7.87) |  +3.79% |    +0.75% (4.57 pp) |
| throughput/25000/value.tail             |           258.61 (218.77) |            185.42 (39.91) | -28.30% |  -14.22% (15.33 pp) |
| throughput/100/values                   |         4,627.77 (140.67) |             5,264 (578.7) | +13.75% |   +13.84% (5.95 pp) |
| throughput/1000/values                  |     159,754.69 (3,955.31) |     159,085.94 (5,412.81) |  -0.42% |    -1.59% (1.05 pp) |
| throughput/5000/values                  |    531,320.31 (26,205.34) |    530,732.81 (29,359.77) |  -0.11% |    -0.55% (6.56 pp) |
| throughput/10000/values                 |  1,205,989.84 (31,194.53) | 1,135,696.88 (130,670.31) |  -5.83% |   -0.02% (17.62 pp) |
| throughput/15000/values                 |  1,758,120.31 (39,823.44) |     1,853,325 (80,751.56) |  +5.42% |    +5.42% (0.73 pp) |
| throughput/20000/values                 |  2,723,504.69 (70,465.63) | 2,431,329.69 (260,115.63) | -10.73% |   -2.62% (12.55 pp) |
| throughput/25000/values                 | 3,280,270.31 (390,310.94) | 3,324,268.75 (298,195.31) |  +1.34% |   -8.37% (12.86 pp) |
| throughput/100/values.head              |            331.36 (44.44) |             343.7 (28.79) |  +3.72% |     +4.10% (5.9 pp) |
| throughput/1000/values.head             |            266.85 (29.05) |            277.89 (27.28) |  +4.14% |   -0.85% (11.31 pp) |
| throughput/5000/values.head             |            292.49 (27.61) |            275.67 (18.16) |  -5.75% |    -2.27% (0.52 pp) |
| throughput/10000/values.head            |            268.16 (17.01) |            270.82 (59.99) |  +0.99% |   -2.00% (31.22 pp) |
| throughput/15000/values.head            |            267.61 (29.61) |           292.69 (176.52) |  +9.37% |    +0.46% (7.43 pp) |
| throughput/20000/values.head            |             277.96 (5.54) |            268.73 (27.02) |  -3.32% |    -3.38% (7.96 pp) |
| throughput/25000/values.head            |            264.12 (43.85) |             286.03 (5.07) |  +8.30% |   -3.21% (17.34 pp) |
| throughput/100/values.middle            |             313.49 (21.2) |            312.89 (34.26) |  -0.19% |    +2.35% (4.77 pp) |
| throughput/1000/values.middle           |            276.76 (45.64) |            267.91 (25.08) |  -3.20% |    -5.07% (29.9 pp) |
| throughput/5000/values.middle           |             282.91 (29.4) |            262.97 (24.01) |  -7.05% |    -2.29% (5.45 pp) |
| throughput/10000/values.middle          |            270.78 (22.24) |            255.26 (18.02) |  -5.73% |    -5.84% (15.6 pp) |
| throughput/15000/values.middle          |             238.85 (8.36) |            252.53 (17.85) |  +5.73% |    +6.72% (2.19 pp) |
| throughput/20000/values.middle          |               268.27 (11) |               273.76 (27) |  +2.05% |    +2.94% (9.86 pp) |
| throughput/25000/values.middle          |            253.36 (29.72) |            264.02 (23.18) |  +4.21% |    +7.27% (6.15 pp) |
| throughput/100/values.random            |            305.31 (37.41) |             321.92 (19.6) |  +5.44% |   +5.44% (20.12 pp) |
| throughput/1000/values.random           |              299.1 (6.83) |             304.1 (11.09) |  +1.67% |    +1.88% (1.57 pp) |
| throughput/5000/values.random           |             323.1 (54.98) |            326.03 (65.78) |  +0.91% |   -3.66% (36.28 pp) |
| throughput/10000/values.random          |            358.83 (14.38) |            389.02 (44.08) |  +8.41% |   +3.18% (11.83 pp) |
| throughput/15000/values.random          |            374.61 (67.92) |             367.4 (28.45) |  -1.92% |   -5.84% (19.98 pp) |
| throughput/20000/values.random          |            412.39 (35.07) |            426.58 (34.57) |  +3.44% |    -2.60% (8.41 pp) |
| throughput/25000/values.random          |            397.12 (36.82) |           376.53 (108.91) |  -5.18% |    -1.14% (17.2 pp) |
| throughput/100/values.sameIndex         |            295.27 (35.23) |            314.09 (12.41) |  +6.37% |   +1.40% (20.18 pp) |
| throughput/1000/values.sameIndex        |             263.8 (11.71) |            271.03 (10.84) |  +2.74% |    +3.22% (8.01 pp) |
| throughput/5000/values.sameIndex        |             276.65 (32.7) |            271.87 (22.44) |  -1.73% |   +2.67% (24.03 pp) |
| throughput/10000/values.sameIndex       |            293.83 (25.83) |            253.45 (11.32) | -13.74% |    -8.50% (4.71 pp) |
| throughput/15000/values.sameIndex       |            245.76 (15.55) |            244.04 (29.18) |  -0.70% |   -7.51% (20.67 pp) |
| throughput/20000/values.sameIndex       |             288.79 (6.71) |             263.86 (29.2) |  -8.63% |    -9.10% (1.72 pp) |
| throughput/25000/values.sameIndex       |            259.44 (19.51) |            271.13 (23.54) |  +4.51% |    +4.51% (6.28 pp) |
| throughput/100/values.tail              |            289.91 (33.76) |            312.29 (51.08) |  +7.72% |   +8.64% (24.72 pp) |
| throughput/1000/values.tail             |            277.82 (12.78) |             262.58 (5.27) |  -5.49% |    -6.75% (1.93 pp) |
| throughput/5000/values.tail             |            289.37 (42.45) |              255.06 (2.7) | -11.86% |   -11.09% (11.8 pp) |
| throughput/10000/values.tail            |            309.64 (82.71) |             254.47 (20.9) | -17.82% |   +0.14% (24.65 pp) |
| throughput/15000/values.tail            |            302.99 (32.63) |            238.52 (47.98) | -21.28% |  -12.40% (24.46 pp) |
| throughput/20000/values.tail            |            247.39 (53.03) |             234.24 (8.26) |  -5.32% |   -5.88% (20.27 pp) |
| throughput/25000/values.tail            |             236.11 (8.28) |            233.15 (32.42) |  -1.25% |   +1.36% (15.45 pp) |
| lifecycle/scaleUp/apply.random          |         4,293.97 (567.36) |         4,097.07 (206.02) |  -4.59% |   -1.85% (21.21 pp) |
| lifecycle/scaleUp/insert.head           |            952.3 (114.79) |             829.3 (30.74) | -12.92% |  -12.77% (10.44 pp) |
| lifecycle/scaleUp/insert.random         |          2,059.2 (490.52) |         1,905.18 (138.92) |  -7.48% |  -14.84% (25.25 pp) |
| lifecycle/scaleUp/insert.tail           |           817.41 (150.64) |            770.27 (96.65) |  -5.77% |   -2.01% (18.71 pp) |
| lifecycle/scaleUp/remove.random         |         2,950.79 (589.33) |         2,871.65 (318.11) |  -2.68% |   +0.43% (18.45 pp) |
| lifecycle/scaleUp/replace.head          |          2,500.97 (433.1) |         2,643.41 (284.96) |  +5.70% |    +4.91% (13.8 pp) |
| lifecycle/scaleUp/replace.random        |         3,926.42 (474.85) |         3,541.44 (219.63) |  -9.80% |   -9.80% (22.22 pp) |
| lifecycle/scaleUp/replace.tail          |         2,339.23 (327.36) |         2,343.63 (238.24) |  +0.19% |    -3.31% (6.08 pp) |
| lifecycle/scaleUp/value.head            |               352 (22.64) |             315.06 (16.2) | -10.49% |   -6.36% (16.62 pp) |
| lifecycle/scaleUp/value.random          |         1,140.04 (226.37) |           1,144.68 (18.5) |  +0.41% |   -0.94% (18.59 pp) |
| lifecycle/scaleUp/value.tail            |            158.59 (19.74) |             158.16 (2.32) |  -0.27% |    -0.18% (8.81 pp) |
| lifecycle/scaleDown/apply.random        |          3,466.13 (81.61) |         3,460.88 (115.47) |  -0.15% |    -1.89% (5.54 pp) |
| lifecycle/scaleDown/insert.random       |          1,703.86 (87.85) |          1,692.54 (39.73) |  -0.66% |    -1.30% (4.74 pp) |
| lifecycle/scaleDown/remove.head         |          1,941.93 (33.78) |          1,906.02 (57.38) |  -1.85% |    -1.43% (3.23 pp) |
| lifecycle/scaleDown/remove.random       |          2,721.5 (205.19) |          2,671.24 (94.13) |  -1.85% |    -0.70% (6.57 pp) |
| lifecycle/scaleDown/remove.tail         |          1,739.55 (65.55) |          1,713.87 (61.99) |  -1.48% |    -2.00% (1.09 pp) |
| lifecycle/scaleDown/replace.head        |           2,674.6 (116.2) |          2,528.56 (79.22) |  -5.46% |    -3.61% (4.65 pp) |
| lifecycle/scaleDown/replace.random      |         3,381.11 (325.53) |         3,601.98 (237.37) |  +6.53% |   +0.59% (18.25 pp) |
| lifecycle/scaleDown/replace.tail        |      19,875.99 (2,849.85) |        19,130.95 (690.42) |  -3.75% |   +0.97% (11.87 pp) |
| lifecycle/scaleDown/value.head          |             414.54 (9.04) |             417.04 (8.03) |  +0.60% |    +0.06% (1.39 pp) |
| lifecycle/scaleDown/value.random        |          1,084.21 (37.15) |          1,076.69 (28.34) |  -0.69% |     +0.09% (6.4 pp) |
| lifecycle/scaleDown/value.tail          |             232.56 (6.66) |             232.92 (9.03) |  +0.15% |    +0.91% (3.04 pp) |
| lifecycle/fullLifecycle/apply.random    |          3,930.4 (184.17) |          3,775.34 (29.01) |  -3.94% |   -3.85% (10.38 pp) |
| lifecycle/fullLifecycle/insert.head     |            952.3 (114.79) |             829.3 (30.74) | -12.92% |  -12.77% (10.44 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,874.83 (180.98) |          1,798.86 (85.34) |  -4.05% |   -6.62% (10.65 pp) |
| lifecycle/fullLifecycle/insert.tail     |           817.41 (150.64) |            770.27 (96.65) |  -5.77% |   -2.01% (18.71 pp) |
| lifecycle/fullLifecycle/remove.head     |          1,941.93 (33.78) |          1,906.02 (57.38) |  -1.85% |    -1.43% (3.23 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,764.37 (345.84) |         2,811.83 (231.85) |  +1.72% |    -1.54% (8.95 pp) |
| lifecycle/fullLifecycle/remove.tail     |          1,739.55 (65.55) |          1,713.87 (61.99) |  -1.48% |    -2.00% (1.09 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,689.05 (149.61) |         2,667.78 (140.39) |  -0.79% |    +2.74% (4.16 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,714.33 (191.91) |          3,642.93 (99.91) |  -1.92% |    -2.98% (4.43 pp) |
| lifecycle/fullLifecycle/replace.tail    |      11,448.03 (1,438.24) |         10,825.96 (368.5) |  -5.43% |    -0.59% (9.55 pp) |
| lifecycle/fullLifecycle/value.head      |            386.93 (10.78) |             366.29 (7.31) |  -5.34% |    -2.90% (5.83 pp) |
| lifecycle/fullLifecycle/value.random    |         1,164.91 (102.74) |          1,104.11 (18.52) |  -5.22% |    -0.53% (6.95 pp) |
| lifecycle/fullLifecycle/value.tail      |             198.79 (9.11) |             194.45 (5.96) |  -2.18% |    -1.11% (2.55 pp) |
| checkpoint/up/1000/create               |         484,100 (103,900) |          435,300 (85,000) | -10.08% |   -4.73% (13.72 pp) |
| checkpoint/up/1000/sequence             |       2,900,400 (160,700) |       2,662,000 (250,300) |  -8.22% |    -5.81% (8.98 pp) |
| checkpoint/up/1000/values               |       1,954,400 (255,100) |       1,754,100 (350,800) | -10.25% |   -4.14% (28.37 pp) |
| checkpoint/up/5000/create               |       1,472,000 (660,100) |          908,000 (11,800) | -38.32% |   -38.32% (41.2 pp) |
| checkpoint/up/5000/sequence             |    10,103,700 (4,748,100) |       7,780,300 (103,700) | -23.00% |  -25.02% (35.22 pp) |
| checkpoint/up/5000/values               |       5,320,200 (334,100) |       5,179,000 (306,300) |  -2.65% |   -0.71% (12.67 pp) |
| checkpoint/up/10000/create              |       1,673,800 (100,000) |        1,573,400 (48,300) |  -6.00% |    -3.72% (5.02 pp) |
| checkpoint/up/10000/sequence            |    15,682,100 (1,381,700) |      13,071,300 (227,200) | -16.65% |   -15.67% (11.1 pp) |
| checkpoint/up/10000/values              |    23,319,000 (4,527,500) |      20,227,300 (703,200) | -13.26% |  -15.66% (18.76 pp) |
| checkpoint/up/15000/create              |       2,592,300 (159,100) |        2,389,200 (72,700) |  -7.83% |   -10.62% (10.5 pp) |
| checkpoint/up/15000/sequence            |    16,012,500 (1,116,400) |    14,324,000 (1,374,000) | -10.54% |   -3.41% (12.35 pp) |
| checkpoint/up/15000/values              |      30,159,600 (921,600) |      29,871,700 (295,400) |  -0.95% |    -2.42% (3.14 pp) |
| checkpoint/up/20000/create              |       3,375,600 (278,300) |        3,385,900 (35,100) |  +0.31% |    -0.30% (8.97 pp) |
| checkpoint/up/20000/sequence            |      21,331,000 (459,900) |    21,570,200 (3,285,100) |  +1.12% |   +1.93% (11.16 pp) |
| checkpoint/up/20000/values              |    11,412,300 (1,386,500) |      11,126,900 (412,800) |  -2.50% |   +0.56% (13.49 pp) |
| checkpoint/up/25000/create              |       4,003,500 (198,600) |        4,100,800 (89,000) |  +2.43% |    +3.51% (6.05 pp) |
| checkpoint/up/25000/sequence            |    23,872,600 (1,530,300) |    24,547,000 (1,279,100) |  +2.82% |    +0.30% (7.97 pp) |
| checkpoint/up/25000/values              |      12,150,700 (710,800) |      12,568,100 (969,200) |  +3.44% |   +0.51% (12.97 pp) |
| checkpoint/down/20000/create            |       3,419,500 (165,200) |       3,437,700 (103,100) |  +0.53% |     +0.95% (1.7 pp) |
| checkpoint/down/20000/sequence          |      19,481,600 (571,400) |    19,199,200 (1,612,800) |  -1.45% |   -1.45% (11.31 pp) |
| checkpoint/down/20000/values            |        9,233,200 (88,100) |       9,229,100 (657,400) |  -0.04% |    -5.95% (10.6 pp) |
| checkpoint/down/15000/create            |        2,435,700 (17,200) |       2,475,400 (135,900) |  +1.63% |    +2.22% (6.75 pp) |
| checkpoint/down/15000/sequence          |      15,540,700 (484,900) |       15,608,500 (84,100) |  +0.44% |    -1.32% (3.44 pp) |
| checkpoint/down/15000/values            |        6,938,800 (67,400) |       7,088,500 (349,000) |  +2.16% |   +3.08% (12.24 pp) |
| checkpoint/down/10000/create            |       1,775,400 (123,400) |        1,679,500 (43,900) |  -5.40% |    -6.38% (7.64 pp) |
| checkpoint/down/10000/sequence          |    13,231,700 (1,529,400) |      12,974,200 (355,500) |  -1.95% |    +0.14% (2.71 pp) |
| checkpoint/down/10000/values            |       5,805,600 (983,700) |       5,311,400 (576,400) |  -8.51% |    -8.52% (4.34 pp) |
| checkpoint/down/5000/create             |         829,100 (136,500) |          805,400 (23,700) |  -2.86% |    -5.34% (9.52 pp) |
| checkpoint/down/5000/sequence           |       9,616,800 (765,700) |    11,000,900 (1,669,500) | +14.39% |   +5.09% (16.82 pp) |
| checkpoint/down/5000/values             |       2,540,500 (362,100) |       2,906,300 (356,400) | +14.40% |    +0.84% (7.36 pp) |
| checkpoint/down/1000/create             |          153,600 (90,600) |           164,200 (4,400) |  +6.90% |   +2.93% (10.82 pp) |
| checkpoint/down/1000/sequence           |       6,854,900 (947,100) |     6,685,900 (2,529,300) |  -2.47% |   -10.03% (53.5 pp) |
| checkpoint/down/1000/values             |          558,900 (68,600) |          514,300 (27,100) |  -7.98% |   +3.95% (18.59 pp) |
| checkpoint/down/0/create                |              15,600 (900) |            14,900 (2,400) |  -4.49% |   -8.61% (13.43 pp) |
| checkpoint/down/0/sequence              |       1,336,600 (322,000) |       1,354,500 (189,100) |  +1.34% |   +1.34% (16.83 pp) |
| checkpoint/down/0/values                |              11,500 (100) |              10,200 (800) | -11.30% |   -3.51% (10.33 pp) |
| tuple/projection/2/create.empty         |            352.13 (43.91) |            350.08 (16.52) |  -0.58% |   -4.20% (12.37 pp) |
| tuple/tuple/2/create.empty              |            437.44 (18.45) |            426.84 (23.26) |  -2.42% |    -1.11% (4.26 pp) |
| tuple/projection/2/create.sequence      |          1,216.38 (34.26) |           1,224.8 (92.37) |  +0.69% |    -1.27% (8.17 pp) |
| tuple/tuple/2/create.sequence           |          1,378.68 (88.87) |          1,423.69 (84.43) |  +3.26% |    +1.48% (13.8 pp) |
| tuple/projection/2/replace.random       |          1,064.26 (84.91) |          1,072.32 (21.13) |  +0.76% |    -2.98% (9.34 pp) |
| tuple/tuple/2/replace.random            |             687.57 (5.23) |            725.28 (14.76) |  +5.48% |    +5.16% (1.88 pp) |
| tuple/projection/2/apply.replace        |         1,807.55 (208.61) |          1,784.05 (15.27) |  -1.30% |    -0.51% (8.85 pp) |
| tuple/tuple/2/apply.replace             |          1,177.11 (56.45) |         1,211.72 (143.11) |  +2.94% |    -0.88% (5.54 pp) |
| tuple/projection/2/apply.duplicate      |            616.09 (13.57) |             634.6 (60.65) |  +3.00% |   +2.95% (14.54 pp) |
| tuple/tuple/2/apply.duplicate           |            629.68 (36.86) |            637.52 (26.54) |  +1.25% |    -1.66% (2.52 pp) |
| tuple/projection/2/merge.duplicate      |            683.32 (41.81) |            652.39 (35.88) |  -4.53% |    -5.22% (3.26 pp) |
| tuple/tuple/2/merge.duplicate           |             693.9 (65.96) |            628.29 (21.68) |  -9.46% |    -6.52% (5.18 pp) |
| tuple/projection/2/length               |                 7.6 (0.1) |               7.59 (0.06) |  -0.11% |    -0.11% (1.66 pp) |
| tuple/tuple/2/length                    |               7.37 (0.07) |               7.83 (0.32) |  +6.21% |    +6.21% (2.98 pp) |
| tuple/projection/2/value.random         |              29.62 (1.05) |              29.86 (1.15) |  +0.83% |    +3.99% (8.84 pp) |
| tuple/tuple/2/value.random              |              18.38 (0.39) |              19.38 (1.22) |  +5.48% |     +5.48% (8.7 pp) |
| tuple/projection/2/values               |              78.26 (2.21) |              83.65 (3.57) |  +6.88% |    +5.33% (2.67 pp) |
| tuple/tuple/2/values                    |              78.95 (0.93) |              81.13 (2.41) |  +2.76% |    +1.77% (1.35 pp) |
| tuple/projection/2/sequence             |              440.19 (8.8) |             456.11 (4.32) |  +3.62% |    +3.63% (3.33 pp) |
| tuple/tuple/2/sequence                  |                481 (6.54) |            489.39 (31.34) |  +1.74% |     -2.40% (8.4 pp) |
| tuple/projection/4/create.empty         |            417.88 (23.65) |             410.42 (4.32) |  -1.79% |       -2.31% (5 pp) |
| tuple/tuple/4/create.empty              |             433.77 (3.31) |            431.56 (36.34) |  -0.51% |    -1.15% (9.96 pp) |
| tuple/projection/4/create.sequence      |          1,644.3 (117.02) |          1,628.48 (83.47) |  -0.96% |    +0.40% (0.43 pp) |
| tuple/tuple/4/create.sequence           |          1,553.07 (39.05) |          1,588.29 (14.57) |  +2.27% |    +2.27% (0.47 pp) |
| tuple/projection/4/replace.random       |          1,170.28 (39.46) |          1,132.74 (17.96) |  -3.21% |    -2.61% (3.45 pp) |
| tuple/tuple/4/replace.random            |             651.8 (10.97) |             658.31 (53.7) |  +1.00% |   +3.69% (11.84 pp) |
| tuple/projection/4/apply.replace        |         1,730.15 (124.89) |          1,767.15 (88.67) |  +2.14% |   -3.14% (11.85 pp) |
| tuple/tuple/4/apply.replace             |          1,137.31 (62.54) |          1,101.46 (20.17) |  -3.15% |     +1.38% (6.7 pp) |
| tuple/projection/4/apply.duplicate      |             582.15 (15.6) |            596.16 (20.47) |  +2.41% |    +1.64% (6.24 pp) |
| tuple/tuple/4/apply.duplicate           |            613.44 (24.14) |            616.33 (11.18) |  +0.47% |    +0.68% (8.72 pp) |
| tuple/projection/4/merge.duplicate      |               777 (29.46) |            745.09 (14.45) |  -4.11% |    -3.65% (6.03 pp) |
| tuple/tuple/4/merge.duplicate           |            839.85 (40.92) |            788.04 (20.58) |  -6.17% |    -8.55% (6.46 pp) |
| tuple/projection/4/length               |              27.51 (2.77) |              27.96 (1.06) |  +1.66% |    -3.80% (2.67 pp) |
| tuple/tuple/4/length                    |               26.6 (2.19) |              27.55 (3.07) |  +3.60% |   -1.60% (14.89 pp) |
| tuple/projection/4/value.random         |             40.72 (11.75) |              40.91 (0.63) |  +0.48% |   +0.36% (18.12 pp) |
| tuple/tuple/4/value.random              |              18.46 (4.86) |              17.57 (0.35) |  -4.78% |   -5.84% (19.24 pp) |
| tuple/projection/4/values               |            154.08 (48.34) |             149.73 (3.72) |  -2.82% |   -6.01% (21.12 pp) |
| tuple/tuple/4/values                    |             162.4 (10.07) |            159.75 (19.34) |  -1.63% |   +6.99% (15.87 pp) |
| tuple/projection/4/sequence             |            465.07 (77.64) |             483.99 (21.6) |  +4.07% |   +3.57% (10.14 pp) |
| tuple/tuple/4/sequence                  |            556.38 (70.28) |             566.48 (4.84) |  +1.82% |    +1.98% (3.98 pp) |
| tuple/projection/8/create.empty         |           436.47 (125.58) |             437.64 (7.53) |  +0.27% |   -8.84% (26.76 pp) |
| tuple/tuple/8/create.empty              |            447.64 (83.08) |            454.71 (19.89) |  +1.58% |    -0.25% (13.5 pp) |
| tuple/projection/8/create.sequence      |         2,268.99 (162.79) |         2,345.66 (505.07) |  +3.38% |   -3.35% (32.47 pp) |
| tuple/tuple/8/create.sequence           |         2,037.76 (126.59) |         2,334.35 (280.84) | +14.55% |  +15.30% (15.65 pp) |
| tuple/projection/8/replace.random       |           1,199.27 (11.9) |          1,199.7 (195.51) |  +0.04% |   +0.90% (14.16 pp) |
| tuple/tuple/8/replace.random            |            667.93 (25.73) |            622.98 (99.03) |  -6.73% |   -3.65% (18.06 pp) |
| tuple/projection/8/apply.replace        |           1,788.3 (68.29) |          1,992.82 (21.94) | +11.44% |   +10.72% (6.84 pp) |
| tuple/tuple/8/apply.replace             |         1,018.21 (114.35) |          1,118.74 (47.22) |  +9.87% |    +9.31% (7.64 pp) |
| tuple/projection/8/apply.duplicate      |            599.83 (19.02) |            675.23 (76.08) | +12.57% |   +9.71% (13.97 pp) |
| tuple/tuple/8/apply.duplicate           |             621.8 (22.28) |            651.71 (24.93) |  +4.81% |    +3.29% (2.32 pp) |
| tuple/projection/8/merge.duplicate      |          1,060.17 (28.34) |          1,107.69 (60.69) |  +4.48% |    +4.48% (8.43 pp) |
| tuple/tuple/8/merge.duplicate           |          1,114.68 (23.83) |          1,159.55 (92.95) |  +4.03% |    +5.24% (3.42 pp) |
| tuple/projection/8/length               |              28.21 (4.64) |              26.81 (3.18) |  -4.96% |    -4.07% (40.1 pp) |
| tuple/tuple/8/length                    |              26.78 (1.19) |              28.21 (0.09) |  +5.34% |    +8.11% (2.88 pp) |
| tuple/projection/8/value.random         |              52.65 (4.69) |               55.2 (3.86) |  +4.84% |   -3.89% (15.45 pp) |
| tuple/tuple/8/value.random              |              17.43 (0.29) |              17.96 (1.19) |  +3.08% |    +1.55% (1.21 pp) |
| tuple/projection/8/values               |            229.66 (32.26) |             220.69 (6.63) |  -3.90% |   -1.50% (10.08 pp) |
| tuple/tuple/8/values                    |              204.2 (2.96) |              208.71 (6.8) |  +2.21% |    +0.02% (6.04 pp) |
| tuple/projection/8/sequence             |            652.52 (26.95) |            669.44 (35.74) |  +2.59% |   +4.36% (11.35 pp) |
| tuple/tuple/8/sequence                  |            697.66 (26.43) |            706.32 (27.27) |  +1.24% |    +1.60% (8.91 pp) |
| tuple/projection/100/create.empty       |            439.34 (39.11) |             458.93 (12.5) |  +4.46% |     +2.15% (7.6 pp) |
| tuple/tuple/100/create.empty            |            461.53 (10.03) |             470.93 (1.45) |  +2.04% |     +1.30% (2.9 pp) |
| tuple/projection/100/create.sequence    |        14,158.68 (275.81) |        14,407.17 (391.29) |  +1.76% |    -1.67% (3.83 pp) |
| tuple/tuple/100/create.sequence         |        11,449.46 (260.96) |        11,611.72 (373.26) |  +1.42% |    +0.51% (7.05 pp) |
| tuple/projection/100/replace.random     |          1,198.67 (52.78) |          1,180.22 (12.46) |  -1.54% |    -1.13% (2.93 pp) |
| tuple/tuple/100/replace.random          |            643.59 (98.98) |            636.23 (41.81) |  -1.14% |   +0.64% (10.35 pp) |
| tuple/projection/100/apply.replace      |          1,828.71 (199.9) |          1,705.94 (85.91) |  -6.71% |    -6.52% (4.91 pp) |
| tuple/tuple/100/apply.replace           |          1,011.69 (94.81) |         1,027.54 (241.05) |  +1.57% |   +4.86% (14.13 pp) |
| tuple/projection/100/apply.duplicate    |            627.48 (38.43) |             646.1 (68.75) |  +2.97% |   -5.38% (17.96 pp) |
| tuple/tuple/100/apply.duplicate         |            611.97 (17.24) |            636.32 (14.02) |  +3.98% |    +1.69% (5.46 pp) |
| tuple/projection/100/merge.duplicate    |         9,224.63 (493.63) |           9,296.34 (90.8) |  +0.78% |    +0.78% (3.92 pp) |
| tuple/tuple/100/merge.duplicate         |        13,278.69 (548.02) |         13,048.9 (402.73) |  -1.73% |    -1.73% (1.27 pp) |
| tuple/projection/100/length             |              27.26 (1.15) |               28.13 (2.2) |  +3.20% |   +5.51% (55.44 pp) |
| tuple/tuple/100/length                  |              27.73 (6.75) |              27.71 (2.78) |  -0.05% |   -1.05% (50.03 pp) |
| tuple/projection/100/value.random       |                 81.27 (9) |              84.64 (4.48) |  +4.15% |    +1.64% (6.69 pp) |
| tuple/tuple/100/value.random            |              18.44 (1.16) |              18.61 (1.16) |  +0.93% |   -1.32% (12.92 pp) |
| tuple/projection/100/values             |            1,877 (601.95) |          1,943.89 (66.68) |  +3.56% |   +2.44% (29.78 pp) |
| tuple/tuple/100/values                  |            1,589 (312.33) |          1,589.95 (86.35) |  +0.06% |   +0.64% (14.64 pp) |
| tuple/projection/100/sequence           |       6,807.26 (1,733.62) |         6,153.31 (265.07) |  -9.61% |   -11.48% (8.47 pp) |
| tuple/tuple/100/sequence                |       6,124.62 (1,509.45) |          5,540.95 (70.86) |  -9.53% |    -4.50% (6.93 pp) |

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
