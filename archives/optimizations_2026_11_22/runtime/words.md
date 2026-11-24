# Retained words and replay controls

Five alternating fresh-process pairs against the starting 1.2.9 build. Original fixtures, entropy, warm-up and 25/50 ms timing windows. All 56 ordinary rows are shown; lower is faster. Values are microseconds per call. Metadata, snapshots and byte response semantics are unchanged.

| Mode / workload / call      |       Before µs (IQR) |        After µs (IQR) |  Change | Paired change (IQR pp) |
| --------------------------- | --------------------: | --------------------: | ------: | ---------------------: |
| numeric/append/sequence     |          1.32 (0.597) |         1.099 (0.291) | -16.72% |        +2.13% (26.551) |
| numeric/append/encode       |       32.956 (11.344) |         30.594 (1.19) |  -7.17% |        -1.03% (24.264) |
| numeric/append/decode       |         3.139 (0.903) |         2.924 (0.408) |  -6.84% |        -7.75% (35.992) |
| numeric/append/create       |          2.52 (0.821) |         2.008 (0.472) | -20.29% |        -19.69% (10.67) |
| numeric/append/load         |         6.518 (2.443) |         7.147 (0.911) |  +9.65% |          +5.61% (9.28) |
| numeric/append/apply        | 3,725.943 (3,525.687) | 3,661.264 (1,675.147) |  -1.74% |        -7.14% (30.698) |
| numeric/append/receive      | 5,837.344 (2,799.211) |   5,769.589 (953.554) |  -1.16% |        -1.44% (25.176) |
| binary/append/sequence      |         1.012 (0.154) |         1.237 (0.293) | +22.19% |       +16.11% (40.243) |
| binary/append/encode        |        33.459 (4.663) |        33.866 (0.382) |  +1.22% |        +1.22% (14.395) |
| binary/append/decode        |         2.153 (0.985) |         2.548 (0.711) | +18.35% |       +27.29% (29.841) |
| binary/append/create        |         2.425 (0.194) |          2.302 (0.11) |  -5.08% |        -11.03% (8.721) |
| binary/append/load          |          5.53 (0.504) |         5.445 (1.293) |  -1.54% |          -4.97% (3.02) |
| binary/append/apply         |   1,851.907 (513.999) |   1,731.124 (174.179) |  -6.52% |       -17.90% (15.596) |
| binary/append/receive       |   3,407.907 (155.867) |   3,279.056 (264.748) |  -3.78% |         -7.24% (9.297) |
| numeric/prepend/sequence    |      488.001 (25.941) |       498.25 (83.241) |  +2.10% |        +0.67% (11.197) |
| numeric/prepend/encode      |       592.299 (54.33) |       561.17 (56.602) |  -5.26% |          -5.17% (9.22) |
| numeric/prepend/decode      |      178.409 (44.167) |       179.24 (36.389) |  +0.47% |        +6.21% (15.935) |
| numeric/prepend/create      |      818.615 (96.203) |      812.745 (27.072) |  -0.72% |        -0.72% (12.957) |
| numeric/prepend/load        |    1,595.231 (55.589) |   1,463.717 (386.157) |  -8.24% |        -5.38% (36.688) |
| numeric/prepend/apply       | 2,450.962 (1,444.655) |   2,600.985 (139.362) |  +6.12% |        +6.12% (20.425) |
| numeric/prepend/receive     |   4,625.091 (584.729) |     4,368.992 (94.95) |  -5.54% |        -5.26% (19.532) |
| binary/prepend/sequence     |     530.353 (210.252) |      464.277 (69.322) | -12.46% |        -7.52% (16.741) |
| binary/prepend/encode       |        36.285 (6.849) |        36.635 (1.725) |  +0.96% |         -6.08% (7.419) |
| binary/prepend/decode       |         2.432 (0.375) |         2.498 (0.279) |  +2.70% |       +14.08% (32.672) |
| binary/prepend/create       |      866.005 (128.48) |      835.928 (46.441) |  -3.47% |          -4.79% (6.88) |
| binary/prepend/load         |      867.597 (81.164) |     853.954 (184.106) |  -1.57% |        -2.07% (12.605) |
| binary/prepend/apply        |    2,562.31 (216.403) |    2,368.477 (40.927) |  -7.56% |        -7.88% (16.307) |
| binary/prepend/receive      | 4,315.617 (1,295.202) |   4,244.983 (381.217) |  -1.64% |       -15.14% (26.995) |
| numeric/random/sequence     |      998.812 (35.816) |    1,022.931 (45.776) |  +2.41% |        +2.41% (19.587) |
| numeric/random/encode       |   2,295.432 (156.742) |   2,290.759 (103.821) |  -0.20% |         -3.26% (7.797) |
| numeric/random/decode       |   1,076.464 (341.633) |     1,165.84 (166.42) |  +8.30% |       -16.27% (82.577) |
| numeric/random/create       |   1,872.333 (124.793) |    1,827.754 (69.943) |  -2.38% |        -2.60% (11.129) |
| numeric/random/load         | 4,033.046 (1,479.282) |   4,183.642 (445.001) |  +3.73% |        +6.58% (22.235) |
| numeric/random/apply        |   8,027.886 (357.433) |   9,041.45 (1,850.35) | +12.63% |        +8.51% (18.358) |
| numeric/random/receive      |        12,743.1 (406) |    13,105.3 (2,272.2) |  +2.84% |        +2.84% (15.625) |
| binary/random/sequence      |     990.773 (185.526) |   1,009.154 (274.196) |  +1.86% |         +4.41% (5.048) |
| binary/random/encode        |        82.988 (8.573) |       76.377 (11.272) |  -7.97% |        -3.29% (26.886) |
| binary/random/decode        |         2.018 (0.397) |         1.879 (0.585) |  -6.89% |        -8.38% (28.535) |
| binary/random/create        |    2,020.124 (74.298) |    2,028.744 (68.468) |  +0.43% |        +2.10% (11.276) |
| binary/random/load          |   1,976.981 (156.017) |    1,946.488 (117.77) |  -1.54% |          +0.96% (9.64) |
| binary/random/apply         |     6,743.05 (91.437) |   6,168.878 (395.175) |  -8.52% |         -5.51% (6.177) |
| binary/random/receive       | 8,363.783 (1,575.019) |   8,402.05 (1,097.25) |  +0.46% |        +1.12% (18.904) |
| numeric/concurrent/sequence |      820.736 (47.219) |      821.067 (72.076) |  +0.04% |         +0.75% (4.195) |
| numeric/concurrent/encode   |   1,582.859 (199.362) |   1,547.145 (103.447) |  -2.26% |         -2.26% (4.193) |
| numeric/concurrent/decode   |     551.856 (136.611) |       718.644 (77.34) | +30.22% |       +38.50% (35.099) |
| numeric/concurrent/create   |   2,422.943 (127.825) |     2,536.05 (104.77) |  +4.67% |        +4.40% (12.023) |
| numeric/concurrent/load     |   4,719.573 (797.327) |   4,808.482 (840.137) |  +1.88% |        +10.59% (9.355) |
| numeric/concurrent/apply    |       6,019.467 (117) |   6,014.744 (518.682) |  -0.08% |          +1.88% (3.29) |
| numeric/concurrent/receive  | 9,804.333 (3,091.217) | 10,158.08 (3,182.758) |  +3.61% |         +0.04% (21.44) |
| binary/concurrent/sequence  |      775.849 (48.135) |      764.732 (88.136) |  -1.43% |        +0.51% (14.183) |
| binary/concurrent/encode    |        62.563 (3.557) |        65.049 (5.209) |  +3.97% |        +4.79% (11.522) |
| binary/concurrent/decode    |         3.065 (0.609) |         3.069 (0.883) |  +0.14% |       +13.30% (35.693) |
| binary/concurrent/create    |    2,415.448 (72.199) |    2,425.371 (36.014) |  +0.41% |         +3.15% (3.323) |
| binary/concurrent/load      |   2,462.805 (143.414) |      2,588 (1,343.49) |  +5.08% |        +8.41% (25.588) |
| binary/concurrent/apply     |    5,406.46 (919.346) |    5,642.4 (5,457.02) |  +4.36% |      +12.97% (106.596) |
| binary/concurrent/receive   |   7,186.586 (498.375) | 7,285.143 (3,013.311) |  +1.37% |        +8.80% (52.135) |

