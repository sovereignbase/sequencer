# Batch: final existing API guard

6 complete matched runs per build. Before: batch-base; candidate: batch-pointer. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 15 timing medians improve over 5%; 102 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            766.57 (67.53) |           909.54 (225.41) | +18.65% |  +27.50% (30.88 pp) |
| throughput/1000/apply.duplicate         |            828.05 (25.78) |            887.88 (67.35) |  +7.22% |    +7.67% (10.3 pp) |
| throughput/5000/apply.duplicate         |            377.03 (13.15) |            392.36 (16.13) |  +4.06% |    +5.58% (3.93 pp) |
| throughput/10000/apply.duplicate        |             342.49 (8.45) |            361.57 (26.12) |  +5.57% |    +4.89% (7.61 pp) |
| throughput/15000/apply.duplicate        |            324.73 (13.87) |              341.7 (35.7) |  +5.23% |    +6.64% (14.5 pp) |
| throughput/20000/apply.duplicate        |             320.8 (34.31) |             329.9 (20.79) |  +2.84% |    +3.51% (6.01 pp) |
| throughput/25000/apply.duplicate        |            324.28 (24.82) |            340.66 (62.75) |  +5.05% |   +4.32% (23.02 pp) |
| throughput/100/apply.duplicateRemove    |         1,506.26 (174.76) |         1,564.72 (314.12) |  +3.88% |   +6.50% (16.71 pp) |
| throughput/1000/apply.duplicateRemove   |            861.04 (36.33) |             901.41 (71.3) |  +4.69% |    +3.63% (3.75 pp) |
| throughput/5000/apply.duplicateRemove   |            760.79 (15.25) |             800.6 (39.05) |  +5.23% |    +5.25% (5.87 pp) |
| throughput/10000/apply.duplicateRemove  |            714.67 (20.17) |            754.29 (56.96) |  +5.54% |    +2.11% (5.75 pp) |
| throughput/15000/apply.duplicateRemove  |            686.32 (37.45) |            737.99 (49.37) |  +7.53% |   +7.91% (10.51 pp) |
| throughput/20000/apply.duplicateRemove  |            663.25 (32.56) |            715.54 (16.19) |  +7.88% |    +4.54% (7.94 pp) |
| throughput/25000/apply.duplicateRemove  |              670.22 (102) |            729.35 (99.59) |  +8.82% |   +6.53% (28.76 pp) |
| throughput/100/apply.duplicateReplace   |         1,024.43 (308.06) |           983.44 (199.39) |  -4.00% |   +4.27% (21.52 pp) |
| throughput/1000/apply.duplicateReplace  |         1,105.01 (146.34) |          1,123.58 (224.8) |  +1.68% |   +2.98% (34.22 pp) |
| throughput/5000/apply.duplicateReplace  |            972.17 (66.93) |            988.01 (39.87) |  +1.63% |    +1.56% (7.02 pp) |
| throughput/10000/apply.duplicateReplace |            882.05 (22.65) |            916.76 (40.63) |  +3.94% |    +5.19% (8.14 pp) |
| throughput/15000/apply.duplicateReplace |            840.54 (39.66) |            892.55 (48.36) |  +6.19% |    +5.22% (9.24 pp) |
| throughput/20000/apply.duplicateReplace |            818.92 (66.43) |             863.3 (86.23) |  +5.42% |    +5.21% (7.57 pp) |
| throughput/25000/apply.duplicateReplace |            828.24 (56.42) |             866.3 (78.44) |  +4.60% |    +7.53% (3.89 pp) |
| throughput/100/apply.insert             |          1,552.95 (71.15) |         1,550.15 (166.12) |  -0.18% |    +2.26% (9.79 pp) |
| throughput/1000/apply.insert            |         1,388.75 (117.42) |         1,470.21 (260.27) |  +5.87% |    +7.91% (8.01 pp) |
| throughput/5000/apply.insert            |          1,344.7 (127.36) |         1,353.57 (139.32) |  +0.66% |    -1.03% (2.96 pp) |
| throughput/10000/apply.insert           |         1,279.33 (105.26) |         1,292.06 (119.16) |  +1.00% |    +1.96% (2.44 pp) |
| throughput/15000/apply.insert           |         1,284.42 (143.15) |         1,347.45 (244.61) |  +4.91% |   +0.34% (27.52 pp) |
| throughput/20000/apply.insert           |          1,195.91 (61.01) |         1,280.43 (105.05) |  +7.07% |    +4.06% (8.23 pp) |
| throughput/25000/apply.insert           |          1,186.11 (201.5) |         1,209.51 (106.86) |  +1.97% |   +0.05% (10.18 pp) |
| throughput/100/apply.remove             |          1,779.58 (49.64) |         1,942.13 (277.09) |  +9.13% |   +9.67% (15.66 pp) |
| throughput/1000/apply.remove            |          1,440.77 (18.02) |             1,603.55 (93) | +11.30% |    +9.93% (5.06 pp) |
| throughput/5000/apply.remove            |          1,502.59 (61.75) |          1,498.21 (48.44) |  -0.29% |    -0.31% (9.32 pp) |
| throughput/10000/apply.remove           |          1,462.41 (37.98) |          1,551.76 (21.41) |  +6.11% |    +5.93% (1.97 pp) |
| throughput/15000/apply.remove           |          1,454.88 (74.62) |         1,653.86 (167.65) | +13.68% |    +8.63% (7.85 pp) |
| throughput/20000/apply.remove           |          1,539.14 (63.54) |         1,661.03 (105.31) |  +7.92% |   +10.16% (3.05 pp) |
| throughput/25000/apply.remove           |          1,564.76 (38.57) |         1,568.93 (236.52) |  +0.27% |   +3.58% (12.37 pp) |
| throughput/100/apply.replace            |         2,582.99 (226.43) |       2,574.02 (1,302.08) |  -0.35% |   -1.58% (59.88 pp) |
| throughput/1000/apply.replace           |         2,687.36 (111.42) |         2,842.49 (121.43) |  +5.77% |    +5.14% (9.41 pp) |
| throughput/5000/apply.replace           |          2,741.24 (73.45) |           2,735.2 (96.86) |  -0.22% |    -1.78% (5.09 pp) |
| throughput/10000/apply.replace          |          2,609.04 (174.2) |          2,663.91 (73.25) |  +2.10% |    +3.69% (3.13 pp) |
| throughput/15000/apply.replace          |         2,621.51 (101.49) |             2,827.64 (87) |  +7.86% |    +9.51% (2.87 pp) |
| throughput/20000/apply.replace          |          2,650.41 (130.1) |         3,011.62 (277.64) | +13.63% |   +6.49% (10.77 pp) |
| throughput/25000/apply.replace          |         2,687.48 (134.32) |         2,711.22 (167.97) |  +0.88% |    +3.63% (7.97 pp) |
| throughput/100/create.empty             |            525.78 (15.36) |            565.63 (76.04) |  +7.58% |  +10.34% (10.61 pp) |
| throughput/1000/create.empty            |            680.99 (16.55) |           702.88 (142.32) |  +3.21% |   +8.99% (22.44 pp) |
| throughput/5000/create.empty            |             784.05 (51.4) |            759.98 (64.38) |  -3.07% |    -0.22% (5.97 pp) |
| throughput/10000/create.empty           |            755.33 (69.82) |            798.11 (73.65) |  +5.66% |    +6.29% (8.75 pp) |
| throughput/15000/create.empty           |            723.16 (51.71) |              765.89 (103) |  +5.91% |   +4.31% (14.48 pp) |
| throughput/20000/create.empty           |            710.17 (70.79) |           724.93 (164.88) |  +2.08% |    +4.38% (24.3 pp) |
| throughput/25000/create.empty           |            715.83 (72.36) |            721.86 (98.55) |  +0.84% |    +0.18% (4.93 pp) |
| throughput/100/create.sequence          |          1,656.1 (128.47) |         1,531.89 (149.25) |  -7.50% |   -6.95% (17.13 pp) |
| throughput/1000/create.sequence         |          1,773.42 (57.59) |         1,958.43 (272.44) | +10.43% |  +11.02% (23.92 pp) |
| throughput/5000/create.sequence         |         2,001.74 (789.14) |           1,589.9 (241.5) | -20.57% |   -8.80% (29.41 pp) |
| throughput/10000/create.sequence        |         1,579.59 (171.21) |          1,589.67 (69.02) |  +0.64% |    +2.01% (5.59 pp) |
| throughput/15000/create.sequence        |          1,391.32 (59.18) |          1,471.55 (81.24) |  +5.77% |    +6.34% (7.51 pp) |
| throughput/20000/create.sequence        |         1,452.67 (136.09) |          1,488.3 (191.71) |  +2.45% |   +2.10% (10.83 pp) |
| throughput/25000/create.sequence        |          1,495.2 (214.04) |         1,599.51 (282.96) |  +6.98% |   +7.97% (10.72 pp) |
| throughput/100/insert.head              |            517.61 (15.09) |            530.19 (75.42) |  +2.43% |   +6.26% (11.18 pp) |
| throughput/1000/insert.head             |             517.3 (16.59) |            531.45 (22.28) |  +2.74% |     +3.45% (6.5 pp) |
| throughput/5000/insert.head             |            522.39 (69.95) |            530.19 (30.88) |  +1.49% |   +2.43% (12.89 pp) |
| throughput/10000/insert.head            |            526.79 (29.73) |             519.8 (25.82) |  -1.33% |    +2.17% (8.34 pp) |
| throughput/15000/insert.head            |            492.03 (13.16) |            479.26 (32.27) |  -2.59% |   -1.03% (10.74 pp) |
| throughput/20000/insert.head            |            497.66 (21.54) |            534.07 (31.32) |  +7.31% |    +8.13% (5.45 pp) |
| throughput/25000/insert.head            |            474.28 (43.93) |            486.09 (52.11) |  +2.49% |    -0.12% (3.68 pp) |
| throughput/100/insert.middle            |            562.66 (46.02) |            580.72 (71.63) |  +3.21% |   +6.14% (20.86 pp) |
| throughput/1000/insert.middle           |            623.59 (11.43) |             631.76 (20.2) |  +1.31% |    +0.85% (4.64 pp) |
| throughput/5000/insert.middle           |             619.92 (41.8) |            605.55 (59.69) |  -2.32% |    +1.65% (9.03 pp) |
| throughput/10000/insert.middle          |            601.81 (25.91) |            603.35 (73.88) |  +0.26% |    +3.32% (6.58 pp) |
| throughput/15000/insert.middle          |            586.37 (55.08) |            584.44 (50.31) |  -0.33% |    -3.68% (3.94 pp) |
| throughput/20000/insert.middle          |            574.23 (31.53) |            579.03 (40.88) |  +0.84% |    -0.66% (5.05 pp) |
| throughput/25000/insert.middle          |            540.06 (61.11) |            576.19 (52.17) |  +6.69% |   +5.16% (11.47 pp) |
| throughput/100/insert.random            |            822.89 (86.02) |            846.87 (94.25) |  +2.91% |   +4.58% (22.42 pp) |
| throughput/1000/insert.random           |            902.46 (35.09) |            920.8 (162.38) |  +2.03% |   +3.45% (21.71 pp) |
| throughput/5000/insert.random           |            926.69 (31.09) |            893.02 (42.24) |  -3.63% |    -5.62% (3.61 pp) |
| throughput/10000/insert.random          |            831.79 (26.98) |            915.61 (94.19) | +10.08% |    +8.04% (6.43 pp) |
| throughput/15000/insert.random          |            820.87 (43.76) |            866.18 (87.94) |  +5.52% |    +3.55% (8.16 pp) |
| throughput/20000/insert.random          |            840.32 (28.58) |            851.01 (15.53) |  +1.27% |    +0.51% (3.62 pp) |
| throughput/25000/insert.random          |             836.1 (29.51) |            828.27 (69.56) |  -0.94% |    +1.60% (2.34 pp) |
| throughput/100/insert.sameIndex         |             563.5 (55.77) |            530.85 (19.16) |  -5.79% |   -7.11% (13.36 pp) |
| throughput/1000/insert.sameIndex        |            571.21 (29.32) |            597.66 (62.89) |  +4.63% |    +4.15% (6.28 pp) |
| throughput/5000/insert.sameIndex        |            552.41 (19.26) |            553.59 (26.85) |  +0.21% |     +2.16% (3.9 pp) |
| throughput/10000/insert.sameIndex       |            545.12 (27.45) |            576.03 (53.87) |  +5.67% |    +3.24% (7.75 pp) |
| throughput/15000/insert.sameIndex       |            513.57 (43.46) |            573.84 (64.39) | +11.74% |  +13.70% (15.65 pp) |
| throughput/20000/insert.sameIndex       |            526.45 (27.55) |            536.81 (34.27) |  +1.97% |    +1.12% (8.32 pp) |
| throughput/25000/insert.sameIndex       |             510.6 (14.24) |            494.64 (11.24) |  -3.13% |     -3.02% (1.8 pp) |
| throughput/100/insert.tail              |            788.89 (43.01) |           831.34 (148.77) |  +5.38% |    -0.11% (26.5 pp) |
| throughput/1000/insert.tail             |           856.96 (102.19) |           897.14 (233.37) |  +4.69% |   +7.00% (10.64 pp) |
| throughput/5000/insert.tail             |           869.42 (127.13) |            881.88 (64.96) |  +1.43% |    -1.37% (2.32 pp) |
| throughput/10000/insert.tail            |            883.99 (22.85) |            852.39 (83.99) |  -3.58% |    -4.12% (7.01 pp) |
| throughput/15000/insert.tail            |            719.11 (82.88) |           759.44 (128.01) |  +5.61% |    +3.09% (5.23 pp) |
| throughput/20000/insert.tail            |            840.12 (59.29) |            869.89 (82.04) |  +3.54% |    +5.89% (19.1 pp) |
| throughput/25000/insert.tail            |             754.2 (86.58) |           759.16 (196.32) |  +0.66% |       +4.17% (8 pp) |
| throughput/100/length                   |            118.15 (14.17) |              135.7 (36.3) | +14.85% |  +12.07% (16.77 pp) |
| throughput/1000/length                  |             109.76 (4.77) |             112.62 (9.52) |  +2.60% |    +2.29% (6.16 pp) |
| throughput/5000/length                  |            127.39 (11.75) |             116.81 (6.75) |  -8.31% |    -9.43% (4.68 pp) |
| throughput/10000/length                 |             108.36 (3.08) |             111.48 (2.31) |  +2.88% |    +1.68% (4.51 pp) |
| throughput/15000/length                 |             106.01 (8.93) |            106.44 (10.07) |  +0.41% |    +1.35% (3.28 pp) |
| throughput/20000/length                 |             105.44 (5.16) |             111.28 (5.25) |  +5.54% |    +6.68% (4.36 pp) |
| throughput/25000/length                 |             104.71 (4.08) |             104.93 (8.91) |  +0.21% |    -1.46% (8.51 pp) |
| throughput/100/merge.duplicate          |            803.13 (37.06) |            793.86 (35.48) |  -1.15% |    -0.96% (9.78 pp) |
| throughput/1000/merge.duplicate         |            647.91 (28.61) |            684.92 (47.32) |  +5.71% |   +5.36% (14.01 pp) |
| throughput/5000/merge.duplicate         |            627.74 (42.62) |             655.36 (15.3) |  +4.40% |    +1.43% (3.61 pp) |
| throughput/10000/merge.duplicate        |            619.47 (52.37) |            633.09 (67.82) |  +2.20% |    -0.22% (4.35 pp) |
| throughput/15000/merge.duplicate        |            596.47 (23.33) |            641.29 (99.08) |  +7.51% |   +5.26% (16.09 pp) |
| throughput/20000/merge.duplicate        |            596.16 (63.03) |              620.8 (5.98) |  +4.13% |    +2.94% (8.79 pp) |
| throughput/25000/merge.duplicate        |            587.27 (12.86) |            605.44 (42.34) |  +3.10% |    +0.71% (6.48 pp) |
| throughput/100/merge.insert             |         1,747.01 (107.63) |          1,716.41 (261.3) |  -1.75% |   +3.91% (11.51 pp) |
| throughput/1000/merge.insert            |          1,426.93 (58.65) |          1,545.5 (128.23) |  +8.31% |   +4.74% (14.45 pp) |
| throughput/5000/merge.insert            |          1,559.53 (46.82) |          1,519.17 (93.06) |  -2.59% |    -2.23% (7.86 pp) |
| throughput/10000/merge.insert           |         1,485.93 (170.85) |         1,540.85 (128.73) |  +3.70% |    +3.71% (5.75 pp) |
| throughput/15000/merge.insert           |         1,410.26 (115.25) |          1,524.61 (86.95) |  +8.11% |   +5.05% (10.37 pp) |
| throughput/20000/merge.insert           |         1,504.74 (131.12) |           1,560.01 (70.6) |  +3.67% |    +5.93% (7.29 pp) |
| throughput/25000/merge.insert           |          1,347.87 (70.82) |          1,342.92 (132.5) |  -0.37% |    +0.97% (9.71 pp) |
| throughput/100/remove.head              |           756.51 (174.63) |           811.02 (129.22) |  +7.21% |   +1.88% (30.25 pp) |
| throughput/1000/remove.head             |            785.69 (19.21) |             784.83 (8.24) |  -0.11% |    +0.19% (3.82 pp) |
| throughput/5000/remove.head             |             822.3 (45.47) |            830.26 (13.45) |  +0.97% |     -0.95% (5.3 pp) |
| throughput/10000/remove.head            |            843.78 (20.56) |            875.48 (68.09) |  +3.76% |    +2.04% (5.97 pp) |
| throughput/15000/remove.head            |            839.97 (113.1) |             852.8 (49.48) |  +1.53% |   +1.82% (12.83 pp) |
| throughput/20000/remove.head            |           999.25 (125.32) |             968.05 (49.9) |  -3.12% |   -3.51% (12.79 pp) |
| throughput/25000/remove.head            |           902.44 (132.93) |            882.62 (73.93) |  -2.20% |    -2.27% (7.35 pp) |
| throughput/100/remove.middle            |             741.5 (21.91) |            788.19 (87.27) |  +6.30% |    +5.98% (14.2 pp) |
| throughput/1000/remove.middle           |            788.85 (26.68) |            821.77 (16.54) |  +4.17% |    +3.61% (5.09 pp) |
| throughput/5000/remove.middle           |            815.81 (15.11) |             826.68 (41.4) |  +1.33% |       +1.43% (4 pp) |
| throughput/10000/remove.middle          |            842.99 (41.97) |             904.05 (64.3) |  +7.24% |    +5.32% (3.79 pp) |
| throughput/15000/remove.middle          |            823.63 (86.13) |            859.24 (44.15) |  +4.32% |   +7.69% (14.28 pp) |
| throughput/20000/remove.middle          |            945.92 (51.59) |            978.94 (32.89) |  +3.49% |    +2.41% (5.34 pp) |
| throughput/25000/remove.middle          |            949.35 (61.84) |             884.2 (35.92) |  -6.86% |   -7.04% (10.62 pp) |
| throughput/100/remove.random            |            970.43 (38.36) |         1,006.89 (295.06) |  +3.76% |   +3.82% (21.91 pp) |
| throughput/1000/remove.random           |           1,160.65 (31.1) |             1,169.49 (12) |  +0.76% |    +0.17% (7.54 pp) |
| throughput/5000/remove.random           |           1,171.7 (40.29) |         1,180.73 (123.97) |  +0.77% |   +0.37% (15.58 pp) |
| throughput/10000/remove.random          |          1,139.24 (58.97) |             1,184 (34.19) |  +3.93% |    +4.03% (3.66 pp) |
| throughput/15000/remove.random          |          1,197.99 (23.62) |          1,178.69 (46.36) |  -1.61% |    -4.01% (5.38 pp) |
| throughput/20000/remove.random          |          1,241.26 (51.41) |          1,235.07 (25.64) |  -0.50% |    -1.50% (7.57 pp) |
| throughput/25000/remove.random          |          1,196.87 (69.84) |          1,195.4 (157.18) |  -0.12% |   -0.68% (12.51 pp) |
| throughput/100/remove.sameIndex         |            878.46 (21.38) |          1,112.52 (960.9) | +26.64% | +28.36% (126.66 pp) |
| throughput/1000/remove.sameIndex        |            814.52 (30.74) |              814.69 (6.9) |  +0.02% |    -0.12% (7.37 pp) |
| throughput/5000/remove.sameIndex        |               840.67 (41) |             819.57 (56.6) |  -2.51% |   -3.17% (10.96 pp) |
| throughput/10000/remove.sameIndex       |            835.61 (45.26) |           863.83 (129.35) |  +3.38% |   +3.61% (20.18 pp) |
| throughput/15000/remove.sameIndex       |            824.24 (35.51) |            836.48 (33.34) |  +1.49% |    +4.17% (4.12 pp) |
| throughput/20000/remove.sameIndex       |            940.19 (61.85) |            939.98 (63.55) |  -0.02% |     -0.81% (9.3 pp) |
| throughput/25000/remove.sameIndex       |            938.12 (44.99) |            877.09 (46.31) |  -6.51% |    -6.21% (6.71 pp) |
| throughput/100/remove.tail              |            703.73 (15.68) |           748.49 (600.23) |  +6.36% |  +10.55% (87.13 pp) |
| throughput/1000/remove.tail             |            702.83 (15.73) |             709.9 (12.23) |  +1.01% |    -0.22% (3.47 pp) |
| throughput/5000/remove.tail             |            725.42 (49.64) |            738.42 (36.48) |  +1.79% |    -2.79% (9.21 pp) |
| throughput/10000/remove.tail            |            750.61 (43.82) |            777.83 (67.65) |  +3.63% |    +0.97% (9.53 pp) |
| throughput/15000/remove.tail            |            711.21 (25.82) |             726.86 (55.9) |  +2.20% |    +2.14% (5.81 pp) |
| throughput/20000/remove.tail            |             821.2 (15.42) |            809.07 (24.54) |  -1.48% |    -1.48% (9.48 pp) |
| throughput/25000/remove.tail            |             808.47 (68.6) |            804.06 (44.74) |  -0.55% |    -0.25% (12.1 pp) |
| throughput/100/replace.head             |          1,014.84 (79.01) |         1,096.17 (602.06) |  +8.01% |   +8.82% (40.24 pp) |
| throughput/1000/replace.head            |          1,158.51 (21.66) |          1,172.03 (40.92) |  +1.17% |    +2.57% (2.41 pp) |
| throughput/5000/replace.head            |           1,126.28 (6.85) |          1,163.57 (33.43) |  +3.31% |    +1.57% (4.18 pp) |
| throughput/10000/replace.head           |         1,160.98 (135.14) |          1,225.75 (73.24) |  +5.58% |   +8.72% (17.92 pp) |
| throughput/15000/replace.head           |          1,095.97 (62.07) |          1,121.58 (71.71) |  +2.34% |    +3.29% (6.03 pp) |
| throughput/20000/replace.head           |          1,214.28 (89.98) |          1,183.68 (22.07) |  -2.52% |     -1.82% (5.7 pp) |
| throughput/25000/replace.head           |           1,164.9 (65.77) |         1,144.08 (127.24) |  -1.79% |    +0.11% (8.96 pp) |
| throughput/100/replace.middle           |         1,081.36 (112.48) |         1,198.49 (289.93) | +10.83% |   +4.06% (18.15 pp) |
| throughput/1000/replace.middle          |          1,200.97 (39.73) |          1,218.05 (56.83) |  +1.42% |    +0.28% (6.49 pp) |
| throughput/5000/replace.middle          |           1,160.6 (34.88) |          1,199.92 (31.33) |  +3.39% |     +4.28% (5.9 pp) |
| throughput/10000/replace.middle         |          1,170.64 (96.72) |          1,235.21 (54.05) |  +5.52% |   +2.13% (18.29 pp) |
| throughput/15000/replace.middle         |         1,171.92 (103.21) |          1,188.25 (73.29) |  +1.39% |   +0.35% (12.79 pp) |
| throughput/20000/replace.middle         |          1,272.09 (62.89) |          1,199.13 (41.73) |  -5.74% |    -4.44% (6.52 pp) |
| throughput/25000/replace.middle         |          1,175.81 (56.88) |           1,240.11 (91.7) |  +5.47% |    +3.68% (8.59 pp) |
| throughput/100/replace.random           |           1,566.04 (41.7) |         1,737.75 (248.17) | +10.96% |   +12.50% (14.5 pp) |
| throughput/1000/replace.random          |          1,756.91 (133.4) |          1,768.93 (41.42) |  +0.68% |    -0.65% (7.45 pp) |
| throughput/5000/replace.random          |           1,655.5 (75.62) |          1,729.05 (37.34) |  +4.44% |    +4.37% (4.33 pp) |
| throughput/10000/replace.random         |         1,645.91 (102.33) |         1,817.11 (110.55) | +10.40% |  +11.57% (14.58 pp) |
| throughput/15000/replace.random         |          1,778.53 (151.6) |          1,666.47 (52.15) |  -6.30% |    -6.30% (5.55 pp) |
| throughput/20000/replace.random         |          1,748.64 (93.51) |         1,744.78 (111.77) |  -0.22% |    -3.42% (8.05 pp) |
| throughput/25000/replace.random         |           1,645.72 (44.2) |          1,769.86 (48.76) |  +7.54% |    +6.38% (6.27 pp) |
| throughput/100/replace.sameIndex        |          1,032.96 (34.57) |         1,224.69 (220.51) | +18.56% |  +19.27% (23.16 pp) |
| throughput/1000/replace.sameIndex       |            1,154.4 (24.4) |          1,135.65 (18.96) |  -1.62% |    -0.76% (1.79 pp) |
| throughput/5000/replace.sameIndex       |         1,126.71 (106.11) |          1,141.75 (26.67) |  +1.33% |    +1.10% (8.49 pp) |
| throughput/10000/replace.sameIndex      |          1,128.53 (54.07) |          1,227.25 (36.06) |  +8.75% |     +7.63% (6.2 pp) |
| throughput/15000/replace.sameIndex      |          1,141.95 (46.39) |          1,159.53 (23.27) |  +1.54% |    +1.79% (5.76 pp) |
| throughput/20000/replace.sameIndex      |           1,192.6 (76.12) |         1,212.36 (115.66) |  +1.66% |   +1.27% (15.54 pp) |
| throughput/25000/replace.sameIndex      |         1,198.57 (147.02) |         1,197.09 (136.37) |  -0.12% |    +5.17% (13.4 pp) |
| throughput/100/replace.tail             |           1,060.8 (79.89) |         1,191.41 (225.95) | +12.31% |  +16.24% (26.19 pp) |
| throughput/1000/replace.tail            |          1,186.78 (27.13) |           1,149.75 (5.43) |  -3.12% |    -3.28% (2.07 pp) |
| throughput/5000/replace.tail            |           1,159.67 (41.7) |          1,169.57 (24.13) |  +0.85% |    +0.07% (1.22 pp) |
| throughput/10000/replace.tail           |          1,138.81 (50.01) |          1,188.93 (65.73) |  +4.40% |    +3.32% (3.99 pp) |
| throughput/15000/replace.tail           |          1,108.26 (58.32) |           1,148.4 (83.04) |  +3.62% |   +3.33% (10.63 pp) |
| throughput/20000/replace.tail           |         1,308.73 (131.58) |         1,237.59 (105.96) |  -5.44% |    -0.02% (9.43 pp) |
| throughput/25000/replace.tail           |          1,159.44 (78.57) |          1,150.02 (41.56) |  -0.81% |    -0.78% (6.37 pp) |
| throughput/100/retire                   |            184.98 (21.21) |            212.66 (19.81) | +14.96% |  +12.15% (22.74 pp) |
| throughput/1000/retire                  |             210.44 (5.44) |             218.34 (9.39) |  +3.76% |    +3.35% (7.17 pp) |
| throughput/5000/retire                  |             206.17 (6.58) |            202.07 (12.48) |  -1.99% |     +0.14% (4.6 pp) |
| throughput/10000/retire                 |            196.29 (17.22) |            204.33 (10.07) |  +4.10% |   +4.29% (15.28 pp) |
| throughput/15000/retire                 |             185.23 (9.54) |             189.29 (4.54) |  +2.19% |    +3.05% (8.35 pp) |
| throughput/20000/retire                 |            187.03 (10.95) |            193.88 (12.98) |  +3.66% |    +1.44% (2.22 pp) |
| throughput/25000/retire                 |            184.39 (13.43) |             183.11 (5.43) |  -0.70% |    +0.85% (7.19 pp) |
| throughput/100/sequence                 |            311.66 (94.75) |            329.06 (67.17) |  +5.58% |    +0.98% (16.5 pp) |
| throughput/1000/sequence                |             297.14 (10.4) |             301.21 (9.52) |  +1.37% |    -0.42% (2.33 pp) |
| throughput/5000/sequence                |             276.69 (3.57) |             284.39 (4.46) |  +2.78% |    +3.18% (3.24 pp) |
| throughput/10000/sequence               |            262.03 (19.99) |            271.23 (12.63) |  +3.51% |   +1.69% (14.71 pp) |
| throughput/15000/sequence               |            260.01 (29.84) |            264.49 (25.13) |  +1.72% |   +2.16% (18.64 pp) |
| throughput/20000/sequence               |             243.61 (8.22) |            246.57 (14.45) |  +1.22% |    +0.57% (2.89 pp) |
| throughput/25000/sequence               |            256.65 (10.66) |            269.65 (13.08) |  +5.07% |   +2.41% (10.03 pp) |
| throughput/100/value.head               |            183.85 (13.47) |            197.38 (35.13) |  +7.36% |  +11.33% (26.81 pp) |
| throughput/1000/value.head              |             162.87 (2.65) |             165.25 (3.02) |  +1.46% |    +1.23% (6.06 pp) |
| throughput/5000/value.head              |             141.34 (3.13) |             143.42 (4.69) |  +1.47% |    +0.86% (5.82 pp) |
| throughput/10000/value.head             |             140.69 (6.59) |              141.32 (5.2) |  +0.45% |    +0.42% (4.89 pp) |
| throughput/15000/value.head             |              134.37 (7.4) |            140.06 (15.59) |  +4.23% |   +6.22% (13.18 pp) |
| throughput/20000/value.head             |            136.03 (13.24) |            137.73 (10.97) |  +1.25% |    +0.25% (3.69 pp) |
| throughput/25000/value.head             |               131.5 (7.6) |              127.49 (6.1) |  -3.05% |    -1.62% (5.18 pp) |
| throughput/100/value.middle             |            257.02 (22.04) |           269.92 (112.92) |  +5.02% |   +9.43% (60.83 pp) |
| throughput/1000/value.middle            |             251.58 (7.69) |             249.44 (2.31) |  -0.85% |    -1.33% (5.22 pp) |
| throughput/5000/value.middle            |            224.94 (10.58) |             227.16 (6.78) |  +0.99% |    +1.37% (2.14 pp) |
| throughput/10000/value.middle           |             218.4 (14.84) |             221.3 (11.71) |  +1.33% |   +5.68% (11.28 pp) |
| throughput/15000/value.middle           |             211.6 (18.41) |            215.63 (16.32) |  +1.90% |    -0.60% (8.32 pp) |
| throughput/20000/value.middle           |              205.99 (5.4) |            222.54 (30.36) |  +8.03% |   +8.79% (16.97 pp) |
| throughput/25000/value.middle           |              203.7 (6.56) |            211.06 (12.42) |  +3.61% |    +5.03% (12.5 pp) |
| throughput/100/value.random             |            216.61 (36.26) |           233.18 (189.88) |  +7.65% |  +16.22% (94.73 pp) |
| throughput/1000/value.random            |             221.02 (19.6) |             221.88 (8.18) |  +0.39% |   +0.97% (17.91 pp) |
| throughput/5000/value.random            |            270.47 (10.02) |            265.78 (15.39) |  -1.74% |    -3.11% (8.34 pp) |
| throughput/10000/value.random           |             266.98 (8.14) |            276.99 (17.08) |  +3.75% |    +3.12% (7.13 pp) |
| throughput/15000/value.random           |            262.74 (14.38) |             266.16 (8.44) |  +1.30% |    +0.50% (4.37 pp) |
| throughput/20000/value.random           |            264.37 (15.19) |            265.89 (22.88) |  +0.57% |   +2.36% (12.59 pp) |
| throughput/25000/value.random           |             256.53 (9.14) |             254.36 (95.6) |  -0.85% |      +0.55% (32 pp) |
| throughput/100/value.sameIndex          |             188.63 (9.72) |           206.38 (101.79) |  +9.41% |   +6.92% (64.22 pp) |
| throughput/1000/value.sameIndex         |             182.85 (5.36) |             181.42 (3.86) |  -0.78% |    -1.44% (3.13 pp) |
| throughput/5000/value.sameIndex         |             176.33 (5.56) |              176.7 (9.82) |  +0.21% |    +2.27% (7.63 pp) |
| throughput/10000/value.sameIndex        |             164.39 (3.79) |             168.43 (3.59) |  +2.45% |    +2.26% (6.72 pp) |
| throughput/15000/value.sameIndex        |            151.91 (12.54) |            165.76 (10.98) |  +9.12% |   +9.93% (14.39 pp) |
| throughput/20000/value.sameIndex        |            156.17 (10.92) |             161.89 (4.04) |  +3.67% |    +0.71% (9.94 pp) |
| throughput/25000/value.sameIndex        |              156.1 (4.43) |             156.01 (7.99) |  -0.06% |    +1.98% (6.08 pp) |
| throughput/100/value.tail               |            237.96 (28.81) |           271.41 (151.17) | +14.05% |   +18.26% (65.7 pp) |
| throughput/1000/value.tail              |             211.56 (7.77) |            214.35 (11.23) |  +1.32% |    -0.13% (4.06 pp) |
| throughput/5000/value.tail              |              197.42 (8.3) |              198.61 (5.8) |  +0.60% |    +1.97% (1.98 pp) |
| throughput/10000/value.tail             |             185.32 (6.75) |            192.63 (14.71) |  +3.94% |    +5.22% (7.84 pp) |
| throughput/15000/value.tail             |            180.96 (20.62) |               192.77 (13) |  +6.53% |   +2.48% (14.83 pp) |
| throughput/20000/value.tail             |             175.44 (5.57) |            179.35 (15.02) |  +2.23% |    +1.78% (9.44 pp) |
| throughput/25000/value.tail             |              178.7 (7.31) |             177.29 (7.14) |  -0.79% |    -2.36% (5.76 pp) |
| throughput/100/values                   |          4,029.7 (534.15) |       4,609.36 (1,780.11) | +14.38% |   +8.02% (36.21 pp) |
| throughput/1000/values                  |     160,518.93 (1,475.38) |     161,884.61 (6,030.23) |  +0.85% |    +0.28% (3.82 pp) |
| throughput/5000/values                  |     475,219.53 (2,053.91) |    515,499.28 (58,960.19) |  +8.48% |    +5.79% (7.02 pp) |
| throughput/10000/values                 |  1,117,655.86 (168,187.3) | 1,234,128.52 (291,526.56) | +10.42% |   +4.04% (22.04 pp) |
| throughput/15000/values                 | 1,806,675.39 (611,219.73) | 1,762,878.13 (235,059.57) |  -2.42% |  -12.03% (28.82 pp) |
| throughput/20000/values                 | 2,239,210.94 (184,323.83) | 2,811,530.47 (521,464.45) | +25.56% |  +25.99% (27.06 pp) |
| throughput/25000/values                 | 2,985,204.69 (403,976.17) | 3,236,074.22 (532,575.78) |  +8.40% |   +1.15% (10.33 pp) |
| throughput/100/values.head              |            306.38 (23.66) |            318.61 (93.12) |  +3.99% |   +6.59% (36.01 pp) |
| throughput/1000/values.head             |            260.01 (11.05) |            260.64 (14.19) |  +0.24% |    +2.66% (7.99 pp) |
| throughput/5000/values.head             |              266.26 (8.9) |             269.16 (38.8) |  +1.09% |   -0.66% (15.54 pp) |
| throughput/10000/values.head            |            259.11 (27.85) |             266.06 (24.7) |  +2.68% |   +0.68% (16.21 pp) |
| throughput/15000/values.head            |             254.43 (33.6) |             248.53 (9.75) |  -2.32% |   -2.07% (12.99 pp) |
| throughput/20000/values.head            |            252.56 (21.19) |             255.54 (27.6) |  +1.18% |   +0.64% (13.51 pp) |
| throughput/25000/values.head            |            241.73 (19.38) |             255.7 (21.52) |  +5.78% |   +4.09% (13.73 pp) |
| throughput/100/values.middle            |              294.14 (9.4) |            295.37 (44.29) |  +0.42% |   -3.26% (23.57 pp) |
| throughput/1000/values.middle           |            250.48 (13.13) |             267.21 (8.89) |  +6.68% |    +8.51% (4.23 pp) |
| throughput/5000/values.middle           |            273.71 (12.61) |            261.11 (18.64) |  -4.60% |    -6.28% (6.24 pp) |
| throughput/10000/values.middle          |             258.68 (3.85) |             275.27 (32.2) |  +6.41% |    +3.80% (10.8 pp) |
| throughput/15000/values.middle          |            253.55 (10.04) |            238.89 (32.02) |  -5.78% |    -6.47% (9.92 pp) |
| throughput/20000/values.middle          |            270.42 (15.37) |             242.92 (7.23) | -10.17% |   -11.56% (5.13 pp) |
| throughput/25000/values.middle          |            223.06 (14.63) |            223.78 (13.85) |  +0.32% |     -0.81% (4.4 pp) |
| throughput/100/values.random            |            299.28 (17.48) |            306.19 (68.72) |  +2.31% |   -0.84% (22.88 pp) |
| throughput/1000/values.random           |             280.43 (6.11) |              292.25 (7.1) |  +4.21% |    +4.65% (9.18 pp) |
| throughput/5000/values.random           |            330.78 (13.28) |            331.94 (21.62) |  +0.35% |   +3.46% (10.53 pp) |
| throughput/10000/values.random          |            364.06 (34.16) |            398.98 (41.77) |  +9.59% |    +5.82% (16.2 pp) |
| throughput/15000/values.random          |            357.66 (43.49) |            373.63 (38.02) |  +4.47% |   +2.87% (16.06 pp) |
| throughput/20000/values.random          |            378.76 (22.12) |            412.26 (21.11) |  +8.84% |   +10.02% (8.31 pp) |
| throughput/25000/values.random          |            352.72 (39.74) |            336.77 (57.34) |  -4.52% |    -2.72% (8.45 pp) |
| throughput/100/values.sameIndex         |            287.62 (15.52) |            317.22 (27.86) | +10.29% |   +7.58% (15.84 pp) |
| throughput/1000/values.sameIndex        |            258.11 (12.75) |            267.65 (11.43) |  +3.69% |     +4.35% (3.8 pp) |
| throughput/5000/values.sameIndex        |             261.1 (12.31) |            267.93 (27.34) |  +2.61% |   -0.28% (10.37 pp) |
| throughput/10000/values.sameIndex       |            244.81 (26.14) |            254.11 (15.42) |  +3.80% |   +4.60% (14.49 pp) |
| throughput/15000/values.sameIndex       |            227.81 (22.82) |            224.29 (21.69) |  -1.55% |    -0.75% (7.44 pp) |
| throughput/20000/values.sameIndex       |            252.61 (28.22) |            246.97 (13.48) |  -2.23% |   -5.66% (14.01 pp) |
| throughput/25000/values.sameIndex       |            242.22 (25.07) |            218.56 (10.02) |  -9.77% |     -5.58% (8.4 pp) |
| throughput/100/values.tail              |            275.18 (17.02) |            284.11 (38.32) |  +3.25% |   +5.12% (17.65 pp) |
| throughput/1000/values.tail             |             249.25 (7.82) |            265.65 (14.16) |  +6.58% |    +5.34% (5.77 pp) |
| throughput/5000/values.tail             |            261.03 (26.88) |            258.12 (15.03) |  -1.11% |    +1.20% (5.22 pp) |
| throughput/10000/values.tail            |             249.83 (5.96) |            274.63 (52.38) |  +9.93% |  +13.53% (14.45 pp) |
| throughput/15000/values.tail            |            223.79 (24.87) |            232.68 (38.45) |  +3.97% |   +1.93% (13.56 pp) |
| throughput/20000/values.tail            |             248.29 (29.9) |            262.25 (39.14) |  +5.62% |    +2.78% (7.46 pp) |
| throughput/25000/values.tail            |             214.81 (9.16) |              228.36 (9.7) |  +6.31% |    +5.18% (7.87 pp) |
| lifecycle/scaleUp/apply.random          |         3,588.97 (474.34) |         3,461.24 (405.83) |  -3.56% |    -1.36% (3.95 pp) |
| lifecycle/scaleUp/insert.head           |            827.72 (74.95) |            856.94 (185.6) |  +3.53% |   +0.93% (12.38 pp) |
| lifecycle/scaleUp/insert.random         |         1,564.52 (311.73) |         1,572.43 (319.08) |  +0.51% |    -2.60% (3.67 pp) |
| lifecycle/scaleUp/insert.tail           |              751.75 (143) |              729 (146.05) |  -3.03% |    -1.79% (4.93 pp) |
| lifecycle/scaleUp/remove.random         |         2,683.17 (603.01) |          2,782.72 (293.1) |  +3.71% |    -2.31% (9.38 pp) |
| lifecycle/scaleUp/replace.head          |         2,585.71 (194.54) |         2,440.56 (311.41) |  -5.61% |   -4.01% (14.25 pp) |
| lifecycle/scaleUp/replace.random        |         3,462.81 (450.97) |         3,323.14 (244.63) |  -4.03% |   -3.20% (19.26 pp) |
| lifecycle/scaleUp/replace.tail          |         2,232.16 (193.04) |         2,239.12 (380.05) |  +0.31% |    -1.85% (7.11 pp) |
| lifecycle/scaleUp/value.head            |            305.73 (37.99) |               306.55 (25) |  +0.27% |    -0.24% (3.55 pp) |
| lifecycle/scaleUp/value.random          |           965.06 (131.48) |           939.85 (172.34) |  -2.61% |     -0.98% (2.7 pp) |
| lifecycle/scaleUp/value.tail            |            158.02 (23.75) |               146.37 (11) |  -7.37% |    -1.63% (4.95 pp) |
| lifecycle/scaleDown/apply.random        |          3,181.47 (97.65) |         3,155.56 (279.79) |  -0.81% |    +0.21% (3.24 pp) |
| lifecycle/scaleDown/insert.random       |          1,561.88 (28.16) |          1,546.8 (194.09) |  -0.97% |    -0.04% (3.45 pp) |
| lifecycle/scaleDown/remove.head         |          1,824.81 (93.38) |          1,797.1 (150.68) |  -1.52% |    -1.07% (4.21 pp) |
| lifecycle/scaleDown/remove.random       |         2,570.05 (396.47) |         2,380.75 (311.14) |  -7.37% |    -1.39% (5.08 pp) |
| lifecycle/scaleDown/remove.tail         |         1,727.02 (496.98) |         1,813.94 (515.17) |  +5.03% |   -0.47% (26.84 pp) |
| lifecycle/scaleDown/replace.head        |         2,447.44 (257.07) |         2,310.85 (221.42) |  -5.58% |    -1.36% (3.52 pp) |
| lifecycle/scaleDown/replace.random      |         3,029.02 (161.34) |         3,255.15 (334.16) |  +7.47% |   +4.63% (12.59 pp) |
| lifecycle/scaleDown/replace.tail        |         16,695.37 (901.9) |      17,234.96 (2,624.59) |  +3.23% |    +4.74% (6.87 pp) |
| lifecycle/scaleDown/value.head          |            389.23 (12.22) |            392.46 (60.98) |  +0.83% |   +2.41% (16.26 pp) |
| lifecycle/scaleDown/value.random        |            930.45 (12.63) |           921.09 (144.29) |  -1.01% |     +0.46% (5.1 pp) |
| lifecycle/scaleDown/value.tail          |             216.76 (8.65) |            215.02 (25.13) |  -0.80% |    +1.94% (4.63 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,377.39 (300.87) |         3,304.59 (423.07) |  -2.16% |    +0.47% (5.92 pp) |
| lifecycle/fullLifecycle/insert.head     |            827.72 (74.95) |            856.94 (185.6) |  +3.53% |   +0.93% (12.38 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,555.98 (176.18) |         1,558.22 (273.14) |  +0.14% |    -1.83% (3.32 pp) |
| lifecycle/fullLifecycle/insert.tail     |              751.75 (143) |              729 (146.05) |  -3.03% |    -1.79% (4.93 pp) |
| lifecycle/fullLifecycle/remove.head     |          1,824.81 (93.38) |          1,797.1 (150.68) |  -1.52% |    -1.07% (4.21 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,726.91 (449.21) |         2,630.25 (292.17) |  -3.54% |    -3.74% (8.94 pp) |
| lifecycle/fullLifecycle/remove.tail     |         1,727.02 (496.98) |         1,813.94 (515.17) |  +5.03% |   -0.47% (26.84 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,517.89 (211.32) |         2,440.67 (341.54) |  -3.07% |   -0.67% (10.42 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,282.04 (324.51) |          3,215.73 (379.2) |  -2.02% |    +3.24% (6.78 pp) |
| lifecycle/fullLifecycle/replace.tail    |         9,480.31 (351.65) |       9,695.34 (1,388.96) |  +2.27% |    +3.76% (4.84 pp) |
| lifecycle/fullLifecycle/value.head      |            346.64 (25.83) |            348.76 (42.25) |  +0.61% |    +2.12% (6.36 pp) |
| lifecycle/fullLifecycle/value.random    |            947.76 (72.18) |           930.17 (167.72) |  -1.86% |    -0.63% (1.65 pp) |
| lifecycle/fullLifecycle/value.tail      |            187.29 (22.73) |            180.69 (18.05) |  -3.52% |    +0.47% (3.03 pp) |
| checkpoint/up/1000/create               |          365,550 (21,475) |          360,100 (21,850) |  -1.49% |     +2.29% (2.1 pp) |
| checkpoint/up/1000/sequence             |        2,435,500 (81,775) |        2,411,050 (55,400) |  -1.00% |     -0.34% (3.9 pp) |
| checkpoint/up/1000/values               |        1,669,750 (69,600) |       1,808,500 (146,550) |  +8.31% |    +4.88% (5.98 pp) |
| checkpoint/up/5000/create               |          882,900 (44,425) |          889,050 (55,100) |  +0.70% |    +0.27% (3.05 pp) |
| checkpoint/up/5000/sequence             |       7,488,250 (953,875) |       7,650,650 (840,100) |  +2.17% |   -3.22% (12.97 pp) |
| checkpoint/up/5000/values               |       4,635,000 (228,950) |       4,675,300 (288,250) |  +0.87% |   +4.24% (11.96 pp) |
| checkpoint/up/10000/create              |       1,663,200 (134,000) |        1,582,450 (57,050) |  -4.86% |    -1.96% (8.39 pp) |
| checkpoint/up/10000/sequence            |    13,570,250 (1,135,000) |    13,041,700 (1,489,525) |  -3.89% |   -0.72% (12.23 pp) |
| checkpoint/up/10000/values              |      20,173,000 (502,925) |      20,244,700 (739,625) |  +0.36% |    +2.07% (8.78 pp) |
| checkpoint/up/15000/create              |        2,379,000 (87,275) |        2,392,050 (81,550) |  +0.55% |    +1.56% (6.48 pp) |
| checkpoint/up/15000/sequence            |    14,130,000 (1,206,225) |      15,219,450 (733,250) |  +7.71% |    +5.21% (2.56 pp) |
| checkpoint/up/15000/values              |    28,843,200 (1,143,600) |      29,835,200 (715,725) |  +3.44% |    +2.67% (2.46 pp) |
| checkpoint/up/20000/create              |       3,375,400 (194,400) |        3,325,100 (27,675) |  -1.49% |    -0.26% (4.07 pp) |
| checkpoint/up/20000/sequence            |    20,998,500 (3,214,850) |      20,914,400 (634,475) |  -0.40% |      +1.45% (16 pp) |
| checkpoint/up/20000/values              |      10,258,350 (481,200) |      10,505,300 (441,225) |  +2.41% |     +0.09% (0.5 pp) |
| checkpoint/up/25000/create              |       3,914,400 (357,650) |       4,189,200 (685,575) |  +7.02% |    +5.42% (6.05 pp) |
| checkpoint/up/25000/sequence            |    22,263,550 (2,242,775) |    22,450,750 (5,444,300) |  +0.84% |   +2.18% (13.99 pp) |
| checkpoint/up/25000/values              |    11,157,800 (1,771,750) |      11,500,500 (871,875) |  +3.07% |    +4.61% (5.61 pp) |
| checkpoint/down/20000/create            |        3,365,650 (66,750) |        3,398,350 (87,575) |  +0.97% |    +1.25% (3.14 pp) |
| checkpoint/down/20000/sequence          |    18,190,650 (1,609,900) |    17,849,000 (1,580,375) |  -1.88% |    +1.63% (7.12 pp) |
| checkpoint/down/20000/values            |     9,056,650 (1,011,800) |     8,940,900 (1,089,275) |  -1.28% |    +0.25% (8.72 pp) |
| checkpoint/down/15000/create            |        2,381,650 (48,925) |       2,451,050 (126,350) |  +2.91% |    +2.04% (3.26 pp) |
| checkpoint/down/15000/sequence          |      14,376,850 (953,500) |    14,940,800 (1,332,750) |  +3.92% |    +4.04% (9.16 pp) |
| checkpoint/down/15000/values            |       7,043,600 (369,925) |       7,155,150 (684,125) |  +1.58% |   +0.82% (15.02 pp) |
| checkpoint/down/10000/create            |        1,648,900 (38,250) |        1,643,300 (80,050) |  -0.34% |    -0.90% (6.45 pp) |
| checkpoint/down/10000/sequence          |      11,584,250 (207,875) |    11,816,750 (2,696,025) |  +2.01% |   +1.26% (12.43 pp) |
| checkpoint/down/10000/values            |       5,165,600 (198,000) |       5,291,600 (838,100) |  +2.44% |   +1.08% (19.75 pp) |
| checkpoint/down/5000/create             |          791,000 (10,350) |          783,100 (36,300) |  -1.00% |    -2.42% (5.17 pp) |
| checkpoint/down/5000/sequence           |       8,974,300 (106,050) |       8,931,450 (288,200) |  -0.48% |    -1.90% (4.04 pp) |
| checkpoint/down/5000/values             |       3,006,850 (193,100) |       2,877,900 (241,025) |  -4.29% |    -2.34% (6.02 pp) |
| checkpoint/down/1000/create             |          152,600 (29,825) |           156,850 (9,550) |  +2.79% |    +0.33% (9.14 pp) |
| checkpoint/down/1000/sequence           |     5,853,000 (1,280,650) |       5,679,300 (407,875) |  -2.97% |    -2.84% (19.1 pp) |
| checkpoint/down/1000/values             |          517,100 (86,200) |          517,200 (70,525) |  +0.02% |  +11.11% (19.58 pp) |
| checkpoint/down/0/create                |              14,400 (600) |            15,950 (2,825) | +10.76% |   +3.16% (14.99 pp) |
| checkpoint/down/0/sequence              |       1,323,950 (265,675) |       1,479,750 (273,525) | +11.77% |   +9.26% (21.09 pp) |
| checkpoint/down/0/values                |            10,550 (1,350) |            12,400 (3,800) | +17.54% |   +6.95% (30.16 pp) |
| tuple/projection/2/create.empty         |               350 (15.06) |            387.51 (18.57) | +10.72% |    +5.88% (4.85 pp) |
| tuple/tuple/2/create.empty              |            418.23 (10.14) |            423.61 (21.43) |  +1.29% |    +1.56% (3.19 pp) |
| tuple/projection/2/create.sequence      |          1,200.56 (59.11) |          1,215.03 (84.31) |  +1.21% |    +1.89% (8.89 pp) |
| tuple/tuple/2/create.sequence           |          1,387.74 (92.76) |          1,413.98 (223.2) |  +1.89% |    +2.65% (6.43 pp) |
| tuple/projection/2/replace.random       |          1,019.21 (20.67) |         1,003.12 (110.27) |  -1.58% |   -1.70% (11.31 pp) |
| tuple/tuple/2/replace.random            |            705.98 (30.29) |             682.1 (66.23) |  -3.38% |   -2.84% (17.55 pp) |
| tuple/projection/2/apply.replace        |         1,672.97 (138.63) |         1,784.32 (243.63) |  +6.66% |   +4.18% (15.43 pp) |
| tuple/tuple/2/apply.replace             |           1,108.27 (60.8) |          1,189.63 (88.98) |  +7.34% |   +7.97% (12.14 pp) |
| tuple/projection/2/apply.duplicate      |            600.63 (31.33) |             644.8 (53.12) |  +7.35% |    +7.33% (8.89 pp) |
| tuple/tuple/2/apply.duplicate           |            610.33 (31.65) |           661.48 (123.01) |  +8.38% |    +8.56% (8.12 pp) |
| tuple/projection/2/merge.duplicate      |               662 (39.78) |            684.08 (54.03) |  +3.34% |    +8.23% (9.94 pp) |
| tuple/tuple/2/merge.duplicate           |            648.97 (56.73) |           691.93 (160.45) |  +6.62% |   +9.16% (19.87 pp) |
| tuple/projection/2/length               |               7.77 (0.93) |               7.75 (0.72) |  -0.28% |     -2.83% (3.6 pp) |
| tuple/tuple/2/length                    |               7.19 (0.95) |               7.28 (0.63) |  +1.29% |    +0.56% (4.74 pp) |
| tuple/projection/2/value.random         |              29.51 (6.39) |              31.25 (2.53) |  +5.89% |   +4.13% (21.05 pp) |
| tuple/tuple/2/value.random              |              18.81 (2.17) |              19.84 (2.82) |  +5.48% |   +4.90% (10.23 pp) |
| tuple/projection/2/values               |              79.65 (4.71) |               77.46 (3.9) |  -2.75% |     -1.65% (4.5 pp) |
| tuple/tuple/2/values                    |              78.43 (8.44) |              79.74 (4.82) |  +1.67% |   -2.70% (12.27 pp) |
| tuple/projection/2/sequence             |             435.5 (24.99) |            450.31 (22.86) |  +3.40% |    +2.99% (4.29 pp) |
| tuple/tuple/2/sequence                  |            470.24 (44.84) |            501.03 (81.53) |  +6.55% |   +4.64% (13.41 pp) |
| tuple/projection/4/create.empty         |            424.95 (38.51) |            437.75 (36.96) |  +3.01% |   +1.35% (14.33 pp) |
| tuple/tuple/4/create.empty              |            449.28 (35.37) |             441.2 (55.44) |  -1.80% |   -1.76% (18.01 pp) |
| tuple/projection/4/create.sequence      |          1,651.5 (140.69) |          1,706.21 (61.81) |  +3.31% |    +2.39% (7.98 pp) |
| tuple/tuple/4/create.sequence           |         1,559.02 (115.28) |          1,586.87 (64.75) |  +1.79% |      +1.79% (11 pp) |
| tuple/projection/4/replace.random       |           1,143.78 (71.8) |          1,137.14 (28.88) |  -0.58% |   -1.29% (13.84 pp) |
| tuple/tuple/4/replace.random            |            653.59 (65.02) |            624.35 (54.91) |  -4.47% |   -3.01% (17.07 pp) |
| tuple/projection/4/apply.replace        |          1,627.87 (40.62) |          1,714.77 (59.74) |  +5.34% |    +3.65% (3.24 pp) |
| tuple/tuple/4/apply.replace             |         1,067.47 (101.71) |          1,067.07 (30.28) |  -0.04% |    +1.41% (11.8 pp) |
| tuple/projection/4/apply.duplicate      |            577.43 (25.11) |            592.64 (11.29) |  +2.63% |    +3.04% (3.16 pp) |
| tuple/tuple/4/apply.duplicate           |            615.25 (39.46) |            608.64 (37.91) |  -1.08% |   -2.75% (10.49 pp) |
| tuple/projection/4/merge.duplicate      |             748.84 (44.9) |            759.25 (75.33) |  +1.39% |   +1.47% (11.07 pp) |
| tuple/tuple/4/merge.duplicate           |            778.68 (33.58) |            802.68 (52.35) |  +3.08% |    +4.85% (8.39 pp) |
| tuple/projection/4/length               |              28.49 (2.49) |              27.19 (2.39) |  -4.58% |   +1.36% (10.73 pp) |
| tuple/tuple/4/length                    |              27.17 (2.57) |              27.06 (2.62) |  -0.40% |   -1.09% (16.92 pp) |
| tuple/projection/4/value.random         |              44.47 (5.18) |              43.08 (4.28) |  -3.13% |    -0.32% (3.14 pp) |
| tuple/tuple/4/value.random              |               17.77 (0.8) |              17.81 (1.07) |  +0.24% |    -0.98% (4.55 pp) |
| tuple/projection/4/values               |             144.01 (8.09) |             145.45 (7.29) |  +1.00% |    +1.74% (4.84 pp) |
| tuple/tuple/4/values                    |               141.7 (9.5) |            141.27 (14.57) |  -0.31% |    +3.76% (6.03 pp) |
| tuple/projection/4/sequence             |            457.24 (25.46) |            446.19 (18.75) |  -2.42% |    +0.19% (6.95 pp) |
| tuple/tuple/4/sequence                  |            576.27 (75.53) |            564.03 (83.59) |  -2.12% |   +0.45% (10.83 pp) |
| tuple/projection/8/create.empty         |             416.1 (28.02) |            398.97 (22.74) |  -4.12% |   -2.70% (11.86 pp) |
| tuple/tuple/8/create.empty              |             427.6 (48.97) |             441.58 (12.4) |  +3.27% |    +0.21% (11.1 pp) |
| tuple/projection/8/create.sequence      |         2,205.49 (107.46) |          2,251.76 (162.2) |  +2.10% |    +1.86% (2.98 pp) |
| tuple/tuple/8/create.sequence           |         1,982.91 (159.87) |         1,966.46 (122.24) |  -0.83% |    +1.57% (6.37 pp) |
| tuple/projection/8/replace.random       |          1,118.87 (63.82) |             1,166.31 (91) |  +4.24% |    -0.12% (9.77 pp) |
| tuple/tuple/8/replace.random            |            640.81 (31.86) |            638.33 (58.09) |  -0.39% |    +1.66% (9.51 pp) |
| tuple/projection/8/apply.replace        |          1,709.71 (53.65) |           1,751.62 (41.8) |  +2.45% |   +0.71% (10.16 pp) |
| tuple/tuple/8/apply.replace             |             995.31 (54.1) |           1,001.84 (86.8) |  +0.66% |    +3.30% (3.51 pp) |
| tuple/projection/8/apply.duplicate      |             596.15 (23.1) |             604.71 (3.94) |  +1.43% |    +3.11% (6.45 pp) |
| tuple/tuple/8/apply.duplicate           |            603.53 (17.31) |            596.65 (18.29) |  -1.14% |    -2.54% (3.68 pp) |
| tuple/projection/8/merge.duplicate      |          1,066.85 (10.32) |            1,028.3 (22.8) |  -3.61% |    -2.49% (2.75 pp) |
| tuple/tuple/8/merge.duplicate           |          1,090.85 (57.99) |          1,111.73 (49.86) |  +1.91% |    +1.37% (7.16 pp) |
| tuple/projection/8/length               |              28.62 (1.84) |              27.57 (1.28) |  -3.66% |    -3.86% (6.81 pp) |
| tuple/tuple/8/length                    |              26.59 (1.86) |              26.82 (2.37) |  +0.86% |   +5.15% (16.47 pp) |
| tuple/projection/8/value.random         |              52.18 (3.61) |              50.57 (2.02) |  -3.09% |     -1.24% (2.2 pp) |
| tuple/tuple/8/value.random              |              17.92 (1.11) |               17.31 (0.6) |  -3.45% |    -2.38% (5.34 pp) |
| tuple/projection/8/values               |            222.04 (12.67) |            221.78 (27.94) |  -0.12% |    +0.11% (8.34 pp) |
| tuple/tuple/8/values                    |            201.43 (21.07) |            198.19 (14.01) |  -1.61% |     -3.75% (7.4 pp) |
| tuple/projection/8/sequence             |            622.84 (45.85) |            634.55 (34.99) |  +1.88% |    +2.17% (9.63 pp) |
| tuple/tuple/8/sequence                  |            670.45 (42.66) |            694.54 (26.67) |  +3.59% |    +2.70% (8.37 pp) |
| tuple/projection/100/create.empty       |            437.68 (25.13) |             437.17 (6.48) |  -0.12% |    -0.14% (2.44 pp) |
| tuple/tuple/100/create.empty            |             469.8 (29.61) |            448.21 (16.12) |  -4.60% |    -3.47% (6.74 pp) |
| tuple/projection/100/create.sequence    |        13,526.15 (294.36) |        14,011.23 (173.26) |  +3.59% |    +3.59% (3.57 pp) |
| tuple/tuple/100/create.sequence         |          11,026.8 (144.6) |         11,514.4 (315.66) |  +4.42% |    +3.33% (6.13 pp) |
| tuple/projection/100/replace.random     |          1,118.96 (36.76) |          1,147.56 (23.09) |  +2.56% |    +2.14% (5.52 pp) |
| tuple/tuple/100/replace.random          |             607.59 (41.9) |            615.33 (13.23) |  +1.27% |    +0.92% (5.62 pp) |
| tuple/projection/100/apply.replace      |         1,708.62 (182.09) |           1,682.49 (74.5) |  -1.53% |     -0.82% (6.8 pp) |
| tuple/tuple/100/apply.replace           |             964.24 (60.6) |            989.36 (34.65) |  +2.61% |    +0.49% (7.34 pp) |
| tuple/projection/100/apply.duplicate    |            613.68 (28.78) |              597.42 (4.3) |  -2.65% |    -3.60% (6.01 pp) |
| tuple/tuple/100/apply.duplicate         |            594.97 (19.37) |            607.53 (11.09) |  +2.11% |    +0.82% (3.26 pp) |
| tuple/projection/100/merge.duplicate    |         8,889.93 (275.34) |         8,968.77 (541.29) |  +0.89% |    +0.59% (7.21 pp) |
| tuple/tuple/100/merge.duplicate         |         12,784.51 (420.6) |        12,652.04 (749.73) |  -1.04% |    +1.45% (7.11 pp) |
| tuple/projection/100/length             |              27.78 (1.18) |              26.62 (1.93) |  -4.18% |   -2.89% (15.48 pp) |
| tuple/tuple/100/length                  |              26.39 (2.15) |               27.81 (1.6) |  +5.39% |   +6.75% (11.06 pp) |
| tuple/projection/100/value.random       |              75.86 (7.61) |               77.4 (1.06) |  +2.03% |    -1.09% (6.66 pp) |
| tuple/tuple/100/value.random            |              17.85 (0.38) |              17.15 (0.58) |  -3.94% |    -3.93% (4.41 pp) |
| tuple/projection/100/values             |         1,888.57 (104.19) |          1,869.32 (42.22) |  -1.02% |    -1.20% (4.73 pp) |
| tuple/tuple/100/values                  |          1,485.81 (43.55) |           1,515.5 (85.36) |  +2.00% |    +1.55% (6.14 pp) |
| tuple/projection/100/sequence           |         6,093.29 (344.65) |         6,466.63 (529.29) |  +6.13% |   +4.40% (14.43 pp) |
| tuple/tuple/100/sequence                |         5,459.63 (299.87) |         5,524.39 (192.04) |  +1.19% |    -0.91% (6.42 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |      Before |   Candidate | Change |
| ----------------------------------------- | ----------: | ----------: | -----: |
| memory/up/1000/native                     |     480,440 |     480,440 | +0.00% |
| memory/up/1000/js                         |     411,088 |     411,088 | +0.00% |
| storage/up/1000/jsonBytes                 |     280,295 |     280,295 | +0.00% |
| storage/up/1000/jsonGzipBytes             |    14,892.5 |    14,892.5 | +0.00% |
| storage/up/1000/messagePackBytes          |   167,011.5 |   167,011.5 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |      12,645 |      12,645 | +0.00% |
| memory/up/5000/native                     |   2,156,544 |   2,156,544 | +0.00% |
| memory/up/5000/js                         |   2,059,724 |   2,059,724 | +0.00% |
| storage/up/5000/jsonBytes                 | 1,662,018.5 | 1,662,018.5 | +0.00% |
| storage/up/5000/jsonGzipBytes             |    75,129.5 |    75,129.5 | +0.00% |
| storage/up/5000/messagePackBytes          |   839,474.5 |   839,474.5 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |      63,111 |      63,111 | +0.00% |
| memory/up/10000/native                    |   3,567,448 |   3,567,448 | +0.00% |
| memory/up/10000/js                        |   4,119,328 |   4,119,328 | +0.00% |
| storage/up/10000/jsonBytes                |   3,336,314 |   3,336,314 | +0.00% |
| storage/up/10000/jsonGzipBytes            |     152,279 |     152,279 | +0.00% |
| storage/up/10000/messagePackBytes         |   1,685,726 |   1,685,726 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |   127,830.5 |   127,830.5 | +0.00% |
| memory/up/15000/native                    |   4,819,592 |   4,819,592 | +0.00% |
| memory/up/15000/js                        |   6,184,204 |   6,184,204 | +0.00% |
| storage/up/15000/jsonBytes                | 5,043,799.5 | 5,043,799.5 | +0.00% |
| storage/up/15000/jsonGzipBytes            |   231,327.5 |   231,327.5 | +0.00% |
| storage/up/15000/messagePackBytes         | 3,635,792.5 | 3,635,792.5 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |   204,729.5 |   204,729.5 | +0.00% |
| memory/up/20000/native                    |   6,318,092 |   6,318,092 | +0.00% |
| memory/up/20000/js                        |   8,246,672 |   8,246,672 | +0.00% |
| storage/up/20000/jsonBytes                | 7,276,540.5 | 7,276,540.5 | +0.00% |
| storage/up/20000/jsonGzipBytes            |   318,636.5 |   318,636.5 | +0.00% |
| storage/up/20000/messagePackBytes         |   5,249,363 |   5,249,363 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |     269,856 |     269,856 | +0.00% |
| memory/up/25000/native                    |   7,541,796 |   7,541,796 | +0.00% |
| memory/up/25000/js                        |  10,320,836 |  10,320,836 | +0.00% |
| storage/up/25000/jsonBytes                |   9,493,939 |   9,493,939 | +0.00% |
| storage/up/25000/jsonGzipBytes            |   402,020.5 |   402,020.5 | +0.00% |
| storage/up/25000/messagePackBytes         |   6,711,506 |   6,711,506 | +0.00% |
| storage/up/25000/messagePackGzipBytes     |     343,278 |     343,278 | +0.00% |
| memory/down/20000/native                  |   6,597,576 |   6,597,576 | +0.00% |
| memory/down/20000/js                      |   8,257,284 |   8,257,284 | +0.00% |
| storage/down/20000/jsonBytes              | 7,751,688.5 | 7,751,688.5 | +0.00% |
| storage/down/20000/jsonGzipBytes          |   334,470.5 |   334,470.5 | +0.00% |
| storage/down/20000/messagePackBytes       | 5,440,528.5 | 5,440,528.5 | +0.00% |
| storage/down/20000/messagePackGzipBytes   |     284,828 |     284,828 | +0.00% |
| memory/down/15000/native                  |   5,746,748 |   5,746,748 | +0.00% |
| memory/down/15000/js                      |   6,202,756 |   6,202,756 | +0.00% |
| storage/down/15000/jsonBytes              |   5,870,059 |   5,870,059 | +0.00% |
| storage/down/15000/jsonGzipBytes          |     253,125 |     253,125 | +0.00% |
| storage/down/15000/messagePackBytes       | 4,104,877.5 | 4,104,877.5 | +0.00% |
| storage/down/15000/messagePackGzipBytes   |   214,843.5 |   214,843.5 | +0.00% |
| memory/down/10000/native                  |   4,720,616 |   4,720,616 | +0.00% |
| memory/down/10000/js                      |   4,143,000 |   4,143,000 | +0.00% |
| storage/down/10000/jsonBytes              | 3,929,314.5 | 3,929,314.5 | +0.00% |
| storage/down/10000/jsonGzipBytes          |     168,848 |     168,848 | +0.00% |
| storage/down/10000/messagePackBytes       |   2,741,708 |   2,741,708 | +0.00% |
| storage/down/10000/messagePackGzipBytes   |   143,229.5 |   143,229.5 | +0.00% |
| memory/down/5000/native                   |   3,777,808 |   3,777,808 | +0.00% |
| memory/down/5000/js                       |   2,060,484 |   2,060,484 | +0.00% |
| storage/down/5000/jsonBytes               | 1,944,595.5 | 1,944,595.5 | +0.00% |
| storage/down/5000/jsonGzipBytes           |      81,725 |      81,725 | +0.00% |
| storage/down/5000/messagePackBytes        |   1,359,213 |   1,359,213 | +0.00% |
| storage/down/5000/messagePackGzipBytes    |    69,521.5 |    69,521.5 | +0.00% |
| memory/down/1000/native                   |   2,718,764 |   2,718,764 | +0.00% |
| memory/down/1000/js                       |     415,100 |     415,100 | +0.00% |
| storage/down/1000/jsonBytes               |   388,473.5 |   388,473.5 | +0.00% |
| storage/down/1000/jsonGzipBytes           |      16,360 |      16,360 | +0.00% |
| storage/down/1000/messagePackBytes        |   272,375.5 |   272,375.5 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |      13,957 |      13,957 | +0.00% |
| memory/down/0/native                      |   1,597,888 |   1,597,888 | +0.00% |
| memory/down/0/js                          |          16 |          16 | +0.00% |
| storage/down/0/jsonBytes                  |          16 |          16 | +0.00% |
| storage/down/0/jsonGzipBytes              |          32 |          32 | +0.00% |
| storage/down/0/messagePackBytes           |           8 |           8 | +0.00% |
| storage/down/0/messagePackGzipBytes       |          28 |          28 | +0.00% |
| tuple-space/projection/2/allocatedBytes   |         704 |         704 | +0.00% |
| tuple-space/projection/2/msgpackBytes     |          32 |          32 | +0.00% |
| tuple-space/projection/2/gzipBytes        |          42 |          42 | +0.00% |
| tuple-space/tuple/2/allocatedBytes        |         744 |         744 | +0.00% |
| tuple-space/tuple/2/msgpackBytes          |          38 |          38 | +0.00% |
| tuple-space/tuple/2/gzipBytes             |          56 |          56 | +0.00% |
| tuple-space/projection/4/allocatedBytes   |       1,432 |       1,432 | +0.00% |
| tuple-space/projection/4/msgpackBytes     |          64 |          64 | +0.00% |
| tuple-space/projection/4/gzipBytes        |          53 |          53 | +0.00% |
| tuple-space/tuple/4/allocatedBytes        |         968 |         968 | +0.00% |
| tuple-space/tuple/4/msgpackBytes          |          60 |          60 | +0.00% |
| tuple-space/tuple/4/gzipBytes             |          71 |          71 | +0.00% |
| tuple-space/projection/8/allocatedBytes   |       2,328 |       2,328 | +0.00% |
| tuple-space/projection/8/msgpackBytes     |         124 |         124 | +0.00% |
| tuple-space/projection/8/gzipBytes        |          80 |          80 | +0.00% |
| tuple-space/tuple/8/allocatedBytes        |       1,416 |       1,416 | +0.00% |
| tuple-space/tuple/8/msgpackBytes          |         104 |         104 | +0.00% |
| tuple-space/tuple/8/gzipBytes             |          92 |          92 | +0.00% |
| tuple-space/projection/100/allocatedBytes |      21,400 |      21,400 | +0.00% |
| tuple-space/projection/100/msgpackBytes   |         682 |         682 | +0.00% |
| tuple-space/projection/100/gzipBytes      |         586 |         586 | +0.00% |
| tuple-space/tuple/100/allocatedBytes      |      11,608 |      11,608 | +0.00% |
| tuple-space/tuple/100/msgpackBytes        |         527 |         527 | +0.00% |
| tuple-space/tuple/100/gzipBytes           |         356 |         356 | +0.00% |

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_23_hotpath/batch-pointer*`. No external competitor was run.
