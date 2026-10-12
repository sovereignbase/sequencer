# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:19:03.632Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    12,185 |       82.068 |       82.068 |         82.068 |     0.000 | 0: 82.068    | 0: 82.068    |
| apply    | random | A       | scaleDown     |  9,999 |    11,718 |       85.339 |       85.339 |         85.339 |     0.000 | 0: 85.339    | 0: 85.339    |
| apply    | random | A       | fullLifecycle | 19,999 |    11,947 |       83.704 |       83.704 |         83.704 |     0.000 | 0: 83.704    | 0: 83.704    |
| create   | —      | A       | scaleUp       |      6 |       686 |     1458.733 |     1458.733 |       1458.733 |     0.000 | 0: 1458.733  | 0: 1458.733  |
| create   | —      | A       | scaleDown     |      5 |     3,374 |      296.380 |      296.380 |        296.380 |     0.000 | 0: 296.380   | 0: 296.380   |
| create   | —      | A       | fullLifecycle |     11 |     1,075 |      930.391 |      930.391 |        930.391 |     0.000 | 0: 930.391   | 0: 930.391   |
| insert   | head   | A       | scaleUp       |  5,000 |   256,136 |        3.904 |        3.904 |          3.904 |     0.000 | 0: 3.904     | 0: 3.904     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   256,136 |        3.904 |        3.904 |          3.904 |     0.000 | 0: 3.904     | 0: 3.904     |
| insert   | random | A       | scaleUp       | 10,000 |    33,178 |       30.140 |       30.140 |         30.140 |     0.000 | 0: 30.140    | 0: 30.140    |
| insert   | random | A       | scaleDown     | 10,000 |    31,016 |       32.241 |       32.241 |         32.241 |     0.000 | 0: 32.241    | 0: 32.241    |
| insert   | random | A       | fullLifecycle | 20,000 |    32,061 |       31.191 |       31.191 |         31.191 |     0.000 | 0: 31.191    | 0: 31.191    |
| insert   | tail   | A       | scaleUp       |  5,000 |   318,542 |        3.139 |        3.139 |          3.139 |     0.000 | 0: 3.139     | 0: 3.139     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   318,542 |        3.139 |        3.139 |          3.139 |     0.000 | 0: 3.139     | 0: 3.139     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   140,321 |        7.127 |        7.127 |          7.127 |     0.000 | 0: 7.127     | 0: 7.127     |
| remove   | head   | A       | fullLifecycle |  5,000 |   140,321 |        7.127 |        7.127 |          7.127 |     0.000 | 0: 7.127     | 0: 7.127     |
| remove   | random | A       | scaleUp       | 10,000 |    24,016 |       41.638 |       41.638 |         41.638 |     0.000 | 0: 41.638    | 0: 41.638    |
| remove   | random | A       | scaleDown     | 10,000 |    24,355 |       41.060 |       41.060 |         41.060 |     0.000 | 0: 41.060    | 0: 41.060    |
| remove   | random | A       | fullLifecycle | 20,000 |    24,184 |       41.349 |       41.349 |         41.349 |     0.000 | 0: 41.349    | 0: 41.349    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   105,380 |        9.489 |        9.489 |          9.489 |     0.000 | 0: 9.489     | 0: 9.489     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   105,380 |        9.489 |        9.489 |          9.489 |     0.000 | 0: 9.489     | 0: 9.489     |
| replace  | head   | A       | scaleUp       | 10,000 |    60,668 |       16.483 |       16.483 |         16.483 |     0.000 | 0: 16.483    | 0: 16.483    |
| replace  | head   | A       | scaleDown     | 10,000 |   101,285 |        9.873 |        9.873 |          9.873 |     0.000 | 0: 9.873     | 0: 9.873     |
| replace  | head   | A       | fullLifecycle | 20,000 |    75,883 |       13.178 |       13.178 |         13.178 |     0.000 | 0: 13.178    | 0: 13.178    |
| replace  | random | A       | scaleUp       | 10,000 |    23,666 |       42.255 |       42.255 |         42.255 |     0.000 | 0: 42.255    | 0: 42.255    |
| replace  | random | A       | scaleDown     | 10,000 |    23,569 |       42.429 |       42.429 |         42.429 |     0.000 | 0: 42.429    | 0: 42.429    |
| replace  | random | A       | fullLifecycle | 20,000 |    23,617 |       42.342 |       42.342 |         42.342 |     0.000 | 0: 42.342    | 0: 42.342    |
| replace  | tail   | A       | scaleUp       | 10,000 |   103,984 |        9.617 |        9.617 |          9.617 |     0.000 | 0: 9.617     | 0: 9.617     |
| replace  | tail   | A       | scaleDown     | 10,000 |    90,143 |       11.093 |       11.093 |         11.093 |     0.000 | 0: 11.093    | 0: 11.093    |
| replace  | tail   | A       | fullLifecycle | 20,000 |    96,570 |       10.355 |       10.355 |         10.355 |     0.000 | 0: 10.355    | 0: 10.355    |
| sequence | —      | A       | scaleUp       |      5 |        52 |    19176.860 |    19176.860 |      19176.860 |     0.000 | 0: 19176.860 | 0: 19176.860 |
| sequence | —      | A       | scaleDown     |      5 |        12 |    83708.640 |    83708.640 |      83708.640 |     0.000 | 0: 83708.640 | 0: 83708.640 |
| sequence | —      | A       | fullLifecycle |     10 |        19 |    51442.750 |    51442.750 |      51442.750 |     0.000 | 0: 51442.750 | 0: 51442.750 |
| value    | head   | A       | scaleUp       | 10,000 |   188,181 |        5.314 |        5.314 |          5.314 |     0.000 | 0: 5.314     | 0: 5.314     |
| value    | head   | A       | scaleDown     | 10,000 |   714,005 |        1.401 |        1.401 |          1.401 |     0.000 | 0: 1.401     | 0: 1.401     |
| value    | head   | A       | fullLifecycle | 20,000 |   297,859 |        3.357 |        3.357 |          3.357 |     0.000 | 0: 3.357     | 0: 3.357     |
| value    | random | A       | scaleUp       | 10,000 |    29,182 |       34.268 |       34.268 |         34.268 |     0.000 | 0: 34.268    | 0: 34.268    |
| value    | random | A       | scaleDown     | 10,000 |    29,379 |       34.038 |       34.038 |         34.038 |     0.000 | 0: 34.038    | 0: 34.038    |
| value    | random | A       | fullLifecycle | 20,000 |    29,280 |       34.153 |       34.153 |         34.153 |     0.000 | 0: 34.153    | 0: 34.153    |
| value    | tail   | A       | scaleUp       | 10,000 | 1,125,315 |        0.889 |        0.889 |          0.889 |     0.000 | 0: 0.889     | 0: 0.889     |
| value    | tail   | A       | scaleDown     | 10,000 | 1,009,836 |        0.990 |        0.990 |          0.990 |     0.000 | 0: 0.990     | 0: 0.990     |
| value    | tail   | A       | fullLifecycle | 20,000 | 1,064,453 |        0.939 |        0.939 |          0.939 |     0.000 | 0: 0.939     | 0: 0.939     |
| values   | —      | A       | scaleUp       |      5 |       203 |     4928.340 |     4928.340 |       4928.340 |     0.000 | 0: 4928.340  | 0: 4928.340  |
| values   | —      | A       | scaleDown     |      5 |       647 |     1546.340 |     1546.340 |       1546.340 |     0.000 | 0: 1546.340  | 0: 1546.340  |
| values   | —      | A       | fullLifecycle |     10 |       309 |     3237.340 |     3237.340 |       3237.340 |     0.000 | 0: 3237.340  | 0: 3237.340  |

