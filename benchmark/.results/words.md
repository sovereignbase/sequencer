# Words benchmarks

2026-11-21T13:40:32.990Z · local run

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 14,659 | 105,475 | 128 |
| append | packed | 5.90 | 3.61 | 13.98 | 15,094 | 64,717 | 149 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 1,295 | 333 | 91 |
| prepend | packed | 17.62 | 3.67 | 14.99 | 17,431 | 747 | 109 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 237 | 112 | 38 |
| random | packed | 54.84 | 36.96 | 29.60 | 7,993 | 268 | 50 |
| concurrent | unpacked | 92.24 | 42.78 | 32.34 | 345 | 127 | 40 |
| concurrent | packed | 42.46 | 28.93 | 23.69 | 9,377 | 227 | 59 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 1493.43 | 316.73 |
| append | numeric | encode | 68215.28 | 13199.74 |
| append | numeric | decode | 4910.46 | 209.11 |
| append | numeric | create | 5360.50 | 2553.69 |
| append | numeric | load | 9480.93 | 4326.24 |
| append | numeric | apply | 3028452.94 | 1838945.96 |
| append | numeric | receive | 7802400.00 | 1553735.00 |
| append | binary | sequence | 1609.30 | 138.53 |
| append | binary | encode | 66252.32 | 8395.36 |
| append | binary | decode | 3546.55 | 1456.64 |
| append | binary | create | 3967.32 | 579.91 |
| append | binary | load | 15451.98 | 11361.96 |
| append | binary | apply | 3078652.94 | 1589084.50 |
| append | binary | receive | 6721275.00 | 1402601.92 |
| prepend | numeric | sequence | 814332.26 | 169520.67 |
| prepend | numeric | encode | 772495.38 | 16484.63 |
| prepend | numeric | decode | 379312.12 | 92699.11 |
| prepend | numeric | create | 1722100.00 | 319799.68 |
| prepend | numeric | load | 3001700.00 | 264422.55 |
| prepend | numeric | apply | 4869181.82 | 322596.67 |
| prepend | numeric | receive | 10964260.00 | 404580.00 |
| prepend | binary | sequence | 761345.45 | 27922.21 |
| prepend | binary | encode | 57368.92 | 16642.68 |
| prepend | binary | decode | 2779.93 | 1067.36 |
| prepend | binary | create | 1372583.78 | 212809.58 |
| prepend | binary | load | 1338481.58 | 149228.75 |
| prepend | binary | apply | 4249925.00 | 805455.68 |
| prepend | binary | receive | 9213133.33 | 2564255.36 |
| random | numeric | sequence | 1685630.00 | 565217.05 |
| random | numeric | encode | 4216991.67 | 306233.33 |
| random | numeric | decode | 1521196.97 | 243941.76 |
| random | numeric | create | 3429640.00 | 449751.98 |
| random | numeric | load | 8896733.33 | 1510962.86 |
| random | numeric | apply | 18699200.00 | 5307125.00 |
| random | numeric | receive | 26481150.00 | 6879400.00 |
| random | binary | sequence | 1780003.45 | 90619.83 |
| random | binary | encode | 125110.25 | 7008.41 |
| random | binary | decode | 2836.06 | 314.06 |
| random | binary | create | 3435680.00 | 636552.14 |
| random | binary | load | 3737357.14 | 1279134.09 |
| random | binary | apply | 13537950.00 | 1084600.00 |
| random | binary | receive | 20072900.00 | 6054875.00 |
| concurrent | numeric | sequence | 1668466.67 | 213125.42 |
| concurrent | numeric | encode | 2901855.56 | 84893.79 |
| concurrent | numeric | decode | 1456391.43 | 144179.44 |
| concurrent | numeric | create | 2960294.12 | 1160997.73 |
| concurrent | numeric | load | 7883971.43 | 1005712.50 |
| concurrent | numeric | apply | 10553180.00 | 1994598.75 |
| concurrent | numeric | receive | 25057200.00 | 6232008.33 |
| concurrent | binary | sequence | 1436040.00 | 124466.74 |
| concurrent | binary | encode | 106648.40 | 19556.33 |
| concurrent | binary | decode | 3600.44 | 1665.12 |
| concurrent | binary | create | 4241150.00 | 1019109.57 |
| concurrent | binary | load | 4402733.33 | 673853.92 |
| concurrent | binary | apply | 10997560.00 | 1797794.29 |
| concurrent | binary | receive | 17069633.33 | 1104233.33 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
