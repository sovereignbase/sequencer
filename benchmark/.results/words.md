# Words benchmarks

2026-11-27T16:37:25.171Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 40,429 | 216,091 | 388 |
| append | packed | 5.90 | 3.61 | 13.98 | 36,311 | 269,052 | 397 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 2,612 | 968 | 277 |
| prepend | packed | 5.90 | 3.61 | 13.99 | 36,040 | 1,821 | 299 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 677 | 236 | 112 |
| random | packed | 49.58 | 35.37 | 23.45 | 28,622 | 591 | 138 |
| concurrent | unpacked | 92.23 | 42.75 | 32.34 | 945 | 259 | 144 |
| concurrent | packed | 38.94 | 28.17 | 20.71 | 30,466 | 459 | 159 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 283.52 | 103.43 |
| append | numeric | encode | 24734.58 | 6182.39 |
| append | numeric | decode | 2080.71 | 616.54 |
| append | numeric | create | 1599.09 | 113.83 |
| append | numeric | load | 4627.69 | 128.19 |
| append | numeric | apply | 1128408.73 | 74737.23 |
| append | numeric | receive | 2580016.05 | 436522.45 |
| append | binary | sequence | 400.27 | 75.43 |
| append | binary | encode | 27539.82 | 2878.82 |
| append | binary | decode | 1472.80 | 180.31 |
| append | binary | create | 1548.52 | 185.13 |
| append | binary | load | 3716.75 | 1130.77 |
| append | binary | apply | 1123642.42 | 33401.87 |
| append | binary | receive | 2521580.90 | 249703.89 |
| prepend | numeric | sequence | 341854.85 | 34535.38 |
| prepend | numeric | encode | 382793.20 | 29747.04 |
| prepend | numeric | decode | 132820.86 | 2918.10 |
| prepend | numeric | create | 531014.58 | 10734.64 |
| prepend | numeric | load | 1033453.49 | 42967.28 |
| prepend | numeric | apply | 1837831.96 | 157930.12 |
| prepend | numeric | receive | 3610709.43 | 126971.95 |
| prepend | binary | sequence | 268621.56 | 4670.40 |
| prepend | binary | encode | 27746.96 | 514.35 |
| prepend | binary | decode | 2090.04 | 340.56 |
| prepend | binary | create | 523401.10 | 7625.31 |
| prepend | binary | load | 549000.82 | 1707.45 |
| prepend | binary | apply | 2007679.44 | 279068.46 |
| prepend | binary | receive | 3349328.47 | 169062.20 |
| random | numeric | sequence | 934698.17 | 15835.08 |
| random | numeric | encode | 1476987.82 | 9676.01 |
| random | numeric | decode | 981096.71 | 54573.00 |
| random | numeric | create | 1505562.21 | 44043.23 |
| random | numeric | load | 4244551.58 | 260493.84 |
| random | numeric | apply | 5813944.00 | 320332.66 |
| random | numeric | receive | 8929597.83 | 275678.75 |
| random | binary | sequence | 746361.91 | 4474.50 |
| random | binary | encode | 34938.19 | 10758.16 |
| random | binary | decode | 1445.53 | 484.09 |
| random | binary | create | 1693753.27 | 23498.74 |
| random | binary | load | 1692630.30 | 116284.11 |
| random | binary | apply | 4804330.82 | 56017.23 |
| random | binary | receive | 7226629.29 | 723318.36 |
| concurrent | numeric | sequence | 758161.56 | 10188.41 |
| concurrent | numeric | encode | 1058670.81 | 180689.99 |
| concurrent | numeric | decode | 749456.19 | 122802.34 |
| concurrent | numeric | create | 1445832.54 | 313759.07 |
| concurrent | numeric | load | 3855005.15 | 675039.19 |
| concurrent | numeric | apply | 4405252.25 | 114354.71 |
| concurrent | numeric | receive | 6930917.37 | 401568.46 |
| concurrent | binary | sequence | 608693.55 | 9264.16 |
| concurrent | binary | encode | 32823.77 | 2098.14 |
| concurrent | binary | decode | 2430.43 | 394.20 |
| concurrent | binary | create | 2061901.80 | 334389.34 |
| concurrent | binary | load | 2177669.48 | 360972.15 |
| concurrent | binary | apply | 4068194.15 | 55081.85 |
| concurrent | binary | receive | 6290332.75 | 409096.35 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
