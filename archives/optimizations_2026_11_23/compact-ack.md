# Direct acknowledgement output guard

5 complete matched runs per build. Before: baseline; candidate: compact-ack. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 63 timing medians improve over 5%; 43 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |           770.74 (104.32) |             753.39 (44.4) |  -2.25% |    -2.25% (10.5 pp) |
| throughput/1000/apply.duplicate         |            802.27 (32.03) |             852.26 (4.09) |  +6.23% |   +6.23% (25.31 pp) |
| throughput/5000/apply.duplicate         |            388.66 (25.81) |             387.26 (23.8) |  -0.36% |    +1.37% (6.34 pp) |
| throughput/10000/apply.duplicate        |            353.37 (14.18) |            345.45 (25.86) |  -2.24% |   +0.26% (11.57 pp) |
| throughput/15000/apply.duplicate        |            336.56 (21.22) |            340.53 (12.32) |  +1.18% |   +0.10% (13.16 pp) |
| throughput/20000/apply.duplicate        |            321.12 (28.82) |            332.05 (22.77) |  +3.40% |   -0.82% (11.74 pp) |
| throughput/25000/apply.duplicate        |            314.75 (11.22) |             314.31 (3.08) |  -0.14% |     +0.46% (4.4 pp) |
| throughput/100/apply.duplicateRemove    |         1,544.74 (153.99) |         1,420.15 (108.26) |  -8.07% |    -9.90% (3.86 pp) |
| throughput/1000/apply.duplicateRemove   |             858.4 (35.07) |            890.61 (36.49) |  +3.75% |   +7.88% (15.13 pp) |
| throughput/5000/apply.duplicateRemove   |            774.81 (51.11) |            744.74 (57.85) |  -3.88% |    +2.90% (6.04 pp) |
| throughput/10000/apply.duplicateRemove  |            718.59 (38.34) |            713.63 (157.2) |  -0.69% |    -2.93% (22.7 pp) |
| throughput/15000/apply.duplicateRemove  |            725.74 (48.32) |            652.81 (49.36) | -10.05% |   -8.40% (14.23 pp) |
| throughput/20000/apply.duplicateRemove  |             666.7 (73.05) |             648.24 (67.2) |  -2.77% |    -3.36% (6.42 pp) |
| throughput/25000/apply.duplicateRemove  |            692.03 (97.06) |            643.81 (71.62) |  -6.97% |    -6.02% (8.75 pp) |
| throughput/100/apply.duplicateReplace   |           945.23 (188.21) |         1,079.82 (272.69) | +14.24% |   +5.32% (18.81 pp) |
| throughput/1000/apply.duplicateReplace  |          1,133.61 (14.04) |         1,174.38 (164.06) |  +3.60% |    +2.13% (8.52 pp) |
| throughput/5000/apply.duplicateReplace  |            957.31 (56.36) |            940.84 (20.48) |  -1.72% |   -0.69% (10.12 pp) |
| throughput/10000/apply.duplicateReplace |           885.73 (432.77) |           883.59 (143.19) |  -0.24% |   -0.06% (48.22 pp) |
| throughput/15000/apply.duplicateReplace |             843.31 (19.6) |            883.46 (70.07) |  +4.76% |   +5.31% (13.33 pp) |
| throughput/20000/apply.duplicateReplace |            829.65 (25.15) |           873.88 (119.38) |  +5.33% |    +3.64% (4.54 pp) |
| throughput/25000/apply.duplicateReplace |            865.37 (32.63) |            848.86 (34.61) |  -1.91% |    +0.54% (10.3 pp) |
| throughput/100/apply.insert             |         1,698.14 (147.12) |          1,535.33 (60.78) |  -9.59% |  -12.63% (14.32 pp) |
| throughput/1000/apply.insert            |          1,331.13 (35.35) |         1,346.16 (255.67) |  +1.13% |      +1.93% (15 pp) |
| throughput/5000/apply.insert            |         1,277.11 (102.59) |         1,359.62 (143.53) |  +6.46% |     +7.20% (3.4 pp) |
| throughput/10000/apply.insert           |         1,306.43 (192.82) |         1,292.73 (151.14) |  -1.05% |   +4.06% (27.64 pp) |
| throughput/15000/apply.insert           |          1,177.69 (48.67) |          1,209.58 (75.25) |  +2.71% |    -2.18% (5.12 pp) |
| throughput/20000/apply.insert           |         1,143.08 (104.56) |          1,291.9 (199.35) | +13.02% |     +10.55% (15 pp) |
| throughput/25000/apply.insert           |          1,232.31 (21.83) |         1,224.09 (122.55) |  -0.67% |     -3.52% (9.7 pp) |
| throughput/100/apply.remove             |          1,810.61 (78.12) |          1,608.88 (197.5) | -11.14% |   -10.70% (7.19 pp) |
| throughput/1000/apply.remove            |          1,492.84 (88.29) |          1,546.64 (94.56) |  +3.60% |   +7.17% (21.96 pp) |
| throughput/5000/apply.remove            |           1,472.55 (4.67) |          1,489.78 (41.17) |  +1.17% |    -0.30% (9.41 pp) |
| throughput/10000/apply.remove           |          1,505.72 (58.84) |          1,437.25 (94.74) |  -4.55% |    -6.96% (8.44 pp) |
| throughput/15000/apply.remove           |          1,498.66 (54.87) |          1,511.44 (58.57) |  +0.85% |    -1.40% (5.85 pp) |
| throughput/20000/apply.remove           |          1,490.15 (14.38) |         1,536.91 (248.36) |  +3.14% |   +3.96% (10.72 pp) |
| throughput/25000/apply.remove           |          1,487.47 (36.77) |          1,487.24 (91.88) |  -0.02% |    +1.02% (5.59 pp) |
| throughput/100/apply.replace            |         2,631.52 (593.45) |         2,358.88 (129.51) | -10.36% |   -8.92% (23.83 pp) |
| throughput/1000/apply.replace           |          2,744.59 (37.78) |          2,716.25 (209.6) |  -1.03% |    -1.01% (8.95 pp) |
| throughput/5000/apply.replace           |          2,699.24 (148.9) |           2,665.4 (53.19) |  -1.25% |     +0.38% (4.7 pp) |
| throughput/10000/apply.replace          |         2,736.87 (113.33) |         2,664.22 (109.25) |  -2.65% |    -2.25% (1.39 pp) |
| throughput/15000/apply.replace          |         2,755.19 (217.46) |         2,702.52 (312.31) |  -1.91% |   -0.07% (13.22 pp) |
| throughput/20000/apply.replace          |         2,787.45 (189.02) |         2,660.55 (183.08) |  -4.55% |    -3.29% (2.22 pp) |
| throughput/25000/apply.replace          |          2,593.8 (128.76) |         2,723.04 (169.95) |  +4.98% |    +4.98% (8.26 pp) |
| throughput/100/create.empty             |           554.51 (137.29) |            576.66 (35.09) |  +3.99% |   -4.41% (35.89 pp) |
| throughput/1000/create.empty            |            701.5 (106.19) |             733.8 (32.46) |  +4.60% |  +17.18% (13.32 pp) |
| throughput/5000/create.empty            |            731.95 (29.47) |            771.71 (25.38) |  +5.43% |   +8.59% (18.01 pp) |
| throughput/10000/create.empty           |             739.7 (83.17) |            731.58 (81.42) |  -1.10% |    +1.81% (12.9 pp) |
| throughput/15000/create.empty           |            765.87 (97.81) |            760.25 (14.42) |  -0.73% |    +2.50% (8.42 pp) |
| throughput/20000/create.empty           |           716.92 (113.75) |            698.58 (35.48) |  -2.56% |   +0.72% (18.83 pp) |
| throughput/25000/create.empty           |           711.55 (111.23) |            718.19 (46.05) |  +0.93% |   +2.31% (22.71 pp) |
| throughput/100/create.sequence          |         1,608.79 (115.16) |          1,463.94 (31.23) |  -9.00% |    -3.57% (9.23 pp) |
| throughput/1000/create.sequence         |         1,712.55 (246.83) |         1,928.63 (193.33) | +12.62% |  +13.59% (10.98 pp) |
| throughput/5000/create.sequence         |         1,616.65 (195.86) |          1,611.22 (88.66) |  -0.34% |     -0.34% (5.7 pp) |
| throughput/10000/create.sequence        |         1,703.38 (367.59) |          1,785.07 (96.36) |  +4.80% |    +8.40% (9.21 pp) |
| throughput/15000/create.sequence        |         1,402.93 (196.78) |         1,541.84 (148.24) |  +9.90% |    -0.48% (5.45 pp) |
| throughput/20000/create.sequence        |          1,504.75 (242.6) |          1,704.11 (99.15) | +13.25% |  +19.23% (11.63 pp) |
| throughput/25000/create.sequence        |          1,504.9 (421.78) |          1,468.46 (320.9) |  -2.42% |    -2.42% (4.01 pp) |
| throughput/100/insert.head              |            487.98 (56.96) |            502.59 (50.55) |  +2.99% |   +1.87% (14.18 pp) |
| throughput/1000/insert.head             |            486.73 (48.36) |            538.73 (59.12) | +10.68% |   +7.89% (13.12 pp) |
| throughput/5000/insert.head             |            508.74 (20.68) |            509.48 (10.76) |  +0.15% |    +1.75% (3.85 pp) |
| throughput/10000/insert.head            |            508.22 (28.75) |            522.67 (37.72) |  +2.84% |    -2.56% (12.4 pp) |
| throughput/15000/insert.head            |             488.81 (84.1) |            503.97 (31.53) |  +3.10% |    -1.81% (8.95 pp) |
| throughput/20000/insert.head            |            483.14 (22.81) |             522.85 (24.3) |  +8.22% |    +8.42% (8.99 pp) |
| throughput/25000/insert.head            |             460.09 (4.27) |            503.88 (45.13) |  +9.52% |   +1.79% (16.67 pp) |
| throughput/100/insert.middle            |           564.32 (169.27) |            568.07 (16.52) |  +0.66% |   -0.75% (30.29 pp) |
| throughput/1000/insert.middle           |            592.86 (25.22) |            629.55 (20.59) |  +6.19% |    +6.19% (3.53 pp) |
| throughput/5000/insert.middle           |             577.65 (19.4) |             586.45 (21.5) |  +1.52% |    +2.97% (7.59 pp) |
| throughput/10000/insert.middle          |            631.62 (68.69) |            610.53 (21.54) |  -3.34% |    -3.27% (8.09 pp) |
| throughput/15000/insert.middle          |            557.07 (17.56) |            603.24 (55.42) |  +8.29% |   +4.10% (11.75 pp) |
| throughput/20000/insert.middle          |              566.18 (6.5) |             563.89 (3.28) |  -0.40% |     -0.85% (2.9 pp) |
| throughput/25000/insert.middle          |              551.5 (7.11) |            549.88 (37.14) |  -0.29% |   +0.24% (10.15 pp) |
| throughput/100/insert.random            |           858.91 (215.11) |            833.42 (27.81) |  -2.97% |   -2.97% (26.49 pp) |
| throughput/1000/insert.random           |            868.43 (90.16) |             907.72 (27.7) |  +4.52% |    +9.26% (6.75 pp) |
| throughput/5000/insert.random           |            882.57 (32.65) |            884.43 (18.91) |  +0.21% |    +1.20% (5.24 pp) |
| throughput/10000/insert.random          |            896.82 (72.59) |            870.52 (19.24) |  -2.93% |    -5.95% (5.03 pp) |
| throughput/15000/insert.random          |            868.91 (51.13) |            814.86 (25.33) |  -6.22% |    -3.88% (5.13 pp) |
| throughput/20000/insert.random          |                832.5 (29) |            838.74 (92.94) |  +0.75% |   +2.61% (11.04 pp) |
| throughput/25000/insert.random          |            819.29 (64.99) |              853.3 (74.1) |  +4.15% |    +4.15% (5.57 pp) |
| throughput/100/insert.sameIndex         |            567.55 (20.67) |            561.53 (97.21) |  -1.06% |   +1.94% (17.82 pp) |
| throughput/1000/insert.sameIndex        |            578.07 (46.47) |            550.31 (16.39) |  -4.80% |   -4.88% (15.06 pp) |
| throughput/5000/insert.sameIndex        |            550.97 (18.27) |            552.07 (21.76) |  +0.20% |    -0.62% (7.36 pp) |
| throughput/10000/insert.sameIndex       |            597.93 (17.38) |            526.95 (71.47) | -11.87% |   -11.87% (2.64 pp) |
| throughput/15000/insert.sameIndex       |            500.15 (73.81) |            536.23 (64.16) |  +7.21% |   -2.45% (21.96 pp) |
| throughput/20000/insert.sameIndex       |            526.02 (57.05) |            560.97 (53.94) |  +6.64% |   +8.35% (13.29 pp) |
| throughput/25000/insert.sameIndex       |            495.96 (39.91) |            490.56 (16.39) |  -1.09% |   -1.09% (11.54 pp) |
| throughput/100/insert.tail              |            792.94 (31.85) |             771.9 (86.83) |  -2.65% |   -2.65% (10.57 pp) |
| throughput/1000/insert.tail             |           795.79 (121.34) |            865.61 (78.52) |  +8.77% |    +1.70% (5.99 pp) |
| throughput/5000/insert.tail             |            916.43 (13.79) |           931.76 (188.63) |  +1.67% |   -8.31% (19.21 pp) |
| throughput/10000/insert.tail            |             829.54 (73.2) |           766.02 (111.83) |  -7.66% |    +0.30% (12.9 pp) |
| throughput/15000/insert.tail            |           780.24 (148.81) |            757.85 (59.91) |  -2.87% |    -2.87% (6.87 pp) |
| throughput/20000/insert.tail            |            797.54 (77.43) |            807.71 (55.65) |  +1.28% |    +5.56% (8.68 pp) |
| throughput/25000/insert.tail            |           840.34 (176.95) |           817.59 (129.57) |  -2.71% |    -1.66% (6.91 pp) |
| throughput/100/length                   |             117.35 (4.22) |             104.05 (6.28) | -11.33% |  -10.37% (12.26 pp) |
| throughput/1000/length                  |             106.63 (5.49) |             109.16 (6.41) |  +2.37% |    +0.10% (3.75 pp) |
| throughput/5000/length                  |             111.16 (5.76) |             112.11 (2.49) |  +0.85% |   +0.85% (10.09 pp) |
| throughput/10000/length                 |             109.68 (8.29) |             110.35 (5.06) |  +0.61% |    -5.48% (6.31 pp) |
| throughput/15000/length                 |            112.27 (12.97) |             104.79 (5.92) |  -6.66% |    -3.72% (6.28 pp) |
| throughput/20000/length                 |             104.61 (5.45) |            107.17 (11.49) |  +2.45% |    +2.45% (5.56 pp) |
| throughput/25000/length                 |             102.22 (8.67) |             100.42 (3.45) |  -1.76% |    -5.51% (6.88 pp) |
| throughput/100/merge.duplicate          |           909.49 (128.37) |            841.19 (46.84) |  -7.51% |  -12.19% (11.91 pp) |
| throughput/1000/merge.duplicate         |            695.73 (50.95) |            677.13 (19.37) |  -2.67% |    +2.33% (4.68 pp) |
| throughput/5000/merge.duplicate         |              642.2 (2.95) |            668.12 (19.94) |  +4.04% |    +4.04% (6.92 pp) |
| throughput/10000/merge.duplicate        |            633.31 (112.1) |             647.7 (11.43) |  +2.27% |   +4.94% (18.88 pp) |
| throughput/15000/merge.duplicate        |             578.1 (17.41) |            598.83 (70.39) |  +3.59% |    +1.12% (7.94 pp) |
| throughput/20000/merge.duplicate        |            616.66 (17.71) |            595.62 (10.06) |  -3.41% |     -3.41% (6.5 pp) |
| throughput/25000/merge.duplicate        |            591.46 (47.56) |            578.79 (13.68) |  -2.14% |   -0.72% (12.66 pp) |
| throughput/100/merge.insert             |           1,768.39 (7.73) |          1,815.4 (340.46) |  +2.66% |   +2.42% (14.74 pp) |
| throughput/1000/merge.insert            |          1,505.21 (71.42) |         1,498.11 (110.55) |  -0.47% |    -1.74% (6.64 pp) |
| throughput/5000/merge.insert            |         1,471.74 (169.07) |             1,564 (64.65) |  +6.27% |    +5.06% (8.11 pp) |
| throughput/10000/merge.insert           |         1,586.25 (172.74) |          1,491.7 (129.28) |  -5.96% |    -6.82% (9.27 pp) |
| throughput/15000/merge.insert           |          1,443.08 (86.44) |           1,430.2 (90.93) |  -0.89% |       -3.90% (7 pp) |
| throughput/20000/merge.insert           |          1,466.83 (24.18) |          1,577.69 (256.1) |  +7.56% |   +7.56% (20.68 pp) |
| throughput/25000/merge.insert           |         1,269.71 (138.18) |           1,292.89 (50.7) |  +1.83% |    +0.35% (9.35 pp) |
| throughput/100/remove.head              |            742.23 (42.28) |            765.31 (47.51) |  +3.11% |   +3.35% (19.12 pp) |
| throughput/1000/remove.head             |            763.64 (61.05) |            795.43 (51.61) |  +4.16% |    +0.68% (0.29 pp) |
| throughput/5000/remove.head             |             832.2 (20.45) |            817.66 (38.67) |  -1.75% |    -2.59% (1.73 pp) |
| throughput/10000/remove.head            |           886.44 (101.81) |            847.09 (24.57) |  -4.44% |   -5.71% (12.41 pp) |
| throughput/15000/remove.head            |            865.26 (24.33) |            845.62 (48.04) |  -2.27% |   +5.18% (16.49 pp) |
| throughput/20000/remove.head            |             939.5 (55.77) |            943.08 (88.93) |  +0.38% |   +0.38% (15.62 pp) |
| throughput/25000/remove.head            |            927.84 (17.29) |            869.25 (43.91) |  -6.31% |    -7.73% (5.66 pp) |
| throughput/100/remove.middle            |            807.35 (24.98) |           804.68 (124.97) |  -0.33% |      -1.11% (18 pp) |
| throughput/1000/remove.middle           |            815.94 (66.04) |              807.8 (17.2) |  -1.00% |    -1.64% (7.68 pp) |
| throughput/5000/remove.middle           |             817.7 (12.05) |            815.83 (10.28) |  -0.23% |    -0.52% (3.26 pp) |
| throughput/10000/remove.middle          |            810.56 (44.57) |             851.4 (25.43) |  +5.04% |   +3.69% (11.01 pp) |
| throughput/15000/remove.middle          |            836.99 (63.03) |           902.13 (126.22) |  +7.78% |    +1.14% (2.64 pp) |
| throughput/20000/remove.middle          |            905.81 (35.32) |              894.1 (29.6) |  -1.29% |    -0.92% (0.98 pp) |
| throughput/25000/remove.middle          |           878.35 (115.08) |            895.36 (52.51) |  +1.94% |     +1.94% (6.7 pp) |
| throughput/100/remove.random            |           1,074.1 (83.07) |          1,001.33 (46.59) |  -6.77% |    -6.77% (10.1 pp) |
| throughput/1000/remove.random           |          1,183.63 (51.38) |          1,152.44 (37.33) |  -2.64% |    -2.64% (9.85 pp) |
| throughput/5000/remove.random           |          1,172.89 (54.64) |           1,168.8 (72.56) |  -0.35% |   +3.49% (12.08 pp) |
| throughput/10000/remove.random          |          1,239.65 (73.63) |          1,164.37 (41.81) |  -6.07% |   -5.26% (11.65 pp) |
| throughput/15000/remove.random          |          1,173.04 (39.48) |           1,188.2 (69.06) |  +1.29% |    +0.32% (9.17 pp) |
| throughput/20000/remove.random          |          1,234.59 (48.96) |         1,208.67 (117.21) |  -2.10% |   +1.03% (10.34 pp) |
| throughput/25000/remove.random          |          1,167.22 (47.03) |          1,290.08 (24.71) | +10.53% |    +7.98% (8.85 pp) |
| throughput/100/remove.sameIndex         |          1,121.44 (156.2) |           970.72 (208.96) | -13.44% |     +0.72% (7.8 pp) |
| throughput/1000/remove.sameIndex        |            791.98 (25.46) |            839.67 (29.45) |  +6.02% |    +3.53% (6.05 pp) |
| throughput/5000/remove.sameIndex        |            827.51 (32.87) |            824.56 (49.55) |  -0.36% |    -4.39% (9.97 pp) |
| throughput/10000/remove.sameIndex       |           862.48 (108.54) |            886.74 (61.34) |  +2.81% |   -1.80% (16.05 pp) |
| throughput/15000/remove.sameIndex       |             797.5 (47.23) |           812.63 (112.73) |  +1.90% |    +3.15% (7.39 pp) |
| throughput/20000/remove.sameIndex       |            914.52 (45.03) |            870.48 (52.35) |  -4.82% |   +1.79% (10.64 pp) |
| throughput/25000/remove.sameIndex       |            863.61 (83.88) |            894.65 (47.59) |  +3.59% |    -1.43% (5.19 pp) |
| throughput/100/remove.tail              |               787 (43.14) |            761.31 (82.76) |  -3.26% |   -0.87% (20.38 pp) |
| throughput/1000/remove.tail             |            702.72 (62.47) |            709.73 (15.71) |  +1.00% |    -0.73% (2.22 pp) |
| throughput/5000/remove.tail             |            735.73 (37.41) |            718.78 (27.62) |  -2.30% |     -1.03% (8.4 pp) |
| throughput/10000/remove.tail            |           779.51 (182.67) |            738.47 (28.43) |  -5.26% |    -4.29% (3.74 pp) |
| throughput/15000/remove.tail            |            724.84 (49.41) |            754.81 (40.18) |  +4.13% |    +1.20% (8.18 pp) |
| throughput/20000/remove.tail            |            844.82 (94.61) |              886.1 (98.8) |  +4.89% |   -0.85% (14.79 pp) |
| throughput/25000/remove.tail            |             818.88 (87.8) |            790.08 (29.66) |  -3.52% |   -2.39% (14.29 pp) |
| throughput/100/replace.head             |          1,084.75 (77.79) |          1,114.84 (95.12) |  +2.77% |    +2.77% (9.12 pp) |
| throughput/1000/replace.head            |          1,150.03 (26.17) |          1,159.95 (56.48) |  +0.86% |    +1.04% (8.05 pp) |
| throughput/5000/replace.head            |          1,148.24 (35.61) |          1,147.45 (35.93) |  -0.07% |    -0.43% (6.92 pp) |
| throughput/10000/replace.head           |         1,214.06 (286.66) |         1,212.22 (138.38) |  -0.15% |    +3.00% (4.01 pp) |
| throughput/15000/replace.head           |          1,161.57 (93.51) |          1,098.22 (27.93) |  -5.45% |   -6.22% (10.14 pp) |
| throughput/20000/replace.head           |          1,191.44 (63.75) |          1,186.16 (99.07) |  -0.44% |     +0.44% (6.1 pp) |
| throughput/25000/replace.head           |         1,162.01 (214.79) |         1,198.73 (148.41) |  +3.16% |   +0.35% (13.53 pp) |
| throughput/100/replace.middle           |         1,160.02 (119.95) |          1,165.11 (92.58) |  +0.44% |    -0.70% (9.55 pp) |
| throughput/1000/replace.middle          |           1,195.29 (37.9) |          1,213.03 (71.26) |  +1.48% |    +0.19% (3.23 pp) |
| throughput/5000/replace.middle          |           1,169.53 (45.9) |           1,158.7 (62.68) |  -0.93% |   +0.34% (10.22 pp) |
| throughput/10000/replace.middle         |         1,241.91 (304.82) |         1,224.58 (145.21) |  -1.40% |    -0.85% (4.51 pp) |
| throughput/15000/replace.middle         |         1,152.17 (110.04) |          1,156.58 (44.62) |  +0.38% |    -1.66% (5.15 pp) |
| throughput/20000/replace.middle         |         1,269.98 (244.26) |         1,232.89 (188.78) |  -2.92% |   -3.76% (28.45 pp) |
| throughput/25000/replace.middle         |          1,223.14 (29.67) |         1,262.24 (147.32) |  +3.20% |    +2.08% (3.49 pp) |
| throughput/100/replace.random           |         1,683.88 (112.93) |         1,660.46 (190.15) |  -1.39% |   +4.75% (17.88 pp) |
| throughput/1000/replace.random          |          1,838.28 (91.34) |         1,854.84 (167.53) |  +0.90% |   +0.90% (19.79 pp) |
| throughput/5000/replace.random          |          1,678.51 (76.45) |          1,715.03 (73.16) |  +2.18% |    +1.67% (3.44 pp) |
| throughput/10000/replace.random         |          1,673.04 (555.2) |          1,700.02 (17.22) |  +1.61% |    +1.61% (1.21 pp) |
| throughput/15000/replace.random         |            1,648.6 (34.5) |         1,766.56 (138.44) |  +7.16% |    +3.33% (4.96 pp) |
| throughput/20000/replace.random         |          1,844.4 (132.61) |          1,674.44 (61.34) |  -9.21% |    -5.57% (1.87 pp) |
| throughput/25000/replace.random         |           1,773.5 (59.29) |          1,657.81 (53.44) |  -6.52% |   -5.32% (14.69 pp) |
| throughput/100/replace.sameIndex        |          1,149.26 (58.55) |          1,096.94 (85.69) |  -4.55% |   -1.65% (17.43 pp) |
| throughput/1000/replace.sameIndex       |          1,141.09 (48.94) |          1,196.87 (56.78) |  +4.89% |    +7.75% (5.55 pp) |
| throughput/5000/replace.sameIndex       |          1,139.78 (47.53) |          1,130.41 (18.51) |  -0.82% |    +0.47% (6.46 pp) |
| throughput/10000/replace.sameIndex      |         1,137.38 (295.05) |           1,184.3 (56.19) |  +4.13% |   -0.26% (20.46 pp) |
| throughput/15000/replace.sameIndex      |             1,119.89 (87) |          1,110.24 (51.38) |  -0.86% |    -5.72% (11.3 pp) |
| throughput/20000/replace.sameIndex      |          1,208.89 (91.17) |           1,226.4 (99.82) |  +1.45% |    +1.71% (2.67 pp) |
| throughput/25000/replace.sameIndex      |          1,156.47 (71.92) |         1,209.03 (105.59) |  +4.54% |   +0.21% (12.24 pp) |
| throughput/100/replace.tail             |          1,171.19 (76.93) |         1,137.68 (101.95) |  -2.86% |   -0.11% (12.34 pp) |
| throughput/1000/replace.tail            |          1,151.89 (44.79) |          1,207.08 (73.23) |  +4.79% |     +4.79% (7.2 pp) |
| throughput/5000/replace.tail            |         1,116.31 (114.23) |          1,152.71 (39.59) |  +3.26% |    +1.84% (1.21 pp) |
| throughput/10000/replace.tail           |         1,221.07 (182.77) |           1,190.5 (58.01) |  -2.50% |    -0.13% (8.69 pp) |
| throughput/15000/replace.tail           |          1,136.85 (81.63) |           1,162.64 (25.2) |  +2.27% |    +1.99% (1.35 pp) |
| throughput/20000/replace.tail           |         1,276.52 (118.46) |           1,205.35 (38.9) |  -5.58% |   -8.49% (10.13 pp) |
| throughput/25000/replace.tail           |          1,221.37 (45.68) |          1,192.46 (98.48) |  -2.37% |   -2.37% (19.11 pp) |
| throughput/100/retire                   |            209.36 (18.61) |            227.43 (48.64) |  +8.63% |    -3.70% (39.9 pp) |
| throughput/1000/retire                  |             212.09 (3.27) |            216.86 (19.91) |  +2.25% |    +2.73% (9.59 pp) |
| throughput/5000/retire                  |             202.58 (2.09) |             205.85 (4.38) |  +1.61% |    +1.61% (3.58 pp) |
| throughput/10000/retire                 |             201.74 (30.9) |            199.11 (16.81) |  -1.30% |    -5.40% (8.64 pp) |
| throughput/15000/retire                 |            193.21 (24.81) |             191.02 (1.99) |  -1.13% |    -2.24% (9.73 pp) |
| throughput/20000/retire                 |             202.86 (9.33) |                192 (7.21) |  -5.35% |    -5.25% (2.13 pp) |
| throughput/25000/retire                 |             187.48 (5.04) |             184.41 (6.28) |  -1.64% |     +2.70% (6.1 pp) |
| throughput/100/sequence                 |             326.2 (35.84) |            326.97 (27.69) |  +0.24% |   +4.76% (19.97 pp) |
| throughput/1000/sequence                |            297.62 (35.25) |             306.21 (1.76) |  +2.89% |   +2.76% (11.37 pp) |
| throughput/5000/sequence                |            292.04 (18.29) |             280.46 (9.25) |  -3.97% |    -1.37% (9.26 pp) |
| throughput/10000/sequence               |            305.24 (30.59) |            268.76 (13.27) | -11.95% |   -9.09% (14.82 pp) |
| throughput/15000/sequence               |            263.85 (38.08) |            259.64 (24.53) |  -1.60% |   -5.51% (10.15 pp) |
| throughput/20000/sequence               |            263.27 (28.36) |              241.5 (9.19) |  -8.27% |    -8.27% (8.73 pp) |
| throughput/25000/sequence               |             275.08 (9.26) |            259.62 (14.69) |  -5.62% |   -6.99% (10.03 pp) |
| throughput/100/value.head               |             190.27 (7.35) |             187.16 (6.89) |  -1.63% |   +1.03% (12.42 pp) |
| throughput/1000/value.head              |             161.85 (2.96) |             165.42 (8.03) |  +2.21% |    +2.21% (8.17 pp) |
| throughput/5000/value.head              |              141.23 (3.5) |             146.82 (3.97) |  +3.96% |    +0.67% (5.34 pp) |
| throughput/10000/value.head             |             137.82 (4.25) |             144.73 (6.53) |  +5.01% |    +5.01% (5.33 pp) |
| throughput/15000/value.head             |            138.89 (24.44) |             134.98 (4.31) |  -2.82% |   -4.82% (10.59 pp) |
| throughput/20000/value.head             |             134.81 (7.59) |             139.36 (6.05) |  +3.38% |    +3.02% (4.99 pp) |
| throughput/25000/value.head             |            133.88 (12.42) |            133.81 (11.04) |  -0.05% |    +1.61% (8.98 pp) |
| throughput/100/value.middle             |            256.43 (13.56) |            273.46 (22.35) |  +6.64% |    +6.64% (5.92 pp) |
| throughput/1000/value.middle            |            243.72 (24.01) |             245.4 (12.89) |  +0.69% |    -1.21% (7.08 pp) |
| throughput/5000/value.middle            |             224.03 (4.16) |             231.41 (4.92) |  +3.29% |    +1.54% (5.23 pp) |
| throughput/10000/value.middle           |              218.2 (8.52) |             223.21 (4.09) |  +2.30% |    +1.37% (4.55 pp) |
| throughput/15000/value.middle           |            209.38 (14.51) |             210.9 (12.94) |  +0.73% |    +0.73% (13.6 pp) |
| throughput/20000/value.middle           |             208.57 (1.77) |             210.98 (5.59) |  +1.16% |    +0.17% (4.61 pp) |
| throughput/25000/value.middle           |             208.79 (7.45) |             202.91 (2.12) |  -2.82% |    -0.78% (2.58 pp) |
| throughput/100/value.random             |            214.98 (22.32) |             220.6 (14.57) |  +2.61% |   +0.99% (12.59 pp) |
| throughput/1000/value.random            |            232.93 (16.05) |            234.35 (11.98) |  +0.61% |   +0.61% (10.33 pp) |
| throughput/5000/value.random            |            270.39 (16.09) |             274.47 (7.88) |  +1.51% |    -4.97% (8.56 pp) |
| throughput/10000/value.random           |            255.56 (29.08) |            263.31 (16.02) |  +3.03% |   -3.75% (17.31 pp) |
| throughput/15000/value.random           |            255.17 (49.57) |             255.44 (7.68) |  +0.11% |   +3.96% (23.89 pp) |
| throughput/20000/value.random           |             265.2 (17.22) |            260.86 (14.02) |  -1.64% |   -3.62% (14.23 pp) |
| throughput/25000/value.random           |             253.57 (9.93) |             247.97 (4.98) |  -2.21% |    -3.71% (3.26 pp) |
| throughput/100/value.sameIndex          |             191.98 (5.66) |            201.92 (16.57) |  +5.18% |    +4.00% (5.05 pp) |
| throughput/1000/value.sameIndex         |               175 (16.69) |             182.22 (7.17) |  +4.13% |    +1.49% (6.93 pp) |
| throughput/5000/value.sameIndex         |            178.09 (26.76) |            172.26 (12.12) |  -3.27% |    -5.71% (9.89 pp) |
| throughput/10000/value.sameIndex        |            163.08 (37.74) |              163.3 (5.02) |  +0.13% |    -5.23% (5.03 pp) |
| throughput/15000/value.sameIndex        |             181.9 (71.23) |             163.45 (8.22) | -10.14% |   -3.35% (32.64 pp) |
| throughput/20000/value.sameIndex        |             158.93 (4.22) |              163.1 (9.33) |  +2.62% |    +2.62% (5.34 pp) |
| throughput/25000/value.sameIndex        |             158.81 (4.31) |             166.9 (12.13) |  +5.09% |    +9.85% (5.01 pp) |
| throughput/100/value.tail               |            256.94 (29.03) |            268.21 (50.93) |  +4.39% |    -6.75% (34.8 pp) |
| throughput/1000/value.tail              |            228.11 (17.34) |             220.22 (6.45) |  -3.46% |   -3.46% (13.81 pp) |
| throughput/5000/value.tail              |            194.85 (40.81) |             196.14 (8.23) |  +0.66% |   -1.68% (18.04 pp) |
| throughput/10000/value.tail             |             185.1 (24.53) |             183.26 (5.27) |  -0.99% |   -0.91% (14.51 pp) |
| throughput/15000/value.tail             |             194.03 (6.51) |             177.21 (1.94) |  -8.67% |    -8.43% (5.45 pp) |
| throughput/20000/value.tail             |             182.85 (11.3) |             179.08 (6.75) |  -2.06% |    -2.06% (3.48 pp) |
| throughput/25000/value.tail             |            173.72 (12.37) |             173.14 (0.64) |  -0.33% |    +1.21% (9.03 pp) |
| throughput/100/values                   |         4,234.62 (302.33) |           4,233.16 (5.84) |  -0.03% |    -0.11% (2.36 pp) |
| throughput/1000/values                  |     161,097.19 (1,886.79) |     161,896.02 (3,647.87) |  +0.50% |    +0.10% (3.56 pp) |
| throughput/5000/values                  |    483,800.78 (71,216.02) |    498,295.31 (50,575.65) |  +3.00% |   +1.64% (26.01 pp) |
| throughput/10000/values                 |  1,127,203.91 (14,285.16) |  1,009,799.22 (96,245.31) | -10.42% |  -10.42% (20.51 pp) |
| throughput/15000/values                 |  1,619,287.5 (100,154.69) | 1,632,253.91 (215,092.19) |  +0.80% |    +3.45% (7.67 pp) |
| throughput/20000/values                 | 2,239,109.38 (360,057.81) |  2,238,810.94 (60,629.69) |  -0.01% |   +0.33% (16.13 pp) |
| throughput/25000/values                 | 3,187,796.88 (228,710.94) | 2,873,417.19 (212,506.25) |  -9.86% |   -12.81% (11.8 pp) |
| throughput/100/values.head              |            300.64 (18.43) |            299.04 (11.87) |  -0.53% |    -1.76% (7.21 pp) |
| throughput/1000/values.head             |            274.43 (23.24) |             258.23 (9.15) |  -5.90% |   -10.67% (7.13 pp) |
| throughput/5000/values.head             |            259.98 (23.29) |            260.02 (42.48) |  +0.02% |      +6.89% (13 pp) |
| throughput/10000/values.head            |            266.04 (37.61) |            242.25 (22.54) |  -8.94% |   -0.95% (14.06 pp) |
| throughput/15000/values.head            |            243.46 (39.25) |            232.23 (22.53) |  -4.61% |   -1.32% (15.54 pp) |
| throughput/20000/values.head            |            256.77 (12.28) |            251.73 (12.81) |  -1.96% |    +1.76% (7.69 pp) |
| throughput/25000/values.head            |             240.86 (8.46) |            228.75 (25.25) |  -5.03% |    -5.34% (11.7 pp) |
| throughput/100/values.middle            |            285.43 (10.95) |             294.61 (8.86) |  +3.22% |   +3.44% (10.23 pp) |
| throughput/1000/values.middle           |            262.88 (12.16) |            250.16 (15.24) |  -4.84% |    -4.26% (5.92 pp) |
| throughput/5000/values.middle           |             263.17 (3.25) |             258.78 (4.81) |  -1.67% |    -2.16% (4.95 pp) |
| throughput/10000/values.middle          |            239.69 (25.57) |            224.52 (21.38) |  -6.33% |   -4.01% (16.01 pp) |
| throughput/15000/values.middle          |            220.44 (16.88) |            242.53 (29.33) | +10.02% |  +12.57% (24.74 pp) |
| throughput/20000/values.middle          |            261.96 (28.99) |             235.36 (13.9) | -10.15% |    -9.12% (6.02 pp) |
| throughput/25000/values.middle          |              217.76 (4.1) |               214.9 (6.7) |  -1.31% |    -0.68% (9.02 pp) |
| throughput/100/values.random            |            300.74 (15.57) |            292.34 (30.54) |  -2.79% |    +5.09% (5.52 pp) |
| throughput/1000/values.random           |            296.99 (24.61) |             284.43 (8.36) |  -4.23% |   -5.11% (13.45 pp) |
| throughput/5000/values.random           |            337.17 (40.36) |               402 (68.42) | +19.23% |  +12.49% (23.61 pp) |
| throughput/10000/values.random          |             356.35 (30.8) |            401.53 (86.02) | +12.68% |  +12.68% (27.14 pp) |
| throughput/15000/values.random          |           337.77 (109.76) |            336.76 (28.74) |  -0.30% |   -0.30% (34.51 pp) |
| throughput/20000/values.random          |            390.67 (66.43) |            339.58 (10.52) | -13.08% |  -12.49% (16.33 pp) |
| throughput/25000/values.random          |             337.35 (7.93) |            372.61 (85.35) | +10.45% |  +10.64% (28.12 pp) |
| throughput/100/values.sameIndex         |            278.19 (11.46) |             283.73 (5.05) |  +1.99% |   +2.69% (12.65 pp) |
| throughput/1000/values.sameIndex        |             254.58 (4.14) |             256.52 (19.8) |  +0.76% |    +2.21% (8.43 pp) |
| throughput/5000/values.sameIndex        |            263.08 (57.63) |            244.78 (10.68) |  -6.96% |   +0.36% (14.65 pp) |
| throughput/10000/values.sameIndex       |            285.95 (50.17) |            250.17 (12.99) | -12.51% |  -14.54% (11.43 pp) |
| throughput/15000/values.sameIndex       |            223.39 (20.25) |            225.84 (11.99) |  +1.10% |    +1.90% (13.5 pp) |
| throughput/20000/values.sameIndex       |            243.65 (55.46) |            259.84 (21.08) |  +6.64% |  +10.77% (24.85 pp) |
| throughput/25000/values.sameIndex       |             227.96 (7.17) |            224.83 (21.66) |  -1.37% |    +5.75% (11.9 pp) |
| throughput/100/values.tail              |            279.01 (28.04) |            289.15 (20.25) |  +3.63% |    +3.01% (8.59 pp) |
| throughput/1000/values.tail             |            257.16 (14.24) |             251.24 (5.51) |  -2.30% |    -2.30% (7.22 pp) |
| throughput/5000/values.tail             |             253.66 (17.2) |            307.52 (79.58) | +21.23% |   +20.61% (43.2 pp) |
| throughput/10000/values.tail            |            233.04 (12.73) |            225.33 (19.35) |  -3.31% |   +1.21% (11.31 pp) |
| throughput/15000/values.tail            |            259.55 (39.61) |            224.75 (10.37) | -13.41% |  -17.69% (20.92 pp) |
| throughput/20000/values.tail            |             249.2 (43.13) |            223.83 (26.68) | -10.18% |  -10.18% (24.23 pp) |
| throughput/25000/values.tail            |             213.66 (6.31) |            224.29 (12.65) |  +4.98% |    +4.51% (2.65 pp) |
| lifecycle/scaleUp/apply.random          |         3,972.89 (297.05) |          3,783.24 (463.1) |  -4.77% |   -6.27% (12.19 pp) |
| lifecycle/scaleUp/insert.head           |            823.12 (29.21) |            802.38 (47.23) |  -2.52% |    -5.97% (3.65 pp) |
| lifecycle/scaleUp/insert.random         |         1,644.15 (100.95) |         1,602.18 (129.59) |  -2.55% |    -4.65% (2.41 pp) |
| lifecycle/scaleUp/insert.tail           |           833.53 (115.15) |            739.46 (48.71) | -11.29% |   -11.29% (7.16 pp) |
| lifecycle/scaleUp/remove.random         |         2,719.64 (219.86) |         2,621.99 (286.09) |  -3.59% |     -5.68% (6.9 pp) |
| lifecycle/scaleUp/replace.head          |         2,574.55 (262.71) |         2,335.81 (325.27) |  -9.27% |   -5.75% (12.75 pp) |
| lifecycle/scaleUp/replace.random        |          3,443.1 (337.63) |         3,323.02 (228.25) |  -3.49% |    +2.05% (1.08 pp) |
| lifecycle/scaleUp/replace.tail          |          2,275.36 (54.26) |           2,240.6 (53.88) |  -1.53% |    -2.34% (4.66 pp) |
| lifecycle/scaleUp/value.head            |             338.9 (19.38) |            325.23 (19.78) |  -4.03% |    -3.50% (3.06 pp) |
| lifecycle/scaleUp/value.random          |          1,069.56 (19.24) |              996.3 (3.18) |  -6.85% |    -7.52% (1.89 pp) |
| lifecycle/scaleUp/value.tail            |             155.88 (3.16) |              152.9 (3.47) |  -1.91% |    -1.92% (8.73 pp) |
| lifecycle/scaleDown/apply.random        |         3,475.16 (342.15) |          3,219.48 (35.32) |  -7.36% |   -7.36% (13.16 pp) |
| lifecycle/scaleDown/insert.random       |           1,578.9 (45.91) |           1,577.45 (11.8) |  -0.09% |    +0.65% (3.23 pp) |
| lifecycle/scaleDown/remove.head         |         1,815.61 (107.06) |          1,804.82 (42.76) |  -0.59% |    -1.34% (7.75 pp) |
| lifecycle/scaleDown/remove.random       |          2,452.52 (33.29) |         2,531.64 (411.82) |  +3.23% |   +2.51% (17.45 pp) |
| lifecycle/scaleDown/remove.tail         |         1,732.73 (139.26) |         1,676.54 (143.25) |  -3.24% |   +0.40% (10.46 pp) |
| lifecycle/scaleDown/replace.head        |          2,391.4 (101.59) |         2,613.21 (293.98) |  +9.28% |   -0.87% (14.38 pp) |
| lifecycle/scaleDown/replace.random      |         3,006.01 (412.71) |         2,979.73 (292.56) |  -0.87% |    -0.62% (5.02 pp) |
| lifecycle/scaleDown/replace.tail        |         18,016.67 (219.9) |        18,203.08 (749.95) |  +1.03% |    +0.45% (4.81 pp) |
| lifecycle/scaleDown/value.head          |            410.65 (18.52) |            407.06 (22.27) |  -0.87% |    -0.86% (2.74 pp) |
| lifecycle/scaleDown/value.random        |            966.59 (22.54) |             957.53 (18.4) |  -0.94% |    -2.07% (0.61 pp) |
| lifecycle/scaleDown/value.tail          |             224.53 (3.27) |              226.3 (4.73) |  +0.79% |    -0.28% (2.88 pp) |
| lifecycle/fullLifecycle/apply.random    |          3,666.45 (68.42) |         3,541.73 (297.18) |  -3.40% |     -3.40% (6.3 pp) |
| lifecycle/fullLifecycle/insert.head     |            823.12 (29.21) |            802.38 (47.23) |  -2.52% |    -5.97% (3.65 pp) |
| lifecycle/fullLifecycle/insert.random   |          1,637.94 (47.16) |          1,593.55 (58.71) |  -2.71% |    -3.07% (3.85 pp) |
| lifecycle/fullLifecycle/insert.tail     |           833.53 (115.15) |            739.46 (48.71) | -11.29% |   -11.29% (7.16 pp) |
| lifecycle/fullLifecycle/remove.head     |         1,815.61 (107.06) |          1,804.82 (42.76) |  -0.59% |    -1.34% (7.75 pp) |
| lifecycle/fullLifecycle/remove.random   |           2,607.6 (82.05) |         2,636.66 (132.26) |  +1.11% |    +2.39% (5.45 pp) |
| lifecycle/fullLifecycle/remove.tail     |         1,732.73 (139.26) |         1,676.54 (143.25) |  -3.24% |   +0.40% (10.46 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,476.11 (109.47) |           2,476.54 (44.5) |  +0.02% |   +0.02% (10.81 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,314.99 (138.42) |          3,259.73 (52.34) |  -1.67% |    -0.94% (6.55 pp) |
| lifecycle/fullLifecycle/replace.tail    |         10,115.43 (96.65) |             10,236 (14.8) |  +1.19% |    +0.23% (1.34 pp) |
| lifecycle/fullLifecycle/value.head      |            367.07 (19.13) |             357.9 (21.96) |  -2.50% |     -2.45% (1.4 pp) |
| lifecycle/fullLifecycle/value.random    |          1,021.93 (15.44) |             977.32 (1.43) |  -4.36% |    -5.12% (1.57 pp) |
| lifecycle/fullLifecycle/value.tail      |              190.1 (3.33) |             187.28 (1.17) |  -1.48% |    -0.94% (1.84 pp) |
| checkpoint/up/1000/create               |         388,300 (127,700) |          421,200 (27,100) |  +8.47% |   +3.77% (29.03 pp) |
| checkpoint/up/1000/sequence             |       2,661,100 (394,400) |       2,562,300 (165,900) |  -3.71% |   -4.31% (15.24 pp) |
| checkpoint/up/1000/values               |       1,780,800 (137,000) |       1,958,900 (200,100) | +10.00% |   -0.01% (10.95 pp) |
| checkpoint/up/5000/create               |       1,026,400 (383,300) |         861,100 (169,900) | -16.10% |  -18.12% (43.17 pp) |
| checkpoint/up/5000/sequence             |       8,312,100 (463,600) |       7,331,300 (104,400) | -11.80% |   -12.31% (4.06 pp) |
| checkpoint/up/5000/values               |       4,377,500 (320,500) |       4,615,400 (201,600) |  +5.43% |     +5.20% (1.2 pp) |
| checkpoint/up/10000/create              |       1,526,800 (388,900) |        1,475,000 (46,700) |  -3.39% |    -6.51% (21.1 pp) |
| checkpoint/up/10000/sequence            |      13,298,400 (383,400) |      12,124,400 (798,700) |  -8.83% |     -7.71% (9.3 pp) |
| checkpoint/up/10000/values              |    20,231,300 (2,000,200) |      19,790,200 (363,700) |  -2.18% |    -3.97% (9.26 pp) |
| checkpoint/up/15000/create              |        2,436,900 (14,400) |       2,313,100 (164,800) |  -5.08% |    -5.08% (2.71 pp) |
| checkpoint/up/15000/sequence            |    14,469,600 (2,548,600) |    14,017,700 (1,083,600) |  -3.12% |  -10.87% (16.29 pp) |
| checkpoint/up/15000/values              |    29,301,100 (2,810,400) |    28,323,500 (1,196,100) |  -3.34% |    -6.75% (4.57 pp) |
| checkpoint/up/20000/create              |       3,471,000 (258,400) |       3,431,300 (260,600) |  -1.14% |    -1.62% (4.04 pp) |
| checkpoint/up/20000/sequence            |    20,213,400 (2,734,200) |    20,048,300 (1,276,600) |  -0.82% |       -2.76% (2 pp) |
| checkpoint/up/20000/values              |       9,939,600 (389,000) |     9,982,900 (1,218,600) |  +0.44% |     +4.32% (4.3 pp) |
| checkpoint/up/25000/create              |        4,088,400 (71,300) |       3,909,300 (204,500) |  -4.38% |    -4.38% (7.57 pp) |
| checkpoint/up/25000/sequence            |    24,059,300 (3,843,200) |    22,971,600 (1,950,000) |  -4.52% |   -2.35% (15.26 pp) |
| checkpoint/up/25000/values              |      10,686,900 (590,000) |      11,033,500 (315,600) |  +3.24% |    -0.06% (7.19 pp) |
| checkpoint/down/20000/create            |        3,360,000 (37,700) |        3,317,200 (42,800) |  -1.27% |    -1.00% (1.25 pp) |
| checkpoint/down/20000/sequence          |      18,421,200 (795,200) |      17,688,800 (633,500) |  -3.98% |     -0.65% (5.2 pp) |
| checkpoint/down/20000/values            |       8,698,000 (971,100) |       8,872,100 (628,700) |  +2.00% |    -2.18% (9.05 pp) |
| checkpoint/down/15000/create            |       2,402,000 (142,100) |         2,355,700 (6,600) |  -1.93% |    -0.17% (7.29 pp) |
| checkpoint/down/15000/sequence          |      15,096,100 (666,000) |      15,238,800 (746,600) |  +0.95% |   +3.36% (10.73 pp) |
| checkpoint/down/15000/values            |       6,888,400 (193,700) |       6,934,500 (416,300) |  +0.67% |    +2.17% (4.65 pp) |
| checkpoint/down/10000/create            |         1,639,500 (8,700) |        1,647,900 (41,600) |  +0.51% |     +0.74% (2.5 pp) |
| checkpoint/down/10000/sequence          |    12,005,400 (1,959,500) |    12,128,500 (1,631,200) |  +1.03% |   +3.94% (30.05 pp) |
| checkpoint/down/10000/values            |       5,259,100 (493,600) |       5,101,800 (416,400) |  -2.99% |   +0.46% (24.98 pp) |
| checkpoint/down/5000/create             |          772,000 (22,700) |           782,700 (6,600) |  +1.39% |    +1.10% (4.27 pp) |
| checkpoint/down/5000/sequence           |       9,327,700 (708,300) |       9,197,800 (546,100) |  -1.39% |    +0.61% (3.96 pp) |
| checkpoint/down/5000/values             |       2,910,500 (170,800) |       2,915,400 (930,200) |  +0.17% |  -11.87% (30.68 pp) |
| checkpoint/down/1000/create             |          153,700 (41,100) |          153,700 (25,900) |  +0.00% |   -3.43% (20.49 pp) |
| checkpoint/down/1000/sequence           |       5,432,200 (523,900) |       5,942,700 (548,300) |  +9.40% |  +10.11% (18.36 pp) |
| checkpoint/down/1000/values             |          496,100 (11,600) |          461,600 (48,700) |  -6.95% |   -7.48% (13.61 pp) |
| checkpoint/down/0/create                |            14,400 (1,400) |            14,600 (2,200) |  +1.39% |   +1.39% (26.45 pp) |
| checkpoint/down/0/sequence              |       1,294,700 (233,600) |       1,245,300 (222,400) |  -3.82% |    +7.99% (36.3 pp) |
| checkpoint/down/0/values                |            10,700 (1,400) |            10,300 (1,100) |  -3.74% |   -3.06% (13.78 pp) |
| tuple/projection/2/create.empty         |            362.32 (35.43) |              346.6 (7.16) |  -4.34% |    -4.34% (8.93 pp) |
| tuple/tuple/2/create.empty              |            413.23 (22.98) |             434.27 (3.59) |  +5.09% |    +4.82% (5.42 pp) |
| tuple/projection/2/create.sequence      |          1,171.84 (60.41) |          1,230.35 (69.78) |  +4.99% |    +1.71% (0.41 pp) |
| tuple/tuple/2/create.sequence           |          1,380.47 (41.55) |           1,379.3 (88.62) |  -0.08% |    +4.07% (5.78 pp) |
| tuple/projection/2/replace.random       |            998.06 (25.36) |          1,036.75 (22.74) |  +3.88% |    +2.40% (4.92 pp) |
| tuple/tuple/2/replace.random            |               725 (59.29) |            704.21 (20.55) |  -2.87% |    -2.37% (7.28 pp) |
| tuple/projection/2/apply.replace        |         1,767.67 (176.82) |         1,793.14 (218.92) |  +1.44% |    +1.44% (7.24 pp) |
| tuple/tuple/2/apply.replace             |           1,178.9 (57.65) |           1,116.43 (8.28) |  -5.30% |    -3.71% (4.38 pp) |
| tuple/projection/2/apply.duplicate      |             629.04 (9.95) |            606.51 (47.59) |  -3.58% |    -2.79% (8.29 pp) |
| tuple/tuple/2/apply.duplicate           |             640.15 (50.6) |            642.69 (49.32) |  +0.40% |   +7.49% (15.72 pp) |
| tuple/projection/2/merge.duplicate      |            666.17 (54.66) |            662.08 (58.96) |  -0.61% |   -0.61% (17.73 pp) |
| tuple/tuple/2/merge.duplicate           |            663.44 (27.66) |           709.99 (101.19) |  +7.02% |   +1.19% (13.69 pp) |
| tuple/projection/2/length               |               7.54 (0.12) |               7.36 (0.29) |  -2.43% |    -3.60% (2.29 pp) |
| tuple/tuple/2/length                    |                7.3 (0.12) |                7.3 (0.09) |  +0.03% |    -0.32% (1.74 pp) |
| tuple/projection/2/value.random         |              28.84 (2.18) |              28.86 (0.91) |  +0.06% |    -0.27% (4.42 pp) |
| tuple/tuple/2/value.random              |              18.26 (0.08) |              18.77 (0.44) |  +2.83% |     +2.48% (5.5 pp) |
| tuple/projection/2/values               |              76.13 (5.04) |              75.18 (2.71) |  -1.25% |    -1.59% (3.07 pp) |
| tuple/tuple/2/values                    |              76.04 (6.13) |              77.62 (3.63) |  +2.08% |    +1.30% (5.81 pp) |
| tuple/projection/2/sequence             |            441.91 (12.68) |             432.4 (22.58) |  -2.15% |    -0.78% (3.85 pp) |
| tuple/tuple/2/sequence                  |            472.69 (17.18) |            478.91 (14.56) |  +1.32% |    +1.96% (4.08 pp) |
| tuple/projection/4/create.empty         |            400.67 (15.15) |            406.18 (22.89) |  +1.38% |    +2.53% (1.82 pp) |
| tuple/tuple/4/create.empty              |             427.84 (6.76) |             438.64 (7.66) |  +2.52% |    +3.91% (1.56 pp) |
| tuple/projection/4/create.sequence      |            1,665.7 (38.7) |          1,586.04 (98.37) |  -4.78% |    +1.89% (8.28 pp) |
| tuple/tuple/4/create.sequence           |          1,563.55 (21.58) |           1,626.22 (46.6) |  +4.01% |    +3.55% (4.35 pp) |
| tuple/projection/4/replace.random       |          1,140.68 (75.76) |          1,131.58 (44.57) |  -0.80% |    +1.74% (3.94 pp) |
| tuple/tuple/4/replace.random            |            634.79 (29.29) |            625.39 (18.38) |  -1.48% |    +1.33% (2.62 pp) |
| tuple/projection/4/apply.replace        |         1,660.15 (118.18) |          1,658.41 (45.76) |  -0.10% |    -2.55% (5.66 pp) |
| tuple/tuple/4/apply.replace             |          1,037.72 (16.13) |          1,019.16 (31.09) |  -1.79% |       -0.91% (2 pp) |
| tuple/projection/4/apply.duplicate      |            575.56 (12.91) |            555.37 (22.13) |  -3.51% |    -4.74% (0.61 pp) |
| tuple/tuple/4/apply.duplicate           |            601.95 (30.85) |            576.03 (45.62) |  -4.31% |   -4.45% (12.42 pp) |
| tuple/projection/4/merge.duplicate      |            766.48 (29.88) |            749.86 (42.89) |  -2.17% |    -3.42% (5.74 pp) |
| tuple/tuple/4/merge.duplicate           |            790.11 (64.08) |            821.41 (69.55) |  +3.96% |   +3.96% (16.83 pp) |
| tuple/projection/4/length               |              26.97 (1.77) |              28.02 (2.23) |  +3.93% |    +0.89% (6.39 pp) |
| tuple/tuple/4/length                    |              28.99 (3.88) |              27.61 (1.28) |  -4.76% |    -6.37% (6.41 pp) |
| tuple/projection/4/value.random         |              40.71 (0.99) |              42.65 (1.89) |  +4.76% |    +5.26% (9.06 pp) |
| tuple/tuple/4/value.random              |              17.85 (0.05) |              18.46 (0.58) |  +3.41% |    +4.09% (3.98 pp) |
| tuple/projection/4/values               |             144.25 (2.74) |            144.32 (13.28) |  +0.05% |     +0.24% (8.8 pp) |
| tuple/tuple/4/values                    |             141.46 (2.22) |             144.01 (4.23) |  +1.80% |    +2.74% (9.83 pp) |
| tuple/projection/4/sequence             |            476.91 (39.95) |             431.91 (18.2) |  -9.44% |    -6.54% (5.14 pp) |
| tuple/tuple/4/sequence                  |            543.74 (17.85) |            519.15 (19.08) |  -4.52% |    -0.55% (6.38 pp) |
| tuple/projection/8/create.empty         |             401.67 (3.55) |            397.13 (26.91) |  -1.13% |    -1.90% (4.76 pp) |
| tuple/tuple/8/create.empty              |             435.83 (8.33) |            436.37 (28.18) |  +0.12% |    +0.12% (8.47 pp) |
| tuple/projection/8/create.sequence      |          2,256.92 (20.57) |         2,356.06 (124.43) |  +4.39% |      +5.46% (13 pp) |
| tuple/tuple/8/create.sequence           |          2,044.53 (80.22) |          2,035.05 (36.72) |  -0.46% |    -2.26% (7.74 pp) |
| tuple/projection/8/replace.random       |           1,097.6 (84.01) |          1,137.25 (43.14) |  +3.61% |    -2.56% (6.41 pp) |
| tuple/tuple/8/replace.random            |             629.5 (10.42) |            666.61 (53.76) |  +5.89% |       +5.40% (9 pp) |
| tuple/projection/8/apply.replace        |           1,708.6 (73.92) |          1,731.67 (41.14) |  +1.35% |     +1.89% (2.7 pp) |
| tuple/tuple/8/apply.replace             |            985.65 (63.14) |            953.36 (16.56) |  -3.28% |    +0.98% (6.23 pp) |
| tuple/projection/8/apply.duplicate      |            601.87 (22.58) |            562.53 (21.18) |  -6.54% |    -7.07% (2.99 pp) |
| tuple/tuple/8/apply.duplicate           |            602.41 (34.75) |            570.39 (31.69) |  -5.32% |    -4.78% (1.22 pp) |
| tuple/projection/8/merge.duplicate      |          1,036.44 (44.54) |          1,084.57 (38.96) |  +4.64% |    +2.12% (4.89 pp) |
| tuple/tuple/8/merge.duplicate           |          1,153.97 (40.18) |           1,111.7 (18.01) |  -3.66% |    -3.76% (9.53 pp) |
| tuple/projection/8/length               |              27.97 (3.09) |              28.21 (2.12) |  +0.88% |    +5.71% (5.83 pp) |
| tuple/tuple/8/length                    |              26.34 (6.02) |               26.7 (1.03) |  +1.36% |   +3.42% (22.41 pp) |
| tuple/projection/8/value.random         |             53.11 (25.52) |              51.88 (0.48) |  -2.32% |   -2.02% (31.14 pp) |
| tuple/tuple/8/value.random              |              22.56 (5.05) |               17.75 (0.2) | -21.35% |   -7.61% (19.93 pp) |
| tuple/projection/8/values               |             282.77 (63.5) |             220.36 (9.39) | -22.07% |  -20.08% (19.85 pp) |
| tuple/tuple/8/values                    |            260.35 (61.92) |             207.27 (4.87) | -20.39% |  -20.39% (14.85 pp) |
| tuple/projection/8/sequence             |           739.63 (120.11) |             630.89 (5.86) | -14.70% |  -11.47% (15.04 pp) |
| tuple/tuple/8/sequence                  |            763.57 (99.35) |             667.6 (28.87) | -12.57% |    -9.35% (8.73 pp) |
| tuple/projection/100/create.empty       |            454.3 (101.49) |             423.29 (6.73) |  -6.83% |   -8.38% (16.69 pp) |
| tuple/tuple/100/create.empty            |             491.68 (20.5) |              453.3 (9.24) |  -7.81% |    -9.28% (4.33 pp) |
| tuple/projection/100/create.sequence    |         14,250.59 (464.8) |        13,290.99 (139.11) |  -6.73% |    -5.88% (2.83 pp) |
| tuple/tuple/100/create.sequence         |        11,927.45 (594.14) |      11,386.81 (1,858.72) |  -4.53% |   -4.53% (10.79 pp) |
| tuple/projection/100/replace.random     |         1,294.64 (110.04) |          1,158.61 (13.48) | -10.51% |   -10.51% (9.32 pp) |
| tuple/tuple/100/replace.random          |            632.69 (52.18) |             623.81 (1.01) |  -1.40% |    -1.93% (6.16 pp) |
| tuple/projection/100/apply.replace      |          1,739.77 (92.14) |          1,708.44 (22.53) |  -1.80% |     -5.05% (6.8 pp) |
| tuple/tuple/100/apply.replace           |            948.75 (21.33) |            945.68 (44.33) |  -0.32% |    +0.34% (6.33 pp) |
| tuple/projection/100/apply.duplicate    |            643.05 (37.96) |             567.54 (15.4) | -11.74% |   -11.80% (11.9 pp) |
| tuple/tuple/100/apply.duplicate         |            596.07 (22.61) |             568.66 (9.42) |  -4.60% |    -4.82% (2.09 pp) |
| tuple/projection/100/merge.duplicate    |         9,122.45 (101.38) |         8,882.07 (198.65) |  -2.64% |    -3.32% (2.28 pp) |
| tuple/tuple/100/merge.duplicate         |        13,135.72 (674.49) |         12,688.06 (404.1) |  -3.41% |    -0.75% (4.29 pp) |
| tuple/projection/100/length             |              27.64 (7.33) |              26.74 (1.47) |  -3.27% |    -5.47% (24.2 pp) |
| tuple/tuple/100/length                  |              26.38 (1.96) |              28.05 (1.98) |  +6.35% |   -0.25% (14.36 pp) |
| tuple/projection/100/value.random       |               78.12 (2.3) |              78.07 (1.76) |  -0.06% |    -0.42% (1.79 pp) |
| tuple/tuple/100/value.random            |              18.51 (0.41) |              17.73 (0.56) |  -4.20% |    -5.58% (7.33 pp) |
| tuple/projection/100/values             |         1,947.66 (916.05) |         1,916.72 (126.04) |  -1.59% |   -5.20% (35.21 pp) |
| tuple/tuple/100/values                  |         1,558.55 (254.14) |          1,532.41 (71.34) |  -1.68% |   -0.06% (18.46 pp) |
| tuple/projection/100/sequence           |          6,355.9 (852.32) |         6,236.52 (341.36) |  -1.88% |   +3.33% (17.24 pp) |
| tuple/tuple/100/sequence                |         5,552.64 (407.81) |           5,733.8 (66.33) |  +3.26% |    +5.43% (3.92 pp) |

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
