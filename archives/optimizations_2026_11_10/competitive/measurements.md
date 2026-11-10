# Public API measurements

Final candidate: the same source and compiled Wasm used by the passing test run.
Environment and build settings are in the [round report](README.md).
All timings below are ns/call, median (IQR); lower is better. Percentages compare
candidate and baseline medians, not throughput. An A/A control is a second import
of the byte-identical baseline build. Separate named callers avoid one shared
polymorphic benchmark call site. Fixtures, JS process garbage collection,
verification and destruction are outside timing unless named by the operation.
No external benchmark repository is modified or rerun for these measurements.

## Lifecycle

Five complete runs per build, matching input seeds. Each run uses the existing
checkpoint compaction and reconstruction procedure. These final candidate runs
reuse the preceding interleaved batch's five baseline runs; they are not themselves
temporally interleaved. The [complete table](performance.md) retains every row.

| Operation      |             Baseline |          Candidate |  Change |
| -------------- | -------------------: | -----------------: | ------: |
| apply.random   |  16,837.31 (1,692.5) |  15,787.5 (234.25) |  -6.24% |
| insert.head    |     1,158.51 (76.18) |  1,001.69 (139.78) | -13.54% |
| insert.random  |    7,395.06 (732.31) |   6,563.8 (320.59) | -11.24% |
| insert.tail    |    1,260.49 (272.71) |  1,027.44 (117.99) | -18.49% |
| remove.head    |   3,160.96 (1,471.9) |   2,589.89 (32.24) | -18.07% |
| remove.random  | 13,472.97 (1,555.53) | 11,118.58 (577.54) | -17.47% |
| remove.tail    |    2,871.71 (559.09) |  2,836.26 (374.64) |  -1.23% |
| replace.head   |    3,779.48 (211.85) |  3,345.09 (369.99) | -11.49% |
| replace.random | 13,048.61 (1,188.46) | 11,470.85 (808.71) | -12.09% |
| replace.tail   | 28,914.87 (3,656.88) |   27,349.6 (37.49) |  -5.41% |
| value.head     |       598.66 (64.49) |     536.58 (34.11) | -10.37% |
| value.random   |   10,070.21 (459.42) |  8,499.69 (130.79) |  -15.6% |
| value.tail     |       377.42 (23.45) |     300.16 (11.68) | -20.47% |

All 13 full-lifecycle medians improve. Across all 424 timing rows, however,
246 improve by more than 5% and 79 worsen by more than 5%. A gain in lifecycle
totals does not establish that every individual checkpoint or short call improves.
All 96 memory/storage rows are retained; encoded snapshot sizes are identical.

## Mixed-document local calls

Ten counterbalanced rounds after four warmup rounds, equal fixture construction
for every build. Each group authors 32 Frames; the fixture also includes replicated
replacements. Range reads span 32 Frames. Each edit case starts from a fresh copy
of the same snapshot and final values are checked. Combined names time both calls.

