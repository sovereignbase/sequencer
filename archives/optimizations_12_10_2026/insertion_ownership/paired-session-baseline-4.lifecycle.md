# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:01:40.999Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    43,325 |       23.081 |       23.081 |         23.081 |     0.000 | 0: 23.081    | 0: 23.081    |
| apply    | random | A       | scaleDown     |  9,999 |    23,149 |       43.198 |       43.198 |         43.198 |     0.000 | 0: 43.198    | 0: 43.198    |
| apply    | random | A       | fullLifecycle | 19,999 |    30,176 |       33.139 |       33.139 |         33.139 |     0.000 | 0: 33.139    | 0: 33.139    |
| create   | —      | A       | scaleUp       |      6 |     1,737 |      575.583 |      575.583 |        575.583 |     0.000 | 0: 575.583   | 0: 575.583   |
| create   | —      | A       | scaleDown     |      5 |     8,275 |      120.840 |      120.840 |        120.840 |     0.000 | 0: 120.840   | 0: 120.840   |
| create   | —      | A       | fullLifecycle |     11 |     2,711 |      368.882 |      368.882 |        368.882 |     0.000 | 0: 368.882   | 0: 368.882   |
| insert   | head   | A       | scaleUp       |  5,000 | 1,026,673 |        0.974 |        0.974 |          0.974 |     0.000 | 0: 0.974     | 0: 0.974     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 | 1,026,673 |        0.974 |        0.974 |          0.974 |     0.000 | 0: 0.974     | 0: 0.974     |
| insert   | random | A       | scaleUp       | 10,000 |   113,916 |        8.778 |        8.778 |          8.778 |     0.000 | 0: 8.778     | 0: 8.778     |
| insert   | random | A       | scaleDown     | 10,000 |    56,449 |       17.715 |       17.715 |         17.715 |     0.000 | 0: 17.715    | 0: 17.715    |
| insert   | random | A       | fullLifecycle | 20,000 |    75,490 |       13.247 |       13.247 |         13.247 |     0.000 | 0: 13.247    | 0: 13.247    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,195,572 |        0.836 |        0.836 |          0.836 |     0.000 | 0: 0.836     | 0: 0.836     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,195,572 |        0.836 |        0.836 |          0.836 |     0.000 | 0: 0.836     | 0: 0.836     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   251,537 |        3.976 |        3.976 |          3.976 |     0.000 | 0: 3.976     | 0: 3.976     |
| remove   | head   | A       | fullLifecycle |  5,000 |   251,537 |        3.976 |        3.976 |          3.976 |     0.000 | 0: 3.976     | 0: 3.976     |
| remove   | random | A       | scaleUp       | 10,000 |    81,148 |       12.323 |       12.323 |         12.323 |     0.000 | 0: 12.323    | 0: 12.323    |
| remove   | random | A       | scaleDown     | 10,000 |    47,014 |       21.270 |       21.270 |         21.270 |     0.000 | 0: 21.270    | 0: 21.270    |
| remove   | random | A       | fullLifecycle | 20,000 |    59,535 |       16.797 |       16.797 |         16.797 |     0.000 | 0: 16.797    | 0: 16.797    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   372,662 |        2.683 |        2.683 |          2.683 |     0.000 | 0: 2.683     | 0: 2.683     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   372,662 |        2.683 |        2.683 |          2.683 |     0.000 | 0: 2.683     | 0: 2.683     |
| replace  | head   | A       | scaleUp       | 10,000 |   326,897 |        3.059 |        3.059 |          3.059 |     0.000 | 0: 3.059     | 0: 3.059     |
| replace  | head   | A       | scaleDown     | 10,000 |   269,426 |        3.712 |        3.712 |          3.712 |     0.000 | 0: 3.712     | 0: 3.712     |
| replace  | head   | A       | fullLifecycle | 20,000 |   295,392 |        3.385 |        3.385 |          3.385 |     0.000 | 0: 3.385     | 0: 3.385     |
| replace  | random | A       | scaleUp       | 10,000 |    76,378 |       13.093 |       13.093 |         13.093 |     0.000 | 0: 13.093    | 0: 13.093    |
| replace  | random | A       | scaleDown     | 10,000 |    44,374 |       22.536 |       22.536 |         22.536 |     0.000 | 0: 22.536    | 0: 22.536    |
| replace  | random | A       | fullLifecycle | 20,000 |    56,135 |       17.814 |       17.814 |         17.814 |     0.000 | 0: 17.814    | 0: 17.814    |
| replace  | tail   | A       | scaleUp       | 10,000 |   410,470 |        2.436 |        2.436 |          2.436 |     0.000 | 0: 2.436     | 0: 2.436     |
| replace  | tail   | A       | scaleDown     | 10,000 |   289,290 |        3.457 |        3.457 |          3.457 |     0.000 | 0: 3.457     | 0: 3.457     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   339,387 |        2.946 |        2.946 |          2.946 |     0.000 | 0: 2.946     | 0: 2.946     |
| sequence | —      | A       | scaleUp       |      5 |       165 |     6046.000 |     6046.000 |       6046.000 |     0.000 | 0: 6046.000  | 0: 6046.000  |
| sequence | —      | A       | scaleDown     |      5 |        22 |    45097.200 |    45097.200 |      45097.200 |     0.000 | 0: 45097.200 | 0: 45097.200 |
| sequence | —      | A       | fullLifecycle |     10 |        39 |    25571.600 |    25571.600 |      25571.600 |     0.000 | 0: 25571.600 | 0: 25571.600 |
| value    | head   | A       | scaleUp       | 10,000 | 2,793,452 |        0.358 |        0.358 |          0.358 |     0.000 | 0: 0.358     | 0: 0.358     |
| value    | head   | A       | scaleDown     | 10,000 | 1,576,342 |        0.634 |        0.634 |          0.634 |     0.000 | 0: 0.634     | 0: 0.634     |
| value    | head   | A       | fullLifecycle | 20,000 | 2,015,398 |        0.496 |        0.496 |          0.496 |     0.000 | 0: 0.496     | 0: 0.496     |
| value    | random | A       | scaleUp       | 10,000 |    97,694 |       10.236 |       10.236 |         10.236 |     0.000 | 0: 10.236    | 0: 10.236    |
| value    | random | A       | scaleDown     | 10,000 |    54,209 |       18.447 |       18.447 |         18.447 |     0.000 | 0: 18.447    | 0: 18.447    |
| value    | random | A       | fullLifecycle | 20,000 |    69,727 |       14.342 |       14.342 |         14.342 |     0.000 | 0: 14.342    | 0: 14.342    |
| value    | tail   | A       | scaleUp       | 10,000 | 4,182,875 |        0.239 |        0.239 |          0.239 |     0.000 | 0: 0.239     | 0: 0.239     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,100,311 |        0.476 |        0.476 |          0.476 |     0.000 | 0: 0.476     | 0: 0.476     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,796,460 |        0.358 |        0.358 |          0.358 |     0.000 | 0: 0.358     | 0: 0.358     |
| values   | —      | A       | scaleUp       |      5 |       500 |     1999.200 |     1999.200 |       1999.200 |     0.000 | 0: 1999.200  | 0: 1999.200  |
| values   | —      | A       | scaleDown     |      5 |     1,792 |      557.980 |      557.980 |        557.980 |     0.000 | 0: 557.980   | 0: 557.980   |
| values   | —      | A       | fullLifecycle |     10 |       782 |     1278.590 |     1278.590 |       1278.590 |     0.000 | 0: 1278.590  | 0: 1278.590  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    82,645 | 12.100 | 12.100 |   12.100 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   132,450 |  7.550 |  6.600 |   12.100 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   129,584 |  7.717 |  3.800 |   65.000 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   123,472 |  8.099 |  2.600 |  439.100 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    43,325 | 23.081 |  2.600 |  439.100 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    30,151 | 33.167 |  2.600 | 3759.200 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    30,297 | 33.007 |  2.600 | 3759.200 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    30,366 | 32.932 |  2.600 | 3759.200 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    30,176 | 33.139 |  2.600 | 4409.400 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    30,176 | 33.139 |  2.600 | 4409.400 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   267,380 |  3.740 |  1.100 |   12.600 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   638,570 |  1.566 |  1.000 |   12.600 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,152,074 |  0.868 |  0.400 |   17.700 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,026,673 |  0.974 |  0.400 |   22.600 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,026,673 |  0.974 |  0.400 |   22.600 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,026,673 |  0.974 |  0.400 |   22.600 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 | 1,026,673 |  0.974 |  0.400 |   22.600 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 | 1,026,673 |  0.974 |  0.400 |   22.600 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 | 1,026,673 |  0.974 |  0.400 |   22.600 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   555,556 |  1.800 |  1.800 |    1.800 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   609,756 |  1.640 |  1.200 |    3.200 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   626,174 |  1.597 |  1.000 |    4.300 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   415,576 |  2.406 |  0.600 |  338.800 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   113,916 |  8.778 |  0.600 | 2024.200 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    75,004 | 13.333 |  0.600 | 3076.000 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    75,315 | 13.278 |  0.600 | 3076.000 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    75,456 | 13.253 |  0.600 | 3076.000 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    75,487 | 13.247 |  0.600 | 3076.000 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    75,490 | 13.247 |  0.600 | 3076.000 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   163,934 |  6.100 |  6.100 |    6.100 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   450,450 |  2.220 |  1.100 |    6.100 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   636,943 |  1.570 |  0.800 |    7.800 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,064,736 |  0.939 |  0.300 |   29.700 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,195,572 |  0.836 |  0.300 |   44.800 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,195,572 |  0.836 |  0.300 |   44.800 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,195,572 |  0.836 |  0.300 |   44.800 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,195,572 |  0.836 |  0.300 |   44.800 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,195,572 |  0.836 |  0.300 |   44.800 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,195,572 |  0.836 |  0.300 |   44.800 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   240,657 |  4.155 |  1.600 | 6347.500 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   250,435 |  3.993 |  1.400 | 6347.500 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   251,393 |  3.978 |  1.400 | 6347.500 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   251,537 |  3.976 |  1.400 | 6347.500 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   251,537 |  3.976 |  1.400 | 6347.500 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   303,030 |  3.300 |  3.300 |    3.300 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   292,398 |  3.420 |  2.800 |    6.700 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   337,952 |  2.959 |  1.600 |   12.000 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   281,389 |  3.554 |  1.100 |   54.900 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    81,148 | 12.323 |  1.100 |  838.300 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    59,087 | 16.924 |  1.100 |  838.300 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    59,376 | 16.842 |  1.100 |  838.300 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    59,513 | 16.803 |  1.100 |  838.300 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    59,533 | 16.797 |  1.100 |  838.300 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    59,535 | 16.797 |  1.100 |  838.300 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   368,617 |  2.713 |  1.600 |  120.000 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   372,094 |  2.687 |  1.600 |  120.000 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   372,553 |  2.684 |  1.500 |  120.000 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   372,668 |  2.683 |  1.500 |  120.000 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   372,662 |  2.683 |  1.500 |  120.000 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    55,866 | 17.900 | 17.900 |   17.900 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   167,504 |  5.970 |  3.600 |   17.900 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   248,447 |  4.025 |  2.000 |   46.300 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   364,564 |  2.743 |  1.500 |   46.300 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   326,897 |  3.059 |  1.500 | 2932.300 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   313,531 |  3.189 |  1.500 | 2932.300 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   312,194 |  3.203 |  1.500 | 2932.300 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   311,806 |  3.207 |  1.500 | 2932.300 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   311,427 |  3.211 |  1.500 | 2932.300 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   295,392 |  3.385 |  1.500 | 3489.500 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   263,158 |  3.800 |  3.800 |    3.800 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   265,252 |  3.770 |  3.200 |    4.600 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   291,375 |  3.432 |  2.200 |    7.400 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   182,715 |  5.473 |  1.600 | 1246.600 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    76,378 | 13.093 |  1.600 | 2389.500 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    55,721 | 17.947 |  1.600 | 5985.400 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    55,985 | 17.862 |  1.600 | 5985.400 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    56,114 | 17.821 |  1.600 | 5985.400 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    56,133 | 17.815 |  1.600 | 5985.400 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    56,135 | 17.814 |  1.600 | 5985.400 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   344,828 |  2.900 |  2.900 |    2.900 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   284,900 |  3.510 |  2.900 |    4.700 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   237,304 |  4.214 |  1.800 |   78.300 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   341,192 |  2.931 |  1.400 |  246.100 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   410,470 |  2.436 |  1.400 |  246.100 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   340,722 |  2.935 |  1.400 | 3172.300 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   339,432 |  2.946 |  1.400 | 3172.300 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   339,456 |  2.946 |  1.400 | 3172.300 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   339,483 |  2.946 |  1.400 | 3172.300 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   339,387 |  2.946 |  1.400 | 3172.300 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   434,783 |  2.300 |  2.300 |    2.300 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,351,351 |  0.740 |  0.400 |    2.300 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,192,982 |  0.456 |  0.100 |   16.000 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,815,315 |  0.355 |  0.100 |   26.400 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,793,452 |  0.358 |  0.100 |   26.400 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,032,825 |  0.492 |  0.100 |   26.400 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,036,577 |  0.491 |  0.100 |   26.400 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,037,343 |  0.491 |  0.100 |   26.400 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,036,641 |  0.491 |  0.100 |   26.400 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 2,015,398 |  0.496 |  0.100 |  104.000 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |    0.300 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,941,176 |  0.340 |  0.200 |    0.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,605,136 |  0.623 |  0.100 |    3.500 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   578,102 |  1.730 |  0.100 |   46.300 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    97,694 | 10.236 |  0.100 |  134.500 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    69,206 | 14.450 |  0.100 | 1065.600 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    69,526 | 14.383 |  0.100 | 1065.600 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    69,697 | 14.348 |  0.100 | 1065.600 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    69,728 | 14.341 |  0.100 | 1065.600 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    69,727 | 14.342 |  0.100 | 1065.600 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |    0.300 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 2,631,579 |  0.380 |  0.300 |    0.700 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 5,882,353 |  0.170 |  0.100 |    0.700 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 5,455,537 |  0.183 |  0.100 |    4.200 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 4,182,875 |  0.239 |  0.100 |    9.600 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,805,505 |  0.356 |  0.100 |   13.500 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,797,222 |  0.357 |  0.100 |   14.700 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,800,426 |  0.357 |  0.100 |   14.700 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,801,177 |  0.357 |  0.100 |   14.700 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,796,460 |  0.358 |  0.100 |   14.700 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  17,921 |    55.800 |
| create   | —    |   0 | up        |     10 | A       |     1 |  32,787 |    30.500 |
| create   | —    |   0 | up        |    100 | A       |     1 |  13,055 |    76.600 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   3,108 |   321.800 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     361 |  2767.300 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,485 |   402.400 |
| create   | —    |   0 | down      |    100 | A       |     1 |  10,695 |    93.500 |
| create   | —    |   0 | down      |     10 | A       |     1 |  25,773 |    38.800 |
| create   | —    |   0 | down      |      1 | A       |     1 |  24,155 |    41.400 |
| create   | —    |   0 | down      |      0 | A       |     1 |  35,587 |    28.100 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   5,285 |   189.200 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  26,525 |    37.700 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   7,364 |   135.800 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     568 |  1760.200 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      36 | 28107.100 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      20 | 51195.300 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      18 | 55890.000 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      18 | 55088.700 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      16 | 63298.800 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  75,758 |    13.200 |
| values   | —    |   0 | up        |      1 | A       |     1 |  14,771 |    67.700 |
| values   | —    |   0 | up        |     10 | A       |     1 |  19,763 |    50.600 |
| values   | —    |   0 | up        |    100 | A       |     1 |   6,873 |   145.500 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     481 |  2081.100 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     131 |  7651.100 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     428 |  2335.100 |
| values   | —    |   0 | down      |    100 | A       |     1 |   2,739 |   365.100 |
| values   | —    |   0 | down      |     10 | A       |     1 |  24,450 |    40.900 |
| values   | —    |   0 | down      |      1 | A       |     1 |  38,911 |    25.700 |
| values   | —    |   0 | down      |      0 | A       |     1 |  43,290 |    23.100 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  83,697,664 |         9,859,864 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,628,544 |        10,006,912 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  77,430,784 |        10,657,144 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,622,336 |        15,597,520 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 306,458,624 |        64,600,440 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 399,941,632 |       109,766,288 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 403,066,880 |       114,577,816 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 404,582,400 |       115,012,576 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 405,053,440 |       115,079,592 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 404,275,200 |       115,032,536 |

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
