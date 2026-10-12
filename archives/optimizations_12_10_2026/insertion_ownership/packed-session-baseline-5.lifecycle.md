# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:20:40.560Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 15,625 | 64.001 | 64.001 | 64.001 | 0.000 | 0: 64.001 | 0: 64.001 |
| apply | random | A | scaleDown | 9,999 | 12,373 | 80.819 | 80.819 | 80.819 | 0.000 | 0: 80.819 | 0: 80.819 |
| apply | random | A | fullLifecycle | 19,999 | 13,810 | 72.410 | 72.410 | 72.410 | 0.000 | 0: 72.410 | 0: 72.410 |
| create | — | A | scaleUp | 6 | 732 | 1367.000 | 1367.000 | 1367.000 | 0.000 | 0: 1367.000 | 0: 1367.000 |
| create | — | A | scaleDown | 5 | 4,958 | 201.680 | 201.680 | 201.680 | 0.000 | 0: 201.680 | 0: 201.680 |
| create | — | A | fullLifecycle | 11 | 1,194 | 837.309 | 837.309 | 837.309 | 0.000 | 0: 837.309 | 0: 837.309 |
| insert | head | A | scaleUp | 5,000 | 392,455 | 2.548 | 2.548 | 2.548 | 0.000 | 0: 2.548 | 0: 2.548 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 392,455 | 2.548 | 2.548 | 2.548 | 0.000 | 0: 2.548 | 0: 2.548 |
| insert | random | A | scaleUp | 10,000 | 39,700 | 25.189 | 25.189 | 25.189 | 0.000 | 0: 25.189 | 0: 25.189 |
| insert | random | A | scaleDown | 10,000 | 34,290 | 29.163 | 29.163 | 29.163 | 0.000 | 0: 29.163 | 0: 29.163 |
| insert | random | A | fullLifecycle | 20,000 | 36,797 | 27.176 | 27.176 | 27.176 | 0.000 | 0: 27.176 | 0: 27.176 |
| insert | tail | A | scaleUp | 5,000 | 437,928 | 2.283 | 2.283 | 2.283 | 0.000 | 0: 2.283 | 0: 2.283 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 437,928 | 2.283 | 2.283 | 2.283 | 0.000 | 0: 2.283 | 0: 2.283 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 158,980 | 6.290 | 6.290 | 6.290 | 0.000 | 0: 6.290 | 0: 6.290 |
| remove | head | A | fullLifecycle | 5,000 | 158,980 | 6.290 | 6.290 | 6.290 | 0.000 | 0: 6.290 | 0: 6.290 |
| remove | random | A | scaleUp | 10,000 | 29,407 | 34.005 | 34.005 | 34.005 | 0.000 | 0: 34.005 | 0: 34.005 |
| remove | random | A | scaleDown | 10,000 | 25,528 | 39.173 | 39.173 | 39.173 | 0.000 | 0: 39.173 | 0: 39.173 |
| remove | random | A | fullLifecycle | 20,000 | 27,331 | 36.589 | 36.589 | 36.589 | 0.000 | 0: 36.589 | 0: 36.589 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 163,913 | 6.101 | 6.101 | 6.101 | 0.000 | 0: 6.101 | 0: 6.101 |
| remove | tail | A | fullLifecycle | 5,000 | 163,913 | 6.101 | 6.101 | 6.101 | 0.000 | 0: 6.101 | 0: 6.101 |
| replace | head | A | scaleUp | 10,000 | 132,957 | 7.521 | 7.521 | 7.521 | 0.000 | 0: 7.521 | 0: 7.521 |
| replace | head | A | scaleDown | 10,000 | 110,972 | 9.011 | 9.011 | 9.011 | 0.000 | 0: 9.011 | 0: 9.011 |
| replace | head | A | fullLifecycle | 20,000 | 120,974 | 8.266 | 8.266 | 8.266 | 0.000 | 0: 8.266 | 0: 8.266 |
| replace | random | A | scaleUp | 10,000 | 28,894 | 34.610 | 34.610 | 34.610 | 0.000 | 0: 34.610 | 0: 34.610 |
| replace | random | A | scaleDown | 10,000 | 26,028 | 38.420 | 38.420 | 38.420 | 0.000 | 0: 38.420 | 0: 38.420 |
| replace | random | A | fullLifecycle | 20,000 | 27,386 | 36.515 | 36.515 | 36.515 | 0.000 | 0: 36.515 | 0: 36.515 |
| replace | tail | A | scaleUp | 10,000 | 166,651 | 6.001 | 6.001 | 6.001 | 0.000 | 0: 6.001 | 0: 6.001 |
| replace | tail | A | scaleDown | 10,000 | 142,088 | 7.038 | 7.038 | 7.038 | 0.000 | 0: 7.038 | 0: 7.038 |
| replace | tail | A | fullLifecycle | 20,000 | 153,392 | 6.519 | 6.519 | 6.519 | 0.000 | 0: 6.519 | 0: 6.519 |
| sequence | — | A | scaleUp | 5 | 77 | 13030.020 | 13030.020 | 13030.020 | 0.000 | 0: 13030.020 | 0: 13030.020 |
| sequence | — | A | scaleDown | 5 | 12 | 80836.300 | 80836.300 | 80836.300 | 0.000 | 0: 80836.300 | 0: 80836.300 |
| sequence | — | A | fullLifecycle | 10 | 21 | 46933.160 | 46933.160 | 46933.160 | 0.000 | 0: 46933.160 | 0: 46933.160 |
| value | head | A | scaleUp | 10,000 | 1,165,922 | 0.858 | 0.858 | 0.858 | 0.000 | 0: 0.858 | 0: 0.858 |
| value | head | A | scaleDown | 10,000 | 791,346 | 1.264 | 1.264 | 1.264 | 0.000 | 0: 1.264 | 0: 1.264 |
| value | head | A | fullLifecycle | 20,000 | 942,791 | 1.061 | 1.061 | 1.061 | 0.000 | 0: 1.061 | 0: 1.061 |
| value | random | A | scaleUp | 10,000 | 37,632 | 26.573 | 26.573 | 26.573 | 0.000 | 0: 26.573 | 0: 26.573 |
| value | random | A | scaleDown | 10,000 | 31,677 | 31.569 | 31.569 | 31.569 | 0.000 | 0: 31.569 | 0: 31.569 |
| value | random | A | fullLifecycle | 20,000 | 34,399 | 29.071 | 29.071 | 29.071 | 0.000 | 0: 29.071 | 0: 29.071 |
| value | tail | A | scaleUp | 10,000 | 1,621,823 | 0.617 | 0.617 | 0.617 | 0.000 | 0: 0.617 | 0: 0.617 |
| value | tail | A | scaleDown | 10,000 | 1,076,287 | 0.929 | 0.929 | 0.929 | 0.000 | 0: 0.929 | 0: 0.929 |
| value | tail | A | fullLifecycle | 20,000 | 1,293,904 | 0.773 | 0.773 | 0.773 | 0.000 | 0: 0.773 | 0: 0.773 |
| values | — | A | scaleUp | 5 | 228 | 4393.400 | 4393.400 | 4393.400 | 0.000 | 0: 4393.400 | 0: 4393.400 |
| values | — | A | scaleDown | 5 | 725 | 1380.040 | 1380.040 | 1380.040 | 0.000 | 0: 1380.040 | 0: 1380.040 |
| values | — | A | fullLifecycle | 10 | 346 | 2886.720 | 2886.720 | 2886.720 | 0.000 | 0: 2886.720 | 0: 2886.720 |

