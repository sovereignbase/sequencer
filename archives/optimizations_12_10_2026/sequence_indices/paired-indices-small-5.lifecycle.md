# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:48:50.476Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 38,466 | 25.997 | 25.997 | 25.997 | 0.000 | 0: 25.997 | 0: 25.997 |
| apply | random | A | scaleDown | 9,999 | 18,894 | 52.927 | 52.927 | 52.927 | 0.000 | 0: 52.927 | 0: 52.927 |
| apply | random | A | fullLifecycle | 19,999 | 25,341 | 39.461 | 39.461 | 39.461 | 0.000 | 0: 39.461 | 0: 39.461 |
| create | — | A | scaleUp | 6 | 1,650 | 606.217 | 606.217 | 606.217 | 0.000 | 0: 606.217 | 0: 606.217 |
| create | — | A | scaleDown | 5 | 5,189 | 192.700 | 192.700 | 192.700 | 0.000 | 0: 192.700 | 0: 192.700 |
| create | — | A | fullLifecycle | 11 | 2,391 | 418.255 | 418.255 | 418.255 | 0.000 | 0: 418.255 | 0: 418.255 |
| insert | head | A | scaleUp | 5,000 | 893,895 | 1.119 | 1.119 | 1.119 | 0.000 | 0: 1.119 | 0: 1.119 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 893,895 | 1.119 | 1.119 | 1.119 | 0.000 | 0: 1.119 | 0: 1.119 |
| insert | random | A | scaleUp | 10,000 | 104,788 | 9.543 | 9.543 | 9.543 | 0.000 | 0: 9.543 | 0: 9.543 |
| insert | random | A | scaleDown | 10,000 | 47,972 | 20.846 | 20.846 | 20.846 | 0.000 | 0: 20.846 | 0: 20.846 |
| insert | random | A | fullLifecycle | 20,000 | 65,814 | 15.194 | 15.194 | 15.194 | 0.000 | 0: 15.194 | 0: 15.194 |
| insert | tail | A | scaleUp | 5,000 | 1,106,978 | 0.903 | 0.903 | 0.903 | 0.000 | 0: 0.903 | 0: 0.903 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 1,106,978 | 0.903 | 0.903 | 0.903 | 0.000 | 0: 0.903 | 0: 0.903 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 292,779 | 3.416 | 3.416 | 3.416 | 0.000 | 0: 3.416 | 0: 3.416 |
| remove | head | A | fullLifecycle | 5,000 | 292,779 | 3.416 | 3.416 | 3.416 | 0.000 | 0: 3.416 | 0: 3.416 |
| remove | random | A | scaleUp | 10,000 | 74,241 | 13.470 | 13.470 | 13.470 | 0.000 | 0: 13.470 | 0: 13.470 |
| remove | random | A | scaleDown | 10,000 | 36,902 | 27.099 | 27.099 | 27.099 | 0.000 | 0: 27.099 | 0: 27.099 |
| remove | random | A | fullLifecycle | 20,000 | 49,300 | 20.284 | 20.284 | 20.284 | 0.000 | 0: 20.284 | 0: 20.284 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 183,865 | 5.439 | 5.439 | 5.439 | 0.000 | 0: 5.439 | 0: 5.439 |
| remove | tail | A | fullLifecycle | 5,000 | 183,865 | 5.439 | 5.439 | 5.439 | 0.000 | 0: 5.439 | 0: 5.439 |
| replace | head | A | scaleUp | 10,000 | 334,717 | 2.988 | 2.988 | 2.988 | 0.000 | 0: 2.988 | 0: 2.988 |
| replace | head | A | scaleDown | 10,000 | 215,620 | 4.638 | 4.638 | 4.638 | 0.000 | 0: 4.638 | 0: 4.638 |
| replace | head | A | fullLifecycle | 20,000 | 262,282 | 3.813 | 3.813 | 3.813 | 0.000 | 0: 3.813 | 0: 3.813 |
| replace | random | A | scaleUp | 10,000 | 71,409 | 14.004 | 14.004 | 14.004 | 0.000 | 0: 14.004 | 0: 14.004 |
| replace | random | A | scaleDown | 10,000 | 35,524 | 28.150 | 28.150 | 28.150 | 0.000 | 0: 28.150 | 0: 28.150 |
| replace | random | A | fullLifecycle | 20,000 | 47,445 | 21.077 | 21.077 | 21.077 | 0.000 | 0: 21.077 | 0: 21.077 |
| replace | tail | A | scaleUp | 10,000 | 364,618 | 2.743 | 2.743 | 2.743 | 0.000 | 0: 2.743 | 0: 2.743 |
| replace | tail | A | scaleDown | 10,000 | 227,376 | 4.398 | 4.398 | 4.398 | 0.000 | 0: 4.398 | 0: 4.398 |
| replace | tail | A | fullLifecycle | 20,000 | 280,089 | 3.570 | 3.570 | 3.570 | 0.000 | 0: 3.570 | 0: 3.570 |
| sequence | — | A | scaleUp | 5 | 154 | 6485.120 | 6485.120 | 6485.120 | 0.000 | 0: 6485.120 | 0: 6485.120 |
| sequence | — | A | scaleDown | 5 | 13 | 79221.620 | 79221.620 | 79221.620 | 0.000 | 0: 79221.620 | 0: 79221.620 |
| sequence | — | A | fullLifecycle | 10 | 23 | 42853.370 | 42853.370 | 42853.370 | 0.000 | 0: 42853.370 | 0: 42853.370 |
| value | head | A | scaleUp | 10,000 | 2,679,744 | 0.373 | 0.373 | 0.373 | 0.000 | 0: 0.373 | 0: 0.373 |
| value | head | A | scaleDown | 10,000 | 1,464,408 | 0.683 | 0.683 | 0.683 | 0.000 | 0: 0.683 | 0: 0.683 |
| value | head | A | fullLifecycle | 20,000 | 1,893,868 | 0.528 | 0.528 | 0.528 | 0.000 | 0: 0.528 | 0: 0.528 |
| value | random | A | scaleUp | 10,000 | 89,405 | 11.185 | 11.185 | 11.185 | 0.000 | 0: 11.185 | 0: 11.185 |
| value | random | A | scaleDown | 10,000 | 44,991 | 22.227 | 22.227 | 22.227 | 0.000 | 0: 22.227 | 0: 22.227 |
| value | random | A | fullLifecycle | 20,000 | 59,859 | 16.706 | 16.706 | 16.706 | 0.000 | 0: 16.706 | 0: 16.706 |
| value | tail | A | scaleUp | 10,000 | 3,754,036 | 0.266 | 0.266 | 0.266 | 0.000 | 0: 0.266 | 0: 0.266 |
| value | tail | A | scaleDown | 10,000 | 1,884,091 | 0.531 | 0.531 | 0.531 | 0.000 | 0: 0.531 | 0: 0.531 |
| value | tail | A | fullLifecycle | 20,000 | 2,508,970 | 0.399 | 0.399 | 0.399 | 0.000 | 0: 0.399 | 0: 0.399 |
| values | — | A | scaleUp | 5 | 467 | 2141.000 | 2141.000 | 2141.000 | 0.000 | 0: 2141.000 | 0: 2141.000 |
| values | — | A | scaleDown | 5 | 1,129 | 885.700 | 885.700 | 885.700 | 0.000 | 0: 885.700 | 0: 885.700 |
| values | — | A | fullLifecycle | 10 | 661 | 1513.350 | 1513.350 | 1513.350 | 0.000 | 0: 1513.350 | 0: 1513.350 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 69,444 | 14.400 | 14.400 | 14.400 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 103,413 | 9.670 | 8.400 | 14.400 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 113,186 | 8.835 | 4.900 | 84.400 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 90,827 | 11.010 | 3.600 | 1251.600 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 38,466 | 25.997 | 3.500 | 3749.800 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 25,443 | 39.304 | 3.500 | 3749.800 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 25,486 | 39.237 | 3.500 | 3749.800 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 25,521 | 39.184 | 3.500 | 3749.800 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 25,341 | 39.461 | 3.500 | 5833.500 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 25,341 | 39.461 | 3.500 | 5833.500 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 187,266 | 5.340 | 1.600 | 18.600 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 376,223 | 2.658 | 1.400 | 26.200 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 820,210 | 1.219 | 0.600 | 26.200 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 893,895 | 1.119 | 0.600 | 48.000 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 893,895 | 1.119 | 0.600 | 48.000 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 893,895 | 1.119 | 0.600 | 48.000 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 893,895 | 1.119 | 0.600 | 48.000 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 893,895 | 1.119 | 0.600 | 48.000 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 893,895 | 1.119 | 0.600 | 48.000 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 384,615 | 2.600 | 2.600 | 2.600 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 423,729 | 2.360 | 1.700 | 4.400 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 431,220 | 2.319 | 1.500 | 12.800 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 345,531 | 2.894 | 0.800 | 406.500 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 104,788 | 9.543 | 0.800 | 2003.000 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 65,626 | 15.238 | 0.800 | 2003.000 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 65,714 | 15.217 | 0.800 | 2003.000 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 65,786 | 15.201 | 0.800 | 2003.000 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 65,811 | 15.195 | 0.800 | 2003.000 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 65,814 | 15.194 | 0.800 | 2003.000 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 178,571 | 5.600 | 5.600 | 5.600 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 393,701 | 2.540 | 1.600 | 5.600 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 527,983 | 1.894 | 1.300 | 9.000 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 846,310 | 1.182 | 0.500 | 49.300 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 1,106,978 | 0.903 | 0.500 | 49.800 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 1,106,978 | 0.903 | 0.500 | 49.800 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 1,106,978 | 0.903 | 0.500 | 49.800 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 1,106,978 | 0.903 | 0.500 | 49.800 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 1,106,978 | 0.903 | 0.500 | 49.800 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 1,106,978 | 0.903 | 0.500 | 49.800 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 292,559 | 3.418 | 1.700 | 47.000 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 293,293 | 3.410 | 1.700 | 47.000 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 292,847 | 3.415 | 1.700 | 47.000 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 292,779 | 3.416 | 1.700 | 47.000 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 292,779 | 3.416 | 1.700 | 47.000 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 178,571 | 5.600 | 5.600 | 5.600 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 239,808 | 4.170 | 3.500 | 5.600 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 268,097 | 3.730 | 2.200 | 13.700 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 238,146 | 4.199 | 1.400 | 60.500 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 74,241 | 13.470 | 1.400 | 1033.300 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 49,098 | 20.368 | 1.400 | 1033.300 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 49,208 | 20.322 | 1.400 | 1033.300 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 49,283 | 20.291 | 1.400 | 1033.300 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 49,298 | 20.285 | 1.400 | 1033.300 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 49,300 | 20.284 | 1.400 | 1033.300 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 176,319 | 5.672 | 1.700 | 10424.000 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 183,594 | 5.447 | 1.700 | 10424.000 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 183,830 | 5.440 | 1.700 | 10424.000 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 183,871 | 5.439 | 1.700 | 10424.000 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 183,865 | 5.439 | 1.700 | 10424.000 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 54,348 | 18.400 | 18.400 | 18.400 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 126,263 | 7.920 | 4.600 | 18.400 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 217,817 | 4.591 | 2.600 | 26.100 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 308,871 | 3.238 | 2.000 | 30.100 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 334,717 | 2.988 | 1.800 | 1118.200 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 283,958 | 3.522 | 1.800 | 1118.200 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 280,176 | 3.569 | 1.800 | 1118.200 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 278,987 | 3.584 | 1.800 | 1118.200 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 278,564 | 3.590 | 1.800 | 1118.200 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 262,282 | 3.813 | 1.800 | 4460.700 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 161,290 | 6.200 | 6.200 | 6.200 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 195,313 | 5.120 | 4.100 | 7.100 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 237,812 | 4.205 | 2.700 | 7.100 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 171,007 | 5.848 | 2.100 | 783.500 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 71,409 | 14.004 | 1.800 | 783.500 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 47,223 | 21.176 | 1.800 | 8510.100 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 47,348 | 21.120 | 1.800 | 8510.100 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 47,431 | 21.083 | 1.800 | 8510.100 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 47,444 | 21.077 | 1.800 | 8510.100 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 47,445 | 21.077 | 1.800 | 8510.100 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 188,679 | 5.300 | 5.300 | 5.300 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 200,000 | 5.000 | 3.900 | 8.300 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 224,568 | 4.453 | 2.400 | 70.400 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 256,043 | 3.906 | 1.900 | 486.600 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 364,618 | 2.743 | 1.600 | 486.600 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 282,720 | 3.537 | 1.600 | 4809.500 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 280,512 | 3.565 | 1.600 | 4809.500 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 280,160 | 3.569 | 1.600 | 4809.500 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 280,102 | 3.570 | 1.600 | 4809.500 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 280,089 | 3.570 | 1.600 | 4809.500 |
| value | head | 0 | up | 1 | 8 | A | 1 | 416,667 | 2.400 | 2.400 | 2.400 |
| value | head | 0 | up | 10 | 410 | A | 10 | 925,926 | 1.080 | 0.500 | 3.300 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 2,506,266 | 0.399 | 0.200 | 3.300 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 2,538,715 | 0.394 | 0.200 | 27.300 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 2,679,744 | 0.373 | 0.200 | 63.200 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 1,921,152 | 0.521 | 0.200 | 63.200 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 1,917,278 | 0.522 | 0.200 | 63.200 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 1,915,136 | 0.522 | 0.200 | 63.200 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 1,914,275 | 0.522 | 0.200 | 63.200 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 1,893,868 | 0.528 | 0.200 | 113.100 |
| value | random | 0 | up | 1 | 8 | A | 1 | 1,666,667 | 0.600 | 0.600 | 0.600 |
| value | random | 0 | up | 10 | 410 | A | 10 | 1,886,792 | 0.530 | 0.400 | 0.900 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 1,375,516 | 0.727 | 0.200 | 2.200 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 495,466 | 2.018 | 0.200 | 32.100 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 89,405 | 11.185 | 0.200 | 392.900 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 59,639 | 16.768 | 0.200 | 392.900 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 59,726 | 16.743 | 0.200 | 392.900 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 59,837 | 16.712 | 0.200 | 392.900 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 59,863 | 16.705 | 0.200 | 392.900 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 59,859 | 16.706 | 0.200 | 392.900 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 2,000,000 | 0.500 | 0.500 | 0.500 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 2,222,222 | 0.450 | 0.300 | 0.800 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 4,716,981 | 0.212 | 0.100 | 0.800 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 4,484,305 | 0.223 | 0.100 | 7.200 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 3,754,036 | 0.266 | 0.100 | 37.500 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 2,532,422 | 0.395 | 0.100 | 37.500 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 2,517,012 | 0.397 | 0.100 | 37.500 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 2,516,776 | 0.397 | 0.100 | 37.500 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 2,517,054 | 0.397 | 0.100 | 37.500 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 2,508,970 | 0.399 | 0.100 | 37.500 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 17,153 | 58.300 |
| create | — | 0 | up | 10 | A | 1 | 15,337 | 65.200 |
| create | — | 0 | up | 100 | A | 1 | 9,653 | 103.600 |
| create | — | 0 | up | 1,000 | A | 1 | 2,707 | 369.400 |
| create | — | 0 | up | 10,000 | A | 1 | 364 | 2744.300 |
| create | — | 0 | down | 1,000 | A | 1 | 1,439 | 694.700 |
| create | — | 0 | down | 100 | A | 1 | 6,983 | 143.200 |
| create | — | 0 | down | 10 | A | 1 | 21,552 | 46.400 |
| create | — | 0 | down | 1 | A | 1 | 23,585 | 42.400 |
| create | — | 0 | down | 0 | A | 1 | 27,174 | 36.800 |
| sequence | — | 0 | up | 1 | A | 1 | 4,677 | 213.800 |
| sequence | — | 0 | up | 10 | A | 1 | 17,331 | 57.700 |
| sequence | — | 0 | up | 100 | A | 1 | 4,034 | 247.900 |
| sequence | — | 0 | up | 1,000 | A | 1 | 469 | 2133.900 |
| sequence | — | 0 | up | 10,000 | A | 1 | 34 | 29772.300 |
| sequence | — | 0 | down | 1,000 | A | 1 | 14 | 73077.000 |
| sequence | — | 0 | down | 100 | A | 1 | 10 | 100749.900 |
| sequence | — | 0 | down | 10 | A | 1 | 6 | 154574.700 |
| sequence | — | 0 | down | 1 | A | 1 | 15 | 67684.200 |
| sequence | — | 0 | down | 0 | A | 1 | 44,843 | 22.300 |
| values | — | 0 | up | 1 | A | 1 | 11,947 | 83.700 |
| values | — | 0 | up | 10 | A | 1 | 19,763 | 50.600 |
| values | — | 0 | up | 100 | A | 1 | 2,698 | 370.700 |
| values | — | 0 | up | 1,000 | A | 1 | 441 | 2268.100 |
| values | — | 0 | up | 10,000 | A | 1 | 126 | 7931.900 |
| values | — | 0 | down | 1,000 | A | 1 | 275 | 3631.900 |
| values | — | 0 | down | 100 | A | 1 | 1,519 | 658.500 |
| values | — | 0 | down | 10 | A | 1 | 12,804 | 78.100 |
| values | — | 0 | down | 1 | A | 1 | 34,247 | 29.200 |
| values | — | 0 | down | 0 | A | 1 | 32,468 | 30.800 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 83,472,384 | 9,857,008 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 76,443,648 | 10,004,328 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 78,610,432 | 10,654,656 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 101,253,120 | 15,595,032 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 304,828,416 | 64,597,952 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 400,932,864 | 109,763,800 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 407,752,704 | 114,575,328 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 408,252,416 | 115,010,088 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 407,932,928 | 115,079,576 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 407,449,600 | 114,910,712 |

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
