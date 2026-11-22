# Words benchmarks

2026-11-22T17:33:17.991Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 51,539 | 217,596 | 334 |
| append | packed | 5.90 | 3.61 | 13.98 | 42,172 | 193,971 | 392 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 2,628 | 756 | 273 |
| prepend | packed | 5.90 | 3.62 | 13.99 | 39,072 | 1,318 | 299 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 674 | 264 | 103 |
| random | packed | 49.58 | 35.38 | 23.45 | 29,457 | 605 | 150 |
| concurrent | unpacked | 92.24 | 42.76 | 32.34 | 919 | 290 | 132 |
| concurrent | packed | 38.94 | 28.16 | 20.71 | 28,975 | 455 | 157 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 754.76 | 66.28 |
| append | numeric | encode | 19402.70 | 4561.41 |
| append | numeric | decode | 2053.17 | 261.68 |
| append | numeric | create | 1671.15 | 14.41 |
| append | numeric | load | 4595.66 | 482.69 |
| append | numeric | apply | 1210037.55 | 121514.86 |
| append | numeric | receive | 2989927.41 | 738181.31 |
| append | binary | sequence | 1046.27 | 262.33 |
| append | binary | encode | 23712.35 | 3987.35 |
| append | binary | decode | 1934.46 | 255.14 |
| append | binary | create | 1838.76 | 130.82 |
| append | binary | load | 5155.40 | 846.97 |
| append | binary | apply | 1199482.93 | 56464.44 |
| append | binary | receive | 2550383.05 | 144788.97 |
| prepend | numeric | sequence | 338780.75 | 36931.70 |
| prepend | numeric | encode | 380519.68 | 62570.23 |
| prepend | numeric | decode | 144166.04 | 21056.70 |
| prepend | numeric | create | 747005.28 | 13173.15 |
| prepend | numeric | load | 1323339.87 | 46504.58 |
| prepend | numeric | apply | 1824931.89 | 7761.96 |
| prepend | numeric | receive | 3657065.29 | 317387.41 |
| prepend | binary | sequence | 344504.75 | 859.32 |
| prepend | binary | encode | 25593.95 | 583.79 |
| prepend | binary | decode | 2221.34 | 232.87 |
| prepend | binary | create | 754098.27 | 16809.76 |
| prepend | binary | load | 758539.27 | 15633.76 |
| prepend | binary | apply | 1861141.41 | 39695.22 |
| prepend | binary | receive | 3340992.33 | 146277.38 |
| random | numeric | sequence | 898193.43 | 20811.58 |
| random | numeric | encode | 1484535.71 | 14545.31 |
| random | numeric | decode | 1090774.09 | 55476.07 |
| random | numeric | create | 1503935.06 | 37210.48 |
| random | numeric | load | 3781250.93 | 329505.55 |
| random | numeric | apply | 5810858.89 | 109717.72 |
| random | numeric | receive | 9705221.00 | 210453.73 |
| random | binary | sequence | 753111.12 | 2261.93 |
| random | binary | encode | 33947.98 | 1581.06 |
| random | binary | decode | 2354.54 | 479.53 |
| random | binary | create | 1597068.44 | 36163.09 |
| random | binary | load | 1653259.81 | 45630.63 |
| random | binary | apply | 5003213.70 | 119318.18 |
| random | binary | receive | 6665584.25 | 399446.92 |
| concurrent | numeric | sequence | 751358.28 | 2489.90 |
| concurrent | numeric | encode | 1088694.37 | 93921.44 |
| concurrent | numeric | decode | 725781.32 | 232769.45 |
| concurrent | numeric | create | 2038077.84 | 388944.82 |
| concurrent | numeric | load | 3447355.13 | 555713.95 |
| concurrent | numeric | apply | 4612509.36 | 141273.14 |
| concurrent | numeric | receive | 7571845.71 | 147683.21 |
| concurrent | binary | sequence | 620930.63 | 4608.23 |
| concurrent | binary | encode | 34512.33 | 5631.61 |
| concurrent | binary | decode | 2326.66 | 725.08 |
| concurrent | binary | create | 2088964.92 | 361112.72 |
| concurrent | binary | load | 2196062.48 | 379680.93 |
| concurrent | binary | apply | 4198418.58 | 70832.28 |
| concurrent | binary | receive | 6384190.75 | 322166.70 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