## Aggregate memory usage

Nonempty checkpoint observations across all runs. Bytes per unit use total bytes divided by total units.

| Replica | scope         | observations |  avg bytes | B/Strip | B/Frame |
| ------- | ------------- | -----------: | ---------: | ------: | ------: |
| A       | scaleUp       |            5 | 944824.800 | 425.175 |   8.479 |
| A       | scaleDown     |            4 | 116460.000 | 419.298 |   8.487 |
| A       | fullLifecycle |            9 | 576662.667 | 424.641 |   8.480 |

## Aggregate disk usage

Nonempty checkpoint observations across all runs. Bytes per unit use total bytes divided by total units.

| Replica | scope         | observations |  avg bytes | B/Strip | B/Frame |
| ------- | ------------- | -----------: | ---------: | ------: | ------: |
| A       | scaleUp       |            5 | 545497.800 | 245.476 |   4.895 |
| A       | scaleDown     |            4 |  67714.750 | 243.797 |   4.935 |
| A       | fullLifecycle |            9 | 333149.778 | 245.324 |   4.899 |

## Scaling performance

Checkpoint values are cumulative full-lifecycle averages at that point and are never reset.

| Method  | case   | Run | direction | Strips |  Frames | Replica |  calls |   ops/sec |    avg |    min |       max |
| ------- | ------ | --: | --------- | -----: | ------: | ------- | -----: | --------: | -----: | -----: | --------: |
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    45,045 | 22.200 | 22.200 |    22.200 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    35,842 | 27.900 | 22.200 |    54.500 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    35,719 | 27.996 | 12.200 |   184.500 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    28,432 | 35.171 |  5.100 |  2456.200 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    12,185 | 82.068 |  5.100 |  8214.900 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    11,870 | 84.247 |  5.100 |  8214.900 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    11,934 | 83.792 |  5.100 |  8214.900 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    11,968 | 83.555 |  5.100 |  8214.900 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    11,947 | 83.704 |  5.100 |  8214.900 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    11,947 | 83.704 |  5.100 |  8214.900 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   125,628 |  7.960 |  4.300 |    19.200 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   156,152 |  6.404 |  3.200 |    28.600 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   243,404 |  4.108 |  0.800 |   157.000 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   256,136 |  3.904 |  0.800 |   494.400 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   256,136 |  3.904 |  0.800 |   494.400 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   256,136 |  3.904 |  0.800 |   494.400 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   256,136 |  3.904 |  0.800 |   494.400 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   256,136 |  3.904 |  0.800 |   494.400 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   256,136 |  3.904 |  0.800 |   494.400 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   204,082 |  4.900 |  4.900 |     4.900 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   163,934 |  6.100 |  4.200 |    10.600 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   114,077 |  8.766 |  4.200 |    52.500 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    89,263 | 11.203 |  1.100 |   790.400 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    33,178 | 30.140 |  1.100 |  4735.300 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    31,779 | 31.468 |  1.100 |  4735.300 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    31,959 | 31.290 |  1.100 |  4735.300 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    32,046 | 31.205 |  1.100 |  4735.300 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    32,059 | 31.192 |  1.100 |  4735.300 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    32,061 | 31.191 |  1.100 |  4735.300 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |    81,967 | 12.200 | 12.200 |    12.200 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   174,825 |  5.720 |  3.700 |    12.200 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   180,440 |  5.542 |  2.900 |    18.000 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   252,003 |  3.968 |  0.700 |   115.500 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   318,542 |  3.139 |  0.700 |   224.600 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   318,542 |  3.139 |  0.700 |   224.600 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   318,542 |  3.139 |  0.700 |   224.600 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   318,542 |  3.139 |  0.700 |   224.600 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   318,542 |  3.139 |  0.700 |   224.600 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   318,542 |  3.139 |  0.700 |   224.600 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   142,005 |  7.042 |  2.800 |   210.100 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   139,953 |  7.145 |  2.800 |   210.100 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   140,274 |  7.129 |  2.300 |   210.100 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   140,321 |  7.127 |  2.300 |   210.100 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   140,321 |  7.127 |  2.300 |   210.100 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   128,205 |  7.800 |  7.800 |     7.800 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |    82,645 | 12.100 |  7.800 |    19.800 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |    40,948 | 24.421 |  6.800 |   429.300 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    65,985 | 15.155 |  3.100 |   429.300 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    24,016 | 41.638 |  3.100 |  2501.800 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    24,006 | 41.655 |  3.000 |  2501.800 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    24,106 | 41.484 |  3.000 |  2501.800 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    24,174 | 41.366 |  2.200 |  2501.800 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    24,183 | 41.351 |  2.200 |  2501.800 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    24,184 | 41.349 |  2.200 |  2501.800 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   102,960 |  9.713 |  2.800 | 14143.200 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   104,922 |  9.531 |  2.800 | 14143.200 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   105,338 |  9.493 |  2.500 | 14143.200 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   105,378 |  9.490 |  2.500 | 14143.200 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   105,380 |  9.489 |  2.500 | 14143.200 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    21,692 | 46.100 | 46.100 |    46.100 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    52,743 | 18.960 | 12.500 |    46.100 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |    66,081 | 15.133 |  7.900 |   103.500 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    13,767 | 72.639 |  2.900 | 61484.400 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    60,668 | 16.483 |  2.900 | 61484.400 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    77,780 | 12.857 |  2.900 | 61484.400 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |    78,357 | 12.762 |  2.900 | 61484.400 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |    78,461 | 12.745 |  2.500 | 61484.400 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |    78,444 | 12.748 |  2.500 | 61484.400 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |    75,883 | 13.178 |  2.500 | 61484.400 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |    36,900 | 27.100 | 27.100 |    27.100 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |    69,784 | 14.330 | 10.500 |    27.100 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |    65,690 | 15.223 |  7.900 |   165.600 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    51,038 | 19.593 |  3.100 |  3890.200 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    23,666 | 42.255 |  3.100 |  4835.000 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    23,465 | 42.616 |  2.900 |  7997.100 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    23,539 | 42.484 |  2.900 |  7997.100 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    23,607 | 42.359 |  2.800 |  7997.100 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    23,616 | 42.343 |  2.800 |  7997.100 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    23,617 | 42.342 |  2.800 |  7997.100 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |    95,238 | 10.500 | 10.500 |    10.500 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |    32,321 | 30.940 | 10.500 |   202.000 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |    55,057 | 18.163 |  7.200 |   202.000 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    69,584 | 14.371 |  2.900 |  1650.900 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   103,984 |  9.617 |  2.900 |  6291.100 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    95,897 | 10.428 |  2.900 | 29338.100 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |    96,404 | 10.373 |  2.900 | 29338.100 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |    96,575 | 10.355 |  2.800 | 29338.100 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |    96,591 | 10.353 |  2.800 | 29338.100 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |    96,570 | 10.355 |  2.800 | 29338.100 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   163,934 |  6.100 |  6.100 |     6.100 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   362,319 |  2.760 |  1.700 |     6.100 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 |   654,450 |  1.528 |  0.600 |     6.100 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    25,187 | 39.703 |  0.300 | 38299.200 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   188,181 |  5.314 |  0.300 | 38299.200 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   289,158 |  3.458 |  0.300 | 38299.200 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   297,795 |  3.358 |  0.300 | 38299.200 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 |   298,814 |  3.347 |  0.300 | 38299.200 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 |   298,895 |  3.346 |  0.300 | 38299.200 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 |   297,859 |  3.357 |  0.300 | 38299.200 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,111,111 |  0.900 |  0.900 |     0.900 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 |   781,250 |  1.280 |  0.900 |     2.000 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 |   438,789 |  2.279 |  0.400 |    11.300 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   134,154 |  7.454 |  0.300 |   430.000 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    29,182 | 34.268 |  0.300 |  7919.900 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    28,986 | 34.499 |  0.300 |  7919.900 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    29,177 | 34.274 |  0.300 |  7919.900 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    29,268 | 34.167 |  0.300 |  7919.900 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    29,281 | 34.152 |  0.300 |  7919.900 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    29,280 | 34.153 |  0.300 |  7919.900 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,000,000 |  1.000 |  1.000 |     1.000 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 |   917,431 |  1.090 |  0.800 |     2.300 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 1,610,306 |  0.621 |  0.300 |     3.100 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,761,494 |  0.568 |  0.200 |    11.100 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,125,315 |  0.889 |  0.200 |   643.200 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,068,196 |  0.936 |  0.200 |   643.200 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,064,154 |  0.940 |  0.200 |   643.200 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 1,066,099 |  0.938 |  0.200 |   643.200 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 1,066,369 |  0.938 |  0.200 |   643.200 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 1,064,453 |  0.939 |  0.200 |   643.200 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |        avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | ---------: |
| create   | —    |   0 | up        |      1 | A       |     1 |   6,680 |    149.700 |
| create   | —    |   0 | up        |     10 | A       |     1 |   9,042 |    110.600 |
| create   | —    |   0 | up        |    100 | A       |     1 |   5,074 |    197.100 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   1,135 |    881.200 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     150 |   6685.200 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |     846 |   1182.700 |
| create   | —    |   0 | down      |    100 | A       |     1 |   6,532 |    153.100 |
| create   | —    |   0 | down      |     10 | A       |     1 |  16,694 |     59.900 |
| create   | —    |   0 | down      |      1 | A       |     1 |  20,661 |     48.400 |
| create   | —    |   0 | down      |      0 | A       |     1 |  26,455 |     37.800 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   2,286 |    437.400 |
| sequence | —    |   0 | up        |     10 | A       |     1 |   7,622 |    131.200 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   2,157 |    463.500 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     116 |   8638.500 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      12 |  86213.700 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |       8 | 131775.800 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      10 |  97549.800 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      12 |  84863.100 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      10 | 104337.000 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  57,143 |     17.500 |
| values   | —    |   0 | up        |      1 | A       |     1 |   4,174 |    239.600 |
| values   | —    |   0 | up        |     10 | A       |     1 |   1,484 |    673.700 |
| values   | —    |   0 | up        |    100 | A       |     1 |   1,752 |    570.700 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     185 |   5405.900 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      56 |  17751.800 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     144 |   6957.100 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,665 |    600.600 |
| values   | —    |   0 | down      |     10 | A       |     1 |  10,460 |     95.600 |
| values   | —    |   0 | down      |      1 | A       |     1 |  22,026 |     45.400 |
| values   | —    |   0 | down      |      0 | A       |     1 |  30,303 |     33.000 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  85,331,968 |         9,851,848 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,910,592 |        10,007,016 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  77,664,256 |        10,657,912 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 101,175,296 |        15,597,568 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 309,223,424 |        64,600,896 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 403,148,800 |       109,766,656 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 408,207,360 |       114,578,000 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 408,858,624 |       115,012,760 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 409,001,984 |       115,079,776 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 408,416,256 |       115,032,720 |