| Groups | Operation      |                  Baseline |                 A/A control |                   Candidate |  Change |
| -----: | -------------- | ------------------------: | --------------------------: | --------------------------: | ------: |
|    100 | insert.head    |           435.35 (149.63) |              381.91 (39.83) |             374.14 (116.59) | -14.06% |
|    100 | insert.middle  |            324.03 (69.42) |             442.94 (181.69) |              330.93 (61.95) |  +2.13% |
|    100 | insert.tail    |            203.95 (91.15) |              142.83 (63.03) |              145.58 (41.35) | -28.62% |
|    100 | insert.random  |            800.93 (161.9) |             733.38 (151.83) |              725.4 (162.72) |  -9.43% |
|    100 | remove.head    |            998.05 (46.48) |               847.88 (63.9) |             864.23 (226.46) | -13.41% |
|    100 | remove.middle  |            854.03 (165.4) |             964.54 (200.03) |             781.55 (125.73) |  -8.49% |
|    100 | remove.tail    |            902.3 (107.07) |             965.43 (226.32) |             762.53 (142.75) | -15.49% |
|    100 | remove.random  |         1,427.54 (207.95) |           1,408.54 (315.42) |           1,232.06 (188.33) | -13.69% |
|    100 | replace.head   |         1,459.79 (163.51) |           1,556.32 (368.76) |           1,401.46 (143.72) |     -4% |
|    100 | replace.middle |         1,369.12 (402.54) |           1,693.04 (374.06) |           1,642.68 (449.04) | +19.98% |
|    100 | replace.tail   |          1,795.91 (492.2) |            1,893.33 (559.1) |           1,566.84 (256.58) | -12.76% |
|    100 | replace.random |         2,360.84 (267.82) |           2,366.92 (394.16) |           2,160.88 (181.49) |  -8.47% |
|    100 | value.head     |               47.75 (4.7) |                45.62 (9.14) |                42.61 (4.62) | -10.77% |
|    100 | value.middle   |              41.15 (7.91) |                39.69 (7.22) |                37.47 (5.22) |  -8.94% |
|    100 | value.tail     |               50.97 (5.5) |                46.91 (8.53) |                45.82 (6.74) | -10.11% |
|    100 | value.random   |            154.07 (13.77) |               156.71 (7.81) |               136.84 (8.13) | -11.18% |
|    100 | values.middle  |            171.83 (58.24) |              198.03 (63.09) |              205.98 (73.72) | +19.88% |
|    100 | values         |     68,335.16 (18,349.32) |        68,200.39 (7,686.82) |        22,315.43 (8,027.15) | -67.34% |
|    100 | sequence       |      29,230.86 (5,501.95) |        30,219.14 (6,432.23) |        19,428.52 (4,489.06) | -33.53% |
| 20,000 | insert.head    |            410.64 (76.47) |             454.61 (138.58) |              416.63 (101.3) |  +1.46% |
| 20,000 | insert.middle  |           441.44 (236.51) |              462.22 (54.92) |             447.99 (132.79) |  +1.48% |
| 20,000 | insert.tail    |            321.22 (77.68) |               307.42 (67.1) |             247.22 (115.41) | -23.04% |
| 20,000 | insert.random  |         1,824.01 (333.61) |           1,784.66 (179.36) |           1,575.05 (303.68) | -13.65% |
| 20,000 | remove.head    |           907.82 (259.99) |             840.61 (300.09) |             778.74 (186.21) | -14.22% |
| 20,000 | remove.middle  |           894.26 (102.05) |                 784.25 (83) |               761.8 (79.95) | -14.81% |
| 20,000 | remove.tail    |            907.75 (90.68) |              754.03 (93.17) |              771.17 (76.93) | -15.05% |
| 20,000 | remove.random  |         2,652.92 (122.76) |           2,504.79 (241.89) |           2,534.69 (128.29) |  -4.46% |
| 20,000 | replace.head   |          1,425.14 (160.9) |            1,417.04 (238.3) |           1,384.98 (218.28) |  -2.82% |
| 20,000 | replace.middle |         1,403.59 (190.06) |           1,358.53 (456.67) |           1,426.23 (111.44) |  +1.61% |
| 20,000 | replace.tail   |          1,561.2 (364.89) |           1,440.47 (305.64) |           1,593.66 (306.77) |  +2.08% |
| 20,000 | replace.random |          3,377.02 (387.6) |           3,415.71 (448.81) |           3,231.89 (896.54) |   -4.3% |
| 20,000 | value.head     |              40.14 (8.86) |                38.86 (4.08) |                36.04 (6.79) | -10.22% |
| 20,000 | value.middle   |              38.37 (1.47) |               34.58 (13.55) |                41.64 (3.83) |  +8.53% |
| 20,000 | value.tail     |              50.26 (15.1) |                47.48 (9.58) |                46.49 (8.69) |  -7.51% |
| 20,000 | value.random   |         1,292.93 (308.96) |           1,271.58 (216.15) |               978.9 (174.2) | -24.29% |
| 20,000 | values.middle  |            210.27 (69.59) |              217.93 (56.66) |              207.76 (49.02) |  -1.19% |
| 20,000 | values         |  7,321,800 (1,244,760.94) | 7,332,068.75 (1,607,210.94) | 6,503,446.88 (1,551,081.25) | -11.18% |
| 20,000 | sequence       | 5,020,156.25 (955,156.25) |    4,703,862.5 (779,443.75) |    3,878,693.75 (584,062.5) | -22.74% |

The 100-group full values result improves from 68.34 to 22.31 µs while the identical
baseline control stays at 68.20 µs. On 20,000 groups, random scalar reads improve
from 1.29 to 0.98 µs and sequence export from 5.02 to 3.88 ms. These are useful
reductions beyond the A/A variation. Conversely, the 20,000-group cached middle
read is 38.39 → 41.64 ns: a bounded +3.25 ns cost, not a claim of zero regression.
The small middle replacement slowdown also appears in the baseline control.

## Tail follow-up

