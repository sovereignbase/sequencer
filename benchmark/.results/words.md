# Words benchmarks

2026-11-21T14:01:49.360Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 40,815 | 226,159 | 382 |
| append | packed | 5.90 | 3.61 | 13.98 | 52,747 | 267,425 | 418 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 2,524 | 826 | 300 |
| prepend | packed | 17.62 | 3.67 | 14.99 | 33,416 | 1,338 | 333 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 678 | 308 | 121 |
| random | packed | 54.84 | 36.96 | 29.60 | 23,979 | 618 | 128 |
| concurrent | unpacked | 92.23 | 42.75 | 32.34 | 937 | 298 | 145 |
| concurrent | packed | 42.46 | 28.93 | 23.69 | 22,352 | 458 | 157 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 635.71 | 162.54 |
| append | numeric | encode | 24500.68 | 3906.46 |
| append | numeric | decode | 2172.57 | 285.55 |
| append | numeric | create | 1820.22 | 164.01 |
| append | numeric | load | 4421.68 | 297.78 |
| append | numeric | apply | 1207662.05 | 122315.81 |
| append | numeric | receive | 2619447.40 | 234441.16 |
| append | binary | sequence | 1195.55 | 207.39 |
| append | binary | encode | 18958.33 | 3745.89 |
| append | binary | decode | 2164.88 | 215.99 |
| append | binary | create | 1820.95 | 45.70 |
| append | binary | load | 3739.36 | 431.80 |
| append | binary | apply | 1055526.96 | 42330.87 |
| append | binary | receive | 2392914.62 | 282213.91 |
| prepend | numeric | sequence | 331812.40 | 8647.46 |
| prepend | numeric | encode | 396210.81 | 16244.01 |
| prepend | numeric | decode | 137051.95 | 17119.04 |
| prepend | numeric | create | 742748.87 | 5616.74 |
| prepend | numeric | load | 1209973.21 | 39313.14 |
| prepend | numeric | apply | 1821769.07 | 275308.09 |
| prepend | numeric | receive | 3335538.60 | 366639.07 |
| prepend | binary | sequence | 314799.94 | 1578.12 |
| prepend | binary | encode | 29925.61 | 546.66 |
| prepend | binary | decode | 2219.87 | 275.23 |
| prepend | binary | create | 754038.97 | 7998.56 |
| prepend | binary | load | 747482.81 | 17151.40 |
| prepend | binary | apply | 1680659.03 | 177091.02 |
| prepend | binary | receive | 2999955.65 | 145878.33 |
| random | numeric | sequence | 867137.26 | 7869.62 |
| random | numeric | encode | 1473887.76 | 234.60 |
| random | numeric | decode | 1025355.51 | 167024.40 |
| random | numeric | create | 1483489.12 | 49717.18 |
| random | numeric | load | 3250987.44 | 387284.47 |
| random | numeric | apply | 5740433.56 | 176076.69 |
| random | numeric | receive | 8290256.86 | 152629.45 |
| random | binary | sequence | 765737.56 | 3033.48 |
| random | binary | encode | 41704.02 | 4252.24 |
| random | binary | decode | 1765.25 | 1146.24 |
| random | binary | create | 1565293.75 | 24442.63 |
| random | binary | load | 1617150.48 | 19317.61 |
| random | binary | apply | 5354239.30 | 111765.37 |
| random | binary | receive | 7786386.86 | 193337.36 |
| concurrent | numeric | sequence | 713533.76 | 15919.26 |
| concurrent | numeric | encode | 1067651.40 | 66587.42 |
| concurrent | numeric | decode | 738462.01 | 139444.82 |
| concurrent | numeric | create | 2007595.40 | 363433.87 |
| concurrent | numeric | load | 3360728.87 | 395380.23 |
| concurrent | numeric | apply | 4447421.58 | 124823.46 |
| concurrent | numeric | receive | 6879062.38 | 332400.60 |
| concurrent | binary | sequence | 617596.47 | 8587.32 |
| concurrent | binary | encode | 44738.29 | 2263.49 |
| concurrent | binary | decode | 2355.00 | 138.46 |
| concurrent | binary | create | 2039356.52 | 4337.94 |
| concurrent | binary | load | 2183587.35 | 15752.36 |
| concurrent | binary | apply | 4320780.58 | 55254.33 |
| concurrent | binary | receive | 6367463.00 | 209507.36 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
