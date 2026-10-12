# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:48:12.691Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    39,450 |       25.348 |       25.348 |         25.348 |     0.000 | 0: 25.348    | 0: 25.348    |
| apply    | random | A       | scaleDown     |  9,999 |    25,406 |       39.360 |       39.360 |         39.360 |     0.000 | 0: 39.360    | 0: 39.360    |
| apply    | random | A       | fullLifecycle | 19,999 |    30,908 |       32.354 |       32.354 |         32.354 |     0.000 | 0: 32.354    | 0: 32.354    |
| create   | —      | A       | scaleUp       |      6 |     1,696 |      589.583 |      589.583 |        589.583 |     0.000 | 0: 589.583   | 0: 589.583   |
| create   | —      | A       | scaleDown     |      5 |     8,708 |      114.840 |      114.840 |        114.840 |     0.000 | 0: 114.840   | 0: 114.840   |
| create   | —      | A       | fullLifecycle |     11 |     2,675 |      373.791 |      373.791 |        373.791 |     0.000 | 0: 373.791   | 0: 373.791   |
| insert   | head   | A       | scaleUp       |  5,000 |   899,264 |        1.112 |        1.112 |          1.112 |     0.000 | 0: 1.112     | 0: 1.112     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   899,264 |        1.112 |        1.112 |          1.112 |     0.000 | 0: 1.112     | 0: 1.112     |
| insert   | random | A       | scaleUp       | 10,000 |   103,392 |        9.672 |        9.672 |          9.672 |     0.000 | 0: 9.672     | 0: 9.672     |
| insert   | random | A       | scaleDown     | 10,000 |    62,260 |       16.062 |       16.062 |         16.062 |     0.000 | 0: 16.062    | 0: 16.062    |
| insert   | random | A       | fullLifecycle | 20,000 |    77,720 |       12.867 |       12.867 |         12.867 |     0.000 | 0: 12.867    | 0: 12.867    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,081,081 |        0.925 |        0.925 |          0.925 |     0.000 | 0: 0.925     | 0: 0.925     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,081,081 |        0.925 |        0.925 |          0.925 |     0.000 | 0: 0.925     | 0: 0.925     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   397,346 |        2.517 |        2.517 |          2.517 |     0.000 | 0: 2.517     | 0: 2.517     |
| remove   | head   | A       | fullLifecycle |  5,000 |   397,346 |        2.517 |        2.517 |          2.517 |     0.000 | 0: 2.517     | 0: 2.517     |
| remove   | random | A       | scaleUp       | 10,000 |    71,930 |       13.902 |       13.902 |         13.902 |     0.000 | 0: 13.902    | 0: 13.902    |
| remove   | random | A       | scaleDown     | 10,000 |    50,824 |       19.676 |       19.676 |         19.676 |     0.000 | 0: 19.676    | 0: 19.676    |
| remove   | random | A       | fullLifecycle | 20,000 |    59,562 |       16.789 |       16.789 |         16.789 |     0.000 | 0: 16.789    | 0: 16.789    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   404,014 |        2.475 |        2.475 |          2.475 |     0.000 | 0: 2.475     | 0: 2.475     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   404,014 |        2.475 |        2.475 |          2.475 |     0.000 | 0: 2.475     | 0: 2.475     |
| replace  | head   | A       | scaleUp       | 10,000 |   284,535 |        3.515 |        3.515 |          3.515 |     0.000 | 0: 3.515     | 0: 3.515     |
| replace  | head   | A       | scaleDown     | 10,000 |   225,418 |        4.436 |        4.436 |          4.436 |     0.000 | 0: 4.436     | 0: 4.436     |
| replace  | head   | A       | fullLifecycle | 20,000 |   251,550 |        3.975 |        3.975 |          3.975 |     0.000 | 0: 3.975     | 0: 3.975     |
| replace  | random | A       | scaleUp       | 10,000 |    72,994 |       13.700 |       13.700 |         13.700 |     0.000 | 0: 13.700    | 0: 13.700    |
| replace  | random | A       | scaleDown     | 10,000 |    47,611 |       21.004 |       21.004 |         21.004 |     0.000 | 0: 21.004    | 0: 21.004    |
| replace  | random | A       | fullLifecycle | 20,000 |    57,631 |       17.352 |       17.352 |         17.352 |     0.000 | 0: 17.352    | 0: 17.352    |
| replace  | tail   | A       | scaleUp       | 10,000 |   369,985 |        2.703 |        2.703 |          2.703 |     0.000 | 0: 2.703     | 0: 2.703     |
| replace  | tail   | A       | scaleDown     | 10,000 |   308,095 |        3.246 |        3.246 |          3.246 |     0.000 | 0: 3.246     | 0: 3.246     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   336,216 |        2.974 |        2.974 |          2.974 |     0.000 | 0: 2.974     | 0: 2.974     |
| sequence | —      | A       | scaleUp       |      5 |       163 |     6129.500 |     6129.500 |       6129.500 |     0.000 | 0: 6129.500  | 0: 6129.500  |
| sequence | —      | A       | scaleDown     |      5 |        23 |    43822.760 |    43822.760 |      43822.760 |     0.000 | 0: 43822.760 | 0: 43822.760 |
| sequence | —      | A       | fullLifecycle |     10 |        40 |    24976.130 |    24976.130 |      24976.130 |     0.000 | 0: 24976.130 | 0: 24976.130 |
| value    | head   | A       | scaleUp       | 10,000 | 2,648,305 |        0.378 |        0.378 |          0.378 |     0.000 | 0: 0.378     | 0: 0.378     |
| value    | head   | A       | scaleDown     | 10,000 | 1,872,133 |        0.534 |        0.534 |          0.534 |     0.000 | 0: 0.534     | 0: 0.534     |
| value    | head   | A       | fullLifecycle | 20,000 | 2,193,584 |        0.456 |        0.456 |          0.456 |     0.000 | 0: 0.456     | 0: 0.456     |
| value    | random | A       | scaleUp       | 10,000 |    92,099 |       10.858 |       10.858 |         10.858 |     0.000 | 0: 10.858    | 0: 10.858    |
| value    | random | A       | scaleDown     | 10,000 |    59,720 |       16.745 |       16.745 |         16.745 |     0.000 | 0: 16.745    | 0: 16.745    |
| value    | random | A       | fullLifecycle | 20,000 |    72,457 |       13.801 |       13.801 |         13.801 |     0.000 | 0: 13.801    | 0: 13.801    |
| value    | tail   | A       | scaleUp       | 10,000 | 3,862,048 |        0.259 |        0.259 |          0.259 |     0.000 | 0: 0.259     | 0: 0.259     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,227,320 |        0.449 |        0.449 |          0.449 |     0.000 | 0: 0.449     | 0: 0.449     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,825,258 |        0.354 |        0.354 |          0.354 |     0.000 | 0: 0.354     | 0: 0.354     |
| values   | —      | A       | scaleUp       |      5 |       466 |     2145.220 |     2145.220 |       2145.220 |     0.000 | 0: 2145.220  | 0: 2145.220  |
| values   | —      | A       | scaleDown     |      5 |     1,782 |      561.060 |      561.060 |        561.060 |     0.000 | 0: 561.060   | 0: 561.060   |
| values   | —      | A       | fullLifecycle |     10 |       739 |     1353.140 |     1353.140 |       1353.140 |     0.000 | 0: 1353.140  | 0: 1353.140  |

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

