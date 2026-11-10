# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,095,881 | 1,562,217 | 0.75× |
| 2 | create.sequence | 670,107 | 586,639 | 0.88× |
| 2 | replace.random | 714,150 | 1,124,107 | 1.57× |
| 2 | apply.replace | 562,920 | 667,889 | 1.19× |
| 2 | apply.duplicate | 1,042,975 | 912,161 | 0.87× |
| 2 | merge.duplicate | 882,459 | 867,700 | 0.98× |
| 2 | length | 68,941,423 | 67,334,422 | 0.98× |
| 2 | value.random | 31,862,616 | 62,569,754 | 1.96× |
| 2 | values | 5,294,804 | 5,630,842 | 1.06× |
| 2 | sequence | 2,111,815 | 1,957,094 | 0.93× |
| 4 | create.empty | 2,004,602 | 1,781,441 | 0.89× |
| 4 | create.sequence | 505,818 | 531,468 | 1.05× |
| 4 | replace.random | 806,417 | 1,157,048 | 1.43× |
| 4 | apply.replace | 395,916 | 744,964 | 1.88× |
| 4 | apply.duplicate | 855,475 | 848,748 | 0.99× |
| 4 | merge.duplicate | 757,805 | 713,726 | 0.94× |
| 4 | length | 30,929,153 | 31,863,217 | 1.03× |
| 4 | value.random | 25,658,971 | 59,153,831 | 2.31× |
| 4 | values | 3,867,844 | 4,168,548 | 1.08× |
| 4 | sequence | 1,868,149 | 1,612,922 | 0.86× |
| 8 | create.empty | 2,075,593 | 1,753,632 | 0.84× |
| 8 | create.sequence | 378,708 | 431,517 | 1.14× |
| 8 | replace.random | 753,627 | 1,151,756 | 1.53× |
| 8 | apply.replace | 380,570 | 820,246 | 2.16× |
| 8 | apply.duplicate | 814,703 | 895,926 | 1.10× |
| 8 | merge.duplicate | 497,475 | 451,753 | 0.91× |
| 8 | length | 31,827,479 | 29,847,421 | 0.94× |
| 8 | value.random | 19,714,408 | 62,055,730 | 3.15× |
| 8 | values | 3,218,079 | 3,324,982 | 1.03× |
| 8 | sequence | 1,327,567 | 1,273,083 | 0.96× |
| 100 | create.empty | 1,966,860 | 1,724,601 | 0.88× |
| 100 | create.sequence | 68,464 | 92,577 | 1.35× |
| 100 | replace.random | 662,605 | 1,169,669 | 1.77× |
| 100 | apply.replace | 348,940 | 730,188 | 2.09× |
| 100 | apply.duplicate | 834,751 | 747,250 | 0.90× |
| 100 | merge.duplicate | 108,852 | 77,789 | 0.71× |
| 100 | length | 31,534,406 | 31,970,406 | 1.01× |
| 100 | value.random | 9,364,507 | 63,040,209 | 6.73× |
| 100 | values | 482,313 | 575,157 | 1.19× |
| 100 | sequence | 154,052 | 171,942 | 1.12× |

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
