# Related Session coordinates: targeted controls

Five alternating fresh-process pairs against direct Splice plus early ACK coalescing. Each process measures the same 6,000-edit fixtures. The ordinary words benchmark uses its original warm-up and duration; all 56 rows follow. Lower latency is better. Ratios of medians and paired ratios are shown separately.

| Mode / workload / call      |       Before µs (IQR) |    Candidate µs (IQR) |  Change | Paired change (IQR pp) |
| --------------------------- | --------------------: | --------------------: | ------: | ---------------------: |
| numeric/append/sequence     |         1.062 (0.053) |          1.041 (0.11) |  -2.03% |        -2.03% (15.591) |
| numeric/append/encode       |        28.747 (0.843) |        33.836 (8.869) | +17.70% |        +5.41% (31.189) |
| numeric/append/decode       |         2.731 (0.168) |         3.309 (2.005) | +21.19% |        +2.12% (60.622) |
| numeric/append/create       |         1.973 (0.127) |         2.254 (1.553) | +14.25% |       +22.20% (45.303) |
| numeric/append/load         |          6.26 (0.768) |         8.54 (10.206) | +36.43% |      +45.79% (152.824) |
| numeric/append/apply        | 2,994.429 (1,207.452) | 3,696.871 (2,290.482) | +23.46% |       +37.60% (43.236) |
| numeric/append/receive      |  5,183.93 (2,632.963) |  3,436.38 (2,907.582) | -33.71% |        +2.72% (25.802) |
| binary/append/sequence      |         0.918 (0.203) |         0.942 (0.398) |  +2.55% |         +1.85% (4.794) |
| binary/append/encode        |        34.579 (3.954) |        34.247 (4.162) |  -0.96% |        -3.45% (22.005) |
| binary/append/decode        |          2.01 (0.152) |         2.473 (0.288) | +23.03% |        +23.03% (26.56) |
| binary/append/create        |          2.195 (0.31) |         2.053 (0.363) |  -6.44% |         +5.83% (4.868) |
| binary/append/load          |         5.966 (0.584) |         5.893 (0.517) |  -1.22% |         -2.23% (1.854) |
| binary/append/apply         |   1,527.839 (343.468) |   1,507.774 (201.889) |  -1.31% |        +2.15% (34.475) |
| binary/append/receive       |   3,440.973 (331.025) |   3,074.476 (217.921) | -10.65% |       -10.65% (19.325) |
| numeric/prepend/sequence    |      421.224 (52.631) |      414.513 (15.906) |  -1.59% |          +3.18% (9.04) |
| numeric/prepend/encode      |      533.786 (21.444) |      536.373 (74.802) |  +0.48% |        -2.70% (13.837) |
| numeric/prepend/decode      |      188.373 (39.865) |      173.683 (35.435) |  -7.80% |       -18.97% (35.588) |
| numeric/prepend/create      |      770.12 (102.054) |      758.168 (58.571) |  -1.55% |         +1.88% (7.861) |
| numeric/prepend/load        |   1,400.047 (131.856) |   1,416.097 (432.809) |  +1.15% |        +1.15% (17.628) |
| numeric/prepend/apply       |  2,445.01 (1,507.237) |   2,360.655 (462.347) |  -3.45% |        +0.84% (56.767) |
| numeric/prepend/receive     | 4,266.458 (1,515.958) |   4,080.731 (562.804) |  -4.35% |        +2.53% (38.669) |
| binary/prepend/sequence     |       411.53 (11.424) |      419.751 (45.294) |  +2.00% |        +0.12% (15.323) |
| binary/prepend/encode       |        32.234 (1.816) |         33.062 (2.77) |  +2.57% |        -0.94% (12.149) |
| binary/prepend/decode       |         1.824 (0.589) |         2.122 (0.704) | +16.33% |        +16.18% (31.93) |
| binary/prepend/create       |      767.192 (11.536) |       816.273 (49.19) |  +6.40% |        +1.18% (11.455) |
| binary/prepend/load         |     783.891 (321.561) |      784.073 (53.679) |  +0.02% |        +0.02% (30.778) |
| binary/prepend/apply        |    2,419.386 (54.967) |   2,342.145 (219.088) |  -3.19% |         -6.23% (2.122) |
| binary/prepend/receive      |   4,210.825 (153.999) |   3,684.514 (101.471) | -12.50% |         -9.15% (4.981) |
| numeric/random/sequence     |      903.952 (14.504) |      915.487 (49.201) |  +1.28% |          -0.72% (5.49) |
| numeric/random/encode       |   2,036.628 (167.298) |   2,068.124 (303.009) |  +1.55% |         +2.73% (7.408) |
| numeric/random/decode       |    1,089.73 (452.271) |   1,022.388 (202.672) |  -6.18% |        -4.74% (69.483) |
| numeric/random/create       |   1,793.589 (158.972) |    1,695.197 (183.12) |  -5.49% |        -5.49% (10.868) |
| numeric/random/load         |   4,289.242 (686.806) | 3,932.462 (1,115.884) |  -8.32% |         -0.91% (8.824) |
| numeric/random/apply        | 7,676.129 (1,252.831) |     7,840.5 (981.595) |  +2.14% |        +4.25% (29.307) |
| numeric/random/receive      |    11,156.34 (447.22) |    11,348.34 (998.08) |  +1.72% |         -3.05% (7.148) |
| binary/random/sequence      |      821.415 (35.373) |      865.164 (33.535) |  +5.33% |          +1.85% (1.85) |
| binary/random/encode        |        69.805 (7.999) |         69.91 (4.669) |  +0.15% |         +0.15% (8.367) |
| binary/random/decode        |         1.578 (0.035) |         1.696 (0.602) |  +7.46% |        +9.02% (43.471) |
| binary/random/create        |   1,903.107 (422.049) |   1,894.563 (192.986) |  -0.45% |        -0.45% (21.594) |
| binary/random/load          |      1,941.4 (74.079) |    1,967.138 (41.919) |  +1.33% |         +1.28% (4.727) |
| binary/random/apply         |   5,863.222 (765.633) |   6,703.637 (905.081) | +14.33% |        +4.53% (17.594) |
| binary/random/receive       |   7,697.971 (136.286) |    7,724.514 (738.41) |  +0.34% |         +0.92% (5.402) |
| numeric/concurrent/sequence |      772.786 (54.082) |      778.665 (17.628) |  +0.76% |         +6.51% (6.983) |
| numeric/concurrent/encode   |    1,502.241 (70.024) |    1,520.676 (41.076) |  +1.23% |         +0.34% (0.695) |
| numeric/concurrent/decode   |      699.988 (82.688) |       737.165 (82.59) |  +5.31% |        +9.78% (10.291) |
| numeric/concurrent/create   |   2,263.983 (242.156) |     2,368.6 (339.898) |  +4.62% |           +0.33% (3.6) |
| numeric/concurrent/load     |   4,732.918 (834.735) |   4,611.391 (488.889) |  -2.57% |        -4.97% (10.384) |
| numeric/concurrent/apply    |   5,647.356 (609.921) |   5,668.044 (753.593) |  +0.37% |         +0.16% (7.858) |
| numeric/concurrent/receive  |   8,999.5 (1,164.893) |   9,364.2 (1,715.527) |  +4.05% |        -0.14% (30.824) |
| binary/concurrent/sequence  |      721.241 (37.178) |      715.021 (31.594) |  -0.86% |         +1.68% (9.105) |
| binary/concurrent/encode    |         62.817 (2.78) |         62.61 (6.768) |  -0.33% |         +4.89% (15.37) |
| binary/concurrent/decode    |          2.217 (0.75) |         2.856 (0.613) | +28.86% |       +12.62% (21.376) |
| binary/concurrent/create    |   2,291.918 (188.147) |    2,237.826 (73.834) |  -2.36% |        +0.01% (15.639) |
| binary/concurrent/load      |    2,325.332 (69.885) |   2,294.618 (160.636) |  -1.32% |         -2.80% (5.165) |
| binary/concurrent/apply     |      5,235.2 (291.05) |    5,087.43 (355.084) |  -2.82% |         -3.31% (2.407) |
| binary/concurrent/receive   | 7,494.629 (1,054.312) |    6,850.45 (833.061) |  -8.60% |        -6.97% (19.852) |

