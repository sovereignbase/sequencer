# Tuple benchmarks

2026-11-24T10:48:59.150Z · local run

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,466,447 | 2,281,104 | 0.92× |
| 2 | create.sequence | 670,414 | 707,336 | 1.06× |
| 2 | replace.random | 890,266 | 1,160,063 | 1.30× |
| 2 | apply.replace | 529,783 | 794,765 | 1.50× |
| 2 | apply.duplicate | 1,422,220 | 1,392,754 | 0.98× |
| 2 | merge.duplicate | 1,089,976 | 1,094,078 | 1.00× |
| 2 | length | 36,132,801 | 33,416,165 | 0.92× |
| 2 | value.random | 30,119,010 | 53,596,746 | 1.78× |
| 2 | values | 9,431,978 | 8,604,302 | 0.91× |
| 2 | sequence | 2,186,377 | 2,009,516 | 0.92× |
| 4 | create.empty | 2,440,128 | 2,269,709 | 0.93× |
| 4 | create.sequence | 625,074 | 619,153 | 0.99× |
| 4 | replace.random | 924,093 | 1,494,621 | 1.62× |
| 4 | apply.replace | 588,859 | 964,755 | 1.64× |
| 4 | apply.duplicate | 1,607,692 | 1,584,441 | 0.99× |
| 4 | merge.duplicate | 1,004,465 | 938,945 | 0.93× |
| 4 | length | 35,428,421 | 34,220,421 | 0.97× |
| 4 | value.random | 23,387,943 | 50,819,167 | 2.17× |
| 4 | values | 6,591,692 | 7,079,986 | 1.07× |
| 4 | sequence | 2,001,043 | 1,710,900 | 0.86× |
| 8 | create.empty | 2,422,361 | 2,200,362 | 0.91× |
| 8 | create.sequence | 446,737 | 489,030 | 1.09× |
| 8 | replace.random | 894,716 | 1,542,476 | 1.72× |
| 8 | apply.replace | 586,050 | 951,459 | 1.62× |
| 8 | apply.duplicate | 1,485,449 | 1,610,273 | 1.08× |
| 8 | merge.duplicate | 656,773 | 628,684 | 0.96× |
| 8 | length | 33,045,784 | 34,073,469 | 1.03× |
| 8 | value.random | 17,055,331 | 49,881,755 | 2.92× |
| 8 | values | 4,151,055 | 4,546,779 | 1.10× |
| 8 | sequence | 1,421,733 | 1,328,574 | 0.93× |
| 100 | create.empty | 1,872,263 | 1,692,067 | 0.90× |
| 100 | create.sequence | 60,899 | 80,206 | 1.32× |
| 100 | replace.random | 806,509 | 1,523,735 | 1.89× |
| 100 | apply.replace | 565,152 | 976,821 | 1.73× |
| 100 | apply.duplicate | 1,616,405 | 1,576,032 | 0.98× |
| 100 | merge.duplicate | 111,603 | 77,725 | 0.70× |
| 100 | length | 32,422,955 | 30,799,381 | 0.95× |
| 100 | value.random | 10,804,386 | 45,055,943 | 4.17× |
| 100 | values | 475,247 | 595,229 | 1.25× |
| 100 | sequence | 135,481 | 160,249 | 1.18× |

## Memory and encoded size

| Indices | Mode | Estimated allocated memory (MiB) | MessagePack (KiB) | MessagePack + gzip (KiB) |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.0007 | 0.03 | 0.04 |
| 2 | Static tuple | 0.0007 | 0.04 | 0.05 |
| 4 | Projection | 0.0014 | 0.06 | 0.05 |
| 4 | Static tuple | 0.0009 | 0.06 | 0.07 |
| 8 | Projection | 0.0022 | 0.12 | 0.08 |
| 8 | Static tuple | 0.0014 | 0.10 | 0.09 |
| 100 | Projection | 0.0204 | 0.67 | 0.57 |
| 100 | Static tuple | 0.0111 | 0.51 | 0.35 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
