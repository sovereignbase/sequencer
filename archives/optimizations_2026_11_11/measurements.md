# Follow-up measurements

All figures are public API latency in ns/call, median (IQR); negative change
is faster. Baseline is `1c0a007`. Control is a separately loaded, byte-identical
baseline bundle. Setup, explicit JS process garbage collection, result checks
and destruction are outside measured intervals unless named as the operation.
Independent named call sites avoid mixing the variants at a shared polymorphic
caller. No external benchmark or competitor was run.

## Positional reads, first repetition

Twelve measured rounds after four warmup rounds; eight live Projections per
build, 100 or 20,000 authored groups × 32 Frames, plus up to 2,000 replicated
replacements with registered Actors and exchanged Acknowledgements. Every
snapshot and every result is checked. Small range reads contain 32 Frames.

| Case                |                  baseline |                  control |                     final | Candidate change |
| ------------------- | ------------------------: | -----------------------: | ------------------------: | ---------------: |
| 100/value.head      |              19.01 (1.87) |             18.35 (1.17) |              18.65 (1.37) |           -1.91% |
| 100/value.middle    |              19.54 (1.14) |             18.91 (1.95) |              19.76 (2.55) |           +1.12% |
| 100/value.tail      |               22.9 (3.89) |             22.14 (3.21) |               22.9 (5.76) |           -0.01% |
| 100/value.random    |            226.63 (23.29) |           250.23 (32.52) |            211.76 (34.78) |           -6.56% |
| 100/values.head     |            407.87 (13.02) |           432.46 (93.41) |            372.28 (60.53) |           -8.73% |
| 100/values.middle   |             319.4 (20.36) |            332.68 (30.4) |             285.7 (24.41) |          -10.55% |
| 100/values.tail     |             372.5 (30.25) |           377.88 (25.74) |            346.22 (50.02) |           -7.06% |
| 100/values.random   |            581.18 (41.33) |           585.56 (51.64) |            542.96 (46.36) |           -6.58% |
| 100/values          |       26,191.6 (3,149.66) |        27,347.85 (5,604) |       24,658.5 (3,463.82) |           -5.85% |
| 100/sequence        |      24,708.4 (11,761.91) |    20,856.05 (12,791.31) |      28,007.42 (9,556.54) |          +13.35% |
| 20000/value.head    |              27.36 (8.67) |              29.77 (8.2) |             34.29 (13.13) |          +25.33% |
| 20000/value.middle  |              28.65 (1.97) |             26.52 (4.26) |              25.21 (0.88) |          -11.99% |
| 20000/value.tail    |              28.65 (2.11) |             23.82 (1.53) |              28.77 (3.63) |           +0.41% |
| 20000/value.random  |          2,847.57 (283.7) |        2,889.65 (425.77) |         2,846.77 (392.99) |           -0.03% |
| 20000/values.head   |             165.57 (7.76) |           166.08 (15.93) |             136.14 (19.2) |          -17.78% |
| 20000/values.middle |            178.82 (44.87) |           186.96 (53.28) |            144.64 (29.39) |          -19.11% |
| 20000/values.tail   |            155.54 (16.95) |           162.72 (26.72) |            130.63 (13.26) |          -16.02% |
| 20000/values.random |           3,440.7 (197.6) |        3,534.06 (149.29) |         3,380.14 (405.52) |           -1.76% |
| 20000/values        | 6,139,168.75 (323,590.63) |   6,422,950 (490,290.62) |   6,376,812.5 (597,287.5) |           +3.87% |
| 20000/sequence      |  4,011,468.75 (524,212.5) | 3,691,512.5 (227,293.75) | 3,897,718.75 (287,431.25) |           -2.84% |

## Positional reads, independent repetition

The same inputs, bounds and twelve measured/four warmup rounds in a fresh Node
process. These results are not pooled with the first repetition. Small sequence
export’s first +13.35% becomes +0.42%; large head scalar’s +25.33% becomes +3.87%.
Large tail scalar is +9.87% (about +2.2 ns) here, while its first repetition was +0.41%.
Point reads have no demonstrated general speedup; a universal absence of a small
regression is not established. Range-read gains repeat. Full visible values are
−2.29% and −2.90% in this repetition, versus −5.85% and +3.87% in the first.

