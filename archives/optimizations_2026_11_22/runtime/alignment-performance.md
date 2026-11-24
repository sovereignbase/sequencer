# Rejected output alignment: complete guard

5 complete matched runs per build. Before: baseline; candidate: aligned. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 57 timing medians improve over 5%; 58 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 0%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |            768.68 (35.77) |            756.22 (27.61) |  -1.62% |    -2.78% (3.71 pp) |
| throughput/1000/apply.duplicate         |            828.86 (50.25) |            899.27 (126.2) |  +8.49% |  +13.90% (15.06 pp) |
| throughput/5000/apply.duplicate         |             378.96 (1.73) |             372.98 (4.76) |  -1.58% |    -1.58% (1.71 pp) |
| throughput/10000/apply.duplicate        |             351.25 (7.24) |             359.19 (7.12) |  +2.26% |    +3.23% (5.35 pp) |
| throughput/15000/apply.duplicate        |            325.96 (17.63) |            332.71 (12.61) |  +2.07% |   -2.72% (10.93 pp) |
| throughput/20000/apply.duplicate        |            315.19 (22.93) |             313.06 (7.39) |  -0.68% |    +0.11% (8.43 pp) |
| throughput/25000/apply.duplicate        |            348.01 (50.08) |              324.46 (9.4) |  -6.77% |   -6.77% (21.16 pp) |
| throughput/100/apply.duplicateRemove    |           1,456.8 (44.34) |          1,525.73 (82.31) |  +4.73% |    +3.25% (9.72 pp) |
| throughput/1000/apply.duplicateRemove   |            867.04 (31.17) |           877.22 (129.36) |  +1.17% |   +7.84% (13.02 pp) |
| throughput/5000/apply.duplicateRemove   |            764.14 (13.75) |            783.23 (42.51) |  +2.50% |    -0.46% (5.66 pp) |
| throughput/10000/apply.duplicateRemove  |            720.19 (16.86) |            727.11 (34.33) |  +0.96% |    -1.31% (2.42 pp) |
| throughput/15000/apply.duplicateRemove  |            664.32 (38.59) |            716.85 (23.79) |  +7.91% |    +6.57% (6.72 pp) |
| throughput/20000/apply.duplicateRemove  |            721.06 (79.15) |            656.43 (57.33) |  -8.96% |    -5.56% (3.98 pp) |
| throughput/25000/apply.duplicateRemove  |            685.21 (99.14) |              675.23 (5.2) |  -1.46% |    -1.46% (4.32 pp) |
| throughput/100/apply.duplicateReplace   |         1,054.68 (112.04) |         1,088.55 (367.47) |  +3.21% |   +3.70% (23.44 pp) |
| throughput/1000/apply.duplicateReplace  |          1,059.66 (54.93) |          1,127.12 (38.76) |  +6.37% |    +6.41% (9.21 pp) |
| throughput/5000/apply.duplicateReplace  |              936.7 (7.76) |            974.85 (24.22) |  +4.07% |     +3.48% (8.4 pp) |
| throughput/10000/apply.duplicateReplace |             869.23 (6.75) |            906.85 (35.42) |  +4.33% |    +2.38% (8.73 pp) |
| throughput/15000/apply.duplicateReplace |            817.12 (29.72) |            900.51 (46.59) | +10.21% |    +5.86% (2.58 pp) |
| throughput/20000/apply.duplicateReplace |            834.32 (56.08) |            875.74 (85.76) |  +4.96% |    +2.92% (5.31 pp) |
| throughput/25000/apply.duplicateReplace |            900.59 (97.61) |            832.23 (45.87) |  -7.59% |   -4.43% (13.32 pp) |
| throughput/100/apply.insert             |           1,658.4 (10.11) |         1,669.37 (142.89) |  +0.66% |    -0.52% (6.01 pp) |
| throughput/1000/apply.insert            |          1,441.07 (18.59) |         1,401.94 (113.88) |  -2.72% |   -6.06% (10.82 pp) |
| throughput/5000/apply.insert            |          1,327.56 (86.04) |         1,461.41 (163.44) | +10.08% |   -2.34% (19.68 pp) |
| throughput/10000/apply.insert           |           1,391.86 (60.2) |         1,380.16 (122.08) |  -0.84% |     +0.71% (8.8 pp) |
| throughput/15000/apply.insert           |          1,312.72 (21.26) |         1,382.27 (162.08) |  +5.30% |   +3.38% (10.18 pp) |
| throughput/20000/apply.insert           |         1,196.46 (221.18) |         1,187.45 (106.34) |  -0.75% |    -0.04% (8.78 pp) |
| throughput/25000/apply.insert           |             1,284.46 (83) |          1,332.45 (148.2) |  +3.74% |   -1.28% (10.66 pp) |
| throughput/100/apply.remove             |          1,857.34 (58.61) |         1,867.71 (186.09) |  +0.56% |    -2.50% (7.67 pp) |
| throughput/1000/apply.remove            |          1,502.47 (79.15) |          1,512.29 (93.33) |  +0.65% |    +4.11% (9.46 pp) |
| throughput/5000/apply.remove            |         1,590.62 (140.67) |            1,549.52 (122) |  -2.58% |    -0.28% (4.94 pp) |
| throughput/10000/apply.remove           |          1,544.15 (85.71) |         1,477.97 (155.94) |  -4.29% |   -1.50% (14.43 pp) |
| throughput/15000/apply.remove           |          1,515.98 (86.34) |          1,493.39 (74.34) |  -1.49% |   +3.92% (14.92 pp) |
| throughput/20000/apply.remove           |         1,553.08 (151.71) |          1,523.16 (31.56) |  -1.93% |   -3.78% (11.42 pp) |
| throughput/25000/apply.remove           |          1,555.12 (42.94) |           1,515.51 (12.1) |  -2.55% |    -0.52% (4.19 pp) |
| throughput/100/apply.replace            |          2,749.45 (354.6) |         2,775.87 (226.73) |  +0.96% |    -3.19% (9.22 pp) |
| throughput/1000/apply.replace           |          2,743.27 (11.01) |         2,713.71 (110.33) |  -1.08% |    -1.16% (3.33 pp) |
| throughput/5000/apply.replace           |         2,802.51 (245.19) |         2,782.63 (142.14) |  -0.71% |   -3.81% (11.76 pp) |
| throughput/10000/apply.replace          |         2,736.13 (114.48) |          2,707.59 (81.33) |  -1.04% |    -1.29% (8.37 pp) |
| throughput/15000/apply.replace          |         2,787.39 (238.87) |          2,729.15 (16.09) |  -2.09% |    -1.41% (8.57 pp) |
| throughput/20000/apply.replace          |         3,087.85 (361.21) |         2,948.33 (184.97) |  -4.52% |    +2.57% (8.43 pp) |
| throughput/25000/apply.replace          |         2,791.11 (708.24) |          2,784.54 (22.91) |  -0.24% |    -0.68% (28.8 pp) |
| throughput/100/create.empty             |           564.35 (100.28) |            563.26 (41.04) |  -0.19% |   -0.19% (25.64 pp) |
| throughput/1000/create.empty            |           634.01 (148.57) |            724.52 (46.22) | +14.28% |  +14.28% (27.79 pp) |
| throughput/5000/create.empty            |            672.41 (77.12) |           766.74 (146.33) | +14.03% |      +14.03% (7 pp) |
| throughput/10000/create.empty           |            684.55 (22.89) |               733 (57.42) |  +7.08% |   +7.90% (14.16 pp) |
| throughput/15000/create.empty           |            730.17 (85.01) |            773.09 (69.89) |  +5.88% |   +1.43% (21.28 pp) |
| throughput/20000/create.empty           |             712.64 (30.4) |            820.63 (67.71) | +15.15% |  +15.15% (14.53 pp) |
| throughput/25000/create.empty           |           635.82 (109.57) |             761.31 (76.2) | +19.74% |   +18.62% (7.39 pp) |
| throughput/100/create.sequence          |         1,620.45 (173.95) |         1,563.71 (141.97) |  -3.50% |    +0.23% (3.33 pp) |
| throughput/1000/create.sequence         |         1,828.35 (103.29) |         1,865.69 (141.44) |  +2.04% |      +2.04% (13 pp) |
| throughput/5000/create.sequence         |          1,584.43 (93.87) |          1,636.48 (60.54) |  +3.29% |    +3.29% (6.31 pp) |
| throughput/10000/create.sequence        |         1,636.13 (210.72) |          1,665.14 (88.78) |  +1.77% |    +5.85% (4.69 pp) |
| throughput/15000/create.sequence        |         1,428.43 (126.89) |          1,420.46 (74.92) |  -0.56% |   -0.99% (12.35 pp) |
| throughput/20000/create.sequence        |         1,599.49 (359.03) |          1,507.54 (227.3) |  -5.75% |   -5.47% (24.65 pp) |
| throughput/25000/create.sequence        |         1,403.41 (359.24) |         1,482.47 (186.64) |  +5.63% |    +0.74% (8.67 pp) |
| throughput/100/insert.head              |            512.65 (10.94) |            600.93 (48.24) | +17.22% |   +22.63% (8.17 pp) |
| throughput/1000/insert.head             |            523.85 (19.01) |             543.54 (6.18) |  +3.76% |    +3.98% (4.57 pp) |
| throughput/5000/insert.head             |            557.96 (48.22) |            581.37 (72.02) |  +4.20% |   -1.07% (24.71 pp) |
| throughput/10000/insert.head            |            496.08 (17.93) |            539.59 (18.49) |  +8.77% |    +8.60% (7.69 pp) |
| throughput/15000/insert.head            |             521.4 (44.13) |             489.29 (79.8) |  -6.16% |   -6.42% (13.93 pp) |
| throughput/20000/insert.head            |           652.95 (146.33) |             551.92 (49.7) | -15.47% |   -18.02% (6.92 pp) |
| throughput/25000/insert.head            |             471.95 (7.17) |             497.02 (37.6) |  +5.31% |    +5.82% (7.93 pp) |
| throughput/100/insert.middle            |           641.94 (139.89) |            604.46 (73.82) |  -5.84% |   -10.72% (3.46 pp) |
| throughput/1000/insert.middle           |            647.42 (40.42) |            631.47 (12.65) |  -2.46% |    -0.78% (5.97 pp) |
| throughput/5000/insert.middle           |            611.03 (19.92) |            620.97 (44.43) |  +1.63% |   +1.97% (15.25 pp) |
| throughput/10000/insert.middle          |            639.24 (76.61) |            613.82 (23.08) |  -3.98% |   +1.39% (14.24 pp) |
| throughput/15000/insert.middle          |            592.36 (70.84) |            569.68 (31.78) |  -3.83% |   +5.04% (18.86 pp) |
| throughput/20000/insert.middle          |           649.61 (147.62) |             617.25 (9.39) |  -4.98% |   -5.56% (28.85 pp) |
| throughput/25000/insert.middle          |            622.29 (61.02) |            572.69 (29.57) |  -7.97% |    -7.04% (8.98 pp) |
| throughput/100/insert.random            |            847.58 (97.01) |             859.75 (97.1) |  +1.44% |    +1.44% (21.6 pp) |
| throughput/1000/insert.random           |             964.4 (65.82) |            938.21 (70.36) |  -2.72% |   -5.03% (11.02 pp) |
| throughput/5000/insert.random           |           920.12 (110.75) |             968.4 (41.44) |  +5.25% |    +2.20% (18.3 pp) |
| throughput/10000/insert.random          |            874.39 (89.05) |             917.1 (59.05) |  +4.88% |   +4.88% (15.79 pp) |
| throughput/15000/insert.random          |            950.63 (93.68) |             954.98 (17.7) |  +0.46% |    +2.29% (9.44 pp) |
| throughput/20000/insert.random          |            938.31 (64.83) |            902.47 (68.42) |  -3.82% |    -0.74% (7.49 pp) |
| throughput/25000/insert.random          |            886.42 (59.91) |            844.62 (31.64) |  -4.72% |     -3.33% (3.4 pp) |
| throughput/100/insert.sameIndex         |            596.77 (51.39) |            541.88 (60.34) |  -9.20% |   -9.70% (36.33 pp) |
| throughput/1000/insert.sameIndex        |             590.28 (28.8) |             562.62 (12.5) |  -4.69% |    -4.69% (1.05 pp) |
| throughput/5000/insert.sameIndex        |             570.69 (5.42) |            536.84 (91.07) |  -5.93% |   -5.26% (16.19 pp) |
| throughput/10000/insert.sameIndex       |            577.31 (76.15) |            589.06 (24.98) |  +2.04% |   +2.04% (20.63 pp) |
| throughput/15000/insert.sameIndex       |                540 (30.7) |           549.45 (122.88) |  +1.75% |  +10.24% (29.17 pp) |
| throughput/20000/insert.sameIndex       |            520.28 (55.45) |            528.72 (30.31) |  +1.62% |   +4.00% (15.46 pp) |
| throughput/25000/insert.sameIndex       |            524.24 (28.99) |             518.06 (2.13) |  -1.18% |    -1.21% (4.61 pp) |
| throughput/100/insert.tail              |           879.16 (103.05) |            836.37 (70.49) |  -4.87% |   +9.73% (15.33 pp) |
| throughput/1000/insert.tail             |           896.26 (177.71) |              867 (132.35) |  -3.26% |    -8.84% (9.99 pp) |
| throughput/5000/insert.tail             |           895.77 (188.51) |            942.44 (27.79) |  +5.21% |   +4.72% (10.21 pp) |
| throughput/10000/insert.tail            |           905.21 (226.64) |           925.34 (109.52) |  +2.22% |   -9.83% (11.25 pp) |
| throughput/15000/insert.tail            |            854.87 (80.94) |         1,009.83 (200.95) | +18.13% |   +9.64% (12.43 pp) |
| throughput/20000/insert.tail            |         1,023.98 (276.42) |             822.4 (49.56) | -19.69% |   -8.68% (18.78 pp) |
| throughput/25000/insert.tail            |           958.33 (105.16) |            903.22 (82.36) |  -5.75% |    -5.61% (1.75 pp) |
| throughput/100/length                   |            109.85 (12.67) |            128.87 (32.12) | +17.31% |  +17.31% (46.36 pp) |
| throughput/1000/length                  |              114.68 (7.5) |             116.56 (4.07) |  +1.64% |   -1.30% (14.84 pp) |
| throughput/5000/length                  |             114.53 (7.73) |             113.25 (0.92) |  -1.12% |   +4.68% (10.47 pp) |
| throughput/10000/length                 |            118.78 (12.35) |             112.97 (2.39) |  -4.89% |    -2.04% (3.47 pp) |
| throughput/15000/length                 |                103 (8.23) |            118.19 (17.38) | +14.75% |    +9.71% (2.44 pp) |
| throughput/20000/length                 |            112.09 (11.12) |             113.72 (3.41) |  +1.45% |   -1.14% (15.49 pp) |
| throughput/25000/length                 |             108.61 (5.26) |            115.15 (17.27) |  +6.02% |   -0.06% (13.72 pp) |
| throughput/100/merge.duplicate          |            816.77 (97.29) |            850.11 (46.47) |  +4.08% |    -1.47% (6.52 pp) |
| throughput/1000/merge.duplicate         |             677.57 (19.9) |             648.74 (40.5) |  -4.25% |     -4.25% (4.2 pp) |
| throughput/5000/merge.duplicate         |            754.3 (149.65) |            665.09 (22.04) | -11.83% |  -12.74% (15.42 pp) |
| throughput/10000/merge.duplicate        |            632.31 (26.63) |            639.67 (44.57) |  +1.16% |   -1.43% (10.16 pp) |
| throughput/15000/merge.duplicate        |            593.59 (37.83) |            606.46 (36.62) |  +2.17% |    +2.62% (3.46 pp) |
| throughput/20000/merge.duplicate        |            598.82 (36.55) |            591.57 (68.15) |  -1.21% |    -3.97% (18.7 pp) |
| throughput/25000/merge.duplicate        |            586.01 (27.14) |            599.61 (28.91) |  +2.32% |     +5.04% (6.1 pp) |
| throughput/100/merge.insert             |         1,772.43 (172.68) |         1,814.79 (203.92) |  +2.39% |    +5.82% (9.66 pp) |
| throughput/1000/merge.insert            |          1,478.77 (80.44) |          1,463.75 (62.38) |  -1.02% |   -2.64% (10.62 pp) |
| throughput/5000/merge.insert            |         1,694.59 (203.79) |          1,617.16 (65.66) |  -4.57% |   -4.57% (13.43 pp) |
| throughput/10000/merge.insert           |          1,565.7 (196.92) |         1,643.41 (114.64) |  +4.96% |    +2.22% (6.96 pp) |
| throughput/15000/merge.insert           |          1,503.77 (98.17) |          1,549.18 (99.96) |  +3.02% |  +10.91% (15.45 pp) |
| throughput/20000/merge.insert           |         1,501.29 (920.74) |           1,483.75 (51.6) |  -1.17% |   -3.30% (50.15 pp) |
| throughput/25000/merge.insert           |          1,353.46 (49.17) |         1,343.34 (104.03) |  -0.75% |    -0.22% (2.52 pp) |
| throughput/100/remove.head              |           767.39 (151.49) |            722.95 (12.21) |  -5.79% |   -6.75% (18.49 pp) |
| throughput/1000/remove.head             |            800.18 (12.48) |            792.11 (12.74) |  -1.01% |    -1.20% (6.99 pp) |
| throughput/5000/remove.head             |            848.17 (46.27) |              818.2 (6.24) |  -3.53% |     -5.97% (6.9 pp) |
| throughput/10000/remove.head            |            885.61 (52.56) |             898.36 (36.8) |  +1.44% |   +5.29% (14.74 pp) |
| throughput/15000/remove.head            |           956.27 (112.58) |             840.62 (5.43) | -12.09% |   -9.80% (11.24 pp) |
| throughput/20000/remove.head            |          1,019.46 (19.12) |             967.5 (28.51) |  -5.10% |    -3.69% (6.55 pp) |
| throughput/25000/remove.head            |            913.44 (13.92) |            977.84 (38.82) |  +7.05% |    +7.77% (5.33 pp) |
| throughput/100/remove.middle            |            784.34 (95.79) |             792.55 (84.3) |  +1.05% |   +0.06% (16.82 pp) |
| throughput/1000/remove.middle           |            800.71 (41.92) |            818.11 (22.25) |  +2.17% |       +4.04% (6 pp) |
| throughput/5000/remove.middle           |            876.17 (65.94) |            832.84 (35.72) |  -4.95% |   -5.31% (13.95 pp) |
| throughput/10000/remove.middle          |            875.58 (11.41) |            872.78 (21.31) |  -0.32% |    +0.01% (1.25 pp) |
| throughput/15000/remove.middle          |           877.72 (133.02) |            864.17 (31.44) |  -1.54% |   -1.41% (10.31 pp) |
| throughput/20000/remove.middle          |            961.89 (57.21) |            920.55 (51.24) |  -4.30% |   -4.30% (11.07 pp) |
| throughput/25000/remove.middle          |            992.71 (108.3) |            986.09 (27.82) |  -0.67% |    +1.17% (9.65 pp) |
| throughput/100/remove.random            |         1,030.66 (171.26) |         1,069.83 (170.29) |  +3.80% |   +2.19% (26.42 pp) |
| throughput/1000/remove.random           |          1,211.12 (64.51) |          1,194.18 (44.74) |  -1.40% |    -1.27% (8.91 pp) |
| throughput/5000/remove.random           |          1,221.16 (69.09) |           1,208.95 (22.5) |  -1.00% |    -0.28% (8.66 pp) |
| throughput/10000/remove.random          |           1,270.3 (69.32) |         1,175.14 (153.81) |  -7.49% |   -8.05% (19.59 pp) |
| throughput/15000/remove.random          |          1,202.77 (62.86) |          1,185.22 (85.67) |  -1.46% |    +1.79% (9.65 pp) |
| throughput/20000/remove.random          |          1,350.35 (84.12) |         1,296.68 (159.03) |  -3.97% |   +1.78% (13.16 pp) |
| throughput/25000/remove.random          |         1,284.82 (429.71) |          1,292.27 (68.83) |  +0.58% |   -3.21% (26.24 pp) |
| throughput/100/remove.sameIndex         |           957.39 (473.08) |          1,093.1 (435.54) | +14.18% |   +8.96% (87.38 pp) |
| throughput/1000/remove.sameIndex        |            865.47 (62.24) |            826.17 (18.34) |  -4.54% |     -3.24% (9.1 pp) |
| throughput/5000/remove.sameIndex        |            854.16 (34.33) |            864.62 (32.26) |  +1.22% |   +0.54% (10.98 pp) |
| throughput/10000/remove.sameIndex       |            902.49 (20.33) |            901.85 (31.64) |  -0.07% |    -1.05% (9.27 pp) |
| throughput/15000/remove.sameIndex       |            887.9 (120.05) |           890.76 (171.92) |  +0.32% |    -1.25% (2.92 pp) |
| throughput/20000/remove.sameIndex       |         1,008.56 (125.92) |           999.91 (122.39) |  -0.86% |    -0.55% (0.68 pp) |
| throughput/25000/remove.sameIndex       |            959.42 (76.99) |            954.45 (23.68) |  -0.52% |    +3.89% (6.35 pp) |
| throughput/100/remove.tail              |           815.45 (102.53) |           721.94 (143.42) | -11.47% |   -3.00% (13.02 pp) |
| throughput/1000/remove.tail             |            774.02 (84.96) |            729.95 (18.55) |  -5.69% |    -5.69% (16.4 pp) |
| throughput/5000/remove.tail             |            732.52 (65.08) |            746.04 (26.28) |  +1.85% |     -0.88% (7.4 pp) |
| throughput/10000/remove.tail            |            835.32 (57.68) |             770.5 (70.26) |  -7.76% |   -7.76% (14.98 pp) |
| throughput/15000/remove.tail            |            746.08 (96.17) |            747.73 (39.89) |  +0.22% |    -2.37% (6.59 pp) |
| throughput/20000/remove.tail            |            851.21 (62.44) |            867.28 (90.32) |  +1.89% |   +1.89% (18.45 pp) |
| throughput/25000/remove.tail            |             817.48 (34.7) |            831.09 (38.47) |  +1.66% |    +3.47% (8.96 pp) |
| throughput/100/replace.head             |         1,101.64 (190.68) |         1,024.43 (174.14) |  -7.01% |    -1.12% (26.8 pp) |
| throughput/1000/replace.head            |         1,207.38 (140.61) |          1,206.88 (73.55) |  -0.04% |    -0.04% (5.89 pp) |
| throughput/5000/replace.head            |         1,129.17 (151.69) |          1,195.13 (93.51) |  +5.84% |    -0.67% (7.44 pp) |
| throughput/10000/replace.head           |          1,206.09 (36.44) |          1,218.28 (90.47) |  +1.01% |   +2.70% (14.06 pp) |
| throughput/15000/replace.head           |         1,177.89 (154.68) |         1,225.17 (141.43) |  +4.01% |   +2.16% (15.86 pp) |
| throughput/20000/replace.head           |           1,238.57 (26.9) |         1,303.25 (133.79) |  +5.22% |    +3.05% (9.49 pp) |
| throughput/25000/replace.head           |          1,246.7 (161.66) |          1,195.25 (18.32) |  -4.13% |    -4.82% (7.38 pp) |
| throughput/100/replace.middle           |         1,212.26 (118.42) |            1,044.79 (163) | -13.81% |   -0.07% (17.22 pp) |
| throughput/1000/replace.middle          |          1,270.42 (71.94) |          1,226.14 (32.36) |  -3.49% |    -4.74% (8.32 pp) |
| throughput/5000/replace.middle          |          1,179.35 (81.97) |          1,222.81 (33.03) |  +3.69% |    +0.22% (9.73 pp) |
| throughput/10000/replace.middle         |          1,236.66 (12.07) |          1,241.65 (45.72) |  +0.40% |    +0.40% (2.59 pp) |
| throughput/15000/replace.middle         |          1,195.94 (58.22) |          1,183.28 (66.32) |  -1.06% |    -1.27% (1.28 pp) |
| throughput/20000/replace.middle         |          1,294.21 (57.84) |          1,307.54 (89.56) |  +1.03% |   -1.07% (11.12 pp) |
| throughput/25000/replace.middle         |         1,388.55 (195.46) |          1,275.97 (14.21) |  -8.11% |   -8.11% (11.68 pp) |
| throughput/100/replace.random           |         1,707.35 (287.29) |         1,616.26 (213.29) |  -5.34% |   +0.15% (23.16 pp) |
| throughput/1000/replace.random          |          1,855.91 (53.03) |          1,832.72 (61.38) |  -1.25% |    -4.13% (9.68 pp) |
| throughput/5000/replace.random          |          1,832.12 (63.98) |          1,799.93 (61.29) |  -1.76% |    -0.22% (5.28 pp) |
| throughput/10000/replace.random         |          1,749.76 (33.54) |         1,820.26 (243.84) |  +4.03% |    +4.11% (2.09 pp) |
| throughput/15000/replace.random         |          1,680.61 (96.92) |         1,804.05 (124.54) |  +7.34% |    +3.28% (5.67 pp) |
| throughput/20000/replace.random         |           1,779.2 (95.07) |         1,879.37 (274.02) |  +5.63% |   +5.99% (17.96 pp) |
| throughput/25000/replace.random         |         1,917.99 (269.81) |          1,732.14 (94.13) |  -9.69% |  -11.47% (18.19 pp) |
| throughput/100/replace.sameIndex        |         1,135.82 (170.19) |         1,039.13 (133.92) |  -8.51% |    +7.24% (23.7 pp) |
| throughput/1000/replace.sameIndex       |           1,160.5 (23.06) |          1,174.45 (36.79) |  +1.20% |    +0.16% (7.47 pp) |
| throughput/5000/replace.sameIndex       |          1,153.35 (56.04) |          1,125.08 (35.17) |  -2.45% |    -2.15% (1.53 pp) |
| throughput/10000/replace.sameIndex      |           1,193.9 (78.27) |           1,219.71 (33.3) |  +2.16% |    +2.96% (5.67 pp) |
| throughput/15000/replace.sameIndex      |          1,230.62 (168.9) |          1,153.54 (83.65) |  -6.26% |   -2.61% (16.68 pp) |
| throughput/20000/replace.sameIndex      |         1,302.14 (183.22) |          1,261.46 (59.04) |  -3.12% |   -3.12% (14.24 pp) |
| throughput/25000/replace.sameIndex      |          1,241.44 (53.35) |          1,222.81 (44.51) |  -1.50% |    -1.50% (9.04 pp) |
| throughput/100/replace.tail             |         1,207.64 (173.05) |         1,229.76 (129.02) |  +1.83% |   -2.67% (27.18 pp) |
| throughput/1000/replace.tail            |         1,247.55 (108.53) |          1,194.92 (45.33) |  -4.22% |   -0.02% (11.44 pp) |
| throughput/5000/replace.tail            |         1,244.54 (113.89) |          1,168.94 (31.27) |  -6.07% |     -6.64% (6.7 pp) |
| throughput/10000/replace.tail           |         1,162.41 (100.01) |             1,205 (75.55) |  +3.66% |   +6.22% (14.96 pp) |
| throughput/15000/replace.tail           |           1,155.3 (78.07) |          1,178.92 (22.03) |  +2.04% |    +1.78% (4.96 pp) |
| throughput/20000/replace.tail           |         1,299.64 (186.25) |         1,302.44 (117.04) |  +0.22% |   -3.98% (10.53 pp) |
| throughput/25000/replace.tail           |          1,292.07 (52.61) |         1,238.15 (144.61) |  -4.17% |    -1.64% (8.17 pp) |
| throughput/100/retire                   |            196.64 (38.16) |             195.49 (5.28) |  -0.58% |   -6.03% (18.51 pp) |
| throughput/1000/retire                  |            212.76 (18.97) |             215.71 (4.05) |  +1.39% |   +1.57% (10.96 pp) |
| throughput/5000/retire                  |             205.32 (1.56) |             205.53 (4.56) |  +0.10% |    -1.25% (1.25 pp) |
| throughput/10000/retire                 |            201.71 (13.23) |             198.44 (7.95) |  -1.62% |   +2.27% (10.83 pp) |
| throughput/15000/retire                 |            208.12 (20.74) |             201.09 (4.32) |  -3.38% |   +3.19% (13.07 pp) |
| throughput/20000/retire                 |             207.77 (6.16) |            188.42 (23.96) |  -9.31% |    -1.44% (7.94 pp) |
| throughput/25000/retire                 |             185.08 (8.09) |                187.93 (5) |  +1.54% |    +1.54% (9.32 pp) |
| throughput/100/sequence                 |             285.83 (47.8) |            319.53 (35.95) | +11.79% |  +12.77% (20.88 pp) |
| throughput/1000/sequence                |                310 (11.2) |            305.33 (10.84) |  -1.51% |    +0.22% (9.76 pp) |
| throughput/5000/sequence                |             284.84 (8.01) |             283.3 (11.52) |  -0.54% |     -1.41% (4.1 pp) |
| throughput/10000/sequence               |            269.01 (19.44) |             272.33 (8.78) |  +1.23% |    +1.23% (5.87 pp) |
| throughput/15000/sequence               |            289.08 (17.27) |            259.53 (27.99) | -10.22% |   -12.41% (7.76 pp) |
| throughput/20000/sequence               |             257.89 (3.37) |            258.65 (10.78) |  +0.29% |    -4.01% (8.09 pp) |
| throughput/25000/sequence               |              252.95 (9.1) |             253.74 (9.86) |  +0.31% |    +0.31% (3.45 pp) |
| throughput/100/value.head               |             178.3 (25.26) |            189.21 (13.31) |  +6.12% |    +0.83% (7.18 pp) |
| throughput/1000/value.head              |             161.13 (4.32) |             167.02 (4.93) |  +3.66% |   +3.66% (18.49 pp) |
| throughput/5000/value.head              |              147.79 (2.1) |             148.2 (18.04) |  +0.28% |    +3.42% (7.37 pp) |
| throughput/10000/value.head             |            145.79 (11.44) |             142.53 (5.78) |  -2.24% |    -2.32% (16.1 pp) |
| throughput/15000/value.head             |            131.65 (19.52) |             136.56 (12.5) |  +3.73% |   +3.73% (25.99 pp) |
| throughput/20000/value.head             |            132.39 (15.99) |            143.46 (24.91) |  +8.36% |   +11.32% (4.96 pp) |
| throughput/25000/value.head             |              136.15 (4.8) |             129.33 (2.89) |  -5.01% |    -5.35% (1.85 pp) |
| throughput/100/value.middle             |             256.68 (54.1) |            248.92 (24.35) |  -3.02% |    -5.87% (4.23 pp) |
| throughput/1000/value.middle            |             255.6 (12.22) |             245.77 (3.45) |  -3.85% |     -2.78% (7.4 pp) |
| throughput/5000/value.middle            |            239.74 (13.86) |             227.38 (9.31) |  -5.16% |    -5.18% (4.52 pp) |
| throughput/10000/value.middle           |             223.16 (7.52) |            221.14 (11.33) |  -0.91% |    -0.91% (5.99 pp) |
| throughput/15000/value.middle           |             205.14 (9.27) |             209.71 (5.31) |  +2.23% |    +2.65% (3.98 pp) |
| throughput/20000/value.middle           |            212.18 (12.51) |            216.53 (22.94) |  +2.05% |    +4.53% (5.62 pp) |
| throughput/25000/value.middle           |            225.33 (29.24) |             206.77 (9.01) |  -8.24% |   -11.66% (6.15 pp) |
| throughput/100/value.random             |            200.32 (30.14) |            214.15 (40.98) |  +6.90% |    +2.51% (4.52 pp) |
| throughput/1000/value.random            |              221.3 (1.47) |             226.32 (3.94) |  +2.27% |    +2.27% (1.64 pp) |
| throughput/5000/value.random            |            270.03 (13.43) |            287.42 (14.75) |  +6.44% |    +7.62% (4.82 pp) |
| throughput/10000/value.random           |              267.7 (1.65) |            272.47 (19.65) |  +1.78% |    +1.80% (7.93 pp) |
| throughput/15000/value.random           |            266.44 (30.62) |            260.28 (31.25) |  -2.31% |    -1.98% (2.25 pp) |
| throughput/20000/value.random           |             283.45 (6.05) |            286.42 (55.38) |  +1.05% |   +1.99% (20.91 pp) |
| throughput/25000/value.random           |            276.09 (14.31) |            265.42 (23.53) |  -3.86% |   -3.86% (16.13 pp) |
| throughput/100/value.sameIndex          |            186.35 (29.93) |            197.26 (22.39) |  +5.85% |   -0.70% (13.87 pp) |
| throughput/1000/value.sameIndex         |             181.75 (9.06) |             181.99 (7.36) |  +0.13% |   +2.09% (11.49 pp) |
| throughput/5000/value.sameIndex         |             172.34 (9.78) |             177.72 (6.81) |  +3.12% |     +1.69% (8.5 pp) |
| throughput/10000/value.sameIndex        |               165.6 (8.4) |            161.62 (14.32) |  -2.40% |   -0.51% (13.76 pp) |
| throughput/15000/value.sameIndex        |             168.08 (8.72) |             155.94 (23.6) |  -7.22% |   -3.90% (22.78 pp) |
| throughput/20000/value.sameIndex        |            162.14 (18.39) |            173.32 (60.32) |  +6.90% |   +6.90% (49.08 pp) |
| throughput/25000/value.sameIndex        |            156.02 (13.61) |             162.87 (6.93) |  +4.39% |    +6.23% (2.85 pp) |
| throughput/100/value.tail               |            249.51 (51.47) |            225.34 (22.72) |  -9.69% |   -18.58% (7.48 pp) |
| throughput/1000/value.tail              |            209.74 (16.59) |             216.22 (9.39) |  +3.09% |   +0.36% (10.53 pp) |
| throughput/5000/value.tail              |             199.44 (3.85) |             197.24 (2.35) |  -1.10% |    -1.10% (2.78 pp) |
| throughput/10000/value.tail             |             187.19 (9.15) |             190.35 (5.78) |  +1.69% |    -1.63% (8.57 pp) |
| throughput/15000/value.tail             |            195.28 (12.41) |             190.39 (21.4) |  -2.50% |    +2.42% (7.54 pp) |
| throughput/20000/value.tail             |            180.74 (10.06) |             182.8 (47.06) |  +1.14% |   +2.14% (19.87 pp) |
| throughput/25000/value.tail             |            176.74 (26.38) |            175.69 (10.06) |  -0.59% |    -2.15% (2.74 pp) |
| throughput/100/values                   |          5,223.88 (203.3) |       4,705.82 (1,054.72) |  -9.92% |    -2.23% (11.2 pp) |
| throughput/1000/values                  |     162,374.06 (1,336.09) |     164,337.34 (2,903.13) |  +1.21% |    +2.20% (1.83 pp) |
| throughput/5000/values                  |    539,210.94 (11,367.71) |     552,360.94 (25,362.5) |  +2.44% |    +3.67% (9.11 pp) |
| throughput/10000/values                 |     1,171,900 (91,617.97) | 1,139,467.97 (119,976.56) |  -2.77% |    -4.99% (7.43 pp) |
| throughput/15000/values                 |  1,709,032.81 (33,789.06) |  1,817,960.94 (70,851.56) |  +6.37% |    +7.38% (11.5 pp) |
| throughput/20000/values                 | 2,605,101.56 (372,818.75) | 2,502,420.31 (497,993.75) |  -3.94% |   -3.94% (11.84 pp) |
| throughput/25000/values                 | 3,566,095.31 (578,231.25) | 3,257,171.88 (466,417.19) |  -8.66% |    -2.09% (0.73 pp) |
| throughput/100/values.head              |            339.72 (52.08) |             340.68 (6.13) |  +0.28% |   -6.71% (10.61 pp) |
| throughput/1000/values.head             |            268.78 (12.71) |             278.83 (17.8) |  +3.74% |   +7.58% (20.86 pp) |
| throughput/5000/values.head             |             295.42 (6.89) |            282.56 (36.91) |  -4.35% |   -6.62% (11.64 pp) |
| throughput/10000/values.head            |            312.28 (78.18) |            297.78 (14.83) |  -4.64% |   -1.79% (17.05 pp) |
| throughput/15000/values.head            |            320.15 (85.21) |             260.12 (18.9) | -18.75% |  -16.06% (23.96 pp) |
| throughput/20000/values.head            |            270.76 (13.72) |             278.14 (4.39) |  +2.73% |     +2.42% (1.5 pp) |
| throughput/25000/values.head            |             260.03 (41.4) |             251.63 (7.41) |  -3.23% |     -4.94% (5.8 pp) |
| throughput/100/values.middle            |            301.56 (40.11) |            317.29 (40.24) |  +5.22% |    -5.25% (15.5 pp) |
| throughput/1000/values.middle           |             261.92 (1.89) |            278.18 (18.53) |  +6.21% |    +8.12% (2.38 pp) |
| throughput/5000/values.middle           |             264.9 (17.06) |            270.76 (17.66) |  +2.21% |   +5.42% (12.29 pp) |
| throughput/10000/values.middle          |            334.48 (57.52) |            294.26 (41.46) | -12.02% |   -5.58% (20.18 pp) |
| throughput/15000/values.middle          |            241.19 (20.46) |             245.16 (30.5) |  +1.65% |    +2.00% (6.63 pp) |
| throughput/20000/values.middle          |             301.31 (40.1) |            291.52 (83.85) |  -3.25% |      +7.49% (30 pp) |
| throughput/25000/values.middle          |             233.18 (3.67) |             236.42 (9.17) |  +1.39% |     +2.42% (2.4 pp) |
| throughput/100/values.random            |            341.56 (40.65) |            306.77 (33.29) | -10.19% |    -3.73% (7.54 pp) |
| throughput/1000/values.random           |             288.96 (1.55) |             295.62 (6.85) |  +2.30% |   +4.03% (10.22 pp) |
| throughput/5000/values.random           |            314.98 (39.54) |               329 (28.49) |  +4.45% |    +5.37% (9.25 pp) |
| throughput/10000/values.random          |            352.13 (85.34) |            377.17 (74.52) |  +7.11% |   +0.00% (21.82 pp) |
| throughput/15000/values.random          |              357.44 (3.5) |            350.07 (58.53) |  -2.06% |   -2.04% (18.47 pp) |
| throughput/20000/values.random          |            386.41 (59.32) |             482.22 (5.41) | +24.79% |  +15.63% (25.05 pp) |
| throughput/25000/values.random          |            389.66 (31.97) |             390.2 (19.36) |  +0.14% |    +5.21% (8.09 pp) |
| throughput/100/values.sameIndex         |            297.76 (37.23) |             306.89 (6.56) |  +3.07% |   -3.96% (12.07 pp) |
| throughput/1000/values.sameIndex        |            267.45 (10.31) |            274.38 (13.49) |  +2.59% |    +3.15% (2.86 pp) |
| throughput/5000/values.sameIndex        |             260.16 (3.91) |            256.85 (34.75) |  -1.27% |   -1.50% (12.58 pp) |
| throughput/10000/values.sameIndex       |            288.28 (37.85) |            235.14 (30.33) | -18.43% |   -6.68% (18.53 pp) |
| throughput/15000/values.sameIndex       |            246.54 (28.86) |            241.63 (11.12) |  -1.99% |    -4.21% (7.54 pp) |
| throughput/20000/values.sameIndex       |            241.37 (39.04) |            243.51 (36.43) |  +0.89% |   -5.76% (14.14 pp) |
| throughput/25000/values.sameIndex       |            235.87 (28.73) |            257.56 (34.49) |  +9.20% |  +13.84% (28.71 pp) |
| throughput/100/values.tail              |            303.98 (40.45) |             283.88 (6.07) |  -6.61% |    -4.30% (9.83 pp) |
| throughput/1000/values.tail             |             259.17 (6.22) |             260.45 (5.25) |  +0.49% |    +1.88% (4.23 pp) |
| throughput/5000/values.tail             |             251.62 (2.62) |             254.49 (4.96) |  +1.14% |    -0.20% (1.61 pp) |
| throughput/10000/values.tail            |            294.98 (77.25) |             244.19 (9.67) | -17.22% |  -17.22% (28.87 pp) |
| throughput/15000/values.tail            |             229.27 (4.79) |               240 (60.89) |  +4.68% |   +3.23% (23.36 pp) |
| throughput/20000/values.tail            |            296.56 (65.08) |            257.28 (19.44) | -13.25% |   -2.38% (19.06 pp) |
| throughput/25000/values.tail            |             252.46 (36.9) |            245.91 (18.94) |  -2.59% |    -7.27% (23.5 pp) |
| lifecycle/scaleUp/apply.random          |          3,769.43 (54.14) |         3,802.75 (240.04) |  +0.88% |    +2.22% (7.74 pp) |
| lifecycle/scaleUp/insert.head           |            799.49 (70.29) |             844.66 (33.3) |  +5.65% |    +6.23% (5.91 pp) |
| lifecycle/scaleUp/insert.random         |          1,747.85 (36.04) |          1,834.31 (35.69) |  +4.95% |    +3.57% (4.08 pp) |
| lifecycle/scaleUp/insert.tail           |            782.07 (81.71) |           770.11 (109.97) |  -1.53% |    +1.52% (4.08 pp) |
| lifecycle/scaleUp/remove.random         |          2,715.06 (243.7) |         2,731.34 (336.64) |  +0.60% |    +0.60% (4.63 pp) |
| lifecycle/scaleUp/replace.head          |         2,386.27 (555.73) |           2,533.1 (82.91) |  +6.15% |    +6.43% (6.14 pp) |
| lifecycle/scaleUp/replace.random        |         3,461.28 (286.37) |          3,429.83 (19.21) |  -0.91% |    -0.91% (6.62 pp) |
| lifecycle/scaleUp/replace.tail          |          2,281.49 (96.73) |         2,297.71 (167.58) |  +0.71% |    -1.00% (2.85 pp) |
| lifecycle/scaleUp/value.head            |             306.64 (3.79) |            321.28 (21.11) |  +4.77% |    +3.82% (6.33 pp) |
| lifecycle/scaleUp/value.random          |            1,122.5 (20.1) |           1,158.84 (46.9) |  +3.24% |    -0.93% (4.31 pp) |
| lifecycle/scaleUp/value.tail            |             153.77 (4.89) |             153.69 (4.44) |  -0.05% |    -0.54% (4.15 pp) |
| lifecycle/scaleDown/apply.random        |          3,456.99 (30.78) |         3,424.23 (142.61) |  -0.95% |    -2.39% (5.91 pp) |
| lifecycle/scaleDown/insert.random       |           1,713.3 (81.87) |          1,734.94 (42.42) |  +1.26% |    +2.00% (6.75 pp) |
| lifecycle/scaleDown/remove.head         |          1,931.39 (49.95) |           1,933.5 (24.66) |  +0.11% |    -0.72% (5.37 pp) |
| lifecycle/scaleDown/remove.random       |          2,660.33 (15.53) |         2,697.51 (211.74) |  +1.40% |    -3.61% (8.53 pp) |
| lifecycle/scaleDown/remove.tail         |          1,743.95 (19.06) |          1,723.31 (42.09) |  -1.18% |    -2.09% (0.61 pp) |
| lifecycle/scaleDown/replace.head        |         2,610.99 (104.92) |          2,565.5 (142.08) |  -1.74% |    -0.70% (3.18 pp) |
| lifecycle/scaleDown/replace.random      |          3,391.2 (187.46) |         3,221.34 (116.56) |  -5.01% |       -2.67% (5 pp) |
| lifecycle/scaleDown/replace.tail        |      19,551.35 (1,085.23) |        19,008.85 (472.27) |  -2.77% |    -2.77% (5.33 pp) |
| lifecycle/scaleDown/value.head          |                418.24 (7) |             412.63 (4.99) |  -1.34% |    -1.53% (6.02 pp) |
| lifecycle/scaleDown/value.random        |          1,064.07 (25.05) |          1,064.02 (43.77) |  -0.00% |    -3.49% (5.97 pp) |
| lifecycle/scaleDown/value.tail          |            234.48 (14.16) |             230.54 (4.97) |  -1.68% |    -4.93% (4.21 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,643.73 (115.76) |         3,733.48 (360.88) |  +2.46% |   +0.44% (11.56 pp) |
| lifecycle/fullLifecycle/insert.head     |            799.49 (70.29) |             844.66 (33.3) |  +5.65% |    +6.23% (5.91 pp) |
| lifecycle/fullLifecycle/insert.random   |          1,733.71 (50.25) |           1,772.15 (46.4) |  +2.22% |    +3.10% (4.76 pp) |
| lifecycle/fullLifecycle/insert.tail     |            782.07 (81.71) |           770.11 (109.97) |  -1.53% |    +1.52% (4.08 pp) |
| lifecycle/fullLifecycle/remove.head     |          1,931.39 (49.95) |           1,933.5 (24.66) |  +0.11% |    -0.72% (5.37 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,692.16 (190.93) |          2,732.56 (93.26) |  +1.50% |    +2.67% (6.27 pp) |
| lifecycle/fullLifecycle/remove.tail     |          1,743.95 (19.06) |          1,723.31 (42.09) |  -1.18% |    -2.09% (0.61 pp) |
| lifecycle/fullLifecycle/replace.head    |         2,585.01 (230.53) |         2,590.16 (213.77) |  +0.20% |    +0.24% (1.34 pp) |
| lifecycle/fullLifecycle/replace.random  |           3,415.78 (66.1) |          3,330.11 (63.36) |  -2.51% |    -2.51% (1.04 pp) |
| lifecycle/fullLifecycle/replace.tail    |        10,916.42 (386.55) |        10,683.46 (143.87) |  -2.13% |    -2.61% (3.89 pp) |
| lifecycle/fullLifecycle/value.head      |               363.6 (6.3) |             366.31 (5.25) |  +0.75% |    +0.75% (2.82 pp) |
| lifecycle/fullLifecycle/value.random    |          1,102.04 (50.72) |          1,091.49 (61.46) |  -0.96% |     -3.05% (3.8 pp) |
| lifecycle/fullLifecycle/value.tail      |             195.97 (6.07) |             193.52 (3.45) |  -1.25% |    -2.06% (4.56 pp) |
| checkpoint/up/1000/create               |          427,900 (50,300) |          416,000 (23,800) |  -2.78% |   -3.60% (22.04 pp) |
| checkpoint/up/1000/sequence             |       2,515,700 (140,900) |        2,597,800 (15,300) |  +3.26% |    +3.26% (8.96 pp) |
| checkpoint/up/1000/values               |        1,780,900 (67,800) |       1,777,400 (110,700) |  -0.20% |    -0.13% (9.77 pp) |
| checkpoint/up/5000/create               |           897,000 (5,000) |          906,400 (91,600) |  +1.05% |    +2.16% (9.61 pp) |
| checkpoint/up/5000/sequence             |     7,919,700 (1,020,800) |       8,545,500 (847,200) |  +7.90% |    +4.96% (4.24 pp) |
| checkpoint/up/5000/values               |       4,511,200 (679,300) |       4,762,800 (621,500) |  +5.58% |    -2.22% (8.62 pp) |
| checkpoint/up/10000/create              |       1,589,300 (143,100) |       1,613,300 (160,600) |  +1.51% |   +8.47% (20.52 pp) |
| checkpoint/up/10000/sequence            |      13,019,900 (319,400) |      13,075,700 (501,700) |  +0.43% |    +1.26% (1.18 pp) |
| checkpoint/up/10000/values              |      20,226,600 (277,000) |      20,565,700 (756,700) |  +1.68% |    +1.68% (4.53 pp) |
| checkpoint/up/15000/create              |       2,443,800 (152,600) |       2,556,600 (294,100) |  +4.62% |    +2.46% (12.4 pp) |
| checkpoint/up/15000/sequence            |    14,704,200 (1,282,400) |    14,646,200 (2,251,900) |  -0.39% |   +0.57% (22.51 pp) |
| checkpoint/up/15000/values              |      30,077,900 (353,200) |      30,508,300 (582,000) |  +1.43% |    +1.11% (8.59 pp) |
| checkpoint/up/20000/create              |       3,454,000 (244,700) |       3,481,800 (281,200) |  +0.80% |    +1.21% (3.26 pp) |
| checkpoint/up/20000/sequence            |    22,243,700 (1,450,900) |    23,382,800 (1,316,300) |  +5.12% |   +4.04% (13.56 pp) |
| checkpoint/up/20000/values              |      10,764,800 (209,200) |    10,913,900 (1,379,600) |  +1.39% |   +1.39% (12.46 pp) |
| checkpoint/up/25000/create              |        3,992,300 (63,500) |       4,009,100 (447,700) |  +0.42% |   -0.05% (12.67 pp) |
| checkpoint/up/25000/sequence            |    24,718,600 (1,611,400) |    23,946,900 (5,996,000) |  -3.12% |   -0.78% (24.96 pp) |
| checkpoint/up/25000/values              |      12,596,500 (595,300) |    11,933,100 (1,079,200) |  -5.27% |   -5.27% (18.04 pp) |
| checkpoint/down/20000/create            |        3,454,100 (62,100) |       3,443,300 (306,000) |  -0.31% |    -2.37% (5.64 pp) |
| checkpoint/down/20000/sequence          |    19,182,000 (2,409,000) |      18,969,400 (421,100) |  -1.11% |    -2.06% (4.98 pp) |
| checkpoint/down/20000/values            |       9,642,200 (538,400) |        9,232,100 (79,200) |  -4.25% |     -2.48% (2.8 pp) |
| checkpoint/down/15000/create            |        2,443,200 (57,400) |        2,442,800 (24,200) |  -0.02% |    -0.71% (3.15 pp) |
| checkpoint/down/15000/sequence          |    15,937,200 (1,046,700) |      15,855,700 (187,400) |  -0.51% |    -0.58% (4.92 pp) |
| checkpoint/down/15000/values            |       7,445,700 (652,200) |       7,151,700 (292,400) |  -3.95% |    -3.59% (4.68 pp) |
| checkpoint/down/10000/create            |        1,654,700 (35,600) |        1,698,000 (34,000) |  +2.62% |    +0.68% (0.84 pp) |
| checkpoint/down/10000/sequence          |      12,791,300 (435,600) |      13,271,400 (437,300) |  +3.75% |    +1.49% (4.66 pp) |
| checkpoint/down/10000/values            |       5,595,500 (679,600) |       5,552,500 (339,900) |  -0.77% |   +8.51% (14.68 pp) |
| checkpoint/down/5000/create             |          834,800 (52,500) |          793,300 (10,600) |  -4.97% |     -2.78% (4.7 pp) |
| checkpoint/down/5000/sequence           |    11,161,800 (5,267,900) |       9,707,500 (178,000) | -13.03% |  -11.83% (37.99 pp) |
| checkpoint/down/5000/values             |       3,254,300 (459,900) |       2,512,100 (418,600) | -22.81% |  -19.16% (13.99 pp) |
| checkpoint/down/1000/create             |          165,700 (20,500) |          159,900 (12,800) |  -3.50% |   +1.51% (22.16 pp) |
| checkpoint/down/1000/sequence           |       6,189,700 (375,500) |     6,422,300 (1,198,900) |  +3.76% |  +11.73% (23.72 pp) |
| checkpoint/down/1000/values             |          564,600 (67,800) |          538,600 (29,300) |  -4.61% |    +1.56% (7.36 pp) |
| checkpoint/down/0/create                |            15,200 (1,000) |              14,600 (300) |  -3.95% |   -0.68% (18.24 pp) |
| checkpoint/down/0/sequence              |       1,563,400 (297,100) |       1,360,700 (233,300) | -12.97% |   -0.75% (16.41 pp) |
| checkpoint/down/0/values                |            12,700 (6,300) |              10,300 (800) | -18.90% |  -14.96% (23.32 pp) |
| tuple/projection/2/create.empty         |            358.21 (14.09) |            351.54 (12.99) |  -1.86% |    -0.70% (2.06 pp) |
| tuple/tuple/2/create.empty              |              439.19 (9.8) |            430.39 (19.08) |  -2.00% |    -3.90% (3.75 pp) |
| tuple/projection/2/create.sequence      |         1,275.74 (226.07) |          1,269.25 (89.27) |  -0.51% |   +4.70% (10.49 pp) |
| tuple/tuple/2/create.sequence           |          1,427.81 (68.74) |          1,431.09 (46.11) |  +0.23% |   +2.75% (12.41 pp) |
| tuple/projection/2/replace.random       |         1,089.05 (230.27) |           1,044.1 (20.98) |  -4.13% |   +0.11% (17.26 pp) |
| tuple/tuple/2/replace.random            |            724.65 (10.62) |           785.13 (131.26) |  +8.35% |    +8.43% (9.81 pp) |
| tuple/projection/2/apply.replace        |         1,794.52 (217.09) |         1,934.58 (294.75) |  +7.80% |   +7.80% (36.21 pp) |
| tuple/tuple/2/apply.replace             |          1,198.64 (61.91) |         1,276.62 (341.26) |  +6.51% |    +6.51% (33.5 pp) |
| tuple/projection/2/apply.duplicate      |            660.58 (22.72) |            723.19 (53.44) |  +9.48% |  +11.68% (18.75 pp) |
| tuple/tuple/2/apply.duplicate           |             662.8 (32.82) |           707.18 (115.01) |  +6.70% |   +9.54% (14.69 pp) |
| tuple/projection/2/merge.duplicate      |            688.74 (58.69) |            648.25 (77.31) |  -5.88% |    -5.31% (2.49 pp) |
| tuple/tuple/2/merge.duplicate           |            672.42 (19.59) |            700.01 (88.84) |  +4.10% |   -1.73% (12.35 pp) |
| tuple/projection/2/length               |               7.64 (0.27) |                7.58 (0.1) |  -0.81% |    -0.92% (4.68 pp) |
| tuple/tuple/2/length                    |               7.98 (0.78) |               7.35 (0.19) |  -7.86% |    -4.95% (6.41 pp) |
| tuple/projection/2/value.random         |               30.1 (0.78) |              31.37 (3.29) |  +4.25% |    -4.16% (7.39 pp) |
| tuple/tuple/2/value.random              |             19.53 (16.88) |              18.69 (0.55) |  -4.30% |   -4.30% (45.69 pp) |
| tuple/projection/2/values               |             82.17 (29.52) |              78.15 (0.91) |  -4.90% |   -8.06% (25.85 pp) |
| tuple/tuple/2/values                    |                79.79 (15) |              85.78 (6.79) |  +7.51% |   +1.64% (10.55 pp) |
| tuple/projection/2/sequence             |            490.73 (41.64) |            516.88 (60.49) |  +5.33% |    +0.88% (7.88 pp) |
| tuple/tuple/2/sequence                  |           526.55 (114.84) |            477.26 (80.75) |  -9.36% |   -1.21% (34.01 pp) |
| tuple/projection/4/create.empty         |            441.67 (13.94) |            431.68 (41.84) |  -2.26% |    -2.26% (5.68 pp) |
| tuple/tuple/4/create.empty              |            443.96 (21.41) |            450.24 (14.57) |  +1.42% |   +5.40% (10.99 pp) |
| tuple/projection/4/create.sequence      |          1,718.8 (110.56) |          1,780.53 (29.31) |  +3.59% |   -0.16% (15.49 pp) |
| tuple/tuple/4/create.sequence           |         1,716.95 (234.91) |          1,622.98 (34.86) |  -5.47% |   -6.44% (15.58 pp) |
| tuple/projection/4/replace.random       |          1,171.59 (73.75) |          1,130.91 (34.77) |  -3.47% |    -4.19% (4.06 pp) |
| tuple/tuple/4/replace.random            |            650.57 (75.32) |            663.41 (37.17) |  +1.97% |   +2.00% (16.14 pp) |
| tuple/projection/4/apply.replace        |         1,812.42 (137.53) |          1,723.1 (143.39) |  -4.93% |   -8.32% (15.56 pp) |
| tuple/tuple/4/apply.replace             |          1,148.54 (30.09) |          1,062.01 (65.62) |  -7.53% |    -7.55% (4.73 pp) |
| tuple/projection/4/apply.duplicate      |            618.61 (81.44) |            605.17 (27.84) |  -2.17% |   -7.83% (10.51 pp) |
| tuple/tuple/4/apply.duplicate           |             606.3 (30.74) |            641.47 (24.24) |  +5.80% |    +6.07% (8.63 pp) |
| tuple/projection/4/merge.duplicate      |            774.51 (57.49) |             764.57 (1.55) |  -1.28% |    -1.28% (9.06 pp) |
| tuple/tuple/4/merge.duplicate           |           866.89 (159.36) |                798 (7.69) |  -7.95% |    -5.43% (21.7 pp) |
| tuple/projection/4/length               |             26.96 (18.96) |              26.49 (1.06) |  -1.73% |   -4.35% (10.59 pp) |
| tuple/tuple/4/length                    |             26.33 (18.46) |              26.79 (0.93) |  +1.74% |   +0.19% (20.41 pp) |
| tuple/projection/4/value.random         |              42.48 (2.83) |              40.99 (0.18) |  -3.50% |    -3.87% (0.85 pp) |
| tuple/tuple/4/value.random              |              18.44 (0.74) |              18.03 (0.84) |  -2.26% |    +0.34% (6.69 pp) |
| tuple/projection/4/values               |            143.38 (37.79) |             146.85 (2.78) |  +2.42% |    +3.56% (10.3 pp) |
| tuple/tuple/4/values                    |               138 (20.75) |            142.43 (16.15) |  +3.21% |  +10.84% (10.75 pp) |
| tuple/projection/4/sequence             |            465.89 (37.15) |            508.84 (77.16) |  +9.22% |    +6.87% (7.77 pp) |
| tuple/tuple/4/sequence                  |             558.71 (6.27) |             558.93 (4.52) |  +0.04% |    -0.47% (9.24 pp) |
| tuple/projection/8/create.empty         |              417.5 (19.1) |             421.67 (4.31) |  +1.00% |    -1.97% (3.28 pp) |
| tuple/tuple/8/create.empty              |            439.64 (19.97) |            448.28 (22.93) |  +1.96% |    +0.19% (3.05 pp) |
| tuple/projection/8/create.sequence      |          2,271.96 (41.07) |         2,205.73 (177.85) |  -2.92% |    -0.27% (8.58 pp) |
| tuple/tuple/8/create.sequence           |          2,020.2 (115.78) |          2,114.69 (99.48) |  +4.68% |    +2.85% (8.14 pp) |
| tuple/projection/8/replace.random       |          1,224.02 (74.41) |          1,180.23 (59.37) |  -3.58% |    -0.81% (3.92 pp) |
| tuple/tuple/8/replace.random            |            645.87 (19.24) |            659.01 (46.21) |  +2.03% |    +1.77% (4.76 pp) |
| tuple/projection/8/apply.replace        |          1,739.51 (88.28) |          1,828.41 (79.31) |  +5.11% |    +3.26% (5.19 pp) |
| tuple/tuple/8/apply.replace             |          1,020.03 (66.12) |          1,091.46 (56.19) |  +7.00% |    +4.70% (3.56 pp) |
| tuple/projection/8/apply.duplicate      |            624.04 (11.04) |            659.39 (99.74) |  +5.66% |   +4.99% (21.26 pp) |
| tuple/tuple/8/apply.duplicate           |             624.45 (7.09) |             649.46 (23.5) |  +4.01% |    +1.28% (2.25 pp) |
| tuple/projection/8/merge.duplicate      |          1,086.96 (52.28) |          1,126.78 (38.07) |  +3.66% |    -1.11% (6.44 pp) |
| tuple/tuple/8/merge.duplicate           |          1,144.99 (23.86) |          1,181.14 (15.17) |  +3.16% |    +0.44% (8.96 pp) |
| tuple/projection/8/length               |              26.2 (16.53) |              26.46 (5.05) |  +1.01% |   -0.82% (40.63 pp) |
| tuple/tuple/8/length                    |              26.18 (15.3) |              26.37 (0.76) |  +0.71% |   -5.15% (13.08 pp) |
| tuple/projection/8/value.random         |                 56.65 (4) |              52.25 (0.69) |  -7.77% |    -7.37% (7.82 pp) |
| tuple/tuple/8/value.random              |              17.58 (1.27) |              17.49 (0.38) |  -0.54% |    -0.59% (8.29 pp) |
| tuple/projection/8/values               |              226.12 (7.8) |            220.34 (16.26) |  -2.56% |   -0.08% (11.52 pp) |
| tuple/tuple/8/values                    |             197.2 (18.83) |              212.92 (6.3) |  +7.97% |   +7.79% (15.74 pp) |
| tuple/projection/8/sequence             |             657.11 (9.86) |            646.48 (19.28) |  -1.62% |    -0.58% (4.09 pp) |
| tuple/tuple/8/sequence                  |             693.5 (46.66) |            681.78 (21.65) |  -1.69% |    +0.45% (1.18 pp) |
| tuple/projection/100/create.empty       |             466.48 (38.5) |             444.94 (5.34) |  -4.62% |    -3.62% (8.27 pp) |
| tuple/tuple/100/create.empty            |            487.17 (80.77) |            481.95 (21.92) |  -1.07% |    -4.35% (7.22 pp) |
| tuple/projection/100/create.sequence    |      14,141.77 (1,580.83) |        14,083.37 (342.27) |  -0.41% |   -2.85% (11.46 pp) |
| tuple/tuple/100/create.sequence         |       11,792.47 (1,298.5) |        11,359.66 (120.81) |  -3.67% |   -2.21% (14.72 pp) |
| tuple/projection/100/replace.random     |          1,252.63 (10.55) |          1,221.45 (26.43) |  -2.49% |    -2.49% (7.96 pp) |
| tuple/tuple/100/replace.random          |             641.2 (13.47) |            632.58 (18.27) |  -1.34% |    -1.34% (9.18 pp) |
| tuple/projection/100/apply.replace      |           1,812.54 (52.1) |          1,758.07 (30.44) |  -3.01% |    -2.10% (4.13 pp) |
| tuple/tuple/100/apply.replace           |           1,002.99 (9.17) |          1,041.05 (79.01) |  +3.79% |    -0.60% (8.17 pp) |
| tuple/projection/100/apply.duplicate    |             643.7 (41.17) |                626 (9.84) |  -2.75% |    +3.78% (7.21 pp) |
| tuple/tuple/100/apply.duplicate         |            657.83 (30.51) |            620.38 (14.64) |  -5.69% |    -4.16% (5.17 pp) |
| tuple/projection/100/merge.duplicate    |         9,165.73 (572.67) |         9,622.31 (409.55) |  +4.98% |   +0.04% (15.39 pp) |
| tuple/tuple/100/merge.duplicate         |        13,164.14 (426.88) |        13,387.65 (477.78) |  +1.70% |     +1.70% (9.8 pp) |
| tuple/projection/100/length             |             25.78 (17.68) |              27.68 (2.71) |  +7.35% |   +5.27% (26.08 pp) |
| tuple/tuple/100/length                  |             25.65 (18.47) |              26.46 (2.18) |  +3.18% |   +0.10% (24.18 pp) |
| tuple/projection/100/value.random       |              73.38 (6.38) |              79.91 (4.03) |  +8.90% |     +4.72% (6.5 pp) |
| tuple/tuple/100/value.random            |              18.27 (0.97) |              18.33 (0.52) |  +0.33% |    +1.07% (8.15 pp) |
| tuple/projection/100/values             |         1,836.99 (101.62) |          1,860.05 (34.03) |  +1.26% |    -1.29% (2.38 pp) |
| tuple/tuple/100/values                  |          1,549.02 (25.12) |          1,544.04 (87.74) |  -0.32% |    +1.11% (3.43 pp) |
| tuple/projection/100/sequence           |         6,237.17 (111.28) |         6,264.76 (230.19) |  +0.44% |     +0.42% (5.7 pp) |
| tuple/tuple/100/sequence                |         5,716.32 (647.57) |         5,735.18 (347.33) |  +0.33% |   -2.30% (10.09 pp) |

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
