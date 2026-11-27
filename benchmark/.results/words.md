# Words benchmarks

2026-11-27T22:08:10.619Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 63,682 | 275,430 | 444 |
| append | packed | 5.90 | 3.61 | 13.98 | 62,717 | 402,380 | 499 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 3,436 | 1,239 | 369 |
| prepend | packed | 5.90 | 3.62 | 13.99 | 65,918 | 2,385 | 418 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 875 | 319 | 137 |
| random | packed | 49.58 | 35.37 | 23.45 | 35,079 | 752 | 184 |
| concurrent | unpacked | 92.22 | 42.78 | 32.34 | 1,255 | 387 | 173 |
| concurrent | packed | 38.94 | 28.21 | 20.71 | 40,384 | 823 | 214 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 205.56 | 128.04 |
| append | numeric | encode | 15703.03 | 1849.77 |
| append | numeric | decode | 1966.27 | 41.89 |
| append | numeric | create | 1311.06 | 70.67 |
| append | numeric | load | 3630.69 | 306.42 |
| append | numeric | apply | 1195423.38 | 115073.52 |
| append | numeric | receive | 2251187.04 | 209940.49 |
| append | binary | sequence | 354.51 | 104.47 |
| append | binary | encode | 15944.66 | 955.78 |
| append | binary | decode | 1927.88 | 161.32 |
| append | binary | create | 1325.57 | 135.90 |
| append | binary | load | 2485.21 | 186.18 |
| append | binary | apply | 1075364.17 | 84920.80 |
| append | binary | receive | 2004108.32 | 223633.86 |
| prepend | numeric | sequence | 294902.49 | 16006.02 |
| prepend | numeric | encode | 291051.16 | 10231.28 |
| prepend | numeric | decode | 111998.36 | 7992.61 |
| prepend | numeric | create | 401923.17 | 6426.70 |
| prepend | numeric | load | 806958.19 | 18241.46 |
| prepend | numeric | apply | 1677284.47 | 136628.50 |
| prepend | numeric | receive | 2711203.63 | 146700.06 |
| prepend | binary | sequence | 222500.52 | 3805.69 |
| prepend | binary | encode | 15170.47 | 657.21 |
| prepend | binary | decode | 1961.82 | 140.88 |
| prepend | binary | create | 401565.90 | 7440.92 |
| prepend | binary | load | 419326.90 | 6924.34 |
| prepend | binary | apply | 1614691.13 | 149144.30 |
| prepend | binary | receive | 2391904.33 | 82095.37 |
| random | numeric | sequence | 743546.78 | 12720.58 |
| random | numeric | encode | 1143385.25 | 15208.59 |
| random | numeric | decode | 747542.76 | 13925.45 |
| random | numeric | create | 1217522.69 | 17298.89 |
| random | numeric | load | 3137655.81 | 85461.15 |
| random | numeric | apply | 4681592.00 | 286000.00 |
| random | numeric | receive | 7282173.57 | 400221.45 |
| random | binary | sequence | 549279.07 | 30301.47 |
| random | binary | encode | 28507.14 | 2493.77 |
| random | binary | decode | 2141.63 | 228.42 |
| random | binary | create | 1325609.95 | 23193.23 |
| random | binary | load | 1330444.84 | 7899.00 |
| random | binary | apply | 4068505.85 | 29770.15 |
| random | binary | receive | 5439651.40 | 204382.01 |
| concurrent | numeric | sequence | 577379.25 | 3321.43 |
| concurrent | numeric | encode | 796967.49 | 44436.87 |
| concurrent | numeric | decode | 530071.66 | 109123.71 |
| concurrent | numeric | create | 1118671.07 | 253403.94 |
| concurrent | numeric | load | 2584875.10 | 59481.66 |
| concurrent | numeric | apply | 3855220.00 | 25093.82 |
| concurrent | numeric | receive | 5795850.44 | 30905.83 |
| concurrent | binary | sequence | 442166.73 | 5478.44 |
| concurrent | binary | encode | 24762.50 | 330.67 |
| concurrent | binary | decode | 1959.27 | 37.44 |
| concurrent | binary | create | 1161398.23 | 268657.38 |
| concurrent | binary | load | 1215769.40 | 281474.40 |
| concurrent | binary | apply | 3438975.33 | 56044.93 |
| concurrent | binary | receive | 4665322.09 | 131611.55 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
