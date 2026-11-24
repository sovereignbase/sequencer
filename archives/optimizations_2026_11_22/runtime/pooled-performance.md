# Retained runtime: ten matched pairs

10 complete matched runs per build. Before: baseline; candidate: ack-final. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 46 timing medians improve over 5%; 22 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 0%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            785.56 (69.79) |             798.95 (89.3) |  +1.71% |    +4.47% (2.46 pp) |
| throughput/1000/apply.duplicate         |            804.19 (44.54) |            817.35 (89.47) |  +1.64% |   +2.79% (13.71 pp) |
| throughput/5000/apply.duplicate         |            378.47 (20.16) |            386.09 (14.74) |  +2.01% |    +2.61% (4.11 pp) |
| throughput/10000/apply.duplicate        |            351.15 (26.39) |             343.98 (8.15) |  -2.04% |    -1.27% (3.81 pp) |
| throughput/15000/apply.duplicate        |            345.08 (13.32) |            321.81 (23.12) |  -6.74% |    -7.56% (8.37 pp) |
| throughput/20000/apply.duplicate        |            321.62 (23.71) |                312.99 (9) |  -2.68% |    -3.90% (8.19 pp) |
| throughput/25000/apply.duplicate        |             322.7 (13.03) |             320.78 (14.8) |  -0.59% |    -2.62% (7.96 pp) |
| throughput/100/apply.duplicateRemove    |          1,492.34 (95.13) |         1,512.82 (185.15) |  +1.37% |   -1.52% (10.13 pp) |
| throughput/1000/apply.duplicateRemove   |            832.76 (27.37) |           851.15 (102.56) |  +2.21% |    +2.19% (9.09 pp) |
| throughput/5000/apply.duplicateRemove   |            785.49 (30.77) |            775.19 (71.94) |  -1.31% |   -2.38% (10.22 pp) |
| throughput/10000/apply.duplicateRemove  |            713.82 (38.88) |            704.72 (55.47) |  -1.27% |     -1.20% (5.5 pp) |
| throughput/15000/apply.duplicateRemove  |            708.58 (93.04) |             706.69 (42.7) |  -0.27% |   -1.38% (13.71 pp) |
| throughput/20000/apply.duplicateRemove  |            708.85 (144.5) |            667.63 (75.68) |  -5.81% |   -7.09% (19.37 pp) |
| throughput/25000/apply.duplicateRemove  |             672.1 (33.24) |            670.79 (34.42) |  -0.19% |    +3.17% (9.36 pp) |
| throughput/100/apply.duplicateReplace   |         1,166.45 (226.84) |         1,038.22 (142.43) | -10.99% |   -2.68% (23.69 pp) |
| throughput/1000/apply.duplicateReplace  |          1,065.48 (75.82) |         1,082.18 (104.97) |  +1.57% |   +4.04% (17.15 pp) |
| throughput/5000/apply.duplicateReplace  |             978.4 (58.64) |            964.29 (95.27) |  -1.44% |   -0.61% (10.96 pp) |
| throughput/10000/apply.duplicateReplace |            905.69 (47.27) |            890.68 (44.28) |  -1.66% |    +0.19% (8.87 pp) |
| throughput/15000/apply.duplicateReplace |            862.08 (104.3) |            868.83 (53.71) |  +0.78% |   +0.74% (13.12 pp) |
| throughput/20000/apply.duplicateReplace |            839.12 (197.2) |             832.33 (42.3) |  -0.81% |   -3.14% (21.98 pp) |
| throughput/25000/apply.duplicateReplace |            824.07 (59.19) |            838.38 (59.61) |  +1.74% |    +1.92% (5.93 pp) |
| throughput/100/apply.insert             |          1,699.94 (98.74) |         1,680.32 (175.54) |  -1.15% |    -1.99% (10.4 pp) |
| throughput/1000/apply.insert            |          1,370.62 (47.53) |          1,391.99 (95.01) |  +1.56% |    +0.83% (5.57 pp) |
| throughput/5000/apply.insert            |          1,328.58 (93.49) |         1,376.65 (182.49) |  +3.62% |   +4.32% (14.62 pp) |
| throughput/10000/apply.insert           |          1,334.87 (92.87) |         1,350.59 (191.77) |  +1.18% |    +2.03% (6.44 pp) |
| throughput/15000/apply.insert           |          1,364.69 (79.98) |         1,350.29 (104.43) |  -1.06% |   +0.38% (13.54 pp) |
| throughput/20000/apply.insert           |          1,217.07 (179.3) |         1,200.11 (135.93) |  -1.39% |   -5.62% (12.52 pp) |
| throughput/25000/apply.insert           |          1,302.63 (151.8) |         1,220.65 (153.05) |  -6.29% |    -8.43% (17.7 pp) |
| throughput/100/apply.remove             |         1,917.19 (119.99) |         1,860.58 (179.26) |  -2.95% |    -0.49% (12.8 pp) |
| throughput/1000/apply.remove            |          1,501.98 (77.62) |          1,474.11 (54.03) |  -1.86% |       -1.86% (8 pp) |
| throughput/5000/apply.remove            |         1,538.85 (138.66) |          1,534.92 (74.02) |  -0.26% |    +0.46% (6.55 pp) |
| throughput/10000/apply.remove           |          1,478.44 (22.14) |          1,510.88 (92.57) |  +2.19% |    +2.65% (7.27 pp) |
| throughput/15000/apply.remove           |          1,607.92 (110.2) |          1,539.2 (171.83) |  -4.27% |    -4.38% (6.31 pp) |
| throughput/20000/apply.remove           |         1,556.81 (326.15) |          1,524.64 (60.42) |  -2.07% |   -6.75% (17.69 pp) |
| throughput/25000/apply.remove           |         1,584.24 (159.83) |          1,544.45 (38.94) |  -2.51% |   -5.11% (14.28 pp) |
| throughput/100/apply.replace            |         2,917.33 (527.95) |         2,730.53 (184.59) |  -6.40% |   -0.53% (21.01 pp) |
| throughput/1000/apply.replace           |         2,667.53 (256.69) |         2,762.16 (134.94) |  +3.55% |    +0.69% (8.22 pp) |
| throughput/5000/apply.replace           |         2,850.85 (149.43) |         2,787.82 (196.27) |  -2.21% |   -0.17% (10.11 pp) |
| throughput/10000/apply.replace          |         2,682.51 (141.77) |          2,746.18 (96.16) |  +2.37% |   +2.70% (11.42 pp) |
| throughput/15000/apply.replace          |         2,814.03 (154.44) |         2,802.65 (362.75) |  -0.40% |    -1.15% (9.66 pp) |
| throughput/20000/apply.replace          |         2,676.68 (256.28) |         2,872.88 (315.52) |  +7.33% |    +2.01% (8.02 pp) |
| throughput/25000/apply.replace          |          2,715.75 (114.5) |         2,701.78 (125.98) |  -0.51% |    +0.45% (8.25 pp) |
| throughput/100/create.empty             |            605.05 (85.37) |            552.73 (62.17) |  -8.65% |   +1.75% (20.08 pp) |
| throughput/1000/create.empty            |            705.37 (81.96) |            726.86 (76.97) |  +3.05% |   +6.86% (21.11 pp) |
| throughput/5000/create.empty            |            767.47 (64.66) |           786.73 (104.36) |  +2.51% |   +5.95% (20.91 pp) |
| throughput/10000/create.empty           |            716.76 (74.08) |            755.04 (81.51) |  +5.34% |   +3.26% (15.32 pp) |
| throughput/15000/create.empty           |            742.91 (32.53) |            772.43 (92.15) |  +3.97% |   +2.02% (11.11 pp) |
| throughput/20000/create.empty           |            726.56 (124.8) |            736.67 (60.07) |  +1.39% |   +2.83% (17.25 pp) |
| throughput/25000/create.empty           |           758.28 (108.28) |           715.92 (137.38) |  -5.59% |   -4.83% (20.11 pp) |
| throughput/100/create.sequence          |          1,716.3 (148.04) |         1,589.87 (197.06) |  -7.37% |   -4.05% (20.13 pp) |
| throughput/1000/create.sequence         |          1,865.8 (247.35) |          1,917.02 (133.3) |  +2.74% |   +4.50% (13.27 pp) |
| throughput/5000/create.sequence         |         1,637.64 (164.83) |         1,621.75 (190.18) |  -0.97% |   -1.71% (13.33 pp) |
| throughput/10000/create.sequence        |         1,751.78 (200.07) |         1,631.81 (190.93) |  -6.85% |      -3.87% (13 pp) |
| throughput/15000/create.sequence        |         1,459.46 (128.68) |         1,549.78 (191.38) |  +6.19% |   +2.95% (10.06 pp) |
| throughput/20000/create.sequence        |         1,517.94 (263.16) |          1,627.2 (156.76) |  +7.20% |   +1.47% (10.86 pp) |
| throughput/25000/create.sequence        |         1,603.86 (342.64) |         1,598.03 (178.25) |  -0.36% |   -3.02% (13.36 pp) |
| throughput/100/insert.head              |            527.44 (13.91) |            541.66 (68.98) |  +2.69% |   +0.23% (16.29 pp) |
| throughput/1000/insert.head             |             529.01 (18.8) |             534.9 (56.94) |  +1.11% |   +1.54% (10.54 pp) |
| throughput/5000/insert.head             |            546.05 (50.97) |             534.2 (38.75) |  -2.17% |   -0.96% (11.67 pp) |
| throughput/10000/insert.head            |            531.79 (33.23) |            523.86 (56.71) |  -1.49% |   -3.18% (13.71 pp) |
| throughput/15000/insert.head            |            509.59 (40.49) |            512.65 (77.04) |  +0.60% |   +4.66% (19.45 pp) |
| throughput/20000/insert.head            |            517.52 (67.31) |            497.33 (48.14) |  -3.90% |    -3.57% (6.41 pp) |
| throughput/25000/insert.head            |            478.57 (44.95) |            481.73 (42.64) |  +0.66% |   +0.40% (15.32 pp) |
| throughput/100/insert.middle            |             617.8 (61.79) |            595.97 (93.13) |  -3.53% |   -4.26% (11.63 pp) |
| throughput/1000/insert.middle           |            628.45 (12.88) |            640.24 (25.08) |  +1.87% |   +3.47% (11.16 pp) |
| throughput/5000/insert.middle           |            609.14 (49.28) |            599.43 (21.62) |  -1.59% |    -1.14% (3.66 pp) |
| throughput/10000/insert.middle          |            614.58 (68.64) |            638.46 (45.13) |  +3.89% |   -2.52% (20.66 pp) |
| throughput/15000/insert.middle          |            565.15 (24.58) |            580.41 (62.84) |  +2.70% |   +1.91% (10.07 pp) |
| throughput/20000/insert.middle          |            598.68 (20.03) |             596.5 (36.77) |  -0.36% |   -0.94% (10.02 pp) |
| throughput/25000/insert.middle          |            589.75 (58.69) |                589.5 (73) |  -0.04% |    -0.30% (4.75 pp) |
| throughput/100/insert.random            |            863.99 (75.24) |            929.22 (83.32) |  +7.55% |  +11.06% (14.91 pp) |
| throughput/1000/insert.random           |            900.98 (52.18) |            957.87 (53.84) |  +6.31% |    +6.20% (9.08 pp) |
| throughput/5000/insert.random           |            961.37 (59.26) |            901.97 (37.66) |  -6.18% |     -3.84% (9.3 pp) |
| throughput/10000/insert.random          |             909.78 (23.6) |            862.82 (56.07) |  -5.16% |    -2.79% (8.99 pp) |
| throughput/15000/insert.random          |            889.37 (26.53) |            862.12 (61.84) |  -3.06% |    -3.10% (8.56 pp) |
| throughput/20000/insert.random          |            868.49 (60.21) |            865.22 (30.04) |  -0.38% |    -2.17% (8.87 pp) |
| throughput/25000/insert.random          |               873 (83.21) |            857.2 (126.51) |  -1.81% |    -2.87% (8.58 pp) |
| throughput/100/insert.sameIndex         |             563.6 (80.34) |            560.46 (36.39) |  -0.56% |   -3.54% (11.98 pp) |
| throughput/1000/insert.sameIndex        |            579.35 (15.95) |            579.68 (30.31) |  +0.06% |    +3.01% (4.56 pp) |
| throughput/5000/insert.sameIndex        |             599.4 (83.99) |             563.75 (42.9) |  -5.95% |    -1.75% (6.28 pp) |
| throughput/10000/insert.sameIndex       |            549.31 (55.14) |            538.89 (65.02) |  -1.90% |    -2.85% (8.69 pp) |
| throughput/15000/insert.sameIndex       |            557.35 (42.07) |            564.97 (97.36) |  +1.37% |   +2.94% (20.01 pp) |
| throughput/20000/insert.sameIndex       |            583.04 (56.87) |            565.07 (43.19) |  -3.08% |    -3.18% (4.75 pp) |
| throughput/25000/insert.sameIndex       |             542.5 (58.15) |            509.17 (32.51) |  -6.14% |   -4.15% (11.13 pp) |
| throughput/100/insert.tail              |            888.16 (97.42) |            848.74 (85.24) |  -4.44% |   +0.19% (15.81 pp) |
| throughput/1000/insert.tail             |           901.33 (133.53) |           909.28 (183.59) |  +0.88% |     -0.16% (7.8 pp) |
| throughput/5000/insert.tail             |         1,008.66 (132.99) |            953.86 (64.98) |  -5.43% |    -2.57% (6.59 pp) |
| throughput/10000/insert.tail            |           853.65 (102.07) |           914.14 (151.19) |  +7.09% |   -3.35% (22.22 pp) |
| throughput/15000/insert.tail            |            775.19 (140.2) |            800.05 (93.27) |  +3.21% |    +1.45% (9.86 pp) |
| throughput/20000/insert.tail            |            894.65 (67.19) |            879.63 (36.06) |  -1.68% |    -1.74% (8.15 pp) |
| throughput/25000/insert.tail            |            910.31 (141.9) |           862.79 (149.66) |  -5.22% |    +1.76% (9.57 pp) |
| throughput/100/length                   |             122.84 (17.8) |            123.57 (15.45) |  +0.60% |   +1.58% (21.49 pp) |
| throughput/1000/length                  |             109.93 (5.04) |             111.41 (5.02) |  +1.35% |    +1.63% (6.75 pp) |
| throughput/5000/length                  |            122.62 (12.26) |             115.27 (5.47) |  -5.99% |   -5.55% (12.54 pp) |
| throughput/10000/length                 |              113.6 (7.38) |            116.97 (14.33) |  +2.97% |   +3.90% (13.75 pp) |
| throughput/15000/length                 |              108.5 (7.75) |            114.48 (10.35) |  +5.51% |    +5.22% (11.4 pp) |
| throughput/20000/length                 |             107.38 (6.74) |             114.09 (5.72) |  +6.24% |   +5.76% (19.06 pp) |
| throughput/25000/length                 |             105.62 (6.28) |            109.26 (12.57) |  +3.44% |   +4.14% (14.43 pp) |
| throughput/100/merge.duplicate          |            827.66 (86.35) |           865.09 (114.84) |  +4.52% |   +5.69% (16.41 pp) |
| throughput/1000/merge.duplicate         |            669.68 (56.89) |            669.66 (61.62) |  -0.00% |    +3.60% (9.64 pp) |
| throughput/5000/merge.duplicate         |            680.38 (85.79) |            657.06 (34.98) |  -3.43% |   -2.70% (12.24 pp) |
| throughput/10000/merge.duplicate        |            623.16 (47.09) |            629.41 (22.23) |  +1.00% |    +2.08% (7.36 pp) |
| throughput/15000/merge.duplicate        |            617.59 (55.43) |            615.41 (33.61) |  -0.35% |    -0.53% (7.92 pp) |
| throughput/20000/merge.duplicate        |            593.07 (51.01) |            633.78 (32.65) |  +6.86% |    +1.82% (4.52 pp) |
| throughput/25000/merge.duplicate        |            585.05 (60.46) |            616.79 (38.51) |  +5.43% |    +1.55% (16.5 pp) |
| throughput/100/merge.insert             |         1,833.01 (187.64) |         1,911.24 (190.81) |  +4.27% |   +2.48% (16.35 pp) |
| throughput/1000/merge.insert            |         1,539.48 (167.62) |         1,547.11 (107.66) |  +0.50% |    +1.31% (6.73 pp) |
| throughput/5000/merge.insert            |         1,557.34 (117.81) |         1,609.26 (116.94) |  +3.33% |    -2.16% (7.23 pp) |
| throughput/10000/merge.insert           |          1,571.87 (77.04) |          1,558.33 (42.43) |  -0.86% |    -0.12% (6.18 pp) |
| throughput/15000/merge.insert           |         1,460.93 (183.09) |          1,553.1 (164.01) |  +6.31% |   +8.54% (20.89 pp) |
| throughput/20000/merge.insert           |          1,528.55 (84.56) |         1,540.03 (159.59) |  +0.75% |   +6.12% (15.44 pp) |
| throughput/25000/merge.insert           |          1,402.59 (94.77) |          1,400.76 (86.83) |  -0.13% |    +0.68% (8.81 pp) |
| throughput/100/remove.head              |            742.36 (98.73) |           721.77 (143.15) |  -2.77% |    -1.84% (9.45 pp) |
| throughput/1000/remove.head             |             785.9 (56.43) |             788.4 (59.48) |  +0.32% |    +0.92% (8.53 pp) |
| throughput/5000/remove.head             |            842.28 (89.56) |            853.86 (62.66) |  +1.38% |    -1.32% (7.99 pp) |
| throughput/10000/remove.head            |           920.21 (114.26) |            892.71 (48.58) |  -2.99% |    -0.57% (8.87 pp) |
| throughput/15000/remove.head            |             907.51 (68.8) |            859.81 (74.19) |  -5.26% |    -4.59% (6.01 pp) |
| throughput/20000/remove.head            |           961.67 (106.21) |            950.77 (66.16) |  -1.13% |   -3.61% (13.06 pp) |
| throughput/25000/remove.head            |         1,012.92 (102.15) |            933.99 (46.28) |  -7.79% |    -5.15% (6.68 pp) |
| throughput/100/remove.middle            |            758.52 (77.97) |            732.48 (61.41) |  -3.43% |    -1.79% (9.12 pp) |
| throughput/1000/remove.middle           |            825.94 (80.56) |            795.94 (23.26) |  -3.63% |   -3.24% (12.81 pp) |
| throughput/5000/remove.middle           |             855.3 (61.59) |            817.32 (67.66) |  -4.44% |    -2.31% (8.74 pp) |
| throughput/10000/remove.middle          |            843.55 (68.23) |            872.12 (20.91) |  +3.39% |    +4.75% (5.08 pp) |
| throughput/15000/remove.middle          |            861.14 (31.54) |            864.08 (81.71) |  +0.34% |    +3.25% (12.5 pp) |
| throughput/20000/remove.middle          |            954.26 (59.58) |           982.13 (100.18) |  +2.92% |   -0.37% (19.57 pp) |
| throughput/25000/remove.middle          |           950.43 (107.35) |            924.02 (31.16) |  -2.78% |   -4.24% (11.32 pp) |
| throughput/100/remove.random            |            974.49 (75.65) |            947.06 (120.7) |  -2.81% |    -0.58% (6.16 pp) |
| throughput/1000/remove.random           |         1,230.86 (129.44) |          1,211.81 (68.88) |  -1.55% |    -2.90% (8.59 pp) |
| throughput/5000/remove.random           |          1,235.7 (241.54) |          1,223.47 (29.77) |  -0.99% |   -1.63% (13.53 pp) |
| throughput/10000/remove.random          |          1,258.06 (67.11) |          1,204.48 (48.77) |  -4.26% |     -2.29% (9.2 pp) |
| throughput/15000/remove.random          |          1,235.68 (74.86) |           1,184.24 (65.7) |  -4.16% |    -4.97% (7.68 pp) |
| throughput/20000/remove.random          |         1,351.59 (123.54) |         1,260.62 (147.06) |  -6.73% |    -5.11% (7.58 pp) |
| throughput/25000/remove.random          |         1,285.92 (164.87) |           1,233.72 (65.1) |  -4.06% |   -4.67% (10.48 pp) |
| throughput/100/remove.sameIndex         |           945.85 (247.84) |         1,049.31 (209.68) | +10.94% |    -1.22% (6.65 pp) |
| throughput/1000/remove.sameIndex        |            837.31 (75.17) |             819.16 (31.7) |  -2.17% |    -0.68% (8.69 pp) |
| throughput/5000/remove.sameIndex        |             851.1 (11.83) |            833.61 (57.41) |  -2.06% |    -1.43% (7.51 pp) |
| throughput/10000/remove.sameIndex       |            855.48 (91.97) |            879.58 (53.43) |  +2.82% |   +1.81% (11.15 pp) |
| throughput/15000/remove.sameIndex       |            922.04 (78.74) |            840.65 (87.47) |  -8.83% |   -2.45% (13.28 pp) |
| throughput/20000/remove.sameIndex       |            956.86 (93.06) |            956.75 (75.56) |  -0.01% |    -0.59% (4.76 pp) |
| throughput/25000/remove.sameIndex       |            980.86 (84.97) |            927.31 (74.43) |  -5.46% |     -2.20% (9.3 pp) |
| throughput/100/remove.tail              |           703.49 (128.19) |            727.05 (88.79) |  +3.35% |   -1.52% (16.72 pp) |
| throughput/1000/remove.tail             |            737.34 (52.04) |            721.12 (22.63) |  -2.20% |     -0.05% (7.2 pp) |
| throughput/5000/remove.tail             |            758.36 (76.64) |            744.02 (51.92) |  -1.89% |    -3.10% (12.4 pp) |
| throughput/10000/remove.tail            |             795.98 (62.4) |            784.15 (34.61) |  -1.49% |    -2.11% (8.28 pp) |
| throughput/15000/remove.tail            |            760.79 (53.13) |           784.39 (105.21) |  +3.10% |    +8.98% (14.8 pp) |
| throughput/20000/remove.tail            |           908.23 (197.46) |            862.57 (71.64) |  -5.03% |   -7.82% (21.78 pp) |
| throughput/25000/remove.tail            |             828.2 (49.71) |            846.46 (59.31) |  +2.21% |    +1.80% (8.26 pp) |
| throughput/100/replace.head             |         1,062.56 (118.97) |           1,051.31 (98.5) |  -1.06% |   -4.44% (18.13 pp) |
| throughput/1000/replace.head            |          1,207.85 (42.24) |          1,167.02 (58.99) |  -3.38% |    -0.94% (4.96 pp) |
| throughput/5000/replace.head            |          1,164.23 (49.29) |           1,157.5 (45.57) |  -0.58% |    -0.86% (5.87 pp) |
| throughput/10000/replace.head           |           1,188.15 (68.8) |         1,225.38 (103.27) |  +3.13% |   +2.29% (10.57 pp) |
| throughput/15000/replace.head           |          1,168.59 (67.68) |          1,158.36 (51.87) |  -0.88% |     -1.36% (6.1 pp) |
| throughput/20000/replace.head           |         1,273.19 (126.63) |         1,278.75 (356.43) |  +0.44% |   +0.06% (27.76 pp) |
| throughput/25000/replace.head           |         1,223.69 (112.18) |           1,188.82 (50.6) |  -2.85% |   -3.24% (10.29 pp) |
| throughput/100/replace.middle           |          1,101.2 (123.65) |           1,056.3 (39.31) |  -4.08% |    -4.89% (7.39 pp) |
| throughput/1000/replace.middle          |         1,267.56 (113.72) |          1,215.43 (31.66) |  -4.11% |    -1.28% (9.34 pp) |
| throughput/5000/replace.middle          |          1,192.77 (46.13) |          1,197.91 (53.98) |  +0.43% |    +2.03% (6.13 pp) |
| throughput/10000/replace.middle         |          1,209.35 (56.44) |          1,232.94 (83.92) |  +1.95% |    +1.56% (9.81 pp) |
| throughput/15000/replace.middle         |         1,202.21 (166.05) |           1,233.85 (98.7) |  +2.63% |   -1.52% (10.11 pp) |
| throughput/20000/replace.middle         |          1,336.48 (81.14) |           1,280.3 (85.29) |  -4.20% |    -4.24% (7.24 pp) |
| throughput/25000/replace.middle         |          1,284.91 (59.18) |         1,265.11 (166.25) |  -1.54% |   -0.70% (13.72 pp) |
| throughput/100/replace.random           |          1,650.12 (236.3) |          1,606.57 (88.32) |  -2.64% |   -3.61% (12.62 pp) |
| throughput/1000/replace.random          |           1,844.8 (95.85) |         1,812.71 (140.48) |  -1.74% |    -0.55% (7.91 pp) |
| throughput/5000/replace.random          |         1,798.44 (113.87) |          1,764.97 (88.28) |  -1.86% |    -1.71% (1.63 pp) |
| throughput/10000/replace.random         |         1,800.53 (116.12) |          1,796.03 (92.56) |  -0.25% |    -2.74% (9.47 pp) |
| throughput/15000/replace.random         |         1,733.46 (182.08) |         1,803.75 (128.62) |  +4.05% |    -0.33% (7.05 pp) |
| throughput/20000/replace.random         |         1,767.82 (161.77) |         1,864.13 (247.16) |  +5.45% |   +3.27% (11.99 pp) |
| throughput/25000/replace.random         |         1,787.49 (144.22) |         1,806.24 (112.24) |  +1.05% |    -0.60% (12.6 pp) |
| throughput/100/replace.sameIndex        |         1,055.59 (129.82) |          1,038.37 (89.11) |  -1.63% |    -1.12% (9.75 pp) |
| throughput/1000/replace.sameIndex       |          1,229.39 (85.48) |          1,152.78 (56.68) |  -6.23% |    -3.20% (4.62 pp) |
| throughput/5000/replace.sameIndex       |             1,160 (67.88) |          1,174.98 (34.97) |  +1.29% |   -0.32% (11.03 pp) |
| throughput/10000/replace.sameIndex      |          1,173.07 (81.85) |          1,192.94 (58.67) |  +1.69% |    +2.04% (9.87 pp) |
| throughput/15000/replace.sameIndex      |         1,138.75 (115.39) |          1,125.28 (30.18) |  -1.18% |   -2.10% (11.15 pp) |
| throughput/20000/replace.sameIndex      |           1,248.88 (66.8) |         1,188.71 (118.26) |  -4.82% |   -3.54% (10.16 pp) |
| throughput/25000/replace.sameIndex      |          1,201.6 (113.68) |          1,183.32 (82.41) |  -1.52% |   +0.03% (12.97 pp) |
| throughput/100/replace.tail             |         1,059.89 (171.31) |          1,030.53 (72.35) |  -2.77% |    -2.26% (5.09 pp) |
| throughput/1000/replace.tail            |          1,247.28 (50.49) |          1,193.26 (25.68) |  -4.33% |    -5.54% (7.33 pp) |
| throughput/5000/replace.tail            |          1,160.92 (29.11) |          1,181.07 (77.74) |  +1.74% |    +2.41% (7.02 pp) |
| throughput/10000/replace.tail           |          1,209.76 (80.27) |          1,182.28 (94.68) |  -2.27% |    -1.78% (9.59 pp) |
| throughput/15000/replace.tail           |             1,190 (64.23) |         1,189.17 (158.88) |  -0.07% |    -0.25% (17.2 pp) |
| throughput/20000/replace.tail           |          1,284.1 (135.22) |          1,227.27 (76.16) |  -4.43% |   -4.01% (10.16 pp) |
| throughput/25000/replace.tail           |          1,266.31 (89.72) |          1,226.03 (70.78) |  -3.18% |   +1.03% (12.44 pp) |
| throughput/100/retire                   |               202.18 (40) |            176.15 (38.08) | -12.87% |   -8.40% (31.93 pp) |
| throughput/1000/retire                  |             218.44 (4.97) |             216.32 (3.65) |  -0.97% |    -1.86% (6.18 pp) |
| throughput/5000/retire                  |            205.21 (13.62) |             206.71 (15.3) |  +0.73% |   -0.95% (12.46 pp) |
| throughput/10000/retire                 |             198.56 (9.13) |            203.68 (22.17) |  +2.58% |    +0.41% (7.84 pp) |
| throughput/15000/retire                 |               198.45 (23) |             193.57 (3.27) |  -2.46% |   -4.07% (12.59 pp) |
| throughput/20000/retire                 |             199.63 (8.03) |             191.4 (15.38) |  -4.13% |   -4.80% (10.91 pp) |
| throughput/25000/retire                 |             195.27 (4.63) |             189.29 (9.75) |  -3.06% |    -1.66% (3.08 pp) |
| throughput/100/sequence                 |            284.15 (75.47) |             301.05 (61.4) |  +5.95% |    +6.16% (6.83 pp) |
| throughput/1000/sequence                |            313.66 (21.08) |             304.72 (9.54) |  -2.85% |    -3.65% (7.85 pp) |
| throughput/5000/sequence                |             279.19 (9.78) |            283.28 (17.75) |  +1.47% |    +2.67% (8.42 pp) |
| throughput/10000/sequence               |            274.69 (17.42) |            269.86 (13.28) |  -1.76% |   -2.19% (10.69 pp) |
| throughput/15000/sequence               |              262.07 (4.8) |             262.66 (7.65) |  +0.22% |    +0.89% (6.78 pp) |
| throughput/20000/sequence               |            257.17 (12.29) |             246.08 (7.59) |  -4.32% |     -3.65% (4.6 pp) |
| throughput/25000/sequence               |             255.09 (9.08) |            261.88 (19.39) |  +2.66% |    +3.36% (8.49 pp) |
| throughput/100/value.head               |            182.92 (29.23) |             177.33 (31.8) |  -3.05% |   +3.53% (16.95 pp) |
| throughput/1000/value.head              |            169.75 (12.85) |             165.15 (6.75) |  -2.71% |    -1.34% (5.96 pp) |
| throughput/5000/value.head              |            149.86 (10.25) |            147.55 (11.66) |  -1.54% |    -2.05% (8.51 pp) |
| throughput/10000/value.head             |             141.59 (5.21) |             145.11 (6.23) |  +2.48% |    +0.96% (3.39 pp) |
| throughput/15000/value.head             |            139.39 (10.31) |             139.07 (8.29) |  -0.23% |    -0.79% (9.44 pp) |
| throughput/20000/value.head             |             137.03 (5.37) |              136.2 (7.91) |  -0.61% |    -0.06% (8.28 pp) |
| throughput/25000/value.head             |             134.58 (9.45) |             130.89 (8.88) |  -2.74% |    -3.65% (8.47 pp) |
| throughput/100/value.middle             |            244.48 (50.59) |             239.25 (64.6) |  -2.14% |   +6.66% (24.95 pp) |
| throughput/1000/value.middle            |            259.09 (15.93) |             251.9 (10.33) |  -2.78% |       -3.32% (8 pp) |
| throughput/5000/value.middle            |             224.64 (14.2) |            230.02 (11.73) |  +2.39% |   +2.10% (10.87 pp) |
| throughput/10000/value.middle           |            221.77 (17.74) |             222.92 (5.38) |  +0.52% |   -0.08% (10.31 pp) |
| throughput/15000/value.middle           |            214.99 (25.79) |            218.48 (20.32) |  +1.62% |     +1.83% (9.9 pp) |
| throughput/20000/value.middle           |             214.92 (12.7) |             211.93 (8.56) |  -1.39% |    -0.89% (6.47 pp) |
| throughput/25000/value.middle           |               217 (25.81) |            210.51 (12.81) |  -2.99% |    -2.83% (8.25 pp) |
| throughput/100/value.random             |             196.54 (45.5) |            216.61 (27.46) | +10.21% |   +8.59% (25.67 pp) |
| throughput/1000/value.random            |            245.31 (35.71) |             224.98 (7.06) |  -8.29% |    -6.65% (9.91 pp) |
| throughput/5000/value.random            |            272.34 (18.21) |             266.2 (24.91) |  -2.25% |   -0.49% (11.59 pp) |
| throughput/10000/value.random           |             277.16 (16.9) |            280.35 (18.56) |  +1.15% |   +4.89% (13.87 pp) |
| throughput/15000/value.random           |            269.19 (20.11) |            263.65 (29.14) |  -2.06% |    -2.64% (12.5 pp) |
| throughput/20000/value.random           |            281.16 (25.11) |             284.2 (18.81) |  +1.08% |    -0.77% (7.81 pp) |
| throughput/25000/value.random           |            268.13 (15.65) |             267.1 (23.03) |  -0.39% |    -2.68% (14.4 pp) |
| throughput/100/value.sameIndex          |            182.58 (32.11) |            180.38 (38.16) |  -1.21% |   +3.28% (21.72 pp) |
| throughput/1000/value.sameIndex         |            187.02 (16.47) |             184.53 (6.43) |  -1.33% |   -2.23% (23.21 pp) |
| throughput/5000/value.sameIndex         |            174.96 (12.68) |            173.93 (14.15) |  -0.59% |   -1.03% (11.01 pp) |
| throughput/10000/value.sameIndex        |            174.88 (34.47) |            172.98 (14.64) |  -1.09% |   +1.91% (26.28 pp) |
| throughput/15000/value.sameIndex        |            161.29 (13.87) |            176.67 (56.77) |  +9.54% |    +9.97% (36.6 pp) |
| throughput/20000/value.sameIndex        |             165.6 (15.44) |            165.17 (53.35) |  -0.26% |   +1.21% (14.69 pp) |
| throughput/25000/value.sameIndex        |            159.28 (21.16) |            157.62 (25.69) |  -1.04% |   +2.59% (15.31 pp) |
| throughput/100/value.tail               |            243.62 (31.76) |             259.3 (81.46) |  +6.44% |  +12.63% (19.18 pp) |
| throughput/1000/value.tail              |            222.12 (16.73) |            224.48 (12.35) |  +1.06% |    -1.27% (9.06 pp) |
| throughput/5000/value.tail              |            200.43 (13.54) |            195.39 (10.58) |  -2.51% |    -1.36% (6.53 pp) |
| throughput/10000/value.tail             |             193.86 (14.3) |            192.67 (10.53) |  -0.62% |   +0.54% (13.85 pp) |
| throughput/15000/value.tail             |             186.8 (10.09) |            186.18 (15.01) |  -0.33% |    -2.46% (4.59 pp) |
| throughput/20000/value.tail             |             179.33 (8.82) |            186.87 (11.48) |  +4.20% |    +4.07% (6.35 pp) |
| throughput/25000/value.tail             |            187.31 (68.48) |            178.92 (36.84) |  -4.48% |   -7.28% (16.95 pp) |
| throughput/100/values                   |          4,585.4 (332.31) |          5,212.8 (700.44) | +13.68% |  +14.11% (11.74 pp) |
| throughput/1000/values                  |    163,351.25 (13,611.86) |     163,076.88 (4,242.54) |  -0.17% |    -1.73% (5.02 pp) |
| throughput/5000/values                  |    545,158.85 (37,267.32) |     542,287.5 (58,934.15) |  -0.53% |    -0.48% (5.86 pp) |
| throughput/10000/values                 |  1,193,006.25 (69,440.82) | 1,175,428.91 (116,644.92) |  -1.47% |    -0.41% (18.7 pp) |
| throughput/15000/values                 | 1,822,246.88 (159,912.89) | 1,845,100.78 (105,792.58) |  +1.25% |   +5.27% (12.24 pp) |
| throughput/20000/values                 | 2,625,160.94 (245,859.77) | 2,546,761.72 (236,891.02) |  -2.99% |    -1.80% (9.52 pp) |
| throughput/25000/values                 | 3,386,243.75 (308,901.56) | 3,283,524.22 (404,555.47) |  -3.03% |   -3.52% (13.03 pp) |
| throughput/100/values.head              |              318.9 (43.8) |            309.17 (51.63) |  -3.05% |   +2.47% (10.55 pp) |
| throughput/1000/values.head             |            276.01 (22.81) |            269.19 (31.06) |  -2.47% |   -4.01% (12.34 pp) |
| throughput/5000/values.head             |            286.72 (45.93) |            277.33 (15.62) |  -3.28% |   -2.07% (11.43 pp) |
| throughput/10000/values.head            |            279.73 (48.05) |            283.55 (32.13) |  +1.37% |   -4.30% (25.33 pp) |
| throughput/15000/values.head            |            273.03 (28.84) |            262.28 (28.66) |  -3.94% |    -1.24% (9.21 pp) |
| throughput/20000/values.head            |            264.63 (26.43) |             275.8 (16.11) |  +4.22% |   +0.60% (16.65 pp) |
| throughput/25000/values.head            |            262.91 (53.83) |            283.75 (40.23) |  +7.92% |   -0.64% (15.45 pp) |
| throughput/100/values.middle            |            313.03 (17.95) |               297.18 (45) |  -5.06% |   -1.49% (12.92 pp) |
| throughput/1000/values.middle           |            274.29 (32.92) |            272.02 (18.24) |  -0.83% |   -2.61% (16.86 pp) |
| throughput/5000/values.middle           |            283.73 (38.92) |            268.26 (17.05) |  -5.45% |   -1.48% (11.29 pp) |
| throughput/10000/values.middle          |             288.3 (27.98) |            279.66 (48.35) |  -3.00% |    -2.30% (16.4 pp) |
| throughput/15000/values.middle          |            244.06 (11.55) |            245.48 (23.26) |  +0.58% |   -0.27% (13.61 pp) |
| throughput/20000/values.middle          |            269.94 (22.49) |             262.34 (31.9) |  -2.82% |    -4.40% (17.6 pp) |
| throughput/25000/values.middle          |            248.61 (30.81) |            249.09 (25.29) |  +0.20% |   +5.39% (15.15 pp) |
| throughput/100/values.random            |            302.44 (55.74) |            317.55 (36.07) |  +5.00% |   +2.57% (10.62 pp) |
| throughput/1000/values.random           |             299.32 (6.35) |            301.34 (15.04) |  +0.68% |    +1.12% (4.32 pp) |
| throughput/5000/values.random           |            334.62 (51.91) |            333.54 (33.87) |  -0.32% |   -2.82% (20.99 pp) |
| throughput/10000/values.random          |           437.15 (110.58) |             387.19 (34.3) | -11.43% |    -4.34% (15.5 pp) |
| throughput/15000/values.random          |            375.49 (67.63) |             372.1 (41.29) |  -0.90% |   -1.05% (25.03 pp) |
| throughput/20000/values.random          |            405.85 (16.01) |             409.93 (40.6) |  +1.01% |    -0.91% (5.84 pp) |
| throughput/25000/values.random          |            396.83 (42.92) |           376.51 (101.43) |  -5.12% |    -3.88% (13.7 pp) |
| throughput/100/values.sameIndex         |            295.23 (28.11) |            296.79 (33.04) |  +0.53% |    -0.34% (7.85 pp) |
| throughput/1000/values.sameIndex        |                272 (24.2) |             271.96 (13.9) |  -0.01% |    -1.90% (10.1 pp) |
| throughput/5000/values.sameIndex        |            279.37 (54.79) |            265.11 (27.42) |  -5.10% |   -4.00% (27.15 pp) |
| throughput/10000/values.sameIndex       |            273.47 (46.53) |            252.69 (20.88) |  -7.60% |   -7.95% (24.16 pp) |
| throughput/15000/values.sameIndex       |            242.58 (17.88) |            236.41 (13.32) |  -2.55% |   -3.41% (12.65 pp) |
| throughput/20000/values.sameIndex       |            283.35 (19.39) |            263.91 (52.58) |  -6.86% |   -8.85% (20.43 pp) |
| throughput/25000/values.sameIndex       |            250.33 (16.57) |            234.89 (35.37) |  -6.17% |   -1.27% (10.78 pp) |
| throughput/100/values.tail              |            294.21 (27.82) |            301.26 (36.99) |  +2.39% |    +2.37% (6.04 pp) |
| throughput/1000/values.tail             |            277.46 (16.45) |             264.73 (7.45) |  -4.59% |    -4.95% (5.52 pp) |
| throughput/5000/values.tail             |            279.82 (31.52) |             251.26 (5.44) | -10.21% |  -10.16% (10.52 pp) |
| throughput/10000/values.tail            |             265.51 (61.3) |            262.75 (52.88) |  -1.04% |   +2.52% (31.87 pp) |
| throughput/15000/values.tail            |            261.66 (69.78) |            237.36 (44.06) |  -9.29% |   -2.94% (23.64 pp) |
| throughput/20000/values.tail            |            257.68 (49.78) |            243.17 (20.12) |  -5.63% |   -1.09% (25.86 pp) |
| throughput/25000/values.tail            |            232.27 (17.97) |            246.96 (43.89) |  +6.33% |   +0.46% (18.06 pp) |
| lifecycle/scaleUp/apply.random          |         4,167.73 (413.95) |         3,933.52 (311.98) |  -5.62% |    -1.31% (10.7 pp) |
| lifecycle/scaleUp/insert.head           |           848.65 (112.92) |            826.83 (69.57) |  -2.57% |    -3.49% (12.4 pp) |
| lifecycle/scaleUp/insert.random         |         1,877.81 (313.21) |         1,774.22 (163.57) |  -5.52% |   -7.27% (16.43 pp) |
| lifecycle/scaleUp/insert.tail           |           780.53 (145.53) |           800.83 (108.74) |  +2.60% |    -1.17% (7.88 pp) |
| lifecycle/scaleUp/remove.random         |         2,804.95 (533.98) |         2,821.81 (335.52) |  +0.60% |    -0.81% (15.6 pp) |
| lifecycle/scaleUp/replace.head          |          2,476.69 (391.7) |         2,480.84 (286.76) |  +0.17% |   +1.49% (11.91 pp) |
| lifecycle/scaleUp/replace.random        |          3,746.37 (383.7) |         3,507.03 (205.06) |  -6.39% |   -7.99% (20.59 pp) |
| lifecycle/scaleUp/replace.tail          |         2,402.45 (292.94) |         2,313.19 (238.34) |  -3.72% |      -2.57% (10 pp) |
| lifecycle/scaleUp/value.head            |             334.21 (39.2) |             324.2 (14.63) |  -3.00% |   +2.66% (11.14 pp) |
| lifecycle/scaleUp/value.random          |            1,121.3 (72.3) |          1,128.07 (28.54) |  +0.60% |    -0.41% (6.25 pp) |
| lifecycle/scaleUp/value.tail            |             156.67 (7.72) |             155.76 (4.85) |  -0.58% |    -3.25% (6.74 pp) |
| lifecycle/scaleDown/apply.random        |         3,554.97 (108.43) |         3,464.95 (136.12) |  -2.53% |    -2.27% (4.33 pp) |
| lifecycle/scaleDown/insert.random       |          1,702.01 (37.72) |          1,704.91 (48.05) |  +0.17% |    +0.09% (4.08 pp) |
| lifecycle/scaleDown/remove.head         |         1,939.21 (153.63) |          1,900.58 (48.28) |  -1.99% |    -0.44% (8.62 pp) |
| lifecycle/scaleDown/remove.random       |         2,715.69 (170.63) |          2,660.19 (39.42) |  -2.04% |    -1.63% (5.36 pp) |
| lifecycle/scaleDown/remove.tail         |         1,747.23 (153.54) |          1,706.06 (51.55) |  -2.36% |    -1.74% (9.74 pp) |
| lifecycle/scaleDown/replace.head        |         2,669.16 (288.74) |           2,486.3 (75.87) |  -6.85% |    -4.25% (5.98 pp) |
| lifecycle/scaleDown/replace.random      |         3,318.15 (243.24) |          3,374.9 (415.45) |  +1.71% |    -1.02% (4.89 pp) |
| lifecycle/scaleDown/replace.tail        |      19,384.03 (1,034.93) |        19,108.24 (634.95) |  -1.42% |    +0.21% (9.67 pp) |
| lifecycle/scaleDown/value.head          |            418.02 (11.85) |             416.68 (7.15) |  -0.32% |    +0.39% (2.66 pp) |
| lifecycle/scaleDown/value.random        |          1,067.54 (26.65) |          1,065.01 (19.96) |  -0.24% |     +0.20% (3.6 pp) |
| lifecycle/scaleDown/value.tail          |             232.81 (4.69) |             231.75 (8.94) |  -0.45% |    +0.28% (3.71 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,868.74 (192.11) |          3,762.65 (134.3) |  -2.74% |    -1.16% (3.04 pp) |
| lifecycle/fullLifecycle/insert.head     |           848.65 (112.92) |            826.83 (69.57) |  -2.57% |    -3.49% (12.4 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,833.56 (138.51) |           1,748.8 (69.65) |  -4.62% |    -4.27% (8.76 pp) |
| lifecycle/fullLifecycle/insert.tail     |           780.53 (145.53) |           800.83 (108.74) |  +2.60% |    -1.17% (7.88 pp) |
| lifecycle/fullLifecycle/remove.head     |         1,939.21 (153.63) |          1,900.58 (48.28) |  -1.99% |    -0.44% (8.62 pp) |
| lifecycle/fullLifecycle/remove.random   |          2,758.6 (218.79) |             2,761.2 (231) |  +0.09% |    -3.12% (7.77 pp) |
| lifecycle/fullLifecycle/remove.tail     |         1,747.23 (153.54) |          1,706.06 (51.55) |  -2.36% |    -1.74% (9.74 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,651.48 (193.49) |         2,513.49 (217.97) |  -5.20% |    -1.07% (9.01 pp) |
| lifecycle/fullLifecycle/replace.random  |         3,554.48 (200.87) |         3,482.65 (334.49) |  -2.02% |    -3.54% (8.63 pp) |
| lifecycle/fullLifecycle/replace.tail    |        10,926.11 (846.19) |         10,719.9 (349.99) |  -1.89% |    -0.51% (8.51 pp) |
| lifecycle/fullLifecycle/value.head      |            378.74 (20.22) |            369.41 (14.15) |  -2.46% |    -0.89% (6.01 pp) |
| lifecycle/fullLifecycle/value.random    |          1,101.16 (65.38) |          1,099.92 (11.93) |  -0.11% |    -0.84% (2.27 pp) |
| lifecycle/fullLifecycle/value.tail      |             197.57 (5.26) |             193.53 (7.04) |  -2.04% |    -1.60% (3.14 pp) |
| checkpoint/up/1000/create               |          405,150 (82,125) |          424,100 (51,000) |  +4.68% |   -1.49% (13.73 pp) |
| checkpoint/up/1000/sequence             |       2,837,750 (345,075) |       2,684,400 (272,300) |  -5.40% |   -3.10% (15.36 pp) |
| checkpoint/up/1000/values               |       1,931,100 (223,050) |       1,800,050 (166,650) |  -6.79% |   -4.54% (13.09 pp) |
| checkpoint/up/5000/create               |         909,050 (439,050) |          897,150 (31,125) |  -1.31% |   -3.35% (29.46 pp) |
| checkpoint/up/5000/sequence             |     7,858,400 (1,825,750) |       7,972,950 (719,550) |  +1.46% |   -0.85% (29.31 pp) |
| checkpoint/up/5000/values               |       5,268,050 (490,775) |       5,134,100 (342,450) |  -2.54% |   -1.37% (15.43 pp) |
| checkpoint/up/10000/create              |       1,627,100 (109,975) |        1,618,900 (67,275) |  -0.50% |    -1.82% (8.48 pp) |
| checkpoint/up/10000/sequence            |    14,034,650 (2,630,050) |      13,393,650 (826,150) |  -4.57% |   -4.78% (22.21 pp) |
| checkpoint/up/10000/values              |    20,721,950 (2,834,225) |      20,213,800 (435,425) |  -2.45% |   -2.04% (16.24 pp) |
| checkpoint/up/15000/create              |       2,591,850 (511,475) |        2,394,900 (89,400) |  -7.60% |   -5.06% (15.47 pp) |
| checkpoint/up/15000/sequence            |    15,450,500 (1,741,575) |    14,822,250 (1,145,800) |  -4.07% |    -2.88% (13.1 pp) |
| checkpoint/up/15000/values              |    30,329,200 (1,010,175) |      29,767,150 (532,275) |  -1.85% |    -2.87% (4.33 pp) |
| checkpoint/up/20000/create              |       3,424,150 (193,350) |        3,383,000 (39,200) |  -1.20% |    -1.64% (7.66 pp) |
| checkpoint/up/20000/sequence            |      21,459,950 (543,525) |    22,311,950 (1,181,525) |  +3.97% |    +2.79% (7.01 pp) |
| checkpoint/up/20000/values              |      11,296,650 (751,875) |    11,288,200 (1,193,050) |  -0.07% |    +4.21% (12.6 pp) |
| checkpoint/up/25000/create              |       3,996,600 (155,950) |       4,045,550 (112,550) |  +1.22% |    +1.53% (6.15 pp) |
| checkpoint/up/25000/sequence            |      23,899,150 (967,775) |    24,069,400 (1,250,650) |  +0.71% |    +0.15% (6.62 pp) |
| checkpoint/up/25000/values              |      12,077,350 (695,075) |      12,204,300 (764,000) |  +1.05% |    -0.36% (7.57 pp) |
| checkpoint/down/20000/create            |       3,441,550 (156,375) |       3,431,200 (119,525) |  -0.30% |    +0.41% (6.64 pp) |
| checkpoint/down/20000/sequence          |      19,323,500 (738,950) |      19,106,600 (661,625) |  -1.12% |    -0.27% (7.88 pp) |
| checkpoint/down/20000/values            |       9,351,650 (279,750) |       9,179,000 (521,825) |  -1.85% |    -5.82% (9.12 pp) |
| checkpoint/down/15000/create            |        2,449,850 (72,750) |       2,448,350 (128,875) |  -0.06% |    -2.49% (7.05 pp) |
| checkpoint/down/15000/sequence          |      15,655,100 (535,275) |      15,690,750 (103,275) |  +0.23% |    -0.65% (3.28 pp) |
| checkpoint/down/15000/values            |       7,023,700 (451,850) |       7,162,750 (363,075) |  +1.98% |   +1.58% (11.31 pp) |
| checkpoint/down/10000/create            |       1,734,900 (112,575) |        1,677,800 (42,475) |  -3.29% |    -3.08% (6.61 pp) |
| checkpoint/down/10000/sequence          |      12,786,950 (770,650) |      12,896,850 (909,900) |  +0.86% |    -0.60% (7.47 pp) |
| checkpoint/down/10000/values            |       5,776,900 (264,825) |       5,667,200 (566,525) |  -1.90% |    -2.91% (8.91 pp) |
| checkpoint/down/5000/create             |          803,350 (45,525) |          802,350 (23,050) |  -0.12% |    -0.95% (7.73 pp) |
| checkpoint/down/5000/sequence           |       9,691,350 (623,475) |     9,900,250 (1,437,425) |  +2.16% |   +0.16% (18.47 pp) |
| checkpoint/down/5000/values             |       2,945,400 (657,950) |       2,818,150 (575,275) |  -4.32% |   +0.55% (25.11 pp) |
| checkpoint/down/1000/create             |          159,200 (28,975) |           162,950 (4,825) |  +2.36% |   -0.68% (16.54 pp) |
| checkpoint/down/1000/sequence           |     6,669,450 (1,420,025) |       6,535,700 (946,000) |  -2.01% |   -5.73% (27.29 pp) |
| checkpoint/down/1000/values             |         574,800 (174,700) |          527,250 (67,025) |  -8.27% |   -3.49% (32.86 pp) |
| checkpoint/down/0/create                |            15,350 (1,775) |            15,850 (7,375) |  +3.26% |   -3.68% (70.26 pp) |
| checkpoint/down/0/sequence              |       1,340,850 (271,800) |       1,380,750 (188,950) |  +2.98% |   +1.59% (24.85 pp) |
| checkpoint/down/0/values                |            10,850 (1,475) |            10,500 (1,325) |  -3.23% |   +0.51% (28.85 pp) |
| tuple/projection/2/create.empty         |            344.96 (36.44) |            354.17 (22.59) |  +2.67% |    +1.02% (6.93 pp) |
| tuple/tuple/2/create.empty              |            437.07 (17.63) |            430.48 (23.18) |  -1.51% |     -0.52% (4.3 pp) |
| tuple/projection/2/create.sequence      |          1,191.44 (43.66) |          1,225.04 (77.33) |  +2.82% |    +3.62% (7.57 pp) |
| tuple/tuple/2/create.sequence           |           1,385.6 (59.54) |         1,385.44 (112.29) |  -0.01% |    -0.14% (6.99 pp) |
| tuple/projection/2/replace.random       |          1,058.76 (69.53) |          1,039.44 (57.96) |  -1.83% |    -3.98% (2.56 pp) |
| tuple/tuple/2/replace.random            |            693.78 (24.54) |             721.2 (26.28) |  +3.95% |    +3.38% (5.45 pp) |
| tuple/projection/2/apply.replace        |         1,713.48 (155.11) |          1,791.17 (54.17) |  +4.53% |   +1.44% (10.93 pp) |
| tuple/tuple/2/apply.replace             |          1,196.96 (54.61) |          1,201.78 (58.37) |  +0.40% |    +0.07% (5.83 pp) |
| tuple/projection/2/apply.duplicate      |            609.99 (39.29) |             645.12 (50.6) |  +5.76% |   +4.94% (12.27 pp) |
| tuple/tuple/2/apply.duplicate           |            622.74 (21.69) |            636.92 (22.99) |  +2.28% |    +1.60% (4.81 pp) |
| tuple/projection/2/merge.duplicate      |            682.06 (42.87) |            662.04 (54.66) |  -2.94% |    -4.78% (7.64 pp) |
| tuple/tuple/2/merge.duplicate           |            680.57 (53.78) |             650.01 (45.9) |  -4.49% |    -4.31% (8.73 pp) |
| tuple/projection/2/length               |               7.59 (0.27) |                7.58 (0.4) |  -0.15% |    +0.04% (2.93 pp) |
| tuple/tuple/2/length                    |                7.36 (0.2) |               7.62 (0.57) |  +3.54% |    +3.71% (4.47 pp) |
| tuple/projection/2/value.random         |              29.74 (1.44) |              30.92 (1.55) |  +3.98% |    +4.51% (9.63 pp) |
| tuple/tuple/2/value.random              |               18.62 (1.1) |              18.96 (0.82) |  +1.82% |   +2.65% (10.11 pp) |
| tuple/projection/2/values               |              77.69 (2.34) |              82.19 (8.46) |  +5.79% |     +4.20% (6.6 pp) |
| tuple/tuple/2/values                    |               79.6 (1.81) |              81.65 (2.21) |  +2.57% |    +2.14% (2.55 pp) |
| tuple/projection/2/sequence             |            458.19 (62.33) |            454.33 (10.26) |  -0.84% |   +0.61% (15.03 pp) |
| tuple/tuple/2/sequence                  |            488.81 (35.07) |            496.58 (77.88) |  +1.59% |   +1.17% (17.01 pp) |
| tuple/projection/4/create.empty         |            419.71 (14.94) |            418.61 (14.11) |  -0.26% |    +0.75% (5.99 pp) |
| tuple/tuple/4/create.empty              |            439.82 (71.01) |            439.04 (30.23) |  -0.18% |   -0.87% (15.57 pp) |
| tuple/projection/4/create.sequence      |          1,638.52 (161.2) |          1,622.35 (92.83) |  -0.99% |    +0.36% (9.86 pp) |
| tuple/tuple/4/create.sequence           |           1,568.2 (47.29) |          1,590.45 (31.76) |  +1.42% |    +2.01% (4.34 pp) |
| tuple/projection/4/replace.random       |           1,214.5 (124.6) |          1,132.41 (37.72) |  -6.76% |    -5.80% (8.84 pp) |
| tuple/tuple/4/replace.random            |            652.53 (20.11) |            654.52 (57.22) |  +0.31% |   +1.56% (14.43 pp) |
| tuple/projection/4/apply.replace        |         1,737.94 (163.66) |          1,724.05 (58.29) |  -0.80% |    -3.00% (6.58 pp) |
| tuple/tuple/4/apply.replace             |          1,127.58 (57.79) |          1,090.39 (34.39) |  -3.30% |    -1.19% (8.39 pp) |
| tuple/projection/4/apply.duplicate      |            584.88 (24.39) |            595.74 (26.86) |  +1.86% |    -0.56% (6.22 pp) |
| tuple/tuple/4/apply.duplicate           |            607.42 (28.69) |             613.98 (15.1) |  +1.08% |    +0.29% (7.86 pp) |
| tuple/projection/4/merge.duplicate      |            773.65 (59.92) |            755.15 (45.74) |  -2.39% |   -2.18% (12.08 pp) |
| tuple/tuple/4/merge.duplicate           |            819.53 (71.97) |            788.32 (25.23) |  -3.81% |   -5.79% (11.53 pp) |
| tuple/projection/4/length               |               26.8 (2.49) |              26.85 (1.72) |  +0.16% |   -2.86% (26.08 pp) |
| tuple/tuple/4/length                    |                 26.53 (1) |              27.09 (2.97) |  +2.09% |   +4.69% (14.62 pp) |
| tuple/projection/4/value.random         |              40.48 (2.71) |              41.09 (3.12) |  +1.51% |    +0.38% (9.38 pp) |
| tuple/tuple/4/value.random              |               18.42 (0.9) |              17.54 (0.68) |  -4.80% |     -5.92% (4.5 pp) |
| tuple/projection/4/values               |             150.65 (6.17) |             145.95 (8.53) |  -3.12% |   -3.17% (20.36 pp) |
| tuple/tuple/4/values                    |            147.71 (20.61) |            148.76 (19.03) |  +0.72% |   +2.36% (14.37 pp) |
| tuple/projection/4/sequence             |            475.61 (41.15) |            482.64 (54.74) |  +1.48% |    +1.53% (9.66 pp) |
| tuple/tuple/4/sequence                  |            565.31 (67.25) |            567.06 (34.23) |  +0.31% |    +0.94% (5.72 pp) |
| tuple/projection/8/create.empty         |            425.35 (19.94) |             434.36 (9.53) |  +2.12% |   +0.43% (12.63 pp) |
| tuple/tuple/8/create.empty              |            448.95 (18.47) |             461.24 (34.6) |  +2.74% |    +2.96% (5.57 pp) |
| tuple/projection/8/create.sequence      |         2,262.46 (176.07) |         2,310.68 (202.73) |  +2.13% |   -3.74% (10.34 pp) |
| tuple/tuple/8/create.sequence           |         2,046.48 (110.74) |         2,072.86 (257.02) |  +1.29% |   +2.00% (14.37 pp) |
| tuple/projection/8/replace.random       |          1,179.71 (52.79) |          1,177.85 (48.97) |  -0.16% |    +0.71% (5.79 pp) |
| tuple/tuple/8/replace.random            |            645.02 (26.29) |            653.45 (80.07) |  +1.31% |   +4.45% (12.21 pp) |
| tuple/projection/8/apply.replace        |           1,759.61 (99.8) |             1,812.6 (264) |  +3.01% |   +6.07% (13.02 pp) |
| tuple/tuple/8/apply.replace             |         1,047.18 (108.47) |         1,076.07 (108.39) |  +2.76% |   +0.21% (16.55 pp) |
| tuple/projection/8/apply.duplicate      |            603.24 (19.88) |            631.83 (41.67) |  +4.74% |    +4.84% (6.47 pp) |
| tuple/tuple/8/apply.duplicate           |            608.56 (28.76) |            637.74 (30.43) |  +4.79% |    +3.22% (2.51 pp) |
| tuple/projection/8/merge.duplicate      |           1,069.7 (34.22) |          1,074.89 (41.18) |  +0.48% |     +1.39% (5.8 pp) |
| tuple/tuple/8/merge.duplicate           |          1,108.23 (32.46) |          1,120.14 (79.01) |  +1.07% |    +1.69% (6.43 pp) |
| tuple/projection/8/length               |              27.77 (4.54) |              26.74 (3.32) |  -3.69% |   -0.22% (50.68 pp) |
| tuple/tuple/8/length                    |              26.77 (1.42) |              27.78 (1.24) |  +3.79% |    +5.60% (9.17 pp) |
| tuple/projection/8/value.random         |              55.81 (4.84) |              54.05 (4.83) |  -3.15% |   -4.22% (14.82 pp) |
| tuple/tuple/8/value.random              |              17.55 (1.28) |               17.9 (1.24) |  +1.99% |    +1.37% (5.15 pp) |
| tuple/projection/8/values               |            224.17 (26.74) |              220.3 (8.87) |  -1.72% |   -1.47% (10.29 pp) |
| tuple/tuple/8/values                    |             202.46 (3.18) |            201.52 (11.33) |  -0.47% |   -0.35% (11.45 pp) |
| tuple/projection/8/sequence             |            644.99 (28.21) |             667.29 (32.2) |  +3.46% |   +2.32% (11.04 pp) |
| tuple/tuple/8/sequence                  |            680.68 (33.19) |            697.18 (31.93) |  +2.42% |    +1.93% (6.08 pp) |
| tuple/projection/100/create.empty       |            442.62 (20.59) |             457.2 (13.08) |  +3.29% |    +1.64% (6.86 pp) |
| tuple/tuple/100/create.empty            |             460.81 (11.7) |             470.04 (5.96) |  +2.00% |     +2.14% (3.9 pp) |
| tuple/projection/100/create.sequence    |        14,000.78 (271.28) |        14,202.64 (465.66) |  +1.44% |    -1.06% (4.13 pp) |
| tuple/tuple/100/create.sequence         |        11,443.41 (272.04) |        11,579.89 (393.22) |  +1.19% |    -0.29% (5.11 pp) |
| tuple/projection/100/replace.random     |         1,199.01 (148.83) |          1,176.41 (60.72) |  -1.88% |    -3.66% (9.57 pp) |
| tuple/tuple/100/replace.random          |            633.09 (28.63) |             617.47 (28.2) |  -2.47% |    -3.25% (6.03 pp) |
| tuple/projection/100/apply.replace      |          1,753.7 (104.76) |          1,735.36 (78.61) |  -1.05% |    -2.76% (9.57 pp) |
| tuple/tuple/100/apply.replace           |          1,008.89 (72.68) |          1,026.19 (67.03) |  +1.71% |   +1.72% (12.71 pp) |
| tuple/projection/100/apply.duplicate    |            596.77 (45.16) |            622.57 (69.32) |  +4.32% |   +2.61% (16.36 pp) |
| tuple/tuple/100/apply.duplicate         |            607.53 (21.86) |             627.04 (27.9) |  +3.21% |    +3.43% (5.94 pp) |
| tuple/projection/100/merge.duplicate    |         9,274.87 (668.11) |         9,277.78 (455.71) |  +0.03% |    -1.08% (5.02 pp) |
| tuple/tuple/100/merge.duplicate         |         13,120.4 (590.06) |           13,228.28 (350) |  +0.82% |    +0.04% (7.34 pp) |
| tuple/projection/100/length             |              27.49 (1.89) |              27.98 (2.32) |  +1.77% |   +2.89% (48.31 pp) |
| tuple/tuple/100/length                  |               27.8 (5.16) |              28.41 (5.14) |  +2.22% |   -4.56% (44.96 pp) |
| tuple/projection/100/value.random       |              80.41 (6.46) |              82.68 (4.25) |  +2.83% |    +1.94% (13.3 pp) |
| tuple/tuple/100/value.random            |              18.66 (0.89) |              18.62 (1.17) |  -0.22% |   -0.82% (15.27 pp) |
| tuple/projection/100/values             |          1,824.29 (88.24) |          1,916.81 (74.55) |  +5.07% |    +2.23% (3.56 pp) |
| tuple/tuple/100/values                  |         1,547.91 (120.12) |          1,541.57 (52.03) |  -0.41% |   +0.73% (11.37 pp) |
| tuple/projection/100/sequence           |         6,696.23 (484.35) |           6,176.6 (279.1) |  -7.76% |   -9.61% (10.58 pp) |
| tuple/tuple/100/sequence                |         5,764.15 (384.14) |          5,496.25 (196.6) |  -4.65% |    -4.88% (6.12 pp) |

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
