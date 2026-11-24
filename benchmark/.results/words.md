# Words benchmarks

2026-11-24T12:57:19.818Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 100,112 | 384,139 | 675 |
| append | packed | 5.90 | 3.61 | 13.98 | 96,240 | 424,809 | 812 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 5,187 | 1,488 | 543 |
| prepend | packed | 5.90 | 3.62 | 13.99 | 91,660 | 2,387 | 620 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 1,236 | 460 | 206 |
| random | packed | 49.58 | 35.38 | 23.45 | 49,618 | 1,088 | 264 |
| concurrent | unpacked | 92.24 | 42.71 | 32.34 | 1,679 | 439 | 263 |
| concurrent | packed | 38.94 | 28.17 | 20.71 | 58,507 | 773 | 296 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 313.74 | 145.67 |
| append | numeric | encode | 9988.82 | 1140.08 |
| append | numeric | decode | 1413.59 | 73.45 |
| append | numeric | create | 1168.97 | 86.01 |
| append | numeric | load | 2603.22 | 53.65 |
| append | numeric | apply | 788110.27 | 21090.80 |
| append | numeric | receive | 1482500.15 | 102278.69 |
| append | binary | sequence | 400.84 | 64.04 |
| append | binary | encode | 10390.69 | 320.94 |
| append | binary | decode | 1258.95 | 339.68 |
| append | binary | create | 1084.85 | 89.01 |
| append | binary | load | 2354.00 | 74.49 |
| append | binary | apply | 675917.24 | 63694.25 |
| append | binary | receive | 1232045.95 | 159961.22 |
| prepend | numeric | sequence | 178833.65 | 4094.32 |
| prepend | numeric | encode | 192777.03 | 11699.54 |
| prepend | numeric | decode | 64189.01 | 2406.25 |
| prepend | numeric | create | 410743.71 | 10111.51 |
| prepend | numeric | load | 672065.67 | 16871.77 |
| prepend | numeric | apply | 1062071.94 | 64867.65 |
| prepend | numeric | receive | 1840149.43 | 118153.93 |
| prepend | binary | sequence | 189479.33 | 37847.31 |
| prepend | binary | encode | 10909.94 | 599.17 |
| prepend | binary | decode | 1387.34 | 407.37 |
| prepend | binary | create | 417252.29 | 13053.37 |
| prepend | binary | load | 418860.73 | 14218.78 |
| prepend | binary | apply | 973547.13 | 56399.36 |
| prepend | binary | receive | 1613545.87 | 95771.22 |
| random | numeric | sequence | 531534.03 | 8812.22 |
| random | numeric | encode | 809000.58 | 115951.07 |
| random | numeric | decode | 518019.19 | 51910.98 |
| random | numeric | create | 831289.90 | 32386.68 |
| random | numeric | load | 2175905.91 | 63015.81 |
| random | numeric | apply | 3488136.07 | 106577.69 |
| random | numeric | receive | 4862530.55 | 150286.89 |
| random | binary | sequence | 398214.43 | 162826.96 |
| random | binary | encode | 20153.92 | 2309.71 |
| random | binary | decode | 986.34 | 166.78 |
| random | binary | create | 906812.20 | 63848.79 |
| random | binary | load | 919289.05 | 1947.93 |
| random | binary | apply | 2871016.22 | 16953.53 |
| random | binary | receive | 3793334.36 | 337514.27 |
| concurrent | numeric | sequence | 430604.05 | 11280.55 |
| concurrent | numeric | encode | 595636.36 | 33914.62 |
| concurrent | numeric | decode | 398384.40 | 29639.68 |
| concurrent | numeric | create | 1215286.50 | 31828.52 |
| concurrent | numeric | load | 2275410.77 | 73565.14 |
| concurrent | numeric | apply | 2719177.42 | 35208.03 |
| concurrent | numeric | receive | 3804790.00 | 840356.39 |
| concurrent | binary | sequence | 312348.43 | 760.77 |
| concurrent | binary | encode | 17092.11 | 211.78 |
| concurrent | binary | decode | 747.06 | 43.93 |
| concurrent | binary | create | 1198123.81 | 236033.04 |
| concurrent | binary | load | 1294271.21 | 282917.58 |
| concurrent | binary | apply | 2429383.33 | 65254.86 |
| concurrent | binary | receive | 3379616.20 | 92086.44 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
