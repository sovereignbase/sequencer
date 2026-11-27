# Words benchmarks

2026-11-27T16:50:46.304Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 42,277 | 238,241 | 333 |
| append | packed | 5.90 | 3.61 | 13.98 | 43,784 | 245,877 | 391 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 2,730 | 1,063 | 269 |
| prepend | packed | 5.90 | 3.62 | 13.99 | 43,354 | 1,831 | 315 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 743 | 258 | 106 |
| random | packed | 49.58 | 35.37 | 23.45 | 28,026 | 652 | 134 |
| concurrent | unpacked | 92.22 | 42.73 | 32.34 | 1,017 | 251 | 115 |
| concurrent | packed | 38.94 | 28.16 | 20.71 | 26,686 | 430 | 158 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 363.04 | 63.20 |
| append | numeric | encode | 23653.80 | 4450.26 |
| append | numeric | decode | 2141.94 | 318.55 |
| append | numeric | create | 1658.67 | 243.62 |
| append | numeric | load | 4197.43 | 265.31 |
| append | numeric | apply | 1511421.32 | 189849.00 |
| append | numeric | receive | 3003210.24 | 618129.83 |
| append | binary | sequence | 548.17 | 48.06 |
| append | binary | encode | 22839.39 | 279.39 |
| append | binary | decode | 1732.83 | 281.69 |
| append | binary | create | 1418.62 | 139.50 |
| append | binary | load | 4067.07 | 528.52 |
| append | binary | apply | 1316548.92 | 111903.81 |
| append | binary | receive | 2557776.45 | 140103.64 |
| prepend | numeric | sequence | 351354.78 | 45935.61 |
| prepend | numeric | encode | 366254.74 | 52658.31 |
| prepend | numeric | decode | 120835.26 | 3164.62 |
| prepend | numeric | create | 529717.96 | 5884.06 |
| prepend | numeric | load | 940365.52 | 13759.64 |
| prepend | numeric | apply | 2008670.96 | 128742.84 |
| prepend | numeric | receive | 3711679.71 | 308932.78 |
| prepend | binary | sequence | 292453.27 | 9524.06 |
| prepend | binary | encode | 23065.68 | 662.11 |
| prepend | binary | decode | 2125.56 | 254.89 |
| prepend | binary | create | 516733.93 | 8398.56 |
| prepend | binary | load | 546184.15 | 9587.21 |
| prepend | binary | apply | 1871886.26 | 35823.99 |
| prepend | binary | receive | 3175496.38 | 192297.67 |
| random | numeric | sequence | 804839.14 | 2054.95 |
| random | numeric | encode | 1345825.89 | 44520.97 |
| random | numeric | decode | 981413.96 | 30796.84 |
| random | numeric | create | 1430385.80 | 30688.78 |
| random | numeric | load | 3881835.15 | 485540.20 |
| random | numeric | apply | 6726854.50 | 447593.14 |
| random | numeric | receive | 9439810.00 | 218563.17 |
| random | binary | sequence | 607250.73 | 2226.81 |
| random | binary | encode | 35681.71 | 4230.89 |
| random | binary | decode | 1507.10 | 209.73 |
| random | binary | create | 1549086.82 | 35919.12 |
| random | binary | load | 1532911.06 | 6578.26 |
| random | binary | apply | 5176206.40 | 79963.75 |
| random | binary | receive | 7444340.14 | 105437.07 |
| concurrent | numeric | sequence | 680742.73 | 9098.11 |
| concurrent | numeric | encode | 982887.33 | 105786.39 |
| concurrent | numeric | decode | 699211.00 | 14667.55 |
| concurrent | numeric | create | 2174488.57 | 510631.15 |
| concurrent | numeric | load | 3980743.15 | 568799.35 |
| concurrent | numeric | apply | 4911771.09 | 197199.16 |
| concurrent | numeric | receive | 8675661.67 | 733044.01 |
| concurrent | binary | sequence | 518293.05 | 380.21 |
| concurrent | binary | encode | 37473.33 | 6065.73 |
| concurrent | binary | decode | 1823.09 | 212.32 |
| concurrent | binary | create | 2233143.74 | 422074.85 |
| concurrent | binary | load | 2324723.95 | 466932.42 |
| concurrent | binary | apply | 4294068.17 | 71068.25 |
| concurrent | binary | receive | 6340041.00 | 148620.22 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
