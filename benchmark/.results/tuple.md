# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,476,135 | 2,655,998 | 0.76× |
| 2 | create.sequence | 992,159 | 949,737 | 0.96× |
| 2 | replace.random | 1,199,876 | 2,254,294 | 1.88× |
| 2 | apply.replace | 834,696 | 1,217,987 | 1.46× |
| 2 | apply.duplicate | 2,225,268 | 2,210,675 | 0.99× |
| 2 | merge.duplicate | 1,652,989 | 1,579,576 | 0.96× |
| 2 | length | 292,959,124 | 304,308,563 | 1.04× |
| 2 | value.random | 46,955,540 | 82,639,924 | 1.76× |
| 2 | values | 10,068,614 | 11,512,769 | 1.14× |
| 2 | sequence | 4,337,130 | 4,360,580 | 1.01× |
| 4 | create.empty | 3,208,065 | 3,117,230 | 0.97× |
| 4 | create.sequence | 767,882 | 839,832 | 1.09× |
| 4 | replace.random | 1,247,469 | 2,269,395 | 1.82× |
| 4 | apply.replace | 659,832 | 1,328,454 | 2.01× |
| 4 | apply.duplicate | 2,136,861 | 2,041,106 | 0.96× |
| 4 | merge.duplicate | 1,349,447 | 1,206,140 | 0.89× |
| 4 | length | 307,707,284 | 307,920,169 | 1.00× |
| 4 | value.random | 37,339,480 | 79,791,340 | 2.14× |
| 4 | values | 9,568,997 | 9,801,167 | 1.02× |
| 4 | sequence | 3,491,009 | 3,488,439 | 1.00× |
| 8 | create.empty | 3,303,878 | 3,356,349 | 1.02× |
| 8 | create.sequence | 605,429 | 739,481 | 1.22× |
| 8 | replace.random | 1,247,804 | 2,359,787 | 1.89× |
| 8 | apply.replace | 600,430 | 1,323,641 | 2.20× |
| 8 | apply.duplicate | 2,166,126 | 2,195,473 | 1.01× |
| 8 | merge.duplicate | 901,400 | 893,388 | 0.99× |
| 8 | length | 221,616,314 | 216,144,772 | 0.98× |
| 8 | value.random | 29,256,259 | 81,010,275 | 2.77× |
| 8 | values | 6,907,406 | 7,005,788 | 1.01× |
| 8 | sequence | 2,639,141 | 2,850,690 | 1.08× |
| 100 | create.empty | 3,573,767 | 3,177,781 | 0.89× |
| 100 | create.sequence | 123,899 | 169,494 | 1.37× |
| 100 | replace.random | 1,098,558 | 2,262,969 | 2.06× |
| 100 | apply.replace | 562,035 | 1,291,286 | 2.30× |
| 100 | apply.duplicate | 2,117,402 | 2,067,559 | 0.98× |
| 100 | merge.duplicate | 209,871 | 144,547 | 0.69× |
| 100 | length | 226,832,409 | 224,676,075 | 0.99× |
| 100 | value.random | 13,579,432 | 85,281,839 | 6.28× |
| 100 | values | 908,129 | 1,006,045 | 1.11× |
| 100 | sequence | 267,384 | 308,418 | 1.15× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.98 | 0.03 | 0.04 |
| 2 | Static tuple | 0.90 | 0.04 | 0.05 |
| 4 | Projection | 1.57 | 0.06 | 0.05 |
| 4 | Static tuple | 1.09 | 0.06 | 0.07 |
| 8 | Projection | 2.52 | 0.12 | 0.08 |
| 8 | Static tuple | 1.55 | 0.10 | 0.09 |
| 100 | Projection | 23.78 | 0.67 | 0.57 |
| 100 | Static tuple | 12.23 | 0.51 | 0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
