# Sequencer dynamic lifecycle benchmark

Generated: 2026-10-12T16:47:20.761Z

Node 24.16.0; V8 13.6.233.17-node.49; win32 x64; Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

Runs: 1; lifecycle: 0 → 10,000 → 0 visible Strips; Strip length: 1…100 Frames.

Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.

## Aggregate operation latency

| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| apply | random | A | scaleUp | 10,000 | 35,932 | 27.830 | 27.830 | 27.830 | 0.000 | 0: 27.830 | 0: 27.830 |
| apply | random | A | scaleDown | 9,999 | 25,364 | 39.427 | 39.427 | 39.427 | 0.000 | 0: 39.427 | 0: 39.427 |
| apply | random | A | fullLifecycle | 19,999 | 29,737 | 33.628 | 33.628 | 33.628 | 0.000 | 0: 33.628 | 0: 33.628 |
| create | — | A | scaleUp | 6 | 1,427 | 700.767 | 700.767 | 700.767 | 0.000 | 0: 700.767 | 0: 700.767 |
| create | — | A | scaleDown | 5 | 8,566 | 116.740 | 116.740 | 116.740 | 0.000 | 0: 116.740 | 0: 116.740 |
| create | — | A | fullLifecycle | 11 | 2,297 | 435.300 | 435.300 | 435.300 | 0.000 | 0: 435.300 | 0: 435.300 |
| insert | head | A | scaleUp | 5,000 | 847,443 | 1.180 | 1.180 | 1.180 | 0.000 | 0: 1.180 | 0: 1.180 |
| insert | head | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | head | A | fullLifecycle | 5,000 | 847,443 | 1.180 | 1.180 | 1.180 | 0.000 | 0: 1.180 | 0: 1.180 |
| insert | random | A | scaleUp | 10,000 | 96,198 | 10.395 | 10.395 | 10.395 | 0.000 | 0: 10.395 | 0: 10.395 |
| insert | random | A | scaleDown | 10,000 | 60,509 | 16.526 | 16.526 | 16.526 | 0.000 | 0: 16.526 | 0: 16.526 |
| insert | random | A | fullLifecycle | 20,000 | 74,289 | 13.461 | 13.461 | 13.461 | 0.000 | 0: 13.461 | 0: 13.461 |
| insert | tail | A | scaleUp | 5,000 | 1,055,699 | 0.947 | 0.947 | 0.947 | 0.000 | 0: 0.947 | 0: 0.947 |
| insert | tail | A | scaleDown | 0 | — | — | — | — | — | — | — |
| insert | tail | A | fullLifecycle | 5,000 | 1,055,699 | 0.947 | 0.947 | 0.947 | 0.000 | 0: 0.947 | 0: 0.947 |
| remove | head | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | head | A | scaleDown | 5,000 | 392,181 | 2.550 | 2.550 | 2.550 | 0.000 | 0: 2.550 | 0: 2.550 |
| remove | head | A | fullLifecycle | 5,000 | 392,181 | 2.550 | 2.550 | 2.550 | 0.000 | 0: 2.550 | 0: 2.550 |
| remove | random | A | scaleUp | 10,000 | 67,471 | 14.821 | 14.821 | 14.821 | 0.000 | 0: 14.821 | 0: 14.821 |
| remove | random | A | scaleDown | 10,000 | 51,662 | 19.357 | 19.357 | 19.357 | 0.000 | 0: 19.357 | 0: 19.357 |
| remove | random | A | fullLifecycle | 20,000 | 58,518 | 17.089 | 17.089 | 17.089 | 0.000 | 0: 17.089 | 0: 17.089 |
| remove | tail | A | scaleUp | 0 | — | — | — | — | — | — | — |
| remove | tail | A | scaleDown | 5,000 | 395,892 | 2.526 | 2.526 | 2.526 | 0.000 | 0: 2.526 | 0: 2.526 |
| remove | tail | A | fullLifecycle | 5,000 | 395,892 | 2.526 | 2.526 | 2.526 | 0.000 | 0: 2.526 | 0: 2.526 |
| replace | head | A | scaleUp | 10,000 | 323,492 | 3.091 | 3.091 | 3.091 | 0.000 | 0: 3.091 | 0: 3.091 |
| replace | head | A | scaleDown | 10,000 | 272,570 | 3.669 | 3.669 | 3.669 | 0.000 | 0: 3.669 | 0: 3.669 |
| replace | head | A | fullLifecycle | 20,000 | 295,856 | 3.380 | 3.380 | 3.380 | 0.000 | 0: 3.380 | 0: 3.380 |
| replace | random | A | scaleUp | 10,000 | 65,640 | 15.235 | 15.235 | 15.235 | 0.000 | 0: 15.235 | 0: 15.235 |
| replace | random | A | scaleDown | 10,000 | 48,271 | 20.717 | 20.717 | 20.717 | 0.000 | 0: 20.717 | 0: 20.717 |
| replace | random | A | fullLifecycle | 20,000 | 55,631 | 17.976 | 17.976 | 17.976 | 0.000 | 0: 17.976 | 0: 17.976 |
| replace | tail | A | scaleUp | 10,000 | 364,165 | 2.746 | 2.746 | 2.746 | 0.000 | 0: 2.746 | 0: 2.746 |
| replace | tail | A | scaleDown | 10,000 | 311,168 | 3.214 | 3.214 | 3.214 | 0.000 | 0: 3.214 | 0: 3.214 |
| replace | tail | A | fullLifecycle | 20,000 | 335,587 | 2.980 | 2.980 | 2.980 | 0.000 | 0: 2.980 | 0: 2.980 |
| sequence | — | A | scaleUp | 5 | 141 | 7109.320 | 7109.320 | 7109.320 | 0.000 | 0: 7109.320 | 0: 7109.320 |
| sequence | — | A | scaleDown | 5 | 22 | 46441.120 | 46441.120 | 46441.120 | 0.000 | 0: 46441.120 | 0: 46441.120 |
| sequence | — | A | fullLifecycle | 10 | 37 | 26775.220 | 26775.220 | 26775.220 | 0.000 | 0: 26775.220 | 0: 26775.220 |
| value | head | A | scaleUp | 10,000 | 2,405,523 | 0.416 | 0.416 | 0.416 | 0.000 | 0: 0.416 | 0: 0.416 |
| value | head | A | scaleDown | 10,000 | 1,573,168 | 0.636 | 0.636 | 0.636 | 0.000 | 0: 0.636 | 0: 0.636 |
| value | head | A | fullLifecycle | 20,000 | 1,902,280 | 0.526 | 0.526 | 0.526 | 0.000 | 0: 0.526 | 0: 0.526 |
| value | random | A | scaleUp | 10,000 | 82,499 | 12.121 | 12.121 | 12.121 | 0.000 | 0: 12.121 | 0: 12.121 |
| value | random | A | scaleDown | 10,000 | 59,426 | 16.828 | 16.828 | 16.828 | 0.000 | 0: 16.828 | 0: 16.828 |
| value | random | A | fullLifecycle | 20,000 | 69,087 | 14.474 | 14.474 | 14.474 | 0.000 | 0: 14.474 | 0: 14.474 |
| value | tail | A | scaleUp | 10,000 | 3,768,892 | 0.265 | 0.265 | 0.265 | 0.000 | 0: 0.265 | 0: 0.265 |
| value | tail | A | scaleDown | 10,000 | 2,126,122 | 0.470 | 0.470 | 0.470 | 0.000 | 0: 0.470 | 0: 0.470 |
| value | tail | A | fullLifecycle | 20,000 | 2,718,610 | 0.368 | 0.368 | 0.368 | 0.000 | 0: 0.368 | 0: 0.368 |
| values | — | A | scaleUp | 5 | 337 | 2968.240 | 2968.240 | 2968.240 | 0.000 | 0: 2968.240 | 0: 2968.240 |
| values | — | A | scaleDown | 5 | 1,610 | 621.040 | 621.040 | 621.040 | 0.000 | 0: 621.040 | 0: 621.040 |
| values | — | A | fullLifecycle | 10 | 557 | 1794.640 | 1794.640 | 1794.640 | 0.000 | 0: 1794.640 | 0: 1794.640 |

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
| apply | random | 0 | up | 1 | 8 | A | 1 | 68,493 | 14.600 | 14.600 | 14.600 |
| apply | random | 0 | up | 10 | 410 | A | 10 | 48,591 | 20.580 | 14.600 | 37.000 |
| apply | random | 0 | up | 100 | 4,859 | A | 100 | 90,066 | 11.103 | 4.800 | 72.400 |
| apply | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 97,189 | 10.289 | 3.300 | 485.600 |
| apply | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 35,932 | 27.830 | 3.300 | 4475.400 |
| apply | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 29,807 | 33.550 | 3.300 | 4475.400 |
| apply | random | 0 | down | 100 | 5,271 | A | 19,900 | 29,776 | 33.584 | 3.200 | 4475.400 |
| apply | random | 0 | down | 10 | 444 | A | 19,990 | 29,843 | 33.508 | 3.200 | 4475.400 |
| apply | random | 0 | down | 1 | 89 | A | 19,999 | 29,737 | 33.628 | 3.200 | 4475.400 |
| apply | random | 0 | down | 0 | 0 | A | 19,999 | 29,737 | 33.628 | 3.200 | 4475.400 |
| insert | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| insert | head | 0 | up | 10 | 410 | A | 5 | 168,919 | 5.920 | 2.900 | 15.600 |
| insert | head | 0 | up | 100 | 4,859 | A | 50 | 435,161 | 2.298 | 1.300 | 15.600 |
| insert | head | 0 | up | 1,000 | 50,842 | A | 500 | 850,629 | 1.176 | 0.600 | 23.200 |
| insert | head | 0 | up | 10,000 | 501,051 | A | 5,000 | 847,443 | 1.180 | 0.600 | 78.300 |
| insert | head | 0 | down | 1,000 | 49,083 | A | 5,000 | 847,443 | 1.180 | 0.600 | 78.300 |
| insert | head | 0 | down | 100 | 5,271 | A | 5,000 | 847,443 | 1.180 | 0.600 | 78.300 |
| insert | head | 0 | down | 10 | 444 | A | 5,000 | 847,443 | 1.180 | 0.600 | 78.300 |
| insert | head | 0 | down | 1 | 89 | A | 5,000 | 847,443 | 1.180 | 0.600 | 78.300 |
| insert | head | 0 | down | 0 | 0 | A | 5,000 | 847,443 | 1.180 | 0.600 | 78.300 |
| insert | random | 0 | up | 1 | 8 | A | 1 | 400,000 | 2.500 | 2.500 | 2.500 |
| insert | random | 0 | up | 10 | 410 | A | 10 | 239,234 | 4.180 | 2.500 | 7.200 |
| insert | random | 0 | up | 100 | 4,859 | A | 100 | 384,763 | 2.599 | 1.300 | 18.100 |
| insert | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 321,430 | 3.111 | 0.700 | 473.900 |
| insert | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 96,198 | 10.395 | 0.600 | 1981.900 |
| insert | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 74,032 | 13.508 | 0.600 | 7596.100 |
| insert | random | 0 | down | 100 | 5,271 | A | 19,900 | 74,094 | 13.496 | 0.600 | 7596.100 |
| insert | random | 0 | down | 10 | 444 | A | 19,990 | 74,257 | 13.467 | 0.600 | 7596.100 |
| insert | random | 0 | down | 1 | 89 | A | 19,999 | 74,286 | 13.461 | 0.600 | 7596.100 |
| insert | random | 0 | down | 0 | 0 | A | 20,000 | 74,289 | 13.461 | 0.600 | 7596.100 |
| insert | tail | 0 | up | 1 | 8 | A | 1 | 166,667 | 6.000 | 6.000 | 6.000 |
| insert | tail | 0 | up | 10 | 410 | A | 5 | 280,899 | 3.560 | 2.700 | 6.000 |
| insert | tail | 0 | up | 100 | 4,859 | A | 50 | 479,846 | 2.084 | 1.200 | 9.700 |
| insert | tail | 0 | up | 1,000 | 50,842 | A | 500 | 851,644 | 1.174 | 0.400 | 28.700 |
| insert | tail | 0 | up | 10,000 | 501,051 | A | 5,000 | 1,055,699 | 0.947 | 0.400 | 28.700 |
| insert | tail | 0 | down | 1,000 | 49,083 | A | 5,000 | 1,055,699 | 0.947 | 0.400 | 28.700 |
| insert | tail | 0 | down | 100 | 5,271 | A | 5,000 | 1,055,699 | 0.947 | 0.400 | 28.700 |
| insert | tail | 0 | down | 10 | 444 | A | 5,000 | 1,055,699 | 0.947 | 0.400 | 28.700 |
| insert | tail | 0 | down | 1 | 89 | A | 5,000 | 1,055,699 | 0.947 | 0.400 | 28.700 |
| insert | tail | 0 | down | 0 | 0 | A | 5,000 | 1,055,699 | 0.947 | 0.400 | 28.700 |
| remove | head | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | head | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | head | 0 | down | 1,000 | 49,083 | A | 4,500 | 394,470 | 2.535 | 1.600 | 89.300 |
| remove | head | 0 | down | 100 | 5,271 | A | 4,950 | 392,017 | 2.551 | 1.400 | 89.300 |
| remove | head | 0 | down | 10 | 444 | A | 4,995 | 392,143 | 2.550 | 1.400 | 89.300 |
| remove | head | 0 | down | 1 | 89 | A | 5,000 | 392,181 | 2.550 | 1.400 | 89.300 |
| remove | head | 0 | down | 0 | 0 | A | 5,000 | 392,181 | 2.550 | 1.400 | 89.300 |
| remove | random | 0 | up | 1 | 8 | A | 1 | 196,078 | 5.100 | 5.100 | 5.100 |
| remove | random | 0 | up | 10 | 410 | A | 10 | 145,138 | 6.890 | 5.100 | 7.700 |
| remove | random | 0 | up | 100 | 4,859 | A | 100 | 239,923 | 4.168 | 2.200 | 8.400 |
| remove | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 201,560 | 4.961 | 1.400 | 635.100 |
| remove | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 67,471 | 14.821 | 1.400 | 3301.400 |
| remove | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 58,336 | 17.142 | 1.400 | 3301.400 |
| remove | random | 0 | down | 100 | 5,271 | A | 19,900 | 58,359 | 17.135 | 1.400 | 3301.400 |
| remove | random | 0 | down | 10 | 444 | A | 19,990 | 58,496 | 17.095 | 1.400 | 3301.400 |
| remove | random | 0 | down | 1 | 89 | A | 19,999 | 58,516 | 17.089 | 1.400 | 3301.400 |
| remove | random | 0 | down | 0 | 0 | A | 20,000 | 58,518 | 17.089 | 1.400 | 3301.400 |
| remove | tail | 0 | up | 1 | 8 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10 | 410 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 100 | 4,859 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 1,000 | 50,842 | A | 0 | — | — | — | — |
| remove | tail | 0 | up | 10,000 | 501,051 | A | 0 | — | — | — | — |
| remove | tail | 0 | down | 1,000 | 49,083 | A | 4,500 | 398,632 | 2.509 | 1.500 | 32.500 |
| remove | tail | 0 | down | 100 | 5,271 | A | 4,950 | 395,551 | 2.528 | 1.500 | 32.500 |
| remove | tail | 0 | down | 10 | 444 | A | 4,995 | 395,907 | 2.526 | 1.500 | 32.500 |
| remove | tail | 0 | down | 1 | 89 | A | 4,999 | 395,964 | 2.525 | 1.500 | 32.500 |
| remove | tail | 0 | down | 0 | 0 | A | 5,000 | 395,892 | 2.526 | 1.500 | 32.500 |
| replace | head | 0 | up | 1 | 8 | A | 1 | 44,248 | 22.600 | 22.600 | 22.600 |
| replace | head | 0 | up | 10 | 410 | A | 10 | 85,106 | 11.750 | 8.500 | 22.600 |
| replace | head | 0 | up | 100 | 4,859 | A | 100 | 179,469 | 5.572 | 2.500 | 36.200 |
| replace | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 275,999 | 3.623 | 1.800 | 46.100 |
| replace | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 323,492 | 3.091 | 1.700 | 1169.600 |
| replace | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 324,643 | 3.080 | 1.700 | 1169.600 |
| replace | head | 0 | down | 100 | 5,271 | A | 19,900 | 321,148 | 3.114 | 1.700 | 1169.600 |
| replace | head | 0 | down | 10 | 444 | A | 19,990 | 320,680 | 3.118 | 1.700 | 1169.600 |
| replace | head | 0 | down | 1 | 89 | A | 19,999 | 320,230 | 3.123 | 1.700 | 1169.600 |
| replace | head | 0 | down | 0 | 0 | A | 20,000 | 295,856 | 3.380 | 1.700 | 5148.500 |
| replace | random | 0 | up | 1 | 8 | A | 1 | 153,846 | 6.500 | 6.500 | 6.500 |
| replace | random | 0 | up | 10 | 410 | A | 10 | 114,811 | 8.710 | 6.500 | 11.600 |
| replace | random | 0 | up | 100 | 4,859 | A | 100 | 196,425 | 5.091 | 2.700 | 11.600 |
| replace | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 185,017 | 5.405 | 2.100 | 136.800 |
| replace | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 65,640 | 15.235 | 1.700 | 5645.900 |
| replace | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 55,488 | 18.022 | 1.600 | 7209.200 |
| replace | random | 0 | down | 100 | 5,271 | A | 19,900 | 55,482 | 18.024 | 1.600 | 7209.200 |
| replace | random | 0 | down | 10 | 444 | A | 19,990 | 55,609 | 17.983 | 1.600 | 7209.200 |
| replace | random | 0 | down | 1 | 89 | A | 19,999 | 55,630 | 17.976 | 1.600 | 7209.200 |
| replace | random | 0 | down | 0 | 0 | A | 20,000 | 55,631 | 17.976 | 1.600 | 7209.200 |
| replace | tail | 0 | up | 1 | 8 | A | 1 | 181,818 | 5.500 | 5.500 | 5.500 |
| replace | tail | 0 | up | 10 | 410 | A | 10 | 120,919 | 8.270 | 5.500 | 11.900 |
| replace | tail | 0 | up | 100 | 4,859 | A | 100 | 193,949 | 5.156 | 2.300 | 48.600 |
| replace | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 268,377 | 3.726 | 1.900 | 326.300 |
| replace | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 364,165 | 2.746 | 1.600 | 326.300 |
| replace | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 338,744 | 2.952 | 1.600 | 2409.700 |
| replace | tail | 0 | down | 100 | 5,271 | A | 19,900 | 335,612 | 2.980 | 1.600 | 2409.700 |
| replace | tail | 0 | down | 10 | 444 | A | 19,990 | 335,618 | 2.980 | 1.600 | 2409.700 |
| replace | tail | 0 | down | 1 | 89 | A | 19,999 | 335,606 | 2.980 | 1.600 | 2409.700 |
| replace | tail | 0 | down | 0 | 0 | A | 20,000 | 335,587 | 2.980 | 1.600 | 2409.700 |
| value | head | 0 | up | 1 | 8 | A | 1 | 277,778 | 3.600 | 3.600 | 3.600 |
| value | head | 0 | up | 10 | 410 | A | 10 | 558,659 | 1.790 | 1.000 | 4.300 |
| value | head | 0 | up | 100 | 4,859 | A | 100 | 1,848,429 | 0.541 | 0.200 | 4.300 |
| value | head | 0 | up | 1,000 | 50,842 | A | 1,000 | 2,323,960 | 0.430 | 0.200 | 29.700 |
| value | head | 0 | up | 10,000 | 501,051 | A | 10,000 | 2,405,523 | 0.416 | 0.100 | 29.700 |
| value | head | 0 | down | 1,000 | 49,083 | A | 19,000 | 1,931,562 | 0.518 | 0.100 | 29.700 |
| value | head | 0 | down | 100 | 5,271 | A | 19,900 | 1,922,612 | 0.520 | 0.100 | 29.700 |
| value | head | 0 | down | 10 | 444 | A | 19,990 | 1,923,373 | 0.520 | 0.100 | 29.700 |
| value | head | 0 | down | 1 | 89 | A | 19,999 | 1,922,611 | 0.520 | 0.100 | 29.700 |
| value | head | 0 | down | 0 | 0 | A | 20,000 | 1,902,280 | 0.526 | 0.100 | 111.700 |
| value | random | 0 | up | 1 | 8 | A | 1 | 1,428,571 | 0.700 | 0.700 | 0.700 |
| value | random | 0 | up | 10 | 410 | A | 10 | 1,219,512 | 0.820 | 0.600 | 1.200 |
| value | random | 0 | up | 100 | 4,859 | A | 100 | 1,212,121 | 0.825 | 0.200 | 4.300 |
| value | random | 0 | up | 1,000 | 50,842 | A | 1,000 | 479,088 | 2.087 | 0.200 | 44.600 |
| value | random | 0 | up | 10,000 | 501,051 | A | 10,000 | 82,499 | 12.121 | 0.200 | 225.300 |
| value | random | 0 | down | 1,000 | 49,083 | A | 19,000 | 68,978 | 14.497 | 0.100 | 447.300 |
| value | random | 0 | down | 100 | 5,271 | A | 19,900 | 68,880 | 14.518 | 0.100 | 447.300 |
| value | random | 0 | down | 10 | 444 | A | 19,990 | 69,061 | 14.480 | 0.100 | 447.300 |
| value | random | 0 | down | 1 | 89 | A | 19,999 | 69,091 | 14.474 | 0.100 | 447.300 |
| value | random | 0 | down | 0 | 0 | A | 20,000 | 69,087 | 14.474 | 0.100 | 447.300 |
| value | tail | 0 | up | 1 | 8 | A | 1 | 1,666,667 | 0.600 | 0.600 | 0.600 |
| value | tail | 0 | up | 10 | 410 | A | 10 | 1,515,152 | 0.660 | 0.500 | 1.100 |
| value | tail | 0 | up | 100 | 4,859 | A | 100 | 4,016,064 | 0.249 | 0.100 | 1.100 |
| value | tail | 0 | up | 1,000 | 50,842 | A | 1,000 | 4,275,331 | 0.234 | 0.100 | 6.200 |
| value | tail | 0 | up | 10,000 | 501,051 | A | 10,000 | 3,768,892 | 0.265 | 0.100 | 17.200 |
| value | tail | 0 | down | 1,000 | 49,083 | A | 19,000 | 2,728,160 | 0.367 | 0.100 | 40.700 |
| value | tail | 0 | down | 100 | 5,271 | A | 19,900 | 2,724,124 | 0.367 | 0.100 | 40.700 |
| value | tail | 0 | down | 10 | 444 | A | 19,990 | 2,726,182 | 0.367 | 0.100 | 40.700 |
| value | tail | 0 | down | 1 | 89 | A | 19,999 | 2,726,703 | 0.367 | 0.100 | 40.700 |
| value | tail | 0 | down | 0 | 0 | A | 20,000 | 2,718,610 | 0.368 | 0.100 | 40.700 |

