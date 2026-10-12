# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:01:52.323Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    34,709 |       28.811 |       28.811 |         28.811 |     0.000 | 0: 28.811    | 0: 28.811    |
| apply    | random | A       | scaleDown     |  9,999 |    25,550 |       39.140 |       39.140 |         39.140 |     0.000 | 0: 39.140    | 0: 39.140    |
| apply    | random | A       | fullLifecycle | 19,999 |    29,434 |       33.975 |       33.975 |         33.975 |     0.000 | 0: 33.975    | 0: 33.975    |
| create   | —      | A       | scaleUp       |      6 |     1,495 |      669.083 |      669.083 |        669.083 |     0.000 | 0: 669.083   | 0: 669.083   |
| create   | —      | A       | scaleDown     |      5 |     8,022 |      124.660 |      124.660 |        124.660 |     0.000 | 0: 124.660   | 0: 124.660   |
| create   | —      | A       | fullLifecycle |     11 |     2,372 |      421.618 |      421.618 |        421.618 |     0.000 | 0: 421.618   | 0: 421.618   |
| insert   | head   | A       | scaleUp       |  5,000 |   333,778 |        2.996 |        2.996 |          2.996 |     0.000 | 0: 2.996     | 0: 2.996     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   333,778 |        2.996 |        2.996 |          2.996 |     0.000 | 0: 2.996     | 0: 2.996     |
| insert   | random | A       | scaleUp       | 10,000 |   103,103 |        9.699 |        9.699 |          9.699 |     0.000 | 0: 9.699     | 0: 9.699     |
| insert   | random | A       | scaleDown     | 10,000 |    64,280 |       15.557 |       15.557 |         15.557 |     0.000 | 0: 15.557    | 0: 15.557    |
| insert   | random | A       | fullLifecycle | 20,000 |    79,189 |       12.628 |       12.628 |         12.628 |     0.000 | 0: 12.628    | 0: 12.628    |
| insert   | tail   | A       | scaleUp       |  5,000 |   994,669 |        1.005 |        1.005 |          1.005 |     0.000 | 0: 1.005     | 0: 1.005     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   994,669 |        1.005 |        1.005 |          1.005 |     0.000 | 0: 1.005     | 0: 1.005     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   403,232 |        2.480 |        2.480 |          2.480 |     0.000 | 0: 2.480     | 0: 2.480     |
| remove   | head   | A       | fullLifecycle |  5,000 |   403,232 |        2.480 |        2.480 |          2.480 |     0.000 | 0: 2.480     | 0: 2.480     |
| remove   | random | A       | scaleUp       | 10,000 |    74,239 |       13.470 |       13.470 |         13.470 |     0.000 | 0: 13.470    | 0: 13.470    |
| remove   | random | A       | scaleDown     | 10,000 |    52,705 |       18.974 |       18.974 |         18.974 |     0.000 | 0: 18.974    | 0: 18.974    |
| remove   | random | A       | fullLifecycle | 20,000 |    61,646 |       16.222 |       16.222 |         16.222 |     0.000 | 0: 16.222    | 0: 16.222    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   403,018 |        2.481 |        2.481 |          2.481 |     0.000 | 0: 2.481     | 0: 2.481     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   403,018 |        2.481 |        2.481 |          2.481 |     0.000 | 0: 2.481     | 0: 2.481     |
| replace  | head   | A       | scaleUp       | 10,000 |   358,391 |        2.790 |        2.790 |          2.790 |     0.000 | 0: 2.790     | 0: 2.790     |
| replace  | head   | A       | scaleDown     | 10,000 |   253,372 |        3.947 |        3.947 |          3.947 |     0.000 | 0: 3.947     | 0: 3.947     |
| replace  | head   | A       | fullLifecycle | 20,000 |   296,868 |        3.369 |        3.369 |          3.369 |     0.000 | 0: 3.369     | 0: 3.369     |
| replace  | random | A       | scaleUp       | 10,000 |    68,641 |       14.569 |       14.569 |         14.569 |     0.000 | 0: 14.569    | 0: 14.569    |
| replace  | random | A       | scaleDown     | 10,000 |    51,172 |       19.542 |       19.542 |         19.542 |     0.000 | 0: 19.542    | 0: 19.542    |
| replace  | random | A       | fullLifecycle | 20,000 |    58,633 |       17.055 |       17.055 |         17.055 |     0.000 | 0: 17.055    | 0: 17.055    |
| replace  | tail   | A       | scaleUp       | 10,000 |   341,546 |        2.928 |        2.928 |          2.928 |     0.000 | 0: 2.928     | 0: 2.928     |
| replace  | tail   | A       | scaleDown     | 10,000 |   311,794 |        3.207 |        3.207 |          3.207 |     0.000 | 0: 3.207     | 0: 3.207     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   325,993 |        3.068 |        3.068 |          3.068 |     0.000 | 0: 3.068     | 0: 3.068     |
| sequence | —      | A       | scaleUp       |      5 |       158 |     6327.600 |     6327.600 |       6327.600 |     0.000 | 0: 6327.600  | 0: 6327.600  |
| sequence | —      | A       | scaleDown     |      5 |        21 |    47176.100 |    47176.100 |      47176.100 |     0.000 | 0: 47176.100 | 0: 47176.100 |
| sequence | —      | A       | fullLifecycle |     10 |        37 |    26751.850 |    26751.850 |      26751.850 |     0.000 | 0: 26751.850 | 0: 26751.850 |
| value    | head   | A       | scaleUp       | 10,000 | 2,540,457 |        0.394 |        0.394 |          0.394 |     0.000 | 0: 0.394     | 0: 0.394     |
| value    | head   | A       | scaleDown     | 10,000 | 1,589,345 |        0.629 |        0.629 |          0.629 |     0.000 | 0: 0.629     | 0: 0.629     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,955,378 |        0.511 |        0.511 |          0.511 |     0.000 | 0: 0.511     | 0: 0.511     |
| value    | random | A       | scaleUp       | 10,000 |    87,802 |       11.389 |       11.389 |         11.389 |     0.000 | 0: 11.389    | 0: 11.389    |
| value    | random | A       | scaleDown     | 10,000 |    62,255 |       16.063 |       16.063 |         16.063 |     0.000 | 0: 16.063    | 0: 16.063    |
| value    | random | A       | fullLifecycle | 20,000 |    72,854 |       13.726 |       13.726 |         13.726 |     0.000 | 0: 13.726    | 0: 13.726    |
| value    | tail   | A       | scaleUp       | 10,000 | 4,133,769 |        0.242 |        0.242 |          0.242 |     0.000 | 0: 0.242     | 0: 0.242     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,237,637 |        0.447 |        0.447 |          0.447 |     0.000 | 0: 0.447     | 0: 0.447     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,903,558 |        0.344 |        0.344 |          0.344 |     0.000 | 0: 0.344     | 0: 0.344     |
| values   | —      | A       | scaleUp       |      5 |       464 |     2155.360 |     2155.360 |       2155.360 |     0.000 | 0: 2155.360  | 0: 2155.360  |
| values   | —      | A       | scaleDown     |      5 |     1,701 |      588.040 |      588.040 |        588.040 |     0.000 | 0: 588.040   | 0: 588.040   |
| values   | —      | A       | fullLifecycle |     10 |       729 |     1371.700 |     1371.700 |       1371.700 |     0.000 | 0: 1371.700  | 0: 1371.700  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |   120,482 |  8.300 |  8.300 |     8.300 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   133,690 |  7.480 |  6.800 |     9.900 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   119,904 |  8.340 |  4.000 |    67.800 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   130,212 |  7.680 |  2.800 |   336.900 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    34,709 | 28.811 |  2.800 | 23493.200 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    29,248 | 34.190 |  2.800 | 23493.200 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    29,473 | 33.929 |  2.800 | 23493.200 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    29,552 | 33.838 |  2.800 | 23493.200 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    29,434 | 33.975 |  2.800 | 23493.200 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    29,434 | 33.975 |  2.800 | 23493.200 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   303,030 |  3.300 |  1.100 |    10.400 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   384,320 |  2.602 |  1.000 |    45.000 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   948,047 |  1.055 |  0.400 |    45.000 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   333,778 |  2.996 |  0.400 |  9510.200 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   333,778 |  2.996 |  0.400 |  9510.200 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   333,778 |  2.996 |  0.400 |  9510.200 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   333,778 |  2.996 |  0.400 |  9510.200 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   333,778 |  2.996 |  0.400 |  9510.200 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   333,778 |  2.996 |  0.400 |  9510.200 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   588,235 |  1.700 |  1.700 |     1.700 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   584,795 |  1.710 |  1.200 |     3.200 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   531,350 |  1.882 |  1.200 |     6.300 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   400,721 |  2.495 |  0.600 |   331.200 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   103,103 |  9.699 |  0.500 |  1973.600 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    78,585 | 12.725 |  0.500 |  1973.600 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    78,967 | 12.663 |  0.500 |  1973.600 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    79,154 | 12.634 |  0.500 |  1973.600 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    79,186 | 12.628 |  0.500 |  1973.600 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    79,189 | 12.628 |  0.500 |  1973.600 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   102,041 |  9.800 |  9.800 |     9.800 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   342,466 |  2.920 |  1.100 |     9.800 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |    90,794 | 11.014 |  0.900 |   468.200 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   532,028 |  1.880 |  0.300 |   468.200 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   994,669 |  1.005 |  0.300 |   468.200 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   994,669 |  1.005 |  0.300 |   468.200 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   994,669 |  1.005 |  0.300 |   468.200 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   994,669 |  1.005 |  0.300 |   468.200 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   994,669 |  1.005 |  0.300 |   468.200 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   994,669 |  1.005 |  0.300 |   468.200 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   400,014 |  2.500 |  1.500 |    42.800 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   403,752 |  2.477 |  1.500 |    42.800 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   403,157 |  2.480 |  1.500 |    43.500 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   403,232 |  2.480 |  1.500 |    43.500 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   403,232 |  2.480 |  1.500 |    43.500 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   322,581 |  3.100 |  3.100 |     3.100 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   290,698 |  3.440 |  2.900 |     7.000 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   305,250 |  3.276 |  1.800 |    11.600 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   292,124 |  3.423 |  1.100 |   107.700 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    74,239 | 13.470 |  1.100 |   909.700 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    61,137 | 16.357 |  1.100 |   909.700 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    61,457 | 16.271 |  1.100 |   909.700 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    61,623 | 16.228 |  1.100 |   909.700 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    61,643 | 16.222 |  1.100 |   909.700 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    61,646 | 16.222 |  1.100 |   909.700 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   398,706 |  2.508 |  1.500 |    50.500 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   402,236 |  2.486 |  1.500 |    50.500 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   402,920 |  2.482 |  1.400 |    50.500 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   403,031 |  2.481 |  1.400 |    50.500 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   403,018 |  2.481 |  1.400 |    50.500 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    49,261 | 20.300 | 20.300 |    20.300 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   155,763 |  6.420 |  3.700 |    20.300 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   239,292 |  4.179 |  2.200 |    23.100 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   388,003 |  2.577 |  1.500 |    24.100 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   358,391 |  2.790 |  1.500 |  1095.400 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   317,671 |  3.148 |  1.500 |  4059.800 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   316,683 |  3.158 |  1.500 |  4059.800 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   316,468 |  3.160 |  1.500 |  4059.800 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   315,984 |  3.165 |  1.500 |  4059.800 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   296,868 |  3.369 |  1.500 |  4079.000 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   222,222 |  4.500 |  4.500 |     4.500 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   254,453 |  3.930 |  3.300 |     4.700 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   253,165 |  3.950 |  2.300 |    11.600 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   220,872 |  4.527 |  1.500 |   583.300 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    68,641 | 14.569 |  1.500 |  4113.700 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    58,163 | 17.193 |  1.500 |  4230.500 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    58,467 | 17.104 |  1.500 |  4230.500 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    58,610 | 17.062 |  1.500 |  4230.500 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    58,631 | 17.056 |  1.500 |  4230.500 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    58,633 | 17.055 |  1.500 |  4230.500 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   312,500 |  3.200 |  3.200 |     3.200 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   281,690 |  3.550 |  3.200 |     4.500 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   271,887 |  3.678 |  2.000 |    35.300 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   357,015 |  2.801 |  1.400 |   267.600 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   341,546 |  2.928 |  1.300 |  2539.200 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   326,053 |  3.067 |  1.300 |  2539.200 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   325,890 |  3.069 |  1.300 |  2539.200 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   326,095 |  3.067 |  1.300 |  2539.200 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   326,092 |  3.067 |  1.300 |  2539.200 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   325,993 |  3.068 |  1.300 |  2539.200 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   294,118 |  3.400 |  3.400 |     3.400 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,123,596 |  0.890 |  0.400 |     3.400 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,551,020 |  0.392 |  0.200 |     3.400 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 3,096,934 |  0.323 |  0.100 |    33.300 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,540,457 |  0.394 |  0.100 |    33.300 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,972,694 |  0.507 |  0.100 |    36.100 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,971,800 |  0.507 |  0.100 |    36.100 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 1,972,645 |  0.507 |  0.100 |    36.100 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 1,972,016 |  0.507 |  0.100 |    36.100 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,955,378 |  0.511 |  0.100 |    86.800 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 2,500,000 |  0.400 |  0.400 |     0.400 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,631,579 |  0.380 |  0.300 |     0.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,457,726 |  0.686 |  0.100 |     2.500 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   600,420 |  1.665 |  0.100 |    25.400 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    87,802 | 11.389 |  0.100 |   375.100 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    72,293 | 13.833 |  0.100 |   379.600 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    72,618 | 13.771 |  0.100 |   379.600 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    72,824 | 13.732 |  0.100 |   379.600 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    72,856 | 13.726 |  0.100 |   379.600 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    72,854 | 13.726 |  0.100 |   379.600 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |     0.300 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 3,333,333 |  0.300 |  0.200 |     0.600 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 5,319,149 |  0.188 |  0.100 |     0.600 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 5,837,712 |  0.171 |  0.100 |     3.000 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 4,133,769 |  0.242 |  0.100 |    39.800 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,910,584 |  0.344 |  0.100 |    39.800 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,907,656 |  0.344 |  0.100 |    39.800 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,911,236 |  0.343 |  0.100 |    39.800 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,911,698 |  0.343 |  0.100 |    39.800 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,903,558 |  0.344 |  0.100 |    39.800 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |   7,593 |   131.700 |
| create   | —    |   0 | up        |     10 | A       |     1 |  30,960 |    32.300 |
| create   | —    |   0 | up        |    100 | A       |     1 |  16,420 |    60.900 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   3,209 |   311.600 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     319 |  3130.100 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,569 |   389.200 |
| create   | —    |   0 | down      |    100 | A       |     1 |   7,746 |   129.100 |
| create   | —    |   0 | down      |     10 | A       |     1 |  26,667 |    37.500 |
| create   | —    |   0 | down      |      1 | A       |     1 |  28,571 |    35.000 |
| create   | —    |   0 | down      |      0 | A       |     1 |  30,769 |    32.500 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   2,988 |   334.700 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  20,284 |    49.300 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   6,743 |   148.300 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     559 |  1788.900 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      34 | 29316.800 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      20 | 49703.900 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      18 | 55538.400 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      17 | 58094.900 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      14 | 72526.400 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  59,172 |    16.900 |
| values   | —    |   0 | up        |      1 | A       |     1 |   5,255 |   190.300 |
| values   | —    |   0 | up        |     10 | A       |     1 |  26,667 |    37.500 |
| values   | —    |   0 | up        |    100 | A       |     1 |   6,158 |   162.400 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     506 |  1977.000 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     119 |  8409.600 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     435 |  2301.100 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,833 |   545.500 |
| values   | —    |   0 | down      |     10 | A       |     1 |  24,038 |    41.600 |
| values   | —    |   0 | down      |      1 | A       |     1 |  42,553 |    23.500 |
| values   | —    |   0 | down      |      0 | A       |     1 |  35,088 |    28.500 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  83,062,784 |         9,862,200 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,714,560 |        10,016,984 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,852,096 |        10,656,032 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,745,216 |        15,597,592 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 306,552,832 |        64,600,480 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 401,137,664 |       109,766,312 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 404,848,640 |       114,577,824 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 406,429,696 |       115,012,568 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 406,253,568 |       115,079,568 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 406,544,384 |       115,032,496 |

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