## Longer replay diagnostic

Same fixture and API timing boundaries. Each workload/call receives 500 ms warm-up and 1,000 ms measured API time in both builds, replacing the short 25/50 ms windows only in this diagnostic. Five independent process pairs; values are milliseconds per complete replay.

| Workload / call    | Before ms (IQR) | Candidate ms (IQR) |  Change | Paired change (IQR pp) |
| ------------------ | --------------: | -----------------: | ------: | ---------------------: |
| append/apply       |   1.331 (0.125) |      1.317 (0.026) |  -1.08% |        -3.25% (12.949) |
| append/receive     |   2.329 (0.025) |      2.337 (0.012) |  +0.35% |         +0.08% (3.041) |
| prepend/apply      |   2.081 (0.025) |      2.078 (0.115) |  -0.15% |         -0.15% (7.304) |
| prepend/receive    |   3.143 (0.065) |      3.187 (0.287) |  +1.38% |         +3.18% (8.781) |
| random/apply       |   5.382 (0.013) |       5.96 (1.225) | +10.74% |        +10.96% (22.98) |
| random/receive     |   6.369 (0.114) |      6.475 (0.197) |  +1.67% |         +1.67% (6.366) |
| concurrent/apply   |    4.57 (0.155) |      5.963 (1.476) | +30.47% |       +29.68% (34.261) |
| concurrent/receive |   5.653 (0.395) |        5.8 (0.405) |  +2.59% |         +0.75% (4.078) |