## Aggregate memory usage

Nonempty checkpoint observations across all runs. Bytes per unit use total bytes divided by total units.

| Replica | scope | observations | avg bytes | B/Strip | B/Frame |
| --- | --- | ---: | ---: | ---: | ---: |
| A | scaleUp | 5 | 944824.800 | 425.175 | 8.479 |
| A | scaleDown | 4 | 116460.000 | 419.298 | 8.487 |
| A | fullLifecycle | 9 | 576662.667 | 424.641 | 8.480 |

## Aggregate disk usage

Nonempty checkpoint observations across all runs. Bytes per unit use total bytes divided by total units.

| Replica | scope | observations | avg bytes | B/Strip | B/Frame |
| --- | --- | ---: | ---: | ---: | ---: |
| A | scaleUp | 5 | 545497.800 | 245.476 | 4.895 |
| A | scaleDown | 4 | 67714.750 | 243.797 | 4.935 |
| A | fullLifecycle | 9 | 333149.778 | 245.324 | 4.899 |

## Scaling performance

Checkpoint values are cumulative full-lifecycle averages at that point and are never reset.

| Method | case | Run | direction | Strips | Frames | Replica | calls | ops/sec | avg | min | max |
| --- | --- | ---: | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: |
| apply | random | 0 | up | 1 | 8 | A | 1 | 40,161 | 24.900 | 24.900 | 24.900 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 67,204 | 14.880 | 12.700 | 24.900 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 55,857 | 17.903 | 7.700 | 114.600 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 48,340 | 20.687 | 6.300 | 822.900 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 15,625 | 64.001 | 5.900 | 32434.200 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 13,763 | 72.661 | 5.900 | 32434.200 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 13,834 | 72.286 | 5.900 | 32434.200 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 13,873 | 72.081 | 5.500 | 32434.200 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 13,810 | 72.410 | 5.500 | 32434.200 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 13,810 | 72.410 | 5.500 | 32434.200 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 136,986 | 7.300 | 2.300 | 25.000 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 272,331 | 3.672 | 1.900 | 25.000 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 444,050 | 2.252 | 0.900 | 76.200 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 392,455 | 2.548 | 0.900 | 109.500 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 392,455 | 2.548 | 0.900 | 109.500 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 392,455 | 2.548 | 0.900 | 109.500 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 392,455 | 2.548 | 0.900 | 109.500 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 392,455 | 2.548 | 0.900 | 109.500 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 392,455 | 2.548 | 0.900 | 109.500 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 200,000 | 5.000 | 5.000 | 5.000 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 207,039 | 4.830 | 2.400 | 20.700 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 227,946 | 4.387 | 2.300 | 20.700 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 169,653 | 5.894 | 1.100 | 587.600 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 39,700 | 25.189 | 1.100 | 28943.400 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 36,521 | 27.382 | 1.100 | 28943.400 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 36,683 | 27.261 | 1.100 | 28943.400 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 36,781 | 27.188 | 1.100 | 28943.400 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 36,795 | 27.177 | 1.100 | 28943.400 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 36,797 | 27.176 | 1.100 | 28943.400 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 78,740 | 12.700 | 12.700 | 12.700 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 221,239 | 4.520 | 2.400 | 12.700 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 272,331 | 3.672 | 1.800 | 12.700 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 469,043 | 2.132 | 0.800 | 53.400 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 437,928 | 2.283 | 0.800 | 513.300 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 437,928 | 2.283 | 0.800 | 513.300 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 437,928 | 2.283 | 0.800 | 513.300 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 437,928 | 2.283 | 0.800 | 513.300 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 437,928 | 2.283 | 0.800 | 513.300 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 437,928 | 2.283 | 0.800 | 513.300 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 158,358 | 6.315 | 2.800 | 129.300 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 158,514 | 6.309 | 2.700 | 129.300 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 158,998 | 6.289 | 2.400 | 129.300 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 158,980 | 6.290 | 2.400 | 129.300 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 158,980 | 6.290 | 2.400 | 129.300 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 113,636 | 8.800 | 8.800 | 8.800 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 145,985 | 6.850 | 5.600 | 12.000 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 137,476 | 7.274 | 3.500 | 15.600 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 112,648 | 8.877 | 2.700 | 94.000 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 29,407 | 34.005 | 2.700 | 19599.700 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 27,096 | 36.906 | 2.600 | 19599.700 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 27,244 | 36.706 | 2.600 | 19599.700 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 27,321 | 36.603 | 2.200 | 19599.700 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 27,329 | 36.591 | 2.200 | 19599.700 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 27,331 | 36.589 | 2.200 | 19599.700 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 164,471 | 6.080 | 2.900 | 92.500 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 163,447 | 6.118 | 2.900 | 171.500 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 163,928 | 6.100 | 2.500 | 171.500 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 163,908 | 6.101 | 2.500 | 171.500 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 163,913 | 6.101 | 2.500 | 171.500 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 28,490 | 35.100 | 35.100 | 35.100 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 82,988 | 12.050 | 7.300 | 35.100 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 110,767 | 9.028 | 4.200 | 47.000 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 140,117 | 7.137 | 3.300 | 110.800 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 132,957 | 7.521 | 2.800 | 3662.500 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 127,446 | 7.846 | 2.800 | 11990.100 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 126,645 | 7.896 | 2.800 | 11990.100 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 126,683 | 7.894 | 2.800 | 11990.100 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 126,574 | 7.901 | 2.800 | 11990.100 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 120,974 | 8.266 | 2.800 | 11990.100 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 83,333 | 12.000 | 12.000 | 12.000 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 116,279 | 8.600 | 6.600 | 12.000 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 111,844 | 8.941 | 4.200 | 61.900 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 82,506 | 12.120 | 3.900 | 1646.300 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 28,894 | 34.610 | 3.000 | 21160.600 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 27,218 | 36.741 | 3.000 | 21160.600 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 27,296 | 36.635 | 3.000 | 21160.600 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 27,376 | 36.529 | 3.000 | 21160.600 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 27,385 | 36.516 | 3.000 | 21160.600 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 27,386 | 36.515 | 3.000 | 21160.600 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 106,383 | 9.400 | 9.400 | 9.400 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 136,986 | 7.300 | 6.500 | 9.400 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 99,681 | 10.032 | 3.800 | 107.500 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 143,035 | 6.991 | 3.100 | 365.100 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 166,651 | 6.001 | 2.600 | 365.100 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 154,367 | 6.478 | 2.600 | 4190.000 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 153,360 | 6.521 | 2.600 | 4190.000 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 153,454 | 6.517 | 2.600 | 4190.000 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 153,426 | 6.518 | 2.600 | 4190.000 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 153,392 | 6.519 | 2.600 | 4190.000 |
| value | head | 0 | up | 1 | 8 | A | 1 | 256,410 | 3.900 | 3.900 | 3.900 |
| value | head | 0 | up | 10 | 410 | A | 10 | 714,286 | 1.400 | 0.900 | 3.900 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 1,329,787 | 0.752 | 0.400 | 3.900 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 1,306,165 | 0.766 | 0.300 | 34.700 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 1,165,922 | 0.858 | 0.300 | 105.500 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 942,848 | 1.061 | 0.300 | 105.500 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 946,555 | 1.056 | 0.300 | 105.500 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 947,995 | 1.055 | 0.300 | 105.500 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 947,694 | 1.055 | 0.300 | 105.500 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 942,791 | 1.061 | 0.300 | 110.800 |
| value | random | 0 | up | 1 | 8 | A | 1 | 909,091 | 1.100 | 1.100 | 1.100 |
| value | random | 0 | up | 10 | 410 | A | 10 | 1,333,333 | 0.750 | 0.500 | 1.200 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 746,269 | 1.340 | 0.200 | 3.600 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 227,827 | 4.389 | 0.200 | 55.200 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 37,632 | 26.573 | 0.200 | 839.900 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 34,162 | 29.272 | 0.200 | 966.200 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 34,282 | 29.170 | 0.200 | 966.200 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 34,384 | 29.084 | 0.200 | 966.200 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 34,399 | 29.071 | 0.200 | 966.200 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 34,399 | 29.071 | 0.200 | 966.200 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 1,111,111 | 0.900 | 0.900 | 0.900 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 1,492,537 | 0.670 | 0.500 | 1.400 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 2,386,635 | 0.419 | 0.200 | 2.400 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 2,239,140 | 0.447 | 0.200 | 6.400 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 1,621,823 | 0.617 | 0.200 | 120.400 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 1,295,443 | 0.772 | 0.200 | 120.400 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 1,294,814 | 0.772 | 0.200 | 120.400 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 1,295,310 | 0.772 | 0.200 | 120.400 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 1,295,423 | 0.772 | 0.200 | 120.400 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 1,293,904 | 0.773 | 0.200 | 120.400 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 7,716 | 129.600 |
| create | — | 0 | up | 10 | A | 1 | 17,483 | 57.200 |
| create | — | 0 | up | 100 | A | 1 | 6,549 | 152.700 |
| create | — | 0 | up | 1,000 | A | 1 | 1,379 | 725.100 |
| create | — | 0 | up | 10,000 | A | 1 | 151 | 6640.900 |
| create | — | 0 | down | 1,000 | A | 1 | 1,410 | 709.400 |
| create | — | 0 | down | 100 | A | 1 | 6,978 | 143.300 |
| create | — | 0 | down | 10 | A | 1 | 13,245 | 75.500 |
| create | — | 0 | down | 1 | A | 1 | 22,173 | 45.100 |
| create | — | 0 | down | 0 | A | 1 | 28,490 | 35.100 |
| sequence | — | 0 | up | 1 | A | 1 | 2,503 | 399.600 |
| sequence | — | 0 | up | 10 | A | 1 | 8,772 | 114.000 |
| sequence | — | 0 | up | 100 | A | 1 | 2,430 | 411.500 |
| sequence | — | 0 | up | 1,000 | A | 1 | 235 | 4249.300 |
| sequence | — | 0 | up | 10,000 | A | 1 | 17 | 59975.700 |
| sequence | — | 0 | down | 1,000 | A | 1 | 8 | 120715.000 |
| sequence | — | 0 | down | 100 | A | 1 | 11 | 95160.700 |
| sequence | — | 0 | down | 10 | A | 1 | 11 | 89811.100 |
| sequence | — | 0 | down | 1 | A | 1 | 10 | 98477.900 |
| sequence | — | 0 | down | 0 | A | 1 | 59,524 | 16.800 |
| values | — | 0 | up | 1 | A | 1 | 8,177 | 122.300 |
| values | — | 0 | up | 10 | A | 1 | 16,260 | 61.500 |
| values | — | 0 | up | 100 | A | 1 | 1,635 | 611.800 |
| values | — | 0 | up | 1,000 | A | 1 | 152 | 6580.600 |
| values | — | 0 | up | 10,000 | A | 1 | 69 | 14590.800 |
| values | — | 0 | down | 1,000 | A | 1 | 169 | 5899.900 |
| values | — | 0 | down | 100 | A | 1 | 1,127 | 887.000 |
| values | — | 0 | down | 10 | A | 1 | 17,699 | 56.500 |
| values | — | 0 | down | 1 | A | 1 | 35,971 | 27.800 |
| values | — | 0 | down | 0 | A | 1 | 34,483 | 29.000 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 82,731,008 | 9,851,760 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 75,169,792 | 10,006,872 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 76,890,112 | 10,657,176 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 100,982,784 | 15,597,560 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 305,803,264 | 64,600,480 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 400,334,848 | 109,766,328 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 403,869,696 | 114,577,856 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 404,725,760 | 115,012,616 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 404,656,128 | 115,079,632 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 404,684,800 | 115,032,576 |

