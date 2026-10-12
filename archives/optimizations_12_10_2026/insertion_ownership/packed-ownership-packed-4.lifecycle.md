# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:19:51.545Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    16,012 |       62.451 |       62.451 |         62.451 |     0.000 | 0: 62.451    | 0: 62.451    |
| apply    | random | A       | scaleDown     |  9,999 |    10,683 |       93.609 |       93.609 |         93.609 |     0.000 | 0: 93.609    | 0: 93.609    |
| apply    | random | A       | fullLifecycle | 19,999 |    12,816 |       78.029 |       78.029 |         78.029 |     0.000 | 0: 78.029    | 0: 78.029    |
| create   | —      | A       | scaleUp       |      6 |       745 |     1341.783 |     1341.783 |       1341.783 |     0.000 | 0: 1341.783  | 0: 1341.783  |
| create   | —      | A       | scaleDown     |      5 |     1,352 |      739.480 |      739.480 |        739.480 |     0.000 | 0: 739.480   | 0: 739.480   |
| create   | —      | A       | fullLifecycle |     11 |       936 |     1068.009 |     1068.009 |       1068.009 |     0.000 | 0: 1068.009  | 0: 1068.009  |
| insert   | head   | A       | scaleUp       |  5,000 |   386,823 |        2.585 |        2.585 |          2.585 |     0.000 | 0: 2.585     | 0: 2.585     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   386,823 |        2.585 |        2.585 |          2.585 |     0.000 | 0: 2.585     | 0: 2.585     |
| insert   | random | A       | scaleUp       | 10,000 |    44,439 |       22.503 |       22.503 |         22.503 |     0.000 | 0: 22.503    | 0: 22.503    |
| insert   | random | A       | scaleDown     | 10,000 |    28,902 |       34.599 |       34.599 |         34.599 |     0.000 | 0: 34.599    | 0: 34.599    |
| insert   | random | A       | fullLifecycle | 20,000 |    35,025 |       28.551 |       28.551 |         28.551 |     0.000 | 0: 28.551    | 0: 28.551    |
| insert   | tail   | A       | scaleUp       |  5,000 |   486,713 |        2.055 |        2.055 |          2.055 |     0.000 | 0: 2.055     | 0: 2.055     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   486,713 |        2.055 |        2.055 |          2.055 |     0.000 | 0: 2.055     | 0: 2.055     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   139,573 |        7.165 |        7.165 |          7.165 |     0.000 | 0: 7.165     | 0: 7.165     |
| remove   | head   | A       | fullLifecycle |  5,000 |   139,573 |        7.165 |        7.165 |          7.165 |     0.000 | 0: 7.165     | 0: 7.165     |
| remove   | random | A       | scaleUp       | 10,000 |    27,632 |       36.190 |       36.190 |         36.190 |     0.000 | 0: 36.190    | 0: 36.190    |
| remove   | random | A       | scaleDown     | 10,000 |    21,959 |       45.539 |       45.539 |         45.539 |     0.000 | 0: 45.539    | 0: 45.539    |
| remove   | random | A       | fullLifecycle | 20,000 |    24,471 |       40.865 |       40.865 |         40.865 |     0.000 | 0: 40.865    | 0: 40.865    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   146,870 |        6.809 |        6.809 |          6.809 |     0.000 | 0: 6.809     | 0: 6.809     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   146,870 |        6.809 |        6.809 |          6.809 |     0.000 | 0: 6.809     | 0: 6.809     |
| replace  | head   | A       | scaleUp       | 10,000 |   129,478 |        7.723 |        7.723 |          7.723 |     0.000 | 0: 7.723     | 0: 7.723     |
| replace  | head   | A       | scaleDown     | 10,000 |   101,701 |        9.833 |        9.833 |          9.833 |     0.000 | 0: 9.833     | 0: 9.833     |
| replace  | head   | A       | fullLifecycle | 20,000 |   113,921 |        8.778 |        8.778 |          8.778 |     0.000 | 0: 8.778     | 0: 8.778     |
| replace  | random | A       | scaleUp       | 10,000 |    30,208 |       33.104 |       33.104 |         33.104 |     0.000 | 0: 33.104    | 0: 33.104    |
| replace  | random | A       | scaleDown     | 10,000 |    22,544 |       44.357 |       44.357 |         44.357 |     0.000 | 0: 44.357    | 0: 44.357    |
| replace  | random | A       | fullLifecycle | 20,000 |    25,819 |       38.730 |       38.730 |         38.730 |     0.000 | 0: 38.730    | 0: 38.730    |
| replace  | tail   | A       | scaleUp       | 10,000 |   149,522 |        6.688 |        6.688 |          6.688 |     0.000 | 0: 6.688     | 0: 6.688     |
| replace  | tail   | A       | scaleDown     | 10,000 |   127,935 |        7.816 |        7.816 |          7.816 |     0.000 | 0: 7.816     | 0: 7.816     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   137,889 |        7.252 |        7.252 |          7.252 |     0.000 | 0: 7.252     | 0: 7.252     |
| sequence | —      | A       | scaleUp       |      5 |        81 |    12335.200 |    12335.200 |      12335.200 |     0.000 | 0: 12335.200 | 0: 12335.200 |
| sequence | —      | A       | scaleDown     |      5 |        13 |    79288.060 |    79288.060 |      79288.060 |     0.000 | 0: 79288.060 | 0: 79288.060 |
| sequence | —      | A       | fullLifecycle |     10 |        22 |    45811.630 |    45811.630 |      45811.630 |     0.000 | 0: 45811.630 | 0: 45811.630 |
| value    | head   | A       | scaleUp       | 10,000 |   972,763 |        1.028 |        1.028 |          1.028 |     0.000 | 0: 1.028     | 0: 1.028     |
| value    | head   | A       | scaleDown     | 10,000 |   690,884 |        1.447 |        1.447 |          1.447 |     0.000 | 0: 1.447     | 0: 1.447     |
| value    | head   | A       | fullLifecycle | 20,000 |   807,944 |        1.238 |        1.238 |          1.238 |     0.000 | 0: 1.238     | 0: 1.238     |
| value    | random | A       | scaleUp       | 10,000 |    37,451 |       26.702 |       26.702 |         26.702 |     0.000 | 0: 26.702    | 0: 26.702    |
| value    | random | A       | scaleDown     | 10,000 |    26,972 |       37.075 |       37.075 |         37.075 |     0.000 | 0: 37.075    | 0: 37.075    |
| value    | random | A       | fullLifecycle | 20,000 |    31,360 |       31.888 |       31.888 |         31.888 |     0.000 | 0: 31.888    | 0: 31.888    |
| value    | tail   | A       | scaleUp       | 10,000 | 1,554,968 |        0.643 |        0.643 |          0.643 |     0.000 | 0: 0.643     | 0: 0.643     |
| value    | tail   | A       | scaleDown     | 10,000 |   996,860 |        1.003 |        1.003 |          1.003 |     0.000 | 0: 1.003     | 0: 1.003     |
| value    | tail   | A       | fullLifecycle | 20,000 | 1,214,882 |        0.823 |        0.823 |          0.823 |     0.000 | 0: 0.823     | 0: 0.823     |
| values   | —      | A       | scaleUp       |      5 |       234 |     4273.860 |     4273.860 |       4273.860 |     0.000 | 0: 4273.860  | 0: 4273.860  |
| values   | —      | A       | scaleDown     |      5 |       724 |     1381.980 |     1381.980 |       1381.980 |     0.000 | 0: 1381.980  | 0: 1381.980  |
| values   | —      | A       | fullLifecycle |     10 |       354 |     2827.920 |     2827.920 |       2827.920 |     0.000 | 0: 2827.920  | 0: 2827.920  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    54,054 | 18.500 | 18.500 |    18.500 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    54,377 | 18.390 | 17.200 |    22.600 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    51,002 | 19.607 |  9.800 |   135.600 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    34,048 | 29.370 |  6.700 |  1238.400 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    16,012 | 62.451 |  6.000 |  5210.000 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    12,841 | 77.874 |  6.000 |  5210.000 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    12,800 | 78.125 |  5.500 |  5210.000 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    12,841 | 77.878 |  5.100 |  5210.000 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    12,816 | 78.029 |  5.100 |  5210.000 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    12,816 | 78.029 |  5.100 |  5210.000 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   161,290 |  6.200 |  2.900 |    16.400 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   251,636 |  3.974 |  2.500 |    16.400 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   352,684 |  2.835 |  1.000 |    37.100 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   386,823 |  2.585 |  1.000 |   125.800 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   386,823 |  2.585 |  1.000 |   125.800 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   386,823 |  2.585 |  1.000 |   125.800 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   386,823 |  2.585 |  1.000 |   125.800 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   386,823 |  2.585 |  1.000 |   125.800 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   386,823 |  2.585 |  1.000 |   125.800 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   277,778 |  3.600 |  3.600 |     3.600 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   240,964 |  4.150 |  3.100 |     8.300 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   203,915 |  4.904 |  2.900 |    13.100 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   120,900 |  8.271 |  1.400 |   755.200 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    44,439 | 22.503 |  1.400 |  3531.000 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    34,916 | 28.640 |  1.400 |  8617.100 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    34,897 | 28.656 |  1.400 |  8617.100 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    35,009 | 28.564 |  1.200 |  8617.100 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    35,023 | 28.552 |  1.200 |  8617.100 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    35,025 | 28.551 |  1.200 |  8617.100 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   151,515 |  6.600 |  6.600 |     6.600 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   265,957 |  3.760 |  2.800 |     6.600 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   246,792 |  4.052 |  2.300 |    21.600 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   407,731 |  2.453 |  0.800 |    87.400 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   486,713 |  2.055 |  0.800 |    87.400 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   486,713 |  2.055 |  0.800 |    87.400 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   486,713 |  2.055 |  0.800 |    87.400 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   486,713 |  2.055 |  0.800 |    87.400 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   486,713 |  2.055 |  0.800 |    87.400 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   486,713 |  2.055 |  0.800 |    87.400 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   138,636 |  7.213 |  2.800 |   142.100 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   138,793 |  7.205 |  2.500 |   142.100 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   139,525 |  7.167 |  2.300 |   142.100 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   139,573 |  7.165 |  2.300 |   142.100 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   139,573 |  7.165 |  2.300 |   142.100 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   151,515 |  6.600 |  6.600 |     6.600 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   129,702 |  7.710 |  6.600 |     9.000 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   124,922 |  8.005 |  4.500 |    23.600 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    77,302 | 12.936 |  2.600 |  1333.100 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    27,632 | 36.190 |  2.200 | 21449.400 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    24,369 | 41.037 |  2.200 | 21449.400 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    24,379 | 41.019 |  2.200 | 21449.400 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    24,461 | 40.881 |  2.200 | 21449.400 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    24,470 | 40.866 |  2.200 | 21449.400 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    24,471 | 40.865 |  2.200 | 21449.400 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   146,268 |  6.837 |  2.800 |   155.900 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   146,266 |  6.837 |  2.700 |   155.900 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   146,886 |  6.808 |  2.200 |   155.900 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   146,889 |  6.808 |  2.200 |   155.900 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   146,870 |  6.809 |  2.200 |   155.900 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    41,841 | 23.900 | 23.900 |    23.900 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    80,386 | 12.440 |  8.700 |    23.900 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |    98,464 | 10.156 |  5.200 |    84.500 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    90,182 | 11.089 |  3.300 |  2648.600 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   129,478 |  7.723 |  2.700 |  4796.200 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   122,116 |  8.189 |  2.700 |  8514.000 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   122,051 |  8.193 |  2.700 |  8514.000 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   122,236 |  8.181 |  2.600 |  8514.000 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   122,123 |  8.188 |  2.600 |  8514.000 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   113,921 |  8.778 |  2.600 | 11799.800 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   119,048 |  8.400 |  8.400 |     8.400 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   105,932 |  9.440 |  8.400 |    11.200 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   108,601 |  9.208 |  5.300 |    25.200 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    76,109 | 13.139 |  3.400 |   213.500 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    30,208 | 33.104 |  3.400 |  2807.000 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    25,659 | 38.972 |  3.200 |  5636.400 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    25,727 | 38.870 |  3.200 |  5636.400 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    25,809 | 38.746 |  2.700 |  5636.400 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    25,819 | 38.731 |  2.700 |  5636.400 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    25,819 | 38.730 |  2.700 |  5636.400 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   140,845 |  7.100 |  7.100 |     7.100 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   110,988 |  9.010 |  7.100 |    10.900 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   104,091 |  9.607 |  4.800 |    73.700 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   114,342 |  8.746 |  3.100 |   521.300 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   149,522 |  6.688 |  2.700 |  3518.700 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   138,790 |  7.205 |  2.700 |  5286.300 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   137,612 |  7.267 |  2.700 |  5286.300 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   137,884 |  7.252 |  2.600 |  5286.300 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   137,896 |  7.252 |  2.600 |  5286.300 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   137,889 |  7.252 |  2.600 |  5286.300 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   400,000 |  2.500 |  2.500 |     2.500 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   714,286 |  1.400 |  1.000 |     2.900 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 1,240,695 |  0.806 |  0.400 |     2.900 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   744,823 |  1.343 |  0.400 |    94.000 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   972,763 |  1.028 |  0.300 |    94.000 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   809,144 |  1.236 |  0.300 |    94.000 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   811,516 |  1.232 |  0.300 |    94.000 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 |   813,266 |  1.230 |  0.200 |    94.000 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 |   813,070 |  1.230 |  0.200 |    94.000 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 |   807,944 |  1.238 |  0.200 |   157.300 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,428,571 |  0.700 |  0.700 |     0.700 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 1,136,364 |  0.880 |  0.600 |     1.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 |   650,195 |  1.538 |  0.300 |     6.400 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   159,375 |  6.274 |  0.300 |   173.700 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    37,451 | 26.702 |  0.300 |   593.500 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    31,278 | 31.972 |  0.200 |   593.500 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    31,237 | 32.013 |  0.200 |  1445.100 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    31,347 | 31.901 |  0.200 |  1445.100 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    31,361 | 31.887 |  0.200 |  1445.100 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    31,360 | 31.888 |  0.200 |  1445.100 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |     0.600 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 1,250,000 |  0.800 |  0.600 |     1.500 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 2,105,263 |  0.475 |  0.200 |     7.300 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,456,452 |  0.687 |  0.200 |   153.700 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,554,968 |  0.643 |  0.200 |   171.200 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,210,075 |  0.826 |  0.200 |   171.200 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,214,474 |  0.823 |  0.200 |   171.200 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 1,217,388 |  0.821 |  0.200 |   171.200 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 1,217,677 |  0.821 |  0.200 |   171.200 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 1,214,882 |  0.823 |  0.200 |   171.200 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |        avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | ---------: |
| create   | —    |   0 | up        |      1 | A       |     1 |   6,452 |    155.000 |
| create   | —    |   0 | up        |     10 | A       |     1 |  12,346 |     81.000 |
| create   | —    |   0 | up        |    100 | A       |     1 |   7,107 |    140.700 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   1,760 |    568.100 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     149 |   6723.900 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |     294 |   3406.600 |
| create   | —    |   0 | down      |    100 | A       |     1 |   8,143 |    122.800 |
| create   | —    |   0 | down      |     10 | A       |     1 |  19,455 |     51.400 |
| create   | —    |   0 | down      |      1 | A       |     1 |  16,207 |     61.700 |
| create   | —    |   0 | down      |      0 | A       |     1 |  18,215 |     54.900 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   2,169 |    461.100 |
| sequence | —    |   0 | up        |     10 | A       |     1 |   5,656 |    176.800 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   2,996 |    333.800 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     297 |   3363.000 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      17 |  57341.300 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      10 | 104039.200 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      10 | 104647.700 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      10 | 100237.200 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      11 |  87488.900 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  36,630 |     27.300 |
| values   | —    |   0 | up        |      1 | A       |     1 |   6,120 |    163.400 |
| values   | —    |   0 | up        |     10 | A       |     1 |   6,954 |    143.800 |
| values   | —    |   0 | up        |    100 | A       |     1 |   2,545 |    393.000 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     175 |   5705.800 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      67 |  14963.300 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     174 |   5762.700 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,018 |    982.800 |
| values   | —    |   0 | down      |     10 | A       |     1 |  10,111 |     98.900 |
| values   | —    |   0 | down      |      1 | A       |     1 |  37,594 |     26.600 |
| values   | —    |   0 | down      |      0 | A       |     1 |  25,707 |     38.900 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  82,558,976 |         9,858,904 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  74,956,800 |        10,014,472 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,073,856 |        10,656,728 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 |  99,594,240 |        15,597,096 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 306,651,136 |        64,597,096 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 395,264,000 |       109,763,040 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 399,413,248 |       114,571,784 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 399,048,704 |       115,011,728 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 399,933,440 |       115,076,176 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 399,958,016 |       114,909,784 |

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
