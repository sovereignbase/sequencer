# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,984,596 | 2,880,778 | 0.97× |
| 2 | create.sequence | 988,936 | 935,200 | 0.95× |
| 2 | replace.random | 1,006,509 | 2,361,673 | 2.35× |
| 2 | apply.replace | 733,725 | 1,377,365 | 1.88× |
| 2 | apply.duplicate | 3,002,098 | 2,969,601 | 0.99× |
| 2 | merge.duplicate | 1,863,930 | 1,723,465 | 0.92× |
| 2 | length | 95,766,164 | 98,212,669 | 1.03× |
| 2 | value.random | 41,731,045 | 77,229,482 | 1.85× |
| 2 | values | 14,668,991 | 14,371,432 | 0.98× |
| 2 | sequence | 3,936,860 | 3,586,044 | 0.91× |
| 4 | create.empty | 3,043,560 | 2,714,707 | 0.89× |
| 4 | create.sequence | 758,390 | 813,234 | 1.07× |
| 4 | replace.random | 1,177,001 | 2,296,066 | 1.95× |
| 4 | apply.replace | 574,055 | 1,338,316 | 2.33× |
| 4 | apply.duplicate | 3,090,002 | 2,924,302 | 0.95× |
| 4 | merge.duplicate | 1,356,306 | 1,202,513 | 0.89× |
| 4 | length | 88,165,606 | 94,620,324 | 1.07× |
| 4 | value.random | 33,213,185 | 75,074,993 | 2.26× |
| 4 | values | 9,581,116 | 10,638,996 | 1.11× |
| 4 | sequence | 3,295,411 | 3,189,570 | 0.97× |
| 8 | create.empty | 3,112,436 | 2,806,532 | 0.90× |
| 8 | create.sequence | 573,428 | 661,632 | 1.15× |
| 8 | replace.random | 1,139,984 | 2,236,021 | 1.96× |
| 8 | apply.replace | 512,594 | 1,366,643 | 2.67× |
| 8 | apply.duplicate | 3,053,552 | 2,949,048 | 0.97× |
| 8 | merge.duplicate | 839,125 | 815,582 | 0.97× |
| 8 | length | 49,100,177 | 52,058,653 | 1.06× |
| 8 | value.random | 25,782,250 | 75,675,133 | 2.94× |
| 8 | values | 6,545,363 | 6,969,650 | 1.06× |
| 8 | sequence | 2,259,224 | 2,477,635 | 1.10× |
| 100 | create.empty | 2,933,906 | 2,588,939 | 0.88× |
| 100 | create.sequence | 96,461 | 125,967 | 1.31× |
| 100 | replace.random | 950,523 | 2,398,159 | 2.52× |
| 100 | apply.replace | 474,383 | 1,477,357 | 3.11× |
| 100 | apply.duplicate | 2,957,224 | 2,961,413 | 1.00× |
| 100 | merge.duplicate | 163,676 | 115,165 | 0.70× |
| 100 | length | 51,835,042 | 51,329,258 | 0.99× |
| 100 | value.random | 11,662,772 | 76,202,273 | 6.53× |
| 100 | values | 735,901 | 807,881 | 1.10× |
| 100 | sequence | 208,042 | 231,079 | 1.11× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.80 | 0.03 | 0.04 |
| 2 | Static tuple | 0.79 | 0.04 | 0.05 |
| 4 | Projection | 1.45 | 0.06 | 0.05 |
| 4 | Static tuple | 0.96 | 0.06 | 0.07 |
| 8 | Projection | 2.36 | 0.12 | 0.08 |
| 8 | Static tuple | 1.40 | 0.10 | 0.09 |
| 100 | Projection | 22.54 | 0.67 | 0.57 |
| 100 | Static tuple | 11.35 | 0.51 | 0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
