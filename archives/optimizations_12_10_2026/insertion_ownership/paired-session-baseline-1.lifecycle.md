# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:00:09.609Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    24,013 |       41.645 |       41.645 |         41.645 |     0.000 | 0: 41.645    | 0: 41.645    |
| apply    | random | A       | scaleDown     |  9,999 |    15,633 |       63.967 |       63.967 |         63.967 |     0.000 | 0: 63.967    | 0: 63.967    |
| apply    | random | A       | fullLifecycle | 19,999 |    18,938 |       52.805 |       52.805 |         52.805 |     0.000 | 0: 52.805    | 0: 52.805    |
| create   | —      | A       | scaleUp       |      6 |       514 |     1945.383 |     1945.383 |       1945.383 |     0.000 | 0: 1945.383  | 0: 1945.383  |
| create   | —      | A       | scaleDown     |      5 |     6,260 |      159.740 |      159.740 |        159.740 |     0.000 | 0: 159.740   | 0: 159.740   |
| create   | —      | A       | fullLifecycle |     11 |       882 |     1133.727 |     1133.727 |       1133.727 |     0.000 | 0: 1133.727  | 0: 1133.727  |
| insert   | head   | A       | scaleUp       |  5,000 |   597,914 |        1.672 |        1.672 |          1.672 |     0.000 | 0: 1.672     | 0: 1.672     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   597,914 |        1.672 |        1.672 |          1.672 |     0.000 | 0: 1.672     | 0: 1.672     |
| insert   | random | A       | scaleUp       | 10,000 |    58,007 |       17.239 |       17.239 |         17.239 |     0.000 | 0: 17.239    | 0: 17.239    |
| insert   | random | A       | scaleDown     | 10,000 |    42,041 |       23.787 |       23.787 |         23.787 |     0.000 | 0: 23.787    | 0: 23.787    |
| insert   | random | A       | fullLifecycle | 20,000 |    48,750 |       20.513 |       20.513 |         20.513 |     0.000 | 0: 20.513    | 0: 20.513    |
| insert   | tail   | A       | scaleUp       |  5,000 |   733,342 |        1.364 |        1.364 |          1.364 |     0.000 | 0: 1.364     | 0: 1.364     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   733,342 |        1.364 |        1.364 |          1.364 |     0.000 | 0: 1.364     | 0: 1.364     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   168,190 |        5.946 |        5.946 |          5.946 |     0.000 | 0: 5.946     | 0: 5.946     |
| remove   | head   | A       | fullLifecycle |  5,000 |   168,190 |        5.946 |        5.946 |          5.946 |     0.000 | 0: 5.946     | 0: 5.946     |
| remove   | random | A       | scaleUp       | 10,000 |    45,263 |       22.093 |       22.093 |         22.093 |     0.000 | 0: 22.093    | 0: 22.093    |
| remove   | random | A       | scaleDown     | 10,000 |    33,241 |       30.083 |       30.083 |         30.083 |     0.000 | 0: 30.083    | 0: 30.083    |
| remove   | random | A       | fullLifecycle | 20,000 |    38,331 |       26.088 |       26.088 |         26.088 |     0.000 | 0: 26.088    | 0: 26.088    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   243,728 |        4.103 |        4.103 |          4.103 |     0.000 | 0: 4.103     | 0: 4.103     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   243,728 |        4.103 |        4.103 |          4.103 |     0.000 | 0: 4.103     | 0: 4.103     |
| replace  | head   | A       | scaleUp       | 10,000 |   199,750 |        5.006 |        5.006 |          5.006 |     0.000 | 0: 5.006     | 0: 5.006     |
| replace  | head   | A       | scaleDown     | 10,000 |   153,588 |        6.511 |        6.511 |          6.511 |     0.000 | 0: 6.511     | 0: 6.511     |
| replace  | head   | A       | fullLifecycle | 20,000 |   173,653 |        5.759 |        5.759 |          5.759 |     0.000 | 0: 5.759     | 0: 5.759     |
| replace  | random | A       | scaleUp       | 10,000 |    44,536 |       22.454 |       22.454 |         22.454 |     0.000 | 0: 22.454    | 0: 22.454    |
| replace  | random | A       | scaleDown     | 10,000 |    32,150 |       31.104 |       31.104 |         31.104 |     0.000 | 0: 31.104    | 0: 31.104    |
| replace  | random | A       | fullLifecycle | 20,000 |    37,343 |       26.779 |       26.779 |         26.779 |     0.000 | 0: 26.779    | 0: 26.779    |
| replace  | tail   | A       | scaleUp       | 10,000 |   254,937 |        3.923 |        3.923 |          3.923 |     0.000 | 0: 3.923     | 0: 3.923     |
| replace  | tail   | A       | scaleDown     | 10,000 |   200,593 |        4.985 |        4.985 |          4.985 |     0.000 | 0: 4.985     | 0: 4.985     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   224,523 |        4.454 |        4.454 |          4.454 |     0.000 | 0: 4.454     | 0: 4.454     |
| sequence | —      | A       | scaleUp       |      5 |        52 |    19258.100 |    19258.100 |      19258.100 |     0.000 | 0: 19258.100 | 0: 19258.100 |
| sequence | —      | A       | scaleDown     |      5 |        14 |    71432.220 |    71432.220 |      71432.220 |     0.000 | 0: 71432.220 | 0: 71432.220 |
| sequence | —      | A       | fullLifecycle |     10 |        22 |    45345.160 |    45345.160 |      45345.160 |     0.000 | 0: 45345.160 | 0: 45345.160 |
| value    | head   | A       | scaleUp       | 10,000 | 1,898,326 |        0.527 |        0.527 |          0.527 |     0.000 | 0: 0.527     | 0: 0.527     |
| value    | head   | A       | scaleDown     | 10,000 | 1,101,625 |        0.908 |        0.908 |          0.908 |     0.000 | 0: 0.908     | 0: 0.908     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,394,185 |        0.717 |        0.717 |          0.717 |     0.000 | 0: 0.717     | 0: 0.717     |
| value    | random | A       | scaleUp       | 10,000 |    53,037 |       18.855 |       18.855 |         18.855 |     0.000 | 0: 18.855    | 0: 18.855    |
| value    | random | A       | scaleDown     | 10,000 |    38,804 |       25.771 |       25.771 |         25.771 |     0.000 | 0: 25.771    | 0: 25.771    |
| value    | random | A       | fullLifecycle | 20,000 |    44,817 |       22.313 |       22.313 |         22.313 |     0.000 | 0: 22.313    | 0: 22.313    |
| value    | tail   | A       | scaleUp       | 10,000 |   534,336 |        1.871 |        1.871 |          1.871 |     0.000 | 0: 1.871     | 0: 1.871     |
| value    | tail   | A       | scaleDown     | 10,000 | 1,553,760 |        0.644 |        0.644 |          0.644 |     0.000 | 0: 0.644     | 0: 0.644     |
| value    | tail   | A       | fullLifecycle | 20,000 |   795,203 |        1.258 |        1.258 |          1.258 |     0.000 | 0: 1.258     | 0: 1.258     |
| values   | —      | A       | scaleUp       |      5 |       310 |     3227.280 |     3227.280 |       3227.280 |     0.000 | 0: 3227.280  | 0: 3227.280  |
| values   | —      | A       | scaleDown     |      5 |     1,187 |      842.760 |      842.760 |        842.760 |     0.000 | 0: 842.760   | 0: 842.760   |
| values   | —      | A       | fullLifecycle |     10 |       491 |     2035.020 |     2035.020 |       2035.020 |     0.000 | 0: 2035.020  | 0: 2035.020  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |   142,857 |  7.000 |  7.000 |     7.000 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   132,275 |  7.560 |  6.800 |    10.500 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    90,563 | 11.042 |  5.600 |    93.300 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    82,918 | 12.060 |  3.000 |   373.700 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    24,013 | 41.645 |  3.000 |  4743.000 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    18,820 | 53.134 |  3.000 |  5559.600 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    18,976 | 52.698 |  3.000 |  5559.600 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    19,020 | 52.576 |  3.000 |  5559.600 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    18,938 | 52.805 |  3.000 |  5559.600 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    18,938 | 52.805 |  3.000 |  5559.600 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   238,095 |  4.200 |  1.100 |    14.600 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   453,309 |  2.206 |  1.100 |    14.600 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   719,942 |  1.389 |  0.500 |    37.500 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   597,914 |  1.672 |  0.500 |   230.600 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   597,914 |  1.672 |  0.500 |   230.600 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   597,914 |  1.672 |  0.500 |   230.600 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   597,914 |  1.672 |  0.500 |   230.600 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   597,914 |  1.672 |  0.500 |   230.600 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   597,914 |  1.672 |  0.500 |   230.600 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   666,667 |  1.500 |  1.500 |     1.500 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   564,972 |  1.770 |  1.300 |     3.400 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   365,764 |  2.734 |  1.100 |    16.200 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   254,039 |  3.936 |  0.600 |   513.300 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    58,007 | 17.239 |  0.600 |  6087.700 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    48,191 | 20.751 |  0.600 |  6087.700 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    48,611 | 20.571 |  0.600 |  6087.700 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    48,727 | 20.522 |  0.600 |  6087.700 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    48,748 | 20.514 |  0.600 |  6087.700 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    48,750 | 20.513 |  0.600 |  6087.700 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   222,222 |  4.500 |  4.500 |     4.500 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   510,204 |  1.960 |  1.200 |     4.500 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   468,165 |  2.136 |  1.000 |    10.000 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   667,022 |  1.499 |  0.400 |    64.700 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   733,342 |  1.364 |  0.400 |    64.700 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   733,342 |  1.364 |  0.400 |    64.700 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   733,342 |  1.364 |  0.400 |    64.700 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   733,342 |  1.364 |  0.400 |    64.700 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   733,342 |  1.364 |  0.400 |    64.700 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   733,342 |  1.364 |  0.400 |    64.700 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   161,501 |  6.192 |  1.800 |  8978.000 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   167,528 |  5.969 |  1.800 |  8978.000 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   168,105 |  5.949 |  1.600 |  8978.000 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   168,190 |  5.946 |  1.600 |  8978.000 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   168,190 |  5.946 |  1.600 |  8978.000 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   370,370 |  2.700 |  2.700 |     2.700 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   277,008 |  3.610 |  2.700 |     7.400 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   182,582 |  5.477 |  2.700 |    80.800 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   161,005 |  6.211 |  1.400 |   967.800 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    45,263 | 22.093 |  1.400 |  2767.600 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    37,979 | 26.330 |  1.400 |  2767.600 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    38,234 | 26.154 |  1.400 |  2767.600 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    38,316 | 26.098 |  1.400 |  2767.600 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    38,330 | 26.089 |  1.400 |  2767.600 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    38,331 | 26.088 |  1.400 |  2767.600 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   241,741 |  4.137 |  1.700 |   115.000 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   243,170 |  4.112 |  1.700 |   115.000 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   243,705 |  4.103 |  1.500 |   115.000 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   243,759 |  4.102 |  1.500 |   115.000 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   243,728 |  4.103 |  1.500 |   115.000 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    68,493 | 14.600 | 14.600 |    14.600 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   155,521 |  6.430 |  3.800 |    16.000 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   188,679 |  5.300 |  3.300 |    32.400 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   177,355 |  5.638 |  1.700 |  1530.200 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   199,750 |  5.006 |  1.700 |  5575.000 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   186,105 |  5.373 |  1.700 |  8486.400 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   186,451 |  5.363 |  1.700 |  8486.400 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   186,313 |  5.367 |  1.700 |  8486.400 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   186,134 |  5.372 |  1.700 |  8486.400 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   173,653 |  5.759 |  1.700 |  8486.400 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   285,714 |  3.500 |  3.500 |     3.500 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   259,740 |  3.850 |  3.300 |     4.800 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   185,632 |  5.387 |  3.200 |    20.400 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   158,228 |  6.320 |  1.700 |   154.900 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    44,536 | 22.454 |  1.700 | 13428.000 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    37,076 | 26.972 |  1.700 | 13428.000 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    37,238 | 26.854 |  1.700 | 13428.000 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    37,328 | 26.790 |  1.700 | 13428.000 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    37,342 | 26.780 |  1.700 | 13428.000 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    37,343 | 26.779 |  1.700 | 13428.000 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   370,370 |  2.700 |  2.700 |     2.700 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   268,097 |  3.730 |  2.700 |     5.300 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   187,021 |  5.347 |  2.700 |    54.900 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   231,481 |  4.320 |  1.500 |   445.800 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   254,937 |  3.923 |  1.500 |   781.000 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   224,879 |  4.447 |  1.500 |  3230.800 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   224,690 |  4.451 |  1.500 |  3230.800 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   224,604 |  4.452 |  1.500 |  3230.800 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   224,608 |  4.452 |  1.500 |  3230.800 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   224,523 |  4.454 |  1.500 |  3230.800 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   625,000 |  1.600 |  1.600 |     1.600 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,315,789 |  0.760 |  0.400 |     2.100 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,257,336 |  0.443 |  0.200 |     2.100 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,035,002 |  0.491 |  0.100 |    67.100 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,898,326 |  0.527 |  0.100 |    67.100 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,395,981 |  0.716 |  0.100 |   494.700 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,404,742 |  0.712 |  0.100 |   494.700 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 1,404,976 |  0.712 |  0.100 |   494.700 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 1,404,621 |  0.712 |  0.100 |   494.700 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,394,185 |  0.717 |  0.100 |   494.700 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 5,000,000 |  0.200 |  0.200 |     0.200 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,777,778 |  0.360 |  0.200 |     0.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,127,396 |  0.887 |  0.100 |     3.100 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   393,809 |  2.539 |  0.100 |    40.700 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    53,037 | 18.855 |  0.100 |  4053.100 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    44,237 | 22.605 |  0.100 |  4859.400 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    44,673 | 22.385 |  0.100 |  4859.400 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    44,798 | 22.322 |  0.100 |  4859.400 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    44,818 | 22.312 |  0.100 |  4859.400 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    44,817 | 22.313 |  0.100 |  4859.400 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |     0.300 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 2,702,703 |  0.370 |  0.300 |     0.700 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 4,329,004 |  0.231 |  0.100 |     0.700 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 4,224,757 |  0.237 |  0.100 |     8.200 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   534,336 |  1.871 |  0.100 | 13705.300 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   769,995 |  1.299 |  0.100 | 13705.300 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   792,939 |  1.261 |  0.100 | 13705.300 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   795,521 |  1.257 |  0.100 | 13705.300 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   795,803 |  1.257 |  0.100 | 13705.300 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   795,203 |  1.258 |  0.100 | 13705.300 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |        avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | ---------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  17,825 |     56.100 |
| create   | —    |   0 | up        |     10 | A       |     1 |  21,413 |     46.700 |
| create   | —    |   0 | up        |    100 | A       |     1 |   8,389 |    119.200 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   1,853 |    539.600 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |      93 |  10724.200 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,231 |    448.200 |
| create   | —    |   0 | down      |    100 | A       |     1 |   5,444 |    183.700 |
| create   | —    |   0 | down      |     10 | A       |     1 |  14,556 |     68.700 |
| create   | —    |   0 | down      |      1 | A       |     1 |  16,502 |     60.600 |
| create   | —    |   0 | down      |      0 | A       |     1 |  26,667 |     37.500 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   5,432 |    184.100 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  16,474 |     60.700 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   1,710 |    584.700 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     205 |   4877.800 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      11 |  90583.200 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      14 |  71797.300 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      11 |  91821.100 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      12 |  83168.900 |
| sequence | —    |   0 | down      |      1 | A       |     1 |       9 | 110354.800 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  52,632 |     19.000 |
| values   | —    |   0 | up        |      1 | A       |     1 |  14,085 |     71.000 |
| values   | —    |   0 | up        |     10 | A       |     1 |  21,231 |     47.100 |
| values   | —    |   0 | up        |    100 | A       |     1 |   2,015 |    496.300 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     294 |   3401.700 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      83 |  12120.300 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     310 |   3223.700 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,208 |    827.900 |
| values   | —    |   0 | down      |     10 | A       |     1 |  11,442 |     87.400 |
| values   | —    |   0 | down      |      1 | A       |     1 |  21,368 |     46.800 |
| values   | —    |   0 | down      |      0 | A       |     1 |  35,714 |     28.000 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  83,513,344 |         9,859,520 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,907,072 |        10,006,840 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  76,804,096 |        10,657,096 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,155,392 |        15,597,440 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 304,271,360 |        64,600,360 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 401,190,912 |       109,766,208 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 406,478,848 |       114,577,736 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 405,499,904 |       115,012,496 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 406,749,184 |       115,079,512 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 407,330,816 |       114,913,192 |

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
