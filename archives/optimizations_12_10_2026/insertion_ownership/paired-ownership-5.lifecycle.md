# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:02:03.508Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    37,875 |       26.403 |       26.403 |         26.403 |     0.000 | 0: 26.403    | 0: 26.403    |
| apply    | random | A       | scaleDown     |  9,999 |    25,719 |       38.881 |       38.881 |         38.881 |     0.000 | 0: 38.881    | 0: 38.881    |
| apply    | random | A       | fullLifecycle | 19,999 |    30,636 |       32.642 |       32.642 |         32.642 |     0.000 | 0: 32.642    | 0: 32.642    |
| create   | —      | A       | scaleUp       |      6 |     1,774 |      563.750 |      563.750 |        563.750 |     0.000 | 0: 563.750   | 0: 563.750   |
| create   | —      | A       | scaleDown     |      5 |     9,012 |      110.960 |      110.960 |        110.960 |     0.000 | 0: 110.960   | 0: 110.960   |
| create   | —      | A       | fullLifecycle |     11 |     2,794 |      357.936 |      357.936 |        357.936 |     0.000 | 0: 357.936   | 0: 357.936   |
| insert   | head   | A       | scaleUp       |  5,000 |   948,497 |        1.054 |        1.054 |          1.054 |     0.000 | 0: 1.054     | 0: 1.054     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   948,497 |        1.054 |        1.054 |          1.054 |     0.000 | 0: 1.054     | 0: 1.054     |
| insert   | random | A       | scaleUp       | 10,000 |    95,317 |       10.491 |       10.491 |         10.491 |     0.000 | 0: 10.491    | 0: 10.491    |
| insert   | random | A       | scaleDown     | 10,000 |    65,554 |       15.255 |       15.255 |         15.255 |     0.000 | 0: 15.255    | 0: 15.255    |
| insert   | random | A       | fullLifecycle | 20,000 |    77,682 |       12.873 |       12.873 |         12.873 |     0.000 | 0: 12.873    | 0: 12.873    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,137,786 |        0.879 |        0.879 |          0.879 |     0.000 | 0: 0.879     | 0: 0.879     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,137,786 |        0.879 |        0.879 |          0.879 |     0.000 | 0: 0.879     | 0: 0.879     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   387,234 |        2.582 |        2.582 |          2.582 |     0.000 | 0: 2.582     | 0: 2.582     |
| remove   | head   | A       | fullLifecycle |  5,000 |   387,234 |        2.582 |        2.582 |          2.582 |     0.000 | 0: 2.582     | 0: 2.582     |
| remove   | random | A       | scaleUp       | 10,000 |    73,609 |       13.585 |       13.585 |         13.585 |     0.000 | 0: 13.585    | 0: 13.585    |
| remove   | random | A       | scaleDown     | 10,000 |    52,510 |       19.044 |       19.044 |         19.044 |     0.000 | 0: 19.044    | 0: 19.044    |
| remove   | random | A       | fullLifecycle | 20,000 |    61,295 |       16.315 |       16.315 |         16.315 |     0.000 | 0: 16.315    | 0: 16.315    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   387,907 |        2.578 |        2.578 |          2.578 |     0.000 | 0: 2.578     | 0: 2.578     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   387,907 |        2.578 |        2.578 |          2.578 |     0.000 | 0: 2.578     | 0: 2.578     |
| replace  | head   | A       | scaleUp       | 10,000 |   326,800 |        3.060 |        3.060 |          3.060 |     0.000 | 0: 3.060     | 0: 3.060     |
| replace  | head   | A       | scaleDown     | 10,000 |   281,385 |        3.554 |        3.554 |          3.554 |     0.000 | 0: 3.554     | 0: 3.554     |
| replace  | head   | A       | fullLifecycle | 20,000 |   302,397 |        3.307 |        3.307 |          3.307 |     0.000 | 0: 3.307     | 0: 3.307     |
| replace  | random | A       | scaleUp       | 10,000 |    70,920 |       14.100 |       14.100 |         14.100 |     0.000 | 0: 14.100    | 0: 14.100    |
| replace  | random | A       | scaleDown     | 10,000 |    51,121 |       19.561 |       19.561 |         19.561 |     0.000 | 0: 19.561    | 0: 19.561    |
| replace  | random | A       | fullLifecycle | 20,000 |    59,415 |       16.831 |       16.831 |         16.831 |     0.000 | 0: 16.831    | 0: 16.831    |
| replace  | tail   | A       | scaleUp       | 10,000 |   368,725 |        2.712 |        2.712 |          2.712 |     0.000 | 0: 2.712     | 0: 2.712     |
| replace  | tail   | A       | scaleDown     | 10,000 |   308,964 |        3.237 |        3.237 |          3.237 |     0.000 | 0: 3.237     | 0: 3.237     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   336,210 |        2.974 |        2.974 |          2.974 |     0.000 | 0: 2.974     | 0: 2.974     |
| sequence | —      | A       | scaleUp       |      5 |       162 |     6157.340 |     6157.340 |       6157.340 |     0.000 | 0: 6157.340  | 0: 6157.340  |
| sequence | —      | A       | scaleDown     |      5 |        22 |    44801.960 |    44801.960 |      44801.960 |     0.000 | 0: 44801.960 | 0: 44801.960 |
| sequence | —      | A       | fullLifecycle |     10 |        39 |    25479.650 |    25479.650 |      25479.650 |     0.000 | 0: 25479.650 | 0: 25479.650 |
| value    | head   | A       | scaleUp       | 10,000 | 2,935,306 |        0.341 |        0.341 |          0.341 |     0.000 | 0: 0.341     | 0: 0.341     |
| value    | head   | A       | scaleDown     | 10,000 | 1,875,715 |        0.533 |        0.533 |          0.533 |     0.000 | 0: 0.533     | 0: 0.533     |
| value    | head   | A       | fullLifecycle | 20,000 | 2,288,827 |        0.437 |        0.437 |          0.437 |     0.000 | 0: 0.437     | 0: 0.437     |
| value    | random | A       | scaleUp       | 10,000 |    85,002 |       11.764 |       11.764 |         11.764 |     0.000 | 0: 11.764    | 0: 11.764    |
| value    | random | A       | scaleDown     | 10,000 |    62,120 |       16.098 |       16.098 |         16.098 |     0.000 | 0: 16.098    | 0: 16.098    |
| value    | random | A       | fullLifecycle | 20,000 |    71,781 |       13.931 |       13.931 |         13.931 |     0.000 | 0: 13.931    | 0: 13.931    |
| value    | tail   | A       | scaleUp       | 10,000 | 4,084,967 |        0.245 |        0.245 |          0.245 |     0.000 | 0: 0.245     | 0: 0.245     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,168,868 |        0.461 |        0.461 |          0.461 |     0.000 | 0: 0.461     | 0: 0.461     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,833,383 |        0.353 |        0.353 |          0.353 |     0.000 | 0: 0.353     | 0: 0.353     |
| values   | —      | A       | scaleUp       |      5 |       491 |     2035.440 |     2035.440 |       2035.440 |     0.000 | 0: 2035.440  | 0: 2035.440  |
| values   | —      | A       | scaleDown     |      5 |     1,630 |      613.680 |      613.680 |        613.680 |     0.000 | 0: 613.680   | 0: 613.680   |
| values   | —      | A       | fullLifecycle |     10 |       755 |     1324.560 |     1324.560 |       1324.560 |     0.000 | 0: 1324.560  | 0: 1324.560  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    86,207 | 11.600 | 11.600 |   11.600 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   115,207 |  8.680 |  7.000 |   15.000 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   121,344 |  8.241 |  4.100 |   73.600 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   113,660 |  8.798 |  3.100 |  412.300 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    37,875 | 26.403 |  3.000 | 5699.900 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    30,647 | 32.629 |  3.000 | 5699.900 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    30,693 | 32.581 |  3.000 | 5699.900 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    30,762 | 32.508 |  3.000 | 5699.900 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    30,636 | 32.642 |  3.000 | 5699.900 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    30,636 | 32.642 |  3.000 | 5699.900 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |    74,963 | 13.340 |  1.300 |   59.800 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   377,929 |  2.646 |  1.100 |   59.800 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   909,422 |  1.100 |  0.500 |   59.800 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   948,497 |  1.054 |  0.500 |   59.800 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   948,497 |  1.054 |  0.500 |   59.800 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   948,497 |  1.054 |  0.500 |   59.800 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   948,497 |  1.054 |  0.500 |   59.800 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   948,497 |  1.054 |  0.500 |   59.800 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   948,497 |  1.054 |  0.500 |   59.800 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   625,000 |  1.600 |  1.600 |    1.600 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   444,444 |  2.250 |  1.200 |    5.000 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   542,594 |  1.843 |  1.200 |    5.000 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   349,247 |  2.863 |  0.600 |  334.700 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    95,317 | 10.491 |  0.600 | 7558.000 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    77,494 | 12.904 |  0.600 | 7558.000 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    77,479 | 12.907 |  0.600 | 7558.000 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    77,646 | 12.879 |  0.600 | 7558.000 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    77,679 | 12.874 |  0.600 | 7558.000 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    77,682 | 12.873 |  0.600 | 7558.000 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   133,333 |  7.500 |  7.500 |    7.500 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   373,134 |  2.680 |  1.200 |    7.500 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   563,063 |  1.776 |  1.000 |   11.300 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,243,781 |  0.804 |  0.300 |   11.300 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,137,786 |  0.879 |  0.300 |   78.100 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,137,786 |  0.879 |  0.300 |   78.100 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,137,786 |  0.879 |  0.300 |   78.100 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,137,786 |  0.879 |  0.300 |   78.100 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,137,786 |  0.879 |  0.300 |   78.100 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,137,786 |  0.879 |  0.300 |   78.100 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   383,985 |  2.604 |  1.500 |   50.700 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   386,722 |  2.586 |  1.400 |   50.700 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   387,086 |  2.583 |  1.400 |   50.700 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   387,234 |  2.582 |  1.300 |   50.700 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   387,234 |  2.582 |  1.300 |   50.700 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   370,370 |  2.700 |  2.700 |    2.700 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   273,224 |  3.660 |  2.700 |    7.100 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   314,169 |  3.183 |  1.900 |    8.000 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   270,226 |  3.701 |  1.200 |   54.100 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    73,609 | 13.585 |  1.200 |  709.800 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    61,157 | 16.351 |  1.200 |  709.800 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    61,129 | 16.359 |  1.200 |  709.800 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    61,272 | 16.321 |  1.200 |  709.800 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    61,293 | 16.315 |  1.200 |  709.800 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    61,295 | 16.315 |  1.200 |  709.800 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   385,650 |  2.593 |  1.600 |   61.600 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   387,245 |  2.582 |  1.600 |   61.600 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   387,829 |  2.578 |  1.400 |   61.600 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   387,904 |  2.578 |  1.400 |   61.600 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   387,907 |  2.578 |  1.400 |   61.600 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    60,976 | 16.400 | 16.400 |   16.400 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   144,928 |  6.900 |  3.800 |   16.400 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   229,938 |  4.349 |  2.200 |   32.600 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   182,332 |  5.484 |  1.700 | 1308.500 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   326,800 |  3.060 |  1.500 | 1308.500 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   324,104 |  3.085 |  1.500 | 1308.500 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   322,110 |  3.105 |  1.500 | 1308.500 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   321,701 |  3.108 |  1.500 | 1308.500 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   321,295 |  3.112 |  1.500 | 1308.500 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   302,397 |  3.307 |  1.500 | 3893.300 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   250,000 |  4.000 |  4.000 |    4.000 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   223,714 |  4.470 |  3.500 |    7.000 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   258,131 |  3.874 |  2.300 |    7.000 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   228,864 |  4.369 |  1.800 |   39.900 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    70,920 | 14.100 |  1.700 | 3108.600 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    59,294 | 16.865 |  1.700 | 3138.700 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    59,262 | 16.874 |  1.700 | 3138.700 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    59,390 | 16.838 |  1.700 | 3138.700 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    59,413 | 16.831 |  1.700 | 3138.700 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    59,415 | 16.831 |  1.700 | 3138.700 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   212,766 |  4.700 |  4.700 |    4.700 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   222,717 |  4.490 |  3.300 |    6.900 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   266,809 |  3.748 |  2.000 |   37.800 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   229,216 |  4.363 |  1.600 | 1458.800 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   368,725 |  2.712 |  1.500 | 1458.800 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   337,783 |  2.960 |  1.500 | 2435.500 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   336,107 |  2.975 |  1.500 | 2435.500 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   336,198 |  2.974 |  1.500 | 2435.500 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   336,239 |  2.974 |  1.500 | 2435.500 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   336,210 |  2.974 |  1.500 | 2435.500 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   476,190 |  2.100 |  2.100 |    2.100 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   227,790 |  4.390 |  0.400 |   32.000 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 1,468,429 |  0.681 |  0.200 |   32.000 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,664,535 |  0.375 |  0.200 |   41.400 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,935,306 |  0.341 |  0.100 |   43.500 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,319,874 |  0.431 |  0.100 |   43.500 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,313,066 |  0.432 |  0.100 |   43.500 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,314,086 |  0.432 |  0.100 |   43.500 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,313,039 |  0.432 |  0.100 |   43.500 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 2,288,827 |  0.437 |  0.100 |   91.900 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |    0.300 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,222,222 |  0.450 |  0.200 |    1.100 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,529,052 |  0.654 |  0.100 |    1.300 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   497,834 |  2.009 |  0.100 |  159.000 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    85,002 | 11.764 |  0.100 | 2009.500 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    71,593 | 13.968 |  0.100 | 2009.500 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    71,566 | 13.973 |  0.100 | 2009.500 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    71,752 | 13.937 |  0.100 | 2009.500 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    71,784 | 13.931 |  0.100 | 2009.500 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    71,781 | 13.931 |  0.100 | 2009.500 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 3,333,333 |  0.300 |  0.300 |    0.300 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 2,439,024 |  0.410 |  0.300 |    0.900 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 5,376,344 |  0.186 |  0.100 |    0.900 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 5,330,490 |  0.188 |  0.100 |    3.300 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 4,084,967 |  0.245 |  0.100 |   37.300 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,840,315 |  0.352 |  0.100 |   37.300 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,834,677 |  0.353 |  0.100 |   37.300 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,837,554 |  0.352 |  0.100 |   37.300 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,838,308 |  0.352 |  0.100 |   37.300 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,833,383 |  0.353 |  0.100 |   37.300 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  15,152 |    66.000 |
| create   | —    |   0 | up        |     10 | A       |     1 |  31,847 |    31.400 |
| create   | —    |   0 | up        |    100 | A       |     1 |  14,556 |    68.700 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   3,136 |   318.900 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     371 |  2695.700 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,912 |   343.400 |
| create   | —    |   0 | down      |    100 | A       |     1 |  10,070 |    99.300 |
| create   | —    |   0 | down      |     10 | A       |     1 |  24,631 |    40.600 |
| create   | —    |   0 | down      |      1 | A       |     1 |  27,397 |    36.500 |
| create   | —    |   0 | down      |      0 | A       |     1 |  28,571 |    35.000 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   4,216 |   237.200 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  25,707 |    38.900 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   6,254 |   159.900 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     505 |  1981.100 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      35 | 28369.600 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      19 | 52941.700 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      17 | 57629.400 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      18 | 55812.300 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      17 | 57605.500 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  47,847 |    20.900 |
| values   | —    |   0 | up        |      1 | A       |     1 |  14,728 |    67.900 |
| values   | —    |   0 | up        |     10 | A       |     1 |  29,070 |    34.400 |
| values   | —    |   0 | up        |    100 | A       |     1 |   5,131 |   194.900 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     462 |  2163.200 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     130 |  7716.800 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     403 |  2483.000 |
| values   | —    |   0 | down      |    100 | A       |     1 |   2,143 |   466.600 |
| values   | —    |   0 | down      |     10 | A       |     1 |  17,544 |    57.000 |
| values   | —    |   0 | down      |      1 | A       |     1 |  30,395 |    32.900 |
| values   | —    |   0 | down      |      0 | A       |     1 |  34,602 |    28.900 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  82,821,120 |         9,861,016 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,296,768 |        10,008,296 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,450,688 |        10,655,976 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,409,344 |        15,596,584 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 306,196,480 |        64,599,504 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 397,160,448 |       109,765,520 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 400,949,248 |       114,576,880 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 402,374,656 |       115,011,640 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 401,289,216 |       115,081,128 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 402,755,584 |       114,912,264 |

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
