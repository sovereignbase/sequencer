# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:22:48.036Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    19,434 |       51.457 |       51.457 |         51.457 |     0.000 | 0: 51.457    | 0: 51.457    |
| apply    | random | A       | scaleDown     |  9,999 |    11,662 |       85.752 |       85.752 |         85.752 |     0.000 | 0: 85.752    | 0: 85.752    |
| apply    | random | A       | fullLifecycle | 19,999 |    14,577 |       68.603 |       68.603 |         68.603 |     0.000 | 0: 68.603    | 0: 68.603    |
| create   | —      | A       | scaleUp       |      6 |       850 |     1176.800 |     1176.800 |       1176.800 |     0.000 | 0: 1176.800  | 0: 1176.800  |
| create   | —      | A       | scaleDown     |      5 |     4,849 |      206.220 |      206.220 |        206.220 |     0.000 | 0: 206.220   | 0: 206.220   |
| create   | —      | A       | fullLifecycle |     11 |     1,359 |      735.627 |      735.627 |        735.627 |     0.000 | 0: 735.627   | 0: 735.627   |
| insert   | head   | A       | scaleUp       |  5,000 |   423,815 |        2.360 |        2.360 |          2.360 |     0.000 | 0: 2.360     | 0: 2.360     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   423,815 |        2.360 |        2.360 |          2.360 |     0.000 | 0: 2.360     | 0: 2.360     |
| insert   | random | A       | scaleUp       | 10,000 |    52,705 |       18.974 |       18.974 |         18.974 |     0.000 | 0: 18.974    | 0: 18.974    |
| insert   | random | A       | scaleDown     | 10,000 |    33,230 |       30.094 |       30.094 |         30.094 |     0.000 | 0: 30.094    | 0: 30.094    |
| insert   | random | A       | fullLifecycle | 20,000 |    40,760 |       24.534 |       24.534 |         24.534 |     0.000 | 0: 24.534    | 0: 24.534    |
| insert   | tail   | A       | scaleUp       |  5,000 |   481,997 |        2.075 |        2.075 |          2.075 |     0.000 | 0: 2.075     | 0: 2.075     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   481,997 |        2.075 |        2.075 |          2.075 |     0.000 | 0: 2.075     | 0: 2.075     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   144,532 |        6.919 |        6.919 |          6.919 |     0.000 | 0: 6.919     | 0: 6.919     |
| remove   | head   | A       | fullLifecycle |  5,000 |   144,532 |        6.919 |        6.919 |          6.919 |     0.000 | 0: 6.919     | 0: 6.919     |
| remove   | random | A       | scaleUp       | 10,000 |    37,286 |       26.819 |       26.819 |         26.819 |     0.000 | 0: 26.819    | 0: 26.819    |
| remove   | random | A       | scaleDown     | 10,000 |    24,803 |       40.318 |       40.318 |         40.318 |     0.000 | 0: 40.318    | 0: 40.318    |
| remove   | random | A       | fullLifecycle | 20,000 |    29,789 |       33.569 |       33.569 |         33.569 |     0.000 | 0: 33.569    | 0: 33.569    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   144,111 |        6.939 |        6.939 |          6.939 |     0.000 | 0: 6.939     | 0: 6.939     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   144,111 |        6.939 |        6.939 |          6.939 |     0.000 | 0: 6.939     | 0: 6.939     |
| replace  | head   | A       | scaleUp       | 10,000 |   141,142 |        7.085 |        7.085 |          7.085 |     0.000 | 0: 7.085     | 0: 7.085     |
| replace  | head   | A       | scaleDown     | 10,000 |   100,250 |        9.975 |        9.975 |          9.975 |     0.000 | 0: 9.975     | 0: 9.975     |
| replace  | head   | A       | fullLifecycle | 20,000 |   117,233 |        8.530 |        8.530 |          8.530 |     0.000 | 0: 8.530     | 0: 8.530     |
| replace  | random | A       | scaleUp       | 10,000 |    36,522 |       27.381 |       27.381 |         27.381 |     0.000 | 0: 27.381    | 0: 27.381    |
| replace  | random | A       | scaleDown     | 10,000 |    22,057 |       45.336 |       45.336 |         45.336 |     0.000 | 0: 45.336    | 0: 45.336    |
| replace  | random | A       | fullLifecycle | 20,000 |    27,504 |       36.359 |       36.359 |         36.359 |     0.000 | 0: 36.359    | 0: 36.359    |
| replace  | tail   | A       | scaleUp       | 10,000 |   145,666 |        6.865 |        6.865 |          6.865 |     0.000 | 0: 6.865     | 0: 6.865     |
| replace  | tail   | A       | scaleDown     | 10,000 |   117,186 |        8.533 |        8.533 |          8.533 |     0.000 | 0: 8.533     | 0: 8.533     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   129,883 |        7.699 |        7.699 |          7.699 |     0.000 | 0: 7.699     | 0: 7.699     |
| sequence | —      | A       | scaleUp       |      5 |        88 |    11345.320 |    11345.320 |      11345.320 |     0.000 | 0: 11345.320 | 0: 11345.320 |
| sequence | —      | A       | scaleDown     |      5 |        14 |    70348.020 |    70348.020 |      70348.020 |     0.000 | 0: 70348.020 | 0: 70348.020 |
| sequence | —      | A       | fullLifecycle |     10 |        24 |    40846.670 |    40846.670 |      40846.670 |     0.000 | 0: 40846.670 | 0: 40846.670 |
| value    | head   | A       | scaleUp       | 10,000 | 1,152,685 |        0.868 |        0.868 |          0.868 |     0.000 | 0: 0.868     | 0: 0.868     |
| value    | head   | A       | scaleDown     | 10,000 |   741,614 |        1.348 |        1.348 |          1.348 |     0.000 | 0: 1.348     | 0: 1.348     |
| value    | head   | A       | fullLifecycle | 20,000 |   902,547 |        1.108 |        1.108 |          1.108 |     0.000 | 0: 1.108     | 0: 1.108     |
| value    | random | A       | scaleUp       | 10,000 |    46,435 |       21.536 |       21.536 |         21.536 |     0.000 | 0: 21.536    | 0: 21.536    |
| value    | random | A       | scaleDown     | 10,000 |    29,851 |       33.500 |       33.500 |         33.500 |     0.000 | 0: 33.500    | 0: 33.500    |
| value    | random | A       | fullLifecycle | 20,000 |    36,340 |       27.518 |       27.518 |         27.518 |     0.000 | 0: 27.518    | 0: 27.518    |
| value    | tail   | A       | scaleUp       | 10,000 | 1,780,341 |        0.562 |        0.562 |          0.562 |     0.000 | 0: 0.562     | 0: 0.562     |
| value    | tail   | A       | scaleDown     | 10,000 |   984,000 |        1.016 |        1.016 |          1.016 |     0.000 | 0: 1.016     | 0: 1.016     |
| value    | tail   | A       | fullLifecycle | 20,000 | 1,267,467 |        0.789 |        0.789 |          0.789 |     0.000 | 0: 0.789     | 0: 0.789     |
| values   | —      | A       | scaleUp       |      5 |       290 |     3445.660 |     3445.660 |       3445.660 |     0.000 | 0: 3445.660  | 0: 3445.660  |
| values   | —      | A       | scaleDown     |      5 |     1,230 |      812.800 |      812.800 |        812.800 |     0.000 | 0: 812.800   | 0: 812.800   |
| values   | —      | A       | fullLifecycle |     10 |       470 |     2129.230 |     2129.230 |       2129.230 |     0.000 | 0: 2129.230  | 0: 2129.230  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    84,034 | 11.900 | 11.900 |    11.900 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    41,771 | 23.940 | 11.900 |    50.500 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    22,777 | 43.904 |  8.200 |  1495.700 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    33,744 | 29.635 |  6.100 |  1495.700 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    19,434 | 51.457 |  5.500 |  1495.700 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    14,435 | 69.276 |  5.500 |  1877.300 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    14,572 | 68.626 |  5.300 |  1877.300 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    14,615 | 68.422 |  5.300 |  1877.300 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    14,577 | 68.603 |  5.300 |  4148.900 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    14,577 | 68.603 |  5.300 |  4148.900 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   138,122 |  7.240 |  4.200 |    17.300 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   174,703 |  5.724 |  2.100 |    22.300 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   236,552 |  4.227 |  0.900 |   585.400 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   423,815 |  2.360 |  0.900 |   585.400 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   423,815 |  2.360 |  0.900 |   585.400 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   423,815 |  2.360 |  0.900 |   585.400 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   423,815 |  2.360 |  0.900 |   585.400 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   423,815 |  2.360 |  0.900 |   585.400 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   423,815 |  2.360 |  0.900 |   585.400 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   370,370 |  2.700 |  2.700 |     2.700 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |    75,019 | 13.330 |  2.600 |    90.800 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   123,381 |  8.105 |  2.600 |    90.800 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   121,535 |  8.228 |  1.100 |   673.900 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    52,705 | 18.974 |  1.100 |  5371.600 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    40,312 | 24.807 |  1.100 |  5371.600 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    40,627 | 24.614 |  1.100 |  5371.600 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    40,742 | 24.544 |  1.100 |  5371.600 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    40,759 | 24.535 |  1.100 |  5371.600 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    40,760 | 24.534 |  1.100 |  5371.600 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |    84,746 | 11.800 | 11.800 |    11.800 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   183,150 |  5.460 |  2.300 |    11.800 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |    43,011 | 23.250 |  1.900 |   896.300 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   211,873 |  4.720 |  0.700 |   896.300 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   481,997 |  2.075 |  0.700 |   896.300 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   481,997 |  2.075 |  0.700 |   896.300 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   481,997 |  2.075 |  0.700 |   896.300 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   481,997 |  2.075 |  0.700 |   896.300 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   481,997 |  2.075 |  0.700 |   896.300 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   481,997 |  2.075 |  0.700 |   896.300 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   141,123 |  7.086 |  2.700 |   483.300 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   143,895 |  6.950 |  2.700 |   483.300 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   144,492 |  6.921 |  2.500 |   483.300 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   144,532 |  6.919 |  2.500 |   483.300 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   144,532 |  6.919 |  2.500 |   483.300 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   222,222 |  4.500 |  4.500 |     4.500 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   110,132 |  9.080 |  4.500 |    17.200 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |    82,747 | 12.085 |  3.700 |    88.500 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    82,326 | 12.147 |  2.200 |   331.200 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    37,286 | 26.819 |  2.200 |  1713.600 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    29,453 | 33.952 |  2.200 |  1713.600 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    29,690 | 33.682 |  2.200 |  1713.600 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    29,778 | 33.582 |  2.200 |  1713.600 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    29,788 | 33.570 |  2.200 |  1713.600 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    29,789 | 33.569 |  2.200 |  1713.600 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   140,976 |  7.093 |  2.800 |   608.900 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   143,452 |  6.971 |  2.800 |   608.900 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   144,075 |  6.941 |  2.500 |   608.900 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   144,107 |  6.939 |  2.500 |   608.900 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   144,111 |  6.939 |  2.500 |   608.900 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    32,787 | 30.500 | 30.500 |    30.500 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    66,534 | 15.030 |  7.800 |    30.500 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |    76,540 | 13.065 |  4.200 |    72.300 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   100,425 |  9.958 |  3.000 |   258.500 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   141,142 |  7.085 |  2.900 |  3450.700 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   121,989 |  8.197 |  2.900 | 16575.400 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   122,441 |  8.167 |  2.900 | 16575.400 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   122,502 |  8.163 |  2.800 | 16575.400 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   122,443 |  8.167 |  2.800 | 16575.400 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   117,233 |  8.530 |  2.800 | 16575.400 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   153,846 |  6.500 |  6.500 |     6.500 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |    93,197 | 10.730 |  6.500 |    13.000 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |    82,406 | 12.135 |  4.500 |    90.100 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    72,054 | 13.879 |  3.800 |   336.300 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    36,522 | 27.381 |  3.500 |  1526.400 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    27,133 | 36.856 |  3.200 | 45147.000 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    27,406 | 36.488 |  3.200 | 45147.000 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    27,493 | 36.373 |  3.100 | 45147.000 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    27,503 | 36.360 |  3.100 | 45147.000 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    27,504 | 36.359 |  3.100 | 45147.000 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   212,766 |  4.700 |  4.700 |     4.700 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   106,157 |  9.420 |  4.700 |    12.800 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |    78,493 | 12.740 |  3.900 |   112.700 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    85,682 | 11.671 |  2.800 |  2150.700 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   145,666 |  6.865 |  2.600 |  6271.200 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   128,965 |  7.754 |  2.600 |  7417.200 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   129,702 |  7.710 |  2.600 |  7417.200 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   129,901 |  7.698 |  2.600 |  7417.200 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   129,913 |  7.697 |  2.600 |  7417.200 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   129,883 |  7.699 |  2.600 |  7417.200 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   285,714 |  3.500 |  3.500 |     3.500 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   512,821 |  1.950 |  0.900 |     3.600 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 |   519,751 |  1.924 |  0.300 |    62.500 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   797,766 |  1.254 |  0.300 |    69.400 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,152,685 |  0.868 |  0.300 |   117.100 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   900,931 |  1.110 |  0.300 |   117.100 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   907,598 |  1.102 |  0.300 |   117.100 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 |   909,079 |  1.100 |  0.300 |   117.100 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 |   908,897 |  1.100 |  0.300 |   117.100 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 |   902,547 |  1.108 |  0.300 |   155.900 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,111,111 |  0.900 |  0.900 |     0.900 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 |   952,381 |  1.050 |  0.500 |     1.700 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 |   469,484 |  2.130 |  0.300 |    11.900 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   163,776 |  6.106 |  0.300 |   424.000 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    46,435 | 21.536 |  0.300 |   424.000 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    35,862 | 27.885 |  0.300 |  9268.900 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    36,215 | 27.613 |  0.300 |  9268.900 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    36,326 | 27.528 |  0.300 |  9268.900 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    36,342 | 27.516 |  0.300 |  9268.900 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    36,340 | 27.518 |  0.300 |  9268.900 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |     0.600 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 1,010,101 |  0.990 |  0.500 |     3.000 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 1,805,054 |  0.554 |  0.200 |     3.000 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,727,414 |  0.579 |  0.200 |    38.900 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 1,780,341 |  0.562 |  0.200 |    55.000 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,261,068 |  0.793 |  0.200 |   114.700 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,267,936 |  0.789 |  0.200 |   114.700 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 1,270,327 |  0.787 |  0.200 |   114.700 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 1,270,609 |  0.787 |  0.200 |   114.700 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 1,267,467 |  0.789 |  0.200 |   114.700 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  10,267 |    97.400 |
| create   | —    |   0 | up        |     10 | A       |     1 |   8,576 |   116.600 |
| create   | —    |   0 | up        |    100 | A       |     1 |   5,734 |   174.400 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   1,492 |   670.200 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     175 |  5708.800 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   1,427 |   700.800 |
| create   | —    |   0 | down      |    100 | A       |     1 |   5,831 |   171.500 |
| create   | —    |   0 | down      |     10 | A       |     1 |  19,084 |    52.400 |
| create   | —    |   0 | down      |      1 | A       |     1 |  15,576 |    64.200 |
| create   | —    |   0 | down      |      0 | A       |     1 |  23,697 |    42.200 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   3,196 |   312.900 |
| sequence | —    |   0 | up        |     10 | A       |     1 |   5,952 |   168.000 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   1,680 |   595.300 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     256 |  3900.000 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      19 | 51750.400 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      12 | 82374.200 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      11 | 91045.900 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      12 | 81552.600 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      10 | 96745.300 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  45,249 |    22.100 |
| values   | —    |   0 | up        |      1 | A       |     1 |   7,905 |   126.500 |
| values   | —    |   0 | up        |     10 | A       |     1 |   8,354 |   119.700 |
| values   | —    |   0 | up        |    100 | A       |     1 |   1,288 |   776.600 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     228 |  4384.200 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      85 | 11821.300 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     292 |  3422.500 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,999 |   500.300 |
| values   | —    |   0 | down      |     10 | A       |     1 |  16,529 |    60.500 |
| values   | —    |   0 | down      |      1 | A       |     1 |  21,053 |    47.500 |
| values   | —    |   0 | down      |      0 | A       |     1 |  30,120 |    33.200 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  82,870,272 |         9,861,992 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,915,264 |        10,009,272 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  77,660,160 |        10,656,984 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 |  99,987,456 |        15,597,776 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 306,630,656 |        64,598,024 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 399,552,512 |       109,763,904 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 403,234,816 |       114,575,264 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 404,918,272 |       115,010,024 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 405,213,184 |       115,077,040 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 405,434,368 |       114,910,648 |

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
