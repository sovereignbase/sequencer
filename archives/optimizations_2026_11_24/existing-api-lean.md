# Batch: final apply cleanup guard

3 complete matched runs per build. Before: batch-base; candidate: batch-lean. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 89 timing medians improve over 5%; 96 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |               Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | -------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |              925.6 (73.62) |            833.8 (109.05) |  -9.92% |   -9.92% (18.59 pp) |
| throughput/1000/apply.duplicate         |              865.6 (93.28) |             919.4 (31.96) |  +6.22% |   +8.12% (10.93 pp) |
| throughput/5000/apply.duplicate         |             388.72 (17.39) |               394.51 (42) |  +1.49% |   +9.07% (11.77 pp) |
| throughput/10000/apply.duplicate        |              339.22 (2.62) |             357.6 (12.57) |  +5.42% |    +5.42% (2.87 pp) |
| throughput/15000/apply.duplicate        |               328.4 (3.67) |            350.99 (29.82) |  +6.88% |   +6.88% (10.26 pp) |
| throughput/20000/apply.duplicate        |              315.8 (18.28) |            338.02 (24.24) |  +7.04% |   +7.04% (13.46 pp) |
| throughput/25000/apply.duplicate        |              315.24 (6.77) |           403.61 (123.64) | +28.03% |  +25.69% (37.77 pp) |
| throughput/100/apply.duplicateRemove    |           1,672.07 (93.98) |          1,527.88 (33.97) |  -8.62% |     -6.88% (6.3 pp) |
| throughput/1000/apply.duplicateRemove   |            892.13 (113.48) |              903 (103.99) |  +1.22% |   -2.21% (28.56 pp) |
| throughput/5000/apply.duplicateRemove   |              801.5 (19.76) |           776.76 (212.17) |  -3.09% |    +0.51% (27.1 pp) |
| throughput/10000/apply.duplicateRemove  |            716.51 (113.93) |           796.61 (304.32) | +11.18% |   +5.00% (50.89 pp) |
| throughput/15000/apply.duplicateRemove  |             712.29 (19.98) |            704.22 (58.25) |  -1.13% |    +2.20% (6.93 pp) |
| throughput/20000/apply.duplicateRemove  |             778.02 (52.28) |             697.83 (71.9) | -10.31% |    +3.25% (9.08 pp) |
| throughput/25000/apply.duplicateRemove  |             732.63 (34.01) |            864.16 (79.28) | +17.95% |   +20.94% (6.54 pp) |
| throughput/100/apply.duplicateReplace   |           1,078.85 (79.84) |          1,123.54 (18.49) |  +4.14% |    +1.60% (6.73 pp) |
| throughput/1000/apply.duplicateReplace  |          1,239.06 (226.81) |          1,461.62 (88.88) | +17.96% |  +24.38% (24.56 pp) |
| throughput/5000/apply.duplicateReplace  |             977.59 (33.01) |            989.5 (167.94) |  +1.22% |   +1.22% (20.91 pp) |
| throughput/10000/apply.duplicateReplace |             956.22 (153.9) |           960.44 (114.39) |  +0.44% |    +0.75% (7.27 pp) |
| throughput/15000/apply.duplicateReplace |             930.74 (313.7) |           900.79 (153.98) |  -3.22% |    -8.93% (35.4 pp) |
| throughput/20000/apply.duplicateReplace |              847.05 (9.09) |            898.3 (117.25) |  +6.05% |   +6.05% (12.62 pp) |
| throughput/25000/apply.duplicateReplace |             850.53 (15.74) |           1,031.54 (7.22) | +21.28% |   +20.66% (1.68 pp) |
| throughput/100/apply.insert             |          1,986.08 (251.52) |         1,762.83 (209.97) | -11.24% |    +2.39% (9.44 pp) |
| throughput/1000/apply.insert            |            1,390.7 (71.38) |          1,423.07 (82.15) |  +2.33% |   +1.85% (11.26 pp) |
| throughput/5000/apply.insert            |          1,310.93 (130.48) |          1,404.83 (54.65) |  +7.16% |   +8.83% (12.94 pp) |
| throughput/10000/apply.insert           |          1,273.14 (344.26) |         1,447.06 (191.16) | +13.66% |   +3.62% (14.03 pp) |
| throughput/15000/apply.insert           |            1,262.33 (52.7) |         1,375.33 (118.01) |  +8.95% |  +17.00% (10.12 pp) |
| throughput/20000/apply.insert           |           1,205.51 (85.13) |         1,232.34 (108.98) |  +2.23% |    +3.75% (5.25 pp) |
| throughput/25000/apply.insert           |          1,192.98 (157.63) |           1,424.59 (69.7) | +19.41% |  +25.25% (12.13 pp) |
| throughput/100/apply.remove             |          2,463.67 (966.57) |           1,952.04 (8.46) | -20.77% |  -20.48% (29.09 pp) |
| throughput/1000/apply.remove            |             1,514 (106.68) |         1,468.15 (133.39) |  -3.03% |   -3.03% (18.13 pp) |
| throughput/5000/apply.remove            |           1,562.78 (62.37) |         1,631.54 (148.42) |  +4.40% |    +4.40% (5.24 pp) |
| throughput/10000/apply.remove           |           1,592.88 (186.5) |         1,525.24 (132.68) |  -4.25% |    -5.59% (4.55 pp) |
| throughput/15000/apply.remove           |          1,660.38 (143.33) |          1,593.66 (52.76) |  -4.02% |    -4.02% (11.4 pp) |
| throughput/20000/apply.remove           |            1,551.49 (99.3) |          1,804.1 (157.81) | +16.28% |  +16.28% (17.45 pp) |
| throughput/25000/apply.remove           |          1,526.91 (308.43) |           1,656.46 (99.8) |  +8.48% |   +8.48% (11.57 pp) |
| throughput/100/apply.replace            |          3,305.43 (309.15) |         2,719.84 (122.91) | -17.72% |  -18.20% (13.42 pp) |
| throughput/1000/apply.replace           |          2,684.69 (146.47) |         3,107.32 (178.43) | +15.74% |  +11.28% (11.06 pp) |
| throughput/5000/apply.replace           |          2,880.16 (109.18) |         3,081.05 (102.16) |  +6.97% |     +2.84% (2.4 pp) |
| throughput/10000/apply.replace          |          2,818.67 (724.37) |         2,771.51 (116.83) |  -1.67% |   -1.77% (15.06 pp) |
| throughput/15000/apply.replace          |           2,847.66 (113.3) |         2,694.54 (139.31) |  -5.38% |    -0.07% (3.56 pp) |
| throughput/20000/apply.replace          |           2,777.33 (239.3) |         2,921.49 (181.86) |  +5.19% |     +0.04% (4.4 pp) |
| throughput/25000/apply.replace          |          2,741.84 (162.89) |          2,898.06 (340.3) |  +5.70% |    +6.62% (6.03 pp) |
| throughput/100/create.empty             |             683.92 (51.56) |            566.46 (49.15) | -17.17% |  -17.17% (13.22 pp) |
| throughput/1000/create.empty            |             669.31 (74.28) |            742.14 (41.37) | +10.88% |  +16.26% (17.81 pp) |
| throughput/5000/create.empty            |             744.34 (15.35) |             854.98 (62.5) | +14.86% |   +14.25% (6.36 pp) |
| throughput/10000/create.empty           |            768.45 (101.62) |            733.43 (29.84) |  -4.56% |    -8.78% (12.8 pp) |
| throughput/15000/create.empty           |              759.46 (25.6) |              707.43 (193) |  -6.85% |    -6.85% (29.7 pp) |
| throughput/20000/create.empty           |             760.97 (80.71) |            780.03 (70.94) |  +2.50% |   +2.50% (18.77 pp) |
| throughput/25000/create.empty           |              699.3 (12.18) |            712.87 (84.81) |  +1.94% |   +3.14% (10.71 pp) |
| throughput/100/create.sequence          |          1,625.74 (205.72) |          1,647.76 (92.38) |  +1.35% |    -4.06% (8.83 pp) |
| throughput/1000/create.sequence         |           1,741.35 (145.9) |         2,054.12 (139.97) | +17.96% |  +14.47% (15.36 pp) |
| throughput/5000/create.sequence         |           1,518.94 (51.86) |          1,582.22 (35.19) |  +4.17% |    +0.83% (4.17 pp) |
| throughput/10000/create.sequence        |          1,789.99 (152.15) |          1,591.16 (92.66) | -11.11% |    -7.92% (6.22 pp) |
| throughput/15000/create.sequence        |           1,382.17 (88.51) |          1,505.09 (74.19) |  +8.89% |   +9.63% (10.81 pp) |
| throughput/20000/create.sequence        |           1,465.7 (217.39) |         1,482.34 (160.09) |  +1.14% |    -6.68% (9.29 pp) |
| throughput/25000/create.sequence        |           1,782.75 (70.18) |         1,768.37 (217.45) |  -0.81% |     -2.37% (9.6 pp) |
| throughput/100/insert.head              |             542.19 (68.54) |            566.41 (34.81) |  +4.47% |   +7.11% (15.19 pp) |
| throughput/1000/insert.head             |             526.79 (32.33) |            579.01 (10.25) |  +9.91% |    +10.57% (7.2 pp) |
| throughput/5000/insert.head             |              550.52 (8.48) |             585.42 (6.37) |  +6.34% |    +7.48% (1.08 pp) |
| throughput/10000/insert.head            |             568.05 (28.58) |            513.91 (22.98) |  -9.53% |    -8.56% (1.09 pp) |
| throughput/15000/insert.head            |             494.97 (99.87) |            493.16 (86.04) |  -0.37% |   +3.33% (28.94 pp) |
| throughput/20000/insert.head            |             522.91 (16.28) |            551.98 (51.86) |  +5.56% |   +11.36% (9.32 pp) |
| throughput/25000/insert.head            |              634.97 (91.8) |               478 (29.69) | -24.72% |  -16.41% (13.99 pp) |
| throughput/100/insert.middle            |              680.7 (50.67) |             688.99 (36.3) |  +1.22% |     +1.36% (2.5 pp) |
| throughput/1000/insert.middle           |             609.92 (28.17) |           728.57 (201.95) | +19.45% |  +17.73% (40.19 pp) |
| throughput/5000/insert.middle           |             653.35 (12.16) |            633.12 (30.97) |  -3.10% |    -2.29% (3.32 pp) |
| throughput/10000/insert.middle          |            637.68 (100.26) |            645.71 (19.73) |  +1.26% |   +0.55% (15.87 pp) |
| throughput/15000/insert.middle          |             641.88 (48.77) |            575.84 (42.37) | -10.29% |    -1.18% (5.61 pp) |
| throughput/20000/insert.middle          |               614.5 (15.6) |            626.06 (21.57) |  +1.88% |    -0.33% (2.09 pp) |
| throughput/25000/insert.middle          |             582.92 (61.67) |            589.16 (28.83) |  +1.07% |   +0.17% (14.47 pp) |
| throughput/100/insert.random            |          1,061.42 (117.41) |          1,064.58 (152.2) |  +0.30% |   +1.95% (21.25 pp) |
| throughput/1000/insert.random           |            893.25 (243.88) |          1,059.35 (91.03) | +18.60% |    +0.69% (21.4 pp) |
| throughput/5000/insert.random           |             925.43 (55.78) |             956.38 (18.2) |  +3.34% |    +3.34% (8.05 pp) |
| throughput/10000/insert.random          |              953.91 (53.5) |            941.79 (44.29) |  -1.27% |    -5.22% (3.24 pp) |
| throughput/15000/insert.random          |              885.8 (147.6) |            870.84 (53.75) |  -1.69% |   -1.69% (19.08 pp) |
| throughput/20000/insert.random          |             907.47 (27.93) |             924.7 (18.66) |  +1.90% |    +5.70% (3.11 pp) |
| throughput/25000/insert.random          |            975.45 (318.53) |            890.55 (23.02) |  -8.70% |   -5.41% (20.57 pp) |
| throughput/100/insert.sameIndex         |            797.18 (300.29) |             611.4 (76.77) | -23.30% |  -23.30% (31.33 pp) |
| throughput/1000/insert.sameIndex        |            591.67 (158.23) |            645.61 (64.47) |  +9.12% |  +15.24% (27.89 pp) |
| throughput/5000/insert.sameIndex        |             567.95 (26.14) |            564.07 (36.66) |  -0.68% |   -2.88% (10.37 pp) |
| throughput/10000/insert.sameIndex       |             596.13 (46.06) |            543.55 (33.21) |  -8.82% |    -2.18% (9.94 pp) |
| throughput/15000/insert.sameIndex       |               552.4 (73.5) |           591.19 (104.34) |  +7.02% |   +16.58% (7.82 pp) |
| throughput/20000/insert.sameIndex       |             545.53 (20.93) |           563.98 (109.02) |  +3.38% |   +3.38% (24.43 pp) |
| throughput/25000/insert.sameIndex       |             635.52 (57.13) |            533.02 (45.89) | -16.13% |   -16.47% (16.8 pp) |
| throughput/100/insert.tail              |             884.29 (72.63) |            901.28 (91.95) |  +1.92% |     +5.27% (9.6 pp) |
| throughput/1000/insert.tail             |            913.28 (216.49) |         1,219.31 (130.73) | +33.51% |  +35.87% (33.12 pp) |
| throughput/5000/insert.tail             |              967.89 (9.77) |            862.38 (62.51) | -10.90% |   -10.44% (5.71 pp) |
| throughput/10000/insert.tail            |             981.16 (61.62) |            846.63 (76.62) | -13.71% |   -8.47% (10.88 pp) |
| throughput/15000/insert.tail            |             897.01 (32.44) |           897.79 (105.94) |  +0.09% |    +0.09% (8.29 pp) |
| throughput/20000/insert.tail            |                834 (45.14) |           931.32 (269.56) | +11.67% |  +19.61% (34.29 pp) |
| throughput/25000/insert.tail            |            845.22 (170.08) |           809.49 (114.79) |  -4.23% |   -13.19% (8.51 pp) |
| throughput/100/length                   |             130.41 (12.85) |             122.11 (18.5) |  -6.36% |   -6.36% (22.78 pp) |
| throughput/1000/length                  |             111.56 (23.02) |            117.28 (10.82) |  +5.13% |  +21.88% (20.83 pp) |
| throughput/5000/length                  |              121.47 (8.82) |             116.37 (8.13) |  -4.20% |   -4.20% (13.28 pp) |
| throughput/10000/length                 |              117.78 (7.15) |             118.17 (9.79) |  +0.33% |   +3.29% (12.35 pp) |
| throughput/15000/length                 |             116.81 (11.06) |             116.9 (41.63) |  +0.08% |   +3.19% (24.15 pp) |
| throughput/20000/length                 |               108.98 (5.7) |             124.24 (25.8) | +14.00% |   +7.86% (27.19 pp) |
| throughput/25000/length                 |                112.9 (6.7) |             100.77 (8.78) | -10.74% |    -3.01% (5.85 pp) |
| throughput/100/merge.duplicate          |           1,020.88 (296.9) |            938.48 (65.51) |  -8.07% |  -19.89% (23.01 pp) |
| throughput/1000/merge.duplicate         |             658.72 (19.74) |            692.65 (69.61) |  +5.15% |   +6.85% (10.38 pp) |
| throughput/5000/merge.duplicate         |             658.35 (12.66) |             642.09 (9.89) |  -2.47% |    +0.09% (1.98 pp) |
| throughput/10000/merge.duplicate        |              623.85 (4.03) |            649.03 (48.11) |  +4.04% |    +3.15% (7.96 pp) |
| throughput/15000/merge.duplicate        |             614.18 (11.69) |            596.16 (13.13) |  -2.93% |     -0.76% (2.9 pp) |
| throughput/20000/merge.duplicate        |               611.8 (6.22) |           674.49 (369.14) | +10.25% |  +10.25% (61.64 pp) |
| throughput/25000/merge.duplicate        |             658.18 (41.17) |            601.14 (22.91) |  -8.67% |   -12.65% (6.85 pp) |
| throughput/100/merge.insert             |          2,012.77 (173.59) |          1,761.68 (55.73) | -12.47% |   -15.94% (9.53 pp) |
| throughput/1000/merge.insert            |           1,864.7 (777.61) |         1,767.98 (159.86) |  -5.19% |   -5.19% (33.02 pp) |
| throughput/5000/merge.insert            |          1,616.95 (110.96) |         1,676.17 (127.83) |  +3.66% |    +3.66% (0.83 pp) |
| throughput/10000/merge.insert           |           1,550.44 (37.67) |         1,576.12 (136.02) |  +1.66% |    +1.78% (6.14 pp) |
| throughput/15000/merge.insert           |           1,495.53 (55.74) |           1,552.93 (69.8) |  +3.84% |    +8.29% (3.37 pp) |
| throughput/20000/merge.insert           |          1,555.87 (154.18) |         1,489.58 (134.26) |  -4.26% |    +8.61% (8.35 pp) |
| throughput/25000/merge.insert           |          1,394.55 (123.33) |          1,480.4 (141.74) |  +6.16% |    -0.55% (4.74 pp) |
| throughput/100/remove.head              |            867.56 (283.35) |            827.57 (72.19) |  -4.61% |   -4.61% (19.92 pp) |
| throughput/1000/remove.head             |             819.95 (272.3) |            824.04 (86.34) |  +0.50% |   -2.61% (14.81 pp) |
| throughput/5000/remove.head             |             819.65 (34.72) |            847.01 (22.38) |  +3.34% |    -1.54% (4.52 pp) |
| throughput/10000/remove.head            |              898.89 (54.6) |            939.26 (38.04) |  +4.49% |    +1.79% (8.91 pp) |
| throughput/15000/remove.head            |             888.68 (15.12) |            909.96 (72.22) |  +2.39% |    -0.35% (8.48 pp) |
| throughput/20000/remove.head            |             923.83 (48.92) |          1,057.77 (55.84) | +14.50% |   +15.17% (6.32 pp) |
| throughput/25000/remove.head            |            916.98 (143.57) |            953.88 (53.15) |  +4.02% |   -3.77% (15.57 pp) |
| throughput/100/remove.middle            |             896.41 (126.4) |            753.04 (97.42) | -15.99% |  -19.35% (25.14 pp) |
| throughput/1000/remove.middle           |             880.42 (67.58) |           825.63 (126.24) |  -6.22% |    -0.99% (8.82 pp) |
| throughput/5000/remove.middle           |             848.06 (27.06) |            848.52 (31.47) |  +0.05% |    +1.28% (1.08 pp) |
| throughput/10000/remove.middle          |             908.64 (67.82) |            878.52 (14.17) |  -3.31% |     -3.31% (6.3 pp) |
| throughput/15000/remove.middle          |             900.84 (26.38) |          1,002.2 (463.72) | +11.25% |    +7.35% (53.8 pp) |
| throughput/20000/remove.middle          |             980.23 (34.12) |         1,000.92 (308.65) |  +2.11% |   +1.52% (28.28 pp) |
| throughput/25000/remove.middle          |             927.17 (97.63) |            994.22 (99.16) |  +7.23% |   +7.23% (20.21 pp) |
| throughput/100/remove.random            |             1,152 (138.48) |            995.41 (99.26) | -13.59% |  -16.34% (20.38 pp) |
| throughput/1000/remove.random           |           1,267.66 (95.12) |         1,243.58 (218.29) |  -1.90% |   +7.58% (13.49 pp) |
| throughput/5000/remove.random           |          1,167.35 (182.77) |          1,206.88 (43.17) |  +3.39% |   -0.24% (10.93 pp) |
| throughput/10000/remove.random          |           1,281.92 (110.1) |          1,191.75 (34.03) |  -7.03% |   -7.03% (10.68 pp) |
| throughput/15000/remove.random          |            1,170.4 (99.16) |          1,252.25 (81.49) |  +6.99% |    +5.74% (2.36 pp) |
| throughput/20000/remove.random          |           1,224.27 (80.69) |          1,280.46 (88.04) |  +4.59% |    +10.46% (6.5 pp) |
| throughput/25000/remove.random          |           1,257.84 (31.03) |          1,255.07 (14.79) |  -0.22% |    -0.22% (1.35 pp) |
| throughput/100/remove.sameIndex         |          1,167.35 (264.41) |         1,251.76 (163.95) |  +7.23% |   +7.63% (32.06 pp) |
| throughput/1000/remove.sameIndex        |             846.96 (38.23) |           828.04 (138.02) |  -2.23% |   -1.95% (11.14 pp) |
| throughput/5000/remove.sameIndex        |             814.23 (34.35) |            819.96 (63.68) |  +0.70% |   +0.70% (11.77 pp) |
| throughput/10000/remove.sameIndex       |             952.63 (95.44) |             873.38 (16.6) |  -8.32% |   -8.58% (12.35 pp) |
| throughput/15000/remove.sameIndex       |             887.94 (18.49) |            888.43 (22.32) |  +0.06% |    +0.41% (4.32 pp) |
| throughput/20000/remove.sameIndex       |             884.95 (19.73) |            965.12 (36.37) |  +9.06% |    +6.87% (2.84 pp) |
| throughput/25000/remove.sameIndex       |              872.2 (10.13) |            960.19 (38.95) | +10.09% |   +10.09% (5.67 pp) |
| throughput/100/remove.tail              |             792.25 (82.83) |            747.83 (54.34) |  -5.61% |   -8.63% (15.05 pp) |
| throughput/1000/remove.tail             |             734.79 (44.19) |           744.37 (389.19) |  +1.30% |   +4.05% (44.29 pp) |
| throughput/5000/remove.tail             |                 775.6 (48) |             772.13 (52.2) |  -0.45% |   -1.05% (13.66 pp) |
| throughput/10000/remove.tail            |             809.52 (32.26) |            755.19 (23.63) |  -6.71% |    -2.59% (2.99 pp) |
| throughput/15000/remove.tail            |            764.04 (135.38) |            785.71 (23.68) |  +2.84% |    +2.84% (17.3 pp) |
| throughput/20000/remove.tail            |             835.94 (21.11) |            898.81 (14.69) |  +7.52% |    +7.42% (4.63 pp) |
| throughput/25000/remove.tail            |            887.31 (105.83) |            816.71 (75.63) |  -7.96% |   -8.08% (19.99 pp) |
| throughput/100/replace.head             |           1,190.88 (97.97) |          1,117.75 (63.64) |  -6.14% |   -6.14% (13.32 pp) |
| throughput/1000/replace.head            |           1,258.02 (36.12) |          1,159.5 (257.21) |  -7.83% |   -4.15% (19.85 pp) |
| throughput/5000/replace.head            |           1,174.86 (22.04) |           1,183.8 (34.51) |  +0.76% |    +0.76% (4.71 pp) |
| throughput/10000/replace.head           |           1,230.79 (42.25) |          1,498.79 (130.8) | +21.77% |   +21.39% (7.09 pp) |
| throughput/15000/replace.head           |          1,207.09 (106.77) |         1,246.34 (120.33) |  +3.25% |    +1.13% (2.14 pp) |
| throughput/20000/replace.head           |           1,212.39 (23.15) |          1,257.7 (132.54) |  +3.74% |    +3.74% (8.77 pp) |
| throughput/25000/replace.head           |           1,256.05 (24.59) |          1,195.08 (41.63) |  -4.85% |     -4.85% (5.2 pp) |
| throughput/100/replace.middle           |              1,316 (64.72) |          1,188.41 (54.17) |  -9.70% |   -10.11% (8.86 pp) |
| throughput/1000/replace.middle          |           1,311.71 (56.82) |         1,207.24 (233.85) |  -7.96% |   -4.52% (14.84 pp) |
| throughput/5000/replace.middle          |          1,197.68 (102.43) |                1,186 (10) |  -0.98% |    -1.22% (6.64 pp) |
| throughput/10000/replace.middle         |           1,190.54 (16.39) |          1,274.11 (31.75) |  +7.02% |     +4.41% (2.8 pp) |
| throughput/15000/replace.middle         |           1,216.08 (24.52) |          1,279.61 (49.12) |  +5.22% |    +5.22% (1.97 pp) |
| throughput/20000/replace.middle         |           1,231.74 (55.83) |          1,291.96 (36.79) |  +4.89% |    +9.22% (5.03 pp) |
| throughput/25000/replace.middle         |          1,257.28 (116.62) |          1,295.47 (89.82) |  +3.04% |   +3.04% (14.74 pp) |
| throughput/100/replace.random           |          1,830.43 (205.19) |          1,732.15 (76.07) |  -5.37% |    -5.37% (13.9 pp) |
| throughput/1000/replace.random          |          1,842.96 (134.26) |         1,942.02 (212.24) |  +5.38% |    +4.00% (4.73 pp) |
| throughput/5000/replace.random          |          1,922.46 (695.21) |       1,812.48 (1,114.72) |  -5.72% |   +1.56% (75.21 pp) |
| throughput/10000/replace.random         |          1,731.56 (220.76) |          1,770.46 (53.49) |  +2.25% |   -1.51% (10.18 pp) |
| throughput/15000/replace.random         |          1,848.89 (124.62) |         1,762.03 (120.84) |  -4.70% |    -1.53% (8.24 pp) |
| throughput/20000/replace.random         |           1,803.16 (32.33) |           1,718.4 (83.91) |  -4.70% |    -2.12% (5.09 pp) |
| throughput/25000/replace.random         |          1,956.03 (771.15) |           1,810.6 (30.16) |  -7.43% |   -9.58% (24.45 pp) |
| throughput/100/replace.sameIndex        |           1,203.16 (81.67) |          1,124.16 (45.09) |  -6.57% |   -6.57% (11.15 pp) |
| throughput/1000/replace.sameIndex       |           1,199.44 (77.38) |         1,253.67 (118.28) |  +4.52% |    +2.07% (4.58 pp) |
| throughput/5000/replace.sameIndex       |          1,313.82 (137.39) |         1,229.38 (168.01) |  -6.43% |    +5.33% (9.96 pp) |
| throughput/10000/replace.sameIndex      |           1,144.61 (46.66) |          1,191.13 (58.72) |  +4.06% |    -0.41% (7.18 pp) |
| throughput/15000/replace.sameIndex      |          1,110.06 (105.36) |         1,184.76 (169.46) |  +6.73% |    +6.73% (4.54 pp) |
| throughput/20000/replace.sameIndex      |           1,263.08 (84.99) |         1,661.18 (427.29) | +31.52% |  +45.47% (35.62 pp) |
| throughput/25000/replace.sameIndex      |          1,396.22 (317.81) |          1,244.29 (28.56) | -10.88% |  -10.88% (13.03 pp) |
| throughput/100/replace.tail             |          1,211.88 (135.16) |       1,285.86 (1,686.07) |  +6.10% | +26.47% (142.06 pp) |
| throughput/1000/replace.tail            |           1,258.24 (41.33) |         1,324.09 (103.34) |  +5.23% |    +3.86% (5.73 pp) |
| throughput/5000/replace.tail            |           1,308.09 (95.39) |         1,242.88 (179.18) |  -4.99% |  +10.38% (13.33 pp) |
| throughput/10000/replace.tail           |           1,223.28 (31.47) |          1,204.98 (74.25) |  -1.50% |    -1.50% (3.63 pp) |
| throughput/15000/replace.tail           |            1,234.4 (42.27) |             1,302 (95.17) |  +5.48% |   +5.48% (11.81 pp) |
| throughput/20000/replace.tail           |           1,319.22 (79.25) |          1,343.34 (63.88) |  +1.83% |   +4.90% (10.09 pp) |
| throughput/25000/replace.tail           |          1,615.05 (213.06) |           1,210.3 (35.14) | -25.06% |  -23.64% (11.27 pp) |
| throughput/100/retire                   |             196.37 (17.35) |             236.3 (88.71) | +20.33% |  +11.56% (55.57 pp) |
| throughput/1000/retire                  |             230.19 (10.24) |             223.13 (9.66) |  -3.07% |    +1.61% (3.54 pp) |
| throughput/5000/retire                  |             210.76 (15.97) |            221.25 (37.66) |  +4.98% |  +10.55% (22.31 pp) |
| throughput/10000/retire                 |             203.71 (17.19) |            206.88 (13.13) |  +1.56% |   +4.65% (12.21 pp) |
| throughput/15000/retire                 |             194.59 (22.22) |             203.75 (9.59) |  +4.71% |   +5.12% (13.16 pp) |
| throughput/20000/retire                 |              197.22 (3.76) |             196.78 (7.12) |  -0.22% |    -0.99% (2.61 pp) |
| throughput/25000/retire                 |              201.79 (14.9) |             198.95 (4.29) |  -1.41% |    -1.41% (4.81 pp) |
| throughput/100/sequence                 |             327.76 (31.86) |            332.53 (16.36) |  +1.46% |    +6.10% (8.65 pp) |
| throughput/1000/sequence                |              311.17 (9.38) |             314.41 (9.61) |  +1.04% |    +0.49% (0.34 pp) |
| throughput/5000/sequence                |             283.78 (18.49) |            296.53 (29.81) |  +4.49% |   +6.85% (15.33 pp) |
| throughput/10000/sequence               |             279.69 (10.96) |            270.29 (12.35) |  -3.36% |    -0.50% (7.05 pp) |
| throughput/15000/sequence               |              263.99 (8.83) |            285.57 (34.99) |  +8.17% |   +8.17% (17.06 pp) |
| throughput/20000/sequence               |             254.51 (13.12) |             258.8 (11.87) |  +1.69% |    +1.69% (9.57 pp) |
| throughput/25000/sequence               |               272.7 (3.42) |            253.58 (13.57) |  -7.01% |    -5.37% (4.79 pp) |
| throughput/100/value.head               |             199.08 (18.83) |             217.52 (5.24) |  +9.26% |  +10.26% (10.07 pp) |
| throughput/1000/value.head              |             172.62 (14.02) |             175.29 (4.66) |  +1.55% |    +1.55% (5.29 pp) |
| throughput/5000/value.head              |              150.66 (6.56) |            145.14 (15.05) |  -3.66% |   -6.68% (13.18 pp) |
| throughput/10000/value.head             |              144.76 (6.17) |             146.24 (3.91) |  +1.02% |    +3.23% (2.82 pp) |
| throughput/15000/value.head             |              151.81 (5.29) |             139.91 (6.25) |  -7.84% |    -9.79% (6.56 pp) |
| throughput/20000/value.head             |              146.3 (11.87) |            152.83 (11.28) |  +4.46% |     +0.98% (2.2 pp) |
| throughput/25000/value.head             |              131.31 (3.73) |             134.33 (8.37) |  +2.30% |    +2.69% (3.57 pp) |
| throughput/100/value.middle             |              257.72 (26.5) |            320.74 (27.77) | +24.45% |  +22.75% (23.64 pp) |
| throughput/1000/value.middle            |             261.11 (18.99) |              254.79 (8.5) |  -2.42% |    +1.90% (5.96 pp) |
| throughput/5000/value.middle            |              260.06 (20.8) |            233.38 (39.68) | -10.26% |  -13.33% (23.19 pp) |
| throughput/10000/value.middle           |             225.55 (32.78) |            228.98 (86.96) |  +1.52% |  +13.44% (45.79 pp) |
| throughput/15000/value.middle           |              217.13 (2.96) |            220.6 (347.03) |  +1.60% |  +1.60% (161.63 pp) |
| throughput/20000/value.middle           |              223.68 (4.38) |            226.93 (14.12) |  +1.45% |     -1.09% (6.2 pp) |
| throughput/25000/value.middle           |              207.04 (7.32) |             203.31 (7.68) |  -1.80% |    -2.53% (6.87 pp) |
| throughput/100/value.random             |              216.7 (21.32) |           244.08 (110.06) | +12.63% |   +8.85% (70.98 pp) |
| throughput/1000/value.random            |             242.56 (13.23) |            230.58 (17.56) |  -4.94% |   -5.97% (12.91 pp) |
| throughput/5000/value.random            |             263.05 (22.63) |            276.05 (44.44) |  +4.94% |   +4.94% (24.19 pp) |
| throughput/10000/value.random           |              271.1 (16.53) |             288.8 (31.46) |  +6.53% |    +6.53% (4.75 pp) |
| throughput/15000/value.random           |              286.04 (2.73) |            295.61 (22.87) |  +3.35% |    +3.68% (7.13 pp) |
| throughput/20000/value.random           |             295.88 (27.76) |            301.08 (15.34) |  +1.76% |   +1.76% (14.94 pp) |
| throughput/25000/value.random           |             258.95 (12.18) |            266.27 (21.71) |  +2.83% |   +2.10% (12.64 pp) |
| throughput/100/value.sameIndex          |              196.29 (19.1) |            220.16 (73.88) | +12.16% |  +12.16% (57.41 pp) |
| throughput/1000/value.sameIndex         |              188.53 (11.2) |            196.79 (13.66) |  +4.38% |    +8.85% (5.17 pp) |
| throughput/5000/value.sameIndex         |             189.54 (27.31) |            231.93 (47.33) | +22.36% |   +37.43% (31.6 pp) |
| throughput/10000/value.sameIndex        |              173.52 (5.72) |              172.66 (6.4) |  -0.50% |    +1.26% (4.58 pp) |
| throughput/15000/value.sameIndex        |              164.97 (8.38) |             206.67 (91.5) | +25.28% |  +30.02% (58.68 pp) |
| throughput/20000/value.sameIndex        |              165.13 (1.78) |            157.02 (13.61) |  -4.91% |    -3.32% (8.48 pp) |
| throughput/25000/value.sameIndex        |               162.2 (7.64) |             154.01 (6.54) |  -5.05% |    -0.70% (6.26 pp) |
| throughput/100/value.tail               |             229.15 (17.87) |            287.42 (28.04) | +25.43% |  +10.78% (10.93 pp) |
| throughput/1000/value.tail              |              228.22 (3.24) |            249.48 (14.04) |  +9.32% |    +6.77% (6.41 pp) |
| throughput/5000/value.tail              |               210.8 (13.4) |             206.2 (62.05) |  -2.18% |   -2.40% (38.04 pp) |
| throughput/10000/value.tail             |              188.52 (8.49) |             188.24 (4.76) |  -0.15% |     -2.54% (2.9 pp) |
| throughput/15000/value.tail             |              183.67 (4.94) |            214.01 (18.94) | +16.52% |  +21.84% (10.86 pp) |
| throughput/20000/value.tail             |             176.72 (61.33) |             186.76 (6.25) |  +5.68% |   +1.11% (21.85 pp) |
| throughput/25000/value.tail             |               193.2 (8.76) |             180.32 (4.26) |  -6.67% |    -6.48% (2.29 pp) |
| throughput/100/values                   |          5,353.79 (654.27) |          5,033.69 (290.8) |  -5.98% |   -12.11% (8.87 pp) |
| throughput/1000/values                  |     177,959.72 (10,605.69) |    184,111.46 (55,991.41) |  +3.46% |  +13.08% (33.12 pp) |
| throughput/5000/values                  |      540,840.1 (88,949.41) |    548,588.54 (37,257.81) |  +1.43% |   +2.24% (16.64 pp) |
| throughput/10000/values                 |    1,211,121.88 (43,845.7) |  1,143,757.81 (51,732.81) |  -5.56% |    -6.27% (4.82 pp) |
| throughput/15000/values                 |  1,765,145.31 (193,534.38) | 2,064,579.69 (772,705.47) | +16.96% |  +22.99% (30.27 pp) |
| throughput/20000/values                 |  2,684,818.75 (637,648.44) | 2,941,540.63 (599,771.09) |  +9.56% |     +5.69% (3.9 pp) |
| throughput/25000/values                 | 3,540,312.5 (1,421,267.97) | 3,351,746.88 (263,799.22) |  -5.33% |   -15.32% (19.9 pp) |
| throughput/100/values.head              |             343.11 (20.77) |            327.95 (14.63) |  -4.42% |    -4.42% (9.85 pp) |
| throughput/1000/values.head             |              282.9 (63.98) |            301.22 (24.13) |  +6.48% |   -0.62% (17.62 pp) |
| throughput/5000/values.head             |             304.83 (35.96) |            292.71 (11.02) |  -3.98% |   -7.14% (14.01 pp) |
| throughput/10000/values.head            |             274.09 (11.47) |             277.63 (16.3) |  +1.29% |    -1.09% (6.66 pp) |
| throughput/15000/values.head            |              254.11 (4.63) |            271.43 (41.03) |  +6.82% |  +10.58% (16.27 pp) |
| throughput/20000/values.head            |             282.54 (20.94) |            264.07 (45.25) |  -6.54% |    -1.09% (12.3 pp) |
| throughput/25000/values.head            |             405.49 (97.13) |            245.82 (15.17) | -39.38% |  -32.38% (21.06 pp) |
| throughput/100/values.middle            |               315.6 (9.88) |            325.07 (53.38) |  +3.00% |   -0.28% (15.49 pp) |
| throughput/1000/values.middle           |             269.54 (96.21) |            285.11 (10.96) |  +5.78% |   +7.42% (27.14 pp) |
| throughput/5000/values.middle           |             270.35 (10.63) |             268.64 (18.3) |  -0.63% |    +1.21% (9.69 pp) |
| throughput/10000/values.middle          |             271.04 (45.19) |            304.25 (43.05) | +12.25% |   +12.25% (2.39 pp) |
| throughput/15000/values.middle          |             274.17 (17.89) |             240.51 (34.5) | -12.28% |    -7.81% (8.47 pp) |
| throughput/20000/values.middle          |             241.05 (56.68) |            270.59 (19.19) | +12.25% |  +11.96% (13.46 pp) |
| throughput/25000/values.middle          |             267.52 (40.84) |              233.43 (1.4) | -12.74% |  -12.80% (13.61 pp) |
| throughput/100/values.random            |             328.92 (33.47) |            350.01 (24.54) |  +6.41% |  +10.38% (18.29 pp) |
| throughput/1000/values.random           |                 305.36 (4) |            316.08 (22.61) |  +3.51% |     +3.51% (8.7 pp) |
| throughput/5000/values.random           |             340.33 (50.63) |            354.35 (31.44) |  +4.12% |    -6.12% (18.5 pp) |
| throughput/10000/values.random          |             356.56 (11.07) |            368.52 (44.36) |  +3.35% |   +3.26% (16.47 pp) |
| throughput/15000/values.random          |             357.49 (11.55) |            364.53 (50.32) |  +1.97% |   +1.97% (10.27 pp) |
| throughput/20000/values.random          |              385.43 (17.3) |            414.03 (57.54) |  +7.42% |   +9.18% (18.34 pp) |
| throughput/25000/values.random          |             383.11 (14.19) |            413.14 (24.92) |  +7.84% |   +11.94% (5.26 pp) |
| throughput/100/values.sameIndex         |               313.9 (9.53) |            319.72 (24.52) |  +1.85% |   +0.90% (10.94 pp) |
| throughput/1000/values.sameIndex        |             283.97 (10.59) |            280.17 (13.06) |  -1.34% |    +2.53% (6.55 pp) |
| throughput/5000/values.sameIndex        |              292.65 (27.7) |            259.75 (29.49) | -11.24% |   -1.04% (13.52 pp) |
| throughput/10000/values.sameIndex       |             244.17 (72.94) |            278.13 (12.69) | +13.91% |  +11.99% (22.43 pp) |
| throughput/15000/values.sameIndex       |             263.76 (12.78) |            253.49 (12.06) |  -3.89% |    +1.13% (6.92 pp) |
| throughput/20000/values.sameIndex       |             256.34 (10.16) |            355.99 (56.47) | +38.87% |  +36.33% (18.84 pp) |
| throughput/25000/values.sameIndex       |              247.54 (25.8) |              236.2 (26.6) |  -4.58% |    -2.81% (1.43 pp) |
| throughput/100/values.tail              |              287.59 (8.69) |            385.48 (35.38) | +34.04% |  +28.99% (11.05 pp) |
| throughput/1000/values.tail             |              274.02 (8.33) |            286.87 (17.96) |  +4.69% |    +3.38% (9.24 pp) |
| throughput/5000/values.tail             |             254.29 (14.91) |             249.54 (3.14) |  -1.87% |    -3.07% (4.98 pp) |
| throughput/10000/values.tail            |             234.64 (40.87) |             270.73 (5.37) | +15.38% |  +12.99% (16.66 pp) |
| throughput/15000/values.tail            |               249.2 (12.2) |            250.59 (20.31) |  +0.56% |   +0.56% (13.34 pp) |
| throughput/20000/values.tail            |              278.26 (7.41) |            281.14 (13.47) |  +1.04% |    +2.79% (6.56 pp) |
| throughput/25000/values.tail            |              227.12 (1.56) |              231.1 (4.24) |  +1.75% |    +2.10% (2.37 pp) |
| lifecycle/scaleUp/apply.random          |          4,003.08 (453.59) |          4,306.9 (329.04) |  +7.59% |    +5.78% (4.25 pp) |
| lifecycle/scaleUp/insert.head           |            823.35 (119.14) |            841.45 (75.65) |  +2.20% |    +1.45% (4.74 pp) |
| lifecycle/scaleUp/insert.random         |           1,883.7 (168.71) |          1,919.89 (281.5) |  +1.92% |    +2.85% (18.3 pp) |
| lifecycle/scaleUp/insert.tail           |             867.46 (70.85) |            857.38 (38.86) |  -1.16% |    -3.32% (4.08 pp) |
| lifecycle/scaleUp/remove.random         |          2,724.72 (638.46) |         2,897.65 (376.08) |  +6.35% |    +5.55% (8.03 pp) |
| lifecycle/scaleUp/replace.head          |          2,419.19 (289.25) |         2,758.44 (381.42) | +14.02% |   +14.02% (9.19 pp) |
| lifecycle/scaleUp/replace.random        |          3,922.81 (419.15) |         3,942.48 (458.03) |  +0.50% |    +5.20% (8.81 pp) |
| lifecycle/scaleUp/replace.tail          |           2,263.2 (251.04) |         2,347.43 (101.21) |  +3.72% |    +3.50% (6.45 pp) |
| lifecycle/scaleUp/value.head            |              321.9 (34.67) |            319.69 (32.44) |  -0.69% |    -5.43% (2.46 pp) |
| lifecycle/scaleUp/value.random          |          1,144.34 (163.19) |          1,221.27 (73.05) |  +6.72% |    +2.04% (8.85 pp) |
| lifecycle/scaleUp/value.tail            |             171.64 (17.23) |              164.11 (7.1) |  -4.39% |   -1.76% (13.35 pp) |
| lifecycle/scaleDown/apply.random        |           3,530.4 (100.71) |          3,517.52 (27.27) |  -0.36% |    -0.98% (2.26 pp) |
| lifecycle/scaleDown/insert.random       |           1,819.55 (70.27) |           1,690.1 (29.66) |  -7.11% |    -4.04% (3.84 pp) |
| lifecycle/scaleDown/remove.head         |           1,943.15 (40.55) |           1,946.98 (9.68) |  +0.20% |    -0.02% (1.64 pp) |
| lifecycle/scaleDown/remove.random       |          2,741.72 (128.31) |          2,739.38 (165.2) |  -0.09% |   -0.09% (10.96 pp) |
| lifecycle/scaleDown/remove.tail         |          2,438.38 (324.56) |          1,775.14 (38.96) | -27.20% |  -28.36% (13.51 pp) |
| lifecycle/scaleDown/replace.head        |          2,568.29 (304.82) |          2,567.1 (188.87) |  -0.05% |    -0.05% (4.13 pp) |
| lifecycle/scaleDown/replace.random      |          3,496.91 (122.94) |         3,649.01 (443.65) |  +4.35% |  +11.34% (13.04 pp) |
| lifecycle/scaleDown/replace.tail        |       21,207.07 (1,954.67) |        19,310.15 (609.71) |  -8.94% |   -12.79% (7.35 pp) |
| lifecycle/scaleDown/value.head          |                440.06 (17) |             421.7 (20.29) |  -4.17% |     -0.47% (6.4 pp) |
| lifecycle/scaleDown/value.random        |           1,127.97 (45.23) |           1,078.44 (6.37) |  -4.39% |    -4.39% (3.36 pp) |
| lifecycle/scaleDown/value.tail          |              240.92 (4.22) |             229.92 (9.35) |  -4.57% |    -1.35% (3.88 pp) |
| lifecycle/fullLifecycle/apply.random    |          3,766.74 (176.45) |         3,912.22 (150.89) |  +3.86% |     +0.37% (2.4 pp) |
| lifecycle/fullLifecycle/insert.head     |            823.35 (119.14) |            841.45 (75.65) |  +2.20% |    +1.45% (4.74 pp) |
| lifecycle/fullLifecycle/insert.random   |           1,851.63 (49.22) |            1,805 (155.58) |  -2.52% |    -3.17% (8.81 pp) |
| lifecycle/fullLifecycle/insert.tail     |             867.46 (70.85) |            857.38 (38.86) |  -1.16% |    -3.32% (4.08 pp) |
| lifecycle/fullLifecycle/remove.head     |           1,943.15 (40.55) |           1,946.98 (9.68) |  +0.20% |    -0.02% (1.64 pp) |
| lifecycle/fullLifecycle/remove.random   |           2,750.3 (263.62) |         2,818.52 (270.64) |  +2.48% |    +0.95% (1.56 pp) |
| lifecycle/fullLifecycle/remove.tail     |          2,438.38 (324.56) |          1,775.14 (38.96) | -27.20% |  -28.36% (13.51 pp) |
| lifecycle/fullLifecycle/replace.head    |           2,631.66 (76.74) |         2,808.41 (169.09) |  +6.72% |    +6.09% (3.77 pp) |
| lifecycle/fullLifecycle/replace.random  |          3,600.02 (203.02) |         4,029.37 (334.03) | +11.93% |    +6.11% (6.37 pp) |
| lifecycle/fullLifecycle/replace.tail    |         11,689.93 (874.42) |        10,927.45 (303.58) |  -6.52% |   -10.85% (6.28 pp) |
| lifecycle/fullLifecycle/value.head      |             384.78 (10.73) |            384.49 (19.46) |  -0.08% |    -2.90% (4.74 pp) |
| lifecycle/fullLifecycle/value.random    |           1,136.16 (58.98) |          1,149.85 (33.34) |  +1.21% |    -2.38% (3.73 pp) |
| lifecycle/fullLifecycle/value.tail      |              203.25 (8.02) |             200.14 (2.69) |  -1.53% |    -1.53% (2.73 pp) |
| checkpoint/up/1000/create               |          439,400 (108,850) |          377,300 (58,750) | -14.13% |  -13.86% (26.78 pp) |
| checkpoint/up/1000/sequence             |        2,511,900 (634,350) |       2,538,000 (384,100) |  +1.04% |   +1.46% (31.59 pp) |
| checkpoint/up/1000/values               |        1,811,000 (325,950) |       1,869,100 (197,950) |  +3.21% |   +3.21% (23.86 pp) |
| checkpoint/up/5000/create               |          980,400 (344,100) |          863,300 (44,900) | -11.94% |  -11.94% (28.05 pp) |
| checkpoint/up/5000/sequence             |        8,029,400 (913,300) |       7,979,300 (194,000) |  -0.62% |   +0.78% (10.46 pp) |
| checkpoint/up/5000/values               |        5,282,800 (320,350) |       5,298,900 (448,200) |  +0.30% |    -0.82% (3.33 pp) |
| checkpoint/up/10000/create              |        1,798,800 (269,300) |       1,551,000 (376,950) | -13.78% |   -3.32% (27.57 pp) |
| checkpoint/up/10000/sequence            |     17,443,300 (2,927,150) |    13,407,500 (2,519,000) | -23.14% |    +0.28% (14.6 pp) |
| checkpoint/up/10000/values              |     21,275,300 (2,650,450) |    20,595,500 (2,436,700) |  -3.20% |       -4.26% (3 pp) |
| checkpoint/up/15000/create              |         2,380,300 (83,400) |        2,394,700 (85,050) |  +0.60% |    +1.12% (6.61 pp) |
| checkpoint/up/15000/sequence            |     14,780,400 (1,036,500) |      15,123,800 (647,100) |  +2.32% |    +0.28% (3.38 pp) |
| checkpoint/up/15000/values              |       30,445,200 (211,150) |      31,588,500 (681,700) |  +3.76% |    +3.76% (2.96 pp) |
| checkpoint/up/20000/create              |         3,373,600 (84,550) |       3,449,500 (206,400) |  +2.25% |    +2.25% (8.78 pp) |
| checkpoint/up/20000/sequence            |     21,570,200 (1,339,850) |    22,538,800 (9,515,700) |  +4.49% |   +4.49% (34.22 pp) |
| checkpoint/up/20000/values              |       10,707,300 (923,150) |    11,353,400 (4,176,400) |  +6.03% |  +11.26% (28.79 pp) |
| checkpoint/up/25000/create              |        3,946,700 (196,250) |       3,974,500 (809,700) |  +0.70% |    -0.37% (24.6 pp) |
| checkpoint/up/25000/sequence            |       24,088,800 (515,600) |    24,857,500 (4,433,300) |  +3.19% |   +6.59% (17.68 pp) |
| checkpoint/up/25000/values              |       11,084,800 (649,850) |    11,904,300 (5,776,250) |  +7.39% |   -1.31% (55.12 pp) |
| checkpoint/down/20000/create            |      3,396,000 (1,186,600) |        3,396,900 (42,050) |  +0.03% |   +0.03% (21.99 pp) |
| checkpoint/down/20000/sequence          |     18,785,300 (4,880,750) |      18,912,000 (184,950) |  +0.67% |   +0.61% (17.89 pp) |
| checkpoint/down/20000/values            |        9,751,200 (935,050) |       9,450,100 (646,250) |  -3.09% |   -1.01% (13.17 pp) |
| checkpoint/down/15000/create            |        2,814,000 (806,700) |        2,434,600 (22,300) | -13.48% |  -13.48% (20.63 pp) |
| checkpoint/down/15000/sequence          |     18,982,900 (4,205,600) |    15,685,100 (1,792,900) | -17.37% |      -19.20% (9 pp) |
| checkpoint/down/15000/values            |        9,517,400 (665,400) |       8,015,300 (580,700) | -15.78% |   -16.58% (8.65 pp) |
| checkpoint/down/10000/create            |         1,675,500 (96,500) |        1,681,400 (61,550) |  +0.35% |    +0.35% (9.04 pp) |
| checkpoint/down/10000/sequence          |       12,443,300 (425,150) |      12,971,100 (267,600) |  +4.24% |    +4.19% (1.39 pp) |
| checkpoint/down/10000/values            |        5,413,400 (237,450) |       5,664,000 (406,300) |  +4.63% |    -1.97% (8.63 pp) |
| checkpoint/down/5000/create             |           789,800 (14,500) |           785,500 (8,500) |  -0.54% |    -0.70% (0.81 pp) |
| checkpoint/down/5000/sequence           |        9,387,900 (332,400) |       9,721,200 (603,700) |  +3.55% |    +5.12% (3.38 pp) |
| checkpoint/down/5000/values             |        2,818,000 (521,550) |       3,025,600 (216,750) |  +7.37% |   -7.38% (15.45 pp) |
| checkpoint/down/1000/create             |           152,600 (10,000) |           158,800 (3,250) |  +4.06% |    +1.11% (7.25 pp) |
| checkpoint/down/1000/sequence           |        6,307,100 (594,950) |       6,366,900 (353,900) |  +0.95% |   +0.95% (16.63 pp) |
| checkpoint/down/1000/values             |           528,100 (43,200) |          562,800 (32,800) |  +6.57% |   +6.57% (15.02 pp) |
| checkpoint/down/0/create                |             18,200 (3,750) |            18,000 (8,200) |  -1.10% |  +34.33% (50.63 pp) |
| checkpoint/down/0/sequence              |        1,560,600 (255,400) |       1,470,100 (192,150) |  -5.80% |   +6.36% (21.93 pp) |
| checkpoint/down/0/values                |             12,200 (2,050) |            11,400 (2,250) |  -6.56% |   +16.33% (23.4 pp) |
| tuple/projection/2/create.empty         |             381.84 (29.75) |             351.7 (21.86) |  -7.89% |    -6.87% (2.13 pp) |
| tuple/tuple/2/create.empty              |               446.56 (6.8) |            464.39 (37.35) |  +3.99% |    +6.10% (8.89 pp) |
| tuple/projection/2/create.sequence      |           1,295.08 (27.67) |          1,310.57 (48.85) |  +1.20% |    +5.55% (3.69 pp) |
| tuple/tuple/2/create.sequence           |          1,462.53 (394.02) |           1,423.11 (24.1) |  -2.69% |   -4.29% (18.45 pp) |
| tuple/projection/2/replace.random       |           1,028.69 (88.02) |          1,054.18 (30.82) |  +2.48% |       +0.35% (6 pp) |
| tuple/tuple/2/replace.random            |             712.06 (58.63) |            766.49 (40.99) |  +7.64% |   +7.64% (13.29 pp) |
| tuple/projection/2/apply.replace        |           1,754.61 (82.57) |           1,801.1 (39.85) |  +2.65% |     +2.17% (6.9 pp) |
| tuple/tuple/2/apply.replace             |           1,315.11 (92.12) |         1,244.42 (152.07) |  -5.38% |    +3.63% (8.77 pp) |
| tuple/projection/2/apply.duplicate      |             688.99 (51.33) |             669.72 (4.87) |  -2.80% |    -1.66% (7.71 pp) |
| tuple/tuple/2/apply.duplicate           |             676.03 (16.46) |            655.76 (42.79) |  -3.00% |    -1.84% (7.98 pp) |
| tuple/projection/2/merge.duplicate      |              813.6 (87.66) |             666.7 (24.41) | -18.06% |   -19.43% (7.36 pp) |
| tuple/tuple/2/merge.duplicate           |             751.78 (95.22) |            649.11 (14.54) | -13.66% |  -15.81% (11.27 pp) |
| tuple/projection/2/length               |                8.88 (2.18) |               7.57 (0.14) | -14.76% |  -13.86% (18.61 pp) |
| tuple/tuple/2/length                    |                9.15 (1.07) |                7.3 (0.01) | -20.21% |  -20.21% (11.48 pp) |
| tuple/projection/2/value.random         |               35.63 (3.06) |               30.62 (1.2) | -14.04% |   -11.57% (6.31 pp) |
| tuple/tuple/2/value.random              |               20.37 (1.54) |              19.56 (1.06) |  -4.01% |   -4.01% (12.34 pp) |
| tuple/projection/2/values               |             116.36 (26.93) |               76.3 (2.83) | -34.43% |  -32.11% (14.74 pp) |
| tuple/tuple/2/values                    |               84.9 (26.94) |              78.64 (6.86) |  -7.37% |  -10.98% (14.33 pp) |
| tuple/projection/2/sequence             |            470.57 (103.01) |            479.06 (44.75) |  +1.80% |   -9.81% (19.96 pp) |
| tuple/tuple/2/sequence                  |             493.22 (82.41) |            509.31 (28.59) |  +3.26% |   -5.85% (12.12 pp) |
| tuple/projection/4/create.empty         |             496.04 (95.83) |            420.74 (15.88) | -15.18% |  -13.25% (13.64 pp) |
| tuple/tuple/4/create.empty              |             488.82 (54.24) |            427.42 (37.22) | -12.56% |  -13.64% (16.38 pp) |
| tuple/projection/4/create.sequence      |          1,741.73 (142.77) |          1,654.77 (20.66) |  -4.99% |    -4.51% (6.91 pp) |
| tuple/tuple/4/create.sequence           |          1,623.18 (141.06) |         1,562.42 (100.38) |  -3.74% |   -4.50% (12.04 pp) |
| tuple/projection/4/replace.random       |           1,186.79 (80.43) |          1,154.25 (24.17) |  -2.74% |    -1.40% (6.15 pp) |
| tuple/tuple/4/replace.random            |             638.18 (31.61) |            644.95 (22.94) |  +1.06% |    +4.33% (6.69 pp) |
| tuple/projection/4/apply.replace        |          1,620.81 (136.05) |          1,713.23 (57.89) |  +5.70% |   +4.89% (10.02 pp) |
| tuple/tuple/4/apply.replace             |           1,093.31 (55.68) |           1,085.71 (2.53) |  -0.70% |    -0.27% (5.05 pp) |
| tuple/projection/4/apply.duplicate      |             590.94 (12.86) |            616.73 (35.83) |  +4.36% |    +3.66% (4.18 pp) |
| tuple/tuple/4/apply.duplicate           |             607.94 (30.49) |            639.16 (32.26) |  +5.14% |    +1.79% (1.88 pp) |
| tuple/projection/4/merge.duplicate      |              863.87 (74.4) |               771 (37.21) | -10.75% |   -8.09% (10.91 pp) |
| tuple/tuple/4/merge.duplicate           |            875.53 (106.26) |            818.69 (36.28) |  -6.49% |   -6.49% (13.72 pp) |
| tuple/projection/4/length               |               28.21 (2.19) |              28.78 (12.8) |  +2.02% |    +2.02% (37.8 pp) |
| tuple/tuple/4/length                    |               27.48 (1.24) |                 25.02 (9) |  -8.96% |   -9.36% (30.03 pp) |
| tuple/projection/4/value.random         |                42.65 (1.6) |              44.02 (4.33) |  +3.21% |   +1.18% (13.22 pp) |
| tuple/tuple/4/value.random              |                19.6 (1.77) |              18.84 (1.06) |  -3.88% |    -8.03% (9.21 pp) |
| tuple/projection/4/values               |             148.32 (26.45) |               145 (54.21) |  -2.24% |   -2.24% (16.57 pp) |
| tuple/tuple/4/values                    |             143.32 (15.88) |            145.68 (27.31) |  +1.65% |    -0.35% (9.58 pp) |
| tuple/projection/4/sequence             |             479.26 (12.28) |            467.55 (37.53) |  -2.44% |    -1.51% (5.72 pp) |
| tuple/tuple/4/sequence                  |             562.75 (22.42) |            555.58 (14.96) |  -1.27% |    -1.27% (1.24 pp) |
| tuple/projection/8/create.empty         |              414.03 (7.74) |             436.3 (16.94) |  +5.38% |    +6.19% (2.56 pp) |
| tuple/tuple/8/create.empty              |              442.12 (8.76) |            460.41 (10.47) |  +4.14% |    +4.14% (4.52 pp) |
| tuple/projection/8/create.sequence      |           2,289.56 (126.7) |         2,348.96 (121.63) |  +2.59% |    -1.42% (2.14 pp) |
| tuple/tuple/8/create.sequence           |           2,136.25 (84.33) |         2,016.99 (161.99) |  -5.58% |    +1.80% (7.88 pp) |
| tuple/projection/8/replace.random       |           1,419.7 (309.59) |          1,176.83 (26.48) | -17.11% |  -17.42% (19.64 pp) |
| tuple/tuple/8/replace.random            |            688.81 (117.46) |            665.75 (85.36) |  -3.35% |   +2.38% (22.45 pp) |
| tuple/projection/8/apply.replace        |          1,774.77 (102.39) |          1,853.14 (46.16) |  +4.42% |    +4.42% (3.17 pp) |
| tuple/tuple/8/apply.replace             |          1,066.14 (104.82) |            1,038.4 (15.6) |  -2.60% |    -2.60% (8.31 pp) |
| tuple/projection/8/apply.duplicate      |             634.82 (40.22) |             634.2 (19.01) |  -0.10% |    -4.09% (7.25 pp) |
| tuple/tuple/8/apply.duplicate           |             616.66 (11.93) |            627.96 (88.95) |  +1.83% |   +4.75% (13.73 pp) |
| tuple/projection/8/merge.duplicate      |            1,087.89 (21.1) |          1,061.94 (58.16) |  -2.39% |    -2.39% (7.21 pp) |
| tuple/tuple/8/merge.duplicate           |            1,139.65 (0.88) |          1,103.99 (37.53) |  -3.13% |    -3.03% (3.32 pp) |
| tuple/projection/8/length               |               28.13 (1.25) |             25.82 (10.92) |  -8.22% |    -8.22% (41.7 pp) |
| tuple/tuple/8/length                    |               28.91 (1.15) |             26.72 (12.11) |  -7.57% |   -7.57% (39.52 pp) |
| tuple/projection/8/value.random         |               51.75 (2.61) |              51.68 (1.82) |  -0.14% |    -0.14% (8.19 pp) |
| tuple/tuple/8/value.random              |                18.7 (0.54) |              18.41 (0.84) |  -1.57% |    -1.57% (7.29 pp) |
| tuple/projection/8/values               |             237.31 (11.38) |              222.5 (16.4) |  -6.24% |   -10.56% (8.69 pp) |
| tuple/tuple/8/values                    |             238.16 (10.01) |            212.96 (12.51) | -10.58% |   -11.36% (1.93 pp) |
| tuple/projection/8/sequence             |             679.98 (14.51) |            689.95 (86.09) |  +1.47% |   +4.23% (11.74 pp) |
| tuple/tuple/8/sequence                  |             708.91 (15.65) |            708.36 (26.94) |  -0.08% |    +0.48% (5.56 pp) |
| tuple/projection/100/create.empty       |             456.78 (15.49) |             449.4 (18.77) |  -1.62% |    -3.76% (6.21 pp) |
| tuple/tuple/100/create.empty            |              464.44 (3.04) |            458.96 (10.37) |  -1.18% |    -0.05% (2.14 pp) |
| tuple/projection/100/create.sequence    |          13,907.89 (53.26) |        13,998.13 (307.17) |  +0.65% |    +0.65% (2.59 pp) |
| tuple/tuple/100/create.sequence         |          11,243.32 (50.68) |        11,348.61 (100.07) |  +0.94% |    +0.94% (0.43 pp) |
| tuple/projection/100/replace.random     |           1,161.38 (15.61) |          1,242.78 (66.01) |  +7.01% |    +8.31% (4.86 pp) |
| tuple/tuple/100/replace.random          |             628.71 (34.85) |             632.94 (4.81) |  +0.67% |    +0.67% (4.41 pp) |
| tuple/projection/100/apply.replace      |           1,894.8 (106.71) |            1,693.75 (236) | -10.61% |  -10.61% (18.21 pp) |
| tuple/tuple/100/apply.replace           |            1,003.65 (12.2) |           1,065.02 (77.5) |  +6.11% |     +4.25% (7.4 pp) |
| tuple/projection/100/apply.duplicate    |             598.16 (13.54) |            627.44 (42.93) |  +4.89% |    +3.97% (7.22 pp) |
| tuple/tuple/100/apply.duplicate         |              599.62 (2.76) |            619.44 (52.61) |  +3.30% |     +2.72% (8.6 pp) |
| tuple/projection/100/merge.duplicate    |          9,492.04 (274.55) |         9,172.73 (305.25) |  -3.36% |    -0.29% (2.95 pp) |
| tuple/tuple/100/merge.duplicate         |         12,993.82 (327.17) |        13,441.85 (384.23) |  +3.45% |    +3.01% (0.59 pp) |
| tuple/projection/100/length             |               28.34 (1.44) |              28.52 (5.63) |  +0.64% |   +0.64% (15.81 pp) |
| tuple/tuple/100/length                  |               27.41 (1.33) |              27.4 (10.12) |  -0.04% |   -2.40% (34.19 pp) |
| tuple/projection/100/value.random       |              90.19 (10.69) |              79.48 (7.56) | -11.87% |   -10.46% (3.42 pp) |
| tuple/tuple/100/value.random            |                19.64 (2.1) |              19.62 (0.15) |  -0.10% |    -0.10% (9.78 pp) |
| tuple/projection/100/values             |          2,017.59 (114.76) |          1,909.78 (20.99) |  -5.34% |    -6.21% (6.46 pp) |
| tuple/tuple/100/values                  |           1,544.45 (89.91) |          1,527.77 (15.23) |  -1.08% |    -1.74% (5.94 pp) |
| tuple/projection/100/sequence           |         7,271.79 (7,255.8) |         6,242.92 (139.34) | -14.15% |  -14.15% (33.12 pp) |
| tuple/tuple/100/sequence                |         5,998.84 (5,308.4) |          5,546.09 (110.2) |  -7.55% |   -5.40% (31.35 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |     Before |  Candidate | Change |
| ----------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                     |    480,344 |    480,344 | +0.00% |
| memory/up/1000/js                         |    414,616 |    414,616 | +0.00% |
| storage/up/1000/jsonBytes                 |    282,352 |    282,352 | +0.00% |
| storage/up/1000/jsonGzipBytes             |     14,864 |     14,864 | +0.00% |
| storage/up/1000/messagePackBytes          |    168,239 |    168,239 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |     12,634 |     12,634 | +0.00% |
| memory/up/5000/native                     |  2,155,832 |  2,155,832 | +0.00% |
| memory/up/5000/js                         |  2,067,576 |  2,067,576 | +0.00% |
| storage/up/5000/jsonBytes                 |  1,666,982 |  1,666,982 | +0.00% |
| storage/up/5000/jsonGzipBytes             |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes          |    841,812 |    841,812 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |     63,179 |     63,179 | +0.00% |
| memory/up/10000/native                    |  3,567,200 |  3,567,200 | +0.00% |
| memory/up/10000/js                        |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes                |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes            |    152,332 |    152,332 | +0.00% |
| storage/up/10000/messagePackBytes         |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |    127,853 |    127,853 | +0.00% |
| memory/up/15000/native                    |  4,819,528 |  4,819,528 | +0.00% |
| memory/up/15000/js                        |  6,205,128 |  6,205,128 | +0.00% |
| storage/up/15000/jsonBytes                |  5,059,733 |  5,059,733 | +0.00% |
| storage/up/15000/jsonGzipBytes            |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes         |  3,645,288 |  3,645,288 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                    |  6,317,656 |  6,317,656 | +0.00% |
| memory/up/20000/js                        |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes                |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes            |    318,957 |    318,957 | +0.00% |
| storage/up/20000/messagePackBytes         |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |    269,979 |    269,979 | +0.00% |
| memory/up/25000/native                    |  7,541,536 |  7,541,536 | +0.00% |
| memory/up/25000/js                        | 10,328,360 | 10,328,360 | +0.00% |
| storage/up/25000/jsonBytes                |  9,500,463 |  9,500,463 | +0.00% |
| storage/up/25000/jsonGzipBytes            |    402,015 |    402,015 | +0.00% |
| storage/up/25000/messagePackBytes         |  6,711,789 |  6,711,789 | +0.00% |
| storage/up/25000/messagePackGzipBytes     |    343,362 |    343,362 | +0.00% |
| memory/down/20000/native                  |  6,597,168 |  6,597,168 | +0.00% |
| memory/down/20000/js                      |  8,267,264 |  8,267,264 | +0.00% |
| storage/down/20000/jsonBytes              |  7,760,743 |  7,760,743 | +0.00% |
| storage/down/20000/jsonGzipBytes          |    334,614 |    334,614 | +0.00% |
| storage/down/20000/messagePackBytes       |  5,444,111 |  5,444,111 | +0.00% |
| storage/down/20000/messagePackGzipBytes   |    284,870 |    284,870 | +0.00% |
| memory/down/15000/native                  |  5,747,296 |  5,747,296 | +0.00% |
| memory/down/15000/js                      |  6,212,288 |  6,212,288 | +0.00% |
| storage/down/15000/jsonBytes              |  5,879,711 |  5,879,711 | +0.00% |
| storage/down/15000/jsonGzipBytes          |    253,187 |    253,187 | +0.00% |
| storage/down/15000/messagePackBytes       |  4,110,000 |  4,110,000 | +0.00% |
| storage/down/15000/messagePackGzipBytes   |    214,817 |    214,817 | +0.00% |
| memory/down/10000/native                  |  4,720,968 |  4,720,968 | +0.00% |
| memory/down/10000/js                      |  4,155,848 |  4,155,848 | +0.00% |
| storage/down/10000/jsonBytes              |  3,941,927 |  3,941,927 | +0.00% |
| storage/down/10000/jsonGzipBytes          |    169,024 |    169,024 | +0.00% |
| storage/down/10000/messagePackBytes       |  2,750,169 |  2,750,169 | +0.00% |
| storage/down/10000/messagePackGzipBytes   |    143,161 |    143,161 | +0.00% |
| memory/down/5000/native                   |  3,777,432 |  3,777,432 | +0.00% |
| memory/down/5000/js                       |  2,066,312 |  2,066,312 | +0.00% |
| storage/down/5000/jsonBytes               |  1,950,486 |  1,950,486 | +0.00% |
| storage/down/5000/jsonGzipBytes           |     81,799 |     81,799 | +0.00% |
| storage/down/5000/messagePackBytes        |  1,363,171 |  1,363,171 | +0.00% |
| storage/down/5000/messagePackGzipBytes    |     69,552 |     69,552 | +0.00% |
| memory/down/1000/native                   |  2,719,360 |  2,719,360 | +0.00% |
| memory/down/1000/js                       |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes               |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes           |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes        |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |     13,922 |     13,922 | +0.00% |
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

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_23_hotpath/batch-lean*`. No external competitor was run.