Twelve counterbalanced rounds after four warmups. Short guard: 100 or 20,000
groups. Every iteration includes length lookup to compute the endpoint; named
head reads intentionally move the gate away from the tail. Whole-block mutations
change 32 Frames, and final values are checked.

| Groups | Operation              |            Baseline |         A/A control |           Candidate |  Change |
| -----: | ---------------------- | ------------------: | ------------------: | ------------------: | ------: |
|    100 | remove.tail32          |    1,772.91 (148.3) |   1,698.56 (178.66) |     1,537.5 (68.42) | -13.28% |
|    100 | readHead+remove.tail32 |    1,803.41 (142.3) |   1,870.03 (188.28) |   1,570.28 (112.11) | -12.93% |
|    100 | replace.tail32         |    1,011.79 (89.38) |       979.6 (26.79) |      962.48 (51.87) |  -4.87% |
|    100 | readHead+value.tail    |       176.51 (51.5) |      196.39 (47.24) |         53.44 (8.3) | -69.73% |
|    100 | readHead+values.tail32 |      936.99 (96.35) |      896.64 (52.22) |      292.07 (41.21) | -68.83% |
| 20,000 | remove.tail32          | 1,917.79 (1,138.54) |   1,351.01 (664.43) | 1,276.22 (1,054.16) | -33.45% |
| 20,000 | readHead+remove.tail32 |   1,404.68 (496.78) | 2,117.81 (1,281.13) |   1,583.44 (739.43) | +12.73% |
| 20,000 | replace.tail32         |   2,134.27 (588.39) |   1,929.83 (659.59) |    1,912.28 (953.9) |  -10.4% |
| 20,000 | readHead+value.tail    |      258.59 (78.69) |      185.38 (57.56) |       66.49 (18.69) | -74.29% |
| 20,000 | readHead+values.tail32 |     551.59 (326.73) |     425.34 (266.94) |        224 (109.92) | -59.39% |

The short large-document removal bursts have broad IQRs. A longer follow-up uses
8,192 removals per copy, four copies per batch, and retains at least half of the
initial visible content. It uses the same 12 measured rounds and four warmups.

| Groups | Operation              |         Baseline |       A/A control |         Candidate | Change |
| -----: | ---------------------- | ---------------: | ----------------: | ----------------: | -----: |
| 20,000 | remove.tail32          | 1,100.63 (77.86) | 1,118.31 (168.31) | 1,081.24 (136.27) | -1.76% |
| 20,000 | readHead+remove.tail32 | 1,244.45 (195.9) | 1,176.45 (174.98) | 1,127.28 (112.92) | -9.42% |

Direct tail reads are substantially faster after moving the gate to the head.
The longer removal guard finds no large removal penalty; the raw short-guard
variation is retained above. Tail insertion already used the known tail anchor;
this round removes its discarded cache stores rather than introducing a new index.

## Replication

Ten counterbalanced rounds after four warmups. Every build authors and verifies
identical canonical input. Each batch replays 1,000 changes into 64 independent
receivers for 100 groups or 16 receivers for 20,000 groups. Insert workloads begin
with a new tail Insertion and then extend it; remove and replace have independent
input sequences. Merge receives the same canonical insertions as snapshots.

| Groups | Operation     |          Baseline |       A/A control |         Candidate |  Change |
| -----: | ------------- | ----------------: | ----------------: | ----------------: | ------: |
|    100 | apply.insert  |    539.09 (57.73) |    534.79 (28.07) |     502.78 (22.4) |  -6.73% |
|    100 | apply.remove  |    984.58 (60.83) |    954.12 (20.01) |    939.89 (52.07) |  -4.54% |
|    100 | apply.replace | 4,570.64 (411.24) | 4,353.35 (497.04) | 4,212.35 (759.95) |  -7.84% |
|    100 | merge.insert  |  1,116.59 (88.12) |  1,123.81 (68.84) |  1,083.33 (70.35) |  -2.98% |
| 20,000 | apply.insert  |   984.66 (166.35) | 1,016.97 (201.36) | 1,216.85 (408.72) | +23.58% |
| 20,000 | apply.remove  | 1,267.97 (471.48) | 1,136.77 (230.59) | 1,211.76 (682.66) |  -4.43% |
| 20,000 | apply.replace | 4,053.72 (200.29) |  3,979.42 (452.2) | 3,893.75 (545.09) |  -3.95% |
| 20,000 | merge.insert  | 1,400.17 (287.53) | 1,447.45 (148.54) | 1,308.52 (187.04) |  -6.55% |