| Case                |                  baseline |                     control |                       final | Candidate change |
| ------------------- | ------------------------: | --------------------------: | --------------------------: | ---------------: |
| 100/value.head      |                16.6 (0.3) |                17.81 (1.03) |                16.67 (0.95) |            +0.4% |
| 100/value.middle    |              16.51 (1.46) |                17.46 (1.12) |                16.76 (0.84) |           +1.48% |
| 100/value.tail      |              16.55 (0.81) |                16.91 (0.95) |                16.69 (0.44) |           +0.87% |
| 100/value.random    |             141.47 (5.97) |              143.54 (16.33) |              142.12 (13.78) |           +0.46% |
| 100/values.head     |             274.11 (9.51) |              282.27 (10.13) |              241.99 (22.59) |          -11.72% |
| 100/values.middle   |            233.95 (14.07) |              230.46 (14.73) |               200.65 (4.91) |          -14.23% |
| 100/values.tail     |             284.89 (32.3) |              281.19 (35.18) |              239.24 (41.18) |          -16.02% |
| 100/values.random   |            407.35 (19.55) |              415.68 (32.37) |              361.72 (16.61) |           -11.2% |
| 100/values          |      20,429.98 (1,076.03) |        20,276.07 (1,882.18) |           19,962.7 (715.43) |           -2.29% |
| 100/sequence        |       15,485.16 (1,125.2) |        15,145.12 (1,594.34) |        15,549.61 (1,365.82) |           +0.42% |
| 20000/value.head    |              18.25 (0.56) |                22.22 (0.96) |                18.96 (0.84) |           +3.87% |
| 20000/value.middle  |              20.85 (0.84) |                20.56 (0.89) |                20.96 (0.77) |           +0.52% |
| 20000/value.tail    |              22.35 (0.76) |                19.16 (0.54) |                24.56 (0.56) |           +9.87% |
| 20000/value.random  |          1,428.74 (61.91) |            1,479.88 (93.15) |             1,422.4 (50.09) |           -0.44% |
| 20000/values.head   |             122.96 (6.82) |              160.58 (10.71) |                 92.32 (2.7) |          -24.91% |
| 20000/values.middle |             117.35 (4.94) |               153.57 (7.35) |                84.15 (4.93) |          -28.29% |
| 20000/values.tail   |              113.4 (3.08) |               149.65 (5.97) |                88.58 (2.89) |          -21.89% |
| 20000/values.random |           1,891.3 (94.95) |            1,918.45 (91.35) |             1,839.87 (56.9) |           -2.72% |
| 20000/values        | 5,784,737.5 (1,410,737.5) | 6,016,643.75 (1,895,009.38) | 5,616,793.75 (2,607,484.38) |            -2.9% |
| 20000/sequence      |   2,750,412.5 (75,378.13) |    2,801,506.25 (82,284.38) |    2,752,093.75 (69,756.25) |           +0.06% |

## Replication, first repetition

Ten measured rounds after four warmup rounds. Same 100/20,000-group fixtures;
1,000 causally ordered tail operations per receiver. Eight receiver copies for
100 groups and two for 20,000 groups. Authoring, hydration, checks and destruction
are untimed. In this first repetition the duplicate cases include one fresh
delivery followed by 999 duplicates; this was corrected in the second repetition.
Values and canonical authored inputs must agree between builds.

| Case                         |          baseline |           control |             final | Candidate change |
| ---------------------------- | ----------------: | ----------------: | ----------------: | ---------------: |
| 100/apply.insert             |    475.32 (45.82) |     459.2 (113.6) |    437.04 (55.03) |           -8.05% |
| 100/apply.remove             |     792.14 (58.4) |    819.93 (53.47) |    749.01 (40.42) |           -5.44% |
| 100/apply.replace            | 3,346.62 (235.82) | 3,352.72 (199.42) | 3,239.53 (238.66) |            -3.2% |
| 100/merge.insert             |    933.14 (71.76) |   982.41 (163.14) |   913.63 (110.76) |           -2.09% |
| 100/apply.duplicateInsert    |      368.9 (32.1) |    346.42 (46.12) |     300.91 (26.9) |          -18.43% |
| 100/apply.duplicateRemove    |    538.62 (32.28) |    498.47 (28.37) |    438.62 (13.99) |          -18.57% |
| 100/apply.duplicateReplace   |    849.36 (45.69) |    823.64 (51.76) |    756.63 (64.95) |          -10.92% |
| 20000/apply.insert           |      839.1 (63.4) |   827.67 (156.89) |     793.08 (57.1) |           -5.49% |
| 20000/apply.remove           |     934.17 (36.9) |   976.75 (251.11) |    867.35 (85.05) |           -7.15% |
| 20000/apply.replace          | 3,785.03 (110.41) | 3,657.67 (167.65) | 3,729.17 (277.25) |           -1.48% |
| 20000/merge.insert           |  1,245.95 (63.56) |   1,261.7 (62.45) | 1,174.52 (127.61) |           -5.73% |
| 20000/apply.duplicateInsert  |   670.35 (103.21) |    678.07 (65.91) |    588.53 (78.71) |          -12.21% |
| 20000/apply.duplicateRemove  |    587.17 (39.26) |     566.95 (57.9) |    497.75 (97.96) |          -15.23% |
| 20000/apply.duplicateReplace |   1,122.9 (62.63) |  1,032.53 (87.31) |  1,020.75 (51.61) |            -9.1% |

