# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:20:16.489Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    19,927 |       50.182 |       50.182 |         50.182 |     0.000 | 0: 50.182    | 0: 50.182    |
| apply    | random | A       | scaleDown     |  9,999 |    12,014 |       83.238 |       83.238 |         83.238 |     0.000 | 0: 83.238    | 0: 83.238    |
| apply    | random | A       | fullLifecycle | 19,999 |    14,990 |       66.709 |       66.709 |         66.709 |     0.000 | 0: 66.709    | 0: 66.709    |
| create   | —      | A       | scaleUp       |      6 |       803 |     1245.433 |     1245.433 |       1245.433 |     0.000 | 0: 1245.433  | 0: 1245.433  |
| create   | —      | A       | scaleDown     |      5 |     4,424 |      226.060 |      226.060 |        226.060 |     0.000 | 0: 226.060   | 0: 226.060   |
| create   | —      | A       | fullLifecycle |     11 |     1,279 |      782.082 |      782.082 |        782.082 |     0.000 | 0: 782.082   | 0: 782.082   |
| insert   | head   | A       | scaleUp       |  5,000 |   465,567 |        2.148 |        2.148 |          2.148 |     0.000 | 0: 2.148     | 0: 2.148     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   465,567 |        2.148 |        2.148 |          2.148 |     0.000 | 0: 2.148     | 0: 2.148     |
| insert   | random | A       | scaleUp       | 10,000 |    51,457 |       19.434 |       19.434 |         19.434 |     0.000 | 0: 19.434    | 0: 19.434    |
| insert   | random | A       | scaleDown     | 10,000 |    32,700 |       30.581 |       30.581 |         30.581 |     0.000 | 0: 30.581    | 0: 30.581    |
| insert   | random | A       | fullLifecycle | 20,000 |    39,988 |       25.008 |       25.008 |         25.008 |     0.000 | 0: 25.008    | 0: 25.008    |
| insert   | tail   | A       | scaleUp       |  5,000 |   573,743 |        1.743 |        1.743 |          1.743 |     0.000 | 0: 1.743     | 0: 1.743     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   573,743 |        1.743 |        1.743 |          1.743 |     0.000 | 0: 1.743     | 0: 1.743     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   153,053 |        6.534 |        6.534 |          6.534 |     0.000 | 0: 6.534     | 0: 6.534     |
| remove   | head   | A       | fullLifecycle |  5,000 |   153,053 |        6.534 |        6.534 |          6.534 |     0.000 | 0: 6.534     | 0: 6.534     |
| remove   | random | A       | scaleUp       | 10,000 |    37,644 |       26.565 |       26.565 |         26.565 |     0.000 | 0: 26.565    | 0: 26.565    |
| remove   | random | A       | scaleDown     | 10,000 |    25,063 |       39.899 |       39.899 |         39.899 |     0.000 | 0: 39.899    | 0: 39.899    |
| remove   | random | A       | fullLifecycle | 20,000 |    30,092 |       33.232 |       33.232 |         33.232 |     0.000 | 0: 33.232    | 0: 33.232    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   154,449 |        6.475 |        6.475 |          6.475 |     0.000 | 0: 6.475     | 0: 6.475     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   154,449 |        6.475 |        6.475 |          6.475 |     0.000 | 0: 6.475     | 0: 6.475     |
| replace  | head   | A       | scaleUp       | 10,000 |   167,839 |        5.958 |        5.958 |          5.958 |     0.000 | 0: 5.958     | 0: 5.958     |
| replace  | head   | A       | scaleDown     | 10,000 |   102,357 |        9.770 |        9.770 |          9.770 |     0.000 | 0: 9.770     | 0: 9.770     |
| replace  | head   | A       | fullLifecycle | 20,000 |   127,163 |        7.864 |        7.864 |          7.864 |     0.000 | 0: 7.864     | 0: 7.864     |
| replace  | random | A       | scaleUp       | 10,000 |    34,702 |       28.817 |       28.817 |         28.817 |     0.000 | 0: 28.817    | 0: 28.817    |
| replace  | random | A       | scaleDown     | 10,000 |    24,662 |       40.549 |       40.549 |         40.549 |     0.000 | 0: 40.549    | 0: 40.549    |
| replace  | random | A       | fullLifecycle | 20,000 |    28,833 |       34.683 |       34.683 |         34.683 |     0.000 | 0: 34.683    | 0: 34.683    |
| replace  | tail   | A       | scaleUp       | 10,000 |   182,972 |        5.465 |        5.465 |          5.465 |     0.000 | 0: 5.465     | 0: 5.465     |
| replace  | tail   | A       | scaleDown     | 10,000 |   107,192 |        9.329 |        9.329 |          9.329 |     0.000 | 0: 9.329     | 0: 9.329     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   135,186 |        7.397 |        7.397 |          7.397 |     0.000 | 0: 7.397     | 0: 7.397     |
| sequence | —      | A       | scaleUp       |      5 |        78 |    12747.640 |    12747.640 |      12747.640 |     0.000 | 0: 12747.640 | 0: 12747.640 |
| sequence | —      | A       | scaleDown     |      5 |        13 |    76564.020 |    76564.020 |      76564.020 |     0.000 | 0: 76564.020 | 0: 76564.020 |
| sequence | —      | A       | fullLifecycle |     10 |        22 |    44655.830 |    44655.830 |      44655.830 |     0.000 | 0: 44655.830 | 0: 44655.830 |
| value    | head   | A       | scaleUp       | 10,000 | 1,321,598 |        0.757 |        0.757 |          0.757 |     0.000 | 0: 0.757     | 0: 0.757     |
| value    | head   | A       | scaleDown     | 10,000 |   815,647 |        1.226 |        1.226 |          1.226 |     0.000 | 0: 1.226     | 0: 1.226     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,008,736 |        0.991 |        0.991 |          0.991 |     0.000 | 0: 0.991     | 0: 0.991     |
| value    | random | A       | scaleUp       | 10,000 |    45,822 |       21.824 |       21.824 |         21.824 |     0.000 | 0: 21.824    | 0: 21.824    |
| value    | random | A       | scaleDown     | 10,000 |    30,296 |       33.008 |       33.008 |         33.008 |     0.000 | 0: 33.008    | 0: 33.008    |
| value    | random | A       | fullLifecycle | 20,000 |    36,475 |       27.416 |       27.416 |         27.416 |     0.000 | 0: 27.416    | 0: 27.416    |
| value    | tail   | A       | scaleUp       | 10,000 | 1,867,309 |        0.536 |        0.536 |          0.536 |     0.000 | 0: 0.536     | 0: 0.536     |
| value    | tail   | A       | scaleDown     | 10,000 | 1,074,691 |        0.930 |        0.930 |          0.930 |     0.000 | 0: 0.930     | 0: 0.930     |
| value    | tail   | A       | fullLifecycle | 20,000 | 1,364,229 |        0.733 |        0.733 |          0.733 |     0.000 | 0: 0.733     | 0: 0.733     |
| values   | —      | A       | scaleUp       |      5 |       205 |     4885.800 |     4885.800 |       4885.800 |     0.000 | 0: 4885.800  | 0: 4885.800  |
| values   | —      | A       | scaleDown     |      5 |     1,060 |      943.760 |      943.760 |        943.760 |     0.000 | 0: 943.760   | 0: 943.760   |
| values   | —      | A       | fullLifecycle |     10 |       343 |     2914.780 |     2914.780 |       2914.780 |     0.000 | 0: 2914.780  | 0: 2914.780  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    42,735 | 23.400 | 23.400 |    23.400 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    55,525 | 18.010 | 16.400 |    23.400 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    40,848 | 24.481 |  9.500 |   210.200 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    43,530 | 22.973 |  5.900 |  1109.000 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    19,927 | 50.182 |  5.900 |  5955.300 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    14,854 | 67.323 |  5.900 | 34242.900 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    15,002 | 66.658 |  5.700 | 34242.900 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    15,038 | 66.497 |  5.700 | 34242.900 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    14,990 | 66.709 |  5.700 | 34242.900 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    14,990 | 66.709 |  5.700 | 34242.900 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   161,290 |  6.200 |  2.800 |    16.900 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   184,026 |  5.434 |  2.800 |    16.900 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   339,351 |  2.947 |  0.900 |   115.200 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   465,567 |  2.148 |  0.900 |   115.200 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   465,567 |  2.148 |  0.900 |   115.200 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   465,567 |  2.148 |  0.900 |   115.200 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   465,567 |  2.148 |  0.900 |   115.200 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   465,567 |  2.148 |  0.900 |   115.200 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   465,567 |  2.148 |  0.900 |   115.200 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   175,439 |  5.700 |  5.700 |     5.700 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   237,530 |  4.210 |  3.000 |     8.000 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   166,196 |  6.017 |  2.800 |    21.000 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   143,643 |  6.962 |  1.100 |  1008.300 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    51,457 | 19.434 |  1.100 | 10473.400 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    39,482 | 25.328 |  1.100 | 10473.400 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    39,879 | 25.076 |  1.100 | 10473.400 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    39,972 | 25.018 |  1.100 | 10473.400 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    39,986 | 25.009 |  1.100 | 10473.400 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    39,988 | 25.008 |  1.100 | 10473.400 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   121,951 |  8.200 |  8.200 |     8.200 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   223,214 |  4.480 |  3.000 |     8.200 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   210,526 |  4.750 |  2.500 |    18.600 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   388,048 |  2.577 |  0.700 |    95.400 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   573,743 |  1.743 |  0.700 |    95.400 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   573,743 |  1.743 |  0.700 |    95.400 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   573,743 |  1.743 |  0.700 |    95.400 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   573,743 |  1.743 |  0.700 |    95.400 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   573,743 |  1.743 |  0.700 |    95.400 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   573,743 |  1.743 |  0.700 |    95.400 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   149,766 |  6.677 |  2.900 |   189.100 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   152,751 |  6.547 |  2.700 |   189.100 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   153,053 |  6.534 |  2.700 |   189.100 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   153,053 |  6.534 |  2.700 |   189.100 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   153,053 |  6.534 |  2.700 |   189.100 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   151,515 |  6.600 |  6.600 |     6.600 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   122,249 |  8.180 |  6.600 |    13.700 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |    31,082 | 32.173 |  4.900 |  1982.700 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    81,263 | 12.306 |  2.400 |  1982.700 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    37,644 | 26.565 |  2.400 |  1982.700 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    29,725 | 33.641 |  2.400 |  2064.700 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    30,014 | 33.318 |  2.400 |  2064.700 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    30,084 | 33.240 |  2.400 |  2064.700 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    30,091 | 33.232 |  2.400 |  2064.700 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    30,092 | 33.232 |  2.400 |  2064.700 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   153,573 |  6.512 |  2.600 |   262.300 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   154,571 |  6.470 |  2.600 |   327.000 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   154,500 |  6.473 |  2.600 |   327.000 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   154,463 |  6.474 |  2.600 |   327.000 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   154,449 |  6.475 |  2.600 |   327.000 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    38,462 | 26.000 | 26.000 |    26.000 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    65,402 | 15.290 |  9.100 |    31.300 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |    75,024 | 13.329 |  5.600 |    78.700 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   120,825 |  8.276 |  3.100 |   115.200 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   167,839 |  5.958 |  2.900 |  2175.100 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   131,531 |  7.603 |  2.900 | 13924.400 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   131,962 |  7.578 |  2.900 | 13924.400 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   131,918 |  7.580 |  2.900 | 13924.400 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   131,633 |  7.597 |  2.900 | 13924.400 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   127,163 |  7.864 |  2.900 | 13924.400 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   120,482 |  8.300 |  8.300 |     8.300 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   107,643 |  9.290 |  8.100 |    11.400 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |    84,467 | 11.839 |  6.200 |    31.400 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    86,168 | 11.605 |  3.300 |   237.300 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    34,702 | 28.817 |  3.200 | 14729.300 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    28,462 | 35.134 |  3.200 | 14729.300 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    28,757 | 34.775 |  3.200 | 14729.300 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    28,825 | 34.692 |  3.200 | 14729.300 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    28,832 | 34.684 |  3.200 | 14729.300 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    28,833 | 34.683 |  3.200 | 14729.300 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   109,890 |  9.100 |  9.100 |     9.100 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   114,286 |  8.750 |  8.000 |     9.800 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |    84,012 | 11.903 |  5.200 |    89.900 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    94,134 | 10.623 |  2.800 |  2540.400 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   182,972 |  5.465 |  2.500 |  2540.400 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   134,069 |  7.459 |  2.500 | 22949.700 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   135,214 |  7.396 |  2.500 | 22949.700 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   135,286 |  7.392 |  2.500 | 22949.700 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   135,259 |  7.393 |  2.500 | 22949.700 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   135,186 |  7.397 |  2.500 | 22949.700 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   294,118 |  3.400 |  3.400 |     3.400 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   584,795 |  1.710 |  1.100 |     3.900 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 |   944,287 |  1.059 |  0.500 |     4.000 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,021,972 |  0.979 |  0.400 |    61.200 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,321,598 |  0.757 |  0.300 |    78.800 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,011,892 |  0.988 |  0.300 |    78.800 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,016,260 |  0.984 |  0.300 |    78.800 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 1,017,013 |  0.983 |  0.300 |    78.800 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 1,016,643 |  0.984 |  0.300 |    78.800 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,008,736 |  0.991 |  0.300 |   155.200 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,428,571 |  0.700 |  0.700 |     0.700 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 1,136,364 |  0.880 |  0.600 |     1.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 |   489,956 |  2.041 |  0.300 |    10.900 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   212,925 |  4.697 |  0.300 |    96.500 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    45,822 | 21.824 |  0.300 |  4409.600 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    35,995 | 27.782 |  0.300 |  4409.600 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    36,361 | 27.502 |  0.300 |  4409.600 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    36,461 | 27.427 |  0.300 |  4409.600 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    36,476 | 27.415 |  0.300 |  4409.600 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    36,475 | 27.416 |  0.300 |  4409.600 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |     0.600 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 1,282,051 |  0.780 |  0.600 |     1.600 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 1,908,397 |  0.524 |  0.300 |     1.600 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,930,502 |  0.518 |  0.200 |    25.600 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,867,309 |  0.536 |  0.200 |    25.800 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,358,463 |  0.736 |  0.200 |    61.800 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,365,127 |  0.733 |  0.200 |    61.800 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 1,366,613 |  0.732 |  0.200 |    61.800 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 1,366,864 |  0.732 |  0.200 |    61.800 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 1,364,229 |  0.733 |  0.200 |    61.800 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |        avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | ---------: |
| create   | —    |   0 | up        |      1 | A       |     1 |   7,663 |    130.500 |
| create   | —    |   0 | up        |     10 | A       |     1 |  10,277 |     97.300 |
| create   | —    |   0 | up        |    100 | A       |     1 |   4,352 |    229.800 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   1,739 |    575.100 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     166 |   6013.400 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   1,323 |    756.100 |
| create   | —    |   0 | down      |    100 | A       |     1 |   7,616 |    131.300 |
| create   | —    |   0 | down      |     10 | A       |     1 |   6,835 |    146.300 |
| create   | —    |   0 | down      |      1 | A       |     1 |  21,097 |     47.400 |
| create   | —    |   0 | down      |      0 | A       |     1 |  20,325 |     49.200 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   2,889 |    346.100 |
| sequence | —    |   0 | up        |     10 | A       |     1 |   8,562 |    116.800 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   1,867 |    535.600 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     277 |   3604.400 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      17 |  59135.300 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      13 |  75760.300 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      12 |  85831.000 |
| sequence | —    |   0 | down      |     10 | A       |     1 |       9 | 110322.600 |
| sequence | —    |   0 | down      |      1 | A       |     1 |       9 | 110881.900 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  41,152 |     24.300 |
| values   | —    |   0 | up        |      1 | A       |     1 |   5,294 |    188.900 |
| values   | —    |   0 | up        |     10 | A       |     1 |  12,407 |     80.600 |
| values   | —    |   0 | up        |    100 | A       |     1 |   1,350 |    740.500 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     215 |   4654.800 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      53 |  18764.200 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     245 |   4079.400 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,969 |    507.800 |
| values   | —    |   0 | down      |     10 | A       |     1 |  17,825 |     56.100 |
| values   | —    |   0 | down      |      1 | A       |     1 |  26,882 |     37.200 |
| values   | —    |   0 | down      |      0 | A       |     1 |  26,110 |     38.300 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  83,124,224 |         9,859,840 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,268,096 |        10,006,888 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  77,017,088 |        10,657,144 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 |  99,835,904 |        15,597,520 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 306,712,576 |        64,597,552 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 400,543,744 |       109,763,496 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 403,705,856 |       114,574,840 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 404,439,040 |       115,009,600 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 403,357,696 |       115,076,616 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 405,037,056 |       115,029,560 |

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