The 20,000-group short insert guard is +23.6%, with an IQR of 408.7 ns.
A longer insert follow-up replays 4,000 changes into eight receivers per batch,
using 12 counterbalanced measured rounds and four warmups. It checks the same
canonical input and final values for every receiver. This result does not reproduce
the short-guard penalty, but does not erase that earlier observation.

| Work                                        |       Baseline |    A/A control |      Candidate | Change |
| ------------------------------------------- | -------------: | -------------: | -------------: | -----: |
| 20,000 groups / apply.insert / longer burst | 573.42 (62.46) | 601.62 (40.31) | 563.04 (48.81) | -1.81% |

## One contiguous Insertion

Ten counterbalanced rounds, four warmups. A cloned snapshot provides one source
array, matching the ordinary public benchmark's input layout. Range reads return
100 Frames. Eight instances are used; whole values copy the complete array.

|    Frames | Operation     |                  Baseline |               A/A control |                Candidate |  Change |
| --------: | ------------- | ------------------------: | ------------------------: | -----------------------: | ------: |
|         0 | values        |            178.28 (92.39) |            151.86 (79.27) |             97.75 (68.5) | -45.17% |
|         0 | sequence      |             129.08 (44.1) |            125.62 (42.01) |           102.08 (38.85) | -20.92% |
|       100 | values.head   |            190.74 (24.22) |           208.14 (124.89) |           196.14 (42.24) |  +2.83% |
|       100 | values.middle |             182.73 (47.8) |            183.76 (63.79) |          206.09 (107.94) | +12.79% |
|       100 | values.tail   |            182.58 (47.97) |            170.71 (37.84) |            169.7 (44.64) |  -7.05% |
|       100 | values.random |             186.17 (42.5) |             182.2 (88.38) |           165.04 (73.21) | -11.35% |
|       100 | values        |            172.44 (34.02) |            185.58 (56.89) |            176.2 (25.79) |  +2.18% |
|       100 | sequence      |            186.47 (51.33) |            194.36 (51.99) |           170.27 (31.12) |  -8.69% |
|       100 | value.head    |             23.21 (10.12) |              20.05 (0.38) |              17.7 (2.28) | -23.71% |
|       100 | replace.tail  |         1,588.86 (391.54) |         2,003.44 (529.08) |        1,492.82 (508.65) |  -6.04% |
|    50,000 | values.head   |            168.25 (25.67) |            159.58 (51.56) |           185.01 (40.06) |  +9.97% |
|    50,000 | values.middle |            165.68 (22.58) |             183.7 (35.92) |           164.77 (22.49) |  -0.55% |
|    50,000 | values.tail   |            172.68 (38.81) |            218.91 (60.48) |           196.76 (57.04) | +13.94% |
|    50,000 | values.random |            224.23 (64.28) |            250.31 (83.28) |           198.31 (23.04) | -11.56% |
|    50,000 | values        |   138,161.25 (274,053.75) |     115,717.5 (47,739.37) |      111,755 (90,860.62) | -19.11% |
|    50,000 | sequence      |              637.5 (8.13) |             632.5 (19.37) |                605 (2.5) |   -5.1% |
|    50,000 | value.head    |               20.4 (1.13) |                 20.47 (2) |             18.43 (0.68) |  -9.63% |
|    50,000 | replace.tail  |         1,455.15 (466.53) |         1,600.06 (606.26) |         1,283.5 (114.18) |  -11.8% |
| 1,000,000 | values.head   |            151.84 (10.28) |            189.18 (25.69) |            151.92 (15.4) |  +0.06% |
| 1,000,000 | values.middle |            163.33 (36.16) |            178.16 (33.75) |           150.84 (62.45) |  -7.65% |
| 1,000,000 | values.tail   |            156.18 (15.03) |            183.67 (77.76) |           166.54 (36.54) |  +6.64% |
| 1,000,000 | values.random |            311.64 (60.18) |            316.02 (51.57) |            305.77 (34.5) |  -1.88% |
| 1,000,000 | values        | 3,272,368.75 (622,334.38) | 3,231,143.75 (818,731.25) | 3,225,468.75 (894,937.5) |  -1.43% |
| 1,000,000 | sequence      |             887.5 (21.88) |               675 (21.88) |             637.5 (12.5) | -28.17% |
| 1,000,000 | value.head    |             28.21 (10.86) |             22.95 (10.56) |             18.51 (9.64) | -34.38% |
| 1,000,000 | replace.tail  |          1,795.84 (851.6) |         1,347.12 (249.36) |        1,214.73 (250.44) | -32.36% |

