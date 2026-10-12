# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:48:24.805Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    37,640 |       26.568 |       26.568 |         26.568 |     0.000 | 0: 26.568    | 0: 26.568    |
| apply    | random | A       | scaleDown     |  9,999 |    25,491 |       39.229 |       39.229 |         39.229 |     0.000 | 0: 39.229    | 0: 39.229    |
| apply    | random | A       | fullLifecycle | 19,999 |    30,397 |       32.898 |       32.898 |         32.898 |     0.000 | 0: 32.898    | 0: 32.898    |
| create   | —      | A       | scaleUp       |      6 |     1,620 |      617.317 |      617.317 |        617.317 |     0.000 | 0: 617.317   | 0: 617.317   |
| create   | —      | A       | scaleDown     |      5 |     8,467 |      118.100 |      118.100 |        118.100 |     0.000 | 0: 118.100   | 0: 118.100   |
| create   | —      | A       | fullLifecycle |     11 |     2,561 |      390.400 |      390.400 |        390.400 |     0.000 | 0: 390.400   | 0: 390.400   |
| insert   | head   | A       | scaleUp       |  5,000 |   804,868 |        1.242 |        1.242 |          1.242 |     0.000 | 0: 1.242     | 0: 1.242     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   804,868 |        1.242 |        1.242 |          1.242 |     0.000 | 0: 1.242     | 0: 1.242     |
| insert   | random | A       | scaleUp       | 10,000 |   101,779 |        9.825 |        9.825 |          9.825 |     0.000 | 0: 9.825     | 0: 9.825     |
| insert   | random | A       | scaleDown     | 10,000 |    62,753 |       15.936 |       15.936 |         15.936 |     0.000 | 0: 15.936    | 0: 15.936    |
| insert   | random | A       | fullLifecycle | 20,000 |    77,637 |       12.880 |       12.880 |         12.880 |     0.000 | 0: 12.880    | 0: 12.880    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,037,517 |        0.964 |        0.964 |          0.964 |     0.000 | 0: 0.964     | 0: 0.964     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,037,517 |        0.964 |        0.964 |          0.964 |     0.000 | 0: 0.964     | 0: 0.964     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   395,961 |        2.526 |        2.526 |          2.526 |     0.000 | 0: 2.526     | 0: 2.526     |
| remove   | head   | A       | fullLifecycle |  5,000 |   395,961 |        2.526 |        2.526 |          2.526 |     0.000 | 0: 2.526     | 0: 2.526     |
| remove   | random | A       | scaleUp       | 10,000 |    73,177 |       13.665 |       13.665 |         13.665 |     0.000 | 0: 13.665    | 0: 13.665    |
| remove   | random | A       | scaleDown     | 10,000 |    51,617 |       19.373 |       19.373 |         19.373 |     0.000 | 0: 19.373    | 0: 19.373    |
| remove   | random | A       | fullLifecycle | 20,000 |    60,535 |       16.519 |       16.519 |         16.519 |     0.000 | 0: 16.519    | 0: 16.519    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   397,204 |        2.518 |        2.518 |          2.518 |     0.000 | 0: 2.518     | 0: 2.518     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   397,204 |        2.518 |        2.518 |          2.518 |     0.000 | 0: 2.518     | 0: 2.518     |
| replace  | head   | A       | scaleUp       | 10,000 |   332,622 |        3.006 |        3.006 |          3.006 |     0.000 | 0: 3.006     | 0: 3.006     |
| replace  | head   | A       | scaleDown     | 10,000 |   232,972 |        4.292 |        4.292 |          4.292 |     0.000 | 0: 4.292     | 0: 4.292     |
| replace  | head   | A       | fullLifecycle | 20,000 |   274,018 |        3.649 |        3.649 |          3.649 |     0.000 | 0: 3.649     | 0: 3.649     |
| replace  | random | A       | scaleUp       | 10,000 |    71,670 |       13.953 |       13.953 |         13.953 |     0.000 | 0: 13.953    | 0: 13.953    |
| replace  | random | A       | scaleDown     | 10,000 |    50,167 |       19.933 |       19.933 |         19.933 |     0.000 | 0: 19.933    | 0: 19.933    |
| replace  | random | A       | fullLifecycle | 20,000 |    59,021 |       16.943 |       16.943 |         16.943 |     0.000 | 0: 16.943    | 0: 16.943    |
| replace  | tail   | A       | scaleUp       | 10,000 |   369,211 |        2.708 |        2.708 |          2.708 |     0.000 | 0: 2.708     | 0: 2.708     |
| replace  | tail   | A       | scaleDown     | 10,000 |   318,191 |        3.143 |        3.143 |          3.143 |     0.000 | 0: 3.143     | 0: 3.143     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   341,807 |        2.926 |        2.926 |          2.926 |     0.000 | 0: 2.926     | 0: 2.926     |
| sequence | —      | A       | scaleUp       |      5 |       148 |     6739.780 |     6739.780 |       6739.780 |     0.000 | 0: 6739.780  | 0: 6739.780  |
| sequence | —      | A       | scaleDown     |      5 |        22 |    45847.440 |    45847.440 |      45847.440 |     0.000 | 0: 45847.440 | 0: 45847.440 |
| sequence | —      | A       | fullLifecycle |     10 |        38 |    26293.610 |    26293.610 |      26293.610 |     0.000 | 0: 26293.610 | 0: 26293.610 |
| value    | head   | A       | scaleUp       | 10,000 | 2,611,034 |        0.383 |        0.383 |          0.383 |     0.000 | 0: 0.383     | 0: 0.383     |
| value    | head   | A       | scaleDown     | 10,000 | 1,612,799 |        0.620 |        0.620 |          0.620 |     0.000 | 0: 0.620     | 0: 0.620     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,993,958 |        0.502 |        0.502 |          0.502 |     0.000 | 0: 0.502     | 0: 0.502     |
| value    | random | A       | scaleUp       | 10,000 |    89,656 |       11.154 |       11.154 |         11.154 |     0.000 | 0: 11.154    | 0: 11.154    |
| value    | random | A       | scaleDown     | 10,000 |    60,380 |       16.562 |       16.562 |         16.562 |     0.000 | 0: 16.562    | 0: 16.562    |
| value    | random | A       | fullLifecycle | 20,000 |    72,162 |       13.858 |       13.858 |         13.858 |     0.000 | 0: 13.858    | 0: 13.858    |
| value    | tail   | A       | scaleUp       | 10,000 | 3,725,782 |        0.268 |        0.268 |          0.268 |     0.000 | 0: 0.268     | 0: 0.268     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,310,803 |        0.433 |        0.433 |          0.433 |     0.000 | 0: 0.433     | 0: 0.433     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,852,457 |        0.351 |        0.351 |          0.351 |     0.000 | 0: 0.351     | 0: 0.351     |
| values   | —      | A       | scaleUp       |      5 |       430 |     2325.940 |     2325.940 |       2325.940 |     0.000 | 0: 2325.940  | 0: 2325.940  |
| values   | —      | A       | scaleDown     |      5 |     1,584 |      631.300 |      631.300 |        631.300 |     0.000 | 0: 631.300   | 0: 631.300   |
| values   | —      | A       | fullLifecycle |     10 |       676 |     1478.620 |     1478.620 |       1478.620 |     0.000 | 0: 1478.620  | 0: 1478.620  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |   125,000 |  8.000 |  8.000 |    8.000 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   112,867 |  8.860 |  8.000 |   11.600 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    97,914 | 10.213 |  4.900 |   76.800 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    80,308 | 12.452 |  4.200 | 1700.700 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    37,640 | 26.568 |  3.800 | 5823.600 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    30,309 | 32.994 |  3.500 | 5823.600 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    30,457 | 32.833 |  3.500 | 5823.600 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    30,532 | 32.752 |  3.200 | 5823.600 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    30,397 | 32.898 |  3.200 | 5823.600 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    30,397 | 32.898 |  3.200 | 5823.600 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   263,158 |  3.800 |  1.400 |   11.800 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   454,133 |  2.202 |  1.200 |   11.800 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   760,341 |  1.315 |  0.600 |   30.200 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   804,868 |  1.242 |  0.600 |  423.400 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   804,868 |  1.242 |  0.600 |  423.400 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   804,868 |  1.242 |  0.600 |  423.400 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   804,868 |  1.242 |  0.600 |  423.400 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   804,868 |  1.242 |  0.600 |  423.400 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   804,868 |  1.242 |  0.600 |  423.400 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   588,235 |  1.700 |  1.700 |    1.700 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   515,464 |  1.940 |  1.400 |    3.900 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   385,802 |  2.592 |  1.400 |   11.400 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   259,531 |  3.853 |  0.700 |  571.400 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   101,779 |  9.825 |  0.700 | 2261.300 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    77,083 | 12.973 |  0.700 | 2261.300 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    77,418 | 12.917 |  0.700 | 2261.300 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    77,605 | 12.886 |  0.700 | 2261.300 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    77,634 | 12.881 |  0.700 | 2261.300 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    77,637 | 12.880 |  0.700 | 2261.300 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   163,934 |  6.100 |  6.100 |    6.100 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   413,223 |  2.420 |  1.400 |    6.100 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   488,281 |  2.048 |  1.100 |    8.200 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   735,078 |  1.360 |  0.400 |   35.700 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,037,517 |  0.964 |  0.400 |   35.700 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,037,517 |  0.964 |  0.400 |   35.700 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,037,517 |  0.964 |  0.400 |   35.700 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,037,517 |  0.964 |  0.400 |   35.700 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,037,517 |  0.964 |  0.400 |   35.700 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,037,517 |  0.964 |  0.400 |   35.700 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   396,259 |  2.524 |  1.600 |   37.800 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   396,076 |  2.525 |  1.600 |   37.800 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   396,098 |  2.525 |  1.500 |   37.800 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   395,961 |  2.526 |  1.500 |   37.800 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   395,961 |  2.526 |  1.500 |   37.800 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   344,828 |  2.900 |  2.900 |    2.900 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   250,000 |  4.000 |  2.900 |    7.400 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   232,396 |  4.303 |  2.100 |   12.700 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   214,069 |  4.671 |  1.600 |   62.100 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    73,177 | 13.665 |  1.400 | 2426.500 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    60,073 | 16.646 |  1.400 | 2426.500 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    60,360 | 16.567 |  1.400 | 2426.500 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    60,515 | 16.525 |  1.400 | 2426.500 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    60,533 | 16.520 |  1.400 | 2426.500 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    60,535 | 16.519 |  1.400 | 2426.500 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   397,042 |  2.519 |  1.500 |   50.600 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   396,997 |  2.519 |  1.500 |   50.600 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   397,403 |  2.516 |  1.500 |   50.600 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   397,317 |  2.517 |  1.500 |   50.600 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   397,204 |  2.518 |  1.500 |   50.600 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    67,114 | 14.900 | 14.900 |   14.900 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   152,207 |  6.570 |  4.200 |   14.900 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   177,841 |  5.623 |  2.600 |   42.000 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   270,885 |  3.692 |  1.900 |   42.000 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   332,622 |  3.006 |  1.700 | 1122.400 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   305,429 |  3.274 |  1.700 | 4822.100 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   304,592 |  3.283 |  1.700 | 4822.100 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   303,590 |  3.294 |  1.700 | 4822.100 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   303,012 |  3.300 |  1.700 | 4822.100 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   274,018 |  3.649 |  1.700 | 6987.300 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   263,158 |  3.800 |  3.800 |    3.800 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   226,244 |  4.420 |  3.800 |    5.600 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   196,309 |  5.094 |  2.700 |   19.000 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   177,280 |  5.641 |  2.200 |   74.000 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    71,670 | 13.953 |  1.700 |  656.000 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    58,603 | 17.064 |  1.700 | 4942.300 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    58,844 | 16.994 |  1.700 | 4942.300 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    59,001 | 16.949 |  1.700 | 4942.300 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    59,020 | 16.943 |  1.700 | 4942.300 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    59,021 | 16.943 |  1.700 | 4942.300 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   322,581 |  3.100 |  3.100 |    3.100 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   235,849 |  4.240 |  3.100 |    5.600 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   182,983 |  5.465 |  2.300 |   75.500 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   254,758 |  3.925 |  1.800 |  410.200 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   369,211 |  2.708 |  1.600 |  410.200 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   343,421 |  2.912 |  1.600 | 2360.900 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   342,055 |  2.924 |  1.600 | 2360.900 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   341,928 |  2.925 |  1.600 | 2360.900 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   341,847 |  2.925 |  1.600 | 2360.900 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   341,807 |  2.926 |  1.600 | 2360.900 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   400,000 |  2.500 |  2.500 |    2.500 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,136,364 |  0.880 |  0.500 |    2.500 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,222,222 |  0.450 |  0.200 |    2.500 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,431,315 |  0.411 |  0.200 |   27.800 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,611,034 |  0.383 |  0.200 |   27.800 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,038,692 |  0.491 |  0.200 |   66.700 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,026,126 |  0.494 |  0.200 |   66.700 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,026,068 |  0.494 |  0.200 |   66.700 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,024,170 |  0.494 |  0.200 |   66.700 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,993,958 |  0.502 |  0.200 |  150.200 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 2,500,000 |  0.400 |  0.400 |    0.400 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,173,913 |  0.460 |  0.300 |    0.800 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,230,012 |  0.813 |  0.200 |    1.900 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   438,789 |  2.279 |  0.200 |   46.900 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    89,656 | 11.154 |  0.200 |  236.300 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    71,580 | 13.970 |  0.100 |  468.900 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    71,931 | 13.902 |  0.100 |  468.900 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    72,135 | 13.863 |  0.100 |  468.900 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    72,167 | 13.857 |  0.100 |  468.900 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    72,162 | 13.858 |  0.100 |  468.900 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |    0.300 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 2,325,581 |  0.430 |  0.300 |    0.700 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 4,048,583 |  0.247 |  0.100 |    0.700 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 3,797,949 |  0.263 |  0.100 |    5.700 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,725,782 |  0.268 |  0.100 |   19.900 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,859,938 |  0.350 |  0.100 |   47.500 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,858,005 |  0.350 |  0.100 |   47.500 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,860,373 |  0.350 |  0.100 |   47.500 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,860,596 |  0.350 |  0.100 |   47.500 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,852,457 |  0.351 |  0.100 |   47.500 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  14,124 |    70.800 |
| create   | —    |   0 | up        |     10 | A       |     1 |  26,455 |    37.800 |
| create   | —    |   0 | up        |    100 | A       |     1 |  13,605 |    73.500 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,715 |   368.300 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     345 |  2902.500 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,589 |   386.300 |
| create   | —    |   0 | down      |    100 | A       |     1 |  12,048 |    83.000 |
| create   | —    |   0 | down      |     10 | A       |     1 |  19,120 |    52.300 |
| create   | —    |   0 | down      |      1 | A       |     1 |  25,189 |    39.700 |
| create   | —    |   0 | down      |      0 | A       |     1 |  34,247 |    29.200 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   2,769 |   361.200 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  12,165 |    82.200 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   5,656 |   176.800 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     438 |  2284.300 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      32 | 30794.400 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      20 | 49386.200 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      18 | 54802.400 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      18 | 55220.600 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      14 | 69813.800 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  70,423 |    14.200 |
| values   | —    |   0 | up        |      1 | A       |     1 |  10,331 |    96.800 |
| values   | —    |   0 | up        |     10 | A       |     1 |  23,923 |    41.800 |
| values   | —    |   0 | up        |    100 | A       |     1 |   5,076 |   197.000 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     424 |  2358.900 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     112 |  8935.200 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     419 |  2388.000 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,539 |   649.700 |
| values   | —    |   0 | down      |     10 | A       |     1 |  13,774 |    72.600 |
| values   | —    |   0 | down      |      1 | A       |     1 |  42,918 |    23.300 |
| values   | —    |   0 | down      |      0 | A       |     1 |  43,668 |    22.900 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  84,410,368 |         9,859,568 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  77,234,176 |        10,006,872 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  79,011,840 |        10,657,144 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 101,789,696 |        15,597,456 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 305,868,800 |        64,600,376 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 401,608,704 |       109,766,224 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 406,396,928 |       114,575,136 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 407,810,048 |       115,015,080 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 408,223,744 |       115,079,528 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 408,645,632 |       114,913,136 |

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
