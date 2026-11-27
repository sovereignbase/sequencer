# Tuple benchmarks

2026-11-27T16:35:13.504Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,022,133 | 2,696,501 | 0.89× |
| 2 | create.sequence | 887,618 | 787,672 | 0.89× |
| 2 | replace.random | 1,269,871 | 1,697,620 | 1.34× |
| 2 | apply.replace | 754,444 | 1,140,975 | 1.51× |
| 2 | apply.duplicate | 2,001,674 | 2,024,246 | 1.01× |
| 2 | merge.duplicate | 1,293,092 | 1,326,036 | 1.03× |
| 2 | length | 74,944,619 | 72,679,898 | 0.97× |
| 2 | value.random | 34,410,875 | 59,171,604 | 1.72× |
| 2 | values | 12,224,457 | 12,235,026 | 1.00× |
| 2 | sequence | 4,263,012 | 3,895,913 | 0.91× |
| 4 | create.empty | 2,865,256 | 2,745,646 | 0.96× |
| 4 | create.sequence | 673,803 | 689,055 | 1.02× |
| 4 | replace.random | 1,082,679 | 1,639,732 | 1.51× |
| 4 | apply.replace | 654,657 | 1,115,408 | 1.70× |
| 4 | apply.duplicate | 2,125,171 | 1,929,459 | 0.91× |
| 4 | merge.duplicate | 973,787 | 974,203 | 1.00× |
| 4 | length | 42,040,759 | 42,399,980 | 1.01× |
| 4 | value.random | 27,779,695 | 62,754,762 | 2.26× |
| 4 | values | 8,179,023 | 8,323,491 | 1.02× |
| 4 | sequence | 3,112,605 | 3,202,175 | 1.03× |
| 8 | create.empty | 2,986,012 | 2,735,877 | 0.92× |
| 8 | create.sequence | 467,174 | 510,945 | 1.09× |
| 8 | replace.random | 973,164 | 1,637,181 | 1.68× |
| 8 | apply.replace | 643,235 | 1,146,295 | 1.78× |
| 8 | apply.duplicate | 1,966,650 | 2,040,449 | 1.04× |
| 8 | merge.duplicate | 711,804 | 603,381 | 0.85× |
| 8 | length | 43,058,183 | 41,832,052 | 0.97× |
| 8 | value.random | 21,790,134 | 61,974,904 | 2.84× |
| 8 | values | 5,265,034 | 5,523,493 | 1.05× |
| 8 | sequence | 2,086,001 | 2,298,423 | 1.10× |
| 100 | create.empty | 2,752,669 | 2,516,172 | 0.91× |
| 100 | create.sequence | 78,379 | 86,318 | 1.10× |
| 100 | replace.random | 1,025,051 | 1,645,546 | 1.61× |
| 100 | apply.replace | 669,202 | 1,141,603 | 1.71× |
| 100 | apply.duplicate | 1,946,553 | 2,018,447 | 1.04× |
| 100 | merge.duplicate | 128,808 | 85,152 | 0.66× |
| 100 | length | 43,584,028 | 41,412,768 | 0.95× |
| 100 | value.random | 14,960,938 | 60,339,511 | 4.03× |
| 100 | values | 593,600 | 733,113 | 1.24× |
| 100 | sequence | 191,456 | 208,053 | 1.09× |

## Memory and encoded size

| Indices | Mode | Estimated allocated memory (MiB) | MessagePack (KiB) | MessagePack + gzip (KiB) |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.0006 | 0.03 | 0.04 |
| 2 | Static tuple | 0.0007 | 0.04 | 0.05 |
| 4 | Projection | 0.0013 | 0.06 | 0.05 |
| 4 | Static tuple | 0.0009 | 0.06 | 0.07 |
| 8 | Projection | 0.0022 | 0.12 | 0.08 |
| 8 | Static tuple | 0.0013 | 0.10 | 0.09 |
| 100 | Projection | 0.0196 | 0.67 | 0.57 |
| 100 | Static tuple | 0.0110 | 0.51 | 0.35 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
