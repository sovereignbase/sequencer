# Tuple benchmarks

2026-11-20T20:12:27.324Z · local run

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,135,297 | 1,722,356 | 0.81× |
| 2 | create.sequence | 636,052 | 574,370 | 0.90× |
| 2 | replace.random | 932,928 | 1,415,439 | 1.52× |
| 2 | apply.replace | 581,495 | 864,794 | 1.49× |
| 2 | apply.duplicate | 1,688,227 | 1,644,468 | 0.97× |
| 2 | merge.duplicate | 1,069,614 | 1,059,446 | 0.99× |
| 2 | length | 66,685,530 | 61,842,490 | 0.93× |
| 2 | value.random | 30,938,120 | 50,327,760 | 1.63× |
| 2 | values | 7,704,753 | 9,679,489 | 1.26× |
| 2 | sequence | 2,052,345 | 2,039,913 | 0.99× |
| 4 | create.empty | 2,327,273 | 2,281,946 | 0.98× |
| 4 | create.sequence | 569,071 | 554,927 | 0.98× |
| 4 | replace.random | 867,998 | 1,534,922 | 1.77× |
| 4 | apply.replace | 565,872 | 954,786 | 1.69× |
| 4 | apply.duplicate | 1,587,526 | 1,390,725 | 0.88× |
| 4 | merge.duplicate | 845,467 | 883,597 | 1.05× |
| 4 | length | 35,928,224 | 33,239,122 | 0.93× |
| 4 | value.random | 22,611,489 | 49,458,335 | 2.19× |
| 4 | values | 6,559,617 | 6,807,130 | 1.04× |
| 4 | sequence | 1,936,098 | 1,871,968 | 0.97× |
| 8 | create.empty | 2,339,455 | 2,198,995 | 0.94× |
| 8 | create.sequence | 391,043 | 432,983 | 1.11× |
| 8 | replace.random | 818,760 | 1,537,788 | 1.88× |
| 8 | apply.replace | 552,256 | 965,143 | 1.75× |
| 8 | apply.duplicate | 1,683,166 | 1,644,132 | 0.98× |
| 8 | merge.duplicate | 627,564 | 623,042 | 0.99× |
| 8 | length | 37,080,959 | 35,734,243 | 0.96× |
| 8 | value.random | 18,238,256 | 54,958,359 | 3.01× |
| 8 | values | 4,522,493 | 4,853,784 | 1.07× |
| 8 | sequence | 1,490,749 | 1,436,456 | 0.96× |
| 100 | create.empty | 2,276,236 | 2,177,045 | 0.96× |
| 100 | create.sequence | 71,539 | 83,188 | 1.16× |
| 100 | replace.random | 858,686 | 1,517,657 | 1.77× |
| 100 | apply.replace | 569,486 | 951,118 | 1.67× |
| 100 | apply.duplicate | 1,684,437 | 1,670,947 | 0.99× |
| 100 | merge.duplicate | 88,881 | 76,219 | 0.86× |
| 100 | length | 33,002,577 | 31,842,105 | 0.96× |
| 100 | value.random | 11,606,001 | 44,696,018 | 3.85× |
| 100 | values | 454,051 | 535,029 | 1.18× |
| 100 | sequence | 119,610 | 134,133 | 1.12× |

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