## Replication, duplicates pre-materialized

Independent ten-round repetition with the same warmup and fixtures. Duplicate
cases now pre-apply their operation outside timing: all 1,000 timed deliveries
are duplicates. The corrected repetition still improves every duplicate median,
but fresh 100-group replacement is +10.16% and fresh 20,000-group removal +7.45%.
Their first repetition was −3.20% and −7.15%, respectively. Broad dispersion and
the A/A control are shown; neither a universal apply gain nor an absence of any
small regression is established. Both observations are retained.

| Case                         |            baseline |             control |             final | Candidate change |
| ---------------------------- | ------------------: | ------------------: | ----------------: | ---------------: |
| 100/apply.insert             |       473.94 (32.1) |      480.08 (39.34) |    410.26 (27.57) |          -13.44% |
| 100/apply.remove             |      869.46 (58.43) |      876.06 (89.99) |    799.66 (60.75) |           -8.03% |
| 100/apply.replace            | 4,536.02 (1,305.93) | 4,343.22 (1,917.29) |  4,996.92 (949.3) |          +10.16% |
| 100/merge.insert             |   1,609.83 (560.43) |   1,537.41 (740.92) | 1,600.07 (418.32) |           -0.61% |
| 100/apply.duplicateInsert    |      420.71 (32.58) |     476.71 (242.37) |   403.22 (107.66) |           -4.16% |
| 100/apply.duplicateRemove    |     993.58 (323.22) |     760.71 (238.85) |   841.47 (337.26) |          -15.31% |
| 100/apply.duplicateReplace   |   1,048.06 (227.77) |      899.06 (78.09) |   921.01 (132.52) |          -12.12% |
| 20000/apply.insert           |     904.65 (196.62) |     891.53 (330.61) |   819.55 (279.86) |           -9.41% |
| 20000/apply.remove           |   1,341.12 (760.95) |   1,306.43 (791.55) | 1,441.07 (803.92) |           +7.45% |
| 20000/apply.replace          |   4,188.35 (823.95) |    3,726.4 (764.44) |  3,779.9 (404.73) |           -9.75% |
| 20000/merge.insert           |    1,532.4 (701.59) |    1,230.6 (261.91) | 1,387.38 (482.16) |           -9.46% |
| 20000/apply.duplicateInsert  |      469.2 (126.69) |     436.63 (262.01) |    391.55 (76.66) |          -16.55% |
| 20000/apply.duplicateRemove  |        661.3 (64.7) |     655.88 (139.44) |    571.35 (81.79) |           -13.6% |
| 20000/apply.duplicateReplace |    1,074.63 (88.05) |   1,075.87 (307.27) |   969.85 (320.45) |           -9.75% |

## Creation and lifetime

Twelve measured/four warmup rounds. `create.sequence` hydrates one 50,000-Frame
root; `create.wide` hydrates 20,000 groups plus 2,000 acknowledged replacements.
Construction includes the constructor call only; created instances are retained
and destroyed after timing. `destroy` times destruction of 10,000 empty live
instances. `retire` is principally already-retired no-op cost, not retirement of
200,000 distinct Actors. Duplicate apply is an already materialized positive root.

| Case            |                   baseline |                     control |                  final | Candidate change |
| --------------- | -------------------------: | --------------------------: | ---------------------: | ---------------: |
| create.empty    |            548.17 (236.22) |             558.83 (153.33) |        535.33 (145.59) |           -2.34% |
| create.sequence |          1,573.73 (281.08) |           1,624.01 (156.72) |      1,614.45 (196.32) |           +2.59% |
| create.wide     | 8,122,487.5 (1,014,167.19) | 8,006,471.87 (1,037,704.69) | 7,399,200 (610,203.13) |            -8.9% |
| destroy         |             195.97 (55.61) |             294.03 (146.76) |         246.76 (123.7) |          +25.92% |
| retire          |              71.83 (10.07) |                70.28 (8.94) |          72.86 (17.94) |           +1.44% |
| apply.duplicate |             315.49 (45.19) |              320.55 (16.97) |          312.08 (7.19) |           -1.08% |

