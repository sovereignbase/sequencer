# Words benchmarks

2026-11-22T17:23:11.562Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 62,071 | 308,346 | 489 |
| append | packed | 5.90 | 3.61 | 13.98 | 65,825 | 388,225 | 539 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 3,951 | 1,178 | 393 |
| prepend | packed | 5.90 | 3.62 | 13.99 | 66,776 | 1,792 | 437 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 931 | 375 | 135 |
| random | packed | 49.58 | 35.37 | 23.45 | 32,028 | 855 | 194 |
| concurrent | unpacked | 92.24 | 42.77 | 32.34 | 1,317 | 431 | 183 |
| concurrent | packed | 38.94 | 28.15 | 20.71 | 37,149 | 552 | 217 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 407.14 | 160.36 |
| append | numeric | encode | 16110.51 | 1474.17 |
| append | numeric | decode | 1666.92 | 237.54 |
| append | numeric | create | 1123.79 | 68.19 |
| append | numeric | load | 3243.10 | 79.69 |
| append | numeric | apply | 1105356.72 | 62715.98 |
| append | numeric | receive | 2045620.56 | 65479.47 |
| append | binary | sequence | 534.29 | 136.56 |
| append | binary | encode | 15191.72 | 1071.79 |
| append | binary | decode | 1315.91 | 284.14 |
| append | binary | create | 1167.82 | 68.60 |
| append | binary | load | 2575.83 | 281.36 |
| append | binary | apply | 930268.59 | 37756.29 |
| append | binary | receive | 1855715.33 | 131239.84 |
| prepend | numeric | sequence | 240400.42 | 16499.17 |
| prepend | numeric | encode | 253107.85 | 9545.88 |
| prepend | numeric | decode | 97873.00 | 12916.53 |
| prepend | numeric | create | 530909.91 | 5906.87 |
| prepend | numeric | load | 848831.14 | 27263.04 |
| prepend | numeric | apply | 1569045.37 | 118399.48 |
| prepend | numeric | receive | 2541772.30 | 171133.89 |
| prepend | binary | sequence | 232121.65 | 991.08 |
| prepend | binary | encode | 14975.44 | 300.30 |
| prepend | binary | decode | 1052.94 | 307.09 |
| prepend | binary | create | 543253.47 | 4459.98 |
| prepend | binary | load | 558014.89 | 155.98 |
| prepend | binary | apply | 1412231.81 | 66145.54 |
| prepend | binary | receive | 2286750.59 | 76290.70 |
| random | numeric | sequence | 631509.26 | 13287.35 |
| random | numeric | encode | 1073953.11 | 16689.25 |
| random | numeric | decode | 708965.58 | 19606.78 |
| random | numeric | create | 1029732.98 | 47232.36 |
| random | numeric | load | 2663904.68 | 117619.99 |
| random | numeric | apply | 4612784.18 | 236003.40 |
| random | numeric | receive | 7386246.29 | 451476.58 |
| random | binary | sequence | 481690.88 | 2032.53 |
| random | binary | encode | 31222.91 | 1209.11 |
| random | binary | decode | 977.51 | 210.18 |
| random | binary | create | 1134647.84 | 19282.02 |
| random | binary | load | 1169710.63 | 30782.98 |
| random | binary | apply | 3936745.54 | 15538.88 |
| random | binary | receive | 5152940.10 | 80305.85 |
| concurrent | numeric | sequence | 505496.92 | 2983.25 |
| concurrent | numeric | encode | 759176.65 | 47589.00 |
| concurrent | numeric | decode | 513458.24 | 4944.30 |
| concurrent | numeric | create | 982243.39 | 392002.60 |
| concurrent | numeric | load | 2319886.27 | 383630.53 |
| concurrent | numeric | apply | 3626543.86 | 42022.79 |
| concurrent | numeric | receive | 5470627.50 | 239826.38 |
| concurrent | binary | sequence | 391495.97 | 1293.60 |
| concurrent | binary | encode | 26918.65 | 842.37 |
| concurrent | binary | decode | 1090.94 | 116.52 |
| concurrent | binary | create | 1744675.07 | 38296.00 |
| concurrent | binary | load | 1810478.82 | 28472.06 |
| concurrent | binary | apply | 3245524.00 | 38408.69 |
| concurrent | binary | receive | 4616650.82 | 6924.27 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
