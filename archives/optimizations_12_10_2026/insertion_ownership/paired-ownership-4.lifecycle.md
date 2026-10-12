# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:01:29.722Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    40,640 |       24.606 |       24.606 |         24.606 |     0.000 | 0: 24.606    | 0: 24.606    |
| apply    | random | A       | scaleDown     |  9,999 |    22,408 |       44.628 |       44.628 |         44.628 |     0.000 | 0: 44.628    | 0: 44.628    |
| apply    | random | A       | fullLifecycle | 19,999 |    28,888 |       34.616 |       34.616 |         34.616 |     0.000 | 0: 34.616    | 0: 34.616    |
| create   | —      | A       | scaleUp       |      6 |     1,740 |      574.867 |      574.867 |        574.867 |     0.000 | 0: 574.867   | 0: 574.867   |
| create   | —      | A       | scaleDown     |      5 |     7,308 |      136.840 |      136.840 |        136.840 |     0.000 | 0: 136.840   | 0: 136.840   |
| create   | —      | A       | fullLifecycle |     11 |     2,661 |      375.764 |      375.764 |        375.764 |     0.000 | 0: 375.764   | 0: 375.764   |
| insert   | head   | A       | scaleUp       |  5,000 |   982,608 |        1.018 |        1.018 |          1.018 |     0.000 | 0: 1.018     | 0: 1.018     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   982,608 |        1.018 |        1.018 |          1.018 |     0.000 | 0: 1.018     | 0: 1.018     |
| insert   | random | A       | scaleUp       | 10,000 |   108,639 |        9.205 |        9.205 |          9.205 |     0.000 | 0: 9.205     | 0: 9.205     |
| insert   | random | A       | scaleDown     | 10,000 |    58,823 |       17.000 |       17.000 |         17.000 |     0.000 | 0: 17.000    | 0: 17.000    |
| insert   | random | A       | fullLifecycle | 20,000 |    76,322 |       13.102 |       13.102 |         13.102 |     0.000 | 0: 13.102    | 0: 13.102    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,202,935 |        0.831 |        0.831 |          0.831 |     0.000 | 0: 0.831     | 0: 0.831     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,202,935 |        0.831 |        0.831 |          0.831 |     0.000 | 0: 0.831     | 0: 0.831     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   364,841 |        2.741 |        2.741 |          2.741 |     0.000 | 0: 2.741     | 0: 2.741     |
| remove   | head   | A       | fullLifecycle |  5,000 |   364,841 |        2.741 |        2.741 |          2.741 |     0.000 | 0: 2.741     | 0: 2.741     |
| remove   | random | A       | scaleUp       | 10,000 |    76,453 |       13.080 |       13.080 |         13.080 |     0.000 | 0: 13.080    | 0: 13.080    |
| remove   | random | A       | scaleDown     | 10,000 |    45,323 |       22.064 |       22.064 |         22.064 |     0.000 | 0: 22.064    | 0: 22.064    |
| remove   | random | A       | fullLifecycle | 20,000 |    56,909 |       17.572 |       17.572 |         17.572 |     0.000 | 0: 17.572    | 0: 17.572    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   370,373 |        2.700 |        2.700 |          2.700 |     0.000 | 0: 2.700     | 0: 2.700     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   370,373 |        2.700 |        2.700 |          2.700 |     0.000 | 0: 2.700     | 0: 2.700     |
| replace  | head   | A       | scaleUp       | 10,000 |   358,153 |        2.792 |        2.792 |          2.792 |     0.000 | 0: 2.792     | 0: 2.792     |
| replace  | head   | A       | scaleDown     | 10,000 |   268,245 |        3.728 |        3.728 |          3.728 |     0.000 | 0: 3.728     | 0: 3.728     |
| replace  | head   | A       | fullLifecycle | 20,000 |   306,747 |        3.260 |        3.260 |          3.260 |     0.000 | 0: 3.260     | 0: 3.260     |
| replace  | random | A       | scaleUp       | 10,000 |    73,700 |       13.568 |       13.568 |         13.568 |     0.000 | 0: 13.568    | 0: 13.568    |
| replace  | random | A       | scaleDown     | 10,000 |    42,445 |       23.560 |       23.560 |         23.560 |     0.000 | 0: 23.560    | 0: 23.560    |
| replace  | random | A       | fullLifecycle | 20,000 |    53,867 |       18.564 |       18.564 |         18.564 |     0.000 | 0: 18.564    | 0: 18.564    |
| replace  | tail   | A       | scaleUp       | 10,000 |   404,068 |        2.475 |        2.475 |          2.475 |     0.000 | 0: 2.475     | 0: 2.475     |
| replace  | tail   | A       | scaleDown     | 10,000 |   282,603 |        3.539 |        3.539 |          3.539 |     0.000 | 0: 3.539     | 0: 3.539     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   332,593 |        3.007 |        3.007 |          3.007 |     0.000 | 0: 3.007     | 0: 3.007     |
| sequence | —      | A       | scaleUp       |      5 |       158 |     6346.800 |     6346.800 |       6346.800 |     0.000 | 0: 6346.800  | 0: 6346.800  |
| sequence | —      | A       | scaleDown     |      5 |        22 |    44845.300 |    44845.300 |      44845.300 |     0.000 | 0: 44845.300 | 0: 44845.300 |
| sequence | —      | A       | fullLifecycle |     10 |        39 |    25596.050 |    25596.050 |      25596.050 |     0.000 | 0: 25596.050 | 0: 25596.050 |
| value    | head   | A       | scaleUp       | 10,000 | 3,235,722 |        0.309 |        0.309 |          0.309 |     0.000 | 0: 0.309     | 0: 0.309     |
| value    | head   | A       | scaleDown     | 10,000 | 1,779,391 |        0.562 |        0.562 |          0.562 |     0.000 | 0: 0.562     | 0: 0.562     |
| value    | head   | A       | fullLifecycle | 20,000 | 2,296,106 |        0.436 |        0.436 |          0.436 |     0.000 | 0: 0.436     | 0: 0.436     |
| value    | random | A       | scaleUp       | 10,000 |    93,307 |       10.717 |       10.717 |         10.717 |     0.000 | 0: 10.717    | 0: 10.717    |
| value    | random | A       | scaleDown     | 10,000 |    56,510 |       17.696 |       17.696 |         17.696 |     0.000 | 0: 17.696    | 0: 17.696    |
| value    | random | A       | fullLifecycle | 20,000 |    70,390 |       14.207 |       14.207 |         14.207 |     0.000 | 0: 14.207    | 0: 14.207    |
| value    | tail   | A       | scaleUp       | 10,000 | 4,337,078 |        0.231 |        0.231 |          0.231 |     0.000 | 0: 0.231     | 0: 0.231     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,177,511 |        0.459 |        0.459 |          0.459 |     0.000 | 0: 0.459     | 0: 0.459     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,899,349 |        0.345 |        0.345 |          0.345 |     0.000 | 0: 0.345     | 0: 0.345     |
| values   | —      | A       | scaleUp       |      5 |       405 |     2469.500 |     2469.500 |       2469.500 |     0.000 | 0: 2469.500  | 0: 2469.500  |
| values   | —      | A       | scaleDown     |      5 |     1,662 |      601.760 |      601.760 |        601.760 |     0.000 | 0: 601.760   | 0: 601.760   |
| values   | —      | A       | fullLifecycle |     10 |       651 |     1535.630 |     1535.630 |       1535.630 |     0.000 | 0: 1535.630  | 0: 1535.630  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |   144,928 |  6.900 |  6.900 |     6.900 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   131,926 |  7.580 |  6.600 |     8.700 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   141,004 |  7.092 |  3.800 |    52.500 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   128,783 |  7.765 |  2.600 |   324.200 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    40,640 | 24.606 |  2.600 |   623.700 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    28,747 | 34.786 |  2.600 |   902.600 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    28,945 | 34.549 |  2.600 |  1138.700 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    29,017 | 34.462 |  2.600 |  1138.700 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    28,888 | 34.616 |  2.600 |  3349.300 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    28,888 | 34.616 |  2.600 |  3349.300 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   268,817 |  3.720 |  1.200 |    12.500 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   621,118 |  1.610 |  0.900 |    12.500 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,039,717 |  0.962 |  0.400 |    18.100 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   982,608 |  1.018 |  0.400 |    48.900 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   982,608 |  1.018 |  0.400 |    48.900 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   982,608 |  1.018 |  0.400 |    48.900 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   982,608 |  1.018 |  0.400 |    48.900 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   982,608 |  1.018 |  0.400 |    48.900 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   982,608 |  1.018 |  0.400 |    48.900 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   769,231 |  1.300 |  1.300 |     1.300 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   636,943 |  1.570 |  1.000 |     3.500 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   552,486 |  1.810 |  0.900 |    29.700 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   419,463 |  2.384 |  0.600 |   312.500 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   108,639 |  9.205 |  0.400 |  1642.700 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    75,589 | 13.230 |  0.400 |  1642.700 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    76,123 | 13.137 |  0.400 |  1642.700 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    76,288 | 13.108 |  0.400 |  1642.700 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    76,319 | 13.103 |  0.400 |  1642.700 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    76,322 | 13.102 |  0.400 |  1642.700 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   277,778 |  3.600 |  3.600 |     3.600 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   230,415 |  4.340 |  1.200 |    14.400 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   505,561 |  1.978 |  0.800 |    25.300 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,193,033 |  0.838 |  0.300 |    25.300 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,202,935 |  0.831 |  0.300 |    64.000 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,202,935 |  0.831 |  0.300 |    64.000 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,202,935 |  0.831 |  0.300 |    64.000 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,202,935 |  0.831 |  0.300 |    64.000 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,202,935 |  0.831 |  0.300 |    64.000 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,202,935 |  0.831 |  0.300 |    64.000 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   358,992 |  2.786 |  1.600 |    52.100 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   364,019 |  2.747 |  1.400 |    52.100 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   364,814 |  2.741 |  1.400 |    52.100 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   364,841 |  2.741 |  1.400 |    52.100 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   364,841 |  2.741 |  1.400 |    52.100 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   357,143 |  2.800 |  2.800 |     2.800 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   289,855 |  3.450 |  2.800 |     4.300 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   361,011 |  2.770 |  1.600 |     6.500 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   253,222 |  3.949 |  1.100 |   652.800 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    76,453 | 13.080 |  1.100 |   686.000 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    56,403 | 17.729 |  1.100 |  6407.700 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    56,753 | 17.620 |  1.100 |  6407.700 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    56,888 | 17.578 |  1.100 |  6407.700 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    56,907 | 17.573 |  1.100 |  6407.700 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    56,909 | 17.572 |  1.100 |  6407.700 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   365,476 |  2.736 |  1.600 |    50.000 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   369,552 |  2.706 |  1.500 |    50.000 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   370,346 |  2.700 |  1.400 |    50.000 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   370,370 |  2.700 |  1.400 |    50.000 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   370,373 |  2.700 |  1.400 |    50.000 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    91,743 | 10.900 | 10.900 |    10.900 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   181,818 |  5.500 |  3.500 |    10.900 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   278,940 |  3.585 |  2.000 |    22.800 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   387,177 |  2.583 |  1.500 |    31.100 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   358,153 |  2.792 |  1.500 |  1074.700 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   326,825 |  3.060 |  1.500 |  1074.700 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   325,064 |  3.076 |  1.500 |  1074.700 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   324,657 |  3.080 |  1.500 |  1074.700 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   324,085 |  3.086 |  1.500 |  1074.700 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   306,747 |  3.260 |  1.500 |  3491.100 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   303,030 |  3.300 |  3.300 |     3.300 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   261,780 |  3.820 |  3.200 |     4.800 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   279,799 |  3.574 |  2.000 |    31.100 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   255,389 |  3.916 |  1.600 |    53.300 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    73,700 | 13.568 |  1.600 |  2397.200 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    53,204 | 18.795 |  1.600 | 21164.500 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    53,720 | 18.615 |  1.600 | 21164.500 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    53,846 | 18.571 |  1.600 | 21164.500 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    53,866 | 18.565 |  1.600 | 21164.500 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    53,867 | 18.564 |  1.600 | 21164.500 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   384,615 |  2.600 |  2.600 |     2.600 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   273,973 |  3.650 |  2.600 |     5.100 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   285,307 |  3.505 |  1.700 |    43.600 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   353,544 |  2.829 |  1.400 |   333.500 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   404,068 |  2.475 |  1.400 |   333.500 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   334,287 |  2.991 |  1.400 |  2417.700 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   332,513 |  3.007 |  1.400 |  2417.700 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   332,606 |  3.007 |  1.400 |  2417.700 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   332,595 |  3.007 |  1.400 |  2417.700 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   332,593 |  3.007 |  1.400 |  2417.700 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   909,091 |  1.100 |  1.100 |     1.100 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,492,537 |  0.670 |  0.400 |     1.600 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 3,484,321 |  0.287 |  0.100 |     1.600 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 3,309,067 |  0.302 |  0.100 |    42.100 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,235,722 |  0.309 |  0.100 |    42.100 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,319,449 |  0.431 |  0.100 |    45.800 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,323,870 |  0.430 |  0.100 |    45.800 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,324,338 |  0.430 |  0.100 |    45.800 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,322,818 |  0.431 |  0.100 |    45.800 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 2,296,106 |  0.436 |  0.100 |   100.600 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 2,500,000 |  0.400 |  0.400 |     0.400 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,777,778 |  0.360 |  0.200 |     0.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,754,386 |  0.570 |  0.100 |     4.000 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   613,083 |  1.631 |  0.100 |    24.200 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    93,307 | 10.717 |  0.100 |   178.300 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    69,706 | 14.346 |  0.100 |   349.200 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    70,172 | 14.251 |  0.100 |   349.200 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    70,363 | 14.212 |  0.100 |   349.200 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    70,394 | 14.206 |  0.100 |   349.200 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    70,390 | 14.207 |  0.100 |   349.200 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |     0.300 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 2,777,778 |  0.360 |  0.200 |     0.900 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 3,401,361 |  0.294 |  0.100 |    13.500 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 5,720,824 |  0.175 |  0.100 |    13.500 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 4,337,078 |  0.231 |  0.100 |    60.500 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,914,200 |  0.343 |  0.100 |    60.500 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,915,623 |  0.343 |  0.100 |    60.500 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,907,806 |  0.344 |  0.100 |    60.500 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,908,226 |  0.344 |  0.100 |    60.500 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,899,349 |  0.345 |  0.100 |    60.500 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  18,587 |    53.800 |
| create   | —    |   0 | up        |     10 | A       |     1 |  22,989 |    43.500 |
| create   | —    |   0 | up        |    100 | A       |     1 |  16,313 |    61.300 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,758 |   362.600 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     363 |  2757.400 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,261 |   442.300 |
| create   | —    |   0 | down      |    100 | A       |     1 |  10,163 |    98.400 |
| create   | —    |   0 | down      |     10 | A       |     1 |  15,432 |    64.800 |
| create   | —    |   0 | down      |      1 | A       |     1 |  25,575 |    39.100 |
| create   | —    |   0 | down      |      0 | A       |     1 |  25,253 |    39.600 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   5,797 |   172.500 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  22,523 |    44.400 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   6,944 |   144.000 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     473 |  2116.000 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      34 | 29257.100 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      20 | 49216.900 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      17 | 57799.000 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      17 | 57193.400 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      17 | 59995.000 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  45,045 |    22.200 |
| values   | —    |   0 | up        |      1 | A       |     1 |  17,921 |    55.800 |
| values   | —    |   0 | up        |     10 | A       |     1 |  26,738 |    37.400 |
| values   | —    |   0 | up        |    100 | A       |     1 |   6,402 |   156.200 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     538 |  1858.100 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |      98 | 10240.000 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     386 |  2588.800 |
| values   | —    |   0 | down      |    100 | A       |     1 |   3,107 |   321.900 |
| values   | —    |   0 | down      |     10 | A       |     1 |  23,148 |    43.200 |
| values   | —    |   0 | down      |      1 | A       |     1 |  42,735 |    23.400 |
| values   | —    |   0 | down      |      0 | A       |     1 |  31,746 |    31.500 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  82,780,160 |         9,853,296 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,313,152 |        10,008,352 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  77,049,856 |        10,656,064 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,343,808 |        15,596,584 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 305,278,976 |        64,599,504 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 398,659,584 |       109,765,520 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 402,591,744 |       114,576,880 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 404,787,200 |       115,011,640 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 404,520,960 |       115,081,112 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 404,049,920 |       114,912,248 |

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
