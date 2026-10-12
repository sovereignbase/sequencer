# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:00:25.130Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    37,997 |       26.318 |       26.318 |         26.318 |     0.000 | 0: 26.318    | 0: 26.318    |
| apply    | random | A       | scaleDown     |  9,999 |    16,052 |       62.298 |       62.298 |         62.298 |     0.000 | 0: 62.298    | 0: 62.298    |
| apply    | random | A       | fullLifecycle | 19,999 |    22,570 |       44.307 |       44.307 |         44.307 |     0.000 | 0: 44.307    | 0: 44.307    |
| create   | —      | A       | scaleUp       |      6 |     1,667 |      599.750 |      599.750 |        599.750 |     0.000 | 0: 599.750   | 0: 599.750   |
| create   | —      | A       | scaleDown     |      5 |     7,084 |      141.160 |      141.160 |        141.160 |     0.000 | 0: 141.160   | 0: 141.160   |
| create   | —      | A       | fullLifecycle |     11 |     2,556 |      391.300 |      391.300 |        391.300 |     0.000 | 0: 391.300   | 0: 391.300   |
| insert   | head   | A       | scaleUp       |  5,000 |   876,916 |        1.140 |        1.140 |          1.140 |     0.000 | 0: 1.140     | 0: 1.140     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   876,916 |        1.140 |        1.140 |          1.140 |     0.000 | 0: 1.140     | 0: 1.140     |
| insert   | random | A       | scaleUp       | 10,000 |   104,253 |        9.592 |        9.592 |          9.592 |     0.000 | 0: 9.592     | 0: 9.592     |
| insert   | random | A       | scaleDown     | 10,000 |    42,267 |       23.659 |       23.659 |         23.659 |     0.000 | 0: 23.659    | 0: 23.659    |
| insert   | random | A       | fullLifecycle | 20,000 |    60,148 |       16.626 |       16.626 |         16.626 |     0.000 | 0: 16.626    | 0: 16.626    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,163,873 |        0.859 |        0.859 |          0.859 |     0.000 | 0: 0.859     | 0: 0.859     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,163,873 |        0.859 |        0.859 |          0.859 |     0.000 | 0: 0.859     | 0: 0.859     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   199,629 |        5.009 |        5.009 |          5.009 |     0.000 | 0: 5.009     | 0: 5.009     |
| remove   | head   | A       | fullLifecycle |  5,000 |   199,629 |        5.009 |        5.009 |          5.009 |     0.000 | 0: 5.009     | 0: 5.009     |
| remove   | random | A       | scaleUp       | 10,000 |    73,031 |       13.693 |       13.693 |         13.693 |     0.000 | 0: 13.693    | 0: 13.693    |
| remove   | random | A       | scaleDown     | 10,000 |    31,575 |       31.671 |       31.671 |         31.671 |     0.000 | 0: 31.671    | 0: 31.671    |
| remove   | random | A       | fullLifecycle | 20,000 |    44,088 |       22.682 |       22.682 |         22.682 |     0.000 | 0: 22.682    | 0: 22.682    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   203,316 |        4.918 |        4.918 |          4.918 |     0.000 | 0: 4.918     | 0: 4.918     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   203,316 |        4.918 |        4.918 |          4.918 |     0.000 | 0: 4.918     | 0: 4.918     |
| replace  | head   | A       | scaleUp       | 10,000 |   321,839 |        3.107 |        3.107 |          3.107 |     0.000 | 0: 3.107     | 0: 3.107     |
| replace  | head   | A       | scaleDown     | 10,000 |   120,947 |        8.268 |        8.268 |          8.268 |     0.000 | 0: 8.268     | 0: 8.268     |
| replace  | head   | A       | fullLifecycle | 20,000 |   175,821 |        5.688 |        5.688 |          5.688 |     0.000 | 0: 5.688     | 0: 5.688     |
| replace  | random | A       | scaleUp       | 10,000 |    69,487 |       14.391 |       14.391 |         14.391 |     0.000 | 0: 14.391    | 0: 14.391    |
| replace  | random | A       | scaleDown     | 10,000 |    32,187 |       31.069 |       31.069 |         31.069 |     0.000 | 0: 31.069    | 0: 31.069    |
| replace  | random | A       | fullLifecycle | 20,000 |    43,995 |       22.730 |       22.730 |         22.730 |     0.000 | 0: 22.730    | 0: 22.730    |
| replace  | tail   | A       | scaleUp       | 10,000 |   335,661 |        2.979 |        2.979 |          2.979 |     0.000 | 0: 2.979     | 0: 2.979     |
| replace  | tail   | A       | scaleDown     | 10,000 |   177,338 |        5.639 |        5.639 |          5.639 |     0.000 | 0: 5.639     | 0: 5.639     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   232,068 |        4.309 |        4.309 |          4.309 |     0.000 | 0: 4.309     | 0: 4.309     |
| sequence | —      | A       | scaleUp       |      5 |       134 |     7477.320 |     7477.320 |       7477.320 |     0.000 | 0: 7477.320  | 0: 7477.320  |
| sequence | —      | A       | scaleDown     |      5 |        15 |    68392.380 |    68392.380 |      68392.380 |     0.000 | 0: 68392.380 | 0: 68392.380 |
| sequence | —      | A       | fullLifecycle |     10 |        26 |    37934.850 |    37934.850 |      37934.850 |     0.000 | 0: 37934.850 | 0: 37934.850 |
| value    | head   | A       | scaleUp       | 10,000 | 2,806,545 |        0.356 |        0.356 |          0.356 |     0.000 | 0: 0.356     | 0: 0.356     |
| value    | head   | A       | scaleDown     | 10,000 | 1,086,779 |        0.920 |        0.920 |          0.920 |     0.000 | 0: 0.920     | 0: 0.920     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,566,833 |        0.638 |        0.638 |          0.638 |     0.000 | 0: 0.638     | 0: 0.638     |
| value    | random | A       | scaleUp       | 10,000 |    88,867 |       11.253 |       11.253 |         11.253 |     0.000 | 0: 11.253    | 0: 11.253    |
| value    | random | A       | scaleDown     | 10,000 |    40,127 |       24.921 |       24.921 |         24.921 |     0.000 | 0: 24.921    | 0: 24.921    |
| value    | random | A       | fullLifecycle | 20,000 |    55,288 |       18.087 |       18.087 |         18.087 |     0.000 | 0: 18.087    | 0: 18.087    |
| value    | tail   | A       | scaleUp       | 10,000 | 3,883,948 |        0.257 |        0.257 |          0.257 |     0.000 | 0: 0.257     | 0: 0.257     |
| value    | tail   | A       | scaleDown     | 10,000 | 1,376,614 |        0.726 |        0.726 |          0.726 |     0.000 | 0: 0.726     | 0: 0.726     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,032,748 |        0.492 |        0.492 |          0.492 |     0.000 | 0: 0.492     | 0: 0.492     |
| values   | —      | A       | scaleUp       |      5 |       484 |     2064.240 |     2064.240 |       2064.240 |     0.000 | 0: 2064.240  | 0: 2064.240  |
| values   | —      | A       | scaleDown     |      5 |       795 |     1258.640 |     1258.640 |       1258.640 |     0.000 | 0: 1258.640  | 0: 1258.640  |
| values   | —      | A       | fullLifecycle |     10 |       602 |     1661.440 |     1661.440 |       1661.440 |     0.000 | 0: 1661.440  | 0: 1661.440  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |   131,579 |  7.600 |  7.600 |     7.600 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   139,082 |  7.190 |  6.600 |     8.900 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   131,718 |  7.592 |  3.800 |    59.100 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   113,529 |  8.808 |  3.100 |   417.400 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    37,997 | 26.318 |  3.100 |  6760.500 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    22,676 | 44.099 |  3.100 |  6760.500 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    22,615 | 44.218 |  3.100 |  6760.500 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    22,655 | 44.141 |  3.100 |  6760.500 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    22,570 | 44.307 |  3.100 |  6760.500 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    22,570 | 44.307 |  3.100 |  6760.500 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   282,486 |  3.540 |  1.000 |    11.400 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   611,995 |  1.634 |  0.900 |    11.400 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,021,868 |  0.979 |  0.400 |    20.500 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   876,916 |  1.140 |  0.400 |   245.000 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   876,916 |  1.140 |  0.400 |   245.000 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   876,916 |  1.140 |  0.400 |   245.000 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   876,916 |  1.140 |  0.400 |   245.000 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   876,916 |  1.140 |  0.400 |   245.000 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   876,916 |  1.140 |  0.400 |   245.000 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   666,667 |  1.500 |  1.500 |     1.500 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   621,118 |  1.610 |  1.200 |     3.300 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   602,410 |  1.660 |  0.900 |     4.200 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   370,165 |  2.701 |  0.500 |   532.300 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   104,253 |  9.592 |  0.500 |  1766.000 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    60,272 | 16.592 |  0.500 |  1766.000 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    60,027 | 16.659 |  0.500 |  1766.000 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    60,122 | 16.633 |  0.500 |  1766.000 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    60,146 | 16.626 |  0.500 |  1766.000 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    60,148 | 16.626 |  0.500 |  1766.000 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   222,222 |  4.500 |  4.500 |     4.500 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   543,478 |  1.840 |  1.000 |     4.500 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   661,376 |  1.512 |  0.900 |     8.100 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,368,738 |  0.731 |  0.300 |    11.300 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,163,873 |  0.859 |  0.300 |    46.300 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,163,873 |  0.859 |  0.300 |    46.300 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,163,873 |  0.859 |  0.300 |    46.300 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,163,873 |  0.859 |  0.300 |    46.300 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,163,873 |  0.859 |  0.300 |    46.300 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,163,873 |  0.859 |  0.300 |    46.300 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   197,056 |  5.075 |  1.800 |   121.200 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   199,352 |  5.016 |  1.800 |   121.200 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   199,575 |  5.011 |  1.800 |   121.200 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   199,629 |  5.009 |  1.800 |   121.200 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   199,629 |  5.009 |  1.800 |   121.200 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   303,030 |  3.300 |  3.300 |     3.300 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   341,297 |  2.930 |  2.600 |     3.300 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   323,939 |  3.087 |  1.700 |    22.600 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   271,510 |  3.683 |  1.100 |    41.400 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    73,031 | 13.693 |  1.100 |   863.100 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    44,085 | 22.683 |  1.100 | 12748.000 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    43,989 | 22.733 |  1.100 | 12748.000 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    44,072 | 22.690 |  1.100 | 12748.000 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    44,087 | 22.683 |  1.100 | 12748.000 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    44,088 | 22.682 |  1.100 | 12748.000 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   201,618 |  4.960 |  1.800 |   135.100 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   203,063 |  4.925 |  1.800 |   135.100 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   203,292 |  4.919 |  1.800 |   135.100 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   203,331 |  4.918 |  1.800 |   135.100 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   203,316 |  4.918 |  1.800 |   135.100 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    75,188 | 13.300 | 13.300 |    13.300 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   180,832 |  5.530 |  3.500 |    13.300 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   253,614 |  3.943 |  1.900 |    31.100 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   252,902 |  3.954 |  1.500 |  1012.700 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   321,839 |  3.107 |  1.500 |  2752.500 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   195,105 |  5.125 |  1.500 | 12183.600 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   193,633 |  5.164 |  1.500 | 12183.600 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   193,354 |  5.172 |  1.500 | 12183.600 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   193,164 |  5.177 |  1.500 | 12183.600 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   175,821 |  5.688 |  1.500 | 12183.600 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   285,714 |  3.500 |  3.500 |     3.500 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   260,417 |  3.840 |  3.300 |     5.800 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   248,077 |  4.031 |  2.000 |    47.200 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   205,318 |  4.870 |  1.600 |   533.500 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    69,487 | 14.391 |  1.600 |  5331.400 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    44,097 | 22.677 |  1.600 |  5331.400 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    43,923 | 22.767 |  1.600 |  5331.400 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    43,979 | 22.738 |  1.600 |  5331.400 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    43,994 | 22.730 |  1.600 |  5331.400 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    43,995 | 22.730 |  1.600 |  5331.400 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   333,333 |  3.000 |  3.000 |     3.000 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   284,900 |  3.510 |  3.000 |     5.400 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   287,109 |  3.483 |  1.800 |    31.100 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   318,421 |  3.140 |  1.400 |   292.200 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   335,661 |  2.979 |  1.400 |  4507.800 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   235,349 |  4.249 |  1.400 |  4507.800 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   232,343 |  4.304 |  1.400 |  4507.800 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   232,095 |  4.309 |  1.400 |  4507.800 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   232,077 |  4.309 |  1.400 |  4507.800 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   232,068 |  4.309 |  1.400 |  4507.800 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   714,286 |  1.400 |  1.400 |     1.400 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,470,588 |  0.680 |  0.400 |     1.700 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 3,424,658 |  0.292 |  0.100 |     1.700 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 3,200,000 |  0.313 |  0.100 |    22.700 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,806,545 |  0.356 |  0.100 |    96.900 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,598,815 |  0.625 |  0.100 |    96.900 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,589,978 |  0.629 |  0.100 |    96.900 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 1,589,460 |  0.629 |  0.100 |    96.900 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 1,588,697 |  0.629 |  0.100 |    96.900 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,566,833 |  0.638 |  0.100 |   176.300 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |     0.300 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,941,176 |  0.340 |  0.200 |     0.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,615,509 |  0.619 |  0.100 |     2.400 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   563,317 |  1.775 |  0.100 |    25.700 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    88,867 | 11.253 |  0.100 |   416.800 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    55,365 | 18.062 |  0.100 |   551.500 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    55,171 | 18.125 |  0.100 |   551.500 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    55,268 | 18.094 |  0.100 |   551.500 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    55,292 | 18.086 |  0.100 |   551.500 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    55,288 | 18.087 |  0.100 |   551.500 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |     0.300 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 3,125,000 |  0.320 |  0.200 |     0.600 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 6,097,561 |  0.164 |  0.100 |     0.600 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 5,586,592 |  0.179 |  0.100 |     5.800 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,883,948 |  0.257 |  0.100 |    38.700 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,053,144 |  0.487 |  0.100 |    38.700 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,038,809 |  0.490 |  0.100 |    38.700 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,038,881 |  0.490 |  0.100 |    38.700 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,039,154 |  0.490 |  0.100 |    38.700 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,032,748 |  0.492 |  0.100 |    38.700 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  17,361 |    57.600 |
| create   | —    |   0 | up        |     10 | A       |     1 |  34,965 |    28.600 |
| create   | —    |   0 | up        |    100 | A       |     1 |  13,643 |    73.300 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,995 |   333.900 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     346 |  2892.700 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,586 |   386.700 |
| create   | —    |   0 | down      |    100 | A       |     1 |   5,634 |   177.500 |
| create   | —    |   0 | down      |     10 | A       |     1 |  20,080 |    49.800 |
| create   | —    |   0 | down      |      1 | A       |     1 |  18,248 |    54.800 |
| create   | —    |   0 | down      |      0 | A       |     1 |  27,027 |    37.000 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   5,705 |   175.300 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  28,090 |    35.600 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   7,294 |   137.100 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     483 |  2070.000 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      29 | 34968.600 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      11 | 88257.200 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      13 | 75196.600 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      11 | 87927.000 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      11 | 90560.300 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  48,077 |    20.800 |
| values   | —    |   0 | up        |      1 | A       |     1 |  13,106 |    76.300 |
| values   | —    |   0 | up        |     10 | A       |     1 |  22,222 |    45.000 |
| values   | —    |   0 | up        |    100 | A       |     1 |   6,757 |   148.000 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     546 |  1830.100 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     122 |  8221.800 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     194 |  5147.200 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,023 |   977.500 |
| values   | —    |   0 | down      |     10 | A       |     1 |   9,363 |   106.800 |
| values   | —    |   0 | down      |      1 | A       |     1 |  33,003 |    30.300 |
| values   | —    |   0 | down      |      0 | A       |     1 |  31,847 |    31.400 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  84,430,848 |         9,867,080 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,562,432 |        10,014,456 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  77,758,464 |        10,656,032 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,786,176 |        15,596,560 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 302,891,008 |        64,599,624 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 398,106,624 |       109,765,456 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 401,403,904 |       114,576,816 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 402,444,288 |       115,011,744 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 403,275,776 |       115,081,232 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 402,804,736 |       114,912,368 |

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
