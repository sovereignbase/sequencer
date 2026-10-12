# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:47:35.589Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    32,484 |       30.784 |       30.784 |         30.784 |     0.000 | 0: 30.784    | 0: 30.784    |
| apply    | random | A       | scaleDown     |  9,999 |    16,203 |       61.716 |       61.716 |         61.716 |     0.000 | 0: 61.716    | 0: 61.716    |
| apply    | random | A       | fullLifecycle | 19,999 |    21,622 |       46.250 |       46.250 |         46.250 |     0.000 | 0: 46.250    | 0: 46.250    |
| create   | —      | A       | scaleUp       |      6 |     1,358 |      736.550 |      736.550 |        736.550 |     0.000 | 0: 736.550   | 0: 736.550   |
| create   | —      | A       | scaleDown     |      5 |     7,250 |      137.940 |      137.940 |        137.940 |     0.000 | 0: 137.940   | 0: 137.940   |
| create   | —      | A       | fullLifecycle |     11 |     2,153 |      464.455 |      464.455 |        464.455 |     0.000 | 0: 464.455   | 0: 464.455   |
| insert   | head   | A       | scaleUp       |  5,000 |   782,362 |        1.278 |        1.278 |          1.278 |     0.000 | 0: 1.278     | 0: 1.278     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   782,362 |        1.278 |        1.278 |          1.278 |     0.000 | 0: 1.278     | 0: 1.278     |
| insert   | random | A       | scaleUp       | 10,000 |    87,623 |       11.413 |       11.413 |         11.413 |     0.000 | 0: 11.413    | 0: 11.413    |
| insert   | random | A       | scaleDown     | 10,000 |    35,250 |       28.368 |       28.368 |         28.368 |     0.000 | 0: 28.368    | 0: 28.368    |
| insert   | random | A       | fullLifecycle | 20,000 |    50,275 |       19.891 |       19.891 |         19.891 |     0.000 | 0: 19.891    | 0: 19.891    |
| insert   | tail   | A       | scaleUp       |  5,000 |   858,929 |        1.164 |        1.164 |          1.164 |     0.000 | 0: 1.164     | 0: 1.164     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   858,929 |        1.164 |        1.164 |          1.164 |     0.000 | 0: 1.164     | 0: 1.164     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   269,843 |        3.706 |        3.706 |          3.706 |     0.000 | 0: 3.706     | 0: 3.706     |
| remove   | head   | A       | fullLifecycle |  5,000 |   269,843 |        3.706 |        3.706 |          3.706 |     0.000 | 0: 3.706     | 0: 3.706     |
| remove   | random | A       | scaleUp       | 10,000 |    54,546 |       18.333 |       18.333 |         18.333 |     0.000 | 0: 18.333    | 0: 18.333    |
| remove   | random | A       | scaleDown     | 10,000 |    32,536 |       30.735 |       30.735 |         30.735 |     0.000 | 0: 30.735    | 0: 30.735    |
| remove   | random | A       | fullLifecycle | 20,000 |    40,760 |       24.534 |       24.534 |         24.534 |     0.000 | 0: 24.534    | 0: 24.534    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   245,693 |        4.070 |        4.070 |          4.070 |     0.000 | 0: 4.070     | 0: 4.070     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   245,693 |        4.070 |        4.070 |          4.070 |     0.000 | 0: 4.070     | 0: 4.070     |
| replace  | head   | A       | scaleUp       | 10,000 |   290,207 |        3.446 |        3.446 |          3.446 |     0.000 | 0: 3.446     | 0: 3.446     |
| replace  | head   | A       | scaleDown     | 10,000 |   184,043 |        5.434 |        5.434 |          5.434 |     0.000 | 0: 5.434     | 0: 5.434     |
| replace  | head   | A       | fullLifecycle | 20,000 |   225,242 |        4.440 |        4.440 |          4.440 |     0.000 | 0: 4.440     | 0: 4.440     |
| replace  | random | A       | scaleUp       | 10,000 |    61,972 |       16.136 |       16.136 |         16.136 |     0.000 | 0: 16.136    | 0: 16.136    |
| replace  | random | A       | scaleDown     | 10,000 |    31,973 |       31.277 |       31.277 |         31.277 |     0.000 | 0: 31.277    | 0: 31.277    |
| replace  | random | A       | fullLifecycle | 20,000 |    42,183 |       23.707 |       23.707 |         23.707 |     0.000 | 0: 23.707    | 0: 23.707    |
| replace  | tail   | A       | scaleUp       | 10,000 |   338,718 |        2.952 |        2.952 |          2.952 |     0.000 | 0: 2.952     | 0: 2.952     |
| replace  | tail   | A       | scaleDown     | 10,000 |   214,995 |        4.651 |        4.651 |          4.651 |     0.000 | 0: 4.651     | 0: 4.651     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   263,034 |        3.802 |        3.802 |          3.802 |     0.000 | 0: 3.802     | 0: 3.802     |
| sequence | —      | A       | scaleUp       |      5 |        91 |    10938.420 |    10938.420 |      10938.420 |     0.000 | 0: 10938.420 | 0: 10938.420 |
| sequence | —      | A       | scaleDown     |      5 |        20 |    50598.340 |    50598.340 |      50598.340 |     0.000 | 0: 50598.340 | 0: 50598.340 |
| sequence | —      | A       | fullLifecycle |     10 |        33 |    30768.380 |    30768.380 |      30768.380 |     0.000 | 0: 30768.380 | 0: 30768.380 |
| value    | head   | A       | scaleUp       | 10,000 | 2,468,526 |        0.405 |        0.405 |          0.405 |     0.000 | 0: 0.405     | 0: 0.405     |
| value    | head   | A       | scaleDown     | 10,000 | 1,151,729 |        0.868 |        0.868 |          0.868 |     0.000 | 0: 0.868     | 0: 0.868     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,570,648 |        0.637 |        0.637 |          0.637 |     0.000 | 0: 0.637     | 0: 0.637     |
| value    | random | A       | scaleUp       | 10,000 |    75,888 |       13.177 |       13.177 |         13.177 |     0.000 | 0: 13.177    | 0: 13.177    |
| value    | random | A       | scaleDown     | 10,000 |    36,743 |       27.216 |       27.216 |         27.216 |     0.000 | 0: 27.216    | 0: 27.216    |
| value    | random | A       | fullLifecycle | 20,000 |    49,513 |       20.197 |       20.197 |         20.197 |     0.000 | 0: 20.197    | 0: 20.197    |
| value    | tail   | A       | scaleUp       | 10,000 | 3,457,695 |        0.289 |        0.289 |          0.289 |     0.000 | 0: 0.289     | 0: 0.289     |
| value    | tail   | A       | scaleDown     | 10,000 | 1,586,647 |        0.630 |        0.630 |          0.630 |     0.000 | 0: 0.630     | 0: 0.630     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,175,166 |        0.460 |        0.460 |          0.460 |     0.000 | 0: 0.460     | 0: 0.460     |
| values   | —      | A       | scaleUp       |      5 |       304 |     3287.060 |     3287.060 |       3287.060 |     0.000 | 0: 3287.060  | 0: 3287.060  |
| values   | —      | A       | scaleDown     |      5 |       768 |     1302.040 |     1302.040 |       1302.040 |     0.000 | 0: 1302.040  | 0: 1302.040  |
| values   | —      | A       | fullLifecycle |     10 |       436 |     2294.550 |     2294.550 |       2294.550 |     0.000 | 0: 2294.550  | 0: 2294.550  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    68,966 | 14.500 | 14.500 |    14.500 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   108,108 |  9.250 |  8.100 |    14.500 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   106,952 |  9.350 |  5.200 |   104.300 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    95,242 | 10.500 |  3.400 |   384.700 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    32,484 | 30.784 |  3.400 |  4022.700 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    21,400 | 46.730 |  3.400 |  4022.700 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    21,625 | 46.243 |  3.400 |  4022.700 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    21,686 | 46.112 |  3.300 |  4022.700 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    21,622 | 46.250 |  3.300 |  4022.700 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    21,622 | 46.250 |  3.300 |  4022.700 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   268,817 |  3.720 |  1.400 |    11.500 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   498,008 |  2.008 |  1.300 |    11.500 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   903,506 |  1.107 |  0.500 |    15.700 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   782,362 |  1.278 |  0.500 |    74.600 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   782,362 |  1.278 |  0.500 |    74.600 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   782,362 |  1.278 |  0.500 |    74.600 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   782,362 |  1.278 |  0.500 |    74.600 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   782,362 |  1.278 |  0.500 |    74.600 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   782,362 |  1.278 |  0.500 |    74.600 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   416,667 |  2.400 |  2.400 |     2.400 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   483,092 |  2.070 |  1.500 |     3.900 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   436,681 |  2.290 |  1.500 |    16.700 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   335,931 |  2.977 |  0.600 |   343.500 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    87,623 | 11.413 |  0.600 |  2991.100 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    49,432 | 20.230 |  0.600 | 19850.500 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    50,111 | 19.956 |  0.600 | 19850.500 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    50,252 | 19.900 |  0.600 | 19850.500 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    50,273 | 19.891 |  0.600 | 19850.500 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    50,275 | 19.891 |  0.600 | 19850.500 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   147,059 |  6.800 |  6.800 |     6.800 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   384,615 |  2.600 |  1.500 |     6.800 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |    97,163 | 10.292 |  1.200 |   421.300 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   496,771 |  2.013 |  0.400 |   421.300 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   858,929 |  1.164 |  0.400 |   421.300 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   858,929 |  1.164 |  0.400 |   421.300 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   858,929 |  1.164 |  0.400 |   421.300 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   858,929 |  1.164 |  0.400 |   421.300 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   858,929 |  1.164 |  0.400 |   421.300 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   858,929 |  1.164 |  0.400 |   421.300 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   263,807 |  3.791 |  1.600 |   152.200 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   269,235 |  3.714 |  1.600 |   152.200 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   269,918 |  3.705 |  1.600 |   152.200 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   269,843 |  3.706 |  1.600 |   152.200 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   269,843 |  3.706 |  1.600 |   152.200 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   196,078 |  5.100 |  5.100 |     5.100 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   255,102 |  3.920 |  3.600 |     5.100 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   227,531 |  4.395 |  2.200 |    32.600 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   175,939 |  5.684 |  1.700 |  1077.800 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    54,546 | 18.333 |  1.400 | 24932.100 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    40,118 | 24.926 |  1.400 | 24932.100 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    40,621 | 24.618 |  1.400 | 24932.100 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    40,742 | 24.544 |  1.400 | 24932.100 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    40,758 | 24.535 |  1.400 | 24932.100 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    40,760 | 24.534 |  1.400 | 24932.100 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   237,582 |  4.209 |  1.700 |   729.100 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   244,747 |  4.086 |  1.700 |   729.100 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   245,582 |  4.072 |  1.600 |   729.100 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   245,689 |  4.070 |  1.600 |   729.100 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   245,693 |  4.070 |  1.600 |   729.100 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    45,872 | 21.800 | 21.800 |    21.800 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   131,579 |  7.600 |  4.700 |    21.800 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   201,776 |  4.956 |  2.700 |    23.700 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   270,029 |  3.703 |  1.800 |    85.900 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   290,207 |  3.446 |  1.800 |  1170.400 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   246,690 |  4.054 |  1.800 |  1170.400 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   246,391 |  4.059 |  1.800 |  1170.400 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   246,276 |  4.060 |  1.800 |  1170.400 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   246,033 |  4.064 |  1.800 |  1170.400 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   225,242 |  4.440 |  1.800 |  7507.500 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   151,515 |  6.600 |  6.600 |     6.600 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   193,798 |  5.160 |  4.300 |     6.600 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   203,998 |  4.902 |  2.800 |    18.600 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   177,936 |  5.620 |  2.200 |    89.900 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    61,972 | 16.136 |  1.800 |   661.900 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    41,675 | 23.995 |  1.800 |  6611.400 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    42,048 | 23.782 |  1.800 |  6611.400 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    42,164 | 23.717 |  1.800 |  6611.400 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    42,181 | 23.707 |  1.800 |  6611.400 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    42,183 | 23.707 |  1.800 |  6611.400 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   181,818 |  5.500 |  5.500 |     5.500 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   211,416 |  4.730 |  4.300 |     5.500 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   221,533 |  4.514 |  2.500 |    44.900 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   257,380 |  3.885 |  1.900 |   371.700 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   338,718 |  2.952 |  1.600 |   371.700 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   262,891 |  3.804 |  1.600 |  3336.100 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   262,865 |  3.804 |  1.600 |  3336.100 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   263,081 |  3.801 |  1.600 |  3336.100 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   263,117 |  3.801 |  1.600 |  3336.100 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   263,034 |  3.802 |  1.600 |  3336.100 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   400,000 |  2.500 |  2.500 |     2.500 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,063,830 |  0.940 |  0.600 |     2.500 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,392,344 |  0.418 |  0.200 |     2.500 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,474,635 |  0.404 |  0.100 |    24.000 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,468,526 |  0.405 |  0.100 |    24.000 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,568,783 |  0.637 |  0.100 |    83.800 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,581,964 |  0.632 |  0.100 |    83.800 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 1,583,128 |  0.632 |  0.100 |    83.800 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 1,582,713 |  0.632 |  0.100 |    83.800 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,570,648 |  0.637 |  0.100 |    97.700 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,428,571 |  0.700 |  0.700 |     0.700 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,083,333 |  0.480 |  0.300 |     0.800 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,273,885 |  0.785 |  0.200 |     5.000 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   452,386 |  2.211 |  0.100 |    26.000 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    75,888 | 13.177 |  0.100 |   247.800 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    48,800 | 20.492 |  0.100 |  1086.900 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    49,348 | 20.264 |  0.100 |  1086.900 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    49,492 | 20.205 |  0.100 |  1086.900 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    49,514 | 20.196 |  0.100 |  1086.900 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    49,513 | 20.197 |  0.100 |  1086.900 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |     0.600 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 2,500,000 |  0.400 |  0.300 |     0.600 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 4,784,689 |  0.209 |  0.100 |     0.600 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 3,998,401 |  0.250 |  0.100 |     5.300 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,457,695 |  0.289 |  0.100 |    70.300 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,164,502 |  0.462 |  0.100 |    70.300 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,175,672 |  0.460 |  0.100 |    70.300 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,179,222 |  0.459 |  0.100 |    70.300 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,179,846 |  0.459 |  0.100 |    70.300 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,175,166 |  0.460 |  0.100 |    70.300 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  16,181 |    61.800 |
| create   | —    |   0 | up        |     10 | A       |     1 |  21,413 |    46.700 |
| create   | —    |   0 | up        |    100 | A       |     1 |   9,930 |   100.700 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,811 |   355.800 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     289 |  3457.500 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,415 |   414.000 |
| create   | —    |   0 | down      |    100 | A       |     1 |   8,993 |   111.200 |
| create   | —    |   0 | down      |     10 | A       |     1 |  11,416 |    87.600 |
| create   | —    |   0 | down      |      1 | A       |     1 |  26,667 |    37.500 |
| create   | —    |   0 | down      |      0 | A       |     1 |  25,381 |    39.400 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   4,509 |   221.800 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  16,026 |    62.400 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   3,857 |   259.300 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     486 |  2059.700 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      19 | 52088.900 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      15 | 64995.800 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      18 | 55469.800 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      17 | 60235.800 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      14 | 72270.400 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  50,251 |    19.900 |
| values   | —    |   0 | up        |      1 | A       |     1 |  12,453 |    80.300 |
| values   | —    |   0 | up        |     10 | A       |     1 |  24,331 |    41.100 |
| values   | —    |   0 | up        |    100 | A       |     1 |   2,670 |   374.600 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     457 |  2188.200 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      73 | 13751.100 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     167 |  5976.100 |
| values   | —    |   0 | down      |    100 | A       |     1 |   2,497 |   400.500 |
| values   | —    |   0 | down      |     10 | A       |     1 |  13,643 |    73.300 |
| values   | —    |   0 | down      |      1 | A       |     1 |  32,680 |    30.600 |
| values   | —    |   0 | down      |      0 | A       |     1 |  33,670 |    29.700 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  85,872,640 |         9,859,808 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,640,256 |        10,006,840 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,569,472 |        10,657,144 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 101,720,064 |        15,597,472 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 309,231,616 |        64,600,392 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 401,244,160 |       109,766,392 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 404,910,080 |       114,577,752 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 406,028,288 |       115,012,512 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 405,864,448 |       115,079,528 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 405,225,472 |       115,032,472 |

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
