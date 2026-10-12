# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:16:48.349Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 13,913 | 71.877 | 71.877 | 71.877 | 0.000 | 0: 71.877 | 0: 71.877 |
| apply | random | A | scaleDown | 9,999 | 8,869 | 112.752 | 112.752 | 112.752 | 0.000 | 0: 112.752 | 0: 112.752 |
| apply | random | A | fullLifecycle | 19,999 | 10,833 | 92.314 | 92.314 | 92.314 | 0.000 | 0: 92.314 | 0: 92.314 |
| create | — | A | scaleUp | 6 | 412 | 2424.417 | 2424.417 | 2424.417 | 0.000 | 0: 2424.417 | 0: 2424.417 |
| create | — | A | scaleDown | 5 | 1,902 | 525.880 | 525.880 | 525.880 | 0.000 | 0: 525.880 | 0: 525.880 |
| create | — | A | fullLifecycle | 11 | 640 | 1561.445 | 1561.445 | 1561.445 | 0.000 | 0: 1561.445 | 0: 1561.445 |
| insert | head | A | scaleUp | 5,000 | 318,340 | 3.141 | 3.141 | 3.141 | 0.000 | 0: 3.141 | 0: 3.141 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 318,340 | 3.141 | 3.141 | 3.141 | 0.000 | 0: 3.141 | 0: 3.141 |
| insert | random | A | scaleUp | 10,000 | 34,385 | 29.083 | 29.083 | 29.083 | 0.000 | 0: 29.083 | 0: 29.083 |
| insert | random | A | scaleDown | 10,000 | 23,077 | 43.334 | 43.334 | 43.334 | 0.000 | 0: 43.334 | 0: 43.334 |
| insert | random | A | fullLifecycle | 20,000 | 27,618 | 36.208 | 36.208 | 36.208 | 0.000 | 0: 36.208 | 0: 36.208 |
| insert | tail | A | scaleUp | 5,000 | 392,197 | 2.550 | 2.550 | 2.550 | 0.000 | 0: 2.550 | 0: 2.550 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 392,197 | 2.550 | 2.550 | 2.550 | 0.000 | 0: 2.550 | 0: 2.550 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 113,208 | 8.833 | 8.833 | 8.833 | 0.000 | 0: 8.833 | 0: 8.833 |
| remove | head | A | fullLifecycle | 5,000 | 113,208 | 8.833 | 8.833 | 8.833 | 0.000 | 0: 8.833 | 0: 8.833 |
| remove | random | A | scaleUp | 10,000 | 24,726 | 40.443 | 40.443 | 40.443 | 0.000 | 0: 40.443 | 0: 40.443 |
| remove | random | A | scaleDown | 10,000 | 17,378 | 57.544 | 57.544 | 57.544 | 0.000 | 0: 57.544 | 0: 57.544 |
| remove | random | A | fullLifecycle | 20,000 | 20,411 | 48.994 | 48.994 | 48.994 | 0.000 | 0: 48.994 | 0: 48.994 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 116,091 | 8.614 | 8.614 | 8.614 | 0.000 | 0: 8.614 | 0: 8.614 |
| remove | tail | A | fullLifecycle | 5,000 | 116,091 | 8.614 | 8.614 | 8.614 | 0.000 | 0: 8.614 | 0: 8.614 |
| replace | head | A | scaleUp | 10,000 | 111,046 | 9.005 | 9.005 | 9.005 | 0.000 | 0: 9.005 | 0: 9.005 |
| replace | head | A | scaleDown | 10,000 | 92,717 | 10.785 | 10.785 | 10.785 | 0.000 | 0: 10.785 | 0: 10.785 |
| replace | head | A | fullLifecycle | 20,000 | 101,057 | 9.895 | 9.895 | 9.895 | 0.000 | 0: 9.895 | 0: 9.895 |
| replace | random | A | scaleUp | 10,000 | 25,292 | 39.539 | 39.539 | 39.539 | 0.000 | 0: 39.539 | 0: 39.539 |
| replace | random | A | scaleDown | 10,000 | 18,457 | 54.180 | 54.180 | 54.180 | 0.000 | 0: 54.180 | 0: 54.180 |
| replace | random | A | fullLifecycle | 20,000 | 21,340 | 46.860 | 46.860 | 46.860 | 0.000 | 0: 46.860 | 0: 46.860 |
| replace | tail | A | scaleUp | 10,000 | 139,394 | 7.174 | 7.174 | 7.174 | 0.000 | 0: 7.174 | 0: 7.174 |
| replace | tail | A | scaleDown | 10,000 | 88,529 | 11.296 | 11.296 | 11.296 | 0.000 | 0: 11.296 | 0: 11.296 |
| replace | tail | A | fullLifecycle | 20,000 | 108,286 | 9.235 | 9.235 | 9.235 | 0.000 | 0: 9.235 | 0: 9.235 |
| sequence | — | A | scaleUp | 5 | 66 | 15214.160 | 15214.160 | 15214.160 | 0.000 | 0: 15214.160 | 0: 15214.160 |
| sequence | — | A | scaleDown | 5 | 5 | 184185.940 | 184185.940 | 184185.940 | 0.000 | 0: 184185.940 | 0: 184185.940 |
| sequence | — | A | fullLifecycle | 10 | 10 | 99700.050 | 99700.050 | 99700.050 | 0.000 | 0: 99700.050 | 0: 99700.050 |
| value | head | A | scaleUp | 10,000 | 911,552 | 1.097 | 1.097 | 1.097 | 0.000 | 0: 1.097 | 0: 1.097 |
| value | head | A | scaleDown | 10,000 | 571,494 | 1.750 | 1.750 | 1.750 | 0.000 | 0: 1.750 | 0: 1.750 |
| value | head | A | fullLifecycle | 20,000 | 702,536 | 1.423 | 1.423 | 1.423 | 0.000 | 0: 1.423 | 0: 1.423 |
| value | random | A | scaleUp | 10,000 | 32,032 | 31.219 | 31.219 | 31.219 | 0.000 | 0: 31.219 | 0: 31.219 |
| value | random | A | scaleDown | 10,000 | 21,041 | 47.525 | 47.525 | 47.525 | 0.000 | 0: 47.525 | 0: 47.525 |
| value | random | A | fullLifecycle | 20,000 | 25,399 | 39.372 | 39.372 | 39.372 | 0.000 | 0: 39.372 | 0: 39.372 |
| value | tail | A | scaleUp | 10,000 | 1,564,602 | 0.639 | 0.639 | 0.639 | 0.000 | 0: 0.639 | 0: 0.639 |
| value | tail | A | scaleDown | 10,000 | 863,491 | 1.158 | 1.158 | 1.158 | 0.000 | 0: 1.158 | 0: 1.158 |
| value | tail | A | fullLifecycle | 20,000 | 1,112,824 | 0.899 | 0.899 | 0.899 | 0.000 | 0: 0.899 | 0: 0.899 |
| values | — | A | scaleUp | 5 | 265 | 3774.620 | 3774.620 | 3774.620 | 0.000 | 0: 3774.620 | 0: 3774.620 |
| values | — | A | scaleDown | 5 | 973 | 1027.920 | 1027.920 | 1027.920 | 0.000 | 0: 1027.920 | 0: 1027.920 |
| values | — | A | fullLifecycle | 10 | 416 | 2401.270 | 2401.270 | 2401.270 | 0.000 | 0: 2401.270 | 0: 2401.270 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 73,529 | 13.600 | 13.600 | 13.600 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 63,939 | 15.640 | 13.600 | 25.300 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 66,089 | 15.131 | 8.100 | 104.600 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 30,516 | 32.770 | 6.700 | 3507.800 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 13,913 | 71.877 | 6.200 | 14484.500 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 10,733 | 93.174 | 6.200 | 14484.500 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 10,894 | 91.793 | 5.500 | 14484.500 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 10,873 | 91.967 | 5.500 | 14484.500 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 10,833 | 92.314 | 5.500 | 14484.500 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 10,833 | 92.314 | 5.500 | 14484.500 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 204,082 | 4.900 | 2.000 | 12.900 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 268,673 | 3.722 | 2.000 | 42.400 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 362,634 | 2.758 | 0.800 | 140.600 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 318,340 | 3.141 | 0.800 | 411.100 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 318,340 | 3.141 | 0.800 | 411.100 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 318,340 | 3.141 | 0.800 | 411.100 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 318,340 | 3.141 | 0.800 | 411.100 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 318,340 | 3.141 | 0.800 | 411.100 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 318,340 | 3.141 | 0.800 | 411.100 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 303,030 | 3.300 | 3.300 | 3.300 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 307,692 | 3.250 | 2.200 | 7.100 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 289,101 | 3.459 | 2.200 | 7.700 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 141,834 | 7.051 | 1.000 | 605.300 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 34,385 | 29.083 | 1.000 | 32747.400 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 26,965 | 37.085 | 1.000 | 32747.400 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 27,541 | 36.309 | 1.000 | 32747.400 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 27,605 | 36.225 | 1.000 | 32747.400 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 27,617 | 36.210 | 1.000 | 32747.400 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 27,618 | 36.208 | 1.000 | 32747.400 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 144,928 | 6.900 | 6.900 | 6.900 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 312,500 | 3.200 | 2.100 | 6.900 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 270,416 | 3.698 | 1.800 | 39.000 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 483,980 | 2.066 | 0.700 | 39.000 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 392,197 | 2.550 | 0.700 | 278.600 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 392,197 | 2.550 | 0.700 | 278.600 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 392,197 | 2.550 | 0.700 | 278.600 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 392,197 | 2.550 | 0.700 | 278.600 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 392,197 | 2.550 | 0.700 | 278.600 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 392,197 | 2.550 | 0.700 | 278.600 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 108,159 | 9.246 | 2.900 | 616.900 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 113,265 | 8.829 | 2.300 | 616.900 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 113,179 | 8.836 | 2.300 | 616.900 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 113,208 | 8.833 | 2.300 | 616.900 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 113,208 | 8.833 | 2.300 | 616.900 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 185,185 | 5.400 | 5.400 | 5.400 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 155,521 | 6.430 | 5.400 | 10.400 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 164,880 | 6.065 | 3.500 | 13.100 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 100,456 | 9.955 | 2.500 | 189.300 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 24,726 | 40.443 | 2.500 | 24659.400 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 20,327 | 49.196 | 2.500 | 24659.400 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 20,357 | 49.123 | 2.500 | 24659.400 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 20,403 | 49.012 | 2.500 | 24659.400 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 20,410 | 48.996 | 2.500 | 24659.400 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 20,411 | 48.994 | 2.500 | 24659.400 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 112,921 | 8.856 | 2.800 | 666.100 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 117,735 | 8.494 | 2.700 | 666.100 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 116,107 | 8.613 | 2.700 | 666.100 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 116,091 | 8.614 | 2.700 | 666.100 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 116,091 | 8.614 | 2.700 | 666.100 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 44,444 | 22.500 | 22.500 | 22.500 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 91,659 | 10.910 | 7.600 | 22.500 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 113,973 | 8.774 | 4.200 | 64.900 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 138,104 | 7.241 | 3.200 | 68.500 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 111,046 | 9.005 | 2.800 | 8651.500 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 106,574 | 9.383 | 2.800 | 8651.500 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 108,160 | 9.246 | 2.800 | 8651.500 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 108,102 | 9.250 | 2.800 | 8651.500 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 108,061 | 9.254 | 2.800 | 8651.500 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 101,057 | 9.895 | 2.800 | 12836.300 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 151,515 | 6.600 | 6.600 | 6.600 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 130,378 | 7.670 | 6.600 | 9.100 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 139,997 | 7.143 | 4.300 | 13.800 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 81,879 | 12.213 | 3.300 | 271.000 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 25,292 | 39.539 | 2.600 | 32428.900 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 20,855 | 47.949 | 2.600 | 32428.900 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 21,279 | 46.995 | 2.600 | 32428.900 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 21,332 | 46.879 | 2.600 | 32428.900 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 21,340 | 46.861 | 2.600 | 32428.900 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 21,340 | 46.860 | 2.600 | 32428.900 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 200,000 | 5.000 | 5.000 | 5.000 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 149,925 | 6.670 | 5.000 | 8.000 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 131,216 | 7.621 | 3.800 | 59.000 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 116,075 | 8.615 | 2.900 | 1190.400 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 139,394 | 7.174 | 2.700 | 1979.700 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 106,785 | 9.365 | 2.700 | 12258.000 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 108,608 | 9.207 | 2.700 | 12258.000 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 108,687 | 9.201 | 2.700 | 12258.000 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 108,287 | 9.235 | 2.700 | 12258.000 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 108,286 | 9.235 | 2.700 | 12258.000 |
| value | head | 0 | up | 1 | 8 | A | 1 | 400,000 | 2.500 | 2.500 | 2.500 |
| value | head | 0 | up | 10 | 410 | A | 10 | 719,424 | 1.390 | 1.000 | 2.500 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 1,584,786 | 0.631 | 0.300 | 4.100 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 1,120,574 | 0.892 | 0.300 | 35.900 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 911,552 | 1.097 | 0.300 | 721.800 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 691,394 | 1.446 | 0.300 | 721.800 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 705,546 | 1.417 | 0.300 | 721.800 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 706,108 | 1.416 | 0.300 | 721.800 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 706,105 | 1.416 | 0.300 | 721.800 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 702,536 | 1.423 | 0.300 | 721.800 |
| value | random | 0 | up | 1 | 8 | A | 1 | 1,666,667 | 0.600 | 0.600 | 0.600 |
| value | random | 0 | up | 10 | 410 | A | 10 | 1,470,588 | 0.680 | 0.500 | 1.200 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 865,801 | 1.155 | 0.200 | 4.600 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 166,739 | 5.997 | 0.200 | 386.700 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 32,032 | 31.219 | 0.200 | 9158.100 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 25,034 | 39.946 | 0.200 | 9158.100 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 25,317 | 39.499 | 0.200 | 9158.100 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 25,388 | 39.389 | 0.200 | 9158.100 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 25,399 | 39.372 | 0.200 | 9158.100 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 25,399 | 39.372 | 0.200 | 9158.100 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 1,666,667 | 0.600 | 0.600 | 0.600 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 1,449,275 | 0.690 | 0.500 | 1.700 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 2,551,020 | 0.392 | 0.200 | 5.700 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 2,090,738 | 0.478 | 0.200 | 20.100 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 1,564,602 | 0.639 | 0.200 | 84.500 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 1,099,181 | 0.910 | 0.200 | 125.300 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 1,113,044 | 0.898 | 0.200 | 125.300 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 1,114,357 | 0.897 | 0.200 | 125.300 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 1,114,629 | 0.897 | 0.200 | 125.300 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 1,112,824 | 0.899 | 0.200 | 125.300 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 8,396 | 119.100 |
| create | — | 0 | up | 10 | A | 1 | 14,749 | 67.800 |
| create | — | 0 | up | 100 | A | 1 | 9,381 | 106.600 |
| create | — | 0 | up | 1,000 | A | 1 | 1,050 | 952.600 |
| create | — | 0 | up | 10,000 | A | 1 | 81 | 12312.700 |
| create | — | 0 | down | 1,000 | A | 1 | 1,725 | 579.700 |
| create | — | 0 | down | 100 | A | 1 | 540 | 1851.800 |
| create | — | 0 | down | 10 | A | 1 | 12,048 | 83.000 |
| create | — | 0 | down | 1 | A | 1 | 14,556 | 68.700 |
| create | — | 0 | down | 0 | A | 1 | 21,645 | 46.200 |
| sequence | — | 0 | up | 1 | A | 1 | 2,816 | 355.100 |
| sequence | — | 0 | up | 10 | A | 1 | 10,593 | 94.400 |
| sequence | — | 0 | up | 100 | A | 1 | 3,830 | 261.100 |
| sequence | — | 0 | up | 1,000 | A | 1 | 273 | 3664.400 |
| sequence | — | 0 | up | 10,000 | A | 1 | 14 | 71695.800 |
| sequence | — | 0 | down | 1,000 | A | 1 | 13 | 75609.200 |
| sequence | — | 0 | down | 100 | A | 1 | 3 | 365869.300 |
| sequence | — | 0 | down | 10 | A | 1 | 4 | 275737.100 |
| sequence | — | 0 | down | 1 | A | 1 | 5 | 203685.900 |
| sequence | — | 0 | down | 0 | A | 1 | 35,461 | 28.200 |
| values | — | 0 | up | 1 | A | 1 | 7,616 | 131.300 |
| values | — | 0 | up | 10 | A | 1 | 13,333 | 75.000 |
| values | — | 0 | up | 100 | A | 1 | 3,289 | 304.000 |
| values | — | 0 | up | 1,000 | A | 1 | 196 | 5099.800 |
| values | — | 0 | up | 10,000 | A | 1 | 75 | 13263.000 |
| values | — | 0 | down | 1,000 | A | 1 | 247 | 4050.300 |
| values | — | 0 | down | 100 | A | 1 | 1,114 | 897.300 |
| values | — | 0 | down | 10 | A | 1 | 10,173 | 98.300 |
| values | — | 0 | down | 1 | A | 1 | 25,575 | 39.100 |
| values | — | 0 | down | 0 | A | 1 | 18,315 | 54.600 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 84,062,208 | 9,859,128 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 76,734,464 | 10,006,432 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 80,195,584 | 10,656,728 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 101,408,768 | 15,597,152 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 305,156,096 | 64,600,072 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 396,726,272 | 109,766,088 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 401,563,648 | 114,574,880 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 402,198,528 | 115,012,208 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 401,551,360 | 115,079,224 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 402,493,440 | 114,912,832 |

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