## Disk usage

Disk bytes are the size of node:v8.serialize(sequence), excluding filesystem metadata; no disk I/O is timed.

| Run | direction | Replica | visible Strips | Frames | sequence bytes | disk B/Strip | disk B/Frame |
| --: | --------- | ------- | -------------: | -----: | -------------: | -----------: | -----------: |
|   0 | up        | A       |              1 |      8 |             84 |       84.000 |       10.500 |
|   0 | up        | A       |             10 |    410 |           1215 |      121.500 |        2.963 |
|   0 | up        | A       |            100 |   4859 |          18896 |      188.960 |        3.889 |
|   0 | up        | A       |           1000 |  50842 |         196583 |      196.583 |        3.867 |
|   0 | up        | A       |          10000 | 501051 |        2510711 |      251.071 |        5.011 |
|   0 | down      | A       |           1000 |  49083 |         242299 |      242.299 |        4.937 |
|   0 | down      | A       |            100 |   5271 |          25719 |      257.190 |        4.879 |
|   0 | down      | A       |             10 |    444 |           2211 |      221.100 |        4.980 |
|   0 | down      | A       |              1 |     89 |            630 |      630.000 |        7.079 |
|   0 | down      | A       |              0 |      0 |             37 |            — |            — |

## Lifecycle space averages

| Run | Replica | scope         | memory B/Strip | memory B/Frame | storage B/Strip | storage B/Frame |
| --: | ------- | ------------- | -------------: | -------------: | --------------: | --------------: |
|   0 | A       | scaleUp       |        425.175 |          8.479 |         245.476 |           4.895 |
|   0 | A       | scaleDown     |        419.298 |          8.487 |         243.797 |           4.935 |
|   0 | A       | fullLifecycle |        424.641 |          8.480 |         245.324 |           4.899 |

## Measurement notes

- Scale is the number of visible logical Strips maintained by the benchmark model. Every mutation targets a complete Strip boundary.
- The workload has two peers editing the same document. Every local Gossip is applied by the receiver and every acknowledgement returned by apply is gossiped back to the sender. apply.random times only the measured peer applying the remote replacement Gossip.
- Per-Replica retained bytes after restart are estimated as four bytes per Sequence metadata word plus eight bytes per JavaScript Footage array slot. Process RSS is shared and reported at checkpoint scope.
- Persistent representation size is the byte length of node:v8.serialize over the automatically collected public Sequence.
- Every checkpoint measures temporary Projection creation without replacing the two active gossip peers.
