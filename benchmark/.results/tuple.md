# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,680,163 | 3,371,290 | 0.92× |
| 2 | create.sequence | 1,034,777 | 942,194 | 0.91× |
| 2 | replace.random | 1,342,796 | 2,464,250 | 1.84× |
| 2 | apply.replace | 939,828 | 1,342,049 | 1.43× |
| 2 | apply.duplicate | 2,189,748 | 2,472,460 | 1.13× |
| 2 | merge.duplicate | 1,747,963 | 1,494,954 | 0.86× |
| 2 | length | 127,505,839 | 126,445,533 | 0.99× |
| 2 | value.random | 52,531,115 | 107,034,213 | 2.04× |
| 2 | values | 12,300,830 | 12,772,672 | 1.04× |
| 2 | sequence | 4,438,028 | 4,178,941 | 0.94× |
| 4 | create.empty | 3,477,977 | 3,283,865 | 0.94× |
| 4 | create.sequence | 808,967 | 845,087 | 1.04× |
| 4 | replace.random | 1,315,320 | 2,384,826 | 1.81× |
| 4 | apply.replace | 685,554 | 1,389,832 | 2.03× |
| 4 | apply.duplicate | 2,285,547 | 1,993,471 | 0.87× |
| 4 | merge.duplicate | 1,364,845 | 1,231,590 | 0.90× |
| 4 | length | 130,366,860 | 129,055,744 | 0.99× |
| 4 | value.random | 39,011,507 | 102,813,179 | 2.64× |
| 4 | values | 9,888,413 | 10,619,833 | 1.07× |
| 4 | sequence | 3,317,537 | 3,898,731 | 1.18× |
| 8 | create.empty | 3,747,379 | 3,409,307 | 0.91× |
| 8 | create.sequence | 631,012 | 723,831 | 1.15× |
| 8 | replace.random | 1,312,218 | 2,482,251 | 1.89× |
| 8 | apply.replace | 653,852 | 1,281,210 | 1.96× |
| 8 | apply.duplicate | 2,339,166 | 2,277,584 | 0.97× |
| 8 | merge.duplicate | 874,373 | 860,097 | 0.98× |
| 8 | length | 49,723,089 | 50,076,025 | 1.01× |
| 8 | value.random | 29,609,387 | 106,896,482 | 3.61× |
| 8 | values | 6,811,267 | 7,530,112 | 1.11× |
| 8 | sequence | 2,904,980 | 3,315,118 | 1.14× |
| 100 | create.empty | 3,701,399 | 3,198,097 | 0.86× |
| 100 | create.sequence | 121,809 | 151,506 | 1.24× |
| 100 | replace.random | 1,121,205 | 2,544,838 | 2.27× |
| 100 | apply.replace | 555,843 | 1,327,691 | 2.39× |
| 100 | apply.duplicate | 2,364,100 | 2,295,762 | 0.97× |
| 100 | merge.duplicate | 187,718 | 137,616 | 0.73× |
| 100 | length | 48,635,333 | 49,858,646 | 1.03× |
| 100 | value.random | 12,917,939 | 105,872,242 | 8.20× |
| 100 | values | 974,992 | 1,113,889 | 1.14× |
| 100 | sequence | 279,396 | 311,985 | 1.12× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.84 | 0.03 | 0.04 |
| 2 | Static tuple | 0.84 | 0.04 | 0.05 |
| 4 | Projection | 1.51 | 0.06 | 0.05 |
| 4 | Static tuple | 1.02 | 0.06 | 0.07 |
| 8 | Projection | 2.45 | 0.12 | 0.08 |
| 8 | Static tuple | 1.49 | 0.10 | 0.09 |
| 100 | Projection | 23.34 | 0.67 | 0.57 |
| 100 | Static tuple | 12.16 | 0.51 | 0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
