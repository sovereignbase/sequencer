# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:17:58.982Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 5,498 | 181.893 | 181.893 | 181.893 | 0.000 | 0: 181.893 | 0: 181.893 |
| apply | random | A | scaleDown | 9,999 | 4,534 | 220.544 | 220.544 | 220.544 | 0.000 | 0: 220.544 | 0: 220.544 |
| apply | random | A | fullLifecycle | 19,999 | 4,970 | 201.218 | 201.218 | 201.218 | 0.000 | 0: 201.218 | 0: 201.218 |
| create | — | A | scaleUp | 6 | 530 | 1887.150 | 1887.150 | 1887.150 | 0.000 | 0: 1887.150 | 0: 1887.150 |
| create | — | A | scaleDown | 5 | 3,973 | 251.720 | 251.720 | 251.720 | 0.000 | 0: 251.720 | 0: 251.720 |
| create | — | A | fullLifecycle | 11 | 874 | 1143.773 | 1143.773 | 1143.773 | 0.000 | 0: 1143.773 | 0: 1143.773 |
| insert | head | A | scaleUp | 5,000 | 92,466 | 10.815 | 10.815 | 10.815 | 0.000 | 0: 10.815 | 0: 10.815 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 92,466 | 10.815 | 10.815 | 10.815 | 0.000 | 0: 10.815 | 0: 10.815 |
| insert | random | A | scaleUp | 10,000 | 13,326 | 75.041 | 75.041 | 75.041 | 0.000 | 0: 75.041 | 0: 75.041 |
| insert | random | A | scaleDown | 10,000 | 12,923 | 77.381 | 77.381 | 77.381 | 0.000 | 0: 77.381 | 0: 77.381 |
| insert | random | A | fullLifecycle | 20,000 | 13,122 | 76.211 | 76.211 | 76.211 | 0.000 | 0: 76.211 | 0: 76.211 |
| insert | tail | A | scaleUp | 5,000 | 198,310 | 5.043 | 5.043 | 5.043 | 0.000 | 0: 5.043 | 0: 5.043 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 198,310 | 5.043 | 5.043 | 5.043 | 0.000 | 0: 5.043 | 0: 5.043 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 58,529 | 17.086 | 17.086 | 17.086 | 0.000 | 0: 17.086 | 0: 17.086 |
| remove | head | A | fullLifecycle | 5,000 | 58,529 | 17.086 | 17.086 | 17.086 | 0.000 | 0: 17.086 | 0: 17.086 |
| remove | random | A | scaleUp | 10,000 | 9,990 | 100.101 | 100.101 | 100.101 | 0.000 | 0: 100.101 | 0: 100.101 |
| remove | random | A | scaleDown | 10,000 | 9,395 | 106.439 | 106.439 | 106.439 | 0.000 | 0: 106.439 | 0: 106.439 |
| remove | random | A | fullLifecycle | 20,000 | 9,683 | 103.270 | 103.270 | 103.270 | 0.000 | 0: 103.270 | 0: 103.270 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 56,932 | 17.565 | 17.565 | 17.565 | 0.000 | 0: 17.565 | 0: 17.565 |
| remove | tail | A | fullLifecycle | 5,000 | 56,932 | 17.565 | 17.565 | 17.565 | 0.000 | 0: 17.565 | 0: 17.565 |
| replace | head | A | scaleUp | 10,000 | 46,096 | 21.694 | 21.694 | 21.694 | 0.000 | 0: 21.694 | 0: 21.694 |
| replace | head | A | scaleDown | 10,000 | 48,427 | 20.650 | 20.650 | 20.650 | 0.000 | 0: 20.650 | 0: 20.650 |
| replace | head | A | fullLifecycle | 20,000 | 47,232 | 21.172 | 21.172 | 21.172 | 0.000 | 0: 21.172 | 0: 21.172 |
| replace | random | A | scaleUp | 10,000 | 10,543 | 94.848 | 94.848 | 94.848 | 0.000 | 0: 94.848 | 0: 94.848 |
| replace | random | A | scaleDown | 10,000 | 10,791 | 92.671 | 92.671 | 92.671 | 0.000 | 0: 92.671 | 0: 92.671 |
| replace | random | A | fullLifecycle | 20,000 | 10,666 | 93.759 | 93.759 | 93.759 | 0.000 | 0: 93.759 | 0: 93.759 |
| replace | tail | A | scaleUp | 10,000 | 49,974 | 20.011 | 20.011 | 20.011 | 0.000 | 0: 20.011 | 0: 20.011 |
| replace | tail | A | scaleDown | 10,000 | 59,541 | 16.795 | 16.795 | 16.795 | 0.000 | 0: 16.795 | 0: 16.795 |
| replace | tail | A | fullLifecycle | 20,000 | 54,340 | 18.403 | 18.403 | 18.403 | 0.000 | 0: 18.403 | 0: 18.403 |
| sequence | — | A | scaleUp | 5 | 30 | 33818.740 | 33818.740 | 33818.740 | 0.000 | 0: 33818.740 | 0: 33818.740 |
| sequence | — | A | scaleDown | 5 | 7 | 147274.920 | 147274.920 | 147274.920 | 0.000 | 0: 147274.920 | 0: 147274.920 |
| sequence | — | A | fullLifecycle | 10 | 11 | 90546.830 | 90546.830 | 90546.830 | 0.000 | 0: 90546.830 | 0: 90546.830 |
| value | head | A | scaleUp | 10,000 | 414,499 | 2.413 | 2.413 | 2.413 | 0.000 | 0: 2.413 | 0: 2.413 |
| value | head | A | scaleDown | 10,000 | 233,054 | 4.291 | 4.291 | 4.291 | 0.000 | 0: 4.291 | 0: 4.291 |
| value | head | A | fullLifecycle | 20,000 | 298,356 | 3.352 | 3.352 | 3.352 | 0.000 | 0: 3.352 | 0: 3.352 |
| value | random | A | scaleUp | 10,000 | 13,674 | 73.130 | 73.130 | 73.130 | 0.000 | 0: 73.130 | 0: 73.130 |
| value | random | A | scaleDown | 10,000 | 11,924 | 83.862 | 83.862 | 83.862 | 0.000 | 0: 83.862 | 0: 83.862 |
| value | random | A | fullLifecycle | 20,000 | 12,740 | 78.496 | 78.496 | 78.496 | 0.000 | 0: 78.496 | 0: 78.496 |
| value | tail | A | scaleUp | 10,000 | 706,939 | 1.415 | 1.415 | 1.415 | 0.000 | 0: 1.415 | 0: 1.415 |
| value | tail | A | scaleDown | 10,000 | 343,802 | 2.909 | 2.909 | 2.909 | 0.000 | 0: 2.909 | 0: 2.909 |
| value | tail | A | fullLifecycle | 20,000 | 462,620 | 2.162 | 2.162 | 2.162 | 0.000 | 0: 2.162 | 0: 2.162 |
| values | — | A | scaleUp | 5 | 135 | 7419.920 | 7419.920 | 7419.920 | 0.000 | 0: 7419.920 | 0: 7419.920 |
| values | — | A | scaleDown | 5 | 535 | 1868.040 | 1868.040 | 1868.040 | 0.000 | 0: 1868.040 | 0: 1868.040 |
| values | — | A | fullLifecycle | 10 | 215 | 4643.980 | 4643.980 | 4643.980 | 0.000 | 0: 4643.980 | 0: 4643.980 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 42,373 | 23.600 | 23.600 | 23.600 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 30,572 | 32.710 | 22.600 | 89.400 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 32,933 | 30.365 | 12.400 | 219.100 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 16,885 | 59.223 | 11.300 | 9595.500 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 5,498 | 181.893 | 10.200 | 29861.400 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 4,867 | 205.472 | 7.600 | 33223.400 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 4,960 | 201.626 | 7.600 | 33223.400 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 4,974 | 201.043 | 7.600 | 33223.400 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 4,970 | 201.218 | 7.600 | 33223.400 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 4,970 | 201.218 | 7.600 | 33223.400 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 36,846 | 27.140 | 3.800 | 104.800 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 120,192 | 8.320 | 3.600 | 104.800 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 92,022 | 10.867 | 1.500 | 3584.000 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 92,466 | 10.815 | 1.500 | 9929.500 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 92,466 | 10.815 | 1.500 | 9929.500 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 92,466 | 10.815 | 1.500 | 9929.500 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 92,466 | 10.815 | 1.500 | 9929.500 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 92,466 | 10.815 | 1.500 | 9929.500 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 92,466 | 10.815 | 1.500 | 9929.500 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 175,439 | 5.700 | 5.700 | 5.700 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 132,275 | 7.560 | 3.900 | 14.200 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 111,919 | 8.935 | 3.900 | 69.100 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 44,147 | 22.652 | 1.900 | 10634.200 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 13,326 | 75.041 | 1.900 | 83614.900 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 12,842 | 77.870 | 1.900 | 83614.900 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 13,078 | 76.463 | 1.900 | 83614.900 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 13,115 | 76.247 | 1.900 | 83614.900 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 13,121 | 76.214 | 1.500 | 83614.900 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 13,122 | 76.211 | 1.500 | 83614.900 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 98,039 | 10.200 | 10.200 | 10.200 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 170,068 | 5.880 | 3.400 | 10.200 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 31,680 | 31.566 | 3.300 | 1282.300 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 166,378 | 6.010 | 1.200 | 1282.300 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 198,310 | 5.043 | 1.200 | 1282.300 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 198,310 | 5.043 | 1.200 | 1282.300 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 198,310 | 5.043 | 1.200 | 1282.300 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 198,310 | 5.043 | 1.200 | 1282.300 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 198,310 | 5.043 | 1.200 | 1282.300 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 198,310 | 5.043 | 1.200 | 1282.300 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 58,533 | 17.084 | 4.000 | 1998.400 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 58,229 | 17.174 | 3.600 | 1998.400 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 58,488 | 17.098 | 3.600 | 1998.400 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 58,529 | 17.086 | 3.600 | 1998.400 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 58,529 | 17.086 | 3.600 | 1998.400 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 112,360 | 8.900 | 8.900 | 8.900 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 63,980 | 15.630 | 8.900 | 41.400 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 74,660 | 13.394 | 7.100 | 41.400 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 55,050 | 18.165 | 4.000 | 1228.400 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 9,990 | 100.101 | 4.000 | 57145.100 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 9,482 | 105.463 | 4.000 | 57145.100 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 9,650 | 103.628 | 4.000 | 57145.100 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 9,679 | 103.318 | 4.000 | 57145.100 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 9,683 | 103.275 | 3.600 | 57145.100 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 9,683 | 103.270 | 3.600 | 57145.100 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 54,625 | 18.307 | 3.900 | 5002.700 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 56,615 | 17.663 | 3.400 | 5002.700 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 56,893 | 17.577 | 3.400 | 5002.700 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 56,925 | 17.567 | 3.400 | 5002.700 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 56,932 | 17.565 | 3.400 | 5002.700 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 30,675 | 32.600 | 32.600 | 32.600 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 51,546 | 19.400 | 10.700 | 32.600 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 30,389 | 32.907 | 7.300 | 1372.600 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 17,612 | 56.779 | 5.200 | 41822.600 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 46,096 | 21.694 | 4.700 | 41822.600 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 47,508 | 21.049 | 3.800 | 41822.600 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 48,214 | 20.741 | 3.500 | 41822.600 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 48,286 | 20.710 | 3.500 | 41822.600 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 48,278 | 20.713 | 3.500 | 41822.600 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 47,232 | 21.172 | 3.500 | 41822.600 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 83,333 | 12.000 | 12.000 | 12.000 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 77,160 | 12.960 | 11.600 | 14.900 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 40,011 | 24.993 | 8.000 | 621.000 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 36,287 | 27.558 | 5.500 | 7888.200 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 10,543 | 94.848 | 5.100 | 26785.700 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 10,455 | 95.647 | 5.100 | 26785.700 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 10,633 | 94.048 | 4.500 | 26785.700 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 10,661 | 93.803 | 4.500 | 26785.700 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 10,665 | 93.764 | 4.500 | 26785.700 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 10,666 | 93.759 | 4.500 | 26785.700 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 117,647 | 8.500 | 8.500 | 8.500 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 84,602 | 11.820 | 8.500 | 18.300 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 65,155 | 15.348 | 7.100 | 122.100 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 72,133 | 13.863 | 5.000 | 1223.000 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 49,974 | 20.011 | 4.400 | 16461.800 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 53,747 | 18.606 | 3.900 | 16461.800 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 54,282 | 18.422 | 3.500 | 16461.800 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 54,323 | 18.409 | 3.500 | 16461.800 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 54,338 | 18.403 | 3.500 | 16461.800 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 54,340 | 18.403 | 3.500 | 16461.800 |
| value | head | 0 | up | 1 | 8 | A | 1 | 238,095 | 4.200 | 4.200 | 4.200 |
| value | head | 0 | up | 10 | 410 | A | 10 | 335,570 | 2.980 | 1.500 | 6.400 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 327,869 | 3.050 | 0.600 | 94.300 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 502,689 | 1.989 | 0.500 | 188.400 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 414,499 | 2.413 | 0.500 | 1880.300 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 291,929 | 3.425 | 0.400 | 11892.700 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 298,728 | 3.348 | 0.400 | 11892.700 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 299,438 | 3.340 | 0.400 | 11892.700 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 299,042 | 3.344 | 0.400 | 11892.700 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 298,356 | 3.352 | 0.400 | 11892.700 |
| value | random | 0 | up | 1 | 8 | A | 1 | 1,000,000 | 1.000 | 1.000 | 1.000 |
| value | random | 0 | up | 10 | 410 | A | 10 | 775,194 | 1.290 | 1.000 | 2.000 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 181,324 | 5.515 | 0.400 | 280.100 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 37,553 | 26.629 | 0.400 | 17019.200 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 13,674 | 73.130 | 0.400 | 29061.000 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 12,517 | 79.890 | 0.400 | 29061.000 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 12,706 | 78.704 | 0.400 | 29061.000 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 12,734 | 78.532 | 0.300 | 29061.000 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 12,739 | 78.497 | 0.300 | 29061.000 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 12,740 | 78.496 | 0.300 | 29061.000 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 1,111,111 | 0.900 | 0.900 | 0.900 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 724,638 | 1.380 | 0.900 | 4.500 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 1,375,516 | 0.727 | 0.300 | 5.800 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 1,482,360 | 0.675 | 0.300 | 39.000 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 706,939 | 1.415 | 0.300 | 1681.400 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 449,609 | 2.224 | 0.300 | 10548.900 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 461,449 | 2.167 | 0.200 | 10548.900 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 462,734 | 2.161 | 0.200 | 10548.900 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 462,906 | 2.160 | 0.200 | 10548.900 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 462,620 | 2.162 | 0.200 | 10548.900 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 8,019 | 124.700 |
| create | — | 0 | up | 10 | A | 1 | 5,385 | 185.700 |
| create | — | 0 | up | 100 | A | 1 | 5,537 | 180.600 |
| create | — | 0 | up | 1,000 | A | 1 | 956 | 1045.900 |
| create | — | 0 | up | 10,000 | A | 1 | 110 | 9107.200 |
| create | — | 0 | down | 1,000 | A | 1 | 1,122 | 891.400 |
| create | — | 0 | down | 100 | A | 1 | 6,116 | 163.500 |
| create | — | 0 | down | 10 | A | 1 | 10,593 | 94.400 |
| create | — | 0 | down | 1 | A | 1 | 16,393 | 61.000 |
| create | — | 0 | down | 0 | A | 1 | 20,704 | 48.300 |
| sequence | — | 0 | up | 1 | A | 1 | 2,336 | 428.100 |
| sequence | — | 0 | up | 10 | A | 1 | 7,519 | 133.000 |
| sequence | — | 0 | up | 100 | A | 1 | 1,803 | 554.700 |
| sequence | — | 0 | up | 1,000 | A | 1 | 40 | 25169.900 |
| sequence | — | 0 | up | 10,000 | A | 1 | 7 | 142808.000 |
| sequence | — | 0 | down | 1,000 | A | 1 | 6 | 174543.200 |
| sequence | — | 0 | down | 100 | A | 1 | 6 | 168128.300 |
| sequence | — | 0 | down | 10 | A | 1 | 5 | 201625.400 |
| sequence | — | 0 | down | 1 | A | 1 | 5 | 192052.000 |
| sequence | — | 0 | down | 0 | A | 1 | 38,911 | 25.700 |
| values | — | 0 | up | 1 | A | 1 | 7,669 | 130.400 |
| values | — | 0 | up | 10 | A | 1 | 10,471 | 95.500 |
| values | — | 0 | up | 100 | A | 1 | 1,071 | 933.400 |
| values | — | 0 | up | 1,000 | A | 1 | 160 | 6244.400 |
| values | — | 0 | up | 10,000 | A | 1 | 34 | 29695.900 |
| values | — | 0 | down | 1,000 | A | 1 | 121 | 8239.300 |
| values | — | 0 | down | 100 | A | 1 | 1,084 | 922.900 |
| values | — | 0 | down | 10 | A | 1 | 9,911 | 100.900 |
| values | — | 0 | down | 1 | A | 1 | 24,510 | 40.800 |
| values | — | 0 | down | 0 | A | 1 | 27,548 | 36.300 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 77,066,240 | 9,853,832 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 76,779,520 | 10,008,960 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 77,643,776 | 10,657,312 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 99,299,328 | 15,620,216 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 304,517,120 | 64,600,480 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 397,176,832 | 109,771,064 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 401,080,320 | 114,581,064 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 401,948,672 | 115,016,128 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 401,846,272 | 115,085,920 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 402,395,136 | 114,916,960 |

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
