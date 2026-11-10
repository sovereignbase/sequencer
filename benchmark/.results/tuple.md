# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,054,985 | 1,632,937 | 0.79× |
| 2 | create.sequence | 642,127 | 590,581 | 0.92× |
| 2 | replace.random | 741,238 | 1,141,603 | 1.54× |
| 2 | apply.replace | 513,999 | 685,896 | 1.33× |
| 2 | apply.duplicate | 1,073,036 | 824,523 | 0.77× |
| 2 | merge.duplicate | 930,622 | 845,604 | 0.91× |
| 2 | length | 69,563,657 | 69,464,941 | 1.00× |
| 2 | value.random | 30,463,204 | 62,779,182 | 2.06× |
| 2 | values | 5,660,853 | 5,533,719 | 0.98× |
| 2 | sequence | 2,209,098 | 1,834,885 | 0.83× |
| 4 | create.empty | 1,864,772 | 1,729,458 | 0.93× |
| 4 | create.sequence | 509,509 | 529,024 | 1.04× |
| 4 | replace.random | 740,192 | 1,138,622 | 1.54× |
| 4 | apply.replace | 408,364 | 749,708 | 1.84× |
| 4 | apply.duplicate | 892,482 | 804,567 | 0.90× |
| 4 | merge.duplicate | 758,475 | 669,553 | 0.88× |
| 4 | length | 31,247,930 | 30,268,983 | 0.97× |
| 4 | value.random | 25,861,124 | 63,562,866 | 2.46× |
| 4 | values | 4,442,522 | 4,231,214 | 0.95× |
| 4 | sequence | 1,760,286 | 1,750,620 | 0.99× |
| 8 | create.empty | 1,965,747 | 1,709,528 | 0.87× |
| 8 | create.sequence | 373,644 | 424,436 | 1.14× |
| 8 | replace.random | 776,632 | 1,180,647 | 1.52× |
| 8 | apply.replace | 360,469 | 756,171 | 2.10× |
| 8 | apply.duplicate | 915,494 | 951,425 | 1.04× |
| 8 | merge.duplicate | 469,152 | 484,069 | 1.03× |
| 8 | length | 31,580,444 | 31,267,682 | 0.99× |
| 8 | value.random | 19,844,641 | 64,191,176 | 3.23× |
| 8 | values | 3,343,742 | 3,456,329 | 1.03× |
| 8 | sequence | 1,365,530 | 1,448,312 | 1.06× |
| 100 | create.empty | 1,863,647 | 1,753,165 | 0.94× |
| 100 | create.sequence | 68,482 | 92,911 | 1.36× |
| 100 | replace.random | 671,039 | 1,183,567 | 1.76× |
| 100 | apply.replace | 336,418 | 772,618 | 2.30× |
| 100 | apply.duplicate | 982,795 | 866,933 | 0.88× |
| 100 | merge.duplicate | 109,079 | 77,109 | 0.71× |
| 100 | length | 31,605,365 | 30,539,506 | 0.97× |
| 100 | value.random | 9,321,999 | 62,781,318 | 6.73× |
| 100 | values | 530,041 | 554,331 | 1.05× |
| 100 | sequence | 166,562 | 173,281 | 1.04× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.86 | 0.03 | 0.04 |
| 2 | Static tuple | 0.85 | 0.04 | 0.05 |
| 4 | Projection | 1.54 | 0.06 | 0.05 |
| 4 | Static tuple | 1.04 | 0.06 | 0.07 |
| 8 | Projection | 2.49 | 0.12 | 0.08 |
| 8 | Static tuple | 1.51 | 0.10 | 0.09 |
| 100 | Projection | 23.75 | 0.67 | 0.57 |
| 100 | Static tuple | 12.18 | 0.51 | 0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