Destroy changes from 195.97 to 246.76 ns in this guard, while the byte-identical
control is 294.03 ns. This does not demonstrate a destruction improvement or
prove an absence of regression; the code path itself is unchanged. Small-root
creation is similarly inconclusive. Wide hydration improves by 8.90%.

## Tuple checks

Twelve measured/four warmup rounds. Eight/100-field snapshots are populated and
each field is replaced before export. Fresh remote replacements use 4,096
pre-authored random-index updates; duplicate apply pre-materializes one update.
Snapshot construction uses 512 retained instances per burst; scalar and length
loops make 262,144 calls. All resulting visible values are checked. This guard
uses named monomorphic callers rather than the full suite’s generic switch.

| Case                           |           baseline |            control |              final | Candidate change |
| ------------------------------ | -----------------: | -----------------: | -----------------: | ---------------: |
| tuple/8/apply.replace          |   1,120.25 (74.38) |  1,091.31 (125.55) |  1,066.66 (131.63) |           -4.78% |
| tuple/100/apply.replace        |  1,212.85 (181.01) |  1,168.12 (116.71) |  1,112.57 (123.94) |           -8.27% |
| tuple/100/create.sequence      | 10,583.69 (622.61) | 10,379.49 (502.64) | 10,177.83 (250.34) |           -3.83% |
| tuple/100/value.random         |        21.44 (2.3) |       22.15 (1.32) |       20.59 (2.06) |           -3.97% |
| projection/100/apply.duplicate |      712.9 (70.92) |     688.18 (47.44) |     719.32 (59.49) |            +0.9% |
| tuple/2/length                 |         9.7 (0.51) |         9.37 (0.5) |        9.05 (1.31) |           -6.67% |

## All apparent broad-suite regressions

Every timing whose candidate median exceeds baseline by over 5% is listed below.
This is a reporting cutoff, not a statistical acceptance rule. “Lost old gain”
marks original → baseline below −5%, followed by original → candidate above +5%.
The 55 rows with positive paired median over 5% and at least four slower pairs
remain visible in the full table. Warm guards test representative paths, not an
exact reproduction of every broad-suite JIT and lifetime context.

