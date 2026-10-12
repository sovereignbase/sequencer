# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:47:08.038Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    29,754 |       33.608 |       33.608 |         33.608 |     0.000 | 0: 33.608    | 0: 33.608    |
| apply    | random | A       | scaleDown     |  9,999 |    23,073 |       43.341 |       43.341 |         43.341 |     0.000 | 0: 43.341    | 0: 43.341    |
| apply    | random | A       | fullLifecycle | 19,999 |    25,991 |       38.475 |       38.475 |         38.475 |     0.000 | 0: 38.475    | 0: 38.475    |
| create   | —      | A       | scaleUp       |      6 |     1,512 |      661.583 |      661.583 |        661.583 |     0.000 | 0: 661.583   | 0: 661.583   |
| create   | —      | A       | scaleDown     |      5 |     8,575 |      116.620 |      116.620 |        116.620 |     0.000 | 0: 116.620   | 0: 116.620   |
| create   | —      | A       | fullLifecycle |     11 |     2,416 |      413.873 |      413.873 |        413.873 |     0.000 | 0: 413.873   | 0: 413.873   |
| insert   | head   | A       | scaleUp       |  5,000 |   608,317 |        1.644 |        1.644 |          1.644 |     0.000 | 0: 1.644     | 0: 1.644     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   608,317 |        1.644 |        1.644 |          1.644 |     0.000 | 0: 1.644     | 0: 1.644     |
| insert   | random | A       | scaleUp       | 10,000 |    79,981 |       12.503 |       12.503 |         12.503 |     0.000 | 0: 12.503    | 0: 12.503    |
| insert   | random | A       | scaleDown     | 10,000 |    59,308 |       16.861 |       16.861 |         16.861 |     0.000 | 0: 16.861    | 0: 16.861    |
| insert   | random | A       | fullLifecycle | 20,000 |    68,111 |       14.682 |       14.682 |         14.682 |     0.000 | 0: 14.682    | 0: 14.682    |
| insert   | tail   | A       | scaleUp       |  5,000 |   799,246 |        1.251 |        1.251 |          1.251 |     0.000 | 0: 1.251     | 0: 1.251     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   799,246 |        1.251 |        1.251 |          1.251 |     0.000 | 0: 1.251     | 0: 1.251     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   334,822 |        2.987 |        2.987 |          2.987 |     0.000 | 0: 2.987     | 0: 2.987     |
| remove   | head   | A       | fullLifecycle |  5,000 |   334,822 |        2.987 |        2.987 |          2.987 |     0.000 | 0: 2.987     | 0: 2.987     |
| remove   | random | A       | scaleUp       | 10,000 |    60,404 |       16.555 |       16.555 |         16.555 |     0.000 | 0: 16.555    | 0: 16.555    |
| remove   | random | A       | scaleDown     | 10,000 |    48,075 |       20.801 |       20.801 |         20.801 |     0.000 | 0: 20.801    | 0: 20.801    |
| remove   | random | A       | fullLifecycle | 20,000 |    53,539 |       18.678 |       18.678 |         18.678 |     0.000 | 0: 18.678    | 0: 18.678    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   314,927 |        3.175 |        3.175 |          3.175 |     0.000 | 0: 3.175     | 0: 3.175     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   314,927 |        3.175 |        3.175 |          3.175 |     0.000 | 0: 3.175     | 0: 3.175     |
| replace  | head   | A       | scaleUp       | 10,000 |   218,255 |        4.582 |        4.582 |          4.582 |     0.000 | 0: 4.582     | 0: 4.582     |
| replace  | head   | A       | scaleDown     | 10,000 |   194,972 |        5.129 |        5.129 |          5.129 |     0.000 | 0: 5.129     | 0: 5.129     |
| replace  | head   | A       | fullLifecycle | 20,000 |   205,958 |        4.855 |        4.855 |          4.855 |     0.000 | 0: 4.855     | 0: 4.855     |
| replace  | random | A       | scaleUp       | 10,000 |    55,816 |       17.916 |       17.916 |         17.916 |     0.000 | 0: 17.916    | 0: 17.916    |
| replace  | random | A       | scaleDown     | 10,000 |    46,367 |       21.567 |       21.567 |         21.567 |     0.000 | 0: 21.567    | 0: 21.567    |
| replace  | random | A       | fullLifecycle | 20,000 |    50,655 |       19.741 |       19.741 |         19.741 |     0.000 | 0: 19.741    | 0: 19.741    |
| replace  | tail   | A       | scaleUp       | 10,000 |   259,106 |        3.859 |        3.859 |          3.859 |     0.000 | 0: 3.859     | 0: 3.859     |
| replace  | tail   | A       | scaleDown     | 10,000 |   276,329 |        3.619 |        3.619 |          3.619 |     0.000 | 0: 3.619     | 0: 3.619     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   267,440 |        3.739 |        3.739 |          3.739 |     0.000 | 0: 3.739     | 0: 3.739     |
| sequence | —      | A       | scaleUp       |      5 |       152 |     6572.560 |     6572.560 |       6572.560 |     0.000 | 0: 6572.560  | 0: 6572.560  |
| sequence | —      | A       | scaleDown     |      5 |        21 |    46797.160 |    46797.160 |      46797.160 |     0.000 | 0: 46797.160 | 0: 46797.160 |
| sequence | —      | A       | fullLifecycle |     10 |        37 |    26684.860 |    26684.860 |      26684.860 |     0.000 | 0: 26684.860 | 0: 26684.860 |
| value    | head   | A       | scaleUp       | 10,000 | 1,695,375 |        0.590 |        0.590 |          0.590 |     0.000 | 0: 0.590     | 0: 0.590     |
| value    | head   | A       | scaleDown     | 10,000 | 1,722,979 |        0.580 |        0.580 |          0.580 |     0.000 | 0: 0.580     | 0: 0.580     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,709,066 |        0.585 |        0.585 |          0.585 |     0.000 | 0: 0.585     | 0: 0.585     |
| value    | random | A       | scaleUp       | 10,000 |    75,277 |       13.284 |       13.284 |         13.284 |     0.000 | 0: 13.284    | 0: 13.284    |
| value    | random | A       | scaleDown     | 10,000 |    56,106 |       17.823 |       17.823 |         17.823 |     0.000 | 0: 17.823    | 0: 17.823    |
| value    | random | A       | fullLifecycle | 20,000 |    64,293 |       15.554 |       15.554 |         15.554 |     0.000 | 0: 15.554    | 0: 15.554    |
| value    | tail   | A       | scaleUp       | 10,000 | 2,846,408 |        0.351 |        0.351 |          0.351 |     0.000 | 0: 0.351     | 0: 0.351     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,180,169 |        0.459 |        0.459 |          0.459 |     0.000 | 0: 0.459     | 0: 0.459     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,469,136 |        0.405 |        0.405 |          0.405 |     0.000 | 0: 0.405     | 0: 0.405     |
| values   | —      | A       | scaleUp       |      5 |       426 |     2345.960 |     2345.960 |       2345.960 |     0.000 | 0: 2345.960  | 0: 2345.960  |
| values   | —      | A       | scaleDown     |      5 |     1,598 |      625.920 |      625.920 |        625.920 |     0.000 | 0: 625.920   | 0: 625.920   |
| values   | —      | A       | fullLifecycle |     10 |       673 |     1485.940 |     1485.940 |       1485.940 |     0.000 | 0: 1485.940  | 0: 1485.940  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    54,945 | 18.200 | 18.200 |   18.200 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    62,461 | 16.010 | 10.600 |   38.900 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    55,633 | 17.975 |  6.200 |   98.900 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    38,765 | 25.796 |  4.900 | 1499.400 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    29,754 | 33.608 |  4.500 | 5777.400 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    25,740 | 38.850 |  4.500 | 5777.400 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    26,037 | 38.407 |  3.200 | 5777.400 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    26,093 | 38.324 |  3.200 | 5777.400 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    25,991 | 38.475 |  3.200 | 5777.400 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    25,991 | 38.475 |  3.200 | 5777.400 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   195,313 |  5.120 |  2.100 |   14.500 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   274,725 |  3.640 |  1.600 |   14.500 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   280,143 |  3.570 |  0.700 |  590.300 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   608,317 |  1.644 |  0.700 |  590.300 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   608,317 |  1.644 |  0.700 |  590.300 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   608,317 |  1.644 |  0.700 |  590.300 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   608,317 |  1.644 |  0.700 |  590.300 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   608,317 |  1.644 |  0.700 |  590.300 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   608,317 |  1.644 |  0.700 |  590.300 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   270,270 |  3.700 |  3.700 |    3.700 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   332,226 |  3.010 |  1.800 |    5.400 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   227,894 |  4.388 |  1.800 |   12.300 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    75,284 | 13.283 |  0.900 | 4391.900 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    79,981 | 12.503 |  0.700 | 4391.900 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    67,259 | 14.868 |  0.700 | 4391.900 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    67,968 | 14.713 |  0.700 | 4391.900 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    68,080 | 14.689 |  0.700 | 4391.900 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    68,108 | 14.683 |  0.700 | 4391.900 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    68,111 | 14.682 |  0.700 | 4391.900 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   125,000 |  8.000 |  8.000 |    8.000 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   301,205 |  3.320 |  1.900 |    8.000 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   197,863 |  5.054 |  1.400 |   69.700 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   405,976 |  2.463 |  0.600 |   69.700 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   799,246 |  1.251 |  0.500 |   69.700 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   799,246 |  1.251 |  0.500 |   69.700 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   799,246 |  1.251 |  0.500 |   69.700 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   799,246 |  1.251 |  0.500 |   69.700 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   799,246 |  1.251 |  0.500 |   69.700 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   799,246 |  1.251 |  0.500 |   69.700 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   330,630 |  3.025 |  1.600 |   72.800 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   335,325 |  2.982 |  1.600 |   72.800 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   334,837 |  2.987 |  1.600 |   72.800 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   334,822 |  2.987 |  1.600 |   72.800 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   334,822 |  2.987 |  1.600 |   72.800 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   102,041 |  9.800 |  9.800 |    9.800 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   173,010 |  5.780 |  4.500 |    9.800 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   133,245 |  7.505 |  2.900 |   29.700 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   109,327 |  9.147 |  2.000 |   80.200 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    60,404 | 16.555 |  1.800 | 1089.800 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    52,895 | 18.906 |  1.700 | 1089.800 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    53,407 | 18.724 |  1.700 | 1089.800 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    53,519 | 18.685 |  1.700 | 1089.800 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    53,536 | 18.679 |  1.700 | 1089.800 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    53,539 | 18.678 |  1.700 | 1089.800 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   308,612 |  3.240 |  1.600 | 1499.000 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   314,996 |  3.175 |  1.600 | 1499.000 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   314,904 |  3.176 |  1.600 | 1499.000 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   314,919 |  3.175 |  1.600 | 1499.000 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   314,927 |  3.175 |  1.600 | 1499.000 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    41,152 | 24.300 | 24.300 |   24.300 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   106,270 |  9.410 |  5.700 |   24.300 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   108,436 |  9.222 |  3.300 |   79.600 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    87,237 | 11.463 |  2.500 | 2233.800 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   218,255 |  4.582 |  1.800 | 2233.800 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   219,166 |  4.563 |  1.800 | 9201.200 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   221,201 |  4.521 |  1.800 | 9201.200 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   220,991 |  4.525 |  1.800 | 9201.200 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   220,746 |  4.530 |  1.800 | 9201.200 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   205,958 |  4.855 |  1.800 | 9201.200 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   114,943 |  8.700 |  8.700 |    8.700 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   152,207 |  6.570 |  5.000 |    8.700 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   110,059 |  9.086 |  4.000 |   65.900 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    75,332 | 13.275 |  2.900 |  811.200 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    55,816 | 17.916 |  2.000 | 8308.400 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    50,023 | 19.991 |  1.900 | 8308.400 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    50,536 | 19.788 |  1.900 | 8308.400 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    50,635 | 19.749 |  1.900 | 8308.400 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    50,653 | 19.742 |  1.900 | 8308.400 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    50,655 | 19.741 |  1.900 | 8308.400 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   135,135 |  7.400 |  7.400 |    7.400 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   152,672 |  6.550 |  4.900 |   11.100 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   105,921 |  9.441 |  3.100 |   82.000 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   129,858 |  7.701 |  2.300 |  522.700 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   259,106 |  3.859 |  1.600 |  997.300 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   266,328 |  3.755 |  1.600 | 2617.900 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   267,585 |  3.737 |  1.600 | 2617.900 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   267,472 |  3.739 |  1.600 | 2617.900 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   267,443 |  3.739 |  1.600 | 2617.900 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   267,440 |  3.739 |  1.600 | 2617.900 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   312,500 |  3.200 |  3.200 |    3.200 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   751,880 |  1.330 |  0.600 |    3.200 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 1,282,051 |  0.780 |  0.200 |    3.200 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   788,892 |  1.268 |  0.200 |  256.700 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,695,375 |  0.590 |  0.200 |  256.700 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,704,510 |  0.587 |  0.200 |  256.700 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,724,123 |  0.580 |  0.200 |  256.700 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 1,725,239 |  0.580 |  0.200 |  256.700 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 1,724,661 |  0.580 |  0.200 |  256.700 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,709,066 |  0.585 |  0.200 |  256.700 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,111,111 |  0.900 |  0.900 |    0.900 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 1,428,571 |  0.700 |  0.400 |    1.300 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 |   654,022 |  1.529 |  0.400 |    5.100 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   200,172 |  4.996 |  0.400 |  227.200 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    75,277 | 13.284 |  0.300 |  227.200 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    63,474 | 15.755 |  0.100 |  875.700 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    64,110 | 15.598 |  0.100 |  875.700 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    64,268 | 15.560 |  0.100 |  875.700 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    64,296 | 15.553 |  0.100 |  875.700 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    64,293 | 15.554 |  0.100 |  875.700 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |    0.600 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 1,562,500 |  0.640 |  0.400 |    1.400 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 2,487,562 |  0.402 |  0.200 |    1.400 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,963,094 |  0.509 |  0.200 |   39.300 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,846,408 |  0.351 |  0.100 |   39.300 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,457,161 |  0.407 |  0.100 |   39.300 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,473,186 |  0.404 |  0.100 |   39.300 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,474,990 |  0.404 |  0.100 |   39.300 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,475,461 |  0.404 |  0.100 |   39.300 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,469,136 |  0.405 |  0.100 |   39.300 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  13,793 |    72.500 |
| create   | —    |   0 | up        |     10 | A       |     1 |   6,439 |   155.300 |
| create   | —    |   0 | up        |    100 | A       |     1 |   6,270 |   159.500 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,290 |   436.600 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     363 |  2753.400 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,807 |   356.200 |
| create   | —    |   0 | down      |    100 | A       |     1 |   9,066 |   110.300 |
| create   | —    |   0 | down      |     10 | A       |     1 |  26,525 |    37.700 |
| create   | —    |   0 | down      |      1 | A       |     1 |  22,883 |    43.700 |
| create   | —    |   0 | down      |      0 | A       |     1 |  28,409 |    35.200 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   3,698 |   270.400 |
| sequence | —    |   0 | up        |     10 | A       |     1 |   9,533 |   104.900 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   2,767 |   361.400 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     381 |  2626.900 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      34 | 29499.200 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      20 | 50514.000 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      17 | 59365.100 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      18 | 55065.300 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      14 | 69021.000 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  49,020 |    20.400 |
| values   | —    |   0 | up        |      1 | A       |     1 |   8,658 |   115.500 |
| values   | —    |   0 | up        |     10 | A       |     1 |   8,177 |   122.300 |
| values   | —    |   0 | up        |    100 | A       |     1 |   2,591 |   386.000 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     334 |  2994.100 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     123 |  8111.900 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     408 |  2448.700 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,824 |   548.100 |
| values   | —    |   0 | down      |     10 | A       |     1 |  14,184 |    70.500 |
| values   | —    |   0 | down      |      1 | A       |     1 |  27,933 |    35.800 |
| values   | —    |   0 | down      |      0 | A       |     1 |  37,736 |    26.500 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  83,996,672 |         9,857,112 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,554,240 |        10,004,432 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,155,776 |        10,653,848 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 101,380,096 |        15,595,240 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 305,545,216 |        64,598,736 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 401,002,496 |       109,764,680 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 406,466,560 |       114,576,040 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 407,191,552 |       115,010,800 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 406,376,448 |       115,080,288 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 407,744,512 |       114,911,408 |

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
