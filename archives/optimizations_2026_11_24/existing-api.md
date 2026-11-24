# Batch: existing API guard

6 complete matched runs per build. Before: batch-base; candidate: batch-compact. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 79 timing medians improve over 5%; 55 slow over 5%. Length remains shown as a control. The 5% summary cutoff is not an acceptance allowance: retention requires no reproducible slowdown. Follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |           907.41 (231.55) |           827.12 (158.61) |  -8.85% |  -10.36% (30.12 pp) |
| throughput/1000/apply.duplicate         |            881.49 (41.45) |            864.41 (62.59) |  -1.94% |   +3.04% (21.56 pp) |
| throughput/5000/apply.duplicate         |            389.89 (22.77) |            396.07 (17.11) |  +1.59% |    -1.95% (7.16 pp) |
| throughput/10000/apply.duplicate        |            352.34 (11.45) |            362.53 (24.04) |  +2.89% |    +1.48% (9.02 pp) |
| throughput/15000/apply.duplicate        |            332.34 (31.14) |            350.19 (16.79) |  +5.37% |   +3.66% (11.45 pp) |
| throughput/20000/apply.duplicate        |               344 (26.42) |           356.48 (110.24) |  +3.63% |    +4.03% (42.1 pp) |
| throughput/25000/apply.duplicate        |            337.98 (25.35) |            325.81 (11.64) |  -3.60% |    -3.19% (3.54 pp) |
| throughput/100/apply.duplicateRemove    |          1,590.5 (231.46) |         1,574.74 (103.32) |  -0.99% |   -2.15% (21.38 pp) |
| throughput/1000/apply.duplicateRemove   |            877.73 (79.53) |            872.26 (19.28) |  -0.62% |   +2.12% (18.61 pp) |
| throughput/5000/apply.duplicateRemove   |            786.58 (38.73) |             789.7 (38.03) |  +0.40% |    +0.20% (7.78 pp) |
| throughput/10000/apply.duplicateRemove  |            773.21 (44.67) |            763.86 (92.41) |  -1.21% |   -3.79% (18.62 pp) |
| throughput/15000/apply.duplicateRemove  |            691.81 (33.07) |            711.55 (25.54) |  +2.85% |    +1.43% (2.97 pp) |
| throughput/20000/apply.duplicateRemove  |            694.23 (44.92) |            685.58 (30.92) |  -1.25% |    +1.34% (6.01 pp) |
| throughput/25000/apply.duplicateRemove  |            672.55 (44.74) |             753.44 (63.3) | +12.03% |  +10.69% (12.81 pp) |
| throughput/100/apply.duplicateReplace   |          1,096.99 (93.26) |         1,084.18 (314.37) |  -1.17% |   +3.91% (22.35 pp) |
| throughput/1000/apply.duplicateReplace  |          1,266.84 (96.15) |         1,224.66 (280.71) |  -3.33% |   -5.46% (44.21 pp) |
| throughput/5000/apply.duplicateReplace  |            965.87 (28.32) |            972.61 (15.17) |  +0.70% |    +0.56% (5.67 pp) |
| throughput/10000/apply.duplicateReplace |            950.14 (35.01) |            948.19 (34.83) |  -0.20% |    -0.73% (8.34 pp) |
| throughput/15000/apply.duplicateReplace |            880.58 (53.59) |           873.55 (151.99) |  -0.80% |    +5.23% (19.2 pp) |
| throughput/20000/apply.duplicateReplace |            861.92 (61.47) |            841.95 (20.59) |  -2.32% |    -3.34% (8.58 pp) |
| throughput/25000/apply.duplicateReplace |            839.57 (37.46) |            865.37 (60.89) |  +3.07% |    +4.04% (7.19 pp) |
| throughput/100/apply.insert             |         1,738.62 (246.57) |         1,712.89 (132.76) |  -1.48% |    -3.04% (7.36 pp) |
| throughput/1000/apply.insert            |             1,587.65 (90) |           1,461.2 (48.93) |  -7.96% |   -9.96% (14.43 pp) |
| throughput/5000/apply.insert            |           1,309.87 (45.7) |         1,367.72 (172.07) |  +4.42% |    +5.78% (6.37 pp) |
| throughput/10000/apply.insert           |          1,356.25 (47.32) |          1,351.35 (75.47) |  -0.36% |    +0.32% (9.43 pp) |
| throughput/15000/apply.insert           |         1,316.11 (171.78) |         1,287.97 (177.71) |  -2.14% |    -0.25% (7.68 pp) |
| throughput/20000/apply.insert           |         1,268.24 (124.92) |          1,230.22 (63.09) |  -3.00% |   -5.04% (10.55 pp) |
| throughput/25000/apply.insert           |            1,243 (147.43) |          1,304.5 (181.69) |  +4.95% |    +4.59% (8.71 pp) |
| throughput/100/apply.remove             |         2,117.22 (160.56) |          1,968.58 (95.56) |  -7.02% |  -11.30% (10.43 pp) |
| throughput/1000/apply.remove            |          1,666.55 (127.6) |         1,596.55 (281.81) |  -4.20% |   +5.23% (18.33 pp) |
| throughput/5000/apply.remove            |           1,482.7 (72.59) |          1,508.29 (81.07) |  +1.73% |    -0.78% (6.02 pp) |
| throughput/10000/apply.remove           |           1,619.1 (26.35) |          1,563.11 (99.45) |  -3.46% |    -2.47% (9.18 pp) |
| throughput/15000/apply.remove           |           1,543.47 (66.3) |          1,639.3 (109.54) |  +6.21% |    +7.48% (4.01 pp) |
| throughput/20000/apply.remove           |         1,565.45 (165.54) |           1,698.6 (99.13) |  +8.51% |    +8.70% (11.7 pp) |
| throughput/25000/apply.remove           |          1,471.37 (43.82) |          1,672.23 (57.55) | +13.65% |  +11.73% (17.42 pp) |
| throughput/100/apply.replace            |         2,973.34 (409.88) |           2,852.4 (688.4) |  -4.07% |   -0.70% (42.18 pp) |
| throughput/1000/apply.replace           |          2,859.3 (172.08) |         3,058.03 (315.97) |  +6.95% |   +9.83% (17.09 pp) |
| throughput/5000/apply.replace           |         2,884.87 (202.84) |         2,797.81 (219.16) |  -3.02% |   +2.52% (11.33 pp) |
| throughput/10000/apply.replace          |          2,719.98 (68.28) |         2,891.53 (252.89) |  +6.31% |   +6.84% (21.54 pp) |
| throughput/15000/apply.replace          |         2,684.04 (162.39) |         2,821.61 (149.34) |  +5.13% |    +6.67% (5.83 pp) |
| throughput/20000/apply.replace          |         2,813.58 (146.01) |         2,814.26 (192.99) |  +0.02% |    +0.66% (6.98 pp) |
| throughput/25000/apply.replace          |         2,725.61 (169.34) |          2,860.05 (61.09) |  +4.93% |    +4.00% (3.77 pp) |
| throughput/100/create.empty             |            604.5 (121.38) |           576.98 (147.21) |  -4.55% |   -3.70% (42.98 pp) |
| throughput/1000/create.empty            |            730.11 (56.89) |           753.28 (144.03) |  +3.17% |  +18.80% (31.56 pp) |
| throughput/5000/create.empty            |            740.87 (49.83) |            788.04 (30.92) |  +6.37% |    +7.88% (7.66 pp) |
| throughput/10000/create.empty           |            722.89 (46.58) |            768.95 (61.11) |  +6.37% |   +1.12% (13.31 pp) |
| throughput/15000/create.empty           |            782.42 (33.28) |            750.72 (79.47) |  -4.05% |   -6.95% (14.48 pp) |
| throughput/20000/create.empty           |           713.27 (116.52) |           732.07 (100.01) |  +2.64% |   +1.65% (10.21 pp) |
| throughput/25000/create.empty           |            667.36 (90.52) |            755.65 (52.79) | +13.23% |   +4.44% (12.06 pp) |
| throughput/100/create.sequence          |         1,627.39 (195.22) |         1,659.62 (212.79) |  +1.98% |    +1.52% (31.5 pp) |
| throughput/1000/create.sequence         |            1,907 (152.83) |          1,952.8 (141.24) |  +2.40% |   +7.14% (24.65 pp) |
| throughput/5000/create.sequence         |         1,748.99 (290.23) |         1,616.44 (137.62) |  -7.58% |    -1.57% (2.96 pp) |
| throughput/10000/create.sequence        |          1,610.2 (184.41) |         1,591.38 (126.31) |  -1.17% |    -1.39% (8.44 pp) |
| throughput/15000/create.sequence        |           1,450.3 (56.98) |           1,477.5 (30.21) |  +1.87% |     +1.40% (7.3 pp) |
| throughput/20000/create.sequence        |         1,562.72 (125.67) |         1,649.91 (160.59) |  +5.58% |   +4.93% (10.02 pp) |
| throughput/25000/create.sequence        |          1,580.17 (63.28) |          1,493.1 (145.55) |  -5.51% |   -1.66% (17.11 pp) |
| throughput/100/insert.head              |             574.9 (92.98) |           601.16 (133.02) |  +4.57% |   +5.16% (29.38 pp) |
| throughput/1000/insert.head             |             545.57 (42.8) |            573.05 (37.96) |  +5.04% |   +5.99% (14.43 pp) |
| throughput/5000/insert.head             |            516.77 (47.22) |            551.84 (55.35) |  +6.79% |   +5.95% (11.25 pp) |
| throughput/10000/insert.head            |            500.62 (58.23) |            552.06 (32.94) | +10.28% |    +9.47% (6.28 pp) |
| throughput/15000/insert.head            |             535.3 (44.63) |             511.5 (71.76) |  -4.45% |     -4.62% (9.9 pp) |
| throughput/20000/insert.head            |            514.34 (28.91) |            553.75 (83.49) |  +7.66% |   +1.06% (18.78 pp) |
| throughput/25000/insert.head            |            483.79 (33.81) |            496.23 (32.43) |  +2.57% |    +0.55% (6.67 pp) |
| throughput/100/insert.middle            |           670.81 (143.71) |           682.74 (139.45) |  +1.78% |   -0.56% (42.79 pp) |
| throughput/1000/insert.middle           |            649.17 (20.58) |           666.43 (105.09) |  +2.66% |   +2.70% (19.47 pp) |
| throughput/5000/insert.middle           |            643.49 (61.69) |            627.43 (49.16) |  -2.50% |   -7.75% (15.73 pp) |
| throughput/10000/insert.middle          |            649.12 (26.06) |            609.59 (53.18) |  -6.09% |   -6.77% (12.48 pp) |
| throughput/15000/insert.middle          |            600.72 (45.52) |            622.99 (39.57) |  +3.71% |    +5.03% (1.58 pp) |
| throughput/20000/insert.middle          |            599.49 (32.55) |            609.36 (43.37) |  +1.65% |     -2.91% (8.8 pp) |
| throughput/25000/insert.middle          |            575.06 (10.42) |            602.93 (82.13) |  +4.85% |   +4.85% (18.42 pp) |
| throughput/100/insert.random            |            963.08 (16.36) |            889.2 (113.31) |  -7.67% |   -4.53% (14.54 pp) |
| throughput/1000/insert.random           |            969.1 (531.79) |          1,051.7 (178.51) |  +8.52% |   +4.30% (33.71 pp) |
| throughput/5000/insert.random           |            940.45 (52.27) |            919.37 (39.95) |  -2.24% |   -2.99% (10.77 pp) |
| throughput/10000/insert.random          |           924.84 (113.57) |            907.16 (65.84) |  -1.91% |    -4.30% (9.08 pp) |
| throughput/15000/insert.random          |            856.35 (57.41) |            889.64 (97.23) |  +3.89% |   +4.98% (14.17 pp) |
| throughput/20000/insert.random          |           875.52 (117.13) |            861.89 (60.18) |  -1.56% |   +1.37% (11.17 pp) |
| throughput/25000/insert.random          |           814.54 (140.51) |            943.16 (187.1) | +15.79% |  +11.63% (27.28 pp) |
| throughput/100/insert.sameIndex         |            623.11 (66.11) |            620.09 (30.78) |  -0.48% |   -2.52% (17.34 pp) |
| throughput/1000/insert.sameIndex        |            615.41 (76.79) |            596.06 (68.08) |  -3.14% |   +0.12% (13.27 pp) |
| throughput/5000/insert.sameIndex        |            590.89 (37.55) |            572.87 (56.75) |  -3.05% |   -1.59% (12.36 pp) |
| throughput/10000/insert.sameIndex       |            536.44 (53.78) |            572.77 (18.23) |  +6.77% |   +5.14% (12.45 pp) |
| throughput/15000/insert.sameIndex       |            570.89 (62.63) |            585.85 (198.7) |  +2.62% |   +2.17% (52.04 pp) |
| throughput/20000/insert.sameIndex       |            562.77 (56.17) |            554.14 (12.25) |  -1.53% |    -0.28% (8.56 pp) |
| throughput/25000/insert.sameIndex       |           572.48 (125.42) |             571.9 (47.32) |  -0.10% |   +3.77% (24.71 pp) |
| throughput/100/insert.tail              |           938.27 (103.91) |            934.43 (81.12) |  -0.41% |    +1.91% (8.88 pp) |
| throughput/1000/insert.tail             |           934.58 (166.23) |            901.47 (69.36) |  -3.54% |    +4.76% (7.09 pp) |
| throughput/5000/insert.tail             |            944.38 (34.08) |           896.84 (104.55) |  -5.03% |   -9.33% (12.96 pp) |
| throughput/10000/insert.tail            |           854.76 (103.55) |            925.52 (165.6) |  +8.28% |    +6.83% (6.99 pp) |
| throughput/15000/insert.tail            |           815.81 (270.82) |           791.32 (140.21) |  -3.00% |   +3.54% (19.18 pp) |
| throughput/20000/insert.tail            |           901.09 (191.34) |           911.94 (106.09) |  +1.20% |   -5.91% (25.23 pp) |
| throughput/25000/insert.tail            |           919.72 (111.47) |           876.33 (128.51) |  -4.72% |   -0.49% (12.28 pp) |
| throughput/100/length                   |            129.92 (19.95) |             112.98 (25.1) | -13.04% |   -4.99% (22.62 pp) |
| throughput/1000/length                  |            116.43 (11.81) |            115.32 (45.14) |  -0.96% |   +9.18% (41.91 pp) |
| throughput/5000/length                  |             116.32 (7.39) |            119.48 (10.47) |  +2.71% |    +0.49% (7.06 pp) |
| throughput/10000/length                 |             114.07 (9.03) |             114.84 (5.09) |  +0.68% |   +2.41% (14.22 pp) |
| throughput/15000/length                 |            117.38 (19.61) |             114.41 (4.61) |  -2.52% |   +3.69% (19.72 pp) |
| throughput/20000/length                 |            115.09 (10.33) |             108.08 (4.67) |  -6.09% |     -6.85% (6.9 pp) |
| throughput/25000/length                 |            106.29 (10.19) |            105.78 (14.56) |  -0.48% |      +1.68% (10 pp) |
| throughput/100/merge.duplicate          |            891.34 (75.81) |           847.51 (102.05) |  -4.92% |   -6.59% (10.03 pp) |
| throughput/1000/merge.duplicate         |             694.46 (60.4) |            660.11 (30.37) |  -4.95% |    -0.92% (10.4 pp) |
| throughput/5000/merge.duplicate         |             657.28 (18.9) |            669.86 (17.95) |  +1.91% |    +1.47% (2.84 pp) |
| throughput/10000/merge.duplicate        |            628.27 (37.42) |            638.24 (71.33) |  +1.59% |   +3.04% (12.02 pp) |
| throughput/15000/merge.duplicate        |             639.42 (89.7) |           652.27 (172.74) |  +2.01% |    +2.16% (27.6 pp) |
| throughput/20000/merge.duplicate        |             595.08 (18.1) |            591.04 (17.55) |  -0.68% |    -1.49% (6.16 pp) |
| throughput/25000/merge.duplicate        |            601.46 (23.61) |            605.89 (45.09) |  +0.74% |    -0.16% (4.42 pp) |
| throughput/100/merge.insert             |         1,978.72 (226.57) |         1,844.74 (164.81) |  -6.77% |    -7.78% (8.46 pp) |
| throughput/1000/merge.insert            |         1,687.44 (167.69) |         1,519.56 (122.03) |  -9.95% |  -12.83% (15.11 pp) |
| throughput/5000/merge.insert            |         1,576.12 (150.35) |          1,573.11 (88.08) |  -0.19% |    -2.83% (5.13 pp) |
| throughput/10000/merge.insert           |         1,512.31 (100.16) |          1,558.13 (72.02) |  +3.03% |    +0.93% (7.26 pp) |
| throughput/15000/merge.insert           |         1,508.64 (179.18) |         1,647.29 (433.89) |  +9.19% |  +10.24% (36.45 pp) |
| throughput/20000/merge.insert           |         1,535.27 (145.49) |         1,628.56 (142.87) |  +6.08% |    +6.29% (10.2 pp) |
| throughput/25000/merge.insert           |         1,425.52 (124.31) |          1,410.69 (72.98) |  -1.04% |   -1.80% (13.16 pp) |
| throughput/100/remove.head              |           817.59 (222.93) |           818.92 (376.28) |  +0.16% |   +3.34% (64.87 pp) |
| throughput/1000/remove.head             |           820.15 (119.73) |            825.18 (51.18) |  +0.61% |   -0.41% (18.72 pp) |
| throughput/5000/remove.head             |            866.82 (33.21) |            853.78 (71.84) |  -1.50% |    -3.90% (7.36 pp) |
| throughput/10000/remove.head            |            914.29 (44.03) |            881.68 (21.74) |  -3.57% |   -3.30% (15.61 pp) |
| throughput/15000/remove.head            |            872.41 (34.87) |           956.29 (162.23) |  +9.61% |    +6.79% (19.4 pp) |
| throughput/20000/remove.head            |            965.12 (82.94) |         1,000.86 (100.87) |  +3.70% |   +4.47% (13.57 pp) |
| throughput/25000/remove.head            |            997.64 (84.54) |            977.79 (55.89) |  -1.99% |    -0.69% (4.55 pp) |
| throughput/100/remove.middle            |            882.39 (74.99) |           810.43 (238.87) |  -8.16% |   -7.33% (33.53 pp) |
| throughput/1000/remove.middle           |          876.58 (1,864.1) |            834.14 (62.64) |  -4.84% |    -6.89% (55.6 pp) |
| throughput/5000/remove.middle           |            842.96 (89.45) |            819.98 (38.31) |  -2.73% |    -1.98% (7.94 pp) |
| throughput/10000/remove.middle          |             888.44 (79.5) |            909.42 (88.99) |  +2.36% |   +0.29% (20.13 pp) |
| throughput/15000/remove.middle          |            924.57 (74.07) |            932.99 (67.75) |  +0.91% |   +0.63% (11.16 pp) |
| throughput/20000/remove.middle          |            919.86 (64.56) |           981.33 (234.42) |  +6.68% |   +7.83% (19.52 pp) |
| throughput/25000/remove.middle          |            907.94 (91.56) |            911.17 (19.35) |  +0.36% |    -0.30% (7.38 pp) |
| throughput/100/remove.random            |         1,109.81 (146.78) |         1,077.75 (241.81) |  -2.89% |   +0.06% (20.35 pp) |
| throughput/1000/remove.random           |         1,283.18 (114.18) |           1,240.28 (65.6) |  -3.34% |    -0.46% (13.1 pp) |
| throughput/5000/remove.random           |          1,268.91 (80.46) |          1,197.64 (79.56) |  -5.62% |    -3.31% (4.92 pp) |
| throughput/10000/remove.random          |          1,193.89 (79.45) |         1,218.27 (108.35) |  +2.04% |   +0.95% (10.65 pp) |
| throughput/15000/remove.random          |          1,328.16 (70.62) |          1,327.79 (88.52) |  -0.03% |   -0.22% (16.32 pp) |
| throughput/20000/remove.random          |          1,271.83 (65.42) |         1,306.51 (113.42) |  +2.73% |   +1.62% (10.39 pp) |
| throughput/25000/remove.random          |         1,318.74 (196.98) |          1,228.64 (30.98) |  -6.83% |   -7.09% (12.73 pp) |
| throughput/100/remove.sameIndex         |         1,069.61 (233.02) |         1,133.95 (394.26) |  +6.01% |  +13.76% (24.85 pp) |
| throughput/1000/remove.sameIndex        |            884.12 (56.01) |           837.82 (117.61) |  -5.24% |   -2.97% (15.48 pp) |
| throughput/5000/remove.sameIndex        |             851.5 (22.11) |            839.02 (52.04) |  -1.47% |     -1.75% (5.6 pp) |
| throughput/10000/remove.sameIndex       |             875.29 (31.4) |           924.57 (112.72) |  +5.63% |    +3.04% (9.32 pp) |
| throughput/15000/remove.sameIndex       |            868.09 (42.51) |            918.87 (78.79) |  +5.85% |   +7.84% (14.64 pp) |
| throughput/20000/remove.sameIndex       |           986.53 (243.83) |            956.3 (102.81) |  -3.06% |   -1.05% (23.47 pp) |
| throughput/25000/remove.sameIndex       |            938.13 (92.44) |            961.66 (66.25) |  +2.51% |   -1.78% (21.04 pp) |
| throughput/100/remove.tail              |           867.35 (119.62) |           761.77 (212.73) | -12.17% |   -3.32% (42.72 pp) |
| throughput/1000/remove.tail             |             763.73 (33.8) |           729.69 (104.83) |  -4.46% |   -2.41% (13.84 pp) |
| throughput/5000/remove.tail             |           722.19 (109.01) |            745.47 (13.68) |  +3.22% |   +3.33% (12.19 pp) |
| throughput/10000/remove.tail            |            789.09 (56.86) |            783.84 (43.48) |  -0.67% |   +0.62% (20.92 pp) |
| throughput/15000/remove.tail            |            763.74 (36.22) |            809.68 (20.71) |  +6.01% |    +5.02% (3.35 pp) |
| throughput/20000/remove.tail            |             846.8 (67.88) |           871.24 (138.81) |  +2.89% |   -5.24% (16.41 pp) |
| throughput/25000/remove.tail            |            823.99 (25.23) |             834.23 (28.5) |  +1.24% |    +2.94% (6.75 pp) |
| throughput/100/replace.head             |          1,257.63 (108.9) |         1,142.34 (230.79) |  -9.17% |    -0.24% (27.5 pp) |
| throughput/1000/replace.head            |          1,230.54 (93.58) |          1,223.53 (91.54) |  -0.57% |   +0.76% (15.01 pp) |
| throughput/5000/replace.head            |          1,174.57 (43.52) |           1,151.4 (66.23) |  -1.97% |    -2.95% (0.94 pp) |
| throughput/10000/replace.head           |          1,143.18 (66.51) |         1,194.69 (101.25) |  +4.51% |    +4.51% (9.85 pp) |
| throughput/15000/replace.head           |           1,195.79 (66.7) |             1,159.3 (232) |  -3.05% |   -3.80% (23.66 pp) |
| throughput/20000/replace.head           |          1,267.63 (75.95) |          1,245.16 (36.47) |  -1.77% |    -2.16% (7.64 pp) |
| throughput/25000/replace.head           |         1,210.21 (104.96) |           1,228.2 (96.78) |  +1.49% |   -0.53% (11.81 pp) |
| throughput/100/replace.middle           |         1,284.72 (128.82) |          1,192.5 (240.38) |  -7.18% |  -13.87% (26.37 pp) |
| throughput/1000/replace.middle          |          1,268.46 (18.92) |          1,280.23 (63.44) |  +0.93% |   +1.55% (17.13 pp) |
| throughput/5000/replace.middle          |           1,212.1 (56.59) |          1,197.01 (65.63) |  -1.24% |    -0.18% (8.51 pp) |
| throughput/10000/replace.middle         |          1,253.39 (53.07) |          1,231.65 (83.84) |  -1.73% |   -0.94% (17.04 pp) |
| throughput/15000/replace.middle         |          1,241.25 (99.26) |         1,323.23 (291.34) |  +6.60% |   +4.99% (18.85 pp) |
| throughput/20000/replace.middle         |          1,301.42 (28.73) |           1,268.97 (76.7) |  -2.49% |    -2.88% (9.57 pp) |
| throughput/25000/replace.middle         |          1,269.17 (61.79) |         1,288.56 (149.91) |  +1.53% |     +1.66% (8.8 pp) |
| throughput/100/replace.random           |         1,882.55 (202.17) |         1,893.51 (460.77) |  +0.58% |   +6.45% (47.25 pp) |
| throughput/1000/replace.random          |          1,860.7 (195.05) |          1,868.01 (74.34) |  +0.39% |    +2.87% (5.06 pp) |
| throughput/5000/replace.random          |         1,765.43 (113.42) |           1,760.4 (40.88) |  -0.28% |    +1.24% (7.55 pp) |
| throughput/10000/replace.random         |          1,773.09 (75.77) |          1,711.58 (95.92) |  -3.47% |    -6.15% (8.26 pp) |
| throughput/15000/replace.random         |         1,781.53 (221.53) |         1,759.57 (356.79) |  -1.23% |   -7.67% (27.77 pp) |
| throughput/20000/replace.random         |         1,822.32 (170.14) |          1,865.02 (92.55) |  +2.34% |    +2.98% (3.96 pp) |
| throughput/25000/replace.random         |         1,790.69 (139.15) |           1,850.3 (69.64) |  +3.33% |   +3.34% (11.47 pp) |
| throughput/100/replace.sameIndex        |          1,245.37 (88.87) |         1,211.67 (197.13) |  -2.71% |   +1.38% (37.36 pp) |
| throughput/1000/replace.sameIndex       |         1,216.29 (126.24) |         1,210.99 (112.25) |  -0.44% |   +0.97% (12.06 pp) |
| throughput/5000/replace.sameIndex       |          1,142.75 (81.17) |          1,160.39 (56.35) |  +1.54% |    +3.74% (4.76 pp) |
| throughput/10000/replace.sameIndex      |          1,201.86 (95.67) |          1,193.37 (173.4) |  -0.71% |   -3.79% (21.53 pp) |
| throughput/15000/replace.sameIndex      |          1,156.01 (33.31) |         1,232.79 (373.44) |  +6.64% |   +6.61% (34.47 pp) |
| throughput/20000/replace.sameIndex      |          1,242.68 (48.28) |          1,224.51 (64.09) |  -1.46% |    -1.00% (5.19 pp) |
| throughput/25000/replace.sameIndex      |          1,227.09 (63.28) |          1,219.15 (51.71) |  -0.65% |    -0.65% (3.96 pp) |
| throughput/100/replace.tail             |           1,232.6 (75.09) |          1,235.6 (143.73) |  +0.24% |   +0.31% (23.94 pp) |
| throughput/1000/replace.tail            |          1,242.89 (98.15) |          1,221.92 (77.38) |  -1.69% |    -0.02% (6.82 pp) |
| throughput/5000/replace.tail            |           1,169.3 (72.89) |          1,173.01 (63.81) |  +0.32% |    -0.37% (5.44 pp) |
| throughput/10000/replace.tail           |          1,204.63 (68.71) |          1,191.59 (104.1) |  -1.08% |   -4.02% (15.51 pp) |
| throughput/15000/replace.tail           |         1,199.36 (104.59) |         1,207.76 (163.52) |  +0.70% |    +0.70% (6.66 pp) |
| throughput/20000/replace.tail           |          1,252.02 (78.62) |          1,249.95 (28.69) |  -0.17% |    +0.64% (8.91 pp) |
| throughput/25000/replace.tail           |         1,304.38 (119.72) |          1,309.09 (96.08) |  +0.36% |    -2.15% (3.87 pp) |
| throughput/100/retire                   |             223.4 (26.74) |           251.79 (121.35) | +12.71% |  +11.69% (44.53 pp) |
| throughput/1000/retire                  |             221.12 (15.5) |            220.22 (17.03) |  -0.41% |    +1.37% (16.2 pp) |
| throughput/5000/retire                  |                206 (6.18) |             208.55 (6.58) |  +1.24% |    +1.77% (2.77 pp) |
| throughput/10000/retire                 |             205.99 (5.68) |            205.19 (16.26) |  -0.39% |    +1.51% (9.58 pp) |
| throughput/15000/retire                 |            192.88 (18.94) |            195.82 (10.58) |  +1.52% |   -0.57% (14.37 pp) |
| throughput/20000/retire                 |             185.99 (7.87) |            201.25 (11.13) |  +8.20% |   +9.05% (13.02 pp) |
| throughput/25000/retire                 |             190.66 (14.8) |            194.76 (13.74) |  +2.15% |    +3.69% (3.65 pp) |
| throughput/100/sequence                 |            338.91 (27.15) |            345.82 (68.52) |  +2.04% |     +14.10% (27 pp) |
| throughput/1000/sequence                |            308.51 (31.98) |             314.9 (24.99) |  +2.07% |    +1.80% (9.45 pp) |
| throughput/5000/sequence                |             285.29 (4.65) |            279.36 (14.91) |  -2.08% |    -2.95% (5.16 pp) |
| throughput/10000/sequence               |             273.7 (14.95) |             271.13 (3.34) |  -0.94% |     -3.02% (8.5 pp) |
| throughput/15000/sequence               |            265.95 (18.28) |            277.16 (33.73) |  +4.22% |   +3.21% (12.87 pp) |
| throughput/20000/sequence               |             281.94 (63.2) |             259.6 (33.75) |  -7.92% |  -10.66% (29.94 pp) |
| throughput/25000/sequence               |             261.89 (8.92) |             265.21 (33.4) |  +1.27% |    +3.10% (9.87 pp) |
| throughput/100/value.head               |            201.58 (10.53) |            204.22 (15.85) |  +1.31% |   +6.47% (17.48 pp) |
| throughput/1000/value.head              |            165.23 (18.14) |             170.63 (9.11) |  +3.27% |   +0.57% (15.01 pp) |
| throughput/5000/value.head              |            149.76 (11.83) |             144.23 (5.84) |  -3.69% |    -2.06% (8.37 pp) |
| throughput/10000/value.head             |            142.17 (16.51) |            142.02 (17.15) |  -0.10% |   +3.79% (13.83 pp) |
| throughput/15000/value.head             |             140.49 (5.25) |            160.49 (46.91) | +14.24% |  +10.36% (20.25 pp) |
| throughput/20000/value.head             |             139.41 (9.24) |             139.23 (4.62) |  -0.13% |    -0.45% (1.23 pp) |
| throughput/25000/value.head             |            135.24 (17.08) |            138.16 (21.13) |  +2.16% |   +4.21% (13.44 pp) |
| throughput/100/value.middle             |             286.1 (22.89) |            270.67 (18.69) |  -5.39% |   +0.03% (19.06 pp) |
| throughput/1000/value.middle            |            258.84 (12.46) |             262.81 (21.3) |  +1.53% |   -1.32% (14.66 pp) |
| throughput/5000/value.middle            |            237.96 (11.69) |            228.81 (47.05) |  -3.85% |   -2.33% (21.54 pp) |
| throughput/10000/value.middle           |            239.59 (16.76) |              228.7 (8.33) |  -4.55% |     -0.72% (9.1 pp) |
| throughput/15000/value.middle           |            213.37 (13.98) |            238.62 (37.68) | +11.83% |    +10.14% (7.1 pp) |
| throughput/20000/value.middle           |             211.9 (21.45) |             219.39 (9.26) |  +3.53% |    -0.46% (8.95 pp) |
| throughput/25000/value.middle           |            222.13 (29.54) |            217.14 (13.96) |  -2.25% |    +1.48% (6.25 pp) |
| throughput/100/value.random             |             244.9 (10.65) |             229.04 (3.13) |  -6.48% |    -6.14% (9.03 pp) |
| throughput/1000/value.random            |              227.8 (13.7) |            245.01 (20.37) |  +7.55% |  +11.72% (17.36 pp) |
| throughput/5000/value.random            |            288.64 (27.42) |             272.37 (22.1) |  -5.64% |   +0.40% (11.91 pp) |
| throughput/10000/value.random           |            283.77 (15.44) |             281.85 (22.2) |  -0.68% |   -0.58% (12.22 pp) |
| throughput/15000/value.random           |            268.33 (15.49) |            292.86 (41.75) |  +9.14% |  +15.40% (21.34 pp) |
| throughput/20000/value.random           |            281.52 (18.78) |            276.07 (28.58) |  -1.94% |   -2.58% (16.24 pp) |
| throughput/25000/value.random           |            274.02 (35.02) |            287.59 (17.96) |  +4.95% |    +4.07% (1.46 pp) |
| throughput/100/value.sameIndex          |            211.49 (25.03) |            207.61 (18.73) |  -1.83% |   +4.25% (13.18 pp) |
| throughput/1000/value.sameIndex         |             181.94 (8.87) |             185.83 (9.43) |  +2.14% |   +2.16% (11.57 pp) |
| throughput/5000/value.sameIndex         |            170.36 (28.09) |            197.07 (41.13) | +15.68% |   +9.23% (18.11 pp) |
| throughput/10000/value.sameIndex        |              168.44 (6.7) |            170.34 (60.67) |  +1.13% |   +1.13% (38.32 pp) |
| throughput/15000/value.sameIndex        |            167.63 (47.56) |             169.39 (23.9) |  +1.05% |   -1.95% (13.72 pp) |
| throughput/20000/value.sameIndex        |            167.59 (36.54) |             167.52 (5.71) |  -0.04% |   +1.95% (25.96 pp) |
| throughput/25000/value.sameIndex        |             157.29 (9.69) |            157.95 (68.68) |  +0.42% |   +3.69% (37.01 pp) |
| throughput/100/value.tail               |             245.14 (7.62) |             251.59 (1.91) |  +2.63% |   +1.83% (15.33 pp) |
| throughput/1000/value.tail              |             217.71 (6.59) |            228.44 (11.49) |  +4.93% |    +6.63% (7.62 pp) |
| throughput/5000/value.tail              |            203.86 (15.31) |            224.12 (92.21) |  +9.94% |   +8.66% (41.27 pp) |
| throughput/10000/value.tail             |             195.77 (6.78) |             197.86 (9.14) |  +1.07% |    -0.26% (5.91 pp) |
| throughput/15000/value.tail             |             193.53 (8.66) |            195.25 (35.51) |  +0.89% |   +3.01% (19.34 pp) |
| throughput/20000/value.tail             |              182.6 (2.19) |             190.57 (2.31) |  +4.36% |    +3.88% (6.11 pp) |
| throughput/25000/value.tail             |             186.77 (18.8) |            181.65 (17.34) |  -2.74% |    -0.10% (6.36 pp) |
| throughput/100/values                   |         5,140.12 (791.68) |         5,020.62 (612.86) |  -2.32% |   -3.20% (16.96 pp) |
| throughput/1000/values                  |    172,034.63 (14,455.13) |    173,439.62 (19,586.29) |  +0.82% |    +0.81% (6.18 pp) |
| throughput/5000/values                  |    553,023.96 (63,692.68) |    572,365.36 (48,723.18) |  +3.50% |    +0.62% (4.23 pp) |
| throughput/10000/values                 |  1,234,180.47 (275,062.7) | 1,152,878.91 (108,849.61) |  -6.59% |   -6.19% (19.94 pp) |
| throughput/15000/values                 |  1,818,449.22 (186,454.3) | 1,756,089.84 (261,567.97) |  -3.43% |   -0.69% (24.67 pp) |
| throughput/20000/values                 | 2,454,671.88 (156,719.92) | 2,641,755.47 (768,217.97) |  +7.62% |   +7.97% (31.76 pp) |
| throughput/25000/values                 | 3,524,249.22 (166,199.22) | 3,671,359.38 (656,155.47) |  +4.17% |   +5.87% (27.43 pp) |
| throughput/100/values.head              |            355.94 (18.61) |             333.5 (87.35) |  -6.31% |   +8.37% (28.91 pp) |
| throughput/1000/values.head             |             284.4 (23.24) |            287.78 (10.72) |  +1.19% |    +1.28% (3.89 pp) |
| throughput/5000/values.head             |             278.3 (58.05) |           271.17 (155.64) |  -2.56% |   -3.72% (73.54 pp) |
| throughput/10000/values.head            |             269.7 (24.14) |             272.65 (28.4) |  +1.09% |   +0.08% (19.36 pp) |
| throughput/15000/values.head            |            252.76 (14.22) |            267.56 (15.41) |  +5.85% |    +4.19% (2.88 pp) |
| throughput/20000/values.head            |            263.94 (19.23) |            278.95 (43.23) |  +5.69% |   +6.75% (13.36 pp) |
| throughput/25000/values.head            |            283.19 (25.57) |            277.16 (42.02) |  -2.13% |    +1.87% (7.22 pp) |
| throughput/100/values.middle            |            306.42 (22.67) |             311.85 (25.6) |  +1.77% |   +5.50% (19.26 pp) |
| throughput/1000/values.middle           |             279.11 (9.27) |            272.97 (10.65) |  -2.20% |    -3.46% (6.67 pp) |
| throughput/5000/values.middle           |            276.24 (32.48) |            287.94 (32.67) |  +4.24% |   +2.42% (16.16 pp) |
| throughput/10000/values.middle          |            288.43 (52.33) |             292.2 (41.91) |  +1.31% |   -7.74% (30.12 pp) |
| throughput/15000/values.middle          |            241.16 (47.37) |            248.64 (19.01) |  +3.10% |   +3.94% (12.06 pp) |
| throughput/20000/values.middle          |             272.02 (12.4) |             293.7 (56.31) |  +7.97% |     +11.20% (20 pp) |
| throughput/25000/values.middle          |            253.57 (54.22) |            241.41 (19.29) |  -4.79% |   -3.01% (14.66 pp) |
| throughput/100/values.random            |            337.62 (32.15) |            343.39 (34.76) |  +1.71% |   +4.11% (23.58 pp) |
| throughput/1000/values.random           |            313.78 (33.85) |              305.5 (6.57) |  -2.64% |   -2.10% (13.56 pp) |
| throughput/5000/values.random           |            365.73 (34.36) |            333.67 (35.84) |  -8.76% |   -8.22% (19.01 pp) |
| throughput/10000/values.random          |            407.17 (29.02) |            368.31 (92.27) |  -9.55% |  -13.43% (27.62 pp) |
| throughput/15000/values.random          |            378.22 (47.85) |             366.21 (13.5) |  -3.17% |    -2.38% (3.99 pp) |
| throughput/20000/values.random          |            391.28 (20.12) |            431.73 (30.15) | +10.34% |  +12.26% (12.16 pp) |
| throughput/25000/values.random          |            411.66 (78.86) |            394.94 (20.98) |  -4.06% |   -5.25% (19.43 pp) |
| throughput/100/values.sameIndex         |            325.97 (18.81) |            321.01 (51.83) |  -1.52% |   -0.32% (33.02 pp) |
| throughput/1000/values.sameIndex        |            274.39 (11.45) |             275.65 (3.56) |  +0.46% |       -0.28% (7 pp) |
| throughput/5000/values.sameIndex        |            272.32 (33.69) |            270.28 (26.94) |  -0.75% |   -6.04% (19.67 pp) |
| throughput/10000/values.sameIndex       |            270.73 (24.94) |             280.03 (5.92) |  +3.44% |    +5.28% (10.9 pp) |
| throughput/15000/values.sameIndex       |            243.11 (25.69) |            239.14 (24.26) |  -1.63% |   -3.68% (19.27 pp) |
| throughput/20000/values.sameIndex       |            267.61 (10.55) |             282.3 (38.62) |  +5.49% |  +14.77% (16.68 pp) |
| throughput/25000/values.sameIndex       |            268.92 (74.27) |            241.45 (27.94) | -10.21% |  -10.53% (33.38 pp) |
| throughput/100/values.tail              |            305.37 (13.24) |            301.32 (23.48) |  -1.33% |   +2.64% (19.16 pp) |
| throughput/1000/values.tail             |            274.44 (14.98) |            284.55 (25.19) |  +3.68% |    +4.58% (7.03 pp) |
| throughput/5000/values.tail             |            247.62 (12.89) |            272.47 (57.45) | +10.04% |  +12.54% (24.87 pp) |
| throughput/10000/values.tail            |            236.95 (15.13) |            303.15 (60.49) | +27.94% |  +15.33% (32.42 pp) |
| throughput/15000/values.tail            |            233.19 (19.79) |            236.06 (31.02) |  +1.23% |   +3.20% (19.52 pp) |
| throughput/20000/values.tail            |             268.38 (9.28) |            258.07 (17.05) |  -3.84% |   -5.88% (14.48 pp) |
| throughput/25000/values.tail            |            253.09 (22.45) |            238.47 (10.88) |  -5.78% |   -2.32% (10.49 pp) |
| lifecycle/scaleUp/apply.random          |         3,814.91 (487.96) |         3,858.69 (298.72) |  +1.15% |    -1.31% (5.62 pp) |
| lifecycle/scaleUp/insert.head           |             854.8 (43.67) |            857.62 (84.39) |  +0.33% |    -0.09% (6.34 pp) |
| lifecycle/scaleUp/insert.random         |         1,787.71 (152.76) |         1,749.67 (131.11) |  -2.13% |    +1.38% (4.12 pp) |
| lifecycle/scaleUp/insert.tail           |            837.34 (24.63) |            819.56 (96.02) |  -2.12% |    -2.44% (5.25 pp) |
| lifecycle/scaleUp/remove.random         |         2,760.19 (445.55) |         2,751.39 (149.06) |  -0.32% |    -0.32% (9.12 pp) |
| lifecycle/scaleUp/replace.head          |         2,846.95 (253.16) |         2,455.95 (258.48) | -13.73% |   -8.95% (12.18 pp) |
| lifecycle/scaleUp/replace.random        |         3,602.85 (359.13) |         3,544.58 (223.53) |  -1.62% |    -1.29% (7.24 pp) |
| lifecycle/scaleUp/replace.tail          |          2,633.95 (276.9) |          2,308.79 (47.84) | -12.34% |   -14.05% (9.46 pp) |
| lifecycle/scaleUp/value.head            |            324.59 (40.57) |            322.03 (20.09) |  -0.79% |    +0.80% (13.9 pp) |
| lifecycle/scaleUp/value.random          |         1,160.15 (124.09) |             1,138 (31.48) |  -1.91% |   -2.10% (13.95 pp) |
| lifecycle/scaleUp/value.tail            |             157.96 (8.21) |             152.16 (7.15) |  -3.67% |   -2.35% (10.11 pp) |
| lifecycle/scaleDown/apply.random        |         3,748.31 (688.08) |          3,478.2 (186.61) |  -7.21% |   -5.96% (14.44 pp) |
| lifecycle/scaleDown/insert.random       |          1,869.85 (150.7) |          1,741.58 (75.87) |  -6.86% |   -6.16% (10.27 pp) |
| lifecycle/scaleDown/remove.head         |         2,175.07 (319.27) |         1,928.92 (101.52) | -11.32% |   -11.73% (9.39 pp) |
| lifecycle/scaleDown/remove.random       |         3,093.91 (709.21) |            2,631 (189.02) | -14.96% |  -12.09% (15.58 pp) |
| lifecycle/scaleDown/remove.tail         |         2,018.65 (477.96) |         1,818.28 (526.69) |  -9.93% |  -11.49% (13.25 pp) |
| lifecycle/scaleDown/replace.head        |         2,867.06 (153.58) |          2,705.79 (364.7) |  -5.62% |   -7.40% (20.29 pp) |
| lifecycle/scaleDown/replace.random      |         3,505.86 (538.05) |         3,476.22 (290.72) |  -0.85% |    -4.11% (7.79 pp) |
| lifecycle/scaleDown/replace.tail        |       22,803.79 (3,554.8) |        19,604.25 (735.47) | -14.03% |  -14.49% (11.29 pp) |
| lifecycle/scaleDown/value.head          |            470.43 (61.74) |            427.14 (11.05) |  -9.20% |    -7.53% (9.19 pp) |
| lifecycle/scaleDown/value.random        |          1,175.62 (93.66) |          1,095.57 (68.93) |  -6.81% |   -6.72% (12.12 pp) |
| lifecycle/scaleDown/value.tail          |            248.43 (14.91) |             237.62 (6.74) |  -4.35% |    -5.28% (7.35 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,951.43 (429.97) |         3,770.29 (130.03) |  -4.58% |   -5.80% (11.31 pp) |
| lifecycle/fullLifecycle/insert.head     |             854.8 (43.67) |            857.62 (84.39) |  +0.33% |    -0.09% (6.34 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,914.99 (197.69) |          1,759.57 (94.85) |  -8.12% |   -1.43% (15.75 pp) |
| lifecycle/fullLifecycle/insert.tail     |            837.34 (24.63) |            819.56 (96.02) |  -2.12% |    -2.44% (5.25 pp) |
| lifecycle/fullLifecycle/remove.head     |         2,175.07 (319.27) |         1,928.92 (101.52) | -11.32% |   -11.73% (9.39 pp) |
| lifecycle/fullLifecycle/remove.random   |          3,053.63 (315.1) |         2,735.07 (110.23) | -10.43% |   -9.47% (11.09 pp) |
| lifecycle/fullLifecycle/remove.tail     |         2,018.65 (477.96) |         1,818.28 (526.69) |  -9.93% |  -11.49% (13.25 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,901.46 (135.33) |          2,656.36 (64.57) |  -8.45% |    -8.71% (8.58 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,679.51 (502.56) |         3,602.42 (195.71) |  -2.10% |    -1.34% (7.73 pp) |
| lifecycle/fullLifecycle/replace.tail    |      12,783.85 (1,827.44) |         10,979.74 (388.7) | -14.11% |   -13.95% (9.74 pp) |
| lifecycle/fullLifecycle/value.head      |            408.03 (24.52) |             375.68 (8.21) |  -7.93% |    -6.62% (7.48 pp) |
| lifecycle/fullLifecycle/value.random    |         1,221.65 (108.79) |          1,123.46 (44.48) |  -8.04% |   -9.21% (12.48 pp) |
| lifecycle/fullLifecycle/value.tail      |             207.23 (8.48) |             194.78 (4.79) |  -6.01% |    -5.18% (7.06 pp) |
| checkpoint/up/1000/create               |          420,150 (30,425) |          396,000 (22,525) |  -5.75% |   -9.07% (12.83 pp) |
| checkpoint/up/1000/sequence             |       2,626,350 (128,550) |       2,689,600 (300,375) |  +2.41% |   +2.40% (25.19 pp) |
| checkpoint/up/1000/values               |        1,829,100 (22,775) |       1,983,350 (137,075) |  +8.43% |   +9.97% (15.94 pp) |
| checkpoint/up/5000/create               |       1,049,950 (150,050) |          907,350 (35,675) | -13.58% |   -9.25% (16.41 pp) |
| checkpoint/up/5000/sequence             |     9,813,400 (1,850,800) |       8,350,100 (554,275) | -14.91% |  -12.10% (24.11 pp) |
| checkpoint/up/5000/values               |       4,820,150 (765,350) |       4,923,850 (606,175) |  +2.15% |    -1.51% (8.98 pp) |
| checkpoint/up/10000/create              |       1,637,800 (272,750) |        1,539,200 (41,450) |  -6.02% |   -6.44% (20.66 pp) |
| checkpoint/up/10000/sequence            |    13,384,850 (3,338,950) |    13,587,750 (1,412,950) |  +1.52% |   +0.67% (23.08 pp) |
| checkpoint/up/10000/values              |      20,778,500 (577,575) |    20,877,600 (1,255,925) |  +0.48% |    -1.30% (6.19 pp) |
| checkpoint/up/15000/create              |       2,424,150 (104,650) |        2,440,050 (97,600) |  +0.66% |    +3.38% (6.86 pp) |
| checkpoint/up/15000/sequence            |      14,951,450 (503,875) |      14,948,000 (484,225) |  -0.02% |   -0.03% (12.26 pp) |
| checkpoint/up/15000/values              |      31,024,550 (797,275) |    30,199,650 (1,384,775) |  -2.66% |    -0.95% (3.48 pp) |
| checkpoint/up/20000/create              |     3,874,200 (1,064,500) |       3,403,300 (118,250) | -12.15% |   -9.15% (23.32 pp) |
| checkpoint/up/20000/sequence            |    21,761,300 (1,429,900) |      21,217,450 (472,375) |  -2.50% |    -3.30% (4.47 pp) |
| checkpoint/up/20000/values              |    11,051,650 (1,221,325) |      10,828,550 (394,725) |  -2.02% |   -4.00% (16.29 pp) |
| checkpoint/up/25000/create              |     5,042,050 (1,704,400) |       3,971,150 (249,650) | -21.24% |  -17.96% (10.25 pp) |
| checkpoint/up/25000/sequence            |    27,289,850 (6,348,325) |      23,404,550 (967,250) | -14.24% |   -7.92% (12.49 pp) |
| checkpoint/up/25000/values              |    13,273,750 (1,228,575) |    11,390,950 (1,060,900) | -14.18% |   -8.89% (21.61 pp) |
| checkpoint/down/20000/create            |       3,462,150 (101,800) |       3,588,050 (189,225) |  +3.64% |    +2.84% (7.48 pp) |
| checkpoint/down/20000/sequence          |    19,191,400 (2,515,625) |    20,458,200 (3,744,350) |  +6.60% |   +5.93% (31.57 pp) |
| checkpoint/down/20000/values            |     9,877,100 (1,070,800) |     9,559,700 (1,001,375) |  -3.21% |    -3.92% (12.9 pp) |
| checkpoint/down/15000/create            |       2,525,350 (233,200) |        2,384,650 (82,125) |  -5.57% |    -4.91% (4.58 pp) |
| checkpoint/down/15000/sequence          |    16,110,500 (3,358,275) |      15,602,900 (471,600) |  -3.15% |    -2.66% (3.26 pp) |
| checkpoint/down/15000/values            |       7,234,650 (473,350) |       7,568,300 (592,325) |  +4.61% |    -1.29% (8.78 pp) |
| checkpoint/down/10000/create            |        1,661,500 (27,875) |       1,706,650 (100,500) |  +2.72% |    +2.32% (7.08 pp) |
| checkpoint/down/10000/sequence          |    12,777,100 (1,282,350) |      13,204,900 (610,325) |  +3.35% |   +4.10% (15.47 pp) |
| checkpoint/down/10000/values            |       5,441,450 (781,500) |       5,243,500 (710,525) |  -3.64% |    -8.25% (17.1 pp) |
| checkpoint/down/5000/create             |          813,750 (36,350) |          808,350 (31,350) |  -0.66% |    -0.08% (6.86 pp) |
| checkpoint/down/5000/sequence           |     9,677,800 (3,462,625) |       9,501,150 (540,125) |  -1.83% |   -2.13% (24.05 pp) |
| checkpoint/down/5000/values             |       2,926,250 (361,650) |       2,624,500 (443,050) | -10.31% |  -14.29% (22.68 pp) |
| checkpoint/down/1000/create             |          182,900 (47,250) |          193,000 (60,875) |  +5.52% |    +7.34% (9.47 pp) |
| checkpoint/down/1000/sequence           |     6,014,200 (2,425,025) |     6,257,900 (2,089,325) |  +4.05% |   -3.89% (52.01 pp) |
| checkpoint/down/1000/values             |          562,950 (50,400) |          527,400 (66,600) |  -6.31% |   -6.41% (18.56 pp) |
| checkpoint/down/0/create                |            17,700 (6,925) |            16,800 (4,375) |  -5.08% |  -12.65% (27.84 pp) |
| checkpoint/down/0/sequence              |       1,634,450 (776,275) |       1,391,250 (320,325) | -14.88% |  -16.31% (46.41 pp) |
| checkpoint/down/0/values                |            13,100 (7,575) |            11,200 (1,625) | -14.50% |  -17.24% (49.59 pp) |
| tuple/projection/2/create.empty         |               386.45 (38) |            368.14 (17.07) |  -4.74% |     -0.68% (6.9 pp) |
| tuple/tuple/2/create.empty              |             445.74 (8.45) |             441.25 (5.95) |  -1.01% |    -0.60% (1.31 pp) |
| tuple/projection/2/create.sequence      |          1,283.76 (40.81) |          1,300.65 (31.73) |  +1.32% |    +2.37% (3.58 pp) |
| tuple/tuple/2/create.sequence           |          1,451.24 (75.37) |           1,471.4 (31.66) |  +1.39% |    +0.98% (7.17 pp) |
| tuple/projection/2/replace.random       |          1,031.8 (103.39) |         1,083.95 (107.55) |  +5.05% |    +3.84% (9.03 pp) |
| tuple/tuple/2/replace.random            |            702.49 (25.37) |            713.08 (28.93) |  +1.51% |     -0.52% (7.4 pp) |
| tuple/projection/2/apply.replace        |          1,751.33 (78.76) |          1,804.39 (98.45) |  +3.03% |    +3.06% (8.44 pp) |
| tuple/tuple/2/apply.replace             |          1,167.41 (72.09) |          1,195.01 (72.99) |  +2.36% |   +0.16% (10.29 pp) |
| tuple/projection/2/apply.duplicate      |            639.15 (32.22) |            645.47 (12.61) |  +0.99% |    +0.24% (6.94 pp) |
| tuple/tuple/2/apply.duplicate           |               633.47 (53) |            652.48 (25.64) |  +3.00% |   +5.69% (12.74 pp) |
| tuple/projection/2/merge.duplicate      |            694.91 (65.28) |            718.49 (42.37) |  +3.39% |    +4.06% (9.78 pp) |
| tuple/tuple/2/merge.duplicate           |            673.94 (46.65) |            674.51 (21.85) |  +0.08% |    +4.71% (8.01 pp) |
| tuple/projection/2/length               |               7.58 (0.46) |               8.34 (0.98) | +10.04% |  +10.63% (17.35 pp) |
| tuple/tuple/2/length                    |               7.63 (0.31) |               7.54 (0.38) |  -1.21% |    +2.72% (6.28 pp) |
| tuple/projection/2/value.random         |              30.94 (2.22) |              29.35 (1.98) |  -5.14% |    -3.22% (7.69 pp) |
| tuple/tuple/2/value.random              |                 20.43 (1) |              19.18 (0.67) |  -6.13% |    -6.33% (5.08 pp) |
| tuple/projection/2/values               |              78.91 (5.64) |              79.19 (6.03) |  +0.35% |    -1.16% (6.13 pp) |
| tuple/tuple/2/values                    |             83.45 (58.07) |              80.8 (10.84) |  -3.18% |   +1.88% (15.97 pp) |
| tuple/projection/2/sequence             |            500.62 (45.56) |            462.85 (80.43) |  -7.54% |   +1.68% (18.99 pp) |
| tuple/tuple/2/sequence                  |            530.37 (58.01) |           541.56 (126.52) |  +2.11% |  +10.86% (14.85 pp) |
| tuple/projection/4/create.empty         |            436.95 (61.84) |           442.73 (116.56) |  +1.32% |   +5.62% (19.94 pp) |
| tuple/tuple/4/create.empty              |            481.08 (51.73) |           457.18 (116.55) |  -4.97% |   -4.66% (30.05 pp) |
| tuple/projection/4/create.sequence      |         1,713.18 (133.67) |         1,817.53 (415.55) |  +6.09% |   +8.16% (34.36 pp) |
| tuple/tuple/4/create.sequence           |         1,738.66 (465.02) |         1,717.89 (357.22) |  -1.19% |   +1.51% (41.85 pp) |
| tuple/projection/4/replace.random       |         1,404.32 (585.23) |          1,226.9 (340.04) | -12.63% |  -13.66% (61.52 pp) |
| tuple/tuple/4/replace.random            |           887.61 (348.91) |           655.68 (259.75) | -26.13% |  -18.25% (58.59 pp) |
| tuple/projection/4/apply.replace        |          2,112.01 (689.7) |       1,804.38 (1,300.09) | -14.57% |  -11.81% (96.29 pp) |
| tuple/tuple/4/apply.replace             |         1,214.24 (314.91) |         1,147.89 (721.78) |  -5.46% |      -3.23% (91 pp) |
| tuple/projection/4/apply.duplicate      |           664.35 (144.53) |            647.2 (230.04) |  -2.58% |   -1.40% (55.92 pp) |
| tuple/tuple/4/apply.duplicate           |           704.04 (209.21) |           660.81 (157.76) |  -6.14% |   -2.20% (50.42 pp) |
| tuple/projection/4/merge.duplicate      |           897.14 (255.36) |           830.74 (152.08) |  -7.40% |   -6.70% (47.97 pp) |
| tuple/tuple/4/merge.duplicate           |           924.77 (273.06) |           844.09 (108.53) |  -8.73% |   -8.49% (37.13 pp) |
| tuple/projection/4/length               |             28.24 (15.23) |              28.56 (3.95) |  +1.14% |   +1.31% (49.04 pp) |
| tuple/tuple/4/length                    |             26.78 (11.56) |              27.97 (1.89) |  +4.46% |   +4.89% (46.49 pp) |
| tuple/projection/4/value.random         |              42.04 (9.46) |              42.65 (1.71) |  +1.46% |   +3.09% (19.58 pp) |
| tuple/tuple/4/value.random              |              20.01 (1.28) |               19.2 (0.84) |  -4.02% |    -2.44% (6.21 pp) |
| tuple/projection/4/values               |             151.18 (2.17) |              146.9 (4.34) |  -2.83% |     -1.11% (6.7 pp) |
| tuple/tuple/4/values                    |            143.25 (28.83) |             148.04 (6.14) |  +3.34% |    +4.82% (1.07 pp) |
| tuple/projection/4/sequence             |             468.62 (4.25) |            466.49 (14.75) |  -0.46% |    +0.31% (4.45 pp) |
| tuple/tuple/4/sequence                  |            566.23 (10.24) |            562.28 (20.06) |  -0.70% |    -0.64% (4.35 pp) |
| tuple/projection/8/create.empty         |             420.4 (13.31) |            423.87 (36.81) |  +0.83% |    +2.78% (7.91 pp) |
| tuple/tuple/8/create.empty              |            447.44 (33.74) |             462.9 (22.19) |  +3.46% |    +4.29% (3.44 pp) |
| tuple/projection/8/create.sequence      |          2,372.26 (36.15) |         2,273.57 (214.83) |  -4.16% |   -0.64% (12.41 pp) |
| tuple/tuple/8/create.sequence           |           2,114.54 (38.4) |          2,082.94 (54.67) |  -1.49% |    -1.66% (2.78 pp) |
| tuple/projection/8/replace.random       |           1,172.6 (26.21) |          1,210.42 (36.79) |  +3.23% |    +2.06% (5.73 pp) |
| tuple/tuple/8/replace.random            |            695.92 (57.51) |             688.08 (44.7) |  -1.13% |   -0.46% (10.08 pp) |
| tuple/projection/8/apply.replace        |          1,729.78 (61.05) |         1,770.17 (189.69) |  +2.34% |   +2.30% (12.39 pp) |
| tuple/tuple/8/apply.replace             |          1,051.55 (54.99) |          1,100.08 (97.75) |  +4.62% |   +3.16% (10.86 pp) |
| tuple/projection/8/apply.duplicate      |            603.98 (19.57) |            647.34 (48.76) |  +7.18% |     +6.24% (9.5 pp) |
| tuple/tuple/8/apply.duplicate           |            603.28 (15.56) |            642.06 (24.99) |  +6.43% |    +6.90% (6.06 pp) |
| tuple/projection/8/merge.duplicate      |          1,047.79 (17.41) |          1,130.62 (77.95) |  +7.91% |    +6.16% (8.45 pp) |
| tuple/tuple/8/merge.duplicate           |          1,080.83 (18.65) |         1,161.06 (119.26) |  +7.42% |   +8.12% (12.15 pp) |
| tuple/projection/8/length               |              29.55 (3.25) |               27.33 (1.4) |  -7.52% |   -5.31% (28.06 pp) |
| tuple/tuple/8/length                    |              27.83 (5.85) |              26.62 (3.08) |  -4.34% |   -8.34% (22.34 pp) |
| tuple/projection/8/value.random         |             55.26 (12.26) |              57.05 (2.37) |  +3.24% |   +1.08% (20.15 pp) |
| tuple/tuple/8/value.random              |                 19 (3.75) |              19.44 (1.84) |  +2.32% |    -3.90% (23.5 pp) |
| tuple/projection/8/values               |            260.93 (70.03) |             229.7 (14.35) | -11.97% |  -11.47% (18.11 pp) |
| tuple/tuple/8/values                    |             220.89 (35.9) |             210.43 (16.5) |  -4.73% |   -2.74% (18.33 pp) |
| tuple/projection/8/sequence             |             708.63 (85.9) |            672.61 (66.71) |  -5.08% |   -8.95% (16.32 pp) |
| tuple/tuple/8/sequence                  |             720.3 (39.39) |            715.62 (74.31) |  -0.65% |    -5.43% (9.44 pp) |
| tuple/projection/100/create.empty       |            490.87 (72.56) |            468.91 (42.31) |  -4.47% |   -0.78% (18.57 pp) |
| tuple/tuple/100/create.empty            |            499.84 (92.57) |            475.58 (17.29) |  -4.85% |   -1.20% (10.01 pp) |
| tuple/projection/100/create.sequence    |      14,245.76 (2,669.09) |        14,074.99 (353.23) |  -1.20% |    -1.83% (2.97 pp) |
| tuple/tuple/100/create.sequence         |      11,941.71 (4,026.92) |        11,633.57 (288.69) |  -2.58% |    +0.72% (8.55 pp) |
| tuple/projection/100/replace.random     |          1,328.93 (569.8) |         1,295.07 (221.73) |  -2.55% |   +3.38% (27.02 pp) |
| tuple/tuple/100/replace.random          |            718.76 (243.1) |             663.2 (128.8) |  -7.73% |   -9.52% (14.45 pp) |
| tuple/projection/100/apply.replace      |         1,890.23 (588.03) |         1,865.52 (196.24) |  -1.31% |    -6.56% (19.6 pp) |
| tuple/tuple/100/apply.replace           |         1,116.96 (320.03) |          1,055.86 (129.3) |  -5.47% |  -11.08% (19.33 pp) |
| tuple/projection/100/apply.duplicate    |            700.1 (143.44) |            646.34 (88.41) |  -7.68% |   -5.08% (19.34 pp) |
| tuple/tuple/100/apply.duplicate         |             682.53 (76.1) |            627.75 (54.18) |  -8.03% |   -4.42% (16.76 pp) |
| tuple/projection/100/merge.duplicate    |        9,634.65 (2,628.6) |         9,411.16 (447.67) |  -2.32% |    -1.21% (22.6 pp) |
| tuple/tuple/100/merge.duplicate         |         13,294.24 (556.1) |       13,448.4 (1,316.77) |  +1.16% |      -2.58% (12 pp) |
| tuple/projection/100/length             |              31.32 (6.25) |              27.29 (0.72) | -12.86% |   -2.09% (32.29 pp) |
| tuple/tuple/100/length                  |              27.99 (2.55) |              27.27 (4.38) |  -2.60% |   +0.12% (26.58 pp) |
| tuple/projection/100/value.random       |              81.97 (7.35) |              81.62 (2.02) |  -0.43% |    -1.59% (8.61 pp) |
| tuple/tuple/100/value.random            |              17.68 (0.26) |              18.42 (0.93) |  +4.20% |    +5.22% (4.44 pp) |
| tuple/projection/100/values             |          1,895.99 (75.26) |         1,869.22 (115.54) |  -1.41% |    -0.33% (7.96 pp) |
| tuple/tuple/100/values                  |          1,611.3 (111.17) |         1,527.47 (122.98) |  -5.20% |    -3.38% (7.41 pp) |
| tuple/projection/100/sequence           |         6,610.17 (190.65) |         6,271.85 (280.56) |  -5.12% |    -4.45% (2.83 pp) |
| tuple/tuple/100/sequence                |         5,652.63 (170.33) |         5,500.45 (261.92) |  -2.69% |    -4.20% (6.82 pp) |

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

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_23_hotpath/batch-compact*`. No external competitor was run.