| Case                                    |       Baseline median (IQR) |      Candidate median (IQR) |  Change | Slower pairs / 5 | Lost old gain |
| --------------------------------------- | --------------------------: | --------------------------: | ------: | ---------------: | ------------- |
| throughput/1000/apply.duplicateRemove   |           1,907.34 (211.35) |           2,012.07 (577.23) |  +5.49% |                3 |               |
| throughput/5000/apply.duplicateRemove   |             1,747.7 (137.4) |            2,074.54 (95.55) |  +18.7% |                4 | yes           |
| throughput/15000/apply.duplicateRemove  |            1,607.06 (84.59) |           1,857.98 (401.15) | +15.61% |                5 |               |
| throughput/20000/apply.duplicateRemove  |           1,763.68 (190.82) |           1,975.79 (115.91) | +12.03% |                5 | yes           |
| throughput/10000/apply.duplicateReplace |           2,367.39 (154.12) |           2,568.23 (211.13) |  +8.48% |                3 |               |
| throughput/1000/apply.insert            |         2,548.34 (1,562.38) |           2,825.82 (367.88) | +10.89% |                2 |               |
| throughput/100/apply.remove             |           3,982.46 (381.35) |            5,148.95 (550.6) | +29.29% |                4 | yes           |
| throughput/1000/apply.remove            |           3,337.95 (603.61) |           4,028.05 (695.11) | +20.67% |                4 |               |
| throughput/5000/apply.remove            |           2,807.04 (633.41) |            3,475.53 (95.18) | +23.81% |                4 |               |
| throughput/20000/apply.remove           |            3,410.02 (489.5) |           3,730.16 (874.16) |  +9.39% |                4 |               |
| throughput/100/apply.replace            |          20,075.47 (317.02) |        22,551.83 (3,712.56) | +12.34% |                2 |               |
| throughput/25000/apply.replace          |        19,872.48 (1,076.44) |        21,033.52 (3,794.35) |  +5.84% |                4 |               |
| throughput/100/create.empty             |            1,097.21 (790.2) |            1,223.74 (64.31) | +11.53% |                3 |               |
| throughput/5000/create.empty            |           1,118.99 (167.39) |           1,500.44 (783.75) | +34.09% |                4 | yes           |
| throughput/20000/create.empty           |           1,107.89 (182.18) |           1,189.19 (225.46) |  +7.34% |                3 |               |
| throughput/20000/create.sequence        |           2,354.78 (357.25) |           2,895.52 (845.62) | +22.96% |                4 | yes           |
| throughput/1000/insert.middle           |             977.08 (391.38) |           1,048.64 (188.74) |  +7.32% |                2 |               |
| throughput/15000/insert.middle          |             885.52 (154.53) |            1,011.36 (77.84) | +14.21% |                4 |               |
| throughput/100/insert.random            |            1,949.86 (469.2) |           2,156.91 (358.13) | +10.62% |                1 |               |
| throughput/1000/insert.random           |             1,794.8 (92.91) |           2,032.17 (429.55) | +13.23% |                2 |               |
| throughput/5000/insert.random           |            1,668.6 (513.03) |           1,853.44 (240.82) | +11.08% |                2 |               |
| throughput/20000/insert.random          |           1,577.37 (239.84) |            1,692.78 (85.43) |  +7.32% |                4 |               |
| throughput/5000/insert.sameIndex        |             821.83 (166.48) |           1,009.91 (124.23) | +22.89% |                4 |               |
| throughput/25000/insert.sameIndex       |              818.32 (46.77) |           1,024.56 (317.73) |  +25.2% |                3 |               |
| throughput/1000/insert.tail             |           1,265.99 (868.28) |            1,511.2 (456.39) | +19.37% |                2 | yes           |
| throughput/5000/insert.tail             |            1,287.6 (198.99) |           1,458.75 (178.82) | +13.29% |                3 |               |
| throughput/10000/insert.tail            |           1,329.07 (367.74) |           1,467.82 (273.52) | +10.44% |                3 |               |
| throughput/20000/insert.tail            |            1,226.96 (54.06) |           1,290.78 (124.87) |   +5.2% |                5 |               |
| throughput/25000/insert.tail            |           1,250.95 (141.13) |           1,381.12 (744.13) | +10.41% |                4 |               |
| throughput/5000/length                  |               160.12 (4.23) |              169.32 (40.62) |  +5.75% |                3 |               |
| throughput/100/merge.duplicate          |           1,755.52 (145.13) |           1,935.85 (159.39) | +10.27% |                4 |               |
| throughput/5000/merge.duplicate         |             1,075.5 (12.48) |           1,228.75 (639.53) | +14.25% |                4 |               |
| throughput/10000/merge.duplicate        |            1,154.99 (89.58) |              1,416.86 (101) | +22.67% |                4 | yes           |
| throughput/20000/merge.duplicate        |           1,054.11 (148.16) |             1,167.39 (71.9) | +10.75% |                3 | yes           |
| throughput/1000/merge.insert            |           2,966.22 (757.76) |            3,259.89 (602.8) |   +9.9% |                2 |               |
| throughput/5000/merge.insert            |           2,746.04 (258.17) |            3,074.6 (590.58) | +11.96% |                4 |               |
| throughput/100/remove.head              |           1,339.84 (562.46) |           1,897.07 (870.25) | +41.59% |                3 | yes           |
| throughput/5000/remove.head             |            1,622.3 (172.61) |            1,778.01 (643.3) |   +9.6% |                3 |               |
| throughput/100/remove.middle            |           1,733.85 (515.05) |           2,541.56 (880.78) | +46.58% |                4 |               |
| throughput/1000/remove.middle           |            2,415.28 (81.26) |           2,842.34 (786.36) | +17.68% |                3 |               |
| throughput/5000/remove.middle           |           2,346.74 (574.63) |         2,791.57 (1,044.31) | +18.96% |                3 |               |
| throughput/100/remove.random            |         1,853.14 (1,209.35) |           2,186.39 (752.33) | +17.98% |                3 |               |
| throughput/10000/remove.random          |              2,391.23 (512) |           2,512.61 (480.19) |  +5.08% |                1 |               |
| throughput/25000/remove.random          |              2,517.67 (760) |            2,781.36 (830.1) | +10.47% |                3 |               |
| throughput/20000/remove.sameIndex       |           1,985.69 (337.67) |           2,086.09 (101.94) |  +5.06% |                4 |               |
| throughput/100/remove.tail              |           1,279.19 (206.68) |            1,497.8 (633.56) | +17.09% |                3 | yes           |
| throughput/5000/remove.tail             |            1,404.8 (154.88) |           1,566.83 (297.41) | +11.53% |                4 |               |
| throughput/5000/replace.head            |           2,267.61 (143.67) |            2,604.2 (533.95) | +14.84% |                3 |               |
| throughput/25000/replace.head           |           2,406.53 (559.28) |            2,531.62 (399.8) |   +5.2% |                2 |               |
| throughput/5000/replace.middle          |           2,196.73 (412.35) |            2,439.2 (301.19) | +11.04% |                4 |               |
| throughput/10000/replace.middle         |            2,180.5 (563.95) |           2,609.21 (730.97) | +19.66% |                4 | yes           |
| throughput/10000/replace.random         |           3,975.89 (370.95) |           4,250.79 (287.96) |  +6.91% |                4 |               |
| throughput/15000/replace.random         |            3,605.07 (562.6) |         4,044.81 (1,408.34) |  +12.2% |                3 |               |
| throughput/100/replace.sameIndex        |           1,752.21 (175.52) |           2,011.77 (702.87) | +14.81% |                3 |               |
| throughput/5000/replace.sameIndex       |           2,046.01 (525.19) |           2,357.12 (750.58) | +15.21% |                3 |               |
| throughput/25000/replace.sameIndex      |           2,024.52 (819.73) |           2,415.94 (516.41) | +19.33% |                1 |               |
| throughput/100/replace.tail             |           1,727.98 (328.08) |           1,900.42 (480.82) |  +9.98% |                3 |               |
| throughput/10000/replace.tail           |           1,828.19 (349.75) |           2,557.45 (355.44) | +39.89% |                5 |               |
| throughput/1000/retire                  |              459.56 (62.36) |              485.91 (47.21) |  +5.73% |                3 |               |
| throughput/5000/retire                  |              449.03 (53.25) |              494.92 (109.9) | +10.22% |                5 |               |
| throughput/10000/sequence               |              678.07 (56.07) |               800.09 (55.2) |    +18% |                5 | yes           |
| throughput/1000/value.head              |              229.56 (41.09) |             347.63 (151.49) | +51.43% |                4 |               |
| throughput/10000/value.head             |               255.21 (14.1) |              279.93 (47.06) |  +9.69% |                5 |               |
| throughput/20000/value.head             |                 260 (24.36) |              312.96 (68.94) | +20.37% |                5 | yes           |
| throughput/25000/value.head             |               243.16 (4.04) |              290.51 (58.98) | +19.47% |                5 | yes           |
| throughput/1000/value.middle            |              347.37 (90.37) |              420.4 (101.96) | +21.02% |                3 |               |
| throughput/10000/value.middle           |              313.05 (15.05) |              370.24 (90.18) | +18.27% |                5 | yes           |
| throughput/25000/value.middle           |              345.28 (63.24) |              373.98 (61.81) |  +8.31% |                3 |               |
| throughput/25000/value.tail             |              278.87 (12.22) |              295.86 (20.85) |  +6.09% |                2 |               |
| throughput/100/values                   |         4,523.51 (2,262.78) |         6,107.52 (1,473.01) | +35.02% |                3 |               |
| throughput/1000/values                  |      180,632.29 (58,917.33) |      230,626.34 (87,088.44) | +27.68% |                4 | yes           |
| throughput/5000/values                  |     562,874.48 (167,455.73) |      659,709.9 (144,715.63) |  +17.2% |                4 |               |
| throughput/25000/values                 | 3,408,331.25 (1,156,915.63) | 4,136,707.81 (1,074,615.63) | +21.37% |                3 | yes           |
| throughput/1000/values.sameIndex        |              424.33 (43.44) |              456.96 (78.36) |  +7.69% |                2 |               |
| throughput/20000/values.sameIndex       |              386.44 (13.22) |             439.76 (176.59) |  +13.8% |                3 | yes           |
| checkpoint/up/1000/values               |         1,587,800 (168,100) |         1,688,000 (219,200) |  +6.31% |                4 |               |
| checkpoint/down/10000/values            |         7,175,700 (822,900) |       7,572,500 (1,202,200) |  +5.53% |                3 |               |
| checkpoint/down/5000/sequence           |      14,716,000 (2,306,500) |      16,351,700 (2,334,500) | +11.12% |                3 |               |
| tuple/tuple/2/create.empty              |             618.98 (131.77) |              676.27 (87.49) |  +9.26% |                3 |               |
| tuple/projection/2/create.sequence      |            1,623.57 (43.29) |            1,714.5 (177.99) |   +5.6% |                3 |               |
| tuple/tuple/2/create.sequence           |           1,666.17 (227.86) |           1,905.64 (643.48) | +14.37% |                4 |               |
| tuple/projection/2/apply.replace        |           1,656.31 (217.33) |            1,830.25 (311.4) |  +10.5% |                2 |               |
| tuple/projection/2/apply.duplicate      |            1,065.17 (398.8) |           1,149.22 (238.92) |  +7.89% |                2 |               |
| tuple/projection/2/length               |                 7.86 (1.46) |                  8.31 (0.9) |  +5.76% |                4 |               |
| tuple/tuple/2/length                    |                 9.59 (1.84) |                11.06 (3.07) | +15.38% |                4 |               |
| tuple/tuple/4/create.empty              |             810.15 (249.17) |              913.73 (87.72) | +12.78% |                3 |               |
| tuple/tuple/4/create.sequence           |           2,421.46 (444.73) |           2,753.82 (374.23) | +13.73% |                2 |               |
| tuple/projection/4/replace.random       |            1,556.04 (99.74) |           1,646.09 (157.78) |  +5.79% |                3 |               |
| tuple/tuple/4/replace.random            |           1,116.31 (555.47) |           1,247.42 (377.86) | +11.74% |                2 |               |
| tuple/tuple/4/apply.replace             |           2,335.21 (393.79) |           2,600.78 (487.81) | +11.37% |                3 |               |
| tuple/projection/4/apply.duplicate      |           1,037.61 (383.66) |           1,179.16 (384.05) | +13.64% |                4 |               |
| tuple/tuple/4/apply.duplicate           |            1,370.8 (417.64) |            1,842.7 (391.85) | +34.42% |                2 |               |
| tuple/tuple/4/sequence                  |             769.09 (139.91) |              816.31 (58.63) |  +6.14% |                3 |               |
| tuple/projection/8/create.empty         |               821.4 (48.48) |             907.84 (119.18) | +10.52% |                4 |               |
| tuple/tuple/8/create.empty              |             797.73 (102.42) |             874.79 (267.95) |  +9.66% |                3 |               |
| tuple/tuple/8/create.sequence           |           2,775.49 (111.81) |           3,090.45 (551.09) | +11.35% |                4 |               |
| tuple/projection/8/replace.random       |            1,431.66 (76.99) |           1,618.22 (532.63) | +13.03% |                4 |               |
| tuple/tuple/8/replace.random            |           1,082.46 (101.66) |           1,138.48 (228.85) |  +5.18% |                2 |               |
| tuple/tuple/8/apply.replace             |           1,801.16 (448.59) |           2,333.09 (217.57) | +29.53% |                5 | yes           |
| tuple/projection/8/merge.duplicate      |           2,129.71 (174.92) |           2,528.06 (466.47) |  +18.7% |                5 |               |
| tuple/tuple/8/merge.duplicate           |            2,463.05 (88.65) |           2,650.44 (726.95) |  +7.61% |                3 |               |
| tuple/projection/8/value.random         |               67.98 (18.37) |               78.82 (17.95) | +15.96% |                2 |               |
| tuple/tuple/8/value.random              |                23.91 (0.79) |                 27.8 (4.67) | +16.28% |                3 | yes           |
| tuple/projection/8/sequence             |             998.38 (227.19) |            1,051.06 (37.06) |  +5.28% |                3 |               |
| tuple/tuple/100/create.sequence         |        11,790.91 (1,301.71) |        14,090.29 (6,390.78) |  +19.5% |                5 | yes           |
| tuple/tuple/100/apply.replace           |           1,282.08 (266.52) |           1,578.73 (962.77) | +23.14% |                2 |               |
| tuple/projection/100/apply.duplicate    |           1,176.16 (504.46) |              1,824 (597.68) | +55.08% |                4 | yes           |
| tuple/projection/100/merge.duplicate    |        12,446.12 (2,743.07) |        13,971.95 (2,233.52) | +12.26% |                2 |               |
| tuple/tuple/100/value.random            |                24.01 (1.34) |                28.15 (0.59) | +17.27% |                4 |               |

