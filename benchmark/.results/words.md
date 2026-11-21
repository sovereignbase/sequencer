# Words benchmarks

2026-11-21T14:21:22.297Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 92,074 | 339,077 | 688 |
| append | packed | 5.90 | 3.61 | 13.98 | 94,075 | 418,427 | 837 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 5,270 | 1,472 | 579 |
| prepend | packed | 17.62 | 3.67 | 14.99 | 79,677 | 2,211 | 625 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 1,178 | 360 | 193 |
| random | packed | 54.84 | 36.96 | 29.60 | 43,066 | 1,067 | 227 |
| concurrent | unpacked | 92.24 | 42.77 | 32.34 | 1,617 | 427 | 243 |
| concurrent | packed | 42.46 | 29.09 | 23.69 | 49,978 | 1,202 | 276 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 566.65 | 132.01 |
| append | numeric | encode | 10860.84 | 901.43 |
| append | numeric | decode | 1410.49 | 125.84 |
| append | numeric | create | 1087.78 | 83.01 |
| append | numeric | load | 2949.18 | 150.92 |
| append | numeric | apply | 696300.57 | 9891.06 |
| append | numeric | receive | 1453261.20 | 16014.67 |
| append | binary | sequence | 580.54 | 117.19 |
| append | binary | encode | 10629.82 | 596.93 |
| append | binary | decode | 1118.88 | 152.79 |
| append | binary | create | 1110.83 | 149.88 |
| append | binary | load | 2389.90 | 67.88 |
| append | binary | apply | 636025.22 | 108602.26 |
| append | binary | receive | 1195027.21 | 55425.34 |
| prepend | numeric | sequence | 191380.01 | 8424.42 |
| prepend | numeric | encode | 189760.36 | 10574.06 |
| prepend | numeric | decode | 67247.71 | 6685.99 |
| prepend | numeric | create | 422803.52 | 13799.92 |
| prepend | numeric | load | 679172.22 | 49266.48 |
| prepend | numeric | apply | 995038.37 | 26901.44 |
| prepend | numeric | receive | 1727364.21 | 13879.62 |
| prepend | binary | sequence | 193078.25 | 2732.20 |
| prepend | binary | encode | 12550.66 | 472.51 |
| prepend | binary | decode | 1054.44 | 212.62 |
| prepend | binary | create | 442010.68 | 6869.81 |
| prepend | binary | load | 452318.14 | 13324.35 |
| prepend | binary | apply | 949387.83 | 12445.71 |
| prepend | binary | receive | 1600964.16 | 65604.84 |
| random | numeric | sequence | 571396.36 | 10717.00 |
| random | numeric | encode | 848834.27 | 155707.16 |
| random | numeric | decode | 551268.40 | 17837.33 |
| random | numeric | create | 851612.63 | 16818.86 |
| random | numeric | load | 2778960.70 | 501562.43 |
| random | numeric | apply | 3924400.38 | 147457.72 |
| random | numeric | receive | 5178891.40 | 160219.25 |
| random | binary | sequence | 449964.49 | 12803.08 |
| random | binary | encode | 23220.22 | 236.52 |
| random | binary | decode | 987.60 | 210.62 |
| random | binary | create | 930334.72 | 17127.05 |
| random | binary | load | 936998.44 | 21038.05 |
| random | binary | apply | 3435624.13 | 123171.98 |
| random | binary | receive | 4400770.83 | 187567.27 |
| concurrent | numeric | sequence | 450645.37 | 65170.43 |
| concurrent | numeric | encode | 618535.81 | 30506.16 |
| concurrent | numeric | decode | 395289.85 | 3410.08 |
| concurrent | numeric | create | 1232753.37 | 227585.64 |
| concurrent | numeric | load | 2344250.27 | 280433.56 |
| concurrent | numeric | apply | 2920413.22 | 103889.89 |
| concurrent | numeric | receive | 4110055.85 | 197054.54 |
| concurrent | binary | sequence | 357171.31 | 26171.75 |
| concurrent | binary | encode | 20008.62 | 1103.57 |
| concurrent | binary | decode | 1126.97 | 189.88 |
| concurrent | binary | create | 814508.58 | 20355.91 |
| concurrent | binary | load | 831777.30 | 24784.60 |
| concurrent | binary | apply | 2701192.95 | 37813.63 |
| concurrent | binary | receive | 3623764.50 | 99234.86 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
