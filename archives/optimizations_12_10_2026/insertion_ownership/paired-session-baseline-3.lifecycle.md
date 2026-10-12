# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T17:01:06.888Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 41,916 | 23.857 | 23.857 | 23.857 | 0.000 | 0: 23.857 | 0: 23.857 |
| apply | random | A | scaleDown | 9,999 | 24,196 | 41.330 | 41.330 | 41.330 | 0.000 | 0: 41.330 | 0: 41.330 |
| apply | random | A | fullLifecycle | 19,999 | 30,681 | 32.593 | 32.593 | 32.593 | 0.000 | 0: 32.593 | 0: 32.593 |
| create | — | A | scaleUp | 6 | 1,473 | 678.750 | 678.750 | 678.750 | 0.000 | 0: 678.750 | 0: 678.750 |
| create | — | A | scaleDown | 5 | 8,175 | 122.320 | 122.320 | 122.320 | 0.000 | 0: 122.320 | 0: 122.320 |
| create | — | A | fullLifecycle | 11 | 2,348 | 425.827 | 425.827 | 425.827 | 0.000 | 0: 425.827 | 0: 425.827 |
| insert | head | A | scaleUp | 5,000 | 1,010,632 | 0.989 | 0.989 | 0.989 | 0.000 | 0: 0.989 | 0: 0.989 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 1,010,632 | 0.989 | 0.989 | 0.989 | 0.000 | 0: 0.989 | 0: 0.989 |
| insert | random | A | scaleUp | 10,000 | 113,449 | 8.815 | 8.815 | 8.815 | 0.000 | 0: 8.815 | 0: 8.815 |
| insert | random | A | scaleDown | 10,000 | 58,622 | 17.058 | 17.058 | 17.058 | 0.000 | 0: 17.058 | 0: 17.058 |
| insert | random | A | fullLifecycle | 20,000 | 77,301 | 12.936 | 12.936 | 12.936 | 0.000 | 0: 12.936 | 0: 12.936 |
| insert | tail | A | scaleUp | 5,000 | 1,211,827 | 0.825 | 0.825 | 0.825 | 0.000 | 0: 0.825 | 0: 0.825 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 1,211,827 | 0.825 | 0.825 | 0.825 | 0.000 | 0: 0.825 | 0: 0.825 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 380,150 | 2.631 | 2.631 | 2.631 | 0.000 | 0: 2.631 | 0: 2.631 |
| remove | head | A | fullLifecycle | 5,000 | 380,150 | 2.631 | 2.631 | 2.631 | 0.000 | 0: 2.631 | 0: 2.631 |
| remove | random | A | scaleUp | 10,000 | 76,304 | 13.106 | 13.106 | 13.106 | 0.000 | 0: 13.106 | 0: 13.106 |
| remove | random | A | scaleDown | 10,000 | 48,346 | 20.684 | 20.684 | 20.684 | 0.000 | 0: 20.684 | 0: 20.684 |
| remove | random | A | fullLifecycle | 20,000 | 59,190 | 16.895 | 16.895 | 16.895 | 0.000 | 0: 16.895 | 0: 16.895 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 250,051 | 3.999 | 3.999 | 3.999 | 0.000 | 0: 3.999 | 0: 3.999 |
| remove | tail | A | fullLifecycle | 5,000 | 250,051 | 3.999 | 3.999 | 3.999 | 0.000 | 0: 3.999 | 0: 3.999 |
| replace | head | A | scaleUp | 10,000 | 353,749 | 2.827 | 2.827 | 2.827 | 0.000 | 0: 2.827 | 0: 2.827 |
| replace | head | A | scaleDown | 10,000 | 251,907 | 3.970 | 3.970 | 3.970 | 0.000 | 0: 3.970 | 0: 3.970 |
| replace | head | A | fullLifecycle | 20,000 | 294,266 | 3.398 | 3.398 | 3.398 | 0.000 | 0: 3.398 | 0: 3.398 |
| replace | random | A | scaleUp | 10,000 | 78,391 | 12.757 | 12.757 | 12.757 | 0.000 | 0: 12.757 | 0: 12.757 |
| replace | random | A | scaleDown | 10,000 | 46,994 | 21.279 | 21.279 | 21.279 | 0.000 | 0: 21.279 | 0: 21.279 |
| replace | random | A | fullLifecycle | 20,000 | 58,762 | 17.018 | 17.018 | 17.018 | 0.000 | 0: 17.018 | 0: 17.018 |
| replace | tail | A | scaleUp | 10,000 | 419,708 | 2.383 | 2.383 | 2.383 | 0.000 | 0: 2.383 | 0: 2.383 |
| replace | tail | A | scaleDown | 10,000 | 294,138 | 3.400 | 3.400 | 3.400 | 0.000 | 0: 3.400 | 0: 3.400 |
| replace | tail | A | fullLifecycle | 20,000 | 345,878 | 2.891 | 2.891 | 2.891 | 0.000 | 0: 2.891 | 0: 2.891 |
| sequence | — | A | scaleUp | 5 | 155 | 6464.200 | 6464.200 | 6464.200 | 0.000 | 0: 6464.200 | 0: 6464.200 |
| sequence | — | A | scaleDown | 5 | 21 | 47914.840 | 47914.840 | 47914.840 | 0.000 | 0: 47914.840 | 0: 47914.840 |
| sequence | — | A | fullLifecycle | 10 | 37 | 27189.520 | 27189.520 | 27189.520 | 0.000 | 0: 27189.520 | 0: 27189.520 |
| value | head | A | scaleUp | 10,000 | 2,992,131 | 0.334 | 0.334 | 0.334 | 0.000 | 0: 0.334 | 0: 0.334 |
| value | head | A | scaleDown | 10,000 | 1,756,883 | 0.569 | 0.569 | 0.569 | 0.000 | 0: 0.569 | 0: 0.569 |
| value | head | A | fullLifecycle | 20,000 | 2,213,859 | 0.452 | 0.452 | 0.452 | 0.000 | 0: 0.452 | 0: 0.452 |
| value | random | A | scaleUp | 10,000 | 99,142 | 10.087 | 10.087 | 10.087 | 0.000 | 0: 10.087 | 0: 10.087 |
| value | random | A | scaleDown | 10,000 | 56,739 | 17.625 | 17.625 | 17.625 | 0.000 | 0: 17.625 | 0: 17.625 |
| value | random | A | fullLifecycle | 20,000 | 72,173 | 13.856 | 13.856 | 13.856 | 0.000 | 0: 13.856 | 0: 13.856 |
| value | tail | A | scaleUp | 10,000 | 4,278,258 | 0.234 | 0.234 | 0.234 | 0.000 | 0: 0.234 | 0: 0.234 |
| value | tail | A | scaleDown | 10,000 | 2,167,552 | 0.461 | 0.461 | 0.461 | 0.000 | 0: 0.461 | 0: 0.461 |
| value | tail | A | fullLifecycle | 20,000 | 2,877,325 | 0.348 | 0.348 | 0.348 | 0.000 | 0: 0.348 | 0: 0.348 |
| values | — | A | scaleUp | 5 | 497 | 2012.340 | 2012.340 | 2012.340 | 0.000 | 0: 2012.340 | 0: 2012.340 |
| values | — | A | scaleDown | 5 | 1,722 | 580.760 | 580.760 | 580.760 | 0.000 | 0: 580.760 | 0: 580.760 |
| values | — | A | fullLifecycle | 10 | 771 | 1296.550 | 1296.550 | 1296.550 | 0.000 | 0: 1296.550 | 0: 1296.550 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 90,909 | 11.000 | 11.000 | 11.000 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 139,665 | 7.160 | 6.300 | 11.000 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 134,989 | 7.408 | 3.800 | 67.000 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 118,467 | 8.441 | 3.000 | 869.500 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 41,916 | 23.857 | 3.000 | 4594.800 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 30,592 | 32.688 | 3.000 | 4594.800 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 30,740 | 32.531 | 3.000 | 4594.800 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 30,822 | 32.444 | 3.000 | 4594.800 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 30,681 | 32.593 | 3.000 | 4594.800 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 30,681 | 32.593 | 3.000 | 4594.800 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 301,205 | 3.320 | 1.100 | 10.500 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 568,182 | 1.760 | 1.000 | 14.500 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 1,180,916 | 0.847 | 0.400 | 14.700 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 1,010,632 | 0.989 | 0.400 | 16.200 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 1,010,632 | 0.989 | 0.400 | 16.200 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 1,010,632 | 0.989 | 0.400 | 16.200 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 1,010,632 | 0.989 | 0.400 | 16.200 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 1,010,632 | 0.989 | 0.400 | 16.200 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 1,010,632 | 0.989 | 0.400 | 16.200 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 370,370 | 2.700 | 2.700 | 2.700 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 625,000 | 1.600 | 1.100 | 3.100 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 542,005 | 1.845 | 1.100 | 14.700 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 394,726 | 2.533 | 0.500 | 488.400 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 113,449 | 8.815 | 0.500 | 1717.100 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 76,808 | 13.019 | 0.500 | 1717.100 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 77,078 | 12.974 | 0.500 | 1717.100 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 77,266 | 12.942 | 0.500 | 1717.100 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 77,298 | 12.937 | 0.500 | 1717.100 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 77,301 | 12.936 | 0.500 | 1717.100 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 20,492 | 48.800 | 48.800 | 48.800 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 93,809 | 10.660 | 1.000 | 48.800 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 434,783 | 2.300 | 0.900 | 48.800 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 1,050,862 | 0.952 | 0.300 | 48.800 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 1,211,827 | 0.825 | 0.300 | 48.800 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 1,211,827 | 0.825 | 0.300 | 48.800 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 1,211,827 | 0.825 | 0.300 | 48.800 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 1,211,827 | 0.825 | 0.300 | 48.800 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 1,211,827 | 0.825 | 0.300 | 48.800 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 1,211,827 | 0.825 | 0.300 | 48.800 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 374,919 | 2.667 | 1.500 | 63.700 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 379,212 | 2.637 | 1.500 | 63.700 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 380,065 | 2.631 | 1.400 | 63.700 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 380,150 | 2.631 | 1.400 | 63.700 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 380,150 | 2.631 | 1.400 | 63.700 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 212,766 | 4.700 | 4.700 | 4.700 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 303,951 | 3.290 | 2.500 | 6.100 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 351,865 | 2.842 | 1.700 | 7.100 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 299,347 | 3.341 | 1.200 | 28.000 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 76,304 | 13.106 | 1.200 | 9897.400 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 58,667 | 17.045 | 1.200 | 9897.400 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 59,012 | 16.946 | 1.200 | 9897.400 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 59,167 | 16.901 | 1.200 | 9897.400 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 59,188 | 16.895 | 1.200 | 9897.400 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 59,190 | 16.895 | 1.200 | 9897.400 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 238,728 | 4.189 | 1.400 | 6954.100 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 248,796 | 4.019 | 1.400 | 6954.100 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 249,930 | 4.001 | 1.400 | 6954.100 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 250,040 | 3.999 | 1.400 | 6954.100 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 250,051 | 3.999 | 1.400 | 6954.100 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 38,314 | 26.100 | 26.100 | 26.100 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 151,057 | 6.620 | 3.400 | 26.100 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 250,689 | 3.989 | 2.000 | 31.100 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 213,174 | 4.691 | 1.400 | 1163.800 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 353,749 | 2.827 | 1.400 | 1163.800 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 327,400 | 3.054 | 1.400 | 1163.800 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 325,267 | 3.074 | 1.400 | 1163.800 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 324,719 | 3.080 | 1.400 | 1163.800 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 324,228 | 3.084 | 1.400 | 1163.800 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 294,266 | 3.398 | 1.400 | 6283.900 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 169,492 | 5.900 | 5.900 | 5.900 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 271,739 | 3.680 | 2.900 | 5.900 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 289,436 | 3.455 | 2.300 | 9.000 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 253,962 | 3.938 | 1.500 | 36.500 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 78,391 | 12.757 | 1.500 | 744.700 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 58,377 | 17.130 | 1.500 | 4853.300 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 58,586 | 17.069 | 1.500 | 4853.300 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 58,738 | 17.025 | 1.500 | 4853.300 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 58,760 | 17.018 | 1.500 | 4853.300 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 58,762 | 17.018 | 1.500 | 4853.300 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 204,082 | 4.900 | 4.900 | 4.900 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 300,300 | 3.330 | 2.900 | 4.900 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 273,000 | 3.663 | 1.800 | 33.100 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 363,280 | 2.753 | 1.300 | 257.800 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 419,708 | 2.383 | 1.300 | 257.800 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 346,984 | 2.882 | 1.300 | 2995.600 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 345,867 | 2.891 | 1.300 | 2995.600 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 345,981 | 2.890 | 1.300 | 2995.600 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 345,971 | 2.890 | 1.300 | 2995.600 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 345,878 | 2.891 | 1.300 | 2995.600 |
| value | head | 0 | up | 1 | 8 | A | 1 | 333,333 | 3.000 | 3.000 | 3.000 |
| value | head | 0 | up | 10 | 410 | A | 10 | 1,204,819 | 0.830 | 0.400 | 3.000 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 3,105,590 | 0.322 | 0.200 | 3.000 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 3,139,717 | 0.319 | 0.100 | 37.900 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 2,992,131 | 0.334 | 0.100 | 37.900 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 2,260,801 | 0.442 | 0.100 | 37.900 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 2,255,187 | 0.443 | 0.100 | 37.900 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 2,255,546 | 0.443 | 0.100 | 37.900 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 2,254,780 | 0.444 | 0.100 | 37.900 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 2,213,859 | 0.452 | 0.100 | 164.400 |
| value | random | 0 | up | 1 | 8 | A | 1 | 2,500,000 | 0.400 | 0.400 | 0.400 |
| value | random | 0 | up | 10 | 410 | A | 10 | 2,857,143 | 0.350 | 0.200 | 0.600 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 1,779,359 | 0.562 | 0.100 | 1.500 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 601,323 | 1.663 | 0.100 | 25.600 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 99,142 | 10.087 | 0.100 | 123.300 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 71,679 | 13.951 | 0.100 | 368.800 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 71,941 | 13.900 | 0.100 | 368.800 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 72,151 | 13.860 | 0.100 | 368.800 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 72,183 | 13.854 | 0.100 | 368.800 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 72,173 | 13.856 | 0.100 | 368.800 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 2,500,000 | 0.400 | 0.400 | 0.400 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 3,125,000 | 0.320 | 0.200 | 0.500 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 6,369,427 | 0.157 | 0.100 | 0.500 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 6,013,229 | 0.166 | 0.100 | 4.900 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 4,278,258 | 0.234 | 0.100 | 52.200 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 2,876,870 | 0.348 | 0.100 | 67.400 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 2,879,801 | 0.347 | 0.100 | 67.400 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 2,883,603 | 0.347 | 0.100 | 67.400 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 2,884,485 | 0.347 | 0.100 | 67.400 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 2,877,325 | 0.348 | 0.100 | 67.400 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 14,970 | 66.800 |
| create | — | 0 | up | 10 | A | 1 | 25,707 | 38.900 |
| create | — | 0 | up | 100 | A | 1 | 17,762 | 56.300 |
| create | — | 0 | up | 1,000 | A | 1 | 2,973 | 336.400 |
| create | — | 0 | up | 10,000 | A | 1 | 360 | 2776.100 |
| create | — | 0 | down | 1,000 | A | 1 | 2,494 | 400.900 |
| create | — | 0 | down | 100 | A | 1 | 9,050 | 110.500 |
| create | — | 0 | down | 10 | A | 1 | 24,752 | 40.400 |
| create | — | 0 | down | 1 | A | 1 | 29,326 | 34.100 |
| create | — | 0 | down | 0 | A | 1 | 38,911 | 25.700 |
| sequence | — | 0 | up | 1 | A | 1 | 3,982 | 251.100 |
| sequence | — | 0 | up | 10 | A | 1 | 17,889 | 55.900 |
| sequence | — | 0 | up | 100 | A | 1 | 7,321 | 136.600 |
| sequence | — | 0 | up | 1,000 | A | 1 | 551 | 1814.100 |
| sequence | — | 0 | up | 10,000 | A | 1 | 33 | 30063.300 |
| sequence | — | 0 | down | 1,000 | A | 1 | 20 | 50467.900 |
| sequence | — | 0 | down | 100 | A | 1 | 18 | 56467.000 |
| sequence | — | 0 | down | 10 | A | 1 | 15 | 65057.100 |
| sequence | — | 0 | down | 1 | A | 1 | 15 | 67568.900 |
| sequence | — | 0 | down | 0 | A | 1 | 75,188 | 13.300 |
| values | — | 0 | up | 1 | A | 1 | 16,611 | 60.200 |
| values | — | 0 | up | 10 | A | 1 | 26,385 | 37.900 |
| values | — | 0 | up | 100 | A | 1 | 6,689 | 149.500 |
| values | — | 0 | up | 1,000 | A | 1 | 519 | 1927.800 |
| values | — | 0 | up | 10,000 | A | 1 | 127 | 7886.300 |
| values | — | 0 | down | 1,000 | A | 1 | 416 | 2406.300 |
| values | — | 0 | down | 100 | A | 1 | 2,440 | 409.800 |
| values | — | 0 | down | 10 | A | 1 | 24,631 | 40.600 |
| values | — | 0 | down | 1 | A | 1 | 42,553 | 23.500 |
| values | — | 0 | down | 0 | A | 1 | 42,373 | 23.600 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 83,263,488 | 9,862,248 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 75,231,232 | 10,016,984 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 76,845,056 | 10,656,968 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 100,212,736 | 15,597,440 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 304,242,688 | 64,600,360 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 400,531,456 | 109,766,376 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 405,794,816 | 114,577,736 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 405,958,656 | 115,012,496 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 406,683,648 | 115,079,512 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 406,695,936 | 115,032,456 |

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