## Authoring diagnostic

A 20,000-character snapshot is followed by 6,000 seeded insert/remove/replace calls. Both builds measure the same public calls, with transport encoding excluded. The anchor originates either in the same Wasm module or an independently seeded peer module. Each process warms twice, then measures five fresh Projections; the process median is one sample. Five alternating process pairs, not 25 independent process samples. Values are milliseconds per complete edit sequence.

| Anchor source / output | Before ms (IQR) | Candidate ms (IQR) |  Change | Paired change (IQR pp) |
| ---------------------- | --------------: | -----------------: | ------: | ---------------------: |
| shared/numeric         |   6.141 (3.421) |      6.484 (0.268) |  +5.58% |        +3.80% (45.926) |
| shared/binary          |    8.175 (4.72) |        9.3 (0.926) | +13.76% |       +24.18% (46.061) |
| independent/numeric    |    6.634 (0.82) |      5.919 (0.738) | -10.78% |       -11.43% (19.706) |
| independent/binary     |   7.588 (1.055) |      8.205 (1.565) |  +8.14% |        +1.17% (27.803) |

## Size controls

Three seeds, 6,000 edits per author. Before is the starting 1.2.9 build; candidate includes all current changes. Concurrent rows show bytes per author transaction, other rows bytes per edit. These public-API controls use the external workload shapes without running or changing the external benchmark. They are not competitor rankings.

| Workload        | Update before / after | Change | Document before / after | Change |
| --------------- | --------------------: | -----: | ----------------------: | -----: |
| append          |       20.978 / 20.978 | +0.00% |           6,033 / 6,033 | +0.00% |
| prepend         |       20.989 / 20.989 | +0.00% |           6,036 / 6,036 | +0.00% |
| random          |       21.935 / 21.935 | +0.00% |         28,676 / 28,676 | +0.00% |
| randomWords     |       29.428 / 29.428 | +0.00% |         75,778 / 75,778 | +0.00% |
| concurrent      |     125,923 / 125,773 | -0.12% |         58,000 / 58,000 | +0.00% |
| concurrentWords |   170,533 / 170,441.5 | -0.05% |       151,243 / 151,243 | +0.00% |
| concurrentMixed |   267,457.5 / 260,733 | -2.51% |       159,578 / 159,578 | +0.00% |
| mixed           |       25.264 / 24.607 | -2.60% |                 35 / 35 | +0.00% |

Raw samples, diagnostic sources and frozen builds remain under `temp/optimization_2026_11_22_runtime/orbit*`. The complete lifecycle/throughput/tuple guard and the retention decision are in [the round record](README.md).
