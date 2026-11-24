# Words benchmarks

2026-11-24T10:49:37.992Z · local run

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 27,045 | 152,753 | 234 |
| append | packed | 5.90 | 3.61 | 13.98 | 29,175 | 188,646 | 333 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 1,794 | 688 | 238 |
| prepend | packed | 5.90 | 3.61 | 13.99 | 30,197 | 1,143 | 254 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 439 | 205 | 80 |
| random | packed | 49.58 | 35.37 | 23.45 | 14,630 | 494 | 130 |
| concurrent | unpacked | 92.23 | 42.79 | 32.34 | 659 | 251 | 107 |
| concurrent | packed | 38.94 | 28.16 | 20.71 | 17,492 | 409 | 145 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 711.03 | 299.46 |
| append | numeric | encode | 36974.80 | 11867.90 |
| append | numeric | decode | 3088.42 | 697.74 |
| append | numeric | create | 3496.97 | 1712.62 |
| append | numeric | load | 6546.52 | 2397.95 |
| append | numeric | apply | 2092600.00 | 1284211.66 |
| append | numeric | receive | 4268683.33 | 5029327.88 |
| append | binary | sequence | 925.96 | 522.09 |
| append | binary | encode | 34276.03 | 4551.50 |
| append | binary | decode | 2550.58 | 256.16 |
| append | binary | create | 2068.77 | 285.87 |
| append | binary | load | 5300.92 | 1272.84 |
| append | binary | apply | 1454085.71 | 598651.62 |
| append | binary | receive | 3006947.06 | 5146223.53 |
| prepend | numeric | sequence | 439035.96 | 54360.44 |
| prepend | numeric | encode | 557512.22 | 47506.68 |
| prepend | numeric | decode | 212772.34 | 27597.59 |
| prepend | numeric | create | 824959.02 | 77208.64 |
| prepend | numeric | load | 1454440.00 | 68685.34 |
| prepend | numeric | apply | 2723036.84 | 245038.10 |
| prepend | numeric | receive | 4197425.00 | 724812.86 |
| prepend | binary | sequence | 447999.11 | 5147.24 |
| prepend | binary | encode | 33116.23 | 1098.33 |
| prepend | binary | decode | 2200.48 | 98.93 |
| prepend | binary | create | 819174.19 | 41896.66 |
| prepend | binary | load | 874693.10 | 68656.27 |
| prepend | binary | apply | 2443085.71 | 105839.17 |
| prepend | binary | receive | 3932384.62 | 28953.85 |
| random | numeric | sequence | 925369.09 | 46341.27 |
| random | numeric | encode | 2276795.45 | 167244.58 |
| random | numeric | decode | 1196661.90 | 477357.95 |
| random | numeric | create | 1915025.93 | 179877.87 |
| random | numeric | load | 4883181.82 | 761370.38 |
| random | numeric | apply | 8211428.57 | 280942.86 |
| random | numeric | receive | 12532250.00 | 1071060.00 |
| random | binary | sequence | 1029289.80 | 235751.23 |
| random | binary | encode | 68353.24 | 502.67 |
| random | binary | decode | 2287.98 | 637.39 |
| random | binary | create | 1990442.31 | 11930.00 |
| random | binary | load | 2024420.00 | 51607.69 |
| random | binary | apply | 6260000.00 | 117767.36 |
| random | binary | receive | 7686357.14 | 4855280.36 |
| concurrent | numeric | sequence | 811967.74 | 25276.92 |
| concurrent | numeric | encode | 1516805.88 | 23837.92 |
| concurrent | numeric | decode | 807243.55 | 73700.12 |
| concurrent | numeric | create | 1604603.13 | 364079.71 |
| concurrent | numeric | load | 3990669.23 | 810310.23 |
| concurrent | numeric | apply | 5874400.00 | 251308.33 |
| concurrent | numeric | receive | 9375333.33 | 45258.33 |
| concurrent | binary | sequence | 743401.47 | 15549.33 |
| concurrent | binary | encode | 57170.17 | 1533.93 |
| concurrent | binary | decode | 2246.93 | 564.16 |
| concurrent | binary | create | 2370259.09 | 468866.23 |
| concurrent | binary | load | 2445409.52 | 467037.19 |
| concurrent | binary | apply | 4885236.36 | 46118.18 |
| concurrent | binary | receive | 6903025.00 | 351147.32 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
