# Words benchmarks

2026-11-24T12:48:43.054Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | unpacked | 5.90 | 3.61 | 22.88 | 64,429 | 325,897 | 565 |
| append | packed | 5.90 | 3.61 | 13.98 | 67,832 | 360,275 | 594 |
| prepend | unpacked | 40.07 | 18.07 | 22.94 | 3,999 | 1,214 | 425 |
| prepend | packed | 5.90 | 3.62 | 13.99 | 66,966 | 1,838 | 468 |
| random | unpacked | 138.05 | 57.31 | 39.88 | 944 | 373 | 153 |
| random | packed | 49.58 | 35.38 | 23.45 | 37,136 | 850 | 200 |
| concurrent | unpacked | 92.23 | 42.76 | 32.34 | 1,328 | 449 | 200 |
| concurrent | packed | 38.94 | 28.21 | 20.71 | 40,299 | 964 | 243 |

## API and transport latency

| Workload | Words | Operation | Median ns | IQR ns |
| --- | --- | --- | ---: | ---: |
| append | numeric | sequence | 457.57 | 88.93 |
| append | numeric | encode | 15520.94 | 906.18 |
| append | numeric | decode | 1286.19 | 169.27 |
| append | numeric | create | 1239.77 | 96.83 |
| append | numeric | load | 3068.45 | 116.27 |
| append | numeric | apply | 865483.07 | 86563.48 |
| append | numeric | receive | 1768909.17 | 23142.71 |
| append | binary | sequence | 439.61 | 70.92 |
| append | binary | encode | 14742.21 | 868.25 |
| append | binary | decode | 1008.87 | 246.82 |
| append | binary | create | 1314.45 | 129.00 |
| append | binary | load | 2775.65 | 54.96 |
| append | binary | apply | 895849.75 | 57929.45 |
| append | binary | receive | 1682109.03 | 100685.02 |
| prepend | numeric | sequence | 222773.76 | 8850.60 |
| prepend | numeric | encode | 250037.26 | 42764.46 |
| prepend | numeric | decode | 92998.56 | 7436.65 |
| prepend | numeric | create | 513469.11 | 4042.34 |
| prepend | numeric | load | 823975.90 | 19457.16 |
| prepend | numeric | apply | 1361271.35 | 56470.01 |
| prepend | numeric | receive | 2354404.77 | 36009.09 |
| prepend | binary | sequence | 218919.52 | 3676.24 |
| prepend | binary | encode | 14932.95 | 118.85 |
| prepend | binary | decode | 1226.25 | 145.90 |
| prepend | binary | create | 524599.99 | 2387.56 |
| prepend | binary | load | 544143.49 | 4730.71 |
| prepend | binary | apply | 1318861.05 | 75202.22 |
| prepend | binary | receive | 2135412.21 | 12795.85 |
| random | numeric | sequence | 635921.38 | 10519.32 |
| random | numeric | encode | 1058827.40 | 14827.05 |
| random | numeric | decode | 689515.95 | 37206.00 |
| random | numeric | create | 1047411.04 | 8504.78 |
| random | numeric | load | 2679376.16 | 47800.26 |
| random | numeric | apply | 4612431.91 | 251599.57 |
| random | numeric | receive | 6516468.00 | 41627.25 |
| random | binary | sequence | 472886.22 | 1664.19 |
| random | binary | encode | 26928.33 | 2521.72 |
| random | binary | decode | 947.28 | 362.09 |
| random | binary | create | 1131944.31 | 2543.06 |
| random | binary | load | 1175803.63 | 9029.02 |
| random | binary | apply | 3765477.93 | 56175.93 |
| random | binary | receive | 5002085.60 | 153122.66 |
| concurrent | numeric | sequence | 486065.78 | 7172.89 |
| concurrent | numeric | encode | 753009.04 | 42927.29 |
| concurrent | numeric | decode | 476313.84 | 7218.56 |
| concurrent | numeric | create | 967560.31 | 407894.82 |
| concurrent | numeric | load | 2227386.35 | 395898.99 |
| concurrent | numeric | apply | 3401790.80 | 45649.20 |
| concurrent | numeric | receive | 5010712.70 | 10983.60 |
| concurrent | binary | sequence | 383688.23 | 1537.65 |
| concurrent | binary | encode | 24814.66 | 579.52 |
| concurrent | binary | decode | 1122.72 | 290.35 |
| concurrent | binary | create | 1006133.76 | 19557.00 |
| concurrent | binary | load | 1037524.88 | 24299.89 |
| concurrent | binary | apply | 3110808.94 | 41261.73 |
| concurrent | binary | receive | 4119912.62 | 150314.24 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.
