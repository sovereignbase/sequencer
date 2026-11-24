# Direct Splice and early byte ACKs: complete guard

5 complete matched runs per build. Before: baseline; candidate: ack-final. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 69 timing medians improve over 5%; 50 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 0%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            788.03 (68.15) |             778.9 (79.55) |  -1.16% |    +4.35% (7.66 pp) |
| throughput/1000/apply.duplicate         |            801.05 (28.24) |            763.46 (68.03) |  -4.69% |    +2.31% (5.27 pp) |
| throughput/5000/apply.duplicate         |            379.51 (10.08) |             386.75 (5.72) |  +1.91% |    +2.65% (3.48 pp) |
| throughput/10000/apply.duplicate        |            352.65 (15.43) |             344.26 (9.77) |  -2.38% |    -2.41% (1.48 pp) |
| throughput/15000/apply.duplicate        |             344.92 (14.9) |             319.34 (6.24) |  -7.42% |    -9.13% (3.48 pp) |
| throughput/20000/apply.duplicate        |             316.01 (7.12) |             314.29 (8.45) |  -0.54% |    -2.82% (5.05 pp) |
| throughput/25000/apply.duplicate        |            327.22 (14.69) |            315.77 (15.71) |  -3.50% |    -3.14% (2.19 pp) |
| throughput/100/apply.duplicateRemove    |         1,546.21 (177.87) |         1,509.02 (178.51) |  -2.41% |   -2.25% (12.57 pp) |
| throughput/1000/apply.duplicateRemove   |             833.1 (11.39) |            792.58 (33.74) |  -4.86% |    -3.43% (4.13 pp) |
| throughput/5000/apply.duplicateRemove   |            780.38 (10.93) |            761.3 (100.24) |  -2.44% |    -2.84% (12.7 pp) |
| throughput/10000/apply.duplicateRemove  |            711.07 (26.17) |            703.04 (20.18) |  -1.13% |     -1.89% (2.7 pp) |
| throughput/15000/apply.duplicateRemove  |            694.3 (100.45) |            700.17 (41.15) |  +0.85% |   +0.85% (20.95 pp) |
| throughput/20000/apply.duplicateRemove  |            655.97 (14.13) |            647.47 (47.24) |  -1.30% |    -1.30% (6.65 pp) |
| throughput/25000/apply.duplicateRemove  |             657.04 (29.2) |            673.04 (19.47) |  +2.44% |    +2.44% (4.83 pp) |
| throughput/100/apply.duplicateReplace   |          1,136.2 (250.87) |         1,035.96 (138.27) |  -8.82% |    +3.00% (27.5 pp) |
| throughput/1000/apply.duplicateReplace  |          1,056.48 (48.95) |          1,055.02 (66.53) |  -0.14% |    +2.88% (7.67 pp) |
| throughput/5000/apply.duplicateReplace  |            975.65 (39.47) |            967.57 (55.47) |  -0.83% |    -2.33% (9.57 pp) |
| throughput/10000/apply.duplicateReplace |            909.27 (64.88) |            870.98 (19.68) |  -4.21% |    -6.04% (8.09 pp) |
| throughput/15000/apply.duplicateReplace |           863.93 (110.74) |            867.12 (57.32) |  +0.37% |   -1.24% (13.41 pp) |
| throughput/20000/apply.duplicateReplace |           840.43 (208.51) |            818.79 (28.04) |  -2.57% |    -4.65% (20.8 pp) |
| throughput/25000/apply.duplicateReplace |            837.95 (38.93) |             838.3 (43.19) |  +0.04% |    +3.71% (4.74 pp) |
| throughput/100/apply.insert             |         1,665.66 (150.54) |         1,776.07 (209.28) |  +6.63% |    +1.89% (5.37 pp) |
| throughput/1000/apply.insert            |         1,389.23 (103.61) |         1,381.99 (158.56) |  -0.52% |    -1.39% (6.53 pp) |
| throughput/5000/apply.insert            |          1,302.87 (17.36) |           1,385.26 (84.7) |  +6.32% |   +6.29% (10.62 pp) |
| throughput/10000/apply.insert           |          1,333.56 (97.66) |         1,322.34 (185.36) |  -0.84% |    -1.04% (4.58 pp) |
| throughput/15000/apply.insert           |          1,387.03 (40.46) |          1,324.99 (76.75) |  -4.47% |   -1.23% (14.16 pp) |
| throughput/20000/apply.insert           |          1,176.22 (153.1) |          1,174.43 (63.79) |  -0.15% |  -10.81% (13.83 pp) |
| throughput/25000/apply.insert           |          1,295.93 (19.52) |         1,219.37 (102.96) |  -5.91% |   -5.91% (14.21 pp) |
| throughput/100/apply.remove             |          1,883.75 (77.27) |         1,992.39 (172.95) |  +5.77% |    +4.79% (6.97 pp) |
| throughput/1000/apply.remove            |          1,546.49 (44.48) |           1,466.57 (32.9) |  -5.17% |    -5.62% (3.98 pp) |
| throughput/5000/apply.remove            |         1,597.07 (100.16) |         1,522.63 (117.93) |  -4.66% |     -0.15% (7.5 pp) |
| throughput/10000/apply.remove           |          1,475.49 (25.25) |          1,513.11 (28.25) |  +2.55% |     +0.82% (3.7 pp) |
| throughput/15000/apply.remove           |          1,608.64 (55.76) |         1,553.63 (122.43) |  -3.42% |    -7.97% (4.94 pp) |
| throughput/20000/apply.remove           |          1,587.7 (230.61) |         1,465.85 (117.85) |  -7.67% |    -7.75% (10.8 pp) |
| throughput/25000/apply.remove           |         1,666.35 (158.28) |            1,545.34 (9.2) |  -7.26% |   -7.37% (16.75 pp) |
| throughput/100/apply.replace            |         2,695.93 (365.17) |         2,704.46 (150.21) |  +0.32% |    +3.60% (4.05 pp) |
| throughput/1000/apply.replace           |         2,687.24 (282.54) |          2,676.26 (94.44) |  -0.41% |    +0.30% (4.91 pp) |
| throughput/5000/apply.replace           |          2,870.23 (66.43) |         2,848.28 (199.52) |  -0.76% |    -0.08% (5.43 pp) |
| throughput/10000/apply.replace          |            2,770.6 (99.8) |          2,671.66 (58.33) |  -3.57% |    -4.02% (5.35 pp) |
| throughput/15000/apply.replace          |         2,851.86 (306.37) |            2,970.96 (369) |  +4.18% |    +3.04% (6.24 pp) |
| throughput/20000/apply.replace          |         2,839.88 (233.02) |            2,654 (323.38) |  -6.55% |   -0.42% (14.27 pp) |
| throughput/25000/apply.replace          |          2,713.63 (94.18) |         2,695.29 (116.37) |  -0.68% |    +0.77% (1.18 pp) |
| throughput/100/create.empty             |            538.23 (72.21) |             551.62 (6.23) |  +2.49% |     +4.02% (1.7 pp) |
| throughput/1000/create.empty            |            700.47 (55.57) |           722.79 (161.93) |  +3.19% |   +6.05% (17.12 pp) |
| throughput/5000/create.empty            |            788.52 (70.74) |           772.14 (191.81) |  -2.08% |    -2.08% (24.3 pp) |
| throughput/10000/create.empty           |            699.63 (96.69) |             735.17 (75.2) |  +5.08% |   -3.81% (10.72 pp) |
| throughput/15000/create.empty           |            765.95 (26.68) |           770.56 (117.59) |  +0.60% |   +0.57% (12.21 pp) |
| throughput/20000/create.empty           |           782.05 (137.42) |            726.97 (78.44) |  -7.04% |   -7.04% (13.97 pp) |
| throughput/25000/create.empty           |            770.13 (63.33) |           700.09 (104.74) |  -9.09% |   -6.04% (11.79 pp) |
| throughput/100/create.sequence          |         1,714.12 (303.34) |          1,637.48 (162.1) |  -4.47% |   +2.79% (15.47 pp) |
| throughput/1000/create.sequence         |          1,819.8 (277.45) |         1,962.79 (261.42) |  +7.86% |    +7.86% (8.22 pp) |
| throughput/5000/create.sequence         |          1,564.58 (45.17) |         1,615.95 (305.16) |  +3.28% |    -0.38% (6.32 pp) |
| throughput/10000/create.sequence        |         1,731.42 (174.31) |         1,613.03 (136.56) |  -6.84% |   -4.83% (14.46 pp) |
| throughput/15000/create.sequence        |           1,449.1 (124.6) |         1,539.24 (259.85) |  +6.22% |      +2.06% (13 pp) |
| throughput/20000/create.sequence        |         1,553.04 (190.85) |         1,623.38 (193.94) |  +4.53% |    -0.18% (6.49 pp) |
| throughput/25000/create.sequence        |         1,580.89 (509.02) |          1,570.75 (87.44) |  -0.64% |   +1.54% (18.68 pp) |
| throughput/100/insert.head              |            525.44 (30.64) |           524.24 (106.88) |  -0.23% |   +9.47% (17.87 pp) |
| throughput/1000/insert.head             |            531.31 (22.03) |           524.52 (133.35) |  -1.28% |   +4.70% (18.68 pp) |
| throughput/5000/insert.head             |            560.89 (40.81) |            527.31 (23.67) |  -5.99% |    -5.99% (6.58 pp) |
| throughput/10000/insert.head            |            528.46 (18.52) |            536.71 (34.95) |  +1.56% |    -0.56% (10.7 pp) |
| throughput/15000/insert.head            |            509.18 (39.58) |            567.22 (108.5) | +11.40% |  +17.95% (15.65 pp) |
| throughput/20000/insert.head            |            513.99 (78.67) |            484.57 (38.54) |  -5.72% |    -2.68% (6.86 pp) |
| throughput/25000/insert.head            |            457.46 (29.03) |            463.03 (39.01) |  +1.22% |   +0.34% (17.99 pp) |
| throughput/100/insert.middle            |            598.21 (60.04) |            683.77 (88.67) | +14.30% |   +4.10% (22.18 pp) |
| throughput/1000/insert.middle           |            636.08 (24.81) |            637.36 (17.25) |  +0.20% |    -0.74% (6.29 pp) |
| throughput/5000/insert.middle           |            596.69 (19.12) |            597.86 (26.61) |  +0.20% |    -0.32% (3.25 pp) |
| throughput/10000/insert.middle          |            639.64 (57.99) |            617.88 (53.67) |  -3.40% |    -2.59% (0.33 pp) |
| throughput/15000/insert.middle          |            562.94 (45.38) |            557.62 (70.77) |  -0.95% |   +0.68% (11.77 pp) |
| throughput/20000/insert.middle          |            602.63 (21.08) |            591.53 (18.11) |  -1.84% |    -4.97% (5.02 pp) |
| throughput/25000/insert.middle          |            602.96 (68.22) |            558.63 (41.71) |  -7.35% |     -1.05% (4.8 pp) |
| throughput/100/insert.random            |            812.56 (74.68) |            917.73 (58.65) | +12.94% |  +10.88% (11.28 pp) |
| throughput/1000/insert.random           |            901.15 (46.44) |            951.83 (34.22) |  +5.62% |    +5.39% (6.52 pp) |
| throughput/5000/insert.random           |            926.43 (54.12) |            900.11 (42.85) |  -2.84% |     -1.47% (3.2 pp) |
| throughput/10000/insert.random          |            907.54 (20.54) |            860.79 (15.42) |  -5.15% |   -5.15% (10.47 pp) |
| throughput/15000/insert.random          |            887.73 (33.68) |            886.68 (45.84) |  -0.12% |   -0.12% (13.51 pp) |
| throughput/20000/insert.random          |            857.45 (10.88) |            865.21 (29.02) |  +0.91% |    -1.87% (3.37 pp) |
| throughput/25000/insert.random          |            840.84 (79.08) |            825.6 (150.54) |  -1.81% |    +1.80% (3.92 pp) |
| throughput/100/insert.sameIndex         |             558.73 (5.54) |             544.66 (8.56) |  -2.52% |    -2.63% (2.98 pp) |
| throughput/1000/insert.sameIndex        |             586.29 (16.6) |            575.83 (72.77) |  -1.78% |    +4.16% (10.3 pp) |
| throughput/5000/insert.sameIndex        |            554.17 (39.71) |            589.34 (45.37) |  +6.35% |    -0.08% (1.88 pp) |
| throughput/10000/insert.sameIndex       |            539.85 (31.37) |            524.79 (21.38) |  -2.79% |    -1.78% (2.29 pp) |
| throughput/15000/insert.sameIndex       |             558.9 (21.49) |           563.63 (105.25) |  +0.85% |   +5.83% (19.45 pp) |
| throughput/20000/insert.sameIndex       |           589.73 (108.38) |            559.99 (34.48) |  -5.04% |    -6.85% (6.14 pp) |
| throughput/25000/insert.sameIndex       |            527.95 (56.99) |             541.29 (40.4) |  +2.53% |   -3.48% (11.88 pp) |
| throughput/100/insert.tail              |            915.18 (59.89) |           899.66 (171.93) |  -1.70% |    +1.52% (8.14 pp) |
| throughput/1000/insert.tail             |            896.94 (95.36) |            966.7 (151.65) |  +7.78% |    +0.80% (6.43 pp) |
| throughput/5000/insert.tail             |         1,020.68 (105.19) |            945.59 (12.86) |  -7.36% |    -3.38% (9.26 pp) |
| throughput/10000/insert.tail            |            875.9 (112.56) |           912.13 (107.26) |  +4.14% |    -4.91% (9.75 pp) |
| throughput/15000/insert.tail            |            791.47 (256.6) |            760.19 (92.08) |  -3.95% |       -3.95% (5 pp) |
| throughput/20000/insert.tail            |            876.24 (15.47) |            889.73 (49.17) |  +1.54% |    -0.78% (2.47 pp) |
| throughput/25000/insert.tail            |           929.77 (199.75) |            874.69 (54.71) |  -5.92% |   -0.62% (15.93 pp) |
| throughput/100/length                   |             128.99 (22.1) |            131.64 (20.09) |  +2.05% |   +4.33% (36.41 pp) |
| throughput/1000/length                  |             112.13 (2.88) |             111.97 (5.94) |  -0.14% |    +1.35% (2.76 pp) |
| throughput/5000/length                  |             125.85 (4.38) |             114.93 (5.07) |  -8.68% |    -9.54% (6.38 pp) |
| throughput/10000/length                 |             115.65 (6.62) |             114.79 (15.6) |  -0.74% |    +1.48% (9.55 pp) |
| throughput/15000/length                 |             107.45 (6.31) |             115.03 (12.7) |  +7.05% |   +7.05% (10.58 pp) |
| throughput/20000/length                 |             110.67 (8.44) |             113.31 (3.76) |  +2.39% |   +3.80% (18.81 pp) |
| throughput/25000/length                 |             105.32 (7.78) |            114.51 (13.76) |  +8.73% |   +10.65% (5.28 pp) |
| throughput/100/merge.duplicate          |             835.45 (77.3) |           926.76 (119.69) | +10.93% |  +10.93% (17.18 pp) |
| throughput/1000/merge.duplicate         |            707.72 (74.59) |            710.14 (69.63) |  +0.34% |   +0.34% (11.72 pp) |
| throughput/5000/merge.duplicate         |            699.45 (48.91) |            663.56 (22.58) |  -5.13% |    -3.21% (4.39 pp) |
| throughput/10000/merge.duplicate        |            607.25 (16.88) |             634.93 (15.3) |  +4.56% |    +3.36% (1.35 pp) |
| throughput/15000/merge.duplicate        |            592.91 (27.27) |            622.24 (31.49) |  +4.95% |    +3.29% (2.71 pp) |
| throughput/20000/merge.duplicate        |            581.88 (41.24) |            631.55 (37.28) |  +8.54% |    +2.75% (2.59 pp) |
| throughput/25000/merge.duplicate        |             582.89 (3.99) |            617.28 (36.12) |  +5.90% |   +0.62% (10.55 pp) |
| throughput/100/merge.insert             |          1,830.11 (87.98) |         1,970.19 (253.72) |  +7.65% |   +7.31% (10.73 pp) |
| throughput/1000/merge.insert            |         1,468.17 (140.54) |         1,492.77 (122.73) |  +1.68% |    +1.93% (4.51 pp) |
| throughput/5000/merge.insert            |          1,561.35 (99.96) |          1,599.18 (29.73) |  +2.42% |    -2.17% (5.84 pp) |
| throughput/10000/merge.insert           |         1,581.88 (113.32) |          1,556.76 (11.61) |  -1.59% |   -1.39% (10.34 pp) |
| throughput/15000/merge.insert           |         1,428.46 (100.66) |         1,631.52 (219.98) | +14.22% |  +14.22% (11.71 pp) |
| throughput/20000/merge.insert           |          1,522.85 (69.62) |         1,562.77 (173.47) |  +2.62% |    +7.81% (1.88 pp) |
| throughput/25000/merge.insert           |          1,307.26 (97.74) |         1,458.94 (130.16) | +11.60% |      +6.47% (15 pp) |
| throughput/100/remove.head              |            724.42 (43.58) |             723.97 (62.6) |  -0.06% |    +3.43% (7.85 pp) |
| throughput/1000/remove.head             |            808.52 (45.15) |            783.02 (19.24) |  -3.15% |    +0.89% (4.11 pp) |
| throughput/5000/remove.head             |            832.35 (12.84) |            851.22 (49.81) |  +2.27% |    +1.01% (5.69 pp) |
| throughput/10000/remove.head            |            874.27 (63.46) |            900.21 (22.01) |  +2.97% |    -0.58% (7.54 pp) |
| throughput/15000/remove.head            |            900.77 (62.55) |            837.54 (51.85) |  -7.02% |    -5.94% (1.57 pp) |
| throughput/20000/remove.head            |            962.46 (69.84) |            983.02 (32.33) |  +2.14% |    +3.58% (4.77 pp) |
| throughput/25000/remove.head            |           979.98 (110.55) |            910.02 (70.79) |  -7.14% |    -3.35% (3.11 pp) |
| throughput/100/remove.middle            |             728.28 (68.8) |            726.05 (62.43) |  -0.31% |    +2.57% (10.6 pp) |
| throughput/1000/remove.middle           |            845.52 (63.48) |            792.99 (20.66) |  -6.21% |    -3.85% (8.59 pp) |
| throughput/5000/remove.middle           |            838.01 (58.81) |             819.5 (21.33) |  -2.21% |    -1.74% (4.93 pp) |
| throughput/10000/remove.middle          |             838.6 (71.55) |            865.51 (16.01) |  +3.21% |    +3.63% (9.13 pp) |
| throughput/15000/remove.middle          |            861.73 (51.87) |            869.1 (130.66) |  +0.86% |    +3.37% (9.22 pp) |
| throughput/20000/remove.middle          |             946.9 (41.57) |          1,035.65 (50.65) |  +9.37% |    +9.37% (8.56 pp) |
| throughput/25000/remove.middle          |             940.8 (56.13) |            924.07 (52.28) |  -1.78% |   -1.78% (11.04 pp) |
| throughput/100/remove.random            |            939.16 (42.14) |            943.47 (20.24) |  +0.46% |    +0.46% (4.43 pp) |
| throughput/1000/remove.random           |         1,186.51 (120.56) |          1,225.44 (79.64) |  +3.28% |    -0.31% (7.59 pp) |
| throughput/5000/remove.random           |           1,234.6 (44.67) |            1,209.8 (37.5) |  -2.01% |    -1.08% (1.26 pp) |
| throughput/10000/remove.random          |          1,275.33 (21.86) |          1,216.83 (34.38) |  -4.59% |    -3.59% (9.05 pp) |
| throughput/15000/remove.random          |          1,194.59 (78.71) |           1,200.58 (78.7) |  +0.50% |    -2.46% (8.22 pp) |
| throughput/20000/remove.random          |          1,345.91 (53.09) |          1,249.67 (88.61) |  -7.15% |    -4.18% (4.52 pp) |
| throughput/25000/remove.random          |          1,269.92 (43.55) |          1,247.24 (66.46) |  -1.79% |    -3.68% (7.41 pp) |
| throughput/100/remove.sameIndex         |            812.49 (95.86) |         1,065.73 (232.45) | +31.17% |    +3.06% (43.1 pp) |
| throughput/1000/remove.sameIndex        |             844.7 (81.27) |            818.68 (17.46) |  -3.08% |   +0.37% (10.28 pp) |
| throughput/5000/remove.sameIndex        |             849.93 (3.95) |            813.87 (67.32) |  -4.24% |    -4.06% (6.44 pp) |
| throughput/10000/remove.sameIndex       |           851.77 (110.87) |            855.13 (73.76) |  +0.39% |   -4.89% (11.96 pp) |
| throughput/15000/remove.sameIndex       |           869.93 (103.98) |            842.52 (69.22) |  -3.15% |   +2.94% (15.62 pp) |
| throughput/20000/remove.sameIndex       |             940.54 (22.9) |            960.49 (35.27) |  +2.12% |    +1.03% (7.04 pp) |
| throughput/25000/remove.sameIndex       |               968 (47.54) |            925.65 (33.44) |  -4.38% |    -5.35% (8.37 pp) |
| throughput/100/remove.tail              |             678.4 (16.36) |            738.72 (90.95) |  +8.89% |   +8.89% (14.36 pp) |
| throughput/1000/remove.tail             |             751.5 (30.86) |            727.56 (24.48) |  -3.19% |    +0.75% (4.72 pp) |
| throughput/5000/remove.tail             |            747.02 (25.22) |            712.31 (28.44) |  -4.65% |    -4.32% (6.62 pp) |
| throughput/10000/remove.tail            |             820.4 (47.62) |            776.09 (56.38) |  -5.40% |    -4.59% (9.16 pp) |
| throughput/15000/remove.tail            |             752.62 (83.7) |            779.78 (40.45) |  +3.61% |   +7.98% (10.76 pp) |
| throughput/20000/remove.tail            |            895.83 (51.39) |             851.5 (75.17) |  -4.95% |    -5.11% (5.59 pp) |
| throughput/25000/remove.tail            |            840.76 (53.51) |            865.92 (39.32) |  +2.99% |   +0.92% (13.91 pp) |
| throughput/100/replace.head             |          1,052.44 (63.49) |         1,109.35 (146.23) |  +5.41% |  +11.58% (17.11 pp) |
| throughput/1000/replace.head            |           1,217.74 (49.8) |          1,165.87 (30.31) |  -4.26% |    -1.11% (3.49 pp) |
| throughput/5000/replace.head            |          1,160.56 (14.89) |          1,144.48 (16.72) |  -1.39% |    +0.49% (2.87 pp) |
| throughput/10000/replace.head           |           1,144.73 (69.8) |          1,221.22 (92.55) |  +6.68% |   +6.68% (17.38 pp) |
| throughput/15000/replace.head           |          1,170.02 (98.12) |          1,168.48 (61.23) |  -0.13% |    -1.60% (7.24 pp) |
| throughput/20000/replace.head           |         1,275.25 (107.02) |          1,226.67 (36.66) |  -3.81% |    -5.79% (6.69 pp) |
| throughput/25000/replace.head           |          1,219.79 (86.61) |          1,198.11 (52.03) |  -1.78% |   -1.40% (10.46 pp) |
| throughput/100/replace.middle           |          1,085.92 (38.99) |          1,023.73 (39.46) |  -5.73% |    -3.40% (6.37 pp) |
| throughput/1000/replace.middle          |          1,267.56 (95.98) |          1,205.34 (64.77) |  -4.91% |    -0.28% (2.13 pp) |
| throughput/5000/replace.middle          |          1,190.66 (34.34) |           1,186.12 (41.3) |  -0.38% |     +0.47% (5.5 pp) |
| throughput/10000/replace.middle         |          1,225.34 (60.19) |          1,230.45 (81.64) |  +0.42% |       +0.82% (5 pp) |
| throughput/15000/replace.middle         |         1,206.47 (104.75) |           1,248.8 (93.45) |  +3.51% |     -3.71% (2.2 pp) |
| throughput/20000/replace.middle         |          1,329.53 (67.13) |           1,279.5 (58.97) |  -3.76% |    -5.71% (6.71 pp) |
| throughput/25000/replace.middle         |          1,277.32 (25.23) |         1,297.07 (203.05) |  +1.55% |   -0.33% (17.71 pp) |
| throughput/100/replace.random           |          1,610.14 (81.24) |          1,586.61 (17.73) |  -1.46% |    -2.18% (6.46 pp) |
| throughput/1000/replace.random          |            1,831.11 (106) |         1,801.73 (132.88) |  -1.60% |    -0.10% (5.18 pp) |
| throughput/5000/replace.random          |          1,894.12 (94.38) |         1,762.33 (127.48) |  -6.96% |    -1.78% (0.55 pp) |
| throughput/10000/replace.random         |         1,798.34 (123.22) |          1,795.39 (31.43) |  -0.16% |   -3.45% (10.04 pp) |
| throughput/15000/replace.random         |         1,737.44 (122.76) |          1,727.13 (95.53) |  -0.59% |    -1.30% (1.69 pp) |
| throughput/20000/replace.random         |           1,750.4 (151.3) |         1,916.47 (110.03) |  +9.49% |    +7.91% (4.16 pp) |
| throughput/25000/replace.random         |          1,771.53 (33.98) |         1,768.71 (129.44) |  -0.16% |   -0.04% (10.26 pp) |
| throughput/100/replace.sameIndex        |          1,040.82 (88.34) |            997.29 (40.13) |  -4.18% |    -3.47% (5.96 pp) |
| throughput/1000/replace.sameIndex       |          1,241.21 (91.32) |          1,190.48 (85.79) |  -4.09% |    -2.58% (2.24 pp) |
| throughput/5000/replace.sameIndex       |          1,184.53 (54.27) |          1,159.67 (44.83) |  -2.10% |    -0.96% (6.55 pp) |
| throughput/10000/replace.sameIndex      |         1,167.07 (169.34) |          1,177.65 (39.08) |  +0.91% |   +0.18% (10.93 pp) |
| throughput/15000/replace.sameIndex      |          1,135.59 (16.65) |          1,113.79 (19.59) |  -1.92% |    -2.46% (3.23 pp) |
| throughput/20000/replace.sameIndex      |         1,268.23 (145.85) |          1,170.58 (24.02) |  -7.70% |   -4.66% (12.73 pp) |
| throughput/25000/replace.sameIndex      |         1,230.86 (116.61) |          1,173.74 (37.42) |  -4.64% |     -4.78% (9.6 pp) |
| throughput/100/replace.tail             |           1,036.08 (85.2) |          1,005.68 (28.69) |  -2.93% |    -1.33% (2.65 pp) |
| throughput/1000/replace.tail            |          1,230.05 (46.54) |          1,194.88 (31.96) |  -2.86% |    -4.74% (7.36 pp) |
| throughput/5000/replace.tail            |          1,168.19 (24.58) |             1,172.54 (47) |  +0.37% |     +2.96% (5.8 pp) |
| throughput/10000/replace.tail           |          1,211.32 (87.89) |          1,160.49 (95.18) |  -4.20% |    -1.25% (6.05 pp) |
| throughput/15000/replace.tail           |           1,177.6 (21.71) |         1,285.45 (103.33) |  +9.16% |  +13.12% (12.76 pp) |
| throughput/20000/replace.tail           |          1,226.32 (58.55) |           1,207.12 (71.2) |  -1.57% |    -1.33% (7.52 pp) |
| throughput/25000/replace.tail           |         1,194.25 (219.23) |          1,235.88 (28.57) |  +3.49% |   +4.23% (18.22 pp) |
| throughput/100/retire                   |             213.3 (56.36) |              174.74 (9.4) | -18.08% |  -20.44% (17.47 pp) |
| throughput/1000/retire                  |             218.02 (2.71) |             216.56 (3.72) |  -0.67% |    -1.58% (4.06 pp) |
| throughput/5000/retire                  |             206.9 (46.93) |             202.94 (6.76) |  -1.91% |   -5.76% (19.37 pp) |
| throughput/10000/retire                 |             198.92 (14.6) |            222.87 (39.77) | +12.04% |    +3.90% (38.4 pp) |
| throughput/15000/retire                 |             198.29 (7.78) |              193.72 (3.9) |  -2.30% |       -2.30% (6 pp) |
| throughput/20000/retire                 |             201.63 (5.06) |              188.26 (1.4) |  -6.63% |    -5.99% (5.63 pp) |
| throughput/25000/retire                 |            196.14 (12.59) |            178.67 (10.22) |  -8.91% |    -2.34% (9.45 pp) |
| throughput/100/sequence                 |            288.34 (49.94) |            309.05 (71.73) |  +7.18% |    +5.53% (7.22 pp) |
| throughput/1000/sequence                |            306.88 (18.88) |            306.92 (22.54) |  +0.01% |    -3.08% (9.03 pp) |
| throughput/5000/sequence                |             282.34 (12.4) |             280.02 (5.95) |  -0.82% |     +0.43% (6.7 pp) |
| throughput/10000/sequence               |            276.87 (19.22) |             271.59 (8.56) |  -1.91% |    -3.36% (6.86 pp) |
| throughput/15000/sequence               |            264.29 (20.09) |             259.59 (1.78) |  -1.78% |     -4.73% (7.1 pp) |
| throughput/20000/sequence               |             256.77 (0.91) |             244.99 (8.57) |  -4.59% |    -3.19% (3.67 pp) |
| throughput/25000/sequence               |             252.77 (5.09) |             263.05 (10.3) |  +4.07% |    +3.58% (1.63 pp) |
| throughput/100/value.head               |            179.87 (20.18) |            182.04 (35.47) |  +1.21% |    +3.95% (1.03 pp) |
| throughput/1000/value.head              |              170.7 (9.63) |             169.01 (6.72) |  -0.99% |    -1.49% (6.25 pp) |
| throughput/5000/value.head              |             153.94 (1.34) |            145.07 (10.69) |  -5.76% |    -5.29% (2.64 pp) |
| throughput/10000/value.head             |            144.63 (11.51) |             146.63 (0.08) |  +1.38% |     +1.39% (7.8 pp) |
| throughput/15000/value.head             |              137.1 (7.47) |             139.43 (7.02) |  +1.70% |   -2.86% (10.82 pp) |
| throughput/20000/value.head             |             138.21 (5.61) |             136.02 (5.09) |  -1.58% |    +0.06% (3.88 pp) |
| throughput/25000/value.head             |             140.86 (9.59) |             131.25 (8.22) |  -6.82% |    -4.00% (6.49 pp) |
| throughput/100/value.middle             |            264.16 (43.21) |            220.04 (92.12) | -16.70% |    +4.46% (35.3 pp) |
| throughput/1000/value.middle            |             259.2 (16.13) |              253.3 (6.44) |  -2.28% |    -2.28% (2.62 pp) |
| throughput/5000/value.middle            |             224.09 (16.3) |             225.14 (6.97) |  +0.47% |    +0.64% (11.1 pp) |
| throughput/10000/value.middle           |            223.76 (20.37) |             221.89 (2.03) |  -0.84% |    -0.68% (7.36 pp) |
| throughput/15000/value.middle           |             214.45 (3.27) |            217.41 (10.46) |  +1.38% |    +2.43% (7.76 pp) |
| throughput/20000/value.middle           |            218.29 (12.42) |             213.26 (5.41) |  -2.30% |    -1.05% (0.36 pp) |
| throughput/25000/value.middle           |            215.18 (29.99) |              210.09 (3.4) |  -2.37% |    -3.56% (4.13 pp) |
| throughput/100/value.random             |            203.02 (21.03) |            215.95 (31.26) |  +6.37% |   +4.45% (10.59 pp) |
| throughput/1000/value.random            |            249.69 (18.39) |             226.02 (4.93) |  -9.48% |   -11.29% (7.83 pp) |
| throughput/5000/value.random            |              270.8 (8.33) |            266.47 (26.38) |  -1.60% |   -1.60% (12.89 pp) |
| throughput/10000/value.random           |            268.59 (17.97) |             281.3 (10.37) |  +4.73% |     +5.94% (9.1 pp) |
| throughput/15000/value.random           |              268.37 (7.3) |             253.65 (5.62) |  -5.48% |    -5.00% (6.22 pp) |
| throughput/20000/value.random           |             272.53 (14.4) |            282.19 (33.86) |  +3.54% |    +3.95% (23.6 pp) |
| throughput/25000/value.random           |            269.02 (29.36) |             277.3 (18.87) |  +3.08% |   +3.08% (19.96 pp) |
| throughput/100/value.sameIndex          |             183.9 (10.63) |             170.33 (6.32) |  -7.38% |    -6.03% (11.8 pp) |
| throughput/1000/value.sameIndex         |            196.34 (17.95) |             185.22 (6.44) |  -5.66% |    -6.88% (5.53 pp) |
| throughput/5000/value.sameIndex         |             173.94 (7.82) |            174.11 (21.14) |  +0.10% |   +6.61% (15.01 pp) |
| throughput/10000/value.sameIndex        |            187.68 (27.28) |            171.42 (16.33) |  -8.66% |   -7.87% (15.86 pp) |
| throughput/15000/value.sameIndex        |            159.61 (18.56) |             173.25 (2.25) |  +8.55% |   +8.97% (12.07 pp) |
| throughput/20000/value.sameIndex        |            157.42 (12.56) |             162.7 (17.82) |  +3.35% |   +7.29% (10.21 pp) |
| throughput/25000/value.sameIndex        |            159.36 (25.94) |             156.23 (5.75) |  -1.96% |    +2.29% (3.73 pp) |
| throughput/100/value.tail               |            237.16 (24.57) |            206.13 (39.28) | -13.08% |   +7.01% (25.25 pp) |
| throughput/1000/value.tail              |            223.19 (28.21) |            223.19 (10.14) |  +0.00% |   +0.00% (17.33 pp) |
| throughput/5000/value.tail              |            207.35 (10.84) |              193.92 (4.5) |  -6.48% |    -7.25% (3.94 pp) |
| throughput/10000/value.tail             |             202.7 (14.17) |             189.57 (5.42) |  -6.48% |   -9.57% (11.74 pp) |
| throughput/15000/value.tail             |            187.39 (11.07) |             185.58 (9.17) |  -0.97% |    -3.78% (1.91 pp) |
| throughput/20000/value.tail             |             179.98 (9.86) |            188.36 (11.26) |  +4.66% |    +6.27% (7.48 pp) |
| throughput/25000/value.tail             |            182.35 (15.49) |                173.13 (4) |  -5.06% |   -0.49% (11.91 pp) |
| throughput/100/values                   |          4,464.15 (369.9) |         5,115.21 (558.63) | +14.58% |   +14.38% (17.8 pp) |
| throughput/1000/values                  |    166,961.41 (11,681.08) |       163,706.41 (860.47) |  -1.95% |     -2.59% (6.1 pp) |
| throughput/5000/values                  |    576,519.79 (34,344.79) |    562,171.35 (43,592.71) |  -2.49% |    -0.42% (3.77 pp) |
| throughput/10000/values                 | 1,159,028.13 (101,593.75) | 1,201,122.66 (102,821.09) |  +3.63% |   -0.80% (19.67 pp) |
| throughput/15000/values                 |   1,908,695.31 (58,587.5) | 1,836,876.56 (100,578.13) |  -3.76% |   -1.39% (13.55 pp) |
| throughput/20000/values                 |  2,529,440.63 (50,934.38) |  2,625,628.13 (211,237.5) |  +3.80% |    -0.09% (8.27 pp) |
| throughput/25000/values                 |   3,399,145.31 (42,312.5) | 3,190,642.19 (354,004.69) |  -6.13% |   +1.92% (11.71 pp) |
| throughput/100/values.head              |            311.72 (40.66) |             290.38 (20.2) |  -6.85% |    +1.24% (5.74 pp) |
| throughput/1000/values.head             |             277.19 (11.6) |            259.83 (11.62) |  -6.26% |   -7.32% (11.06 pp) |
| throughput/5000/values.head             |             272.63 (53.5) |             278.98 (8.01) |  +2.33% |   +1.06% (15.56 pp) |
| throughput/10000/values.head            |             300.58 (39.7) |             287.54 (8.68) |  -4.34% |   -9.27% (13.88 pp) |
| throughput/15000/values.head            |             276.88 (23.1) |            256.09 (14.46) |  -7.51% |   -4.86% (11.03 pp) |
| throughput/20000/values.head            |             253.64 (5.68) |             280.83 (5.87) | +10.72% |    +11.42% (9.8 pp) |
| throughput/25000/values.head            |            261.71 (60.11) |            254.07 (42.81) |  -2.92% |    +1.93% (9.77 pp) |
| throughput/100/values.middle            |             312.56 (8.19) |            277.17 (10.91) | -11.32% |    -8.96% (7.31 pp) |
| throughput/1000/values.middle           |            271.83 (29.99) |            272.71 (10.87) |  +0.32% |    -1.06% (7.28 pp) |
| throughput/5000/values.middle           |            296.05 (49.79) |            273.55 (29.12) |  -7.60% |    +4.84% (6.99 pp) |
| throughput/10000/values.middle          |            296.21 (13.32) |            293.28 (15.14) |  -0.99% |    -1.85% (8.86 pp) |
| throughput/15000/values.middle          |            249.99 (16.54) |             229.8 (14.43) |  -8.08% |    -7.18% (2.37 pp) |
| throughput/20000/values.middle          |            283.05 (21.52) |            256.32 (29.99) |  -9.44% |   -5.38% (10.83 pp) |
| throughput/25000/values.middle          |            231.47 (25.87) |            239.61 (14.94) |  +3.52% |   +3.52% (23.69 pp) |
| throughput/100/values.random            |            299.56 (61.85) |            285.39 (42.04) |  -4.73% |    +1.74% (7.07 pp) |
| throughput/1000/values.random           |             299.53 (4.92) |              300.66 (7.6) |  +0.38% |    -0.58% (2.27 pp) |
| throughput/5000/values.random           |            346.14 (50.69) |             339.3 (19.89) |  -1.98% |   -1.98% (11.52 pp) |
| throughput/10000/values.random          |            456.12 (19.55) |             386.61 (9.59) | -15.24% |  -15.23% (11.11 pp) |
| throughput/15000/values.random          |               376.37 (50) |            385.06 (27.84) |  +2.31% |   +3.50% (12.95 pp) |
| throughput/20000/values.random          |            402.03 (20.71) |            391.05 (32.66) |  -2.73% |    +1.55% (3.81 pp) |
| throughput/25000/values.random          |            384.62 (22.12) |            368.71 (50.72) |  -4.14% |    -4.14% (0.73 pp) |
| throughput/100/values.sameIndex         |             295.18 (9.84) |             287.16 (6.37) |  -2.72% |    -2.07% (5.84 pp) |
| throughput/1000/values.sameIndex        |            274.85 (25.11) |            272.88 (13.79) |  -0.72% |     -1.94% (3.7 pp) |
| throughput/5000/values.sameIndex        |            291.98 (49.43) |            254.45 (34.19) | -12.85% |   -9.34% (19.18 pp) |
| throughput/10000/values.sameIndex       |             261.6 (24.95) |            248.47 (39.85) |  -5.02% |    +4.41% (26.7 pp) |
| throughput/15000/values.sameIndex       |            239.17 (21.12) |             234.25 (5.28) |  -2.06% |    +0.15% (9.93 pp) |
| throughput/20000/values.sameIndex       |            279.49 (15.62) |            296.49 (53.84) |  +6.08% |   +7.40% (37.27 pp) |
| throughput/25000/values.sameIndex       |            246.04 (13.12) |             229.84 (1.37) |  -6.58% |    -5.11% (5.87 pp) |
| throughput/100/values.tail              |             296.27 (7.77) |            298.46 (24.05) |  +0.74% |    +2.16% (0.77 pp) |
| throughput/1000/values.tail             |             277.1 (16.05) |              265.3 (6.75) |  -4.26% |    -2.24% (1.84 pp) |
| throughput/5000/values.tail             |            277.19 (16.01) |             249.94 (1.55) |  -9.83% |    -9.23% (6.67 pp) |
| throughput/10000/values.tail            |            250.76 (36.79) |            278.23 (38.94) | +10.95% |     +14.28% (29 pp) |
| throughput/15000/values.tail            |            248.73 (24.51) |             229.5 (30.43) |  -7.73% |   +3.77% (20.92 pp) |
| throughput/20000/values.tail            |            267.97 (49.89) |            255.62 (70.67) |  -4.61% |  +13.33% (23.18 pp) |
| throughput/25000/values.tail            |             221.99 (12.6) |            268.58 (44.82) | +20.99% |      -0.45% (24 pp) |
| lifecycle/scaleUp/apply.random          |          3,847.43 (44.88) |         3,818.26 (187.89) |  -0.76% |    -0.76% (5.06 pp) |
| lifecycle/scaleUp/insert.head           |             825.3 (28.85) |            824.35 (88.19) |  -0.11% |    +0.60% (6.85 pp) |
| lifecycle/scaleUp/insert.random         |         1,826.46 (200.69) |           1,713.55 (44.4) |  -6.18% |    -6.96% (6.71 pp) |
| lifecycle/scaleUp/insert.tail           |           731.04 (129.96) |           831.39 (112.77) | +13.73% |    -0.32% (5.73 pp) |
| lifecycle/scaleUp/remove.random         |         2,759.28 (148.66) |         2,702.67 (267.78) |  -2.05% |    -2.05% (7.07 pp) |
| lifecycle/scaleUp/replace.head          |         2,452.41 (198.33) |          2,439.68 (55.38) |  -0.52% |    -0.52% (4.82 pp) |
| lifecycle/scaleUp/replace.random        |         3,701.31 (274.13) |         3,472.62 (255.66) |  -6.18% |   -6.18% (18.33 pp) |
| lifecycle/scaleUp/replace.tail          |         2,465.67 (168.63) |         2,259.88 (128.27) |  -8.35% |   -1.83% (10.38 pp) |
| lifecycle/scaleUp/value.head            |            310.32 (22.83) |             327.26 (9.76) |  +5.46% |    +4.09% (2.73 pp) |
| lifecycle/scaleUp/value.random          |           1,110.5 (16.23) |          1,111.76 (17.33) |  +0.11% |    +0.11% (2.28 pp) |
| lifecycle/scaleUp/value.tail            |             156.31 (2.77) |             153.41 (6.44) |  -1.85% |    -6.00% (5.57 pp) |
| lifecycle/scaleDown/apply.random        |          3,569.92 (10.89) |         3,469.03 (397.41) |  -2.83% |    -2.66% (1.51 pp) |
| lifecycle/scaleDown/insert.random       |          1,700.17 (21.97) |          1,717.28 (48.99) |  +1.01% |    +0.41% (2.42 pp) |
| lifecycle/scaleDown/remove.head         |         1,890.06 (190.18) |          1,895.13 (35.91) |  +0.27% |    +1.49% (11.8 pp) |
| lifecycle/scaleDown/remove.random       |          2,709.88 (66.92) |          2,657.01 (15.07) |  -1.95% |    -1.67% (0.83 pp) |
| lifecycle/scaleDown/remove.tail         |          1,754.9 (212.56) |          1,698.26 (31.55) |  -3.23% |   +0.81% (12.79 pp) |
| lifecycle/scaleDown/replace.head        |         2,663.73 (346.26) |          2,457.56 (12.27) |  -7.74% |   -8.52% (12.19 pp) |
| lifecycle/scaleDown/replace.random      |         3,244.88 (210.64) |         3,189.31 (125.08) |  -1.71% |    -1.71% (1.39 pp) |
| lifecycle/scaleDown/replace.tail        |         19,313.34 (262.3) |        19,085.53 (468.54) |  -1.18% |    -0.56% (5.05 pp) |
| lifecycle/scaleDown/value.head          |            419.32 (10.06) |             416.31 (8.45) |  -0.72% |    +0.72% (2.99 pp) |
| lifecycle/scaleDown/value.random        |           1,066.22 (12.2) |          1,060.49 (13.75) |  -0.54% |    +0.31% (1.76 pp) |
| lifecycle/scaleDown/value.tail          |             233.06 (4.85) |             230.56 (7.96) |  -1.07% |    -0.77% (1.61 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,715.14 (200.19) |         3,742.04 (219.29) |  +0.72% |    -1.05% (0.55 pp) |
| lifecycle/fullLifecycle/insert.head     |             825.3 (28.85) |            824.35 (88.19) |  -0.11% |    +0.60% (6.85 pp) |
| lifecycle/fullLifecycle/insert.random   |          1,753.26 (84.45) |          1,724.88 (30.02) |  -1.62% |    -3.82% (5.18 pp) |
| lifecycle/fullLifecycle/insert.tail     |           731.04 (129.96) |           831.39 (112.77) | +13.73% |    -0.32% (5.73 pp) |
| lifecycle/fullLifecycle/remove.head     |         1,890.06 (190.18) |          1,895.13 (35.91) |  +0.27% |    +1.49% (11.8 pp) |
| lifecycle/fullLifecycle/remove.random   |          2,752.82 (84.42) |         2,679.84 (141.42) |  -2.65% |    -4.00% (3.53 pp) |
| lifecycle/fullLifecycle/remove.tail     |          1,754.9 (212.56) |          1,698.26 (31.55) |  -3.23% |   +0.81% (12.79 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,625.54 (188.42) |          2,475.68 (31.98) |  -5.71% |    -1.63% (5.75 pp) |
| lifecycle/fullLifecycle/replace.random  |          3,503.34 (52.25) |          3,327.29 (68.37) |  -5.03% |   -4.10% (10.36 pp) |
| lifecycle/fullLifecycle/replace.tail    |        10,892.03 (256.88) |        10,658.03 (250.24) |  -2.15% |    -0.42% (6.77 pp) |
| lifecycle/fullLifecycle/value.head      |            368.52 (11.21) |            375.74 (10.79) |  +1.96% |    +2.16% (3.98 pp) |
| lifecycle/fullLifecycle/value.random    |           1,095.01 (7.69) |          1,090.65 (17.14) |  -0.40% |    -1.16% (1.86 pp) |
| lifecycle/fullLifecycle/value.tail      |             197.14 (4.69) |             192.02 (0.78) |  -2.60% |    -2.30% (2.51 pp) |
| checkpoint/up/1000/create               |          389,900 (26,000) |          422,000 (11,000) |  +8.23% |   -0.07% (12.21 pp) |
| checkpoint/up/1000/sequence             |       2,724,300 (816,600) |       2,706,800 (264,200) |  -0.64% |   +1.64% (20.34 pp) |
| checkpoint/up/1000/values               |       1,907,800 (139,500) |        1,813,600 (69,900) |  -4.94% |    -4.94% (3.73 pp) |
| checkpoint/up/5000/create               |          900,900 (17,300) |          894,200 (33,300) |  -0.74% |    -1.91% (4.16 pp) |
| checkpoint/up/5000/sequence             |       7,735,100 (105,800) |       8,296,900 (590,500) |  +7.26% |    +11.74% (9.5 pp) |
| checkpoint/up/5000/values               |       5,091,700 (824,200) |       5,089,200 (298,900) |  -0.05% |   -2.03% (19.72 pp) |
| checkpoint/up/10000/create              |        1,608,300 (65,900) |        1,628,900 (18,100) |  +1.28% |    +0.08% (9.03 pp) |
| checkpoint/up/10000/sequence            |      13,025,400 (860,600) |      13,896,400 (259,000) |  +6.69% |    +6.27% (6.12 pp) |
| checkpoint/up/10000/values              |      20,648,400 (401,100) |      20,200,300 (709,000) |  -2.17% |    -0.74% (5.38 pp) |
| checkpoint/up/15000/create              |       2,442,200 (579,200) |       2,468,100 (539,700) |  +1.06% |    -2.14% (3.39 pp) |
| checkpoint/up/15000/sequence            |      14,744,700 (762,800) |      14,830,300 (348,400) |  +0.58% |   +0.97% (11.33 pp) |
| checkpoint/up/15000/values              |      30,498,800 (818,300) |      29,635,500 (934,200) |  -2.83% |    -3.33% (4.64 pp) |
| checkpoint/up/20000/create              |        3,433,300 (32,900) |        3,380,100 (71,200) |  -1.55% |    -2.97% (3.74 pp) |
| checkpoint/up/20000/sequence            |      21,588,900 (824,000) |      22,426,100 (394,100) |  +3.88% |    +3.44% (3.59 pp) |
| checkpoint/up/20000/values              |      11,181,000 (609,300) |      11,670,600 (912,300) |  +4.38% |   +7.19% (12.47 pp) |
| checkpoint/up/25000/create              |       3,989,700 (154,600) |        3,994,400 (52,000) |  +0.12% |    +1.08% (4.86 pp) |
| checkpoint/up/25000/sequence            |      23,925,700 (473,000) |      23,934,600 (103,500) |  +0.04% |    -0.00% (2.59 pp) |
| checkpoint/up/25000/values              |    12,004,000 (1,100,300) |      11,666,500 (705,400) |  -2.81% |    -5.50% (7.06 pp) |
| checkpoint/down/20000/create            |       3,463,600 (135,600) |        3,420,000 (65,900) |  -1.26% |    -2.54% (7.09 pp) |
| checkpoint/down/20000/sequence          |      19,165,400 (956,800) |      19,014,000 (372,200) |  -0.79% |    +0.91% (6.57 pp) |
| checkpoint/down/20000/values            |       9,424,700 (159,300) |       9,128,900 (374,500) |  -3.14% |    -5.70% (4.67 pp) |
| checkpoint/down/15000/create            |        2,513,100 (64,700) |        2,443,800 (50,300) |  -2.76% |    -3.39% (1.71 pp) |
| checkpoint/down/15000/sequence          |      15,708,200 (781,200) |       15,702,700 (16,900) |  -0.04% |    +0.01% (7.18 pp) |
| checkpoint/down/15000/values            |       7,135,400 (811,600) |       7,184,100 (277,800) |  +0.68% |    +0.08% (8.51 pp) |
| checkpoint/down/10000/create            |        1,729,800 (92,900) |        1,676,100 (37,600) |  -3.10% |    -2.49% (4.37 pp) |
| checkpoint/down/10000/sequence          |      12,725,900 (182,200) |    12,555,800 (1,006,800) |  -1.34% |    -1.34% (9.72 pp) |
| checkpoint/down/10000/values            |       5,719,300 (243,900) |       5,740,300 (254,200) |  +0.37% |    -0.95% (1.53 pp) |
| checkpoint/down/5000/create             |          797,700 (18,900) |          799,300 (26,600) |  +0.20% |    +1.16% (6.85 pp) |
| checkpoint/down/5000/sequence           |       9,720,000 (150,900) |       9,456,500 (433,900) |  -2.71% |    -2.13% (5.37 pp) |
| checkpoint/down/5000/values             |       3,213,300 (437,200) |     2,614,700 (1,053,900) | -18.63% |  -17.04% (36.95 pp) |
| checkpoint/down/1000/create             |          162,700 (21,700) |           161,700 (4,900) |  -0.61% |   -6.48% (17.71 pp) |
| checkpoint/down/1000/sequence           |     6,069,500 (1,193,900) |       6,417,500 (671,300) |  +5.73% |   -1.42% (25.69 pp) |
| checkpoint/down/1000/values             |         595,600 (169,200) |          561,300 (40,900) |  -5.76% |  -10.93% (37.62 pp) |
| checkpoint/down/0/create                |            14,000 (2,000) |            15,900 (7,400) | +13.57% |  +13.67% (85.07 pp) |
| checkpoint/down/0/sequence              |       1,345,100 (121,200) |       1,425,600 (367,300) |  +5.98% |   +5.98% (20.93 pp) |
| checkpoint/down/0/values                |              10,000 (400) |            10,800 (1,500) |  +8.00% |  +16.13% (18.62 pp) |
| tuple/projection/2/create.empty         |             343.26 (5.65) |            358.25 (24.61) |  +4.37% |    +3.35% (3.83 pp) |
| tuple/tuple/2/create.empty              |            436.69 (13.62) |            434.12 (19.95) |  -0.59% |    +0.07% (4.32 pp) |
| tuple/projection/2/create.sequence      |          1,169.29 (24.14) |          1,225.28 (32.19) |  +4.79% |    +4.10% (1.57 pp) |
| tuple/tuple/2/create.sequence           |          1,392.52 (65.14) |          1,352.26 (22.58) |  -2.89% |    -0.63% (1.85 pp) |
| tuple/projection/2/replace.random       |          1,053.63 (23.02) |          1,006.58 (37.21) |  -4.47% |     -4.48% (0.1 pp) |
| tuple/tuple/2/replace.random            |             707.9 (12.47) |             708.7 (41.43) |  +0.11% |    +1.45% (1.93 pp) |
| tuple/projection/2/apply.replace        |          1,664.52 (47.56) |            1,810 (129.18) |  +8.74% |   +8.74% (15.18 pp) |
| tuple/tuple/2/apply.replace             |          1,203.49 (33.01) |             1,201 (18.01) |  -0.21% |    +1.02% (4.96 pp) |
| tuple/projection/2/apply.duplicate      |            601.97 (47.23) |            646.66 (11.47) |  +7.42% |    +6.94% (5.46 pp) |
| tuple/tuple/2/apply.duplicate           |            620.06 (17.52) |            636.31 (16.16) |  +2.62% |    +2.07% (2.57 pp) |
| tuple/projection/2/merge.duplicate      |             672.56 (16.3) |             675.67 (45.4) |  +0.46% |    -2.46% (7.23 pp) |
| tuple/tuple/2/merge.duplicate           |            676.76 (29.44) |           662.82 (100.26) |  -2.06% |   +1.20% (10.63 pp) |
| tuple/projection/2/length               |               7.44 (0.97) |               7.51 (0.93) |  +0.93% |    +0.19% (2.77 pp) |
| tuple/tuple/2/length                    |               7.28 (0.76) |                7.39 (0.3) |  +1.53% |    +2.34% (3.75 pp) |
| tuple/projection/2/value.random         |              29.94 (2.27) |               31.4 (1.01) |  +4.89% |    +7.53% (8.07 pp) |
| tuple/tuple/2/value.random              |              18.68 (1.19) |              18.78 (0.39) |  +0.53% |    +2.17% (8.19 pp) |
| tuple/projection/2/values               |              77.29 (2.49) |              77.17 (3.97) |  -0.16% |    -0.73% (2.51 pp) |
| tuple/tuple/2/values                    |              80.67 (1.37) |              81.77 (1.06) |  +1.36% |    +2.51% (2.95 pp) |
| tuple/projection/2/sequence             |           478.48 (103.36) |             446.96 (6.72) |  -6.59% |   -3.33% (18.03 pp) |
| tuple/tuple/2/sequence                  |             512.49 (21.5) |           562.43 (112.32) |  +9.74% |  +13.45% (21.66 pp) |
| tuple/projection/4/create.empty         |            422.76 (14.43) |            425.45 (10.78) |  +0.64% |    +2.64% (4.68 pp) |
| tuple/tuple/4/create.empty              |           463.78 (134.08) |            442.39 (13.03) |  -4.61% |   -0.59% (24.79 pp) |
| tuple/projection/4/create.sequence      |         1,632.74 (274.21) |          1,616.21 (63.68) |  -1.01% |   -4.47% (19.06 pp) |
| tuple/tuple/4/create.sequence           |         1,583.33 (149.19) |          1,592.61 (37.48) |  +0.59% |    +0.68% (8.58 pp) |
| tuple/projection/4/replace.random       |         1,290.22 (141.37) |          1,111.87 (36.31) | -13.82% |    -7.14% (12.2 pp) |
| tuple/tuple/4/replace.random            |            653.26 (23.15) |             649.54 (36.9) |  -0.57% |   -0.57% (13.19 pp) |
| tuple/projection/4/apply.replace        |         1,745.73 (164.49) |          1,709.37 (22.99) |  -2.08% |    -2.85% (9.69 pp) |
| tuple/tuple/4/apply.replace             |          1,117.85 (77.42) |          1,075.58 (15.25) |  -3.78% |    -2.54% (8.76 pp) |
| tuple/projection/4/apply.duplicate      |            596.42 (24.17) |            595.31 (27.79) |  -0.18% |    -0.93% (1.97 pp) |
| tuple/tuple/4/apply.duplicate           |            607.06 (21.45) |            610.46 (16.02) |  +0.56% |    -0.10% (7.01 pp) |
| tuple/projection/4/merge.duplicate      |            770.29 (68.61) |            774.23 (35.42) |  +0.51% |    +2.87% (12.9 pp) |
| tuple/tuple/4/merge.duplicate           |            790.78 (35.83) |             788.6 (17.35) |  -0.27% |    +1.49% (9.14 pp) |
| tuple/projection/4/length               |              26.66 (0.59) |              26.49 (0.48) |  -0.63% |   -1.60% (33.78 pp) |
| tuple/tuple/4/length                    |              26.51 (0.82) |              26.62 (2.68) |  +0.42% |   +7.65% (10.47 pp) |
| tuple/projection/4/value.random         |              40.15 (0.46) |              42.73 (3.75) |  +6.43% |    +0.39% (9.09 pp) |
| tuple/tuple/4/value.random              |               18.23 (0.8) |               17.5 (1.16) |  -4.02% |   -6.00% (12.38 pp) |
| tuple/projection/4/values               |             147.46 (6.24) |             142.49 (5.44) |  -3.37% |   -2.98% (15.53 pp) |
| tuple/tuple/4/values                    |             142.91 (7.62) |             138.76 (2.66) |  -2.90% |    -0.46% (8.09 pp) |
| tuple/projection/4/sequence             |            483.78 (31.83) |            481.29 (65.79) |  -0.52% |    -0.52% (7.08 pp) |
| tuple/tuple/4/sequence                  |            565.42 (49.33) |            568.41 (43.77) |  +0.53% |    -1.35% (5.57 pp) |
| tuple/projection/8/create.empty         |              422.3 (7.96) |             429.49 (7.54) |  +1.70% |    +3.46% (6.77 pp) |
| tuple/tuple/8/create.empty              |            450.27 (12.76) |             477.22 (17.6) |  +5.99% |    +4.44% (1.53 pp) |
| tuple/projection/8/create.sequence      |         2,255.93 (158.97) |         2,287.27 (171.15) |  +1.39% |    -4.12% (7.17 pp) |
| tuple/tuple/8/create.sequence           |            2,055.2 (63.2) |          2,041.03 (12.55) |  -0.69% |    -0.69% (5.45 pp) |
| tuple/projection/8/replace.random       |          1,157.95 (26.93) |          1,152.84 (19.97) |  -0.44% |   +0.53% (10.07 pp) |
| tuple/tuple/8/replace.random            |             637.01 (9.62) |            653.63 (19.69) |  +2.61% |    +5.05% (1.79 pp) |
| tuple/projection/8/apply.replace        |          1,747.56 (88.12) |          1,706.8 (112.38) |  -2.33% |    -0.50% (8.45 pp) |
| tuple/tuple/8/apply.replace             |          1,053.87 (83.36) |            999.35 (30.47) |  -5.17% |    -7.63% (6.93 pp) |
| tuple/projection/8/apply.duplicate      |            606.65 (18.75) |            627.11 (18.15) |  +3.37% |    +3.29% (0.84 pp) |
| tuple/tuple/8/apply.duplicate           |             598.67 (19.5) |             623.8 (29.83) |  +4.20% |    +3.14% (2.43 pp) |
| tuple/projection/8/merge.duplicate      |          1,079.23 (53.72) |          1,071.68 (19.93) |  -0.70% |    -0.34% (3.47 pp) |
| tuple/tuple/8/merge.duplicate           |           1,098.81 (51.9) |           1,074.07 (63.4) |  -2.25% |     +0.02% (2.7 pp) |
| tuple/projection/8/length               |              27.32 (3.62) |              26.16 (2.18) |  -4.22% |    +3.63% (54.2 pp) |
| tuple/tuple/8/length                    |              26.76 (1.49) |               27.4 (1.63) |  +2.42% |    -2.30% (9.37 pp) |
| tuple/projection/8/value.random         |              56.24 (0.62) |              52.54 (4.25) |  -6.59% |   -7.95% (10.57 pp) |
| tuple/tuple/8/value.random              |              17.66 (1.61) |              17.83 (1.07) |  +0.92% |    -1.07% (5.71 pp) |
| tuple/projection/8/values               |             223.78 (5.09) |             219.92 (8.06) |  -1.73% |    -0.12% (3.61 pp) |
| tuple/tuple/8/values                    |             201.37 (1.11) |             197.77 (2.46) |  -1.79% |   -1.06% (13.14 pp) |
| tuple/projection/8/sequence             |             643.9 (19.22) |            665.28 (21.43) |  +3.32% |    +0.28% (9.05 pp) |
| tuple/tuple/8/sequence                  |            673.84 (34.45) |            684.18 (22.19) |  +1.53% |    +2.26% (3.49 pp) |
| tuple/projection/100/create.empty       |             443.93 (4.35) |            452.66 (13.42) |  +1.97% |    +1.13% (4.63 pp) |
| tuple/tuple/100/create.empty            |            460.09 (12.26) |             464.88 (7.44) |  +1.04% |    +2.99% (4.36 pp) |
| tuple/projection/100/create.sequence    |         13,973.88 (70.95) |         14,129.8 (386.24) |  +1.12% |    -0.46% (4.23 pp) |
| tuple/tuple/100/create.sequence         |        11,437.37 (272.94) |        11,548.07 (393.38) |  +0.97% |    -1.09% (3.92 pp) |
| tuple/projection/100/replace.random     |         1,259.23 (136.91) |          1,136.55 (64.79) |  -9.74% |    -5.77% (9.27 pp) |
| tuple/tuple/100/replace.random          |            624.53 (20.07) |             612.63 (8.23) |  -1.91% |    -3.32% (1.01 pp) |
| tuple/projection/100/apply.replace      |          1,726.62 (59.71) |          1,746.85 (58.36) |  +1.17% |    +1.17% (8.65 pp) |
| tuple/tuple/100/apply.replace           |          1,006.08 (28.52) |          1,024.84 (71.23) |  +1.86% |    -0.44% (8.98 pp) |
| tuple/projection/100/apply.duplicate    |            584.95 (12.06) |            615.92 (34.15) |  +5.29% |   +6.93% (12.88 pp) |
| tuple/tuple/100/apply.duplicate         |            593.37 (23.91) |             618.25 (6.61) |  +4.19% |    +5.17% (6.09 pp) |
| tuple/projection/100/merge.duplicate    |          9,325.1 (598.67) |         9,041.35 (501.94) |  -3.04% |    -2.90% (2.38 pp) |
| tuple/tuple/100/merge.duplicate         |        13,036.52 (167.65) |        13,234.59 (238.55) |  +1.52% |    +2.55% (4.13 pp) |
| tuple/projection/100/length             |              27.75 (2.12) |              27.82 (3.08) |  +0.27% |    +0.27% (22.2 pp) |
| tuple/tuple/100/length                  |              27.87 (1.37) |              29.11 (5.93) |  +4.47% |   -8.07% (29.76 pp) |
| tuple/projection/100/value.random       |              79.55 (4.06) |              81.32 (5.79) |  +2.23% |    +2.23% (15.5 pp) |
| tuple/tuple/100/value.random            |              18.68 (0.91) |              18.62 (0.81) |  -0.31% |    -0.31% (12.9 pp) |
| tuple/projection/100/values             |          1,801.34 (43.64) |          1,881.45 (96.11) |  +4.45% |    +2.01% (2.51 pp) |
| tuple/tuple/100/values                  |          1,540.56 (43.72) |           1,531.9 (23.46) |  -0.56% |    +0.81% (2.58 pp) |
| tuple/projection/100/sequence           |          6,440.78 (421.8) |         6,199.89 (387.91) |  -3.74% |    -5.35% (10.8 pp) |
| tuple/tuple/100/sequence                |          5,713.37 (92.37) |           5,343.8 (231.6) |  -6.47% |     -5.26% (3.7 pp) |

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
