# Native ACK storage complete guard

5 complete matched runs per build. Before: baseline; candidate: ack-storage. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 75 timing medians improve over 5%; 34 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            769.57 (35.56) |            768.89 (13.99) |  -0.09% |    -1.72% (8.96 pp) |
| throughput/1000/apply.duplicate         |             829.04 (22.1) |            803.31 (53.82) |  -3.10% |   +2.75% (21.21 pp) |
| throughput/5000/apply.duplicate         |            369.79 (13.35) |            369.75 (21.91) |  -0.01% |    +0.58% (0.79 pp) |
| throughput/10000/apply.duplicate        |            332.06 (16.32) |            346.42 (17.88) |  +4.32% |    +1.91% (0.68 pp) |
| throughput/15000/apply.duplicate        |            327.55 (11.72) |            330.26 (21.41) |  +0.83% |   -1.83% (14.63 pp) |
| throughput/20000/apply.duplicate        |            318.67 (19.33) |            306.32 (12.13) |  -3.88% |    -0.10% (1.95 pp) |
| throughput/25000/apply.duplicate        |            319.24 (10.38) |             314.95 (10.8) |  -1.34% |    -3.05% (3.71 pp) |
| throughput/100/apply.duplicateRemove    |          1,495.78 (59.76) |          1,451.95 (71.71) |  -2.93% |    +1.63% (9.36 pp) |
| throughput/1000/apply.duplicateRemove   |            885.47 (76.95) |           879.16 (156.26) |  -0.71% |   -3.42% (19.85 pp) |
| throughput/5000/apply.duplicateRemove   |           783.45 (103.32) |            744.12 (21.63) |  -5.02% |   -2.81% (17.34 pp) |
| throughput/10000/apply.duplicateRemove  |            703.64 (34.18) |            701.89 (26.64) |  -0.25% |    -2.02% (9.73 pp) |
| throughput/15000/apply.duplicateRemove  |            678.11 (13.34) |            656.32 (80.51) |  -3.21% |   -3.15% (11.54 pp) |
| throughput/20000/apply.duplicateRemove  |            692.03 (96.29) |             663.9 (35.63) |  -4.06% |    -1.68% (9.66 pp) |
| throughput/25000/apply.duplicateRemove  |            665.54 (38.93) |            696.33 (82.32) |  +4.63% |   +1.32% (12.59 pp) |
| throughput/100/apply.duplicateReplace   |          1,029.16 (76.99) |         1,041.09 (108.93) |  +1.16% |   +1.16% (21.76 pp) |
| throughput/1000/apply.duplicateReplace  |         1,074.75 (129.81) |         1,106.21 (232.36) |  +2.93% |   +6.37% (20.07 pp) |
| throughput/5000/apply.duplicateReplace  |            978.95 (47.06) |               926 (11.77) |  -5.41% |    -9.52% (4.74 pp) |
| throughput/10000/apply.duplicateReplace |             878.86 (9.29) |            903.01 (77.85) |  +2.75% |    -0.61% (6.66 pp) |
| throughput/15000/apply.duplicateReplace |            809.19 (54.76) |            824.52 (49.25) |  +1.89% |    +4.49% (5.26 pp) |
| throughput/20000/apply.duplicateReplace |            899.36 (61.58) |            852.07 (47.68) |  -5.26% |    -3.36% (8.75 pp) |
| throughput/25000/apply.duplicateReplace |           835.16 (100.52) |            793.86 (54.74) |  -4.95% |   -4.04% (12.93 pp) |
| throughput/100/apply.insert             |         1,631.42 (150.44) |          1,552.7 (173.82) |  -4.83% |    -4.43% (5.16 pp) |
| throughput/1000/apply.insert            |         1,309.78 (102.29) |         1,451.45 (238.99) | +10.82% |  +16.02% (21.56 pp) |
| throughput/5000/apply.insert            |         1,347.03 (139.73) |         1,318.45 (129.75) |  -2.12% |    -0.37% (1.14 pp) |
| throughput/10000/apply.insert           |          1,277.35 (21.83) |         1,299.28 (123.89) |  +1.72% |   +7.83% (10.56 pp) |
| throughput/15000/apply.insert           |          1,188.18 (49.43) |         1,300.45 (221.81) |  +9.45% |  +11.87% (35.63 pp) |
| throughput/20000/apply.insert           |           1,217.41 (88.8) |          1,164.82 (68.66) |  -4.32% |   -4.32% (18.92 pp) |
| throughput/25000/apply.insert           |          1,164.33 (77.49) |           1,171.3 (30.91) |  +0.60% |    -1.30% (3.95 pp) |
| throughput/100/apply.remove             |          1,784.73 (61.09) |          1,847.76 (88.43) |  +3.53% |   +4.52% (10.76 pp) |
| throughput/1000/apply.remove            |         1,406.51 (153.07) |         1,508.16 (432.26) |  +7.23% |   +5.04% (17.62 pp) |
| throughput/5000/apply.remove            |         1,552.67 (123.78) |            1,481.8 (1.75) |  -4.56% |    -4.62% (7.79 pp) |
| throughput/10000/apply.remove           |          1,516.75 (73.44) |         1,516.99 (179.44) |  +0.02% |    -0.50% (5.59 pp) |
| throughput/15000/apply.remove           |         1,524.88 (188.63) |          1,463.6 (167.57) |  -4.02% |    -3.90% (3.37 pp) |
| throughput/20000/apply.remove           |         1,558.79 (152.31) |         1,493.85 (112.91) |  -4.17% |    -4.17% (9.12 pp) |
| throughput/25000/apply.remove           |         1,485.35 (379.34) |          1,530.28 (88.68) |  +3.02% |   -6.23% (17.06 pp) |
| throughput/100/apply.replace            |         2,494.92 (220.53) |         2,640.46 (204.51) |  +5.83% |   +2.12% (17.74 pp) |
| throughput/1000/apply.replace           |         2,583.63 (182.73) |         2,696.87 (341.37) |  +4.38% |   +5.85% (16.09 pp) |
| throughput/5000/apply.replace           |         2,789.56 (225.45) |          2,650.94 (15.18) |  -4.97% |    -2.77% (3.81 pp) |
| throughput/10000/apply.replace          |         2,576.84 (190.74) |         2,629.23 (235.73) |  +2.03% |    +2.09% (0.24 pp) |
| throughput/15000/apply.replace          |          2,813.8 (361.66) |         2,529.62 (201.49) | -10.10% |     -3.72% (7.5 pp) |
| throughput/20000/apply.replace          |         2,903.34 (231.27) |         2,543.03 (116.18) | -12.41% |   -12.05% (3.57 pp) |
| throughput/25000/apply.replace          |         2,716.55 (736.44) |         2,567.58 (115.55) |  -5.48% |   -8.94% (23.94 pp) |
| throughput/100/create.empty             |            561.59 (52.61) |            542.97 (73.58) |  -3.32% |    +1.41% (7.48 pp) |
| throughput/1000/create.empty            |               685 (53.21) |            765.98 (78.81) | +11.82% |   +8.43% (27.11 pp) |
| throughput/5000/create.empty            |            811.19 (66.86) |             785.32 (6.35) |  -3.19% |     -1.74% (8.9 pp) |
| throughput/10000/create.empty           |            746.51 (29.31) |             718.98 (6.76) |  -3.69% |   -3.69% (20.53 pp) |
| throughput/15000/create.empty           |             739.64 (87.9) |            718.63 (108.8) |  -2.84% |    -2.84% (27.6 pp) |
| throughput/20000/create.empty           |            715.42 (40.44) |             693.35 (3.26) |  -3.08% |    -1.78% (6.78 pp) |
| throughput/25000/create.empty           |            710.3 (186.85) |            681.94 (47.95) |  -3.99% |   -3.99% (21.46 pp) |
| throughput/100/create.sequence          |          1,573.56 (51.54) |         1,757.33 (365.37) | +11.68% |  +14.61% (23.37 pp) |
| throughput/1000/create.sequence         |         1,801.33 (122.67) |         1,788.69 (320.27) |  -0.70% |   +8.53% (26.17 pp) |
| throughput/5000/create.sequence         |           1,540.9 (76.02) |          1,600.22 (30.11) |  +3.85% |   +1.74% (10.73 pp) |
| throughput/10000/create.sequence        |         1,631.62 (213.95) |         1,537.47 (252.27) |  -5.77% |    +4.65% (0.63 pp) |
| throughput/15000/create.sequence        |           1,386.57 (69.6) |           1,420.1 (48.66) |  +2.42% |    +2.42% (8.43 pp) |
| throughput/20000/create.sequence        |         1,502.64 (233.61) |         1,576.21 (108.41) |  +4.90% |   +3.02% (14.71 pp) |
| throughput/25000/create.sequence        |         1,615.46 (202.74) |         1,571.21 (257.36) |  -2.74% |    -3.44% (3.65 pp) |
| throughput/100/insert.head              |            529.28 (39.55) |           498.65 (111.71) |  -5.79% |    -4.45% (8.86 pp) |
| throughput/1000/insert.head             |             499.3 (34.05) |            511.95 (37.05) |  +2.53% |    +7.28% (2.52 pp) |
| throughput/5000/insert.head             |            525.61 (34.22) |            495.08 (21.93) |  -5.81% |   -4.74% (10.22 pp) |
| throughput/10000/insert.head            |            495.73 (85.03) |             497.5 (14.57) |  +0.36% |   +3.57% (14.92 pp) |
| throughput/15000/insert.head            |            489.75 (36.96) |            465.11 (20.38) |  -5.03% |    -6.41% (3.49 pp) |
| throughput/20000/insert.head            |            492.14 (80.25) |             478.4 (30.03) |  -2.79% |    -1.67% (4.98 pp) |
| throughput/25000/insert.head            |            466.59 (78.35) |            482.55 (41.13) |  +3.42% |    -2.37% (5.34 pp) |
| throughput/100/insert.middle            |            615.29 (28.39) |            570.67 (26.27) |  -7.25% |   -7.25% (14.98 pp) |
| throughput/1000/insert.middle           |            590.25 (36.42) |            588.69 (29.43) |  -0.26% |    +3.79% (9.15 pp) |
| throughput/5000/insert.middle           |            619.45 (16.42) |            580.17 (10.72) |  -6.34% |    -6.10% (2.48 pp) |
| throughput/10000/insert.middle          |            595.32 (117.4) |             601.02 (2.83) |  +0.96% |   +0.96% (13.26 pp) |
| throughput/15000/insert.middle          |            551.12 (39.11) |             539.1 (28.38) |  -2.18% |    -3.36% (0.51 pp) |
| throughput/20000/insert.middle          |            556.45 (14.18) |            555.19 (10.28) |  -0.23% |    +0.89% (2.11 pp) |
| throughput/25000/insert.middle          |            528.69 (23.58) |            574.51 (31.18) |  +8.67% |    +3.69% (3.21 pp) |
| throughput/100/insert.random            |            829.32 (84.46) |           887.68 (117.61) |  +7.04% |   -2.00% (21.53 pp) |
| throughput/1000/insert.random           |            898.49 (19.32) |            881.65 (40.07) |  -1.87% |    -0.46% (7.56 pp) |
| throughput/5000/insert.random           |            887.06 (50.35) |            881.87 (29.08) |  -0.59% |    -1.53% (7.27 pp) |
| throughput/10000/insert.random          |             883.32 (94.3) |             867.63 (45.8) |  -1.78% |    -4.07% (9.99 pp) |
| throughput/15000/insert.random          |            801.69 (24.14) |            860.58 (48.94) |  +7.35% |   +3.63% (11.75 pp) |
| throughput/20000/insert.random          |            863.33 (37.41) |             850.29 (29.4) |  -1.51% |    -2.71% (4.56 pp) |
| throughput/25000/insert.random          |             819.93 (97.9) |              805.8 (4.02) |  -1.72% |    -1.72% (4.75 pp) |
| throughput/100/insert.sameIndex         |            570.81 (52.19) |            527.66 (10.84) |  -7.56% |    -5.89% (10.7 pp) |
| throughput/1000/insert.sameIndex        |            539.84 (10.82) |            599.12 (58.47) | +10.98% |  +15.17% (19.87 pp) |
| throughput/5000/insert.sameIndex        |             550.5 (22.46) |            539.99 (20.51) |  -1.91% |    -2.51% (0.77 pp) |
| throughput/10000/insert.sameIndex       |             535.3 (17.16) |             522.86 (6.66) |  -2.32% |    -4.44% (3.99 pp) |
| throughput/15000/insert.sameIndex       |             509.66 (37.1) |            513.37 (60.85) |  +0.73% |   +2.08% (11.06 pp) |
| throughput/20000/insert.sameIndex       |            539.27 (13.74) |            525.94 (26.18) |  -2.47% |    -6.10% (3.76 pp) |
| throughput/25000/insert.sameIndex       |            493.3 (114.87) |              527.3 (46.9) |  +6.89% |   +3.25% (26.06 pp) |
| throughput/100/insert.tail              |           897.44 (112.88) |            742.63 (48.43) | -17.25% |  -12.41% (18.25 pp) |
| throughput/1000/insert.tail             |           883.66 (169.66) |           866.47 (203.06) |  -1.95% |     -1.95% (3.9 pp) |
| throughput/5000/insert.tail             |            863.67 (40.61) |            830.19 (26.27) |  -3.88% |   -5.46% (15.71 pp) |
| throughput/10000/insert.tail            |             808.8 (14.98) |           846.78 (133.15) |  +4.70% |       +3.73% (6 pp) |
| throughput/15000/insert.tail            |            759.74 (77.73) |            746.05 (37.83) |  -1.80% |    -1.80% (1.52 pp) |
| throughput/20000/insert.tail            |            788.23 (43.98) |            770.75 (165.6) |  -2.22% |   +0.47% (15.48 pp) |
| throughput/25000/insert.tail            |            797.95 (56.79) |            843.3 (116.72) |  +5.68% |   +3.91% (18.08 pp) |
| throughput/100/length                   |            119.67 (19.44) |             109.84 (8.12) |  -8.21% |    -7.18% (4.69 pp) |
| throughput/1000/length                  |             111.76 (4.61) |            108.79 (11.89) |  -2.66% |    +0.85% (6.87 pp) |
| throughput/5000/length                  |             109.64 (5.07) |             113.41 (6.52) |  +3.44% |    +0.46% (9.37 pp) |
| throughput/10000/length                 |             112.42 (3.85) |              107.8 (7.51) |  -4.11% |    -0.62% (3.51 pp) |
| throughput/15000/length                 |              105.27 (7.6) |             102.82 (7.95) |  -2.33% |    +1.32% (3.67 pp) |
| throughput/20000/length                 |             104.45 (5.32) |             108.55 (9.19) |  +3.93% |    +3.93% (1.44 pp) |
| throughput/25000/length                 |            107.59 (12.48) |              99.19 (3.58) |  -7.81% |   -8.81% (16.59 pp) |
| throughput/100/merge.duplicate          |           928.25 (135.03) |            858.75 (73.32) |  -7.49% |   -5.76% (10.96 pp) |
| throughput/1000/merge.duplicate         |            702.53 (37.41) |            649.19 (86.18) |  -7.59% |   -9.25% (21.67 pp) |
| throughput/5000/merge.duplicate         |             645.95 (4.54) |            616.47 (26.46) |  -4.56% |    -5.81% (1.52 pp) |
| throughput/10000/merge.duplicate        |            603.53 (73.19) |              590.5 (4.03) |  -2.16% |    -5.97% (9.47 pp) |
| throughput/15000/merge.duplicate        |             587.6 (21.48) |             605.2 (31.24) |  +3.00% |     +4.30% (3.1 pp) |
| throughput/20000/merge.duplicate        |            600.88 (12.78) |            583.76 (44.99) |  -2.85% |    -2.85% (8.79 pp) |
| throughput/25000/merge.duplicate        |            604.41 (21.73) |            577.82 (36.67) |  -4.40% |    -8.28% (7.18 pp) |
| throughput/100/merge.insert             |         1,824.95 (293.38) |          1,670.18 (19.24) |  -8.48% |   -4.30% (12.39 pp) |
| throughput/1000/merge.insert            |         1,508.06 (116.32) |           1,418.76 (67.3) |  -5.92% |    -6.48% (2.45 pp) |
| throughput/5000/merge.insert            |           1,434.6 (92.14) |         1,462.96 (116.26) |  +1.98% |    +1.38% (3.49 pp) |
| throughput/10000/merge.insert           |         1,513.59 (156.25) |         1,447.77 (112.13) |  -4.35% |   -6.41% (19.68 pp) |
| throughput/15000/merge.insert           |          1,363.69 (28.74) |          1,428.8 (132.28) |  +4.77% |   +4.77% (12.14 pp) |
| throughput/20000/merge.insert           |          1,426.39 (145.4) |           1,453.1 (39.42) |  +1.87% |     -2.21% (4.9 pp) |
| throughput/25000/merge.insert           |          1,342.22 (53.77) |           1,247.6 (37.11) |  -7.05% |    -7.22% (2.67 pp) |
| throughput/100/remove.head              |            752.34 (59.32) |             689.4 (71.76) |  -8.37% |   -3.31% (12.07 pp) |
| throughput/1000/remove.head             |             796.07 (16.2) |            776.52 (65.46) |  -2.46% |   -1.23% (13.35 pp) |
| throughput/5000/remove.head             |            818.52 (38.17) |            847.25 (77.04) |  +3.51% |    +0.30% (6.02 pp) |
| throughput/10000/remove.head            |            867.64 (54.75) |            870.47 (28.47) |  +0.33% |    -0.30% (7.91 pp) |
| throughput/15000/remove.head            |             885.9 (76.89) |             809.4 (40.99) |  -8.64% |    -6.65% (8.64 pp) |
| throughput/20000/remove.head            |            921.14 (58.13) |            902.21 (36.17) |  -2.06% |    +0.77% (4.67 pp) |
| throughput/25000/remove.head            |            923.19 (69.91) |            893.51 (54.35) |  -3.21% |    -3.21% (4.85 pp) |
| throughput/100/remove.middle            |            793.68 (117.2) |           724.24 (168.37) |  -8.75% |  -11.45% (38.43 pp) |
| throughput/1000/remove.middle           |             797.3 (28.61) |            818.96 (39.13) |  +2.72% |    +1.31% (5.97 pp) |
| throughput/5000/remove.middle           |            816.29 (16.51) |            837.22 (14.42) |  +2.56% |    +1.21% (4.19 pp) |
| throughput/10000/remove.middle          |            855.71 (32.07) |            842.93 (52.42) |  -1.49% |    -0.82% (5.53 pp) |
| throughput/15000/remove.middle          |             813.5 (26.32) |            839.84 (76.15) |  +3.24% |    +3.24% (4.24 pp) |
| throughput/20000/remove.middle          |            890.26 (73.99) |            917.51 (37.74) |  +3.06% |    -0.51% (8.44 pp) |
| throughput/25000/remove.middle          |            964.41 (11.68) |            881.69 (40.34) |  -8.58% |    -8.69% (5.62 pp) |
| throughput/100/remove.random            |         1,067.98 (165.46) |            928.02 (37.17) | -13.11% |  -13.11% (16.15 pp) |
| throughput/1000/remove.random           |          1,142.23 (53.83) |          1,172.56 (42.85) |  +2.66% |    +2.66% (2.17 pp) |
| throughput/5000/remove.random           |          1,147.64 (16.14) |          1,138.65 (22.03) |  -0.78% |    -0.51% (0.72 pp) |
| throughput/10000/remove.random          |         1,195.75 (136.47) |          1,117.73 (43.64) |  -6.52% |   -3.74% (12.33 pp) |
| throughput/15000/remove.random          |           1,159.1 (92.42) |           1,183.1 (58.96) |  +2.07% |   +5.41% (14.46 pp) |
| throughput/20000/remove.random          |          1,241.25 (32.28) |         1,190.95 (115.64) |  -4.05% |    -3.16% (9.86 pp) |
| throughput/25000/remove.random          |          1,222.4 (115.84) |          1,242.85 (94.53) |  +1.67% |     +7.52% (8.9 pp) |
| throughput/100/remove.sameIndex         |         1,165.61 (155.82) |           985.57 (306.92) | -15.45% |   -9.39% (31.98 pp) |
| throughput/1000/remove.sameIndex        |            799.44 (17.33) |            828.75 (26.53) |  +3.67% |       +2.31% (3 pp) |
| throughput/5000/remove.sameIndex        |            837.62 (40.22) |            792.69 (20.44) |  -5.36% |    -0.89% (4.08 pp) |
| throughput/10000/remove.sameIndex       |            868.99 (11.22) |            808.94 (53.28) |  -6.91% |    -9.01% (9.51 pp) |
| throughput/15000/remove.sameIndex       |            837.96 (31.44) |           825.61 (121.11) |  -1.47% |    -1.81% (3.59 pp) |
| throughput/20000/remove.sameIndex       |            915.51 (35.93) |            901.53 (84.54) |  -1.53% |    -3.51% (6.98 pp) |
| throughput/25000/remove.sameIndex       |            888.99 (99.31) |           849.34 (207.09) |  -4.46% |   -3.33% (13.16 pp) |
| throughput/100/remove.tail              |             771.3 (139.1) |            677.2 (133.49) | -12.20% |   -3.29% (12.18 pp) |
| throughput/1000/remove.tail             |            694.57 (21.79) |            708.54 (24.42) |  +2.01% |    +0.99% (2.17 pp) |
| throughput/5000/remove.tail             |            719.52 (13.58) |            695.79 (51.24) |  -3.30% |    -0.59% (6.18 pp) |
| throughput/10000/remove.tail            |             757.6 (28.51) |             741.9 (54.42) |  -2.07% |    -4.80% (1.57 pp) |
| throughput/15000/remove.tail            |            734.34 (30.81) |             719.24 (14.2) |  -2.06% |    -4.89% (8.35 pp) |
| throughput/20000/remove.tail            |             799.63 (92.4) |            804.54 (41.89) |  +0.61% |    +0.42% (7.31 pp) |
| throughput/25000/remove.tail            |             798.5 (44.89) |            820.19 (81.34) |  +2.72% |   +3.90% (13.49 pp) |
| throughput/100/replace.head             |          1,120.38 (97.66) |          1,024.09 (17.55) |  -8.59% |    -7.86% (2.47 pp) |
| throughput/1000/replace.head            |          1,125.06 (43.76) |          1,148.78 (40.29) |  +2.11% |    +0.59% (5.78 pp) |
| throughput/5000/replace.head            |           1,147.1 (21.02) |          1,108.24 (64.01) |  -3.39% |     -2.17% (3.8 pp) |
| throughput/10000/replace.head           |           1,198.32 (78.3) |          1,140.37 (49.23) |  -4.84% |    -4.84% (2.77 pp) |
| throughput/15000/replace.head           |             1,187.75 (76) |          1,121.18 (14.93) |  -5.60% |    -5.04% (3.41 pp) |
| throughput/20000/replace.head           |          1,223.66 (90.91) |          1,164.82 (38.62) |  -4.81% |   -1.91% (11.37 pp) |
| throughput/25000/replace.head           |          1,188.82 (448.6) |          1,210.92 (11.42) |  +1.86% |   +1.19% (21.61 pp) |
| throughput/100/replace.middle           |          1,204.14 (12.05) |             1,074.74 (61) | -10.75% |    -6.59% (7.26 pp) |
| throughput/1000/replace.middle          |          1,179.92 (44.69) |          1,184.17 (30.28) |  +0.36% |    +0.20% (5.15 pp) |
| throughput/5000/replace.middle          |          1,172.78 (20.94) |          1,152.47 (17.97) |  -1.73% |    -3.18% (2.31 pp) |
| throughput/10000/replace.middle         |          1,193.44 (62.07) |          1,179.69 (16.53) |  -1.15% |    -1.15% (2.87 pp) |
| throughput/15000/replace.middle         |             1,110.88 (38) |           1,135.5 (34.65) |  +2.22% |    -0.36% (1.52 pp) |
| throughput/20000/replace.middle         |          1,247.29 (66.24) |          1,242.72 (47.49) |  -0.37% |    -2.73% (6.73 pp) |
| throughput/25000/replace.middle         |         1,205.04 (259.96) |          1,221.71 (42.32) |  +1.38% |    +1.87% (2.63 pp) |
| throughput/100/replace.random           |         1,733.54 (212.09) |          1,578.01 (79.25) |  -8.97% |    -6.42% (9.55 pp) |
| throughput/1000/replace.random          |         1,806.17 (109.06) |           1,717.93 (9.97) |  -4.89% |    -1.84% (5.32 pp) |
| throughput/5000/replace.random          |          1,747.22 (96.21) |          1,687.9 (138.54) |  -3.40% |    +0.67% (6.26 pp) |
| throughput/10000/replace.random         |            1,642 (176.66) |         1,633.54 (190.59) |  -0.52% |    -0.77% (3.62 pp) |
| throughput/15000/replace.random         |            1,627.9 (19.9) |           1,648.17 (32.3) |  +1.25% |    +1.07% (5.63 pp) |
| throughput/20000/replace.random         |             1,700.74 (90) |         1,792.96 (169.69) |  +5.42% |    +5.42% (9.63 pp) |
| throughput/25000/replace.random         |          1,696.54 (34.63) |          1,694.58 (225.9) |  -0.12% |    -2.03% (8.38 pp) |
| throughput/100/replace.sameIndex        |          1,167.34 (221.1) |          1,016.23 (32.43) | -12.94% |  -13.09% (23.08 pp) |
| throughput/1000/replace.sameIndex       |         1,122.97 (125.51) |           1,131.9 (21.46) |  +0.80% |    -4.58% (7.67 pp) |
| throughput/5000/replace.sameIndex       |          1,143.29 (71.12) |           1,131.14 (57.7) |  -1.06% |    -1.47% (2.24 pp) |
| throughput/10000/replace.sameIndex      |          1,185.16 (52.58) |          1,173.66 (47.21) |  -0.97% |    +1.44% (3.54 pp) |
| throughput/15000/replace.sameIndex      |          1,102.24 (67.41) |          1,120.98 (85.58) |  +1.70% |    +7.19% (9.65 pp) |
| throughput/20000/replace.sameIndex      |          1,198.83 (43.49) |          1,148.41 (56.04) |  -4.21% |    -7.02% (4.57 pp) |
| throughput/25000/replace.sameIndex      |          1,124.56 (90.23) |         1,160.53 (142.63) |  +3.20% |    +3.20% (4.29 pp) |
| throughput/100/replace.tail             |         1,152.99 (168.18) |          1,008.96 (83.82) | -12.49% |   -8.04% (10.16 pp) |
| throughput/1000/replace.tail            |          1,189.87 (91.24) |          1,155.84 (38.32) |  -2.86% |   -2.13% (10.19 pp) |
| throughput/5000/replace.tail            |          1,152.69 (59.52) |          1,250.88 (94.42) |  +8.52% |    +7.26% (3.75 pp) |
| throughput/10000/replace.tail           |           1,153.4 (30.41) |          1,155.64 (65.47) |  +0.19% |    -0.37% (7.85 pp) |
| throughput/15000/replace.tail           |          1,106.88 (40.92) |          1,116.92 (31.38) |  +0.91% |    +1.24% (5.52 pp) |
| throughput/20000/replace.tail           |          1,229.01 (18.95) |          1,245.43 (69.22) |  +1.34% |    +1.34% (4.11 pp) |
| throughput/25000/replace.tail           |          1,212.62 (63.48) |         1,290.78 (159.23) |  +6.45% |    +3.02% (3.63 pp) |
| throughput/100/retire                   |             194.22 (14.4) |           266.88 (108.77) | +37.41% |  +42.63% (45.85 pp) |
| throughput/1000/retire                  |             221.6 (11.05) |              208.82 (5.3) |  -5.77% |    -4.14% (4.95 pp) |
| throughput/5000/retire                  |            200.37 (10.11) |            214.63 (14.56) |  +7.12% |   +1.75% (15.86 pp) |
| throughput/10000/retire                 |             188.24 (1.67) |            205.99 (18.38) |  +9.43% |    +9.62% (8.97 pp) |
| throughput/15000/retire                 |             191.16 (4.95) |             194.67 (2.23) |  +1.84% |    +2.04% (9.57 pp) |
| throughput/20000/retire                 |             187.69 (9.03) |             187.6 (13.02) |  -0.05% |    +4.21% (1.28 pp) |
| throughput/25000/retire                 |             202.28 (25.7) |            182.18 (21.46) |  -9.94% |    -8.93% (7.12 pp) |
| throughput/100/sequence                 |             311.59 (6.92) |            330.75 (20.87) |  +6.15% |    +6.56% (8.15 pp) |
| throughput/1000/sequence                |            300.79 (11.04) |             304.1 (13.73) |  +1.10% |    +2.00% (7.34 pp) |
| throughput/5000/sequence                |            276.64 (13.84) |              278.47 (8.5) |  +0.66% |    -1.61% (7.24 pp) |
| throughput/10000/sequence               |            251.74 (14.14) |            255.43 (12.18) |  +1.47% |    +6.16% (6.42 pp) |
| throughput/15000/sequence               |            254.27 (16.77) |             242.82 (4.39) |  -4.50% |    -5.87% (6.92 pp) |
| throughput/20000/sequence               |             251.75 (7.86) |            245.38 (13.73) |  -2.53% |   -0.09% (11.58 pp) |
| throughput/25000/sequence               |            275.29 (30.52) |              247.14 (4.5) | -10.23% |  -11.68% (10.28 pp) |
| throughput/100/value.head               |             189.1 (14.86) |            182.03 (48.57) |  -3.74% |   -7.44% (31.07 pp) |
| throughput/1000/value.head              |              164.7 (4.73) |             158.84 (6.16) |  -3.56% |    -3.56% (6.96 pp) |
| throughput/5000/value.head              |             144.75 (4.68) |              147.42 (5.8) |  +1.84% |    -2.69% (6.88 pp) |
| throughput/10000/value.head             |             137.56 (7.68) |            143.33 (22.83) |  +4.19% |  +10.36% (12.15 pp) |
| throughput/15000/value.head             |            129.51 (13.56) |              140.5 (4.72) |  +8.49% |   +2.26% (10.24 pp) |
| throughput/20000/value.head             |             130.24 (3.18) |             137.78 (9.37) |  +5.79% |    +5.79% (1.87 pp) |
| throughput/25000/value.head             |            138.84 (13.05) |             128.64 (5.07) |  -7.35% |    -7.96% (5.64 pp) |
| throughput/100/value.middle             |              252.34 (7.6) |             243.9 (29.27) |  -3.34% |    -4.13% (3.89 pp) |
| throughput/1000/value.middle            |            250.27 (22.14) |            245.18 (20.17) |  -2.03% |    -7.25% (3.65 pp) |
| throughput/5000/value.middle            |             221.99 (4.98) |             222.77 (3.87) |  +0.35% |    +1.44% (5.96 pp) |
| throughput/10000/value.middle           |            213.54 (12.61) |             210.92 (17.9) |  -1.23% |    -1.11% (1.86 pp) |
| throughput/15000/value.middle           |             211.93 (8.97) |             208.31 (10.4) |  -1.71% |   -4.17% (11.22 pp) |
| throughput/20000/value.middle           |             204.38 (1.84) |             200.1 (50.26) |  -2.09% |   -2.09% (25.49 pp) |
| throughput/25000/value.middle           |             205.73 (2.31) |             201.91 (5.39) |  -1.86% |    -0.94% (5.85 pp) |
| throughput/100/value.random             |            231.98 (16.12) |            212.34 (13.11) |  -8.47% |    -9.19% (1.91 pp) |
| throughput/1000/value.random            |            224.12 (18.83) |             220.52 (2.45) |  -1.61% |    -2.42% (2.98 pp) |
| throughput/5000/value.random            |             265.25 (9.91) |             255.9 (20.89) |  -3.52% |    -2.39% (6.88 pp) |
| throughput/10000/value.random           |            261.36 (23.79) |            263.43 (21.47) |  +0.79% |   +1.05% (16.69 pp) |
| throughput/15000/value.random           |            244.14 (12.38) |            255.06 (17.78) |  +4.47% |    +2.83% (5.91 pp) |
| throughput/20000/value.random           |             260.76 (6.95) |            266.46 (17.15) |  +2.19% |    +3.30% (7.16 pp) |
| throughput/25000/value.random           |             248.55 (2.78) |            251.06 (10.75) |  +1.01% |    +1.23% (3.41 pp) |
| throughput/100/value.sameIndex          |             193.41 (7.11) |             193.93 (5.03) |  +0.27% |    -2.06% (1.18 pp) |
| throughput/1000/value.sameIndex         |             188.31 (9.25) |             176.77 (9.77) |  -6.13% |       -9.01% (3 pp) |
| throughput/5000/value.sameIndex         |            175.02 (10.81) |             169.57 (4.14) |  -3.11% |   -0.42% (11.18 pp) |
| throughput/10000/value.sameIndex        |             163.11 (4.68) |              166.85 (9.3) |  +2.29% |    +2.29% (3.74 pp) |
| throughput/15000/value.sameIndex        |            162.42 (13.89) |             155.76 (14.7) |  -4.10% |    +1.30% (6.02 pp) |
| throughput/20000/value.sameIndex        |            161.08 (15.96) |               154 (17.15) |  -4.40% |    -2.00% (6.04 pp) |
| throughput/25000/value.sameIndex        |             156.39 (6.69) |              152.3 (5.54) |  -2.62% |    -1.78% (7.04 pp) |
| throughput/100/value.tail               |             239.68 (6.53) |             221.97 (37.8) |  -7.39% |    -3.76% (16.3 pp) |
| throughput/1000/value.tail              |             220.49 (7.86) |            204.71 (10.78) |  -7.16% |    -6.49% (1.81 pp) |
| throughput/5000/value.tail              |             193.83 (0.71) |              199.01 (3.2) |  +2.67% |    +1.58% (3.12 pp) |
| throughput/10000/value.tail             |             192.33 (8.67) |             195.99 (8.78) |  +1.90% |   -1.35% (13.53 pp) |
| throughput/15000/value.tail             |             177.98 (8.39) |            176.27 (17.28) |  -0.96% |   +0.89% (11.32 pp) |
| throughput/20000/value.tail             |             178.55 (4.18) |             189.91 (2.95) |  +6.36% |    +7.58% (3.99 pp) |
| throughput/25000/value.tail             |            179.59 (10.87) |                177.07 (9) |  -1.40% |   -4.70% (11.17 pp) |
| throughput/100/values                   |         4,360.72 (276.56) |          4,099.07 (473.2) |  -6.00% |    -4.61% (8.32 pp) |
| throughput/1000/values                  |        159,836.22 (1,325) |     162,023.44 (7,520.03) |  +1.37% |     +1.07% (4.6 pp) |
| throughput/5000/values                  |    499,073.44 (33,307.42) |     479,403.13 (44,041.8) |  -3.94% |   -8.37% (11.35 pp) |
| throughput/10000/values                 |  1,027,595.31 (22,138.28) |  1,089,799.22 (79,281.25) |  +6.05% |    +5.46% (3.24 pp) |
| throughput/15000/values                 |  1,613,764.06 (64,334.38) |  1,661,340.63 (63,839.06) |  +2.95% |    +3.62% (3.82 pp) |
| throughput/20000/values                 | 2,257,109.38 (166,160.94) | 2,334,084.38 (174,459.38) |  +3.41% |   +3.41% (19.78 pp) |
| throughput/25000/values                 |    2,808,401.56 (524,650) | 2,853,973.44 (225,040.63) |  +1.62% |   -6.72% (19.61 pp) |
| throughput/100/values.head              |            302.98 (25.56) |            293.83 (23.66) |  -3.02% |     -8.88% (5.4 pp) |
| throughput/1000/values.head             |           254.66 (102.94) |             242.96 (7.77) |  -4.59% |   -4.92% (38.67 pp) |
| throughput/5000/values.head             |            267.49 (23.49) |            277.06 (33.18) |  +3.58% |   +2.75% (10.42 pp) |
| throughput/10000/values.head            |            255.38 (15.49) |            258.24 (15.25) |  +1.12% |   +5.98% (19.27 pp) |
| throughput/15000/values.head            |             266.2 (40.23) |             239.7 (67.08) |  -9.95% |    -6.17% (23.9 pp) |
| throughput/20000/values.head            |            236.21 (19.79) |             242.2 (10.54) |  +2.54% |      +4.30% (14 pp) |
| throughput/25000/values.head            |            225.33 (39.58) |             217.9 (23.97) |  -3.30% |    -2.53% (9.03 pp) |
| throughput/100/values.middle            |            291.28 (25.36) |             276.5 (28.39) |  -5.07% |    -4.23% (3.06 pp) |
| throughput/1000/values.middle           |            264.63 (24.04) |             254.1 (15.08) |  -3.98% |     -3.33% (9.7 pp) |
| throughput/5000/values.middle           |            246.67 (38.48) |            235.45 (12.43) |  -4.55% |   -3.63% (12.57 pp) |
| throughput/10000/values.middle          |            257.52 (48.53) |            231.76 (19.34) | -10.00% |   -4.55% (14.77 pp) |
| throughput/15000/values.middle          |             214.91 (6.63) |             215.61 (10.4) |  +0.33% |    -2.65% (5.53 pp) |
| throughput/20000/values.middle          |            251.78 (21.05) |            237.87 (44.05) |  -5.52% |   -1.69% (14.23 pp) |
| throughput/25000/values.middle          |            213.83 (28.69) |              212.6 (1.99) |  -0.58% |   -1.30% (13.22 pp) |
| throughput/100/values.random            |             294.66 (7.24) |            298.16 (21.03) |  +1.19% |    +1.83% (4.65 pp) |
| throughput/1000/values.random           |            288.74 (17.08) |             278.94 (8.42) |  -3.39% |    -2.74% (6.43 pp) |
| throughput/5000/values.random           |            325.07 (17.94) |            331.2 (160.29) |  +1.89% |   -2.74% (39.64 pp) |
| throughput/10000/values.random          |            344.72 (25.45) |            352.63 (21.15) |  +2.29% |   +8.36% (15.15 pp) |
| throughput/15000/values.random          |             380.44 (6.29) |              324.8 (65.5) | -14.63% |   +1.06% (18.63 pp) |
| throughput/20000/values.random          |            372.28 (27.28) |            354.68 (42.94) |  -4.73% |   -4.73% (10.25 pp) |
| throughput/25000/values.random          |            344.96 (36.41) |            344.86 (40.69) |  -0.03% |   -3.21% (18.84 pp) |
| throughput/100/values.sameIndex         |               309 (64.95) |            278.23 (17.01) |  -9.96% |    -2.46% (8.27 pp) |
| throughput/1000/values.sameIndex        |            248.42 (33.46) |              250.2 (16.5) |  +0.72% |    -3.01% (7.09 pp) |
| throughput/5000/values.sameIndex        |              242.2 (18.1) |            249.99 (14.24) |  +3.22% |    +2.97% (4.08 pp) |
| throughput/10000/values.sameIndex       |             248.39 (2.79) |            224.43 (11.79) |  -9.65% |    -7.41% (5.33 pp) |
| throughput/15000/values.sameIndex       |            239.73 (35.54) |             214.22 (7.09) | -10.64% |  -10.50% (10.31 pp) |
| throughput/20000/values.sameIndex       |            247.02 (35.49) |            249.25 (23.73) |  +0.90% |    -4.91% (9.85 pp) |
| throughput/25000/values.sameIndex       |             222.33 (9.23) |            241.64 (30.05) |  +8.69% |   +2.70% (16.92 pp) |
| throughput/100/values.tail              |            285.85 (14.19) |             274.56 (9.24) |  -3.95% |    +0.25% (8.82 pp) |
| throughput/1000/values.tail             |            247.03 (22.08) |              248.27 (8.9) |  +0.50% |    -0.06% (6.67 pp) |
| throughput/5000/values.tail             |            261.23 (12.57) |              257.75 (4.5) |  -1.33% |   -0.13% (13.97 pp) |
| throughput/10000/values.tail            |             233.3 (14.14) |              240.7 (12.9) |  +3.17% |    +2.13% (9.23 pp) |
| throughput/15000/values.tail            |             216.03 (1.76) |            209.92 (26.94) |  -2.83% |    -5.98% (3.65 pp) |
| throughput/20000/values.tail            |            249.59 (63.64) |            279.56 (75.43) | +12.01% |     +9.44% (6.8 pp) |
| throughput/25000/values.tail            |              210.66 (8.7) |            214.62 (11.11) |  +1.88% |    +1.88% (2.48 pp) |
| lifecycle/scaleUp/apply.random          |         3,952.09 (515.77) |           3,467.22 (62.8) | -12.27% |   -12.27% (16.9 pp) |
| lifecycle/scaleUp/insert.head           |            782.15 (50.07) |            775.99 (51.02) |  -0.79% |    -1.12% (4.37 pp) |
| lifecycle/scaleUp/insert.random         |          1,693.62 (69.28) |         1,681.52 (131.28) |  -0.71% |    -1.97% (6.42 pp) |
| lifecycle/scaleUp/insert.tail           |              813.1 (97.7) |            697.17 (86.57) | -14.26% |    -3.81% (0.52 pp) |
| lifecycle/scaleUp/remove.random         |         2,470.14 (113.52) |           2,449.94 (22.8) |  -0.82% |     -3.97% (3.8 pp) |
| lifecycle/scaleUp/replace.head          |          2,592.26 (346.7) |         2,295.14 (119.08) | -11.46% |  -11.46% (11.04 pp) |
| lifecycle/scaleUp/replace.random        |          3,439.4 (332.82) |          3,189.05 (206.9) |  -7.28% |  -10.87% (14.72 pp) |
| lifecycle/scaleUp/replace.tail          |           2,237.9 (27.66) |         2,519.31 (378.59) | +12.57% |  +16.08% (17.88 pp) |
| lifecycle/scaleUp/value.head            |              314.4 (5.01) |             307.23 (8.67) |  -2.28% |    -3.09% (4.86 pp) |
| lifecycle/scaleUp/value.random          |          1,002.44 (84.89) |             982.74 (9.96) |  -1.97% |    -7.43% (6.84 pp) |
| lifecycle/scaleUp/value.tail            |            152.66 (11.28) |             146.62 (1.81) |  -3.95% |     -9.24% (8.3 pp) |
| lifecycle/scaleDown/apply.random        |         3,512.28 (350.18) |          3,217.15 (54.73) |  -8.40% |    -7.04% (8.28 pp) |
| lifecycle/scaleDown/insert.random       |         1,601.13 (169.24) |           1,565.83 (8.98) |  -2.20% |    -1.96% (9.43 pp) |
| lifecycle/scaleDown/remove.head         |         1,830.37 (347.28) |          1,812.31 (22.18) |  -0.99% |   -1.85% (16.99 pp) |
| lifecycle/scaleDown/remove.random       |         2,679.43 (310.48) |          2,428.38 (47.55) |  -9.37% |   -7.81% (11.94 pp) |
| lifecycle/scaleDown/remove.tail         |         1,658.29 (262.12) |          1,642.9 (696.93) |  -0.93% |   +1.85% (22.69 pp) |
| lifecycle/scaleDown/replace.head        |          2,647.58 (62.82) |          2,345.51 (44.18) | -11.41% |  -10.98% (12.15 pp) |
| lifecycle/scaleDown/replace.random      |        2,928.91 (1,487.2) |         3,309.26 (325.82) | +12.99% |   +2.51% (27.52 pp) |
| lifecycle/scaleDown/replace.tail        |      17,845.66 (2,944.61) |        17,655.09 (342.27) |  -1.07% |   -0.87% (13.29 pp) |
| lifecycle/scaleDown/value.head          |            393.73 (50.96) |              398.51 (6.3) |  +1.22% |   +1.42% (13.78 pp) |
| lifecycle/scaleDown/value.random        |            971.58 (82.51) |             950.7 (22.68) |  -2.15% |    -2.15% (7.92 pp) |
| lifecycle/scaleDown/value.tail          |             220.46 (7.33) |             212.82 (4.85) |  -3.47% |    -2.34% (8.16 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,732.19 (145.19) |          3,366.17 (35.85) |  -9.81% |    -9.81% (1.25 pp) |
| lifecycle/fullLifecycle/insert.head     |            782.15 (50.07) |            775.99 (51.02) |  -0.79% |    -1.12% (4.37 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,647.38 (107.93) |          1,622.71 (60.12) |  -1.50% |   -0.69% (11.12 pp) |
| lifecycle/fullLifecycle/insert.tail     |              813.1 (97.7) |            697.17 (86.57) | -14.26% |    -3.81% (0.52 pp) |
| lifecycle/fullLifecycle/remove.head     |         1,830.37 (347.28) |          1,812.31 (22.18) |  -0.99% |   -1.85% (16.99 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,572.83 (330.41) |         2,460.05 (138.41) |  -4.38% |    -4.38% (6.61 pp) |
| lifecycle/fullLifecycle/remove.tail     |         1,658.29 (262.12) |          1,642.9 (696.93) |  -0.93% |   +1.85% (22.69 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,606.01 (222.59) |         2,361.91 (154.65) |  -9.37% |  -12.78% (10.73 pp) |
| lifecycle/fullLifecycle/replace.random  |       3,181.91 (1,289.63) |          3,243.38 (70.15) |  +1.93% |   +0.59% (28.25 pp) |
| lifecycle/fullLifecycle/replace.tail    |      10,036.55 (1,808.57) |         10,048.02 (83.26) |  +0.11% |   -0.32% (15.34 pp) |
| lifecycle/fullLifecycle/value.head      |            352.72 (46.79) |             350.23 (4.81) |  -0.70% |   -0.57% (13.26 pp) |
| lifecycle/fullLifecycle/value.random    |          1,022.7 (110.31) |             964.98 (7.61) |  -5.64% |   -5.64% (10.12 pp) |
| lifecycle/fullLifecycle/value.tail      |             190.82 (9.45) |             181.95 (7.56) |  -4.65% |    -4.65% (10.1 pp) |
| checkpoint/up/1000/create               |          382,600 (14,600) |          357,600 (23,600) |  -6.53% |    -8.11% (3.25 pp) |
| checkpoint/up/1000/sequence             |       2,460,700 (417,400) |       2,452,400 (261,500) |  -0.34% |    -3.30% (4.29 pp) |
| checkpoint/up/1000/values               |        1,771,700 (34,000) |       1,772,400 (211,900) |  +0.04% |   +4.89% (12.35 pp) |
| checkpoint/up/5000/create               |          847,400 (53,900) |          826,100 (91,900) |  -2.51% |    -2.51% (19.6 pp) |
| checkpoint/up/5000/sequence             |       7,738,600 (270,400) |       8,049,100 (620,800) |  +4.01% |    +3.62% (12.9 pp) |
| checkpoint/up/5000/values               |       4,759,800 (272,300) |       4,622,600 (269,800) |  -2.88% |   -2.88% (12.13 pp) |
| checkpoint/up/10000/create              |        1,679,300 (44,400) |        1,490,400 (41,800) | -11.25% |    -12.65% (4.2 pp) |
| checkpoint/up/10000/sequence            |    12,709,100 (1,905,200) |      12,301,700 (257,800) |  -3.21% |   -3.18% (17.48 pp) |
| checkpoint/up/10000/values              |      20,030,200 (468,500) |      20,048,400 (263,100) |  +0.09% |    +1.31% (4.79 pp) |
| checkpoint/up/15000/create              |       2,344,400 (209,500) |       2,381,200 (112,500) |  +1.57% |       -2.50% (4 pp) |
| checkpoint/up/15000/sequence            |    15,183,700 (2,565,200) |    14,079,500 (1,983,000) |  -7.27% |    +0.24% (9.75 pp) |
| checkpoint/up/15000/values              |    29,907,200 (2,118,000) |      28,409,300 (566,100) |  -5.01% |   -5.01% (12.28 pp) |
| checkpoint/up/20000/create              |       3,322,500 (121,700) |       3,264,300 (197,800) |  -1.75% |    -2.02% (7.08 pp) |
| checkpoint/up/20000/sequence            |      19,624,700 (205,800) |    19,915,600 (3,455,200) |  +1.48% |    +0.53% (0.58 pp) |
| checkpoint/up/20000/values              |      10,367,200 (455,800) |    10,101,100 (1,517,200) |  -2.57% |    +4.76% (14.2 pp) |
| checkpoint/up/25000/create              |        3,879,000 (53,400) |        3,828,500 (30,500) |  -1.30% |    -0.68% (1.13 pp) |
| checkpoint/up/25000/sequence            |      22,136,600 (760,100) |      21,445,000 (120,500) |  -3.12% |    -1.15% (2.24 pp) |
| checkpoint/up/25000/values              |      10,884,400 (627,800) |      10,470,800 (823,700) |  -3.80% |    +1.48% (8.78 pp) |
| checkpoint/down/20000/create            |     3,646,800 (1,392,300) |        3,307,900 (35,900) |  -9.29% |   -8.77% (29.33 pp) |
| checkpoint/down/20000/sequence          |    18,462,400 (4,617,600) |      17,433,900 (504,700) |  -5.57% |   -6.36% (16.58 pp) |
| checkpoint/down/20000/values            |     9,051,000 (2,026,800) |       8,196,700 (301,500) |  -9.44% |   -9.44% (17.59 pp) |
| checkpoint/down/15000/create            |        2,391,800 (44,900) |        2,353,200 (69,800) |  -1.61% |    -0.71% (4.82 pp) |
| checkpoint/down/15000/sequence          |      15,256,100 (868,300) |      14,482,500 (426,400) |  -5.07% |    -6.29% (6.07 pp) |
| checkpoint/down/15000/values            |       7,066,200 (155,600) |       6,803,200 (279,500) |  -3.72% |    -1.90% (5.67 pp) |
| checkpoint/down/10000/create            |         1,633,900 (7,000) |        1,638,900 (51,500) |  +0.31% |    -2.85% (5.11 pp) |
| checkpoint/down/10000/sequence          |      11,920,700 (694,600) |      11,726,800 (463,200) |  -1.63% |    -2.12% (3.12 pp) |
| checkpoint/down/10000/values            |       5,930,200 (964,300) |       5,226,400 (284,100) | -11.87% |  -11.87% (11.02 pp) |
| checkpoint/down/5000/create             |          791,700 (21,400) |          783,400 (22,500) |  -1.05% |    -1.23% (3.77 pp) |
| checkpoint/down/5000/sequence           |       9,528,400 (501,200) |       9,278,300 (352,300) |  -2.62% |    -1.67% (7.92 pp) |
| checkpoint/down/5000/values             |       2,654,800 (344,300) |        3,080,300 (67,100) | +16.03% |  +11.01% (16.06 pp) |
| checkpoint/down/1000/create             |           152,000 (1,700) |           154,500 (2,700) |  +1.64% |     +0.65% (2.3 pp) |
| checkpoint/down/1000/sequence           |         5,670,300 (9,500) |       5,463,700 (249,500) |  -3.64% |     -1.33% (4.3 pp) |
| checkpoint/down/1000/values             |          479,700 (31,300) |          509,300 (52,100) |  +6.17% |    +2.33% (7.09 pp) |
| checkpoint/down/0/create                |              14,900 (500) |              14,100 (800) |  -5.37% |   -4.08% (15.67 pp) |
| checkpoint/down/0/sequence              |        1,266,400 (64,700) |       1,287,300 (160,700) |  +1.65% |    +2.30% (8.45 pp) |
| checkpoint/down/0/values                |            10,000 (1,300) |              10,700 (700) |  +7.00% |   +8.42% (17.04 pp) |
| tuple/projection/2/create.empty         |            341.99 (15.64) |            355.42 (33.92) |  +3.93% |    +6.28% (8.16 pp) |
| tuple/tuple/2/create.empty              |             418.05 (11.7) |            413.56 (11.64) |  -1.07% |    -0.84% (2.65 pp) |
| tuple/projection/2/create.sequence      |           1,188.94 (3.95) |         1,287.02 (188.45) |  +8.25% |    +8.11% (15.6 pp) |
| tuple/tuple/2/create.sequence           |          1,370.34 (25.39) |          1,445.62 (56.81) |  +5.49% |     +6.24% (5.7 pp) |
| tuple/projection/2/replace.random       |            983.17 (31.73) |            983.41 (17.02) |  +0.02% |    +1.41% (8.62 pp) |
| tuple/tuple/2/replace.random            |            689.93 (28.23) |             680.24 (75.2) |  -1.40% |   -3.83% (12.06 pp) |
| tuple/projection/2/apply.replace        |          1,756.87 (93.33) |         1,761.74 (123.21) |  +0.28% |   +0.12% (13.01 pp) |
| tuple/tuple/2/apply.replace             |         1,176.67 (102.05) |          1,179.64 (38.98) |  +0.25% |    +1.88% (2.11 pp) |
| tuple/projection/2/apply.duplicate      |            633.59 (13.29) |             613.76 (8.65) |  -3.13% |     -3.13% (3.6 pp) |
| tuple/tuple/2/apply.duplicate           |            625.15 (33.91) |            619.87 (45.97) |  -0.84% |    -3.31% (2.99 pp) |
| tuple/projection/2/merge.duplicate      |             634.52 (2.17) |            650.81 (63.58) |  +2.57% |    +2.57% (4.35 pp) |
| tuple/tuple/2/merge.duplicate           |               620.88 (16) |            625.92 (18.56) |  +0.81% |    -0.40% (3.06 pp) |
| tuple/projection/2/length               |               7.35 (0.17) |               7.41 (0.58) |  +0.81% |    +0.81% (6.82 pp) |
| tuple/tuple/2/length                    |               7.44 (0.38) |               7.36 (0.45) |  -1.12% |    -0.68% (5.87 pp) |
| tuple/projection/2/value.random         |               29.89 (1.5) |                28.8 (0.8) |  -3.67% |    -1.01% (5.74 pp) |
| tuple/tuple/2/value.random              |              18.79 (0.51) |              18.25 (3.28) |  -2.87% |   +3.40% (10.72 pp) |
| tuple/projection/2/values               |              74.99 (3.66) |              77.91 (5.21) |  +3.89% |    +3.89% (8.45 pp) |
| tuple/tuple/2/values                    |              77.34 (4.97) |              80.32 (3.64) |  +3.85% |    +4.85% (7.98 pp) |
| tuple/projection/2/sequence             |              454.45 (0.6) |            456.54 (92.21) |  +0.46% |   +0.53% (20.35 pp) |
| tuple/tuple/2/sequence                  |             481.16 (23.6) |            484.09 (23.02) |  +0.61% |    -1.87% (4.41 pp) |
| tuple/projection/4/create.empty         |             407.37 (12.2) |            404.21 (15.41) |  -0.77% |   -0.79% (10.19 pp) |
| tuple/tuple/4/create.empty              |            420.66 (15.37) |            423.02 (12.63) |  +0.56% |    -0.16% (1.91 pp) |
| tuple/projection/4/create.sequence      |          1,592.08 (90.78) |          1,583.63 (22.47) |  -0.53% |    +0.13% (1.39 pp) |
| tuple/tuple/4/create.sequence           |          1,526.27 (21.39) |           1,547.33 (45.9) |  +1.38% |     +2.70% (6.2 pp) |
| tuple/projection/4/replace.random       |          1,077.06 (10.88) |          1,125.14 (50.43) |  +4.46% |    +3.67% (7.65 pp) |
| tuple/tuple/4/replace.random            |            633.45 (29.64) |            631.29 (36.67) |  -0.34% |    +3.25% (1.68 pp) |
| tuple/projection/4/apply.replace        |         1,700.45 (130.31) |          1,711.13 (57.72) |  +0.63% |   +0.05% (10.36 pp) |
| tuple/tuple/4/apply.replace             |         1,080.33 (126.71) |          1,062.92 (85.98) |  -1.61% |    -2.92% (5.51 pp) |
| tuple/projection/4/apply.duplicate      |            587.23 (45.65) |            588.86 (53.36) |  +0.28% |   -3.59% (14.18 pp) |
| tuple/tuple/4/apply.duplicate           |            633.85 (46.97) |            602.24 (37.59) |  -4.99% |     -1.94% (3.8 pp) |
| tuple/projection/4/merge.duplicate      |            740.42 (38.48) |            776.52 (70.28) |  +4.87% |    +4.30% (7.24 pp) |
| tuple/tuple/4/merge.duplicate           |            773.71 (17.35) |            792.06 (80.84) |  +2.37% |    +2.37% (8.68 pp) |
| tuple/projection/4/length               |              27.36 (1.98) |               26.7 (0.72) |  -2.43% |    -4.72% (2.21 pp) |
| tuple/tuple/4/length                    |               27.44 (1.5) |              26.02 (0.26) |  -5.17% |    -5.51% (33.7 pp) |
| tuple/projection/4/value.random         |              39.77 (3.76) |              40.75 (2.42) |  +2.46% |    -5.15% (3.51 pp) |
| tuple/tuple/4/value.random              |              17.14 (0.68) |              17.44 (0.78) |  +1.76% |    -0.78% (6.65 pp) |
| tuple/projection/4/values               |             148.2 (23.32) |              144.6 (8.54) |  -2.43% |   -12.19% (15.7 pp) |
| tuple/tuple/4/values                    |            143.11 (16.98) |             143.97 (11.4) |  +0.60% |   -4.07% (20.16 pp) |
| tuple/projection/4/sequence             |            440.91 (36.54) |            446.93 (17.09) |  +1.37% |    -3.80% (7.96 pp) |
| tuple/tuple/4/sequence                  |            535.23 (26.23) |                 541.1 (4) |  +1.10% |   -0.72% (19.15 pp) |
| tuple/projection/8/create.empty         |            434.26 (56.48) |            396.98 (12.57) |  -8.59% |   -8.59% (13.04 pp) |
| tuple/tuple/8/create.empty              |            445.67 (54.66) |             427.51 (24.7) |  -4.08% |    -1.50% (12.6 pp) |
| tuple/projection/8/create.sequence      |           2,200.07 (39.7) |         2,116.45 (130.19) |  -3.80% |    -2.47% (3.85 pp) |
| tuple/tuple/8/create.sequence           |          1,955.29 (86.29) |          1,960.94 (44.97) |  +0.29% |    -0.22% (5.04 pp) |
| tuple/projection/8/replace.random       |          1,164.65 (88.04) |          1,131.78 (54.46) |  -2.82% |    -2.97% (3.04 pp) |
| tuple/tuple/8/replace.random            |             620.74 (50.8) |            618.69 (16.39) |  -0.33% |     -1.33% (8.9 pp) |
| tuple/projection/8/apply.replace        |         1,673.12 (118.19) |          1,695.61 (94.14) |  +1.34% |    +3.41% (6.53 pp) |
| tuple/tuple/8/apply.replace             |            985.02 (51.87) |            974.06 (12.83) |  -1.11% |    -5.08% (4.92 pp) |
| tuple/projection/8/apply.duplicate      |            581.82 (13.98) |            603.52 (13.04) |  +3.73% |    +3.95% (4.34 pp) |
| tuple/tuple/8/apply.duplicate           |            603.68 (39.34) |             601.53 (17.5) |  -0.36% |     -0.09% (5.3 pp) |
| tuple/projection/8/merge.duplicate      |         1,083.21 (167.67) |           1,045.1 (15.73) |  -3.52% |    +0.95% (8.92 pp) |
| tuple/tuple/8/merge.duplicate           |            1,120.9 (45.7) |          1,098.94 (25.99) |  -1.96% |    -1.70% (3.35 pp) |
| tuple/projection/8/length               |              26.28 (0.75) |              26.73 (1.24) |  +1.70% |    -0.02% (0.59 pp) |
| tuple/tuple/8/length                    |               26.41 (2.9) |              25.73 (1.96) |  -2.57% |    -6.40% (9.15 pp) |
| tuple/projection/8/value.random         |              51.52 (3.81) |              52.33 (3.49) |  +1.56% |    +0.11% (1.76 pp) |
| tuple/tuple/8/value.random              |               17.63 (0.3) |              17.78 (1.72) |  +0.81% |    -4.32% (8.18 pp) |
| tuple/projection/8/values               |            226.44 (11.81) |             216.77 (7.16) |  -4.27% |    -3.44% (7.87 pp) |
| tuple/tuple/8/values                    |             203.63 (5.97) |               204.07 (14) |  +0.22% |    -0.30% (10.6 pp) |
| tuple/projection/8/sequence             |             622.56 (16.7) |             624.58 (2.06) |  +0.32% |    +2.63% (4.78 pp) |
| tuple/tuple/8/sequence                  |             682.19 (9.49) |            659.41 (37.67) |  -3.34% |    -4.68% (8.16 pp) |
| tuple/projection/100/create.empty       |             432.78 (27.1) |            437.39 (21.35) |  +1.07% |    -1.79% (2.97 pp) |
| tuple/tuple/100/create.empty            |            459.28 (12.75) |            456.87 (26.15) |  -0.53% |    +0.32% (5.16 pp) |
| tuple/projection/100/create.sequence    |        13,561.62 (432.37) |        13,692.36 (223.85) |  +0.96% |    +1.06% (1.96 pp) |
| tuple/tuple/100/create.sequence         |            11,257.7 (326) |        11,121.12 (164.02) |  -1.21% |     -1.21% (3.1 pp) |
| tuple/projection/100/replace.random     |          1,102.69 (43.56) |          1,120.01 (30.88) |  +1.57% |    +1.54% (1.77 pp) |
| tuple/tuple/100/replace.random          |            684.28 (81.55) |            603.27 (19.56) | -11.84% |  -13.69% (10.48 pp) |
| tuple/projection/100/apply.replace      |          1,743.99 (63.62) |             1,690 (41.19) |  -3.10% |    +0.98% (5.37 pp) |
| tuple/tuple/100/apply.replace           |            961.07 (36.39) |            985.07 (50.52) |  +2.50% |    +0.46% (4.96 pp) |
| tuple/projection/100/apply.duplicate    |             575.4 (42.06) |            596.81 (15.64) |  +3.72% |    +3.97% (2.39 pp) |
| tuple/tuple/100/apply.duplicate         |            595.43 (10.12) |           647.59 (122.48) |  +8.76% |   +6.66% (14.18 pp) |
| tuple/projection/100/merge.duplicate    |          8,743.9 (257.76) |         9,278.91 (711.12) |  +6.12% |   +5.75% (10.26 pp) |
| tuple/tuple/100/merge.duplicate         |        12,597.78 (549.17) |        13,022.44 (816.53) |  +3.37% |    -0.07% (2.61 pp) |
| tuple/projection/100/length             |               26.4 (1.41) |              27.57 (2.41) |  +4.43% |    -2.76% (10.5 pp) |
| tuple/tuple/100/length                  |              26.81 (1.01) |              25.61 (1.67) |  -4.49% |    -7.62% (9.77 pp) |
| tuple/projection/100/value.random       |               78.8 (2.77) |              77.77 (1.43) |  -1.30% |    -2.09% (6.14 pp) |
| tuple/tuple/100/value.random            |              17.61 (0.78) |              17.91 (0.68) |  +1.67% |    +5.82% (9.44 pp) |
| tuple/projection/100/values             |           1,796.11 (28.3) |           1,755.73 (69.4) |  -2.25% |    -1.63% (4.88 pp) |
| tuple/tuple/100/values                  |         1,450.38 (126.89) |         1,496.78 (114.39) |  +3.20% |    -0.87% (1.67 pp) |
| tuple/projection/100/sequence           |         5,988.31 (410.06) |           6,196.35 (19.4) |  +3.47% |    +4.96% (2.15 pp) |
| tuple/tuple/100/sequence                |         5,380.86 (143.73) |          5,360.5 (117.29) |  -0.38% |    -0.20% (0.89 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |     Before |  Candidate | Change |
| ----------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                     |    480,344 |    480,320 | -0.00% |
| memory/up/1000/js                         |    407,560 |    407,560 | +0.00% |
| storage/up/1000/jsonBytes                 |    278,238 |    278,238 | +0.00% |
| storage/up/1000/jsonGzipBytes             |     14,908 |     14,908 | +0.00% |
| storage/up/1000/messagePackBytes          |    165,784 |    165,784 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |     12,641 |     12,641 | +0.00% |
| memory/up/5000/native                     |  2,156,488 |  2,156,480 | -0.00% |
| memory/up/5000/js                         |  2,059,744 |  2,059,744 | +0.00% |
| storage/up/5000/jsonBytes                 |  1,662,776 |  1,662,776 | +0.00% |
| storage/up/5000/jsonGzipBytes             |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes          |    839,612 |    839,612 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |     63,127 |     63,127 | +0.00% |
| memory/up/10000/native                    |  3,567,200 |  3,567,192 | -0.00% |
| memory/up/10000/js                        |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes                |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes            |    152,232 |    152,232 | +0.00% |
| storage/up/10000/messagePackBytes         |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |    127,808 |    127,808 | +0.00% |
| memory/up/15000/native                    |  4,819,528 |  4,819,520 | -0.00% |
| memory/up/15000/js                        |  6,196,128 |  6,196,128 | +0.00% |
| storage/up/15000/jsonBytes                |  5,053,159 |  5,053,159 | +0.00% |
| storage/up/15000/jsonGzipBytes            |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes         |  3,635,106 |  3,635,106 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                    |  6,317,656 |  6,317,648 | -0.00% |
| memory/up/20000/js                        |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes                |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes            |    318,634 |    318,634 | +0.00% |
| storage/up/20000/messagePackBytes         |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |    269,890 |    269,890 | +0.00% |
| memory/up/25000/native                    |  7,541,536 |  7,541,528 | -0.00% |
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
| memory/down/1000/native                   |  2,719,360 |  2,719,352 | -0.00% |
| memory/down/1000/js                       |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes               |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes           |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes        |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |     13,932 |     13,932 | +0.00% |
| memory/down/0/native                      |  1,597,976 |  1,597,968 | -0.00% |
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