Short slice costs still vary by tens of nanoseconds: the 100-Frame middle range
is +12.8%, and the 50,000-Frame tail range is +13.9%. The one-million-Frame whole
values copy is effectively unchanged. These costs are kept alongside the much
larger mixed-document gains; they are not classified universally as noise.

## Small sequence and tuple reads

Ten counterbalanced rounds after four warmups; 32 live instances per build.
Tuple capacity is fixed. Each operation has a separate named caller.

| Slots | Mode       | Operation |          Baseline |       A/A control |         Candidate |  Change |
| ----: | ---------- | --------- | ----------------: | ----------------: | ----------------: | ------: |
|     2 | projection | length    |       7.02 (0.72) |        6.9 (0.47) |       6.98 (0.66) |  -0.46% |
|     2 | projection | value     |      21.11 (0.71) |      19.74 (1.55) |      17.28 (1.16) | -18.15% |
|     2 | projection | values    |    133.16 (83.85) |    152.61 (61.38) |    141.75 (46.01) |  +6.46% |
|     2 | projection | sequence  |    244.21 (68.55) |    245.69 (88.04) |    218.26 (24.09) | -10.62% |
|     2 | tuple      | length    |       7.72 (1.57) |       7.27 (0.64) |       7.25 (0.45) |  -6.11% |
|     2 | tuple      | value     |      19.36 (1.43) |      16.63 (1.37) |      18.32 (0.55) |  -5.37% |
|     2 | tuple      | values    |    122.36 (53.14) |   142.49 (149.59) |    102.94 (29.52) | -15.88% |
|     2 | tuple      | sequence  |   574.38 (183.84) |   595.19 (218.36) |   576.69 (145.91) |   +0.4% |
|     4 | projection | length    |       7.27 (0.45) |        6.9 (0.58) |        7.1 (0.42) |  -2.28% |
|     4 | projection | value     |      20.54 (1.39) |       20.68 (1.4) |      18.25 (3.41) | -11.14% |
|     4 | projection | values    |      98.06 (33.2) |    106.14 (24.06) |      83.38 (6.13) | -14.96% |
|     4 | projection | sequence  |    250.39 (53.95) |    255.93 (38.68) |     219.13 (9.22) | -12.49% |
|     4 | tuple      | length    |       6.88 (1.53) |       7.51 (1.24) |       7.04 (0.76) |  +2.39% |
|     4 | tuple      | value     |      18.48 (2.86) |      17.62 (0.81) |      17.49 (0.35) |  -5.34% |
|     4 | tuple      | values    |    118.23 (12.24) |    117.35 (13.91) |    107.88 (45.23) |  -8.75% |
|     4 | tuple      | sequence  |   576.86 (240.27) |   507.57 (129.83) |   576.12 (258.15) |  -0.13% |
|     8 | projection | length    |       7.25 (0.79) |       7.07 (0.87) |       6.85 (0.53) |  -5.46% |
|     8 | projection | value     |      21.55 (1.44) |      21.79 (3.01) |       19.7 (3.77) |   -8.6% |
|     8 | projection | values    |     122.75 (85.2) |     111.5 (17.21) |    103.04 (13.66) | -16.06% |
|     8 | projection | sequence  |    303.41 (80.85) |     266.73 (59.2) |     235.69 (3.98) | -22.32% |
|     8 | tuple      | length    |        7.3 (0.67) |       6.83 (1.13) |       7.93 (1.34) |  +8.63% |
|     8 | tuple      | value     |      20.34 (6.01) |      18.07 (2.23) |         17.25 (1) | -15.19% |
|     8 | tuple      | values    |    220.88 (79.72) |    209.43 (83.47) |    152.74 (88.92) | -30.85% |
|     8 | tuple      | sequence  |   752.39 (210.79) |    729.7 (202.38) |   689.68 (242.54) |  -8.33% |
|   100 | projection | length    |       8.14 (1.56) |       7.31 (0.73) |       7.55 (0.62) |  -7.24% |
|   100 | projection | value     |         24 (1.87) |      21.05 (0.99) |      18.89 (1.89) | -21.31% |
|   100 | projection | values    |    184.27 (36.34) |    175.14 (11.59) |    180.08 (39.48) |  -2.27% |
|   100 | projection | sequence  |    378.44 (155.7) |    405.3 (217.15) |    340.78 (128.5) |  -9.95% |
|   100 | tuple      | length    |       7.25 (1.18) |        7.39 (0.9) |        7.03 (0.7) |  -3.08% |
|   100 | tuple      | value     |      23.13 (1.13) |      22.87 (3.04) |      24.49 (6.68) |  +5.89% |
|   100 | tuple      | values    |   644.87 (110.58) |   817.23 (227.03) |    628.58 (152.3) |  -2.53% |
|   100 | tuple      | sequence  | 6,698.16 (298.55) | 6,574.62 (635.47) | 6,426.49 (823.13) |  -4.06% |

