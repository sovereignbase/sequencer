# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,030,641 | 1,623,783 | 0.80× |
| 2 | create.sequence | 641,597 | 586,505 | 0.91× |
| 2 | replace.random | 720,980 | 1,112,010 | 1.54× |
| 2 | apply.replace | 570,586 | 644,178 | 1.13× |
| 2 | apply.duplicate | 853,154 | 845,113 | 0.99× |
| 2 | merge.duplicate | 929,813 | 850,940 | 0.92× |
| 2 | length | 66,220,968 | 69,593,860 | 1.05× |
| 2 | value.random | 32,630,286 | 51,102,048 | 1.57× |
| 2 | values | 5,550,466 | 5,176,670 | 0.93× |
| 2 | sequence | 2,189,987 | 1,939,292 | 0.89× |
| 4 | create.empty | 1,957,418 | 1,824,118 | 0.93× |
| 4 | create.sequence | 500,541 | 523,887 | 1.05× |
| 4 | replace.random | 704,908 | 1,104,899 | 1.57× |
| 4 | apply.replace | 363,091 | 747,600 | 2.06× |
| 4 | apply.duplicate | 765,847 | 1,029,209 | 1.34× |
| 4 | merge.duplicate | 753,968 | 723,325 | 0.96× |
| 4 | length | 31,244,153 | 32,054,819 | 1.03× |
| 4 | value.random | 25,542,810 | 50,737,358 | 1.99× |
| 4 | values | 3,859,801 | 4,193,283 | 1.09× |
| 4 | sequence | 1,764,744 | 1,659,789 | 0.94× |
| 8 | create.empty | 1,894,329 | 1,841,593 | 0.97× |
| 8 | create.sequence | 373,806 | 432,468 | 1.16× |
| 8 | replace.random | 803,283 | 1,120,062 | 1.39× |
| 8 | apply.replace | 373,685 | 701,208 | 1.88× |
| 8 | apply.duplicate | 874,333 | 827,935 | 0.95× |
| 8 | merge.duplicate | 514,155 | 483,874 | 0.94× |
| 8 | length | 32,008,247 | 31,687,949 | 0.99× |
| 8 | value.random | 20,021,137 | 49,471,544 | 2.47× |
| 8 | values | 3,513,447 | 2,989,015 | 0.85× |
| 8 | sequence | 1,418,288 | 1,449,362 | 1.02× |
| 100 | create.empty | 1,937,366 | 1,773,927 | 0.92× |
| 100 | create.sequence | 68,603 | 100,482 | 1.46× |
| 100 | replace.random | 644,162 | 1,178,702 | 1.83× |
| 100 | apply.replace | 343,960 | 832,170 | 2.42× |
| 100 | apply.duplicate | 813,322 | 719,589 | 0.88× |
| 100 | merge.duplicate | 115,906 | 81,974 | 0.71× |
| 100 | length | 30,727,072 | 31,829,356 | 1.04× |
| 100 | value.random | 9,361,001 | 51,591,993 | 5.51× |
| 100 | values | 513,095 | 520,718 | 1.01× |
| 100 | sequence | 163,728 | 174,849 | 1.07× |

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
