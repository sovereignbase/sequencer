# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:00:39.812Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    43,525 |       22.975 |       22.975 |         22.975 |     0.000 | 0: 22.975    | 0: 22.975    |
| apply    | random | A       | scaleDown     |  9,999 |    15,995 |       62.521 |       62.521 |         62.521 |     0.000 | 0: 62.521    | 0: 62.521    |
| apply    | random | A       | fullLifecycle | 19,999 |    23,393 |       42.747 |       42.747 |         42.747 |     0.000 | 0: 42.747    | 0: 42.747    |
| create   | —      | A       | scaleUp       |      6 |     1,729 |      578.250 |      578.250 |        578.250 |     0.000 | 0: 578.250   | 0: 578.250   |
| create   | —      | A       | scaleDown     |      5 |     4,116 |      242.980 |      242.980 |        242.980 |     0.000 | 0: 242.980   | 0: 242.980   |
| create   | —      | A       | fullLifecycle |     11 |     2,348 |      425.855 |      425.855 |        425.855 |     0.000 | 0: 425.855   | 0: 425.855   |
| insert   | head   | A       | scaleUp       |  5,000 |   812,466 |        1.231 |        1.231 |          1.231 |     0.000 | 0: 1.231     | 0: 1.231     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   812,466 |        1.231 |        1.231 |          1.231 |     0.000 | 0: 1.231     | 0: 1.231     |
| insert   | random | A       | scaleUp       | 10,000 |   115,946 |        8.625 |        8.625 |          8.625 |     0.000 | 0: 8.625     | 0: 8.625     |
| insert   | random | A       | scaleDown     | 10,000 |    43,404 |       23.039 |       23.039 |         23.039 |     0.000 | 0: 23.039    | 0: 23.039    |
| insert   | random | A       | fullLifecycle | 20,000 |    63,163 |       15.832 |       15.832 |         15.832 |     0.000 | 0: 15.832    | 0: 15.832    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,256,597 |        0.796 |        0.796 |          0.796 |     0.000 | 0: 0.796     | 0: 0.796     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,256,597 |        0.796 |        0.796 |          0.796 |     0.000 | 0: 0.796     | 0: 0.796     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   149,978 |        6.668 |        6.668 |          6.668 |     0.000 | 0: 6.668     | 0: 6.668     |
| remove   | head   | A       | fullLifecycle |  5,000 |   149,978 |        6.668 |        6.668 |          6.668 |     0.000 | 0: 6.668     | 0: 6.668     |
| remove   | random | A       | scaleUp       | 10,000 |    82,417 |       12.133 |       12.133 |         12.133 |     0.000 | 0: 12.133    | 0: 12.133    |
| remove   | random | A       | scaleDown     | 10,000 |    33,647 |       29.720 |       29.720 |         29.720 |     0.000 | 0: 29.720    | 0: 29.720    |
| remove   | random | A       | fullLifecycle | 20,000 |    47,786 |       20.927 |       20.927 |         20.927 |     0.000 | 0: 20.927    | 0: 20.927    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   224,196 |        4.460 |        4.460 |          4.460 |     0.000 | 0: 4.460     | 0: 4.460     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   224,196 |        4.460 |        4.460 |          4.460 |     0.000 | 0: 4.460     | 0: 4.460     |
| replace  | head   | A       | scaleUp       | 10,000 |   379,291 |        2.636 |        2.636 |          2.636 |     0.000 | 0: 2.636     | 0: 2.636     |
| replace  | head   | A       | scaleDown     | 10,000 |   169,467 |        5.901 |        5.901 |          5.901 |     0.000 | 0: 5.901     | 0: 5.901     |
| replace  | head   | A       | fullLifecycle | 20,000 |   234,265 |        4.269 |        4.269 |          4.269 |     0.000 | 0: 4.269     | 0: 4.269     |
| replace  | random | A       | scaleUp       | 10,000 |    77,340 |       12.930 |       12.930 |         12.930 |     0.000 | 0: 12.930    | 0: 12.930    |
| replace  | random | A       | scaleDown     | 10,000 |    31,324 |       31.925 |       31.925 |         31.925 |     0.000 | 0: 31.925    | 0: 31.925    |
| replace  | random | A       | fullLifecycle | 20,000 |    44,588 |       22.427 |       22.427 |         22.427 |     0.000 | 0: 22.427    | 0: 22.427    |
| replace  | tail   | A       | scaleUp       | 10,000 |   431,137 |        2.319 |        2.319 |          2.319 |     0.000 | 0: 2.319     | 0: 2.319     |
| replace  | tail   | A       | scaleDown     | 10,000 |   181,116 |        5.521 |        5.521 |          5.521 |     0.000 | 0: 5.521     | 0: 5.521     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   255,077 |        3.920 |        3.920 |          3.920 |     0.000 | 0: 3.920     | 0: 3.920     |
| sequence | —      | A       | scaleUp       |      5 |       162 |     6174.640 |     6174.640 |       6174.640 |     0.000 | 0: 6174.640  | 0: 6174.640  |
| sequence | —      | A       | scaleDown     |      5 |        16 |    64476.120 |    64476.120 |      64476.120 |     0.000 | 0: 64476.120 | 0: 64476.120 |
| sequence | —      | A       | fullLifecycle |     10 |        28 |    35325.380 |    35325.380 |      35325.380 |     0.000 | 0: 35325.380 | 0: 35325.380 |
| value    | head   | A       | scaleUp       | 10,000 | 3,094,825 |        0.323 |        0.323 |          0.323 |     0.000 | 0: 0.323     | 0: 0.323     |
| value    | head   | A       | scaleDown     | 10,000 | 1,231,072 |        0.812 |        0.812 |          0.812 |     0.000 | 0: 0.812     | 0: 0.812     |
| value    | head   | A       | fullLifecycle | 20,000 | 1,761,463 |        0.568 |        0.568 |          0.568 |     0.000 | 0: 0.568     | 0: 0.568     |
| value    | random | A       | scaleUp       | 10,000 |    98,949 |       10.106 |       10.106 |         10.106 |     0.000 | 0: 10.106    | 0: 10.106    |
| value    | random | A       | scaleDown     | 10,000 |    40,868 |       24.469 |       24.469 |         24.469 |     0.000 | 0: 24.469    | 0: 24.469    |
| value    | random | A       | fullLifecycle | 20,000 |    57,844 |       17.288 |       17.288 |         17.288 |     0.000 | 0: 17.288    | 0: 17.288    |
| value    | tail   | A       | scaleUp       | 10,000 | 4,261,485 |        0.235 |        0.235 |          0.235 |     0.000 | 0: 0.235     | 0: 0.235     |
| value    | tail   | A       | scaleDown     | 10,000 | 1,455,117 |        0.687 |        0.687 |          0.687 |     0.000 | 0: 0.687     | 0: 0.687     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,169,456 |        0.461 |        0.461 |          0.461 |     0.000 | 0: 0.461     | 0: 0.461     |
| values   | —      | A       | scaleUp       |      5 |       447 |     2234.900 |     2234.900 |       2234.900 |     0.000 | 0: 2234.900  | 0: 2234.900  |
| values   | —      | A       | scaleDown     |      5 |     1,036 |      965.420 |      965.420 |        965.420 |     0.000 | 0: 965.420   | 0: 965.420   |
| values   | —      | A       | fullLifecycle |     10 |       625 |     1600.160 |     1600.160 |       1600.160 |     0.000 | 0: 1600.160  | 0: 1600.160  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |   114,943 |  8.700 |  8.700 |     8.700 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |   133,156 |  7.510 |  6.800 |     9.200 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   111,995 |  8.929 |  3.800 |    56.700 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   119,561 |  8.364 |  2.800 |   419.800 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    43,525 | 22.975 |  2.800 |   614.800 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    23,665 | 42.257 |  2.800 |  9742.600 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    23,465 | 42.616 |  2.800 |  9742.600 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    23,510 | 42.536 |  2.800 |  9742.600 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    23,393 | 42.747 |  2.800 |  9742.600 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    23,393 | 42.747 |  2.800 |  9742.600 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   312,500 |  3.200 |  1.200 |     9.500 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   526,316 |  1.900 |  1.000 |     9.500 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   312,969 |  3.195 |  0.400 |  1149.300 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   812,466 |  1.231 |  0.400 |  1149.300 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   812,466 |  1.231 |  0.400 |  1149.300 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   812,466 |  1.231 |  0.400 |  1149.300 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   812,466 |  1.231 |  0.400 |  1149.300 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   812,466 |  1.231 |  0.400 |  1149.300 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   812,466 |  1.231 |  0.400 |  1149.300 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   526,316 |  1.900 |  1.900 |     1.900 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   574,713 |  1.740 |  1.200 |     3.600 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   473,485 |  2.112 |  1.100 |    11.300 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   446,309 |  2.241 |  0.500 |   305.800 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   115,946 |  8.625 |  0.500 |  1885.000 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    63,704 | 15.698 |  0.500 |  1885.000 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    63,015 | 15.869 |  0.500 |  1885.000 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    63,136 | 15.839 |  0.500 |  1885.000 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    63,160 | 15.833 |  0.500 |  1885.000 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    63,163 | 15.832 |  0.500 |  1885.000 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   144,928 |  6.900 |  6.900 |     6.900 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   413,223 |  2.420 |  1.200 |     6.900 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   538,213 |  1.858 |  0.900 |     8.300 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 | 1,304,802 |  0.766 |  0.300 |    13.400 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,256,597 |  0.796 |  0.300 |    60.800 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,256,597 |  0.796 |  0.300 |    60.800 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,256,597 |  0.796 |  0.300 |    60.800 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,256,597 |  0.796 |  0.300 |    60.800 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,256,597 |  0.796 |  0.300 |    60.800 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,256,597 |  0.796 |  0.300 |    60.800 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   144,611 |  6.915 |  1.600 | 10566.000 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   149,206 |  6.702 |  1.600 | 10566.000 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   149,934 |  6.670 |  1.600 | 10566.000 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   149,978 |  6.668 |  1.600 | 10566.000 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   149,978 |  6.668 |  1.600 | 10566.000 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   312,500 |  3.200 |  3.200 |     3.200 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   317,460 |  3.150 |  2.900 |     3.600 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   267,809 |  3.734 |  1.700 |    23.100 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   291,809 |  3.427 |  1.100 |    37.600 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    82,417 | 12.133 |  1.100 |   694.100 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    48,158 | 20.765 |  1.100 |  1156.900 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    47,663 | 20.981 |  1.100 |  1156.900 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    47,770 | 20.934 |  1.100 |  1156.900 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    47,784 | 20.927 |  1.100 |  1156.900 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    47,786 | 20.927 |  1.100 |  1156.900 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |         — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   224,401 |  4.456 |  1.600 |    83.600 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   223,654 |  4.471 |  1.600 |    83.600 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   224,239 |  4.460 |  1.600 |    83.600 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   224,238 |  4.460 |  1.600 |    83.600 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   224,196 |  4.460 |  1.600 |    83.600 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    42,735 | 23.400 | 23.400 |    23.400 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   136,799 |  7.310 |  3.600 |    23.400 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   214,777 |  4.656 |  2.000 |    25.700 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   351,407 |  2.846 |  1.400 |    73.300 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   379,291 |  2.636 |  1.400 |  1027.700 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   261,783 |  3.820 |  1.400 |  1027.700 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   254,737 |  3.926 |  1.400 |  1027.700 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   253,700 |  3.942 |  1.400 |  1027.700 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   253,351 |  3.947 |  1.400 |  1027.700 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   234,265 |  4.269 |  1.400 |  6435.400 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |   232,558 |  4.300 |  4.300 |     4.300 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   239,234 |  4.180 |  3.300 |     7.500 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   246,427 |  4.058 |  2.200 |    12.000 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   253,588 |  3.943 |  1.600 |    35.200 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    77,340 | 12.930 |  1.600 |  3361.600 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    44,865 | 22.289 |  1.600 |  8703.500 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    44,463 | 22.490 |  1.600 |  8703.500 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    44,572 | 22.435 |  1.600 |  8703.500 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    44,587 | 22.428 |  1.600 |  8703.500 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    44,588 | 22.427 |  1.600 |  8703.500 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   322,581 |  3.100 |  3.100 |     3.100 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   283,286 |  3.530 |  3.100 |     4.300 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   245,098 |  4.080 |  1.800 |    53.300 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   345,220 |  2.897 |  1.300 |   352.200 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   431,137 |  2.319 |  1.300 |   352.200 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   260,289 |  3.842 |  1.300 |  6311.000 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   255,079 |  3.920 |  1.300 |  6311.000 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   255,144 |  3.919 |  1.300 |  6311.000 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   255,095 |  3.920 |  1.300 |  6311.000 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   255,077 |  3.920 |  1.300 |  6311.000 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   344,828 |  2.900 |  2.900 |     2.900 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 | 1,176,471 |  0.850 |  0.400 |     2.900 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,557,545 |  0.391 |  0.100 |     2.900 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 3,332,223 |  0.300 |  0.100 |    19.800 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,094,825 |  0.323 |  0.100 |    19.800 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 1,800,163 |  0.556 |  0.100 |    41.100 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 1,782,707 |  0.561 |  0.100 |    41.100 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 1,782,848 |  0.561 |  0.100 |    41.100 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 1,782,061 |  0.561 |  0.100 |    41.100 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 1,761,463 |  0.568 |  0.100 |   131.800 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 2,000,000 |  0.500 |  0.500 |     0.500 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 2,631,579 |  0.380 |  0.200 |     0.600 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 | 1,298,701 |  0.770 |  0.100 |     5.100 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   574,812 |  1.740 |  0.100 |    54.000 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    98,949 | 10.106 |  0.100 |   338.800 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    58,293 | 17.155 |  0.100 |   661.600 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    57,712 | 17.327 |  0.100 |   661.600 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    57,823 | 17.294 |  0.100 |   661.600 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    57,849 | 17.286 |  0.100 |   661.600 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    57,844 | 17.288 |  0.100 |   661.600 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 2,500,000 |  0.400 |  0.400 |     0.400 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 | 2,941,176 |  0.340 |  0.200 |     0.700 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 5,376,344 |  0.186 |  0.100 |     0.700 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 6,301,197 |  0.159 |  0.100 |     3.200 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 4,261,485 |  0.235 |  0.100 |    57.500 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,204,586 |  0.454 |  0.100 |   126.000 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,173,771 |  0.460 |  0.100 |   126.000 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,176,540 |  0.459 |  0.100 |   126.000 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,176,715 |  0.459 |  0.100 |   126.000 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,169,456 |  0.461 |  0.100 |   126.000 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  13,298 |    75.200 |
| create   | —    |   0 | up        |     10 | A       |     1 |  34,247 |    29.200 |
| create   | —    |   0 | up        |    100 | A       |     1 |  16,722 |    59.800 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   3,327 |   300.600 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     361 |  2767.000 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   1,120 |   892.700 |
| create   | —    |   0 | down      |    100 | A       |     1 |   5,928 |   168.700 |
| create   | —    |   0 | down      |     10 | A       |     1 |  18,248 |    54.800 |
| create   | —    |   0 | down      |      1 | A       |     1 |  17,123 |    58.400 |
| create   | —    |   0 | down      |      0 | A       |     1 |  24,814 |    40.300 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   4,299 |   232.600 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  28,011 |    35.700 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   7,225 |   138.400 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     575 |  1739.300 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      35 | 28727.200 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      14 | 71208.400 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      13 | 77016.700 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      10 | 96722.100 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      13 | 77412.400 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  47,619 |    21.000 |
| values   | —    |   0 | up        |      1 | A       |     1 |  10,661 |    93.800 |
| values   | —    |   0 | up        |     10 | A       |     1 |  31,447 |    31.800 |
| values   | —    |   0 | up        |    100 | A       |     1 |   6,333 |   157.900 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     564 |  1773.100 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     110 |  9117.900 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     258 |  3877.900 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,238 |   808.000 |
| values   | —    |   0 | down      |     10 | A       |     1 |  13,459 |    74.300 |
| values   | —    |   0 | down      |      1 | A       |     1 |  28,986 |    34.500 |
| values   | —    |   0 | down      |      0 | A       |     1 |  30,864 |    32.400 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  83,214,336 |         9,858,872 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  75,649,024 |        10,005,904 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  77,144,064 |        10,656,208 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 | 100,884,480 |        15,596,568 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 307,089,408 |        64,599,488 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 397,549,568 |       109,765,336 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 401,231,872 |       114,576,864 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 401,920,000 |       115,011,624 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 401,014,784 |       115,081,112 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 402,472,960 |       114,912,248 |

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