| Method  | case   | Run | direction | Strips |  Frames | Replica |  calls |   ops/sec |    avg |    min |      max |
| ------- | ------ | --: | --------- | -----: | ------: | ------- | -----: | --------: | -----: | -----: | -------: |
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    74,074 | 13.500 | 13.500 |   13.500 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    60,716 | 16.470 | 13.500 |   28.900 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    98,883 | 10.113 |  4.800 |   70.600 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    98,241 | 10.179 |  3.500 |  427.800 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    39,450 | 25.348 |  3.400 | 2275.500 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    30,814 | 32.452 |  3.400 | 2275.500 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    30,976 | 32.283 |  3.300 | 2275.500 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    31,043 | 32.213 |  3.200 | 2275.500 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    30,908 | 32.354 |  3.200 | 3067.700 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    30,908 | 32.354 |  3.200 | 3067.700 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   196,850 |  5.080 |  2.500 |   13.400 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   465,116 |  2.150 |  1.300 |   13.400 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   930,406 |  1.075 |  0.500 |   22.000 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   899,264 |  1.112 |  0.500 |   29.100 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   899,264 |  1.112 |  0.500 |   29.100 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   899,264 |  1.112 |  0.500 |   29.100 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   899,264 |  1.112 |  0.500 |   29.100 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   899,264 |  1.112 |  0.500 |   29.100 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   899,264 |  1.112 |  0.500 |   29.100 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   666,667 |  1.500 |  1.500 |    1.500 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   330,033 |  3.030 |  1.500 |    5.900 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   460,617 |  2.171 |  1.400 |    5.900 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   333,756 |  2.996 |  0.700 |  396.900 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   103,392 |  9.672 |  0.700 | 2235.500 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    77,130 | 12.965 |  0.700 | 2235.500 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    77,527 | 12.899 |  0.700 | 2235.500 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    77,685 | 12.872 |  0.700 | 2235.500 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    77,717 | 12.867 |  0.700 | 2235.500 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    77,720 | 12.867 |  0.700 | 2235.500 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   204,082 |  4.900 |  4.900 |    4.900 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   335,570 |  2.980 |  2.300 |    4.900 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   504,541 |  1.982 |  1.200 |   14.600 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   916,086 |  1.092 |  0.400 |   21.800 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,081,081 |  0.925 |  0.400 |   75.900 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,081,081 |  0.925 |  0.400 |   75.900 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,081,081 |  0.925 |  0.400 |   75.900 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,081,081 |  0.925 |  0.400 |   75.900 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,081,081 |  0.925 |  0.400 |   75.900 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,081,081 |  0.925 |  0.400 |   75.900 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   394,315 |  2.536 |  1.500 |   36.500 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   397,134 |  2.518 |  1.500 |   36.500 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   397,232 |  2.517 |  1.500 |   36.500 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   397,346 |  2.517 |  1.500 |   36.500 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   397,346 |  2.517 |  1.500 |   36.500 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   322,581 |  3.100 |  3.100 |    3.100 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   164,204 |  6.090 |  3.100 |    7.200 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   262,261 |  3.813 |  2.300 |    7.200 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   231,219 |  4.325 |  1.700 |   59.100 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    71,930 | 13.902 |  1.600 | 5549.900 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    59,062 | 16.931 |  1.600 | 5549.900 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    59,405 | 16.834 |  1.600 | 5549.900 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    59,539 | 16.796 |  1.500 | 5549.900 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    59,560 | 16.790 |  1.500 | 5549.900 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    59,562 | 16.789 |  1.500 | 5549.900 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   401,445 |  2.491 |  1.500 |   47.600 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   403,904 |  2.476 |  1.500 |   47.600 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   403,999 |  2.475 |  1.500 |   47.600 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   404,074 |  2.475 |  1.500 |   47.600 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   404,014 |  2.475 |  1.500 |   47.600 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    64,103 | 15.600 | 15.600 |   15.600 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   105,042 |  9.520 |  7.200 |   15.600 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   197,707 |  5.058 |  2.700 |   26.800 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   298,614 |  3.349 |  1.900 |   56.400 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   284,535 |  3.515 |  1.800 | 5448.500 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   267,604 |  3.737 |  1.800 | 7559.800 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   268,420 |  3.726 |  1.800 | 7559.800 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   268,067 |  3.730 |  1.800 | 7559.800 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   267,774 |  3.734 |  1.800 | 7559.800 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   251,550 |  3.975 |  1.800 | 7559.800 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   250,000 |  4.000 |  4.000 |    4.000 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   137,552 |  7.270 |  4.000 |    9.300 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   214,179 |  4.669 |  2.700 |    9.300 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   189,858 |  5.267 |  2.200 |  144.800 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    72,994 | 13.700 |  1.800 |  898.400 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    57,207 | 17.480 |  1.800 | 4600.900 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    57,474 | 17.399 |  1.800 | 4600.900 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    57,609 | 17.359 |  1.800 | 4600.900 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    57,630 | 17.352 |  1.800 | 4600.900 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    57,631 | 17.352 |  1.800 | 4600.900 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   333,333 |  3.000 |  3.000 |    3.000 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   149,031 |  6.710 |  3.000 |    7.600 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   206,143 |  4.851 |  2.400 |   61.300 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   275,429 |  3.631 |  1.800 |  415.400 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   369,985 |  2.703 |  1.700 |  415.400 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   336,987 |  2.967 |  1.700 | 2395.600 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   336,343 |  2.973 |  1.700 | 2395.600 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   336,225 |  2.974 |  1.700 | 2395.600 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   336,236 |  2.974 |  1.700 | 2395.600 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   336,216 |  2.974 |  1.700 | 2395.600 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   454,545 |  2.200 |  2.200 |    2.200 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   833,333 |  1.200 |  0.800 |    2.200 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,252,252 |  0.444 |  0.200 |    2.200 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,465,483 |  0.406 |  0.200 |   42.200 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,648,305 |  0.378 |  0.100 |  236.500 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,213,549 |  0.452 |  0.100 |  236.500 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,219,075 |  0.451 |  0.100 |  236.500 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,219,015 |  0.451 |  0.100 |  236.500 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,217,651 |  0.451 |  0.100 |  236.500 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 2,193,584 |  0.456 |  0.100 |  236.500 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 2,500,000 |  0.400 |  0.400 |    0.400 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 1,351,351 |  0.740 |  0.400 |    1.100 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,317,523 |  0.759 |  0.100 |    2.600 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   475,602 |  2.103 |  0.100 |   26.200 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    92,099 | 10.858 |  0.100 |  212.100 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    71,909 | 13.907 |  0.100 |  360.700 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    72,271 | 13.837 |  0.100 |  360.700 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    72,429 | 13.807 |  0.100 |  360.700 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    72,461 | 13.801 |  0.100 |  360.700 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    72,457 | 13.801 |  0.100 |  360.700 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |    0.300 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 1,562,500 |  0.640 |  0.300 |    1.300 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 3,623,188 |  0.276 |  0.100 |    2.600 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 4,291,845 |  0.233 |  0.100 |    5.700 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,862,048 |  0.259 |  0.100 |    9.100 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,827,886 |  0.354 |  0.100 |   10.700 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,831,531 |  0.353 |  0.100 |   10.700 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,833,331 |  0.353 |  0.100 |   10.700 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,833,803 |  0.353 |  0.100 |   10.700 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,825,258 |  0.354 |  0.100 |   21.700 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  17,857 |    56.000 |
| create   | —    |   0 | up        |     10 | A       |     1 |  28,249 |    35.400 |
| create   | —    |   0 | up        |    100 | A       |     1 |  14,409 |    69.400 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,600 |   384.600 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     357 |  2800.100 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,835 |   352.700 |
| create   | —    |   0 | down      |    100 | A       |     1 |   9,479 |   105.500 |
| create   | —    |   0 | down      |     10 | A       |     1 |  27,397 |    36.500 |
| create   | —    |   0 | down      |      1 | A       |     1 |  23,364 |    42.800 |
| create   | —    |   0 | down      |      0 | A       |     1 |  27,248 |    36.700 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   5,491 |   182.100 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  13,263 |    75.400 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   6,219 |   160.800 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     455 |  2197.200 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      36 | 28032.000 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      21 | 48092.300 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      19 | 53315.200 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      16 | 60768.600 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      18 | 56917.300 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  49,020 |    20.400 |
| values   | —    |   0 | up        |      1 | A       |     1 |  15,552 |    64.300 |
| values   | —    |   0 | up        |     10 | A       |     1 |  16,807 |    59.500 |
| values   | —    |   0 | up        |    100 | A       |     1 |   5,263 |   190.000 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     450 |  2223.700 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     122 |  8188.600 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     431 |  2318.800 |
| values   | —    |   0 | down      |    100 | A       |     1 |   2,640 |   378.800 |
| values   | —    |   0 | down      |     10 | A       |     1 |  19,194 |    52.100 |
| values   | —    |   0 | down      |      1 | A       |     1 |  41,152 |    24.300 |
| values   | —    |   0 | down      |      0 | A       |     1 |  31,949 |    31.300 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  84,246,528 |         9,857,048 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,640,256 |        10,004,352 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,503,936 |        10,654,584 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 101,748,736 |        15,595,048 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 307,138,560 |        64,598,072 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 401,162,240 |       109,763,936 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 405,622,784 |       114,572,712 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 406,249,472 |       115,010,024 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 405,958,656 |       115,079,496 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 406,147,072 |       114,910,616 |

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
