# Complete public API guard

5 complete matched runs per build. Before: baseline; candidate: text-opt-in. Median and IQR; lower is better. Every valid sample is retained. Excluding length, 67 timing medians improve over 5%; 104 slow over 5%. Length remains shown as a control. The acceptance limit is a reproducible slowdown above 5%; follow-up controls and the decision are in the round record.

## Timings

Nanoseconds per call.

| Method / checkpoint                     |              Before (IQR) |           Candidate (IQR) |  Change | Paired change (IQR) |
| --------------------------------------- | ------------------------: | ------------------------: | ------: | ------------------: |
| throughput/100/apply.duplicate          |             777.83 (64.2) |             850.93 (64.7) |  +9.40% |   +7.74% (28.82 pp) |
| throughput/1000/apply.duplicate         |            770.5 (134.29) |            842.22 (25.83) |  +9.31% |  +13.44% (16.83 pp) |
| throughput/5000/apply.duplicate         |             358.82 (3.82) |            393.23 (20.23) |  +9.59% |    +9.23% (4.85 pp) |
| throughput/10000/apply.duplicate        |            337.04 (54.02) |             337.38 (22.7) |  +0.10% |   -1.75% (15.38 pp) |
| throughput/15000/apply.duplicate        |             333.3 (28.69) |               318 (15.02) |  -4.59% |    -5.75% (9.93 pp) |
| throughput/20000/apply.duplicate        |            343.68 (12.75) |            317.71 (29.92) |  -7.56% |   -10.05% (3.74 pp) |
| throughput/25000/apply.duplicate        |            308.32 (46.15) |             309.04 (4.57) |  +0.23% |   -2.76% (16.32 pp) |
| throughput/100/apply.duplicateRemove    |         1,517.26 (112.42) |          1,377.71 (169.8) |  -9.20% |   -6.65% (20.71 pp) |
| throughput/1000/apply.duplicateRemove   |           801.61 (142.11) |            832.67 (15.47) |  +3.87% |    +3.46% (4.84 pp) |
| throughput/5000/apply.duplicateRemove   |             742.49 (35.3) |            822.04 (53.93) | +10.71% |   +6.14% (10.49 pp) |
| throughput/10000/apply.duplicateRemove  |            692.06 (31.45) |           756.51 (314.94) |  +9.31% |   +5.97% (60.92 pp) |
| throughput/15000/apply.duplicateRemove  |            702.09 (37.27) |            659.39 (43.45) |  -6.08% |    -3.37% (3.74 pp) |
| throughput/20000/apply.duplicateRemove  |            766.99 (64.31) |             677.15 (24.1) | -11.71% |    -7.62% (4.14 pp) |
| throughput/25000/apply.duplicateRemove  |             684.9 (71.84) |            654.81 (15.23) |  -4.39% |   +3.02% (11.13 pp) |
| throughput/100/apply.duplicateReplace   |         1,372.06 (129.72) |            909.68 (61.74) | -33.70% |  -34.24% (12.24 pp) |
| throughput/1000/apply.duplicateReplace  |         1,133.67 (113.11) |           1,031.9 (19.59) |  -8.98% |    -5.76% (9.94 pp) |
| throughput/5000/apply.duplicateReplace  |            879.79 (34.31) |            956.98 (78.03) |  +8.77% |    +1.30% (9.31 pp) |
| throughput/10000/apply.duplicateReplace |            881.54 (40.43) |           903.07 (120.77) |  +2.44% |   -3.84% (11.13 pp) |
| throughput/15000/apply.duplicateReplace |            838.14 (63.79) |            868.67 (72.62) |  +3.64% |   +0.44% (16.92 pp) |
| throughput/20000/apply.duplicateReplace |            856.33 (78.98) |             818.7 (41.88) |  -4.39% |   -0.69% (12.18 pp) |
| throughput/25000/apply.duplicateReplace |              819.72 (146) |            791.23 (54.68) |  -3.48% |   +5.67% (15.77 pp) |
| throughput/100/apply.insert             |          1,811.57 (80.94) |          2,028.3 (217.39) | +11.96% |  +15.13% (14.27 pp) |
| throughput/1000/apply.insert            |         1,401.31 (117.96) |         1,447.06 (189.96) |  +3.26% |   +0.28% (13.49 pp) |
| throughput/5000/apply.insert            |          1,326.27 (76.49) |          1,326.25 (248.1) |  -0.00% |   +6.71% (12.21 pp) |
| throughput/10000/apply.insert           |          1,323.05 (106.3) |         1,490.56 (210.33) | +12.66% |   +4.42% (17.01 pp) |
| throughput/15000/apply.insert           |         1,312.87 (122.83) |          1,326.23 (81.87) |  +1.02% |    -1.40% (9.23 pp) |
| throughput/20000/apply.insert           |          1,259.39 (38.13) |           1,209.2 (28.77) |  -3.99% |    -2.13% (1.23 pp) |
| throughput/25000/apply.insert           |         1,299.44 (203.95) |            1,267.5 (45.1) |  -2.46% |    -3.11% (6.03 pp) |
| throughput/100/apply.remove             |         1,432.47 (206.32) |          1,790.71 (81.73) | +25.01% |  +24.38% (21.07 pp) |
| throughput/1000/apply.remove            |         1,518.28 (200.51) |         1,508.06 (108.47) |  -0.67% |    -0.67% (1.35 pp) |
| throughput/5000/apply.remove            |          1,496.86 (19.46) |          1,519.18 (65.93) |  +1.49% |    +3.56% (7.41 pp) |
| throughput/10000/apply.remove           |           1,572.5 (67.43) |          1,574.91 (60.69) |  +0.15% |    +1.30% (5.27 pp) |
| throughput/15000/apply.remove           |         1,524.58 (184.88) |          1,533.17 (89.27) |  +0.56% |    -1.81% (4.31 pp) |
| throughput/20000/apply.remove           |            1,525.47 (134) |          1,510.77 (82.95) |  -0.96% |    +0.81% (4.47 pp) |
| throughput/25000/apply.remove           |         1,707.31 (156.86) |          1,514.56 (24.46) | -11.29% |   -10.31% (7.13 pp) |
| throughput/100/apply.replace            |           2,455.71 (8.52) |          2,709.4 (276.33) | +10.33% |   +10.68% (6.85 pp) |
| throughput/1000/apply.replace           |           2,678.8 (50.46) |          2,778.42 (88.45) |  +3.72% |    +1.35% (3.77 pp) |
| throughput/5000/apply.replace           |          2,702.87 (103.4) |          2,782.37 (45.71) |  +2.94% |    +3.08% (5.69 pp) |
| throughput/10000/apply.replace          |         2,840.35 (354.98) |          2,727.79 (85.07) |  -3.96% |    -3.96% (6.26 pp) |
| throughput/15000/apply.replace          |          2,857.11 (198.5) |          2,696.81 (36.64) |  -5.61% |    -4.24% (7.82 pp) |
| throughput/20000/apply.replace          |         2,724.89 (120.91) |         2,684.95 (110.04) |  -1.47% |    +2.78% (4.67 pp) |
| throughput/25000/apply.replace          |          2,754.81 (90.22) |         2,930.42 (332.14) |  +6.37% |    +2.47% (6.08 pp) |
| throughput/100/create.empty             |            620.31 (83.57) |           607.77 (120.77) |  -2.02% |    -2.02% (17.6 pp) |
| throughput/1000/create.empty            |             712.1 (61.21) |            714.48 (81.68) |  +0.33% |    +1.36% (3.71 pp) |
| throughput/5000/create.empty            |            794.58 (98.35) |           755.94 (141.97) |  -4.86% |   -4.97% (29.11 pp) |
| throughput/10000/create.empty           |           834.63 (448.57) |            787.25 (68.22) |  -5.68% |   -5.68% (55.09 pp) |
| throughput/15000/create.empty           |            906.41 (95.25) |            737.55 (35.85) | -18.63% |  -19.73% (11.73 pp) |
| throughput/20000/create.empty           |             794.5 (88.53) |            730.26 (59.15) |  -8.09% |       -8.51% (6 pp) |
| throughput/25000/create.empty           |            775.73 (27.37) |           723.06 (115.82) |  -6.79% |  -17.21% (24.12 pp) |
| throughput/100/create.sequence          |          1,536.96 (62.18) |         1,581.61 (131.54) |  +2.91% |     -0.20% (4.1 pp) |
| throughput/1000/create.sequence         |         1,945.52 (116.17) |         1,854.94 (149.91) |  -4.66% |    -2.09% (7.56 pp) |
| throughput/5000/create.sequence         |         1,709.37 (245.04) |         1,595.04 (328.18) |  -6.69% |    -2.73% (8.12 pp) |
| throughput/10000/create.sequence        |         1,703.33 (156.22) |         1,649.68 (174.36) |  -3.15% |     -3.15% (2.9 pp) |
| throughput/15000/create.sequence        |          1,536.64 (54.77) |          1,456.53 (23.57) |  -5.21% |    -5.21% (4.89 pp) |
| throughput/20000/create.sequence        |          1,667.21 (39.12) |          1,612.86 (94.64) |  -3.26% |    -3.28% (9.57 pp) |
| throughput/25000/create.sequence        |         1,693.76 (250.94) |         1,435.75 (266.03) | -15.23% |    -7.09% (3.53 pp) |
| throughput/100/insert.head              |            533.66 (13.74) |             532.19 (15.4) |  -0.28% |   -1.28% (12.87 pp) |
| throughput/1000/insert.head             |              553.5 (6.72) |            545.02 (51.24) |  -1.53% |   -1.50% (26.04 pp) |
| throughput/5000/insert.head             |            559.32 (21.98) |            544.94 (32.72) |  -2.57% |    +0.47% (9.17 pp) |
| throughput/10000/insert.head            |           563.71 (180.93) |               576.58 (73) |  +2.28% |   +2.28% (39.89 pp) |
| throughput/15000/insert.head            |             515.95 (75.8) |             515.8 (41.03) |  -0.03% |   -4.84% (19.71 pp) |
| throughput/20000/insert.head            |            494.11 (14.95) |            531.13 (21.26) |  +7.49% |   +7.49% (15.64 pp) |
| throughput/25000/insert.head            |            483.61 (19.72) |            525.42 (81.64) |  +8.65% |   +7.49% (15.17 pp) |
| throughput/100/insert.middle            |               672.14 (52) |            637.76 (37.95) |  -5.12% |   -2.70% (10.24 pp) |
| throughput/1000/insert.middle           |            656.86 (26.43) |            655.63 (38.67) |  -0.19% |     +3.26% (7.1 pp) |
| throughput/5000/insert.middle           |             655.86 (76.3) |            627.75 (19.06) |  -4.29% |    -4.87% (8.49 pp) |
| throughput/10000/insert.middle          |            644.99 (83.92) |            650.38 (27.97) |  +0.84% |   +7.42% (11.17 pp) |
| throughput/15000/insert.middle          |            641.58 (64.58) |            693.65 (87.46) |  +8.12% |      +6.96% (14 pp) |
| throughput/20000/insert.middle          |            652.79 (23.84) |               632.33 (60) |  -3.13% |    -3.13% (8.32 pp) |
| throughput/25000/insert.middle          |            609.85 (91.78) |            662.31 (34.13) |  +8.60% |    +8.07% (6.64 pp) |
| throughput/100/insert.random            |            924.02 (64.49) |             870.18 (33.7) |  -5.83% |   -7.70% (11.18 pp) |
| throughput/1000/insert.random           |            931.94 (39.07) |          1,000.86 (45.97) |  +7.40% |   +10.17% (9.17 pp) |
| throughput/5000/insert.random           |            940.69 (23.98) |             956.58 (7.55) |  +1.69% |    +1.69% (9.98 pp) |
| throughput/10000/insert.random          |            953.83 (29.52) |           990.72 (184.48) |  +3.87% |   +5.64% (35.24 pp) |
| throughput/15000/insert.random          |            876.42 (45.92) |            910.52 (45.79) |  +3.89% |   +3.89% (12.85 pp) |
| throughput/20000/insert.random          |           936.54 (126.94) |             890.81 (27.3) |  -4.88% |   -4.88% (11.88 pp) |
| throughput/25000/insert.random          |           939.23 (149.06) |            950.56 (38.65) |  +1.21% |   +0.15% (10.62 pp) |
| throughput/100/insert.sameIndex         |           736.07 (215.89) |            548.71 (28.16) | -25.45% |  -25.45% (33.62 pp) |
| throughput/1000/insert.sameIndex        |            573.59 (10.14) |             606.9 (32.54) |  +5.81% |    +7.96% (5.58 pp) |
| throughput/5000/insert.sameIndex        |             587.3 (21.64) |            602.31 (57.26) |  +2.56% |    +2.56% (2.94 pp) |
| throughput/10000/insert.sameIndex       |             573.84 (27.9) |           605.78 (127.32) |  +5.57% |   +9.44% (16.86 pp) |
| throughput/15000/insert.sameIndex       |            532.26 (71.57) |           639.27 (223.28) | +20.10% |  +21.20% (34.51 pp) |
| throughput/20000/insert.sameIndex       |            554.77 (37.81) |            583.12 (34.64) |  +5.11% |   +5.11% (16.51 pp) |
| throughput/25000/insert.sameIndex       |            550.33 (41.91) |            549.15 (49.89) |  -0.21% |   -1.24% (16.48 pp) |
| throughput/100/insert.tail              |             861.08 (90.6) |            911.07 (37.45) |  +5.81% |    +6.21% (5.52 pp) |
| throughput/1000/insert.tail             |           878.58 (156.56) |           855.39 (149.09) |  -2.64% |    +4.82% (5.91 pp) |
| throughput/5000/insert.tail             |            881.7 (122.03) |          1,002.08 (95.89) | +13.65% |   +9.17% (11.77 pp) |
| throughput/10000/insert.tail            |           911.12 (129.83) |           917.93 (111.11) |  +0.75% |    -0.14% (9.79 pp) |
| throughput/15000/insert.tail            |            803.63 (11.81) |           903.18 (186.92) | +12.39% |  +11.03% (14.07 pp) |
| throughput/20000/insert.tail            |            934.57 (84.62) |            842.81 (121.8) |  -9.82% |    -4.36% (7.21 pp) |
| throughput/25000/insert.tail            |           873.28 (205.82) |             908.6 (84.99) |  +4.04% |   +4.39% (15.47 pp) |
| throughput/100/length                   |            135.57 (21.96) |            121.53 (21.81) | -10.36% |   -3.20% (23.55 pp) |
| throughput/1000/length                  |             113.63 (3.96) |            112.27 (13.24) |  -1.20% |  +10.02% (14.36 pp) |
| throughput/5000/length                  |             115.75 (3.36) |             120.33 (0.41) |  +3.96% |    +4.27% (4.65 pp) |
| throughput/10000/length                 |             113.62 (1.18) |             116.92 (3.71) |  +2.90% |   +6.17% (11.07 pp) |
| throughput/15000/length                 |             114.45 (11.6) |            112.83 (20.87) |  -1.42% |   +6.16% (20.99 pp) |
| throughput/20000/length                 |             115.8 (42.75) |             113.21 (12.2) |  -2.24% |   -4.07% (20.16 pp) |
| throughput/25000/length                 |              116.84 (4.6) |             108.13 (3.91) |  -7.45% |    -7.45% (7.23 pp) |
| throughput/100/merge.duplicate          |            904.53 (89.94) |            850.06 (46.32) |  -6.02% |    -2.87% (8.53 pp) |
| throughput/1000/merge.duplicate         |            650.45 (40.74) |            674.45 (67.86) |  +3.69% |     +9.34% (3.5 pp) |
| throughput/5000/merge.duplicate         |            647.68 (95.43) |            660.76 (39.61) |  +2.02% |    +1.77% (14.6 pp) |
| throughput/10000/merge.duplicate        |            631.61 (32.27) |            633.57 (32.06) |  +0.31% |    +2.30% (4.36 pp) |
| throughput/15000/merge.duplicate        |            604.48 (14.14) |            651.17 (53.83) |  +7.72% |   +5.59% (12.94 pp) |
| throughput/20000/merge.duplicate        |            591.32 (23.71) |            609.35 (47.78) |  +3.05% |    +4.21% (4.57 pp) |
| throughput/25000/merge.duplicate        |             621.09 (4.32) |             565.32 (43.8) |  -8.98% |    -1.95% (9.69 pp) |
| throughput/100/merge.insert             |          1,920.5 (251.95) |          1,830.71 (97.36) |  -4.68% |   -5.38% (11.26 pp) |
| throughput/1000/merge.insert            |         1,665.57 (102.97) |          1,605.49 (58.97) |  -3.61% |    -6.43% (4.24 pp) |
| throughput/5000/merge.insert            |         1,566.71 (145.82) |         1,579.91 (157.31) |  +0.84% |    -0.59% (4.38 pp) |
| throughput/10000/merge.insert           |          1,588.03 (93.41) |         1,559.13 (129.82) |  -1.82% |   -2.19% (11.34 pp) |
| throughput/15000/merge.insert           |          1,514.27 (61.17) |          1,529.36 (46.26) |  +1.00% |    +0.74% (7.34 pp) |
| throughput/20000/merge.insert           |         1,591.69 (118.37) |         1,502.99 (171.84) |  -5.57% |   -5.87% (11.87 pp) |
| throughput/25000/merge.insert           |          1,425.4 (176.82) |         1,423.31 (245.58) |  -0.15% |   -0.06% (17.45 pp) |
| throughput/100/remove.head              |            835.67 (55.93) |            769.64 (33.27) |  -7.90% |     -7.63% (4.3 pp) |
| throughput/1000/remove.head             |            780.37 (37.42) |            802.74 (33.62) |  +2.87% |    +0.43% (5.24 pp) |
| throughput/5000/remove.head             |            793.99 (13.67) |            804.18 (73.22) |  +1.28% |    +0.90% (4.73 pp) |
| throughput/10000/remove.head            |           885.17 (185.96) |            945.2 (146.22) |  +6.78% |    +6.78% (5.36 pp) |
| throughput/15000/remove.head            |            867.34 (30.01) |            876.53 (12.48) |  +1.06% |    -0.46% (2.72 pp) |
| throughput/20000/remove.head            |            964.53 (69.36) |            946.68 (28.03) |  -1.85% |    -0.56% (5.83 pp) |
| throughput/25000/remove.head            |         1,038.17 (288.92) |             959.6 (44.02) |  -7.57% |   -5.58% (20.67 pp) |
| throughput/100/remove.middle            |           814.43 (100.84) |           867.88 (144.63) |  +6.56% |  +14.47% (34.77 pp) |
| throughput/1000/remove.middle           |            814.78 (29.89) |            811.53 (29.11) |  -0.40% |    +1.21% (7.05 pp) |
| throughput/5000/remove.middle           |             825.25 (18.3) |            887.27 (37.49) |  +7.52% |   +4.81% (10.55 pp) |
| throughput/10000/remove.middle          |            970.62 (69.89) |            931.41 (76.29) |  -4.04% |    -2.49% (0.87 pp) |
| throughput/15000/remove.middle          |            906.04 (79.74) |            936.84 (15.49) |  +3.40% |   +3.40% (10.79 pp) |
| throughput/20000/remove.middle          |            921.62 (68.19) |            939.83 (47.26) |  +1.98% |    -0.39% (3.82 pp) |
| throughput/25000/remove.middle          |          1,052.35 (93.74) |            961.66 (51.48) |  -8.62% |    -8.37% (2.85 pp) |
| throughput/100/remove.random            |         1,059.24 (112.62) |          1,059.61 (74.39) |  +0.04% |   -1.54% (16.08 pp) |
| throughput/1000/remove.random           |          1,199.47 (39.27) |          1,245.85 (144.3) |  +3.87% |    +5.18% (8.94 pp) |
| throughput/5000/remove.random           |          1,179.43 (69.39) |          1,268.35 (83.51) |  +7.54% |   +1.42% (10.72 pp) |
| throughput/10000/remove.random          |          1,297.81 (66.62) |          1,294.31 (44.78) |  -0.27% |    -3.18% (5.59 pp) |
| throughput/15000/remove.random          |          1,243.37 (215.4) |          1,219.26 (43.93) |  -1.94% |   +1.24% (11.11 pp) |
| throughput/20000/remove.random          |          1,284.53 (61.76) |           1,308.66 (37.5) |  +1.88% |    +3.85% (8.41 pp) |
| throughput/25000/remove.random          |         1,340.73 (260.14) |          1,358.49 (54.27) |  +1.32% |   -5.28% (18.97 pp) |
| throughput/100/remove.sameIndex         |         1,037.04 (266.97) |            1,000 (186.27) |  -3.57% |   -5.73% (18.52 pp) |
| throughput/1000/remove.sameIndex        |               822 (17.04) |            813.46 (55.56) |  -1.04% |   -0.40% (12.56 pp) |
| throughput/5000/remove.sameIndex        |           827.61 (195.06) |            874.63 (23.44) |  +5.68% |   +0.14% (14.06 pp) |
| throughput/10000/remove.sameIndex       |            854.94 (79.53) |            940.14 (23.45) |  +9.97% |    +5.49% (7.91 pp) |
| throughput/15000/remove.sameIndex       |             871.7 (23.08) |            876.53 (39.19) |  +0.55% |    +4.47% (9.08 pp) |
| throughput/20000/remove.sameIndex       |           974.71 (121.59) |            965.03 (26.22) |  -0.99% |    -0.99% (15.9 pp) |
| throughput/25000/remove.sameIndex       |         1,009.43 (195.35) |            990.23 (38.16) |  -1.90% |    +0.28% (8.42 pp) |
| throughput/100/remove.tail              |           731.01 (134.61) |            812.91 (31.51) | +11.20% |   +4.42% (17.84 pp) |
| throughput/1000/remove.tail             |            721.57 (21.52) |            709.28 (34.27) |  -1.70% |   -0.21% (12.49 pp) |
| throughput/5000/remove.tail             |            767.02 (83.11) |            734.29 (21.81) |  -4.27% |   -2.39% (10.07 pp) |
| throughput/10000/remove.tail            |            794.55 (88.27) |            778.56 (41.52) |  -2.01% |   -6.56% (11.03 pp) |
| throughput/15000/remove.tail            |            782.96 (35.78) |             764.8 (16.06) |  -2.32% |    -0.46% (6.58 pp) |
| throughput/20000/remove.tail            |            844.59 (107.4) |            826.11 (29.83) |  -2.19% |   -1.87% (15.27 pp) |
| throughput/25000/remove.tail            |             908.6 (38.58) |           869.56 (128.62) |  -4.30% |  -10.16% (13.84 pp) |
| throughput/100/replace.head             |         1,076.78 (215.35) |          1,164.06 (74.49) |  +8.11% |   +1.09% (19.47 pp) |
| throughput/1000/replace.head            |          1,197.92 (51.54) |          1,182.83 (32.26) |  -1.26% |   -5.60% (17.65 pp) |
| throughput/5000/replace.head            |          1,148.79 (48.72) |          1,123.04 (61.39) |  -2.24% |    +0.44% (3.49 pp) |
| throughput/10000/replace.head           |          1,189.74 (24.02) |          1,177.57 (65.71) |  -1.02% |    +0.28% (5.97 pp) |
| throughput/15000/replace.head           |          1,176.16 (27.76) |          1,141.37 (27.85) |  -2.96% |    -1.86% (4.05 pp) |
| throughput/20000/replace.head           |          1,194.09 (82.59) |          1,282.08 (56.02) |  +7.37% |  +14.17% (13.05 pp) |
| throughput/25000/replace.head           |         1,246.36 (106.53) |         1,268.18 (143.54) |  +1.75% |    -1.59% (12.1 pp) |
| throughput/100/replace.middle           |         1,099.11 (250.22) |         1,257.18 (164.29) | +14.38% |     +9.49% (8.4 pp) |
| throughput/1000/replace.middle          |          1,278.06 (80.07) |         1,261.42 (166.92) |  -1.30% |   -1.24% (20.36 pp) |
| throughput/5000/replace.middle          |          1,229.36 (48.59) |           1,183.5 (34.98) |  -3.73% |    -1.41% (5.12 pp) |
| throughput/10000/replace.middle         |         1,325.91 (485.99) |           1,243.4 (85.44) |  -6.22% |   -0.11% (34.62 pp) |
| throughput/15000/replace.middle         |         1,264.53 (104.26) |          1,216.15 (70.32) |  -3.83% |    -0.06% (6.23 pp) |
| throughput/20000/replace.middle         |           1,290.9 (81.45) |          1,296.21 (25.23) |  +0.41% |     +1.13% (2.7 pp) |
| throughput/25000/replace.middle         |         1,426.22 (303.98) |          1,316.7 (162.29) |  -7.68% |  -12.00% (21.09 pp) |
| throughput/100/replace.random           |          1,703.9 (299.91) |         1,855.92 (202.81) |  +8.92% |   +5.49% (23.52 pp) |
| throughput/1000/replace.random          |          1,756.22 (81.08) |         1,883.53 (210.49) |  +7.25% |   +2.16% (24.13 pp) |
| throughput/5000/replace.random          |          1,776.37 (31.63) |          1,745.82 (56.64) |  -1.72% |    -1.72% (2.63 pp) |
| throughput/10000/replace.random         |         1,858.85 (405.27) |           1,778.22 (55.8) |  -4.34% |   +2.33% (24.25 pp) |
| throughput/15000/replace.random         |         1,700.41 (130.07) |          1,727.08 (69.15) |  +1.57% |    +1.57% (6.35 pp) |
| throughput/20000/replace.random         |          1,856.3 (242.56) |            1,773.18 (280) |  -4.48% |   -6.97% (25.54 pp) |
| throughput/25000/replace.random         |         1,823.69 (118.55) |         1,803.43 (312.79) |  -1.11% |    +0.99% (15.8 pp) |
| throughput/100/replace.sameIndex        |         1,082.14 (189.25) |          1,213.68 (57.42) | +12.16% |    -2.08% (24.6 pp) |
| throughput/1000/replace.sameIndex       |           1,213.5 (92.74) |          1,224.38 (24.03) |  +0.90% |   +0.74% (18.92 pp) |
| throughput/5000/replace.sameIndex       |           1,136.88 (27.5) |          1,190.22 (99.59) |  +4.69% |   +4.69% (11.98 pp) |
| throughput/10000/replace.sameIndex      |         1,321.67 (228.18) |          1,211.71 (59.04) |  -8.32% |   -7.21% (21.14 pp) |
| throughput/15000/replace.sameIndex      |          1,177.23 (60.71) |         1,182.56 (116.94) |  +0.45% |    +4.11% (5.38 pp) |
| throughput/20000/replace.sameIndex      |         1,276.56 (119.79) |          1,261.91 (36.78) |  -1.15% |   -4.25% (15.45 pp) |
| throughput/25000/replace.sameIndex      |         1,295.56 (131.65) |          1,306.46 (46.46) |  +0.84% |    -2.02% (8.48 pp) |
| throughput/100/replace.tail             |         1,162.48 (250.02) |          1,211.52 (42.96) |  +4.22% |   -1.02% (14.11 pp) |
| throughput/1000/replace.tail            |         1,208.19 (116.12) |          1,245.04 (64.39) |  +3.05% |  +11.58% (12.44 pp) |
| throughput/5000/replace.tail            |          1,168.29 (20.84) |          1,178.66 (47.61) |  +0.89% |    +2.53% (4.75 pp) |
| throughput/10000/replace.tail           |          1,214.59 (57.23) |          1,217.98 (49.44) |  +0.28% |    -2.51% (4.07 pp) |
| throughput/15000/replace.tail           |         1,241.29 (119.55) |         1,198.79 (186.75) |  -3.42% |    -6.57% (7.93 pp) |
| throughput/20000/replace.tail           |          1,325.37 (18.79) |          1,314.78 (88.21) |  -0.80% |   +2.39% (14.67 pp) |
| throughput/25000/replace.tail           |         1,306.46 (220.01) |          1,308.18 (30.16) |  +0.13% |   -2.03% (15.18 pp) |
| throughput/100/retire                   |            220.22 (98.92) |           253.36 (100.29) | +15.05% |   +2.11% (62.39 pp) |
| throughput/1000/retire                  |            220.58 (13.76) |             223.98 (4.06) |  +1.54% |   +1.54% (13.23 pp) |
| throughput/5000/retire                  |            209.23 (20.51) |            203.66 (20.66) |  -2.66% |    -1.81% (8.08 pp) |
| throughput/10000/retire                 |             250.37 (50.5) |             209.79 (8.54) | -16.21% |  -18.82% (22.75 pp) |
| throughput/15000/retire                 |            207.42 (18.79) |             206.41 (1.93) |  -0.49% |    +5.48% (8.51 pp) |
| throughput/20000/retire                 |             210.17 (2.88) |            203.47 (13.53) |  -3.19% |    -3.50% (2.92 pp) |
| throughput/25000/retire                 |            201.99 (12.47) |            194.82 (15.27) |  -3.55% |   -1.66% (13.61 pp) |
| throughput/100/sequence                 |            290.75 (55.62) |             322.7 (22.59) | +10.99% |    +9.95% (17.5 pp) |
| throughput/1000/sequence                |            292.37 (22.66) |             302.35 (3.81) |  +3.41% |   +7.77% (12.95 pp) |
| throughput/5000/sequence                |             265.76 (1.16) |            272.33 (18.96) |  +2.47% |    +1.83% (2.93 pp) |
| throughput/10000/sequence               |            275.68 (24.71) |             262.47 (4.64) |  -4.79% |    -2.03% (7.82 pp) |
| throughput/15000/sequence               |             251.78 (9.25) |            253.25 (17.17) |  +0.58% |    -2.61% (9.74 pp) |
| throughput/20000/sequence               |            230.65 (10.61) |              254.38 (8.2) | +10.29% |    +6.77% (7.97 pp) |
| throughput/25000/sequence               |            246.35 (12.41) |            251.92 (10.12) |  +2.26% |    +1.77% (8.93 pp) |
| throughput/100/value.head               |            183.12 (24.92) |             198.45 (8.98) |  +8.37% |   +3.82% (13.11 pp) |
| throughput/1000/value.head              |            174.43 (14.03) |            173.11 (12.37) |  -0.76% |   +1.01% (19.58 pp) |
| throughput/5000/value.head              |             143.71 (9.87) |             149.58 (6.94) |  +4.08% |   +4.66% (15.48 pp) |
| throughput/10000/value.head             |            142.53 (11.06) |             155.76 (7.35) |  +9.28% |   +9.23% (18.38 pp) |
| throughput/15000/value.head             |             141.63 (6.45) |            151.35 (18.95) |  +6.86% |   +6.00% (16.69 pp) |
| throughput/20000/value.head             |             140.97 (6.76) |            144.59 (14.09) |  +2.57% |    +3.56% (6.21 pp) |
| throughput/25000/value.head             |            146.71 (35.91) |             131.07 (1.68) | -10.66% |  -11.25% (20.24 pp) |
| throughput/100/value.middle             |            245.15 (51.82) |             275.09 (3.31) | +12.21% |  +11.37% (22.08 pp) |
| throughput/1000/value.middle            |            259.32 (17.95) |             263.44 (4.11) |  +1.59% |   +4.75% (25.17 pp) |
| throughput/5000/value.middle            |            237.13 (22.47) |            244.31 (20.66) |  +3.03% |   +4.43% (11.16 pp) |
| throughput/10000/value.middle           |            242.82 (33.28) |             229.91 (6.65) |  -5.32% |    -6.75% (9.88 pp) |
| throughput/15000/value.middle           |             223.05 (8.57) |            242.03 (43.15) |  +8.51% |    +8.96% (32.5 pp) |
| throughput/20000/value.middle           |              215.22 (1.6) |             219.24 (8.65) |  +1.87% |    +3.76% (4.71 pp) |
| throughput/25000/value.middle           |            217.34 (14.16) |             211.62 (1.45) |  -2.63% |    -1.19% (5.27 pp) |
| throughput/100/value.random             |            221.32 (37.96) |            243.26 (23.46) |  +9.91% |   +9.48% (19.87 pp) |
| throughput/1000/value.random            |             223.92 (6.05) |            239.92 (10.48) |  +7.15% |   +7.93% (22.51 pp) |
| throughput/5000/value.random            |            297.47 (44.26) |            278.24 (28.57) |  -6.46% |  -10.90% (15.64 pp) |
| throughput/10000/value.random           |            264.87 (45.34) |            268.87 (15.81) |  +1.51% |   +0.03% (20.67 pp) |
| throughput/15000/value.random           |            295.58 (27.28) |            283.54 (31.68) |  -4.07% |   +0.89% (26.86 pp) |
| throughput/20000/value.random           |            276.46 (16.36) |            296.87 (30.69) |  +7.38% |    +5.92% (2.14 pp) |
| throughput/25000/value.random           |            276.76 (33.63) |             264.83 (9.16) |  -4.31% |    -4.31% (12.1 pp) |
| throughput/100/value.sameIndex          |            201.07 (22.86) |            199.97 (24.33) |  -0.55% |   -4.49% (20.58 pp) |
| throughput/1000/value.sameIndex         |             190.1 (17.51) |            195.36 (62.27) |  +2.77% |   +5.26% (42.61 pp) |
| throughput/5000/value.sameIndex         |              180.8 (7.17) |            183.45 (13.85) |  +1.47% |    +3.28% (4.39 pp) |
| throughput/10000/value.sameIndex        |             173.36 (8.82) |             176.92 (8.57) |  +2.05% |   -1.37% (12.03 pp) |
| throughput/15000/value.sameIndex        |             164.68 (5.88) |             179.37 (2.74) |  +8.92% |    +8.44% (3.52 pp) |
| throughput/20000/value.sameIndex        |            172.47 (26.23) |             175.78 (7.28) |  +1.92% |    -1.81% (10.4 pp) |
| throughput/25000/value.sameIndex        |            197.48 (77.49) |            161.71 (10.91) | -18.11% |  -23.63% (23.05 pp) |
| throughput/100/value.tail               |            310.81 (67.72) |            249.66 (12.43) | -19.67% |  -20.53% (18.33 pp) |
| throughput/1000/value.tail              |              227.7 (8.93) |             253.73 (34.5) | +11.43% |   +14.79% (30.6 pp) |
| throughput/5000/value.tail              |            209.14 (55.96) |             198.78 (8.71) |  -4.95% |   -6.80% (12.24 pp) |
| throughput/10000/value.tail             |             199.44 (4.34) |             195.95 (9.27) |  -1.75% |    -5.52% (6.34 pp) |
| throughput/15000/value.tail             |             189.75 (7.56) |            187.04 (10.08) |  -1.43% |   -0.27% (13.05 pp) |
| throughput/20000/value.tail             |            195.37 (19.07) |             186.86 (6.21) |  -4.36% |    -4.36% (8.22 pp) |
| throughput/25000/value.tail             |            181.73 (18.81) |              201.9 (53.7) | +11.10% |  +13.24% (30.76 pp) |
| throughput/100/values                   |        4,709.8 (1,422.49) |         5,061.18 (250.11) |  +7.46% |   +7.72% (23.29 pp) |
| throughput/1000/values                  |     167,325.16 (9,369.25) |    184,331.42 (28,270.27) | +10.16% |   +4.78% (17.46 pp) |
| throughput/5000/values                  |    577,265.63 (75,259.38) |    552,295.31 (34,560.42) |  -4.33% |   -1.14% (14.53 pp) |
| throughput/10000/values                 | 1,200,170.31 (158,557.81) |  1,256,589.84 (42,069.53) |  +4.70% |   +2.10% (11.24 pp) |
| throughput/15000/values                 | 1,774,734.38 (118,965.63) | 1,852,201.56 (164,379.69) |  +4.37% |    +0.60% (5.18 pp) |
| throughput/20000/values                 |  2,568,998.44 (315,462.5) |    2,550,332.81 (150,500) |  -0.73% |   +1.49% (13.68 pp) |
| throughput/25000/values                 | 3,653,918.75 (490,946.88) |  4,001,778.13 (829,862.5) |  +9.52% |   +0.16% (22.68 pp) |
| throughput/100/values.head              |             331.1 (85.49) |            343.77 (35.54) |  +3.83% |   +3.83% (32.84 pp) |
| throughput/1000/values.head             |           272.97 (123.92) |             302.93 (6.59) | +10.98% |   +15.84% (5.67 pp) |
| throughput/5000/values.head             |             276.04 (43.4) |            289.94 (12.96) |  +5.04% |   +1.58% (13.61 pp) |
| throughput/10000/values.head            |             283.43 (7.67) |            270.74 (35.94) |  -4.48% |   -1.88% (12.05 pp) |
| throughput/15000/values.head            |            272.85 (33.82) |            295.66 (35.65) |  +8.36% |   -1.79% (21.41 pp) |
| throughput/20000/values.head            |            271.17 (27.96) |            294.41 (44.87) |  +8.57% |    +8.57% (29.8 pp) |
| throughput/25000/values.head            |            274.73 (31.86) |            285.96 (36.06) |  +4.09% |   +7.71% (10.04 pp) |
| throughput/100/values.middle            |            297.56 (16.25) |            299.75 (30.23) |  +0.74% |   -3.99% (20.75 pp) |
| throughput/1000/values.middle           |             268.95 (3.93) |           320.62 (112.65) | +19.21% |  +20.76% (48.53 pp) |
| throughput/5000/values.middle           |             254.95 (26.3) |            263.84 (47.39) |  +3.49% |   +2.16% (29.01 pp) |
| throughput/10000/values.middle          |               284.17 (81) |            272.19 (55.81) |  -4.22% |  -10.83% (43.67 pp) |
| throughput/15000/values.middle          |            295.48 (72.58) |            258.56 (13.94) | -12.49% |   -2.71% (28.53 pp) |
| throughput/20000/values.middle          |             270.7 (25.95) |             264.29 (2.56) |  -2.37% |   -3.04% (13.28 pp) |
| throughput/25000/values.middle          |            257.43 (34.14) |            265.45 (22.17) |  +3.12% |   +3.12% (28.37 pp) |
| throughput/100/values.random            |               309 (34.29) |            326.65 (18.78) |  +5.71% |    +8.35% (8.58 pp) |
| throughput/1000/values.random           |             300.41 (3.48) |            320.55 (63.62) |  +6.70% |   +4.99% (34.89 pp) |
| throughput/5000/values.random           |            312.83 (45.21) |             362.8 (51.39) | +15.97% |    +7.32% (2.06 pp) |
| throughput/10000/values.random          |            361.64 (56.81) |             368.2 (46.43) |  +1.81% |    +1.67% (6.45 pp) |
| throughput/15000/values.random          |            427.47 (62.08) |           388.52 (107.66) |  -9.11% |   +3.12% (38.24 pp) |
| throughput/20000/values.random          |           434.78 (109.29) |            388.72 (13.96) | -10.59% |   -12.65% (6.52 pp) |
| throughput/25000/values.random          |            374.32 (80.08) |            387.08 (31.62) |  +3.41% |   -0.42% (26.06 pp) |
| throughput/100/values.sameIndex         |            299.82 (41.77) |            319.22 (31.18) |  +6.47% |  +11.41% (13.37 pp) |
| throughput/1000/values.sameIndex        |            276.86 (33.37) |            300.86 (22.97) |  +8.67% |    +7.51% (3.36 pp) |
| throughput/5000/values.sameIndex        |            340.03 (86.01) |            269.07 (49.35) | -20.87% |   -17.76% (26.7 pp) |
| throughput/10000/values.sameIndex       |             258.95 (4.73) |            272.87 (24.61) |  +5.38% |   +5.15% (10.45 pp) |
| throughput/15000/values.sameIndex       |           258.05 (121.77) |            251.28 (81.72) |  -2.62% |  +11.43% (57.17 pp) |
| throughput/20000/values.sameIndex       |            279.07 (24.82) |            259.53 (14.05) |  -7.00% |   -7.00% (16.86 pp) |
| throughput/25000/values.sameIndex       |            256.11 (45.02) |            252.45 (35.88) |  -1.43% |   -0.95% (31.26 pp) |
| throughput/100/values.tail              |            326.44 (77.57) |            313.99 (22.35) |  -3.81% |    -4.88% (4.26 pp) |
| throughput/1000/values.tail             |             271.47 (3.92) |            293.37 (44.31) |  +8.07% |    +7.08% (16.2 pp) |
| throughput/5000/values.tail             |            257.43 (18.19) |            272.79 (21.84) |  +5.97% |   -1.33% (26.92 pp) |
| throughput/10000/values.tail            |            337.82 (26.23) |            250.09 (21.09) | -25.97% |  -26.89% (19.27 pp) |
| throughput/15000/values.tail            |            248.89 (30.89) |           259.57 (110.03) |  +4.29% |   +7.33% (24.38 pp) |
| throughput/20000/values.tail            |             247.38 (8.45) |             250.71 (4.19) |  +1.35% |    +1.35% (7.82 pp) |
| throughput/25000/values.tail            |            235.81 (18.67) |             255.27 (48.7) |  +8.25% |   +6.57% (19.04 pp) |
| lifecycle/scaleUp/apply.random          |         3,982.92 (490.58) |          3,676.74 (87.06) |  -7.69% |    -0.15% (7.56 pp) |
| lifecycle/scaleUp/insert.head           |            949.01 (60.05) |            852.81 (86.08) | -10.14% |   -6.76% (14.98 pp) |
| lifecycle/scaleUp/insert.random         |         1,740.74 (344.95) |          1,741.24 (49.82) |  +0.03% |    -0.06% (9.56 pp) |
| lifecycle/scaleUp/insert.tail           |            782.9 (136.82) |            737.18 (60.74) |  -5.84% |    -7.01% (8.65 pp) |
| lifecycle/scaleUp/remove.random         |          2,746.29 (455.7) |         3,024.56 (243.14) | +10.13% |   +2.70% (18.08 pp) |
| lifecycle/scaleUp/replace.head          |         2,576.92 (238.11) |         2,553.46 (263.53) |  -0.91% |    -0.13% (4.99 pp) |
| lifecycle/scaleUp/replace.random        |         3,598.97 (203.35) |         4,131.37 (515.72) | +14.79% |   +9.69% (10.17 pp) |
| lifecycle/scaleUp/replace.tail          |         2,335.43 (179.19) |         2,651.75 (452.67) | +13.54% |    +7.43% (6.58 pp) |
| lifecycle/scaleUp/value.head            |             322.65 (9.15) |            311.51 (11.84) |  -3.45% |    -3.93% (1.55 pp) |
| lifecycle/scaleUp/value.random          |         1,131.93 (105.67) |            1,143.59 (9.1) |  +1.03% |    +1.25% (1.61 pp) |
| lifecycle/scaleUp/value.tail            |             153.61 (7.53) |             160.53 (6.15) |  +4.50% |    +2.61% (7.73 pp) |
| lifecycle/scaleDown/apply.random        |          3,451.56 (58.92) |           3,561.3 (53.64) |  +3.18% |    +2.78% (5.16 pp) |
| lifecycle/scaleDown/insert.random       |          1,726.36 (63.38) |          1,757.32 (85.46) |  +1.79% |    +6.53% (7.15 pp) |
| lifecycle/scaleDown/remove.head         |         2,055.55 (902.54) |         1,945.41 (108.83) |  -5.36% |   -7.66% (26.56 pp) |
| lifecycle/scaleDown/remove.random       |          2,657.64 (86.66) |         2,945.25 (163.32) | +10.82% |   +10.82% (7.24 pp) |
| lifecycle/scaleDown/remove.tail         |          1,716.82 (14.71) |         1,811.82 (120.35) |  +5.53% |    +5.53% (8.71 pp) |
| lifecycle/scaleDown/replace.head        |          2,600.32 (90.27) |         2,759.63 (274.15) |  +6.13% |    +5.94% (6.62 pp) |
| lifecycle/scaleDown/replace.random      |         3,342.18 (186.32) |         3,536.94 (337.99) |  +5.83% |    +4.29% (9.49 pp) |
| lifecycle/scaleDown/replace.tail        |         19,327.96 (393.1) |        20,154.46 (670.22) |  +4.28% |     +5.83% (2.3 pp) |
| lifecycle/scaleDown/value.head          |             432.34 (5.64) |            436.53 (13.35) |  +0.97% |     +1.09% (0.2 pp) |
| lifecycle/scaleDown/value.random        |          1,067.14 (45.53) |            1,156.5 (45.5) |  +8.37% |    +4.55% (6.64 pp) |
| lifecycle/scaleDown/value.tail          |              233.7 (9.68) |             245.38 (3.26) |  +5.00% |    +4.49% (4.25 pp) |
| lifecycle/fullLifecycle/apply.random    |         3,680.68 (178.07) |          3,638.38 (78.38) |  -1.15% |    -0.93% (2.99 pp) |
| lifecycle/fullLifecycle/insert.head     |            949.01 (60.05) |            852.81 (86.08) | -10.14% |   -6.76% (14.98 pp) |
| lifecycle/fullLifecycle/insert.random   |         1,802.04 (131.81) |         1,790.19 (107.26) |  -0.66% |    -0.14% (5.57 pp) |
| lifecycle/fullLifecycle/insert.tail     |            782.9 (136.82) |            737.18 (60.74) |  -5.84% |    -7.01% (8.65 pp) |
| lifecycle/fullLifecycle/remove.head     |         2,055.55 (902.54) |         1,945.41 (108.83) |  -5.36% |   -7.66% (26.56 pp) |
| lifecycle/fullLifecycle/remove.random   |         2,782.08 (174.74) |         2,992.37 (233.97) |  +7.56% |   +5.39% (14.04 pp) |
| lifecycle/fullLifecycle/remove.tail     |          1,716.82 (14.71) |         1,811.82 (120.35) |  +5.53% |    +5.53% (8.71 pp) |
| lifecycle/fullLifecycle/replace.head    |          2,591.15 (50.07) |         2,755.55 (165.81) |  +6.34% |    +2.28% (3.46 pp) |
| lifecycle/fullLifecycle/replace.random  |          3,500.12 (391.8) |         3,889.79 (401.38) | +11.13% |    +6.12% (9.01 pp) |
| lifecycle/fullLifecycle/replace.tail    |        10,813.11 (278.16) |        11,505.64 (220.52) |  +6.40% |    +6.40% (1.89 pp) |
| lifecycle/fullLifecycle/value.head      |             379.2 (18.95) |            373.77 (15.35) |  -1.43% |    -1.43% (1.71 pp) |
| lifecycle/fullLifecycle/value.random    |             1,134.49 (29) |             1,147.92 (20) |  +1.18% |     +2.71% (6.7 pp) |
| lifecycle/fullLifecycle/value.tail      |             193.63 (8.69) |             202.36 (4.94) |  +4.51% |    +3.77% (7.44 pp) |
| checkpoint/up/1000/create               |           269,500 (5,800) |           279,700 (6,400) |  +3.78% |    +4.94% (2.24 pp) |
| checkpoint/up/1000/sequence             |       2,184,600 (201,200) |        1,991,700 (47,800) |  -8.83% |  -11.03% (12.86 pp) |
| checkpoint/up/1000/values               |       1,814,800 (155,400) |        1,795,000 (32,300) |  -1.09% |    -5.98% (9.79 pp) |
| checkpoint/up/5000/create               |          912,800 (88,400) |          839,700 (21,400) |  -8.01% |    -6.79% (8.33 pp) |
| checkpoint/up/5000/sequence             |     9,328,000 (1,460,700) |       7,601,300 (519,500) | -18.51% |  -18.75% (20.19 pp) |
| checkpoint/up/5000/values               |       4,519,800 (261,800) |       5,185,400 (611,800) | +14.73% |  +21.52% (16.54 pp) |
| checkpoint/up/10000/create              |        1,616,200 (38,100) |        1,581,500 (25,800) |  -2.15% |       -2.15% (9 pp) |
| checkpoint/up/10000/sequence            |      13,329,100 (295,100) |      12,701,600 (356,200) |  -4.71% |    -2.77% (7.02 pp) |
| checkpoint/up/10000/values              |    20,429,100 (1,213,800) |    20,874,200 (1,318,300) |  +2.18% |    +0.42% (9.45 pp) |
| checkpoint/up/15000/create              |       2,373,900 (121,800) |       2,317,100 (227,100) |  -2.39% |   -3.88% (16.89 pp) |
| checkpoint/up/15000/sequence            |      15,433,100 (896,600) |      15,573,700 (647,700) |  +0.91% |   -1.94% (10.93 pp) |
| checkpoint/up/15000/values              |    30,145,800 (1,386,100) |    30,022,500 (1,387,600) |  -0.41% |    -0.41% (8.31 pp) |
| checkpoint/up/20000/create              |       3,468,000 (359,700) |        3,357,800 (94,600) |  -3.18% |    -1.34% (7.65 pp) |
| checkpoint/up/20000/sequence            |      22,359,600 (734,200) |    21,962,400 (2,442,200) |  -1.78% |   +0.23% (16.74 pp) |
| checkpoint/up/20000/values              |      11,064,600 (576,400) |    11,438,500 (1,240,900) |  +3.38% |    +4.99% (8.31 pp) |
| checkpoint/up/25000/create              |        3,896,800 (52,100) |       4,025,300 (321,900) |  +3.30% |    +2.51% (7.01 pp) |
| checkpoint/up/25000/sequence            |    24,362,400 (1,211,000) |    24,813,900 (1,302,100) |  +1.85% |   +1.85% (10.99 pp) |
| checkpoint/up/25000/values              |      11,726,700 (168,500) |      12,058,100 (781,000) |  +2.83% |    +2.07% (7.96 pp) |
| checkpoint/down/20000/create            |        3,376,200 (41,400) |       3,379,000 (103,500) |  +0.08% |    +1.12% (1.83 pp) |
| checkpoint/down/20000/sequence          |      19,069,400 (649,700) |      19,113,800 (922,300) |  +0.23% |    +1.36% (3.35 pp) |
| checkpoint/down/20000/values            |       9,473,800 (576,000) |     9,072,200 (1,175,800) |  -4.24% |   -3.69% (11.07 pp) |
| checkpoint/down/15000/create            |        2,393,700 (44,700) |        2,395,500 (28,300) |  +0.08% |     -0.30% (2.7 pp) |
| checkpoint/down/15000/sequence          |      15,809,500 (348,200) |      15,755,600 (260,100) |  -0.34% |    -0.78% (7.06 pp) |
| checkpoint/down/15000/values            |       8,089,200 (234,200) |       7,721,600 (290,200) |  -4.54% |    -4.54% (4.92 pp) |
| checkpoint/down/10000/create            |         1,636,300 (9,400) |        1,632,800 (15,500) |  -0.21% |    +0.24% (1.03 pp) |
| checkpoint/down/10000/sequence          |      13,308,900 (275,400) |    13,555,600 (1,193,500) |  +1.85% |    +2.99% (7.31 pp) |
| checkpoint/down/10000/values            |       5,251,500 (586,300) |       5,581,300 (890,300) |  +6.28% |   +2.27% (19.33 pp) |
| checkpoint/down/5000/create             |          764,000 (31,800) |          775,000 (15,300) |  +1.44% |    +1.04% (1.95 pp) |
| checkpoint/down/5000/sequence           |     9,173,400 (1,348,300) |       9,546,900 (470,700) |  +4.07% |   +0.34% (10.27 pp) |
| checkpoint/down/5000/values             |       3,183,700 (107,500) |       3,082,500 (591,300) |  -3.18% |   -3.18% (15.21 pp) |
| checkpoint/down/1000/create             |           147,200 (4,600) |         166,600 (104,900) | +13.18% |  +10.48% (72.75 pp) |
| checkpoint/down/1000/sequence           |       6,263,000 (533,900) |     7,381,800 (1,778,900) | +17.86% |  +17.86% (26.31 pp) |
| checkpoint/down/1000/values             |          537,100 (67,400) |          757,500 (94,600) | +41.04% |  +34.34% (10.03 pp) |
| checkpoint/down/0/create                |              14,000 (600) |           20,800 (14,200) | +48.57% | +48.57% (114.32 pp) |
| checkpoint/down/0/sequence              |        1,312,600 (13,800) |       1,279,300 (217,500) |  -2.54% |   -2.87% (18.09 pp) |
| checkpoint/down/0/values                |             9,900 (1,200) |            11,500 (3,300) | +16.16% |  +16.16% (54.43 pp) |
| tuple/projection/2/create.empty         |            351.91 (41.87) |            375.73 (78.49) |  +6.77% |   +3.84% (32.52 pp) |
| tuple/tuple/2/create.empty              |            434.64 (27.68) |            451.29 (57.33) |  +3.83% |    -2.76% (9.45 pp) |
| tuple/projection/2/create.sequence      |          1,194.79 (78.04) |          1,265.95 (16.63) |  +5.96% |    +5.96% (4.76 pp) |
| tuple/tuple/2/create.sequence           |          1,357.31 (38.72) |         1,410.18 (123.05) |  +3.90% |    +0.78% (12.3 pp) |
| tuple/projection/2/replace.random       |          1,010.13 (32.84) |          1,091.19 (84.89) |  +8.03% |   +12.13% (3.03 pp) |
| tuple/tuple/2/replace.random            |             714.92 (59.6) |             709.94 (2.33) |  -0.70% |       -2.50% (3 pp) |
| tuple/projection/2/apply.replace        |          1,637.36 (45.87) |           1,823.29 (4.97) | +11.36% |   +8.45% (12.63 pp) |
| tuple/tuple/2/apply.replace             |          1,128.28 (59.32) |          1,149.12 (52.38) |  +1.85% |    +5.65% (5.63 pp) |
| tuple/projection/2/apply.duplicate      |             582.35 (40.7) |            567.84 (12.76) |  -2.49% |    +0.35% (6.41 pp) |
| tuple/tuple/2/apply.duplicate           |            599.06 (32.22) |             585.44 (8.14) |  -2.28% |    -3.12% (8.19 pp) |
| tuple/projection/2/merge.duplicate      |           700.59 (457.01) |            691.42 (54.78) |  -1.31% |   -8.38% (35.13 pp) |
| tuple/tuple/2/merge.duplicate           |            778.65 (264.7) |            638.33 (34.04) | -18.02% |   -21.08% (22.8 pp) |
| tuple/projection/2/length               |               7.74 (1.03) |               7.67 (0.51) |  -0.99% |   +1.83% (17.07 pp) |
| tuple/tuple/2/length                    |               7.67 (0.29) |               7.48 (0.21) |  -2.43% |     +1.79% (6.1 pp) |
| tuple/projection/2/value.random         |              30.57 (2.68) |               32.77 (3.3) |  +7.22% |   -1.40% (14.87 pp) |
| tuple/tuple/2/value.random              |              19.36 (0.97) |              20.17 (1.05) |  +4.17% |    +1.92% (3.65 pp) |
| tuple/projection/2/values               |              81.41 (9.97) |              80.08 (0.62) |  -1.63% |    -3.97% (3.23 pp) |
| tuple/tuple/2/values                    |              84.77 (3.19) |              83.13 (4.59) |  -1.94% |    -1.22% (8.35 pp) |
| tuple/projection/2/sequence             |           474.78 (143.44) |            453.46 (13.72) |  -4.49% |    -1.61% (15.1 pp) |
| tuple/tuple/2/sequence                  |            503.57 (28.42) |             483.13 (9.62) |  -4.06% |    -3.45% (6.95 pp) |
| tuple/projection/4/create.empty         |            440.91 (20.36) |             431.81 (4.84) |  -2.06% |    +1.76% (3.94 pp) |
| tuple/tuple/4/create.empty              |            460.14 (23.86) |             463.9 (21.25) |  +0.82% |    +0.61% (7.15 pp) |
| tuple/projection/4/create.sequence      |         1,627.65 (112.35) |          1,592.74 (60.75) |  -2.14% |    -2.14% (8.97 pp) |
| tuple/tuple/4/create.sequence           |          1,507.13 (44.32) |         1,610.53 (153.68) |  +6.86% |   +2.75% (16.99 pp) |
| tuple/projection/4/replace.random       |          1,130.96 (11.14) |          1,157.74 (68.95) |  +2.37% |    +1.35% (2.18 pp) |
| tuple/tuple/4/replace.random            |            646.56 (57.67) |            640.44 (28.56) |  -0.95% |    -4.39% (12.6 pp) |
| tuple/projection/4/apply.replace        |         1,753.96 (174.82) |           1,654.9 (81.06) |  -5.65% |   -2.31% (11.29 pp) |
| tuple/tuple/4/apply.replace             |          1,077.5 (132.81) |           1,038.45 (40.1) |  -3.62% |    -0.65% (9.88 pp) |
| tuple/projection/4/apply.duplicate      |             574.25 (40.1) |            542.24 (29.41) |  -5.57% |     -2.38% (6.8 pp) |
| tuple/tuple/4/apply.duplicate           |            582.35 (34.73) |            575.18 (19.62) |  -1.23% |    +2.67% (9.31 pp) |
| tuple/projection/4/merge.duplicate      |           778.93 (119.61) |            744.12 (48.84) |  -4.47% |   -6.56% (19.92 pp) |
| tuple/tuple/4/merge.duplicate           |           800.72 (156.47) |             744.28 (4.74) |  -7.05% |    -7.34% (18.4 pp) |
| tuple/projection/4/length               |              27.61 (1.72) |               30.8 (1.58) | +11.54% |    +9.15% (9.08 pp) |
| tuple/tuple/4/length                    |              26.49 (1.26) |               35.7 (10.4) | +34.78% |  +37.06% (99.27 pp) |
| tuple/projection/4/value.random         |              43.92 (0.14) |              51.48 (12.3) | +17.23% |   +8.72% (19.49 pp) |
| tuple/tuple/4/value.random              |               18.3 (1.98) |              21.44 (6.41) | +17.15% |  +17.15% (21.44 pp) |
| tuple/projection/4/values               |             147.13 (1.97) |            161.96 (21.02) | +10.08% |  +11.37% (25.55 pp) |
| tuple/tuple/4/values                    |             146.74 (1.11) |            161.09 (29.85) |  +9.78% |   +9.27% (16.76 pp) |
| tuple/projection/4/sequence             |            455.99 (33.38) |             474.94 (73.5) |  +4.16% |   -1.21% (23.51 pp) |
| tuple/tuple/4/sequence                  |             556.73 (21.6) |            620.57 (91.89) | +11.47% |  +20.33% (20.63 pp) |
| tuple/projection/8/create.empty         |            417.57 (36.26) |             442.46 (9.33) |  +5.96% |    -0.36% (8.98 pp) |
| tuple/tuple/8/create.empty              |            453.01 (21.61) |            471.58 (16.21) |  +4.10% |    +6.03% (6.55 pp) |
| tuple/projection/8/create.sequence      |         2,280.82 (201.52) |          2,428.2 (467.19) |  +6.46% |  +15.05% (27.64 pp) |
| tuple/tuple/8/create.sequence           |         1,981.36 (644.63) |          2,045.3 (666.28) |  +3.23% |    -6.89% (19.9 pp) |
| tuple/projection/8/replace.random       |         1,202.35 (209.45) |          1,242.76 (148.2) |  +3.36% |    -0.88% (4.65 pp) |
| tuple/tuple/8/replace.random            |            694.37 (57.25) |           746.57 (243.57) |  +7.52% |  +18.24% (27.21 pp) |
| tuple/projection/8/apply.replace        |           1,784.5 (237.3) |         1,751.53 (332.08) |  -1.85% |     +1.90% (8.5 pp) |
| tuple/tuple/8/apply.replace             |         1,050.81 (199.19) |         1,222.49 (183.35) | +16.34% |    +3.22% (4.04 pp) |
| tuple/projection/8/apply.duplicate      |           607.94 (117.56) |            572.87 (129.3) |  -5.77% |   +5.09% (24.23 pp) |
| tuple/tuple/8/apply.duplicate           |            599.88 (78.96) |           561.82 (228.52) |  -6.34% |   -1.94% (12.04 pp) |
| tuple/projection/8/merge.duplicate      |         1,195.36 (173.47) |         1,021.46 (247.63) | -14.55% |   -2.18% (21.95 pp) |
| tuple/tuple/8/merge.duplicate           |         1,219.41 (167.29) |         1,085.44 (128.06) | -10.99% |    -5.30% (9.74 pp) |
| tuple/projection/8/length               |              28.14 (2.72) |              30.63 (1.64) |  +8.85% |   +2.41% (30.13 pp) |
| tuple/tuple/8/length                    |              26.49 (2.04) |              28.32 (7.04) |  +6.92% |  +32.49% (51.82 pp) |
| tuple/projection/8/value.random         |               60.45 (8.8) |               55.1 (2.14) |  -8.84% |   -8.84% (17.49 pp) |
| tuple/tuple/8/value.random              |              19.28 (0.68) |              18.69 (1.21) |  -3.06% |    -5.18% (8.02 pp) |
| tuple/projection/8/values               |              224.23 (6.6) |            225.25 (16.78) |  +0.46% |    -1.53% (8.45 pp) |
| tuple/tuple/8/values                    |              209.21 (3.6) |              211.95 (6.9) |  +1.31% |    +0.61% (2.47 pp) |
| tuple/projection/8/sequence             |             631.8 (11.87) |            649.51 (43.13) |  +2.80% |    +1.88% (7.83 pp) |
| tuple/tuple/8/sequence                  |             676.02 (12.4) |            697.18 (46.05) |  +3.13% |    +0.42% (2.77 pp) |
| tuple/projection/100/create.empty       |            464.25 (25.55) |             439.7 (36.13) |  -5.29% |    -4.50% (5.37 pp) |
| tuple/tuple/100/create.empty            |            474.33 (29.74) |            465.63 (35.57) |  -1.83% |    -1.05% (9.73 pp) |
| tuple/projection/100/create.sequence    |         14,172.43 (325.5) |        14,170.48 (423.93) |  -0.01% |    -2.49% (5.28 pp) |
| tuple/tuple/100/create.sequence         |        10,377.13 (559.16) |         10,317.13 (283.4) |  -0.58% |   -0.95% (11.06 pp) |
| tuple/projection/100/replace.random     |         1,262.57 (105.86) |          1,189.05 (20.85) |  -5.82% |    -2.70% (9.08 pp) |
| tuple/tuple/100/replace.random          |            637.68 (16.27) |            604.85 (13.83) |  -5.15% |     -3.67% (0.8 pp) |
| tuple/projection/100/apply.replace      |         1,768.48 (168.63) |          1,828.45 (252.8) |  +3.39% |   -2.68% (12.81 pp) |
| tuple/tuple/100/apply.replace           |         1,032.27 (228.77) |               984 (92.88) |  -4.68% |   -4.94% (13.62 pp) |
| tuple/projection/100/apply.duplicate    |             612.9 (93.53) |            559.67 (30.97) |  -8.69% |   -9.82% (15.27 pp) |
| tuple/tuple/100/apply.duplicate         |            625.1 (104.24) |            582.89 (94.69) |  -6.75% |    -2.06% (8.88 pp) |
| tuple/projection/100/merge.duplicate    |      10,247.95 (2,654.48) |          9,629.7 (625.22) |  -6.03% |   -3.14% (16.86 pp) |
| tuple/tuple/100/merge.duplicate         |      14,956.18 (2,904.27) |        13,011.16 (413.06) | -13.00% |  -13.00% (18.35 pp) |
| tuple/projection/100/length             |              27.37 (7.01) |              26.97 (0.44) |  -1.46% |   -3.20% (21.36 pp) |
| tuple/tuple/100/length                  |              31.83 (6.06) |              27.67 (0.48) | -13.07% |   -6.46% (21.31 pp) |
| tuple/projection/100/value.random       |               86.9 (5.29) |              78.81 (3.64) |  -9.31% |    -9.12% (4.28 pp) |
| tuple/tuple/100/value.random            |               18.61 (0.7) |              17.78 (1.09) |  -4.42% |    -4.06% (2.19 pp) |
| tuple/projection/100/values             |         1,917.72 (111.15) |           1,845.7 (69.09) |  -3.76% |    -2.01% (7.89 pp) |
| tuple/tuple/100/values                  |          1,535.6 (160.18) |          1,482.93 (82.03) |  -3.43% |    -3.64% (4.38 pp) |
| tuple/projection/100/sequence           |         6,118.21 (263.22) |          6,445.5 (284.79) |  +5.35% |   +4.54% (20.26 pp) |
| tuple/tuple/100/sequence                |            5,608 (170.91) |         5,706.63 (107.81) |  +1.76% |    +1.76% (2.71 pp) |

