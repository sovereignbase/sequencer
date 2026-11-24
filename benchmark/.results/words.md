# Words benchmarks

2026-11-24T18:44:14.312Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 65,684 | 284,990 | 491 |
| append | packed | 5.90 | 3.61 | 13.98 | 67,532 | 378,758 | 566 |
| prepend | unpacked | 40.07 | 18.06 | 22.94 | 3,439 | 1,250 | 385 |
| prepend | packed | 5.90 | 3.61 | 13.99 | 67,479 | 2,452 | 401 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 883 | 308 | 147 |
| random | packed | 49.58 | 35.37 | 23.45 | 39,193 | 739 | 190 |
| concurrent | unpacked | 92.23 | 42.77 | 32.34 | 1,089 | 311 | 178 |
| concurrent | packed | 38.94 | 28.17 | 20.71 | 40,398 | 561 | 225 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 472.93 | 149.55 |
| append | numeric | encode | 15224.30 | 239.84 |
| append | numeric | decode | 1692.54 | 285.32 |
| append | numeric | create | 1380.63 | 82.90 |
| append | numeric | load | 3508.89 | 142.17 |
| append | numeric | apply | 921709.96 | 101606.76 |
| append | numeric | receive | 2036938.44 | 1572.08 |
| append | binary | sequence | 556.77 | 195.72 |
| append | binary | encode | 14807.71 | 832.41 |
| append | binary | decode | 1591.49 | 432.93 |
| append | binary | create | 1350.31 | 176.87 |
| append | binary | load | 2640.21 | 343.01 |
| append | binary | apply | 939399.59 | 37550.23 |
| append | binary | receive | 1767191.90 | 397047.25 |
| prepend | numeric | sequence | 280779.44 | 5629.39 |
| prepend | numeric | encode | 290767.99 | 53503.61 |
| prepend | numeric | decode | 119066.32 | 4906.91 |
| prepend | numeric | create | 413127.51 | 15661.03 |
| prepend | numeric | load | 800274.76 | 35476.10 |
| prepend | numeric | apply | 1482210.50 | 60707.12 |
| prepend | numeric | receive | 2597806.05 | 58412.25 |
| prepend | binary | sequence | 225504.77 | 1649.14 |
| prepend | binary | encode | 14819.34 | 218.40 |
| prepend | binary | decode | 2002.03 | 179.70 |
| prepend | binary | create | 388319.95 | 5071.45 |
| prepend | binary | load | 407787.07 | 67608.37 |
| prepend | binary | apply | 1486550.38 | 32614.53 |
| prepend | binary | receive | 2496422.38 | 140509.85 |
| random | numeric | sequence | 744363.91 | 9389.02 |
| random | numeric | encode | 1132792.62 | 10869.91 |
| random | numeric | decode | 752888.82 | 3989.69 |
| random | numeric | create | 1211534.55 | 9684.77 |
| random | numeric | load | 3243372.19 | 10199.28 |
| random | numeric | apply | 4595803.09 | 171799.67 |
| random | numeric | receive | 6793950.38 | 181952.31 |
| random | binary | sequence | 546753.47 | 27425.29 |
| random | binary | encode | 25514.90 | 3394.58 |
| random | binary | decode | 1930.20 | 934.18 |
| random | binary | create | 1325604.84 | 15330.70 |
| random | binary | load | 1352576.05 | 20663.30 |
| random | binary | apply | 3994462.85 | 28748.85 |
| random | binary | receive | 5263310.50 | 82924.30 |
| concurrent | numeric | sequence | 591381.14 | 4544.82 |
| concurrent | numeric | encode | 918191.07 | 70588.74 |
| concurrent | numeric | decode | 545853.77 | 27517.26 |
| concurrent | numeric | create | 1712407.43 | 338278.12 |
| concurrent | numeric | load | 3218051.69 | 410237.83 |
| concurrent | numeric | apply | 3633051.21 | 16540.68 |
| concurrent | numeric | receive | 5626533.78 | 106510.72 |
| concurrent | binary | sequence | 440422.97 | 4562.57 |
| concurrent | binary | encode | 24753.96 | 237.72 |
| concurrent | binary | decode | 1889.61 | 277.57 |
| concurrent | binary | create | 1725281.48 | 294302.62 |
| concurrent | binary | load | 1783639.83 | 346829.51 |
| concurrent | binary | apply | 3233388.25 | 37165.38 |
| concurrent | binary | receive | 4453957.50 | 117569.49 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
