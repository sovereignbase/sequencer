# Words benchmarks

2026-11-27T21:42:30.008Z · local run

5 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 29,947 | 176,630 | 179 |
| append | packed | 5.90 | 3.61 | 13.98 | 25,913 | 183,022 | 292 |
| prepend | unpacked | 40.07 | 18.06 | 22.94 | 1,848 | 749 | 253 |
| prepend | packed | 5.90 | 3.62 | 13.99 | 26,666 | 1,530 | 251 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 457 | 236 | 80 |
| random | packed | 49.58 | 35.38 | 23.45 | 11,897 | 488 | 119 |
| concurrent | unpacked | 92.24 | 42.76 | 32.34 | 602 | 206 | 94 |
| concurrent | packed | 38.94 | 28.15 | 20.71 | 15,580 | 418 | 119 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 683.65 | 283.38 |
| append | numeric | encode | 33392.60 | 11224.68 |
| append | numeric | decode | 2862.60 | 724.08 |
| append | numeric | create | 2130.34 | 378.02 |
| append | numeric | load | 5661.56 | 1451.31 |
| append | numeric | apply | 3426033.33 | 948193.33 |
| append | numeric | receive | 5586077.78 | 2076720.00 |
| append | binary | sequence | 559.59 | 125.92 |
| append | binary | encode | 38590.12 | 7222.35 |
| append | binary | decode | 2014.62 | 653.24 |
| append | binary | create | 1999.86 | 193.45 |
| append | binary | load | 5463.81 | 536.20 |
| append | binary | apply | 1792896.55 | 187437.04 |
| append | binary | receive | 3419146.67 | 231046.67 |
| prepend | numeric | sequence | 470091.59 | 23807.79 |
| prepend | numeric | encode | 541093.55 | 71877.51 |
| prepend | numeric | decode | 223779.91 | 34072.20 |
| prepend | numeric | create | 608801.20 | 27576.19 |
| prepend | numeric | load | 1335423.68 | 64991.23 |
| prepend | numeric | apply | 2492947.62 | 859902.68 |
| prepend | numeric | receive | 3956476.92 | 2590892.31 |
| prepend | binary | sequence | 353915.49 | 66747.47 |
| prepend | binary | encode | 37500.90 | 11184.48 |
| prepend | binary | decode | 2288.45 | 369.63 |
| prepend | binary | create | 648483.33 | 94238.42 |
| prepend | binary | load | 653670.13 | 57578.35 |
| prepend | binary | apply | 2603540.00 | 393792.78 |
| prepend | binary | receive | 3984353.85 | 1108210.77 |
| random | numeric | sequence | 951815.09 | 22824.25 |
| random | numeric | encode | 2189413.04 | 326573.81 |
| random | numeric | decode | 919552.73 | 330254.94 |
| random | numeric | create | 1767275.86 | 322652.14 |
| random | numeric | load | 4233425.00 | 1503463.85 |
| random | numeric | apply | 8358766.67 | 753509.52 |
| random | numeric | receive | 12545400.00 | 115525.00 |
| random | binary | sequence | 928796.36 | 48304.68 |
| random | binary | encode | 84058.03 | 12824.81 |
| random | binary | decode | 1745.53 | 1374.45 |
| random | binary | create | 2104425.00 | 239657.53 |
| random | binary | load | 2048160.00 | 615639.26 |
| random | binary | apply | 6617175.00 | 2003608.33 |
| random | binary | receive | 8374550.00 | 2960668.57 |
| concurrent | numeric | sequence | 833413.33 | 28904.68 |
| concurrent | numeric | encode | 1660258.06 | 217531.45 |
| concurrent | numeric | decode | 985523.53 | 276976.11 |
| concurrent | numeric | create | 2415038.10 | 302466.67 |
| concurrent | numeric | load | 4858600.00 | 1009217.17 |
| concurrent | numeric | apply | 6006744.44 | 2510672.22 |
| concurrent | numeric | receive | 10613080.00 | 3662335.00 |
| concurrent | binary | sequence | 761062.12 | 63057.80 |
| concurrent | binary | encode | 64185.38 | 4383.60 |
| concurrent | binary | decode | 3085.23 | 860.90 |
| concurrent | binary | create | 2327854.55 | 409629.52 |
| concurrent | binary | load | 2391266.67 | 702581.88 |
| concurrent | binary | apply | 5608244.44 | 677941.11 |
| concurrent | binary | receive | 8408583.33 | 3175220.00 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
