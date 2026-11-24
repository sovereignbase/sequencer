# Related Session coordinates: complete guard

5 complete matched runs per build. Before: baseline; candidate: session-orbit. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 53 timing medians improve over 5%; 98 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 0%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |   Change |  Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | -------: | -------------------: |
| throughput/100/apply.duplicate          |            751.57 (23.46) |            769.77 (59.97) |   +2.42% |   +11.05% (13.75 pp) |
| throughput/1000/apply.duplicate         |            728.68 (96.58) |            807.81 (56.04) |  +10.86% |   +13.26% (10.29 pp) |
| throughput/5000/apply.duplicate         |             376.01 (1.24) |             394.8 (47.67) |   +5.00% |    +5.00% (17.61 pp) |
| throughput/10000/apply.duplicate        |            371.91 (40.44) |            342.34 (50.52) |   -7.95% |    +1.16% (21.36 pp) |
| throughput/15000/apply.duplicate        |            331.19 (29.47) |             337.12 (7.28) |   +1.79% |     +3.55% (8.41 pp) |
| throughput/20000/apply.duplicate        |             333.26 (22.6) |            331.81 (15.28) |   -0.44% |     -2.27% (3.67 pp) |
| throughput/25000/apply.duplicate        |            317.31 (14.99) |            323.88 (10.47) |   +2.07% |    +0.60% (11.96 pp) |
| throughput/100/apply.duplicateRemove    |         1,786.61 (171.84) |           1,437.4 (53.31) |  -19.55% |    -16.59% (6.02 pp) |
| throughput/1000/apply.duplicateRemove   |            802.86 (61.53) |            833.69 (14.84) |   +3.84% |     +1.34% (6.32 pp) |
| throughput/5000/apply.duplicateRemove   |             754.33 (21.1) |              774.2 (77.1) |   +2.63% |    +2.07% (10.96 pp) |
| throughput/10000/apply.duplicateRemove  |            722.67 (40.05) |            718.78 (56.45) |   -0.54% |     +2.13% (2.17 pp) |
| throughput/15000/apply.duplicateRemove  |            728.97 (53.51) |            677.94 (21.46) |   -7.00% |     -0.69% (7.37 pp) |
| throughput/20000/apply.duplicateRemove  |            670.18 (31.59) |             697.6 (54.22) |   +4.09% |     +4.02% (3.62 pp) |
| throughput/25000/apply.duplicateRemove  |              659.54 (7.9) |            648.97 (78.23) |   -1.60% |     +0.50% (12.4 pp) |
| throughput/100/apply.duplicateReplace   |         1,094.79 (274.65) |         1,146.74 (251.47) |   +4.75% |    -10.68% (4.99 pp) |
| throughput/1000/apply.duplicateReplace  |           968.92 (129.58) |          1,076.16 (21.01) |  +11.07% |   +12.28% (20.42 pp) |
| throughput/5000/apply.duplicateReplace  |            926.17 (21.85) |            993.86 (41.31) |   +7.31% |     +4.12% (4.42 pp) |
| throughput/10000/apply.duplicateReplace |            872.54 (30.23) |           923.48 (637.52) |   +5.84% |    +9.89% (78.82 pp) |
| throughput/15000/apply.duplicateReplace |            821.48 (41.18) |            864.15 (24.35) |   +5.19% |     +2.50% (3.24 pp) |
| throughput/20000/apply.duplicateReplace |            808.25 (26.18) |            854.93 (54.78) |   +5.78% |    +5.78% (11.55 pp) |
| throughput/25000/apply.duplicateReplace |            786.37 (37.89) |            805.03 (58.32) |   +2.37% |     +4.24% (4.28 pp) |
| throughput/100/apply.insert             |          1,694.69 (54.18) |          1,611.35 (24.93) |   -4.92% |     -3.86% (2.42 pp) |
| throughput/1000/apply.insert            |         1,412.79 (262.11) |         1,424.08 (168.38) |   +0.80% |     +2.75% (3.02 pp) |
| throughput/5000/apply.insert            |          1,308.45 (63.41) |          1,368.82 (64.76) |   +4.61% |      +3.54% (2.3 pp) |
| throughput/10000/apply.insert           |         1,300.29 (115.91) |          1,354.2 (250.22) |   +4.15% |    +5.94% (27.95 pp) |
| throughput/15000/apply.insert           |           1,324.7 (15.73) |           1,322.4 (58.26) |   -0.17% |      +1.13% (2.6 pp) |
| throughput/20000/apply.insert           |          1,230.86 (70.26) |         1,365.93 (244.63) |  +10.97% |   +13.56% (18.68 pp) |
| throughput/25000/apply.insert           |         1,299.97 (154.57) |         1,295.18 (233.51) |   -0.37% |    +2.96% (13.92 pp) |
| throughput/100/apply.remove             |          1,837.21 (75.54) |           1,789.3 (86.54) |   -2.61% |     +1.20% (3.25 pp) |
| throughput/1000/apply.remove            |           1,466.6 (57.69) |          1,460.25 (53.99) |   -0.43% |     +0.14% (9.95 pp) |
| throughput/5000/apply.remove            |             1,516.66 (41) |           1,520.8 (48.54) |   +0.27% |     +1.95% (1.77 pp) |
| throughput/10000/apply.remove           |          1,411.45 (21.56) |         1,635.43 (437.26) |  +15.87% |   +17.66% (19.63 pp) |
| throughput/15000/apply.remove           |          1,531.78 (59.99) |          1,479.2 (147.28) |   -3.43% |    -3.83% (15.74 pp) |
| throughput/20000/apply.remove           |          1,518.76 (93.81) |         1,676.53 (103.64) |  +10.39% |    +5.13% (21.82 pp) |
| throughput/25000/apply.remove           |          1,492.41 (111.5) |         1,509.07 (441.79) |   +1.12% |     +1.12% (6.08 pp) |
| throughput/100/apply.replace            |         2,641.76 (159.82) |         2,568.84 (174.66) |   -2.76% |    -0.69% (12.66 pp) |
| throughput/1000/apply.replace           |          2,697.65 (41.55) |         2,688.33 (129.82) |   -0.35% |     +2.64% (8.17 pp) |
| throughput/5000/apply.replace           |          2,795.32 (89.64) |          2,795.55 (139.8) |   +0.01% |     +2.65% (9.13 pp) |
| throughput/10000/apply.replace          |          2,697.69 (81.29) |         2,755.27 (654.26) |   +2.13% |    +1.12% (14.53 pp) |
| throughput/15000/apply.replace          |         2,646.99 (100.17) |         2,749.02 (107.07) |   +3.85% |     +4.57% (2.72 pp) |
| throughput/20000/apply.replace          |         2,670.97 (162.05) |          2,823.68 (225.7) |   +5.72% |     +5.12% (3.24 pp) |
| throughput/25000/apply.replace          |         2,760.52 (225.02) |         2,993.87 (358.55) |   +8.45% |    +5.52% (17.03 pp) |
| throughput/100/create.empty             |           563.74 (118.73) |           597.24 (190.71) |   +5.94% |    +11.51% (30.4 pp) |
| throughput/1000/create.empty            |            634.49 (88.38) |            686.41 (63.81) |   +8.18% |    +9.97% (31.53 pp) |
| throughput/5000/create.empty            |            746.71 (27.81) |            791.38 (40.57) |   +5.98% |     +9.35% (6.48 pp) |
| throughput/10000/create.empty           |            725.92 (44.79) |           841.09 (328.43) |  +15.87% |   +17.42% (52.78 pp) |
| throughput/15000/create.empty           |            719.16 (90.78) |           811.36 (109.24) |  +12.82% |   +13.45% (14.39 pp) |
| throughput/20000/create.empty           |             700.66 (98.1) |               766 (27.25) |   +9.33% |    +12.24% (6.54 pp) |
| throughput/25000/create.empty           |            778.16 (80.94) |           721.97 (130.21) |   -7.22% |    -8.83% (31.38 pp) |
| throughput/100/create.sequence          |           1,549.8 (32.25) |          1,686.05 (56.12) |   +8.79% |     +5.43% (3.97 pp) |
| throughput/1000/create.sequence         |         1,775.31 (157.18) |         1,936.47 (193.71) |   +9.08% |     +9.08% (21.2 pp) |
| throughput/5000/create.sequence         |         1,679.67 (187.44) |           1,585.99 (92.1) |   -5.58% |     +5.81% (17.1 pp) |
| throughput/10000/create.sequence        |          1,684.85 (93.34) |         1,919.81 (142.54) |  +13.95% |   +12.88% (13.91 pp) |
| throughput/15000/create.sequence        |         1,459.47 (224.84) |         1,532.16 (201.97) |   +4.98% |   +11.39% (28.85 pp) |
| throughput/20000/create.sequence        |         1,765.33 (360.28) |         1,458.57 (305.39) |  -17.38% |     +0.88% (10.1 pp) |
| throughput/25000/create.sequence        |          1,481.14 (87.56) |         1,552.11 (109.16) |   +4.79% |    -1.05% (20.47 pp) |
| throughput/100/insert.head              |            551.76 (22.59) |            564.06 (94.13) |   +2.23% |    +1.69% (14.23 pp) |
| throughput/1000/insert.head             |             520.09 (8.69) |            543.92 (35.16) |   +4.58% |     +6.31% (6.67 pp) |
| throughput/5000/insert.head             |             543.5 (45.39) |            530.97 (65.17) |   -2.31% |    -6.45% (16.41 pp) |
| throughput/10000/insert.head            |            541.28 (33.39) |           580.78 (513.51) |   +7.30% |   +3.28% (117.44 pp) |
| throughput/15000/insert.head            |             504.2 (12.55) |            527.87 (18.33) |   +4.69% |     +3.07% (6.29 pp) |
| throughput/20000/insert.head            |             549.76 (48.2) |            495.58 (15.25) |   -9.86% |    -0.29% (14.77 pp) |
| throughput/25000/insert.head            |           465.05 (337.49) |            529.16 (66.04) |  +13.79% |    +1.03% (35.54 pp) |
| throughput/100/insert.middle            |            609.03 (21.57) |           608.26 (117.52) |   -0.13% |    +1.84% (16.31 pp) |
| throughput/1000/insert.middle           |             639.36 (7.66) |              635.2 (9.19) |   -0.65% |     +0.00% (4.51 pp) |
| throughput/5000/insert.middle           |            654.71 (43.47) |            609.67 (75.06) |   -6.88% |    -9.25% (15.62 pp) |
| throughput/10000/insert.middle          |            637.13 (15.35) |            765.11 (52.36) |  +20.09% |   +20.09% (11.05 pp) |
| throughput/15000/insert.middle          |            579.97 (20.14) |           622.91 (128.01) |   +7.40% |   +10.50% (27.94 pp) |
| throughput/20000/insert.middle          |            618.74 (43.66) |            602.68 (65.97) |   -2.60% |    -9.57% (18.99 pp) |
| throughput/25000/insert.middle          |            667.62 (93.37) |            576.78 (37.17) |  -13.61% |    -11.71% (9.27 pp) |
| throughput/100/insert.random            |            852.09 (144.9) |           946.47 (154.06) |  +11.08% |    +2.63% (23.85 pp) |
| throughput/1000/insert.random           |            967.64 (55.96) |            933.75 (45.17) |   -3.50% |    -2.81% (13.92 pp) |
| throughput/5000/insert.random           |            908.03 (31.17) |            920.57 (86.91) |   +1.38% |     +4.46% (9.82 pp) |
| throughput/10000/insert.random          |            930.13 (62.06) |           965.02 (115.32) |   +3.75% |     +8.80% (5.29 pp) |
| throughput/15000/insert.random          |             891.77 (41.4) |            938.85 (33.16) |   +5.28% |     +6.63% (7.74 pp) |
| throughput/20000/insert.random          |            919.98 (80.16) |            865.95 (90.05) |   -5.87% |     -5.29% (7.25 pp) |
| throughput/25000/insert.random          |            869.79 (92.83) |           845.03 (100.29) |   -2.85% |    +0.22% (12.77 pp) |
| throughput/100/insert.sameIndex         |             637.09 (38.4) |            620.86 (78.99) |   -2.55% |   +10.49% (16.83 pp) |
| throughput/1000/insert.sameIndex        |            610.43 (53.53) |            589.19 (34.01) |   -3.48% |    -7.27% (13.92 pp) |
| throughput/5000/insert.sameIndex        |            633.83 (74.85) |            586.06 (16.09) |   -7.54% |      -6.20% (7.9 pp) |
| throughput/10000/insert.sameIndex       |             551.7 (33.32) |            558.43 (56.06) |   +1.22% |     -1.77% (4.54 pp) |
| throughput/15000/insert.sameIndex       |            514.11 (27.68) |            539.28 (59.59) |   +4.90% |    +5.71% (19.94 pp) |
| throughput/20000/insert.sameIndex       |            632.55 (44.39) |            546.23 (32.53) |  -13.65% |    -12.68% (8.79 pp) |
| throughput/25000/insert.sameIndex       |           542.08 (162.15) |            579.69 (56.08) |   +6.94% |     +4.92% (17.5 pp) |
| throughput/100/insert.tail              |            886.13 (240.6) |            884.03 (54.52) |   -0.24% |    -5.38% (27.83 pp) |
| throughput/1000/insert.tail             |           943.19 (219.11) |           827.43 (201.57) |  -12.27% |     +3.40% (4.45 pp) |
| throughput/5000/insert.tail             |           876.79 (121.66) |            885.07 (48.41) |   +0.94% |     +3.54% (4.94 pp) |
| throughput/10000/insert.tail            |            916.85 (18.84) |           950.22 (123.56) |   +3.64% |    +5.23% (17.08 pp) |
| throughput/15000/insert.tail            |            845.68 (49.14) |            817.25 (89.38) |   -3.36% |     -5.16% (4.95 pp) |
| throughput/20000/insert.tail            |           936.74 (242.16) |             859.36 (41.9) |   -8.26% |    +3.03% (22.23 pp) |
| throughput/25000/insert.tail            |           891.91 (172.63) |           942.42 (176.29) |   +5.66% |    -7.76% (29.44 pp) |
| throughput/100/length                   |             124.06 (11.7) |            120.33 (16.55) |   -3.01% |     -8.45% (26.4 pp) |
| throughput/1000/length                  |            117.11 (11.69) |             111.15 (8.91) |   -5.09% |    +4.00% (10.03 pp) |
| throughput/5000/length                  |             112.38 (4.49) |             117.43 (2.92) |   +4.49% |     +4.49% (6.93 pp) |
| throughput/10000/length                 |            115.29 (10.75) |              114.7 (2.89) |   -0.51% |    -0.51% (11.18 pp) |
| throughput/15000/length                 |             114.49 (6.16) |             110.16 (4.39) |   -3.78% |     +0.45% (6.64 pp) |
| throughput/20000/length                 |            110.07 (16.25) |             112.82 (4.67) |   +2.50% |     +3.85% (8.43 pp) |
| throughput/25000/length                 |             103.6 (14.26) |            105.44 (18.24) |   +1.78% |    +1.78% (32.21 pp) |
| throughput/100/merge.duplicate          |             796.3 (40.25) |             819.23 (86.4) |   +2.88% |    +1.04% (17.54 pp) |
| throughput/1000/merge.duplicate         |            664.82 (40.84) |            652.38 (13.11) |   -1.87% |     -1.87% (3.13 pp) |
| throughput/5000/merge.duplicate         |            663.44 (30.02) |            651.68 (10.77) |   -1.77% |     -1.40% (4.48 pp) |
| throughput/10000/merge.duplicate        |            641.77 (45.02) |            649.27 (41.64) |   +1.17% |     +1.17% (1.75 pp) |
| throughput/15000/merge.duplicate        |            611.97 (17.59) |             584.56 (52.1) |   -4.48% |     -4.48% (5.77 pp) |
| throughput/20000/merge.duplicate        |            623.92 (62.09) |            609.74 (46.32) |   -2.27% |     -3.74% (3.02 pp) |
| throughput/25000/merge.duplicate        |            636.23 (84.69) |            565.82 (68.17) |  -11.07% |     -1.47% (2.41 pp) |
| throughput/100/merge.insert             |          1,817.71 (94.22) |          1,792.13 (41.64) |   -1.41% |    -2.46% (10.93 pp) |
| throughput/1000/merge.insert            |          1,503.04 (89.34) |          1,461.01 (56.86) |   -2.80% |     +4.64% (8.82 pp) |
| throughput/5000/merge.insert            |          1,558.03 (62.87) |          1,570.11 (72.93) |   +0.78% |     -2.54% (2.53 pp) |
| throughput/10000/merge.insert           |          1,546.22 (99.87) |          1,551.84 (59.69) |   +0.36% |      -2.39% (9.4 pp) |
| throughput/15000/merge.insert           |         1,533.11 (188.18) |         1,392.97 (117.48) |   -9.14% |     -5.87% (7.79 pp) |
| throughput/20000/merge.insert           |         1,749.71 (202.04) |            1,455.44 (7.6) |  -16.82% |     -8.08% (9.88 pp) |
| throughput/25000/merge.insert           |         1,334.35 (146.26) |         1,447.27 (197.75) |   +8.46% |    +0.51% (10.19 pp) |
| throughput/100/remove.head              |            811.04 (72.84) |           784.79 (408.48) |   -3.24% |   +12.50% (40.89 pp) |
| throughput/1000/remove.head             |             767.65 (6.72) |           787.27 (189.51) |   +2.56% |     +2.90% (17.9 pp) |
| throughput/5000/remove.head             |             837.5 (31.72) |            829.04 (24.15) |   -1.01% |     -1.28% (3.85 pp) |
| throughput/10000/remove.head            |            877.87 (62.61) |            911.18 (21.68) |   +3.79% |     +4.21% (2.63 pp) |
| throughput/15000/remove.head            |           873.37 (107.91) |            855.03 (32.87) |   -2.10% |     -2.21% (7.92 pp) |
| throughput/20000/remove.head            |            951.08 (128.7) |            973.59 (68.56) |   +2.37% |    +3.73% (14.14 pp) |
| throughput/25000/remove.head            |            950.44 (65.16) |            946.68 (35.18) |   -0.40% |    -0.40% (12.18 pp) |
| throughput/100/remove.middle            |            800.93 (57.03) |            819.11 (64.13) |   +2.27% |    -4.31% (13.61 pp) |
| throughput/1000/remove.middle           |            846.16 (41.54) |            815.53 (29.77) |   -3.62% |     +3.04% (6.67 pp) |
| throughput/5000/remove.middle           |             877.82 (52.2) |            843.12 (30.09) |   -3.95% |    -6.55% (11.77 pp) |
| throughput/10000/remove.middle          |            901.31 (43.33) |             857.81 (9.82) |   -4.83% |     -3.01% (6.82 pp) |
| throughput/15000/remove.middle          |            903.02 (47.94) |             866.35 (6.31) |   -4.06% |      -4.37% (5.5 pp) |
| throughput/20000/remove.middle          |             958.08 (80.3) |            979.96 (105.3) |   +2.28% |     +2.64% (1.23 pp) |
| throughput/25000/remove.middle          |            972.69 (51.66) |          1,029.33 (77.89) |   +5.82% |     +2.09% (4.39 pp) |
| throughput/100/remove.random            |           993.08 (184.89) |          1,102.04 (63.58) |  +10.97% |   +13.85% (26.17 pp) |
| throughput/1000/remove.random           |           1,201.93 (93.6) |         1,218.72 (127.51) |   +1.40% |    +2.65% (19.13 pp) |
| throughput/5000/remove.random           |          1,198.72 (41.23) |         1,221.27 (106.59) |   +1.88% |     +0.46% (4.79 pp) |
| throughput/10000/remove.random          |          1,196.27 (74.97) |          1,200.29 (84.61) |   +0.34% |     +0.90% (14.6 pp) |
| throughput/15000/remove.random          |         1,230.61 (122.73) |          1,207.07 (49.14) |   -1.91% |     -0.42% (5.83 pp) |
| throughput/20000/remove.random          |          1,315.48 (77.66) |          1,306.71 (79.38) |   -0.67% |    -2.73% (21.99 pp) |
| throughput/25000/remove.random          |          1,287.56 (65.64) |          1,301.24 (60.65) |   +1.06% |     +5.61% (2.53 pp) |
| throughput/100/remove.sameIndex         |            916.27 (472.2) |         1,051.29 (143.26) |  +14.74% |   +10.12% (50.83 pp) |
| throughput/1000/remove.sameIndex        |            796.34 (36.63) |            841.91 (34.65) |   +5.72% |     +5.72% (3.99 pp) |
| throughput/5000/remove.sameIndex        |            842.31 (45.11) |            852.17 (57.47) |   +1.17% |     +0.81% (9.38 pp) |
| throughput/10000/remove.sameIndex       |           881.81 (120.92) |            844.64 (42.49) |   -4.22% |    -5.25% (17.89 pp) |
| throughput/15000/remove.sameIndex       |            831.58 (39.41) |            879.99 (42.55) |   +5.82% |     +4.69% (1.29 pp) |
| throughput/20000/remove.sameIndex       |            963.03 (63.53) |           929.02 (148.25) |   -3.53% |      -1.34% (8.6 pp) |
| throughput/25000/remove.sameIndex       |            936.11 (57.79) |          1,002.78 (57.02) |   +7.12% |    +5.67% (10.82 pp) |
| throughput/100/remove.tail              |            802.24 (134.5) |            791.92 (70.93) |   -1.29% |   -11.28% (24.19 pp) |
| throughput/1000/remove.tail             |             732.59 (77.8) |            720.27 (43.51) |   -1.68% |    -5.12% (16.31 pp) |
| throughput/5000/remove.tail             |            734.24 (33.37) |            741.16 (65.34) |   +0.94% |     +1.45% (1.88 pp) |
| throughput/10000/remove.tail            |             801.1 (43.28) |            762.35 (63.88) |   -4.84% |     -2.76% (8.26 pp) |
| throughput/15000/remove.tail            |            767.02 (10.22) |            763.72 (72.29) |   -0.43% |     -0.70% (8.68 pp) |
| throughput/20000/remove.tail            |            817.34 (57.09) |            850.73 (55.68) |   +4.09% |    +4.09% (11.02 pp) |
| throughput/25000/remove.tail            |            914.72 (47.12) |            821.22 (20.87) |  -10.22% |    -10.22% (6.09 pp) |
| throughput/100/replace.head             |         1,039.85 (110.18) |         1,051.56 (209.99) |   +1.13% |    -2.37% (27.12 pp) |
| throughput/1000/replace.head            |          1,170.13 (17.79) |          1,232.23 (31.47) |   +5.31% |     +6.85% (2.82 pp) |
| throughput/5000/replace.head            |           1,126.17 (7.46) |          1,208.03 (42.32) |   +7.27% |     +6.85% (4.15 pp) |
| throughput/10000/replace.head           |          1,215.02 (31.24) |          1,194.62 (52.47) |   -1.68% |     -1.27% (1.65 pp) |
| throughput/15000/replace.head           |           1,100.67 (22.3) |          1,137.88 (71.51) |   +3.38% |    +2.79% (10.35 pp) |
| throughput/20000/replace.head           |          1,245.78 (22.38) |         1,222.77 (125.54) |   -1.85% |      -2.13% (5.4 pp) |
| throughput/25000/replace.head           |          1,231.81 (49.68) |          1,209.18 (52.26) |   -1.84% |     -3.75% (5.14 pp) |
| throughput/100/replace.middle           |         1,063.97 (102.52) |         1,082.17 (195.26) |   +1.71% |    -0.54% (30.49 pp) |
| throughput/1000/replace.middle          |           1,202.34 (62.1) |          1,333.12 (87.98) |  +10.88% |       +10.88% (7 pp) |
| throughput/5000/replace.middle          |          1,204.35 (23.84) |          1,218.34 (41.35) |   +1.16% |     +1.16% (5.45 pp) |
| throughput/10000/replace.middle         |         1,303.43 (171.68) |          1,150.37 (33.66) |  -11.74% |    -11.77% (5.72 pp) |
| throughput/15000/replace.middle         |          1,167.58 (62.49) |           1,183.6 (50.97) |   +1.37% |     +1.37% (5.81 pp) |
| throughput/20000/replace.middle         |           1,224.63 (65.4) |          1,273.07 (73.28) |   +3.96% |    +3.96% (11.44 pp) |
| throughput/25000/replace.middle         |           1,219.63 (9.62) |         1,285.29 (131.73) |   +5.38% |    +4.68% (15.62 pp) |
| throughput/100/replace.random           |          1,590.26 (37.71) |         1,748.94 (120.83) |   +9.98% |     +7.59% (8.42 pp) |
| throughput/1000/replace.random          |          1,744.76 (55.53) |          1,858.68 (15.61) |   +6.53% |     +7.26% (4.43 pp) |
| throughput/5000/replace.random          |          1,718.06 (34.97) |          1,817.92 (90.77) |   +5.81% |    +5.81% (10.64 pp) |
| throughput/10000/replace.random         |         1,957.06 (253.52) |         1,800.23 (101.29) |   -8.01% |      -5.85% (8.6 pp) |
| throughput/15000/replace.random         |         1,846.07 (109.32) |          1,671.69 (49.47) |   -9.45% |     -3.56% (6.33 pp) |
| throughput/20000/replace.random         |         1,875.07 (326.82) |         1,783.51 (103.76) |   -4.88% |    -4.88% (19.79 pp) |
| throughput/25000/replace.random         |          1,839.1 (279.75) |          1,777.43 (20.47) |   -3.35% |    -3.35% (17.34 pp) |
| throughput/100/replace.sameIndex        |          1,075.49 (38.03) |         1,040.46 (167.11) |   -3.26% |    +3.47% (18.02 pp) |
| throughput/1000/replace.sameIndex       |          1,133.08 (34.82) |          1,211.09 (58.13) |   +6.88% |     +7.31% (7.56 pp) |
| throughput/5000/replace.sameIndex       |          1,157.97 (48.93) |           1,160.41 (42.4) |   +0.21% |     +1.26% (6.24 pp) |
| throughput/10000/replace.sameIndex      |         1,245.52 (149.74) |          1,202.77 (51.56) |   -3.43% |    -1.19% (10.94 pp) |
| throughput/15000/replace.sameIndex      |          1,156.48 (38.11) |         1,143.09 (121.11) |   -1.16% |     -4.02% (1.48 pp) |
| throughput/20000/replace.sameIndex      |           1,278.72 (83.6) |          1,347.52 (27.97) |   +5.38% |    +5.38% (17.54 pp) |
| throughput/25000/replace.sameIndex      |         1,327.06 (124.84) |          1,243.04 (73.79) |   -6.33% |     -4.17% (5.56 pp) |
| throughput/100/replace.tail             |          1,048.77 (93.41) |         1,206.97 (183.97) |  +15.08% |   +10.61% (13.94 pp) |
| throughput/1000/replace.tail            |          1,164.91 (63.31) |          1,228.72 (26.81) |   +5.48% |     +6.52% (5.78 pp) |
| throughput/5000/replace.tail            |         1,160.19 (102.69) |          1,163.84 (17.44) |   +0.31% |     -2.24% (8.19 pp) |
| throughput/10000/replace.tail           |          1,221.22 (36.05) |         1,243.09 (106.33) |   +1.79% |     +6.88% (8.16 pp) |
| throughput/15000/replace.tail           |          1,227.42 (39.69) |           1,173.24 (32.8) |   -4.41% |     -3.82% (5.46 pp) |
| throughput/20000/replace.tail           |             1,277 (62.03) |          1,330.52 (102.1) |   +4.19% |     +5.50% (9.45 pp) |
| throughput/25000/replace.tail           |          1,273.37 (45.94) |          1,252.38 (51.01) |   -1.65% |     -2.23% (5.03 pp) |
| throughput/100/retire                   |            220.31 (20.41) |            249.83 (58.62) |  +13.40% |   +13.40% (30.47 pp) |
| throughput/1000/retire                  |             212.75 (8.37) |             220.52 (1.99) |   +3.65% |     +4.17% (3.72 pp) |
| throughput/5000/retire                  |             201.49 (4.16) |             209.16 (8.14) |   +3.81% |     +4.36% (5.58 pp) |
| throughput/10000/retire                 |            205.04 (16.11) |             204.67 (5.81) |   -0.18% |     +0.18% (3.18 pp) |
| throughput/15000/retire                 |              194.03 (3.6) |             198.86 (8.32) |   +2.49% |     +4.88% (3.78 pp) |
| throughput/20000/retire                 |                192 (2.63) |            197.48 (11.74) |   +2.85% |     +5.51% (2.95 pp) |
| throughput/25000/retire                 |               201.35 (22) |             194.9 (11.87) |   -3.20% |    +2.62% (15.47 pp) |
| throughput/100/sequence                 |             293.73 (7.23) |            327.08 (58.13) |  +11.35% |   +12.08% (15.43 pp) |
| throughput/1000/sequence                |             305.67 (5.24) |             309.03 (8.08) |   +1.10% |     +3.16% (4.82 pp) |
| throughput/5000/sequence                |            292.36 (11.09) |            283.91 (10.41) |   -2.89% |     -2.14% (1.25 pp) |
| throughput/10000/sequence               |              266.6 (6.19) |             269.39 (4.16) |   +1.05% |      +1.05% (2.2 pp) |
| throughput/15000/sequence               |             258.76 (2.47) |            281.98 (14.02) |   +8.97% |    +4.07% (10.87 pp) |
| throughput/20000/sequence               |             254.52 (10.1) |             250.35 (2.28) |   -1.64% |     -1.61% (2.32 pp) |
| throughput/25000/sequence               |            260.64 (29.56) |            253.09 (33.74) |   -2.90% |    -2.90% (24.34 pp) |
| throughput/100/value.head               |            179.95 (11.29) |             202.83 (4.11) |  +12.71% |    +17.41% (6.42 pp) |
| throughput/1000/value.head              |             165.77 (7.04) |             165.59 (0.92) |   -0.11% |     +3.09% (2.98 pp) |
| throughput/5000/value.head              |             149.71 (11.3) |             149.72 (1.91) |   +0.01% |     +0.91% (8.62 pp) |
| throughput/10000/value.head             |              145.3 (2.12) |            145.49 (14.26) |   +0.13% |     -3.38% (5.79 pp) |
| throughput/15000/value.head             |             139.72 (8.74) |             133.89 (6.75) |   -4.17% |     -1.69% (8.19 pp) |
| throughput/20000/value.head             |            133.96 (28.04) |             142.58 (6.41) |   +6.43% |    +4.52% (16.16 pp) |
| throughput/25000/value.head             |            152.61 (32.19) |             140.03 (3.61) |   -8.24% |    +7.55% (20.67 pp) |
| throughput/100/value.middle             |            225.53 (49.82) |            257.39 (24.24) |  +14.13% |     +6.47% (6.38 pp) |
| throughput/1000/value.middle            |            243.53 (10.61) |             253.62 (4.66) |   +4.14% |      +5.05% (5.4 pp) |
| throughput/5000/value.middle            |            227.23 (28.26) |             231.74 (3.33) |   +1.98% |     -1.69% (7.45 pp) |
| throughput/10000/value.middle           |            224.42 (31.44) |            219.65 (10.77) |   -2.13% |    -5.20% (10.07 pp) |
| throughput/15000/value.middle           |              225.7 (6.82) |            224.64 (15.11) |   -0.47% |    -0.47% (14.07 pp) |
| throughput/20000/value.middle           |             207.69 (8.04) |            212.54 (26.23) |   +2.34% |    +0.17% (14.55 pp) |
| throughput/25000/value.middle           |            230.27 (18.53) |            228.22 (13.34) |   -0.89% |    +5.93% (24.23 pp) |
| throughput/100/value.random             |            222.94 (61.81) |            232.21 (51.18) |   +4.16% |     -6.09% (6.74 pp) |
| throughput/1000/value.random            |            227.48 (42.14) |              249.4 (41.5) |   +9.64% |   +18.59% (37.27 pp) |
| throughput/5000/value.random            |            269.31 (11.34) |            301.35 (72.02) |  +11.90% |     -2.36% (24.1 pp) |
| throughput/10000/value.random           |            295.72 (13.02) |             270.45 (7.41) |   -8.55% |     -5.53% (4.51 pp) |
| throughput/15000/value.random           |            274.13 (31.58) |             271.54 (6.28) |   -0.94% |     +1.92% (8.71 pp) |
| throughput/20000/value.random           |               339 (24.02) |            294.71 (29.41) |  -13.06% |    -17.85% (14.8 pp) |
| throughput/25000/value.random           |            290.96 (17.63) |              268.8 (9.91) |   -7.62% |     -7.88% (4.32 pp) |
| throughput/100/value.sameIndex          |            176.96 (32.68) |            198.15 (39.48) |  +11.97% |    +2.50% (16.32 pp) |
| throughput/1000/value.sameIndex         |             179.65 (4.45) |             193.96 (6.16) |   +7.97% |    +3.93% (26.91 pp) |
| throughput/5000/value.sameIndex         |             181.15 (21.1) |            170.89 (38.14) |   -5.66% |    -9.68% (13.25 pp) |
| throughput/10000/value.sameIndex        |             175.12 (6.73) |             174.23 (9.82) |   -0.51% |     -1.12% (6.66 pp) |
| throughput/15000/value.sameIndex        |            159.82 (26.08) |             167.66 (6.93) |   +4.91% |    +7.87% (19.93 pp) |
| throughput/20000/value.sameIndex        |             174.3 (26.29) |            170.24 (20.82) |   -2.33% |       +4.30% (22 pp) |
| throughput/25000/value.sameIndex        |            188.76 (20.33) |            165.43 (11.24) |  -12.36% |   -12.36% (18.14 pp) |
| throughput/100/value.tail               |            220.04 (36.01) |            248.73 (93.08) |  +13.04% |    +8.83% (43.26 pp) |
| throughput/1000/value.tail              |             211.33 (8.12) |             227.12 (1.55) |   +7.47% |     +7.47% (3.35 pp) |
| throughput/5000/value.tail              |             201.37 (1.12) |             201.41 (9.87) |   +0.02% |     -0.22% (9.04 pp) |
| throughput/10000/value.tail             |            193.58 (20.95) |            195.46 (37.97) |   +0.97% |    +3.39% (17.62 pp) |
| throughput/15000/value.tail             |            183.18 (19.79) |            187.64 (12.21) |   +2.43% |     +2.43% (6.12 pp) |
| throughput/20000/value.tail             |            187.98 (19.24) |              199.15 (8.1) |   +5.94% |      +4.49% (2.5 pp) |
| throughput/25000/value.tail             |            190.29 (33.61) |             190.03 (9.44) |   -0.14% |    -0.14% (28.48 pp) |
| throughput/100/values                   |          4,783.34 (177.4) |         4,838.18 (293.68) |   +1.15% |     -0.98% (7.33 pp) |
| throughput/1000/values                  |      165,051.7 (1,605.13) |    163,582.66 (15,926.11) |   -0.89% |     -0.89% (7.81 pp) |
| throughput/5000/values                  |   586,579.69 (140,932.81) |     551,140.1 (63,954.69) |   -6.04% |   -10.62% (16.34 pp) |
| throughput/10000/values                 | 1,247,940.63 (110,535.16) |      1,147,585.94 (8,600) |   -8.04% |    -3.21% (11.99 pp) |
| throughput/15000/values                 |  1,732,889.06 (25,773.44) |  1,729,032.81 (87,507.81) |   -0.22% |     -1.58% (8.45 pp) |
| throughput/20000/values                 | 2,834,123.44 (469,407.81) | 2,577,776.56 (530,056.25) |   -9.05% |    -9.05% (39.39 pp) |
| throughput/25000/values                 | 3,293,846.88 (173,168.75) | 3,427,768.75 (451,359.38) |   +4.07% |    +2.57% (13.24 pp) |
| throughput/100/values.head              |             329.57 (5.82) |            315.38 (27.65) |   -4.31% |    +1.63% (13.61 pp) |
| throughput/1000/values.head             |              271.82 (4.4) |           277.83 (127.28) |   +2.21% |       +6.59% (52 pp) |
| throughput/5000/values.head             |            292.53 (33.04) |           302.08 (114.96) |   +3.26% |    +2.40% (32.21 pp) |
| throughput/10000/values.head            |            298.88 (72.81) |            275.27 (42.72) |   -7.90% |    -7.90% (41.99 pp) |
| throughput/15000/values.head            |            271.05 (19.81) |             261.67 (4.98) |   -3.46% |     -3.27% (7.17 pp) |
| throughput/20000/values.head            |            286.21 (18.04) |               261.55 (29) |   -8.62% |     -8.92% (6.68 pp) |
| throughput/25000/values.head            |            258.41 (45.75) |             255.3 (14.01) |   -1.20% |    -3.73% (19.94 pp) |
| throughput/100/values.middle            |            292.85 (25.98) |            308.98 (45.03) |   +5.51% |     +6.10% (6.15 pp) |
| throughput/1000/values.middle           |             265.69 (4.19) |            266.97 (15.72) |   +0.48% |     +0.81% (5.02 pp) |
| throughput/5000/values.middle           |            272.32 (32.28) |            277.11 (45.82) |   +1.76% |    +2.93% (10.92 pp) |
| throughput/10000/values.middle          |            303.83 (65.32) |            274.96 (10.64) |   -9.50% |    -8.41% (17.79 pp) |
| throughput/15000/values.middle          |             238.01 (7.92) |             233.46 (1.38) |   -1.91% |        -1.57% (1 pp) |
| throughput/20000/values.middle          |            287.65 (10.28) |            289.88 (64.98) |   +0.78% |    -1.27% (15.44 pp) |
| throughput/25000/values.middle          |             241.98 (23.4) |            231.22 (34.12) |   -4.45% |    -7.34% (22.58 pp) |
| throughput/100/values.random            |            299.66 (18.35) |             305.37 (6.49) |   +1.91% |     +0.10% (6.73 pp) |
| throughput/1000/values.random           |            294.07 (13.97) |            305.37 (16.76) |   +3.84% |     +1.55% (5.19 pp) |
| throughput/5000/values.random           |             339.1 (24.59) |            332.17 (12.79) |   -2.04% |     -3.06% (6.15 pp) |
| throughput/10000/values.random          |             347.71 (23.3) |            396.47 (10.68) |  +14.02% |    +5.71% (25.98 pp) |
| throughput/15000/values.random          |            358.45 (63.79) |            392.15 (39.13) |   +9.40% |    -2.99% (17.43 pp) |
| throughput/20000/values.random          |             407.4 (13.65) |            413.81 (22.72) |   +1.57% |      +3.33% (3.7 pp) |
| throughput/25000/values.random          |            399.54 (91.32) |            369.25 (13.79) |   -7.58% |    -4.69% (22.55 pp) |
| throughput/100/values.sameIndex         |            287.74 (31.64) |            299.21 (29.88) |   +3.99% |     +1.74% (9.52 pp) |
| throughput/1000/values.sameIndex        |             279.35 (22.2) |            267.55 (39.66) |   -4.22% |    +1.59% (14.14 pp) |
| throughput/5000/values.sameIndex        |            266.03 (17.24) |            291.21 (45.98) |   +9.47% |    +9.47% (16.66 pp) |
| throughput/10000/values.sameIndex       |            299.39 (55.33) |             283.41 (38.6) |   -5.34% |    -5.34% (30.28 pp) |
| throughput/15000/values.sameIndex       |            239.08 (14.09) |             236.11 (6.19) |   -1.24% |        -5.76% (8 pp) |
| throughput/20000/values.sameIndex       |               271.03 (26) |            274.56 (14.17) |   +1.30% |    +2.25% (16.21 pp) |
| throughput/25000/values.sameIndex       |           266.22 (194.17) |            234.11 (13.37) |  -12.06% |    -8.40% (40.22 pp) |
| throughput/100/values.tail              |             294.85 (22.3) |            296.03 (28.91) |   +0.40% |     -1.15% (4.95 pp) |
| throughput/1000/values.tail             |             267.92 (3.29) |            267.29 (27.07) |   -0.24% |    -0.70% (38.27 pp) |
| throughput/5000/values.tail             |            260.05 (35.22) |             260.23 (26.3) |   +0.07% |     +0.00% (17.1 pp) |
| throughput/10000/values.tail            |            264.81 (28.87) |            281.99 (41.21) |   +6.49% |     +0.02% (7.64 pp) |
| throughput/15000/values.tail            |            239.99 (13.32) |            233.17 (31.23) |   -2.84% |    +4.71% (17.25 pp) |
| throughput/20000/values.tail            |            245.69 (24.45) |            256.03 (26.54) |   +4.21% |     +1.64% (8.08 pp) |
| throughput/25000/values.tail            |            240.47 (94.86) |            265.23 (86.46) |  +10.30% |    +9.81% (22.44 pp) |
| lifecycle/scaleUp/apply.random          |         3,860.83 (259.01) |          3,860.44 (123.6) |   -0.01% |    -0.01% (10.32 pp) |
| lifecycle/scaleUp/insert.head           |            850.55 (88.06) |            842.38 (35.97) |   -0.96% |     -2.18% (0.99 pp) |
| lifecycle/scaleUp/insert.random         |         1,968.43 (271.14) |         1,772.06 (415.87) |   -9.98% |     +3.61% (26.6 pp) |
| lifecycle/scaleUp/insert.tail           |           818.86 (126.92) |            787.39 (60.36) |   -3.84% |     -0.11% (7.27 pp) |
| lifecycle/scaleUp/remove.random         |          2,838.1 (110.89) |         2,880.78 (226.15) |   +1.50% |     +1.50% (4.78 pp) |
| lifecycle/scaleUp/replace.head          |          2,782.72 (457.9) |         2,462.21 (172.89) |  -11.52% |    -3.16% (10.65 pp) |
| lifecycle/scaleUp/replace.random        |          3,521.13 (131.6) |           3,429.67 (68.5) |   -2.60% |     +0.20% (4.15 pp) |
| lifecycle/scaleUp/replace.tail          |          2,395.12 (80.88) |          2,401.32 (123.3) |   +0.26% |    -5.58% (15.52 pp) |
| lifecycle/scaleUp/value.head            |            316.93 (22.47) |            316.55 (26.66) |   -0.12% |    -0.12% (20.09 pp) |
| lifecycle/scaleUp/value.random          |          1,140.18 (23.11) |          1,122.53 (28.71) |   -1.55% |     -1.59% (5.85 pp) |
| lifecycle/scaleUp/value.tail            |             158.77 (4.44) |             151.14 (1.68) |   -4.80% |     -1.61% (4.43 pp) |
| lifecycle/scaleDown/apply.random        |            3,433.75 (109) |         3,646.62 (216.66) |   +6.20% |     +6.20% (9.67 pp) |
| lifecycle/scaleDown/insert.random       |          1,712.56 (19.54) |          1,849.6 (204.31) |   +8.00% |    +4.76% (11.33 pp) |
| lifecycle/scaleDown/remove.head         |         1,934.48 (156.32) |         2,080.83 (259.89) |   +7.57% |    -4.81% (21.44 pp) |
| lifecycle/scaleDown/remove.random       |          2,662.63 (69.96) |         2,855.14 (424.99) |   +7.23% |    +3.53% (10.26 pp) |
| lifecycle/scaleDown/remove.tail         |           1,692.37 (20.7) |         1,722.24 (190.26) |   +1.77% |     +1.26% (11.9 pp) |
| lifecycle/scaleDown/replace.head        |         2,531.14 (123.08) |         2,824.62 (271.34) |  +11.59% |   +11.27% (16.58 pp) |
| lifecycle/scaleDown/replace.random      |           3,227.62 (94.2) |         3,595.96 (394.96) |  +11.41% |   +11.41% (15.11 pp) |
| lifecycle/scaleDown/replace.tail        |         19,503.1 (344.95) |         19,634 (2,648.45) |   +0.67% |      +4.31% (8.1 pp) |
| lifecycle/scaleDown/value.head          |            418.92 (14.12) |            429.35 (41.18) |   +2.49% |     +3.92% (6.56 pp) |
| lifecycle/scaleDown/value.random        |          1,087.66 (12.82) |          1,081.97 (95.19) |   -0.52% |     -0.15% (6.83 pp) |
| lifecycle/scaleDown/value.tail          |              236.45 (5.9) |            239.25 (12.51) |   +1.19% |     +2.09% (4.74 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,624.46 (196.01) |           3,772.4 (81.49) |   +4.08% |     +0.61% (4.45 pp) |
| lifecycle/fullLifecycle/insert.head     |            850.55 (88.06) |            842.38 (35.97) |   -0.96% |     -2.18% (0.99 pp) |
| lifecycle/fullLifecycle/insert.random   |           1,840.5 (90.82) |         1,859.66 (163.95) |   +1.04% |    +5.49% (16.29 pp) |
| lifecycle/fullLifecycle/insert.tail     |           818.86 (126.92) |            787.39 (60.36) |   -3.84% |     -0.11% (7.27 pp) |
| lifecycle/fullLifecycle/remove.head     |         1,934.48 (156.32) |         2,080.83 (259.89) |   +7.57% |    -4.81% (21.44 pp) |
| lifecycle/fullLifecycle/remove.random   |          2,768.45 (30.42) |         2,951.81 (447.27) |   +6.62% |     +4.37% (7.63 pp) |
| lifecycle/fullLifecycle/remove.tail     |           1,692.37 (20.7) |         1,722.24 (190.26) |   +1.77% |     +1.26% (11.9 pp) |
| lifecycle/fullLifecycle/replace.head    |          2,627.9 (313.47) |         2,565.93 (236.84) |   -2.36% |     +4.29% (1.36 pp) |
| lifecycle/fullLifecycle/replace.random  |          3,373.44 (33.51) |         3,534.26 (210.29) |   +4.77% |     +4.51% (6.64 pp) |
| lifecycle/fullLifecycle/replace.tail    |         10,949.11 (73.63) |       10,959.7 (1,327.92) |   +0.10% |     +3.18% (9.98 pp) |
| lifecycle/fullLifecycle/value.head      |            372.11 (16.36) |             376.48 (8.69) |   +1.18% |     +3.76% (4.73 pp) |
| lifecycle/fullLifecycle/value.random    |          1,107.83 (15.74) |          1,116.35 (47.34) |   +0.77% |     +0.22% (4.07 pp) |
| lifecycle/fullLifecycle/value.tail      |             195.88 (4.76) |              195.2 (7.13) |   -0.35% |     -0.08% (1.52 pp) |
| checkpoint/up/1000/create               |          381,400 (14,000) |          366,300 (14,000) |   -3.96% |     -2.33% (9.34 pp) |
| checkpoint/up/1000/sequence             |        2,479,100 (59,100) |        2,525,900 (22,600) |   +1.89% |     +2.51% (3.68 pp) |
| checkpoint/up/1000/values               |        1,760,200 (65,200) |        1,809,400 (26,800) |   +2.80% |     +2.67% (4.48 pp) |
| checkpoint/up/5000/create               |          886,600 (74,600) |          890,100 (15,900) |   +0.39% |     +0.39% (6.21 pp) |
| checkpoint/up/5000/sequence             |       8,208,400 (426,100) |       8,288,200 (776,700) |   +0.97% |     +1.61% (9.31 pp) |
| checkpoint/up/5000/values               |       4,469,300 (150,700) |        4,549,400 (71,000) |   +1.79% |     +0.75% (2.88 pp) |
| checkpoint/up/10000/create              |        1,578,800 (87,000) |        1,537,400 (12,800) |   -2.62% |     -5.50% (9.67 pp) |
| checkpoint/up/10000/sequence            |    13,535,700 (1,024,300) |    12,714,100 (1,180,700) |   -6.07% |     +0.99% (2.07 pp) |
| checkpoint/up/10000/values              |      20,621,500 (684,500) |      20,212,500 (246,500) |   -1.98% |      -2.42% (3.6 pp) |
| checkpoint/up/15000/create              |        2,411,900 (20,800) |        2,462,100 (43,100) |   +2.08% |     +3.29% (4.02 pp) |
| checkpoint/up/15000/sequence            |      15,127,100 (317,100) |    16,415,900 (2,788,600) |   +8.52% |   +11.86% (17.93 pp) |
| checkpoint/up/15000/values              |      30,599,400 (537,300) |      30,580,100 (584,500) |   -0.06% |     -0.06% (4.58 pp) |
| checkpoint/up/20000/create              |       3,522,100 (172,900) |       3,429,300 (153,100) |   -2.63% |     -2.63% (7.77 pp) |
| checkpoint/up/20000/sequence            |    21,224,100 (1,658,100) |      21,874,200 (831,500) |   +3.06% |    +4.09% (11.19 pp) |
| checkpoint/up/20000/values              |    10,872,800 (1,624,000) |      10,918,100 (697,600) |   +0.42% |    -5.30% (19.79 pp) |
| checkpoint/up/25000/create              |       4,585,300 (772,600) |        3,991,900 (51,900) |  -12.94% |    -7.41% (11.41 pp) |
| checkpoint/up/25000/sequence            |    24,932,100 (7,524,900) |      24,705,400 (364,900) |   -0.91% |    -2.20% (13.06 pp) |
| checkpoint/up/25000/values              |    12,220,400 (2,921,600) |      11,900,000 (583,300) |   -2.62% |    -6.19% (16.43 pp) |
| checkpoint/down/20000/create            |        3,558,100 (69,500) |        3,384,400 (88,200) |   -4.88% |     -4.57% (8.36 pp) |
| checkpoint/down/20000/sequence          |    18,890,800 (1,290,300) |    18,837,000 (4,562,400) |   -0.28% |    +0.06% (32.17 pp) |
| checkpoint/down/20000/values            |      10,318,600 (916,000) |       9,376,800 (678,000) |   -9.13% |   -12.39% (10.92 pp) |
| checkpoint/down/15000/create            |        2,386,700 (31,900) |        2,433,100 (78,500) |   +1.94% |     +0.46% (1.16 pp) |
| checkpoint/down/15000/sequence          |      15,608,500 (600,200) |      15,442,500 (394,200) |   -1.06% |     -1.44% (4.19 pp) |
| checkpoint/down/15000/values            |       7,764,900 (502,200) |       7,664,700 (324,800) |   -1.29% |     +1.20% (5.69 pp) |
| checkpoint/down/10000/create            |        1,711,100 (51,000) |        1,650,200 (52,900) |   -3.56% |     -4.33% (4.21 pp) |
| checkpoint/down/10000/sequence          |      13,621,300 (705,000) |    13,283,000 (1,281,400) |   -2.48% |     -0.08% (6.65 pp) |
| checkpoint/down/10000/values            |       5,264,600 (312,700) |     5,531,500 (1,088,100) |   +5.07% |    -0.72% (23.05 pp) |
| checkpoint/down/5000/create             |          791,800 (12,200) |          787,900 (11,500) |   -0.49% |        -0.75% (1 pp) |
| checkpoint/down/5000/sequence           |      10,041,400 (942,100) |      10,092,700 (685,500) |   +0.51% |    +1.57% (19.62 pp) |
| checkpoint/down/5000/values             |       2,543,700 (391,500) |       3,027,000 (595,600) |  +19.00% |    -0.95% (38.84 pp) |
| checkpoint/down/1000/create             |          155,400 (82,200) |          149,800 (11,000) |   -3.60% |    -3.13% (29.95 pp) |
| checkpoint/down/1000/sequence           |     5,978,000 (2,417,300) |       6,235,300 (626,600) |   +4.30% |    -2.78% (36.27 pp) |
| checkpoint/down/1000/values             |         529,600 (113,200) |          571,300 (20,000) |   +7.87% |    +7.87% (28.61 pp) |
| checkpoint/down/0/create                |            17,500 (4,700) |            14,100 (2,000) |  -19.43% |   -11.43% (29.53 pp) |
| checkpoint/down/0/sequence              |       1,336,100 (450,500) |       1,432,800 (200,800) |   +7.24% |    -5.37% (33.47 pp) |
| checkpoint/down/0/values                |            11,100 (1,400) |              11,200 (800) |   +0.90% |    +5.00% (30.16 pp) |
| tuple/projection/2/create.empty         |             358.35 (5.89) |             361.37 (7.95) |   +0.84% |     -0.18% (3.26 pp) |
| tuple/tuple/2/create.empty              |            437.53 (16.37) |            422.27 (13.82) |   -3.49% |     -1.52% (2.88 pp) |
| tuple/projection/2/create.sequence      |         1,259.27 (325.96) |         1,285.31 (107.46) |   +2.07% |    -7.88% (19.44 pp) |
| tuple/tuple/2/create.sequence           |         1,471.01 (106.56) |          1,454.17 (77.67) |   -1.15% |    -5.55% (15.64 pp) |
| tuple/projection/2/replace.random       |         1,079.94 (131.85) |         1,046.43 (239.88) |   -3.10% |    +2.40% (16.07 pp) |
| tuple/tuple/2/replace.random            |            699.91 (25.79) |            694.85 (30.62) |   -0.72% |     +0.85% (2.65 pp) |
| tuple/projection/2/apply.replace        |         1,765.44 (166.52) |         1,986.61 (339.97) |  +12.53% |   +15.37% (33.01 pp) |
| tuple/tuple/2/apply.replace             |           1,233.47 (7.17) |          1,270.17 (85.37) |   +2.98% |     +2.98% (14.5 pp) |
| tuple/projection/2/apply.duplicate      |            606.51 (16.11) |            708.29 (51.83) |  +16.78% |   +18.12% (15.42 pp) |
| tuple/tuple/2/apply.duplicate           |            626.04 (14.18) |             660.3 (64.27) |   +5.47% |     +1.25% (15.6 pp) |
| tuple/projection/2/merge.duplicate      |            658.04 (24.63) |            724.32 (42.52) |  +10.07% |      +4.36% (9.3 pp) |
| tuple/tuple/2/merge.duplicate           |                637.2 (25) |            708.89 (92.52) |  +11.25% |     +6.62% (2.47 pp) |
| tuple/projection/2/length               |               7.74 (0.67) |               7.55 (0.11) |   -2.47% |    -2.47% (12.01 pp) |
| tuple/tuple/2/length                    |               7.25 (0.15) |               7.42 (0.19) |   +2.35% |     +1.55% (2.51 pp) |
| tuple/projection/2/value.random         |              32.29 (7.03) |              29.85 (0.33) |   -7.55% |    -7.55% (14.45 pp) |
| tuple/tuple/2/value.random              |              19.69 (0.97) |              18.38 (0.22) |   -6.64% |     -6.64% (2.48 pp) |
| tuple/projection/2/values               |              84.25 (1.76) |              82.34 (7.08) |   -2.27% |   -10.29% (11.06 pp) |
| tuple/tuple/2/values                    |            122.39 (89.67) |               81.8 (1.05) |  -33.16% |   -35.32% (43.56 pp) |
| tuple/projection/2/sequence             |            548.83 (81.57) |            481.68 (43.89) |  -12.23% |    -18.50% (9.88 pp) |
| tuple/tuple/2/sequence                  |            562.82 (54.12) |            505.11 (58.52) |  -10.25% |    -4.85% (10.65 pp) |
| tuple/projection/4/create.empty         |            470.87 (14.62) |             421.49 (7.49) |  -10.49% |     -10.49% (1.7 pp) |
| tuple/tuple/4/create.empty              |            470.34 (15.63) |            438.28 (21.05) |   -6.82% |     -7.69% (3.87 pp) |
| tuple/projection/4/create.sequence      |           1,628.94 (34.4) |          1,678.29 (62.62) |   +3.03% |     -0.29% (2.71 pp) |
| tuple/tuple/4/create.sequence           |         1,639.75 (268.84) |          1,571.29 (25.89) |   -4.18% |    -2.83% (11.69 pp) |
| tuple/projection/4/replace.random       |          1,165.57 (69.77) |         1,141.97 (105.54) |   -2.03% |     -3.95% (8.46 pp) |
| tuple/tuple/4/replace.random            |            658.71 (63.61) |             647.13 (6.57) |   -1.76% |     -4.96% (8.73 pp) |
| tuple/projection/4/apply.replace        |          1,681.38 (81.08) |           1,756.82 (31.2) |   +4.49% |     +2.56% (5.36 pp) |
| tuple/tuple/4/apply.replace             |          1,071.11 (19.29) |           1,121.3 (38.17) |   +4.69% |      +4.69% (5.4 pp) |
| tuple/projection/4/apply.duplicate      |            594.05 (19.58) |            607.87 (22.98) |   +2.33% |     +4.34% (5.81 pp) |
| tuple/tuple/4/apply.duplicate           |            612.41 (26.58) |            612.73 (39.22) |   +0.05% |     +2.48% (7.79 pp) |
| tuple/projection/4/merge.duplicate      |             759.67 (92.9) |            786.04 (46.25) |   +3.47% |     +2.96% (5.55 pp) |
| tuple/tuple/4/merge.duplicate           |           787.78 (118.56) |            854.82 (77.19) |   +8.51% |     +3.39% (6.94 pp) |
| tuple/projection/4/length               |               7.28 (0.26) |              27.19 (1.52) | +273.28% | +263.47% (257.44 pp) |
| tuple/tuple/4/length                    |                7.3 (0.34) |              27.28 (1.39) | +273.74% | +259.75% (264.05 pp) |
| tuple/projection/4/value.random         |              39.09 (2.83) |              41.04 (2.56) |   +4.99% |     +8.01% (7.28 pp) |
| tuple/tuple/4/value.random              |              18.42 (0.11) |              18.59 (2.23) |   +0.90% |    -3.16% (20.66 pp) |
| tuple/projection/4/values               |             150.9 (26.77) |             147.9 (10.35) |   -1.99% |    +0.77% (22.33 pp) |
| tuple/tuple/4/values                    |            110.18 (90.77) |             153.83 (9.36) |  +39.62% |   +39.62% (59.81 pp) |
| tuple/projection/4/sequence             |           465.64 (272.97) |            470.23 (11.35) |   +0.99% |    +0.99% (42.73 pp) |
| tuple/tuple/4/sequence                  |            624.12 (74.11) |             553.95 (6.68) |  -11.24% |   -11.13% (10.81 pp) |
| tuple/projection/8/create.empty         |            416.68 (41.58) |            440.39 (29.49) |   +5.69% |    -0.21% (17.44 pp) |
| tuple/tuple/8/create.empty              |            462.01 (34.47) |             468.33 (65.7) |   +1.37% |     -2.71% (3.65 pp) |
| tuple/projection/8/create.sequence      |          2,254.92 (28.98) |          2,353.34 (227.3) |   +4.36% |     -2.24% (7.07 pp) |
| tuple/tuple/8/create.sequence           |          2,049.38 (45.14) |         2,087.54 (128.74) |   +1.86% |    -1.26% (16.22 pp) |
| tuple/projection/8/replace.random       |          1,244.86 (153.2) |         1,199.06 (101.07) |   -3.68% |    +5.18% (17.35 pp) |
| tuple/tuple/8/replace.random            |            646.27 (92.08) |             659.16 (9.19) |   +2.00% |    +2.00% (18.18 pp) |
| tuple/projection/8/apply.replace        |          1,757.92 (41.09) |         1,787.83 (211.83) |   +1.70% |    +6.24% (14.53 pp) |
| tuple/tuple/8/apply.replace             |          1,039.99 (87.51) |         1,022.78 (104.26) |   -1.65% |    +3.91% (18.71 pp) |
| tuple/projection/8/apply.duplicate      |            606.29 (70.48) |            652.36 (42.25) |   +7.60% |     +7.60% (8.08 pp) |
| tuple/tuple/8/apply.duplicate           |            610.81 (18.73) |            610.72 (46.86) |   -0.02% |      +0.40% (8.6 pp) |
| tuple/projection/8/merge.duplicate      |           1,094.3 (51.98) |         1,173.86 (162.42) |   +7.27% |    +4.36% (13.08 pp) |
| tuple/tuple/8/merge.duplicate           |         1,154.25 (129.23) |         1,206.55 (131.47) |   +4.53% |      +2.57% (2.3 pp) |
| tuple/projection/8/length               |              9.18 (18.94) |              27.41 (4.17) | +198.64% |  +11.95% (230.33 pp) |
| tuple/tuple/8/length                    |               8.18 (18.1) |              30.58 (55.1) | +273.71% |  +191.81% (208.5 pp) |
| tuple/projection/8/value.random         |              47.21 (7.61) |              56.41 (9.41) |  +19.49% |   +11.97% (17.08 pp) |
| tuple/tuple/8/value.random              |              17.98 (4.96) |              18.85 (2.18) |   +4.84% |    +2.29% (12.45 pp) |
| tuple/projection/8/values               |            200.54 (37.59) |            225.41 (39.88) |  +12.40% |   +12.62% (26.26 pp) |
| tuple/tuple/8/values                    |            183.87 (30.61) |            217.01 (26.12) |  +18.02% |    +4.09% (37.82 pp) |
| tuple/projection/8/sequence             |             651.39 (50.8) |             664.3 (51.07) |   +1.98% |    +1.66% (19.75 pp) |
| tuple/tuple/8/sequence                  |            692.43 (84.68) |            694.28 (35.99) |   +0.27% |     +0.27% (8.54 pp) |
| tuple/projection/100/create.empty       |            437.07 (12.71) |            478.23 (23.65) |   +9.42% |    +11.27% (2.46 pp) |
| tuple/tuple/100/create.empty            |              467.8 (9.23) |            483.81 (48.71) |   +3.42% |    +2.22% (12.02 pp) |
| tuple/projection/100/create.sequence    |        14,197.41 (397.32) |         14,222.32 (176.7) |   +0.18% |     +1.01% (2.07 pp) |
| tuple/tuple/100/create.sequence         |         12,341.19 (510.9) |        11,612.28 (229.36) |   -5.91% |      -2.98% (5.8 pp) |
| tuple/projection/100/replace.random     |          1,210.2 (110.41) |       1,586.58 (1,832.67) |  +31.10% |    +8.76% (27.95 pp) |
| tuple/tuple/100/replace.random          |               658.61 (29) |           666.03 (228.64) |   +1.13% |    -0.97% (10.79 pp) |
| tuple/projection/100/apply.replace      |          1,759.46 (17.33) |          1,863.19 (94.58) |   +5.90% |    +1.11% (10.54 pp) |
| tuple/tuple/100/apply.replace           |            986.59 (26.51) |          1,024.76 (52.16) |   +3.87% |    +1.19% (11.34 pp) |
| tuple/projection/100/apply.duplicate    |            624.11 (53.85) |            620.4 (144.31) |   -0.59% |    +4.50% (12.65 pp) |
| tuple/tuple/100/apply.duplicate         |            585.49 (18.11) |            649.52 (93.45) |  +10.94% |   +10.94% (13.23 pp) |
| tuple/projection/100/merge.duplicate    |          8,838.31 (45.36) |         9,463.81 (353.23) |   +7.08% |     +4.84% (5.03 pp) |
| tuple/tuple/100/merge.duplicate         |       12,761.6 (1,737.18) |        13,616.89 (346.46) |   +6.70% |      +6.65% (4.8 pp) |
| tuple/projection/100/length             |              8.77 (19.32) |               27.6 (1.55) | +214.70% |   -0.78% (264.79 pp) |
| tuple/tuple/100/length                  |             10.93 (18.98) |              26.27 (0.53) | +140.26% |   -2.21% (146.27 pp) |
| tuple/projection/100/value.random       |             78.53 (13.39) |              80.78 (3.02) |   +2.86% |     -0.87% (8.58 pp) |
| tuple/tuple/100/value.random            |              17.43 (2.84) |              18.58 (0.43) |   +6.55% |    +6.57% (20.74 pp) |
| tuple/projection/100/values             |          1,884.43 (30.03) |          1,825.96 (88.11) |   -3.10% |     -3.10% (6.22 pp) |
| tuple/tuple/100/values                  |           1,594.5 (13.03) |          1,500.45 (69.28) |   -5.90% |     -5.90% (3.57 pp) |
| tuple/projection/100/sequence           |         6,225.04 (182.46) |         6,294.11 (115.72) |   +1.11% |     +1.11% (1.12 pp) |
| tuple/tuple/100/sequence                |          5,635.08 (95.88) |         5,541.28 (340.97) |   -1.66% |     +0.53% (6.03 pp) |

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
