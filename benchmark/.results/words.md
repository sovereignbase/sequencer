# Words benchmarks

2026-11-24T18:22:12.058Z · local run

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 30,766 | 211,289 | 297 |
| append | packed | 5.90 | 3.61 | 13.98 | 32,728 | 226,108 | 340 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 2,044 | 832 | 219 |
| prepend | packed | 5.90 | 3.62 | 13.99 | 33,284 | 1,769 | 276 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 529 | 229 | 94 |
| random | packed | 49.58 | 35.37 | 23.45 | 15,311 | 586 | 137 |
| concurrent | unpacked | 92.24 | 42.78 | 32.34 | 670 | 334 | 112 |
| concurrent | packed | 38.94 | 28.17 | 20.71 | 19,178 | 653 | 152 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 642.40 | 23.00 |
| append | numeric | encode | 32503.44 | 9358.96 |
| append | numeric | decode | 2439.73 | 958.49 |
| append | numeric | create | 2124.35 | 337.01 |
| append | numeric | load | 4732.86 | 1260.72 |
| append | numeric | apply | 1897662.96 | 156994.69 |
| append | numeric | receive | 3367846.67 | 305961.76 |
| append | binary | sequence | 785.03 | 105.99 |
| append | binary | encode | 30554.55 | 300.27 |
| append | binary | decode | 1893.04 | 119.58 |
| append | binary | create | 1794.05 | 192.09 |
| append | binary | load | 4422.66 | 395.57 |
| append | binary | apply | 1637938.71 | 153298.32 |
| append | binary | receive | 2941511.76 | 171761.46 |
| prepend | numeric | sequence | 394434.65 | 20818.07 |
| prepend | numeric | encode | 489284.47 | 58900.69 |
| prepend | numeric | decode | 159683.76 | 29299.49 |
| prepend | numeric | create | 578713.79 | 42855.48 |
| prepend | numeric | load | 1201626.19 | 153629.53 |
| prepend | numeric | apply | 2652484.21 | 207411.84 |
| prepend | numeric | receive | 4572581.82 | 1228637.50 |
| prepend | binary | sequence | 319619.75 | 6560.97 |
| prepend | binary | encode | 30044.62 | 872.07 |
| prepend | binary | decode | 1964.16 | 253.86 |
| prepend | binary | create | 535767.02 | 5627.86 |
| prepend | binary | load | 565137.08 | 42540.64 |
| prepend | binary | apply | 2448966.67 | 266407.67 |
| prepend | binary | receive | 3624842.86 | 343427.38 |
| random | numeric | sequence | 865698.28 | 14107.30 |
| random | numeric | encode | 1890418.52 | 10548.15 |
| random | numeric | decode | 914254.55 | 18119.64 |
| random | numeric | create | 1571062.50 | 63109.78 |
| random | numeric | load | 4367858.33 | 500750.38 |
| random | numeric | apply | 6929900.00 | 352668.75 |
| random | numeric | receive | 10680680.00 | 476880.00 |
| random | binary | sequence | 802330.16 | 7061.88 |
| random | binary | encode | 65312.99 | 7236.30 |
| random | binary | decode | 1550.75 | 66.35 |
| random | binary | create | 1668513.33 | 165898.26 |
| random | binary | load | 1706406.67 | 36596.49 |
| random | binary | apply | 5613733.33 | 151604.44 |
| random | binary | receive | 7289628.57 | 222350.00 |
| concurrent | numeric | sequence | 757861.19 | 23659.29 |
| concurrent | numeric | encode | 1493576.47 | 169324.61 |
| concurrent | numeric | decode | 467571.03 | 132510.59 |
| concurrent | numeric | create | 1446242.86 | 304067.83 |
| concurrent | numeric | load | 2991276.47 | 614092.95 |
| concurrent | numeric | apply | 5294970.00 | 183224.44 |
| concurrent | numeric | receive | 8923150.00 | 794336.67 |
| concurrent | binary | sequence | 689293.15 | 116198.55 |
| concurrent | binary | encode | 52144.37 | 5939.17 |
| concurrent | binary | decode | 1636.50 | 324.49 |
| concurrent | binary | create | 1635661.29 | 362246.65 |
| concurrent | binary | load | 1532481.82 | 362810.55 |
| concurrent | binary | apply | 4618127.27 | 33109.09 |
| concurrent | binary | receive | 6597137.50 | 1013112.50 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
