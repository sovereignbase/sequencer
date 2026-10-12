# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:16:14.399Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 8,080 | 123.759 | 123.759 | 123.759 | 0.000 | 0: 123.759 | 0: 123.759 |
| apply | random | A | scaleDown | 9,999 | 6,903 | 144.866 | 144.866 | 144.866 | 0.000 | 0: 144.866 | 0: 144.866 |
| apply | random | A | fullLifecycle | 19,999 | 7,445 | 134.312 | 134.312 | 134.312 | 0.000 | 0: 134.312 | 0: 134.312 |
| create | — | A | scaleUp | 6 | 306 | 3264.117 | 3264.117 | 3264.117 | 0.000 | 0: 3264.117 | 0: 3264.117 |
| create | — | A | scaleDown | 5 | 4,012 | 249.260 | 249.260 | 249.260 | 0.000 | 0: 249.260 | 0: 249.260 |
| create | — | A | fullLifecycle | 11 | 528 | 1893.727 | 1893.727 | 1893.727 | 0.000 | 0: 1893.727 | 0: 1893.727 |
| insert | head | A | scaleUp | 5,000 | 214,515 | 4.662 | 4.662 | 4.662 | 0.000 | 0: 4.662 | 0: 4.662 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 214,515 | 4.662 | 4.662 | 4.662 | 0.000 | 0: 4.662 | 0: 4.662 |
| insert | random | A | scaleUp | 10,000 | 23,398 | 42.738 | 42.738 | 42.738 | 0.000 | 0: 42.738 | 0: 42.738 |
| insert | random | A | scaleDown | 10,000 | 19,035 | 52.535 | 52.535 | 52.535 | 0.000 | 0: 52.535 | 0: 52.535 |
| insert | random | A | fullLifecycle | 20,000 | 20,992 | 47.636 | 47.636 | 47.636 | 0.000 | 0: 47.636 | 0: 47.636 |
| insert | tail | A | scaleUp | 5,000 | 188,167 | 5.314 | 5.314 | 5.314 | 0.000 | 0: 5.314 | 0: 5.314 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 188,167 | 5.314 | 5.314 | 5.314 | 0.000 | 0: 5.314 | 0: 5.314 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 84,564 | 11.825 | 11.825 | 11.825 | 0.000 | 0: 11.825 | 0: 11.825 |
| remove | head | A | fullLifecycle | 5,000 | 84,564 | 11.825 | 11.825 | 11.825 | 0.000 | 0: 11.825 | 0: 11.825 |
| remove | random | A | scaleUp | 10,000 | 17,069 | 58.585 | 58.585 | 58.585 | 0.000 | 0: 58.585 | 0: 58.585 |
| remove | random | A | scaleDown | 10,000 | 13,291 | 75.242 | 75.242 | 75.242 | 0.000 | 0: 75.242 | 0: 75.242 |
| remove | random | A | fullLifecycle | 20,000 | 14,945 | 66.914 | 66.914 | 66.914 | 0.000 | 0: 66.914 | 0: 66.914 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 89,563 | 11.165 | 11.165 | 11.165 | 0.000 | 0: 11.165 | 0: 11.165 |
| remove | tail | A | fullLifecycle | 5,000 | 89,563 | 11.165 | 11.165 | 11.165 | 0.000 | 0: 11.165 | 0: 11.165 |
| replace | head | A | scaleUp | 10,000 | 72,641 | 13.766 | 13.766 | 13.766 | 0.000 | 0: 13.766 | 0: 13.766 |
| replace | head | A | scaleDown | 10,000 | 57,051 | 17.528 | 17.528 | 17.528 | 0.000 | 0: 17.528 | 0: 17.528 |
| replace | head | A | fullLifecycle | 20,000 | 63,909 | 15.647 | 15.647 | 15.647 | 0.000 | 0: 15.647 | 0: 15.647 |
| replace | random | A | scaleUp | 10,000 | 17,306 | 57.783 | 57.783 | 57.783 | 0.000 | 0: 57.783 | 0: 57.783 |
| replace | random | A | scaleDown | 10,000 | 13,859 | 72.156 | 72.156 | 72.156 | 0.000 | 0: 72.156 | 0: 72.156 |
| replace | random | A | fullLifecycle | 20,000 | 15,392 | 64.970 | 64.970 | 64.970 | 0.000 | 0: 64.970 | 0: 64.970 |
| replace | tail | A | scaleUp | 10,000 | 76,706 | 13.037 | 13.037 | 13.037 | 0.000 | 0: 13.037 | 0: 13.037 |
| replace | tail | A | scaleDown | 10,000 | 82,747 | 12.085 | 12.085 | 12.085 | 0.000 | 0: 12.085 | 0: 12.085 |
| replace | tail | A | fullLifecycle | 20,000 | 79,612 | 12.561 | 12.561 | 12.561 | 0.000 | 0: 12.561 | 0: 12.561 |
| sequence | — | A | scaleUp | 5 | 29 | 34317.760 | 34317.760 | 34317.760 | 0.000 | 0: 34317.760 | 0: 34317.760 |
| sequence | — | A | scaleDown | 5 | 7 | 150449.920 | 150449.920 | 150449.920 | 0.000 | 0: 150449.920 | 0: 150449.920 |
| sequence | — | A | fullLifecycle | 10 | 11 | 92383.840 | 92383.840 | 92383.840 | 0.000 | 0: 92383.840 | 0: 92383.840 |
| value | head | A | scaleUp | 10,000 | 394,949 | 2.532 | 2.532 | 2.532 | 0.000 | 0: 2.532 | 0: 2.532 |
| value | head | A | scaleDown | 10,000 | 395,507 | 2.528 | 2.528 | 2.528 | 0.000 | 0: 2.528 | 0: 2.528 |
| value | head | A | fullLifecycle | 20,000 | 395,228 | 2.530 | 2.530 | 2.530 | 0.000 | 0: 2.530 | 0: 2.530 |
| value | random | A | scaleUp | 10,000 | 21,889 | 45.685 | 45.685 | 45.685 | 0.000 | 0: 45.685 | 0: 45.685 |
| value | random | A | scaleDown | 10,000 | 16,035 | 62.362 | 62.362 | 62.362 | 0.000 | 0: 62.362 | 0: 62.362 |
| value | random | A | fullLifecycle | 20,000 | 18,510 | 54.023 | 54.023 | 54.023 | 0.000 | 0: 54.023 | 0: 54.023 |
| value | tail | A | scaleUp | 10,000 | 796,102 | 1.256 | 1.256 | 1.256 | 0.000 | 0: 1.256 | 0: 1.256 |
| value | tail | A | scaleDown | 10,000 | 622,746 | 1.606 | 1.606 | 1.606 | 0.000 | 0: 1.606 | 0: 1.606 |
| value | tail | A | fullLifecycle | 20,000 | 698,834 | 1.431 | 1.431 | 1.431 | 0.000 | 0: 1.431 | 0: 1.431 |
| values | — | A | scaleUp | 5 | 163 | 6133.460 | 6133.460 | 6133.460 | 0.000 | 0: 6133.460 | 0: 6133.460 |
| values | — | A | scaleDown | 5 | 160 | 6241.360 | 6241.360 | 6241.360 | 0.000 | 0: 6241.360 | 0: 6241.360 |
| values | — | A | fullLifecycle | 10 | 162 | 6187.410 | 6187.410 | 6187.410 | 0.000 | 0: 6187.410 | 0: 6187.410 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 41,841 | 23.900 | 23.900 | 23.900 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 36,887 | 27.110 | 23.900 | 31.800 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 35,332 | 28.303 | 9.000 | 326.900 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 25,265 | 39.580 | 7.700 | 4772.900 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 8,080 | 123.759 | 7.200 | 56058.700 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 7,486 | 133.589 | 7.200 | 56058.700 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 7,454 | 134.154 | 7.200 | 56058.700 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 7,474 | 133.804 | 7.200 | 56058.700 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 7,445 | 134.312 | 7.200 | 56058.700 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 7,445 | 134.312 | 7.200 | 56058.700 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 134,409 | 7.440 | 4.200 | 17.100 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 189,179 | 5.286 | 2.200 | 17.100 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 245,134 | 4.079 | 1.500 | 97.500 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 214,515 | 4.662 | 1.200 | 396.200 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 214,515 | 4.662 | 1.200 | 396.200 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 214,515 | 4.662 | 1.200 | 396.200 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 214,515 | 4.662 | 1.200 | 396.200 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 214,515 | 4.662 | 1.200 | 396.200 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 214,515 | 4.662 | 1.200 | 396.200 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 222,222 | 4.500 | 4.500 | 4.500 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 189,753 | 5.270 | 3.900 | 10.500 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 150,195 | 6.658 | 2.800 | 25.500 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 79,177 | 12.630 | 2.100 | 2124.800 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 23,398 | 42.738 | 1.600 | 27842.300 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 20,979 | 47.667 | 1.600 | 27842.300 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 20,940 | 47.756 | 1.600 | 27842.300 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 20,982 | 47.659 | 1.600 | 27842.300 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 20,991 | 47.639 | 1.600 | 27842.300 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 20,992 | 47.636 | 1.600 | 27842.300 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 93,458 | 10.700 | 10.700 | 10.700 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 180,505 | 5.540 | 4.000 | 10.700 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 26,544 | 37.674 | 1.900 | 1651.000 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 128,571 | 7.778 | 1.300 | 1651.000 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 188,167 | 5.314 | 0.900 | 4057.900 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 188,167 | 5.314 | 0.900 | 4057.900 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 188,167 | 5.314 | 0.900 | 4057.900 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 188,167 | 5.314 | 0.900 | 4057.900 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 188,167 | 5.314 | 0.900 | 4057.900 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 188,167 | 5.314 | 0.900 | 4057.900 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 86,327 | 11.584 | 3.600 | 1127.400 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 84,391 | 11.850 | 3.600 | 1127.400 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 84,514 | 11.832 | 3.600 | 1127.400 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 84,564 | 11.825 | 3.600 | 1127.400 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 84,564 | 11.825 | 3.600 | 1127.400 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 112,360 | 8.900 | 8.900 | 8.900 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 86,059 | 11.620 | 8.900 | 18.600 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 88,277 | 11.328 | 3.800 | 74.300 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 65,860 | 15.184 | 3.800 | 561.900 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 17,069 | 58.585 | 3.800 | 14293.800 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 14,796 | 67.587 | 3.700 | 35865.200 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 14,908 | 67.076 | 3.700 | 35865.200 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 14,938 | 66.943 | 3.700 | 35865.200 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 14,944 | 66.916 | 3.700 | 35865.200 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 14,945 | 66.914 | 3.700 | 35865.200 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 89,363 | 11.190 | 3.200 | 875.300 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 89,685 | 11.150 | 3.200 | 875.300 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 89,517 | 11.171 | 3.200 | 875.300 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 89,560 | 11.166 | 3.200 | 875.300 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 89,563 | 11.165 | 3.200 | 875.300 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 29,499 | 33.900 | 33.900 | 33.900 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 57,770 | 17.310 | 13.500 | 33.900 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 72,711 | 13.753 | 4.800 | 80.600 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 75,849 | 13.184 | 4.800 | 876.700 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 72,641 | 13.766 | 3.800 | 4292.600 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 67,024 | 14.920 | 3.800 | 12983.400 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 66,665 | 15.000 | 3.800 | 12983.400 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 66,693 | 14.994 | 3.800 | 12983.400 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 66,681 | 14.997 | 3.800 | 12983.400 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 63,909 | 15.647 | 3.800 | 13021.700 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 85,470 | 11.700 | 11.700 | 11.700 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 73,099 | 13.680 | 11.700 | 16.300 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 76,775 | 13.025 | 4.800 | 57.500 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 52,665 | 18.988 | 4.800 | 1721.200 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 17,306 | 57.783 | 3.600 | 13167.700 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 15,404 | 64.919 | 3.600 | 16317.200 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 15,347 | 65.160 | 3.600 | 16317.200 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 15,385 | 64.998 | 3.600 | 16317.200 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 15,391 | 64.972 | 3.600 | 16317.200 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 15,392 | 64.970 | 3.600 | 16317.200 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 99,010 | 10.100 | 10.100 | 10.100 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 68,213 | 14.660 | 10.100 | 31.300 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 56,275 | 17.770 | 4.400 | 504.900 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 67,632 | 14.786 | 4.400 | 3585.600 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 76,706 | 13.037 | 3.300 | 6419.700 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 79,480 | 12.582 | 3.300 | 6419.700 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 79,575 | 12.567 | 3.300 | 6419.700 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 79,606 | 12.562 | 3.300 | 6419.700 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 79,623 | 12.559 | 3.300 | 6419.700 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 79,612 | 12.561 | 3.300 | 6419.700 |
| value | head | 0 | up | 1 | 8 | A | 1 | 263,158 | 3.800 | 3.800 | 3.800 |
| value | head | 0 | up | 10 | 410 | A | 10 | 465,116 | 2.150 | 1.500 | 3.800 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 881,057 | 1.135 | 0.300 | 5.600 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 139,798 | 7.153 | 0.300 | 5609.500 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 394,949 | 2.532 | 0.300 | 5609.500 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 431,374 | 2.318 | 0.300 | 5609.500 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 395,878 | 2.526 | 0.300 | 5609.500 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 396,045 | 2.525 | 0.300 | 5609.500 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 396,097 | 2.525 | 0.300 | 5609.500 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 395,228 | 2.530 | 0.300 | 5609.500 |
| value | random | 0 | up | 1 | 8 | A | 1 | 909,091 | 1.100 | 1.100 | 1.100 |
| value | random | 0 | up | 10 | 410 | A | 10 | 769,231 | 1.300 | 1.000 | 2.200 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 532,481 | 1.878 | 0.400 | 8.000 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 153,678 | 6.507 | 0.300 | 363.400 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 21,889 | 45.685 | 0.300 | 12565.000 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 18,491 | 54.081 | 0.300 | 20211.700 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 18,482 | 54.108 | 0.300 | 20211.700 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 18,501 | 54.050 | 0.300 | 20211.700 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 18,510 | 54.026 | 0.300 | 20211.700 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 18,510 | 54.023 | 0.300 | 20211.700 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 1,111,111 | 0.900 | 0.900 | 0.900 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 970,874 | 1.030 | 0.800 | 1.900 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 1,805,054 | 0.554 | 0.200 | 2.800 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 1,568,381 | 0.638 | 0.200 | 24.700 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 796,102 | 1.256 | 0.200 | 3679.400 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 780,570 | 1.281 | 0.200 | 3679.400 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 778,889 | 1.284 | 0.200 | 3679.400 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 698,602 | 1.431 | 0.200 | 3679.400 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 698,819 | 1.431 | 0.200 | 3679.400 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 698,834 | 1.431 | 0.200 | 3679.400 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 6,658 | 150.200 |
| create | — | 0 | up | 10 | A | 1 | 14,104 | 70.900 |
| create | — | 0 | up | 100 | A | 1 | 5,807 | 172.200 |
| create | — | 0 | up | 1,000 | A | 1 | 1,128 | 886.400 |
| create | — | 0 | up | 10,000 | A | 1 | 56 | 17713.500 |
| create | — | 0 | down | 1,000 | A | 1 | 1,111 | 899.900 |
| create | — | 0 | down | 100 | A | 1 | 5,230 | 191.200 |
| create | — | 0 | down | 10 | A | 1 | 17,794 | 56.200 |
| create | — | 0 | down | 1 | A | 1 | 19,920 | 50.200 |
| create | — | 0 | down | 0 | A | 1 | 20,492 | 48.800 |
| sequence | — | 0 | up | 1 | A | 1 | 2,573 | 388.700 |
| sequence | — | 0 | up | 10 | A | 1 | 6,382 | 156.700 |
| sequence | — | 0 | up | 100 | A | 1 | 2,229 | 448.700 |
| sequence | — | 0 | up | 1,000 | A | 1 | 74 | 13432.400 |
| sequence | — | 0 | up | 10,000 | A | 1 | 6 | 157162.300 |
| sequence | — | 0 | down | 1,000 | A | 1 | 5 | 221584.100 |
| sequence | — | 0 | down | 100 | A | 1 | 8 | 133115.300 |
| sequence | — | 0 | down | 10 | A | 1 | 6 | 159642.400 |
| sequence | — | 0 | down | 1 | A | 1 | 4 | 237883.700 |
| sequence | — | 0 | down | 0 | A | 1 | 41,494 | 24.100 |
| values | — | 0 | up | 1 | A | 1 | 6,566 | 152.300 |
| values | — | 0 | up | 10 | A | 1 | 7,905 | 126.500 |
| values | — | 0 | up | 100 | A | 1 | 800 | 1249.800 |
| values | — | 0 | up | 1,000 | A | 1 | 141 | 7116.100 |
| values | — | 0 | up | 10,000 | A | 1 | 45 | 22022.600 |
| values | — | 0 | down | 1,000 | A | 1 | 34 | 29807.800 |
| values | — | 0 | down | 100 | A | 1 | 834 | 1199.200 |
| values | — | 0 | down | 10 | A | 1 | 8,666 | 115.400 |
| values | — | 0 | down | 1 | A | 1 | 20,877 | 47.900 |
| values | — | 0 | down | 0 | A | 1 | 27,397 | 36.500 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 88,113,152 | 9,851,800 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 80,084,992 | 10,006,672 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 82,591,744 | 10,656,928 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 104,300,544 | 15,597,392 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 308,215,808 | 64,600,312 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 405,516,288 | 109,770,168 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 410,886,144 | 114,576,200 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 411,455,488 | 115,011,264 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 411,582,464 | 115,078,584 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 411,594,752 | 115,044,872 |

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