## Memory and storage

Median bytes.

| Checkpoint / quantity                     |     Before |  Candidate | Change |
| ----------------------------------------- | ---------: | ---------: | -----: |
| memory/up/1000/native                     |    480,376 |    480,376 | +0.00% |
| memory/up/1000/js                         |    407,560 |    407,560 | +0.00% |
| storage/up/1000/jsonBytes                 |    278,238 |    278,238 | +0.00% |
| storage/up/1000/jsonGzipBytes             |     14,908 |     14,908 | +0.00% |
| storage/up/1000/messagePackBytes          |    165,784 |    165,784 | +0.00% |
| storage/up/1000/messagePackGzipBytes      |     12,641 |     12,641 | +0.00% |
| memory/up/5000/native                     |  2,156,536 |  2,156,536 | +0.00% |
| memory/up/5000/js                         |  2,059,744 |  2,059,744 | +0.00% |
| storage/up/5000/jsonBytes                 |  1,662,776 |  1,662,776 | +0.00% |
| storage/up/5000/jsonGzipBytes             |     75,146 |     75,146 | +0.00% |
| storage/up/5000/messagePackBytes          |    839,612 |    839,612 | +0.00% |
| storage/up/5000/messagePackGzipBytes      |     63,127 |     63,127 | +0.00% |
| memory/up/10000/native                    |  3,567,248 |  3,567,248 | +0.00% |
| memory/up/10000/js                        |  4,124,208 |  4,124,208 | +0.00% |
| storage/up/10000/jsonBytes                |  3,340,135 |  3,340,135 | +0.00% |
| storage/up/10000/jsonGzipBytes            |    152,232 |    152,232 | +0.00% |
| storage/up/10000/messagePackBytes         |  1,687,602 |  1,687,602 | +0.00% |
| storage/up/10000/messagePackGzipBytes     |    127,808 |    127,808 | +0.00% |
| memory/up/15000/native                    |  4,819,576 |  4,819,576 | +0.00% |
| memory/up/15000/js                        |  6,196,128 |  6,196,128 | +0.00% |
| storage/up/15000/jsonBytes                |  5,053,159 |  5,053,159 | +0.00% |
| storage/up/15000/jsonGzipBytes            |    231,369 |    231,369 | +0.00% |
| storage/up/15000/messagePackBytes         |  3,635,106 |  3,635,106 | +0.00% |
| storage/up/15000/messagePackGzipBytes     |    204,824 |    204,824 | +0.00% |
| memory/up/20000/native                    |  6,317,704 |  6,317,704 | +0.00% |
| memory/up/20000/js                        |  8,250,064 |  8,250,064 | +0.00% |
| storage/up/20000/jsonBytes                |  7,278,683 |  7,278,683 | +0.00% |
| storage/up/20000/jsonGzipBytes            |    318,634 |    318,634 | +0.00% |
| storage/up/20000/messagePackBytes         |  5,249,308 |  5,249,308 | +0.00% |
| storage/up/20000/messagePackGzipBytes     |    269,890 |    269,890 | +0.00% |
| memory/up/25000/native                    |  7,541,592 |  7,541,592 | +0.00% |
| memory/up/25000/js                        | 10,328,360 | 10,328,360 | +0.00% |
| storage/up/25000/jsonBytes                |  9,500,463 |  9,500,463 | +0.00% |
| storage/up/25000/jsonGzipBytes            |    402,015 |    402,015 | +0.00% |
| storage/up/25000/messagePackBytes         |  6,711,789 |  6,711,789 | +0.00% |
| storage/up/25000/messagePackGzipBytes     |    343,336 |    343,336 | +0.00% |
| memory/down/20000/native                  |  6,597,224 |  6,597,224 | +0.00% |
| memory/down/20000/js                      |  8,267,264 |  8,267,264 | +0.00% |
| storage/down/20000/jsonBytes              |  7,760,743 |  7,760,743 | +0.00% |
| storage/down/20000/jsonGzipBytes          |    334,475 |    334,475 | +0.00% |
| storage/down/20000/messagePackBytes       |  5,444,111 |  5,444,111 | +0.00% |
| storage/down/20000/messagePackGzipBytes   |    284,870 |    284,870 | +0.00% |
| memory/down/15000/native                  |  5,747,352 |  5,747,352 | +0.00% |
| memory/down/15000/js                      |  6,212,288 |  6,212,288 | +0.00% |
| storage/down/15000/jsonBytes              |  5,878,783 |  5,878,783 | +0.00% |
| storage/down/15000/jsonGzipBytes          |    253,153 |    253,153 | +0.00% |
| storage/down/15000/messagePackBytes       |  4,110,000 |  4,110,000 | +0.00% |
| storage/down/15000/messagePackGzipBytes   |    214,870 |    214,870 | +0.00% |
| memory/down/10000/native                  |  4,721,024 |  4,721,024 | +0.00% |
| memory/down/10000/js                      |  4,155,848 |  4,155,848 | +0.00% |
| storage/down/10000/jsonBytes              |  3,941,927 |  3,941,927 | +0.00% |
| storage/down/10000/jsonGzipBytes          |    168,770 |    168,770 | +0.00% |
| storage/down/10000/messagePackBytes       |  2,750,169 |  2,750,169 | +0.00% |
| storage/down/10000/messagePackGzipBytes   |    143,189 |    143,189 | +0.00% |
| memory/down/5000/native                   |  3,777,488 |  3,777,488 | +0.00% |
| memory/down/5000/js                       |  2,066,312 |  2,066,312 | +0.00% |
| storage/down/5000/jsonBytes               |  1,950,486 |  1,950,486 | +0.00% |
| storage/down/5000/jsonGzipBytes           |     81,724 |     81,724 | +0.00% |
| storage/down/5000/messagePackBytes        |  1,363,171 |  1,363,171 | +0.00% |
| storage/down/5000/messagePackGzipBytes    |     69,494 |     69,494 | +0.00% |
| memory/down/1000/native                   |  2,719,416 |  2,719,416 | +0.00% |
| memory/down/1000/js                       |    413,360 |    413,360 | +0.00% |
| storage/down/1000/jsonBytes               |    386,836 |    386,836 | +0.00% |
| storage/down/1000/jsonGzipBytes           |     16,336 |     16,336 | +0.00% |
| storage/down/1000/messagePackBytes        |    271,220 |    271,220 | +0.00% |
| storage/down/1000/messagePackGzipBytes    |     13,932 |     13,932 | +0.00% |
| memory/down/0/native                      |  1,598,032 |  1,598,032 | +0.00% |
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

Commands, candidate decisions and diagnostic evidence are in [the round record](README.md). Raw samples remain under `temp/optimization_2026_11_19`. No external competitor was run.
