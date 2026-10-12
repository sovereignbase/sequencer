# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:48:36.943Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method   | case   | Replica | scope         |  calls |   ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run  | maximum run  |
| -------- | ------ | ------- | ------------- | -----: | --------: | -----------: | -----------: | -------------: | --------: | ------------ | ------------ |
| apply    | random | A       | scaleUp       | 10,000 |    39,423 |       25.366 |       25.366 |         25.366 |     0.000 | 0: 25.366    | 0: 25.366    |
| apply    | random | A       | scaleDown     |  9,999 |    26,012 |       38.444 |       38.444 |         38.444 |     0.000 | 0: 38.444    | 0: 38.444    |
| apply    | random | A       | fullLifecycle | 19,999 |    31,343 |       31.905 |       31.905 |         31.905 |     0.000 | 0: 31.905    | 0: 31.905    |
| create   | —      | A       | scaleUp       |      6 |     1,404 |      712.067 |      712.067 |        712.067 |     0.000 | 0: 712.067   | 0: 712.067   |
| create   | —      | A       | scaleDown     |      5 |     8,924 |      112.060 |      112.060 |        112.060 |     0.000 | 0: 112.060   | 0: 112.060   |
| create   | —      | A       | fullLifecycle |     11 |     2,276 |      439.336 |      439.336 |        439.336 |     0.000 | 0: 439.336   | 0: 439.336   |
| insert   | head   | A       | scaleUp       |  5,000 |   902,706 |        1.108 |        1.108 |          1.108 |     0.000 | 0: 1.108     | 0: 1.108     |
| insert   | head   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | head   | A       | fullLifecycle |  5,000 |   902,706 |        1.108 |        1.108 |          1.108 |     0.000 | 0: 1.108     | 0: 1.108     |
| insert   | random | A       | scaleUp       | 10,000 |   105,953 |        9.438 |        9.438 |          9.438 |     0.000 | 0: 9.438     | 0: 9.438     |
| insert   | random | A       | scaleDown     | 10,000 |    64,523 |       15.498 |       15.498 |         15.498 |     0.000 | 0: 15.498    | 0: 15.498    |
| insert   | random | A       | fullLifecycle | 20,000 |    80,204 |       12.468 |       12.468 |         12.468 |     0.000 | 0: 12.468    | 0: 12.468    |
| insert   | tail   | A       | scaleUp       |  5,000 | 1,072,087 |        0.933 |        0.933 |          0.933 |     0.000 | 0: 0.933     | 0: 0.933     |
| insert   | tail   | A       | scaleDown     |      0 |         — |            — |            — |              — |         — | —            | —            |
| insert   | tail   | A       | fullLifecycle |  5,000 | 1,072,087 |        0.933 |        0.933 |          0.933 |     0.000 | 0: 0.933     | 0: 0.933     |
| remove   | head   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | head   | A       | scaleDown     |  5,000 |   391,209 |        2.556 |        2.556 |          2.556 |     0.000 | 0: 2.556     | 0: 2.556     |
| remove   | head   | A       | fullLifecycle |  5,000 |   391,209 |        2.556 |        2.556 |          2.556 |     0.000 | 0: 2.556     | 0: 2.556     |
| remove   | random | A       | scaleUp       | 10,000 |    75,381 |       13.266 |       13.266 |         13.266 |     0.000 | 0: 13.266    | 0: 13.266    |
| remove   | random | A       | scaleDown     | 10,000 |    50,575 |       19.772 |       19.772 |         19.772 |     0.000 | 0: 19.772    | 0: 19.772    |
| remove   | random | A       | fullLifecycle | 20,000 |    60,536 |       16.519 |       16.519 |         16.519 |     0.000 | 0: 16.519    | 0: 16.519    |
| remove   | tail   | A       | scaleUp       |      0 |         — |            — |            — |              — |         — | —            | —            |
| remove   | tail   | A       | scaleDown     |  5,000 |   392,600 |        2.547 |        2.547 |          2.547 |     0.000 | 0: 2.547     | 0: 2.547     |
| remove   | tail   | A       | fullLifecycle |  5,000 |   392,600 |        2.547 |        2.547 |          2.547 |     0.000 | 0: 2.547     | 0: 2.547     |
| replace  | head   | A       | scaleUp       | 10,000 |   332,809 |        3.005 |        3.005 |          3.005 |     0.000 | 0: 3.005     | 0: 3.005     |
| replace  | head   | A       | scaleDown     | 10,000 |   248,026 |        4.032 |        4.032 |          4.032 |     0.000 | 0: 4.032     | 0: 4.032     |
| replace  | head   | A       | fullLifecycle | 20,000 |   284,229 |        3.518 |        3.518 |          3.518 |     0.000 | 0: 3.518     | 0: 3.518     |
| replace  | random | A       | scaleUp       | 10,000 |    69,093 |       14.473 |       14.473 |         14.473 |     0.000 | 0: 14.473    | 0: 14.473    |
| replace  | random | A       | scaleDown     | 10,000 |    50,475 |       19.812 |       19.812 |         19.812 |     0.000 | 0: 19.812    | 0: 19.812    |
| replace  | random | A       | fullLifecycle | 20,000 |    58,334 |       17.143 |       17.143 |         17.143 |     0.000 | 0: 17.143    | 0: 17.143    |
| replace  | tail   | A       | scaleUp       | 10,000 |   301,797 |        3.313 |        3.313 |          3.313 |     0.000 | 0: 3.313     | 0: 3.313     |
| replace  | tail   | A       | scaleDown     | 10,000 |   316,021 |        3.164 |        3.164 |          3.164 |     0.000 | 0: 3.164     | 0: 3.164     |
| replace  | tail   | A       | fullLifecycle | 20,000 |   308,745 |        3.239 |        3.239 |          3.239 |     0.000 | 0: 3.239     | 0: 3.239     |
| sequence | —      | A       | scaleUp       |      5 |       150 |     6686.580 |     6686.580 |       6686.580 |     0.000 | 0: 6686.580  | 0: 6686.580  |
| sequence | —      | A       | scaleDown     |      5 |        21 |    48307.240 |    48307.240 |      48307.240 |     0.000 | 0: 48307.240 | 0: 48307.240 |
| sequence | —      | A       | fullLifecycle |     10 |        36 |    27496.910 |    27496.910 |      27496.910 |     0.000 | 0: 27496.910 | 0: 27496.910 |
| value    | head   | A       | scaleUp       | 10,000 | 2,860,330 |        0.350 |        0.350 |          0.350 |     0.000 | 0: 0.350     | 0: 0.350     |
| value    | head   | A       | scaleDown     | 10,000 | 1,661,544 |        0.602 |        0.602 |          0.602 |     0.000 | 0: 0.602     | 0: 0.602     |
| value    | head   | A       | fullLifecycle | 20,000 | 2,102,033 |        0.476 |        0.476 |          0.476 |     0.000 | 0: 0.476     | 0: 0.476     |
| value    | random | A       | scaleUp       | 10,000 |    92,135 |       10.854 |       10.854 |         10.854 |     0.000 | 0: 10.854    | 0: 10.854    |
| value    | random | A       | scaleDown     | 10,000 |    61,984 |       16.133 |       16.133 |         16.133 |     0.000 | 0: 16.133    | 0: 16.133    |
| value    | random | A       | fullLifecycle | 20,000 |    74,110 |       13.493 |       13.493 |         13.493 |     0.000 | 0: 13.493    | 0: 13.493    |
| value    | tail   | A       | scaleUp       | 10,000 | 3,688,540 |        0.271 |        0.271 |          0.271 |     0.000 | 0: 0.271     | 0: 0.271     |
| value    | tail   | A       | scaleDown     | 10,000 | 2,267,008 |        0.441 |        0.441 |          0.441 |     0.000 | 0: 0.441     | 0: 0.441     |
| value    | tail   | A       | fullLifecycle | 20,000 | 2,808,121 |        0.356 |        0.356 |          0.356 |     0.000 | 0: 0.356     | 0: 0.356     |
| values   | —      | A       | scaleUp       |      5 |       391 |     2560.040 |     2560.040 |       2560.040 |     0.000 | 0: 2560.040  | 0: 2560.040  |
| values   | —      | A       | scaleDown     |      5 |     1,084 |      922.580 |      922.580 |        922.580 |     0.000 | 0: 922.580   | 0: 922.580   |
| values   | —      | A       | fullLifecycle |     10 |       574 |     1741.310 |     1741.310 |       1741.310 |     0.000 | 0: 1741.310  | 0: 1741.310  |

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
| apply   | random |   0 | up        |      1 |       8 | A       |      1 |    58,140 | 17.200 | 17.200 |   17.200 |
| apply   | random |   0 | up        |     10 |     410 | A       |     10 |    91,491 | 10.930 |  8.900 |   17.200 |
| apply   | random |   0 | up        |    100 |   4,859 | A       |    100 |   106,056 |  9.429 |  5.100 |   74.600 |
| apply   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   101,521 |  9.850 |  3.700 |  404.500 |
| apply   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    39,423 | 25.366 |  3.700 | 4261.700 |
| apply   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    31,338 | 31.910 |  3.400 | 4261.700 |
| apply   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    31,434 | 31.813 |  3.400 | 4261.700 |
| apply   | random |   0 | down      |     10 |     444 | A       | 19,990 |    31,500 | 31.746 |  3.200 | 4261.700 |
| apply   | random |   0 | down      |      1 |      89 | A       | 19,999 |    31,343 | 31.905 |  3.200 | 4261.700 |
| apply   | random |   0 | down      |      0 |       0 | A       | 19,999 |    31,343 | 31.905 |  3.200 | 4261.700 |
| insert  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| insert  | head   |   0 | up        |     10 |     410 | A       |      5 |   202,429 |  4.940 |  1.800 |   11.200 |
| insert  | head   |   0 | up        |    100 |   4,859 | A       |     50 |   451,671 |  2.214 |  1.600 |   11.200 |
| insert  | head   |   0 | up        |  1,000 |  50,842 | A       |    500 |   863,856 |  1.158 |  0.500 |   21.700 |
| insert  | head   |   0 | up        | 10,000 | 501,051 | A       |  5,000 |   902,706 |  1.108 |  0.500 |   30.800 |
| insert  | head   |   0 | down      |  1,000 |  49,083 | A       |  5,000 |   902,706 |  1.108 |  0.500 |   30.800 |
| insert  | head   |   0 | down      |    100 |   5,271 | A       |  5,000 |   902,706 |  1.108 |  0.500 |   30.800 |
| insert  | head   |   0 | down      |     10 |     444 | A       |  5,000 |   902,706 |  1.108 |  0.500 |   30.800 |
| insert  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   902,706 |  1.108 |  0.500 |   30.800 |
| insert  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   902,706 |  1.108 |  0.500 |   30.800 |
| insert  | random |   0 | up        |      1 |       8 | A       |      1 |   333,333 |  3.000 |  3.000 |    3.000 |
| insert  | random |   0 | up        |     10 |     410 | A       |     10 |   409,836 |  2.440 |  1.800 |    4.600 |
| insert  | random |   0 | up        |    100 |   4,859 | A       |    100 |   420,345 |  2.379 |  1.500 |    7.200 |
| insert  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   337,450 |  2.963 |  0.700 |  403.100 |
| insert  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   105,953 |  9.438 |  0.700 | 1985.800 |
| insert  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    79,839 | 12.525 |  0.700 | 1985.800 |
| insert  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    80,036 | 12.494 |  0.700 | 1985.800 |
| insert  | random |   0 | down      |     10 |     444 | A       | 19,990 |    80,168 | 12.474 |  0.700 | 1985.800 |
| insert  | random |   0 | down      |      1 |      89 | A       | 19,999 |    80,200 | 12.469 |  0.700 | 1985.800 |
| insert  | random |   0 | down      |      0 |       0 | A       | 20,000 |    80,204 | 12.468 |  0.700 | 1985.800 |
| insert  | tail   |   0 | up        |      1 |       8 | A       |      1 |   136,986 |  7.300 |  7.300 |    7.300 |
| insert  | tail   |   0 | up        |     10 |     410 | A       |      5 |   352,113 |  2.840 |  1.600 |    7.300 |
| insert  | tail   |   0 | up        |    100 |   4,859 | A       |     50 |   476,190 |  2.100 |  1.300 |   10.500 |
| insert  | tail   |   0 | up        |  1,000 |  50,842 | A       |    500 |   857,192 |  1.167 |  0.400 |   24.600 |
| insert  | tail   |   0 | up        | 10,000 | 501,051 | A       |  5,000 | 1,072,087 |  0.933 |  0.400 |   84.300 |
| insert  | tail   |   0 | down      |  1,000 |  49,083 | A       |  5,000 | 1,072,087 |  0.933 |  0.400 |   84.300 |
| insert  | tail   |   0 | down      |    100 |   5,271 | A       |  5,000 | 1,072,087 |  0.933 |  0.400 |   84.300 |
| insert  | tail   |   0 | down      |     10 |     444 | A       |  5,000 | 1,072,087 |  0.933 |  0.400 |   84.300 |
| insert  | tail   |   0 | down      |      1 |      89 | A       |  5,000 | 1,072,087 |  0.933 |  0.400 |   84.300 |
| insert  | tail   |   0 | down      |      0 |       0 | A       |  5,000 | 1,072,087 |  0.933 |  0.400 |   84.300 |
| remove  | head   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | head   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   390,920 |  2.558 |  1.600 |   49.000 |
| remove  | head   |   0 | down      |    100 |   5,271 | A       |  4,950 |   391,484 |  2.554 |  1.600 |   51.500 |
| remove  | head   |   0 | down      |     10 |     444 | A       |  4,995 |   391,111 |  2.557 |  1.600 |   51.500 |
| remove  | head   |   0 | down      |      1 |      89 | A       |  5,000 |   391,209 |  2.556 |  1.600 |   51.500 |
| remove  | head   |   0 | down      |      0 |       0 | A       |  5,000 |   391,209 |  2.556 |  1.600 |   51.500 |
| remove  | random |   0 | up        |      1 |       8 | A       |      1 |   172,414 |  5.800 |  5.800 |    5.800 |
| remove  | random |   0 | up        |     10 |     410 | A       |     10 |   184,162 |  5.430 |  3.700 |   10.700 |
| remove  | random |   0 | up        |    100 |   4,859 | A       |    100 |   238,322 |  4.196 |  2.300 |   14.900 |
| remove  | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   228,373 |  4.379 |  1.300 |   65.600 |
| remove  | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    75,381 | 13.266 |  1.300 |  822.100 |
| remove  | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    60,125 | 16.632 |  1.300 | 6708.600 |
| remove  | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    60,378 | 16.562 |  1.300 | 6708.600 |
| remove  | random |   0 | down      |     10 |     444 | A       | 19,990 |    60,513 | 16.525 |  1.300 | 6708.600 |
| remove  | random |   0 | down      |      1 |      89 | A       | 19,999 |    60,533 | 16.520 |  1.300 | 6708.600 |
| remove  | random |   0 | down      |      0 |       0 | A       | 20,000 |    60,536 | 16.519 |  1.300 | 6708.600 |
| remove  | tail   |   0 | up        |      1 |       8 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |     10 |     410 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |    100 |   4,859 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        |  1,000 |  50,842 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | up        | 10,000 | 501,051 | A       |      0 |         — |      — |      — |        — |
| remove  | tail   |   0 | down      |  1,000 |  49,083 | A       |  4,500 |   395,253 |  2.530 |  1.600 |   52.100 |
| remove  | tail   |   0 | down      |    100 |   5,271 | A       |  4,950 |   392,449 |  2.548 |  1.600 |  108.300 |
| remove  | tail   |   0 | down      |     10 |     444 | A       |  4,995 |   392,537 |  2.548 |  1.500 |  108.300 |
| remove  | tail   |   0 | down      |      1 |      89 | A       |  4,999 |   392,630 |  2.547 |  1.500 |  108.300 |
| remove  | tail   |   0 | down      |      0 |       0 | A       |  5,000 |   392,600 |  2.547 |  1.500 |  108.300 |
| replace | head   |   0 | up        |      1 |       8 | A       |      1 |    48,077 | 20.800 | 20.800 |   20.800 |
| replace | head   |   0 | up        |     10 |     410 | A       |     10 |   121,803 |  8.210 |  5.000 |   20.800 |
| replace | head   |   0 | up        |    100 |   4,859 | A       |    100 |   201,005 |  4.975 |  2.900 |   28.800 |
| replace | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   281,793 |  3.549 |  1.900 |  131.300 |
| replace | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   332,809 |  3.005 |  1.700 | 1384.400 |
| replace | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   303,199 |  3.298 |  1.700 | 5118.400 |
| replace | head   |   0 | down      |    100 |   5,271 | A       | 19,900 |   302,574 |  3.305 |  1.700 | 5118.400 |
| replace | head   |   0 | down      |     10 |     444 | A       | 19,990 |   301,925 |  3.312 |  1.700 | 5118.400 |
| replace | head   |   0 | down      |      1 |      89 | A       | 19,999 |   301,549 |  3.316 |  1.700 | 5118.400 |
| replace | head   |   0 | down      |      0 |       0 | A       | 20,000 |   284,229 |  3.518 |  1.700 | 5118.400 |
| replace | random |   0 | up        |      1 |       8 | A       |      1 |    98,039 | 10.200 | 10.200 |   10.200 |
| replace | random |   0 | up        |     10 |     410 | A       |     10 |   170,940 |  5.850 |  4.400 |   10.200 |
| replace | random |   0 | up        |    100 |   4,859 | A       |    100 |   219,539 |  4.555 |  2.900 |   12.700 |
| replace | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   193,678 |  5.163 |  1.900 |   66.600 |
| replace | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    69,093 | 14.473 |  1.900 | 8461.600 |
| replace | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    57,953 | 17.255 |  1.800 | 8461.600 |
| replace | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    58,182 | 17.187 |  1.800 | 8461.600 |
| replace | random |   0 | down      |     10 |     444 | A       | 19,990 |    58,311 | 17.149 |  1.800 | 8461.600 |
| replace | random |   0 | down      |      1 |      89 | A       | 19,999 |    58,332 | 17.143 |  1.800 | 8461.600 |
| replace | random |   0 | down      |      0 |       0 | A       | 20,000 |    58,334 | 17.143 |  1.800 | 8461.600 |
| replace | tail   |   0 | up        |      1 |       8 | A       |      1 |   153,846 |  6.500 |  6.500 |    6.500 |
| replace | tail   |   0 | up        |     10 |     410 | A       |     10 |   190,114 |  5.260 |  4.200 |    7.700 |
| replace | tail   |   0 | up        |    100 |   4,859 | A       |    100 |   217,817 |  4.591 |  2.600 |   50.400 |
| replace | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   265,823 |  3.762 |  1.800 |  295.100 |
| replace | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 |   301,797 |  3.313 |  1.700 | 6081.200 |
| replace | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 |   308,412 |  3.242 |  1.700 | 6081.200 |
| replace | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 |   308,752 |  3.239 |  1.700 | 6081.200 |
| replace | tail   |   0 | down      |     10 |     444 | A       | 19,990 |   308,804 |  3.238 |  1.700 | 6081.200 |
| replace | tail   |   0 | down      |      1 |      89 | A       | 19,999 |   308,829 |  3.238 |  1.700 | 6081.200 |
| replace | tail   |   0 | down      |      0 |       0 | A       | 20,000 |   308,745 |  3.239 |  1.700 | 6081.200 |
| value   | head   |   0 | up        |      1 |       8 | A       |      1 |   344,828 |  2.900 |  2.900 |    2.900 |
| value   | head   |   0 | up        |     10 |     410 | A       |     10 |   980,392 |  1.020 |  0.600 |    2.900 |
| value   | head   |   0 | up        |    100 |   4,859 | A       |    100 | 2,114,165 |  0.473 |  0.300 |    2.900 |
| value   | head   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 2,419,550 |  0.413 |  0.200 |   26.900 |
| value   | head   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 2,860,330 |  0.350 |  0.100 |   30.500 |
| value   | head   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,133,489 |  0.469 |  0.100 |   30.500 |
| value   | head   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,130,712 |  0.469 |  0.100 |   30.500 |
| value   | head   |   0 | down      |     10 |     444 | A       | 19,990 | 2,129,995 |  0.469 |  0.100 |   30.500 |
| value   | head   |   0 | down      |      1 |      89 | A       | 19,999 | 2,129,025 |  0.470 |  0.100 |   30.500 |
| value   | head   |   0 | down      |      0 |       0 | A       | 20,000 | 2,102,033 |  0.476 |  0.100 |  121.100 |
| value   | random |   0 | up        |      1 |       8 | A       |      1 | 1,428,571 |  0.700 |  0.700 |    0.700 |
| value   | random |   0 | up        |     10 |     410 | A       |     10 | 1,960,784 |  0.510 |  0.300 |    0.900 |
| value   | random |   0 | up        |    100 |   4,859 | A       |    100 |   899,281 |  1.112 |  0.200 |   39.800 |
| value   | random |   0 | up        |  1,000 |  50,842 | A       |  1,000 |   471,631 |  2.120 |  0.100 |   39.800 |
| value   | random |   0 | up        | 10,000 | 501,051 | A       | 10,000 |    92,135 | 10.854 |  0.100 |  121.700 |
| value   | random |   0 | down      |  1,000 |  49,083 | A       | 19,000 |    73,707 | 13.567 |  0.100 |  393.800 |
| value   | random |   0 | down      |    100 |   5,271 | A       | 19,900 |    73,922 | 13.528 |  0.100 |  393.800 |
| value   | random |   0 | down      |     10 |     444 | A       | 19,990 |    74,085 | 13.498 |  0.100 |  393.800 |
| value   | random |   0 | down      |      1 |      89 | A       | 19,999 |    74,118 | 13.492 |  0.100 |  393.800 |
| value   | random |   0 | down      |      0 |       0 | A       | 20,000 |    74,110 | 13.493 |  0.100 |  393.800 |
| value   | tail   |   0 | up        |      1 |       8 | A       |      1 | 1,666,667 |  0.600 |  0.600 |    0.600 |
| value   | tail   |   0 | up        |     10 |     410 | A       |     10 |   515,464 |  1.940 |  0.300 |   13.200 |
| value   | tail   |   0 | up        |    100 |   4,859 | A       |    100 | 2,717,391 |  0.368 |  0.100 |   13.200 |
| value   | tail   |   0 | up        |  1,000 |  50,842 | A       |  1,000 | 4,110,152 |  0.243 |  0.100 |   13.200 |
| value   | tail   |   0 | up        | 10,000 | 501,051 | A       | 10,000 | 3,688,540 |  0.271 |  0.100 |   67.700 |
| value   | tail   |   0 | down      |  1,000 |  49,083 | A       | 19,000 | 2,809,529 |  0.356 |  0.100 |   67.700 |
| value   | tail   |   0 | down      |    100 |   5,271 | A       | 19,900 | 2,815,626 |  0.355 |  0.100 |   67.700 |
| value   | tail   |   0 | down      |     10 |     444 | A       | 19,990 | 2,817,557 |  0.355 |  0.100 |   67.700 |
| value   | tail   |   0 | down      |      1 |      89 | A       | 19,999 | 2,818,269 |  0.355 |  0.100 |   67.700 |
| value   | tail   |   0 | down      |      0 |       0 | A       | 20,000 | 2,808,121 |  0.356 |  0.100 |   67.700 |