## Management performance

| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |
| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |
| create | — | 0 | up | 1 | A | 1 | 16,667 | 60.000 |
| create | — | 0 | up | 10 | A | 1 | 19,417 | 51.500 |
| create | — | 0 | up | 100 | A | 1 | 13,072 | 76.500 |
| create | — | 0 | up | 1,000 | A | 1 | 2,743 | 364.500 |
| create | — | 0 | up | 10,000 | A | 1 | 298 | 3354.400 |
| create | — | 0 | down | 1,000 | A | 1 | 2,671 | 374.400 |
| create | — | 0 | down | 100 | A | 1 | 9,524 | 105.000 |
| create | — | 0 | down | 10 | A | 1 | 26,525 | 37.700 |
| create | — | 0 | down | 1 | A | 1 | 25,974 | 38.500 |
| create | — | 0 | down | 0 | A | 1 | 35,587 | 28.100 |
| sequence | — | 0 | up | 1 | A | 1 | 5,308 | 188.400 |
| sequence | — | 0 | up | 10 | A | 1 | 15,432 | 64.800 |
| sequence | — | 0 | up | 100 | A | 1 | 6,227 | 160.600 |
| sequence | — | 0 | up | 1,000 | A | 1 | 488 | 2049.300 |
| sequence | — | 0 | up | 10,000 | A | 1 | 30 | 33083.500 |
| sequence | — | 0 | down | 1,000 | A | 1 | 20 | 50835.700 |
| sequence | — | 0 | down | 100 | A | 1 | 15 | 65111.200 |
| sequence | — | 0 | down | 10 | A | 1 | 18 | 56743.000 |
| sequence | — | 0 | down | 1 | A | 1 | 17 | 59499.400 |
| sequence | — | 0 | down | 0 | A | 1 | 61,350 | 16.300 |
| values | — | 0 | up | 1 | A | 1 | 15,361 | 65.100 |
| values | — | 0 | up | 10 | A | 1 | 22,026 | 45.400 |
| values | — | 0 | up | 100 | A | 1 | 4,955 | 201.800 |
| values | — | 0 | up | 1,000 | A | 1 | 444 | 2251.300 |
| values | — | 0 | up | 10,000 | A | 1 | 81 | 12277.600 |
| values | — | 0 | down | 1,000 | A | 1 | 419 | 2388.300 |
| values | — | 0 | down | 100 | A | 1 | 1,703 | 587.200 |
| values | — | 0 | down | 10 | A | 1 | 12,987 | 77.000 |
| values | — | 0 | down | 1 | A | 1 | 41,494 | 24.100 |
| values | — | 0 | down | 0 | A | 1 | 34,965 | 28.600 |

