# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:00:55.126Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 39,457 | 25.344 | 25.344 | 25.344 | 0.000 | 0: 25.344 | 0: 25.344 |
| apply | random | A | scaleDown | 9,999 | 14,902 | 67.105 | 67.105 | 67.105 | 0.000 | 0: 67.105 | 0: 67.105 |
| apply | random | A | fullLifecycle | 19,999 | 21,634 | 46.224 | 46.224 | 46.224 | 0.000 | 0: 46.224 | 0: 46.224 |
| create | — | A | scaleUp | 6 | 1,766 | 566.367 | 566.367 | 566.367 | 0.000 | 0: 566.367 | 0: 566.367 |
| create | — | A | scaleDown | 5 | 4,235 | 236.140 | 236.140 | 236.140 | 0.000 | 0: 236.140 | 0: 236.140 |
| create | — | A | fullLifecycle | 11 | 2,402 | 416.264 | 416.264 | 416.264 | 0.000 | 0: 416.264 | 0: 416.264 |
| insert | head | A | scaleUp | 5,000 | 953,816 | 1.048 | 1.048 | 1.048 | 0.000 | 0: 1.048 | 0: 1.048 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 953,816 | 1.048 | 1.048 | 1.048 | 0.000 | 0: 1.048 | 0: 1.048 |
| insert | random | A | scaleUp | 10,000 | 102,499 | 9.756 | 9.756 | 9.756 | 0.000 | 0: 9.756 | 0: 9.756 |
| insert | random | A | scaleDown | 10,000 | 38,402 | 26.040 | 26.040 | 26.040 | 0.000 | 0: 26.040 | 0: 26.040 |
| insert | random | A | fullLifecycle | 20,000 | 55,871 | 17.898 | 17.898 | 17.898 | 0.000 | 0: 17.898 | 0: 17.898 |
| insert | tail | A | scaleUp | 5,000 | 1,160,416 | 0.862 | 0.862 | 0.862 | 0.000 | 0: 0.862 | 0: 0.862 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 1,160,416 | 0.862 | 0.862 | 0.862 | 0.000 | 0: 0.862 | 0: 0.862 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 207,399 | 4.822 | 4.822 | 4.822 | 0.000 | 0: 4.822 | 0: 4.822 |
| remove | head | A | fullLifecycle | 5,000 | 207,399 | 4.822 | 4.822 | 4.822 | 0.000 | 0: 4.822 | 0: 4.822 |
| remove | random | A | scaleUp | 10,000 | 69,509 | 14.387 | 14.387 | 14.387 | 0.000 | 0: 14.387 | 0: 14.387 |
| remove | random | A | scaleDown | 10,000 | 30,145 | 33.173 | 33.173 | 33.173 | 0.000 | 0: 33.173 | 0: 33.173 |
| remove | random | A | fullLifecycle | 20,000 | 42,052 | 23.780 | 23.780 | 23.780 | 0.000 | 0: 23.780 | 0: 23.780 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 204,934 | 4.880 | 4.880 | 4.880 | 0.000 | 0: 4.880 | 0: 4.880 |
| remove | tail | A | fullLifecycle | 5,000 | 204,934 | 4.880 | 4.880 | 4.880 | 0.000 | 0: 4.880 | 0: 4.880 |
| replace | head | A | scaleUp | 10,000 | 358,844 | 2.787 | 2.787 | 2.787 | 0.000 | 0: 2.787 | 0: 2.787 |
| replace | head | A | scaleDown | 10,000 | 139,049 | 7.192 | 7.192 | 7.192 | 0.000 | 0: 7.192 | 0: 7.192 |
| replace | head | A | fullLifecycle | 20,000 | 200,432 | 4.989 | 4.989 | 4.989 | 0.000 | 0: 4.989 | 0: 4.989 |
| replace | random | A | scaleUp | 10,000 | 72,246 | 13.842 | 13.842 | 13.842 | 0.000 | 0: 13.842 | 0: 13.842 |
| replace | random | A | scaleDown | 10,000 | 28,465 | 35.130 | 35.130 | 35.130 | 0.000 | 0: 35.130 | 0: 35.130 |
| replace | random | A | fullLifecycle | 20,000 | 40,840 | 24.486 | 24.486 | 24.486 | 0.000 | 0: 24.486 | 0: 24.486 |
| replace | tail | A | scaleUp | 10,000 | 397,864 | 2.513 | 2.513 | 2.513 | 0.000 | 0: 2.513 | 0: 2.513 |
| replace | tail | A | scaleDown | 10,000 | 169,863 | 5.887 | 5.887 | 5.887 | 0.000 | 0: 5.887 | 0: 5.887 |
| replace | tail | A | fullLifecycle | 20,000 | 238,081 | 4.200 | 4.200 | 4.200 | 0.000 | 0: 4.200 | 0: 4.200 |
| sequence | — | A | scaleUp | 5 | 168 | 5942.360 | 5942.360 | 5942.360 | 0.000 | 0: 5942.360 | 0: 5942.360 |
| sequence | — | A | scaleDown | 5 | 10 | 100446.460 | 100446.460 | 100446.460 | 0.000 | 0: 100446.460 | 0: 100446.460 |
| sequence | — | A | fullLifecycle | 10 | 19 | 53194.410 | 53194.410 | 53194.410 | 0.000 | 0: 53194.410 | 0: 53194.410 |
| value | head | A | scaleUp | 10,000 | 3,080,051 | 0.325 | 0.325 | 0.325 | 0.000 | 0: 0.325 | 0: 0.325 |
| value | head | A | scaleDown | 10,000 | 1,036,559 | 0.965 | 0.965 | 0.965 | 0.000 | 0: 0.965 | 0: 0.965 |
| value | head | A | fullLifecycle | 20,000 | 1,551,109 | 0.645 | 0.645 | 0.645 | 0.000 | 0: 0.645 | 0: 0.645 |
| value | random | A | scaleUp | 10,000 | 87,824 | 11.386 | 11.386 | 11.386 | 0.000 | 0: 11.386 | 0: 11.386 |
| value | random | A | scaleDown | 10,000 | 35,758 | 27.966 | 27.966 | 27.966 | 0.000 | 0: 27.966 | 0: 27.966 |
| value | random | A | fullLifecycle | 20,000 | 50,823 | 19.676 | 19.676 | 19.676 | 0.000 | 0: 19.676 | 0: 19.676 |
| value | tail | A | scaleUp | 10,000 | 3,501,768 | 0.286 | 0.286 | 0.286 | 0.000 | 0: 0.286 | 0: 0.286 |
| value | tail | A | scaleDown | 10,000 | 1,331,753 | 0.751 | 0.751 | 0.751 | 0.000 | 0: 0.751 | 0: 0.751 |
| value | tail | A | fullLifecycle | 20,000 | 1,929,645 | 0.518 | 0.518 | 0.518 | 0.000 | 0: 0.518 | 0: 0.518 |
| values | — | A | scaleUp | 5 | 481 | 2078.320 | 2078.320 | 2078.320 | 0.000 | 0: 2078.320 | 0: 2078.320 |
| values | — | A | scaleDown | 5 | 823 | 1214.980 | 1214.980 | 1214.980 | 0.000 | 0: 1214.980 | 0: 1214.980 |
| values | — | A | fullLifecycle | 10 | 607 | 1646.650 | 1646.650 | 1646.650 | 0.000 | 0: 1646.650 | 0: 1646.650 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 133,333 | 7.500 | 7.500 | 7.500 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 111,607 | 8.960 | 7.100 | 12.800 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 134,282 | 7.447 | 3.800 | 60.500 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 130,169 | 7.682 | 3.000 | 316.400 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 39,457 | 25.344 | 3.000 | 718.000 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 21,929 | 45.602 | 3.000 | 881.300 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 21,741 | 45.997 | 3.000 | 1947.400 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 21,779 | 45.916 | 3.000 | 1947.400 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 21,634 | 46.224 | 3.000 | 6492.400 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 21,634 | 46.224 | 3.000 | 6492.400 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 232,558 | 4.300 | 1.300 | 11.400 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 606,796 | 1.648 | 1.000 | 11.400 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 1,118,068 | 0.894 | 0.400 | 41.800 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 953,816 | 1.048 | 0.400 | 41.800 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 953,816 | 1.048 | 0.400 | 41.800 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 953,816 | 1.048 | 0.400 | 41.800 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 953,816 | 1.048 | 0.400 | 41.800 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 953,816 | 1.048 | 0.400 | 41.800 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 953,816 | 1.048 | 0.400 | 41.800 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 625,000 | 1.600 | 1.600 | 1.600 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 450,450 | 2.220 | 1.300 | 5.300 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 585,480 | 1.708 | 1.000 | 5.300 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 416,008 | 2.404 | 0.500 | 310.000 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 102,499 | 9.756 | 0.500 | 2296.400 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 56,175 | 17.801 | 0.500 | 2296.400 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 55,765 | 17.932 | 0.500 | 2296.400 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 55,846 | 17.906 | 0.500 | 2296.400 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 55,869 | 17.899 | 0.500 | 2296.400 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 55,871 | 17.898 | 0.500 | 2296.400 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 227,273 | 4.400 | 4.400 | 4.400 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 495,050 | 2.020 | 1.200 | 4.400 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 657,030 | 1.522 | 1.000 | 7.800 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 1,201,634 | 0.832 | 0.300 | 24.700 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 1,160,416 | 0.862 | 0.300 | 52.200 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 1,160,416 | 0.862 | 0.300 | 52.200 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 1,160,416 | 0.862 | 0.300 | 52.200 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 1,160,416 | 0.862 | 0.300 | 52.200 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 1,160,416 | 0.862 | 0.300 | 52.200 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 1,160,416 | 0.862 | 0.300 | 52.200 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 207,710 | 4.814 | 1.600 | 96.700 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 207,418 | 4.821 | 1.600 | 96.700 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 207,324 | 4.823 | 1.600 | 96.700 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 207,399 | 4.822 | 1.600 | 96.700 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 207,399 | 4.822 | 1.600 | 96.700 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 312,500 | 3.200 | 3.200 | 3.200 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 207,900 | 4.810 | 2.900 | 10.900 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 306,279 | 3.265 | 1.700 | 27.800 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 288,792 | 3.463 | 1.100 | 77.600 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 69,509 | 14.387 | 1.100 | 6479.700 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 42,282 | 23.651 | 1.100 | 6479.700 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 41,965 | 23.829 | 1.100 | 6479.700 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 42,036 | 23.789 | 1.100 | 6479.700 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 42,051 | 23.781 | 1.100 | 6479.700 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 42,052 | 23.780 | 1.100 | 6479.700 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 204,368 | 4.893 | 1.700 | 174.500 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 205,074 | 4.876 | 1.700 | 174.500 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 204,879 | 4.881 | 1.700 | 174.500 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 204,934 | 4.880 | 1.700 | 174.500 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 204,934 | 4.880 | 1.700 | 174.500 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 56,818 | 17.600 | 17.600 | 17.600 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 116,279 | 8.600 | 3.900 | 17.600 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 256,410 | 3.900 | 2.100 | 19.800 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 381,738 | 2.620 | 1.400 | 42.400 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 358,844 | 2.787 | 1.400 | 1001.200 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 238,785 | 4.188 | 1.400 | 1001.200 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 232,921 | 4.293 | 1.400 | 1001.200 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 231,975 | 4.311 | 1.400 | 1001.200 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 230,344 | 4.341 | 1.400 | 1001.200 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 200,432 | 4.989 | 1.400 | 12962.100 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 166,667 | 6.000 | 6.000 | 6.000 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 179,856 | 5.560 | 3.400 | 13.800 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 292,912 | 3.414 | 2.200 | 13.800 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 253,222 | 3.949 | 1.500 | 51.300 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 72,246 | 13.842 | 1.500 | 573.200 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 41,098 | 24.332 | 1.500 | 13067.600 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 40,751 | 24.539 | 1.500 | 13067.600 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 40,824 | 24.496 | 1.500 | 13067.600 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 40,838 | 24.487 | 1.500 | 13067.600 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 40,840 | 24.486 | 1.500 | 13067.600 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 322,581 | 3.100 | 3.100 | 3.100 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 230,415 | 4.340 | 3.100 | 6.800 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 305,623 | 3.272 | 1.800 | 29.100 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 373,706 | 2.676 | 1.400 | 244.200 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 397,864 | 2.513 | 1.400 | 244.200 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 243,774 | 4.102 | 1.400 | 4241.800 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 238,552 | 4.192 | 1.400 | 4241.800 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 238,172 | 4.199 | 1.400 | 4241.800 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 238,175 | 4.199 | 1.400 | 4241.800 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 238,081 | 4.200 | 1.400 | 4241.800 |
| value | head | 0 | up | 1 | 8 | A | 1 | 555,556 | 1.800 | 1.800 | 1.800 |
| value | head | 0 | up | 10 | 410 | A | 10 | 1,176,471 | 0.850 | 0.400 | 1.800 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 3,021,148 | 0.331 | 0.200 | 1.800 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 3,359,086 | 0.298 | 0.100 | 21.800 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 3,080,051 | 0.325 | 0.100 | 21.800 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 1,580,673 | 0.633 | 0.100 | 27.100 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 1,565,672 | 0.639 | 0.100 | 27.100 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 1,564,861 | 0.639 | 0.100 | 27.100 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 1,564,487 | 0.639 | 0.100 | 27.100 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 1,551,109 | 0.645 | 0.100 | 110.900 |
| value | random | 0 | up | 1 | 8 | A | 1 | 1,250,000 | 0.800 | 0.800 | 0.800 |
| value | random | 0 | up | 10 | 410 | A | 10 | 2,272,727 | 0.440 | 0.300 | 0.800 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 1,811,594 | 0.552 | 0.100 | 1.200 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 550,509 | 1.817 | 0.100 | 204.400 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 87,824 | 11.386 | 0.100 | 570.700 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 51,078 | 19.578 | 0.100 | 570.700 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 50,686 | 19.729 | 0.100 | 570.700 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 50,801 | 19.685 | 0.100 | 570.700 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 50,824 | 19.676 | 0.100 | 570.700 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 50,823 | 19.676 | 0.100 | 570.700 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 5,000,000 | 0.200 | 0.200 | 0.200 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 1,785,714 | 0.560 | 0.200 | 2.800 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 5,235,602 | 0.191 | 0.100 | 2.800 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 5,995,204 | 0.167 | 0.100 | 3.200 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 3,501,768 | 0.286 | 0.100 | 319.300 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 1,957,592 | 0.511 | 0.100 | 319.300 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 1,931,814 | 0.518 | 0.100 | 319.300 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 1,932,484 | 0.517 | 0.100 | 319.300 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 1,932,999 | 0.517 | 0.100 | 319.300 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 1,929,645 | 0.518 | 0.100 | 319.300 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 16,129 | 62.000 |
| create | — | 0 | up | 10 | A | 1 | 34,014 | 29.400 |
| create | — | 0 | up | 100 | A | 1 | 12,484 | 80.100 |
| create | — | 0 | up | 1,000 | A | 1 | 3,389 | 295.100 |
| create | — | 0 | up | 10,000 | A | 1 | 365 | 2736.400 |
| create | — | 0 | down | 1,000 | A | 1 | 1,226 | 815.400 |
| create | — | 0 | down | 100 | A | 1 | 5,219 | 191.600 |
| create | — | 0 | down | 10 | A | 1 | 12,136 | 82.400 |
| create | — | 0 | down | 1 | A | 1 | 19,608 | 51.000 |
| create | — | 0 | down | 0 | A | 1 | 24,814 | 40.300 |
| sequence | — | 0 | up | 1 | A | 1 | 5,824 | 171.700 |
| sequence | — | 0 | up | 10 | A | 1 | 24,272 | 41.200 |
| sequence | — | 0 | up | 100 | A | 1 | 5,068 | 197.300 |
| sequence | — | 0 | up | 1,000 | A | 1 | 570 | 1753.900 |
| sequence | — | 0 | up | 10,000 | A | 1 | 36 | 27547.700 |
| sequence | — | 0 | down | 1,000 | A | 1 | 12 | 83085.300 |
| sequence | — | 0 | down | 100 | A | 1 | 10 | 99795.300 |
| sequence | — | 0 | down | 10 | A | 1 | 5 | 189933.100 |
| sequence | — | 0 | down | 1 | A | 1 | 8 | 129398.600 |
| sequence | — | 0 | down | 0 | A | 1 | 50,000 | 20.000 |
| values | — | 0 | up | 1 | A | 1 | 11,601 | 86.200 |
| values | — | 0 | up | 10 | A | 1 | 23,256 | 43.000 |
| values | — | 0 | up | 100 | A | 1 | 3,510 | 284.900 |
| values | — | 0 | up | 1,000 | A | 1 | 556 | 1797.600 |
| values | — | 0 | up | 10,000 | A | 1 | 122 | 8179.900 |
| values | — | 0 | down | 1,000 | A | 1 | 195 | 5115.800 |
| values | — | 0 | down | 100 | A | 1 | 1,226 | 815.800 |
| values | — | 0 | down | 10 | A | 1 | 13,889 | 72.000 |
| values | — | 0 | down | 1 | A | 1 | 29,412 | 34.000 |
| values | — | 0 | down | 0 | A | 1 | 26,810 | 37.300 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 83,972,096 | 9,859,712 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 75,927,552 | 10,014,536 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 78,413,824 | 10,656,352 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 100,577,280 | 15,597,464 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 305,340,416 | 64,600,440 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 400,056,320 | 109,766,456 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 403,337,216 | 114,577,816 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 404,770,816 | 115,012,576 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 405,049,344 | 115,079,592 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 403,746,816 | 115,032,520 |

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
