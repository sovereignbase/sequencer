# Identical-build complete guard

5 complete matched runs per build. Before: baseline; candidate: baseline-copy. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 78 timing medians improve over 5%; 73 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 0%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            783.09 (68.79) |            762.84 (59.16) |  -2.59% |   -5.27% (13.11 pp) |
| throughput/1000/apply.duplicate         |            821.97 (53.93) |            802.14 (50.77) |  -2.41% |    -3.48% (8.73 pp) |
| throughput/5000/apply.duplicate         |             377.08 (23.4) |            376.01 (13.71) |  -0.28% |    -0.73% (7.81 pp) |
| throughput/10000/apply.duplicate        |            338.93 (29.83) |            354.11 (26.38) |  +4.48% |    -0.14% (7.54 pp) |
| throughput/15000/apply.duplicate        |             345.24 (8.57) |             332.29 (9.41) |  -3.75% |    -3.43% (2.77 pp) |
| throughput/20000/apply.duplicate        |            336.46 (16.87) |             322.82 (9.26) |  -4.05% |   -4.05% (12.89 pp) |
| throughput/25000/apply.duplicate        |             322.62 (3.62) |            309.24 (21.53) |  -4.15% |    -3.18% (7.92 pp) |
| throughput/100/apply.duplicateRemove    |          1,475.57 (54.06) |          1,615.73 (90.59) |  +9.50% |    +8.92% (4.36 pp) |
| throughput/1000/apply.duplicateRemove   |            823.63 (23.87) |            857.29 (60.83) |  +4.09% |    -0.23% (4.28 pp) |
| throughput/5000/apply.duplicateRemove   |            791.41 (32.37) |              760.6 (20.8) |  -3.89% |    -3.46% (5.44 pp) |
| throughput/10000/apply.duplicateRemove  |            726.77 (35.31) |             725.51 (11.2) |  -0.17% |    +3.13% (7.71 pp) |
| throughput/15000/apply.duplicateRemove  |            711.08 (59.02) |            735.76 (18.94) |  +3.47% |     +2.64% (8.9 pp) |
| throughput/20000/apply.duplicateRemove  |            718.75 (327.8) |            686.53 (55.79) |  -4.48% |   -9.46% (26.66 pp) |
| throughput/25000/apply.duplicateRemove  |            680.52 (25.28) |             653.8 (13.33) |  -3.93% |    -4.69% (6.29 pp) |
| throughput/100/apply.duplicateReplace   |          1,196.7 (208.73) |         1,061.02 (139.26) | -11.34% |  -15.77% (30.91 pp) |
| throughput/1000/apply.duplicateReplace  |          1,086.47 (80.77) |          1,070.58 (37.44) |  -1.46% |    +0.62% (4.17 pp) |
| throughput/5000/apply.duplicateReplace  |            981.14 (65.03) |             925.3 (30.48) |  -5.69% |    -4.44% (4.37 pp) |
| throughput/10000/apply.duplicateReplace |             902.1 (19.46) |            874.23 (25.54) |  -3.09% |    -0.69% (3.03 pp) |
| throughput/15000/apply.duplicateReplace |            844.74 (68.33) |           907.55 (101.33) |  +7.44% |   +1.59% (11.05 pp) |
| throughput/20000/apply.duplicateReplace |            837.81 (85.68) |              808.3 (77.5) |  -3.52% |     +0.69% (5.5 pp) |
| throughput/25000/apply.duplicateReplace |            810.18 (65.94) |            787.07 (19.56) |  -2.85% |    -2.47% (6.06 pp) |
| throughput/100/apply.insert             |          1,701.11 (30.98) |          1,742.86 (66.39) |  +2.45% |   -1.15% (11.12 pp) |
| throughput/1000/apply.insert            |           1,357.32 (33.2) |          1,388.56 (26.62) |  +2.30% |    +2.49% (3.91 pp) |
| throughput/5000/apply.insert            |          1,370.18 (34.23) |         1,341.79 (114.28) |  -2.07% |   -3.40% (12.15 pp) |
| throughput/10000/apply.insert           |          1,339.73 (52.84) |         1,415.31 (181.73) |  +5.64% |   -0.19% (10.94 pp) |
| throughput/15000/apply.insert           |         1,307.93 (165.25) |         1,402.64 (236.25) |  +7.24% |    +7.24% (7.11 pp) |
| throughput/20000/apply.insert           |         1,223.82 (127.08) |          1,267.66 (75.54) |  +3.58% |   +0.82% (16.47 pp) |
| throughput/25000/apply.insert           |         1,373.24 (174.58) |          1,182.6 (138.05) | -13.88% |    -7.13% (2.16 pp) |
| throughput/100/apply.remove             |          1,966.39 (46.77) |         1,925.37 (216.17) |  -2.09% |    +3.99% (16.3 pp) |
| throughput/1000/apply.remove            |          1,469.03 (27.09) |          1,469.25 (55.65) |  +0.01% |    +3.51% (6.09 pp) |
| throughput/5000/apply.remove            |          1,527.19 (86.28) |           1,550.68 (33.3) |  +1.54% |    +0.01% (2.01 pp) |
| throughput/10000/apply.remove           |          1,481.39 (12.82) |          1,528.93 (61.19) |  +3.21% |   +3.21% (17.92 pp) |
| throughput/15000/apply.remove           |         1,586.45 (125.83) |         1,575.61 (194.69) |  -0.68% |    -0.43% (2.56 pp) |
| throughput/20000/apply.remove           |         1,516.26 (354.92) |          1,574.94 (24.95) |  +3.87% |   +3.87% (27.03 pp) |
| throughput/25000/apply.remove           |          1,578.95 (85.66) |          1,544.43 (15.19) |  -2.19% |    +1.99% (9.98 pp) |
| throughput/100/apply.replace            |         3,108.96 (413.37) |           2,745.7 (80.41) | -11.68% |   -9.32% (12.14 pp) |
| throughput/1000/apply.replace           |          2,641.6 (200.57) |           2,719.88 (81.7) |  +2.96% |    +2.80% (2.66 pp) |
| throughput/5000/apply.replace           |         2,742.44 (106.05) |          2,809.07 (29.19) |  +2.43% |   +1.59% (10.93 pp) |
| throughput/10000/apply.replace          |          2,625.38 (129.7) |          2,747.49 (55.79) |  +4.65% |    +2.98% (0.74 pp) |
| throughput/15000/apply.replace          |         2,776.19 (159.95) |         2,833.47 (143.42) |  +2.06% |    -0.19% (6.37 pp) |
| throughput/20000/apply.replace          |          2,653.02 (69.19) |         2,827.78 (139.97) |  +6.59% |    +6.59% (6.88 pp) |
| throughput/25000/apply.replace          |         2,717.86 (147.64) |         2,609.66 (121.55) |  -3.98% |    +0.27% (4.11 pp) |
| throughput/100/create.empty             |            623.62 (29.95) |             533.7 (15.48) | -14.42% |   -13.23% (1.78 pp) |
| throughput/1000/create.empty            |            716.87 (73.79) |            718.36 (79.71) |  +0.21% |    +3.67% (6.69 pp) |
| throughput/5000/create.empty            |            763.68 (29.19) |              798.1 (6.11) |  +4.51% |    +4.51% (4.88 pp) |
| throughput/10000/create.empty           |            721.28 (67.73) |           748.65 (119.56) |  +3.79% |   +5.11% (14.73 pp) |
| throughput/15000/create.empty           |            733.88 (12.72) |             766.28 (9.25) |  +4.41% |    +3.25% (8.14 pp) |
| throughput/20000/create.empty           |            717.97 (40.03) |            754.38 (93.38) |  +5.07% |   -3.07% (14.63 pp) |
| throughput/25000/create.empty           |           746.42 (126.24) |           781.87 (156.06) |  +4.75% |   -5.59% (30.37 pp) |
| throughput/100/create.sequence          |         1,718.47 (116.02) |         1,615.59 (113.01) |  -5.99% |   -8.90% (10.09 pp) |
| throughput/1000/create.sequence         |         1,911.81 (185.96) |         1,879.43 (110.43) |  -1.69% |   +3.82% (12.41 pp) |
| throughput/5000/create.sequence         |          1,719.94 (36.02) |         1,567.88 (431.85) |  -8.84% |   +0.03% (27.66 pp) |
| throughput/10000/create.sequence        |         1,772.14 (177.54) |          1,555.6 (104.63) | -12.22% |   -12.55% (6.54 pp) |
| throughput/15000/create.sequence        |         1,469.82 (113.77) |          1,433.05 (67.17) |  -2.50% |    -1.54% (6.03 pp) |
| throughput/20000/create.sequence        |         1,482.84 (314.93) |         1,559.28 (227.25) |  +5.15% |   +2.27% (18.17 pp) |
| throughput/25000/create.sequence        |         1,619.81 (249.91) |         1,507.54 (118.67) |  -6.93% |    -7.97% (6.12 pp) |
| throughput/100/insert.head              |            530.73 (135.5) |             549.34 (23.3) |  +3.51% |   -1.88% (17.68 pp) |
| throughput/1000/insert.head             |              526.7 (9.12) |            518.22 (10.52) |  -1.61% |    -2.02% (3.44 pp) |
| throughput/5000/insert.head             |             531.2 (56.09) |            553.34 (65.84) |  +4.17% |    +1.95% (5.11 pp) |
| throughput/10000/insert.head            |            535.12 (38.13) |            517.03 (31.77) |  -3.38% |    +0.50% (1.34 pp) |
| throughput/15000/insert.head            |            509.99 (39.22) |              489.51 (7.7) |  -4.02% |    -5.18% (7.81 pp) |
| throughput/20000/insert.head            |            521.05 (50.45) |               529.05 (70) |  +1.54% |   -3.14% (19.12 pp) |
| throughput/25000/insert.head            |            481.87 (73.85) |             451.67 (32.6) |  -6.27% |     -6.27% (2.5 pp) |
| throughput/100/insert.middle            |            618.55 (71.43) |            625.07 (44.39) |  +1.05% |   -3.48% (16.21 pp) |
| throughput/1000/insert.middle           |            624.53 (27.15) |            636.22 (19.04) |  +1.87% |    +3.52% (3.64 pp) |
| throughput/5000/insert.middle           |            629.99 (64.66) |            607.62 (20.54) |  -3.55% |     -0.66% (9.2 pp) |
| throughput/10000/insert.middle          |            578.71 (81.66) |            632.79 (44.29) |  +9.34% |  +11.38% (26.82 pp) |
| throughput/15000/insert.middle          |            567.35 (16.87) |            584.36 (89.51) |  +3.00% |   +6.17% (16.71 pp) |
| throughput/20000/insert.middle          |            594.72 (12.82) |            558.63 (85.59) |  -6.07% |   -5.69% (13.78 pp) |
| throughput/25000/insert.middle          |             580.25 (39.6) |            570.61 (12.09) |  -1.66% |    -3.25% (8.85 pp) |
| throughput/100/insert.random            |           892.45 (115.42) |              883.4 (17.9) |  -1.01% |   -6.62% (11.96 pp) |
| throughput/1000/insert.random           |            892.23 (31.29) |             921.5 (13.19) |  +3.28% |    +3.54% (3.32 pp) |
| throughput/5000/insert.random           |            992.32 (176.3) |            925.11 (69.66) |  -6.77% |    -9.23% (1.66 pp) |
| throughput/10000/insert.random          |            912.01 (24.62) |             893.2 (66.24) |  -2.06% |    -3.08% (10.3 pp) |
| throughput/15000/insert.random          |            891.62 (16.85) |            937.64 (66.38) |  +5.16% |    +6.64% (7.62 pp) |
| throughput/20000/insert.random          |            890.06 (47.11) |           983.93 (117.62) | +10.55% |    +3.15% (5.36 pp) |
| throughput/25000/insert.random          |            904.62 (69.95) |           896.34 (131.99) |  -0.92% |   -3.22% (11.26 pp) |
| throughput/100/insert.sameIndex         |            658.65 (98.42) |             595.35 (47.6) |  -9.61% |   -6.65% (28.46 pp) |
| throughput/1000/insert.sameIndex        |            569.57 (10.22) |            585.89 (32.58) |  +2.87% |    +2.87% (3.44 pp) |
| throughput/5000/insert.sameIndex        |           656.63 (106.78) |            583.86 (62.26) | -11.08% |   -4.56% (20.23 pp) |
| throughput/10000/insert.sameIndex       |            577.05 (49.03) |            566.05 (43.12) |  -1.91% |   -4.77% (10.87 pp) |
| throughput/15000/insert.sameIndex       |            533.08 (44.35) |            542.37 (25.78) |  +1.74% |   -2.66% (16.62 pp) |
| throughput/20000/insert.sameIndex       |            576.34 (49.61) |            601.54 (43.54) |  +4.37% |   +1.49% (12.67 pp) |
| throughput/25000/insert.sameIndex       |            557.05 (49.73) |            533.39 (55.27) |  -4.25% |   -4.10% (12.69 pp) |
| throughput/100/insert.tail              |            887.26 (63.19) |           901.02 (118.36) |  +1.55% |    +1.55% (8.74 pp) |
| throughput/1000/insert.tail             |           905.71 (146.25) |           827.98 (158.72) |  -8.58% |    +1.56% (3.05 pp) |
| throughput/5000/insert.tail             |           996.63 (142.26) |            926.73 (16.37) |  -7.01% |    -8.20% (1.99 pp) |
| throughput/10000/insert.tail            |            843.56 (26.76) |             852.61 (36.1) |  +1.07% |    +0.54% (3.58 pp) |
| throughput/15000/insert.tail            |           743.09 (109.51) |           831.97 (136.68) | +11.96% |    +2.06% (7.83 pp) |
| throughput/20000/insert.tail            |            941.65 (71.25) |            853.55 (75.44) |  -9.36% |   -8.89% (17.58 pp) |
| throughput/25000/insert.tail            |           894.62 (137.39) |           820.34 (138.38) |  -8.30% |    -0.39% (9.07 pp) |
| throughput/100/length                   |            116.68 (17.43) |            127.84 (17.74) |  +9.56% |    +1.94% (9.56 pp) |
| throughput/1000/length                  |             107.59 (1.99) |             109.04 (8.23) |  +1.35% |     +5.26% (9.3 pp) |
| throughput/5000/length                  |             115.01 (8.86) |             116.47 (2.94) |  +1.27% |    -4.07% (7.74 pp) |
| throughput/10000/length                 |             111.54 (7.63) |              114.19 (2.1) |  +2.38% |   +3.80% (11.54 pp) |
| throughput/15000/length                 |            110.19 (15.33) |             106.54 (1.55) |  -3.31% |   +1.23% (12.07 pp) |
| throughput/20000/length                 |             106.97 (0.86) |             108.25 (4.41) |  +1.20% |    +1.22% (5.17 pp) |
| throughput/25000/length                 |             108.88 (8.88) |             110.45 (10.3) |  +1.44% |    -3.02% (0.87 pp) |
| throughput/100/merge.duplicate          |            812.94 (68.94) |            828.25 (22.04) |  +1.88% |    +3.16% (7.78 pp) |
| throughput/1000/merge.duplicate         |            637.59 (20.35) |            658.53 (10.25) |  +3.28% |    +2.08% (3.61 pp) |
| throughput/5000/merge.duplicate         |           620.79 (129.97) |            670.51 (27.32) |  +8.01% |   +3.24% (17.91 pp) |
| throughput/10000/merge.duplicate        |              625.9 (42.9) |            631.45 (20.68) |  +0.89% |   +1.53% (12.72 pp) |
| throughput/15000/merge.duplicate        |            654.55 (61.14) |            605.01 (20.52) |  -7.57% |    -10.33% (8.5 pp) |
| throughput/20000/merge.duplicate        |            594.82 (47.72) |             595.97 (6.74) |  +0.19% |    -1.97% (6.42 pp) |
| throughput/25000/merge.duplicate        |            634.76 (62.86) |             589.16 (47.1) |  -7.18% |    -8.82% (18.4 pp) |
| throughput/100/merge.insert             |         1,970.59 (245.65) |          1,794.76 (36.78) |  -8.92% |    -8.00% (1.75 pp) |
| throughput/1000/merge.insert            |         1,540.73 (100.32) |         1,466.29 (136.66) |  -4.83% |    -4.90% (6.77 pp) |
| throughput/5000/merge.insert            |         1,553.33 (289.23) |         1,558.45 (133.61) |  +0.33% |    -1.89% (7.17 pp) |
| throughput/10000/merge.insert           |          1,561.85 (58.12) |         1,642.51 (140.22) |  +5.16% |    +5.16% (7.97 pp) |
| throughput/15000/merge.insert           |         1,586.12 (136.06) |          1,663.1 (229.08) |  +4.85% |    +4.85% (5.56 pp) |
| throughput/20000/merge.insert           |         1,617.61 (797.49) |          1,536.55 (89.83) |  -5.01% |   -6.84% (33.84 pp) |
| throughput/25000/merge.insert           |           1,423.04 (22.3) |          1,371.07 (247.5) |  -3.65% |   -1.24% (11.24 pp) |
| throughput/100/remove.head              |           815.81 (172.68) |            742.98 (92.75) |  -8.93% |   -3.26% (18.94 pp) |
| throughput/1000/remove.head             |            776.88 (18.04) |            785.04 (22.21) |  +1.05% |    +2.15% (2.52 pp) |
| throughput/5000/remove.head             |            903.87 (83.54) |            841.38 (60.19) |  -6.91% |   -3.71% (12.28 pp) |
| throughput/10000/remove.head            |           999.86 (161.05) |               857 (10.93) | -14.29% |  -17.20% (13.84 pp) |
| throughput/15000/remove.head            |            914.25 (70.89) |           966.24 (184.03) |  +5.69% |  +12.73% (30.13 pp) |
| throughput/20000/remove.head            |           960.88 (108.08) |            924.86 (69.28) |  -3.75% |    -2.92% (6.14 pp) |
| throughput/25000/remove.head            |          1,045.86 (89.74) |            953.09 (35.85) |  -8.87% |    -2.54% (8.22 pp) |
| throughput/100/remove.middle            |           797.23 (136.37) |            764.94 (14.72) |  -4.05% |    -1.02% (3.52 pp) |
| throughput/1000/remove.middle           |            808.65 (44.39) |            814.43 (45.23) |  +0.71% |    +6.92% (7.93 pp) |
| throughput/5000/remove.middle           |            877.09 (42.23) |             840.63 (9.74) |  -4.16% |    +1.21% (5.67 pp) |
| throughput/10000/remove.middle          |            848.49 (86.62) |            866.55 (42.85) |  +2.13% |    +6.77% (3.55 pp) |
| throughput/15000/remove.middle          |             859.97 (36.5) |            917.46 (87.18) |  +6.69% |    +4.83% (5.28 pp) |
| throughput/20000/remove.middle          |            972.86 (62.22) |             930.3 (45.38) |  -4.37% |   -8.10% (12.91 pp) |
| throughput/25000/remove.middle          |           954.86 (121.11) |            936.27 (28.83) |  -1.95% |    -1.57% (5.72 pp) |
| throughput/100/remove.random            |            984.1 (145.97) |            973.04 (95.33) |  -1.12% |    -4.35% (4.88 pp) |
| throughput/1000/remove.random           |         1,275.21 (181.15) |           1,183.45 (9.98) |  -7.20% |    -2.74% (9.48 pp) |
| throughput/5000/remove.random           |         1,237.37 (283.36) |          1,222.56 (72.54) |  -1.20% |   -3.93% (21.63 pp) |
| throughput/10000/remove.random          |          1,221.41 (61.83) |          1,211.9 (145.39) |  -0.78% |     -0.78% (6.7 pp) |
| throughput/15000/remove.random          |          1,255.53 (42.07) |         1,314.78 (109.97) |  +4.72% |   +0.60% (14.43 pp) |
| throughput/20000/remove.random          |         1,366.58 (143.91) |         1,271.22 (139.27) |  -6.98% |    +1.36% (9.67 pp) |
| throughput/25000/remove.random          |         1,462.81 (211.58) |          1,214.38 (11.29) | -16.98% |  -18.80% (14.86 pp) |
| throughput/100/remove.sameIndex         |          1,044.49 (99.03) |          1,067.67 (200.9) |  +2.22% |  -15.25% (26.45 pp) |
| throughput/1000/remove.sameIndex        |            829.92 (56.86) |             824.85 (3.64) |  -0.61% |    -0.84% (7.08 pp) |
| throughput/5000/remove.sameIndex        |           858.01 (102.49) |            855.15 (38.81) |  -0.33% |   -1.43% (17.21 pp) |
| throughput/10000/remove.sameIndex       |             859.19 (35.3) |            862.96 (38.62) |  +0.44% |    +0.34% (4.67 pp) |
| throughput/15000/remove.sameIndex       |             938.01 (7.01) |            915.72 (42.73) |  -2.38% |    -0.66% (2.78 pp) |
| throughput/20000/remove.sameIndex       |           1,040.36 (87.5) |          1,026.94 (92.59) |  -1.29% |    -1.33% (5.62 pp) |
| throughput/25000/remove.sameIndex       |         1,013.12 (113.15) |            900.9 (127.47) | -11.08% |   -1.19% (15.42 pp) |
| throughput/100/remove.tail              |             813.4 (81.48) |           700.51 (138.61) | -13.88% |   -9.45% (11.66 pp) |
| throughput/1000/remove.tail             |             706.8 (69.74) |            741.85 (29.78) |  +4.96% |   +1.69% (10.54 pp) |
| throughput/5000/remove.tail             |            802.66 (82.79) |            739.65 (81.11) |  -7.85% |   -0.21% (11.36 pp) |
| throughput/10000/remove.tail            |            778.81 (31.16) |            787.78 (42.56) |  +1.15% |   -0.66% (12.99 pp) |
| throughput/15000/remove.tail            |            768.95 (40.37) |            796.96 (41.52) |  +3.64% |    +4.24% (1.04 pp) |
| throughput/20000/remove.tail            |         1,071.35 (267.01) |            822.46 (80.51) | -23.23% |  -22.34% (24.08 pp) |
| throughput/25000/remove.tail            |            826.25 (26.31) |            922.58 (35.79) | +11.66% |   +11.70% (3.62 pp) |
| throughput/100/replace.head             |            1,139.18 (168) |         1,007.28 (175.56) | -11.58% |    +0.57% (3.81 pp) |
| throughput/1000/replace.head            |          1,205.63 (11.89) |          1,162.02 (66.03) |  -3.62% |    -3.02% (5.11 pp) |
| throughput/5000/replace.head            |          1,188.55 (76.83) |          1,187.61 (95.09) |  -0.08% |    +2.37% (2.21 pp) |
| throughput/10000/replace.head           |          1,189.24 (30.52) |           1,149.89 (63.5) |  -3.31% |    -6.19% (5.17 pp) |
| throughput/15000/replace.head           |          1,167.15 (16.36) |         1,255.75 (107.12) |  +7.59% |    +6.95% (10.2 pp) |
| throughput/20000/replace.head           |         1,271.12 (179.92) |         1,256.76 (131.07) |  -1.13% |    -0.25% (7.84 pp) |
| throughput/25000/replace.head           |         1,227.58 (116.47) |         1,219.68 (262.55) |  -0.64% |   -0.71% (24.33 pp) |
| throughput/100/replace.middle           |          1,201.76 (87.58) |         1,057.41 (107.38) | -12.01% |     -3.77% (8.3 pp) |
| throughput/1000/replace.middle          |         1,267.56 (103.36) |          1,238.55 (57.78) |  -2.29% |    -6.52% (4.76 pp) |
| throughput/5000/replace.middle          |           1,196.07 (33.1) |          1,230.56 (68.35) |  +2.88% |    +3.96% (8.11 pp) |
| throughput/10000/replace.middle         |          1,201.04 (37.52) |          1,266.01 (38.34) |  +5.41% |    +7.28% (4.15 pp) |
| throughput/15000/replace.middle         |         1,169.48 (176.99) |         1,273.26 (109.17) |  +8.87% |   +8.87% (24.93 pp) |
| throughput/20000/replace.middle         |          1,343.42 (80.78) |          1,338.87 (44.52) |  -0.34% |    +2.13% (3.42 pp) |
| throughput/25000/replace.middle         |          1,292.5 (184.67) |         1,275.51 (137.78) |  -1.31% |    +0.81% (9.86 pp) |
| throughput/100/replace.random           |         1,835.91 (329.01) |         1,646.21 (146.17) | -10.33% |   +3.77% (21.96 pp) |
| throughput/1000/replace.random          |           1,858.5 (59.05) |         1,802.15 (109.75) |  -3.03% |    +0.10% (5.85 pp) |
| throughput/5000/replace.random          |             1,792 (33.61) |         1,733.14 (110.55) |  -3.28% |     -0.34% (9.5 pp) |
| throughput/10000/replace.random         |          1,802.73 (94.83) |         1,887.88 (266.93) |  +4.72% |   +2.98% (14.74 pp) |
| throughput/15000/replace.random         |         1,670.86 (237.77) |          1,842.69 (83.12) | +10.28% |    +6.14% (6.91 pp) |
| throughput/20000/replace.random         |         1,785.24 (182.17) |          1,808.6 (232.13) |  +1.31% |   +4.60% (23.17 pp) |
| throughput/25000/replace.random         |         1,812.05 (284.92) |          1,875.75 (62.01) |  +3.52% |    +2.82% (21.1 pp) |
| throughput/100/replace.sameIndex        |         1,061.47 (115.79) |           1,037.4 (31.66) |  -2.27% |    -1.21% (4.33 pp) |
| throughput/1000/replace.sameIndex       |          1,217.57 (67.97) |           1,138.79 (4.57) |  -6.47% |    -6.46% (4.91 pp) |
| throughput/5000/replace.sameIndex       |          1,123.66 (66.11) |           1,136.2 (11.17) |  +1.12% |    +1.44% (7.14 pp) |
| throughput/10000/replace.sameIndex      |          1,179.07 (33.45) |          1,247.17 (62.65) |  +5.78% |    +6.77% (5.26 pp) |
| throughput/15000/replace.sameIndex      |         1,164.22 (167.61) |          1,228.23 (75.97) |  +5.50% |    -0.25% (2.78 pp) |
| throughput/20000/replace.sameIndex      |          1,229.52 (56.59) |         1,262.01 (130.25) |  +2.64% |   +3.87% (14.55 pp) |
| throughput/25000/replace.sameIndex      |          1,169.71 (18.35) |          1,215.04 (24.43) |  +3.88% |    +2.86% (0.74 pp) |
| throughput/100/replace.tail             |          1,075.91 (196.9) |         1,042.54 (141.72) |  -3.10% |    -0.13% (4.73 pp) |
| throughput/1000/replace.tail            |          1,264.52 (48.72) |          1,162.59 (91.07) |  -8.06% |       -9.51% (6 pp) |
| throughput/5000/replace.tail            |          1,154.06 (25.44) |          1,193.11 (37.77) |  +3.38% |    +2.68% (3.58 pp) |
| throughput/10000/replace.tail           |          1,208.21 (57.41) |         1,266.96 (115.24) |  +4.86% |    +0.32% (14.4 pp) |
| throughput/15000/replace.tail           |          1,233.34 (36.61) |          1,162.22 (83.22) |  -5.77% |    -3.71% (6.54 pp) |
| throughput/20000/replace.tail           |          1,328.75 (19.28) |          1,277.07 (78.73) |  -3.89% |   -3.89% (21.39 pp) |
| throughput/25000/replace.tail           |             1,268.6 (6.3) |         1,358.35 (152.54) |  +7.07% |   +13.61% (13.5 pp) |
| throughput/100/retire                   |            193.38 (20.79) |             292.2 (77.79) | +51.10% |  +53.64% (62.05 pp) |
| throughput/1000/retire                  |             219.75 (9.58) |             215.83 (5.38) |  -1.78% |    -3.24% (7.58 pp) |
| throughput/5000/retire                  |             203.52 (7.33) |             210.28 (9.16) |  +3.32% |   +3.56% (10.91 pp) |
| throughput/10000/retire                 |              198.19 (4.5) |            214.72 (18.41) |  +8.34% |   +2.33% (11.85 pp) |
| throughput/15000/retire                 |             205.02 (28.6) |            193.89 (16.77) |  -5.43% |   +2.27% (18.92 pp) |
| throughput/20000/retire                 |              196.2 (4.88) |            193.09 (12.09) |  -1.59% |    -3.00% (1.59 pp) |
| throughput/25000/retire                 |             194.39 (4.44) |            185.94 (14.65) |  -4.35% |   -3.70% (17.65 pp) |
| throughput/100/sequence                 |             274.4 (82.13) |             327.6 (41.38) | +19.39% |  +10.32% (26.11 pp) |
| throughput/1000/sequence                |             322.8 (28.49) |             310.43 (14.7) |  -3.83% |   -9.58% (19.87 pp) |
| throughput/5000/sequence                |             274.11 (5.57) |             288.93 (7.54) |  +5.41% |    +4.46% (3.09 pp) |
| throughput/10000/sequence               |             272.5 (23.53) |            297.12 (33.25) |  +9.03% |   +4.38% (21.98 pp) |
| throughput/15000/sequence               |             260.35 (3.88) |             266.81 (31.5) |  +2.48% |   +6.04% (11.52 pp) |
| throughput/20000/sequence               |            267.79 (15.06) |            255.95 (88.85) |  -4.42% |   +0.40% (25.88 pp) |
| throughput/25000/sequence               |             258.31 (2.91) |            258.85 (19.29) |  +0.21% |    +1.00% (7.78 pp) |
| throughput/100/value.head               |             185.97 (33.2) |            199.19 (16.65) |  +7.11% |   +3.84% (10.47 pp) |
| throughput/1000/value.head              |             164.01 (8.35) |             162.93 (8.62) |  -0.66% |    -2.67% (2.65 pp) |
| throughput/5000/value.head              |              142.88 (4.4) |             152.24 (1.83) |  +6.55% |    +6.96% (7.85 pp) |
| throughput/10000/value.head             |             138.58 (3.11) |            143.79 (26.02) |  +3.76% |   +3.78% (20.46 pp) |
| throughput/15000/value.head             |            141.69 (11.11) |             148.77 (7.51) |  +5.00% |  +14.81% (16.29 pp) |
| throughput/20000/value.head             |             135.85 (3.97) |            135.95 (21.15) |  +0.07% |    +0.00% (3.48 pp) |
| throughput/25000/value.head             |             132.94 (7.05) |             137.36 (8.62) |  +3.32% |      -1.06% (10 pp) |
| throughput/100/value.middle             |             224.8 (52.42) |             257.1 (43.61) | +14.37% |   +3.07% (17.65 pp) |
| throughput/1000/value.middle            |            258.98 (11.07) |             252.56 (18.9) |  -2.48% |    -2.48% (5.61 pp) |
| throughput/5000/value.middle            |             225.19 (9.07) |             229.63 (1.72) |  +1.97% |    -0.41% (4.82 pp) |
| throughput/10000/value.middle           |             219.78 (8.73) |            220.18 (21.44) |  +0.18% |    +2.98% (6.83 pp) |
| throughput/15000/value.middle           |            235.16 (31.55) |               232 (37.42) |  -1.34% |     +2.95% (9.4 pp) |
| throughput/20000/value.middle           |              214.2 (13.1) |            223.05 (14.67) |  +4.13% |    +5.38% (8.81 pp) |
| throughput/25000/value.middle           |            218.22 (12.93) |            210.91 (12.61) |  -3.35% |    -6.86% (9.37 pp) |
| throughput/100/value.random             |            190.05 (53.66) |              213.4 (8.96) | +12.29% |    -0.67% (24.3 pp) |
| throughput/1000/value.random            |            223.05 (10.84) |             223.2 (42.03) |  +0.07% |   +0.07% (26.89 pp) |
| throughput/5000/value.random            |            273.87 (23.54) |             260.41 (6.55) |  -4.91% |   +1.17% (10.08 pp) |
| throughput/10000/value.random           |              277.7 (6.09) |             277.05 (21.9) |  -0.23% |   -2.00% (11.17 pp) |
| throughput/15000/value.random           |             281.3 (19.01) |            285.84 (39.91) |  +1.61% |   +8.68% (21.52 pp) |
| throughput/20000/value.random           |            282.14 (23.26) |              292.4 (6.41) |  +3.64% |    +2.94% (9.56 pp) |
| throughput/25000/value.random           |             267.24 (8.98) |            266.01 (34.29) |  -0.46% |   +0.12% (17.76 pp) |
| throughput/100/value.sameIndex          |            172.55 (36.37) |            196.02 (21.11) | +13.60% |   -0.28% (17.46 pp) |
| throughput/1000/value.sameIndex         |             184.34 (7.55) |             180.72 (8.66) |  -1.96% |    -0.75% (5.57 pp) |
| throughput/5000/value.sameIndex         |            184.74 (13.04) |              176.75 (7.5) |  -4.32% |     -2.14% (8.4 pp) |
| throughput/10000/value.sameIndex        |            163.62 (12.89) |            173.34 (17.75) |  +5.94% |   +0.39% (22.76 pp) |
| throughput/15000/value.sameIndex        |             161.49 (0.87) |            175.99 (45.88) |  +8.98% |  +16.95% (28.16 pp) |
| throughput/20000/value.sameIndex        |            172.73 (10.25) |             171.72 (8.09) |  -0.58% |    +2.76% (3.51 pp) |
| throughput/25000/value.sameIndex        |             159.19 (7.59) |            168.81 (15.02) |  +6.04% |   +8.86% (15.88 pp) |
| throughput/100/value.tail               |            250.07 (34.15) |            234.51 (15.52) |  -6.22% |    +0.77% (19.1 pp) |
| throughput/1000/value.tail              |            221.05 (11.71) |             220.35 (7.65) |  -0.32% |    -0.32% (1.77 pp) |
| throughput/5000/value.tail              |             195.35 (7.09) |             197.9 (12.57) |  +1.31% |    -3.91% (8.79 pp) |
| throughput/10000/value.tail             |             189.89 (8.67) |            200.73 (31.46) |  +5.71% |   +7.38% (21.38 pp) |
| throughput/15000/value.tail             |              186.21 (7.8) |            213.24 (52.17) | +14.52% |  +19.05% (29.33 pp) |
| throughput/20000/value.tail             |             178.68 (5.72) |             182.87 (15.9) |  +2.34% |   +2.34% (12.16 pp) |
| throughput/25000/value.tail             |           258.61 (218.77) |            193.86 (21.66) | -25.04% |  -20.55% (33.58 pp) |
| throughput/100/values                   |         4,627.77 (140.67) |         4,664.03 (842.19) |  +0.78% |   +8.62% (12.49 pp) |
| throughput/1000/values                  |     159,754.69 (3,955.31) |    177,114.41 (12,363.99) | +10.87% |    +1.87% (11.8 pp) |
| throughput/5000/values                  |    531,320.31 (26,205.34) |    577,921.35 (104,059.9) |  +8.77% |   +4.02% (14.44 pp) |
| throughput/10000/values                 |  1,205,989.84 (31,194.53) |  1,189,562.5 (130,968.75) |  -1.36% |   +1.95% (12.06 pp) |
| throughput/15000/values                 |  1,758,120.31 (39,823.44) |  1,861,910.94 (281,037.5) |  +5.90% |       +4.33% (9 pp) |
| throughput/20000/values                 |  2,723,504.69 (70,465.63) | 2,590,214.06 (168,407.81) |  -4.89% |    -0.98% (5.07 pp) |
| throughput/25000/values                 | 3,280,270.31 (390,310.94) |  3,405,029.69 (421,237.5) |  +3.80% |   +5.56% (27.78 pp) |
| throughput/100/values.head              |            331.36 (44.44) |              319.3 (5.44) |  -3.64% |    +0.03% (7.76 pp) |
| throughput/1000/values.head             |            266.85 (29.05) |            289.47 (12.91) |  +8.48% |   -4.14% (16.32 pp) |
| throughput/5000/values.head             |            292.49 (27.61) |            278.96 (29.14) |  -4.63% |   -4.63% (12.34 pp) |
| throughput/10000/values.head            |            268.16 (17.01) |            310.04 (90.78) | +15.62% |  +15.62% (41.79 pp) |
| throughput/15000/values.head            |            267.61 (29.61) |            273.78 (15.67) |  +2.31% |   -3.93% (13.58 pp) |
| throughput/20000/values.head            |             277.96 (5.54) |            288.33 (27.49) |  +3.73% |    +5.34% (1.37 pp) |
| throughput/25000/values.head            |            264.12 (43.85) |            279.68 (61.62) |  +5.89% |    +3.31% (9.96 pp) |
| throughput/100/values.middle            |             313.49 (21.2) |             306.49 (9.61) |  -2.23% |    +3.22% (7.64 pp) |
| throughput/1000/values.middle           |            276.76 (45.64) |               275.22 (17) |  -0.56% |   +5.83% (27.03 pp) |
| throughput/5000/values.middle           |             282.91 (29.4) |              334.1 (37.9) | +18.09% |  +22.20% (10.41 pp) |
| throughput/10000/values.middle          |            270.78 (22.24) |             254.89 (2.54) |  -5.87% |    -9.23% (8.09 pp) |
| throughput/15000/values.middle          |             238.85 (8.36) |            240.35 (25.62) |  +0.63% |    +1.49% (1.74 pp) |
| throughput/20000/values.middle          |               268.27 (11) |             258.8 (26.19) |  -3.53% |   -0.69% (10.94 pp) |
| throughput/25000/values.middle          |            253.36 (29.72) |             238.7 (53.21) |  -5.79% |  -10.23% (31.76 pp) |
| throughput/100/values.random            |            305.31 (37.41) |            313.76 (57.53) |  +2.77% |   +6.65% (10.75 pp) |
| throughput/1000/values.random           |              299.1 (6.83) |            300.44 (12.68) |  +0.45% |    +3.15% (3.38 pp) |
| throughput/5000/values.random           |             323.1 (54.98) |            313.64 (21.02) |  -2.93% |   -0.81% (16.18 pp) |
| throughput/10000/values.random          |            358.83 (14.38) |              413.1 (23.4) | +15.12% |  +16.26% (25.06 pp) |
| throughput/15000/values.random          |            374.61 (67.92) |            346.88 (30.19) |  -7.40% |   +1.46% (12.29 pp) |
| throughput/20000/values.random          |            412.39 (35.07) |            374.89 (20.02) |  -9.09% |   -11.20% (5.91 pp) |
| throughput/25000/values.random          |            397.12 (36.82) |            406.18 (26.32) |  +2.28% |    +2.61% (6.41 pp) |
| throughput/100/values.sameIndex         |            295.27 (35.23) |            294.98 (26.84) |  -0.10% |   +0.75% (19.21 pp) |
| throughput/1000/values.sameIndex        |             263.8 (11.71) |             275.56 (5.15) |  +4.46% |   +4.46% (11.05 pp) |
| throughput/5000/values.sameIndex        |             276.65 (32.7) |             269.57 (8.88) |  -2.56% |   -5.29% (21.83 pp) |
| throughput/10000/values.sameIndex       |            293.83 (25.83) |            283.45 (54.63) |  -3.53% |    +1.18% (8.52 pp) |
| throughput/15000/values.sameIndex       |            245.76 (15.55) |            255.51 (31.13) |  +3.97% |   +6.73% (22.21 pp) |
| throughput/20000/values.sameIndex       |             288.79 (6.71) |            257.76 (27.22) | -10.74% |  -11.95% (10.27 pp) |
| throughput/25000/values.sameIndex       |            259.44 (19.51) |            239.35 (33.11) |  -7.74% |   -7.74% (22.36 pp) |
| throughput/100/values.tail              |            289.91 (33.76) |            314.89 (27.66) |  +8.62% |    -0.42% (30.9 pp) |
| throughput/1000/values.tail             |            277.82 (12.78) |             268.54 (16.1) |  -3.34% |    -2.72% (5.38 pp) |
| throughput/5000/values.tail             |            289.37 (42.45) |            250.02 (11.15) | -13.60% |  -10.11% (14.29 pp) |
| throughput/10000/values.tail            |            309.64 (82.71) |             284.75 (39.2) |  -8.04% |   +3.69% (15.12 pp) |
| throughput/15000/values.tail            |            302.99 (32.63) |            244.47 (26.43) | -19.31% |  -19.31% (27.53 pp) |
| throughput/20000/values.tail            |            247.39 (53.03) |            238.86 (11.34) |  -3.45% |    -2.87% (7.66 pp) |
| throughput/25000/values.tail            |             236.11 (8.28) |             234.34 (6.91) |  -0.75% |   +2.99% (10.79 pp) |
| lifecycle/scaleUp/apply.random          |         4,293.97 (567.36) |         3,877.12 (271.06) |  -9.71% |   -14.08% (3.85 pp) |
| lifecycle/scaleUp/insert.head           |            952.3 (114.79) |            877.23 (71.62) |  -7.88% |   -9.74% (10.48 pp) |
| lifecycle/scaleUp/insert.random         |          2,059.2 (490.52) |         1,872.39 (298.37) |  -9.07% |  -10.08% (13.43 pp) |
| lifecycle/scaleUp/insert.tail           |           817.41 (150.64) |            774.59 (67.18) |  -5.24% |    -1.04% (8.16 pp) |
| lifecycle/scaleUp/remove.random         |         2,950.79 (589.33) |          2,907.7 (174.56) |  -1.46% |   +0.35% (15.86 pp) |
| lifecycle/scaleUp/replace.head          |          2,500.97 (433.1) |         2,429.12 (394.65) |  -2.87% |    -1.46% (2.74 pp) |
| lifecycle/scaleUp/replace.random        |         3,926.42 (474.85) |          3,567.81 (43.04) |  -9.13% |    -4.36% (7.89 pp) |
| lifecycle/scaleUp/replace.tail          |         2,339.23 (327.36) |          2,322.74 (21.65) |  -0.70% |   -0.43% (13.47 pp) |
| lifecycle/scaleUp/value.head            |               352 (22.64) |            330.11 (14.14) |  -6.22% |    -9.16% (3.57 pp) |
| lifecycle/scaleUp/value.random          |         1,140.04 (226.37) |          1,144.26 (21.76) |  +0.37% |   +0.37% (11.88 pp) |
| lifecycle/scaleUp/value.tail            |            158.59 (19.74) |             155.28 (5.53) |  -2.09% |    -2.79% (8.16 pp) |
| lifecycle/scaleDown/apply.random        |          3,466.13 (81.61) |          3,431.42 (24.84) |  -1.00% |     -1.37% (0.7 pp) |
| lifecycle/scaleDown/insert.random       |          1,703.86 (87.85) |           1,693.06 (5.79) |  -0.63% |    -1.02% (1.52 pp) |
| lifecycle/scaleDown/remove.head         |          1,941.93 (33.78) |          1,899.72 (60.84) |  -2.17% |    -1.36% (4.51 pp) |
| lifecycle/scaleDown/remove.random       |          2,721.5 (205.19) |         2,617.49 (125.69) |  -3.82% |    -2.29% (1.97 pp) |
| lifecycle/scaleDown/remove.tail         |          1,739.55 (65.55) |           1,715.17 (75.1) |  -1.40% |    -0.48% (3.53 pp) |
| lifecycle/scaleDown/replace.head        |           2,674.6 (116.2) |         2,548.82 (160.93) |  -4.70% |   -2.51% (10.26 pp) |
| lifecycle/scaleDown/replace.random      |         3,381.11 (325.53) |         3,609.99 (451.62) |  +6.77% |       -0.35% (7 pp) |
| lifecycle/scaleDown/replace.tail        |      19,875.99 (2,849.85) |        19,051.78 (191.01) |  -4.15% |   -4.15% (10.56 pp) |
| lifecycle/scaleDown/value.head          |             414.54 (9.04) |              423.81 (8.1) |  +2.23% |    +2.31% (3.98 pp) |
| lifecycle/scaleDown/value.random        |          1,084.21 (37.15) |           1,054.3 (14.54) |  -2.76% |    -2.54% (2.46 pp) |
| lifecycle/scaleDown/value.tail          |             232.56 (6.66) |             231.9 (10.22) |  -0.29% |    -1.24% (2.77 pp) |
| lifecycle/fullLifecycle/apply.random    |          3,930.4 (184.17) |         3,647.85 (137.91) |  -7.19% |    -9.24% (3.42 pp) |
| lifecycle/fullLifecycle/insert.head     |            952.3 (114.79) |            877.23 (71.62) |  -7.88% |   -9.74% (10.48 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,874.83 (180.98) |         1,776.71 (146.29) |  -5.23% |    -7.90% (8.96 pp) |
| lifecycle/fullLifecycle/insert.tail     |           817.41 (150.64) |            774.59 (67.18) |  -5.24% |    -1.04% (8.16 pp) |
| lifecycle/fullLifecycle/remove.head     |          1,941.93 (33.78) |          1,899.72 (60.84) |  -2.17% |    -1.36% (4.51 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,764.37 (345.84) |          2,761.51 (19.97) |  -0.10% |   -0.08% (11.38 pp) |
| lifecycle/fullLifecycle/remove.tail     |          1,739.55 (65.55) |           1,715.17 (75.1) |  -1.40% |    -0.48% (3.53 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,689.05 (149.61) |         2,516.39 (146.11) |  -6.42% |    -1.38% (9.93 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,714.33 (191.91) |          3,569.04 (120.8) |  -3.91% |    -4.55% (3.13 pp) |
| lifecycle/fullLifecycle/replace.tail    |      11,448.03 (1,438.24) |         10,687.26 (83.31) |  -6.65% |    -6.65% (7.78 pp) |
| lifecycle/fullLifecycle/value.head      |            386.93 (10.78) |             370.08 (8.86) |  -4.36% |    -2.98% (3.58 pp) |
| lifecycle/fullLifecycle/value.random    |         1,164.91 (102.74) |           1,106.64 (23.5) |  -5.00% |    -1.26% (6.61 pp) |
| lifecycle/fullLifecycle/value.tail      |             198.79 (9.11) |             193.03 (9.99) |  -2.90% |    -0.58% (1.38 pp) |
| checkpoint/up/1000/create               |         484,100 (103,900) |          416,000 (21,400) | -14.07% |  -12.85% (29.62 pp) |
| checkpoint/up/1000/sequence             |       2,900,400 (160,700) |        2,668,900 (78,000) |  -7.98% |   -5.70% (16.63 pp) |
| checkpoint/up/1000/values               |       1,954,400 (255,100) |        1,876,800 (18,800) |  -3.97% |   -6.55% (16.68 pp) |
| checkpoint/up/5000/create               |       1,472,000 (660,100) |          910,600 (39,700) | -38.14% |  -33.96% (38.57 pp) |
| checkpoint/up/5000/sequence             |    10,103,700 (4,748,100) |     8,132,000 (1,641,500) | -19.51% |   -6.04% (32.21 pp) |
| checkpoint/up/5000/values               |       5,320,200 (334,100) |       5,359,600 (205,600) |  +0.74% |    -2.14% (7.57 pp) |
| checkpoint/up/10000/create              |       1,673,800 (100,000) |        1,601,100 (45,700) |  -4.34% |    -1.62% (9.35 pp) |
| checkpoint/up/10000/sequence            |    15,682,100 (1,381,700) |      13,630,400 (726,100) | -13.08% |   -13.03% (7.94 pp) |
| checkpoint/up/10000/values              |    23,319,000 (4,527,500) |      20,500,200 (784,000) | -12.09% |  -15.29% (18.93 pp) |
| checkpoint/up/15000/create              |       2,592,300 (159,100) |         2,412,000 (8,900) |  -6.96% |     -9.28% (5.3 pp) |
| checkpoint/up/15000/sequence            |    16,012,500 (1,116,400) |    14,852,400 (1,381,000) |  -7.24% |    -8.53% (7.47 pp) |
| checkpoint/up/15000/values              |      30,159,600 (921,600) |      29,984,000 (674,700) |  -0.58% |    -0.58% (2.97 pp) |
| checkpoint/up/20000/create              |       3,375,600 (278,300) |         3,405,100 (8,000) |  +0.87% |    +0.94% (7.88 pp) |
| checkpoint/up/20000/sequence            |      21,331,000 (459,900) |      22,033,000 (261,000) |  +3.29% |    +2.61% (6.35 pp) |
| checkpoint/up/20000/values              |    11,412,300 (1,386,500) |      10,698,700 (540,000) |  -6.25% |   -4.39% (13.23 pp) |
| checkpoint/up/25000/create              |       4,003,500 (198,600) |       4,022,600 (208,800) |  +0.48% |    +1.54% (3.56 pp) |
| checkpoint/up/25000/sequence            |    23,872,600 (1,530,300) |    24,023,900 (1,559,200) |  +0.63% |   -1.18% (11.83 pp) |
| checkpoint/up/25000/values              |      12,150,700 (710,800) |      12,007,600 (636,300) |  -1.18% |    -1.94% (7.27 pp) |
| checkpoint/down/20000/create            |       3,419,500 (165,200) |       3,449,800 (104,600) |  +0.89% |    -1.57% (5.99 pp) |
| checkpoint/down/20000/sequence          |      19,481,600 (571,400) |    20,137,500 (3,087,200) |  +3.37% |   +6.01% (12.53 pp) |
| checkpoint/down/20000/values            |        9,233,200 (88,100) |       9,154,800 (719,800) |  -0.85% |    -2.62% (4.69 pp) |
| checkpoint/down/15000/create            |        2,435,700 (17,200) |        2,454,700 (61,900) |  +0.78% |     +1.02% (2.4 pp) |
| checkpoint/down/15000/sequence          |      15,540,700 (484,900) |      16,450,600 (291,200) |  +5.85% |    +5.65% (4.38 pp) |
| checkpoint/down/15000/values            |        6,938,800 (67,400) |       7,419,600 (385,800) |  +6.93% |    +9.17% (8.07 pp) |
| checkpoint/down/10000/create            |       1,775,400 (123,400) |       1,728,700 (114,200) |  -2.63% |    -2.63% (1.35 pp) |
| checkpoint/down/10000/sequence          |    13,231,700 (1,529,400) |      13,172,200 (349,000) |  -0.45% |   -4.90% (12.89 pp) |
| checkpoint/down/10000/values            |       5,805,600 (983,700) |       5,813,000 (538,400) |  +0.13% |   -0.92% (15.38 pp) |
| checkpoint/down/5000/create             |         829,100 (136,500) |          826,600 (30,800) |  -0.30% |   +2.46% (15.33 pp) |
| checkpoint/down/5000/sequence           |       9,616,800 (765,700) |    10,205,000 (2,397,400) |  +6.12% |   +9.32% (13.22 pp) |
| checkpoint/down/5000/values             |       2,540,500 (362,100) |     3,281,200 (1,115,500) | +29.16% |  +20.06% (26.17 pp) |
| checkpoint/down/1000/create             |          153,600 (90,600) |          160,100 (15,600) |  +4.23% |   +3.23% (39.78 pp) |
| checkpoint/down/1000/sequence           |       6,854,900 (947,100) |       6,289,600 (520,800) |  -8.25% |   -14.24% (0.69 pp) |
| checkpoint/down/1000/values             |          558,900 (68,600) |          514,900 (35,600) |  -7.87% |   -2.76% (11.23 pp) |
| checkpoint/down/0/create                |              15,600 (900) |            19,200 (2,900) | +23.08% |  +26.25% (16.25 pp) |
| checkpoint/down/0/sequence              |       1,336,600 (322,000) |       1,440,800 (351,800) |  +7.80% |   +4.66% (20.61 pp) |
| checkpoint/down/0/values                |              11,500 (100) |            13,500 (4,700) | +17.39% |  +18.42% (59.44 pp) |
| tuple/projection/2/create.empty         |            352.13 (43.91) |            374.47 (37.23) |  +6.34% |   +9.34% (24.43 pp) |
| tuple/tuple/2/create.empty              |            437.44 (18.45) |             445.9 (10.63) |  +1.93% |      +0.05% (10 pp) |
| tuple/projection/2/create.sequence      |          1,216.38 (34.26) |          1,203.45 (20.34) |  -1.06% |    +0.64% (2.02 pp) |
| tuple/tuple/2/create.sequence           |          1,378.68 (88.87) |          1,411.39 (24.24) |  +2.37% |    +2.37% (3.86 pp) |
| tuple/projection/2/replace.random       |          1,064.26 (84.91) |          1,061.49 (35.67) |  -0.26% |    +0.27% (7.52 pp) |
| tuple/tuple/2/replace.random            |             687.57 (5.23) |            689.88 (43.04) |  +0.34% |    -0.00% (5.77 pp) |
| tuple/projection/2/apply.replace        |         1,807.55 (208.61) |          1,770.67 (70.03) |  -2.04% |     -3.34% (5.4 pp) |
| tuple/tuple/2/apply.replace             |          1,177.11 (56.45) |          1,158.2 (144.56) |  -1.61% |     +0.09% (7.1 pp) |
| tuple/projection/2/apply.duplicate      |            616.09 (13.57) |           630.15 (143.28) |  +2.28% |   +4.35% (29.85 pp) |
| tuple/tuple/2/apply.duplicate           |            629.68 (36.86) |            682.14 (68.75) |  +8.33% |    +8.33% (4.71 pp) |
| tuple/projection/2/merge.duplicate      |            683.32 (41.81) |            710.02 (49.72) |  +3.91% |    +1.09% (4.67 pp) |
| tuple/tuple/2/merge.duplicate           |             693.9 (65.96) |            679.26 (38.05) |  -2.11% |    +3.38% (4.31 pp) |
| tuple/projection/2/length               |                 7.6 (0.1) |               7.51 (0.07) |  -1.15% |    -0.96% (0.76 pp) |
| tuple/tuple/2/length                    |               7.37 (0.07) |               7.27 (0.34) |  -1.40% |    -0.98% (3.53 pp) |
| tuple/projection/2/value.random         |              29.62 (1.05) |              29.47 (0.93) |  -0.50% |    -2.02% (6.56 pp) |
| tuple/tuple/2/value.random              |              18.38 (0.39) |              18.96 (0.89) |  +3.20% |    +2.23% (5.36 pp) |
| tuple/projection/2/values               |              78.26 (2.21) |              75.95 (5.15) |  -2.95% |    -2.95% (3.12 pp) |
| tuple/tuple/2/values                    |              78.95 (0.93) |              79.17 (6.07) |  +0.28% |    +0.34% (5.32 pp) |
| tuple/projection/2/sequence             |              440.19 (8.8) |            471.56 (59.15) |  +7.13% |    +2.97% (9.38 pp) |
| tuple/tuple/2/sequence                  |                481 (6.54) |            522.36 (19.63) |  +8.60% |    +5.25% (8.89 pp) |
| tuple/projection/4/create.empty         |            417.88 (23.65) |            418.86 (45.73) |  +0.23% |    -1.74% (17.4 pp) |
| tuple/tuple/4/create.empty              |             433.77 (3.31) |             444.27 (13.7) |  +2.42% |    +3.01% (7.92 pp) |
| tuple/projection/4/create.sequence      |          1,644.3 (117.02) |           1,566.1 (32.91) |  -4.76% |   -2.02% (10.72 pp) |
| tuple/tuple/4/create.sequence           |          1,553.07 (39.05) |          1,627.96 (67.72) |  +4.82% |   +5.57% (10.16 pp) |
| tuple/projection/4/replace.random       |          1,170.28 (39.46) |          1,129.99 (41.32) |  -3.44% |   -2.08% (10.04 pp) |
| tuple/tuple/4/replace.random            |             651.8 (10.97) |              643.6 (5.82) |  -1.26% |    -0.42% (3.96 pp) |
| tuple/projection/4/apply.replace        |         1,730.15 (124.89) |         1,703.56 (359.54) |  -1.54% |   -8.74% (28.81 pp) |
| tuple/tuple/4/apply.replace             |          1,137.31 (62.54) |         1,166.99 (169.18) |  +2.61% |   +2.61% (24.52 pp) |
| tuple/projection/4/apply.duplicate      |             582.15 (15.6) |           709.03 (102.69) | +21.79% |  +25.19% (19.87 pp) |
| tuple/tuple/4/apply.duplicate           |            613.44 (24.14) |           763.49 (160.86) | +24.46% |  +28.55% (33.89 pp) |
| tuple/projection/4/merge.duplicate      |               777 (29.46) |            816.32 (80.19) |  +5.06% |    -0.76% (7.89 pp) |
| tuple/tuple/4/merge.duplicate           |            839.85 (40.92) |            838.72 (95.11) |  -0.13% |    +1.46% (9.41 pp) |
| tuple/projection/4/length               |              27.51 (2.77) |                 26.49 (1) |  -3.69% |   -3.89% (33.76 pp) |
| tuple/tuple/4/length                    |               26.6 (2.19) |              26.44 (1.91) |  -0.60% |   -5.96% (29.05 pp) |
| tuple/projection/4/value.random         |             40.72 (11.75) |              43.38 (3.26) |  +6.53% |   -5.12% (11.46 pp) |
| tuple/tuple/4/value.random              |              18.46 (4.86) |              18.65 (2.83) |  +1.06% |   +3.57% (35.04 pp) |
| tuple/projection/4/values               |            154.08 (48.34) |             150.91 (9.89) |  -2.05% |   -23.95% (22.2 pp) |
| tuple/tuple/4/values                    |             162.4 (10.07) |             148.27 (7.69) |  -8.70% |    -9.21% (7.35 pp) |
| tuple/projection/4/sequence             |            465.07 (77.64) |           497.94 (102.44) |  +7.07% |   -2.39% (28.71 pp) |
| tuple/tuple/4/sequence                  |            556.38 (70.28) |            558.86 (15.02) |  +0.45% |   +0.32% (12.59 pp) |
| tuple/projection/8/create.empty         |           436.47 (125.58) |            424.13 (28.41) |  -2.83% |    -0.40% (4.92 pp) |
| tuple/tuple/8/create.empty              |            447.64 (83.08) |             463.4 (17.73) |  +3.52% |     +3.52% (4.1 pp) |
| tuple/projection/8/create.sequence      |         2,268.99 (162.79) |          2,235.96 (76.12) |  -1.46% |    -2.37% (4.59 pp) |
| tuple/tuple/8/create.sequence           |         2,037.76 (126.59) |          2,005.31 (91.13) |  -1.59% |    +0.36% (4.93 pp) |
| tuple/projection/8/replace.random       |           1,199.27 (11.9) |           1,169.2 (27.72) |  -2.51% |    -3.13% (9.11 pp) |
| tuple/tuple/8/replace.random            |            667.93 (25.73) |            645.42 (20.43) |  -3.37% |    +0.24% (9.52 pp) |
| tuple/projection/8/apply.replace        |           1,788.3 (68.29) |          1,791.86 (87.98) |  +0.20% |   +6.22% (12.32 pp) |
| tuple/tuple/8/apply.replace             |         1,018.21 (114.35) |         1,030.65 (193.59) |  +1.22% |   +2.98% (10.63 pp) |
| tuple/projection/8/apply.duplicate      |            599.83 (19.02) |            632.99 (83.07) |  +5.53% |   +8.41% (20.77 pp) |
| tuple/tuple/8/apply.duplicate           |             621.8 (22.28) |            708.3 (106.96) | +13.91% |  +19.51% (21.29 pp) |
| tuple/projection/8/merge.duplicate      |          1,060.17 (28.34) |         1,267.01 (192.85) | +19.51% |  +13.42% (16.23 pp) |
| tuple/tuple/8/merge.duplicate           |          1,114.68 (23.83) |         1,222.14 (153.91) |  +9.64% |   +9.64% (19.43 pp) |
| tuple/projection/8/length               |              28.21 (4.64) |              27.61 (3.12) |  -2.14% |  +4.29% (114.19 pp) |
| tuple/tuple/8/length                    |              26.78 (1.19) |              26.59 (1.03) |  -0.71% |  +1.90% (140.29 pp) |
| tuple/projection/8/value.random         |              52.65 (4.69) |              56.37 (13.4) |  +7.07% |   +4.41% (12.19 pp) |
| tuple/tuple/8/value.random              |              17.43 (0.29) |              18.87 (9.53) |  +8.29% |    +6.69% (36.3 pp) |
| tuple/projection/8/values               |            229.66 (32.26) |            224.33 (40.46) |  -2.32% |   +1.54% (27.08 pp) |
| tuple/tuple/8/values                    |              204.2 (2.96) |            234.74 (36.68) | +14.95% |   +18.89% (4.01 pp) |
| tuple/projection/8/sequence             |            652.52 (26.95) |            689.73 (90.59) |  +5.70% |  +10.73% (19.18 pp) |
| tuple/tuple/8/sequence                  |            697.66 (26.43) |           706.06 (105.83) |  +1.20% |   +4.56% (15.73 pp) |
| tuple/projection/100/create.empty       |            439.34 (39.11) |            470.23 (20.32) |  +7.03% |   +1.40% (12.86 pp) |
| tuple/tuple/100/create.empty            |            461.53 (10.03) |             480.66 (7.99) |  +4.14% |    +3.67% (2.37 pp) |
| tuple/projection/100/create.sequence    |        14,158.68 (275.81) |        14,433.51 (178.24) |  +1.94% |    +2.02% (0.58 pp) |
| tuple/tuple/100/create.sequence         |        11,449.46 (260.96) |        11,744.94 (347.98) |  +2.58% |    +1.88% (6.34 pp) |
| tuple/projection/100/replace.random     |          1,198.67 (52.78) |          1,191.81 (30.27) |  -0.57% |    -0.57% (1.59 pp) |
| tuple/tuple/100/replace.random          |            643.59 (98.98) |            658.45 (87.71) |  +2.31% |   -3.04% (11.46 pp) |
| tuple/projection/100/apply.replace      |          1,828.71 (199.9) |          1,780.01 (75.61) |  -2.66% |    -0.45% (1.82 pp) |
| tuple/tuple/100/apply.replace           |          1,011.69 (94.81) |          1,047.22 (64.97) |  +3.51% |    +3.46% (2.08 pp) |
| tuple/projection/100/apply.duplicate    |            627.48 (38.43) |            601.19 (27.69) |  -4.19% |     -2.89% (8.6 pp) |
| tuple/tuple/100/apply.duplicate         |            611.97 (17.24) |            620.36 (50.03) |  +1.37% |    -0.23% (8.92 pp) |
| tuple/projection/100/merge.duplicate    |         9,224.63 (493.63) |         8,914.65 (213.06) |  -3.36% |    -3.86% (7.95 pp) |
| tuple/tuple/100/merge.duplicate         |        13,278.69 (548.02) |        13,097.19 (511.35) |  -1.37% |    -4.41% (8.44 pp) |
| tuple/projection/100/length             |              27.26 (1.15) |              28.27 (2.02) |  +3.69% |   -3.56% (16.05 pp) |
| tuple/tuple/100/length                  |              27.73 (6.75) |               28.43 (1.7) |  +2.53% |   -6.78% (26.45 pp) |
| tuple/projection/100/value.random       |                 81.27 (9) |              80.88 (2.34) |  -0.47% |    +1.13% (6.99 pp) |
| tuple/tuple/100/value.random            |              18.44 (1.16) |              18.69 (1.39) |  +1.37% |   +4.45% (12.06 pp) |
| tuple/projection/100/values             |            1,877 (601.95) |          1,863.25 (35.65) |  -0.73% |   +1.04% (25.99 pp) |
| tuple/tuple/100/values                  |            1,589 (312.33) |          1,547.02 (13.87) |  -2.64% |   -2.17% (22.45 pp) |
| tuple/projection/100/sequence           |       6,807.26 (1,733.62) |         6,352.26 (175.59) |  -6.68% |   -6.27% (11.26 pp) |
| tuple/tuple/100/sequence                |       6,124.62 (1,509.45) |         5,630.05 (250.42) |  -8.08% |       -6.76% (7 pp) |

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

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_22_runtime`. No external competitor was run.
