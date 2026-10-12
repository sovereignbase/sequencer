# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:01:18.240Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    42,978 |       23.268 |       23.268 |         23.268 |     0.000 | 0: 23.268    | 0: 23.268    |
| apply    | random | A       | scaleDown     |  9,999 |    24,047 |       41.585 |       41.585 |         41.585 |     0.000 | 0: 41.585    | 0: 41.585    |
| apply    | random | A       | fullLifecycle | 19,999 |    30,840 |       32.426 |       32.426 |         32.426 |     0.000 | 0: 32.426    | 0: 32.426    |
| create   | —      | A       | scaleUp       |      6 |     1,575 |      634.917 |      634.917 |        634.917 |     0.000 | 0: 634.917   | 0: 634.917   |
| create   | —      | A       | scaleDown     |      5 |     8,726 |      114.600 |      114.600 |        114.600 |     0.000 | 0: 114.600   | 0: 114.600   |
| create   | —      | A       | fullLifecycle |     11 |     2,510 |      398.409 |      398.409 |        398.409 |     0.000 | 0: 398.409   | 0: 398.409   |
| insert   | head   | A       | scaleUp       |  5,000 |   956,681 |        1.045 |        1.045 |          1.045 |     0.000 | 0: 1.045     | 0: 1.045     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   956,681 |        1.045 |        1.045 |          1.045 |     0.000 | 0: 1.045     | 0: 1.045     |
| insert   | random | A       | scaleUp       | 10,000 |   114,296 |        8.749 |        8.749 |          8.749 |     0.000 | 0: 8.749     | 0: 8.749     |
| insert   | random | A       | scaleDown     | 10,000 |    59,569 |       16.787 |       16.787 |         16.787 |     0.000 | 0: 16.787    | 0: 16.787    |
| insert   | random | A       | fullLifecycle | 20,000 |    78,319 |       12.768 |       12.768 |         12.768 |     0.000 | 0: 12.768    | 0: 12.768    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,200,653 |        0.833 |        0.833 |          0.833 |     0.000 | 0: 0.833     | 0: 0.833     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,200,653 |        0.833 |        0.833 |          0.833 |     0.000 | 0: 0.833     | 0: 0.833     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   380,405 |        2.629 |        2.629 |          2.629 |     0.000 | 0: 2.629     | 0: 2.629     |
| remove   | head   | A       | fullLifecycle |  5,000 |   380,405 |        2.629 |        2.629 |          2.629 |     0.000 | 0: 2.629     | 0: 2.629     |
| remove   | random | A       | scaleUp       | 10,000 |    81,222 |       12.312 |       12.312 |         12.312 |     0.000 | 0: 12.312    | 0: 12.312    |
| remove   | random | A       | scaleDown     | 10,000 |    48,478 |       20.628 |       20.628 |         20.628 |     0.000 | 0: 20.628    | 0: 20.628    |
| remove   | random | A       | fullLifecycle | 20,000 |    60,716 |       16.470 |       16.470 |         16.470 |     0.000 | 0: 16.470    | 0: 16.470    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   391,843 |        2.552 |        2.552 |          2.552 |     0.000 | 0: 2.552     | 0: 2.552     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   391,843 |        2.552 |        2.552 |          2.552 |     0.000 | 0: 2.552     | 0: 2.552     |
| replace  | head   | A       | scaleUp       | 10,000 |   376,326 |        2.657 |        2.657 |          2.657 |     0.000 | 0: 2.657     | 0: 2.657     |
| replace  | head   | A       | scaleDown     | 10,000 |   278,598 |        3.589 |        3.589 |          3.589 |     0.000 | 0: 3.589     | 0: 3.589     |
| replace  | head   | A       | fullLifecycle | 20,000 |   320,171 |        3.123 |        3.123 |          3.123 |     0.000 | 0: 3.123     | 0: 3.123     |
| replace  | random | A       | scaleUp       | 10,000 |    76,620 |       13.051 |       13.051 |         13.051 |     0.000 | 0: 13.051    | 0: 13.051    |
| replace  | random | A       | scaleDown     | 10,000 |    45,900 |       21.787 |       21.787 |         21.787 |     0.000 | 0: 21.787    | 0: 21.787    |
| replace  | random | A       | fullLifecycle | 20,000 |    57,408 |       17.419 |       17.419 |         17.419 |     0.000 | 0: 17.419    | 0: 17.419    |
| replace  | tail   | A       | scaleUp       | 10,000 |   419,692 |        2.383 |        2.383 |          2.383 |     0.000 | 0: 2.383     | 0: 2.383     |
| replace  | tail   | A       | scaleDown     | 10,000 |   299,297 |        3.341 |        3.341 |          3.341 |     0.000 | 0: 3.341     | 0: 3.341     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   349,415 |        2.862 |        2.862 |          2.862 |     0.000 | 0: 2.862     | 0: 2.862     |
| sequence | —      | A       | scaleUp       |      5 |       172 |     5828.660 |     5828.660 |       5828.660 |     0.000 | 0: 5828.660  | 0: 5828.660  |
| sequence | —      | A       | scaleDown     |      5 |        22 |    46015.120 |    46015.120 |      46015.120 |     0.000 | 0: 46015.120 | 0: 46015.120 |
| sequence | —      | A       | fullLifecycle |     10 |        39 |    25921.890 |    25921.890 |      25921.890 |     0.000 | 0: 25921.890 | 0: 25921.890 |
| value    | head   | A       | scaleUp       | 10,000 | 3,414,018 |        0.293 |        0.293 |          0.293 |     0.000 | 0: 0.293     | 0: 0.293     |
| value    | head   | A       | scaleDown     | 10,000 | 1,756,235 |        0.569 |        0.569 |          0.569 |     0.000 | 0: 0.569     | 0: 0.569     |
| value    | head   | A       | fullLifecycle | 20,000 | 2,319,352 |        0.431 |        0.431 |          0.431 |     0.000 | 0: 0.431     | 0: 0.431     |
| value    | random | A       | scaleUp       | 10,000 |    98,062 |       10.198 |       10.198 |         10.198 |     0.000 | 0: 10.198    | 0: 10.198    |
| value    | random | A       | scaleDown     | 10,000 |    56,733 |       17.626 |       17.626 |         17.626 |     0.000 | 0: 17.626    | 0: 17.626    |
| value    | random | A       | fullLifecycle | 20,000 |    71,880 |       13.912 |       13.912 |         13.912 |     0.000 | 0: 13.912    | 0: 13.912    |
| value    | tail   | A       | scaleUp       | 10,000 | 4,476,877 |        0.223 |        0.223 |          0.223 |     0.000 | 0: 0.223     | 0: 0.223     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,187,753 |        0.457 |        0.457 |          0.457 |     0.000 | 0: 0.457     | 0: 0.457     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,939,188 |        0.340 |        0.340 |          0.340 |     0.000 | 0: 0.340     | 0: 0.340     |
| values   | —      | A       | scaleUp       |      5 |       463 |     2158.540 |     2158.540 |       2158.540 |     0.000 | 0: 2158.540  | 0: 2158.540  |
| values   | —      | A       | scaleDown     |      5 |     1,834 |      545.240 |      545.240 |        545.240 |     0.000 | 0: 545.240   | 0: 545.240   |
| values   | —      | A       | fullLifecycle |     10 |       740 |     1351.890 |     1351.890 |       1351.890 |     0.000 | 0: 1351.890  | 0: 1351.890  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    67,114 | 14.900 | 14.900 |   14.900 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   129,534 |  7.720 |  6.400 |   14.900 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   129,836 |  7.702 |  4.000 |   69.200 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   127,804 |  7.824 |  2.700 |  420.700 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    42,978 | 23.268 |  2.700 |  420.700 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    30,708 | 32.565 |  2.700 |  652.600 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    30,862 | 32.402 |  2.700 |  832.600 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    30,940 | 32.321 |  2.700 |  832.600 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    30,840 | 32.426 |  2.700 | 2361.100 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    30,840 | 32.426 |  2.700 | 2361.100 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   206,612 |  4.840 |  1.000 |   18.300 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   559,910 |  1.786 |  0.900 |   18.300 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,045,588 |  0.956 |  0.400 |   18.300 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   956,681 |  1.045 |  0.400 |   48.900 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   956,681 |  1.045 |  0.400 |   48.900 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   956,681 |  1.045 |  0.400 |   48.900 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   956,681 |  1.045 |  0.400 |   48.900 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   956,681 |  1.045 |  0.400 |   48.900 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   956,681 |  1.045 |  0.400 |   48.900 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   400,000 |  2.500 |  2.500 |    2.500 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   636,943 |  1.570 |  1.000 |    3.200 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   605,327 |  1.652 |  0.900 |    5.800 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   463,134 |  2.159 |  0.500 |  310.800 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   114,296 |  8.749 |  0.500 | 1841.400 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    77,679 | 12.873 |  0.500 | 1841.400 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    78,088 | 12.806 |  0.500 | 1841.400 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    78,284 | 12.774 |  0.500 | 1841.400 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    78,316 | 12.769 |  0.500 | 1841.400 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    78,319 | 12.768 |  0.500 | 1841.400 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   172,414 |  5.800 |  5.800 |    5.800 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   485,437 |  2.060 |  1.000 |    5.800 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   627,353 |  1.594 |  0.900 |    7.700 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,344,447 |  0.744 |  0.300 |   12.900 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,200,653 |  0.833 |  0.300 |   66.500 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,200,653 |  0.833 |  0.300 |   66.500 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,200,653 |  0.833 |  0.300 |   66.500 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,200,653 |  0.833 |  0.300 |   66.500 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,200,653 |  0.833 |  0.300 |   66.500 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,200,653 |  0.833 |  0.300 |   66.500 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   378,091 |  2.645 |  1.600 |   50.700 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   381,503 |  2.621 |  1.500 |   50.700 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   380,311 |  2.629 |  1.400 |   74.400 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   380,405 |  2.629 |  1.400 |   74.400 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   380,405 |  2.629 |  1.400 |   74.400 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   256,410 |  3.900 |  3.900 |    3.900 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   324,675 |  3.080 |  2.600 |    3.900 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   310,366 |  3.222 |  1.900 |   16.600 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   302,636 |  3.304 |  1.100 |   26.500 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    81,222 | 12.312 |  1.100 |  915.900 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    60,168 | 16.620 |  1.100 |  915.900 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    60,536 | 16.519 |  1.100 |  915.900 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    60,694 | 16.476 |  1.100 |  915.900 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    60,714 | 16.471 |  1.100 |  915.900 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    60,716 | 16.470 |  1.100 |  915.900 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   388,132 |  2.576 |  1.500 |   50.300 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   391,369 |  2.555 |  1.500 |   50.300 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   391,743 |  2.553 |  1.500 |   50.300 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   391,848 |  2.552 |  1.500 |   50.300 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   391,843 |  2.552 |  1.500 |   50.300 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    63,694 | 15.700 | 15.700 |   15.700 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   168,634 |  5.930 |  3.500 |   15.700 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   254,712 |  3.926 |  2.400 |   33.000 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   378,845 |  2.640 |  1.500 |   36.800 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   376,326 |  2.657 |  1.500 |  976.200 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   348,166 |  2.872 |  1.500 |  976.200 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   345,727 |  2.892 |  1.500 |  976.200 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   345,305 |  2.896 |  1.500 |  976.200 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   344,755 |  2.901 |  1.500 |  976.200 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   320,171 |  3.123 |  1.500 | 4457.400 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   250,000 |  4.000 |  4.000 |    4.000 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   273,224 |  3.660 |  3.100 |    4.200 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   248,016 |  4.032 |  2.400 |   43.500 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   249,023 |  4.016 |  1.600 |   67.300 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    76,620 | 13.051 |  1.600 | 2066.600 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    56,882 | 17.580 |  1.600 | 7005.000 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    57,230 | 17.473 |  1.600 | 7005.000 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    57,386 | 17.426 |  1.600 | 7005.000 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    57,407 | 17.420 |  1.600 | 7005.000 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    57,408 | 17.419 |  1.600 | 7005.000 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   357,143 |  2.800 |  2.800 |    2.800 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   309,598 |  3.230 |  2.800 |    3.600 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   265,604 |  3.765 |  1.900 |   56.200 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   302,718 |  3.303 |  1.300 |  544.700 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   419,692 |  2.383 |  1.300 |  544.700 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   350,508 |  2.853 |  1.300 | 3008.400 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   349,317 |  2.863 |  1.300 | 3008.400 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   349,414 |  2.862 |  1.300 | 3008.400 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   349,422 |  2.862 |  1.300 | 3008.400 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   349,415 |  2.862 |  1.300 | 3008.400 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   294,118 |  3.400 |  3.400 |    3.400 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,149,425 |  0.870 |  0.400 |    3.400 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,801,120 |  0.357 |  0.100 |    3.400 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 3,371,544 |  0.297 |  0.100 |   22.100 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,414,018 |  0.293 |  0.100 |   22.100 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,354,487 |  0.425 |  0.100 |   22.100 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,352,301 |  0.425 |  0.100 |   22.100 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,353,343 |  0.425 |  0.100 |   22.100 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,352,215 |  0.425 |  0.100 |   22.100 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 2,319,352 |  0.431 |  0.100 |  120.900 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 2,500,000 |  0.400 |  0.400 |    0.400 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,631,579 |  0.380 |  0.200 |    0.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,536,098 |  0.651 |  0.100 |    3.000 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   589,102 |  1.698 |  0.100 |   48.700 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    98,062 | 10.198 |  0.100 |  184.600 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    71,229 | 14.039 |  0.100 |  351.600 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    71,649 | 13.957 |  0.100 |  351.600 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    71,854 | 13.917 |  0.100 |  351.600 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    71,885 | 13.911 |  0.100 |  351.600 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    71,880 | 13.912 |  0.100 |  351.600 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 5,000,000 |  0.200 |  0.200 |    0.200 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 3,030,303 |  0.330 |  0.200 |    0.900 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 5,813,953 |  0.172 |  0.100 |    0.900 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 6,157,635 |  0.162 |  0.100 |    3.500 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 4,476,877 |  0.223 |  0.100 |   24.100 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,937,993 |  0.340 |  0.100 |   43.600 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,943,831 |  0.340 |  0.100 |   43.600 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,946,813 |  0.339 |  0.100 |   43.600 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,947,531 |  0.339 |  0.100 |   43.600 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,939,188 |  0.340 |  0.100 |   43.600 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  15,773 |    63.400 |
| create   | —    |   0 | up        |     10 | A       |     1 |  28,736 |    34.800 |
| create   | —    |   0 | up        |    100 | A       |     1 |  15,649 |    63.900 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   3,493 |   286.300 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     367 |  2723.900 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,840 |   352.100 |
| create   | —    |   0 | down      |    100 | A       |     1 |  10,650 |    93.900 |
| create   | —    |   0 | down      |     10 | A       |     1 |  21,097 |    47.400 |
| create   | —    |   0 | down      |      1 | A       |     1 |  24,631 |    40.600 |
| create   | —    |   0 | down      |      0 | A       |     1 |  25,641 |    39.000 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   5,596 |   178.700 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  18,051 |    55.400 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   6,549 |   152.700 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     607 |  1647.500 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      37 | 27109.000 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      20 | 49955.300 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      18 | 55925.900 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      16 | 62560.000 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      16 | 61619.800 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  68,493 |    14.600 |
| values   | —    |   0 | up        |      1 | A       |     1 |   7,770 |   128.700 |
| values   | —    |   0 | up        |     10 | A       |     1 |  15,361 |    65.100 |
| values   | —    |   0 | up        |    100 | A       |     1 |   5,456 |   183.300 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     504 |  1983.700 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     119 |  8431.900 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     439 |  2277.000 |
| values   | —    |   0 | down      |    100 | A       |     1 |   2,844 |   351.600 |
| values   | —    |   0 | down      |     10 | A       |     1 |  24,510 |    40.800 |
| values   | —    |   0 | down      |      1 | A       |     1 |  31,447 |    31.800 |
| values   | —    |   0 | down      |      0 | A       |     1 |  40,000 |    25.000 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  84,033,536 |         9,858,768 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,505,664 |        10,005,816 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,569,472 |        10,656,232 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,458,496 |        15,596,696 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 304,877,568 |        64,599,616 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 398,516,224 |       109,765,448 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 402,800,640 |       114,576,976 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 403,726,336 |       115,011,736 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 404,017,152 |       115,081,224 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 402,776,064 |       114,912,344 |

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