## Longer replay control

Five rotated process rounds compare the starting build, direct output and direct output plus early ACKs. Same 6,000-edit fixtures with 500 ms warm-up and 1,000 ms measured API time. Milliseconds per complete replay; this diagnostic does not replace the ordinary full-suite guard.

| Workload / call    | Before ms | Direct output ms | Final ms | Final change | Paired change (IQR pp) |
| ------------------ | --------: | ---------------: | -------: | -----------: | ---------------------: |
| append/apply       |     1.363 |            1.317 |     1.27 |       -6.84% |         -6.97% (3.255) |
| append/receive     |     2.365 |            2.299 |    2.293 |       -3.05% |         -3.53% (1.385) |
| prepend/apply      |     2.077 |             2.02 |    2.064 |       -0.63% |         -0.63% (1.292) |
| prepend/receive    |     3.129 |            3.068 |    3.149 |       +0.63% |         +1.10% (1.534) |
| random/apply       |     5.547 |            5.371 |    5.416 |       -2.36% |         -2.78% (2.821) |
| random/receive     |     6.401 |             6.28 |     6.29 |       -1.73% |         -2.58% (2.237) |
| concurrent/apply   |     4.539 |            4.456 |      4.4 |       -3.06% |         -3.74% (4.823) |
| concurrent/receive |     5.592 |            5.548 |    5.668 |       +1.35% |         -0.11% (2.474) |
