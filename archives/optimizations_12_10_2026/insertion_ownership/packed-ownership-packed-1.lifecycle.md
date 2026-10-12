# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:23:13.030Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 18,042 | 55.425 | 55.425 | 55.425 | 0.000 | 0: 55.425 | 0: 55.425 |
| apply | random | A | scaleDown | 9,999 | 12,439 | 80.391 | 80.391 | 80.391 | 0.000 | 0: 80.391 | 0: 80.391 |
| apply | random | A | fullLifecycle | 19,999 | 14,726 | 67.908 | 67.908 | 67.908 | 0.000 | 0: 67.908 | 0: 67.908 |
| create | — | A | scaleUp | 6 | 691 | 1446.967 | 1446.967 | 1446.967 | 0.000 | 0: 1446.967 | 0: 1446.967 |
| create | — | A | scaleDown | 5 | 5,595 | 178.740 | 178.740 | 178.740 | 0.000 | 0: 178.740 | 0: 178.740 |
| create | — | A | fullLifecycle | 11 | 1,149 | 870.500 | 870.500 | 870.500 | 0.000 | 0: 870.500 | 0: 870.500 |
| insert | head | A | scaleUp | 5,000 | 401,204 | 2.493 | 2.493 | 2.493 | 0.000 | 0: 2.493 | 0: 2.493 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 401,204 | 2.493 | 2.493 | 2.493 | 0.000 | 0: 2.493 | 0: 2.493 |
| insert | random | A | scaleUp | 10,000 | 48,434 | 20.647 | 20.647 | 20.647 | 0.000 | 0: 20.647 | 0: 20.647 |
| insert | random | A | scaleDown | 10,000 | 37,559 | 26.625 | 26.625 | 26.625 | 0.000 | 0: 26.625 | 0: 26.625 |
| insert | random | A | fullLifecycle | 20,000 | 42,309 | 23.636 | 23.636 | 23.636 | 0.000 | 0: 23.636 | 0: 23.636 |
| insert | tail | A | scaleUp | 5,000 | 491,048 | 2.036 | 2.036 | 2.036 | 0.000 | 0: 2.036 | 0: 2.036 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 491,048 | 2.036 | 2.036 | 2.036 | 0.000 | 0: 2.036 | 0: 2.036 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 167,049 | 5.986 | 5.986 | 5.986 | 0.000 | 0: 5.986 | 0: 5.986 |
| remove | head | A | fullLifecycle | 5,000 | 167,049 | 5.986 | 5.986 | 5.986 | 0.000 | 0: 5.986 | 0: 5.986 |
| remove | random | A | scaleUp | 10,000 | 34,219 | 29.224 | 29.224 | 29.224 | 0.000 | 0: 29.224 | 0: 29.224 |
| remove | random | A | scaleDown | 10,000 | 26,551 | 37.663 | 37.663 | 37.663 | 0.000 | 0: 37.663 | 0: 37.663 |
| remove | random | A | fullLifecycle | 20,000 | 29,901 | 33.443 | 33.443 | 33.443 | 0.000 | 0: 33.443 | 0: 33.443 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 168,823 | 5.923 | 5.923 | 5.923 | 0.000 | 0: 5.923 | 0: 5.923 |
| remove | tail | A | fullLifecycle | 5,000 | 168,823 | 5.923 | 5.923 | 5.923 | 0.000 | 0: 5.923 | 0: 5.923 |
| replace | head | A | scaleUp | 10,000 | 122,794 | 8.144 | 8.144 | 8.144 | 0.000 | 0: 8.144 | 0: 8.144 |
| replace | head | A | scaleDown | 10,000 | 89,427 | 11.182 | 11.182 | 11.182 | 0.000 | 0: 11.182 | 0: 11.182 |
| replace | head | A | fullLifecycle | 20,000 | 103,488 | 9.663 | 9.663 | 9.663 | 0.000 | 0: 9.663 | 0: 9.663 |
| replace | random | A | scaleUp | 10,000 | 33,589 | 29.772 | 29.772 | 29.772 | 0.000 | 0: 29.772 | 0: 29.772 |
| replace | random | A | scaleDown | 10,000 | 27,778 | 36.000 | 36.000 | 36.000 | 0.000 | 0: 36.000 | 0: 36.000 |
| replace | random | A | fullLifecycle | 20,000 | 30,408 | 32.886 | 32.886 | 32.886 | 0.000 | 0: 32.886 | 0: 32.886 |
| replace | tail | A | scaleUp | 10,000 | 171,283 | 5.838 | 5.838 | 5.838 | 0.000 | 0: 5.838 | 0: 5.838 |
| replace | tail | A | scaleDown | 10,000 | 145,256 | 6.884 | 6.884 | 6.884 | 0.000 | 0: 6.884 | 0: 6.884 |
| replace | tail | A | fullLifecycle | 20,000 | 157,200 | 6.361 | 6.361 | 6.361 | 0.000 | 0: 6.361 | 0: 6.361 |
| sequence | — | A | scaleUp | 5 | 83 | 11977.860 | 11977.860 | 11977.860 | 0.000 | 0: 11977.860 | 0: 11977.860 |
| sequence | — | A | scaleDown | 5 | 11 | 93252.740 | 93252.740 | 93252.740 | 0.000 | 0: 93252.740 | 0: 93252.740 |
| sequence | — | A | fullLifecycle | 10 | 19 | 52615.300 | 52615.300 | 52615.300 | 0.000 | 0: 52615.300 | 0: 52615.300 |
| value | head | A | scaleUp | 10,000 | 1,030,078 | 0.971 | 0.971 | 0.971 | 0.000 | 0: 0.971 | 0: 0.971 |
| value | head | A | scaleDown | 10,000 | 781,842 | 1.279 | 1.279 | 1.279 | 0.000 | 0: 1.279 | 0: 1.279 |
| value | head | A | fullLifecycle | 20,000 | 888,956 | 1.125 | 1.125 | 1.125 | 0.000 | 0: 1.125 | 0: 1.125 |
| value | random | A | scaleUp | 10,000 | 41,889 | 23.873 | 23.873 | 23.873 | 0.000 | 0: 23.873 | 0: 23.873 |
| value | random | A | scaleDown | 10,000 | 29,834 | 33.519 | 33.519 | 33.519 | 0.000 | 0: 33.519 | 0: 33.519 |
| value | random | A | fullLifecycle | 20,000 | 34,848 | 28.696 | 28.696 | 28.696 | 0.000 | 0: 28.696 | 0: 28.696 |
| value | tail | A | scaleUp | 10,000 | 1,798,335 | 0.556 | 0.556 | 0.556 | 0.000 | 0: 0.556 | 0: 0.556 |
| value | tail | A | scaleDown | 10,000 | 1,163,657 | 0.859 | 0.859 | 0.859 | 0.000 | 0: 0.859 | 0: 0.859 |
| value | tail | A | fullLifecycle | 20,000 | 1,412,998 | 0.708 | 0.708 | 0.708 | 0.000 | 0: 0.708 | 0: 0.708 |
| values | — | A | scaleUp | 5 | 271 | 3694.560 | 3694.560 | 3694.560 | 0.000 | 0: 3694.560 | 0: 3694.560 |
| values | — | A | scaleDown | 5 | 1,016 | 984.160 | 984.160 | 984.160 | 0.000 | 0: 984.160 | 0: 984.160 |
| values | — | A | fullLifecycle | 10 | 427 | 2339.360 | 2339.360 | 2339.360 | 0.000 | 0: 2339.360 | 0: 2339.360 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 72,993 | 13.700 | 13.700 | 13.700 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 63,532 | 15.740 | 12.900 | 22.500 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 62,387 | 16.029 | 8.200 | 154.300 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 46,820 | 21.359 | 5.700 | 1121.100 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 18,042 | 55.425 | 5.700 | 4042.300 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 14,597 | 68.508 | 5.700 | 23000.200 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 14,758 | 67.758 | 5.600 | 23000.200 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 14,769 | 67.711 | 5.600 | 23000.200 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 14,726 | 67.908 | 5.600 | 23000.200 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 14,726 | 67.908 | 5.600 | 23000.200 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 156,250 | 6.400 | 2.400 | 19.100 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 270,563 | 3.696 | 2.200 | 19.100 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 353,632 | 2.828 | 0.800 | 108.600 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 401,204 | 2.493 | 0.800 | 112.500 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 401,204 | 2.493 | 0.800 | 112.500 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 401,204 | 2.493 | 0.800 | 112.500 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 401,204 | 2.493 | 0.800 | 112.500 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 401,204 | 2.493 | 0.800 | 112.500 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 401,204 | 2.493 | 0.800 | 112.500 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 370,370 | 2.700 | 2.700 | 2.700 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 264,550 | 3.780 | 2.600 | 10.000 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 72,611 | 13.772 | 2.300 | 957.400 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 127,249 | 7.859 | 1.300 | 957.400 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 48,434 | 20.647 | 0.900 | 7068.900 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 41,732 | 23.962 | 0.900 | 7068.900 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 42,211 | 23.690 | 0.900 | 7068.900 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 42,290 | 23.646 | 0.900 | 7068.900 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 42,307 | 23.637 | 0.900 | 7068.900 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 42,309 | 23.636 | 0.900 | 7068.900 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 142,857 | 7.000 | 7.000 | 7.000 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 277,778 | 3.600 | 2.300 | 7.000 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 334,225 | 2.992 | 2.100 | 11.900 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 405,121 | 2.468 | 0.700 | 58.800 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 491,048 | 2.036 | 0.700 | 144.200 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 491,048 | 2.036 | 0.700 | 144.200 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 491,048 | 2.036 | 0.700 | 144.200 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 491,048 | 2.036 | 0.700 | 144.200 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 491,048 | 2.036 | 0.700 | 144.200 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 491,048 | 2.036 | 0.700 | 144.200 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 165,201 | 6.053 | 2.800 | 97.900 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 167,726 | 5.962 | 2.700 | 97.900 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 167,004 | 5.988 | 2.700 | 131.200 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 167,049 | 5.986 | 2.700 | 131.200 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 167,049 | 5.986 | 2.700 | 131.200 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 204,082 | 4.900 | 4.900 | 4.900 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 149,031 | 6.710 | 4.900 | 11.200 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 138,715 | 7.209 | 4.000 | 53.400 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 90,264 | 11.079 | 2.600 | 1108.300 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 34,219 | 29.224 | 2.200 | 1368.900 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 29,458 | 33.947 | 2.200 | 10770.800 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 29,829 | 33.524 | 2.200 | 10770.800 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 29,889 | 33.457 | 2.200 | 10770.800 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 29,900 | 33.445 | 2.200 | 10770.800 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 29,901 | 33.443 | 2.200 | 10770.800 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 165,552 | 6.040 | 2.800 | 212.100 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 169,023 | 5.916 | 2.800 | 212.100 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 168,779 | 5.925 | 2.800 | 212.100 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 168,813 | 5.924 | 2.800 | 212.100 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 168,823 | 5.923 | 2.800 | 212.100 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 50,000 | 20.000 | 20.000 | 20.000 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 89,928 | 11.120 | 7.600 | 24.600 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 118,878 | 8.412 | 4.800 | 64.200 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 110,307 | 9.066 | 3.100 | 1713.100 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 122,794 | 8.144 | 2.800 | 11531.700 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 120,120 | 8.325 | 2.800 | 13879.300 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 121,413 | 8.236 | 2.800 | 13879.300 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 106,622 | 9.379 | 2.800 | 22805.900 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 106,584 | 9.382 | 2.800 | 22805.900 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 103,488 | 9.663 | 2.800 | 22805.900 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 153,846 | 6.500 | 6.500 | 6.500 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 119,474 | 8.370 | 6.500 | 15.800 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 126,791 | 7.887 | 4.700 | 15.800 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 93,626 | 10.681 | 3.400 | 95.300 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 33,589 | 29.772 | 3.200 | 3122.300 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 30,041 | 33.288 | 2.800 | 6683.900 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 30,335 | 32.965 | 2.800 | 6683.900 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 30,396 | 32.899 | 2.800 | 6683.900 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 30,407 | 32.887 | 2.800 | 6683.900 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 30,408 | 32.886 | 2.800 | 6683.900 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 192,308 | 5.200 | 5.200 | 5.200 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 128,370 | 7.790 | 5.200 | 11.800 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 130,429 | 7.667 | 4.300 | 90.800 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 132,196 | 7.564 | 3.100 | 611.400 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 171,283 | 5.838 | 2.600 | 611.400 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 156,786 | 6.378 | 2.600 | 4892.500 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 157,348 | 6.355 | 2.600 | 4892.500 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 157,190 | 6.362 | 2.600 | 4892.500 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 157,199 | 6.361 | 2.600 | 4892.500 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 157,200 | 6.361 | 2.600 | 4892.500 |
| value | head | 0 | up | 1 | 8 | A | 1 | 322,581 | 3.100 | 3.100 | 3.100 |
| value | head | 0 | up | 10 | 410 | A | 10 | 657,895 | 1.520 | 1.000 | 3.100 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 1,362,398 | 0.734 | 0.400 | 3.500 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 1,105,705 | 0.904 | 0.300 | 50.300 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 1,030,078 | 0.971 | 0.300 | 239.600 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 886,835 | 1.128 | 0.300 | 239.600 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 894,462 | 1.118 | 0.300 | 239.600 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 894,335 | 1.118 | 0.300 | 239.600 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 894,230 | 1.118 | 0.300 | 239.600 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 888,956 | 1.125 | 0.300 | 239.600 |
| value | random | 0 | up | 1 | 8 | A | 1 | 1,428,571 | 0.700 | 0.700 | 0.700 |
| value | random | 0 | up | 10 | 410 | A | 10 | 1,219,512 | 0.820 | 0.600 | 1.500 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 771,605 | 1.296 | 0.200 | 6.900 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 229,221 | 4.363 | 0.200 | 126.600 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 41,889 | 23.873 | 0.200 | 478.700 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 34,252 | 29.195 | 0.200 | 46232.500 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 34,745 | 28.781 | 0.200 | 46232.500 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 34,834 | 28.708 | 0.200 | 46232.500 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 34,849 | 28.695 | 0.200 | 46232.500 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 34,848 | 28.696 | 0.200 | 46232.500 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 2,000,000 | 0.500 | 0.500 | 0.500 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 1,351,351 | 0.740 | 0.500 | 1.700 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 2,985,075 | 0.335 | 0.200 | 1.700 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 2,296,739 | 0.435 | 0.200 | 7.400 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 1,798,335 | 0.556 | 0.200 | 45.600 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 1,407,585 | 0.710 | 0.200 | 185.800 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 1,414,789 | 0.707 | 0.200 | 185.800 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 1,415,362 | 0.707 | 0.200 | 185.800 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 1,415,668 | 0.706 | 0.200 | 185.800 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 1,412,998 | 0.708 | 0.200 | 185.800 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 9,756 | 102.500 |
| create | — | 0 | up | 10 | A | 1 | 19,305 | 51.800 |
| create | — | 0 | up | 100 | A | 1 | 8,446 | 118.400 |
| create | — | 0 | up | 1,000 | A | 1 | 1,831 | 546.100 |
| create | — | 0 | up | 10,000 | A | 1 | 145 | 6885.600 |
| create | — | 0 | down | 1,000 | A | 1 | 1,721 | 581.000 |
| create | — | 0 | down | 100 | A | 1 | 7,905 | 126.500 |
| create | — | 0 | down | 10 | A | 1 | 13,947 | 71.700 |
| create | — | 0 | down | 1 | A | 1 | 19,920 | 50.200 |
| create | — | 0 | down | 0 | A | 1 | 15,552 | 64.300 |
| sequence | — | 0 | up | 1 | A | 1 | 3,002 | 333.100 |
| sequence | — | 0 | up | 10 | A | 1 | 10,373 | 96.400 |
| sequence | — | 0 | up | 100 | A | 1 | 3,100 | 322.600 |
| sequence | — | 0 | up | 1,000 | A | 1 | 310 | 3229.900 |
| sequence | — | 0 | up | 10,000 | A | 1 | 18 | 55907.300 |
| sequence | — | 0 | down | 1,000 | A | 1 | 14 | 71675.300 |
| sequence | — | 0 | down | 100 | A | 1 | 10 | 98103.000 |
| sequence | — | 0 | down | 10 | A | 1 | 5 | 194431.800 |
| sequence | — | 0 | down | 1 | A | 1 | 10 | 101940.500 |
| sequence | — | 0 | down | 0 | A | 1 | 8,842 | 113.100 |
| values | — | 0 | up | 1 | A | 1 | 7,880 | 126.900 |
| values | — | 0 | up | 10 | A | 1 | 17,361 | 57.600 |
| values | — | 0 | up | 100 | A | 1 | 3,265 | 306.300 |
| values | — | 0 | up | 1,000 | A | 1 | 295 | 3392.100 |
| values | — | 0 | up | 10,000 | A | 1 | 69 | 14589.900 |
| values | — | 0 | down | 1,000 | A | 1 | 264 | 3790.900 |
| values | — | 0 | down | 100 | A | 1 | 1,146 | 872.600 |
| values | — | 0 | down | 10 | A | 1 | 9,259 | 108.000 |
| values | — | 0 | down | 1 | A | 1 | 23,364 | 42.800 |
| values | — | 0 | down | 0 | A | 1 | 9,390 | 106.500 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 82,874,368 | 9,863,832 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 75,653,120 | 10,014,440 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 77,049,856 | 10,656,720 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 98,275,328 | 15,620,144 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 304,156,672 | 64,600,000 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 396,947,456 | 109,766,016 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 401,498,112 | 114,577,376 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 401,825,792 | 115,012,136 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 402,915,328 | 115,081,624 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 401,862,656 | 114,912,760 |

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
