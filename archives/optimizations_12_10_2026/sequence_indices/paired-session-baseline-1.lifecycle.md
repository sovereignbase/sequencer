# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:46:53.170Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    31,392 |       31.855 |       31.855 |         31.855 |     0.000 | 0: 31.855    | 0: 31.855    |
| apply    | random | A       | scaleDown     |  9,999 |    24,980 |       40.032 |       40.032 |         40.032 |     0.000 | 0: 40.032    | 0: 40.032    |
| apply    | random | A       | fullLifecycle | 19,999 |    27,822 |       35.943 |       35.943 |         35.943 |     0.000 | 0: 35.943    | 0: 35.943    |
| create   | —      | A       | scaleUp       |      6 |     1,548 |      645.950 |      645.950 |        645.950 |     0.000 | 0: 645.950   | 0: 645.950   |
| create   | —      | A       | scaleDown     |      5 |     7,641 |      130.880 |      130.880 |        130.880 |     0.000 | 0: 130.880   | 0: 130.880   |
| create   | —      | A       | fullLifecycle |     11 |     2,428 |      411.827 |      411.827 |        411.827 |     0.000 | 0: 411.827   | 0: 411.827   |
| insert   | head   | A       | scaleUp       |  5,000 |   712,504 |        1.403 |        1.403 |          1.403 |     0.000 | 0: 1.403     | 0: 1.403     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   712,504 |        1.403 |        1.403 |          1.403 |     0.000 | 0: 1.403     | 0: 1.403     |
| insert   | random | A       | scaleUp       | 10,000 |    84,729 |       11.802 |       11.802 |         11.802 |     0.000 | 0: 11.802    | 0: 11.802    |
| insert   | random | A       | scaleDown     | 10,000 |    68,114 |       14.681 |       14.681 |         14.681 |     0.000 | 0: 14.681    | 0: 14.681    |
| insert   | random | A       | fullLifecycle | 20,000 |    75,518 |       13.242 |       13.242 |         13.242 |     0.000 | 0: 13.242    | 0: 13.242    |
| insert   | tail   | A       | scaleUp       |  5,000 |   808,512 |        1.237 |        1.237 |          1.237 |     0.000 | 0: 1.237     | 0: 1.237     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 |   808,512 |        1.237 |        1.237 |          1.237 |     0.000 | 0: 1.237     | 0: 1.237     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   367,255 |        2.723 |        2.723 |          2.723 |     0.000 | 0: 2.723     | 0: 2.723     |
| remove   | head   | A       | fullLifecycle |  5,000 |   367,255 |        2.723 |        2.723 |          2.723 |     0.000 | 0: 2.723     | 0: 2.723     |
| remove   | random | A       | scaleUp       | 10,000 |    60,058 |       16.650 |       16.650 |         16.650 |     0.000 | 0: 16.650    | 0: 16.650    |
| remove   | random | A       | scaleDown     | 10,000 |    53,498 |       18.692 |       18.692 |         18.692 |     0.000 | 0: 18.692    | 0: 18.692    |
| remove   | random | A       | fullLifecycle | 20,000 |    56,589 |       17.671 |       17.671 |         17.671 |     0.000 | 0: 17.671    | 0: 17.671    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   366,405 |        2.729 |        2.729 |          2.729 |     0.000 | 0: 2.729     | 0: 2.729     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   366,405 |        2.729 |        2.729 |          2.729 |     0.000 | 0: 2.729     | 0: 2.729     |
| replace  | head   | A       | scaleUp       | 10,000 |   252,755 |        3.956 |        3.956 |          3.956 |     0.000 | 0: 3.956     | 0: 3.956     |
| replace  | head   | A       | scaleDown     | 10,000 |   244,977 |        4.082 |        4.082 |          4.082 |     0.000 | 0: 4.082     | 0: 4.082     |
| replace  | head   | A       | fullLifecycle | 20,000 |   248,805 |        4.019 |        4.019 |          4.019 |     0.000 | 0: 4.019     | 0: 4.019     |
| replace  | random | A       | scaleUp       | 10,000 |    59,179 |       16.898 |       16.898 |         16.898 |     0.000 | 0: 16.898    | 0: 16.898    |
| replace  | random | A       | scaleDown     | 10,000 |    48,920 |       20.442 |       20.442 |         20.442 |     0.000 | 0: 20.442    | 0: 20.442    |
| replace  | random | A       | fullLifecycle | 20,000 |    53,563 |       18.670 |       18.670 |         18.670 |     0.000 | 0: 18.670    | 0: 18.670    |
| replace  | tail   | A       | scaleUp       | 10,000 |   257,573 |        3.882 |        3.882 |          3.882 |     0.000 | 0: 3.882     | 0: 3.882     |
| replace  | tail   | A       | scaleDown     | 10,000 |   271,557 |        3.682 |        3.682 |          3.682 |     0.000 | 0: 3.682     | 0: 3.682     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   264,380 |        3.782 |        3.782 |          3.782 |     0.000 | 0: 3.782     | 0: 3.782     |
| sequence | —      | A       | scaleUp       |      5 |       142 |     7020.300 |     7020.300 |       7020.300 |     0.000 | 0: 7020.300  | 0: 7020.300  |
| sequence | —      | A       | scaleDown     |      5 |        20 |    49056.380 |    49056.380 |      49056.380 |     0.000 | 0: 49056.380 | 0: 49056.380 |
| sequence | —      | A       | fullLifecycle |     10 |        36 |    28038.340 |    28038.340 |      28038.340 |     0.000 | 0: 28038.340 | 0: 28038.340 |
| value    | head   | A       | scaleUp       | 10,000 | 2,111,888 |        0.474 |        0.474 |          0.474 |     0.000 | 0: 0.474     | 0: 0.474     |
| value    | head   | A       | scaleDown     | 10,000 | 1,697,389 |        0.589 |        0.589 |          0.589 |     0.000 | 0: 0.589     | 0: 0.589     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,882,087 |        0.531 |        0.531 |          0.531 |     0.000 | 0: 0.531     | 0: 0.531     |
| value    | random | A       | scaleUp       | 10,000 |    75,996 |       13.159 |       13.159 |         13.159 |     0.000 | 0: 13.159    | 0: 13.159    |
| value    | random | A       | scaleDown     | 10,000 |    64,394 |       15.529 |       15.529 |         15.529 |     0.000 | 0: 15.529    | 0: 15.529    |
| value    | random | A       | fullLifecycle | 20,000 |    69,716 |       14.344 |       14.344 |         14.344 |     0.000 | 0: 14.344    | 0: 14.344    |
| value    | tail   | A       | scaleUp       | 10,000 | 3,001,741 |        0.333 |        0.333 |          0.333 |     0.000 | 0: 0.333     | 0: 0.333     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,030,787 |        0.492 |        0.492 |          0.492 |     0.000 | 0: 0.492     | 0: 0.492     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,422,598 |        0.413 |        0.413 |          0.413 |     0.000 | 0: 0.413     | 0: 0.413     |
| values   | —      | A       | scaleUp       |      5 |       399 |     2503.240 |     2503.240 |       2503.240 |     0.000 | 0: 2503.240  | 0: 2503.240  |
| values   | —      | A       | scaleDown     |      5 |     1,522 |      656.940 |      656.940 |        656.940 |     0.000 | 0: 656.940   | 0: 656.940   |
| values   | —      | A       | fullLifecycle |     10 |       633 |     1580.090 |     1580.090 |       1580.090 |     0.000 | 0: 1580.090  | 0: 1580.090  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    71,429 | 14.000 | 14.000 |   14.000 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    90,334 | 11.070 |  8.600 |   16.800 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |    87,912 | 11.375 |  5.400 |   82.700 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |    71,271 | 14.031 |  4.000 | 1129.500 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    31,392 | 31.855 |  4.000 | 1129.500 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    27,758 | 36.026 |  4.000 | 1129.500 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    27,936 | 35.797 |  3.400 | 1129.500 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    27,978 | 35.743 |  3.400 | 1129.500 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    27,822 | 35.943 |  3.400 | 4286.400 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    27,822 | 35.943 |  3.400 | 4286.400 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   212,766 |  4.700 |  1.800 |   14.000 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   412,541 |  2.424 |  1.300 |   14.000 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   736,377 |  1.358 |  0.600 |   19.200 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   712,504 |  1.403 |  0.600 |   86.000 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   712,504 |  1.403 |  0.600 |   86.000 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   712,504 |  1.403 |  0.600 |   86.000 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   712,504 |  1.403 |  0.600 |   86.000 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   712,504 |  1.403 |  0.600 |   86.000 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   712,504 |  1.403 |  0.600 |   86.000 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   263,158 |  3.800 |  3.800 |    3.800 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   377,358 |  2.650 |  1.500 |    5.900 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   390,320 |  2.562 |  1.400 |    5.900 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   251,819 |  3.971 |  0.800 |  552.200 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    84,729 | 11.802 |  0.800 | 2653.400 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    74,948 | 13.343 |  0.800 | 2653.400 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    75,392 | 13.264 |  0.800 | 2653.400 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    75,485 | 13.248 |  0.800 | 2653.400 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    75,515 | 13.242 |  0.700 | 2653.400 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    75,518 | 13.242 |  0.700 | 2653.400 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   120,482 |  8.300 |  8.300 |    8.300 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   303,030 |  3.300 |  1.400 |    8.300 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   436,681 |  2.290 |  1.200 |   10.700 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   709,320 |  1.410 |  0.500 |   33.800 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   808,512 |  1.237 |  0.500 |  213.500 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   808,512 |  1.237 |  0.500 |  213.500 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 |   808,512 |  1.237 |  0.500 |  213.500 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 |   808,512 |  1.237 |  0.500 |  213.500 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 |   808,512 |  1.237 |  0.500 |  213.500 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   808,512 |  1.237 |  0.500 |  213.500 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   367,113 |  2.724 |  1.500 |   29.300 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   368,498 |  2.714 |  1.500 |   29.300 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   367,231 |  2.723 |  1.500 |   29.300 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   367,255 |  2.723 |  1.500 |   29.300 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   367,255 |  2.723 |  1.500 |   29.300 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   196,078 |  5.100 |  5.100 |    5.100 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   187,617 |  5.330 |  3.400 |    8.700 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   220,070 |  4.544 |  2.200 |   11.300 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   178,294 |  5.609 |  1.800 |   50.900 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    60,058 | 16.650 |  1.800 | 1629.400 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    56,097 | 17.826 |  1.600 | 1629.400 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    56,486 | 17.703 |  1.600 | 1629.400 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    56,568 | 17.678 |  1.500 | 1629.400 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    56,587 | 17.672 |  1.500 | 1629.400 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    56,589 | 17.671 |  1.500 | 1629.400 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   366,473 |  2.729 |  1.600 |   56.500 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   367,748 |  2.719 |  1.600 |   56.500 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   366,441 |  2.729 |  1.600 |   56.500 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   366,514 |  2.728 |  1.600 |   56.500 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   366,405 |  2.729 |  1.600 |   56.500 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    27,624 | 36.200 | 36.200 |   36.200 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |    90,909 | 11.000 |  4.600 |   36.200 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   168,492 |  5.935 |  2.600 |   36.200 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   231,043 |  4.328 |  2.000 |   44.500 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   252,755 |  3.956 |  1.700 | 2295.200 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   269,758 |  3.707 |  1.700 | 2295.200 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   268,850 |  3.720 |  1.700 | 2295.200 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   268,164 |  3.729 |  1.700 | 2295.200 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   267,814 |  3.734 |  1.700 | 2295.200 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   248,805 |  4.019 |  1.700 | 5709.100 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |    10,870 | 92.000 | 92.000 |   92.000 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |    69,013 | 14.490 |  4.200 |   92.000 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   157,853 |  6.335 |  3.000 |   92.000 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   118,219 |  8.459 |  2.200 | 1674.300 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    59,179 | 16.898 |  1.800 | 1674.300 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    53,125 | 18.824 |  1.800 | 7498.100 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    53,451 | 18.709 |  1.800 | 7498.100 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    53,542 | 18.677 |  1.800 | 7498.100 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    53,561 | 18.670 |  1.800 | 7498.100 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    53,563 | 18.670 |  1.800 | 7498.100 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   133,333 |  7.500 |  7.500 |    7.500 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   181,818 |  5.500 |  4.000 |    8.000 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   175,562 |  5.696 |  2.400 |   63.300 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   171,999 |  5.814 |  2.000 | 1169.300 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   257,573 |  3.882 |  1.600 | 3124.800 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   264,039 |  3.787 |  1.600 | 3612.200 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   264,740 |  3.777 |  1.600 | 3612.200 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   264,493 |  3.781 |  1.600 | 3612.200 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   264,468 |  3.781 |  1.600 | 3612.200 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   264,380 |  3.782 |  1.600 | 3612.200 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   243,902 |  4.100 |  4.100 |    4.100 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   800,000 |  1.250 |  0.500 |    4.100 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,036,660 |  0.491 |  0.200 |    4.100 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 1,890,359 |  0.529 |  0.200 |   41.500 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,111,888 |  0.474 |  0.200 |   63.400 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,895,375 |  0.528 |  0.200 |   63.400 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,904,780 |  0.525 |  0.200 |   63.400 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 1,903,846 |  0.525 |  0.200 |   63.400 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 1,903,506 |  0.525 |  0.200 |   63.400 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,882,087 |  0.531 |  0.200 |  120.100 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |    0.600 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 1,639,344 |  0.610 |  0.300 |    0.900 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,095,290 |  0.913 |  0.200 |    3.200 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   350,140 |  2.856 |  0.100 |   48.200 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    75,996 | 13.159 |  0.100 |  246.700 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    69,180 | 14.455 |  0.100 |  335.300 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    69,555 | 14.377 |  0.100 |  335.300 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    69,689 | 14.349 |  0.100 |  335.300 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    69,720 | 14.343 |  0.100 |  335.300 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    69,716 | 14.344 |  0.100 |  335.300 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |    0.600 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 1,785,714 |  0.560 |  0.300 |    1.200 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 3,703,704 |  0.270 |  0.100 |    1.200 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 3,346,720 |  0.299 |  0.100 |    9.100 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,001,741 |  0.333 |  0.100 |   80.500 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,420,012 |  0.413 |  0.100 |   80.500 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,427,096 |  0.412 |  0.100 |   80.500 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,428,240 |  0.412 |  0.100 |   80.500 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,428,802 |  0.412 |  0.100 |   80.500 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,422,598 |  0.413 |  0.100 |   80.500 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  16,447 |    60.800 |
| create   | —    |   0 | up        |     10 | A       |     1 |  20,747 |    48.200 |
| create   | —    |   0 | up        |    100 | A       |     1 |  10,000 |   100.000 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   2,540 |   393.700 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     349 |  2862.500 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,398 |   417.000 |
| create   | —    |   0 | down      |    100 | A       |     1 |   8,842 |   113.100 |
| create   | —    |   0 | down      |     10 | A       |     1 |  25,707 |    38.900 |
| create   | —    |   0 | down      |      1 | A       |     1 |  22,989 |    43.500 |
| create   | —    |   0 | down      |      0 | A       |     1 |  23,866 |    41.900 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   4,513 |   221.600 |
| sequence | —    |   0 | up        |     10 | A       |     1 |   8,613 |   116.100 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   5,368 |   186.300 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     381 |  2623.700 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      31 | 31953.800 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      18 | 56089.800 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      18 | 54490.500 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      17 | 59701.700 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      13 | 74981.300 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  53,763 |    18.600 |
| values   | —    |   0 | up        |      1 | A       |     1 |  15,974 |    62.600 |
| values   | —    |   0 | up        |     10 | A       |     1 |  14,749 |    67.800 |
| values   | —    |   0 | up        |    100 | A       |     1 |   4,815 |   207.700 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     419 |  2388.700 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     102 |  9789.400 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     396 |  2525.600 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,604 |   623.300 |
| values   | —    |   0 | down      |     10 | A       |     1 |  13,228 |    75.600 |
| values   | —    |   0 | down      |      1 | A       |     1 |  33,333 |    30.000 |
| values   | —    |   0 | down      |      0 | A       |     1 |  33,113 |    30.200 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  84,160,512 |         9,859,784 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,972,032 |        10,006,816 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  80,060,416 |        10,657,096 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 101,900,288 |        15,597,424 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 305,188,864 |        64,600,344 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 399,126,528 |       109,766,360 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 402,038,784 |       114,577,720 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 403,922,944 |       115,012,480 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 403,947,520 |       115,079,496 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 404,021,248 |       115,032,440 |

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
