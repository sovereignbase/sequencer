# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:47:47.989Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    39,188 |       25.518 |       25.518 |         25.518 |     0.000 | 0: 25.518    | 0: 25.518    |
| apply    | random | A       | scaleDown     |  9,999 |    24,668 |       40.538 |       40.538 |         40.538 |     0.000 | 0: 40.538    | 0: 40.538    |
| apply    | random | A       | fullLifecycle | 19,999 |    30,278 |       33.028 |       33.028 |         33.028 |     0.000 | 0: 33.028    | 0: 33.028    |
| create   | —      | A       | scaleUp       |      6 |     1,425 |      701.633 |      701.633 |        701.633 |     0.000 | 0: 701.633   | 0: 701.633   |
| create   | —      | A       | scaleDown     |      5 |     8,720 |      114.680 |      114.680 |        114.680 |     0.000 | 0: 114.680   | 0: 114.680   |
| create   | —      | A       | fullLifecycle |     11 |     2,300 |      434.836 |      434.836 |        434.836 |     0.000 | 0: 434.836   | 0: 434.836   |
| insert   | head   | A       | scaleUp       |  5,000 |   928,436 |        1.077 |        1.077 |          1.077 |     0.000 | 0: 1.077     | 0: 1.077     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   928,436 |        1.077 |        1.077 |          1.077 |     0.000 | 0: 1.077     | 0: 1.077     |
| insert   | random | A       | scaleUp       | 10,000 |   105,012 |        9.523 |        9.523 |          9.523 |     0.000 | 0: 9.523     | 0: 9.523     |
| insert   | random | A       | scaleDown     | 10,000 |    64,104 |       15.600 |       15.600 |         15.600 |     0.000 | 0: 15.600    | 0: 15.600    |
| insert   | random | A       | fullLifecycle | 20,000 |    79,610 |       12.561 |       12.561 |         12.561 |     0.000 | 0: 12.561    | 0: 12.561    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,122,032 |        0.891 |        0.891 |          0.891 |     0.000 | 0: 0.891     | 0: 0.891     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,122,032 |        0.891 |        0.891 |          0.891 |     0.000 | 0: 0.891     | 0: 0.891     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   358,546 |        2.789 |        2.789 |          2.789 |     0.000 | 0: 2.789     | 0: 2.789     |
| remove   | head   | A       | fullLifecycle |  5,000 |   358,546 |        2.789 |        2.789 |          2.789 |     0.000 | 0: 2.789     | 0: 2.789     |
| remove   | random | A       | scaleUp       | 10,000 |    73,577 |       13.591 |       13.591 |         13.591 |     0.000 | 0: 13.591    | 0: 13.591    |
| remove   | random | A       | scaleDown     | 10,000 |    48,868 |       20.463 |       20.463 |         20.463 |     0.000 | 0: 20.463    | 0: 20.463    |
| remove   | random | A       | fullLifecycle | 20,000 |    58,729 |       17.027 |       17.027 |         17.027 |     0.000 | 0: 17.027    | 0: 17.027    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   386,357 |        2.588 |        2.588 |          2.588 |     0.000 | 0: 2.588     | 0: 2.588     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   386,357 |        2.588 |        2.588 |          2.588 |     0.000 | 0: 2.588     | 0: 2.588     |
| replace  | head   | A       | scaleUp       | 10,000 |   256,050 |        3.905 |        3.905 |          3.905 |     0.000 | 0: 3.905     | 0: 3.905     |
| replace  | head   | A       | scaleDown     | 10,000 |   246,553 |        4.056 |        4.056 |          4.056 |     0.000 | 0: 4.056     | 0: 4.056     |
| replace  | head   | A       | fullLifecycle | 20,000 |   251,211 |        3.981 |        3.981 |          3.981 |     0.000 | 0: 3.981     | 0: 3.981     |
| replace  | random | A       | scaleUp       | 10,000 |    71,699 |       13.947 |       13.947 |         13.947 |     0.000 | 0: 13.947    | 0: 13.947    |
| replace  | random | A       | scaleDown     | 10,000 |    46,016 |       21.732 |       21.732 |         21.732 |     0.000 | 0: 21.732    | 0: 21.732    |
| replace  | random | A       | fullLifecycle | 20,000 |    56,056 |       17.839 |       17.839 |         17.839 |     0.000 | 0: 17.839    | 0: 17.839    |
| replace  | tail   | A       | scaleUp       | 10,000 |   361,060 |        2.770 |        2.770 |          2.770 |     0.000 | 0: 2.770     | 0: 2.770     |
| replace  | tail   | A       | scaleDown     | 10,000 |   312,873 |        3.196 |        3.196 |          3.196 |     0.000 | 0: 3.196     | 0: 3.196     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   335,244 |        2.983 |        2.983 |          2.983 |     0.000 | 0: 2.983     | 0: 2.983     |
| sequence | —      | A       | scaleUp       |      5 |       164 |     6086.360 |     6086.360 |       6086.360 |     0.000 | 0: 6086.360  | 0: 6086.360  |
| sequence | —      | A       | scaleDown     |      5 |        23 |    44403.440 |    44403.440 |      44403.440 |     0.000 | 0: 44403.440 | 0: 44403.440 |
| sequence | —      | A       | fullLifecycle |     10 |        40 |    25244.900 |    25244.900 |      25244.900 |     0.000 | 0: 25244.900 | 0: 25244.900 |
| value    | head   | A       | scaleUp       | 10,000 | 2,797,751 |        0.357 |        0.357 |          0.357 |     0.000 | 0: 0.357     | 0: 0.357     |
| value    | head   | A       | scaleDown     | 10,000 | 1,909,235 |        0.524 |        0.524 |          0.524 |     0.000 | 0: 0.524     | 0: 0.524     |
| value    | head   | A       | fullLifecycle | 20,000 | 2,269,632 |        0.441 |        0.441 |          0.441 |     0.000 | 0: 0.441     | 0: 0.441     |
| value    | random | A       | scaleUp       | 10,000 |    91,847 |       10.888 |       10.888 |         10.888 |     0.000 | 0: 10.888    | 0: 10.888    |
| value    | random | A       | scaleDown     | 10,000 |    60,623 |       16.495 |       16.495 |         16.495 |     0.000 | 0: 16.495    | 0: 16.495    |
| value    | random | A       | fullLifecycle | 20,000 |    73,038 |       13.692 |       13.692 |         13.692 |     0.000 | 0: 13.692    | 0: 13.692    |
| value    | tail   | A       | scaleUp       | 10,000 | 3,900,612 |        0.256 |        0.256 |          0.256 |     0.000 | 0: 0.256     | 0: 0.256     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,264,800 |        0.442 |        0.442 |          0.442 |     0.000 | 0: 0.442     | 0: 0.442     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,865,699 |        0.349 |        0.349 |          0.349 |     0.000 | 0: 0.349     | 0: 0.349     |
| values   | —      | A       | scaleUp       |      5 |       399 |     2507.420 |     2507.420 |       2507.420 |     0.000 | 0: 2507.420  | 0: 2507.420  |
| values   | —      | A       | scaleDown     |      5 |     1,683 |      594.080 |      594.080 |        594.080 |     0.000 | 0: 594.080   | 0: 594.080   |
| values   | —      | A       | fullLifecycle |     10 |       645 |     1550.750 |     1550.750 |       1550.750 |     0.000 | 0: 1550.750  | 0: 1550.750  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |   104,167 |  9.600 |  9.600 |     9.600 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    50,277 | 19.890 |  9.600 |    55.400 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    89,969 | 11.115 |  5.200 |    84.200 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    90,134 | 11.095 |  3.700 |  1217.700 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    39,188 | 25.518 |  3.400 |  1217.700 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    30,252 | 33.055 |  3.400 |  1217.700 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    30,328 | 32.973 |  3.400 |  1217.700 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    30,405 | 32.889 |  3.200 |  1217.700 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    30,278 | 33.028 |  3.200 |  3007.400 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    30,278 | 33.028 |  3.200 |  3007.400 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   161,812 |  6.180 |  2.400 |    18.900 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   433,651 |  2.306 |  1.300 |    18.900 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   820,883 |  1.218 |  0.500 |    23.500 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   928,436 |  1.077 |  0.500 |    58.900 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   928,436 |  1.077 |  0.500 |    58.900 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   928,436 |  1.077 |  0.500 |    58.900 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   928,436 |  1.077 |  0.500 |    58.900 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   928,436 |  1.077 |  0.500 |    58.900 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   928,436 |  1.077 |  0.500 |    58.900 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   500,000 |  2.000 |  2.000 |     2.000 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   311,526 |  3.210 |  2.000 |     5.900 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   412,031 |  2.427 |  1.200 |    11.300 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   325,055 |  3.076 |  0.700 |   414.200 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   105,012 |  9.523 |  0.700 |  2033.800 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    79,135 | 12.637 |  0.700 |  2033.800 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    79,391 | 12.596 |  0.700 |  2033.800 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    79,574 | 12.567 |  0.700 |  2033.800 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    79,607 | 12.562 |  0.700 |  2033.800 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    79,610 | 12.561 |  0.700 |  2033.800 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   147,059 |  6.800 |  6.800 |     6.800 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   271,739 |  3.680 |  2.400 |     6.800 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   508,130 |  1.968 |  1.100 |     8.400 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   832,917 |  1.201 |  0.400 |    24.500 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,122,032 |  0.891 |  0.400 |    84.900 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,122,032 |  0.891 |  0.400 |    84.900 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,122,032 |  0.891 |  0.400 |    84.900 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,122,032 |  0.891 |  0.400 |    84.900 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,122,032 |  0.891 |  0.400 |    84.900 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,122,032 |  0.891 |  0.400 |    84.900 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   354,244 |  2.823 |  1.600 |   907.200 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   357,669 |  2.796 |  1.500 |   907.200 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   358,445 |  2.790 |  1.500 |   907.200 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   358,546 |  2.789 |  1.500 |   907.200 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   358,546 |  2.789 |  1.500 |   907.200 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   285,714 |  3.500 |  3.500 |     3.500 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   129,199 |  7.740 |  3.500 |    12.000 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   228,624 |  4.374 |  2.200 |    25.000 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   176,053 |  5.680 |  1.500 |  1444.100 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    73,577 | 13.591 |  1.500 |  1444.100 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    58,625 | 17.058 |  1.500 |  1444.100 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    58,560 | 17.076 |  1.500 |  1444.100 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    58,707 | 17.034 |  1.400 |  1444.100 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    58,727 | 17.028 |  1.400 |  1444.100 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    58,729 | 17.027 |  1.400 |  1444.100 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   386,771 |  2.586 |  1.600 |    47.700 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   385,848 |  2.592 |  1.600 |    47.700 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   386,311 |  2.589 |  1.400 |    47.700 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   386,375 |  2.588 |  1.400 |    47.700 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   386,357 |  2.588 |  1.400 |    47.700 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    62,893 | 15.900 | 15.900 |    15.900 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    90,580 | 11.040 |  7.800 |    24.600 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   187,091 |  5.345 |  2.800 |    29.800 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   286,377 |  3.492 |  2.000 |    66.100 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   256,050 |  3.905 |  1.900 |  5577.100 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   263,703 |  3.792 |  1.800 |  5577.100 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   264,332 |  3.783 |  1.800 |  5577.100 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   264,306 |  3.783 |  1.700 |  5577.100 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   264,020 |  3.788 |  1.700 |  5577.100 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   251,211 |  3.981 |  1.700 |  5577.100 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   217,391 |  4.600 |  4.600 |     4.600 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   113,895 |  8.780 |  4.600 |    13.200 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   184,366 |  5.424 |  2.900 |    33.200 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   145,362 |  6.879 |  2.000 |  1754.700 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    71,699 | 13.947 |  1.700 |  1754.700 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    55,590 | 17.989 |  1.700 | 16161.900 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    55,886 | 17.893 |  1.700 | 16161.900 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    56,034 | 17.846 |  1.600 | 16161.900 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    56,055 | 17.840 |  1.600 | 16161.900 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    56,056 | 17.839 |  1.600 | 16161.900 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   285,714 |  3.500 |  3.500 |     3.500 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   113,507 |  8.810 |  3.500 |    13.700 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   190,876 |  5.239 |  2.600 |    37.600 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   237,372 |  4.213 |  1.800 |   629.500 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   361,060 |  2.770 |  1.600 |   629.500 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   336,022 |  2.976 |  1.600 |  2417.100 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   335,130 |  2.984 |  1.600 |  2417.100 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   335,235 |  2.983 |  1.600 |  2417.100 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   335,256 |  2.983 |  1.600 |  2417.100 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   335,244 |  2.983 |  1.600 |  2417.100 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   370,370 |  2.700 |  2.700 |     2.700 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   628,931 |  1.590 |  1.000 |     4.200 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,032,520 |  0.492 |  0.200 |     4.200 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,462,448 |  0.406 |  0.200 |    25.500 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,797,751 |  0.357 |  0.100 |    25.500 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,306,161 |  0.434 |  0.100 |    25.500 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,310,005 |  0.433 |  0.100 |    25.500 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,310,876 |  0.433 |  0.100 |    25.500 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,309,700 |  0.433 |  0.100 |    25.500 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 2,269,632 |  0.441 |  0.100 |   153.300 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 2,500,000 |  0.400 |  0.400 |     0.400 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 1,030,928 |  0.970 |  0.400 |     2.900 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,223,990 |  0.817 |  0.100 |     2.900 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   475,240 |  2.104 |  0.100 |    36.400 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    91,847 | 10.888 |  0.100 |   134.500 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    72,531 | 13.787 |  0.100 |   487.200 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    72,802 | 13.736 |  0.100 |   487.200 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    73,009 | 13.697 |  0.100 |   487.200 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    73,041 | 13.691 |  0.100 |   487.200 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    73,038 | 13.692 |  0.100 |   487.200 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 2,500,000 |  0.400 |  0.400 |     0.400 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 1,388,889 |  0.720 |  0.400 |     1.100 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 3,861,004 |  0.259 |  0.100 |     1.200 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 4,391,744 |  0.228 |  0.100 |     3.600 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,900,612 |  0.256 |  0.100 |     4.800 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,871,565 |  0.348 |  0.100 |    14.700 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,868,510 |  0.349 |  0.100 |    14.700 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,871,013 |  0.348 |  0.100 |    14.700 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,871,728 |  0.348 |  0.100 |    14.700 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,865,699 |  0.349 |  0.100 |    15.000 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  11,038 |    90.600 |
| create   | —    |   0 | up        |     10 | A       |     1 |  28,736 |    34.800 |
| create   | —    |   0 | up        |    100 | A       |     1 |  13,089 |    76.400 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,594 |   385.500 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     343 |  2914.100 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,737 |   365.400 |
| create   | —    |   0 | down      |    100 | A       |     1 |  11,669 |    85.700 |
| create   | —    |   0 | down      |     10 | A       |     1 |  25,641 |    39.000 |
| create   | —    |   0 | down      |      1 | A       |     1 |  28,329 |    35.300 |
| create   | —    |   0 | down      |      0 | A       |     1 |  20,833 |    48.000 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   3,527 |   283.500 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  13,210 |    75.700 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   5,659 |   176.700 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     404 |  2475.600 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      36 | 27420.300 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      21 | 48264.400 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      19 | 52975.500 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      19 | 53077.900 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      15 | 67678.600 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  48,077 |    20.800 |
| values   | —    |   0 | up        |      1 | A       |     1 |   9,921 |   100.800 |
| values   | —    |   0 | up        |     10 | A       |     1 |  24,155 |    41.400 |
| values   | —    |   0 | up        |    100 | A       |     1 |   4,941 |   202.400 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     381 |  2623.100 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     104 |  9569.400 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     431 |  2318.600 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,844 |   542.200 |
| values   | —    |   0 | down      |     10 | A       |     1 |  22,026 |    45.400 |
| values   | —    |   0 | down      |      1 | A       |     1 |  33,898 |    29.500 |
| values   | —    |   0 | down      |      0 | A       |     1 |  28,818 |    34.700 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  84,942,848 |         9,872,384 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,668,928 |        10,023,080 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  79,544,320 |        10,656,904 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 101,089,280 |        15,597,392 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 304,611,328 |        64,597,448 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 402,092,032 |       109,763,328 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 407,048,192 |       114,572,072 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 407,351,296 |       115,012,016 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 407,740,416 |       115,076,464 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 407,318,528 |       114,910,072 |

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
