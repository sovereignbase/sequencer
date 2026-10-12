# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:48:00.581Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    39,005 |       25.637 |       25.637 |         25.637 |     0.000 | 0: 25.637    | 0: 25.637    |
| apply    | random | A       | scaleDown     |  9,999 |    23,128 |       43.237 |       43.237 |         43.237 |     0.000 | 0: 43.237    | 0: 43.237    |
| apply    | random | A       | fullLifecycle | 19,999 |    29,039 |       34.437 |       34.437 |         34.437 |     0.000 | 0: 34.437    | 0: 34.437    |
| create   | —      | A       | scaleUp       |      6 |     1,667 |      599.950 |      599.950 |        599.950 |     0.000 | 0: 599.950   | 0: 599.950   |
| create   | —      | A       | scaleDown     |      5 |     6,430 |      155.520 |      155.520 |        155.520 |     0.000 | 0: 155.520   | 0: 155.520   |
| create   | —      | A       | fullLifecycle |     11 |     2,513 |      397.936 |      397.936 |        397.936 |     0.000 | 0: 397.936   | 0: 397.936   |
| insert   | head   | A       | scaleUp       |  5,000 |   759,140 |        1.317 |        1.317 |          1.317 |     0.000 | 0: 1.317     | 0: 1.317     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   759,140 |        1.317 |        1.317 |          1.317 |     0.000 | 0: 1.317     | 0: 1.317     |
| insert   | random | A       | scaleUp       | 10,000 |   103,543 |        9.658 |        9.658 |          9.658 |     0.000 | 0: 9.658     | 0: 9.658     |
| insert   | random | A       | scaleDown     | 10,000 |    56,236 |       17.782 |       17.782 |         17.782 |     0.000 | 0: 17.782    | 0: 17.782    |
| insert   | random | A       | fullLifecycle | 20,000 |    72,886 |       13.720 |       13.720 |         13.720 |     0.000 | 0: 13.720    | 0: 13.720    |
| insert   | tail   | A       | scaleUp       |  5,000 |   885,395 |        1.129 |        1.129 |          1.129 |     0.000 | 0: 1.129     | 0: 1.129     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   885,395 |        1.129 |        1.129 |          1.129 |     0.000 | 0: 1.129     | 0: 1.129     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   315,475 |        3.170 |        3.170 |          3.170 |     0.000 | 0: 3.170     | 0: 3.170     |
| remove   | head   | A       | fullLifecycle |  5,000 |   315,475 |        3.170 |        3.170 |          3.170 |     0.000 | 0: 3.170     | 0: 3.170     |
| remove   | random | A       | scaleUp       | 10,000 |    73,647 |       13.578 |       13.578 |         13.578 |     0.000 | 0: 13.578    | 0: 13.578    |
| remove   | random | A       | scaleDown     | 10,000 |    46,067 |       21.707 |       21.707 |         21.707 |     0.000 | 0: 21.707    | 0: 21.707    |
| remove   | random | A       | fullLifecycle | 20,000 |    56,680 |       17.643 |       17.643 |         17.643 |     0.000 | 0: 17.643    | 0: 17.643    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   320,877 |        3.116 |        3.116 |          3.116 |     0.000 | 0: 3.116     | 0: 3.116     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   320,877 |        3.116 |        3.116 |          3.116 |     0.000 | 0: 3.116     | 0: 3.116     |
| replace  | head   | A       | scaleUp       | 10,000 |   284,892 |        3.510 |        3.510 |          3.510 |     0.000 | 0: 3.510     | 0: 3.510     |
| replace  | head   | A       | scaleDown     | 10,000 |   210,130 |        4.759 |        4.759 |          4.759 |     0.000 | 0: 4.759     | 0: 4.759     |
| replace  | head   | A       | fullLifecycle | 20,000 |   241,865 |        4.135 |        4.135 |          4.135 |     0.000 | 0: 4.135     | 0: 4.135     |
| replace  | random | A       | scaleUp       | 10,000 |    71,983 |       13.892 |       13.892 |         13.892 |     0.000 | 0: 13.892    | 0: 13.892    |
| replace  | random | A       | scaleDown     | 10,000 |    43,492 |       22.993 |       22.993 |         22.993 |     0.000 | 0: 22.993    | 0: 22.993    |
| replace  | random | A       | fullLifecycle | 20,000 |    54,223 |       18.442 |       18.442 |         18.442 |     0.000 | 0: 18.442    | 0: 18.442    |
| replace  | tail   | A       | scaleUp       | 10,000 |   317,257 |        3.152 |        3.152 |          3.152 |     0.000 | 0: 3.152     | 0: 3.152     |
| replace  | tail   | A       | scaleDown     | 10,000 |   262,317 |        3.812 |        3.812 |          3.812 |     0.000 | 0: 3.812     | 0: 3.812     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   287,183 |        3.482 |        3.482 |          3.482 |     0.000 | 0: 3.482     | 0: 3.482     |
| sequence | —      | A       | scaleUp       |      5 |       159 |     6286.860 |     6286.860 |       6286.860 |     0.000 | 0: 6286.860  | 0: 6286.860  |
| sequence | —      | A       | scaleDown     |      5 |        20 |    50255.160 |    50255.160 |      50255.160 |     0.000 | 0: 50255.160 | 0: 50255.160 |
| sequence | —      | A       | fullLifecycle |     10 |        35 |    28271.010 |    28271.010 |      28271.010 |     0.000 | 0: 28271.010 | 0: 28271.010 |
| value    | head   | A       | scaleUp       | 10,000 | 2,864,345 |        0.349 |        0.349 |          0.349 |     0.000 | 0: 0.349     | 0: 0.349     |
| value    | head   | A       | scaleDown     | 10,000 | 1,776,010 |        0.563 |        0.563 |          0.563 |     0.000 | 0: 0.563     | 0: 0.563     |
| value    | head   | A       | fullLifecycle | 20,000 | 2,192,550 |        0.456 |        0.456 |          0.456 |     0.000 | 0: 0.456     | 0: 0.456     |
| value    | random | A       | scaleUp       | 10,000 |    93,611 |       10.682 |       10.682 |         10.682 |     0.000 | 0: 10.682    | 0: 10.682    |
| value    | random | A       | scaleDown     | 10,000 |    46,692 |       21.417 |       21.417 |         21.417 |     0.000 | 0: 21.417    | 0: 21.417    |
| value    | random | A       | fullLifecycle | 20,000 |    62,307 |       16.050 |       16.050 |         16.050 |     0.000 | 0: 16.050    | 0: 16.050    |
| value    | tail   | A       | scaleUp       | 10,000 | 3,908,693 |        0.256 |        0.256 |          0.256 |     0.000 | 0: 0.256     | 0: 0.256     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,182,501 |        0.458 |        0.458 |          0.458 |     0.000 | 0: 0.458     | 0: 0.458     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,801,003 |        0.357 |        0.357 |          0.357 |     0.000 | 0: 0.357     | 0: 0.357     |
| values   | —      | A       | scaleUp       |      5 |       472 |     2120.300 |     2120.300 |       2120.300 |     0.000 | 0: 2120.300  | 0: 2120.300  |
| values   | —      | A       | scaleDown     |      5 |     1,703 |      587.300 |      587.300 |        587.300 |     0.000 | 0: 587.300   | 0: 587.300   |
| values   | —      | A       | fullLifecycle |     10 |       739 |     1353.800 |     1353.800 |       1353.800 |     0.000 | 0: 1353.800  | 0: 1353.800  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    71,942 | 13.900 | 13.900 |    13.900 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    61,958 | 16.140 | 13.900 |    19.100 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    96,228 | 10.392 |  4.600 |    80.600 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    85,878 | 11.644 |  3.500 |  1135.900 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    39,005 | 25.637 |  3.500 |  2375.200 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    29,391 | 34.024 |  3.500 |  2375.200 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    29,101 | 34.363 |  3.500 |  2375.200 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    29,167 | 34.285 |  3.500 |  2375.200 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    29,039 | 34.437 |  3.500 |  3286.900 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    29,039 | 34.437 |  3.500 |  3286.900 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   146,199 |  6.840 |  2.600 |    21.200 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   407,830 |  2.452 |  1.200 |    21.200 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   678,887 |  1.473 |  0.800 |    26.800 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   759,140 |  1.317 |  0.800 |    45.600 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   759,140 |  1.317 |  0.800 |    45.600 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   759,140 |  1.317 |  0.800 |    45.600 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   759,140 |  1.317 |  0.800 |    45.600 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   759,140 |  1.317 |  0.800 |    45.600 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   759,140 |  1.317 |  0.800 |    45.600 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   370,370 |  2.700 |  2.700 |     2.700 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   298,507 |  3.350 |  2.600 |     6.200 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   359,712 |  2.780 |  1.600 |    34.200 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   282,271 |  3.543 |  0.900 |   388.100 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   103,543 |  9.658 |  0.900 |  1845.900 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    73,529 | 13.600 |  0.900 |  1845.900 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    72,704 | 13.754 |  0.900 |  1845.900 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    72,854 | 13.726 |  0.900 |  1845.900 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    72,883 | 13.721 |  0.900 |  1845.900 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    72,886 | 13.720 |  0.900 |  1845.900 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   192,308 |  5.200 |  5.200 |     5.200 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   320,513 |  3.120 |  2.500 |     5.200 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   458,295 |  2.182 |  1.100 |     9.600 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   677,323 |  1.476 |  0.700 |    55.600 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   885,395 |  1.129 |  0.600 |    73.600 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   885,395 |  1.129 |  0.600 |    73.600 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   885,395 |  1.129 |  0.600 |    73.600 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   885,395 |  1.129 |  0.600 |    73.600 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   885,395 |  1.129 |  0.600 |    73.600 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   885,395 |  1.129 |  0.600 |    73.600 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   321,449 |  3.111 |  2.000 |    46.200 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   315,435 |  3.170 |  2.000 |    46.200 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   315,476 |  3.170 |  2.000 |    46.200 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   315,475 |  3.170 |  2.000 |    46.200 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   315,475 |  3.170 |  2.000 |    46.200 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   178,571 |  5.600 |  5.600 |     5.600 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   142,857 |  7.000 |  5.600 |     8.000 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   221,680 |  4.511 |  2.200 |    16.900 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   226,249 |  4.420 |  1.600 |    47.100 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    73,647 | 13.578 |  1.600 |   809.600 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    57,139 | 17.501 |  1.600 |   809.600 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    56,530 | 17.690 |  1.600 |   809.600 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    56,660 | 17.649 |  1.600 |   809.600 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    56,678 | 17.643 |  1.600 |   809.600 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    56,680 | 17.643 |  1.600 |   809.600 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   329,212 |  3.038 |  1.900 |    49.900 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   321,867 |  3.107 |  1.900 |    49.900 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   321,193 |  3.113 |  1.900 |    49.900 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   320,872 |  3.117 |  1.900 |    49.900 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   320,877 |  3.116 |  1.900 |    49.900 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    53,476 | 18.700 | 18.700 |    18.700 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    91,491 | 10.930 |  8.200 |    19.300 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   181,061 |  5.523 |  2.700 |    29.400 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   271,820 |  3.679 |  2.300 |    56.900 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   284,892 |  3.510 |  2.200 |  1161.400 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   259,240 |  3.857 |  2.200 |  4941.600 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   255,330 |  3.917 |  2.200 |  4941.600 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   254,950 |  3.922 |  2.100 |  4941.600 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   254,612 |  3.928 |  2.100 |  4941.600 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   241,865 |  4.135 |  2.100 |  4941.600 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   133,333 |  7.500 |  7.500 |     7.500 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   116,414 |  8.590 |  7.500 |    10.000 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   174,125 |  5.743 |  2.900 |    51.800 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   181,759 |  5.502 |  2.200 |   133.200 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    71,983 | 13.892 |  2.200 |   866.200 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    54,642 | 18.301 |  2.200 |  6474.300 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    54,097 | 18.485 |  2.200 |  6474.300 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    54,203 | 18.449 |  2.200 |  6474.300 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    54,221 | 18.443 |  2.200 |  6474.300 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    54,223 | 18.442 |  2.200 |  6474.300 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   175,439 |  5.700 |  5.700 |     5.700 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   122,699 |  8.150 |  5.700 |    10.700 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   192,197 |  5.203 |  2.400 |    44.400 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   251,231 |  3.980 |  2.200 |   454.800 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   317,257 |  3.152 |  1.900 |   454.800 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   291,872 |  3.426 |  1.900 |  2428.900 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   287,301 |  3.481 |  1.900 |  2428.900 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   287,219 |  3.482 |  1.900 |  2428.900 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   287,186 |  3.482 |  1.900 |  2428.900 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   287,183 |  3.482 |  1.900 |  2428.900 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   434,783 |  2.300 |  2.300 |     2.300 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   714,286 |  1.400 |  1.000 |     2.700 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,141,328 |  0.467 |  0.200 |     2.700 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,528,445 |  0.396 |  0.200 |    25.800 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,864,345 |  0.349 |  0.100 |    34.000 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,253,321 |  0.444 |  0.100 |    34.000 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,223,737 |  0.450 |  0.100 |    34.000 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,223,804 |  0.450 |  0.100 |    34.000 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,222,679 |  0.450 |  0.100 |    34.000 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 2,192,550 |  0.456 |  0.100 |   124.100 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,428,571 |  0.700 |  0.700 |     0.700 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 1,176,471 |  0.850 |  0.600 |     1.300 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,177,856 |  0.849 |  0.200 |     3.000 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   483,209 |  2.070 |  0.100 |    31.000 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    93,611 | 10.682 |  0.100 |   125.200 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    62,494 | 16.002 |  0.100 | 31885.900 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    62,108 | 16.101 |  0.100 | 31885.900 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    62,284 | 16.056 |  0.100 | 31885.900 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    62,311 | 16.049 |  0.100 | 31885.900 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    62,307 | 16.050 |  0.100 | 31885.900 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |     0.600 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 1,492,537 |  0.670 |  0.500 |     1.100 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 3,921,569 |  0.255 |  0.100 |     1.100 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 4,587,156 |  0.218 |  0.100 |     3.900 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,908,693 |  0.256 |  0.100 |    47.000 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,837,303 |  0.352 |  0.100 |    47.000 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,807,958 |  0.356 |  0.100 |    47.000 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,810,189 |  0.356 |  0.100 |    47.000 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,810,427 |  0.356 |  0.100 |    47.000 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,801,003 |  0.357 |  0.100 |    47.000 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  15,038 |    66.500 |
| create   | —    |   0 | up        |     10 | A       |     1 |  20,833 |    48.000 |
| create   | —    |   0 | up        |    100 | A       |     1 |  13,831 |    72.300 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,662 |   375.600 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     363 |  2758.500 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   1,827 |   547.400 |
| create   | —    |   0 | down      |    100 | A       |     1 |   8,110 |   123.300 |
| create   | —    |   0 | down      |     10 | A       |     1 |  25,126 |    39.800 |
| create   | —    |   0 | down      |      1 | A       |     1 |  26,882 |    37.200 |
| create   | —    |   0 | down      |      0 | A       |     1 |  33,445 |    29.900 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   5,139 |   194.600 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  15,528 |    64.400 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   6,227 |   160.600 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     437 |  2286.300 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      35 | 28728.400 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      19 | 51409.200 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      18 | 55223.600 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      18 | 56887.800 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      11 | 87737.600 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  56,818 |    17.600 |
| values   | —    |   0 | up        |      1 | A       |     1 |   8,666 |   115.400 |
| values   | —    |   0 | up        |     10 | A       |     1 |  19,763 |    50.600 |
| values   | —    |   0 | up        |    100 | A       |     1 |   4,840 |   206.600 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     436 |  2294.300 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     126 |  7934.600 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     416 |  2406.600 |
| values   | —    |   0 | down      |    100 | A       |     1 |   2,431 |   411.400 |
| values   | —    |   0 | down      |     10 | A       |     1 |  16,807 |    59.500 |
| values   | —    |   0 | down      |      1 | A       |     1 |  29,070 |    34.400 |
| values   | —    |   0 | down      |      0 | A       |     1 |  40,650 |    24.600 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  83,558,400 |         9,857,040 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,906,496 |        10,004,360 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,442,496 |        10,654,592 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,839,424 |        15,595,048 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 305,033,216 |        64,598,088 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 401,285,120 |       109,763,984 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 406,364,160 |       114,575,344 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 407,810,048 |       115,010,104 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 408,231,936 |       115,079,592 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 408,137,728 |       114,910,728 |

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
