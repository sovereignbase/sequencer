# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:18:36.272Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | ------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |   8,305 |      120.403 |      120.403 |        120.403 |     0.000 | 0: 120.403   | 0: 120.403   |
| apply    | random | A       | scaleDown     |  9,999 |   9,136 |      109.458 |      109.458 |        109.458 |     0.000 | 0: 109.458   | 0: 109.458   |
| apply    | random | A       | fullLifecycle | 19,999 |   8,701 |      114.931 |      114.931 |        114.931 |     0.000 | 0: 114.931   | 0: 114.931   |
| create   | —      | A       | scaleUp       |      6 |     638 |     1567.467 |     1567.467 |       1567.467 |     0.000 | 0: 1567.467  | 0: 1567.467  |
| create   | —      | A       | scaleDown     |      5 |   5,569 |      179.560 |      179.560 |        179.560 |     0.000 | 0: 179.560   | 0: 179.560   |
| create   | —      | A       | fullLifecycle |     11 |   1,068 |      936.600 |      936.600 |        936.600 |     0.000 | 0: 936.600   | 0: 936.600   |
| insert   | head   | A       | scaleUp       |  5,000 | 178,664 |        5.597 |        5.597 |          5.597 |     0.000 | 0: 5.597     | 0: 5.597     |
| insert   | head   | A       | scaleDown     |      0 |       — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 | 178,664 |        5.597 |        5.597 |          5.597 |     0.000 | 0: 5.597     | 0: 5.597     |
| insert   | random | A       | scaleUp       | 10,000 |  22,649 |       44.152 |       44.152 |         44.152 |     0.000 | 0: 44.152    | 0: 44.152    |
| insert   | random | A       | scaleDown     | 10,000 |  22,656 |       44.139 |       44.139 |         44.139 |     0.000 | 0: 44.139    | 0: 44.139    |
| insert   | random | A       | fullLifecycle | 20,000 |  22,652 |       44.146 |       44.146 |         44.146 |     0.000 | 0: 44.146    | 0: 44.146    |
| insert   | tail   | A       | scaleUp       |  5,000 | 233,419 |        4.284 |        4.284 |          4.284 |     0.000 | 0: 4.284     | 0: 4.284     |
| insert   | tail   | A       | scaleDown     |      0 |       — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 233,419 |        4.284 |        4.284 |          4.284 |     0.000 | 0: 4.284     | 0: 4.284     |
| remove   | head   | A       | scaleUp       |      0 |       — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 | 111,100 |        9.001 |        9.001 |          9.001 |     0.000 | 0: 9.001     | 0: 9.001     |
| remove   | head   | A       | fullLifecycle |  5,000 | 111,100 |        9.001 |        9.001 |          9.001 |     0.000 | 0: 9.001     | 0: 9.001     |
| remove   | random | A       | scaleUp       | 10,000 |  15,164 |       65.946 |       65.946 |         65.946 |     0.000 | 0: 65.946    | 0: 65.946    |
| remove   | random | A       | scaleDown     | 10,000 |  16,708 |       59.850 |       59.850 |         59.850 |     0.000 | 0: 59.850    | 0: 59.850    |
| remove   | random | A       | fullLifecycle | 20,000 |  15,899 |       62.898 |       62.898 |         62.898 |     0.000 | 0: 62.898    | 0: 62.898    |
| remove   | tail   | A       | scaleUp       |      0 |       — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |  91,740 |       10.900 |       10.900 |         10.900 |     0.000 | 0: 10.900    | 0: 10.900    |
| remove   | tail   | A       | fullLifecycle |  5,000 |  91,740 |       10.900 |       10.900 |         10.900 |     0.000 | 0: 10.900    | 0: 10.900    |
| replace  | head   | A       | scaleUp       | 10,000 |  62,575 |       15.981 |       15.981 |         15.981 |     0.000 | 0: 15.981    | 0: 15.981    |
| replace  | head   | A       | scaleDown     | 10,000 |  95,087 |       10.517 |       10.517 |         10.517 |     0.000 | 0: 10.517    | 0: 10.517    |
| replace  | head   | A       | fullLifecycle | 20,000 |  75,479 |       13.249 |       13.249 |         13.249 |     0.000 | 0: 13.249    | 0: 13.249    |
| replace  | random | A       | scaleUp       | 10,000 |  16,095 |       62.133 |       62.133 |         62.133 |     0.000 | 0: 62.133    | 0: 62.133    |
| replace  | random | A       | scaleDown     | 10,000 |  17,626 |       56.734 |       56.734 |         56.734 |     0.000 | 0: 56.734    | 0: 56.734    |
| replace  | random | A       | fullLifecycle | 20,000 |  16,825 |       59.434 |       59.434 |         59.434 |     0.000 | 0: 59.434    | 0: 59.434    |
| replace  | tail   | A       | scaleUp       | 10,000 |  81,844 |       12.218 |       12.218 |         12.218 |     0.000 | 0: 12.218    | 0: 12.218    |
| replace  | tail   | A       | scaleDown     | 10,000 |  97,269 |       10.281 |       10.281 |         10.281 |     0.000 | 0: 10.281    | 0: 10.281    |
| replace  | tail   | A       | fullLifecycle | 20,000 |  88,892 |       11.250 |       11.250 |         11.250 |     0.000 | 0: 11.250    | 0: 11.250    |
| sequence | —      | A       | scaleUp       |      5 |      44 |    22774.320 |    22774.320 |      22774.320 |     0.000 | 0: 22774.320 | 0: 22774.320 |
| sequence | —      | A       | scaleDown     |      5 |      14 |    69989.980 |    69989.980 |      69989.980 |     0.000 | 0: 69989.980 | 0: 69989.980 |
| sequence | —      | A       | fullLifecycle |     10 |      22 |    46382.150 |    46382.150 |      46382.150 |     0.000 | 0: 46382.150 | 0: 46382.150 |
| value    | head   | A       | scaleUp       | 10,000 | 566,948 |        1.764 |        1.764 |          1.764 |     0.000 | 0: 1.764     | 0: 1.764     |
| value    | head   | A       | scaleDown     | 10,000 | 469,070 |        2.132 |        2.132 |          2.132 |     0.000 | 0: 2.132     | 0: 2.132     |
| value    | head   | A       | fullLifecycle | 20,000 | 513,385 |        1.948 |        1.948 |          1.948 |     0.000 | 0: 1.948     | 0: 1.948     |
| value    | random | A       | scaleUp       | 10,000 |  17,801 |       56.175 |       56.175 |         56.175 |     0.000 | 0: 56.175    | 0: 56.175    |
| value    | random | A       | scaleDown     | 10,000 |  22,139 |       45.170 |       45.170 |         45.170 |     0.000 | 0: 45.170    | 0: 45.170    |
| value    | random | A       | fullLifecycle | 20,000 |  19,735 |       50.673 |       50.673 |         50.673 |     0.000 | 0: 50.673    | 0: 50.673    |
| value    | tail   | A       | scaleUp       | 10,000 | 990,766 |        1.009 |        1.009 |          1.009 |     0.000 | 0: 1.009     | 0: 1.009     |
| value    | tail   | A       | scaleDown     | 10,000 | 860,482 |        1.162 |        1.162 |          1.162 |     0.000 | 0: 1.162     | 0: 1.162     |
| value    | tail   | A       | fullLifecycle | 20,000 | 921,039 |        1.086 |        1.086 |          1.086 |     0.000 | 0: 1.086     | 0: 1.086     |
| values   | —      | A       | scaleUp       |      5 |     146 |     6860.520 |     6860.520 |       6860.520 |     0.000 | 0: 6860.520  | 0: 6860.520  |
| values   | —      | A       | scaleDown     |      5 |   1,050 |      952.500 |      952.500 |        952.500 |     0.000 | 0: 952.500   | 0: 952.500   |
| values   | —      | A       | fullLifecycle |     10 |     256 |     3906.510 |     3906.510 |       3906.510 |     0.000 | 0: 3906.510  | 0: 3906.510  |

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

