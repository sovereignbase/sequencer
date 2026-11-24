# One-step Session predictor: complete guard

5 complete matched runs per build. Before: baseline; candidate: session-inline. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 53 timing medians improve over 5%; 51 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 0%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |           778.71 (119.86) |             793.41 (37.6) |  +1.89% |   +1.96% (11.97 pp) |
| throughput/1000/apply.duplicate         |            809.86 (68.57) |            817.41 (53.06) |  +0.93% |    +2.49% (2.62 pp) |
| throughput/5000/apply.duplicate         |            382.22 (16.04) |            382.74 (25.12) |  +0.14% |    -3.24% (4.29 pp) |
| throughput/10000/apply.duplicate        |             340.28 (6.84) |             338.3 (32.63) |  -0.58% |    -1.28% (1.54 pp) |
| throughput/15000/apply.duplicate        |            340.53 (38.06) |            352.03 (25.23) |  +3.38% |   +7.63% (17.05 pp) |
| throughput/20000/apply.duplicate        |            313.85 (47.01) |            318.57 (16.55) |  +1.50% |   +2.55% (18.11 pp) |
| throughput/25000/apply.duplicate        |            315.88 (32.02) |            336.79 (16.47) |  +6.62% |   +10.06% (6.39 pp) |
| throughput/100/apply.duplicateRemove    |         1,535.66 (170.09) |          1,392.81 (83.51) |  -9.30% |   -8.12% (11.04 pp) |
| throughput/1000/apply.duplicateRemove   |               805.94 (69) |            863.97 (74.02) |  +7.20% |    +5.04% (9.15 pp) |
| throughput/5000/apply.duplicateRemove   |             754.09 (8.03) |            762.43 (41.21) |  +1.11% |    +0.32% (6.66 pp) |
| throughput/10000/apply.duplicateRemove  |            765.89 (38.07) |            745.22 (28.65) |  -2.70% |    -2.37% (3.09 pp) |
| throughput/15000/apply.duplicateRemove  |            741.33 (107.3) |            708.82 (25.02) |  -4.39% |   -2.24% (12.94 pp) |
| throughput/20000/apply.duplicateRemove  |            685.63 (44.61) |            649.37 (62.59) |  -5.29% |     +0.58% (7.5 pp) |
| throughput/25000/apply.duplicateRemove  |            673.13 (93.42) |            726.77 (18.37) |  +7.97% |    +5.28% (10.9 pp) |
| throughput/100/apply.duplicateReplace   |           1,075.5 (164.8) |         1,178.75 (192.74) |  +9.60% |   +11.51% (7.68 pp) |
| throughput/1000/apply.duplicateReplace  |          1,039.09 (62.93) |          1,053.1 (111.92) |  +1.35% |    +2.23% (8.91 pp) |
| throughput/5000/apply.duplicateReplace  |            921.19 (45.07) |            973.28 (59.84) |  +5.65% |    +5.71% (9.82 pp) |
| throughput/10000/apply.duplicateReplace |            890.22 (12.17) |            908.25 (15.98) |  +2.03% |    +0.98% (3.09 pp) |
| throughput/15000/apply.duplicateReplace |            859.08 (39.23) |             863.2 (87.34) |  +0.48% |    +0.55% (7.44 pp) |
| throughput/20000/apply.duplicateReplace |           917.53 (173.35) |            851.66 (18.71) |  -7.18% |   -6.70% (19.15 pp) |
| throughput/25000/apply.duplicateReplace |            863.62 (40.65) |             843.58 (17.6) |  -2.32% |     -1.22% (3.2 pp) |
| throughput/100/apply.insert             |         1,674.04 (132.33) |             1,611 (92.19) |  -3.77% |     +1.36% (7.9 pp) |
| throughput/1000/apply.insert            |          1,352.43 (72.17) |           1,316.63 (72.1) |  -2.65% |   -2.65% (11.78 pp) |
| throughput/5000/apply.insert            |          1,289.37 (79.39) |         1,331.07 (104.25) |  +3.23% |   +0.53% (16.37 pp) |
| throughput/10000/apply.insert           |          1,384.4 (126.13) |         1,305.01 (117.17) |  -5.73% |   +0.77% (17.25 pp) |
| throughput/15000/apply.insert           |         1,370.18 (145.56) |          1,301.51 (27.52) |  -5.01% |     -7.04% (4.4 pp) |
| throughput/20000/apply.insert           |         1,488.57 (165.58) |          1,171.81 (27.72) | -21.28% |  -10.32% (12.19 pp) |
| throughput/25000/apply.insert           |         1,271.95 (212.71) |         1,203.44 (226.13) |  -5.39% |    -5.39% (3.23 pp) |
| throughput/100/apply.remove             |         1,955.14 (634.39) |          1,886.94 (43.09) |  -3.49% |   -4.05% (29.33 pp) |
| throughput/1000/apply.remove            |         1,616.48 (251.14) |          1,483.08 (53.34) |  -8.25% |    -5.57% (8.14 pp) |
| throughput/5000/apply.remove            |          1,499.47 (36.19) |          1,568.77 (67.67) |  +4.62% |     +2.30% (6.8 pp) |
| throughput/10000/apply.remove           |         1,442.94 (132.54) |         1,546.91 (164.01) |  +7.21% |    +0.52% (12.9 pp) |
| throughput/15000/apply.remove           |          1,563.09 (11.66) |          1,562.35 (40.07) |  -0.05% |    -3.20% (3.41 pp) |
| throughput/20000/apply.remove           |          1,607.74 (64.84) |         1,530.31 (128.82) |  -4.82% |   -5.80% (14.57 pp) |
| throughput/25000/apply.remove           |         1,558.03 (149.03) |          1,583.81 (94.19) |  +1.65% |    +3.53% (7.03 pp) |
| throughput/100/apply.replace            |            2,747 (244.46) |         2,630.43 (126.77) |  -4.24% |    -6.47% (6.28 pp) |
| throughput/1000/apply.replace           |         2,639.53 (160.08) |         2,655.09 (110.41) |  +0.59% |    -2.66% (6.02 pp) |
| throughput/5000/apply.replace           |         2,881.74 (197.13) |            2,770.9 (66.5) |  -3.85% |    -0.26% (7.19 pp) |
| throughput/10000/apply.replace          |          2,719.94 (49.73) |         2,855.27 (246.03) |  +4.98% |    +5.21% (5.76 pp) |
| throughput/15000/apply.replace          |          2,698.4 (187.59) |         2,725.83 (104.52) |  +1.02% |    +0.33% (1.79 pp) |
| throughput/20000/apply.replace          |             2,796 (148.1) |         2,727.19 (168.93) |  -2.46% |    -4.25% (3.86 pp) |
| throughput/25000/apply.replace          |         2,794.06 (139.18) |         2,633.26 (215.85) |  -5.76% |      -4.49% (11 pp) |
| throughput/100/create.empty             |           570.87 (372.64) |            573.23 (61.45) |  +0.41% |   -4.31% (42.87 pp) |
| throughput/1000/create.empty            |            704.88 (27.86) |            696.91 (70.14) |  -1.13% |    -3.11% (8.24 pp) |
| throughput/5000/create.empty            |            856.68 (45.49) |             764.91 (53.7) | -10.71% |    -8.67% (10.8 pp) |
| throughput/10000/create.empty           |            754.69 (45.75) |            726.91 (67.92) |  -3.68% |    +1.72% (5.52 pp) |
| throughput/15000/create.empty           |             785.9 (35.88) |            737.78 (19.85) |  -6.12% |    -5.85% (6.99 pp) |
| throughput/20000/create.empty           |            778.89 (67.79) |            732.62 (45.87) |  -5.94% |   -6.87% (14.15 pp) |
| throughput/25000/create.empty           |            741.69 (75.51) |           714.44 (128.78) |  -3.67% |   -3.67% (33.96 pp) |
| throughput/100/create.sequence          |          1,561.04 (69.55) |          1,570.65 (100.3) |  +0.62% |   +1.78% (14.49 pp) |
| throughput/1000/create.sequence         |         1,869.49 (160.31) |         1,764.33 (107.19) |  -5.63% |   -8.51% (12.15 pp) |
| throughput/5000/create.sequence         |          1,624.02 (49.28) |         1,553.72 (327.47) |  -4.33% |   +2.08% (19.11 pp) |
| throughput/10000/create.sequence        |          1,702.51 (79.25) |         1,621.14 (147.24) |  -4.78% |    -7.59% (2.61 pp) |
| throughput/15000/create.sequence        |          1,459.29 (89.16) |          1,451.68 (53.16) |  -0.52% |   +4.52% (14.68 pp) |
| throughput/20000/create.sequence        |          1,558.32 (70.53) |          1,462.4 (152.16) |  -6.16% |  -10.73% (18.11 pp) |
| throughput/25000/create.sequence        |           1,546.9 (119.9) |         1,553.89 (104.52) |  +0.45% |   -1.59% (22.01 pp) |
| throughput/100/insert.head              |            542.03 (29.58) |            513.55 (17.83) |  -5.25% |    -5.67% (9.04 pp) |
| throughput/1000/insert.head             |             534.06 (44.2) |            543.48 (67.67) |  +1.76% |    +3.81% (4.52 pp) |
| throughput/5000/insert.head             |            502.24 (32.43) |            541.73 (41.31) |  +7.86% |     +1.44% (9.2 pp) |
| throughput/10000/insert.head            |             500.4 (41.31) |            541.65 (33.36) |  +8.24% |   -0.10% (16.75 pp) |
| throughput/15000/insert.head            |            512.47 (26.22) |             508.24 (33.4) |  -0.83% |    -0.11% (5.88 pp) |
| throughput/20000/insert.head            |             518.31 (16.1) |            559.67 (64.16) |  +7.98% |    +2.47% (15.7 pp) |
| throughput/25000/insert.head            |            466.74 (16.64) |             501.19 (29.8) |  +7.38% |    +6.71% (8.63 pp) |
| throughput/100/insert.middle            |             592.4 (16.15) |              616.3 (31.4) |  +4.03% |    +0.00% (5.58 pp) |
| throughput/1000/insert.middle           |             603.12 (13.7) |            620.02 (45.22) |  +2.80% |    +2.89% (6.24 pp) |
| throughput/5000/insert.middle           |            612.78 (26.98) |            657.85 (68.61) |  +7.36% |     +6.68% (9.7 pp) |
| throughput/10000/insert.middle          |            648.86 (34.12) |            627.04 (11.13) |  -3.36% |    -2.04% (7.64 pp) |
| throughput/15000/insert.middle          |            569.67 (43.41) |            549.47 (19.12) |  -3.55% |    -0.06% (5.27 pp) |
| throughput/20000/insert.middle          |           665.47 (101.61) |             591.83 (2.98) | -11.07% |   -11.07% (14.4 pp) |
| throughput/25000/insert.middle          |            572.41 (30.18) |            553.58 (25.66) |  -3.29% |     -3.29% (7.6 pp) |
| throughput/100/insert.random            |             886.7 (72.86) |            911.61 (64.05) |  +2.81% |    -1.54% (9.81 pp) |
| throughput/1000/insert.random           |            947.31 (66.64) |            889.25 (78.75) |  -6.13% |    -6.13% (9.27 pp) |
| throughput/5000/insert.random           |             924.56 (7.63) |          1,062.16 (147.3) | +14.88% |  +14.87% (13.26 pp) |
| throughput/10000/insert.random          |            908.85 (31.59) |            918.48 (66.41) |  +1.06% |    +1.06% (4.05 pp) |
| throughput/15000/insert.random          |             812.25 (8.72) |            813.55 (68.17) |  +0.16% |    -0.32% (1.16 pp) |
| throughput/20000/insert.random          |              845.4 (4.25) |            878.46 (18.15) |  +3.91% |    +5.83% (6.87 pp) |
| throughput/25000/insert.random          |            830.58 (26.25) |            844.79 (76.87) |  +1.71% |   -1.12% (11.96 pp) |
| throughput/100/insert.sameIndex         |            574.67 (67.02) |            572.44 (21.85) |  -0.39% |    +0.80% (7.91 pp) |
| throughput/1000/insert.sameIndex        |             580.69 (9.73) |             568.18 (3.86) |  -2.15% |    -1.79% (3.13 pp) |
| throughput/5000/insert.sameIndex        |              582.8 (59.4) |            606.42 (19.62) |  +4.05% |    +1.12% (5.44 pp) |
| throughput/10000/insert.sameIndex       |            594.62 (83.67) |            549.25 (39.29) |  -7.63% |    -5.71% (3.41 pp) |
| throughput/15000/insert.sameIndex       |            513.41 (14.09) |            516.22 (24.65) |  +0.55% |    +2.74% (4.36 pp) |
| throughput/20000/insert.sameIndex       |            543.55 (52.01) |             547.51 (8.04) |  +0.73% |   +1.48% (11.79 pp) |
| throughput/25000/insert.sameIndex       |            508.51 (56.97) |            498.75 (18.11) |  -1.92% |    -2.66% (4.59 pp) |
| throughput/100/insert.tail              |            886.26 (10.12) |            815.04 (77.81) |  -8.04% |   +0.15% (12.81 pp) |
| throughput/1000/insert.tail             |            843.96 (78.07) |           881.27 (163.09) |  +4.42% |    +2.72% (8.84 pp) |
| throughput/5000/insert.tail             |             905.24 (35.1) |           935.95 (136.74) |  +3.39% |    +0.38% (3.86 pp) |
| throughput/10000/insert.tail            |            871.43 (42.46) |            912.42 (66.92) |  +4.70% |    +2.09% (5.89 pp) |
| throughput/15000/insert.tail            |           771.49 (139.58) |            794.96 (128.8) |  +3.04% |    +4.54% (9.76 pp) |
| throughput/20000/insert.tail            |            891.11 (67.63) |           876.79 (113.83) |  -1.61% |   -1.04% (18.04 pp) |
| throughput/25000/insert.tail            |            832.97 (94.82) |           897.57 (107.08) |  +7.76% |   +0.21% (14.83 pp) |
| throughput/100/length                   |            115.16 (11.91) |            118.67 (16.25) |  +3.05% |   +3.05% (20.25 pp) |
| throughput/1000/length                  |             112.26 (8.91) |              110.58 (3.2) |  -1.50% |   +0.65% (10.42 pp) |
| throughput/5000/length                  |             118.69 (4.05) |            120.77 (28.64) |  +1.75% |    +5.73% (8.15 pp) |
| throughput/10000/length                 |             117.77 (6.49) |             112.64 (2.54) |  -4.36% |    -1.64% (7.54 pp) |
| throughput/15000/length                 |             114.53 (2.41) |             106.25 (4.31) |  -7.23% |    -7.23% (8.44 pp) |
| throughput/20000/length                 |             107.03 (5.03) |             121.83 (7.45) | +13.83% |  +15.13% (16.21 pp) |
| throughput/25000/length                 |            119.07 (22.06) |             110.97 (7.66) |  -6.80% |   -0.77% (20.49 pp) |
| throughput/100/merge.duplicate          |            789.09 (38.44) |             799.35 (9.51) |  +1.30% |    +0.53% (3.29 pp) |
| throughput/1000/merge.duplicate         |            663.71 (44.19) |            660.24 (13.34) |  -0.52% |    -0.52% (7.98 pp) |
| throughput/5000/merge.duplicate         |            697.86 (50.78) |            648.56 (11.12) |  -7.06% |    -0.94% (6.17 pp) |
| throughput/10000/merge.duplicate        |            611.83 (43.87) |           646.34 (164.82) |  +5.64% |   +5.38% (31.71 pp) |
| throughput/15000/merge.duplicate        |            613.57 (45.74) |            595.08 (29.32) |  -3.01% |     -3.80% (8.3 pp) |
| throughput/20000/merge.duplicate        |               599 (33.83) |           617.63 (145.98) |  +3.11% |    +2.08% (6.01 pp) |
| throughput/25000/merge.duplicate        |             579.82 (6.56) |            601.72 (24.59) |  +3.78% |     +2.07% (3.2 pp) |
| throughput/100/merge.insert             |          1,786.85 (98.47) |         1,836.56 (165.69) |  +2.78% |     +3.56% (9.2 pp) |
| throughput/1000/merge.insert            |          1,566.16 (177.2) |          1,533.65 (83.75) |  -2.08% |     -0.79% (4.7 pp) |
| throughput/5000/merge.insert            |          1,624.93 (65.67) |          1,642.36 (94.15) |  +1.07% |     +0.45% (0.8 pp) |
| throughput/10000/merge.insert           |          1,550.66 (95.73) |          1,580.39 (128.6) |  +1.92% |    -2.75% (5.48 pp) |
| throughput/15000/merge.insert           |          1,499.31 (155.4) |          1,581.09 (81.57) |  +5.45% |   +3.70% (10.83 pp) |
| throughput/20000/merge.insert           |          1,537.76 (59.62) |          1,675.09 (65.38) |  +8.93% |    +4.49% (4.66 pp) |
| throughput/25000/merge.insert           |           1,343.7 (40.76) |         1,428.89 (107.33) |  +6.34% |    +6.58% (4.89 pp) |
| throughput/100/remove.head              |            731.29 (93.65) |             750.83 (71.2) |  +2.67% |    +0.94% (8.78 pp) |
| throughput/1000/remove.head             |            804.39 (50.95) |            772.15 (15.84) |  -4.01% |   -2.17% (10.14 pp) |
| throughput/5000/remove.head             |             829.3 (29.25) |            850.11 (74.69) |  +2.51% |    +0.72% (6.56 pp) |
| throughput/10000/remove.head            |             890.4 (49.87) |            872.29 (10.99) |  -2.03% |    +0.37% (8.06 pp) |
| throughput/15000/remove.head            |            896.46 (98.96) |            877.22 (51.02) |  -2.15% |   -0.00% (10.77 pp) |
| throughput/20000/remove.head            |             895.8 (50.71) |            975.13 (35.77) |  +8.86% |   +10.98% (7.73 pp) |
| throughput/25000/remove.head            |            875.59 (53.63) |            914.69 (28.24) |  +4.47% |   +4.59% (10.88 pp) |
| throughput/100/remove.middle            |           796.02 (120.16) |            763.07 (65.91) |  -4.14% |    -4.14% (6.19 pp) |
| throughput/1000/remove.middle           |             817.99 (2.95) |             795.7 (41.86) |  -2.72% |    -2.72% (3.08 pp) |
| throughput/5000/remove.middle           |            835.61 (71.35) |            837.99 (28.56) |  +0.28% |   -3.10% (11.83 pp) |
| throughput/10000/remove.middle          |            854.51 (74.63) |            841.86 (13.32) |  -1.48% |       -5.09% (6 pp) |
| throughput/15000/remove.middle          |            854.66 (23.84) |            854.97 (84.73) |  +0.04% |    +1.27% (8.12 pp) |
| throughput/20000/remove.middle          |            974.41 (66.34) |            983.85 (58.64) |  +0.97% |    +3.22% (9.65 pp) |
| throughput/25000/remove.middle          |            914.57 (26.67) |            947.03 (88.09) |  +3.55% |   +2.28% (16.23 pp) |
| throughput/100/remove.random            |          1,017.84 (66.07) |          1,038.29 (70.48) |  +2.01% |   +5.54% (16.38 pp) |
| throughput/1000/remove.random           |          1,216.14 (42.93) |           1,156.53 (54.6) |  -4.90% |    -1.16% (8.63 pp) |
| throughput/5000/remove.random           |            1,198 (129.64) |          1,203.33 (39.57) |  +0.44% |    -2.52% (10.8 pp) |
| throughput/10000/remove.random          |          1,182.55 (55.16) |          1,223.46 (93.72) |  +3.46% |    -0.83% (2.69 pp) |
| throughput/15000/remove.random          |          1,205.99 (28.71) |          1,212.75 (93.25) |  +0.56% |   -3.31% (11.57 pp) |
| throughput/20000/remove.random          |          1,223.36 (24.66) |            1,265 (270.05) |  +3.40% |   +4.96% (20.56 pp) |
| throughput/25000/remove.random          |           1,208.03 (7.36) |          1,232.38 (66.01) |  +2.02% |    +2.26% (8.02 pp) |
| throughput/100/remove.sameIndex         |            895.03 (45.23) |         1,040.11 (115.03) | +16.21% |   +16.21% (18.7 pp) |
| throughput/1000/remove.sameIndex        |            837.49 (27.31) |             789.93 (1.44) |  -5.68% |    -4.62% (6.81 pp) |
| throughput/5000/remove.sameIndex        |              861.6 (21.3) |            810.26 (19.56) |  -5.96% |    -3.88% (1.88 pp) |
| throughput/10000/remove.sameIndex       |            904.32 (76.77) |           918.72 (124.31) |  +1.59% |    +5.51% (6.32 pp) |
| throughput/15000/remove.sameIndex       |            835.26 (26.21) |            846.22 (22.73) |  +1.31% |     +1.91% (7.7 pp) |
| throughput/20000/remove.sameIndex       |            921.95 (96.59) |         1,016.83 (209.01) | +10.29% |  +10.29% (35.01 pp) |
| throughput/25000/remove.sameIndex       |            897.01 (39.58) |            875.08 (94.43) |  -2.44% |    -0.61% (7.84 pp) |
| throughput/100/remove.tail              |           725.99 (179.16) |             779.09 (97.4) |  +7.31% |   +7.31% (38.68 pp) |
| throughput/1000/remove.tail             |             728.15 (29.3) |            703.91 (18.08) |  -3.33% |    -4.85% (1.03 pp) |
| throughput/5000/remove.tail             |            723.15 (50.13) |            755.81 (15.87) |  +4.52% |    -1.75% (9.03 pp) |
| throughput/10000/remove.tail            |            763.38 (23.23) |            758.75 (31.44) |  -0.61% |    -0.61% (5.02 pp) |
| throughput/15000/remove.tail            |           779.79 (140.66) |            791.32 (45.66) |  +1.48% |   -2.43% (22.65 pp) |
| throughput/20000/remove.tail            |            855.77 (58.49) |            912.65 (92.15) |  +6.65% |   +6.65% (13.93 pp) |
| throughput/25000/remove.tail            |            839.37 (37.29) |            817.65 (18.52) |  -2.59% |   -2.59% (11.01 pp) |
| throughput/100/replace.head             |          1,082.69 (90.71) |          1,060.73 (48.48) |  -2.03% |    -0.56% (3.42 pp) |
| throughput/1000/replace.head            |           1,167.17 (10.5) |         1,153.93 (165.84) |  -1.13% |    -1.14% (4.73 pp) |
| throughput/5000/replace.head            |          1,183.11 (77.15) |          1,158.98 (79.55) |  -2.04% |    -0.08% (6.09 pp) |
| throughput/10000/replace.head           |         1,167.75 (103.52) |          1,154.72 (32.29) |  -1.12% |    -4.49% (6.64 pp) |
| throughput/15000/replace.head           |          1,157.3 (143.04) |         1,127.25 (103.48) |  -2.60% |   -3.83% (23.15 pp) |
| throughput/20000/replace.head           |           1,323.94 (65.7) |         1,260.09 (125.78) |  -4.82% |   -4.45% (11.55 pp) |
| throughput/25000/replace.head           |          1,150.08 (40.78) |         1,256.76 (121.05) |  +9.28% |   +10.61% (7.14 pp) |
| throughput/100/replace.middle           |          1,117.58 (61.06) |          1,053.99 (65.49) |  -5.69% |   -1.32% (11.53 pp) |
| throughput/1000/replace.middle          |           1,222.63 (7.99) |          1,257.25 (97.93) |  +2.83% |    -1.80% (6.68 pp) |
| throughput/5000/replace.middle          |          1,214.84 (75.01) |          1,188.33 (13.43) |  -2.18% |    -2.37% (6.92 pp) |
| throughput/10000/replace.middle         |          1,217.52 (19.73) |          1,227.66 (18.92) |  +0.83% |    -0.05% (2.42 pp) |
| throughput/15000/replace.middle         |           1,185.31 (3.97) |          1,203.53 (89.32) |  +1.54% |    +1.49% (4.67 pp) |
| throughput/20000/replace.middle         |          1,293.64 (79.81) |          1,350.54 (40.62) |  +4.40% |   +4.40% (18.02 pp) |
| throughput/25000/replace.middle         |          1,197.9 (102.95) |         1,320.79 (156.45) | +10.26% |    +2.73% (1.87 pp) |
| throughput/100/replace.random           |          1,636.1 (106.49) |         1,629.13 (150.59) |  -0.43% |    -1.58% (9.81 pp) |
| throughput/1000/replace.random          |          1,782.41 (62.65) |          1,959.85 (76.41) |  +9.96% |    +9.09% (2.53 pp) |
| throughput/5000/replace.random          |          1,777.81 (43.53) |           1,740.3 (37.34) |  -2.11% |    -0.64% (5.36 pp) |
| throughput/10000/replace.random         |         1,718.98 (103.48) |         1,810.98 (221.73) |  +5.35% |   +5.95% (11.79 pp) |
| throughput/15000/replace.random         |         1,687.69 (211.83) |          1,693.65 (31.68) |  +0.35% |   +0.35% (10.87 pp) |
| throughput/20000/replace.random         |          1,937.61 (159.5) |         1,953.06 (175.87) |  +0.80% |     +3.47% (7.2 pp) |
| throughput/25000/replace.random         |           1,748.78 (85.1) |         1,752.59 (276.62) |  +0.22% |    -1.52% (15.3 pp) |
| throughput/100/replace.sameIndex        |          1,118.9 (231.36) |          1,044.14 (77.64) |  -6.68% |   -7.25% (14.32 pp) |
| throughput/1000/replace.sameIndex       |          1,110.42 (87.64) |          1,159.02 (79.16) |  +4.38% |     +3.96% (5.7 pp) |
| throughput/5000/replace.sameIndex       |           1,127.5 (39.97) |           1,191.8 (96.72) |  +5.70% |    +2.92% (3.17 pp) |
| throughput/10000/replace.sameIndex      |           1,173.59 (77.2) |          1,171.43 (49.41) |  -0.18% |     -2.00% (9.4 pp) |
| throughput/15000/replace.sameIndex      |          1,153.78 (47.74) |           1,108.9 (75.34) |  -3.89% |    -1.87% (4.38 pp) |
| throughput/20000/replace.sameIndex      |          1,203.27 (39.71) |          1,259.14 (40.75) |  +4.64% |    +4.67% (5.65 pp) |
| throughput/25000/replace.sameIndex      |           1,176.9 (61.77) |          1,183.07 (72.09) |  +0.52% |      -0.32% (11 pp) |
| throughput/100/replace.tail             |          1,065.9 (107.76) |          1,091.98 (91.42) |  +2.45% |    +1.41% (2.58 pp) |
| throughput/1000/replace.tail            |          1,193.02 (46.68) |          1,205.21 (97.06) |  +1.02% |   -2.57% (12.33 pp) |
| throughput/5000/replace.tail            |           1,196.33 (7.24) |          1,182.04 (52.24) |  -1.19% |    -0.71% (2.23 pp) |
| throughput/10000/replace.tail           |          1,210.76 (24.79) |          1,144.64 (16.44) |  -5.46% |    -5.46% (0.58 pp) |
| throughput/15000/replace.tail           |         1,136.47 (103.45) |          1,136.39 (59.19) |  -0.01% |    -0.71% (3.87 pp) |
| throughput/20000/replace.tail           |         1,273.11 (137.17) |           1,315.9 (57.84) |  +3.36% |    -6.92% (17.2 pp) |
| throughput/25000/replace.tail           |          1,218.95 (42.17) |         1,267.59 (114.65) |  +3.99% |    +3.99% (8.87 pp) |
| throughput/100/retire                   |            191.79 (44.56) |             193.39 (4.59) |  +0.83% |   +3.40% (17.45 pp) |
| throughput/1000/retire                  |             209.63 (7.05) |             219.19 (7.42) |  +4.56% |    +3.46% (9.32 pp) |
| throughput/5000/retire                  |             207.74 (1.67) |             207.28 (1.62) |  -0.22% |    +0.54% (5.39 pp) |
| throughput/10000/retire                 |               207 (11.67) |             197.13 (9.26) |  -4.77% |    -1.09% (1.89 pp) |
| throughput/15000/retire                 |              192.59 (3.6) |             199.27 (8.92) |  +3.47% |    +1.86% (5.56 pp) |
| throughput/20000/retire                 |            190.85 (10.07) |             196.59 (8.76) |  +3.01% |    -2.80% (9.77 pp) |
| throughput/25000/retire                 |            186.94 (14.69) |             181.82 (3.53) |  -2.74% |    -1.15% (1.53 pp) |
| throughput/100/sequence                 |             279.93 (7.32) |            305.04 (59.96) |  +8.97% |  +11.53% (21.04 pp) |
| throughput/1000/sequence                |            303.66 (28.64) |            310.04 (11.77) |  +2.10% |    +0.39% (4.38 pp) |
| throughput/5000/sequence                |             276.84 (3.24) |             280.19 (11.5) |  +1.21% |    +1.26% (0.96 pp) |
| throughput/10000/sequence               |             272.35 (3.09) |            290.03 (24.97) |  +6.49% |    +6.44% (1.12 pp) |
| throughput/15000/sequence               |             271.05 (5.54) |            260.88 (12.79) |  -3.75% |    -1.73% (3.87 pp) |
| throughput/20000/sequence               |             255.91 (4.01) |            268.11 (14.32) |  +4.77% |    -0.01% (6.75 pp) |
| throughput/25000/sequence               |            254.22 (23.43) |            259.94 (12.68) |  +2.25% |   -1.59% (16.25 pp) |
| throughput/100/value.head               |            173.29 (11.08) |            176.02 (27.79) |  +1.58% |    +1.58% (11.2 pp) |
| throughput/1000/value.head              |             164.46 (6.92) |             166.05 (3.34) |  +0.97% |    -0.37% (2.61 pp) |
| throughput/5000/value.head              |             144.73 (3.78) |             149.02 (4.01) |  +2.96% |    +4.44% (1.79 pp) |
| throughput/10000/value.head             |            147.25 (12.28) |             154.3 (10.85) |  +4.79% |    +8.18% (2.89 pp) |
| throughput/15000/value.head             |              130.59 (8.9) |             133.61 (2.65) |  +2.31% |   +2.31% (11.23 pp) |
| throughput/20000/value.head             |             136.09 (10.3) |              136.3 (3.76) |  +0.15% |     +2.71% (2.7 pp) |
| throughput/25000/value.head             |             129.01 (8.78) |             131.09 (9.38) |  +1.61% |   +3.73% (11.95 pp) |
| throughput/100/value.middle             |            231.72 (34.88) |            226.77 (20.93) |  -2.14% |    -0.07% (6.59 pp) |
| throughput/1000/value.middle            |             247.88 (8.82) |            250.32 (25.59) |  +0.98% |     -0.90% (1.9 pp) |
| throughput/5000/value.middle            |             226.45 (5.51) |            227.04 (11.05) |  +0.26% |    +0.39% (9.54 pp) |
| throughput/10000/value.middle           |            215.68 (12.24) |             216.91 (8.25) |  +0.57% |    +0.87% (9.48 pp) |
| throughput/15000/value.middle           |             212.58 (8.13) |             216.33 (8.56) |  +1.76% |    +2.40% (7.43 pp) |
| throughput/20000/value.middle           |             213.66 (5.69) |             209.74 (9.25) |  -1.83% |    -0.36% (8.11 pp) |
| throughput/25000/value.middle           |             203.75 (8.34) |             202.96 (4.38) |  -0.39% |     -0.37% (8.3 pp) |
| throughput/100/value.random             |             195.46 (33.4) |            188.68 (36.14) |  -3.47% |    -2.57% (5.26 pp) |
| throughput/1000/value.random            |              222.53 (2.9) |            229.48 (40.12) |  +3.12% |    -0.00% (5.96 pp) |
| throughput/5000/value.random            |            270.95 (23.61) |            269.54 (11.47) |  -0.52% |    -5.01% (5.97 pp) |
| throughput/10000/value.random           |            288.62 (35.81) |            296.79 (23.72) |  +2.83% |   -4.52% (22.74 pp) |
| throughput/15000/value.random           |            253.67 (13.48) |            263.05 (19.87) |  +3.70% |     +0.53% (9.3 pp) |
| throughput/20000/value.random           |              285.97 (7.5) |             270.9 (16.78) |  -5.27% |    -9.15% (9.51 pp) |
| throughput/25000/value.random           |            284.99 (35.64) |            265.11 (10.94) |  -6.98% |   -3.48% (15.31 pp) |
| throughput/100/value.sameIndex          |             177.4 (20.65) |             176.6 (31.51) |  -0.45% |   +1.79% (10.94 pp) |
| throughput/1000/value.sameIndex         |             183.01 (2.81) |              180.9 (13.5) |  -1.15% |    -1.15% (2.87 pp) |
| throughput/5000/value.sameIndex         |             171.99 (5.05) |            170.15 (15.03) |  -1.07% |    +3.75% (6.79 pp) |
| throughput/10000/value.sameIndex        |             174.81 (6.73) |             170.23 (6.04) |  -2.62% |    -3.55% (6.41 pp) |
| throughput/15000/value.sameIndex        |             165.53 (6.04) |             172.59 (9.78) |  +4.27% |    +4.20% (1.48 pp) |
| throughput/20000/value.sameIndex        |             166.14 (2.92) |            165.77 (15.28) |  -0.22% |    +1.03% (3.29 pp) |
| throughput/25000/value.sameIndex        |              155.08 (5.5) |             154.39 (5.31) |  -0.44% |    -0.01% (2.56 pp) |
| throughput/100/value.tail               |               214 (38.56) |            239.37 (53.13) | +11.86% |   -4.79% (28.84 pp) |
| throughput/1000/value.tail              |             217.43 (2.52) |            222.78 (14.13) |  +2.46% |    +2.46% (5.34 pp) |
| throughput/5000/value.tail              |             196.83 (3.01) |             212.84 (17.2) |  +8.13% |    +8.13% (3.22 pp) |
| throughput/10000/value.tail             |              189.4 (9.89) |            192.75 (15.16) |  +1.77% |    +0.22% (8.35 pp) |
| throughput/15000/value.tail             |             184.58 (7.92) |            186.23 (20.71) |  +0.89% |   +1.71% (15.92 pp) |
| throughput/20000/value.tail             |               196.66 (15) |             184.94 (13.2) |  -5.96% |    -1.42% (4.52 pp) |
| throughput/25000/value.tail             |             173.04 (9.62) |            170.04 (12.12) |  -1.73% |    +1.01% (5.33 pp) |
| throughput/100/values                   |         4,823.06 (815.71) |         4,981.83 (180.27) |  +3.29% |     +1.64% (8.7 pp) |
| throughput/1000/values                  |    167,014.38 (17,938.81) |     164,926.41 (6,443.59) |  -1.25% |      -1.25% (15 pp) |
| throughput/5000/values                  |    582,131.77 (81,727.86) |     526,128.13 (2,230.73) |  -9.62% |    +0.33% (13.4 pp) |
| throughput/10000/values                 |  1,212,939.06 (32,163.28) |  1,213,534.38 (94,710.94) |  +0.05% |   +7.75% (10.35 pp) |
| throughput/15000/values                 | 1,917,440.63 (140,028.13) |  1,715,093.75 (56,717.19) | -10.55% |    -8.92% (2.84 pp) |
| throughput/20000/values                 |     2,483,975 (190,137.5) | 2,763,132.81 (300,404.69) | +11.24% |   +2.29% (13.11 pp) |
| throughput/25000/values                 | 3,067,456.25 (143,410.94) | 3,088,756.25 (496,992.19) |  +0.69% |    +1.40% (3.69 pp) |
| throughput/100/values.head              |            311.16 (80.68) |            307.97 (37.48) |  -1.03% |   -9.86% (27.44 pp) |
| throughput/1000/values.head             |           274.72 (137.56) |           290.89 (131.56) |  +5.89% |   +5.89% (81.28 pp) |
| throughput/5000/values.head             |            290.01 (17.19) |             296.1 (11.43) |  +2.10% |    -1.17% (5.08 pp) |
| throughput/10000/values.head            |            305.62 (25.19) |            275.26 (14.26) |  -9.93% |   -5.08% (10.89 pp) |
| throughput/15000/values.head            |            279.24 (25.63) |            274.81 (22.14) |  -1.59% |   -1.59% (17.26 pp) |
| throughput/20000/values.head            |            279.15 (17.03) |            278.48 (81.48) |  -0.24% |   +4.45% (30.54 pp) |
| throughput/25000/values.head            |            258.06 (13.99) |            253.75 (21.01) |  -1.67% |    +0.09% (6.38 pp) |
| throughput/100/values.middle            |            293.89 (12.55) |            304.91 (37.69) |  +3.75% |   +3.75% (18.45 pp) |
| throughput/1000/values.middle           |              267.75 (8.9) |             272.01 (3.44) |  +1.59% |    -0.26% (4.21 pp) |
| throughput/5000/values.middle           |             281.54 (19.3) |            298.98 (20.07) |  +6.19% |   +5.95% (11.94 pp) |
| throughput/10000/values.middle          |            274.47 (31.05) |            277.93 (26.56) |  +1.26% |    -2.13% (7.15 pp) |
| throughput/15000/values.middle          |                235 (9.64) |            241.53 (29.33) |  +2.78% |   +2.78% (10.62 pp) |
| throughput/20000/values.middle          |            256.79 (51.89) |            286.07 (38.87) | +11.40% |  +12.61% (20.17 pp) |
| throughput/25000/values.middle          |            248.99 (22.91) |             232.82 (7.72) |  -6.49% |    -4.03% (7.04 pp) |
| throughput/100/values.random            |            298.93 (26.08) |           311.65 (109.77) |  +4.26% |  +10.74% (23.77 pp) |
| throughput/1000/values.random           |            296.52 (16.26) |            308.34 (34.71) |  +3.99% |   +4.87% (17.11 pp) |
| throughput/5000/values.random           |            335.87 (28.51) |            313.65 (16.47) |  -6.62% |    -3.20% (5.16 pp) |
| throughput/10000/values.random          |            392.88 (47.63) |              354.5 (40.7) |  -9.77% |   -4.81% (12.56 pp) |
| throughput/15000/values.random          |            359.56 (10.85) |            359.59 (43.14) |  +0.01% |    +3.53% (1.62 pp) |
| throughput/20000/values.random          |             403.7 (37.08) |             402.5 (28.24) |  -0.30% |    +3.99% (15.9 pp) |
| throughput/25000/values.random          |            370.49 (12.62) |            389.59 (38.96) |  +5.16% |   +9.16% (14.05 pp) |
| throughput/100/values.sameIndex         |             267.4 (31.03) |             313.11 (47.9) | +17.09% |   +8.60% (13.88 pp) |
| throughput/1000/values.sameIndex        |            272.35 (16.22) |            281.06 (44.68) |  +3.20% |   +5.58% (20.25 pp) |
| throughput/5000/values.sameIndex        |            260.59 (14.26) |              265.4 (2.21) |  +1.85% |    +3.23% (3.19 pp) |
| throughput/10000/values.sameIndex       |            289.98 (18.21) |             254.7 (16.87) | -12.17% |   -9.27% (10.67 pp) |
| throughput/15000/values.sameIndex       |             250.1 (15.06) |              231.6 (4.79) |  -7.40% |    -9.39% (1.77 pp) |
| throughput/20000/values.sameIndex       |            268.75 (27.57) |             255.21 (71.1) |  -5.04% |   +6.58% (23.18 pp) |
| throughput/25000/values.sameIndex       |            233.08 (14.53) |            241.03 (27.45) |  +3.41% |    +3.41% (3.85 pp) |
| throughput/100/values.tail              |            268.82 (19.06) |            300.91 (49.75) | +11.94% |   +5.65% (16.05 pp) |
| throughput/1000/values.tail             |              270.3 (19.3) |            280.85 (20.34) |  +3.90% |   -0.48% (12.33 pp) |
| throughput/5000/values.tail             |             248.84 (7.13) |            250.36 (12.31) |  +0.61% |    +1.66% (7.65 pp) |
| throughput/10000/values.tail            |            279.05 (69.38) |               274 (44.86) |  -1.81% |    -9.05% (8.94 pp) |
| throughput/15000/values.tail            |            241.12 (28.52) |            232.99 (17.41) |  -3.37% |    -4.84% (17.1 pp) |
| throughput/20000/values.tail            |            264.06 (10.44) |            278.14 (57.44) |  +5.33% |   +5.33% (23.94 pp) |
| throughput/25000/values.tail            |              226.3 (4.53) |            235.55 (14.28) |  +4.09% |     +4.09% (9.6 pp) |
| lifecycle/scaleUp/apply.random          |         3,859.27 (104.02) |         3,928.06 (294.36) |  +1.78% |    +0.55% (8.71 pp) |
| lifecycle/scaleUp/insert.head           |            830.56 (74.01) |             834.7 (51.74) |  +0.50% |   -5.43% (11.59 pp) |
| lifecycle/scaleUp/insert.random         |          1,759.32 (72.42) |         1,791.59 (105.29) |  +1.83% |   -0.82% (14.06 pp) |
| lifecycle/scaleUp/insert.tail           |            776.14 (63.99) |           829.96 (113.58) |  +6.93% |   -2.43% (11.97 pp) |
| lifecycle/scaleUp/remove.random         |          2,790.48 (80.38) |         2,707.76 (424.62) |  -2.96% |    -1.00% (2.29 pp) |
| lifecycle/scaleUp/replace.head          |         2,638.07 (685.66) |         2,784.33 (274.64) |  +5.54% |    -4.67% (7.97 pp) |
| lifecycle/scaleUp/replace.random        |          3,566.24 (121.1) |         3,472.05 (117.08) |  -2.64% |    -5.11% (4.64 pp) |
| lifecycle/scaleUp/replace.tail          |         2,410.24 (187.37) |         2,307.88 (686.39) |  -4.25% |   -3.04% (32.47 pp) |
| lifecycle/scaleUp/value.head            |              324.54 (6.5) |             339.04 (18.7) |  +4.47% |    +3.29% (6.74 pp) |
| lifecycle/scaleUp/value.random          |          1,140.64 (22.07) |          1,117.51 (11.04) |  -2.03% |    -0.82% (3.73 pp) |
| lifecycle/scaleUp/value.tail            |            152.91 (12.63) |             156.83 (5.98) |  +2.56% |    +2.56% (9.71 pp) |
| lifecycle/scaleDown/apply.random        |         3,585.48 (199.64) |         3,474.97 (107.23) |  -3.08% |    -3.08% (6.58 pp) |
| lifecycle/scaleDown/insert.random       |          1,701.21 (58.45) |          1,724.23 (47.91) |  +1.35% |    +1.35% (6.14 pp) |
| lifecycle/scaleDown/remove.head         |         1,870.58 (137.84) |          1,914.57 (23.19) |  +2.35% |    +2.08% (6.67 pp) |
| lifecycle/scaleDown/remove.random       |         2,600.61 (108.54) |          2,649.63 (29.57) |  +1.88% |    +1.88% (5.17 pp) |
| lifecycle/scaleDown/remove.tail         |         1,691.47 (131.72) |          1,710.01 (20.04) |  +1.10% |    +0.37% (7.02 pp) |
| lifecycle/scaleDown/replace.head        |         2,849.73 (300.98) |          2,442.12 (98.46) | -14.30% |   -12.90% (7.56 pp) |
| lifecycle/scaleDown/replace.random      |         3,238.55 (492.94) |         3,158.97 (158.56) |  -2.46% |    +0.56% (2.09 pp) |
| lifecycle/scaleDown/replace.tail        |        18,795.79 (132.46) |      19,566.03 (1,248.77) |  +4.10% |    -0.62% (6.12 pp) |
| lifecycle/scaleDown/value.head          |            420.68 (13.51) |             411.73 (4.84) |  -2.13% |    -2.40% (1.79 pp) |
| lifecycle/scaleDown/value.random        |            1,051.01 (6.7) |           1,072.35 (17.1) |  +2.03% |    +1.45% (0.73 pp) |
| lifecycle/scaleDown/value.tail          |              232.8 (5.33) |             237.26 (8.34) |  +1.92% |     +0.90% (5.4 pp) |
| lifecycle/fullLifecycle/apply.random    |          3,786.2 (125.83) |          3,741.97 (91.04) |  -1.17% |    +2.57% (4.95 pp) |
| lifecycle/fullLifecycle/insert.head     |            830.56 (74.01) |             834.7 (51.74) |  +0.50% |   -5.43% (11.59 pp) |
| lifecycle/fullLifecycle/insert.random   |          1,743.33 (38.42) |          1,762.09 (91.71) |  +1.08% |    +0.67% (9.62 pp) |
| lifecycle/fullLifecycle/insert.tail     |            776.14 (63.99) |           829.96 (113.58) |  +6.93% |   -2.43% (11.97 pp) |
| lifecycle/fullLifecycle/remove.head     |         1,870.58 (137.84) |          1,914.57 (23.19) |  +2.35% |    +2.08% (6.67 pp) |
| lifecycle/fullLifecycle/remove.random   |           2,704.91 (78.8) |          2,678.7 (359.03) |  -0.97% |    -0.12% (1.74 pp) |
| lifecycle/fullLifecycle/remove.tail     |         1,691.47 (131.72) |          1,710.01 (20.04) |  +1.10% |    +0.37% (7.02 pp) |
| lifecycle/fullLifecycle/replace.head    |          2,698.9 (298.81) |         2,613.22 (205.92) |  -3.17% |    -9.22% (5.76 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,396.95 (211.99) |         3,321.25 (284.04) |  -2.23% |    -3.27% (3.97 pp) |
| lifecycle/fullLifecycle/replace.tail    |        10,627.66 (167.51) |         10,920.01 (334.3) |  +2.75% |    +3.28% (8.08 pp) |
| lifecycle/fullLifecycle/value.head      |             373.78 (5.88) |            375.66 (15.07) |  +0.50% |     +0.50% (3.5 pp) |
| lifecycle/fullLifecycle/value.random    |             1,102.97 (25) |           1,090.79 (1.38) |  -1.10% |    +0.40% (1.73 pp) |
| lifecycle/fullLifecycle/value.tail      |             193.44 (4.35) |             197.18 (9.85) |  +1.93% |    +0.95% (5.17 pp) |
| checkpoint/up/1000/create               |         438,700 (208,500) |          380,100 (21,700) | -13.36% |  -13.36% (31.07 pp) |
| checkpoint/up/1000/sequence             |       2,866,000 (400,400) |        2,549,200 (50,000) | -11.05% |  -14.04% (16.44 pp) |
| checkpoint/up/1000/values               |       1,988,300 (259,700) |       1,772,000 (110,500) | -10.88% |  -10.88% (11.11 pp) |
| checkpoint/up/5000/create               |          935,800 (36,900) |          914,700 (81,000) |  -2.25% |   -4.01% (10.88 pp) |
| checkpoint/up/5000/sequence             |     9,661,800 (1,471,100) |       8,064,700 (395,600) | -16.53% |   -8.16% (15.04 pp) |
| checkpoint/up/5000/values               |     5,816,500 (1,003,400) |       5,043,600 (468,000) | -13.29% |  -17.34% (16.32 pp) |
| checkpoint/up/10000/create              |        1,563,100 (80,500) |         1,555,600 (6,900) |  -0.48% |    -0.45% (9.94 pp) |
| checkpoint/up/10000/sequence            |    12,855,900 (1,196,600) |      13,317,900 (335,100) |  +3.59% |   +2.03% (10.75 pp) |
| checkpoint/up/10000/values              |      20,681,900 (629,000) |    19,904,000 (1,922,600) |  -3.76% |   -1.61% (10.07 pp) |
| checkpoint/up/15000/create              |       2,420,900 (143,000) |       2,445,000 (118,500) |  +1.00% |    +0.56% (8.58 pp) |
| checkpoint/up/15000/sequence            |      14,739,600 (304,100) |      14,980,600 (280,100) |  +1.64% |    +1.31% (1.03 pp) |
| checkpoint/up/15000/values              |       29,781,200 (88,400) |    30,977,300 (1,414,700) |  +4.02% |    +4.02% (6.17 pp) |
| checkpoint/up/20000/create              |       3,464,800 (243,800) |       3,394,700 (243,200) |  -2.02% |    +2.55% (5.42 pp) |
| checkpoint/up/20000/sequence            |    21,664,500 (2,007,700) |    22,064,900 (1,058,900) |  +1.85% |    +5.70% (8.63 pp) |
| checkpoint/up/20000/values              |      11,142,200 (727,400) |    11,654,400 (1,537,700) |  +4.60% |    +0.28% (8.51 pp) |
| checkpoint/up/25000/create              |       4,061,800 (214,200) |       4,114,100 (310,100) |  +1.29% |     +0.25% (8.3 pp) |
| checkpoint/up/25000/sequence            |      23,898,800 (404,400) |      23,713,800 (416,700) |  -0.77% |    -1.38% (0.78 pp) |
| checkpoint/up/25000/values              |       12,024,000 (89,100) |      12,028,100 (515,000) |  +0.03% |    +1.29% (5.84 pp) |
| checkpoint/down/20000/create            |        3,441,300 (32,700) |       3,521,900 (131,800) |  +2.34% |    +0.09% (3.99 pp) |
| checkpoint/down/20000/sequence          |      19,166,300 (123,000) |      19,379,600 (912,800) |  +1.11% |    +1.55% (4.97 pp) |
| checkpoint/down/20000/values            |     9,355,000 (1,044,800) |       9,167,400 (459,500) |  -2.01% |   -3.88% (10.69 pp) |
| checkpoint/down/15000/create            |        2,394,600 (37,600) |        2,431,200 (56,300) |  +1.53% |    -0.10% (4.45 pp) |
| checkpoint/down/15000/sequence          |      15,958,000 (779,200) |      15,524,900 (772,600) |  -2.71% |   -5.46% (11.88 pp) |
| checkpoint/down/15000/values            |     7,756,400 (1,437,000) |       7,651,400 (347,500) |  -1.35% |   +2.62% (20.99 pp) |
| checkpoint/down/10000/create            |        1,702,800 (64,700) |        1,695,200 (24,200) |  -0.45% |    -0.81% (6.16 pp) |
| checkpoint/down/10000/sequence          |    13,437,400 (1,440,400) |    12,391,100 (1,007,500) |  -7.79% |    -1.11% (2.21 pp) |
| checkpoint/down/10000/values            |        5,878,900 (73,400) |       6,056,700 (949,100) |  +3.02% |    +2.83% (9.77 pp) |
| checkpoint/down/5000/create             |          825,000 (31,400) |          894,200 (92,600) |  +8.39% |    +8.39% (16.1 pp) |
| checkpoint/down/5000/sequence           |       9,507,100 (419,000) |       9,380,200 (528,900) |  -1.33% |    -2.98% (5.54 pp) |
| checkpoint/down/5000/values             |       3,054,000 (138,600) |       2,859,200 (524,000) |  -6.38% |   -5.04% (14.44 pp) |
| checkpoint/down/1000/create             |          158,300 (21,200) |          162,100 (34,500) |  +2.40% |   +6.23% (30.11 pp) |
| checkpoint/down/1000/sequence           |       6,206,500 (467,200) |     6,373,300 (1,109,200) |  +2.69% |   +7.52% (14.63 pp) |
| checkpoint/down/1000/values             |           532,100 (9,900) |          541,300 (70,400) |  +1.73% |   +8.59% (11.24 pp) |
| checkpoint/down/0/create                |            14,900 (1,900) |            14,100 (1,100) |  -5.37% |    -0.74% (4.66 pp) |
| checkpoint/down/0/sequence              |       1,574,100 (260,900) |        1,315,200 (91,600) | -16.45% |   -13.32% (9.53 pp) |
| checkpoint/down/0/values                |            11,600 (1,200) |               9,900 (900) | -14.66% |   -20.72% (7.08 pp) |
| tuple/projection/2/create.empty         |            355.38 (42.87) |            362.03 (11.36) |  +1.87% |   -0.87% (13.37 pp) |
| tuple/tuple/2/create.empty              |            440.04 (21.49) |            414.98 (26.65) |  -5.70% |    -6.82% (3.27 pp) |
| tuple/projection/2/create.sequence      |          1,252.73 (25.34) |          1,319.81 (87.52) |  +5.35% |   +4.15% (12.37 pp) |
| tuple/tuple/2/create.sequence           |          1,417.32 (235.1) |          1,416.64 (23.02) |  -0.05% |   +0.59% (22.13 pp) |
| tuple/projection/2/replace.random       |            988.85 (91.98) |         1,041.91 (120.63) |  +5.37% |    -0.91% (9.53 pp) |
| tuple/tuple/2/replace.random            |            708.07 (39.36) |             664.52 (40.5) |  -6.15% |    -4.31% (2.67 pp) |
| tuple/projection/2/apply.replace        |         1,799.84 (119.18) |          1,803.1 (136.69) |  +0.18% |    -2.35% (4.28 pp) |
| tuple/tuple/2/apply.replace             |          1,221.64 (42.86) |          1,204.88 (51.49) |  -1.37% |   -1.37% (11.59 pp) |
| tuple/projection/2/apply.duplicate      |            608.47 (67.03) |            631.65 (32.05) |  +3.81% |   +4.91% (11.72 pp) |
| tuple/tuple/2/apply.duplicate           |            622.22 (12.28) |             645.17 (7.46) |  +3.69% |    +1.27% (3.32 pp) |
| tuple/projection/2/merge.duplicate      |            679.08 (45.68) |            665.89 (21.17) |  -1.94% |    -5.31% (8.04 pp) |
| tuple/tuple/2/merge.duplicate           |            699.48 (45.62) |            689.95 (53.95) |  -1.36% |   +2.60% (19.73 pp) |
| tuple/projection/2/length               |                7.52 (0.2) |               7.36 (0.35) |  -2.10% |    +1.42% (2.78 pp) |
| tuple/tuple/2/length                    |               7.29 (0.26) |               7.22 (0.09) |  -1.03% |    -1.03% (6.95 pp) |
| tuple/projection/2/value.random         |              28.51 (1.52) |               29.5 (1.29) |  +3.48% |    +3.48% (7.49 pp) |
| tuple/tuple/2/value.random              |               18.6 (0.98) |              18.53 (0.63) |  -0.37% |   +0.01% (11.93 pp) |
| tuple/projection/2/values               |               77.46 (2.6) |              76.19 (2.76) |  -1.65% |    +1.03% (7.89 pp) |
| tuple/tuple/2/values                    |              79.88 (2.24) |              77.55 (0.95) |  -2.91% |    -0.96% (8.99 pp) |
| tuple/projection/2/sequence             |             452.32 (5.08) |               455.95 (27) |  +0.80% |    -1.10% (7.12 pp) |
| tuple/tuple/2/sequence                  |            504.32 (17.79) |            515.42 (68.41) |  +2.20% |   +2.20% (28.92 pp) |
| tuple/projection/4/create.empty         |             410.53 (6.39) |            416.96 (15.17) |  +1.57% |   +2.43% (12.46 pp) |
| tuple/tuple/4/create.empty              |             440.6 (18.13) |            436.08 (23.77) |  -1.03% |    +0.42% (6.96 pp) |
| tuple/projection/4/create.sequence      |         1,676.05 (111.57) |          1,625.77 (93.44) |  -3.00% |   -0.85% (10.14 pp) |
| tuple/tuple/4/create.sequence           |          1,600.33 (87.21) |          1,604.89 (36.34) |  +0.29% |   +1.38% (15.03 pp) |
| tuple/projection/4/replace.random       |          1,236.64 (70.43) |           1,150.54 (6.19) |  -6.96% |    -5.95% (6.78 pp) |
| tuple/tuple/4/replace.random            |            654.46 (24.55) |            645.83 (43.71) |  -1.32% |    +2.23% (6.38 pp) |
| tuple/projection/4/apply.replace        |          1,756.09 (54.93) |            1,680.1 (44.4) |  -4.33% |     -4.33% (7.5 pp) |
| tuple/tuple/4/apply.replace             |          1,049.27 (61.62) |          1,081.18 (28.26) |  +3.04% |    -0.49% (8.24 pp) |
| tuple/projection/4/apply.duplicate      |            579.26 (17.58) |            604.47 (27.68) |  +4.35% |    +3.35% (3.11 pp) |
| tuple/tuple/4/apply.duplicate           |            606.12 (22.27) |             614.96 (32.9) |  +1.46% |    +4.52% (7.94 pp) |
| tuple/projection/4/merge.duplicate      |            729.35 (55.46) |             762.96 (28.3) |  +4.61% |     +1.99% (9.7 pp) |
| tuple/tuple/4/merge.duplicate           |             834.01 (46.9) |            795.99 (17.44) |  -4.56% |    -5.17% (7.33 pp) |
| tuple/projection/4/length               |              26.11 (2.55) |               26.9 (2.01) |  +3.04% |   +5.16% (11.69 pp) |
| tuple/tuple/4/length                    |               26.4 (2.82) |              26.22 (1.56) |  -0.65% |   +4.58% (14.58 pp) |
| tuple/projection/4/value.random         |              40.63 (0.36) |               43.5 (6.68) |  +7.07% |   +6.29% (21.36 pp) |
| tuple/tuple/4/value.random              |              18.61 (1.82) |               19.08 (0.5) |  +2.50% |    -0.32% (3.67 pp) |
| tuple/projection/4/values               |             145.1 (10.28) |            147.26 (12.53) |  +1.49% |    +3.59% (3.59 pp) |
| tuple/tuple/4/values                    |                143 (8.53) |             146.16 (5.67) |  +2.21% |   +2.01% (13.14 pp) |
| tuple/projection/4/sequence             |             456.89 (8.16) |            455.18 (67.44) |  -0.38% |   +1.58% (12.54 pp) |
| tuple/tuple/4/sequence                  |            535.17 (19.41) |                539.87 (9) |  +0.88% |    +1.07% (3.53 pp) |
| tuple/projection/8/create.empty         |              412.6 (15.4) |            420.53 (74.01) |  +1.92% |   +4.96% (19.98 pp) |
| tuple/tuple/8/create.empty              |              438.93 (3.8) |            430.77 (16.67) |  -1.86% |    -1.86% (8.07 pp) |
| tuple/projection/8/create.sequence      |         2,240.86 (133.08) |          2,345.01 (98.29) |  +4.65% |    +4.06% (7.02 pp) |
| tuple/tuple/8/create.sequence           |          2,053.48 (86.97) |         2,065.03 (225.14) |  +0.56% |   +1.12% (11.63 pp) |
| tuple/projection/8/replace.random       |          1,163.05 (20.42) |          1,142.19 (77.65) |  -1.79% |    +1.08% (4.75 pp) |
| tuple/tuple/8/replace.random            |            650.5 (131.78) |             660.22 (80.5) |  +1.49% |   +5.38% (15.55 pp) |
| tuple/projection/8/apply.replace        |         1,756.35 (104.18) |         1,788.66 (112.23) |  +1.84% |   +4.17% (15.92 pp) |
| tuple/tuple/8/apply.replace             |          1,001.53 (93.02) |          1,086.24 (95.01) |  +8.46% |    +5.18% (8.43 pp) |
| tuple/projection/8/apply.duplicate      |            605.46 (37.26) |             618.4 (58.96) |  +2.14% |   +5.27% (14.27 pp) |
| tuple/tuple/8/apply.duplicate           |              602.49 (8.3) |            646.33 (59.04) |  +7.28% |    +3.25% (7.25 pp) |
| tuple/projection/8/merge.duplicate      |          1,076.94 (39.18) |          1,081.14 (41.31) |  +0.39% |   -0.83% (10.31 pp) |
| tuple/tuple/8/merge.duplicate           |          1,110.7 (132.82) |          1,128.09 (38.69) |  +1.57% |   -0.56% (11.33 pp) |
| tuple/projection/8/length               |              27.64 (2.12) |               28.1 (2.76) |  +1.65% |    -5.71% (15.1 pp) |
| tuple/tuple/8/length                    |                 26 (0.64) |               26.49 (1.4) |  +1.88% |    +4.91% (5.61 pp) |
| tuple/projection/8/value.random         |              52.22 (1.01) |              56.16 (0.62) |  +7.55% |    +7.55% (9.54 pp) |
| tuple/tuple/8/value.random              |              18.26 (1.11) |              17.67 (0.75) |  -3.20% |    -0.23% (7.79 pp) |
| tuple/projection/8/values               |            217.45 (15.87) |              219.7 (4.39) |  +1.03% |    -0.75% (6.38 pp) |
| tuple/tuple/8/values                    |              208.5 (8.05) |             205.99 (1.57) |  -1.20% |    -2.29% (1.39 pp) |
| tuple/projection/8/sequence             |             639.28 (33.1) |            633.09 (10.09) |  -0.97% |    -1.72% (2.59 pp) |
| tuple/tuple/8/sequence                  |             698.4 (58.59) |            696.97 (36.09) |  -0.20% |    -5.53% (5.94 pp) |
| tuple/projection/100/create.empty       |            458.25 (47.16) |            451.57 (50.72) |  -1.46% |   +3.09% (13.99 pp) |
| tuple/tuple/100/create.empty            |             462.57 (18.8) |            484.35 (47.22) |  +4.71% |   +1.54% (11.61 pp) |
| tuple/projection/100/create.sequence    |        14,278.29 (726.87) |        14,316.38 (864.03) |  +0.27% |   +5.32% (11.24 pp) |
| tuple/tuple/100/create.sequence         |         11,719.1 (249.11) |        11,686.48 (339.78) |  -0.28% |    -1.57% (5.64 pp) |
| tuple/projection/100/replace.random     |         1,269.84 (119.45) |         1,286.87 (225.84) |  +1.34% |   +7.27% (24.51 pp) |
| tuple/tuple/100/replace.random          |            645.28 (34.33) |           664.18 (119.38) |  +2.93% |  +12.39% (16.12 pp) |
| tuple/projection/100/apply.replace      |          1,710.57 (85.96) |          1,859.13 (45.16) |  +8.68% |   +8.68% (14.11 pp) |
| tuple/tuple/100/apply.replace           |          1,003.01 (48.56) |          1,044.42 (67.14) |  +4.13% |    +1.04% (3.45 pp) |
| tuple/projection/100/apply.duplicate    |            581.86 (33.16) |            614.42 (35.08) |  +5.60% |    +3.12% (3.16 pp) |
| tuple/tuple/100/apply.duplicate         |            607.98 (15.15) |            636.39 (30.07) |  +4.67% |    +3.86% (4.64 pp) |
| tuple/projection/100/merge.duplicate    |         8,991.21 (311.84) |           9,291.8 (47.81) |  +3.34% |    +0.93% (7.76 pp) |
| tuple/tuple/100/merge.duplicate         |        13,009.67 (934.99) |      13,377.15 (1,273.05) |  +2.82% |   -0.89% (18.03 pp) |
| tuple/projection/100/length             |              27.92 (1.86) |              26.74 (1.07) |  -4.20% |    -2.89% (3.89 pp) |
| tuple/tuple/100/length                  |               26.84 (2.2) |              26.62 (0.41) |  -0.81% |   -2.72% (10.13 pp) |
| tuple/projection/100/value.random       |              82.02 (3.45) |                80.3 (1.7) |  -2.09% |    -4.98% (7.38 pp) |
| tuple/tuple/100/value.random            |              18.47 (1.08) |              18.54 (1.68) |  +0.40% |     +0.29% (6.1 pp) |
| tuple/projection/100/values             |          1,944.88 (129.7) |           1,834.22 (77.3) |  -5.69% |    -1.90% (6.94 pp) |
| tuple/tuple/100/values                  |          1,557.24 (24.42) |           1,529.35 (14.1) |  -1.79% |    -1.79% (2.47 pp) |
| tuple/projection/100/sequence           |          6,565.6 (236.36) |         6,194.01 (162.09) |  -5.66% |    -5.17% (7.29 pp) |
| tuple/tuple/100/sequence                |         5,529.23 (564.28) |          5,665.8 (298.09) |  +2.47% |     +0.26% (2.1 pp) |

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
