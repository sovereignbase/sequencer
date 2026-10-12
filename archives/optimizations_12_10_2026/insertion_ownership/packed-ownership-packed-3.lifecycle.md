# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:19:27.830Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 17,684 | 56.548 | 56.548 | 56.548 | 0.000 | 0: 56.548 | 0: 56.548 |
| apply | random | A | scaleDown | 9,999 | 10,279 | 97.289 | 97.289 | 97.289 | 0.000 | 0: 97.289 | 0: 97.289 |
| apply | random | A | fullLifecycle | 19,999 | 13,001 | 76.918 | 76.918 | 76.918 | 0.000 | 0: 76.918 | 0: 76.918 |
| create | — | A | scaleUp | 6 | 787 | 1270.500 | 1270.500 | 1270.500 | 0.000 | 0: 1270.500 | 0: 1270.500 |
| create | — | A | scaleDown | 5 | 5,082 | 196.760 | 196.760 | 196.760 | 0.000 | 0: 196.760 | 0: 196.760 |
| create | — | A | fullLifecycle | 11 | 1,278 | 782.436 | 782.436 | 782.436 | 0.000 | 0: 782.436 | 0: 782.436 |
| insert | head | A | scaleUp | 5,000 | 446,963 | 2.237 | 2.237 | 2.237 | 0.000 | 0: 2.237 | 0: 2.237 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 446,963 | 2.237 | 2.237 | 2.237 | 0.000 | 0: 2.237 | 0: 2.237 |
| insert | random | A | scaleUp | 10,000 | 51,859 | 19.283 | 19.283 | 19.283 | 0.000 | 0: 19.283 | 0: 19.283 |
| insert | random | A | scaleDown | 10,000 | 27,730 | 36.062 | 36.062 | 36.062 | 0.000 | 0: 36.062 | 0: 36.062 |
| insert | random | A | fullLifecycle | 20,000 | 36,137 | 27.672 | 27.672 | 27.672 | 0.000 | 0: 27.672 | 0: 27.672 |
| insert | tail | A | scaleUp | 5,000 | 480,266 | 2.082 | 2.082 | 2.082 | 0.000 | 0: 2.082 | 0: 2.082 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 480,266 | 2.082 | 2.082 | 2.082 | 0.000 | 0: 2.082 | 0: 2.082 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 122,241 | 8.181 | 8.181 | 8.181 | 0.000 | 0: 8.181 | 0: 8.181 |
| remove | head | A | fullLifecycle | 5,000 | 122,241 | 8.181 | 8.181 | 8.181 | 0.000 | 0: 8.181 | 0: 8.181 |
| remove | random | A | scaleUp | 10,000 | 35,785 | 27.944 | 27.944 | 27.944 | 0.000 | 0: 27.944 | 0: 27.944 |
| remove | random | A | scaleDown | 10,000 | 18,918 | 52.859 | 52.859 | 52.859 | 0.000 | 0: 52.859 | 0: 52.859 |
| remove | random | A | fullLifecycle | 20,000 | 24,752 | 40.402 | 40.402 | 40.402 | 0.000 | 0: 40.402 | 0: 40.402 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 137,648 | 7.265 | 7.265 | 7.265 | 0.000 | 0: 7.265 | 0: 7.265 |
| remove | tail | A | fullLifecycle | 5,000 | 137,648 | 7.265 | 7.265 | 7.265 | 0.000 | 0: 7.265 | 0: 7.265 |
| replace | head | A | scaleUp | 10,000 | 136,414 | 7.331 | 7.331 | 7.331 | 0.000 | 0: 7.331 | 0: 7.331 |
| replace | head | A | scaleDown | 10,000 | 118,758 | 8.421 | 8.421 | 8.421 | 0.000 | 0: 8.421 | 0: 8.421 |
| replace | head | A | fullLifecycle | 20,000 | 126,975 | 7.876 | 7.876 | 7.876 | 0.000 | 0: 7.876 | 0: 7.876 |
| replace | random | A | scaleUp | 10,000 | 35,119 | 28.475 | 28.475 | 28.475 | 0.000 | 0: 28.475 | 0: 28.475 |
| replace | random | A | scaleDown | 10,000 | 20,183 | 49.546 | 49.546 | 49.546 | 0.000 | 0: 49.546 | 0: 49.546 |
| replace | random | A | fullLifecycle | 20,000 | 25,634 | 39.010 | 39.010 | 39.010 | 0.000 | 0: 39.010 | 0: 39.010 |
| replace | tail | A | scaleUp | 10,000 | 179,360 | 5.575 | 5.575 | 5.575 | 0.000 | 0: 5.575 | 0: 5.575 |
| replace | tail | A | scaleDown | 10,000 | 98,620 | 10.140 | 10.140 | 10.140 | 0.000 | 0: 10.140 | 0: 10.140 |
| replace | tail | A | fullLifecycle | 20,000 | 127,265 | 7.858 | 7.858 | 7.858 | 0.000 | 0: 7.858 | 0: 7.858 |
| sequence | — | A | scaleUp | 5 | 76 | 13199.800 | 13199.800 | 13199.800 | 0.000 | 0: 13199.800 | 0: 13199.800 |
| sequence | — | A | scaleDown | 5 | 15 | 65663.800 | 65663.800 | 65663.800 | 0.000 | 0: 65663.800 | 0: 65663.800 |
| sequence | — | A | fullLifecycle | 10 | 25 | 39431.800 | 39431.800 | 39431.800 | 0.000 | 0: 39431.800 | 0: 39431.800 |
| value | head | A | scaleUp | 10,000 | 1,408,590 | 0.710 | 0.710 | 0.710 | 0.000 | 0: 0.710 | 0: 0.710 |
| value | head | A | scaleDown | 10,000 | 713,114 | 1.402 | 1.402 | 1.402 | 0.000 | 0: 1.402 | 0: 1.402 |
| value | head | A | fullLifecycle | 20,000 | 946,867 | 1.056 | 1.056 | 1.056 | 0.000 | 0: 1.056 | 0: 1.056 |
| value | random | A | scaleUp | 10,000 | 39,623 | 25.238 | 25.238 | 25.238 | 0.000 | 0: 25.238 | 0: 25.238 |
| value | random | A | scaleDown | 10,000 | 25,238 | 39.622 | 39.622 | 39.622 | 0.000 | 0: 39.622 | 0: 39.622 |
| value | random | A | fullLifecycle | 20,000 | 30,836 | 32.430 | 32.430 | 32.430 | 0.000 | 0: 32.430 | 0: 32.430 |
| value | tail | A | scaleUp | 10,000 | 1,901,032 | 0.526 | 0.526 | 0.526 | 0.000 | 0: 0.526 | 0: 0.526 |
| value | tail | A | scaleDown | 10,000 | 1,025,483 | 0.975 | 0.975 | 0.975 | 0.000 | 0: 0.975 | 0: 0.975 |
| value | tail | A | fullLifecycle | 20,000 | 1,332,285 | 0.751 | 0.751 | 0.751 | 0.000 | 0: 0.751 | 0: 0.751 |
| values | — | A | scaleUp | 5 | 207 | 4830.240 | 4830.240 | 4830.240 | 0.000 | 0: 4830.240 | 0: 4830.240 |
| values | — | A | scaleDown | 5 | 981 | 1019.640 | 1019.640 | 1019.640 | 0.000 | 0: 1019.640 | 0: 1019.640 |
| values | — | A | fullLifecycle | 10 | 342 | 2924.940 | 2924.940 | 2924.940 | 0.000 | 0: 2924.940 | 0: 2924.940 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 71,429 | 14.000 | 14.000 | 14.000 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 58,106 | 17.210 | 14.000 | 21.700 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 54,019 | 18.512 | 9.500 | 181.500 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 54,043 | 18.504 | 6.600 | 795.100 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 17,684 | 56.548 | 4.600 | 28508.100 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 12,783 | 78.227 | 4.600 | 28508.100 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 12,996 | 76.944 | 4.600 | 28508.100 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 13,031 | 76.741 | 4.600 | 28508.100 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 13,001 | 76.918 | 4.600 | 28508.100 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 13,001 | 76.918 | 4.600 | 28508.100 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 177,936 | 5.620 | 2.600 | 14.500 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 272,331 | 3.672 | 2.600 | 17.800 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 431,369 | 2.318 | 0.900 | 50.900 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 446,963 | 2.237 | 0.700 | 102.400 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 446,963 | 2.237 | 0.700 | 102.400 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 446,963 | 2.237 | 0.700 | 102.400 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 446,963 | 2.237 | 0.700 | 102.400 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 446,963 | 2.237 | 0.700 | 102.400 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 446,963 | 2.237 | 0.700 | 102.400 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 357,143 | 2.800 | 2.800 | 2.800 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 260,417 | 3.840 | 2.800 | 7.800 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 221,288 | 4.519 | 2.800 | 10.100 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 167,051 | 5.986 | 1.100 | 703.500 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 51,859 | 19.283 | 0.700 | 3326.400 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 35,374 | 28.269 | 0.700 | 9175.900 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 36,025 | 27.758 | 0.700 | 9175.900 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 36,120 | 27.685 | 0.700 | 9175.900 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 36,135 | 27.674 | 0.700 | 9175.900 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 36,137 | 27.672 | 0.700 | 9175.900 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 151,515 | 6.600 | 6.600 | 6.600 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 274,725 | 3.640 | 2.700 | 6.600 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 293,427 | 3.408 | 2.200 | 12.800 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 218,503 | 4.577 | 0.800 | 1143.700 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 480,266 | 2.082 | 0.500 | 1143.700 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 480,266 | 2.082 | 0.500 | 1143.700 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 480,266 | 2.082 | 0.500 | 1143.700 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 480,266 | 2.082 | 0.500 | 1143.700 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 480,266 | 2.082 | 0.500 | 1143.700 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 480,266 | 2.082 | 0.500 | 1143.700 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 115,914 | 8.627 | 2.700 | 3868.100 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 121,745 | 8.214 | 2.600 | 3868.100 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 122,167 | 8.186 | 2.600 | 3868.100 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 122,241 | 8.181 | 2.600 | 3868.100 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 122,241 | 8.181 | 2.600 | 3868.100 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 196,078 | 5.100 | 5.100 | 5.100 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 137,552 | 7.270 | 5.100 | 8.900 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 133,565 | 7.487 | 4.600 | 22.700 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 123,050 | 8.127 | 2.900 | 93.500 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 35,785 | 27.944 | 2.000 | 3180.800 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 24,191 | 41.339 | 2.000 | 43914.900 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 24,677 | 40.523 | 2.000 | 43914.900 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 24,741 | 40.419 | 2.000 | 43914.900 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 24,750 | 40.403 | 2.000 | 43914.900 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 24,752 | 40.402 | 2.000 | 43914.900 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 131,678 | 7.594 | 3.000 | 801.300 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 137,238 | 7.287 | 2.800 | 801.300 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 137,576 | 7.269 | 2.800 | 801.300 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 137,640 | 7.265 | 2.800 | 801.300 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 137,648 | 7.265 | 2.800 | 801.300 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 47,619 | 21.000 | 21.000 | 21.000 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 84,175 | 11.880 | 8.700 | 21.000 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 94,189 | 10.617 | 5.300 | 164.600 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 149,925 | 6.670 | 3.600 | 164.600 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 136,414 | 7.331 | 1.800 | 7951.600 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 130,691 | 7.652 | 1.800 | 7951.600 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 132,526 | 7.546 | 1.800 | 7951.600 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 132,509 | 7.547 | 1.800 | 7951.600 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 132,468 | 7.549 | 1.800 | 7951.600 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 126,975 | 7.876 | 1.800 | 7951.600 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 163,934 | 6.100 | 6.100 | 6.100 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 114,025 | 8.770 | 6.100 | 10.600 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 113,546 | 8.807 | 5.200 | 19.600 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 105,232 | 9.503 | 4.100 | 90.100 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 35,119 | 28.475 | 2.500 | 5681.100 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 25,067 | 39.894 | 2.500 | 32478.100 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 25,553 | 39.134 | 2.500 | 32478.100 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 25,623 | 39.027 | 2.500 | 32478.100 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 25,633 | 39.012 | 2.500 | 32478.100 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 25,634 | 39.010 | 2.500 | 32478.100 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 200,000 | 5.000 | 5.000 | 5.000 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 125,313 | 7.980 | 5.000 | 9.500 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 109,063 | 9.169 | 4.700 | 102.800 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 105,563 | 9.473 | 3.100 | 1628.400 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 179,360 | 5.575 | 1.800 | 1628.400 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 124,938 | 8.004 | 1.800 | 11691.000 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 127,092 | 7.868 | 1.800 | 11691.000 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 127,231 | 7.860 | 1.800 | 11691.000 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 127,264 | 7.858 | 1.800 | 11691.000 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 127,265 | 7.858 | 1.800 | 11691.000 |
| value | head | 0 | up | 1 | 8 | A | 1 | 384,615 | 2.600 | 2.600 | 2.600 |
| value | head | 0 | up | 10 | 410 | A | 10 | 719,424 | 1.390 | 0.900 | 2.700 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 1,315,789 | 0.760 | 0.400 | 2.700 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 1,405,877 | 0.711 | 0.400 | 41.000 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 1,408,590 | 0.710 | 0.200 | 54.600 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 935,550 | 1.069 | 0.200 | 248.100 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 951,748 | 1.051 | 0.200 | 248.100 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 953,121 | 1.049 | 0.200 | 248.100 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 953,191 | 1.049 | 0.200 | 248.100 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 946,867 | 1.056 | 0.200 | 248.100 |
| value | random | 0 | up | 1 | 8 | A | 1 | 1,666,667 | 0.600 | 0.600 | 0.600 |
| value | random | 0 | up | 10 | 410 | A | 10 | 1,149,425 | 0.870 | 0.600 | 1.600 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 706,714 | 1.415 | 0.300 | 3.300 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 259,390 | 3.855 | 0.300 | 57.200 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 39,623 | 25.238 | 0.300 | 23922.100 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 30,105 | 33.217 | 0.300 | 23922.100 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 30,728 | 32.544 | 0.300 | 23922.100 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 30,823 | 32.444 | 0.200 | 23922.100 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 30,836 | 32.429 | 0.200 | 23922.100 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 30,836 | 32.430 | 0.200 | 23922.100 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 2,000,000 | 0.500 | 0.500 | 0.500 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 1,250,000 | 0.800 | 0.500 | 2.100 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 2,444,988 | 0.409 | 0.300 | 2.100 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 2,374,169 | 0.421 | 0.200 | 15.600 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 1,901,032 | 0.526 | 0.100 | 76.100 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 1,314,270 | 0.761 | 0.100 | 76.100 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 1,333,030 | 0.750 | 0.100 | 76.100 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 1,334,838 | 0.749 | 0.100 | 76.100 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 1,335,252 | 0.749 | 0.100 | 76.100 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 1,332,285 | 0.751 | 0.100 | 76.100 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 6,743 | 148.300 |
| create | — | 0 | up | 10 | A | 1 | 9,911 | 100.900 |
| create | — | 0 | up | 100 | A | 1 | 7,496 | 133.400 |
| create | — | 0 | up | 1,000 | A | 1 | 1,289 | 775.600 |
| create | — | 0 | up | 10,000 | A | 1 | 167 | 5982.800 |
| create | — | 0 | down | 1,000 | A | 1 | 1,615 | 619.100 |
| create | — | 0 | down | 100 | A | 1 | 4,864 | 205.600 |
| create | — | 0 | down | 10 | A | 1 | 13,812 | 72.400 |
| create | — | 0 | down | 1 | A | 1 | 18,975 | 52.700 |
| create | — | 0 | down | 0 | A | 1 | 29,412 | 34.000 |
| sequence | — | 0 | up | 1 | A | 1 | 2,390 | 418.400 |
| sequence | — | 0 | up | 10 | A | 1 | 9,058 | 110.400 |
| sequence | — | 0 | up | 100 | A | 1 | 2,990 | 334.500 |
| sequence | — | 0 | up | 1,000 | A | 1 | 197 | 5088.000 |
| sequence | — | 0 | up | 10,000 | A | 1 | 17 | 60047.700 |
| sequence | — | 0 | down | 1,000 | A | 1 | 13 | 75548.400 |
| sequence | — | 0 | down | 100 | A | 1 | 11 | 87454.700 |
| sequence | — | 0 | down | 10 | A | 1 | 11 | 87219.200 |
| sequence | — | 0 | down | 1 | A | 1 | 13 | 78078.400 |
| sequence | — | 0 | down | 0 | A | 1 | 54,645 | 18.300 |
| values | — | 0 | up | 1 | A | 1 | 6,658 | 150.200 |
| values | — | 0 | up | 10 | A | 1 | 8,681 | 115.200 |
| values | — | 0 | up | 100 | A | 1 | 2,593 | 385.700 |
| values | — | 0 | up | 1,000 | A | 1 | 208 | 4810.600 |
| values | — | 0 | up | 10,000 | A | 1 | 54 | 18689.500 |
| values | — | 0 | down | 1,000 | A | 1 | 234 | 4282.100 |
| values | — | 0 | down | 100 | A | 1 | 1,517 | 659.400 |
| values | — | 0 | down | 10 | A | 1 | 9,588 | 104.300 |
| values | — | 0 | down | 1 | A | 1 | 39,216 | 25.500 |
| values | — | 0 | down | 0 | A | 1 | 37,175 | 26.900 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 82,845,696 | 9,859,112 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 74,731,520 | 10,006,432 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 76,222,464 | 10,656,736 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 99,823,616 | 15,597,120 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 301,342,720 | 64,600,568 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 396,066,816 | 109,766,512 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 400,375,808 | 114,577,872 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 402,358,272 | 115,012,632 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 402,485,248 | 115,082,120 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 402,112,512 | 114,913,256 |

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
