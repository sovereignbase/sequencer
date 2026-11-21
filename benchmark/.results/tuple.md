# Tuple benchmarks

2026-11-21T14:00:45.955Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,090,626 | 2,873,101 | 0.93× |
| 2 | create.sequence | 805,368 | 715,568 | 0.89× |
| 2 | replace.random | 1,077,977 | 1,661,426 | 1.54× |
| 2 | apply.replace | 666,437 | 1,013,541 | 1.52× |
| 2 | apply.duplicate | 1,821,154 | 1,898,713 | 1.04× |
| 2 | merge.duplicate | 1,234,985 | 1,269,877 | 1.03× |
| 2 | length | 71,721,814 | 74,447,295 | 1.04× |
| 2 | value.random | 37,057,756 | 60,969,086 | 1.65× |
| 2 | values | 10,730,117 | 12,106,429 | 1.13× |
| 2 | sequence | 2,606,629 | 2,415,989 | 0.93× |
| 4 | create.empty | 2,950,576 | 2,594,010 | 0.88× |
| 4 | create.sequence | 631,317 | 618,666 | 0.98× |
| 4 | replace.random | 856,608 | 1,629,030 | 1.90× |
| 4 | apply.replace | 609,957 | 1,087,129 | 1.78× |
| 4 | apply.duplicate | 1,830,573 | 1,880,541 | 1.03× |
| 4 | merge.duplicate | 1,092,630 | 997,768 | 0.91× |
| 4 | length | 34,725,111 | 40,744,826 | 1.17× |
| 4 | value.random | 26,155,558 | 61,256,256 | 2.34× |
| 4 | values | 7,508,196 | 8,385,782 | 1.12× |
| 4 | sequence | 2,525,384 | 2,197,253 | 0.87× |
| 8 | create.empty | 2,843,247 | 2,657,911 | 0.93× |
| 8 | create.sequence | 478,699 | 496,372 | 1.04× |
| 8 | replace.random | 913,893 | 1,544,792 | 1.69× |
| 8 | apply.replace | 617,312 | 1,059,039 | 1.72× |
| 8 | apply.duplicate | 1,798,696 | 1,887,127 | 1.05× |
| 8 | merge.duplicate | 625,131 | 700,326 | 1.12× |
| 8 | length | 41,317,281 | 41,833,992 | 1.01× |
| 8 | value.random | 20,611,094 | 62,737,990 | 3.04× |
| 8 | values | 5,249,369 | 5,896,104 | 1.12× |
| 8 | sequence | 1,768,204 | 1,680,375 | 0.95× |
| 100 | create.empty | 2,596,193 | 2,584,913 | 1.00× |
| 100 | create.sequence | 84,999 | 88,390 | 1.04× |
| 100 | replace.random | 900,044 | 1,655,061 | 1.84× |
| 100 | apply.replace | 615,624 | 1,096,672 | 1.78× |
| 100 | apply.duplicate | 1,874,381 | 1,792,390 | 0.96× |
| 100 | merge.duplicate | 125,245 | 91,715 | 0.73× |
| 100 | length | 42,563,130 | 39,218,560 | 0.92× |
| 100 | value.random | 14,418,477 | 61,815,857 | 4.29× |
| 100 | values | 572,993 | 704,053 | 1.23× |
| 100 | sequence | 180,634 | 190,351 | 1.05× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