The raw full-suite eight-slot length rows jump from roughly 11–14 to 50 ns.
That magnitude is absent here: the eight-slot tuple getter is 7.30 → 7.93 ns,
and the ordinary sequence getter is 7.25 → 6.85 ns. This supports sensitivity to
the original call site and warmup, not a universal fourfold getter regression.
The smaller +0.63 ns tuple cost remains visible in this guard.

## Creation and lifetime

Twelve counterbalanced rounds after four warmups. Empty/single-root creation and
destruction use batches of 10,000 instances. The wide snapshot has 20,000 groups
of 32 Frames plus 2,000 acknowledged replicated replacements; it hydrates 16
instances per batch. Repeated retirement and duplicate apply use 200,000 calls
across 16 live instances. Retirement is a no-op after the first retirement, so
this row is not a measurement of repeatedly removing new Actor histories.

| Operation       |               Baseline |            A/A control |                 Candidate |  Change |
| --------------- | ---------------------: | ---------------------: | ------------------------: | ------: |
| create.empty    |         375.05 (60.17) |        486.66 (105.72) |            422.41 (61.78) | +12.62% |
| create.sequence |       1,491.73 (151.3) |      1,564.66 (191.44) |         1,503.66 (159.81) |   +0.8% |
| create.wide     | 7,177,575 (591,589.06) | 6,751,725 (727,456.25) | 6,974,459.37 (247,115.62) |  -2.83% |
| destroy         |         192.34 (62.77) |          193.23 (82.4) |             191.19 (45.3) |   -0.6% |
| retire          |            61.84 (6.9) |           68.55 (4.46) |               64.31 (8.5) |  +3.99% |
| apply.duplicate |          281.9 (10.42) |          286.25 (7.43) |            280.29 (21.67) |  -0.57% |

The duplicate guard does not reproduce the full-suite 5,000-group +62% row.
Wide hydration is 7.18 → 6.97 ms, but the original checkpoint reconstruction
rows remain +37–55% in the full suite. Those checkpoints are single timed calls
around destruction/reconstruction and JS process garbage collection, not this
repeated warm guard. The exact cause of their remaining difference is unresolved.
The empty checkpoint values call is also 13.1 → 91.6 µs in that suite, while the
warm empty values guard is 178 → 98 ns. Neither observation is dropped.

The latest empty-creation guard is +12.6% (375 → 422 ns), with a byte-identical
control at 487 ns. The earlier retained 12-round guard was 507 → 487 ns, with
control at 446 ns. This does not establish a stable empty-creation improvement.
Destruction remains effectively unchanged. The implementation is retained for
its smaller live allocation, smaller binary and larger measured editing/read
gains, with these short-call and cold-checkpoint limitations explicitly recorded.

## Validation and generated reports

- All 272 existing Vitest tests pass; no expectations or workloads are weakened.
- TypeScript coverage remains 100%: 445 statements, 308 branches, 32 functions
  and 398 lines. Both TypeScript checks pass.
- 104 compatibility checks pass: Node ESM/CommonJS, Bun, Deno, Edge, workerd,
  Chromium and WebKit. Firefox is excluded from this local run.
- 192 canonical snapshot comparisons pass across four Session seeds and four
  edit patterns, including two-peer Acknowledgements and reconstruction.
  All 384 corresponding encoded-size observations agree with the baseline.
- README and ordinary lifecycle, throughput and tuple reports are regenerated
  from the final build using the repository's normal three-run commands.
- TypeDoc generation passes and removes the obsolete U32List page.
- C++ documentation generation stops on pre-existing missing parameter/return
  documentation for insert_batch and Tuple methods. Its strict checks are not
  relaxed; no C++ documentation success is claimed for this round.

All raw observations and controllers remain under the ignored local round
directory. The first lifetime guard is preserved as
endreaders-lifetime-first-guard.json; it used the earlier wide fixture and had
no duplicate-apply row. No competing performance jobs ran during these guards.