| Method  | case   | Run | direction | Strips |  Frames | Replica |  calls |   ops/sec |     avg |    min |       max |
| ------- | ------ | --: | --------- | -----: | ------: | ------- | -----: | --------: | ------: | -----: | --------: |
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    43,478 |  23.000 | 23.000 |    23.000 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    39,017 |  25.630 | 21.300 |    34.200 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    32,384 |  30.879 | 13.200 |   286.000 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    30,196 |  33.117 |  8.700 |  1693.800 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |     8,305 | 120.403 |  7.000 | 25813.100 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |     8,495 | 117.717 |  6.400 | 25813.100 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |     8,682 | 115.178 |  6.000 | 25813.100 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |     8,712 | 114.779 |  5.400 | 25813.100 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |     8,701 | 114.931 |  5.400 | 25813.100 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |     8,701 | 114.931 |  5.400 | 25813.100 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |       — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |    79,491 |  12.580 |  4.300 |    41.800 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   113,302 |   8.826 |  2.300 |   123.800 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   274,876 |   3.638 |  1.100 |   123.800 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   178,664 |   5.597 |  1.100 |  2041.700 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   178,664 |   5.597 |  1.100 |  2041.700 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   178,664 |   5.597 |  1.100 |  2041.700 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   178,664 |   5.597 |  1.100 |  2041.700 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   178,664 |   5.597 |  1.100 |  2041.700 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   178,664 |   5.597 |  1.100 |  2041.700 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   243,902 |   4.100 |  4.100 |     4.100 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   156,986 |   6.370 |  4.100 |    11.500 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   135,833 |   7.362 |  2.400 |    59.300 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    80,348 |  12.446 |  1.600 |  3676.000 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    22,649 |  44.152 |  1.600 |  6110.100 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    22,081 |  45.287 |  1.600 | 14450.600 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    22,564 |  44.319 |  1.600 | 14450.600 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    22,642 |  44.166 |  1.200 | 14450.600 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    22,651 |  44.148 |  1.200 | 14450.600 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    22,652 |  44.146 |  1.200 | 14450.600 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |    69,444 |  14.400 | 14.400 |    14.400 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   161,812 |   6.180 |  3.800 |    14.400 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   148,324 |   6.742 |  2.400 |    55.300 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   303,159 |   3.299 |  1.000 |    57.200 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   233,419 |   4.284 |  0.900 |   545.000 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   233,419 |   4.284 |  0.900 |   545.000 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   233,419 |   4.284 |  0.900 |   545.000 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   233,419 |   4.284 |  0.900 |   545.000 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   233,419 |   4.284 |  0.900 |   545.000 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   233,419 |   4.284 |  0.900 |   545.000 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |       — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |       — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |       — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |       — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |       — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   107,030 |   9.343 |  3.200 |   700.700 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   110,515 |   9.049 |  3.200 |   700.700 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   111,044 |   9.005 |  2.400 |   700.700 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   111,100 |   9.001 |  2.400 |   700.700 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   111,100 |   9.001 |  2.400 |   700.700 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   114,943 |   8.700 |  8.700 |     8.700 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |    82,988 |  12.050 |  8.700 |    20.200 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |    82,768 |  12.082 |  5.800 |    51.200 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    68,618 |  14.573 |  3.700 |   611.600 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    15,164 |  65.946 |  3.700 | 21419.500 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    15,459 |  64.686 |  3.400 | 47800.200 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    15,835 |  63.152 |  3.400 | 47800.200 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    15,892 |  62.926 |  2.400 | 47800.200 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    15,898 |  62.901 |  2.400 | 47800.200 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    15,899 |  62.898 |  2.400 | 47800.200 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |       — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |       — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |       — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |       — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |       — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |    87,578 |  11.418 |  3.100 | 12285.500 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |    91,299 |  10.953 |  3.100 | 12285.500 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |    91,686 |  10.907 |  2.400 | 12285.500 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |    91,730 |  10.902 |  2.400 | 12285.500 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |    91,740 |  10.900 |  2.400 | 12285.500 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    30,960 |  32.300 | 32.300 |    32.300 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    39,308 |  25.440 | 12.100 |   110.600 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |    61,854 |  16.167 |  7.200 |   145.600 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    96,805 |  10.330 |  3.600 |   145.600 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    62,575 |  15.981 |  3.300 | 11552.000 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    76,025 |  13.153 |  3.300 | 11552.000 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |    77,387 |  12.922 |  3.300 | 11552.000 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |    77,518 |  12.900 |  2.700 | 11552.000 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |    77,507 |  12.902 |  2.700 | 11552.000 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |    75,479 |  13.249 |  2.700 | 11552.000 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |    90,090 |  11.100 | 11.100 |    11.100 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |    55,188 |  18.120 | 11.100 |    61.800 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |    71,649 |  13.957 |  7.400 |    61.800 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    60,749 |  16.461 |  4.500 |   761.300 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    16,095 |  62.133 |  4.000 |  9518.000 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    16,397 |  60.985 |  3.900 | 20170.600 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    16,760 |  59.665 |  3.900 | 20170.600 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    16,818 |  59.460 |  2.800 | 20170.600 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    16,825 |  59.436 |  2.800 | 20170.600 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    16,825 |  59.434 |  2.800 | 20170.600 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   104,167 |   9.600 |  9.600 |     9.600 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |    72,833 |  13.730 |  9.600 |    21.000 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |    74,538 |  13.416 |  6.800 |    93.900 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    64,775 |  15.438 |  3.200 |  2664.900 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    81,844 |  12.218 |  3.200 |  2664.900 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    87,029 |  11.490 |  3.200 |  4938.900 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |    88,683 |  11.276 |  3.100 |  4938.900 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |    88,889 |  11.250 |  2.800 |  4938.900 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |    88,909 |  11.247 |  2.800 |  4938.900 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |    88,892 |  11.250 |  2.800 |  4938.900 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   227,273 |   4.400 |  4.400 |     4.400 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   346,021 |   2.890 |  1.500 |     8.300 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 |   680,735 |   1.469 |  0.500 |     8.300 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   726,111 |   1.377 |  0.400 |    69.200 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   566,948 |   1.764 |  0.400 |   533.600 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   506,270 |   1.975 |  0.300 |  1058.900 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   513,729 |   1.947 |  0.300 |  1058.900 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 |   514,996 |   1.942 |  0.300 |  1058.900 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 |   515,048 |   1.942 |  0.300 |  1058.900 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 |   513,385 |   1.948 |  0.300 |  1058.900 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,000,000 |   1.000 |  1.000 |     1.000 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 |   833,333 |   1.200 |  0.700 |     2.000 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 |   296,121 |   3.377 |  0.400 |   102.000 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   149,107 |   6.707 |  0.400 |   182.400 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    17,801 |  56.175 |  0.400 | 37093.700 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    19,187 |  52.118 |  0.400 | 37093.700 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    19,652 |  50.884 |  0.200 | 37093.700 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    19,725 |  50.697 |  0.200 | 37093.700 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    19,734 |  50.675 |  0.200 | 37093.700 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    19,735 |  50.673 |  0.200 | 37093.700 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,428,571 |   0.700 |  0.700 |     0.700 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 |   917,431 |   1.090 |  0.700 |     2.100 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 1,742,160 |   0.574 |  0.300 |     2.100 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,593,118 |   0.628 |  0.200 |    34.700 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   990,766 |   1.009 |  0.200 |   935.500 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   908,839 |   1.100 |  0.200 |   935.500 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   918,659 |   1.089 |  0.200 |   935.500 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   920,799 |   1.086 |  0.200 |   935.500 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   921,023 |   1.086 |  0.200 |   935.500 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   921,039 |   1.086 |  0.200 |   935.500 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |        avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | ---------: |
| create   | —    |   0 | up        |      1 | A       |     1 |   5,624 |    177.800 |
| create   | —    |   0 | up        |     10 | A       |     1 |  10,753 |     93.000 |
| create   | —    |   0 | up        |    100 | A       |     1 |   3,154 |    317.100 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   1,110 |    900.900 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     135 |   7434.800 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   1,598 |    625.900 |
| create   | —    |   0 | down      |    100 | A       |     1 |   7,716 |    129.600 |
| create   | —    |   0 | down      |     10 | A       |     1 |  19,608 |     51.000 |
| create   | —    |   0 | down      |      1 | A       |     1 |  21,978 |     45.500 |
| create   | —    |   0 | down      |      0 | A       |     1 |  21,834 |     45.800 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   1,676 |    596.700 |
| sequence | —    |   0 | up        |     10 | A       |     1 |   5,491 |    182.100 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   2,125 |    470.500 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     115 |   8667.200 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      10 | 103955.100 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      13 |  75707.900 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      10 |  97902.500 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      13 |  77394.600 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      10 |  98921.400 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  42,553 |     23.500 |
| values   | —    |   0 | up        |      1 | A       |     1 |   7,639 |    130.900 |
| values   | —    |   0 | up        |     10 | A       |     1 |   8,547 |    117.000 |
| values   | —    |   0 | up        |    100 | A       |     1 |   1,796 |    556.900 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |      94 |  10625.900 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      44 |  22871.900 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     269 |   3713.800 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,139 |    878.000 |
| values   | —    |   0 | down      |     10 | A       |     1 |   9,862 |    101.400 |
| values   | —    |   0 | down      |      1 | A       |     1 |  29,070 |     34.400 |
| values   | —    |   0 | down      |      0 | A       |     1 |  28,653 |     34.900 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  86,106,112 |         9,851,360 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  77,193,216 |        10,006,944 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,491,648 |        10,656,912 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 101,494,784 |        15,597,328 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 306,401,280 |        64,600,368 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 402,886,656 |       109,768,256 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 407,019,520 |       114,576,136 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 401,928,192 |       115,011,200 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 402,767,872 |       115,078,520 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 402,767,872 |       115,044,808 |

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
