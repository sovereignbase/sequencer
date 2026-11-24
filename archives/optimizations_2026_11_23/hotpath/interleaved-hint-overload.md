# Interleaved words controls

Six fresh processes; both builds in each process. Original 6,000-edit fixture and public-API measure helper, with exact Gossip and final text comparisons. Each case has 250 ms warm-up and eight alternating 125 ms measured windows per build; the first build alternates by window and process. Each run aggregates total API time / total calls. GC, receiver construction and result checking remain outside the same API timing boundaries as the original helper. All valid windows and processes are retained; this supplements the separate-process and complete-suite comparisons. Nanoseconds per call, lower is better.

| Case                       |                 Before (IQR) |             Candidate (IQR) | Change | Paired change (IQR) | Slower pairs |
| -------------------------- | ---------------------------: | --------------------------: | -----: | ------------------: | -----------: |
| numeric/append/apply       |    1,355,932.62 (155,016.23) |    1,319,907.3 (166,271.96) | -2.66% |    -2.63% (2.54 pp) |          1/6 |
| numeric/append/receive     |    3,123,574.62 (449,157.52) |    3,090,180.88 (570,682.4) | -1.07% |    0.35% (12.26 pp) |          3/6 |
| numeric/prepend/apply      |    2,389,366.13 (519,513.54) |   2,345,346.33 (240,991.35) | -1.84% |    1.63% (35.00 pp) |          3/6 |
| numeric/prepend/receive    |     4,717,289.09 (1,851,922) | 4,626,275.95 (1,281,981.93) | -1.93% |    2.38% (16.76 pp) |          3/6 |
| numeric/random/apply       |  8,199,950.71 (4,667,925.29) | 8,073,939.46 (2,918,292.27) | -1.54% |    -2.36% (1.81 pp) |          1/6 |
| numeric/random/receive     | 11,344,257.67 (2,562,446.54) | 10,808,624.5 (2,106,041.06) | -4.72% |    -5.98% (6.70 pp) |          1/6 |
| numeric/concurrent/apply   |     6,292,944.8 (779,416.71) |    6,406,482.5 (509,085.04) |  1.80% |     5.80% (8.99 pp) |          5/6 |
| numeric/concurrent/receive |  8,644,847.01 (1,234,866.09) | 8,187,840.03 (1,490,760.92) | -5.29% |   -2.45% (10.22 pp) |          2/6 |
| binary/append/apply        |    1,769,630.95 (266,377.84) |    1,828,545.49 (87,860.48) |  3.33% |    1.25% (16.84 pp) |          3/6 |
| binary/append/receive      |    3,556,933.36 (408,269.33) |    3,427,248.59 (297,923.9) | -3.65% |    -2.91% (5.05 pp) |          2/6 |
| binary/prepend/apply       |    2,728,008.59 (559,419.39) |   2,699,589.56 (641,863.81) | -1.04% |    -1.04% (2.19 pp) |          2/6 |
| binary/prepend/receive     |    3,917,712.39 (524,304.86) |   3,962,648.73 (471,191.09) |  1.15% |    -0.80% (3.06 pp) |          3/6 |
| binary/random/apply        |   6,496,201.16 (1,836,807.7) |  5,990,479.3 (1,874,964.84) | -7.78% |    -2.93% (7.03 pp) |          2/6 |
| binary/random/receive      |  7,551,667.53 (1,649,670.81) | 7,258,299.35 (1,173,066.24) | -3.88% |    -5.22% (1.83 pp) |          0/6 |
| binary/concurrent/apply    |    5,266,704.26 (870,210.28) |  5,231,082.5 (1,084,216.71) | -0.68% |    -0.74% (7.03 pp) |          3/6 |
| binary/concurrent/receive  |   7,030,523.2 (2,775,868.71) | 6,487,365.33 (2,897,714.88) | -7.73% |    -6.87% (7.46 pp) |          2/6 |
