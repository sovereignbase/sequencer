# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:21:07.614Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    13,766 |       72.642 |       72.642 |         72.642 |     0.000 | 0: 72.642    | 0: 72.642    |
| apply    | random | A       | scaleDown     |  9,999 |    10,577 |       94.542 |       94.542 |         94.542 |     0.000 | 0: 94.542    | 0: 94.542    |
| apply    | random | A       | fullLifecycle | 19,999 |    11,963 |       83.592 |       83.592 |         83.592 |     0.000 | 0: 83.592    | 0: 83.592    |
| create   | —      | A       | scaleUp       |      6 |       797 |     1255.217 |     1255.217 |       1255.217 |     0.000 | 0: 1255.217  | 0: 1255.217  |
| create   | —      | A       | scaleDown     |      5 |     2,881 |      347.160 |      347.160 |        347.160 |     0.000 | 0: 347.160   | 0: 347.160   |
| create   | —      | A       | fullLifecycle |     11 |     1,187 |      842.464 |      842.464 |        842.464 |     0.000 | 0: 842.464   | 0: 842.464   |
| insert   | head   | A       | scaleUp       |  5,000 |   319,524 |        3.130 |        3.130 |          3.130 |     0.000 | 0: 3.130     | 0: 3.130     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   319,524 |        3.130 |        3.130 |          3.130 |     0.000 | 0: 3.130     | 0: 3.130     |
| insert   | random | A       | scaleUp       | 10,000 |    39,166 |       25.532 |       25.532 |         25.532 |     0.000 | 0: 25.532    | 0: 25.532    |
| insert   | random | A       | scaleDown     | 10,000 |    30,778 |       32.491 |       32.491 |         32.491 |     0.000 | 0: 32.491    | 0: 32.491    |
| insert   | random | A       | fullLifecycle | 20,000 |    34,469 |       29.011 |       29.011 |         29.011 |     0.000 | 0: 29.011    | 0: 29.011    |
| insert   | tail   | A       | scaleUp       |  5,000 |   185,695 |        5.385 |        5.385 |          5.385 |     0.000 | 0: 5.385     | 0: 5.385     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   185,695 |        5.385 |        5.385 |          5.385 |     0.000 | 0: 5.385     | 0: 5.385     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   126,263 |        7.920 |        7.920 |          7.920 |     0.000 | 0: 7.920     | 0: 7.920     |
| remove   | head   | A       | fullLifecycle |  5,000 |   126,263 |        7.920 |        7.920 |          7.920 |     0.000 | 0: 7.920     | 0: 7.920     |
| remove   | random | A       | scaleUp       | 10,000 |    27,114 |       36.882 |       36.882 |         36.882 |     0.000 | 0: 36.882    | 0: 36.882    |
| remove   | random | A       | scaleDown     | 10,000 |    22,845 |       43.774 |       43.774 |         43.774 |     0.000 | 0: 43.774    | 0: 43.774    |
| remove   | random | A       | fullLifecycle | 20,000 |    24,797 |       40.328 |       40.328 |         40.328 |     0.000 | 0: 40.328    | 0: 40.328    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   128,520 |        7.781 |        7.781 |          7.781 |     0.000 | 0: 7.781     | 0: 7.781     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   128,520 |        7.781 |        7.781 |          7.781 |     0.000 | 0: 7.781     | 0: 7.781     |
| replace  | head   | A       | scaleUp       | 10,000 |   111,043 |        9.006 |        9.006 |          9.006 |     0.000 | 0: 9.006     | 0: 9.006     |
| replace  | head   | A       | scaleDown     | 10,000 |   102,439 |        9.762 |        9.762 |          9.762 |     0.000 | 0: 9.762     | 0: 9.762     |
| replace  | head   | A       | fullLifecycle | 20,000 |   106,568 |        9.384 |        9.384 |          9.384 |     0.000 | 0: 9.384     | 0: 9.384     |
| replace  | random | A       | scaleUp       | 10,000 |    26,819 |       37.287 |       37.287 |         37.287 |     0.000 | 0: 37.287    | 0: 37.287    |
| replace  | random | A       | scaleDown     | 10,000 |    21,948 |       45.562 |       45.562 |         45.562 |     0.000 | 0: 45.562    | 0: 45.562    |
| replace  | random | A       | fullLifecycle | 20,000 |    24,140 |       41.424 |       41.424 |         41.424 |     0.000 | 0: 41.424    | 0: 41.424    |
| replace  | tail   | A       | scaleUp       | 10,000 |   114,097 |        8.764 |        8.764 |          8.764 |     0.000 | 0: 8.764     | 0: 8.764     |
| replace  | tail   | A       | scaleDown     | 10,000 |   115,969 |        8.623 |        8.623 |          8.623 |     0.000 | 0: 8.623     | 0: 8.623     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   115,025 |        8.694 |        8.694 |          8.694 |     0.000 | 0: 8.694     | 0: 8.694     |
| sequence | —      | A       | scaleUp       |      5 |        61 |    16514.320 |    16514.320 |      16514.320 |     0.000 | 0: 16514.320 | 0: 16514.320 |
| sequence | —      | A       | scaleDown     |      5 |        12 |    85831.960 |    85831.960 |      85831.960 |     0.000 | 0: 85831.960 | 0: 85831.960 |
| sequence | —      | A       | fullLifecycle |     10 |        20 |    51173.140 |    51173.140 |      51173.140 |     0.000 | 0: 51173.140 | 0: 51173.140 |
| value    | head   | A       | scaleUp       | 10,000 |   856,098 |        1.168 |        1.168 |          1.168 |     0.000 | 0: 1.168     | 0: 1.168     |
| value    | head   | A       | scaleDown     | 10,000 |   386,358 |        2.588 |        2.588 |          2.588 |     0.000 | 0: 2.588     | 0: 2.588     |
| value    | head   | A       | fullLifecycle | 20,000 |   532,430 |        1.878 |        1.878 |          1.878 |     0.000 | 0: 1.878     | 0: 1.878     |
| value    | random | A       | scaleUp       | 10,000 |    33,360 |       29.976 |       29.976 |         29.976 |     0.000 | 0: 29.976    | 0: 29.976    |
| value    | random | A       | scaleDown     | 10,000 |    29,268 |       34.167 |       34.167 |         34.167 |     0.000 | 0: 34.167    | 0: 34.167    |
| value    | random | A       | fullLifecycle | 20,000 |    31,180 |       32.072 |       32.072 |         32.072 |     0.000 | 0: 32.072    | 0: 32.072    |
| value    | tail   | A       | scaleUp       | 10,000 | 1,447,052 |        0.691 |        0.691 |          0.691 |     0.000 | 0: 0.691     | 0: 0.691     |
| value    | tail   | A       | scaleDown     | 10,000 |   976,210 |        1.024 |        1.024 |          1.024 |     0.000 | 0: 1.024     | 0: 1.024     |
| value    | tail   | A       | fullLifecycle | 20,000 | 1,165,888 |        0.858 |        0.858 |          0.858 |     0.000 | 0: 0.858     | 0: 0.858     |
| values   | —      | A       | scaleUp       |      5 |       195 |     5123.900 |     5123.900 |       5123.900 |     0.000 | 0: 5123.900  | 0: 5123.900  |
| values   | —      | A       | scaleDown     |      5 |       692 |     1444.580 |     1444.580 |       1444.580 |     0.000 | 0: 1444.580  | 0: 1444.580  |
| values   | —      | A       | fullLifecycle |     10 |       304 |     3284.240 |     3284.240 |       3284.240 |     0.000 | 0: 3284.240  | 0: 3284.240  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    27,027 | 37.000 | 37.000 |    37.000 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    37,064 | 26.980 | 24.100 |    37.000 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    44,797 | 22.323 |  8.100 |   250.800 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    41,981 | 23.820 |  5.500 |  2259.200 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    13,766 | 72.642 |  5.500 |  7821.600 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    11,804 | 84.720 |  5.500 | 12742.500 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    11,956 | 83.642 |  5.500 | 12742.500 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    11,990 | 83.405 |  5.500 | 12742.500 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    11,963 | 83.592 |  5.500 | 12742.500 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    11,963 | 83.592 |  5.500 | 12742.500 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   132,626 |  7.540 |  3.800 |    19.000 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   204,332 |  4.894 |  2.200 |    49.100 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   433,764 |  2.305 |  0.800 |    49.100 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   319,524 |  3.130 |  0.800 |   211.700 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   319,524 |  3.130 |  0.800 |   211.700 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   319,524 |  3.130 |  0.800 |   211.700 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   319,524 |  3.130 |  0.800 |   211.700 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   319,524 |  3.130 |  0.800 |   211.700 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   319,524 |  3.130 |  0.800 |   211.700 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   161,290 |  6.200 |  6.200 |     6.200 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   190,114 |  5.260 |  3.700 |     9.200 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   196,117 |  5.099 |  2.200 |    13.200 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   149,265 |  6.699 |  1.100 |   617.200 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    39,166 | 25.532 |  1.100 |  7506.200 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    34,078 | 29.345 |  1.100 |  7506.200 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    34,363 | 29.101 |  1.100 |  7506.200 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    34,454 | 29.024 |  1.100 |  7506.200 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    34,468 | 29.013 |  1.100 |  7506.200 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    34,469 | 29.011 |  1.100 |  7506.200 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |    84,034 | 11.900 | 11.900 |    11.900 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   176,678 |  5.660 |  3.700 |    11.900 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   228,311 |  4.380 |  1.900 |    18.500 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   467,902 |  2.137 |  0.700 |    32.700 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   185,695 |  5.385 |  0.700 |  9287.700 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   185,695 |  5.385 |  0.700 |  9287.700 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   185,695 |  5.385 |  0.700 |  9287.700 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   185,695 |  5.385 |  0.700 |  9287.700 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   185,695 |  5.385 |  0.700 |  9287.700 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   185,695 |  5.385 |  0.700 |  9287.700 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   123,665 |  8.086 |  3.200 |   111.300 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   125,854 |  7.946 |  3.200 |   111.300 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   126,247 |  7.921 |  3.200 |   111.300 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   126,263 |  7.920 |  3.200 |   111.300 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   126,263 |  7.920 |  3.200 |   111.300 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |    73,529 | 13.600 | 13.600 |    13.600 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |    89,767 | 11.140 |  9.800 |    13.600 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   105,241 |  9.502 |  3.900 |    48.900 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   104,945 |  9.529 |  2.600 |   143.400 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    27,114 | 36.882 |  2.600 |  1340.500 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    24,452 | 40.896 |  2.600 |  5806.800 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    24,719 | 40.454 |  2.600 |  5806.800 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    24,786 | 40.345 |  2.600 |  5806.800 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    24,796 | 40.330 |  2.600 |  5806.800 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    24,797 | 40.328 |  2.600 |  5806.800 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   125,861 |  7.945 |  2.900 |   217.900 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   128,077 |  7.808 |  2.900 |   217.900 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   128,473 |  7.784 |  2.900 |   217.900 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   128,519 |  7.781 |  2.900 |   217.900 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   128,520 |  7.781 |  2.900 |   217.900 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    23,095 | 43.300 | 43.300 |    43.300 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    53,792 | 18.590 | 12.200 |    43.300 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |    88,378 | 11.315 |  4.500 |   101.900 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    96,569 | 10.355 |  3.200 |  1957.600 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   111,043 |  9.006 |  2.900 |  2889.800 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   110,530 |  9.047 |  2.900 |  5508.500 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   110,966 |  9.012 |  2.900 |  5508.500 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   111,013 |  9.008 |  2.900 |  5508.500 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   110,962 |  9.012 |  2.900 |  5508.500 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   106,568 |  9.384 |  2.900 |  7442.100 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |    59,880 | 16.700 | 16.700 |    16.700 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |    74,683 | 13.390 | 11.500 |    16.700 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |    98,746 | 10.127 |  5.100 |    41.100 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    93,829 | 10.658 |  3.200 |   344.800 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    26,819 | 37.287 |  3.200 |  2023.300 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    23,775 | 42.060 |  3.200 | 15081.300 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    24,064 | 41.556 |  3.200 | 15081.300 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    24,130 | 41.442 |  3.200 | 15081.300 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    24,139 | 41.426 |  3.200 | 15081.300 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    24,140 | 41.424 |  3.200 | 15081.300 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |    71,942 | 13.900 | 13.900 |    13.900 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |    79,114 | 12.640 | 10.900 |    14.800 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   102,543 |  9.752 |  4.200 |    64.900 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   108,722 |  9.198 |  2.900 |  1674.300 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   114,097 |  8.764 |  2.600 | 11571.900 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   114,232 |  8.754 |  2.600 | 11571.900 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   114,923 |  8.701 |  2.600 | 11571.900 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   115,005 |  8.695 |  2.600 | 11571.900 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   115,025 |  8.694 |  2.600 | 11571.900 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   115,025 |  8.694 |  2.600 | 11571.900 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   217,391 |  4.600 |  4.600 |     4.600 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   414,938 |  2.410 |  1.700 |     4.600 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 |   958,773 |  1.043 |  0.400 |     5.000 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,095,530 |  0.913 |  0.300 |    58.000 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   856,098 |  1.168 |  0.300 |   862.900 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   520,482 |  1.921 |  0.300 | 12619.800 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   533,199 |  1.875 |  0.300 | 12619.800 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 |   534,556 |  1.871 |  0.300 | 12619.800 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 |   534,613 |  1.871 |  0.300 | 12619.800 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 |   532,430 |  1.878 |  0.300 | 12619.800 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 |   666,667 |  1.500 |  1.500 |     1.500 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 |   813,008 |  1.230 |  0.800 |     2.000 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 |   590,319 |  1.694 |  0.200 |     7.300 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   227,082 |  4.404 |  0.200 |   126.800 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    33,360 | 29.976 |  0.200 |  3509.100 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    30,697 | 32.576 |  0.200 |  5637.400 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    31,076 | 32.179 |  0.200 |  5637.400 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    31,168 | 32.084 |  0.200 |  5637.400 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    31,182 | 32.070 |  0.200 |  5637.400 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    31,180 | 32.072 |  0.200 |  5637.400 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 |   714,286 |  1.400 |  1.400 |     1.400 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 |   847,458 |  1.180 |  0.800 |     2.600 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 2,057,613 |  0.486 |  0.200 |     2.600 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,168,257 |  0.461 |  0.200 |    16.700 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,447,052 |  0.691 |  0.200 |    92.300 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,157,732 |  0.864 |  0.200 |   196.400 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,166,731 |  0.857 |  0.200 |   196.400 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 1,168,596 |  0.856 |  0.200 |   196.400 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 1,168,896 |  0.856 |  0.200 |   196.400 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 1,165,888 |  0.858 |  0.200 |   196.400 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |        avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | ---------: |
| create   | —    |   0 | up        |      1 | A       |     1 |   7,669 |    130.400 |
| create   | —    |   0 | up        |     10 | A       |     1 |  15,873 |     63.000 |
| create   | —    |   0 | up        |    100 | A       |     1 |   5,900 |    169.500 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   1,592 |    628.300 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     170 |   5865.500 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |     765 |   1307.800 |
| create   | —    |   0 | down      |    100 | A       |     1 |   4,161 |    240.300 |
| create   | —    |   0 | down      |     10 | A       |     1 |  12,870 |     77.700 |
| create   | —    |   0 | down      |      1 | A       |     1 |  17,094 |     58.500 |
| create   | —    |   0 | down      |      0 | A       |     1 |  19,417 |     51.500 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   2,461 |    406.300 |
| sequence | —    |   0 | up        |     10 | A       |     1 |   9,533 |    104.900 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   2,487 |    402.100 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     237 |   4221.600 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      13 |  77436.700 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |       8 | 121811.200 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      10 | 103240.200 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      10 | 100202.900 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      10 | 103874.800 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  32,573 |     30.700 |
| values   | —    |   0 | up        |      1 | A       |     1 |   6,739 |    148.400 |
| values   | —    |   0 | up        |     10 | A       |     1 |  10,449 |     95.700 |
| values   | —    |   0 | up        |    100 | A       |     1 |   3,061 |    326.700 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     245 |   4086.200 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      48 |  20962.500 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     174 |   5743.800 |
| values   | —    |   0 | down      |    100 | A       |     1 |     802 |   1246.700 |
| values   | —    |   0 | down      |     10 | A       |     1 |   9,033 |    110.700 |
| values   | —    |   0 | down      |      1 | A       |     1 |  13,141 |     76.100 |
| values   | —    |   0 | down      |      0 | A       |     1 |  21,930 |     45.600 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  82,616,320 |         9,851,368 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,608,064 |        10,006,480 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  76,894,208 |        10,656,784 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,163,584 |        15,597,200 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 295,288,832 |        64,600,360 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 396,169,216 |       109,766,304 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 400,510,976 |       114,577,664 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 401,022,976 |       115,012,424 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 401,571,840 |       115,081,912 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 401,481,728 |       114,913,048 |

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