## Profiling

Node Inspector sampled at 100 µs on the distributed baseline ESM with the same
mixed 20,000-group fixture. Self samples are diagnostic, not timed comparisons.

| Work          | Largest relevant self-sample counts                                                      |
| ------------- | ---------------------------------------------------------------------------------------- |
| Middle scalar | native point export 33; `find_frame` 30                                                  |
| Middle range  | JS result 115; native dispatcher 62; JS call 44; `find_frame` 15                         |
| Creation      | hydrate 312; anchor insertion 137; snapshot Reader 112; Strip reserve 58                 |
| Sequence      | JS span reader 309; dispatcher 108; JS process garbage collection 90; snapshot append 78 |
| Tail apply    | JS apply 32; JS result 22; native apply 4                                                |

These samples motivate removing dispatch/result work from ranges, shrinking
snapshot Reader records, dropping the temporary fragment hash map and avoiding
unused output allocation. They do not prove a JIT explanation for every apparent
regression. Native input growth no longer preserves or zeroes overwritten words.

## Attempts and decisions

1. The first direct range export extracted all one-span handling into the shared
   helper. Three complete matched baseline/candidate runs showed target range
   wins but worse full-value/export cases. Rejected as written; the one-span
   `.slice` prefix remains inline in the range method.
2. An inline gate-hit prefix with an out-of-line lookup miss improved warmed
   gate hits, but 100-group random scalar reads slowed by about 10–12% in two
   separate twelve-round guards. Reverted completely. Three full runs of each
   original/baseline/intermediate build were also retained locally.