## Management performance

| Method   | case | Run | direction | Strips | Replica | calls | ops/sec |       avg |
| -------- | ---- | --: | --------- | -----: | ------- | ----: | ------: | --------: |
| create   | —    |   0 | up        |      1 | A       |     1 |  15,674 |    63.800 |
| create   | —    |   0 | up        |     10 | A       |     1 |  23,041 |    43.400 |
| create   | —    |   0 | up        |    100 | A       |     1 |  10,811 |    92.500 |
| create   | —    |   0 | up        |  1,000 | A       |     1 |   1,652 |   605.400 |
| create   | —    |   0 | up        | 10,000 | A       |     1 |     366 |  2730.000 |
| create   | —    |   0 | down      |  1,000 | A       |     1 |   2,883 |   346.900 |
| create   | —    |   0 | down      |    100 | A       |     1 |  10,288 |    97.200 |
| create   | —    |   0 | down      |     10 | A       |     1 |  26,385 |    37.900 |
| create   | —    |   0 | down      |      1 | A       |     1 |  24,876 |    40.200 |
| create   | —    |   0 | down      |      0 | A       |     1 |  26,247 |    38.100 |
| sequence | —    |   0 | up        |      1 | A       |     1 |   4,466 |   223.900 |
| sequence | —    |   0 | up        |     10 | A       |     1 |  14,025 |    71.300 |
| sequence | —    |   0 | up        |    100 | A       |     1 |   5,546 |   180.300 |
| sequence | —    |   0 | up        |  1,000 | A       |     1 |     319 |  3133.700 |
| sequence | —    |   0 | up        | 10,000 | A       |     1 |      34 | 29823.700 |
| sequence | —    |   0 | down      |  1,000 | A       |     1 |      19 | 52432.100 |
| sequence | —    |   0 | down      |    100 | A       |     1 |      19 | 53757.000 |
| sequence | —    |   0 | down      |     10 | A       |     1 |      18 | 55163.700 |
| sequence | —    |   0 | down      |      1 | A       |     1 |      12 | 80163.600 |
| sequence | —    |   0 | down      |      0 | A       |     1 |  50,505 |    19.800 |
| values   | —    |   0 | up        |      1 | A       |     1 |  14,388 |    69.500 |
| values   | —    |   0 | up        |     10 | A       |     1 |  14,104 |    70.900 |
| values   | —    |   0 | up        |    100 | A       |     1 |   4,782 |   209.100 |
| values   | —    |   0 | up        |  1,000 | A       |     1 |     230 |  4353.300 |
| values   | —    |   0 | up        | 10,000 | A       |     1 |     123 |  8097.400 |
| values   | —    |   0 | down      |  1,000 | A       |     1 |     254 |  3940.700 |
| values   | —    |   0 | down      |    100 | A       |     1 |   1,852 |   540.000 |
| values   | —    |   0 | down      |     10 | A       |     1 |  13,699 |    73.000 |
| values   | —    |   0 | down      |      1 | A       |     1 |  34,364 |    29.100 |
| values   | —    |   0 | down      |      0 | A       |     1 |  33,223 |    30.100 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions |  Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| --: | --------- | ------- | -------------: | ------------------: | ------: | ---------------------: | -------------: | -------------: | ----------: | ----------------: |
|   0 | up        | A       |              1 |                   1 |       8 |                    108 |        108.000 |         13.500 |  85,139,456 |         9,859,824 |
|   0 | up        | A       |             10 |                  10 |     410 |                  3,540 |        354.000 |          8.634 |  76,431,360 |        10,014,664 |
|   0 | up        | A       |            100 |                 100 |   4,859 |                 41,292 |        412.920 |          8.498 |  78,000,128 |        10,657,160 |
|   0 | up        | A       |          1,000 |               1,000 |  50,842 |                430,756 |        430.756 |          8.472 |  99,876,864 |        15,598,616 |
|   0 | up        | A       |         10,000 |              10,000 | 501,051 |              4,248,428 |        424.843 |          8.479 | 307,523,584 |        64,600,624 |
|   0 | down      | A       |          1,000 |               1,000 |  49,083 |                416,684 |        416.684 |          8.489 | 400,482,304 |       109,766,520 |
|   0 | down      | A       |            100 |                 100 |   5,271 |                 44,588 |        445.880 |          8.459 | 406,142,976 |       114,577,880 |
|   0 | down      | A       |             10 |                  10 |     444 |                  3,812 |        381.200 |          8.586 | 406,990,848 |       115,012,640 |
|   0 | down      | A       |              1 |                   1 |      89 |                    756 |        756.000 |          8.494 | 406,654,976 |       115,079,656 |
|   0 | down      | A       |              0 |                   0 |       0 |                     20 |              — |              — | 407,433,216 |       115,032,600 |

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
