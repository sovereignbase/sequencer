# Words benchmarks

2026-11-22T17:11:59.308Z · local run

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 30,831 | 173,799 | 239 |
| append | packed | 5.90 | 3.61 | 13.98 | 35,374 | 203,519 | 319 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 1,856 | 688 | 228 |
| prepend | packed | 5.90 | 3.61 | 13.99 | 33,095 | 1,284 | 230 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 513 | 278 | 79 |
| random | packed | 49.58 | 35.37 | 23.45 | 14,299 | 542 | 131 |
| concurrent | unpacked | 92.22 | 42.81 | 32.34 | 691 | 290 | 109 |
| concurrent | packed | 38.94 | 28.16 | 20.71 | 18,337 | 466 | 139 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 665.74 | 178.71 |
| append | numeric | encode | 32435.08 | 2619.59 |
| append | numeric | decode | 2531.41 | 479.22 |
| append | numeric | create | 1866.88 | 133.64 |
| append | numeric | load | 5753.79 | 491.93 |
| append | numeric | apply | 2192700.00 | 286396.92 |
| append | numeric | receive | 4177816.67 | 2347187.82 |
| append | binary | sequence | 844.64 | 79.56 |
| append | binary | encode | 28269.64 | 3055.02 |
| append | binary | decode | 1889.29 | 229.94 |
| append | binary | create | 1879.34 | 195.64 |
| append | binary | load | 4913.55 | 673.33 |
| append | binary | apply | 1626916.13 | 81117.41 |
| append | binary | receive | 3130550.00 | 102742.28 |
| prepend | numeric | sequence | 392634.37 | 20119.49 |
| prepend | numeric | encode | 538905.38 | 34585.18 |
| prepend | numeric | decode | 161330.65 | 17799.20 |
| prepend | numeric | create | 879603.51 | 77326.26 |
| prepend | numeric | load | 1454477.14 | 5689692.95 |
| prepend | numeric | apply | 2765089.47 | 342492.11 |
| prepend | numeric | receive | 4388658.33 | 403800.35 |
| prepend | binary | sequence | 409918.03 | 9173.90 |
| prepend | binary | encode | 30215.95 | 436.77 |
| prepend | binary | decode | 2112.57 | 77.80 |
| prepend | binary | create | 772387.69 | 17835.19 |
| prepend | binary | load | 778592.31 | 55841.50 |
| prepend | binary | apply | 2539855.00 | 109431.36 |
| prepend | binary | receive | 4340583.33 | 389516.67 |
| random | numeric | sequence | 917714.55 | 65983.30 |
| random | numeric | encode | 1950423.08 | 81492.31 |
| random | numeric | decode | 695850.00 | 212193.84 |
| random | numeric | create | 1594228.13 | 45238.91 |
| random | numeric | load | 3600542.86 | 65715.00 |
| random | numeric | apply | 7924328.57 | 234521.43 |
| random | numeric | receive | 12602575.00 | 983352.50 |
| random | binary | sequence | 924460.00 | 62821.09 |
| random | binary | encode | 69934.55 | 2517.40 |
| random | binary | decode | 1620.94 | 314.23 |
| random | binary | create | 1708283.33 | 13333.10 |
| random | binary | load | 1845482.14 | 78466.67 |
| random | binary | apply | 6151444.44 | 383808.33 |
| random | binary | receive | 7626528.57 | 158578.57 |
| concurrent | numeric | sequence | 760680.30 | 67849.79 |
| concurrent | numeric | encode | 1446865.71 | 40004.42 |
| concurrent | numeric | decode | 696613.89 | 92945.00 |
| concurrent | numeric | create | 2006092.00 | 271703.70 |
| concurrent | numeric | load | 3445606.67 | 500932.50 |
| concurrent | numeric | apply | 5830000.00 | 236319.44 |
| concurrent | numeric | receive | 9144616.67 | 211291.67 |
| concurrent | binary | sequence | 693000.00 | 11004.95 |
| concurrent | binary | encode | 54535.01 | 5897.86 |
| concurrent | binary | decode | 2361.99 | 359.91 |
| concurrent | binary | create | 2116258.33 | 338783.95 |
| concurrent | binary | load | 2146800.00 | 385826.79 |
| concurrent | binary | apply | 5571955.56 | 391885.91 |
| concurrent | binary | receive | 7208857.14 | 827925.00 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