3. A later intermediate build removed input initialization, skipped an unused
   empty ACK output and increased the concat batch. Its remaining gate-prefix
   change was removed before the final five-run measurements. Empty output now
   returns directly from the dedicated range method.
4. Restoring all twelve original public catch bodies in a temporary variant
   tested whether the shared cold error helper caused scalar regressions. The
   twelve-round comparison below uses the final build as baseline and an exact
   final-build copy as control. It did not show a consistent benefit; rejected.
   The same native binary was used in all three variants.

| Case                |                    final |             finalcontrol |             inline-errors | Candidate change |
| ------------------- | -----------------------: | -----------------------: | ------------------------: | ---------------: |
| 100/value.head      |             18.24 (2.52) |             17.91 (2.86) |              19.99 (3.35) |           +9.56% |
| 100/value.middle    |             16.56 (0.34) |              16.61 (1.1) |              16.91 (2.59) |           +2.15% |
| 100/value.tail      |             17.16 (0.95) |             16.97 (1.12) |              17.08 (1.43) |           -0.41% |
| 100/value.random    |           137.85 (11.52) |            136.67 (3.07) |             140.14 (8.37) |           +1.66% |
| 100/values.head     |           251.25 (35.93) |           253.03 (16.99) |            241.81 (15.57) |           -3.76% |
| 100/values.middle   |             198.35 (7.2) |            200.9 (13.46) |            197.03 (17.77) |           -0.67% |
| 100/values.tail     |           249.67 (26.94) |           240.33 (28.01) |             256.5 (55.13) |           +2.73% |
| 100/values.random   |           378.56 (13.79) |            376.71 (7.28) |            390.18 (27.28) |           +3.07% |
| 100/values          |       20,098.05 (992.38) |       19,658.01 (837.35) |      20,627.64 (1,287.65) |           +2.64% |
| 100/sequence        |     16,534.96 (1,205.96) |     16,765.82 (2,295.61) |      15,777.93 (2,747.85) |           -4.58% |
| 20000/value.head    |              17.9 (1.34) |             17.31 (0.71) |                 17.98 (1) |           +0.46% |
| 20000/value.middle  |             20.11 (1.45) |             19.86 (1.49) |              19.83 (1.23) |           -1.39% |
| 20000/value.tail    |             23.37 (1.33) |             23.57 (1.08) |              23.36 (1.67) |           -0.03% |
| 20000/value.random  |        1,442.33 (350.45) |           1,420.28 (126) |         1,529.54 (329.44) |           +6.05% |
| 20000/values.head   |             91.05 (3.32) |             89.89 (3.82) |              90.99 (6.21) |           -0.07% |
| 20000/values.middle |             84.39 (2.73) |             84.18 (2.91) |              86.29 (3.76) |           +2.25% |
| 20000/values.tail   |             85.92 (2.74) |             86.04 (5.42) |              88.06 (5.09) |            +2.5% |
| 20000/values.random |         1,931.97 (91.35) |         1,836.35 (93.45) |         1,870.73 (157.49) |           -3.17% |
| 20000/values        | 4,907,237.5 (162,284.37) | 4,941,912.5 (260,153.13) |  4,926,062.5 (222,584.38) |           +0.38% |
| 20000/sequence      |    2,716,250 (35,103.12) |   2,808,850 (193,103.13) | 2,759,343.75 (132,943.75) |           +1.59% |
