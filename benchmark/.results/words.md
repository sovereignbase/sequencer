# Words benchmarks

2026-11-27T21:54:17.712Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 99,569 | 374,996 | 700 |
| append | packed | 5.90 | 3.61 | 13.98 | 95,140 | 410,951 | 816 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 5,332 | 1,780 | 583 |
| prepend | packed | 5.90 | 3.61 | 13.99 | 90,033 | 3,551 | 645 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 1,241 | 452 | 193 |
| random | packed | 49.58 | 35.38 | 23.45 | 51,456 | 1,094 | 251 |
| concurrent | unpacked | 92.22 | 42.78 | 32.34 | 1,531 | 431 | 237 |
| concurrent | packed | 38.94 | 28.15 | 20.71 | 52,951 | 778 | 315 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 260.68 | 29.96 |
| append | numeric | encode | 10043.30 | 479.41 |
| append | numeric | decode | 1518.59 | 150.94 |
| append | numeric | create | 1160.33 | 119.51 |
| append | numeric | load | 2666.70 | 96.83 |
| append | numeric | apply | 779212.65 | 23477.98 |
| append | numeric | receive | 1429565.00 | 113032.22 |
| append | binary | sequence | 282.17 | 54.80 |
| append | binary | encode | 10510.88 | 173.29 |
| append | binary | decode | 1161.56 | 331.31 |
| append | binary | create | 1107.93 | 144.34 |
| append | binary | load | 2433.38 | 147.81 |
| append | binary | apply | 706409.59 | 71420.92 |
| append | binary | receive | 1225428.20 | 32144.57 |
| prepend | numeric | sequence | 182390.62 | 4444.62 |
| prepend | numeric | encode | 187562.60 | 23378.99 |
| prepend | numeric | decode | 68690.33 | 57222.63 |
| prepend | numeric | create | 293347.61 | 6777.73 |
| prepend | numeric | load | 561947.62 | 15183.95 |
| prepend | numeric | apply | 1045728.23 | 82933.77 |
| prepend | numeric | receive | 1715383.40 | 99970.60 |
| prepend | binary | sequence | 140281.11 | 5486.55 |
| prepend | binary | encode | 11107.05 | 5088.16 |
| prepend | binary | decode | 1187.05 | 205.04 |
| prepend | binary | create | 277919.11 | 1877.05 |
| prepend | binary | load | 281631.72 | 5843.86 |
| prepend | binary | apply | 1047935.63 | 41253.49 |
| prepend | binary | receive | 1549813.27 | 107132.96 |
| random | numeric | sequence | 516457.13 | 7725.64 |
| random | numeric | encode | 805486.37 | 29358.95 |
| random | numeric | decode | 479620.98 | 50400.35 |
| random | numeric | create | 833553.22 | 15959.40 |
| random | numeric | load | 2210837.30 | 15502.57 |
| random | numeric | apply | 3586293.43 | 52083.18 |
| random | numeric | receive | 5189596.00 | 255559.67 |
| random | binary | sequence | 381348.52 | 9851.60 |
| random | binary | encode | 19434.24 | 1286.93 |
| random | binary | decode | 798.71 | 38.43 |
| random | binary | create | 887999.25 | 62356.97 |
| random | binary | load | 913728.56 | 5819.51 |
| random | binary | apply | 3122173.71 | 140098.79 |
| random | binary | receive | 3985109.23 | 232268.98 |
| concurrent | numeric | sequence | 416791.08 | 15563.52 |
| concurrent | numeric | encode | 653322.47 | 37861.82 |
| concurrent | numeric | decode | 396929.63 | 72543.66 |
| concurrent | numeric | create | 1175656.21 | 366542.54 |
| concurrent | numeric | load | 2321326.64 | 280888.68 |
| concurrent | numeric | apply | 3255133.69 | 318855.45 |
| concurrent | numeric | receive | 4221191.17 | 175793.70 |
| concurrent | binary | sequence | 338092.56 | 20403.33 |
| concurrent | binary | encode | 18885.46 | 2431.48 |
| concurrent | binary | decode | 1107.09 | 174.22 |
| concurrent | binary | create | 1204628.60 | 48907.35 |
| concurrent | binary | load | 1285862.38 | 12872.78 |
| concurrent | binary | apply | 2481344.67 | 72721.19 |
| concurrent | binary | receive | 3175314.19 | 144958.05 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