## Disk usage

Disk bytes are the size of node:v8.serialize(sequence), excluding filesystem metadata; no disk I/O is timed.

| Run | direction | Replica | visible Strips | Frames | sequence bytes | disk B/Strip | disk B/Frame |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 8 | 84 | 84.000 | 10.500 |
| 0 | up | A | 10 | 410 | 1215 | 121.500 | 2.963 |
| 0 | up | A | 100 | 4859 | 18896 | 188.960 | 3.889 |
| 0 | up | A | 1000 | 50842 | 196583 | 196.583 | 3.867 |
| 0 | up | A | 10000 | 501051 | 2510711 | 251.071 | 5.011 |
| 0 | down | A | 1000 | 49083 | 242299 | 242.299 | 4.937 |
| 0 | down | A | 100 | 5271 | 25719 | 257.190 | 4.879 |
| 0 | down | A | 10 | 444 | 2211 | 221.100 | 4.980 |
| 0 | down | A | 1 | 89 | 630 | 630.000 | 7.079 |
| 0 | down | A | 0 | 0 | 37 | — | — |

## Lifecycle space averages

| Run | Replica | scope | memory B/Strip | memory B/Frame | storage B/Strip | storage B/Frame |
| ---: | --- | --- | ---: | ---: | ---: | ---: |
| 0 | A | scaleUp | 425.175 | 8.479 | 245.476 | 4.895 |
| 0 | A | scaleDown | 419.298 | 8.487 | 243.797 | 4.935 |
| 0 | A | fullLifecycle | 424.641 | 8.480 | 245.324 | 4.899 |

## Measurement notes

- Scale is the number of visible logical Strips maintained by the benchmark model. Every mutation targets a complete Strip boundary.
- The workload has two peers editing the same document. Every local Gossip is applied by the receiver and every acknowledgement returned by apply is gossiped back to the sender. apply.random times only the measured peer applying the remote replacement Gossip.
- Per-Replica retained bytes after restart are estimated as four bytes per Sequence metadata word plus eight bytes per JavaScript Footage array slot. Process RSS is shared and reported at checkpoint scope.
- Persistent representation size is the byte length of node:v8.serialize over the automatically collected public Sequence.
- Every checkpoint measures temporary Projection creation without replacing the two active gossip peers.