## Memory usage

Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.

| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |
| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | up | A | 1 | 1 | 8 | 108 | 108.000 | 13.500 | 83,767,296 | 9,857,256 |
| 0 | up | A | 10 | 10 | 410 | 3,540 | 354.000 | 8.634 | 76,390,400 | 10,004,304 |
| 0 | up | A | 100 | 100 | 4,859 | 41,292 | 412.920 | 8.498 | 77,537,280 | 10,654,552 |
| 0 | up | A | 1,000 | 1,000 | 50,842 | 430,756 | 430.756 | 8.472 | 99,860,480 | 15,595,248 |
| 0 | up | A | 10,000 | 10,000 | 501,051 | 4,248,428 | 424.843 | 8.479 | 307,175,424 | 64,598,744 |
| 0 | down | A | 1,000 | 1,000 | 49,083 | 416,684 | 416.684 | 8.489 | 401,289,216 | 109,764,672 |
| 0 | down | A | 100 | 100 | 5,271 | 44,588 | 445.880 | 8.459 | 406,433,792 | 114,576,032 |
| 0 | down | A | 10 | 10 | 444 | 3,812 | 381.200 | 8.586 | 406,245,376 | 115,010,792 |
| 0 | down | A | 1 | 1 | 89 | 756 | 756.000 | 8.494 | 405,487,616 | 115,080,280 |
| 0 | down | A | 0 | 0 | 0 | 20 | — | — | 406,708,224 | 114,911,416 |

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
